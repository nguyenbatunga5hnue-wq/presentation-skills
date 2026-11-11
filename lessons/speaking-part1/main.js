(function(){
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const slides=$$('.slide');let cur=0;

/* ---------- navigation ---------- */
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

/* ---------- read aloud (British voice if the browser has one) ---------- */
let voice=null;
function pickVoice(){const v=(window.speechSynthesis&&speechSynthesis.getVoices())||[];voice=v.find(x=>/en-GB/i.test(x.lang))||v.find(x=>/^en/i.test(x.lang))||null}
if(window.speechSynthesis){pickVoice();speechSynthesis.onvoiceschanged=pickVoice}
function say(t){if(!window.speechSynthesis)return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='en-GB';if(voice)u.voice=voice;u.rate=.9;speechSynthesis.speak(u)}
LEAVE.push(()=>{window.speechSynthesis&&speechSynthesis.cancel()});

/* ---------- A-R-E build ---------- */
STEP.sARE=(s,n)=>{s.classList.toggle('s1',n>=1);s.classList.toggle('s2',n>=2);
  $$('.arow',s).forEach((r,i)=>r.classList.toggle('in',n>=i+2));
  $('.mbar i',s).style.width=n<1?'0':n===1?'8%':Math.min(100,(n-1)*33)+'%';
  $('.aremeter',s).classList.toggle('done',n>=4);
  if(!n)return;if(n===1)SFX.thud();else if(n===4)SFX.chime();else SFX.pop(n)};

/* ---------- question slides: hints → frame with blanks → model answer ---------- */
$$('.qslide').forEach(s=>{STEP[s.id]=(s,n)=>{
  s.classList.toggle('hints',n>=1);s.classList.toggle('frame',n>=2);s.classList.toggle('model',n>=3);
  $$('.gk',s).forEach(g=>g.classList.toggle('show',n>=3));
  if(n===1)SFX.pop(2);else if(n===2)SFX.whoosh();else if(n===3)SFX.chime()}});

/* ---------- vocab flip cards ---------- */
document.addEventListener('click',e=>{
  const sp=e.target.closest('[data-say]');if(sp){e.stopPropagation();say(sp.dataset.say);return}
  const v=e.target.closest('.vc');if(v){v.classList.toggle('on');SFX.tick();return}
  const g=e.target.closest('.gk');if(g){g.classList.toggle('show');if(g.classList.contains('show'))SFX.ding();return}
});

/* ---------- timers ---------- */
$$('.timer').forEach(t=>{const total=+t.dataset.sec;let left=total,iv=null;const C=2*Math.PI*44;
  t.innerHTML=`<div class="ring"><svg viewBox="0 0 100 100"><circle class="bg" cx="50" cy="50" r="44"/><circle class="fg" cx="50" cy="50" r="44" stroke-dasharray="${C}" stroke-dashoffset="0"/></svg><span class="tt"></span></div>
   <div><div class="tl">${t.dataset.label} · ${total%60?total+'″':total/60+'′'}</div><div class="tb"><button class="b pri sm" data-t="go">▶</button><button class="b sm" data-t="reset">↺</button></div></div>`;
  const fg=$('.fg',t),tt=$('.tt',t),go=$('[data-t="go"]',t);
  const paint=()=>{tt.textContent=Math.floor(left/60)+':'+String(left%60).padStart(2,'0');fg.style.strokeDashoffset=C*(1-left/total);t.classList.toggle('low',left<=10&&left>0);t.classList.toggle('end',left===0)};
  const stop=()=>{clearInterval(iv);iv=null;go.textContent='▶'};
  t.reset=()=>{stop();left=total;paint()};
  t.addEventListener('click',e=>{const b=e.target.closest('[data-t]');if(!b)return;
    if(b.dataset.t==='go'){if(iv){stop();return}if(left===0)left=total;go.textContent='❚❚';SFX.pop(3);
      iv=setInterval(()=>{left=Math.max(0,left-1);if(left<=5&&left>0)SFX.tick();paint();if(left===0){stop();SFX.cheer();setTimeout(()=>SFX.ding(),300)}},1000)}
    else{t.reset()}});paint()});
LEAVE.push(()=>{const s=slides[cur];if(s)$$('.timer',s).forEach(t=>t.reset&&t.reset())});

/* ---------- random question picker ---------- */
const PD=JSON.parse($('#pickData').textContent);let picked=null,last=-1,spinning=false;
const pickCard=$('#pickCard');
function pick(){if(spinning)return;const on=$$('[data-pt].on').map(b=>b.dataset.pt);const pool=PD.map((q,i)=>i).filter(i=>on.includes(PD[i].t));
  if(!pool.length){$('#pQ').textContent='Chọn ít nhất một chủ đề';SFX.buzz();return}
  spinning=true;pickCard.classList.remove('hint','land');let k=0;const N=12;
  const spin=()=>{let i=pool[Math.floor(Math.random()*pool.length)];if(k===N&&pool.length>1)while(i===last)i=pool[Math.floor(Math.random()*pool.length)];
    const q=PD[i];$('#pTopic').textContent=q.name;$('#pQ').textContent=q.q;SFX.tick();
    if(k++<N){setTimeout(spin,60+k*12)}else{picked=q;last=i;spinning=false;
      $('#pK').innerHTML=q.k.map((w,j)=>`<span class="chip3" style="--i:${j}">${w}</span>`).join('');pickCard.classList.add('land');SFX.ding()}};
  spin()}
document.addEventListener('click',e=>{const b=e.target.closest('[data-act],[data-pt]');if(!b)return;
  if(b.dataset.pt){b.classList.toggle('on');SFX.tick();return}
  switch(b.dataset.act){
    case 'step':next();break;
    case 'vc-all':{const all=$$('.vc',slides[cur]),on=!all.every(f=>f.classList.contains('on'));all.forEach((f,i)=>setTimeout(()=>f.classList.toggle('on',on),i*45));SFX.whoosh();break}
    case 'gk-all':{const all=$$('.gk',slides[cur]),on=!all.every(g=>g.classList.contains('show'));all.forEach((g,i)=>setTimeout(()=>g.classList.toggle('show',on),i*150));if(on)SFX.chime();break}
    case 'pick':pick();break;
    case 'pick-hint':if(picked){pickCard.classList.toggle('hint');SFX.pop(2)}break;
    case 'pick-say':if(picked)say(picked.q);break}});

Object.keys(STEP).forEach(id=>{const s=$('#'+id);if(s)STEP[id](s,0)});
SFX.stop();
const m=/^#s(\d+)$/.exec(location.hash);show(m?+m[1]-1:0);
})();
