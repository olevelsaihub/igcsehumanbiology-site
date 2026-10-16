/* Group G10 mastery bank: Nerves, senses, hormones and drugs (A-Grade Block 10).
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
  // Brain from the side, front on the left: P cerebrum, Q cerebellum, R medulla, S hypothalamus, T pituitary.
  var BRAIN = '<svg class="mc-svg mc-svg-small" viewBox="0 0 460 340" role="img" aria-label="Side view of the brain, front on the left, with five areas labelled P to T">' +
    '<ellipse cx="330" cy="242" rx="55" ry="34" fill="#e6c1c6" stroke="' + INK + '" stroke-width="2"/>' +
    '<path d="M300 230 Q330 238 380 228 M292 248 Q330 258 382 246 M300 264 Q330 270 370 262" fill="none" stroke="' + INK + '" stroke-width="1"/>' +
    '<polygon points="245,205 285,205 290,320 262,320" fill="#ead0b8" stroke="' + INK + '" stroke-width="2"/>' +
    '<path d="M70 170 Q60 60 200 45 Q350 35 390 140 Q400 200 340 212 L120 212 Q75 208 70 170 Z" fill="#f2d4d7" stroke="' + INK + '" stroke-width="2"/>' +
    '<path d="M110 120 Q140 100 130 80 M170 70 Q190 110 230 90 M260 70 Q270 110 320 100 M120 170 Q170 150 200 170 Q240 190 280 160 M320 160 Q350 130 370 150" fill="none" stroke="' + INK + '" stroke-width="1.2"/>' +
    '<ellipse cx="215" cy="208" rx="18" ry="9" fill="#c9a0d6" stroke="' + INK + '" stroke-width="1.5"/>' +
    '<line x1="210" y1="216" x2="206" y2="228" stroke="' + INK + '" stroke-width="2"/><circle cx="205" cy="236" r="9" fill="#a77fc0" stroke="' + INK + '" stroke-width="1.5"/>' +
    lab(140, 110, 40, 60, 'P', 'end') + lab(350, 245, 425, 250, 'Q') + lab(276, 290, 425, 300, 'R') + lab(214, 208, 110, 270, 'S', 'end') + lab(202, 240, 110, 312, 'T', 'end') + '</svg>';
  // Horizontal section of the eye, front on the left: J cornea, K iris, L lens, M retina, N optic nerve, P fovea.
  var EYE = '<svg class="mc-svg mc-svg-small" viewBox="0 0 470 320" role="img" aria-label="Section through the eye, front on the left, with six parts labelled J to P">' +
    '<rect x="372" y="170" width="70" height="26" fill="#f1d9a9" stroke="' + INK + '" stroke-width="2"/>' +
    '<path d="M163 89 A120 120 0 1 1 163 231" fill="#fff" stroke="' + INK + '" stroke-width="4"/>' +
    '<path d="M173 87 A114 114 0 1 1 173 233" fill="none" stroke="#6b3d2e" stroke-width="5"/>' +
    '<path d="M177 91 A108 108 0 1 1 177 229" fill="#eef6fb" stroke="#e08a3c" stroke-width="5"/>' +
    '<path d="M163 89 Q95 160 163 231" fill="#eaf4fb" stroke="' + INK + '" stroke-width="3"/>' +
    '<circle cx="367" cy="140" r="5" fill="#b8541c"/>' +
    '<line x1="185" y1="108" x2="185" y2="117" stroke="' + INK + '"/><line x1="185" y1="203" x2="185" y2="212" stroke="' + INK + '"/>' +
    '<ellipse cx="183" cy="100" rx="11" ry="9" fill="#8b5a44"/><ellipse cx="183" cy="220" rx="11" ry="9" fill="#8b5a44"/>' +
    '<ellipse cx="187" cy="160" rx="17" ry="44" fill="#cfe3f5" stroke="' + INK + '" stroke-width="2"/>' +
    '<line x1="166" y1="96" x2="166" y2="136" stroke="#5f8a36" stroke-width="7"/><line x1="166" y1="184" x2="166" y2="224" stroke="#5f8a36" stroke-width="7"/>' +
    lab(131, 160, 40, 160, 'J', 'end') + lab(166, 118, 110, 50, 'K', 'end') + lab(190, 185, 110, 285, 'L', 'end') + lab(314, 68, 360, 25, 'M') + lab(425, 190, 440, 250, 'N') + lab(367, 140, 440, 110, 'P') + '</svg>';
  // Motor neurone: W nucleus, X myelin sheath, Y axon, Z synaptic knob.
  var NEUR = (function () {
    var g = '<line x1="100" y1="85" x2="470" y2="85" stroke="' + INK + '" stroke-width="4"/>', i;
    [[40, 40], [30, 85], [42, 130], [80, 35], [85, 138]].forEach(function (d) { g += '<line x1="70" y1="85" x2="' + d[0] + '" y2="' + d[1] + '" stroke="' + INK + '" stroke-width="3"/><line x1="' + d[0] + '" y1="' + d[1] + '" x2="' + (d[0] - 10) + '" y2="' + (d[1] - 8) + '" stroke="' + INK + '" stroke-width="2"/><line x1="' + d[0] + '" y1="' + d[1] + '" x2="' + (d[0] + 4) + '" y2="' + (d[1] + 12 * (d[1] > 85 ? 1 : -1)) + '" stroke="' + INK + '" stroke-width="2"/>'; });
    g += '<circle cx="70" cy="85" r="30" fill="#f3d9c4" stroke="' + INK + '" stroke-width="2"/><circle cx="70" cy="85" r="11" fill="#8b5a44"/>';
    for (i = 0; i < 6; i++) g += '<rect x="' + (125 + i * 55) + '" y="76" width="42" height="18" rx="8" fill="#fff3b0" stroke="' + INK + '" stroke-width="1.5"/>';
    [[515, 50], [528, 85], [515, 120]].forEach(function (k) { g += '<line x1="470" y1="85" x2="' + k[0] + '" y2="' + k[1] + '" stroke="' + INK + '" stroke-width="3"/><circle cx="' + k[0] + '" cy="' + k[1] + '" r="7" fill="#f3d9c4" stroke="' + INK + '" stroke-width="2"/>'; });
    g += lab(70, 92, 110, 150, 'W') + lab(256, 94, 256, 150, 'X') + lab(173, 85, 173, 25, 'Y') + lab(520, 46, 545, 20, 'Z');
    return '<svg class="mc-svg" viewBox="0 0 580 170" role="img" aria-label="Motor neurone with four parts labelled W, X, Y and Z">' + g + '</svg>';
  })();

  /* ====================================================================== HBI-MATCH-BRAIN-AREA-TO-FUNCTION */
  T('HBI-MATCH-BRAIN-AREA-TO-FUNCTION', 'Identify brain regions and match them to their functions', [
    M('label the brain', "The diagram shows the brain from the side. Which letter labels the cerebellum?", "Q", ["P", "R", "S"],
      "Q is the small wrinkled part at the back, under the cerebrum.", { svg: BRAIN, family: 'g10-brain' }),
    M('label the brain', "Using the same diagram, which letter labels the medulla?", "R", ["P", "Q", "T"],
      "R is at the base of the brain, joining the spinal cord.", { svg: BRAIN, family: 'g10-brain' }),
    M('label the brain', "Using the same diagram, which part is labelled T?", "Pituitary gland", ["Hypothalamus", "Medulla", "Cerebellum"],
      "T is the small gland hanging below the hypothalamus (S).", { svg: BRAIN, family: 'g10-brain' }),
    M('label the brain', "Using the same diagram, which letter labels the area that monitors body temperature?", "S", ["P", "R", "T"],
      "S is the hypothalamus. It monitors temperature and the water content of the blood.", { svg: BRAIN, family: 'g10-brain' }),
    M('functions', "Which part of the brain controls heart rate and breathing rate?",
      "Medulla", ["Cerebellum", "Cerebrum", "Pituitary gland"], "The medulla controls these automatic actions."),
    M('functions', "Which part of the brain coordinates muscle movement and balance?",
      "Cerebellum", ["Cerebrum", "Medulla", "Hypothalamus"], "The cerebellum controls balance, posture and coordination."),
    M('functions', "Which part of the brain is used for memory, language and conscious thought?",
      "Cerebral hemispheres (cerebrum)", ["Cerebellum", "Medulla", "Pituitary gland"], "The large wrinkled cerebrum controls conscious thought and voluntary actions."),
    M('functions', "Which part of the brain monitors the water content of the blood?",
      "Hypothalamus", ["Cerebellum", "Medulla", "Cerebrum"], "The hypothalamus monitors blood water (osmoregulation); the pituitary then releases ADH."),
    M('pituitary', "What does the pituitary gland do?",
      "Releases hormones such as ADH into the blood", ["Monitors body temperature and controls sweating", "Controls balance and posture", "Controls breathing and heart rate"], "The pituitary is an endocrine gland at the base of the brain."),
    M('voluntary movement', "A person decides to pick up a pen. Which area sends impulses to the arm muscles?",
      "The motor area of the cerebral hemispheres", ["The medulla, which controls automatic actions", "The hypothalamus, which controls temperature", "The pituitary gland, which releases hormones"],
      "Voluntary movements start in the motor area of the cerebrum."),
    M('common errors', "A student says the pituitary gland controls body temperature. What is correct?",
      "The hypothalamus monitors temperature; the pituitary releases hormones", ["The cerebellum monitors temperature; the pituitary controls balance", "The medulla monitors temperature; the pituitary controls breathing", "The pituitary monitors temperature and also controls memory"],
      "Do not mix up the hypothalamus and the pituitary."),
    M('common errors', "A student confuses the cerebrum and the cerebellum. Which statement is correct?",
      "The cerebrum is the large top part; the cerebellum is the small part at the back", ["The cerebellum is the large top part; the cerebrum is the small part at the back", "The cerebrum and the cerebellum are two names for the same part", "The cerebrum is at the base; the cerebellum hangs below the hypothalamus"],
      "The names look alike, so link each to its position and size.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-IDENTIFY-EYE-PARTS-AND-ROLES */
  T('HBI-IDENTIFY-EYE-PARTS-AND-ROLES', 'Identify parts of the eye and state their functions', [
    M('label the eye', "The diagram shows a section through the eye. Which letter labels the cornea?", "J", ["K", "L", "M"],
      "J is the clear, curved front window of the eye.", { svg: EYE, family: 'g10-eye' }),
    M('label the eye', "Using the same diagram, which letter labels the iris?", "K", ["J", "L", "P"],
      "K is the ring of muscle in front of the lens; the gap in its centre is the pupil.", { svg: EYE, family: 'g10-eye' }),
    M('label the eye', "Using the same diagram, which part is labelled P?", "Fovea", ["Blind spot", "Lens", "Iris"],
      "P is a small area of the retina opposite the lens: the fovea, where the image is sharpest.", { svg: EYE, family: 'g10-eye' }),
    M('label the eye', "Using the same diagram, which part is labelled N?", "Optic nerve", ["Retina", "Choroid", "Cornea"],
      "N leaves the back of the eye and carries impulses to the brain.", { svg: EYE, family: 'g10-eye' }),
    M('roles', "Which part of the eye refracts (bends) light the most?",
      "Cornea", ["Iris", "Pupil", "Retina"], "The cornea does most of the bending; the lens fine-tunes the focus."),
    M('roles', "What does the iris do?",
      "Controls the size of the pupil, and so how much light enters", ["Bends light so that it focuses on the retina", "Turns light into electrical impulses", "Carries impulses from the retina to the brain"],
      "The iris controls the amount of light, not the focus."),
    M('roles', "Which part contains rods and cones that turn light into electrical impulses?",
      "Retina", ["Choroid", "Sclera", "Lens"], "The retina is the light-sensitive layer at the back of the eye."),
    M('blind spot', "Why can light falling on the blind spot not be detected?",
      "There are no rods or cones where the optic nerve leaves the eye", ["It has the most cones, so it is too bright to see", "The choroid covers it with a dark layer of blood", "The iris blocks the light from reaching that place"],
      "The blind spot has no receptor cells."),
    M('choroid', "What does the choroid do?",
      "Its blood vessels bring oxygen and nutrients to the retina", ["It turns light into impulses for the brain", "It changes the shape of the lens", "It is the tough white outer coat of the eye"],
      "The choroid is the dark layer with blood vessels; the sclera is the tough white coat."),
    S('focusing parts', "Which parts of the eye refract light so that it focuses on the retina?", ["Cornea", "Lens"], ["Iris", "Pupil", "Retina"],
      "The cornea and lens bend light. The iris and pupil control how much light enters."),
    M('ear parts', "In a table of eye and ear parts, which ear part turns vibrations into nerve impulses?",
      "Cochlea", ["Eardrum", "Ossicles", "Semicircular canals"], "The cochlea changes vibrations into impulses; the semicircular canals help with balance."),
    M('common errors', "A student says the optic nerve 'sees' the image. What is correct?",
      "It carries impulses to the brain, which interprets them", ["It focuses the image on the retina", "It controls the size of the pupil", "It changes light into impulses"], "The retina detects light; the brain interprets the impulses.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-MATCH-HORMONE-SOURCE-AND-EFFECT */
  T('HBI-MATCH-HORMONE-SOURCE-AND-EFFECT', 'Match hormones to glands and effects, and contrast them with nerves', [
    M('glands', "Which gland makes insulin and glucagon?",
      "Pancreas", ["Liver", "Pituitary gland", "Thyroid gland"], "The pancreas makes both. The liver is where they act."),
    M('glands', "Which gland releases ADH?",
      "Pituitary gland", ["Adrenal gland", "Thyroid gland", "Pancreas"], "ADH from the pituitary controls the water content of the blood."),
    M('glands', "Which gland releases adrenaline?",
      "Adrenal gland", ["Pituitary gland", "Thyroid gland", "Pancreas"], "The adrenal glands sit on top of the kidneys."),
    M('thyroxine', "What does thyroxine control?",
      "The metabolic rate", ["The water content of the blood", "The blood glucose level", "The size of the pupil"], "Thyroxine from the thyroid gland controls the metabolic rate."),
    M('insulin and glucagon', "Which statement about insulin and glucagon is correct?",
      "Insulin lowers blood glucose; glucagon raises it", ["Insulin raises blood glucose; glucagon lowers it", "Both are digestive enzymes made by the pancreas", "Both are made by the liver to store glucose"],
      "They are hormones with opposite effects, not enzymes."),
    S('adrenaline', "Which of these are effects of adrenaline?", ["Heart rate rises", "Pupils widen", "Blood glucose rises"], ["More blood goes to the gut", "Breathing slows down"],
      "Adrenaline prepares the body for action: faster heart and breathing, wider pupils, more glucose, more blood to muscles."),
    M('system', "Glands that release hormones into the blood make up which system?",
      "The endocrine system", ["The nervous system", "The digestive system", "The lymphatic system"], "The endocrine (hormonal) system includes the pituitary, thyroid, adrenal glands and pancreas."),
    M('nerves vs hormones', "Which row correctly compares nerves and hormones?",
      "Nerves: electrical, fast, short-lived. Hormones: chemical, slower, longer-lasting", ["Nerves: chemical, slow, long-lasting. Hormones: electrical, fast, short-lived", "Nerves: electrical, slow, long-lasting. Hormones: chemical, fast, short-lived", "Nerves: chemical, fast, short-lived. Hormones: electrical, slower, longer-lasting"],
      "Nerve impulses are electrical; hormones are chemicals in the blood."),
    M('speed', "Why are hormonal responses slower than nervous responses?",
      "Hormones travel in the blood, so they can only move as fast as the blood flows", ["Hormones are very large molecules, so they move slowly through the nerves", "Hormones must be digested before they can act on the target organ", "Hormones are made only at night, so the response is delayed"],
      "Link the speed to transport in the blood."),
    M('mixed table', "In a mixed table of body parts, which part forms urea?",
      "Liver", ["Pancreas", "Cochlea", "Haemoglobin"], "The liver breaks down excess amino acids and forms urea."),
    M('common errors', "A student writes: 'The liver makes insulin.' What is correct?",
      "The pancreas makes insulin; the liver is where it acts", ["The kidneys make insulin; the liver stores it", "The pituitary makes insulin; the liver releases it", "The stomach makes insulin; the liver digests it"], "Insulin is made in the pancreas."),
    M('common errors', "A student confuses thyroxine and adrenaline. Which pairing is correct?",
      "Thyroxine: metabolic rate. Adrenaline: 'fight or flight'", ["Thyroxine: 'fight or flight'. Adrenaline: metabolic rate", "Thyroxine: blood water. Adrenaline: blood glucose only", "Thyroxine: digestion. Adrenaline: growth of bones"], "Thyroxine sets the metabolic rate; adrenaline prepares the body for action.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-DRAW-LABEL-NEURONE-PARTS */
  T('HBI-DRAW-LABEL-NEURONE-PARTS', 'Draw, label and compare the structure of a neurone', [
    M('label the neurone', "The diagram shows a motor neurone. Which letter labels the myelin sheath?", "X", ["W", "Y", "Z"],
      "X labels one of the fatty segments wrapped around the axon.", { svg: NEUR, family: 'g10-neur' }),
    M('label the neurone', "Using the same diagram, which part is labelled Y?", "Axon", ["Dendrite", "Myelin sheath", "Nucleus"],
      "Y is the long thin fibre that carries impulses away from the cell body.", { svg: NEUR, family: 'g10-neur' }),
    M('label the neurone', "Using the same diagram, which letter labels a synaptic knob?", "Z", ["W", "X", "Y"],
      "Z is at the end of one of the branches at the far end of the axon.", { svg: NEUR, family: 'g10-neur' }),
    M('label the neurone', "Using the same diagram, which part is labelled W?", "Nucleus", ["Synaptic knob", "Myelin sheath", "Axon"],
      "W is inside the cell body.", { svg: NEUR, family: 'g10-neur' }),
    M('myelin', "What does the myelin sheath do?",
      "It insulates the axon and makes impulses travel faster", ["It makes the neurotransmitter and stores it in vesicles", "It contains the nucleus and controls the neurone", "It receives impulses from other neurones"],
      "Say 'insulates' and 'faster', not just 'protects'."),
    M('axon', "In which direction does the axon carry impulses?",
      "Away from the cell body", ["Towards the cell body", "In both directions at once", "Only within the cell body"], "Dendrites bring impulses towards the cell body; the axon carries them away."),
    M('dendrites', "What are dendrites?",
      "Short branches from the cell body that receive impulses", ["The fatty layer wrapped around the axon", "The swellings at the end of the axon", "The gaps between two neurones"], "Dendrites receive impulses from other neurones."),
    M('drawing', "A student draws a motor neurone. Which feature of the drawing is wrong?",
      "The nucleus is drawn in the middle of the axon", ["The axon is drawn much longer than the cell body", "The myelin sheath is drawn around the axon", "The dendrites are drawn on the cell body"],
      "The nucleus belongs inside the cell body."),
    M('motor neurone shape', "Where is the cell body of a motor neurone?",
      "At one end, with dendrites on it", ["Part-way along the fibre", "At the end of the axon among the synaptic knobs", "Outside the neurone, in the spinal cord fluid"], "A sensory neurone has its cell body part-way along."),
    M('compare', "A healthy neurone is compared with one from a person with Alzheimer's disease. Which is a good comparison?",
      "The damaged neurone has fewer, shorter branches and fewer synaptic knobs", ["The damaged neurone is smaller", "The damaged neurone looks different", "The damaged neurone is worse than the healthy one"],
      "Name the feature: number of branches, their length, number of synaptic knobs."),
    M('synaptic knobs', "What is found at the far end of a motor neurone's axon?",
      "Branches ending in synaptic knobs", ["The cell body and the nucleus", "Dendrites that receive impulses", "The myelin sheath and the nucleus"], "Synaptic knobs pass the signal on to the next cell."),
    M('common errors', "A student says the myelin sheath 'protects the neurone'. What should be added?",
      "It insulates the axon, so impulses travel faster", ["It digests the neurotransmitter after it acts", "It holds the nucleus in place in the axon", "It joins one neurone to the next neurone"], "Give the insulation and speed idea.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-REFLEX-ARC-AND-NEURONE-TYPES */
  T('HBI-REFLEX-ARC-AND-NEURONE-TYPES', 'Define a reflex and name the neurones on the receptor-to-effector path', [
    M('reflex', "What is a reflex action?",
      "A fast, automatic response to a stimulus, without thinking first", ["A slow response that you decide on only after thinking about it first", "A response controlled only by hormones in the blood", "Any movement made by a muscle in the arm"],
      "A good definition has three ideas: fast, automatic, a response to a stimulus."),
    M('purpose', "Why are most reflexes useful?",
      "They protect the body from harm", ["They help the body to learn new skills", "They make hormones act more quickly", "They let us think more clearly"], "For example, pulling a hand away from a hot plate."),
    M('route', "Which is the correct route of a reflex arc?",
      "Receptor, sensory neurone, relay neurone, motor neurone, effector", ["Receptor, motor neurone, relay neurone, sensory neurone, effector", "Effector, sensory neurone, relay neurone, motor neurone, receptor", "Receptor, relay neurone, sensory neurone, motor neurone, effector"],
      "Sensory carries in, relay connects, motor carries out."),
    M('sensory', "What does a sensory neurone do?",
      "Carries impulses from a receptor to the CNS", ["Carries impulses from the CNS to a muscle", "Links neurones inside the spinal cord", "Releases hormones into the blood"], "Sensory neurones bring impulses in to the brain or spinal cord."),
    M('motor', "Which neurone carries impulses to a muscle so that it contracts?",
      "Motor neurone", ["Sensory neurone", "Relay neurone", "Receptor neurone"], "Motor neurones carry impulses from the CNS to effectors."),
    M('relay', "Where is a relay neurone found?",
      "Inside the CNS, linking the sensory and motor neurones", ["In the skin, next to the receptor that detects the stimulus", "In the muscle, next to the effector", "In the blood, carrying the impulse"], "Relay neurones are also called connector or intermediate neurones."),
    M('effector', "What is an effector?",
      "A muscle that contracts or a gland that secretes", ["A cell that detects a stimulus", "A neurone inside the spinal cord", "The gap between two neurones"], "Effectors carry out the response."),
    M('receptor', "What does a receptor do?",
      "Detects a stimulus and changes it into electrical impulses", ["Carries impulses from the spinal cord to a muscle so that it contracts", "Contracts to move the body away from danger", "Releases neurotransmitter into a synapse"], "Receptors are in the sense organs."),
    M('CNS', "What makes up the central nervous system (CNS)?",
      "The brain and the spinal cord", ["The brain and all the nerves", "The spinal cord and the muscles", "The sense organs and the brain"], "The CNS is the brain and spinal cord."),
    M('differences', "Which is a correct difference between sensory and motor neurones?",
      "A sensory neurone has its cell body part-way along; a motor neurone has it at one end", ["A motor neurone has its cell body part-way along; a sensory neurone has it at one end", "A sensory neurone has a long axon; a motor neurone has no axon", "A motor neurone has no myelin; a sensory neurone has no nucleus"],
      "Say which neurone has which feature."),
    M('differences', "Which statement compares the fibres of sensory and motor neurones correctly?",
      "Sensory: long dendron, short axon. Motor: short dendrites, long axon", ["Sensory: short dendron, long axon. Motor: long dendrites, short axon", "Both have a long dendron and a long axon", "Both have no dendrites and a very short axon"],
      "In a sensory neurone the long fibre runs from the receptor to the cell body."),
    M('common errors', "In a reflex arc diagram, a student labels the neurone that touches the muscle as 'sensory'. What should it be?",
      "Motor neurone", ["Relay neurone", "Receptor", "Effector"], "The neurone that reaches the effector is the motor neurone.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-EXPLAIN-SYNAPTIC-TRANSMISSION-SEQUENCE */
  T('HBI-EXPLAIN-SYNAPTIC-TRANSMISSION-SEQUENCE', 'Describe how an impulse crosses a synapse', [
    M('names', "What is the junction between two neurones called?",
      "A synapse", ["A dendrite", "An axon", "A receptor"], "The tiny gap at the synapse is the synaptic cleft."),
    M('neurotransmitter', "What is a neurotransmitter?",
      "A chemical that carries the signal across a synapse", ["An electrical impulse that jumps straight across the synapse", "A hormone carried in the blood to a gland", "An enzyme that digests the neurone"], "Acetylcholine and dopamine are examples."),
    M('sequence', "Which is the correct order of events at a synapse?",
      "Impulse arrives, vesicles release transmitter, it diffuses across, binds to receptors, new impulse starts", ["Transmitter binds to receptors, impulse arrives, vesicles release transmitter, it diffuses across", "Impulse arrives, impulse jumps the gap, vesicles release transmitter in the next neurone", "Vesicles release transmitter, impulse arrives, receptors pump transmitter back across the gap"],
      "This is the full sequence of steps."),
    M('vesicles', "What happens to the vesicles when an impulse reaches the synaptic knob?",
      "They move to the membrane, fuse with it and release neurotransmitter", ["They burst inside the knob and destroy all of the neurotransmitter they hold", "They travel across the gap to the next neurone", "They bind to receptors on the same neurone"],
      "Release by fusing with the membrane is called exocytosis."),
    M('crossing', "How does the neurotransmitter cross the synaptic gap?",
      "By diffusion", ["By active pumping", "As an electrical impulse", "Carried by red blood cells"], "It diffuses from high to low concentration across the narrow gap."),
    M('receptors', "What does the neurotransmitter do when it reaches the next neurone?",
      "It binds to receptor molecules on the post-synaptic membrane", ["It enters the nucleus of the next neurone and changes its genes", "It travels along the axon as a chemical", "It is turned into a hormone and released"], "Binding to receptors starts a new impulse."),
    M('result', "What happens after the neurotransmitter binds to the receptors?",
      "A new electrical impulse starts in the next neurone", ["The first neurone makes more vesicles at once", "The impulse in the first neurone travels backwards", "The receptors release the transmitter into the blood"], "The signal continues as a new impulse."),
    M('acetylcholine', "Why is acetylcholine important in the brain?",
      "It carries the signal across synapses, so a new impulse starts", ["It gives neurones energy so that they can keep on respiring", "It forms the myelin sheath around axons", "It controls the water content of the blood"],
      "Without it, messages would stop at the gap."),
    M('exocytosis', "What is the release of neurotransmitter from vesicles called?",
      "Exocytosis", ["Osmosis", "Phagocytosis", "Diffusion"], "Exocytosis: vesicles fuse with the membrane and release their contents."),
    M('reflex arc', "In a reflex arc, where are synapses found?",
      "At each junction where one neurone meets the next", ["Only inside the receptor, between the rods and the cones", "Only inside the muscle, between the muscle fibres", "Inside the myelin sheath of each neurone"],
      "There is a synapse at each junction between neurones."),
    M('common errors', "A student writes: 'The electrical impulse crosses the gap.' What is correct?",
      "A chemical crosses the gap, and a new impulse starts afterwards", ["The impulse crosses the gap and then it turns into a hormone", "The impulse crosses by osmosis, carried by water", "Nothing crosses the gap; the neurones touch"], "The neurotransmitter crosses, not the impulse."),
    M('common errors', "A student calls the neurotransmitter 'a hormone'. What is it?",
      "A chemical released into a synapse", ["An enzyme that digests synapses", "A hormone released into the blood", "An electrical signal"], "Neurotransmitters act across a tiny gap, not through the blood.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-EXPLAIN-LENS-ACCOMMODATION */
  T('HBI-EXPLAIN-LENS-ACCOMMODATION', 'Explain how the eye focuses on near and distant objects', [
    M('near', "A person looks at a near object. What happens in the eye?",
      "Ciliary muscles contract, ligaments go slack, lens becomes thicker", ["Ciliary muscles relax, ligaments go tight, lens becomes thinner", "Ciliary muscles contract, ligaments go tight, lens becomes thinner", "Ciliary muscles relax, ligaments go slack, lens becomes thicker"],
      "For near objects the lens is thick and rounded, so it refracts light more."),
    M('distant', "A person looks from a near object to a distant one. What happens?",
      "Ciliary muscles relax, ligaments become tight, lens is pulled thinner", ["Ciliary muscles contract, ligaments become slack, lens becomes thicker", "Ciliary muscles relax, ligaments become slack, lens becomes thicker", "The iris contracts and the pupil gets smaller to focus the image"],
      "For distant objects the lens is thin and flat, so light is refracted less."),
    M('accommodation', "What does 'accommodation' mean for the eye?",
      "Changing the shape of the lens to focus near or distant objects", ["Changing the size of the pupil to suit bright light or dim light", "Turning light into impulses in the retina", "Moving the eyes together to judge distance"], "Accommodation is about focus, not light intensity."),
    M('why near', "Why must the lens be thicker for a near object?",
      "Rays from a near object spread out, so they must be refracted more to meet on the retina", ["Rays from a near object are parallel, so they must be refracted less", "A near object is brighter, so less light must be let in", "A near object is smaller, so the image must be made larger"],
      "Diverging rays need more bending."),
    M('ligaments', "What happens to the suspensory ligaments when the ciliary muscles relax?",
      "They become tight and pull the lens thinner", ["They contract and push the lens fatter", "They become slack and let the lens get thicker", "They relax and the lens moves forward"], "Ligaments are not muscles: they become tight or slack."),
    M('diameter', "As the lens becomes thicker, what happens to its diameter?",
      "It gets smaller", ["It gets larger", "It stays the same", "It doubles"], "A thicker lens is rounder and narrower."),
    M('power', "How does a thicker lens compare with a thinner one?",
      "It has a shorter focal length and is more powerful", ["It has a longer focal length and is less powerful", "It lets more light into the eye", "It makes the pupil smaller"], "A thicker lens bends light more."),
    M('table', "Which row shows the eye focusing on a distant object?",
      "Ciliary muscles: relaxed. Ligaments: tight. Lens: thin", ["Ciliary muscles: contracted. Ligaments: slack. Lens: thick", "Ciliary muscles: relaxed. Ligaments: slack. Lens: thick", "Ciliary muscles: contracted. Ligaments: tight. Lens: thin"],
      "Distant: relaxed, tight, thin."),
    M('whole process', "Which list shows the parts used, in order, when light from an object makes a clear image that is sent to the brain?",
      "Cornea, lens, retina, optic nerve, brain", ["Lens, cornea, optic nerve, retina, brain", "Iris, pupil, choroid, optic nerve, brain", "Retina, lens, cornea, optic nerve, brain"],
      "Cornea and lens refract light onto the retina; the optic nerve carries impulses to the brain."),
    M('refraction', "When the eye focuses on a distant object, how is the light affected by the lens?",
      "Light is refracted less", ["Light is refracted more", "Less light is let in", "More light is let in"], "Say 'refracted less', not 'less light'."),
    M('common errors', "A student says the suspensory ligaments contract. What is correct?",
      "Ligaments become tight or slack; only the ciliary muscles contract", ["The ligaments relax for distant objects and the iris contracts instead", "The lens contracts and the ligaments push it", "The ligaments contract only for near objects"], "Ligaments are not muscles."),
    M('common errors', "A student explains focusing by saying the pupil gets smaller. Why is this wrong?",
      "The iris and pupil control the amount of light, not the focus", ["The pupil gets larger, not smaller, when focusing", "The pupil is part of the lens and changes its shape", "The pupil only changes size when asleep"], "Focus depends on the lens shape.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-EYE-DEFECTS-AND-TREATMENT */
  T('HBI-EYE-DEFECTS-AND-TREATMENT', 'Explain eye defects and how they are corrected or treated', [
    M('short sight', "How does short sight affect vision?",
      "Distant objects look blurred", ["Near objects look blurred", "Everything looks too dark", "Colours cannot be seen"], "Short-sighted people see near objects clearly but distant ones are blurred."),
    M('short sight', "In short sight, where do the light rays from a distant object meet?",
      "In front of the retina", ["Behind the retina", "On the retina", "On the cornea"], "The eyeball is too long or the lens too strong, so light is refracted too much."),
    M('short sight', "How is short sight corrected?",
      "With a concave (diverging) lens", ["With a convex (converging) lens", "With a darker lens", "By removing the lens"], "A diverging lens spreads the rays so they meet on the retina."),
    M('long sight', "Which describes long sight?",
      "Near objects are blurred because light focuses behind the retina", ["Distant objects are blurred because light focuses in front of the retina", "Near objects are blurred because light focuses in front of the retina", "Distant objects are blurred because light focuses behind the retina"],
      "In long sight the eyeball is too short or the lens too weak."),
    M('long sight', "How is long sight corrected?",
      "With a convex (converging) lens", ["With a concave (diverging) lens", "With a cloudy lens", "With a lens transplant from a donor"], "A converging lens bends the rays more so they meet on the retina."),
    M('astigmatism', "What causes astigmatism?",
      "The cornea or lens is unevenly curved, so light is not focused properly", ["The lens becomes cloudy with protein, so less light passes through", "The optic nerve is damaged, so fewer impulses reach the brain", "The pupil is too small, so not enough light enters the eye"],
      "Uneven curvature blurs the image. Special lenses correct it."),
    M('cataract', "What is a cataract?",
      "A lens that has become cloudy", ["A growth on the front of the eye", "A cornea that is the wrong shape", "A retina with no rods or cones"], "Protein builds up in the lens, so it becomes cloudy."),
    M('cataract', "How does a cataract affect vision, and how is it treated?",
      "Less light reaches the retina so vision is misty; surgery replaces the lens", ["More light reaches the retina so vision is too bright; glasses darken it", "The image falls behind the retina; a convex lens corrects it", "The optic nerve is cut; a nerve transplant repairs it"],
      "Cataracts are treated by surgery to replace the cloudy lens."),
    M('transplant', "Why can a corneal transplant restore clear vision?",
      "The new cornea has a normal shape, so light is refracted correctly onto the retina", ["The new cornea makes extra rods and cones, so more light is detected", "The new cornea lets more light in, so the pupil can close", "The new cornea replaces the optic nerve, so impulses reach the brain"],
      "Normal shape means correct refraction."),
    M('transplant risks', "Which are risks of a corneal transplant?",
      "Infection and rejection", ["Short sight and long sight", "Cataracts and astigmatism", "Faster reactions and better hearing"], "Any transplant carries a risk of infection and rejection by the immune system."),
    S('glasses', "Which eye defects can be corrected by wearing glasses?", ["Short sight", "Long sight", "Astigmatism"], ["Cataracts", "A damaged optic nerve"],
      "Glasses change how light is refracted; they cannot clear a cloudy lens or repair a nerve."),
    M('common errors', "A student writes that myopia means long sight. What is correct?",
      "Myopia means short sight", ["Myopia means a cataract", "Myopia means astigmatism", "Myopia means colour blindness"], "Myopia is short sight; hypermetropia is long sight.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-EXPLAIN-DRUG-AND-ALCOHOL-EFFECTS */
  T('HBI-EXPLAIN-DRUG-AND-ALCOHOL-EFFECTS', 'Explain the effects and dangers of alcohol and other drugs', [
    M('depressant', "What kind of drug is alcohol, and what does it do to reaction time?",
      "A depressant; it increases reaction time", ["A stimulant; it decreases reaction time", "A depressant; it decreases reaction time", "A stimulant; it increases reaction time"], "Alcohol slows the nervous system, so reactions take longer."),
    M('driving', "Why is driving with a high blood alcohol level dangerous?",
      "Reactions are slower and the driver is less alert, so hazards are avoided too late", ["Alcohol makes the driver see better at night, so they choose to drive much too fast", "Alcohol is a stimulant, so the driver reacts much too quickly", "Alcohol stops the heart pumping, so the driver falls asleep at once"],
      "Explain the slower reactions, not just 'drunk'."),
    M('absorption', "Why does blood alcohol rise steeply soon after drinking?",
      "Alcohol is absorbed quickly into the blood from the stomach", ["Alcohol is made in the liver from glucose", "Alcohol is absorbed slowly from the large intestine over many hours", "Alcohol is made in the kidneys from urea"], "Alcohol is a small molecule and passes quickly into the blood."),
    M('liver', "What happens to alcohol after it is absorbed?",
      "The liver slowly breaks it down", ["The lungs break it down into oxygen", "The pancreas turns it into insulin", "The muscles store it as glycogen"], "The liver breaks alcohol down, which is why blood alcohol falls slowly."),
    M('liver damage', "How does long-term heavy drinking damage the liver?",
      "It causes scarring (cirrhosis), so the liver cannot remove toxins or make bile", ["It makes the liver much larger, so it removes toxins and makes bile far faster", "It turns the liver into fat, so it digests food more quickly", "It stops the liver making insulin, so glucose rises"],
      "Cirrhosis can also lead to liver cancer."),
    M('caffeine', "In a ruler-catch test, a person drinks coffee and the ruler falls a shorter distance before it is caught. What does this show?",
      "Caffeine is a stimulant that shortens reaction time", ["Caffeine is a depressant that lengthens reaction time", "Caffeine makes the ruler fall more slowly", "Caffeine has no effect on the nervous system"],
      "The shorter the distance, the faster the reaction."),
    { skill: 'ruler data', gen: function () {
      var a = [rint(14, 22), rint(14, 22), rint(14, 22)], b = [rint(9, 15), rint(9, 15), rint(9, 15)];
      var ma = (a[0] + a[1] + a[2]) / 3, mb = (b[0] + b[1] + b[2]) / 3, d = Math.round((ma - mb) * 10) / 10;
      return nq("A student catches a falling ruler three times before and three times after drinking a cola that contains caffeine.<br>Before: " + a.join(' cm, ') + " cm. After: " + b.join(' cm, ') + " cm.<br>How much shorter is the mean distance after drinking the cola? Give your answer to 1 decimal place.", d, 'cm',
        "Mean before = " + (a[0] + a[1] + a[2]) + " ÷ 3 = " + ma.toFixed(2) + " cm. Mean after = " + (b[0] + b[1] + b[2]) + " ÷ 3 = " + mb.toFixed(2) + " cm. Difference = " + d.toFixed(1) + " cm. A shorter distance means a faster reaction.",
        { display: d.toFixed(1), tol: 0.06 });
    } },
    S('cocaine', "Which of these are dangers of using cocaine?", ["Addiction", "Heart problems and stroke", "Anxiety and hallucinations"], ["Faster healing of wounds", "Lower risk of overdose"],
      "Cocaine is addictive and can cause heart problems, stroke, anxiety, hallucinations, brain damage and death."),
    M('other drugs', "Which is a danger of heroin?",
      "It is very addictive, and an overdose can stop breathing", ["It is a stimulant that makes reactions much faster", "It cures infections caused by bacteria", "It lowers blood cholesterol"], "Heroin depresses the nervous system, including breathing."),
    M('painkillers', "How do painkillers such as paracetamol work?",
      "They act on the nervous system to reduce pain signals reaching the brain", ["They kill the bacteria that cause the pain in the body tissues around a wound", "They make the liver break down the painful chemicals", "They block the blood supply to the painful area"],
      "Painkillers act on the nervous system; antibiotics act on bacteria."),
    M('mind', "Which of these drugs is least likely to affect mental health?",
      "Paracetamol", ["Cannabis", "Cocaine", "Heroin"], "Paracetamol and antibiotics do not affect mental health; cannabis, cocaine and heroin can."),
    M('common errors', "A student writes: 'Alcohol speeds up reactions.' What is correct?",
      "Alcohol is a depressant, so it slows reactions", ["Alcohol is a stimulant, so it slows reactions", "Alcohol has no effect on reactions", "Alcohol speeds up reactions only in drivers"], "Alcohol slows the nervous system.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-EYE-IMAGE-FORMATION-AND-OPTIC-NERVE */
  T('HBI-EYE-IMAGE-FORMATION-AND-OPTIC-NERVE', 'Show how an image forms on the retina and reaches the brain', [
    M('refraction', "Where are light rays refracted as they enter the eye?",
      "First at the cornea, then at the lens", ["First at the lens, then at the cornea", "Only at the retina", "Only at the iris"], "The cornea bends light the most, then the lens fine-tunes the focus."),
    M('image', "What is the image on the retina like?",
      "Upside down (inverted) and smaller than the object", ["The right way up and larger than the object", "The right way up and the same size as the object", "Upside down and larger than the object"], "The rays cross over behind the lens."),
    M('crossing', "Where do the rays from the top and bottom of an object cross?",
      "Inside the eye, behind the lens", ["In front of the cornea, outside the eye", "At the retina itself", "Inside the optic nerve"], "They cross after the lens, then meet on the retina."),
    M('ray diagram', "A student's ray diagram shows rays meeting in front of the retina in a normal eye. What is wrong?",
      "In a normal eye the rays should meet on the retina", ["The rays should meet behind the retina", "The rays should meet on the cornea", "The rays should never meet at all"], "Rays meeting in front of the retina would mean short sight."),
    M('receptors', "What do the rods and cones in the retina do?",
      "Turn light into electrical impulses", ["Bend light to focus it", "Control the size of the pupil", "Carry impulses to the brain"], "Receptor cells convert light to impulses."),
    M('optic nerve', "What does the optic nerve carry from the retina to the brain?",
      "Electrical impulses", ["Light rays", "The image", "Blood"], "The optic nerve carries impulses, not light or the image."),
    M('brain', "Why do we see objects the right way up even though the image on the retina is upside down?",
      "The brain interprets the impulses", ["The lens turns the image the right way up", "The optic nerve flips the image over", "The cornea makes a second image the right way up"], "The brain makes sense of the information."),
    M('glaucoma', "Glaucoma damages the optic nerve. Why does this affect vision?",
      "Fewer or no impulses reach the brain from the retina", ["Less light enters the eye through the pupil", "The lens becomes cloudy and blocks the light", "The image falls behind the retina instead"],
      "The retina may still work, but the impulses cannot reach the brain."),
    M('sequence', "Which sequence is correct?",
      "Light, cornea, lens, retina, impulses along optic nerve, brain", ["Light, retina, lens, cornea, impulses along optic nerve, brain", "Light, cornea, optic nerve, lens, retina, brain", "Light, lens, brain, retina, optic nerve, cornea"],
      "Refraction first, then detection, then nerve impulses to the brain."),
    M('neurones', "What type of neurones in the optic nerve carry impulses from the eye to the brain?",
      "Sensory neurones", ["Motor neurones", "Relay neurones only", "Hormone-carrying neurones"], "Sensory neurones carry impulses from a sense organ to the CNS."),
    M('ray diagram', "In a ray diagram, what should happen to a ray of light when it reaches the cornea?",
      "It bends (is refracted) inwards", ["It carries on in a straight line", "It is reflected back out", "It stops and is absorbed"], "Rays bend at the cornea and again at the lens."),
    M('common errors', "A student writes: 'The optic nerve carries the image to the brain.' What is correct?",
      "It carries electrical impulses to the brain", ["It carries light rays to the brain", "It carries the image to the lens", "It carries the image from the brain to the eye"], "Light becomes impulses at the retina.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-PRAC-PLAN-INVESTIGATION-ON-PEOPLE */
  T('HBI-PRAC-PLAN-INVESTIGATION-ON-PEOPLE', 'Plan an investigation measuring a response or treatment in people', [
    M('pulse method', "How should a student measure a person's pulse rate?",
      "Place two fingers on the wrist or neck, count beats for 15 seconds and multiply by 4", ["Place a thumb on the chest and count the breaths taken in one minute, then divide by 4", "Ask the person to guess how fast their heart is beating", "Count the beats for 15 seconds and divide by 4"],
      "Use fingers (not thumb) or a pulse monitor, and give a time."),
    { skill: 'pulse calculation', gen: function () {
      var n = rint(16, 32);
      return nq("A student counts " + n + " pulse beats in 15 seconds. What is the pulse rate in beats per minute?", n * 4, 'beats per minute',
        "There are four 15-second periods in a minute, so " + n + " × 4 = " + (n * 4) + " beats per minute.");
    } },
    M('resting value', "A student investigates the effect of exercise on pulse rate. What should be done first?",
      "Measure the resting pulse rate", ["Run for as long as possible", "Drink a cup of coffee", "Measure the pulse after the exercise only"], "A resting value gives something to compare with."),
    M('rest between', "Why should the person rest between activities until the pulse returns to normal?",
      "So each activity starts from the same resting value", ["So the person gets bored and stops", "So the pulse stays high, ready for the next activity", "So the heart grows stronger between tests"], "Otherwise the next reading starts from a raised pulse."),
    M('reaction time', "In a ruler-drop test, which method is best?",
      "Hold the ruler at zero, drop it without warning, record the distance and repeat", ["Warn the person before each drop, so that they are always ready to catch the ruler", "Drop the ruler from a different height each time", "Time the catch with a stopwatch and do it only once"],
      "A fixed start, no warning and repeats give better results."),
    M('pupil size', "How could a student measure the effect of light intensity on pupil size?",
      "Use lamps of different brightness, wait, photograph the eye and measure the pupil", ["Ask the person whether their pupil feels larger or smaller in each of the lights", "Shine a bright light in the eye for 10 minutes and look at it", "Measure the iris with a ruler held against the eye"],
      "Waiting lets the pupil adjust; a photograph allows measurement."),
    M('hearing', "How should a student find the highest frequency people of different ages can hear?",
      "Raise the frequency from a speaker until it cannot be heard; test several people of each age", ["Play music loudly and ask each person if they like it", "Test one person of each age, with a different speaker and distance each time", "Use a signal generator and lower the frequency until it can be heard"],
      "Several people of each age, same distance from the speaker."),
    M('stereoscopic', "A student tests whether two eyes help in catching a ball. What is the best method?",
      "Count catches out of 10 throws with both eyes open, then with one eye covered", ["Count catches out of 10 throws with both eyes open only, then repeat it again", "Count catches with one eye covered, using a different ball each time", "Ask the person whether they find it easier with both eyes"],
      "There must be a comparison between two eyes and one eye."),
    M('sweat', "How could sweating rate be measured?",
      "Press absorbent paper on a fixed area of skin and weigh it before and after", ["Look closely at the skin and decide whether it seems wet or dry", "Measure the person's temperature with a thermometer before and after exercise", "Count the number of drinks the person has"],
      "Name a measurable method, such as the gain in mass of the paper, or how quickly cobalt chloride paper turns pink."),
    M('urine', "A student compares urine volume on a hot day and a cold day. Which is a control variable?",
      "The volume of water drunk", ["The temperature of the day", "The volume of urine produced", "The colour of the urine"], "The temperature is the factor being tested; the urine volume is measured."),
    M('drug trial', "In a trial of a new statin, how should the groups be set up?",
      "Two groups matched for age, sex and health; one gets the statin, one gets a placebo", ["One group only, and everyone gets the statin", "Two groups of any age; both get the statin", "Two groups; the youngest people get the statin and the oldest people get nothing at all"],
      "A comparison group (placebo) is needed, matched to the treated group."),
    M('common errors', "A student's plan says: 'Measure the amount of sweat.' Why is this not enough?",
      "It does not say how the sweat will be measured", ["Sweat cannot be measured at all", "It should measure urine instead of sweat", "It should not be measured in people"], "A method needs a measurement technique.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-PRAC-CONTROL-HUMAN-SUBJECT-VALIDITY */
  T('HBI-PRAC-CONTROL-HUMAN-SUBJECT-VALIDITY', 'Explain validity problems and fixes in investigations on people', [
    M('valid', "What does it mean for a result to be valid?",
      "It measures only the effect of the factor being tested", ["It has been repeated many times and all of the results agree", "It agrees with what the student expected", "It was measured to many decimal places"], "Validity is about testing only the chosen factor."),
    F("replaced a distractor (time of day) that could be argued to matter", M('people differ', "Why might different people respond differently to the same caffeine drink?",
      "They differ in age, body mass, health and metabolism", ["They all have the same genes", "They each drink from a different cup", "They all react in exactly the same way to caffeine"],
      "Name the differences, such as age, sex, mass, fitness or health.")),
    M('food before', "A student doing a ruler-catch test does not eat or drink for several hours beforehand. Why does this help validity?",
      "Food or drink, such as caffeine, could change the reaction time", ["Hunger makes everyone react faster, so all results will be better", "Food makes the ruler heavier to catch", "It means the test can be done more quickly"],
      "Removing food and drink removes a factor that could affect the result."),
    M('same person', "Why might a student use the same person for every condition?",
      "It removes differences between people that could change the results", ["It makes the results more varied, so there is much more data to analyse", "It means no repeats are needed", "It means no control variables are needed"], "Same person or matched groups improve validity."),
    M('rest', "Why does resting between tests improve validity in a pulse investigation?",
      "Heart rate and breathing return to normal, so each test starts from the same point", ["The person becomes tired, so the results of every later test are lower than the first", "The person forgets the earlier result", "The pulse rises even higher during the rest"],
      "Each test should start from the same baseline."),
    M('one per age', "A hearing test uses only one person of each age. Why are the results not valid?",
      "That one person's sex, ear damage or illness could change the result", ["One person of each age is too many people for a fair comparison to be made", "Older people cannot take part in experiments", "The speaker would be too loud for one person"],
      "Use several people of each age."),
    F("replaced a distractor (time of blood test) that could be argued to matter", M('statin factors', "When testing whether statins lower cholesterol, which factors should also be considered?",
      "Diet, activity, smoking and family history", ["The colour and the shape of the tablets used", "The brand of pen used to record the results", "The name of the doctor"], "Lifestyle and genes affect cholesterol too.")),
    M('salt test', "A student tests how salt intake affects urine volume. A friend says 'salt is the problem with the test'. Why is this wrong?",
      "Salt is the factor being tested, so it should change", ["Salt has no effect on urine at all, so it does not matter", "Salt must be kept the same for everyone", "Salt should be replaced with sugar"], "The independent variable is meant to vary; other factors must be controlled."),
    M('reliability vs validity', "A student says a test is not valid 'because they did not repeat it'. What is wrong with this answer?",
      "Repeating is about reliability, not validity", ["Repeating is about validity, not reliability", "Repeating would make it less valid", "Repeating is never needed"], "Validity is about controlling other factors."),
    M('sweat dry', "Why should sweat be allowed to dry before a repeat sweat reading?",
      "So the next reading starts from the same point", ["So the paper absorbs more sweat", "So the person gets colder", "So the person stops sweating for ever"], "Wet skin at the start would change the result."),
    M('small sample', "A drug is tested on only 5 people. Why is this a problem for validity?",
      "A few unusual people can change the result", ["Five people are too many to compare", "A drug can only be tested on animals", "It means the drug must work"], "A larger sample reduces the effect of individual differences."),
    M('common errors', "A student writes: 'It is not a fair test.' How can this be improved?",
      "Name the factor that was not controlled, such as age or diet", ["Write that it is not a fair test twice, to make the point clearer", "Say the test should be repeated", "Say the results are wrong"], "Always name the factor and explain why it matters.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-APPLY-SYNAPSE-TO-DRUG-OR-DISEASE */
  T('HBI-APPLY-SYNAPSE-TO-DRUG-OR-DISEASE', 'Predict how a drug, toxin or disease changes synaptic transmission', [
    M('enzyme inhibitor', "An enzyme in the synaptic gap breaks down acetylcholine. What happens if a drug inhibits this enzyme?",
      "Acetylcholine stays in the gap for longer, so more impulses can start", ["Acetylcholine is broken down faster, so fewer impulses start in the next neurone", "The vesicles stop making acetylcholine", "The receptors are destroyed by the drug"],
      "Inhibiting breakdown keeps more transmitter acting."),
    M('curare', "Curare blocks receptors on the post-synaptic membrane. What is the effect on muscles?",
      "The neurotransmitter cannot bind, so the muscles do not contract", ["More neurotransmitter binds, so the muscles contract much more strongly", "The neurotransmitter is released faster, so muscles twitch", "The impulse jumps the gap, so muscles work normally"],
      "No binding means no new impulse to the muscle."),
    M('curare antidote', "Why can an inhibitor of the acetylcholine-breaking enzyme help after curare poisoning?",
      "Extra acetylcholine can compete with curare for the receptors", ["It breaks down the curare in the gap", "It makes the muscles grow many new receptors within seconds", "It stops the vesicles releasing acetylcholine"],
      "More acetylcholine in the gap can outcompete curare, so muscles can contract again."),
    M('Alzheimer plaques', "In Alzheimer's disease, plaques of beta-amyloid build up between neurones. How does this affect transmission?",
      "Acetylcholine cannot diffuse across or bind to receptors, so no new impulse starts", ["Acetylcholine diffuses faster across the gap, so many, many more new impulses start", "The plaques make more acetylcholine, so neurones are over-stimulated", "The plaques insulate the axons, so impulses travel faster"],
      "Plaques block the gap and cover receptors; neurones also die."),
    M('Alzheimer', "Why is less acetylcholine made in the brain of a person with Alzheimer's disease?",
      "Neurones die, so there are fewer synapses", ["Neurones divide, so there are more synapses", "The liver breaks down the acetylcholine", "The blood carries the acetylcholine away"], "Fewer neurones and synapses mean less transmitter."),
    M('Parkinson', "In Parkinson's disease, dopamine-making neurones are destroyed. What is the effect?",
      "Fewer impulses reach the muscles, so movement is shaky, stiff and slow", ["More impulses reach the muscles, so movement becomes very fast and jerky", "The muscles are no longer joined to the bones", "The person cannot see clearly"],
      "Less dopamine means fewer impulses."),
    M('too much dopamine', "What is a likely effect of too much dopamine?",
      "Over-stimulation, such as a faster heart rate, anxiety or hallucinations", ["Less movement and a slower heart rate, because the neurones are under-stimulated", "No change, because dopamine is a hormone", "Muscles cannot contract at all"], "Too much transmitter over-stimulates the next neurones."),
    M('alcohol', "How does alcohol affect synapses?",
      "It reduces release and binding of neurotransmitters, so fewer impulses pass", ["It increases release of neurotransmitters, so reactions get much faster than normal", "It blocks the vesicles from ever forming again", "It speeds up the diffusion of transmitters"],
      "Alcohol is a depressant."),
    M('four steps', "Which list gives the steps at a synapse that a drug or disease could change?",
      "Release, diffusion across the gap, binding to receptors, breakdown", ["Digestion, absorption into the blood, assimilation, egestion", "Inhalation, exhalation, diffusion across the alveoli, respiration", "Filtration, reabsorption, secretion, excretion"], "Each step can be changed by a drug or disease."),
    M('direction', "A drug reduces the release of a neurotransmitter. What happens to the number of impulses in the next neurone?",
      "It falls", ["It rises", "It stays the same", "It doubles"], "Less transmitter means fewer impulses."),
    M('common errors', "A student says an enzyme inhibitor 'breaks down the plaques'. What does it actually do?",
      "It stops the enzyme breaking down acetylcholine", ["It breaks down acetylcholine faster", "It dissolves the beta-amyloid plaques", "It makes new neurones grow"], "It inhibits the enzyme, so more acetylcholine remains."),
    M('common errors', "A student describes Parkinson's disease symptoms but does not mention synapses. What is missing?",
      "That less dopamine is released, so fewer impulses cross the synapses", ["That the disease is caused by bacteria that infect the muscles and joints", "That the muscles are too large", "That the heart beats too slowly"], "Link the symptoms to the neurotransmitter and the synapse.")
  ], { date: '2026-10-13', dropped: [] });
})();
