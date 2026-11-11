(function(){
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const slides=$$('.slide');let cur=0;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};

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

/* ---------- A-R-E build ---------- */
STEP.sARE=(s,n)=>{s.classList.toggle('s1',n>=1);s.classList.toggle('s2',n>=2);
  $$('.arow',s).forEach((r,i)=>r.classList.toggle('in',n>=i+2));
  $('.mbar i',s).style.width=n<1?'0':n===1?'8%':Math.min(100,(n-1)*33)+'%';
  $('.aremeter',s).classList.toggle('done',n>=4);
  if(!n)return;if(n===1)SFX.thud();else if(n===4)SFX.chime();else SFX.pop(n)};

/* ---------- answer flower (demo) ---------- */
const PET=JSON.parse($('#petalData').textContent);
STEP.sFlower=(s,n)=>{const fl=$('.flower',s);fl.classList.toggle('core-in',n>=1);
  $$('.petal',fl).forEach((p,i)=>{p.classList.toggle('in',n>=i+2);p.classList.toggle('cur',n===i+2)});
  $$('.frow',s).forEach((r,i)=>{r.classList.toggle('in',n>=i+2);r.classList.toggle('cur',n===i+2)});
  $('.fnote',s).classList.toggle('in',n>=PET.length+2);fl.classList.toggle('full',n>=PET.length+2);
  if(!n)return;if(n===1)SFX.thud();else if(n>=PET.length+2)SFX.chime();else SFX.pop((n%6)+1)};
function demoPetal(s,k){const r=$(`.frow[data-p="${k}"]`,s),p=$(`.petal[data-p="${k}"]`,s);
  if(!p.classList.contains('in'))return;$$('.frow',s).forEach(x=>x.classList.toggle('cur',x===r));$$('.petal',s).forEach(x=>x.classList.toggle('cur',x===p));SFX.tick()}

/* ---------- answer step by step (flower per topic) ---------- */
function fInit(s,qi){s.dataset.qi=qi;s.dataset.used='';const qs=JSON.parse(s.dataset.qs);
  $('.core .cq',s).textContent=qs[qi];$$('.petal',s).forEach(p=>p.classList.remove('in','cur'));
  $$('[data-fq]',s).forEach(b=>b.classList.toggle('on',+b.dataset.fq===qi));
  $('.flog',s).innerHTML='';fTask(s,null);$$('.timer',s).forEach(t=>t.reset())}
function fTask(s,p){const used=s.dataset.used?s.dataset.used.split(','):[];const box=$('.task',s);
  box.innerHTML=p?`<span class="tn">${used.length+1}</span><div><b>${p.ic} ${esc(p.lb)} <small>${esc(p.vi)}</small></b><p>${esc(p.st)}</p></div>`
    :`<span class="tn">1</span><div><b>Trả lời thẳng</b><p>Yes / No + một ý ngắn</p></div>`;
  box.classList.remove('flash');void box.offsetWidth;box.classList.add('flash')}
function fOpen(s,k){const used=s.dataset.used?s.dataset.used.split(','):[];if(used.includes(k))return;
  const p=PET.find(x=>x.k===k),log=$('.flog',s);
  const prevTxt=$('.task b',s).textContent;log.insertAdjacentHTML('beforeend',`<span class="done">✓ ${esc(prevTxt)}</span>`);
  fTask(s,p);used.push(k);s.dataset.used=used.join(',');
  $$('.petal',s).forEach(x=>x.classList.toggle('cur',x.dataset.p===k));$(`.petal[data-p="${k}"]`,s).classList.add('in');
  $$('.timer',s).forEach(t=>t.reset());SFX.pop(used.length%6+1)}
$$('.fstep').forEach(s=>fInit(s,0));

/* ---------- guess the word from a picture ---------- */
function gShow(s,i){const D=JSON.parse($('.gdata',s).textContent);i=(i+D.length)%D.length;s.dataset.gi=i;const d=D[i];
  $('.gimg',s).textContent=d.pic;$$('.tile',s).forEach(t=>t.classList.remove('off'));
  $('.gword',s).innerHTML=d.w.split(' ').map(w=>`<span class="wd">${[...w].map(c=>/[a-z]/i.test(c)?`<span class="lt" data-c="${esc(c)}"></span>`:`<span class="pc">${esc(c)}</span>`).join('')}</span>`).join('');
  $('.gvi',s).textContent=d.vi;$('.gvi',s).classList.remove('in');s.classList.remove('ans');
  $$('.gdot',s).forEach((b,k)=>b.classList.toggle('on',k===i))}
$$('.gslide').forEach(s=>gShow(s,0));
const gWord=s=>JSON.parse($('.gdata',s).textContent)[+s.dataset.gi];

/* ---------- memory cards ---------- */
function mFlip(s,k){const up=$$('.mc:not(.on)',s);shuffle(up).slice(0,k).forEach((c,i)=>setTimeout(()=>c.classList.add('on'),i*120));SFX.whoosh()}
function mShuffle(s){const g=$('.mgrid',s),cs=$$('.mc',g),r0=new Map(cs.map(c=>[c,c.getBoundingClientRect()]));
  shuffle(cs).forEach(c=>g.appendChild(c));
  cs.forEach(c=>{const a=r0.get(c),b=c.getBoundingClientRect();c.style.transition='none';c.style.transform=`translate(${a.left-b.left}px,${a.top-b.top}px)`});
  g.offsetWidth;cs.forEach((c,i)=>{c.style.transition=`transform .6s cubic-bezier(.3,1.2,.4,1) ${i*25}ms`;c.style.transform=''});SFX.zip()}

/* ---------- practice: must-say phrases + teacher grading ---------- */
const LOGK='sp1:log';
const loadLog=()=>{try{return JSON.parse(localStorage.getItem(LOGK))||[]}catch(e){return []}};
const saveLog=l=>{try{localStorage.setItem(LOGK,JSON.stringify(l))}catch(e){}};
let LOG=loadLog();
const groups=()=>$$('#mini .r span').map(x=>x.textContent);
function addPts(i,p){if(!(p>0))return;const b=document.createElement('button');b.dataset.sc=p;b.dataset.gi=i;b.hidden=true;document.body.appendChild(b);b.click();b.remove()}
function qWho(s){const g=groups(),sel=s.dataset.who;
  $('.gwho',s).innerHTML=g.map((n,i)=>`<button class="wb${sel==i?' on':''}" data-wi="${i}">${esc(n)}</button>`).join('')}
function qCalc(s){const said=$$('.tgt.said',s).length,all=$$('.tgt',s).length;
  const st=c=>$$(`.stars[data-c="${c}"] button.on`,s).length;
  $('.cnt',s).textContent=said+'/'+all;const tot=said+st('ext')+st('flu');$('.total',s).textContent=tot;return {said,all,tot,ext:st('ext'),flu:st('flu')}}
function qReset(s){$$('.tgt',s).forEach(t=>t.classList.remove('said'));$$('.stars button',s).forEach(b=>b.classList.remove('on'));$('.note',s).value='';qCalc(s)}
$$('.qslide').forEach(s=>{STEP[s.id]=(s,n)=>{s.classList.toggle('tg-on',n>=1);if(n)SFX.pop(2)};ENTER[s.id]=qWho});
window.addEventListener('deck:show',()=>{const s=slides[cur];if(s.classList.contains('qslide'))qWho(s)});
function qSave(s){const who=s.dataset.who;
  if(who==null){const w=$('.gwho',s);w.classList.remove('need');void w.offsetWidth;w.classList.add('need');SFX.buzz();return}
  const r=qCalc(s),name=groups()[+who]||'?';
  LOG.push({ts:Date.now(),who:name,topic:s.dataset.topic,q:s.dataset.q,said:$$('.tgt.said',s).map(t=>t.dataset.k),miss:$$('.tgt:not(.said)',s).map(t=>t.dataset.k),
    ext:r.ext,flu:r.flu,pts:r.tot,note:$('.note',s).value.trim()});saveLog(LOG);
  addPts(+who,r.tot);if(!r.tot)SFX.ding();
  const m=$('.saved',s);m.textContent=`✓ Đã lưu · ${name} +${r.tot} điểm`;m.classList.remove('in');void m.offsetWidth;m.classList.add('in');qReset(s)}

/* ---------- teacher's notebook ---------- */
const hm=t=>{const d=new Date(t);return d.getHours()+':'+String(d.getMinutes()).padStart(2,'0')};
ENTER.sLog=()=>{LOG=loadLog();const tot={};LOG.forEach(r=>{tot[r.who]=tot[r.who]||{p:0,n:0};tot[r.who].p+=r.pts;tot[r.who].n++});
  $('#logSum').innerHTML=Object.keys(tot).length?Object.entries(tot).map(([w,v])=>`<div class="ls"><b>${esc(w)}</b><span>${v.n} lượt · ${v.p} điểm</span></div>`).join(''):'<div class="ls empty">Chưa có lượt chấm nào. Chấm ở các slide luyện nói rồi bấm “Cộng điểm &amp; lưu”.</div>';
  $('#logBody').innerHTML=LOG.slice().reverse().map(r=>`<tr><td>${hm(r.ts)}</td><td><b>${esc(r.who)}</b></td><td><small>${esc(r.topic)}</small><br>${esc(r.q)}</td>
    <td>${r.said.map(k=>`<span class="ok">✓ ${esc(k)}</span>`).join(' ')} ${r.miss.map(k=>`<span class="no">✗ ${esc(k)}</span>`).join(' ')}</td>
    <td class="pt">${r.pts}<small>cụm ${r.said.length} · mở rộng ${r.ext} · trôi chảy ${r.flu}</small></td><td>${esc(r.note)}</td></tr>`).join('')};

/* ---------- random question picker ---------- */
const PD=JSON.parse($('#pickData').textContent);let picked=null,last=-1,spinning=false;
const pickCard=$('#pickCard');
function pick(){if(spinning)return;const on=$$('[data-pt].on').map(b=>b.dataset.pt);const pool=PD.map((q,i)=>i).filter(i=>on.includes(PD[i].t));
  if(!pool.length){$('#pQ').textContent='Chọn ít nhất một chủ đề';SFX.buzz();return}
  spinning=true;pickCard.classList.remove('hint','land');let k=0;const N=12;
  const spin=()=>{let i=pool[Math.floor(Math.random()*pool.length)];if(k===N&&pool.length>1)while(i===last)i=pool[Math.floor(Math.random()*pool.length)];
    const q=PD[i];$('#pTopic').textContent=q.name;$('#pQ').textContent=q.q;SFX.tick();
    if(k++<N){setTimeout(spin,60+k*12)}else{picked=q;last=i;spinning=false;
      $('#pK').innerHTML=q.k.map((w,j)=>`<span class="chip3" style="--i:${j}">${esc(w)}</span>`).join('');pickCard.classList.add('land');SFX.ding()}};
  spin()}

/* ---------- clicks ---------- */
document.addEventListener('click',e=>{
  const s=slides[cur],T=e.target;
  const sp=T.closest('[data-say]');if(sp){e.stopPropagation();say(sp.dataset.say);return}
  const v=T.closest('.vc');if(v){v.classList.toggle('on');SFX.tick();return}
  const mc=T.closest('.mc');if(mc){mc.classList.toggle('on');mc.classList.contains('on')?SFX.tick():(SFX.ding(),say(mc.dataset.w));return}
  const g=T.closest('.gk');if(g){g.classList.toggle('show');if(g.classList.contains('show'))SFX.ding();return}
  const tile=T.closest('.tile');if(tile){tile.classList.add('off');SFX.pop(4);return}
  const gd=T.closest('.gdot');if(gd){gShow(s,+gd.dataset.gi);SFX.whoosh();return}
  const pt=T.closest('.petal');if(pt){if(s.id==='sFlower')demoPetal(s,pt.dataset.p);else if(s.classList.contains('fstep'))fOpen(s,pt.dataset.p);return}
  const fq=T.closest('[data-fq]');if(fq){fInit(s,+fq.dataset.fq);SFX.whoosh();return}
  const tg=T.closest('.tgt');if(tg){tg.classList.toggle('said');tg.classList.contains('said')?SFX.ding():SFX.minus();qCalc(s);return}
  const wb=T.closest('.wb');if(wb){s.dataset.who=wb.dataset.wi;qWho(s);SFX.tick();return}
  const star=T.closest('.stars button');if(star){const bs=$$('button',star.parentNode),k=bs.indexOf(star)+1,curv=bs.filter(b=>b.classList.contains('on')).length,nv=curv===k?k-1:k;
    bs.forEach((b,i)=>b.classList.toggle('on',i<nv));SFX.pop(nv+1);qCalc(s);return}
  const pb=T.closest('[data-pt]');if(pb){pb.classList.toggle('on');SFX.tick();return}
  const b=T.closest('[data-act]');if(!b)return;
  switch(b.dataset.act){
    case 'step':next();break;
    case 'vc-all':{const all=$$('.vc',s),on=!all.every(f=>f.classList.contains('on'));all.forEach((f,i)=>setTimeout(()=>f.classList.toggle('on',on),i*45));SFX.whoosh();break}
    case 'gk-all':{const all=$$('.gk',s),on=!all.every(x=>x.classList.contains('show'));all.forEach((x,i)=>setTimeout(()=>x.classList.toggle('show',on),i*150));if(on)SFX.chime();break}
    case 'g-open':$$('.tile',s).forEach((t,i)=>setTimeout(()=>t.classList.add('off'),i*40));SFX.whoosh();break;
    case 'g-first':$$('.wd',s).forEach(w=>{const l=$('.lt',w);if(l){l.textContent=l.dataset.c;l.classList.add('in')}});SFX.pop(3);break;
    case 'g-vi':$('.gvi',s).classList.add('in');SFX.pop(2);break;
    case 'g-ans':$$('.lt',s).forEach((l,i)=>setTimeout(()=>{l.textContent=l.dataset.c;l.classList.add('in')},i*45));$$('.tile',s).forEach(t=>t.classList.add('off'));
      s.classList.add('ans');$('.gvi',s).classList.add('in');SFX.chime();say(gWord(s).w);break;
    case 'g-prev':gShow(s,+s.dataset.gi-1);SFX.whoosh(false);break;
    case 'g-next':gShow(s,+s.dataset.gi+1);SFX.whoosh();break;
    case 'm-hide1':mFlip(s,1);break;
    case 'm-hide2':mFlip(s,2);break;
    case 'm-all':$$('.mc',s).forEach((c,i)=>setTimeout(()=>c.classList.add('on'),i*40));SFX.whoosh();break;
    case 'm-open':$$('.mc',s).forEach((c,i)=>setTimeout(()=>c.classList.remove('on'),i*40));SFX.whoosh(false);break;
    case 'm-shuf':mShuffle(s);break;
    case 'f-next':{const used=s.dataset.used?s.dataset.used.split(','):[];const left=PET.filter(p=>!used.includes(p.k));
      if(!left.length){SFX.cheer();break}fOpen(s,left[Math.floor(Math.random()*left.length)].k);break}
    case 'f-reset':fInit(s,+s.dataset.qi);SFX.whoosh(false);break;
    case 'q-model':s.classList.toggle('model-on');b.classList.toggle('on');if(s.classList.contains('model-on'))SFX.chime();break;
    case 'q-save':qSave(s);break;
    case 'log-copy':{const txt=LOG.map(r=>[hm(r.ts),r.who,r.topic,r.q,'✓ '+r.said.join(', '),'✗ '+r.miss.join(', '),r.pts,r.note].join('\t')).join('\n');
      (navigator.clipboard?navigator.clipboard.writeText(txt):Promise.reject()).then(()=>{b.textContent='✓ Đã sao chép';SFX.ding()}).catch(()=>{b.textContent='Không sao chép được'});
      setTimeout(()=>b.textContent='📋 Sao chép',2000);break}
    case 'log-clear':if(b.dataset.sure){LOG=[];saveLog(LOG);ENTER.sLog();delete b.dataset.sure;b.textContent='🗑 Xoá sổ';SFX.whoosh(false)}else{b.dataset.sure='1';b.textContent='Bấm lần nữa để xoá'}break;
    case 'pick':pick();break;
    case 'pick-hint':if(picked){pickCard.classList.toggle('hint');SFX.pop(2)}break;
    case 'pick-say':if(picked)say(picked.q);break}});

Object.keys(STEP).forEach(id=>{const s=$('#'+id);if(s)STEP[id](s,0)});
SFX.stop();
const m=/^#s(\d+)$/.exec(location.hash);show(m?+m[1]-1:0);
})();
