/* Seek first, then play. Metadata alone does not guarantee a seekable timeline. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory;
  else root.olvCreateChapterPlayer = factory;
})(typeof window === 'undefined' ? this : window, function createChapterPlayer(video, report = () => {}, media = {}) {
  let pending = null, timer = null, transfer = null, completeSource = null;
  const events = ['loadedmetadata', 'loadeddata', 'durationchange', 'progress', 'canplay', 'canplaythrough', 'seeked'];
  const contains = (ranges, time) => {
    for (let i = 0; i < ranges.length; i++) if (ranges.start(i) <= time && ranges.end(i) >= time) return true;
    return false;
  };
  function cancel() {
    pending = null;
    clearTimeout(timer); timer = null;
    transfer?.abort(); transfer = null;
  }
  function loadCompleteMedia(request) {
    const source = video.currentSrc || video.src;
    if (transfer || completeSource || !source || source.startsWith('blob:')) return;
    const controller = new AbortController(); transfer = controller;
    const fetchMedia = media.fetch || fetch;
    fetchMedia(source, {credentials:'same-origin', signal:controller.signal}).then(response => {
      if (!response.ok || !/^video\//i.test(response.headers.get('content-type') || '')) throw new Error('Video unavailable');
      return response.blob();
    }).then(blob => {
      if (pending !== request || controller.signal.aborted || !video.isConnected) return;
      completeSource = media.createObjectURL ? media.createObjectURL(blob) : URL.createObjectURL(blob);
      request.applied = false;
      video.src = completeSource; video.load();
    }).catch(() => {
      if (pending === request && !controller.signal.aborted) { cancel(); report('error', request.time); }
    }).finally(() => { if (transfer === controller) transfer = null; });
  }
  function playSelected(request) {
    if (pending !== request) return;
    cancel();
    if (!request.play) { report('paused', request.time); return; }
    report('ready', request.time);
    const playing = video.play();
    if (playing?.catch) playing.catch(() => {
      if (!pending && !video.seeking && Math.abs(video.currentTime - request.time) < 1) report('paused', request.time);
    });
  }
  function attempt() {
    const request = pending;
    if (!request) return;
    clearTimeout(timer); timer = null;
    if (!video.isConnected) { cancel(); return; }
    if (video.error) { cancel(); report('error', request.time); return; }
    if (Date.now() - request.started > (transfer || completeSource ? 120000 : 30000)) { cancel(); report('timeout', request.time); return; }
    timer = setTimeout(attempt, 200);
    if (video.readyState < 1 || !Number.isFinite(video.duration)) return;
    request.time = Math.min(request.time, Math.max(0, video.duration - 0.05));
    if (video.seeking) return;
    if (request.applied && Math.abs(video.currentTime - request.time) <= 0.35 && video.readyState >= 2) {
      playSelected(request); return;
    }
    if ((request.complete && !completeSource) || (request.time > 0 && !contains(video.seekable, request.time) && !contains(video.buffered, request.time))) {
      // Some browsers keep only the opening seconds even with preload=auto.
      // A complete, authenticated copy gives the paused player a seekable file.
      loadCompleteMedia(request); return;
    }
    // Reapply if the browser discarded an early seek during initial buffering.
    request.applied = true;
    try { video.currentTime = request.time; } catch (_) { request.applied = false; return; }
    if (!video.seeking && video.readyState >= 2 && Math.abs(video.currentTime - request.time) <= 0.35) playSelected(request);
  }
  for (const event of events) video.addEventListener(event, attempt);
  video.addEventListener('error', attempt);
  // The native timeline also needs a seekable file, even when no chapter has
  // been selected. Only fetch a complete copy if ordinary playback lacks one.
  function prepareTimeline() {
    if (pending || video.paused || completeSource || !Number.isFinite(video.duration)) return;
    const end = Math.max(0, video.duration - 0.05);
    if (!contains(video.seekable, end) && !contains(video.buffered, end)) player.seek(video.currentTime, {play:true, complete:true});
  }
  video.addEventListener('play', prepareTimeline);
  video.addEventListener('loadedmetadata', prepareTimeline);
  const player = {
    seek(seconds, options = {}) {
      const time = Number(seconds);
      if (!Number.isFinite(time) || time < 0) return;
      cancel(); video.pause();
      // A metadata-only load may stop after the opening frames. Request media
      // before waiting for a later chapter to become buffered or seekable.
      if (time > 0 && !contains(video.seekable, time) && !contains(video.buffered, time) && video.preload !== 'auto') {
        video.preload = 'auto';
        video.load?.();
      }
      pending = {time, play:options.play !== false, complete:!!options.complete, applied: false, started: Date.now()};
      report('loading', time);
      attempt();
    },
    cancel,
    getPending() { return pending ? {time:pending.time, play:pending.play} : null; },
    dispose() {
      cancel();
      for (const event of events) video.removeEventListener?.(event, attempt);
      video.removeEventListener?.('error', attempt);
      video.removeEventListener?.('play', prepareTimeline);
      video.removeEventListener?.('loadedmetadata', prepareTimeline);
      if (completeSource) { if (media.revokeObjectURL) media.revokeObjectURL(completeSource); else URL.revokeObjectURL(completeSource); completeSource = null; }
    },
  };
  return player;
});

// Standalone lessons use the same controller as the Teach Me dialog.
if (typeof document !== 'undefined') {
  function connectStandaloneChapters() {
    const video = document.getElementById('lesson');
    if (video?.dataset.guidedLesson) return; // Guided lessons bind the same seeker with section checkpoints.
    if (!video || video.dataset.chapterPlayerReady) return;
    video.dataset.chapterPlayerReady = 'true';
    const buttons = [...document.querySelectorAll('[data-time]')];
    const status = document.createElement('p'); status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite'); status.style.minHeight = '1.6em';
    const chapters = document.querySelector('.chapters'); chapters?.before(status);
    const clock = t => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
    const player = window.olvCreateChapterPlayer(video, (state, time) => {
      const stamp = clock(time);
      status.textContent = state === 'loading' ? `Opening ${stamp}…` : state === 'ready' ? `Playing from ${stamp}.` : state === 'paused' ? `Ready at ${stamp}. Press Play.` : 'The video could not open this step yet. Please try again.';
    });
    for (const button of buttons) button.onclick = () => player.seek(button.dataset.time);
    const restart = document.getElementById('restart'); if (restart) restart.onclick = () => player.seek(0);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', connectStandaloneChapters, {once: true});
  else connectStandaloneChapters();
}
