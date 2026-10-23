// Progressive enhancement: all approved records remain in the HTML without JavaScript.
for (const root of document.querySelectorAll('[data-bank-browser]')) {
  const rows = [...root.querySelectorAll('[data-bank-row]')];
  const search = root.querySelector('[data-bank-search]');
  const filters = [...root.querySelectorAll('[data-filter-key]')];
  const status = root.querySelector('[data-bank-status]');
  const previous = root.querySelector('[data-bank-prev]');
  const next = root.querySelector('[data-bank-next]');
  const pageLabel = root.querySelector('[data-bank-page]');
  const size = Number(root.dataset.pageSize) || 24;
  let page = 0;
  const params = new URLSearchParams(location.search);
  search.value = params.get('q') || '';
  for (const filter of filters) {
    const value = params.get(filter.dataset.filterKey);
    if ([...filter.options].some(o => o.value === value)) filter.value = value;
  }
  function render(updateURL = false) {
    const terms = search.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const matching = rows.filter(row => terms.every(term => row.dataset.search.toLowerCase().includes(term)) && filters.every(filter => !filter.value || row.dataset[filter.dataset.filterKey] === filter.value));
    const pages = Math.max(1, Math.ceil(matching.length / size));
    page = Math.min(page, pages - 1);
    for (const row of rows) row.hidden = true;
    for (const row of matching.slice(page * size, (page + 1) * size)) row.hidden = false;
    status.textContent = `${matching.length.toLocaleString()} matching ${matching.length === 1 ? 'entry' : 'entries'} of ${rows.length.toLocaleString()}`;
    root.querySelector('[data-bank-empty]').hidden = matching.length > 0;
    previous.disabled = page === 0;
    next.disabled = page + 1 >= pages;
    pageLabel.textContent = `Page ${page + 1} of ${pages}`;
    if (updateURL) {
      const query = new URLSearchParams();
      if (search.value.trim()) query.set('q', search.value.trim());
      for (const filter of filters) if (filter.value) query.set(filter.dataset.filterKey, filter.value);
      history.replaceState(null, '', location.pathname + (query.size ? '?' + query : '') + location.hash);
    }
  }
  search.addEventListener('input', () => { page = 0; render(true); });
  for (const filter of filters) filter.addEventListener('change', () => { page = 0; render(true); });
  root.querySelector('[data-reset-filters]').addEventListener('click', () => { search.value = ''; for (const f of filters) f.value = ''; page = 0; render(true); });
  previous.addEventListener('click', () => { page = Math.max(0, page - 1); render(); root.scrollIntoView({block: 'start'}); });
  next.addEventListener('click', () => { page++; render(); root.scrollIntoView({block: 'start'}); });
  render();
}

const completionKey = 'igcsehumanbiology-completed-types-v1';
const learningPlaceKey = 'igcsehumanbiology-learning-place-v1';
let completedTypes = new Set();
try { completedTypes = new Set(JSON.parse(localStorage.getItem(completionKey) || '[]')); } catch { completedTypes = new Set(); }
function planPath() { return location.pathname.replace(/index\.html$/, ''); }
function readLearningPlaces() {
  try { return JSON.parse(localStorage.getItem(learningPlaceKey) || '{}') || {}; } catch { return {}; }
}
function renderLearningResume() {
  const progress = document.querySelector('[data-plan-progress]');
  const resume = progress?.querySelector('[data-resume-learning]');
  if (!resume) return;
  const place = readLearningPlaces()[planPath()];
  const link = place?.typeId && document.querySelector(`[data-block-workspace="${CSS.escape(place.blockId || '')}"] [data-workspace-type="${CSS.escape(place.typeId)}"]`);
  if (!link) { resume.hidden = true; return; }
  const url = new URL(planPath(), location.origin);
  url.searchParams.set('type', place.typeId);
  if (place.partId) url.searchParams.set('question', place.partId);
  url.hash = place.blockId;
  resume.querySelector('[data-resume-link]').href = url.pathname + url.search + url.hash;
  resume.querySelector('[data-resume-place]').textContent = `${link.querySelector('strong')?.textContent || place.typeId}${place.questionNumber ? ` · practice question ${place.questionNumber}` : ''}`;
  resume.hidden = false;
}
function saveLearningPlace(place) {
  if (!document.querySelector('[data-plan-progress]')) return;
  const places = readLearningPlaces();
  const previous = places[planPath()];
  places[planPath()] = previous?.typeId === place.typeId ? {...previous, ...place} : place;
  try { localStorage.setItem(learningPlaceKey, JSON.stringify(places)); } catch { /* The lesson remains usable. */ }
  renderLearningResume();
}
function clearLearningPlace() {
  const places = readLearningPlaces();
  delete places[planPath()];
  try { localStorage.setItem(learningPlaceKey, JSON.stringify(places)); } catch { /* The lesson remains usable. */ }
  renderLearningResume();
}

function saveCompletedTypes() {
  try { localStorage.setItem(completionKey, JSON.stringify([...completedTypes].sort())); } catch { /* Progress remains available for this page. */ }
}

// The manual button unlocks only after real practice (owner, 15 Oct 2026): the worked example and
// at least 5 practice questions (or all of them, if fewer) must have been checked. Staff are never locked.
const MANUAL_MIN_PRACTICE = 5;
let isStaff = false;
function practiceAttempts(box) {
  const lesson = box.closest('[data-type-lesson]') || document;
  const results = readJSON(resultsKey, {});
  const checked = part => { const r = results[part]; return !!r && !!r.status && r.status !== 'draft'; };
  const worked = [...lesson.querySelectorAll('[data-answer-checker]')].find(c => !c.closest('[data-practice-card]'));
  const practice = [...lesson.querySelectorAll('[data-practice-card]')].map(card => card.dataset.practiceCard);
  const need = Math.min(MANUAL_MIN_PRACTICE, practice.length);
  const done = practice.filter(checked).length;
  const workedDone = !worked || checked(worked.dataset.partId);
  return { ok: workedDone && done >= need, workedDone, done: Math.min(done, need), need, hasWorked: !!worked };
}
function updateLearningProgress() {
  for (const box of document.querySelectorAll('[data-type-completion]')) {
    const id = box.dataset.typeCompletion;
    const done = completedTypes.has(id);
    box.classList.toggle('is-complete', done);
    const button = box.querySelector('[data-toggle-completion]');
    if (button) {
      button.setAttribute('aria-pressed', String(done));
      button.textContent = done ? 'Completed ✓' : 'Mark type complete';
      const note = box.querySelector('p');
      if (note && !note.dataset.original) note.dataset.original = note.textContent;
      const a = practiceAttempts(box);
      const locked = !done && !isStaff && !a.ok;
      button.disabled = locked;
      button.title = locked ? 'Practise first to unlock this button' : '';
      if (note && !note.dataset.auto) {
        note.textContent = locked
          ? `Practise first: check ${a.hasWorked ? 'the worked example and ' : ''}${a.need} practice question${a.need === 1 ? '' : 's'} to unlock this button (${a.hasWorked ? (a.workedDone ? 'worked example done, ' : 'worked example not yet, ') : ''}${a.done} of ${a.need} practice questions checked).`
          : note.dataset.original;
      }
    }
  }
  for (const card of document.querySelectorAll('[data-block-card]')) {
    const ids = [...card.querySelectorAll('[data-workspace-type]')].map(link => link.dataset.workspaceType);
    const count = ids.filter(id => completedTypes.has(id)).length;
    const output = card.querySelector('[data-block-complete]');
    if (output) output.textContent = String(count);
  }
  for (const plan of document.querySelectorAll('[data-plan-progress]')) {
    const root = plan.parentElement;
    const ids = [...new Set([...root.querySelectorAll('[data-block-card] [data-workspace-type]')].map(link => link.dataset.workspaceType))];
    const count = ids.filter(id => completedTypes.has(id)).length;
    const output = plan.querySelector('[data-plan-complete]');
    const bar = plan.querySelector('[data-plan-progress-bar]');
    if (output) output.textContent = String(count);
    if (bar) bar.style.width = `${ids.length ? count / ids.length * 100 : 0}%`;
  }
}

// A type completes itself once at least 75% of its computer-marked practice questions are answered correctly (owner, 15 Oct 2026).
// Drawing and graph questions are marked by the student, so they are left out of the count.
// The manual button stays; a type the student un-ticks is not re-ticked automatically.
const resultsKey = 'igcsehumanbiology-practice-results-v1';
const autoCompletionKey = 'igcsehumanbiology-auto-completed-types-v1';
const completionOwnerKey = 'igcsehumanbiology-completed-types-owner-v1';
function readJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; }
}
function writeJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* This page still shows the change. */ }
}

// Completion is also saved on the server for the signed-in account, so it follows the student to any browser
// and teachers see it on the Students' Progress page. If the server cannot be reached, this browser's list still works.
const progressAPI = '/igcsehumanbiology/teach-me/api.php?action=progress-';
let progressToken = null;
let completionReady = false;
let selfMarkedParts = null;
const queuedTypeChanges = new Map();
function sendTypeChanges(changes) {
  if (!changes.length) return;
  if (!progressToken) { for (const change of changes) queuedTypeChanges.set(change.id, change); return; }
  fetch(progressAPI + 'types', {method: 'POST', credentials: 'same-origin', keepalive: true,
    headers: {'Content-Type': 'application/json', 'X-CSRF-Token': progressToken}, body: JSON.stringify({changes})}).catch(() => {});
}
function syncCompletedTypes() {
  return Promise.resolve(null).then(session => {   // open access: no account, completion stays on this device
    if (!session?.csrf) return;
    progressToken = session.csrf;
    isStaff = session.staff === true;
    const saved = session.types && typeof session.types === 'object' ? session.types : {};
    const autoDone = new Set(readJSON(autoCompletionKey, []));
    const owner = readJSON(completionOwnerKey, null);
    const sameAccount = owner === session.who;
    const firstSync = !owner;
    // Another account's list on a shared computer is replaced, not copied to this account.
    // The other account's saved answer results are cleared too, so they cannot tick types for this account.
    if (!sameAccount && !firstSync) {
      completedTypes = new Set(); autoDone.clear();
      try { localStorage.removeItem(resultsKey); } catch { /* Nothing saved to clear. */ }
    }
    for (const [id, saved_] of Object.entries(saved)) {
      if (saved_?.done) completedTypes.add(id); else completedTypes.delete(id);
      autoDone.add(id);
    }
    const fromDevice = (sameAccount || firstSync) ? [...completedTypes].filter(id => !saved[id]).map(id => ({id, done: true, how: 'device'})) : [];
    for (const change of queuedTypeChanges.values()) { if (change.done) completedTypes.add(change.id); else completedTypes.delete(change.id); autoDone.add(change.id); }
    const queued = [...queuedTypeChanges.values()];
    queuedTypeChanges.clear();
    writeJSON(completionOwnerKey, session.who);
    saveCompletedTypes();
    writeJSON(autoCompletionKey, [...autoDone].sort());
    updateLearningProgress();
    sendTypeChanges([...fromDevice, ...queued]);
  }).catch(() => {});
}
function loadSelfMarkedParts() {
  return fetch('/igcsehumanbiology/assets/self-marked-parts.json', {credentials: 'same-origin'}).then(r => r.ok ? r.json() : [])
    .then(list => { selfMarkedParts = new Set(Array.isArray(list) ? list : []); }, () => { selfMarkedParts = new Set(); });
}
function autoCompleteTypes(scope = document) {
  if (!completionReady) return;
  const results = readJSON(resultsKey, {});
  const autoDone = new Set(readJSON(autoCompletionKey, []));
  let changed = false;
  for (const lesson of scope.querySelectorAll('[data-type-lesson]')) {
    const id = lesson.dataset.typeLesson;
    const parts = [...lesson.querySelectorAll('[data-practice-card]')].map(card => card.dataset.practiceCard).filter(part => !selfMarkedParts.has(part));
    if (!parts.length || completedTypes.has(id) || autoDone.has(id)) continue;
    const correct = parts.filter(part => results[part]?.status === 'secure').length;
    if (correct * 4 < parts.length * 3) continue;
    completedTypes.add(id);
    autoDone.add(id);
    changed = true;
    sendTypeChanges([{id, done: true, how: 'auto', correct, total: parts.length}]);
    const box = lesson.querySelector(`[data-type-completion="${CSS.escape(id)}"]`);
    const note = box?.querySelector('p');
    if (note) note.dataset.auto = '1';
    if (note) note.textContent = `Marked complete automatically: you answered ${correct} of ${parts.length} computer-marked practice questions correctly. You can still change it with the button.`;
  }
  if (changed) {
    saveCompletedTypes();
    writeJSON(autoCompletionKey, [...autoDone].sort());
  }
  updateLearningProgress();
}
new MutationObserver(records => {
  const lessons = new Set(records.map(record => record.target.closest?.('[data-type-lesson]')).filter(Boolean));
  for (const lesson of lessons) autoCompleteTypes(lesson.parentElement || document);
}).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['data-feedback-kind', 'hidden'] });
document.addEventListener('olv:content-ready', event => autoCompleteTypes(event.detail?.root || document));
// Drawing questions save their marks without the answer-feedback change above, so refresh after their buttons too.
document.addEventListener('click', event => {
  if (event.target.closest('.db-save, .db-auto .db-finish')) setTimeout(() => { if (completionReady) autoCompleteTypes(); else updateLearningProgress(); }, 60);
});

function showPracticeCard(runner, requestedIndex, scroll = false) {
  const cards = [...runner.querySelectorAll('[data-practice-card]')];
  if (!cards.length) return;
  const index = Math.max(0, Math.min(Number(requestedIndex) || 0, cards.length - 1));
  cards.forEach((card, cardIndex) => { card.hidden = cardIndex !== index; });
  for (const button of runner.querySelectorAll('[data-practice-jump]')) {
    const active = Number(button.dataset.practiceJump) === index;
    button.setAttribute('aria-selected', String(active));
    button.classList.toggle('is-active', active);
  }
  const card = cards[index];
  const previous = card.querySelector('[data-practice-previous]');
  const next = card.querySelector('[data-practice-next]');
  if (previous) previous.disabled = index === 0;
  if (next) {
    next.disabled = index === cards.length - 1;
    next.textContent = index === cards.length - 1 ? 'Last question' : 'Next question';
  }
  runner.dataset.practiceIndex = String(index);
  if (scroll) {
    const block = runner.closest('[data-block-workspace]');
    const lesson = runner.closest('[data-type-lesson]');
    if (block && lesson) saveLearningPlace({blockId: block.dataset.blockWorkspace, typeId: lesson.dataset.typeLesson, partId: card.dataset.practiceCard, questionNumber: index + 1});
  }
  if (scroll) card.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}

function initializePracticeRunners(scope = document, requestedPartId = null) {
  for (const runner of scope.querySelectorAll('[data-practice-runner]:not([data-practice-runner-ready])')) {
    runner.dataset.practiceRunnerReady = 'true';
    const index = [...runner.querySelectorAll('[data-practice-card]')].findIndex(card => card.dataset.practiceCard === requestedPartId);
    showPracticeCard(runner, index < 0 ? 0 : index);
  }
}

async function loadWorkspaceType(workspace, link) {
  const panel = workspace.querySelector('[data-workspace-panel]');
  if (!panel) return;
  const requestedType = link.dataset.workspaceType;
  if (link.classList.contains('is-active') && panel.querySelector('[data-type-lesson]')?.dataset.typeLesson === requestedType) return;
  const requestId = (workspace.lessonRequestId || 0) + 1;
  workspace.lessonRequestId = requestId;
  for (const item of workspace.querySelectorAll('[data-workspace-type]')) item.classList.toggle('is-active', item === link);
  panel.innerHTML = '<p class="workspace-loading" role="status">Opening the complete lesson…</p>';
  try {
    const response = await fetch(link.href, { credentials: 'same-origin', headers: { 'X-Requested-With': 'OlvWorkspace' } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const documentCopy = new DOMParser().parseFromString(await response.text(), 'text/html');
    if (workspace.lessonRequestId !== requestId) return;
    const lesson = documentCopy.querySelector('[data-type-lesson]');
    if (!lesson) throw new Error('Lesson content was not found.');
    panel.replaceChildren(document.importNode(lesson, true));
    { const r = documentCopy.getElementById('olv-rules');   // kept with the lesson for olv-marking-adapter.js
      if (r) { const s = document.createElement('script'); s.type = 'application/json'; s.dataset.olvRules = '';
               s.textContent = r.textContent; panel.append(s); } }
    panel.scrollTop = 0;
    updateLearningProgress();
    const place = readLearningPlaces()[planPath()];
    const requestedPartId = new URLSearchParams(location.search).get('type') === requestedType ? new URLSearchParams(location.search).get('question') : null;
    const partId = requestedPartId || (place?.typeId === requestedType ? place.partId : null);
    initializePracticeRunners(panel, partId);
    const block = workspace.closest('[data-block-workspace]');
    if (block) {
      const cards = [...panel.querySelectorAll('[data-practice-card]')];
      const number = partId ? cards.findIndex(card => card.dataset.practiceCard === partId) + 1 : 0;
      saveLearningPlace({blockId: block.dataset.blockWorkspace, typeId: requestedType, partId: number ? partId : null, questionNumber: number || null});
    }
    document.dispatchEvent(new CustomEvent('olv:content-ready', { detail: { root: panel } }));
    const url = new URL(location.href);
    if (url.searchParams.get('type') !== requestedType) url.searchParams.delete('question');
    url.searchParams.set('type', link.dataset.workspaceType);
    history.replaceState(null, '', url.pathname + '?' + url.searchParams + location.hash);
  } catch (error) {
    if (workspace.lessonRequestId !== requestId) return;
    panel.innerHTML = `<div class="workspace-error"><h2>This lesson could not open here</h2><p>You can still use its full page.</p><p><a class="button" href="${link.href}">Open full lesson</a></p></div>`;
  }
}

function prepareWorkspace(workspace, loadInitial = false) {
  const links = [...workspace.querySelectorAll('[data-workspace-type]')];
  const search = workspace.querySelector('[data-workspace-search]');
  const topic = workspace.querySelector('[data-workspace-topic]');
  const count = workspace.querySelector('[data-workspace-count]');
  function filter() {
    const terms = (search?.value || '').toLowerCase().trim().split(/\s+/).filter(Boolean);
    let visible = 0;
    for (const link of links) {
      const show = terms.every(term => link.dataset.search.toLowerCase().includes(term)) && (!topic?.value || link.dataset.topic === topic.value);
      link.hidden = !show;
      if (show) visible++;
    }
    if (count) count.textContent = `${visible} ${visible === 1 ? 'type' : 'types'}`;
  }
  search?.addEventListener('input', filter);
  topic?.addEventListener('change', filter);
  workspace.addEventListener('click', event => {
    const link = event.target.closest('[data-workspace-type]');
    if (!link || !workspace.contains(link)) return;
    event.preventDefault();
    loadWorkspaceType(workspace, link);
  });
  filter();
  if (loadInitial) {
    const requested = new URLSearchParams(location.search).get('type');
    const initial = links.find(link => link.dataset.workspaceType === requested) || links.find(link => link.dataset.workspaceType === workspace.dataset.initialType) || links[0];
    if (initial) loadWorkspaceType(workspace, initial);
  }
}

for (const workspace of document.querySelectorAll('[data-type-workspace]')) {
  const insideBlock = Boolean(workspace.closest('[data-block-workspace]'));
  if (!insideBlock) workspace.dataset.standalone = '';
  prepareWorkspace(workspace, !insideBlock && !workspace.closest('[data-course-view][hidden]'));
}
document.addEventListener('olv:course-view', event => {
  if (event.detail.view !== 'types') return;
  const workspace = document.querySelector('[data-course-view="types"] [data-type-workspace]');
  if (!workspace || workspace.querySelector('[data-workspace-panel] [data-type-lesson]')) return;
  const requested = new URLSearchParams(location.search).get('type');
  const link = workspace.querySelector(`[data-workspace-type="${CSS.escape(requested || workspace.dataset.initialType)}"]`) || workspace.querySelector('[data-workspace-type]');
  if (link) loadWorkspaceType(workspace, link);
});

document.addEventListener('click', event => {
  const practiceControl = event.target.closest('[data-practice-jump],[data-practice-previous],[data-practice-next]');
  if (practiceControl) {
    const runner = practiceControl.closest('[data-practice-runner]');
    if (!runner) return;
    const current = Number(runner.dataset.practiceIndex || 0);
    const target = practiceControl.matches('[data-practice-jump]') ? Number(practiceControl.dataset.practiceJump) : current + (practiceControl.matches('[data-practice-next]') ? 1 : -1);
    showPracticeCard(runner, target, true);
    return;
  }
  const completion = event.target.closest('[data-toggle-completion]');
  if (completion) {
    if (completion.disabled) return;
    const id = completion.dataset.toggleCompletion;
    if (completedTypes.has(id)) completedTypes.delete(id); else completedTypes.add(id);
    saveCompletedTypes();
    const autoDone = new Set(readJSON(autoCompletionKey, []));
    if (!autoDone.has(id)) { autoDone.add(id); writeJSON(autoCompletionKey, [...autoDone].sort()); }
    sendTypeChanges([{id, done: completedTypes.has(id), how: 'manual'}]);
    updateLearningProgress();
    const ordered = [...document.querySelectorAll('[data-block-card] [data-workspace-type]')];
    const at = ordered.findIndex(link => link.dataset.workspaceType === id);
    if (completedTypes.has(id) && at >= 0) {
      const next = [...ordered.slice(at + 1), ...ordered.slice(0, at)].find(link => !completedTypes.has(link.dataset.workspaceType));
      if (next) saveLearningPlace({blockId: next.closest('[data-block-card]').dataset.blockCard, typeId: next.dataset.workspaceType, partId: null, questionNumber: null});
      else clearLearningPlace();
    } else {
      const block = completion.closest('[data-block-workspace]');
      if (block) saveLearningPlace({blockId: block.dataset.blockWorkspace, typeId: id, partId: null, questionNumber: null});
    }
    return;
  }
  const compactType = event.target.closest('[data-block-card] [data-workspace-type]');
  if (compactType && !compactType.closest('[data-type-workspace]')) {
    const card = compactType.closest('[data-block-card]');
    const target = document.querySelector(`[data-block-workspace="${CSS.escape(card.dataset.blockCard)}"]`);
    if (target) {
      event.preventDefault();
      for (const block of document.querySelectorAll('[data-block-workspace]')) block.hidden = block !== target;
      const grid = document.querySelector('[data-block-grid]');
      if (grid) grid.hidden = true;
      target.hidden = false;
      const selected = target.querySelector(`[data-workspace-type="${CSS.escape(compactType.dataset.workspaceType)}"]`);
      if (selected) loadWorkspaceType(target.querySelector('[data-type-workspace]'), selected);
      target.scrollIntoView({ block: 'start' });
      return;
    }
  }
  const opener = event.target.closest('[data-open-block]');
  if (opener) {
    const target = document.querySelector(`[data-block-workspace="${CSS.escape(opener.dataset.openBlock)}"]`);
    if (!target) return;
    event.preventDefault();
    for (const workspace of document.querySelectorAll('[data-block-workspace]')) workspace.hidden = workspace !== target;
    const grid = document.querySelector('[data-block-grid]');
    if (grid) grid.hidden = true;
    target.hidden = false;
    const workspace = target.querySelector('[data-type-workspace]');
    const requested = new URLSearchParams(location.search).get('type');
    const initial = workspace.querySelector(`[data-workspace-type="${CSS.escape(requested || workspace.dataset.initialType)}"]`) || workspace.querySelector('[data-workspace-type]');
    if (initial) loadWorkspaceType(workspace, initial);
    target.scrollIntoView({ block: 'start' });
    return;
  }
  const closer = event.target.closest('[data-close-block]');
  if (closer) {
    const target = closer.closest('[data-block-workspace]');
    target.hidden = true;
    const grid = document.querySelector('[data-block-grid]');
    if (grid) { grid.hidden = false; grid.scrollIntoView({ block: 'start' }); }
  }
});

initializePracticeRunners();
updateLearningProgress();
// Pages without type progress (question bank, papers) skip the server and the drawing-question list.
if (document.querySelector('[data-type-completion],[data-plan-progress],[data-type-lesson],[data-block-workspace]')) {
  Promise.all([syncCompletedTypes(), loadSelfMarkedParts()]).then(() => { completionReady = true; autoCompleteTypes(); });
}
renderLearningResume();
document.addEventListener('focusin', event => {
  const card = event.target.closest('[data-practice-card]');
  if (!card || !event.target.matches('[data-answer-input]')) return;
  const block = card.closest('[data-block-workspace]');
  const lesson = card.closest('[data-type-lesson]');
  const runner = card.closest('[data-practice-runner]');
  if (block && lesson && runner) saveLearningPlace({blockId: block.dataset.blockWorkspace, typeId: lesson.dataset.typeLesson, partId: card.dataset.practiceCard, questionNumber: Number(runner.dataset.practiceIndex || 0) + 1});
});

const linkedBlockId = decodeURIComponent(location.hash.replace(/^#/, ''));
const requestedType = new URLSearchParams(location.search).get('type');
const linkedBlock = (linkedBlockId ? document.querySelector(`[data-block-workspace="${CSS.escape(linkedBlockId)}"]`) : null)
  || (requestedType ? document.querySelector(`[data-block-workspace] [data-workspace-type="${CSS.escape(requestedType)}"]`)?.closest('[data-block-workspace]') : null);
if (linkedBlock) {
  for (const workspace of document.querySelectorAll('[data-block-workspace]')) workspace.hidden = workspace !== linkedBlock;
  const grid = document.querySelector('[data-block-grid]');
  if (grid) grid.hidden = true;
  linkedBlock.hidden = false;
  const workspace = linkedBlock.querySelector('[data-type-workspace]');
  const requested = new URLSearchParams(location.search).get('type');
  const initial = workspace?.querySelector(`[data-workspace-type="${CSS.escape(requested || workspace.dataset.initialType)}"]`) || workspace?.querySelector('[data-workspace-type]');
  if (workspace && initial) loadWorkspaceType(workspace, initial).then(() => {
    const question = new URLSearchParams(location.search).get('question');
    const card = question ? linkedBlock.querySelector(`[data-practice-card="${CSS.escape(question)}"]`) : null;
    if (card && !card.hidden) card.scrollIntoView({block: 'start'});
    else if (linkedBlockId) linkedBlock.scrollIntoView({ block: 'start' });
  });
}
