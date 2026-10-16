/* Group G26 mastery bank: Further cells, reproduction and disease (Grade 9 block).
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
  // Sperm cell: A acrosome, B nucleus, C mid-piece, D tail.
  var SPERM = (function () {
    var g = '<path d="M210 90 C250 60 280 120 320 90 S390 60 430 90 S490 120 520 95" fill="none" stroke="' + INK + '" stroke-width="3"/>';
    g += '<rect x="140" y="80" width="72" height="20" rx="6" fill="#f6d7a8" stroke="' + INK + '" stroke-width="1.5"/>';
    for (var i = 0; i < 6; i++) g += '<ellipse cx="' + (150 + i * 11) + '" cy="90" rx="5" ry="8" fill="none" stroke="#b9770e" stroke-width="1.5"/>';
    g += '<ellipse cx="100" cy="90" rx="44" ry="28" fill="#e8eef8" stroke="' + INK + '" stroke-width="2"/>';
    g += '<path d="M76 67 C50 72 50 108 76 113" fill="#c39bd3" stroke="' + INK + '" stroke-width="1.5"/>';
    g += '<ellipse cx="108" cy="90" rx="24" ry="17" fill="#7fb3d5" stroke="' + INK + '" stroke-width="1.2"/>';
    g += lab(60, 80, 30, 25, 'A', 'end') + lab(112, 95, 120, 160, 'B') + lab(180, 100, 190, 160, 'C') + lab(380, 70, 400, 25, 'D');
    return '<svg class="mc-svg" viewBox="0 0 540 180" role="img" aria-label="Sperm cell with four parts labelled A to D, not to scale">' + g + '</svg>';
  })();
  // Growth of bacteria after an antibiotic is added at the dashed line: A control, B bacteriostatic, C bactericidal.
  var ABX = (function () {
    var g = '<line x1="60" y1="20" x2="60" y2="240" stroke="' + INK + '" stroke-width="1.5"/><line x1="60" y1="240" x2="500" y2="240" stroke="' + INK + '" stroke-width="1.5"/>';
    g += '<text x="280" y="268" font-size="13" text-anchor="middle" fill="' + INK + '">Time</text><text x="24" y="130" font-size="13" text-anchor="middle" fill="' + INK + '" transform="rotate(-90 24 130)">Number of living bacteria</text>';
    g += '<line x1="220" y1="20" x2="220" y2="240" stroke="' + GREY + '" stroke-dasharray="5 5"/><text x="226" y="34" font-size="12" fill="' + INK + '">antibiotic added</text>';
    g += '<path d="M60 210 C140 200 180 170 220 150" fill="none" stroke="' + INK + '" stroke-width="2.5"/>';
    g += '<path d="M220 150 C300 110 380 70 480 45" fill="none" stroke="' + BLUE + '" stroke-width="2.5"/><path d="M220 150 L480 150" fill="none" stroke="#27ae60" stroke-width="2.5"/><path d="M220 150 C300 180 380 215 480 228" fill="none" stroke="' + HI + '" stroke-width="2.5"/>';
    g += '<text x="488" y="50" font-size="16" font-weight="700" fill="' + INK + '">A</text><text x="488" y="155" font-size="16" font-weight="700" fill="' + INK + '">B</text><text x="488" y="232" font-size="16" font-weight="700" fill="' + INK + '">C</text>';
    return '<svg class="mc-svg" viewBox="0 0 520 280" role="img" aria-label="Graph of the number of living bacteria against time; after an antibiotic is added, line A rises, line B stays level and line C falls">' + g + '</svg>';
  })();
  function plate(radii) {
    var g = '<circle cx="150" cy="150" r="130" fill="#f3e9c6" stroke="' + INK + '" stroke-width="3"/>', pos = [[95, 95], [205, 95], [95, 205], [205, 205]], nm = ['P', 'Q', 'R', 'S'];
    pos.forEach(function (p, i) {
      if (radii[i] > 0) g += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + radii[i] + '" fill="#fffdf5" stroke="#d6c58e" stroke-width="1"/>';
      g += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="9" fill="#fff" stroke="' + INK + '" stroke-width="1.5"/><text x="' + p[0] + '" y="' + (p[1] + 5) + '" font-size="12" font-weight="700" text-anchor="middle" fill="' + INK + '">' + nm[i] + '</text>';
    });
    return '<svg class="mc-svg mc-svg-small" viewBox="0 0 300 300" role="img" aria-label="Agar plate covered with bacteria, with four antibiotic discs P, Q, R and S and clear zones of different sizes">' + g + '</svg>';
  }

  /* ====================================================================== HBI-DESCRIBE-IVF-PROCEDURE */
  T('HBI-DESCRIBE-IVF-PROCEDURE', 'Describe the steps of IVF treatment', [
    M('meaning', "What does in-vitro fertilisation (IVF) mean?",
      "The egg is fertilised outside the body, in a dish", ["The egg is fertilised inside the oviduct after sperm are injected there", "The embryo is grown in a test tube until birth", "The egg is frozen and never fertilised"],
      "In vitro means 'in glass'."),
    M('first hormones', "Which hormones are given to the woman at the start of IVF?",
      "FSH and LH", ["Oestrogen and progesterone", "Insulin and glucagon", "Adrenaline and oxytocin"], "FSH makes follicles grow; LH ripens the eggs."),
    M('FSH', "Why is FSH given at the start of IVF?",
      "To make several follicles grow so many eggs mature at once", ["To make one egg split into two so that twins are born", "To thicken the uterus lining", "To stop ovulation"],
      "More eggs give more chances of fertilisation."),
    M('collection', "What happens after the hormone treatment?",
      "The eggs are collected from the ovaries", ["The eggs are put straight into the uterus without being fertilised", "The woman is given insulin", "The sperm are injected into the ovary"],
      "Sperm are collected from the man."),
    M('fertilisation', "Where are the eggs fertilised in IVF?",
      "In a dish in the laboratory", ["Inside the woman's oviduct", "Inside the woman's uterus", "Inside the man's body"], "Eggs and sperm are mixed in the dish."),
    M('embryos', "What happens to the zygotes before they are put into the uterus?",
      "They divide by mitosis to form small embryos, which are checked", ["They divide by meiosis to form gametes, which are then frozen until needed later", "They are dried", "They are given antibiotics only"],
      "Healthy embryos can then be chosen."),
    M('transfer', "What is the final step of IVF?",
      "One or two embryos are placed in the woman's uterus", ["The eggs are collected from the woman's ovaries using a fine needle", "FSH is given", "The sperm are tested"],
      "The embryos may then implant."),
    M('order', "Which is the correct order of IVF steps?",
      "Hormones given, eggs collected, eggs and sperm mixed, embryos put in uterus", ["Eggs collected, embryos put in uterus, hormones given, eggs and sperm mixed", "Eggs and sperm mixed, hormones given, eggs collected, embryos put in uterus", "Embryos put in uterus, eggs collected, hormones given, eggs and sperm mixed"],
      "Hormones come first; transfer to the uterus comes last."),
    M('multiple births', "Why can IVF lead to twins or triplets?",
      "More than one embryo may be placed in the uterus and implant", ["FSH makes one egg divide into two identical eggs", "IVF babies are always twins", "The sperm split in two"],
      "Each embryo that implants can become a baby."),
    M('success', "Why does IVF improve the chance of pregnancy?",
      "Many eggs are fertilised, and healthy embryos can be chosen", ["The egg is fertilised by many sperm at the same time, so it grows faster", "The baby grows outside the body", "No hormones are used"],
      "More than one embryo can also be placed in the uterus."),
    M('common errors', "A student describes IVF but leaves out a step. Which step is most often missed?",
      "Putting the embryo back into the uterus", ["Giving the woman antibiotics", "Freezing the man", "Removing the uterus"], "Without this step there is no pregnancy."),
    M('common errors', "A question asks for the steps after hormone treatment. What should the answer start with?",
      "Collecting the eggs", ["Giving FSH", "Giving LH", "Giving oestrogen"], "Do not describe the hormone steps if the question does not ask for them.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-IMMOBILISED-ENZYMES */
  T('HBI-IMMOBILISED-ENZYMES', 'Make alginate beads and give uses and advantages of immobilised enzymes', [
    M('meaning', "What is an immobilised enzyme?",
      "An enzyme fixed in place, for example inside alginate beads", ["An enzyme that has been denatured so it can no longer work at all", "An enzyme that moves freely in solution", "An enzyme made by the body"],
      "It is trapped, not free in the solution."),
    M('beads', "Which solution are the drops of alginate and enzyme dripped into to make beads?",
      "Calcium chloride solution", ["Sodium chloride solution", "Distilled water", "Glucose solution"], "Calcium chloride makes the alginate set into beads."),
    M('bead order', "Which is the correct order for making enzyme beads?",
      "Dissolve sodium alginate in water, add the enzyme, drip into calcium chloride, wash the beads", ["Drip the enzyme into calcium chloride, add sodium alginate, then dissolve in water and wash", "Boil the enzyme, add salt, freeze", "Add calcium chloride to the enzyme, then dry it"],
      "The beads are washed with water at the end."),
    M('lactase', "What does immobilised lactase do to milk?",
      "Turns lactose into glucose and galactose, making lactose-free milk", ["Turns glucose into lactose, making the milk taste sweeter", "Removes all the fat", "Kills bacteria"],
      "People with lactose intolerance can drink it."),
    M('sucrase', "In a column of immobilised sucrase, what is poured in at the top?",
      "Sucrose", ["Glucose", "Fructose", "Lactose"], "Glucose and fructose flow out at the bottom."),
    M('sucrase product', "What flows out of the bottom of a sucrase column?",
      "Glucose and fructose", ["Sucrose", "Lactose", "Glucose and galactose"], "Sucrase (invertase) breaks sucrose down."),
    M('reuse', "Why do immobilised enzymes cost less to use?",
      "The enzyme can be reused", ["The enzyme is used up quickly, so less is bought", "The beads are made of gold", "No substrate is needed"], "Enzymes are not used up in reactions."),
    M('purity', "Why does the product not need a cleaning step?",
      "The enzyme stays in the beads, so the product does not contain it", ["The beads dissolve into the product and make it clean and pure", "The product is boiled", "The product contains no water"],
      "No purifying step saves time and money."),
    M('stability', "What is another advantage of immobilised enzymes?",
      "They are often stable over a wider range of temperature and pH", ["They work only at one exact temperature and one exact pH", "They are used up faster", "They make the product sweeter"],
      "This makes them more useful in industry."),
    M('surface area', "Why are small beads better than large ones?",
      "They give a larger surface area, so the reaction is faster", ["They hold less enzyme, so the reaction is slower but safer", "They are cheaper to throw away", "They dissolve faster"],
      "More substrate meets the enzyme each second."),
    M('common errors', "A student writes: 'The enzyme is used up in the reaction.' What is correct?",
      "Enzymes are not used up, so they can be reused", ["Enzymes are used up, so new beads are always needed", "Enzymes turn into the product", "Enzymes are destroyed by calcium chloride"],
      "That is why immobilising them saves money."),
    M('common errors', "A student gives 'reusable' and 'can be used again' as two advantages. Why do they get only one mark?",
      "They are the same idea", ["Neither is an advantage", "Only cost counts", "They must name the enzyme"], "Give a different second advantage, such as no purifying step.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-RELATE-SPERM-STRUCTURE-FUNCTION */
  T('HBI-RELATE-SPERM-STRUCTURE-FUNCTION', 'Relate sperm structures to their roles in fertilisation', [
    M('label', "The diagram shows a sperm cell. Which letter labels the acrosome?", "A", ["B", "C", "D"],
      "A is the sac at the tip of the head.", { svg: SPERM, family: 'g26-sperm' }),
    M('label', "Using the same diagram, what does part C contain many of?", "Mitochondria", ["Ribosomes", "Chromosomes", "Enzymes"],
      "C is the mid-piece, packed with mitochondria.", { svg: SPERM, family: 'g26-sperm' }),
    M('label', "Using the same diagram, what is B?", "The nucleus", ["The acrosome", "The mid-piece", "A vacuole"],
      "B holds 23 chromosomes.", { svg: SPERM, family: 'g26-sperm' }),
    M('label', "Using the same diagram, what does D do?", "Moves from side to side so the sperm can swim towards the egg", ["Releases enzymes that digest the jelly coat around the egg so that the head can enter", "Stores the genetic information", "Releases energy"],
      "D is the tail. Its movement lets the sperm reach the egg.", { svg: SPERM, family: 'g26-sperm' }),
    M('mitochondria', "Why does the mid-piece have many mitochondria?",
      "They carry out aerobic respiration to release energy for the tail", ["They make the energy that the nucleus needs to divide into two new cells", "They store enzymes", "They hold the chromosomes"],
      "Mention respiration, not just 'energy'."),
    M('acrosome', "What do the enzymes in the acrosome do?",
      "Digest the jelly coat around the egg so the head can get in", ["Digest the egg's cell wall so the sperm can enter", "Give energy to the tail", "Copy the DNA"],
      "Human eggs have no cell wall."),
    M('nucleus', "How many chromosomes are in the nucleus of a human sperm?",
      "23", ["46", "22", "92"], "A sperm nucleus is haploid: it has one set of 23 chromosomes."),
    M('haploid', "Why must the sperm nucleus be haploid?",
      "So the zygote has the normal 46 chromosomes when it fuses with the egg nucleus", ["So the sperm is lighter and can swim much faster through the uterus to reach the egg", "So it can divide by mitosis", "So it makes more enzymes"],
      "23 from the sperm + 23 from the egg = 46 in the zygote."),
    M('function', "What is the function of a sperm cell?",
      "To fuse with an egg at fertilisation", ["To feed the egg after fertilisation", "To make hormones", "To carry oxygen"], "The two nuclei combine."),
    M('tail', "How does the tail help fertilisation?",
      "It lets the sperm swim to reach the egg", ["It digests the jelly coat around the egg", "It joins with the egg", "It stores food for the embryo"], "Link moving to reaching the egg."),
    M('common errors', "A student writes: 'Mitochondria give the sperm energy.' What should be added?",
      "They release energy by aerobic respiration", ["They make energy from nothing", "They store energy as fat", "They absorb energy from the egg"], "Name the process: aerobic respiration releases energy."),
    M('common errors', "A student writes only: 'The acrosome contains enzymes.' Why is this not enough?",
      "It does not say what the enzymes do", ["Acrosomes do not contain enzymes", "It should say 'nucleus'", "It is too long"], "Say the enzymes digest the jelly coat around the egg.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-STATE-INHERITED-CONDITION-EFFECTS */
  T('HBI-STATE-INHERITED-CONDITION-EFFECTS', 'State the symptoms and effects of inherited conditions', [
    M('polydactyly', "What is polydactyly?",
      "Extra fingers or toes", ["Missing fingers or toes", "Blood that does not clot", "Thick, sticky mucus"], "It is caused by a dominant allele."),
    M('haemophilia', "What is the effect of haemophilia?",
      "The blood does not clot properly, so cuts bleed for a long time", ["The body has no blood cells at all, so it cannot carry oxygen", "The person cannot see red and green", "The lungs fill with mucus"],
      "Internal injuries also bleed for a long time."),
    M('colour blindness', "What can a person with red-green colour blindness not do?",
      "Tell red and green apart", ["See anything at all", "See in dim light", "Hear high sounds"], "It is X-linked recessive, like haemophilia."),
    M('CF mucus', "What do the cells of a person with cystic fibrosis make?",
      "Thick, sticky mucus", ["Extra red blood cells", "Too much insulin", "No enzymes at all"], "The mucus affects the lungs, pancreas, gut and sperm ducts."),
    M('CF lungs', "How does cystic fibrosis affect the lungs?",
      "Mucus causes coughing, less gas exchange and more chest infections", ["The alveoli become larger, so gas exchange is much faster than normal", "The lungs make insulin", "The ribs break"],
      "Give an effect, not just 'it affects the lungs'."),
    M('CF tiredness', "Why do people with cystic fibrosis often feel tired?",
      "Less oxygen is absorbed, so there is less aerobic respiration", ["They make too much glucose", "Their blood does not clot", "They have extra fingers"], "Less respiration releases less energy."),
    M('CF digestion', "How does cystic fibrosis affect digestion?",
      "Mucus blocks the enzymes from the pancreas, so less food is digested and absorbed", ["The stomach makes far too much acid, so all of the food is digested much too quickly", "The teeth fall out", "The liver stops making bile"],
      "This can lead to diarrhoea and low body mass."),
    M('CF fertility', "Why are many men with cystic fibrosis infertile?",
      "Mucus blocks the sperm ducts", ["They have no testes", "Their sperm have no tails", "They make too much testosterone"], "Sperm cannot leave the testes."),
    M('not infectious', "Can cystic fibrosis be caught from another person?",
      "No; it is inherited, not caused by a pathogen", ["Yes; it spreads in droplets when people cough near each other", "Yes; by touching", "Only in hospitals"],
      "It is caused by a recessive allele."),
    S('X-linked', "Which of these conditions are X-linked recessive?", ["Haemophilia", "Red-green colour blindness"], ["Polydactyly", "Cystic fibrosis"],
      "Polydactyly is dominant; cystic fibrosis is recessive but not on the X chromosome."),
    M('common errors', "A student writes: 'Haemophilia means having no blood.' What is correct?",
      "The blood does not clot properly", ["There are no red blood cells", "There are no white blood cells", "There is no plasma"], "The blood is there; it just does not clot."),
    M('common errors', "A four-mark question asks for the effects of cystic fibrosis. A student lists only lung effects. What else should they include?",
      "Effects on digestion and fertility", ["The colour of the mucus", "The name of a hospital", "The number of fingers"], "Mucus also blocks the pancreas, gut and sperm ducts.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-ORAL-REHYDRATION-TREATMENT */
  T('HBI-ORAL-REHYDRATION-TREATMENT', 'Explain oral rehydration and treatment of diarrhoeal disease', [
    M('dehydration', "Why does severe diarrhoea make a person dehydrated?",
      "Large amounts of water and salts are lost from the body", ["The gut absorbs too much water, so the blood becomes far too dilute", "The kidneys stop working", "The person sweats less"],
      "Severe dehydration can kill."),
    M('ORT contents', "What does an oral rehydration drink contain?",
      "Clean water with salts and some sugar dissolved in it", ["Antibiotics dissolved in milk", "Pure water only", "Salt with no water"], "The water is boiled to make it safe."),
    M('ORT role', "What does oral rehydration therapy do?",
      "Replaces the water and salts that have been lost", ["Kills the bacteria in the gut that cause the diarrhoea", "Stops all vomiting at once", "Vaccinates the patient"],
      "ORT does not kill the pathogen."),
    M('glucose', "Why is glucose added to oral rehydration drinks?",
      "It helps the gut absorb salts and water", ["It kills the bacteria", "It makes the drink cold", "It replaces the salts"], "Glucose and sodium are absorbed together."),
    M('ions', "Which ions are lost in large amounts in diarrhoea?",
      "Sodium and potassium", ["Iron and calcium", "Iodine and fluoride", "Copper and zinc"], "These are electrolytes."),
    M('cheap', "Why is ORT useful in poorer countries?",
      "It is cheap, simple and can be given by mouth without hospital equipment", ["It needs a drip in a hospital and a trained doctor to put the needle into a vein", "It is a vaccine", "It cures every disease"],
      "Families can make and give it at home."),
    M('cholera antibiotics', "Why can antibiotics be given to a cholera patient but not to an Ebola patient?",
      "Cholera is caused by a bacterium; Ebola is caused by a virus", ["Cholera is caused by a virus; Ebola is caused by a bacterium", "Antibiotics only work in children", "Ebola patients are allergic"],
      "Antibiotics do not affect viruses."),
    M('which diseases', "Which two diseases cause severe diarrhoea and vomiting?",
      "Cholera and Ebola", ["Malaria and polio", "Influenza and HIV", "Tuberculosis and athlete's foot"], "Both can kill by dehydration."),
    { skill: 'recipe', gen: function () {
      var salt = pick([2.5, 3, 3.5]), vol = pick([250, 500, 750]), g = R.roundDp(salt * vol / 1000, 3);
      return nq("A rehydration recipe uses " + salt + " g of salt for every 1 dm³ of water. How much salt is needed for " + vol + " cm³ of water?", g, 'g',
        vol + " cm³ = " + (vol / 1000) + " dm³. " + salt + " × " + (vol / 1000) + " = " + g + " g.");
    } },
    M('common errors', "A student writes: 'Treat cholera by drinking lots of water.' What is missing?",
      "Salts (and some sugar) must be added to the water", ["The water must be very cold and drunk all at once", "The water must be salty sea water", "Nothing is missing"],
      "Water alone does not replace the lost salts."),
    M('common errors', "A question asks how to treat cholera. A student writes 'build clean water supplies'. Why is this not a treatment?",
      "It prevents cholera; it does not treat someone who already has it", ["Clean water spreads cholera", "Cholera cannot be treated", "Clean water is too expensive"],
      "Treatment: ORT and antibiotics."),
    M('common errors', "A student suggests antibiotics to treat Ebola. Why is this wrong?",
      "Ebola is a virus, and antibiotics do not affect viruses", ["Ebola is a fungus", "Antibiotics make Ebola spread", "Antibiotics are too cheap"], "ORT can still help Ebola patients.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-SANITATION-SEWAGE-AND-LATRINES */
  T('HBI-SANITATION-SEWAGE-AND-LATRINES', 'Explain sewage treatment, pit latrine design and decomposer roles', [
    M('screening', "What does screening remove from raw sewage?",
      "Large objects such as rags, plastic and grit", ["Bacteria and other microorganisms that cause disease", "Dissolved salts", "Methane"], "It removes large objects only."),
    M('settlement', "What happens in a settlement tank?",
      "Solids sink to the bottom to form sludge", ["Air is bubbled through so bacteria can respire", "Methane is burned", "Rags are removed"], "The liquid above is treated next."),
    M('aeration', "Why is air bubbled into the activated sludge tank?",
      "So aerobic bacteria can respire and break down organic matter", ["To kill all the bacteria in the tank so that the water is safe to drink at once", "To cool the sewage", "To make methane"],
      "Air is added so the bacteria can respire, not to kill them."),
    M('digester', "What happens in an anaerobic digester?",
      "Anaerobic bacteria break down sludge and produce biogas", ["Aerobic bacteria break down sludge using oxygen from the air", "Rags are removed", "Water is boiled"],
      "There is no oxygen in the digester."),
    M('biogas', "What is the main gas in biogas?",
      "Methane", ["Carbon dioxide", "Oxygen", "Nitrogen"], "Methane can be burned as a fuel."),
    M('fertiliser', "Why can treated sludge be used as a fertiliser?",
      "It contains nitrogen compounds and other minerals for plant growth", ["It contains living pathogens that help the roots of crop plants to grow larger", "It contains methane", "It is pure water"],
      "The minerals help crops grow."),
    M('decomposers', "What do decomposers do?",
      "Release enzymes that break down dead matter and return nutrients to the soil", ["Make fertiliser from nothing, using energy from sunlight trapped in the soil", "Cause diseases in plants and animals all the time", "Make oxygen"],
      "Decomposers are non-pathogenic bacteria and fungi."),
    M('latrine downhill', "Why is a pit latrine built downhill from a well?",
      "So rainwater and waste flow away from the drinking water", ["So it is easier to dig the pit", "So it is closer to the house", "So the flies are attracted to the well"],
      "Waste must not reach the drinking water."),
    M('latrine soil', "Why is a pit latrine built in permeable soil?",
      "So urine can soak away", ["So the pit fills up quickly", "So the pit does not need a cover", "So flies can get in"], "Permeable soil lets liquid drain."),
    M('latrine cover', "Why does a pit latrine need a cover?",
      "To keep out flies and rats and reduce the smell", ["To keep the waste warm so it rots faster", "To stop urine soaking away", "To let more air in"],
      "Flies can carry pathogens to food."),
    M('common errors', "A student writes: 'Air is added to kill bacteria.' What is correct?",
      "Air is added so the bacteria can respire aerobically", ["Air is added to make methane", "Air is added to cool the tank", "Air is not added"], "The bacteria are needed to break down the sewage."),
    M('common errors', "A student names carbon dioxide as the main gas in biogas. What is correct?",
      "Methane", ["Oxygen", "Hydrogen", "Water vapour"], "Biogas is mainly methane.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-VIRUS-STRUCTURE-REPRODUCTION */
  T('HBI-VIRUS-STRUCTURE-REPRODUCTION', 'Describe virus structure and reproduction', [
    M('structure', "What is a virus made of?",
      "Genetic material (DNA or RNA) inside a protein coat", ["A nucleus, cytoplasm and cell membrane inside a cell wall", "Only fat", "Only sugar"],
      "A virus is not a cell."),
    M('capsid', "What is the protein coat of a virus called?",
      "Capsid", ["Cell wall", "Nucleus", "Membrane"], "It surrounds the genetic material."),
    M('spikes', "What do the protein spikes on some viruses do?",
      "Attach the virus to a host cell", ["Help the virus swim", "Make energy", "Digest food"], "The spikes fit receptors on the host cell."),
    M('RNA virus', "What is the genetic material of an RNA virus?",
      "RNA only", ["DNA and RNA", "DNA only", "Protein"], "An RNA virus carries its genes as RNA and has no DNA."),
    M('host', "Where can a virus reproduce?",
      "Only inside a living host cell", ["Anywhere, by dividing in two like a bacterium", "Only in water", "Only in soil"], "It uses the cell's ribosomes and enzymes."),
    M('not a cell', "Why is a virus not called a cell?",
      "It has no cytoplasm, cell membrane or ribosomes of its own", ["It is too large to be a cell and can easily be seen without any microscope", "It has a nucleus", "It has a cell wall"],
      "It is a particle of genetic material in a protein coat."),
    M('order', "Which is the correct order of virus reproduction?",
      "Attach, inject genetic material, host makes viral parts, new viruses assembled, cell bursts", ["Cell bursts, virus attaches, new viruses assembled, genetic material injected, host makes parts", "Virus divides in two, then grows, then divides again", "Inject genetic material, cell bursts, attach, new viruses assembled, host makes parts"],
      "The cell bursting (lysis) releases the new viruses."),
    M('lysis', "What happens when the host cell bursts (lysis)?",
      "New viruses are released to infect more cells", ["The virus is destroyed with the cell", "The cell divides into two", "The virus becomes a bacterium"], "This spreads the infection."),
    M('ribosomes', "Why does a virus need the host cell's ribosomes?",
      "To make viral proteins, because the virus has no ribosomes", ["To make the energy that the virus uses to swim to the next cell", "To store its DNA", "To make antibiotics"],
      "The cell makes proteins for the virus."),
    M('antibiotics', "Why do antibiotics not work on viruses?",
      "Viruses do not have the structures that antibiotics attack", ["Viruses are too large for antibiotics to enter", "Antibiotics only kill fungi", "Viruses are made of antibiotics"], "Antibiotics target bacterial structures."),
    M('common errors', "A student writes: 'A virus reproduces by dividing in two.' What is correct?",
      "The host cell makes new viruses, which are released when it bursts", ["A virus divides in two inside the host's nucleus", "A virus reproduces by meiosis", "A virus does not reproduce"],
      "Dividing in two is how bacteria reproduce."),
    M('common errors', "A student says an RNA virus contains both DNA and RNA. What is correct?",
      "An RNA virus has RNA but no DNA", ["An RNA virus has DNA but no RNA", "An RNA virus has a nucleus", "An RNA virus has no genetic material"], "The name tells you its genetic material.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-EXPLAIN-GENETIC-AND-ENVIRONMENTAL-VARIATION */
  T('HBI-EXPLAIN-GENETIC-AND-ENVIRONMENTAL-VARIATION', 'Explain genetic and environmental causes of variation', [
    M('definition', "What is variation?",
      "Differences between individuals of the same species", ["Differences between two different species, such as cats and dogs", "Changes in the weather", "Mutations only"],
      "Variation is within one species."),
    M('genetic', "Which feature is caused only by genetic variation?",
      "Blood group", ["Body mass", "A scar", "Speaking French"], "Blood group depends only on the alleles inherited."),
    M('environmental', "Which feature is caused only by the environment?",
      "A scar from an accident", ["Eye colour", "Blood group", "Haemophilia"], "Accidents are environmental."),
    M('both', "Which feature is affected by both genes and environment?",
      "Height", ["Blood group", "Eye colour", "A tattoo"], "Genes set a range; diet and health affect where in the range a person ends up."),
    M('alleles', "Where does genetic variation come from?",
      "The different alleles each person inherits from their parents", ["The food that a person eats while they are growing up", "The amount of exercise a person takes", "The weather"],
      "Each parent passes on one allele of each gene."),
    M('runs in families', "A disease 'runs in families'. What does this suggest?",
      "A faulty allele is being passed from parents to children", ["The disease is caught by sharing food at mealtimes", "The disease is caused by the weather", "The disease is not real"],
      "Link 'runs in families' to alleles being inherited."),
    F("distractor 'Both genetic and inherited' was confusing (genetic and inherited mean the same); replaced", M('passage clues', "A passage says a condition started after a long illness and stress. What kind of cause does this suggest?",
      "Environmental", ["Genetic", "Both, in equal amounts", "Neither"], "Illness and stress are environmental factors.")),
    M('passage clues', "A passage says a condition starts in childhood with no known cause and is common in some families. What kind of cause does this suggest?",
      "Genetic", ["Environmental", "Dietary", "Infectious"], "These are clues to an inherited cause."),
    M('lactose tolerance', "Why is the allele for digesting lactose common where people's ancestors drank a lot of milk?",
      "People with the allele survived and reproduced better, so it was passed on more often", ["People decided to drink milk, so their bodies made the allele for them", "Milk changes people's genes", "Everyone was given the allele"],
      "This is natural selection, not a choice."),
    M('selection', "An allele gives an advantage in a population's environment. What happens to it over many generations?",
      "It becomes more common", ["It disappears", "It stays at exactly the same frequency", "It changes into a different gene"], "People with it survive and reproduce more."),
    M('common errors', "A student lists 'food', 'diet' and 'nutrition' as three environmental factors. Why do they get only one mark?",
      "They are the same idea", ["None of them affects variation", "Only genes cause variation", "They must be written as one word"], "Give different factors, such as diet, exercise and disease."),
    M('common errors', "A student says a condition must be genetic 'because it is common'. Why is this weak?",
      "Being common does not show the cause is inherited", ["Common conditions are always caused by the weather", "Genetic conditions are always rare", "Nothing is wrong"],
      "Look for evidence such as 'runs in families'.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-INTERPRET-HUMAN-GROWTH-DATA */
  T('HBI-INTERPRET-HUMAN-GROWTH-DATA', 'Interpret human growth data, proportions and percentile charts', [
    M('growth spurt', "When are the two fastest periods of human growth?",
      "Infancy and the adolescent growth spurt", ["Middle age and old age, when the bones are fully formed", "Only before birth", "Only after the age of 20"],
      "Growth slows in between."),
    M('sex difference', "By the end of growth, how do males and females usually compare in height?",
      "Males are taller on average", ["Females are taller on average", "They are always exactly the same", "Males stop growing first"], "This is an average; some females are taller than some males."),
    M('proportions', "How do the body proportions of a newborn compare with an adult's?",
      "The head is a larger fraction of body length and the legs are shorter", ["The head is a smaller fraction of body length and the legs are longer", "They are the same", "The arms are longer than the legs"],
      "The head does not shrink; the rest of the body grows more."),
    F("random pairs could be unrealistic (a 175 cm adult with a head a quarter of body length); body length and head fraction are now matched to newborn, child or adult", { skill: 'proportion', gen: function () {
      var pr = pick([[50, 0.25], [60, 0.25], [80, 0.2], [120, 0.15], [160, 0.125], [176, 0.125]]), body = pr[0], frac = pr[1], head = R.roundDp(body * frac, 1), pct = R.roundDp(frac * 100, 1);
      return nq("A person's head is " + head + " cm long and their total body length is " + body + " cm. What percentage of the body length is the head?", pct, '%',
        "Divide the part by the whole, then multiply by 100: " + head + " ÷ " + body + " × 100 = " + pct + "%.");
    } }),
    M('why proportion', "Why are body parts measured as a proportion of total length?",
      "To compare people of different sizes and see which parts grow faster", ["To make the numbers bigger so that they are easier to plot accurately on a graph", "Because rulers are not accurate", "To find the person's mass"],
      "Proportions remove the effect of overall size."),
    M('percentile', "What does a percentile chart show?",
      "The spread of mass or height for children of the same age and sex", ["The exact mass that every single child must reach at each age to be healthy", "The number of children born each year", "The food a baby eats"],
      "The 50th percentile line is the middle value."),
    M('50th', "A baby is on the 50th percentile line for mass. What does this mean?",
      "Half of babies of that age and sex are lighter and half are heavier", ["The baby is 50% too light", "The baby weighs 50 kg", "The baby is unhealthy"], "It is the middle value."),
    M('concern', "Which pattern on a percentile chart might be a concern?",
      "The baby's mass crosses several percentile lines downwards", ["The baby stays close to the 25th percentile line", "The baby stays on the 75th line", "The baby is measured often"],
      "A healthy baby usually follows the same line."),
    M('below 50', "A baby stays on the 10th percentile line. Is this necessarily a problem?",
      "No; a baby can be healthy below the 50th percentile if it follows its line", ["Yes; every baby below the 50th percentile is unhealthy and needs treatment", "Yes; only the 50th line is healthy", "No; percentiles are not used for babies"],
      "Staying on a line matters more than which line."),
    M('measure more', "Why must a baby be measured more than once to use a percentile chart well?",
      "To see whether the baby follows a line over time", ["Because scales are always wrong the first time", "To make the baby grow", "To find the baby's height"], "One point cannot show a trend."),
    M('common errors', "A student writes: 'The head shrinks as a child grows.' What is correct?",
      "The head grows, but more slowly than the body, so it becomes a smaller proportion", ["The head shrinks after birth", "The head stops growing at birth", "The head grows faster than the legs"],
      "A proportion change is not a size change."),
    M('common errors', "A table shows males are taller than females at 18. A student concludes 'females grow faster'. What should they do first?",
      "Check whether the figures actually support that conclusion", ["Add a line of best fit to every table they are given before reading it", "Ignore the table", "Repeat the conclusion twice"],
      "Only write a conclusion that the data support.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-EXPLAIN-PLACENTA-AND-PREGNANCY-SUPPORT */
  T('HBI-EXPLAIN-PLACENTA-AND-PREGNANCY-SUPPORT', 'Explain how the placenta, cord and hormones support a fetus', [
    M('no mixing', "Does the mother's blood mix with the fetus's blood in the placenta?",
      "No; they come very close, and substances diffuse across", ["Yes; the two bloods mix completely together in the placenta", "Yes, but only in the last month", "Only the plasma mixes"],
      "Mixing could cause blood group problems."),
    M('to fetus', "Which substances pass from the mother to the fetus?",
      "Glucose, amino acids and oxygen", ["Carbon dioxide and urea", "Red blood cells", "Bacteria and viruses only"], "Nutrients and oxygen go to the fetus."),
    M('to mother', "Which substances pass from the fetus to the mother?",
      "Carbon dioxide and urea", ["Glucose and oxygen", "Antibodies", "Amino acids"], "Waste goes to the mother to be removed."),
    M('cord', "What does the umbilical cord do?",
      "Joins the fetus to the placenta; its vessels carry food and oxygen in and waste out", ["Joins the placenta to the wall of the uterus and makes progesterone to keep the lining thick", "Makes amniotic fluid", "Feeds the mother"],
      "It contains blood vessels."),
    M('respiration', "Why does a fetus need a good supply of oxygen and glucose?",
      "For aerobic respiration, releasing energy for growth", ["So the placenta can produce the energy that the fetus needs", "To make the mother's blood clot", "To make urea"],
      "Less supply means less growth and a lower birth mass."),
    M('twins', "Twins often have a lower birth mass. Why?",
      "Each gets less glucose and oxygen, so less respiration and less growth", ["They have fewer chromosomes than single babies, so they grow less before they are born", "They share one placenta that makes energy", "They are born late"],
      "Name glucose or oxygen and link to respiration."),
    M('harmful', "How can alcohol or nicotine harm a fetus?",
      "They cross the placenta and damage growth and development", ["They stay in the mother's stomach and never reach the fetus", "They make the fetus grow faster", "They kill the placenta at once"],
      "Some also pass into breast milk."),
    M('progesterone', "What does progesterone do in pregnancy?",
      "Keeps the uterus lining thick", ["Makes the uterus contract", "Releases a new egg", "Makes milk flow"], "Without it the lining would break down."),
    M('corpus luteum', "Early in pregnancy, what makes progesterone?",
      "The corpus luteum, kept alive by hCG from the embryo", ["The placenta, from the very first day of the pregnancy", "The pituitary gland", "The fetus's kidneys"],
      "Later, the placenta takes over."),
    M('amniotic', "What does the amniotic fluid do?",
      "Protects the fetus from bumps", ["Feeds the fetus with glucose", "Carries oxygen", "Makes progesterone"], "It cushions the fetus."),
    M('common errors', "A student writes: 'The placenta makes energy for the fetus.' What is correct?",
      "The placenta supplies glucose and oxygen; the fetus's cells release energy by respiration", ["The placenta makes energy from urea", "The placenta respires for the fetus", "The cord makes energy"],
      "Energy is released by respiration in the fetus's own cells."),
    M('common errors', "A student writes: 'The corpus luteum keeps the lining thick.' What should they say?",
      "It makes progesterone, which keeps the lining thick", ["It is the lining itself, so it has no hormone to make", "It makes oestrogen only", "It makes FSH"], "Name the hormone it makes.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-ANTIBACTERIAL-CULTURE-INVESTIGATION */
  T('HBI-ANTIBACTERIAL-CULTURE-INVESTIGATION', 'Interpret antibacterial culture investigations', [
    { skill: 'most effective', gen: function () {
      var r = [rint(14, 20), rint(22, 28), rint(30, 36), rint(38, 44)].sort(function () { return Math.random() - 0.5; }), nm = ['P', 'Q', 'R', 'S'], best = r.indexOf(Math.max.apply(null, r));
      return mq("The diagram shows an agar plate covered with bacteria. Discs P, Q, R and S contain different antibiotics at the same concentration. Which antibiotic is most effective against these bacteria?", nm[best], nm.filter(function (x, i) { return i !== best; }),
        "Disc " + nm[best] + " has the largest clear zone, so its antibiotic killed or stopped the most bacteria.", { svg: plate(r) });
    } },
    { skill: 'resistance', gen: function () {
      var r = [rint(18, 26), rint(28, 40), 0, rint(18, 40)], nm = ['P', 'Q', 'R', 'S'], k = rint(0, 3), tmp = r[2]; r[2] = r[k]; r[k] = tmp;
      return mq("The diagram shows an agar plate covered with bacteria, with four antibiotic discs. Which antibiotic are these bacteria resistant to?", nm[k], nm.filter(function (x, i) { return i !== k; }),
        "There is no clear zone around disc " + nm[k] + ", so the antibiotic did not kill the bacteria or stop them growing.", { svg: plate(r) });
    } },
    M('clear zone', "How does a clear zone form around an antibiotic disc?",
      "The antibiotic diffuses into the agar and kills or stops the bacteria", ["The bacteria grow best near the disc and eat away the agar until it becomes clear", "The disc soaks up the bacteria", "Light from the disc kills them"],
      "No bacteria grow where enough antibiotic has spread."),
    M('fair test', "Which must be kept the same to compare antibiotics by clear zone size?",
      "Disc size, antibiotic concentration and incubation time", ["The colour of each disc and the name of each antibiotic", "The number of students", "The day of the week"],
      "Otherwise a bigger zone might not mean a better antibiotic."),
    M('graph', "The graph shows the number of living bacteria after an antibiotic is added. Which line shows a bactericidal antibiotic?", "C", ["A", "B"],
      "Bactericidal antibiotics kill bacteria, so the number falls.", { svg: ABX, family: 'g26-abx' }),
    M('graph', "Using the same graph, what does line B show?", "The bacteria stop reproducing but stay alive (bacteriostatic)", ["The bacteria are all killed at once by the antibiotic (bactericidal)", "The bacteria grow faster", "There are no bacteria"],
      "A level line means no change in number.", { svg: ABX, family: 'g26-abx' }),
    M('graph', "Using the same graph, which line is most likely the control with no antibiotic?", "A", ["B", "C"],
      "Without antibiotic the bacteria keep multiplying.", { svg: ABX, family: 'g26-abx' }),
    M('control', "Why is a control dish with no antibacterial agent set up?",
      "To show what happens without the factor being tested", ["To grow more bacteria for the next lesson", "To make the results bigger", "To kill bacteria"],
      "It lets you see the effect of the agent."),
    F("the answer mentioned 'the milk being tested' but the stem never said milk was tested; stem now gives that context", M('milk', "A student spreads milk on agar, with no extra bacteria added. Bacteria still grow in the dish. Which is the best explanation?",
      "Bacteria were already in the milk being tested, or came from the air", ["Agar always turns into bacteria if it is left warm for long enough", "The lid was taped", "The dish was too cold"],
      "Microorganisms are present in many foods and in the air.")),
    M('starting number', "Why did a dish given extra bacteria at the start show more growth?",
      "There were more bacteria to multiply from the start", ["Extra bacteria make the agar more nutritious", "Extra bacteria kill the others", "The dish was hotter"],
      "Growth depends on the starting number."),
    M('common errors', "A student chooses the antibiotic with the smallest clear zone as best. What is correct?",
      "The largest clear zone shows the most effective antibiotic", ["The smallest zone is best because less antibiotic is wasted", "Zone size does not matter", "The clear zone is where bacteria grow best"],
      "Clear means no bacteria."),
    M('common errors', "A student writes only 'X' when asked which antibiotic is best and why. What is missing?",
      "The evidence: X has the largest clear zone, so it killed the most bacteria", ["The colour of disc X and the size of the dish, so others can repeat the test", "The name of the bacterium", "Nothing; the letter is enough"],
      "The choice alone earns no mark.")
  ], { date: '2026-10-13', dropped: [] });
})();
