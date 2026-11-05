(function(){
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const slides=$$('.slide');const P=window.PLANS;let cur=0;
const NS='http://www.w3.org/2000/svg';
const E=(t,a,p)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e};
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
/* <rc>…</rc> etc. → coloured spans */
const ST={rc:'Mệnh đề quan hệ',vi:'Cụm V-ing',cp:'Câu ghép',ct:'Tương phản',cl:'Nhấn mạnh / đảo'};
const mk=s=>s.replace(/<(rc|vi|cp|ct|cl)>/g,'<span class="hs $1">').replace(/<\/(rc|vi|cp|ct|cl)>/g,'</span>');

/* ---------- navigation (Band 7 slides are skipped while Band 7 is hidden) ---------- */
const STEP={},ENTER={},LEAVE=[];
const jump=$('#jump');
slides.forEach((s,i)=>{const o=document.createElement('option');o.value=i;o.textContent=(i+1)+'. '+(s.dataset.title||'');jump.appendChild(o)});
jump.onchange=()=>show(+jump.value);
const skip=i=>document.body.classList.contains('hide7')&&slides[i]&&slides[i].classList.contains('b7slide');
function show(i,dir){LEAVE.forEach(f=>f());cur=Math.max(0,Math.min(slides.length-1,i));
  while(skip(cur)&&cur>0&&cur<slides.length-1)cur+=(dir||1);
  slides.forEach((s,k)=>s.classList.toggle('on',k===cur));
  $('#count').textContent=(cur+1)+' / '+slides.length;jump.value=cur;SFX.stop();
  const s=slides[cur];if(s.id&&ENTER[s.id])ENTER[s.id](s);
  try{history.replaceState(null,'','#s'+(cur+1))}catch(e){}
  window.dispatchEvent(new Event('deck:show'))}
window.DECK={show:i=>show(i),cur:()=>cur,indexOf:id=>slides.findIndex(s=>s.id===id)};
const stepOf=s=>+(s.dataset.step||0);
function setStep(s,n){s.dataset.step=n;STEP[s.id]&&STEP[s.id](s,n)}
function next(){const s=slides[cur],m=+(s.dataset.steps||0);if(m&&stepOf(s)<m){setStep(s,stepOf(s)+1);return}show(cur+1,1)}
function prev(){const s=slides[cur],m=+(s.dataset.steps||0);if(m&&stepOf(s)>0){setStep(s,stepOf(s)-1);return}show(cur-1,-1)}
$('#prev').onclick=prev;$('#next').onclick=next;
$('#fs').onclick=()=>{const el=document.documentElement;if(document.fullscreenElement){document.exitFullscreen&&document.exitFullscreen().catch(()=>{})}else if(el.requestFullscreen){el.requestFullscreen().catch(()=>{})}};

/* ---------- Band 7 show / hide (teacher) ---------- */
const t7=document.createElement('button');t7.id='t7';t7.className='on';t7.title='Phím 7';t7.textContent='Band 7: hiện';
$('#bar').insertBefore(t7,$('#fs'));
function set7(hide){document.body.classList.toggle('hide7',hide);t7.classList.toggle('on',!hide);t7.textContent='Band 7: '+(hide?'ẩn':'hiện');
  if(hide)$$('.essayslide').forEach(s=>essayVer(s,6));SFX.tick();
  if(skip(cur))show(cur+1,1)}
t7.onclick=()=>set7(!document.body.classList.contains('hide7'));
$('#help').textContent='← → slide/bước · B bảng điểm · 7 ẩn/hiện Band 7';
document.addEventListener('keydown',e=>{if(e.target.closest('input,textarea,select,[contenteditable]'))return;
  if(e.key==='ArrowRight'||e.key==='PageDown'){next();e.preventDefault()}else if(e.key==='ArrowLeft'||e.key==='PageUp'){prev();e.preventDefault()}
  else if(e.key==='7'){t7.click()}});

/* ---------- plan renderer ---------- */
const PAL={b:['#E3ECFC','#1F5FD6'],o:['#FCEBDD','#C25E0C'],g:['#E1F3EA','#18794E'],p:['#EFE8FA','#5B3EA6'],r:['#FDE7E5','#B42318'],t:['#DDF2F0','#1C7C74'],y:['#FFF3C9','#B7791F']};
function label(g,x,y,w,txt,fs,o){if(!txt)return;const lines=txt.split('\n');const mx=Math.max(...lines.map(l=>l.length));
  const f=Math.min(fs,(w-18)/(mx*.6));const h=lines.length*f*1.12;
  if(o&&o.pill){const pw=mx*f*.6+24;E('rect',{x:x-pw/2,y:y-h/2-6,width:pw,height:h+12,rx:8,fill:o.pill},g)}
  const t=E('text',{x,y:y-h/2+f*.86,'text-anchor':'middle','font-size':f.toFixed(1),'font-weight':700,fill:(o&&o.fill)||'#16213A'},g);
  lines.forEach((l,i)=>{const ts=E('tspan',{x,dy:i?f*1.12:0},t);ts.textContent=l})}
function drawPlan(svg,cfg,o={}){svg.setAttribute('viewBox','0 0 1000 620');svg.innerHTML='';svg._cfg=cfg;const fs=o.fs||30;
  const room=cfg.wall;E('rect',{width:1000,height:620,fill:room?'#FBFAF7':'#F5F2E9'},svg);
  const g=E('g',{},svg);
  if(cfg.wall){const [x,y,w,h]=cfg.wall;E('rect',{x,y,width:w,height:h,fill:'#fff',stroke:'#16213A','stroke-width':7},g)}
  cfg.items.forEach(it=>{const {x,y,w,h}=it,cx=x+w/2,cy=y+h/2;
    if(it.t==='rail'){E('line',{x1:it.x1,y1:it.y1,x2:it.x2,y2:it.y2,stroke:'#555','stroke-width':12},g);E('line',{x1:it.x1,y1:it.y1,x2:it.x2,y2:it.y2,stroke:'#fff','stroke-width':4,'stroke-dasharray':'6 14'},g);return}
    if(it.t==='bld'){const c=PAL[it.c||'b'];E('rect',{x,y,width:w,height:h,rx:8,fill:c[0],stroke:c[1],'stroke-width':4},g);label(g,cx,cy,w,it.l,fs)}
    else if(it.t==='room'){const c=it.c?PAL[it.c]:['#fff','#16213A'];E('rect',{x,y,width:w,height:h,fill:c[0],stroke:'#16213A','stroke-width':4},g);label(g,cx,cy,w,it.l,fs)}
    else if(it.t==='green'){E('rect',{x,y,width:w,height:h,rx:8,fill:'#DCEFD3',stroke:'#6BA368','stroke-width':3,'stroke-dasharray':'10 8'},g);
      for(let i=0;i<14;i++){const gx=x+20+((i*67)%(w-40)),gy=y+20+((i*41)%(h-40));E('path',{d:`M${gx} ${gy}l-5 -10M${gx} ${gy}l0 -12M${gx} ${gy}l5 -10`,stroke:'#6BA368','stroke-width':2.5,fill:'none'},g)}
      label(g,cx,cy,w,it.l,fs,{pill:'rgba(255,255,255,.85)'})}
    else if(it.t==='trees'){E('rect',{x,y,width:w,height:h,rx:8,fill:'#E8F3E0'},g);
      for(let ty=y+32;ty<y+h-20;ty+=58)for(let tx=x+32;tx<x+w-20;tx+=62){E('circle',{cx:tx+((ty/58|0)%2)*14,cy:ty,r:24,fill:'#5E9E5A',opacity:.85},g)}
      label(g,cx,cy,w,it.l,fs,{pill:'#fff'})}
    else if(it.t==='water'){E('rect',{x,y,width:w,height:h,fill:'#CFE3F5'},g);for(let wy=y+40;wy<y+h;wy+=60)E('path',{d:`M${x+15} ${wy}q15 -12 30 0t30 0`,stroke:'#7FA8D6','stroke-width':3,fill:'none'},g);label(g,cx,cy,w,it.l,fs)}
    else if(it.t==='road'){E('rect',{x,y,width:w,height:h,fill:'#C9D1DC'},g);if(w>h)E('line',{x1:x,y1:cy,x2:x+w,y2:cy,stroke:'#fff','stroke-width':3,'stroke-dasharray':'20 16'},g);label(g,cx,cy,w,it.l,Math.min(fs,26),{pill:'#16213A',fill:'#fff'})}
    else if(it.t==='ped'){E('rect',{x,y,width:w,height:h,fill:'#F6E3B4',stroke:'#C2932A','stroke-width':3,'stroke-dasharray':'12 8'},g);label(g,cx,cy,w,it.l,Math.min(fs,26),{pill:'#B7791F',fill:'#fff'})}
    else if(it.t==='car'){E('rect',{x,y,width:w,height:h,fill:'#E6E9EE',stroke:'#7D8597','stroke-width':3},g);for(let px=x+28;px<x+w-10;px+=34)E('line',{x1:px,y1:y+8,x2:px,y2:y+34,stroke:'#fff','stroke-width':4},g);label(g,cx,cy+10,w,it.l,fs)}
    else if(it.t==='spot'){E('rect',{x,y,width:w,height:h,rx:30,fill:'#fff',stroke:'#18794E','stroke-width':3,'stroke-dasharray':'8 6'},g);label(g,cx,cy,w,it.l,fs,{fill:'#18794E'})}
  });
  if(cfg.entrance){const [ex,ey]=cfg.entrance;const eg=E('g',{class:'entr'},svg);E('path',{d:`M${ex-22} ${ey-8}L${ex} ${ey-44}L${ex+22} ${ey-8}Z`,fill:'#C25E0C'},eg);
    E('rect',{x:ex-62,y:ey-80,width:124,height:32,rx:8,fill:'#C25E0C'},eg);const t=E('text',{x:ex,y:ey-57,'text-anchor':'middle','font-size':21,'font-weight':800,fill:'#fff'},eg);t.textContent='Entrance'}
  if(cfg.compass){const [cx,cy]=cfg.compass;const c=E('g',{class:'cmp'},svg);E('circle',{cx,cy,r:28,fill:'#fff',stroke:'#16213A','stroke-width':3},c);
    E('path',{d:`M${cx} ${cy-22}L${cx+9} ${cy+6}L${cx} ${cy}L${cx-9} ${cy+6}Z`,fill:'#B42318'},c);const t=E('text',{x:cx,y:cy+22,'text-anchor':'middle','font-size':15,'font-weight':800},c);t.textContent='N'}
  return E('g',{class:'ov'},svg)}
const ovOf=svg=>$('.ov',svg);
function bounds(cfg,id){const it=cfg.items.find(i=>i.id===id);if(!it)return null;
  if(it.t==='rail')return {x:Math.min(it.x1,it.x2),y:it.y1-14,w:Math.abs(it.x2-it.x1),h:28};return {x:it.x,y:it.y,w:it.w,h:it.h}}
function hl(svg,ids,cls,txt){const ov=ovOf(svg);ids.forEach(id=>{const b=bounds(svg._cfg,id);if(!b)return;E('rect',{x:b.x-6,y:b.y-6,width:b.w+12,height:b.h+12,rx:12,class:'hlbox '+(cls||'')},ov)});
  if(txt){const b=bounds(svg._cfg,ids[0]);if(b)tag(svg,b.x+b.w/2,b.y+14,txt,cls)}}
function tag(svg,x,y,txt,cls){const ov=ovOf(svg);const g=E('g',{class:'mtag '+(cls||'')},ov);const w=txt.length*13+26;
  g.style.transform=`translate(${Math.max(w/2+4,Math.min(1000-w/2-4,x))}px,${Math.max(22,y)}px)`;
  E('rect',{x:-w/2,y:-19,width:w,height:38,rx:19},g);const t=E('text',{y:8,'text-anchor':'middle','font-size':22,'font-weight':800},g);t.textContent=txt;return g}
const clearOv=(...svgs)=>svgs.forEach(s=>{const o=ovOf(s);if(o)o.innerHTML=''});
$$('svg[data-plan]').forEach(s=>drawPlan(s,P[s.dataset.plan]));

/* ---------- layout ---------- */
STEP.sLayout=(s,n)=>{$$('.pblk',s).forEach((b,i)=>b.classList.toggle('in',i<n));$('#layPaper').classList.toggle('focus',n>=5);$('#layNote').classList.toggle('in',n>=5);
  if(n)n>=5?SFX.chime():SFX.pop(n)};

/* ---------- three map types ---------- */
STEP.sTypes=(s,n)=>{$$('.tcard',s).forEach((c,i)=>c.classList.toggle('in',i<n));$('.tip1',s).classList.toggle('in',n>=3);if(n)SFX.pop(n+1)};

/* ---------- reading a map ---------- */
const rA=$('#readA'),rB=$('#readB');drawPlan(rA,P.CAMPUS0);drawPlan(rB,P.CAMPUS1);
const RNOTE=['','<b>2000 → Now</b>: quá khứ → hiện tại → dùng <b>has been / was</b>.','<b>La bàn</b> (góc dưới phải) và <b>Entrance</b> (giữa phía nam): dùng để gọi tên vị trí.','So sánh <b>từng khu</b>: thay đổi gì?','Nhóm các thay đổi theo loại: mỗi loại thành <b>một câu</b> trong Overview hoặc thân bài.'];
const RTAGS=[[rB,'lib','THAY THẾ','o'],[rB,'ne','DI DỜI + MỚI','g'],[rA,'ne','BIẾN MẤT','r'],[rB,'cls','MỞ RỘNG','b'],[rB,'garden','THAY THẾ','o'],[rB,'canteen','THAY THẾ','o'],[rB,'offices','GIỮ NGUYÊN','p']];
STEP.sRead=(s,n)=>{$$('#readSteps li').forEach((li,i)=>{li.classList.toggle('done',i<n-1||n===4);li.classList.toggle('cur',i===n-1)});
  $('#readNote').innerHTML=RNOTE[n]||'';$('#readNote').classList.toggle('in',n>0);clearOv(rA,rB);
  $$('figcaption',s).forEach(f=>f.classList.toggle('flash',n===1));
  if(n===2)[rA,rB].forEach(sv=>{const ov=ovOf(sv);[[955,575],[500,560]].forEach(([x,y])=>{E('circle',{cx:x,cy:y,r:44,class:'pulse'},ov)})});
  if(n>=3)RTAGS.forEach(([sv,id,t,c],i)=>{const b=bounds(sv._cfg,id);setTimeout(()=>{if(stepOf(s)<3)return;hl(sv,[id],c);tag(sv,b.x+b.w/2,b.y+4,t,c);SFX.pop(2+i%4)},n===3?i*380:0)});
  if(n&&n!==3)SFX.thud()};

/* ---------- six change types ---------- */
const CHG=[['Xuất hiện mới','new','was built / was constructed / was added / was developed','A library <b>was built</b> in the north-east.'],
 ['Biến mất','gone','was demolished / was removed / was cleared','The trees <b>were cleared</b>.'],
 ['Thay thế','swap','was replaced by / gave way to / was converted into','The garden <b>gave way to</b> sports facilities.'],
 ['Mở rộng · thu nhỏ','grow','was extended / was widened / was reduced in size','The classrooms <b>were extended</b>.'],
 ['Di dời','move','was relocated to / was shifted from … to …','The library <b>was relocated to</b> the north-east.'],
 ['Không đổi','same','remained the same / was retained / was unchanged','The offices <b>remained unchanged</b>.']];
$('#chgBtns').innerHTML=CHG.map((c,i)=>`<button data-chg="${i}" class="k${i}">${c[0]}</button>`).join('');
const cs=$('#chgSvg');
function bld(p,x,y,w,h,c,l){const g=E('g',{class:'cb'},p);g.style.transformBox='fill-box';g.style.transformOrigin='center';E('rect',{x,y,width:w,height:h,rx:8,fill:PAL[c][0],stroke:PAL[c][1],'stroke-width':4},g);if(l){const t=E('text',{x:x+w/2,y:y+h/2+9,'text-anchor':'middle','font-size':26,'font-weight':700,fill:'#16213A'},g);t.textContent=l}return g}
const an=(el,kf,o)=>el.animate(kf,Object.assign({duration:900,easing:'cubic-bezier(.3,1.2,.4,1)',fill:'both'},o));
function playChg(i){cs.innerHTML='';E('rect',{x:20,y:250,width:560,height:16,rx:8,fill:'#D9DFE7'},cs);const k=CHG[i][1];
  if(k==='new'){const b=bld(cs,220,90,160,150,'g','Library');an(b,[{transform:'scale(0)',opacity:0},{transform:'scale(1)',opacity:1}],{delay:200});SFX.pop(4)}
  if(k==='gone'){E('rect',{x:220,y:90,width:160,height:150,rx:8,fill:'none',stroke:'#B42318','stroke-width':3,'stroke-dasharray':'10 8'},cs);const b=bld(cs,220,90,160,150,'r','Trees');
    an(b,[{transform:'scale(1)',opacity:1},{transform:'scale(1,0)',opacity:0}],{delay:500,duration:800,easing:'ease-in'});setTimeout(()=>SFX.thud(),900)}
  if(k==='swap'){const a=bld(cs,220,90,160,150,'g','Garden'),b=bld(cs,220,90,160,150,'r','Sports');an(b,[{opacity:0,transform:'scale(.2)'},{opacity:0,transform:'scale(.2)',offset:.5},{opacity:1,transform:'scale(1)'}],{delay:300,duration:1400});
    an(a,[{opacity:1,transform:'scale(1)'},{opacity:0,transform:'scale(.2)'}],{delay:300,duration:700,easing:'ease-in'});setTimeout(()=>SFX.whoosh(),300)}
  if(k==='grow'){const g=E('g',{class:'cb'},cs);const r=E('rect',{x:220,y:90,width:160,height:150,rx:8,fill:PAL.b[0],stroke:PAL.b[1],'stroke-width':4},g);const t=E('text',{x:300,y:174,'text-anchor':'middle','font-size':26,'font-weight':700},g);t.textContent='Classrooms';
    an(r,[{width:'160px'},{width:'330px'}],{delay:400,duration:1100});an(t,[{transform:'translateX(0)'},{transform:'translateX(85px)'}],{delay:400,duration:1100});setTimeout(()=>SFX.zip(),400)}
  if(k==='move'){E('rect',{x:60,y:90,width:160,height:150,rx:8,fill:'none',stroke:'#5B3EA6','stroke-width':3,'stroke-dasharray':'10 8'},cs);E('path',{d:'M140 80 Q300 -10 460 80',fill:'none',stroke:'#5B3EA6','stroke-width':3,'stroke-dasharray':'8 8'},cs);
    const b=bld(cs,60,90,160,150,'p','Library');an(b,[{transform:'translate(0,0)'},{transform:'translate(160px,-40px)',offset:.5},{transform:'translate(320px,0)'}],{delay:300,duration:1300,easing:'ease-in-out'});SFX.whoosh()}
  if(k==='same'){const b=bld(cs,220,90,160,150,'p','Offices');const g=E('g',{},cs);E('circle',{cx:385,cy:95,r:26,fill:'#18794E'},g);const t=E('text',{x:385,y:105,'text-anchor':'middle','font-size':30,'font-weight':800,fill:'#fff'},g);t.textContent='=';
    an(b,[{transform:'scale(1)'},{transform:'scale(1.06)'},{transform:'scale(1)'}],{duration:700,iterations:2,easing:'ease-in-out'});an(g,[{transform:'scale(0)'},{transform:'scale(1)'}],{delay:600});setTimeout(()=>SFX.ding(),600)}
  $$('#chgBtns button').forEach((b,j)=>b.classList.toggle('on',j===i));
  $('#chgPh').innerHTML=`<span class="pgtag k${i}">${CHG[i][0]}</span><div class="phr">${CHG[i][2].split(' / ').map(p=>`<span>${p}</span>`).join('')}</div><p>${CHG[i][3]}</p>`}
$('#chgBtns').addEventListener('click',e=>{const b=e.target.closest('[data-chg]');if(b)playChg(+b.dataset.chg)});
$$('#chgSvg').forEach(s=>s.querySelectorAll('.cb').forEach(c=>c.style.transformBox='fill-box'));

/* ---------- sorting changes ---------- */
const BINS=['Xuất hiện mới','Biến mất','Thay thế','Mở rộng','Di dời','Giữ nguyên'];
const CHIPS=[['Library cạnh lối vào → Car park',2],['Cây ở phía đông bắc bị chặt',1],['Library + IT centre mới',0],['Classrooms to gấp đôi',3],['Library chuyển lên đông bắc',4],['Garden → Sports facilities',2],['Canteen → Admin offices',2],['Offices không đổi',5]];
$('#sortBins').innerHTML=BINS.map((b,i)=>`<div class="bin k${i}"><b>${b}</b><div class="bc"></div></div>`).join('');
$('#sortTray').innerHTML=CHIPS.map((c,i)=>`<span class="chip3 k${c[1]}" data-i="${i}">${c[0]}</span>`).join('');
const chipEls=$$('#sortTray .chip3');
STEP.sSort=(s,n)=>{chipEls.forEach((c,i)=>{const r0=c.getBoundingClientRect();const want=i<n?$$('.bin .bc')[CHIPS[i][1]]:$('#sortTray');
    const moved=c.parentNode!==want;if(moved){if(i<n)want.appendChild(c);else{want.insertBefore(c,chipEls.slice(i+1).find(x=>x.parentNode===want)||null)}
      if(i===n-1&&r0.width){const r1=c.getBoundingClientRect();c.animate([{transform:`translate(${r0.left-r1.left}px,${r0.top-r1.top}px)`},{transform:'none'}],{duration:600,easing:'cubic-bezier(.3,1.2,.4,1)'})}}
    c.classList.toggle('placed',i<n)});
  $('#sortEnd').classList.toggle('in',n>=9);if(n){n>=9?SFX.chime():SFX.pop(2+n%4)}};

/* ---------- splitting the body ---------- */
const sA=$('#splitA'),sB=$('#splitB');drawPlan(sA,P.CAMPUS0,{fs:32});drawPlan(sB,P.CAMPUS1,{fs:32});
const SPLIT=[['1 · Theo lối vào','Map có Entrance','Đứng ở lối vào, đi <b>từ trái sang phải</b>. Body 1: bên trái (Offices, Classrooms, Garden). Body 2: bên phải (Library/Car park, Canteen, khu đông bắc).'],
 ['2 · Theo la bàn','Map chỉ có la bàn','Đi <b>từ Tây sang Đông</b>. Body 1: nửa phía tây. Body 2: nửa phía đông.'],
 ['3 · Theo năm','So sánh hai mốc rõ ràng','Body 1: <b>map năm 2000</b>. Body 2: <b>map hiện tại</b>.'],
 ['4 · Theo mức độ thay đổi','Nhiều khu đổi lớn, có khu giữ nguyên','Body 1: <b>thay đổi lớn</b>. Body 2: <b>thay đổi nhỏ hoặc giữ nguyên</b>.']];
$('#splitBtns').innerHTML=SPLIT.map((x,i)=>`<button data-split="${i}"><b>${x[0]}</b><span>${x[1]}</span></button>`).join('');
function halves(sv,l1,l2){const ov=ovOf(sv);E('rect',{x:0,y:0,width:500,height:620,class:'half h1'},ov);E('rect',{x:500,y:0,width:500,height:620,class:'half h2'},ov);E('line',{x1:500,y1:0,x2:500,y2:620,class:'divl'},ov);tag(sv,250,30,l1,'b');tag(sv,750,30,l2,'o')}
$('#splitBtns').addEventListener('click',e=>{const b=e.target.closest('[data-split]');if(!b)return;const i=+b.dataset.split;clearOv(sA,sB);$$('#splitBtns button').forEach(x=>x.classList.toggle('on',x===b));
  if(i===0)[sA,sB].forEach(sv=>{halves(sv,'Body 1 · bên trái','Body 2 · bên phải');const ov=ovOf(sv);const p=E('path',{d:'M500 570 L500 450 L200 450 M500 450 L800 450',class:'mroute'},ov);const L=p.getTotalLength();p.style.strokeDasharray=L;p.style.strokeDashoffset=L;p.getBoundingClientRect();p.style.transition='stroke-dashoffset 1.6s ease';p.style.strokeDashoffset=0});
  if(i===1)[sA,sB].forEach(sv=>{halves(sv,'Body 1 · West','Body 2 · East');E('circle',{cx:955,cy:575,r:44,class:'pulse'},ovOf(sv))});
  if(i===2){E('rect',{x:4,y:4,width:992,height:612,class:'whole h1'},ovOf(sA));tag(sA,500,40,'Body 1 · 2000','b');E('rect',{x:4,y:4,width:992,height:612,class:'whole h2'},ovOf(sB));tag(sB,500,40,'Body 2 · Now','o')}
  if(i===3)[sA,sB].forEach(sv=>{hl(sv,['ne','cls','garden','canteen','lib','it'],'o');hl(sv,['offices'],'b');tag(sv,500,40,'Cam: Body 1 · Xanh: Body 2','o')});
  $('#splitCap').innerHTML=SPLIT[i][2];SFX.whoosh()});

/* ---------- introduction ---------- */
STEP.sIntro=(s,n)=>{$('#iMine').classList.toggle('in',n>=1);[['1'],['2','2b'],['3']].forEach((ks,i)=>ks.forEach(k=>$$(`.sw[data-k="${k}"]`,s).forEach(x=>x.classList.toggle('c'+i,n>i))));
  $('#iFrames').classList.toggle('in',n>=4);if(n)n>=4?SFX.chime():SFX.whoosh()};

/* ---------- overview ---------- */
const fills=$$('#sOver .fill');fills.forEach(f=>f.dataset.o=f.textContent);
STEP.sOver=(s,n)=>{$('#ovS1').classList.toggle('in',n>=1);fills.forEach((f,i)=>{const on=(i===0&&n>=2)||(i>0&&n>=3);f.textContent=on?f.dataset.f:f.dataset.o;f.classList.toggle('on',on)});
  $('#ovS2').classList.toggle('in',n>=4);$('#ovS2').classList.toggle('picked',n>=5);$('.nos',s).classList.toggle('in',n>=6);
  if(n)n===6?SFX.chime():n===2||n===3?SFX.ding():SFX.pop(n)};

/* ---------- vocabulary ---------- */
const VOC=[[['was built / constructed','được xây dựng'],['was added','được thêm vào'],['was developed into','được phát triển thành'],['was demolished','bị phá bỏ'],['was removed','bị dỡ bỏ'],['was cleared','bị chặt / dọn sạch'],['was replaced by','được thay bằng'],['gave way to','nhường chỗ cho'],['was converted into','được chuyển đổi thành'],['was extended','được mở rộng'],['was widened','được nới rộng'],['was reduced in size','bị thu nhỏ'],['was relocated to','được dời tới'],['was shifted from … to …','được chuyển từ … sang …'],['remained the same','giữ nguyên'],['was retained','được giữ lại'],['was renovated','được cải tạo'],['underwent redevelopment','được tái phát triển']],
 [['in the north-west of','ở phía tây bắc của'],['to the east of','về phía đông của'],['in the centre of','ở trung tâm của'],['on the southern edge','ở rìa phía nam'],['next to / beside','bên cạnh'],['opposite','đối diện'],['between … and …','giữa … và …'],['adjacent to','liền kề với'],['near the entrance','gần lối vào'],['in the north-east corner','ở góc đông bắc'],['along the road','dọc theo con đường'],['surrounded by','được bao quanh bởi']],
 [['Additionally,','Thêm vào đó'],['A further change was …','Một thay đổi nữa là'],['Alongside this,','Song song với đó'],['Meanwhile,','Trong khi đó'],['By contrast,','Ngược lại'],['Turning to …','Chuyển sang …'],['As for …','Còn về …'],['In terms of …','Về mặt …'],['Overall,','Nhìn chung'],['✗ Also, / Then, / Another change is','Tránh lặp đi lặp lại']]];
function voc(i){$('#vocGrid').innerHTML=VOC[i].map(p=>`<button class="flip"><span class="in2"><span class="f">${p[0]}</span><span class="bk">${p[1]}</span></span></button>`).join('');$$('[data-voc]').forEach(b=>b.classList.toggle('on',+b.dataset.voc===i))}
voc(0);$$('[data-voc]').forEach(b=>b.onclick=()=>{voc(+b.dataset.voc);SFX.whoosh()});
$('#vocGrid').addEventListener('click',e=>{const f=e.target.closest('.flip');if(!f)return;f.classList.toggle('on');SFX.tick()});

/* ---------- 15 band-6 structures ---------- */
const S15=[['The construction of … marked a significant change in …','The construction of a basketball court marked a significant change in the southern area.'],
 ['… was converted into …','The sports facility was converted into administrative offices.'],['The … was relocated to …','The sports facility was relocated to the southwest of the university.'],
 ['The most noticeable change in the map of … is …','The most noticeable change in the map of Hanoi University is the removal of the sports facility.'],
 ['The old … was demolished to make way for …','The old canteen was demolished to make way for new administrative offices.'],['… underwent a substantial redevelopment.','The southern campus underwent a substantial redevelopment.'],
 ['The area of … was expanded to include …','The area of the sports facility was expanded to include administrative spaces.'],['There was an addition of … in …','There was an addition of a microwave in the kitchen area.'],
 ['The … was replaced by …','The sports facility was replaced by administrative offices.'],['The layout of … was significantly altered.','The layout of the southern campus was significantly altered.'],
 ['… was newly constructed / built.','A bathroom was newly constructed.'],['… has been transformed from … into …','The building has been transformed from a library into a cafe.'],
 ['… was developed into …','The house was developed into multi-storey apartments.'],['The … was renovated / overhauled.','The bathroom was renovated.'],['… was shifted from … to …','The round-shaped table was shifted from the top to the bottom.']];
$('#g15').innerHTML=S15.map((x,i)=>`<button class="c15"><b>${i+1}</b><span class="fm">${x[0]}</span><span class="eg">${x[1]}</span></button>`).join('');
$('#g15').addEventListener('click',e=>{const c=e.target.closest('.c15');if(!c)return;c.classList.toggle('on');SFX.tick()});

/* ---------- band 6 vs band 7 pairs ---------- */
const PAIRS=[['The library was removed. A car park was built.','The library, <rc>which had stood by the entrance</rc>, was removed, <vi>making way for a car park</vi>.','Mệnh đề quan hệ + V-ing'],
 ['The trees were cleared. A library was built.','The trees were cleared, <vi>with a library being built in their place</vi>.','with + V-ing'],
 ['The farmland became housing. The factory was demolished.','The farmland was converted into housing, <cp>while the factory to the south was demolished</cp>.','Câu ghép while'],
 ['The garden was replaced. The offices stayed the same.','<ct>Although the garden was replaced by sports facilities</ct>, the offices remained unchanged.','Câu tương phản'],
 ['The north changed the most.','<cl>It was the northern section that</cl> underwent the most dramatic change.','Câu nhấn mạnh (cleft)']];
$('#pairs').innerHTML=PAIRS.map((p,i)=>`<div class="pair"><div class="p6">${p[0].split('. ').map((x,j,a)=>`<span class="sent">${x}${j<a.length-1?'.':''}</span>`).join(' ')}</div><button class="up b7" data-up="${i}" aria-label="Nâng band">▸</button><div class="p7 b7"><p>${mk(p[1])}</p><span class="strtag">${p[2]}</span></div></div>`).join('');
$('#pairs').addEventListener('click',e=>{const b=e.target.closest('[data-up]');if(!b)return;const r=b.closest('.pair');r.classList.toggle('on');if(r.classList.contains('on'))SFX.chime();else SFX.tick()});
document.addEventListener('click',e=>{const b=e.target.closest('[data-act="pair-all"]');if(!b)return;const rs=$$('.pair'),on=!rs.every(r=>r.classList.contains('on'));rs.forEach((r,i)=>setTimeout(()=>{r.classList.toggle('on',on);if(on)SFX.pop(2+i)},i*260))});

/* ---------- each change on the map ---------- */
const omA=$('#omA'),omB=$('#omB');drawPlan(omA,P.CAMPUS0,{fs:32});drawPlan(omB,P.CAMPUS1,{fs:32});
const OM=[['Library → Car park',['lib'],'The library was demolished. A car park was built.','The library, <rc>which had stood next to the entrance</rc>, was demolished, <vi>making way for a car park</vi>.','Mệnh đề quan hệ + V-ing'],
 ['Cây → Library, IT centre',['ne','it','ne2'],'The trees were cut down. A library and an IT centre were built.','Most of the trees in the north-east were cleared, <vi>with a new library and an IT centre being built in their place</vi>.','with + V-ing'],
 ['Library dời đi',['lib','ne'],'The library was moved to the north-east.','<vi>Having stood by the entrance in 2000</vi>, the library was relocated to the north-eastern corner.','Having + V3'],
 ['Classrooms mở rộng',['cls'],'The classrooms were extended. They are bigger now.','The classrooms in the north-west were extended southwards, <vi>almost doubling in size</vi>.','V-ing kết quả'],
 ['Garden → Sports',['garden'],'The garden was replaced by sports facilities.','<cl>Gone is the garden that had once occupied the north of the campus; in its place stand</cl> new sports facilities.','Câu đảo Gone is …'],
 ['Canteen · Offices',['canteen','offices'],'The canteen was converted into administrative offices. The offices stayed the same.','<ct>In contrast to the offices in the south-west, which remained unchanged</ct>, the canteen was converted into administrative offices.','In contrast to …']];
$('#omBtns').innerHTML=OM.map((o,i)=>`<button data-om="${i}">${o[0]}</button>`).join('');
$('#omBtns').addEventListener('click',e=>{const b=e.target.closest('[data-om]');if(!b)return;const o=OM[+b.dataset.om];$$('#omBtns button').forEach(x=>x.classList.toggle('on',x===b));
  clearOv(omA,omB);hl(omA,o[1],'o');hl(omB,o[1],'o');
  const p6=$('#om6'),p7=$('#om7');p6.innerHTML=o[2];p7.innerHTML=mk(o[3]);$('#omStr').textContent=o[4];
  [p6.parentNode,p7.parentNode].forEach((c,i)=>c.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{duration:450,delay:i*350,fill:'both',easing:'ease-out'}));
  SFX.whoosh();setTimeout(()=>{if(!document.body.classList.contains('hide7'))SFX.ding()},400)});

/* ---------- band 7 groups ---------- */
const B7=[['rc','Mệnh đề quan hệ',[['[X], which had previously been [Y], was [change] by [year].','The northern field, <rc>which had previously been used for agriculture</rc>, was converted into a housing estate by the present day.'],
   ['[location], whose [feature], was [change] to accommodate [Y].','The main road, <rc>whose narrow width had limited traffic flow</rc>, was widened to accommodate more vehicles.'],
   ['[X] was [change], as were [Y].','The warehouse on the eastern side was replaced by housing, <rc>as were the two smaller buildings nearby</rc>.']]],
 ['vi','Cụm V-ing',[['Having been [change], [X] was [further development] by [year].','<vi>Having been largely undeveloped in 1985</vi>, the western area was transformed into a dense residential zone.'],
   ['Situated [location], [X] was [change], with [Y] being [change].','<vi>Situated to the south of the town centre</vi>, the industrial zone was significantly expanded, <vi>with two new factory units being added</vi>.'],
   ['[X] was [change], replacing the [feature] that had occupied the site.','A multi-storey car park was built, <vi>replacing the open wasteland that had previously stood to the east</vi>.']]],
 ['cp','Câu ghép',[['Not only was [X] [change 1], but [Y] was also [change 2], resulting in [effect].','<cp>Not only was</cp> the forest to the west cleared, <cp>but</cp> the riverbank <cp>was also</cp> developed, <vi>resulting in the near-total loss of green space</vi>.'],
   ['[X] was [change 1]; [Y], by contrast, [change 2].','The northern section was heavily developed; the southern area, <cp>by contrast</cp>, saw minimal change.'],
   ['While [X] was [change 1], [Y] underwent [change 2], suggesting [pattern].','<cp>While</cp> the eastern farmland was converted into housing, the town centre underwent commercial expansion, <vi>suggesting a planned pattern of urban growth</vi>.']]],
 ['ct','Tương phản',[['Although [X] remained unchanged, the surrounding area [change].','<ct>Although the church in the town square remained unchanged</ct>, the surrounding area was comprehensively redeveloped.'],
   ['Despite [noun phrase], [X] was [change], indicating [interpretation].','<ct>Despite its central location</ct>, the original market building was demolished, <vi>indicating a shift in economic priorities</vi>.'],
   ['In contrast to [X], which [remained], [Y] was [changed].','<ct>In contrast to the southern streets, which remained intact</ct>, the northern farmland was entirely replaced by a commercial estate.']]],
 ['cl','Câu đảo / nhấn mạnh',[['It was [X] that underwent the most dramatic change.','<cl>It was the northern section of the town that</cl> underwent the most dramatic change.'],
   ['Only by [time] was [X] [change].','<cl>Only by the present day was</cl> the full extent of the redevelopment apparent.'],
   ['Gone were [X]; in their place stood [Y].','<cl>Gone were</cl> the open fields that had once defined the landscape; <cl>in their place stood</cl> a sprawling industrial estate.']]]];
$('#b7Tabs').innerHTML=B7.map((g,i)=>`<button data-b7="${i}" class="hs ${g[0]}">${i+1} · ${g[1]}</button>`).join('');
function b7(i){$$('#b7Tabs button').forEach((b,j)=>b.classList.toggle('on',j===i));
  $('#b7List').innerHTML=B7[i][2].map((x,j)=>`<div class="b7row" style="animation-delay:${j*.15}s"><div class="fm">${esc(x[0])}</div><button class="b sm" data-eg>Ví dụ</button><div class="eg">${mk(x[1])}</div></div>`).join('');SFX.whoosh()}
$('#b7Tabs').addEventListener('click',e=>{const b=e.target.closest('[data-b7]');if(b)b7(+b.dataset.b7)});
$('#b7List').addEventListener('click',e=>{const b=e.target.closest('[data-eg]');if(!b)return;b.parentNode.classList.toggle('on');SFX.ding()});
b7(0);SFX.stop&&SFX.stop();

/* ---------- applying: one paragraph ---------- */
const AP6=[['The library by the entrance was demolished.','Thay thế → mệnh đề quan hệ'],['A car park was built there.','Xuất hiện → V-ing'],['The trees in the north-east were cleared.','Kéo theo nhau → with + V-ing'],['A new library and an IT centre were built.',''],['The offices did not change.','Không đổi → giữ một câu đơn'],['The north-east changed the most.','Lớn nhất → It was … that']];
$('#ap6').innerHTML=AP6.map(x=>`<span class="ap6line"><span class="s6">${x[0]}</span>${x[1]?` <span class="sug">${x[1]}</span>`:''}</span>`).join('');
$('#ap7').innerHTML=mk('<cl>It was the north-eastern corner that</cl> underwent the most dramatic change: most of the trees there were cleared, <vi>with a new library and an IT centre being built in their place</vi>. Near the entrance, the old library, <rc>which had stood beside the main path</rc>, was demolished to make way for a car park. <span class="simple">The offices in the south-west remained unchanged.</span>')+'<span class="count"><span class="hs cl">Nhấn mạnh ×1</span><span class="hs vi">V-ing ×1</span><span class="hs rc">Mệnh đề quan hệ ×1</span><span class="simple">Câu đơn ×1</span></span>';
STEP.sApply=(s,n)=>{$$('#apSteps li').forEach((li,i)=>{li.classList.toggle('done',i<n-1);li.classList.toggle('cur',i===n-1)});
  s.classList.toggle('u',n>=1);s.classList.toggle('sg',n>=2);$('.a7',s).classList.toggle('in',n>=3);s.classList.toggle('chk',n>=4);
  if(n)n===3?SFX.chime():n===4?SFX.ding():SFX.pop(n+1)};

/* ---------- activity ---------- */
const ACT=[['The northern field was used for agriculture. It was converted into a housing estate.','The northern field, <rc>which had previously been used for agriculture</rc>, was converted into a housing estate.'],
 ['A multi-storey car park was built. It replaced the open wasteland to the east.','A multi-storey car park was built, <vi>replacing the open wasteland that had previously stood to the east</vi>.'],
 ['The forest to the west was cleared. The riverbank was developed.','<cp>Not only was</cp> the forest to the west cleared, <cp>but</cp> the riverbank <cp>was also</cp> developed.'],
 ['The church remained unchanged. The area around it was redeveloped.','<ct>Although the church remained unchanged</ct>, the surrounding area was comprehensively redeveloped.'],
 ['The market building was in the centre. It was demolished.','<ct>Despite its central location</ct>, the original market building was demolished.'],
 ['The open fields disappeared. An industrial estate was built there.','<cl>Gone were</cl> the open fields; <cl>in their place stood</cl> a sprawling industrial estate.']];
$('#acts').innerHTML=ACT.map((a,i)=>`<div class="act"><b class="n">${i+1}</b><div class="a6">${a[0]}</div><button class="b sm b7" data-ans>Đáp án</button><div class="a7 b7">${mk(a[1])}</div></div>`).join('');
$('#acts').addEventListener('click',e=>{const b=e.target.closest('[data-ans]');if(!b)return;const r=b.closest('.act');r.classList.toggle('on');b.classList.toggle('on');if(r.classList.contains('on'))SFX.chime()});

/* ---------- errors by criterion ---------- */
const ERR={TA:[['Overview liệt kê chi tiết','The library was removed, the car park was built and the trees were cleared.','Overall, the university underwent some significant changes, the most important of which were the expansion of classrooms and the loss of trees.'],
  ['Chỉ mô tả một mốc thời gian','Chỉ mô tả hiện trạng rồi dừng.','Thêm so sánh: Unlike the 2000 layout, the current map shows …'],
  ['Bỏ sót khu vực thay đổi','Quên nhắc đến khu cây ở đông bắc.','Đánh dấu mỗi khu có thay đổi trước khi viết; mỗi dấu phải có trong bài.'],
  ['Sai thì','The building was built by 2015 (mốc là hiện tại).','The building has been built by the present day.']],
 CC:[['Liên từ lặp lại','Also, … Then, … Another change is …','Additionally, … / A further change was … / Alongside this, …'],
  ['Trật tự nhảy cóc','Body 1: phía bắc → trung tâm → quay lại phía đông.','Chọn một cách chia thân bài và đi theo đến hết.'],
  ['Đại từ mơ hồ','It was then transformed and it became bigger.','The library was then transformed, and the new lecture hall was larger.'],
  ['Thân bài không khớp Overview','Overview nói “major changes”, thân bài chỉ tả một khu nhỏ.','Thân bài triển khai đúng các thay đổi đã nêu trong Overview.']],
 LR:[['Lặp động từ “was built”','A library was built. A car park was built. An IT centre was built.','A library was constructed, a car park was erected and an IT centre was established.'],
  ['Lạm dụng “big change”','There was a big change in the north.','There was a substantial transformation in the north.'],
  ['Dùng sai loại động từ','The trees were disappeared.','The trees disappeared. / The trees were cleared.'],
  ['Từ chung chung','The area became better.','The area was modernised, which improved the standard of living.']],
 GRA:[['Chỉ dùng câu đơn','The car park was built. The trees were cleared. The library was removed.','The trees to the northeast were cleared, which made room for a library and an IT centre.'],
  ['Sai dạng bị động','was build / was complete','was built / was completed'],
  ['Thiếu mạo từ','The entrance is in north.','The entrance is in the north.'],
  ['Chưa dùng cấu trúc Band 7','Chỉ lặp “was + V3”.','Thêm một mệnh đề quan hệ, một cụm V-ing và một câu ghép.']]};
const ENAME={TA:'Task Achievement',CC:'Coherence & Cohesion',LR:'Lexical Resource',GRA:'Grammar'};
$('#errTabs').innerHTML=Object.keys(ERR).map((k,i)=>`<button class="b sm${i?'':' on'}" data-err="${k}">${k} · ${ENAME[k]}</button>`).join('');
function errs(k){$$('#errTabs button').forEach(b=>b.classList.toggle('on',b.dataset.err===k));
  $('#errs').innerHTML=ERR[k].map((e,i)=>`<button class="ecard" style="animation-delay:${i*.1}s"><b>${e[0]}</b><span class="bad">${e[1]}</span><span class="good">${e[2]}</span></button>`).join('');SFX.whoosh()}
$('#errTabs').addEventListener('click',e=>{const b=e.target.closest('[data-err]');if(b)errs(b.dataset.err)});
$('#errs').addEventListener('click',e=>{const c=e.target.closest('.ecard');if(!c)return;c.classList.toggle('on');c.classList.contains('on')?SFX.ding():SFX.tick()});
errs('TA');SFX.stop&&SFX.stop();

/* ---------- error hunt ---------- */
const HUNT=[['TA','Overview liệt kê chi tiết','Overall, the campus underwent some significant changes, the most important of which were the expansion of the classrooms and the loss of trees.'],
 ['CC','“Then, it”: liên từ đơn điệu + đại từ mơ hồ','This library was later demolished …'],['GRA','Sai dạng bị động','was built'],
 ['LR · CC','“Also” lặp + “became better” chung chung','Additionally, the canteen was converted into administrative offices.'],['LR','“big change”','There was a substantial transformation in the north.'],
 ['LR · GRA','disappear là nội động từ','The trees disappeared. / The trees were cleared.'],['LR','Lặp “was built”','a library was constructed and an IT centre was established.'],
 ['GRA','Chia động từ + thiếu mạo từ','The classrooms are in the north …'],['TA','Bỏ sót khu: Garden → Sports facilities','The garden gave way to sports facilities.']];
const HE=['The maps show the university in 2000 and now.','Overall, [[0|the library was removed, the car park was built and the trees were cleared]].',
 'In 2000, there was a library near the entrance. [[1|Then, it]] was removed and a car park [[2|was build]]. [[3|Also, the canteen became better.]] [[4|There was a big change]] in the north. The trees [[5|were disappeared]] and [[6|a library was built. An IT centre was built.]]',
 '[[7|The classrooms is in north]] and it became bigger. [[8|…]]'];
$('#huntEssay').innerHTML=HE.map(p=>'<p>'+p.replace(/\[\[(\d)\|([^\]]*)\]\]/g,(m,i,t)=>`<span class="err" data-h="${i}">${t}<sup>${+i+1}</sup></span>`)+'</p>').join('');
const huA=$('#huA'),huB=$('#huB');drawPlan(huA,P.CAMPUS0,{fs:34});drawPlan(huB,P.CAMPUS1,{fs:34});
function huntShow(i){const h=HUNT[i];$('#huntFix').innerHTML=`<span class="crit">${h[0]}</span><b>${h[1]}</b><span class="good">${h[2]}</span>`;$$('.err').forEach(x=>x.classList.toggle('sel',+x.dataset.h===i));
  clearOv(huA,huB);if(i===8){hl(huA,['garden'],'r');hl(huB,['garden'],'r')}}
STEP.sHunt=(s,n)=>{$$('.err',s).forEach(x=>x.classList.toggle('on',+x.dataset.h<n));if(n){huntShow(n-1);SFX.buzz?SFX.buzz():SFX.thud()}
  else{$('#huntFix').innerHTML='<b>Mỗi nhóm tìm lỗi</b>, ghi tiêu chí (TA, CC, LR, GRA) và cách sửa.';$$('.err').forEach(x=>x.classList.remove('sel'));clearOv(huA,huB)}};
$('#huntEssay').addEventListener('click',e=>{const x=e.target.closest('.err.on');if(x){huntShow(+x.dataset.h);SFX.tick()}});

/* ---------- checklist ---------- */
const CK=['Overview có hai câu, không có số liệu chi tiết.','Mọi khu vực có thay đổi đều được nhắc đúng một lần.','Thì khớp với mốc thời gian.','Không lặp cùng một động từ quá 3 lần.','Có ít nhất hai cấu trúc Band 7, mỗi loại một lần.'];
$('#checks').innerHTML=CK.map((c,i)=>`<button class="ck${i===4?' b7':''}"><i></i><span>${c}</span></button>`).join('');
$('#checks').addEventListener('click',e=>{const c=e.target.closest('.ck');if(!c)return;c.classList.toggle('on');if(!c.classList.contains('on'))return SFX.tick();
  const all=$$('.ck').filter(x=>x.offsetParent);all.every(x=>x.classList.contains('on'))?SFX.cheer():SFX.ding()});
document.addEventListener('click',e=>{if(e.target.closest('[data-act="ck-reset"]'))$$('.ck').forEach(c=>c.classList.remove('on'))});

/* ---------- practice: outlines ---------- */
const OUT={NELSON:{maps:['NELSON0','NELSON1'],steps:[
  ['Đặc điểm đề','Không có Entrance, có la bàn → chia thân bài <b>theo la bàn, Tây → Đông</b>. Hai mốc: 2000 → hiện tại.',{split:1}],
  ['Introduction','The maps illustrate how Nelson City changed between 2000 and the present day.',{}],
  ['Overview','Lớn nhất: đường chính thành <b>khu đi bộ</b> và <b>ga tàu mới</b>. Ý nghĩa: trung tâm hiện đại, dễ tiếp cận hơn.',{ids:['road','stn']}],
  ['Body 1 · Tây và Bắc','Ga cũ bị bỏ, ga mới ở trung tâm cạnh đại học; ký túc xá mới ở Tây Bắc; chợ cũ → cửa hàng.',{ids:['stn','hall','mkt','rail']}],
  ['Body 2 · Đông và Nam','Chợ có mái che mới; cây bị chặt → trung tâm thương mại; đường phía nam → khu đi bộ, thêm xe đạp thuê; cảng giữ nguyên, thêm nhà hàng, quán bar.',{ids:['cov','trees','road','bike','port','rest','bar']}]],
  b7:'Mệnh đề quan hệ · V-ing · while · although'},
 CC:{maps:['CC0','CC1'],steps:[
  ['Đặc điểm đề','Có Entrance → chia thân bài <b>theo lối vào, từ trái sang phải</b>. Hai mốc: 10 năm trước → hiện tại.',{entr:1}],
  ['Introduction','The maps illustrate how the community centre changed between ten years ago and the present day.',{}],
  ['Overview','Lớn nhất: vườn → <b>khu thể thao trong nhà</b>, <b>khu café mở rộng</b>. Ý nghĩa: chuyển sang giải trí trong nhà và giao lưu.',{ids:['garden','cafe','off1','off2','off3','off4','sto2']}],
  ['Body 1 · phía Tây','Vườn → khu thể thao trong nhà; bãi đỗ xe, hội trường, lối vào và lễ tân giữ nguyên.',{ids:['garden','car','hall','rec']}],
  ['Body 2 · Bắc, Đông, Đông Nam','Kho nhỏ lại, thêm toilet; 4 văn phòng + kho → café rộng; bếp giữ nguyên; quầy cà phê + toilet → văn phòng.',{ids:['sto','wcn','cafe','off1','off2','off3','off4','sto2','kit','cof','wc','off']}]],
  b7:'Mệnh đề quan hệ · V-ing · while · It was … that · gave way to'}};
$$('[data-maps]').forEach(s=>{const o=OUT[s.dataset.maps];const sv=$$('svg.plan',s);sv.forEach((v,i)=>drawPlan(v,P[o.maps[i]],{fs:36}));
  $('.outl',s).innerHTML=o.steps.map(x=>`<div class="ol"><b>${x[0]}</b><span>${x[1]}</span></div>`).join('')+`<div class="ol b7 b7use"><b>Band 7 dùng</b><span>${o.b7}</span></div>`;
  STEP[s.id]=(s2,n)=>{$$('.ol',s).forEach((d,i)=>{d.classList.toggle('in',i<n||(i===o.steps.length&&n>=o.steps.length));d.classList.toggle('cur',i===n-1)});clearOv(...sv);
    const x=o.steps[n-1];if(x){const f=x[2];if(f.ids)sv.forEach(v=>hl(v,f.ids,n===5?'o':n===4?'b':'r'));
      if(f.split)sv.forEach(v=>halves(v,'Body 1 · West','Body 2 · East'));
      if(f.entr)sv.forEach(v=>{const ov=ovOf(v);E('circle',{cx:335,cy:580,r:50,class:'pulse'},ov);const p=E('path',{d:'M335 560 L335 470 L100 470 M335 470 L900 470',class:'mroute'},ov);const L=p.getTotalLength();p.style.strokeDasharray=L;p.style.strokeDashoffset=L;p.getBoundingClientRect();p.style.transition='stroke-dashoffset 1.6s ease';p.style.strokeDashoffset=0})}
    if(n)SFX.pop(n+1)}});

/* ---------- practice: model essays ---------- */
const ESS={NELSON:{intro:'The maps illustrate how Nelson City changed between 2000 and the present day.',
 ov:'Overall, the city underwent some significant changes, the most important of which were the conversion of the main road into a pedestrian-only zone and the relocation of the train station. These changes have transformed the centre into a more modern and accessible place for residents and visitors.',
 b7:['On the western side, the train station, <rc>which had stood on the edge of the city</rc>, was removed and replaced by a new station in the centre, next to the university. A hall of residence was built in the north-west, <cp>while</cp> the old market, <rc>which had occupied the south-west</rc>, was replaced by a new shop.',
  'On the eastern side, a new covered market was built, and the trees beside the university were cleared, <vi>making way for a large shopping centre</vi>. The road along the southern edge, <rc>which had previously carried traffic</rc>, was converted into a pedestrian-only zone, <cp>while</cp> the city centre was equipped with a bike rental scheme. <ct>Although the port remained unchanged</ct>, restaurants and a bar and club area were added nearby.'],
 b6:['On the western side, the train station was removed. A new station was built in the centre. It is next to the university. A hall of residence was built in the north-west. The old market was replaced by a new shop.',
  'On the eastern side, a new covered market was built. The trees beside the university were cleared. A large shopping centre was built there. The road along the southern edge was converted into a pedestrian-only zone. A bike rental scheme was added in the city centre. The port remained unchanged. Restaurants and a bar and club area were added nearby.']},
 CC:{intro:'The maps illustrate how the community centre changed between ten years ago and the present day.',
 ov:'Overall, the centre underwent some significant changes, the most important of which were the replacement of the garden with indoor sports facilities and the expansion of the cafe area. These changes have shifted the centre towards indoor recreation and social activities.',
 b7:['On the western side, the garden, <rc>which had provided outdoor green space</rc>, was replaced by indoor sports facilities, <cp>while</cp> the car park was retained. The hall, <rc>which seats 100 people</rc>, remained unchanged, and the entrance and reception area stayed in the same position.',
  'In the north, the storage room was reduced in size, <vi>with toilets being added beside it</vi>. <cl>It was the eastern side that</cl> changed most, as the four offices and the storage room gave way to a large cafe area, <cp>while</cp> the kitchen remained in place. In the south-east, the coffee bar and toilets were replaced by an office.'],
 b6:['On the western side, the garden was replaced by indoor sports facilities. The car park remained the same. The hall remained unchanged. It seats 100 people. The entrance and reception area stayed in the same position.',
  'In the north, the storage room was reduced in size. Toilets were added beside it. The four offices and the storage room were removed. A large cafe area was built. The kitchen remained in place. In the south-east, the coffee bar and toilets were replaced by an office.']}};
const words=h=>h.replace(/<[^>]+>/g,'').split(/\s+/).filter(Boolean).length;
function essayVer(s,v){const d=ESS[s.dataset.essay];const body=v===7?d.b7:d.b6;const all=[d.intro,d.ov,...body];
  $('.model',s).innerHTML=all.map((p,i)=>`<p class="${i>1?'body':''}">${i>1?mk(p):p}</p>`).join('')+`<span class="wc">${all.reduce((a,p)=>a+words(p),0)} từ</span>`;
  $$('[data-ev]',s).forEach(b=>b.classList.toggle('on',+b.dataset.ev===v));s.dataset.v=v;
  $$('.model .body',s).forEach((p,i)=>p.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:400,delay:i*150,fill:'both'}))}
$$('.essayslide').forEach(s=>{essayVer(s,7);$('.legend7',s).innerHTML=Object.entries(ST).map(([k,v])=>`<span class="hs ${k}">${v}</span>`).join('')+'<p class="sub">Bấm “Thân bài Band 6” để so sánh cùng nội dung viết bằng câu đơn.</p>';
  s.addEventListener('click',e=>{const b=e.target.closest('[data-ev]');if(b){essayVer(s,+b.dataset.ev);SFX.whoosh();return}
    if(e.target.closest('[data-act="hl"]')){s.classList.toggle('hlon');e.target.closest('button').classList.toggle('on');SFX.ding()}})});

/* ---------- self-study ---------- */
STEP.sSelf=(s,n)=>{$$('#self4>div').forEach((d,i)=>d.classList.toggle('in',i<n));if(n)SFX.pop(n+1)};

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

/* ---------- misc ---------- */
document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;
  switch(b.dataset.act){case 'step':next();break;
    case 'flip-all':{const all=$$('.flip',b.closest('.slide')),on=!all.every(f=>f.classList.contains('on'));all.forEach((f,i)=>setTimeout(()=>f.classList.toggle('on',on),i*35));SFX.whoosh();break}
    case 's15-all':{const all=$$('.c15'),on=!all.every(c=>c.classList.contains('on'));all.forEach((c,i)=>setTimeout(()=>c.classList.toggle('on',on),i*40));SFX.whoosh();break}}});

Object.keys(STEP).forEach(id=>{const s=$('#'+id);if(s)STEP[id](s,0)});
SFX.stop();
const m=/^#s(\d+)$/.exec(location.hash);show(m?+m[1]-1:0);
})();
