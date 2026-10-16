/* Knowledge card interactions. Uses event delegation so cards loaded into the plan workspace work without re-initialising. */
(() => {
  'use strict';
  if (window.kcCardReady) return;
  window.kcCardReady = true;
  const all = (root, selector) => Array.from(root.querySelectorAll(selector));

  /* 1. Find the forces */
  function updateScene(scene) {
    const total = Number(scene.dataset.kcTotal || 0);
    const found = all(scene, '.kc-force.is-found:not(.is-given)').length;
    const count = scene.querySelector('[data-kc-found]');
    if (count) count.textContent = String(found);
    all(scene, '.kc-dots i').forEach((dot, index) => dot.classList.toggle('on', index < found));
    const done = found >= total;
    const next = scene.querySelector('[data-kc-next-scene]');
    if (next) next.hidden = !done;
    const showAll = scene.querySelector('[data-kc-reveal-all]');
    if (showAll) showAll.hidden = done;
    const explore = scene.closest('[data-kc-explore]');
    const tab = explore && all(explore, '[data-kc-tab]').find(item => item.dataset.kcTab === scene.dataset.kcScene);
    if (tab) tab.classList.toggle('is-done', done);
  }

  function showForce(force) {
    const scene = force.closest('[data-kc-scene]');
    if (!scene) return;
    scene.classList.add('has-started');
    if (!force.classList.contains('is-found')) {
      force.classList.add('is-found');
      force.setAttribute('aria-label', `${force.dataset.kcName}. Shown.`);
    }
    all(scene, '.kc-force').forEach(item => item.classList.toggle('is-active', item === force));
    all(scene, '[data-kc-answer]').forEach(line => {
      if (line.dataset.kcAnswer === force.dataset.kcForce) line.classList.add('is-found');
      line.classList.toggle('is-active', line.dataset.kcAnswer === force.dataset.kcForce);
    });
    all(scene, '[data-kc-detail]').forEach(detail => { detail.hidden = detail.dataset.kcDetail !== force.dataset.kcForce; });
    updateScene(scene);
  }

  function selectTab(tab, focus) {
    const explore = tab.closest('[data-kc-explore]');
    all(explore, '[data-kc-tab]').forEach(item => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    all(explore, '[data-kc-scene]').forEach(scene => { scene.hidden = scene.dataset.kcScene !== tab.dataset.kcTab; });
    if (focus) tab.focus();
  }

  function nextScene(button) {
    const scene = button.closest('[data-kc-scene]');
    const explore = scene.closest('[data-kc-explore]');
    const tabs = all(explore, '[data-kc-tab]');
    const index = tabs.findIndex(tab => tab.dataset.kcTab === scene.dataset.kcScene);
    if (index < tabs.length - 1) {
      selectTab(tabs[index + 1], true);
    } else {
      const following = explore.nextElementSibling;
      if (following) following.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /* 2. Who is pushing or pulling? */
  function toggleTest(button) {
    const section = button.closest('[data-kc-sources]');
    const testing = !section.classList.contains('is-testing');
    section.classList.toggle('is-testing', testing);
    button.setAttribute('aria-pressed', String(testing));
    all(section, '[data-kc-tile]').forEach(tile => tile.classList.remove('is-shown'));
  }

  /* 3. Words that score */
  function judgeWord(chip) {
    const section = chip.closest('[data-kc-words]');
    const ok = chip.dataset.kcOk === '1';
    chip.classList.add(ok ? 'is-yes' : 'is-no');
    const verdict = section.querySelector('[data-kc-verdict]');
    const word = document.createElement('b');
    word.textContent = `“${chip.textContent}”`;
    verdict.replaceChildren(word, document.createTextNode(chip.dataset.kcWhy));
    const checked = all(section, '.kc-chip.is-yes, .kc-chip.is-no').length;
    if (checked === Number(section.dataset.kcTotal)) verdict.append(document.createTextNode(' All words checked.'));
    verdict.className = `kc-verdict ${ok ? 'is-yes' : 'is-no'}`;
  }

  /* 5. Quick check */
  function quizParts(quiz) {
    return {
      items: all(quiz, '[data-kc-q]'),
      next: quiz.querySelector('[data-kc-qnext]'),
      end: quiz.querySelector('[data-kc-qend]'),
      bar: quiz.querySelector('[data-kc-qbar]'),
      pos: quiz.querySelector('[data-kc-qpos]'),
    };
  }

  function answer(option) {
    const item = option.closest('[data-kc-q]');
    const quiz = option.closest('[data-kc-quiz]');
    if (item.dataset.answered) return;
    item.dataset.answered = '1';
    const right = option.dataset.kcRight === '1';
    all(item, '.kc-opt').forEach(button => {
      button.disabled = true;
      if (button.dataset.kcRight === '1') button.classList.add('is-right');
    });
    if (!right) option.classList.add('is-wrong');
    const feedback = item.querySelector('.kc-qfb');
    feedback.textContent = right ? feedback.dataset.kcRightFb : feedback.dataset.kcWrongFb;
    feedback.className = `kc-qfb ${right ? 'is-yes' : 'is-no'}`;
    quiz.dataset.kcScore = String(Number(quiz.dataset.kcScore || 0) + (right ? 1 : 0));
    const { items, next, bar } = quizParts(quiz);
    const index = items.indexOf(item);
    bar.style.width = `${((index + 1) / items.length) * 100}%`;
    next.textContent = index === items.length - 1 ? 'See my score →' : 'Next question →';
    next.hidden = false;
  }

  function nextQuestion(button) {
    const quiz = button.closest('[data-kc-quiz]');
    const { items, next, end, pos } = quizParts(quiz);
    const index = items.findIndex(item => !item.hidden);
    items[index].hidden = true;
    next.hidden = true;
    if (index < items.length - 1) {
      items[index + 1].hidden = false;
      pos.textContent = String(index + 2);
      const text = items[index + 1].querySelector('.kc-qtext');
      text.tabIndex = -1;
      text.focus({ preventScroll: true });
      return;
    }
    const score = Number(quiz.dataset.kcScore || 0);
    const total = items.length;
    quiz.querySelector('[data-kc-score]').textContent = String(score);
    quiz.querySelector('[data-kc-score-msg]').textContent = score === total
      ? 'Excellent. You are ready for the real past-paper question.'
      : score >= total - 2
        ? 'Good. Read the ones you missed again, then try the real question.'
        : 'Go back over the card, then try this check again.';
    end.hidden = false;
  }

  function restartQuiz(button) {
    const quiz = button.closest('[data-kc-quiz]');
    const { items, next, end, bar, pos } = quizParts(quiz);
    quiz.dataset.kcScore = '0';
    items.forEach((item, index) => {
      item.hidden = index !== 0;
      delete item.dataset.answered;
      all(item, '.kc-opt').forEach(option => { option.disabled = false; option.classList.remove('is-right', 'is-wrong'); });
      const feedback = item.querySelector('.kc-qfb');
      feedback.textContent = '';
      feedback.className = 'kc-qfb';
    });
    bar.style.width = '0';
    pos.textContent = '1';
    next.hidden = true;
    end.hidden = true;
  }

  document.addEventListener('click', event => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target || !target.closest('[data-kc-card]')) return;
    const force = target.closest('.kc-force');
    if (force) return showForce(force);
    const line = target.closest('[data-kc-answer].is-found');
    if (line) {
      const scene = line.closest('[data-kc-scene]');
      const match = all(scene, '.kc-force').find(item => item.dataset.kcForce === line.dataset.kcAnswer);
      if (match) return showForce(match);
    }
    const tab = target.closest('[data-kc-tab]');
    if (tab) return selectTab(tab, false);
    const revealAll = target.closest('[data-kc-reveal-all]');
    if (revealAll) {
      const scene = revealAll.closest('[data-kc-scene]');
      const hidden = all(scene, '.kc-force:not(.is-found)');
      hidden.forEach(showForce);
      if (hidden[0]) showForce(hidden[0]);
      return;
    }
    const sceneButton = target.closest('[data-kc-next-scene]');
    if (sceneButton) return nextScene(sceneButton);
    const sym = target.closest('[data-kc-sym]');
    if (sym) {
      const box = sym.closest('[data-kc-formula]');
      all(box, '[data-kc-sym]').forEach(item => item.classList.toggle('is-active', item === sym));
      all(box, '[data-kc-rearr]').forEach(row => { row.hidden = row.dataset.kcRearr !== sym.dataset.kcSym; });
      return;
    }
    const step = target.closest('[data-kc-step]');
    if (step) {
      const steps = all(step.closest('[data-kc-example]'), 'li');
      const next = steps.find(item => item.hidden);
      if (next) next.hidden = false;
      const left = steps.filter(item => item.hidden).length;
      step.textContent = left === 1 ? 'Show the answer' : 'Show the next step';
      step.hidden = left === 0;
      return;
    }
    const keyword = target.closest('[data-kc-kw]');
    if (keyword) return keyword.setAttribute('aria-expanded', String(keyword.getAttribute('aria-expanded') !== 'true'));
    const test = target.closest('[data-kc-test]');
    if (test) return toggleTest(test);
    const tile = target.closest('[data-kc-tile]');
    if (tile && tile.closest('.is-testing')) return tile.classList.add('is-shown');
    const chip = target.closest('.kc-chip');
    if (chip) return judgeWord(chip);
    const option = target.closest('.kc-opt');
    if (option) return answer(option);
    const next = target.closest('[data-kc-qnext]');
    if (next) return nextQuestion(next);
    const restart = target.closest('[data-kc-qrestart]');
    if (restart) return restartQuiz(restart);
  });

  /* Lesson links such as #knowledge and #method open the collapsed card first. */
  function openFor(hash) {
    if (!hash || hash.length < 2) return;
    let target = null;
    try { target = document.querySelector(hash); } catch (error) { return; }
    const drop = target && (target.matches('[data-kc-card]') ? target.querySelector('[data-kc-drop]') : target.closest('[data-kc-drop]'));
    if (drop && !drop.open) { drop.open = true; target.scrollIntoView({ block: 'start' }); }
  }
  document.addEventListener('click', event => {
    const link = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null;
    if (link) openFor(link.getAttribute('href'));
  }, true);
  window.addEventListener('hashchange', () => openFor(location.hash));
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => openFor(location.hash));
  else openFor(location.hash);

  document.addEventListener('keydown', event => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target || !target.closest('[data-kc-card]')) return;
    if (target.matches('.kc-force') && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      showForce(target);
    } else if (target.matches('[data-kc-tab]') && (event.key === 'ArrowRight' || event.key === 'ArrowLeft')) {
      const tabs = all(target.closest('[role=tablist]'), '[data-kc-tab]');
      const index = tabs.indexOf(target) + (event.key === 'ArrowRight' ? 1 : -1);
      selectTab(tabs[(index + tabs.length) % tabs.length], true);
    }
  });
})();
