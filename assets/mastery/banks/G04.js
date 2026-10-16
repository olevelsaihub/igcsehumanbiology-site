/* Group G04 mastery bank: Food molecules, enzymes and moving substances (A-Grade Block 4).
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


  function shuffled(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function table(head, rows) {
    return '<table class="mc-table"><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr>' +
      rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>';
  }

  /* ====================================================================== HBI-DEFINE-MEMBRANE-TRANSPORT */
  T('HBI-DEFINE-MEMBRANE-TRANSPORT', 'Define diffusion, osmosis and active transport', [
    M('diffusion', "Which is the best definition of diffusion?",
      "The net movement of particles from a higher to a lower concentration", ["The movement of water across a partially permeable membrane", "The movement of particles from a lower to a higher concentration using energy", "The movement of particles only through carrier proteins in the membrane"],
      "Diffusion is the net movement of particles down a concentration gradient. It needs no energy from the cell."),
    M('osmosis', "Which is the best definition of osmosis?",
      "The net movement of water from a higher to a lower water potential across a partially permeable membrane", ["The net movement of solute particles from a higher to a lower concentration across a membrane", "The movement of water from a lower to a higher water potential, using energy from ATP", "The movement of any particles through a fully permeable membrane until both sides are equal"],
      "Osmosis is about water only, it needs a partially permeable membrane, and water moves from high to low water potential."),
    M('active transport', "Which is the best definition of active transport?",
      "Movement of particles against a concentration gradient, using energy from respiration", ["Movement of particles down a concentration gradient, with no energy needed", "Movement of water across a membrane from a dilute to a concentrated solution", "Movement of particles from a high to a low concentration, using energy from ATP"],
      "Active transport moves particles from a lower to a higher concentration (against the gradient) and needs energy (ATP)."),
    M('active transport', "What supplies the energy for active transport?",
      "ATP made in respiration", ["Heat from the surroundings", "The concentration gradient itself", "Light absorbed by the membrane"],
      "Active transport uses ATP from respiration. The gradient cannot supply energy, because the particles move against it."),
    M('active transport', "Which part of the membrane moves particles during active transport?",
      "Carrier proteins", ["Phospholipid tails", "The cell wall", "Ribosomes"],
      "Carrier proteins in the membrane bind the particles and move them across, using ATP."),
    S('passive or active', "Which processes are passive, so the cell uses no ATP to drive them?", ["Diffusion", "Osmosis"], ["Active transport", "Protein synthesis"],
      "Diffusion and osmosis are passive. Active transport needs ATP."),
    M('osmosis', "Which substance moves in osmosis?",
      "Water only", ["Glucose only", "Any solute", "Oxygen and carbon dioxide"],
      "Osmosis is the movement of water. Solutes such as glucose move by diffusion or active transport."),
    M('water potential', "Which solution has the highest water potential?",
      "Pure water", ["A dilute sugar solution", "A concentrated sugar solution", "A concentrated salt solution"],
      "The more dilute a solution, the higher its water potential. Pure water has the highest water potential of all."),
    M('common errors', "A student writes: 'Active transport moves particles down the concentration gradient using energy.' What is wrong?",
      "Active transport moves particles against (up) the gradient, not down it", ["Active transport does not use energy, so 'using energy' is wrong", "Active transport only moves water, so 'particles' is wrong", "Nothing is wrong; this is the correct definition"],
      "Active transport moves particles from low to high concentration, against the gradient."),
    M('common errors', "A student defines osmosis as 'the movement of water from high to low water potential'. Which key point is missing?",
      "Across a partially permeable membrane", ["Using energy from ATP", "Through carrier proteins", "From low to high concentration"],
      "An osmosis definition must mention the partially permeable membrane."),
    M('partially permeable', "What does 'partially permeable' mean?",
      "It lets some molecules through but not others", ["It lets every molecule through at the same speed", "It does not let any molecules through it", "It only lets molecules through when given ATP"],
      "A partially (selectively) permeable membrane lets small molecules such as water through but stops some larger ones."),
    M('compare processes', "Which process needs energy and can move glucose into a cell where the glucose concentration is already higher than outside?",
      "Active transport", ["Diffusion", "Osmosis", "Filtration"],
      "Only active transport moves a substance against its concentration gradient, and it needs ATP.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-NUTRIENT-COMPOSITION-RECALL */
  T('HBI-NUTRIENT-COMPOSITION-RECALL', 'Recall the elements and building blocks of food molecules', [
    M('elements', "Which elements are found in all carbohydrates?",
      "Carbon, hydrogen and oxygen only", ["Carbon, hydrogen, oxygen and nitrogen", "Carbon, oxygen and nitrogen only", "Carbon, hydrogen, oxygen and sulfur"],
      "Carbohydrates contain only carbon, hydrogen and oxygen."),
    M('elements', "Which element is found in proteins but not in carbohydrates or lipids?",
      "Nitrogen", ["Carbon", "Hydrogen", "Oxygen"], "Proteins contain nitrogen. Carbohydrates and lipids contain only carbon, hydrogen and oxygen."),
    M('elements', "Which list gives the elements in a lipid?",
      "Carbon, hydrogen and oxygen", ["Carbon, hydrogen, oxygen and nitrogen", "Carbon, hydrogen and nitrogen", "Hydrogen, oxygen and sulfur"],
      "Lipids (fats and oils), like carbohydrates, contain only carbon, hydrogen and oxygen."),
    M('elements', "Some proteins contain an element that is not in carbohydrates. Apart from nitrogen, which element can this be?",
      "Sulfur", ["Iron", "Calcium", "Chlorine"], "Proteins contain C, H, O and N, and some also contain sulfur."),
    M('building blocks', "Which small units join to make a protein?",
      "Amino acids", ["Glucose molecules", "Fatty acids and glycerol", "Nucleotides"], "Proteins, including enzymes, are chains of amino acids."),
    M('building blocks', "Which small units join to make starch?",
      "Glucose molecules", ["Amino acids", "Fatty acids", "Glycerol molecules"], "Starch is made of many glucose molecules joined in chains."),
    M('building blocks', "What is a lipid made from?",
      "Fatty acids and glycerol", ["Amino acids and glucose", "Glucose and glycerol", "Amino acids and fatty acids"], "A lipid molecule is made of fatty acids joined to glycerol."),
    M('building blocks', "Glycogen is stored in the liver and muscles. What is it made of?",
      "Many glucose molecules joined together", ["Many amino acids joined in a chain", "Fatty acids joined to glycerol", "Two simple sugars joined together"],
      "Glycogen, like starch, is a large carbohydrate made of many linked glucose units."),
    M('sugars', "Lactose is a disaccharide. What does this mean?",
      "It is made of two simple sugars joined together", ["It is made of many glucose molecules in a chain", "It is made of two amino acids joined together", "It is a single simple sugar, like glucose"],
      "A disaccharide is two monosaccharides (simple sugars) joined together."),
    M('sugars', "Which of these is a monosaccharide (a simple sugar)?",
      "Glucose", ["Starch", "Lactose", "Glycogen"], "Glucose is a single sugar unit. Lactose is two units; starch and glycogen are many."),
    M('enzymes', "Enzymes are proteins. Which sub-units are enzymes made from?",
      "Amino acids", ["Glucose", "Fatty acids", "Glycerol"], "All proteins, including enzymes, are made of amino acids."),
    S('large molecules', "Which of these are large molecules made from many smaller units joined together?", ["Starch", "Protein", "Glycogen"], ["Glucose", "Glycerol"],
      "Starch and glycogen are made of glucose units; protein is made of amino acids. Glucose and glycerol are small units.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-FOOD-TEST-PROCEDURE */
  T('HBI-FOOD-TEST-PROCEDURE', 'Describe how to carry out a food test, including DCPIP for vitamin C', [
    M('Benedict\'s', "A student wants to test a yoghurt for reducing sugar. Which method is correct?",
      "Add Benedict's solution to the sample and heat in a water bath", ["Add Benedict's solution to the sample and leave it at room temperature", "Add iodine solution to the sample and heat in a water bath", "Add biuret solution to the sample and heat it over a flame"],
      "The Benedict's test needs heat. A water bath is safer than a flame."),
    M('Benedict\'s', "What is the colour change for a positive Benedict's test?",
      "Blue to green, yellow, orange or brick red", ["Blue to lilac or purple", "Orange-brown to blue-black", "Blue to colourless"],
      "Benedict's goes from blue through green and yellow to brick red as more reducing sugar is present."),
    M('biuret', "How should a sample of plasma be tested for protein?",
      "Add biuret solution and look for a change from blue to lilac", ["Add biuret solution, heat it and look for a brick-red colour", "Add iodine solution and look for a blue-black colour", "Add Benedict's solution and look for a change to lilac"],
      "Biuret is added without heating. Lilac (purple) shows protein."),
    M('iodine', "How do you test a food for starch?",
      "Add iodine solution; it turns from orange-brown to blue-black", ["Add iodine solution and heat; it turns from blue to brick red", "Add biuret solution; it turns from blue to blue-black", "Add Benedict's solution; it turns from orange-brown to blue"],
      "Iodine solution is orange-brown and turns blue-black with starch. No heating is needed."),
    M('emulsion', "Which is the correct order for the emulsion test for lipid?",
      "Shake the food with ethanol, then pour the ethanol into water", ["Add water to the food first, then add ethanol and heat it", "Heat the food with ethanol, then add iodine solution", "Add biuret solution, then shake with ethanol and water"],
      "Ethanol first to dissolve the lipid, then water. A milky white emulsion shows lipid."),
    M('preparing samples', "How should a solid food be prepared before a food test?",
      "Cut or grind it up and mix it with a little water", ["Test it whole so that it is not contaminated", "Heat it until it melts before adding the reagent", "Dry it in an oven so that only solid remains"],
      "Grinding with water gives a solution or suspension the reagent can mix with."),
    F('two distractors were not plausible; replaced', M('safety', "Which is the safest way to heat a Benedict's test?",
      "In a water bath, wearing eye protection", ["Directly in a Bunsen flame, holding the tube with tongs", "In a water bath, without eye protection, as it is gentle", "On a hot plate, with a bung pushed into the tube"],
      "A water bath heats gently and evenly, and eye protection guards against splashes. A sealed tube can burst when heated.")),
    M('DCPIP', "In the DCPIP test for vitamin C, what shows that vitamin C is present?",
      "Blue DCPIP loses its colour", ["Blue DCPIP turns brick red", "Colourless DCPIP turns blue", "Blue DCPIP turns lilac"],
      "Vitamin C decolourises DCPIP: the blue colour disappears."),
    M('DCPIP comparison', "A student compares the vitamin C in two juices. A fixed volume of blue DCPIP is used each time, and drops of juice are added until the DCPIP becomes colourless. Juice X needs 6 drops and juice Y needs 15 drops. Which is correct?",
      "Juice X has more vitamin C, because fewer drops were needed", ["Juice Y has more vitamin C, because more drops were needed", "Both juices have the same vitamin C, because both decolourised", "Juice X has less vitamin C, because fewer drops were needed"],
      "Fewer drops to decolourise the same volume of DCPIP means the juice is more concentrated in vitamin C."),
    S('DCPIP comparison', "To compare the vitamin C in two juices fairly, what should be kept the same?", ["The volume of DCPIP used", "The concentration of the DCPIP", "The way the end point is judged"], ["The number of drops of juice added", "The colour of the juice"],
      "Keep the DCPIP volume and concentration, and how the end point is judged, the same. The number of drops is what you measure."),
    M('enzyme contamination', "A company wants to show that a sugar syrup contains no enzyme. Which test should be used, and why?",
      "Biuret, because enzymes are proteins; it stays blue if none is present", ["Benedict's, because enzymes are sugars; it stays blue if none is present", "Iodine, because enzymes are starch; it stays brown if none is present", "Emulsion test, because enzymes are lipids; it stays clear if none is present"],
      "Enzymes are proteins, so the biuret test detects them. Blue (no change) shows no protein."),
    M('urine', "How can a nurse quickly check urine for glucose?",
      "Dip a glucose test strip into the urine and compare it with a colour chart", ["Add iodine solution to the urine and look for a blue-black colour", "Add biuret solution to the urine and look for a lilac colour", "Shake the urine with ethanol and look for a milky emulsion"],
      "Glucose test strips change colour with glucose. Benedict's can also be used, with heating.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-FOOD-TEST-INTERPRET */
  function foodGen() {
    var nutrients = ['reducing sugar', 'starch', 'protein', 'lipid'], has = nutrients.map(function () { return Math.random() < 0.5; });
    if (has.every(Boolean)) has[rint(0, 3)] = false; if (!has.some(Boolean)) has[rint(0, 3)] = true;
    var res = [has[0] ? 'brick red' : 'blue', has[1] ? 'blue-black' : 'orange-brown', has[2] ? 'lilac' : 'blue', has[3] ? 'milky white emulsion' : 'clear'];
    return { has: has, res: res, nutrients: nutrients };
  }
  T('HBI-FOOD-TEST-INTERPRET', 'Name the food-test reagent or read food-test results', [
    M('name the reagent', "Which reagent tests for reducing sugars such as glucose?",
      "Benedict's solution", ["Iodine solution", "Biuret solution", "DCPIP solution"], "Benedict's solution is used for reducing sugars and must be heated."),
    M('name the reagent', "Which reagent tests for starch?",
      "Iodine solution", ["Benedict's solution", "Biuret solution", "Ethanol"], "Iodine solution turns blue-black with starch."),
    M('name the reagent', "Which reagent tests for protein?",
      "Biuret solution", ["Benedict's solution", "Iodine solution", "DCPIP solution"], "Biuret solution turns lilac (purple) with protein."),
    M('name the reagent', "Which reagent is used to test for vitamin C?",
      "DCPIP", ["Biuret solution", "Benedict's solution", "Iodine solution"], "Vitamin C decolourises blue DCPIP."),
    M('equipment', "Which piece of equipment is needed for a Benedict's test but not for an iodine test?",
      "A water bath", ["A test tube", "A dropping pipette", "A test-tube rack"], "Benedict's needs heating, usually in a water bath. The iodine test does not."),
    M('read results', "After a Benedict's test, the solution is still blue. What does this show?",
      "No reducing sugar is present", ["A lot of reducing sugar is present", "Protein is present", "Starch is present"], "Blue is the colour of Benedict's solution itself, so no reducing sugar was detected."),
    M('read results', "After a biuret test, the solution is blue. What does this show?",
      "No protein is present", ["Protein is present", "Starch is present", "Reducing sugar is present"], "Biuret is blue. Lilac would show protein; blue means none."),
    { skill: 'read a results table', gen: function () {
      var f = foodGen(), tbl = table(['Test', 'Colour seen'], [["Benedict's (heated)", f.res[0]], ['Iodine', f.res[1]], ['Biuret', f.res[2]], ['Emulsion test', f.res[3]]]);
      var present = f.nutrients.filter(function (n, i) { return f.has[i]; }), absent = f.nutrients.filter(function (n, i) { return !f.has[i]; });
      return { kind: 'multi', q: "A student tested a food and recorded these results." + tbl + "Which nutrients does the food contain?", options: present.concat(absent), answers: present.map(function (_, i) { return i; }),
        why: "Positive results: Benedict's brick red = reducing sugar; iodine blue-black = starch; biuret lilac = protein; milky emulsion = lipid. Here the food contains " + present.join(', ') + ", and no " + absent.join(' or ') + "." };
    } },
    { skill: 'read a results table', gen: function () {
      var f = foodGen(), k = rint(0, 3), tbl = table(['Test', 'Colour seen'], [["Benedict's (heated)", f.res[0]], ['Iodine', f.res[1]], ['Biuret', f.res[2]], ['Emulsion test', f.res[3]]]);
      var right = f.has[k] ? 'Yes, the ' + ["Benedict's", 'iodine', 'biuret', 'emulsion'][k] + ' result is positive' : 'No, the ' + ["Benedict's", 'iodine', 'biuret', 'emulsion'][k] + ' result is negative';
      var wrong = f.has[k] ? 'No, the ' + ["Benedict's", 'iodine', 'biuret', 'emulsion'][k] + ' result is negative' : 'Yes, the ' + ["Benedict's", 'iodine', 'biuret', 'emulsion'][k] + ' result is positive';
      return mq("A student tested a food and recorded these results." + tbl + "Does the food contain " + f.nutrients[k] + "?", right, [wrong, 'It cannot be told from these tests'],
        "The " + ["Benedict's", 'iodine', 'biuret', 'emulsion'][k] + " test shows " + f.nutrients[k] + ". The colour seen was " + f.res[k] + ", which is " + (f.has[k] ? 'positive' : 'negative') + ".");
    } },
    M('Visking tubing', "Starch and glucose solution is put inside Visking tubing, which sits in water. After 30 minutes, which test on the water outside will be positive?",
      "Benedict's test, because glucose molecules are small enough to pass through", ["Iodine test, because starch molecules are small enough to pass through", "Both tests, because all molecules pass through the tubing", "Neither test, because no molecules can pass through the tubing"],
      "Glucose is small and passes through the tubing. Starch molecules are too large."),
    M('read results', "An iodine test on a food stays orange-brown. What does this show?",
      "The food contains no starch", ["The food contains starch", "The food contains protein", "The food contains no reducing sugar"], "Blue-black shows starch. Orange-brown is the colour of iodine itself, so there is no starch."),
    M('common errors', "A student says: 'The Benedict's test stayed blue, so the food contains a lot of sugar.' What is wrong?",
      "Blue means a negative result; there is no reducing sugar", ["Nothing; blue shows a large amount of sugar", "Blue means protein is present, not sugar", "Blue means the sample was not heated for long enough"],
      "The colour change for reducing sugar is to green, yellow, orange or brick red. Blue is negative.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-MATH-AREA-VOLUME-SA-V */
  T('HBI-MATH-AREA-VOLUME-SA-V', 'Calculate area, volume and surface area to volume ratio', [
    { skill: 'surface area of a cube', gen: function () {
      var s = rint(2, 12);
      return nq("A cube of agar jelly has sides of " + s + " mm. Calculate its surface area.", 6 * s * s, 'mm²',
        "A cube has 6 faces. Surface area = 6 × " + s + " × " + s + " = " + (6 * s * s) + " mm².");
    } },
    { skill: 'volume of a cube', gen: function () {
      var s = rint(2, 12);
      return nq("A cube of agar jelly has sides of " + s + " mm. Calculate its volume.", s * s * s, 'mm³',
        "Volume = " + s + " × " + s + " × " + s + " = " + (s * s * s) + " mm³. Not " + s + " × 3.");
    } },
    { skill: 'SA : V ratio', gen: function () {
      var s = pick([1, 2, 3, 4, 5, 6, 10]), r = R.roundDp(6 / s, 2);
      return nq("A cube has sides of " + s + " cm. Calculate its surface area to volume ratio in the form n : 1. Give n to 2 decimal places where needed.", r, '',
        "Surface area = 6 × " + s + "² = " + (6 * s * s) + " cm². Volume = " + s + "³ = " + (s * s * s) + " cm³. Ratio = " + (6 * s * s) + " ÷ " + (s * s * s) + " = " + r + ", so " + r + " : 1.", { tol: 0.006, display: r + ' : 1' });
    } },
    { skill: 'compare cubes', gen: function () {
      var a = rint(1, 3), b = a + rint(2, 4);
      return mq("Two cubes of agar with indicator are placed in acid. Cube P has sides of " + a + " cm and cube Q has sides of " + b + " cm. Which statement is correct?",
        "Cube P has the larger SA : V ratio, so its centre changes colour first", ["Cube Q has the larger SA : V ratio, so its centre changes colour first", "Cube P has the smaller SA : V ratio, so its centre changes colour last", "Both cubes have the same SA : V ratio, so they change at the same time"],
        "SA : V for a cube = 6 ÷ side: P = " + R.roundDp(6 / a, 2) + " : 1, Q = " + R.roundDp(6 / b, 2) + " : 1. The smaller cube has the larger ratio and a shorter distance to its centre.");
    } },
    { skill: 'area of a circle', gen: function () {
      var d = 2 * rint(3, 15), r = d / 2, ans = R.roundDp(Math.PI * r * r, 1);
      return nq("A circular clear zone around an antibiotic disc has a diameter of " + d + " mm. Calculate its area. Use π = 3.14 or the π key. Give your answer to 1 decimal place.", ans, 'mm²',
        "Radius = " + d + " ÷ 2 = " + r + " mm. Area = π × " + r + "² = " + ans + " mm² (with π = 3.14 you get " + R.roundDp(3.14 * r * r, 1) + " mm²). Do not use the diameter.", { tol: Math.max(0.6, R.roundDp(0.003 * ans, 1)), display: String(ans) });
    } },
    { skill: 'table of cubes', gen: function () {
      var s = pick([2, 3, 4, 5]);
      return mq("A cube has sides of " + s + " cm. Which row of its table is correct?", "Surface area " + (6 * s * s) + " cm², volume " + (s * s * s) + " cm³",
        ["Surface area " + (4 * s * s) + " cm², volume " + (s * s * s) + " cm³", "Surface area " + (6 * s * s) + " cm², volume " + (3 * s) + " cm³", "Surface area " + (s * s) + " cm², volume " + (s * s * s) + " cm³"],
        "Surface area = 6 × side² = " + (6 * s * s) + " cm². Volume = side³ = " + (s * s * s) + " cm³.");
    } },
    M('common errors', "A student calculates the surface area of a 3 cm cube as 3 × 3 = 9 cm². What did the student forget?",
      "A cube has 6 faces, so the area is 6 × 9 = 54 cm²", ["The volume should be found first, 27 cm³", "The side should be cubed, giving 27 cm²", "The answer should be in cm³, not cm²"],
      "Surface area of a cube = 6 × side × side."),
    M('common errors', "A student writes the SA : V ratio of a 2 cm cube as 1 : 3. What is wrong?",
      "The ratio is upside down; it should be 3 : 1", ["The ratio should be 24 : 1", "The ratio should be 1 : 8", "Nothing; 1 : 3 is correct"],
      "SA = 24 cm², V = 8 cm³. SA : V = 24 : 8 = 3 : 1. Surface area goes first."),
    M('units', "Which units are correct for a surface area and a volume?",
      "Surface area in mm², volume in mm³", ["Surface area in mm³, volume in mm²", "Both in mm", "Surface area in mm, volume in mm²"], "Areas are squared units; volumes are cubed units."),
    M('meaning of SA : V', "Why does a larger SA : V ratio mean faster diffusion into the whole cube?",
      "There is more surface for each unit of volume, and a shorter distance to the centre", ["The cube has more volume, so more particles can fit inside it", "A larger cube has more energy for diffusion", "The particles move faster in larger cubes"],
      "More surface area per volume lets substances in faster, and the centre is closer to the surface."),
    M('area of a circle', "To use 'area = π r²', a student measures the diameter of a circle as 12 mm. Which value of r should be used?",
      "6 mm", ["12 mm", "24 mm", "3.5 mm"], "The radius is half the diameter: 12 ÷ 2 = 6 mm."),
    M('compare cubes', "As a cube gets larger, what happens to its SA : V ratio?",
      "It decreases", ["It increases", "It stays the same", "It doubles each time"], "Volume grows faster than surface area, so the ratio falls (6 ÷ side for a cube).")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-EXPLAIN-DIFFUSION-RATE-IN-CONTEXT */
  T('HBI-EXPLAIN-DIFFUSION-RATE-IN-CONTEXT', 'Explain diffusion in a context and factors affecting its rate', [
    M('carbon dioxide', "How does carbon dioxide pass from a respiring body cell into the blood?",
      "By diffusion, from a higher concentration in the cell to a lower one in the blood", ["By osmosis, from a higher water potential in the cell to the blood", "By active transport, from a lower concentration in the cell to the blood", "By diffusion, from a lower concentration in the cell to a higher one in the blood"],
      "Cells make carbon dioxide in respiration, so it is more concentrated in the cell and diffuses into the blood."),
    M('bacteria', "Which process moves oxygen into a bacterial cell?",
      "Diffusion", ["Osmosis", "Active transport", "Excretion"], "Oxygen moves down its concentration gradient into the small bacterial cell by diffusion."),
    M('concentration gradient', "Why does glucose diffuse into the blood faster when there is more glucose in the small intestine?",
      "The gradient is steeper, so more glucose crosses each second", ["The glucose molecules become smaller, so they fit through the wall more easily", "The intestine wall becomes thinner when glucose is present", "Glucose then moves by osmosis, which is faster than diffusion"],
      "A steeper gradient means more particles hit and cross the wall per second."),
    M('surface area', "Why does a larger surface area increase the rate of diffusion?",
      "More particles can cross the membrane at the same time", ["The particles gain more kinetic energy as they cross the membrane", "The concentration gradient is reversed across the membrane", "The particles become more concentrated on the inside"],
      "A larger area gives more places for particles to cross at once."),
    M('temperature', "Why does diffusion get faster at a higher temperature?",
      "The particles have more kinetic energy and move faster", ["The membrane becomes thicker, so it holds more particles", "The concentration gradient becomes smaller as it warms up", "The particles become larger, so they collide with the membrane"],
      "Warmer particles move faster, so they spread out more quickly."),
    M('distance', "Why does oxygen reach the centre of a small cell quickly?",
      "The distance from the surface to the centre is short", ["The cell uses active transport to pump oxygen into its centre", "The cell has a smaller surface area to volume ratio than a large cell", "Oxygen moves into small cells by osmosis instead of diffusion"],
      "In a small cell the distance to the centre is short and the SA : V ratio is large."),
    M('dialysis', "In a kidney dialysis machine, why is a long, narrow tube used?",
      "It gives a large surface area for urea to diffuse across", ["It makes the blood flow slowly so it is not damaged", "It stops urea from crossing the tube wall", "It increases the water potential of the dialysis fluid"],
      "A long tube gives more membrane area, so more urea diffuses out each second. 'More time' alone is not the full answer."),
    M('dialysis', "Why does urea diffuse from the blood into the dialysis fluid?",
      "The fresh fluid has no urea, so there is a concentration gradient", ["The dialysis fluid contains more urea than the blood does", "Urea is pumped out of the blood by carrier proteins in the tubing", "Urea moves by osmosis towards the higher water potential in the fluid"],
      "The fresh fluid has no urea, so urea moves from the blood (higher) to the fluid (lower)."),
    M('agar cubes', "Agar cubes with indicator are put in acid. Why does the smallest cube change colour all the way through first?",
      "It has the largest SA : V ratio and the shortest distance to its centre", ["It has the smallest SA : V ratio and the longest distance to its centre", "It contains less indicator, so it needs less acid", "The acid moves into it by active transport"],
      "A small cube has more surface per volume and its centre is closer to the surface."),
    S('factors', "Which changes would increase the rate of diffusion of oxygen into a cell?", ["A steeper concentration gradient", "A larger surface area", "A higher temperature"], ["A longer diffusion distance", "A thicker membrane"],
      "Gradient, area and temperature speed diffusion up. Longer distances and thicker barriers slow it down."),
    M('common errors', "A student writes: 'Glucose moves into the blood by osmosis.' What is wrong?",
      "Osmosis is the movement of water, not glucose", ["Glucose cannot enter the blood at all, so it stays in the gut", "Glucose moves by osmosis only when the temperature is high", "Nothing is wrong, because all molecules move by osmosis"],
      "Osmosis only describes water. Glucose and gases diffuse."),
    M('common errors', "A student explains that a cube with a larger SA : V ratio takes longer to change colour. What is the correct idea?",
      "A larger SA : V ratio means the colour changes sooner", ["A larger SA : V ratio has no effect on the colour change", "A larger SA : V ratio stops the acid entering", "A smaller SA : V ratio means the colour changes sooner"],
      "More surface per volume and a shorter distance mean the acid reaches the centre sooner.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-ENZYME-INHIBITOR-MUTATION */
  T('HBI-ENZYME-INHIBITOR-MUTATION', 'Explain how inhibitors or a mutation change enzyme activity', [
    M('competitive', "How does a competitive inhibitor reduce the rate of an enzyme reaction?",
      "Its shape is like the substrate's, so it blocks the active site", ["It binds to another part of the enzyme and changes the shape of the active site", "It denatures the enzyme by raising the temperature of the mixture", "It breaks the substrate into smaller pieces before it can bind"],
      "A competitive inhibitor fits into the active site, so fewer substrate molecules can bind."),
    M('non-competitive', "How does a non-competitive inhibitor work?",
      "It binds away from the active site and changes its shape", ["It fits into the active site because its shape is like the substrate's shape", "It changes the shape of the substrate so that it can no longer fit", "It speeds up the reaction by giving the molecules extra energy"],
      "A non-competitive inhibitor binds away from the active site, but changes its shape so the substrate no longer fits."),
    M('more substrate', "Adding more substrate can overcome which type of inhibitor?",
      "A competitive inhibitor", ["A non-competitive inhibitor", "Both types equally", "Neither type"],
      "With more substrate, substrate molecules win the competition for active sites more often. A non-competitive inhibitor still changes the active site."),
    M('effect on product', "An inhibitor is added to an enzyme that breaks down hydrogen peroxide into water and oxygen. What happens to the results?",
      "Less oxygen, because fewer enzyme-substrate complexes form", ["More oxygen is made, because the inhibitor speeds up the enzyme", "The same oxygen is made, because inhibitors do not affect enzymes", "Less oxygen is made, because the inhibitor kills the enzyme molecules"],
      "Blocked or changed active sites mean fewer complexes and less product. Enzymes are not alive, so they are not 'killed'."),
    M('mutation', "A mutation changes one amino acid in an enzyme. Why might the enzyme stop working?",
      "The active site changes shape, so the substrate no longer fits", ["The substrate changes shape, so it no longer fits into the enzyme", "The enzyme is denatured by the high temperature in the cell", "The enzyme becomes a substrate for another enzyme and is broken down"],
      "A change in the amino acid order can change the shape of the active site, so no enzyme-substrate complexes form."),
    M('aspirin', "Aspirin inhibits an enzyme in the blood-clotting pathway. What is the effect?",
      "Platelets are not made to stick together, so fewer clots form", ["Platelets stick together more strongly, so more clots form in the blood", "Red blood cells are destroyed, so the blood is no longer able to clot", "The enzyme is killed by aspirin, so the blood becomes thicker"],
      "Inhibiting the enzyme stops its product being made, so platelets do not stick together and fewer clots form."),
    M('graphs', "On a graph of rate against substrate concentration, which line shows a non-competitive inhibitor?",
      "A curve that levels off at a lower maximum rate", ["A curve that reaches the same maximum rate, but more slowly", "A straight line that keeps rising without levelling off", "A curve exactly the same as without the inhibitor"],
      "A non-competitive inhibitor lowers the maximum rate, because adding more substrate does not help."),
    M('graphs', "On the same kind of graph, which line shows a competitive inhibitor?",
      "A curve that rises more slowly but can reach the normal maximum", ["A curve that levels off at a much lower maximum rate than normal", "A curve that rises faster than the curve without the inhibitor", "A flat line at zero rate for all of the substrate concentrations"],
      "At high substrate concentration, substrate outcompetes the inhibitor, so the normal maximum can be reached."),
    M('active site', "What is meant by 'complementary' when describing an enzyme and its substrate?",
      "The substrate's shape fits the active site", ["The enzyme and the substrate have exactly the same shape", "The substrate and the enzyme are both made of protein", "The enzyme changes the shape of every substrate it meets"],
      "Complementary shapes fit together, like a key in a lock, to form an enzyme-substrate complex."),
    M('common errors', "A student writes: 'A competitive inhibitor changes the shape of the active site.' What is wrong?",
      "It blocks the active site without changing its shape", ["It destroys the whole enzyme molecule so it cannot work", "It changes the shape of the substrate instead of the enzyme", "Nothing is wrong; this is what a competitive inhibitor does"],
      "Changing the active site's shape is what a non-competitive inhibitor does."),
    M('common errors', "Which phrase is correct for what an inhibitor does to an enzyme?",
      "It reduces the enzyme's activity", ["It kills the enzyme, as it is alive", "It destroys all the substrate molecules", "It digests the enzyme into amino acids"],
      "Enzymes are molecules, not living things, so they are not killed. Inhibitors reduce or stop their activity."),
    S('inhibitor effects', "Which of these happen when an inhibitor is added to an enzyme reaction?", ["Fewer enzyme-substrate complexes form", "Less product is made in the same time"], ["The enzyme is used up in the reaction", "The temperature of the mixture rises", "The substrate changes into the inhibitor"],
      "With an inhibitor, fewer complexes form, so less product is made per unit time.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-ENZYME-TEMP-PH-DENATURE */
  T('HBI-ENZYME-TEMP-PH-DENATURE', 'Explain how temperature or pH changes enzyme activity', [
    M('rising temperature', "Why does the rate of an enzyme reaction increase from 20 °C to 35 °C?",
      "More kinetic energy, so more collisions and more enzyme-substrate complexes", ["The enzyme is denatured, so its active site fits the substrate better than before", "The enzyme molecules become larger, so each one can hold more substrate", "The substrate molecules change shape so that they fit the active site better"],
      "Below the optimum, warming gives more kinetic energy, more successful collisions and more complexes."),
    M('denaturing', "What happens to an enzyme at 70 °C if its optimum is 37 °C?",
      "It is denatured: its active site changes shape", ["It works faster, because the molecules have more kinetic energy at 70 °C", "It is killed, so it can no longer reproduce or make more enzyme", "It works at the same rate, because temperature does not affect enzymes"],
      "Above the optimum the active site changes shape, so few or no complexes form."),
    M('low temperature', "An enzyme is kept at 5 °C. Which statement is correct?",
      "It works slowly but is not denatured", ["It is denatured and can never work again", "It works faster than at 37 °C", "It is killed by the cold"],
      "At low temperature molecules move slowly, so there are fewer collisions. The active site is not damaged."),
    M('pH', "Why does pepsin stop working in the small intestine, where the pH is about 8?",
      "The pH is far from its optimum, so its active site changes shape", ["The temperature in the small intestine is too high for it", "There is no protein in the small intestine to digest", "Pepsin is used up in the stomach and cannot work again"],
      "Pepsin's optimum is about pH 1 to 2. In alkaline conditions its active site is denatured."),
    M('pH', "What is the optimum pH of pepsin, an enzyme that works in the stomach?",
      "About pH 2", ["About pH 7", "About pH 9", "About pH 12"], "The stomach is acidic, so pepsin works best at about pH 1 to 2."),
    M('37 °C', "Why are experiments on human gut enzymes often done at 37 °C?",
      "It is body temperature, close to the optimum for human enzymes", ["It is the temperature at which every enzyme in nature works best", "It is the only temperature at which enzyme activity can be measured", "It denatures the enzyme so that the results can be compared fairly"],
      "37 °C is human body temperature, close to the optimum for human enzymes."),
    F('wording: it is the molecules, not the enzymes as such, that have less kinetic energy', M('hypothermia', "Why is a very low body temperature (hypothermia) dangerous?",
      "Molecules have less kinetic energy, so enzyme reactions, metabolism and heart rate slow", ["Enzymes are denatured by the cold, so they change shape", "The body makes more enzymes, which use up all the glucose", "Blood becomes more acidic, so all enzymes work faster"],
      "Low temperature slows enzyme reactions, so metabolism, breathing and heart rate slow.")),
    M('fair test', "A biosensor uses an enzyme to measure urea. Why must two urine samples be tested at the same temperature?",
      "A warmer sample makes the enzyme work faster, giving a higher reading", ["A warmer sample contains more urea, because heat makes urea", "A warmer sample denatures the urea, so it cannot be measured", "Temperature changes the colour of the urine, so it reads wrongly"],
      "Temperature changes enzyme activity, so it must be controlled for a fair comparison."),
    M('lipase', "Lipase works best in slightly alkaline conditions. Why is sodium hydrogencarbonate added in lipase experiments?",
      "To raise the pH towards lipase's optimum", ["To provide the lipid for lipase to digest", "To denature the lipase at the start", "To make the mixture acidic like the stomach"],
      "Sodium hydrogencarbonate is alkaline, so it brings the pH close to lipase's optimum."),
    M('yoghurt', "Bacteria in yoghurt make acid. Why do they stop working when the pH becomes very low?",
      "The acid denatures their enzymes", ["The acid gives them more kinetic energy", "The acid is a substrate for their enzymes", "The acid makes more enzyme-substrate complexes"],
      "At a pH far from the optimum, the enzymes' active sites change shape."),
    M('common errors', "A student writes: 'At 60 °C the enzyme is killed.' What should the student write?",
      "The enzyme is denatured", ["The enzyme is digested", "The enzyme is inhibited", "The enzyme is activated"],
      "Enzymes are proteins, not living things. High temperature denatures them."),
    M('enzymes as catalysts', "What is an enzyme?",
      "A protein that speeds up a reaction without being used up", ["A carbohydrate that is used up as it speeds up a reaction", "A lipid that slows down reactions inside cells", "A protein that is changed into product in the reaction"],
      "Enzymes are biological catalysts: proteins that speed up reactions and are not used up.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-ENZYME-OPTIMUM-FROM-DATA */
  function enzData(kind) {
    var temps = [10, 20, 30, 40, 50, 60], p = rint(2, 3);
    var vals = temps.map(function (t, i) { var d = Math.abs(i - p); return d === 0 ? 50 + rint(0, 8) : Math.max(2, 50 - d * rint(10, 16)); });
    vals[p - 1] = Math.min(vals[p - 1], vals[p] - 8); vals[p + 1] = Math.min(vals[p + 1], vals[p] - 6);
    return { temps: temps, vals: vals, p: p };
  }
  T('HBI-ENZYME-OPTIMUM-FROM-DATA', 'Read an enzyme optimum from data and judge how reliable it is', [
    { skill: 'read the optimum', gen: function () {
      var e = enzData(), tbl = table(['Temperature in °C'].concat(e.temps.map(String)), [['Volume of gas in 2 minutes in cm³'].concat(e.vals.map(String))]);
      return mq("An enzyme was tested at different temperatures." + tbl + "What is the best estimate of the optimum temperature from these results?", e.temps[e.p] + ' °C',
        [e.temps[e.p - 1] + ' °C', e.temps[e.p + 1] + ' °C', '60 °C'],
        "The most gas was made at " + e.temps[e.p] + " °C, so this is the best estimate of the optimum. Quote the unit.");
    } },
    { skill: 'time data', gen: function () {
      var ph = [2, 4, 6, 8, 10], p = rint(1, 3), t = ph.map(function (x, i) { return 20 + Math.abs(i - p) * rint(25, 40) + rint(0, 5); });
      var tbl = table(['pH'].concat(ph.map(String)), [['Time for starch to disappear in s'].concat(t.map(String))]);
      var longest = 0; t.forEach(function (v, i) { if (v > t[longest]) longest = i; });
      return mq("Amylase was tested at different pH values." + tbl + "At which pH did amylase work fastest?", 'pH ' + ph[p],
        ['pH ' + ph[longest], 'pH ' + ph[(p + 2) % 5], 'pH ' + ph[(p + 3) % 5]].filter(function (x, i, a) { return x !== 'pH ' + ph[p] && a.indexOf(x) === i; }),
        "The data show time taken, so the fastest rate is at the shortest time: " + t[p] + " s at pH " + ph[p] + ". The longest time shows the slowest rate.");
    } },
    M('precision', "An enzyme was tested at 20, 30, 40 and 50 °C. The most product was made at 40 °C. Which statement is correct?",
      "The true optimum could be between about 30 °C and 50 °C", ["The optimum is exactly 40 °C, and there is no doubt about this at all", "The optimum must be 37 °C, because that is true for every enzyme", "The optimum must be one of the other temperatures that were tested"],
      "With 10 °C steps, the true optimum may lie between tested values."),
    M('improve', "How can the optimum temperature be found more precisely?",
      "Test smaller steps around the best value, with repeats", ["Repeat the same four temperatures, but with a larger volume of substrate", "Test only one temperature and repeat it ten times to get a mean", "Test more widely spread temperatures, such as 0 °C and 100 °C"],
      "Smaller intervals near the peak, with repeats, pin down the optimum."),
    M('where enzymes come from', "An enzyme from bacteria living in hot springs has an optimum of 75 °C. Which statement is correct?",
      "Enzymes from different organisms can have different optima", ["It must have been denatured, because 75 °C is far above 37 °C", "All enzymes have an optimum of 37 °C, so this result is anomalous", "It cannot be an enzyme, because no enzymes can work above 40 °C"],
      "Human enzymes have optima near 37 °C, but enzymes from organisms in hot places can work best at much higher temperatures."),
    M('validity', "In an enzyme experiment, the tubes at 60 °C were left for 5 minutes but the other tubes for 10 minutes. Why is this a problem?",
      "More than one factor changed, so the comparison is not fair", ["The tubes at 60 °C should have been left for longer to denature", "The results will be more accurate because times differ", "There is no problem, because temperature is the only variable"],
      "Only the independent variable should change. Different times make the comparison invalid."),
    F('two distractors were not plausible; replaced', M('accuracy', "Students judge by eye when a mixture 'goes clear'. Why does this make the results less accurate?",
      "Different people may judge the end point differently", ["Looking at the tube cools it, which slows the enzyme", "The light in the room changes the rate of the reaction", "The end point is always reached at the same time"],
      "Judging an end point by eye is subjective. A colorimeter gives a more objective reading.")),
    M('accuracy', "Which piece of equipment would measure the colour change in an enzyme experiment more accurately than the eye?",
      "A colorimeter", ["A thermometer", "A measuring cylinder", "A stopclock"], "A colorimeter measures colour objectively."),
    M('human enzymes', "Which sketch would show the activity of an enzyme from the human gut?",
      "A curve rising to a peak at about 37 °C, then falling steeply", ["A straight line that rises steadily all the way from 0 °C to 100 °C", "A curve with its peak at about 75 °C, then falling steeply", "A flat line at the same activity at every temperature"],
      "Human gut enzymes have an optimum near 37 °C and are denatured above it."),
    M('comparing enzymes', "Enzyme P has an optimum of pH 2 and enzyme Q an optimum of pH 8. Which comparison is correct?",
      "P works best in acid conditions; Q works best in alkaline conditions", ["Both enzymes work best in neutral conditions, at about pH 7", "P works best in alkaline conditions; Q works best in acid conditions", "The two enzymes have the same optimum pH as each other"],
      "A comparison must mention both enzymes and say how they differ."),
    M('common errors', "Times for starch to disappear were 90 s at pH 4, 30 s at pH 6 and 80 s at pH 8. A student says the optimum is pH 4. What is wrong?",
      "The longest time is the slowest rate; the optimum is pH 6", ["Nothing is wrong, because the longest time shows the optimum", "The optimum must be pH 7, because that is the neutral value", "The optimum is pH 8, because it is the highest pH that was tested"],
      "For time data, the fastest rate is at the shortest time."),
    M('treated samples', "Saliva samples were boiled, cooled in ice, made acidic, or left at room temperature, then tested with starch. Which sample would most likely digest the starch fastest?",
      "The untreated sample at room temperature", ["The sample that was boiled", "The sample that was made acidic", "The sample that was cooled in ice"],
      "Boiling and acid denature amylase; ice slows it. The untreated sample keeps its activity.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-EXPLAIN-OSMOSIS-IN-BODY */
  T('HBI-EXPLAIN-OSMOSIS-IN-BODY', 'Explain water movement by osmosis in body contexts', [
    M('direction', "Cells are in tissue fluid. The cells have a lower water potential than the tissue fluid. What happens?",
      "Water enters the cells by osmosis and they swell", ["Water leaves the cells by osmosis and they shrink", "Glucose enters the cells by osmosis", "Nothing happens, because cells are not permeable to water"],
      "Water moves from the higher water potential (tissue fluid) to the lower (cells)."),
    M('red blood cells', "Red blood cells are placed in a concentrated salt solution. What happens?",
      "They lose water by osmosis and shrink", ["They take in water by osmosis and burst", "They take in salt by osmosis and swell", "They stay the same size"],
      "The solution has a lower water potential than the cells, so water leaves and the cells shrink. They do not burst."),
    M('red blood cells', "Red blood cells are placed in pure water. What happens?",
      "Water enters by osmosis and the cells may burst", ["Water leaves by osmosis and the cells shrink", "The cells lose all their haemoglobin by diffusion", "Nothing, because water cannot cross cell membranes"],
      "Pure water has a higher water potential than the cytoplasm, so water enters. Animal cells have no wall and can burst."),
    M('diabetes', "Why does a person with untreated diabetes urinate often?",
      "Glucose draws water from cells into the blood; the extra is lost in urine", ["Glucose in the blood is converted into water, which is then lost in the urine", "Insulin makes the kidneys produce more urine when blood glucose is high", "Cells make more water in respiration when blood glucose is high"],
      "Glucose lowers the water potential of the blood, so water moves out of cells by osmosis and is excreted."),
    M('lactose intolerance', "In lactose intolerance, undigested lactose stays in the gut. Why does this cause diarrhoea?",
      "Lactose lowers the gut's water potential, so water enters the gut", ["Lactose raises the water potential in the gut, so water leaves the gut by osmosis", "Lactose is absorbed by osmosis, taking water with it into the blood", "Lactose kills the cells lining the gut, so water leaks out of the body"],
      "The gut contents become more concentrated, so water moves from body cells into the gut."),
    M('dehydration', "After heavy urination, the plasma has a lower water potential. What happens to red blood cells?",
      "They lose water by osmosis and become distorted, carrying less oxygen", ["They gain water by osmosis from the plasma and then burst", "They carry more oxygen because they are smaller and lighter", "They make more haemoglobin to replace the water that was lost"],
      "Water leaves the cells into the more concentrated plasma, so the cells shrink and change shape."),
    M('oedema', "In cellular oedema, too much water enters body cells. Which explains this?",
      "The cells have a lower water potential than the tissue fluid", ["The cells have a higher water potential than the tissue fluid", "Water is pumped into the cells by active transport", "The tissue fluid contains more solute than the cells"],
      "Water moves by osmosis into the cells because they have the lower water potential."),
    M('potato data', "Potato pieces are put in sugar solutions and their percentage change in mass is plotted. How is the concentration of the potato cell contents found?",
      "Read the concentration where the percentage change in mass is zero", ["Read the concentration with the largest increase in mass", "Read the concentration with the largest decrease in mass", "Take the mean of all the concentrations tested"],
      "At zero change, the water potential inside equals that of the solution, so there is no net osmosis."),
    { skill: 'potato data', gen: function () {
      var c = [0.0, 0.2, 0.4, 0.6, 0.8], z = pick([0.3, 0.5]), ch = c.map(function (x) { return R.roundDp((z - x) * 20 + (Math.random() - 0.5) * 0.4, 1); });
      var tbl = table(['Sugar concentration in mol per dm³'].concat(c.map(function (x) { return x.toFixed(1); })), [['Percentage change in mass'].concat(ch.map(function (v) { return (v > 0 ? '+' : '') + v.toFixed(1); }))]);
      return mq("Potato pieces were left in sugar solutions for one hour." + tbl + "What is the best estimate of the concentration of the potato cell contents?", z.toFixed(1) + ' mol per dm³',
        ['0.0 mol per dm³', '0.8 mol per dm³', (z === 0.3 ? 0.6 : 0.2).toFixed(1) + ' mol per dm³'],
        "The mass change goes from positive to negative between " + (z - 0.1).toFixed(1) + " and " + (z + 0.1).toFixed(1) + " mol per dm³, so zero change is at about " + z.toFixed(1) + ". There the water potential inside and outside is the same.");
    } },
    M('potato data', "A potato piece gained mass in a sugar solution. What does this show?",
      "The solution had a higher water potential than the potato cells", ["The solution had a lower water potential than the potato cells", "Sugar moved into the potato by osmosis", "The potato cells made water by respiration"],
      "Water entered by osmosis, so the solution was more dilute than the cell contents."),
    M('common errors', "A student writes that in osmosis water goes 'from low to high water potential'. What is the correct direction?",
      "From high water potential to low water potential", ["From a dilute solution towards a pure water solution", "Water does not move; only the solutes move in osmosis", "From a concentrated solution to a dilute solution"],
      "In osmosis, water moves down a water potential gradient: from high to low."),
    M('water potential', "Adding glucose to one side of a partially permeable membrane will:",
      "lower the water potential on that side", ["raise the water potential on that side", "have no effect on the water potential", "make the membrane fully permeable"],
      "Adding solute makes a solution more concentrated, so its water potential falls.")
  ], { date: '2026-10-13', dropped: [] });
})();
