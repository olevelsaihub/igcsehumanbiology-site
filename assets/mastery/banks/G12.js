/* Group G12 mastery bank: Reproduction and development (A-Grade Block 12).
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


  /* ====================================================================== HBI-STATE-REPRODUCTIVE-HORMONE-ROLE */
  T('HBI-STATE-REPRODUCTIVE-HORMONE-ROLE', 'State the role of a named reproductive hormone', [
    M('FSH', "What does FSH do?",
      "It makes a follicle containing an egg mature in the ovary", ["It triggers the release of the egg from the ovary at ovulation", "It keeps the uterus lining thick throughout pregnancy", "It causes the male secondary sexual characteristics to develop"],
      "FSH (follicle stimulating hormone) matures a follicle and makes the ovary release oestrogen."),
    M('LH', "Which hormone triggers ovulation?",
      "LH", ["FSH", "Oestrogen", "Progesterone"], "A surge of LH causes the ovary to release an egg."),
    M('oestrogen', "What does oestrogen do after menstruation?",
      "It repairs and thickens the uterus lining", ["It causes the lining to break down and be shed", "It triggers the release of the egg from the ovary", "It makes sperm in the testes"], "Oestrogen rebuilds the lining."),
    M('progesterone', "Which hormone keeps the uterus lining thick during pregnancy?",
      "Progesterone", ["Oestrogen", "FSH", "Testosterone"], "Progesterone from the corpus luteum, and later the placenta, maintains the lining."),
    M('testosterone', "Where is testosterone made, and what does it do?",
      "In the testes; it causes male sexual characteristics to develop", ["In the ovaries; it causes ovulation each month", "In the pituitary; it makes follicles mature", "In the uterus; it keeps the lining thick"],
      "Testosterone is the main male sex hormone."),
    M('source', "Where are FSH and LH made?",
      "The pituitary gland", ["The ovaries", "The uterus", "The testes"], "Both are made by the pituitary gland."),
    M('source', "Which structure makes progesterone after ovulation?",
      "The corpus luteum", ["The pituitary gland", "The oviduct", "The cervix"], "The corpus luteum forms from the follicle after it releases the egg."),
    M('LH after ovulation', "After ovulation, what else does LH do?",
      "It keeps the corpus luteum working so it makes progesterone", ["It makes the uterus lining break down and be shed", "It makes a new follicle mature straight away", "It stops the pituitary gland from working"],
      "LH supports the corpus luteum."),
    M('missing hormone', "A woman has no LH surge in a cycle. What is the effect?",
      "No egg is released (no ovulation)", ["The uterus lining is shed early", "Two eggs are released at once", "The follicle never starts to mature"], "Without the LH surge, ovulation does not happen."),
    M('falling progesterone', "What happens when the level of progesterone falls at the end of a cycle?",
      "The uterus lining breaks down (menstruation)", ["The uterus lining becomes even thicker", "An egg is released at once", "The corpus luteum grows larger"], "Without progesterone the lining cannot be kept."),
    M('terms', "What is ovulation?",
      "The release of an egg from an ovary", ["The shedding of the uterus lining", "The joining of a sperm and an egg", "The implanting of an embryo"], "Shedding of the lining is menstruation."),
    M('common errors', "A student writes: 'FSH causes ovulation.' What is correct?",
      "LH causes ovulation; FSH makes a follicle mature", ["Oestrogen causes ovulation; FSH keeps the lining thick", "Progesterone causes ovulation; FSH repairs the lining", "Testosterone causes ovulation; FSH releases the egg"], "Learn FSH → follicle, LH → release.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-MATCH-REPRODUCTIVE-ORGAN-TO-ROLE */
  T('HBI-MATCH-REPRODUCTIVE-ORGAN-TO-ROLE', 'Identify reproductive organs from their roles or positions', [
    M('male', "Which organ makes sperm?",
      "Testis", ["Prostate gland", "Epididymis", "Sperm duct"], "Sperm are made by meiosis in the testes."),
    M('male', "Where are sperm stored before they leave the body?",
      "Epididymis", ["Testis", "Prostate gland", "Bladder"], "The epididymis stores sperm."),
    M('male', "Which tube carries sperm from the testis to the urethra?",
      "Sperm duct (vas deferens)", ["Ureter", "Oviduct", "Epididymis"], "The sperm duct joins the urethra."),
    M('male', "Which tube carries both urine and semen out of the body?",
      "Urethra", ["Ureter", "Sperm duct", "Oviduct"], "The urethra runs through the penis."),
    M('semen', "Which structures add the fluid part of semen?",
      "The seminal vesicles and the prostate gland", ["The testes and the epididymis only", "The bladder and the kidneys", "The ureters and the urethra"], "This fluid helps sperm to swim."),
    M('female', "Where does fertilisation usually happen?",
      "In the oviduct", ["In the uterus", "In the vagina", "In the ovary"], "The egg meets sperm in the oviduct (fallopian tube)."),
    M('female', "Where does the embryo implant?",
      "In the uterus lining", ["In the oviduct", "In the cervix", "In the ovary"], "The embryo sinks into the thick uterus lining."),
    M('female', "Where are sperm deposited during intercourse?",
      "In the vagina", ["In the uterus", "In the cervix", "In the oviduct"], "Sperm then swim through the cervix and uterus to the oviduct."),
    M('cervix', "What is the cervix?",
      "The ring of muscle at the neck of the uterus, which widens during birth", ["The tube that carries an egg from the ovary to the uterus", "The organ that makes and releases eggs each month", "The muscle that pushes urine out of the bladder"],
      "The cervix dilates during labour."),
    M('mixed table', "In a table that mixes organs and hormones, which hormone makes the uterus muscle contract at birth?",
      "Oxytocin", ["Progesterone", "FSH", "Testosterone"], "Oxytocin causes contractions. The uterus is the organ, not the hormone."),
    M('vasectomy', "After a vasectomy, where are haploid cells still made?",
      "In the testes", ["In the prostate gland", "In the seminal vesicles", "In the bladder"], "Sperm are still made; they just cannot leave through the cut ducts."),
    M('common errors', "A student writes that the tube carrying urine and sperm is the 'ureter'. What is correct?",
      "Urethra; the ureter carries urine from a kidney to the bladder", ["Oviduct; the ureter carries eggs to the uterus", "Sperm duct; the ureter carries semen out of the body", "Epididymis; the ureter stores the sperm"], "Ureter: kidney to bladder. Urethra: bladder to outside.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-COUNT-HAPLOID-DIPLOID-CHROMOSOMES */
  T('HBI-COUNT-HAPLOID-DIPLOID-CHROMOSOMES', 'Compare haploid and diploid cells and explain why meiosis matters', [
    M('numbers', "How many chromosomes are in a human body cell?",
      "46, in 23 pairs", ["23, in 23 pairs", "23 single chromosomes", "92, in 46 pairs"], "Body cells are diploid."),
    M('numbers', "How many chromosomes are in a human sperm cell?",
      "23 single chromosomes", ["23 pairs of chromosomes", "46 single chromosomes", "46 pairs of chromosomes"], "Gametes are haploid: one of each pair."),
    { skill: 'DNA mass', gen: function () {
      var body = pick([6.0, 6.2, 6.4, 6.6, 6.8, 7.0]), g = body / 2;
      return nq("The nucleus of a human body cell contains " + body.toFixed(1) + " arbitrary units of DNA. How much DNA is in the nucleus of an egg cell?", g, 'arbitrary units',
        "An egg is haploid, so it has half the DNA of a body cell: " + body.toFixed(1) + " ÷ 2 = " + g.toFixed(1) + ".", { display: g.toFixed(1), tol: 0.02 });
    } },
    M('homologous', "What are homologous chromosomes?",
      "A matching pair with the same size, shape and genes in the same places", ["Two chromosomes from the same parent with different genes", "Any two chromosomes that touch in the nucleus", "The two sex chromosomes in a female cell only"],
      "One of each pair comes from each parent."),
    M('mitosis vs meiosis', "Which statement compares the cells made by mitosis and meiosis correctly?",
      "Mitosis: 2 identical diploid cells. Meiosis: 4 varied haploid cells", ["Mitosis: 4 varied haploid cells. Meiosis: 2 identical diploid cells", "Both make 2 identical diploid cells", "Both make 4 varied haploid cells"],
      "Give both sides of each difference."),
    M('why halve', "Why is it important that meiosis halves the chromosome number?",
      "So that fertilisation restores 46, instead of doubling each generation", ["So that the gametes can divide by mitosis after they are made", "So that each gamete has two alleles of every gene", "So that the zygote has 23 chromosomes"],
      "Haploid + haploid = diploid."),
    M('variation', "Why is the variation made by meiosis useful?",
      "Some offspring may survive if the environment changes", ["All offspring are identical, so none are weak", "It stops mutations from ever happening", "It means only one parent is needed"], "Variation helps a species survive change."),
    M('karyotype', "A karyotype shows pair 23 as X and Y. What does this show?",
      "The person is male", ["The person is female", "The person has Down's syndrome", "The cell is a gamete"], "XX is female; XY is male."),
    M('Down syndrome', "A karyotype shows three copies of chromosome 21. How many chromosomes are there in total?",
      "47", ["46", "45", "69"], "One extra chromosome: 47 in total. This is Down's syndrome."),
    M('not human', "A diagram of a body cell shows only 2 pairs of chromosomes. How do you know it is not a human cell?",
      "A human body cell has 23 pairs", ["A human cell has no pairs", "A human cell has 2 pairs only in the gametes", "Human chromosomes are never drawn in pairs"], "Human body cells have 46 chromosomes in 23 pairs."),
    M('alleles', "How many alleles of each gene does a zygote have?",
      "Two, one from each parent", ["One, from the mother only", "Four, from both grandparents", "None until it divides"], "Each gamete carries one allele; fertilisation brings two together."),
    M('common errors', "A student writes: 'A gamete has 23 pairs of chromosomes.' What is correct?",
      "A gamete has 23 single chromosomes", ["A gamete has 46 pairs of chromosomes", "A gamete has 46 single chromosomes", "A gamete has no chromosomes"], "Gametes have one chromosome from each pair.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-CONTRACEPTION-METHODS-AND-ACTION */
  T('HBI-CONTRACEPTION-METHODS-AND-ACTION', 'Name contraceptive methods, explain how they work and compare them', [
    M('barrier', "How do barrier methods such as condoms work?",
      "They stop sperm reaching the egg", ["They stop the ovaries releasing eggs", "They stop the embryo implanting", "They kill the egg in the oviduct"], "Condoms, femidoms, diaphragms and caps are barriers."),
    M('barrier', "Which is an example of a barrier method?",
      "Diaphragm", ["Combined pill", "Rhythm method", "Vasectomy"], "The pill is hormonal; the rhythm method is natural; vasectomy is surgical."),
    M('infection', "Which method also protects against sexually transmitted infections such as HIV?",
      "Condom", ["Contraceptive pill", "IUD (coil)", "Vasectomy"], "Only barriers such as condoms stop the spread of infections."),
    M('hormonal', "How does the combined contraceptive pill work?",
      "Its hormones stop ovulation", ["It forms a barrier that stops sperm", "It kills sperm in the vagina", "It cuts the oviducts"], "It contains oestrogen and progesterone, which stop eggs being released."),
    M('IUD', "How does an IUD (coil) prevent pregnancy?",
      "It stops an embryo implanting in the uterus", ["It stops the testes from making any more sperm", "It stops the pituitary making FSH", "It blocks the urethra"], "Some types also stop sperm."),
    M('natural', "Why is the rhythm method the least reliable?",
      "The time of ovulation can vary, so sex may happen when an egg is present", ["It uses hormones that often stop working after a few months", "It needs an operation that can be undone by the body", "It blocks only half of the sperm that are released"],
      "Natural methods avoid sex around ovulation, which is hard to predict."),
    M('vasectomy', "What does a vasectomy do?",
      "It cuts the sperm ducts, so sperm cannot leave in the semen", ["It removes the testes, so that no sex hormones are made at all", "It removes the prostate, so no semen is made", "It blocks the urethra, so no urine can leave"],
      "Semen is still made by the prostate and seminal vesicles."),
    M('vasectomy and HIV', "Why can a man with HIV still pass it on after a vasectomy?",
      "Semen is still made by the prostate and seminal vesicles and can carry HIV", ["The vasectomy makes the virus multiply much faster inside the testes and ducts", "The sperm duct grows back within a day of the operation", "A vasectomy stops the man making antibodies"],
      "A vasectomy stops sperm, not the fluid."),
    M('pill routine', "Why is the pill usually stopped for 7 days after 21 days?",
      "So that a bleed like a period happens", ["So that an egg can be released safely", "So that the body can make more pills", "So that the uterus lining becomes thicker"], "Protection continues if the pill is taken correctly."),
    M('compare', "Which is a disadvantage of the pill compared with condoms?",
      "It must be taken every day and does not stop infections", ["It is less reliable than the rhythm method in almost every study", "It must be fitted by a surgeon each month", "It always causes permanent infertility"],
      "The pill is reliable but needs daily use and gives no protection from infections."),
    M('sterilisation', "Which is a disadvantage of sterilisation?",
      "It needs an operation and usually cannot be undone", ["It fails more often than any other method of birth control", "It must be repeated every month", "It protects against all infections"], "It is the most reliable method but usually permanent."),
    { skill: 'compare data', gen: function () {
      var a = rint(1, 3), b = rint(12, 24);
      return mq("In one year, " + a + " in every 100 couples using method P have a pregnancy, and " + b + " in every 100 couples using method Q. Which conclusion is correct?",
        "Method P is more reliable, because fewer couples using it had a pregnancy",
        ["Method Q is more reliable, because more couples using it had a pregnancy", "Both methods are equally reliable, because both had some pregnancies", "Method P must be a natural method, because it worked better"],
        "Fewer pregnancies per 100 couples (" + a + " compared with " + b + ") means P is more reliable. You cannot tell the type of method from this data alone.");
    } }
  ], { date: '2026-10-13', dropped: [] });
})();
