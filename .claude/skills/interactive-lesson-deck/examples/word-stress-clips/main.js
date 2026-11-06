(function(){
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const slides=$$('.slide');let cur=0;

/* ---------- navigation (same contract as map-labelling) ---------- */
const STEP={},ENTER={},LEAVE=[];
const jump=$('#jump');
slides.forEach((s,i)=>{const o=document.createElement('option');o.value=i;o.textContent=(i+1)+'. '+(s.dataset.title||'');jump.appendChild(o)});
jump.onchange=()=>show(+jump.value);
function show(i){LEAVE.forEach(f=>f());cur=Math.max(0,Math.min(slides.length-1,i));slides.forEach((s,k)=>s.classList.toggle('on',k===cur));
  $('#count').textContent=(cur+1)+' / '+slides.length;jump.value=cur;SFX.stop();
  const s=slides[cur];if(s.id&&ENTER[s.id])ENTER[s.id](s);
  try{history.replaceState(null,'','#s'+(cur+1))}catch(e){}
  window.dispatchEvent(new Event('deck:show'))}
window.DECK={show:i=>show(i),cur:()=>cur,indexOf:id=>slides.findIndex(s=>s.id===id)};
const stepOf=s=>+(s.dataset.step||0);
function setStep(s,n){s.dataset.step=n;STEP[s.id]&&STEP[s.id](s,n)}
function next(){const s=slides[cur],m=+(s.dataset.steps||0);if(m&&stepOf(s)<m){setStep(s,stepOf(s)+1);return}show(cur+1)}
function prev(){const s=slides[cur],m=+(s.dataset.steps||0);if(m&&stepOf(s)>0){setStep(s,stepOf(s)-1);return}show(cur-1)}
$('#prev').onclick=prev;$('#next').onclick=next;
$('#fs').onclick=()=>{const el=document.documentElement;if(document.fullscreenElement){document.exitFullscreen&&document.exitFullscreen().catch(()=>{})}else if(el.requestFullscreen){el.requestFullscreen().catch(()=>{})}};
document.addEventListener('keydown',e=>{if(e.target.closest('input,textarea,select,[contenteditable]'))return;
  if(e.key==='ArrowRight'||e.key==='PageDown'){next();e.preventDefault()}else if(e.key==='ArrowLeft'||e.key==='PageUp'){prev();e.preventDefault()}});

const sylHTML=(syl,s,cls='')=>syl.split('|').map((x,i)=>`<span class="${i===s?'hi':''}">${i===s?x.toUpperCase():x}</span>`).join('');

/* ---------- warm-up: A/B vote ---------- */
STEP.sWarm=(s,n)=>{$$('.vcard',s).forEach((c,i)=>c.classList.toggle('in',i<n));if(n)SFX.pop(n*2)};
$('#sWarm').addEventListener('click',e=>{const c=e.target.closest('.vcard');if(!c)return;const t=$('.tally',c);t.textContent=+t.textContent+1;SFX.tick()});

/* ---------- what is stress: build + hum ---------- */
STEP.sWhat=(s,n)=>{const x=$('.stx',s);[1,2,3].forEach(k=>x.classList.toggle('s'+k,n>=k));$$('.qual li',s).forEach((li,i)=>li.classList.toggle('in',i<n));
  if(n===1)SFX.thud();else if(n===2)SFX.zip();else if(n===3)SFX.grow()};
let actx=null;
function hum(seq){if(!SFX.on)return;const A=window.AudioContext||window.webkitAudioContext;if(!A)return;actx=actx||new A();if(actx.state==='suspended')actx.resume();
  let t=actx.currentTime+.05;seq.forEach(([f,d,v])=>{const o=actx.createOscillator(),g=actx.createGain();o.type='triangle';o.frequency.setValueAtTime(f,t);
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.02);g.gain.setValueAtTime(v,t+d-.05);g.gain.linearRampToValueAtTime(0,t+d);o.connect(g).connect(actx.destination);o.start(t);o.stop(t+d+.02);t+=d+.06})}

/* ---------- video clips ---------- */
/* Times are seconds in the ORIGINAL clip the teacher received. The pre-cut files in media/
   start at `off`. If they are missing, the teacher picks the original file and the deck
   plays only the listed segments (the Modern Family clip has lines to skip in between). */
const CLIPS={
  kfp:{pick:'Kung Fu Panda (clip Oogway, 26 giây)',segs:[{label:'0:14 – 0:25',src:'kfp.mp4',off:13.8,a:13.8,b:24.8}],
    lines:[[14.28,'Yesterday is history.'],[17.08,'Tomorrow is a mystery, but today is a gift.'],[21.62,'That is why it is called the present.']]},
  mf:{pick:'Modern Family (clip nhà hàng, 59 giây)',segs:[{label:'Đoạn 1 · 0:00 – 0:11',src:'mf1.mp4',off:0,a:0,b:11.0},{label:'Đoạn 2 · 0:24 – 0:30',src:'mf2.mp4',off:23.6,a:23.6,b:29.8}],
    lines:[[0,'Can I get you anything else?'],[1.58,'Actually, we’re just trying to teach our daughter about your country.'],[4.64,'And as I’m saying that, I’m hoping you’re from Vietnam.'],[6.88,'I was born there. — So was Lily.'],[9.36,'Oh, it’s a beautiful country.'],
      [23.84,'It’s important that you celebrate the culture of your ancestors.'],[28.4,'You are Vietnamese.']]}
};
const ORIG={};           // clip key -> object URL of the original file the teacher picked
const players=[];
const fmt=t=>Math.floor(t/60)+':'+String(Math.floor(t%60)).padStart(2,'0');
$$('.vid').forEach(box=>{
  const key=box.dataset.clip,C=CLIPS[key],loop=!!box.dataset.loop;
  box.innerHTML=`<div class="scr"><video playsinline preload="metadata"></video>
    <div class="vempty"><b>Chưa có video</b><span>Chọn file gốc: ${C.pick}.<br>Slide chỉ phát đúng các đoạn đã chọn.</span>
    <label class="b pri">Chọn file video<input type="file" accept="video/*" hidden></label></div></div>
   <div class="vbar">${C.segs.map((g,i)=>`<button class="b sm" data-v="seg" data-i="${i}">▶ ${g.label}</button>`).join('')}
    <button class="b sm" data-v="slow">1×</button>${loop?'<button class="b sm" data-v="loop">Lặp: tắt</button>':''}<button class="b sm" data-v="cc">Phụ đề</button><span class="vt"></span></div>
   <div class="vcc" hidden>${C.lines.map(l=>`<p data-t="${l[0]}">${l[1]}</p>`).join('')}</div>`;
  const v=$('video',box),P={box,v,key,seg:null,loop:false,rate:1,src:null};players.push(P);
  const segSrc=g=>ORIG[key]||('./'+g.src), segT=(g,t)=>ORIG[key]?t:t-g.off, toOrig=t=>P.seg?(ORIG[key]?t:t+P.seg.off):t;
  P.load=(g)=>{const u=segSrc(g);if(P.src!==u){P.src=u;v.src=u}};
  v.addEventListener('loadedmetadata',()=>box.classList.add('ready'));
  v.addEventListener('error',()=>{if(!ORIG[key])box.classList.remove('ready')});
  v.addEventListener('timeupdate',()=>{const g=P.seg;if(!g)return;const t=v.currentTime,end=segT(g,g.b);
    if(t>=end-.03){if(P.loop){v.currentTime=segT(g,g.a)}else{v.pause();v.currentTime=end}}
    const o=toOrig(v.currentTime);$('.vt',box).textContent=fmt(o);
    let act=null;$$('.vcc p',box).forEach(p=>{if(+p.dataset.t<=o+.05)act=p});$$('.vcc p',box).forEach(p=>p.classList.toggle('on',p===act&&!v.paused))});
  const paint=()=>$$('[data-v="seg"]',box).forEach((b,i)=>{const on=P.seg===C.segs[i]&&!v.paused;b.classList.toggle('on',on);b.textContent=(on?'❚❚ ':'▶ ')+C.segs[i].label});
  v.addEventListener('play',paint);v.addEventListener('pause',paint);
  box.addEventListener('change',e=>{const f=e.target.files&&e.target.files[0];if(!f)return;if(ORIG[key])URL.revokeObjectURL(ORIG[key]);ORIG[key]=URL.createObjectURL(f);
    players.filter(p=>p.key===key).forEach(p=>{p.src=null;p.seg=null;p.load(C.segs[0]);p.box.classList.add('ready')});SFX.ding()});
  box.addEventListener('click',e=>{const b=e.target.closest('[data-v]');if(!b)return;
    switch(b.dataset.v){
      case 'seg':{const g=C.segs[+b.dataset.i];if(P.seg===g&&!v.paused){v.pause();break}
        const same=P.seg===g&&v.currentTime<segT(g,g.b)-.1&&v.currentTime>segT(g,g.a);P.seg=g;P.load(g);
        const go=()=>{if(!same)v.currentTime=segT(g,g.a);v.playbackRate=P.rate;v.play().catch(()=>{})};
        v.readyState>=1?go():v.addEventListener('loadedmetadata',go,{once:true});break}
      case 'slow':P.rate=P.rate===1?.75:1;v.playbackRate=P.rate;b.textContent=P.rate+'×';b.classList.toggle('on',P.rate!==1);SFX.tick();break;
      case 'loop':P.loop=!P.loop;b.textContent='Lặp: '+(P.loop?'bật':'tắt');b.classList.toggle('on',P.loop);SFX.tick();break;
      case 'cc':{const x=$('.vcc',box);x.hidden=!x.hidden;b.classList.toggle('on',!x.hidden);SFX.tick();break}}});
  P.load(C.segs[0]);
});
LEAVE.push(()=>players.forEach(p=>p.v.pause()));

/* ---------- word cards: click 1 = syllables, click 2 = stress ---------- */
function wcLevel(w,l){const syl=w.dataset.syl,s=+w.dataset.s,word=w.dataset.word||(w.dataset.word=w.textContent.trim());
  w.classList.toggle('l1',l===1);w.classList.toggle('l2',l===2);w.dataset.l=l;
  if(l===0){w.innerHTML=word;return}
  const n=syl.split('|').length;
  if(l===1){w.innerHTML=`${word}<span class="dots">${'<i></i>'.repeat(n)}</span>`;
    $$('.dots i',w).forEach((d,i)=>d.style.animationDelay=(i*.22)+'s');for(let i=0;i<n;i++)setTimeout(()=>SFX.tick(),i*220);return}
  w.innerHTML=`<span class="syl2">${sylHTML(syl,s)}</span>${w.dataset.ipa?`<span class="ipa">${w.dataset.ipa}</span>`:''}`;
  $$('.syl2 span',w).forEach((d,i)=>d.style.animationDelay=(i*.12)+'s');setTimeout(()=>SFX.ding(),n*120)}
document.addEventListener('click',e=>{const w=e.target.closest('.wc');if(!w)return;wcLevel(w,((+w.dataset.l||0)+1)%3)});

/* ---------- noun / verb + random caller ---------- */
STEP.sNV=(s,n)=>{$$('.nvr',s).forEach((r,i)=>r.classList.toggle('in',i<n));if(n)SFX.pop(n+1)};
const NV=[['present','pre|sent'],['record','re|cord'],['object','ob|ject']];let call=null;
function doCall(){const s=$('#sNV'),box=$('.callbox',s);let k;do{k=[Math.floor(Math.random()*3),Math.floor(Math.random()*2)]}while(call&&k[0]===call[0]&&k[1]===call[1]);call=k;
  $('.cw',box).textContent=NV[k[0]][0];$('.cr',box).textContent=k[1]?'động từ':'danh từ';box.classList.remove('roll');void box.offsetWidth;box.classList.add('roll');SFX.whoosh()}
function callAns(){if(!call)return;const box=$('#sNV .callbox');const [w,syl]=NV[call[0]],p=syl.split('|');
  $('.cw',box).innerHTML=call[1]?`${p[0]}<b class="st">${p[1].toUpperCase()}</b>`:`<b class="st">${p[0].toUpperCase()}</b>${p[1]}`;SFX.ding()}

/* ---------- -ese: stress hops to the suffix ---------- */
$$('.er [data-syl]').forEach(x=>x.innerHTML=sylHTML(x.dataset.syl,+x.dataset.s));
STEP.sEse=(s,n)=>{$$('.er',s).forEach((r,i)=>{const on=i<n;if(on&&!r.classList.contains('in')){r.classList.add('in');setTimeout(()=>{if(r.classList.contains('in')){r.classList.add('go');SFX.whoosh();setTimeout(()=>SFX.ding(),300)}},650);SFX.pop(i+1)}
  if(!on)r.classList.remove('in','go')})};

/* ---------- game: catch the stress ---------- */
const GAME=[['yesterday','yes|ter|day',0],['tomorrow','to|mor|row',1],['history','his|to|ry',0],['present (n.)','pre|sent',0],['present (v.)','pre|sent',1],
  ['record (v.)','re|cord',1],['Vietnam','vi|et|nam',2],['Vietnamese','vi|et|na|mese',3],['important','im|por|tant',1],['celebrate','cel|e|brate',0],
  ['ancestors','an|ces|tors',0],['beautiful','beau|ti|ful',0],['Chinese','chi|nese',1],['Japanese','ja|pa|nese',2],['concerned','con|cerned',1],['Portuguese','por|tu|guese',2]];
let order=[],gi=0,done=false;
function shuffle(){order=GAME.map((_,i)=>i);for(let i=order.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[order[i],order[j]]=[order[j],order[i]]}gi=0}
function gRender(){const s=$('#sGame'),[w,syl]=GAME[order[gi]],m=/^(.*?)( \(.+\))?$/.exec(w);done=false;
  $('.gword',s).innerHTML=`${m[1]}${m[2]?`<small>${m[2].trim()}</small>`:''}`;
  $('.gsyl',s).innerHTML=syl.split('|').map((x,i)=>`<button data-i="${i}">${x}</button>`).join('');
  $('.gnote',s).textContent='';$('.gcount',s).textContent=(gi+1)+' / '+GAME.length}
function gReveal(pick){const s=$('#sGame'),[,syl,st]=GAME[order[gi]];if(done)return;done=true;
  $$('.gsyl button',s).forEach((b,i)=>{b.textContent=i===st?syl.split('|')[i].toUpperCase():syl.split('|')[i];
    if(i===st)b.classList.add(pick===undefined?'hi':'ok');else if(i===pick)b.classList.add('no')});
  if(pick===undefined)SFX.ding();else if(pick===st){SFX.cheer();$('.gnote',s).textContent='Chính xác! Cộng điểm cho nhóm (B).'}
  else{SFX.buzz();$('.gnote',s).textContent='Chưa đúng: trọng âm ở âm tiết '+(st+1)+'.'}}
$('#sGame').addEventListener('click',e=>{const b=e.target.closest('.gsyl button');if(b)gReveal(+b.dataset.i)});
shuffle();gRender();

/* ---------- shadowing + homework ---------- */
STEP.sShadow=(s,n)=>{$$('.stepper li',s).forEach((li,i)=>{li.classList.toggle('done',i<n-1);li.classList.toggle('cur',i===n-1)});if(n)SFX.pop(n+1)};
STEP.sHome=(s,n)=>{$$('.hwc',s).forEach((c,i)=>c.classList.toggle('in',i<n));if(n)SFX.pop(n*2)};

/* ---------- timers ---------- */
$$('.timer').forEach(t=>{const total=+t.dataset.sec;let left=total,iv=null;const C=2*Math.PI*44;
  t.innerHTML=`<div class="ring"><svg viewBox="0 0 100 100"><circle class="bg" cx="50" cy="50" r="44"/><circle class="fg" cx="50" cy="50" r="44" stroke-dasharray="${C}" stroke-dashoffset="0"/></svg><span class="tt"></span></div>
   <div><div class="tl">${t.dataset.label} · ${total/60}′</div><div class="tb"><button class="b pri sm" data-t="go">▶</button><button class="b sm" data-t="reset">↺</button></div></div>`;
  const fg=$('.fg',t),tt=$('.tt',t),go=$('[data-t="go"]',t);
  const paint=()=>{tt.textContent=Math.floor(left/60)+':'+String(left%60).padStart(2,'0');fg.style.strokeDashoffset=C*(1-left/total);t.classList.toggle('low',left<=30&&left>0);t.classList.toggle('end',left===0)};
  const stop=()=>{clearInterval(iv);iv=null;go.textContent='▶'};
  t.addEventListener('click',e=>{const b=e.target.closest('[data-t]');if(!b)return;
    if(b.dataset.t==='go'){if(iv){stop();return}if(left===0)left=total;go.textContent='❚❚';SFX.pop(3);
      iv=setInterval(()=>{left=Math.max(0,left-1);if(left<=5&&left>0)SFX.tick();paint();if(left===0){stop();SFX.cheer();setTimeout(()=>SFX.ding(),300)}},1000)}
    else{stop();left=total;paint()}});paint()});

/* ---------- misc clicks ---------- */
document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;
  switch(b.dataset.act){
    case 'step':next();break;
    case 'warm-ans':{const v=$('#sWarm .vote');if(stepOf($('#sWarm'))<2)setStep($('#sWarm'),2);v.classList.toggle('ans');b.classList.toggle('on');if(v.classList.contains('ans'))SFX.chime();break}
    case 'hum':hum([[196,.22,.08],[294,.5,.28],[185,.22,.07]]);break;
    case 'all-on':{const s=b.closest('.slide'),ws=$$('.wc',s),on=!ws.every(w=>+w.dataset.l===2);ws.forEach((w,i)=>setTimeout(()=>wcLevel(w,on?2:0),i*120));b.classList.toggle('on',on);break}
    case 'call':doCall();break;
    case 'call-ans':callAns();break;
    case 'g-show':gReveal();break;
    case 'g-next':gi++;if(gi>=GAME.length){shuffle();SFX.cheer()}else SFX.whoosh();gRender();break}});

Object.keys(STEP).forEach(id=>{const s=$('#'+id);if(s)STEP[id](s,0)});
SFX.stop();
const m=/^#s(\d+)$/.exec(location.hash);show(m?+m[1]-1:0);
})();
