(function(){
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const slides=$$('.slide');let cur=0;
const NS='http://www.w3.org/2000/svg';
function E(tag,at,par){const e=document.createElementNS(NS,tag);for(const k in at)e.setAttribute(k,at[k]);if(par)par.appendChild(e);return e}
function T(par,x,y,txt,at){const t=E('text',Object.assign({x,y},at||{}),par);t.textContent=txt;return t}

/* ================= data (read from the three task charts) ================= */
const LINE={years:[1960,1980,2000,2020],max:25,step:5,unit:'Jobs in millions',series:[
  {k:'man',name:'Manufacturing',c:'#E2622D',v:[15,20,17,13]},
  {k:'ret',name:'Retail',c:'#3B3FB0',v:[6,10,15,16]},
  {k:'agr',name:'Agriculture',c:'#E0A82E',v:[6,3,3,2]},
  {k:'hea',name:'Healthcare',c:'#3E9B4F',v:[2,5,11,16]}]};
const BAR={max:40,years:[2005,1995],colors:{2005:'#F2C14E',1995:'#E2622D'},cats:[
  {k:'oth',name:['Other Goods','and Services'],v:{2005:23,1995:25}},
  {k:'tra',name:['Transport'],v:{2005:19,1995:15}},
  {k:'hou',name:['Housing'],v:{2005:34,1995:28}},
  {k:'foo',name:['Food and Drinks'],v:{2005:24,1995:32}}]};
const PIE={keys:['cartoon','film','news','drama','sport'],names:{cartoon:'Cartoon',film:'Film',news:'News',drama:'Drama',sport:'Sport'},
  colors:{cartoon:'#A3A6EE',film:'#F2C35E',news:'#9ED8B8',drama:'#3A3AA8',sport:'#EE8A4E'},
  groups:[{t:'10–15 years old',v:{cartoon:26,film:19,news:6,drama:23,sport:26}},
          {t:'16–20 years old',v:{cartoon:15,film:23,news:18,drama:30,sport:14}},
          {t:'21–25 years old',v:{cartoon:20,film:21,news:33,drama:22,sport:4}}]};

/* ================= shared overlay helpers ================= */
function tagAt(ov,x,y,txt,fill,anim){const w=txt.length*7.6+18;const g=E('g',{class:'tg2'+(anim?' anim':'')},ov);
  E('rect',{x:x-w/2,y:y-13,width:w,height:26,rx:7,fill},g);T(g,x,y+5,txt,{'text-anchor':'middle'});return g}
function ringAt(ov,x,y,col,anim,r){E('circle',{cx:x,cy:y,r:r||13,stroke:col,class:'ring'+(anim?' anim':'')},ov);if(anim)E('circle',{cx:x,cy:y,r:r||13,stroke:col,class:'pulse'},ov)}

/* ================= line chart ================= */
function LineChart(svg,cfg,o){o=o||{};
  const W=680,H=o.legend===false?352:398,L=58,R=622,TP=16,B=318;
  svg.setAttribute('viewBox',`0 0 ${W} ${H}`);svg.innerHTML='';
  const y0=cfg.years[0],y1=cfg.years[cfg.years.length-1];
  const X=yr=>L+26+(yr-y0)/(y1-y0)*(R-L-52),Y=v=>B-v/cfg.max*(B-TP);
  const ax=E('g',{},svg);
  for(let v=0;v<=cfg.max;v+=cfg.step){E('line',{x1:L,x2:R,y1:Y(v),y2:Y(v),class:'grid'},ax);T(ax,L-10,Y(v)+5,v,{'text-anchor':'end',class:'tk'})}
  cfg.years.forEach(yr=>T(ax,X(yr),B+24,yr,{'text-anchor':'middle',class:'tk'}));
  T(ax,16,(TP+B)/2,cfg.unit,{transform:`rotate(-90 16 ${(TP+B)/2})`,'text-anchor':'middle',class:'ax'});
  const under=E('g',{},svg);const S={};
  cfg.series.forEach(s=>{const g=E('g',{class:'ser'},svg);const pts=s.v.map((v,i)=>[X(cfg.years[i]),Y(v)]);
    const p=E('path',{d:pts.map((q,i)=>(i?'L':'M')+q[0]+' '+q[1]).join(''),stroke:s.c,class:'lnp'},g);
    let len=0;for(let i=1;i<pts.length;i++)len+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);
    const dots=pts.map(q=>E('circle',{cx:q[0],cy:q[1],r:6.5,fill:s.c,class:'dot'},g));S[s.k]={g,p,dots,pts,len,s}});
  if(o.legend!==false){let x=L+10;cfg.series.forEach(s=>{E('line',{x1:x,x2:x+26,y1:H-14,y2:H-14,stroke:s.c,'stroke-width':5,'stroke-linecap':'round'},svg);E('circle',{cx:x+13,cy:H-14,r:5,fill:s.c},svg);
    const t=T(svg,x+34,H-9,s.name,{class:'lg'});x+=34+s.name.length*8.4+24})}
  const ov=E('g',{},svg);
  const api={S,X,Y,ov,under,drawn:false,
    reset(){Object.values(S).forEach(q=>{q.p.style.transition='none';q.p.style.strokeDasharray=q.len;q.p.style.strokeDashoffset=q.len;q.dots.forEach(d=>d.classList.remove('in'))});api.drawn=false;api.clear();api.focus(null)},
    draw(gap){gap=gap==null?.3:gap;api.reset();svg.getBoundingClientRect();
      Object.values(S).forEach((q,i)=>{q.p.style.transition=`stroke-dashoffset 1.3s ease-in-out ${i*gap}s`;q.p.style.strokeDashoffset=0;
        q.dots.forEach((d,j)=>setTimeout(()=>d.classList.add('in'),(i*gap+j/3*1.3)*1000))});api.drawn=true;SFX.whoosh()},
    show(){Object.values(S).forEach(q=>{q.p.style.transition='none';q.p.style.strokeDasharray='none';q.p.style.strokeDashoffset=0;q.dots.forEach(d=>d.classList.add('in'))});api.drawn=true},
    clear(){ov.innerHTML='';under.innerHTML=''},
    focus(keys){Object.entries(S).forEach(([k,q])=>q.g.classList.toggle('dim',!!keys&&!keys.includes(k)))},
    pt(k,i){return S[k].pts[i]},
    mark(k,i,label,anim,dy,dx){const [x,y]=S[k].pts[i];ringAt(ov,x,y,S[k].s.c,anim);if(label)tagAt(ov,x+(dx||0),y+(dy==null?-28:dy),label,S[k].s.c,anim)},
    seg(k,i0,i1,anim){const pts=S[k].pts.slice(i0,i1+1);let L2=0;for(let i=1;i<pts.length;i++)L2+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);
      const p=E('path',{d:pts.map((q,i)=>(i?'L':'M')+q[0]+' '+q[1]).join(''),stroke:S[k].s.c,class:'hseg'+(anim?' anim':'')},under);p.style.setProperty('--L',L2)},
    shade(a,b,label,fill,anim,lv){const g=E('g',{class:anim?'fade':''},under);E('rect',{x:X(a),y:TP,width:X(b)-X(a),height:B-TP,fill,class:'shade'},g);if(label)tagAt(ov,(X(a)+X(b))/2,lv==null?TP+16:Y(lv),label,'#16213A',anim)},
    at(yr,v,label,col,anim,dy){const x=X(yr),y=Y(v);ringAt(ov,x,y,col||'#16213A',anim,18);if(label)tagAt(ov,x,y+(dy||-34),label,col||'#16213A',anim)},
    end(k,txt,anim){const q=S[k],[x,y]=q.pts[q.pts.length-1];tagAt(ov,x+16+txt.length*3.8,y+(o.endDy&&o.endDy[k]||0),txt,q.s.c,anim)}};
  return api}

/* ================= bar chart ================= */
function BarChart(svg,cfg,o){o=o||{};
  const W=640,H=400,L=170,R=o.brackets?548:612,TP=10,B=346,rowH=(B-TP)/cfg.cats.length;
  svg.setAttribute('viewBox',`0 0 ${W} ${H}`);svg.innerHTML='';
  const X=v=>L+v/cfg.max*(R-L);const ax=E('g',{},svg);
  for(let v=0;v<=cfg.max;v+=5){E('line',{x1:X(v),x2:X(v),y1:TP,y2:B,class:'grid'},ax);T(ax,X(v),B+20,v,{'text-anchor':'middle',class:'tk'})}
  E('line',{x1:L,x2:L,y1:TP,y2:B,stroke:'#9AA5B5','stroke-width':1.5},ax);
  const C={};
  cfg.cats.forEach((c,i)=>{const g=E('g',{class:'cat'},svg);g.style.transform=`translate(0px,${TP+i*rowH}px)`;
    c.name.forEach((ln,j)=>T(g,L-12,rowH/2+5+(j-(c.name.length-1)/2)*18,ln,{'text-anchor':'end',class:'cl'}));
    const bars={},vals={};cfg.years.forEach((yr,j)=>{const y=rowH/2-29+j*30;
      bars[yr]=E('rect',{x:L,y,width:X(c.v[yr])-L,height:26,rx:5,fill:cfg.colors[yr],class:'bar'},g);
      vals[yr]=T(g,X(c.v[yr])+7,y+18,c.v[yr]+'%',{class:'bv'})});
    C[c.k]={g,bars,vals,c,i}});
  if(o.legend!==false){let x=L+60;cfg.years.forEach(yr=>{E('rect',{x,y:H-22,width:18,height:16,rx:3,fill:cfg.colors[yr]},svg);T(svg,x+26,H-9,yr,{class:'lg'});x+=110})}
  const ov=E('g',{},svg);
  const api={C,X,ov,rowH,TP,drawn:false,
    reset(){Object.values(C).forEach(q=>{Object.values(q.bars).forEach(b=>{b.style.transition='none';b.classList.remove('in')});Object.values(q.vals).forEach(v=>v.classList.remove('in'))});api.drawn=false;api.clear();api.focus(null);api.order(cfg.cats.map(c=>c.k),true)},
    draw(){api.reset();svg.getBoundingClientRect();Object.values(C).forEach((q,i)=>cfg.years.forEach((yr,j)=>{const b=q.bars[yr];b.style.transition='';b.style.transitionDelay=(i*.15+j*.08)+'s';b.classList.add('in');
      if(o.values!==false){q.vals[yr].style.transitionDelay=(i*.15+.7)+'s';q.vals[yr].classList.add('in')}}));api.drawn=true;SFX.grow()},
    show(){Object.values(C).forEach(q=>cfg.years.forEach(yr=>{q.bars[yr].style.transition='none';q.bars[yr].classList.add('in');if(o.values!==false)q.vals[yr].classList.add('in')}));api.drawn=true},
    clear(){ov.innerHTML=''},
    focus(keys){Object.entries(C).forEach(([k,q])=>q.g.classList.toggle('dim',!!keys&&!keys.includes(k)))},
    order(keys,instant){keys.forEach((k,i)=>{const g=C[k].g;if(instant)g.style.transition='none';g.style.transform=`translate(0px,${TP+i*rowH}px)`;if(instant){g.getBoundingClientRect();g.style.transition=''}C[k].pos=i})},
    end(k,yr){const q=C[k],j=cfg.years.indexOf(yr);return [X(q.c.v[yr]),TP+q.pos*rowH+rowH/2-16+j*30]},
    mark(k,yr,label,anim){const [x,y]=api.end(k,yr);ringAt(ov,x,y,'#16213A',anim,11);if(label)tagAt(ov,x+46,y,label,'#16213A',anim)},
    bracket(p0,p1,label,col,anim){const x=R+18,y0=TP+p0*rowH+12,y1=TP+(p1+1)*rowH-12;const g=E('g',{class:anim?'fade':''},ov);
      E('path',{d:`M${x} ${y0} h10 V${y1} h-10`,stroke:col,class:'brk'},g);T(g,x+16,(y0+y1)/2+5,label,{class:'brt',fill:col})}};
  if(!api.C[cfg.cats[0].k].pos)cfg.cats.forEach((c,i)=>C[c.k].pos=i);
  return api}

/* ================= pie charts ================= */
function PieChart(svg,cfg,o){o=o||{};
  const W=900,H=o.compact?324:340,r=o.compact?84:92,cy=o.compact?160:172,cxs=[150,450,750];
  svg.setAttribute('viewBox',`0 0 ${W} ${H}`);svg.innerHTML='';const P=[];
  cfg.groups.forEach((g,pi)=>{const cx=cxs[pi];T(svg,cx,22,g.t,{'text-anchor':'middle',class:'pt'});
    let a=0;const sl={};cfg.keys.forEach(k=>{const v=g.v[k],a0=a,a1=a+v/100*Math.PI*2;a=a1;const mid=(a0+a1)/2;
      const gg=E('g',{class:'slc'},svg);const path=E('path',{fill:cfg.colors[k],stroke:'#fff','stroke-width':2},gg);
      const lx=cx+Math.sin(mid)*(r+26),ly=cy-Math.cos(mid)*(r+26);
      const lab=E('text',{x:lx,y:ly-3,'text-anchor':Math.sin(mid)>.25?'start':Math.sin(mid)<-.25?'end':'middle',class:'pl'},gg);
      const t1=E('tspan',{},lab);t1.textContent=cfg.names[k];const t2=E('tspan',{x:lx,dy:17,class:'pv'},lab);t2.textContent=v;
      lab.style.opacity=0;lab.style.transition='opacity .4s';
      sl[k]={g:gg,path,a0,a1,mid,lab}});P.push({cx,sl})});
  const ov=E('g',{},svg);let raf=null;
  function paint(p){P.forEach(({cx,sl})=>Object.values(sl).forEach(s=>{const A0=s.a0*p,A1=s.a1*p;if(A1-A0<1e-4){s.path.setAttribute('d','');return}
    const x0=cx+Math.sin(A0)*r,y0=cy-Math.cos(A0)*r,x1=cx+Math.sin(A1)*r,y1=cy-Math.cos(A1)*r;
    s.path.setAttribute('d',`M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 ${A1-A0>Math.PI?1:0} 1 ${x1} ${y1} Z`)}))}
  const api={P,ov,drawn:false,
    reset(){cancelAnimationFrame(raf);paint(0);P.forEach(p=>Object.values(p.sl).forEach(s=>s.lab.style.opacity=0));api.drawn=false;api.clear();api.focus(null)},
    draw(){api.reset();const t0=performance.now();SFX.whoosh();
      const tick=t=>{const k=Math.min(1,(t-t0)/1100),e=1-Math.pow(1-k,3);paint(e);if(k<1)raf=requestAnimationFrame(tick);else P.forEach(p=>Object.values(p.sl).forEach(s=>s.lab.style.opacity=1))};raf=requestAnimationFrame(tick);api.drawn=true},
    show(){paint(1);P.forEach(p=>Object.values(p.sl).forEach(s=>s.lab.style.opacity=1));api.drawn=true},
    clear(){ov.innerHTML=''},
    /* sel: array of [pieIndex,key]; 'all' keys allowed as [null,key] */
    focus(sel){P.forEach((p,pi)=>Object.entries(p.sl).forEach(([k,s])=>{const on=!sel||sel.some(([i,kk])=>(i===null||i===pi)&&kk===k);
      const out=sel&&on?12:0;s.g.style.transform=`translate(${Math.sin(s.mid)*out}px,${-Math.cos(s.mid)*out}px)`;s.g.classList.toggle('dim',!on)}))},
    tag(pi,k,txt,col,anim){const p=P[pi],s=p.sl[k];const x=p.cx+Math.sin(s.mid)*r*.6,y=cy-Math.cos(s.mid)*r*.6;tagAt(ov,x,y,txt,col||'#16213A',anim)},
    label(pi,txt,col,anim){tagAt(ov,P[pi].cx,H-14,txt,col||'#16213A',anim)}};
  return api}

/* ================= navigation ================= */
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
function generic(s,n){$$('[data-s]',s).forEach(e=>e.classList.toggle('in',+e.dataset.s<=n));$$('[data-st]',s).forEach(e=>e.classList.toggle('in',+e.dataset.st<=n));
  $$('.sent',s).forEach(e=>e.classList.toggle('cur',+e.dataset.s===n))}
function setStep(s,n){s.dataset.step=n;generic(s,n);if(STEP[s.id])STEP[s.id](s,n);else if(n)SFX.pop(n)}
function next(){const s=slides[cur],m=+(s.dataset.steps||0);if(m&&stepOf(s)<m){setStep(s,stepOf(s)+1);return}show(cur+1)}
function prev(){const s=slides[cur],m=+(s.dataset.steps||0);if(m&&stepOf(s)>0){setStep(s,stepOf(s)-1);return}show(cur-1)}
$('#prev').onclick=prev;$('#next').onclick=next;
$('#fs').onclick=()=>{const el=document.documentElement;if(document.fullscreenElement){document.exitFullscreen&&document.exitFullscreen().catch(()=>{})}else if(el.requestFullscreen){el.requestFullscreen().catch(()=>{})}};
document.addEventListener('keydown',e=>{if(e.target.closest('input,textarea,select,[contenteditable]'))return;
  if(e.key==='ArrowRight'||e.key==='PageDown'){next();e.preventDefault()}else if(e.key==='ArrowLeft'||e.key==='PageUp'){prev();e.preventDefault()}});

/* run overlays: list of [step, fn(anim)]; previous steps drawn still, current animated */
function marks(ch,n,list){ch.clear();list.forEach(([st,fn])=>{if(st<=n)fn(st===n)})}
/* draw the chart when the slide opens (chart is material, not an answer) */
function onEnter(id,ch,after){const prevE=ENTER[id];ENTER[id]=s=>{prevE&&prevE(s);ch.reset();requestAnimationFrame(()=>{ch.draw();if(after)setTimeout(()=>after(s),1300)})}}
function redo(s){STEP[s.id]&&STEP[s.id](s,stepOf(s))}

/* ---------- 1. dynamic or static ---------- */
const tL=LineChart($('#tLine'),LINE,{legend:false}),tB=BarChart($('#tBar'),BAR,{values:false}),tP=PieChart($('#tPie'),{...PIE,groups:PIE.groups},{compact:true});
STEP.sType=(s,n)=>{if(n===0){tL.reset();tB.reset();tP.reset();return}
  if(!tL.drawn){tL.draw(.15);setTimeout(()=>tB.draw(),350);setTimeout(()=>tP.draw(),700)}
  if(n>=2&&n<=4)SFX.thud();if(n===5)SFX.chime()};

/* ---------- overview formula ---------- */
STEP.sOvF=(s,n)=>{if(n===5)SFX.buzz();else if(n)SFX.pop(n)};
STEP.sName=(s,n)=>{if(n===1)SFX.zip();else if(n)SFX.pop(n)};

/* ---------- dynamic overview ---------- */
const dL=LineChart($('#dynLine'),LINE,{endDy:{ret:-15,hea:15}});
STEP.sDyn=(s,n)=>{if(n===0){dL.reset();return}if(!dL.drawn)dL.draw();
  marks(dL,n,[
    [2,a=>{dL.mark('man',0,null,a);dL.mark('ret',0,null,a);dL.mark('agr',0,null,a);dL.mark('hea',0,null,a);
      dL.end('man','↓',a);dL.end('agr','↓',a);dL.end('ret','↑',a);dL.end('hea','↑',a)}],
    [4,a=>{dL.at(2010,16.2,'vượt nhau','#16213A',a,-40);dL.shade(1980,2020,'luôn thấp nhất','#FBEFCF',a,0.9)}]]);
  dL.focus(n===4||n===5?null:null);
  if(n===1)0;else if(n===2)SFX.ding();else if(n===4)SFX.thud();else if(n)SFX.pop(n)};

/* ---------- static overview ---------- */
const sP=PieChart($('#statPie'),PIE);
STEP.sStat=(s,n)=>{if(n===0){sP.reset();return}if(!sP.drawn)sP.draw();sP.clear();
  if(n===2||n===3){sP.focus([[0,'sport'],[0,'cartoon'],[1,'drama'],[2,'news']]);sP.label(0,'cao nhất: Sport, Cartoon','#18794E',n===2);sP.label(1,'cao nhất: Drama','#18794E',n===2);sP.label(2,'cao nhất: News','#18794E',n===2)}
  else if(n>=4){sP.focus([[0,'news'],[1,'sport'],[2,'sport']]);sP.label(0,'thấp nhất: News','#B42318',n===4);sP.label(1,'thấp nhất: Sport','#B42318',n===4);sP.label(2,'thấp nhất: Sport','#B42318',n===4)}
  else sP.focus(null);
  if(n===2||n===4)SFX.ding();else if(n>1)SFX.pop(n)};

/* ---------- numbers ---------- */
$$('.frac svg').forEach(sv=>{sv.setAttribute('viewBox','0 0 100 100');E('circle',{cx:50,cy:50,r:42,fill:'#E4E9F0'},sv);const p=E('path',{fill:sv.dataset.c},sv);sv._p=p});
function fracPaint(sv,k){const a=+sv.dataset.pct/100*Math.PI*2*k;if(a<.001){sv._p.setAttribute('d','');return}const x=50+Math.sin(a)*42,y=50-Math.cos(a)*42;
  sv._p.setAttribute('d',`M50 50 L50 8 A42 42 0 ${a>Math.PI?1:0} 1 ${x} ${y}Z`)}
function fracAnim(sv){const t0=performance.now();const f=t=>{const k=Math.min(1,(t-t0)/700);fracPaint(sv,1-Math.pow(1-k,3));if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)}
const nL=LineChart($('#numLine'),{...LINE,series:[LINE.series[0],LINE.series[2]]});
onEnter('sNum',nL,s=>redo(s));
STEP.sNum=(s,n)=>{const fs=$$('.frac svg',s);fs.forEach((sv,i)=>{if(i<n){if(i===n-1)fracAnim(sv);else fracPaint(sv,1)}else fracPaint(sv,0)});
  if(!nL.drawn)return;
  marks(nL,n,[[5,a=>nL.mark('man',0,'at 15',a,-28)],[6,a=>{nL.seg('man',0,1,a);nL.mark('man',1,'to 20',a,-28)}],
    [7,a=>{const [x,y]=nL.pt('man',1),y0=nL.Y(15),bx=x+26;const g=E('g',{class:a?'fade':''},nL.ov);
      E('line',{x1:nL.pt('man',0)[0],x2:bx,y1:y0,y2:y0,stroke:'#16213A','stroke-dasharray':'4 4','stroke-width':1.5},g);
      E('path',{d:`M${bx-8} ${y} H${bx} V${y0} H${bx-8}`,stroke:'#16213A',class:'brk'},g);T(g,bx+8,(y+y0)/2+5,'a rise of 5',{class:'brt',fill:'#16213A'})}],
    [8,a=>{nL.seg('man',1,3,a);nL.mark('man',3,'by 2020: had fallen to 13',a,32,-70)}]]);
  if(n&&n<=4)SFX.pop(n);else if(n)SFX.ding()};

/* ---------- practice charts ---------- */
const p1=BarChart($('#p1Bar'),BAR);onEnter('sP1',p1);
const p4b=BarChart($('#p4Bar'),BAR,{legend:true});onEnter('sP4',p4b,()=>p4b.focus(['oth','tra']));
const p4p=PieChart($('#p4Pie'),PIE,{compact:true});
ENTER.sP4=(prevP4=>s=>{prevP4(s);p4p.reset();requestAnimationFrame(()=>{p4p.draw();setTimeout(()=>p4p.focus([[null,'drama'],[null,'film'],[null,'cartoon']]),1300)})})(ENTER.sP4);

/* ---------- process ---------- */
const prL=LineChart($('#procLine'),LINE,{endDy:{ret:-15,hea:15}});
STEP.sProc=(s,n)=>{$$('#procList li').forEach((li,i)=>{li.classList.toggle('done',i<n-1);li.classList.toggle('cur',i===n-1)});
  if(n===0){prL.reset();return}if(!prL.drawn)prL.draw(.15);
  prL.focus(n===4?null:null);
  marks(prL,n,[
    [1,a=>{if(n!==1)return;prL.mark('man',1,'manufacturing jobs',a);prL.mark('ret',1,'retail employment',a,28);prL.mark('hea',2,'jobs in healthcare',a,28);prL.mark('agr',2,'agricultural jobs',a,24)}],
    [2,a=>{if(n!==2)return;prL.end('man','↓',a);prL.end('agr','↓',a);prL.end('ret','↑',a);prL.end('hea','↑',a)}],
    [3,a=>{if(n!==3)return;prL.mark('man',1,'cao nhất',a);prL.at(2010,16.2,'vượt nhau','#16213A',a,-40);prL.mark('agr',3,'thấp nhất',a,26)}],
    [4,a=>{if(n<4)return;prL.seg('man',0,3,a);prL.seg('agr',0,3,a);prL.shade(1960,2020,n===4?'Body 1 ↓ · Body 2 ↑':'',n===4?'#F4F6F8':'#fff',a)}]]);
  if(n>=4){prL.focus(null)}
  if(n)SFX.pop(n)};

/* ---------- 3 parts ---------- */
STEP.sSent=(s,n)=>{$$('.flyin',s).forEach(f=>f.classList.toggle('in',n>=+f.dataset.fly));if(n===2)SFX.zip();else if(n===1)SFX.buzz();else if(n)SFX.pop(n)};

/* ---------- horizontal / vertical sweep ---------- */
let hvT=[];
function hvSweep(mode){hvT.forEach(clearTimeout);hvT=[];const rows=$$('#dg tr').slice(1);const cells=rows.map(r=>$$('td',r));
  cells.flat().forEach(c=>c.className='');
  if(mode===1)rows.forEach((r,i)=>cells[i].forEach((c,j)=>hvT.push(setTimeout(()=>{c.className='h1';SFX.tick();hvT.push(setTimeout(()=>c.className='kept1',380))},(i*5+j)*160+i*350))));
  if(mode===2)cells[0].forEach((_,j)=>cells.forEach((row,i)=>{const c=row[j];hvT.push(setTimeout(()=>{c.className='h2';SFX.tick();hvT.push(setTimeout(()=>c.className='kept2',380))},(j*3+i)*200+j*300))}))}
STEP.sHV=(s,n)=>{if(n===1)hvSweep(1);else if(n===2)hvSweep(2);else if(n===0)hvSweep(0);else{SFX.pop(3)}};
LEAVE.push(()=>{hvT.forEach(clearTimeout)});

/* ---------- line grouping ---------- */
const gL=LineChart($('#lgLine'),LINE);onEnter('sLineG',gL,s=>redo(s));
STEP.sLineG=(s,n)=>{if(!gL.drawn)return;gL.clear();
  if(n===1){gL.focus(['man','agr']);gL.seg('man',0,3,true);gL.seg('agr',0,3,true)}
  else if(n===2){gL.focus(['ret','hea']);gL.seg('ret',0,3,true);gL.seg('hea',0,3,true)}
  else if(n>=3){gL.focus(null);gL.shade(1960,2000,'Body 1','#E3ECFC',n===3);if(n>=4){gL.shade(2000,2020,'Body 2','#FCEBDD',n===4);gL.at(2010,16.2,null,'#16213A',n===4)}}
  else gL.focus(null);
  if(n)SFX.whoosh(n%2===1)};

/* ---------- linking ---------- */
const kL=LineChart($('#linkLine'),{...LINE,series:[LINE.series[0],LINE.series[2]]},{legend:true});onEnter('sLink',kL,s=>redo(s));
const LK={1:[[0,1],[1,3]],2:[[0,1],[1,3]],3:[[0,1],[1,2]],4:[[1,1],[1,3]],5:[],6:[[1,3]],7:[[1,3]]};
STEP.sLink=(s,n)=>{$$('tr[data-s]',s).forEach(r=>r.style.opacity=+r.dataset.s<n?.45:'');if(!kL.drawn)return;kL.clear();
  if(n===8){kL.focus(['agr']);kL.seg('agr',1,2,true);kL.seg('agr',2,3,true);kL.mark('agr',2,'stable',true,-28);kL.mark('agr',3,'dipping',true,-28)}
  else if(n>=1){kL.focus(['man']);(LK[n]||[]).forEach(([a,b])=>a===b?kL.mark('man',a,'peak',true):kL.seg('man',a,b,true));
    if(n===5)kL.mark('man',3,'by 2020',true,30);if(n===7)kL.mark('man',3,'ending at 13',true,30);if(n===1||n===2)kL.mark('man',1,null,true)}
  else kL.focus(null);
  if(n)SFX.pop(n)};

/* ---------- body slides ---------- */
const B1=LineChart($('#b1Line'),LINE);onEnter('sLB1',B1,s=>redo(s));
STEP.sLB1=(s,n)=>{if(!B1.drawn)return;B1.clear();B1.focus(n?['man','agr']:null);
  ({1:()=>{B1.mark('man',0,'15 · largest',true)},
    2:()=>{B1.seg('man',0,1,true);B1.seg('man',1,3,true);B1.mark('man',1,'peak 20',true);B1.mark('man',3,'13 · 3rd',true,30)},
    3:()=>{B1.focus(['agr','ret']);B1.mark('agr',0,'6 = retail',true,-30,40);B1.seg('agr',0,1,true);B1.mark('agr',1,'3',true,-26)},
    4:()=>{B1.seg('agr',1,2,true);B1.seg('agr',2,3,true);B1.mark('agr',3,'2 · lowest',true,-28)}}[n]||(()=>{}))();
  if(n)SFX.pop(n)};
const B2=LineChart($('#b2Line'),LINE);onEnter('sLB2',B2,s=>redo(s));
STEP.sLB2=(s,n)=>{if(!B2.drawn)return;B2.clear();B2.focus(n?['ret','hea']:null);
  ({1:()=>{B2.mark('ret',0,'6',true,-26);B2.mark('hea',0,'2',true,26);tagAt(B2.ov,B2.pt('ret',0)[0]+70,B2.pt('ret',0)[1]+18,'×3','#16213A',true)},
    2:()=>{B2.seg('ret',0,2,true);B2.seg('ret',2,3,true);B2.mark('ret',2,'15',true,-28);B2.mark('ret',3,'16',true,-28)},
    3:()=>{B2.seg('hea',0,1,true);B2.seg('hea',1,2,true);B2.mark('hea',1,'×2.5',true,28);B2.mark('hea',2,'×2.2 → 11',true,28)},
    4:()=>{B2.focus(['ret','hea','man']);B2.seg('hea',2,3,true);B2.mark('hea',3,'16 = retail',true,-30,-50);B2.at(2015,14.3,null,'#16213A',true)}}[n]||(()=>{}))();
  if(n)SFX.pop(n)};

/* ---------- bar grouping ---------- */
const gB=BarChart($('#bgBar'),BAR,{brackets:true});onEnter('sBarG',gB,s=>redo(s));
STEP.sBarG=(s,n)=>{if(!gB.drawn)return;gB.clear();gB.focus(null);
  if(n===1){gB.order(['hou','tra','foo','oth']);setTimeout(()=>{gB.bracket(0,1,'↑ B1','#1F5FD6',true);gB.bracket(2,3,'↓ B2','#C25E0C',true)},700);SFX.whoosh()}
  else if(n>=2){gB.order(['foo','hou','oth','tra']);setTimeout(()=>{if(stepOf(s)<2)return;gB.clear();gB.bracket(0,1,'B1','#1F5FD6',true);if(stepOf(s)>=3)gB.bracket(2,3,'B2','#C25E0C',true);if(stepOf(s)===2)gB.focus(['foo','hou'])},n===2?700:0);if(n===2)SFX.whoosh();else SFX.pop(n)}
  else gB.order(BAR.cats.map(c=>c.k))};
const bB=BarChart($('#bb1Bar'),BAR);onEnter('sBB1',bB,s=>redo(s));
STEP.sBB1=(s,n)=>{if(!bB.drawn)return;bB.clear();bB.order(['foo','hou','oth','tra'],n===0?false:false);bB.focus(n?['foo','hou']:null);
  setTimeout(()=>{if(stepOf(s)!==n)return;bB.clear();
    ({1:()=>{bB.mark('foo',1995,'#1',true);bB.mark('hou',1995,'#2',true)},
      2:()=>{tagAt(bB.ov,560,bB.TP+bB.rowH*.5,'↓','#C25E0C',true);tagAt(bB.ov,560,bB.TP+bB.rowH*1.5,'↑','#1F5FD6',true)},
      3:()=>{bB.mark('hou',2005,'+6 → #1',true)},
      4:()=>{bB.mark('foo',2005,'24 · #2',true)}}[n]||(()=>{}))()},n===1?750:50);
  if(n)SFX.pop(n)};

/* ---------- pie grouping + body ---------- */
const gP=PieChart($('#pgPie'),PIE,{compact:true});onEnter('sPieG',gP,s=>redo(s));
STEP.sPieG=(s,n)=>{if(!gP.drawn)return;gP.clear();
  if(n===1){gP.focus(PIE.keys.map(k=>[0,k]));gP.label(0,'Body 1','#1F5FD6',true)}
  else if(n===2){gP.focus(PIE.keys.flatMap(k=>[[1,k],[2,k]]));gP.label(1,'Body 2','#C25E0C',true);gP.label(2,'Body 2','#C25E0C',true)}
  else if(n===3){gP.focus([[null,'sport'],[null,'news']]);[0,1,2].forEach(i=>gP.label(i,'Body 1: Sport + News','#1F5FD6',true))}
  else if(n===4){gP.focus([[null,'drama'],[null,'film'],[null,'cartoon']]);[0,1,2].forEach(i=>gP.label(i,'Body 2: Drama, Film, Cartoon','#C25E0C',true))}
  else gP.focus(null);
  if(n)SFX.whoosh()};
const bP=PieChart($('#pbPie'),PIE,{compact:true});onEnter('sPB1',bP,s=>redo(s));
STEP.sPB1=(s,n)=>{if(!bP.drawn)return;bP.clear();
  ({1:()=>{bP.focus([[0,'sport'],[0,'cartoon']]);bP.label(0,'Sport = Cartoon = 26','#16213A',true)},
    2:()=>{bP.focus([[1,'sport'],[2,'sport']]);bP.label(1,'Sport 14 ≈ ½','#16213A',true);bP.label(2,'Sport 4 · lowest','#B42318',true)},
    3:()=>{bP.focus([[0,'news'],[1,'news']]);bP.label(0,'News 6','#16213A',true);bP.label(1,'News 18','#16213A',true)},
    4:()=>{bP.focus([[2,'news'],[0,'news']]);bP.label(2,'News 33 · highest','#18794E',true);bP.label(0,'6 × 5.5','#16213A',true)}}[n]||(()=>bP.focus(null)))();
  if(n)SFX.pop(n)};

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

/* ---------- clicks ---------- */
document.addEventListener('click',e=>{
  const fc=e.target.closest('.fc');if(fc){fc.classList.toggle('on');SFX.tick();return}
  const op=e.target.closest('.choice');if(op){$$('.choice',op.parentNode).forEach(x=>x.classList.toggle('pick',x===op&&!x.classList.contains('pick')));SFX.tick();return}
  const fx=e.target.closest('.fix');if(fx){fx.classList.toggle('on');fx.classList.contains('on')?SFX.ding():SFX.tick();return}
  const gp=e.target.closest('.blank');if(gp){gp.classList.toggle('on');syncBank();gp.classList.contains('on')?SFX.ding():SFX.tick();return}
  const hb=e.target.closest('.hb');if(hb){const s=hb.closest('.slide');hb.classList.toggle('on');s.classList.toggle('h'+hb.dataset.hl,hb.classList.contains('on'));SFX.tick();return}
  const b=e.target.closest('[data-act]');if(!b)return;const s=b.closest('.slide');
  switch(b.dataset.act){
    case 'step':next();break;
    case 'flip-all':{const all=$$('.fc',s),on=!all.every(f=>f.classList.contains('on'));all.forEach((f,i)=>setTimeout(()=>f.classList.toggle('on',on),i*45));SFX.whoosh();break}
    case 'reveal':{s.classList.toggle('rv');b.classList.toggle('on');if(s.classList.contains('rv'))SFX.chime();break}
    case 'hl':{s.classList.toggle('hlon');b.classList.toggle('on');SFX.tick();break}
    case 'gaps-all':{const g=$$('.blank',s),on=!g.every(x=>x.classList.contains('on'));g.forEach((x,i)=>setTimeout(()=>{x.classList.toggle('on',on);syncBank()},i*120));SFX.chime();break}
    case 'show':{const m=$('#'+b.dataset.t);m.hidden=!m.hidden;b.classList.toggle('on',!m.hidden);if(!m.hidden)SFX.chime();break}}});
function syncBank(){const used=$$('.blank.on').map(g=>g.textContent.trim());$$('#bank span').forEach(sp=>sp.classList.toggle('used',used.includes(sp.textContent.trim())))}

$$('.fc .bk').forEach(b=>b.innerHTML='<span>'+b.innerHTML+'</span>');
slides.forEach(s=>{if(+s.dataset.steps)generic(s,0)});
Object.keys(STEP).forEach(id=>{const s=$('#'+id);if(s&&!ENTER[id])STEP[id](s,0)});
SFX.stop();
const m=/^#s(\d+)$/.exec(location.hash);show(m?+m[1]-1:0);
})();
