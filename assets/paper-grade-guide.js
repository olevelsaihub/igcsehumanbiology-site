(function (root) {
  'use strict';

  // Pearson International GCSE Human Biology 4HB1, June 2026 overall subject boundaries.
  // These apply to the named complete Paper 1 + Paper 2 pair, never to selected question parts.
  const boundaries = Object.freeze({
    standard: Object.freeze({9: 156, 8: 143, 7: 131, 6: 117, 5: 103, 4: 89, 3: 71, 2: 53, 1: 36}),
    regional: Object.freeze({9: 160, 8: 147, 7: 135, 6: 120, 5: 106, 4: 92, 3: 72, 2: 53, 1: 34})
  });

  function assessOfficialPair(variant, score) {
    const table = boundaries[variant];
    if (!table || !Number.isInteger(score) || score < 0 || score > 180) return null;
    const grade = [9, 8, 7, 6, 5, 4, 3, 2, 1].find(level => score >= table[level]) || 0;
    const secureGrade = [9, 8, 7, 6, 5, 4, 3, 2, 1].find(level => score >= table[level] + 10) || 0;
    const nextGrade = grade < 9 ? grade + 1 : null;
    return {
      variant, score, grade, secureGrade, nextGrade,
      nextMarks: nextGrade ? table[nextGrade] - score : 0,
      boundaries: table
    };
  }

  function describeCustomPaper(paper, types) {
    const topics = new Set();
    const difficultyMarks = {Easy: 0, Medium: 0, Difficult: 0, 'Very Difficult': 0};
    let total = 0;
    let legacyMarks = 0;
    for (const part of paper.parts || []) {
      const marks = Number(part.marks);
      if (!Number.isInteger(marks) || marks < 1) continue;
      total += marks;
      if (String(part.source || '').startsWith('4HB1-LEGACY-')) legacyMarks += marks;
      const type = types.get(part.typeKey);
      if (type?.topicId) topics.add(type.topicId);
      if (type?.difficulty in difficultyMarks) difficultyMarks[type.difficulty] += marks;
    }
    const filters = paper.filters || {};
    const focused = Boolean(filters.topic || filters.difficulty || filters.plan || filters.scopeMode) || total < 120 || topics.size < 5;
    return {total, topics: topics.size, difficultyMarks, legacyMarks, focused};
  }

  root.OlvPaperGradeGuide = Object.freeze({boundaries, assessOfficialPair, describeCustomPaper});
})(typeof window !== 'undefined' ? window : globalThis);
