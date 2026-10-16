/* Group G16 mastery bank: More cells, DNA and cell division (Grade 8 block).
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


  // Mitosis: four cells A to D. A anaphase, B prophase, C telophase, D metaphase.
  var MIT = (function () {
    var g = '';
    function X(x, y, c) { return '<path d="M' + (x - 6) + ' ' + (y - 7) + ' Q' + (x + 6) + ' ' + y + ' ' + (x - 6) + ' ' + (y + 7) + ' M' + (x + 6) + ' ' + (y - 7) + ' Q' + (x - 6) + ' ' + y + ' ' + (x + 6) + ' ' + (y + 7) + '" fill="none" stroke="' + c + '" stroke-width="4" stroke-linecap="round"/>'; }
    function cell(cx) { return '<circle cx="' + cx + '" cy="90" r="62" fill="#f6efe2" stroke="' + INK + '" stroke-width="2"/>'; }
    function sp(x1, y1, x2, y2) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + GREY + '" stroke-width="1"/>'; }
    var ys = [62, 81, 100, 119], cols = [BLUE, HI, BLUE, HI];
    // A anaphase
    g += cell(80);
    ys.forEach(function (y, i) { g += sp(24, 90, 46, y) + sp(136, 90, 114, y) + '<path d="M58 ' + (y - 7) + ' L46 ' + y + ' L58 ' + (y + 7) + '" fill="none" stroke="' + cols[i] + '" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M102 ' + (y - 7) + ' L114 ' + y + ' L102 ' + (y + 7) + '" fill="none" stroke="' + cols[i] + '" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'; });
    // B prophase
    g += cell(230) + '<circle cx="230" cy="90" r="38" fill="none" stroke="' + INK + '" stroke-width="1.5" stroke-dasharray="5 5"/>';
    [[212, 72, 0], [246, 70, 1], [218, 108, 2], [250, 104, 3]].forEach(function (p) { g += X(p[0], p[1], cols[p[2]]); });
    // C telophase
    g += '<path d="M380 44 C350 26 300 40 305 90 C300 140 350 154 380 136 C410 154 460 140 455 90 C460 40 410 26 380 44 Z" fill="#f6efe2" stroke="' + INK + '" stroke-width="2"/>';
    [345, 415].forEach(function (x) { g += '<circle cx="' + x + '" cy="90" r="22" fill="none" stroke="' + INK + '" stroke-width="1.5"/>'; [[-8, -6, BLUE], [6, -8, HI], [-4, 8, HI], [8, 6, BLUE]].forEach(function (d) { g += '<path d="M' + (x + d[0] - 4) + ' ' + (cyy(d[1]) - 4) + ' q4 4 0 8" fill="none" stroke="' + d[2] + '" stroke-width="3" stroke-linecap="round"/>'; }); });
    function cyy(dy) { return 90 + dy; }
    // D metaphase
    g += cell(530);
    ys.forEach(function (y, i) { g += sp(474, 90, 524, y) + sp(586, 90, 536, y) + X(530, y, cols[i]); });
    ['A', 'B', 'C', 'D'].forEach(function (t, i) { g += '<text x="' + (80 + i * 150) + '" y="180" font-size="17" font-weight="700" text-anchor="middle" fill="' + INK + '">' + t + '</text>'; });
    return '<svg class="mc-svg" viewBox="0 0 610 190" role="img" aria-label="Four cells, A to D, each at a different stage of mitosis, not to scale">' + g + '</svg>';
  })();

  /* ====================================================================== HBI-LOCATE-GENETIC-MATERIAL */
  T('HBI-LOCATE-GENETIC-MATERIAL', 'Locate DNA and chromosomes in a human cell', [
    M('nucleus', "In a human body cell, where are the chromosomes found?",
      "In the nucleus", ["In the cytoplasm", "In the ribosomes", "In the cell membrane"], "The nucleus holds the chromosomes."),
    M('molecule', "Which molecule carries genetic information?",
      "DNA", ["Glucose", "Glycogen", "Ribose"], "DNA carries the genetic code."),
    M('chromosome', "What is a chromosome made of?",
      "A long, coiled DNA molecule", ["A chain of glucose molecules joined together", "Many ribosomes packed together", "A folded cell membrane"],
      "Long DNA molecules are coiled and packed to form chromosomes."),
    M('nesting', "Which order goes from the largest structure to the smallest?",
      "Nucleus, chromosome, DNA", ["DNA, chromosome, nucleus", "Chromosome, nucleus, DNA", "Nucleus, DNA, chromosome"], "The nucleus contains chromosomes, which are made of DNA."),
    F("two defensible answers (a chromosome also contains genetic information); stem now asks which part holds the chromosomes and 'Chromosome' is no longer an option", M('part of cell', "Which part of a human cell holds the chromosomes?",
      "Nucleus", ["Ribosome", "Mitochondrion", "Cell membrane"], "The chromosomes are inside the nucleus. If a question asks for the part of the cell, answer 'nucleus', not 'chromosome'.")),
    M('mRNA', "Why is mRNA not a part of a chromosome?",
      "Chromosomes are made of DNA; mRNA is a copy that leaves the nucleus", ["mRNA is a sugar and chromosomes are made only of protein molecules", "mRNA is made in the cell membrane", "mRNA is too large to fit inside a chromosome"],
      "mRNA carries a copy of a gene to the ribosomes."),
    M('sugar', "Which sugar is found in the DNA of chromosomes?",
      "Deoxyribose", ["Ribose", "Glucose", "Sucrose"], "DNA is deoxyribonucleic acid; ribose is the sugar in RNA."),
    M('thymine', "A diagram of a nucleic acid shows two strands and the base thymine. Where in a human cell is this molecule found?",
      "In the nucleus", ["In the ribosomes", "In the cytoplasm only", "In the cell membrane"], "Two strands and thymine mean DNA, which is in the nucleus."),
    S('not genetic', "Which of these structures do NOT hold the genes?", ["Ribosomes", "Cell membrane", "Endoplasmic reticulum"], ["Chromosomes", "Nucleus"],
      "Genes are sections of DNA in the chromosomes inside the nucleus."),
    M('red blood cell', "A mature red blood cell has no nucleus. What does this mean?",
      "It has no chromosomes", ["It has more chromosomes than other cells", "Its DNA is in its membrane", "It has chromosomes in its cytoplasm"],
      "No nucleus means no chromosomes, so no DNA."),
    M('common errors', "A student writes 'cytoplasm' for where DNA is found in a human cell. What is correct?",
      "Nucleus", ["Ribosome", "Cell membrane", "Mitochondrion only"], "In human cells the chromosomes are inside the nucleus."),
    M('function', "What is the function of the nucleus?",
      "It contains the genetic material that controls the cell", ["It releases energy from glucose in respiration", "It makes proteins from amino acids", "It controls what enters the cell"],
      "Respiration is in mitochondria; protein synthesis is at ribosomes.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-SEQUENCE-MITOSIS-STAGES */
  T('HBI-SEQUENCE-MITOSIS-STAGES', 'Sequence and describe the stages of mitosis', [
    M('identify', "The diagram shows four cells dividing by mitosis. Which cell is in metaphase?", "D", ["A", "B", "C"],
      "In D the chromosomes are lined up across the middle of the cell.", { svg: MIT, family: 'g16-mit' }),
    M('identify', "Using the same diagram, which cell is in anaphase?", "A", ["B", "C", "D"],
      "In A the chromatids are being pulled to opposite ends of the cell.", { svg: MIT, family: 'g16-mit' }),
    M('order', "Using the same diagram, what is the correct order of the cells?", "B, D, A, C", ["B, A, D, C", "D, B, A, C", "C, A, D, B"],
      "Prophase (B), metaphase (D), anaphase (A), telophase (C).", { svg: MIT, family: 'g16-mit' }),
    M('identify', "Using the same diagram, what is happening in cell C?", "New nuclear membranes form and the cell divides", ["The chromosomes line up across the middle of the cell", "The chromosomes become visible", "The chromatids are pulled apart"],
      "C is telophase: a nuclear membrane forms round each set of chromosomes, then the cytoplasm divides.", { svg: MIT, family: 'g16-mit' }),
    M('order', "What is the order of the stages of mitosis?",
      "Prophase, metaphase, anaphase, telophase", ["Prophase, anaphase, metaphase, telophase", "Metaphase, prophase, anaphase, telophase", "Telophase, anaphase, metaphase, prophase"],
      "Remember PMAT: prophase, metaphase, anaphase, telophase."),
    M('prophase', "What happens to the chromosomes in prophase?",
      "They coil up, get shorter and thicker and become visible", ["They line up across the middle (equator) of the cell, on spindle fibres", "They are pulled to the poles", "A new nuclear membrane forms around them"],
      "The nuclear membrane also breaks down in prophase."),
    M('metaphase', "Where do the chromosomes line up in metaphase?",
      "Across the middle (equator) of the cell", ["At the two ends (poles) of the cell, one set at each end", "Around the edge of the cell", "Inside the nucleus"],
      "They are attached to spindle fibres."),
    M('anaphase', "What moves to the poles in anaphase?",
      "The chromatids of each chromosome", ["Whole chromosomes, each still made of two chromatids", "The nuclear membrane", "The ribosomes"],
      "Each chromosome splits into its two chromatids."),
    M('telophase', "What forms around each set of chromosomes in telophase?",
      "A new nuclear membrane", ["A new cell wall", "A new cell membrane", "A new spindle"], "Then the cytoplasm divides."),
    M('chromatids', "Why is each chromosome made of two chromatids at the start of mitosis?",
      "The DNA was copied before mitosis began", ["The chromosome has joined with one from the other parent", "The cell has made two different chromosomes", "The spindle split it in half"],
      "The two chromatids are identical copies."),
    { skill: 'count', gen: function () {
      var n = pick([46, 46, 46, 8, 12, 24]);
      return mq("A body cell has " + n + " chromosomes. How many chromatids are pulled to each pole in anaphase of mitosis?",
        String(n), [String(n / 2), String(n * 2), String(n * 4)], "Each of the " + n + " chromosomes splits into two chromatids, and one goes to each pole, so each pole gets " + n + ".");
    } },
    M('common errors', "A student writes: 'In telophase the cell membrane forms around the chromosomes.' What is correct?",
      "A nuclear membrane forms around them", ["A cell wall forms around them", "Nothing forms around them", "A spindle forms around them"], "The nuclear membrane, not the cell membrane.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-DESCRIBE-GENETIC-MODIFICATION */
  T('HBI-DESCRIBE-GENETIC-MODIFICATION', 'Describe genetic modification and gene therapy for human health', [
    M('definition', "What is genetic modification?",
      "Moving a useful gene from one organism into another", ["Removing all the genes from a cell so it stops dividing", "Breeding two animals that look alike", "Giving a patient a vaccine"],
      "The new organism then makes the protein coded for by the gene."),
    M('restriction', "What do restriction enzymes do?",
      "Cut DNA at specific places", ["Join pieces of DNA together into a plasmid", "Copy DNA many times", "Digest proteins in the stomach"], "Ligase joins; restriction enzymes cut."),
    M('ligase', "What does DNA ligase do?",
      "Joins the gene into the plasmid", ["Cuts the gene out of the human DNA at specific places", "Breaks down the bacterial cell wall", "Kills the bacteria"], "This makes recombinant DNA."),
    M('plasmid', "What is the role of the plasmid?",
      "It is a vector that carries the gene into the bacterium", ["It is the protein made by the bacterium after the gene is added", "It cuts the gene out", "It feeds the bacteria"],
      "A plasmid is a small ring of DNA."),
    M('order', "Which is the correct order for making human insulin with bacteria?",
      "Cut out the gene, insert it into a plasmid, put the plasmid into a bacterium, grow the bacteria", ["Put the plasmid into a bacterium, cut out the gene, grow the bacteria, then insert the gene into the plasmid", "Grow the bacteria, cut out the plasmid, add insulin, purify", "Inject insulin into bacteria, grow them, then cut out the gene"],
      "The bacteria are grown in a fermenter and the insulin is purified."),
    M('gene not protein', "What is put into the bacterium to make it produce insulin?",
      "The human insulin gene", ["The insulin protein itself", "A whole human pancreas cell", "Glucose"], "The bacterium uses the gene to make the protein."),
    M('yeast', "Which other organism can be modified to make human insulin?",
      "Yeast", ["A virus", "A mosquito", "A red blood cell"], "Yeast is a fungus that can be grown in fermenters."),
    M('Golden Rice', "How does Golden Rice help health?",
      "It makes beta-carotene, which the body turns into vitamin A", ["It contains extra iron, which stops anaemia in children who eat rice every day", "It contains insulin", "It is a vaccine against rice diseases"],
      "Vitamin A deficiency can cause blindness."),
    M('vaccine plants', "Which health product can be made by genetically modified plants?",
      "A vaccine, such as one against hepatitis B", ["Antibiotics made by the plant's roots in the soil", "Red blood cells", "Insulin-dependent cells"], "Plants can be modified to make vaccine antigens."),
    M('gene therapy', "In gene therapy for cystic fibrosis, what does the harmless virus do?",
      "Carries a normal allele into the cells lining the airways", ["Kills the bacteria that live in the patient's lungs and airways", "Changes the patient's sex cells", "Makes antibodies against mucus"],
      "The cells then make working CFTR protein. A liposome can also be used."),
    M('not inherited', "Why will a patient's children not be cured by gene therapy to their airway cells?",
      "Only body cells are changed, not sex cells", ["The virus is passed on to the children in breast milk and kills the allele", "The allele only works in adults", "Children cannot have cystic fibrosis"],
      "Gametes still carry the faulty allele."),
    M('common errors', "A student writes: 'Ligase cuts the DNA and restriction enzymes join it.' What is correct?",
      "Restriction enzymes cut; ligase joins", ["Both enzymes cut DNA", "Both enzymes join DNA", "Neither enzyme acts on DNA"], "Learn which enzyme does which job.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-EVALUATE-STEM-CELL-USE */
  T('HBI-EVALUATE-STEM-CELL-USE', 'Explain and evaluate uses of embryonic and adult stem cells', [
    M('definition', "What is a stem cell?",
      "An unspecialised cell that can divide and become specialised cells", ["A specialised cell that can no longer divide or change into other types", "A cell found only in plant stems", "A cell with no nucleus"],
      "Stem cells can differentiate."),
    M('embryonic', "Why are embryonic stem cells especially useful?",
      "They can become almost any type of body cell", ["They can only become a few types of blood cell found in the bone marrow", "They never divide", "They are always from the patient"],
      "Adult stem cells can only become a few types."),
    M('adult', "Where are adult stem cells found?",
      "In bone marrow", ["In red blood cells", "In tooth enamel", "In hair"], "There are only a few adult stem cells in the body."),
    M('adult limits', "What is a limitation of adult stem cells?",
      "They can only become a few types of cell", ["They can become any type of cell, so they are hard to control", "They destroy an embryo", "They have no DNA"],
      "Adult stem cells are also few in number."),
    M('treatment', "How could stem cells treat Parkinson's disease?",
      "They could become new nerve cells to replace damaged ones", ["They could kill the viruses that cause the disease in the brain and spinal cord", "They could make antibodies", "They could replace the skull"],
      "Say that new cells replace damaged ones."),
    M('ethics', "Why do many people object to using embryonic stem cells?",
      "The embryo is destroyed", ["The cells are too small to see", "Embryos are expensive", "The cells cannot divide"], "Give the reason, not just 'it is unethical'."),
    M('rejection', "Why are a patient's own stem cells less likely to be rejected?",
      "They have the same antigens as the patient's other cells", ["They have no antigens at all, so lymphocytes cannot find them", "They are killed by antibiotics", "They are larger than other cells"],
      "Lymphocytes do not attack cells with the body's own antigens."),
    S('risks', "Which of these are risks of stem cell treatment?", ["The cells may form tumours", "The cells may be rejected", "The cells may carry infection"], ["The cells may turn into plants", "The cells cannot divide"],
      "Treatments from unlicensed clinics are another risk."),
    M('iPS', "What is an advantage of induced pluripotent (iPS) cells?",
      "They are made from the patient's own cells, so no embryo is needed", ["They come from embryos, so they can be used for any patient", "They never divide", "They are made from viruses"],
      "They also match the patient's tissue type."),
    M('compare', "Which is a correct comparison of embryonic and adult stem cells?",
      "Embryonic cells can become more types of cell than adult cells", ["Adult cells can become more types of cell than embryonic cells can", "Both types can only become blood cells", "Neither type can divide"],
      "Embryonic: almost any type. Adult: only a few types."),
    M('common errors', "A student writes: 'Adult stem cells can become any type of cell.' What is correct?",
      "They can only become a few types", ["They can become sex cells only", "They cannot divide at all", "They are only found in embryos"], "Only embryonic stem cells can become almost any type."),
    M('common errors', "A student writes: 'Stem cells cure diabetes.' What should be added?",
      "They could become insulin-making cells to replace damaged ones", ["They make antibiotics that destroy the sugar in the patient's blood", "They change the person's blood group", "They are injected into the stomach"],
      "Say how: new cells replace damaged ones.")
  ], { date: '2026-10-13', dropped: [] });
})();
