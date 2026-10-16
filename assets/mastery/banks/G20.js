/* Group G20 mastery bank: More breathing and gas exchange (Grade 8 block).
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


  // Spirometer-style lung-volume trace: P tidal volume, Q vital capacity, R residual volume.
  function axes(vmax, tmax, ystep, tstep, ylab) {
    var g = '', i;
    for (i = 0; i <= vmax; i += ystep) { var y = 270 - i * 240 / vmax; g += '<line x1="60" y1="' + y + '" x2="540" y2="' + y + '" stroke="#dde3ea" stroke-width="1"/><text x="52" y="' + (y + 4) + '" font-size="12" text-anchor="end" fill="' + INK + '">' + i + '</text>'; }
    for (i = 0; i <= tmax; i += tstep) { var x = 60 + i * 480 / tmax; g += '<line x1="' + x + '" y1="270" x2="' + x + '" y2="275" stroke="' + INK + '"/><text x="' + x + '" y="290" font-size="12" text-anchor="middle" fill="' + INK + '">' + i + '</text>'; }
    g += '<line x1="60" y1="30" x2="60" y2="270" stroke="' + INK + '" stroke-width="1.5"/><line x1="60" y1="270" x2="540" y2="270" stroke="' + INK + '" stroke-width="1.5"/>';
    g += '<text x="300" y="312" font-size="13" text-anchor="middle" fill="' + INK + '">Time in seconds</text><text x="18" y="150" font-size="13" text-anchor="middle" fill="' + INK + '" transform="rotate(-90 18 150)">' + ylab + '</text>';
    return g;
  }
  function arrow2(x, y1, y2, t) {
    return '<line x1="' + x + '" y1="' + y1 + '" x2="' + x + '" y2="' + y2 + '" stroke="' + HI + '" stroke-width="2"/><path d="M' + x + ' ' + y1 + ' l-5 9 h10 z" fill="' + HI + '"/><path d="M' + x + ' ' + y2 + ' l-5 -9 h10 z" fill="' + HI + '"/><text x="' + (x + 8) + '" y="' + ((y1 + y2) / 2 + 6) + '" font-size="16" font-weight="700" fill="' + INK + '">' + t + '</text>';
  }
  var LUNGV = (function () {
    function v(t) {
      function ease(a, b, f) { return a + (b - a) * (1 - Math.cos(Math.PI * f)) / 2; }
      if (t < 24) return 2.75 - 0.25 * Math.cos(2 * Math.PI * t / 4);
      if (t < 27) return ease(2.5, 5.5, (t - 24) / 3);
      if (t < 31) return ease(5.5, 1.2, (t - 27) / 4);
      if (t < 34) return ease(1.2, 2.5, (t - 31) / 3);
      return 2.75 - 0.25 * Math.cos(2 * Math.PI * (t - 34) / 4);
    }
    var pts = [], t, Y = function (val) { return 270 - val * 40; };
    for (t = 0; t <= 52; t += 0.25) pts.push((60 + t * 8).toFixed(1) + ' ' + Y(v(t)).toFixed(1));
    var g = axes(6, 60, 1, 10, 'Volume of air in lungs in dm³') + '<path d="M' + pts.join(' L') + '" fill="none" stroke="' + BLUE + '" stroke-width="2.5"/>';
    g += '<line x1="276" y1="' + Y(5.5) + '" x2="530" y2="' + Y(5.5) + '" stroke="' + GREY + '" stroke-dasharray="4 4"/><line x1="308" y1="' + Y(1.2) + '" x2="530" y2="' + Y(1.2) + '" stroke="' + GREY + '" stroke-dasharray="4 4"/>';
    g += arrow2(530, Y(5.5), Y(1.2), 'Q') + arrow2(308, Y(1.2), 270, 'R') + '<line x1="476" y1="' + Y(3) + '" x2="496" y2="' + Y(3) + '" stroke="' + GREY + '" stroke-dasharray="3 3"/><line x1="460" y1="' + Y(2.5) + '" x2="496" y2="' + Y(2.5) + '" stroke="' + GREY + '" stroke-dasharray="3 3"/>' + arrow2(496, Y(3) - 1, Y(2.5) + 1, '') + '<text x="503" y="' + (Y(2.75) + 6) + '" font-size="16" font-weight="700" fill="' + INK + '">P</text>';
    return '<svg class="mc-svg" viewBox="0 0 560 320" role="img" aria-label="Trace of the volume of air in the lungs over 60 seconds, with three volumes marked P, Q and R">' + g + '</svg>';
  })();
  function rateTrace(n, secs) {
    var pts = [], t;
    for (t = 0; t <= secs; t += secs / 400) pts.push((60 + t * 480 / secs).toFixed(1) + ' ' + (270 - (2.75 - 0.3 * Math.cos(2 * Math.PI * n * t / secs)) * 60).toFixed(1));
    return '<svg class="mc-svg" viewBox="0 0 560 320" role="img" aria-label="Spirometer trace of normal breathing over ' + secs + ' seconds">' + axes(4, secs, 1, secs === 30 ? 5 : 10, 'Volume in dm³') + '<path d="M' + pts.join(' L') + '" fill="none" stroke="' + BLUE + '" stroke-width="2.5"/></svg>';
  }

  /* ====================================================================== HBI-AIRWAY-PROTECTION-AIRFLOW */
  T('HBI-AIRWAY-PROTECTION-AIRFLOW', 'Explain how airway features keep air clean and flowing', [
    M('mucus', "What does mucus in the airways do?",
      "Traps dust and pathogens", ["Sweeps dust up and out of the airways", "Kills all bacteria by digesting them", "Warms the air"], "Goblet cells make the sticky mucus."),
    M('cilia', "What do cilia do?",
      "Beat to sweep mucus up to the throat", ["Trap dust and bacteria on their sticky surface so they cannot reach the lungs", "Kill bacteria", "Make mucus"],
      "Mucus traps; cilia move the mucus. It is then swallowed."),
    M('goblet', "Which cells make mucus?",
      "Goblet cells", ["Ciliated cells", "Red blood cells", "Muscle cells"], "Ciliated cells have the cilia."),
    M('cartilage', "Why are there rings of cartilage in the trachea?",
      "They hold the trachea open so it does not collapse", ["They make the trachea strong enough to push air into the lungs", "They trap dust", "They make mucus"],
      "Say it stops the trachea collapsing; 'strong' alone is not enough."),
    M('C-shape', "Why are the rings of cartilage C-shaped, not full circles?",
      "The gap lets the neck bend and food pass down the oesophagus", ["The gap lets air leak out of the trachea when breathing is fast", "The gap lets mucus drain", "The gap holds the cilia"],
      "The oesophagus lies behind the trachea."),
    M('nose', "How does breathing through the nose help protect the lungs?",
      "The air is warmed and moistened, and hairs and mucus trap dust", ["The nose kills every pathogen in the air before it can reach the trachea", "The nose takes oxygen out of the air", "The nose cools the air"],
      "Give details, not just 'it cleans the air'."),
    M('mouth breathing', "Why is breathing through the mouth less protective than through the nose?",
      "The air is not warmed, moistened or cleaned in the same way", ["The mouth adds bacteria to the air on purpose to train the immune system", "The mouth is narrower", "No air reaches the lungs"],
      "The nose is part of the body's first line of defence."),
    M('smoke', "How does tar in cigarette smoke affect cilia?",
      "It can paralyse or destroy them, so mucus is not moved", ["It makes the cilia beat faster, so they clear the airways more quickly", "It turns cilia into goblet cells", "It has no effect on cilia"],
      "Mucus then builds up."),
    M('bronchitis', "How do excess mucus and damaged cilia affect a person with bronchitis?",
      "Mucus builds up, narrowing the airways and causing coughing and infections", ["The alveoli burst, so the surface area for gas exchange is much smaller", "The heart beats more slowly", "The blood clots"],
      "Bacteria trapped in mucus that is not cleared can cause infections."),
    M('longer breath', "Why does a person with narrow airways need a longer breath to take in a normal tidal volume?",
      "Less air flows through each second, so the breath must last longer", ["They need more oxygen than other people because their muscles are working harder", "Their lungs are bigger", "They breathe out more carbon dioxide"],
      "Same volume, slower flow, so more time."),
    M('common errors', "A student writes: 'Cilia trap dust.' What is correct?",
      "Mucus traps dust; cilia sweep the mucus away", ["Cilia trap dust and kill bacteria", "Cilia filter the air", "Goblet cells trap dust"], "Mucus traps, cilia move."),
    M('common errors', "A student writes: 'Smoking causes more mucus.' What should be added?",
      "The mucus blocks the airways and raises the risk of infection", ["The mucus contains extra oxygen for the lungs", "Mucus is good for the lungs", "Mucus is made by the cilia"],
      "Say what the extra mucus does.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-SPIROMETER-TRACE-INTERPRET */
  T('HBI-SPIROMETER-TRACE-INTERPRET', 'Use a spirometer and identify lung volumes on its trace', [
    M('identify', "The graph shows the volume of air in a person's lungs. Which letter shows the vital capacity?", "Q", ["P", "R"],
      "Q is from the deepest breath in to the hardest breath out.", { svg: LUNGV, family: 'g20-lv' }),
    M('identify', "Using the same graph, which letter shows the tidal volume?", "P", ["Q", "R"],
      "P is one normal breath.", { svg: LUNGV, family: 'g20-lv' }),
    M('identify', "Using the same graph, what is R?", "Residual volume", ["Tidal volume", "Vital capacity", "Breathing rate"],
      "R is the air that always stays in the lungs.", { svg: LUNGV, family: 'g20-lv' }),
    F("graph-reading answer had the default 1% tolerance (\u00b10.005 dm\u00b3), too tight to read from the grid; now ±0.05 dm³ (±0.1 would accept a 12% error)", N('read', "Using the same graph, what is the tidal volume?", 0.5, 'dm³',
      "Normal breaths go from 2.5 to 3.0 dm³. 3.0 − 2.5 = 0.5 dm³. Read the top and the bottom, then subtract.", { svg: LUNGV, family: 'g20-lv', tol: 0.05 })),
    F("graph-reading answer had the default 1% tolerance; now \u00b10.1 dm\u00b3", N('read', "Using the same graph, what is the vital capacity?", 4.3, 'dm³',
      "The deepest breath reaches 5.5 dm³ and the hardest breath out reaches 1.2 dm³. 5.5 − 1.2 = 4.3 dm³.", { svg: LUNGV, family: 'g20-lv', tol: 0.1 })),
    F("graph-reading answer had the default 1% tolerance; now \u00b10.1 dm\u00b3", N('lung capacity', "Using the same graph, what is the total lung capacity (vital capacity + residual volume)?", 5.5, 'dm³',
      "4.3 + 1.2 = 5.5 dm³.", { svg: LUNGV, family: 'g20-lv', tol: 0.1 })),
    M('tidal definition', "What is tidal volume?",
      "The volume breathed in or out in one normal breath", ["The largest volume that can be breathed out after the deepest breath in", "The air left in the lungs", "The number of breaths per minute"],
      "Vital capacity is the largest volume."),
    M('vital definition', "What is vital capacity?",
      "The largest volume breathed out after the deepest possible breath in", ["The volume breathed in or out during one normal, quiet breath", "The air that always stays in the lungs", "The total of all breaths in a minute"],
      "It needs a forced breath out, not just 'a big breath'."),
    M('method', "Why is a nose clip used with a spirometer?",
      "So all the air goes through the mouthpiece", ["So the person cannot smell the soda lime in the chamber", "To stop the person sneezing", "To keep the nose warm"],
      "Air through the nose would not be measured."),
    M('soda lime', "What does the soda lime in a spirometer do?",
      "Absorbs the carbon dioxide breathed out", ["Adds oxygen to the air in the chamber for the person to breathe in", "Kills bacteria", "Measures the volume"],
      "The mouthpiece is also sterilised before use."),
    M('exercise', "How does a trace change after vigorous exercise?",
      "Peaks are higher, troughs lower, and peaks are closer together", ["Peaks are lower and further apart, because the person is tired", "The trace becomes a straight line", "Only the residual volume changes"],
      "Deeper breaths and faster breathing."),
    M('common errors', "A student calls one very large single breath on a trace 'tidal volume'. What is it?",
      "Vital capacity", ["Residual volume", "Breathing rate", "Lung capacity"], "Tidal volume is a normal breath.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-BREATHING-RATE-VOLUME-CALC */
  T('HBI-BREATHING-RATE-VOLUME-CALC', 'Calculate breathing rate or air volume from trace or table', [
    { skill: 'rate from trace', gen: function () {
      var n = rint(5, 9);
      return nq("The spirometer trace shows a person breathing for 30 seconds. Use it to work out the breathing rate in breaths per minute.", n * 2, 'breaths per minute',
        "There are " + n + " peaks (breaths) in 30 seconds. " + n + " × 2 = " + (n * 2) + " breaths per minute. Count peaks only, not peaks and troughs.", { svg: rateTrace(n, 30) });
    } },
    { skill: 'rate from trace', gen: function () {
      var n = rint(3, 6);
      return nq("The spirometer trace shows a person breathing for 20 seconds. Calculate the breathing rate in breaths per minute.", n * 3, 'breaths per minute',
        "There are " + n + " peaks in 20 seconds. 60 ÷ 20 = 3, so " + n + " × 3 = " + (n * 3) + " breaths per minute.", { svg: rateTrace(n, 20) });
    } },
    F("some draws gave unrealistic resting rates (48 breaths per minute); the count now keeps the rate between 12 and 30", { skill: 'rate from count', gen: function () {
      var s = pick([10, 15, 20, 30]), lim = { 10: [2, 5], 15: [3, 7], 20: [4, 9], 30: [6, 14] }[s], n = rint(lim[0], lim[1]), r = n * 60 / s;
      return nq("A student counted " + n + " breaths in " + s + " seconds. What is the breathing rate in breaths per minute?", r, 'breaths per minute',
        n + " × (60 ÷ " + s + ") = " + r + " breaths per minute.");
    } }),
    { skill: 'minute volume', gen: function () {
      var tv = pick([400, 450, 500, 550, 600]), r = rint(12, 20), v = tv * r;
      return nq("A person's tidal volume is " + tv + " cm³ and they take " + r + " breaths per minute. What volume of air do they breathe in each minute? Give your answer in dm³.", v / 1000, 'dm³',
        tv + " × " + r + " = " + commas(v) + " cm³. Divide by 1000 to get dm³: " + (v / 1000) + " dm³.");
    } },
    { skill: 'oxygen used', gen: function () {
      var vol = pick([5, 6, 8, 10, 12, 15]), o2 = R.roundDp(vol * 0.2 * 0.2, 2);
      return nq("A person breathes in " + vol + " dm³ of air per minute. Of the air breathed in, 20% is oxygen, and only 20% of that oxygen is taken up by the body. What volume of oxygen is used per minute?", o2, 'dm³',
        "20% of " + vol + " = " + R.roundDp(vol * 0.2, 2) + " dm³ of oxygen. 20% of that = " + o2 + " dm³. Do one percentage at a time.");
    } },
    { skill: 'units', gen: function () {
      var c = pick([350, 480, 750, 1200, 2500, 4600]);
      return nq("Convert " + commas(c) + " cm³ to dm³.", c / 1000, 'dm³', "1 dm³ = 1000 cm³, so " + commas(c) + " ÷ 1000 = " + (c / 1000) + " dm³.");
    } },
    { skill: 'difference', gen: function () {
      var a = rint(25, 32) / 10, b = R.roundDp(a + rint(4, 8) / 10, 1);
      return nq("On a spirometer trace, a normal breath goes from " + a.toFixed(1) + " dm³ up to " + b.toFixed(1) + " dm³. What is the tidal volume?", R.roundDp(b - a, 1), 'dm³',
        b.toFixed(1) + " − " + a.toFixed(1) + " = " + R.roundDp(b - a, 1) + " dm³. Use the difference, not the top reading.");
    } },
    { skill: 'percentage change', gen: function () {
      var r1 = rint(12, 16), r2 = r1 + rint(6, 14), p = R.roundDp((r2 - r1) / r1 * 100, 1);
      return nq("A person's breathing rate rose from " + r1 + " to " + r2 + " breaths per minute during exercise. Calculate the percentage increase to one decimal place.", p, '%',
        "Increase = " + (r2 - r1) + ". " + (r2 - r1) + " ÷ " + r1 + " × 100 = " + p + "%.", { tol: 0.1 });
    } },
    M('common errors', "A student counts both peaks and troughs as breaths. What happens to their answer?",
      "The breathing rate is doubled", ["The breathing rate is halved", "The tidal volume is doubled", "Nothing changes"], "One breath is one peak (or peak to peak)."),
    M('common errors', "A student counts 8 breaths in 30 seconds and writes '8 breaths per minute'. What did they forget?",
      "To scale up to 60 seconds", ["To divide by 1000", "To subtract the residual volume", "To square the number"], "8 × 2 = 16 breaths per minute."),
    M('common errors', "A student works out 20% of 20% as 40%. What is correct?",
      "Apply each percentage in turn: 20% of 20% is 4%", ["Add them to get 40% of the volume", "Multiply 20 by 20 to get 400%", "Ignore the second percentage"],
      "0.2 × 0.2 = 0.04, which is 4%."),
    M('common errors', "The answer line says dm³ but a student gives 9600 cm³. What should they write?",
      "9.6 dm³", ["9600 dm³", "96 dm³", "0.96 dm³"], "Divide cm³ by 1000 to get dm³.")
  ], { date: '2026-10-13', dropped: [] });
})();
