/* Group G27 mastery bank: Further body systems (Grade 9 block).
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


  /* ====================================================================== HBI-NAME-RECEPTOR-AND-SENSE */
  T('HBI-NAME-RECEPTOR-AND-SENSE', 'Name receptors and the senses or stimuli they detect', [
    M('receptor', "What is a receptor?",
      "A cell or group of cells that detects a stimulus and starts an impulse", ["A neurone that carries impulses from the brain to a muscle or gland", "A muscle that responds", "A hormone"],
      "The neurone carries the impulse; the receptor detects the stimulus."),
    M('five senses', "Which list gives the five senses?",
      "Sight, hearing, touch, taste and smell", ["Sight, hearing, balance, hunger and thirst", "Touch, pain, heat, cold and pressure", "Smell, taste, sleep, sight and memory"], "Balance is also detected, but the five senses are these."),
    S('skin', "Which stimuli are detected by receptors in the skin?", ["Temperature", "Pressure", "Pain"], ["Light", "Sound"], "Light is detected by the retina; sound by the cochlea."),
    M('retina', "Where are the light receptors of the eye?",
      "In the retina", ["In the lens", "In the cornea", "In the iris"], "The retina contains rods and cones."),
    M('rods', "What do rods detect?",
      "Dim light", ["Colour", "Sound", "Pressure"], "Rods work well in dim light but cannot tell colours apart."),
    M('cones', "What do cones detect?",
      "Colour", ["Dim light only", "Sound", "Temperature"], "Cones work in bright light."),
    M('three cones', "Why is it useful to have three types of cone?",
      "Each absorbs a different range of wavelengths, so together they cover many colours", ["Three cones are larger than one rod, so they collect more light in the dark", "They make the eye focus", "They detect sound"],
      "The three types respond best to blue, green and red light."),
    M('adaptation', "One hand has been in cold water and one in hot water. Both are then put in warm water. Why does it feel hot to one hand and cold to the other?",
      "Receptors get used to a constant stimulus", ["The warm water changes temperature as each hand enters it", "The hands have different numbers of bones", "The brain is damaged"],
      "Each hand compares the new water with what its receptors were used to."),
    M('organ vs receptor', "A question asks which structure detects light. Which answer is best?",
      "Receptor cells in the retina", ["The eye", "The optic nerve", "The brain"], "Name the structure, not the whole organ."),
    M('other senses', "Name two senses other than sight.",
      "Hearing and smell", ["Sight and vision", "Vision and seeing", "Light and colour"], "Sight and vision are the same sense."),
    M('sound', "Which receptors detect sound?",
      "Hair cells in the cochlea", ["Rods in the retina", "Taste buds on the tongue", "Pressure receptors in the skin"], "Sound vibrations move the fluid in the cochlea."),
    M('common errors', "A student calls a receptor a 'sensory neurone'. What is correct?",
      "The receptor detects the stimulus; the sensory neurone carries the impulse", ["They are the same thing", "The sensory neurone detects the stimulus; the receptor carries the impulse", "Receptors are found only in the brain"],
      "They have different jobs.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-COMPARE-RENAL-BLOOD-COMPOSITION */
  T('HBI-COMPARE-RENAL-BLOOD-COMPOSITION', 'Compare blood entering and leaving the kidney', [
    M('vessels', "Which blood vessel carries blood into the kidney?",
      "The renal artery", ["The renal vein", "The ureter", "The urethra"], "The renal vein carries blood away."),
    M('urea', "How does the urea in the renal vein compare with the renal artery?",
      "The renal vein has less urea", ["The renal vein has more urea", "They have the same amount of urea", "The renal vein has no blood"],
      "Urea is removed into the urine."),
    M('oxygen', "Why does blood in the renal vein have less oxygen than blood in the renal artery?",
      "The kidney cells use oxygen for respiration", ["The kidney removes oxygen into the urine with the urea", "The renal vein is wider", "Oxygen is turned into glucose"],
      "Do not forget that the kidney itself respires."),
    M('carbon dioxide', "How does the carbon dioxide in the renal vein compare with the renal artery?",
      "The renal vein has more carbon dioxide", ["The renal vein has less carbon dioxide", "They are the same", "There is none in either"],
      "The kidney cells release carbon dioxide in respiration."),
    M('glucose', "Which statement about glucose in the renal vein is correct?",
      "It may be slightly lower, because kidney cells use some in respiration", ["It is zero, because all the glucose is removed into the urine", "It is much higher than in the artery", "It is turned into urea"],
      "Glucose is filtered but then reabsorbed, so it is not all lost."),
    M('water and salts', "Why might the water and salt content of the renal vein be lower than in the renal artery?",
      "Some are removed in urine, depending on what the body needs", ["The kidney adds extra water and salt to the blood every time", "Water is turned into urea", "Salts are respired"],
      "The kidney adjusts how much is lost."),
    M('solvent', "In urine, what is the solvent?",
      "Water", ["Urea", "Salt", "Glucose"], "Urea and salts are dissolved in the water."),
    M('glomerulus', "Compare the blood vessel going into a glomerulus with the vessel coming out. Which carries more water, glucose and urea?",
      "The vessel going in", ["The vessel coming out", "Both carry the same", "Neither carries any"], "Some of each is filtered into the capsule."),
    F("the renal-vein urea was 30-60% of the artery value, which is unrealistically low for one pass through the kidney (now 75-90%), and the vein was always labelled Y (now X or Y at random)", { skill: 'table', gen: function () {
      var u1 = R.roundDp(rint(25, 40) / 100, 2), u2 = R.roundDp(u1 * rint(75, 90) / 100, 2), vein = pick(['X', 'Y']), art = vein === 'X' ? 'Y' : 'X', rows = vein === 'X' ? [['X', u2], ['Y', u1]] : [['X', u1], ['Y', u2]];
      return mq("The table shows the urea concentration of blood in two vessels joined to a kidney.<table class=\"mc-table\"><tr><th>Vessel</th><th>Urea in g per dm³</th></tr>" + rows.map(function (r) { return '<tr><td>' + r[0] + '</td><td>' + r[1].toFixed(2) + '</td></tr>'; }).join('') + "</table>Which vessel is the renal vein?", vein, [art, "Either; urea does not change"],
        vein + " has less urea (" + u2.toFixed(2) + " g per dm³), because urea has been removed into the urine. So " + vein + " is the renal vein.");
    } }),
    M('common errors', "A student writes only 'urea' as a difference between the renal artery and vein. What is missing?",
      "Which vessel has more: the artery has more urea than the vein", ["The colour of the urea", "The name of the kidney", "Nothing is missing"], "Always say which vessel has more or less."),
    M('common errors', "A student gives 'less urea' and 'less waste' as two differences. Why only one mark?",
      "They are the same idea", ["Urea is not a waste", "Neither is correct", "Only oxygen counts"], "Give a different second idea, such as less oxygen."),
    M('common errors', "A student says the renal vein has more urea than the renal artery. What is correct?",
      "The renal vein has less urea", ["The renal vein has twice as much", "The renal artery has no urea", "Urea is made in the kidney"], "The kidney removes urea from the blood.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-INTERPRET-ABNORMAL-BLOOD-CELL-COUNTS */
  T('HBI-INTERPRET-ABNORMAL-BLOOD-CELL-COUNTS', 'Interpret a raised or lowered blood cell count', [
    M('high white', "A person's white blood cell count is much higher than normal. What is the most likely reason?",
      "They are fighting an infection", ["They have just eaten a large meal", "They have too few red blood cells", "They are asleep"], "Inflammation, allergy or leukaemia can also raise it."),
    M('why more white', "Why does the body make more white blood cells during an infection?",
      "Phagocytes engulf pathogens and lymphocytes make antibodies", ["White cells carry extra oxygen to the infected tissues so that they heal faster", "White cells make the blood clot", "White cells make antibiotics"],
      "Mention phagocytosis or antibodies, not just 'fighting infection'."),
    M('low platelets', "What is the effect of a lower than normal platelet count?",
      "The blood clots poorly, so bleeding lasts longer", ["Less oxygen is carried to the cells, so the person feels tired", "The person makes fewer antibodies", "The blood becomes thicker"],
      "Platelets help blood clot."),
    M('infection risk', "Why does slow clotting increase the risk of infection?",
      "Wounds stay open longer, so pathogens have more time to enter", ["Platelets are needed to make the antibodies that destroy any bacteria", "Slow clotting makes more pathogens", "Slow clotting kills white cells"],
      "A clot seals the wound."),
    { skill: 'table', gen: function () {
      var wh = rint(4, 10), pat = wh * rint(2, 4) + rint(1, 3), pl = rint(150, 400);
      return mq("The table shows blood cell counts.<table class=\"mc-table\"><tr><th>Cell type</th><th>Healthy value</th><th>Patient</th></tr><tr><td>Red cells (millions per mm³)</td><td>5</td><td>5</td></tr><tr><td>White cells (thousands per mm³)</td><td>" + wh + "</td><td>" + pat + "</td></tr><tr><td>Platelets (thousands per mm³)</td><td>" + pl + "</td><td>" + pl + "</td></tr></table>What does the patient's result suggest?",
        "They have an infection, because their white cell count is raised", ["They will bleed for longer, because their platelet count is lower than the healthy value", "They are short of oxygen", "They are completely healthy"],
        "Compare each row with the healthy value: only the white cell count is different (" + pat + " compared with " + wh + ").");
    } },
    { skill: 'table', gen: function () {
      var pl = rint(200, 400), pat = Math.round(pl * rint(15, 40) / 100);
      return mq("A healthy platelet count is " + pl + " thousand per mm³. A patient's count is " + pat + " thousand per mm³. What problem is the patient most likely to have?",
        "Their blood will clot slowly, so cuts bleed for longer", ["Their blood will carry less oxygen, so they get tired easily", "They will make more antibodies", "They will have a raised white cell count"],
        "Platelets are needed for clotting. Fewer platelets do not change oxygen transport.");
    } },
    { skill: 'percentage', gen: function () {
      var wh = pick([5, 6, 7, 8]), pat = wh + rint(3, 12), pct = R.roundDp((pat - wh) / wh * 100, 1);
      return nq("A healthy white cell count is " + wh + " thousand per mm³. A patient's count is " + pat + " thousand per mm³. Calculate the percentage increase. Give your answer to one decimal place.", pct, '%',
        "Increase = " + (pat - wh) + ". " + (pat - wh) + " ÷ " + wh + " × 100 = " + pct + "%.", { tol: 0.1 });
    } },
    M('ratio', "During an infection, how does the ratio of red cells to white cells change?",
      "There are fewer red cells for each white cell", ["There are more red cells for each white cell", "The ratio does not change", "There are no white cells"],
      "More white cells are made, so the ratio of red to white falls."),
    M('compare first', "Before deciding what a blood test shows, what should you do?",
      "Compare each value with the healthy value given", ["Look only at the largest number in the table", "Add all the numbers together", "Ignore the healthy values"],
      "Only a value that differs from healthy shows a problem."),
    M('common errors', "A student says fewer platelets means less oxygen is carried. What is correct?",
      "Red blood cells carry oxygen; platelets help clotting", ["Platelets carry oxygen", "White cells carry oxygen", "Plasma carries all the oxygen"], "Do not mix up the cell types."),
    M('common errors', "A student writes only 'the person is fighting infection' for a high white cell count. What would improve the answer?",
      "Saying white cells engulf pathogens or make antibodies", ["Saying the person is ill", "Saying the number is big", "Saying the blood is red"], "Explain what the extra cells do."),
    M('other causes', "Other than infection, what else can cause a raised white cell count?",
      "Leukaemia", ["Anaemia from lack of iron", "Low platelets", "Dehydration only"], "Inflammation and allergies can also raise it.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-EXPLAIN-STEREOSCOPIC-VISION */
  T('HBI-EXPLAIN-STEREOSCOPIC-VISION', 'Explain stereoscopic vision and how it helps judge distance', [
    M('meaning', "What is stereoscopic vision?",
      "Seeing with two forward-facing eyes", ["Seeing in colour with three types of cone", "Seeing near and far objects clearly", "Seeing in dim light"],
      "Colour and focusing are done by other parts of the eye."),
    M('two views', "Why do the two eyes see slightly different images?",
      "Each eye sees the object from a slightly different angle", ["One eye sees in colour and the other eye sees only in black and white", "One eye is always bigger", "The lenses are different colours"],
      "The eyes are a few centimetres apart."),
    M('brain', "What does the brain do with the two views?",
      "Combines them into one 3D image", ["Ignores the view from the weaker eye", "Turns them into sound", "Makes them both flat"], "This gives a sense of depth."),
    M('use', "How does stereoscopic vision help a person catch a ball?",
      "It helps judge the ball's distance and speed", ["It makes the ball look a brighter colour", "It makes the ball move slower", "It makes the hands faster"],
      "Depth and distance are judged better with two eyes."),
    M('one eye', "A person can see with only one eye. What problem might they have?",
      "Judging distance is harder", ["They cannot see the ball at all", "They cannot see colours", "They cannot see in bright light"],
      "They can see the ball but judge its distance less well."),
    M('fair test', "Which is the fairest way to test whether two eyes help catching?",
      "The same people catch with two eyes and then with one eye, with many repeats", ["Different people catch with one eye and with two eyes, and each person throws only once", "One person catches once with each", "Only people with one eye are tested"],
      "Using the same people removes differences in skill."),
    M('measure', "In a catching investigation, what should be measured?",
      "The number of catches out of ten throws", ["The colour of the ball", "The height of each student", "The weather"], "Say what is counted."),
    M('control', "Which variable should be kept the same in a catching investigation?",
      "The distance the ball is thrown from", ["Whether one eye or two eyes are used", "The number of catches", "The person's eye colour"],
      "Only the number of eyes used should change."),
    M('predators', "Why do predators such as owls have forward-facing eyes?",
      "To judge the distance to prey", ["To see behind them while they fly", "To see in colour", "To look bigger"], "Stereoscopic vision helps judge depth."),
    M('MCQ trap', "Which is NOT a feature of stereoscopic vision?",
      "Seeing in colour", ["Judging distance", "Judging depth", "Using two eyes"], "Colour vision depends on cones, not on having two eyes."),
    M('common errors', "A student writes: 'Two eyes see more.' What should be added?",
      "Each eye sees a slightly different view, and the brain combines them", ["Two eyes can see much further into the distance than one eye can on its own", "Two eyes see more colours", "Nothing; this is enough"],
      "Explain the different views."),
    M('common errors', "A student uses different people for the one-eye and two-eye tests. Why is this a problem?",
      "Differences in catching skill could affect the results", ["It makes the test take much longer than one lesson to finish", "It uses fewer balls", "Nothing is wrong"], "The same people should do both.")
  ], { date: '2026-10-13', dropped: [] });
})();
