/* Group G19 mastery bank: More blood, heart and circulation (Grade 8 block).
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


  /* ====================================================================== HBI-EXPLAIN-HEART-WALLS-AND-VALVES */
  T('HBI-EXPLAIN-HEART-WALLS-AND-VALVES', 'Explain chamber wall thickness and heart valves by their function', [
    M('thickest', "Which chamber of the heart has the thickest wall?",
      "Left ventricle", ["Right ventricle", "Left atrium", "Right atrium"], "It pumps blood to the whole body."),
    M('left ventricle', "Why does the left ventricle have the thickest wall?",
      "It pumps blood to the whole body, which needs a high pressure", ["It holds more blood than any of the other chambers of the heart", "It pumps blood to the lungs", "It receives blood from the body"],
      "More muscle gives a stronger contraction and a higher pressure."),
    M('right ventricle', "Why is the wall of the right ventricle thinner than the wall of the left ventricle?",
      "It only pumps blood to the lungs, which are close and delicate", ["It pumps blood all round the body, so it must be light and quick", "It holds no blood", "It contains valves instead of muscle"],
      "A lower pressure is needed, and a high pressure would damage the lungs."),
    M('atria', "Why do the atria have the thinnest walls?",
      "They only push blood down into the ventricles", ["They pump blood all round the body at the highest pressure", "They pump blood to the lungs", "They have no muscle at all"],
      "The ventricles are just below them, so little force is needed."),
    M('muscle', "What does a thicker wall in a heart chamber show?",
      "More muscle, so a stronger contraction and higher pressure", ["More valves, so the blood can flow in both directions", "More blood stored", "Fewer blood vessels"],
      "Link thickness to muscle and pressure."),
    M('rank', "Which order lists the chambers from thickest wall to thinnest?",
      "Left ventricle, right ventricle, atria", ["Right ventricle, left ventricle, atria", "Atria, right ventricle, left ventricle", "Left ventricle, atria, right ventricle"],
      "The atria are thinnest, not the right ventricle."),
    { skill: 'match widths', gen: function () {
      var lv = pick([1.2, 1.4, 1.5, 1.6]), rv = pick([0.4, 0.5, 0.6]), at = pick([0.1, 0.2]);
      return mq("The walls of the four chambers of a heart were measured. They were " + at + " cm, " + at + " cm, " + rv + " cm and " + lv + " cm thick. Which chamber had the wall that was " + rv + " cm thick?",
        "Right ventricle", ["Left ventricle", "Left atrium", "Right atrium"], "The left ventricle is thickest (" + lv + " cm), then the right ventricle (" + rv + " cm). The atria are thinnest (" + at + " cm).");
    } },
    F("some random draws gave unrealistic walls (a 0.6 cm left ventricle, or 2 cm); now picks realistic pairs", { skill: 'ratio', gen: function () {
      var pr = pick([[1.2, 0.4], [1.5, 0.5], [1.2, 0.3], [1.6, 0.4], [1.5, 0.3], [1.0, 0.5]]), lv = pr[0], rv = pr[1], k = Math.round(lv / rv);
      return nq("The wall of a left ventricle is " + lv + " cm thick. The wall of the right ventricle is " + rv + " cm thick. How many times thicker is the left ventricle wall?", k, 'times',
        lv + " ÷ " + rv + " = " + k + ". The left ventricle has more muscle because it pumps blood to the whole body.");
    } }),
    M('valves', "What is the job of the valves in the heart?",
      "To stop blood flowing backwards", ["To pump blood out of the heart into the arteries", "To make the heart beat", "To add oxygen to the blood"], "Valves keep blood moving in one direction."),
    M('valves close', "What makes a valve close?",
      "Blood pushing back against it", ["A nerve impulse from the brain to the valve muscle", "The valve contracting", "Adrenaline"], "Valves are flaps; pressure of blood opens and shuts them."),
    M('high pressure', "A person has high blood pressure for many years. Why does the left ventricle wall get thicker?",
      "It must contract harder to pump against the high pressure, so its muscle grows", ["The blood is thicker, so it sticks to the wall and builds up a layer", "It stores more blood", "Fat is laid down inside it"],
      "First say it contracts harder, then that the muscle thickens."),
    M('common errors', "A student writes: 'The left ventricle pumps blood to the lungs.' What is correct?",
      "The right ventricle pumps blood to the lungs; the left pumps it to the body", ["Both ventricles pump blood to the lungs", "The atria pump blood to the lungs", "The left atrium pumps to the lungs"],
      "Right side: lungs. Left side: body."),
    M('common errors', "A student writes: 'Valves pump the blood.' What is correct?",
      "Valves only stop backflow; the heart muscle pumps", ["Valves pump blood in the veins", "Valves pump blood only in the atria", "Valves pump blood only when you exercise"],
      "Valves do not push blood."),
    M('common errors', "A student writes: 'The left ventricle is stronger.' What should be added?",
      "It has more muscle, so it produces a higher pressure", ["It has more valves", "It has more blood", "It is closer to the lungs"],
      "Mention muscle and pressure.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-EXPLAIN-CARDIOVASCULAR-DRUG-ACTION */
  T('HBI-EXPLAIN-CARDIOVASCULAR-DRUG-ACTION', 'Explain how beta-blockers and ACE inhibitors lower heart rate or pressure', [
    M('adrenaline', "What does adrenaline do when it binds to receptors on heart muscle cells?",
      "Makes the heart beat faster and more strongly", ["Makes the heart beat more slowly and much more weakly", "Stops the heart beating", "Narrows the valves"], "Noradrenaline from nerve endings has the same effect."),
    M('beta-blocker', "How do beta-blockers work?",
      "They bind to the receptors so adrenaline cannot bind", ["They stop adrenaline being made by the adrenal glands", "They break down adrenaline in the blood", "They add more receptors"],
      "They block the receptors; they do not stop adrenaline being released."),
    M('beta-blocker effect', "What is the effect of a beta-blocker on the heart?",
      "Heart rate and force of contraction fall, so blood pressure drops", ["The heart beats faster and harder, so more oxygen reaches the muscles", "The valves close", "The arteries become longer"],
      "This helps in angina, heart failure and high blood pressure."),
    S('uses', "Which conditions can beta-blockers be used to treat?", ["Angina", "Heart failure", "High blood pressure"], ["Diabetes", "Cholera"],
      "All three are helped by a slower, less forceful heartbeat."),
    M('ACE', "How do ACE inhibitors lower blood pressure?",
      "They stop ACE working, so less angiotensin II is made and vessels widen", ["They block the receptors for angiotensin II on the blood vessels so it cannot bind", "They make the heart beat faster", "They block adrenaline receptors"],
      "Blocking the receptors is what Losartan does, not an ACE inhibitor."),
    M('angiotensin', "What does angiotensin II do to blood vessels?",
      "Narrows them, raising blood pressure", ["Widens them, lowering blood pressure", "Makes them longer", "Makes them leak"], "With less angiotensin II, vessels widen and pressure falls."),
    M('Losartan', "How is Losartan different from an ACE inhibitor?",
      "It blocks angiotensin II receptors instead of stopping angiotensin II being made", ["It makes extra angiotensin II, which then widens the blood vessels and lowers the pressure", "It blocks adrenaline receptors", "It is an antibiotic"],
      "Losartan is an angiotensin II receptor blocker."),
    M('sport archery', "Why are beta-blockers banned in archery?",
      "They calm shaking and anxiety, giving an unfair advantage", ["They make the heart beat faster, so the archer has more energy to pull the bow", "They make the arrows lighter", "They improve eyesight"],
      "A steadier hand helps aim."),
    M('sport running', "Why would a beta-blocker be a disadvantage to a runner?",
      "It slows the heart, so less oxygen reaches the muscles", ["It speeds up the heart so much that the runner becomes tired very quickly", "It blocks breathing", "It makes the muscles heavier"],
      "Less blood pumped means less oxygen delivered."),
    M('receptor', "Why can a beta-blocker bind to the same receptor as adrenaline?",
      "It has a similar shape that fits the receptor", ["It is made from adrenaline that has been heated", "It is much larger than adrenaline", "It dissolves the receptor"],
      "It fits the receptor but does not activate it."),
    { skill: 'heart rate data', gen: function () {
      var before = rint(80, 100), drop = rint(10, 25), after = before - drop, pct = R.roundDp(drop / before * 100, 1);
      return nq("A patient's resting heart rate was " + before + " beats per minute. After taking a beta-blocker it was " + after + " beats per minute. Calculate the percentage decrease. Give your answer to one decimal place.", pct, '%',
        "Decrease = " + before + " − " + after + " = " + drop + ". " + drop + " ÷ " + before + " × 100 = " + pct + "%.", { tol: 0.1 });
    } },
    M('common errors', "A student writes: 'Beta-blockers stop adrenaline being released.' What is correct?",
      "They block the receptors, so adrenaline cannot bind", ["They destroy the adrenal glands", "They make adrenaline bind more strongly", "They turn adrenaline into insulin"],
      "Adrenaline is still released; it just cannot bind."),
    F("distractors were not plausible ('the colour of the tablet', 'the company that makes them'); replaced with real misconceptions", M('common errors', "A student writes: 'Beta-blockers lower blood pressure.' What is needed for a full answer?",
      "How: they block receptors, so heart rate and force fall", ["That they stop the adrenal glands from making any adrenaline at all", "That they make the blood vessels narrower", "That they speed up the heart"],
      "Give the mechanism and the effect.")),
    M('common errors', "A student says ACE inhibitors block angiotensin receptors. Which drug does that?",
      "Losartan (an angiotensin II receptor blocker)", ["A beta-blocker", "An antibiotic", "Insulin"], "ACE inhibitors stop angiotensin II being made.")
  ], { date: '2026-10-13', dropped: [] });
})();
