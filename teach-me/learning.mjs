const $=s=>document.querySelector(s);
let captionVideo=null;
function updateZoomCaptions(){
 const video=$('#video-player'),line=$('#video-caption-text');if(!video||!line)return;
 const enlarged=$('#video-zoom')?.value!=='fit'&&!$('#video-viewport')?.hidden,enabled=!!$('#show-captions')?.checked;
 for(const t of video.textTracks){const mode=enabled?(enlarged?'hidden':'showing'):'disabled';if(t.mode!==mode)t.mode=mode;}
 line.hidden=!(enlarged&&enabled);line.textContent=line.hidden?'':Array.from(video.textTracks).flatMap(t=>Array.from(t.activeCues||[]).map(c=>c.text)).join(' ');
}
export function clearLearning(){
 $('#learning-support')?.replaceChildren();$('#learning-context')?.replaceChildren();
 for(const id of ['learning-support','learning-context','video-view-tools','video-viewport']){const e=$('#'+id);if(e)e.hidden=true;}
 $('#player')?.classList.remove('video-lesson');
 const caption=$('#video-caption-text');if(caption){caption.hidden=true;caption.textContent='';}
 const video=$('#video-player');if(video){video.style.width='';video.style.height='';video.style.maxHeight='';video.style.aspectRatio='';}
}
export function mountLearning(take){
 clearLearning();const isVideo=take.kind==='video',viewport=$('#video-viewport');viewport.hidden=!isVideo;
 $('#player').classList.toggle('video-lesson',isVideo);
 if(!isVideo)return;
 $('#video-view-tools').hidden=false;
 const zoom=$('#video-zoom');zoom.value='fit';
 zoom.onchange=()=>{
  viewport.classList.toggle('enlarged',zoom.value!=='fit');
  const v=$('#video-player');v.style.width=zoom.value==='fit'?'100%':Math.max(1400,viewport.clientWidth*2)+'px';v.style.height=zoom.value==='fit'?'100%':'auto';v.style.maxHeight='none';v.style.aspectRatio='1.4';
  viewport.scrollLeft=zoom.value==='working'?Math.min(viewport.scrollWidth-viewport.clientWidth,viewport.scrollWidth*.48):0;viewport.scrollTop=zoom.value==='fit'?0:viewport.scrollHeight*.12;updateZoomCaptions();
 };
 if(captionVideo!==$('#video-player')){captionVideo=$('#video-player');for(const event of ['timeupdate','seeked','loadeddata'])captionVideo.addEventListener(event,updateZoomCaptions);$('#show-captions').addEventListener('change',updateZoomCaptions);}
 zoom.onchange();
 // One stable original question above the video; no observer replaces it during playback.
 if(take.question?.image){
  const context=$('#learning-context');context.hidden=false;
  const link=document.createElement('a');link.href=take.question.image;link.target='_blank';link.rel='noopener';link.title='Open the original question at full size';
  const image=document.createElement('img');image.src=take.question.image;image.alt=take.question.source+' · '+take.question.title;
  link.append(image);context.append(link);
 }
}
