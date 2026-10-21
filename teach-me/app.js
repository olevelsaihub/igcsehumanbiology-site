import {mountLearning,clearLearning} from './learning.mjs?v=91ddc1ee35';
import {TeachingAPI} from './client.mjs?v=91ddc1ee35';
import {InkBoard,Recorder,LocalRecordings,inkAt,paint,formatTime,formatBytes} from './core.mjs?v=91ddc1ee35';
import {StepPlayer} from './step-player.mjs?v=91ddc1ee35';
import {VideoStep} from './video-step.mjs?v=91ddc1ee35';
import {languageOptions,selectLanguage,matchingStepStart} from './language-tracks.mjs?v=91ddc1ee35';
import {questionLayout,watermarks,nextBoardHeight,viewportAt,cursorAt,paintCursor,MAX_BOARD_HEIGHT} from './board-layout.mjs?v=91ddc1ee35';
import {setQuestionHint} from './question-hint.mjs?v=91ddc1ee35';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const api=new TeachingAPI(),recorder=new Recorder(),drafts=new LocalRecordings();
let context,catalog,type,question,entries=[],pending=null,dirty=false,sequence=null,playingTake=null,frame=0,urls=[],libraryGeneration=0,playerGeneration=0,saving=false,micTest=null,micTimer=null;
let requestedExplanationType=null;
let playbackActionGeneration=0,playbackAccessCheck=null;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const isTeacher=()=>context&&context.role!=='student';
const toast=s=>{const t=$('#toast');t.textContent=s;t.hidden=false;setTimeout(()=>t.hidden=true,5500);};
const explanationChoice=document.createElement('dialog');explanationChoice.id='explanation-choice';explanationChoice.className='small-dialog';explanationChoice.setAttribute('aria-labelledby','explanation-choice-title');
explanationChoice.innerHTML='<div class="section-heading"><h2 id="explanation-choice-title">Choose an explanation</h2><button id="close-explanation-choice" class="icon-button" aria-label="Close explanation choices">✕</button></div><p id="explanation-choice-type"></p><div id="explanation-choice-list"></div>';
document.body.append(explanationChoice);$('#close-explanation-choice').onclick=closePlayer;explanationChoice.oncancel=e=>{e.preventDefault();closePlayer();};
function chooseExplanation(key){
 $('#explanation-choice-type').textContent=`${catalog.types[key].label} · ${catalog.types[key].title}`;
 $('#explanation-choice-list').innerHTML=entries.map(t=>`<article class="recording-row"><div class="recording-info"><strong>${t.sourceKind==='self'?'Machine explanation':'Teacher recording'}</strong><p>${esc(t.title)}</p><p>${formatTime(t.duration)} · ${t.steps} numbered steps</p></div><button class="primary" data-explanation-id="${esc(t.id)}">Watch</button></article>`).join('');
 for(const button of explanationChoice.querySelectorAll('[data-explanation-id]'))button.onclick=()=>{explanationChoice.close();watch(button.dataset.explanationId,key);};
 if(!explanationChoice.open)explanationChoice.showModal();
}
class TeachingBoard extends InkBoard {
 draw(){paint(this.ctx,[...(this.background||[]),...this.strokes]);}
 snapshot(){this.change({kind:'snapshot',t:Math.round(this.time()),strokes:structuredClone([...(this.background||[]),...this.strokes])});this.draw();}
}
let layoutReady=false,questionSize=null,questionCuts=[],layoutGeneration=0,lastViewport=0;
const board=new TeachingBoard($('#board'),{time:()=>recorder.state==='recording'?recorder.clock.read():0,change:e=>{dirty=true;recorder.add(e);$('#split-question').disabled=board.strokes.length>0||recorder.state!=='idle';},blocked:()=>!['idle','recording'].includes(recorder.state)});
function stopPencil(){window.OLevelsPencil?.deactivate();}
function renderSelectedQuestion(){
 setQuestionHint($('#selected-question-hint'),question);
 const link=$('#selected-question-link');link.hidden=!question;
 if(question){link.href=question.bank;link.textContent='Open original question · '+question.source;}
 else{link.removeAttribute('href');link.textContent='';}
}
function questionSelect(){question=type.questions[Number($('#question-select').value)||0];renderSelectedQuestion();if(question){const u=new URL(location.href);u.searchParams.set('question',question.id);history.replaceState(null,'',u);}}
function selectType(key,questionId,watchExplanation=false){
 type=catalog.types[key];if(!type)return;
 if(questionId&&!type.questions.some(q=>q.id===questionId)){$('#connection').textContent='This question is not associated with the selected type. No replacement question has been selected.';$('#question-select').replaceChildren();question=null;renderSelectedQuestion();return;}
 ++playerGeneration;requestedExplanationType=watchExplanation?key:null;
 $('#type-select').value=key;$('#type-title').textContent=`${type.label} · ${type.title}`;$('#topic-label').textContent=type.topicName;$('#type-bank').href=type.bank;
 $('#question-select').innerHTML=type.questions.map((q,i)=>`<option value="${i}">${esc(q.source)}</option>`).join('');
 const qi=type.questions.findIndex(q=>q.id===questionId);$('#question-select').value=String(Math.max(0,qi));questionSelect();
 const url=new URL(location.href);url.searchParams.set('type',key);if(questionId)url.searchParams.set('question',questionId);else url.searchParams.delete('question');if(watchExplanation)url.searchParams.set('watch','explanation');else url.searchParams.delete('watch');history.replaceState(null,'',url);refreshLibrary();
}
function typeOptions(search=''){
 const keys=Object.keys(catalog.types).filter(k=>{const t=catalog.types[k];return `${t.label} ${t.title} ${t.topicName}`.toLowerCase().includes(search.toLowerCase());});
 $('#type-select').innerHTML=keys.map(k=>`<option value="${esc(k)}">${esc(catalog.types[k].label+' · '+catalog.types[k].title)}</option>`).join('');
 if(type&&keys.includes(type.typeKey))$('#type-select').value=type.typeKey;
}
async function refreshLibrary(){
 if(!context||!type)return;const generation=++libraryGeneration,key=type.typeKey;
 try{
  const value=await api.call('list',null,{type:key});if(generation!==libraryGeneration)return;entries=value.recordings;
  $('#recording-list').innerHTML=entries.length?entries.map(t=>`<article class="recording-row"><div class="recording-info"><strong>${esc(t.title)}</strong><p>${t.sourceKind==='self'?'Self-explanation':'Teacher recording'} · ${formatTime(t.duration)} · ${t.steps} numbered steps</p></div><button class="primary" data-play="${t.id}">▷ Watch</button>${t.canArchive?`<button class="text-button" data-archive="${t.id}">Archive</button>`:''}</article>`).join(''):`<div class="empty-state">No explanation has been published for this type yet.${isTeacher()?' Use Teach This to add the first one.':''}</div>`;
  $$('[data-play]').forEach(b=>b.onclick=()=>watch(b.dataset.play));
  $$('[data-archive]').forEach(b=>b.onclick=async()=>{if(!confirm('Archive this explanation so it no longer appears for students?'))return;try{await api.call('archive',{id:b.dataset.archive});await refreshLibrary();}catch(e){toast(e.message);}});
  if(requestedExplanationType===key){
   if(entries.length){requestedExplanationType=null;if(entries.length===1)await watch(entries[0].id,key);else chooseExplanation(key);}
   else{const note=document.createElement('p');note.className='notice';note.setAttribute('role','status');note.textContent='An explanation for this type has not been published yet.';$('#recording-list').prepend(note);}
  }
 }catch(e){if(generation!==libraryGeneration)return;entries=[];$('#recording-list').innerHTML=`<div class="empty-state ${e.status===423?'':'error'}">${esc(e.message)}</div>`;if(!isTeacher()&&!pending&&(playingTake||explanationChoice.open))closePlayer();}
}
function boardHeight(height){$('#board').height=height;$('.board-paper').style.setProperty('--board-ratio',`1400 / ${height}`);board.draw();}
function arrangeQuestion(){const layout=questionLayout(question,questionSize.width,questionSize.height,questionCuts);board.background=layout.strokes;boardHeight(layout.height);$('#board-scroll').scrollTop=0;layoutReady=true;recorderChanged();}
function prepareQuestion(){
 const generation=++layoutGeneration;layoutReady=false;questionSize=null;questionCuts=[];board.background=[];boardHeight(4200);$('#board-scroll').scrollTop=0;$('#teacher-pointer').hidden=true;recorderChanged();
 const img=$('#board-question');img.onload=()=>{if(generation!==layoutGeneration)return;questionSize={width:img.naturalWidth,height:img.naturalHeight};try{arrangeQuestion();}catch(e){$('#studio-message').textContent=e.message;}};
 img.onerror=()=>{if(generation===layoutGeneration)$('#studio-message').textContent='The question image could not load. Close and reopen this board to retry.';};img.src=question.image;
}
function openStudio(){
 if(!isTeacher()||!question)return;stopPencil();closePlayer();pending=null;dirty=false;board.reset();recorder.reset();
 $('#studio-title').textContent=question.title;$('#studio-type').textContent=question.type+' · TEACH THIS';$('#board-source').textContent=question.source;prepareQuestion();$('#linked-type').textContent=question.type+' · '+question.title;$('#studio-message').textContent='';$('#studio').showModal();
}
function stopMicTest(){if(micTest)micTest.getTracks().forEach(t=>t.stop());micTest=null;clearTimeout(micTimer);$('#mic-label').textContent='Microphone off';}
async function testMic(){
 stopMicTest();try{micTest=await navigator.mediaDevices.getUserMedia({audio:$('#mic-device').value?{deviceId:{exact:$('#mic-device').value}}:true,video:false});$('#mic-label').textContent='Microphone connected · speak to check input';const ac=new AudioContext(),source=ac.createMediaStreamSource(micTest),analyser=ac.createAnalyser();source.connect(analyser);const data=new Uint8Array(analyser.fftSize);const draw=()=>{if(!micTest){ac.close();$('#mic-level').value=0;return;}analyser.getByteTimeDomainData(data);$('#mic-level').value=Math.min(1,Math.sqrt(data.reduce((s,n)=>s+(n-128)**2,0)/data.length)/45);requestAnimationFrame(draw);};draw();micTimer=setTimeout(stopMicTest,15000);const devices=await navigator.mediaDevices.enumerateDevices();$('#mic-device').innerHTML='<option value="">System default microphone</option>'+devices.filter(d=>d.kind==='audioinput').map(d=>`<option value="${esc(d.deviceId)}">${esc(d.label||'Microphone')}</option>`).join('');}catch(e){$('#studio-message').textContent='Microphone unavailable. Check Chrome permission and the selected device, or record without voice.';}
}
function recorderChanged(){
 const state=recorder.state,active=state==='recording',paused=state==='paused';
 $('#session-status').textContent=active?'● Recording':paused?`Step ${recorder.steps.length} complete · paused`:state==='review'?'Ready to preview and save':state==='idle'?'Whiteboard · not recording':'Preparing…';
 $('#start-record').disabled=state!=='idle'||!layoutReady;$('#add-space').disabled=!layoutReady||!['idle','recording'].includes(state)||$('#board').height>=MAX_BOARD_HEIGHT;$('#split-question').disabled=state!=='idle'||!layoutReady||board.strokes.length>0;$('#pause-record').disabled=!active&&!paused;$('#stop-record').disabled=!active&&!paused;$('#pause-record').textContent=paused?'▷ START NEXT STEP':'Ⅱ PAUSE — END THIS STEP';
 $('#record-step-status').textContent=state==='review'?`${recorder.steps.length} saved steps`:paused?`Step ${recorder.steps.length} complete`:`Step ${recorder.steps.length+1}`;
 $('#record-hint').textContent=paused?'Students stop here and choose Repeat or Next. Start the next step when you are ready.':active?'Press PAUSE to finish this step. The waiting time will not be recorded.':'Use the board freely. Recording starts only when you press Start.';
 $('#review-controls').hidden=state!=='review';$$('#use-mic,#mic-device,#test-mic').forEach(el=>el.disabled=state!=='idle');$$('.board-toolbar button,.board-toolbar input').forEach(el=>el.disabled=!['idle','recording'].includes(state));
 if(state==='review'){
  pending={id:crypto.randomUUID(),kind:'board',sourceKind:'teacher',boardHeight:$('#board').height,sceneOwnsQuestion:true,typeKey:type.typeKey,question:structuredClone(question),title:question.title+' — explanation',duration:recorder.duration,events:structuredClone(recorder.events),steps:structuredClone(recorder.steps),ownerUid:context.uid};
  $('#take-title').value=pending.title;$('#review-step-list').innerHTML=pending.steps.map((s,i)=>`<label class="field-label">Step ${i+1}<input data-step-title="${i}" maxlength="200" value="${esc(s.title)}"></label>`).join('');
  const bytes=pending.steps.reduce((n,s)=>n+(s.audio?.size||0),0)+new Blob([JSON.stringify(pending.events)]).size;
  $('#take-size').textContent=`${formatTime(pending.duration)} · ${formatBytes(bytes)} · ${pending.steps.length} steps`;
  drafts.put(pending).catch(()=>$('#studio-message').textContent='Automatic draft recovery is unavailable. Keep this page open until your take is saved.');
 }
}
function details(){if(!pending)return;pending.title=$('#take-title').value.trim()||pending.title;$$('[data-step-title]').forEach(e=>pending.steps[Number(e.dataset.stepTitle)].title=e.value.trim()||`Step ${Number(e.dataset.stepTitle)+1}`);}
async function saveTake(take,message){
 saving=true;try{await drafts.put(take).catch(()=>{});await api.publish(take,n=>{message.textContent=`Uploading ${Math.round(n*100)}%… Keep this page open.`;});await drafts.delete(take.id).catch(()=>{});message.textContent='Published. Students can find this recording through its question type.';await refreshLibrary();return true;}catch(e){message.textContent=e.message+' Your take has not been discarded.';return false;}finally{saving=false;}
}
async function watch(id,expectedType=null){const generation=++playerGeneration;try{const take=await api.call('manifest',null,{id});if(generation!==playerGeneration)return;if(expectedType&&take.typeKey!==expectedType)throw Error('The explanation for this type is unavailable. Refresh to try again.');openPlayer(take);}catch(e){if(generation!==playerGeneration)return;toast(e.message);refreshLibrary();}}
function stopPlayback(){clearLearning();cancelAnimationFrame(frame);sequence?.dispose();sequence=null;urls.forEach(URL.revokeObjectURL);urls=[];const v=$('#video-player');v.pause();v.removeAttribute('src');v.load();playingTake=null;}
function closePlayer(){++playerGeneration;++playbackActionGeneration;playbackAccessCheck=null;requestedExplanationType=null;stopPlayback();$('#player').close();explanationChoice.close();}
async function guardedPlayback(action){
 const current=sequence,take=playingTake,operation=++playbackActionGeneration;if(!current||!take)return;
 if(isTeacher())return action(current);
 // A loaded/buffered video must not bypass a restriction added while it was paused.
 current.pause();$('#player-message').textContent='Checking video access…';
 if(playbackAccessCheck?.player!==current)playbackAccessCheck={player:current,promise:api.call('list',null,{type:take.typeKey})};
 const check=playbackAccessCheck;
 try{
  const library=await check.promise;if(current!==sequence||operation!==playbackActionGeneration||document.hidden)return;
  if(!library.recordings.some(r=>r.id===take.id))throw Error('This explanation is no longer available. Refresh the list to choose an available recording.');
  $('#player-message').textContent='';return await action(current);
 }catch(e){if(current!==sequence||operation!==playbackActionGeneration)return;closePlayer();toast(e.message);refreshLibrary();}
 finally{if(playbackAccessCheck===check)playbackAccessCheck=null;}
}
function renderPlayer(p){
 $('#step-number').textContent=`Step ${p.step.number} of ${p.steps.length}`;$('#step-name').textContent=p.step.title;$('#step-select').value=String(p.index);$('#next-step').disabled=p.index>=p.steps.length-1;$('#step-complete').hidden=!p.finished;$('#step-complete').textContent=p.index===p.steps.length-1?'Explanation complete. Repeat a step whenever you need.':`Step ${p.step.number} complete. Repeat it or continue to the next step.`;$('#play-pause').textContent=p.playing?'Ⅱ Pause':p.finished?'↶ Repeat step':'▷ Play';$('#play-pause').setAttribute('aria-label',p.playing?'Pause explanation':'Play this step');$('#seek').value=p.time;$('#play-time').textContent=formatTime(p.time);
 if(playingTake?.kind==='board'){const ctx=$('#replay-board').getContext('2d');paint(ctx,inkAt(playingTake.events,p.time*1000));paintCursor(ctx,cursorAt(playingTake.events,p.time*1000));if((playingTake.boardHeight||1000)>1000){const surface=$('#replay-surface'),paper=$('.replay-paper');surface.scrollTop=viewportAt(playingTake.events,p.time*1000,playingTake.boardHeight)*paper.clientWidth/1400;}}
}
function animate(){if(sequence){renderPlayer(sequence);if(sequence.playing)frame=requestAnimationFrame(animate);}}
function videoStatus(){
 const v=$('#video-player'),label=$('#video-loading');if(!label)return;
 const busy=playingTake?.kind==='video'&&!v.error&&(v.readyState<2||v.seeking);
 label.hidden=!busy;label.textContent=v.seeking?'Loading step…':'Loading video…';v.setAttribute('aria-busy',String(!!busy));
}
for(const event of ['loadstart','loadedmetadata','loadeddata','canplay','seeking','seeked','waiting','playing','error','emptied'])$('#video-player').addEventListener(event,videoStatus);
function openPlayer(take,preview=false,language){
 take=selectLanguage(take,language);
 setQuestionHint($('#player-question-hint'),catalog.types[take.typeKey]?.questions.find(q=>q.id===take.question?.id));
 explanationChoice.close();stopPencil();stopPlayback();playingTake=take;$('#replay-board').height=take.boardHeight||1000;$('#player').classList.toggle('long-board',(take.boardHeight||1000)>1000);$('.replay-paper').style.setProperty('--board-ratio',`1400 / ${take.boardHeight||1000}`);$('#replay-surface').scrollTop=0;$('#player-title').textContent=take.title;$('#player-tag').textContent=preview?'PREVIEW YOUR TAKE':take.sourceKind==='self'?'SELF-EXPLANATION':'TEACHER RECORDING';$('#player-context').textContent=`Recording example: ${take.question.source}${question&&question.id!==take.question.id?' · Your selected question remains '+question.source:''}`;$('#player-message').textContent='';$('#chapter-nav').hidden=true;$('#stream-player').hidden=true;$('#replay-surface').hidden=take.kind!=='board';$('#video-player').hidden=take.kind!=='video';$('#step-controls').hidden=false;$('#replay-controls').hidden=false;$('#replay-question').src=take.question.image;$('#replay-question').hidden=!!take.sceneOwnsQuestion;$('#replay-board').classList.toggle('full-scene',!!take.sceneOwnsQuestion);$('#replay-surface').classList.toggle('full-scene',!!take.sceneOwnsQuestion);$('#play-duration').textContent=formatTime(take.duration);$('#seek').max=take.duration;$('#pause-each-step').checked=true;$('#play-speed').value='1';$('#play-audio-label').textContent=take.kind==='video'?'Video explanation':'Voice + whiteboard';$('#add-take').hidden=!isTeacher();$('#player-playlist').replaceChildren();
 const steps=take.steps.map(s=>({...s,audioURL:s.audio?.size?(urls.push(URL.createObjectURL(s.audio)),urls.at(-1)):s.audioURL}));
 $('#step-select').innerHTML=steps.map((s,i)=>`<option value="${i}">Step ${s.number} · ${esc(s.title)}</option>`).join('');
 const languages=languageOptions(take);$('#language-track-label').hidden=languages.length<2;$('#language-track').innerHTML=languages.map(l=>`<option value="${l}">${l==='ur'?'اردو + English':'English'}</option>`).join('');$('#language-track').value=take.language||'en';
 prepareVideoResources(take);mountLearning(take);
 const videoURL=take.file?(urls.push(URL.createObjectURL(take.file)),urls.at(-1)):take.url;
 sequence=new StepPlayer(steps,{...(take.kind==='video'?{createAudio:()=>{const step=steps[sequence?.index||0];return new VideoStep($('#video-player'),videoURL,step.start,step.end);}}:{}),onChange:p=>{cancelAnimationFrame(frame);renderPlayer(p);if(p.playing)frame=requestAnimationFrame(animate);},onError:s=>$('#player-message').textContent=s});
 renderPlayer(sequence);videoStatus();if(!$('#player').open)$('#player').showModal();$('#player').scrollTop=0;
}
function prepareVideoResources(take){
 const video=$('#video-player');video.crossOrigin='anonymous';video.querySelectorAll('track').forEach(t=>t.remove());
 $('#video-resources').hidden=!(take.captionsURL||take.transcriptURL);$('#captions-label').hidden=!take.captionsURL;$('#show-captions').checked=false;
 const panel=$('#transcript-panel');panel.open=false;panel.hidden=!take.transcriptURL;panel.dataset.url=take.transcriptURL||'';delete panel.dataset.loaded;$('#transcript-text').replaceChildren();$('#transcript-text').lang=take.language||'en';
 if(take.captionsURL){const track=document.createElement('track');track.kind='captions';track.label=take.captionLabel||'English';track.srclang=take.language||'en';track.default=false;track.src=take.captionsURL;video.append(track);if(track.track)track.track.mode='hidden';}
}
$('#show-captions').onchange=e=>{for(const track of $('#video-player').textTracks)track.mode=e.target.checked?'showing':'hidden';};
$('#language-track').onchange=e=>{
 const language=e.target.value;
 guardedPlayback(async current=>{
  const take=playingTake,index=current.index,rate=current.rate,guided=current.guided,captions=$('#show-captions').checked;
  openPlayer(take,false,language);sequence.guided=guided;sequence.setRate(rate);$('#play-speed').value=String(rate);$('#pause-each-step').checked=guided;
  await sequence.seek(matchingStepStart(playingTake,index),false);
  $('#show-captions').checked=captions;$('#show-captions').onchange({target:$('#show-captions')});
 });
};
$('#transcript-panel').ontoggle=async()=>{
 const panel=$('#transcript-panel'),url=panel.dataset.url,id=playingTake?.id;if(!panel.open||!url||panel.dataset.loaded===url)return;
 const target=$('#transcript-text');target.textContent='Loading transcript…';
 try{const response=await fetch(url,{credentials:'same-origin',cache:'no-store'});if(!response.ok)throw Error('The transcript could not load. Close and reopen it to retry.');const text=await response.text();if(playingTake?.id!==id||panel.dataset.url!==url)return;target.replaceChildren();for(const line of text.split('\n')){if(!line.trim())continue;const node=document.createElement(line.startsWith('## ')?'h4':line.startsWith('# ')?'h3':'p');node.dir='auto';node.textContent=line.replace(/^#{1,2} /,'');target.append(node);}panel.dataset.loaded=url;
 }catch(e){if(playingTake?.id===id)target.textContent=e.message;}
};
async function loadRoster(){
 const key=$('#access-class').value;$('#roster').innerHTML='<legend>Choose individual students</legend>';$('#hide-videos').disabled=true;
 if(!key){$('#access-message').textContent='No active Firebase topics linked to the Human Biology course were found. Try Refresh class topics.';return;}
 try{const value=await api.call('roster',null,{class:key});if(key!==$('#access-class').value)return;$('#roster').innerHTML='<legend>Choose individual students</legend>'+value.students.map(s=>`<label><input type="checkbox" value="${esc(s)}"> ${esc(s)}</label>`).join('');$('#hide-videos').disabled=false;$('#access-message').textContent='';}catch(e){$('#access-message').textContent=e.message;}
}
async function restrictions(){try{const r=await api.call('restrictions');$('#restrictions-list').innerHTML=r.restrictions.length?r.restrictions.map(v=>`<article><div><strong>${esc(v.class_key)}</strong><p>${esc(v.student_key||'Whole class')} · ${esc(v.type_key||(v.topic_id?'Topic '+v.topic_id:'All portal videos'))}<br>Returns ${new Date(Number(v.expires_at)*1000).toLocaleString()}</p></div><button class="secondary" data-restore="${v.id}">Enable now</button></article>`).join(''):'<p>No active hiding periods.</p>';$$('[data-restore]').forEach(b=>b.onclick=async()=>{try{await api.call('restore',{id:b.dataset.restore});restrictions();}catch(e){toast(e.message);}});}catch(e){$('#access-message').textContent=e.message;}}
let lastPointerTime=0,lastPointer=null;
$('#board').addEventListener('pointermove',e=>{const point=board.point(e),marker=$('#teacher-pointer');point.x=Math.max(0,Math.min(1400,point.x));point.y=Math.max(0,Math.min($('#board').height,point.y));marker.hidden=false;marker.style.left=(point.x/1400*100)+'%';marker.style.top=(point.y/$('#board').height*100)+'%';if(recorder.state!=='recording')return;const now=recorder.clock.read();if(lastPointer&&(now-lastPointerTime<60||Math.hypot(point.x-lastPointer.x,point.y-lastPointer.y)<3))return;lastPointerTime=now;lastPointer=point;recorder.add({kind:'cursor',t:Math.round(now),x:point.x,y:point.y,visible:true});});
$('#board').addEventListener('pointerleave',()=>{$('#teacher-pointer').hidden=true;if(recorder.state==='recording'&&lastPointer)recorder.add({kind:'cursor',t:Math.round(recorder.clock.read()),x:lastPointer.x,y:lastPointer.y,visible:false});lastPointer=null;});
function recordViewport(){if(recorder.state!=='recording')return;const surface=$('#board-scroll'),paper=$('.board-paper');recorder.add({kind:'viewport',t:Math.round(recorder.clock.read()),y:Math.min($('#board').height,Math.max(0,surface.scrollTop*1400/Math.max(1,paper.clientWidth)))});}
$('#board-scroll').addEventListener('scroll',()=>{if(performance.now()-lastViewport<100)return;lastViewport=performance.now();recordViewport();});
$('#add-space').onclick=()=>{if(!['idle','recording'].includes(recorder.state))return;board.finish();const old=$('#board').height,height=nextBoardHeight(old);if(height===old)return;board.background.push(...watermarks(old,height));boardHeight(height);board.snapshot();$('#board-scroll').scrollTop=(old-400)*$('.board-paper').clientWidth/1400;recordViewport();recorderChanged();};
function showCuts(){const target=$('#question-cut-target');for(const line of target.querySelectorAll('.question-cut'))line.remove();questionCuts.forEach(y=>{const line=document.createElement('span');line.className='question-cut';line.style.top=(y*100)+'%';line.textContent='Working space goes here';target.append(line);});$('#cut-count').textContent=questionCuts.length?`${questionCuts.length} split points · generous writing space after every section`:'Click between parts (a), (b), (c) to insert working space.';}
$('#split-question').onclick=()=>{if(recorder.state!=='idle'||board.strokes.length)return;$('#question-cut-image').src=question.image;showCuts();$('#question-layout').showModal();};
$('#question-cut-target').onclick=e=>{const r=$('#question-cut-image').getBoundingClientRect(),y=(e.clientY-r.top)/r.height;if(y<.025||y>.975)return;const nearby=questionCuts.findIndex(v=>Math.abs(v-y)<.025);if(nearby>=0)questionCuts.splice(nearby,1);else questionCuts.push(y);showCuts();};
$('#reset-cuts').onclick=()=>{questionCuts=[];showCuts();};$('#close-layout').onclick=()=>$('#question-layout').close();$('#apply-layout').onclick=()=>{try{arrangeQuestion();$('#question-layout').close();}catch(e){$('#cut-count').textContent=e.message;}};
$('#type-search').oninput=e=>typeOptions(e.target.value);$('#type-select').onchange=e=>selectType(e.target.value);$('#question-select').onchange=questionSelect;$('#refresh-library').onclick=refreshLibrary;$('#teach-question').onclick=openStudio;
$('#close-studio').onclick=()=>{if(saving||!['idle','review'].includes(recorder.state)){$('#studio-message').textContent='Stop the recording before closing.';return;}if((pending||dirty)&&!confirm('Close the whiteboard? Your recorded draft is kept on this device until you publish or discard it.'))return;stopMicTest();recorder.reset();pending=null;dirty=false;$('#studio').close();};$('#studio').oncancel=e=>{e.preventDefault();$('#close-studio').click();};
recorder.addEventListener('change',recorderChanged);recorder.addEventListener('notice',e=>$('#studio-message').textContent=e.detail);
$('#start-record').onclick=async()=>{stopMicTest();board.finish();try{lastPointerTime=0;lastPointer=null;await recorder.start($('#use-mic').checked,[...board.background,...board.strokes],$('#mic-device').value);recordViewport();}catch(e){$('#studio-message').textContent=e.message;}};
$('#pause-record').onclick=async()=>{board.finish();if(recorder.state==='paused'){await recorder.resume();recordViewport();}else await recorder.pause();};$('#stop-record').onclick=()=>{board.finish();recordViewport();recorder.stop();};$('#test-mic').onclick=testMic;
$$('[data-tool]').forEach(b=>b.onclick=()=>{board.tool=b.dataset.tool;$$('[data-tool]').forEach(x=>x.classList.toggle('active',x===b));});$$('[data-color]').forEach(b=>b.onclick=()=>{board.color=b.dataset.color;$$('[data-color]').forEach(x=>x.classList.toggle('active',x===b));});$('#pen-width').oninput=e=>board.width=Number(e.target.value);$('#undo').onclick=()=>board.undo();$('#redo').onclick=()=>board.redo();$('#clear-board').onclick=()=>{if(confirm('Clear the pen working?'))board.clear();};
$('#review-take').onclick=()=>{details();if(pending)openPlayer(pending,true);};$('#save-take').onclick=async()=>{if(!pending||saving)return;details();$('#save-take').disabled=true;if(await saveTake(pending,$('#studio-message'))){pending=null;dirty=false;recorder.reset();$('#studio').close();toast('Explanation published for this question type.');}$('#save-take').disabled=false;};$('#discard-take').onclick=async()=>{if(saving||!pending||!confirm('Discard this recorded take?'))return;await drafts.delete(pending.id).catch(()=>{});pending=null;recorder.reset();};
$('#previous-recordings').onclick=()=>{if(!['idle','paused','review'].includes(recorder.state)){$('#studio-message').textContent='Pause your recording before watching another explanation.';return;}if(entries.length)watch(entries[0].id);else $('#studio-message').textContent='No earlier explanation for this type.';};$('#add-take').onclick=()=>{if($('#studio').open){closePlayer();return;}openStudio();};
$('#play-pause').onclick=()=>{if(sequence?.playing){++playbackActionGeneration;sequence.pause();}else guardedPlayback(p=>p.play());};$('#repeat-step').onclick=()=>guardedPlayback(p=>p.repeat());$('#next-step').onclick=()=>guardedPlayback(p=>p.next());$('#step-select').onchange=e=>{const index=Number(e.target.value);guardedPlayback(p=>p.seek(p.steps[index].start));};$('#seek').oninput=e=>{const time=Number(e.target.value);guardedPlayback(p=>p.seek(time,false));};$('#play-speed').onchange=e=>sequence?.setRate(Number(e.target.value));$('#pause-each-step').onchange=e=>{if(sequence)sequence.guided=e.target.checked;};$('#close-player').onclick=closePlayer;$('#player').oncancel=e=>{e.preventDefault();closePlayer();};
$('#access-open').onclick=()=>{location.href='?view=class-access';};const refreshClasses=$('#refresh-classes');if(refreshClasses)refreshClasses.onclick=async()=>{try{$('#refresh-classes').disabled=true;await api.call('refresh-topics',{});context=await api.connect();const selected=$('#access-class').value;$('#access-class').innerHTML=context.managedClasses.map(k=>`<option value="${esc(k)}">${esc(k)}</option>`).join('');if(context.managedClasses.includes(selected))$('#access-class').value=selected;await loadRoster();await restrictions();}catch(e){$('#access-message').textContent=e.message;}finally{$('#refresh-classes').disabled=false;}};$('#access-class').onchange=loadRoster;$('#whole-class').onchange=e=>$('#roster').disabled=e.target.checked;$('#access-duration').onchange=e=>$('#custom-hours-label').hidden=e.target.value!=='custom';
$('#access-form').onsubmit=async e=>{e.preventDefault();$('#hide-videos').disabled=true;try{const hours=Number($('#access-duration').value==='custom'?$('#access-hours').value:$('#access-duration').value);const value=await api.call('restrict',{classKey:$('#access-class').value,scope:'course',hours,wholeClass:$('#whole-class').checked,students:$('#whole-class').checked?[]:$$('#roster input:checked').map(x=>x.value)});$('#access-message').textContent='All portal videos are hidden for this class selection. Access returns '+new Date(value.expiresAt*1000).toLocaleString()+'.';await restrictions();}catch(e){$('#access-message').textContent=e.message;}finally{$('#hide-videos').disabled=false;}};
$('#import-open').onclick=()=>{$('#import-form').reset();$('#import-message').textContent='';$('#import-dialog').showModal();};$('#close-import').onclick=()=>{if(!saving)$('#import-dialog').close();};$('#import-dialog').oncancel=e=>{if(saving)e.preventDefault();};
async function durationOf(file){return new Promise((resolve,reject)=>{const el=document.createElement('video'),url=URL.createObjectURL(file);let done=false;const finish=error=>{if(done)return;done=true;clearTimeout(timer);const n=el.duration;el.removeAttribute('src');el.load();URL.revokeObjectURL(url);if(error||!Number.isFinite(n)||n<=0)reject(Error('This video cannot be read. Try MP4 or WebM.'));else resolve(n);};const timer=setTimeout(()=>finish(true),15000);el.onloadedmetadata=()=>finish(false);el.onerror=()=>finish(true);el.src=url;});}
$('#import-form').onsubmit=async e=>{e.preventDefault();if(saving)return;const button=$('#import-save');button.disabled=true;try{const file=$('#import-file').files[0];if(!file||file.size>512*1024*1024)throw Error('Choose a video no larger than 512 MB.');const duration=await durationOf(file),times=$('#import-steps').value.trim().split(',').map(s=>s.trim()).filter(Boolean).map(Number);if(times.some((n,i)=>!Number.isFinite(n)||n<=0||n>=duration||(i&&n<=times[i-1])))throw Error('Pause times must increase and be inside the video.');const ends=[...times,duration],take={id:crypto.randomUUID(),kind:'video',sourceKind:context.role==='admin'&&$('#import-self').checked?'self':'teacher',typeKey:type.typeKey,question:structuredClone(question),title:$('#import-name').value.trim(),duration,events:[],steps:ends.map((end,i)=>({number:i+1,title:`Step ${i+1}`,start:i?ends[i-1]:0,end})),file,ownerUid:context.uid};if(await saveTake(take,$('#import-message')))$('#import-dialog').close();}catch(e){$('#import-message').textContent=e.message;}finally{button.disabled=false;}};
setInterval(()=>{if(['recording','paused','pausing','stopping'].includes(recorder.state))$('#record-clock').textContent=formatTime(recorder.clock.read()/1000);},200);
setInterval(()=>{if(context&&!document.hidden){refreshLibrary();if(isTeacher()&&!$('#access-panel').hidden)restrictions();}},15000);
document.addEventListener('visibilitychange',()=>{++playbackActionGeneration;if(document.hidden)sequence?.pause();else refreshLibrary();});
window.addEventListener('teaching-asset-loaded',()=>{if($('#studio').open)board.draw();if(sequence)renderPlayer(sequence);});window.addEventListener('beforeunload',e=>{if(pending||dirty||saving||!['idle','review'].includes(recorder.state)){e.preventDefault();e.returnValue='';}});window.addEventListener('pagehide',()=>{stopMicTest();recorder.release();stopPlayback();});
$('#self-package-form').onsubmit=async e=>{
 e.preventDefault();if(saving||context.role!=='admin')return;$('#publish-package').disabled=true;
 try{
  const files=[...$('#self-package-files').files],jsonFiles=files.filter(f=>f.name.endsWith('.json'));if(jsonFiles.length!==1)throw Error('Select one JSON package and all of its media files.');
  const pack=JSON.parse(await jsonFiles[0].text());if(!Array.isArray(pack.files)||!pack.manifest||pack.manifest.sourceKind!=='self')throw Error('Choose a generated self-explanation package.');
  if(pack.review?.status!=='approved')throw Error('This generated package is still awaiting its final audiovisual review.');const take=pack.manifest;take.ownerUid=context.uid;const canonical=catalog.types[take.typeKey]?.questions.find(q=>q.id===take.question.id);if(!canonical)throw Error('Package question is not in the course catalog.');const sourceImage=take.question.image;take.question=structuredClone(canonical);for(const event of take.events){for(const stroke of event.strokes||[event.stroke]){if(stroke?.kind==='image'&&stroke.src===sourceImage)stroke.src=canonical.image;}}
  take.mediaFiles=[];for(const asset of pack.files){const matches=files.filter(f=>f.name===asset.file);const file=matches[0];if(matches.length!==1||!file||file.size!==asset.bytes)throw Error('Missing, duplicate or incomplete media: '+asset.file);if(asset.sha256){const hash=[...new Uint8Array(await crypto.subtle.digest('SHA-256',await file.arrayBuffer()))].map(b=>b.toString(16).padStart(2,'0')).join('');if(hash!==asset.sha256)throw Error('Media checksum differs: '+asset.file);}if(take.kind==='video'&&take.tracks){take.mediaFiles.push({slot:asset.slot,blob:new Blob([file],{type:asset.mime})});}else{const match=/^step-([1-9]\d*)$/.exec(asset.slot);if(!match||!take.steps[Number(match[1])-1])throw Error('Invalid package step.');take.steps[Number(match[1])-1].audio=new Blob([file],{type:asset.mime});}}if(!take.tracks)delete take.mediaFiles;
  if(await saveTake(take,$('#package-message'))){selectType(take.typeKey,take.question.id);$('#self-package-form').reset();}
 }catch(error){$('#package-message').textContent=error.message;}finally{$('#publish-package').disabled=false;}
};
async function boot(){
 try{
  const [access,content]=await Promise.allSettled([api.connect(),fetch('catalog.json?v=human-biology-hints-v1').then(r=>{if(!r.ok)throw Error('Question catalog is unavailable.');return r.json();})]);
  if(content.status==='rejected')throw content.reason;
  catalog=content.value;context=access.status==='fulfilled'?access.value:null;
  // Static course questions remain usable when the video service is unavailable.
  // The server's course access gate and every privileged API check still apply.
  $('#connection').textContent=context?(isTeacher()?`Signed in as ${context.name||'teacher'}. Recordings publish to the course.`:'Your course explanations are ready.'):'Questions and hints are ready. '+(access.reason?.message||'Video services are unavailable.');
  if(!context){$('#recording-list').textContent='Explanations are unavailable until the video service connects.';if(access.reason?.status===401){const login=document.createElement('a');login.href='https://live.olevels.com/student?redirect='+encodeURIComponent(location.href);login.textContent=' Sign in to the Human Biology course';$('#connection').append(login);}}
  $$('.teacher-only').forEach(el=>{if(el.id!=='access-panel')el.hidden=!isTeacher();});$('#self-kind-label').hidden=context?.role!=='admin';$('#self-package').hidden=context?.role!=='admin';
  if(!Object.keys(catalog.types).length){$('#connection').textContent='The reviewed question catalog is not available yet.';return;}$('#type-select').disabled=false;typeOptions();const params=new URLSearchParams(location.search),classView=params.get('view')==='class-access';document.body.classList.toggle('class-access-view',classView);if(!classView){const key=params.get('type'),watchExplanation=['self','explanation'].includes(params.get('watch'));if(watchExplanation&&!Object.hasOwn(catalog.types,key)){$('#connection').textContent='This explanation link does not identify a course question type. Choose a type below.';$('#connection').classList.add('error');}else selectType(Object.hasOwn(catalog.types,key)?key:Object.keys(catalog.types)[0],params.get('question'),watchExplanation);}else{$('.release-heading h1').textContent='Class video access';$('.release-heading p:not(.eyebrow)').textContent='Temporarily hide all explanatory videos across the Human Biology course for a class.';$('#access-open').hidden=true;$('#access-panel').hidden=!isTeacher();if(!isTeacher())$('#connection').textContent='Only your teacher can manage class video access.';}
  if(isTeacher()){
   $('#access-class').innerHTML=context.managedClasses.map(k=>`<option value="${esc(k)}">${esc(k)}</option>`).join('');if(classView){loadRoster();restrictions();}
   const saved=await drafts.all().catch(()=>[]);for(const take of saved.filter(t=>t.ownerUid===context.uid)){const button=document.createElement('button');button.className='secondary';button.textContent='Recover draft: '+take.title;button.onclick=async()=>{if(!confirm('Preview this unfinished recording?'))return;selectType(take.typeKey,take.question.id);pending=take;openPlayer(take,true);const save=document.createElement('button');save.className='primary';save.textContent='Publish recovered draft';save.onclick=async()=>{if(saving)return;if(await saveTake(take,$('#player-message'))){pending=null;button.remove();save.remove();}};$('#player-playlist').append(save);};$('#connection').after(button);}
  }
 }catch(e){$('#connection').textContent=e.message;$('#connection').classList.add('error');if(e.status===401){const a=document.createElement('a');a.href='https://live.olevels.com/student?redirect='+encodeURIComponent(location.href);a.textContent=' Sign in to the Human Biology course';$('#connection').append(a);}}
}
boot();
