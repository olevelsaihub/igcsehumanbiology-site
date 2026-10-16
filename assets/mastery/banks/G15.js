/* Group G15 mastery bank: More nerves, senses, hormones and drugs (Grade 8 block).
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
  // Ear: E pinna, F eardrum, G ossicles, H semicircular canals, J cochlea, K Eustachian tube, L auditory nerve.
  var EAR = (function () {
    var g = '', i, pts = [], cx = 378, cy = 200;
    g += '<path d="M300 215 L352 312" stroke="' + INK + '" stroke-width="16" stroke-linecap="round"/><path d="M300 215 L352 312" stroke="#f6e3d3" stroke-width="11" stroke-linecap="round"/>';
    g += '<path d="M92 48 C30 50 18 140 40 182 C56 214 44 250 80 272 L96 256 C76 236 86 210 76 180 C62 140 66 86 104 74 Z" fill="#f3d9c4" stroke="' + INK + '" stroke-width="2"/>';
    g += '<rect x="74" y="150" width="156" height="30" fill="#fbf1e8"/><line x1="74" y1="150" x2="230" y2="150" stroke="' + INK + '" stroke-width="2"/><line x1="78" y1="180" x2="230" y2="180" stroke="' + INK + '" stroke-width="2"/>';
    g += '<rect x="236" y="115" width="88" height="100" rx="10" fill="#e6f0fa" stroke="' + GREY + '" stroke-width="1.5"/>';
    g += '<ellipse cx="232" cy="165" rx="4" ry="32" fill="' + HI + '" stroke="' + INK + '" stroke-width="1.5"/>';
    g += '<path d="M238 160 L262 138 M262 138 L290 150 M290 150 L322 165" stroke="#b38a4d" stroke-width="7" stroke-linecap="round" fill="none"/><circle cx="262" cy="138" r="7" fill="#b38a4d"/><circle cx="290" cy="150" r="6" fill="#b38a4d"/>';
    g += '<ellipse cx="350" cy="88" rx="20" ry="32" fill="none" stroke="#c48a5a" stroke-width="7"/><ellipse cx="392" cy="80" rx="32" ry="17" fill="none" stroke="#c48a5a" stroke-width="7"/><ellipse cx="405" cy="118" rx="16" ry="26" fill="none" stroke="#c48a5a" stroke-width="7"/>';
    g += '<ellipse cx="356" cy="145" rx="26" ry="18" fill="#f0c9a6" stroke="' + INK + '" stroke-width="1.5"/>';
    for (i = 0; i <= 90; i++) { var t = i / 90 * 2.4, a = Math.PI * 1.15 + t * 2 * Math.PI, r = 46 * (1 - t / 2.9); pts.push((cx + r * Math.cos(a)).toFixed(1) + ' ' + (cy + r * Math.sin(a)).toFixed(1)); }
    g += '<path d="M' + pts.join(' L') + '" fill="none" stroke="#c48a5a" stroke-width="9" stroke-linecap="round"/>';
    g += '<ellipse cx="327" cy="165" rx="4" ry="10" fill="#fff" stroke="' + INK + '" stroke-width="1.5"/>';
    g += '<path d="M420 180 C470 170 520 175 570 168" fill="none" stroke="#e0b84a" stroke-width="8" stroke-linecap="round"/>';
    g += lab(48, 118, 22, 28, 'E') + lab(232, 136, 205, 28, 'F', 'end') + lab(262, 132, 270, 28, 'G') + lab(392, 64, 440, 28, 'H') + lab(380, 240, 450, 300, 'J') + lab(335, 280, 285, 312, 'K', 'end') + lab(530, 172, 545, 245, 'L');
    return '<svg class="mc-svg" viewBox="0 0 600 330" role="img" aria-label="Section through the ear with seven parts labelled E to L, not to scale">' + g + '</svg>';
  })();
  // Synapse: neurone P on the left, neurone Q on the right; V vesicle, W synaptic cleft, X receptor.
  var SYN = (function () {
    var g = '<rect x="292" y="40" width="210" height="180" fill="#e7eefb"/><line x1="292" y1="40" x2="292" y2="220" stroke="' + INK + '" stroke-width="3"/>';
    g += '<path d="M20 112 L160 112 C175 62 270 56 272 130 C270 204 175 198 160 148 L20 148 Z" fill="#fbe9d7" stroke="' + INK + '" stroke-width="3"/>';
    [[205, 98], [238, 118], [208, 150], [244, 158], [182, 126]].forEach(function (v) { g += '<circle cx="' + v[0] + '" cy="' + v[1] + '" r="11" fill="#fff" stroke="' + INK + '" stroke-width="1.5"/>'; [[-4, -3], [3, -2], [0, 4]].forEach(function (d) { g += '<circle cx="' + (v[0] + d[0]) + '" cy="' + (v[1] + d[1]) + '" r="1.8" fill="' + BLUE + '"/>'; }); });
    [90, 120, 150, 180].forEach(function (y) { g += '<path d="M292 ' + (y - 7) + ' L284 ' + (y - 7) + ' L284 ' + (y + 7) + ' L292 ' + (y + 7) + '" fill="none" stroke="' + HI + '" stroke-width="3"/>'; });
    g += '<text x="40" y="100" font-size="15" fill="' + INK + '">Neurone P</text><text x="390" y="135" font-size="15" fill="' + INK + '">Neurone Q</text>';
    g += lab(205, 87, 180, 22, 'V', 'end') + lab(279, 165, 300, 245, 'W') + lab(289, 90, 345, 22, 'X');
    return '<svg class="mc-svg" viewBox="0 0 520 260" role="img" aria-label="Synapse between neurone P and neurone Q with three parts labelled V, W and X, not to scale">' + g + '</svg>';
  })();

  /* ====================================================================== HBI-RECALL-BRAIN-DISORDER-FEATURES */
  T('HBI-RECALL-BRAIN-DISORDER-FEATURES', "State causes and symptoms of dementia, Parkinson's and mental illness", [
    M("Alzheimer's", "Which is often the first symptom of Alzheimer's disease?",
      "Loss of short-term memory", ["Shaking (tremor) of the hands when resting", "Hearing voices that other people cannot hear", "Stiff muscles in the arms and legs"],
      "Alzheimer's usually starts with forgetting recent events."),
    M("Parkinson's", "Which pair of symptoms is typical of Parkinson's disease?",
      "Tremor and slow movement", ["Forgetting recent events first, then older ones", "Hearing voices that other people cannot hear", "Low mood and no energy for many weeks"],
      "Parkinson's affects movement: tremor, stiffness, slowness and poor balance."),
    M('schizophrenia', "Which symptoms are typical of schizophrenia?",
      "Hallucinations and confused thinking", ["Tremor and stiff muscles in the hands and arms", "Loss of short-term memory first", "Very high blood sugar after a meal"],
      "Hallucinations mean seeing or hearing things that are not there."),
    M('depression', "Which symptoms are typical of depression?",
      "Low mood and lack of energy", ["Plaques of protein between and inside neurones", "Shaking hands and poor balance", "Seeing things that are not there"],
      "Depression is a mental illness with low mood and low energy."),
    M("Alzheimer's cause", "What happens in the brain of a person with Alzheimer's disease?",
      "A protein forms plaques between and inside neurones", ["A virus multiplies inside the neurones of the spinal cord and kills them", "The cerebellum grows too large", "The brain makes far too many new neurones"],
      "A protein (APP) is not broken down properly, so beta-amyloid plaques form."),
    S('risk factors', "Which of these are risk factors for mental illness?", ["Low income", "Violence or abuse", "Drug or alcohol misuse"], ["Regular exercise", "Close friendships"],
      "Low income, low self-esteem, abuse, low social status and drug or alcohol misuse all raise the risk."),
    F("replaced a distractor no student would choose ('Doctors in richer countries cause it')", M('richer countries', "Why are there more cases of dementia in richer countries?",
      "People live longer, so more of them reach old age", ["Dementia is caused by a virus that spreads more easily in crowded cities", "Richer people take fewer drugs", "Dementia is passed on by touching people who have it"],
      "Dementia is more common in older people, and people in richer countries live longer.")),
    M('memory', "Which statement about memory is correct?",
      "Short-term memory holds recent events; long-term memory holds events from years ago", ["Short-term memory holds events from years ago; long-term memory holds what happened this morning", "Both kinds of memory hold only events from today", "Long-term memory is lost first in Alzheimer's disease"],
      "Long-term memories have been processed more, so they last longer."),
    M('other than memory', "Other than memory loss, which is a symptom of Alzheimer's disease?",
      "Confusion and problems with speech", ["Forgetting what happened earlier on the same day", "Shaking of the hands when resting", "Hearing voices that are not there"],
      "The question says 'other than memory loss', so forgetting does not count. Tremor is Parkinson's; voices are schizophrenia."),
    { skill: 'data', gen: function () {
      var p = pick([5, 8, 10, 12, 15, 20, 25]), n = pick([400, 600, 800, 1200, 2000, 3000]), a = n * p / 100;
      return nq("In a town, " + p + "% of people aged over 80 have dementia. There are " + commas(n) + " people aged over 80 in the town. How many of them have dementia?", a, 'people',
        commas(n) + " × " + p + " ÷ 100 = " + commas(a) + " people.");
    } },
    M('same idea', "A student gives 'forgets things' and 'cannot remember' as two symptoms. Why do they get only one mark?",
      "Both answers describe memory loss", ["Forgetting is a symptom of Parkinson's disease, not of Alzheimer's disease", "Symptoms must always be written in one word", "Memory loss is not a symptom at all"],
      "Give two different ideas, for example memory loss and confusion."),
    M('matching', "Which condition is correctly matched with its symptoms?",
      "Parkinson's disease: tremor and stiff muscles", ["Depression: hallucinations and hearing voices that are not there", "Schizophrenia: memory loss that starts with recent events", "Alzheimer's disease: shaking hands and a slow, shuffling walk"],
      "Tremor goes with Parkinson's, memory loss with Alzheimer's and hallucinations with schizophrenia.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-EAR-PARTS-AND-HEARING-LOSS */
  T('HBI-EAR-PARTS-AND-HEARING-LOSS', 'Identify ear parts and use the sound path to explain hearing and hearing loss', [
    M('label', "The diagram shows a section through the ear. Which letter labels the cochlea?", "J", ["G", "H", "K"],
      "J is the coiled tube. H is the semicircular canals and K is the Eustachian tube.", { svg: EAR, family: 'g15-ear' }),
    M('label', "Using the same diagram, what is structure G?", "The ossicles (three small bones)", ["The eardrum", "The cochlea", "The semicircular canals"],
      "G is the chain of three small bones in the air-filled middle ear.", { svg: EAR, family: 'g15-ear' }),
    M('label', "Using the same diagram, which letter labels the tube that keeps the air pressure equal on both sides of the eardrum?", "K", ["F", "J", "L"],
      "K is the Eustachian tube, which joins the middle ear to the throat.", { svg: EAR, family: 'g15-ear' }),
    M('label', "Using the same diagram, which letter labels a part used for balance, not hearing?", "H", ["E", "F", "J"],
      "H is the semicircular canals.", { svg: EAR, family: 'g15-ear' }),
    M('pinna', "What does the pinna do?",
      "Collects sound waves and directs them into the ear canal", ["Turns sound waves into nerve impulses that go straight to the brain", "Keeps the air pressure equal", "Amplifies vibrations in the middle ear"],
      "The pinna also helps you tell which direction a sound comes from."),
    M('ossicles', "What do the ossicles do?",
      "Pass vibrations to the cochlea and make them bigger", ["Change sound waves into impulses that travel along the auditory nerve", "Detect movement of the head", "Fill the middle ear with fluid"],
      "The ossicles pass on and amplify vibrations; they do not make impulses."),
    M('cochlea', "How does the cochlea start impulses to the brain?",
      "Vibrations move the fluid, so hair cells are stimulated and send impulses", ["The fluid soaks up the sound so that loud noises cannot damage the eardrum", "It vibrates the eardrum, which sends impulses", "Its bones rub together and make electricity"],
      "Impulses start in the auditory nerve when the hair cells are stimulated."),
    M('balance', "How do the semicircular canals help keep balance?",
      "When the head moves, fluid moves and receptors send impulses to the brain", ["They pass vibrations from the eardrum to the cochlea and make them bigger and louder", "They keep the pressure equal in the middle ear", "They collect sound and direct it inward"],
      "The cerebellum uses these impulses to keep balance."),
    M('glue ear', "How does glue ear reduce hearing?",
      "Fluid in the middle ear stops the eardrum and ossicles vibrating freely", ["Too much air in the middle ear makes the hair cells in the cochlea burst open", "The pinna becomes blocked with wax", "The auditory nerve grows too long"],
      "Vibrations do not reach the cochlea, so the hair cells are not stimulated."),
    M('loud noise', "How can years of loud noise cause hearing loss?",
      "Hair cells in the cochlea are damaged", ["The ossicles grow larger and press on the eardrum", "The Eustachian tube fills with air", "The pinna stops growing"],
      "Damaged hair cells cannot start impulses."),
    M('age', "Which sounds are usually lost first as people get older?",
      "High-pitched (high-frequency) sounds", ["Low-pitched (low-frequency) sounds", "All sounds equally, at the same time", "Only sounds coming from the left side"],
      "Young people hear about 20 Hz to 20 000 Hz; the high frequencies go first."),
    M('range', "What is the hearing range of a young person?",
      "About 20 Hz to 20 000 Hz", ["About 2 Hz to 200 Hz", "About 200 Hz to 2 000 000 Hz", "About 20 000 Hz to 200 000 Hz"],
      "Hz (hertz) is the number of vibrations per second."),
    M('middle ear', "What does the middle ear normally contain?",
      "Air", ["Fluid", "Blood", "Mucus"], "Fluid in the middle ear is a problem (glue ear). The cochlea is the part filled with fluid.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-SHOW-EXPLAIN-ONE-WAY-IMPULSE */
  T('HBI-SHOW-EXPLAIN-ONE-WAY-IMPULSE', 'Show and explain why impulses travel one way across a synapse', [
    M('direction', "The diagram shows a synapse. In which direction does an impulse cross it?", "From P to Q", ["From Q to P", "In either direction", "In both directions at once"],
      "P has the vesicles of neurotransmitter, so the impulse goes from P to Q.", { svg: SYN, family: 'g15-syn' }),
    M('label', "Using the same diagram, which letter labels a receptor molecule?", "X", ["V", "W"],
      "The receptors are on the membrane of neurone Q.", { svg: SYN, family: 'g15-syn' }),
    M('label', "Using the same diagram, what does structure V contain?", "Neurotransmitter", ["Receptors", "Antibodies", "Hormones"],
      "V is a vesicle in the synaptic knob.", { svg: SYN, family: 'g15-syn' }),
    M('label', "Using the same diagram, what is W?", "The synaptic cleft (gap)", ["A vesicle", "A receptor", "A myelin sheath"],
      "The neurotransmitter diffuses across W.", { svg: SYN, family: 'g15-syn' }),
    M('reason', "Why can impulses cross a synapse in only one direction?",
      "Neurotransmitter is released only from the first neurone, and receptors are only on the second", ["The impulse jumps across the gap and can only land on the side with the most electrical charge", "The gap is too narrow on one side", "The second neurone is always shorter"],
      "Give both parts: release on one side, receptors on the other."),
    M('structure', "Which structure makes impulses travel in only one direction?",
      "The synapse", ["The relay neurone", "The spinal cord", "The motor neurone"], "The synaptic cleft is also accepted."),
    M('reflex arc', "In which order does an impulse pass through a reflex arc?",
      "Receptor, sensory neurone, relay neurone, motor neurone, effector", ["Effector, motor neurone, relay neurone, sensory neurone, receptor", "Receptor, motor neurone, relay neurone, sensory neurone, effector", "Sensory neurone, receptor, effector, motor neurone, relay neurone"],
      "Sensory carries impulses in; motor carries them out."),
    M('receptor end', "Where is the receptor joined to a sensory neurone?",
      "At the outer end, farthest from the spinal cord", ["At the end of the motor neurone that touches the muscle fibres", "Inside the spinal cord", "Halfway along the relay neurone"],
      "The receptor is in the skin or a sense organ."),
    M('diffusion', "How does neurotransmitter cross the synaptic cleft?",
      "By diffusion, from high to low concentration", ["By active transport, from low to high concentration across the gap", "Along a nerve fibre inside the gap", "It is pumped by the heart"],
      "It moves from where there is a lot (near the knob) to where there is little."),
    M('jumps', "A student writes: 'The impulse jumps across the gap.' What is correct?",
      "A chemical (neurotransmitter) diffuses across the gap", ["An electrical wire joins the two neurones together across the gap", "The impulse flies across as a spark", "Nothing crosses the gap"],
      "It is the neurotransmitter chemical that crosses, not the impulse."),
    M('two arrows', "A student draws two arrows pointing opposite ways across a synapse 'to be safe'. What mark do they get?",
      "Zero, because the direction is not clear", ["Full marks, because one of the two arrows must be the correct one", "Half marks", "One mark for each arrow"],
      "Draw one arrow, from the knob side to the next neurone."),
    M('vesicles', "Where are the vesicles of neurotransmitter found?",
      "Only in the synaptic knob of the first neurone", ["On the membrane of the second neurone, next to all the receptor molecules", "On both sides of the gap equally", "Inside the synaptic cleft"],
      "That is why release happens on one side only."),
    M('full answer', "A student writes: 'Neurotransmitter is only released from one side.' What else is needed for a full answer?",
      "Receptors are only on the second neurone", ["The impulse travels faster along the motor neurone than along the sensory neurone", "The gap is filled with blood", "Vesicles are on both sides"],
      "Both points are needed: one-sided release and one-sided receptors.")
  ], { date: '2026-10-13', dropped: [] });
})();
