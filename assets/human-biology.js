// Human Biology 4HB1 question bank filters (question-bank.html). Pure client-side filtering of rows already in the page.
// Answer checking and the home page's practice hub are the shared engine files (marking adapter, practice-hub.js).
(() => {
  'use strict';
  function initBank(root) {
    const table = root.querySelector('[data-bank-table]');
    if (!table || table.dataset.bankReady) return;
    table.dataset.bankReady = 'true';
    const rows = [...table.querySelectorAll('tbody tr')];
    const controls = [...root.querySelectorAll('[data-bank-filter]')];
    const text = root.querySelector('[data-bank-text]');
    const status = root.querySelector('[data-bank-status]');
    function apply() {
      const wanted = Object.fromEntries(controls.map(c => [c.dataset.bankFilter, c.value]));
      const terms = (text ? text.value : '').toLowerCase().trim().split(/\s+/).filter(Boolean);
      let shown = 0;
      for (const row of rows) {
        const ok = Object.entries(wanted).every(([key, value]) => !value || row.dataset[key] === value)
          && terms.every(t => row.dataset.search.includes(t));
        row.hidden = !ok;
        if (ok) shown++;
      }
      if (status) status.textContent = `${shown} of ${rows.length} question parts shown`;
    }
    for (const c of controls) c.addEventListener('change', apply);
    if (text) text.addEventListener('input', apply);
    apply();
  }
  initBank(document);
})();
