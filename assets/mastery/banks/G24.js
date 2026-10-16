/* Group G24 mastery bank: More pathogens, immunity and public health (Grade 8 block).
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


  // Growth curve with four phases W, X, Y, Z.
  var GROW = (function () {
    var g = '<line x1="60" y1="20" x2="60" y2="250" stroke="' + INK + '" stroke-width="1.5"/><line x1="60" y1="250" x2="520" y2="250" stroke="' + INK + '" stroke-width="1.5"/>';
    g += '<text x="290" y="282" font-size="13" text-anchor="middle" fill="' + INK + '">Time</text><text x="24" y="135" font-size="13" text-anchor="middle" fill="' + INK + '" transform="rotate(-90 24 135)">Number of living bacteria (log scale)</text>';
    g += '<path d="M60 220 L140 218 C170 216 175 205 190 190 L290 75 C305 60 315 56 340 55 L410 56 C430 57 440 66 455 80 L515 140" fill="none" stroke="' + BLUE + '" stroke-width="3"/>';
    [[100, 205, 'W'], [225, 120, 'X'], [375, 42, 'Y'], [492, 100, 'Z']].forEach(function (p) { g += '<text x="' + p[0] + '" y="' + p[1] + '" font-size="17" font-weight="700" text-anchor="middle" fill="' + INK + '">' + p[2] + '</text>'; });
    [140, 300, 425].forEach(function (x) { g += '<line x1="' + x + '" y1="30" x2="' + x + '" y2="250" stroke="' + GREY + '" stroke-dasharray="4 4"/>'; });
    return '<svg class="mc-svg" viewBox="0 0 540 295" role="img" aria-label="Growth curve of bacteria with four phases labelled W, X, Y and Z">' + g + '</svg>';
  })();
  // Growth rate against temperature for three groups of bacteria A, B, C.
  var TEMPG = (function () {
    var g = '', i;
    for (i = 0; i <= 80; i += 10) { var x = 60 + i * 5.5; g += '<line x1="' + x + '" y1="250" x2="' + x + '" y2="255" stroke="' + INK + '"/><text x="' + x + '" y="270" font-size="12" text-anchor="middle" fill="' + INK + '">' + i + '</text>'; }
    g += '<line x1="60" y1="20" x2="60" y2="250" stroke="' + INK + '" stroke-width="1.5"/><line x1="60" y1="250" x2="510" y2="250" stroke="' + INK + '" stroke-width="1.5"/>';
    g += '<text x="285" y="292" font-size="13" text-anchor="middle" fill="' + INK + '">Temperature in °C</text><text x="24" y="135" font-size="13" text-anchor="middle" fill="' + INK + '" transform="rotate(-90 24 135)">Rate of growth</text>';
    [[12, 9, '#2e86c1', 'A'], [37, 10, '#27ae60', 'B'], [62, 9, '#c0392b', 'C']].forEach(function (c) {
      var pts = [], t;
      for (t = Math.max(0, c[0] - 3 * c[1]); t <= Math.min(80, c[0] + 3 * c[1]); t += 0.5) pts.push((60 + t * 5.5).toFixed(1) + ' ' + (250 - 190 * Math.exp(-Math.pow((t - c[0]) / c[1], 2))).toFixed(1));
      g += '<path d="M' + pts.join(' L') + '" fill="none" stroke="' + c[2] + '" stroke-width="2.5"/><text x="' + (60 + c[0] * 5.5) + '" y="50" font-size="17" font-weight="700" text-anchor="middle" fill="' + INK + '">' + c[3] + '</text>';
    });
    return '<svg class="mc-svg" viewBox="0 0 530 300" role="img" aria-label="Rate of growth against temperature for three groups of bacteria, A, B and C">' + g + '</svg>';
  })();

  /* ====================================================================== HBI-MICROBE-GROWTH-AND-FOOD-PRESERVATION */
  T('HBI-MICROBE-GROWTH-AND-FOOD-PRESERVATION', 'Explain bacterial growth conditions and how food preservation slows it', [
    M('growth curve', "The graph shows the growth of a population of bacteria. Which letter shows the lag phase?", "W", ["X", "Y", "Z"],
      "W is the start, where numbers hardly change.", { svg: GROW, family: 'g24-grow' }),
    M('growth curve', "Using the same graph, which letter shows the phase in which numbers double again and again?", "X", ["W", "Y", "Z"],
      "X is the exponential (log) phase.", { svg: GROW, family: 'g24-grow' }),
    M('growth curve', "Using the same graph, what is happening during phase Y?", "The number of cells dying equals the number of new cells made", ["More cells are dying than are being made, so numbers fall", "The bacteria are making enzymes and not yet dividing", "Every cell is dividing as fast as it can"],
      "Y is the stationary phase.", { svg: GROW, family: 'g24-grow' }),
    M('growth curve', "Using the same graph, why do numbers fall in phase Z?", "More cells die than are made, because food has run out and waste has built up", ["The bacteria have stopped dividing for a while so that they can make enzymes for later", "Every bacterium is dividing", "The temperature has risen to the optimum"],
      "Z is the death phase.", { svg: GROW, family: 'g24-grow' }),
    M('lag', "Why are bacteria not dividing during the lag phase?",
      "They are adjusting and making enzymes", ["They have run out of food and space", "They are all dead", "Waste has built up"], "Division starts in the exponential phase."),
    M('stationary', "What causes the stationary phase?",
      "Food runs short and waste builds up", ["The bacteria are making new enzymes", "The temperature becomes perfect", "Antibiotics are added"], "So the death rate rises to equal the rate of new cells."),
    S('conditions', "Which conditions help bacteria multiply quickly?", ["Food", "Moisture", "Warmth near their optimum"], ["Freezing temperatures", "Vacuum packing"],
      "Remove any one of these and growth slows."),
    M('temperature groups', "The graph shows how fast three groups of bacteria grow at different temperatures. Which group is the thermophiles?", "C", ["A", "B"],
      "Thermophiles grow best at about 50 to 70 °C.", { svg: TEMPG, family: 'g24-temp' }),
    M('temperature groups', "Using the same graph, which group grows best near body temperature (37 °C)?", "B", ["A", "C"],
      "These are the mesophiles. Many pathogens are in this group.", { svg: TEMPG, family: 'g24-temp' }),
    M('65 °C', "Using the same graph, how does cooking food at 65 °C affect group C?", "Group C grows very well, so cooking at 65 °C does not kill it", ["Group C is killed straight away, because all bacteria die above 60 °C", "Group C stops growing at once", "Group C turns into group A"],
      "Not every bacterium is killed at 65 °C.", { svg: TEMPG, family: 'g24-temp' }),
    M('psychrophiles', "What are psychrophiles?",
      "Bacteria that grow best in the cold", ["Bacteria that grow best at body temperature", "Bacteria that grow best at 60 °C", "Bacteria that cannot grow"], "This is why some bacteria still grow slowly in a fridge."),
    M('fridge', "How does keeping food in a fridge at about 4 °C slow spoiling?",
      "Bacterial enzymes work slowly, so bacteria multiply slowly", ["The cold kills all the bacteria in the food within a few hours", "It removes all water", "It keeps air out"],
      "A fridge slows growth; it does not kill bacteria."),
    M('freezing', "Why can frozen food spoil quickly after it thaws?",
      "Freezing stops growth but does not kill the bacteria, so they grow again when warm", ["Freezing makes the bacteria stronger, and thawing adds new ones to the food from the ice", "Thawing adds water that makes bacteria", "Frozen food has no bacteria"],
      "Cook thawed food soon."),
    M('heating', "How does boiling or thorough cooking kill bacteria?",
      "High temperature denatures their enzymes", ["High temperature freezes their water", "It removes their food", "It adds antibiotics"], "Pasteurisation works in the same way."),
    M('packaging', "How does vacuum packing help keep food safe?",
      "It keeps air and new microorganisms out", ["It kills bacteria by heating the food", "It cools the food", "It adds enzymes"], "Sealing stops new microbes reaching the food."),
    M('yoghurt', "In yoghurt making, why is the milk boiled and then cooled before the useful bacteria are added?",
      "Boiling kills unwanted microbes; cooling stops the useful bacteria being killed", ["Boiling adds the useful bacteria to the milk; cooling then makes the milk thicker and sweeter", "Boiling makes lactose", "Cooling kills the unwanted microbes"],
      "Hot milk would kill the added bacteria."),
    M('glue ear', "Why are bacterial infections more common when fluid is trapped in the middle ear?",
      "The warm, damp fluid gives bacteria ideal conditions to multiply", ["The fluid contains antibiotics that bacteria feed on", "The ear is too cold for white blood cells", "The fluid is a type of bacterium"],
      "Warmth and moisture help bacteria grow."),
    { skill: 'doubling', gen: function () {
      var n0 = pick([10, 20, 50, 100]), g = pick([20, 30]), k = rint(3, 6), t = g * k, n = n0 * Math.pow(2, k);
      return nq("A food contains " + n0 + " bacteria. They divide every " + g + " minutes. Assuming they all keep dividing, how many bacteria will there be after " + t + " minutes?", n, 'bacteria',
        t + " ÷ " + g + " = " + k + " divisions. " + n0 + " × 2 to the power " + k + " = " + n0 + " × " + Math.pow(2, k) + " = " + commas(n) + ".");
    } },
    { skill: 'generations', gen: function () {
      var g = pick([15, 20, 30]), h = pick([2, 3, 4]), k = h * 60 / g;
      return nq("A bacterium divides every " + g + " minutes. How many times will it divide in " + h + " hours?", k, 'times',
        h + " hours = " + (h * 60) + " minutes. " + (h * 60) + " ÷ " + g + " = " + k + ".");
    } },
    { skill: 'graph reading', gen: function () {
      var t = pick([12, 37, 62]), c = { 12: 'A', 37: 'B', 62: 'C' }[t];
      return mq("Using the graph, which group of bacteria grows fastest at " + t + " °C?", c, ['A', 'B', 'C'].filter(function (x) { return x !== c; }),
        "Group " + c + "'s curve has its peak near " + t + " °C.", { svg: TEMPG, family: 'g24-temp' });
    } },
    M('common errors', "A student writes: 'A fridge kills bacteria.' What is correct?",
      "A fridge only slows the growth of bacteria", ["A fridge kills only harmful bacteria", "A fridge makes bacteria grow faster", "A fridge has no effect"], "Cold slows enzymes; it does not kill."),
    M('common errors', "A student lists freezing as a type of heat treatment. Which method is a heat treatment?",
      "Pasteurisation", ["Freezing", "Refrigeration", "Vacuum packing"], "Pasteurisation heats the food."),
    M('common errors', "A student calls the phase where cells are not yet dividing the 'stationary phase'. What is it called?",
      "The lag phase", ["The death phase", "The exponential phase", "The log phase"], "In the stationary phase, cells are dividing but just as many are dying."),
    M('common errors', "In the death phase, how does the number of cells dividing compare with the number dying?",
      "Fewer cells divide than die", ["More cells divide than die", "The numbers are equal", "No cells die"], "Equal numbers is the stationary phase.")
  ], { date: '2026-10-13', dropped: [] });
})();
