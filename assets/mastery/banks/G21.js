/* Group G21 mastery bank: More bones, muscles and joints (Grade 8 block).
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
  // Synovial joint: A bone, B cartilage, C synovial membrane, D synovial fluid, E capsule.
  var JOINT = (function () {
    var g = '<rect x="135" y="85" width="150" height="165" rx="40" fill="#dbeefb" stroke="#6b6b6b" stroke-width="7"/>';
    g += '<rect x="143" y="93" width="134" height="149" rx="33" fill="none" stroke="' + HI + '" stroke-width="2.5"/>';
    g += '<path d="M160 0 L160 120 C160 175 260 175 260 120 L260 0 Z" fill="#efe6d2" stroke="' + INK + '" stroke-width="2"/>';
    g += '<path d="M160 340 L160 205 C185 193 235 193 260 205 L260 340 Z" fill="#efe6d2" stroke="' + INK + '" stroke-width="2"/>';
    g += '<path d="M162 128 C164 172 256 172 258 128" fill="none" stroke="#6fa8dc" stroke-width="9"/><path d="M162 205 C186 194 234 194 258 205" fill="none" stroke="#6fa8dc" stroke-width="9"/>';
    g += lab(210, 45, 330, 35, 'A') + lab(250, 150, 330, 115, 'B') + lab(277, 200, 340, 210, 'C') + lab(210, 181, 90, 190, 'D', 'end') + lab(136, 130, 80, 100, 'E', 'end');
    return '<svg class="mc-svg mc-svg-small" viewBox="0 0 420 340" role="img" aria-label="Section through a synovial joint with five parts labelled A to E, not to scale">' + g + '</svg>';
  })();

  /* ====================================================================== HBI-SYNOVIAL-JOINT-STRUCTURE */
  T('HBI-SYNOVIAL-JOINT-STRUCTURE', 'Draw or label the parts of a synovial joint', [
    M('label', "The diagram shows a synovial joint. Which letter labels the cartilage?", "B", ["A", "C", "E"],
      "B is the smooth layer covering the end of the bone.", { svg: JOINT, family: 'g21-joint' }),
    M('label', "Using the same diagram, what is D?", "Synovial fluid", ["Synovial membrane", "Cartilage", "Capsule"],
      "D is the liquid that fills the space between the bones.", { svg: JOINT, family: 'g21-joint' }),
    M('label', "Using the same diagram, which letter labels the part that makes synovial fluid?", "C", ["B", "D", "E"],
      "C is the synovial membrane, which lines the joint.", { svg: JOINT, family: 'g21-joint' }),
    M('label', "Using the same diagram, what is E?", "The capsule", ["A tendon", "Cartilage", "Synovial fluid"],
      "E is the tough fibrous capsule around the joint.", { svg: JOINT, family: 'g21-joint' }),
    M('label', "Using the same diagram, what is A?", "Bone", ["Cartilage", "Muscle", "Ligament"],
      "A is one of the two bones that meet at the joint.", { svg: JOINT, family: 'g21-joint' }),
    M('definition', "What is a synovial joint?",
      "A freely movable joint between two bones", ["A joint that cannot move, such as those between the bones of the skull", "A place where a muscle joins a bone", "A bone with no blood supply"],
      "Knees, elbows, hips and shoulders are synovial joints."),
    M('cartilage', "Where is cartilage found in a synovial joint?",
      "Covering the end of each bone", ["Only on the end of the upper bone, never on the lower one", "Around the outside of the joint", "Inside the synovial fluid"],
      "Both bone ends are covered."),
    M('membrane', "What does the synovial membrane do?",
      "Lines the joint and makes synovial fluid", ["Joins the two bones together so that they cannot pull apart", "Covers the ends of the bones", "Fills the space between the bones"],
      "The membrane is the lining; the fluid is in the space."),
    M('ligament', "What joins the two bones of a joint together?",
      "Ligaments", ["Tendons", "Cartilage", "Synovial fluid"], "Tendons join muscle to bone."),
    M('ball and socket', "Which is a ball and socket joint?",
      "Hip", ["Knee", "Elbow", "Knuckle"], "The shoulder and hip are ball and socket joints; the knee and elbow are hinge joints."),
    M('ball and socket', "In a ball and socket joint, where must cartilage be drawn?",
      "On the rounded head and lining the socket", ["Only on the rounded head of the bone, since the socket does not move", "Only around the capsule", "Only in the middle of the bone"],
      "Draw a smooth layer over each bone surface in the joint."),
    M('drawing', "A drawing of a joint shows cartilage on only one bone end. What should be added?",
      "Cartilage on the end of the other bone", ["A second synovial membrane inside the cartilage layer", "A tendon", "More synovial fluid"],
      "Each bone end in the joint has cartilage."),
    M('common errors', "A student labels the liquid between the bones 'synovial membrane'. What is correct?",
      "Synovial fluid", ["Cartilage", "Capsule", "Ligament"], "The membrane is the lining that makes the fluid."),
    M('common errors', "A student labels the tough outer covering of a joint as a tendon. What should it be?",
      "The capsule (with ligaments)", ["Cartilage", "Synovial fluid", "Bone marrow"], "Tendons join muscles to bones, outside the joint.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-BONE-HEALTH-DIET-AND-OSTEOPOROSIS */
  T('HBI-BONE-HEALTH-DIET-AND-OSTEOPOROSIS', 'Explain dietary needs for bone and muscle and describe osteoporosis', [
    M('calcium', "Why is calcium needed for healthy bones?",
      "It is built into bone and makes it hard and strong", ["It helps the small intestine absorb vitamin D from food", "It makes muscles contract only", "It gives energy to bone cells"],
      "Calcium (with phosphate) makes bone hard."),
    M('vitamin D', "How does vitamin D help bones?",
      "It helps the small intestine absorb calcium", ["It is built into bone to make it hard", "It makes new bone cells directly", "It removes calcium from the blood"],
      "Link vitamin D to calcium absorption."),
    M('protein', "Why is protein needed for muscles and bones?",
      "To build muscle and to grow bone", ["To make the bones hard, in place of calcium and phosphate", "To absorb vitamin D", "To give bones their colour"],
      "Do not forget protein for muscle."),
    M('phosphate', "Which mineral is built into bone together with calcium?",
      "Phosphate", ["Iron", "Iodine", "Sodium"], "Calcium phosphate makes bone hard."),
    M('dairy', "Why is milk a good food for bones and muscles?",
      "It contains calcium, protein and some vitamin D", ["It contains a lot of fibre and vitamin C, which harden the bones", "It contains iron for haemoglobin", "It contains no fat"],
      "Milk, cheese and yoghurt are good sources."),
    M('osteoporosis', "What happens to bones in osteoporosis?",
      "They lose mass and become less dense, with larger spaces", ["They grow larger and heavier, with more calcium than normal", "They become softer and bend", "They turn into cartilage"],
      "Less dense bone is brittle and breaks easily."),
    S('symptoms', "Which of these can be caused by osteoporosis?", ["Fractures", "Back pain", "Loss of height"], ["Fever", "Hearing loss"],
      "A stooped posture is another sign."),
    M('menopause', "Why are women more likely to get osteoporosis after the menopause?",
      "Oestrogen levels fall, and oestrogen helps keep bones dense", ["Progesterone levels rise, and progesterone dissolves bone", "They eat more calcium", "They grow taller"],
      "Low oestrogen is a cause."),
    S('causes', "Which of these are causes of osteoporosis?", ["Old age", "Too little calcium in the diet", "Too little weight-bearing exercise"], ["Eating too much protein", "Drinking too much water"],
      "Too little vitamin D and low oestrogen after the menopause are also causes."),
    M('exercise', "How does weight-bearing exercise help prevent osteoporosis?",
      "It helps keep bones dense and strong", ["It removes calcium from the bones so they become lighter and easier to move", "It makes bones longer", "It has no effect on bone"],
      "Bones respond to the load placed on them."),
    { skill: 'density data', gen: function () {
      var a = rint(110, 130) / 100, l = rint(15, 30), b = R.roundDp(a * (100 - l) / 100, 2);
      return nq("A woman's bone density was " + a.toFixed(2) + " g/cm² at age 50 and " + b.toFixed(2) + " g/cm² at age 70. Calculate the percentage decrease. Give your answer to the nearest whole number.", Math.round((a - b) / a * 100), '%',
        "Decrease = " + a.toFixed(2) + " − " + b.toFixed(2) + " = " + R.roundDp(a - b, 2) + ". " + R.roundDp(a - b, 2) + " ÷ " + a.toFixed(2) + " × 100 ≈ " + Math.round((a - b) / a * 100) + "%. Lower density means bones break more easily.");
    } },
    M('common errors', "A student writes: 'Vitamin D makes bones.' What is correct?",
      "Vitamin D helps calcium to be absorbed, and calcium makes bone hard", ["Vitamin D is built into bone in place of calcium", "Vitamin D makes muscles", "Vitamin D is not needed"],
      "Link vitamin D to calcium."),
    M('common errors', "A student writes: 'Osteoporosis makes bones softer.' What is a better description?",
      "Bones become less dense and break easily", ["Bones become bendy like rubber and cannot hold the body up", "Bones become heavier", "Bones turn into muscle"],
      "Use the ideas of density and fractures."),
    M('common errors', "A student names calcium as important for bone but gives no reason. What should be added?",
      "It makes bone hard and strong", ["It is found in milk, cheese and yoghurt", "It is a metal", "It is white"],
      "Say what the nutrient does, not just where it is found.")
  ], { date: '2026-10-13', dropped: [] });
})();
