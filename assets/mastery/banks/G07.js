/* Group G07 mastery bank: Blood, heart and circulation (A-Grade Block 7).
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
  // Schematic heart seen from the front (the heart's right side is on the viewer's left).
  // J vena cava, K right atrium, L right ventricle, M pulmonary artery, N aorta, P pulmonary vein, Q left atrium, S left ventricle.
  var RED = '#e4464f', BL = '#3d6fb4';
  var HEART = '<svg class="mc-svg mc-svg-small" viewBox="0 0 420 400" role="img" aria-label="Schematic diagram of the heart seen from the front, with chambers and vessels labelled J to S">' +
    '<rect x="172" y="40" width="22" height="172" fill="' + BL + '"/><rect x="40" y="40" width="154" height="20" fill="' + BL + '"/>' +   // pulmonary artery from the right ventricle
    '<rect x="80" y="75" width="22" height="50" fill="' + BL + '"/>' +                                                                    // vena cava into the right atrium
    '<rect x="206" y="20" width="22" height="192" fill="' + RED + '"/><rect x="206" y="20" width="154" height="20" fill="' + RED + '"/>' + // aorta from the left ventricle
    '<rect x="335" y="145" width="65" height="18" fill="' + RED + '"/>' +                                                                 // pulmonary vein into the left atrium
    '<rect x="60" y="120" width="105" height="80" rx="18" fill="#cfdcf0" stroke="' + INK + '" stroke-width="2"/>' +
    '<rect x="235" y="120" width="105" height="80" rx="18" fill="#f6d2d3" stroke="' + INK + '" stroke-width="2"/>' +
    '<path d="M60 210 L195 210 L195 360 Q130 345 70 290 Z" fill="#cfdcf0" stroke="' + INK + '" stroke-width="2"/>' +
    '<path d="M205 210 L340 210 L330 290 Q270 360 205 370 Z" fill="#f6d2d3" stroke="' + INK + '" stroke-width="4"/>' +
    lab(60, 50, 28, 50, 'M', 'end') + lab(91, 95, 28, 95, 'J', 'end') + lab(110, 160, 28, 160, 'K', 'end') + lab(130, 280, 28, 280, 'L', 'end') +
    lab(340, 30, 392, 62, 'N') + lab(385, 154, 392, 192, 'P') + lab(290, 170, 392, 232, 'Q') + lab(270, 300, 392, 300, 'S') +
    '<text x="128" y="394" font-size="13" text-anchor="middle" fill="' + INK + '">viewer\'s left</text><text x="272" y="394" font-size="13" text-anchor="middle" fill="' + INK + '">viewer\'s right</text></svg>';
  // Cross-sections: X artery, Y vein, Z capillary (not to scale).
  var VESSELS = '<svg class="mc-svg" viewBox="0 0 520 210" role="img" aria-label="Cross-sections of three blood vessels labelled X, Y and Z, not to scale">' +
    '<circle cx="90" cy="95" r="70" fill="#e9b8b8" stroke="' + INK + '" stroke-width="2"/><circle cx="90" cy="95" r="58" fill="#f3d6c6" stroke="' + INK + '"/><circle cx="90" cy="95" r="24" fill="#fff" stroke="' + INK + '" stroke-width="2"/>' +
    '<path d="M215 60 Q260 35 320 55 Q355 95 320 140 Q265 160 220 135 Q190 98 215 60 Z" fill="#e9b8b8" stroke="' + INK + '" stroke-width="2"/><path d="M224 68 Q262 47 313 64 Q342 97 313 132 Q264 149 228 128 Q203 98 224 68 Z" fill="#fff" stroke="' + INK + '" stroke-width="1.5"/>' +
    '<circle cx="440" cy="95" r="16" fill="#fff" stroke="' + INK + '" stroke-width="3"/><circle cx="440" cy="95" r="3" fill="' + INK + '"/>' +
    '<text x="90" y="195" font-size="17" font-weight="700" text-anchor="middle" fill="' + INK + '">X</text><text x="270" y="195" font-size="17" font-weight="700" text-anchor="middle" fill="' + INK + '">Y</text><text x="440" y="195" font-size="17" font-weight="700" text-anchor="middle" fill="' + INK + '">Z</text></svg>';
  // Pressure around the systemic circulation: regions labelled 1 to 4.
  var PRESS = (function () {
    var L = 60, T = 20, W = 440, H = 220, px = function (x) { return L + x / 100 * W; }, py = function (y) { return T + H - y / 140 * H; }, pts = [], x;
    for (x = 0; x <= 20; x += 0.25) pts.push([x, 60 - 58 * Math.cos(x / 5 * 2 * Math.PI)]);
    for (x = 20; x <= 45; x += 0.25) { var amp = 20 * (1 - (x - 20) / 30), mid = 100 - (x - 20) * 0.6; pts.push([x, mid - amp * Math.cos((x - 20) / 5 * 2 * Math.PI)]); }
    for (x = 45; x <= 70; x += 1) pts.push([x, 85 - (x - 45) * 2.4]);
    for (x = 70; x <= 100; x += 1) pts.push([x, 25 - (x - 70) * 0.7]);
    var g = '', i;
    for (i = 0; i <= 140; i += 20) g += '<line x1="' + L + '" y1="' + py(i) + '" x2="' + (L + W) + '" y2="' + py(i) + '" stroke="#e3e8ef"/><text x="' + (L - 6) + '" y="' + (py(i) + 4) + '" font-size="12" text-anchor="end" fill="' + INK + '">' + i + '</text>';
    [20, 45, 70].forEach(function (b) { g += '<line x1="' + px(b) + '" y1="' + T + '" x2="' + px(b) + '" y2="' + (T + H) + '" stroke="' + GREY + '" stroke-dasharray="4 3"/>'; });
    [[10, '1'], [32, '2'], [57, '3'], [85, '4']].forEach(function (r) { g += '<text x="' + px(r[0]) + '" y="' + (T + H + 20) + '" font-size="16" font-weight="700" text-anchor="middle" fill="' + INK + '">' + r[1] + '</text>'; });
    return '<svg class="mc-svg" viewBox="0 0 520 290" role="img" aria-label="Graph of blood pressure through four regions of the circulation, labelled 1 to 4">' + g +
      '<line x1="' + L + '" y1="' + (T + H) + '" x2="' + (L + W) + '" y2="' + (T + H) + '" stroke="' + INK + '"/><line x1="' + L + '" y1="' + T + '" x2="' + L + '" y2="' + (T + H) + '" stroke="' + INK + '"/>' +
      '<polyline fill="none" stroke="' + BLUE + '" stroke-width="2.5" points="' + pts.map(function (p) { return px(p[0]) + ',' + py(p[1]); }).join(' ') + '"/>' +
      '<text x="' + (L + W / 2) + '" y="' + (T + H + 44) + '" font-size="13" text-anchor="middle" fill="' + INK + '">Region of the circulation (blood flows from 1 to 4)</text>' +
      '<text transform="translate(16,' + (T + H / 2) + ') rotate(-90)" font-size="13" text-anchor="middle" fill="' + INK + '">Pressure in mmHg</text></svg>';
  })();

  /* ====================================================================== HBI-BLOOD-COMPONENTS-IDENTIFY-AND-FUNCTION */
  T('HBI-BLOOD-COMPONENTS-IDENTIFY-AND-FUNCTION', 'Identify blood components and match them to their features and jobs', [
    M('features', "Which blood component is a small biconcave disc with no nucleus?",
      "Red blood cell", ["Phagocyte", "Lymphocyte", "Platelet"], "Red blood cells are biconcave discs with no nucleus, full of haemoglobin."),
    M('features', "Which blood component has a lobed nucleus and engulfs pathogens?",
      "Phagocyte", ["Lymphocyte", "Red blood cell", "Platelet"], "Phagocytes have a lobed nucleus and engulf pathogens."),
    M('features', "Which blood component has a large round nucleus and makes antibodies?",
      "Lymphocyte", ["Phagocyte", "Red blood cell", "Platelet"], "Lymphocytes have a large round nucleus and produce antibodies."),
    M('features', "Which statement about platelets is correct?",
      "They are cell fragments that help blood to clot", ["They are whole cells with a nucleus that make antibodies", "They are red cells that carry oxygen to the tissues", "They are the liquid part of the blood that carries urea"],
      "Platelets are tiny fragments of cells, not whole cells, and they help clotting."),
    M('plasma', "What is plasma?",
      "The pale yellow liquid part of blood", ["The red pigment inside red blood cells", "A type of white blood cell", "The solid clot that forms at a wound"],
      "Plasma is about 90% water and carries dissolved substances."),
    M('plasma', "Which of these is carried dissolved in the plasma?",
      "Urea", ["Haemoglobin", "Platelets", "Phagocytes"], "Plasma carries dissolved urea, glucose, carbon dioxide and hormones. Haemoglobin is inside red cells."),
    M('which has haemoglobin', "Which blood component contains haemoglobin?",
      "Red blood cells", ["White blood cells", "Platelets", "Plasma"], "Only red blood cells contain haemoglobin."),
    S('nucleus', "Which of these have a nucleus?", ["Phagocytes", "Lymphocytes"], ["Red blood cells", "Platelets", "Plasma"],
      "Only the white blood cells have a nucleus. Red cells and platelets have none, and plasma is a liquid."),
    M('microscope', "A student draws blood seen under a light microscope. Which feature of the drawing is wrong?",
      "The white cells are drawn smaller than the red cells", ["The red cells are drawn as flat circles", "The platelets are drawn as tiny fragments", "The white cells are drawn with a nucleus"],
      "White blood cells are larger than red blood cells."),
    M('colour', "Why does whole blood look red but plasma look pale yellow?",
      "Whole blood contains red cells, but plasma has no cells", ["Plasma contains more haemoglobin than whole blood", "Whole blood is warmer than plasma", "Plasma contains more oxygen than whole blood"],
      "The red colour comes from haemoglobin in red cells. Plasma has no cells."),
    M('freezing', "Why can whole blood not simply be frozen for storage?",
      "Ice damages the cells, so they burst or lose their shape", ["Freezing turns the plasma into red blood cells", "Freezing makes the blood clot into fibrin", "Frozen blood contains no water at all"],
      "Ice crystals damage the cells, so they can no longer do their jobs."),
    M('common errors', "A student writes: 'White blood cells make antibodies and engulf pathogens.' How should this be made more precise?",
      "Lymphocytes make antibodies; phagocytes engulf pathogens", ["Phagocytes make antibodies; lymphocytes engulf pathogens", "Red blood cells make antibodies; platelets engulf pathogens", "Platelets make antibodies; plasma engulfs pathogens"],
      "Each job belongs to a different type of white blood cell.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-DESCRIBE-PHAGOCYTOSIS-AND-BODY-DEFENCES */
  T('HBI-DESCRIBE-PHAGOCYTOSIS-AND-BODY-DEFENCES', 'Describe phagocytosis, antibody production and barriers to pathogens', [
    M('phagocytosis', "What is phagocytosis?",
      "A white blood cell engulfing a pathogen", ["A lymphocyte making antibodies against a pathogen", "A platelet forming a clot", "A red cell picking up oxygen"], "Phagocytosis is the process where a phagocyte engulfs a pathogen."),
    M('phagocytosis', "Which is the correct order of events in phagocytosis?",
      "Flows round the pathogen, encloses it in a vacuole, enzymes digest it", ["Enzymes digest the pathogen, then the cell flows round it and encloses it", "Makes antibodies, which digest the pathogen inside a vacuole", "Encloses the pathogen in a vacuole, then releases it into the blood"],
      "The phagocyte engulfs the pathogen into a vacuole; lysosomes add enzymes that digest it."),
    M('lysosomes', "What do lysosomes do during phagocytosis?",
      "Release digestive enzymes into the vacuole", ["Make antibodies that stick to the pathogen's surface", "Release oxygen to kill the pathogen", "Carry the pathogen to the lymph nodes"],
      "Lysosomes contain digestive enzymes, which break down the engulfed pathogen."),
    M('lymphocytes', "How do lymphocytes defend the body?",
      "They make antibodies, and some release antitoxins", ["They engulf pathogens and digest them inside vacuoles", "They form a fibrin mesh at wounds", "They carry oxygen to fight infection"],
      "Lymphocytes produce antibodies; antitoxins neutralise toxins."),
    M('antibodies', "Which statement about antibodies is correct?",
      "They bind to antigens; they do not digest pathogens", ["They digest pathogens with enzymes inside a vacuole", "They are made by phagocytes during engulfing", "They are a type of white blood cell"],
      "Antibodies bind to antigens. Enzymes in phagocytes do the digesting."),
    M('barriers', "How does the skin protect the body from pathogens?",
      "It is a physical barrier that stops pathogens getting in", ["It makes antibodies that kill pathogens before they enter", "It engulfs pathogens by phagocytosis", "It makes stomach acid that kills pathogens"],
      "Unbroken skin keeps pathogens out."),
    M('barriers', "How do mucus and cilia in the airways protect the body?",
      "Mucus traps pathogens and cilia move it away from the lungs", ["Mucus digests pathogens and cilia make antibodies", "Cilia engulf pathogens and mucus carries them to the blood", "Mucus and cilia make the air warmer so pathogens die"],
      "Mucus traps dust and pathogens; cilia sweep the mucus up to the throat."),
    M('chemical barriers', "How does stomach acid help to defend the body?",
      "It kills many pathogens swallowed with food", ["It makes antibodies against swallowed pathogens", "It forms a clot to seal the stomach wall", "It engulfs pathogens like a phagocyte"],
      "Hydrochloric acid in the stomach kills many pathogens."),
    M('chemical barriers', "Tears contain an enzyme that damages bacteria. What kind of defence is this?",
      "A chemical barrier", ["A physical barrier", "Phagocytosis", "Antibody production"], "Enzymes in tears are a chemical defence."),
    M('lines of defence', "Phagocytes are called non-specific. What does this mean?",
      "They attack any pathogen, not one particular type", ["They only attack one particular type of pathogen", "They only work in the skin and never in the blood", "They make a different antibody for each pathogen"],
      "Phagocytes are the second line of defence and attack any pathogen."),
    M('vulnerable people', "Why are elderly people in crowded care homes at greater risk of infection?",
      "Their immune system is often weaker, and pathogens spread easily indoors", ["Elderly people have more red blood cells, which attract pathogens", "Crowded rooms have more oxygen, which helps pathogens grow", "Elderly people make too many antibodies, which harms them"],
      "Weaker immunity plus close contact and poor air flow increase the spread of disease."),
    M('common errors', "A student writes: 'Phagocytes eat bacteria.' What should be added to describe what happens?",
      "Enzymes from lysosomes digest the bacteria inside a vacuole", ["Antibodies digest the bacteria inside the phagocyte", "The bacteria are dissolved by the plasma", "The bacteria are pushed out through the skin"],
      "Describe engulfing into a vacuole and digestion by enzymes.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-NAME-HEART-CHAMBERS-AND-VESSELS */
  T('HBI-NAME-HEART-CHAMBERS-AND-VESSELS', 'Name heart chambers and major vessels from a diagram', [
    M('label the heart', "The diagram shows the heart from the front. Which letter labels the left ventricle?", "S", ["K", "L", "Q"],
      "The heart's left side is on the viewer's right. S is the lower chamber on that side, with the thickest wall.", { svg: HEART, family: 'g07-heart' }),
    M('label the heart', "Using the same diagram, which letter labels the right atrium?", "K", ["L", "Q", "S"],
      "K is the upper chamber on the viewer's left, which is the heart's right side.", { svg: HEART, family: 'g07-heart' }),
    M('label the heart', "Using the same diagram, which letter labels the aorta?", "N", ["J", "M", "P"],
      "N leaves the left ventricle and carries oxygenated blood to the body: the aorta.", { svg: HEART, family: 'g07-heart' }),
    M('label the heart', "Using the same diagram, which letter labels the pulmonary vein?", "P", ["J", "M", "N"],
      "P brings oxygenated blood from the lungs into the left atrium (Q).", { svg: HEART, family: 'g07-heart' }),
    M('label the heart', "Using the same diagram, which vessel is labelled J?", "Vena cava", ["Pulmonary artery", "Pulmonary vein", "Aorta"],
      "J brings deoxygenated blood from the body into the right atrium (K).", { svg: HEART, family: 'g07-heart' }),
    M('which vessel', "Which vessel carries blood from the right ventricle to the lungs?",
      "Pulmonary artery", ["Pulmonary vein", "Aorta", "Vena cava"], "Arteries leave the ventricles. The pulmonary artery goes from the right ventricle to the lungs."),
    M('which vessel', "Which vessel brings blood into the left atrium?",
      "Pulmonary vein", ["Pulmonary artery", "Vena cava", "Aorta"], "The pulmonary vein carries oxygenated blood from the lungs to the left atrium."),
    M('oxygenation', "Which artery carries deoxygenated blood?",
      "The pulmonary artery", ["The aorta", "The renal artery", "The coronary artery"], "The pulmonary artery is the only artery carrying deoxygenated blood."),
    M('oxygenation', "Which statement about blood in the aorta is correct?",
      "It is oxygenated and at high pressure", ["It is deoxygenated and at high pressure", "It is oxygenated and at low pressure", "It is deoxygenated and at low pressure"],
      "The aorta carries oxygenated blood from the left ventricle at high pressure."),
    M('left and right', "In a diagram of the heart seen from the front, on which side of the page is the heart's left ventricle?",
      "On the viewer's right", ["On the viewer's left", "At the top of the page", "In the middle of the septum"], "The heart is drawn as if you face the person, so its left side is on your right."),
    M('whole circulation', "On a diagram of the whole circulation, which vessel takes blood from the heart to the body?",
      "Aorta", ["Vena cava", "Pulmonary vein", "Pulmonary artery"], "The aorta leaves the left ventricle and supplies the body."),
    M('common errors', "A student writes: 'The vena cava joins the right ventricle.' What is the correct statement?",
      "The vena cava joins the right atrium", ["The vena cava joins the left atrium", "The vena cava joins the left ventricle", "The vena cava joins the aorta"],
      "Veins bring blood into the atria. The vena cava enters the right atrium.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-DESCRIBE-BLOOD-TRANSPORT-ROLES */
  T('HBI-DESCRIBE-BLOOD-TRANSPORT-ROLES', 'Describe what red cells and plasma carry, and from where to where', [
    M('red cells', "What is the function of red blood cells?",
      "To carry oxygen from the lungs to body cells", ["To carry digested food from the gut to cells", "To carry urea from the liver to the kidneys", "To carry hormones from glands to their targets"],
      "Red cells carry oxygen, bound to haemoglobin. Plasma carries the other substances."),
    M('plasma', "Where does plasma carry carbon dioxide?",
      "From body cells to the lungs", ["From the lungs to body cells", "From the kidneys to the liver", "From the gut to the liver"], "Respiring cells make carbon dioxide; plasma carries it to the lungs."),
    M('plasma', "Where does plasma carry urea?",
      "From the liver to the kidneys", ["From the kidneys to the liver", "From the lungs to the kidneys", "From the gut to the lungs"], "Urea is made in the liver and removed by the kidneys."),
    M('plasma', "Where does plasma carry glucose and amino acids after a meal?",
      "From the small intestine to body cells", ["From body cells to the small intestine", "From the lungs to the small intestine", "From the kidneys to the stomach"], "Digested food is absorbed in the small intestine and carried to cells."),
    M('plasma', "How are hormones carried around the body?",
      "Dissolved in plasma, from glands to target organs", ["Bound to haemoglobin inside red cells", "Inside platelets, from the liver to the heart", "Along nerves, from the brain to muscles"], "Hormones are chemical messengers carried in the plasma."),
    F("replaced a distractor that was partly true (red cells do respire)", M('heat', "How does the blood help to spread heat around the body?",
      "Plasma carries heat from active organs, such as muscles, to the rest of the body", ["Red cells absorb heat from the skin and carry it to the muscles", "Platelets carry heat from the skin to the muscles", "Plasma absorbs heat from the air in the lungs"],
      "Warm blood from the liver and muscles carries heat to other parts and to the skin.")),
    M('haemoglobin', "Where does haemoglobin combine with oxygen, and where does it release it?",
      "It combines in the lungs and releases oxygen in the tissues", ["It combines in the tissues and releases oxygen in the lungs", "It combines in the heart and releases oxygen in the kidneys", "It combines in the liver and releases oxygen in the gut"],
      "Haemoglobin picks up oxygen in the lungs and gives it up where cells are respiring."),
    M('vessels', "In which vessels are substances exchanged between blood and body cells?",
      "Capillaries", ["Arteries", "Veins", "The aorta"], "Capillaries bring blood close to cells, where exchange happens."),
    M('drug delay', "A painkiller is swallowed. Why does it take some time to work?",
      "It must be absorbed into the blood and carried to the nerves it acts on", ["It must be broken down into glucose before it can work", "It must be filtered by the kidneys before it reaches the blood", "It must be stored in the liver for an hour before release"],
      "Absorption, then transport in the blood to the target (here the nervous system), takes time."),
    M('drug delay', "An injected anaesthetic acts on the brain. Why is there a short delay before it works?",
      "It must be carried in the blood to the brain", ["It must be digested in the stomach first", "It must be breathed out by the lungs first", "It must be made into antibodies first"], "Name the target: the drug is carried by the blood to the brain."),
    S('plasma carries', "Which of these does plasma carry?", ["Carbon dioxide", "Urea", "Glucose"], ["Most of the oxygen", "Haemoglobin"],
      "Plasma carries dissolved substances. Oxygen is carried mostly by haemoglobin in red cells."),
    M('common errors', "A student writes: 'Red blood cells carry blood around the body.' What is the correct statement?",
      "Red blood cells carry oxygen", ["Red blood cells carry plasma", "Red blood cells carry urea", "Red blood cells carry hormones"], "Red cells are part of blood; they carry oxygen.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-TRACE-DOUBLE-CIRCULATION-ROUTE */
  T('HBI-TRACE-DOUBLE-CIRCULATION-ROUTE', 'Trace the route of blood through the heart, lungs and body', [
    M('route', "Which is the correct route of blood from the body back to the body?",
      "Vena cava, right atrium, right ventricle, pulmonary artery, lungs, pulmonary vein, left atrium, left ventricle, aorta",
      ["Vena cava, right atrium, right ventricle, pulmonary vein, lungs, pulmonary artery, left atrium, left ventricle, aorta", "Aorta, left ventricle, left atrium, pulmonary vein, lungs, pulmonary artery, right ventricle, right atrium, vena cava", "Vena cava, left atrium, left ventricle, pulmonary artery, lungs, pulmonary vein, right atrium, right ventricle, aorta"],
      "Body → right side → lungs → left side → body."),
    M('route', "After leaving the right ventricle, where does blood go next?",
      "Along the pulmonary artery to the lungs", ["Along the aorta to the rest of the body", "Into the left atrium through the septum", "Along the vena cava to the body"], "The right ventricle pumps blood to the lungs."),
    M('route', "Blood has just entered the left atrium. Where has it come from?",
      "The lungs, along the pulmonary vein", ["The body, along the vena cava", "The right ventricle, through the septum", "The aorta, through a valve"], "Oxygenated blood returns from the lungs to the left atrium."),
    M('double pump', "What is meant by 'the heart is a double pump'?",
      "One side pumps blood to the lungs and the other side to the body", ["It has two separate pumps, one inside the other, that beat in turn", "It pumps twice as fast as other muscles", "It pumps every drop of blood twice per second"],
      "The right side sends deoxygenated blood to the lungs; the left side sends oxygenated blood to the body."),
    M('double circulation', "How many times does blood pass through the heart in one complete circuit of the body?",
      "Twice", ["Once", "Three times", "Four times"], "Once through the right side (to the lungs) and once through the left side (to the body)."),
    M('organ vessels', "Which vessel carries blood from the gut to the liver?",
      "Hepatic portal vein", ["Hepatic vein", "Renal artery", "Pulmonary vein"], "The hepatic portal vein runs from the gut to the liver."),
    M('organ vessels', "Which vessel carries blood into a kidney?",
      "Renal artery", ["Renal vein", "Hepatic vein", "Vena cava"], "The renal artery enters the kidney; the renal vein leaves it."),
    M('liver to kidney', "Blood leaves the liver. Which route takes it to a kidney?",
      "Hepatic vein, vena cava, heart, lungs, heart, aorta, renal artery", ["Hepatic vein straight into the renal artery", "Hepatic portal vein, gut, renal vein", "Hepatic vein, aorta, renal vein"],
      "Blood must return to the heart, go through the lungs and back, then leave in the aorta."),
    M('arteries and veins', "Which statement is correct?",
      "Arteries carry blood away from the heart; veins carry it towards the heart", ["Arteries carry oxygenated blood; veins carry deoxygenated blood, with no exceptions", "Arteries carry blood towards the heart; veins carry it away from the heart", "Arteries and veins both carry blood away from the heart"],
      "The direction defines the vessel. The pulmonary vessels are exceptions to the oxygen rule."),
    M('pump', "Which organ pumps blood around the body?",
      "The heart", ["The liver", "The lungs", "The kidneys"], "Only the heart has muscular chambers that pump blood."),
    M('left ventricle', "Why does the left ventricle have a thicker muscular wall than the right ventricle?",
      "It pumps blood all round the body, which needs a higher pressure", ["It pumps blood only to the lungs, which are close by", "It holds more blood than all the other chambers together", "It receives blood straight from the body at high pressure"],
      "Pumping to the whole body needs more force than pumping to the nearby lungs."),
    M('common errors', "A student writes the route: right ventricle → pulmonary vein → lungs. What is wrong?",
      "Blood leaves the right ventricle in the pulmonary artery", ["Blood leaves the right ventricle in the aorta", "Blood leaves the right ventricle in the vena cava", "Nothing; the pulmonary vein goes to the lungs"],
      "Arteries take blood away from the heart: right ventricle → pulmonary artery → lungs.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-BLOOD-CLOTTING-PROCESS-AND-IMPORTANCE */
  T('HBI-BLOOD-CLOTTING-PROCESS-AND-IMPORTANCE', 'Describe how blood clots and explain why clotting matters', [
    F("stem made less absolute (vessel narrowing comes first in reality)", M('sequence', "Which of these happens first in clotting when a blood vessel is cut?",
      "Platelets collect at the wound", ["Fibrin threads form a scab", "Red cells release thrombin at the cut", "White cells form a plug"], "Platelets gather at the damaged vessel first.")),
    M('enzyme', "Which change does the enzyme thrombin cause?",
      "Soluble fibrinogen into insoluble fibrin", ["Insoluble fibrin into soluble fibrinogen", "Prothrombin into fibrinogen", "Red blood cells into platelets"], "Thrombin converts fibrinogen (soluble) into fibrin (insoluble)."),
    M('sequence', "Which substance is changed into thrombin?",
      "Prothrombin", ["Fibrin", "Fibrinogen", "Haemoglobin"], "An enzyme released by damaged platelets and tissue, with calcium ions, turns prothrombin into thrombin."),
    M('fibrin', "What does fibrin do at a wound?",
      "Forms a mesh of threads that traps red cells and platelets", ["Digests any bacteria that try to enter the wound through the cut", "Makes antibodies against the pathogens", "Dissolves the platelets to seal the cut"],
      "The fibrin mesh traps cells to form a clot, which dries to a scab."),
    M('release', "What do damaged platelets and tissue release to start the clotting reactions?",
      "An enzyme", ["Antibodies", "Haemoglobin", "Glucose"], "They release an enzyme (thrombokinase). Calcium ions are also needed."),
    S('importance', "Why is blood clotting important?", ["It stops too much blood being lost", "It stops pathogens entering the wound", "It lets the wound heal"], ["It makes new red blood cells", "It raises blood pressure everywhere"],
      "A clot stops blood loss, keeps out pathogens and protects the wound while it heals."),
    M('no thrombin', "A person cannot make thrombin. What happens when they are cut?",
      "Fibrinogen is not converted to fibrin, so no clot forms", ["Fibrin is not converted to fibrinogen, so the clot is too large", "Platelets cannot reach the wound, so too many clots form", "Red cells change into fibrin, so the blood clots at once"],
      "Without thrombin, there is no fibrin mesh and so no clot."),
    M('dialysis', "Why is an anticoagulant added to blood as it enters a dialysis machine?",
      "So that clots do not form and block the machine", ["So that more urea passes into the dialysis fluid", "So that the red cells carry more oxygen", "So that the blood clots quickly inside the machine"],
      "Anticoagulants stop clotting in the tubing."),
    M('dialysis', "Why is the anticoagulant not added just before the blood goes back into the body?",
      "The blood must be able to clot normally inside the body", ["The anticoagulant would turn into urea in the body", "The machine would stop working if it were added later", "The blood would become too thick to flow back"],
      "Patients still need to clot if they are cut."),
    M('scab', "What happens to a clot at a wound on the skin?",
      "It dries to form a scab that protects the healing skin", ["It is digested at once by phagocytes", "It turns back into plasma within minutes", "It spreads through the blood to other cuts"], "The clot becomes a scab that covers the wound while it heals."),
    M('common errors', "A student writes: 'Fibrin turns into fibrinogen to make the clot.' What is wrong?",
      "It is the wrong way round; fibrinogen turns into fibrin", ["Fibrin turns into thrombin, not fibrinogen", "Fibrinogen is made by white blood cells", "Nothing is wrong with this statement"], "Soluble fibrinogen → insoluble fibrin."),
    F("stem did not fit the option 'Fibrin threads'", M('common errors', "Which of these does NOT help to form a clot?",
      "White blood cells", ["Platelets", "Red blood cells trapped in the mesh", "Fibrin threads"], "White cells do not form the clot. Platelets start it; fibrin traps red cells and platelets."))
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-EXPLAIN-CORONARY-BLOCKAGE-EFFECTS */
  T('HBI-EXPLAIN-CORONARY-BLOCKAGE-EFFECTS', 'Explain how a blocked coronary artery damages the heart', [
    M('coronary arteries', "What do the coronary arteries supply?",
      "The heart muscle itself", ["The lungs", "The chambers of the heart", "The brain"], "Coronary arteries branch from the aorta and supply blood to the heart muscle."),
    M('cause', "How does a fatty deposit cause a heart attack?",
      "It narrows the coronary artery, and a clot can form on it and block it", ["It blocks the heart chambers themselves, so blood cannot enter or leave them", "It makes the heart muscle produce too much energy", "It stops the lungs from taking in oxygen"],
      "A plaque narrows the lumen; a clot on it can block blood flow to the heart muscle."),
    M('chain', "Which chain explains why heart muscle beyond a blocked coronary artery is damaged?",
      "Less blood, so less oxygen, less aerobic respiration and less energy released", ["More blood, so more oxygen, more respiration and the muscle overheats", "Less blood, so more carbon dioxide is used by the muscle cells for respiration", "Less blood, so the muscle makes its own glucose and oxygen"],
      "Follow every link: blood → oxygen → aerobic respiration → energy for contraction."),
    M('what is lost', "Which substances does heart muscle receive less of when its artery is blocked?",
      "Oxygen and glucose", ["Carbon dioxide and urea", "Antibodies and platelets", "Plasma proteins only"], "Less blood brings less oxygen and glucose, and removes less carbon dioxide."),
    M('anaerobic', "With too little oxygen, heart muscle cells may respire anaerobically. Why is this a problem?",
      "It releases much less energy, so the heart pumps less blood", ["It releases more energy, so the heart beats too fast and tires quickly", "It uses up all the fibrin in the blood", "It makes carbon dioxide, which blocks the artery"],
      "Anaerobic respiration releases far less energy per glucose."),
    M('where damage is', "On a diagram, an artery is blocked halfway along. Which heart muscle is damaged?",
      "The muscle beyond the blockage, supplied by that artery", ["The muscle before the blockage, nearer to where the artery leaves the aorta", "All the muscle of the heart equally", "Only the muscle of the atria"], "Tissue downstream of the blockage gets less blood."),
    M('cholesterol', "How can a diet high in saturated fat lead to coronary heart disease?",
      "It raises blood cholesterol, which builds fatty plaques in artery walls", ["It lowers blood cholesterol, so the artery walls become weak and split open", "It makes the blood too thin, so it leaks out", "It is digested into glucose, which blocks the arteries"],
      "Raised cholesterol leads to plaques (atheroma) that narrow the coronary arteries."),
    M('legs', "In some people with diabetes, leg arteries become narrow. Why might part of the leg need to be removed?",
      "Less blood reaches the tissue, so it dies and infection is more likely", ["Too much blood reaches the leg, so the tissue bursts", "The leg makes too much insulin, which damages it", "The narrow arteries carry too many white cells to the leg"],
      "Less blood means less oxygen (tissue dies) and fewer white cells arriving to fight infection."),
    M('chamber or muscle', "Why is a blocked coronary artery serious even though the heart chambers are full of blood?",
      "Blood in the chambers does not supply the muscle; the coronary arteries do", ["The blood in the chambers has no oxygen in it at all", "The blood in the chambers is too warm for the muscle", "The chambers send blood to the muscle through the septum"],
      "Heart muscle cells get oxygen only from blood in the coronary arteries."),
    M('heart attack', "What is a heart attack?",
      "Part of the heart muscle dies because its blood supply is cut off", ["The heart chambers slowly fill up with fatty deposits until they are blocked", "The heart beats faster during exercise", "A valve in a vein stops working"], "Muscle starved of oxygen dies."),
    M('common errors', "A student writes: 'The heart gets no energy.' What is the better explanation?",
      "Less oxygen reaches the muscle, so less respiration releases less energy", ["The heart muscle cannot make any glucose of its own, so it has no energy left", "The blood carries no energy at all", "The heart uses up all its ATP stores"],
      "Link the blockage to oxygen, respiration and energy release."),
    M('common errors', "A student writes: 'Respiration makes energy for the heart muscle.' What should the student write?",
      "Respiration releases energy", ["Respiration stores energy", "Respiration uses energy", "Respiration destroys energy"], "Energy is released, not made.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-HEART-DISEASE-PREVENTION-AND-TREATMENT */
  T('HBI-HEART-DISEASE-PREVENTION-AND-TREATMENT', 'Describe how heart disease is prevented and treated', [
    S('risk factors', "Which of these increase the risk of heart disease?", ["Smoking", "Lack of exercise", "A diet high in saturated fat"], ["Eating more fruit and vegetables", "Keeping a healthy body mass"],
      "Smoking, inactivity and saturated fat raise the risk; a good diet and healthy mass lower it."),
    M('prevention', "Which change to the diet would most help to prevent heart disease?",
      "Eating less saturated fat and salt", ["Eating more saturated fat and sugar", "Eating more salt and less fibre", "Eating only protein and no vegetables"], "Less saturated fat lowers cholesterol; less salt helps lower blood pressure."),
    M('statins', "What do statins do?",
      "Lower the level of cholesterol in the blood", ["Lower the blood pressure by widening veins", "Dissolve clots that have already formed", "Make the heart beat more strongly"], "Statins are drugs that reduce blood cholesterol."),
    M('stanols', "How do plant stanol esters in some foods help?",
      "They reduce the cholesterol absorbed from the gut", ["They dissolve fat already in the arteries", "They raise the level of cholesterol in the blood", "They replace the need for any exercise"], "Stanol esters lower cholesterol uptake from food."),
    M('stent', "How does a stent help a person with a narrowed coronary artery?",
      "It holds the artery open so more blood reaches the heart muscle", ["It removes the fatty deposit from the artery wall so blood flows freely", "It replaces the whole heart with an artificial one", "It lowers cholesterol so the fat dissolves"],
      "A balloon expands the mesh tube, which then props the artery open."),
    M('stent', "Which is the correct order for fitting a stent?",
      "Catheter carries stent to artery, balloon inflates, stent holds artery open", ["Balloon inflates, then the catheter removes the fat, then the stent is taken out", "Stent is swallowed, travels to the heart, then dissolves the blockage", "Artery is cut out, then the stent is sewn in its place"],
      "A catheter takes the stent in; the balloon opens it; the stent stays."),
    M('bypass', "What does bypass surgery do?",
      "Uses another vessel to carry blood around the blockage", ["Removes the blocked artery and leaves the heart muscle to heal by itself", "Fills the blocked artery with a clot", "Adds a valve to stop blood flowing backwards"], "The new vessel carries blood past the blockage to the muscle beyond."),
    M('transplants', "Which is a problem with heart transplants?",
      "There are few donors, and the heart may be rejected", ["The new heart always beats too slowly to supply the whole body", "Donor hearts never fit in the chest", "The patient must stop all exercise for ever"],
      "Few donors are available, and tissue must match or the immune system rejects the heart."),
    M('placebo', "In a trial, people taking statins and people taking a placebo report almost the same amount of muscle pain. What does this suggest?",
      "The statin probably does not cause the muscle pain", ["The statin definitely causes the muscle pain in older people", "The placebo causes the muscle pain", "The trial proves statins cure muscle pain"],
      "If the placebo group has similar symptoms, the drug is probably not the cause; age or lifestyle may be."),
    M('exercise', "How does regular exercise help to prevent heart disease?",
      "It helps keep a healthy body mass and lowers blood pressure", ["It raises blood cholesterol but makes the heart beat more slowly", "It makes the heart muscle weaker", "It increases the amount of fat stored"], "Exercise helps control mass, blood pressure and cholesterol."),
    M('common errors', "A student writes: 'A stent removes the fat from the artery.' What is the correct statement?",
      "A stent holds the artery open; the fat stays there", ["A stent dissolves the fat with enzymes", "A stent replaces the artery completely", "A stent lowers cholesterol in the blood"], "The stent props the artery open around the plaque."),
    M('common errors', "A student says statins are used to lower blood pressure. What are statins used for?",
      "Lowering blood cholesterol", ["Raising blood cholesterol", "Thinning the blood to stop clots", "Increasing the heart rate"], "Statins lower cholesterol.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-RELATE-VESSEL-STRUCTURE-TO-FUNCTION */
  T('HBI-RELATE-VESSEL-STRUCTURE-TO-FUNCTION', 'Identify arteries, veins and capillaries and relate their structure to function', [
    M('identify', "The diagram shows cross-sections of three blood vessels (not to scale). Which is an artery?", "X", ["Y", "Z"],
      "X has a thick wall with lots of muscle and elastic tissue and a small, round lumen.", { svg: VESSELS, family: 'g07-vessels' }),
    M('identify', "Using the same diagram, which vessel is a vein, and why?", "Y, because it has a thin wall and a large, irregular lumen", ["X, because it has a thick wall and a small round lumen", "Z, because its wall is only one cell thick", "X, because it has the largest overall diameter"],
      "Veins have thin walls and a wide, often flattened lumen.", { svg: VESSELS, family: 'g07-vessels' }),
    M('artery walls', "Why do arteries have thick walls with lots of muscle and elastic tissue?",
      "To withstand the high pressure of blood from the heart", ["To slow the blood down so that substances can be exchanged", "To let substances diffuse out to the cells", "To stop blood flowing backwards"], "The thick, elastic wall copes with high pressure and stretches with each beat."),
    M('pulse', "What causes the pulse that can be felt in an artery?",
      "The artery wall stretching and recoiling with each heartbeat", ["Valves inside the artery opening and closing with each heartbeat", "Red blood cells hitting the artery wall", "The vein next to the artery contracting"], "Each surge of blood stretches the elastic wall, which then recoils."),
    M('valves', "Why do veins have valves?",
      "To stop blood flowing backwards", ["To pump blood back to the heart", "To raise the pressure of the blood", "To let substances out to the cells"], "Blood in veins is at low pressure; valves stop backflow."),
    M('valves', "A picture of a blood vessel shows a valve. Which vessel must it be?",
      "A vein", ["An artery", "A capillary", "The aorta"], "Among blood vessels, only veins have valves."),
    M('capillaries', "How are capillaries adapted for exchanging substances with cells?",
      "Their walls are one cell thick, so the diffusion distance is short", ["Their walls are thick and muscular, so they can pump the blood along", "They have valves that push substances into cells", "They have a wide lumen, so blood flows very fast"],
      "Thin walls with small pores let substances pass in and out easily."),
    M('capillaries', "Why do red blood cells pass through capillaries in single file?",
      "The lumen is very narrow, so cells pass slowly and close to the wall", ["Capillaries have valves that let one cell through at a time", "Red cells repel each other inside capillaries", "Capillary walls push the cells into a line"],
      "Being close to the wall and moving slowly gives more time and a shorter distance for diffusion."),
    F("stem tightened: veins also have some muscle", M('raising pressure', "Which vessels have the most muscle in their walls, so they can narrow and raise blood pressure?",
      "Arteries and arterioles", ["Capillaries", "Veins and venules", "Lymph vessels"], "Only arteries and arterioles have enough muscle in their walls.")),
    M('aorta', "What is the job of the aorta?",
      "To carry oxygenated blood from the left ventricle to the body at high pressure", ["To carry deoxygenated blood from the body back to the right atrium at low pressure", "To carry blood from the lungs to the left atrium", "To carry blood from the right ventricle to the lungs"],
      "The aorta is the main artery leaving the left ventricle."),
    M('exchange', "What is exchanged in the capillaries?",
      "Oxygen and glucose go to cells; carbon dioxide and wastes are removed", ["Red blood cells pass out to the body cells", "Plasma proteins pass out to feed the cells", "Nothing; capillaries only carry blood quickly"],
      "Capillaries are where materials pass between blood and cells."),
    M('common errors', "A student identifies a vessel in a picture as a vein 'because it carries blood to the heart'. Why is this not a good reason?",
      "It cannot be seen in a picture; a visible feature, such as a valve, is needed", ["Veins carry blood away from the heart, so the reason given is the wrong way round", "Arteries also carry blood to the heart", "Veins never carry blood at all"],
      "Use something you can see: a valve, a thin wall or a wide lumen.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-EXPLAIN-OXYGEN-CARRIAGE-AND-ITS-CHANGES */
  T('HBI-EXPLAIN-OXYGEN-CARRIAGE-AND-ITS-CHANGES', 'Explain red-cell adaptations and the effects of more or less oxygen carriage', [
    M('no nucleus', "How does having no nucleus help a red blood cell?",
      "There is more space for haemoglobin", ["It can divide more quickly to make new cells", "It can make more antibodies", "It can respire faster"], "No nucleus leaves more room for haemoglobin, so more oxygen can be carried."),
    M('shape', "How does the biconcave shape help a red blood cell?",
      "It gives a large surface area for oxygen to diffuse in and out", ["It lets the cell store glucose in the dip in its centre for respiration", "It makes the cell heavier so it sinks to the tissues", "It stops the cell from bending in capillaries"],
      "The biconcave disc has a large surface area compared with its volume."),
    M('flexible', "Why is it useful that red blood cells are small and flexible?",
      "They can squeeze through narrow capillaries", ["They can engulf pathogens more easily", "They can pass through the walls of veins", "They can store more oxygen in their nucleus"], "Flexibility lets them pass through capillaries close to the cells."),
    M('haemoglobin', "What forms when haemoglobin combines with oxygen in the lungs?",
      "Oxyhaemoglobin", ["Carbon dioxide", "Fibrinogen", "Lactic acid"], "Haemoglobin + oxygen ⇌ oxyhaemoglobin."),
    M('anaemia', "Why does a person with anaemia often feel tired?",
      "Less oxygen reaches cells, so less aerobic respiration releases less energy", ["More oxygen reaches cells, so they respire too fast and use up all their glucose", "Their cells make extra haemoglobin, which uses energy", "Their blood carries no glucose to the cells"],
      "Follow the chain to respiration and energy."),
    M('anaemia', "Why does the breathing rate of a person with anaemia go up during light exercise?",
      "To try to take in more oxygen, because less is carried", ["To remove extra oxygen from the blood", "Because haemoglobin is made in the lungs", "Because their lungs are smaller than normal and fill up faster"],
      "With less oxygen carried, the body responds by breathing faster and raising heart rate."),
    M('altitude', "After training at high altitude, an athlete has more red blood cells. How does this help?",
      "More oxygen reaches the muscles, so more energy is released by aerobic respiration", ["Less oxygen reaches the muscles, so they make more lactic acid", "More carbon dioxide is carried away from the muscles, so they can work harder for longer", "The blood becomes thinner, so the heart beats more slowly"],
      "More red cells carry more oxygen, so more aerobic respiration in muscles."),
    M('sickle cell', "In sickle cell anaemia, why is less oxygen carried?",
      "Sickle-shaped cells have less surface area and can block capillaries", ["Sickle cells contain extra haemoglobin, which stops oxygen from binding to them", "Sickle cells are larger and carry oxygen too fast", "Sickle cells have a nucleus that uses up the oxygen"],
      "The changed haemoglobin makes the cells sickle-shaped in low oxygen."),
    M('hole in the heart', "A baby has a hole in the septum between the ventricles. Why does blood going to the body carry less oxygen?",
      "Deoxygenated blood from the right side mixes with oxygenated blood on the left", ["Oxygenated blood leaks out of the heart into the chest", "The blood carries no oxygen at all", "The lungs cannot take in any oxygen"],
      "Mixing lowers the oxygen content, though the blood still carries some oxygen."),
    M('thin membrane', "How does a thin cell membrane help a red blood cell?",
      "It keeps the diffusion distance short", ["It makes the cell stronger so it does not burst", "It stores more haemoglobin", "It stops oxygen leaving"], "A short distance means oxygen diffuses in and out quickly."),
    M('common errors', "A student writes: 'Red cells have no nucleus so they can carry more oxygen.' What link is missing?",
      "There is more room for haemoglobin, which carries the oxygen", ["There is more room for glucose, which the cell uses to carry oxygen", "The nucleus would use up all the oxygen", "There is more room for plasma inside the cell"],
      "Name haemoglobin in the chain."),
    M('common errors', "A student says the blood of a baby with a hole in the heart 'has no oxygen'. What is more accurate?",
      "It carries less oxygen, because the two bloods mix", ["It carries more oxygen, because the blood mixes", "It carries no carbon dioxide at all", "It carries the same oxygen as normal blood"], "Mixed blood still carries oxygen, just less.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-EXPLAIN-BLOOD-PRESSURE-CHANGES */
  T('HBI-EXPLAIN-BLOOD-PRESSURE-CHANGES', 'Explain systolic, diastolic and changing pressure around the circulation', [
    M('systolic', "What is systolic blood pressure?",
      "The highest pressure, when the ventricles contract", ["The lowest pressure, when the ventricles relax between beats", "The pressure when the atria contract", "The pressure in the veins at rest"], "Systolic pressure is the peak pressure as the ventricles push blood out."),
    M('diastolic', "What is diastolic blood pressure?",
      "The lowest pressure in the arteries, when the ventricles relax", ["The highest pressure in the arteries, when the ventricles contract", "The pressure inside the capillaries", "The pressure when the atria contract"], "Diastolic pressure is the lowest pressure between beats."),
    M('read the graph', "The graph shows blood pressure in four regions of the circulation. Which region is the left ventricle?", "1", ["2", "3", "4"],
      "Region 1 swings from near zero up to about 120 mmHg: the ventricle contracting and relaxing.", { svg: PRESS, family: 'g07-press' }),
    M('read the graph', "Using the same graph, which region shows the arteries?", "2", ["1", "3", "4"],
      "Region 2 is high and rises and falls with each beat (the pulse), with smaller swings further from the heart.", { svg: PRESS, family: 'g07-press' }),
    M('read the graph', "Using the same graph, which region shows the veins?", "4", ["1", "2", "3"],
      "Region 4 has the lowest, steady pressure: the veins.", { svg: PRESS, family: 'g07-press' }),
    F("correct answer reworded: the pulse is smoothed before the capillaries", M('capillaries', "Why does pressure fall steadily in the capillaries without pulsing?",
      "The arteries have already smoothed the pulse, and fluid leaves along the way", ["Capillaries have valves that stop each pulse before the blood arrives", "Capillaries are closer to the heart than the arteries are", "The blood in capillaries has no plasma left in it"],
      "Pressure falls because of distance from the heart, resistance in narrow vessels and loss of tissue fluid.")),
    M('direction', "Why does blood flow from arteries towards veins?",
      "Blood flows from higher pressure to lower pressure", ["Veins suck the blood towards them by contracting their walls", "Blood flows from lower to higher pressure", "Valves in the arteries push it along"], "Arteries have higher pressure than veins."),
    M('dialysis', "In dialysis, blood is taken from an artery and returned to a vein. Why this way round?",
      "Artery pressure is high and vein pressure is low, so blood flows through the tubing", ["Vein pressure is high and artery pressure is low", "Arteries carry less urea than veins", "Veins have no valves, so blood can enter them"],
      "Blood flows from the high-pressure artery through the machine to the low-pressure vein."),
    M('swings', "Why do the pressure swings get smaller along the arteries?",
      "The elastic walls stretch and recoil, smoothing out the flow further from the heart", ["The arteries have valves that stop each beat", "The heart beats more slowly further from the heart", "Blood gains pressure as it moves away from the heart"],
      "Elastic recoil evens out the pressure further from the heart."),
    M('values', "A blood pressure is written as 120/80 mmHg. What do the two numbers mean?",
      "120 is systolic and 80 is diastolic", ["120 is diastolic and 80 is systolic", "120 is heart rate and 80 is pressure", "120 is in arteries and 80 is in veins"], "The higher number is systolic; the lower is diastolic."),
    M('common errors', "A student says pressure rises in the arteries when the atria contract. What is correct?",
      "It rises when the ventricles contract", ["It rises when the veins contract", "It rises when the ventricles relax and fill", "It rises when the lungs inflate"], "The ventricles push blood into the arteries."),
    M('common errors', "A student says the pressure 'stops' in the capillaries. What is more accurate?",
      "The pressure falls but does not stop", ["The pressure rises in the capillaries", "The pressure is highest in the capillaries", "The pressure stays the same as in the aorta"], "Pressure falls steadily; it does not drop to nothing.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-ABO-ANTIGENS-AND-TRANSFUSION */
  var ABO = { A: { ag: ['A'], ab: ['anti-B'] }, B: { ag: ['B'], ab: ['anti-A'] }, AB: { ag: ['A', 'B'], ab: [] }, O: { ag: [], ab: ['anti-A', 'anti-B'] } };
  function canGive(d, r) { return ABO[d].ag.every(function (a) { return ABO[r].ab.indexOf('anti-' + a) < 0; }); }
  T('HBI-ABO-ANTIGENS-AND-TRANSFUSION', 'Use ABO antigens and antibodies to choose donors and explain clumping', [
    M('antigens and antibodies', "What does group A blood have?",
      "Antigen A on its red cells, with anti-B antibodies in the plasma", ["Antigen B on its red cells, with anti-A antibodies in the plasma", "Antigen A on its red cells, with anti-A antibodies in the plasma", "No antigens, with anti-A antibodies plus anti-B antibodies"], "Group A: antigen A, anti-B antibodies."),
    M('antigens and antibodies', "What does group O blood have?",
      "No antigens, but anti-A antibodies plus anti-B antibodies", ["Antigen O on its red cells, and no antibodies", "The A antigen plus the B antigen, and no antibodies", "Antigen A only, with anti-B antibodies"], "Group O red cells have no A or B antigen; the plasma has both antibodies."),
    M('antigens and antibodies', "What does group AB blood have?",
      "The A antigen plus the B antigen, and neither antibody", ["No antigens, with anti-A antibodies plus anti-B antibodies", "Antigen A only, with anti-B antibodies", "Antigen B only, with anti-A antibodies"], "AB has both antigens and neither antibody."),
    { skill: 'choose donors', gen: function () {
      var r = pick(['A', 'B', 'O']), ok = ['A', 'B', 'AB', 'O'].filter(function (d) { return canGive(d, r); }), bad = ['A', 'B', 'AB', 'O'].filter(function (d) { return !canGive(d, r); });
      return { kind: 'multi', q: "A patient has blood group " + r + ". Which donor blood groups could the patient safely receive?", options: ok.map(function (g) { return 'Group ' + g; }).concat(bad.map(function (g) { return 'Group ' + g; })),
        answers: ok.map(function (_, i) { return i; }), keepOrder: false,
        why: "Group " + r + " plasma has " + (ABO[r].ab.length ? ABO[r].ab.join(' and ') + ' antibodies' : 'no anti-A or anti-B antibodies') + ". Donor red cells must not carry a matching antigen. Safe: " + ok.map(function (g) { return 'group ' + g; }).join(', ') + "." };
    } },
    F("grammar of the feedback fixed (antigens A and B)", { skill: 'count compatible people', gen: function () {
      var n = { A: rint(20, 45), B: rint(5, 20), AB: rint(2, 8), O: rint(25, 50) }, d = pick(['A', 'B', 'AB']);
      var ok = ['A', 'B', 'AB', 'O'].filter(function (r) { return canGive(d, r); }), tot = ok.reduce(function (s, r) { return s + n[r]; }, 0);
      var tbl = '<table class="mc-table"><tr><th>Blood group</th><th>A</th><th>B</th><th>AB</th><th>O</th></tr><tr><td>Number of people</td><td>' + n.A + '</td><td>' + n.B + '</td><td>' + n.AB + '</td><td>' + n.O + '</td></tr></table>';
      return nq("The table shows the blood groups of " + (n.A + n.B + n.AB + n.O) + " people." + tbl + "How many of these people could safely receive blood from a group " + d + " donor?", tot, '',
        "Group " + d + " red cells carry " + (ABO[d].ag.length > 1 ? 'antigens ' : 'antigen ') + ABO[d].ag.join(' and ') + ". Only people without the matching antibody can receive it: " + ok.map(function (r) { return 'group ' + r + ' (' + n[r] + ')'; }).join(' + ') + " = " + tot + ".");
    } }),
    M('agglutination', "What happens if a patient receives red cells with an antigen that matches antibodies in their plasma?",
      "The antibodies bind and the red cells clump together", ["The red cells change into the patient's blood group", "The antibodies are destroyed by the donor's red cells", "Nothing, because the antibodies are in the plasma"],
      "This is agglutination. The clumps can block blood vessels."),
    M('agglutination', "Why can the wrong blood transfusion kill a patient?",
      "Clumps of red cells can block blood vessels", ["The new blood carries too much oxygen", "The new red cells divide too quickly", "The patient's heart pumps too slowly"], "Agglutinated cells block vessels, so tissues lose their blood supply."),
    M('universal', "Why can group O blood be given to people of any ABO group?",
      "Its red cells have no A or B antigens", ["Its plasma has no antibodies at all", "Its red cells carry the A antigen plus the B antigen", "It contains no red blood cells"], "With no antigens, the donor red cells cannot be clumped by the recipient's antibodies."),
    M('universal', "Why can a person with group AB receive blood of any ABO group?",
      "Their plasma has no anti-A or anti-B antibodies", ["Their red cells have no antigens on them", "Their plasma has both anti-A and anti-B antibodies", "Their blood cannot clot"], "With no antibodies to bind donor antigens, no agglutination happens."),
    M('enzymes', "Scientists use enzymes to remove the antigens from group A red cells. Which group do the cells become?",
      "Group O", ["Group B", "Group AB", "Group A"], "Without A or B antigens, the cells behave as group O."),
    M('enzymes', "Why is making group O blood from other groups useful?",
      "It can be given to anyone, so blood is always available", ["It makes the blood carry much more oxygen", "It removes the need for any blood donors", "It means blood can be stored for ever"], "Fewer donors are needed and there is less risk of a mismatch."),
    M('common errors', "A student says a wrong transfusion makes the blood 'clot'. Which word is correct?",
      "Agglutination (clumping)", ["Coagulation (clotting)", "Phagocytosis", "Denaturing"], "Antibody-antigen clumping is agglutination, not clotting.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-TISSUE-FLUID-FORMATION-AND-FUNCTION */
  T('HBI-TISSUE-FLUID-FORMATION-AND-FUNCTION', 'Explain how tissue fluid forms, what it does and why it builds up', [
    M('formation', "At the arteriole end of a capillary, why is fluid forced out?",
      "Blood pressure is higher than the pull of the plasma proteins", ["The pull of the plasma proteins is higher than blood pressure", "Fluid diffuses out because there is no pressure", "Red blood cells push the fluid out through the wall"],
      "High blood pressure forces water and small molecules out through the pores."),
    M('return', "At the venule end of a capillary, why does some fluid return?",
      "Blood pressure is now lower than the pull of the plasma proteins", ["Blood pressure is now higher than at the arteriole end", "The capillary wall closes all its pores", "Red blood cells pull water back in"],
      "Blood pressure has fallen, so the plasma proteins draw water back."),
    M('what leaves', "Which of these stay in the blood and do not enter tissue fluid?",
      "Red blood cells and large plasma proteins", ["Water, glucose and small ions dissolved in plasma", "Oxygen and amino acids", "Ions and small molecules"], "They are too large to pass through the capillary pores."),
    M('job', "What does tissue fluid do?",
      "It bathes cells, bringing oxygen and glucose and taking wastes away", ["It carries red blood cells out to every cell so they can take oxygen", "It pumps blood back to the heart", "It forms clots around damaged cells"], "Exchange between blood and cells happens through the tissue fluid."),
    M('lymph', "What happens to tissue fluid that does not return to the capillaries?",
      "It drains into lymph vessels", ["It is breathed out by the lungs", "It is absorbed by red blood cells", "It turns into plasma proteins"], "Extra tissue fluid drains into the lymphatic system."),
    M('lymphoedema', "Why does swelling (lymphoedema) happen?",
      "Tissue fluid cannot drain away into the lymph vessels", ["Too many red blood cells leave the capillaries and collect", "The plasma proteins leave the blood", "Blood pressure in the capillaries is too low"], "If lymph cannot drain, fluid builds up in the tissues."),
    M('lymph flow', "How is lymph moved along lymph vessels?",
      "Nearby muscles contract and squeeze the vessels", ["The heart pumps lymph directly along the lymph vessels", "Red cells push the lymph along", "Lymph flows from low to high pressure"], "Muscle movement squeezes lymph vessels; valves keep lymph moving one way."),
    M('pressure falls', "Why does blood pressure fall along a capillary?",
      "Fluid leaves, the blood is further from the heart, and narrow vessels resist flow", ["The capillary walls contract strongly", "Red cells leave the capillary", "Valves in the capillary slow the blood"], "Several reasons together reduce the pressure."),
    M('protein pull', "Why does the pull from plasma proteins stay the same along a capillary?",
      "The proteins are too large to leave, so they stay in the blood", ["The proteins leave the blood at the same rate as water", "The proteins are made in the capillary wall", "The proteins are pumped in by the heart"], "Their concentration in the blood barely changes."),
    F("vague 'units' replaced with mmHg", { skill: 'pressure balance', gen: function () {
      var pull = rint(22, 28), art = pull + rint(6, 14), ven = pull - rint(6, 12), end = pick(['arteriole', 'venule']);
      var bp = end === 'arteriole' ? art : ven, net = bp - pull;
      return mq("At the " + end + " end of a capillary, blood pressure is " + bp + " mmHg and the pull of the plasma proteins is " + pull + " mmHg. In which direction does fluid move?",
        net > 0 ? "Out of the capillary, because blood pressure is higher by " + net + " mmHg" : "Into the capillary, because the protein pull is higher by " + (-net) + " mmHg",
        [net > 0 ? "Into the capillary, because the protein pull is higher by " + net + " mmHg" : "Out of the capillary, because blood pressure is higher by " + (-net) + " mmHg", "Neither way, because the two pressures always cancel out", "Out of the capillary, because water always leaves capillaries"],
        "Subtract: " + bp + " − " + pull + " = " + net + ". " + (net > 0 ? "Blood pressure wins, so fluid is pushed out." : "The protein pull wins, so fluid moves back in."));
    } }),
    M('leaky capillaries', "If capillaries leak much more fluid than normal, what happens to blood pressure?",
      "It falls, because blood volume falls", ["It rises, because more fluid is in the tissues", "It stays the same, because fluid always returns", "It rises, because red cells are lost"], "Less fluid in the blood means a lower blood volume and pressure."),
    M('common errors', "A student writes: 'Red blood cells and proteins pass into tissue fluid.' What is correct?",
      "They are too large to leave the capillaries", ["Only red blood cells pass into tissue fluid", "Only proteins pass into tissue fluid", "Both pass out at the venule end"], "Tissue fluid has no red cells and no large proteins.")
  ], { date: '2026-10-13', dropped: [] });
})();
