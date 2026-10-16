/* Group G11 mastery bank: Homeostasis: skin, kidney and liver (A-Grade Block 11).
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
  // Nephron schematic: F glomerulus, G Bowman's capsule, H proximal tubule, J loop of Henle, K distal tubule, L collecting duct.
  var NEPH = (function () {
    var T = '#c9a46a', g = '';
    g += '<line x1="8" y1="58" x2="66" y2="66" stroke="' + HI + '" stroke-width="9"/><line x1="66" y1="78" x2="10" y2="92" stroke="' + HI + '" stroke-width="4"/>';
    g += '<path d="M52 48 A38 38 0 1 1 52 92" fill="none" stroke="' + T + '" stroke-width="9"/>';
    [[70, 62], [82, 56], [90, 68], [76, 76], [86, 82], [68, 72]].forEach(function (c) { g += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="8" fill="none" stroke="' + HI + '" stroke-width="3"/>'; });
    g += '<path d="M118 60 L124 48 q12 -22 24 0 t24 0 t24 0 L200 48 L200 300 Q220 330 240 300 L240 130 q12 -22 24 0 t24 0 t24 0 t24 0 L370 130" fill="none" stroke="' + T + '" stroke-width="8" stroke-linejoin="round"/>';
    g += '<line x1="370" y1="30" x2="370" y2="345" stroke="' + T + '" stroke-width="12"/>';
    g += lab(80, 76, 40, 165, 'F', 'end') + lab(90, 34, 100, 12, 'G') + lab(160, 40, 205, 18, 'H') + lab(205, 250, 130, 260, 'J', 'end') + lab(300, 122, 300, 80, 'K') + lab(376, 250, 420, 250, 'L');
    return '<svg class="mc-svg mc-svg-small" viewBox="0 0 450 360" role="img" aria-label="Simplified nephron with six parts labelled F to L, not to scale">' + g + '</svg>';
  })();

  /* ====================================================================== HBI-NAME-RENAL-STRUCTURES */
  T('HBI-NAME-RENAL-STRUCTURES', 'Identify urinary system and nephron structures', [
    M('label the nephron', "The diagram shows a simplified nephron. Which letter labels the glomerulus?", "F", ["G", "H", "L"],
      "F is the knot of capillaries inside the cup.", { svg: NEPH, family: 'g11-neph' }),
    M('label the nephron', "Using the same diagram, which part is labelled G?", "Bowman's capsule", ["Glomerulus", "Loop of Henle", "Collecting duct"],
      "G is the cup that surrounds the glomerulus.", { svg: NEPH, family: 'g11-neph' }),
    M('label the nephron', "Using the same diagram, which letter labels the loop of Henle?", "J", ["H", "K", "L"],
      "J is the long U-shaped loop between the two coiled tubules.", { svg: NEPH, family: 'g11-neph' }),
    M('label the nephron', "Using the same diagram, which letter labels the part where glucose is reabsorbed?", "H", ["F", "K", "L"],
      "H is the proximal (first) convoluted tubule, where all the glucose is reabsorbed.", { svg: NEPH, family: 'g11-neph' }),
    M('label the nephron', "Using the same diagram, which letter labels the collecting duct?", "L", ["J", "K", "H"],
      "L is the wide tube that several nephrons empty into.", { svg: NEPH, family: 'g11-neph' }),
    M('urinary system', "Which tube carries urine from a kidney to the bladder?",
      "Ureter", ["Urethra", "Renal vein", "Collecting duct"], "Ureter: kidney to bladder. Urethra: bladder to outside."),
    M('urinary system', "Which tube carries urine out of the body from the bladder?",
      "Urethra", ["Ureter", "Renal artery", "Loop of Henle"], "The urethra leads from the bladder to the outside."),
    M('blood vessels', "Which vessel brings blood to the kidney?",
      "Renal artery", ["Renal vein", "Ureter", "Hepatic portal vein"], "The renal artery supplies the kidney; the renal vein takes blood away."),
    M('order', "Which is the correct order of parts in a nephron?",
      "Bowman's capsule, proximal tubule, loop of Henle, distal tubule, collecting duct", ["Bowman's capsule, loop of Henle, proximal tubule, distal tubule, collecting duct", "Collecting duct, distal tubule, loop of Henle, proximal tubule, Bowman's capsule", "Bowman's capsule, distal tubule, loop of Henle, proximal tubule, collecting duct"],
      "The proximal tubule comes before the loop of Henle."),
    M('jobs', "Which part of the kidney controls how much water is reabsorbed, under the control of ADH?",
      "Collecting duct", ["Glomerulus", "Bowman's capsule", "Ureter"], "ADH acts on the collecting ducts."),
    M('dialysis link', "In a dialysis machine, which part of the nephron does the partially permeable tubing act like?",
      "The glomerulus, letting small molecules out of the blood", ["The bladder, storing urine until it is released", "The loop of Henle, making the urine more dilute", "The ureter, carrying urine to the bladder"],
      "Both let small molecules pass out of the blood."),
    M('common errors', "A student labels the knot of capillaries as 'Bowman's capsule'. What is the correct name?",
      "Glomerulus", ["Collecting duct", "Ureter", "Loop of Henle"], "The capsule is the cup; the glomerulus is the knot of capillaries inside it.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-HOMEOSTASIS-NEGATIVE-FEEDBACK */
  T('HBI-HOMEOSTASIS-NEGATIVE-FEEDBACK', 'Explain homeostasis and negative feedback', [
    M('definition', "What is homeostasis?",
      "Keeping the internal environment of the body constant", ["Keeping the outside environment at a constant temperature", "Changing the body to match the outside conditions", "Making the body grow at a constant rate"],
      "It keeps internal conditions steady even when outside conditions change."),
    S('examples', "Which of these are kept constant by homeostasis?", ["Body temperature", "Blood glucose concentration", "Water content of the blood"], ["Height", "Hair colour"],
      "These are the three main examples in this course."),
    M('negative feedback', "What happens in negative feedback?",
      "A change from normal is detected and a response reverses it", ["A change from normal is detected and a response makes it larger", "A change is ignored until the body becomes ill", "The body copies the change seen in the outside air"],
      "The response brings the level back towards normal."),
    M('switch off', "What happens to the response once the level is back to normal?",
      "It is switched off", ["It becomes stronger", "It carries on for ever", "It reverses direction at once"], "Otherwise the level would overshoot."),
    M('37 °C', "Why is body temperature kept close to 37 °C?",
      "Enzymes work best at this temperature", ["Cells cannot respire at all above 30 °C", "Blood freezes below 37 °C", "Hormones only work at exactly 37 °C"], "Too hot denatures enzymes; too cold slows them."),
    M('too hot', "What happens to enzymes if body temperature rises well above 37 °C?",
      "They are denatured, so they stop working", ["They die, so they must be replaced", "They work faster and faster without limit", "They turn into hormones"], "Say denatured, not 'killed'."),
    M('too cold', "What happens to enzyme activity if body temperature falls well below 37 °C?",
      "Enzymes work slowly, so reactions slow down", ["Enzymes are all denatured at once by the cold", "Enzymes work faster to keep warm", "Enzymes leave the cells"], "Low temperature slows enzymes but does not denature them."),
    M('detectors', "Which part detects a change in body temperature?",
      "The hypothalamus", ["The pancreas", "The skin's sweat glands", "The liver"], "The hypothalamus monitors blood temperature."),
    M('detectors', "Which organ detects a change in blood glucose?",
      "The pancreas", ["The hypothalamus", "The kidney", "The skin"], "The pancreas detects glucose levels and releases insulin or glucagon."),
    M('effectors', "In temperature control, how does the hypothalamus reach its effectors?",
      "It sends nerve impulses to sweat glands, skin arterioles and muscles", ["It releases glucagon into the blood to reach the skin", "It sends urine to the bladder to remove heat", "It sends hormones to the eye to change the pupil"],
      "Temperature responses are controlled by nerves."),
    M('example', "Body temperature rises during exercise and sweating increases until it falls back to normal. Why is this negative feedback?",
      "The response reverses the rise and stops when normal is reached", ["The response makes the temperature rise even further", "The response happens only when the person decides to sweat", "The response keeps going after the temperature is normal"],
      "Negative feedback reverses the change."),
    M('common errors', "A student defines homeostasis as 'keeping the body the same'. What is missing?",
      "That it is the internal environment that is kept constant", ["That the body must grow larger all the time to stay the same", "That it only happens during sleep", "That it only affects the skin"], "Use the words 'internal environment'.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-BLOOD-GLUCOSE-INSULIN-GLUCAGON */
  T('HBI-BLOOD-GLUCOSE-INSULIN-GLUCAGON', 'Explain how insulin and glucagon control blood glucose', [
    M('after a meal', "Blood glucose rises after a meal. Which hormone does the pancreas release?",
      "Insulin", ["Glucagon", "Glycogen", "ADH"], "Insulin lowers blood glucose."),
    M('insulin action', "How does insulin lower blood glucose?",
      "It makes the liver and muscles take in glucose and convert it to glycogen", ["It makes the liver convert glycogen back into glucose for the blood", "It breaks glucose down into carbon dioxide inside the blood", "It makes the kidneys pass all the glucose out in the urine"],
      "Insulin causes uptake of glucose and storage as glycogen."),
    M('low glucose', "Blood glucose falls after a long time without food. Which hormone is released?",
      "Glucagon", ["Insulin", "Glycogen", "Adrenaline only"], "Glucagon raises blood glucose."),
    M('glucagon action', "How does glucagon raise blood glucose?",
      "It makes the liver convert glycogen into glucose", ["It makes the liver convert glucose into glycogen", "It makes the pancreas release glucose", "It makes the gut digest more starch"], "The glucose then passes into the blood."),
    M('storage', "Where is glycogen stored?",
      "In the liver and muscles", ["In the pancreas and kidneys", "In the blood plasma", "In the bladder"], "Extra glucose can also be turned into fat."),
    M('names', "Which statement about glucagon and glycogen is correct?",
      "Glucagon is a hormone; glycogen is a storage carbohydrate", ["Glycogen is a hormone; glucagon is a storage carbohydrate", "Both are hormones made by the pancreas", "Both are carbohydrates stored in the liver"],
      "The names look alike, so check the spelling."),
    M('detector', "Which organ detects the blood glucose level and releases the hormones?",
      "Pancreas", ["Liver", "Kidney", "Hypothalamus"], "The pancreas detects and responds."),
    M('muscles', "What do muscle cells use glucose for?",
      "Respiration, to make ATP", ["Making insulin", "Making urea", "Making glucagon"], "Glucose is the main respiratory substrate."),
    M('diabetes', "Why does blood glucose stay high in a person with untreated diabetes?",
      "Insulin is not made or does not work, so glucose is not taken up and stored", ["Too much insulin is made, so glucose cannot leave the blood", "Glucagon is not made, so glycogen cannot form", "The liver releases too much insulin into the blood"],
      "Without working insulin, glucose stays in the blood."),
    M('long-term damage', "Over many years, how can high blood glucose harm sight?",
      "It damages blood vessels and neurones in the retina", ["It makes the lens grow larger", "It turns the cornea into glycogen", "It makes the iris stop working"], "Damaged vessels reduce blood flow to the retina."),
    M('glucose', "What is the main sugar carried in the blood?",
      "Glucose", ["Sucrose", "Starch", "Glycogen"], "Write 'glucose', not just 'sugar'."),
    M('common errors', "A student writes: 'Insulin breaks down glucose.' What does insulin actually do?",
      "It makes cells take up glucose and store it as glycogen", ["It breaks glucose down into urea", "It turns glycogen into glucose", "It removes glucose in the urine"], "Insulin causes uptake and storage.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-SKIN-THERMOREGULATION-RESPONSES */
  T('HBI-SKIN-THERMOREGULATION-RESPONSES', 'Explain how skin blood flow and sweating control body temperature', [
    M('vasodilation', "When the body is too hot, what happens to the arterioles leading to the skin capillaries?",
      "They widen (vasodilation), so more blood flows near the surface", ["They narrow (vasoconstriction), so less blood flows near the surface", "They move closer to the surface of the skin", "They close completely, so no blood reaches the skin"],
      "More blood near the surface means more heat lost by radiation."),
    M('vasoconstriction', "When the body is too cold, what happens to the arterioles leading to the skin?",
      "They narrow (vasoconstriction), so less heat is lost", ["They widen (vasodilation), so more heat is lost from the skin", "They move deeper into the skin", "They fill with sweat to keep heat in"], "Less blood near the surface reduces heat loss."),
    M('sweating', "How does sweating cool the body?",
      "Water in sweat evaporates, using heat energy from the body", ["Sweat is cold, so it cools the skin as soon as it is released onto it", "Sweat blocks the sun's rays from heating the skin", "Sweat carries blood away from the skin surface"],
      "Evaporation takes heat from the skin."),
    M('shivering', "Why does shivering warm the body?",
      "Muscles contract rapidly and release heat from respiration", ["Muscles stop respiring, so they keep the heat inside the body", "Shivering moves the capillaries away from the skin", "Shivering makes the sweat glands release warm sweat"],
      "Muscle contraction needs respiration, which releases heat."),
    M('red skin', "Why does skin look red after hard exercise?",
      "Vasodilation sends more blood through the capillaries near the surface", ["The capillaries move up nearer to the surface of the skin during exercise", "Sweat contains red pigment from the blood", "Red blood cells leave the capillaries into the skin"],
      "Capillaries do not move; blood flow through them changes."),
    M('control', "Which part of the body detects a rise in blood temperature and sends impulses to the skin?",
      "The hypothalamus", ["The pituitary gland", "The pancreas", "The cerebellum"], "The hypothalamus is the temperature control centre."),
    M('hairs', "When cold, how do hairs on the skin help to keep the body warm?",
      "They stand up and trap a layer of air that insulates the skin", ["They lie flat so that heat leaves the skin far more quickly", "They fall out so that the skin can absorb more sunlight", "They release sweat that keeps the skin warm"],
      "Trapped air is a poor conductor of heat."),
    M('exercise', "Why does a person sweat more during exercise?",
      "More respiration in the muscles releases more heat", ["Exercise makes the blood colder, so sweat is needed", "Muscles make sweat when they contract", "Exercise stops vasodilation in the skin"], "More heat released means more sweat."),
    F("replaced a distractor that did not fit the outdoor setting (it mentioned a room)", M('people differ', "Two people walk the same route on the same day. One sweats much more. Which is a likely reason?",
      "They have a different body mass or drank a different amount of water", ["They walked along exactly the same route on exactly the same day", "They both released exactly the same amount of heat", "Sweating is not affected by anything in the body"],
      "Activity, body mass, water drunk and temperature all affect sweating.")),
    M('shunt vessels', "When hot, what happens to the shunt vessels in the skin?",
      "They narrow, so more blood goes through the surface capillaries", ["They widen, so less blood goes through the surface capillaries", "They move up to the skin surface", "They release sweat"], "This sends more blood near the surface."),
    M('hot room', "A person sits still in a hotter room. What happens to sweating?",
      "It increases, even though the person is not moving", ["It stops, because the person is not exercising", "It stays the same, because only exercise affects sweating", "It falls, because hot air contains less water"], "A higher temperature increases sweating."),
    M('common errors', "A student writes: 'Capillaries move closer to the surface of the skin.' What is correct?",
      "Capillaries do not move; more blood flows through them", ["Capillaries move deeper into the skin when the body is hot", "Capillaries grow longer when hot", "Capillaries fill with sweat when hot"], "Blood flow changes, not position.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-LIVER-DEAMINATION-AND-DETOXIFICATION */
  T('HBI-LIVER-DEAMINATION-AND-DETOXIFICATION', "Explain the liver's roles in deamination and breaking down drugs", [
    M('deamination', "What is deamination?",
      "Removing the nitrogen-containing group from extra amino acids", ["Digesting proteins into amino acids in the stomach and small intestine", "Building new proteins from amino acids", "Removing water from the blood in the kidneys"],
      "Deamination happens in the liver."),
    M('urea', "Where is urea made?",
      "In the liver", ["In the kidneys", "In the bladder", "In the small intestine"], "The amine group becomes ammonia and then urea in the liver. The kidneys remove it."),
    M('storage', "Why are extra amino acids deaminated?",
      "Amino acids cannot be stored in the body", ["Amino acids are stored as fat in the liver", "Amino acids are toxic at any level", "Amino acids are needed to make urine"], "Unlike glucose, extra amino acids cannot be stored."),
    M('route', "Which is the correct route for nitrogen from extra amino acids?",
      "Amine group, ammonia, urea in blood, kidneys, urine", ["Amine group, glucose, glycogen, liver, bile", "Amine group, urea, ammonia, lungs, air", "Amine group, fat, adipose tissue, skin, sweat"],
      "Urea is carried in the blood to the kidneys."),
    M('kidney patients', "Why are people with kidney failure told to eat less protein?",
      "Less protein means less urea is made, which damaged kidneys cannot remove well", ["Protein is turned into glucose, which damages the kidneys further and blocks them", "Protein blocks the dialysis tubing, so the machine cannot work", "Protein is stored in the kidneys and makes them larger"],
      "Link less protein to less urea for the kidneys to remove."),
    M('detoxification', "What does the liver do with alcohol and other drugs?",
      "Breaks them down, so their level in the blood falls", ["Stores them until they are needed by the brain later", "Filters them out into the urine directly", "Turns them into amino acids"], "The liver detoxifies alcohol and drugs."),
    M('liver damage', "Why can a normal dose of a medicine be dangerous for a person with liver damage?",
      "The liver cannot break the medicine down well, so it builds up in the blood", ["The liver breaks the medicine down far too fast, so it never has any effect", "The kidneys make more of the medicine when the liver is damaged", "The medicine is stored as glycogen in the damaged liver"],
      "A damaged liver detoxifies poorly, so drug levels stay high."),
    M('blood supply', "From which two vessels does the liver receive blood?",
      "Hepatic artery and hepatic portal vein", ["Renal artery and renal vein", "Aorta and pulmonary artery", "Hepatic vein and the inferior vena cava"], "The hepatic portal vein brings blood from the gut."),
    M('high flow', "Why does the liver have a high blood flow?",
      "It has many jobs, such as glucose control, deamination and detoxification", ["It stores all of the blood that the body is not using at that moment", "It pumps blood around the body with the heart", "It makes red blood cells for the whole body"],
      "Many jobs and two blood vessels give a high blood flow."),
    M('not all broken down', "What happens to most amino acids absorbed from food?",
      "Many are used to build new proteins in the body", ["All are deaminated in the liver straight away", "All are stored in the muscles as extra protein", "All are removed by the kidneys unchanged"], "Only the extra amino acids are deaminated."),
    F("correct answer reworded (it was circular)", M('kidney damage', "If the kidneys are damaged, why can drug waste products build up?",
      "These wastes are normally removed by the kidneys, so now they stay in the blood", ["The kidneys normally make these drugs, so they make too much", "The liver stops working when the kidneys are healthy", "The bladder absorbs the drugs back into the blood"], "Waste that is not removed builds up.")),
    M('common errors', "A student writes: 'The liver filters alcohol out of the blood.' What is a better word?",
      "The liver breaks down alcohol", ["The liver stores alcohol", "The liver makes alcohol", "The liver excretes alcohol in urine"], "The liver breaks alcohol down (detoxifies it).")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-KIDNEY-FILTRATION-REABSORPTION */
  T('HBI-KIDNEY-FILTRATION-REABSORPTION', 'Explain ultrafiltration and selective reabsorption in the nephron', [
    M('pressure', "Why is the blood in the glomerulus under high pressure?",
      "The vessel leaving the glomerulus is narrower than the vessel entering it", ["The vessel leaving the glomerulus is wider than the vessel that enters it", "The glomerulus has muscle in its walls that pumps the blood", "The Bowman's capsule squeezes the blood as it passes through"],
      "A narrower exit vessel builds up pressure."),
    S('filtered', "Which substances are forced out of the blood into the Bowman's capsule?", ["Water", "Glucose", "Urea", "Salts"], ["Red blood cells", "Plasma proteins"],
      "Small molecules are filtered; cells and proteins are too large."),
    M('too large', "Why do proteins stay in the blood during ultrafiltration?",
      "Protein molecules are too large to pass through", ["Proteins are reabsorbed in the loop of Henle", "Proteins are broken down in the glomerulus", "Proteins are pumped back by the capsule"], "Protein is not filtered at all."),
    M('glucose', "What normally happens to the glucose that is filtered?",
      "All of it is reabsorbed into the blood in the proximal tubule", ["All of it is lost in the urine", "Half of it is reabsorbed in the bladder", "It is turned into urea in the collecting duct before leaving"],
      "This is selective reabsorption."),
    M('diabetes', "Why is glucose found in the urine of a person with untreated diabetes?",
      "So much glucose is filtered that not all of it can be reabsorbed", ["Insulin pushes glucose out of the blood into the urine", "The glomerulus cannot filter glucose at all", "Glucose is made in the bladder"],
      "The tubule can only reabsorb a certain amount."),
    M('more urine', "Why does a person with untreated diabetes make more urine?",
      "Glucose in the filtrate lowers its water potential, so less water is reabsorbed", ["Glucose in the filtrate raises its water potential, so more water is reabsorbed", "Insulin makes the kidneys release more water", "Glucose turns into water in the tubule"],
      "Less water reabsorbed means more urine."),
    M('proteinuria', "Protein is found in a person's urine. What does this suggest?",
      "The glomerulus is damaged", ["The person ate too much protein", "The bladder is making protein", "The collecting duct is working well"], "Protein should be too large to be filtered."),
    M('damaged glomeruli', "If the glomeruli are inflamed and filter poorly, what happens to urea?",
      "Urea stays in the blood and builds up", ["Urea is all removed in a large volume of urine", "Urea turns into glucose in the blood", "Urea is stored in the bladder wall"], "Poor filtration leaves waste in the blood."),
    M('process', "Is ultrafiltration caused by diffusion or by pressure?",
      "By high blood pressure forcing small molecules out", ["By diffusion of molecules down a concentration gradient", "By osmosis of water out of the blood", "By active transport into the capsule"], "Write 'pressure' and say why it is high."),
    M('selective', "Why is the reabsorption in the proximal tubule called 'selective'?",
      "Only useful substances, such as glucose, are taken back into the blood", ["Every substance in the filtrate is taken back into the blood, including urea", "Only urea is taken back into the blood", "Only protein is taken back into the blood"], "Waste such as urea is left in the tubule."),
    M('filtrate vs blood', "Compared with blood plasma in the glomerulus, what does the filtrate in the capsule lack?",
      "Proteins and blood cells", ["Water and glucose", "Urea and salts", "Amino acids and water"], "Everything small passes; large proteins and cells stay."),
    M('common errors', "A student writes: 'Protein is filtered and then reabsorbed.' What is correct?",
      "Protein is not filtered, because it is too large", ["Protein is filtered and lost in urine", "Protein is reabsorbed in the bladder", "Protein is turned into glucose in the tubule"], "Protein should never enter the filtrate.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-ADH-OSMOREGULATION */
  T('HBI-ADH-OSMOREGULATION', 'Explain how ADH changes urine volume and concentration', [
    M('detector', "Which part of the brain detects the water content of the blood?",
      "Hypothalamus", ["Pituitary gland", "Cerebellum", "Medulla"], "The hypothalamus detects; the pituitary releases ADH."),
    M('release', "If the blood has too little water, what does the pituitary gland do?",
      "It releases more ADH into the blood", ["It releases less ADH into the blood", "It releases insulin into the blood", "It sends nerve impulses to the bladder"], "More ADH means more water is saved."),
    M('ADH action', "How does ADH affect the collecting ducts?",
      "It makes their walls more permeable to water", ["It makes their walls less permeable to water", "It makes them pump urea into the blood", "It closes them so that no urine forms"], "More permeable walls let more water be reabsorbed."),
    M('result', "What is the effect of more ADH on urine?",
      "A small volume of concentrated urine", ["A large volume of dilute urine", "A large volume of concentrated urine", "No urine at all"], "More water goes back into the blood."),
    M('too much water', "A person drinks a lot of water. What happens?",
      "Less ADH is released and a large volume of dilute urine is made", ["More ADH is released and a small volume of concentrated urine is made", "Less ADH is released and no urine is made", "More ADH is released and the urine becomes dilute"],
      "Less ADH makes the ducts less permeable."),
    M('hot day', "Why is less urine made on a hot day?",
      "More water is lost in sweat, so more ADH is released and more water is reabsorbed", ["More water is drunk on hot days, so less ADH is needed by the kidneys", "Heat stops the glomerulus from filtering any blood at all", "Sweating removes the urea, so no urine is needed"],
      "Link sweating to ADH and water reabsorption."),
    M('alcohol', "Why does drinking alcohol lead to more, dilute urine?",
      "Alcohol reduces ADH release, so less water is reabsorbed", ["Alcohol increases ADH release, so more water is reabsorbed", "Alcohol is turned into urine in the bladder", "Alcohol makes the glomerulus filter less"], "Less ADH means more water leaves in urine."),
    M('transport', "How does ADH travel from the pituitary gland to the kidney?",
      "In the blood plasma", ["Along nerve fibres", "Through the ureter", "In the lymph only"], "ADH is a hormone, carried in the blood."),
    M('some urine', "Even after drinking a lot of water, why must some water still leave in urine?",
      "Urea and other toxic wastes must be dissolved and removed", ["The bladder must always be kept completely full", "Water cannot be reabsorbed at all after drinking", "The kidneys need to make glucose every day"],
      "Waste is always being made and must be removed in solution."),
    M('which gland', "Which gland releases ADH?",
      "Pituitary gland", ["Hypothalamus", "Pancreas", "Adrenal gland"], "The hypothalamus detects; the pituitary releases."),
    M('common errors', "A student writes: 'More ADH makes more urine.' What is correct?",
      "More ADH makes less urine", ["More ADH makes no urine at all", "More ADH makes urine more dilute", "ADH has no effect on urine volume"], "ADH saves water, so less urine is made."),
    M('common errors', "A student writes: 'ADH makes the kidney absorb more urine.' What is a better statement?",
      "ADH makes the collecting ducts reabsorb more water into the blood", ["ADH makes the bladder absorb more urine into the blood", "ADH makes the glomerulus filter more urine", "ADH makes the ureter absorb more water"], "It is water that is reabsorbed, not urine.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-PARTIALLY-PERMEABLE-MEMBRANE-DIALYSIS */
  T('HBI-PARTIALLY-PERMEABLE-MEMBRANE-DIALYSIS', 'Explain diffusion across a partially permeable membrane in dialysis and Visking tubing', [
    M('membrane', "Which molecules can pass through a partially permeable membrane in dialysis?",
      "Small molecules such as water, glucose, urea and salts", ["Large molecules such as protein and starch", "Only red blood cells and platelets", "Only waste molecules such as urea and nothing else"], "Any small molecule can pass."),
    M('urea removal', "Why does urea diffuse out of the blood into the dialysis fluid?",
      "The fluid contains no urea, so urea moves down its concentration gradient", ["The fluid contains more urea, so urea moves up its concentration gradient", "Urea moves by osmosis with the water", "The machine pumps urea out of the blood"],
      "Diffusion goes from high to low concentration."),
    M('glucose', "Why does the dialysis fluid contain glucose at the same concentration as normal blood?",
      "So there is no concentration gradient and glucose is not lost from the blood", ["So the glucose can feed the red blood cells while they are in the machine", "So the glucose diffuses into the blood to raise it very high", "So the glucose pushes the urea out of the blood"],
      "Same concentration means no net movement."),
    M('salts', "Why does the dialysis fluid contain salts at the same concentration as normal blood?",
      "So useful salts are not lost, and water does not move by osmosis", ["So the salts can kill any bacteria that are carried in the patient's blood", "So the salts make the blood clot", "So the salts are added to the blood"], "Matching concentrations prevents loss."),
    M('opposite flow', "Why do blood and dialysis fluid flow in opposite directions?",
      "A concentration gradient is kept along the whole membrane", ["The blood flows much faster when it goes the other way", "It stops the fluid from mixing with air", "It lets protein pass into the fluid"],
      "Counter-current flow keeps the gradient."),
    M('fresh fluid', "Why is the dialysis fluid constantly replaced?",
      "So urea does not build up in it and the gradient stays steep", ["So the fluid stays warm enough for the enzymes in the machine to work", "So the blood does not clot inside the machine", "So more glucose can enter the blood"], "Fresh fluid keeps urea concentration low."),
    M('used fluid', "How does the used fluid leaving the machine differ from the fresh fluid going in?",
      "It contains more urea", ["It contains less urea", "It contains red blood cells", "It contains protein"], "Urea has diffused into it from the blood."),
    M('Visking model', "Starch and glucose solution is placed inside Visking tubing in water. After an hour, what is found in the water outside?",
      "Glucose but no starch", ["Starch but no glucose", "Both starch and glucose", "Neither starch nor glucose"], "Glucose molecules are small enough to pass; starch molecules are not."),
    M('Visking model', "In the same Visking tubing model, what does the tubing represent?",
      "The wall of the small intestine", ["The wall of the stomach", "A red blood cell", "The bladder lining and the urethra"], "Small digested molecules pass through; large ones do not."),
    M('inside tubing', "In the Visking tubing model, what does the liquid inside the tubing test positive for after an hour?",
      "Both starch and glucose", ["Starch only", "Glucose only", "Neither"], "Starch stays inside; some glucose remains inside too."),
    M('respiration', "Why must glucose be kept in the patient's blood during dialysis?",
      "Cells need glucose for respiration", ["Glucose is a waste that must be removed", "Glucose makes the blood clot", "Glucose turns into urea"], "Glucose is a useful substance."),
    M('common errors', "A student writes: 'Urea moves out of the blood by osmosis.' What is correct?",
      "Urea moves by diffusion", ["Urea moves by active pumping", "Urea moves by filtration in the machine", "Urea does not move at all"], "Osmosis is only the movement of water.")
  ], { date: '2026-10-13', dropped: [] });
})();
