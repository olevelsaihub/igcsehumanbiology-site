/* Group G03 mastery bank: Core maths skills for biology data (A-Grade Block 3).
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


  // ---------- graph helpers (fixed colours; values sit on grid lines so readings are exact) ----------
  function fmt(v) { return String(R.roundDp(v, 3)); }
  function lineGraph(o) {
    var L = 70, T = 20, W = 460, H = 280, xmin = o.xmin || 0, ymin = o.ymin || 0;
    var px = function (x) { return L + (x - xmin) / (o.xmax - xmin) * W; }, py = function (y) { return T + H - (y - ymin) / (o.ymax - ymin) * H; };
    var g = '', mx = o.xstep / (o.xminor || 2), my = o.ystep / (o.yminor || 5), x, y;
    for (x = xmin; x <= o.xmax + 1e-9; x += mx) g += '<line x1="' + px(x) + '" y1="' + T + '" x2="' + px(x) + '" y2="' + (T + H) + '" stroke="#e3e8ef"/>';
    for (y = ymin; y <= o.ymax + 1e-9; y += my) g += '<line x1="' + L + '" y1="' + py(y) + '" x2="' + (L + W) + '" y2="' + py(y) + '" stroke="#e3e8ef"/>';
    for (x = xmin; x <= o.xmax + 1e-9; x += o.xstep) g += '<line x1="' + px(x) + '" y1="' + T + '" x2="' + px(x) + '" y2="' + (T + H) + '" stroke="#c5ccd6"/><text x="' + px(x) + '" y="' + (T + H + 18) + '" font-size="13" text-anchor="middle" fill="' + INK + '">' + fmt(x) + '</text>';
    for (y = ymin; y <= o.ymax + 1e-9; y += o.ystep) g += '<line x1="' + L + '" y1="' + py(y) + '" x2="' + (L + W) + '" y2="' + py(y) + '" stroke="#c5ccd6"/><text x="' + (L - 8) + '" y="' + (py(y) + 4) + '" font-size="13" text-anchor="end" fill="' + INK + '">' + fmt(y) + '</text>';
    var cols = [BLUE, HI, INK], lines = '', key = '';
    o.series.forEach(function (s, k) {
      var c = cols[k % 3];
      lines += '<polyline fill="none" stroke="' + c + '" stroke-width="2.5" points="' + s.xs.map(function (xx, i) { return px(xx) + ',' + py(s.ys[i]); }).join(' ') + '"/>';
      if (o.points !== false) lines += s.xs.map(function (xx, i) { return '<circle cx="' + px(xx) + '" cy="' + py(s.ys[i]) + '" r="3.5" fill="' + c + '"/>'; }).join('');
      if (s.label) key += '<line x1="' + (L + 12) + '" y1="' + (T + 14 + 18 * k) + '" x2="' + (L + 36) + '" y2="' + (T + 14 + 18 * k) + '" stroke="' + c + '" stroke-width="3"/><text x="' + (L + 42) + '" y="' + (T + 18 + 18 * k) + '" font-size="13" fill="' + INK + '">' + s.label + '</text>';
    });
    return '<svg class="mc-svg" viewBox="0 0 560 360" role="img" aria-label="' + (o.alt || 'Line graph') + '">' + g +
      '<line x1="' + L + '" y1="' + (T + H) + '" x2="' + (L + W) + '" y2="' + (T + H) + '" stroke="' + INK + '" stroke-width="1.5"/><line x1="' + L + '" y1="' + T + '" x2="' + L + '" y2="' + (T + H) + '" stroke="' + INK + '" stroke-width="1.5"/>' +
      lines + (key ? '<rect x="' + (L + 6) + '" y="' + (T + 2) + '" width="190" height="' + (18 * o.series.length + 8) + '" fill="#ffffff" opacity="0.85"/>' + key : '') +
      '<text x="' + (L + W / 2) + '" y="' + (T + H + 42) + '" font-size="14" text-anchor="middle" fill="' + INK + '">' + o.xlabel + '</text>' +
      '<text transform="translate(16,' + (T + H / 2) + ') rotate(-90)" font-size="14" text-anchor="middle" fill="' + INK + '">' + o.ylabel + '</text></svg>';
  }
  function barChart(o) {
    var L = 70, T = 20, W = 460, H = 280, n = o.labels.length, bw = W / n * 0.55;
    var py = function (y) { return T + H - y / o.ymax * H; }, my = o.ystep / (o.yminor || 5), g = '', y;
    for (y = 0; y <= o.ymax + 1e-9; y += my) g += '<line x1="' + L + '" y1="' + py(y) + '" x2="' + (L + W) + '" y2="' + py(y) + '" stroke="#e3e8ef"/>';
    for (y = 0; y <= o.ymax + 1e-9; y += o.ystep) g += '<line x1="' + L + '" y1="' + py(y) + '" x2="' + (L + W) + '" y2="' + py(y) + '" stroke="#c5ccd6"/><text x="' + (L - 8) + '" y="' + (py(y) + 4) + '" font-size="13" text-anchor="end" fill="' + INK + '">' + fmt(y) + '</text>';
    var bars = o.labels.map(function (lab, i) {
      var cx = L + W / n * (i + 0.5), stack = o.stack ? o.stack[i] : null;
      var b = '<rect x="' + (cx - bw / 2) + '" y="' + py(o.values[i]) + '" width="' + bw + '" height="' + (py(0) - py(o.values[i])) + '" fill="' + BLUE + '" opacity="0.85"/>';
      if (stack != null) b += '<rect x="' + (cx - bw / 2) + '" y="' + py(o.values[i]) + '" width="' + bw + '" height="' + (py(stack) - py(o.values[i])) + '" fill="' + HI + '" opacity="0.85"/>';
      return b + '<text x="' + cx + '" y="' + (T + H + 18) + '" font-size="13" text-anchor="middle" fill="' + INK + '">' + lab + '</text>';
    }).join('');
    var key = o.stackLabels ? '<rect x="' + (L + 10) + '" y="' + (T + 6) + '" width="12" height="12" fill="' + BLUE + '"/><text x="' + (L + 28) + '" y="' + (T + 17) + '" font-size="13" fill="' + INK + '">' + o.stackLabels[0] + '</text><rect x="' + (L + 10) + '" y="' + (T + 24) + '" width="12" height="12" fill="' + HI + '"/><text x="' + (L + 28) + '" y="' + (T + 35) + '" font-size="13" fill="' + INK + '">' + o.stackLabels[1] + '</text>' : '';
    return '<svg class="mc-svg" viewBox="0 0 560 360" role="img" aria-label="' + (o.alt || 'Bar chart') + '">' + g + bars + key +
      '<line x1="' + L + '" y1="' + (T + H) + '" x2="' + (L + W) + '" y2="' + (T + H) + '" stroke="' + INK + '" stroke-width="1.5"/><line x1="' + L + '" y1="' + T + '" x2="' + L + '" y2="' + (T + H) + '" stroke="' + INK + '" stroke-width="1.5"/>' +
      '<text x="' + (L + W / 2) + '" y="' + (T + H + 42) + '" font-size="14" text-anchor="middle" fill="' + INK + '">' + o.xlabel + '</text>' +
      '<text transform="translate(16,' + (T + H / 2) + ') rotate(-90)" font-size="14" text-anchor="middle" fill="' + INK + '">' + o.ylabel + '</text></svg>';
  }
  function table(head, rows) {
    return '<table class="mc-table"><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr>' +
      rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>';
  }
  function shuffled(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function dp1(x) { return R.roundDp(x, 1).toFixed(1); }

  /* ====================================================================== HBI-MATH-CONSTRUCT-TABLE */
  T('HBI-MATH-CONSTRUCT-TABLE', 'Construct or complete a results or frequency table', [
    M('table layout', "A student changes the temperature and measures the time for an enzyme to digest starch. Which column should come first in the results table?",
      "Temperature, because it is the independent variable", ["Time, because it is the result that was measured", "Either one, because the order of the columns never matters", "Time, because it has the larger numbers in it"],
      "The independent variable (what you change) goes in the first column. The measured results go in the next column."),
    M('headings and units', "Where should the units of the measurements be written in a results table?",
      "In the column heading only", ["After every number in the table", "In a separate column next to the numbers", "Underneath the table, in a key"],
      "Units go once, in the heading, for example 'Time in s'. They are not repeated after each number."),
    M('headings and units', "Which is the best heading for a column of temperatures?",
      "Temperature in °C", ["Temperature", "°C", "Hot or cold"],
      "A heading names the quantity and gives its unit."),
    M('order of rows', "A student tested sugar solutions in this order: 0.6, 0.0, 1.0, 0.2 and 0.4 au. In what order should the concentrations go in the table?",
      "0.0, 0.2, 0.4, 0.6, 1.0", ["0.6, 0.0, 1.0, 0.2, 0.4", "1.0, 0.6, 0.4, 0.2, 0.0", "0.0, 0.6, 0.2, 1.0, 0.4"],
      "Put the independent variable in order from lowest to highest, not in the order the tests were done."),
    M('decimal places', "Which column of results is written correctly?",
      "2.0, 3.5, 4.0, 5.5", ["2, 3.5, 4, 5.5", "2.0, 3.5, 4, 5.50", "2, 3.50, 4.0, 5.5"],
      "Every value in a column should have the same number of decimal places."),
    { skill: 'frequency tables', gen: function () {
      var vals = [], k = rint(2, 4), counts = [rint(2, 6), rint(3, 8), rint(4, 9), rint(2, 6), rint(1, 4)];
      for (var v = 0; v < 5; v++) for (var c = 0; c < counts[v]; c++) vals.push(v + 1);
      vals = shuffled(vals);
      return nq("A nurse records how many times each patient visited a clinic in one year: <b>" + vals.join(', ') + "</b>. The nurse puts the data in a frequency table. What is the frequency for " + k + " visits?",
        counts[k - 1], '', "Count how many times the value " + k + " appears in the list: " + counts[k - 1] + " times. A frequency table counts how often each value occurs.");
    } },
    { skill: 'frequency tables', gen: function () {
      var f = [rint(3, 9), rint(5, 12), rint(6, 14), rint(2, 8)], tot = f[0] + f[1] + f[2] + f[3];
      var tbl = table(['Number of teeth with fillings', 'Frequency'], [['0', f[0]], ['1', f[1]], ['2', f[2]], ['3', f[3]]]);
      return nq("A dentist recorded how many teeth with fillings each child had." + tbl + "How many children were checked in total?", tot, '',
        "Add the frequencies: " + f.join(' + ') + " = " + tot + " children.");
    } },
    M('order of rows', "A table shows results for named conditions, not numbers: four brands of drink and the sugar in each. How can the rows be ordered?",
      "From the highest result to the lowest", ["In the order the drinks were bought", "In a random order, so the test is fair", "With the result in the first column"],
      "When the condition is a name, the rows can be put in order of the result, for example highest sugar first."),
    M('table layout', "A student is asked to 'give the results in a suitable table'. What does the student need to draw?",
      "Ruled columns with headings and units, and one row for each condition", ["A line graph with labelled axes and a scale", "A list of the numbers in one long sentence", "A bar chart with bars of equal width"],
      "A table has ruled columns, headings with units and a row for each condition. A graph or a list does not get the table marks."),
    M('headings and units', "A student writes 'cm³' after every number in a column of volumes. How should the table be improved?",
      "Write 'Volume in cm³' in the heading and remove the units from the cells", ["Write the units after every number in the other columns too", "Remove the heading, as the units are already in the cells", "Add a third column for the units of each volume"],
      "Units belong once in the heading. Numbers in the body of the table are written without units."),
    { skill: 'order of rows', gen: function () {
      var t = shuffled([10, 20, 30, 40, 50]), times = t.map(function () { return rint(30, 300); });
      var raw = t.map(function (x, i) { return x + ' °C: ' + times[i] + ' s'; }).join('; ');
      var first = 10;
      return mq("A student writes results in a notebook: <b>" + raw + "</b>. The student draws a results table. What goes in the first row of data?",
        "10 °C and its time", [t[0] === 10 ? "50 °C and its time" : t[0] + " °C and its time", "The longest time and its temperature", "The shortest time and its temperature"],
        "The independent variable (temperature) goes in the first column in order from lowest to highest, so the first row is " + first + " °C.");
    } },
    F('distractor \'Time 4\' was not a sensible heading; replaced', M('table layout', "A student repeats each test three times. Which heading is best for the column that shows the average of the three results?",
      "Mean time in s", ["Results", "Total time in s", "Best time"],
      "The column shows the mean, so the heading says 'Mean' and gives the quantity and its unit."))
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-MATH-READ-A-VALUE */
  function hrCurve() {   // heart rate before, during and after exercise, on 5-unit grid lines
    var rest = 5 * rint(13, 16), peak = 5 * rint(28, 34), xs = [0, 2, 4, 6, 8, 10, 12, 14, 16];
    var ys = [rest, rest, rest + 5 * rint(5, 8), peak, peak, rest + 5 * rint(6, 9), rest + 5 * rint(2, 4), rest + 5, rest];
    return { xs: xs, ys: ys, rest: rest, peak: peak };
  }
  T('HBI-MATH-READ-A-VALUE', 'Read or estimate a value from a graph, chart, table or image', [
    { skill: 'read a y-value', gen: function () {
      var h = hrCurve(), i = pick([2, 5, 6]);
      return nq("The graph shows a person's heart rate before, during and after exercise. What was the heart rate at " + h.xs[i] + " minutes?", h.ys[i], 'beats per minute',
        "Go up from " + h.xs[i] + " minutes on the x-axis to the line, then across to the y-axis: " + h.ys[i] + " beats per minute. Each small square is 5 beats per minute.",
        { svg: lineGraph({ series: [{ xs: h.xs, ys: h.ys }], xmax: 16, xstep: 2, xminor: 2, ymax: 200, ystep: 25, yminor: 5, xlabel: 'Time in minutes', ylabel: 'Heart rate in beats per minute', alt: 'Line graph of heart rate against time' }) });
    } },
    { skill: 'read an x-value', gen: function () {
      var top = 2 * rint(40, 50), xs = [0, 1, 2, 3, 4, 5, 6, 7, 8], k = rint(30, 45) / 10;
      var ys = xs.map(function (t) { return t === 0 ? 0 : Math.max(0, R.roundDp(top - (t - 1) * 10, 0)); });
      var limit = 10 * rint(3, 6), cross = 1 + (top - limit) / 10;
      return nq("The graph shows the concentration of alcohol in a person's blood after a drink. The legal limit for driving in one country is " + limit + " mg per 100 cm³ of blood.<br>How many hours after the drink does the concentration first fall to the legal limit?",
        R.roundDp(cross, 1), 'hours', "Go across from " + limit + " on the y-axis to the falling part of the line, then down to the x-axis: " + R.roundDp(cross, 1) + " hours. Use the falling part, not the peak.",
        { tol: 0.15, display: String(R.roundDp(cross, 1)), svg: lineGraph({ series: [{ xs: xs, ys: ys }], xmax: 8, xstep: 1, xminor: 5, ymax: 120, ystep: 20, yminor: 4, xlabel: 'Time after the drink in hours', ylabel: 'Alcohol in mg per 100 cm³', alt: 'Line graph of blood alcohol falling over time' }) });
    } },
    { skill: 'read a bar chart', gen: function () {
      var labs = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], vals = labs.map(function () { return 2 * rint(8, 45); }), i = rint(0, 4);
      return nq("The bar chart shows the number of patients seen at a clinic each day. How many patients were seen on " + { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday' }[labs[i]] + "?",
        vals[i], '', "Go across from the top of the bar to the y-axis. Each small square is 2 patients, so the bar reads " + vals[i] + ".",
        { svg: barChart({ labels: labs, values: vals, ymax: 100, ystep: 10, yminor: 5, xlabel: 'Day', ylabel: 'Number of patients', alt: 'Bar chart of patients each day' }) });
    } },
    { skill: 'scale of a small square', gen: function () {
      var big = pick([10, 20, 25, 50, 100]), n = pick([5, 10]);
      var ans = big / n;
      return nq("On a graph, each large square on the y-axis is worth " + big + " units. Each large square is divided into " + n + " small squares. How many units is one small square worth?", ans, '',
        "One small square = " + big + " ÷ " + n + " = " + ans + " units. Work this out before you read any value.", { tol: 0.001, display: String(ans) });
    } },
    { skill: 'two lines', gen: function () {
      var xs = [0, 10, 20, 30, 40, 50], a = xs.map(function (x, i) { return 4 * (5 + i * rint(3, 4)); }), b = xs.map(function (x, i) { return 4 * (3 + i * rint(1, 2)); });
      var i = rint(2, 5), wantA = Math.random() < 0.5;
      var right = wantA ? a[i] : b[i], wrongLine = wantA ? b[i] : a[i];
      return mq("The graph shows the volume of urine made by two people after drinking water." + "<br>What volume of urine had person " + (wantA ? 'A' : 'B') + " made by " + xs[i] + " minutes?",
        right + ' cm³', [wrongLine + ' cm³', (right + 4) + ' cm³', (right - 8) + ' cm³'].filter(function (v, j, arr) { return v !== right + ' cm³' && arr.indexOf(v) === j; }),
        "Use the line labelled person " + (wantA ? 'A' : 'B') + ". At " + xs[i] + " minutes it reads " + right + " cm³. Each small square is 4 cm³.",
        { svg: lineGraph({ series: [{ xs: xs, ys: a, label: 'Person A' }, { xs: xs, ys: b, label: 'Person B' }], xmax: 50, xstep: 10, xminor: 2, ymax: 120, ystep: 20, yminor: 5, xlabel: 'Time in minutes', ylabel: 'Volume of urine in cm³', alt: 'Line graph of urine volume for person A and person B' }) });
    } },
    { skill: 'when or how much', gen: function () {
      var years = [2016, 2017, 2018, 2019, 2020, 2021, 2022], vals = years.map(function () { return 5 * rint(6, 18); }), top = 0;
      vals.forEach(function (v, i) { if (v > vals[top]) top = i; });
      vals = vals.map(function (v, i) { return i !== top && v === vals[top] ? v - 5 : v; });
      var wrong = [String(vals[top]), String(years[(top + 1) % 7]), String(years[(top + 3) % 7])];
      return mq("The graph shows the number of cases of an infection in a town each year. In which year were there the most cases?", String(years[top]), wrong,
        "'In which year' asks for an x-axis value. The highest point is at " + years[top] + ". " + vals[top] + " is the number of cases, not the year.",
        { svg: lineGraph({ series: [{ xs: years, ys: vals }], xmin: 2016, xmax: 2022, xstep: 1, xminor: 1, ymax: 100, ystep: 20, yminor: 4, xlabel: 'Year', ylabel: 'Number of cases', alt: 'Line graph of cases each year' }) });
    } },
    { skill: 'estimate from an image', gen: function () {
      var whole = pick([40, 50, 60, 80]), part = R.roundDp(whole * pick([0.2, 0.25, 0.4, 0.5]), 1);
      var known = pick([200, 300, 500]), ans = R.roundDp(known * whole / part, 0);
      return nq("On a micrograph of skin, a layer that is known to be " + known + " µm thick measures " + part + " mm. The whole section on the same micrograph measures " + whole + " mm. Estimate the real thickness of the whole section in µm.",
        ans, 'µm', "The whole section is " + whole + " ÷ " + part + " = " + R.roundDp(whole / part, 2) + " times as thick as the known layer. " + R.roundDp(whole / part, 2) + " × " + known + " = " + commas(ans) + " µm.", { display: commas(ans) });
    } },
    { skill: 'read a y-value', gen: function () {
      var xs = [0, 20, 40, 60, 80, 100], k = rint(2, 4), ys = xs.map(function (x) { return R.roundDp(x * k / 20 * 0.4, 1); });
      var i = rint(1, 5);
      return nq("The graph shows how the volume of oxygen used by a person changes with walking speed. What volume of oxygen is used at a walking speed of " + xs[i] + " m per minute?",
        ys[i], 'dm³ per minute', "Go up from " + xs[i] + " to the line and across: " + ys[i] + " dm³ per minute. Each small square is 0.2 dm³.",
        { tol: 0.05, display: String(ys[i]), svg: lineGraph({ series: [{ xs: xs, ys: ys }], xmax: 100, xstep: 20, xminor: 2, ymax: 10, ystep: 2, yminor: 10, xlabel: 'Walking speed in m per minute', ylabel: 'Oxygen used in dm³ per minute', alt: 'Line graph of oxygen used against walking speed' }) });
    } },
    { skill: 'read a bar chart', gen: function () {
      var labs = ['A', 'B', 'C', 'D'], v = labs.map(function () { return 5 * rint(4, 18); }), i = rint(0, 3), j = (i + rint(1, 3)) % 4, tot = v[i] + v[j];
      return nq("The bar chart shows the number of students in four classes who had a vaccine. How many students in classes " + labs[Math.min(i, j)] + " and " + labs[Math.max(i, j)] + " had the vaccine altogether?",
        tot, '', "Read each bar separately: " + v[Math.min(i, j)] + " and " + v[Math.max(i, j)] + ". Then add them: " + tot + ".",
        { svg: barChart({ labels: labs.map(function (l) { return 'Class ' + l; }), values: v, ymax: 100, ystep: 20, yminor: 4, xlabel: 'Class', ylabel: 'Number vaccinated', alt: 'Bar chart of vaccinated students in four classes' }) });
    } },
    { skill: 'two lines', gen: function () {
      var xs = [0, 1, 2, 3, 4, 5, 6], a = [0, 8, 14, 18, 20, 21, 22], g = rint(2, 5), b = a.map(function (v, i) { return i === 0 ? 0 : Math.max(0, v - (8 - 2 * Math.abs(i - g))); });
      var gap = a.map(function (v, i) { return v - b[i]; }), best = 0;
      gap.forEach(function (d, i) { if (d > gap[best]) best = i; });
      return mq("The graph shows the mass of two groups of seedlings grown in different soils. At which time is the difference between the two groups greatest?",
        best + ' weeks', [best - 1, best + 1, best - 2, best + 2].filter(function (x) { return x >= 1 && x <= 6; }).slice(0, 3).map(function (x) { return x + (x === 1 ? ' week' : ' weeks'); }),
        "Look for the time where the vertical gap between the two lines is largest. At " + best + " weeks the gap is " + gap[best] + " g.",
        { svg: lineGraph({ series: [{ xs: xs, ys: a, label: 'Soil 1' }, { xs: xs, ys: b, label: 'Soil 2' }], xmax: 6, xstep: 1, xminor: 2, ymax: 25, ystep: 5, yminor: 5, xlabel: 'Time in weeks', ylabel: 'Mean mass in g', alt: 'Line graph of seedling mass for two soils' }) });
    } },
    M('reading method', "Before reading a value from a graph, what should you work out first?",
      "What one small square is worth on the axis", ["The highest value on the whole graph", "The number of points that are plotted", "The mean of all the plotted values"],
      "Squares are often worth 2, 5 or 0.2 units, not 1. Find the value of one small square before reading."),
    M('when or how much', "A question asks: 'How many hours after the meal did blood glucose return to its starting value?' Which axis gives the answer?",
      "The x-axis, which shows the time", ["The y-axis, which shows blood glucose", "Both axes added together", "Neither axis; it is read from the key"],
      "'How many hours' asks for a time, so read the answer from the x-axis.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-MATH-READ-AND-SUBTRACT */
  T('HBI-MATH-READ-AND-SUBTRACT', 'Read two values from a graph, chart or table and find the difference', [
    { skill: 'peak minus rest', gen: function () {
      var h = hrCurve();
      return nq("The graph shows a person's heart rate before, during and after exercise. By how much did the heart rate rise from its resting value to its highest value?",
        h.peak - h.rest, 'beats per minute', "Maximum = " + h.peak + " and resting = " + h.rest + " beats per minute. Difference = " + h.peak + " − " + h.rest + " = " + (h.peak - h.rest) + " beats per minute.",
        { svg: lineGraph({ series: [{ xs: h.xs, ys: h.ys }], xmax: 16, xstep: 2, xminor: 2, ymax: 200, ystep: 25, yminor: 5, xlabel: 'Time in minutes', ylabel: 'Heart rate in beats per minute', alt: 'Line graph of heart rate against time' }) });
    } },
    { skill: 'difference between bars', gen: function () {
      var labs = ['Walking', 'Cycling', 'Running', 'Swimming'], v = labs.map(function () { return 20 * rint(10, 45); }), i = rint(0, 3), j = (i + rint(1, 3)) % 4;
      while (v[j] === v[i]) v[j] = 20 * rint(10, 45);
      return nq("The bar chart shows the energy used in one hour of four activities. How much more energy is used in one hour of " + labs[Math.max(v[i], v[j]) === v[i] ? i : j].toLowerCase() + " than of " + labs[Math.max(v[i], v[j]) === v[i] ? j : i].toLowerCase() + "?",
        Math.abs(v[i] - v[j]), 'kJ', "Read both bars: " + Math.max(v[i], v[j]) + " kJ and " + Math.min(v[i], v[j]) + " kJ. Difference = " + Math.abs(v[i] - v[j]) + " kJ. Each small square is 20 kJ.",
        { svg: barChart({ labels: labs, values: v, ymax: 1000, ystep: 200, yminor: 10, xlabel: 'Activity', ylabel: 'Energy used in kJ per hour', alt: 'Bar chart of energy used in four activities' }) });
    } },
    { skill: 'stacked bars', gen: function () {
      var labs = ['Group 1', 'Group 2', 'Group 3'], tot = labs.map(function () { return 5 * rint(10, 19); }), low = tot.map(function (t) { return 5 * rint(2, t / 5 - 3); }), i = rint(0, 2);
      return nq("The stacked bar chart shows the number of people in three groups who were vaccinated (lower part) or not vaccinated (upper part). How many people in " + labs[i] + " were <b>not</b> vaccinated?",
        tot[i] - low[i], '', "The upper part runs from " + low[i] + " to " + tot[i] + ". Its size is " + tot[i] + " − " + low[i] + " = " + (tot[i] - low[i]) + ". Do not give the top value of the bar.",
        { svg: barChart({ labels: labs, values: tot, stack: low, stackLabels: ['vaccinated (lower)', 'not vaccinated (upper)'], ymax: 100, ystep: 20, yminor: 4, xlabel: 'Group', ylabel: 'Number of people', alt: 'Stacked bar chart of vaccinated and not vaccinated people' }) });
    } },
    F('lung volumes were not realistic; now 2.0-3.5 dm3 at rest', { skill: 'difference from a table', gen: function () {
      var a = R.roundDp(rint(20, 35) / 10, 1), b = R.roundDp(a + rint(20, 35) / 10, 1);
      return nq("A table shows that a person's lung volume is " + dp1(a) + " dm³ at rest and " + dp1(b) + " dm³ when breathing in as deeply as possible. Calculate the difference.", R.roundDp(b - a, 1), 'dm³',
        "Difference = larger − smaller = " + dp1(b) + " − " + dp1(a) + " = " + dp1(b - a) + " dm³.", { tol: 0.05, display: dp1(b - a) });
    } }),
    { skill: 'range of a curve', gen: function () {
      var start = 10 * rint(38, 45), end = start + 10 * rint(14, 22), pk = (start + end) / 2;
      var xs = [start, (start + pk) / 2, pk, (pk + end) / 2, end], ys = [0, 50, 100, 50, 0];
      return nq("The graph shows the wavelengths of light that one type of cone cell absorbs. Calculate the range of wavelengths absorbed.", end - start, 'nm',
        "The curve meets zero at " + start + " nm and at " + end + " nm. Range = " + end + " − " + start + " = " + (end - start) + " nm.",
        { svg: lineGraph({ series: [{ xs: xs, ys: ys }], xmin: 350, xmax: 750, xstep: 50, xminor: 5, ymax: 100, ystep: 20, yminor: 4, xlabel: 'Wavelength of light in nm', ylabel: 'Light absorbed in %', alt: 'Graph of light absorbed by a cone cell against wavelength', points: false }) });
    } },
    F('daily water loss was far too small and ignored other routes; values and wording changed', { skill: 'deduce a missing part', gen: function () {
      var tot = 50 * rint(30, 50), part = 50 * rint(6, 18);
      return nq("In one day, a person loses " + tot + " cm³ of water in sweat and urine together. " + part + " cm³ of this is lost in sweat. How much water is lost in urine?", tot - part, 'cm³',
        "Missing part = total − known part = " + tot + " − " + part + " = " + (tot - part) + " cm³.");
    } }),
    F('resting breathing rate range lowered to a realistic 12-18', { skill: 'difference from a table', gen: function () {
      var t1 = rint(12, 18), t2 = t1 + rint(5, 15);
      return nq("A student's breathing rate was " + t1 + " breaths per minute at rest and " + t2 + " breaths per minute after running. By how many breaths per minute did the rate increase?", t2 - t1, 'breaths per minute',
        "Increase = " + t2 + " − " + t1 + " = " + (t2 - t1) + " breaths per minute.");
    } }),
    M('common errors', "A student is asked for the difference between two readings, 156 and 72. The student writes 156. What is wrong?",
      "Only one reading is given; the answer should be 156 − 72 = 84", ["Nothing is wrong; the larger value is the difference", "The two readings should be added to give 228", "The readings should be divided to give 2.2"],
      "A difference needs both readings: larger value − smaller value."),
    M('common errors', "On a graph, each small square on the y-axis is worth 5 units. A student counts 6 small squares between two points and writes the difference as 6. What is the correct difference?",
      "30 units", ["6 units", "11 units", "1.2 units"], "Each small square is 5 units, so 6 squares = 6 × 5 = 30 units."),
    M('stacked bars', "A stacked bar has a lower section from 0 to 35 and an upper section from 35 to 60. What is the size of the upper section?",
      "25", ["60", "35", "95"], "Size of a section = top − bottom = 60 − 35 = 25. 60 is the top of the whole bar."),
    M('peak minus rest', "On a heart-rate graph, what is the resting heart rate?",
      "The low, steady value before the exercise starts", ["The highest value during the exercise", "The value at the very end of the graph", "The average of all the values on the graph"],
      "Resting rate is the steady level before exercise. The maximum is the highest point."),
    F('fibre values made realistic for white and wholemeal bread', { skill: 'difference between bars', gen: function () {
      var v1 = R.roundDp(rint(20, 35) / 10, 1), v2 = R.roundDp(v1 + rint(30, 50) / 10, 1);
      var tbl = table(['Food', 'Fibre in g per 100 g'], [['White bread', dp1(v1)], ['Wholemeal bread', dp1(v2)]]);
      return nq("The table shows the fibre in two types of bread." + tbl + "How much more fibre is there in 100 g of wholemeal bread than in 100 g of white bread?", R.roundDp(v2 - v1, 1), 'g',
        "Difference = " + dp1(v2) + " − " + dp1(v1) + " = " + dp1(v2 - v1) + " g.", { tol: 0.05, display: dp1(v2 - v1) });
    } })
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-MATH-PERCENTAGE-OF-TOTAL */
  T('HBI-MATH-PERCENTAGE-OF-TOTAL', 'Express a part as a percentage of a total', [
    F('30-80% heart operations was not realistic; context changed to day-case operations', { skill: 'part of a whole', gen: function () {
      var whole = rint(2000, 6000), part = rint(Math.round(whole * 0.3), Math.round(whole * 0.8)), ans = R.roundDp(part / whole * 100, 1);
      return nq("In one year a hospital carried out " + commas(whole) + " operations. " + commas(part) + " of them were day-case operations (the patient went home the same day). Calculate the percentage of operations that were day-case operations. Give your answer to 1 decimal place.", ans, '%',
        "Percentage = part ÷ whole × 100 = " + part + " ÷ " + whole + " × 100 = " + ans.toFixed(1) + "%.", { tol: 0.05, display: ans.toFixed(1) });
    } }),
    { skill: 'total a table first', gen: function () {
      var t = [rint(20, 60), rint(10, 50), rint(5, 30), rint(5, 25)], tot = t[0] + t[1] + t[2] + t[3], i = rint(0, 3), ans = R.roundDp(t[i] / tot * 100, 1);
      var names = ['A', 'B', 'AB', 'O'];
      var tbl = table(['Blood group', 'Number of people'], names.map(function (n, k) { return [n, t[k]]; }));
      return nq("The table shows the blood groups of people at a blood donation session." + tbl + "Calculate the percentage of people with blood group " + names[i] + ". Give your answer to 1 decimal place.", ans, '%',
        "Total = " + t.join(' + ') + " = " + tot + ". Percentage = " + t[i] + " ÷ " + tot + " × 100 = " + ans.toFixed(1) + "%.", { tol: 0.05, display: ans.toFixed(1) });
    } },
    { skill: 'use the right whole', gen: function () {
      var nsTot = rint(150, 260), sTot = rint(60, 120), nsLow = rint(8, 20), sLow = rint(15, 35), ans = R.roundDp(nsLow / nsTot * 100, 1);
      var tbl = table(['Mother', 'Babies with low birth mass', 'Babies with normal birth mass'], [['Non-smoker', nsLow, nsTot - nsLow], ['Smoker', sLow, sTot - sLow]]);
      return nq("The table shows the birth mass of babies born to smoking and non-smoking mothers." + tbl + "Calculate the percentage of babies born to <b>non-smoking</b> mothers that had a low birth mass. Give your answer to 1 decimal place.", ans, '%',
        "The whole is only the non-smokers' babies: " + nsLow + " + " + (nsTot - nsLow) + " = " + nsTot + ". Percentage = " + nsLow + " ÷ " + nsTot + " × 100 = " + ans.toFixed(1) + "%. Do not use the total for the whole table.", { tol: 0.05, display: ans.toFixed(1) });
    } },
    { skill: 'tally charts', gen: function () {
      function tally(n) { var s = ''; for (var i = 0; i < Math.floor(n / 5); i++) s += '<s>||||</s> '; for (i = 0; i < n % 5; i++) s += '|'; return s.trim(); }
      var a = rint(6, 17), b = rint(4, 14), c = rint(3, 12), tot = a + b + c, ans = R.roundDp(a / tot * 100, 0);
      var tbl = table(['Way of travelling to school', 'Tally'], [['Walk', tally(a)], ['Bus', tally(b)], ['Car', tally(c)]]);
      return nq("A class recorded how they travel to school." + tbl + "Calculate the percentage of the class who walk. Give your answer to the nearest whole number.", ans, '%',
        "Each crossed group is 5. Walk = " + a + ", bus = " + b + ", car = " + c + ", total = " + tot + ". Percentage = " + a + " ÷ " + tot + " × 100 = " + ans + "%.");
    } },
    { skill: 'part of a whole', gen: function () {
      var whole = rint(40, 80), part = R.roundDp(whole * rint(30, 60) / 100, 0), ans = R.roundDp(part / whole * 100, 0);
      return nq("The kidneys filter " + whole + " g of urea in a day, and " + part + " g of urea leaves the body in urine. What percentage of the filtered urea ends up in urine? Give your answer to the nearest whole number.", ans, '%',
        "Percentage = " + part + " ÷ " + whole + " × 100 = " + ans + "%.");
    } },
    M('common errors', "To find what percentage 300 is of 1200, a student calculates 1200 ÷ 300 × 100 = 400%. What is wrong?",
      "The division is upside down; 300 ÷ 1200 × 100 = 25%", ["Nothing is wrong, because a part can be 400% of its whole", "The student should have added 300 to 1200 before dividing", "The student should have divided by 100, not multiplied by it"],
      "Percentage of a total = part ÷ whole × 100. A part can never be more than 100% of its own whole."),
    M('common errors', "A student calculates 45 ÷ 60 and writes the answer as 0.75%. What is the correct percentage?",
      "75%", ["0.75%", "7.5%", "1.33%"], "The student forgot to multiply by 100: 0.75 × 100 = 75%."),
    M('comparing groups', "Town A has 30 cases of a disease in 1000 people. Town B has 45 cases in 3000 people. Which statement is correct?",
      "Town A has fewer cases but a larger percentage ill", ["Town B has more cases, so a larger percentage of its people are ill", "Both towns have the same percentage of their people ill", "Town A has more cases and also a larger percentage of people ill"],
      "A: 30 ÷ 1000 × 100 = 3%. B: 45 ÷ 3000 × 100 = 1.5%. Raw numbers and percentages can point different ways."),
    M('comparing groups', "Why are percentages better than raw numbers for comparing two groups of different sizes?",
      "They show the proportion, so group size does not matter", ["They always give bigger numbers, which are easier to compare", "They do not need any calculation, so they are quicker to find", "They make the smaller group look larger than it really is"],
      "A bigger group will often have more cases just because it has more people. Percentages compare like with like."),
    M('checking answers', "A student finds that 230 out of 180 patients had a fever. What should the student check?",
      "The values, because a part cannot be larger than its whole", ["Nothing, because the answer is simply 128% of the patients", "Whether 230 should be rounded to 200 before dividing", "Whether 230 and 180 should be added to give the total"],
      "A part of a group cannot be bigger than the group, so the values have been mixed up or misread."),
    { skill: 'total a table first', gen: function () {
      var parts = [rint(30, 60), rint(10, 30), rint(5, 20), rint(2, 10)], tot = parts.reduce(function (a, b) { return a + b; }, 0), i = rint(1, 3), ans = R.roundDp(parts[i] / tot * 100, 1);
      var names = ['Water', 'Protein', 'Lipid', 'Minerals'];
      return nq("The masses in a 100 g sample of minced meat are: water " + parts[0] + " g, protein " + parts[1] + " g, lipid " + parts[2] + " g and minerals " + parts[3] + " g (the rest was not measured). What percentage of the <b>measured</b> mass is " + names[i].toLowerCase() + "? Give your answer to 1 decimal place.", ans, '%',
        "Measured total = " + parts.join(' + ') + " = " + tot + " g. Percentage = " + parts[i] + " ÷ " + tot + " × 100 = " + ans.toFixed(1) + "%.", { tol: 0.05, display: ans.toFixed(1) });
    } },
    { skill: 'use the right whole', gen: function () {
      var m = rint(40, 90), f = rint(40, 90), mi = rint(5, Math.floor(m / 3)), ans = R.roundDp(mi / m * 100, 1);
      return nq("A survey tested " + m + " males and " + f + " females. " + mi + " of the males were short-sighted. Calculate the percentage of males who were short-sighted. Give your answer to 1 decimal place.", ans, '%',
        "Use only the males as the whole: " + mi + " ÷ " + m + " × 100 = " + ans.toFixed(1) + "%.", { tol: 0.05, display: ans.toFixed(1) });
    } }
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-MATH-MEAN-MEDIAN-MODE-RATE */
  T('HBI-MATH-MEAN-MEDIAN-MODE-RATE', 'Find a mean, median, mode or mean rate of change', [
    { skill: 'mean', gen: function () {
      var v = [rint(1600, 1850), rint(1600, 1850), rint(1600, 1850), rint(1600, 1850)].map(function (x) { return x / 10; }), s = v.reduce(function (a, b) { return a + b; }, 0), ans = R.roundDp(s / 4, 1);
      return nq("The heights of four students are " + v.map(dp1).join(' cm, ') + " cm. Calculate the mean height. Give your answer to 1 decimal place.", ans, 'cm',
        "Mean = (" + v.map(dp1).join(' + ') + ") ÷ 4 = " + dp1(s) + " ÷ 4 = " + ans.toFixed(1) + " cm.", { tol: 0.05, display: ans.toFixed(1) });
    } },
    { skill: 'median', gen: function () {
      var v = []; while (v.length < 7) { var x = rint(55, 95); if (v.indexOf(x) < 0) v.push(x); }
      var sorted = v.slice().sort(function (a, b) { return a - b; });
      return nq("Seven people's resting pulse rates, in beats per minute, are: <b>" + v.join(', ') + "</b>. What is the median pulse rate?", sorted[3], 'beats per minute',
        "Put the values in order: " + sorted.join(', ') + ". The middle (4th) value is " + sorted[3] + ".");
    } },
    { skill: 'median', gen: function () {
      var v = []; while (v.length < 6) { var x = rint(10, 40); if (v.indexOf(x) < 0) v.push(x); }
      var s = v.slice().sort(function (a, b) { return a - b; }), ans = (s[2] + s[3]) / 2;
      return nq("Six students held their breath for these times, in seconds: <b>" + v.join(', ') + "</b>. What is the median time?", ans, 's',
        "In order: " + s.join(', ') + ". With six values, the median is the mean of the 3rd and 4th: (" + s[2] + " + " + s[3] + ") ÷ 2 = " + ans + " s.", { tol: 0.01, display: String(ans) });
    } },
    { skill: 'mode', gen: function () {
      var m = rint(2, 5), v = [m, m, m]; while (v.length < 9) { var x = rint(0, 6); if (x !== m && v.filter(function (y) { return y === x; }).length < 2) v.push(x); }
      v = shuffled(v);
      return nq("A dentist counts the fillings in each of nine patients: <b>" + v.join(', ') + "</b>. What is the mode?", m, '',
        m + " appears most often (3 times), so the mode is " + m + ". The mode is not the largest value.");
    } },
    { skill: 'mean rate of change', gen: function () {
      var h = rint(3, 8), start = rint(40, 80) * 10, change = h * rint(30, 90), ans = R.roundDp(change / h, 1);
      return nq("A patient's urine collection bag held " + start + " cm³ at 08:00 and " + (start + change) + " cm³ " + h + " hours later. Calculate the mean rate of urine production in cm³ per hour.", ans, 'cm³ per hour',
        "Change = " + (start + change) + " − " + start + " = " + change + " cm³. Rate = " + change + " ÷ " + h + " = " + ans + " cm³ per hour.", { tol: 0.05, display: String(ans) });
    } },
    { skill: 'mean rate of change', gen: function () {
      var d = rint(10, 28), per = rint(20, 45), g = d * per, start = 100 * rint(30, 42), end = start + g;
      return nq("A baby's mass rose from " + (start / 1000).toFixed(3) + " kg to " + (end / 1000).toFixed(3) + " kg in " + d + " days. Calculate the mean increase in mass per day, in grams.", per, 'g per day',
        "Increase = " + (end / 1000).toFixed(3) + " − " + (start / 1000).toFixed(3) + " = " + (g / 1000).toFixed(3) + " kg = " + g + " g. Mean per day = " + g + " ÷ " + d + " = " + per + " g per day.");
    } },
    { skill: 'mean', gen: function () {
      var base = rint(220, 260), v = [base + rint(-6, 6), base + rint(-6, 6), base + rint(-6, 6), base + rint(-6, 6)], s = v.reduce(function (a, b) { return a + b; }, 0);
      var ans = R.roundDp(s / 4, 1);
      return nq("A student timed how long 100 bubbles took to form, four times: " + v.join(' s, ') + " s. Calculate the mean time. Give your answer to 1 decimal place.", ans, 's',
        "Mean = (" + v.join(' + ') + ") ÷ 4 = " + s + " ÷ 4 = " + ans.toFixed(1) + " s. Divide by the number of values, 4.", { tol: 0.05, display: ans.toFixed(1) });
    } },
    { skill: 'leave out an anomaly', gen: function () {
      var b = rint(30, 50), v = [b + rint(-2, 2), b + rint(-2, 2), b + 20 + rint(0, 8), b + rint(-2, 2)], kept = [v[0], v[1], v[3]], ans = R.roundDp((kept[0] + kept[1] + kept[2]) / 3, 1);
      return nq("A student measured the time for a colour change four times: " + v.join(' s, ') + " s. Calculate the mean, leaving out the anomalous result. Give your answer to 1 decimal place.", ans, 's',
        v[2] + " s does not fit the others, so leave it out. Mean = (" + kept.join(' + ') + ") ÷ 3 = " + ans.toFixed(1) + " s.", { tol: 0.05, display: ans.toFixed(1) });
    } },
    M('which average', "A student lists the values 3, 5, 5, 6 and 9. Which statement is correct?",
      "The mode is 5 and the median is 5", ["The mode is 9 and the median is 6", "The mode is 5 and the median is 6", "The mode is 6 and the median is 5"],
      "5 appears twice, so it is the mode. In order, the middle value is 5, so the median is also 5."),
    M('common errors', "To find a median, what must you do first?",
      "Put the values in order from smallest to largest", ["Add all the values together", "Remove the largest and smallest values", "Find the value that appears most often"],
      "The median is the middle value of an ordered list. Without ordering, the middle value can be wrong."),
    F('vague \'units\' of blood glucose replaced by a urine volume in cm3', M('common errors', "The volume of urine in a collection bag rose by 520 cm³ over 4 hours. A student writes the mean rate as 520 cm³ per hour. What is wrong?",
      "The change was not divided by the time: 520 ÷ 4 = 130 cm³ per hour", ["Nothing; the rate is the total change", "The change should be multiplied by 4", "The rate should be given per minute"],
      "Mean rate of change = change ÷ time taken.")),
    M('rounding', "A mean works out as 172.075 cm. The question asks for 1 decimal place. What should the student write?",
      "172.1 cm", ["172 cm", "172.07 cm", "172.0 cm"], "To 1 decimal place, 172.075 rounds to 172.1. Writing 172 does not follow the instruction.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-MATH-RATIO */
  T('HBI-MATH-RATIO', 'Calculate and express a ratio in a required form', [
    { skill: 'form 1 : n', gen: function () {
      var a = 250 * rint(20, 40), b = a + 250 * rint(4, 30), ans = R.roundDp(b / a, 2);
      return nq("A healthy person has " + commas(a) + " white blood cells per mm³ of blood. A person with an infection has " + commas(b) + " per mm³. Write the ratio of the healthy count to the infected count in the form 1 : n. Give n to 2 decimal places.", ans, '',
        "Divide both by the first number: 1 : " + commas(b) + " ÷ " + commas(a) + " = 1 : " + ans.toFixed(2) + ". Keep the order given: healthy first.", { tol: 0.005, display: ans.toFixed(2) });
    } },
    { skill: 'form n : 1', gen: function () {
      var b = rint(12, 30), a = b * rint(2, 5) + rint(1, b - 1), ans = R.roundDp(a / b, 1);
      return nq("At a blood donation session, " + a + " donors had blood group O and " + b + " had blood group B. Write the ratio of group O donors to group B donors in the form n : 1. Give n to 1 decimal place.", ans, '',
        "Divide both numbers by the second number: " + a + " ÷ " + b + " = " + ans.toFixed(1) + ", so the ratio is " + ans.toFixed(1) + " : 1.", { tol: 0.05, display: ans.toFixed(1) });
    } },
    { skill: 'simplest form', gen: function () {
      var f = pick([50, 125, 250]), p = pick([[1, 3], [2, 5], [3, 4], [1, 4], [3, 7]]), a = f * p[0], b = f * p[1];
      var right = p[0] + ' : ' + p[1];
      return mq("A drink contains " + a + " mg of sugar and " + b + " mg of fibre. What is the ratio of sugar to fibre in its simplest form?", right,
        [p[1] + ' : ' + p[0], a / 10 + ' : ' + b / 10, '1 : ' + R.roundDp(b / a + 1, 2)].filter(function (x) { return x !== right; }),
        "Divide both numbers by their highest common factor, " + f + ": " + a + " ÷ " + f + " = " + p[0] + " and " + b + " ÷ " + f + " = " + p[1] + ".");
    } },
    { skill: 'times greater', gen: function () {
      var a = rint(5, 7), k = rint(2, 5), b = a * k;
      return nq("At rest, an athlete's heart pumps " + a + " dm³ of blood per minute. During hard exercise it pumps " + b + " dm³ per minute. How many times greater is the volume pumped during exercise?", k, '',
        "Times greater = " + b + " ÷ " + a + " = " + k + ".", { tol: 0.001, display: String(k) });
    } },
    { skill: 'same units first', gen: function () {
      var g = R.roundDp(rint(12, 30) / 10, 1), mg = rint(150, 600), ans = R.roundDp(g * 1000 / mg, 1);
      return nq("A meal contains " + dp1(g) + " g of salt and " + mg + " mg of potassium. Write the ratio of salt to potassium in the form n : 1. Give n to 1 decimal place.", ans, '',
        "Change both to mg: " + dp1(g) + " g = " + R.roundDp(g * 1000, 0) + " mg. Then " + R.roundDp(g * 1000, 0) + " ÷ " + mg + " = " + ans.toFixed(1) + ", so the ratio is " + ans.toFixed(1) + " : 1.", { tol: 0.05, display: ans.toFixed(1) });
    } },
    { skill: 'standard form', gen: function () {
      var a = rint(40, 60) / 10, b = rint(40, 90) / 10, ans = R.roundDp(a * 1e6 / (b * 1e3), 0);
      return nq("A person has " + a.toFixed(1) + " × 10<sup>6</sup> red blood cells and " + b.toFixed(1) + " × 10<sup>3</sup> white blood cells in each mm³ of blood. Calculate the ratio of red to white blood cells in the form n : 1. Give n to the nearest whole number.", ans, '',
        "n = " + a.toFixed(1) + " × 10⁶ ÷ " + b.toFixed(1) + " × 10³ = " + commas(ans) + " (to the nearest whole number), so the ratio is " + commas(ans) + " : 1.", { tol: 0.6, display: commas(ans) });
    } },
    { skill: 'from a chart', gen: function () {
      var labs = ['Country P', 'Country Q'], v = [R.roundDp(2 * rint(15, 30), 0), R.roundDp(2 * rint(31, 45), 0)], ans = R.roundDp(v[1] / v[0], 2);
      return nq("The bar chart shows the percentage of adults who are overweight in two countries. Calculate the ratio of overweight adults in country P to country Q, in the form 1 : n. Give n to 2 decimal places.", ans, '',
        "Read both bars: P = " + v[0] + "% and Q = " + v[1] + "%. 1 : " + v[1] + " ÷ " + v[0] + " = 1 : " + ans.toFixed(2) + ".",
        { tol: 0.005, display: ans.toFixed(2), svg: barChart({ labels: labs, values: v, ymax: 100, ystep: 20, yminor: 10, xlabel: 'Country', ylabel: 'Adults overweight in %', alt: 'Bar chart of overweight adults in two countries' }) });
    } },
    M('order', "A question asks for the ratio of <b>males to females</b>. There are 18 males and 12 females. Which answer is correct?",
      "3 : 2", ["2 : 3", "1 : 1.5", "12 : 18"], "Keep the order asked for: males first. 18 : 12 simplifies to 3 : 2."),
    M('form 1 : n', "A student writes the ratio 6400 : 11 200 in the form 1 : n. Which answer is correct?",
      "1 : 1.75", ["1.75", "1 : 0.57", "6400 : 11 200"],
      "Divide both by the first number: 11 200 ÷ 6400 = 1.75. The answer must keep the colon and the 1."),
    M('times greater', "Bacteria in sample A number 600. In sample B they number 150. Which statement is correct?",
      "Sample A has 4 times as many bacteria as sample B", ["Sample A has 450 times as many bacteria as sample B", "Sample B has 4 times as many bacteria as sample A", "Sample A has 0.25 times as many bacteria as sample B"],
      "Times greater = 600 ÷ 150 = 4."),
    M('simplest form', "Which ratio is 250 : 750 in its simplest form?",
      "1 : 3", ["25 : 75", "3 : 1", "1 : 500"], "The highest common factor is 250: 250 ÷ 250 = 1 and 750 ÷ 250 = 3."),
    M('form n : 1', "A question asks for a ratio in the form n : 1. What should you divide both numbers by?",
      "The second number", ["The first number", "The larger number", "Their total"], "In n : 1 the second side must be 1, so divide both by the second number.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-MATH-BAR-CHART */
  T('HBI-MATH-BAR-CHART', 'Draw a bar chart and justify its use', [
    M('when to use a bar chart', "Why is a bar chart, not a line graph, the right way to show the sugar in five different brands of drink?",
      "The brands are separate categories, not a continuous scale", ["A bar chart is always easier to read than a line graph", "The sugar values are too large for a line graph", "Bar charts are only used for numbers over 100"],
      "Bar charts are for separate (discrete) categories. 'Easier to read' does not give the reason."),
    M('when to use a bar chart', "Which data should be shown as a bar chart?",
      "Number of people with each blood group", ["Body temperature measured every hour", "Mass of a baby at each week of age", "Heart rate at each minute of exercise"],
      "Blood groups are separate categories. The others change continuously with time, so they suit a line graph."),
    M('axes', "When drawing a bar chart of the number of students with each eye colour, what goes on the x-axis?",
      "The eye colours", ["The number of students", "The percentage of students", "The scale from 0 to the maximum"],
      "The categories go on the x-axis and the measured values (number of students) on the y-axis."),
    M('drawing rules', "Which feature is needed for a bar chart to gain full marks?",
      "Bars of equal width with a linear y-axis scale", ["Bars of different widths to show which is biggest", "A line joining the tops of the bars", "A y-axis scale that jumps from 10 to 50 to 200"],
      "Bars should be the same width, and the y-axis scale must go up in equal steps."),
    { skill: 'choosing a scale', gen: function () {
      var max = pick([34, 46, 72, 88, 140, 175]), opts = { 34: ['5', '1', '20', '50'], 46: ['5', '1', '25', '50'], 72: ['10', '1', '50', '100'], 88: ['10', '2', '50', '100'], 140: ['20', '5', '100', '200'], 175: ['20', '5', '100', '250'] }[max];
      return mq("A student's largest value is " + max + ". The y-axis of the grid has 10 large squares. Which value for each large square gives a sensible scale that uses at least half the grid?",
        opts[0], opts.slice(1), "With " + opts[0] + " per large square, the axis goes to " + (opts[0] * 10) + ", so " + max + " fits and uses more than half the grid. The other choices either do not fit or squash the bars.");
    } },
    M('choosing a scale', "The values to plot are between 0.0010 and 0.0140. Which y-axis step per large square is most sensible?",
      "0.002", ["1", "0.5", "0.00001"], "A step of 0.002 per large square fits 0.0140 within 7 squares and uses the grid well."),
    M('labels', "A student's bar chart has numbers on the y-axis but no label. What should be added?",
      "The name of the quantity and its unit, such as 'Mass of fat in g'", ["A title saying 'Bar chart'", "The date the data were collected", "A key showing what each colour means"],
      "Each axis needs the quantity and the unit."),
    M('grouped data', "Heights of students are grouped into 150–159 cm, 160–169 cm and 170–179 cm. How should these be shown on a bar chart?",
      "One bar for each height group", ["One bar for each student", "A single bar for the total", "A line through the middle of each group"],
      "With grouped data, each group gets one bar showing how many are in that group."),
    M('common errors', "A student draws a line graph for the number of cases of five different diseases. What is the problem?",
      "The diseases are separate categories, so a bar chart should be used", ["A line graph cannot have five points", "The line should have been a curve", "There is no problem; any graph is accepted"],
      "Joining categories with a line suggests values between them, which do not exist. A line graph instead of a bar chart limits the marks."),
    M('drawing rules', "How accurately should the tops of the bars be plotted?",
      "To within half a small square", ["To the nearest large square", "Roughly, as long as the order is right", "Exactly at a grid line, rounding if needed"],
      "Bar heights must be within half a small square of the true value."),
    { skill: 'checking a chart', gen: function () {
      var labs = ['A', 'B', 'C', 'D'], v = labs.map(function () { return 5 * rint(4, 18); }), wrong = rint(0, 3), shown = v.slice(); shown[wrong] = v[wrong] + 10;
      var tbl = table(['Food', 'Energy in kJ per 10 g'], labs.map(function (l, i) { return ['Food ' + l, v[i]]; }));
      return mq("A student drew a bar chart of this table." + tbl + "Which bar has been plotted wrongly?", 'Food ' + labs[wrong], labs.filter(function (_, i) { return i !== wrong; }).map(function (l) { return 'Food ' + l; }),
        "Food " + labs[wrong] + " should be " + v[wrong] + " kJ but its bar reaches " + shown[wrong] + ". Each small square is 5 kJ, so it is 10 kJ too high.",
        { svg: barChart({ labels: labs.map(function (l) { return 'Food ' + l; }), values: shown, ymax: 100, ystep: 20, yminor: 4, xlabel: 'Food', ylabel: 'Energy in kJ per 10 g', alt: 'Student bar chart of energy in four foods' }) });
    } },
    M('axes', "A bar chart shows the time taken by different groups to complete a task. Where should the y-axis scale start?",
      "At zero", ["At the smallest value in the table", "At the largest value in the table", "At any value, as long as the steps are equal"],
      "Starting at zero means the bar heights compare fairly.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-MATH-PLOT-LINE-GRAPH */
  T('HBI-MATH-PLOT-LINE-GRAPH', 'Plot a line graph from a table of results', [
    M('axes', "A student measures body temperature every 10 minutes. Which variable goes on the x-axis?",
      "Time, because it is the independent variable", ["Body temperature, because it is measured", "Whichever variable has the larger numbers", "Body temperature, because it is the most important"],
      "The independent variable (here time) goes on the x-axis."),
    M('labels', "Which is the best label for the y-axis of a graph of pulse rate?",
      "Pulse rate in beats per minute", ["Pulse rate of the students", "Beats counted in the test", "Pulse rate (measured value)"], "Each axis label gives the quantity and its unit, copied from the table heading."),
    M('scale', "Which y-axis scale is correct?",
      "0, 20, 40, 60, 80, 100 in equal spaces", ["0, 50, 100, 200, 400 in equal spaces", "0, 10, 30, 60, 100 in equal spaces", "100, 80, 60, 40, 20, 0 going up the axis"],
      "A linear scale goes up in equal steps for equal spaces."),
    { skill: 'scale', gen: function () {
      var max = pick([38, 47, 64, 85]), c = { 38: ['5', '1', '20', '50'], 47: ['5', '1', '20', '50'], 64: ['10', '2', '25', '50'], 85: ['10', '2', '25', '50'] }[max];
      return mq("A graph grid has 10 large squares up the y-axis. The largest value to plot is " + max + ". Which value per large square gives a scale that uses more than half the grid and fits all the points?",
        c[0], c.slice(1), c[0] + " per large square gives an axis up to " + (c[0] * 10) + ", which fits " + max + " and uses more than half of the grid.");
    } },
    M('plotting', "How should points be marked when plotting a line graph?",
      "With small crosses, accurate to half a small square", ["With large dots that cover several small squares each", "With small crosses, placed to the nearest large square", "With short bars drawn up from the x-axis to each value"],
      "Small, neat crosses make the position clear. Each must be within half a small square of the true value."),
    M('joining points', "The question says 'Join the points with straight lines'. What should the student do?",
      "Use a ruler to join each point to the next", ["Draw a smooth curve that passes through the points", "Draw one straight line of best fit through the points", "Leave the points unjoined, as joining them is optional"],
      "Follow the instruction: straight ruled lines from point to point."),
    M('two data sets', "A graph shows two lines: results with and without exercise. What must the student add?",
      "A key or a label on each line", ["A second x-axis for the other line", "A title above each line", "A bar for each point"],
      "Two lines need a key or labels, or the reader cannot tell which line is which."),
    M('common errors', "A student plots time on the y-axis and heart rate on the x-axis. Why does this lose a mark?",
      "The axes are swapped; time should be on the x-axis", ["Heart rate cannot be plotted on any kind of line graph", "The student should have drawn a bar chart of the results", "The scale on the y-axis must always start at 100"],
      "The independent variable goes on the x-axis."),
    M('scale', "A student's points only fill the bottom quarter of the grid. What should the student do?",
      "Choose a larger scale so the points fill at least half the grid", ["Leave it as it is, because any scale gets full marks", "Draw the graph again on a smaller piece of graph paper", "Make the crosses bigger so that they are easier to see on the grid"],
      "The scale should make the plotted points use at least half of the grid in each direction."),
    { skill: 'check a plot', gen: function () {
      var xs = [0, 10, 20, 30, 40, 50], ys = xs.map(function (x, i) { return 10 + i * 12; }), bad = rint(1, 4), shown = ys.slice(); shown[bad] += 6;
      var tbl = table(['Time in minutes', '0', '10', '20', '30', '40', '50'], [['Volume of gas in cm³'].concat(ys.map(String))]);
      return mq("A student plotted the results in the table." + tbl + "Which point has been plotted wrongly?", xs[bad] + ' minutes',
        xs.filter(function (_, i) { return i !== bad; }).slice(0, 3).map(function (x) { return x + ' minutes'; }),
        "At " + xs[bad] + " minutes the volume should be " + ys[bad] + " cm³, but the point is at " + shown[bad] + " cm³.",
        { svg: lineGraph({ series: [{ xs: xs, ys: shown }], xmax: 50, xstep: 10, xminor: 2, ymax: 80, ystep: 10, yminor: 5, xlabel: 'Time in minutes', ylabel: 'Volume of gas in cm³', alt: 'Student line graph of gas volume against time' }) });
    } },
    M('when to join', "When should points on a line graph be joined, or a curve drawn through them?",
      "Only when the question tells you to", ["Always, with a line of best fit", "Never; points must be left alone", "Only when there are more than ten points"],
      "Follow the instruction in the question: join with straight lines, draw a curve or leave the points."),
    M('line or bar', "A student has measured the volume of oxygen used at five walking speeds. Why is a line graph suitable?",
      "Walking speed is a continuous variable", ["Walking speed is a set of separate categories", "Line graphs are always better than bar charts", "Volume of oxygen cannot go on a bar chart"],
      "Continuous data, where values in between have meaning, are plotted as a line graph.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-MATH-LINE-OF-BEST-FIT */
  function bfSvg(lines, pts, alt) {
    var L = 70, T = 20, W = 460, H = 280, px = function (x) { return L + x / 10 * W; }, py = function (y) { return T + H - y / 10 * H; }, g = '', i;
    for (i = 0; i <= 10; i++) g += '<line x1="' + px(i) + '" y1="' + T + '" x2="' + px(i) + '" y2="' + (T + H) + '" stroke="#e3e8ef"/><line x1="' + L + '" y1="' + py(i) + '" x2="' + (L + W) + '" y2="' + py(i) + '" stroke="#e3e8ef"/>';
    var c = [BLUE, HI, '#2f8a5b'];
    var ls = lines.map(function (l, k) { return '<path d="' + l.d.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, function (_, x, y) { return px(+x) + ',' + py(+y); }) + '" fill="none" stroke="' + c[k] + '" stroke-width="2.5"' + (k ? ' stroke-dasharray="' + (k === 1 ? '8 4' : '2 4') + '"' : '') + '/><text x="' + px(l.lx) + '" y="' + py(l.ly) + '" font-size="15" fill="' + c[k] + '">' + l.name + '</text>'; }).join('');
    var ps = pts.map(function (p) { return '<path d="M' + (px(p[0]) - 5) + ' ' + (py(p[1]) - 5) + ' l10 10 m0 -10 l-10 10" stroke="' + INK + '" stroke-width="2"/>'; }).join('');
    return '<svg class="mc-svg" viewBox="0 0 560 330" role="img" aria-label="' + alt + '">' + g + '<line x1="' + L + '" y1="' + (T + H) + '" x2="' + (L + W) + '" y2="' + (T + H) + '" stroke="' + INK + '"/><line x1="' + L + '" y1="' + T + '" x2="' + L + '" y2="' + (T + H) + '" stroke="' + INK + '"/>' + ls + ps + '</svg>';
  }
  var BF1 = bfSvg([{ d: 'M1,1.3 L9,8.3', name: 'A', lx: 9.2, ly: 8.6 }, { d: 'M1,1 L3,3.4 L5,4.8 L7,6.9 L9,8', name: 'B', lx: 9.2, ly: 7.6 }, { d: 'M1,2.6 L9,9.6', name: 'C', lx: 8.2, ly: 9.7 }],
    [[1, 1], [3, 3.4], [5, 4.8], [7, 6.9], [9, 8]], 'Five plotted points with three lines labelled A, B and C');
  var BF2 = bfSvg([{ d: 'M1,2 L9,7.2', name: 'A', lx: 9.2, ly: 7.2 }, { d: 'M1,2.2 L9,8.6', name: 'B', lx: 9.2, ly: 8.6 }, { d: 'M1,2.2 L4,4.6 L5,2 L6,6.2 L9,8.6', name: 'C', lx: 4.6, ly: 1.3 }],
    [[1, 2.2], [2, 3], [3, 3.8], [4, 4.6], [5, 2.0], [6, 6.2], [7, 7], [8, 7.8], [9, 8.6]], 'Nine plotted points, one far below the others, with three lines labelled A, B and C');
  var BF3 = bfSvg([{ d: 'M1,8.5 Q5,-1.5 9,8.5', name: 'A', lx: 9.1, ly: 8.8 }, { d: 'M1,8.5 L5,3.5 L9,8.5', name: 'B', lx: 5.2, ly: 2.8 }, { d: 'M1,5 L9,5', name: 'C', lx: 9.1, ly: 5.3 }],
    [[1, 8.5], [2, 6.1], [3, 4.4], [4, 3.6], [5, 3.5], [6, 3.7], [7, 4.5], [8, 6.2], [9, 8.4]], 'Nine plotted points in a U shape with three lines labelled A, B and C');
  T('HBI-MATH-LINE-OF-BEST-FIT', 'Draw a line or curve of best fit through plotted points', [
    M('choose the best line', "The graph shows five results and three lines. Which line is the line of best fit?", "A", ["B", "C"],
      "Line A is one straight line with the points spread evenly on both sides. B joins dot to dot, and C has every point below it.", { svg: BF1, family: 'g03-bf1' }),
    M('anomalous points', "The graph shows nine results. One point is anomalous. Which line is the best line of best fit?", "B", ["A", "C"],
      "Line B follows the pattern of the eight good points and ignores the anomalous point at 5. Line A is pulled down towards the anomaly, and C joins every point, including the anomaly.", { svg: BF2, family: 'g03-bf2' }),
    M('straight or curved', "The graph shows results that fall and then rise. Which line is the best fit?", "A", ["B", "C"],
      "The points make a U shape, so one smooth curve fits best. B is two straight lines meeting at a point, and C ignores the pattern.", { svg: BF3, family: 'g03-bf3' }),
    M('what a best-fit line is', "What does a line of best fit show?",
      "The overall trend of the data", ["The exact value of every point", "The path from one point to the next", "The highest and lowest values only"],
      "A line of best fit shows the general pattern. It does not need to pass through every point."),
    M('how to draw it', "Which describes a good line of best fit?",
      "One thin line with points spread evenly on both sides", ["A line that passes exactly through every single plotted point", "A thick, sketchy line drawn so that it covers all the points", "Two lines, one above the points and one below the points"],
      "Draw one single, thin line (or smooth curve) that balances the points above and below it."),
    M('anomalous points', "What should you do with an anomalous point when drawing a line of best fit?",
      "Ignore it and follow the pattern of the other points", ["Make the line bend so that it passes exactly through it", "Draw a second line of best fit that goes through it", "Delete all the other points near it from the graph"],
      "An anomalous point does not fit the pattern, so the line should not be pulled towards it."),
    M('straight or curved', "How do you decide whether to draw a straight line or a curve of best fit?",
      "Use a curve if the points clearly bend", ["Always draw a straight line, whatever the pattern shows", "Always draw a curve, because a curve fits more of the points", "Count the points: more than six points always needs a curve"],
      "Choose the shape that matches the pattern. A straight line through clearly curving points is a common mistake."),
    M('common errors', "A student joins each point to the next with a ruler and calls it a line of best fit. What is wrong?",
      "Dot to dot shows each step, not the overall trend", ["Nothing is wrong; this is a correct line of best fit", "The student should have drawn the lines in pencil instead", "The line should have started at the origin of the graph"],
      "A best-fit line is a single smooth line or curve for the trend, not a set of point-to-point lines."),
    M('how to draw it', "Should a line of best fit be drawn beyond the first and last points?",
      "No, not unless the question asks for it", ["Yes, it should always go to the edges of the grid", "Yes, it should always be drawn back to the origin", "Only if there is an anomalous point on the graph"],
      "Extending the line goes beyond the data. Only do it when asked, for example to make a prediction."),
    M('straight or curved', "Points on a graph rise to a peak and then fall. What should the line of best fit look like?",
      "One smooth curve through the highest region", ["Two straight lines meeting at the highest point", "A straight line from the first to the last point", "A horizontal line at the mean value"],
      "A peaked pattern needs a single smooth curve, not two straight lines meeting at a sharp point."),
    M('what a best-fit line is', "Why is a line of best fit useful?",
      "It shows the trend and helps you read values between points", ["It makes the graph look tidier, which is what gains the marks", "It proves that one of the variables causes the other to change", "It removes the need to repeat the experiment to check results"],
      "The line shows the pattern clearly and can be used to read values between plotted points."),
    M('how to draw it', "A straight line of best fit passes above six points and below one point. What is wrong with it?",
      "The points should be spread evenly on each side", ["Nothing is wrong, because a line of best fit can go anywhere", "The line must always pass through the first plotted point", "A line of best fit must always be drawn as a horizontal line"],
      "A best-fit line balances the points: roughly as many on one side as on the other.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-MATH-PERCENTAGE-CHANGE */
  T('HBI-MATH-PERCENTAGE-CHANGE', 'Calculate a percentage change or percentage difference', [
    { skill: 'increase', gen: function () {
      var o = rint(40, 120) * 10, n = o + rint(10, 60) * 10, ans = R.roundDp((n - o) / o * 100, 1);
      return nq("A clinic gave " + commas(o) + " flu vaccinations last winter and " + commas(n) + " this winter. Calculate the percentage increase. Give your answer to 1 decimal place.", ans, '%',
        "Change = " + n + " − " + o + " = " + (n - o) + ". Percentage change = " + (n - o) + " ÷ " + o + " × 100 = " + ans.toFixed(1) + "%. Divide by the original value, " + o + ".", { tol: 0.05, display: ans.toFixed(1) });
    } },
    F('displayed values could be rounded differently from the values used for the answer; now exact to 2 decimal places', { skill: 'decrease', gen: function () {
      var o = rint(450, 700), n = o - rint(40, 150), ans = R.roundDp((o - n) / o * 100, 1);
      return nq("A patient's blood cholesterol fell from " + (o / 100).toFixed(2) + " to " + (n / 100).toFixed(2) + " mmol per dm³ after six months on a new diet. Calculate the percentage decrease. Give your answer to 1 decimal place.", ans, '%',
        "Fall = " + (o / 100).toFixed(2) + " − " + (n / 100).toFixed(2) + " = " + ((o - n) / 100).toFixed(2) + ". Percentage decrease = fall ÷ original × 100 = " + ans.toFixed(1) + "%.", { tol: 0.05, display: ans.toFixed(1) });
    } }),
    { skill: 'from a table of changes', gen: function () {
      var start = rint(60, 95) / 10, ch = rint(2, 9) / 10, gain = Math.random() < 0.5, ans = R.roundDp(ch / start * 100, 1);
      return nq("A potato cylinder had a mass of " + start.toFixed(1) + " g. After 30 minutes in a solution, its mass had " + (gain ? 'increased' : 'decreased') + " by " + ch.toFixed(1) + " g. Calculate the percentage change in mass. Give the size of the change to 1 decimal place.", ans, '%',
        "Percentage change = change ÷ starting mass × 100 = " + ch.toFixed(1) + " ÷ " + start.toFixed(1) + " × 100 = " + ans.toFixed(1) + "% (" + (gain ? 'an increase' : 'a decrease') + ").", { tol: 0.05, display: ans.toFixed(1) });
    } },
    F('resting breathing volumes of 40-90 dm3 per minute were far too high; now 6-9', { skill: 'over 100%', gen: function () {
      var o = rint(6, 9), k = pick([3, 4, 5, 6]), n = o * k, ans = R.roundDp((n - o) / o * 100, 0);
      return nq("During exercise, the volume of air a student breathed in each minute rose from " + o + " dm³ to " + n + " dm³. Calculate the percentage increase.", ans, '%',
        "Change = " + n + " − " + o + " = " + (n - o) + ". " + (n - o) + " ÷ " + o + " × 100 = " + ans + "%. An increase can be more than 100%.");
    } }),
    { skill: 'units first', gen: function () {
      var o = rint(450, 900) * 1000, n = rint(11, 19) / 10, ans = R.roundDp((n * 1e6 - o) / o * 100, 0);
      return nq("The number of people with a disease rose from " + commas(o) + " to " + n.toFixed(1) + " million. Calculate the percentage increase. Give your answer to the nearest whole number.", ans, '%',
        n.toFixed(1) + " million = " + commas(n * 1e6) + ". Change = " + commas(n * 1e6 - o) + ". Percentage = " + commas(n * 1e6 - o) + " ÷ " + commas(o) + " × 100 = " + ans + "%.");
    } },
    { skill: 'decrease', gen: function () {
      var o = rint(30, 60), n = o - rint(5, 20), ans = R.roundDp((o - n) / o * 100, 1);
      return nq("A town had " + o + " cases of measles in one year and " + n + " the next year, after a vaccination campaign. Calculate the percentage decrease. Give your answer to 1 decimal place.", ans, '%',
        "Fall = " + o + " − " + n + " = " + (o - n) + ". " + (o - n) + " ÷ " + o + " × 100 = " + ans.toFixed(1) + "%.", { tol: 0.05, display: ans.toFixed(1) });
    } },
    M('common errors', "A heart rate rose from 60 to 90 beats per minute. A student writes the percentage change as 30 ÷ 90 × 100 = 33%. What is wrong?",
      "The change should be divided by the original value, 60, giving 50%", ["Nothing; this is the correct method", "The student should divide 90 by 60 and give 1.5%", "The student should add 60 and 90 before dividing"],
      "Percentage change = change ÷ original × 100 = 30 ÷ 60 × 100 = 50%."),
    M('common errors', "A value fell from 90 to 70. A student calculates 70 ÷ 90 × 100 = 78% and calls this the percentage change. What is the correct percentage change?",
      "A decrease of 22%", ["A decrease of 78%", "An increase of 78%", "A decrease of 29%"],
      "78% is the new value as a share of the old. The change is (90 − 70) ÷ 90 × 100 = 22%, a decrease. 29% comes from dividing by 70, the new value."),
    M('which is original', "A question asks for the percentage change in deaths 'in 2020 compared with 2010'. Which value goes on the bottom of the fraction?",
      "The value for 2010", ["The value for 2020", "The larger of the two values", "The difference between the values"],
      "The value after 'compared with' is the original value, so it goes on the bottom."),
    M('rounding', "A percentage change works out as 35.714...%. The question asks for two significant figures. What should the student write?",
      "36%", ["35%", "35.7%", "0.36%"], "To two significant figures, 35.714 rounds to 36."),
    M('increase', "The mass of a muscle sample went from 2.0 g to 2.5 g. What is the percentage change?",
      "An increase of 25%", ["An increase of 20%", "An increase of 0.5%", "An increase of 125%"],
      "Change = 0.5 g. 0.5 ÷ 2.0 × 100 = 25%. 20% comes from dividing by the new mass."),
    M('decrease', "Why must you say 'decrease' (or use a minus sign) when a value has fallen?",
      "Because a percentage change without a direction does not show whether the value went up or down", ["Because decreases are always larger than increases", "Because the formula only works for increases", "Because examiners only accept negative numbers"],
      "The size and the direction are both part of the answer.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-MATH-AMOUNT-FROM-PERCENTAGE */
  T('HBI-MATH-AMOUNT-FROM-PERCENTAGE', 'Calculate an amount from a percentage, fraction or probability', [
    { skill: 'percentage of a total', gen: function () {
      var tot = rint(150, 900) * 100, p = rint(5, 45), ans = tot * p / 100;
      return nq("A city has " + commas(tot) + " adults. A survey suggests that " + p + "% of them smoke. Calculate the number of adults who smoke.", ans, '',
        "Amount = total × percentage ÷ 100 = " + commas(tot) + " × " + p + " ÷ 100 = " + commas(ans) + ".", { display: commas(ans) });
    } },
    F('2 s.f. answer now shown with trailing zero where needed', { skill: 'in millions', gen: function () {
      var tot = rint(200, 900) / 10, p = rint(30, 120) / 10, ans = R.roundSf(tot * p / 100, 2);
      return nq("A country has a population of " + tot.toFixed(1) + " million. " + p.toFixed(1) + "% of the population have asthma. Calculate the number of people with asthma, in millions. Give your answer to 2 significant figures.", ans, 'million',
        tot.toFixed(1) + " × " + p.toFixed(1) + " ÷ 100 = " + R.roundDp(tot * p / 100, 4) + " million, which is " + ans + " million to 2 significant figures. Keep the answer in millions.", { tol: Math.pow(10, Math.floor(Math.log10(ans)) - 1) / 2 + 1e-9, display: ans.toPrecision(2) });
    } }),
    { skill: 'value after a fall', gen: function () {
      var v = rint(30, 60) * 100, p = rint(15, 40), ans = v * (100 - p) / 100;
      return nq("A person's lung capacity is " + commas(v) + " cm³. A lung disease reduces it by " + p + "%. Calculate the new lung capacity.", ans, 'cm³',
        "New value = " + commas(v) + " × (1 − " + p + "/100) = " + commas(v) + " × " + ((100 - p) / 100).toFixed(2) + " = " + commas(ans) + " cm³. Do not give the size of the fall (" + commas(v * p / 100) + ") as the answer.", { display: commas(ans) });
    } },
    { skill: 'value after a rise', gen: function () {
      var v = rint(80, 200) * 1000, p = rint(5, 30), ans = v * (100 + p) / 100;
      return nq("In one year, " + commas(v) + " people were treated for a disease. The next year the number rose by " + p + "%. Calculate the number treated in the second year.", ans, '',
        "New value = " + commas(v) + " × (1 + " + p + "/100) = " + commas(v) + " × " + ((100 + p) / 100).toFixed(2) + " = " + commas(ans) + ". Remember to add the increase on.", { display: commas(ans) });
    } },
    { skill: 'fractions', gen: function () {
      var d = pick([3, 4, 5, 8, 10]), tot = d * rint(20, 200);
      return nq("About one in " + d + " people in a group of " + commas(tot) + " are expected to have high blood pressure. How many people is this?", tot / d, '',
        "'One in " + d + "' means total ÷ " + d + ": " + commas(tot) + " ÷ " + d + " = " + commas(tot / d) + ".", { display: commas(tot / d) });
    } },
    { skill: 'probability', gen: function () {
      var p = pick([0.25, 0.5, 0.75]), n = pick([8, 12, 16, 20, 40]), ans = n * p;
      return nq("Two parents have a probability of " + p + " of having a child with a genetic condition in each pregnancy. Out of " + n + " children born to parents with the same genotypes, how many would be expected to have the condition?", ans, '',
        "Expected number = total × probability = " + n + " × " + p + " = " + ans + ".");
    } },
    F('answer could be a fraction of a person; totals now give whole numbers', { skill: 'right group', gen: function () {
      var tot = 40 * rint(5, 15), p = rint(4, 12) * 5, ans = tot / 2 * p / 100;
      return nq("A study tested " + tot + " people, half male and half female. " + p + "% of the females had low iron levels. How many females had low iron levels?", ans, '',
        "Females = " + tot + " ÷ 2 = " + (tot / 2) + ". Then " + (tot / 2) + " × " + p + " ÷ 100 = " + ans + ". Use only the females as the total.", { tol: 0.001, display: String(ans) });
    } }),
    { skill: 'alcohol units', gen: function () {
      var vol = pick([250, 330, 500, 568]), pc = pick([4, 4.5, 5, 6]), ans = R.roundDp(vol * pc / 100 / 10, 1);
      return nq("One unit of alcohol is 10 cm³ of pure alcohol. A drink of " + vol + " cm³ contains " + pc + "% alcohol. Calculate the number of units in the drink. Give your answer to 1 decimal place.", ans, 'units',
        "Pure alcohol = " + vol + " × " + pc + " ÷ 100 = " + R.roundDp(vol * pc / 100, 2) + " cm³. Units = " + R.roundDp(vol * pc / 100, 2) + " ÷ 10 = " + ans.toFixed(1) + ".", { tol: 0.05, display: ans.toFixed(1) });
    } },
    M('common errors', "To find 30% of 4600 cm³, a student calculates 4600 ÷ 30. What should the student have done?",
      "4600 × 30 ÷ 100, which gives 1380 cm³", ["4600 ÷ 30 × 100, which gives 15 333 cm³", "4600 − 30, which gives 4570 cm³", "30 ÷ 4600 × 100, which gives 0.65 cm³"],
      "A percentage of a total = total × percentage ÷ 100."),
    M('common errors', "A volume of 4600 cm³ falls by 30%. A student gives the new volume as 1380 cm³. What is the mistake?",
      "1380 cm³ is the size of the fall; the new volume is 4600 − 1380 = 3220 cm³", ["There is no mistake; 1380 cm³ is the new volume", "The student should have added 1380 to give 5980 cm³", "The student should have divided by 30 to give 153 cm³"],
      "After a fall, take the decrease away from the starting value, or multiply by 0.70."),
    M('fractions', "Which is the same as 'one in five'?",
      "20%", ["5%", "15%", "50%"], "'One in five' means 1 ÷ 5 = 0.2, and 0.2 × 100 = 20%."),
    M('value after a rise', "A number of 140 000 cases rises by 15%. Which calculation gives the new number of cases?",
      "140 000 × 1.15", ["140 000 × 0.15", "140 000 ÷ 1.15", "140 000 + 15"], "Multiply by (1 + 15/100) = 1.15. 140 000 × 0.15 gives only the increase.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-MATH-DESCRIBE-COMPARE-TRENDS */
  var TR1 = lineGraph({ series: [{ xs: [2, 3, 4, 5, 6, 7, 8, 9, 10], ys: [70, 52, 36, 24, 18, 26, 40, 58, 74] }], xmin: 2, xmax: 10, xstep: 1, xminor: 2, ymax: 80, ystep: 10, yminor: 5, xlabel: 'pH', ylabel: 'Time to digest starch in s', alt: 'Graph of time to digest starch against pH, lowest at pH 6' });
  var TR2 = lineGraph({ series: [{ xs: [0, 30, 60, 90, 120, 150], ys: [5, 8, 6.5, 5.5, 5, 5], label: 'Without diabetes' }, { xs: [0, 30, 60, 90, 120, 150], ys: [7, 12, 15, 14, 12.5, 11], label: 'With diabetes' }], xmax: 150, xstep: 30, xminor: 3, ymax: 20, ystep: 4, yminor: 8, xlabel: 'Time after drinking glucose in minutes', ylabel: 'Blood glucose in mmol per dm³', alt: 'Blood glucose of a person with diabetes and a person without diabetes after drinking glucose' });
  T('HBI-MATH-DESCRIBE-COMPARE-TRENDS', 'Describe a trend or compare data sets and conclude', [
    M('describe a trend', "The graph shows the time taken to digest starch at different pH values. Which description of the trend is best?",
      "As pH increases, the time falls until pH 6, then rises", ["As pH increases, the time taken to digest starch increases steadily", "The time taken to digest the starch changes as the pH changes", "As the time to digest starch increases, the pH increases"],
      "Give the direction and the turning point. 'Changes' gives no direction, and the last choice has the variables the wrong way round.", { svg: TR1, family: 'g03-tr1' }),
    M('quote data', "Using the same graph, which statement uses data from the graph correctly?",
      "The shortest time is 18 s, at pH 6", ["The shortest time is 6 s, at pH 18", "The time is lowest at pH 10, at 74 s", "The longest time is at pH 6, at 18 s"],
      "The lowest point on the line is 18 s, at pH 6. Quote the value with its unit.", { svg: TR1, family: 'g03-tr1' }),
    F('figure: the key box hid the peak of the diabetes curve; y-axis extended to 20', M('compare two curves', "The graph shows blood glucose after drinking glucose for two people. Which comparison is best?",
      "With diabetes, glucose rises higher and stays high longer", ["In both people the blood glucose goes up and then comes down again", "The person with diabetes has a separate line drawn on the graph", "Both people end with the same blood glucose level at 150 minutes"],
      "A comparison says which is higher or changes more. The first choice compares the peak and the return; the others only describe or are wrong.", { svg: TR2, family: 'g03-tr2' })),
    F('figure: the key box hid the peak of the diabetes curve; y-axis extended to 20', M('compare two curves', "Using the same graph, how long does blood glucose take to return to its starting value in the person <b>without</b> diabetes?",
      "About 120 minutes", ["About 30 minutes", "About 60 minutes", "It never returns to its starting value"],
      "The starting value is 5 mmol per dm³. The line reaches 5 again at 120 minutes.", { svg: TR2, family: 'g03-tr2' })),
    M('describe a trend', "What should a good description of a trend include?",
      "The direction, any turning point, and figures with units", ["Every value in the table, written out in the same order", "A full explanation of the reasons why the trend happens", "Only the first and the last values, with their units"],
      "Describe the pattern, point out where it changes, and support it with figures."),
    M('fluctuations', "The number of cases of a disease goes up and down from year to year, but is higher overall in 2024 than in 2010. Which description is best?",
      "The cases fluctuate, but the overall trend is upward", ["The number of cases increases steadily every single year", "The number of cases stays about the same over the years", "The number of cases falls at first and then increases"],
      "Say that the data fluctuate as well as giving the overall direction."),
    M('conclusions', "Which conclusion is worded correctly?",
      "The data suggest smoking is linked to more lung cancer", ["The data prove that smoking causes every case of lung cancer", "Smoking is bad for health, so everyone should stop smoking", "The number of lung cancer cases goes up on the graph"],
      "A conclusion uses 'suggests' and stays with what the data show."),
    M('frequency charts', "A bar chart shows the number of students in each height group. Most students are in the middle groups. How is this best described?",
      "Most are in the middle groups, with few at either end", ["The heights of the students increase from left to right", "Every height group has the same number of students in it", "The tallest students are the most common group in the class"],
      "For a frequency chart, say where most values are and where there are few."),
    S('compare two curves', "Which of these are good ways to compare two lines on a graph?", ["State which line is higher, and over what range", "State where the gap between the lines is largest", "Compare how quickly each line rises"], ["Describe each line on its own without linking them", "List every value from both lines"],
      "Comparing means linking the two lines: higher or lower, faster or slower, where the gap is biggest."),
    M('inverse relationship', "As light intensity increases, the diameter of the pupil decreases. What kind of relationship is this?",
      "An inverse relationship: one rises as the other falls", ["A positive relationship: both variables rise together", "No relationship at all between the two variables", "A relationship that has a delay before it starts"],
      "When one variable increases as the other decreases, the relationship is inverse (negative)."),
    M('lag', "After a vaccine, antibody levels stay low for about a week and then rise quickly. What special feature should the description mention?",
      "A delay (lag) before the antibody level rises", ["A steady fall in the antibody level over time", "An anomalous result at the very start of the graph", "The peak in antibody level happens at the very start"],
      "Point out a delay before an effect appears, and give how long it is."),
    M('no link', "Over ten years, the use of a weedkiller rose steadily, but the number of cases of a disease went up and down. What do the data suggest?",
      "The two do not appear to be linked", ["The weedkiller is the cause of the disease in the town", "The weedkiller protects people from getting the disease", "The disease causes people to use more of the weedkiller"],
      "If one variable rises steadily while the other goes up and down, the data do not show a link.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-INTERPRET-HEALTH-DATA-CLAIMS */
  T('HBI-INTERPRET-HEALTH-DATA-CLAIMS', 'Judge whether data support a claim and spot their limits', [
    M('correlation and cause', "A graph shows that people who drink more fizzy drinks have more tooth decay. Why does this not prove that fizzy drinks cause tooth decay?",
      "Other factors, such as tooth brushing, may also affect decay", ["The graph does not have a title, so it cannot be used", "Fizzy drinks contain no sugar at all, so they cannot harm teeth", "Tooth decay cannot be measured, so the data are made up"],
      "A correlation shows the two change together. It does not prove cause, because other factors may be involved."),
    M('correlation and cause', "Which statement about a correlation is correct?",
      "Two variables change together, but one may not cause the other", ["It proves that one of the variables causes the other one to change", "It means that the data contain an anomalous result somewhere", "It can only exist when both of the variables decrease together"],
      "Correlation is not proof of cause."),
    M('sample size', "A new diet was tested on six people, and five lost weight. Why is this weak evidence that the diet works for everyone?",
      "The sample is very small, so the result may not be reliable", ["Five out of six people is less than half of the group", "The people in the test may have weighed too much to start", "Weight loss cannot be measured accurately with any scales"],
      "Name the reason: a small sample. Saying 'it is not reliable' without a reason is not enough."),
    M('representative sample', "A study of heart disease only tested men aged 50 to 60. Why might the results not apply to everyone?",
      "Women and people of other ages were not tested", ["The sample of men is far too big to analyse properly", "Men of this age do not get heart disease at all", "Heart disease only affects young people, not older people"],
      "The sample does not represent the whole population, so the results may not apply to other groups."),
    M('control variables', "A study compares the lung function of smokers and non-smokers. Which other factor should be the same in both groups?",
      "Age", ["The number of cigarettes smoked", "Whether they smoke", "The result of the lung test"],
      "Age affects lung function, so it should be controlled or recorded. Smoking is the variable being studied."),
    M('anomalous results', "A student's results for pulse rate are 72, 74, 71, 98 and 73 beats per minute. Which is anomalous, and why?",
      "98, because it does not fit the pattern of the others", ["71, because it is the smallest value in the set of results", "72, because it is the first value that was recorded", "None of them, because pulse rates always vary a little"],
      "Name the anomalous value and say that it does not fit the pattern of the others."),
    M('healthy limits', "A table gives a patient's kidney filtration rate for five years. A healthy value is above 90. All five values are between 40 and 70. What can the data <b>not</b> show?",
      "When the kidney problem began", ["That the kidney filtration rate is below the healthy value", "That the patient has a kidney problem", "The values of the filtration rate"],
      "Every reading is already below the healthy limit, so the data cannot show when the problem started."),
    M('predictions', "Blood pressure readings went up and down over five years. Why is it uncertain to predict next year's value by extending the trend?",
      "The readings fluctuate, so next year could differ from the trend", ["A trend on a graph can never be extended past the last point", "Blood pressure cannot be measured accurately once each year", "A trend in blood pressure always reverses after five years"],
      "When values go up and down, a prediction from the trend is uncertain."),
    M('judging a claim', "A claim says: 'Exercise lowers resting heart rate.' Which answer judges the claim well?",
      "Supported: the rate fell from 78 to 66, but only 8 people were tested", ["Exercise is good for you, so the claim must be true for everyone", "The data show that resting heart rate changes when people train", "The claim is false, because heart rate goes up during exercise"],
      "Say what the data show, with a figure, then say what limits the evidence."),
    M('one reading', "Why is a single measurement of kidney filtration rate a weak estimate of how well the kidneys work?",
      "The rate varies, so one reading may not be typical", ["The kidneys only filter blood at night, not during the day", "Filtration rate is always the same, so a reading adds nothing", "A single reading is always too high to be used as evidence"],
      "Body measurements vary, so several readings give a better estimate."),
    S('limits of data', "Which of these are limits of a health study that should be mentioned when judging a claim?", ["Only a few people were tested", "Other lifestyle factors were not recorded", "The people were all one age group"], ["The graph used a ruler", "The units were given in the table"],
      "Small samples, uncontrolled factors and unrepresentative groups weaken the evidence."),
    M('discuss', "In a 'discuss' question about whether data support a claim, what must the answer reach?",
      "A judgement, using evidence for and against", ["A list of the points that agree with the claim only", "A description of a new trend that is not in the data", "A calculation of the mean of the data, with no comment"],
      "A 'discuss' answer weighs both sides and reaches a judgement.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-MATH-REFERENCE-RATIO-SCALING */
  T('HBI-MATH-REFERENCE-RATIO-SCALING', 'Scale per-unit or reference quantities and combine them', [
    F('floating-point error could round 6.15 down to 6.1; now uses exact arithmetic, and 2 s.f. answers keep trailing zeros', { skill: 'per 100 g', gen: function () {
      var p10 = rint(20, 120), per = p10 / 10, m = pick([30, 40, 45, 60, 75, 120, 150]), exact = p10 * m / 1000, ans = R.roundSf(exact, 2);
      return nq("A food label says the cereal contains " + per.toFixed(1) + " g of fibre per 100 g. Calculate the mass of fibre in a " + m + " g portion. Give your answer to 2 significant figures.", ans, 'g',
        "Fibre = " + per.toFixed(1) + " ÷ 100 × " + m + " = " + R.roundDp(exact, 4) + " g, which is " + ans + " g to 2 significant figures.", { tol: Math.pow(10, Math.floor(Math.log10(ans)) - 1) / 2 + 1e-9, display: ans.toPrecision(2) });
    } }),
    { skill: 'how many needed', gen: function () {
      var per = pick([2, 2.5, 4, 5, 8]), target = per * rint(3, 9) + pick([0, 1]), n = Math.ceil(target / per);
      return nq("One slice of bread contains " + per + " g of fibre. A person wants to eat at least " + target + " g of fibre from bread. What is the smallest whole number of slices they need?", n, 'slices',
        target + " ÷ " + per + " = " + R.roundDp(target / per, 2) + ". " + (target % per ? "Round up, because a whole number of slices is needed: " + n + "." : "Exactly " + n + " slices."));
    } },
    F('daily calcium need could come out at 3000+ mg; ranges made realistic', { skill: 'daily need from a share', gen: function () {
      var amt = rint(20, 30) * 10, pc = pick([20, 25, 40]), ans = amt * 100 / pc;
      return nq("A glass of milk contains " + amt + " mg of calcium. This is " + pc + "% of an adult's daily need. Calculate the daily need for calcium.", ans, 'mg',
        "Daily need = " + amt + " × 100 ÷ " + pc + " = " + commas(ans) + " mg.", { display: commas(ans) });
    } }),
    { skill: 'per 100 g of organ', gen: function () {
      var kg = pick([0.2, 0.3, 0.4, 0.5, 1.5]), per100 = rint(10, 60) * 10, total = R.roundDp(per100 * kg * 10, 0);
      return nq("An organ of mass " + kg + " kg receives " + commas(total) + " cm³ of blood per minute. Calculate the rate of blood flow per 100 g of the organ.", per100, 'cm³ per minute',
        kg + " kg = " + R.roundDp(kg * 1000, 0) + " g = " + R.roundDp(kg * 10, 1) + " portions of 100 g. " + commas(total) + " ÷ " + R.roundDp(kg * 10, 1) + " = " + per100 + " cm³ per minute.");
    } },
    F('protein contents of chicken and cooked rice made realistic', { skill: 'combine foods', gen: function () {
      var p1 = rint(20, 30), m1 = pick([50, 100, 150, 200]), p2 = rint(2, 4), m2 = pick([50, 100, 200, 250]), ans = R.roundDp(p1 * m1 / 100 + p2 * m2 / 100, 1);
      return nq("Chicken contains " + p1 + " g of protein per 100 g, and cooked rice contains " + p2 + " g of protein per 100 g. A meal has " + m1 + " g of chicken and " + m2 + " g of cooked rice. Calculate the total protein in the meal.", ans, 'g',
        "Chicken: " + p1 + " ÷ 100 × " + m1 + " = " + R.roundDp(p1 * m1 / 100, 1) + " g. Rice: " + p2 + " ÷ 100 × " + m2 + " = " + R.roundDp(p2 * m2 / 100, 1) + " g. Total = " + ans + " g.", { tol: 0.05, display: String(ans) });
    } }),
    { skill: 'energy from nutrients', gen: function () {
      var pr = rint(4, 20), li = rint(2, 15), ans = pr * 17 + li * 37;
      return nq("Protein releases 17 kJ per g and lipid releases 37 kJ per g. A snack contains " + pr + " g of protein and " + li + " g of lipid. Calculate the energy from protein and lipid in the snack.", ans, 'kJ',
        "(" + pr + " × 17) + (" + li + " × 37) = " + (pr * 17) + " + " + (li * 37) + " = " + ans + " kJ.");
    } },
    { skill: 'extra needed', gen: function () {
      var need = pick([40, 45, 50, 55]), meals = [rint(8, 18), rint(8, 18), rint(5, 12)], eaten = meals[0] + meals[1] + meals[2];
      return nq("The recommended daily protein for a teenager is " + need + " g. At breakfast, lunch and dinner they ate " + meals.join(' g, ') + " g of protein. How much more protein do they need to reach the recommended amount?", need - eaten, 'g',
        "Eaten = " + meals.join(' + ') + " = " + eaten + " g. Extra = " + need + " − " + eaten + " = " + (need - eaten) + " g.");
    } },
    { skill: 'units first', gen: function () {
      var mgPer100 = rint(20, 90) * 10, m = pick([25, 40, 50, 80]), ans = R.roundDp(mgPer100 / 100 * m / 1000, 2);
      return nq("A snack contains " + mgPer100 + " mg of sodium per 100 g. Calculate the mass of sodium in a " + m + " g bag, in grams. Give your answer to 2 decimal places.", ans, 'g',
        mgPer100 + " ÷ 100 × " + m + " = " + R.roundDp(mgPer100 / 100 * m, 1) + " mg. ÷ 1000 to change mg to g = " + ans.toFixed(2) + " g.", { tol: 0.005, display: ans.toFixed(2) });
    } },
    M('common errors', "A yoghurt has 4.0 g of protein per 100 g. A pot has a mass of 125 g. A student writes 500 g of protein. What went wrong?",
      "The student multiplied by 125 but did not divide by 100; the answer is 5.0 g", ["Nothing; 500 g is correct", "The student should have divided 125 by 4.0", "The student should have added 4.0 and 125"],
      "Amount = per-100 g value ÷ 100 × mass = 4.0 ÷ 100 × 125 = 5.0 g."),
    M('common errors', "A label gives 9 g of sugar per 100 g. A student says a 40 g portion has 9 g of sugar. What is the mistake?",
      "The per-100 g value has been used for a different mass; the portion has 3.6 g", ["There is no mistake", "The portion has 22.5 g of sugar", "The portion has 360 g of sugar"],
      "Scale to the portion: 9 ÷ 100 × 40 = 3.6 g."),
    M('units first', "A meal has 0.6 g of iron from one food and 4 mg from another. What is the total iron?",
      "604 mg", ["4.6 mg", "4.6 g", "10 mg"], "Change to the same units first: 0.6 g = 600 mg, so total = 600 + 4 = 604 mg."),
    M('how many needed', "Each tablet gives 400 mg of vitamin C. A person needs 1500 mg. How many whole tablets are needed to give at least 1500 mg?",
      "4", ["3", "3.75", "1100"], "1500 ÷ 400 = 3.75. A whole number is needed, so round up to 4.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-MATH-SUBSTITUTE-FORMULA */
  T('HBI-MATH-SUBSTITUTE-FORMULA', 'Substitute into a given equation, rearranging and converting units', [
    F('2 s.f. answer such as 0.020 now shown with its trailing zero', { skill: 'speed = distance ÷ time', gen: function () {
      var v = pick([40, 50, 60, 80, 100, 120]), d = pick([0.6, 0.8, 1.0, 1.2]), ans = R.roundSf(d / v, 2);
      return nq("A nerve impulse travels at " + v + " m/s along a neurone that is " + d.toFixed(1) + " m long. Use the equation time = distance ÷ speed to calculate the time taken. Give your answer in seconds to 2 significant figures.", ans, 's',
        "Time = " + d.toFixed(1) + " ÷ " + v + " = " + R.roundDp(d / v, 5) + " s, which is " + ans + " s to 2 significant figures.", { tol: Math.pow(10, Math.floor(Math.log10(ans)) - 1) / 2 + 1e-9, display: ans.toPrecision(2) });
    } }),
    F('context was too close to a past-paper sperm question; now mucus moved by cilia', { skill: 'change time units', gen: function () {
      var v = pick([0.1, 0.12, 0.15, 0.2]), d = pick([90, 100, 120]), s = d / v, ans = R.roundDp(s / 60, 0);
      return nq("Cilia move mucus up the airways at " + v + " mm/s. How long does it take to move mucus " + d + " mm? Give your answer in <b>minutes</b>, to the nearest whole number.", ans, 'minutes',
        "Time = " + d + " ÷ " + v + " = " + commas(R.roundDp(s, 1)) + " s. ÷ 60 = " + R.roundDp(s / 60, 2) + " minutes, so " + ans + " minutes.");
    } }),
    { skill: 'distance = speed × time', gen: function () {
      var v = rint(4, 9) / 10, t = rint(20, 90);
      return nq("Blood flows through an artery at " + v.toFixed(1) + " m/s. How far does it travel in " + t + " s?", R.roundDp(v * t, 1), 'm',
        "Distance = speed × time = " + v.toFixed(1) + " × " + t + " = " + R.roundDp(v * t, 1) + " m.", { tol: 0.05, display: String(R.roundDp(v * t, 1)) });
    } },
    { skill: 'cardiac output', gen: function () {
      var hr = rint(60, 90), sv = rint(60, 90), ans = R.roundDp(hr * sv / 1000, 2);
      return nq("Cardiac output = heart rate × stroke volume. A person's heart rate is " + hr + " beats per minute and their stroke volume is " + sv + " cm³. Calculate the cardiac output in dm³ per minute. Give your answer to 2 decimal places.", ans, 'dm³ per minute',
        hr + " × " + sv + " = " + commas(hr * sv) + " cm³ per minute. ÷ 1000 = " + ans.toFixed(2) + " dm³ per minute (1 dm³ = 1000 cm³).", { tol: 0.005, display: ans.toFixed(2) });
    } },
    { skill: 'rearrange', gen: function () {
      var hr = rint(60, 100), sv = rint(55, 95), co = hr * sv;
      return nq("Cardiac output = heart rate × stroke volume. A person's cardiac output is " + commas(co) + " cm³ per minute and their heart rate is " + hr + " beats per minute. Calculate the stroke volume.", sv, 'cm³',
        "Stroke volume = cardiac output ÷ heart rate = " + commas(co) + " ÷ " + hr + " = " + sv + " cm³.");
    } },
    { skill: 'energy from heating water', gen: function () {
      var m = pick([20, 25, 50, 100]), t1 = rint(18, 22), rise = rint(8, 35), ans = R.roundDp(m * 4.2 * rise, 1);
      return nq("A burning food sample heats " + m + " g of water from " + t1 + " °C to " + (t1 + rise) + " °C. Energy in J = mass of water in g × 4.2 × temperature rise in °C. Calculate the energy released.", ans, 'J',
        "Temperature rise = " + (t1 + rise) + " − " + t1 + " = " + rise + " °C. Energy = " + m + " × 4.2 × " + rise + " = " + commas(ans) + " J. Use the rise, not the final temperature.", { tol: 0.5, display: commas(ans) });
    } },
    { skill: 'square root formula', gen: function () {
      var d = pick([0.05, 0.08, 0.10, 0.12, 0.15, 0.20]), ans = R.roundDp(Math.sqrt(d / 5), 2);
      return nq("Reaction time in s = √(distance the ruler falls in m ÷ 5). A ruler falls " + (d * 100) + " cm before it is caught. Calculate the reaction time. Give your answer to 2 decimal places.", ans, 's',
        R.roundDp(d * 100, 0) + " cm = " + d + " m. " + d + " ÷ 5 = " + R.roundDp(d / 5, 3) + ". √" + R.roundDp(d / 5, 3) + " = " + ans.toFixed(2) + " s.", { tol: 0.005, display: ans.toFixed(2) });
    } },
    { skill: 'work = force × distance', gen: function () {
      var f = rint(20, 80) * 10, dcm = rint(20, 90), ans = R.roundDp(f * dcm / 100, 1);
      return nq("Energy (work) in J = force in N × distance moved in m. A leg muscle exerts a force of " + f + " N and moves the foot " + dcm + " cm. Calculate the energy used.", ans, 'J',
        dcm + " cm = " + (dcm / 100) + " m. Energy = " + f + " × " + (dcm / 100) + " = " + ans + " J.", { tol: 0.05, display: String(ans) });
    } },
    M('rearrange', "Which equation gives time if you know distance and speed?",
      "time = distance ÷ speed", ["time = distance × speed", "time = speed ÷ distance", "time = distance − speed"], "From speed = distance ÷ time, rearrange to time = distance ÷ speed."),
    M('change time units', "A student needs to change 5 minutes into seconds before substituting. What value should the student use?",
      "300 s", ["500 s", "50 s", "0.083 s"], "1 minute = 60 s, so 5 minutes = 5 × 60 = 300 s."),
    M('common errors', "Using reaction time = √(distance in m ÷ 5), a student gets 0.03 s for a ruler fall of 0.15 m. What went wrong?",
      "The student forgot the square root; √0.03 = 0.17 s", ["The student should have multiplied 0.15 by 5", "The distance should be in cm, giving 3 s", "Nothing; 0.03 s is correct"],
      "0.15 ÷ 5 = 0.03, then take the square root: 0.17 s."),
    M('alcohol chain', "A person drinks 4 glasses of wine, each with 2.5 units of alcohol. The body removes 1 unit per hour. The legal limit is 3 units. How many hours until the person is at the legal limit?",
      "7 hours", ["10 hours", "3 hours", "13 hours"], "Total = 4 × 2.5 = 10 units. Units above the limit = 10 − 3 = 7. At 1 unit per hour, this takes 7 hours.")
  ], { date: '2026-10-13', dropped: [] });
})();
