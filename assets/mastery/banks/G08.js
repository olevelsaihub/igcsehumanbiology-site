/* Group G08 mastery bank: Breathing and gas exchange (A-Grade Block 8).
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
  // Schematic thorax: T trachea, U bronchus, V bronchiole, W alveoli, X diaphragm, Y rib, Z intercostal muscle.
  var LUNGS = (function () {
    var g = '', i;
    // ribs (arcs) and intercostal muscle between two of them
    for (i = 0; i < 5; i++) { var y = 120 + i * 42; g += '<path d="M40 ' + (y + 30) + ' Q220 ' + (y - 40) + ' 400 ' + (y + 30) + '" fill="none" stroke="#c9b48a" stroke-width="9" stroke-linecap="round"/>'; }
    g += '<path d="M46 175 Q220 109 394 175 L394 199 Q220 133 46 199 Z" fill="#e7b9b0" opacity="0.8"/>';
    g += '<ellipse cx="140" cy="225" rx="78" ry="95" fill="#f7dcdc" stroke="' + INK + '" stroke-width="1.5"/><ellipse cx="300" cy="225" rx="78" ry="95" fill="#f7dcdc" stroke="' + INK + '" stroke-width="1.5"/>';
    g += '<rect x="207" y="20" width="26" height="118" fill="#fff" stroke="' + INK + '" stroke-width="2"/>';
    for (i = 0; i < 7; i++) g += '<line x1="207" y1="' + (32 + i * 15) + '" x2="233" y2="' + (32 + i * 15) + '" stroke="' + INK + '"/>';
    g += '<path d="M220 136 L160 182" stroke="' + INK + '" stroke-width="12" stroke-linecap="round"/><path d="M220 136 L280 182" stroke="' + INK + '" stroke-width="12" stroke-linecap="round"/>';
    [[160, 182, -1], [280, 182, 1]].forEach(function (b) {
      var x = b[0], y = b[1], s = b[2];
      [[x + s * -45, y + 50], [x + s * 5, y + 75], [x + s * 45, y + 55], [x + s * -30, y + 110]].forEach(function (e) {
        g += '<line x1="' + x + '" y1="' + y + '" x2="' + e[0] + '" y2="' + e[1] + '" stroke="' + INK + '" stroke-width="4"/>';
        [[-7, 6], [6, 7], [0, 12]].forEach(function (d) { g += '<circle cx="' + (e[0] + d[0]) + '" cy="' + (e[1] + d[1]) + '" r="5.5" fill="#fff" stroke="' + INK + '"/>'; });
      });
    });
    g += '<path d="M40 352 Q220 290 400 352" fill="none" stroke="#b2553f" stroke-width="10"/>';
    g += lab(233, 60, 300, 50, 'T') + lab(185, 162, 60, 95, 'U', 'end') + lab(157, 225, 30, 260, 'V', 'end') + lab(334, 242, 420, 262, 'W') + lab(330, 336, 420, 372, 'X') +
      lab(398, 170, 420, 150, 'Y') + lab(392, 192, 420, 205, 'Z');
    return '<svg class="mc-svg mc-svg-small" viewBox="0 0 450 390" role="img" aria-label="Simplified diagram of the thorax with seven structures labelled T to Z, not to scale">' + g + '</svg>';
  })();

  /* ====================================================================== HBI-THORAX-STRUCTURE-NAME */
  T('HBI-THORAX-STRUCTURE-NAME', 'Name thorax and airway structures and the route of air', [
    M('label the thorax', "The diagram shows a simplified thorax (not to scale). Which letter labels a bronchus?", "U", ["T", "V", "W"],
      "U is one of the two tubes the trachea splits into, one going to each lung.", { svg: LUNGS, family: 'g08-lungs' }),
    M('label the thorax', "Using the same diagram, which letter labels the alveoli?", "W", ["T", "U", "V"],
      "W points to the tiny air sacs at the ends of the bronchioles.", { svg: LUNGS, family: 'g08-lungs' }),
    M('label the thorax', "Using the same diagram, which structure is labelled X?", "Diaphragm", ["Intercostal muscle", "Pleural membrane", "Sternum"],
      "X is the sheet of muscle under the lungs that separates the thorax from the abdomen.", { svg: LUNGS, family: 'g08-lungs' }),
    M('label the thorax', "Using the same diagram, which structure is labelled Z?", "Intercostal muscle", ["Diaphragm", "Bronchiole", "Trachea"],
      "Z is the tissue between two ribs (Y): the intercostal muscle.", { svg: LUNGS, family: 'g08-lungs' }),
    M('label the thorax', "Using the same diagram, which letter labels a bronchiole?", "V", ["U", "W", "X"],
      "V is a small branching tube inside the lung.", { svg: LUNGS, family: 'g08-lungs' }),
    M('air route', "Which is the correct route of air into the lungs?",
      "Trachea, bronchus, bronchiole, alveolus", ["Trachea, bronchiole, bronchus, alveolus", "Bronchus, trachea, alveolus, bronchiole", "Oesophagus, trachea, bronchus, alveolus"],
      "Air goes down the trachea, into a bronchus, along bronchioles and into alveoli."),
    M('trachea', "How can you recognise the trachea?",
      "A wide tube in the neck held open by rings of cartilage", ["A thin muscular tube behind the windpipe that carries food", "A sheet of muscle under the lungs that separates the thorax", "Tiny air sacs at the very ends of the smallest airways"],
      "The cartilage rings keep the trachea open. The oesophagus carries food, not air."),
    M('protective cage', "Which structures form a cage that protects the lungs?",
      "The ribs and the sternum", ["The diaphragm and the trachea", "The bronchi and the bronchioles", "The alveoli and the pleural membranes"],
      "The ribs and the breastbone (sternum) surround the lungs."),
    M('pleural membranes', "Where are the pleural membranes found?",
      "Lining the lungs and the inside of the chest wall", ["Inside each alveolus, where gases dissolve", "Around the trachea, holding it open with cartilage", "Between the stomach and the diaphragm muscle"],
      "Pleural membranes line the outside of the lungs and the inside of the thorax."),
    M('diseases', "Bronchitis and emphysema affect different parts of the lungs. Which pairing is correct?",
      "Bronchitis: bronchi; emphysema: alveoli", ["Bronchitis: alveoli; emphysema: bronchi", "Bronchitis: diaphragm; emphysema: trachea", "Bronchitis: ribs; emphysema: intercostal muscles"],
      "Bronchitis is inflammation of the bronchi. Emphysema damages the alveolus walls."),
    F("stem reworded so the answer is not found just by elimination from the stem's own list", M('model', "A model of the rib cage shows only the bones of the chest wall and the muscle between them. Which structure is NOT shown in this model?",
      "Diaphragm", ["Sternum", "Ribs", "Intercostal muscles"], "Name only parts that are missing from the model. The model has bones (ribs, sternum) and intercostal muscle, but no diaphragm.")),
    M('common errors', "A student labels the tiny air sacs at the ends of the airways as 'bronchioles'. What is the correct name?",
      "Alveoli", ["Bronchi", "Trachea", "Pleura"], "Bronchioles are the small tubes; the air sacs at their ends are alveoli.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-VENTILATION-MUSCLE-ACTION */
  T('HBI-VENTILATION-MUSCLE-ACTION', 'Explain how diaphragm and intercostal muscles drive breathing', [
    M('intercostals', "What do the external intercostal muscles do when a person breathes in?",
      "They contract and pull the ribs up and out", ["They relax and let the ribs fall down and in", "They contract and pull the ribs down and in", "They relax and push the diaphragm upwards"],
      "Contraction of the external intercostals raises the rib cage, moving it up and out."),
    M('diaphragm', "What does the diaphragm do when a person breathes in?",
      "It contracts and flattens", ["It relaxes and domes upwards", "It contracts and domes upwards", "It relaxes and flattens"], "Contraction of the diaphragm muscle flattens it."),
    M('sequence', "Which is the correct order of events when breathing in?",
      "Muscles contract, thorax volume rises, lung pressure falls, air flows in", ["Air flows in, lungs expand, then the muscles contract to hold them", "Muscles contract, lung pressure rises, thorax volume falls, air flows in", "Lungs expand by themselves, then the ribs and diaphragm follow them"],
      "The muscles act first; the larger volume lowers the pressure, so air is drawn in."),
    M('pressure', "Why does air move into the lungs when the thorax gets bigger?",
      "The pressure in the lungs falls below the air pressure outside", ["The pressure in the lungs rises above the air pressure outside", "The alveoli pull the air in by contracting their walls", "Oxygen diffuses in from the air because it is lighter"],
      "Air moves from higher pressure (outside) to lower pressure (inside the lungs)."),
    M('volume', "What happens to the volume of the thorax when the diaphragm contracts?",
      "It increases", ["It decreases", "It stays the same", "It first falls and then rises"], "A flattened diaphragm makes the thorax deeper, so its volume increases."),
    M('nerves', "A poison stops nerve impulses reaching the breathing muscles. Why does breathing stop?",
      "The muscles cannot contract, so the thorax volume does not change", ["The muscles contract all the time, so the lungs fill with too much air", "The alveoli stop making oxygen, so no air needs to enter", "The trachea closes, so air cannot reach the bronchi"],
      "Muscles contract only when impulses arrive. No contraction means no change in volume or pressure."),
    M('elastic fibres', "How do elastic fibres in the lungs help breathing out?",
      "They recoil and help to push air out of the lungs", ["They contract like muscles to pull air into the lungs", "They make the alveoli larger so more oxygen enters", "They hold the ribs up while the person breathes out"],
      "Stretched elastic fibres spring back (recoil), helping to squeeze air out."),
    M('elastic fibres', "A person has lost many of the elastic fibres in their lungs. Which effect is most likely?",
      "Breathing out is harder, so they use muscles to force air out and feel short of breath", ["Breathing in becomes impossible, so they stop breathing at once", "Breathing out becomes easier, so they need to breathe more slowly", "The diaphragm can no longer contract, so the ribs do all the work"],
      "Without recoil, air must be forced out by muscles, so breathing out is hard work."),
    M('breathing out', "When a person breathes out quietly, what happens to the diaphragm?",
      "It relaxes and returns to a dome shape", ["It contracts and becomes flatter", "It contracts and pulls the ribs up and out", "It stays flat and the ribs push air out"], "Relaxing lets the diaphragm dome upwards, so the thorax volume falls."),
    M('breathing out', "When breathing out, why does air leave the lungs?",
      "Thorax volume falls, so lung pressure rises above the pressure outside", ["Thorax volume rises, so lung pressure falls below the pressure outside", "Carbon dioxide is heavier than air, so it sinks out", "The alveoli burst and release the air they contained"],
      "Smaller volume means higher pressure, so air is pushed out."),
    M('common errors', "A student writes: 'The lungs expand and pull air in.' What is wrong?",
      "The muscles act first; the lungs expand because the thorax gets bigger", ["The lungs shrink when air comes in, so it is the wrong way round", "The lungs expand because oxygen diffuses into them first", "Nothing is wrong; the lungs contain muscle that expands them"],
      "The lungs have no muscle. The diaphragm and intercostal muscles change the thorax volume."),
    M('common errors', "A student writes: 'Pressure increases so air comes in.' What should it say?",
      "Pressure in the lungs decreases, so air comes in", ["Pressure outside decreases, so air comes in", "Volume decreases, so air comes in", "Pressure stays the same, so air comes in"], "Air flows in when lung pressure is lower than outside.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-SMOKING-HEALTH-DAMAGE */
  T('HBI-SMOKING-HEALTH-DAMAGE', 'Explain how smoking damages health, including in pregnancy', [
    M('tar', "Which substance in cigarette smoke causes lung cancer?",
      "Tar", ["Nicotine", "Carbon monoxide", "Oxygen"], "Tar is carcinogenic. Nicotine is addictive but does not cause cancer."),
    M('carbon monoxide', "How does carbon monoxide reduce the oxygen carried by the blood?",
      "It combines with haemoglobin to form carboxyhaemoglobin", ["It blocks the bronchi so that air cannot reach the alveoli", "It destroys red blood cells in the lungs", "It turns oxygen into carbon dioxide in the plasma"],
      "Haemoglobin bound to carbon monoxide cannot carry oxygen."),
    F("replaced a distractor about cilia that some sources treat as partly true", M('nicotine', "What effects does nicotine have?",
      "It is addictive and narrows blood vessels, raising blood pressure", ["It is carcinogenic and causes lung cancer in the cells of the alveoli", "It binds to haemoglobin so less oxygen is carried", "It dissolves the cartilage rings of the trachea"],
      "Nicotine is the addictive drug; it narrows arteries and raises blood pressure.")),
    M('pregnancy chain', "Why can smoking in pregnancy lead to a baby with a low birth mass?",
      "Less oxygen reaches the fetus, so its cells respire less and grow and divide more slowly", ["The fetus breathes in the smoke, so its lungs fill with tar and stop growing properly", "Nicotine gives the fetus more energy, so it grows too quickly and is born early", "Carbon monoxide gives the fetus more glucose, so it stores less fat"],
      "Follow the chain: less oxygen → less respiration → less energy → slower growth."),
    M('pregnancy chain', "How does oxygen reach a fetus?",
      "From the mother's blood, across the placenta", ["Through the fetus's own lungs, from the amniotic fluid", "Through the mother's lungs directly into the fetus's lungs", "From the umbilical cord, which makes oxygen"],
      "The fetus does not breathe air. Oxygen diffuses across the placenta."),
    S('diseases', "Which diseases are caused or made more likely by smoking?", ["Lung cancer", "Emphysema", "Bronchitis", "Heart disease"], ["Sickle cell anaemia", "Scurvy"],
      "Smoking causes lung cancer, emphysema, bronchitis and heart disease. Sickle cell anaemia is inherited; scurvy is a lack of vitamin C."),
    M('never smoked', "Why do some people who have never smoked still get lung cancer?",
      "Passive smoking, air pollution or their genes can cause it", ["They breathe in more oxygen than smokers, which damages the alveoli", "They have more cilia, which makes cancer more likely", "Lung cancer is only caused by eating too much fat"],
      "Smoking is the main cause, but not the only one."),
    M('ex-smokers', "Why do people who stopped smoking years ago still have a higher risk of lung cancer than people who never smoked?",
      "Their lungs may already have been damaged while they smoked", ["They still have nicotine in their blood for the rest of their lives", "Stopping smoking makes cells divide faster and become cancer", "They breathe more deeply after stopping, so they take in more tar"],
      "Damage done while smoking can remain, so the risk stays raised."),
    M('heart disease', "How does smoking increase the risk of heart disease?",
      "Nicotine raises blood pressure and carbon monoxide lowers oxygen supply to the heart", ["Tar coats the heart muscle and stops it from contracting", "Smoke enters the heart chambers and blocks the valves", "Carbon monoxide makes the blood carry extra oxygen to the heart"],
      "Higher blood pressure and less oxygen to the heart muscle raise the risk."),
    M('lifestyle', "Lack of exercise is another harmful lifestyle choice. Which risk does it raise?",
      "Obesity, heart disease and type 2 diabetes", ["Lung cancer caused by tar in the alveoli", "Low birth mass caused by carbon monoxide", "Sickle cell anaemia and haemophilia"], "Inactivity raises the risk of obesity, heart disease, high blood pressure and type 2 diabetes."),
    M('common errors', "A student writes: 'Nicotine causes lung cancer.' What is correct?",
      "Tar causes lung cancer; nicotine is addictive", ["Carbon monoxide causes lung cancer; tar is addictive", "Nicotine causes emphysema; tar causes heart disease", "Oxygen causes lung cancer; nicotine protects the lungs"], "Tar is the carcinogen."),
    M('common errors', "A student writes: 'Carbon monoxide blocks the lungs.' What is the better explanation?",
      "It binds to haemoglobin, so less oxygen is carried", ["It binds to the cilia, so less mucus is moved along", "It fills the alveoli, so no air can enter", "It dissolves the trachea, so air leaks out"], "Carbon monoxide acts in the blood, on haemoglobin.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-EXERCISE-AND-BREATHING-CONTROL */
  T('HBI-EXERCISE-AND-BREATHING-CONTROL', 'Explain heart and breathing changes in exercise and how carbon dioxide controls breathing', [
    M('heart rate', "Why does heart rate rise during exercise?",
      "To deliver oxygen and glucose to muscles faster and remove carbon dioxide faster", ["To cool the muscles by pumping cold blood to them from the skin", "To carry more lactic acid to the muscles so that they can keep on contracting", "To send more blood to the gut so that food is digested faster"],
      "Working muscles respire faster, so they need more oxygen and glucose and make more carbon dioxide."),
    M('redirection', "Which organs receive less blood during hard exercise?",
      "The gut, liver and kidneys", ["The skeletal muscles in the legs", "The heart muscle", "The lungs"], "Blood is moved away from the gut, liver and kidneys towards the working muscles."),
    M('chemoreceptors', "Where are the chemoreceptors that detect carbon dioxide in the blood?",
      "In the aorta and the carotid arteries", ["In the alveoli and the bronchioles", "In the vena cava and the pulmonary vein", "In the diaphragm and the intercostal muscles"],
      "Chemoreceptors in the aorta and carotid arteries detect a rise in carbon dioxide (and a fall in pH)."),
    M('control centre', "Which part of the brain receives impulses from the chemoreceptors and controls breathing?",
      "The medulla oblongata", ["The cerebrum", "The cerebellum", "The pituitary gland"], "The medulla sends impulses to the breathing muscles and the heart."),
    M('control chain', "Which chain explains why breathing rate rises during exercise?",
      "Faster respiration, more carbon dioxide, chemoreceptors detect it, medulla sends impulses to breathing muscles", ["Less respiration, less carbon dioxide, lungs detect it, diaphragm decides to contract faster", "Faster respiration, less oxygen in the lungs, alveoli send impulses straight to the heart", "More glucose in the blood, pancreas detects it, insulin makes the lungs work faster"],
      "At this level the detected change is the rise in carbon dioxide."),
    M('oxygen debt', "Why do breathing and heart rate stay high for a while after exercise ends?",
      "Extra oxygen is needed to break down the lactic acid made during exercise", ["The muscles still need extra glucose to make lactic acid", "The chemoreceptors are slow to switch off after they detect low oxygen levels", "Carbon dioxide must be turned back into oxygen in the lungs"],
      "This extra oxygen is the oxygen debt, used to break down lactic acid."),
    M('adrenaline', "Which of these is an effect of adrenaline?",
      "Glycogen is converted to glucose in the liver and muscles", ["Glucose is converted to glycogen in the liver", "Heart rate falls and the air passages narrow", "More blood is sent to the gut and less blood to the leg muscles"],
      "Adrenaline makes more glucose available for respiration, raises heart rate and widens the airways."),
    M('vagus nerve', "The vagus nerve carries impulses that slow the heart. A drug stops this nerve working. What happens to heart rate?",
      "It rises", ["It falls", "It stays the same", "It stops"], "Without the slowing impulses, the heart beats faster."),
    M('breathing CO2', "A person breathes air that contains extra carbon dioxide. What happens to their breathing?",
      "Both the rate and the depth (tidal volume) increase", ["The rate increases but the depth decreases", "The rate decreases but the depth increases", "Neither changes, because only oxygen is detected"],
      "More carbon dioxide in the blood is detected, so both rate and depth rise to remove it."),
    S('other changes', "Which of these also increase during exercise?", ["Rate of respiration", "Blood pressure", "Sweating"], ["Blood flow to the kidneys", "Rate of digestion"],
      "Metabolism, blood pressure and sweating rise; blood is moved away from the kidneys and gut."),
    { skill: 'pulse data', gen: function () {
      var rest = rint(60, 78), up = rint(30, 70), ex = rest + up, pc = Math.round(up / rest * 1000) / 10;
      return nq("A student's pulse rate is " + rest + " beats per minute at rest and " + ex + " beats per minute just after running. Calculate the percentage increase in pulse rate. Give your answer to 1 decimal place.", pc, '%',
        "Increase = " + ex + " − " + rest + " = " + up + ". Percentage increase = " + up + " ÷ " + rest + " × 100 = " + pc.toFixed(1) + "%.", { display: pc.toFixed(1), tol: 0.06 });
    } },
    M('common errors', "A student writes: 'During exercise the muscles make more energy.' What is the correct wording?",
      "The muscles release more energy by respiration", ["The muscles store more energy as lactic acid", "The muscles make more oxygen for energy", "The muscles make more glucose by respiration"], "Respiration releases energy; it does not make it.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-ALVEOLI-GAS-EXCHANGE */
  T('HBI-ALVEOLI-GAS-EXCHANGE', 'Explain how alveoli are adapted for gas exchange and effects of damage', [
    M('surface area', "How does having millions of alveoli help gas exchange?",
      "It gives a very large total surface area, so much gas can diffuse at once", ["It gives the lungs a very large volume, so they can hold far more air at once", "It makes the walls thicker, so they do not tear when breathing", "It keeps the air in the lungs cooler, so gases dissolve faster"],
      "A large surface area allows more diffusion at the same time."),
    M('thin walls', "How does the thin wall between an alveolus and a capillary help?",
      "Each wall is one cell thick, so the diffusion distance is short", ["The walls are thick, so the gases cannot leak out of the lungs", "The walls contain muscle, so they can pump the gases across them", "The walls are dry, so gases pass through them faster"],
      "A short diffusion distance means faster diffusion."),
    M('moist lining', "Why is the inside of each alveolus moist?",
      "Gases dissolve in the moisture before they diffuse", ["The moisture traps pathogens like mucus", "The moisture keeps the alveoli from touching the capillaries", "Water carries oxygen to the cells by osmosis"],
      "Oxygen dissolves in the thin film of water, then diffuses across."),
    M('gradient', "How is a steep concentration gradient for oxygen kept up?",
      "Breathing brings in fresh air and blood flow carries oxygen away", ["The alveoli make oxygen from the carbon dioxide in the blood", "The capillaries close between breaths to stop blood flowing", "The alveoli hold their air for a long time without it ever changing"],
      "Ventilation and a good blood supply keep oxygen high in the alveolus and low in the blood."),
    M('direction', "In which direction does oxygen diffuse in the lungs?",
      "From the alveolus air into the blood", ["From the blood into the alveolus air", "From the capillary into the bronchiole", "From the plasma into the trachea"], "Oxygen moves down its concentration gradient into the blood."),
    S('alveolar air', "Compared with the air outside, which statements about air in the alveoli are correct?", ["It has less oxygen", "It has more carbon dioxide", "It has more water vapour", "It is warmer"], ["It has more oxygen", "It is colder"],
      "Alveolar air has given up some oxygen, gained carbon dioxide and water vapour, and been warmed."),
    M('emphysema', "In emphysema, the walls of the alveoli break down. What is the effect?",
      "The surface area falls, so less oxygen diffuses into the blood", ["The surface area rises, so too much oxygen enters the blood", "The walls get thinner, so gas exchange becomes faster", "The alveoli fill with blood, so no air at all can enter them"],
      "Less surface area means less diffusion of oxygen into the blood."),
    M('emphysema chain', "Why does a person with emphysema often feel tired and breathless?",
      "Less oxygen enters the blood, so cells do less aerobic respiration and release less energy", ["More carbon dioxide enters the blood, so cells make far more energy than they need", "Their lungs hold too much oxygen, so the cells stop respiring", "Their blood carries no oxygen at all, so cells release no energy"],
      "Link the lost surface area to oxygen, respiration and energy."),
    M('SA:V', "In emphysema, small alveoli join into larger air spaces. How does this affect gas exchange?",
      "The larger spaces have a smaller surface area to volume ratio, so exchange is less efficient", ["The larger spaces have a larger surface area to volume ratio, so exchange is more efficient", "The larger spaces hold more air, so gas exchange is faster and easier", "The larger spaces have thicker walls, so more oxygen is stored in them"],
      "Bigger spaces have less surface for their volume, so less gas diffuses."),
    M('capillary network', "Why is a dense network of capillaries around the alveoli useful?",
      "Blood constantly carries oxygen away, keeping the gradient steep", ["The capillaries make the alveolus walls thicker and stronger", "The capillaries push air into the alveoli whenever they contract", "The capillaries store oxygen until the body needs it"],
      "Lots of capillaries with flowing blood keep the oxygen concentration in the blood low."),
    M('common errors', "A student writes: 'Alveoli have thin cell walls.' Why is this wrong?",
      "Animal cells have no cell wall; say 'thin walls' or 'one cell thick'", ["Alveoli have thick cell walls made of cellulose", "Alveoli have no walls of any kind", "The walls of alveoli are made of cartilage"],
      "Only plant cells have cell walls."),
    M('common errors', "A student says emphysema gives the alveoli a 'bigger surface area' because the air spaces are bigger. What is correct?",
      "The surface area to volume ratio becomes smaller", ["The surface area to volume ratio becomes larger", "The surface area of each air space stays the same", "The alveoli disappear completely"], "Bigger spaces have a smaller surface area to volume ratio.")
  ], { date: '2026-10-13', dropped: [] });
})();
