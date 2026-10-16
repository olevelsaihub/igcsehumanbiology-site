/* Group G05 mastery bank: Respiration (A-Grade Block 5).
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


  // Two-flask apparatus. Flask A (left): long tube in from the room, short tube to the mouthpiece (breathing IN draws room air through A).
  // Flask B (right): short tube from... long tube from the mouthpiece dips into B (breathing OUT bubbles expired air through B).
  var APP = '<svg class="mc-svg" viewBox="0 0 520 300" role="img" aria-label="Two flasks of limewater joined to one mouthpiece. Flask A has a long tube open to the room and a short tube to the mouthpiece. Flask B has a long tube from the mouthpiece and a short tube open to the room.">' +
    '<g fill="none" stroke="' + INK + '" stroke-width="2.5">' +
    '<path d="M70 120 L70 250 Q70 270 90 270 L190 270 Q210 270 210 250 L210 120 Z"/><path d="M310 120 L310 250 Q310 270 330 270 L430 270 Q450 270 450 250 L450 120 Z"/>' +
    '<path d="M60 120 L220 120 M300 120 L460 120"/>' +
    '<path d="M110 60 L110 245"/><path d="M170 120 L170 145 M170 120 L170 70 L260 70 L260 30"/>' +
    '<path d="M260 70 L350 70 L350 245"/><path d="M410 145 L410 60"/></g>' +
    '<rect x="72" y="170" width="136" height="98" fill="' + BLUE + '" opacity="0.18"/><rect x="312" y="170" width="136" height="98" fill="' + BLUE + '" opacity="0.18"/>' +
    '<text x="140" y="292" font-size="15" text-anchor="middle" fill="' + INK + '">Flask A</text><text x="380" y="292" font-size="15" text-anchor="middle" fill="' + INK + '">Flask B</text>' +
    '<text x="260" y="22" font-size="14" text-anchor="middle" fill="' + INK + '">mouthpiece</text><text x="110" y="52" font-size="13" text-anchor="middle" fill="' + INK + '">air in</text><text x="410" y="52" font-size="13" text-anchor="middle" fill="' + INK + '">air out</text>' +
    '<text x="140" y="225" font-size="13" text-anchor="middle" fill="' + INK + '">limewater</text><text x="380" y="225" font-size="13" text-anchor="middle" fill="' + INK + '">limewater</text></svg>';

  /* ====================================================================== HBI-RESPIRATION-EQUATION */
  T('HBI-RESPIRATION-EQUATION', 'Write or complete the respiration equations', [
    M('aerobic word equation', "Which is the word equation for aerobic respiration?",
      "glucose + oxygen → carbon dioxide + water", ["glucose + carbon dioxide → oxygen + water", "glucose → lactic acid", "carbon dioxide + water → glucose + oxygen"],
      "In aerobic respiration glucose and oxygen react to give carbon dioxide and water, releasing energy."),
    M('symbol equation', "Which is the balanced symbol equation for aerobic respiration?",
      "C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O", ["C₆H₁₂O₆ + O₂ → CO₂ + H₂O", "C₆H₁₂O₆ + 6CO₂ → 6O₂ + 6H₂O", "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂"],
      "One glucose reacts with six oxygen molecules to give six carbon dioxide and six water molecules."),
    M('anaerobic word equation', "Which is the word equation for anaerobic respiration in human muscle?",
      "glucose → lactic acid", ["glucose → lactic acid + carbon dioxide", "glucose + oxygen → lactic acid", "glucose → ethanol + carbon dioxide"],
      "In human muscle, anaerobic respiration turns glucose into lactic acid only. No carbon dioxide is made."),
    M('complete the equation', "Complete the equation: glucose + ______ → carbon dioxide + water",
      "oxygen", ["energy", "lactic acid", "nitrogen"], "Oxygen is the other reactant in aerobic respiration."),
    M('complete the equation', "Complete the equation: C₆H₁₂O₆ + 6O₂ → 6CO₂ + ______",
      "6H₂O", ["H₂O", "6H₂O₂", "6O₂"], "There are six water molecules: 6H₂O. H₂O₂ is hydrogen peroxide, not water."),
    M('formulae', "What is the chemical formula of glucose?",
      "C₆H₁₂O₆", ["C₆H₁₂O", "CH₂O", "C₁₂H₆O₆"], "Glucose has 6 carbon, 12 hydrogen and 6 oxygen atoms."),
    M('which type', "An equation is: glucose + oxygen → carbon dioxide + water. Which type of respiration does it show?",
      "Aerobic respiration, because oxygen is used", ["Anaerobic respiration, because water is made", "Anaerobic respiration, because glucose is used", "Neither type; it shows photosynthesis"],
      "An equation with oxygen as a reactant shows aerobic respiration."),
    M('reactants and products', "In aerobic respiration, which substances are the products?",
      "Carbon dioxide and water", ["Glucose and oxygen", "Oxygen and water", "Glucose and carbon dioxide"], "Products are on the right of the arrow: carbon dioxide and water."),
    M('energy', "Where can 'energy' (or ATP) be written in a respiration equation?",
      "On the product side, after the arrow", ["On the reactant side, before the arrow", "On both sides of the arrow", "Nowhere; respiration does not involve energy"],
      "Respiration releases energy, so it is shown as a product, often in brackets."),
    M('common errors', "A student writes: glucose → lactic acid + carbon dioxide, for anaerobic respiration in a human. What is wrong?",
      "Anaerobic respiration in humans makes no carbon dioxide", ["Lactic acid is not made in anaerobic respiration", "Oxygen should be added on the left side", "Glucose should be on the right side"],
      "Human anaerobic respiration: glucose → lactic acid only."),
    M('common errors', "A student is asked for a word equation and writes C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O. Why might this lose the mark?",
      "A word equation needs names, not formulae", ["The numbers in front of the formulae are wrong", "The equation is for anaerobic respiration", "The arrow should point the other way"],
      "Use words for a word equation and formulae for a symbol equation."),
    S('anaerobic', "Which statements about anaerobic respiration in humans are correct?", ["It does not use oxygen", "It makes lactic acid", "It releases less energy than aerobic respiration"], ["It makes carbon dioxide", "It makes ethanol"],
      "Human anaerobic respiration uses no oxygen, makes lactic acid only, and releases much less energy per glucose.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-RESPIRATION-ENERGY-ATP */
  T('HBI-RESPIRATION-ENERGY-ATP', 'Explain how respiration releases energy and ATP transfers it', [
    M('why respire', "What is the main purpose of respiration in cells?",
      "To release energy from glucose", ["To make glucose from carbon dioxide", "To make oxygen for the cell", "To store energy as fat"],
      "Respiration releases energy from glucose. It does not 'make' energy."),
    S('uses of energy', "Which of these use energy from respiration?", ["Muscle contraction", "Active transport", "Making proteins"], ["Diffusion of oxygen", "Osmosis"],
      "Contraction, active transport and building molecules need energy. Diffusion and osmosis are passive."),
    M('ATP', "How is ATP made from ADP?",
      "A phosphate is added, using energy from respiration", ["A phosphate group is removed from ADP, which releases energy", "Glucose is added to ADP, using oxygen from the blood", "Carbon dioxide is added to ADP, using energy from food"],
      "ADP + phosphate → ATP. This needs energy, which comes from respiration."),
    M('ATP', "What happens when ATP releases energy for a muscle to contract?",
      "It is broken down to ADP and phosphate", ["It gains a phosphate group to become ADP", "It is changed into glucose and oxygen", "It is stored in the muscle as glycogen"],
      "Removing a phosphate from ATP releases energy that the cell can use."),
    M('ATP', "Which describes the role of ATP?",
      "It passes energy from respiration to cell processes", ["It is a long-term store of glucose inside the cell", "It is a type of anaerobic respiration in the muscles", "It carries oxygen in the blood to the respiring cells"],
      "ATP passes energy released in respiration to activities such as contraction."),
    M('contraction', "Where does most of the energy for muscle contraction come from?",
      "Aerobic respiration", ["Anaerobic respiration only", "Photosynthesis in the muscle", "Digestion in the muscle"],
      "Aerobic respiration supplies most energy. Anaerobic respiration adds a little during hard exercise."),
    M('metabolic rate', "Why does a person's metabolic rate increase in cold weather?",
      "More respiration releases more heat to keep body temperature steady", ["Enzymes are denatured in the cold, so more are made", "Cold air contains more oxygen, which speeds up respiration", "Less food is eaten, so less energy is needed"],
      "Respiration releases heat. In the cold, more respiration helps keep body temperature constant."),
    M('measuring rate', "Which measurement could be used to find a person's rate of respiration?",
      "The volume of oxygen taken in per minute", ["The number of red blood cells in 1 mm³ of blood", "The length of their small intestine in cm", "The mass of food in their stomach after a meal"],
      "Respiration rate can be measured by oxygen used, carbon dioxide made or glucose used."),
    M('measuring rate', "A person's oxygen use rises from 0.3 to 1.8 dm³ per minute during exercise. What does this show?",
      "The rate of respiration has increased", ["The rate of respiration has decreased", "Anaerobic respiration has stopped", "The lungs are making extra oxygen"],
      "More oxygen used per minute means more aerobic respiration."),
    M('common errors', "A student writes: 'Respiration makes energy.' How should this be corrected?",
      "Respiration releases energy", ["Respiration uses up all energy", "Respiration makes new glucose", "Respiration stores up oxygen"],
      "Energy cannot be made. Respiration releases energy stored in glucose."),
    M('common errors', "A student writes: 'ATP gains a phosphate to become ADP.' What is the correct statement?",
      "ADP gains a phosphate to become ATP", ["ATP gains glucose to become ADP", "ADP loses oxygen to become ATP", "ATP gains a phosphate to become glucose"],
      "ADP + phosphate → ATP (needs energy). ATP → ADP + phosphate (releases energy)."),
    M('bacteria', "Why do bacteria need to respire?",
      "To release energy for growth and cell division", ["To make oxygen for other organisms to use", "To produce glucose from water and minerals", "They do not respire, because they are not animals"],
      "All living cells, including bacteria, respire to release energy for processes such as growth and division.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-BREATH-CO2-INDICATOR-PRACTICAL */
  T('HBI-BREATH-CO2-INDICATOR-PRACTICAL', 'Set up and explain the indicator practical comparing carbon dioxide in breath', [
    M('apparatus', "The diagram shows the apparatus. When the person breathes <b>out</b> through the mouthpiece, which flask does the air bubble through?",
      "Flask B, because the tube from the mouthpiece dips into its limewater", ["Flask A, because the tube from the mouthpiece dips into its limewater", "Both flasks equally, because they share one mouthpiece", "Neither flask, because the air leaves by the mouthpiece"],
      "Breathing out pushes air down the long tube into flask B, so expired air bubbles through B.", { svg: APP, family: 'g05-app' }),
    M('apparatus', "Using the same apparatus, when the person breathes <b>in</b>, where does the air bubbling through flask A come from?",
      "The room, through the long tube of flask A", ["The person's lungs, through the mouthpiece", "Flask B, through the connecting tube", "The person's lungs, through the long tube of A"],
      "Breathing in lowers the pressure in A, so room air is drawn down A's long tube and bubbles through it.", { svg: APP, family: 'g05-app' }),
    M('results', "After several breaths in and out, which flask's limewater turns cloudy first?",
      "Flask B, because expired air contains more carbon dioxide", ["Flask A, because inspired air contains more carbon dioxide", "Both at the same time, because the air is the same", "Neither, because limewater does not react with carbon dioxide"],
      "Expired air has about 4% carbon dioxide; inspired air has about 0.04%.", { svg: APP, family: 'g05-app' }),
    M('indicator', "What happens to limewater when carbon dioxide bubbles through it?",
      "It turns cloudy (milky)", ["It turns colourless", "It turns blue", "It turns red"], "Limewater goes cloudy or milky with carbon dioxide."),
    M('indicator', "Hydrogencarbonate indicator can be used instead of limewater. What colour change shows more carbon dioxide?",
      "Red to yellow", ["Yellow to red", "Blue to brick red", "Brown to blue-black"], "More carbon dioxide makes the indicator more acidic, so it turns from red (orange-red) to yellow."),
    M('percentages', "Which values are about right for carbon dioxide in air?",
      "Inspired 0.04%, expired 4%", ["Inspired 4%, expired 0.04%", "Inspired 0%, expired 21%", "Inspired 21%, expired 16%"],
      "Inspired air has a very small amount of carbon dioxide; expired air has about 100 times as much."),
    M('explaining results', "Why does expired air contain more carbon dioxide than inspired air?",
      "Body cells make carbon dioxide in respiration, and it diffuses into the alveoli", ["The lungs make carbon dioxide from the oxygen breathed in", "Carbon dioxide is stored in the lungs and released slowly", "The mouth makes carbon dioxide as the air passes over it"],
      "Carbon dioxide comes from respiration in all body cells. It reaches the alveoli in the blood and diffuses into the air."),
    F('stem reworded: the sentence was hard to follow for an ESL reader', M('safety in design', "In the flask you breathe in through, the tube joined to the mouthpiece is short and ends above the liquid. Why?",
      "So that limewater is not sucked into the mouth", ["So that more carbon dioxide dissolves in the limewater", "So that the limewater warms up faster", "So that oxygen bubbles through the limewater"],
      "If the tube you breathe in through dipped into the liquid, you would suck limewater into your mouth.")),
    M('fair test', "How can the carbon dioxide in two air samples be compared fairly?",
      "Time how long each tube takes to turn cloudy, using fresh limewater of the same volume", ["Use more limewater for the sample that is expected to change faster", "Breathe in and out as many times as wanted until one tube goes cloudy", "Use limewater for one sample and hydrogencarbonate indicator for the other"],
      "Keep the indicator and its volume the same, and measure the time taken or use the same number of breaths."),
    M('rest and exercise', "A student times how long limewater takes to go cloudy at rest (60 s), and again just after exercise with fresh limewater (25 s). What does this show?",
      "More carbon dioxide is being breathed out after exercise", ["Less carbon dioxide is being breathed out after exercise", "The limewater was weaker during the second test", "Exercise stops respiration in the muscles"],
      "A shorter time means carbon dioxide is reaching the limewater faster, because respiration is faster after exercise."),
    M('common errors', "A student writes: 'Inhaled air contains no carbon dioxide.' What is correct?",
      "Inhaled air contains a small amount, about 0.04%", ["Inhaled air contains about 4% carbon dioxide", "Inhaled air contains about 21% carbon dioxide", "The statement is correct; it contains none"],
      "Room air has a little carbon dioxide (about 0.04%), so the inspired-air tube can change slowly."),
    M('common errors', "A student writes: 'The lungs make carbon dioxide, so expired air has more.' What is wrong?",
      "Carbon dioxide is made by respiration in all body cells, not by the lungs", ["Carbon dioxide is made by the heart, not by the lungs", "Expired air has less carbon dioxide, not more", "Nothing is wrong with this statement"],
      "The lungs are where carbon dioxide leaves the blood; it is made by respiring cells all over the body.")
  ], { date: '2026-10-13', dropped: [] });
})();
