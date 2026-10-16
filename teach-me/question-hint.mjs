// Reset on every selection, including invalid links, so an old hint cannot linger.
export function setQuestionHint(details, question) {
 details.open=false;
 const text=typeof question?.hint==='string'?question.hint.trim():'';
 details.hidden=!text;
 details.dataset.questionHint=text?question.id:'';
 details.querySelector('[data-hint-text]').textContent=text;
 details.querySelector('summary').textContent=question?.part?`Hint for part ${question.part}`:'Hint';
}
