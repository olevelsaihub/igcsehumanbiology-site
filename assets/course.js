for(const input of document.querySelectorAll('[data-filter]')){
 const target=document.querySelector(input.dataset.filter),rows=[...target.querySelectorAll('[data-search]')],status=document.getElementById(input.dataset.status);
 input.addEventListener('input',()=>{const terms=input.value.toLowerCase().trim().split(/\s+/);let n=0;for(const row of rows){row.hidden=!terms.every(t=>row.dataset.search.toLowerCase().includes(t));if(!row.hidden)n++;}for(const group of target.querySelectorAll('[data-filter-group]'))group.hidden=![...group.querySelectorAll('[data-search]')].some(row=>!row.hidden);if(status)status.textContent=`${n} matching ${n===1?'entry':'entries'}`;});
}
for(const image of document.querySelectorAll('.question-img')){const unavailable=()=>{const box=image.closest('.question');box.querySelector('.q-fallback').hidden=false;box.querySelector('details').open=true;image.hidden=true;};image.addEventListener('error',unavailable);if(image.complete&&!image.naturalWidth)unavailable();}
for(const button of document.querySelectorAll('[data-print]'))button.addEventListener('click',()=>window.print());

// The three course views share the Human Biology home page and browser history.
const courseHome=document.querySelector('[data-course-home]');
if(courseHome){
 const views=[...courseHome.querySelectorAll('[data-course-view]')];
 const links=[...document.querySelectorAll('[data-course-link]')];
 const valid=['plans','types','practice'];
 function showCourseView(){
  const requested=new URLSearchParams(location.search).get('view');
  const view=valid.includes(requested)?requested:'plans';
  for(const panel of views)panel.hidden=panel.dataset.courseView!==view;
  for(const link of links){
   if(link.dataset.courseLink===view)link.setAttribute('aria-current','page');
   else link.removeAttribute('aria-current');
  }
  document.dispatchEvent(new CustomEvent('olv:course-view',{detail:{view,tab:location.hash.slice(1)||new URLSearchParams(location.search).get('tab')}}));
 }
 document.addEventListener('click',event=>{
  const link=event.target.closest('a[href]');
  if(!link)return;
  const target=new URL(link.href);
  if(target.origin!==location.origin||target.pathname!==location.pathname||!valid.includes(target.searchParams.get('view')))return;
  if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||event.button!==0)return;
  event.preventDefault();
  history.pushState(null,'',link.href);
  showCourseView();
  window.scrollTo({top:0,behavior:'instant'});
 });
 window.addEventListener('popstate',showCourseView);
 showCourseView();
}

// Native disclosure menus stay keyboard-accessible without a custom menu widget.
const navigationMenus=[...document.querySelectorAll('.nav-dropdown')];
for(const menu of navigationMenus)menu.addEventListener('toggle',()=>{
 if(menu.open)for(const other of navigationMenus)if(other!==menu)other.open=false;
});
document.addEventListener('click',event=>{
 for(const menu of navigationMenus)if(!menu.contains(event.target))menu.open=false;
});
document.addEventListener('keydown',event=>{
 if(event.key!=='Escape')return;
 const open=navigationMenus.find(menu=>menu.open);
 if(open){open.open=false;open.querySelector('summary').focus();}
});
// This remembers the last plan opened on this device, not learning progress.
try{
 const planLinks=[...document.querySelectorAll('.nav-menu a')].filter(a=>/\/plans\/[^/]+\/$/.test(new URL(a.href).pathname));
 const current=planLinks.find(a=>location.pathname===new URL(a.href).pathname||location.pathname===new URL(a.href).pathname+'index.html');
 if(current)localStorage.setItem('igcsehumanbiology-last-plan',new URL(current.href).pathname);
 const last=localStorage.getItem('igcsehumanbiology-last-plan'),saved=planLinks.find(a=>new URL(a.href).pathname===last),resume=document.querySelector('[data-resume-plan]');
 if(saved&&resume){
  resume.querySelector('[data-resume-title]').textContent=saved.textContent;
  const place=JSON.parse(localStorage.getItem('igcsehumanbiology-learning-place-v1')||'{}')[last];
  const target=new URL(saved.href);
  if(place?.typeId&&place?.blockId){target.searchParams.set('type',place.typeId);if(place.partId)target.searchParams.set('question',place.partId);target.hash=place.blockId;}
  resume.querySelector('[data-resume-link]').href=target.href;
  resume.querySelector('[data-resume-link]').firstChild.textContent=place?.typeId?'Continue learning ':'Open again ';
  resume.hidden=false;
 }
}catch{/* Plans and navigation remain usable when device storage is unavailable. */}

// Keep canonical Teach Me lessons available on full pages and AJAX study plans.
(() => {
  if (!document.querySelector('script[data-olv-english-videos]')) {
    const script = document.createElement('script');
    script.src = '/igcsehumanbiology/video-library/student-videos.js?v=91ddc1ee35';
    script.dataset.olvEnglishVideos = 'true';
    document.head.append(script);
  }
  for (const nav of document.querySelectorAll('.course-nav')) {
    if (nav.querySelector('[data-video-lessons]')) continue;
    const link = document.createElement('a');
    link.className = 'nav-primary'; link.dataset.videoLessons = '';
    link.href = '/igcsehumanbiology/video-library/lessons.html'; link.textContent = 'Video Lessons';
    nav.insertBefore(link, nav.querySelector('.nav-dropdown'));
  }
})();

// Student progress for teachers (where each student is, mastery results). Never changes the page.



