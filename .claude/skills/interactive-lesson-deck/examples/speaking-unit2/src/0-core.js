/* ===== core: navigation, steps, timers, scoreboard bridge, TTS ===== */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const slides=$$('.slide');let cur=0;
const STEP={},ENTER={},LEAVE=[];
const jump=$('#jump');
slides.forEach((s,i)=>{const o=document.createElement('option');o.value=i;o.textContent=(i+1)+'. '+(s.dataset.title||'');jump.appendChild(o)});
jump.onchange=()=>show(+jump.value);
function show(i){LEAVE.forEach(f=>f(slides[cur]));cur=Math.max(0,Math.min(slides.length-1,i));slides.forEach((s,k)=>s.classList.toggle('on',k===cur));
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
document.addEventListener('click',e=>{const b=e.target.closest('[data-act="step"]');if(b){const s=b.closest('.slide');const m=+(s.dataset.steps||0);if(stepOf(s)<m)setStep(s,stepOf(s)+1)}});

/* ---------- timers ---------- */
function makeTimer(t){const total=+t.dataset.sec;let left=total,iv=null;const C=2*Math.PI*44;
  t.innerHTML=`<div class="ring"><svg viewBox="0 0 100 100"><circle class="bg" cx="50" cy="50" r="44"/><circle class="fg" cx="50" cy="50" r="44" stroke-dasharray="${C}" stroke-dashoffset="0"/></svg><span class="tt"></span></div>
   <div><div class="tl">${t.dataset.label||''}</div><div class="tb"><button class="b pri sm" data-t="go">▶</button><button class="b sm" data-t="reset">↺</button></div></div>`;
  const fg=$('.fg',t),tt=$('.tt',t),go=$('[data-t="go"]',t);
  const paint=()=>{tt.textContent=Math.floor(left/60)+':'+String(left%60).padStart(2,'0');fg.style.strokeDashoffset=C*(1-left/total);t.classList.toggle('low',left<=10&&left>0);t.classList.toggle('end',left===0)};
  const stop=()=>{clearInterval(iv);iv=null;go.textContent='▶'};
  t._reset=()=>{stop();left=total;paint()};
  t.addEventListener('click',e=>{const b=e.target.closest('[data-t]');if(!b)return;
    if(b.dataset.t==='go'){if(iv){stop();return}if(left===0)left=total;go.textContent='❚❚';SFX.pop(3);
      iv=setInterval(()=>{left=Math.max(0,left-1);if(left<=5&&left>0)SFX.tick();paint();if(left===0){stop();SFX.cheer();setTimeout(()=>SFX.ding(),300)}},1000)}
    else t._reset()});paint()}
$$('.timer').forEach(makeTimer);

/* ---------- scoreboard bridge (uses the runtime's own +/− buttons) ---------- */
function groups(){try{const v=JSON.parse(localStorage.getItem('c19t3:score'));if(v&&v.groups)return v.groups}catch(e){}
  const n=$$('#board .team').length||4;return Array.from({length:n},(_,i)=>({name:($('#sc-name-'+i)||{}).value||'Nhóm '+(i+1)}))}
function addPoints(gi,n){if(!n)return;const b=document.createElement('button');b.dataset.sc=n;b.dataset.gi=gi;b.hidden=true;document.body.appendChild(b);b.click();b.remove()}

/* ---------- text to speech (British voice when available) ---------- */
function say(txt){try{const S=window.speechSynthesis;if(!S)return;S.cancel();const u=new SpeechSynthesisUtterance(txt);u.lang='en-GB';u.rate=.88;
  const v=S.getVoices().find(v=>/en-GB/i.test(v.lang))||S.getVoices().find(v=>/^en/i.test(v.lang));if(v)u.voice=v;S.speak(u)}catch(e){}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-say]');if(b){e.stopPropagation();say(b.dataset.say)}});
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* small confetti burst inside an element */
function confetti(host){const cols=['#F2B84B','#E9925A','#3E6FD8','#18794E','#8E6CC8','#D46A6A'];
  for(let i=0;i<36;i++){const c=document.createElement('i');c.className='cf';c.style.left=(40+Math.random()*20)+'%';c.style.background=cols[i%6];
    c.style.setProperty('--dx',(Math.random()*2-1)*24+'cqi');c.style.setProperty('--dy',(-6-Math.random()*16)+'cqi');c.style.setProperty('--r',(Math.random()*720-360)+'deg');
    host.appendChild(c);setTimeout(()=>c.remove(),1600)}}
