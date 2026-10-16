/* Group G09 mastery bank: Bones, muscles and joints (A-Grade Block 9).
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
  // Long bone cut lengthways: F cartilage, G spongy bone, H compact bone, K marrow cavity.
  var BONE = (function () {
    var g = '', x, y;
    function end(cy, s) {
      var o = '<ellipse cx="180" cy="' + (cy - s * 8) + '" rx="70" ry="52" fill="#cfe6f2" stroke="' + INK + '" stroke-width="1.5"/>' +
        '<ellipse cx="180" cy="' + cy + '" rx="68" ry="50" fill="#f3e3c3" stroke="#b38a4a" stroke-width="5"/>';
      for (x = 122; x <= 238; x += 13) for (y = cy - 44; y <= cy + 44; y += 12) {
        var dx = (x - 180) / 60, dy = (y - cy) / 42; if (dx * dx + dy * dy < 1) o += '<circle cx="' + x + '" cy="' + y + '" r="3.6" fill="#fff" stroke="#b38a4a" stroke-width="0.8"/>';
      }
      return o;
    }
    g += '<rect x="140" y="110" width="80" height="210" fill="#e3c991" stroke="#b38a4a" stroke-width="1.5"/><rect x="162" y="120" width="36" height="190" fill="#f7efd2"/>';
    g += end(88, 1) + end(342, -1);
    g += lab(180, 33, 290, 22, 'F') + lab(205, 98, 290, 98, 'G') + lab(212, 215, 290, 215, 'H') + lab(180, 240, 70, 240, 'K', 'end');
    return '<svg class="mc-svg mc-svg-small" viewBox="0 0 340 420" role="img" aria-label="Long bone cut lengthways, with four parts labelled F, G, H and K">' + g + '</svg>';
  })();

  /* ====================================================================== HBI-SKELETON-BONE-IDENTIFY */
  T('HBI-SKELETON-BONE-IDENTIFY', 'Identify bones and bone tissues on a diagram', [
    M('long bone', "The diagram shows a long bone cut lengthways. Which letter labels spongy bone?", "G", ["F", "H", "K"],
      "G is the honeycomb-like tissue inside the wide end of the bone.", { svg: BONE, family: 'g09-bone' }),
    M('long bone', "Using the same diagram, which letter labels compact bone?", "H", ["F", "G", "K"],
      "H is the hard, dense tissue that forms the wall of the shaft.", { svg: BONE, family: 'g09-bone' }),
    M('long bone', "Using the same diagram, what is the tissue labelled F?", "Cartilage", ["Spongy bone", "Compact bone", "Ligament"],
      "F is the smooth layer covering the end of the bone: cartilage.", { svg: BONE, family: 'g09-bone' }),
    M('arm bones', "Which bone is the single bone of the upper arm?",
      "Humerus", ["Femur", "Radius", "Ulna"], "The humerus is the upper arm bone. The femur is the thigh bone."),
    M('arm bones', "The forearm has two bones. Which one is on the thumb side?",
      "Radius", ["Ulna", "Humerus", "Fibula"], "Radius on the thumb side; ulna on the little-finger side."),
    M('leg bones', "Which bone is the kneecap?",
      "Patella", ["Tibia", "Fibula", "Femur"], "The patella sits in front of the knee joint."),
    M('leg bones', "Which bone is the thin bone beside the tibia in the lower leg?",
      "Fibula", ["Femur", "Patella", "Ulna"], "The tibia is the large shin bone; the fibula is the thin one beside it."),
    M('leg bones', "Which bone is the thigh bone?",
      "Femur", ["Humerus", "Tibia", "Fibula"], "The femur is the long bone of the thigh."),
    M('shoulder', "Which bone is the shoulder blade?",
      "Scapula", ["Clavicle", "Sternum", "Pelvis"], "The scapula is the shoulder blade; the clavicle is the collarbone."),
    M('hand', "What are the finger bones called?",
      "Phalanges", ["Vertebrae", "Ulnae", "Patellae"], "The finger (and toe) bones are the phalanges."),
    M('long bone', "Which description fits a long bone?",
      "A long shaft with two wider ends; compact bone outside and spongy bone inside the ends", ["A flat plate of spongy bone with no compact bone and no shaft at all", "A short round bone made only of cartilage, with no hard tissue", "A long shaft made of spongy bone, with compact bone filling the ends"],
      "Compact bone forms the shaft wall; spongy bone fills the ends."),
    M('common errors', "A student labels the collarbone as 'scapula'. What is the correct name?",
      "Clavicle", ["Sternum", "Humerus", "Pelvis"], "The collarbone is the clavicle; the scapula is the shoulder blade.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-JOINT-TYPE-MOVEMENT */
  T('HBI-JOINT-TYPE-MOVEMENT', 'Name joint types and compare their movement', [
    M('definition', "What is a joint?",
      "A place where two or more bones meet", ["A place where a muscle is attached to a bone", "A place where a tendon joins two muscles", "A place where cartilage is made"],
      "A joint is where bones meet."),
    M('hinge', "Which type of joint is found at both the elbow and the knee?",
      "Hinge joint", ["Ball and socket joint", "Gliding joint", "Cartilaginous joint"], "The elbow and knee move in one plane, like a door hinge."),
    M('ball and socket', "Which type of joint is found at both the shoulder and the hip?",
      "Ball and socket joint", ["Hinge joint", "Gliding joint", "Cartilaginous joint"], "A rounded head sits in a cup, so the joint can move in all directions."),
    M('movement', "Which statement compares the movement at the shoulder and the elbow correctly?",
      "The shoulder moves in all three planes and can rotate; the elbow moves in one plane only", ["The elbow moves in all three planes and can rotate; the shoulder moves in one plane only", "Both joints move in one plane only, backwards and forwards like a door", "Both joints can rotate fully, but the elbow moves further than the shoulder"],
      "A comparison must describe both joints."),
    M('gliding', "Where are gliding joints found?",
      "Between the small bones of the wrist and ankle", ["Between the humerus and the scapula", "Between the femur and the tibia", "Between the bones of the skull"],
      "Gliding joints let small bones slide over each other."),
    M('vertebrae', "What type of joint is found between the vertebrae, and how much movement does it allow?",
      "A cartilaginous joint that allows only a little movement", ["A hinge joint that allows movement in one plane only", "A ball and socket joint that allows rotation", "A synovial joint that allows no movement at all"],
      "Discs of cartilage between vertebrae allow a little movement."),
    M('synovial', "Which of these joint types are synovial joints?",
      "Hinge, ball and socket, and gliding joints", ["Only ball and socket joints", "Only the joints between vertebrae", "Only the joints in the skull"], "All three are synovial joints."),
    M('shoulder parts', "At the shoulder, which bones form the ball and the socket?",
      "Head of the humerus (ball) in a cup on the scapula (socket)", ["Head of the femur (ball) in a cup on the pelvis (socket)", "Head of the radius (ball) in a cup on the ulna (socket)", "Head of the clavicle (ball) in a cup on the sternum (socket)"],
      "The femur and pelvis form the hip, not the shoulder."),
    M('fingers', "Which type of joint is found between the finger bones?",
      "Hinge joint", ["Ball and socket joint", "Gliding joint", "Cartilaginous joint"], "Finger joints bend in one plane only."),
    M('rotation', "Which joint can rotate?",
      "The hip", ["The knee", "The elbow", "A finger joint"], "Ball and socket joints, such as the hip, can rotate; hinge joints cannot."),
    M('common errors', "A question asks for the TYPE of joint at the elbow. A student writes 'elbow'. What should the answer be?",
      "Hinge joint", ["Shoulder joint", "Knee joint", "Arm joint"], "Name the type, not the place."),
    M('common errors', "A student says a hinge joint can rotate. What is correct?",
      "A hinge joint moves in one plane only", ["A hinge joint moves in all three planes", "A hinge joint cannot move at all", "A hinge joint only slides sideways"], "Rotation needs a ball and socket joint.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-SKELETAL-PART-FUNCTION */
  T('HBI-SKELETAL-PART-FUNCTION', 'State the function of a skeletal or joint part and explain effects of damage', [
    M('ligaments', "What do ligaments do?",
      "They join bone to bone and hold a joint together", ["They join muscle to bone and pass on the pull of the muscle", "They cover the ends of bones to reduce friction", "They make red blood cells inside the bone"],
      "Ligaments hold the bones of a joint together."),
    M('tendons', "What do tendons do?",
      "They join muscle to bone and do not stretch, so the pull reaches the bone", ["They join bone to bone and stretch, so that the joint can bend much further", "They lubricate the joint, so it moves with less friction", "They absorb shocks between the vertebrae when walking"],
      "Tendons are inelastic, so all of the pull of the muscle moves the bone."),
    M('cartilage', "How does cartilage help a joint?",
      "It reduces friction and absorbs shock, so movement is smooth", ["It holds the bones together, so the joint does not come apart", "It contracts to pull the bones, so the joint can bend", "It makes synovial fluid, which holds the bones together"],
      "Cartilage on the bone ends is smooth and slightly springy."),
    M('synovial fluid', "What does synovial fluid do?",
      "It lubricates the joint, so it moves easily with little friction", ["It holds the bones together, so that they cannot slide apart from each other", "It carries red blood cells from the bone marrow", "It joins the muscle to the bone at each end"],
      "Synovial fluid is a lubricant."),
    M('bone tissues', "Where are red blood cells made in a long bone?",
      "In the red marrow in spongy bone", ["In the compact bone of the shaft", "In the cartilage at the bone ends", "In the synovial fluid of the joint"], "Spongy bone contains red marrow."),
    M('bone tissues', "What is the main job of compact bone?",
      "To give the bone strength", ["To make red blood cells", "To lubricate the joint", "To join muscle to bone"], "Compact bone is hard and dense, so it is strong."),
    M('axial skeleton', "Which parts make up the axial skeleton?",
      "Skull, vertebral column and ribcage", ["Scapula, clavicle, pelvis and the limb bones", "Arms and legs only", "Femur, tibia and fibula"], "The axial skeleton is the central part; the limbs and girdles are appendicular."),
    M('protection', "Which organ does the vertebral column protect?",
      "The spinal cord", ["The heart", "The brain", "The stomach"], "The skull protects the brain; the ribcage protects the heart and lungs; the vertebral column protects the spinal cord."),
    M('cartilage damage', "What happens if the cartilage in a joint is worn away?",
      "The bones rub together, so movement is painful, stiff and not smooth", ["The bones join together, so the joint can no longer move at all", "The joint fills with blood, so the bones cannot touch", "The ligaments get longer, so the joint becomes more flexible"],
      "Without cartilage there is more friction between the bone ends."),
    M('full working joint', "Apart from cartilage, what else does a joint need in order to bend and straighten?",
      "Ligaments to hold the bones and a second muscle to straighten the joint", ["A third bone to push the joint straight again after it bends", "Extra synovial fluid to push the bones apart after bending", "A tendon joining the two bones together in the middle"],
      "One muscle bends the joint; another straightens it."),
    M('scurvy', "Lack of vitamin C (scurvy) affects collagen. How does this affect joints?",
      "Cartilage and joint tissues are weakened, so joints are painful and stiff", ["Bones become harder and denser, so the joints are able to move more easily", "Synovial fluid turns solid, so joints lock", "Muscles grow larger, so joints are pulled apart"],
      "Collagen is needed for cartilage and other joint tissues."),
    M('common errors', "A student writes: 'Ligaments join muscle to bone.' What is correct?",
      "Ligaments join bone to bone; tendons join muscle to bone", ["Ligaments join muscle to muscle; tendons join bone to bone", "Ligaments join cartilage to bone; tendons join fat to bone", "Ligaments and tendons both join bone to bone"], "Learn the pair: ligament bone–bone, tendon muscle–bone.")
  ], { date: '2026-10-13', dropped: [] });

  /* ====================================================================== HBI-ANTAGONISTIC-MUSCLE-MOVEMENT */
  T('HBI-ANTAGONISTIC-MUSCLE-MOVEMENT', 'Explain how biceps, triceps and tendons move the arm', [
    M('raise forearm', "What happens when the forearm is raised (the elbow bends)?",
      "The biceps contracts and the triceps relaxes", ["The triceps contracts and the biceps relaxes", "Both muscles contract at the same time", "Both muscles relax at the same time"], "The biceps pulls the forearm up."),
    M('lower forearm', "What happens when the forearm is lowered (the arm straightens)?",
      "The triceps contracts and the biceps relaxes", ["The biceps contracts and the triceps relaxes", "The triceps pushes the forearm down", "Both muscles contract at the same time"], "The triceps pulls to straighten the arm. Muscles cannot push."),
    M('pull only', "Why are muscles found in antagonistic pairs?",
      "Muscles can only pull, so a second muscle is needed to move the bone back", ["Muscles can only push, so a second muscle is needed to pull the bone back", "Each muscle can only contract once, so a spare is needed", "Two muscles are needed to make the tendon stretch"],
      "One muscle pulls one way; its partner pulls the other way."),
    M('shape change', "How does the biceps change shape when it contracts?",
      "It gets shorter and fatter", ["It gets longer and thinner", "It gets longer and fatter", "It does not change shape"], "A contracting muscle shortens and bulges."),
    M('tendons', "Why is it important that tendons are inelastic?",
      "So the whole pull of the muscle reaches the bone", ["So the muscle can stretch further when it relaxes", "So the joint can bend in every direction", "So the bones are held together at the joint"],
      "If tendons stretched, some of the pull would be lost."),
    M('which bone', "When the biceps raises the forearm, which bone does it pull on?",
      "The radius", ["The humerus", "The scapula", "The femur"], "The biceps is attached to the radius in the forearm; the forearm turns at the elbow."),
    M('pivot', "When the biceps contracts, where does the forearm turn?",
      "At the elbow, a hinge joint", ["At the shoulder, a hinge joint", "At the wrist, a ball and socket joint", "At the elbow, a ball and socket joint"], "The elbow is the hinge where the forearm turns."),
    M('antagonistic', "What does 'antagonistic pair' mean?",
      "Two muscles that work in opposite directions: when one contracts, the other relaxes", ["Two muscles that always contract together to make a stronger pull", "Two bones that meet at a joint and move in opposite directions", "Two tendons that join a single muscle to two different bones"],
      "The biceps and triceps are the classic example."),
    M('passage', "Complete the sentence: 'To straighten the arm, the ______ contracts and pulls on the ulna.'",
      "triceps", ["biceps", "humerus", "tendon"], "The triceps is at the back of the upper arm and straightens the elbow."),
    M('relaxed muscle', "When the biceps contracts, what happens to the relaxed triceps?",
      "It is stretched as the forearm moves up", ["It pushes the forearm upwards", "It contracts to help the biceps", "It becomes shorter and fatter"], "The relaxed muscle is pulled longer by the movement."),
    F("replaced a distractor that could be argued (the forearm can fall under gravity)", M('common errors', "A student writes: 'The triceps pushes the arm down.' What is correct?",
      "The triceps contracts and pulls the forearm straight", ["The biceps pushes the forearm down instead", "The triceps gets longer and pushes on the ulna", "The tendon pushes the arm down"], "Muscles can only pull. The triceps pulls on the ulna to straighten the arm.")),
    M('common errors', "A student says the biceps pulls on the humerus to raise the forearm. What is correct?",
      "It pulls on the radius in the forearm", ["It pulls on the scapula in the shoulder", "It pulls on the ulna in the upper arm", "It pulls on the humerus, which is correct"], "The humerus is the upper arm bone; the biceps moves the forearm.")
  ], { date: '2026-10-13', dropped: [] });
})();
