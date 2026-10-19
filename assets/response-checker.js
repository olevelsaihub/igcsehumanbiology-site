import { CHECKER_VERSION, cleanAnswer, evaluateChoice, currentAttempt, mergeAttempt } from './response-checker-core.mjs?v=2';
import { checkWrittenAnswer } from './written-response-core.mjs?v=1';

const storageKey = 'igcsehumanbiology-practice-results-v1';
const markingApi = '/igcsehumanbiology/';
const read = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || '{}');
    return Object.fromEntries(Object.entries(stored).map(([id, item]) => [id, currentAttempt(item)]));
  }
  catch { return {}; }
};
const write = value => {
  try { localStorage.setItem(storageKey, JSON.stringify(value)); return true; }
  catch { return false; }
};

function save(root, patch) {
  const results = read();
  const id = root.dataset.partId;
  results[id] = mergeAttempt(results[id], {
    partId: id,
    typeId: root.dataset.typeId,
    maxMarks: Number(root.dataset.marks || 0),
    questionUrl: `${location.pathname}#part-${id}`,
    answer: cleanAnswer(root.querySelector('[data-answer-input]')?.value),
    checkerVersion: CHECKER_VERSION,
    resultSource: 'checker',
    ...patch,
  });
  const saved = write(results);
  const status = root.querySelector('[data-answer-save-status]');
  if (status) status.textContent = saved ? 'Saved on this device.' : 'This browser could not save the answer.';
  return results[id];
}

function showMessage(root, kind, text, reference = null) {
  const feedback = root.querySelector('[data-answer-feedback]');
  const message = root.querySelector('[data-answer-message]');
  feedback.hidden = false;
  feedback.dataset.feedbackKind = kind;
  message.textContent = text;
  const response = root.querySelector('[data-student-response]');
  if (response) response.hidden = kind === 'warning';
  message.hidden = !text;
  feedback.scrollIntoView({ block: 'nearest' });
}

function referenceAnswer(root, groups) {
  if (root.dataset.checkKind === 'choice' && /^[A-D]$/.test(root.dataset.correctChoice || '')) {
    return { label: 'Correct answer', value: `Option ${root.dataset.correctChoice}` };
  }
  const accepted = groups.find(group => group.role === 'answer' && group.phrases?.length);
  if (accepted) return { label: 'Correct answer', value: accepted.phrases.join(' · ') };
  const result = groups.find(group => group.role === 'result' && group.label);
  if (result) return { label: 'Correct final value', value: result.label.replace(/\s*\(([^()]+)\)/g, ' $1').trim() };
  if (root.dataset.checkKind === 'worked') {
    const worked = root.querySelector('.model-response > p')?.textContent.trim();
    if (worked) return { label: 'Example answer', value: worked };
  }
  return null;
}

function requireAnswer(root) {
  const answer = cleanAnswer(root.querySelector('[data-answer-input]')?.value);
  if (answer) return answer;
  showMessage(root, 'warning', 'Write or select an answer first. Your attempt matters.');
  root.querySelector('[data-answer-input]')?.focus();
  return '';
}

/* Digital marking: the server marks the answer against rules built from the official mark scheme (no AI). */
let markingSession = null;
function getMarkingSession(refresh = false) {
  if (refresh) markingSession = null;
  if (!markingSession) {
    markingSession = Promise.resolve(window.OlvMarkingAdapter ? { csrf: 'open' } : null);
  }
  return markingSession;
}

async function markOnServer(root, answer) {
  const local = window.OlvMarkingAdapter?.local?.(root, answer);
  if (local) return { result: local };
  for (const retry of [false, true]) {
    const session = await getMarkingSession(retry);
    if (!session?.csrf) return { unavailable: true };
    let response;
    try {
      response = await fetch(markingApi + 'check', {
        method: 'POST', credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-CSRF-Token': session.csrf },
        body: JSON.stringify({ part: root.dataset.partId, partId: root.dataset.partId, typeId: root.dataset.typeId || '', answer }),
      });
    } catch { return { unavailable: true }; }
    let data = null;
    try { data = await response.json(); } catch { data = null; }
    if (response.ok && data && typeof data.mode === 'string') return { result: window.OlvMarkingAdapter.result(root, data) };
    if (response.status === 403 && !retry) continue;
    if ([413, 429].includes(response.status) && data?.error) return { error: data.error };
    return { unavailable: true };
  }
  return { unavailable: true };
}

function clearMarking(root) {
  root.querySelector('[data-marking-result]')?.remove();
}

function renderMarking(root, result) {
  clearMarking(root);
  const feedback = root.querySelector('[data-answer-feedback]');
  const box = document.createElement('section');
  box.className = 'marking-result';
  box.dataset.markingResult = '';
  const head = document.createElement('p');
  head.className = 'marking-score';
  const strong = document.createElement('strong');
  strong.textContent = `${result.score} / ${result.max}`;
  head.append('Your mark: ', strong, result.max === 1 ? ' mark' : ' marks');
  box.append(head);
  if (result.mode !== 'mcq' && result.points?.length) {
    const list = document.createElement('ul');
    list.className = 'marking-points';
    for (const point of result.points) {
      const item = document.createElement('li');
      item.className = point.found ? 'is-found' : 'is-missing';
      const label = document.createElement('span');
      label.className = 'marking-point-label';
      label.textContent = point.label;
      const why = document.createElement('span');
      why.className = 'marking-point-why';
      why.textContent = point.why;
      const badge = document.createElement('span');
      badge.className = 'marking-point-badge';
      badge.textContent = point.found ? '✓' : '✗';
      badge.setAttribute('aria-label', point.found ? 'Found' : 'Missing');
      item.append(badge, label, why);
      list.append(item);
    }
    box.append(list);
  }
  const note = document.createElement('p');
  note.className = 'marking-note';
  note.textContent = 'Checked automatically against the official mark scheme. Your teacher may mark differently.';
  box.append(note);
  const anchor = feedback.querySelector('[data-student-response]');
  feedback.insertBefore(box, anchor || null);
}

function localCheck(root, answer, selfMessage = '') {
  const kind = root.dataset.checkKind;
  if (kind === 'choice') {
    const result = evaluateChoice(answer, root.dataset.correctChoice);
    const reference = referenceAnswer(root, []);
    if (result.state === 'correct') {
      save(root, { status: 'secure', score: 1, checkKind: kind });
      showMessage(root, 'correct', 'Your answer is correct.', reference);
    } else {
      save(root, { status: 'review', score: 0, checkKind: kind });
      showMessage(root, 'incorrect', 'Incorrect. Try this question again after checking the correct answer.', reference);
    }
    return;
  }
  let groups = [];
  try { groups = JSON.parse(root.dataset.preparationGroups || '[]'); } catch { groups = []; }
  const paragraphs = [...root.querySelectorAll('[data-student-response] p')].map(p => p.textContent);
  const assessment = checkWrittenAnswer(answer, groups, paragraphs, {marks:Number(root.dataset.marks || 1)});
  const outcome = assessment.status === 'review' ? 'unverified' : assessment.status;
  const reference = referenceAnswer(root, groups);
  save(root, { status: outcome, score: outcome === 'secure' ? assessment.score ?? null : null, preparationPoints: assessment.totalPoints ?? null, checkKind: kind });
  const confirmed = outcome === 'secure';
  const message = confirmed ? 'Your answer is correct.'
    : selfMessage ? selfMessage
    : outcome === 'final-match' ? 'Unconfirmed: the final value matches, but the working has not been checked.'
    : 'Unconfirmed: compare your answer with the correct answer below.';
  showMessage(root, confirmed ? 'correct' : 'unconfirmed', message, reference);
}

function initResponseCheckers(scope = document) {
for (const root of scope.querySelectorAll('[data-answer-checker]:not([data-answer-checker-ready])')) {
  root.dataset.answerCheckerReady = 'true';
  const input = root.querySelector('[data-answer-input]');
  const intro = root.querySelector('.answer-checker-header p');
  if (intro) intro.textContent = 'Write your answer first, then check it. Your mark comes from the official mark scheme.';
  root.querySelector('[data-show-response]')?.remove();
  const saved = read()[root.dataset.partId];
  if (saved?.answer) input.value = saved.answer;
  if (saved?.status) root.dataset.savedOutcome = saved.status;
  let timer = 0;
  input?.addEventListener('input', () => {
    clearTimeout(timer);
    root.querySelector('[data-answer-feedback]').hidden = true;
    root.querySelector('[data-preparation-feedback]')?.setAttribute('hidden', '');
    clearMarking(root);
    timer = setTimeout(() => save(root, { status: 'draft', score: null }), 250);
  });
  input?.addEventListener('change', () => save(root, { status: 'draft', score: null }));

  const button = root.querySelector('[data-check-answer]');
  button?.addEventListener('click', async () => {
    clearTimeout(timer);
    const answer = requireAnswer(root);
    if (!answer || button.disabled) return;
    clearMarking(root);
    const label = button.textContent;
    button.disabled = true;
    button.textContent = 'Checking…';
    let outcome;
    try { outcome = await markOnServer(root, answer); }
    finally { button.disabled = false; button.textContent = label; }
    if (outcome.error) { showMessage(root, 'warning', outcome.error); return; }
    const result = outcome.result;
    if (!result && window.OlvMarkingAdapter) { save(root, { status: 'draft', score: null }); showMessage(root, 'warning', window.OlvMarkingAdapter.unavailable); return; }
    if (!result || result.mode === 'self' || result.score === null) { localCheck(root, answer, result?.mode === 'self' ? (result.summary || 'This answer needs a drawing, graph or table, so compare it with the correct answer and mark it yourself.') : ''); return; }
    const full = result.score === result.max;
    save(root, { status: full ? 'secure' : 'review', score: result.score, checkKind: 'marked-' + result.mode, markedBy: result.engine });
    const reference = referenceAnswer(root, []);
    const message = result.mode === 'mcq'
      ? (full ? 'Your answer is correct.' : (result.summary || 'Not the correct option.'))
      : result.summary;
    showMessage(root, full ? 'correct' : (result.score > 0 ? 'partial' : 'incorrect'), message, reference);
    renderMarking(root, result);
  });
}
}

initResponseCheckers();
document.addEventListener('olv:content-ready', event => {
  initResponseCheckers(event.detail?.root || document);
});

