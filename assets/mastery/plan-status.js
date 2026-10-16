/* Shows each student's best block mastery score (saved in this browser) next to block check buttons. */
(function () {
  'use strict';
  function band(p) { return p === 100 ? ['mastered', 'Mastered'] : p >= 90 ? ['ready', 'Ready'] : p >= 80 ? ['nearly', 'Come back'] : ['not-yet', 'Not yet']; }
  function run() {
    var store = {};
    try { store = JSON.parse(localStorage.getItem('olv-hb-mastery-v1')) || {}; } catch (e) { /* storage blocked */ }
    document.querySelectorAll('[data-mastery-status]').forEach(function (el) {
      var r = store['block:' + el.getAttribute('data-mastery-status')];
      if (!r) return;
      var b = band(r.best);
      el.className = 'bm-chip ' + b[0];
      el.textContent = 'Best ' + r.best + '% · ' + b[1];
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
