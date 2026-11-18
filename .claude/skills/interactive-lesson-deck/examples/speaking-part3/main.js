(function(){
window.EDIT_EXCLUDE='.secs,#vFC,#vGRA,.gnum,.cnt,.ckn,.rn,.tn,.ph7,.titlewave,.bandrow,.cksum';
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

/* ---------- Part 1/2/3 table ---------- */
STEP.sParts=(s,n)=>{$$('.prl,.pc',s).forEach(c=>c.classList.toggle('in',+c.dataset.r<=n));$('#ptable').classList.toggle('hl',n>=6);
  if(n){n>=6?SFX.chime():SFX.pop(n)}};

/* ---------- zoom I -> society ---------- */
STEP.sZoom=(s,n)=>{const on=k=>$('.zr.z'+k,s).classList.toggle('in',k===5?n>=4:k<=n);[1,2,3,4,5].forEach(on);
  $('.zr.z1',s).classList.toggle('shrink',n>=2);
  $$('.zline',s).forEach(l=>{const z=+l.dataset.z;l.classList.toggle('in',z<=n);l.classList.toggle('out',z===1&&n>=2)});
  if(n===1)SFX.thud();else if(n===2)SFX.grow();else if(n===3||n===4)SFX.whoosh();else if(n===5)SFX.ding()};

/* ---------- what examiners want ---------- */
STEP.sWant=(s,n)=>{$$('.wc',s).forEach((c,i)=>c.classList.toggle('in',i<n));$('.golden',s).classList.toggle('in',n>=5);
  if(n===5)SFX.chime();else if(n===4){SFX.pop(4);setTimeout(()=>SFX.pop(5),500);setTimeout(()=>SFX.pop(6),1100);setTimeout(()=>SFX.grow(),1600)}else if(n)SFX.pop(n)};

/* ---------- criteria donut ---------- */
const CRIT=[
 {k:'FC',n:'Fluency & Coherence',c:'#1F5FD6',
  b:{6:'Nói dài được nhưng đôi khi mất mạch do lặp, tự sửa, ngập ngừng; từ nối chưa luôn phù hợp.',7:'Nói dài không tốn sức, không mất mạch; ngập ngừng do ngôn ngữ đôi lúc; dùng discourse markers linh hoạt.',8:'Trôi chảy, chỉ thỉnh thoảng lặp/tự sửa; ngập ngừng chủ yếu do suy nghĩ nội dung.'},
  d:'Mỗi câu trả lời có cấu trúc (ý → lý do → ví dụ → kết); nối ý bằng <b>That said, On top of that, The thing is…</b> thay vì and, but, because lặp lại.'},
 {k:'LR',n:'Lexical Resource',c:'#C25E0C',
  b:{6:'Đủ từ để bàn luận dài, ý vẫn rõ dù có chỗ dùng sai; paraphrase nhìn chung được.',7:'Dùng từ linh hoạt ở nhiều chủ đề; có từ ít phổ biến, thành ngữ, collocation; paraphrase hiệu quả.',8:'Vốn từ rộng, diễn đạt chính xác; dùng thành ngữ khéo, ít sai.'},
  d:'Cần từ vựng trừu tượng theo chủ đề (<b>social cohesion, income gap, digital literacy</b>) và paraphrase lại từ khóa của câu hỏi.'},
 {k:'GRA',n:'Grammatical Range & Accuracy',c:'#5B3EA6',
  b:{6:'Pha trộn câu đơn và phức, kém linh hoạt; hay sai ở câu phức nhưng không gây khó hiểu.',7:'Nhiều cấu trúc phức, khá linh hoạt; nhiều câu hoàn toàn đúng, vẫn còn vài lỗi.',8:'Đa dạng cấu trúc, linh hoạt; phần lớn câu không lỗi.'},
  d:'Câu hỏi Part 3 “tự gọi” ngữ pháp: dự đoán → <b>will / is likely to</b>; giả định → <b>câu điều kiện loại 2</b>; so sánh quá khứ → <b>used to, hiện tại hoàn thành</b>.'},
 {k:'P',n:'Pronunciation',c:'#18794E',
  b:{6:'Dùng được nhiều đặc điểm phát âm nhưng không duy trì; đôi khi phát âm sai làm giảm độ rõ.',7:'Có đủ điểm tích cực của band 6 và một phần của band 8.',8:'Duy trì linh hoạt ngữ điệu, trọng âm, nối âm; dễ hiểu suốt bài.'},
  d:'Câu trả lời dài → phải <b>chia cụm ý</b> (chunking), nhấn trọng âm vào từ mang thông tin, xuống giọng khi kết ý.'}];
let critSel=-1,critBand=7;
(function(){const svg=$('#donut'),NS='http://www.w3.org/2000/svg';const R=100,r=56;
  const pt=(a,rr)=>[Math.cos(a)*rr,Math.sin(a)*rr];
  CRIT.forEach((c,i)=>{const a0=-Math.PI/2+i*Math.PI/2+.03,a1=a0+Math.PI/2-.06;
    const [x0,y0]=pt(a0,R),[x1,y1]=pt(a1,R),[x2,y2]=pt(a1,r),[x3,y3]=pt(a0,r);
    const g=document.createElementNS(NS,'g');g.setAttribute('class','seg4');g.dataset.i=i;g.style.transformOrigin='0 0';
    const p=document.createElementNS(NS,'path');p.setAttribute('d',`M${x0} ${y0}A${R} ${R} 0 0 1 ${x1} ${y1}L${x2} ${y2}A${r} ${r} 0 0 0 ${x3} ${y3}Z`);p.setAttribute('fill',c.c);g.appendChild(p);
    const am=(a0+a1)/2,[tx,ty]=pt(am,78);
    const t=document.createElementNS(NS,'text');t.setAttribute('x',tx);t.setAttribute('y',ty);t.setAttribute('text-anchor','middle');t.textContent=c.k;g.appendChild(t);
    const t2=document.createElementNS(NS,'text');t2.setAttribute('x',tx);t2.setAttribute('y',ty+14);t2.setAttribute('text-anchor','middle');t2.setAttribute('class','pct');t2.textContent='25%';g.appendChild(t2);
    svg.appendChild(g)});
  const mid=document.createElementNS(NS,'text');mid.setAttribute('x',0);mid.setAttribute('y',8);mid.setAttribute('text-anchor','middle');mid.setAttribute('style','font:700 22px Lora,serif;fill:#16213A');mid.textContent='Part 3';svg.appendChild(mid);
  svg.addEventListener('click',e=>{const g=e.target.closest('.seg4');if(!g||!g.classList.contains('in'))return;critSel=+g.dataset.i;paintCrit();SFX.tick()});
})();
function paintCrit(){$$('.seg4').forEach(g=>g.classList.toggle('sel',+g.dataset.i===critSel));
  $$('[data-band]').forEach(b=>b.classList.toggle('on',+b.dataset.band===critBand));
  const P=$('#critPanel');if(critSel<0){P.innerHTML='<p class="sub">Bấm một phần của vòng tròn.</p>';return}
  const c=CRIT[critSel];P.innerHTML=`<h3 style="color:${c.c}">${c.n} (${c.k})</h3>
   <div class="desc"><span class="btg" style="background:${c.c}">Band ${critBand}</span>${c.b[critBand]}</div>
   <div class="doit"><span class="lbl2">Trong Part 3 cần làm gì</span>${c.d}</div>`}
STEP.sCrit=(s,n)=>{$$('.seg4').forEach((g,i)=>g.classList.toggle('in',i<n));critSel=n?n-1:-1;paintCrit();if(n)SFX.pop(n+1)};
document.addEventListener('click',e=>{const b=e.target.closest('[data-band]');if(!b)return;critBand=+b.dataset.band;paintCrit();SFX.tick()});

/* ---------- evidence jar ---------- */
const JAR=[
 {t:'I’d say it <em>largely comes down to</em> jobs.',fc:.25,gr:0,sec:4},
 {t:'Big cities simply have far more well-paid positions, <em>which is why</em> ambitious graduates head there first.',fc:.5,gr:.5,sec:8},
 {t:'<em>In Hanoi, for instance,</em> most tech and finance companies are based in the centre.',fc:.5,gr:.25,sec:7},
 {t:'<em>That said,</em> more people are now moving back to their hometowns because rents are so high.',fc:.75,gr:.25,sec:8},
 {t:'<em>If</em> smaller towns <em>offered</em> similar salaries, far fewer people <em>would</em> leave home.',fc:.25,gr:1,sec:7}];
const jarOn=new Set();
function paintJar(){const A=$('#jarAns');let html='';if(!jarOn.has(0))html+='<span class="sn base">Because there are many jobs in big cities. </span>';
  JAR.forEach((j,i)=>{if(jarOn.has(i))html+=`<span class="sn j${i}">${j.t} </span>`});A.innerHTML=html;
  let fc=5,gr=5,sec=jarOn.has(0)?0:5;jarOn.forEach(i=>{fc+=JAR[i].fc;gr+=JAR[i].gr;sec+=JAR[i].sec});
  const r=v=>Math.floor(v*2)/2,w=v=>Math.max(4,(v-4)/4.5*100)+'%';
  $('#bFC').style.width=w(fc);$('#bGRA').style.width=w(gr);$('#vFC').textContent=r(fc);$('#vGRA').textContent=r(gr);
  $('#jarSecs').textContent='≈ '+sec+' giây';
  const h=170*Math.min(1,sec/40);const f=$('#jarFill');f.setAttribute('y',210-h);f.setAttribute('height',h);
  $$('#jarBtns [data-j]').forEach(b=>b.classList.toggle('done',jarOn.has(+b.dataset.j)))}
$('#jarBtns').addEventListener('click',e=>{const b=e.target.closest('[data-j]');if(!b)return;const i=+b.dataset.j;
  if(jarOn.has(i)){jarOn.delete(i);SFX.minus()}else{jarOn.add(i);SFX.pour();if(jarOn.size===5)setTimeout(()=>SFX.cheer(),500)}paintJar()});
paintJar();

/* ---------- 8 question types ---------- */
const TYPES=[
 {n:'Opinion',v:'Ý kiến',c:'#1F5FD6',sig:['Do you think…?','Should…?','Is it important…?'],q:'Do you think children should learn to cook at school?',ch:['Point','Reason','Example','Back'],note:'Nếu hai mặt: Depends – Case A – Case B – Overall (On balance, I’d lean towards…)'},
 {n:'Advantages / Disadvantages',v:'Lợi – hại',c:'#C25E0C',sig:['benefits','drawbacks','pros and cons'],q:'What are the benefits of working from home?',ch:['Benefit','Explain','Example','+ Flip side'],note:'1 lợi ích phát triển sâu tốt hơn 3 lợi ích liệt kê.'},
 {n:'Compare',v:'So sánh nhóm',c:'#18794E',sig:['difference','compared with','older vs younger'],q:'How do older and younger people differ in the way they shop?',ch:['Difference','Reason','Example'],note:'Nêu khác biệt rồi giải thích vì sao khác.'},
 {n:'Past vs Present',v:'Thay đổi',c:'#5B3EA6',sig:['changed','in the past','nowadays'],q:'How has the way people communicate changed?',ch:['Then','Now','Why'],note:'Ngữ pháp: used to, hiện tại hoàn thành.'},
 {n:'Future',v:'Dự đoán',c:'#0E7490',sig:['in the future','will','in 20 years'],q:'Will people still read printed books in the future?',ch:['Predict','Basis','Impact'],note:'Dự đoán có mức độ → xu hướng hiện tại → hệ quả.'},
 {n:'Cause / Reason',v:'Nguyên nhân',c:'#B42318',sig:['Why…?','What makes…?'],q:'Why do many young people move to big cities?',ch:['Cause','Effect','Example'],note:'Khung C-E-E.'},
 {n:'Problem – Solution',v:'Giải pháp',c:'#9A6400',sig:['What can be done…?','How can the government…?'],q:'How can governments reduce traffic congestion?',ch:['Solution','Mechanism','Example'],note:'Giải pháp → vì sao hiệu quả → nơi đã áp dụng.'},
 {n:'Hypothetical',v:'Giả định',c:'#BE185D',sig:['What would happen if…?','Imagine…'],q:'What would happen if all shops closed on Sundays?',ch:['Accept','Consequence','Verdict'],note:'Giữ would xuyên suốt.'}];
$('#tGrid').innerHTML=TYPES.map((t,i)=>`<button class="tcard" style="--c:${t.c}" data-t="${i}"><span class="tn">${i+1}</span><span><b>${t.n}</b></span></button>`).join('');
$('#tGrid').addEventListener('click',e=>{const b=e.target.closest('.tcard');if(!b)return;const i=+b.dataset.t,t=TYPES[i];
  $$('.tcard').forEach(x=>x.classList.toggle('on',x===b));const D=$('#tDetail');D.style.setProperty('--c',t.c);
  D.innerHTML=`<h3>${i+1}. ${t.n}</h3><div class="sig">${t.sig.map((s,k)=>`<span style="animation-delay:${k*.12}s">${s}</span>`).join('')}</div>
   <div class="qcard2 sm"><span class="qk">Q</span><span class="qx">${t.q}</span></div>
   <div class="chain">${t.ch.map((c,k)=>(k?`<span class="ar" style="animation-delay:${.5+k*.45-.15}s">→</span>`:'')+`<span class="lk" style="animation-delay:${.5+k*.45}s">${c}</span>`).join('')}</div>
   <div class="tnote" style="animation-delay:${.6+t.ch.length*.45}s">${t.note}</div>
   ${i===5||i===3?'<div class="hybrid">Câu hỏi lai: <i>Why has online shopping become so popular?</i> = Cause + Past vs Present → khung Cause, ngữ pháp hiện tại hoàn thành.</div>':''}`;
  SFX.whoosh();t.ch.forEach((_,k)=>setTimeout(()=>SFX.pop(k+2),500+k*450))});

$('.tcard').dispatchEvent(new MouseEvent('click',{bubbles:true}));SFX.stop();
/* ---------- guessing game ---------- */
const GQ=[
 ['How has technology changed the way people keep in touch?',3],['Do you think social media brings people closer together or pushes them apart?',0],
 ['What are the drawbacks of children having smartphones at a young age?',1],['Will face-to-face meetings become less common in the future?',4],
 ['Why do some students prefer studying online rather than in class?',5],['Should schools focus more on practical skills than academic subjects?',0],
 ['How is the role of teachers different now compared to the past?',3],['What would happen if university education were free for everyone?',7],
 ['Why do many people fail to recycle even though they know it matters?',5],['What can individuals do to reduce plastic waste?',6],
 ['Is protecting the environment mainly the responsibility of governments or individuals?',0],['How will climate change affect the way people live in the next 30 years?',4],
 ['What factors do young people consider when choosing a job?',5],['How do older and younger workers differ in their attitudes to work?',2],
 ['What are the advantages and disadvantages of working from home?',1],['Do you think people will work fewer hours in the future?',4],
 ['Why has online shopping become so popular?',5,3]];
let gi=0;
$('#gChips').innerHTML=TYPES.map((t,i)=>`<button class="gchip" style="--c:${t.c}" data-g="${i}">${t.n}</button>`).join('');
function paintG(){const q=GQ[gi];const T=$('#gText');T.textContent=q[0];T.classList.remove('swap');void T.offsetWidth;T.classList.add('swap');
  $('#gNum').textContent=(gi+1)+' / '+GQ.length;$('#gAns').innerHTML='';$$('.gchip').forEach(c=>c.className='gchip');
  const tm=$('#sGuess .timer [data-t="reset"]');tm&&tm.click()}
function ansG(){const q=GQ[gi],t=TYPES[q[1]];$$('.gchip').forEach(c=>{const k=+c.dataset.g;c.classList.remove('vote');c.classList.toggle('right',k===q[1]||k===q[2]);c.classList.toggle('wrong',k!==q[1]&&k!==q[2])});
  let h=`<span class="ttag" style="--c:${t.c}">${t.n}</span>`;if(q[2]!=null)h+=`<span class="ttag" style="--c:${TYPES[q[2]].c};animation-delay:.25s">+ ${TYPES[q[2]].n}</span>`;
  h+=`<span class="fw">${t.ch.join(' → ')}</span>`;$('#gAns').innerHTML=h;SFX.ding()}
$('#gChips').addEventListener('click',e=>{const c=e.target.closest('.gchip');if(!c)return;c.classList.toggle('vote');SFX.tick()});
paintG();

/* ---------- answer with the frame: frame -> idea -> linked sentences ---------- */
const FR=[
 {t:0,name:'Opinion',q:'Do you think children should learn to cook at school?',rows:[
  ['P','Point','Yes – at a basic level','Yes, <em>I’d say</em> cooking deserves a place in the curriculum, at least at a basic level.'],
  ['R','Reason','useful life skill · can’t cook → fast food','<em>The main reason is that</em> it’s a useful life skill – sooner or later everyone has to feed themselves, and kids who can’t cook tend to rely on fast food.'],
  ['E','Example','VN students leave home at 18 → takeaways','A lot of university students in Vietnam, <em>for instance</em>, move away from home at eighteen and end up living on takeaways.'],
  ['B','Back','a few lessons → health + wallet','<em>So</em> a few practical lessons a month would pay off in the long run, both for their health and their wallet.']]},
 {t:5,name:'Cause',q:'Why do many young people move to big cities?',rows:[
  ['C','Cause','jobs · well-paid positions','<em>It largely comes down to</em> jobs – big cities simply have far more well-paid positions.'],
  ['E','Effect','graduates leave hometowns','<em>As a result,</em> most graduates leave their hometowns as soon as they finish university.'],
  ['E','Example','Hanoi: tech, finance in the centre','<em>In Hanoi, for instance,</em> most tech and finance companies are based in the centre.'],
  ['+','Ý đối lập','high rents → moving back','<em>That said,</em> more people are now moving back to their hometowns because rents are so high.']]},
 {t:3,name:'Past vs Present',q:'How have public spaces in your city changed over the last ten years?',rows:[
  ['1','Then','10 years ago: old parks, motorbikes on pavements','Quite dramatically. <em>Ten years ago</em>, most public spaces were fairly basic – a few old parks and pavements that were mostly taken over by motorbikes.'],
  ['2','Now','pedestrian areas · Hoan Kiem walking street','<em>These days, though,</em> the city has invested a lot more in pedestrian areas, like the walking street around Hoan Kiem Lake.'],
  ['3','Why','liveable city → tourism, investment','<em>What’s driven this change, I think, is that</em> local authorities have realised that liveable cities attract tourism and investment.'],
  ['+','Ý đối lập','only in the centre · suburbs not yet','<em>That said,</em> most of the newer spaces are in the centre, so people in the suburbs haven’t really benefited yet.']]},
 {t:0,name:'Opinion · hai mặt',q:'Do you think shopping malls are replacing traditional public spaces?',rows:[
  ['1','Depends','to some extent · young people','<em>To some extent</em>, yes, particularly among young people.'],
  ['A','Case A','cool, safe, all in one place','Malls are air-conditioned, safe and have everything in one place, <em>so</em> on a hot afternoon they’re far more appealing than a park.'],
  ['B','Case B','cost money · old & low-income → parks','<em>Having said that,</em> you’re expected to spend money there, so older people and low-income families still rely heavily on parks.'],
  ['=','Overall','competing, not replacing','<em>So on balance,</em> I’d say malls are competing with public spaces rather than replacing them.']]},
 {t:6,name:'Problem – Solution',q:'What can local authorities do to make cities more liveable?',rows:[
  ['S','Solution','invest in public transport','<em>One practical step would be to</em> invest seriously in public transport.'],
  ['M','Mechanism','good buses/metro → fewer motorbikes → less traffic','<em>If</em> buses and the metro were reliable and affordable, far fewer people would ride motorbikes, <em>which would</em> cut congestion and pollution.'],
  ['E','Example','Singapore metro','Singapore is <em>a case in point</em>: its efficient metro is a big part of why the city feels so clean and orderly.'],
  ['+','Giải pháp 2','unused land → small parks','<em>Beyond that,</em> authorities could turn unused plots of land into small neighbourhood parks.']]},
 {t:7,name:'Hypothetical',q:'What would cities be like if there were no public parks?',rows:[
  ['A','Accept','unbearable','<em>I suppose</em> they’d become pretty unbearable places to live, to be honest.'],
  ['C','Consequence','no free exercise → stress · children hit hardest','<em>Without parks,</em> people would have nowhere to exercise or unwind for free, and children would be hit hardest.'],
  ['C','Consequence','hotter cities · trees cool the air','<em>On top of that,</em> cities would get noticeably hotter, because trees play a big role in cooling the air.'],
  ['V','Verdict','still function, hardly liveable','<em>So all in all,</em> a city without parks would still function, but it would hardly be liveable.']]}];
const FC=['#1F5FD6','#C25E0C','#18794E','#5B3EA6'];
let fi=0;
$('#fTabs').innerHTML=FR.map((f,i)=>`<button data-f="${i}">${f.name}</button>`).join('');
function paintF(){const f=FR[fi],S=$('#sFrame');$$('#fTabs button').forEach(b=>b.classList.toggle('on',+b.dataset.f===fi));
  $('#fTitle').textContent=f.name;
  const q=$('#fQ .qx');q.textContent=f.q;q.classList.remove('swap');void q.offsetWidth;q.classList.add('swap');
  $('#fStack').innerHTML=f.rows.map((r,i)=>{const lk=(r[3].match(/<em>(.*?)<\/em>/)||[])[1]||'';const c=r[0]==='+'?'#16213A':FC[i%4];
    return `<div class="frow" style="--c:${c}" data-i="${i}">${i?`<span class="lkpill">${lk}</span>`:''}<button class="flab"><b>${r[0]}</b><span>${r[1]}</span></button><div class="fbody"><span class="fidea">${r[2]}</span><span class="fsent">${r[3]}</span></div></div>`}).join('');
  S.dataset.steps=f.rows.length+1;S.dataset.step=0;$('#fStack').classList.remove('linked')}
function stepF(n){const rows=$$('.frow');rows.forEach((r,i)=>r.classList.toggle('in',i<n));$('#fStack').classList.toggle('linked',n>rows.length);$('[data-act="f-link"]').classList.toggle('on',n>rows.length)}
STEP.sFrame=(s,n)=>{stepF(n);if(n){n>FR[fi].rows.length?(SFX.zip(),setTimeout(()=>SFX.chime(),400)):SFX.pop(n+1)}};
$('#fTabs').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;fi=+b.dataset.f;paintF();stepF(0);SFX.whoosh()});
$('#fStack').addEventListener('click',e=>{const l=e.target.closest('.flab');if(!l)return;const r=l.closest('.frow');r.classList.toggle('in');
  $('#sFrame').dataset.step=$$('.frow.in').length;SFX.pop(+r.dataset.i+2)});
paintF();

/* ---------- ranking ---------- */
const RANK=[
 {r:1,h:'P-R-E-B + ý đối lập',x:'It largely comes down to jobs… That said, more people are now moving back to their hometowns because…',b:'7',w:'Có chiều sâu, nhìn được hai mặt (FC, GRA)'},
 {r:2,h:'P-R-E-B một ý',x:'I’d say the main reason is jobs. Big cities have more well-paid positions… For example, in Hanoi… So…',b:'6–6.5',w:'Đủ cấu trúc, dễ theo dõi; còn một chiều'},
 {r:3,h:'Liệt kê nhiều ý',x:'Firstly, jobs. Secondly, education. Thirdly, entertainment.',b:'5.5',w:'Mỗi ý một câu, không phát triển'},
 {r:4,h:'Một câu ý kiến',x:'Because there are many jobs in big cities.',b:'5',w:'Quá ngắn, không đủ bằng chứng để chấm FC, GRA'},
 {r:5,h:'Kể chuyện bản thân',x:'I want to move to Hanoi because my brother lives there…',b:'≤ 5',w:'Lệch yêu cầu Part 3'}];
const RL=$('#rankList');let rOrder=[3,5,1,4,2];
RL.innerHTML=RANK.map(k=>`<div class="rk" data-r="${k.r}"><span class="rn">?</span><span class="rkh">${k.h}</span><span class="rkx">${k.x}</span><span class="rkb">${k.b}</span><span class="rkw">${k.w}</span></div>`).join('');
function placeR(sorted){$$('.rk',RL).forEach(el=>{const r=+el.dataset.r,pos=sorted?r-1:rOrder.indexOf(r);el.style.top=(pos*20.6)+'%';$('.rn',el).textContent=sorted?r:String.fromCharCode(65+pos)})}
placeR(false);
RL.addEventListener('click',e=>{const k=e.target.closest('.rk');if(!k)return;k.classList.toggle('open');SFX.tick()});

/* ---------- phrase / grammar stairs ---------- */
const PHR=[
 ['Mở đầu','Yes. / No. / This is a very interesting question.','Yes, I think so. / I don’t think so.','I’d say so, at least to some extent. / Not really, to be honest.','Band 5 cụt hoặc học thuộc; band 7 trả lời thẳng kèm mức độ'],
 ['Nêu quan điểm','In my opinion / I think (lặp mọi câu)','I believe… / In my view…','I’d say… / I’m fairly convinced that… / As far as I can tell…','Đa dạng, thể hiện mức độ chắc chắn'],
 ['Nêu lý do','Because… (đứng đầu, câu cụt)','The main reason is that…','It largely comes down to… / This is mainly because…','Câu cụt là lỗi GRA'],
 ['Đưa ví dụ','For example, me, I…','For example, in Vietnam…','Take… for example. / A case in point is…','Ví dụ khái quát, không chỉ về bản thân'],
 ['Bổ sung ý','And… / Also… (lặp)','Besides, … / Another reason is…','On top of that, … / What’s more, …','Moreover, Furthermore hợp văn viết hơn văn nói'],
 ['Đối lập','But…','However, …','That said, … / Having said that, …','Discourse marker tự nhiên của văn nói'],
 ['Nói về số đông','All people… / Everyone…','Many people…','Most people tend to… / By and large, people…','Hedging tránh khái quát tuyệt đối'],
 ['Đánh giá','It is good / bad / very important.','It is useful. / It has a big effect on…','It makes a real difference. / It takes a toll on… / It pays off.','Collocation thay tính từ chung chung (LR)'],
 ['Kết ý','That’s all. / That’s it.','So I think…','So all in all, … / That’s why I’d say…','Kết bằng nội dung, không bằng câu báo hết'],
 ['Khi cần thời gian','I don’t know.','I’m not sure, but I think…','I’ve never really thought about it, but my guess is…','Vẫn nói tiếp được, không mất FC; tối đa 1 lần/câu']];
const GRAM=[
 ['So sánh','Old people <span class="err">is</span> different <span class="err">young people</span>. / <span class="err">more better</span>','Older people are more careful than young people.','Older people are far more cautious than younger ones, whereas…','Cấu trúc so sánh + whereas'],
 ['Thay đổi','In the past people <span class="err">go</span> to the market.','In the past people used to go to the market, but now they…','Shopping habits have changed dramatically over the past decade.','used to · hiện tại hoàn thành'],
 ['Dự đoán','In the future people <span class="err">will</span>… (chắc chắn tuyệt đối)','I think people will probably…','It’s likely that… / I can’t see… happening any time soon.','Dự đoán có mức độ'],
 ['Giả định / giải pháp','If there <span class="err">is no</span> parks, people <span class="err">will</span>…','If there were no parks, people would…','Without parks, people would… / If… were to…, …','Điều kiện loại 2'],
 ['Nguyên nhân – kết quả','<span class="err">Because</span>…, <span class="err">so</span>… (thừa liên từ)','Because…, … / …, so…','…, which means that… / As a result, …','Mệnh đề quan hệ nối tiếp'],
 ['Mệnh đề quan hệ / nhấn mạnh','People who <span class="err">they</span> live in cities…','People who live in cities…','What really matters to city dwellers is… (câu chẻ)','Câu chẻ']];
function stairs(listId,stId,data,sid){const L=$(listId),S=$(stId);let sel=0;
  L.innerHTML=data.map((d,i)=>`<button data-i="${i}">${d[0]}</button>`).join('');
  function paint(){const d=data[sel];$$('button',L).forEach(b=>b.classList.toggle('on',+b.dataset.i===sel));
    S.innerHTML=`<div class="st5"><span class="bl">Band 5</span><span class="tx">${d[1]}</span></div><div class="st6"><span class="bl">Band 6</span><span class="tx">${d[2]}</span></div><div class="st7"><span class="bl">Band 7</span><span class="tx">${d[3]}</span><span class="why">${d[4]}</span></div>`;
    lv(stepOf($('#'+sid)))}
  function lv(n){const [a,b,c]=$$('div',S);requestAnimationFrame(()=>{a.classList.add('in');a.classList.toggle('x',n>=1);b.classList.toggle('in',n>=1);c.classList.toggle('in',n>=2)})}
  L.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;sel=+b.dataset.i;$('#'+sid).dataset.step=0;paint();SFX.thud()});
  STEP[sid]=(s,n)=>{lv(n);if(n===1)SFX.grow();if(n===2)SFX.chime()};paint()}
$('#sPhr').dataset.steps=2;$('#sGram').dataset.steps=2;
stairs('#phrList','#phrStairs',PHR,'sPhr');stairs('#gramList','#gramStairs',GRAM,'sGram');
const SIX=['Mệnh đề quan hệ','Câu điều kiện','Bị động','Danh động từ làm chủ ngữ','Câu chẻ','Hiện tại hoàn thành'];
$('#six').insertAdjacentHTML('beforeend',SIX.map(x=>`<button class="s6">${x}</button>`).join('')+'<span class="cnt" id="sixN">0/6</span>');
$('#six').addEventListener('click',e=>{const b=e.target.closest('.s6');if(!b)return;b.classList.toggle('on');const n=$$('.s6.on').length;const c=$('#sixN');c.textContent=n+'/6';c.classList.toggle('ok',n>=3);n>=3&&b.classList.contains('on')?SFX.ding():SFX.tick()});

/* ---------- errors ---------- */
const ERR=[
 ['Trả lời quá ngắn','Yes, because it’s convenient.','Không đủ bằng chứng cho FC (“speak at length”) và GRA','Áp P-R-E-B; nói ngay P, nghĩ R trong lúc nói'],
 ['Kể chuyện cá nhân','Câu nào cũng bắt đầu bằng I','Part 3 hỏi về xã hội, không hỏi về bạn','Mở đầu bằng Most people / In Vietnam… + tend to; chuyện của mình chỉ dùng ở bước E'],
 ['Liệt kê không phát triển','Firstly… Secondly… Thirdly… mỗi ý 1 câu','Nghe như đọc bài viết; thiếu chiều sâu','1–2 ý, phát triển bằng lý do + ví dụ'],
 ['Vòng vo, không chọn quan điểm','3 câu chung chung rồi mới nêu ý','Mất mạch, giám khảo khó theo dõi (FC)','Câu đầu tiên là câu trả lời; không có ý kiến đúng/sai – chọn bên dễ nói hơn'],
 ['Sai thì theo dạng câu hỏi','How has… changed? → toàn hiện tại đơn','Lỗi GRA có hệ thống','Xác định dạng câu hỏi, dùng ngữ pháp của dạng đó'],
 ['Lặp từ khóa','public transport… public transport…; lặp good / bad','Không chứng minh được khả năng paraphrase (LR)','Học 10–15 collocation/chủ đề; quên từ thì nói vòng: the kind of thing that…'],
 ['Dùng template học thuộc','That’s a thought-provoking question…','Cụm học thuộc không được tính vào LR','Câu giờ chỉ khi cần thật, tối đa 1 lần/câu'],
 ['Bí ý tưởng với chủ đề lạ','Im lặng, I don’t know, nói 1 câu rồi dừng','FC bị đánh giá thấp','6 lăng kính + WHO – WHY – RESULT; giới hạn: In Vietnam at least…'],
 ['Không hiểu câu hỏi','Trả lời lệch đề','Lệch đề làm mất điểm FC','Hỏi lại không bị trừ điểm: Sorry, could you rephrase that? / Do you mean…?'],
 ['Hoảng khi bị ngắt / hỏi xoáy','Ngập ngừng, nghĩ mình trả lời sai','Ngập ngừng kéo FC xuống','Giám khảo ngắt vì đã đủ bằng chứng hoặc muốn thử band cao hơn; trả lời câu mới bình thường'],
 ['Nói quá dài, ngữ pháp rối','Hơn 1,5 phút, câu nhiều mệnh đề','Mất mạch ý, lỗi GRA tăng','Mỗi câu chỉ 1 cấu trúc phức; dừng sau B'],
 ['Đều đều, đuối sức cuối bài','Mất âm cuối -s, -ed; giọng đều','Câu dài khó hiểu, P kẹt ở 5–6','Chia cụm, nhấn từ khóa, giữ âm cuối; luyện mock đủ 11–14 phút']];
/* ---------- errors, one at a time ---------- */
let curE=-1;
$('#eDots').innerHTML=ERR.map((_,i)=>`<button data-e="${i}" class="${i<3?'t3':''}">${i+1}</button>`).join('');
const AV='<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="14" r="8" fill="#16213A"/><path d="M5 38c2-9 8-13 15-13s13 4 15 13z" fill="#16213A"/></svg>';
function paintE(n){const i=Math.min(11,Math.floor(n/3)),k=n%3,e=ERR[i],B=$('#err1');
  if(i!==curE){curE=i;B.innerHTML=`<div class="eleft"><div class="enum">#${i+1}${i<3?'<span class="top3">Top 3</span>':''}</div><div class="etitle">${e[0]}</div>
    <div class="esay"><span class="eav">${AV}</span><span class="ebub">${e[1]}</span></div></div>
    <div class="eright"><div class="ewhy"><b>Mất điểm vì</b><span>${e[2]}</span></div><div class="efix"><b>Khắc phục</b><span>${e[3]}</span></div></div>`}
  $('.ewhy',B).classList.toggle('in',k>=1);$('.efix',B).classList.toggle('in',k>=2);
  $$('#eDots button').forEach((d,j)=>{d.classList.toggle('on',j===i);d.classList.toggle('done',j<i)})}
STEP.sErr=(s,n)=>{const k=n%3;paintE(n);if(n===0&&curE===0)return;k===0?SFX.thud():k===1?SFX.buzz():SFX.chime()};
$('#eDots').addEventListener('click',e=>{const d=e.target.closest('[data-e]');if(!d)return;setStep($('#sErr'),+d.dataset.e*3)});

/* ---------- lens wheel + frame ---------- */
const LENS=[
 {n:'Tiền',e:'Money',a:'financial',c:'#9A6400',w:'families on a tight budget',y:'it costs or saves money',r:'people spend more or less'},
 {n:'Sức khoẻ',e:'Health',a:'health',c:'#18794E',w:'children and older people',y:'it affects physical and mental health',r:'people’s well-being improves or suffers'},
 {n:'Thời gian',e:'Time',a:'practical',c:'#1F5FD6',w:'busy office workers',y:'it saves or wastes time',r:'people have more or less free time'},
 {n:'Công nghệ',e:'Technology',a:'technological',c:'#5B3EA6',w:'young people who grew up online',y:'apps and the internet make it easier',r:'habits change very quickly'},
 {n:'Môi trường',e:'Environment',a:'environmental',c:'#0E7490',w:'people living in big cities',y:'it creates or reduces waste and pollution',r:'cities become more or less liveable'},
 {n:'Quan hệ XH',e:'Relationships',a:'social',c:'#BE185D',w:'families and local communities',y:'people spend more or less time together',r:'social bonds get stronger or weaker'}];
const LQ=[
 {q:'Should museums be free for everyone?',t:0,p:'Yes, <em>I’d say so</em>, at least to some extent – mainly for {A} reasons.'},
 {q:'Why do people like to collect things?',t:5},
 {q:'How will festivals be celebrated in the future?',t:4,p:'<em>I think</em> festivals are likely to change quite a lot, mostly for {A} reasons.'},
 {q:'What can be done to encourage people to read more?',t:6,p:'<em>One practical step would be to</em> tackle the {A} side of the problem.'},
 {q:'What would happen if there were no cinemas?',t:7,p:'<em>I suppose</em> life would change quite a bit, especially on the {A} side.'}];
const LROLE={0:['point','why','who','result'],5:['cause','result','who'],4:['point','why','result'],6:['point','why','who'],7:['point','result','verdict']};
const RCHIP={point:'Ý chính',cause:'WHY',why:'WHY',who:'WHO',result:'RESULT',verdict:'Kết'};
function lSent(role,L,Q){const A=`<b>${L.a}</b>`;switch(role){
  case 'point':return Q.p.replace('{A}',A);
  case 'cause':return `<em>It largely comes down to</em> ${A} reasons – <b>${L.y}</b>.`;
  case 'why':return `<em>The main reason is that</em> <b>${L.y}</b>.`;
  case 'who':return `<em>Take</em> <b>${L.w}</b>, <em>for example</em>.`;
  case 'result':return `<em>As a result,</em> <b>${L.r}</b>.`;
  case 'verdict':return `<em>So all in all,</em> the ${A} side would matter most.`}}
let lqi=0,wrot=0,lensSel=-1;
(function(){const svg=$('#wheel'),NS='http://www.w3.org/2000/svg',R=110,n=LENS.length;
  LENS.forEach((l,i)=>{const a0=-Math.PI/2-Math.PI/n+i*2*Math.PI/n,a1=a0+2*Math.PI/n;
    const p=document.createElementNS(NS,'path');p.setAttribute('d',`M0 0L${Math.cos(a0)*R} ${Math.sin(a0)*R}A${R} ${R} 0 0 1 ${Math.cos(a1)*R} ${Math.sin(a1)*R}Z`);p.setAttribute('fill',l.c);p.setAttribute('stroke','#fff');p.setAttribute('stroke-width','3');svg.appendChild(p);
    const am=(a0+a1)/2,t=document.createElementNS(NS,'text');t.setAttribute('x',Math.cos(am)*70);t.setAttribute('y',Math.sin(am)*70+5);t.setAttribute('text-anchor','middle');
    t.setAttribute('transform',`rotate(${am*180/Math.PI+90} ${Math.cos(am)*70} ${Math.sin(am)*70+5})`);t.textContent=l.n;svg.appendChild(t)});
  const c=document.createElementNS(NS,'circle');c.setAttribute('r',20);c.setAttribute('fill','#16213A');svg.appendChild(c)})();
function paintLQ(){const Q=LQ[lqi],T=TYPES[Q.t],q=$('#lQ .qx');q.textContent=Q.q;q.classList.remove('swap');void q.offsetWidth;q.classList.add('swap');
  const roles=LROLE[Q.t];
  $('#lFrame').innerHTML=roles.map((r,i)=>`<button class="lrow" style="--c:${FC[i%4]}" data-i="${i}"><span class="llab"><b>${T.ch[i]}</b><span class="role">${RCHIP[r]}</span></span><span class="lbody"></span></button>`).join('');
  paintPick()}
function paintPick(){const T=TYPES[LQ[lqi].t];let h=`<span class="ltype" style="--c:${T.c}">${T.n}</span>`;
  if(lensSel>=0){const l=LENS[lensSel];h+=`<span class="lplus">+</span><span class="lz" style="background:${l.c}">${l.n} · ${l.e}</span>`}$('#lPick').innerHTML=h}
function resetW(){$$('.lrow').forEach(r=>{r.classList.remove('on');$('.lbody',r).innerHTML=''})}
$('#lFrame').addEventListener('click',e=>{const r=e.target.closest('.lrow');if(!r)return;if(lensSel<0){SFX.buzz();return}
  const i=+r.dataset.i,Q=LQ[lqi];$('.lbody',r).innerHTML='<span>'+lSent(LROLE[Q.t][i],LENS[lensSel],Q)+'</span>';r.classList.add('on');SFX.pop(i+3)});
paintLQ();

/* ---------- goals ---------- */
const GOAL=[
 ['Độ dài mỗi câu trả lời','3–4 câu (20–30 giây)','5–6 câu (35–45 giây)',55,90],
 ['Khung','P-R-E-B cơ bản','P-R-E-B + ý đối lập; khung theo dạng'],
 ['Số ý','1 ý, có lý do và ví dụ','1–2 ý phát triển sâu, có ý đối lập'],
 ['Dạng câu hỏi ưu tiên','Opinion, Advantages, Cause, Past vs Present','Cả 8 dạng, đặc biệt Future, Hypothetical, Compare'],
 ['Ngữ pháp bắt buộc','Ít nhất 1 câu phức đúng (because, which, if); đúng thì','Ít nhất 3/6 cấu trúc, gồm điều kiện loại 2'],
 ['Từ vựng','Paraphrase từ khóa câu hỏi; 1–2 collocation','Collocation, cụm ít phổ biến, hedging tự nhiên'],
 ['Lỗi ưu tiên sửa','#1 quá ngắn · #2 kể chuyện cá nhân · #5 sai thì','#3 liệt kê · #6 lặp từ khóa · #7 template'],
 ['Exercise B','Topic 1 và 2 (8 câu)','Cả 4 topic (16 câu)'],
 ['Exercise C','Câu 1–4, không hỏi xoáy','Cả 5 câu, có hỏi xoáy']];
function paintGoal(g){$$('#goalSeg button').forEach(b=>b.classList.toggle('on',+b.dataset.g===g));const G=$('#goalGrid');G.classList.toggle('g7',g===7);
  G.innerHTML=GOAL.map((r,i)=>`<div class="gcard"><span class="lbl2">${r[0]}</span><span class="gv" style="animation-delay:${i*.06}s">${g===6?r[1]:r[2]}</span>${r[3]?`<div class="gmeter"><i style="width:${g===6?r[3]:r[4]}%"></i></div>`:''}</div>`).join('')}
$('#goalSeg').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const m=$('.gmeter i');paintGoal(+b.dataset.g);SFX.whoosh(b.dataset.g==='7')});
paintGoal(6);

/* ---------- Exercise A ---------- */
const EXA=[
 {q:'Do you think it is important for children to play sports?',bad:'<span class="er">Yes.</span> Sport is good for health. <span class="er">Children play sport is fun.</span>',
  pr:['Quá ngắn, không có ví dụ','Sai ngữ pháp: Children play sport is fun → <b>Playing sport is fun</b> (danh động từ làm chủ ngữ)'],
  good:[['P','P','Absolutely – I’d say it’s one of the most valuable things children can do outside the classroom.'],['R','R','Apart from the obvious health benefits, team sports teach kids how to cooperate, cope with losing and stick to rules, which are skills they’ll need for the rest of their lives.'],['E','E','A lot of Vietnamese parents, for example, send their children to extra classes every evening, and those kids often end up stressed and inactive.'],['B','B','So I think schools should treat PE as seriously as maths or English.']]},
 {q:'How has shopping changed in your country?',bad:'In the past people <span class="er">go</span> to the market. Now people buy online. It is <span class="er">very convenient</span>.',
  pr:['Sai thì: people go → <b>people used to go</b>','Không giải thích nguyên nhân thay đổi','Từ vựng đơn giản (very convenient)'],
  good:[['P','Point','It’s changed enormously, mainly because of e-commerce.'],['R','Then','In the past, most people used to go to traditional markets or small local shops for almost everything.'],['E','Now','Nowadays, though, apps like Shopee have made it possible to order practically anything from your phone and have it delivered within a day or two.'],['B','Why','The main driver, I think, is convenience, especially for office workers who simply don’t have time to go shopping.'],['X','That said','That said, wet markets are still popular for fresh food, since many people prefer to choose it themselves.']]},
 {q:'What can the government do to reduce air pollution?',bad:'<span class="er">The government should reduce air pollution.</span> Air pollution is very bad. They should <span class="er">do something</span>.',
  pr:['Lặp nguyên văn câu hỏi','Không đưa ra giải pháp cụ thể (do something)','Không có cơ chế hay ví dụ'],
  good:[['P','Solution','I think the most effective measure would be to tighten emission standards for vehicles, because motorbikes and old trucks are among the biggest sources of pollution in Vietnamese cities.'],['R','Mechanism','If older, high-emission vehicles were gradually phased out, air quality would improve fairly quickly.'],['E','Example','Several European cities have done this by setting up low-emission zones where polluting cars simply aren’t allowed.'],['X','+','On top of that, the government could subsidise electric motorbikes to make the switch more affordable.']]}];
let ai=0,aStep=0;
function paintA(){const a=EXA[ai];$$('#aTabs button').forEach(b=>b.classList.toggle('on',+b.dataset.a===ai));$('#aQ .qx').textContent=a.q;
  const B=$('#aBad');B.innerHTML='A: '+a.bad;B.classList.remove('show');$('#aProb').innerHTML='';aStep=0;$('#aGood').innerHTML='<div class="ph7">Band 7</div>'}
$('#aTabs').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;ai=+b.dataset.a;paintA();SFX.tick()});
paintA();

/* ---------- Exercise B ---------- */
const EXB=[['Technology',[0,1,2,3]],['Education',[4,5,6,7]],['Environment',[8,9,10,11]],['Work',[12,13,14,15]]];
const CHECK=['Câu đầu tiên trả lời thẳng câu hỏi','Có ít nhất một lý do rõ ràng','Có một ví dụ cụ thể','Nói về mọi người / xã hội, không chỉ về bản thân','Có ít nhất 1 câu điều kiện hoặc mệnh đề quan hệ','Dùng đúng thì theo dạng câu hỏi','Không lặp nguyên văn từ khóa của câu hỏi','Câu trả lời dài 30–45 giây'];
let bt=0;
$('#bTabs').innerHTML=EXB.map((t,i)=>`<button data-b="${i}">Topic ${i+1} · ${t[0]}</button>`).join('');
let bq=-1;
function pickB(qi){bq=qi;$$('.bq2').forEach(x=>x.classList.toggle('on',+x.dataset.q===qi));const q=$('#bQ .qx');q.textContent=GQ[qi][0];q.classList.remove('swap');void q.offsetWidth;q.classList.add('swap');
  $('#bFw').innerHTML='<button class="b" data-act="b-ty">Dạng & khung?</button>';$('#bTimer [data-s="reset"]').click()}
function paintB(){$$('#bTabs button').forEach(b=>b.classList.toggle('on',+b.dataset.b===bt));
  $('#bQs').innerHTML=EXB[bt][1].map((qi,k)=>`<button class="bq2" data-q="${qi}"><span class="qn">${k+1}</span><span>${GQ[qi][0]}</span></button>`).join('');pickB(EXB[bt][1][0])}
$('#bTabs').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;bt=+b.dataset.b;paintB();SFX.tick()});
$('#bQs').addEventListener('click',e=>{const q=e.target.closest('.bq2');if(!q)return;pickB(+q.dataset.q);SFX.whoosh()});
const fwHTML=(t,list)=>`<span class="ttag" style="--c:${t.c}">${t.n}</span><span class="chain2">${list.map((c,k)=>`<span class="lk" style="--c:${FC[k%4]};animation-delay:${.15+k*.2}s">${c}</span>`).join('<i>→</i>')}</span>`;
paintB();
function mkCheck(box){box.insertAdjacentHTML('beforeend',CHECK.map(c=>`<button class="ck2"><i>✓</i><span>${c}</span></button>`).join('')+'<div class="cksum"><span>Đạt</span><span class="ckn">0/8</span><button class="b sm" data-act="ck-reset">↺</button></div>');
  box.addEventListener('click',e=>{if(e.target.closest('[data-act="ck-reset"]')){$$('.ck2',box).forEach(c=>c.classList.remove('on'));$('.ckn',box).textContent='0/8';return}
    const c=e.target.closest('.ck2');if(!c)return;c.classList.toggle('on');const n=$$('.ck2.on',box).length;$('.ckn',box).textContent=n+'/8';n===8?SFX.cheer():SFX.pop(n||1)})}
mkCheck($('#bCheck'));

/* ---------- speaking timers (0–60 s, target zone 30–45 s) ---------- */
const stimers=[];
$$('.stimer').forEach(t=>{let left=0,iv=null;const fill=$('.sfill',t),tt=$('.stt',t),go=$('[data-s="go"]',t);
  const paint=()=>{fill.style.width=Math.min(100,left/60*100)+'%';tt.textContent=left+'″';t.classList.toggle('zoneon',left>=30&&left<=45);t.classList.toggle('over',left>45)};
  const stop=()=>{clearInterval(iv);iv=null;go.textContent='▶ Bắt đầu nói'};
  const reset=()=>{stop();left=0;paint()};
  t.addEventListener('click',e=>{const b=e.target.closest('[data-s]');if(!b)return;
    if(b.dataset.s==='go'){if(iv){stop();return}if(left>=60)left=0;go.textContent='❚❚ Dừng';SFX.pop(3);
      iv=setInterval(()=>{left++;paint();if(left===30)SFX.ding();if(left===45)SFX.chime();if(left>=60){stop();SFX.buzz()}},1000)}else reset()});
  stimers.push(reset);paint()});
LEAVE.push(()=>stimers.forEach(f=>f()));

/* ---------- Exercise C (mock) ---------- */
const EXC=[
 ['Why are parks important in big cities?','Who benefits most from them?'],
 ['How have public spaces in your city changed over the last ten years?',null],
 ['Do you think shopping malls are replacing traditional public spaces?','Is that a good thing?'],
 ['What can local authorities do to make cities more liveable?',null],
 ['What would cities be like if there were no public parks?',null]];
$('#cList').innerHTML=EXC.map((c,i)=>`<button class="ce" data-c="${i}"><b>${i+1}. ${c[0]}</b>${c[1]?'<span class="fu">+ câu hỏi xoáy</span>':''}</button>`).join('');
$('#cList').addEventListener('click',e=>{const b=e.target.closest('.ce');if(!b)return;const i=+b.dataset.c,c=EXC[i];
  $$('.ce').forEach(x=>{if(x.classList.contains('on')&&x!==b)x.classList.add('done');x.classList.toggle('on',x===b)});
  $('#cNow').innerHTML=`<div class="cq">${c[0]}</div>`+`<div class="cfu">${c[1]?'<button class="b sm" data-act="c-fu">Hỏi xoáy ▸</button>':''}<button class="b sm" data-act="c-fw">Khung?</button></div>`;
  $('#cTimer [data-s="reset"]').click();SFX.whoosh()});
document.addEventListener('click',e=>{const b=e.target.closest('[data-act="c-fu"]');if(!b)return;const i=+$('.ce.on').dataset.c;
  b.outerHTML=`<span class="bub">${EXC[i][1]}</span>`;$('#cTimer [data-s="reset"]').click();SFX.pop(4)});

/* ---------- model answers ---------- */
const MOD=[
 {fw:'P-R-E-B',
  m7:'Parks are pretty much <mark>the lungs of a city</mark>, so I’d say they’re essential rather than just <mark>nice to have</mark>. For one thing, they give people a rare chance to escape the noise and traffic, <mark>which has a real impact on</mark> mental health, especially for office workers <mark>who spend</mark> all day indoors. On top of that, they’re one of the few free places where people of all ages can mix. <mark>If you go</mark> to Thong Nhat Park in Hanoi early in the morning, for instance, <mark>you’ll see</mark> retirees doing tai chi right next to teenagers playing badminton. So without parks, city life would be a lot more isolating.',
  m6:'I think parks are <mark>very important</mark> in big cities. The main reason is that cities are crowded and noisy, so people need a place to <mark>relax</mark> and get some <mark>fresh air</mark>. For example, in Hanoi many old people go to the park early in the morning to do exercise. So without parks, people in the city would feel more stressed.',
  gap:'Chỉ 1 ý; <b>very important, relax, fresh air</b> thay cho <b>the lungs of a city, nice to have</b>.'},
 {fw:'Then – Now – Why',
  m7:'Quite dramatically, I’d say. Ten years ago, most public spaces were fairly basic – a few old parks and pavements that were mostly <mark>taken over by</mark> motorbikes. These days, though, the city <mark>has invested</mark> a lot more in pedestrian areas; the walking street around Hoan Kiem Lake, which <mark>is closed to</mark> traffic at weekends, is probably the best-known example. <mark>What’s driven this change</mark>, I think, <mark>is</mark> that local authorities have finally realised that liveable cities attract tourism and investment. <mark>That said</mark>, most of the newer spaces are in the centre, so people in the suburbs haven’t really benefited yet.',
  m6:'They have changed a lot. In the past, there were not many places for people to walk, because the pavements were full of motorbikes. Now the city has more walking streets, like the one around Hoan Kiem Lake at the weekend. I think this is because the government wants to make the city more attractive to tourists.',
  gap:'Không có ý đối lập (<b>That said…</b>); không có câu chẻ hay bị động.'},
 {fw:'Depends – Case A – Case B – Overall',
  m7:'<mark>To some extent</mark>, yes, particularly among young people. Malls are air-conditioned, safe and have everything in one place, so on a hot summer afternoon they’re <mark>far more appealing than</mark> a park. Having said that, I wouldn’t call them a true replacement, because you’re expected to spend money there – they’re commercial spaces <mark>dressed up as</mark> public ones. Older people and low-income families, for example, still rely heavily on parks and community squares. So on balance, I’d say malls are <mark>competing with public spaces rather than replacing them</mark>.',
  m6:'Yes, I think so, especially for young people. Malls are cool and comfortable, and you can eat, shop and watch films in one place. However, older people still prefer parks because they don’t have to spend money there. <mark>So I think both of them are still popular.</mark>',
  gap:'Kết luận chung chung; thiếu hedging (<b>To some extent</b>) và cụm như <b>dressed up as</b>.'},
 {fw:'Solution – Mechanism – Example',
  m7:'One practical step would be to invest seriously in public transport. <mark>If buses and the metro were</mark> reliable and affordable, far fewer people <mark>would need</mark> to ride motorbikes, which would cut congestion and air pollution at the same time. Singapore is <mark>a case in point</mark>: its efficient metro system is a big part of why the city feels so clean and orderly <mark>despite being</mark> so crowded. Beyond that, authorities could turn unused plots of land into small neighbourhood parks, which costs relatively little but makes a huge difference to daily life.',
  m6:'I think the government should improve public transport. If buses were cheaper and more frequent, fewer people would use motorbikes, and there would be less traffic and pollution. They could also build more small parks in each district so people have somewhere to relax.',
  gap:'Không có ví dụ thực tế (<b>Singapore is a case in point</b>).'},
 {fw:'Accept – Consequence – Verdict',
  m7:'I suppose they’d become pretty unbearable places to live, to be honest. <mark>Without parks, people would</mark> have nowhere to exercise or <mark>unwind</mark> for free, so problems related to stress and inactivity would probably rise. Children <mark>would be hit hardest</mark>, I think, since many city apartments are tiny and parks are often the only place where kids can run around safely. On top of that, cities would get noticeably hotter, because trees play a big role in cooling the air. <mark>So all in all, a city without parks would still function, but it would hardly be liveable.</mark>',
  m6:'I think cities would be <mark>very unpleasant</mark>. People would have no place to exercise or relax for free, so they would feel more stressed. Children would also suffer, because many families live in small apartments and the park is the only place where they can play outside.',
  gap:'Thiếu câu kết đánh giá; <b>very unpleasant</b> thay cho <b>unbearable, be hit hardest</b>.'}];
let mi=0;
$('#mTabs').innerHTML=MOD.map((_,i)=>`<button data-m="${i}">${i+1}</button>`).join('');
function paintM(){const m=MOD[mi];$$('#mTabs button').forEach(b=>b.classList.toggle('on',+b.dataset.m===mi));const mq=$('#mQ .qx');mq.textContent=EXC[mi][0];mq.classList.remove('swap');void mq.offsetWidth;mq.classList.add('swap');
  $('#m6').innerHTML=m.m6;$('#m7').innerHTML=m.m7;$('#mFw').textContent=m.fw;$('#mGap').innerHTML='<b>Khác ở đâu:</b> '+m.gap;
  $$('#m6,#m7').forEach(x=>{x.style.animation='none';void x.offsetWidth;x.style.animation=''})}
$('#mTabs').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;mi=+b.dataset.m;paintM();SFX.tick()});
paintM();

/* ---------- end checklist ---------- */
$('#endList').innerHTML=CHECK.map((c,i)=>`<div class="ei"><i>${i+1}</i><span>${c}</span></div>`).join('');
STEP.sEnd=(s,n)=>{$$('.ei',s).forEach((x,i)=>x.classList.toggle('in',i<n));if(n)n===8?SFX.cheer():SFX.pop(n)};

/* ---------- timers (countdown ring) ---------- */
$$('.timer').forEach(t=>{const total=+t.dataset.sec;let left=total,iv=null;const C=2*Math.PI*44;
  t.innerHTML=`<div class="ring"><svg viewBox="0 0 100 100"><circle class="bg" cx="50" cy="50" r="44"/><circle class="fg" cx="50" cy="50" r="44" stroke-dasharray="${C}" stroke-dashoffset="0"/></svg><span class="tt"></span></div>
   <div><div class="tl">${t.dataset.label} · ${total>=60?total/60+'′':total+'″'}</div><div class="tb"><button class="b pri sm" data-t="go">▶</button><button class="b sm" data-t="reset">↺</button></div></div>`;
  const fg=$('.fg',t),tt=$('.tt',t),go=$('[data-t="go"]',t);
  const paint=()=>{tt.textContent=Math.floor(left/60)+':'+String(left%60).padStart(2,'0');fg.style.strokeDashoffset=C*(1-left/total);t.classList.toggle('low',left<=Math.min(30,total/3)&&left>0);t.classList.toggle('end',left===0)};
  const stop=()=>{clearInterval(iv);iv=null;go.textContent='▶'};
  t.addEventListener('click',e=>{const b=e.target.closest('[data-t]');if(!b)return;
    if(b.dataset.t==='go'){if(iv){stop();return}if(left===0)left=total;go.textContent='❚❚';SFX.pop(3);
      iv=setInterval(()=>{left=Math.max(0,left-1);if(left<=5&&left>0)SFX.tick();paint();if(left===0){stop();SFX.cheer();setTimeout(()=>SFX.ding(),300)}},1000)}
    else{stop();left=total;paint()}});LEAVE.push(stop);paint()});

/* ---------- clicks ---------- */
document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;
  switch(b.dataset.act){
    case 'step':next();break;
    case 'jar-reset':jarOn.clear();paintJar();SFX.whoosh(false);break;
    case 'g-next':gi=(gi+1)%GQ.length;paintG();SFX.whoosh();break;
    case 'g-prev':gi=(gi-1+GQ.length)%GQ.length;paintG();SFX.whoosh(false);break;
    case 'g-ans':ansG();break;
    case 'r-sort':RL.classList.add('sorted');placeR(true);SFX.zip();setTimeout(()=>SFX.chime(),900);break;
    case 'r-shuffle':RL.classList.remove('sorted');$$('.rk',RL).forEach(k=>k.classList.remove('open'));rOrder=rOrder.slice().sort(()=>Math.random()-.5);placeR(false);SFX.whoosh(false);break;
    case 'lv-up':next();break;
    case 'f-link':{const S=$('#sFrame'),m=+S.dataset.steps;setStep(S,stepOf(S)===m?m-1:m);break}
    case 'b-ty':{const t=TYPES[GQ[bq][1]];$('#bFw').innerHTML=fwHTML(t,t.ch);SFX.pop(3);break}
    case 'c-fw':{const i=+$('.ce.on').dataset.c;b.outerHTML=`<span class="fwpill">${MOD[i].fw}</span>`;SFX.pop(5);break}
    case 'l-q':lqi=(lqi+1)%LQ.length;lensSel=-1;paintLQ();SFX.tick();break;
    case 'l-spin':{resetW();const k=Math.floor(Math.random()*LENS.length);wrot+=360*4+((-k*60-(wrot%360))%360+360)%360;
      $('#wheel').style.transform=`rotate(${wrot}deg)`;lensSel=-1;paintPick();SFX.zip();
      for(let i=0;i<10;i++)setTimeout(()=>SFX.tick(),200+i*i*28);
      setTimeout(()=>{lensSel=k;paintPick();SFX.ding()},3200);break}
    case 'a-err':{$('#aBad').classList.add('show');const P=$('#aProb');if(!P.children.length){EXA[ai].pr.forEach((p,i)=>P.insertAdjacentHTML('beforeend',`<div style="animation-delay:${i*.25}s">${p}</div>`));SFX.buzz()}break}
    case 'a-fix':{const g=EXA[ai].good,G=$('#aGood');if(aStep===0)G.innerHTML='';if(aStep<g.length){const [c,l,t]=g[aStep];G.insertAdjacentHTML('beforeend',`<span class="sn ${c}"><i>${l}</i>${t}</span> `);aStep++;SFX.pop(aStep+1);if(aStep===g.length)setTimeout(()=>SFX.chime(),300)}break}
    case 'm-hl':$('.model2').classList.toggle('hl');b.classList.toggle('on');SFX.ding();break;
    case 'm-gap':$('#mGap').classList.toggle('on');b.classList.toggle('on');SFX.pop(4);break}});

Object.keys(STEP).forEach(id=>{const s=$('#'+id);if(s)setStep(s,0)});
SFX.stop();
const m=/^#s(\d+)$/.exec(location.hash);show(m?+m[1]-1:0);
})();
