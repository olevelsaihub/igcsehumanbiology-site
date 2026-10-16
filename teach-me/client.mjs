export class TeachingAPI {
 constructor(){this.csrf='';}
 async call(action,data=null,query={}){
  const url='api.php?'+new URLSearchParams({action,...query});
  const response=await fetch(url,{credentials:'same-origin',cache:'no-store',...(data?{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-Token':this.csrf},body:JSON.stringify(data)}:{})});
  const value=await response.json().catch(()=>({error:'The course server returned an unreadable response.'}));
  if(!response.ok){const error=Error(value.error||'Request failed.');error.status=response.status;throw error;}return value;
 }
 async connect(){const value=await this.call('context');this.csrf=value.csrf;return value;}
 async publish(take,onProgress=()=>{}){
  const manifest=structuredClone(take),files=[];
  if(take.kind==='video'){
   if(take.tracks){
    const slots=['video','captions','transcript','video-en','captions-en','transcript-en'];
    if(!Array.isArray(take.mediaFiles)||take.mediaFiles.length!==6||new Set(take.mediaFiles.map(f=>f.slot)).size!==6||take.mediaFiles.some(f=>!slots.includes(f.slot)||!(f.blob instanceof Blob)||!f.blob.size))throw Error('Both language videos, captions and transcripts are required.');
    files.push(...take.mediaFiles);delete manifest.mediaFiles;
   }else files.push({slot:'video',blob:take.file});
   delete manifest.file;
  }
  manifest.steps=take.steps.map((step,i)=>{const result={...step};if(take.kind==='board'){result.audioExpected=step.audioExpected??Boolean(step.audio?.size);if(result.audioExpected&&!step.audio?.size)throw Error('A recorded voice step is missing its audio. Recover the original take before publishing.');if(!result.audioExpected&&step.audio?.size)throw Error('This step has conflicting voice metadata.');}delete result.audio;delete result.audioURL;if(step.audio?.size)files.push({slot:`step-${i+1}`,blob:step.audio});return result;});
  const objects=files.map(f=>({slot:f.slot,bytes:f.blob.size,mime:f.blob.type.split(';')[0]}));
  let completed=0;const total=files.reduce((sum,f)=>sum+f.blob.size,0);
  const created=await this.call('create',{manifest,objects});if(created.state==='ready')return;
  for(const file of files){
   const session=await this.call('upload-session',{id:take.id,slot:file.slot});
   if(!session.complete)await uploadResumable(session.url,file.blob,n=>onProgress((completed+n)/Math.max(1,total)));
   completed+=file.blob.size;onProgress(completed/Math.max(1,total));
  }
  await this.call('publish',{id:take.id});onProgress(1);
 }
}
export function confirmedOffset(response,total){
 if(response.status===200||response.status===201)return total;
 if(response.status!==308)throw Error('The upload could not continue. Your take is still available; retry Save.');
 const range=response.headers.get('Range');if(!range)return 0;
 const match=/^bytes=0-(\d+)$/.exec(range);if(!match)throw Error('Invalid upload progress response.');
 const n=Number(match[1])+1;if(n>total)throw Error('Invalid upload position.');return n;
}
export async function uploadResumable(url,blob,progress,send=fetch){
 const parsed=new URL(url);if(parsed.protocol!=='https:'||parsed.hostname!=='storage.googleapis.com')throw Error('Untrusted upload destination.');
 let offset=0,failures=0,stalled=0;
 while(offset<blob.size){
  const end=Math.min(offset+4*1024*1024,blob.size),previous=offset;
  try{
   const r=await send(url,{method:'PUT',headers:{'Content-Type':blob.type.split(';')[0],'Content-Range':`bytes ${offset}-${end-1}/${blob.size}`},body:blob.slice(offset,end)});
   if(r.status>=500)throw Error('Storage is temporarily unavailable.');
   offset=confirmedOffset(r,blob.size);failures=0;
  }catch(error){
   if(++failures>3)throw Error('Upload interrupted. Keep this page open and retry Save; completed files will be reused.');
   await new Promise(resolve=>setTimeout(resolve,Math.min(1000*2**failures,8000)));
   const r=await send(url,{method:'PUT',headers:{'Content-Range':`bytes */${blob.size}`},body:new Blob([])});
   offset=confirmedOffset(r,blob.size);
  }
  if(offset===previous&&++stalled>3)throw Error('Upload made no progress. Retry Save.');
  if(offset>previous)stalled=0;progress(offset);
 }
}
