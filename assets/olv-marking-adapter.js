/* Open-access marking adapter for the Business-family rules (modes mcq, numeric, exact, figures, self).
   The page carries each checked part's rule in <script type="application/json" id="olv-rules"> (igcse_engine
   open_marking.py), so local() marks in the browser with no request and no key; written answers ('self' rules with key
   words) get key-point marking in the H5P Essay style. Without a rule the checker still posts to
   {base}check and result() reads that reply. Either way this file returns the shared result shape
   ({mode, score, max, summary, points}) and fills the part's "Correct answer" panel after the check. */
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
  // ---- marking in the page (same logic as check.php and open_marking.py) ----
  let rulesCache = null;
  function rules() {
    if (rulesCache) return rulesCache;
    try { rulesCache = JSON.parse(document.getElementById('olv-rules')?.textContent || '{}'); } catch { rulesCache = {}; }
    return rulesCache;
  }
  function numbers(text) {
    const out = [];
    const re = /[-\u2212\u2013]?\d{1,3}(?:[ ,\u2009\u202F\u00A0]\d{3})+(?!\d)(?:\.\d+)?|[-\u2212\u2013]?\d+(?:\.\d+)?/gu;
    for (const m of String(text).matchAll(re)) {
      const raw = m[0].replace(/[ ,\u2009\u202F\u00A0]/gu, '').replace(/[\u2212\u2013]/gu, '-');
      const n = Number(raw);
      if (Number.isFinite(n)) out.push(n);
    }
    return out;
  }
  const close = (x, values, tol) => values.some(v => Math.abs(x - Number(v)) <= Math.max(tol, 1e-9) + 1e-9);
  const near = (x, values) => values.some(v => Math.abs(x - Number(v)) <= Math.max(Math.abs(Number(v)) * 0.002, 0.0005) + 1e-9);
  const SUFFIXES = ['ations', 'ation', 'ings', 'ing', 'ies', 'ied', 'edly', 'ed', 'es', 'ly', 's'];
  function stem(w) {
    for (const suf of SUFFIXES) if (w.length > suf.length + 3 && w.endsWith(suf)) return w.slice(0, -suf.length) + (suf === 'ies' || suf === 'ied' ? 'y' : '');
    return w;
  }
  const words = text => (String(text).toLowerCase().replace(/\u2019/g, "'").match(/[a-z0-9]+(?:'[a-z]+)?/g) || []).map(stem);
  function dl1(a, b) {
    if (a === b) return true;
    if (Math.abs(a.length - b.length) > 1) return false;
    if (a.length === b.length) {
      const d = [];
      for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d.push(i);
      return d.length === 1 || (d.length === 2 && d[1] === d[0] + 1 && a[d[0]] === b[d[1]] && a[d[1]] === b[d[0]]);
    }
    if (a.length > b.length) [a, b] = [b, a];
    let i = 0;
    while (i < a.length && a[i] === b[i]) i++;
    return a.slice(i) === b.slice(i + 1);
  }
  // One typo, or the same word family ('obsolete' / 'obsolescence'): same rule as open_marking.py
  const has = (set, w) => set.has(w) || (w.length >= 6 && [...set].some(x => (Math.abs(x.length - w.length) <= 1 && dl1(x, w)) || (x.length >= 6 && x.slice(0, 6) === w.slice(0, 6))));
  const found = (set, kw) => (kw || []).some(alt => alt.filter(w => has(set, w)).length >= Math.max(1, Math.ceil(alt.length * 0.5)));
  const norm = t => String(t).replace(/[\s,'"`\u2018\u2019\u201C\u201D]/gu, '').toUpperCase().replace(/\.+$/, '');

  function check(rule, answer) {
    const max = Number(rule.max);
    const why = rule.why || '', working = rule.working || '';
    if (rule.mode === 'mcq') {
      if (rule.void) return { mode: 'mcq', marks: max, max, correct: null, feedback: 'This question had no correct option in the exam, so every candidate was given the mark.' };
      const letter = String(answer).trim().slice(0, 1).toUpperCase();
      const ok = letter === rule.key;
      const out = { mode: 'mcq', marks: ok ? max : 0, max, correct: ok, key: rule.key, why };
      if (!ok && rule.distractor_notes?.[letter]) out.your_option = rule.distractor_notes[letter];
      return out;
    }
    if (rule.mode === 'numeric') {
      const ans = rule.answer || {};
      let text = String(answer);
      if (ans.form === 'n:1') text = text.trim().replace(/:\s*1(?:\.0+)?\s*$/, '');
      const nums = numbers(text);
      const last = nums.length ? nums[nums.length - 1] : null;
      if (last !== null && close(last, ans.values || [], Number(ans.tol || 0))) {
        const units = rule.unit_required || [];
        if (units.length && !units.some(u => String(answer).toLowerCase().includes(String(u).toLowerCase())))
          return { mode: 'numeric', marks: max - 1, max, correct: false, steps: [{ label: 'Unit: ' + units.join(' or '), found: false }], working, why };
        return { mode: 'numeric', marks: max, max, correct: true, working, why };
      }
      let got = 0;
      const steps = (rule.partial || []).map(p => {
        const hit = nums.some(n => near(n, p.accept_values || []));
        if (hit) got += Number(p.marks);
        return { label: p.label, found: hit };
      });
      return { mode: 'numeric', marks: Math.min(got, max - 1), max, correct: false, steps, working, why };
    }
    if (rule.mode === 'exact') {
      const got = norm(answer);
      if ((rule.answer?.accept || []).some(a => got === norm(a))) return { mode: 'exact', marks: max, max, correct: true, working, why };
      let marks = 0;
      const steps = (rule.partial || []).map(p => {
        const hit = (p.accept || []).some(a => { const n = norm(a); return n && got.includes(n); });
        if (hit) marks += Number(p.marks);
        return { label: p.label, found: hit };
      });
      return { mode: 'exact', marks: Math.min(marks, max - 1), max, correct: false, steps, working, why };
    }
    if (rule.mode === 'figures') {
      const nums = numbers(answer);
      const low = ' ' + String(answer).toLowerCase().replace(/[^a-z0-9]+/g, ' ') + ' ';
      let got = 0, own = 0;
      const items = (rule.items || []).map(it => {
        if (it.self_check) { own += Number(it.marks); return { label: it.label, marks: it.marks, found: null }; }
        let hit = nums.some(n => near(n, it.accept_values || []));
        if (!hit) hit = (it.accept_words || []).some(w => low.includes(' ' + String(w).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim() + ' '));
        if (hit) got += Number(it.marks);
        return { label: it.label, marks: it.marks, found: hit };
      });
      got = Math.min(got, max - own);
      return { mode: 'figures', marks: got, max, self_marks: own, correct: got === max - own, items, ideal: rule.ideal || '', why,
        note: 'Checked by figures and key words only: the place and side of each entry are not checked, so compare your layout with the model.' };
    }
    if (rule.mode === 'self' && rule.kw?.items?.length) {
      const set = new Set(words(answer));
      let hits = (rule.kw.pool || []).filter(alt => found(set, [alt])).length;
      let marks = 0;
      const items = rule.kw.items.map(it => {
        let ok;
        if (it.pool) { ok = hits > 0; if (hits > 0) hits--; } else ok = found(set, it.kw);
        if (ok) marks += Number(it.marks);
        return { label: it.label, marks: it.marks, found: ok };
      });
      // Listing the subject's stock words is not explaining (open_marking.py GATE): under 15% of the answer's content
      // words on this question's points caps the mark at a quarter.
      const skip = new Set(rules()._skip || []);
      const cw = [...new Set(words(answer).filter(w => w.length >= 2 && !skip.has(w)))];
      const kwSet = new Set([...rule.kw.items.flatMap(it => it.kw.flat()), ...(rule.kw.pool || []).flat(),
        ...rule.kw.items.flatMap(it => words(it.label || '').filter(w => w.length >= 2 && !skip.has(w)))]);
      const listing = cw.length > 0 && cw.filter(w => [...kwSet].some(x => has(new Set([w]), x))).length / cw.length < (rule.kw.gate ?? 0.15);
      if (listing) marks = Math.min(marks, Math.floor(max / 4));
      return { mode: 'keywords', marks: Math.min(marks, max), max, correct: marks >= max, items, listing, ideal: rule.ideal || rule.credit || '',
        levels: rule.levels || null, tip: rule.self_mark_tip || '' };
    }
    if (rule.mode === 'self') return { mode: 'self', marks: null, max, ideal: rule.ideal || rule.credit || '', checklist: rule.checklist || [], levels: rule.levels || null, tip: rule.self_mark_tip || '' };
    return null;
  }

  function local(root, answer) {
    const rule = rules()[root.dataset.partId];
    if (!rule) return null;
    const reply = check(rule, answer);
    return reply ? result(root, reply) : null;
  }

  const list = items => items.length ? '<ul>' + items.map(x => `<li>${x}</li>`).join('') + '</ul>' : '';
  const authored = '<p class="muted">Written by olevels.com and checked against the official scheme; not an official Pearson mark scheme.</p>';

  function reference(r) {
    if (r.mode === 'mcq') {
      if (r.correct === null) return `<p>${esc(r.feedback)}</p>`;
      return `<p><strong>Option ${esc(r.key)}</strong></p>` + (r.why ? `<p>${esc(r.why)}</p>` : '')
        + (r.your_option ? `<p><strong>Your choice:</strong> ${esc(r.your_option)}</p>` : '');
    }
    if (r.mode === 'numeric' || r.mode === 'exact') return (r.working ? `<p>${esc(r.working)}</p>` : '') + (r.why ? `<p>${esc(r.why)}</p>` : '') + authored;
    if (r.mode === 'figures') {
      const own = (r.items || []).filter(x => x.found === null);
      return (r.ideal ? `<div class="figures-model">${md(r.ideal)}</div>` : '') + (r.why ? `<p><strong>Why:</strong> ${esc(r.why)}</p>` : '')
        + (own.length ? '<p><strong>Check these yourself against the model</strong></p>' + list(own.map(x => esc(x.label) + (x.marks ? ` <span class="muted">(${x.marks})</span>` : ''))) : '')
        + (r.note ? `<p class="muted">${esc(r.note)}</p>` : '') + authored;
    }
    if (r.mode === 'keywords') {
      return md(r.ideal) + authored
        + (r.levels ? '<p><strong>Level guide</strong></p>' + list(r.levels.map(l => `<strong>Level ${esc(l.level)} (${esc(l.marks)} marks):</strong> ${esc(l.text || l.descriptor || '')}`)) : '')
        + (r.tip ? `<p><strong>Tip:</strong> ${esc(r.tip)}</p>` : '');
    }
    // self: ideal answer, a checklist the student ticks, and the level guide for extended answers
    return md(r.ideal) + authored
      + ((r.checklist || []).length ? '<p><strong>Tick each point you made</strong></p>' + list(r.checklist.map(c => '<label><input type="checkbox" class="self-tick" data-marks="'
        + Number(c.marks || 0) + '"> ' + esc(c.text || c.point || '') + (c.marks ? ` <span class="muted">(${c.marks})</span>` : '') + '</label>')) + '<p class="self-total muted"></p>' : '')
      + (r.levels ? '<p><strong>Level guide</strong></p>' + list(r.levels.map(l => `<strong>Level ${esc(l.level)} (${esc(l.marks)} marks):</strong> ${esc(l.text || l.descriptor || '')}`)) : '');
  }

  function points(r) {
    if (r.mode === 'numeric' || r.mode === 'exact') return (r.steps || []).map(s => ({ label: s.label, found: !!s.found, why: s.found ? 'Found in your answer.' : 'Not found in your answer.' }));
    if (r.mode === 'keywords') return r.items.map(x => ({ label: x.label + (x.marks ? ` (${x.marks})` : ''), found: !!x.found,
      why: x.found ? 'This point is in your answer.' : 'This point is missing.' }));
    if (r.mode === 'figures') return (r.items || []).filter(x => x.found !== null).map(x => ({
      label: x.label + (x.marks ? ` (${x.marks})` : ''), found: !!x.found, why: x.found ? 'Found in your answer.' : 'Missing from your answer.' }));
    return [];
  }

  function summary(r) {
    if (r.mode === 'mcq') return r.correct === null ? r.feedback : r.correct ? 'Your answer is correct.' : `Not this one. The correct answer is option ${r.key}.`;
    if (r.mode === 'numeric') return r.correct ? 'Your final answer is correct.' : 'Your final answer is not right yet. The marks below are for the working the check found.';
    if (r.mode === 'exact') return r.correct ? 'Your answer is correct.' : 'Not right yet. The marks below are for the parts of the answer the check found.';
    if (r.mode === 'keywords' && r.listing && r.marks < r.max) return 'Your answer lists key words without explaining this question\'s points, so it earns at most a quarter of the marks. Explain each point in a sentence, then compare with the correct answer below.';
    if (r.mode === 'keywords') return r.correct ? 'Your answer makes every mark-scheme point.'
      : r.marks ? 'Your answer makes some of the mark-scheme points. The missing ones are marked ✗ below.'
      : 'Your answer does not yet make the mark-scheme points. Compare it with the correct answer below.';
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

  const unavailable = 'Your answer is saved on this device. Automatic checking is not available right now, so compare your answer with the method and the worked example for this question type.';
  window.OlvMarkingAdapter = { result, unavailable, local, check };
})();
