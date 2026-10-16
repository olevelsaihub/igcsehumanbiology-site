/* Group G13 mastery bank: Inheritance and genetic diagrams (A-Grade Block 13).
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


  // ---------- genetics helpers ----------
  var PL = ['0 (0%)', '1/4 (25%)', '1/2 (50%)', '3/4 (75%)', '1 (100%)'];
  function gtype(a, b) { return [a, b].sort().join(''); }                       // 'A' sorts before 'a'
  function cross(p1, p2) { var o = []; p1.split('').forEach(function (x) { p2.split('').forEach(function (y) { o.push(gtype(x, y)); }); }); return o; }
  function sup(g) { return g.replace(/I(A|B|O)/g, 'I<sup>$1</sup>').replace(/X(H|h)/g, 'X<sup>$1</sup>'); }
  function abo(g) { var s = g.split(','); var has = function (a) { return s.indexOf(a) >= 0; }; return has('A') && has('B') ? 'AB' : has('A') ? 'A' : has('B') ? 'B' : 'O'; }
  function aboCross(p1, p2) { var o = []; p1.forEach(function (x) { p2.forEach(function (y) { o.push([x, y].sort().join(',')); }); }); return o; }
  function aboName(g) { return g.map(function (a) { return 'I<sup>' + a + '</sup>'; }).join(' '); }

  // ---------- pedigree drawings ----------
  function pedigree(people, couples, kids, label) {
    var g = '', S = 30, R = 15;
    couples.forEach(function (c) { var a = people[c[0]], b = people[c[1]]; g += '<line x1="' + a.x + '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y + '" stroke="' + INK + '" stroke-width="2"/>'; });
    kids.forEach(function (k) {
      var a = people[k[0][0]], b = people[k[0][1]], mx = (a.x + b.x) / 2, my = a.y, ty = my + 50, xs = k[1].map(function (i) { return people[i].x; });
      g += '<line x1="' + mx + '" y1="' + my + '" x2="' + mx + '" y2="' + ty + '" stroke="' + INK + '" stroke-width="2"/>';
      g += '<line x1="' + Math.min.apply(null, xs.concat([mx])) + '" y1="' + ty + '" x2="' + Math.max.apply(null, xs.concat([mx])) + '" y2="' + ty + '" stroke="' + INK + '" stroke-width="2"/>';
      k[1].forEach(function (i) { g += '<line x1="' + people[i].x + '" y1="' + ty + '" x2="' + people[i].x + '" y2="' + (people[i].y - R) + '" stroke="' + INK + '" stroke-width="2"/>'; });
    });
    Object.keys(people).forEach(function (id) {
      var p = people[id], f = p.aff ? INK : '#fff';
      g += p.sex === 'm' ? '<rect x="' + (p.x - R) + '" y="' + (p.y - R) + '" width="' + S + '" height="' + S + '" fill="' + f + '" stroke="' + INK + '" stroke-width="2"/>' : '<circle cx="' + p.x + '" cy="' + p.y + '" r="' + R + '" fill="' + f + '" stroke="' + INK + '" stroke-width="2"/>';
      g += '<text x="' + p.x + '" y="' + (p.y + 36) + '" font-size="15" font-weight="700" text-anchor="middle" fill="' + INK + '">' + id + '</text>';
    });
    g += '<rect x="400" y="20" width="18" height="18" fill="#fff" stroke="' + INK + '" stroke-width="2"/><text x="426" y="34" font-size="13" fill="' + INK + '">unaffected male</text>' +
      '<rect x="400" y="46" width="18" height="18" fill="' + INK + '" stroke="' + INK + '" stroke-width="2"/><text x="426" y="60" font-size="13" fill="' + INK + '">affected male</text>' +
      '<circle cx="409" cy="81" r="9" fill="#fff" stroke="' + INK + '" stroke-width="2"/><text x="426" y="86" font-size="13" fill="' + INK + '">unaffected female</text>' +
      '<circle cx="409" cy="107" r="9" fill="' + INK + '" stroke="' + INK + '" stroke-width="2"/><text x="426" y="112" font-size="13" fill="' + INK + '">affected female</text>';
    return '<svg class="mc-svg" viewBox="0 0 560 300" role="img" aria-label="' + label + '">' + g + '</svg>';
  }
  // Pedigree A: autosomal recessive. 1 x 2 unaffected; children 3 (affected male), 4 (male), 5 (female). 5 x 6; children 7 (affected female), 8 (male).
  var PEDA = pedigree({ 1: { sex: 'm', x: 120, y: 40 }, 2: { sex: 'f', x: 220, y: 40 }, 3: { sex: 'm', x: 60, y: 150, aff: 1 }, 4: { sex: 'm', x: 150, y: 150 }, 5: { sex: 'f', x: 240, y: 150 },
    6: { sex: 'm', x: 340, y: 150 }, 7: { sex: 'f', x: 250, y: 255, aff: 1 }, 8: { sex: 'm', x: 330, y: 255 } }, [[1, 2], [5, 6]], [[[1, 2], [3, 4, 5]], [[5, 6], [7, 8]]],
    'Family pedigree with eight people numbered 1 to 8; person 3 and person 7 are affected');
  // Pedigree B: X-linked recessive (haemophilia). 1 x 2 unaffected; children 3 (affected male), 4 (male), 5 (female). 5 x 6; children 7 (affected male), 8 (female).
  var PEDB = pedigree({ 1: { sex: 'm', x: 120, y: 40 }, 2: { sex: 'f', x: 220, y: 40 }, 3: { sex: 'm', x: 60, y: 150, aff: 1 }, 4: { sex: 'm', x: 150, y: 150 }, 5: { sex: 'f', x: 240, y: 150 },
    6: { sex: 'm', x: 340, y: 150 }, 7: { sex: 'm', x: 250, y: 255, aff: 1 }, 8: { sex: 'f', x: 330, y: 255 } }, [[1, 2], [5, 6]], [[[1, 2], [3, 4, 5]], [[5, 6], [7, 8]]],
    'Family pedigree for haemophilia with eight people numbered 1 to 8; person 3 and person 7 are affected males');

  /* ====================================================================== HBI-DEFINE-GENETIC-TERMS */
  T('HBI-DEFINE-GENETIC-TERMS', 'Use genetic terms: alleles, genotypes, carriers and blood-group genotypes', [
    M('allele', "What is an allele?",
      "A different version of the same gene", ["A chromosome that controls a characteristic", "A pair of chromosomes in the nucleus", "The characteristic that can be seen"], "Alleles are alternative forms of one gene."),
    M('dominant', "What is a dominant allele?",
      "An allele that shows its effect even when only one copy is present", ["An allele that only shows its effect when two copies of it are present together", "An allele that is stronger and destroys the other allele", "An allele that is found only on the X chromosome"],
      "A recessive allele needs two copies to show."),
    M('recessive', "Why does a recessive allele not show in a heterozygous person?",
      "The dominant allele masks it", ["The recessive allele is destroyed", "The recessive allele is weaker and dies", "The recessive allele is on the Y chromosome"], "It is hidden, not lost, and can be passed on."),
    M('zygosity', "Which genotype is heterozygous?",
      "Pp", ["PP", "pp", "P"], "Heterozygous means two different alleles."),
    M('genotype vs phenotype', "Which pair shows a genotype and then a phenotype?",
      "Pp, and has extra fingers", ["Has extra fingers, and Pp", "Blood group B, and blood group O", "PP, and pp"], "Genotype = alleles; phenotype = the characteristic you can see or measure."),
    M('codominance', "What does co-dominant mean?",
      "Both alleles are fully expressed together in the phenotype", ["Both alleles are dominant, so neither of them has any effect on the person", "One allele is dominant and the other is hidden", "The alleles blend to make a halfway phenotype"],
      "Blood group AB is the example: both I<sup>A</sup> and I<sup>B</sup> show."),
    M('blood group genotypes', "Which genotypes give blood group A?",
      "I<sup>A</sup> I<sup>A</sup> or I<sup>A</sup> I<sup>O</sup>", ["I<sup>A</sup> I<sup>A</sup> only", "I<sup>A</sup> I<sup>B</sup> or I<sup>A</sup> I<sup>O</sup>", "I<sup>O</sup> I<sup>O</sup> only"],
      "I<sup>O</sup> is recessive, so I<sup>A</sup> I<sup>O</sup> is also group A."),
    M('blood group genotypes', "Which is the only genotype for blood group O?",
      "I<sup>O</sup> I<sup>O</sup>", ["I<sup>A</sup> I<sup>O</sup>", "I<sup>B</sup> I<sup>O</sup>", "I<sup>A</sup> I<sup>B</sup>"], "Group O needs two recessive alleles."),
    M('carrier', "What is a carrier of a recessive condition?",
      "A heterozygous person with no symptoms who can pass the allele on", ["A person with two faulty alleles who has the condition", "A person with a mild form of the condition", "A person who catches the condition from someone else"],
      "One dominant allele masks the faulty one."),
    M('carriers', "Two parents without cystic fibrosis have a child with it. How is this possible?",
      "Both parents are carriers and each passed on a recessive allele", ["One parent caught the condition from the other parent", "The child made the faulty allele during birth", "Only the father passed on an allele to the child"],
      "The child is homozygous recessive, with one allele from each parent."),
    M('gene', "What is a gene?",
      "A section of DNA that controls a characteristic", ["A protein that carries oxygen around the body in red cells", "A whole chromosome pair", "A cell that makes gametes"], "Genes are sections of DNA."),
    M('common errors', "A student writes: 'Pp is homozygous.' What is correct?",
      "Pp is heterozygous; PP and pp are homozygous", ["Pp is homozygous dominant, because P is the dominant allele", "Pp is homozygous recessive", "Pp is co-dominant"], "Homozygous means the two alleles are the same.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-DEFINE-MUTATION-AND-CAUSES */
  T('HBI-DEFINE-MUTATION-AND-CAUSES', 'Define a gene mutation and name its causes', [
    M('definition', "What is a mutation?",
      "A change in the sequence of bases in DNA", ["A change in the shape of a cell and its nucleus", "A disease caused by a pathogen", "A change in the amino acids in DNA"], "DNA contains bases, not amino acids."),
    M('gene mutation', "What can a gene mutation produce?",
      "A new allele of that gene", ["A new chromosome pair", "A new organ", "A new cell membrane"], "Changing the base sequence of a gene can make a new allele."),
    M('types', "One base in a gene is swapped for a different base. What type of mutation is this?",
      "Substitution", ["Deletion", "Insertion", "Duplication of a chromosome"], "Deletion loses a base; insertion adds a base."),
    M('types', "One base is lost from a gene. What type of mutation is this?",
      "Deletion", ["Substitution", "Insertion", "Translation"], "A base is deleted, so the triplets after it can all change."),
    M('chance', "When can a mutation happen by chance?",
      "When DNA is copied before a cell divides", ["Only when a person eats too much protein", "Only when a cell dies", "Only during digestion"], "Copying errors happen at random."),
    S('mutagens', "Which of these are mutagens that increase the rate of mutation?", ["Ultraviolet light", "X-rays", "Chemicals in tobacco smoke"], ["Vitamin C", "Visible light from a lamp"],
      "Ionising radiation, UV light and some chemicals are mutagens."),
    M('skin', "Why are skin cells likely to develop mutations that lead to cancer?",
      "They divide often and are exposed to UV light from the Sun", ["They are on the outside, so they get hit by bacteria", "They do not contain any DNA", "They never divide, so they cannot repair DNA"],
      "Frequent division plus UV exposure raises the chance of mutation."),
    M('effect', "Does every mutation cause harm?",
      "No; many have no effect, and a few can be useful", ["Yes; every mutation causes a disease", "Yes; every mutation kills the cell", "No; mutations never change anything"], "Many mutations have no effect on the protein."),
    M('radiation', "Which type of radiation is a mutagen?",
      "Ionising radiation, such as gamma rays", ["Heat from a radiator or a warm room", "Sound waves", "Radio waves from a phone mast"], "Name the type: ionising radiation, X-rays, gamma rays or UV."),
    M('cancer', "How can a mutation lead to cancer?",
      "It can cause cells to divide in an uncontrolled way", ["It makes cells stop dividing for ever", "It makes cells change into bacteria", "It makes cells absorb more oxygen"], "Uncontrolled division forms a tumour."),
    M('common errors', "A student writes: 'A mutation changes the amino acids in DNA.' What is correct?",
      "A mutation changes the bases in DNA", ["A mutation changes the glucose in DNA", "A mutation changes the fats in DNA", "A mutation changes the cell wall"], "DNA is made of bases."),
    M('common errors', "A student gives 'radiation' as a cause of mutation. How can the answer be improved?",
      "Name the type, such as ultraviolet light or X-rays", ["Write 'heat' instead, because heat is a kind of radiation", "Write 'sound' instead", "Leave it as 'radiation'"], "Give a named type of radiation.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-EXPLAIN-MUTATION-TO-PHENOTYPE */
  T('HBI-EXPLAIN-MUTATION-TO-PHENOTYPE', 'Explain how a mutation changes a protein and phenotype', [
    M('chain', "Which chain shows how a mutation can change a phenotype?",
      "Bases change, amino acids change, protein shape changes, protein does not work", ["Amino acids in DNA change, so the gene is destroyed and the person has the disease", "The cell changes shape, the chromosome breaks, the person has the disease", "Base sequence changes, the cell dies, a new organ grows"],
      "Each link matters: bases → amino acids → protein shape → function → phenotype."),
    M('codons', "How many bases code for one amino acid?",
      "Three", ["One", "Two", "Four"], "Three bases (a triplet or codon) code for one amino acid."),
    M('stop', "A mutation changes a codon into a stop signal. What is the likely result?",
      "The protein is not made in full, so it does not work", ["The protein is made twice as long, so it works twice as well", "The protein becomes a carbohydrate", "The protein works better than before"], "A stop codon ends the amino acid chain early."),
    M('shape', "Why can a change in one amino acid stop a protein working?",
      "The protein folds into a different shape", ["The protein turns into DNA inside the nucleus", "The protein moves into the nucleus", "The protein becomes a hormone"], "Shape decides function."),
    M('enzyme', "A mutation changes the active site of an enzyme. What is the effect?",
      "The substrate no longer fits, so enzyme-substrate complexes do not form", ["The substrate fits better, so the reaction goes much faster than before", "The enzyme becomes a substrate and is broken down", "The enzyme leaves the cell and enters the blood"],
      "A changed active site no longer matches its substrate."),
    M('white forelock', "A white forelock is caused by a mutation in a gene for a pigment enzyme. Why is the hair white?",
      "The enzyme does not work, so less melanin is made", ["The hair cells have no DNA, so they cannot make colour", "The enzyme makes extra melanin", "The hair falls out and regrows white"], "No working enzyme means little pigment."),
    M('no effect', "Why do some changes to a gene leave the phenotype the same?",
      "The new triplet codes for the same amino acid, or the protein still works", ["The mutation is always repaired before the cell divides, so it is never copied", "The mutation changes amino acids directly", "The mutation only affects the cell membrane"],
      "The genetic code has several triplets for most amino acids."),
    M('sickle cell', "In sickle cell anaemia, a mutation changes one amino acid in haemoglobin. What is the result?",
      "The haemoglobin has a different shape, so red cells become sickle-shaped", ["The red cells gain a nucleus and divide, so there are too many of them in the blood", "The red cells become larger and carry more oxygen", "The plasma turns into haemoglobin"],
      "A changed protein leads to a changed phenotype."),
    M('mRNA', "How does a mutation change the mRNA made from a gene?",
      "The mRNA codons change, because they copy the changed base sequence", ["The mRNA is not changed, because it is made in the cytoplasm", "The mRNA becomes DNA", "The mRNA loses all its bases"],
      "mRNA copies the gene's base sequence."),
    M('free radicals', "Free radicals made in cell reactions can damage DNA. What might this lead to?",
      "Gene mutations, wrongly shaped proteins and possibly cancer", ["Faster digestion and stronger bones", "More red blood cells and better vision", "No change, because DNA cannot be damaged"],
      "DNA damage can cause mutations."),
    M('common errors', "A student writes: 'The mutation destroys the gene.' What is more accurate?",
      "The base sequence of the gene is changed", ["The gene is turned into a protein and lost", "The chromosome disappears", "The nucleus is destroyed"], "The gene is altered, not destroyed."),
    M('common errors', "A student writes: 'DNA changes, so the person has sickle cell anaemia.' What step is missing?",
      "The change in the amino acid sequence and shape of haemoglobin", ["The change in the shape of the nucleus of every red blood cell", "The change in blood group", "The change in the number of chromosomes"], "Include the protein step.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-DRAW-MONOHYBRID-GENETIC-DIAGRAM */
  T('HBI-DRAW-MONOHYBRID-GENETIC-DIAGRAM', 'Draw a genetic diagram for a monohybrid or sex-linked cross', [
    M('rows', "Which list gives the rows of a full genetic diagram in order?",
      "Parent genotypes, gametes, offspring genotypes, offspring phenotypes", ["Gametes, parent genotypes, offspring phenotypes, offspring genotypes", "Parent phenotypes, offspring genotypes, gametes", "Offspring phenotypes, parent genotypes, gametes"],
      "Start with the parents, then the gametes, then the offspring."),
    M('gametes', "A parent has the genotype Aa. What gametes does this parent make?",
      "One gamete with A and one gamete with a", ["Two gametes, each with Aa", "One gamete with AA and one gamete with aa", "A single gamete with Aa"], "Each gamete has one allele of the gene."),
    { skill: 'offspring genotypes', gen: function () {
      var pr = pick([['Tt', 'Tt'], ['Tt', 'tt'], ['TT', 'Tt'], ['TT', 'tt']]), o = cross(pr[0], pr[1]);
      var counts = {}; o.forEach(function (g) { counts[g] = (counts[g] || 0) + 1; });
      var right = ['TT', 'Tt', 'tt'].filter(function (g) { return counts[g]; }).map(function (g) { return counts[g] + ' ' + g; }).join(' : ');
      var wrongs = ['1 TT : 2 Tt : 1 tt', '2 Tt : 2 tt', '4 Tt', '2 TT : 2 Tt', '1 TT : 1 Tt : 2 tt', '3 TT : 1 tt'].filter(function (w) { return w !== right; });
      return mq("Two parents with the genotypes " + pr[0] + " and " + pr[1] + " have children. Which shows the expected ratio of offspring genotypes out of four?", right,
        [wrongs[0], wrongs[1], wrongs[2]].filter(function (w) { return w; }),
        "Gametes: " + pr[0].split('').join(' and ') + " × " + pr[1].split('').join(' and ') + ". The four boxes are " + o.join(', ') + ".");
    } },
    M('X-linked symbols', "How should a haemophilia carrier female be written in a genetic diagram?",
      "X<sup>H</sup> X<sup>h</sup>", ["Hh", "X<sup>H</sup> Y", "X<sup>h</sup> Y<sup>H</sup>"], "For sex-linked conditions, write the allele on the X chromosome."),
    M('X-linked symbols', "How should a male with haemophilia be written?",
      "X<sup>h</sup> Y", ["X<sup>H</sup> Y", "hh", "X<sup>h</sup> Y<sup>h</sup>"], "The Y carries no allele for this gene."),
    M('sex determination', "Which gametes does a father make for sex chromosomes?",
      "Half carry X and half carry Y", ["All carry X", "All carry Y", "Each carries both X and Y"], "Every egg carries X; sperm carry X or Y."),
    M('sex-linked phenotypes', "A carrier mother (X<sup>H</sup> X<sup>h</sup>) and an unaffected father (X<sup>H</sup> Y) have children. Which offspring phenotypes are expected?",
      "Unaffected girl, carrier girl, unaffected boy, affected boy", ["Two affected girls and two affected boys", "Two carrier boys and two unaffected girls", "Four unaffected children, none affected"],
      "Daughters get the father's X<sup>H</sup>; sons get the father's Y and one of the mother's X."),
    M('blood group cross', "A parent with genotype I<sup>A</sup> I<sup>O</sup> and a parent with I<sup>B</sup> I<sup>O</sup> have children. Which blood groups are possible?",
      "A, B, AB or O", ["Only A or B", "AB only", "O only"], "The four boxes are I<sup>A</sup>I<sup>B</sup>, I<sup>A</sup>I<sup>O</sup>, I<sup>B</sup>I<sup>O</sup> and I<sup>O</sup>I<sup>O</sup>."),
    M('dominant condition', "Huntington's disease is caused by a dominant allele H. An affected parent (Hh) and an unaffected parent (hh) have children. What is expected?",
      "Half Hh (affected) and half hh (unaffected)", ["All Hh (affected)", "All hh (unaffected)", "One quarter affected and three quarters unaffected"], "Hh × hh gives 2 Hh : 2 hh."),
    M('Punnett square', "What must a Punnett square show around its edges?",
      "The gametes from each parent", ["The phenotypes of the grandparents", "The number of chromosomes", "The blood groups of the children"], "Label the square with the gametes."),
    M('common errors', "A student writes the gametes of a parent Aa as 'Aa'. What is wrong?",
      "Each gamete carries only one allele, so one has A, the other a", ["The gametes should be AA and aa", "The gametes should be written as Aa and aA", "Nothing is wrong"], "Gametes are haploid."),
    M('common errors', "A student draws a haemophilia cross as 'Hh × H'. What is missing?",
      "The X and Y chromosomes, such as X<sup>H</sup> X<sup>h</sup> × X<sup>H</sup> Y", ["A third allele for the father", "The blood group of each parent", "The number of children"], "Sex-linked crosses must show X and Y.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-EXPLAIN-SEX-LINKED-INHERITANCE */
  T('HBI-EXPLAIN-SEX-LINKED-INHERITANCE', 'Explain sex-linked inheritance and why males are affected more', [
    M('sex-linked', "What does sex-linked mean?",
      "The allele is carried on a sex chromosome, usually the X", ["The allele is found only in males and is never passed on", "The allele is carried on every chromosome", "The condition is passed on by sexual contact"],
      "Haemophilia and colour blindness are X-linked."),
    M('males', "Why are males more likely than females to have haemophilia?",
      "Males have only one X, so one recessive allele is enough to show", ["Males have two X chromosomes, so they always get two faulty alleles", "Males have weaker genes than females", "The haemophilia allele is on the Y chromosome"],
      "There is no second X to carry a dominant allele."),
    M('Y chromosome', "Why can the Y chromosome not mask a recessive allele on the X?",
      "The Y is small and has no matching allele for this gene", ["The Y has a stronger dominant allele that always wins out", "The Y is not found in males", "The Y chromosome is destroyed at birth"], "There is nothing on the Y to mask it."),
    M('carriers', "Why can males not be carriers of haemophilia?",
      "With one X, a male with the allele is affected, not just carrying it", ["Males do not have any X chromosomes at all, only two Y chromosomes", "Males always have two dominant alleles", "Males cannot pass on any alleles"], "Carriers need a second, dominant allele to mask the faulty one."),
    M('carrier females', "Why does a carrier female (X<sup>H</sup> X<sup>h</sup>) not have haemophilia?",
      "The dominant allele on her other X masks the faulty one", ["The faulty allele is destroyed in all females before birth", "Females do not make clotting proteins", "Her Y chromosome carries a normal allele"], "She has one working allele."),
    F("pronoun fixed in the correct answer ('She' had no subject)", M('affected females', "Why are females with haemophilia rare?",
      "A girl needs a faulty allele on both X chromosomes, so her father must be affected", ["Females cannot inherit any X chromosomes from their fathers, only from their own mothers", "The allele is only on the Y chromosome", "Females with the allele always become carriers"],
      "X<sup>h</sup> X<sup>h</sup> needs an affected father and a carrier or affected mother.")),
    M('father to son', "Can a father pass an X-linked allele to his son?",
      "No, because he gives his son a Y, not an X", ["Yes, because he gives his son an X", "Yes, but only if the son is a carrier", "No, because sons get no chromosomes from fathers"], "Sons get their X from their mother."),
    M('Y-linked', "A trait is carried on the Y chromosome. Who can show it?",
      "Only males, and it passes from father to son", ["Only females, passed from mother to daughter", "Males and females equally", "Only people with two Y chromosomes"], "Females have no Y chromosome, so only males can show it."),
    M('colour blindness', "Which of these conditions is X-linked recessive?",
      "Red-green colour blindness", ["Cystic fibrosis of the lungs", "Huntington's disease", "Sickle cell anaemia"], "Cystic fibrosis and sickle cell are autosomal; Huntington's is autosomal dominant."),
    M('data', "In a survey, 8 in 100 males and 1 in 200 females have colour blindness. How does this support X-linked inheritance?",
      "Many more males than females are affected", ["The numbers are the same in males and females", "Only females are affected", "The survey shows the allele is on the Y"], "Quote the figures: 8 per 100 males is far more than 1 per 200 females."),
    M('population', "Why are X-linked recessive conditions uncommon in the whole population?",
      "Only a small percentage of people carry the allele, and most affected people are male", ["Every person with the allele is female, and females rarely have children", "The allele is destroyed in every second generation", "The condition can only be passed on by males"],
      "The allele is rare, so few people are affected."),
    M('common errors', "A student writes: 'Males have weaker genes.' What is the correct explanation?",
      "Males have only one X chromosome, so a recessive allele is not masked", ["Males have more genes than females, so more of them can be faulty", "Males have no genes on the X", "Males have two Y chromosomes"], "Explain using the X and Y chromosomes.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-DEDUCE-GENOTYPES-FROM-PEDIGREE */
  T('HBI-DEDUCE-GENOTYPES-FROM-PEDIGREE', 'Deduce genotypes from a pedigree, family or blood group', [
    M('pedigree A', "The pedigree shows a recessive condition. N is the normal allele and n is the faulty allele. What is the genotype of person 3?", "nn", ["NN", "Nn", "Nn or NN"],
      "Person 3 is affected by a recessive condition, so must be homozygous recessive.", { svg: PEDA, family: 'g13-peda' }),
    M('pedigree A', "Using the same pedigree, what is the genotype of person 1?", "Nn", ["NN", "nn", "NN or Nn"],
      "Person 1 is unaffected but has an affected child (3), so person 1 must have passed on an n allele.", { svg: PEDA, family: 'g13-peda' }),
    M('pedigree A', "Using the same pedigree, what is the genotype of person 5?", "Nn", ["NN", "nn", "NN or Nn"],
      "Person 5 is unaffected but her daughter (7) is affected, so person 5 must carry n.", { svg: PEDA, family: 'g13-peda' }),
    M('pedigree A', "Using the same pedigree, what is the probability that person 6 carries the n allele?", "1 (100%)", ["0 (0%)", "1/2 (50%)", "1/4 (25%)"],
      "Person 6 is unaffected but has an affected child (7), so he must be Nn.", { svg: PEDA, family: 'g13-peda' }),
    M('pedigree B', "This pedigree shows haemophilia, an X-linked recessive condition. What is the genotype of person 2?", "X<sup>H</sup> X<sup>h</sup>", ["X<sup>H</sup> X<sup>H</sup>", "X<sup>h</sup> X<sup>h</sup>", "X<sup>H</sup> Y"],
      "Person 2 is unaffected but her son (3) is affected. A son gets his X from his mother, so she is a carrier.", { svg: PEDB, family: 'g13-pedb' }),
    M('pedigree B', "Using the haemophilia pedigree, what is the genotype of person 3?", "X<sup>h</sup> Y", ["X<sup>H</sup> Y", "X<sup>h</sup> X<sup>h</sup>", "hh"],
      "An affected male has the faulty allele on his only X.", { svg: PEDB, family: 'g13-pedb' }),
    M('pedigree B', "Using the haemophilia pedigree, what is the genotype of person 5?", "X<sup>H</sup> X<sup>h</sup>", ["X<sup>H</sup> X<sup>H</sup>", "X<sup>h</sup> X<sup>h</sup>", "X<sup>h</sup> Y"],
      "Person 5 is unaffected but her son (7) is affected, so she must be a carrier.", { svg: PEDB, family: 'g13-pedb' }),
    M('dominant', "In a family with a dominant condition, what is the genotype of every unaffected person?",
      "Homozygous recessive (hh)", ["Heterozygous (Hh)", "Homozygous dominant (HH)", "HH or Hh"], "One dominant allele would cause the condition."),
    M('blood groups', "A child has blood group O. One parent has blood group A. What is that parent's genotype?",
      "I<sup>A</sup> I<sup>O</sup>", ["I<sup>A</sup> I<sup>A</sup>", "I<sup>A</sup> I<sup>B</sup>", "I<sup>O</sup> I<sup>O</sup>"], "The group O child (I<sup>O</sup> I<sup>O</sup>) got an I<sup>O</sup> from each parent."),
    M('blood groups', "Parents with genotypes I<sup>A</sup> I<sup>B</sup> and I<sup>O</sup> I<sup>O</sup> have children. Which blood groups can the children have?",
      "Only A or B", ["Only AB or O", "A, B, AB or O", "O only"], "The children are I<sup>A</sup> I<sup>O</sup> (A) or I<sup>B</sup> I<sup>O</sup> (B)."),
    M('possible genotypes', "A woman has blood group B. Her parents' genotypes are unknown. Which genotypes could she have?",
      "I<sup>B</sup> I<sup>B</sup> or I<sup>B</sup> I<sup>O</sup>", ["I<sup>B</sup> I<sup>B</sup> only", "I<sup>A</sup> I<sup>B</sup> only", "I<sup>B</sup> I<sup>O</sup> only"], "Give both possible genotypes when both are possible."),
    M('common errors', "In a recessive condition, a student writes AA for an unaffected parent of an affected child. What is correct?",
      "Aa, because the parent passed an a allele to the child", ["aa, because the child is affected", "AA, because the parent is unaffected", "Aa or AA, because it cannot be known"], "An affected child must get an a from each parent.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-INFER-INHERITANCE-MODE-FROM-PEDIGREE */
  T('HBI-INFER-INHERITANCE-MODE-FROM-PEDIGREE', 'Build or read a pedigree to decide how a condition is inherited', [
    M('recessive evidence', "In the pedigree, which evidence shows the condition is recessive?", "Persons 1 and 2 are unaffected but their son 3 is affected", ["Person 3 is a male and he is affected", "Person 8 is unaffected and has no children of his own yet", "Person 6 is a male who married into the family"],
      "Two unaffected parents with an affected child must both be carriers.", { svg: PEDA, family: 'g13-peda' }),
    M('not X-linked', "Using the same pedigree, which evidence shows the condition is NOT X-linked?", "Person 7 is an affected daughter, but her father (6) is unaffected", ["Person 3 is an affected son of unaffected parents (persons 1 and 2)", "Person 4 is an unaffected son of unaffected parents", "Person 5 is an unaffected daughter of unaffected parents"],
      "An affected daughter of an X-linked recessive condition must have an affected father.", { svg: PEDA, family: 'g13-peda' }),
    M('symbols', "In a pedigree, what does a shaded square show?",
      "An affected male", ["An affected female", "An unaffected male", "A carrier female"], "Squares are males; shading means affected. Always read the key."),
    M('X-linked evidence', "Which pattern in a pedigree suggests X-linked recessive inheritance?",
      "Many more males are affected, and affected sons have unaffected (carrier) mothers", ["Males and females are affected in equal numbers in every single generation of the family", "Every affected child has an affected father", "An affected father passes the condition to all of his sons"],
      "Carrier mothers pass the allele to sons."),
    M('dominant evidence', "Which evidence suggests a condition is dominant?",
      "Two affected parents have an unaffected child", ["Two unaffected parents have an affected child", "Only males are affected", "The condition skips every generation"], "Both parents must be heterozygous, each passing on a recessive allele."),
    M('father to son', "A condition passes from father to son in every generation and only males are affected. Which inheritance does this fit?",
      "Y-linked", ["X-linked recessive", "Autosomal recessive", "Co-dominant"], "Fathers pass their Y to their sons."),
    M('not sex-linked', "Which observation is NOT enough on its own to show a condition is sex-linked?",
      "One affected male in the family", ["Many more affected males than females", "Affected sons with carrier mothers", "No father-to-son passing of the condition"], "One affected male could happen with any type of inheritance."),
    M('using numbers', "Why should a conclusion about a pedigree name numbered individuals?",
      "It shows the evidence the conclusion is based on", ["It makes the answer longer, which earns more credit", "It shows the ages of the people", "It is needed only for dominant conditions"], "Always back conclusions with named people."),
    M('drawing', "A woman and her husband are unaffected. They have an affected son and an unaffected daughter. How should the son be drawn?",
      "A shaded square joined by a vertical line to the parents' line", ["A shaded circle joined to the mother only", "An unshaded square drawn next to the father", "A shaded square with no lines"], "Children hang from a vertical line below the parents' horizontal line."),
    M('half affected', "An affected parent and an unaffected parent have 8 children, 4 of whom are affected, both boys and girls. What does this suggest?",
      "A dominant allele, with the affected parent heterozygous", ["A recessive allele, with both of the parents being carriers", "A Y-linked allele, passed only to sons", "An X-linked recessive allele"], "Pp × pp gives about half affected children in both sexes."),
    M('carriers in pedigree', "In an X-linked recessive pedigree, who are the carriers?",
      "Unaffected females who pass the allele to sons", ["Unaffected males who pass the allele on to their sons", "Affected females only", "Every male in the family"], "Males cannot be carriers."),
    M('common errors', "A student says a condition is sex-linked because an affected person is male. Why is this not enough?",
      "Males can be affected by autosomal conditions too; compare numbers and parents", ["Males are never affected by sex-linked conditions", "A sex-linked condition only affects females", "Pedigrees cannot show sex"], "Look for patterns, not one person.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-PROBABILITY-FROM-A-CROSS */
  T('HBI-PROBABILITY-FROM-A-CROSS', "Work out the probability of a child's genotype or phenotype from a cross", [
    { skill: 'single child', gen: function () {
      var pr = pick([['Ff', 'Ff'], ['Ff', 'ff'], ['FF', 'Ff'], ['ff', 'Ff'], ['Ff', 'FF']]), o = cross(pr[0], pr[1]), n = o.filter(function (g) { return g === 'ff'; }).length;
      return mq("Cystic fibrosis is caused by a recessive allele f. Parents with genotypes " + pr[0] + " and " + pr[1] + " have a child. What is the probability that the child has cystic fibrosis?", PL[n],
        PL.filter(function (_, i) { return i !== n; }).slice(0, 4),
        "The four boxes are " + o.join(', ') + ". " + n + " of 4 are ff, so the probability is " + PL[n] + ".");
    } },
    { skill: 'boy with condition', gen: function () {
      var pr = pick([['Ff', 'Ff'], ['Ff', 'ff']]), o = cross(pr[0], pr[1]), n = o.filter(function (g) { return g === 'ff'; }).length;
      var p = n === 1 ? '1/8' : '1/4';
      return mq("Cystic fibrosis is not sex-linked. Parents with genotypes " + pr[0] + " and " + pr[1] + " have a child. What is the probability that the child is a boy with cystic fibrosis?", p,
        ['1/16', '1/8', '1/4', '1/2'].filter(function (x) { return x !== p; }),
        "P(cystic fibrosis) = " + n + "/4. P(boy) = 1/2. Multiply: " + n + "/4 × 1/2 = " + p + ".");
    } },
    { skill: 'two children', gen: function () {
      var pr = pick([['Ff', 'Ff'], ['Ff', 'ff']]), n = cross(pr[0], pr[1]).filter(function (g) { return g === 'ff'; }).length;
      var p = n === 1 ? '1/16' : '1/4';
      return mq("Parents with genotypes " + pr[0] + " and " + pr[1] + " have two children. What is the probability that both children have cystic fibrosis (ff)?", p,
        ['1/16', '1/8', '1/4', '1/2'].filter(function (x) { return x !== p; }),
        "Each child is a separate event. P(one child ff) = " + n + "/4, so P(both) = " + n + "/4 × " + n + "/4 = " + p + ".");
    } },
    { skill: 'blood groups', gen: function () {
      var G = [['A', 'O'], ['B', 'O'], ['A', 'B'], ['O', 'O'], ['A', 'A'], ['B', 'B']], p1 = pick(G), p2 = pick(G.filter(function (g) { return g !== p1; }));
      var o = aboCross(p1, p2), grp = pick(['A', 'B', 'AB', 'O']), n = o.filter(function (g) { return abo(g) === grp; }).length;
      return mq("Parents with genotypes " + aboName(p1) + " and " + aboName(p2) + " have a child. What is the probability that the child has blood group " + grp + "?", PL[n],
        PL.filter(function (_, i) { return i !== n; }).slice(0, 4),
        "The four boxes are " + o.map(function (g) { return aboName(g.split(',')) + ' (group ' + abo(g) + ')'; }).join(', ') + ". " + n + " of 4 are group " + grp + ".");
    } },
    { skill: 'X-linked', gen: function () {
      var dad = pick(['XHY', 'XhY']), mum = 'XHXh', o = [];
      ['XH', 'Xh'].forEach(function (m) { [dad.slice(0, 2), 'Y'].forEach(function (d) { var x = [m, d].sort(function (u, v) { return u === 'Y' ? 1 : v === 'Y' ? -1 : u < v ? -1 : 1; }); o.push(x.join('')); }); });
      var q = pick(['boy', 'girl']), n = q === 'boy' ? o.filter(function (g) { return g === 'XhY'; }).length : o.filter(function (g) { return g.indexOf('Y') < 0 && g === 'XhXh'; }).length;
      var show = function (g) { return g.replace(/X(H|h)/g, 'X<sup>$1</sup>'); };
      return mq("Haemophilia is X-linked recessive. A carrier mother (X<sup>H</sup> X<sup>h</sup>) and a father who is " + show(dad) + " have a child. What is the probability that the child is a " + q + " with haemophilia?", PL[n],
        PL.filter(function (_, i) { return i !== n; }).slice(0, 4),
        "The four boxes are " + o.map(show).join(', ') + ". Count the boxes that are a " + q + " with haemophilia: " + n + " of 4. The sex is already in the boxes, so do not multiply by 1/2 again.");
    } },
    M('ways to write', "Which of these is NOT a correct way to write a probability of one quarter?",
      "1 : 3", ["1/4", "0.25", "25%"], "1 : 3 is a ratio, not a probability."),
    M('boy or girl', "What is the probability that any child is a boy?",
      "1/2", ["1/4", "1/3", "1"], "Half the sperm carry X and half carry Y."),
    M('Y-linked girl', "A father has a Y-linked trait. What is the probability that a daughter has the trait?",
      "0", ["1/2", "1/4", "1"], "A girl has no Y chromosome."),
    M('both hh', "Neither parent carries the dominant allele for Huntington's disease (both hh). What is the probability their child does NOT have the disease?",
      "1 (certain)", ["3/4", "1/2", "0"], "Every child will be hh."),
    M('carriers', "Two carriers (Aa × Aa) have a child. What is the probability that the child is a carrier?",
      "1/2", ["1/4", "3/4", "1"], "2 of the 4 boxes are Aa."),
    M('common errors', "A student calculates the chance of two affected children as 1/4 + 1/4 = 1/2. What is wrong?",
      "Probabilities for separate children are multiplied: 1/4 × 1/4 = 1/16", ["They should be subtracted: 1/4 − 1/4 = 0", "They should be divided: 1/4 ÷ 1/4 = 1", "Nothing; adding is correct"], "Each child is an independent event."),
    M('common errors', "In an X-linked square, 1 of the 4 boxes is X<sup>h</sup> Y. A student multiplies 1/4 by 1/2 to get the chance of an affected boy. What is wrong?",
      "Sex is already in the boxes, so the answer is just 1/4", ["The student should multiply by 1/4 again", "The answer should be 1/2 because half are boys", "The student should add 1/2"], "Do not count sex twice.")
  ], { date: '2026-10-13', dropped: [] });
})();
