(function(){
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const slides=$$('.slide');let cur=0;
const cq=()=>$('#stage').offsetWidth/100;
const fmt=n=>n.toLocaleString('en-GB');
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
const poss=s=>/s$/.test(s)?s+'’':s+'’s';

/* ================= chart data ================= */
const PC=['var(--c1)','var(--c2)','var(--c3)','var(--c4)','var(--c5)','var(--c6)'];
const HC=['#1F5FD6','#5B8BE6','#9DB8F0'];
const CH={
 age:{type:'pie',title:'Age of players',s:[['Under 18',39],['18–36',38],['Above 36',23]]},
 gen:{type:'pie',title:'Gender of players',s:[['Male',72],['Female',28]]},
 typ:{type:'pie',title:'Types of games they like',s:[['Role-playing',7],['Action',43],['Sports',20],['Racing',17],['Education',7,[-4,14]],['Others',6,[4,-10]]]},
 or:{type:'hbar',title:'Oranges',max:1200,ticks:[0,400,800,1200],r:[['South Africa',1050],['Egypt',900],['United States',700]]},
 lem:{type:'hbar',title:'Lemons',max:600,ticks:[0,200,400,600],r:[['Turkey',500],['Mexico',450],['Argentina',250]]},
 gra:{type:'hbar',title:'Grapefruits',max:300,ticks:[0,100,200,300],r:[['United States',250],['South Africa',250],['Turkey',180]]},
 oth:{type:'hbar',title:'Other citrus fruits',max:600,ticks:[0,200,400,600],r:[['Mexico',450],['Israel',6],['United States',4]]},
 res:{type:'vg',title:'Reservoir levels (% of capacity)',cats:[['Sydney',75,80],['Melbourne',25,38],['Perth',40,60],['Canberra',75,98,'~98'],['Brisbane',55,55],['Darwin',45,38]]}
};
const SETS={game:['age','gen','typ'],citrus:['or','lem','gra','oth'],gender:['gen'],res:['res']};

function pieHTML(id,c){let acc=0;
  const g=c.s.map(([k,v,off],i)=>{const a=(acc+v/2)/100*2*Math.PI-Math.PI/2,cx=Math.cos(a),cy=Math.sin(a);
    const o=off||[0,0],lx=100+cx*114+o[0],ly=100+cy*114+o[1],anc=cx>.12?'start':cx<-.12?'end':'middle';
    const [yn,yv]=cy<-.35?[ly-26,ly]:cy>.35?[ly+10,ly+36]:[ly-8,ly+19];
    const s=`<g class="psl" data-k="${k}" style="--dx:${(cx*10).toFixed(1)}px;--dy:${(cy*10).toFixed(1)}px"><circle cx="100" cy="100" r="50" pathLength="100" transform="rotate(-90 100 100)" stroke="${PC[i]}" style="--v:${v};--d:${(i*.16).toFixed(2)}s;stroke-dashoffset:${-acc}"/><text class="n" x="${lx.toFixed(1)}" y="${yn.toFixed(1)}" text-anchor="${anc}" style="--d:${(i*.16).toFixed(2)}s">${k}</text><text x="${lx.toFixed(1)}" y="${yv.toFixed(1)}" text-anchor="${anc}" style="--d:${(i*.16).toFixed(2)}s">${v}%</text></g>`;
    acc+=v;return s}).join('');
  return `<div class="ch pie" data-c="${id}"><div class="ct">${c.title}</div><svg viewBox="-105 -70 410 325" aria-label="${c.title}">${g}</svg></div>`}
function hbarHTML(id,c){
  const rows=c.r.map(([k,v],i)=>`<div class="hr" data-k="${k}"><span class="hl">${k}</span><span class="tr"><i class="bar" style="--w:${v/c.max*100}%;--d:${i*.15}s;--bc:${HC[i]}"></i><b class="vl" style="--w:${v/c.max*100}%;--d:${i*.15}s">${fmt(v)}</b><span class="crown2" style="--w:${v/c.max*100}%">No.1</span></span></div>`).join('');
  const ax=c.ticks.map(t=>`<span style="left:${t/c.max*100}%">${fmt(t)}</span>`).join('');
  return `<div class="ch hb" data-c="${id}"><div class="ct">${c.title}</div><div class="hbg">${rows}</div><div class="ax"><span class="u">’000 t</span>${ax}</div></div>`}
function vgHTML(id,c){
  const gl=[0,20,40,60,80,100].map(v=>`<div class="gl" style="bottom:${v}%"><span>${v}</span></div>`).join('');
  const cols=c.cats.map(([k,a,b,lab],i)=>{const d=b-a,cls=d>0?'up':d<0?'dn':'eq',mx=Math.max(a,b);
    return `<div class="vc" data-k="${k}" data-mx="${mx}"><div class="vbars"><i class="vb s0" style="--h:${a}%;--d:${i*.1}s"><b>${a}</b></i><i class="vb s1" style="--h:${b}%;--d:${i*.1}s"><b>${lab||b}</b></i><span class="chg ${cls}" style="top:auto;bottom:calc(${mx}% + 2cqi)">${d>0?'+':d<0?'−':'±'}${Math.abs(d)}</span></div><span class="vn">${k}</span></div>`}).join('');
  return `<div class="ch vg" data-c="${id}"><div class="ct">${c.title}</div><div class="vplot">${gl}${cols}</div><div class="vfoot"></div><div class="leg"><span><i style="background:var(--c1)"></i>October 2009</span><span><i style="background:var(--c2)"></i>October 2010</span></div></div>`}
const R={pie:pieHTML,hbar:hbarHTML,vg:vgHTML};
$$('[data-chart]').forEach(el=>{el.innerHTML=SETS[el.dataset.chart].map(id=>R[CH[id].type](id,CH[id])).join('')});
$$('[data-mini]').forEach(el=>{const id=el.dataset.mini;el.innerHTML=R[CH[id].type](id,CH[id]);el.classList.remove('drawn')});

function draw(root,on,series){$$('.ch',root).forEach(c=>{if(c.classList.contains('vg')){const s=series==null?[0,1]:series;c.classList.toggle('d0',on&&s.includes(0));c.classList.toggle('d1',on&&s.includes(1))}else c.classList.toggle('drawn',on)})}
function redraw(root){draw(root,false);root.getBoundingClientRect();setTimeout(()=>{draw(root,true);SFX.grow()},80)}

/* ================= zoom engine ================= */
function pos(el,root){let x=0,y=0,e=el;while(e&&e!==root){x+=e.offsetLeft;y+=e.offsetTop;e=e.offsetParent}return {x,y,w:el.offsetWidth,h:el.offsetHeight}}
function Z(w){if(w._z)return w._z;const zi=$('.zi',w);
  const b=document.createElement('button');b.className='zout';b.textContent='⤢ Thu nhỏ';w.appendChild(b);
  const z=w._z={k:1,
    rects(refs){const out=[];refs.forEach(({c,keys})=>{const ch=$(`[data-c="${c}"]`,zi);if(!ch)return;
      if(ch.classList.contains('pie')){const p=pos(ch,zi),t=$('.ct',ch).offsetHeight,cw=Math.min(p.w,(p.h-t)*410/325);out.push({x:p.x+(p.w-cw)/2,y:p.y,w:cw,h:p.h});return}
      if(!keys.length){out.push(pos(ch,zi));return}
      keys.forEach(k=>{const el=$(`[data-k="${k}"]`,ch);if(!el)return;
        if(ch.classList.contains('vg')){const p=pos(el,zi),vb=$('.vbars',el),mx=+el.dataset.mx,u=cq();
          const top=p.y+vb.offsetTop+vb.offsetHeight*(1-mx/100)-5.6*u;out.push({x:p.x-1.2*u,y:top,w:p.w+2.4*u,h:p.y+p.h+2.8*u-top})}
        else out.push(pos(el,zi))})});return out},
    frame(rs,maxK){if(!rs.length)return z.out();let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
      rs.forEach(r=>{x0=Math.min(x0,r.x);y0=Math.min(y0,r.y);x1=Math.max(x1,r.x+r.w);y1=Math.max(y1,r.y+r.h)});
      const W=w.clientWidth,H=w.clientHeight,bw=x1-x0,bh=y1-y0;let k=Math.max(1,Math.min(W*.84/bw,H*.8/bh,maxK||2.6));
      let tx=W/2-(x0+bw/2)*k,ty=H/2-(y0+bh/2)*k;tx=Math.min(0,Math.max(W-W*k,tx));ty=Math.min(0,Math.max(H-H*k,ty));
      if(k<1.03){z.out();return}
      zi.style.transform=`translate(${tx.toFixed(1)}px,${ty.toFixed(1)}px) scale(${k.toFixed(3)})`;z.k=k;w.classList.add('zoomed')},
    out(){zi.style.transform='';z.k=1;w.classList.remove('zoomed')},
    hot(refs){$$('.hot',zi).forEach(e=>e.classList.remove('hot'));$$('.hasHot',zi).forEach(e=>e.classList.remove('hasHot'));
      w.classList.toggle('focus',refs.length>0);
      refs.forEach(({c,keys})=>{const ch=$(`[data-c="${c}"]`,zi);if(!ch)return;ch.classList.add('hasHot');
        (keys.length?keys.map(k=>$(`[data-k="${k}"]`,ch)).filter(Boolean):$$('[data-k]',ch)).forEach(e=>e.classList.add('hot'))})},
    show(str,opt={}){const refs=parse(str);z.hot(refs);if(opt.zoom===false)return;const wasK=z.k;z.frame(z.rects(refs),opt.max);
      if(!opt.quiet){if(z.k>1.02)SFX.whoosh();else if(wasK>1.02)SFX.whoosh(false)}},
    reset(){z.hot([]);z.out()}};
  return z}
function parse(str){if(!str)return[];return str.split('|').map(p=>{const [c,k]=p.split(':');return {c,keys:k?k.split(','):[]}})}
function frameAround(w,ids,cls,label){const zi=$('.zi',w),u=cq();let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
  ids.forEach(id=>{const p=pos($(`[data-c="${id}"]`,zi),zi);x0=Math.min(x0,p.x);y0=Math.min(y0,p.y);x1=Math.max(x1,p.x+p.w);y1=Math.max(y1,p.y+p.h)});
  const f=document.createElement('div');f.className='frame '+cls;Object.assign(f.style,{left:(x0-.6*u)+'px',top:(y0-.3*u)+'px',width:(x1-x0+1.2*u)+'px',height:(y1-y0+.9*u)+'px'});
  f.innerHTML=`<b>${label}</b>`;zi.appendChild(f);requestAnimationFrame(()=>f.classList.add('in'));return f}
const clearFrames=w=>$$('.frame',w).forEach(f=>f.remove());
window.addEventListener('resize',()=>$$('.zw').forEach(w=>{if(w._z)w._z.out()}));
document.addEventListener('click',e=>{
  const zo=e.target.closest('.zout');if(zo){Z(zo.closest('.zw')).reset();SFX.whoosh(false);return}
  const k=e.target.closest('.zw [data-k]');if(!k)return;const w=k.closest('.zw'),z=Z(w);
  if(z.k>1.02){z.reset();SFX.whoosh(false)}else z.show(k.closest('.ch').dataset.c+':'+k.dataset.k)});

/* ================= navigation ================= */
const STEP={},ENTER={},NOAUTO=new Set(['sWhat','sOverview','sRes','sUpgrade']);
const jump=$('#jump');
slides.forEach((s,i)=>{const o=document.createElement('option');o.value=i;o.textContent=(i+1)+'. '+(s.dataset.title||'');jump.appendChild(o)});
jump.onchange=()=>show(+jump.value);
function show(i){cur=Math.max(0,Math.min(slides.length-1,i));slides.forEach((s,k)=>s.classList.toggle('on',k===cur));
  $('#count').textContent=(cur+1)+' / '+slides.length;jump.value=cur;SFX.stop();
  const s=slides[cur];
  $$('.zw',s).forEach(w=>{Z(w).reset();clearFrames(w)});
  if(!NOAUTO.has(s.id))$$('.zw,[data-chart]',s).forEach(w=>{if(w.classList.contains('zw'))redraw(w)});
  if(s.id&&ENTER[s.id])ENTER[s.id](s);
  if(s.id&&STEP[s.id])setTimeout(()=>runStep(s,stepOf(s),true),120);
  try{history.replaceState(null,'','#s'+(cur+1))}catch(e){}
  window.dispatchEvent(new Event('deck:show'))}
window.DECK={show:i=>show(i),cur:()=>cur,indexOf:id=>slides.findIndex(s=>s.id===id)};
const stepOf=s=>+(s.dataset.step||0);
function runStep(s,n,enter){const st=window.setTimeout;window.setTimeout=(f,ms)=>st(()=>{if(stepOf(s)===n&&slides[cur]===s)f()},ms);try{STEP[s.id](s,n,enter)}finally{window.setTimeout=st}}
function setStep(s,n){s.dataset.step=n;STEP[s.id]&&runStep(s,n)}
function next(){const s=slides[cur],m=+(s.dataset.steps||0);if(m&&stepOf(s)<m){setStep(s,stepOf(s)+1);return}show(cur+1)}
function prev(){const s=slides[cur],m=+(s.dataset.steps||0);if(m&&stepOf(s)>0){setStep(s,stepOf(s)-1);return}show(cur-1)}
$('#prev').onclick=prev;$('#next').onclick=next;
$('#fs').onclick=()=>{const el=document.documentElement;if(document.fullscreenElement){document.exitFullscreen&&document.exitFullscreen().catch(()=>{})}else if(el.requestFullscreen){el.requestFullscreen().catch(()=>{})}};
document.addEventListener('keydown',e=>{if(e.target.closest('input,textarea,select,[contenteditable]'))return;
  if(e.key==='ArrowRight'||e.key==='PageDown'){next();e.preventDefault()}else if(e.key==='ArrowLeft'||e.key==='PageUp'){prev();e.preventDefault()}
  else if(e.key==='z'||e.key==='Z'){$$('.zw',slides[cur]).forEach(w=>Z(w).reset());SFX.whoosh(false)}});
const tog=(els,n,cls='in')=>els.forEach((e,i)=>e.classList.toggle(cls,i<n));

/* ================= Part 1 ================= */
STEP.sWhat=(s,n,enter)=>{const d=$('#pDyn',s),st=$('#pStat',s);
  if(enter){d.classList.remove('in');draw(st,false)}
  setTimeout(()=>d.classList.toggle('in',n>=1),enter?60:0);st.classList.toggle('in',n>=2);
  setTimeout(()=>draw(st,n>=2),250);$('#wRule',s).classList.toggle('in',n>=3);
  if(!enter&&n){[()=>SFX.grow(),()=>SFX.whoosh(),()=>SFX.thud()][n-1]()}};

const WORDS=[30,35,60,60];
STEP.sStruct=(s,n,enter)=>{tog($$('.blk2',s),n);const segs=$$('#wcBar i',s);let t=0;
  segs.forEach((g,i)=>{g.style.height=i<n?WORDS[i]/200*100+'%':'0';if(i<n)t+=WORDS[i]});
  $('#wcN',s).textContent=t;$('#noList',s).classList.toggle('in',n>=5);
  if(!enter&&n)n>=5?SFX.thud():SFX.pop(n)};

const OVZ=['','','age:Under 18,18–36','gen:Male','typ:Action','typ:Role-playing,Education',''];
STEP.sOverview=(s,n,enter)=>{const w=$('#zOv',s);if(enter){draw(w,false)}
  setTimeout(()=>{if(n>=1&&!$('.ch.drawn',w)){draw(w,true);SFX.grow()}if(n<1)draw(w,false)},enter?60:0);
  const m=$$('#ovMap>*',s);m.forEach((e,i)=>e.classList.toggle('in',n>=Math.floor(i/3)+2));
  tog($$('#ovSent>span',s),n-1);$('#ovF',s).classList.toggle('in',n>=6);
  const z=Z(w);setTimeout(()=>{if(OVZ[n])z.show(OVZ[n],{max:2.4});else{z.reset();if(!enter&&n===6)SFX.whoosh(false)}},n===2&&!enter?350:enter?900:0);
  if(!enter&&n>=2&&n<=5)setTimeout(()=>SFX.ding(),900)};

STEP.sDivide=(s,n,enter)=>{const t=$$('.tnode',s),sub=$$('.tsub>div',s);tog(t,Math.min(n,2));tog(sub,n-2);$('.troot',s).classList.add('in');if(!enter&&n)SFX.pop(n)};

STEP.sDivGame=(s,n,enter)=>{const w=$('#zDivG',s),z=Z(w);clearFrames(w);tog($$('.side>.box',s),n);
  $$('.psl.merge',w).forEach(e=>e.classList.remove('merge'));
  const go=()=>{if(n===1){frameAround(w,['age','gen'],'f1','Body 1 · người chơi');frameAround(w,['typ'],'f2','Body 2 · thể loại');z.reset()}
    else if(n===2)z.show('typ:Action');
    else if(n===3){z.show('typ:Role-playing,Education,Others,Sports');['Role-playing','Education','Others'].forEach(k=>$(`[data-c="typ"] [data-k="${k}"]`,w).classList.add('merge'))}
    else z.reset()};
  setTimeout(go,enter?900:0);if(!enter&&n)SFX.pop(n)};

STEP.sDivCit=(s,n,enter)=>{const w=$('#zDivC',s),z=Z(w);clearFrames(w);tog($$('.side>.box.hide',s),n);
  setTimeout(()=>{if(n>=1)frameAround(w,['or','lem'],'f1','Body 1');if(n>=2)frameAround(w,['gra','oth'],'f2','Body 2');
    if(n===3)z.show('oth:Mexico,Israel,United States');else z.reset()},enter?900:0);if(!enter&&n)SFX.pop(n)};

/* ---------- comparator ---------- */
const CMP={
 typ:{tab:'Game (%)',pct:1,r:[['action games',43],['sports games',20],['racing games',17],['role-playing games',7],['educational games',7],['other genres',6]],
  more:(B,S)=>`${cap(B)} were more popular than ${S}.`,ratio:(B,S,p)=>`${cap(B)} were ${p} as popular as ${S}.`,
  eq:(B,S,v)=>`${cap(B)} and ${S} were equally popular, at ${v}% each.`,near:(B,S,b,s)=>`${cap(B)} and ${S} were almost equally popular, at ${b}% and ${s}% respectively.`,
  sup:r=>`${cap(r[0][0])} were the most popular, while ${r[r.length-1][0]} attracted the smallest share.`},
 age:{tab:'Tuổi (%)',pct:1,r:[['players under 18',39],['players aged 18–36',38],['players above 36',23]],
  more:(B,S)=>`${cap(B)} outnumbered ${S}.`,ratio:(B,S,p)=>`There were ${p} as many ${B} as ${S}.`,
  eq:(B,S,v)=>`${cap(B)} and ${S} were equal in number, at ${v}% each.`,near:(B,S,b,s)=>`${cap(B)} and ${S} were almost equal in number, at ${b}% and ${s}% respectively.`,
  sup:r=>`${cap(r[0][0])} formed the largest group, while ${r[r.length-1][0]} were the smallest.`},
 lem:{tab:'Chanh',r:[['Turkey',500],['Mexico',450],['Argentina',250]],f:'lemons'},
 or:{tab:'Cam',r:[['South Africa',1050],['Egypt',900],['the United States',700]],f:'oranges'},
 gra:{tab:'Bưởi',r:[['the United States',250],['South Africa',250],['Turkey',180]],f:'grapefruits'}};
Object.values(CMP).forEach(d=>{if(d.pct)return;const f=d.f;
  d.more=(B,S)=>`${cap(B)} exported more ${f} than ${S}.`;d.ratio=(B,S,p)=>`${cap(B)} exported ${p} as many ${f} as ${S}.`;
  d.eq=(B,S,v)=>`${cap(B)} and ${S} exported the same amount of ${f}, at ${fmt(v)} thousand tonnes each.`;
  d.near=(B,S,b,s)=>`${cap(B)} and ${S} exported almost the same amount of ${f}, at ${fmt(b)} and ${fmt(s)} thousand tonnes respectively.`;
  d.sup=r=>`${cap(r[0][0])} was the leading exporter of ${f}, followed by ${r[1][0]} and ${r[2][0]}.`});
function rp(r){if(r>=10)return `${Math.round(r)} times`;if(r>=1.95&&r<2.05)return 'twice';if(r>=1.75&&r<1.95)return 'almost twice';if(r>=2.45&&r<2.6)return 'roughly two and a half times';
  if(r>=2.05&&r<2.45)return 'more than twice';if(r>=2.9&&r<3.1)return 'three times';if(r>=1.45&&r<1.55)return 'one and a half times';return `approximately ${r.toFixed(1)} times`}
let cds='typ',cA=null,cB=null,cFull=false;
$('#cmpTabs').innerHTML=Object.entries(CMP).map(([k,d])=>`<button data-cmp="${k}"${k===cds?' class="on"':''}>${d.tab}</button>`).join('');
function cmpRender(){const d=CMP[cds],mx=Math.max(...d.r.map(x=>x[1]))*1.08;
  $('#cmpBars').innerHTML=d.r.map(([k,v],i)=>`<div class="crow${i===cA?' selA':''}${i===cB?' selB':''}" data-ci="${i}"><span class="hl">${cap(k)}</span><span class="tr"><i class="bar" style="--w:${v/mx*100}%;--bc:${HC[Math.min(i,2)]};--d:${i*.08}s"></i><b class="vl" style="--w:${v/mx*100}%">${fmt(v)}${d.pct?'%':''}</b>${i===cA?'<span class="tag3">X</span>':i===cB?'<span class="tag3">Y</span>':''}</span></div>`).join('');
  const out=$('#cmpOut');requestAnimationFrame(()=>requestAnimationFrame(()=>$('#cmpBars').classList.add('drawn')));
  out.classList.toggle('full',cFull);$('#cmpFullBtn').classList.toggle('on',cFull);
  const two=(sk,fu)=>`<p class="sk">${sk}</p><p class="fu">${fu}</p>`,X='<b class="vx">X</b>',Y='<b class="vy">Y</b>',G='<b class="gp">___</b>';
  const blanks=d.r.map(()=>[G]);
  const supG=`<div class="cgrp"><span class="lbl2">So sánh nhất</span>${two(d.sup(blanks),d.sup(d.r))}</div>`;
  if(cA==null||cB==null){out.innerHTML=supG+`<p class="idle">Bấm cột X, rồi cột Y</p>`;return}
  let [b,s]=[cA,cB].sort((x,y)=>d.r[y][1]-d.r[x][1]);const [B,bv]=d.r[b],[S,sv]=d.r[s],diff=bv-sv,r=bv/sv;
  const [XB,YS]=b===cA?[X,Y]:[Y,X];
  let h='';
  if(diff===0)h+=`<div class="cgrp"><span class="lbl2">So sánh bằng</span>${two(d.eq(XB,YS,G),d.eq(B,S,bv))}${two(d.pct?`${XB} were as popular as ${YS}.`:`${XB} exported as many ${d.f} as ${YS}.`,d.pct?`${cap(B)} were as popular as ${S}.`:`${cap(B)} exported as many ${d.f} as ${S}.`)}</div>`;
  else if(r<1.12)h+=`<div class="cgrp"><span class="lbl2">So sánh bằng</span>${two(d.near(XB,YS,G,G),d.near(B,S,bv,sv))}<span class="why">Chênh ${fmt(diff)}${d.pct?' điểm %':''}: rất nhỏ → almost equal / similar</span></div>`;
  else{h+=`<div class="cgrp"><span class="lbl2">So sánh hơn</span>${two(d.more(XB,YS),d.more(B,S))}${two(d.pct?`${XB} exceeded ${YS} by ${G} percentage points.`:`${XB}’s exports exceeded ${YS}’s by ${G} tonnes.`,d.pct?`${cap(B)} exceeded ${S} by <b>${diff} percentage points</b>.`:`${cap(poss(B))} exports exceeded ${poss(S)} by <b>${fmt(diff*1000)} tonnes</b>.`)}<span class="math">${fmt(bv)} − ${fmt(sv)} = <span class="sk">?</span><span class="fu">${fmt(diff)}${d.pct?' → percentage points':' (nghìn tấn)'}</span></span></div>`;
    h+=`<div class="cgrp"><span class="lbl2">Gấp bao nhiêu lần</span>${two(d.ratio(XB,YS,`${G} times`),d.ratio(B,S,`<b>${rp(r)}</b>`))}<span class="math">${fmt(bv)} ÷ ${fmt(sv)} ≈ <span class="sk">?</span><span class="fu">${r.toFixed(2)}</span></span></div>`}
  h+=supG;out.innerHTML=h;
  if(diff>0){const row=$(`.crow[data-ci="${b}"] .tr`),ws=sv/mx*100,wb=bv/mx*100;
    if(r<=6&&r>=1.12){const n=Math.ceil(r);for(let i=0;i<n;i++){const g=document.createElement('span');g.className='ghost';const left=i*ws,width=Math.min(ws,wb-left);if(width<=0.3)break;
      Object.assign(g.style,{left:left+'%',width:width+'%',animationDelay:(.25+i*.35)+'s'});g.innerHTML=`<span>${i+1<=r?'×'+(i+1):'×'+r.toFixed(2)}</span>`;row.appendChild(g);setTimeout(()=>SFX.tick(),250+i*350)}}
    const k=document.createElement('span');k.className='brk';Object.assign(k.style,{left:ws+'%',width:(wb-ws)+'%'});k.innerHTML=`<span>+${fmt(diff)}${d.pct?' pp':''}</span>`;
    if(r>6||r<1.12)row.appendChild(k);else{k.style.top='auto';k.style.bottom='-1.2cqi';k.style.borderTop='0';k.style.borderBottom='.22cqi solid var(--red)';k.querySelector('span').style.cssText='bottom:auto;top:100%';row.appendChild(k)}}
}
$('#cmpBars').addEventListener('click',e=>{const r=e.target.closest('.crow');if(!r)return;const i=+r.dataset.ci;
  if(cA==null||cB!=null){cA=i;cB=null;SFX.pop(2)}else if(i!==cA){cB=i;SFX.ding()}cFull=false;$('#cmpStu').value='';cmpRender()});
$('#cmpTabs').addEventListener('click',e=>{const b=e.target.closest('[data-cmp]');if(!b)return;cds=b.dataset.cmp;cA=cB=null;cFull=false;$$('#cmpTabs button').forEach(x=>x.classList.toggle('on',x===b));
  $('#cmpBars').classList.remove('drawn');cmpRender();SFX.whoosh()});
ENTER.sCompare=()=>{cFull=false;$('#cmpBars').classList.remove('drawn');cmpRender();SFX.grow()};
cmpRender();

const FR=[[50,'half'],[25,'a quarter'],[20,'a fifth'],[33,'a third']];
STEP.sNums=(s,n,enter)=>{['#np1','#np2','#np3'].forEach((id,i)=>$(id,s).classList.toggle('in',n>=i+1));
  const row=$('#ratioRow',s);$$('.ghost',row).forEach(g=>g.remove());
  if(n===2){[[0,50,'×1'],[50,30,'×1.6']].forEach(([l,w,t],i)=>{const g=document.createElement('span');g.className='ghost';Object.assign(g.style,{left:l+'%',width:w+'%',animationDelay:(.9+i*.45)+'s'});g.innerHTML=`<span>${t}</span>`;row.appendChild(g)})}
  const f=n>=3?FR[Math.min(n,6)-3]:null;$('#fracArc',s).style.setProperty('--v',f?f[0]:0);
  $('#fracW',s).innerHTML=f?`<b>${f[1]}</b><span>${f[0]}%</span>`:'';if(!enter&&n)n<=2?SFX.thud():SFX.pop(n)};

/* ================= Part 2 ================= */
const BAND=[['Task Achievement','Overview mơ hồ, không chỉ ra pattern chung','Overview rõ, nêu đúng điểm cao / thấp và sự chi phối','sNMo',7,'Bài 2 · overview'],
 ['Task Achievement','Số liệu sai hoặc thiếu, không chọn lọc','Chọn điểm nổi bật, mỗi điểm có số liệu hỗ trợ','sMP',4,'Bài 1'],
 ['Coherence & Cohesion','Liệt kê theo thứ tự dữ liệu, gộp không có logic','Gộp nhóm có tiêu chí, câu chủ đề nêu tiêu chí','sNMb',7,'Bài 2 · body'],
 ['Coherence & Cohesion','Liên từ đơn giản: and, but, also','Đa dạng: whereas, by contrast, in comparison','sNMb',5,'Bài 2 · body'],
 ['Lexical Resource','Lặp is, was, shows','accounted for, made up, outnumbered','sSurg',4,'Cả hai bạn'],
 ['Grammar','Câu đơn, câu ghép đơn giản','Mệnh đề quan hệ, cụm phân từ, câu phức','sMP',6,'Bài 1']];
$('#bandT').insertAdjacentHTML('beforeend',BAND.map(r=>`<span class="cr">${r[0]}</span><span class="c6">${r[1]}</span><span class="ar2">→</span><span class="c7">${r[2]}</span><button class="glink" data-goto="${r[3]}:${r[4]}">${r[5]} ↗</button>`).join(''));
document.addEventListener('click',e=>{const g=e.target.closest('[data-goto]');if(!g)return;const [id,n]=g.dataset.goto.split(':'),i=DECK.indexOf(id);slides[i].dataset.step=n;show(i);SFX.whoosh()});
STEP.sBand=(s,n,enter)=>{tog($$('.glink',s),n,'on');tog($$('.c6',s),n,'on');tog($$('.ar2',s),n,'on');tog($$('.c7',s),n,'on');if(!enter&&n)SFX.pop(n)};

STEP.sUpgrade=(s,n,enter)=>{const w=$('#zUp',s),z=Z(w);
  if(enter){draw(w,false);setTimeout(()=>{draw(w,true);SFX.grow()},80)}
  $('.w6x',s).classList.toggle('w6',n>=1);$('.w6y',s).classList.toggle('w6',n>=1);$('#upWhy',s).classList.toggle('in',n>=1);
  const c=$$('.calc>*',s);c.forEach((e,i)=>e.classList.toggle('in',n>=Math.floor(i/2)+2));$('#up7',s).classList.toggle('in',n>=4);
  setTimeout(()=>{if(n===2)z.show('gen:Male',{max:1.5});else if(n>=3)z.show('gen:Male,Female',{zoom:false}),z.out();else z.reset()},enter?1000:0);
  if(!enter&&n){[null,()=>SFX.thud(),()=>SFX.ding(),()=>SFX.ding(),()=>SFX.chime()][n]()}};

const E6=[['Action games exceeded sports games by 23 percent.','… by 23 percentage points.','Hiệu của hai tỉ lệ % là percentage points'],
 ['X was twice as high as Y. (40 và 25)','X was approximately 1.6 times as high as Y.','Tính tỉ lệ trước khi viết twice'],
 ['Overall, males made up 72% and action games 43%.','Overall, males made up the vast majority, and action games were by far the most popular.','Overview không có số liệu chi tiết'],
 ['Egypt’s orange exports increased to 900 thousand tonnes.','Egypt exported 900 thousand tonnes of oranges.','Static chart: không dùng increase / decrease'],
 ['Young people play more games because they have more free time.','(bỏ câu này)','Không nêu ý kiến, nguyên nhân, dự đoán'],
 ['Bài viết dài 130 từ.','Viết khoảng 170–190 từ.','Dưới 150 từ bị trừ điểm Task Achievement']];
$('#errGrid').innerHTML=E6.map((e,i)=>`<button class="flip tall er"><span class="in2"><span class="f"><small>Lỗi ${i+1}</small><span>${e[0]}</span></span><span class="bk"><span>${e[1]}</span><small>${e[2]}</small></span></span></button>`).join('');

STEP.sRes=(s,n,enter)=>{const w=$('#zRes',s),z=Z(w),ch=$('.vg',w);
  if(enter){draw(w,false);ch.classList.remove('showchg')}
  setTimeout(()=>{draw(w,true,n>=2?[0,1]:n>=1?[0]:[]);ch.classList.toggle('showchg',n>=2);tog($$('#resKF>div',s),n);
    const Zs={1:['res:Sydney,Canberra,Melbourne',false],3:['res:Canberra'],4:['res:Darwin'],5:['res:Brisbane'],6:['res:Melbourne,Darwin']}[n];
    setTimeout(()=>{if(Zs)z.show(Zs[0],{zoom:Zs[1]!==false?undefined:false,max:2.2});else z.reset();if(Zs&&Zs[1]===false)z.out()},n<=2?0:200)},enter?80:0);
  if(!enter&&n){n<=2?SFX.grow():n===7?SFX.chime():SFX.ding()}};

/* ---------- student paragraphs ---------- */
const ERR={
 sMP:[
  ['Melbourne had the lowest water level, compared with 40% in Perth','Thiếu số của Melbourne (25%). So sánh mà thiếu một vế số liệu thì coi như chưa so sánh.','Melbourne had the lowest reservoir level, at 25%, followed by Perth at 40%','res:Melbourne,Perth'],
  ['Syden','Tên thành phố có ngay trên biểu đồ: chép đúng chính tả.','Sydney','res:Sydney'],
  ['water levels in reservoirs','Đơn vị là %: mức nước so với sức chứa. Intro nói rõ “the percentage of reservoir capacity”, sau đó gọi gọn.','the highest figure / the figure for Sydney','res:Sydney,Canberra'],
  ['In October 2010, the figure in all cities had risen','SAI SỐ LIỆU: Darwin giảm 45% → 38%, Brisbane đứng yên 55%. Chỉ 4/6 thành phố tăng. “had risen” phải đi với “By October 2010”.','By October 2010, four of the six cities had seen an increase.','res:Darwin,Brisbane','chg'],
  ['Melbourne and Perth surged to 38% and 60%','Thiếu “respectively”; chủ ngữ phải là con số, không phải thành phố.','The figures for Melbourne and Perth surged to 38% and 60% respectively','res:Melbourne,Perth'],
  ['which had the highest figure compared to other 6 cities, reached at approximately 98%','“which” đang trỏ về “growth”; “reach” không đi với “at”; chỉ có 6 thành phố nên là “the other five”.','reaching approximately 98%, the highest figure of all six cities','res:Canberra'],
  ['(thiếu ý)','Bỏ sót Darwin và Brisbane: hai điểm đặc biệt của biểu đồ (một giảm, một đứng yên). Thiếu thì Task Achievement khó qua 5.0.','By contrast, Darwin was the only city to see a decline, from 45% to 38%, whereas Brisbane remained unchanged at 55%.','res:Darwin,Brisbane','chg']],
 sNMo:[
  ['it is obvious that','Không thêm thông tin: bỏ.','Overall, reservoir levels …',''],
  ['the figure for water levels of Melbourne, Perth, Sydney and Canberra','Overview là bức tranh tổng: không liệt kê 4 tên, chỉ nêu tên ngoại lệ. “water levels” lặp.','reservoir levels rose in most cities','res:Melbourne,Perth,Sydney,Canberra','chg'],
  ['was higher than that of 2009','4 thành phố nên “the figures … were”; đang so số liệu với năm.','were higher in October 2010 than in October 2009','res:Sydney,Melbourne,Perth,Canberra'],
  ['In addition','Không sai, nhưng hai ý liên quan nhau: ghép thành một mạch.','(ghép hai câu)',''],
  ['the highest of all among cities during October 2009 to 2010','“of all” và “among cities” trùng nghĩa; “during … to” sai. Năm 2009 Canberra BẰNG Sydney.','Canberra had the highest level by the end of the period','res:Canberra,Sydney'],
  ['that of Melbourne experienced the opposite','“the opposite” mơ hồ; “level” không “experience” được.','Melbourne’s reservoirs were the least full','res:Melbourne'],
  ['(thiếu ý)','Thiếu Brisbane: 4 tăng, 1 giảm, còn thành phố thứ 6? Brisbane giữ nguyên 55%, cũng là ngoại lệ.','… while Brisbane remained stable','res:Brisbane','chg']],
 sNMb:[
  ['The percentage of water levels / the quantity of water levels','Cụm này không có nghĩa; mực nước không đếm bằng “quantity”.','Sydney’s reservoir level · the figure for Melbourne · Perth’s reservoirs','res:Sydney,Perth'],
  ['grew minimally by 5% from 75% in 2009 to October 2010','“from” đi với số liệu, “to” lại đi với thời gian. “minimally” không tự nhiên. Chênh hai mức % là percentage points.','rose slightly from 75% to 80% (5 percentage points)','res:Sydney'],
  ['During that time, that of Melbourne stood at a quarter, and then increased gradually','“stood at” + “then increased” mâu thuẫn. “gradually” không hợp: chỉ 2 mốc, tăng hơn 50%. “a quarter” thì rất hay.','rose considerably from a quarter to just under 40%','res:Melbourne'],
  ['Similarly, there was a significant increase of 20%','Melbourne “gradually” mà Perth “significant” thì không “similarly”. Thiếu số đầu, số cuối 40% → 60%.','Perth recorded a sharp increase of 20 percentage points, from 40% to 60%','res:Perth,Melbourne'],
  ['also the percentage of water levels in Canberra','“also” không nối được hai mệnh đề (comma splice): tách câu.','Most notably, Canberra …','res:Canberra'],
  ['a drastic growth from 75% to almost the highest at 100%','“drastic” mang nghĩa tiêu cực. Thiếu ý: năm 2010 Canberra cao nhất trong 6 thành phố.','a dramatic rise to almost full capacity (around 98%), the highest of all six cities','res:Canberra'],
  ['(chưa so sánh)','Đi Sydney → Melbourne → Perth → Canberra đúng thứ tự cột, tức là đọc lại biểu đồ. Hãy xếp theo mức tăng.','Canberra (+23) → Perth (+20) → Melbourne (+13) → Sydney chỉ +5','','rank']]};
const CRIT={"sMP": ["TA", "LR", "LR", "TA", "C&C", "GRA", "TA"], "sNMo": ["LR", "TA", "GRA", "C&C", "GRA", "LR", "TA"], "sNMb": ["LR", "GRA", "LR", "C&C", "GRA", "LR", "C&C"]};
const RANK=[['Sydney',5],['Melbourne',13],['Perth',20],['Canberra',23]];
Object.keys(ERR).forEach(id=>{const s=$('#'+id);$$('.er',s).forEach(e=>e.dataset.n=+e.dataset.e+1);
  STEP[id]=(s,n,enter)=>{const L=ERR[id],w=$('.zw',s),z=Z(w),box=$('.cmtbox',s),vg=$('.vg',w),rk=$('#rankBox',s);
    $$('.er',s).forEach(e=>e.classList.toggle('on',+e.dataset.e===n-1));
    if(rk)rk.classList.remove('in');vg.classList.remove('showchg');
    if(!n){box.className='cmtbox empty';box.textContent='Bấm một lỗi được gạch đỏ.';z.reset();return}
    const [q,nt,fx,zz,act]=L[n-1];box.className='cmtbox';box.innerHTML=`<span class="crit">${CRIT[id][n-1]}</span><span class="q" data-n="${n}">${q}</span><span class="nt">${nt}</span><button class="b sm fxbtn" data-act="showfix">Cách sửa ▸</button><span class="fx2">${fx}</span>`;
    box.style.animation='none';box.offsetWidth;box.style.animation='';
    if(act==='chg')vg.classList.add('showchg');
    if(act==='rank'&&rk){z.reset();const rl=$('.rl',rk);rl.innerHTML=RANK.map(([k,v],i)=>`<div class="rr" data-r="${k}" style="top:${i*25}%"><b>${k}</b><span class="tr"><i style="--w:${v/23*78}%"></i><em style="--w:${v/23*78}%">+${v}</em></span></div>`).join('');
      rk.classList.add('in');setTimeout(()=>{[...RANK].sort((a,b)=>b[1]-a[1]).forEach(([k],i)=>{$(`[data-r="${k}"]`,rl).style.top=i*25+'%'});SFX.zip()},900)}
    else setTimeout(()=>{if(zz)z.show(zz,{max:2.2});else z.reset()},enter?700:0);
    if(!enter)SFX.buzz()};
  s.addEventListener('click',e=>{const er=e.target.closest('.er');if(er){setStep(s,+er.dataset.e+1)}});
});
document.addEventListener('click',e=>{const b=e.target.closest('[data-act="fix"]');if(!b)return;const s=b.closest('.slide'),p=$('.para',s),on=!p.classList.contains('fixon');
  p.classList.toggle('fixon',on);b.classList.toggle('on',on);on?SFX.chime():SFX.whoosh(false)});

/* ---------- score cards ---------- */
$$('.sc4').forEach(c=>{const v=c.dataset.sc.split(',').map(Number),lab=['TA','GRA','LR','C&C','Band'];
  $('.bars4',c).innerHTML=v.map((x,i)=>`<div class="bb${i===4?' ov':''}"><i style="--h:${x/9*100}%;--d:${i*.15}s"><b>${i===4?x.toFixed(1):x}</b></i><span>${lab[i]}</span></div>`).join('')});
['sMPs','sNMs'].forEach(id=>ENTER[id]=s=>{$$('.sc4',s).forEach(c=>{c.classList.remove('in');c.offsetWidth;setTimeout(()=>c.classList.add('in'),120)});setTimeout(()=>SFX.grow(),150);setTimeout(()=>SFX.ding(),1000)});

STEP.sSurg=(s,n,enter)=>{$('#surgBad',s).classList.toggle('x',n>=1);tog($$('.goods>div',s),n-1);if(!enter&&n)n===1?SFX.thud():SFX.pop(n)};

/* ================= Part 3 ================= */
const QZ=[['South Africa exported 150,000 tonnes more oranges than Egypt.',1,'1,050 − 900 = ?','1,050 − 900 = 150 nghìn tấn.','or:South Africa,Egypt'],
 ['Turkey’s lemon exports were twice those of Argentina.',1,'500 ÷ 250 = ?','500 ÷ 250 = 2.','lem:Turkey,Argentina'],
 ['Mexico exported three times as many lemons as Argentina.',0,'450 ÷ 250 = ?','450 ÷ 250 = 1.8 ⇒ Mexico exported almost twice as many lemons as Argentina.','lem:Mexico,Argentina'],
 ['The United States exported more grapefruits than South Africa.',0,'So sánh hai cột: 250 và ?','Bằng nhau ⇒ The United States and South Africa exported the same amount of grapefruits.','gra:United States,South Africa'],
 ['Egypt’s orange exports increased to 900 thousand tonnes.',0,'Biểu đồ có mấy mốc thời gian?','Chỉ một năm ⇒ Egypt exported 900 thousand tonnes of oranges.','or:Egypt'],
 ['Turkey’s lemon exports exceeded Mexico’s by 50 percent.',0,'50 là phần trăm hay nghìn tấn?','⇒ Turkey’s lemon exports exceeded Mexico’s by 50,000 tonnes.','lem:Turkey,Mexico'],
 ['Mexico’s exports of other citrus fruits were 45 times those of Israel and the United States combined.',1,'450 ÷ (6 + 4) = ?','450 ÷ 10 = 45.','oth:Mexico,Israel,United States'],
 ['Turkey was the only country to appear in two charts.',0,'Đếm xem United States có mặt ở mấy biểu đồ','⇒ The United States was the only country to appear in three charts.','or:United States|gra:United States|oth:United States']];
$('#quiz').innerHTML=QZ.map((q,i)=>`<div class="qz ${q[1]?'T':'F'}" data-q="${i}"><span class="qn2">${i+1}</span><div><div class="st2">${q[0]}</div><div class="hint3">💡 ${q[2]}</div><div class="fix3">${q[1]?'✓ Đúng. ':'✗ Sai. '}${q[3]}</div></div><button class="res" data-rev aria-label="Gợi ý rồi đáp án câu ${i+1}">?</button></div>`).join('');
$('#quiz').addEventListener('click',e=>{const r=e.target.closest('.qz');if(!r)return;const i=+r.dataset.q,w=$('#zQuiz');
  if(e.target.closest('[data-rev]')){const b=$('.res',r);
    if(r.classList.contains('rev')){r.classList.remove('rev','hin');b.textContent='?'}
    else if(r.classList.contains('hin')){r.classList.add('rev');b.textContent=QZ[i][1]?'✓':'✗';QZ[i][1]?SFX.ding():SFX.buzz()}
    else{r.classList.add('hin');b.textContent='!';SFX.pop(3)}}
  $$('.qz').forEach(x=>x.classList.toggle('cur',x===r));Z(w).show(QZ[i][4],{max:2.2})});
ENTER.sQuiz=()=>{$$('.qz').forEach(x=>{x.classList.remove('cur','rev','hin');$('.res',x).textContent='?'})};

const OVP=['or:South Africa','lem:Turkey','oth:Mexico','gra:United States,South Africa'];
STEP.sOvPrac=(s,n,enter)=>{const w=$('#zOvP',s),z=Z(w),rows=$$('#ovpQA>div',s);
  rows.forEach((r,i)=>{r.classList.toggle('in',n>=2*i+1);r.classList.toggle('ans',n>=2*i+2)});
  $('#ovpSkel',s).classList.toggle('in',n===9);$('#ovpSkel',s).style.display=n>=10?'none':'';$('#ovpModel',s).classList.toggle('in',n>=10);
  $$('.hr.lead',w).forEach(e=>e.classList.remove('lead'));
  OVP.forEach((r,i)=>{if(n>=2*i+2)parse(r).forEach(({c,keys})=>keys.forEach(k=>$(`[data-c="${c}"] [data-k="${k}"]`,w).classList.add('lead')))});
  const ci=Math.ceil(n/2)-1;
  setTimeout(()=>{if(n>=1&&n<=8)z.show(n%2?OVP[ci].split(':')[0]:OVP[ci],{max:2});else{z.reset();if(!enter&&n===9)SFX.whoosh(false)}},enter?900:0);
  if(!enter&&n)n===10?SFX.chime():n%2?SFX.pop(2):SFX.ding()};

const BP=[
 ['Body 1 · gom theo độ lớn','Câu chủ đề: nêu tiêu chí gom','Vì sao gom cam + chanh? → lượng xuất khẩu lớn nhất<br><i>___ and ___ were the two categories exported in the largest quantities.</i>','<b class="lk">Oranges and lemons</b> were the two categories exported in the largest quantities.','or|lem'],
 ['','Cặp số 1 · Cam','Ai dẫn đầu, bao nhiêu? Ai theo sau?<br><i>___ led orange exports at ___, followed by ___ (___) and ___ (___).</i>','South Africa led orange exports at 1,050 thousand tonnes, followed by Egypt (900) and the United States (700).','or:South Africa,Egypt,United States'],
 ['','Nối sang cặp số 2 · Chanh','Giống cam (một nước dẫn đầu) nhưng nhỏ hơn → nối bằng <b class="lk">followed a similar pattern, although …</b><br><i>Lemons followed a similar pattern, although ___: ___ ranked first with ___, only slightly ahead of ___ (___).</i>','<b class="lk">Lemons followed a similar pattern, although on a smaller scale</b>: Turkey ranked first with 500 thousand tonnes, only slightly ahead of Mexico (450), while Argentina exported half as much (250).','lem:Turkey,Mexico,Argentina'],
 ['Body 2 · gom theo sự chênh lệch','Câu chủ đề: nêu tiêu chí gom','Bưởi và loại khác giống nhau ở điểm nào? → khoảng cách giữa các nước<br><i>The remaining two categories differed sharply in ___.</i>','<b class="lk">The remaining two categories</b> differed sharply in the gaps between exporters.','gra|oth'],
 ['','Cặp số 3 · Bưởi (ngang nhau)','Hai nước bằng nhau, nước thứ ba không kém xa<br><i>Grapefruit exports were fairly even, with ___ and ___ exporting ___ each and ___ not far behind at ___.</i>','Grapefruit exports were fairly even, with the United States and South Africa exporting 250 thousand tonnes each and Turkey not far behind at 180.','gra:United States,South Africa,Turkey'],
 ['','Nối sang cặp số 4 · Loại khác (đối lập)','Ngược hẳn với bưởi → nối bằng <b class="lk">In stark contrast, …</b> · 450 ÷ (6 + 4) = ?<br><i>In stark contrast, ___ dominated ___, with ___, ___ times the combined exports of ___ and ___.</i>','<b class="lk">In stark contrast</b>, Mexico dominated the market for other citrus fruits, with 450 thousand tonnes, 45 times the combined exports of Israel and the United States.','oth:Mexico,Israel,United States']];
$('#bodyP').innerHTML=`<div class="box lkbox"><span class="lbl2">Từ nối giữa hai cặp số</span><div class="chips"><span class="chp good">Giống: Similarly · followed a similar pattern</span><span class="chp bad">Khác: By contrast · In stark contrast</span></div></div>`+
 BP.map((b,i)=>`${b[0]?`<div class="bph">${b[0]}</div>`:''}<div class="bi" data-z="${b[4]}"><span class="bro">${b[1]}</span><div class="hnt">${b[2]}</div><div class="ful">${b[3]}</div></div>`).join('');
STEP.sBodyPrac=(s,n,enter)=>{const w=$('#zBodyP',s),z=Z(w),it=$$('#bodyP .bi',s);
  it.forEach((b,i)=>{b.classList.toggle('in',n>=2*i+1);b.classList.toggle('done',n>=2*i+2);b.classList.toggle('on',Math.ceil(n/2)-1===i)});
  const cur=it[Math.ceil(n/2)-1];if(cur)setTimeout(()=>cur.scrollIntoView({block:'nearest',behavior:'smooth'}),60);setTimeout(()=>{if(cur)z.show(cur.dataset.z,{max:2.2});else z.reset()},enter?900:0);if(!enter&&n)n%2?SFX.pop(2):SFX.ding()};
$('#bodyP').addEventListener('click',e=>{const b=e.target.closest('.bi.in');if(!b)return;$$('#bodyP .bi').forEach(x=>x.classList.toggle('on',x===b));Z($('#zBodyP')).show(b.dataset.z,{max:2.2})});

STEP.sFull=(s,n,enter)=>{$('#essay',s).classList.toggle('locked',n<1);if(!n){$$('#essay .zs',s).forEach(x=>x.classList.remove('on'));Z($('#zFull',s)).reset()}if(!enter&&n)SFX.chime()};
$('#essay').addEventListener('click',e=>{const p=e.target.closest('.zs');if(!p||$('#essay').classList.contains('locked'))return;
  const on=!p.classList.contains('on');$$('#essay .zs').forEach(x=>x.classList.toggle('on',on&&x===p));const z=Z($('#zFull'));if(on&&p.dataset.z)z.show(p.dataset.z,{max:2.2});else{z.reset();SFX.whoosh(false)}});

STEP.sB2=(s,n,enter)=>{const w=$('#zB2',s),z=Z(w);$('.vg',w).classList.toggle('showchg',n>=1);tog($$('.side>.box.hide',s),n-1);
  setTimeout(()=>{if(n>=1)z.show('res:Darwin,Brisbane',{max:2.2});else z.reset()},enter?900:0);if(!enter&&n)n===3?SFX.chime():SFX.ding()};

STEP.sLinkMap=(s,n,enter)=>{const g=$$('.lrow.gen>*',s);g.forEach((e,i)=>e.classList.toggle('in',n>=Math.floor(i/2)+1));
  $('.lwords',s).classList.toggle('in',n>=5);tog($$('.lrow.ex',s),n-5);if(!enter&&n)n>=5?SFX.chime():SFX.pop(n)};

/* ================= flips, timers, misc ================= */
document.addEventListener('click',e=>{const f=e.target.closest('.flip');if(!f)return;f.classList.toggle('on');SFX.tick()});
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
document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;
  switch(b.dataset.act){case 'step':next();break;
    case 'showfix':{const c=b.closest('.cmtbox');c.classList.add('fxon');SFX.chime();break}
    case 'cmp-full':cFull=!cFull;cmpRender();cFull?SFX.chime():SFX.whoosh(false);break;
    case 'go-band':{const i=DECK.indexOf('sBand');slides[i].dataset.step=6;show(i);SFX.whoosh(false);break}
    case 'cmp-clear':cFull=false;cA=cB=null;cmpRender();SFX.whoosh(false);break;
    case 'flip-all':{const all=$$('.flip',b.closest('.slide')),on=!all.every(f=>f.classList.contains('on'));all.forEach((f,i)=>setTimeout(()=>f.classList.toggle('on',on),i*60));SFX.whoosh();break}}});

SFX.stop();
const m=/^#s(\d+)$/.exec(location.hash);show(m?+m[1]-1:0);
})();
/* ================= AI grader (Claude via the artifact `sample` capability) ================= */
(function(){
const $=(s,r=document)=>r.querySelector(s);
const CTX={
 game:{name:'Game điện tử (pie)',task:'The charts below give information about players of electronic games in South Korea in 2003.',
  data:'Age of players: under 18 = 39%, 18–36 = 38%, above 36 = 23%. Gender: male 72%, female 28%. Types of games they like: action 43%, sports 20%, racing 17%, role-playing 7%, education 7%, others 6%. Static chart: one point in time (2003).'},
 citrus:{name:'Xuất khẩu cam chanh (bar)',task:'The charts below give information about the world’s top three exporters of different fresh citrus fruits in 2012.',
  data:'Exports in thousand metric tons, 2012. Oranges: South Africa 1,050; Egypt 900; United States 700. Lemons: Turkey 500; Mexico 450; Argentina 250. Grapefruits: United States 250; South Africa 250; Turkey 180. Other types of citrus fruits: Mexico 450; Israel 6; United States 4. Static chart: one year only.'},
 res:{name:'Water levels (bar, 2 mốc)',task:'The chart shows the water levels in reservoirs of six cities in Australia in October 2009 and October 2010.',
  data:'Percentage of reservoir capacity, October 2009 → October 2010: Sydney 75 → 80; Melbourne 25 → 38; Perth 40 → 60; Canberra 75 → about 98 (estimated, bar not labelled); Brisbane 55 → 55; Darwin 45 → 38. Two time points, so rose/fell/remained unchanged are acceptable.'}
};
const panel=document.createElement('div');panel.id='grader';panel.hidden=true;
panel.innerHTML=`<div class="gh"><b>Chấm AI</b><select id="gCtx" aria-label="Biểu đồ">${Object.entries(CTX).map(([k,c])=>`<option value="${k}">${c.name}</option>`).join('')}</select><button class="gx" id="gClose" aria-label="Đóng">✕</button></div>
 <textarea id="gIn" placeholder="Nhập câu hoặc đoạn văn của học sinh…" aria-label="Bài của học sinh"></textarea>
 <div class="gb"><button class="gbtn pri" id="gGo">Chấm</button><button class="gbtn" id="gStop" hidden>Dừng</button><button class="gbtn" id="gNew">Câu mới</button><span id="gNote"></span></div>
 <div id="gHist"></div><div id="gOut"></div>`;
document.body.appendChild(panel);
const barBtn=document.createElement('button');barBtn.textContent='Chấm AI (G)';barBtn.id='gOpen';barBtn.hidden=true;
const bar=document.getElementById('bar');bar.insertBefore(barBtn,document.getElementById('fs'));
let sample=null,ctl=null,hist=[];
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const half=v=>{const n=Number(v);return isFinite(n)?Math.max(0,Math.min(9,Math.round(n*2)/2)):null};
function guessCtx(){const s=document.querySelector('.slide.on');const c=s&&s.querySelector('[data-chart]');const k=c&&c.dataset.chart;return k==='citrus'?'citrus':k==='res'?'res':k?'game':null}
function open(on){panel.hidden=!on;barBtn.classList.toggle('on',on);if(on){const g=guessCtx();if(g&&!hist.length)$('#gCtx').value=g;
  const stu=document.querySelector('.slide.on #cmpStu');if(stu&&stu.value.trim()&&!$('#gIn').value.trim())$('#gIn').value=stu.value;$('#gIn').focus()}}
barBtn.onclick=()=>open(panel.hidden);$('#gClose').onclick=()=>open(false);
document.addEventListener('keydown',e=>{if(e.target.closest('input,textarea,select,[contenteditable]'))return;if((e.key==='g'||e.key==='G')&&!e.ctrlKey&&!e.metaKey&&sample){open(panel.hidden);e.preventDefault()}});
$('#gNew').onclick=()=>{ctl&&ctl.abort();hist=[];$('#gIn').value='';$('#gOut').innerHTML='';$('#gHist').innerHTML='';$('#gNote').textContent='';$('#gIn').focus()};
$('#gCtx').onchange=()=>{hist=[];$('#gHist').innerHTML=''};
$('#gStop').onclick=()=>ctl&&ctl.abort();
function prompt(c,text){return `You are an experienced IELTS Writing examiner marking IELTS Academic Writing Task 1 for a Vietnamese learner.
Task: ${c.task}
Chart data: ${c.data}

Student text (it may be a single sentence or one paragraph, not a full essay):
"""${text}"""

Estimate IELTS band scores for this text as a sample of Task 1 writing. Judge only what is present: do not penalise missing introduction, overview or word count when the text is a single sentence or paragraph. Check every figure against the data and flag any wrong number or wrong comparison. Rules to apply: a difference between two percentages is in percentage points; "twice" only when the ratio is close to 2; on a single-point (static) chart do not use increase/decrease; no opinions or causes. Be consistent: the same text must get the same scores.

Reply with only JSON in this shape:
{"band":6.5,"ta":6,"cc":6,"lr":7,"gra":6,"summary":"one short sentence in Vietnamese","issues":[{"quote":"exact words copied from the student text","criterion":"TA|CC|LR|GRA","problem":"short explanation in Vietnamese","hint":"a hint in Vietnamese on how to fix it, WITHOUT writing the corrected sentence"}],"strengths":["short, in Vietnamese"],"better":"one improved English version of the whole text at band 7 or above, keeping the student's ideas"}
Use whole or half bands from 0 to 9. At most 5 issues, most important first. If there are no errors, return an empty issues list.`}
function marked(text,issues){let h=esc(text);issues.forEach((it,i)=>{const q=esc(it.quote||'').trim();if(q.length<2)return;const k=h.indexOf(q);if(k<0)return;
  h=h.slice(0,k)+`<mark class="gm" data-n="${i+1}">${q}</mark>`+h.slice(k+q.length)});return h}
function render(r,text){const crit=[['TA',r.ta],['C&C',r.cc],['LR',r.lr],['GRA',r.gra]];
  const issues=Array.isArray(r.issues)?r.issues.slice(0,5):[];
  $('#gOut').innerHTML=`<div class="gband"><div class="gbig"><span>Band ước tính</span><b>${half(r.band)?.toFixed(1)??'–'}</b></div><div class="gcr">${crit.map(([k,v])=>`<span><i>${k}</i>${half(v)??'–'}</span>`).join('')}</div></div>
   ${r.summary?`<p class="gsum">${esc(r.summary)}</p>`:''}
   <div class="gtext">${marked(text,issues)}</div>
   ${issues.length?`<ol class="giss">${issues.map(it=>`<li><span class="gc">${esc(it.criterion||'')}</span> <b>${esc(it.quote||'')}</b><br>${esc(it.problem||'')}<br><em>💡 ${esc(it.hint||'')}</em></li>`).join('')}</ol>`:'<p class="gok">Không thấy lỗi đáng kể.</p>'}
   ${Array.isArray(r.strengths)&&r.strengths.length?`<p class="gstr">✓ ${r.strengths.slice(0,3).map(esc).join(' · ')}</p>`:''}
   ${r.better?`<button class="gbtn" id="gShow">Xem câu gợi ý 7.0+</button><p class="gbetter" hidden>${esc(r.better)}</p>`:''}`;
  const sb=$('#gShow');if(sb)sb.onclick=()=>{sb.hidden=true;$('.gbetter').hidden=false}}
function renderHist(){$('#gHist').innerHTML=hist.length>1?hist.map((b,i)=>{const d=i?b-hist[i-1]:0;return `<span class="gh1">Lần ${i+1}: <b>${b.toFixed(1)}</b>${i?` <em class="${d>0?'up':d<0?'dn':''}">${d>0?'+':''}${d.toFixed(1)}</em>`:''}</span>`}).join('<span class="ga">→</span>'):''}
const MSG={not_granted:'Chưa cho phép trang dùng Claude.',sampling_disabled:'Tài khoản này không dùng được Claude.',rate_limited:'Chấm quá nhiều lần, đợi một lúc rồi thử lại.',session_expired:'Cần đăng nhập lại claude.ai.',invalid_json:'Kết quả bị lỗi định dạng, bấm Chấm lần nữa.',refused:'Claude không chấm được nội dung này.',prompt_too_large:'Bài quá dài, rút ngắn lại.'};
$('#gGo').onclick=async()=>{const text=$('#gIn').value.trim();if(!text){$('#gIn').focus();return}
  const c=CTX[$('#gCtx').value];ctl&&ctl.abort();ctl=new AbortController();
  $('#gGo').disabled=true;$('#gStop').hidden=false;$('#gNote').textContent='Đang chấm…';$('#gOut').classList.add('busy');
  try{const r=await sample.json(prompt(c,text),{signal:ctl.signal});
    if(!r||typeof r!=='object'||half(r.band)==null)throw{code:'invalid_json'};
    hist.push(half(r.band));renderHist();render(r,text);$('#gNote').textContent='';window.SFX&&SFX.ding()}
  catch(e){const code=e&&e.code;$('#gNote').textContent=code==='cancelled'?'':(MSG[code]||'Có lỗi kết nối, bấm Chấm để thử lại.');
    if(code==='not_granted'||code==='sampling_disabled'){$('#gGo').disabled=true;return}}
  finally{$('#gOut').classList.remove('busy');$('#gStop').hidden=true;if($('#gNote').textContent!=='Chưa cho phép trang dùng Claude.'&&$('#gNote').textContent!=='Tài khoản này không dùng được Claude.')$('#gGo').disabled=false}};
(async()=>{try{if(!window.claude||!claude.use)return;sample=await claude.use('sample');if(sample){barBtn.hidden=false}}catch(e){}})();
})();
