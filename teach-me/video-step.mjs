// Each interval shares the loaded MP4. Only closing/changing the lesson releases it.
const owners=new WeakMap();
export class VideoStep {
 constructor(el,url,start,end){
  this.el=el;this.start=start;this.end=end;this.position=0;this.run=0;this.done=false;owners.set(el,this);
  el.controls=false;el.onloadedmetadata=()=>{el.currentTime=this.start+this.position;this.onloadedmetadata?.();};
  el.onerror=()=>this.onerror?.();el.onended=()=>this.finish();
  this.tick=()=>{if(el.currentTime>=this.end-.02){this.finish();return;}this.ontimeupdate?.();if(!el.paused)this.frame=requestAnimationFrame(this.tick);};
  el.ontimeupdate=()=>{if(!el.paused&&el.currentTime>=this.end-.02)this.finish();else this.ontimeupdate?.();};
  if(el.getAttribute('src')!==url)el.src=url;
 }
 get readyState(){return this.el.readyState;}
 get currentTime(){return Math.max(0,Math.min(this.end-this.start,this.el.currentTime-this.start));}
 set currentTime(n){this.position=Math.max(0,Math.min(this.end-this.start-.025,n));this.done=false;if(this.el.readyState>0)this.el.currentTime=this.start+this.position;}
 get playbackRate(){return this.el.playbackRate;}set playbackRate(n){this.el.playbackRate=n;}
 set preload(n){this.el.preload='auto';}
 async ready(){
  if(this.el.readyState>0)return;
  await new Promise((resolve,reject)=>{
   const clean=()=>{clearTimeout(timer);this.el.removeEventListener('loadedmetadata',ok);this.el.removeEventListener('error',fail);this.cancelReady=null;};
   const ok=()=>{clean();resolve();},fail=()=>{clean();reject(Error('Video could not load.'));};
   const timer=setTimeout(fail,15000);this.cancelReady=ok;
   this.el.addEventListener('loadedmetadata',ok,{once:true});this.el.addEventListener('error',fail,{once:true});
  });
 }
 async play(){const run=++this.run;await this.ready();if(run!==this.run||owners.get(this.el)!==this)return;await this.el.play();if(run!==this.run){if(owners.get(this.el)===this)this.el.pause();return;}this.frame=requestAnimationFrame(this.tick);}
 pause(){++this.run;cancelAnimationFrame(this.frame);this.el.pause();}
 finish(){if(this.done)return;this.pause();this.done=true;this.el.currentTime=Math.max(this.start,this.end-.04);this.onended?.();}
 removeAttribute(){this.pause();this.cancelReady?.();if(owners.get(this.el)===this){this.el.onloadedmetadata=null;this.el.onerror=null;this.el.onended=null;this.el.ontimeupdate=null;owners.delete(this.el);}}
 load(){} // StepPlayer releases an interval here, not the shared video's buffer.
}
