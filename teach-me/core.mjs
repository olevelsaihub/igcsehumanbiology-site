// Timed vector ink + optional microphone audio. No network or cloud credentials.
export const W = 1400, H = 1000;
export const clone = value => structuredClone(value);
export const formatTime = seconds => `${Math.floor(Math.max(0,seconds)/60).toString().padStart(2,'0')}:${Math.floor(Math.max(0,seconds)%60).toString().padStart(2,'0')}`;
export const formatBytes = bytes => bytes < 1000000 ? `${Math.ceil(bytes/1000)} KB` : `${(bytes/1000000).toFixed(1)} MB`;
export class TimelineClock {
  constructor(now = () => performance.now()) { this.now=now; this.elapsed=0; this.active=false; }
  start(){this.elapsed=0;this.since=this.now();this.active=true;}
  read(){return this.elapsed+(this.active?this.now()-this.since:0);}
  pause(){if(this.active){this.elapsed=this.read();this.active=false;}}
  resume(){if(!this.active){this.since=this.now();this.active=true;}}
}
export function inkAt(events, milliseconds){
  let strokes=[];
  for(const event of events){
    if(event.t>milliseconds)continue;
    if(event.kind==='snapshot') strokes=event.strokes;
    else if(event.kind==='stroke'){
      const points=event.stroke.points.filter(p=>p.t<=milliseconds);
      if(points.length) strokes=[...strokes,{...event.stroke,points}];
    }
  }
  return strokes.map(s=>s.animated?{...s,points:s.points.filter(p=>p.t<=milliseconds)}:s);
}
const sceneImages=new Map();
export function paint(ctx,strokes){
  ctx.clearRect(0,0,ctx.canvas?.width||W,ctx.canvas?.height||H);
  for(const s of strokes){
    if(s.kind==='image'){
      // Authored scenes can show the bundled brand and original geometry question.
      if(s.src!=='assets/brand/olevels-logo.png' && !/^https:\/\/storage\.googleapis\.com\/olevels\/igcse-human-biology\/question-images\/[a-f0-9]{20}\/[A-Za-z0-9()%_-]+\.(png|webp|jpe?g)$/.test(s.src))continue;
      let img=sceneImages.get(s.src);
      if(!img){img=new Image();img.crossOrigin='anonymous';sceneImages.set(s.src,img);img.onload=()=>window.dispatchEvent(new Event('teaching-asset-loaded'));img.src=s.src;}
      if(img.complete&&img.naturalWidth){ctx.save();ctx.globalAlpha=s.opacity??1;if(Number.isFinite(s.cropY)&&Number.isFinite(s.cropH))ctx.drawImage(img,0,img.naturalHeight*s.cropY,img.naturalWidth,img.naturalHeight*s.cropH,s.x,s.y,s.w,s.h);else ctx.drawImage(img,s.x,s.y,s.w,s.h);ctx.restore();}continue;
    }
    if(s.kind==='polygon'){
      if(!s.points?.length)continue;ctx.save();ctx.fillStyle=s.color;ctx.beginPath();ctx.moveTo(s.points[0].x,s.points[0].y);for(const p of s.points.slice(1))ctx.lineTo(p.x,p.y);ctx.closePath();ctx.fill();ctx.restore();continue;
    }
    if(s.kind==='text'){
      ctx.save();ctx.fillStyle=s.color;ctx.font=`${s.weight||400} ${s.size}px Poppins, sans-serif`;
      ctx.textBaseline='alphabetic';ctx.fillText(s.text,s.x,s.y+(s.ascent||s.size));ctx.restore();continue;
    }
    if(s.kind==='rect'){
      ctx.save();ctx.beginPath();ctx.roundRect(s.x,s.y,s.w,s.h,s.radius||0);ctx.fillStyle=s.color;ctx.fill();
      if(s.stroke){ctx.lineWidth=2;ctx.strokeStyle=s.stroke;ctx.stroke();}ctx.restore();continue;
    }
    if(!s.points?.length)continue;
    ctx.save();ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=s.width;
    ctx.strokeStyle=s.color;ctx.fillStyle=s.color;
    ctx.globalCompositeOperation=s.tool==='eraser'?'destination-out':'source-over';
    ctx.globalAlpha=s.tool==='highlighter'?.28:1;
    ctx.beginPath();ctx.moveTo(s.points[0].x,s.points[0].y);
    for(const p of s.points.slice(1))ctx.lineTo(p.x,p.y);
    if(s.points.length===1){ctx.arc(s.points[0].x,s.points[0].y,s.width/2,0,Math.PI*2);ctx.fill();}else ctx.stroke();
    ctx.restore();
  }
}
export class InkBoard {
  constructor(canvas,{time=()=>0,change=()=>{},blocked=()=>false}={}){
    this.canvas=canvas;this.ctx=canvas.getContext('2d');this.time=time;this.change=change;this.blocked=blocked;
    this.tool='pen';this.color='#172B4D';this.width=6;this.strokes=[];this.redoStack=[];this.pointer=null;
    canvas.addEventListener('pointerdown',e=>this.begin(e));
    canvas.addEventListener('pointermove',e=>this.move(e));
    canvas.addEventListener('pointerup',e=>this.end(e));
    canvas.addEventListener('pointercancel',e=>this.end(e));
    canvas.addEventListener('lostpointercapture',()=>this.finish());
  }
  point(e){const r=this.canvas.getBoundingClientRect();return {x:Math.round((e.clientX-r.left)/r.width*W*10)/10,y:Math.round((e.clientY-r.top)/r.height*(this.canvas.height||H)*10)/10,t:Math.round(this.time())};}
  begin(e){if(this.blocked()||this.pointer!==null||e.button!==0)return;e.preventDefault();this.pointer=e.pointerId;this.canvas.setPointerCapture(e.pointerId);this.redoStack=[];const p=this.point(e);this.current={tool:this.tool,color:this.color,width:this.tool==='eraser'?this.width*7:this.tool==='highlighter'?this.width*5:this.width,points:[p]};this.strokes.push(this.current);this.change({kind:'stroke',t:p.t,stroke:this.current});this.draw();}
  move(e){if(e.pointerId!==this.pointer||!this.current)return;e.preventDefault();for(const v of (e.getCoalescedEvents?.()||[e])){const p=this.point(v),last=this.current.points.at(-1);if(Math.hypot(p.x-last.x,p.y-last.y)>.7)this.current.points.push(p);}this.draw();}
  end(e){if(e.pointerId!==this.pointer)return;this.move(e);this.finish();if(this.canvas.hasPointerCapture(e.pointerId))this.canvas.releasePointerCapture(e.pointerId);}
  finish(){this.pointer=null;this.current=null;}
  draw(){paint(this.ctx,this.strokes);}
  snapshot(){this.change({kind:'snapshot',t:Math.round(this.time()),strokes:clone(this.strokes)});this.draw();}
  undo(){if(this.blocked()||!this.strokes.length)return;this.finish();this.redoStack.push(this.strokes.pop());this.snapshot();}
  redo(){if(this.blocked()||!this.redoStack.length)return;this.finish();this.strokes.push(this.redoStack.pop());this.snapshot();}
  clear(){if(this.blocked())return;this.finish();this.strokes=[];this.redoStack=[];this.snapshot();}
  reset(){this.finish();this.strokes=[];this.redoStack=[];this.draw();}
}
export class Recorder extends EventTarget {
  constructor(){super();this.clock=new TimelineClock();this.state='idle';this.generation=0;this.events=[];this.steps=[];this.chunks=[];}
  change(state){this.state=state;this.dispatchEvent(new Event('change'));}
  notice(message){this.dispatchEvent(new CustomEvent('notice',{detail:message}));}
  async start(withVoice,initial=[],deviceId=''){
    if(this.state!=='idle')throw Error('Finish the current take first.');
    const generation=++this.generation;this.events=[{kind:'snapshot',t:0,strokes:clone(initial)}];this.steps=[];this.chunks=[];this.audio=null;this.voice=withVoice;this.change('requesting');
    try{
      if(withVoice){
        if(!globalThis.isSecureContext||!navigator.mediaDevices?.getUserMedia||!globalThis.MediaRecorder)throw Error('Voice recording needs HTTPS or localhost. You can still record without voice.');
        const stream=await navigator.mediaDevices.getUserMedia({audio:{...(deviceId?{deviceId:{exact:deviceId}}:{}),channelCount:1,echoCancellation:true,noiseSuppression:true,autoGainControl:true},video:false});
        if(generation!==this.generation){stream.getTracks().forEach(t=>t.stop());return;}
        this.stream=stream;
        stream.getAudioTracks().forEach(track=>{
          track.onended=()=>{if(['recording','paused','pausing','resuming'].includes(this.state)){this.notice('Microphone disconnected. Preview the recovered steps before saving.');this.stop();}};
          track.onmute=()=>this.notice('Microphone input is interrupted. Check your microphone before continuing.');
          track.onunmute=()=>this.notice('Microphone input is available again.');
        });
      }
      this.startSegment(true);
    }catch(error){this.release();this.change('idle');throw error;}
  }
  startSegment(first=false){
    this.chunks=[];this.segmentStart=this.steps.at(-1)?.end||0;this.segmentOpen=true;
    const generation=this.generation;
    const started=()=>{if(generation!==this.generation||!['requesting','resuming'].includes(this.state))return;first?this.clock.start():this.clock.resume();this.change('recording');};
    if(!this.voice){started();return;}
    const mimeType=['audio/webm;codecs=opus','audio/mp4','audio/ogg;codecs=opus'].find(t=>MediaRecorder.isTypeSupported(t));
    const media=new MediaRecorder(this.stream,{...(mimeType?{mimeType}:{}),audioBitsPerSecond:32000});this.media=media;
    const current=()=>generation===this.generation&&this.media===media;
    media.ondataavailable=e=>{if(current()&&e.data.size)this.chunks.push(e.data);};
    media.onstart=started;
    media.onerror=()=>{if(current()){this.notice('The microphone recorder stopped unexpectedly. Preview the recovered steps before saving.');this.stop();}};
    media.onstop=()=>{
      if(!current())return;
      this.clock.pause();this.closeSegment(media.mimeType);
      if(this.state==='pausing')this.change('paused');else this.finalize();
    };
    media.start(1000);
  }
  closeSegment(mime){
    if(!this.segmentOpen)return;this.segmentOpen=false;
    const end=Math.max(this.segmentStart+.01,this.clock.read()/1000);
    const audio=this.voice?new Blob(this.chunks,{type:mime||'audio/webm'}):null;
    this.steps.push({number:this.steps.length+1,title:`Step ${this.steps.length+1}`,start:this.segmentStart,end,audio,audioExpected:this.voice===true});
    this.clock.elapsed=end*1000;this.chunks=[];
  }
  add(event){if(this.state==='recording')this.events.push(event);}
  pause(){
    if(this.state!=='recording')return;this.clock.pause();
    if(this.voice){this.change('pausing');this.media.stop();}
    else{this.closeSegment();this.change('paused');}
  }
  resume(){
    if(this.state!=='paused')return;this.change('resuming');
    try{this.startSegment();}catch{this.segmentOpen=false;this.notice('The next step could not start. Your completed steps are ready to review.');this.finalize();}
  }
  stop(){
    if(!['recording','paused','pausing','resuming'].includes(this.state))return;
    const previous=this.state,wasPausing=previous==='pausing';this.clock.pause();this.change('stopping');
    if(previous==='paused'){this.finalize();return;}
    if(wasPausing)return; // The pending final dataavailable/stop closes this step once.
    if(this.voice){if(this.media?.state!=='inactive')this.media.stop();}
    else{this.closeSegment();this.finalize();}
  }
  finalize(){
    if(this.state==='review'||this.state==='idle')return;
    this.duration=this.steps.at(-1)?.end||.01;
    // Separate recordings are independent containers, never concatenated WebM files.
    this.audio=this.steps.length===1?this.steps[0].audio:null;
    this.release();this.change('review');
  }
  release(){this.stream?.getTracks().forEach(t=>{t.onended=null;t.onmute=null;t.onunmute=null;t.stop();});this.stream=null;}
  cancelStart(){++this.generation;this.release();this.segmentOpen=false;this.change('idle');}
  reset(){if(['recording','paused','pausing','resuming','stopping'].includes(this.state))throw Error('Stop before discarding.');++this.generation;this.release();this.media=null;this.audio=null;this.events=[];this.steps=[];this.chunks=[];this.segmentOpen=false;this.clock=new TimelineClock();this.change('idle');}
}
export class LocalRecordings {
  constructor(){this.db=null;}
  async open(){return this.db ||= await new Promise((resolve,reject)=>{const req=indexedDB.open('olevels-teaching-drafts',1);req.onupgradeneeded=()=>{const s=req.result.createObjectStore('takes',{keyPath:'id'});s.createIndex('typeKey','typeKey');};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);req.onblocked=()=>reject(Error('Close another teaching tab, then reload.'));});}
  async transact(mode,run){const db=await this.open();return new Promise((resolve,reject)=>{const tx=db.transaction('takes',mode);let result;try{const request=run(tx.objectStore('takes'));request.onsuccess=()=>result=request.result;}catch(e){reject(e);return;}tx.oncomplete=()=>resolve(result);tx.onabort=tx.onerror=()=>reject(tx.error||Error('Browser storage failed.'));});}
  all(){return this.transact('readonly',s=>s.getAll());}
  put(take){return this.transact('readwrite',s=>s.put(take));}
  delete(id){return this.transact('readwrite',s=>s.delete(id));}
}
export function parseVideoURL(raw){
  let url;try{url=new URL(raw);}catch{throw Error('Enter a complete HTTPS video link.');}
  if(url.protocol!=='https:'||url.username||url.password)throw Error('Use an HTTPS video link without a username or password.');
  if(/(^|\.)cloudflarestream\.com$/i.test(url.hostname)&&/^\/[A-Za-z0-9_.-]+\/iframe\/?$/.test(url.pathname))return {kind:'stream',url:url.href};
  if(/\.(mp4|webm)$/i.test(url.pathname))return {kind:'video',url:url.href};
  throw Error('Use a direct .mp4 or .webm link, or a Cloudflare Stream iframe URL.');
}
