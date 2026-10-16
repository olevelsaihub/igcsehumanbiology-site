export const ANSWER_LIMIT = 6000;
export const CHECKER_VERSION = 2;

export function cleanAnswer(value) {
  return String(value ?? '').replace(/\r\n?/g, '\n').slice(0, ANSWER_LIMIT).trim();
}

export function evaluateChoice(value, correctChoice) {
  const answer = cleanAnswer(value).toUpperCase();
  const correct = cleanAnswer(correctChoice).toUpperCase();
  if (!/^[A-D]$/.test(answer)) return { state: 'empty', correctChoice: correct };
  return { state: answer === correct ? 'correct' : 'incorrect', correctChoice: correct };
}

export function assessPreparedResponse(value, groups = []) {
  const answer = cleanAnswer(value).toLowerCase().replace(/[^a-z0-9.+×÷/^%-]+/g, ' ');
  const answerWords = answer.split(/\s+/).filter(Boolean);
  const results = groups.map(group => {
    const words = [...new Set((group.words || []).map(word => String(word).toLowerCase()).filter(Boolean))];
    const found = words.filter(word => answerWords.some(candidate => candidate === word || (candidate.length >= 5 && word.length >= 5 && candidate.slice(0, 5) === word.slice(0, 5))));
    const phrases = [...new Set((group.phrases || []).map(phrase => cleanAnswer(phrase)).filter(Boolean))];
    const normaliseName = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[‐‑–-]/g, ' ').replace(/\s+/g, ' ').trim().replace(/^(?:the answer is|it is|use)\s+/i, '').replace(/^(?:an?|the)\s+/i, '');
    const nameAnswer = normaliseName(cleanAnswer(value).replace(/[.!]+$/, ''));
    const matchedPhrases = phrases.filter(phrase => {
      const target = normaliseName(phrase);
      const symbol = /^[A-Za-zµμ]+$/.test(target) && (target.length === 1 || /[A-Z]/.test(target));
      return symbol ? nameAnswer === target : nameAnswer.toLowerCase() === target.toLowerCase();
    });
    const needed = Math.max(1, Math.min(2, Math.ceil(words.length * 0.6)));
    const numericResult = text => {
      const match = cleanAnswer(text).replace(/[()]/g, '').replace(/\.$/, '').match(/^([+-]?\d+(?:\.\d+)?)\s*([A-Za-z°Ωµμ][A-Za-z°Ωµμ/²³^0-9 ]*)$/);
      return match ? [Number(match[1]), match[2].replace(/\s+/g, '').replace(/²/g, '2').replace(/³/g, '3').replace(/\^/g, '')] : null;
    };
    const actual = numericResult(value);
    const expected = numericResult(group.label);
    const matched = group.match === 'numeric_result' ? Boolean(actual && expected && actual[0] === expected[0] && actual[1] === expected[1]) : group.match === 'any_phrase' ? matchedPhrases.length > 0 : found.length >= needed;
    return { ...group, found, matchedPhrases, matched };
  });
  const matched = results.filter(group => group.matched);
  return {
    matched,
    missing: results.filter(group => !group.matched),
    total: results.length,
    ratio: results.length ? matched.length / results.length : 0,
    answerKeyMatched: matched.some(group => group.role === 'answer'),
    resultMatched: matched.some(group => group.role === 'result'),
  };
}

export function classifyPreparedResponse(assessment) {
  if (assessment.answerKeyMatched) return 'secure';
  if (assessment.resultMatched) return 'final-match';
  return 'unverified';
}

export function currentAttempt(item = {}) {
  if (!item || typeof item !== 'object') return {};
  if (item.resultSource === 'manual' || item.checkerVersion === CHECKER_VERSION) return item;
  if (item.checkKind && item.checkKind !== 'choice' && ['secure', 'review'].includes(item.status)) {
    return { ...item, status: 'unverified', score: null, needsRecheck: true };
  }
  return item;
}

export function mergeAttempt(previous = {}, patch = {}, now = new Date().toISOString()) {
  return { ...previous, ...patch, updatedAt: now };
}

export function summariseAttempts(results = {}) {
  const attempts = Object.values(results).map(currentAttempt).filter(item => cleanAnswer(item?.answer));
  return {
    attempts: attempts.length,
    secure: attempts.filter(item => item.status === 'secure').length,
    review: attempts.filter(item => item.status === 'review').length,
    unverified: attempts.filter(item => item.status === 'unverified').length,
    finalMatch: attempts.filter(item => item.status === 'final-match').length,
  };
}
