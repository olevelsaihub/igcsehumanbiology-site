// One media file per numbered step: a completed step cannot spill into the next one.
export function stepIndexAt(steps,time){
 if(!steps.length)return -1;
 for(let i=steps.length-1;i>=0;i--)if(time>=steps[i].start)return i;
 return 0;
}
export class StepPlayer {
 constructor(steps,{createAudio=(src,duration)=>src?new Audio(src):new SilentClip(duration),onChange=()=>{},onError=()=>{}}={}){
   if(!steps.length||steps.some(s=>s.end<=s.start))throw Error('Each step needs a valid time range.');
   this.steps=steps;this.createAudio=createAudio;this.onChange=onChange;this.onError=onError;this.index=0;this.guided=true;this.playing=false;this.finished=false;this.rate=1;this.operation=0;this.audio=null;this.load(0,0);
 }
 get step(){return this.steps[this.index];}
 get time(){return this.finished?Math.max(this.step.start,this.step.end-.01):Math.min(this.step.end-.01,this.step.start+(this.audio?.currentTime||0));}
 emit(){this.onChange(this);}
 load(index,offset=0){
   ++this.operation;
   if(this.audio){this.audio.onended=null;this.audio.onerror=null;this.audio.ontimeupdate=null;this.audio.onloadedmetadata=null;this.audio.pause();this.audio.removeAttribute('src');this.audio.load();}
   this.index=index;this.finished=false;this.playing=false;
   const el=this.createAudio(this.step.audioURL,this.step.end-this.step.start);this.audio=el;el.preload='metadata';el.playbackRate=this.rate;
   let pending=offset;
   el.onloadedmetadata=()=>{if(this.audio===el&&pending!==null){el.currentTime=pending;pending=null;}};
   if(el.readyState>0){el.currentTime=offset;pending=null;}
   el.ontimeupdate=()=>{if(this.audio===el)this.emit();};
   el.onerror=()=>{if(this.audio!==el)return;this.pause();this.onError('This step’s audio could not load. Try Repeat this step.');};
   el.onended=()=>{
     if(this.audio!==el)return;
     this.playing=false;this.finished=true;this.emit();
     if(!this.guided&&this.index<this.steps.length-1)this.seek(this.steps[this.index+1].start,true);
   };
 }
 async play(){
   if(this.finished)this.load(this.index,0);
   const operation=++this.operation,el=this.audio;
   try{await el.play();if(operation!==this.operation||this.audio!==el)return;this.playing=true;this.emit();}
   catch(e){if(operation!==this.operation)return;this.playing=false;this.onError('Click Play to start this step. If it still cannot play, check the audio file.');this.emit();}
 }
 pause(){++this.operation;this.audio?.pause();this.playing=false;this.emit();}
 seek(time,autoplay=false){
   this.pause();const index=stepIndexAt(this.steps,time),offset=Math.max(0,Math.min(this.steps[index].end-this.steps[index].start-.01,time-this.steps[index].start));
   this.load(index,offset);this.emit();if(autoplay)return this.play();return Promise.resolve();
 }
 repeat(){return this.seek(this.step.start,true);}
 next(){if(this.index>=this.steps.length-1)return Promise.resolve();return this.seek(this.steps[this.index+1].start,true);}
 setRate(rate){this.rate=rate;if(this.audio)this.audio.playbackRate=rate;this.emit();}
 dispose(){++this.operation;this.onChange=()=>{};this.playing=false;if(this.audio){this.audio.onended=null;this.audio.onerror=null;this.audio.ontimeupdate=null;this.audio.onloadedmetadata=null;this.audio.pause();this.audio.removeAttribute('src');this.audio.load();this.audio=null;}}
}

// Silent board recordings use the same step controls and active-time semantics.
export class SilentClip {
 constructor(duration){this.duration=duration;this.readyState=1;this.position=0;this.paused=true;this.rate=1;this.timer=null;}
 get currentTime(){return Math.min(this.duration,this.position+(this.paused?0:(performance.now()-this.since)/1000*this.rate));}
 set currentTime(value){this.position=Math.max(0,Math.min(this.duration,value));this.since=performance.now();}
 get playbackRate(){return this.rate;}
 set playbackRate(value){const position=this.currentTime;this.rate=value;this.currentTime=position;}
 async play(){if(!this.paused)return;this.since=performance.now();this.paused=false;this.timer=setInterval(()=>{this.ontimeupdate?.();if(this.currentTime>=this.duration){this.pause();this.onended?.();}},30);}
 pause(){this.position=this.currentTime;this.paused=true;clearInterval(this.timer);this.timer=null;}
 removeAttribute(){}
 load(){this.pause();}
}

