/* Group G17 mastery bank: More maths skills for biology data (Grade 8 block).
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


  function pie(angles, names) {
    var cx = 130, cy = 130, r = 110, a0 = -90, g = '', cols = ['#cfe3f7', '#f9d8c4', '#d8eccf', '#efe0f5', '#fdf0b8'];
    angles.forEach(function (ang, i) {
      var a1 = a0 + ang, t0 = a0 * Math.PI / 180, t1 = a1 * Math.PI / 180, mid = (a0 + ang / 2) * Math.PI / 180;
      var x0 = cx + r * Math.cos(t0), y0 = cy + r * Math.sin(t0), x1 = cx + r * Math.cos(t1), y1 = cy + r * Math.sin(t1);
      g += '<path d="M' + cx + ' ' + cy + ' L' + x0.toFixed(1) + ' ' + y0.toFixed(1) + ' A' + r + ' ' + r + ' 0 ' + (ang > 180 ? 1 : 0) + ' 1 ' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' Z" fill="' + cols[i] + '" stroke="' + INK + '" stroke-width="1.5"/>';
      var tx = cx + r * 0.6 * Math.cos(mid), ty = cy + r * 0.6 * Math.sin(mid);
      g += '<text x="' + tx.toFixed(1) + '" y="' + (ty - 2).toFixed(1) + '" font-size="15" font-weight="700" text-anchor="middle" fill="' + INK + '">' + names[i] + '</text><text x="' + tx.toFixed(1) + '" y="' + (ty + 15).toFixed(1) + '" font-size="13" text-anchor="middle" fill="' + INK + '">' + ang + '°</text>';
      a0 = a1;
    });
    return '<svg class="mc-svg mc-svg-small" viewBox="0 0 260 260" role="img" aria-label="Pie chart with sectors ' + names.join(', ') + ' and their angles">' + g + '</svg>';
  }
  function sf3(x) { var p = Math.pow(10, Math.floor(Math.log10(Math.abs(x))) - 2); return Math.round(x / p + 1e-9) * p; }

  /* ====================================================================== HBI-MATH-PIE-CHART-SECTORS */
  T('HBI-MATH-PIE-CHART-SECTORS', 'Convert between pie-chart sectors, percentages and counts', [
    { skill: 'angle from percentage', gen: function () {
      var p = pick([5, 10, 15, 20, 25, 30, 35, 40, 45, 55, 60, 65]);
      return nq("In a pie chart, " + p + "% of the people in a survey have blood group A. What angle should the sector for blood group A have?", Math.round(p * 3.6 * 10) / 10, '°',
        "Angle = percentage × 3.6, because 360 ÷ 100 = 3.6. So " + p + " × 3.6 = " + (Math.round(p * 36) / 10) + "°.");
    } },
    { skill: 'percentage from angle', gen: function () {
      var ang = pick([18, 36, 54, 72, 90, 108, 126, 144, 162, 198, 216]);
      return nq("A sector of a pie chart has an angle of " + ang + "°. What percentage of the whole does it show?", Math.round(ang / 3.6), '%',
        "Percentage = angle ÷ 360 × 100 = " + ang + " ÷ 360 × 100 = " + Math.round(ang / 3.6) + "%.");
    } },
    F("'180 types of antibiotic' is not realistic; the pie chart now shows samples of bacteria", { skill: 'count from angle', gen: function () {
      var tot = pick([40, 60, 90, 120, 180]), per = 360 / tot, n = rint(3, Math.floor(tot / 2)), ang = n * per;
      return nq("A pie chart shows the results for " + tot + " samples of bacteria. One sector has an angle of " + ang + "°. How many samples does this sector show?", n, 'samples',
        "Each sample takes 360 ÷ " + tot + " = " + per + "°. So " + ang + " ÷ " + per + " = " + n + " samples. Do not give the angle as the answer.");
    } }),
    { skill: 'degrees per item', gen: function () {
      var tot = pick([20, 24, 30, 36, 40, 45, 60, 72, 90]);
      return nq("A pie chart shows the results for " + tot + " students. How many degrees stand for one student?", 360 / tot, '°',
        "360 ÷ " + tot + " = " + (360 / tot) + "° for each student.");
    } },
    { skill: 'missing percentage', gen: function () {
      var a = rint(30, 50), b = rint(10, 25), c = rint(3, 10), d = 100 - a - b - c;
      return nq("Blood groups in a country: O is " + a + "%, A is " + b + "%, AB is " + c + "%. The rest are group B. What percentage are group B?", d, '%',
        "The percentages must add up to 100. 100 − " + a + " − " + b + " − " + c + " = " + d + "%.");
    } },
    { skill: 'cycle diagram', gen: function () {
      var ang = pick([45, 90, 135, 180, 225, 270]);
      return nq("A circle diagram shows a 28-day menstrual cycle. One stage takes up a sector of " + ang + "°. How many days does this stage last?", 28 * ang / 360, 'days',
        "Fraction of the circle = " + ang + " ÷ 360. Days = " + ang + " ÷ 360 × 28 = " + (28 * ang / 360) + " days.");
    } },
    { skill: 'read a pie chart', gen: function () {
      var sets = [[144, 108, 72, 36], [180, 90, 54, 36], [126, 108, 90, 36], [162, 90, 72, 36], [108, 108, 90, 54]], s = pick(sets), tot = pick([200, 400, 500, 1000]), k = rint(0, 3), names = ['A', 'B', 'C', 'D'];
      var n = Math.round(s[k] / 360 * tot);
      return nq("The pie chart shows the results of a survey of " + tot + " people. How many people are in sector " + names[k] + "?", n, 'people',
        s[k] + " ÷ 360 × " + tot + " = " + n + " people.", { svg: pie(s, names) });
    } },
    M('why 360', "Why do you divide a sector angle by 360 to find its fraction of the whole?",
      "A full circle is 360°, and the whole circle stands for 100% of the data", ["A pie chart always shows 360 people, whatever the size of the survey", "There are 360 days in a year", "Each sector is 360° wide"],
      "The full circle is the whole of the data."),
    M('common errors', "A student divides a sector angle of 90° by 100 to get a percentage. What should they have done?",
      "Divided 90 by 360, then multiplied by 100", ["Multiplied 90 by 100, then divided the answer by 3.6", "Divided 90 by 3.6, then by 100", "Multiplied 90 by 3.6"],
      "90 ÷ 360 × 100 = 25%."),
    M('common errors', "A sector for 'resistant bacteria' has an angle of 108°. A student says 108 types of antibiotic are shown. What has gone wrong?",
      "They gave the angle, not the number of types", ["They should have multiplied 108 by 360 to get the number of types instead", "They forgot to add 100", "Nothing; the angle is the number"],
      "Turn the angle into a number using the degrees for each item."),
    M('drawing', "What must a pie chart include so that it can be read?",
      "A key or labels for each sector", ["A line of best fit", "A scale on the y-axis", "Error bars"], "Each sector must be named."),
    M('check total', "A student reads four sectors as 40%, 30%, 20% and 15%. What should they notice?",
      "These add to 105%, so a reading must be wrong", ["These add to 100%, so the readings are all correct and need no checking", "Pie charts never add to 100%", "The largest sector must be 50%"],
      "The parts of a whole must add up to 100%.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-MATH-RATE-PER-100000-SCALING */
  T('HBI-MATH-RATE-PER-100000-SCALING', 'Scale a rate per 100 000 people to a whole population', [
    { skill: 'scale up', gen: function () {
      var rate = rint(12, 90) * 5, m = pick([5, 8, 10, 20, 40, 50, 60]), n = rate * m * 10;
      return nq("The death rate from a disease is " + rate + " per 100 000 people. The population is " + m + " million. How many people died?", n, 'people',
        m + " million = " + commas(m * 1000000) + ". " + commas(m * 1000000) + " ÷ 100 000 = " + (m * 10) + ". " + (m * 10) + " × " + rate + " = " + commas(n) + ".");
    } },
    { skill: 'scale up', gen: function () {
      var rate = rint(3, 40), pop = pick([250000, 400000, 750000, 1500000, 2300000]), n = rate * pop / 100000;
      return nq("A town of " + commas(pop) + " people has " + rate + " cases of tuberculosis per 100 000 people. How many cases are there in the town?", n, 'cases',
        commas(pop) + " ÷ 100 000 = " + (pop / 100000) + ". " + (pop / 100000) + " × " + rate + " = " + n + " cases.");
    } },
    { skill: 'other base', gen: function () {
      var rate = rint(2, 30), m = pick([3, 6, 12, 25, 45]), n = rate * m;
      return nq("A disease affects " + rate + " people per million. The population is " + m + " million. How many people are affected?", n, 'people',
        "Here the base is one million, so divide the population by 1 000 000: " + m + ". " + m + " × " + rate + " = " + n + ".");
    } },
    { skill: 'other base', gen: function () {
      var rate = rint(4, 25), pop = pick([20000, 35000, 60000, 85000]), n = rate * pop / 1000;
      return nq("The birth rate in a town is " + rate + " per 1000 people per year. The town has " + commas(pop) + " people. How many babies are born in a year?", n, 'babies',
        commas(pop) + " ÷ 1000 = " + (pop / 1000) + ". " + (pop / 1000) + " × " + rate + " = " + commas(n) + ".");
    } },
    { skill: 'add groups', gen: function () {
      var mr = rint(20, 60), fr = rint(10, 40), m = pick([10, 20, 50]), n = (mr + fr) * m * 10;
      return nq("In one age group, the death rate is " + mr + " per 100 000 for males and " + fr + " per 100 000 for females. The country has " + m + " million people in this age group. Use the two rates to estimate the total deaths in the age group.", n, 'deaths',
        "Add the rates first: " + mr + " + " + fr + " = " + (mr + fr) + " per 100 000. " + commas(m * 1000000) + " ÷ 100 000 = " + (m * 10) + ". " + (m * 10) + " × " + (mr + fr) + " = " + commas(n) + ".");
    } },
    F("stem said 'assume the male rate applies to the whole population', which is not realistic; it now gives the number of males", { skill: 'read a table', gen: function () {
      var years = [2000, 2005, 2010], male = [rint(500, 700), rint(380, 499), rint(250, 379)], female = [rint(250, 380), rint(180, 249), rint(100, 179)], k = rint(0, 2), m = pick([20, 40, 60]), n = male[k] * m * 10;
      var rows = years.map(function (y, i) { return '<tr><td>' + y + '</td><td>' + male[i] + '</td><td>' + female[i] + '</td></tr>'; }).join('');
      return nq("The table shows deaths from heart disease per 100 000 people.<table class=\"mc-table\"><tr><th>Year</th><th>Males</th><th>Females</th></tr>" + rows + "</table>There were " + m + " million males in the country in " + years[k] + ". How many males died from heart disease that year?", n, 'deaths',
        "Read the male rate for " + years[k] + ": " + male[k] + ". " + commas(m * 1000000) + " ÷ 100 000 = " + (m * 10) + ". " + (m * 10) + " × " + male[k] + " = " + commas(n) + ".");
    } }),
    F("rounding made robust against floating-point error at exact halves", { skill: 'significant figures', gen: function () {
      var rate = rint(101, 499) / 10, m = pick([53, 61, 67, 82]), raw = rate * m * 10, ans = sf3(Math.round(raw * 1000) / 1000);
      return nq("A rate is " + rate + " per 100 000 people. The population is " + m + " million. Calculate the number of cases. Give your answer to three significant figures.", ans, 'cases',
        m + " × 10 = " + (m * 10) + " groups of 100 000. " + (m * 10) + " × " + rate + " = " + commas(Math.round(raw * 10) / 10) + ", which is " + commas(ans) + " to three significant figures.", { tol: 0 });
    } }),
    { skill: 'find the rate', gen: function () {
      var rate = rint(5, 80), m = pick([2, 4, 5, 8, 10]), n = rate * m * 10;
      return nq("In a population of " + m + " million, there were " + commas(n) + " cases of a disease. What is the rate per 100 000 people?", rate, 'per 100 000',
        m + " million ÷ 100 000 = " + (m * 10) + " groups. " + commas(n) + " ÷ " + (m * 10) + " = " + rate + " per 100 000.");
    } },
    M('meaning', "What does a death rate of 25 per 100 000 mean?",
      "In every 100 000 people, 25 die", ["25% of the people in the population die every year", "25 people die in every 1000 people", "100 000 people die out of every 25"],
      "It is a number in every 100 000, not a percentage."),
    M('full number', "How is 60 million written as a full number?",
      "60 000 000", ["6 000 000", "600 000", "600 000 000"], "One million is 1 000 000, so 60 million is 60 000 000."),
    M('common errors', "A student multiplies a rate of 40 per 100 000 by a population of 5 000 000 and gets 200 000 000. What did they forget?",
      "To divide the population by 100 000 first", ["To multiply the answer by 100 000 again at the end", "To add the female rate", "To round to one significant figure"],
      "5 000 000 ÷ 100 000 = 50, and 50 × 40 = 2000."),
    M('common errors', "A graph shows male and female rates. The question asks about males. Which mistake is most common?",
      "Reading the female line instead", ["Reading the x-axis instead of the y-axis", "Adding 100 to the rate", "Using a ruler"],
      "Check the key before reading a value.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-MATH-ESTIMATE-INTERPOLATE-EXTRAPOLATE */
  T('HBI-MATH-ESTIMATE-INTERPOLATE-EXTRAPOLATE', 'Estimate an unmeasured value by interpolating or extrapolating data', [
    M('interpolate', "What does interpolating mean?",
      "Estimating a value between two measured values", ["Continuing a trend beyond the last value that was measured", "Measuring the same value again", "Drawing a bar chart"],
      "Inter- means between."),
    M('extrapolate', "What does extrapolating mean?",
      "Continuing a trend beyond the last measured value", ["Estimating a value between two values that were measured", "Taking the mean of three readings", "Removing an anomalous result"],
      "Extra- means outside."),
    { skill: 'midpoint', gen: function () {
      var x1 = pick([20, 30, 40]), x2 = x1 + 20, y1 = rint(20, 40) * 2, y2 = y1 + rint(5, 15) * 2, mid = (y1 + y2) / 2;
      return nq("At " + x1 + " °C an enzyme released " + y1 + " units of product. At " + x2 + " °C it released " + y2 + " units. Assume the change is steady. Estimate the amount released at " + (x1 + 10) + " °C.", mid, 'units',
        (x1 + 10) + " °C is halfway between, so take the value halfway between " + y1 + " and " + y2 + ": (" + y1 + " + " + y2 + ") ÷ 2 = " + mid + " units.");
    } },
    { skill: 'crossing zero', gen: function () {
      var a = pick([[0.25, 0.5], [0.2, 0.4], [0.3, 0.6]]), up = rint(4, 12) * 2, down = rint(4, 12) * 2, ans = Math.round((a[0] + (a[1] - a[0]) * up / (up + down)) * 100) / 100;
      return nq("Potato cylinders were put in sugar solutions. In " + a[0] + " au solution the mass changed by +" + (up / 100).toFixed(2) + " g. In " + a[1] + " au solution it changed by −" + (down / 100).toFixed(2) + " g. Assume the change is steady. Estimate the concentration that gives no change in mass.", ans, 'au',
        "The change in mass goes from +" + (up / 100).toFixed(2) + " to −" + (down / 100).toFixed(2) + ", a total of " + ((up + down) / 100).toFixed(2) + " g. Zero is " + (up / 100).toFixed(2) + " ÷ " + ((up + down) / 100).toFixed(2) + " of the way across, so " + a[0] + " + " + (a[1] - a[0]) + " × " + up + "/" + (up + down) + " ≈ " + ans + " au. The answer must be between " + a[0] + " and " + a[1] + ".", { tol: 0.02 });
    } },
    { skill: 'future date', gen: function () {
      var start = pick([2010, 2015, 2020]), v = rint(30, 60) * 10, fall = pick([10, 20, 25, 40, 50]), target = v - fall * rint(3, 8), yrs = (v - target) / fall;
      return nq("In " + start + ", there were " + v + " cases of a disease. The number falls by " + fall + " each year. In which year will there be " + target + " cases?", start + yrs, '',
        "It must fall by " + v + " − " + target + " = " + (v - target) + ". " + (v - target) + " ÷ " + fall + " = " + yrs + " years. " + start + " + " + yrs + " = " + (start + yrs) + ".", { tol: 0 });
    } },
    { skill: 'bracket', gen: function () {
      var lo = rint(84, 88) / 10, hi = Math.round((lo + 0.2) * 10) / 10, mid = Math.round((lo + 0.1) * 10) / 10;
      return mq("The pH was " + hi.toFixed(1) + " at 4 minutes and " + lo.toFixed(1) + " at 6 minutes. Which is the best estimate of the pH at 5 minutes?", mid.toFixed(1),
        [(lo - 0.3).toFixed(1), (hi + 0.3).toFixed(1), (hi + 0.8).toFixed(1)], "An estimate between two readings must lie between them: between " + lo.toFixed(1) + " and " + hi.toFixed(1) + ".");
    } },
    M('dose', "A drink with 80 mg of caffeine raised heart rate by 12 beats per minute; 40 mg raised it by 6. Which is the best estimate for 60 mg?",
      "About 9 beats per minute", ["About 18 beats per minute, because more caffeine always doubles the rise", "About 3 beats per minute", "About 0 beats per minute"],
      "60 mg is between the two tested doses, so the estimate should be between 6 and 12."),
    M('common errors', "Readings change sign between 0.25 au and 0.50 au. A student gives 0.50 au as the point of no change, because it is the reading closest to zero. Why is this weak?",
      "They did not estimate between the two readings", ["0.50 au is outside the range of the data, so it can never be used for any estimate", "They should have chosen 0.75 au", "The data cannot be used at all"],
      "Work out where between 0.25 and 0.50 the value reaches zero."),
    M('reliability', "Why is an extrapolated value less reliable than an interpolated one?",
      "The trend may not continue beyond the measured range", ["Extrapolated values always come out as negative numbers on the graph", "Interpolation uses more equipment", "Extrapolation is not allowed in biology"],
      "Outside the measured range, nobody knows if the pattern still holds."),
    M('reason', "A question asks you to explain how you got an estimate. What should you include?",
      "The readings on each side and how you used the trend", ["Only the final number, written as clearly as possible with its unit", "The name of the equipment used", "The date of the experiment"],
      "Give a short reason as well as the number."),
    M('negative values', "A table shows changes in mass of +0.10 g, +0.04 g, −0.03 g and −0.09 g. Between which two readings does the change become zero?",
      "Between +0.04 g and −0.03 g", ["Between +0.10 g and +0.04 g", "Between −0.03 g and −0.09 g", "Before +0.10 g"],
      "Zero lies where the sign changes from + to −."),
    M('common errors', "A student ignores the minus signs in a table of mass changes. What will happen?",
      "They will not see where the values cross zero", ["Their estimate will become more accurate than before", "Nothing will change", "The units will change"],
      "Minus signs show a loss in mass; they matter.")
  ], { date: '2026-10-13', dropped: [] });
})();
