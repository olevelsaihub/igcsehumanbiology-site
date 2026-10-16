// A paired lesson stays one library entry, with a separate timeline per language.
export function languageOptions(take){
 if(take.kind!=='video'||!take.tracks)return [];
 return ['ur','en'].filter(language=>{
  const track=take.tracks[language];
  return track?.url&&Number.isFinite(track.duration)&&track.duration>0&&Array.isArray(track.steps)&&track.steps.length===take.steps.length;
 });
}
export function selectLanguage(take,requested){
 const options=languageOptions(take);if(!options.length)return take;
 const language=options.includes(requested)?requested:options.includes('ur')?'ur':options[0];
 return {...take,...take.tracks[language],language,captionLabel:language==='ur'?'Urdu–English':'English',tracks:take.tracks};
}
export function matchingStepStart(take,index){return take.steps[Math.min(Math.max(0,index),take.steps.length-1)].start;}
