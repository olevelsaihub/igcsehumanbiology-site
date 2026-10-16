/* Group G01 mastery bank: Cells, DNA and cell division (A-Grade Block 1).
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

  /* ====================================================================== HBI-COMPARE-LIGHT-ELECTRON-MICROSCOPE */
  T('HBI-COMPARE-LIGHT-ELECTRON-MICROSCOPE', 'Compare light and electron microscopes and use their parts', [
    M('resolution', "What is meant by the <b>resolution</b> of a microscope?",
      "How well it shows two points that are very close together as separate points",
      ["How many times larger the image is than the real object that is on the slide", "How bright the image looks when the lamp is switched on", "How large the slide is that can be placed on the stage"],
      "Resolution is about detail: two points close together are seen as two, not one blur. 'How many times bigger' is magnification."),
    M('resolution', "Explain why an electron microscope shows more detail inside a cell than a light microscope.",
      "It has a higher resolution, so small structures close together are seen separately",
      ["It makes the cell grow larger before the image is taken", "It uses a much brighter lamp, so all of the colours and edges of the cell look clearer", "It has a lower magnification, so the whole cell fits in view"],
      "Detail depends on resolution. An electron microscope has much higher resolution (and magnification) than a light microscope."),
    M('what each microscope shows', "Which cell structure can be seen with an electron microscope but <b>not</b> with a school light microscope?",
      "Ribosomes", ["The nucleus", "The cell membrane", "The cytoplasm"],
      "Ribosomes are far too small for a light microscope to resolve. The nucleus, cytoplasm and cell membrane can all be seen with a light microscope."),
    S('what each microscope shows', "A student looks at stained cheek cells with a school light microscope. Which structures can the student see?",
      ["Nucleus", "Cytoplasm", "Cell membrane"], ["Ribosomes", "The folded inner membrane of a mitochondrion"],
      "A light microscope shows the nucleus, cytoplasm and cell membrane. Ribosomes and the inside of mitochondria need an electron microscope."),
    M('comparing the microscopes', "Which statement compares an electron microscope with a light microscope correctly?",
      "It has a higher magnification and a higher resolution",
      ["It has a higher magnification but a lower resolution", "It has a lower magnification but a higher resolution", "It has the same resolution but a higher magnification"],
      "An electron microscope is better on both: it magnifies more and it resolves much finer detail."),
    M('comparing the microscopes', "A student writes: 'An electron microscope is better because it is more powerful.' Why would this answer not get the mark?",
      "It does not say that the image has a higher resolution or shows more detail",
      ["It should say that an electron microscope is cheaper to use", "It should say that an electron microscope uses living cells", "It should say that an electron microscope is smaller, lighter and easier to carry around"],
      "'More powerful' is too vague. Examiners want higher resolution (more detail) or higher magnification."),
    M('magnification and resolution', "A student uses a lens with a higher magnification, but the resolution stays the same. What will the student see?",
      "A larger image, but no extra detail", ["A smaller image with more detail", "A larger image with much more detail", "The same image with more colours"],
      "Magnification only makes the image bigger. Without better resolution, close points still blur together, so no new detail appears."),
    M('why magnify', "Why do biologists magnify cells when they study them?",
      "Cells are too small to see with the eye alone, so magnifying shows their structures",
      ["Magnifying the cells kills any bacteria on the slide, so the cells can be seen safely", "Magnifying the cells changes their colour so they show up", "Cells must be magnified before they are able to divide"],
      "Most human cells are far smaller than 0.1 mm, so we cannot see their parts without magnifying them."),
    M('microscope parts', "Which part of a light microscope is used to make small changes that bring the image into sharp focus?",
      "Fine adjustment knob", ["Coarse adjustment knob", "Stage clips", "Eyepiece lens"],
      "The fine adjustment moves the stage only a little, for a sharp final focus. The coarse adjustment makes large movements."),
    M('microscope parts', "What is the job of the stage clips on a light microscope?",
      "To hold the slide still on the stage", ["To magnify the image a second time", "To make large changes to the focus", "To shine light up through the slide"],
      "Stage clips hold the slide in place. The eyepiece lens magnifies, the coarse adjustment focuses roughly, and the light source lights the slide."),
    S('microscope parts', "Which parts of a light microscope contain lenses that magnify the specimen?",
      ["Eyepiece", "Objective"], ["Stage", "Coarse adjustment knob", "Stage clips"],
      "The objective lens magnifies the specimen and the eyepiece lens magnifies that image again. The other parts hold, move or focus the slide."),
    M('microscope parts', "What does the coarse adjustment knob of a light microscope do?",
      "Makes large movements to bring the image roughly into focus",
      ["Makes tiny movements for a very sharp final focus", "Changes which objective lens is above the slide", "Controls how bright the light under the stage is"],
      "Coarse means big steps. You use it first to find the image, then the fine adjustment to sharpen it."),
    M('what each microscope shows', "Which detail of a cell can be seen with an electron microscope but not with a light microscope?",
      "The folded inner membrane of a mitochondrion", ["The outline of the nucleus", "The cell membrane around the cell", "The cytoplasm around the nucleus"],
      "The inside of a mitochondrion is far too small for a light microscope. The nucleus, membrane and cytoplasm are visible with a light microscope.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-DRAW-LABEL-ANIMAL-CELL */
  var CHEEK = '<svg class="mc-svg mc-svg-small" viewBox="0 0 320 200" role="img" aria-label="Drawing of a cheek cell with three parts labelled A, B and C">' +
    '<path d="M60 70 Q100 25 170 40 Q235 30 248 92 Q262 150 200 165 Q130 182 82 150 Q42 115 60 70 Z" fill="#f4f6fa" stroke="' + INK + '" stroke-width="2"/>' +
    '<ellipse cx="158" cy="100" rx="26" ry="19" fill="' + GREY + '" stroke="' + INK + '" stroke-width="2"/>' +
    '<line x1="250" y1="80" x2="292" y2="58" stroke="' + INK + '"/><text x="296" y="58" font-size="16" fill="' + INK + '">A</text>' +
    '<line x1="170" y1="104" x2="292" y2="130" stroke="' + INK + '"/><text x="296" y="136" font-size="16" fill="' + INK + '">B</text>' +
    '<line x1="95" y1="128" x2="30" y2="182" stroke="' + INK + '"/><text x="14" y="194" font-size="16" fill="' + INK + '">C</text></svg>';
  var CILIATED = '<svg class="mc-svg mc-svg-small" viewBox="0 0 320 220" role="img" aria-label="Drawing of a tall ciliated cell with three parts labelled P, Q and R">' +
    '<rect x="120" y="50" width="80" height="150" rx="6" fill="#f4f6fa" stroke="' + INK + '" stroke-width="2"/>' +
    [128, 138, 148, 158, 168, 178, 188].map(function (x) { return '<line x1="' + x + '" y1="50" x2="' + (x - 3) + '" y2="28" stroke="' + INK + '" stroke-width="1.5"/>'; }).join('') +
    '<ellipse cx="160" cy="172" rx="22" ry="15" fill="' + GREY + '" stroke="' + INK + '" stroke-width="2"/>' +
    '<line x1="186" y1="34" x2="262" y2="22" stroke="' + INK + '"/><text x="266" y="26" font-size="16" fill="' + INK + '">P</text>' +
    '<line x1="172" y1="175" x2="262" y2="185" stroke="' + INK + '"/><text x="266" y="190" font-size="16" fill="' + INK + '">Q</text>' +
    '<line x1="200" y1="110" x2="262" y2="104" stroke="' + INK + '"/><text x="266" y="109" font-size="16" fill="' + INK + '">R</text></svg>';
  T('HBI-DRAW-LABEL-ANIMAL-CELL', 'Draw or label a human cell as seen under the microscope', [
    M('label a diagram', "The drawing shows a cheek cell seen with a light microscope. Which letter points to the cell membrane?",
      "A", ["B", "C"], "The cell membrane is the thin outer line of the cell, labelled A. B is the nucleus and C is the cytoplasm.", { svg: CHEEK, family: 'g01-cheek-svg' }),
    M('label a diagram', "The drawing shows a cheek cell seen with a light microscope. Name the part labelled B.",
      "Nucleus", ["Cell wall", "Vacuole", "Mitochondrion"], "B is the dark, rounded body near the middle of the cell: the nucleus. Human cells have no cell wall and no large vacuole.", { svg: CHEEK, family: 'g01-cheek-svg' }),
    M('label a diagram', "The drawing shows a ciliated cell taken from the trachea lining. Name the part labelled P.",
      "Cilia", ["Cell wall", "Ribosomes", "Chromosomes"], "P points to the tiny hairs on the free surface of the cell. These are cilia.", { svg: CILIATED, family: 'g01-cil-svg' }),
    M('label a diagram', "The drawing shows a ciliated cell taken from the trachea lining. Which letter points to the nucleus?",
      "Q", ["P", "R"], "Q is the dark body near the base of the cell: the nucleus. P is the cilia and R is the cell membrane.", { svg: CILIATED, family: 'g01-cil-svg' }),
    M('correct labels', "A student labels the thin outer line of a cheek cell 'cell wall'. What is the correct label?",
      "Cell membrane", ["Cytoplasm", "Nuclear membrane", "Cilia"], "Human cells have no cell wall. The outer boundary of a human cell is the cell membrane."),
    S('what to draw', "A student is drawing a human cheek cell. Which structures should <b>not</b> appear in the drawing?",
      ["Cell wall", "Chloroplast", "Large permanent vacuole"], ["Nucleus", "Cytoplasm", "Cell membrane"],
      "Human cells have no cell wall, no chloroplasts and no large permanent vacuole. A cheek cell shows a nucleus, cytoplasm and cell membrane."),
    M('what to draw', "Which description fits a cheek cell seen with a light microscope?",
      "Flat with an uneven outline and a nucleus near the middle",
      ["Box-shaped with a cell wall and a large vacuole", "Tall and narrow with cilia on its top surface", "Round, with a dip in the middle and no nucleus"],
      "Cheek cells are flat squamous cells with an irregular outline. The other descriptions fit a plant cell, a trachea cell and a red blood cell."),
    M('drawing rules', "What should every label line on a biological drawing do?",
      "Be drawn with a ruler and end exactly on the part it names",
      ["Be drawn freehand and end in the space next to the part", "Point at two parts at once, to save space", "Cross the other label lines, so it is easy to follow"],
      "Label lines are ruled, do not cross, and touch the part they name. A line that ends in space or touches two parts does not get the mark."),
    M('drawing rules', "Which of these is a <b>mistake</b> in a student's drawing of a cheek cell?",
      "The cell is drawn as a rectangle with a thick double outline",
      ["The nucleus is drawn near the middle of the cell", "The label lines are drawn with a ruler", "The outline of the cell is irregular"],
      "A rectangle with a thick outline looks like a plant cell with a cell wall. The other three are correct features of a good drawing."),
    M('what to draw', "Why are chromosomes not usually drawn inside the nucleus of a cheek cell that is not dividing?",
      "They are only seen as separate threads when the cell is dividing",
      ["Cheek cells do not contain any chromosomes", "Chromosomes are kept in the cytoplasm, not the nucleus", "Chromosomes are too large to fit in the drawing"],
      "Chromosomes are always in the nucleus, but they only coil up into visible threads when a cell divides."),
    M('electron micrograph structures', "An electron micrograph shows a system of folded membranes near the nucleus, covered with tiny dots. Name these membranes.",
      "Endoplasmic reticulum", ["Cell membrane", "Mitochondria", "Chromosomes"],
      "The endoplasmic reticulum is a folded membrane system. The tiny dots on it are ribosomes."),
    M('correct labels', "A student drew a ciliated cell from the trachea. The student labelled the nucleus, cytoplasm and cell membrane. Which other part should be labelled on the cell's free surface?",
      "Cilia", ["Cell wall", "Flagellum", "Chloroplasts"], "Cells lining the trachea have cilia on their free (top) surface. Human cells have no cell wall or chloroplasts.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-NAME-NUCLEOTIDE-PARTS */
  var NUC = '<svg class="mc-svg mc-svg-small" viewBox="0 0 320 150" role="img" aria-label="Diagram of one nucleotide: a circle joined to a pentagon joined to a rectangle, labelled X, Y and Z">' +
    '<circle cx="60" cy="75" r="22" fill="' + GREY + '" stroke="' + INK + '" stroke-width="2"/>' +
    '<line x1="82" y1="75" x2="118" y2="75" stroke="' + INK + '" stroke-width="2"/>' +
    '<polygon points="150,45 180,67 168,102 132,102 120,67" fill="#f4f6fa" stroke="' + INK + '" stroke-width="2"/>' +
    '<line x1="180" y1="75" x2="212" y2="75" stroke="' + INK + '" stroke-width="2"/>' +
    '<rect x="212" y="58" width="70" height="34" fill="#e7f0fa" stroke="' + BLUE + '" stroke-width="2"/>' +
    '<text x="54" y="135" font-size="16" fill="' + INK + '">X</text><text x="144" y="135" font-size="16" fill="' + INK + '">Y</text><text x="240" y="135" font-size="16" fill="' + INK + '">Z</text></svg>';
  T('HBI-NAME-NUCLEOTIDE-PARTS', 'Name the parts of a nucleotide and the DNA backbone', [
    M('label a nucleotide', "The diagram shows one nucleotide from a DNA molecule. Name the part labelled Y.",
      "Deoxyribose sugar", ["Ribose sugar", "Phosphate group", "Base"], "The sugar sits in the middle of the nucleotide. In DNA the sugar is deoxyribose; ribose is the sugar in RNA.", { svg: NUC, family: 'g01-nuc-svg' }),
    M('label a nucleotide', "The diagram shows one nucleotide from a DNA molecule. Which letter is the phosphate group?",
      "X", ["Y", "Z"], "The phosphate group (X) is joined to one side of the sugar (Y). The base (Z) is joined to the other side.", { svg: NUC, family: 'g01-nuc-svg' }),
    M('nucleotide parts', "What are the three parts of a DNA nucleotide?",
      "A phosphate group, deoxyribose sugar and a base",
      ["A phosphate group, ribose sugar and a base", "An amino acid, deoxyribose sugar and a base", "A phosphate group, deoxyribose sugar and a fatty acid"],
      "Each DNA nucleotide has a phosphate group, the sugar deoxyribose and one base. Ribose is in RNA; amino acids and fatty acids are not in DNA."),
    M('nucleotide parts', "What is the name of the repeating unit that a DNA molecule is built from?",
      "Nucleotide", ["Amino acid", "Gene", "Chromosome"], "DNA is a long chain of nucleotides. A gene is a section of DNA, and a chromosome is a long DNA molecule; amino acids build proteins."),
    S('backbone and bases', "Which parts of the nucleotides make up the backbone of each DNA strand?",
      ["Phosphate groups", "Deoxyribose sugars"], ["Bases", "Hydrogen bonds", "Amino acids"],
      "Sugar and phosphate alternate along each strand to form the backbone. The bases point inwards and pair with bases on the other strand."),
    M('nucleotide parts', "In a nucleotide, which part is joined to both the phosphate group and the base?",
      "The sugar", ["Another phosphate group", "A hydrogen bond", "A second base"], "The sugar is in the middle: the phosphate is joined to one side of it and the base to the other side."),
    M('bases', "Which of these is <b>not</b> a base found in DNA?",
      "Uracil", ["Adenine", "Thymine", "Guanine", "Cytosine"], "DNA contains adenine, thymine, cytosine and guanine. Uracil is found in RNA instead of thymine."),
    M('nucleotide parts', "Which statement about how the parts of a DNA nucleotide are joined is correct?",
      "The sugar is in the middle, with the phosphate on one side and the base on the other",
      ["The base is in the middle, with the sugar on one side and the phosphate on the other", "The phosphate is in the middle, with the sugar on one side and the base on the other", "All three parts are joined to each other in a closed ring with no middle part"],
      "In every nucleotide the sugar is the link: phosphate – sugar – base."),
    M('backbone and bases', "DNA is often drawn as a twisted ladder. What forms the 'rungs' of the ladder?",
      "Pairs of bases", ["Phosphate groups", "Deoxyribose sugars", "Chains of amino acids"],
      "The two sides of the ladder are the sugar-phosphate backbones. The rungs are pairs of bases, one from each strand."),
    M('bases', "Which statement about the bases in DNA nucleotides is correct?",
      "Each nucleotide has one base, which is one of four kinds",
      ["Each nucleotide has four bases, one of each kind", "Each nucleotide has two bases, one for each strand", "Each nucleotide has three bases, one for each amino acid"],
      "One nucleotide carries a single base. There are four kinds of base in DNA: A, T, C and G."),
    M('backbone and bases', "A single DNA strand has its bases all pointing to one side. What runs along the other side and links the nucleotides together?",
      "Sugar and phosphate groups, one after the other",
      ["Bases and hydrogen bonds, one after the other", "A chain of amino acids joined by peptide bonds", "Sugar and base groups, one after the other"],
      "The nucleotides are joined sugar to phosphate to sugar, forming the sugar-phosphate backbone."),
    S('nucleotide parts', "Which of these molecules are built from nucleotides?",
      ["DNA", "RNA"], ["Protein", "Starch", "Glycogen"],
      "DNA and RNA are nucleic acids, made of nucleotides. Proteins are made of amino acids; starch and glycogen are made of glucose.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-CELLS-TISSUES-ORGANS */
  T('HBI-CELLS-TISSUES-ORGANS', 'Define specialised cells, tissues and organs and identify human tissues', [
    M('definitions', "What is meant by the term <b>tissue</b>?",
      "Similar cells grouped together that share one particular job",
      ["Different organs grouped together that share one job", "Any cells of any kind that are found in one place", "One single cell that does a particular job"],
      "A tissue is a group of similar cells working together on the same function. Groups of organs form an organ system."),
    M('definitions', "What is meant by the term <b>organ</b>?",
      "A structure made of several different tissues working together on a job",
      ["A group of similar cells that all have exactly the same shape, size and nucleus", "A single specialised cell with one job", "A group of organisms of the same kind"],
      "An organ, such as the heart, contains several tissues (muscle, nervous tissue, blood vessels) that work together."),
    M('levels of organisation', "Which list shows the levels of organisation from smallest to largest?",
      "cell → tissue → organ → organ system",
      ["tissue → cell → organ → organ system", "cell → organ → tissue → organ system", "organ → tissue → cell → organ system"],
      "Similar cells form tissues, different tissues form organs, and organs work together in organ systems."),
    M('levels of organisation', "A student writes: 'Cells join together to make organs.' Which level has the student left out?",
      "Tissues, between cells and organs", ["Organelles, between cells and organs", "Organisms, between cells and organs", "Organ systems, between cells and organs"],
      "Cells first form tissues. Different tissues then work together to form an organ."),
    M('classify', "Which of these is an organ, not a tissue?",
      "The stomach", ["Blood", "Cardiac muscle", "Ciliated epithelium"],
      "The stomach contains several tissues (muscle, epithelium, nervous tissue), so it is an organ. The others are single tissues."),
    S('classify', "Which of these are tissues?",
      ["Blood", "Nervous tissue", "Squamous epithelium"], ["Heart", "Kidney", "Small intestine"],
      "Blood, nervous tissue and squamous epithelium are tissues. The heart, kidney and small intestine are organs made of several tissues."),
    M('epithelium', "Which tissue lines the inside of the cheek?",
      "Squamous epithelium", ["Ciliated epithelium", "Cardiac muscle", "Nervous tissue"],
      "The cheek is lined with flat, irregular squamous cells. Ciliated epithelium lines the trachea."),
    M('epithelium', "Where in the body is ciliated epithelium found?",
      "Lining the trachea", ["Lining the inside of the cheek", "In the wall of the heart", "Inside the shaft of a long bone"],
      "Ciliated epithelium lines the trachea. Its cilia beat to move mucus up the airway."),
    M('epithelium', "Which statement gives a difference between a cheek cell and a ciliated cell from the trachea?",
      "A cheek cell is flat and uneven; a trachea cell is tall and column-shaped",
      ["A cheek cell has a nucleus; a trachea cell has no nucleus", "A cheek cell has cilia; a trachea cell has no cilia", "A cheek cell has a thick cell wall; a trachea cell has only a cell membrane"],
      "Both cells have a nucleus and neither has a cell wall. The trachea cell is tall with cilia; the cheek cell is flat with no cilia."),
    M('muscle tissue', "Muscle cells seen under a light microscope are striped and branched, and each cell has one central nucleus. Which tissue is this?",
      "Cardiac muscle", ["Voluntary (skeletal) muscle", "Involuntary (smooth) muscle", "Squamous epithelium"],
      "Cardiac muscle is striped and branched with one nucleus per cell. Voluntary muscle has many nuclei and is not branched; smooth muscle has no stripes."),
    M('muscle tissue', "Which muscle tissue has no stripes and is made of tapered cells, each with one nucleus?",
      "Involuntary (smooth) muscle", ["Voluntary (skeletal) muscle", "Cardiac muscle", "Ciliated epithelium"],
      "Smooth (involuntary) muscle is not striped and its cells are spindle-shaped with one nucleus each."),
    M('muscle tissue', "Where in the body is involuntary (smooth) muscle found?",
      "In the wall of the small intestine", ["In the wall of the heart", "Attached to the bones of the arm", "In the lining of the cheek"],
      "Smooth muscle is in the walls of the gut, blood vessels and uterus, and in the iris. The heart wall is cardiac muscle; arm muscles are voluntary."),
    M('definitions', "What is meant by a <b>specialised cell</b>?",
      "A cell with features that suit it to one particular job",
      ["Any cell that is able to divide by mitosis", "A cell that can carry out every job in the body", "A cell that is found only inside an organ"],
      "A specialised cell, such as a neurone or a sperm cell, has a shape and parts that fit it to its job.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-MATCH-ORGANELLE-TO-FUNCTION */
  T('HBI-MATCH-ORGANELLE-TO-FUNCTION', 'Match human cell structures to their functions', [
    M('structure from function', "In which structure does aerobic respiration take place?",
      "Mitochondria", ["Ribosomes", "Nucleus", "Endoplasmic reticulum"], "Aerobic respiration happens in the mitochondria and releases energy for the cell."),
    M('structure from function', "Which structure is the site of protein synthesis?",
      "Ribosome", ["Mitochondrion", "Nucleus", "Cell membrane"], "Amino acids are joined into proteins at the ribosomes."),
    M('function from structure', "What is the function of the cell membrane?",
      "It controls which substances enter and leave the cell",
      ["It makes proteins for the cell from amino acids", "It releases energy for the cell by respiration", "It stores the genetic information of the cell"],
      "The membrane controls movement in and out of the cell. 'Protects the cell' alone is not enough for the mark."),
    M('function from structure', "What is the function of the nucleus?",
      "It contains the chromosomes and controls the activities of the cell",
      ["It joins amino acids together to make proteins", "It releases energy from glucose for the cell", "It moves substances such as glucose and oxygen into and out of the cell"],
      "The nucleus holds the genetic information on chromosomes and controls what the cell does."),
    M('function from structure', "What does the endoplasmic reticulum do with new proteins?",
      "It carries them through the cell and helps to fold them",
      ["It breaks them down into amino acids", "It copies them to make new DNA", "It releases energy from them by respiration"],
      "Proteins made on the ribosomes pass into the ER, which folds them and transports them to where they are needed."),
    M('correct wording', "A student writes: 'Mitochondria make energy.' Which answer is better?",
      "Mitochondria release energy from glucose by aerobic respiration",
      ["Mitochondria make glucose so that the cell has energy", "Mitochondria store energy for the cell as protein", "Mitochondria make energy out of the oxygen that diffuses into the cell"],
      "Energy cannot be made. Mitochondria release the energy stored in glucose, during aerobic respiration."),
    S('function from structure', "Which are functions of the nuclear membrane?",
      ["It keeps the DNA inside the nucleus", "It controls the movement of substances such as mRNA between the nucleus and cytoplasm"],
      ["It joins amino acids together to make proteins", "It releases energy by aerobic respiration", "It joins nucleotides to make a new DNA strand"],
      "The nuclear membrane surrounds the nucleus: it holds the DNA in and controls what passes between the nucleus and cytoplasm."),
    M('apply to a context', "Cells in the pancreas make large amounts of digestive enzymes, which are proteins. Which structures would you expect these cells to have in large numbers?",
      "Ribosomes and endoplasmic reticulum", ["Chromosomes and nuclear membranes", "Cilia and cell membranes", "Nuclei and cytoplasm"],
      "Enzymes are proteins. Ribosomes make the proteins and the ER folds and transports them, so cells making many proteins have lots of both."),
    M('apply to a context', "The end of a neurone at a synapse contains many mitochondria. Explain why.",
      "They release energy needed to make the neurotransmitter and release it",
      ["They store the neurotransmitter until it is needed", "They carry the impulse across the gap at the synapse", "They are the receptors that the neurotransmitter binds to on the next neurone"],
      "Mitochondria release energy (ATP) by respiration. The neurone uses this energy to make neurotransmitter and move it out into the gap."),
    M('function from structure', "What is the job of the cilia on cells that line the trachea?",
      "They beat to sweep mucus up and out of the airways",
      ["They make sticky mucus to trap pathogens", "They take oxygen out of the air", "They move the cells along the trachea"],
      "Cilia beat together to move mucus, with trapped dust and pathogens, up towards the throat. Mucus is made by other cells."),
    M('function from structure', "What is the function of chromosomes?",
      "They carry genes, which hold the genetic information",
      ["They release energy for the cell", "They join amino acids to make proteins", "They control which substances leave the cell through the cell membrane"],
      "Chromosomes are long DNA molecules found in the nucleus. They carry genes, the instructions for making proteins."),
    M('apply to a context', "A new protein is made on a ribosome, but it cannot pass into the endoplasmic reticulum. Suggest what may happen.",
      "It may not fold into the right shape and may not reach the cell membrane",
      ["It will be broken down into glucose for respiration", "It will be made more quickly by the ribosome", "It will move into the nucleus and be used as a template to make more new DNA"],
      "The ER folds new proteins and carries them to where they are needed. Without it, the protein may have the wrong shape and stay in the wrong place."),
    M('structure from function', "Where in a cell do most of the chemical reactions take place?",
      "In the cytoplasm", ["In the cell membrane", "In the nuclear membrane", "On the chromosomes"], "The cytoplasm is the jelly-like part of the cell where most reactions happen."),
    M('structure from function', "Which pair matches a cell structure with its function correctly?",
      "Ribosome – joins amino acids to make protein",
      ["Ribosome – releases energy by aerobic respiration", "Nucleus – controls which substances enter the cell", "Cell membrane – is the site of protein synthesis"],
      "Ribosomes make proteins. Mitochondria release energy, the cell membrane controls entry, and the nucleus controls the cell's activities.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-PRAC-PREPARE-MICROSCOPE-SLIDE */
  T('HBI-PRAC-PREPARE-MICROSCOPE-SLIDE', 'Prepare cheek-cell or blood slides for a light microscope', [
    M('reason for a step', "Why is a stain such as methylene blue added to cheek cells on a slide?",
      "To colour the cells so that the cells and their nuclei can be seen",
      ["To kill any bacteria that are on the slide", "To stick the cells firmly onto the glass", "To make the cells swell up with water so that they look bigger and clearer"],
      "Cheek cells are almost transparent. The stain colours them, especially the nucleus, so they show up."),
    M('reason for a step', "Why should the cells be spread in a thin layer on the slide?",
      "So that light can pass through a single layer of cells",
      ["So that the cells divide and fill the slide", "So that the stain does not touch the cells", "So that the coverslip will not be needed"],
      "If cells pile up, light cannot get through and they overlap. A thin smear gives one clear layer."),
    M('reason for a step', "Why is the coverslip lowered onto the slide at an angle?",
      "To avoid trapping air bubbles", ["To spread the stain into the cells", "To cut the cells into thin slices", "To warm the slide so the cells stay alive"],
      "Lowering the coverslip slowly from one edge pushes the air out, so no bubbles hide the cells."),
    M('getting the cells', "How should a student collect cheek cells to look at?",
      "Gently rub a sterile cotton bud on the inside of the cheek",
      ["Scrape the outside of the cheek with a needle", "Prick the inside of the cheek with a lancet", "Pull out a hair and put its root on the slide"],
      "Cheek cells come away easily from the inside lining of the mouth with a clean, sterile cotton bud."),
    M('getting the cells', "How should a student get a drop of blood for a blood smear?",
      "Prick a clean fingertip with a sterile lancet", ["Cut the skin of the arm with a scalpel", "Use any needle found on the bench", "Squeeze a bruise on the skin"],
      "A sterile, single-use lancet makes a small prick and lowers the risk of infection."),
    M('order of steps', "A student has just smeared cheek cells thinly on a slide. What should the student do next?",
      "Add a drop of methylene blue stain", ["Look at the slide with the high-power lens", "Remove the cells with a paper towel", "Heat the slide strongly over a flame"],
      "After smearing comes the stain, then the coverslip, and then the slide goes on the microscope."),
    M('order of steps', "Which order of steps is correct for making and viewing a cheek-cell slide?",
      "rub cheek with cotton bud → smear on slide → add stain → add coverslip → view",
      ["smear on slide → rub cheek with cotton bud → add coverslip → add stain → view", "rub cheek with cotton bud → add coverslip → smear on slide → add stain → view", "add stain → add coverslip → rub cheek with cotton bud → smear on slide → view"],
      "Cells must be collected before they can be smeared. The stain goes on before the coverslip, and viewing is last."),
    M('troubleshooting', "A student looks at an unstained cheek-cell slide and cannot see any cells. What is the most likely reason?",
      "The cells are almost transparent, so they are hard to see without a stain",
      ["Cheek cells are too large to fit in the field of view", "The cells have divided many times and slowly moved off the edge of the slide", "The coverslip has reflected away all of the light"],
      "Without stain, thin human cells let almost all the light through, so they are very hard to see."),
    M('using the microscope', "A student puts the finished slide on the stage. Which objective lens should the student use first?",
      "The lowest-power objective lens", ["The highest-power objective lens", "Any objective lens, because they all show the same area", "No objective lens, just the eyepiece"],
      "Start with low power: it shows a larger area, so the cells are easier to find and focus. Then change to higher power."),
    M('reason for a step', "Why does a student touch a paper towel against the edge of the coverslip?",
      "To draw off the extra stain", ["To dry the cells out completely", "To add more stain under the coverslip", "To push the cells to the edge of the slide"],
      "Paper towel soaks up extra stain, so the slide is clean and the cells are easier to see."),
    S('good technique', "Which steps help to give a clear image of cheek cells?",
      ["Spread the cells thinly", "Add a stain", "Lower the coverslip at an angle"],
      ["Put a thick blob of cells on the slide", "Leave out the stain so the cells keep their own colour"],
      "A thin smear, a stain and no air bubbles all make the cells easier to see. A thick blob blocks light and unstained cells are nearly invisible."),
    M('reason for a step', "A student lets a blood smear dry before adding the stain. Suggest why.",
      "So the cells stay in place on the slide when the stain is added",
      ["So that the red blood cells can divide", "So that the blood turns blue on its own, without needing any stain", "So that the cells swell and become bigger"],
      "Drying sticks the thin layer of cells to the glass, so they are not washed away or smeared when stain is added.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-COMPARE-DNA-RNA */
  T('HBI-COMPARE-DNA-RNA', 'Compare DNA with RNA', [
    M('structure of RNA', "Which statement describes the structure of RNA?",
      "Single-stranded, with ribose and the base uracil",
      ["Double-stranded, with ribose and the base uracil", "Single-stranded, with deoxyribose and the base thymine", "Double-stranded, with deoxyribose and the base thymine"],
      "RNA has one strand, the sugar ribose and the base uracil. DNA has two strands, deoxyribose and thymine."),
    S('differences', "Which features are found in DNA but <b>not</b> in RNA?",
      ["Two strands", "Deoxyribose", "Thymine"], ["Ribose", "Uracil", "Adenine"],
      "DNA is double-stranded with deoxyribose and thymine. Ribose and uracil are only in RNA; adenine is in both."),
    M('similarities', "Which base is found in both DNA and RNA?",
      "Guanine", ["Thymine", "Uracil", "Deoxyribose"],
      "A, C and G are in both nucleic acids. Thymine is only in DNA and uracil only in RNA. Deoxyribose is a sugar, not a base."),
    M('similarities', "What do DNA and RNA have in common?",
      "Both are nucleic acids made of nucleotides",
      ["Both are made of two strands", "Both contain the sugar deoxyribose", "Both contain the base thymine"],
      "DNA and RNA are both nucleic acids built from nucleotides. They differ in strands, sugar and one base."),
    M('structure of RNA', "Which sugar does RNA contain?",
      "Ribose", ["Deoxyribose", "Glucose", "Sucrose"], "RNA nucleotides contain ribose. DNA nucleotides contain deoxyribose."),
    M('types and location of RNA', "Which type of RNA carries the genetic information from DNA in the nucleus to the ribosomes?",
      "Messenger RNA (mRNA)", ["Transfer RNA (tRNA)", "DNA polymerase", "A second strand of DNA"],
      "mRNA is the copy of a gene that travels to the ribosome. tRNA brings amino acids; DNA polymerase is an enzyme."),
    M('types and location of RNA', "Where is RNA found in a human cell?",
      "In the nucleus and in the cytoplasm at the ribosomes", ["Only in the nucleus", "Only in the cell membrane", "Only in the cytoplasm, never in the nucleus"],
      "mRNA is made in the nucleus and then moves to the ribosomes in the cytoplasm, where tRNA is also found."),
    M('spot the error', "A student lists differences between DNA and RNA. Which one is <b>incorrect</b>?",
      "DNA contains uracil; RNA contains thymine",
      ["DNA is double-stranded; RNA is single-stranded", "DNA contains deoxyribose; RNA contains ribose", "DNA contains thymine; RNA contains uracil"],
      "It is the other way round: thymine is in DNA and uracil is in RNA."),
    M('identify from data', "A nucleic acid has the base sequence A U G G C U. How do you know it is RNA?",
      "It contains uracil (U), which is found only in RNA",
      ["It contains guanine (G), which is found only in RNA", "It has six bases, so it must be a single strand", "It contains adenine (A), which is never found in DNA"],
      "Uracil is the base found in RNA instead of thymine. A, G and C are found in both."),
    M('structure or function', "A question asks for one difference in <b>structure</b> between DNA and RNA. Which answer is about structure?",
      "RNA is single-stranded but DNA is double-stranded",
      ["RNA carries the code to the ribosomes", "DNA stays inside the nucleus", "RNA is used to help make proteins"],
      "Number of strands, sugar and bases are structure. Where a molecule goes or what it does is function, so it does not answer this question."),
    F('two distractors could be defended (a correct conclusion with an irrelevant reason); replaced with four fixed conclusions, and the RNA data now never has A = U or C = G', { skill: 'identify from data', gen: function () {
      var dna = Math.random() < 0.5, x = rint(20, 32), y = 50 - x;
      var a, b, c, d;   // A, T or U, C, G
      if (dna) { a = x; b = x; c = y; d = y; }
      else { do { a = rint(18, 30); b = rint(14, 30); c = rint(15, 28); d = 100 - a - b - c; } while (d < 12 || d > 34 || a === b || c === d); }
      var tbl = '<table class="mc-table"><tr><th>Base</th><th>Percentage of bases</th></tr><tr><td>Adenine (A)</td><td>' + a + '</td></tr><tr><td>' + (dna ? 'Thymine (T)' : 'Uracil (U)') + '</td><td>' + b + '</td></tr><tr><td>Cytosine (C)</td><td>' + c + '</td></tr><tr><td>Guanine (G)</td><td>' + d + '</td></tr></table>';
      var o = ["It is DNA: it contains thymine, and A = T and C = G", "It is RNA: it contains uracil, and the bases are not in equal pairs",
               "It is DNA: it contains uracil, and the bases are in equal pairs", "It is RNA: it contains thymine, and A = T and C = G"];
      return mq("A scientist measures the bases in a sample of nucleic acid from human cells." + tbl + "Which conclusion is correct?",
        dna ? o[0] : o[1], dna ? [o[1], o[2], o[3]] : [o[0], o[2], o[3]],
        dna ? "Thymine is only in DNA. In double-stranded DNA, A pairs with T and C with G, so A = T and C = G."
            : "Uracil is only in RNA. RNA has one strand, so its bases do not have to be in equal pairs.");
    } }),
    M('differences', "Which <b>two</b> facts both describe DNA, not RNA?",
      "It has two strands and contains thymine", ["It has one strand and contains uracil", "It has two strands and contains ribose", "It has one strand and contains deoxyribose"],
      "DNA is double-stranded with deoxyribose and thymine. RNA is single-stranded with ribose and uracil.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-DNA-STRUCTURE-AND-REPLICATION */
  var BASEPAIR = { A: 'T', T: 'A', C: 'G', G: 'C' };
  function strand(n) { var s = ''; for (var i = 0; i < n; i++) s += pick(['A', 'T', 'C', 'G']); return s; }
  function comp(s) { return s.split('').map(function (b) { return BASEPAIR[b]; }).join(''); }
  T('HBI-DNA-STRUCTURE-AND-REPLICATION', "Describe DNA's double helix, base pairing and replication", [
    { skill: 'base proportions', gen: function () {
      var a = rint(14, 36), askG = Math.random() < 0.5, ans = 50 - a;
      return nq("A sample of double-stranded human DNA contains " + a + "% adenine. Calculate the percentage of " + (askG ? 'guanine' : 'cytosine') + " in the sample.",
        ans, '%', "A pairs with T, so T = " + a + "%. A + T = " + (2 * a) + "%, leaving " + (100 - 2 * a) + "% for C and G together. C = G, so each is " + (100 - 2 * a) + " ÷ 2 = " + ans + "%.", { display: ans + '%' });
    } },
    { skill: 'complementary bases', gen: function () {
      var s, c;
      do { s = strand(6); c = comp(s); } while (c === s || c.split('').reverse().join('') === c || s.indexOf('T') < 0 && s.indexOf('A') < 0);
      var rna = c.replace(/T/g, 'U'), bad = s.split('').map(function (b) { return { A: 'G', G: 'A', C: 'T', T: 'C' }[b]; }).join('');
      var wrong = [s, bad, rna === c ? c.split('').reverse().join('') : rna].filter(function (w, i, arr) { return w !== c && arr.indexOf(w) === i; });
      return mq("One strand of a DNA molecule has the base sequence <b>" + s + "</b>. What is the base sequence on the other strand, opposite these bases?",
        c, wrong, "In DNA, A pairs with T and C pairs with G. So " + s + " pairs with " + c + ". DNA never contains U.");
    } },
    M('holding the strands', "What holds the two strands of a DNA molecule together?",
      "Hydrogen bonds between complementary bases", ["Peptide bonds between amino acids", "Hydrogen bonds between the sugars and phosphates", "Peptide bonds between phosphate groups"],
      "The bases on one strand pair with complementary bases on the other, and hydrogen bonds hold each pair together."),
    M('complementary bases', "Which bases pair together in DNA?",
      "A with T, and C with G", ["A with G, and C with T", "A with U, and C with G", "A with C, and G with T"],
      "Adenine always pairs with thymine and cytosine with guanine. U is found in RNA, not DNA."),
    S('describe the structure', "Which statements correctly describe the structure of DNA?",
      ["Two strands are coiled to form a double helix", "Each strand is made of nucleotides", "The bases on the two strands are complementary"],
      ["The strands are joined by peptide bonds", "It contains the base uracil", "It is made of a single strand"],
      "DNA is a double helix of two nucleotide strands. Complementary bases are joined by hydrogen bonds, not peptide bonds."),
    M('replication', "Which order of events is correct for DNA replication?",
      "strands separate → free nucleotides pair with each old strand → DNA polymerase joins them",
      ["DNA polymerase joins nucleotides → strands separate → free nucleotides pair with each strand", "free nucleotides pair with each strand → strands separate → DNA polymerase joins them", "strands separate → DNA polymerase joins them → free nucleotides pair with each strand"],
      "The helix unwinds and separates first. Free nucleotides then pair with the exposed bases, and DNA polymerase joins them into a new strand."),
    M('replication', "What is the role of DNA polymerase in replication?",
      "It joins free nucleotides together to make a new strand",
      ["It breaks the hydrogen bonds to unzip the DNA", "It makes an mRNA copy of the DNA", "It joins amino acids together to make a protein"],
      "DNA polymerase links the new nucleotides that have paired with the old strand, forming the new strand."),
    M('replication', "What is produced when one DNA molecule is replicated?",
      "Two identical DNA molecules, each with one old strand and one new strand",
      ["Two DNA molecules, one with both old strands and one with both new strands", "Four DNA molecules, each with a single strand", "One DNA molecule that is twice as long as before"],
      "Each old strand acts as a template for a new strand, so each new molecule has one old and one new strand."),
    { skill: 'base proportions', gen: function () {
      var total = pick([200, 300, 400, 500, 600, 800]), c = rint(Math.ceil(total * 0.12), Math.floor(total * 0.36));
      var a = (total - 2 * c) / 2;
      return nq("A short section of double-stranded DNA contains " + total + " bases in total. " + c + " of these bases are cytosine. Calculate how many bases are adenine.",
        a, '', "C pairs with G, so there are " + c + " guanine as well: " + c + " + " + c + " = " + (2 * c) + ". The rest are A and T: " + total + " − " + (2 * c) + " = " + (total - 2 * c) + ". A = T, so A = " + (total - 2 * c) + " ÷ 2 = " + a + ".");
    } },
    M('replication', "When does DNA replication happen in a body cell?",
      "Before the cell divides, so that each new cell gets a full copy",
      ["After the cell has divided into two cells", "Only while the cell is making a protein", "Only in cells that will become sperm or eggs"],
      "DNA is copied before division, so the amount of DNA doubles and each daughter cell receives a complete set."),
    M('replication', "Why is each new strand made in replication an exact match for the old strand it pairs with?",
      "Each free nucleotide can only pair with its complementary base",
      ["DNA polymerase chooses the bases in a random order", "The new strand is copied from the mRNA", "The bases on the new strand are the same as on the old strand"],
      "A can only pair with T and C only with G, so the sequence of the old strand fixes the sequence of the new one."),
    M('describe the structure', "What does the term <b>double helix</b> describe?",
      "Two strands coiled around each other", ["Two separate DNA molecules lying side by side", "One strand folded back on itself once", "Two strands joined end to end in a long line"],
      "DNA is made of two strands that twist around each other like a spiral ladder."),
    M('replication', "A cell copies all of its DNA before it divides. What happens to the mass of DNA in the cell?",
      "It doubles", ["It halves", "It stays the same", "It becomes four times as large"],
      "Replication makes a second copy of every DNA molecule, so the mass of DNA doubles. Division then shares it between two cells.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-DESCRIBE-MITOSIS-PRODUCTS-AND-USES */
  T('HBI-DESCRIBE-MITOSIS-PRODUCTS-AND-USES', 'Describe the products and purposes of mitosis', [
    M('products', "What is produced when a human body cell divides by mitosis?",
      "Two diploid cells that are genetically identical", ["Four haploid cells that are genetically different", "Two haploid cells that are genetically different", "Four diploid cells that are genetically identical"],
      "Mitosis gives two daughter cells. They are diploid (46 chromosomes) and genetically identical to each other and to the parent cell."),
    N('products', "A human skin cell divides by mitosis. How many chromosomes are in each daughter cell?", 46, '',
      "Mitosis keeps the chromosome number the same. A human body cell has 46 chromosomes (23 pairs), so each daughter cell also has 46."),
    S('uses', "Which processes in the human body depend on mitosis?",
      ["Growth of a child", "Repair of a cut in the skin", "Replacing cells lost from the lining of the gut"], ["Making sperm cells in the testes", "Making egg cells in the ovaries"],
      "Mitosis is used for growth, repair and replacing cells. Gametes are made by meiosis."),
    F('removed the implausible option Osmosis, which is not a kind of cell division', M('uses', "A cut in the skin heals. Which type of cell division makes the new skin cells?",
      "Mitosis", ["Meiosis", "Fertilisation"], "Repair needs new cells identical to the old ones, so mitosis is used. Meiosis makes gametes; fertilisation is the joining of gametes.")),
    M('mitosis and meiosis', "Which statement describes meiosis, not mitosis?",
      "It makes four cells that are haploid and genetically different",
      ["It makes two cells that are diploid and genetically identical", "It is used to repair damaged tissue", "It is used for growth"],
      "Meiosis makes four genetically different haploid cells (gametes). The other statements describe mitosis."),
    M('why identical', "Why must the new cells made to repair skin be genetically identical to the old cells?",
      "So they have the same genes and can do the same job as the cells they replace",
      ["So they can fuse with a gamete to make a zygote", "So they each have half the number of chromosomes", "So they can turn into any type of cell that the body needs, such as nerve cells"],
      "Identical genes mean the new skin cells work in the same way as the damaged ones."),
    S('cell cycle', "Which events happen in the cell cycle <b>before</b> the nucleus divides by mitosis?",
      ["The cell grows larger", "The DNA is copied", "New organelles such as mitochondria are made"], ["The chromosome number halves", "The cytoplasm divides into four cells"],
      "Before mitosis the cell grows, makes proteins and organelles, and copies its DNA. The chromosome number never halves in mitosis."),
    M('cell cycle', "What happens straight after the nucleus has divided at the end of mitosis?",
      "The cytoplasm divides to form two separate cells", ["The DNA is copied for the first time", "The two new nuclei join together again", "The cell divides again at once by meiosis"],
      "After the nucleus divides, the cytoplasm divides (cytokinesis), giving two daughter cells."),
    M('products', "What does the word <b>diploid</b> mean?",
      "Having two sets of chromosomes, in pairs (46 in humans)", ["Having one set of chromosomes (23 in humans)", "Having two nuclei in one cell", "Having two copies of every organelle, for example of each mitochondrion"],
      "Diploid cells have chromosomes in pairs, one of each pair from each parent. Haploid cells, like gametes, have one set."),
    M('products', "A human body cell divides by mitosis. Then both daughter cells divide by mitosis again. Which statement is correct?",
      "There are now 4 cells, each with 46 chromosomes", ["There are now 4 cells, each with 23 chromosomes", "There are now 2 cells, each with 46 chromosomes", "There are now 4 cells, each with 92 chromosomes"],
      "Each mitosis doubles the number of cells and keeps the chromosome number at 46. 1 → 2 → 4 cells."),
    M('why identical', "A student writes that mitosis produces 'similar' cells. Why does this not get the mark?",
      "The cells are genetically identical, not just similar", ["The cells are genetically different, not similar", "Mitosis makes gametes, not body cells", "The cells have half the number of chromosomes"],
      "Examiners want 'genetically identical'. 'Similar' could mean the cells have different genes."),
    M('cell cycle', "What happens to the DNA during the S phase of the cell cycle?",
      "It is copied (replicated)", ["It is shared out into four cells", "It leaves the nucleus for the cytoplasm", "It is broken down into nucleotides"],
      "In the S phase the DNA is replicated, so there is a full copy ready for each daughter cell.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-DESCRIBE-PROTEIN-SYNTHESIS */
  T('HBI-DESCRIBE-PROTEIN-SYNTHESIS', 'Describe transcription and translation in human cells', [
    M('where it happens', "Where in a human cell does transcription happen?",
      "In the nucleus", ["At the ribosomes", "In the mitochondria", "At the cell membrane"], "Transcription, making an mRNA copy of a gene, happens in the nucleus, where the DNA is."),
    M('where it happens', "Where in a human cell does translation happen?",
      "At a ribosome in the cytoplasm", ["Inside the nucleus", "On the DNA in a chromosome", "Inside the nuclear membrane"], "The mRNA leaves the nucleus and is translated at a ribosome in the cytoplasm."),
    M('transcription', "What is made during transcription?",
      "An mRNA copy of one gene", ["A new strand of DNA", "A chain of amino acids", "A tRNA molecule with an amino acid"],
      "In transcription the gene's base sequence is copied into mRNA by complementary base pairing."),
    M('sequence of events', "Which order of events in protein synthesis is correct?",
      "mRNA made in nucleus → mRNA moves to ribosome → tRNA brings amino acids → amino acids joined",
      ["tRNA brings amino acids → mRNA made in nucleus → mRNA moves to ribosome → amino acids joined", "mRNA moves to ribosome → mRNA made in nucleus → amino acids joined → tRNA brings amino acids", "mRNA made in nucleus → tRNA brings amino acids → amino acids joined → mRNA moves to ribosome"],
      "First transcription in the nucleus, then the mRNA goes to a ribosome, then translation: tRNA brings amino acids, which are joined into a chain."),
    M('translation', "What is the role of tRNA in protein synthesis?",
      "It carries a particular amino acid to the ribosome", ["It carries the whole gene out of the nucleus to the ribosome", "It copies the DNA in the nucleus", "It is the bond that joins amino acids together"],
      "Each tRNA carries one kind of amino acid. Its anticodon pairs with the matching codon on the mRNA."),
    M('translation', "During translation, what does the anticodon of a tRNA molecule pair with?",
      "A complementary codon on the mRNA", ["A triplet of bases on the DNA", "An amino acid in the cytoplasm", "A hydrogen bond in the ribosome"],
      "The tRNA anticodon pairs with the complementary mRNA codon, so the right amino acid is put in place."),
    M('translation', "What type of bond joins the amino acids together at the ribosome?",
      "Peptide bonds", ["Hydrogen bonds", "Bonds between bases", "Bonds between sugars and phosphates"], "Amino acids are joined by peptide bonds to make a polypeptide chain."),
    M('apply', "A gene in a cell is switched off, so it is not transcribed. What is the result?",
      "No mRNA is made from it, so its protein is not made", ["The protein is made, but more slowly", "The DNA of the gene leaves the nucleus instead", "The tRNA makes the protein without the mRNA"],
      "No transcription means no mRNA. Without mRNA, the ribosome has no code to translate, so the protein is not made."),
    M('apply', "A person eats very little protein for many weeks. Suggest how this affects protein synthesis in their cells.",
      "Fewer amino acids reach the cells, so less protein is made at the ribosomes",
      ["Less mRNA is made, so the cells copy their DNA more often instead of making protein", "More tRNA is made, so the cells make more protein", "The ribosomes make their own amino acids from glucose"],
      "Proteins are built from amino acids from the diet. With fewer amino acids, translation slows and less protein is made."),
    M('spot the error', "A student writes: 'The DNA leaves the nucleus and goes to the ribosome.' What is wrong?",
      "The DNA stays in the nucleus; an mRNA copy goes to the ribosome", ["Nothing is wrong; DNA is read at the ribosome", "The DNA goes to the mitochondria, not the ribosome", "The ribosome moves into the nucleus so that it can read the DNA there"],
      "DNA never leaves the nucleus. Transcription makes an mRNA copy, and this moves to the ribosome."),
    S('translation', "Which events happen during translation?",
      ["The codons on the mRNA are read", "tRNA anticodons pair with mRNA codons", "Amino acids are joined by peptide bonds"],
      ["mRNA is made from the DNA of a gene", "DNA polymerase joins nucleotides together"],
      "Translation happens at the ribosome. Making mRNA is transcription, and DNA polymerase is used in replication."),
    M('the code', "What decides the order of the amino acids in a protein?",
      "The order of the bases in the gene, copied into the mRNA codons", ["The order in which the amino acids from digested food arrive in the cell", "The shape of the ribosome that makes the protein", "The number of tRNA molecules in the cytoplasm"],
      "The base sequence of the gene is copied to mRNA. Each codon codes for one amino acid, so the codons set the order."),
    M('the code', "What is a gene?",
      "A length of DNA with a base sequence that codes for one protein", ["A single base on a DNA strand", "A whole chromosome in the nucleus", "A chain of amino acids that is folded into the shape of a protein"],
      "A gene is a section of DNA. Its base sequence codes for the order of amino acids in a particular protein.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-APPLY-TRIPLET-CODE */
  var CODONS = { AUG: 'methionine', UUU: 'phenylalanine', GGC: 'glycine', GCA: 'alanine', UGG: 'tryptophan', CAU: 'histidine', AAA: 'lysine', GAA: 'glutamic acid', UCU: 'serine', ACC: 'threonine', CCG: 'proline', GUA: 'valine' };
  var DNA2RNA = { A: 'U', T: 'A', C: 'G', G: 'C' }, RNAPAIR = { A: 'U', U: 'A', C: 'G', G: 'C' };
  function tri() { return pick(['A', 'T', 'C', 'G']) + pick(['A', 'T', 'C', 'G']) + pick(['A', 'T', 'C', 'G']); }
  function rtri() { return pick(['A', 'U', 'C', 'G']) + pick(['A', 'U', 'C', 'G']) + pick(['A', 'U', 'C', 'G']); }
  function uniq(list, avoid) { return list.filter(function (w, i) { return w !== avoid && list.indexOf(w) === i; }); }
  T('HBI-APPLY-TRIPLET-CODE', 'Apply the triplet code to bases, codons and amino acids', [
    { skill: 'DNA to mRNA', gen: function () {
      var d; do { d = tri(); } while (d.indexOf('A') < 0);
      var m = d.split('').map(function (b) { return DNA2RNA[b]; }).join('');
      var withT = m.replace(/U/g, 'T'), same = d, swap = d.replace(/T/g, 'U');
      var w = uniq([withT, same, swap, m.split('').reverse().join('')], m).slice(0, 3);
      return mq("A triplet on the DNA template strand is <b>" + d + "</b>. What is the mRNA codon made from it in transcription?", m, w,
        "Pair each DNA base with its RNA partner: A→U, T→A, C→G, G→C. So " + d + " gives " + m + ". RNA has U, never T.");
    } },
    { skill: 'codon to anticodon', gen: function () {
      var m; do { m = rtri(); } while (m.indexOf('U') < 0 && m.indexOf('A') < 0);
      var a = m.split('').map(function (b) { return RNAPAIR[b]; }).join('');
      var withT = a.replace(/U/g, 'T');
      var w = uniq([m, withT, a.split('').reverse().join(''), m.split('').map(function (b) { return { A: 'G', G: 'A', C: 'U', U: 'C' }[b]; }).join('')], a).slice(0, 3);
      return mq("An mRNA codon is <b>" + m + "</b>. What is the anticodon on the tRNA that pairs with it?", a, w,
        "Codon and anticodon pair A with U and C with G. So " + m + " pairs with " + a + ".");
    } },
    { skill: 'DNA to anticodon', gen: function () {
      var d; do { d = tri(); } while (d.indexOf('T') < 0);
      var m = d.split('').map(function (b) { return DNA2RNA[b]; }).join(''), a = d.replace(/T/g, 'U');
      var w = uniq([m, d, a.split('').reverse().join(''), m.replace(/U/g, 'T')], a).slice(0, 3);
      return mq("A triplet on the DNA template strand is <b>" + d + "</b>. What is the anticodon of the tRNA that brings the amino acid for this triplet?", a, w,
        "DNA " + d + " → mRNA codon " + m + " → tRNA anticodon " + a + ". The anticodon has the same bases as the DNA triplet, but with U in place of T.");
    } },
    { skill: 'counting bases and amino acids', gen: function () {
      var aa = rint(40, 260), bases = aa * 3;
      return nq("A section of mRNA that codes for a polypeptide is " + bases + " bases long. How many amino acids does it code for?", aa, '',
        "Three bases (one codon) code for one amino acid: " + bases + " ÷ 3 = " + aa + " amino acids.");
    } },
    { skill: 'counting bases and amino acids', gen: function () {
      var aa = rint(50, 400);
      return nq("A protein has " + aa + " amino acids. How many bases are needed on <b>one</b> strand of DNA to code for it? (Ignore any start or stop codes.)", aa * 3, '',
        "Each amino acid needs a triplet of 3 bases: " + aa + " × 3 = " + (aa * 3) + " bases on one strand. Do not double it for the second strand.");
    } },
    { skill: 'counting bases and amino acids', gen: function () {
      var aa = rint(30, 200);
      return nq("A gene codes for a polypeptide of " + aa + " amino acids. How many bases are there in this part of the DNA, counting <b>both</b> strands? (Ignore any start or stop codes.)", aa * 6, '',
        "One strand needs " + aa + " × 3 = " + (aa * 3) + " bases. DNA has two strands, so the total is " + (aa * 3) + " × 2 = " + (aa * 6) + " bases.");
    } },
    N('number of codes', "There are 4 different bases, and a codon is 3 bases long. How many different codons are possible?", 64, '',
      "Each of the 3 positions can be any of 4 bases: 4 × 4 × 4 = 4³ = 64. Not 4 × 3 = 12."),
    M('number of codes', "Why could a code that uses only <b>two</b> bases for each amino acid not work for all 20 amino acids?",
      "4 × 4 gives only 16 different codes, which is fewer than 20",
      ["4 × 2 gives only 8 different codes, which is fewer than 20", "Two bases would give 64 codes, which is too many", "Two bases cannot pair with each other"],
      "With 2 positions and 4 bases there are 4² = 16 combinations, not enough for 20 amino acids. Three bases give 64."),
    { skill: 'use a code table', gen: function () {
      var keys = Object.keys(CODONS), codon = pick(keys);
      var dna = codon.split('').map(function (b) { return { U: 'A', A: 'T', C: 'G', G: 'C' }[b]; }).join('');
      var shown = [codon]; while (shown.length < 6) { var k = pick(keys); if (shown.indexOf(k) < 0) shown.push(k); }
      shown.sort();
      var tbl = '<table class="mc-table"><tr><th>mRNA codon</th><th>Amino acid</th></tr>' + shown.map(function (k) { return '<tr><td>' + k + '</td><td>' + CODONS[k] + '</td></tr>'; }).join('') + '</table>';
      var wrong = shown.filter(function (k) { return k !== codon; }).map(function (k) { return CODONS[k]; });
      return mq("The table shows some mRNA codons and the amino acids they code for." + tbl + "A triplet on the DNA template strand is <b>" + dna + "</b>. Which amino acid does it code for?",
        CODONS[codon], wrong.slice(0, 3), "First turn the DNA triplet into the mRNA codon: " + dna + " → " + codon + ". Then read the table: " + codon + " codes for " + CODONS[codon] + ".");
    } },
    { skill: 'reading in triplets', gen: function () {
      var s = ''; for (var i = 0; i < 9; i++) s += pick(['A', 'U', 'C', 'G']);
      var right = s.slice(3, 6), w = uniq([s.slice(1, 4), s.slice(2, 5), s.slice(4, 7), s.slice(6, 9)], right).slice(0, 3);
      if (w.length < 2) w = uniq(w.concat(['UAC', 'GCU', 'CCA']), right).slice(0, 3);
      return mq("An mRNA strand is read from the left: <b>" + s + "</b>. What is the second codon?", right, w,
        "Split the strand into groups of three from the first base: " + s.slice(0, 3) + " | " + s.slice(3, 6) + " | " + s.slice(6, 9) + ". The second codon is " + right + ".");
    } },
    { skill: 'DNA to mRNA', gen: function () {
      var m = rtri() + rtri(); while (m.indexOf('U') < 0) m = rtri() + rtri();
      var d = m.split('').map(function (b) { return { U: 'A', A: 'T', C: 'G', G: 'C' }[b]; }).join('');
      var w = uniq([m, m.replace(/U/g, 'T'), d.replace(/T/g, 'U'), d.split('').reverse().join('')], d).slice(0, 3);
      return mq("A section of mRNA has the sequence <b>" + m + "</b>. What was the base sequence of the DNA template strand it was copied from?", d, w,
        "Work back with the pairing rules: U on mRNA ↔ A on DNA, A ↔ T, C ↔ G, G ↔ C. So " + m + " came from " + d + ".");
    } },
    M('number of codes', "A student says: 'With 4 bases in a codon of 3, there are 4 × 3 = 12 codes.' What is the mistake?",
      "The 4 choices are multiplied once for each position, so it is 4 × 4 × 4 = 64",
      ["The 4 bases should be added to the 3 positions, so it is 7", "There are only 3 bases in RNA, so it is 3 × 3 = 9", "The answer should be doubled for two strands, so it is 24"],
      "Each position can be any of 4 bases, independently, so the number of codes is 4³ = 64.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-MATH-MAGNIFICATION */
  T('HBI-MATH-MAGNIFICATION', 'Use image size, actual size and magnification', [
    { skill: 'calculate magnification', gen: function () {
      var act = pick([0.02, 0.025, 0.03, 0.04, 0.05, 0.06, 0.08]), mag = pick([400, 500, 600, 800, 1000, 1200, 1500, 2000]);
      var img = R.roundDp(act * mag, 1);
      return nq("A drawing of a human cell is " + img + " mm wide. The real cell is " + act + " mm wide. Calculate the magnification of the drawing.", mag, '',
        "Magnification = image size ÷ actual size = " + img + " ÷ " + act + " = ×" + commas(mag) + ". Both sizes are in mm, so no conversion is needed.", { display: commas(mag) });
    } },
    { skill: 'calculate actual size', gen: function () {
      var act = pick([6, 7, 8, 10, 12, 15, 20, 25, 30, 40, 50]), mag = pick([500, 1000, 1500, 2000, 2500]);
      var img = R.roundDp(act * mag / 1000, 2);
      return nq("A photograph of a cell taken with a light microscope is magnified ×" + commas(mag) + ". The image of the cell is " + img + " mm long. Calculate the actual length of the cell in µm.", act, 'µm',
        "Actual size = image size ÷ magnification = " + img + " ÷ " + commas(mag) + " = " + R.roundDp(img / mag, 6) + " mm. × 1000 to change mm to µm: " + act + " µm.", { display: String(act) });
    } },
    { skill: 'calculate image size', gen: function () {
      var act = pick([8, 10, 12, 20, 25, 40, 60]), mag = pick([400, 500, 1000, 1500, 2000]);
      var img = R.roundDp(act * mag / 1000, 1);
      return nq("A cell is " + act + " µm long. It is drawn at a magnification of ×" + commas(mag) + ". Calculate the length of the drawing in mm.", img, 'mm',
        "Change µm to mm: " + act + " µm = " + R.roundDp(act / 1000, 3) + " mm. Image size = actual size × magnification = " + R.roundDp(act / 1000, 3) + " × " + commas(mag) + " = " + img + " mm.", { display: String(img) });
    } },
    { skill: 'total lens magnification', gen: function () {
      var e = pick([5, 10, 15]), o = pick([4, 10, 40, 100]);
      return nq("A light microscope has an eyepiece lens of ×" + e + " and an objective lens of ×" + o + ". Calculate the total magnification.", e * o, '',
        "Total magnification = eyepiece × objective = " + e + " × " + o + " = ×" + (e * o) + ". Multiply the two lenses; do not add them.", { display: String(e * o) });
    } },
    { skill: 'total lens magnification', gen: function () {
      var e = pick([5, 10, 15]), o = pick([4, 10, 40]);
      return nq("A student sees cells at a total magnification of ×" + (e * o) + ". The eyepiece lens is ×" + e + ". What is the magnification of the objective lens?", o, '',
        "Total = eyepiece × objective, so objective = " + (e * o) + " ÷ " + e + " = ×" + o + ".", { display: String(o) });
    } },
    { skill: 'units in magnification', gen: function () {
      var act = pick([6, 8, 10, 12, 15, 20, 24, 30]), mag = pick([1000, 1500, 2000, 2500, 3000, 5000]);
      var img = R.roundDp(act * mag / 10000, 2);
      return nq("A drawing of a cell is " + img + " cm wide. The real cell is " + act + " µm wide. Calculate the magnification of the drawing. (1 cm = 10 000 µm)", mag, '',
        "Put both sizes in µm: " + img + " cm = " + commas(R.roundDp(img * 10000, 0)) + " µm. Magnification = " + commas(R.roundDp(img * 10000, 0)) + " ÷ " + act + " = ×" + commas(mag) + ".", { display: commas(mag) });
    } },
    { skill: 'calculate actual size', gen: function () {
      var mag = pick([10000, 12500, 20000, 25000, 40000]), act = pick([0.8, 1.2, 1.6, 2.0, 2.4, 3.2, 4.0]);
      var img = R.roundDp(act * mag / 1000, 1);
      return nq("An electron micrograph of a mitochondrion has a magnification of ×" + commas(mag) + ". The image of the mitochondrion is " + img + " mm long. Calculate its actual length in µm. Give your answer to 1 decimal place.", act, 'µm',
        "Actual size = " + img + " mm ÷ " + commas(mag) + " = " + R.roundDp(img / mag, 6) + " mm. × 1000 gives " + R.roundDp(act, 1) + " µm.", { tol: 0.05, display: R.roundDp(act, 1).toFixed(1) });
    } },
    { skill: 'units in magnification', gen: function () {
      var act = pick([5, 6, 7, 8]), mag = pick([1500, 2000, 2500, 3000, 4000]);
      var img = R.roundDp(act * mag / 1000, 1);
      return nq("A drawing of a red blood cell is " + img + " mm across. The real cell is " + act + " µm across. Calculate the magnification of the drawing.", mag, '',
        "Change mm to µm: " + img + " mm = " + commas(R.roundDp(img * 1000, 0)) + " µm. Magnification = " + commas(R.roundDp(img * 1000, 0)) + " ÷ " + act + " = ×" + commas(mag) + ".", { display: commas(mag) });
    } },
    M('formula', "Which formula gives the actual size of a cell?",
      "actual size = image size ÷ magnification", ["actual size = image size × magnification", "actual size = magnification ÷ image size", "actual size = image size − magnification"],
      "Magnification = image ÷ actual, so actual = image ÷ magnification."),
    M('common errors', "A student divides the actual size of a cell by its image size and gets a magnification of ×0.0025. What mistake did the student make?",
      "The division is the wrong way round: it should be image size ÷ actual size", ["The student should have added the two sizes", "The student should have multiplied by 1000 at the end", "Nothing: a magnification is always less than 1"],
      "An image is bigger than the real cell, so the magnification must be greater than 1. Divide image size by actual size."),
    M('common errors', "A microscope has a ×10 eyepiece and a ×40 objective. A student writes the total magnification as ×50. What is the correct total?",
      "×400", ["×50", "×4", "×30"], "The lenses multiply: 10 × 40 = 400. Adding them (×50) is a common mistake."),
    M('common errors', "A student measures an image as 3.6 cm but writes it in the working as 3.6 mm. What effect does this have on the magnification they calculate?",
      "It is 10 times too small", ["It is 10 times too large", "It is 1000 times too small", "It is not affected"],
      "3.6 cm = 36 mm. Using 3.6 instead of 36 makes the image size, and so the magnification, 10 times too small.")
  ], { date: '2026-10-13', dropped: [] });
})();
