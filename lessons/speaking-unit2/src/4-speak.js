/* ===== discourse markers + speaking activities ===== */
/* ---------- discourse markers build ---------- */
STEP.sDM=(s,n)=>{$('.dmdef',s).classList.toggle('in',n>=1);$$('.dmc',s).forEach((c,i)=>c.classList.toggle('in',n>=i+2));if(n)n===1?SFX.chime():SFX.pop(n)};
ENTER.sDM=s=>STEP.sDM(s,stepOf(s));

/* ---------- sorting game (Activity 1 + Activity 3) ---------- */
const SORT={
 a1:{cols:['Opening phrases','Clarifying','Adding information'],items:[['So,…',0],['I would say that…',0],['Well, I mean…',1],["What's more,…",2],['Furthermore,…',2],['Okay,…',0],['I guess…',0],["What I'm trying to say is…",1],['Another thing is…',2],['In other words,…',1],['I personally think that…',0],['I suppose that…',0],['On top of that,…',2],['Anyway,…',0]]},
 a3:{cols:['Referring to previous argument','Causes & effects','Comparing & contrasting','Similarities'],items:[['Like I said',0],['Whereas',2],['Likewise',3],['Thanks to',1],['As a result of',1],['In the same way',3],['As I said earlier',0],['This has the effect of',1],['In a similar fashion',3],['Instead of',2],['As I mentioned before',0],['Consequently',1],['On the contrary',2],['Just as',3],['Otherwise',2]]}
};
(function(){const s=$('#sSort');if(!s)return;let key='a3',sel=null;const pool=$('.spool',s),cols=$('.scols',s);
  function render(){const D=SORT[key];cols.style.setProperty('--n',D.cols.length);
    cols.innerHTML=D.cols.map((c,i)=>`<div class="scol" data-c="${i}"><div class="sch">${esc(c)}</div><div class="sbody"></div></div>`).join('');
    const order=D.items.map((_,i)=>i).sort(()=>Math.random()-.5);
    pool.innerHTML=order.map(i=>`<button class="chipx" data-i="${i}" data-a="${D.items[i][1]}">${esc(D.items[i][0])}</button>`).join('');sel=null;
    $$('[data-round]',s).forEach(b=>b.classList.toggle('on',b.dataset.round===key))}
  function place(ch,col){$('.sbody',col).appendChild(ch);ch.classList.remove('sel','ok','bad');sel=null;SFX.pop(2)}
  s.addEventListener('click',e=>{const r=e.target.closest('[data-round]');if(r){key=r.dataset.round;render();SFX.whoosh();return}
    const ch=e.target.closest('.chipx');if(ch){if(sel===ch){ch.classList.remove('sel');sel=null;return}if(sel)sel.classList.remove('sel');sel=ch;ch.classList.add('sel');SFX.tick();return}
    const col=e.target.closest('.scol');if(col&&sel){place(sel,col);return}
    if(e.target.closest('.spool')&&sel){pool.appendChild(sel);sel.classList.remove('sel');sel=null;return}
    const a=e.target.closest('[data-act]');if(!a)return;
    if(a.dataset.act==='so-check'){let ok=0,all=0;$$('.scol .chipx',s).forEach(c=>{all++;const g=c.dataset.a===c.closest('.scol').dataset.c;c.classList.toggle('ok',g);c.classList.toggle('bad',!g);if(g)ok++});
      $('.sres',s).textContent=all?`${ok} / ${SORT[key].items.length} đúng`:'';ok===SORT[key].items.length?(SFX.cheer(),confetti($('.scols',s))):SFX.ding()}
    else if(a.dataset.act==='so-ans'){$$('.chipx',s).forEach(c=>{place(c,$(`.scol[data-c="${c.dataset.a}"]`,s));c.classList.add('ok')});$('.sres',s).textContent='';SFX.chime()}
    else if(a.dataset.act==='so-reset'){render();$('.sres',s).textContent=''}});
  /* drag with pointer */
  let dg=null;s.addEventListener('pointerdown',e=>{const ch=e.target.closest('.chipx');if(!ch)return;dg={ch,x:e.clientX,y:e.clientY,moved:false}});
  window.addEventListener('pointermove',e=>{if(!dg)return;const dx=e.clientX-dg.x,dy=e.clientY-dg.y;if(!dg.moved&&Math.hypot(dx,dy)<8)return;dg.moved=true;dg.ch.classList.add('drag');dg.ch.style.transform=`translate(${dx}px,${dy}px)`});
  window.addEventListener('pointerup',e=>{if(!dg)return;const d=dg;dg=null;if(!d.moved)return;d.ch.classList.remove('drag');d.ch.style.transform='';
    d.ch.style.pointerEvents='none';const t=document.elementFromPoint(e.clientX,e.clientY);d.ch.style.pointerEvents='';const col=t&&t.closest('.scol');
    if(col)place(d.ch,col);else if(t&&t.closest('.spool')){pool.appendChild(d.ch);d.ch.classList.remove('ok','bad')}
    s.addEventListener('click',ev=>{ev.stopPropagation()},{capture:true,once:true})});
  render()})();

/* ---------- speaking bank ---------- */
const BANK={
 study:{name:'Study',pool:['be fascinated by','get into','stargazing','pique my curiosity','gripping','out of this world','light-years away','wrap my head around','cutting-edge','meticulous','in-depth','far-fetched','mundane','a closed book','forte','come in handy','a walk in the park','be all the rage','jump on the bandwagon','observatory','constellation','the Milky Way','solar system'],
  qs:[['Have you ever learned about outer space and stars?',['be fascinated by','get into','stargazing']],
      ['Do you like science?',['forte','a closed book','wrap my head around']],
      ['Have you ever been to an observatory or a planetarium?',['observatory','cutting-edge','out of this world']],
      ['Do you think people will live on other planets one day?',['far-fetched','Mars','light-years away']],
      ['Do you enjoy watching documentaries?',['gripping','pique my curiosity','in-depth']],
      ['Was science easy for you at school?',['a walk in the park','meticulous','come in handy']],
      ['Do you use apps to learn new things?',['be all the rage','come in handy','jump on the bandwagon']]]},
 rel:{name:'Relationships',pool:['companionship','ambivert','tight-knit','long-forgotten','strike up a conversation','see eye to eye','make the most of','social butterfly','reserved','hit it off','get along with','on the same wavelength','keep in touch','drift apart','have a lot in common','a shoulder to cry on','come across as','lifelong friend'],
  qs:[['Do you prefer to have a big or small group of friends?',['tight-knit','social butterfly','have a lot in common']],
      ['Do you prefer to spend time alone or with friends?',['ambivert','companionship','make the most of']],
      ['Do you like talking with people?',['strike up a conversation','reserved','hit it off']],
      ['Do you still keep in touch with your childhood friends?',['keep in touch','drift apart','lifelong friend']],
      ['Do you always agree with your friends?',['see eye to eye','get along with','on the same wavelength']],
      ['What do you do when a friend is upset?',['a shoulder to cry on','tight-knit','companionship']]]},
 ev:{name:'Special events',pool:['red-letter day','affection','commemorate','laid-back','eager','beloved','be moved by','be on edge','freak out','catch someone off guard','the icing on the cake','throw a party','get together','look forward to','the highlight of the year','carry on a tradition','in full swing','go all out','festive mood','catch up with'],
  qs:[['What is your favourite festival?',['the highlight of the year','festive mood','look forward to']],
      ['Do you prefer traditional or modern festivals?',['carry on a tradition','laid-back','in full swing']],
      ['How do people in your country celebrate festivals?',['get together','go all out','catch up with']],
      ['Have you ever had a surprise party?',['throw a party','catch someone off guard','freak out']],
      ['What was the most memorable day of your life?',['red-letter day','be moved by','be on edge']],
      ['Do you like celebrating your birthday?',['eager','the icing on the cake','get together']]]},
 a4:{name:'Activity 4',pool:['come in handy','laid-back','a walk in the park','pique my curiosity','out of this world','be fascinated by','far-fetched','light-years away','go all out'],
  qs:[['What form of transport do you prefer to use? Why?',['come in handy','laid-back','a walk in the park']],
      ['Would you visit a country because of its geographical location?',['pique my curiosity','out of this world','be fascinated by']]]}
};

/* ---------- speaking 1: cue words ---------- */
(function(){const s=$('#sCue');if(!s)return;let topic='study',qi=0,words=[],used=new Set(),dm=false,gi=0,paid=false;
  s.dataset.steps=2;
  const qbox=$('.cq',s),chips=$('.cchips',s),gbox=$('.cgroups',s),pay=$('[data-act="cu-pay"]',s);
  function paintGroups(){gbox.innerHTML=groups().map((g,i)=>`<button class="b sm${i===gi?' on':''}" data-g="${i}">${esc(g.name)}</button>`).join('')}
  function paintPay(){const n=used.size+(dm?1:0);pay.textContent=`+${n} điểm cho ${esc((groups()[gi]||{}).name||'')}`;pay.disabled=paid||!n}
  function load(){const T=BANK[topic],q=T.qs[qi%T.qs.length];words=q[1].slice();used.clear();dm=false;paid=false;
    $$('[data-topic]',s).forEach(b=>b.classList.toggle('on',b.dataset.topic===topic));
    qbox.innerHTML=`<span class="cqn">${T.name} · ${qi%T.qs.length+1}/${T.qs.length}</span><p>${esc(q[0])}</p><button class="spk" data-say="${esc(q[0])}" aria-label="Nghe câu hỏi">🔊</button>`;paintChips();
    const t=$('.timer',s);t&&t._reset&&t._reset()}
  function paintChips(){chips.innerHTML=words.map((w,i)=>`<button class="cw${used.has(i)?' hit':''}" data-w="${i}" style="--d:${i*.18}s"><span class="ck">✓</span>${esc(w)}</button>`).join('')+
    `<button class="cw dm${dm?' hit':''}" data-w="dm" style="--d:${words.length*.18}s"><span class="ck">✓</span>+ discourse marker</button>`;paintPay()}
  STEP.sCue=(s,n)=>{qbox.classList.toggle('in',n>=1);chips.classList.toggle('in',n>=2);if(n===1)SFX.whoosh();if(n===2)SFX.pop(3)};
  ENTER.sCue=()=>{paintGroups();paintPay();STEP.sCue(s,stepOf(s))};
  s.addEventListener('click',e=>{const t=e.target.closest('[data-topic]');if(t){topic=t.dataset.topic;qi=0;load();setStep(s,1);return}
    const g=e.target.closest('[data-g]');if(g){gi=+g.dataset.g;paintGroups();paintPay();SFX.tick();return}
    const c=e.target.closest('.cw');if(c){const k=c.dataset.w;if(k==='dm'){dm=!dm;c.classList.toggle('hit',dm);dm?SFX.ding():SFX.minus()}
      else{const i=+k;used.has(i)?used.delete(i):used.add(i);c.classList.toggle('hit',used.has(i));used.has(i)?SFX.ding():SFX.minus()}
      paintPay();if(used.size===words.length&&dm){SFX.cheer();confetti(chips)}return}
    const a=e.target.closest('[data-act]');if(!a)return;
    if(a.dataset.act==='cu-next'){qi++;load();setStep(s,1)}
    else if(a.dataset.act==='cu-swap'){const pool=BANK[topic].pool.slice().sort(()=>Math.random()-.5);words=pool.slice(0,3);used.clear();dm=false;paid=false;paintChips();if(stepOf(s)<2)setStep(s,2);SFX.whoosh()}
    else if(a.dataset.act==='cu-pay'){const n=used.size+(dm?1:0);if(!n||paid)return;addPoints(gi,n);paid=true;paintPay()}});
  window.addEventListener('deck:show',()=>{if(slides[cur]===s)paintGroups()});
  load()})();

/* ---------- speaking 2: partner practice + teacher notes ---------- */
const NKEY='u2:notes';
let NOTES=[];try{NOTES=JSON.parse(localStorage.getItem(NKEY))||[]}catch(e){}
if(!NOTES.length)NOTES=[1,2,3].map(i=>({name:'Cặp '+i,tags:[],stars:0,good:'',fix:''}));
const saveNotes=()=>{try{localStorage.setItem(NKEY,JSON.stringify(NOTES))}catch(e){}};
const TAGS=[['vocab','✓ Dùng từ mới'],['dm','✓ Discourse marker'],['flu','✓ Trôi chảy'],['ext','✓ Mở rộng ý'],['pro','⚠ Phát âm'],['gra','⚠ Ngữ pháp'],['short','⚠ Trả lời quá ngắn'],['viet','⚠ Dùng tiếng Việt']];
(function(){const s=$('#sPair');if(!s)return;let topic='study',round=0,swap=false;
  const card=$('.ptask',s),list=$('.nlist',s);
  function paintTask(){const T=BANK[topic],n=T.qs.length,qs=[0,1,2].map(k=>T.qs[(round*3+k)%n][0]);
    const wb=Array.from(new Set(qs.flatMap((_,k)=>T.qs[(round*3+k)%n][1]))).slice(0,7);
    $$('[data-ptopic]',s).forEach(b=>b.classList.toggle('on',b.dataset.ptopic===topic));
    card.innerHTML=`<div class="prole"><b>${swap?'B':'A'}</b> hỏi · <b>${swap?'A':'B'}</b> trả lời</div>
     <ol class="pqs">${qs.map(q=>`<li>${esc(q)}</li>`).join('')}</ol>
     <div class="pwb"><span>Dùng ít nhất 2 từ:</span>${wb.map(w=>`<i>${esc(w)}</i>`).join('')}</div>`}
  function paintNotes(){list.innerHTML=NOTES.map((p,i)=>`<div class="ncard" data-i="${i}">
     <div class="nh"><input class="nname" value="${esc(p.name)}" aria-label="Tên cặp" maxlength="40"><span class="stars">${[1,2,3,4,5].map(k=>`<button data-star="${k}" class="${k<=p.stars?'on':''}" aria-label="${k} sao">★</button>`).join('')}</span><button class="ndel" aria-label="Xoá cặp">×</button></div>
     <div class="ntags">${TAGS.map(([k,l])=>`<button data-tag="${k}" class="${p.tags.includes(k)?'on':''} ${l[0]==='⚠'?'wn':''}">${l}</button>`).join('')}</div>
     <div class="ntx"><label>Câu hay<textarea data-f="good" rows="2" placeholder="I've always been fascinated by…">${esc(p.good)}</textarea></label>
      <label>Lỗi → Sửa<textarea data-f="fix" rows="2" placeholder="I very like it -> I really like it">${esc(p.fix)}</textarea></label></div></div>`).join('')}
  s.addEventListener('click',e=>{const t=e.target.closest('[data-ptopic]');if(t){topic=t.dataset.ptopic;round=0;swap=false;paintTask();SFX.whoosh();return}
    const a=e.target.closest('[data-act]');
    if(a){const k=a.dataset.act;
      if(k==='pa-swap'){swap=!swap;if(!swap)round++;paintTask();SFX.whoosh();const tm=$('.timer',s);tm&&tm._reset&&tm._reset();return}
      if(k==='pa-add'){NOTES.push({name:'Cặp '+(NOTES.length+1),tags:[],stars:0,good:'',fix:''});saveNotes();paintNotes();SFX.pop(2);list.scrollTop=list.scrollHeight;return}
      if(k==='pa-hide'){s.classList.toggle('nhide');a.textContent=s.classList.contains('nhide')?'Hiện ghi chú':'Ẩn ghi chú';return}
      if(k==='pa-copy'){const txt=notesText();const ok=()=>{a.textContent='Đã sao chép ✓';setTimeout(()=>a.textContent='Sao chép',1500)};try{navigator.clipboard.writeText(txt).then(ok,()=>fallback(txt))}catch(err){fallback(txt)}return}}
    const c=e.target.closest('.ncard');if(!c)return;const p=NOTES[+c.dataset.i];
    const tg=e.target.closest('[data-tag]');if(tg){const k=tg.dataset.tag;p.tags.includes(k)?p.tags.splice(p.tags.indexOf(k),1):p.tags.push(k);tg.classList.toggle('on');saveNotes();SFX.tick();return}
    const st=e.target.closest('[data-star]');if(st){const k=+st.dataset.star;p.stars=p.stars===k?0:k;saveNotes();$$('[data-star]',c).forEach(b=>b.classList.toggle('on',+b.dataset.star<=p.stars));SFX.pop(k);return}
    if(e.target.closest('.ndel')){const d=e.target.closest('.ndel');if(d.dataset.sure){NOTES.splice(+c.dataset.i,1);saveNotes();paintNotes()}else{d.dataset.sure=1;d.textContent='Xoá?';setTimeout(()=>{d.dataset.sure='';d.textContent='×'},2000)}}});
  s.addEventListener('input',e=>{const c=e.target.closest('.ncard');if(!c)return;const p=NOTES[+c.dataset.i];
    if(e.target.classList.contains('nname'))p.name=e.target.value;else if(e.target.dataset.f)p[e.target.dataset.f]=e.target.value;saveNotes()});
  paintTask();paintNotes()})();
function fallback(t){const ta=document.createElement('textarea');ta.value=t;ta.style.cssText='position:fixed;left:10%;top:10%;width:80%;height:60%;z-index:99';document.body.appendChild(ta);ta.select();ta.addEventListener('blur',()=>ta.remove())}
function notesText(){return NOTES.map(p=>`${p.name}  ${'★'.repeat(p.stars)}\n  ${p.tags.map(k=>(TAGS.find(t=>t[0]===k)||[])[1]).join(' · ')}\n  Câu hay: ${p.good.replace(/\n/g,' | ')}\n  Lỗi → Sửa: ${p.fix.replace(/\n/g,' | ')}`).join('\n\n')}

/* ---------- feedback board ---------- */
(function(){const s=$('#sFeed');if(!s)return;let names=false;
  function paint(){const good=[],fix=[];NOTES.forEach(p=>{p.good.split('\n').map(x=>x.trim()).filter(Boolean).forEach(t=>good.push([t,p.name]));
      p.fix.split('\n').map(x=>x.trim()).filter(Boolean).forEach(t=>{const m=t.split(/\s*(?:->|→|=>)\s*/);fix.push([m[0],m[1]||'',p.name])})});
    $('.fgood',s).innerHTML=good.length?good.map(([t,n],i)=>`<li style="--d:${i*.08}s">${esc(t)}${names?`<small>${esc(n)}</small>`:''}</li>`).join(''):'<li class="empty">Ghi “Câu hay” ở slide trước, chúng sẽ hiện ở đây.</li>';
    $('.ffix',s).innerHTML=fix.length?fix.map(([a,b,n],i)=>`<li style="--d:${i*.08}s" tabindex="0" role="button"><s>${esc(a)}</s><b>${esc(b||'…')}</b>${names?`<small>${esc(n)}</small>`:''}</li>`).join(''):'<li class="empty">Ghi “Lỗi → Sửa” ở slide trước, chúng sẽ hiện ở đây.</li>';
    const cnt=TAGS.map(([k,l])=>[l,NOTES.filter(p=>p.tags.includes(k)).length]);const tot=NOTES.length||1;
    $('.ftags',s).innerHTML=cnt.map(([l,c])=>`<div class="ft${l[0]==='⚠'?' wn':''}"><span>${l}</span><i style="--w:${c/tot*100}%"></i><b>${c}/${NOTES.length}</b></div>`).join('')}
  ENTER.sFeed=()=>{paint();SFX.whoosh()};
  s.addEventListener('click',e=>{const li=e.target.closest('.ffix li:not(.empty)');if(li){li.classList.toggle('show');li.classList.contains('show')&&SFX.ding();return}
    const a=e.target.closest('[data-act="fd-names"]');if(a){names=!names;a.classList.toggle('on',names);paint()}});
  s.addEventListener('keydown',e=>{const li=e.target.closest('.ffix li');if(li&&(e.key==='Enter'||e.key===' ')){e.preventDefault();li.click()}})})();
