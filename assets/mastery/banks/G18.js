/* Group G18 mastery bank: More diet, digestion and teeth (Grade 8 block).
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


  function lab(x1, y1, x2, y2, t, anchor) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + INK + '" stroke-width="1.3"/><text x="' + (anchor === 'end' ? x2 - 6 : x2 + 6) + '" y="' + (y2 + 5) + '" font-size="16" font-weight="700" text-anchor="' + (anchor || 'start') + '" fill="' + INK + '">' + t + '</text>'; }
  // Peristalsis: A contracted section behind the bolus, B bolus, C relaxed section in front.
  var PER = (function () {
    var top = 'M30 98 L150 98 C178 98 180 66 206 66 L262 66 C288 66 290 80 312 80 L490 80', bot = 'M30 122 L150 122 C178 122 180 154 206 154 L262 154 C288 154 290 140 312 140 L490 140';
    var g = '<path d="' + top + ' L490 140 L312 140 C290 140 288 154 262 154 L206 154 C180 154 178 122 150 122 L30 122 Z" fill="#f7dfd6"/>';
    g += '<path d="' + top + '" fill="none" stroke="#b5544a" stroke-width="7"/><path d="' + bot + '" fill="none" stroke="#b5544a" stroke-width="7"/>';
    g += '<ellipse cx="234" cy="110" rx="34" ry="38" fill="#a9825a" stroke="' + INK + '" stroke-width="1.5"/>';
    g += '<line x1="190" y1="200" x2="320" y2="200" stroke="' + INK + '" stroke-width="2"/><path d="M320 200 l-12 -6 v12 z" fill="' + INK + '"/><text x="255" y="225" font-size="13" text-anchor="middle" fill="' + INK + '">direction food moves</text>';
    g += lab(90, 95, 70, 30, 'A', 'end') + lab(234, 104, 300, 30, 'B') + lab(400, 77, 420, 30, 'C');
    return '<svg class="mc-svg" viewBox="0 0 520 240" role="img" aria-label="Section of the oesophagus with a ball of food; three regions labelled A, B and C">' + g + '</svg>';
  })();
  var BANDS = '<table class="mc-table"><tr><th>BMI</th><th>Category</th></tr><tr><td>below 18.5</td><td>underweight</td></tr><tr><td>18.5 to 24.9</td><td>healthy weight</td></tr><tr><td>25.0 to 29.9</td><td>overweight</td></tr><tr><td>30.0 and above</td><td>obese</td></tr></table>';
  function band(b) { return b < 18.5 ? 'Underweight' : b < 25 ? 'Healthy weight' : b < 30 ? 'Overweight' : 'Obese'; }

  /* ====================================================================== HBI-PERISTALSIS-FIBRE */
  T('HBI-PERISTALSIS-FIBRE', 'Explain how food moves by peristalsis and why fibre helps', [
    M('label', "The diagram shows food moving along the oesophagus. Which letter shows where the circular muscles are contracting?", "A", ["B", "C"],
      "A is behind the ball of food, where the gut is squeezed narrow.", { svg: PER, family: 'g18-per' }),
    M('label', "Using the same diagram, what is happening to the circular muscles at C?", "They are relaxed, so the gut is wider", ["They are contracting hard to push the food back towards A", "They are digesting the food", "They have been removed"],
      "Muscles in front of the food relax so it can move forward.", { svg: PER, family: 'g18-per' }),
    M('label', "Using the same diagram, what is B?", "A bolus (a ball of food)", ["A muscle", "A villus", "A valve"], "Food is swallowed as a ball called a bolus.", { svg: PER, family: 'g18-per' }),
    M('peristalsis', "What is peristalsis?",
      "Waves of muscle contraction that push food along the gut", ["Food falling down the gut because of gravity", "Enzymes breaking food into small molecules", "Food being absorbed into the blood"],
      "Peristalsis even works when you are upside down."),
    M('muscles', "Which muscles contract behind the bolus to squeeze it along?",
      "Circular muscles", ["Muscles in front of the bolus", "Muscles inside the bolus", "The diaphragm"], "Circular muscles contract behind and relax in front."),
    M('two layers', "Which two layers of muscle are in the wall of the gut?",
      "Circular and longitudinal", ["Cardiac and skeletal muscle", "Biceps and triceps", "Intercostal and diaphragm"], "The circular layer squeezes; the longitudinal layer shortens the gut."),
    M('oesophagus', "What does the oesophagus do?",
      "Carries food from the mouth to the stomach", ["Digests protein using pepsin and acid", "Absorbs digested food into the blood", "Carries air to the lungs"], "Its muscular wall pushes the bolus down by peristalsis."),
    M('fibre digested', "Why does fibre stay in the gut?",
      "It cannot be digested", ["It is digested to give energy", "It is absorbed into the blood", "It turns into fat"], "Humans have no enzyme that digests fibre."),
    M('bulk', "How does fibre help peristalsis?",
      "It adds bulk, giving the muscles something to push against", ["It is digested into glucose that the gut muscles use to contract", "It makes the food fall faster by gravity", "It kills bacteria in the gut"],
      "Bulk also stimulates the muscles to contract."),
    S('benefits', "Which of these are benefits of eating enough fibre?", ["Less constipation", "Lower risk of bowel cancer"], ["More energy from food", "Faster absorption of fat"],
      "Fibre gives no energy because it is not digested."),
    M('common errors', "A student writes: 'Fibre helps digestion.' Why is this not enough for the mark?",
      "It does not mention bulk or peristalsis", ["Fibre has nothing at all to do with the gut or with how food moves", "It should say fibre is digested", "It needs the word protein"],
      "Say how: fibre adds bulk for the muscles to push against."),
    M('common errors', "A student writes: 'The food squeezes itself along the gut.' What is correct?",
      "The muscles of the gut wall contract and push the food", ["The food is pulled along by gravity", "Enzymes push the food", "The blood pushes the food"],
      "The food itself does not contract.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-OBESITY-CAUSES-RISKS */
  T('HBI-OBESITY-CAUSES-RISKS', 'Explain causes of obesity, its health risks and dietary advice', [
    M('energy balance', "What causes obesity?",
      "Taking in more energy from food than is used, over a long time", ["Using more energy than is taken in from food for a long time", "Drinking too much water", "Eating too much fibre"],
      "The extra energy is stored as fat."),
    S('causes', "Which of these are main causes of obesity?", ["Eating too much fat and sugar", "Too little exercise"], ["Eating too much fibre", "Drinking plenty of water"],
      "Both lead to more energy in than out."),
    M('diabetes', "Obesity is a risk factor for which type of diabetes?",
      "Type 2", ["Type 1", "Both types equally", "Neither type"], "A high BMI and high sugar intake raise the risk of type 2 diabetes."),
    M('other risks', "Other than diabetes, which is a health risk of obesity?",
      "Heart disease", ["Diabetes", "Scurvy", "Rickets"], "The question says 'other than diabetes'. Strokes, high blood pressure and arthritis are also linked."),
    M('arthritis', "Why does obesity increase the risk of arthritis?",
      "Extra body mass puts more strain on the joints", ["Fat cells release bacteria into the joints and infect them", "Obese people have fewer bones", "Fat dissolves cartilage"],
      "Arthritis is damage to joints."),
    M('cholesterol', "How does a high blood cholesterol level increase the risk of a heart attack?",
      "Fatty deposits form in artery walls, narrowing the arteries", ["Cholesterol makes the heart beat faster, so the muscle wears out", "Cholesterol kills red blood cells", "Cholesterol blocks the lungs"],
      "This is atherosclerosis. Narrow coronary arteries supply less oxygen to the heart muscle."),
    M('advice', "Which is the most precise dietary advice for someone who wants to lose mass?",
      "Eat less fat and less sugar", ["Eat a healthy diet", "Eat less vitamin C and calcium", "Stop drinking water"], "'Eat a healthy diet' is too vague to earn a mark."),
    M('food label', "Four foods have the same energy content. Which label shows the best choice for losing mass?",
      "No energy from fat", ["High in vitamin C, so it burns body fat faster", "Low in cholesterol", "High in iron"],
      "Vitamins and cholesterol do not change body mass."),
    M('genes', "A student writes: 'Obesity is only caused by genes.' What is wrong?",
      "Energy balance (diet and exercise) is the main cause", ["Genes have nothing to do with any characteristic", "Obesity is caused by a virus", "Obesity is caused by too much water"],
      "Genes may play a part, but more energy in than out is the cause."),
    M('trend', "A graph shows that the risk of type 2 diabetes rises as BMI rises. What does this suggest?",
      "A higher BMI is linked with a greater risk of diabetes", ["A higher BMI always causes diabetes in every person", "BMI and diabetes are not linked", "A lower BMI raises the risk"],
      "A link (correlation) does not mean every person with a high BMI gets diabetes."),
    M('same risk twice', "A student lists 'heart attack' and 'coronary heart disease' as two different risks. Why might only one mark be given?",
      "They are the same idea", ["Neither is linked with obesity at all", "Only diabetes counts as a risk", "The words are spelt differently"],
      "Give two different risks, such as heart disease and arthritis."),
    M('alcohol', "Why might cutting down on alcohol help a person lose mass?",
      "Alcohol contains a lot of energy", ["Alcohol contains a lot of fibre", "Alcohol is a source of protein", "Alcohol stops peristalsis"],
      "Alcohol adds energy to the diet.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-BMI-CALCULATE-CLASSIFY */
  T('HBI-BMI-CALCULATE-CLASSIFY', 'Calculate BMI and place it in a weight category', [
    { skill: 'calculate BMI', gen: function () {
      var h = rint(150, 195) / 100, m = rint(45, 120), b = R.roundDp(m / (h * h), 1);
      return nq("A woman is " + h.toFixed(2) + " m tall. Her mass is " + m + " kg. Work out her BMI, where BMI = mass ÷ (height)². Give your answer to one decimal place.", b, '',
        h.toFixed(2) + "² = " + R.roundDp(h * h, 4) + ". " + m + " ÷ " + R.roundDp(h * h, 4) + " = " + b + ".", { tol: 0.1 });
    } },
    { skill: 'calculate BMI', gen: function () {
      var cm = rint(152, 190), h = cm / 100, m = rint(50, 110), b = R.roundDp(m / (h * h), 1);
      return nq("A student is " + cm + " cm tall and has a mass of " + m + " kg. Calculate the BMI to one decimal place.", b, '',
        "Change the height to metres first: " + cm + " cm = " + h.toFixed(2) + " m. " + m + " ÷ " + h.toFixed(2) + "² = " + b + ".", { tol: 0.1 });
    } },
    F("pronoun mismatch in the stem ('A man ... their BMI category')", { skill: 'classify', gen: function () {
      var target = pick([17.2, 20.5, 23.8, 26.4, 28.9, 31.5, 34.0]), h = rint(155, 190) / 100, m = Math.round(target * h * h), b = R.roundDp(m / (h * h), 1), c = band(b);
      return mq("A man is " + h.toFixed(2) + " m tall and his mass is " + m + " kg. Use the table to find his BMI category." + BANDS, c,
        ['Underweight', 'Healthy weight', 'Overweight', 'Obese'].filter(function (x) { return x !== c; }), "BMI = " + m + " ÷ " + h.toFixed(2) + "² = " + b + ", which is " + c.toLowerCase() + ".");
    } }),
    { skill: 'boundary', gen: function () {
      var b = pick([18.5, 25.0, 30.0]), c = band(b);
      return mq("A person's BMI is " + b.toFixed(1) + ". Use the table to find their category." + BANDS, c,
        ['Underweight', 'Healthy weight', 'Overweight', 'Obese'].filter(function (x) { return x !== c; }), b.toFixed(1) + " is the first value of the band '" + c.toLowerCase() + "', so it belongs in that band.");
    } },
    { skill: 'find mass', gen: function () {
      var b = pick([20, 22, 24, 25, 30]), h = pick([1.5, 1.6, 1.7, 1.8]), m = R.roundDp(b * h * h, 1);
      return nq("A person is " + h.toFixed(2) + " m tall. What mass would give them a BMI of exactly " + b + "? Give your answer to one decimal place.", m, 'kg',
        "Rearrange: mass = BMI × height² = " + b + " × " + h.toFixed(2) + "² = " + m + " kg.", { tol: 0.1 });
    } },
    M('formula', "Which is the correct formula for BMI?",
      "Mass in kg ÷ (height in m)²", ["(Height in m)² ÷ mass in kg", "Mass in kg ÷ (height in m × 2)", "Mass in kg × height in m"], "Square the height, then divide the mass by it."),
    M('units', "Why must height be in metres, not centimetres, when calculating BMI?",
      "Using centimetres gives a tiny BMI that does not match the table", ["Centimetres make the BMI far too large to fit on any table", "BMI can only be calculated for adults", "The mass must also be in grams"],
      "169 cm must be written as 1.69 m."),
    M('common errors', "A student calculates BMI as 70 ÷ (1.75 × 2). What mistake have they made?",
      "They multiplied the height by 2 instead of squaring it", ["They used the height in centimetres", "They divided the height by the mass", "They made no mistake"],
      "1.75² = 1.75 × 1.75 = 3.0625, not 3.5."),
    M('common errors', "A student calculates BMI as 1.70² ÷ 65. What mistake have they made?",
      "They divided the wrong way up", ["They squared the height instead of the mass", "They used kilograms", "They made no mistake"], "Mass goes on top: 65 ÷ 1.70²."),
    M('order', "What should be done first when calculating BMI?",
      "Square the height", ["Divide the mass by the height", "Multiply the mass by 2", "Add the mass and height"], "Then divide the mass by the squared height."),
    M('waist-hip', "Which other calculation can be used to judge obesity?",
      "The waist-to-hip ratio", ["The heart rate after exercise", "The number of teeth", "The blood glucose level"], "Waist measurement ÷ hip measurement, compared with a chart."),
    M('limitation', "Why might a very muscular athlete have a high BMI but not be obese?",
      "Muscle is heavy, and BMI does not show whether mass is fat or muscle", ["Athletes are always shorter than other people", "BMI only works for children", "Muscle has no mass"],
      "BMI only uses mass and height.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-ENZYME-APPLIED-CONTEXT */
  T('HBI-ENZYME-APPLIED-CONTEXT', 'Apply digestive enzyme action to an unfamiliar situation', [
    M('lactase', "A person stops making lactase. Why is the lactose in milk not absorbed?",
      "Lactose is too large; without lactase it is not broken into glucose and galactose", ["Lactose is not soluble in water, so it cannot dissolve in the gut", "Lactose is digested in the mouth", "Lactose is absorbed only in the stomach"],
      "Only small, soluble molecules are absorbed."),
    M('lactase', "What does lactase break lactose into?",
      "Glucose and galactose", ["Amino acids", "Fatty acids and glycerol", "Maltose"], "Lactose is a disaccharide."),
    M('PKU', "People with PKU cannot break down phenylalanine, an amino acid. Why are they told to eat a low-protein diet?",
      "Proteins are digested into amino acids, so less protein means less phenylalanine absorbed", ["Protein contains glucose, which turns into phenylalanine in the blood", "Proteins block the small intestine", "Proteins cannot be digested at all"],
      "Link the diet to protein digestion and absorption."),
    M('protease', "Which enzymes break proteins into amino acids?",
      "Proteases, such as pepsin and trypsin", ["Lipases, such as those made in the pancreas", "Amylase and maltase", "Lactase"], "Pepsin works in the stomach; trypsin in the small intestine."),
    M('oestrogen', "Natural oestrogen is a lipid hormone. Why does it not work well when swallowed as a pill?",
      "It is broken down by lipase in the small intestine before it can be absorbed", ["It is destroyed by the hydrochloric acid in the stomach before it reaches the blood", "It is too small to be absorbed", "It is turned into insulin"],
      "Use the information: it is a lipid, so lipase digests it."),
    M('insulin pill', "Insulin is a protein. Why is it injected rather than swallowed?",
      "Proteases in the gut would digest it", ["It would be absorbed too quickly in the mouth", "It dissolves in water", "Swallowing it gives diabetes"],
      "Digested insulin would be amino acids and would not work as a hormone."),
    M('chymosin', "Chymosin turns milk protein into a solid in a baby's stomach. Why does this help?",
      "The solid stays in the stomach longer, giving more time for digestion", ["It makes the milk pass straight through to the large intestine faster", "It turns protein into fat", "It kills all bacteria"],
      "More time with the enzymes means more digestion."),
    M('chymosin', "Why do older children and adults not need chymosin?",
      "They eat solid food, not a diet of only milk", ["They have no stomach acid at all, so the milk cannot be digested", "They cannot digest protein", "They make more lactose"],
      "Babies' diet is mostly or entirely milk."),
    M('less substrate', "A person eats less starch. What happens to the amount of glucose released into the blood from digestion?",
      "It falls", ["It rises", "It stays the same", "It doubles"], "Less substrate means less product."),
    M('large molecules', "Why must large food molecules be digested before absorption?",
      "They are too large to pass through the wall of the small intestine", ["They are too small to be absorbed until they have been joined together into chains", "They are digested to make them insoluble", "They contain no energy"],
      "Small, soluble molecules can pass into the blood."),
    M('common errors', "A student writes about stomach acid when the passage says the hormone is a lipid. What is the better answer?",
      "It is digested by lipase", ["It is digested by amylase", "It is digested by maltase", "It is not digested at all"],
      "Use the information in the passage."),
    M('common errors', "A student writes: 'Lactase deficiency stops digestion.' What is missing?",
      "The consequence: lactose is not broken down, so it is not absorbed", ["The name of the organ that makes lactase in the body", "The pH of the stomach", "The colour of milk"],
      "Go from the enzyme to what happens to absorption.")
  ], { date: '2026-10-13', dropped: [] });
})();
