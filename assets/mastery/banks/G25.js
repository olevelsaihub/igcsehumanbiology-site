/* Group G25 mastery bank: Further data and practical skills (Grade 9 block).
 * AI-written practice questions (Claude), checked in a separate AI examiner pass. Not past-paper questions. */
(function () {
  'use strict';
  var B = window.MASTERY_BANKS = window.MASTERY_BANKS || {};
  var R = window.Mastery;   // R.roundDp(x, dp), R.roundSf(x, n): correct half-up rounding

  // ---------- helpers local to this file ----------
  function rint(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function commas(x) { var p = String(x).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return p.join('.'); }
  function M(skill, q, right, wrong, why, extra) { var o = { skill: skill, kind: 'mcq', q: q, options: [right].concat(wrong), answer: 0, why: why }; if (extra) for (var k in extra) o[k] = extra[k]; return o; }
  function S(skill, q, rights, wrongs, why, extra) { var o = { skill: skill, kind: 'multi', q: q, options: rights.concat(wrongs), answers: rights.map(function (_, i) { return i; }), why: why }; if (extra) for (var k in extra) o[k] = extra[k]; return o; }
  function N(skill, q, answer, unit, why, extra) { var o = { skill: skill, kind: 'num', q: q, answer: answer, unit: unit, why: why }; if (extra) for (var k in extra) o[k] = extra[k]; return o; }
  function mq(q, right, wrong, why, extra) { var o = { kind: 'mcq', q: q, options: [right].concat(wrong), answer: 0, why: why }; if (extra) for (var k in extra) o[k] = extra[k]; return o; }
  function nq(q, answer, unit, why, extra) { var o = { kind: 'num', q: q, answer: answer, unit: unit, why: why }; if (extra) for (var k in extra) o[k] = extra[k]; return o; }
  function F(note, item) { item.ex = 'fixed: ' + note; return item; }
  // Registers a type. `exam` is the examiner record ({ date, dropped: [reasons] }); without it the items have no verdict yet.
  function T(id, title, items, exam) {
    var review = null;
    if (exam) {
      items.forEach(function (it) { if (!it.ex) it.ex = 'pass'; });
      review = { writer: 'AI (Claude), writer pass', examiner: 'AI (Claude), separate examiner pass against the brief', date: exam.date,
        checked: items.length + exam.dropped.length, passed: items.filter(function (i) { return i.ex === 'pass'; }).length,
        fixed: items.filter(function (i) { return i.ex !== 'pass'; }).length, dropped: exam.dropped };
    }
    B[id] = { title: title, review: review, items: items };
  }
  var INK = '#303a4c', HI = '#e4464f', BLUE = '#195d9b', GREY = '#9aa5b8';


  function sf(a, n) { return a + ' × 10<sup>' + n + '</sup>'; }
  function digits(k) { var s = String(rint(1, 9)); while (s.length < k) s += String(rint(0, 9)); return s; }
  function mant(ds) { var r = ds.slice(1).replace(/0+$/, ''); return ds[0] + (r ? '.' + r : ''); }

  /* ====================================================================== HBI-MATH-NUMBER-FORM-UNITS */
  T('HBI-MATH-NUMBER-FORM-UNITS', 'Convert units and write numbers in standard form or significant figures', [
    { skill: 'standard form (large)', gen: function () {
      var len = rint(5, 8), ds = digits(rint(3, 5)), num = ds; while (num.length < len) num += '0';
      var a = mant(ds), n = len - 1, rest = ds.slice(2).replace(/0+$/, ''), b = ds.slice(0, 2) + (rest ? '.' + rest : '');
      return mq("Write " + commas(num).replace(/,/g, ' ') + " in standard form.", sf(a, n), [sf(a, n + 1), sf(a, n - 1), sf(b, n - 1)],
        "Move the decimal point " + n + " places to the left so that the first number is between 1 and 10: " + a + " × 10<sup>" + n + "</sup>.");
    } },
    { skill: 'standard form (small)', gen: function () {
      var k = rint(2, 6), m = rint(11, 99), a = (m / 10).toFixed(1), num = '0.' + new Array(k).join('0') + String(m);
      return mq("Write " + num + " in standard form.", sf(a, '−' + k), [sf(a, k), sf(a, '−' + (k + 1)), sf(String(m), '−' + (k + 1))],
        "The power is negative for a number smaller than 1. Move the point " + k + " places to the right: " + a + " × 10<sup>−" + k + "</sup>.");
    } },
    { skill: 'from standard form', gen: function () {
      var a100 = rint(101, 999), n = rint(3, 6), val = a100 * Math.pow(10, n - 2), a = (a100 / 100).toFixed(2);
      return nq("Write " + sf(a, n) + " as an ordinary number.", val, '',
        "Move the decimal point " + n + " places to the right: " + commas(val) + ".", { tol: 0 });
    } },
    { skill: 'significant figures (large)', gen: function () {
      var N = rint(1000000, 9999999), p = pick([2, 3]), f = Math.pow(10, 7 - p), r = Math.round(N / f) * f;
      return nq("Round " + commas(N).replace(/,/g, ' ') + " to " + p + " significant figures.", r, '',
        "Keep the first " + p + " figures, round, and fill the other places with zeros: " + commas(r).replace(/,/g, ' ') + ". The number must stay the same size.", { tol: 0 });
    } },
    F("random numbers could end in 0 (so the stem showed a trailing zero) or in an exact 5 (where floating-point rounding can go the wrong way); both are now excluded", { skill: 'significant figures (small)', gen: function () {
      var k = rint(2, 4), d = rint(100, 999) * 10 + pick([1, 2, 3, 4, 6, 7, 8, 9]), x = d / Math.pow(10, k + 3), p = pick([2, 3]), r = Number(x.toPrecision(p));
      return nq("Round " + x.toFixed(k + 3) + " to " + p + " significant figures.", r, '',
        "Count from the first figure that is not zero. " + x.toFixed(k + 3) + " to " + p + " significant figures is " + r + ".", { tol: 0 });
    } }),
    { skill: 'mm to µm', gen: function () {
      var u = rint(5, 95), mm = String(u / 1000);
      return nq("A cheek cell is " + mm + " mm across. What is this in micrometres (µm)?", u, 'µm',
        "1 mm = 1000 µm, so multiply by 1000: " + mm + " × 1000 = " + u + " µm.");
    } },
    { skill: 'µm to mm', gen: function () {
      var u = rint(110, 950);
      return nq("A structure is " + u + " µm long. What is this in millimetres?", u / 1000, 'mm',
        "Divide by 1000: " + u + " ÷ 1000 = " + (u / 1000) + " mm.");
    } },
    { skill: 'time', gen: function () {
      var m = rint(2, 12), s = rint(5, 55);
      return nq("An experiment lasted " + m + " minutes and " + s + " seconds. How many seconds is this?", m * 60 + s, 's',
        m + " × 60 = " + (m * 60) + ". " + (m * 60) + " + " + s + " = " + (m * 60 + s) + " seconds.");
    } },
    { skill: 'time', gen: function () {
      var h = pick([1.5, 2, 2.5, 3, 4.5]), s = pick([90, 150, 270, 330, 450]);
      return pick([nq("How many minutes are there in " + h + " hours?", h * 60, 'minutes', h + " × 60 = " + (h * 60) + " minutes."),
        nq("Convert " + s + " seconds into minutes.", s / 60, 'minutes', s + " ÷ 60 = " + (s / 60) + " minutes.")]);
    } },
    { skill: 'mm to µm', gen: function () {
      var mm = pick([0.2, 0.25, 0.4, 0.75, 1.2, 1.5]);
      return nq("Convert " + mm + " mm into µm.", Math.round(mm * 1000), 'µm', mm + " × 1000 = " + Math.round(mm * 1000) + " µm.");
    } },
    { skill: 'standard form (large)', gen: function () {
      var n = rint(3, 5), a = pick(['2.5', '3.8', '4.4', '6.1', '7.25']), val = Math.round(Number(a) * Math.pow(10, n));
      return nq("A population of bacteria is " + sf(a, n) + ". Write this as an ordinary number.", val, 'bacteria', a + " × " + commas(Math.pow(10, n)) + " = " + commas(val) + ".", { tol: 0 });
    } },
    { skill: 'compare', gen: function () {
      var opts = [sf('3.2', 4), sf('9.9', 3), sf('5.0', 2), sf('8.1', '−4')];
      return mq("Which of these numbers is the largest?", opts[0], opts.slice(1), "Compare the powers first: 10<sup>4</sup> is larger than 10<sup>3</sup>, so 3.2 × 10<sup>4</sup> (32 000) is largest.");
    } },
    M('which is standard form', "Which of these is written correctly in standard form?",
      sf('4.5', 3), [sf('45', 2), sf('0.45', 4), sf('450', 1)], "The first number must be at least 1 and less than 10."),
    M('rule', "In standard form, A × 10<sup>n</sup>, what must A be?",
      "At least 1 and less than 10", ["Between 0 and 1", "Between 10 and 100", "Any whole number"], "So 4.5 × 10<sup>3</sup>, not 45 × 10<sup>2</sup>."),
    M('negative power', "What does a negative power of ten, such as 10<sup>−3</sup>, show?",
      "The number is smaller than 1", ["The number is negative", "The number is larger than 1000", "The answer is wrong"], "8.3 × 10<sup>−3</sup> = 0.0083."),
    M('common errors', "A student writes 600 239 as 60.0239 × 10<sup>4</sup>. What is wrong?",
      "The first number is not between 1 and 10", ["The power should be negative", "The digits are in the wrong order", "Nothing is wrong"], "It should be 6.00239 × 10<sup>5</sup>."),
    M('common errors', "A student writes 600 239 as 6.00239 × 10<sup>6</sup>. What is wrong?",
      "The power should be 5", ["The power should be 4", "The first number should be 60.0239", "Nothing is wrong"], "Count the places the point moves: 5."),
    M('common errors', "A student rounds 3 319 266 to three significant figures and writes 332. What is correct?",
      "3 320 000", ["332 000", "3 319 000", "3 300 000"], "The zeros keep the number the same size."),
    M('common errors', "A student converts 0.018 mm to µm by dividing by 1000. What should they do?",
      "Multiply by 1000, because 1 mm = 1000 µm", ["Divide by 100", "Multiply by 100", "Divide by 1 000 000"], "A micrometre is smaller, so there are more of them: 18 µm."),
    M('count figures', "How many significant figures are there in 0.00450?",
      "3", ["2", "5", "6"], "Start counting at the 4: 4, 5 and the final 0."),
    M('units', "How many micrometres (µm) are there in 1 mm?",
      "1000", ["10", "100", "1 000 000"], "1 µm is one thousandth of a millimetre."),
    M('units', "What is 1 µm in metres?",
      "10<sup>−6</sup> m", ["10<sup>−3</sup> m", "10<sup>6</sup> m", "10<sup>−9</sup> m"], "Micro means one millionth."),
    M('time', "How many seconds are there in 2.5 minutes?",
      "150", ["250", "125", "60"], "There are 60 seconds in a minute, so 2.5 × 60 = 150 seconds."),
    M('zeros', "Why must zeros be added when 48 760 is rounded to 2 significant figures?",
      "To keep the number the same size: 49 000", ["Zeros make the answer more accurate", "Zeros are significant figures", "So the answer has five figures"], "49 alone would be a much smaller number.")
  ], { date: '2026-10-13', dropped: [] });
})();
