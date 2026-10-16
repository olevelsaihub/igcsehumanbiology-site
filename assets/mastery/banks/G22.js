/* Group G22 mastery bank: More homeostasis: skin, kidney and liver (Grade 8 block).
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
  // Skin: J epidermis, Q dermis, M fat layer, K sweat gland, L sebaceous gland, N blood vessel, P hair.
  var SKIN = (function () {
    var g = '<rect x="20" y="40" width="450" height="40" fill="#e9b98f"/><rect x="20" y="80" width="450" height="150" fill="#f7e1cf"/><rect x="20" y="230" width="450" height="90" fill="#fff1bf"/>', i;
    for (i = 0; i < 9; i++) g += '<circle cx="' + (45 + i * 50) + '" cy="' + (262 + (i % 2) * 28) + '" r="17" fill="none" stroke="#d8c27a" stroke-width="1.5"/>';
    g += '<line x1="20" y1="80" x2="470" y2="80" stroke="' + INK + '" stroke-width="1"/><line x1="20" y1="230" x2="470" y2="230" stroke="' + INK + '" stroke-width="1"/>';
    g += '<path d="M140 80 L146 190 Q155 205 164 190 L170 80" fill="#f2d3bd" stroke="' + INK + '" stroke-width="1.5"/><line x1="155" y1="192" x2="152" y2="4" stroke="#5a3a22" stroke-width="5" stroke-linecap="round"/>';
    g += '<ellipse cx="181" cy="128" rx="14" ry="11" fill="#f3e3a0" stroke="' + INK + '" stroke-width="1.5"/>';
    g += '<line x1="20" y1="215" x2="470" y2="215" stroke="#c0392b" stroke-width="5"/><path d="M235 215 C235 120 285 120 285 215" fill="none" stroke="#c0392b" stroke-width="3"/>';
    g += '<line x1="352" y1="40" x2="362" y2="190" stroke="' + BLUE + '" stroke-width="2.5"/><path d="M362 190 c-18 0 -18 18 0 18 c18 0 18 -18 0 -18 m0 6 c-10 0 -10 12 0 12 c12 0 12 -12 0 -12" fill="none" stroke="' + BLUE + '" stroke-width="2.5"/>';
    g += '<ellipse cx="425" cy="120" rx="9" ry="14" fill="#e0d0f0" stroke="' + INK + '" stroke-width="1.2"/><path d="M425 134 C425 170 440 190 440 228" fill="none" stroke="#9b59b6" stroke-width="2"/>';
    g += lab(440, 60, 480, 30, 'J') + lab(445, 160, 480, 160, 'Q') + lab(300, 285, 480, 300, 'M') + lab(372, 199, 480, 235, 'K') + lab(178, 131, 60, 120, 'L', 'end') + lab(90, 215, 50, 190, 'N', 'end') + lab(153, 20, 90, 15, 'P', 'end');
    return '<svg class="mc-svg" viewBox="0 0 520 330" role="img" aria-label="Section through human skin with seven parts labelled J to Q, not to scale">' + g + '</svg>';
  })();

  /* ====================================================================== HBI-SKIN-STRUCTURE-FUNCTION-RECALL */
  T('HBI-SKIN-STRUCTURE-FUNCTION-RECALL', 'Identify skin structures and state what each does', [
    M('label', "The diagram shows a section through the skin. Which letter labels the fat (adipose) layer?", "M", ["J", "K", "Q"],
      "M is the deepest layer, under the dermis.", { svg: SKIN, family: 'g22-skin' }),
    M('label', "Using the same diagram, what is L?", "Sebaceous gland", ["Sweat gland", "Hair follicle", "Blood vessel"],
      "L is the small gland beside the hair follicle.", { svg: SKIN, family: 'g22-skin' }),
    M('label', "Using the same diagram, which letter labels a sweat gland?", "K", ["L", "N", "P"],
      "K is the coiled gland deep in the dermis, with a duct to the surface.", { svg: SKIN, family: 'g22-skin' }),
    M('label', "Using the same diagram, what is J?", "Epidermis", ["Dermis", "Fat layer", "Sweat gland"],
      "J is the outer layer.", { svg: SKIN, family: 'g22-skin' }),
    M('burns', "Using the same diagram, a first degree burn damages only one layer. Which letter labels that layer?", "J", ["M", "Q"],
      "A first degree burn damages only the epidermis.", { svg: SKIN, family: 'g22-skin' }),
    M('burns', "A third degree burn reaches the deepest layer of the skin. Which layer is this?",
      "The fat layer", ["The epidermis", "The dermis only", "The hair"], "Second degree reaches the dermis; third degree also reaches the fat layer."),
    M('fat layer', "What does the fat layer under the skin do?",
      "It insulates the body and reduces heat loss", ["It makes sweat to cool the body down on hot days", "It produces melanin", "It senses touch"],
      "Say 'insulates' or 'reduces heat loss', not 'keeps you warm'."),
    M('melanin', "How does melanin protect the skin?",
      "It absorbs ultraviolet light, lowering the risk of skin cancer", ["It reflects all sunlight so that the skin stays cool in hot weather", "It kills bacteria", "It makes sweat"],
      "Mention ultraviolet (UV) light: melanin absorbs it before it can damage cells deeper in the skin."),
    M('infection', "Why can a burn or cut lead to infection?",
      "Pathogens can get through the broken skin into the body and blood", ["The burn makes the skin produce bacteria in the dermis", "The skin stops sweating", "The fat layer melts"],
      "Unbroken skin is a barrier to pathogens."),
    S('dermis', "Which of these are found in the dermis?", ["Sweat glands", "Hair follicles", "Blood vessels", "Sense receptors"], ["The fat (adipose) layer", "Bone"],
      "Sebaceous glands are also in the dermis."),
    M('senses', "Which can the skin sense?",
      "Touch, pain and temperature", ["Light, sound and smell", "Blood glucose level", "Oxygen level"], "Sense receptors are in the dermis."),
    M('excretion', "What does the skin excrete in sweat?",
      "Some water and salts", ["Carbon dioxide and oxygen", "Urea only, and no water", "Glucose and amino acids"], "Sweat also helps cool the body."),
    M('common errors', "A student writes: 'Fat keeps the body warm.' What should they write?",
      "Fat insulates and reduces heat loss", ["Fat makes heat by burning all the time", "Fat makes sweat", "Fat absorbs UV light"],
      "Fat does not make heat; it reduces heat loss."),
    M('common errors', "A student mixes up sweat glands and sebaceous glands. Which is correct?",
      "Sweat glands make sweat; sebaceous glands make oily sebum", ["Sebaceous glands make sweat; sweat glands make oily sebum", "Both make sweat", "Both make melanin"],
      "Sebum keeps hair and skin supple.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-TRANSPLANT-VS-DIALYSIS */
  T('HBI-TRANSPLANT-VS-DIALYSIS', 'Evaluate kidney transplants and dialysis as treatments', [
    M('transplant advantage', "Which is an advantage of a kidney transplant over dialysis?",
      "It is a long-term solution, with no dialysis sessions", ["There is no risk of rejection, so no drugs are ever needed", "It is available to every patient at once", "It needs no operation"],
      "After one operation the person can live a normal life."),
    M('transplant problem', "Which is a problem with kidney transplants?",
      "There are not enough donors", ["The patient must visit hospital several times a week for treatment", "It is only a temporary solution", "It needs a strict diet for life"],
      "The other options describe dialysis."),
    M('rejection', "Why must a transplant patient take immunosuppressant drugs?",
      "To stop the immune system rejecting the new kidney", ["To kill any bacteria in the donated kidney before it is used", "To make the kidney grow", "To replace dialysis"],
      "The donor kidney has different antigens."),
    M('immunosuppressant', "What is a disadvantage of immunosuppressant drugs?",
      "The patient is more likely to get infections", ["The kidney stops working straight away", "The patient needs dialysis as well", "They raise blood glucose"],
      "They lower the patient's immunity."),
    M('dialysis advantage', "Which is an advantage of dialysis?",
      "It is available to all patients and needs no immunosuppressant drugs", ["It cures kidney failure completely after only a few weekly sessions in hospital", "It needs no hospital visits", "It allows any diet"],
      "But it is only a temporary solution."),
    M('dialysis problem', "Which is a problem with dialysis?",
      "Several long hospital sessions every week", ["Rejection of the new kidney by the immune system", "Shortage of donors", "Immunosuppressant drugs for life"],
      "Rejection and donors are transplant problems."),
    M('diet', "Why does a dialysis patient need a strict diet?",
      "Waste and salts build up in the blood between sessions", ["The machine cannot work if the patient eats any protein at all", "Dialysis uses up all their vitamins", "The patient has no stomach"],
      "Between sessions, nothing removes waste from the blood."),
    M('cost', "Which treatment usually costs more over many years?",
      "Dialysis", ["A transplant", "They cost the same", "Neither costs anything"], "Say which treatment and why: dialysis needs sessions for years."),
    M('kidney donors', "Why are kidneys donated more often than hearts?",
      "People have two kidneys and can live with one, so living people can donate", ["Kidneys are smaller, so they are easier to post to other hospitals", "Hearts cannot be transplanted", "Kidneys never get rejected"],
      "Also, one dead donor can give kidneys to two patients."),
    M('two patients', "How can one dead donor help two kidney patients?",
      "Each of their two kidneys can go to a different patient", ["One kidney can be cut in half, and each half is given to a different person", "Their blood can be used for dialysis", "Their liver can do the job of a kidney"],
      "A person has two kidneys."),
    M('life', "How can a transplant improve a patient's life?",
      "Longer life expectancy and better quality of life", ["The patient never needs any more medical checks or drugs", "It changes the blood group", "It stops ageing"],
      "But the drugs must be taken for life."),
    M('common errors', "A student writes: 'Dialysis cures kidney failure.' What is correct?",
      "Dialysis is only a temporary treatment", ["Dialysis cures it after one session", "Dialysis makes the kidneys grow back", "Dialysis is a kind of transplant"],
      "The kidneys still do not work."),
    M('common errors', "A student lists 'rejection' as a problem with dialysis. What is correct?",
      "Rejection is a problem with transplants, not dialysis", ["Rejection happens in both treatments equally", "Rejection only happens in dialysis", "Rejection means the machine breaks"],
      "There is no foreign organ in dialysis."),
    M('common errors', "In a 'discuss' question about transplants, a student gives only advantages. What is missing?",
      "The disadvantages, such as rejection or donor shortage", ["More advantages, written in longer and more detailed sentences", "The name of a hospital", "The cost of the operation in dollars"],
      "A discussion needs both sides.")
  ], { date: '2026-10-13', dropped: [] });
})();
