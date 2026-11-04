/* Town-map engine: draws an illustrated street map in SVG and walks a route described in English. */
window.TownMap=(function(){
const NS='http://www.w3.org/2000/svg';
const el=(t,a,p)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e};
const ROOF=['#C8553D','#4F7CAC','#E0A458','#6A8D73','#8E6CC8','#B5838D','#5C80BC','#D4A373','#7D8597','#2A9D8F'];
const ICON={bank:'£',post:'✉',museum:'🏛',cafe:'☕',hotel:'H',cinema:'🎬',library:'📚',supermarket:'🛒',chemist:'✚',hospital:'✚',carpark:'P',restaurant:'🍴',bookshop:'📖',petrol:'⛽',station:'🚉',school:'✎',clinic:'✚',market:'◆',canteen:'🍴',bus:'🚌',gym:'◎',church:'✝',police:'★',bakery:'◒',theatre:'🎭',pool:'≈',zoo:'❀',university:'🎓'};

function draw(svg,cfg,opt={}){
  svg.innerHTML='';svg.setAttribute('viewBox',`0 0 ${cfg.w} ${cfg.h}`);
  const defs=el('defs',{},svg);
  const f=el('filter',{id:'shadow'+cfg.id,x:'-10%',y:'-10%',width:'130%',height:'130%'},defs);el('feDropShadow',{dx:3,dy:4,stdDeviation:2,'flood-opacity':.25},f);
  const pat=el('pattern',{id:'grass'+cfg.id,width:14,height:14,patternUnits:'userSpaceOnUse'},defs);el('rect',{width:14,height:14,fill:'#CFE8C3'},pat);el('circle',{cx:4,cy:5,r:1.2,fill:'#B5D9A6'},pat);el('circle',{cx:11,cy:11,r:1,fill:'#B5D9A6'},pat);
  el('rect',{width:cfg.w,height:cfg.h,fill:'#EDE9DF'},svg);
  // parks, water
  (cfg.areas||[]).forEach(a=>{
    if(a.type==='park'){el('rect',{x:a.x,y:a.y,width:a.w,height:a.h,rx:14,fill:`url(#grass${cfg.id})`,stroke:'#9CC98A','stroke-width':3},svg);
      const n=Math.floor(a.w*a.h/5200);for(let i=0;i<n;i++){const tx=a.x+18+((i*73)%(a.w-36)),ty=a.y+18+((i*131)%(a.h-36));el('circle',{cx:tx+3,cy:ty+4,r:13,fill:'#000',opacity:.12},svg);el('circle',{cx:tx,cy:ty,r:13,fill:i%3?'#6FAE5B':'#5D9A4A'},svg)}
      if(a.pond)el('ellipse',{cx:a.x+a.w*.62,cy:a.y+a.h*.55,rx:a.w*.16,ry:a.h*.16,fill:'#9CCBE8',stroke:'#7DB4D9','stroke-width':2},svg);
      if(a.path)el('path',{d:a.path,fill:'none',stroke:'#E9DCC0','stroke-width':9,'stroke-linecap':'round'},svg)}
    else if(a.type==='water'){el('path',{d:a.d,fill:'#A9D3EE',stroke:'#86BDE0','stroke-width':3},svg)}
    else if(a.type==='square'){el('rect',{x:a.x,y:a.y,width:a.w,height:a.h,rx:8,fill:'#E3DCCB',stroke:'#CFC4AC','stroke-width':2},svg);el('circle',{cx:a.x+a.w/2,cy:a.y+a.h/2,r:Math.min(a.w,a.h)*.18,fill:'#A9D3EE',stroke:'#86BDE0','stroke-width':3},svg)}
  });
  // roads
  const R=cfg.road||46;
  cfg.roads.forEach(r=>{const [x1,y1,x2,y2]=r.c;el('line',{x1,y1,x2,y2,stroke:'#B9BEC6','stroke-width':R+10,'stroke-linecap':'butt'},svg)});
  cfg.roads.forEach(r=>{const [x1,y1,x2,y2]=r.c;el('line',{x1,y1,x2,y2,stroke:'#5E6673','stroke-width':R,'stroke-linecap':'butt'},svg)});
  cfg.roads.forEach(r=>{const [x1,y1,x2,y2]=r.c;el('line',{x1,y1,x2,y2,stroke:'#F2F2F2','stroke-width':2.5,'stroke-dasharray':'16 14'},svg)});
  // junction patches + zebra crossings
  nodes(cfg).filter(n=>n.j).forEach(n=>{el('rect',{x:n.x-R/2,y:n.y-R/2,width:R,height:R,fill:'#5E6673'},svg);
    [[0,-1],[0,1],[-1,0],[1,0]].forEach(([dx,dy])=>{if(!roadAt(cfg,n.x+dx*(R/2+12),n.y+dy*(R/2+12)))return;
      for(let k=-2;k<=2;k++){const cx=n.x+dx*(R/2+9)+(dy?k*8:0),cy=n.y+dy*(R/2+9)+(dx?k*8:0);el('rect',{x:cx-(dy?2.5:7),y:cy-(dx?2.5:7),width:dy?5:14,height:dx?5:14,fill:'#F2F2F2',opacity:.9},svg)}})});
  // road names
  if(opt.roadNames!==false)cfg.roads.forEach(r=>{if(!r.name)return;const [x1,y1,x2,y2]=r.c,h=y1===y2;const cx=h?(r.lx||x1+60):x1,cy=h?y1:(r.ly||y1+70);
    const fs=opt.roadFs||14,w=r.name.length*fs*.66+22;const g=el('g',{transform:`translate(${cx} ${cy})${h?'':' rotate(-90)'}`},svg);
    el('rect',{x:-w/2,y:-fs*.85,width:w,height:fs*1.7,rx:fs*.85,fill:'#2B313B',stroke:'#fff','stroke-width':1.5},g);
    const t=el('text',{x:0,y:fs*.36,'font-size':fs,'font-weight':800,fill:'#fff','text-anchor':'middle','font-family':'Be Vietnam Pro, Arial, sans-serif','letter-spacing':'.5'},g);t.textContent=r.name.toUpperCase()});
  // buildings
  const G=el('g',{},svg);
  cfg.buildings.forEach((b,i)=>{const g=el('g',{class:'bld','data-i':i},G);
    el('rect',{x:b.x,y:b.y,width:b.w,height:b.h,rx:6,fill:b.color||ROOF[i%ROOF.length],filter:`url(#shadow${cfg.id})`},g);
    el('rect',{x:b.x+6,y:b.y+6,width:b.w-12,height:b.h-12,rx:4,fill:'#fff',opacity:.16},g);
    el('line',{x1:b.x+6,y1:b.y+b.h/2,x2:b.x+b.w-6,y2:b.y+b.h/2,stroke:'#000',opacity:.08,'stroke-width':2},g);
    const hide=opt.letters&&b.hide;const lab=b.letter&&opt.letters?b.letter:'';
    const cx=b.x+b.w/2,cy=b.y+b.h/2;
    const fs=opt.fs||14,str=hide?lab:(lab?lab+' · ':'')+b.name,lw=Math.min(b.w-10,Math.max(56,str.length*fs*.6+22));
    el('rect',{x:cx-lw/2,y:cy-fs*1.2,width:lw,height:fs*2.4,rx:8,fill:'#fff',opacity:.94},g);
    const t=el('text',{x:cx,y:cy+fs*.36,'text-anchor':'middle','font-size':hide?fs*1.6:fs,'font-weight':800,fill:'#16213A','font-family':'Be Vietnam Pro, Arial, sans-serif'},g);
    t.textContent=hide?lab:(lab?lab+' · ':'')+(opt.icons===true?((ICON[b.icon]||'')+' '):'')+b.name;
  });
  (cfg.trees||[]).forEach(([x,y])=>{el('circle',{cx:x+3,cy:y+4,r:11,fill:'#000',opacity:.12},svg);el('circle',{cx:x,cy:y,r:11,fill:'#6FAE5B'},svg)});
  // compass
  const c=el('g',{transform:`translate(${cfg.w-46} 46)`},svg);el('circle',{r:30,fill:'#fff',stroke:'#16213A','stroke-width':2,opacity:.95},c);
  el('path',{d:'M0 -22 7 0 0 22 -7 0z',fill:'#16213A'},c);el('path',{d:'M0 -22 7 0H-7z',fill:'#D46A6A'},c);
  const nt=el('text',{y:-34,'text-anchor':'middle','font-size':14,'font-weight':800,fill:'#16213A'},c);nt.textContent='N';
  const ov=el('g',{class:'overlay'},svg);return ov;
}

/* ---------- graph ---------- */
function nodes(cfg){if(cfg._nodes)return cfg._nodes;const pts=new Map();
  const add=(x,y,j)=>{const k=x+','+y;const o=pts.get(k)||{x,y,j:false};o.j=o.j||j;pts.set(k,o)};
  cfg.roads.forEach(r=>{const [x1,y1,x2,y2]=r.c;add(x1,y1,false);add(x2,y2,false)});
  cfg.roads.forEach((a,i)=>cfg.roads.forEach((b,k)=>{if(k<=i)return;const [ax1,ay1,ax2,ay2]=a.c,[bx1,by1,bx2,by2]=b.c;
    const ah=ay1===ay2,bh=by1===by2;if(ah===bh)return;const H=ah?a.c:b.c,V=ah?b.c:a.c;const x=V[0],y=H[1];
    if(x>=Math.min(H[0],H[2])&&x<=Math.max(H[0],H[2])&&y>=Math.min(V[1],V[3])&&y<=Math.max(V[1],V[3]))add(x,y,true)}));
  return cfg._nodes=[...pts.values()]}
function roadAt(cfg,x,y){return cfg.roads.find(r=>{const [x1,y1,x2,y2]=r.c;return y1===y2?(Math.abs(y-y1)<2&&x>=Math.min(x1,x2)&&x<=Math.max(x1,x2)):(Math.abs(x-x1)<2&&y>=Math.min(y1,y2)&&y<=Math.max(y1,y2))})}
const HD={N:[0,-1],E:[1,0],S:[0,1],W:[-1,0]},ORD=['N','E','S','W'];
const turn=(h,d)=>ORD[(ORD.indexOf(h)+(d==='right'?1:3))%4];
function nextNode(cfg,p,h){const [dx,dy]=HD[h];if(!roadAt(cfg,p.x+dx*3,p.y+dy*3))return null;
  let best=null,bd=1e9;nodes(cfg).forEach(n=>{const vx=n.x-p.x,vy=n.y-p.y;if(dx?(Math.abs(vy)>1||vx*dx<=1):(Math.abs(vx)>1||vy*dy<=1))return;const dd=Math.abs(vx)+Math.abs(vy);if(dd<bd){bd=dd;best=n}});return best}
function front(cfg,b){const r=cfg.roads.find(r=>r.id===b.road);const [x1,y1,x2,y2]=r.c;const cx=b.x+b.w/2,cy=b.y+b.h/2;return y1===y2?{x:cx,y:y1,road:r}:{x:x1,y:cy,road:r}}
function sideOf(p,h,b){const [dx,dy]=HD[h];const rx=-dy,ry=dx;const cx=b.x+b.w/2-p.x,cy=b.y+b.h/2-p.y;return (cx*rx+cy*ry)>0?'right':'left'}
function aheadOnRoad(cfg,p,h,b){const fr=front(cfg,b);const [dx,dy]=HD[h];if(!roadAt(cfg,p.x+dx*3,p.y+dy*3))return false;
  if(dx)return Math.abs(fr.y-p.y)<2&&(fr.x-p.x)*dx>0;return Math.abs(fr.x-p.x)<2&&(fr.y-p.y)*dy>0}

/* ---------- route interpreter ---------- */
const ORDN={first:1,'1st':1,next:1,second:2,'2nd':2,third:3,'3rd':3,fourth:4};
const SYN=[[/pharmacy|drugstore/g,'chemist'],[/gas station|service station/g,'petrol station'],[/parking lot|parking/g,'car park'],[/train station|railway station/g,'station'],[/movie theater|cinema hall/g,'cinema'],[/intersection|junction|traffic lights?/g,'crossroads'],[/\bgo pass\b/g,'go past'],[/\bwalk pass\b/g,'walk past'],[/\bstraight forward\b/g,'straight on']];
function walk(cfg,start,text){
  let t=' '+text.toLowerCase().replace(/[’']/g,"'")+' ';SYN.forEach(([a,b])=>t=t.replace(a,b));
  const names=cfg.buildings.map((b,i)=>({i,n:b.name.toLowerCase()})).sort((a,b)=>b.n.length-a.n.length);
  const find=s=>{const hits=[];names.forEach(o=>{const k=s.indexOf(o.n);if(k>=0&&!hits.some(h=>k>=h.k&&k<h.k+h.len))hits.push({i:o.i,k,len:o.n.length})});return hits.sort((a,b)=>a.k-b.k).map(h=>cfg.buildings[h.i])};
  let p={x:start.x,y:start.y},h=start.h,bare=false;const path=[[p.x,p.y]],log=[],unk=[];let end=null;
  const step=()=>{const n=nextNode(cfg,p,h);if(!n){log.push('⚠ Hết đường theo hướng này');return false}p={x:n.x,y:n.y};path.push([p.x,p.y]);return true};
  const goTo=b=>{const fr=front(cfg,b);if(!aheadOnRoad(cfg,p,h,b)&&!(Math.abs(fr.x-p.x)<2&&Math.abs(fr.y-p.y)<2)){log.push(`⚠ ${b.name} không ở phía trước trên con đường này`);return false}
    // walk node by node until the building's frontage is in the current segment
    for(let g=0;g<12;g++){const n=nextNode(cfg,p,h);const fx=fr.x,fy=fr.y;const between=n&&((HD[h][0]&&(fx-p.x)*HD[h][0]>=0&&(n.x-fx)*HD[h][0]>=0)||(HD[h][1]&&(fy-p.y)*HD[h][1]>=0&&(n.y-fy)*HD[h][1]>=0));if(between||!n)break;step()}
    p={x:fr.x,y:fr.y};path.push([p.x,p.y]);return true};
  const clauses=t.split(/[.;!?\n]|,\s*(?=then|and|turn|go|walk|take|it|you|the|cross|keep|continue|carry)|\bthen\b|\band then\b|\band (?=turn|go|walk|take|cross|keep|continue|it)/).map(s=>s.trim()).filter(Boolean);
  for(const c of clauses){
    let done=false,m;
    if((m=c.match(/take the (first|second|third|fourth|next|1st|2nd|3rd)?\s*(?:turning|road|street|turn)?\s*(?:on the\s*|on your\s*)?(left|right)/))){const k0=ORDN[m[1]||'first'],k=k0-(bare?1:0);let ok=true;for(let i=0;i<k&&ok;i++)ok=step();bare=false;h=turn(h,m[2]);log.push(`Rẽ ${m[2]==='left'?'trái':'phải'} ở ngã thứ ${k0}`);done=true}
    else if((m=c.match(/turn (left|right)(?: (?:at|into|on)? ?the (first|second|third|next|1st|2nd|3rd)? ?(crossroads|corner|end))?/))){
      if(m[2]){const k=ORDN[m[2]]-(bare?1:0);for(let i=0;i<k;i++)step()}else if(m[3]==='end'){while(step());}
      else if(m[3]||/at the (crossroads|corner)/.test(c)){const n0=nodes(cfg).find(n=>n.x===p.x&&n.y===p.y);if(!n0||!n0.j)step()}
      h=turn(h,m[1]);bare=false;log.push(`Rẽ ${m[1]==='left'?'trái':'phải'}`);done=true}
    if(!done&&(m=c.match(/(?:go|walk|keep going|carry on|continue|head)?\s*past the (.+)/))&&find(m[1]).length){const b=find(m[1])[0];if(goTo(b)){const [dx,dy]=HD[h];const n=nextNode(cfg,p,h);const lim=n?Math.abs(n.x-p.x)+Math.abs(n.y-p.y):0;const g2=Math.min(lim,b.w/2+20);p={x:p.x+dx*g2,y:p.y+dy*g2};path.push([p.x,p.y]);log.push(`Đi qua ${b.name}`)}bare=false;done=true}
    if(!done&&/(go|walk|keep|carry on|continue|head|drive)\b.*\b(straight|ahead|along|on|down|up|forward)|^straight/.test(c)){
      const tgt=c.match(/(?:until|till) you (?:reach|get to|see|come to) the (.+)|(?:to|towards) the (.+)/);const bs=tgt?find(tgt[1]||tgt[2]):[];
      if(/to the end|until the end|till the end|end of the (road|street)/.test(c)){while(step());log.push('Đi thẳng đến cuối đường')}
      else if(/crossroads/.test(c)&&!bs.length){const k=ORDN[(c.match(/(first|second|third|next)/)||[])[1]]||1;for(let i=0;i<k;i++)step();log.push(`Đi thẳng tới ngã tư thứ ${k}`)}
      else if(bs.length){goTo(bs[0]);log.push(`Đi thẳng tới ${bs[0].name}`)}
      else{step();bare=true;log.push('Đi thẳng 1 đoạn')}
      done=true}
    if(/cross (the|over)/.test(c)){log.push('Băng qua đường');done=true}
    // final location clauses
    const bs=find(c);
    if((m=c.match(/(opposite|across from|next to|beside|in front of|between)/))&&bs.length){const b=bs[0];
      if(m[1]==='in front of'){goTo(b);end={x:p.x,y:p.y};}
      else if(m[1]==='between'&&bs[1]){const f1=front(cfg,bs[0]),f2=front(cfg,bs[1]);p={x:(f1.x+f2.x)/2,y:(f1.y+f2.y)/2};path.push([p.x,p.y]);end={...p}}
      else{const fb=front(cfg,b);
        if(m[1]==='opposite'||m[1]==='across from'){if(!goTo(b)){end={...p};}else{const r=fb.road.c,hz=r[1]===r[3];const bc={x:b.x+b.w/2,y:b.y+b.h/2};end=hz?{x:fb.x,y:fb.y+(fb.y-bc.y>0?1:-1)*60}:{x:fb.x+(fb.x-bc.x>0?1:-1)*60,y:fb.y}}}
        else{const nb=cfg.buildings.filter(o=>o!==b&&o.road===b.road&&((o.y+o.h/2-fb.y)*(b.y+b.h/2-fb.y)>0||(o.x+o.w/2-fb.x)*(b.x+b.w/2-fb.x)>0)).sort((a,c2)=>Math.hypot(front(cfg,a).x-fb.x,front(cfg,a).y-fb.y)-Math.hypot(front(cfg,c2).x-fb.x,front(cfg,c2).y-fb.y))[0];
          const tb=nb||b;if(!goTo(tb)){end={...p}}else end={x:(tb.x+tb.w/2+front(cfg,tb).x)/2,y:(tb.y+tb.h/2+front(cfg,tb).y)/2}}}
      log.push(`Điểm đến: ${m[1]} ${b.name}`);done=true}
    else if((m=c.match(/on (?:your|the) (left|right)/))){let b=bs[0];
      if(!b){const cand=cfg.buildings.filter(o=>aheadOnRoad(cfg,p,h,o)&&sideOf(p,h,o)===m[1]).sort((a,c2)=>Math.hypot(front(cfg,a).x-p.x,front(cfg,a).y-p.y)-Math.hypot(front(cfg,c2).x-p.x,front(cfg,c2).y-p.y));b=cand[0]}
      if(b&&!goTo(b)){end={...p}}else if(b){const okSide=sideOf(p,h,b)===m[1];const fb=front(cfg,b);end={x:(b.x+b.w/2+fb.x)/2,y:(b.y+b.h/2+fb.y)/2};log.push(`${b.name} ở bên ${m[1]==='left'?'trái':'phải'}${okSide?'':' ⚠ thực ra ở bên '+(m[1]==='left'?'phải':'trái')}`)}
      else log.push('⚠ Không có toà nhà nào ở phía đó');done=true}
    else if(!done&&bs.length&&/(reach|arrive|get to|you'll see|you will see|it's the|it is the|is at|that's the|find the|go into|enter)/.test(c)){const okg=goTo(bs[0]);const fb=front(cfg,bs[0]);end=!okg?{...p}:{x:(bs[0].x+bs[0].w/2+fb.x)/2,y:(bs[0].y+bs[0].h/2+fb.y)/2};log.push(`Đến ${bs[0].name}`);done=true}
    if(!done&&/start|you are|you're|here/.test(c)&&!bs.length)done=true;
    if(!done)unk.push(c);
  }
  if(!end)end={...p};
  return {path,end,heading:h,log,unk};
}

/* ---------- route to a point (model answer) ---------- */
function model(cfg,start,target){
  // nearest building to target
  const b=cfg.buildings.map(o=>({o,d:Math.hypot(o.x+o.w/2-target.x,o.y+o.h/2-target.y)})).sort((a,c)=>a.d-c.d)[0].o;const fr=front(cfg,b);
  const N=nodes(cfg),key=n=>n.x+','+n.y;const startN={x:start.x,y:start.y};
  // BFS over (node, heading)
  const Q=[[startN,start.h,[]]],seen=new Set([key(startN)+start.h]);
  const goal=(n,h)=>aheadOnRoad(cfg,n,h,b);
  while(Q.length){const [n,h,acts]=Q.shift();
    for(const [nh,act] of [[h,null],[turn(h,'left'),'left'],[turn(h,'right'),'right']]){
      if(goal(n,nh)){const a=acts.concat(act?[act]:[]);return sentences(a,b,sideOf(n,nh,b))}
      const nx=nextNode(cfg,n,nh);if(!nx)continue;const k=key(nx)+nh;if(seen.has(k))continue;seen.add(k);Q.push([nx,nh,acts.concat(act?[act,'go']:['go'])])}}
  return '';
}
function sentences(acts,b,side){const out=[];let g=0;const flush=()=>{if(g){out.push(g===1?'Go straight on to the crossroads.':`Go straight on to the ${['','first','second','third','fourth'][g]} crossroads.`);g=0}};
  acts.forEach(a=>{if(a==='go')g++;else{flush();out.push(`Turn ${a}.`)}});flush();out.push(`The ${b.name.toLowerCase()} is on your ${side}.`);return out.join(' ')}

return {draw,nodes,walk,model,front,el};
})();
