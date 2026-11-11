/* Animated SVG illustrations for the vocabulary (viewBox 400×300, ground at y=250).
   window.PICS[word] -> SVG markup; window.ICONS[key] -> small line icon for the answer flower.
   Animated groups carry a class (see extra.css, .pic …) and a transform-origin in viewBox units. */
(function(){
const K={ink:'#16213A',skin:'#F3C6A0',blue:'#3E6FD8',sky:'#9CC3F5',orange:'#E9925A',green:'#4CAF7A',leaf:'#6BB36B',red:'#D9534F',
  yellow:'#F2B84B',purple:'#8E6CC8',pink:'#E8618C',gray:'#C9D1DC',dark:'#5A6478',brown:'#A0704A',white:'#FFFFFF',teal:'#2BA39A',paper:'#FFF8E6'};
const A=(cls,ox,oy,inner,d=0,dur)=>`<g class="${cls}" style="transform-origin:${ox}px ${oy}px;animation-delay:${d}s${dur?`;animation-duration:${dur}s`:''}">${inner}</g>`;
const ln=(x1,y1,x2,y2,c=K.ink,w=8)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
const pl=(pts,c=K.ink,w=8,f='none')=>`<polyline points="${pts}" fill="${f}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const ci=(x,y,r,f,x2='')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${f}" ${x2}/>`;
const el=(x,y,rx,ry,f,x2='')=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${f}" ${x2}/>`;
const re=(x,y,w,h,f,r=0,x2='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${f}" ${x2}/>`;
const pa=(d,f,x2='')=>`<path d="${d}" fill="${f}" ${x2}/>`;
const st=(c=K.ink,w=4)=>`stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
const tx=(x,y,t,sz=20,f=K.ink,x2='')=>`<text x="${x}" y="${y}" font-size="${sz}" font-weight="800" text-anchor="middle" fill="${f}" font-family="Be Vietnam Pro, Arial, sans-serif" ${x2}>${t}</text>`;
const sh=(x,y=252,w=60)=>el(x,y,w,7,K.ink,'opacity=".08"');

/* ---- a simple person, feet at (x,y) ---- */
function person(x,y,o={}){const s=o.s||1,c=o.c||K.blue,sk=K.skin,lc=o.leg||K.ink,w=8*s;
  const hy=y-110*s,sy=y-86*s,hip=y-44*s;let legs;
  if(o.sit)legs=pl(`${x-4*s},${hip} ${x+28*s},${hip} ${x+28*s},${y}`,lc,w)+pl(`${x+6*s},${hip} ${x+34*s},${hip} ${x+34*s},${y}`,lc,w);
  else if(o.run)legs=A('a-swing',x,hip,ln(x,hip,x,y,lc,w),0,o.run)+A('a-swing',x,hip,ln(x,hip,x,y,lc,w),-o.run/2,o.run);
  else legs=ln(x-6*s,hip,x-10*s,y,lc,w)+ln(x+6*s,hip,x+10*s,y,lc,w);
  const E={down:[[-22,-50],[22,-50]],up:[[-28,-140],[28,-140]],out:[[-46,-88],[46,-88]],front:[[22,-64],[30,-66]],hold:[[16,-70],[30,-74]],wave:[[-22,-50],[34,-140]],hips:[[-26,-60],[26,-60]]}[o.arms||'down'];
  const arm=i=>{const sx=x+(i?13:-13)*s,e=E[i],L=ln(sx,sy,x+e[0]*s,y+e[1]*s,sk,w),an=o.anim&&o.anim[i];return an?A(an,sx,sy,L,i*.25):L};
  const m=o.face||'smile',ex=x-6*s,ex2=x+6*s,ey=hy-1*s;
  const eyes=m==='sleep'?ln(ex-3*s,ey,ex+3*s,ey,K.ink,2*s)+ln(ex2-3*s,ey,ex2+3*s,ey,K.ink,2*s):ci(ex,ey,2.4*s,K.ink)+ci(ex2,ey,2.4*s,K.ink);
  const mouth={smile:`<path d="M${x-6*s} ${hy+6*s} Q${x} ${hy+12*s} ${x+6*s} ${hy+6*s}" fill="none" ${st(K.ink,2.2*s)}/>`,
    sad:`<path d="M${x-6*s} ${hy+10*s} Q${x} ${hy+4*s} ${x+6*s} ${hy+10*s}" fill="none" ${st(K.ink,2.2*s)}/>`,
    wow:ci(x,hy+8*s,3.4*s,K.ink),sleep:ci(x,hy+8*s,2*s,K.ink),
    flat:ln(x-5*s,hy+8*s,x+5*s,hy+8*s,K.ink,2.2*s),grin:`<path d="M${x-7*s} ${hy+5*s} Q${x} ${hy+15*s} ${x+7*s} ${hy+5*s}Z" fill="${K.ink}"/>`,
    angry:ln(x-5*s,hy+9*s,x+5*s,hy+9*s,K.ink,2.2*s)+ln(ex-4*s,ey-6*s,ex+3*s,ey-3*s,K.ink,2*s)+ln(ex2+4*s,ey-6*s,ex2-3*s,ey-3*s,K.ink,2*s)}[m];
  const hair=`<path d="M${x-16*s} ${hy-2*s} A${16*s} ${16*s} 0 0 1 ${x+16*s} ${hy-2*s} Q${x} ${hy-8*s} ${x-16*s} ${hy-2*s}Z" fill="${o.hair||K.ink}"/>`;
  const cheeks=m==='angry'?ci(ex-3*s,hy+5*s,4*s,K.red,'opacity=".5"')+ci(ex2+3*s,hy+5*s,4*s,K.red,'opacity=".5"'):'';
  return legs+re(x-15*s,y-96*s,30*s,54*s,c,10*s)+arm(0)+arm(1)+ci(x,hy,16*s,o.skin||sk)+hair+eyes+mouth+cheeks;}

/* ---- props ---- */
const ball=(x,y,r=14)=>ci(x,y,r,K.white,st(K.ink,3))+pa(`M${x} ${y-r*.45}l${r*.42} ${r*.3}-${r*.16} ${r*.5}h-${r*.52}l-${r*.16}-${r*.5}z`,K.ink);
const book=(x,y,w=70,h=18,c=K.blue)=>re(x,y,w,h,c,3)+re(x+w-10,y+3,6,h-6,K.white,1);
const openBook=(x,y,w=130,c=K.blue)=>pa(`M${x-w/2} ${y-6}Q${x-w/4} ${y-20} ${x} ${y-6}V${y+40}Q${x-w/4} ${y+26} ${x-w/2} ${y+40}Z`,K.white,st(K.ink,3))+pa(`M${x+w/2} ${y-6}Q${x+w/4} ${y-20} ${x} ${y-6}V${y+40}Q${x+w/4} ${y+26} ${x+w/2} ${y+40}Z`,K.white,st(K.ink,3))+pa(`M${x-w/2-6} ${y+40}Q${x-w/4} ${y+30} ${x} ${y+46}Q${x+w/4} ${y+30} ${x+w/2+6} ${y+40}V${y+48}H${x-w/2-6}Z`,c);
const lines=(x,y,w,n,gap=10,c=K.gray)=>Array.from({length:n},(_,i)=>ln(x,y+i*gap,x+w*(i%3===2?.6:1),y+i*gap,c,4)).join('');
const note=(x,y,c=K.purple,s=1)=>el(x,y,9*s,7*s,c,`transform="rotate(-20 ${x} ${y})"`)+ln(x+8*s,y-2*s,x+8*s,y-34*s,c,3.5*s)+pa(`M${x+8*s} ${y-34*s}q${12*s} ${6*s} ${10*s} ${18*s}`,'none',st(c,3.5*s));
const heart=(x,y,s=1,c=K.pink)=>pa(`M${x} ${y+12*s}C${x-22*s} ${y-2*s} ${x-12*s} ${y-20*s} ${x} ${y-8*s}C${x+12*s} ${y-20*s} ${x+22*s} ${y-2*s} ${x} ${y+12*s}Z`,c);
const cloud=(x,y,s=1,c=K.white,x2='')=>`<g ${x2}>${ci(x-18*s,y,14*s,c)+ci(x,y-8*s,18*s,c)+ci(x+18*s,y,14*s,c)+re(x-30*s,y,60*s,14*s,c,7*s)}</g>`;
const star=(x,y,r=10,c=K.yellow)=>pa(`M${x} ${y-r}L${x+r*.3} ${y-r*.3}L${x+r} ${y}L${x+r*.3} ${y+r*.3}L${x} ${y+r}L${x-r*.3} ${y+r*.3}L${x-r} ${y}L${x-r*.3} ${y-r*.3}Z`,c);
const phone=(x,y,w=70,h=120,inner='')=>re(x,y,w,h,K.ink,12)+re(x+6,y+12,w-12,h-24,K.white,4)+inner;
const clock=(x,y,r=34,sp=4)=>ci(x,y,r,K.white,st(K.ink,5))+ln(x,y,x,y-r*.5,K.ink,5)+A('a-spin',x,y,ln(x,y,x+r*.7,y,K.red,4),0,sp)+ci(x,y,4,K.ink);
const wheel=(x,y,r=12)=>ci(x,y,r,K.ink)+ci(x,y,r*.4,K.gray);
const car=(x,y,c=K.red,s=1)=>pa(`M${x-50*s} ${y-14*s}V${y-30*s}Q${x-48*s} ${y-36*s} ${x-30*s} ${y-36*s}L${x-18*s} ${y-56*s}H${x+22*s}L${x+36*s} ${y-36*s}Q${x+50*s} ${y-34*s} ${x+52*s} ${y-26*s}V${y-14*s}Z`,c)+re(x-12*s,y-52*s,14*s,14*s,K.sky,2)+re(x+6*s,y-52*s,14*s,14*s,K.sky,2)+wheel(x-30*s,y-12*s,11*s)+wheel(x+32*s,y-12*s,11*s);
const bus=(x,y,c=K.yellow,w=170,faces=0)=>re(x-w/2,y-86,w,72,c,12)+Array.from({length:Math.floor((w-30)/34)},(_,i)=>re(x-w/2+12+i*34,y-76,26,26,K.sky,4)+(faces?A('a-bob',0,0,ci(x-w/2+25+i*34,y-58,8,K.skin)+ci(x-w/2+25+i*34,y-64,8,K.ink,'opacity=".9"'),i*.15,.8+(i%3)*.2):'')).join('')+re(x-w/2,y-36,w,6,K.ink,0,'opacity=".15"')+wheel(x-w/2+34,y-12,13)+wheel(x+w/2-34,y-12,13);
const bike=(x,y,c=K.teal)=>wheel(x-30,y-18,18)+ci(x-30,y-18,12,'#fff')+wheel(x+30,y-18,18)+ci(x+30,y-18,12,'#fff')+pl(`${x-30},${y-18} ${x-6},${y-46} ${x+20},${y-46} ${x+30},${y-18} ${x+2},${y-18} ${x-6},${y-46}`,c,5)+ln(x+20,y-46,x+16,y-58,K.ink,5);
const moto=(x,y,c=K.red)=>wheel(x-30,y-14,14)+wheel(x+30,y-14,14)+pa(`M${x-40} ${y-24}Q${x-20} ${y-50} ${x+10} ${y-40}L${x+34} ${y-30}L${x+30} ${y-20}H${x-30}Z`,c)+ln(x+22,y-36,x+30,y-60,K.ink,5);
const tree=(x,y,s=1)=>re(x-6*s,y-50*s,12*s,50*s,K.brown,3)+A('a-sway',x,y-40*s,ci(x,y-80*s,34*s,K.leaf)+ci(x-24*s,y-60*s,22*s,K.green)+ci(x+24*s,y-62*s,22*s,K.green));
const drop=(x,y,c=K.sky,s=1)=>pa(`M${x} ${y-10*s}Q${x+8*s} ${y} ${x} ${y+6*s}Q${x-8*s} ${y} ${x} ${y-10*s}Z`,c);
const svg=(inner,bg)=>`<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${bg?re(0,0,400,300,bg):''}${inner}</svg>`;
const floaty=(xs,y,mk,dur=2.4)=>xs.map((x,i)=>A('a-float',x,y,mk(x,y),i*dur/xs.length,dur)).join('');

const P={
/* ---------------- SPORT ---------------- */
'work out':A('a-hop',200,250,person(200,250,{c:K.orange,arms:'up',face:'angry'})+ln(110,112,290,112,K.dark,7)+re(110,92,16,40,K.ink,3)+re(274,92,16,40,K.ink,3),0,1.4)
  +floaty([168,234],120,(x,y)=>drop(x,y,K.sky),1.4)+sh(200),
'keep fit':A('a-bob',170,250,person(170,250,{c:K.green,run:.7,arms:'out',anim:['a-swing','a-swing'],face:'grin'}),0,.35)
  +A('a-pulse',310,90,heart(310,90,2.2,K.red),0,.8)+ci(300,200,18,K.red)+ln(300,182,306,172,K.leaf,4)+sh(170),
'team sport':[90,200,310].map((x,i)=>person(x,250,{c:K.blue,arms:i===1?'up':'out',s:.8,face:'grin'})).join('')
  +A('a-pass',200,130,ball(200,130,14),0,1.8)+sh(200,252,150),
'individual sport':ci(200,250,120,K.yellow,'opacity=".18"')+person(190,250,{c:K.purple,arms:'out',anim:[0,'a-wave'],face:'smile'})
  +A('a-wave',203,164,el(262,96,16,22,'none',st(K.ink,5))+ln(250,116,240,150,K.ink,6),.25)+A('a-pass',310,110,ci(310,110,9,'#CDE43B'),0,1.6)+sh(190),
'a big fan of':person(160,250,{c:K.red,arms:'wave',anim:[0,'a-wave'],face:'grin'})+pa('M118 150l-40-18v52l40-18z',K.orange)+re(118,148,14,20,K.orange,3)
  +floaty([250,290,330],210,(x,y)=>heart(x,y,1.2),2.4)+ball(320,232,16)+sh(160),
'couch potato':re(70,170,260,60,K.purple,18)+re(60,150,40,90,K.purple,14)+re(300,150,40,90,K.purple,14)+re(70,214,260,28,'#6F55A8',8)
  +el(190,176,40,34,K.brown)+ci(176,168,3,K.ink)+ci(196,168,3,K.ink)+pa('M178 182q8 6 16 0','none',st(K.ink,2.5))+ci(170,190,3,'#7A5536')+ci(206,160,2.5,'#7A5536')
  +re(300,60,80,60,K.ink,6)+A('a-blink',340,90,re(306,66,68,48,K.sky,3),0,.6)+ln(330,120,340,140,K.ink,4)+ln(350,120,340,140,K.ink,4),
'let off steam':person(200,250,{c:K.red,arms:'hips',face:'angry',skin:'#F0A58A'})+floaty([170,200,230],110,(x,y)=>cloud(x,y,.7,K.gray),1.8)+sh(200),
'build up stamina':re(110,236,180,14,K.dark,7)+`<line x1="116" y1="243" x2="284" y2="243" stroke="${K.yellow}" stroke-width="4" stroke-dasharray="10 10" class="a-belt"/>`+ln(270,236,290,150,K.dark,6)
  +person(190,236,{c:K.teal,run:.6,arms:'out',anim:['a-swing','a-swing'],face:'smile'})+re(310,60,60,110,'none',8,st(K.ink,5))+re(328,52,24,10,K.ink,3)
  +A('a-fillup',340,164,re(318,70,44,92,K.green,4),0,2.4),
'compete in':re(150,170,100,80,K.yellow,4)+re(50,200,100,50,K.gray,4)+re(250,215,100,35,K.orange,4)+tx(200,220,'1',38,K.white)+tx(100,236,'2',30,K.white)+tx(300,244,'3',24,K.white)
  +A('a-bob',200,120,pa('M176 90h48v20q0 24-24 30q-24-6-24-30z',K.yellow,st('#C9932B',4))+re(192,140,16,14,'#C9932B')+re(182,152,36,8,'#C9932B',2),0,1.2)
  +ln(60,200,60,90,K.ink,4)+A('a-sway',60,92,pa('M60 92h50l-12 16 12 16H60z',K.red),0,1),
'a live match':re(0,150,400,100,K.leaf)+ln(200,150,200,250,K.white,3)+ci(200,200,26,'none',st(K.white,3))+A('a-pass',200,200,ball(200,200,9),0,2.2)
  +Array.from({length:12},(_,i)=>A('a-bob',0,0,ci(20+i*33,128,13,[K.blue,K.red,K.yellow,K.purple][i%4])+ci(20+i*33,108,10,K.skin),i*.12,.7)).join('')
  +re(16,16,74,30,K.red,8)+A('a-blink',30,31,ci(30,31,6,K.white),0,1)+tx(64,38,'LIVE',16,K.white),

/* ---------------- READING ---------------- */
'bookworm':book(120,214,160,26,K.blue)+book(130,188,140,26,K.orange)+book(116,162,170,26,K.green)
  +A('a-worm',230,150,[0,1,2,3].map(i=>ci(232+i*16,140-(i%2)*6,11,K.leaf)).join('')+ci(292,132,15,K.leaf)+ci(288,128,3,K.ink)+ci(298,128,3,K.ink)+re(278,108,28,10,K.ink,2)+re(283,98,18,12,K.ink,2),0,1.4),
'avid reader':person(150,250,{c:K.pink,sit:1,arms:'hold',face:'smile'})+re(90,206,90,44,K.purple,8)+A('a-flip',186,170,re(170,156,34,30,K.white,3,st(K.blue,3)),0,1.2)
  +[0,1,2,3,4].map(i=>book(250+(i%2)*6,226-i*20,96,18,[K.blue,K.orange,K.green,K.red,K.yellow][i])).join('')+A('a-pulse',330,70,heart(330,70,1.6),0,1),
'page-turner':openBook(200,170,190)+lines(122,170,56,4,11)+lines(220,170,56,4,11)
  +A('a-flip',200,190,pa('M200 164Q245 150 290 164V210Q245 196 200 210Z',K.paper,st(K.ink,3)),0,1)+floaty([130,270],140,(x,y)=>star(x,y,12,K.orange),1.2),
'fiction':openBook(200,200,200,K.purple)+A('a-rise',200,190,pa('M150 190V130h14v-12h12v12h14V110l10-14 10 14v20h14v-12h12v12h14v60z',K.purple,'opacity=".9"')+re(194,160,12,30,K.ink,6),0,2.6)
  +[[90,70],[310,60],[260,110],[130,120]].map(([x,y],i)=>A('a-blink',x,y,star(x,y,9),i*.3,1.4)).join(''),
'non-fiction':book(80,212,120,30,K.teal)+ci(270,140,60,K.sky)+pa('M240 110q20 10 14 30t20 30q-30 10-40-20t6-40z',K.leaf)+pa('M290 100q16 20 4 40',K.leaf)
  +A('a-scan',250,150,ci(230,120,26,'#FFFFFF66',st(K.ink,6))+ln(248,138,276,166,K.ink,9),0,2.4),
'e-book':phone(160,40,90,180,`<clipPath id="eb"><rect x="166" y="52" width="78" height="156"/></clipPath><g clip-path="url(#eb)">${A('a-scroll',0,0,lines(174,60,62,16,10,K.dark),0,3)}</g>`)
  +ci(205,229,5,K.white)+book(270,190,90,24,K.orange)+book(276,166,80,24,K.blue),
'broaden my horizons':openBook(100,180,120,K.blue)+A('a-pass',200,120,pa('M180 120h30m-10-10 10 10-10 10','none',st(K.orange,6)),0,2)
  +ci(300,140,56,K.sky)+A('a-globe',300,140,el(300,140,26,56,'none',st(K.white,3))+pa('M280 110q14 8 10 24t14 22q-20 6-28-12t4-34z',K.leaf),0,2.4)+ci(300,140,56,'none',st(K.ink,4)),
'skim through':re(110,60,180,180,K.white,6,st(K.ink,4))+re(126,76,148,24,K.dark,3)+lines(126,118,64,8,13)+lines(206,118,68,8,13)
  +A('a-scan',200,150,ci(200,150,30,'#FFFFFF55',st(K.ink,6))+ln(222,172,250,200,K.ink,9),0,.9),
'bedtime story':re(40,190,220,40,K.blue,8)+re(40,170,40,60,K.dark,6)+re(80,176,170,30,K.white,10)
  +ci(105,180,18,K.skin)+pa('M89 176a16 16 0 0 1 32 0z',K.brown)+ln(98,180,104,180,K.ink,2)+ln(108,180,114,180,K.ink,2)
  +floaty([140,160],150,(x,y)=>tx(x,y,'Z',22,K.purple),2)+ci(330,60,26,K.yellow)+ci(342,52,24,'#16213A')+A('a-flip',300,190,re(282,174,36,28,K.orange,3),0,1.6)+person(330,250,{c:K.purple,arms:'hold',face:'smile',s:.85}),
'can’t put it down':person(150,250,{c:K.orange,arms:'hold',face:'wow'})+re(160,160,38,30,K.blue,3)+clock(300,110,46,.8),

/* ---------------- HOBBY ---------------- */
'free time / spare time':ci(320,70,30,K.yellow)+A('a-spin',320,70,Array.from({length:8},(_,i)=>ln(320,26,320,16,K.yellow,4)).map((l,i)=>`<g transform="rotate(${i*45} 320 70)">${l}</g>`).join(''),0,8)
  +ln(70,250,90,120,K.brown,8)+ln(310,250,290,120,K.brown,8)+A('a-sway',190,120,pa('M90 130Q190 210 290 130','none',st(K.orange,10))+person(190,166,{c:K.teal,sit:1,s:.6,face:'sleep'}),0,2.4),
'take up':re(80,210,70,40,K.brown,6)+A('a-grow',115,210,ln(115,210,115,160,K.leaf,6)+el(100,165,16,8,K.leaf)+el(130,155,16,8,K.leaf),0,3)
  +pa('M240 230a40 40 0 1 0 60 0a26 26 0 1 0 -20 -50z',K.orange)+ln(270,190,320,80,K.brown,10)+ci(270,214,9,K.ink)+floaty([330,360],120,(x,y)=>star(x,y,9),1.6),
'be into':person(170,250,{c:K.blue,arms:'front',face:'smile'})+re(180,160,56,40,K.dark,6)+ci(208,180,12,K.sky,st(K.ink,3))+A('a-blink',226,166,star(232,154,14,K.yellow),0,1)
  +A('a-pulse',300,90,heart(300,90,1.8),0,.9)+A('a-pulse',340,140,heart(340,140,1.1),.3,.9),
'unwind':pa('M70 160h260v30q0 50-50 50H120q-50 0-50-50z',K.white,st(K.ink,4))+ci(150,150,16,K.skin)+pa('M134 146a16 16 0 0 1 32 0z',K.ink)+ln(143,150,149,150,K.ink,2)+ln(153,150,159,150,K.ink,2)+pa('M144 158q6 4 12 0','none',st(K.ink,2))
  +floaty([200,240,280,180],156,(x,y)=>ci(x,y,10,K.sky,'opacity=".8" stroke="#fff" stroke-width="2"'),2.8)+ln(100,240,96,262,K.ink,6)+ln(300,240,304,262,K.ink,6),
'kill time':re(70,140,140,90,K.gray,10)+person(140,250,{c:K.purple,sit:1,arms:'front',face:'flat'})+phone(156,150,22,34)
  +A('a-hourglass',300,140,pa('M270 90h60l-30 50 30 50h-60l30-50z',K.white,st(K.ink,5))+pa('M280 100h40l-20 30z',K.yellow)+pa('M300 160l16 24h-32z',K.yellow),0,2),
'creative':A('a-glow',150,110,ci(150,110,46,K.yellow,'opacity=".35"'),0,1.2)+ci(150,110,32,K.yellow)+re(136,140,28,24,K.gray,4)
  +`<path d="M220 220C250 150 300 260 340 170" fill="none" stroke="${K.pink}" stroke-width="12" stroke-linecap="round" stroke-dasharray="260" class="a-draw"/>`+ln(340,170,370,120,K.brown,8)+re(330,160,16,20,K.ink,3),
'relieve stress':A('a-breathe',200,140,ci(200,140,80,K.sky,'opacity=".35"'),0,3)+person(200,250,{c:K.green,arms:'hips',face:'sleep'})
  +A('a-away',90,80,cloud(90,80,1.1,K.dark)+pa('M86 96l-8 18h10l-6 16','none',st(K.yellow,4)),0,3),
'pick up a new skill':person(200,250,{c:K.orange,arms:'out',face:'wow'})+A('a-spin',200,100,ball(150,100,13)+ci(250,100,13,K.red)+ci(200,50,13,K.green),0,1.6)+sh(200),
'give up':re(60,150,160,60,K.ink,6)+Array.from({length:7},(_,i)=>re(68+i*21,154,18,50,K.white,2)).join('')+Array.from({length:5},(_,i)=>re(80+[0,1,3,4,5][i]*21,154,10,30,K.ink,1)).join('')+ln(70,210,70,250,K.ink,8)+ln(210,210,210,250,K.ink,8)
  +A('a-pulse',140,150,ln(90,110,190,200,K.red,12)+ln(190,110,90,200,K.red,12),0,1)+A('a-walk',300,250,person(300,250,{c:K.dark,run:.8,face:'sad',s:.8}),0,3),
'passionate about':A('a-flicker',200,250,pa('M140 250q-30-60 20-110q0 40 30 50q-10-60 40-100q10 60 40 80q20-20 10-50q50 60 10 130z',K.orange,'opacity=".75"')+pa('M170 250q-10-40 20-60q10 30 30 30q20-20 10-40q30 40 0 70z',K.yellow),0,.5)
  +A('a-sway',200,250,person(200,250,{c:K.red,arms:'wave',anim:['a-wave','a-wave'],face:'grin'}),0,.8),

/* ---------------- MUSIC ---------------- */
'genre':[[90,K.red],[200,K.blue],[310,K.green]].map(([x,c],i)=>A('a-spin',x,140,ci(x,140,48,K.ink)+ci(x,140,36,'none',st('#333',2))+ci(x,140,16,c)+ci(x,140,3,K.white),i*.2,2+i))
  .join('')+tx(90,230,'♪',30,K.red)+tx(200,230,'♫',30,K.blue)+tx(310,230,'♬',30,K.green),
'catchy':A('a-bob',200,250,person(200,250,{c:K.pink,face:'grin'}),0,.5)+A('a-spin',200,140,note(120,140,K.purple)+note(270,120,K.blue)+note(200,70,K.orange),0,3),
'lyrics':re(90,40,160,210,K.white,6,st(K.ink,4))+[0,1,2,3,4,5].map(i=>A('a-type',110,70+i*28,re(110,64+i*28,[120,90,110,70,120,80][i],10,i%2?K.purple:K.dark,4),i*.35,3)).join('')
  +re(290,120,30,60,K.dark,15)+ln(305,180,305,240,K.ink,6)+note(330,90,K.pink),
'play a musical instrument':person(170,250,{c:K.blue,arms:'front',anim:[0,'a-strum'],face:'smile'})+pa('M150 196a30 30 0 1 0 44 4a20 20 0 1 0 -14 -40z',K.orange)+ln(170,180,240,120,K.brown,8)+ci(166,196,7,K.ink)
  +floaty([270,310,340],150,(x,y)=>note(x,y,K.purple,.9),2.2),
'live concert':re(0,200,400,100,K.ink)+A('a-light',80,0,pa('M70 0h20l60 220h-140z',K.yellow,'opacity=".35"'),0,2.4)+A('a-light',320,0,pa('M310 0h20l60 220h-140z',K.pink,'opacity=".35"'),.6,2.4)
  +person(200,200,{c:K.purple,arms:'wave',anim:[0,'a-wave'],face:'grin',s:.9})+re(232,118,8,22,K.dark,3)
  +Array.from({length:9},(_,i)=>A('a-wave',20+i*45,300,ln(20+i*45,300,20+i*45,236,K.skin,10)+ci(20+i*45,236,9,K.skin),i*.15,.7)).join(''),
'put me in a good mood':A('a-spin',300,80,Array.from({length:10},(_,i)=>`<g transform="rotate(${i*36} 300 80)">${ln(300,30,300,18,K.yellow,5)}</g>`).join(''),0,6)+ci(300,80,30,K.yellow)
  +A('a-bob',170,250,person(170,250,{c:K.teal,face:'grin'})+pa('M150 140a20 20 0 0 1 40 0','none',st(K.ink,6))+re(144,132,12,20,K.red,5)+re(184,132,12,20,K.red,5),0,.6)
  +floaty([230,260],170,(x,y)=>note(x,y,K.pink,.8),1.8),
'music streaming app':phone(150,30,100,200)+ci(200,120,30,K.green)+pa('M192 106l20 14-20 14z',K.white)
  +[0,1,2,3,4].map(i=>A('a-eq',170+i*15,210,re(166+i*15,170,9,40,K.purple,3),i*.12,.6)).join('')
  +[0,1,2].map(i=>A('a-blink',320,90,pa(`M${300-i*12} ${90-i*14}a${30+i*18} ${30+i*18} 0 0 1 ${40+i*24} 0`,'none',st(K.blue,5)),i*.25,1.2)).join(''),
'have a good ear for music':pa('M200 70c50 0 70 40 60 80-6 24-30 30-30 56 0 24-30 40-50 20','none',st(K.skin,30))+pa('M208 110c20 0 30 20 20 40','none',st('#D9A27A',8))
  +[0,1,2].map(i=>A('a-wavein',80,150,pa(`M${110-i*24} ${110-i*14}q${-16-i*4} ${40+i*14} 0 ${80+i*28}`,'none',st(K.blue,5)),i*.3,1.5)).join('')+note(60,90,K.purple)+A('a-blink',300,80,star(300,80,12),0,1),
'background music':re(60,180,240,12,K.brown,3)+ln(80,192,80,250,K.brown,8)+ln(280,192,280,250,K.brown,8)+person(170,250,{c:K.blue,sit:1,arms:'front',face:'smile'})+openBook(220,160,70,K.orange)
  +re(310,140,46,66,K.dark,8)+ci(333,162,10,K.gray)+ci(333,190,7,K.gray)+floaty([330,360],120,(x,y)=>`<g opacity=".45">${note(x,y,K.purple,.7)}</g>`,3),
'on repeat':A('a-spin',200,150,pa('M200 70a80 80 0 0 1 78 62','none',st(K.blue,12))+pa('M290 120l-6 28-24-16z',K.blue)+pa('M200 230a80 80 0 0 1 -78 -62','none',st(K.blue,12))+pa('M110 180l6-28 24 16z',K.blue),0,2.4)
  +A('a-pulse',200,150,note(194,170,K.pink,1.4),0,.8),

/* ---------------- TRANSPORT ---------------- */
'means of transport':re(0,226,400,30,K.gray)+A('a-drive',200,0,car(200,250,K.red),0,4)+A('a-drive',200,0,bus(200,250,K.yellow,150),-1.6,4)+A('a-drive',200,0,bike(200,250),-2.9,4),
'public transport':re(0,226,400,30,K.gray)+re(300,80,8,150,K.dark)+re(284,60,40,40,K.blue,20)+tx(304,88,'B',24,K.white)+A('a-arrive',150,250,bus(150,250,K.green,220,1),0,3),
'commute':pa('M30 200l40-36 40 36v50H30z',K.orange)+re(60,214,20,36,K.ink)+re(300,150,80,100,K.blue)+pa('M290 150l50-40 50 40z',K.dark)+re(330,204,20,46,K.ink)+ln(80,262,320,262,K.gray,6)
  +A('a-commute',140,250,bike(140,250,K.red)+person(140,212,{c:K.green,s:.55,arms:'front'}),0,4),
'traffic jam':re(0,150,400,110,K.gray)+ln(0,205,400,205,K.white,4)+[[60,200],[180,200],[300,200],[110,255],[230,255],[350,255]].map(([x,y],i)=>A('a-shake',x,y,car(x,y,[K.red,K.blue,K.green,K.yellow,K.purple,K.orange][i],.9),i*.1,.4)).join('')
  +re(186,40,28,70,K.ink,8)+A('a-blink',200,60,ci(200,60,9,K.red),0,.8)+ci(200,90,9,'#555'),
'rush hour':clock(320,80,44,12)+re(0,226,400,30,K.gray)+[0,1,2,3,4,5].map(i=>A('a-drive',200,0,moto(200,250,[K.red,K.blue,K.green,K.purple,K.orange,K.teal][i]),-i*.4,2.4)).join(''),
'get stuck in traffic':re(0,170,400,90,K.gray)+car(70,250,K.blue)+car(330,250,K.green)+A('a-shake',200,240,car(200,250,K.red,1.1),0,.25)
  +ci(186,186,10,K.skin)+ln(180,184,184,186,K.ink,2)+ln(192,184,188,186,K.ink,2)+drop(212,170,K.sky)+A('a-blink',200,140,pa('M170 150l-14-20M200 140v-24M230 150l14-20','none',st(K.red,5)),0,.4),
'eco-friendly':tree(300,250,1.1)+A('a-commute',140,250,bike(140,250,K.green)+person(140,212,{c:K.leaf,s:.55,arms:'front'}),0,4)
  +floaty([90,160,220],200,(x,y)=>el(x,y,10,5,K.leaf,`transform="rotate(-30 ${x} ${y})"`),3),
'convenient':A('a-bob',170,250,moto(170,250,K.orange)+person(170,214,{c:K.blue,s:.6,arms:'front',face:'grin'}),0,.6)
  +A('a-pulse',310,100,ci(310,100,40,K.green)+pa('M292 102l12 12 22-26','none',st(K.white,8)),0,1),
'on foot':A('a-walk',200,250,person(200,250,{c:K.orange,run:.9,arms:'out',anim:['a-swing','a-swing'],face:'smile'}),0,4)
  +[60,120,180,240,300,360].map((x,i)=>A('a-blink',x,262,el(x,262+(i%2)*6,6,4,K.dark),i*.3,2)).join(''),
'crowded':re(30,90,340,140,K.yellow,16)+re(46,104,308,96,K.sky,8)+`<clipPath id="cr"><rect x="46" y="104" width="308" height="96"/></clipPath><g clip-path="url(#cr)">`
  +Array.from({length:14},(_,i)=>A('a-bob',0,0,ci(60+i*22,150+(i%2)*14,15,[K.skin,'#D9A27A','#F3C6A0'][i%3])+ci(60+i*22,140+(i%2)*14,15,[K.ink,K.brown,K.dark][i%3],'opacity=".85"'),i*.08,.5)).join('')+'</g>'
  +wheel(90,236,16)+wheel(310,236,16),
};
window.PICS={};Object.keys(P).forEach(k=>window.PICS[k]=svg(P[k]));

/* small line icons for the answer flower */
const I=(inner)=>`<svg viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
window.ICONS={feel:I('<circle cx="16" cy="16" r="12"/><path d="M11 19q5 5 10 0"/><path d="M12 12v1M20 12v1"/>'),
  why:I('<path d="M11 11a5 5 0 1 1 7 4.6c-1.4.7-2 1.6-2 3.4"/><path d="M16 24v.5"/>'),
  when:I('<circle cx="16" cy="16" r="12"/><path d="M16 9v7l5 3"/>'),
  who:I('<circle cx="11" cy="11" r="4"/><circle cx="22" cy="12" r="3.4"/><path d="M4 26c1-5 4-7 7-7s6 2 7 7M18 21c1-2 3-3 4-3 3 0 5 2 6 6"/>'),
  where:I('<path d="M16 29s-9-9-9-16a9 9 0 0 1 18 0c0 7-9 16-9 16z"/><circle cx="16" cy="13" r="3"/>'),
  what:I('<circle cx="14" cy="14" r="8"/><path d="M20 20l7 7"/>'),
  often:I('<path d="M6 13a10 10 0 0 1 18-4M26 19a10 10 0 0 1-18 4"/><path d="M24 4v5h-5M8 28v-5h5"/>'),
  eg:I('<path d="M11 20a8 8 0 1 1 10 0v3H11z"/><path d="M12 27h8"/>'),
  past:I('<path d="M15 9 7 16l8 7zM26 9l-8 7 8 7z"/>')};
})();
