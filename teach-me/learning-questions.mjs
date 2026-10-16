export function installQuestionWidgets(data){window.QDATA=data;window.QW_ROOT='/igcsehumanbiology/';

(function(){
var R=window.QW_ROOT||'',D=window.QDATA||{};
var RE=/question-images\/(?:[a-f0-9]{20}\/)?([^\/?#"']+?)\.(png|webp|jpe?g)(?:[?#].*)?$/;
var SL=/^([12]H)-(January|June|November)-(\d{4})(-R)?-Q(\d{1,2})(?:-([a-z]+(?:\([ivx]+\))?))?(-MS)?$/;
function parse(src){var m=RE.exec(src||'');if(!m)return null;var s=m[1];if(s.indexOf('explainer')===0)return null;var k=SL.exec(s);if(!k)return null;
 var q=parseInt(k[5],10);return {slug:s,base:k[1]+'-'+k[2]+'-'+k[3]+(k[4]||'')+'-Q'+(q<10?'0'+q:q),paper:k[1]+' '+k[2]+' '+k[3]+(k[4]?' (R)':''),q:q,part:k[6]||null,ms:!!k[7]};}
function esc(t){return String(t==null?'':t).replace(/[&<>]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c];});}
function pdf(p,kind,page){var u=encodeURI(R+'past papers/'+p+' '+kind+'.pdf');if(page)u+='#page='+page;return u;}
function msTable(rows){var keep=[0,1,2,3,4,5].filter(function(i){return rows.some(function(r){return r[i]&&String(r[i]).trim();});});
 var names=['Part','Working','Answer','','Marks','Notes'];var h='<table class="qw-ms"><thead><tr>'+keep.map(function(i){return '<th>'+esc(names[i])+'</th>';}).join('')+'</tr></thead><tbody>';
 rows.forEach(function(r){h+='<tr>'+keep.map(function(i){return '<td>'+esc(r[i])+'</td>';}).join('')+'</tr>';});return h+'</tbody></table>';}
function textPane(info,e){var pp=e&&e.parts&&info.part&&e.parts[info.part];
 if(info.ms){if(pp&&pp.ms)return '<pre class="qw-pre">'+esc(pp.ms)+'</pre>';if(e&&e.ms&&e.ms.length)return msTable(e.ms);
  return '<p class="qw-none">The mark scheme text was not extracted for this paper. Use the picture or the mark-scheme PDF.</p>';}
 var t=(pp&&pp.t)||(e&&e.t);if(t)return '<pre class="qw-pre">'+esc(t)+'</pre>';
 return '<p class="qw-none">The text of this question was not extracted. Use the picture or open the past paper.</p>';}
function show(w,v){w.querySelector('.qw-pic').hidden=(v!=='pic');w.querySelector('.qw-txt').hidden=(v!=='txt');
 if(v==='pic')w.querySelector('.qw-note').hidden=true;
 w.querySelectorAll('button.qw-b').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-v')===v);});}
function build(img){if(!img.closest('.learning-question'))return;var info=parse(img.getAttribute('src'));if(!info)return;
 var w=img.closest?img.closest('.qw'):null;if(w&&w.getAttribute('data-slug')===info.slug)return;
 var e=D[info.base]||null;
 if(!w){w=document.createElement('div');w.className='qw';img.parentNode.insertBefore(w,img);
  w.innerHTML='<div class="qw-bar"></div><div class="qw-pic"></div><div class="qw-txt" hidden></div><div class="qw-note" hidden></div>';
  w.querySelector('.qw-pic').appendChild(img);
  w.addEventListener('click',function(ev){var b=ev.target.closest('button.qw-b');if(!b)return;ev.preventDefault();show(w,b.getAttribute('data-v'));});}
 w.setAttribute('data-slug',info.slug);w.setAttribute('data-base',info.base);
 var id='q-'+info.slug;var other=document.getElementById(id);if(!other||other===w)w.id=id;
 var marks=e&&e.m?' · '+e.m+' marks':'';var era=e&&e.era==='4MA0'?' · 4MA0':'';
 var label=(info.ms?'Mark scheme · ':'')+info.paper+' · Question '+info.q+(info.part?'('+info.part+')':'')+marks+era;
 var page=e&&e.pg?e.pg:null;
 w.querySelector('.qw-bar').innerHTML='<span class="qw-tag">'+esc(label)+'</span><span class="qw-btns">'+
  '<button type="button" class="qw-b on" data-v="pic">🖼 Picture</button>'+
  '<button type="button" class="qw-b" data-v="txt">📝 Text</button>'+
  '<a class="qw-b" href="'+pdf(info.paper,'QP',page)+'" target="_blank" rel="noopener">📄 Past paper · Q'+info.q+(page?' · page '+page:'')+'</a>'+
  '<a class="qw-b" href="'+pdf(info.paper,'MS',null)+'" target="_blank" rel="noopener">✅ Mark scheme PDF</a></span>';
 w.querySelector('.qw-txt').innerHTML=textPane(info,e);
 show(w,'pic');
 var pp=e&&e.parts&&info.part&&e.parts[info.part];var d=(pp&&(info.ms?pp.dm:pp.dq))||(e&&(info.ms?e.dm:e.dq));
 if(d&&d[0]&&d[1]){img.setAttribute('width',d[0]);img.setAttribute('height',d[1]);}
 if(!img.getAttribute('loading'))img.setAttribute('loading','lazy');
 var fail=function(){var n=w.querySelector('.qw-note');n.textContent='The picture is not available here yet, so this is the text of the '+(info.ms?'mark scheme.':'question.');n.hidden=false;show(w,'txt');};
 img.onerror=fail;
 if(img.complete&&img.naturalWidth===0&&img.getAttribute('src'))fail();}
var pending=false;
function scan(){pending=false;var imgs=document.querySelectorAll('img');for(var i=0;i<imgs.length;i++)build(imgs[i]);}
function queue(){if(!pending){pending=true;(window.requestAnimationFrame||setTimeout)(scan);}}
function jump1(){if(location.hash&&location.hash.indexOf('#q-')===0){var el=document.getElementById(location.hash.slice(1));if(el){var d=el.closest('details');while(d){d.open=true;d=d.parentElement&&d.parentElement.closest('details');}el.scrollIntoView();}}}
function jump(){jump1();[300,1000,2500].forEach(function(t){setTimeout(jump1,t);});window.addEventListener('load',jump1);}
function nav(){var N=window.QW_NAV;if(!N||document.querySelector('.qw-nav'))return;
 var h='<a class="qw-nav-home" href="'+N.home+'">🏠 A-Grade Plan home</a>';
 if(N.plan)h+='<a href="'+N.plan+'">📋 The plan</a>';
 if(N.title){h+='<span class="qw-nav-sep">|</span><span class="qw-nav-block">'+esc(N.title)+'</span>';(N.links||[]).forEach(function(l){h+='<a href="'+l[1]+'">'+esc(l[0])+'</a>';});}
 if(N.wb&&N.wb.length){h+='<span class="qw-nav-sep">|</span>';N.wb.forEach(function(l){h+='<a href="'+l[1]+'">'+esc(l[0])+'</a>';});}
 var el=document.createElement('nav');el.className='qw-nav';el.innerHTML=h;var bar=document.querySelector('.ol-bar');if(bar){bar.insertAdjacentElement('afterend',el);}else{document.body.insertBefore(el,document.body.firstChild);}}
new window.MutationObserver(queue).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['src']});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){scan();});else{scan();}
})();

}
