(function(){
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const P=window.PLANS;let cur=0;
const NS='http://www.w3.org/2000/svg';
const E=(t,a,p)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e};
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
/* <rc>…</rc> etc. → coloured spans; <cj> = simple connector (and / but / so) */
const ST={rc:'Mệnh đề quan hệ',vi:'Cụm V-ing',cp:'Câu ghép',ct:'Tương phản',cl:'Nhấn mạnh / đảo'};
const mk=s=>s.replace(/<(rc|vi|cp|ct|cl|cj|nz)>/g,'<span class="hs $1">').replace(/<\/(rc|vi|cp|ct|cl|cj|nz)>/g,'</span>');
const hide7=()=>document.body.classList.contains('hide7');

/* ===== practice slides are built first, so navigation sees their steps ===== */
const STEP={},ENTER={},LEAVE=[];

/* ---------- plan renderer ---------- */
const PAL={b:['#E3ECFC','#1F5FD6'],o:['#FCEBDD','#C25E0C'],g:['#E1F3EA','#18794E'],p:['#EFE8FA','#5B3EA6'],r:['#FDE7E5','#B42318'],t:['#DDF2F0','#1C7C74'],y:['#FFF3C9','#B7791F']};
function label(g,x,y,w,txt,fs,o){if(!txt)return;const lines=txt.split('\n');const mx=Math.max(...lines.map(l=>l.length));
  const f=Math.min(fs,(w-18)/(mx*.6));const h=lines.length*f*1.12;
  if(o&&o.pill){const pw=mx*f*.6+24;E('rect',{x:x-pw/2,y:y-h/2-6,width:pw,height:h+12,rx:8,fill:o.pill},g)}
  const t=E('text',{x,y:y-h/2+f*.86,'text-anchor':'middle','font-size':f.toFixed(1),'font-weight':700,fill:(o&&o.fill)||'#16213A'},g);
  lines.forEach((l,i)=>{const ts=E('tspan',{x,dy:i?f*1.12:0},t);ts.textContent=l})}
function drawPlan(svg,cfg,o={}){svg.setAttribute('viewBox','0 0 1000 620');svg._vb=[0,0,1000,620];svg.innerHTML='';svg._cfg=cfg;const fs=o.fs||30;
  E('rect',{x:-500,y:-500,width:2000,height:1620,fill:cfg.wall?'#FBFAF7':'#F5F2E9'},svg);
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
    else if(it.t==='water'){E('rect',{x,y,width:w+400,height:h,fill:'#CFE3F5'},g);for(let wy=y+40;wy<y+h;wy+=60)E('path',{d:`M${x+15} ${wy}q15 -12 30 0t30 0`,stroke:'#7FA8D6','stroke-width':3,fill:'none'},g);label(g,cx,cy,w,it.l,fs)}
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
  if(it.t==='rail')return {x:Math.min(it.x1,it.x2),y:it.y1-14,w:Math.max(30,Math.abs(it.x2-it.x1)),h:28};return {x:it.x,y:it.y,w:it.w,h:it.h}}
function hl(svg,ids,cls){const ov=ovOf(svg);ids.forEach(id=>{const b=bounds(svg._cfg,id);if(!b)return;E('rect',{x:b.x-6,y:b.y-6,width:b.w+12,height:b.h+12,rx:12,class:'hlbox '+(cls||'')},ov)})}
function tag(svg,x,y,txt,cls){const ov=ovOf(svg);const g=E('g',{class:'mtag '+(cls||'')},ov);const w=txt.length*13+26;
  g.style.transform=`translate(${Math.max(w/2+4,Math.min(1000-w/2-4,x))}px,${Math.max(22,y)}px)`;
  E('rect',{x:-w/2,y:-19,width:w,height:38,rx:19},g);const t=E('text',{y:8,'text-anchor':'middle','font-size':22,'font-weight':800},g);t.textContent=txt;return g}
function tagOn(svg,ids,txt,cls){const b=union([svg],ids);if(b)tag(svg,b.x+b.w/2,b.y+4,txt,cls)}
const clearOv=(...svgs)=>svgs.forEach(s=>{const o=ovOf(s);if(o)o.innerHTML=''});
function halves(sv,l1,l2){const ov=ovOf(sv);E('rect',{x:0,y:0,width:500,height:620,class:'half h1'},ov);E('rect',{x:500,y:0,width:500,height:620,class:'half h2'},ov);E('line',{x1:500,y1:0,x2:500,y2:620,class:'divl'},ov);tag(sv,250,30,l1,'b');tag(sv,750,30,l2,'o')}
function route(sv,d){const p=E('path',{d,class:'mroute'},ovOf(sv));const L=p.getTotalLength();p.style.strokeDasharray=L;p.style.strokeDashoffset=L;p.getBoundingClientRect();p.style.transition='stroke-dashoffset 1.6s ease';p.style.strokeDashoffset=0}

/* ---------- camera: zoom in / out on both maps together ---------- */
const VB0=[0,0,1000,620];
function union(svgs,ids){let b=null;svgs.forEach(s=>ids.forEach(id=>{const k=bounds(s._cfg,id);if(!k)return;
  if(!b)b={...k};else{const x2=Math.max(b.x+b.w,k.x+k.w),y2=Math.max(b.y+b.h,k.y+k.h);b.x=Math.min(b.x,k.x);b.y=Math.min(b.y,k.y);b.w=x2-b.x;b.h=y2-b.y}}));return b}
function fit(b,pad=70,min=340){let x=b.x-pad,y=b.y-pad,w=b.w+2*pad,h=b.h+2*pad;if(w<min){x-=(min-w)/2;w=min}const R=1000/620;
  if(w/h<R){const nw=h*R;x-=(nw-w)/2;w=nw}else{const nh=w/R;y-=(nh-h)/2;h=nh}
  if(w>=1000)return VB0.slice();x=Math.max(0,Math.min(1000-w,x));y=Math.max(0,Math.min(620-h,y));return [x,y,w,h]}
function cam(svg,vb,dur=950){const from=svg._vb||VB0,to=vb||VB0;cancelAnimationFrame(svg._raf);const t0=performance.now();
  const tick=t=>{let k=Math.min(1,(t-t0)/dur);k=k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;const v=from.map((f,i)=>f+(to[i]-f)*k);svg.setAttribute('viewBox',v.join(' '));svg._vb=v;if(k<1)svg._raf=requestAnimationFrame(tick)};
  svg._raf=requestAnimationFrame(tick)}
function camTo(svgs,what,pad){let vb=null;if(Array.isArray(what)&&typeof what[0]==='number')vb=fit({x:what[0],y:what[1],w:what[2],h:what[3]},pad||0,480);
  else if(what&&what.length){const b=union(svgs,what);if(b)vb=fit(b,pad)}svgs.forEach(s=>cam(s,vb))}

/* ---------- test data (Phần 3) ---------- */
const T={
NELSON:{maps:['NELSON0','NELSON1'],cap:['2000','Present day'],
 task:'The [[a|maps]] below show the changes that have taken place in [[b|Nelson City]] [[c|between 2000 and the present day]]. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
 read:[['a','Dạng đề','Hai bản đồ, hai mốc → bài <b>so sánh thay đổi</b>',null],['b','Đối tượng','Một <b>thành phố</b>: toà nhà, đường, tiện ích',null],
  ['c','Thì','Quá khứ → hiện tại: <b>was built</b> / <b>has been built</b>',null],['','Chú thích','Không có Entrance · có <b>la bàn</b> · <b>biển</b> ở phía đông',[700,0,300,190]]],
 changes:[[['stn','rail'],'Train station','Rìa phía tây → trung tâm, cạnh University','DI DỜI','r','was removed and replaced by / was relocated to'],
  [['hall'],'Hall of residence','Đất trống phía tây bắc → ký túc xá','MỚI','g','was built'],
  [['mkt'],'Market','Chợ phía tây nam → cửa hàng','THAY THẾ','o','was replaced by'],
  [['trees'],'Trees','Cây cạnh University bị chặt → Shopping centre','THAY THẾ','o','were cleared, making way for'],
  [['cov'],'Covered market','Chợ có mái che mới ở phía đông','MỚI','g','was built'],
  [['road'],'Main Road','Đường xe chạy → khu chỉ dành cho người đi bộ','CHUYỂN ĐỔI','o','was converted into'],
  [['bike'],'Bike rental','Thêm điểm thuê xe đạp ở trung tâm','MỚI','g','was equipped with'],
  [['port'],'Port','Cảng giữ nguyên','GIỮ NGUYÊN','p','remained unchanged'],
  [['rest','bar'],'Restaurants · Bars','Thêm nhà hàng, quán bar cạnh cảng','MỚI','g','were added nearby']],
 ov:{big:[[['road'],'Main Road → pedestrian-only zone'],[['stn','rail'],'Train station được dời vào trung tâm']],
  opts:['Nhà ở tăng → đông dân hơn','Nhà máy thay đất nông nghiệp → công nghiệp hoá','Trung tâm hiện đại, dễ tiếp cận hơn'],pick:2,
  note:'Ghi chú cho Overview: <b>pedestrian zone</b> + <b>train station</b> → <b>more modern and accessible</b>'},
 split:{q:'Map có Entrance không?',a:'Không, chỉ có la bàn → <b>Cách 2 · theo la bàn</b>, đi từ Tây sang Đông',qbox:[700,0,300,190],
  b1:[['stn','hall','mkt','rail'],'Body 1 · Tây và Bắc','Train station · Hall of residence · Market'],b2:[['cov','trees','road','bike','port','rest','bar'],'Body 2 · Đông và Nam','Covered market · Trees · Main Road · Bike rental · Port']},
 outline:[[1,['stn','rail'],'Train station: rìa thành phố → trung tâm, cạnh University','which had stood …'],[1,['hall'],'Hall of residence mới ở tây bắc','while …'],[1,['mkt'],'Market (tây nam) → shop','which had occupied …'],
  [2,['cov','trees'],'Covered market mới · Trees → shopping centre','making way for …'],[2,['road','bike'],'Main Road → pedestrian-only zone · thêm bike rental','which had carried … · while …'],[2,['port','rest','bar'],'Port giữ nguyên · thêm restaurants, bars','Although …']],
 write:[['Introduction',[],'Paraphrase đề: <i>show</i> → <i>illustrate</i>; <i>the changes that have taken place</i> → <i>how … changed</i>',['illustrate','how … changed','Nelson City','between 2000 and the present day'],'The maps illustrate how … changed between … and ….',
   'The maps illustrate how Nelson City changed between 2000 and the present day.'],
  ['Overview · câu 1',['road','stn','rail'],'Hai thay đổi lớn nhất: đường chính và ga tàu',['Overall','underwent some significant changes','the most important of which were','conversion of the main road','relocation of the train station'],'Overall, … underwent some significant changes, the most important of which were … and ….',
   'Overall, the city underwent some significant changes, <rc>the most important of which were</rc> the conversion of the main road into a pedestrian-only zone and the relocation of the train station.'],
  ['Overview · câu 2',[],'Ý nghĩa: trung tâm hiện đại, dễ tiếp cận hơn',['These changes','have transformed','a more modern and accessible place','residents and visitors'],'These changes have transformed … into ….',
   'These changes have transformed the centre into a more modern and accessible place for residents and visitors.'],
  ['Body 1 · câu 1',['stn','rail'],'Ga cũ ở rìa phía tây bị bỏ; ga mới ở trung tâm, cạnh University',['On the western side','train station','on the edge of the city','removed','replaced by','next to the university'],'On the western side, the …, which had stood …, was removed and replaced by …',
   'On the western side, the train station, <rc>which had stood on the edge of the city</rc>, was removed and replaced by a new station in the centre, next to the university.'],
  ['Body 1 · câu 2',['hall','mkt'],'Ký túc xá mới ở tây bắc; chợ cũ ở tây nam → cửa hàng',['hall of residence','north-west','while','old market','south-west','a new shop'],'A … was built in the …, while the …, which had occupied …, was replaced by …',
   'A hall of residence was built in the north-west, <cp>while</cp> the old market, <rc>which had occupied the south-west</rc>, was replaced by a new shop.'],
  ['Body 2 · câu 1',['cov','trees'],'Chợ có mái che mới; cây cạnh University bị chặt → shopping centre',['On the eastern side','covered market','trees beside the university','cleared','making way for','shopping centre'],'On the eastern side, …, and the … were cleared, making way for …',
   'On the eastern side, a new covered market was built, and the trees beside the university were cleared, <vi>making way for a large shopping centre</vi>.'],
  ['Body 2 · câu 2',['road','bike'],'Đường phía nam → khu đi bộ; trung tâm có xe đạp thuê',['road along the southern edge','previously carried traffic','pedestrian-only zone','while','bike rental scheme'],'The …, which had previously …, was converted into …, while …',
   'The road along the southern edge, <rc>which had previously carried traffic</rc>, was converted into a pedestrian-only zone, <cp>while</cp> the city centre was equipped with a bike rental scheme.'],
  ['Body 2 · câu 3',['port','rest','bar'],'Cảng giữ nguyên; thêm nhà hàng, quán bar gần đó',['Although','port','remained unchanged','restaurants','a bar and club area','added nearby'],'Although … remained unchanged, … were added nearby.',
   '<ct>Although the port remained unchanged</ct>, restaurants and a bar and club area were added nearby.']]},
CC:{maps:['CC0','CC1'],cap:['10 years ago','Now'],
 task:'The [[a|plans]] below show [[b|a community centre]] [[c|ten years ago and now]]. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
 read:[['a','Dạng đề','Hai sơ đồ mặt bằng → <b>so sánh thay đổi</b> phòng, khu vực',null],['b','Đối tượng','Một <b>toà nhà</b>: phòng và khu chức năng',null],
  ['c','Thì','Quá khứ → hiện tại: <b>was replaced</b> / <b>has been replaced</b>',null],['','Chú thích','Có <b>Entrance</b> ở phía nam · có la bàn',[200,440,300,180]]],
 changes:[[['garden'],'Garden','Vườn ngoài trời → khu thể thao trong nhà','THAY THẾ','o','was replaced by'],
  [['car'],'Car park','Giữ nguyên','GIỮ NGUYÊN','p','was retained'],
  [['hall','rec'],'Hall · Reception','Hội trường 100 chỗ, lối vào, lễ tân giữ nguyên','GIỮ NGUYÊN','p','remained unchanged / stayed in the same position'],
  [['sto','wcn'],'Storage','Kho nhỏ lại, thêm toilets bên cạnh','THU NHỎ + MỚI','b','was reduced in size / were added'],
  [['off1','off2','off3','off4','sto2','cafe'],'4 Offices + Storage','→ một khu café rộng','THAY THẾ','o','gave way to'],
  [['kit'],'Kitchen','Giữ nguyên','GIỮ NGUYÊN','p','remained in place'],
  [['cof','wc','off'],'Coffee bar · Toilets','→ một văn phòng','THAY THẾ','o','were replaced by']],
 ov:{big:[[['garden'],'Garden → indoor sports facilities'],[['off1','off2','off3','off4','sto2','cafe'],'Khu café mở rộng']],
  opts:['Nhà ở tăng → đông dân hơn','Hoạt động trong nhà và giao lưu','Nhà máy → công nghiệp hoá'],pick:1,
  note:'Ghi chú cho Overview: <b>indoor sports</b> + <b>bigger café</b> → <b>indoor recreation and social activities</b>'},
 split:{q:'Map có Entrance không?',a:'Có → <b>Cách 1 · theo lối vào</b>, đứng ở Entrance, đi từ trái sang phải',qbox:[200,440,300,180],
  b1:[['garden','car','hall','rec'],'Body 1 · phía Tây','Garden · Car park · Hall · Reception'],b2:[['sto','wcn','kit','cafe','off1','off2','off3','off4','sto2','cof','wc','off'],'Body 2 · Bắc, Đông, Đông Nam','Storage · Kitchen · Offices → Café · Coffee bar']},
 outline:[[1,['garden'],'Garden → indoor sports facilities','which had provided …'],[1,['car'],'Car park giữ nguyên','while … was retained'],[1,['hall','rec'],'Hall (100 chỗ), lối vào, lễ tân giữ nguyên','which seats …'],
  [2,['sto','wcn'],'Storage nhỏ lại · thêm toilets','with … being added'],[2,['off1','off2','off3','off4','sto2','cafe','kit'],'Phía đông đổi nhiều nhất: offices + storage → café · kitchen giữ nguyên','It was … that · gave way to · while'],[2,['cof','wc','off'],'Coffee bar + toilets → office','were replaced by']],
 write:[['Introduction',[],'Paraphrase đề: <i>show</i> → <i>illustrate</i>; <i>ten years ago and now</i> → <i>between ten years ago and the present day</i>',['illustrate','how … changed','the community centre','between ten years ago and the present day'],'The maps illustrate how … changed between … and ….',
   'The maps illustrate how the community centre changed between ten years ago and the present day.'],
  ['Overview · câu 1',['garden','off1','off2','off3','off4','sto2','cafe'],'Hai thay đổi lớn nhất: vườn và khu café',['Overall','underwent some significant changes','the most important of which were','replacement of the garden','expansion of the cafe area'],'Overall, … underwent some significant changes, the most important of which were … and ….',
   'Overall, the centre underwent some significant changes, <rc>the most important of which were</rc> the replacement of the garden with indoor sports facilities and the expansion of the cafe area.'],
  ['Overview · câu 2',[],'Ý nghĩa: chuyển sang hoạt động trong nhà và giao lưu',['These changes','have shifted … towards','indoor recreation','social activities'],'These changes have shifted … towards ….',
   'These changes have shifted the centre towards indoor recreation and social activities.'],
  ['Body 1 · câu 1',['garden','car'],'Vườn → khu thể thao trong nhà; bãi đỗ xe giữ nguyên',['On the western side','garden','provided outdoor green space','replaced by','indoor sports facilities','while','retained'],'On the western side, the …, which had …, was replaced by …, while …',
   'On the western side, the garden, <rc>which had provided outdoor green space</rc>, was replaced by indoor sports facilities, <cp>while</cp> the car park was retained.'],
  ['Body 1 · câu 2',['hall','rec'],'Hội trường 100 chỗ, lối vào và lễ tân giữ nguyên',['The hall','seats 100 people','remained unchanged','entrance and reception area','stayed in the same position'],'The …, which …, remained unchanged, and …',
   'The hall, <rc>which seats 100 people</rc>, remained unchanged, and the entrance and reception area stayed in the same position.'],
  ['Body 2 · câu 1',['sto','wcn'],'Kho phía bắc nhỏ lại, thêm toilets',['In the north','storage room','reduced in size','with toilets being added','beside it'],'In the north, the … was reduced in size, with … being added …',
   'In the north, the storage room was reduced in size, <vi>with toilets being added beside it</vi>.'],
  ['Body 2 · câu 2',['off1','off2','off3','off4','sto2','cafe','kit'],'Phía đông đổi nhiều nhất: 4 văn phòng + kho → café; bếp giữ nguyên',['It was the eastern side that','changed most','four offices','gave way to','a large cafe area','while','kitchen remained in place'],'It was the … that changed most, as … gave way to …, while …',
   '<cl>It was the eastern side that</cl> changed most, as the four offices and the storage room gave way to a large cafe area, <cp>while</cp> the kitchen remained in place.'],
  ['Body 2 · câu 3',['cof','wc','off'],'Quầy cà phê và toilets ở đông nam → văn phòng',['In the south-east','coffee bar and toilets','were replaced by','an office'],'In the south-east, the … were replaced by …',
   'In the south-east, the coffee bar and toilets were replaced by an office.']]}};

/* ---------- build practice slides ---------- */
const hdr=(t,extra)=>`<div class="hdr"><h2>${t}</h2><div class="tools">${extra||''}<button class="b sm" data-act="cam-out">⤢ Toàn cảnh</button><button class="b pri" data-act="step">Tiếp ▸</button></div></div>`;
const mapsHTML=(d,v)=>`<div class="twomap${v?' v':''} pm">${d.maps.map((m,i)=>`<figure><figcaption>${d.cap[i]}</figcaption><svg class="plan"></svg></figure>`).join('')}</div>`;
const STEPNAMES=['Đọc đề','Phân tích đề','Thông tin Overview','Chia thân bài','Dàn ý thân bài','Viết bài'];
const KIND={read:0,analyze:1,overview:2,split:3,outline:4,write:5};
$$('.slide.prac').forEach(s=>{const d=T[s.dataset.test],k=s.dataset.kind,ki=KIND[k];const title=s.dataset.title.split('·')[0]+'· '+STEPNAMES[ki];
  const road=`<div class="road6">${STEPNAMES.map((n,i)=>`<span class="${i<ki?'done':i===ki?'cur':''}">${i+1}. ${n}</span>`).join('')}</div>`;
  let body='';
  if(k==='read'){body=`<div class="task2">${d.task.replace(/\[\[(\w)\|([^\]]*)\]\]/g,'<span class="kw" data-k="$1">$2</span>')}</div>${mapsHTML(d)}<div class="rcards">${d.read.map(r=>`<div class="rc2"><b>${r[1]}</b><span>${r[2]}</span></div>`).join('')}</div>`}
  if(k==='analyze'){body=`${mapsHTML(d)}<div class="anbot"><div class="ancard"><span class="anhint">Bấm → để phóng to từng khu và gọi tên thay đổi.</span></div><div class="antrail"></div></div>`}
  if(k==='overview'){body=`${mapsHTML(d)}<div class="ovq"><div class="q1"><b>❓</b> Thay đổi nào <u>lớn nhất</u>?</div><div class="bigs">${d.ov.big.map((b,i)=>`<span class="bigc">${i+1}. ${b[1]}</span>`).join('')}</div>
   <div class="q2"><b>❓</b> Những thay đổi này <u>có ý nghĩa gì</u>?</div><div class="ovopts">${d.ov.opts.map((o,i)=>`<span class="opt3${i===d.ov.pick?' ok':''}">${o}</span>`).join('')}</div><div class="ovnote">${d.ov.note}</div></div>`}
  if(k==='split'){body=`${mapsHTML(d)}<div class="dtree"><div class="dq"><b>❓</b> ${d.split.q}</div><div class="da">${d.split.a}</div><div class="db b1"><b>${d.split.b1[1]}</b><span>${d.split.b1[2]}</span></div><div class="db b2"><b>${d.split.b2[1]}</b><span>${d.split.b2[2]}</span></div></div>`}
  if(k==='outline'){body=`<div class="out3">${mapsHTML(d,true)}<div class="outl2"><div class="obody"><h3>Body 1</h3>${d.outline.filter(o=>o[0]===1).map(o=>`<div class="ob"><span>${o[2]}</span><i class="b7">${o[3]}</i></div>`).join('')}</div><div class="obody"><h3>Body 2</h3>${d.outline.filter(o=>o[0]===2).map(o=>`<div class="ob"><span>${o[2]}</span><i class="b7">${o[3]}</i></div>`).join('')}</div></div></div>`}
  if(k==='write'){body=`<div class="wr2">${mapsHTML(d,true)}<div class="wrr"><div class="wdots">${d.write.map((w,i)=>`<span>${w[0]}</span>`).join('')}</div>
   <div class="wcard"><div class="wpart"></div><div class="wvn"></div><div class="wkeys"></div><div class="wframe b7"></div><div class="wpen">✎ Học sinh viết câu vào vở…</div><div class="wmodel"></div></div>
   <div class="wessay"></div></div></div>`}
  s.innerHTML=hdr(title,k==='write'?'<div class="timer sm2" data-sec="180" data-label="Viết câu"></div>':'')+road+body;
  s.dataset.steps={read:d.read.length,analyze:d.changes.length+1,overview:5,split:5,outline:d.outline.length+1,write:d.write.length*2}[k];
  $$('svg.plan',s).forEach((v,i)=>drawPlan(v,P[d.maps[i]],{fs:k==='outline'||k==='write'?36:32}));
  s._svgs=$$('svg.plan',s);});

function pracStep(s,n){const d=T[s.dataset.test],k=s.dataset.kind,sv=s._svgs;clearOv(...sv);
  if(k==='read'){const r=d.read[n-1];$$('.kw',s).forEach(x=>x.classList.toggle('on',d.read.slice(0,n).some(q=>q[0]===x.dataset.k)));$$('.kw',s).forEach(x=>x.classList.toggle('cur',r&&r[0]===x.dataset.k));
    $$('.rc2',s).forEach((c,i)=>{c.classList.toggle('in',i<n);c.classList.toggle('cur',i===n-1)});$$('figcaption',s).forEach(f=>f.classList.toggle('flash',r&&r[0]==='c'));
    camTo(sv,r&&r[3]?r[3]:null);if(r&&r[3])sv.forEach(v=>E('rect',{x:r[3][0]+10,y:r[3][1]+10,width:r[3][2]-20,height:r[3][3]-20,rx:16,class:'hlbox o'},ovOf(v)));if(n)SFX.pop(n+1)}
  if(k==='analyze'){const c=d.changes[n-1];d.changes.slice(0,Math.min(n,d.changes.length)).forEach((x,i)=>{hl(sv[1],x[0],x[4]);if(i===n-1||n>d.changes.length)tagOn(sv[1],x[0],x[3],x[4])});
    if(c){hl(sv[0],c[0],c[4]);camTo(sv,c[0],90);$('.ancard',s).innerHTML=`<span class="anno">${n}/${d.changes.length}</span><div class="anname">${c[1]}</div><div class="anwhat">${c[2]}</div><div class="antype"><span class="pgtag ${c[4]}">${c[3]}</span><b>${c[5]}</b></div>`;SFX.whoosh()}
    else{camTo(sv,null);$('.ancard',s).innerHTML=n?`<div class="anname">Tổng cộng ${d.changes.length} thay đổi</div><div class="anwhat">Đã gọi tên đủ. Không bỏ sót khu nào khi viết thân bài.</div>`:'<span class="anhint">Bấm → để phóng to từng khu và gọi tên thay đổi.</span>';if(n)SFX.chime()}
    $('.antrail',s).innerHTML=d.changes.slice(0,Math.min(n,d.changes.length)).map(x=>`<span class="pgtag ${x[4]}">${x[1]}</span>`).join('')}
  if(k==='overview'){$('.q1',s).classList.toggle('in',n>=1);$$('.bigc',s).forEach((b,i)=>b.classList.toggle('in',n>=i+2));$('.q2',s).classList.toggle('in',n>=4);$('.ovopts',s).classList.toggle('in',n>=4);$('.ovopts',s).classList.toggle('pk',n>=5);$('.ovnote',s).classList.toggle('in',n>=5);
    const b=d.ov.big;if(n===2||n===3){sv.forEach(v=>hl(v,b[n-2][0],'o'));camTo(sv,b[n-2][0],90)}else{if(n>=4)sv.forEach(v=>{hl(v,b[0][0],'o');hl(v,b[1][0],'o')});camTo(sv,null)}
    if(n)n>=5?SFX.chime():SFX.pop(n+1)}
  if(k==='split'){const p=d.split;$('.dq',s).classList.toggle('in',n>=1);$('.da',s).classList.toggle('in',n>=2);$('.db.b1',s).classList.toggle('in',n>=3);$('.db.b2',s).classList.toggle('in',n>=4);
    if(n===1){camTo(sv,p.qbox);sv.forEach(v=>E('rect',{x:p.qbox[0]+10,y:p.qbox[1]+10,width:p.qbox[2]-20,height:p.qbox[3]-20,rx:16,class:'hlbox o'},ovOf(v)))}
    else if(n===2){camTo(sv,null);if(s.dataset.test==='CC')sv.forEach(v=>route(v,'M335 560 L335 470 L100 470 M335 470 L900 470'))}
    else if(n===3){sv.forEach(v=>hl(v,p.b1[0],'b'));camTo(sv,p.b1[0],50);sv.forEach(v=>tagOn(v,p.b1[0],'Body 1','b'))}
    else if(n===4){sv.forEach(v=>hl(v,p.b2[0],'o'));camTo(sv,p.b2[0],50);sv.forEach(v=>tagOn(v,p.b2[0],'Body 2','o'))}
    else{camTo(sv,null);if(n>=5)sv.forEach(v=>{hl(v,p.b1[0],'b');hl(v,p.b2[0],'o')})}
    if(n)SFX.pop(n+1)}
  if(k==='outline'){const o=d.outline[n-1];$$('.ob',s).forEach((x,i)=>{x.classList.toggle('in',i<n);x.classList.toggle('cur',i===n-1)});$$('.obody',s).forEach((x,i)=>x.classList.toggle('in',d.outline.findIndex(q=>q[0]===i+1)<n));
    if(o){sv.forEach(v=>hl(v,o[1],o[0]===1?'b':'o'));camTo(sv,o[1],90)}else{camTo(sv,null);if(n)d.outline.forEach(q=>sv.forEach(v=>hl(v,q[1],q[0]===1?'b':'o')))}
    if(n)SFX.pop(n+1)}
  if(k==='write'){const i=Math.ceil(n/2)-1,w=d.write[i],shown=n>0&&n%2===0;
    $$('.wdots span',s).forEach((x,j)=>{x.classList.toggle('done',j<i||(j===i&&shown));x.classList.toggle('cur',j===i&&n>0)});
    const c=$('.wcard',s);c.classList.toggle('in',n>0);c.classList.toggle('shown',shown);
    if(w){$('.wpart',s).textContent=w[0];$('.wvn',s).innerHTML=w[2];$('.wkeys',s).innerHTML=w[3].map((x,j)=>`<span style="animation-delay:${j*.08}s">${x}</span>`).join('');
      $('.wframe',s).innerHTML='<b>Khung câu</b> '+esc(w[4]);$('.wmodel',s).innerHTML=mk(w[5]);
      if(w[1].length){sv.forEach(v=>hl(v,w[1],'o'));camTo(sv,w[1],90)}else camTo(sv,null);
      if(shown){const m=$('.wmodel',s);m.animate([{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0 0 0)'}],{duration:1400,easing:'ease-out'});SFX.chime()}else SFX.pop(3)}
    else camTo(sv,null);
    const done=d.write.slice(0,shown?i+1:Math.max(0,i));let html='',last='';
    done.forEach(x=>{const part=x[0].split(' ·')[0];html+=(part!==last&&last?'</p><p>':'')+mk(x[5])+' ';last=part});
    $('.wessay',s).innerHTML=done.length?'<p>'+html+'</p>':'<p class="sub">Bài viết hình thành dần ở đây, sau khi học sinh viết xong từng câu.</p>';$('.wessay',s).scrollTop=1e5}}
$$('.slide.prac').forEach(s=>{STEP[s.id]=pracStep});

/* ---------- navigation (Band 7 slides are skipped while Band 7 is hidden) ---------- */
const slides=$$('.slide');
const jump=$('#jump');
slides.forEach((s,i)=>{const o=document.createElement('option');o.value=i;o.textContent=(i+1)+'. '+(s.dataset.title||'');jump.appendChild(o)});
jump.onchange=()=>show(+jump.value);
const skip=i=>hide7()&&slides[i]&&slides[i].classList.contains('b7slide');
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
function set7(h){document.body.classList.toggle('hide7',h);t7.classList.toggle('on',!h);t7.textContent='Band 7: '+(h?'ẩn':'hiện');
  if(h)$$('.essayslide').forEach(s=>essayVer(s,6));SFX.tick();if(skip(cur))show(cur+1,1)}
t7.onclick=()=>set7(!hide7());
$('#help').textContent='← → slide/bước · B bảng điểm · 7 ẩn/hiện Band 7';
document.addEventListener('keydown',e=>{if(e.target.closest('input,textarea,select,[contenteditable]'))return;
  if(e.key==='ArrowRight'||e.key==='PageDown'){next();e.preventDefault()}else if(e.key==='ArrowLeft'||e.key==='PageUp'){prev();e.preventDefault()}
  else if(e.key==='7'){t7.click()}});

/* ---------- layout ---------- */
STEP.sLayout=(s,n)=>{$$('.pblk',s).forEach((b,i)=>b.classList.toggle('in',i<n));$('#layPaper').classList.toggle('focus',n>=5);$('#layNote').classList.toggle('in',n>=5);
  if(n)n>=5?SFX.chime():SFX.pop(n)};

/* ---------- three map types ---------- */
STEP.sTypes=(s,n)=>{$$('.tcard',s).forEach((c,i)=>c.classList.toggle('in',i<n));$('.tip1',s).classList.toggle('in',n>=3);if(n)SFX.pop(n+1)};

/* ---------- reading a map: zoom on each zone ---------- */
const rA=$('#readA'),rB=$('#readB');drawPlan(rA,P.CAMPUS0);drawPlan(rB,P.CAMPUS1);
const RZ=[[['lib'],'THAY THẾ','o','<b>Library</b> cạnh lối vào → <b>Car park</b>: thay thế · <i>was replaced by</i>'],
 [['ne','it','ne2'],'BIẾN MẤT + MỚI','g','<b>Cây</b> phía đông bắc bị chặt → <b>Library</b> và <b>IT centre</b> mới · <i>were cleared / was built</i>'],
 [['lib','ne'],'DI DỜI','p','<b>Library</b> từ lối vào lên đông bắc · <i>was relocated to</i>'],
 [['cls'],'MỞ RỘNG','b','<b>Classrooms</b> dài gấp đôi về phía nam · <i>was extended</i>'],
 [['garden'],'THAY THẾ','o','<b>Garden</b> → <b>Sports facilities</b> · <i>gave way to</i>'],
 [['canteen'],'CHUYỂN ĐỔI','o','<b>Canteen</b> → <b>Admin offices</b> · <i>was converted into</i>'],
 [['offices'],'GIỮ NGUYÊN','p','<b>Offices</b> không đổi · <i>remained unchanged</i>']];
STEP.sRead=(s,n)=>{const z=n-3;$$('#readSteps li').forEach((li,i)=>{const st=n<=2?n-1:2;li.classList.toggle('done',i<st||n===10);li.classList.toggle('cur',i===st&&n>0&&n<10)});
  clearOv(rA,rB);$$('figcaption',s).forEach(f=>f.classList.toggle('flash',n===1));const note=$('#readNote');note.classList.toggle('in',n>0);
  if(n===1){note.innerHTML='<b>2000 → Now</b>: quá khứ → hiện tại → dùng <b>was / has been</b>.';camTo([rA,rB],null)}
  if(n===2){note.innerHTML='<b>La bàn</b> (góc dưới phải) và <b>Entrance</b> (giữa phía nam): dùng để gọi tên vị trí.';camTo([rA,rB],[380,380,620,240]);[rA,rB].forEach(sv=>[[955,575],[500,560]].forEach(([x,y])=>E('circle',{cx:x,cy:y,r:44,class:'pulse'},ovOf(sv))))}
  if(n>=3&&n<=9){const r=RZ[z];RZ.slice(0,z).forEach(q=>hl(rB,q[0].filter(i=>i!=='lib'||q[1]!=='DI DỜI'),q[2]));hl(rA,r[0],r[2]);hl(rB,r[0],r[2]);tagOn(rB,r[0],r[1],r[2]);camTo([rA,rB],r[0],80);note.innerHTML=`<span class="pgtag ${r[2]}">${z+1}/7</span> ${r[3]}`;SFX.whoosh()}
  if(n===10){camTo([rA,rB],null);RZ.forEach(q=>{hl(rB,q[0],q[2])});[[['lib'],'THAY THẾ','o'],[['ne'],'MỚI','g'],[['cls'],'MỞ RỘNG','b'],[['garden'],'THAY THẾ','o'],[['canteen'],'CHUYỂN ĐỔI','o'],[['offices'],'GIỮ NGUYÊN','p']].forEach(q=>tagOn(rB,q[0],q[1],q[2]));
    note.innerHTML='Nhóm các thay đổi theo loại: mỗi loại thành <b>một câu</b> trong Overview hoặc thân bài.';SFX.chime()}
  if(n===0)camTo([rA,rB],null)};

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

/* ---------- splitting the body: camera shots per method ---------- */
const sA=$('#splitA'),sB=$('#splitB'),SS=[sA,sB];drawPlan(sA,P.CAMPUS0,{fs:32});drawPlan(sB,P.CAMPUS1,{fs:32});
const SPLIT=[['1 · Theo lối vào','Map có Entrance',()=>SS.forEach(v=>halves(v,'Body 1 · bên trái','Body 2 · bên phải')),[
   [[360,420,280,200],'Bắt đầu ở <b>Entrance</b>: đứng ở cửa, nhìn vào trong.',v=>route(v,'M500 570 L500 450 L200 450 M500 450 L800 450')],
   [[0,0,500,620],'<b>Body 1 · bên trái</b>: Offices, Classrooms, Garden.'],
   [[500,0,500,620],'<b>Body 2 · bên phải</b>: Library/Car park, Canteen, khu đông bắc.'],[null,'Toàn cảnh: đi từ lối vào, <b>trái rồi phải</b>.']]],
 ['2 · Theo la bàn','Map chỉ có la bàn',()=>SS.forEach(v=>halves(v,'Body 1 · West','Body 2 · East')),[
   [[830,480,170,140],'Không dùng lối vào → nhìn <b>la bàn</b>.',v=>E('circle',{cx:955,cy:575,r:44,class:'pulse'},ovOf(v))],
   [[0,0,500,620],'<b>Body 1 · West</b>: nửa phía tây.'],[[500,0,500,620],'<b>Body 2 · East</b>: nửa phía đông.'],[null,'Toàn cảnh: viết <b>từ Tây sang Đông</b>.']]],
 ['3 · Theo năm','So sánh hai mốc rõ ràng',()=>{E('rect',{x:4,y:4,width:992,height:612,class:'whole h1'},ovOf(sA));tag(sA,500,40,'Body 1 · 2000','b');E('rect',{x:4,y:4,width:992,height:612,class:'whole h2'},ovOf(sB));tag(sB,500,40,'Body 2 · Now','o')},[
   ['A','<b>Body 1</b>: tả toàn bộ <b>map năm 2000</b>.'],['B','<b>Body 2</b>: tả <b>map hiện tại</b>, so với năm 2000.'],[null,'Hai đoạn, hai mốc thời gian.']]],
 ['4 · Theo mức độ thay đổi','Nhiều khu đổi lớn, có khu giữ nguyên',()=>{},[
   [['ne','it','ne2','cls','garden'],'<b>Body 1 · thay đổi lớn</b>: khu đông bắc, Classrooms, Garden …',v=>hl(v,['ne','it','ne2','cls','garden','canteen','lib'],'o')],
   [['offices'],'<b>Body 2 · thay đổi nhỏ / giữ nguyên</b>: Offices.',v=>hl(v,['offices'],'b')],[null,'Cam: Body 1 · Xanh: Body 2.',v=>{hl(v,['ne','it','ne2','cls','garden','canteen','lib'],'o');hl(v,['offices'],'b')}]]]];
let spM=-1;const spS=$('#sSplit');
$('#splitBtns').innerHTML=SPLIT.map((x,i)=>`<button data-split="${i}"><b>${x[0]}</b><span>${x[1]}</span></button>`).join('');
STEP.sSplit=(s,n)=>{clearOv(sA,sB);$('#splitMaps').classList.remove('fa','fb');if(spM<0)return;const m=SPLIT[spM];m[2]();
  const shot=m[3][n-1];if(!shot){camTo(SS,null);$('#splitCap').innerHTML=`<b>${m[0]}</b> · bấm → để phóng to từng phần.`;return}
  if(shot[0]==='A'||shot[0]==='B'){$('#splitMaps').classList.add(shot[0]==='A'?'fa':'fb');camTo(SS,null)}else camTo(SS,shot[0]);
  if(shot[2])SS.forEach(v=>shot[2](v));$('#splitCap').innerHTML=shot[1];SFX.whoosh()};
$('#splitBtns').addEventListener('click',e=>{const b=e.target.closest('[data-split]');if(!b)return;spM=+b.dataset.split;$$('#splitBtns button').forEach(x=>x.classList.toggle('on',x===b));
  spS.dataset.steps=SPLIT[spM][3].length;setStep(spS,1)});

/* ---------- introduction ---------- */
STEP.sIntro=(s,n)=>{$('#iMine').classList.toggle('in',n>=1);[['1'],['2','2b'],['3']].forEach((ks,i)=>ks.forEach(k=>$$(`.sw[data-k="${k}"]`,s).forEach(x=>x.classList.toggle('c'+i,n>i))));
  $$('#iSwaps span').forEach((x,i)=>x.classList.toggle('in',n>i));if(n)n>=3?SFX.chime():SFX.whoosh()};
const FR=[['Mẫu 1 · hai mốc trong quá khứ / đến hiện tại','The maps illustrate <u>the changes that took place in</u> … <u>between</u> … <u>and</u> ….','The maps illustrate the changes that took place in Nelson City between 2000 and the present day.','two'],
 ['Mẫu 2 · nhấn vào quá trình thay đổi','The maps show <u>how</u> … <u>changed over the period</u>.','The maps show how a university campus changed over the period from 2000 to the present day.','period'],
 ['Mẫu 3 · đề có tương lai','The diagram illustrates <u>the current layout of</u> …, <u>as well as showing the way it will appear</u> ….','The diagram illustrates the current layout of a town centre, as well as showing the way it will appear in 2030.','future']];
$('#frames3').innerHTML=FR.map(f=>`<div class="fr"><svg viewBox="0 0 320 150" class="frsvg" data-ill="${f[3]}"></svg><div class="frt"><b>${f[0]}</b><p class="frm">${f[1]}</p><p class="fex">${f[2]}</p></div></div>`).join('');
function ill(svg){svg.innerHTML='';const k=svg.dataset.ill;
  const mini=(x,lab,col,dash)=>{const g=E('g',{},svg);E('rect',{x,y:22,width:110,height:90,rx:8,fill:'#fff',stroke:col,'stroke-width':3,'stroke-dasharray':dash?'8 6':'0'},g);const t=E('text',{x:x+55,y:138,'text-anchor':'middle','font-size':16,'font-weight':800,fill:col},g);t.textContent=lab;return g};
  if(k==='two'){mini(10,'2000','#16213A');mini(200,'Now','#1F5FD6');E('rect',{x:25,y:40,width:40,height:30,rx:4,fill:'#E1F3EA',stroke:'#18794E','stroke-width':2},svg);
    const a=E('path',{d:'M128 67 H190 M180 57 L192 67 L180 77',stroke:'#C25E0C','stroke-width':5,fill:'none','stroke-linecap':'round'},svg);an(a,[{opacity:0,transform:'translateX(-20px)'},{opacity:1,transform:'none'}],{duration:700});
    const r=E('rect',{x:215,y:40,width:40,height:30,rx:4,fill:'#FCEBDD',stroke:'#C25E0C','stroke-width':2},svg);const r2=E('rect',{x:265,y:70,width:30,height:30,rx:4,fill:'#E3ECFC',stroke:'#1F5FD6','stroke-width':2},svg);
    [r,r2].forEach((q,i)=>{q.style.transformBox='fill-box';q.style.transformOrigin='center';an(q,[{transform:'scale(0)'},{transform:'scale(1)'}],{delay:600+i*300})})}
  if(k==='period'){E('line',{x1:20,y1:110,x2:300,y2:110,stroke:'#16213A','stroke-width':4},svg);[[20,'2000'],[300,'Now']].forEach(([x,t])=>{E('circle',{cx:x,cy:110,r:7,fill:'#16213A'},svg);const tx=E('text',{x,y:138,'text-anchor':'middle','font-size':15,'font-weight':800},svg);tx.textContent=t});
    const br=E('path',{d:'M30 92 V84 H290 V92',stroke:'#C25E0C','stroke-width':4,fill:'none'},svg);const bt=E('text',{x:160,y:76,'text-anchor':'middle','font-size':15,'font-weight':800,fill:'#C25E0C'},svg);bt.textContent='over the period';
    an(br,[{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0 0 0)'}],{duration:1500,easing:'ease-in-out'});
    for(let i=0;i<5;i++){const b=E('rect',{x:45+i*52,y:100-(i+1)*9,width:30,height:(i+1)*9,fill:'#E3ECFC',stroke:'#1F5FD6','stroke-width':2},svg);b.style.transformBox='fill-box';b.style.transformOrigin='bottom';an(b,[{transform:'scaleY(0)'},{transform:'scaleY(1)'}],{delay:300+i*250})}}
  if(k==='future'){mini(10,'Now','#16213A');mini(200,'2030','#5B3EA6',true);E('rect',{x:25,y:40,width:40,height:30,rx:4,fill:'#E1F3EA',stroke:'#18794E','stroke-width':2},svg);E('rect',{x:215,y:40,width:40,height:30,rx:4,fill:'#E1F3EA',stroke:'#18794E','stroke-width':2},svg);
    E('path',{d:'M128 67 H190 M180 57 L192 67 L180 77',stroke:'#5B3EA6','stroke-width':5,fill:'none','stroke-dasharray':'6 6'},svg);
    const p=E('rect',{x:262,y:62,width:36,height:38,rx:4,fill:'none',stroke:'#5B3EA6','stroke-width':3,'stroke-dasharray':'6 4'},svg);an(p,[{opacity:0},{opacity:1},{opacity:.3},{opacity:1}],{duration:1600,delay:400});
    const t=E('text',{x:280,y:56,'text-anchor':'middle','font-size':12,'font-weight':800,fill:'#5B3EA6'},svg);t.textContent='proposed'}}
STEP.sIntro2=(s,n)=>{$$('.fr',s).forEach((f,i)=>{f.classList.toggle('in',i<n);f.classList.toggle('cur',i===n-1);if(i===n-1)ill($('svg',f))});if(n)SFX.pop(n+1)};

/* ---------- overview sentence 1 (zoom to the biggest changes) ---------- */
const o1A=$('#ov1A'),o1B=$('#ov1B'),O1=[o1A,o1B];drawPlan(o1A,P.CAMPUS0,{fs:32});drawPlan(o1B,P.CAMPUS1,{fs:32});
const fills=$$('#sOver1 .fill');fills.forEach(f=>f.dataset.o=f.textContent);
STEP.sOver1=(s,n)=>{fills.forEach((f,i)=>{const on=n>=i+2;f.textContent=on?f.dataset.f:f.dataset.o;f.classList.toggle('on',on);f.classList.toggle('cur',n===i+2)});clearOv(o1A,o1B);
  if(n===1){O1.forEach(v=>tag(v,500,40,'Thay đổi nào lớn nhất?','r'));camTo(O1,null)}
  if(n===2)camTo(O1,null);
  if(n===3){O1.forEach(v=>hl(v,['ne','it','ne2'],'o'));camTo(O1,['ne','it','ne2'],60)}
  if(n===4){O1.forEach(v=>hl(v,['cls'],'o'));camTo(O1,['cls'],60)}
  if(n===5){O1.forEach(v=>hl(v,['ne','it','ne2','cls'],'o'));camTo(O1,null)}
  if(n)n>=2&&n<=4?SFX.ding():SFX.pop(3)};

/* ---------- overview sentence 2: motion graphics for each meaning ---------- */
const MEAN=[['Nhà ở, căn hộ tăng','the area can accommodate an increasing population','house'],['Nhà máy thay đất nông nghiệp','the area became industrialised','factory'],['Tiện ích được thêm vào','the area was modernised and the standard of living improved','modern']];
$('#mean3a').innerHTML=MEAN.map((m,i)=>`<div class="mcard" data-i="${i}"><svg viewBox="0 0 300 170"></svg><b>${m[0]}</b><i>${m[1]}</i><button class="b sm" data-replay="${i}">↻ Xem lại</button></div>`).join('');
function playMean(i){const svg=$(`.mcard[data-i="${i}"] svg`);svg.innerHTML='';E('rect',{x:0,y:150,width:300,height:20,fill:'#D9DFE7'},svg);const kind=MEAN[i][2];
  const pop=(el,d)=>{el.style.transformBox='fill-box';el.style.transformOrigin='bottom';an(el,[{transform:'scale(0)',opacity:0},{transform:'scale(1)',opacity:1}],{delay:d,duration:600})};
  if(kind==='house'){for(let k=0;k<6;k++){const g=E('g',{},svg);const x=12+k*48;E('rect',{x,y:108,width:36,height:42,fill:'#FCEBDD',stroke:'#C25E0C','stroke-width':2.5},g);E('path',{d:`M${x-4} 110 L${x+18} 88 L${x+40} 110Z`,fill:'#C25E0C'},g);pop(g,k*220)}
    for(let k=0;k<16;k++){const c=E('circle',{cx:14+k*18,cy:162,r:5,fill:'#1F5FD6'},svg);c.style.transformBox='fill-box';c.style.transformOrigin='center';an(c,[{transform:'scale(0)'},{transform:'scale(1)'}],{delay:1400+k*80,duration:300})}
    const t=E('text',{x:150,y:40,'text-anchor':'middle','font-size':22,'font-weight':800,fill:'#1F5FD6'},svg);t.textContent='population ↑';an(t,[{opacity:0},{opacity:1}],{delay:2600,duration:500});setTimeout(()=>SFX.pop(5),1400)}
  if(kind==='factory'){const f=E('g',{},svg);for(let k=0;k<6;k++)E('rect',{x:10+k*48,y:105,width:44,height:45,fill:k%2?'#E9D98B':'#CFE6A8'},f);
    an(f,[{opacity:1},{opacity:0}],{delay:900,duration:700});
    const fac=E('g',{},svg);E('path',{d:'M60 150 V100 L100 120 V100 L140 120 V100 L180 120 V150Z',fill:'#7D8597'},fac);E('rect',{x:190,y:60,width:22,height:90,fill:'#4A5670'},fac);pop(fac,1300);
    for(let k=0;k<3;k++){const c=E('circle',{cx:201,cy:52,r:10,fill:'#B7C3DA'},svg);an(c,[{transform:'translate(0,0)',opacity:0},{transform:'translate(10px,-10px)',opacity:.9,offset:.3},{transform:'translate(30px,-45px)',opacity:0}],{delay:2000+k*600,duration:1800,iterations:Infinity,easing:'ease-out',fill:'none'})}
    const t=E('text',{x:150,y:30,'text-anchor':'middle','font-size':20,'font-weight':800,fill:'#4A5670'},svg);t.textContent='farmland → industry';an(t,[{opacity:0},{opacity:1}],{delay:1700,duration:500});setTimeout(()=>SFX.thud(),1300)}
  if(kind==='modern'){const ic=[[30,'#1F5FD6','school'],[100,'#B42318','hospital'],[170,'#18794E','park'],[240,'#C25E0C','bus']];
    ic.forEach(([x,c,n],k)=>{const g=E('g',{},svg);if(n==='park'){E('rect',{x:x+20,y:120,width:8,height:30,fill:'#7A5230'},g);E('circle',{cx:x+24,cy:110,r:22,fill:c},g)}
      else if(n==='bus'){E('rect',{x,y:110,width:52,height:32,rx:6,fill:c},g);E('circle',{cx:x+12,cy:144,r:6,fill:'#16213A'},g);E('circle',{cx:x+40,cy:144,r:6,fill:'#16213A'},g)}
      else{E('rect',{x,y:96,width:50,height:54,fill:'#fff',stroke:c,'stroke-width':3},g);if(n==='hospital')E('path',{d:`M${x+25} 108 v24 M${x+13} 120 h24`,stroke:c,'stroke-width':6},g);else{E('path',{d:`M${x} 96 L${x+25} 78 L${x+50} 96`,fill:c},g)}}
      pop(g,k*350)});
    E('rect',{x:30,y:30,width:240,height:16,rx:8,fill:'#EEF1F5'},svg);const bar=E('rect',{x:30,y:30,width:240,height:16,rx:8,fill:'#18794E'},svg);an(bar,[{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0 0 0)'}],{delay:1500,duration:1200,easing:'ease-out'});
    const t=E('text',{x:150,y:70,'text-anchor':'middle','font-size':17,'font-weight':800,fill:'#18794E'},svg);t.textContent='standard of living ↑';an(t,[{opacity:0},{opacity:1}],{delay:2000,duration:500});setTimeout(()=>SFX.chime(),1500)}}
$('#mean3a').addEventListener('click',e=>{const b=e.target.closest('[data-replay]');if(b)playMean(+b.dataset.replay)});
STEP.sOver2=(s,n)=>{$$('.mcard',s).forEach((c,i)=>{c.classList.toggle('in',i<n);c.classList.toggle('cur',i===n-1&&n<=3);c.classList.toggle('pick',n>=4&&i===2);c.classList.toggle('dim',n>=4&&i!==2)});
  if(n>=1&&n<=3)playMean(n-1);$('#ovFinal').classList.toggle('in',n>=4);$('.nos',s).classList.toggle('in',n>=5);if(n>=4)SFX.ding()};

/* ---------- reveal rows (Overview 6→7, pairs) ---------- */
function rows(el,data){el.innerHTML=data.map((p,i)=>`<div class="pair"><div class="p6">${mk(p[0])}</div><button class="up b7" data-up aria-label="Nâng band">▸</button><div class="p7 b7"><p>${mk(p[1])}</p><span class="strtag">${p[2]}</span></div></div>`).join('')}
document.addEventListener('click',e=>{const b=e.target.closest('[data-up]');if(b){const r=b.closest('.pair');r.classList.toggle('on');r.classList.contains('on')?SFX.chime():SFX.tick();return}
  const a=e.target.closest('[data-act="pair-all"]');if(!a)return;const rs=$$('.pair',a.closest('.slide')),on=!rs.every(r=>r.classList.contains('on'));rs.forEach((r,i)=>setTimeout(()=>{r.classList.toggle('on',on);if(on)SFX.pop(2+i)},i*260))});
rows($('#ovPairs'),[
 ['Overall, there were many changes in the campus.','Overall, the campus <cl>underwent some significant changes</cl>, <rc>the most important of which were</rc> the clearance of trees and the expansion of the classrooms.','many changes → underwent significant changes · nêu 2 thay đổi lớn bằng “of which”'],
 ['Overall, the library was removed, a car park was built <cj>and</cj> the trees were cleared.','Overall, the most striking developments were <nz>the loss of green space</nz> and <nz>the growth of teaching facilities</nz>.','Liệt kê chi tiết → gom thành xu hướng bằng danh từ'],
 ['The campus is better now, <cj>so</cj> students are happy.','These changes have modernised the campus, <vi>providing students with better facilities</vi>.','so → V-ing chỉ kết quả · better → modernised'],
 ['The campus changed a lot, <cj>but</cj> the offices stayed the same.','<ct>While the offices remained unchanged</ct>, the rest of the campus was comprehensively redeveloped.','but → While · changed a lot → comprehensively redeveloped']]);

/* ---------- vocabulary ---------- */
const VOC=[[['was built / constructed','được xây dựng'],['was added','được thêm vào'],['was developed into','được phát triển thành'],['was demolished','bị phá bỏ'],['was removed','bị dỡ bỏ'],['was cleared','bị chặt / dọn sạch'],['was replaced by','được thay bằng'],['gave way to','nhường chỗ cho'],['was converted into','được chuyển đổi thành'],['was extended','được mở rộng'],['was widened','được nới rộng'],['was reduced in size','bị thu nhỏ'],['was relocated to','được dời tới'],['was shifted from … to …','được chuyển từ … sang …'],['remained the same','giữ nguyên'],['was retained','được giữ lại'],['was renovated','được cải tạo'],['underwent redevelopment','được tái phát triển']],
 [['in the north-west of','ở phía tây bắc của'],['to the east of','về phía đông của'],['in the centre of','ở trung tâm của'],['on the southern edge','ở rìa phía nam'],['next to / beside','bên cạnh'],['opposite','đối diện'],['between … and …','giữa … và …'],['adjacent to','liền kề với'],['near the entrance','gần lối vào'],['in the north-east corner','ở góc đông bắc'],['along the road','dọc theo con đường'],['surrounded by','được bao quanh bởi']],
 [['Additionally,','Thêm vào đó'],['A further change was …','Một thay đổi nữa là'],['Alongside this,','Song song với đó'],['Meanwhile,','Trong khi đó'],['By contrast,','Ngược lại'],['Turning to …','Chuyển sang …'],['As for …','Còn về …'],['In terms of …','Về mặt …'],['Overall,','Nhìn chung'],['✗ Also, / Then, / Another change is','Tránh lặp đi lặp lại']]];
function voc(i){$('#vocGrid').innerHTML=VOC[i].map(p=>`<button class="flip"><span class="in2"><span class="f">${p[0]}</span><span class="bk">${p[1]}</span></span></button>`).join('');$$('[data-voc]').forEach(b=>b.classList.toggle('on',+b.dataset.voc===i))}
voc(0);$$('[data-voc]').forEach(b=>b.onclick=()=>{voc(+b.dataset.voc);SFX.whoosh()});
$('#vocGrid').addEventListener('click',e=>{const f=e.target.closest('.flip');if(!f)return;f.classList.toggle('on');SFX.tick()});

/* ---------- 15 band-6 structures, 3 per page, each with its Band 7 upgrade ---------- */
const S15=[['The construction of … marked a significant change in …','The construction of a basketball court marked a significant change in the southern area.','The construction of a basketball court, <rc>which replaced an unused lawn</rc>, marked a significant change in the southern area.','Mệnh đề quan hệ'],
 ['… was converted into …','The sports facility was converted into administrative offices.','<cp>While</cp> the sports facility was converted into administrative offices, the library remained unchanged.','Câu ghép while'],
 ['The … was relocated to …','The sports facility was relocated to the south-west of the university.','<vi>Having been located in the north</vi>, the sports facility was relocated to the south-west of the university.','Having + V3'],
 ['The most noticeable change in the map of … is …','The most noticeable change in the map of Hanoi University is the removal of the sports facility.','<cl>It was the removal of the sports facility that</cl> marked the most noticeable change at Hanoi University.','Câu nhấn mạnh'],
 ['The old … was demolished to make way for …','The old canteen was demolished to make way for new administrative offices.','The old canteen, <rc>which had stood next to the main gate</rc>, was demolished to make way for new administrative offices.','Mệnh đề quan hệ'],
 ['… underwent a substantial redevelopment.','The southern campus underwent a substantial redevelopment.','<cp>Not only did</cp> the southern campus undergo a substantial redevelopment, <cp>but</cp> its road network <cp>was also</cp> extended.','Not only … but also'],
 ['The area of … was expanded to include …','The area of the sports facility was expanded to include administrative spaces.','The sports facility was expanded to include administrative spaces, <vi>almost doubling in size</vi>.','V-ing kết quả'],
 ['There was an addition of … in …','There was an addition of a microwave in the kitchen area.','A microwave was added to the kitchen area, <vi>with a dining table being placed beside it</vi>.','with + V-ing'],
 ['The … was replaced by …','The sports facility was replaced by administrative offices.','<ct>In contrast to the library, which remained intact</ct>, the sports facility was replaced by administrative offices.','In contrast to …'],
 ['The layout of … was significantly altered.','The layout of the southern campus was significantly altered.','<ct>Although the northern campus remained largely unchanged</ct>, the layout of the southern campus was significantly altered.','Although …'],
 ['… was newly constructed / built.','A bathroom was newly constructed.','A bathroom was newly constructed, <vi>replacing the storage cupboard that had occupied the corner</vi>.','V-ing replacing'],
 ['… has been transformed from … into …','The building has been transformed from a library into a cafe.','The building, <rc>which once housed a library</rc>, has been transformed into a cafe.','Mệnh đề quan hệ'],
 ['… was developed into …','The house was developed into multi-storey apartments.','The house was developed into multi-storey apartments, <vi>suggesting a growing need for housing</vi>.','V-ing suggesting'],
 ['The … was renovated / overhauled.','The bathroom was renovated.','The bathroom was renovated, <cp>while</cp> the bedrooms remained unchanged.','Câu ghép while'],
 ['… was shifted from … to …','The round-shaped table was shifted from the top to the bottom.','The round-shaped table was shifted from the top to the bottom, <vi>freeing up space for a sofa</vi>.','V-ing kết quả']];
STEP.s15=(s,n)=>{const pg=S15.slice(n*3,n*3+3);$('#pg15').textContent=`${n*3+1}–${n*3+3} / 15`;
  $('#t15').innerHTML=pg.map((x,i)=>`<tr style="animation-delay:${i*.12}s"><td class="n">${n*3+i+1}</td><td class="fm">${esc(x[0])}</td><td class="eg">${x[1]}</td><td class="up7 b7"><button class="b sm" data-t15>▸ Nâng Band 7</button><div class="u7"><p>${mk(x[2])}</p><span class="strtag">${x[3]}</span></div></td></tr>`).join('');if(n)SFX.whoosh()};
document.addEventListener('click',e=>{const b=e.target.closest('[data-t15]');if(b){const td=b.closest('td');td.classList.toggle('on');td.classList.contains('on')?SFX.chime():SFX.tick();return}
  if(e.target.closest('[data-act="t15-all"]')){const all=$$('#t15 td.up7'),on=!all.every(t=>t.classList.contains('on'));all.forEach((t,i)=>setTimeout(()=>{t.classList.toggle('on',on);if(on)SFX.pop(3+i)},i*250))}});

/* ---------- band 6 vs band 7 pairs ---------- */
rows($('#pairs'),[['The library was removed, <cj>and</cj> a car park was built.','The library, <rc>which had stood by the entrance</rc>, was removed, <vi>making way for a car park</vi>.','and → mệnh đề quan hệ + V-ing'],
 ['The trees were cleared, <cj>and</cj> a library was built there.','The trees were cleared, <vi>with a library being built in their place</vi>.','and → with + V-ing'],
 ['The farmland became housing, <cj>and</cj> the factory was demolished.','The farmland was converted into housing, <cp>while the factory to the south was demolished</cp>.','and → while'],
 ['The garden was replaced, <cj>but</cj> the offices stayed the same.','<ct>Although the garden was replaced by sports facilities</ct>, the offices remained unchanged.','but → Although'],
 ['Many places changed, <cj>but</cj> the north changed the most.','<cl>It was the northern section that</cl> underwent the most dramatic change.','but … the most → It was … that']]);

/* ---------- each change on the map (zoom) ---------- */
const omA=$('#omA'),omB=$('#omB'),OM2=[omA,omB];drawPlan(omA,P.CAMPUS0,{fs:32});drawPlan(omB,P.CAMPUS1,{fs:32});
const OM=[['Library → Car park',['lib'],'The library was demolished, <cj>and</cj> a car park was built.','The library, <rc>which had stood next to the entrance</rc>, was demolished, <vi>making way for a car park</vi>.','and → mệnh đề quan hệ + V-ing'],
 ['Cây → Library, IT centre',['ne','it','ne2'],'The trees were cut down, <cj>and</cj> a library and an IT centre were built.','Most of the trees in the north-east were cleared, <vi>with a new library and an IT centre being built in their place</vi>.','and → with + V-ing'],
 ['Library dời đi',['lib','ne'],'The library was near the entrance, <cj>but</cj> now it is in the north-east.','<vi>Having stood by the entrance in 2000</vi>, the library was relocated to the north-eastern corner.','but now → Having + V3'],
 ['Classrooms mở rộng',['cls'],'The classrooms were extended, <cj>so</cj> they are bigger now.','The classrooms in the north-west were extended southwards, <vi>almost doubling in size</vi>.','so → V-ing kết quả'],
 ['Garden → Sports',['garden'],'The garden was removed, <cj>and</cj> sports facilities were built.','<cl>Gone is the garden that had once occupied the north of the campus; in its place stand</cl> new sports facilities.','and → câu đảo Gone is …'],
 ['Canteen · Offices',['canteen','offices'],'The canteen was converted into administrative offices, <cj>but</cj> the offices stayed the same.','<ct>In contrast to the offices in the south-west, which remained unchanged</ct>, the canteen was converted into administrative offices.','but → In contrast to …']];
$('#omBtns').innerHTML=OM.map((o,i)=>`<button data-om="${i}">${o[0]}</button>`).join('');
$('#omBtns').addEventListener('click',e=>{const b=e.target.closest('[data-om]');if(!b)return;const o=OM[+b.dataset.om];$$('#omBtns button').forEach(x=>x.classList.toggle('on',x===b));
  clearOv(omA,omB);hl(omA,o[1],'o');hl(omB,o[1],'o');camTo(OM2,o[1],90);
  const p6=$('#om6'),p7=$('#om7');p6.innerHTML=mk(o[2]);p7.innerHTML=mk(o[3]);$('#omStr').textContent=o[4];
  [p6.parentNode,p7.parentNode].forEach((c,i)=>c.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{duration:450,delay:i*500,fill:'both',easing:'ease-out'}));
  SFX.whoosh();setTimeout(()=>{if(!hide7())SFX.ding()},500)});

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
b7(0);

/* ---------- applying: one paragraph ---------- */
const AP6=[['The library by the entrance was demolished, <cj>and</cj> a car park was built there.','Thay thế → mệnh đề quan hệ + V-ing'],['The trees in the north-east were cleared, <cj>and</cj> a new library and an IT centre were built.','Kéo theo nhau → with + V-ing'],['The offices did not change.','Không đổi → giữ một câu đơn'],['The north-east changed the most.','Lớn nhất → It was … that']];
$('#ap6').innerHTML=AP6.map(x=>`<span class="ap6line"><span class="s6">${mk(x[0])}</span> <span class="sug">${x[1]}</span></span>`).join('');
$('#ap7').innerHTML=mk('<cl>It was the north-eastern corner that</cl> underwent the most dramatic change: most of the trees there were cleared, <vi>with a new library and an IT centre being built in their place</vi>. Near the entrance, the old library, <rc>which had stood beside the main path</rc>, was demolished to make way for a car park. <span class="simple">The offices in the south-west remained unchanged.</span>')+'<span class="count"><span class="hs cl">Nhấn mạnh ×1</span><span class="hs vi">V-ing ×1</span><span class="hs rc">Mệnh đề quan hệ ×1</span><span class="simple">Câu đơn ×1</span></span>';
STEP.sApply=(s,n)=>{$$('#apSteps li').forEach((li,i)=>{li.classList.toggle('done',i<n-1);li.classList.toggle('cur',i===n-1)});
  s.classList.toggle('u',n>=1);s.classList.toggle('sg',n>=2);$('.a7',s).classList.toggle('in',n>=3);s.classList.toggle('chk',n>=4);
  if(n)n===3?SFX.chime():n===4?SFX.ding():SFX.pop(n+1)};

/* ---------- activity ---------- */
const ACT=[['The northern field was used for agriculture, <cj>but</cj> it was converted into a housing estate.','The northern field, <rc>which had previously been used for agriculture</rc>, was converted into a housing estate.'],
 ['A multi-storey car park was built, <cj>and</cj> it replaced the open wasteland to the east.','A multi-storey car park was built, <vi>replacing the open wasteland that had previously stood to the east</vi>.'],
 ['The forest to the west was cleared, <cj>and</cj> the riverbank was developed.','<cp>Not only was</cp> the forest to the west cleared, <cp>but</cp> the riverbank <cp>was also</cp> developed.'],
 ['The church remained unchanged, <cj>but</cj> the area around it was redeveloped.','<ct>Although the church remained unchanged</ct>, the surrounding area was comprehensively redeveloped.'],
 ['The market building was in the centre, <cj>but</cj> it was demolished.','<ct>Despite its central location</ct>, the original market building was demolished.'],
 ['The open fields disappeared, <cj>so</cj> an industrial estate was built there.','<cl>Gone were</cl> the open fields; <cl>in their place stood</cl> a sprawling industrial estate.']];
$('#acts').innerHTML=ACT.map((a,i)=>`<div class="act"><b class="n">${i+1}</b><div class="a6">${mk(a[0])}</div><button class="b sm b7" data-ans>Đáp án</button><div class="a7 b7">${mk(a[1])}</div></div>`).join('');
$('#acts').addEventListener('click',e=>{const b=e.target.closest('[data-ans]');if(!b)return;const r=b.closest('.act');r.classList.toggle('on');b.classList.toggle('on');if(r.classList.contains('on'))SFX.chime()});

/* ---------- complete essays ---------- */
const ESS={NELSON:{b6:['On the western side, the train station was removed, <cj>and</cj> a new station was built in the centre, next to the university. A hall of residence was built in the north-west, <cj>and</cj> the old market was replaced by a new shop.',
  'On the eastern side, a new covered market was built. The trees beside the university were cleared, <cj>so</cj> a large shopping centre was built there. The road along the southern edge was converted into a pedestrian-only zone, <cj>and</cj> a bike rental scheme was added in the city centre. The port remained unchanged, <cj>but</cj> restaurants and a bar and club area were added nearby.']},
 CC:{b6:['On the western side, the garden was replaced by indoor sports facilities, <cj>but</cj> the car park remained the same. The hall seats 100 people, <cj>and</cj> it remained unchanged. The entrance and reception area stayed in the same position.',
  'In the north, the storage room was reduced in size, <cj>and</cj> toilets were added beside it. The four offices and the storage room were removed, <cj>and</cj> a large cafe area was built. The kitchen remained in place. In the south-east, the coffee bar and toilets were replaced by an office.']}};
Object.keys(ESS).forEach(k=>{const w=T[k].write.map(x=>x[5]);ESS[k].intro=w[0];ESS[k].ov=w[1]+' '+w[2];ESS[k].b7=[w[3]+' '+w[4],w.slice(5).join(' ')]});
const words=h=>h.replace(/<[^>]+>/g,'').split(/\s+/).filter(Boolean).length;
function essayVer(s,v){const d=ESS[s.dataset.essay];const body=v===7?d.b7:d.b6;const all=[d.intro,d.ov,...body];
  $('.model',s).innerHTML=all.map((p,i)=>`<p class="${i>1?'body':''}">${mk(p)}</p>`).join('')+`<span class="wc">${all.reduce((a,p)=>a+words(p),0)} từ</span>`;
  $$('[data-ev]',s).forEach(b=>b.classList.toggle('on',+b.dataset.ev===v));s.dataset.v=v;
  $$('.model .body',s).forEach((p,i)=>p.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:400,delay:i*150,fill:'both'}))}
$$('.essayslide').forEach(s=>{essayVer(s,7);$('.legend7',s).innerHTML=Object.entries(ST).map(([k,v])=>`<span class="hs ${k}">${v}</span>`).join('')+'<span class="hs cj">and / but / so (Band 6)</span><p class="sub">Bấm “Thân bài Band 6” để so sánh cùng nội dung nối bằng and / but / so.</p>';
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
    case 'cam-out':{const s=b.closest('.slide');camTo($$('svg.plan',s),null);SFX.whoosh();break}
    case 'om-out':camTo(OM2,null);SFX.whoosh();break;
    case 'flip-all':{const all=$$('.flip',b.closest('.slide')),on=!all.every(f=>f.classList.contains('on'));all.forEach((f,i)=>setTimeout(()=>f.classList.toggle('on',on),i*35));SFX.whoosh();break}}});

Object.keys(STEP).forEach(id=>{const s=$('#'+id);if(s&&id!=='sSplit')STEP[id](s,0)});
SFX.stop();
const m=/^#s(\d+)$/.exec(location.hash);show(m?+m[1]-1:0);
})();
