/* Open-access marking adapter for the Business-family checker (check.php modes mcq, numeric, figures, self).
   The shared checker (response-checker.js) posts the answer to {base}check and calls result() with the reply. This
   file turns the reply into the shared result shape ({mode, score, max, summary, points}) and fills the part's
   "Correct answer" panel, which stays empty in the page: keys and model answers arrive only after a check. */
(() => {
  'use strict';
  if (window.OlvMarkingAdapter) return;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  // Model answers use a small Markdown subset: **bold**, | tables | and line breaks.
  function md(src) {
    const out = [];
    let table = [];
    const inline = t => esc(t).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    const flush = () => {
      if (!table.length) return;
      const rows = table.filter(l => !/^\s*\|?\s*:?-{2,}/.test(l));
      out.push('<div class="table-wrap"><table class="model-table">' + rows.map((l, n) => '<tr>' + l.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|')
        .map(c => `<${n ? 'td' : 'th'}>${inline(c.trim())}</${n ? 'td' : 'th'}>`).join('') + '</tr>').join('') + '</table></div>');
      table = [];
    };
    for (const l of String(src || '').split('\n')) {
      if (/^\s*\|/.test(l)) { table.push(l); continue; }
      flush();
      if (l.trim()) out.push(`<p>${inline(l)}</p>`);
    }
    flush();
    return out.join('');
  }
  const list = items => items.length ? '<ul>' + items.map(x => `<li>${x}</li>`).join('') + '</ul>' : '';
  const authored = '<p class="muted">Written by olevels.com and checked against the official scheme; not an official Pearson mark scheme.</p>';

  function reference(r) {
    if (r.mode === 'mcq') {
      if (r.correct === null) return `<p>${esc(r.feedback)}</p>`;
      return `<p><strong>Option ${esc(r.key)}</strong></p>` + (r.why ? `<p>${esc(r.why)}</p>` : '')
        + (r.your_option ? `<p><strong>Your choice:</strong> ${esc(r.your_option)}</p>` : '');
    }
    if (r.mode === 'numeric') return (r.working ? `<p>${esc(r.working)}</p>` : '') + (r.why ? `<p>${esc(r.why)}</p>` : '') + authored;
    if (r.mode === 'figures') {
      const own = (r.items || []).filter(x => x.found === null);
      return (r.ideal ? `<div class="figures-model">${md(r.ideal)}</div>` : '') + (r.why ? `<p><strong>Why:</strong> ${esc(r.why)}</p>` : '')
        + (own.length ? '<p><strong>Check these yourself against the model</strong></p>' + list(own.map(x => esc(x.label) + (x.marks ? ` <span class="muted">(${x.marks})</span>` : ''))) : '')
        + (r.note ? `<p class="muted">${esc(r.note)}</p>` : '') + authored;
    }
    // self: ideal answer, a checklist the student ticks, and the level guide for extended answers
    return md(r.ideal) + authored
      + ((r.checklist || []).length ? '<p><strong>Tick each point you made</strong></p>' + list(r.checklist.map(c => '<label><input type="checkbox" class="self-tick" data-marks="'
        + Number(c.marks || 0) + '"> ' + esc(c.text || c.point || '') + (c.marks ? ` <span class="muted">(${c.marks})</span>` : '') + '</label>')) + '<p class="self-total muted"></p>' : '')
      + (r.levels ? '<p><strong>Level guide</strong></p>' + list(r.levels.map(l => `<strong>Level ${esc(l.level)} (${esc(l.marks)} marks):</strong> ${esc(l.text || l.descriptor || '')}`)) : '');
  }

  function points(r) {
    if (r.mode === 'numeric') return (r.steps || []).map(s => ({ label: s.label, found: !!s.found, why: s.found ? 'Found in your working.' : 'Not found in your working.' }));
    if (r.mode === 'figures') return (r.items || []).filter(x => x.found !== null).map(x => ({
      label: x.label + (x.marks ? ` (${x.marks})` : ''), found: !!x.found, why: x.found ? 'Found in your answer.' : 'Missing from your answer.' }));
    return [];
  }

  function summary(r) {
    if (r.mode === 'mcq') return r.correct === null ? r.feedback : r.correct ? 'Your answer is correct.' : `Not this one. The correct answer is option ${r.key}.`;
    if (r.mode === 'numeric') return r.correct ? 'Your final answer is correct.' : 'Your final answer is not right yet. The marks below are for the working the check found.';
    if (r.mode === 'figures') return (r.correct ? 'Every checkable item was found.' : 'Some credited items are missing.')
      + (r.self_marks ? ` ${r.self_marks} presentation mark${r.self_marks > 1 ? 's' : ''} (dates, details, labels) you judge yourself against the model.` : '');
    return 'Mark your own answer: compare it with the model answer below and tick each point you made.' + (r.tip ? ' ' + r.tip : '');
  }

  function result(root, r) {
    const panel = root.querySelector('[data-student-response]');
    if (panel) {
      const id = panel.getAttribute('aria-labelledby') || '';
      panel.innerHTML = `<h4 id="${esc(id)}">${r.mode === 'self' ? 'Model answer' : 'Correct answer'}</h4>` + reference(r);
    }
    if (r.mode === 'self') return { mode: 'self', score: null, max: r.max, summary: summary(r) };
    const max = r.mode === 'figures' ? Number(r.max) - Number(r.self_marks || 0) : Number(r.max);
    return { mode: r.mode, score: Number(r.marks), max, summary: summary(r), points: points(r), engine: 'rules' };
  }

  document.addEventListener('change', event => {
    const tick = event.target instanceof Element ? event.target.closest('.self-tick') : null;
    if (!tick) return;
    const panel = tick.closest('[data-student-response]');
    const root = tick.closest('[data-answer-checker]');
    const total = [...panel.querySelectorAll('.self-tick:checked')].reduce((n, b) => n + (Number(b.dataset.marks) || 0), 0);
    const out = panel.querySelector('.self-total');
    if (out) out.textContent = `Your self-mark: ${total} / ${root ? root.dataset.marks : '?'} for the points-marked parts. For level-marked answers use the level guide.`;
  });

  window.OlvMarkingAdapter = { result };
})();
