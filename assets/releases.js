(()=>{'use strict';
if(!document.querySelector('link[data-release-style]')){const style=document.createElement('link');style.rel='stylesheet';style.href='/igcsehumanbiology/assets/releases.css?v=8798325891';style.setAttribute('data-release-style','');document.head.append(style);}
const base='/igcsehumanbiology/teach-me/api.php';
const adminRoot=document.querySelector('[data-release-admin]');
const header=document.querySelector('.ol-bar');
if(!header)return;
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
const date=s=>new Intl.DateTimeFormat(undefined,{dateStyle:'medium'}).format(new Date(s));
const slot=el('div','release-slot');
const trigger=el('button','release-trigger','New Release');trigger.type='button';trigger.setAttribute('aria-expanded','false');
const badge=el('span','release-badge');badge.hidden=true;trigger.append(badge);
const panel=el('section','release-panel');panel.hidden=true;panel.setAttribute('aria-label','New releases');
slot.append(trigger,panel);
const notice=el('div','release-notice');notice.hidden=true;notice.setAttribute('role','status');notice.setAttribute('aria-live','polite');
const noticeTitle=el('strong','release-notice-title','New Human Biology release');
const noticeText=el('span','release-notice-text');
const noticeOpen=el('button','release-notice-open','View release');noticeOpen.type='button';
const noticeDismiss=el('button','release-notice-dismiss','Dismiss');noticeDismiss.type='button';
notice.append(noticeTitle,noticeText,noticeOpen,noticeDismiss);
document.body.append(notice);
const account=header.querySelector('.top-nav');if(account)header.insertBefore(slot,account);else header.append(slot);
let state=null;
async function request(action,input){const opts=input===undefined?{credentials:'same-origin'}:{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json','X-CSRF-Token':state.csrf},body:JSON.stringify(input)};
 const response=await fetch(base+'?action=releases-'+encodeURIComponent(action),opts);let data;try{data=await response.json();}catch(_){throw Error('Release service did not respond.');}if(!response.ok)throw Error(data.error||'Release request failed.');return data;}
function summary(){if(!state)return;badge.hidden=state.role!=='student'||!state.unread;badge.textContent=String(state.unread);trigger.setAttribute('aria-label',state.role==='student'?`New Release: ${state.total} updates, ${state.unread} unread`:'Manage New Release updates');}
function studentPanel(){panel.replaceChildren();panel.append(el('h2','', 'New Release'),el('p','release-summary',`${state.total} ${state.total===1?'update':'updates'}${state.role==='student'?` · ${state.unread} unread`:''}`));
 if(!state.updates.length){panel.append(el('p','', 'No updates have been published yet.'));return;}
 for(const item of state.updates){const entry=el('article','release-entry');const button=el('button','',item.title);button.type='button';button.dataset.releaseId=item.id;button.setAttribute('aria-expanded','false');
  const meta=el('span','release-meta',state.role==='student'?`${date(item.publishedAt)} · ${item.read?'Read':'Unread'}`:date(item.publishedAt));if(state.role==='student'&&!item.read)meta.classList.add('release-unread');
  const body=el('p','release-body',item.body);body.hidden=true;
  button.addEventListener('click',async()=>{const opening=body.hidden;body.hidden=!opening;button.setAttribute('aria-expanded',String(opening));if(opening&&state.role==='student'&&!item.read){try{await request('read',{id:item.id});item.read=true;item.readAt=new Date().toISOString();state.unread=Math.max(0,state.unread-1);meta.textContent=`${date(item.publishedAt)} · Read`;meta.classList.remove('release-unread');summary();panel.querySelector('.release-summary').textContent=`${state.total} ${state.total===1?'update':'updates'} · ${state.unread} unread`;}catch(err){meta.textContent='Could not save read status. Try again.';}}});
  entry.append(button,meta,body);panel.append(entry);}
}
function adminPanel(){panel.replaceChildren();panel.append(el('h2','', 'New Release'),el('p','release-summary',`${state.total} published ${state.total===1?'update':'updates'}`));const a=el('a','','Create and manage releases →');a.href='/igcsehumanbiology/releases/';panel.append(a);}
function adminPage(){if(!adminRoot)return;adminRoot.replaceChildren();if(state.role!=='admin'){adminRoot.append(el('p','', 'Administrator access required.'));return;}
 const form=el('form');const heading=el('h2','', 'Publish an update');const hint=el('p','release-hint','Students will see this as text. Screenshots and images are not supported.');
 const titleLabel=el('label','','Title');titleLabel.htmlFor='release-title';const title=el('input');title.id='release-title';title.name='title';title.required=true;title.maxLength=160;
 const bodyLabel=el('label','','What changed?');bodyLabel.htmlFor='release-body';const body=el('textarea');body.id='release-body';body.name='body';body.required=true;body.maxLength=4000;
 const publish=el('button','','Publish to students');publish.type='submit';const status=el('p','release-status');status.setAttribute('role','status');
 form.append(heading,hint,titleLabel,title,bodyLabel,body,publish,status);
 form.addEventListener('submit',async ev=>{ev.preventDefault();publish.disabled=true;status.textContent='Publishing…';try{await request('create',{title:title.value,body:body.value});form.reset();state=await request('list');summary();adminPanel();adminPage();}catch(err){status.textContent=err.message;status.setAttribute('role','alert');publish.disabled=false;}});
 const list=el('section','release-admin-list');list.append(el('h2','', 'Published updates'));
 const active=state.updates.filter(x=>x.state==='published');if(!active.length)list.append(el('p','', 'No updates published yet.'));
 for(const item of active){const entry=el('article','release-entry');entry.append(el('h3','',item.title),el('p','release-meta',`${date(item.publishedAt)} · Read by ${item.readers} ${item.readers===1?'student':'students'}`),el('p','release-body',item.body));
  const archive=el('button','release-archive','Archive');archive.type='button';archive.addEventListener('click',async()=>{archive.disabled=true;try{await request('archive',{id:item.id});state=await request('list');summary();adminPanel();adminPage();}catch(err){status.textContent=err.message;status.setAttribute('role','alert');archive.disabled=false;}});entry.append(archive);list.append(entry);}
 adminRoot.append(form,list);}
trigger.addEventListener('click',()=>{panel.hidden=!panel.hidden;trigger.setAttribute('aria-expanded',String(!panel.hidden));});
document.addEventListener('click',ev=>{if(!slot.contains(ev.target)){panel.hidden=true;trigger.setAttribute('aria-expanded','false');}});
document.addEventListener('keydown',ev=>{if(ev.key==='Escape'){panel.hidden=true;trigger.setAttribute('aria-expanded','false');}});
let noticeReleaseId=null;
noticeOpen.addEventListener('click',event=>{
 event.stopPropagation();notice.hidden=true;panel.hidden=false;trigger.setAttribute('aria-expanded','true');
 const button=[...panel.querySelectorAll('button[data-release-id]')].find(item=>item.dataset.releaseId===noticeReleaseId);
 if(button){button.focus();if(button.getAttribute('aria-expanded')!=='true')button.click();}
 else trigger.focus();
});
noticeDismiss.addEventListener('click',()=>{notice.hidden=true;});
let checking=false;
async function checkForUpdates(){
 if(!state||state.role!=='student'||document.hidden||checking)return;
 checking=true;
 try{
  const latest=await request('list');
  const known=new Set(state.updates.map(item=>item.id));
  const added=latest.updates.filter(item=>!known.has(item.id));
  const changed=added.length||latest.unread!==state.unread||latest.total!==state.total;
  if(changed){
   const expanded=new Set([...panel.querySelectorAll('button[data-release-id][aria-expanded="true"]')].map(button=>button.dataset.releaseId));
   state=latest;summary();studentPanel();
   for(const button of panel.querySelectorAll('button[data-release-id]')){
    if(expanded.has(button.dataset.releaseId)){
     button.setAttribute('aria-expanded','true');
     const body=button.parentElement.querySelector('.release-body');if(body)body.hidden=false;
    }
   }
  }
  if(added.length){noticeReleaseId=added[0].id;noticeText.textContent=added.length===1?added[0].title:`${added.length} new updates are ready to read.`;notice.hidden=false;}
 }catch{/* Keep the current release list and retry at the next check. */}
 finally{checking=false;}
}
request('list').then(data=>{state=data;summary();if(state.role==='admin')adminPanel();else studentPanel();adminPage();
 if(state.role==='student'){
  setInterval(checkForUpdates,30000);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkForUpdates();});
  window.addEventListener('focus',checkForUpdates);
 }
}).catch(err=>{trigger.hidden=true;if(adminRoot){adminRoot.replaceChildren(el('p','release-status',err.message));}});
})();
