/* Teach Me: English lessons, plus available narrated language versions. */
(() => {
  'use strict';
  if (window.olvHumanBiologyVideosLoaded) return;
  window.olvHumanBiologyVideosLoaded = true;
  const base = '/igcsehumanbiology/video-library/';
  const style = document.createElement('link');
  style.rel = 'stylesheet'; style.href = base + 'student-videos.css?v=658690019b'; document.head.append(style);
  const chapterPlayerReady = new Promise(resolve => {
    if (window.olvCreateChapterPlayer) { resolve(window.olvCreateChapterPlayer); return; }
    const script = document.createElement('script');
    script.src = base + 'chapter-player.js?v=658690019b';
    script.onload = () => resolve(window.olvCreateChapterPlayer);
    script.onerror = () => resolve(null);
    document.head.append(script);
  });
  const mounted = new WeakSet();
  let guidedAssets;
  function loadGuidedPlayer() {
    guidedAssets ||= chapterPlayerReady.then(() => new Promise(resolve => {
      if (window.olvMountGuidedPlayer) { resolve(window.olvMountGuidedPlayer); return; }
      const css = document.createElement('link'); css.rel = 'stylesheet'; css.href = base + 'guided-player.css?v=658690019b'; document.head.append(css);
      const script = document.createElement('script'); script.src = base + 'guided-player.js?v=658690019b';
      script.onload = () => resolve(window.olvMountGuidedPlayer); script.onerror = () => resolve(null); document.head.append(script);
    }));
    return guidedAssets;
  }
  let catalogue, serial = 0;
  const clock = seconds => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
  function node(tag, text, className) {
    const item = document.createElement(tag);
    if (text !== undefined) item.textContent = text;
    if (className) item.className = className;
    return item;
  }
  function lessons() {
    catalogue ||= fetch(base + 'index.json', {credentials: 'same-origin', cache: 'no-store'}).then(response => {
      if (!response.ok) throw new Error('Lessons unavailable');
      return response.json();
    }).catch(error => { catalogue = undefined; throw error; });
    return catalogue;
  }
  function mount(root) {
    if (mounted.has(root)) return;
    mounted.add(root);
    const id = root.dataset.typeLesson || root.dataset.methodCard;
    if (!/^HBI-[A-Z0-9-]+$/.test(id || '')) return;
    // The direct lesson link stays useful even if the catalogue cannot load.
    const page = base + 'english/' + id.toLowerCase() + '/index.html';
    const entry = node('aside', undefined, 'human-biology-teach-me-entry');
    entry.dataset.englishVideo = id;
    const primary = node('a', undefined, 'human-biology-teach-me-action'); primary.href = page;
    const icon = node('span', '▶', 'human-biology-teach-me-icon'); icon.setAttribute('aria-hidden', 'true');
    const wording = node('span', undefined, 'human-biology-teach-me-wording');
    wording.append(node('strong', 'Teach Me', 'human-biology-video-title'), node('span', 'Watch this type explained, step by step.', 'human-biology-teach-me-description'));
    const duration = node('span', 'English video', 'human-biology-video-duration');
    primary.append(icon, wording, duration); entry.append(primary);
    if (root.matches('[data-type-lesson]')) root.prepend(entry); else root.before(entry);
    const launchers = [primary];
    const practice = root.querySelector('#practice');
    if (practice) {
      const shortcut = node('a', '▶  Teach Me', 'human-biology-teach-me-practice'); shortcut.href = page;
      shortcut.setAttribute('aria-label', 'Teach Me: watch the video for this question type');
      practice.prepend(shortcut); launchers.push(shortcut);
    }
    const preparedLanguages = new Set();
    function prepare(lesson, language = 'English', lessonLaunchers = launchers, badge = duration) {
      if (preparedLanguages.has(language) || !entry.isConnected) return;
      preparedLanguages.add(language);
      badge.textContent = `${language} · ${clock(lesson.duration)}`;
      for (const launcher of lessonLaunchers) {
        launcher.href = base + lesson.page;
        launcher.setAttribute('aria-label', `Teach Me in ${language}: ${lesson.title}`);
        launcher.setAttribute('aria-haspopup', 'dialog');
      }
      const dialog = node('dialog', undefined, 'human-biology-video-dialog');
      dialog.dataset.videoType = id;
      dialog.dataset.videoLanguage = lesson.language || 'en';
      dialog.id = 'human-biology-teach-me-dialog-' + (++serial);
      const heading = node('h2', lesson.title + ' · ' + language); heading.id = dialog.id + '-title';
      dialog.setAttribute('aria-labelledby', heading.id);
      const header = node('div', undefined, 'human-biology-video-header');
      const close = node('button', 'Close video', 'human-biology-video-close'); close.type = 'button';
      close.addEventListener('click', () => dialog.close());
      header.append(heading, close); dialog.append(header);
      const body = node('div', undefined, 'human-biology-video-body');
      body.append(node('p', lesson.guidedSteps ? 'Learn one part at a time. The video pauses after each part. Continue when you are ready, or repeat it.' : 'Start with the idea, follow the worked example, then try a short question yourself.'));
      const video = node('video'); video.controls = true; video.playsInline = true; video.preload = 'none';
      video.setAttribute('aria-label', lesson.title + ', ' + language + ' explanation'); video.poster = base + lesson.poster;
      const track = node('track'); track.kind = language === 'English' ? 'captions' : 'subtitles'; track.srclang = 'en'; track.label = 'English'; track.src = base + lesson.captions;
      video.append(track); body.append(video);
      const controls = node('div', undefined, 'human-biology-video-controls');
      const speedLabel = node('label', 'Playback speed '), speed = node('select'); speed.setAttribute('aria-label', 'Playback speed');
      for (const rate of [0.85, 1, 1.15]) { const option = node('option', rate + '×'); option.value = rate; option.selected = rate === 1; speed.append(option); }
      speed.addEventListener('change', () => { video.playbackRate = Number(speed.value); });
      speedLabel.append(speed); controls.append(speedLabel);
      const full = node('a', 'Open full lesson'); full.href = base + lesson.page; controls.append(full);
      const browse = node('a', 'All video lessons'); browse.href = base; controls.append(browse); body.append(controls);
      const chapters = node('div', undefined, 'human-biology-video-chapters'); chapters.setAttribute('aria-label', 'Lesson chapters');
      const ensureSource = () => { if (!video.src) { video.src = base + lesson.video; video.load(); } };
      const seekStatus = node('p', '', 'human-biology-video-seek-status');
      seekStatus.setAttribute('role', 'status'); seekStatus.setAttribute('aria-live', 'polite');
      let chapterPlayer, guidedPlayer, guidedMount, selection = 0;
      const ensureGuided = () => {
        if (!lesson.guidedSteps) return Promise.resolve(null);
        guidedMount ||= loadGuidedPlayer().then(mount => {
          if (!mount || !dialog.isConnected) return null;
          guidedPlayer = mount(video, lesson.guidedSteps, {status:seekStatus});
          return guidedPlayer;
        });
        return guidedMount;
      };
      const requestChapter = async seconds => {
        const request = ++selection;
        video.pause();
        seekStatus.textContent = `Opening ${clock(seconds)}…`;
        if (lesson.guidedSteps) {
          const guided = await ensureGuided();
          if (request !== selection || !dialog.open || !dialog.isConnected) return;
          if (!guided) { seekStatus.textContent = 'Please use Open full lesson to open this part.'; return; }
          ensureSource(); guided.seek(seconds); return;
        }
        const createPlayer = await chapterPlayerReady;
        if (request !== selection || !dialog.open || !dialog.isConnected) return;
        if (!createPlayer) { seekStatus.textContent = 'Please use Open full lesson to jump to a step.'; return; }
        chapterPlayer ||= createPlayer(video, (state, time) => {
          const stamp = clock(time);
          seekStatus.textContent = state === 'loading' ? `Opening ${stamp}…` : state === 'ready' ? `Playing from ${stamp}.` : state === 'paused' ? `Ready at ${stamp}. Press Play.` : 'The video could not open this step yet. Please try again.';
        });
        ensureSource(); chapterPlayer.seek(seconds);
      };
      for (const chapter of lesson.chapters) {
        const button = node('button', clock(chapter.start) + ' · ' + chapter.title); button.type = 'button';
        button.addEventListener('click', () => requestChapter(chapter.start));
        chapters.append(button);
      }
      body.append(seekStatus);
      body.append(chapters);
      const transcript = node('details', undefined, 'human-biology-video-transcript'); transcript.append(node('summary', lesson.transcriptLabel || 'Read the narration'));
      transcript.addEventListener('toggle', async () => {
        if (!transcript.open || transcript.dataset.loaded) return;
        const textBox = node('div'); transcript.append(textBox); transcript.dataset.loaded = 'true';
        try {
          const response = await fetch(base + lesson.transcript, {credentials: 'same-origin'});
          if (!response.ok) throw new Error('Transcript unavailable');
          const text = await response.text();
          if (text.trim().startsWith('<')) throw new Error('Transcript unavailable');
          for (const part of text.trim().split(/\n\s*\n/)) textBox.append(node('p', part));
        } catch (_) { textBox.textContent = 'Please use the full lesson link to read the narration.'; }
      }); body.append(transcript); dialog.append(body); entry.append(dialog);
      let opener;
      dialog.addEventListener('close', () => { selection++; chapterPlayer?.cancel(); guidedPlayer?.cancel(); video.pause(); seekStatus.textContent = ''; opener?.focus({preventScroll: true}); });
      dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
      for (const launcher of lessonLaunchers) launcher.addEventListener('click', async event => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0 || !dialog.showModal) return;
        event.preventDefault(); opener = launcher;
        document.querySelectorAll('.human-biology-video-dialog[open]').forEach(other => { if (other !== dialog) other.close(); });
        dialog.showModal(); ensureSource();
        if (lesson.guidedSteps) {
          const request = ++selection, guided = await ensureGuided();
          if (request !== selection || !dialog.open) return;
          if (!guided) { seekStatus.textContent = 'Please use Open full lesson to open this part.'; return; }
          if (guided.getState().checkpoint !== null) return;
        }
        video.play().catch(() => {});
      });
    }
    lessons().then(data => {
      const lesson = data.lessons[id];
      if (!lesson) { for (const launcher of launchers) (launcher === primary ? entry : launcher).remove(); return; }   // no video for this type yet
      prepare(lesson);
      const urdu = lesson.variants?.ur;
      if (!urdu) return;
      const urduLink = node('a', undefined, 'human-biology-teach-me-action human-biology-teach-me-action-urdu');
      urduLink.href = base + urdu.page;
      const urduIcon = node('span', '▶', 'human-biology-teach-me-icon'); urduIcon.setAttribute('aria-hidden', 'true');
      const urduWording = node('span', undefined, 'human-biology-teach-me-wording');
      urduWording.append(node('strong', 'Teach Me in Urdu', 'human-biology-video-title'), node('span', 'Urdu explanation with English human biology terms.', 'human-biology-teach-me-description'));
      const urduDuration = node('span', 'Urdu video', 'human-biology-video-duration');
      urduLink.append(urduIcon, urduWording, urduDuration); primary.after(urduLink);
      const urduLaunchers = [urduLink];
      if (practice) {
        const shortcut = node('a', '▶  Teach Me in Urdu', 'human-biology-teach-me-practice human-biology-teach-me-practice-urdu');
        shortcut.href = base + urdu.page; launchers[1].after(shortcut); urduLaunchers.push(shortcut);
      }
      prepare(urdu, 'Urdu', urduLaunchers, urduDuration);
    }).catch(() => {});
  }
  function initialise(root = document) {
    const types = [...root.querySelectorAll('[data-type-lesson]')];
    if (root.matches?.('[data-type-lesson]')) types.unshift(root);
    for (const type of types) mount(type);
    // Older standalone method pages use the same canonical IDs.
    for (const card of root.querySelectorAll('[data-method-card]')) if (!card.closest('[data-type-lesson]')) mount(card);
  }
  document.addEventListener('human-biology:content-ready', event => initialise(event.detail?.root || document));
  initialise();
})();
