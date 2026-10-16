/* Staff dashboard: every student who has opened Human Biology, where they are now, block mastery and checked answers.
   Refreshes itself every 15 seconds. Names and answers are written with textContent only. */
(function () {
  'use strict';
  var API = '/igcsehumanbiology/teach-me/api.php?action=progress-';
  var REFRESH = 15000;
  var root = document.getElementById('sp-app');
  if (!root) return;
  var BLOCKS = window.MASTERY_BLOCKS || {}, TYPES = {}, PLANS = [];
  Object.keys(BLOCKS).forEach(function (id) {
    var b = BLOCKS[id];
    b.types.forEach(function (t) { TYPES[t.id] = t.title; });
    var plan = PLANS.filter(function (p) { return p.label === b.planLabel; })[0];
    if (!plan) PLANS.push(plan = { label: b.planLabel, url: b.planUrl, blocks: [] });
    plan.blocks.push(id);
  });
  var state = { who: 'students', data: null, open: null, detail: null, q: '', cls: '', plan: '', sort: 'recent', updated: 0, error: '' };

  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function n(x, word) { return x + ' ' + word + (x === 1 ? '' : 's'); }
  function ago(t, now) {
    var s = Math.max(0, (now || Date.now() / 1000) - t);
    if (s < 60) return 'just now'; if (s < 3600) return Math.floor(s / 60) + ' min ago';
    if (s < 86400) return Math.floor(s / 3600) + ' h ago'; if (s < 172800) return 'yesterday';
    return Math.floor(s / 86400) + ' days ago';
  }
  function when(t) { return new Date(t * 1000).toLocaleString([], { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }); }
  function band(p) { return p === 100 ? 'mastered' : p >= 90 ? 'ready' : p >= 80 ? 'nearly' : 'not-yet'; }
  var BAND = { mastered: 'Mastered', ready: 'Ready', nearly: 'Come back', 'not-yet': 'Not yet' };
  var KIND = { home: 'Home', plan: 'Plan page', type: 'Type lesson', mastery: 'Mastery hub', 'mastery-block': 'Mastery check', practice: 'Practice', story: 'Story', video: 'Video lesson', lab: 'Lab', poem: 'Study poem', paper: 'Past paper', staff: 'Staff page', page: 'Page' };
  function classText(p) {
    if (!p.classes || !p.classes.length) return p.checksOnly ? 'Class shows after their next page visit' : 'No class listed';
    return p.classes.slice(0, 2).join(', ') + (p.classes.length > 2 ? ' +' + (p.classes.length - 2) + ' more' : '');
  }
  function blockTitle(id) { return BLOCKS[id] ? BLOCKS[id].title : id; }
  function placeText(c) {
    if (!c) return 'No page yet';
    var parts = [];
    if (c.planTitle || c.plan) parts.push(c.planTitle || c.plan);
    if (c.block) parts.push(BLOCKS[c.block] ? BLOCKS[c.block].title : (c.blockTitle || c.block));
    if (c.type) parts.push(TYPES[c.type] || (c.typeTitle || c.type).replace(/\s*·\s*(English|Urdu).*$/, ''));
    if (!parts.length) parts.push(c.title || c.path);
    return (KIND[c.kind] || 'Page') + ': ' + parts.join(' › ');
  }
  function api(action, params) {
    var q = Object.keys(params || {}).map(function (k) { return '&' + k + '=' + encodeURIComponent(params[k]); }).join('');
    return fetch(API + action + q, { credentials: 'same-origin', cache: 'no-store' }).then(function (r) {
      return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || 'HTTP ' + r.status); return j; });
    });
  }

  function load() {
    return api('overview', { who: state.who }).then(function (d) {
      state.data = d; state.updated = Date.now(); state.error = ''; render();
      if (state.open) loadStudent(state.open, true);
    }, function (e) { state.error = e.message; render(); });
  }
  function loadStudent(uid, quiet) {
    state.open = uid;
    if (!quiet) { state.detail = null; state.detailKey = ''; renderDetail(); }
    return api('student', { uid: uid }).then(function (d) {
      if (state.open !== uid) return;
      // The 15-second refresh only redraws this panel when something changed, so open attempts stay open.
      var key = JSON.stringify([d.person && d.person.last_seen, d.person && d.person.page_views, (d.attempts || []).length, (d.checks || []).length]);
      if (quiet && key === state.detailKey) return;
      state.detailKey = key; state.detail = d; renderDetail();
    },
      function (e) { if (state.open === uid) { state.detail = { error: e.message }; renderDetail(); } });
  }

  // ---------- overview ----------
  function kpi(box, n, label, live) {
    var k = el('div', 'sp-kpi' + (live ? ' is-live' : ''));
    k.appendChild(el('b', null, String(n))); k.appendChild(el('span', null, label)); box.appendChild(k);
  }
  function filtered() {
    var d = state.data, q = state.q.toLowerCase();
    var rows = d.people.filter(function (p) {
      if (q && p.name.toLowerCase().indexOf(q) < 0) return false;
      if (state.cls && p.classes.indexOf(state.cls) < 0) return false;
      if (state.plan && !(p.current && p.current.plan === state.plan)) return false;
      return true;
    });
    var by = {
      recent: function (a, b) { return (b.online - a.online) || (b.lastSeen - a.lastSeen); },
      name: function (a, b) { return a.name.localeCompare(b.name); },
      mastered: function (a, b) { return (b.mastery.mastered - a.mastery.mastered) || (b.mastery.ready - a.mastery.ready); },
      checks: function (a, b) { return b.checks.n - a.checks.n; },
      days: function (a, b) { return b.daysActive30 - a.daysActive30; }
    }[state.sort];
    return rows.sort(by);
  }
  function render() {
    var top = document.getElementById('sp-status');
    top.textContent = state.error ? 'Could not refresh: ' + state.error : state.data ? 'Live · updated ' + ago(state.updated / 1000) + ' · refreshes every 15 s' : 'Loading…';
    top.className = 'sp-status' + (state.error ? ' is-error' : ' is-live');
    var d = state.data; if (!d) return;
    var k = document.getElementById('sp-kpis'); k.replaceChildren();
    kpi(k, d.kpis.online, 'Online now', true); kpi(k, d.kpis.today, 'Active today'); kpi(k, d.kpis.week, 'Active this week');
    kpi(k, d.kpis.tracked, d.who === 'all' ? 'People tracked' : 'Students tracked'); kpi(k, d.kpis.masteryToday, 'Mastery checks today');
    kpi(k, d.kpis.checksToday, 'Answers checked today'); kpi(k, d.kpis.mastered, 'Blocks mastered (100%)');

    var cls = document.getElementById('sp-class'), seen = {};
    d.people.forEach(function (p) { p.classes.forEach(function (c) { seen[c] = 1; }); });
    var list = Object.keys(seen).sort(), have = Array.prototype.slice.call(cls.options, 1).map(function (o) { return o.value; });
    if (list.join('|') !== have.join('|')) {
      while (cls.options.length > 1) cls.remove(1);
      list.forEach(function (c) { cls.appendChild(new Option(c, c)); });
      cls.value = list.indexOf(state.cls) >= 0 ? state.cls : '';
    }
    var plan = document.getElementById('sp-plan');
    if (plan.options.length <= 1) PLANS.forEach(function (p) { var slug = (/plans\/([^/]+)\//.exec(p.url) || [])[1]; if (slug) plan.appendChild(new Option(p.label, slug)); });

    var body = document.getElementById('sp-rows'); body.replaceChildren();
    var rows = filtered();
    document.getElementById('sp-count').textContent = rows.length + ' of ' + d.people.length + (d.who === 'all' ? ' people' : ' students');
    if (!rows.length) { var tr = el('tr'); var td = el('td', 'sp-empty', d.people.length ? 'No one matches these filters.' : 'No student activity yet. Students appear here as soon as they open any Human Biology page.'); td.colSpan = 7; tr.appendChild(td); body.appendChild(tr); }
    rows.forEach(function (p) {
      var tr = el('tr', state.open === p.uid ? 'is-open' : ''); tr.tabIndex = 0;
      var who = el('td', 'sp-who'); var dot = el('i', 'sp-dot' + (p.online ? ' on' : '')); dot.title = p.online ? 'Online now' : 'Offline';
      who.appendChild(dot); var nm = el('div'); nm.appendChild(el('b', null, p.name));
      var sm = el('small', null, (p.role !== 'student' ? p.role + ' · ' : '') + classText(p)); sm.title = p.classes.join('\n'); nm.appendChild(sm); who.appendChild(nm);
      tr.appendChild(who);
      tr.appendChild(el('td', 'sp-seen', p.online ? 'Online now' : ago(p.lastSeen, d.now)));
      tr.appendChild(el('td', 'sp-now', placeText(p.current)));
      var m = el('td', 'sp-mastery'); var ms = p.mastery;
      m.appendChild(el('b', null, ms.mastered + ' mastered'));
      m.appendChild(el('small', null, ms.ready + ' ready · ' + ms.attempted + ' tried'));
      tr.appendChild(m);
      var last = el('td');
      if (ms.lastPct != null) { var c = el('span', 'sp-chip ' + band(ms.lastPct), ms.lastPct + '%'); last.appendChild(c); last.appendChild(el('small', null, blockTitle(ms.lastBlock))); }
      else last.appendChild(el('small', null, '—'));
      tr.appendChild(last);
      var ch = el('td'); ch.appendChild(el('b', null, String(p.checks.n))); ch.appendChild(el('small', null, n(p.checks.full, 'full mark'))); tr.appendChild(ch);
      var ac = el('td'); ac.appendChild(el('b', null, n(p.daysActive30, 'day'))); ac.appendChild(el('small', null, n(p.visits, 'visit') + ' · ' + n(p.pageViews, 'page'))); tr.appendChild(ac);
      function open() { loadStudent(p.uid); render(); }
      tr.addEventListener('click', open); tr.addEventListener('keydown', function (e) { if (e.key === 'Enter') open(); });
      body.appendChild(tr);
    });
    renderFeed();
  }
  function renderFeed() {
    var box = document.getElementById('sp-feed'); box.replaceChildren();
    var d = state.data;
    d.feed.slice(0, 40).forEach(function (f) {
      var li = el('li', 'sp-ev ' + f.kind);
      var who = el('button', 'sp-link', f.name); who.type = 'button';
      who.addEventListener('click', function () { loadStudent(f.uid); render(); });
      li.appendChild(who);
      var what;
      if (f.kind === 'mastery') { what = ' scored ' + f.score + '/' + f.total + ' (' + f.pct + '%) on ' + (f.title || blockTitle(f.block)); li.appendChild(document.createTextNode(what)); li.appendChild(el('span', 'sp-chip ' + f.band, BAND[f.band])); }
      else if (f.kind === 'check') li.appendChild(document.createTextNode(' checked ' + (TYPES[f.type] || f.part) + (f.score != null ? ': ' + f.score + '/' + f.max : ' (self-marked)')));
      else li.appendChild(document.createTextNode(' opened ' + placeText(f.place)));
      li.appendChild(el('time', null, ago(f.at, d.now)));
      box.appendChild(li);
    });
    if (!d.feed.length) box.appendChild(el('li', 'sp-empty', 'Activity will appear here as students work.'));
  }

  // ---------- one student ----------
  function renderDetail() {
    var box = document.getElementById('sp-detail'), keepScroll = box.scrollTop, openIds = {};
    Array.prototype.forEach.call(box.querySelectorAll('details[open][data-id]'), function (x) { openIds[x.getAttribute('data-id')] = 1; });
    box.hidden = !state.open; box.replaceChildren();
    if (!state.open) return;
    var close = el('button', 'sp-close secondary', 'Close'); close.type = 'button';
    close.addEventListener('click', function () { state.open = null; state.detail = null; renderDetail(); render(); });
    box.appendChild(close);
    var d = state.detail;
    if (!d) { box.appendChild(el('p', null, 'Loading this student…')); return; }
    if (d.error) { box.appendChild(el('p', 'sp-error', d.error)); return; }
    var p = d.person, s = d.summary, now = d.now;
    var head = el('div', 'sp-dhead');
    head.appendChild(el('h2', null, p.name));
    head.appendChild(el('p', null, (p.classes || []).join(', ') + (p.classes && p.classes.length ? ' · ' : '') + 'first seen ' + when(p.first_seen) + ' · last seen ' + ago(p.last_seen, now)));
    head.appendChild(el('p', 'sp-now', placeText(p.current)));
    box.appendChild(head);
    var k = el('div', 'sp-kpis sp-kpis-sm');
    kpi(k, s.mastered, 'Blocks mastered'); kpi(k, s.ready, 'Ready (90%+)'); kpi(k, s.attempted, 'Blocks tried'); kpi(k, s.attempts, 'Mastery attempts'); kpi(k, d.checks.length, 'Answers checked');
    box.appendChild(k);

    // Block map: every plan, every block, coloured by the best score.
    box.appendChild(el('h3', null, 'Block mastery by plan'));
    var best = {};
    Object.keys(p.device_mastery || {}).forEach(function (id) { best[id] = { best: p.device_mastery[id].best, device: true }; });
    Object.keys(p.mastery || {}).forEach(function (id) { best[id] = p.mastery[id]; });
    PLANS.forEach(function (plan) {
      var tried = plan.blocks.filter(function (id) { return best[id]; });
      var mastered = plan.blocks.filter(function (id) { return best[id] && best[id].best === 100; });
      var row = el('div', 'sp-plan');
      row.appendChild(el('h4', null, plan.label + ' · ' + mastered.length + ' of ' + plan.blocks.length + ' mastered' + (tried.length ? '' : ' · not started')));
      var grid = el('div', 'sp-blocks');
      plan.blocks.forEach(function (id, i) {
        var r = best[id], cell = el('span', 'sp-block ' + (r ? band(r.best) : 'none'), String(i + 1));
        cell.title = BLOCKS[id].label + ': ' + BLOCKS[id].title + (r ? ' · best ' + r.best + '%' + (r.attempts ? ' · ' + n(r.attempts, 'attempt') : '') + (r.device ? ' (saved on the student\'s device before tracking)' : '') : ' · not tried');
        grid.appendChild(cell);
      });
      row.appendChild(grid); box.appendChild(row);
    });
    box.appendChild(el('p', 'sp-legend', 'Green = 100% mastered · blue = 90–99% · amber = 80–89% · red = below 80% · grey = not tried. Hover a block for its name.'));

    box.appendChild(el('h3', null, 'Mastery check attempts'));
    if (!d.attempts.length) box.appendChild(el('p', 'sp-empty', 'No block mastery checks recorded on the server yet.'));
    d.attempts.forEach(function (a) {
      var det = el('details', 'sp-attempt'), aid = a.id || (a.block + '@' + a.created_at);
      det.setAttribute('data-id', aid); if (openIds[aid]) det.open = true;
      var sum = el('summary');
      sum.appendChild(el('span', 'sp-chip ' + a.band, a.pct + '%'));
      sum.appendChild(el('b', null, ' ' + (a.title || blockTitle(a.block))));
      sum.appendChild(el('small', null, ' · ' + a.score + '/' + a.total + ' · ' + when(a.created_at) + (a.seconds ? ' · ' + Math.round(a.seconds / 60) + ' min' : '')));
      det.appendChild(sum);
      if (a.types && a.types.length) {
        var tt = el('p', 'sp-types');
        a.types.forEach(function (t) { tt.appendChild(el('span', 'sp-chip ' + (t.right === t.total ? 'mastered' : 'not-yet'), (TYPES[t.id] || t.id) + ' ' + t.right + '/' + t.total)); });
        det.appendChild(tt);
      }
      var ol = el('ol', 'sp-qs');
      (a.questions || []).forEach(function (q) {
        var li = el('li', q.correct ? 'ok' : 'bad');
        li.appendChild(el('p', 'sp-q', (q.correct ? '✓ ' : '✗ ') + q.q));
        li.appendChild(el('p', null, 'Answered: ' + (q.response || '(blank)') + (q.correct ? '' : ' · Correct: ' + q.answer)));
        ol.appendChild(li);
      });
      det.appendChild(ol); box.appendChild(det);
    });

    box.appendChild(el('h3', null, 'Checked answers (practice questions)'));
    if (!d.checks.length) box.appendChild(el('p', 'sp-empty', 'No "Check my answer" attempts yet.'));
    else {
      var table = el('table', 'sp-small'); var thead = el('thead'); var hr = el('tr');
      ['When', 'Type', 'Question part', 'Mark', 'Answer'].forEach(function (h) { hr.appendChild(el('th', null, h)); });
      thead.appendChild(hr); table.appendChild(thead); var tb = el('tbody');
      d.checks.slice(0, 80).forEach(function (c) {
        var tr = el('tr');
        tr.appendChild(el('td', null, when(c.created_at))); tr.appendChild(el('td', null, TYPES[c.type_id] || c.type_id || ''));
        tr.appendChild(el('td', null, c.part_id)); tr.appendChild(el('td', null, c.score == null ? 'self-marked' : c.score + '/' + c.max_marks));
        tr.appendChild(el('td', 'sp-ans', String(c.answer || '').slice(0, 160))); tb.appendChild(tr);
      });
      table.appendChild(tb); var wrap = el('div', 'table-wrap'); wrap.appendChild(table); box.appendChild(wrap);
    }

    box.appendChild(el('h3', null, 'Recent pages'));
    var ul = el('ul', 'sp-pages');
    (p.recent || []).forEach(function (r) {
      var li = el('li'); var a = el('a', null, placeText(r)); a.href = r.path; a.target = '_blank'; a.rel = 'noopener';
      li.appendChild(a); li.appendChild(el('time', null, when(r.at) + (r.seen && r.seen - r.at > 90 ? ' · stayed ' + Math.round((r.seen - r.at) / 60) + ' min' : '')));
      ul.appendChild(li);
    });
    box.appendChild(ul);
    box.scrollTop = keepScroll;
  }

  // ---------- controls ----------
  document.getElementById('sp-search').addEventListener('input', function (e) { state.q = e.target.value; render(); });
  document.getElementById('sp-class').addEventListener('change', function (e) { state.cls = e.target.value; render(); });
  document.getElementById('sp-plan').addEventListener('change', function (e) { state.plan = e.target.value; render(); });
  document.getElementById('sp-sort').addEventListener('change', function (e) { state.sort = e.target.value; render(); });
  document.getElementById('sp-who').addEventListener('change', function (e) { state.who = e.target.checked ? 'all' : 'students'; load(); });
  setInterval(function () { if (document.visibilityState === 'visible') load(); else render(); }, REFRESH);
  setInterval(function () { if (state.data) document.getElementById('sp-status').textContent = 'Live · updated ' + ago(state.updated / 1000) + ' · refreshes every 15 s'; }, 5000);
  load();
})();
