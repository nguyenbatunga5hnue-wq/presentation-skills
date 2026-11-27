(function(){
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const slides=$$('.slide');let cur=0;
const NS='http://www.w3.org/2000/svg';
function E(tag,at,par){const e=document.createElementNS(NS,tag);for(const k in at)e.setAttribute(k,at[k]);if(par)par.appendChild(e);return e}
function T(par,x,y,txt,at){const t=E('text',Object.assign({x,y},at||{}),par);t.textContent=txt;return t}

/* ================= data (read from the task charts and the theory doc) ================= */
const LINE={years:[1960,1980,2000,2020],max:25,step:5,unit:'Jobs in millions',series:[
  {k:'man',name:'Manufacturing',c:'#E2622D',v:[15,20,17,13]},
  {k:'ret',name:'Retail',c:'#3B3FB0',v:[6,10,15,16]},
  {k:'agr',name:'Agriculture',c:'#E0A82E',v:[6,3,3,2]},
  {k:'hea',name:'Healthcare',c:'#3E9B4F',v:[2,5,11,16]}]};
const LINE2={...LINE,series:[LINE.series[0],LINE.series[2]]};
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
const WATER={cap:'The use of water by four different countries (%)',cols:['Domestic use','Industry','Agriculture'],
  rows:[['Egypt',[8,10,82]],['Saudi Arabia',[6,30,64]],['New Zealand',[10,46,44]],['Canada',[20,70,10]]]};

/* ================= svg zoom (animated viewBox) ================= */
function fitBox(b,F){let [x,y,w,h]=b;const ar=F[2]/F[3];if(w/h>ar){const nh=w/ar;y-=(nh-h)/2;h=nh}else{const nw=h*ar;x-=(nw-w)/2;w=nw}return [x,y,w,h]}
function svgZoom(svg,box,dur){const F=svg._full,to=box?fitBox(box,F):F;cancelAnimationFrame(svg._raf);
  const vb=svg.viewBox.baseVal,from=[vb.x,vb.y,vb.width,vb.height];svg._z=!!box;
  const cb=svg.closest('.cbox');if(cb)cb.classList.toggle('zin',!!box);
  if(dur===0){svg.setAttribute('viewBox',to.join(' '));return}
  const t0=performance.now(),D=dur||850;
  const f=t=>{const k=Math.min(1,(t-t0)/D),e=k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;svg.setAttribute('viewBox',from.map((v,i)=>v+(to[i]-v)*e).join(' '));if(k<1)svg._raf=requestAnimationFrame(f)};
  svg._raf=requestAnimationFrame(f)}
function setFull(svg,W,H){svg._full=[0,0,W,H];svg.setAttribute('viewBox',`0 0 ${W} ${H}`)}

/* ================= overlay helpers ================= */
function tagAt(ov,x,y,txt,fill,anim){const w=txt.length*8+20;const g=E('g',{class:'tg2'+(anim?' anim':'')},ov);
  E('rect',{x:x-w/2,y:y-14,width:w,height:28,rx:8,fill},g);T(g,x,y+5,txt,{'text-anchor':'middle'});return g}
function ringAt(ov,x,y,col,anim,r){E('circle',{cx:x,cy:y,r:r||13,stroke:col,class:'ring'+(anim?' anim':'')},ov);if(anim)E('circle',{cx:x,cy:y,r:r||13,stroke:col,class:'pulse'},ov)}

/* ================= line chart ================= */
function LineChart(svg,cfg,o){o=o||{};
  const W=680,H=398,L=58,R=622,TP=16,B=318;setFull(svg,W,H);svg.innerHTML='';
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
  let lx=L+10;cfg.series.forEach(s=>{E('line',{x1:lx,x2:lx+26,y1:H-14,y2:H-14,stroke:s.c,'stroke-width':5,'stroke-linecap':'round'},svg);E('circle',{cx:lx+13,cy:H-14,r:5,fill:s.c},svg);
    T(svg,lx+34,H-9,s.name,{class:'lg'});S[s.k].lx=lx;lx+=34+s.name.length*8.8+24});
  const ov=E('g',{},svg);
  const api={svg,S,X,Y,ov,drawn:false,
    reset(){Object.values(S).forEach(q=>{q.p.style.transition='none';q.p.style.strokeDasharray=q.len;q.p.style.strokeDashoffset=q.len;q.dots.forEach(d=>d.classList.remove('in'))});api.drawn=false;api.clear();api.focus(null);svgZoom(svg,null,0)},
    draw(){api.reset();svg.getBoundingClientRect();
      Object.values(S).forEach((q,i)=>{q.p.style.transition=`stroke-dashoffset 1.3s ease-in-out ${i*.25}s`;q.p.style.strokeDashoffset=0;
        q.dots.forEach((d,j)=>setTimeout(()=>d.classList.add('in'),(i*.25+j/3*1.3)*1000))});api.drawn=true;SFX.whoosh()},
    clear(){ov.innerHTML='';under.innerHTML=''},
    focus(keys){Object.entries(S).forEach(([k,q])=>q.g.classList.toggle('dim',!!keys&&!keys.includes(k)))},
    pt(k,i){return S[k].pts[i]},
    mark(k,i,label,dy,dx){const [x,y]=S[k].pts[i];ringAt(ov,x,y,S[k].s.c,true);if(label)tagAt(ov,x+(dx||0),y+(dy==null?-30:dy),label,S[k].s.c,true)},
    seg(k,i0,i1){const pts=S[k].pts.slice(i0,i1+1);let L2=0;for(let i=1;i<pts.length;i++)L2+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);
      const p=E('path',{d:pts.map((q,i)=>(i?'L':'M')+q[0]+' '+q[1]).join(''),stroke:S[k].s.c,class:'hseg anim'},under);p.style.setProperty('--L',L2)},
    shade(a,b,fill){E('rect',{x:X(a),y:TP,width:X(b)-X(a),height:B-TP,fill,class:'shade fade'},under)},
    at(yr,v,label,col,dy){const x=X(yr),y=Y(v);ringAt(ov,x,y,col||'#16213A',true,18);if(label)tagAt(ov,x,y+(dy||-36),label,col||'#16213A',true)},
    end(k,txt,dy){const q=S[k],[x,y]=q.pts[q.pts.length-1];tagAt(ov,x+22,y+(dy||0),txt,q.s.c,true)},
    /* zoom boxes in data units */
    zb(ya,yb,va,vb,pad){pad=pad==null?34:pad;return [X(ya)-pad,Y(vb)-pad,X(yb)-X(ya)+2*pad,Y(va)-Y(vb)+2*pad]},
    zoom(box){svgZoom(svg,box)},
    xaxis(){return [L,B-10,R-L,40]}, yaxis(){return [0,TP,L+30,B-TP]}, legend(k){return [S[k].lx-10,H-34,S[k].s.name.length*8.8+60,34]}};
  return api}

/* ================= bar chart ================= */
function BarChart(svg,cfg,o){o=o||{};
  const W=680,H=400,L=170,R=o.brackets?560:620,TP=10,B=346,rowH=(B-TP)/cfg.cats.length;setFull(svg,W,H);svg.innerHTML='';
  const X=v=>L+v/cfg.max*(R-L);const ax=E('g',{},svg);
  for(let v=0;v<=cfg.max;v+=5){E('line',{x1:X(v),x2:X(v),y1:TP,y2:B,class:'grid'},ax);T(ax,X(v),B+20,v,{'text-anchor':'middle',class:'tk'})}
  E('line',{x1:L,x2:L,y1:TP,y2:B,stroke:'#9AA5B5','stroke-width':1.5},ax);
  const C={};
  cfg.cats.forEach((c,i)=>{const g=E('g',{class:'cat'},svg);
    c.name.forEach((ln,j)=>T(g,L-12,rowH/2+5+(j-(c.name.length-1)/2)*18,ln,{'text-anchor':'end',class:'cl'}));
    const bars={},vals={};cfg.years.forEach((yr,j)=>{const y=rowH/2-29+j*30;
      bars[yr]=E('rect',{x:L,y,width:X(c.v[yr])-L,height:26,rx:5,fill:cfg.colors[yr],class:'bar'},g);
      vals[yr]=T(g,X(c.v[yr])+7,y+19,c.v[yr]+'%',{class:'bv'})});
    C[c.k]={g,bars,vals,c,pos:i}});
  let x=L+60;cfg.years.forEach(yr=>{E('rect',{x,y:H-22,width:18,height:16,rx:3,fill:cfg.colors[yr]},svg);T(svg,x+26,H-8,yr,{class:'lg'});x+=110});
  const ov=E('g',{},svg);
  const api={svg,C,X,ov,rowH,TP,drawn:false,
    reset(){Object.values(C).forEach(q=>{Object.values(q.bars).forEach(b=>{b.style.transition='none';b.classList.remove('in')});Object.values(q.vals).forEach(v=>v.classList.remove('in'))});
      api.drawn=false;api.clear();api.focus(null);api.order(cfg.cats.map(c=>c.k),true);svgZoom(svg,null,0)},
    draw(){api.reset();svg.getBoundingClientRect();Object.values(C).forEach((q,i)=>cfg.years.forEach((yr,j)=>{const b=q.bars[yr];b.style.transition='';b.style.transitionDelay=(i*.15+j*.08)+'s';b.classList.add('in');
      q.vals[yr].style.transitionDelay=(i*.15+.7)+'s';q.vals[yr].classList.add('in')}));api.drawn=true;SFX.grow()},
    clear(){ov.innerHTML=''},
    focus(keys){Object.entries(C).forEach(([k,q])=>q.g.classList.toggle('dim',!!keys&&!keys.includes(k)))},
    order(keys,instant){keys.forEach((k,i)=>{const g=C[k].g;if(instant)g.style.transition='none';g.style.transform=`translate(0px,${TP+i*rowH}px)`;if(instant){g.getBoundingClientRect();g.style.transition=''}C[k].pos=i})},
    end(k,yr){const q=C[k],j=cfg.years.indexOf(yr);return [X(q.c.v[yr]),TP+q.pos*rowH+rowH/2-16+j*30]},
    mark(k,yr,label){const [x,y]=api.end(k,yr);ringAt(ov,x,y,'#16213A',true,11);if(label)tagAt(ov,x+12+label.length*4,y-22,label,'#16213A',true)},
    bracket(p0,p1,label,col){const x=R+40,y0=TP+p0*rowH+12,y1=TP+(p1+1)*rowH-12;const g=E('g',{class:'fade'},ov);
      E('path',{d:`M${x} ${y0} h10 V${y1} h-10`,stroke:col,class:'brk'},g);T(g,x+16,(y0+y1)/2+5,label,{class:'brt',fill:col})},
    zc(keys){const ps=keys.map(k=>C[k].pos),a=Math.min(...ps),b=Math.max(...ps);const mx=Math.max(...keys.flatMap(k=>cfg.years.map(y=>C[k].c.v[y])));
      return [L-165,TP+a*rowH-8,X(mx)-L+235,(b-a+1)*rowH+16]},
    zoom(box){svgZoom(svg,box)}};
  api.order(cfg.cats.map(c=>c.k),true);
  return api}

/* ================= pie charts ================= */
function PieChart(svg,cfg,o){o=o||{};
  const tri=!!o.tri,W=tri?620:900,H=tri?600:330,r=92,cxs=tri?[160,460,310]:[150,450,750],cys=tri?[168,168,452]:[172,172,172];
  setFull(svg,W,H);svg.innerHTML='';const P=[];
  cfg.groups.forEach((g,pi)=>{const cx=cxs[pi],cy=cys[pi];T(svg,cx,cy-148,g.t,{'text-anchor':'middle',class:'pt'});
    let a=0;const sl={};cfg.keys.forEach(k=>{const v=g.v[k],a0=a,a1=a+v/100*Math.PI*2;a=a1;const mid=(a0+a1)/2;
      const gg=E('g',{class:'slc'},svg);const path=E('path',{fill:cfg.colors[k],stroke:'#fff','stroke-width':2},gg);
      const lx=cx+Math.sin(mid)*(r+26),ly=cy-Math.cos(mid)*(r+26);
      const lab=E('text',{x:lx,y:ly-3,'text-anchor':Math.sin(mid)>.25?'start':Math.sin(mid)<-.25?'end':'middle',class:'pl'},gg);
      const t1=E('tspan',{},lab);t1.textContent=cfg.names[k];const t2=E('tspan',{x:lx,dy:17,class:'pv'},lab);t2.textContent=v;
      lab.style.opacity=0;lab.style.transition='opacity .4s';sl[k]={g:gg,path,a0,a1,mid,lab}});P.push({cx,cy,sl})});
  const ov=E('g',{},svg);let raf=null;
  function paint(p){P.forEach(({cx,cy,sl})=>Object.values(sl).forEach(s=>{const A0=s.a0*p,A1=s.a1*p;if(A1-A0<1e-4){s.path.setAttribute('d','');return}
    const x0=cx+Math.sin(A0)*r,y0=cy-Math.cos(A0)*r,x1=cx+Math.sin(A1)*r,y1=cy-Math.cos(A1)*r;
    s.path.setAttribute('d',`M${cx} ${cy} L${x0} ${y0} A${r} ${r} 0 ${A1-A0>Math.PI?1:0} 1 ${x1} ${y1} Z`)}))}
  const api={svg,P,ov,drawn:false,
    reset(){cancelAnimationFrame(raf);paint(0);P.forEach(p=>Object.values(p.sl).forEach(s=>s.lab.style.opacity=0));api.drawn=false;api.clear();api.focus(null);svgZoom(svg,null,0)},
    draw(){api.reset();const t0=performance.now();SFX.whoosh();
      const tick=t=>{const k=Math.min(1,(t-t0)/1100),e=1-Math.pow(1-k,3);paint(e);if(k<1)raf=requestAnimationFrame(tick);else P.forEach(p=>Object.values(p.sl).forEach(s=>s.lab.style.opacity=1))};raf=requestAnimationFrame(tick);api.drawn=true},
    clear(){ov.innerHTML=''},
    focus(sel){P.forEach((p,pi)=>Object.entries(p.sl).forEach(([k,s])=>{const on=!sel||sel.some(([i,kk])=>(i===null||i===pi)&&kk===k);
      const out=sel&&on?12:0;s.g.style.transform=`translate(${Math.sin(s.mid)*out}px,${-Math.cos(s.mid)*out}px)`;s.g.classList.toggle('dim',!on)}))},
    label(pi,txt,col){tagAt(ov,P[pi].cx,P[pi].cy+r+56,txt,col||'#16213A',true)},
    zp(a,b){b=b==null?a:b;const xs=[a,b].map(i=>cxs[i]),ys=[a,b].map(i=>cys[i]);const x0=Math.min(...xs)-r-80,x1=Math.max(...xs)+r+80,y0=Math.min(...ys)-r-70,y1=Math.max(...ys)+r+60;return [x0,y0,x1-x0,y1-y0]},
    title(){return tri?[0,0,W,60]:[0,0,W,48]},
    zoom(box){svgZoom(svg,box)}};
  return api}

/* ================= HTML table (water use) + zoom ================= */
function buildWater(tb){tb.innerHTML=`<caption>${WATER.cap}</caption><tr><th></th>${WATER.cols.map(c=>`<th>${c}</th>`).join('')}</tr>`+
  WATER.rows.map(([n,v],r)=>`<tr><th class="r">${n}</th>${v.map((x,c)=>`<td data-r="${r}" data-c="${c}">${x}</td>`).join('')}</tr>`).join('')}
function Zoomer(box){const inner=$('.zin2',box);let st={k:1,tx:0,ty:0};
  function set(k,tx,ty){inner.style.transform=`translate(${tx}px,${ty}px) scale(${k})`;st={k,tx,ty};box.classList.toggle('zin',k>1.01)}
  const api={box,get z(){return st.k>1.01},
    out(){set(1,0,0)},
    to(els,maxK){if(!els.length)return;const ir=inner.getBoundingClientRect(),br=box.getBoundingClientRect();if(!br.width)return;
      let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;els.forEach(e=>{const r=e.getBoundingClientRect();x0=Math.min(x0,(r.left-ir.left)/st.k);y0=Math.min(y0,(r.top-ir.top)/st.k);x1=Math.max(x1,(r.right-ir.left)/st.k);y1=Math.max(y1,(r.bottom-ir.top)/st.k)});
      const w=x1-x0,h=y1-y0,k=Math.min(maxK||2.4,br.width/(w*1.15),br.height/(h*1.3));
      set(k,br.width/2-inner.offsetLeft-(x0+w/2)*k,br.height/2-inner.offsetTop-(y0+h/2)*k)},
    cells(f){return $$('td',box).filter(td=>f(+td.dataset.r,+td.dataset.c))},
    paint(map){$$('td',box).forEach(td=>{td.className='';const c=map&&map(+td.dataset.r,+td.dataset.c);if(c)td.className=c})},
    row(r){return $$('tr',box)[r+1]},
    block(rows,cols){const trs=$$('tr',box),out=[];rows.forEach(r=>{const tr=trs[r+1];out.push(tr.children[0]);cols.forEach(c=>out.push(tr.children[c+1]))});cols.forEach(c=>out.push(trs[0].children[c+1]));return out}};
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
function generic(s,n){$$('[data-s]',s).forEach(e=>e.classList.toggle('in',+e.dataset.s<=n));
  $$('[data-o]',s).forEach(e=>{const o=+e.dataset.o;e.classList.toggle('in',o===n);e.classList.toggle('gone',o<n)});
  $$('.flyin',s).forEach(f=>f.classList.toggle('in',n>=+f.dataset.fly))}
function setStep(s,n){s.dataset.step=n;generic(s,n);if(STEP[s.id])STEP[s.id](s,n);else if(n)SFX.pop(Math.min(n,6))}
function next(){const s=slides[cur],m=+(s.dataset.steps||0);if(m&&stepOf(s)<m){setStep(s,stepOf(s)+1);return}show(cur+1)}
function prev(){const s=slides[cur],m=+(s.dataset.steps||0);if(m&&stepOf(s)>0){setStep(s,stepOf(s)-1);return}show(cur-1)}
$('#prev').onclick=prev;$('#next').onclick=next;
$('#fs').onclick=()=>{const el=document.documentElement;if(document.fullscreenElement){document.exitFullscreen&&document.exitFullscreen().catch(()=>{})}else if(el.requestFullscreen){el.requestFullscreen().catch(()=>{})}};
document.addEventListener('keydown',e=>{if(e.target.closest('input,textarea,select,[contenteditable="true"]'))return;
  if(e.key==='ArrowRight'||e.key==='PageDown'){next();e.preventDefault()}else if(e.key==='ArrowLeft'||e.key==='PageUp'){prev();e.preventDefault()}
  else if((e.key==='e'||e.key==='E')&&!e.ctrlKey&&!e.metaKey){toggleEdit();e.preventDefault()}});

/* chart slides: draw on enter, then replay the current step; each step = one function */
const CH={};
function chartSlide(id,ch,steps,base){CH[id]=ch;
  ENTER[id]=s=>{ch.reset();base&&base(ch,0);requestAnimationFrame(()=>{ch.draw();setTimeout(()=>{if(slides[cur]===s)run(s,stepOf(s))},1350)})};
  STEP[id]=(s,n)=>{if(!ch.drawn)return;run(s,n);SFX.pop(Math.min(n||1,6))};
  function run(s,n){ch.clear();base&&base(ch,n);const f=steps[n];if(f)f(ch,s);else ch.zoom(null)}}
function tableSlide(id,steps){const s=$('#'+id),zb=$('.zbox',s),Z=Zoomer(zb);buildWater($('table',zb));
  ENTER[id]=s=>{Z.paint(null);Z.out();setTimeout(()=>{if(slides[cur]===s)STEP[id](s,stepOf(s),true)},300)};
  STEP[id]=(s,n,quiet)=>{Z.paint(null);const f=steps[n];if(f)f(Z,s);else Z.out();if(!quiet)SFX.pop(Math.min(n||1,6))};
  zb._Z=Z;return Z}

/* ================= MODULE 1 ================= */
chartSlide('dId',LineChart($('#cId'),LINE),{
  1:c=>{c.zoom(c.xaxis())},
  2:c=>{c.zoom(null)},
  3:c=>{c.zoom(null);c.end('man','↓');c.end('agr','↓');c.end('ret','↑',-16);c.end('hea','↑',16)}});
chartSlide('dName',LineChart($('#cName'),LINE),{
  1:c=>{c.focus(['man']);c.zoom(c.zb(1960,2020,10,22))},
  2:c=>{c.zoom(null)},
  3:c=>{c.zoom(c.yaxis())},
  4:c=>{c.focus(['ret']);c.seg('ret',0,3);c.zoom(c.zb(1960,2020,4,18))}});
chartSlide('dOv1',LineChart($('#cOv1'),LINE),{
  1:c=>{['man','ret','agr','hea'].forEach(k=>c.mark(k,0));c.zoom(c.zb(1955,1972,0,17,40))},
  2:c=>{['man','ret','agr','hea'].forEach(k=>c.mark(k,3));c.zoom(c.zb(2008,2022,0,18,40))},
  3:c=>{c.zoom(null);c.seg('ret',0,3);c.seg('hea',0,3);c.seg('man',1,3);c.seg('agr',0,3);c.end('man','↓');c.end('agr','↓');c.end('ret','↑',-16);c.end('hea','↑',16)},
  4:c=>{c.zoom(null);c.end('man','↓');c.end('agr','↓');c.end('ret','↑',-16);c.end('hea','↑',16)}});
chartSlide('dOv2',LineChart($('#cOv2'),LINE),{
  1:c=>{c.focus(['man','ret','hea']);c.at(2010,16.1,'vượt nhau');c.at(2015,14.4,null);c.zoom(c.zb(1995,2022,9,20))},
  2:c=>{c.focus(['agr']);c.shade(1980,2020,'#FBEFCF');c.seg('agr',1,3);c.zoom(c.zb(1975,2022,0,7))},
  3:c=>{c.zoom(null);c.at(2010,16.1,'vượt nhau');c.shade(1980,2020,'#FBEFCF')},
  4:c=>{c.zoom(null)}});
chartSlide('dLink',LineChart($('#cLink'),LINE2),{
  1:c=>{c.focus(['man']);c.seg('man',0,1);c.seg('man',1,3);c.mark('man',1,'rising → fell');c.zoom(c.zb(1955,2022,10,22))},
  2:c=>{c.focus(['man']);c.seg('man',0,1);c.seg('man',1,3);c.mark('man',1,'followed by a decline');c.zoom(c.zb(1955,2022,10,22))},
  3:c=>{c.focus(['man']);c.seg('man',0,1);c.seg('man',1,2);c.mark('man',2,'17',-28);c.zoom(c.zb(1955,2005,12,22))},
  4:c=>{c.focus(['man']);c.mark('man',1,'peak');c.seg('man',1,3);c.zoom(c.zb(1975,2022,10,22))},
  5:c=>{c.focus(['man']);c.mark('man',3,'by 2020: 13',30);c.zoom(c.zb(2005,2022,9,17,50))},
  6:c=>{c.focus(['man']);c.seg('man',1,3);c.zoom(c.zb(1975,2022,10,22))},
  7:c=>{c.focus(['man']);c.seg('man',1,3);c.mark('man',3,'ending at 13',30);c.zoom(c.zb(1975,2022,10,22))},
  8:c=>{c.focus(['agr']);c.seg('agr',1,2);c.seg('agr',2,3);c.mark('agr',2,'stable',-30);c.mark('agr',3,'dipping',-30);c.zoom(c.zb(1975,2022,0,7))}});
chartSlide('dNum',LineChart($('#cNum'),LINE2),{
  1:c=>{c.focus(['man']);c.mark('man',0,'at 15');c.zoom(c.zb(1955,1985,12,22,50))},
  2:c=>{c.focus(['man']);c.seg('man',0,1);c.mark('man',1,'to 20');c.zoom(c.zb(1955,1985,12,22,50))},
  3:c=>{c.focus(['man']);const [x,y]=c.pt('man',1),y0=c.Y(15),bx=x+26;const g=E('g',{class:'fade'},c.ov);
    E('line',{x1:c.pt('man',0)[0],x2:bx,y1:y0,y2:y0,stroke:'#16213A','stroke-dasharray':'4 4','stroke-width':1.5},g);
    E('path',{d:`M${bx-8} ${y} H${bx} V${y0} H${bx-8}`,stroke:'#16213A',class:'brk'},g);T(g,bx+8,(y+y0)/2+5,'a rise of 5',{class:'brt',fill:'#16213A'});c.zoom(c.zb(1955,1995,12,22,50))},
  4:c=>{c.focus(['man']);c.seg('man',1,3);c.mark('man',3,'by 2020: had fallen to 13',34,-90);c.zoom(c.zb(1975,2022,9,22,50))}});
STEP.dRule=(s,n)=>{n===1?SFX.buzz():n===2?SFX.zip():n&&SFX.pop(n)};
chartSlide('dWay1',LineChart($('#cWay1'),LINE),{
  1:c=>{c.focus(['man','agr']);c.mark('man',0,'15');c.mark('agr',0,'6',28);c.zoom(c.zb(1955,1975,3,18,50))},
  2:c=>{c.focus(['man']);c.seg('man',0,1);c.seg('man',1,3);c.mark('man',1,'peak 20');c.mark('man',3,'13',30);c.zoom(c.zb(1960,2020,10,22))},
  3:c=>{c.focus(['agr']);c.seg('agr',0,1);c.seg('agr',1,2);c.seg('agr',2,3);c.mark('agr',1,'3',-28);c.mark('agr',3,'2',-28);c.zoom(c.zb(1960,2020,0,8))},
  4:c=>{c.focus(['man','agr','ret','hea']);c.mark('agr',3,'smallest',-30,-30);c.zoom(c.zb(2005,2022,0,18,50))}},
  (c,n)=>{if(!n)c.focus(['man','agr'])});
chartSlide('dWay2',LineChart($('#cWay2'),LINE),{
  1:c=>{c.focus(['man']);c.mark('man',0,'15 · largest');c.zoom(c.zb(1955,1975,10,20,50))},
  2:c=>{c.focus(['man']);c.seg('man',0,1);c.seg('man',1,3);c.mark('man',1,'peak 20');c.mark('man',3,'13',30);c.zoom(c.zb(1960,2020,10,22))},
  3:c=>{c.focus(['agr','ret']);c.mark('agr',0,'6 = retail',-30,40);c.seg('agr',0,1);c.mark('agr',1,'3',-28);c.zoom(c.zb(1955,1985,0,9,50))},
  4:c=>{c.focus(['agr']);c.seg('agr',1,2);c.seg('agr',2,3);c.mark('agr',3,'2 · lowest',-30);c.zoom(c.zb(1975,2022,0,7))}},
  (c,n)=>{if(!n)c.focus(['man','agr'])});

/* bar chart practice (module 1) */
chartSlide('dW1',BarChart($('#cW1'),BAR),{
  1:c=>{c.focus(['foo']);c.mark('foo',1995,'32');c.mark('foo',2005,'24');c.zoom(c.zc(['foo']))},
  2:c=>{c.focus(['hou']);c.mark('hou',2005,'34 · #1');c.zoom(c.zc(['hou']))},
  3:c=>{c.focus(['oth']);c.zoom(c.zc(['oth']))},
  4:c=>{c.focus(['tra']);c.mark('tra',2005,'19 · smallest');c.zoom(c.zc(['tra']))},
  5:c=>{c.zoom(null)}});
const W2=BarChart($('#cW2'),BAR,{brackets:true});
chartSlide('dW2',W2,{
  1:c=>{c.order(BAR.cats.map(x=>x.k));c.mark('hou',2005,'#1 in 2005');c.zoom(null)},
  2:c=>{c.order(['foo','hou','oth','tra']);setTimeout(()=>{if(c.drawn&&stepOf($('#dW2'))===2){c.bracket(0,1,'B1','#1F5FD6');c.bracket(2,3,'B2','#C25E0C')}},800);c.zoom(null)},
  3:c=>{c.order(['foo','hou','oth','tra']);c.focus(['foo','hou']);setTimeout(()=>{if(stepOf($('#dW2'))===3){c.mark('foo',1995,'#1');c.mark('hou',1995,'#2')}},50);c.zoom(c.zc(['foo','hou']))},
  4:c=>{c.order(['foo','hou','oth','tra']);c.bracket(0,1,'B1','#1F5FD6');c.bracket(2,3,'B2','#C25E0C');c.zoom(null)}});
chartSlide('dW4',BarChart($('#cW4'),BAR),{
  1:c=>{c.zoom(null)},
  2:c=>{c.focus(['hou','foo']);c.mark('hou',2005,'#1');c.zoom(c.zc(['hou','foo']))},
  3:c=>{c.zoom(null)}});
const W5=BarChart($('#cW5'),BAR);
chartSlide('dW5',W5,{
  1:c=>{c.mark('foo',1995,'32 · #1');c.mark('hou',1995,'28 · #2');c.zoom(c.zc(['foo','hou']))},
  2:c=>{c.focus(['hou']);c.mark('hou',2005,'34 · #1');c.zoom(c.zc(['hou']))},
  3:c=>{c.focus(['foo']);c.mark('foo',2005,'24 · #2');c.zoom(c.zc(['foo']))}},
  (c)=>{c.order(['foo','hou','oth','tra']);c.focus(['foo','hou'])});
chartSlide('dW6',BarChart($('#cW6'),BAR),{
  1:c=>{c.mark('oth',1995,'25');c.mark('tra',1995,'15');c.zoom(c.zc(['oth','tra']))},
  2:c=>{c.focus(['oth']);c.mark('oth',2005,'23');c.zoom(c.zc(['oth']))},
  3:c=>{c.focus(['tra']);c.mark('tra',2005,'19 · smallest');c.zoom(c.zc(['tra']))}},
  (c)=>{c.focus(['oth','tra'])});

/* ================= MODULE 2 ================= */
chartSlide('sId',PieChart($('#cSId'),PIE),{1:c=>{c.zoom(c.title())},2:c=>{c.zoom(null)},3:c=>{c.zoom(null)}});
tableSlide('sOvEx',{
  1:(Z)=>{Z.paint((r,c)=>r<2?(c===2?'hi':''):'mut');Z.to([Z.row(0),Z.row(1)])},
  2:(Z)=>{Z.paint((r,c)=>r>=2?(c===1?'hi':''):'mut');Z.to([Z.row(2),Z.row(3)])},
  3:(Z)=>{Z.paint((r,c)=>c===0?(r<3?'lo':''):'mut');Z.to(Z.block([0,1,2,3],[0]))},
  4:(Z)=>{Z.paint((r,c)=>(r<2&&c===2)||(r>=2&&c===1)?'hi':(c===0&&r<3?'lo':''));Z.out()}});
tableSlide('sHz',{
  1:(Z)=>{Z.paint((r,c)=>r===0?'h1':'mut');Z.to([Z.row(0)])},
  2:(Z)=>{Z.paint((r,c)=>r===0?'h1':'mut');Z.to([Z.row(0)])},
  3:(Z)=>{Z.paint((r,c)=>r===1?'h1':'mut');Z.to([Z.row(1)])},
  4:(Z)=>{Z.paint((r,c)=>r===1?'h1':'mut');Z.to([Z.row(1)])}});
tableSlide('sVt',{
  1:(Z)=>{Z.paint((r,c)=>r>=2?'':'mut');Z.to([Z.row(2),Z.row(3)])},
  2:(Z)=>{Z.paint((r,c)=>r>=2&&c===1?'h2':'mut');Z.to(Z.block([2,3],[1]),2.8)},
  3:(Z)=>{Z.paint((r,c)=>r>=2&&c===0?'h2':'mut');Z.to(Z.block([2,3],[0]),2.8)},
  4:(Z)=>{Z.paint((r,c)=>r>=2&&c===2?'h2':'mut');Z.to(Z.block([2,3],[2]),2.8)}});
/* sorting chips for "viết ngang" */
function chips(el,ri){const [,v]=WATER.rows[ri];el.innerHTML=v.map((x,c)=>`<div class="cp" data-v="${x}"><b>${x}</b>${WATER.cols[c]}</div>`).join('')}
function sortChips(el){const cs=$$('.cp',el);const first=cs.map(c=>c.getBoundingClientRect());
  [...cs].sort((a,b)=>b.dataset.v-a.dataset.v).forEach((c,i)=>c.style.order=i);
  cs.forEach((c,i)=>{const r=c.getBoundingClientRect();c.style.transition='none';c.style.transform=`translateX(${first[i].left-r.left}px)`;c.getBoundingClientRect();c.style.transition='transform .7s cubic-bezier(.3,1.2,.4,1)';c.style.transform=''})}
const prevHz=STEP.sHz;STEP.sHz=(s,n,q)=>{prevHz(s,n,q);
  const go=(el,ri)=>{chips(el,ri);setTimeout(()=>{if(el.closest('[data-o]').classList.contains('in')){sortChips(el);SFX.zip()}},700)};
  if(n===1)go($('#chE'),0);if(n===3)go($('#chS'),1)};
chips($('#chE'),0);chips($('#chS'),1);

chartSlide('sW1',PieChart($('#cSW1'),PIE),{
  1:c=>{c.focus([[0,'sport'],[0,'cartoon'],[0,'news']]);c.zoom(c.zp(0))},
  2:c=>{c.focus([[1,'drama'],[1,'sport']]);c.zoom(c.zp(1))},
  3:c=>{c.focus([[2,'news'],[2,'sport']]);c.zoom(c.zp(2))},
  4:c=>{c.focus([[null,'sport'],[null,'news']]);c.zoom(null)},
  5:c=>{c.focus([[null,'drama'],[null,'film'],[null,'cartoon']]);c.zoom(null)}});
chartSlide('sW2',PieChart($('#cSW2'),PIE),{
  1:c=>{c.focus([[0,'sport'],[0,'cartoon'],[1,'drama'],[2,'news']]);c.label(0,'cao nhất: Sport, Cartoon','#18794E');c.label(1,'cao nhất: Drama','#18794E');c.label(2,'cao nhất: News','#18794E')},
  2:c=>{c.focus([[null,'sport'],[null,'news']]);[0,1,2].forEach(i=>c.label(i,'Body 1','#1F5FD6'))},
  3:c=>{c.focus([[null,'drama'],[null,'film'],[null,'cartoon']]);[0,1,2].forEach(i=>c.label(i,'Body 2','#C25E0C'))},
  4:c=>{c.zoom(null)}});
chartSlide('sW4',PieChart($('#cSW4'),PIE,{tri:true}),{
  1:c=>{c.focus([[0,'sport'],[0,'cartoon'],[1,'drama'],[2,'news']])},
  2:c=>{c.focus([[0,'news'],[1,'sport'],[2,'sport']])},
  3:c=>{c.zoom(null)}});
chartSlide('sW5',PieChart($('#cSW5'),PIE,{tri:true}),{
  1:c=>{c.focus([[0,'sport'],[0,'cartoon']]);c.zoom(c.zp(0))},
  2:c=>{c.focus([[1,'sport'],[2,'sport']]);c.zoom(c.zp(1,2))},
  3:c=>{c.focus([[0,'news'],[1,'news']]);c.zoom(c.zp(0,1))},
  4:c=>{c.focus([[2,'news'],[0,'news']]);c.zoom(null)},
  5:c=>{c.focus([[null,'sport'],[null,'news']]);c.zoom(null)}});
chartSlide('sW6',PieChart($('#cSW6'),PIE,{tri:true}),{
  1:c=>{c.focus([[0,'drama'],[0,'film'],[0,'cartoon']]);c.zoom(c.zp(0))},
  2:c=>{c.focus([[1,'drama'],[1,'film'],[1,'cartoon']]);c.zoom(c.zp(1))},
  3:c=>{c.focus([[2,'drama'],[2,'film'],[2,'cartoon']]);c.zoom(c.zp(2))},
  4:c=>{c.focus([[null,'drama'],[null,'film'],[null,'cartoon']]);c.zoom(null)}});

/* fraction pies */
$$('.fr1 svg').forEach(sv=>{sv.setAttribute('viewBox','0 0 100 100');E('circle',{cx:50,cy:50,r:44,fill:'#E4E9F0'},sv);sv._p=E('path',{fill:sv.dataset.c},sv)});
function fracPaint(sv,k){const a=+sv.dataset.pct/100*Math.PI*2*k;if(a<.001){sv._p.setAttribute('d','');return}const x=50+Math.sin(a)*44,y=50-Math.cos(a)*44;
  sv._p.setAttribute('d',`M50 50 L50 6 A44 44 0 ${a>Math.PI?1:0} 1 ${x} ${y}Z`)}
STEP.sNum=(s,n)=>{$$('.fr1',s).forEach(f=>{const sv=$('svg',f);if(+f.dataset.o===n){const t0=performance.now();const g=t=>{const k=Math.min(1,(t-t0)/800);fracPaint(sv,1-Math.pow(1-k,3));if(k<1)requestAnimationFrame(g)};requestAnimationFrame(g)}});if(n)SFX.pop(Math.min(n,6))};

/* writing slides: fill "Bài của lớp" on the last step */
$$('.wr').forEach(w=>{const s=w.closest('.slide'),id=s.id,prevS=STEP[id];
  STEP[id]=(sl,n)=>{prevS&&prevS(sl,n);const m=+sl.dataset.steps;w.classList.toggle('full',n===m);if(n===m){const txt=$$('.wbox',sl).map(b=>b.innerText.trim()).filter(Boolean).join(' ');$('.wpara',sl).textContent=txt}}});

/* ================= click-to-zoom on any chart ================= */
document.addEventListener('click',e=>{if(document.body.classList.contains('editing'))return;
  const cb=e.target.closest('.cbox');if(cb&&!e.target.closest('button')){const svg=$('svg',cb);if(!svg||!svg._full)return;
    if(svg._z){svgZoom(svg,null);SFX.whoosh(false);return}
    const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;const q=p.matrixTransform(svg.getScreenCTM().inverse());const F=svg._full,w=F[2]/2.2,h=F[3]/2.2;
    svgZoom(svg,[q.x-w/2,q.y-h/2,w,h]);SFX.whoosh();return}
  const zb=e.target.closest('.zbox');if(zb&&zb._Z){const Z=zb._Z;if(Z.z){Z.out();SFX.whoosh(false)}else{const td=e.target.closest('td,th');if(td){Z.to([td.closest('tr')],2.4);SFX.whoosh()}}}});

/* ================= timers ================= */
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

/* ================= clicks ================= */
function syncBank(s){const used=$$('.blank.on',s).map(g=>g.textContent.trim());$$('.bank span',s).forEach(sp=>sp.classList.toggle('used',used.includes(sp.textContent.trim())))}
document.addEventListener('click',e=>{
  const editing=document.body.classList.contains('editing');
  const b=e.target.closest('[data-act]');
  if(!b){if(editing)return;
    const fc=e.target.closest('.fc');if(fc){fc.classList.toggle('on');SFX.tick();return}
    const op=e.target.closest('.choice');if(op){$$('.choice',op.parentNode).forEach(x=>x.classList.toggle('pick',x===op&&!x.classList.contains('pick')));SFX.tick();return}
    const fx=e.target.closest('.fix');if(fx){fx.classList.toggle('on');fx.classList.contains('on')?SFX.ding():SFX.tick();return}
    const gp=e.target.closest('.blank');if(gp){gp.classList.toggle('on');syncBank(gp.closest('.slide'));gp.classList.contains('on')?SFX.ding():SFX.tick();return}
    return}
  const s=b.closest('.slide');
  switch(b.dataset.act){
    case 'step':next();break;
    case 'flip-all':{const all=$$('.fc',s),on=!all.every(f=>f.classList.contains('on'));all.forEach((f,i)=>setTimeout(()=>f.classList.toggle('on',on),i*45));SFX.whoosh();break}
    case 'fix-all':{const all=$$('.fix',s),on=!all.every(f=>f.classList.contains('on'));all.forEach((f,i)=>setTimeout(()=>f.classList.toggle('on',on),i*120));SFX.chime();break}
    case 'gaps-all':{const g=$$('.blank',s),on=!g.every(x=>x.classList.contains('on'));g.forEach((x,i)=>setTimeout(()=>{x.classList.toggle('on',on);syncBank(s)},i*120));SFX.chime();break}
    case 'sug':{const box=b.closest('.wcard');const sg=$$('.sug',box);const on=!sg[0].classList.contains('on');sg.forEach(x=>x.classList.toggle('on',on));b.classList.toggle('on',on);if(on)SFX.chime();break}}});

/* ================= teacher edit mode ================= */
$$('.fc .bk').forEach(b=>{if(!b.firstElementChild||b.children.length>1||b.firstElementChild.tagName!=='SPAN')b.innerHTML='<span>'+b.innerHTML+'</span>'});
const EDSEL='h1,h2,h3,p,li,td,th,.lab,.fc .f b,.fc .f span,.fc .bk>span,.fix>span,.choice>span,.bank span,.chk div>p';
const BYK={};let PUB={},PEND={};
slides.forEach(s=>{if(s.id==='sScore')return;
  const cand=$$(EDSEL,s).filter(e=>!e.closest('button,svg,.timer,.chips,.wpara,.zbox')&&!(e.parentElement&&e.parentElement.closest(EDSEL)&&s.contains(e.parentElement.closest(EDSEL))));
  cand.forEach((e,i)=>{const k=s.id+':'+i;e.dataset.ek=k;e._orig=e.innerHTML;BYK[k]=e});
  $$('.wbox',s).forEach((w,i)=>{const k=s.id+':w'+i;w.dataset.ek=k;w._orig='';w.contentEditable='true';w.spellcheck=false;BYK[k]=w})});
function clean(html){const t=document.createElement('template');t.innerHTML=String(html);
  t.content.querySelectorAll('script,style,iframe,object,embed,link,meta,form,input').forEach(x=>x.remove());
  t.content.querySelectorAll('*').forEach(el=>[...el.attributes].forEach(a=>{if(/^on/i.test(a.name)||(/^(href|src|xlink:href)$/i.test(a.name)&&/^\s*javascript:/i.test(a.value))||a.name==='contenteditable')el.removeAttribute(a.name)}));
  return t.innerHTML}
function applyMap(m){Object.entries(m||{}).forEach(([k,v])=>{const el=BYK[k];if(!el)return;el.innerHTML=v==null?el._orig:clean(v)})}
let DRAFT_KEY='wt1deck:draft';
function saveDraft(){try{localStorage.setItem(DRAFT_KEY,JSON.stringify(PEND))}catch(e){}}
document.addEventListener('input',e=>{const el=e.target.closest('[data-ek]');if(!el)return;PEND[el.dataset.ek]=el.innerHTML;saveDraft();paintSave()});
/* bar controls */
const bar=$('#bar');
const bEdit=document.createElement('button');bEdit.className='ebtn';bEdit.textContent='✎ Sửa (E)';bEdit.title='Bật chế độ chỉnh sửa nội dung';
const bSave=document.createElement('button');bSave.className='ebtn';bSave.textContent='Lưu';
const bReset=document.createElement('button');bReset.className='ebtn';bReset.textContent='↺ Gốc slide này';
const msg=document.createElement('span');msg.id='edmsg';
[bEdit,bSave,bReset,msg].forEach(x=>bar.insertBefore(x,$('#help')));
bSave.hidden=bReset.hidden=true;
function paintSave(){const n=Object.keys(PEND).length;bSave.textContent=n?`Lưu (${n})`:'Lưu';bSave.classList.toggle('on',!!n)}
function say(t){msg.textContent=t;clearTimeout(say._t);say._t=setTimeout(()=>msg.textContent='',6000)}
function toggleEdit(){const on=document.body.classList.toggle('editing');bEdit.classList.toggle('on',on);bSave.hidden=bReset.hidden=!on;
  Object.values(BYK).forEach(el=>{if(!el.classList.contains('wbox'))el.contentEditable=on?'true':'false'});
  say(on?'Bấm vào chữ để sửa. Bấm ra ngoài rồi dùng ← → để chuyển bước.':'')}
bEdit.onclick=toggleEdit;
bReset.onclick=()=>{const s=slides[cur];Object.values(BYK).forEach(el=>{if(s.contains(el)){el.innerHTML=el._orig;PEND[el.dataset.ek]=null}});saveDraft();paintSave();say('Đã trả slide này về bản gốc. Bấm Lưu để giữ.')};
let ART=null;try{ART=(window.claude&&window.claude.use)?window.claude.use('artifact').catch(()=>null):Promise.resolve(null)}catch(e){ART=Promise.resolve(null)}
bSave.onclick=async()=>{if(!Object.keys(PEND).length){say('Không có thay đổi mới.');return}
  const merged={...PUB};Object.entries(PEND).forEach(([k,v])=>{if(v==null)delete merged[k];else merged[k]=v});
  const art=await ART;
  if(!art||typeof art.publish!=='function'){say('Không lưu lên bài trình chiếu được ở đây; thay đổi vẫn được giữ trên trình duyệt này.');return}
  bSave.disabled=true;say('Đang lưu…');
  try{await art.publish({'edits.json':JSON.stringify(merged)});PUB=merged;PEND={};saveDraft();paintSave();say('Đã lưu. Mọi người mở link sẽ thấy bản đã sửa.')}
  catch(err){const c=err&&err.code;
    if(c==='conflict')say('Có bản mới hơn vừa được lưu; trang đang tải lại.');
    else if(c==='not_writer'||c==='not_granted'||c==='capability_disabled'||c==='consent_required')say('Bạn chỉ có quyền xem: thay đổi chỉ giữ trên trình duyệt này.');
    else if(c==='rate_limited')say('Lưu quá nhanh, chờ một lát rồi bấm Lưu lại.');
    else say('Chưa lưu được ('+(c||'lỗi')+'). Thay đổi vẫn giữ trên trình duyệt này.')}
  finally{bSave.disabled=false}};
/* load: published edits first, then this browser's unsaved draft */
fetch('edits.json',{cache:'no-store'}).then(r=>r.ok?r.json():{}).catch(()=>({})).then(m=>{PUB=(m&&typeof m==='object')?m:{};applyMap(PUB);
  try{const d=JSON.parse(localStorage.getItem(DRAFT_KEY)||'{}');if(d&&typeof d==='object'){PEND=d;applyMap(d);if(Object.keys(d).length)say('Có '+Object.keys(d).length+' chỗ sửa chưa lưu trên trình duyệt này.')}}catch(e){}
  paintSave()});

/* ================= start ================= */
slides.forEach(s=>{if(+s.dataset.steps)generic(s,0)});
SFX.stop();
const m=/^#s(\d+)$/.exec(location.hash);show(m?+m[1]-1:0);
})();
