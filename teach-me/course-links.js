/* One context request; explicit stable associations, never filename guesses. */
(async()=>{
 const base='/igcsehumanbiology/teach-me/';
 const response=await fetch(base+'api.php?action=context',{credentials:'same-origin',cache:'no-store'});
 if(!response.ok)return;
 const context=await response.json(),ready=new Set(context.explanationTypes||[]);
 function attach(root){
  for(const group of root.querySelectorAll('[data-teach-type][data-question-id]')){
   if(group.dataset.mediaAttached)return;group.dataset.mediaAttached='true';
   if(!ready.has(group.dataset.teachType))continue;
   const link=document.createElement('a');link.className='button secondary self-explanation';
   link.href=base+'?'+new URLSearchParams({type:group.dataset.teachType,question:group.dataset.questionId,watch:'explanation'});
   link.textContent='Self-Explanatory';group.append(link);
  }
 }
 attach(document);
 new MutationObserver(()=>attach(document)).observe(document.body,{childList:true,subtree:true});
 if(['teacher','admin'].includes(context.role)){
  const nav=document.querySelector('.staff-nav');if(nav)nav.hidden=false;
 }
})().catch(()=>{});

// Student progress for teachers (where each student is). Never changes the page.
(function(){if(window.olvProgress||document.querySelector('script[data-olv-progress]'))return;var s=document.createElement('script');s.src='/igcsehumanbiology/assets/progress.js?v=ee951cb0d4';s.defer=true;s.setAttribute('data-olv-progress','');document.head.appendChild(s);})();

// Ask AI was removed. Browsers may still hold an older cached page pen that draws the button, so remove it here too.
(function(){function strip(){var h=document.getElementById('olevels-page-pencil'),r=h&&h.shadowRoot;if(r)r.querySelectorAll('.ask-ai,[data-action="ask-ai"]').forEach(function(b){b.remove();});}strip();window.addEventListener('load',strip);setTimeout(strip,1500);})();
