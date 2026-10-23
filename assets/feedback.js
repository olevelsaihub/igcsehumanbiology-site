// Student feedback: a red side "Feedback" tab on every Human Biology page that opens one open text box.
// The page attaches where the student was (plan, block, type, part, story or video and its time),
// so students only describe the problem. Replies come back under "My reports".
// The box opens only from the tab; there is no automatic pop-up.
(() => {
  'use strict';
  if (window.top !== window || window.__humanBiologyFeedback) return;
  window.__humanBiologyFeedback = true;
  const api = '/igcsehumanbiology/teach-me/api.php?action=feedback-';
  const inbox = '/igcsehumanbiology/feedback/';
  let state = null;
  let dialog = null;
  let trigger = 'button';
  let returnFocus = null;
  let lastVideo = null;
  let tab = null;

  const el = (tag, attrs = {}, ...children) => {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) {
      if (key === 'class') node.className = value;
      else if (key === 'text') node.textContent = value;
      else if (value === true) node.setAttribute(key, '');
      else if (value !== false && value != null) node.setAttribute(key, value);
    }
    for (const child of children) if (child != null) node.append(child);
    return node;
  };
  const clip = (text, limit) => String(text || '').replace(/\s+/g, ' ').trim().slice(0, limit);
  const clock = (seconds) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
  const when = (time) => new Date(time * 1000).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

  async function call(action, body) {
    const options = { credentials: 'same-origin', cache: 'no-store' };
    if (body !== undefined) Object.assign(options, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': state.csrf }, body: JSON.stringify(body) });
    const response = await fetch(api + action, options);
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Your message could not be sent. Please try again.');
    return data;
  }

  // Remember the video the student last played or paused; its time is attached to the report.
  for (const name of ['play', 'timeupdate', 'pause', 'seeked']) {
    document.addEventListener(name, (event) => {
      // Players pause their videos while setting up; only a video that has really played counts.
      const video = event.target;
      if (video instanceof HTMLVideoElement && (video.played.length || video.currentTime > 0)) lastVideo = video;
    }, true);
  }

  function learningPlace() {
    try { return (JSON.parse(localStorage.getItem('igcse-human-biology-learning-place-v1') || '{}') || {})[location.pathname] || null; }
    catch (e) { return null; }
  }

  // Read the page as it is right now. Only text already on the page is sent; nothing is guessed.
  function pageContext() {
    const url = new URL(location.href);
    const path = url.pathname;
    const context = { path: (path + url.search + url.hash).slice(0, 300), title: clip(document.querySelector('h1')?.textContent || document.title, 200) };
    const kinds = [[/\/stories\//, 'story'], [/\/video-library\/|\/teach-me\//, 'video'], [/\/labs\//, 'lab'], [/\/poems\//, 'poem'],
      [/\/plans\//, 'plan'], [/\/types\//, 'type'], [/\/questions\//, 'question'], [/\/papers\//, 'paper'], [/^\/igcse\/human-biology\/(index\.html)?$/, 'home']];
    context.kind = (kinds.find(([pattern]) => pattern.test(path)) || [null, 'page'])[1];
    const plan = path.match(/\/plans\/([a-z0-9-]+)\//);
    if (plan) context.plan = clip(document.querySelector('.nav-dropdown summary')?.textContent || plan[1], 80);
    const place = plan ? learningPlace() : null;
    const typeId = url.searchParams.get('type') || place?.typeId || (path.match(/\/types\/(hbi-[a-z0-9-]+)/i) || [])[1];
    if (typeId) context.typeId = clip(typeId.toUpperCase(), 80);
    const blockId = (url.hash || '').slice(1) || place?.blockId;
    if (blockId) {
      const block = document.querySelector(`[data-block-card="${CSS.escape(blockId)}"], [data-block-workspace="${CSS.escape(blockId)}"]`);
      const name = clip(block?.querySelector('h2, h3')?.textContent, 150);
      context.block = name ? `${blockId} · ${name}` : clip(blockId, 200);
    } else if (context.kind === 'story') {
      // Story pages link back to their block: "← Block name · All 294 stories".
      const back = clip(document.querySelector('nav a')?.textContent, 200).replace(/^←\s*/, '');
      if (back && !/^all\b/i.test(back)) context.block = back;
    }
    if (context.typeId) {
      const lesson = document.querySelector(`[data-type-lesson="${CSS.escape(context.typeId)}"]`);
      // Skip the hidden Teach Me video headings ("… · English") inside the lesson.
      const heading = lesson && [...lesson.querySelectorAll('h2, h3')].find((h) => !h.closest('dialog') && h.getClientRects().length);
      const name = heading?.textContent || (context.kind === 'type' || context.kind === 'story' ? document.querySelector('h1')?.textContent : '');
      if (name) context.typeName = clip(name, 200);
    }
    const part = url.searchParams.get('question') || place?.partId;
    if (part) context.part = clip(part, 120);
    if (lastVideo && document.contains(lastVideo) && (lastVideo.played.length || lastVideo.currentTime > 0)) {
      const heading = lastVideo.closest('section, article, dialog')?.querySelector('h2, h3');
      const source = lastVideo.currentSrc || lastVideo.querySelector('source')?.src || '';
      context.media = clip(lastVideo.getAttribute('aria-label') || heading?.textContent || source.split('/').pop().split('?')[0] || 'Video', 200);
      if (lastVideo.currentTime > 0) context.mediaTime = Math.floor(lastVideo.currentTime);
      if (/(^|[\/_.-])(ur|urdu)([\/_.-]|$)/i.test(source + ' ' + path)) context.language = 'ur';
      else if (source) context.language = 'en';
    }
    return context;
  }

  function aboutText(context) {
    const names = { story: 'Story', video: 'Video', lab: 'Lab', poem: 'Study poem', plan: 'Study plan', type: 'Question type', question: 'Question', paper: 'Past paper', home: 'Home page', page: 'Page' };
    const parts = [names[context.kind] || 'Page'];
    if (context.plan) parts.push(context.plan);
    if (context.block) parts.push(`Block: ${context.block.replace(/^[A-Z0-9-]+ · /, '')}`);
    if (context.typeName || context.typeId) parts.push(`Type: ${context.typeName || context.typeId}`);
    else if (context.title && context.kind !== 'plan') parts.push(context.title);
    if (context.part) parts.push(`Question ${context.part.split('-').slice(-2).join(' ')}`);
    if (context.media) parts.push(`${context.media}${context.mediaTime != null ? ` at ${clock(context.mediaTime)}` : ''}`);
    return parts.join(' · ');
  }

  function view(...children) {
    const body = dialog.querySelector('.pfb-body');
    body.replaceChildren(...children);
  }

  function showForm(focus = true) {
    const context = pageContext();
    const box = el('textarea', { id: 'pfb-message', maxlength: '2000', rows: '6', placeholder: 'For example: "The story video for this type stops at 1:35" or "The link in block 4 opens the wrong type."' });
    const count = el('span', { class: 'pfb-count', text: '0 / 2000' });
    const error = el('p', { class: 'pfb-error', role: 'alert', hidden: true });
    const send = el('button', { type: 'submit', class: 'pfb-send', text: 'Send' });
    const form = el('form', { class: 'pfb-form', novalidate: true },
      el('div', { class: 'pfb-about' }, el('strong', { text: 'About this page' }), el('span', { text: aboutText(context) }), el('small', { text: 'Added automatically, so you only need to describe the problem.' })),
      el('label', { for: 'pfb-message', text: 'What did you notice?' }),
      box,
      el('div', { class: 'pfb-meta' }, count),
      error,
      el('div', { class: 'pfb-actions' }, send, el('button', { type: 'button', class: 'pfb-secondary pfb-later', text: 'Not now' })));
    box.addEventListener('input', () => { count.textContent = `${box.value.length} / 2000`; });
    form.querySelector('.pfb-later').addEventListener('click', () => closeDialog());
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (box.value.trim().length < 3) { error.textContent = 'Write what you noticed before sending.'; error.hidden = false; box.focus(); return; }
      error.hidden = true; send.disabled = true; send.textContent = 'Sending…';
      try {
        await call('submit', { message: box.value, context, trigger });
        showThanks();
      } catch (e) {
        error.textContent = e.message; error.hidden = false; send.disabled = false; send.textContent = 'Send';
      }
    });
    view(form);
    setMode('write');
    if (focus) box.focus();
  }

  function showThanks() {
    const done = el('button', { type: 'button', class: 'pfb-send', text: 'Back to studying' });
    const mine = el('button', { type: 'button', class: 'pfb-secondary', text: 'See my reports' });
    view(el('div', { class: 'pfb-thanks' },
      el('p', { class: 'pfb-thanks-title', text: 'Thank you!' }),
      el('p', { text: 'Your message was saved with the page details. We check every report and will reply under My reports.' }),
      el('div', { class: 'pfb-actions' }, done, mine)));
    done.addEventListener('click', () => closeDialog());
    mine.addEventListener('click', () => showMine());
    done.focus();
  }

  async function showMine() {
    setMode('mine');
    view(el('p', { class: 'pfb-muted', text: 'Loading your reports…' }));
    try {
      const data = await call('mine');
      if (!data.reports.length) { view(el('p', { class: 'pfb-muted', text: 'You have not sent any reports yet. Use Write a message to tell us about a problem.' })); return; }
      const list = el('ol', { class: 'pfb-list' });
      for (const report of data.reports) {
        const item = el('li', { class: report.unread ? 'pfb-report pfb-unread' : 'pfb-report' },
          el('div', { class: 'pfb-report-head' }, el('span', { class: `pfb-status pfb-status-${report.status.toLowerCase().replace(/\s+/g, '-')}`, text: report.status }), el('time', { text: when(report.createdAt) })),
          el('p', { class: 'pfb-report-about', text: aboutText(report.context || {}) }),
          el('p', { class: 'pfb-report-text', text: report.message }));
        if (report.reply) item.append(el('div', { class: 'pfb-reply' }, el('strong', { text: 'Reply from olevels.com' }), el('p', { text: report.reply })));
        list.append(item);
      }
      view(list);
      if (data.reports.some((r) => r.unread)) {
        call('seen', {}).then(() => { state.unreadReplies = 0; updateTab(); }).catch(() => {});
      }
    } catch (e) {
      view(el('p', { class: 'pfb-error', text: e.message }));
    }
  }

  function setMode(mode) {
    for (const button of dialog.querySelectorAll('.pfb-switch button')) button.setAttribute('aria-pressed', String(button.dataset.mode === mode));
  }

  function buildDialog() {
    const close = el('button', { type: 'button', class: 'pfb-close', 'aria-label': 'Close feedback', text: '×' });
    const write = el('button', { type: 'button', 'data-mode': 'write', text: 'Write a message' });
    const mine = el('button', { type: 'button', 'data-mode': 'mine', text: 'My reports' });
    const switcher = el('div', { class: 'pfb-switch', role: 'group', 'aria-label': 'Feedback view' }, write, mine);
    if (state.canViewResults) switcher.append(el('a', { class: 'pfb-inbox', href: inbox, text: 'Student feedback inbox' }));
    dialog = el('dialog', { class: 'pfb-dialog', 'aria-labelledby': 'pfb-title' },
      el('div', { class: 'pfb-head' },
        el('div', {},
          el('p', { class: 'pfb-eyebrow', text: 'Human Biology · Feedback' }),
          el('h2', { id: 'pfb-title', text: 'Tell us what needs fixing' }),
          el('p', { class: 'pfb-intro', text: 'Found a mistake, a link that does not work, or something confusing in a story, video or question? Write it here in your own words. We check every message.' })),
        close),
      switcher,
      el('div', { class: 'pfb-body' }));
    document.body.append(dialog);
    close.addEventListener('click', () => closeDialog());
    write.addEventListener('click', () => showForm());
    mine.addEventListener('click', () => showMine());
    dialog.addEventListener('cancel', (event) => { event.preventDefault(); closeDialog(); });
    dialog.addEventListener('click', (event) => { if (event.target === dialog) closeDialog(); });
  }

  function openDialog(source) {
    trigger = source;
    returnFocus = document.activeElement;
    if (!dialog) buildDialog();
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    document.documentElement.classList.add('pfb-open');
    if (state.unreadReplies) showMine(); else showForm();
  }

  function closeDialog() {
    if (!dialog) return;
    if (typeof dialog.close === 'function' && dialog.open) dialog.close();
    else dialog.removeAttribute('open');
    document.documentElement.classList.remove('pfb-open');
    if (returnFocus && returnFocus.focus) returnFocus.focus();
  }

  function updateTab() {
    tab.textContent = 'Feedback';
    tab.classList.toggle('pfb-has-reply', Boolean(state.unreadReplies));
    tab.setAttribute('aria-label', state.unreadReplies ? `Feedback: ${state.unreadReplies} new ${state.unreadReplies === 1 ? 'reply' : 'replies'}` : 'Feedback: tell us what needs fixing');
  }

  function addInboxLink() {
    for (const nav of document.querySelectorAll('.course-nav')) {
      if (nav.querySelector('[data-feedback-inbox]')) continue;
      const link = el('a', { href: inbox, class: 'nav-primary', 'data-feedback-inbox': true, text: 'Student feedback' });
      if (location.pathname.startsWith(inbox)) link.setAttribute('aria-current', 'page');
      nav.append(link);
    }
  }

  async function start() {
    try {
      const response = await fetch(api + 'status', { credentials: 'same-origin', cache: 'no-store' });
      if (!response.ok) return;
      state = await response.json();
    } catch (e) { return; }
    if (!state || typeof state.csrf !== 'string') return;
    document.head.append(el('link', { rel: 'stylesheet', href: '/igcsehumanbiology/assets/feedback.css?v=778832337e' }));
    tab = el('button', { type: 'button', class: 'pfb-tab', 'aria-haspopup': 'dialog' });
    updateTab();
    tab.addEventListener('click', () => openDialog('button'));
    document.body.append(tab);
    if (state.canViewResults) addInboxLink();
    // The box opens only when the student clicks the tab; it never pops up by itself (user decision, 10 Oct 2026).
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
