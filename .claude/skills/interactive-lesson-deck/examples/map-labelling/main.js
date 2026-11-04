(function(){
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const slides=$$('.slide');const TM=window.TownMap,MD=window.MAPDATA,E=TM.el;
let cur=0;

/* ---------- simple 3x3 maps (left/right + exit ticket) ---------- */
const MAPS={m1:{cells:['Bank','Supermarket','Chemist','Post office','Crossroads','Restaurant','Library','Car park','Petrol station']}};
const LET=['A','B','C','D','X','E','F','G','H'];
function renderGrid(el,key){const hide=(el.dataset.hide||'').split(',');
  el.innerHTML=MAPS[key].cells.map((n,i)=>{const L=LET[i];return `<div class="cell${L==='X'?' x':''}${hide.includes(L)?' hid':''}" data-i="${i}" data-l="${L}"><span class="lt">${L==='X'?'+':L}</span><span class="nm2">${n}</span></div>`}).join('')}
$$('.map[data-map]').forEach(m=>renderGrid(m,m.dataset.map));
const cellOf=(map,L)=>$(`.cell[data-l="${L}"]`,map);
const rc=i=>[Math.floor(i/3),i%3], idx=(r,c)=>(r<0||r>2||c<0||c>2)?-1:r*3+c;
const DIR={N:[[-1,0],[0,1]],E:[[0,1],[1,0]],S:[[1,0],[0,-1]],W:[[0,-1],[-1,0]]};
function around(pos,face){const [r,c]=rc(pos),[a,rt]=DIR[face];return {ahead:idx(r+a[0],c+a[1]),right:idx(r+rt[0],c+rt[1]),behind:idx(r-a[0],c-a[1]),left:idx(r-rt[0],c-rt[1])}}

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

/* ---------- hook ---------- */
STEP.sHook=(s,n)=>{$$('.hk',s).forEach((h,i)=>h.classList.toggle('in',i<n));$('.bigq',s).classList.toggle('in',n>=6);if(n)n>=6?SFX.chime():SFX.pop(n)};

/* ---------- helpers on town maps ---------- */
const ctr=b=>({x:b.x+b.w/2,y:b.y+b.h/2});
const byName=(cfg,n)=>cfg.buildings.find(b=>b.name===n);
function tag(ov,x,y,txt,cls){const g=E('g',{class:'tagg '+(cls||'')},ov);E('rect',{x:x-17,y:y-15,width:34,height:30,rx:7},g);const t=E('text',{x,y:y+7,'text-anchor':'middle'},g);t.textContent=txt;return g}
function pin(ov,x,y,label){const g=E('g',{class:'pin2'},ov);g.style.transform=`translate(${x}px,${y}px)`;
  E('path',{d:'M0 0 C -14 -18 -16 -30 0 -40 C 16 -30 14 -18 0 0Z',fill:'#C25E0C',stroke:'#fff','stroke-width':3},g);E('circle',{cx:0,cy:-26,r:6,fill:'#fff'},g);
  if(label){const w=label.length*8.6+20;E('rect',{x:-w/2,y:-74,width:w,height:26,rx:7,fill:'#C25E0C'},g);const t=E('text',{x:0,y:-56,'text-anchor':'middle',fill:'#fff','font-size':15,'font-weight':800},g);t.textContent=label}return g}
function drawPath(ov,pts,cls){const d=pts.map((p,i)=>(i?'L':'M')+p[0]+' '+p[1]).join(' ');const p=E('path',{d,class:'route '+(cls||'')},ov);const L=p.getTotalLength();p.style.strokeDasharray=L;p.style.strokeDashoffset=L;
  p.getBoundingClientRect();p.style.transition=`stroke-dashoffset ${Math.min(2.6,.4+L/600)}s ease-in-out`;p.style.strokeDashoffset=0;return {p,L,dur:Math.min(2.6,.4+L/600)}}

/* ---------- 6 steps on the town map ---------- */
const T1=JSON.parse(JSON.stringify(MD.TOWN));T1.id='t1';T1.buildings.forEach(b=>{if(['Café','Library','Bookshop'].includes(b.name))b.hide=true});
const stepOv=TM.draw($('#stepMap'),T1,{letters:true});
const START={x:500,y:620,h:'N'};
const NOTE=['','Đề hỏi Library, Café, Bookshop → điền chữ cái A–E.','G: toà nhà có tên. D: chỉ có chữ cái, phải tìm.','Bắt đầu ở cuối Church Street, quay mặt về phía bắc.','Trước mặt là Park Road. Rẽ trái là đi về phía tây.','“Go up Church Street to Park Road and turn left. The bookshop is on your left.”','Đối chiếu: đúng chữ cái, đúng số câu.'];
STEP.sSteps=(s,n)=>{$$('#stepper li').forEach((li,i)=>{li.classList.toggle('done',i<n-1);li.classList.toggle('cur',i===n-1)});
  $('#stepNote').textContent=NOTE[n]||'';$('#stepNote').classList.toggle('in',n>0);stepOv.innerHTML='';
  $('#stepQ').classList.toggle('pulse',n===1);
  const sl=$$('#stepQ .slot');sl.forEach(x=>{x.classList.remove('on');x.textContent='?'});
  if(n>=2)T1.buildings.forEach(b=>{if(!b.letter)return;const c=ctr(b);tag(stepOv,b.x+b.w-14,b.y+14,b.hide?'D':'G',b.hide?'d':'g')});
  if(n>=3)pin(stepOv,START.x,START.y-8,'You are here');
  if(n===4){[['Trước','N',0,-120],['Trái','W',-150,-30],['Phải','E',150,-30]].forEach(([t,,dx,dy])=>{E('line',{x1:START.x,y1:START.y-30,x2:START.x+dx*.8,y2:START.y-30+dy*.8,class:'arrowln'},stepOv);
    const w=t.length*12+20;E('rect',{x:START.x+dx-w/2,y:START.y-30+dy-16,width:w,height:30,rx:8,fill:'#16213A'},stepOv);const tx=E('text',{x:START.x+dx,y:START.y-30+dy+6,'text-anchor':'middle',fill:'#fff','font-size':16,'font-weight':800},stepOv);tx.textContent=t})}
  if(n>=5){const r=TM.walk(T1,START,'Go straight on to the crossroads. Turn left. The bookshop is on your left.');const d=drawPath(stepOv,r.path);
    setTimeout(()=>{sl[2].classList.add('on');sl[2].textContent='E';SFX.ding()},d.dur*1000)}
  if(n>=6){sl.forEach(x=>{x.classList.add('on');x.textContent=x.dataset.v});T1.buildings.filter(b=>b.hide).forEach(b=>{const r=E('rect',{x:b.x-4,y:b.y-4,width:b.w+8,height:b.h+8,rx:9,class:'okbox'},stepOv)})}
  if(n&&n<5)SFX.thud();if(n===5)SFX.whoosh();if(n===6)SFX.chime()};

/* ---------- 3D point of view ---------- */
const POVC=['Bank','Supermarket','Chemist','Post office','','Restaurant','Library','Car park','Petrol station'];
const ROOF2=['#4F7CAC','#2A9D8F','#C8553D','#E0A458','','#8E6CC8','#5C80BC','#7D8597','#D4A373'];
const plane=$('#plane');
plane.innerHTML=POVC.map((n,i)=>i===4?`<div class="c3 x"><div class="road h"></div><div class="me3"><div class="arrow3"></div><div class="who">BẠN</div></div></div>`
  :`<div class="c3" data-i="${i}"><div class="blk" style="--c:${ROOF2[i]}"><i class="f t"></i><i class="f s1"></i><i class="f s2"></i><i class="f s3"></i><i class="f s4"></i></div><div class="lab3"><b>${LET[i]}</b>${n}</div><div class="rel3"></div></div>`).join('')+'<div class="npole"><span>N</span></div>';
let face0='N',rz=0;const ORD=['N','E','S','W'],VN={N:'Bắc',E:'Đông',S:'Nam',W:'Tây'};
function face(f,turnDir){const old=ORD.indexOf(face0),nw=ORD.indexOf(f);let d=nw-old;if(d>2)d-=4;if(d<-2)d+=4;if(turnDir==='right')d=1;if(turnDir==='left')d=-1;
  rz-=d*90;face0=f;plane.style.setProperty('--rz',rz+'deg');
  $$('[data-face]').forEach(b=>b.classList.toggle('on',b.dataset.face===f));$('#facing').innerHTML=`Đang nhìn về <b>phía ${VN[f]}</b>`;
  const A=around(4,f),lab={ahead:'Trước mặt',right:'Bên phải',behind:'Sau lưng',left:'Bên trái'},cls={ahead:'ra',right:'rr',behind:'rb',left:'rl'};
  $$('.c3[data-i]',plane).forEach(c=>{c.className='c3';$('.rel3',c).textContent=''});
  Object.entries(A).forEach(([k,i])=>{const c=$(`.c3[data-i="${i}"]`,plane);c.classList.add(cls[k]);$('.rel3',c).textContent=lab[k]});
  $('#faceList').innerHTML=Object.entries(A).map(([k,i],j)=>`<span class="k ${cls[k]}">${lab[k]}</span><span class="v" style="animation-delay:${j*.12}s">${POVC[i]} <b>(${LET[i]})</b></span>`).join('');
  SFX.whoosh()}
$$('[data-face]').forEach(b=>b.onclick=()=>face(b.dataset.face));
$$('[data-turn]').forEach(b=>b.onclick=()=>{const i=ORD.indexOf(face0);face(ORD[(i+(b.dataset.turn==='right'?1:3))%4],b.dataset.turn)});
face('N');

/* ---------- IN / ON / AT ---------- */
const T3=JSON.parse(JSON.stringify(MD.TOWN));T3.id='t3';const prepSvg=$('#prepMap');const prepOv=TM.draw(prepSvg,T3,{});
const PG=[
 ['IN','Ở trong / bên trong một khu vực',[
  ['in + khu vực, toà nhà','ở trong','The pond is <b>in</b> the park.',{area:[200,208,270,206]},[367,321]],
  ['in + phương hướng','ở phía (của cả vùng)','The cinema is <b>in the north-east</b> of the town.',{area:[500,0,500,310]},[922,90]],
  ['in the corner of','ở góc (bên trong)','There’s a bench <b>in the corner of</b> the park.',{area:[420,364,50,50]},[445,389]],
  ['in the middle / centre of','ở giữa','The path runs <b>in the middle of</b> the park.',{area:[290,270,90,80]},[335,311]]]],
 ['ON','Ở trên đường / ở rìa, phía',[
  ['on + tên đường','nằm trên đường','The museum is <b>on</b> High Street.',{edge:[0,180,1000,180]},[595,90]],
  ['on the … side / edge','ở rìa, phía','The school is <b>on the west side of</b> the park.',{edge:[200,208,200,414]},[81,375]],
  ['on the corner (of)','ở góc phố (giáp 2 đường)','The bank is <b>on the corner of</b> High Street and Mill Lane.',{point:[170,180]},[261,95]],
  ['on your left / right','bên tay trái / phải','Walk east along Park Road: the bakery is <b>on your left</b>.',{edge:[170,440,830,440],arrow:true},[595,376]]]],
 ['AT','Tại một điểm cụ thể',[
  ['at + một điểm','tại (một điểm)','Meet me <b>at</b> the station entrance.',{point:[922,465]},[922,530]],
  ['at the crossroads','tại ngã tư','Turn left <b>at the crossroads</b>.',{point:[500,440]},[500,440]],
  ['at the end of','ở cuối (đường)','The station is <b>at the end of</b> Station Road.',{point:[830,612]},[922,530]],
  ['at the corner of','tại góc (một điểm)','Wait <b>at the corner of</b> Park Road and Church Street.',{point:[500,440]},[524,462]]]],
 ['KHÁC','Giới từ hay gặp khác',[
  ['next to / beside','bên cạnh','The bakery is <b>next to</b> the chemist.',{box:'Chemist'},[595,376]],
  ['between','ở giữa hai nơi','The post office is <b>between</b> the bank and the museum.',{box:'Bank',box2:'Museum'},[405,95]],
  ['opposite / across from','đối diện','The supermarket is <b>opposite</b> the museum.',{box:'Museum'},[605,266]],
  ['in front of','phía trước','The taxi waits <b>in front of</b> the hotel.',{box:'Hotel'},[81,168]],
  ['behind','phía sau','The library is <b>behind</b> the school.',{box:'School'},[81,265]],
  ['near','gần','The hospital is <b>near</b> the station.',{box:'Station'},[922,311]],
  ['along','dọc theo','Walk <b>along</b> Park Road.',{along:[30,440,970,440]},null]]]];
$('#prepBtns').innerHTML=PG.map(([g,sub,items],gi)=>`<div class="pgrp"><div class="pgh g${gi}"><b>${g}</b><span>${sub}</span></div>${items.map((it,ii)=>`<button data-pp="${gi}.${ii}">${it[0]}<span>${it[1]}</span></button>`).join('')}</div>`).join('');
let star=null;
function starAt(x,y,instant){if(!star){star=E('g',{class:'star2'},prepSvg);E('circle',{r:20,fill:'#C25E0C',stroke:'#fff','stroke-width':4},star);const t=E('text',{y:8,'text-anchor':'middle','font-size':22,fill:'#fff'},star);t.textContent='★'}
  prepSvg.appendChild(star);if(instant){star.style.transition='none';star.getBoundingClientRect()}star.style.transform=`translate(${x}px,${y}px)`;if(instant){star.getBoundingClientRect();star.style.transition=''}}
$('#prepBtns').addEventListener('click',e=>{const b=e.target.closest('[data-pp]');if(!b)return;const [gi,ii]=b.dataset.pp.split('.').map(Number);const it=PG[gi][2][ii],fx=it[3];
  $$('#prepBtns button').forEach(x=>x.classList.toggle('on',x===b));prepOv.innerHTML='';
  if(fx.area)E('rect',{x:fx.area[0],y:fx.area[1],width:fx.area[2],height:fx.area[3],rx:10,class:'fxarea'},prepOv);
  if(fx.edge){E('line',{x1:fx.edge[0],y1:fx.edge[1],x2:fx.edge[2],y2:fx.edge[3],class:'fxedge'},prepOv);if(fx.arrow)drawPath(prepOv,[[fx.edge[0],fx.edge[1]],[fx.edge[2],fx.edge[3]]])}
  if(fx.point){const g=E('g',{class:'fxpt'},prepOv);E('circle',{cx:fx.point[0],cy:fx.point[1],r:14},g);E('circle',{cx:fx.point[0],cy:fx.point[1],r:14,class:'ring'},g)}
  [fx.box,fx.box2].filter(Boolean).forEach(n=>{const bb=byName(T3,n);E('rect',{x:bb.x-5,y:bb.y-5,width:bb.w+10,height:bb.h+10,rx:9,class:'fxbox'},prepOv)});
  if(fx.along){starAt(fx.along[0],fx.along[1],true);requestAnimationFrame(()=>{star.style.transition='transform 2.2s ease-in-out';star.style.transform=`translate(${fx.along[2]}px,${fx.along[3]}px)`;setTimeout(()=>star.style.transition='',2300)})}
  else if(it[4])starAt(it[4][0],it[4][1]);
  $('#prepCap').innerHTML=`<span class="pgtag g${gi}">${PG[gi][0]}</span> ${it[2]} <i>· ${it[1]}</i>`;SFX.whoosh()});

/* ---------- direction phrases (walker) ---------- */
const WALK=[['go straight on / straight ahead','đi thẳng','M60 210 L760 210','Go <b>straight on</b> until you reach the hotel.'],
 ['go along','đi dọc theo','M60 210 L600 210','Go <b>along</b> Park Road.'],['go past','đi qua','M60 210 L345 210','Go <b>past</b> the museum.'],
 ['pass','đi qua (động từ)','M60 210 L345 210','PASSVS'],
 ['turn left','rẽ trái','M400 410 L400 210 L120 210','Go up to the corner and <b>turn left</b>.'],['turn right','rẽ phải','M400 410 L400 210 L700 210','Go up to the corner and <b>turn right</b>.'],
 ['cross','băng qua','M290 165 L290 262','<b>Cross</b> the road at the museum.'],['head towards','đi về phía','M60 210 L535 210 L535 158','<b>Head towards</b> the station.'],
 ['you’ll see / you’ll find','bạn sẽ thấy','M400 410 L400 300','Walk up a little and <b>you’ll see</b> the hospital on your right.']];
const PASSVS=`<div class="pvs"><div class="ok"><b>go past the museum</b><span><i>past</i> là giới từ, đi sau động từ: go / walk / drive <b>past</b></span></div><div class="ok"><b>pass the museum</b><span><i>pass</i> là động từ, tự đứng một mình: You’ll <b>pass</b> the museum.</span></div><div class="ok" style="grid-column:1/-1"><b>Cùng nghĩa: đi ngang qua</b><span>Go past the bank = Pass the bank · Quá khứ: walked past = passed</span></div></div>`;
$('#walkBtns').innerHTML=WALK.map((w,i)=>`<button data-walk="${i}"${w[3]==='PASSVS'?' class="vs"':''}>${w[0]}<span>${w[1]}</span></button>`).join('');
let raf=null;
$('#walkBtns').addEventListener('click',e=>{const b=e.target.closest('[data-walk]');if(!b)return;const w=WALK[+b.dataset.walk];
  $$('#walkBtns button').forEach(x=>x.classList.toggle('on',x===b));
  const p=$('#walkPath');p.setAttribute('d',w[2]);const L=p.getTotalLength();p.style.strokeDasharray=L;p.style.strokeDashoffset=L;
  const wk=$('#walker'),dot=$('#walkerDot');cancelAnimationFrame(raf);const t0=performance.now(),D=Math.max(900,L*3.2);
  const tick=t=>{const k=Math.min(1,(t-t0)/D),e2=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;const pt=p.getPointAtLength(L*e2);
    [wk,dot].forEach(c=>{c.setAttribute('cx',pt.x);c.setAttribute('cy',pt.y)});p.style.strokeDashoffset=L*(1-e2);
    if(k<1)raf=requestAnimationFrame(tick);else{p.style.strokeDasharray='10 12';p.style.strokeDashoffset=0;SFX.ding()}};
  raf=requestAnimationFrame(tick);$('#walkCap').innerHTML=w[3]==='PASSVS'?PASSVS:`${w[3]} <i>· ${w[1]}</i>`;SFX.whoosh()});

/* ---------- places ---------- */
const PL=[['bank','ngân hàng'],['library','thư viện'],['restaurant','nhà hàng'],['service station','trạm xăng'],['chemist','hiệu thuốc'],['town hall','toà thị chính'],
 ['post office','bưu điện'],['supermarket','siêu thị'],['hospital','bệnh viện'],['museum','bảo tàng'],['car park','bãi đỗ xe'],['stadium','sân vận động'],
 ['swimming pool','bể bơi'],['station','nhà ga'],['lift','thang máy'],['stairs','cầu thang'],['toilets','nhà vệ sinh'],['reception','quầy lễ tân'],
 ['meeting room','phòng họp'],['café','quán cà phê'],['reference books','sách tra cứu'],['periodicals','báo, tạp chí'],['crossroads','ngã tư'],['entrance','lối vào']];
$('#flipGrid').innerHTML=PL.map(p=>`<button class="flip" aria-label="${p[0]}"><span class="in2"><span class="f">${p[0]}</span><span class="bk">${p[1]}</span></span></button>`).join('');
$('#flipGrid').addEventListener('click',e=>{const f=e.target.closest('.flip');if(!f)return;f.classList.toggle('on');SFX.tick()});

/* ---------- Where am I: draggable figure + description checker ---------- */
const TW=JSON.parse(JSON.stringify(MD.TOWN));TW.id='tw';const wSvg=$('#whereMap');let roadNames=true;let wOv;
const W={start:{x:170,y:620,h:'N'},fig:{x:620,y:395},hidden:false};
function svgPt(e){const pt=wSvg.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;return pt.matrixTransform(wSvg.getScreenCTM().inverse())}
let figG,startG,routeG;
function wDraw(){wOv=TM.draw(wSvg,TW,{roadNames});routeG=E('g',{},wOv);
  startG=E('g',{class:'startmk',tabindex:0},wOv);E('circle',{r:20,fill:'#18794E',stroke:'#fff','stroke-width':4},startG);E('path',{d:'M0 -14 9 6 0 1 -9 6z',fill:'#fff',class:'hd'},startG);
  const sl=E('g',{},startG);E('rect',{x:-36,y:24,width:72,height:24,rx:7,fill:'#18794E'},sl);const st=E('text',{x:0,y:41,'text-anchor':'middle',fill:'#fff','font-size':14,'font-weight':800},sl);st.textContent='START';
  figG=E('g',{class:'figure',tabindex:0},wOv);E('ellipse',{cx:0,cy:30,rx:16,ry:5,fill:'#000',opacity:.25},figG);
  E('path',{d:'M-9 30 L-6 8 L6 8 L9 30',fill:'none',stroke:'#16213A','stroke-width':6,'stroke-linecap':'round'},figG);
  E('path',{d:'M-12 -8 Q0 -14 12 -8 L9 12 L-9 12Z',fill:'#C25E0C'},figG);E('path',{d:'M-12 -6 L-18 10 M12 -6 L18 10',stroke:'#C25E0C','stroke-width':6,'stroke-linecap':'round'},figG);
  E('circle',{cy:-20,r:10,fill:'#F2C89B',stroke:'#16213A','stroke-width':2},figG);E('path',{d:'M-10 -23 Q0 -36 10 -23',fill:'#3B2A20'},figG);
  wPlace()}
function wPlace(){startG.style.transform=`translate(${W.start.x}px,${W.start.y-26}px)`;$('.hd',startG).setAttribute('transform',`rotate(${{N:0,E:90,S:180,W:270}[W.start.h]})`);
  figG.style.transform=`translate(${W.fig.x}px,${W.fig.y}px)`;figG.style.opacity=W.hidden?0:1}
function drag(g,onMove,onEnd){let on=false;g.addEventListener('pointerdown',e=>{on=true;g.setPointerCapture(e.pointerId);g.classList.add('drag');e.preventDefault()});
  g.addEventListener('pointermove',e=>{if(!on)return;onMove(svgPt(e))});g.addEventListener('pointerup',e=>{if(!on)return;on=false;g.classList.remove('drag');onEnd&&onEnd(svgPt(e))})}
wDraw();
function bindDrag(){drag(figG,p=>{W.fig={x:Math.max(10,Math.min(990,p.x)),y:Math.max(10,Math.min(610,p.y))};wPlace()},()=>{routeG.innerHTML='';SFX.pop(3)});
 drag(startG,p=>{startG.style.transform=`translate(${p.x}px,${p.y-26}px)`},p=>{const n=TM.nodes(TW).sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y))[0];W.start.x=n.x;W.start.y=n.y;
   const ok=['N','E','S','W'].filter(h=>validH(h));if(!validH(W.start.h))W.start.h=ok[0];wPlace();routeG.innerHTML='';SFX.thud()})}
bindDrag();
function validH(h){const d={N:[0,-1],E:[1,0],S:[0,1],W:[-1,0]}[h];return TW.roads.some(r=>{const [x1,y1,x2,y2]=r.c;const x=W.start.x+d[0]*5,y=W.start.y+d[1]*5;return y1===y2?(Math.abs(y-y1)<2&&x>=Math.min(x1,x2)&&x<=Math.max(x1,x2)):(Math.abs(x-x1)<2&&y>=Math.min(y1,y2)&&y<=Math.max(y1,y2))})}
function wGo(){const txt=$('#wInput').value.trim();const res=$('#wResult');if(!txt){res.innerHTML='<p class="sub">Nhập mô tả đường đi trước.</p>';return}
  routeG.innerHTML='';const r=TM.walk(TW,W.start,txt);const d=drawPath(routeG,r.path);const dist=Math.hypot(r.end.x-W.fig.x,r.end.y-W.fig.y);const ok=dist<80;
  setTimeout(()=>{const g=E('g',{class:'endmk '+(ok?'ok':'no')},routeG);E('circle',{cx:r.end.x,cy:r.end.y,r:22},g);E('circle',{cx:r.end.x,cy:r.end.y,r:22,class:'ring'},g);
    res.innerHTML=`<div class="verdict ${ok?'ok':'no'}">${ok?'✓ Đến đúng chỗ người đang đứng!':'✗ Chưa đúng: điểm dừng cách người khoảng '+Math.round(dist/10)*10+' m'}</div>
     <ol class="wlog">${r.log.map(l=>`<li>${l}</li>`).join('')}</ol>${r.unk.length?`<p class="unk">Chưa hiểu: ${r.unk.map(u=>'“'+u.replace(/</g,'&lt;')+'”').join(', ')}</p>`:''}`;
    ok?SFX.cheer():SFX.buzz()},d.dur*1000+100);SFX.whoosh()}
document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act;
  if(a==='w-go')wGo();
  else if(a==='w-clear'){$('#wInput').value='';routeG.innerHTML='';$('#wResult').innerHTML='<p class="sub">Đã xoá. Nhập mô tả mới.</p>'}
  else if(a==='w-model'){$('#wInput').value=TM.model(TW,W.start,W.fig)||'(Không tìm được đường)';SFX.chime()}
  else if(a==='w-turn'){const hs=['N','E','S','W'].filter(validH);W.start.h=hs[(hs.indexOf(W.start.h)+1)%hs.length];wPlace();routeG.innerHTML='';SFX.tick()}
  else if(a==='w-hide'){W.hidden=!W.hidden;b.classList.toggle('on',W.hidden);wPlace()}
  else if(a==='w-names'){roadNames=!roadNames;b.classList.toggle('on',!roadNames);wDraw();bindDrag()}
});

/* ---------- drawing maps ---------- */
$$('svg[data-dmap]').forEach(s=>TM.draw(s,MD[s.dataset.dmap],{fs:20,roadFs:18}));

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

/* ---------- book exercises: audio + subtitles ---------- */
const au=$('#exAudio');let exS=null;const SP=[1,.9,.8,1.1];let spi=0;
const fmt=t=>Math.floor(t/60)+':'+String(Math.floor(t%60)).padStart(2,'0');
function exUse(s){if(exS!==s){au.pause();exS=s;au.src=s.dataset.audio;au.playbackRate=SP[spi]}}
LEAVE.push(()=>{au.pause()});
au.addEventListener('timeupdate',()=>{if(!exS)return;const t=au.currentTime;$('.extime',exS).textContent=fmt(t)+' / '+fmt(au.duration||0);const sk=$('.exseek',exS);if(document.activeElement!==sk){sk.max=au.duration||100;sk.value=t}
  let act=null;$$('.ln',exS).forEach(l=>{if(+l.dataset.t<=t+.05)act=l});$$('.ln',exS).forEach(l=>l.classList.toggle('playing',l===act&&!au.paused));
  const box=$('.exsubs',exS);if(act&&!box.hidden){const r=act.offsetTop-box.offsetTop;if(r<box.scrollTop||r>box.scrollTop+box.clientHeight-40)box.scrollTop=Math.max(0,r-30)}});
const setPlay=()=>{if(exS)$('[data-act="ex-play"]',exS).textContent=au.paused?'▶ Phát':'❚❚ Dừng'};au.addEventListener('play',setPlay);au.addEventListener('pause',setPlay);
document.addEventListener('input',e=>{const sk=e.target.closest('.exseek');if(!sk)return;exUse(sk.closest('.slide'));au.currentTime=+sk.value});
document.addEventListener('click',e=>{const s=e.target.closest('.exslide');if(!s)return;
  const o2=e.target.closest('.opt2');if(o2){$$('.opt2',o2.parentNode).forEach(x=>x.classList.toggle('pick',x===o2&&!x.classList.contains('pick')));SFX.tick();return}
  const ln=e.target.closest('.ln');if(ln){exUse(s);au.currentTime=+ln.dataset.t;au.play().catch(()=>{});return}
  const b=e.target.closest('[data-act]');if(!b)return;
  switch(b.dataset.act){
    case 'ex-play':exUse(s);if(au.paused)au.play().catch(()=>{});else au.pause();break;
    case 'ex-back':exUse(s);au.currentTime=Math.max(0,au.currentTime-5);break;
    case 'ex-speed':spi=(spi+1)%SP.length;au.playbackRate=SP[spi];b.textContent=SP[spi]+'×';break;
    case 'ex-cc':{const x=$('.exsubs',s);x.hidden=!x.hidden;b.classList.toggle('on',!x.hidden);SFX.tick();break}
    case 'ex-mark':{s.classList.toggle('revealed');const on=s.classList.contains('revealed');b.classList.toggle('on',on);$('.extip',s).hidden=!on;if(on)SFX.ding();break}
    case 'ex-ans':s.classList.toggle('exans');b.classList.toggle('on');if(s.classList.contains('exans'))SFX.chime();break;
    case 'ex-clear':$$('.opt2',s).forEach(o=>o.classList.remove('pick'));s.classList.remove('exans');$('[data-act="ex-ans"]',s).classList.remove('on');break}});

/* ---------- exit ticket ---------- */
STEP.sExit=(s,n)=>{$$('.ex',s).forEach((x,i)=>x.classList.toggle('in',i<n));cellOf($('#exitMap'),'F').classList.toggle('ok',n>=3);if(n)SFX.ding()};

/* ---------- misc clicks ---------- */
document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;
  switch(b.dataset.act){case 'step':next();break;
    case 'flip-all':{const all=$$('.flip'),on=!all.every(f=>f.classList.contains('on'));all.forEach((f,i)=>setTimeout(()=>f.classList.toggle('on',on),i*35));SFX.whoosh();break}}});

Object.keys(STEP).forEach(id=>{const s=$('#'+id);if(s)STEP[id](s,0)});
SFX.stop();
const m=/^#s(\d+)$/.exec(location.hash);show(m?+m[1]-1:0);
})();
