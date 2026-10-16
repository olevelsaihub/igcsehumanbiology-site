/* Mastery check engine (Human Biology 4HB1): draws original AI-written practice questions,
 * marks them in the browser, no network calls. The questions are not past-paper questions. */
(function () {
  'use strict';
  var BANKS = window.MASTERY_BANKS = window.MASTERY_BANKS || {};
  var SIZE = 10;
  var STORE = 'olv-hb-mastery-v1';
  // Shown above every check: the items are AI-written practice, checked in a separate AI examiner pass, not past-paper questions.
  var NOTICE = '<p class="mc-ai-note"><strong>AI-written practice questions.</strong> These questions were written by AI (Claude) for practice and checked in a separate AI examiner review. They are not past-paper questions and not official Pearson material.</p>';

  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // "a 8 kg" -> "an 8 kg": numbers spoken with a vowel sound (8, 11, 18, 80, 800, 8000 ...) take "an".
  function fixArticles(text) {
    // Lower-case "a" anywhere; capital "A" only at the start of a sentence (elsewhere it may be the ampere or a label).
    var num = '(?=(?:8\\d*|11|18|11\\d|18\\d)(?:[^\\d]|$))';
    return String(text)
      .replace(new RegExp('(^|[^\\w-])a ' + num, 'g'), '$1an ')
      .replace(new RegExp('(^|[.!?]\\s+|>)A ' + num, 'g'), '$1An ');
  }
  // "1 minutes" -> "1 minute" for the common unit nouns used in generated text.
  var PLURALS = /(^|[^\d.,])1 (cycles|divisions|squares|minutes|hours|days|years|seconds|times|metres|students|readings|cells|units|months|weeks|items|people|beats|breaths|tubes|drops|samples|repeats|codons|bases|children|offspring|patients|volunteers|squares|grams|litres|millimetres|micrometres|centimetres)\b/g;
  function fixPlurals(text) {
    return String(text).replace(PLURALS, function (_, pre, w) { return pre + '1 ' + ({ people: 'person', children: 'child', offspring: 'offspring' }[w] || w.slice(0, -1)); });
  }
  function tidy(q) {
    if (q && typeof q === 'object') {
      var fix = function (t) { return fixPlurals(fixArticles(t)); };
      if (q.q) q.q = fix(q.q);
      if (q.why) q.why = fix(q.why);
      if (q.options) q.options = q.options.map(fix);
    }
    return q;
  }

  // Round-robin across skills so every check samples the whole type, then fill to SIZE.
  // `seen` (optional) is shared across the types of one block check, so family tags also work between types.
  function draw(bank, size, seen) {
    size = size || SIZE;
    var groups = {};
    bank.items.forEach(function (it) { (groups[it.skill] = groups[it.skill] || []).push(it); });
    var keys = shuffle(Object.keys(groups)), picked = [], families = seen || {};
    keys.forEach(function (k) { groups[k] = shuffle(groups[k]); });
    // Items that share a figure or context carry the same `family`; avoid two from one family when possible.
    function take(g, strict) {
      for (var j = 0; j < g.length; j++) {
        if (!strict || !g[j].family || !families[g[j].family]) { var it = g.splice(j, 1)[0]; if (it.family) families[it.family] = 1; return it; }
      }
      return null;
    }
    [true, false].forEach(function (strict) {
      while (picked.length < size) {
        var progress = false;
        for (var i = 0; i < keys.length && picked.length < size; i++) {
          var it = take(groups[keys[i]], strict);
          if (it) { picked.push(it); progress = true; }
        }
        if (!progress) break;
      }
    });
    return picked.map(function (it) {
      var q = tidy(typeof it.gen === 'function' ? it.gen() : JSON.parse(JSON.stringify(it)));
      q.skill = it.skill;
      // Figure labels ("A".."D", or "Circuit W".."Circuit Z" with one shared word) keep their printed order.
      var letters = q.options && (function () {
        // A bare capital letter, a word plus a letter ("Circuit W") or a word plus a number ("Step 2"); never bare numbers.
        var m = q.options.map(function (o) { return /^\s*(?:([A-Za-z]+) )?([A-Z]|\d{1,2})\s*$/.exec(String(o)); });
        return m.every(function (x) { return x && (x[1] || '') === (m[0][1] || '') && (x[1] || /[A-Z]/.test(x[2])); });
      })();
      if (q.options && !q.keepOrder) {
        // Figure labels are shown in alphabetical order (A, B, C ...); everything else is shuffled.
        var idx = q.options.map(function (_, i) { return i; });
        var order = letters ? idx.sort(function (a, b) { return String(q.options[a]).trim().localeCompare(String(q.options[b]).trim(), 'en', { numeric: true }); }) : shuffle(idx);
        q.options = order.map(function (i) { return q.options[i]; });
        if (q.kind === 'mcq') q.answer = order.indexOf(q.answer);
        if (q.kind === 'multi') q.answers = q.answers.map(function (a) { return order.indexOf(a); });
      }
      return q;
    });
  }

  // Shared rounding helpers for banks: round half up without binary error (1.575 -> 1.58 at 3 s.f.).
  function roundDp(x, dp) { var r = Math.round(Number(Math.abs(x) + 'e' + dp)); return (x < 0 ? -1 : 1) * Number(r + 'e-' + dp); }
  function roundSf(x, n) { if (x === 0) return 0; var dp = n - 1 - Math.floor(Math.log10(Math.abs(x))); return dp >= 0 ? roundDp(x, dp) : Math.round(x / Math.pow(10, -dp)) * Math.pow(10, -dp); }

  // Accepts 2.5, 2,5, 1.4e-6, 1.4 x 10^-6, 1.4×10-6; ignores a typed unit.
  function parseNumber(raw) {
    var sup = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-' };
    var s = String(raw).trim().replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]/g, function (c) { return sup[c]; })
      .replace(/[−–]/g, '-').replace(/\s+/g, '')
      .replace(/^[x×]/i, '');   // a magnification typed as "x1200" or "×1200"
    // "1,200" is a thousands separator; a lone comma such as "2,5" is a decimal comma.
    s = /^[-+]?\d{1,3}(,\d{3})+(\.\d+)?/.test(s) ? s.replace(/,/g, '') : s.replace(/,/g, '.');
    var m = s.match(/^([-+]?\d*\.?\d+)(?:(?:[x×*]10\^?|e)([-+]?\d+))?/i);
    if (!m) return NaN;
    return parseFloat(m[1]) * (m[2] ? Math.pow(10, parseInt(m[2], 10)) : 1);
  }

  function isCorrect(q, response) {
    if (q.kind === 'mcq') return response === q.answer;
    if (q.kind === 'multi') {
      var got = (response || []).slice().sort().join(','), want = q.answers.slice().sort().join(',');
      return got === want;
    }
    if (q.kind === 'num') {
      var x = parseNumber(response);
      if (isNaN(x)) return false;
      var tol = q.tol != null ? q.tol : Math.max(Math.abs(q.answer) * 0.01, 1e-12);
      // Whole-number answers below a million (counts, mass numbers, exact results) must be exact by default.
      if (q.tol == null && Number.isInteger(q.answer) && Math.abs(q.answer) < 1e6) tol = Math.min(tol, 0.5);
      return Math.abs(x - q.answer) <= tol;
    }
    return false;
  }

  function band(pct) {
    if (pct === 100) return { key: 'mastered', label: 'Mastered', text: 'Full marks. You have mastered this type. Move ahead with confidence.' };
    if (pct >= 90) return { key: 'ready', label: 'Ready to move ahead', text: 'Good to move ahead. We still recommend retaking until you reach 100%, so every mark is secure.' };
    if (pct >= 80) return { key: 'nearly', label: 'Move on, but come back', text: 'You can move on, but this type is not secure yet. Read the explanations below, then retake the check on your next review day.' };
    return { key: 'not-yet', label: 'Not yet', text: 'Not ready to move ahead. Go back to the type page, rework the method and worked example, then retake this check.' };
  }

  function loadStore() { try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch (e) { return {}; } }
  function saveResult(typeId, pct) {
    try {
      var s = loadStore(), r = s[typeId] || { best: 0, attempts: [] };
      r.best = Math.max(r.best, pct); r.last = pct; r.attempts.push({ pct: pct, at: new Date().toISOString() });
      r.attempts = r.attempts.slice(-20); s[typeId] = r;
      localStorage.setItem(STORE, JSON.stringify(s));
    } catch (e) { /* storage blocked: result still shown */ }
  }

  function questionHtml(q, n) {
    var name = 'q' + n, body;
    if (q.kind === 'num') {
      body = '<label class="mc-num">Answer <input name="' + name + '" inputmode="decimal" autocomplete="off" aria-label="Answer to question ' + (n + 1) + '"> <span>' + esc(q.unit || '') + '</span></label>';
    } else {
      var type = q.kind === 'multi' ? 'checkbox' : 'radio';
      body = '<div class="mc-options">' + q.options.map(function (o, i) {
        return '<label><input type="' + type + '" name="' + name + '" value="' + i + '"> <span>' + o + '</span></label>';
      }).join('') + '</div>';
    }
    return '<li class="mc-q" data-n="' + n + '"><p class="mc-tag">AI-written practice</p><p class="mc-stem">' + q.q + (q.kind === 'multi' ? ' <em>(Select all that apply.)</em>' : '') + '</p>' +
      (q.svg ? '<div class="mc-figure">' + q.svg + '</div>' : '') + body + '<div class="mc-feedback" hidden></div></li>';
  }

  function answerText(q) {
    if (q.kind === 'num') return q.display || (q.answer + (q.unit ? ' ' + q.unit : ''));
    if (q.kind === 'mcq') return q.options[q.answer];
    return q.answers.map(function (a) { return q.options[a]; }).join('; ');
  }

  function prepare(list) { return shuffle(list); }

  // Marks question n in the form, shows its feedback and locks its inputs. Returns true when correct.
  function markOne(form, q, n) {
    var li = form.querySelector('[data-n="' + n + '"]'), resp;
    if (q.kind === 'num') resp = li.querySelector('input').value;
    else if (q.kind === 'mcq') { var c = li.querySelector('input:checked'); resp = c ? +c.value : -1; }
    else resp = Array.prototype.map.call(li.querySelectorAll('input:checked'), function (c) { return +c.value; });
    var ok = isCorrect(q, resp);
    q._resp = resp;
    li.classList.add(ok ? 'is-right' : 'is-wrong');
    var fb = li.querySelector('.mc-feedback');
    fb.hidden = false;
    fb.innerHTML = '<strong>' + (ok ? 'Correct.' : 'Not quite.') + '</strong> ' + (ok ? '' : 'Answer: ' + answerText(q) + '. ') + (q.why || '');
    Array.prototype.forEach.call(li.querySelectorAll('input'), function (i) { i.disabled = true; });
    return ok;
  }

  function mount(root, typeId) {
    var bank = BANKS[typeId];
    if (!bank) { root.innerHTML = '<p>The mastery check for this type is not ready yet.</p>'; return; }
    var qs = prepare(draw(bank));
    root.innerHTML = NOTICE + '<form class="mc-form" novalidate><ol class="mc-list">' + qs.map(questionHtml).join('') + '</ol>' +
      '<div class="mc-actions"><button type="submit" class="button">Mark my check</button></div></form><section class="mc-result" hidden aria-live="polite"></section>';
    var form = root.querySelector('form');
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var score = 0;
      qs.forEach(function (q, n) { if (markOne(form, q, n)) score++; });
      var pct = Math.round(score / qs.length * 100), b = band(pct);
      saveResult(typeId, pct);
      form.querySelector('.mc-actions').hidden = true;
      var res = root.querySelector('.mc-result');
      res.hidden = false;
      res.className = 'mc-result band-' + b.key;
      res.innerHTML = '<p class="mc-score">' + score + ' / ' + qs.length + ' · <strong>' + pct + '%</strong></p><h2>' + b.label + '</h2><p>' + b.text + '</p>' +
        '<div class="mc-actions"><button type="button" class="button" data-retake>Retake with new questions</button></div>';
      res.querySelector('[data-retake]').addEventListener('click', function () { mount(root, typeId); root.scrollIntoView({ behavior: 'smooth' }); });
      res.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  // Block check: k questions from every type in the block (k = 2, or more so a small block still has 10+).
  function perType(n) { return Math.max(2, Math.ceil(SIZE / n)); }

  function mountBlock(root, block) {
    var missing = block.types.filter(function (t) { return !BANKS[t.id]; });
    if (missing.length) { root.innerHTML = '<p>This block check is not ready yet.</p>'; return; }
    var k = perType(block.types.length), qs = [];
    var seen = {};
    block.types.forEach(function (t) { draw(BANKS[t.id], k, seen).forEach(function (q) { q.typeId = t.id; qs.push(q); }); });
    qs = prepare(qs);
    root.innerHTML = NOTICE + '<form class="mc-form" novalidate><ol class="mc-list">' + qs.map(questionHtml).join('') + '</ol>' +
      '<div class="mc-actions"><button type="submit" class="button">Mark my block check</button></div></form><section class="mc-result" hidden aria-live="polite"></section>';
    var form = root.querySelector('form');
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var score = 0, per = {};
      qs.forEach(function (q, n) {
        var ok = markOne(form, q, n);
        if (ok) score++;
        var p = per[q.typeId] = per[q.typeId] || { right: 0, total: 0 };
        p.total++; if (ok) p.right++;
      });
      var pct = Math.round(score / qs.length * 100), b = band(pct);
      saveResult('block:' + block.key, pct);
      // Lets the progress tracker record the result for teachers. Not available inside the Node test sandbox.
      if (typeof window.dispatchEvent === 'function' && typeof CustomEvent === 'function') {
        try {
          window.dispatchEvent(new CustomEvent('mastery:result', { detail: {
            block: block.key, title: block.title, score: score, total: qs.length, pct: pct, band: b.key,
            types: block.types.map(function (t) { return { id: t.id, right: per[t.id].right, total: per[t.id].total }; }),
            questions: qs.map(function (q) {
              var r = q._resp, shown = q.kind === 'num' ? String(r || '') : q.kind === 'mcq' ? (r >= 0 ? q.options[r] : '') : (r || []).map(function (i) { return q.options[i]; }).join('; ');
              return { typeId: q.typeId, kind: q.kind, q: String(q.q).replace(/<[^>]*>/g, ''), response: String(shown).replace(/<[^>]*>/g, ''), answer: String(answerText(q)).replace(/<[^>]*>/g, ''), correct: isCorrect(q, r) };
            })
          } }));
        } catch (e) { /* reporting must never break the check */ }
      }
      form.querySelector('.mc-actions').hidden = true;
      var rows = block.types.map(function (t) {
        var p = per[t.id], full = p.right === p.total;
        return '<tr class="' + (full ? 'ok' : 'gap') + '"><td><a href="' + esc(t.url) + '" target="_blank" rel="noopener">' + esc(t.title) + '</a></td><td>' + p.right + ' / ' + p.total + '</td><td>' + (full ? 'Secure' : 'Revisit this type') + '</td></tr>';
      }).join('');
      var res = root.querySelector('.mc-result');
      res.hidden = false;
      res.className = 'mc-result band-' + b.key;
      res.innerHTML = '<p class="mc-score">' + score + ' / ' + qs.length + ' · <strong>' + pct + '%</strong></p><h2>' + b.label + '</h2><p>' + b.text.replace('this type', 'this block').replace('the type page', 'the types marked below') + '</p>' +
        '<div class="table-wrap"><table class="mc-breakdown"><thead><tr><th>Type</th><th>Score</th><th>Next step</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
        '<div class="mc-actions"><button type="button" class="button" data-retake>Retake with new questions</button></div>';
      res.querySelector('[data-retake]').addEventListener('click', function () { mountBlock(root, block); root.scrollIntoView({ behavior: 'smooth' }); });
      res.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  window.Mastery = { NOTICE: NOTICE, mount: mount, mountBlock: mountBlock, perType: perType, band: band, load: loadStore, parseNumber: parseNumber, isCorrect: isCorrect, draw: draw, tidy: tidy, roundDp: roundDp, roundSf: roundSf, SIZE: SIZE };
})();
