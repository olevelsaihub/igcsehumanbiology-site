/* Block mastery check page: reads ?block=ID, loads that block's question banks and runs the check. */
(function () {
  'use strict';
  var BLOCKS = window.MASTERY_BLOCKS || {}, VERSION = window.MASTERY_VERSION || '', BASE = window.MASTERY_BASE || '/igcsehumanbiology/';
  var root = document.getElementById('bm-check');
  var id = new URLSearchParams(location.search).get('block'), b = BLOCKS[id];
  if (!b) {
    root.innerHTML = '<p>This block check could not be found. <a href="' + BASE + 'mastery/">See all block mastery checks</a>.</p>';
    return;
  }
  var k = window.Mastery.perType(b.types.length), total = k * b.types.length;
  document.title = 'Block mastery check · ' + b.title;
  var h1 = document.getElementById('bm-title') || document.querySelector('main h1');
  if (h1) h1.textContent = 'Block mastery check: ' + b.title;
  var crumb = document.getElementById('bm-crumb');
  if (crumb) crumb.textContent = b.title;
  document.getElementById('bm-meta').textContent = b.label + ' · ' + b.types.length + (b.types.length === 1 ? ' type' : ' types') + ' · ' +
    total + ' questions (' + (b.types.length === 1 ? 'all from this type' : k + ' from each type') + '), a new set every attempt';
  var back = document.getElementById('bm-back');
  // Return to the plan page the student came from (e.g. the Master Plan), else the block's own plan.
  var ref = '';
  try { var r = new URL(document.referrer); if (r.origin === location.origin && r.pathname.indexOf(BASE + 'plans/') === 0) ref = r.pathname; } catch (e) { /* no referrer */ }
  back.href = (ref || b.planUrl) + '#' + encodeURIComponent(id);
  back.textContent = ref && ref !== b.planUrl ? '← Back to the plan' : '← Back to ' + b.planLabel;
  var files = {};
  b.types.forEach(function (t) { files[t.file] = 1; });
  var list = Object.keys(files), left = list.length;
  root.innerHTML = '<p>Loading questions…</p>';
  list.forEach(function (f) {
    var s = document.createElement('script');
    s.src = BASE + 'assets/mastery/banks/' + f + '?v=' + VERSION;
    s.onload = s.onerror = function () { if (--left === 0) window.Mastery.mountBlock(root, { key: id, title: b.title, types: b.types }); };
    document.head.appendChild(s);
  });
})();
