const practiceHub = document.querySelector('[data-practice-hub]');
if (practiceHub) {
  const paperKey = 'igcsehumanbiology-saved-papers-v1';
  const resultKey = 'igcsehumanbiology-practice-results-v1';
  const completedKey = 'igcsehumanbiology-completed-types-v1';
  const read = (key, fallback) => {
    try {
      const value = JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
      if (key !== resultKey || !value || typeof value !== 'object') return value;
      return Object.fromEntries(Object.entries(value).map(([id, item]) => {
        if (item?.checkKind && item.checkKind !== 'choice' && item.checkerVersion !== 2 && item.resultSource !== 'manual' && ['secure', 'review'].includes(item.status)) {
          return [id, { ...item, status: 'unverified', score: null, needsRecheck: true }];
        }
        return [id, item];
      }));
    } catch { return fallback; }
  };
  const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Page remains usable. */ } };
  const escapeHTML = value => String(value ?? '').replace(/[&<>'"]/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[character]));
  const tabs = [...practiceHub.querySelectorAll('[data-practice-tab]')];
  const panels = [...practiceHub.querySelectorAll('[data-practice-panel]')];
  let catalog = null;
  let catalogPromise = null;
  let activePaper = null;
  let bankPage = 0;
  let bankMatches = [];
  let teacherManifestPromise = null;
  let partBoxesPromise = null;
  let pdfBuilderPromise = null;
  const gradeGuide = window.OlvPaperGradeGuide;
  window.addEventListener('afterprint', () => document.body.classList.remove('printing-paper'));

  function renderOfficialTable(variant) {
    const table = gradeGuide.boundaries[variant];
    const rows = [9, 8, 7, 6, 5, 4, 3, 2, 1].map(grade => `<tr><th scope="row">Grade ${grade}</th><td>${table[grade]}/180</td><td>${Math.min(180, table[grade] + 10)}/180</td></tr>`).join('');
    practiceHub.querySelector('[data-official-grade-table]').innerHTML = `<div class="grade-table-wrap"><table><caption>June 2026 ${variant === 'regional' ? 'regional Paper 1R + Paper 2R' : 'standard Paper 1 + Paper 2'} paper pair</caption><thead><tr><th>Grade</th><th>Official minimum</th><th>10-mark teacher buffer</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  }

  function renderOfficialResult(variant, score) {
    const result = gradeGuide.assessOfficialPair(variant, score);
    const root = practiceHub.querySelector('[data-official-grade-result]');
    if (!result) { root.innerHTML = '<p class="workspace-error">Enter a whole-number score from 0 to 180.</p>'; return; }
    const gradeText = result.grade ? `Grade ${result.grade} boundary reached` : 'Below the Grade 1 boundary';
    const nextText = result.nextGrade ? `${result.nextMarks} more ${result.nextMarks === 1 ? 'mark' : 'marks'} to the Grade ${result.nextGrade} boundary.` : 'Grade 9 boundary reached.';
    const bufferText = result.secureGrade ? `Grade ${result.secureGrade} also has a 10-mark buffer above its June 2026 boundary.` : 'No grade has a 10-mark buffer yet.';
    root.innerHTML = `<div class="grade-result"><strong>${gradeText} on this paper pair</strong><p>${score}/180. ${nextText} ${bufferText}</p><p>This describes the named June 2026 paper pair only. A future grade needs fresh, independent full-paper evidence.</p></div>`;
  }

  const officialForm = practiceHub.querySelector('[data-official-grade-form]');
  if (officialForm && gradeGuide.boundaries[officialForm.elements.variant.value]) {
  renderOfficialTable(officialForm.elements.variant.value);
  officialForm.elements.variant.addEventListener('change', () => {
    const variant = officialForm.elements.variant.value;
    renderOfficialTable(variant);
    if (officialForm.elements.score.value !== '') renderOfficialResult(variant, Number(officialForm.elements.score.value));
  });
  officialForm.addEventListener('submit', event => {
    event.preventDefault();
    renderOfficialResult(officialForm.elements.variant.value, Number(officialForm.elements.score.value));
  });
  }

  function renderCustomScore() {
    if (!activePaper) return;
    const root = practiceHub.querySelector('[data-custom-score-result]');
    if (!root) return;
    const score = activePaper.markedScore;
    if (!Number.isInteger(score)) { root.innerHTML = '<p>Enter the teacher-marked total to record this paper result.</p>'; return; }
    const profile = gradeGuide.describeCustomPaper(activePaper, catalog ? typeMap(catalog) : new Map());
    const percent = profile.total ? Math.round(score * 100 / profile.total) : 0;
    root.innerHTML = `<div class="grade-result"><strong>${score}/${profile.total} marks (${percent}%) on this custom paper</strong><p>${profile.focused ? 'Focused selection' : 'Broad mixed selection'} · ${profile.topics || 'unknown'} Human Biology topic${profile.topics === 1 ? '' : 's'} · ${Object.entries(profile.difficultyMarks).filter(([, marks]) => marks).map(([level, marks]) => `${marks} ${level.toLowerCase()} marks`).join(', ') || 'difficulty mix unavailable'}${profile.legacyMarks ? ` · ${profile.legacyMarks} marks from legacy papers` : ''}.</p><p>This result confirms performance on the selected questions. It does not establish a qualification grade. Use a fresh, complete official paper pair below for a grade benchmark.</p></div>`;
  }

  function selectTab(name, updateURL = true) {
    for (const tab of tabs) tab.setAttribute('aria-selected', String(tab.dataset.practiceTab === name));
    for (const panel of panels) panel.hidden = panel.dataset.practicePanel !== name;
    if (updateURL) {
      const url = new URL(location.href);
      url.searchParams.delete('tab');
      url.hash = name;
      history.replaceState(null, '', url.pathname + url.search + url.hash);
    }
    if (name === 'bank') renderBank();
    if (name === 'saved') renderSaved();
    if (name === 'results') renderResults();
  }
  for (const tab of tabs) tab.addEventListener('click', () => selectTab(tab.dataset.practiceTab));

  async function getCatalog() {
    if (!catalogPromise) catalogPromise = (async () => {
      const response = await fetch('/igcsehumanbiology/catalog.json', { credentials: 'same-origin' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      catalog = await response.json();
      return catalog;
    })().catch(error => { catalogPromise = null; throw error; });
    return catalogPromise;
  }

  function getTeacherManifest() {
    if (!teacherManifestPromise) teacherManifestPromise = fetch('/igcsehumanbiology/mark-schemes/paper-builder.json', { credentials: 'same-origin' })
      .then(async response => response.ok ? response.json() : null)
      .catch(() => null);
    return teacherManifestPromise;
  }

  function getPartBoxes() {
    if (!partBoxesPromise) partBoxesPromise = fetch('/igcsehumanbiology/question-images/part-boxes.json', { credentials: 'same-origin' })
      .then(async response => response.ok ? (await response.json()).parts || {} : {})
      .catch(() => { partBoxesPromise = null; return {}; });
    return partBoxesPromise;
  }

  // Printed papers keep the question's opening context, stop after the assigned part, and mark it in red.
  function printQuestionsHTML(paper, boxSets) {
    return paper.parts.map((part, index) => {
      const boxes = boxSets[part.id] || {};
      const sources = part.images?.length ? part.images : [part.image];
      const ids = sources.map(src => src.split('/').pop().replace(/\.png$/, ''));
      const last = ids.reduce((found, id, segment) => boxes[id] ? segment : found, -1);
      const shown = last === -1 ? sources : sources.slice(0, last + 1);
      const images = shown.map((src, segment) => {
        const rect = boxes[ids[segment]];
        const marker = rect ? `<span class="paper-print-boundary" style="left:${rect[0] * 100}%;top:${rect[1] * 100}%;width:${(rect[2] - rect[0]) * 100}%;height:${(rect[3] - rect[1]) * 100}%"><span class="paper-print-tag${rect[1] < 0.03 ? ' is-inside' : ''}">Question ${index + 1}: answer this part</span></span>` : '';
        return `<div class="paper-print-image"><img src="${escapeHTML(src)}" alt="Original question ${index + 1}, segment ${segment + 1}" loading="eager">${marker}</div>`;
      }).join('');
      return `<section class="paper-print-question"><h4>Question ${index + 1} · ${escapeHTML(part.source)} · ${Number(part.marks)} marks</h4><p class="paper-print-note">Answer only the part inside the red box. Other content is there for context.</p>${images}<div class="paper-answer-space"></div></section>`;
    }).join('');
  }

  function loadPdfBuilder() {
    if (!pdfBuilderPromise) pdfBuilderPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = '/igcsehumanbiology/assets/paper-downloads.js?v=18f97d758a';
      script.onload = () => resolve(window.OlvPaperDownloads);
      script.onerror = () => reject(new Error('The PDF builder could not load. Please try again.'));
      document.head.append(script);
    }).catch(error => { pdfBuilderPromise = null; throw error; });
    return pdfBuilderPromise;
  }

  const builder = practiceHub.querySelector('[data-paper-builder]');
  const scopeMode = builder.elements.scopeMode;
  const scopeSearch = builder.querySelector('[data-paper-scope-search]');
  const scopeOptions = builder.querySelector('[data-paper-scope-options]');
  const scopeSelections = {topic: new Set(), type: new Set(), block: new Set()};
  const scopeNames = {topic: 'topics', type: 'question types', block: 'learning blocks'};
  function scopeChoices(data, mode) {
    if (mode === 'topic') return data.topics || [];
    if (mode === 'type') return data.types.map(item => ({id: item.id, title: item.title, group: data.topics?.find(topic => topic.id === item.topicId)?.title || ''}));
    return data.blocks.map(item => ({id: item.id, title: item.title, group: item.planLabel, count: item.typeIds.length}));
  }
  function renderScopePicker(data) {
    const mode = scopeMode.value;
    const selected = scopeSelections[mode];
    const terms = scopeSearch.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    const choices = scopeChoices(data, mode).filter(item => terms.every(term => `${item.title} ${item.group || ''} ${item.id}`.toLocaleLowerCase().includes(term)));
    builder.querySelector('[data-paper-scope-heading]').textContent = `Choose ${scopeNames[mode]}`;
    builder.querySelector('[data-paper-scope-count]').textContent = `${selected.size} selected`;
    scopeOptions.setAttribute('aria-label', `Choose ${scopeNames[mode]}`);
    scopeOptions.innerHTML = choices.length ? choices.map(item => `<label class="paper-scope-option"><input type="checkbox" value="${escapeHTML(item.id)}" ${selected.has(item.id) ? 'checked' : ''}><span><strong>${escapeHTML(item.title)}</strong>${item.group ? `<small>${escapeHTML(item.group)}${item.count ? ` · ${item.count} types` : ''}</small>` : ''}</span></label>`).join('') : '<p class="empty">No matching choices.</p>';
  }
  getCatalog().then(renderScopePicker).catch(() => { scopeOptions.innerHTML = '<p class="workspace-error">Choices could not load. Refresh and try again.</p>'; });
  scopeMode.addEventListener('change', () => { scopeSearch.value = ''; if (catalog) renderScopePicker(catalog); });
  scopeSearch.addEventListener('input', () => { if (catalog) renderScopePicker(catalog); });
  scopeOptions.addEventListener('change', event => {
    if (!event.target.matches('input[type=checkbox]')) return;
    const selected = scopeSelections[scopeMode.value];
    if (event.target.checked) selected.add(event.target.value); else selected.delete(event.target.value);
    builder.querySelector('[data-paper-scope-count]').textContent = `${selected.size} selected`;
  });
  builder.querySelector('[data-paper-select-visible]').addEventListener('click', () => {
    for (const input of scopeOptions.querySelectorAll('input[type=checkbox]')) scopeSelections[scopeMode.value].add(input.value);
    if (catalog) renderScopePicker(catalog);
  });
  builder.querySelector('[data-paper-clear]').addEventListener('click', () => {
    scopeSelections[scopeMode.value].clear();
    if (catalog) renderScopePicker(catalog);
  });

  function typeMap(data) { return new Map(data.types.map(type => [type.id, type])); }
  function shuffle(items) {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index--) {
      const other = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[other]] = [copy[other], copy[index]];
    }
    return copy;
  }
  function uniqueParts(parts) { return [...new Map(parts.map(part => [part.id, part])).values()]; }
  function chosenParts(parts, target) {
    const reachable = Array(target + 1).fill(null);
    reachable[0] = [];
    for (const part of shuffle(parts)) {
      const marks = Number(part.marks);
      if (!Number.isInteger(marks) || marks < 1 || marks > target) continue;
      for (let total = target; total >= marks; total--) {
        if (reachable[total] === null && reachable[total - marks] !== null) reachable[total] = [...reachable[total - marks], part];
      }
      if (reachable[target] !== null) break;
    }
    return reachable[target] || reachable.findLast(selection => selection !== null) || [];
  }
  function chosenScopedParts(parts, target, groups) {
    const required = [];
    const chosenIds = new Set();
    let remaining = target;
    for (const group of [...groups].sort((left, right) => left.length - right.length)) {
      if (!group.length) return null;
      if (group.some(part => chosenIds.has(part.id))) continue;
      const next = shuffle(group).filter(part => !chosenIds.has(part.id) && Number(part.marks) <= remaining)
        .sort((left, right) => Number(left.marks) - Number(right.marks))[0];
      if (!next) return null;
      required.push(next);
      chosenIds.add(next.id);
      remaining -= Number(next.marks);
    }
    return [...required, ...chosenParts(parts.filter(part => !chosenIds.has(part.id)), remaining)];
  }

  async function renderBank() {
    const list = practiceHub.querySelector('[data-practice-bank-list]');
    list.innerHTML = '<p class="empty">Loading the Human Biology question bank…</p>';
    try {
      const data = await getCatalog();
      const types = typeMap(data);
      const search = practiceHub.querySelector('[data-practice-search]').value.trim().toLowerCase();
      const filter = name => practiceHub.querySelector(`[data-practice-filter="${name}"]`).value;
      bankMatches = uniqueParts(data.parts).filter(part => {
        const type = types.get(part.typeKey) || {};
        return (!search || `${part.id} ${part.source} ${part.title} ${part.text}`.toLowerCase().includes(search))
          && (!filter('topic') || type.topicId === filter('topic'))
          && (!filter('plan') || part.ownerPlanId === filter('plan'))
          && (!filter('difficulty') || type.difficulty === filter('difficulty'))
          && (!filter('stars') || String(type.stars) === filter('stars'));
      });
      bankPage = Math.min(bankPage, Math.max(0, Math.ceil(bankMatches.length / 24) - 1));
      const visible = bankMatches.slice(bankPage * 24, (bankPage + 1) * 24);
      list.innerHTML = visible.length ? visible.map(part => `<article class="practice-bank-item"><div><strong>${escapeHTML(part.source)}</strong><p>${escapeHTML(part.title)} · ${Number(part.marks)} marks</p></div><button type="button" class="secondary" data-preview-part="${escapeHTML(part.id)}">Open question here</button></article>`).join('') : '<p class="empty">No matching questions. Try broader filters.</p>';
      practiceHub.querySelector('[data-practice-count]').textContent = `${bankMatches.length.toLocaleString()} matching question parts`;
      practiceHub.querySelector('[data-practice-page]').textContent = bankMatches.length ? `Page ${bankPage + 1} of ${Math.ceil(bankMatches.length / 24)}` : '';
      practiceHub.querySelector('[data-practice-prev]').disabled = bankPage === 0;
      practiceHub.querySelector('[data-practice-next]').disabled = (bankPage + 1) * 24 >= bankMatches.length;
    } catch {
      list.innerHTML = '<p class="workspace-error">The question bank could not load. Please refresh and try again.</p>';
    }
  }
  for (const control of practiceHub.querySelectorAll('[data-practice-search],[data-practice-filter]')) {
    control.addEventListener(control.type === 'search' ? 'input' : 'change', () => { bankPage = 0; renderBank(); });
  }
  practiceHub.querySelector('[data-practice-prev]').addEventListener('click', () => { bankPage--; renderBank(); });
  practiceHub.querySelector('[data-practice-next]').addEventListener('click', () => { bankPage++; renderBank(); });

  async function openQuestion(id) {
    const data = await getCatalog();
    const part = data.parts.find(item => item.id === id);
    if (!part) return;
    const preview = practiceHub.querySelector('[data-practice-preview]');
    preview.innerHTML = `<div class="practice-preview-heading"><div><p class="eyebrow">Original question · ${Number(part.marks)} marks</p><h3>${escapeHTML(part.source)}</h3><p>${escapeHTML(part.title)}</p></div><button type="button" class="secondary" data-close-preview>Close</button></div>${(part.images?.length ? part.images : [part.image]).map((src, index) => `<img src="${escapeHTML(src)}" alt="Original question image, segment ${index + 1}" loading="lazy">`).join('')}<details><summary>Read the accepted part as text</summary><p>${escapeHTML(part.text)}</p></details><p><a href="${escapeHTML(part.bank)}">Open the full question lesson</a></p>`;
    preview.hidden = false;
    preview.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  function renderPaper(paper) {
    activePaper = paper;
    const results = read(resultKey, {});
    const rows = paper.parts.map((part, index) => {
      const result = results[part.id]?.status || '';
      const checkNote = result === 'unverified' ? '<p class="paper-question-meta">Answer not confirmed. Compare it with the answer sheet.</p>' : result === 'final-match' ? '<p class="paper-question-meta">Final value matched. Compare your working with the answer sheet.</p>' : '';
      return `<li><button type="button" class="paper-question-open" data-preview-part="${escapeHTML(part.id)}"><strong>${index + 1}. ${escapeHTML(part.title)}</strong></button><p class="paper-question-meta">${escapeHTML(part.source)} · ${Number(part.marks)} marks</p>${checkNote}<div class="paper-marking" data-result-part="${escapeHTML(part.id)}" data-result-type="${escapeHTML(part.typeKey)}"><button type="button" class="secondary ${result === 'secure' ? 'is-selected' : ''}" data-result="secure">Got it</button><button type="button" class="secondary ${result === 'review' ? 'is-selected' : ''}" data-result="review">Needs practice</button></div></li>`;
    }).join('');
    const total = paper.parts.reduce((sum, part) => sum + Number(part.marks || 0), 0);
    const markedScore = Number.isInteger(paper.markedScore) ? paper.markedScore : '';
    practiceHub.querySelector('[data-paper-output]').innerHTML = `<article class="generated-paper"><div class="generated-paper-header"><div><p class="eyebrow">${escapeHTML(paper.planLabel)}</p><h3>${escapeHTML(paper.title || 'Human Biology practice paper')}</h3><p>${total} marks${paper.minutes ? ` · ${Number(paper.minutes)} minutes` : ''} · generated ${new Date(paper.createdAt).toLocaleDateString()}</p></div><div class="saved-paper-actions"><button type="button" class="secondary" data-print-paper>Print paper</button><button type="button" class="secondary" data-save-paper>Save paper</button></div></div><div class="paper-download-actions" data-teacher-paper-downloads hidden></div><p class="paper-download-status" data-paper-download-status role="status" aria-live="polite"></p><div class="custom-paper-score"><h4>Teacher-marked result</h4><label>Marks earned out of ${total}<input data-custom-score type="number" min="0" max="${total}" step="1" value="${markedScore}" placeholder="Enter total"></label><div data-custom-score-result role="status" aria-live="polite"></div></div><ol class="generated-paper-list">${rows}</ol><div class="paper-print-body" data-paper-print-body></div></article>`;
    getPartBoxes().then(boxSets => {
      const body = practiceHub.querySelector('[data-paper-print-body]');
      if (body && activePaper?.id === paper.id) body.innerHTML = printQuestionsHTML(paper, boxSets);
    });
    getTeacherManifest().then(manifest => {
      if (!manifest || activePaper?.id !== paper.id) return;
      const actions = practiceHub.querySelector('[data-teacher-paper-downloads]');
      if (!actions) return;
      actions.hidden = false;
      actions.innerHTML = '<strong>Teacher files</strong><button type="button" data-download-paper="question">Download full question paper (PDF)</button><button type="button" class="secondary" data-download-paper="scheme">Download marking scheme (PDF)</button>';
    });
    renderCustomScore();
    if (!catalog) getCatalog().then(() => { if (activePaper?.id === paper.id) renderCustomScore(); }).catch(() => {});
  }

  builder.addEventListener('submit', async event => {
    event.preventDefault();
    const form = new FormData(builder);
    const mode = scopeMode.value;
    const selectedIds = [...scopeSelections[mode]];
    const difficulty = String(form.get('difficulty') || '');
    const target = Number(form.get('marks'));
    const output = practiceHub.querySelector('[data-paper-output]');
    if (!selectedIds.length) { output.innerHTML = `<p class="workspace-error">Choose at least one ${scopeNames[mode].slice(0, -1)} first.</p>`; return; }
    output.innerHTML = '<p class="empty">Building your paper…</p>';
    try {
      const data = await getCatalog();
      const types = typeMap(data);
      const selected = new Set(selectedIds);
      const allowedTypes = new Set(mode === 'topic' ? data.types.filter(type => selected.has(type.topicId)).map(type => type.id)
        : mode === 'type' ? selectedIds : data.blocks.filter(block => selected.has(block.id)).flatMap(block => block.typeIds));
      const used = new Set(form.has('noRepeat') ? read(paperKey, []).flatMap(paper => paper.parts.map(part => part.id)) : []);
      const candidates = uniqueParts(data.parts).filter(part => !used.has(part.id) && allowedTypes.has(part.typeKey) && (!difficulty || types.get(part.typeKey)?.difficulty === difficulty));
      const blocks = new Map(data.blocks.map(block => [block.id, new Set(block.typeIds)]));
      const groups = selectedIds.map(id => candidates.filter(part => mode === 'topic' ? types.get(part.typeKey)?.topicId === id
        : mode === 'type' ? part.typeKey === id : blocks.get(id)?.has(part.typeKey)));
      const parts = chosenScopedParts(candidates, target, groups);
      if (!parts?.length) { output.innerHTML = '<p class="workspace-error">A question from every selected topic, type or block cannot fit these settings. Increase target marks, broaden difficulty, or allow questions from saved papers.</p>'; return; }
      const actual = parts.reduce((sum, part) => sum + Number(part.marks), 0);
      const label = selectedIds.length === 1 ? `${mode === 'block' ? 'Block' : mode === 'type' ? 'Type' : 'Topic'}: ${scopeChoices(data, mode).find(item => item.id === selectedIds[0])?.title || selectedIds[0]}` : `${selectedIds.length} ${scopeNames[mode]}`;
      renderPaper({ id: `paper-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, title: String(form.get('title') || '').trim() || 'My Human Biology practice paper', createdAt: new Date().toISOString(), planLabel: label, minutes: Number(form.get('minutes')) || null, filters: {scopeMode: mode, scopeIds: selectedIds, difficulty}, parts });
      if (actual < target) output.insertAdjacentHTML('afterbegin', `<p class="notice">This selection has ${actual} of ${target} requested marks. Broaden a filter to reach the target.</p>`);
    } catch {
      output.innerHTML = '<p class="workspace-error">The question bank could not load. Please refresh and try again.</p>';
    }
  });

  practiceHub.addEventListener('input', event => {
    if (!event.target.matches('[data-custom-score]') || !activePaper) return;
    const raw = event.target.value;
    const total = activePaper.parts.reduce((sum, part) => sum + Number(part.marks || 0), 0);
    const score = Number(raw);
    activePaper.markedScore = raw !== '' && Number.isInteger(score) && score >= 0 && score <= total ? score : null;
    const saved = read(paperKey, []);
    const index = saved.findIndex(paper => paper.id === activePaper.id);
    if (index !== -1) { saved[index] = activePaper; write(paperKey, saved); }
    renderCustomScore();
  });

  practiceHub.addEventListener('click', event => {
    const preview = event.target.closest('[data-preview-part]');
    if (preview) { openQuestion(preview.dataset.previewPart); return; }
    if (event.target.closest('[data-close-preview]')) { practiceHub.querySelector('[data-practice-preview]').hidden = true; return; }
    if (event.target.closest('[data-print-paper]') && activePaper) {
      const paper = activePaper;
      getPartBoxes().then(boxSets => {
        const body = practiceHub.querySelector('[data-paper-print-body]');
        if (body && !body.childElementCount) body.innerHTML = printQuestionsHTML(paper, boxSets);
        return Promise.all([...practiceHub.querySelectorAll('.paper-print-body img')].map(image => image.decode()));
      }).then(() => {
        document.body.classList.add('printing-paper');
        window.print();
      }).catch(() => {
        const status = practiceHub.querySelector('[data-paper-download-status]');
        if (status) status.textContent = 'A source image could not load. Please try printing again.';
      });
      return;
    }
    const downloadButton = event.target.closest('[data-download-paper]');
    if (downloadButton && activePaper) {
      const paper = activePaper;
      const status = practiceHub.querySelector('[data-paper-download-status]');
      downloadButton.disabled = true;
      status.textContent = 'Preparing the PDF with original images…';
      Promise.all([getTeacherManifest(), loadPdfBuilder()]).then(async ([manifest, pdfBuilder]) => {
        if (!manifest || !pdfBuilder) throw new Error('Teacher access is required for these downloads.');
        const result = await pdfBuilder.download(paper, downloadButton.dataset.downloadPaper, manifest, message => { status.textContent = message; });
        status.textContent = `PDF ready: ${result.pages} pages.`;
      }).catch(error => { status.textContent = error.message || 'The PDF could not be prepared. Please try again.'; })
        .finally(() => { downloadButton.disabled = false; });
      return;
    }
    const resultButton = event.target.closest('[data-result]');
    if (resultButton) {
      const row = resultButton.closest('[data-result-part]');
      const results = read(resultKey, {});
      results[row.dataset.resultPart] = { ...results[row.dataset.resultPart], status: resultButton.dataset.result, score: null, resultSource: 'manual', checkerVersion: 2, typeId: row.dataset.resultType, updatedAt: new Date().toISOString() };
      write(resultKey, results);
      for (const button of row.querySelectorAll('[data-result]')) button.classList.toggle('is-selected', button === resultButton);
      return;
    }
    if (event.target.closest('[data-save-paper]') && activePaper) {
      const saved = read(paperKey, []);
      if (!saved.some(paper => paper.id === activePaper.id)) saved.unshift(activePaper);
      write(paperKey, saved.slice(0, 20));
      event.target.closest('[data-save-paper]').textContent = 'Saved ✓';
      return;
    }
    const open = event.target.closest('[data-open-saved]');
    if (open) {
      const paper = read(paperKey, []).find(item => item.id === open.dataset.openSaved);
      if (paper) { selectTab('build'); renderPaper(paper); }
      return;
    }
    const remove = event.target.closest('[data-remove-saved]');
    if (remove) {
      write(paperKey, read(paperKey, []).filter(item => item.id !== remove.dataset.removeSaved));
      renderSaved();
    }
  });

  function renderSaved() {
    const saved = read(paperKey, []);
    const root = practiceHub.querySelector('[data-saved-papers]');
    root.innerHTML = saved.length ? saved.map(paper => `<article class="saved-paper"><div><h3>${escapeHTML(paper.title || paper.planLabel)} · ${paper.parts.length} parts</h3><p>${new Date(paper.createdAt).toLocaleString()}</p></div><div class="saved-paper-actions"><button type="button" data-open-saved="${escapeHTML(paper.id)}">Open</button><button type="button" class="secondary" data-remove-saved="${escapeHTML(paper.id)}">Remove</button></div></article>`).join('') : '<p class="empty">No saved papers yet. Build one and choose Save paper.</p>';
  }
  function renderResults() {
    const results = Object.values(read(resultKey, {}));
    const attempts = results.filter(result => String(result.answer || '').trim());
    const completed = read(completedKey, []);
    const secure = results.filter(result => result.status === 'secure').length;
    const review = results.filter(result => result.status === 'review').length;
    const unchecked = results.filter(result => ['unverified', 'final-match'].includes(result.status)).length;
    const reviewTypes = [...new Set(results.filter(result => result.status === 'review').map(result => result.typeId))];
    const root = practiceHub.querySelector('[data-practice-results]');
    root.innerHTML = `<div class="progress-summary"><div><strong>${attempts.length}</strong>answers saved</div><div><strong>${secure}</strong>got it or confirmed</div><div><strong>${unchecked}</strong>not fully checked</div><div><strong>${review}</strong>needs practice</div><div><strong>${completed.length}</strong>types complete</div></div>${reviewTypes.length ? `<h3>Types to practise again</h3><ul class="result-list">${reviewTypes.map(id => `<li><a href="/igcsehumanbiology/?view=types&type=${encodeURIComponent(id)}">${escapeHTML(id)}</a></li>`).join('')}</ul>` : '<p class="empty">No parts are currently marked as needing practice.</p>'}<p class="muted">Choices and reviewed short answers can be confirmed automatically. Other written answers are not graded by this checker. A matching final value does not award marks for working.</p>`;
  }
  const requestedTab = location.hash.slice(1) || new URLSearchParams(location.search).get('tab');
  const initial = ['bank','build','saved','papers','results'].includes(requestedTab) ? requestedTab : 'bank';
  selectTab(initial, false);
  window.addEventListener('afterprint', () => document.body.classList.remove('printing-paper'));
  document.addEventListener('olv:course-view', event => {
    if (event.detail.view !== 'practice') return;
    const name = ['bank','build','saved','papers','results'].includes(event.detail.tab) ? event.detail.tab : 'bank';
    selectTab(name, false);
  });
}
