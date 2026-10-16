/* Local UI only. Authentication, tutor rules and reply review live on the server. */
(()=>{
 if(window.OLevelsAskAI)return;
 const host=document.createElement('div');host.id='olevels-ask-ai';document.body.append(host);
 const root=host.attachShadow({mode:'open'});
 root.innerHTML=`<style>
 :host{font:16px/1.5 system-ui,sans-serif;color:#263449}*{box-sizing:border-box}[hidden]{display:none!important}
 dialog{color:inherit;width:min(460px,calc(100vw - 24px));max-height:calc(100dvh - 24px);padding:0;border:1px solid #d8dee8;border-radius:20px;box-shadow:0 16px 70px #172b4d40;margin:auto 20px 90px auto;background:#fff}
 dialog::backdrop{background:#172b4d40}header{display:flex;justify-content:space-between;align-items:center;padding:18px 20px;border-bottom:1px solid #e5e9f0}h2{font-size:23px;margin:0}button,textarea{font:inherit}button{cursor:pointer;border:1px solid #d8dee8;border-radius:10px;min-height:44px;padding:9px 13px;background:white;color:inherit}button:disabled{cursor:not-allowed;opacity:.5}button:focus-visible,textarea:focus-visible{outline:3px solid #195d9b;outline-offset:3px}.body{padding:0 20px 18px;max-height:calc(100dvh - 115px);overflow:auto}.intro{margin:16px 0 8px}.privacy{font-size:12px;color:#556278;margin:8px 0}.starters{display:flex;gap:8px;flex-wrap:wrap}.starters button{font-size:13px;background:#f4f6fa}.messages{max-height:230px;overflow:auto;margin:14px 0;overscroll-behavior:contain}.message{padding:10px 12px;border-radius:12px;background:#f1f4f8;margin:8px 0;white-space:pre-wrap;overflow-wrap:anywhere}.message.user{background:#eaf2fd;margin-left:25px}.message strong{display:block;font-size:12px;margin-bottom:4px}.message p{margin:0}label{display:block;font-weight:600;margin-bottom:6px}textarea{display:block;resize:vertical;width:100%;min-height:84px;max-height:150px;border:1px solid #aeb9c9;border-radius:10px;padding:10px}.actions{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:10px}.send{background:#195d9b;border-color:#195d9b;color:white;font-weight:600}.status{font-size:14px;margin:10px 0;min-height:21px}.reset{font-size:13px}.count{font-size:12px;color:#556278;text-align:right;margin:3px 0}
 @media(max-width:600px){dialog{margin:auto;max-height:calc(100dvh - 16px)}.body{max-height:calc(100dvh - 100px)}.messages{max-height:28dvh}}
 </style><dialog aria-labelledby="ai-title" aria-describedby="ai-intro"><header><h2 id="ai-title">Ask AI</h2><button class="close" aria-label="Close Ask AI">✕</button></header><div class="body"><p class="intro" id="ai-intro">Let’s learn together. Ask about a school subject or how to study. I give hints, not final answers to exam questions.</p><div class="starters"><button disabled>Help me understand a topic</button><button disabled>Help me plan my revision</button></div><div class="messages" role="log" aria-label="Study conversation" aria-live="polite" aria-relevant="additions text"></div><p class="status" role="status" aria-live="polite"></p><button class="retry" hidden>Try connecting again</button><form><label for="ai-message">What would you like help with?</label><textarea id="ai-message" maxlength="2000" placeholder="Tell me the topic and what is confusing you…" required disabled></textarea><p class="count">0 / 2000</p><div class="actions"><button class="reset" type="button" disabled>New chat</button><button class="send" type="submit" disabled>Send question →</button></div></form><p class="privacy">AI can make mistakes. Ask your teacher if you are unsure. Your messages are sent to our AI provider. Don’t share names, passwords or other private details. Chats expire after 30 minutes without activity.</p></div></dialog>`;
 const $=s=>root.querySelector(s),dialog=$('dialog'),input=$('textarea'),status=$('.status');
 const endpoint='/igcsehumanbiology/teach-me/api.php';let csrf='',version=0,busy=false,connected=false,messages=[],opener=null;
 function controls(){input.disabled=!connected||busy;$('.send').disabled=!connected||busy;$('.reset').disabled=!connected||busy||!messages.length;root.querySelectorAll('.starters button').forEach(b=>b.disabled=!connected||busy);$('.send').textContent=busy?'Please wait…':'Send question →';}
 function render(){
  $('.messages').replaceChildren();
  for(const message of messages){const bubble=document.createElement('div');bubble.className='message'+(message.role==='user'?' user':'');const who=document.createElement('strong');who.textContent=message.role==='user'?'You':'Study helper';const text=document.createElement('p');text.textContent=message.content;bubble.append(who,text);$('.messages').append(bubble);}
  $('.messages').scrollTop=$('.messages').scrollHeight;
 }
 async function request(action,body){
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),75000);
  try{const response=await fetch(endpoint+'?action='+action,{method:body?'POST':'GET',credentials:'same-origin',cache:'no-store',signal:controller.signal,headers:body?{'Content-Type':'application/json','X-CSRF-Token':csrf}:{},...(body?{body:JSON.stringify(body)}:{})});
   let data;try{data=await response.json();}catch{throw Error('Ask AI could not connect. Please try again.');}
   if(!response.ok){const error=Error(data.error||'Ask AI could not connect. Please try again.');error.status=response.status;throw error;}
   if(!Number.isInteger(data.version)||!Array.isArray(data.messages)||data.messages.some(m=>!['user','assistant'].includes(m.role)||typeof m.content!=='string'))throw Error('Ask AI could not read the conversation. Please reconnect.');return data;
  }catch(error){if(error.name==='AbortError')throw Error('That took too long. Close and reopen Ask AI before trying again.');throw error;}finally{clearTimeout(timer);}
 }
 async function connect(){
  if(busy)return;busy=true;connected=false;controls();status.textContent='Connecting to your study helper…';$('.retry').hidden=true;
  try{const data=await request('ask-ai-status');csrf=data.csrf;version=data.version;messages=data.messages;connected=typeof csrf==='string'&&csrf.length>0;if(!connected)throw Error('Please refresh the page and try again.');render();status.textContent='Ready. What are you learning today?';}
  catch(error){status.textContent=error.message;$('.retry').hidden=false;}finally{busy=false;controls();if(connected&&dialog.open)input.focus();}
 }
 $('.close').onclick=()=>dialog.close();dialog.addEventListener('close',()=>opener?.focus());
 $('.retry').onclick=connect;
 root.querySelectorAll('.starters button').forEach(button=>button.onclick=()=>{input.value=button.textContent==='Help me understand a topic'?'Help me understand ':'Help me make a revision plan for ';input.dispatchEvent(new Event('input'));input.focus();});
 input.oninput=()=>$('.count').textContent=`${input.value.length} / 2000`;
 async function submit(reset=false){
  if(busy||!connected)return;if(!reset&&!input.value.trim())return;
  busy=true;controls();status.textContent=reset?'Starting a new chat…':'Thinking about how to help you…';$('.retry').hidden=true;
  try{const data=await request(reset?'ask-ai-reset':'ask-ai',{version,...(reset?{}:{message:input.value.trim()})});version=data.version;messages=data.messages;render();input.value='';input.dispatchEvent(new Event('input'));status.textContent=reset?'Ready for a new study question.':'Your study helper has replied.';}
  catch(error){status.textContent=error.message;if(!error.status||[401,403,409,503].includes(error.status)){connected=false;$('.retry').hidden=false;}}
  finally{busy=false;controls();if(connected&&dialog.open)input.focus();}
 }
 $('form').onsubmit=e=>{e.preventDefault();submit();};
 $('.reset').onclick=()=>{if(confirm('Start a new chat? The current conversation will be cleared.'))submit(true);};
 window.OLevelsAskAI={open(){window.OLevelsPencil?.deactivate();if(dialog.open)return;opener=document.activeElement?.shadowRoot?.activeElement||document.activeElement;dialog.showModal();if(!busy)connect();}};
})();
