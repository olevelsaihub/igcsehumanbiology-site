(() => {
  function focusPart() {
    const id = decodeURIComponent(location.hash.slice(1));
    const part = id.startsWith('part-') ? id.slice(5) : '';
    document.querySelectorAll('.practice-source:not([data-fixed-focus]) [data-focus-part]').forEach(box => {
      box.hidden = box.dataset.focusPart !== part;
    });
    const item = document.getElementById(id);
    const notice = document.querySelector('[data-practice-focus-notice]');
    if (notice) {
      notice.hidden = !item?.dataset.questionPart;
      notice.textContent = item?.dataset.questionPart ? `Attempt ${item.querySelector('strong').textContent}. The red boundary marks the assigned part; other content is provided for context.` : '';
    }
  }
  addEventListener('hashchange', focusPart);
  focusPart();
})();
