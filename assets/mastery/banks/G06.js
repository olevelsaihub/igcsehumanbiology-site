/* Group G06 mastery bank: Diet, digestion and teeth (A-Grade Block 6).
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
  // Simplified alimentary canal (not to scale). A oesophagus, B stomach, C liver, D pancreas, E small intestine, F large intestine.
  var GUT = '<svg class="mc-svg mc-svg-small" viewBox="0 0 380 430" role="img" aria-label="Simplified diagram of the human alimentary canal with six parts labelled A to F">' +
    '<path d="M180 15 L182 120" stroke="' + INK + '" stroke-width="9" fill="none" stroke-linecap="round"/>' +
    '<ellipse cx="128" cy="150" rx="78" ry="34" fill="#c98b6b" stroke="' + INK + '" stroke-width="2"/>' +
    '<path d="M182 118 C 250 95, 290 160, 255 205 C 232 232, 195 222, 178 206 C 200 200, 225 185, 205 140 Z" fill="#f2c6c0" stroke="' + INK + '" stroke-width="2"/>' +
    '<ellipse cx="235" cy="238" rx="48" ry="9" fill="#f3dfa2" stroke="' + INK + '" stroke-width="2"/>' +
    '<path d="M100 395 L100 262 L272 262 L272 372 L200 372 L190 410" fill="none" stroke="#b9a07a" stroke-width="16" stroke-linejoin="round"/>' +
    '<path d="M178 206 C 150 215, 140 228, 150 282 C 250 282, 250 300, 140 302 C 130 315, 250 318, 240 332 C 230 345, 135 340, 140 352" fill="none" stroke="#e6a1a8" stroke-width="9" stroke-linecap="round"/>' +
    lab(184, 60, 300, 50, 'A') + lab(250, 160, 320, 130, 'B') + lab(80, 150, 30, 110, 'C', 'end') + lab(270, 238, 330, 240, 'D') + lab(200, 300, 320, 310, 'E') + lab(100, 330, 40, 330, 'F', 'end') +
    '</svg>';
  // Vertical section through a molar. P enamel, Q dentine, R pulp cavity, S gum.
  var TOOTH = '<svg class="mc-svg mc-svg-small" viewBox="0 0 340 380" role="img" aria-label="Section through a tooth with four parts labelled P to S">' +
    '<rect x="40" y="200" width="200" height="170" fill="#f4c3c3" stroke="none"/>' +
    '<path d="M70 120 C 70 60, 100 40, 140 50 C 180 40, 210 60, 210 120 L 200 200 L 190 330 L 160 330 L 150 230 L 130 230 L 120 330 L 90 330 L 80 200 Z" fill="#f7f1e1" stroke="' + INK + '" stroke-width="2"/>' +
    '<path d="M85 125 C 85 75, 110 62, 140 70 C 170 62, 195 75, 195 125 L 200 200 L 190 330 L 160 330 L 150 230 L 130 230 L 120 330 L 90 330 L 80 200 Z" fill="#efe0b5" stroke="' + INK + '" stroke-width="1.5"/>' +
    '<path d="M120 120 C 120 100, 160 100, 160 120 L 156 205 L 124 205 Z M 124 205 L 108 315 M 156 205 L 172 315" fill="#e98a8a" stroke="' + INK + '" stroke-width="1.5"/>' +
    '<line x1="40" y1="200" x2="240" y2="200" stroke="' + INK + '" stroke-dasharray="4 3"/>' +
    lab(100, 62, 260, 40, 'P') + lab(185, 150, 260, 140, 'Q') + lab(140, 160, 260, 240, 'R') + lab(60, 260, 260, 300, 'S') +
    '</svg>';

  /* ====================================================================== HBI-DIGESTIVE-ENZYME-MATCH */
  T('HBI-DIGESTIVE-ENZYME-MATCH', 'Match digestive enzymes to substrate, product and site', [
    M('substrate and product', "What does amylase digest, and what does it make?",
      "Starch into maltose", ["Protein into amino acids", "Maltose into glucose", "Lipids into glucose"], "Amylase is a carbohydrase that digests starch into maltose."),
    M('substrate and product', "What does maltase do?",
      "Digests maltose into glucose", ["Digests starch into maltose", "Digests protein into maltose", "Digests lipids into glycerol"], "Maltase finishes starch digestion: maltose → glucose, in the small intestine."),
    M('substrate and product', "Which are the products of lipid digestion by lipase?",
      "Fatty acids and glycerol", ["Glucose and fructose", "Amino acids only", "Maltose and glucose"], "Lipase breaks lipids into fatty acids and glycerol: two products."),
    M('substrate and product', "Proteases such as pepsin and trypsin digest protein. What is the final product?",
      "Amino acids", ["Fatty acids", "Glucose", "Glycerol"], "Proteins are digested into amino acids."),
    M('site', "Where is amylase made?",
      "In the salivary glands and the pancreas", ["In the stomach and the liver", "In the gall bladder and the liver", "In the large intestine and the stomach"],
      "Amylase is made by the salivary glands and the pancreas. It is not made in the stomach."),
    M('site', "Which enzyme is made in the stomach and works in acid at about pH 2?",
      "Pepsin", ["Trypsin", "Lipase", "Amylase"], "Pepsin is a protease made by the stomach wall. It works best in acid."),
    M('site', "Where is lipase made, and where does it act?",
      "Made in the pancreas; acts in the small intestine", ["Made in the liver; acts in the stomach", "Made in the gall bladder; acts in the mouth", "Made in the stomach; acts in the large intestine"],
      "Pancreatic lipase flows into the small intestine, where it digests lipids."),
    M('enzyme groups', "Amylase belongs to which group of enzymes?",
      "Carbohydrases", ["Proteases", "Lipases", "Peptidases"], "Amylase digests a carbohydrate (starch), so it is a carbohydrase."),
    M('pH clue', "An unknown digestive enzyme works best at pH 2. Where is it most likely to come from?",
      "The stomach, because it is acidic", ["The mouth, because saliva is acidic", "The small intestine, because it is acidic", "The pancreas, because pancreatic juice is acidic"],
      "The stomach contains hydrochloric acid, so its enzymes work best at low pH."),
    M('practical', "Milk, sodium hydrogencarbonate and phenolphthalein make a pink mixture. An enzyme is added and the pink colour disappears. Which enzyme is it, and why?",
      "Lipase; it makes fatty acids, which lower the pH", ["Amylase; it makes maltose, which lowers the pH", "Pepsin; it makes amino acids, which raise the pH", "Lipase; it makes glycerol, which raises the pH"],
      "Lipase digests milk fat into fatty acids. The acid lowers the pH, so the indicator loses its pink colour."),
    M('common errors', "A student writes: 'Lipase turns fat into glucose.' What is the correct product?",
      "Fatty acids and glycerol", ["Amino acids and glycerol", "Maltose and glucose", "Starch and fatty acids"], "Lipids are made of fatty acids and glycerol, so that is what lipase releases."),
    S('where proteases act', "In which parts of the gut do proteases digest protein?", ["The stomach", "The small intestine"], ["The mouth", "The oesophagus", "The large intestine"],
      "Pepsin works in the stomach; trypsin (from the pancreas) and other proteases work in the small intestine.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-GUT-ORGANS-IDENTIFY-AND-ROLE */
  T('HBI-GUT-ORGANS-IDENTIFY-AND-ROLE', 'Identify alimentary canal organs and describe what each does', [
    M('label the diagram', "The diagram shows the alimentary canal (not to scale). Which letter labels the stomach?", "B", ["A", "C", "D"],
      "B is the J-shaped bag at the bottom of the oesophagus: the stomach.", { svg: GUT, family: 'g06-gut' }),
    M('label the diagram', "Using the same diagram, which letter labels the pancreas?", "D", ["B", "C", "E"],
      "D is the thin organ below the stomach: the pancreas. C is the liver.", { svg: GUT, family: 'g06-gut' }),
    M('label the diagram', "Using the same diagram, which letter labels the large intestine?", "F", ["A", "D", "E"],
      "F is the wide tube that runs around the outside of the small intestine (E): the large intestine.", { svg: GUT, family: 'g06-gut' }),
    M('label the diagram', "Using the same diagram, which letter labels the organ that makes bile?", "C", ["B", "D", "E"],
      "C is the liver, which makes bile.", { svg: GUT, family: 'g06-gut' }),
    M('order', "Which is the correct order in which food passes through the gut?",
      "Mouth, oesophagus, stomach, small intestine, large intestine", ["Mouth, stomach, oesophagus, large intestine, small intestine", "Mouth, oesophagus, stomach, pancreas, small intestine", "Mouth, oesophagus, liver, stomach, small intestine"],
      "Food does not pass through the liver or pancreas. They join the gut by ducts."),
    M('roles', "What is the main job of the large intestine?",
      "Absorbing most of the remaining water", ["Digesting protein into amino acids", "Making bile to emulsify fats", "Absorbing most of the glucose"],
      "The large intestine absorbs water from the remaining food. Most digested food is absorbed in the small intestine."),
    M('roles', "What happens to food in the mouth?",
      "Teeth chew it, and salivary amylase starts to digest starch", ["Pepsin starts to digest protein in the acid made by the mouth", "Bile emulsifies the lipids in the food before it is swallowed", "Villi on the tongue absorb the products of digestion"],
      "Chewing breaks food into smaller pieces; amylase in saliva begins digesting starch to maltose."),
    M('roles', "What is the job of the pancreas in digestion?",
      "It makes juice containing protease, amylase and lipase", ["It stores bile until food arrives in the small intestine", "It absorbs water from undigested food", "It makes hydrochloric acid to kill bacteria"],
      "Pancreatic juice flows into the duodenum and contains enzymes for protein, starch and lipids."),
    M('roles', "What does the stomach do?",
      "Makes acid and pepsin, which starts protein digestion", ["Absorbs most of the digested food through its villi", "Makes bile and stores glycogen for later use", "Absorbs most of the water from the food that enters"],
      "The stomach has hydrochloric acid (pH about 2) and pepsin, which starts to digest protein."),
    M('large intestine removed', "Part of a person's large intestine is removed because of cancer. Why might they become dehydrated easily?",
      "Less water is absorbed from the remaining food", ["Less glucose is absorbed into the blood", "Less bile is made, so fats are not digested", "More water is absorbed than normal"],
      "The large intestine absorbs water, so with less of it, more water is lost in the faeces."),
    M('common errors', "A student labels the oesophagus as the trachea. Which statement is correct?",
      "The oesophagus carries food; the trachea carries air", ["The oesophagus and the trachea are two names for the same tube", "The trachea carries food from the mouth down to the stomach", "The oesophagus carries air down to the lungs when we breathe"],
      "The oesophagus (gullet) is part of the gut. The trachea (windpipe) is part of the breathing system."),
    M('parasites', "Why do gut parasites such as pinworms grow well in the small intestine?",
      "It is warm, with a steady pH and plenty of digested food", ["It is cold, so the worms' enzymes work slowly and last longer", "It contains no food, so there is no competition from other organisms", "It is very acidic, which kills all the other organisms living there"],
      "Warmth, steady conditions and lots of digested food make the small intestine a good place for parasites.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-NUTRIENT-FUNCTION-DEFICIENCY */
  T('HBI-NUTRIENT-FUNCTION-DEFICIENCY', 'Link a nutrient to its function, source and deficiency disease', [
    M('deficiency diseases', "Which deficiency disease is caused by a lack of vitamin C?",
      "Scurvy", ["Anaemia", "Kwashiorkor", "Night blindness"], "Lack of vitamin C causes scurvy: bleeding gums, bruising and slow healing."),
    M('deficiency diseases', "Which deficiency disease is caused by a lack of iron?",
      "Anaemia", ["Scurvy", "Kwashiorkor", "Rickets"], "Iron is needed to make haemoglobin. Lack of iron causes anaemia."),
    M('deficiency diseases', "Which deficiency disease is caused by a lack of protein?",
      "Kwashiorkor", ["Scurvy", "Anaemia", "Night blindness"], "Lack of protein causes kwashiorkor: a swollen belly and poor growth."),
    M('deficiency diseases', "A lack of which vitamin can cause night blindness and then blindness?",
      "Vitamin A", ["Vitamin C", "Vitamin D", "Iron"], "Vitamin A is needed for vision in dim light."),
    M('functions', "What is the main function of protein in the diet?",
      "Growth and repair of tissues", ["Supplying most of the body's energy", "Helping food move through the gut", "Making haemoglobin in red blood cells"],
      "Protein is used for growth and repair. Carbohydrate supplies most energy."),
    M('functions', "Why is iron needed in the diet?",
      "To make haemoglobin, which carries oxygen", ["To make connective tissue in the gums", "To make strong bones and teeth", "To see in dim light"],
      "Iron is part of haemoglobin in red blood cells."),
    M('functions', "What is the function of vitamin C?",
      "Making connective tissue that holds cells together", ["Carrying oxygen in the blood", "Seeing in dim light", "Releasing energy in respiration"],
      "Vitamin C is needed for connective tissue in gums, skin and blood vessels."),
    M('functions', "Which nutrient, helped by vitamin D, is needed for strong bones and teeth?",
      "Calcium", ["Iron", "Vitamin C", "Protein"], "Calcium builds bones and teeth. Vitamin D helps the body absorb it."),
    M('sources', "Which food is the best source of iron?",
      "Red meat", ["Milk", "Oranges", "White bread"], "Red meat and green vegetables are good sources of iron. Dairy foods and fruit are poor sources."),
    M('symptoms', "A person has bleeding gums, bruises easily and has wounds that heal slowly. Which nutrient are they most likely to lack?",
      "Vitamin C", ["Iron", "Vitamin A", "Calcium"], "These are symptoms of scurvy, caused by lack of vitamin C."),
    M('not infectious', "Why can anaemia caused by lack of iron not spread from person to person?",
      "It is caused by a lack of a nutrient, not by a pathogen", ["It is caused by a virus that dies outside the body", "It only affects people who have had a vaccine", "It is caused by bacteria that cannot survive in air"],
      "Deficiency diseases are non-infectious: no pathogen is involved."),
    M('parasites', "How can a gut parasite such as a pinworm cause a nutrient deficiency?",
      "It takes in nutrients, so fewer reach the person's blood", ["It makes the person eat less food", "It produces extra vitamins in the gut", "It destroys the person's teeth"],
      "The parasite absorbs nutrients, leaving less for the host.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-TOOTH-TYPES-PARTS-AND-FUNCTIONS */
  T('HBI-TOOTH-TYPES-PARTS-AND-FUNCTIONS', 'Name tooth types and tissues, state their jobs and compare tooth sets', [
    F('figure corrected: enamel was drawn over the roots; it now covers the crown only', M('tooth tissues', "The diagram shows a section through a tooth. Which letter labels the enamel?", "P", ["Q", "R", "S"],
      "P is the hard outer layer of the crown: enamel.", { svg: TOOTH, family: 'g06-tooth' })),
    M('tooth tissues', "Using the same diagram, which letter labels the pulp cavity?", "R", ["P", "Q", "S"],
      "R is the central space that holds nerves and blood vessels: the pulp cavity.", { svg: TOOTH, family: 'g06-tooth' }),
    M('tooth tissues', "Using the same diagram, which letter labels the dentine?", "Q", ["P", "R", "S"],
      "Q is the softer layer under the enamel: dentine.", { svg: TOOTH, family: 'g06-tooth' }),
    M('tooth types', "Which teeth cut and bite food?",
      "Incisors", ["Canines", "Premolars", "Molars"], "Incisors are chisel-shaped front teeth that cut and bite."),
    M('tooth types', "Which teeth grind and crush food?",
      "Molars", ["Incisors", "Canines", "Milk incisors"], "Premolars and molars are broad with ridges for grinding."),
    M('tooth types', "What is the job of the canine teeth?",
      "Tearing and gripping food", ["Grinding and crushing food", "Cutting food into thin slices", "Mixing food with saliva"], "Canines are pointed teeth that tear and grip."),
    M('tooth tissues', "What does the pulp cavity contain?",
      "Nerves and blood vessels", ["Enamel and dentine", "Saliva and bacteria", "Bone and muscle"], "The pulp cavity holds the nerve and blood vessels that supply the tooth."),
    M('tooth tissues', "Which is the hardest tissue, on the outside of the crown?",
      "Enamel", ["Dentine", "Pulp", "Cement"], "Enamel is the hard outer layer of the crown. Dentine lies underneath it."),
    M('milk and adult teeth', "Which statement about milk teeth and adult teeth is correct?",
      "Children have 20 milk teeth with no premolars; adults have up to 32 teeth", ["Children have 32 milk teeth; adults have 20 larger teeth", "Children and adults have the same number and types of teeth", "Adults have no molars; children have 12 molars"],
      "Milk teeth: 20, no premolars. Adult teeth: up to 32, larger, including premolars."),
    M('wisdom teeth', "What are wisdom teeth?",
      "Third molars that often grow late, in the late teens or later", ["Milk incisors that are never lost", "Extra canines that grow in old age", "Premolars that grow in young children"],
      "Wisdom teeth are the last molars to appear and may not fit in a small jaw."),
    M('babies', "Why do newborn babies not need teeth?",
      "They feed only on milk, which needs no chewing", ["Their stomach digests all solid food without teeth", "Their saliva dissolves solid food", "Their gums grind food as well as teeth do"],
      "Milk needs no chewing. Teeth could also hurt the mother during breastfeeding."),
    M('nerve', "The nerve in the pulp cavity is a sensory neurone. What does it detect?",
      "Pain and temperature", ["Taste and smell", "Light and sound", "Sugar and acid only"], "The sensory nerve in the pulp detects pain and temperature.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-BALANCED-DIET-AND-DIFFERING-NEEDS */
  T('HBI-BALANCED-DIET-AND-DIFFERING-NEEDS', 'Define a balanced diet and explain why needs differ between people', [
    M('definition', "What is a balanced diet?",
      "A diet with all the food components in the right amounts", ["A diet with equal amounts of every type of food in each meal", "A diet with no fat, sugar or salt at all, to stay healthy", "A diet that gives as much energy as possible every day"],
      "A balanced diet contains every food component (carbohydrate, protein, lipid, vitamins, minerals, fibre and water) in the right proportions."),
    S('components', "Which of these are components of a balanced diet?", ["Fibre", "Water", "Minerals"], ["Lactic acid", "Urea"],
      "A balanced diet includes carbohydrate, protein, lipid, vitamins, minerals, fibre and water."),
    M('males and females', "Why do males usually need more energy from food than females of the same age?",
      "They usually have more muscle and a higher metabolic rate", ["They eat more food, so they need more energy to digest it", "They have more fat, which uses up energy as it is stored", "They have fewer red blood cells to supply with oxygen"],
      "More muscle and a higher metabolic rate mean more respiration, so more energy is needed. 'They eat more' is not a reason."),
    M('pregnancy', "Why does a pregnant woman need more iron?",
      "To make haemoglobin for the extra blood of mother and fetus", ["To make the bones and teeth of the fetus strong and hard", "To make the connective tissue that holds the placenta together", "To store extra energy in the liver ready for the birth"],
      "Iron makes haemoglobin, which carries oxygen for respiration in the mother and the growing fetus."),
    M('pregnancy', "Why does a pregnant woman need more calcium?",
      "For the growing bones and teeth of the fetus", ["To make haemoglobin in the fetus's blood", "To prevent scurvy in the mother", "To give the fetus more energy"],
      "Calcium is needed to build the bones and teeth of the fetus."),
    M('menstruation', "Why do women generally need more iron than men?",
      "Blood and its haemoglobin are lost in menstruation", ["Women have more muscle than men, and muscle stores iron", "Women's bones need extra iron to keep growing in adult life", "Women respire faster than men, so they use more iron"],
      "Iron lost in menstrual blood must be replaced."),
    M('occupation', "Who would need the most energy from food each day?",
      "A building-site labourer", ["An office worker", "A taxi driver", "A computer programmer"], "A very active job uses more energy, so more energy is needed from food."),
    M('climate', "Why might a person living in a very cold climate need more energy from food?",
      "More respiration is needed to release heat to keep warm", ["Cold air contains less oxygen, so more food must be eaten", "Food is digested more slowly in the cold, so more is needed", "Enzymes are denatured by the cold, so more energy is used"],
      "Keeping body temperature steady in the cold needs more respiration, so more energy from food."),
    M('age', "Why does a teenager often need more energy and protein than an elderly adult?",
      "Teenagers are growing and are often more active", ["Teenagers have smaller bodies, so they lose heat faster", "Elderly adults need no protein at all in their diet", "Teenagers cannot store any fat, so they need more food"],
      "Growth needs protein, and higher activity needs more energy."),
    M('babies', "Why are a baby's dietary needs different from an adult's?",
      "Babies live on milk and are growing quickly", ["Babies need no vitamins until they can walk", "Babies need more fibre than adults", "Babies cannot digest any lipid"],
      "Milk supplies what a baby needs for rapid growth; older people eat solid food."),
    M('common errors', "A student defines a balanced diet as 'eating equal amounts of every food'. What is wrong?",
      "Each component is needed in the right amount, not equal amounts", ["A balanced diet should contain only fruit and vegetables", "A balanced diet should not contain any carbohydrate", "Nothing is wrong with this definition"],
      "The right proportions matter: for example, far more carbohydrate than vitamins."),
    M('food label', "A food label lists energy, fat, sugar and salt. Which other dietary components might also be listed?",
      "Protein, fibre and minerals such as calcium", ["Pepsin, amylase and lipase from the gut", "Haemoglobin and plasma from the blood", "Bile and hydrochloric acid for digestion"],
      "Labels often show protein, starch, fibre, vitamins and minerals.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-TOOTH-DECAY-AND-CARE */
  T('HBI-TOOTH-DECAY-AND-CARE', 'Explain how tooth decay happens and justify ways to prevent it', [
    M('cause', "How does sugar in the diet lead to tooth decay?",
      "Plaque bacteria respire the sugar and make acid that dissolves enamel", ["Sugar reacts with the enamel directly and slowly dissolves it away", "Sugar makes the saliva alkaline, and the alkali softens the enamel", "Bacteria eat away the enamel to reach the sugar stored inside it"],
      "Sugar → bacteria in plaque → acid → enamel then dentine dissolve."),
    M('cause', "Which acid do the bacteria in plaque release?",
      "Lactic acid", ["Hydrochloric acid", "Fatty acids", "Amino acids"], "Plaque bacteria respire sugar and release lactic acid."),
    M('order of damage', "In tooth decay, in what order are the tooth tissues dissolved?",
      "Enamel first, then dentine", ["Dentine first, then enamel", "Pulp first, then enamel", "Gum first, then pulp"], "The acid attacks the outer enamel first, then the softer dentine underneath."),
    M('molars', "Why do molars decay more than other teeth?",
      "Their grooves and ridges trap food, and they are hard to brush", ["They have no enamel covering their crown, so acid reaches the dentine", "They have the most nerves in their pulp, so they feel more pain", "They are the first teeth to grow in a child, so they are the oldest"],
      "Food trapped in grooves feeds the bacteria, and the back teeth are hard to reach."),
    M('fluoride', "How does fluoride toothpaste help to prevent decay?",
      "It makes enamel stronger and more resistant to acid", ["It kills all the bacteria in the mouth and on the gums", "It removes the sugar from food before it is swallowed", "It makes the teeth grow larger so there are fewer gaps"],
      "Fluoride strengthens enamel against acid. It does not kill bacteria."),
    M('mouthwash', "How does a mouthwash containing alcohol help to reduce plaque?",
      "The alcohol kills bacteria", ["The alcohol dissolves the enamel", "The alcohol adds fluoride", "The alcohol feeds the bacteria"], "Killing bacteria means less plaque and less acid."),
    M('diet', "Which change to the diet would most reduce tooth decay?",
      "Eating fewer sugary snacks between meals", ["Eating more sugary snacks with water", "Drinking more fizzy drinks through a straw", "Eating more sweets before going to bed"],
      "Less sugar means less food for plaque bacteria, so less acid."),
    M('minerals', "Why are calcium and phosphate in the diet good for teeth?",
      "They build hard enamel that resists decay", ["They kill the bacteria in plaque", "They make saliva more acidic", "They remove plaque from the gums"], "Calcium and phosphate are needed to build strong enamel."),
    S('prevention', "Which of these help to prevent tooth decay?", ["Brushing with fluoride toothpaste", "Regular visits to the dentist", "Flossing between the teeth"], ["Eating sweets before bed", "Rinsing with sugary drinks"],
      "Brushing, flossing and dental check-ups reduce plaque and catch decay early."),
    M('data', "Region X has fewer dental visits per person than region Y. Which is the most likely result?",
      "Region X has more tooth decay", ["Region X has less tooth decay", "Both regions have the same decay", "Region Y has no tooth decay"], "Fewer dental visits usually means more untreated decay."),
    M('data', "Tooth decay in children fell between 1980 and 2020. Which is a likely reason?",
      "More use of fluoride toothpaste and dental visits", ["Children ate more sugar over this time", "Fewer children brushed their teeth", "Teeth became softer over this time"],
      "Better brushing, fluoride and dental care, or less sugar, would reduce decay."),
    M('common errors', "A student writes: 'Sugar dissolves the teeth.' What is the correct explanation?",
      "Bacteria turn the sugar into acid, and the acid dissolves the teeth", ["Sugar turns into fluoride, which dissolves the teeth", "Sugar feeds the teeth, so they grow too fast", "Sugar blocks the pulp cavity"],
      "The acid made by bacteria, not the sugar, dissolves enamel.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-ENZYME-RESULT-EXPLAIN */
  T('HBI-ENZYME-RESULT-EXPLAIN', 'Explain an enzyme practical result, including levelling off as substrate runs out', [
    M('pH falls', "Lipase is added to milk, and the pH falls. Why?",
      "Lipase digests fat into fatty acids, which are acidic", ["Lipase is itself an acid, so adding it to milk lowers the pH", "Lipase digests the fat into glucose, which is an acidic sugar", "Lipase uses up the alkali in the milk as it digests the fat"],
      "The fatty acids made by lipase lower the pH. Name the acid that is made."),
    M('Benedict\'s positive', "Starch and saliva are kept at 37 °C for 10 minutes. A Benedict's test then turns brick red. Why?",
      "Amylase in saliva digested the starch into sugar", ["Saliva contains sugar, which was there from the start", "Starch turns brick red when it is heated", "The heat turned the starch into protein"],
      "Salivary amylase digests starch to maltose, a reducing sugar, so Benedict's is positive."),
    M('plateau', "In an enzyme experiment, the volume of product rises and then stays the same. Why?",
      "The substrate has all been used up", ["The enzyme has all been used up", "The product has turned back into substrate", "The temperature has risen above the optimum"],
      "Enzymes are not used up. When the substrate runs out, no more product is made."),
    M('slowing rate', "Why is the rate fastest at the start of an enzyme reaction?",
      "There is most substrate, so most complexes form", ["The enzyme is new, so none of it has yet been used up in the reaction", "The temperature is highest at the start, so the enzyme works fastest", "The product speeds up the reaction as more of it forms in the tube"],
      "As substrate is used up, fewer complexes form, so less product is made in each time interval."),
    F('implausible distractor replaced', M('limiting factor', "Adding more enzyme to a reaction no longer increases the rate. What does this show?",
      "The substrate is now the limiting factor", ["The enzyme has stopped working completely", "The enzyme is now the limiting factor of the rate", "The product has run out, so no more can be made"],
      "There is not enough substrate to fill the extra active sites, so substrate limits the rate.")),
    M('Visking tubing', "Starch and amylase are put inside Visking tubing in water at 37 °C. After 30 minutes, sugar is found in the water outside. Why?",
      "Amylase digested starch into sugar, which is small enough to diffuse out", ["Starch diffused out of the tubing, then turned into sugar in the water", "Amylase diffused out of the tubing and made sugar from the water", "The water diffused into the tubing and pushed the sugar out"],
      "Starch molecules are too large to pass through the tubing; the small sugar molecules can diffuse out."),
    M('photographic film', "Pepsin is added to photographic film, and the film goes clear. Why?",
      "Pepsin digests the protein layer, so the black particles are freed", ["Pepsin digests the black silver particles into soluble amino acids", "Pepsin makes the film very acidic, which bleaches the black colour", "Pepsin digests the plastic film itself into glucose, which dissolves"],
      "The black silver compounds are held in a protein layer. When pepsin digests it, they are released."),
    M('second reason', "Lipase makes fatty acids, and the reaction stops before all the fat is used. What is a likely reason?",
      "The pH fell so low that the lipase was denatured", ["The fatty acids reacted to make more lipase enzyme", "The fat turned into glucose, which lipase cannot use", "The lipase was used up as a reactant in the reaction"],
      "A build-up of acid product can lower the pH enough to denature the enzyme."),
    M('protein layer', "Why does a layer of egg-white protein dissolve when protease is added?",
      "The protein is digested into small, soluble amino acids", ["The protease melts the protein layer by heating it up", "The protein is turned into insoluble fat, which floats off", "The protease is a strong acid that burns the protein away"],
      "Proteases break protein into small soluble pieces, so the layer disappears."),
    M('gas', "Catalase breaks down hydrogen peroxide into water and oxygen. Why is less oxygen made in each minute as the experiment goes on?",
      "Less hydrogen peroxide is left, so fewer complexes form", ["The catalase is used up as more and more oxygen is made", "The oxygen made pushes the enzyme molecules out of the tube", "The water that is made dilutes the enzyme until none is left"],
      "As substrate is used up, the rate falls."),
    M('common errors', "A student says a reaction stopped because 'the enzyme was used up'. What is the correct reason?",
      "The substrate was used up; enzymes are not used up", ["The product was used up by the enzyme as it formed", "The enzyme molecules turned into product over time", "Nothing is wrong, as enzymes are used up in reactions"],
      "Enzymes are catalysts and can be used again. The substrate runs out."),
    M('common errors', "A student writes: 'Amylase turns starch into amino acids.' What is the correct product?",
      "Maltose, a sugar", ["Fatty acids", "Glycerol", "Protein"], "Amylase digests starch into maltose.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-VILLUS-ABSORPTION */
  T('HBI-VILLUS-ABSORPTION', 'Explain how villi aid absorption and the effect of damage', [
    M('surface area', "How do villi and microvilli help absorption in the small intestine?",
      "They give a very large surface area for absorption", ["They digest food into small molecules that can be absorbed", "They make the wall of the intestine thicker and stronger", "They push food along the intestine by squeezing it"],
      "Many villi, each with microvilli, give a huge area for products of digestion to cross."),
    M('thin wall', "Why is it useful that the wall of a villus is one cell thick?",
      "It gives a short diffusion distance", ["It makes the villus stronger", "It stops enzymes leaving the gut", "It slows absorption to a safe rate"], "A thin wall means substances diffuse across quickly."),
    M('capillaries', "How does the blood supply in a villus help absorption of glucose?",
      "Blood carries glucose away, keeping the gradient steep", ["Blood adds more glucose to the villus, which makes the gradient steeper", "Blood digests the glucose into smaller molecules that diffuse faster", "Blood pushes the glucose back into the intestine to be absorbed later"],
      "Flowing blood removes absorbed glucose, so the concentration in the villus stays low."),
    M('lacteal', "What is absorbed into the lacteal in each villus?",
      "Fatty acids and glycerol", ["Glucose and amino acids", "Water and minerals", "Starch and protein"], "The lacteal absorbs the products of fat digestion."),
    M('identify', "A diagram of the small intestine lining shows many tiny finger-like folds. What are they called?",
      "Villi", ["Alveoli", "Cilia", "Nephrons"], "Finger-like folds of the gut lining are villi (one villus)."),
    M('coeliac', "In coeliac disease the villi are flattened. Why does the person absorb less food?",
      "The surface area for absorption is much smaller", ["The person eats much less food each day", "The villi digest food more slowly", "The blood flow to the gut stops"],
      "Flattened villi give less surface area, so less is absorbed, even if the same amount is eaten."),
    M('coeliac', "Why might a person with coeliac disease develop weak bones?",
      "Less calcium is absorbed, so calcium is taken from the bones", ["The flattened villi take calcium out of the bones directly", "The person stops making vitamin C, which bones need to grow", "The person eats too much calcium, which weakens the bones"],
      "With less calcium absorbed, the body takes calcium from the bones, which become less dense."),
    M('parasites', "How do pinworms in the gut reduce the nutrients a person gets?",
      "The worms absorb nutrients, so fewer pass into the blood", ["The worms block the oesophagus so no food is swallowed", "The worms make the villi longer", "The worms digest the person's blood"],
      "Parasites take nutrients before the host's villi can absorb them."),
    S('features', "Which features of a villus help absorption?", ["Microvilli on its cells", "A dense network of capillaries", "A wall one cell thick"], ["A thick layer of muscle", "A cell wall made of cellulose"],
      "Large surface area, short diffusion distance and good blood supply all help."),
    M('common errors', "A student writes: 'Villi have thin cell walls.' What should the student write?",
      "The wall of each villus is one cell thick", ["Villi have thick cell walls to protect them", "Villi are made of cellulose, like plant cells", "Villi have no cells; they are made of mucus"], "Animal cells have no cell wall. The villus wall is one cell thick."),
    M('common errors', "Which statement about villi is correct?",
      "Villi absorb digested food; they do not digest it", ["Villi make digestive enzymes that digest starch to glucose", "Villi are found in the stomach wall, not the small intestine", "Villi absorb oxygen from the air that we swallow with food"],
      "Villi are for absorption. Digestion is done by enzymes."),
    M('comparison', "Which structure in the lungs is adapted in a similar way to villi?",
      "Alveoli", ["Trachea", "Bronchi", "Ribs"], "Alveoli also have a large surface area, a thin wall and a good blood supply.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-BILE-EMULSIFY-NEUTRALISE */
  T('HBI-BILE-EMULSIFY-NEUTRALISE', 'Explain where bile comes from and how it aids fat digestion', [
    M('where made', "Where is bile made, and where is it stored?",
      "Made in the liver; stored in the gall bladder", ["Made in the gall bladder; stored in the liver", "Made in the pancreas; stored in the stomach", "Made in the stomach; stored in the pancreas"],
      "The liver makes bile; the gall bladder stores it until food arrives."),
    M('where it goes', "Where does bile enter the gut?",
      "The duodenum", ["The stomach", "The large intestine", "The oesophagus"], "Bile flows down the bile duct into the duodenum."),
    M('emulsify', "What does it mean to say bile emulsifies lipids?",
      "It breaks large fat drops into many small droplets", ["It digests fat into fatty acids and glycerol", "It turns fat into glucose", "It joins small fat droplets into one large drop"],
      "Emulsification is a physical change: big drops become many small droplets."),
    M('surface area', "How does emulsification help lipase?",
      "Small droplets have more surface area for lipase", ["It makes each droplet bigger, so lipase can find it", "It makes the fat more acidic, which lipase needs", "It turns the fat into a protein that lipase can digest"],
      "More surface area means lipase can digest the fat faster."),
    M('neutralise', "Why is it useful that bile is alkaline?",
      "It neutralises stomach acid, so small-intestine enzymes work well", ["It makes the small intestine acidic so that pepsin can keep working", "It kills the bacteria that live in the large intestine", "It digests the stomach acid into water and salt"],
      "Enzymes in the small intestine work best at a slightly alkaline pH."),
    M('not an enzyme', "Which statement about bile is correct?",
      "Bile is not an enzyme; it does not digest fat", ["Bile is an enzyme that digests fat into fatty acids", "Bile is made by the gall bladder, not the liver", "Bile is acidic, like the juice made in the stomach"],
      "Bile emulsifies and neutralises, but it breaks no chemical bonds."),
    M('liver damage', "A person has liver damage (cirrhosis) from alcohol. Why might less fat be absorbed?",
      "Less bile is made, so fat is digested more slowly", ["The damaged liver stops making lipase for the intestine", "The gall bladder makes too much bile, which blocks the duct", "Alcohol turns the fat in food into glucose before digestion"],
      "With less bile, fat drops stay large, so lipase digests them more slowly."),
    M('no bile', "Without bile, why is less protein and starch digested in the small intestine?",
      "The contents stay acidic, so the enzymes there work less well", ["Bile is needed to make protease and amylase in the intestine", "Protein and starch can only be digested by bile, not enzymes", "The contents become far too alkaline for the enzymes to work"],
      "Without bile to neutralise stomach acid, the pH is too low for the small intestine's enzymes."),
    M('faeces', "If no bile is released, what is likely to be found in the faeces?",
      "More undigested fat", ["More undigested fibre only", "More glucose", "More amino acids"], "Fat that is not emulsified is digested less and leaves the body."),
    { skill: 'lipase practical data', gen: function () {
      var w = rint(4, 9), b = w + rint(3, 8);
      return mq("Lipase was added to milk with an indicator that changes colour when the pH falls. With bile salts the colour changed in " + w + " minutes; without bile salts it took " + b + " minutes. Which conclusion is best?",
        "Bile salts sped up fat digestion: " + w + " minutes compared with " + b + " minutes", ["Bile salts slowed fat digestion: " + w + " minutes compared with " + b + " minutes", "Bile salts digested the fat themselves, so lipase was not needed", "Bile salts had no effect, because the colour changed in both tubes"],
        "The tube with bile salts changed colour " + (b - w) + " minutes sooner. Bile salts emulsify the fat, so lipase digests it faster. Quote both times.");
    } },
    M('common errors', "A student writes: 'Bile increases the surface area of the fat droplets.' What is the better statement?",
      "Bile breaks fat into smaller droplets with more total surface area", ["Bile makes each fat droplet larger so lipase can find it", "Bile digests the fat droplets into fatty acids and glycerol", "Bile removes the fat droplets from the gut into the faeces"],
      "Each droplet gets smaller; the total surface area increases."),
    M('common errors', "A student writes: 'Bile neutralises the small intestine.' What does bile actually neutralise?",
      "The acid from the stomach", ["The alkali from the pancreas", "The fatty acids from the liver", "The salt from the diet"], "Bile neutralises the acidic stomach contents as they enter the duodenum.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-PRAC-FOOD-ENERGY-CALORIMETRY */
  T('HBI-PRAC-FOOD-ENERGY-CALORIMETRY', 'Measure food energy by burning and explain why the value is too low', [
    { skill: 'calculate energy', gen: function () {
      var v = pick([20, 25, 30, 40]), t1 = rint(18, 22), rise = rint(12, 40), m = pick([0.5, 0.8, 1.0, 1.2, 1.5]), e = v * 4.2 * rise, per = R.roundDp(e / m, 0);
      return nq("A " + m + " g piece of food is burnt under a tube containing " + v + " cm³ of water. The temperature rises from " + t1 + " °C to " + (t1 + rise) + " °C. Energy (J) = mass of water (g) × 4.2 × temperature rise (°C). Calculate the energy per gram of food. Give your answer to the nearest whole number.", per, 'J per g',
        "1 cm³ of water has a mass of 1 g. Energy = " + v + " × 4.2 × " + rise + " = " + commas(R.roundDp(e, 1)) + " J. Per gram = " + commas(R.roundDp(e, 1)) + " ÷ " + m + " = " + commas(per) + " J per g.", { display: commas(per) });
    } },
    M('method', "Which measurements are needed to calculate the energy released by a burning food?",
      "Food mass, water volume, and start and end temperatures", ["Mass of food and the final temperature of the water only", "Volume of water and the time the food takes to burn away", "Starting temperature of the food and the colour of its flame"],
      "You need the temperature rise (start and end), the mass of water and the mass of food."),
    M('per gram', "Why is the energy divided by the mass of food burnt?",
      "So that foods of different masses can be compared fairly", ["So that the answer comes out in degrees Celsius", "Because only 1 g of any food can ever be burnt", "To find the volume of water needed for the test"],
      "Energy per gram allows a fair comparison between foods."),
    S('control variables', "To compare two foods fairly, which should be kept the same?", ["The volume of water", "The mass of food", "The distance from the flame to the tube"], ["The type of food", "The temperature rise"],
      "Keep the water, mass of food and distance the same. The food is what you change; the temperature rise is what you measure."),
    M('why too low', "Why is the energy measured in this experiment lower than the true energy in the food?",
      "Heat escapes to the air and heats the glass and needle", ["Energy is destroyed when the food burns in the flame", "The water makes extra energy as it is heated up", "The thermometer absorbs the energy and stores it inside"],
      "Not all the heat reaches the water. Some goes to the air, the tube and the needle."),
    M('why too low', "Some food is left black and unburnt after the test. How does this affect the result?",
      "The result is too low, because not all the energy was released", ["The result is too high, because the food stored extra energy", "There is no effect, because the mass was measured first", "The result is too high, because unburnt food heats the water"],
      "Incomplete burning means some of the food's energy was never released."),
    M('improve', "Which change would make the simple burning-food method more accurate?",
      "Insulate the tube and put a lid on it", ["Repeat the test with the same apparatus", "Use a larger piece of food each time", "Hold the food further from the tube"],
      "Insulation and a lid reduce heat loss. Repeats improve reliability, not this accuracy problem."),
    M('calorimeter', "Why does a food calorimeter give a more accurate value?",
      "Food burns completely in oxygen in an insulated chamber", ["It uses a much smaller volume of water in the tube", "It burns the food more slowly in air so less is wasted", "It measures the mass of the food more accurately than a balance"],
      "Complete burning in oxygen and an insulated, enclosed chamber mean little energy is lost."),
    M('calorimeter', "In a calorimeter, why do the hot gases pass through a coil in the water?",
      "So that more heat from the gases is passed to the water", ["So that the gases cool down before they are measured", "So that the food burns more slowly", "So that the water does not boil"],
      "The coil lets heat from the hot gases transfer to the water instead of escaping."),
    M('stirring', "Why should the water be stirred before the final temperature is read?",
      "To spread the heat evenly through the water", ["To make the food burn faster and hotter", "To cool the water down before reading it", "To add oxygen to the water from the air"],
      "Stirring gives an even temperature, so the reading represents all the water."),
    M('common errors', "A student holds the food in the Bunsen flame for the whole test. What is wrong?",
      "The Bunsen also heats the water, so the value is too high", ["The food will not burn at all if it is held in a flame", "The water cannot be heated by a Bunsen flame through glass", "Nothing is wrong; holding it there gives a more accurate result"],
      "Light the food, then move it under the tube, so only the food heats the water."),
    M('common errors', "A student says 'the energy was destroyed' to explain a low result. What should the student say?",
      "The energy went to the air, glass and needle instead", ["The energy was turned into water as the food burnt", "The energy was stored in the thermometer during the test", "The energy was used up by the food as it burnt away"],
      "Energy is not destroyed; say where it went.")
  ], { date: '2026-10-13', dropped: [] });
})();
