/* Group G28 mastery bank: Rare extras (Top in the World block).
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


  // Menstrual cycle: line J oestrogen, line K progesterone (left axis), dashed line = lining thickness (right axis).
  var LIN = [[0, 4], [4, 1], [14, 6], [21, 8], [25, 8], [28, 5]];
  function lining(d) { for (var i = 1; i < LIN.length; i++) if (d <= LIN[i][0]) { var a = LIN[i - 1], b = LIN[i]; return a[1] + (b[1] - a[1]) * (d - a[0]) / (b[0] - a[0]); } return 5; }
  var CYC = (function () {
    var X = function (d) { return 70 + d * 15; }, Y = function (v) { return 250 - v * 22; }, g = '', i, d;
    for (i = 0; i <= 10; i += 2) g += '<line x1="70" y1="' + Y(i) + '" x2="490" y2="' + Y(i) + '" stroke="#e3e8ee"/><text x="62" y="' + (Y(i) + 4) + '" font-size="12" text-anchor="end" fill="' + INK + '">' + i + '</text><text x="498" y="' + (Y(i) + 4) + '" font-size="12" fill="' + INK + '">' + i + '</text>';
    for (d = 0; d <= 28; d += 4) g += '<line x1="' + X(d) + '" y1="250" x2="' + X(d) + '" y2="255" stroke="' + INK + '"/><text x="' + X(d) + '" y="270" font-size="12" text-anchor="middle" fill="' + INK + '">' + d + '</text>';
    g += '<line x1="70" y1="30" x2="70" y2="250" stroke="' + INK + '" stroke-width="1.5"/><line x1="490" y1="30" x2="490" y2="250" stroke="' + INK + '" stroke-width="1.5"/><line x1="70" y1="250" x2="490" y2="250" stroke="' + INK + '" stroke-width="1.5"/>';
    g += '<text x="280" y="292" font-size="13" text-anchor="middle" fill="' + INK + '">Day of cycle</text><text x="22" y="140" font-size="12" text-anchor="middle" fill="' + INK + '" transform="rotate(-90 22 140)">Hormone level (arbitrary units)</text><text x="536" y="140" font-size="12" text-anchor="middle" fill="' + INK + '" transform="rotate(90 536 140)">Thickness of lining in mm</text>';
    var oe = [], pr = [], li = [];
    for (d = 0; d <= 28; d += 0.25) {
      oe.push(X(d).toFixed(1) + ' ' + Y(1 + 7 * Math.exp(-Math.pow((d - 12) / 3, 2)) + 2.5 * Math.exp(-Math.pow((d - 21) / 4, 2))).toFixed(1));
      pr.push(X(d).toFixed(1) + ' ' + Y(0.5 + 8 * Math.exp(-Math.pow((d - 21) / 4, 2))).toFixed(1));
      li.push(X(d).toFixed(1) + ' ' + Y(lining(d)).toFixed(1));
    }
    g += '<path d="M' + li.join(' L') + '" fill="none" stroke="#8e6b3e" stroke-width="3" stroke-dasharray="7 5"/><path d="M' + oe.join(' L') + '" fill="none" stroke="' + BLUE + '" stroke-width="2.5"/><path d="M' + pr.join(' L') + '" fill="none" stroke="' + HI + '" stroke-width="2.5"/>';
    g += '<text x="' + X(12) + '" y="' + (Y(8) - 8) + '" font-size="16" font-weight="700" text-anchor="middle" fill="' + INK + '">J</text><text x="' + X(21.6) + '" y="' + (Y(8.5) - 10) + '" font-size="16" font-weight="700" text-anchor="middle" fill="' + INK + '">K</text>';
    g += '<line x1="90" y1="16" x2="120" y2="16" stroke="#8e6b3e" stroke-width="3" stroke-dasharray="7 5"/><text x="126" y="20" font-size="12" fill="' + INK + '">thickness of uterus lining (right axis)</text>';
    return '<svg class="mc-svg" viewBox="0 0 550 300" role="img" aria-label="Graph of a 28-day menstrual cycle with two hormone lines, J and K, on the left axis and the thickness of the uterus lining as a dashed line on the right axis">' + g + '</svg>';
  })();

  /* ====================================================================== HBI-VECTOR-TRANSMISSION-DISTRIBUTION */
  T('HBI-VECTOR-TRANSMISSION-DISTRIBUTION', 'Explain how mosquitoes and houseflies spread disease', [
    M('vector', "What is a vector?",
      "An organism that carries a pathogen from one host to another", ["A pathogen that causes a disease in every organism that it enters", "A medicine that kills pathogens", "A white blood cell"],
      "The vector does not cause the disease itself."),
    M('malaria cause', "What causes malaria?",
      "A protozoan parasite called Plasmodium", ["The female Anopheles mosquito", "A bacterium in dirty water", "A virus in the air"], "The mosquito is the vector."),
    M('which mosquito', "Which mosquito is the vector of malaria?",
      "The female Anopheles mosquito", ["The male Anopheles mosquito", "Any housefly", "Every insect that bites"], "Only females feed on blood."),
    M('mosquito route', "Which is the correct order of how a mosquito spreads malaria?",
      "Bites an infected person, carries the parasites, bites another person and passes them into the blood", ["Lays eggs in standing water, the eggs hatch into parasites, and the parasites then swim into a person's skin", "Bites a healthy person, makes the parasites, then dies", "Lands on food and leaves parasites on it"],
      "Do not leave out the pick-up step from an infected person."),
    M('housefly', "How does a housefly spread typhoid?",
      "Bacteria stick to its legs and mouthparts and are left on food it lands on", ["It bites people and injects the bacteria from its salivary glands straight into their blood", "It lays eggs in people's skin", "It breathes bacteria into the air"],
      "The fly contaminates food; it does not bite."),
    M('housefly feeding', "Why do houseflies pick up pathogens?",
      "They feed on faeces and rotting waste", ["They drink clean water", "They live only in hospitals", "They feed on flowers"], "Faeces may contain typhoid bacteria."),
    S('malaria prevention', "Which measures help prevent malaria?", ["Mosquito nets", "Draining standing water", "Insect repellent"], ["Covering food", "Washing hands after using the toilet"],
      "Insecticides and anti-malarial drugs also help. Covering food and hand washing help prevent typhoid."),
    M('typhoid prevention', "Which measure helps prevent typhoid spread by flies?",
      "Covering food", ["Sleeping under a mosquito net", "Draining ponds", "Wearing long sleeves at dusk"], "Clean water, killing flies and good sanitation also help."),
    M('climate', "Why is malaria more common in warm, wet places?",
      "These conditions suit mosquitoes, which breed in standing water", ["Plasmodium can only survive in cold, dry places where mosquitoes cannot live", "Warm places have more doctors", "People in warm places sleep outside"],
      "Climate affects where the vector can live."),
    M('city data', "Data show more typhoid in a crowded city than in the nearby countryside. What is the best explanation?",
      "More people and more waste give flies more chances to spread bacteria", ["It is much hotter in the city, so the bacteria grow faster inside people's bodies", "The countryside has no flies", "City people eat more food"],
      "Look for factors such as population density and sanitation."),
    M('common errors', "A student writes: 'The mosquito causes malaria.' What is correct?",
      "The mosquito carries the parasite that causes malaria", ["The mosquito causes malaria by injecting its own poison when it bites", "A virus in the mosquito causes it", "Malaria is caused by dirty water"],
      "The cause is Plasmodium."),
    M('common errors', "A student says houseflies bite people to pass on typhoid. What is correct?",
      "Flies leave bacteria on food, which people then eat", ["Flies inject typhoid bacteria into the skin when they bite", "Flies spread typhoid through the air", "Flies do not carry bacteria"], "Typhoid is spread in food and water.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-ENZYME-BIOSENSOR-FUNCTION */
  T('HBI-ENZYME-BIOSENSOR-FUNCTION', 'Explain how enzymes work in biosensors and test strips', [
    M('biosensor', "What does a biosensor use to measure the amount of a substance?",
      "An immobilised enzyme", ["An antibiotic", "A white blood cell", "A hormone"], "The enzyme reacts with one substance only."),
    M('membrane', "What does the partially permeable membrane in a glucose biosensor do?",
      "Lets small glucose molecules through but stops larger molecules and blood cells", ["Filters the blood so that only the red blood cells can reach the enzyme and react with it", "Makes the glucose", "Kills bacteria"],
      "Say which molecules pass and why: size."),
    M('glucose oxidase', "What does glucose oxidase do in a biosensor?",
      "Converts glucose into products including hydrogen peroxide", ["Detects the glucose directly and sends an electrical signal to the display", "Makes glucose from starch", "Turns urea into ammonia"],
      "The electrode detects the product; the enzyme makes it."),
    M('urease', "What does urease do in a urea biosensor?",
      "Breaks down urea into ammonium ions", ["Makes urea from amino acids", "Breaks down glucose", "Stops urea entering"], "The sensor detects the ammonium ions."),
    M('reading', "Why does more glucose give a higher reading?",
      "More glucose gives more product for the electrode to detect", ["More glucose makes the enzyme molecules grow larger, so they give a bigger signal", "More glucose blocks the membrane", "More glucose cools the sensor"],
      "The reading depends on the amount of product."),
    M('test strip', "How does a glucose test strip show the amount of glucose?",
      "The enzyme reacts with glucose to cause a colour change, which is compared with a chart", ["The strip absorbs glucose when it is dipped in urine, so it gets heavier, and it is then weighed", "The strip glows in the dark", "The strip gets hotter"],
      "The colour depends on how much glucose there is."),
    M('temperature', "Why must two samples be tested at the same temperature?",
      "Temperature changes how fast the enzyme makes product, so it changes the reading", ["Glucose molecules melt and break apart at high temperatures, so less of it reaches the sensor", "The membrane only works at 0 °C", "Cold samples have no glucose"],
      "Keep temperature constant for a fair comparison."),
    M('specific', "Why does the glucose biosensor not respond to other sugars?",
      "The enzyme's active site only fits glucose", ["Other sugars are too small to be detected", "Other sugars are not in blood", "The electrode is the wrong colour"],
      "Enzymes are specific."),
    { skill: 'calibration', gen: function () {
      var k = pick([0.2, 0.25, 0.4, 0.5]), g1 = pick([2, 4, 5]), r1 = R.roundDp(k * g1, 2), g2 = pick([6, 8, 10, 12]), r2 = R.roundDp(k * g2, 2);
      return nq("A biosensor reading is proportional to the glucose concentration. A solution with " + g1 + " mmol per dm³ of glucose gives a reading of " + r1 + ". A blood sample gives a reading of " + r2 + ". What is its glucose concentration?", g2, 'mmol per dm³',
        "Each 1 mmol per dm³ gives " + r1 + " ÷ " + g1 + " = " + k + ". " + r2 + " ÷ " + k + " = " + g2 + " mmol per dm³.");
    } },
    M('who uses', "Who uses glucose biosensors most often?",
      "People with diabetes, to check their blood glucose", ["People with cystic fibrosis, to check their mucus", "People with colour blindness", "Athletes, to check their muscles"],
      "They help decide how much insulin to inject."),
    M('common errors', "A student writes: 'The enzyme detects the glucose.' What is correct?",
      "The enzyme makes a product, and the electrode detects the product", ["The membrane detects the glucose and the enzyme then shows the number", "The glucose detects the enzyme", "The display detects the enzyme"],
      "Each part has its own job."),
    M('common errors', "A student writes: 'The membrane filters the blood.' What should be added?",
      "Small molecules such as glucose pass through, but larger ones do not", ["The membrane is made of glass so that it can be cleaned and used again", "The membrane is blue", "Nothing should be added"], "Explain the filtering by size.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-EXPLAIN-PUPIL-LIGHT-RESPONSE */
  T('HBI-EXPLAIN-PUPIL-LIGHT-RESPONSE', 'Explain how the pupil responds to changes in light intensity', [
    M('muscles', "Which two sets of muscles are in the iris?",
      "Circular and radial", ["Ciliary and suspensory", "Biceps and triceps", "Intercostal and diaphragm"], "Ciliary muscles change the lens, not the pupil."),
    M('dim light', "What happens in the iris in dim light?",
      "Radial muscles contract and circular muscles relax", ["Circular muscles contract and radial muscles relax", "Both sets of muscles contract", "Both sets of muscles relax"],
      "The pupil widens to let more light in."),
    M('bright light', "What happens to the pupil in bright light?",
      "It gets narrower, so less light enters", ["It gets wider, so more light enters", "It stays the same size", "It closes completely"], "Circular muscles contract."),
    M('bright muscles', "In bright light, which muscles contract?",
      "Circular muscles", ["Radial muscles", "Ciliary muscles", "Both circular and radial muscles"], "Radial muscles relax."),
    M('detector', "What detects the change in light intensity?",
      "Receptors in the retina", ["The iris itself", "The lens", "The cornea"], "Impulses go to the brain, which sends impulses to the iris muscles."),
    M('reflex', "What type of response is the pupil reflex?",
      "A reflex, so it is automatic and fast", ["A voluntary action that we decide to do", "A hormonal response", "A learned response"], "It happens without thinking."),
    M('purpose', "Why does the pupil change size?",
      "To keep the amount of light entering the eye roughly constant", ["To change the colour of the light that the eye is able to see clearly", "To focus on near objects", "To make tears"],
      "This lets us see clearly."),
    M('speed', "Why must the response to bright light be fast?",
      "Too much light can damage the retina", ["Bright light makes the lens melt", "Bright light makes the eye cold", "Bright light stops blood flow"], "A quick response protects the retina."),
    M('dim result', "In dim light, what happens to the pupil, and why does it help?",
      "It widens, so more light reaches the retina", ["It narrows, so the image becomes brighter", "It stays the same, so nothing changes", "It closes, so the eye rests"],
      "More light lets us see in the dark."),
    M('common errors', "A student writes: 'The pupil contracts in bright light.' What is correct?",
      "The circular muscles of the iris contract, so the pupil gets narrower", ["The pupil is a ring of muscle, so it contracts and squeezes the lens smaller", "The lens contracts", "The retina contracts"],
      "The pupil is a hole; it cannot contract."),
    M('common errors', "A student mixes up the pupil reflex with focusing. Which structures are used for focusing?",
      "The ciliary muscles and the lens", ["The circular and radial muscles", "The iris and the pupil", "The cornea and the eyelid"], "Focusing changes the lens shape."),
    M('common errors', "A student writes: 'In dim light the iris gets bigger.' What should they say?",
      "The pupil gets wider because the radial muscles contract", ["The iris turns darker so that it can absorb more of the light", "The eye gets bigger", "The circular muscles contract"], "Say what happens to the pupil and why.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-INTERPRET-MENSTRUAL-CYCLE-GRAPH */
  T('HBI-INTERPRET-MENSTRUAL-CYCLE-GRAPH', 'Interpret a menstrual-cycle graph of hormones or lining thickness', [
    M('identify', "The graph shows hormone levels and the thickness of the uterus lining during a 28-day cycle. Which line shows progesterone?", "K", ["J", "The dashed line"],
      "Progesterone rises after ovulation and peaks around day 21.", { svg: CYC, family: 'g28-cyc' }),
    M('identify', "Using the same graph, which hormone is line J?", "Oestrogen", ["Progesterone", "Insulin", "Testosterone"],
      "Oestrogen rises in the first half of the cycle.", { svg: CYC, family: 'g28-cyc' }),
    M('menstruation', "Using the same graph, during which days does menstruation happen?", "About days 1 to 4", ["About days 12 to 16", "About days 20 to 25", "Day 28 only"],
      "The lining is breaking down and getting thinner.", { svg: CYC, family: 'g28-cyc' }),
    { skill: 'read lining', gen: function () {
      var d = pick([14, 21, 25]);
      return nq("Using the graph, what is the thickness of the uterus lining on day " + d + "? Use the right-hand axis.", lining(d), 'mm',
        "Read the dashed line on the right-hand axis: " + lining(d) + " mm on day " + d + ". Do not read it from the hormone axis.", { svg: CYC, family: 'g28-cyc', tol: 0.3 });
    } },
    M('ovulation', "On about which day does ovulation happen in a 28-day cycle?",
      "Day 14", ["Day 1", "Day 21", "Day 28"], "An LH surge near the middle of the cycle causes it."),
    M('oestrogen role', "What does oestrogen do in the first half of the cycle?",
      "Makes the uterus lining grow thicker again", ["Makes the lining break down", "Releases the egg", "Keeps the lining thick after ovulation"],
      "Progesterone keeps it thick after ovulation."),
    M('progesterone role', "Why does progesterone rise after ovulation?",
      "To keep the lining thick, ready for implantation", ["To make the lining break down", "To release another egg", "To start menstruation"],
      "A thick lining is needed if an embryo arrives."),
    M('thick lining', "Why must the lining be thick with many blood vessels?",
      "So an embryo can implant and get food and oxygen", ["So that the egg can be released from the ovary", "So that the sperm can swim faster", "So menstruation can start"],
      "Link thickness to implantation and supply."),
    M('fertilised', "If the egg is fertilised, what happens to the progesterone level and the lining?",
      "Progesterone stays high, and the lining stays thick", ["Progesterone falls, and the lining breaks down", "Progesterone keeps rising forever, and the lining grows without stopping", "Both fall to zero"],
      "So menstruation does not happen."),
    M('fertilised oestrogen', "If the egg is fertilised, what happens to the oestrogen line?",
      "It levels off at a steady value lower than its peak", ["It climbs to a new peak much higher than before", "It falls to zero", "It swaps places with progesterone"],
      "It does not rise to a new peak."),
    M('timing', "Why is intercourse long before ovulation less likely to lead to fertilisation?",
      "Sperm only live a few days, so they may die before the egg is released", ["Sperm cannot start swimming until the day of ovulation, so they stay where they are", "The egg lives for many weeks", "The lining is too thick"],
      "The egg lives only about a day."),
    M('common errors', "A student reads the lining thickness from the left-hand axis. What is the mistake?",
      "The lining uses the right-hand axis", ["The lining is not shown on the graph", "The left axis is in days", "There is no mistake"], "Check which axis each line belongs to.")
  ], { date: '2026-10-13', dropped: [] });
})();
