/* Group G02 mastery bank: Core investigation skills (A-Grade Block 2).
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


  /* ====================================================================== HBI-PRAC-IDENTIFY-INDEPENDENT-DEPENDENT-VARIABLE */
  T('HBI-PRAC-IDENTIFY-INDEPENDENT-DEPENDENT-VARIABLE', 'Identify the independent or dependent variable', [
    M('independent variable', "A student puts pieces of carrot into salt solutions of five different concentrations. After 40 minutes the student measures the change in mass of each piece. What is the independent variable?",
      "Concentration of the salt solution", ["Change in mass of the carrot", "Time the pieces are left", "Size of each carrot piece"],
      "The independent variable is the factor the student changes on purpose: the salt concentration.", { family: 'g02-carrot' }),
    M('dependent variable', "A student puts pieces of carrot into salt solutions of five different concentrations. After 40 minutes the student measures the change in mass of each piece. What is the dependent variable?",
      "Change in mass of each carrot piece", ["Concentration of the salt solution", "Temperature of the room", "Volume of each salt solution"],
      "The dependent variable is what is measured to see the effect: the change in mass.", { family: 'g02-carrot' }),
    M('read a results table', "A results table has two columns: <b>Type of mouthwash</b> and <b>Diameter of clear zone around the disc (mm)</b>. What is the independent variable?",
      "Type of mouthwash", ["Diameter of the clear zone", "Number of bacteria on the plate", "Temperature of the incubator"],
      "The first column usually shows what was changed: the type of mouthwash. The clear zone diameter is measured, so it is the dependent variable."),
    F('grammar: the stem now reads "how the number of hours"', M('dependent variable', "A teacher tests how the number of hours students slept the night before affects their reaction time. Reaction time is found by catching a falling ruler. Which is the dependent variable?",
      "Distance the ruler falls before it is caught", ["Number of hours of sleep", "Length of the ruler", "Height the ruler is dropped from"],
      "The ruler distance is measured, so it is the dependent variable. Hours of sleep is the independent variable.")),
    M('dependent variable', "A student adds amylase to starch at pH 4, 5, 6, 7 and 8 and times how long it takes for all the starch to be digested. What is the dependent variable?",
      "Time until no starch is left", ["The pH of the mixture", "The volume of amylase used", "The temperature of the water bath"],
      "Time is what is measured. The pH is changed on purpose (independent); amylase volume and temperature are kept the same."),
    M('definitions', "Which statement about variables is correct?",
      "The independent variable is the factor the scientist changes on purpose",
      ["The independent variable is the factor the scientist measures at the end", "The dependent variable is the factor the scientist keeps the same", "The dependent variable is the factor the scientist changes on purpose"],
      "You change the independent variable and measure the dependent variable. Factors kept the same are control variables."),
    M('naming precisely', "In an investigation, four different antibiotics are placed on a bacterial plate. A student writes the independent variable as 'antibiotic'. What is a better answer?",
      "Type of antibiotic", ["Bacteria", "Size of the clear zone", "Antibiotics kill bacteria"],
      "The variable must be named precisely. The student changes which antibiotic is used, so the independent variable is the type of antibiotic."),
    M('time as a variable', "A student weighs one potato cylinder in a sugar solution every 15 minutes for two hours. What is the independent variable?",
      "Time", ["Mass of the potato cylinder", "Concentration of the sugar solution", "Type of potato"],
      "The student chooses when to measure, so time is the independent variable. The mass is measured, so it is the dependent variable."),
    M('control or not', "In an investigation of how the length of exercise affects heart rate, the room is kept at 20 °C. What kind of variable is the room temperature?",
      "A control variable", ["The independent variable", "The dependent variable", "An anomalous result"],
      "Room temperature is kept the same in every test, so it is a control variable. It is not changed or measured."),
    M('dependent variable', "A scientist shines lights of different brightness into a person's eye and measures the diameter of the pupil. What is the dependent variable?",
      "Diameter of the pupil", ["Brightness of the light", "Distance of the light from the eye", "Age of the person"],
      "The pupil diameter is measured, so it is the dependent variable. Light brightness is changed on purpose."),
    M('read a results table', "A results table has the columns <b>Age of person (years)</b> and <b>Number of push-ups in one minute</b>. What is the dependent variable?",
      "Number of push-ups in one minute", ["Age of the person in years", "Length of time of the test", "Number of people tested"],
      "The push-ups are counted (measured), so this is the dependent variable. Age is the independent variable."),
    M('both variables', "A student asks: 'Does the length of time spent running affect breathing rate?' Which row gives both variables correctly?",
      "Independent: time spent running; dependent: breathing rate",
      ["Independent: breathing rate; dependent: time spent running", "Independent: breathing rate; dependent: heart rate", "Independent: room temperature; dependent: breathing rate"],
      "The question names what is changed (time running) and what is measured (breathing rate).")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-PRAC-SAFETY-HAZARD-PRECAUTION */
  T('HBI-PRAC-SAFETY-HAZARD-PRECAUTION', 'State or explain safety precautions for a practical', [
    M('precaution with reason', "A student burns a piece of food under a boiling tube of water. Which precaution and reason go together correctly?",
      "Wear eye protection, because hot water may spit out of the tube",
      ["Wear eye protection, because the food will lose mass as it burns", "Use the same mass of food, because hot water may spit out", "Stir the water, because the needle is sharp"],
      "Goggles protect the eyes from spitting hot water. Using the same mass of food makes the test fair, but it is not a safety precaution."),
    M('precaution with reason', "Why should the boiling tube of water be held in a clamp or test-tube holder while food burns under it?",
      "To avoid burning the hands on the hot tube", ["To make sure all the energy goes into the water", "To keep the mass of the water the same", "To stop the food from going out too soon"],
      "The tube gets very hot. A clamp or holder keeps your hands away from it."),
    M('precaution with reason', "In a food-energy practical, students are told never to taste the food samples. Why?",
      "Some students may be allergic to a food, such as nuts", ["Tasting would change the mass of the food sample", "Food that is tasted will not burn in the flame", "The food would warm up and give a wrong reading"],
      "Some people have serious allergic reactions. Tasting food in a laboratory is also unsafe because it may be contaminated."),
    M('precaution with reason', "Several students use the same spirometer to measure their breathing. Which precaution reduces the risk of infection?",
      "Sterilise the mouthpiece between users, or give each person a new one", ["Breathe in and out as quickly as possible, so that less saliva gets onto it", "Use the spirometer in a warm room", "Wear safety goggles while breathing"],
      "Saliva on a shared mouthpiece can carry pathogens. Sterilising it, or using a new one, stops them spreading."),
    M('precaution with reason', "A student breathes out through a tube into a test tube of limewater. Which precaution should the student take?",
      "Breathe out gently and never breathe in through the tube", ["Breathe in quickly through the tube before breathing out", "Heat the limewater gently before breathing into it", "Hold the tube tightly with both hands"],
      "If the student breathes in through the tube, limewater could be drawn into the mouth."),
    M('hazard and precaution', "Biuret reagent is an irritant. Which precaution should a student take when using it?",
      "Wear eye protection and wash any splashes off the skin", ["Keep the reagent in a warm water bath", "Use a larger volume so it works faster", "Stand up and keep stools under the bench"],
      "An irritant can harm the eyes and skin. Goggles protect the eyes, and washing removes any reagent from the skin."),
    M('hazard and precaution', "A glass beaker breaks on the floor during a practical. What should be done?",
      "Clear up the pieces with a dustpan and brush", ["Pick up the pieces carefully with bare hands", "Push the pieces under the bench to deal with later", "Carry on, but walk around the pieces"],
      "Broken glass can cut. Using a dustpan and brush keeps hands away from the sharp edges."),
    M('precaution with reason', "A student puts a hand in water to test temperature receptors in the skin. What should the student do first?",
      "Check the water temperature with a thermometer", ["Dry the hand completely with a towel", "Put on a glove to protect the skin", "Ask a partner to time the test"],
      "Very hot or very cold water could damage the skin. Checking with a thermometer first makes sure it is safe."),
    M('precaution with reason', "Why should the lid of a Petri dish of bacteria stay taped shut while a student looks at the colonies?",
      "To reduce the risk of pathogens escaping and infecting people", ["To keep the agar from drying out while the dish sits in the warm room", "To make the colonies grow faster and bigger", "To keep the temperature inside the dish the same"],
      "Bacteria grown in a dish could include harmful types. A taped lid stops them escaping."),
    M('definitions', "In a risk assessment, what is a <b>hazard</b>?",
      "Something that could cause harm", ["An action taken to reduce a risk", "A result that does not fit the pattern", "A factor that is kept the same"],
      "A hazard is the source of possible harm, such as a flame or broken glass. A precaution is what you do to reduce the risk."),
    M('safety or fair test', "Which of these is a <b>safety precaution</b>, not a way of making the test fair?",
      "Tie long hair back when using a flame", ["Use the same volume of water each time", "Use the same mass of food each time", "Keep the food the same distance from the tube"],
      "Tying hair back stops it catching fire. The other three keep variables the same to make the test fair."),
    M('vague answers', "A student writes 'be careful with the Bunsen burner'. Which answer would gain credit?",
      "Keep your face well away from the flame, so you are not burned", ["Be very careful and sensible around the burner", "Wear safety equipment while the burner is on", "Make sure that you watch the flame carefully the whole time it is lit"],
      "An answer must name a real action and say what harm it prevents. 'Be careful' and 'wear safety equipment' are too vague.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-PRAC-IMPROVE-RELIABILITY-REPEATS-SAMPLE */
  T('HBI-PRAC-IMPROVE-RELIABILITY-REPEATS-SAMPLE', 'Improve reliability with repeats, means and larger samples', [
    M('meaning of reliable', "What does it mean if the results of an investigation are <b>reliable</b>?",
      "Similar results are obtained when the investigation is repeated", ["The results are very close to the true value of what is being measured", "The results match what the student predicted", "Only one set of results was needed"],
      "Reliable results can be repeated. Being close to the true value is accuracy."),
    F('a distractor (repeat one temperature many times) could be argued to improve reliability; replaced with a clearly wrong option', M('repeats and means', "A student measured the time for amylase to digest starch once at each temperature. How could the student make the results more reliable?",
      "Repeat each temperature three times and calculate a mean", ["Use a more expensive stopwatch for each test", "Measure the temperature of the water bath more often", "Change the temperature in each repeat"],
      "Repeating each test and finding a mean reduces the effect of one unusual result. A repeat keeps the conditions the same.")),
    M('sample size', "A scientist tests a new diet on 5 people. Another scientist tests it on 500 people. Why is the second study more reliable?",
      "The mean is less affected by a few unusual people", ["Larger studies always use better equipment", "More people means the diet must work", "The second study can skip using a control group"],
      "With many people, one person who reacts unusually has little effect on the mean."),
    { skill: 'anomalous results', gen: function () {
      var base = rint(30, 70), r = [base + rint(-2, 2), base + rint(-2, 2), base + rint(-2, 2)];
      var anomaly = base + pick([-1, 1]) * rint(15, 25), pos = rint(0, 3); r.splice(pos, 0, anomaly);
      var kept = r.filter(function (_, i) { return i !== pos; }), mean = R.roundDp((kept[0] + kept[1] + kept[2]) / 3, 1);
      return nq("A student timed how long it took for an enzyme to digest a protein, in seconds, four times: <b>" + r.join(', ') + "</b>. One result is anomalous. Calculate the mean time, leaving out the anomalous result. Give your answer to 1 decimal place.",
        mean, 's', "The anomaly is " + anomaly + " s: it does not fit the others. Mean = (" + kept.join(' + ') + ") ÷ 3 = " + mean.toFixed(1) + " s.", { tol: 0.05, display: mean.toFixed(1) });
    } },
    { skill: 'anomalous results', gen: function () {
      var base = rint(12, 30), r = [base - 1, base, base + 1, base + pick([-2, 2])].sort(function () { return Math.random() - 0.5; });
      var anomaly = base + pick([-1, 1]) * rint(8, 12), pos = rint(0, 4); r.splice(pos, 0, anomaly);
      var others = r.filter(function (_, i) { return i !== pos; });
      var wrong = []; others.forEach(function (v) { if (wrong.indexOf(String(v)) < 0 && String(v) !== String(anomaly)) wrong.push(String(v)); });
      return mq("Five students each counted their breaths in one minute at rest: <b>" + r.join(', ') + "</b>. Which value is anomalous?",
        String(anomaly), wrong.slice(0, 3), "An anomalous result does not fit the pattern of the others. " + anomaly + " is far from the rest, which are all close to " + base + ".");
    } },
    M('repeats and means', "A student's results include one anomalous value. What should the student do with it when calculating the mean?",
      "Leave it out, then find the mean of the other values", ["Include it, because every result must be used", "Double it, to balance the other results", "Use only the anomalous value as the result"],
      "An anomaly would pull the mean away from the true pattern, so it is left out unless the question says to use every value."),
    M('reliability or accuracy', "A student wants to improve the <b>reliability</b> of their results. Which suggestion would do this?",
      "Repeat the whole investigation and compare the results", ["Use a thermometer that reads to 0.1 °C", "Use a gas syringe to measure the gas instead of counting the bubbles", "Measure the length with a ruler marked in mm"],
      "Repeating and comparing results improves reliability. The other changes give more accurate measurements, which is accuracy."),
    M('generalising', "A study of reaction times used only 15-year-old boys. How could it be changed so the conclusion applies to more people?",
      "Also test girls, and people of other ages", ["Test the same boys again next week", "Test the boys at a lower room temperature", "Ask the boys to practise first"],
      "To show a result is true in general, test other groups too, such as both sexes and a range of ages."),
    M('checking results', "Apart from repeating the investigation, how could a student check whether the results are reliable?",
      "Compare them with results from another group doing the same investigation", ["Draw a bar chart of the results instead of a line graph so that they are clearer", "Write the results in a table with units", "Round the results to fewer decimal places"],
      "If another group's results are similar, this supports the reliability of the results."),
    M('widening the data', "A teacher measured lung volume in students aged 11, 14 and 17, testing 3 students in each age. Which change would give a more reliable pattern?",
      "Test more students of each age, and test every age from 11 to 17", ["Test the same 9 students again with a different spirometer", "Test only the 17-year-olds, as they have the largest lungs", "Test the students only once, but very carefully"],
      "More people in each group gives a better mean, and testing every age shows the pattern with smaller gaps."),
    S('repeats and means', "Which changes would improve the reliability of an investigation?",
      ["Repeat each test and calculate a mean", "Increase the number of people tested", "Compare results with another group"],
      ["Change the independent variable in each repeat", "Use a more accurate measuring instrument"],
      "Repeats, larger samples and comparing with others all improve reliability. A more accurate instrument improves accuracy, not reliability."),
    M('sample size', "A student tests one friend's heart rate before and after drinking coffee. The heart rate rises. Why is this conclusion weak?",
      "Only one person was tested, so the result may not be typical", ["Heart rate cannot be measured accurately at all", "Coffee is a liquid, so it cannot have any effect on the heart rate of a person", "The friend should have been tested by a doctor"],
      "One person may react in an unusual way. Testing many people and finding a mean gives a more reliable result.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-PRAC-NAME-CONTROL-VARIABLES */
  T('HBI-PRAC-NAME-CONTROL-VARIABLES', 'State the variables to control in an investigation', [
    M('enzyme investigations', "A student investigates the effect of pH on the time amylase takes to digest starch. Which is a control variable?",
      "Temperature of the mixture", ["pH of the mixture", "Time taken to digest the starch", "Colour of the iodine solution"],
      "Temperature must be kept the same so that only pH can affect the time. pH is the independent variable and time is the dependent variable."),
    S('enzyme investigations', "A student investigates the effect of temperature on the activity of the enzyme amylase. Which factors should be kept the same?",
      ["Volume of amylase solution", "Concentration of starch solution", "pH of the mixture"], ["Temperature of the water bath", "Time taken for the starch to be digested"],
      "Volume, concentration and pH are control variables. Temperature is changed (independent) and the time is measured (dependent)."),
    S('food energy', "A student compares the energy in different foods by burning them under a tube of water. Which factors should be controlled?",
      ["Mass of food burned", "Volume of water in the tube", "Distance between the flame and the tube"], ["Type of food", "Temperature rise of the water"],
      "Mass, volume of water and distance must stay the same. The type of food is changed and the temperature rise is measured."),
    M('investigations on people', "A student investigates how the speed of walking affects heart rate. Which factor should be controlled?",
      "The length of time spent walking", ["The speed of walking", "The heart rate after walking", "The number of beats counted"],
      "Each walk should last the same time, so only speed can affect heart rate. Speed is the independent variable."),
    M('naming precisely', "A student writes 'amount of enzyme' as a control variable. Which answer is more precise?",
      "Volume of enzyme solution", ["Amount of enzyme used", "Same conditions for the enzyme", "Fair amount of enzyme"],
      "'Amount' is too vague. Name the quantity: the volume (or concentration) of the enzyme solution."),
    M('not the independent variable', "In a test of how temperature affects amylase, a student lists temperature as a control variable. Why is this wrong?",
      "Temperature is the factor being changed, so it cannot be kept the same", ["Temperature cannot be measured accurately enough", "Temperature has no effect on how enzymes such as amylase work in a test tube", "Temperature is the dependent variable here"],
      "A control variable is kept the same. The independent variable is the one being changed, so it is never a control variable."),
    M('osmosis and cubes', "A student puts potato cylinders into sugar solutions of different concentrations. Which factor should be controlled?",
      "Starting length and diameter of each cylinder", ["Concentration of the sugar solution", "Change in mass of each cylinder", "Number of solutions used"],
      "Cylinders of the same size give a fair comparison. Concentration is changed, and change in mass is measured."),
    S('microbe investigations', "A student tests the effect of different antibiotics on bacteria on agar plates. Which factors should be controlled?",
      ["Type of bacteria on each plate", "Incubation temperature", "Size of each paper disc"], ["Type of antibiotic", "Diameter of each clear zone"],
      "The bacteria, temperature and disc size stay the same. The antibiotic is changed and the clear zone is measured."),
    M('why control', "Why must control variables be kept the same in an investigation?",
      "So that only the independent variable can cause a change in the results", ["So that the investigation can be finished more quickly and with less equipment", "So that the dependent variable stays the same", "So that the results are all the same value"],
      "If other factors changed too, you could not tell which factor caused the change in the results."),
    M('osmosis and cubes', "A student times how long cubes of agar take to change colour in acid at different temperatures. Which factor should be controlled?",
      "Size of each agar cube", ["Temperature of the acid", "Time for the cube to change colour", "Colour of the cube at the end"],
      "Cube size affects how fast acid diffuses in, so it must be kept the same. Temperature is changed and the time is measured."),
    M('naming precisely', "A student writes 'keep the conditions the same' as a control variable. Why does this not gain credit?",
      "It does not name an actual factor, such as temperature or volume", ["It names the dependent variable by mistake", "Conditions can never be kept the same", "It should say 'make the test fair' instead, because that is the reason for it"],
      "A control variable must be a named factor, for example 'temperature' or 'volume of solution'."),
    M('investigations on people', "Students catch a falling ruler to test how music affects reaction time. Which factor should be controlled?",
      "The hand used to catch the ruler", ["The type of music played", "The distance the ruler falls", "The reaction time of each student"],
      "Using the same hand each time keeps the test fair. Music is the independent variable and the distance is measured.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-PRAC-EXPLAIN-CONTROL-OR-METHOD-STEP */
  T('HBI-PRAC-EXPLAIN-CONTROL-OR-METHOD-STEP', 'Describe a control or explain why a step is in a method', [
    M('describe a control', "Paper discs soaked in antibiotics are placed on an agar plate of bacteria. Which is a suitable control?",
      "A paper disc soaked in sterile water, with no antibiotic", ["A plate with antibiotic discs but no bacteria", "A disc soaked in a stronger antibiotic", "A plate kept at a lower temperature"],
      "The control is the same set-up without the factor being tested. A disc with no antibiotic shows what happens to the bacteria without it.", { family: 'g02-discs' }),
    M('purpose of a control', "In an antibiotic investigation, the control disc has no antibiotic and bacteria grow right up to it. What does this control show?",
      "That the clear zones are caused by the antibiotics, not the paper discs", ["That the bacteria were the same type on every plate", "That the antibiotics work best when the plates are kept at a high temperature", "That more repeats are needed for reliable results"],
      "If bacteria grow around a plain disc, the paper itself does not kill them. So any clear zone must be caused by the antibiotic.", { family: 'g02-discs' }),
    M('boiled enzyme', "In an enzyme investigation, one tube has boiled enzyme instead of fresh enzyme. Why?",
      "Boiling denatures the enzyme, so the tube shows what happens with no active enzyme", ["Boiling makes the enzyme work faster, so it shows the best result", "Boiling sterilises the enzyme, so it cannot be contaminated by bacteria from the air", "Boiling makes the enzyme more concentrated, so less is needed"],
      "A boiled enzyme has lost its shape. Any change in that tube cannot be caused by enzyme activity."),
    M('reason for a step', "Potato cylinders are taken out of a salt solution and blotted with paper towel before being weighed. Why?",
      "To remove liquid on the surface, which would add extra mass", ["To stop the cylinders taking in any more water by osmosis", "To kill the potato cells so that they stop changing", "To make the cylinders the same length again"],
      "Solution on the outside is not water taken in by the cells. If it stays on, the mass reading is too high."),
    M('percentage change', "Why is the percentage change in mass used to compare potato pieces, rather than the change in grams?",
      "The pieces start with different masses, so percentage change allows a fair comparison", ["Percentage change is always a positive number, so the results are easier to plot on a graph", "Percentage change does not need a balance", "Percentage change removes the need for repeats"],
      "A large piece could gain more grams just because it is bigger. Percentage change compares the change with each starting mass."),
    M('percentage change', "Potato piece P starts at 2.0 g and piece Q starts at 4.0 g. Both gain 0.4 g. What does this show?",
      "P changed by 20% and Q by 10%, so P changed by a larger proportion", ["Both changed by the same amount, so the result is the same", "Q changed more, because it is the larger piece", "P changed by 10% and Q by 20%, so Q changed more"],
      "0.4 ÷ 2.0 × 100 = 20% and 0.4 ÷ 4.0 × 100 = 10%. The same gain in grams is a bigger proportion of the smaller piece."),
    M('reason for a step', "A bag of Visking tubing filled with sugar solution is rinsed on the outside before it is put into a beaker of water. Why?",
      "To remove sugar solution spilt on the outside, which would get into the water", ["To make the tubing more permeable to sugar molecules", "To check that the bag does not have any holes before it is placed in the water", "To cool the sugar solution down before the test"],
      "Any sugar on the outside would go straight into the water, giving a false result for diffusion through the tubing."),
    M('describe a control', "In the control tube of an enzyme investigation, the enzyme is replaced with the same volume of water. Why the <b>same volume</b>?",
      "So the total volume is the same as in the test tubes", ["So the control reacts faster than the test tubes", "So the water can digest the substrate as well as the enzyme does", "So that the temperature of the control is higher"],
      "Keeping the volume the same means the only difference between the tubes is whether the enzyme is present."),
    M('control or control variable', "What is the difference between a control experiment and a control variable?",
      "A control experiment leaves out the tested factor; a control variable is a factor kept the same",
      ["A control experiment is repeated several times; a control variable is changed on purpose each time", "A control experiment is the same as a control variable", "A control experiment is measured; a control variable is calculated"],
      "A control experiment is a whole set-up without the factor being tested. A control variable is one factor kept constant in every test."),
    M('describe a control', "A student sets up a control dish for an antibiotic test. The dish has agar and a plain disc, but no bacteria. Why is this not a useful control?",
      "With no bacteria, it cannot show how bacteria grow when there is no antibiotic", ["The dish should have contained a stronger antibiotic, so that the effect is easier to see", "The agar should have been left out of the dish", "The dish should have been kept in a fridge"],
      "The control must be the same as the test except for the antibiotic. Leaving out the bacteria changes the whole set-up."),
    M('describe a control', "Lipase digests the fat in milk, and the pH falls. Bile salts are added to help. Which control shows that bile salts alone do not lower the pH?",
      "A tube of milk and bile salts, with water in place of lipase", ["A tube of milk and lipase, with extra bile salts", "A tube of lipase only, with no milk at all", "A tube of milk, lipase and bile salts at a higher temperature"],
      "If the pH does not fall in the tube without lipase, the fall in the test tube is caused by lipase, not by bile salts."),
    M('reason for a step', "In a starch-digestion experiment, drops of the mixture are added to iodine solution on a spotting tile every 30 seconds. Why?",
      "To find out when the starch has all been digested, as the iodine stops turning blue-black", ["To speed up the digestion of the starch by adding a little more iodine to the mixture each time", "To keep the pH of the mixture at the same value", "To measure the temperature of the mixture each time"],
      "Iodine turns blue-black with starch. When it stays orange-brown, there is no starch left.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-PRAC-EVALUATE-MEASUREMENT-ACCURACY */
  T('HBI-PRAC-EVALUATE-MEASUREMENT-ACCURACY', 'Identify a measurement weakness and improve accuracy', [
    M('bubbles and gas volume', "A student counts bubbles of gas to measure the rate of an enzyme reaction. Why is this not an accurate method?",
      "The bubbles are not all the same size", ["Bubbles cannot be seen in a test tube", "The gas dissolves faster than it is made", "Counting takes too long to repeat"],
      "Bubbles vary in size, so the same number of bubbles can be different volumes of gas."),
    M('bubbles and gas volume', "How could the student measure the gas from the enzyme reaction more accurately?",
      "Collect it in a gas syringe and read the volume", ["Count the bubbles for twice as long", "Ask two people to count the bubbles", "Count only the large bubbles"],
      "A gas syringe (or upturned measuring cylinder) measures the actual volume of gas, so bubble size does not matter."),
    M('subjective judgements', "Students give each tube a score from 0 to 5 for how cloudy it looks. Why are these results not accurate?",
      "The scores are based on judgement, so different people may score differently", ["The scores are whole numbers, so they must be accurate and close to the true value", "Five tubes is too many to score in one lesson", "Cloudiness cannot change during an experiment"],
      "A score by eye is subjective. An instrument such as a colorimeter would give a measured value."),
    F('the two neighbours of the best temperature could give almost equal times, so the side to test was arguable; the answer now tests both sides of the best result', { skill: 'finding an optimum', gen: function () {
      var temps = [20, 30, 40, 50, 60, 70], peak = pick([1, 2, 3, 4]);
      var times = temps.map(function (t, i) { var d = Math.abs(i - peak); return d === 0 ? rint(70, 110) : d === 1 ? rint(150, 210) : d === 2 ? rint(260, 340) : rint(400, 520); });
      var tbl = '<table class="mc-table"><tr><th>Temperature (°C)</th>' + temps.map(function (t) { return '<td>' + t + '</td>'; }).join('') + '</tr><tr><th>Time to digest starch (s)</th>' + times.map(function (t) { return '<td>' + t + '</td>'; }).join('') + '</tr></table>';
      var p = temps[peak], right = "Every 2 °C from " + (p - 10) + " °C to " + (p + 10) + " °C";
      var far = peak >= 3 ? [20, 30] : [50, 60];
      var w = ["Every 2 °C from " + far[0] + " °C to " + far[1] + " °C", "Every 10 °C from 80 °C to 100 °C", "At " + p + " °C only, repeated three times"];
      return mq("A student finds the time for amylase to digest starch at six temperatures." + tbl + "The student wants to find the optimum temperature more accurately. Which extra temperatures should the student test?",
        right, w, "The shortest time is at " + p + " °C, so the optimum is close to " + p + " °C: somewhere between " + (p - 10) + " °C and " + (p + 10) + " °C. Small steps across this range find it more accurately.");
    } }),
    M('contamination', "A student tests distilled water with Biuret reagent as a check. It turns purple. What is the most likely reason?",
      "The test tube was dirty and contained some protein", ["Distilled water always contains protein", "Biuret reagent turns purple with water", "The student should have heated the tube"],
      "Distilled water has no protein, so a purple colour means the equipment was contaminated."),
    M('vague answers', "A student writes 'use better equipment' to improve accuracy. Which answer would gain credit?",
      "Measure the volume of gas with a gas syringe instead of counting bubbles", ["Use better and newer equipment in every test", "Use equipment from a better laboratory", "Repeat the experiment several more times using better equipment each time"],
      "A credited answer names the equipment and what it measures. 'Better equipment' does not say how the measurement improves."),
    M('meaning of accurate', "What does it mean if a result is <b>accurate</b>?",
      "It is close to the true value", ["It is the same every time it is repeated", "It is given to many decimal places", "It fits the student's prediction"],
      "Accurate means close to the true value. Getting the same result when repeating is reliability."),
    M('reliability or accuracy', "Which change would improve the <b>accuracy</b> of a measurement, rather than its reliability?",
      "Use a colorimeter instead of judging colour by eye", ["Repeat each test three times", "Test a larger number of people", "Compare results with another group"],
      "A colorimeter gives a measured value in place of a judgement, which is closer to the true value. The others improve reliability."),
    M('timing errors', "A student times by eye how long a blue colour takes to disappear. Why might the times be inaccurate?",
      "It is hard to judge the exact moment the colour has gone", ["Stopwatches cannot measure times under one minute", "Blue colours always fade at the same rate, whatever the conditions are", "The colour change happens before the timer starts"],
      "The end point of a colour change is a judgement, so the times can vary. A colorimeter, or a colour standard to compare with, would help."),
    M('controlling temperature', "The temperature of a water bath heated with a Bunsen burner goes up and down by several degrees. How could the student control it better?",
      "Use an electric water bath with a thermostat", ["Measure the temperature only at the start", "Use a larger Bunsen flame", "Stir the water with a thermometer once"],
      "A thermostatically controlled water bath keeps the temperature steady, so it really is the stated value."),
    M('sampling interval', "A student tests a sample for starch every 60 seconds. The starch has gone by the 300-second test. Why is 300 s not an accurate time?",
      "The starch could have gone at any time after the 240-second test", ["The starch must have gone at exactly 300 seconds", "The iodine solution takes about 60 seconds to react with starch each time", "The student should have used a longer timer"],
      "Testing every 60 s only tells you the starch went between 240 s and 300 s. Testing more often, such as every 10 s, is more accurate."),
    M('finding an optimum', "A student tests an enzyme at 10, 30, 50 and 70 °C. Why can the student not find the optimum temperature accurately?",
      "The gaps between the temperatures are too large", ["Enzymes do not have an optimum temperature, so it cannot be found", "Four temperatures is too many to test", "The temperatures should all be above 70 °C"],
      "The optimum could be anywhere near the best result. More temperatures with smaller gaps would find it more accurately.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-PRAC-PLAN-CONTROLLED-LAB-METHOD */
  T('HBI-PRAC-PLAN-CONTROLLED-LAB-METHOD', 'Plan or specify a single-factor laboratory method', [
    M('temperature control', "In a plan to test amylase at different temperatures, why are the amylase and starch put in the water bath in separate tubes for 5 minutes before they are mixed?",
      "So both solutions reach the bath temperature before the reaction starts", ["So the amylase can start digesting the starch early, before the timing starts", "So the solutions cool down to room temperature", "So the volume of each solution increases"],
      "If they were mixed at once, the reaction would start at the wrong temperature."),
    M('temperature control', "Which is the best way to keep a test tube of enzyme at 40 °C during an investigation?",
      "Stand it in a water bath at 40 °C", ["Heat it directly over a Bunsen flame", "Hold it in a warm hand", "Leave it on the bench in a warm room"],
      "A water bath keeps the temperature steady and even. Heating with a flame is uneven and hard to control."),
    M('range of values', "A student plans to test the effect of pH on an enzyme. Which set of pH values is best?",
      "pH 4, 5, 6, 7, 8 and 9", ["pH 4 and 9 only", "pH 7 only, repeated five times", "pH 6, 7 and 8 only"],
      "At least five values across a sensible range are needed to see a pattern and find an optimum."),
    M('what to measure', "A student plans to measure how fast amylase digests starch. What should the student measure?",
      "The time until a sample no longer turns iodine blue-black", ["Whether the mixture looks thicker or thinner", "The colour of the amylase solution", "The temperature of the starch at the start"],
      "A quantitative measure is needed. When iodine stays orange-brown, the starch has been digested."),
    M('osmosis method', "Which order of steps is correct for finding the concentration of potato cell contents?",
      "cut equal pieces → weigh → leave in solutions → blot dry → reweigh",
      ["weigh → cut equal pieces → blot dry → leave in solutions → reweigh", "cut equal pieces → leave in solutions → weigh → reweigh → blot dry", "leave in solutions → cut equal pieces → weigh → blot dry → reweigh"],
      "Pieces must be cut and weighed before they go into the solutions, then blotted before they are weighed again."),
    { skill: 'osmosis method', gen: function () {
      var conc = [0, 0.2, 0.4, 0.6, 0.8, 1.0], zeroAt = pick([1, 2, 3]);   // zero lies between conc[zeroAt] and conc[zeroAt+1]
      var ch = conc.map(function (c, i) { var d = i - zeroAt; return d <= 0 ? R.roundDp(rint(6, 9) * (1 - d) + rint(0, 9) / 10, 1) : -R.roundDp(rint(4, 8) * d + rint(0, 9) / 10, 1); });
      var tbl = '<table class="mc-table"><tr><th>Sucrose concentration (mol/dm³)</th><th>Percentage change in mass (%)</th></tr>' + conc.map(function (c, i) { return '<tr><td>' + c.toFixed(1) + '</td><td>' + (ch[i] > 0 ? '+' : '') + ch[i].toFixed(1) + '</td></tr>'; }).join('') + '</table>';
      var lo = conc[zeroAt].toFixed(1), hi = conc[zeroAt + 1].toFixed(1);
      var w = []; for (var i = 0; i < 5; i++) if (i !== zeroAt) w.push("Between " + conc[i].toFixed(1) + " and " + conc[i + 1].toFixed(1) + " mol/dm³");
      return mq("A student leaves potato pieces in sucrose solutions and records the percentage change in mass." + tbl + "Between which concentrations is the concentration of the potato cell contents?",
        "Between " + lo + " and " + hi + " mol/dm³", w.slice(0, 3), "Where the mass does not change, there is no net movement of water, so the solution matches the cell contents. The change goes from + to − between " + lo + " and " + hi + " mol/dm³.");
    } },
    M('agar cube method', "A student wants to find how temperature affects the rate of diffusion of acid into agar cubes that contain an indicator. What should the student measure?",
      "The time for each cube to change colour completely", ["The mass of each cube before the test", "The colour of the acid at the end", "The temperature of the room"],
      "As acid diffuses in, the indicator changes colour. The time for the whole cube to change shows the rate of diffusion."),
    M('precise instructions', "A student's plan says 'add some enzyme to the starch'. Which version is better?",
      "Add 5 cm³ of 1% amylase solution to the starch", ["Add a little enzyme to the starch", "Add enzyme until the starch looks right", "Add plenty of enzyme to the starch"],
      "A good method states the volume and concentration, so it can be repeated exactly."),
    S('precise instructions', "A method says: 'Mix enzyme and starch, keep warm, and test for starch.' What extra information is needed so another person can repeat it exactly?",
      ["The volume and concentration of each solution", "The temperature the mixture is kept at", "How often samples are tested for starch"],
      ["The name of the student who did the test", "The colour of the test tube rack"],
      "To repeat a method you need the quantities, the conditions and how the result was measured."),
    M('osmosis method', "Why are potato pieces left in the sucrose solutions for at least 30 minutes?",
      "So enough water moves by osmosis to give a measurable change in mass", ["So the potato cells have time to divide and grow larger in the solution", "So the sucrose solution can evaporate", "So the potato pieces warm up to 37 °C"],
      "Osmosis takes time. A short time would give changes too small to measure clearly."),
    M('agar cube method', "A student plans to test how surface area to volume ratio affects diffusion. Which method is best?",
      "Cut cubes of different sizes from one block of agar, put them in the same acid, and time each colour change",
      ["Cut cubes of one size from one block of agar, put them in acids of different strengths, and time each colour change", "Cut cubes of different sizes and leave them on the bench for a day", "Cut one large cube and measure how long it takes to dry out"],
      "Only the cube size, and so the surface area to volume ratio, should change. The acid and agar must be the same."),
    M('range of values', "A student plans to test an enzyme at only 20 °C and 60 °C. Why is this not a good plan?",
      "Two values are too few to show a pattern or find an optimum", ["The enzyme will not work at either temperature", "The student should only use one temperature, repeated several times", "60 °C is too low to affect an enzyme"],
      "At least five values are needed. With only two, you cannot see where the rate is highest.")
  ], { date: '2026-10-13', dropped: [] });
})();
