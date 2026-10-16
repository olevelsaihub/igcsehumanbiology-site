export const BOARD_WIDTH=1400, MAX_BOARD_HEIGHT=12000, WORKING_GAP=1200;
// Image slices keep the original question at the same readable scale. Every
// chosen part is followed by a full area for handwriting.
export function questionLayout(question,imageWidth,imageHeight,cuts=[]){
 if(!(imageWidth>0&&imageHeight>0))throw Error('The question image is not ready.');
 const boundaries=[0,...cuts.slice().sort((a,b)=>a-b),1];
 if(boundaries.length>10||boundaries.some((v,i)=>!Number.isFinite(v)||v<0||v>1||(i&&v-boundaries[i-1]<.025)))throw Error('Choose separate gaps between question parts.');
 const width=1180,scale=width/imageWidth,strokes=[];let y=88;
 for(let i=0;i<boundaries.length-1;i++){
  const cropY=boundaries[i],cropH=boundaries[i+1]-cropY,h=imageHeight*scale*cropH;
  strokes.push({kind:'image',src:question.image,x:110,y,w:width,h,cropY,cropH});y+=h;
  strokes.push({kind:'text',text:boundaries.length>2?`WORKING — SECTION ${i+1}`:'WORKING SPACE',x:110,y:y+34,size:18,weight:600,color:'#7b899a'});
  y+=WORKING_GAP;
 }
 const height=Math.max(4200,Math.ceil(y+150));if(height>MAX_BOARD_HEIGHT)throw Error('This layout is too long. Use fewer split points.');
 return {height,strokes:[...strokes,...watermarks(0,height)]};
}
export function watermarks(from,to){const result=[];for(let y=Math.max(650,Math.ceil(from/1000)*1000+650);y<to;y+=1000)result.push({kind:'text',text:'olevels.com',x:970,y,size:48,weight:600,color:'#e1e5eb'});return result;}
export function viewportAt(events,time,height){let y=0;for(const e of events){if(e.t>time)break;if(e.kind==='viewport')y=e.y;}return Math.max(0,Math.min(height,y));}
export function nextBoardHeight(height){return Math.min(MAX_BOARD_HEIGHT,height+1400);}
export function cursorAt(events,time){
 let before=null,after=null;
 for(const event of events){if(event.kind!=='cursor')continue;if(event.t<=time)before=event;else{after=event;break;}}
 if(!before||before.visible===false)return null;
 if(after&&after.visible!==false&&after.t-before.t<500){const ratio=(time-before.t)/(after.t-before.t);return{x:before.x+(after.x-before.x)*ratio,y:before.y+(after.y-before.y)*ratio};}
 return{x:before.x,y:before.y};
}
export function paintCursor(ctx,cursor){if(!cursor)return;ctx.save();ctx.beginPath();ctx.arc(cursor.x,cursor.y,22,0,Math.PI*2);ctx.fillStyle='rgba(228,70,79,.2)';ctx.fill();ctx.lineWidth=3;ctx.strokeStyle='#b92735';ctx.stroke();ctx.beginPath();ctx.arc(cursor.x,cursor.y,4,0,Math.PI*2);ctx.fillStyle='#b92735';ctx.fill();ctx.restore();}
