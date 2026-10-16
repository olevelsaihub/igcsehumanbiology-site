/* A checkpoint belongs to the section just heard. Continue and Repeat are explicit. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory;
  else root.olvCreateGuidedController = factory;
})(typeof window === 'undefined' ? this : window, function createGuidedController(video, steps, seeker, report = () => {}) {
  if (!steps.length || steps.some((s, i) => !Number.isFinite(s.start) || !Number.isFinite(s.end) || !Number.isFinite(s.pauseAt) || s.start >= s.pauseAt || s.pauseAt >= s.end || (i && s.start < steps[i - 1].end))) throw new Error('Invalid lesson sections');
  let active = 0, gate = null, timer = null, destroyed = false;
  const at = time => Math.max(0, steps.findLastIndex(s => time >= s.start - 0.02));
  const stopTimer = () => { clearTimeout(timer); timer = null; };
  function check() {
    stopTimer();
    if (destroyed || !video.isConnected || video.paused || video.seeking || gate !== null) return;
    if (video.currentTime >= steps[active].pauseAt) {
      gate = active;
      video.pause();
      // A suspended browser tab may deliver its next tick late. Keep the held picture in this part.
      if (video.currentTime >= steps[active].end) video.currentTime = steps[active].pauseAt;
      report('checkpoint', active);
      return;
    }
    timer = setTimeout(check, Math.max(10, Math.min(80, (steps[active].pauseAt - video.currentTime) * 1000 / (video.playbackRate || 1))));
  }
  function seek(time, options = {}) {
    const value = Number(time);
    if (!Number.isFinite(value) || value < 0 || destroyed) return;
    stopTimer(); gate = null; active = at(value);
    report('section', active);
    seeker.seek(value, options);
  }
  function play() {
    if (gate !== null) { video.pause(); return; }
    active = at(video.currentTime); report('section', active); check();
  }
  function seeking() {
    stopTimer();
    if (gate === null) { active = at(video.currentTime); report('section', active); }
    // Explicit native scrubbing is allowed, just like the chapter buttons.
    if (gate !== null && Math.abs(video.currentTime - steps[gate].pauseAt) > 0.3) {
      gate = null; active = at(video.currentTime); report('section', active);
    }
  }
  function seeked() { if (gate === null) { active = at(video.currentTime); report('section', active); check(); } }
  function ended() {
    stopTimer();
    if (gate === null) { active = steps.length - 1; gate = active; report('checkpoint', active); }
  }
  const listeners = {play, timeupdate:check, pause:stopTimer, seeking, seeked, ratechange:check, ended};
  for (const [name, fn] of Object.entries(listeners)) video.addEventListener(name, fn);
  return {
    seek,
    skip(seconds) {
      const pending = seeker.getPending?.();
      const end = Number.isFinite(video.duration) ? video.duration : steps.at(-1).end;
      seek(Math.max(0, Math.min(end - 0.05, (pending?.time ?? video.currentTime) + seconds)), {play:pending?.play ?? (!video.paused || gate !== null)});
    },
    position() { return seeker.getPending?.()?.time ?? video.currentTime; },
    isPlaying() { return seeker.getPending?.()?.play ?? !video.paused; },
    repeat() { seek(steps[gate ?? active].start); },
    next() { if (gate !== null && gate < steps.length - 1) seek(steps[gate + 1].start); },
    cancel() { stopTimer(); seeker.cancel(); video.pause(); },
    destroy() { destroyed = true; this.cancel(); seeker.dispose?.(); for (const [name, fn] of Object.entries(listeners)) video.removeEventListener(name, fn); },
    getState() { return {active, checkpoint:gate}; },
  };
});

if (typeof document !== 'undefined') {
  window.olvMountGuidedPlayer = function mountGuidedPlayer(video, steps, options = {}) {
    if (video.dataset.guidedMounted) return video.olvGuidedPlayer;
    const make = (tag, text, cls) => { const el = document.createElement(tag); if (text) el.textContent = text; if (cls) el.className = cls; return el; };
    const stage = make('div', '', 'olv-guided-stage'); video.before(stage); stage.append(video);
    const overlay = make('section', '', 'olv-guided-checkpoint'); overlay.hidden = true; overlay.setAttribute('role', 'group');
    const card = make('div', '', 'olv-guided-card');
    const kicker = make('p', 'TAKE YOUR TIME', 'olv-guided-kicker');
    const heading = make('h2'); heading.id = 'olv-checkpoint-' + Math.random().toString(36).slice(2);
    overlay.setAttribute('aria-labelledby', heading.id);
    const message = make('p');
    const next = make('button', '', 'olv-guided-next'), repeat = make('button', '', 'olv-guided-repeat');
    next.type = repeat.type = 'button';
    card.append(kicker, heading, message, next, repeat); overlay.append(card); stage.append(overlay);
    const tools = make('div', '', 'olv-guided-tools');
    const navigation = make('div', '', 'olv-guided-navigation');
    const timeline = make('input', '', 'olv-guided-timeline');
    timeline.type = 'range'; timeline.min = '0'; timeline.max = String(steps.at(-1).end); timeline.step = '0.1'; timeline.value = '0';
    timeline.setAttribute('aria-label', 'Video position');
    const timeLabel = make('span', '', 'olv-guided-time');
    const back = make('button', '↶ 10s'), toggle = make('button', 'Play'), forward = make('button', '10s ↷');
    back.type = toggle.type = forward.type = 'button';
    back.setAttribute('aria-label', 'Back 10 seconds'); forward.setAttribute('aria-label', 'Forward 10 seconds');
    navigation.append(timeline, timeLabel, back, toggle, forward);
    const current = make('span', '', 'olv-guided-current');
    const repeatNow = make('button', 'Repeat this part'); repeatNow.type = 'button';
    tools.append(navigation, current, repeatNow); stage.after(tools);
    const status = options.status || make('p', '', 'olv-guided-status');
    status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite');
    if (!options.status) tools.after(status);
    const stamp = t => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
    const seeker = window.olvCreateChapterPlayer(video, (state, time) => {
      status.textContent = state === 'loading' ? `Opening ${stamp(time)}…` : state === 'ready' ? `Playing from ${stamp(time)}.` : state === 'paused' ? 'Press Play when you are ready.' : 'This part could not load. Please try again.';
    });
    let savedControls = video.controls;
    function report(state, index) {
      const part = steps[index];
      current.textContent = `Part ${index + 1} of ${steps.length} · ${part.title}`;
      repeatNow.setAttribute('aria-label', 'Repeat ' + part.title);
      if (state === 'checkpoint') {
        savedControls = video.controls; video.controls = false;
        stage.classList.add('is-checkpoint'); overlay.hidden = false;
        heading.textContent = `${part.title} complete`;
        const following = steps[index + 1];
        message.textContent = following ? `Is this part clear? Continue to ${following.title} when you are ready, or listen again.` : 'You have finished the lesson. You can repeat this part or watch the lesson again.';
        next.textContent = following ? `Continue to ${following.title}` : 'Watch the lesson again';
        repeat.textContent = `Repeat ${part.title}`;
        status.textContent = 'Paused. Continue, repeat, or move to any point using the timeline.';
        // Native video fullscreen cannot contain an HTML checkpoint. Return to the lesson card.
        if (document.fullscreenElement === video) document.exitFullscreen().catch(() => {});
        if (video.webkitDisplayingFullscreen && video.webkitExitFullscreen) video.webkitExitFullscreen();
        stage.scrollIntoView({block:'center',behavior:'smooth'});
        next.focus({preventScroll:true});
      } else {
        if (!overlay.hidden) video.controls = savedControls;
        overlay.hidden = true; stage.classList.remove('is-checkpoint');
      }
    }
    const controller = window.olvCreateGuidedController(video, steps, seeker, report);
    let scrubbing = false, resumeAfterScrub = false;
    function syncNavigation() {
      const duration = Number.isFinite(video.duration) ? video.duration : steps.at(-1).end;
      timeline.max = String(duration);
      const position = scrubbing ? Number(timeline.value) : controller.position();
      if (!scrubbing) timeline.value = String(position);
      timeLabel.textContent = `${stamp(position)} / ${stamp(duration)}`;
      timeline.setAttribute('aria-valuetext', `${stamp(position)} of ${stamp(duration)}`);
      toggle.textContent = controller.getState().checkpoint !== null ? 'Continue' : controller.isPlaying() ? 'Pause' : 'Play';
    }
    timeline.addEventListener('input', () => {
      if (!scrubbing) { resumeAfterScrub = controller.isPlaying(); scrubbing = true; controller.cancel(); }
      syncNavigation();
    });
    timeline.addEventListener('change', () => {
      const position = Number(timeline.value), play = scrubbing ? resumeAfterScrub : controller.isPlaying();
      scrubbing = false; controller.seek(position, {play}); syncNavigation();
    });
    back.addEventListener('click', () => { controller.skip(-10); syncNavigation(); });
    forward.addEventListener('click', () => { controller.skip(10); syncNavigation(); });
    toggle.addEventListener('click', () => {
      const checkpoint = controller.getState().checkpoint;
      if (checkpoint !== null) { if (checkpoint === steps.length - 1) controller.seek(0); else controller.next(); }
      else if (controller.isPlaying()) controller.cancel();
      else controller.seek(controller.position());
      syncNavigation();
    });
    for (const event of ['timeupdate','loadedmetadata','play','pause','seeking','seeked']) video.addEventListener(event, syncNavigation);
    next.addEventListener('click', () => {
      if (controller.getState().checkpoint === steps.length - 1) controller.seek(0); else controller.next();
      video.focus({preventScroll:true});
    });
    repeat.addEventListener('click', () => { controller.repeat(); video.focus({preventScroll:true}); });
    repeatNow.addEventListener('click', () => controller.repeat());
    for (const button of options.chapterButtons || []) button.onclick = () => controller.seek(button.dataset.time);
    if (options.restart) options.restart.onclick = () => controller.seek(0);
    video.dataset.guidedMounted = 'true'; video.olvGuidedPlayer = controller;
    report('section', 0);
    syncNavigation();
    return controller;
  };
  function init() {
    const video = document.querySelector('#lesson[data-guided-lesson]'), config = document.getElementById('guided-steps');
    if (!video || !config) return;
    window.olvMountGuidedPlayer(video, JSON.parse(config.textContent), {chapterButtons:document.querySelectorAll('[data-time]'),restart:document.getElementById('restart')});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true}); else init();
}
