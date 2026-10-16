/* Student progress for teachers: reports where the student is (plan, block, type, page), a heartbeat while the
   page is open, and each block mastery result with every question. Loaded on every page by course.js.
   Staff also get a "Student progress" link. Nothing here changes what students see. */
(function () {
  'use strict';
  if (window.olvProgress) return;
  window.olvProgress = true;
  var API = '/igcsehumanbiology/teach-me/api.php?action=progress-';
  var BEAT = 60000, csrf = null, staff = false, sentDevice = false, lastKey = '', started = Date.now();

  function session() {
    if (csrf) return Promise.resolve(csrf);
    return fetch(API + 'session', { credentials: 'same-origin' }).then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { if (!j || !j.csrf) throw new Error('no session'); csrf = j.csrf; staff = !!j.staff; return csrf; });
  }
  function post(action, body) {
    return session().then(function (token) {
      return fetch(API + action, { method: 'POST', credentials: 'same-origin', keepalive: true,
        headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': token }, body: JSON.stringify(body) });
    }).catch(function () { /* tracking must never interrupt learning */ });
  }
  function text(el) { return el ? el.textContent.replace(/\s+/g, ' ').trim().slice(0, 150) : ''; }

  // Works out the student's place from the page itself, including a lesson opened inside a plan.
  function place() {
    var p = location.pathname, out = { path: p + location.search, title: document.title.replace(/\s*[·|].*$/, '').slice(0, 150), kind: 'page' };
    var plan = /\/igcse\/human-biology\/plans\/([^/]+)\//.exec(p);
    if (/\/igcse\/human-biology\/(index\.html)?$/.test(p)) out.kind = 'home';
    if (plan) { out.kind = 'plan'; out.plan = plan[1]; out.planTitle = text(document.querySelector('h1')); }
    var lesson = document.querySelector('[data-workspace-panel] [data-type-lesson]') || (/\/types\//.test(p) && document.querySelector('[data-type-lesson]'));
    if (lesson) {
      out.kind = 'type'; out.type = lesson.getAttribute('data-type-lesson');
      out.typeTitle = text(lesson.querySelector('.kc-head h2')) || text(document.querySelector('h1'));
      var ws = lesson.closest('[data-block-workspace]');
      if (ws) { out.block = ws.getAttribute('data-block-workspace'); out.blockTitle = text(document.querySelector('[data-block-card="' + out.block + '"] h3, [data-block-card="' + out.block + '"] h2')); }
    }
    if (/\/igcse\/human-biology\/mastery\/block\.html/.test(p)) {
      out.kind = 'mastery-block'; out.block = new URLSearchParams(location.search).get('block') || '';
      out.blockTitle = text(document.getElementById('bm-crumb'));
    } else if (/\/igcse\/human-biology\/mastery\/?$/.test(p)) out.kind = 'mastery';
    else if (/\/igcse\/human-biology\/mark-schemes\//.test(p)) out.kind = 'staff';
    else if (/\/stories\//.test(p)) { out.kind = 'story'; var st = /\/stories\/types\/(hbi-[a-z0-9-]+)/.exec(p); if (st) out.type = st[1].toUpperCase(); }
    else if (/\/video-library\//.test(p)) {
      out.kind = 'video'; var vd = /\/video-library\/(english|urdu)\/(hbi-[a-z0-9-]+)/.exec(p);
      if (vd) { out.type = vd[2].toUpperCase(); out.title = (vd[1] === 'urdu' ? 'Urdu' : 'English') + ' video lesson'; }
    }
    else if (/\/teach-me\//.test(p)) out.kind = 'video';
    else if (/\/labs\//.test(p) || /\/labs\.html$/.test(p)) out.kind = 'lab';
    else if (/\/poems\//.test(p)) out.kind = 'poem';
    else if (/\/questions\/|\/papers\/|papers\.html$/.test(p)) { out.kind = 'paper'; out.title = text(document.querySelector('h1')) || out.title; }
    else if (/practice|question-bank|papers/.test(p)) out.kind = out.kind === 'page' ? 'practice' : out.kind;
    return out;
  }
  // Best block scores already saved in this browser, so earlier checks also reach the teacher (sent once).
  function device() {
    if (sentDevice) return undefined;
    sentDevice = true;
    try {
      var s = JSON.parse(localStorage.getItem('olv-ph-mastery-v1')) || {}, out = {}, n = 0;
      Object.keys(s).forEach(function (k) { if (k.indexOf('block:') === 0 && n < 150) { out[k.slice(6)] = { best: s[k].best, n: (s[k].attempts || []).length }; n++; } });
      return n ? out : undefined;
    } catch (e) { return undefined; }
  }
  function ping(force) {
    if (!force && document.visibilityState === 'hidden') return;
    var pl = place(), key = pl.path + '|' + (pl.type || '');
    if (!force && key === lastKey) pl.beat = true;
    lastKey = key;
    var d = device(); if (d) pl.device = d;
    post('ping', pl);
  }

  // Teachers and admins get "Students' Progress" in the main menu bar, after the other main sections.
  function staffLink() {
    if (!staff || document.querySelector('[data-staff-progress-link]')) return;
    var nav = document.querySelector('.course-nav');
    if (!nav) return;
    var a = document.createElement('a');
    a.className = 'nav-primary'; a.href = '/igcsehumanbiology/mark-schemes/student-progress.html';
    a.textContent = 'Students\u2019 Progress'; a.setAttribute('data-staff-progress-link', '');
    if (/\/mark-schemes\/student-progress\.html$/.test(location.pathname)) a.setAttribute('aria-current', 'page');
    var primaries = nav.querySelectorAll(':scope > .nav-primary, :scope > .nav-home');
    var after = primaries[primaries.length - 1];
    if (after) after.insertAdjacentElement('afterend', a); else nav.appendChild(a);
  }

  window.addEventListener('mastery:result', function (ev) {
    var d = ev.detail || {};
    d.seconds = Math.round((Date.now() - started) / 1000);
    post('mastery', d);
  });
  // A lesson opened inside a plan counts as a new place.
  document.addEventListener('human-biology:content-ready', function () { setTimeout(function () { ping(true); }, 300); });
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') ping(false); });
  setInterval(function () { ping(false); }, BEAT);

  function start() { session().then(staffLink, function () {}); ping(true); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
