/* Group G23 mastery bank: More reproduction and development (Grade 8 block).
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


  /* ====================================================================== HBI-DESCRIBE-BIRTH-AND-BREASTFEEDING */
  T('HBI-DESCRIBE-BIRTH-AND-BREASTFEEDING', 'Describe labour and the advantages of breastfeeding', [
    M('labour start', "What happens when labour starts?",
      "The muscles of the uterus wall begin strong, regular contractions", ["The muscles of the uterus wall relax so the baby can slide out on its own", "The placenta grows larger", "The cervix closes tightly"],
      "Contractions push the baby out."),
    M('oxytocin', "Which hormone makes the uterus muscles contract during labour?",
      "Oxytocin", ["Progesterone", "Insulin", "Testosterone"], "Oxytocin is released from the pituitary gland."),
    M('pituitary', "Where is oxytocin released from?",
      "The pituitary gland", ["The ovaries", "The placenta", "The pancreas"], "The pituitary gland is at the base of the brain."),
    M('cervix', "What happens to the cervix during labour?",
      "It widens (dilates)", ["It contracts to push the baby out", "It closes", "It is removed"], "The uterus muscles push; the cervix widens to let the baby through."),
    M('order', "Which is the correct order of events in birth?",
      "Contractions start, amniotic sac breaks, cervix dilates, baby is born, placenta comes out", ["Placenta comes out, cervix dilates, contractions start, baby is born, amniotic sac breaks", "Baby is born, contractions start, cervix dilates, amniotic sac breaks, placenta comes out", "Cervix dilates, baby is born, contractions start, placenta comes out, amniotic sac breaks"],
      "The placenta comes out last, as the afterbirth."),
    M('afterbirth', "What is the afterbirth?",
      "The placenta, pushed out after the baby", ["The amniotic fluid that comes out first", "The baby's first milk", "The umbilical cord only"], "The cord is tied and cut before this."),
    M('oxytocin milk', "Other than contractions in labour, what else does oxytocin do?",
      "Makes milk flow from the breasts when the baby feeds", ["Makes the ovaries release a new egg straight after the birth", "Raises blood glucose", "Stops the heart"],
      "It also helps the mother and baby bond."),
    M('antibodies', "Why does breast milk protect a baby from infections?",
      "It contains antibodies from the mother", ["It contains antibiotics made by the mother's breast tissue", "It contains memory cells that stay for life", "It is always cold"],
      "This gives the baby natural passive immunity."),
    S('advantages', "Which of these are advantages of breastfeeding?", ["Right balance of nutrients", "Free and sterile", "Helps bonding"], ["Gives the baby active immunity", "Makes the baby grow teeth sooner"],
      "Antibodies in milk give passive, not active, immunity."),
    M('later health', "Breastfeeding is linked to a lower risk of which conditions later in life?",
      "Obesity, diabetes and allergies", ["Colour blindness and haemophilia", "Broken bones", "Short-sightedness"], "Inherited conditions are not affected."),
    M('temperature', "Why is breast milk at a good temperature for the baby?",
      "It comes straight from the mother's body", ["It is heated by the placenta", "It is stored in a fridge", "It cools in the air first"], "No heating is needed."),
    M('common errors', "A student writes: 'Breast milk is healthier.' Why is this not enough?",
      "It needs a reason, such as antibodies or the right balance of nutrients", ["Breast milk is never healthier than formula milk from a shop", "It should say the milk is white", "It must name the hormone"],
      "Give a specific advantage."),
    F("stem asked about hormone levels but two options were not hormone changes; stem and options reworded", M('common errors', "Which of these does NOT happen during birth?",
      "A rise in progesterone", ["A rise in oxytocin", "Stronger contractions of the uterus", "Widening of the cervix"], "Progesterone falls before birth; oxytocin rises.")),
    M('common errors', "A student gives 'contains antibodies' and 'protects from disease' as two advantages. Why might only one mark be given?",
      "They are the same idea", ["Neither is an advantage of breast milk", "Antibodies are not in milk", "Only nutrients count"], "Give two different advantages.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-SEQUENCE-FERTILISATION-AND-EARLY-EMBRYO */
  T('HBI-SEQUENCE-FERTILISATION-AND-EARLY-EMBRYO', 'Describe fertilisation and early embryo development, including twins', [
    M('ovulation', "What is ovulation?",
      "The release of an egg from the ovary", ["The fusion of a sperm nucleus with an egg nucleus", "The embryo sinking into the uterus lining", "The birth of a baby"],
      "Fertilisation is the fusion of nuclei."),
    M('fertilisation', "What is fertilisation?",
      "The fusion of a sperm nucleus with an egg nucleus", ["The release of an egg from the ovary into the oviduct", "The embryo attaching to the uterus wall", "The division of the zygote"],
      "Fertilisation is also called conception."),
    M('zygote', "What is formed at fertilisation?",
      "A zygote", ["An embryo", "A baby", "A placenta"], "The zygote then divides to form an embryo."),
    M('diploid', "Is a zygote haploid or diploid?",
      "Diploid", ["Haploid", "Neither", "Both"], "It has one set of chromosomes from each parent, so two sets."),
    M('where', "Where does fertilisation normally happen?",
      "In the oviduct", ["In the uterus", "In the ovary", "In the vagina"], "The zygote then moves down to the uterus."),
    M('mitosis', "How does the zygote divide to form a ball of cells?",
      "By mitosis", ["By meiosis", "By fertilisation", "By osmosis"], "Mitosis gives genetically identical cells."),
    M('identical cells', "Why are the cells of the early embryo genetically identical?",
      "They are all made by mitosis from one zygote", ["They are all made by meiosis, which mixes the genes in the same way each time", "They all come from different sperm", "They have no DNA"],
      "Mitosis copies the DNA exactly."),
    M('blastocyst', "What is the hollow ball of cells formed by about day five called?",
      "A blastocyst", ["A zygote", "A fetus", "A gamete"], "It then implants in the uterus lining."),
    { skill: 'cell numbers', gen: function () {
      var n = rint(2, 6);
      return nq("A zygote divides by mitosis. Each new cell divides again, and so on. How many cells are there after " + n + " rounds of division?", Math.pow(2, n), 'cells',
        "The number doubles each time: 2 to the power " + n + " = " + Math.pow(2, n) + " cells.");
    } },
    M('mitosis steps', "Which describes what happens to the chromosomes when a cell of the embryo divides?",
      "They are copied, line up across the middle, and the copies are pulled to opposite ends", ["They pair up and swap sections, then half the chromosomes go into each new cell", "They are destroyed and remade", "They leave the nucleus and go to the placenta"],
      "Describe what the chromosomes do, not just the names of the stages."),
    M('identical twins', "How do identical twins form?",
      "One zygote or early embryo splits into two, and each part grows into a baby", ["Two eggs are each fertilised by a different sperm at the same time", "One egg is fertilised by two sperm", "Two embryos join together"],
      "Two eggs and two sperm give non-identical twins."),
    M('same genes', "Why do identical twins have the same genes?",
      "They come from the same egg and the same sperm", ["They grew in the same uterus at the same time", "They eat the same food", "They have the same birthday"], "Sharing a uterus does not give the same genes."),
    M('common errors', "A student writes: 'Fertilisation makes an embryo.' What is correct?",
      "Fertilisation makes a zygote", ["Fertilisation makes a baby", "Fertilisation makes a gamete", "Fertilisation makes a placenta"], "The zygote divides to form the embryo."),
    M('common errors', "A student describes conception as the embryo attaching to the uterus wall. What is that called?",
      "Implantation", ["Ovulation", "Fertilisation", "Menstruation"], "Conception is fertilisation.")
  ], { date: '2026-10-13', dropped: [] });
})();
