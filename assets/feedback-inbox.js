// Admin inbox for student feedback reports, visit records and daily activity. All text is shown as text only.
(() => {
  'use strict';
  const root = document.querySelector('[data-feedback-inbox]');
  if (!root) return;
  const api = '/igcsehumanbiology/teach-me/api.php?action=feedback-';
  const labels = { new: 'New', checking: 'Checking', 'needs-decision': 'Needs your decision', fixed: 'Fixed', 'not-a-problem': 'Not a problem' };
  const open = new Set(['new', 'checking', 'needs-decision']);
  // Reports from stronger students come first. A student with no level yet ranks just above Below pass.
  const levels = { 'grade-9': 'Grade 9 level', 'grade-8': 'Grade 8 level', 'grade-7': 'Grade 7 / A level', pass: 'Pass level', 'below-pass': 'Below pass' };
  const rank = (level) => ({ 'grade-9': 0, 'grade-8': 1, 'grade-7': 2, pass: 3, 'below-pass': 5 })[level] ?? 4;
  let data = null;
  let csrf = '';
  const filters = { status: 'open', who: 'student', level: 'all', search: '' };

  const el = (tag, attrs = {}, ...children) => {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) {
      if (key === 'class') node.className = value;
      else if (key === 'text') node.textContent = value;
      else if (value === true) node.setAttribute(key, '');
      else if (value !== false && value != null) node.setAttribute(key, value);
    }
    for (const child of children) if (child != null) node.append(child);
    return node;
  };
  const date = (t) => (t ? new Date(t * 1000).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '');
  const clock = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  async function call(action, body) {
    const options = { credentials: 'same-origin', cache: 'no-store' };
    if (body) Object.assign(options, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf }, body: JSON.stringify(body) });
    const response = await fetch(api + action, options);
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || 'The feedback service did not respond.');
    return result;
  }

  function about(c) {
    const parts = [];
    if (c.kind) parts.push(c.kind[0].toUpperCase() + c.kind.slice(1));
    if (c.plan) parts.push(c.plan);
    if (c.block) parts.push(`Block ${c.block}`);
    if (c.typeId || c.typeName) parts.push(`Type ${[c.typeId, c.typeName].filter(Boolean).join(' · ')}`);
    else if (c.title) parts.push(c.title);
    if (c.part) parts.push(`Part ${c.part}`);
    if (c.media) parts.push(`${c.media}${c.mediaTime != null ? ` at ${clock(c.mediaTime)}` : ''}${c.language === 'ur' ? ' (Urdu)' : ''}`);
    return parts.join(' · ') || 'No page details were sent';
  }

  function visibleReports() {
    const term = filters.search.trim().toLowerCase();
    return data.reports.filter((r) => (filters.who === 'all' || r.role === 'student')
      && (filters.status === 'all' || (filters.status === 'open' ? open.has(r.status) : r.status === filters.status))
      && (filters.level === 'all' || (r.standing && rank(r.standing) <= rank(filters.level)))
      && (!term || [r.name, r.message, r.reply, r.note, about(r.context), ...(r.memberships || [])].join(' ').toLowerCase().includes(term)))
      .sort((a, b) => rank(a.standing) - rank(b.standing) || b.createdAt - a.createdAt);
  }

  function reportCard(report) {
    const status = el('select', { 'aria-label': 'Status' }, ...data.statuses.map((s) => el('option', { value: s, text: labels[s] || s, selected: s === report.status })));
    const reply = el('textarea', { rows: '2', maxlength: '600', placeholder: 'Short reply the student will see (needed for Fixed or Not a problem)' });
    reply.value = report.reply || '';
    const note = el('textarea', { rows: '2', maxlength: '4000', placeholder: 'Internal note: how it was checked (students never see this)' });
    note.value = report.note || '';
    const release = el('input', { type: 'text', maxlength: '80', placeholder: 'Fix release name (optional)', value: report.fixRelease || '' });
    const save = el('button', { type: 'button', text: 'Save' });
    const message = el('p', { class: 'fbi-save', role: 'status' });
    save.addEventListener('click', async () => {
      save.disabled = true; message.textContent = 'Saving…';
      try {
        const result = await call('update', { id: report.id, status: status.value, reply: reply.value, note: note.value, fixRelease: release.value.trim() });
        Object.assign(report, result.report);
        message.textContent = 'Saved.';
        render();
      } catch (e) { message.textContent = e.message; save.disabled = false; }
    });
    const link = report.context?.path ? el('a', { href: report.context.path, target: '_blank', rel: 'noopener', text: 'Open the page ↗' }) : null;
    return el('article', { class: `fbi-report fbi-${report.status}` },
      el('div', { class: 'fbi-report-head' },
        el('span', { class: `fbi-pill fbi-pill-${report.status}`, text: labels[report.status] || report.status }),
        el('strong', { text: report.name }),
        report.role === 'student' ? el('span', { class: `fbi-level fbi-level-${report.standing || 'unknown'}`, text: levels[report.standing] || 'Level not set' }) : null,
        el('span', { class: 'fbi-muted', text: [report.role !== 'student' ? report.role : '', ...(report.memberships || [])].filter(Boolean).join(' · ') }),
        el('time', { class: 'fbi-muted', text: date(report.createdAt) })),
      el('p', { class: 'fbi-about' }, el('span', { text: about(report.context || {}) }), link ? ' ' : null, link),
      el('blockquote', { class: 'fbi-message', text: report.message }),
      el('details', { class: 'fbi-edit', open: report.status === 'new' || report.status === 'needs-decision' },
        el('summary', { text: report.updatedBy ? `Update · last changed ${date(report.updatedAt)} by ${report.updatedBy === 'review-job' ? 'the 5-hour check' : 'admin'}` : 'Update' }),
        el('div', { class: 'fbi-edit-grid' }, status, release, reply, note),
        el('div', { class: 'fbi-edit-actions' }, save, message)));
  }

  function kpis() {
    const students = data.visitors.filter((v) => v.role === 'student');
    const today = data.daily[data.daily.length - 1];
    const items = [
      [data.reports.filter((r) => r.status === 'new').length, 'new reports'],
      [data.reports.filter((r) => open.has(r.status) && r.standing && rank(r.standing) <= 1).length, 'open from Grade 8+ students'],
      [data.reports.filter((r) => r.status === 'needs-decision').length, 'need your decision'],
      [data.reports.filter((r) => r.status === 'fixed').length, 'fixed'],
      [students.length, 'students tracked'],
      [students.filter((v) => v.daysActive >= 2).length, 'students active on 2+ days'],
      [today && today.day === new Date(Date.now() + 5 * 3600e3).toISOString().slice(0, 10) ? today.students : 0, 'students active today'],
    ];
    return el('div', { class: 'fbi-kpis' }, ...items.map(([n, t]) => el('div', { class: 'fbi-kpi' }, el('strong', { text: String(n) }), el('span', { text: t }))));
  }

  function dailyChart() {
    const days = data.daily.slice(-14);
    const max = Math.max(1, ...days.map((d) => d.students));
    const chart = el('section', { class: 'fbi-daily' }, el('h2', { text: 'Students active per day (last 14 active days)' }));
    if (!days.length) chart.append(el('p', { class: 'fbi-muted', text: 'No visits recorded yet.' }));
    for (const d of days) {
      chart.append(el('div', { class: 'fbi-bar' }, el('span', { text: d.day }),
        el('progress', { max: String(max), value: String(d.students), 'aria-label': `${d.students} students on ${d.day}` }),
        el('b', { text: `${d.students} students · ${d.studentPageViews} page opens` })));
    }
    return chart;
  }

  function visitsTable() {
    const people = data.visitors.filter((v) => filters.who === 'all' || v.role === 'student');
    const table = el('table', { class: 'fbi-table' }, el('thead', {}, el('tr', {}, ...['Name', 'Role', 'Level', 'Classes', 'Visits', 'Days active', 'Page opens', 'Last seen', 'Reports'].map((h) => el('th', { text: h })))));
    const body = el('tbody');
    for (const v of people) {
      const cells = [v.name, v.role, (v.memberships || []).join(', '), v.visits, v.daysActive, v.pageViews, date(v.lastSeen), v.reports]
        .map((c) => el('td', { text: String(c) }));
      cells.splice(2, 0, el('td', {}, v.role === 'student' ? levelPicker(v) : null));
      body.append(el('tr', {}, ...cells));
    }
    table.append(body);
    return el('section', {}, el('h2', { text: 'Visits by person' }), el('p', { class: 'fbi-muted', text: data.visitRule }), el('div', { class: 'table-scroll' }, table));
  }

  function levelPicker(person) {
    const select = el('select', { 'aria-label': `Level for ${person.name}` }, el('option', { value: '', text: 'Not set' }),
      ...data.standings.map((s) => el('option', { value: s, text: levels[s], selected: s === person.standing })));
    const note = el('small', { class: 'fbi-muted', text: person.standingSource === 'weekly-tests' ? `From weekly tests${person.standingScore != null ? ` · ${person.standingScore}%` : ''}` : person.standing ? 'Set by admin' : '' });
    select.addEventListener('change', async () => {
      select.disabled = true;
      try {
        await call('standing', { students: [{ uid: person.uid, standing: select.value || null }], source: 'manual' });
        person.standing = select.value || null; person.standingSource = select.value ? 'manual' : null;
        for (const r of data.reports) if (r.uid === person.uid) r.standing = person.standing;
        render();
      } catch (e) { note.textContent = e.message; select.disabled = false; }
    });
    return el('div', { class: 'fbi-level-picker' }, select, note);
  }

  // Spreadsheets run cells that start with = + - @ as formulas; prefix them so student text stays text.
  function csv() {
    const cell = (v) => { let s = String(v ?? ''); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; return `"${s.replace(/"/g, '""')}"`; };
    const head = ['createdAt', 'status', 'name', 'role', 'level', 'classes', 'kind', 'plan', 'block', 'typeId', 'typeName', 'part', 'media', 'mediaTime', 'path', 'message', 'reply', 'note', 'fixRelease'];
    const lines = [head.map(cell).join(',')];
    for (const r of visibleReports()) {
      const c = r.context || {};
      lines.push([new Date(r.createdAt * 1000).toISOString(), r.status, r.name, r.role, levels[r.standing] || '', (r.memberships || []).join(' '), c.kind, c.plan, c.block, c.typeId, c.typeName, c.part, c.media, c.mediaTime, c.path, r.message, r.reply, r.note, r.fixRelease].map(cell).join(','));
    }
    const link = el('a', { href: URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/csv' })), download: `human-biology-feedback-${new Date().toISOString().slice(0, 10)}.csv` });
    document.body.append(link); link.click(); link.remove();
  }

  function controls() {
    const status = el('select', { id: 'fbi-status' }, el('option', { value: 'open', text: 'Open (new, checking, needs decision)' }), el('option', { value: 'all', text: 'All reports' }),
      ...data.statuses.map((s) => el('option', { value: s, text: labels[s] })));
    status.value = filters.status;
    const who = el('select', { id: 'fbi-who' }, el('option', { value: 'student', text: 'Students only' }), el('option', { value: 'all', text: 'Everyone (incl. staff)' }));
    who.value = filters.who;
    const level = el('select', { id: 'fbi-level' }, el('option', { value: 'all', text: 'All students' }), el('option', { value: 'grade-8', text: 'Grade 8 level and above' }),
      el('option', { value: 'grade-7', text: 'Grade 7 / A level and above' }), el('option', { value: 'pass', text: 'Pass level and above' }));
    level.value = filters.level;
    level.addEventListener('change', () => { filters.level = level.value; renderReports(); });
    const search = el('input', { id: 'fbi-search', type: 'search', placeholder: 'Search name, class, type, words…', value: filters.search });
    const download = el('button', { type: 'button', class: 'secondary', text: 'Download CSV' });
    const refresh = el('button', { type: 'button', class: 'secondary', text: 'Refresh' });
    status.addEventListener('change', () => { filters.status = status.value; render(); });
    who.addEventListener('change', () => { filters.who = who.value; render(); });
    search.addEventListener('input', () => { filters.search = search.value; renderReports(); });
    download.addEventListener('click', csv);
    refresh.addEventListener('click', load);
    return el('div', { class: 'fbi-controls' },
      el('label', { for: 'fbi-status' }, 'Show', status), el('label', { for: 'fbi-who' }, 'Who', who), el('label', { for: 'fbi-level' }, 'From', level),
      el('label', { for: 'fbi-search', class: 'fbi-search' }, 'Search', search), download, refresh);
  }

  const list = el('div', { class: 'fbi-list' });
  function renderReports() {
    const rows = visibleReports();
    list.replaceChildren(el('p', { class: 'fbi-muted', text: `${rows.length} report${rows.length === 1 ? '' : 's'} in this view` }), ...rows.map(reportCard));
    if (!rows.length) list.append(el('p', { text: filters.status === 'open' ? 'No open reports. Everything students sent has been answered.' : 'No reports match this view.' }));
  }

  function render() {
    root.replaceChildren(kpis(), controls(), el('h2', { text: 'Reports' }), list, dailyChart(), visitsTable());
    renderReports();
  }

  async function load() {
    try {
      const status = await call('status');
      if (!status.canViewResults) { root.replaceChildren(el('p', { text: 'Administrator access required.' })); return; }
      csrf = status.csrf;
      data = await call('results');
      render();
    } catch (e) {
      root.replaceChildren(el('p', { text: e.message }));
    }
  }
  load();
})();
