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
/* ---------------- TASTES ---------------- */
'sour':A('a-shake',150,150,ci(150,150,74,K.skin)+pl('118,128 132,136 118,144',K.ink,5)+pl('182,128 168,136 182,144',K.ink,5)+ci(150,182,8,K.ink)+ci(110,168,9,K.red,'opacity=".35"')+ci(190,168,9,K.red,'opacity=".35"'),0,.25)
  +A('a-bob',300,170,ci(300,170,52,K.yellow)+ci(300,170,42,'#FFF3B0')+[0,60,120,180,240,300].map(a=>`<g transform="rotate(${a} 300 170)">${ln(300,170,300,132,K.yellow,4)}</g>`).join(''),0,1.4),
'sweet':ln(200,150,200,270,K.white,10)+ln(200,150,200,270,K.gray,6)+A('a-spin',200,120,ci(200,120,70,K.pink)+`<path d="M200 120m0 0a10 10 0 0 1 10 10a20 20 0 0 1-20 20a30 30 0 0 1-30-30a40 40 0 0 1 40-40a50 50 0 0 1 50 50a60 60 0 0 1-60 60" fill="none" stroke="#fff" stroke-width="9"/>`,0,4)
  +floaty([90,310,330],200,(x,y)=>heart(x,y,1.2),2.4),
'juicy':pa('M60 120h280a140 140 0 0 1-280 0z',K.leaf)+pa('M74 120h252a126 126 0 0 1-252 0z','#F4F7E8')+pa('M86 120h228a114 114 0 0 1-228 0z',K.red)
  +[[140,160],[200,190],[260,160],[170,210],[230,212]].map(([x,y])=>el(x,y,5,8,K.ink)).join('')+[130,200,270].map((x,i)=>A('a-drip',x,240,drop(x,250,K.red,1.3),i*.4,1.4)).join(''),
'salty':A('a-pour',200,120,re(160,60,80,110,K.white,14,st(K.ink,4))+re(160,40,80,30,K.gray,10,st(K.ink,4))+[176,200,224].map(x=>ci(x,52,3,K.ink)).join('')+tx(200,130,'S',40,K.gray),0,.6)
  +[170,190,210,230].map((x,i)=>A('a-drip',x,190,re(x,180,5,5,K.dark,1),i*.2,.9)).join('')+pa('M110 260h180l-20 20H130z',K.orange)+el(200,258,70,10,'#F5D9A8'),
'savory':pa('M90 170h220q0 90-110 90t-110-90z',K.white,st(K.ink,5))+el(200,170,110,16,'#C97B3A')+ci(160,166,12,K.brown)+ci(210,162,14,K.brown)+ci(250,168,10,K.leaf)
  +[150,200,250].map((x,i)=>A('a-float',x,140,`<path d="M${x} 150q-12-16 0-32t0-32" fill="none" ${st(K.gray,6)}/>`,i*.6,2)).join(''),
'peppery':A('a-sway',200,170,re(170,40,60,40,K.dark,10)+re(176,80,48,110,K.brown,10)+ci(200,40,10,K.ink),0,.6)
  +[180,195,210,225].map((x,i)=>A('a-drip',x,200,ci(x,205,4,K.ink),i*.18,.9)).join('')+A('a-shake',320,180,ci(320,180,40,K.skin)+ln(304,172,314,172,K.ink,3)+ln(326,172,336,172,K.ink,3)+ci(320,194,7,K.ink),0,.2)
  +tx(320,120,'!',36,K.red),
'pungent':el(170,200,70,60,'#F6F1E7',st('#C9BFA8',4))+pa('M170 140q-10-20 0-40q10 20 0 40z',K.leaf)+pa('M130 200q40-50 80 0','none',st('#C9BFA8',3))
  +[0,1,2].map(i=>A('a-float',250,160,`<path d="M${240+i*22} 170q12-14 0-28t0-28" fill="none" ${st(K.leaf,5)}/>`,i*.5,2)).join('')
  +ci(320,110,36,K.skin)+pl('306,104 316,100',K.ink,3)+pl('334,104 324,100',K.ink,3)+`<path d="M306 124q7-6 14 0t14 0" fill="none" ${st(K.ink,3)}/>`+ci(320,112,6,'#E9B08A'),
'spicy':A('a-flicker',200,250,pa('M140 250q-30-60 20-110q0 40 30 50q-10-60 40-100q10 60 40 80q20-20 10-50q50 60 10 130z',K.orange,'opacity=".8"'),0,.4)
  +pa('M150 200q60-60 150-40q20 6 10 20q-90 0-150 40z',K.red)+pa('M300 162q20-20 30-10q-10 6-14 18z',K.leaf)
  +ci(90,110,34,'#F08A6A')+ci(80,104,3,K.ink)+ci(100,104,3,K.ink)+ci(90,122,7,K.ink)+drop(122,96,K.sky),

/* ---------------- FOOD ---------------- */
'mouth-watering':ci(130,140,70,K.skin)+ci(108,124,6,K.ink)+ci(152,124,6,K.ink)+pa('M100 160q30 30 60 0z',K.ink)+A('a-drip',150,180,drop(150,186,K.sky,1.3),0,1.4)
  +pa('M240 200h130q0 50-65 50t-65-50z',K.white,st(K.ink,4))+el(305,200,65,10,K.orange)+[280,305,330].map((x,i)=>A('a-float',x,180,`<path d="M${x} 186q-8-12 0-24t0-24" fill="none" ${st(K.gray,5)}/>`,i*.5,1.8)).join(''),
'nutritious':pa('M80 200h240q0 60-120 60T80 200z',K.white,st(K.ink,4))+ci(150,190,26,K.green)+ci(140,176,16,K.leaf)+ci(200,186,22,K.red)+re(234,170,40,26,K.orange,10)+ci(260,196,14,K.yellow)
  +[110,200,290].map((x,i)=>A('a-float',x,140,tx(x,140,'+',36,K.green),i*.6,1.8)).join(''),
'adore':person(150,250,{c:K.pink,arms:'front',face:'grin'})+re(160,170,70,50,K.yellow,8)+re(160,166,70,12,K.pink,6)+ci(195,160,7,K.red)
  +floaty([230,270,310],180,(x,y)=>heart(x,y,1.4),2.2),
'sweet tooth':A('a-bob',200,150,pa('M150 100q50-30 100 0q20 40-6 120q-10 20-20-10q-10-30-24 0q-14 30-24 10q-26-80-6-120z',K.white,st(K.ink,5))+ci(184,140,5,K.ink)+ci(216,140,5,K.ink)+pa('M188 160q12 10 24 0','none',st(K.ink,3)),0,1.6)
  +A('a-spin',200,150,ci(70,150,16,K.pink)+re(320,140,34,20,K.yellow,8)+ci(200,30,14,K.purple),0,4),
'texture':re(60,150,220,90,'#E8B865',20)+Array.from({length:14},(_,i)=>ci(80+(i%7)*30,175+Math.floor(i/7)*36,6,'#C98D3A')).join('')
  +A('a-scan',200,170,ci(200,150,50,'#FFFFFF66',st(K.ink,7))+ln(236,186,280,230,K.ink,11),0,2.4),
'melt-in-one’s-mouth feeling':A('a-melt',160,120,re(110,70,100,80,K.brown,8)+ln(143,70,143,150,'#7A5536',3)+ln(177,70,177,150,'#7A5536',3)+ln(110,110,210,110,'#7A5536',3),0,2.4)
  +A('a-drip',150,170,pa('M130 150q20 60 40 0z',K.brown),0,2.4)+ci(300,150,52,K.skin)+ln(280,142,292,146,K.ink,3)+ln(320,142,308,146,K.ink,3)+pa('M282 164q18 14 36 0','none',st(K.ink,3))
  +ci(276,160,7,K.pink,'opacity=".5"')+ci(324,160,7,K.pink,'opacity=".5"')+floaty([340,360],110,(x,y)=>heart(x,y,.8),2),
'ready meal':re(80,80,240,150,K.gray,14)+re(96,96,160,118,K.ink,8)+A('a-spin',176,170,el(176,170,50,12,K.white)+re(150,150,52,18,K.orange,6),0,2)
  +ci(288,120,12,K.white)+ci(288,160,12,K.white)+A('a-blink',288,200,re(272,192,32,14,K.green,3),0,.8),
'junk food':A('a-bob',150,200,pa('M90 170q60-70 120 0z','#E3A24B')+re(86,170,128,14,K.leaf,4)+re(90,184,120,16,K.brown,6)+re(88,200,124,18,'#E3A24B',8),0,1.2)
  +pa('M250 140h50l-6 110h-38z',K.red)+re(256,120,38,22,K.yellow,4)+[262,270,278,286].map((x,i)=>A('a-bob',x,130,ln(x,138,x+2,108,K.yellow,6),i*.1,.6)).join('')
  +pa('M320 130h40l-6 120h-28z',K.ink)+ln(345,130,355,90,K.white,5)+floaty([340],180,(x,y)=>ci(x,y,5,K.white),1),
'beverage':pa('M120 110h80l-10 140h-60z',K.sky,'opacity=".6"')+ln(120,110,200,110,K.ink,4)+pa('M126 150h68l-7 100h-54z',K.orange)+ln(170,110,190,60,K.red,6)
  +floaty([150,160,175],240,(x,y)=>ci(x,y,4,K.white),1.4)+pa('M250 170h90v40q0 40-45 40t-45-40z',K.white,st(K.ink,4))+pa('M340 186a16 16 0 0 1 0 32','none',st(K.ink,5))
  +[280,300].map((x,i)=>A('a-float',x,160,`<path d="M${x} 162q-8-12 0-24t0-24" fill="none" ${st(K.gray,5)}/>`,i*.6,1.8)).join(''),
'appetite':person(150,250,{c:K.orange,arms:'front',face:'wow'})+A('a-blink',150,190,pa('M120 180q-14 10 0 20M180 180q14 10 0 20','none',st(K.red,4)),0,.5)
  +el(300,220,70,16,K.white,st(K.ink,4))+ln(220,160,220,240,K.gray,6)+ln(380,160,380,240,K.gray,6)+pl('214,160 214,180 226,180 226,160',K.gray,4),
'picky eater':A('a-no',150,200,person(150,250,{c:K.purple,arms:'hips',face:'sad'}),0,.8)+re(220,190,140,10,K.brown,3)+el(290,186,50,10,K.white,st(K.ink,3))
  +ci(280,176,14,K.green)+ci(296,170,12,K.leaf)+ln(290,186,290,196,K.green,5)+A('a-pulse',340,120,ln(320,100,360,140,K.red,8)+ln(360,100,320,140,K.red,8),0,1),
'traditional cuisine':pa('M90 160h220q0 100-110 100T90 160z',K.white,st(K.ink,5))+el(200,160,110,16,'#F1DDB0')+ci(150,156,12,'#C26A5A')+ci(180,152,12,'#C26A5A')+re(230,150,40,8,K.leaf,4)
  +A('a-lift',220,120,ln(220,150,300,40,K.brown,6)+ln(236,150,316,44,K.brown,6)+pa('M226 150q4-40 10-60M232 150q6-40 12-60','none',st('#F1DDB0',4)),0,1.6)
  +[140,180].map((x,i)=>A('a-float',x,130,`<path d="M${x} 140q-8-12 0-24t0-24" fill="none" ${st(K.gray,5)}/>`,i*.6,1.8)).join(''),
'diet':ci(200,160,100,K.white,st(K.ink,5))+pa('M200 160V60a100 100 0 0 1 100 100z',K.leaf)+pa('M200 160h100a100 100 0 0 1-100 100z',K.orange)+pa('M200 160v100a100 100 0 0 1-100-100z','#F1DDB0')+pa('M200 160H100a100 100 0 0 1 100-100z',K.red,'opacity=".8"')
  +A('a-pulse',200,160,ci(200,160,14,K.white),0,1.2),
'recipe':re(70,40,160,220,K.paper,8,st(K.ink,4))+re(90,60,120,16,K.orange,4)+[0,1,2,3].map(i=>ln(116,106+i*36,200,106+i*36,K.gray,5)+A('a-tick',96,104+i*36,pl(`${90},${106+i*36} ${98},${114+i*36} ${110},${96+i*36}`,K.green,5),i*.5,3)).join('')
  +pa('M260 200h100q0 40-50 40t-50-40z',K.dark)+ln(360,206,390,196,K.dark,8),
'ingredient':pa('M120 200h200q0 60-100 60T120 200z',K.white,st(K.ink,5))+el(220,200,100,14,'#EEE')
  +A('a-dropin',170,80,el(170,90,18,24,'#F6EBD9',st(K.ink,2)),0,2.4)+A('a-dropin',220,70,ci(220,80,18,K.red)+ln(220,62,226,56,K.leaf,4),.8,2.4)+A('a-dropin',270,80,re(254,60,34,46,'#EADBC8',4)+tx(271,90,'F',18,K.brown),1.6,2.4),
'within walking distance':pa('M30 200l40-36 40 36v50H30z',K.orange)+re(60,214,20,36,K.ink)+re(290,150,90,100,K.teal,4)+re(290,140,90,20,K.red,4)+re(320,200,30,50,K.white)
  +A('a-commute',130,250,person(130,250,{c:K.blue,run:.7,s:.7}),0,4)+ln(80,262,330,262,K.gray,6)+re(176,40,50,30,K.yellow,8)+tx(201,62,'5′',20,K.ink),
'have a sweet tooth':person(170,250,{c:K.teal,arms:'front',face:'grin'})+A('a-bob',210,170,ci(210,170,30,'#E9A0B8')+ci(210,170,11,K.white)+[0,60,120,200,280].map(a=>`<g transform="rotate(${a} 210 170)">${re(208,146,4,9,[K.yellow,K.blue,K.green,K.white,K.purple][a%5]||K.yellow,2)}</g>`).join(''),0,1)
  +floaty([280,320],170,(x,y)=>heart(x,y,1.1),2),
'get the munchies':re(0,0,400,300,'#1E2A4A')+ci(60,60,24,K.yellow)+ci(70,54,22,'#1E2A4A')+re(220,60,120,190,K.white,10)+A('a-glow',280,150,re(226,66,108,178,'#FFF6C8'),0,1.2)
  +[0,1,2].map(i=>ln(232,120+i*40,328,120+i*40,K.gray,3)).join('')+ci(260,104,12,K.orange)+re(290,140,30,20,K.pink,4)+A('a-sway',220,150,re(120,60,100,190,'#E8ECF2',10,st(K.gray,3)),0,1.6)
  +person(160,250,{c:K.purple,arms:'front',face:'wow',s:.8}),
'follow a recipe':phone(60,60,80,140,lines(72,84,56,8,13,K.dark))+pa('M200 200h160q0 50-80 50t-80-50z',K.dark)+re(196,192,168,12,'#555',6)
  +A('a-stir',280,190,ln(280,190,320,90,K.brown,8)+el(280,194,10,6,K.brown),0,1)+[260,300].map((x,i)=>A('a-float',x,180,`<path d="M${x} 186q-8-12 0-24t0-24" fill="none" ${st(K.gray,5)}/>`,i*.5,1.6)).join(''),
'eat a balanced diet':re(190,170,20,80,K.dark,4)+pa('M170 250h60l-30-30z',K.dark)+A('a-sway',200,170,ln(70,170,330,170,K.dark,8)+pa('M50 170h80q0 40-40 40t-40-40z',K.leaf)+ci(80,160,16,K.green)+ci(104,162,12,K.red)
  +pa('M270 170h80q0 40-40 40t-40-40z','#F1DDB0')+re(286,148,40,18,K.orange,8)+ci(320,156,10,K.white),0,2.4),
'spoil one’s appetite':person(120,250,{c:K.orange,arms:'front',face:'sad'})+ci(152,166,14,'#C98D3A')+[0,1,2].map(i=>ci(146+i*6,162+(i%2)*6,2,K.brown)).join('')
  +el(290,220,70,16,K.white,st(K.ink,4))+ci(270,210,14,K.leaf)+re(290,202,40,14,K.orange,6)+A('a-pulse',290,140,ln(260,110,320,170,K.red,9)+ln(320,110,260,170,K.red,9),0,1),
'lead a healthy lifestyle':A('a-bob',160,250,person(160,250,{c:K.green,run:.7,arms:'out',anim:['a-swing','a-swing'],face:'grin'}),0,.35)
  +ci(300,200,22,K.red)+ln(300,178,306,168,K.leaf,4)+re(330,160,24,70,K.sky,6,st(K.ink,3))+A('a-pulse',310,90,heart(310,90,1.8,K.red),0,.8)+sh(160),

/* ---------------- DAILY ACTIVITIES ---------------- */
'productive':re(60,170,200,12,K.brown,3)+ln(80,182,80,250,K.brown,8)+ln(240,182,240,250,K.brown,8)+re(110,120,100,52,K.dark,6)+re(116,126,88,40,K.sky,3)
  +re(280,50,90,140,K.white,8,st(K.ink,4))+[0,1,2,3].map(i=>ln(316,78+i*30,356,78+i*30,K.gray,5)+A('a-tick',294,76+i*30,pl(`288,${78+i*30} 296,${86+i*30} 308,${68+i*30}`,K.green,5),i*.4,2.4)).join('')
  +A('a-spin',90,70,ci(90,70,26,K.gray)+ci(90,70,10,K.white)+[0,45,90,135].map(a=>`<g transform="rotate(${a} 90 70)">${re(84,38,12,64,K.gray,3)}</g>`).join(''),0,3),
'spontaneous':A('a-hop',180,250,person(180,250,{c:K.orange,arms:'up',face:'grin'}),0,1)+re(240,190,70,56,K.purple,8)+re(260,180,30,12,'none',4,st(K.ink,4))
  +A('a-pulse',110,70,ci(110,70,30,K.yellow)+tx(110,84,'!',40,K.ink),0,.7),
'energetic':A('a-hop',200,250,person(200,250,{c:K.yellow,arms:'up',face:'grin'}),0,.8)+[[100,110],[300,100],[120,200],[290,200]].map(([x,y],i)=>A('a-blink',x,y,pa(`M${x} ${y-24}l-12 26h10l-6 22 20-30h-10l8-18z`,K.yellow,st('#C9932B',2)),i*.2,.6)).join(''),
'unwind':re(80,150,150,100,K.purple,20)+re(70,130,30,110,K.purple,12)+person(160,240,{c:K.teal,sit:1,face:'sleep',arms:'front'})+re(186,166,20,18,K.white,4,st(K.ink,2))
  +[192,200].map((x,i)=>A('a-float',x,160,`<path d="M${x} 162q-6-10 0-20t0-20" fill="none" ${st(K.gray,3)}/>`,i*.6,1.8)).join('')+floaty([280,320],170,(x,y)=>note(x,y,K.purple,.9),2.4),
'rush':A('a-bob',200,250,person(200,250,{c:K.red,run:.4,arms:'out',anim:['a-swing','a-swing'],face:'wow'}),0,.2)+re(212,126,18,14,'#E8B865',3)
  +[0,1,2].map(i=>A('a-blink',90,150+i*30,ln(60,150+i*30,130,150+i*30,K.gray,6),i*.15,.4)).join('')+clock(320,80,40,1),
'carry out':re(70,50,140,190,K.white,8,st(K.ink,4))+re(110,40,60,20,K.dark,6)+lines(90,90,100,8,18)
  +pa('M260 120h40v90a20 20 0 0 1-40 0z',K.white,st(K.ink,4))+pa('M262 170h36v40a18 18 0 0 1-36 0z',K.green)+floaty([272,286],170,(x,y)=>ci(x,y,5,K.white),1.2)+person(330,250,{c:K.blue,arms:'front',s:.7}),
'devote':person(130,250,{c:K.blue,sit:1,arms:'front',face:'smile'})+openBook(200,170,80,K.orange)
  +A('a-hourglass',320,120,pa('M290 70h60l-30 50 30 50h-60l30-50z',K.white,st(K.ink,5))+pa('M300 80h40l-20 30z',K.yellow)+pa('M320 140l16 24h-32z',K.yellow),0,2.4)+A('a-pulse',220,90,heart(220,90,1.2),0,1),
'binge-watch':re(200,40,170,110,K.ink,8)+re(208,48,154,94,K.sky)+['1','2','3'].map((t,i)=>A('a-epi',285,95,tx(285,108,'EP '+t,30,K.white),i,3)).join('')+ln(285,150,285,170,K.ink,6)
  +re(40,180,180,60,K.red,16)+person(120,240,{c:K.yellow,sit:1,arms:'front',face:'wow',s:.85})+re(130,160,30,30,K.white,4,st(K.red,3)),
'accomplish':pa('M60 260L190 80l130 180z',K.gray)+pa('M190 80l30 42-14 6-16-20-14 16z',K.white)+person(190,96,{c:K.orange,arms:'up',face:'grin',s:.6})+ln(220,40,220,90,K.ink,4)+A('a-sway',220,42,pa('M220 42h40l-10 12 10 12h-40z',K.red),0,1)
  +A('a-pulse',330,90,ci(330,90,30,K.green)+pl('316,92 326,102 344,80',K.white,6),0,1),
'concentrate':[0,1,2].map(i=>A('a-breathe',150,110,ci(150,110,40+i*24,'none',st(K.blue,3)+' opacity=".5"'),i*.4,2)).join('')+person(150,250,{c:K.blue,sit:1,arms:'front',face:'flat'})
  +re(200,180,160,10,K.brown,3)+re(230,150,70,32,K.white,4,st(K.ink,3))+[300,340].map((x,i)=>A('a-blink',x,80,tx(x,80,'?',26,K.gray),i*.3,1.4)).join(''),
'kick-start':re(0,240,400,60,K.green)+A('a-lift',200,170,pa('M200 40q30 30 30 90v50h-60v-50q0-60 30-90z',K.white,st(K.ink,4))+ci(200,110,12,K.sky,st(K.ink,3))+pa('M170 150l-22 30h22zM230 150l22 30h-22z',K.red)
  +A('a-flicker',200,190,pa('M182 190q18 50 36 0z',K.orange),0,.2),0,2)+ci(330,230,40,K.yellow,'opacity=".8"'),
'quality time':re(30,220,340,30,'#F7C7A0',6)+person(120,236,{c:K.blue,arms:'out',face:'grin'})+person(280,236,{c:K.pink,arms:'out',face:'grin'})+A('a-hop',200,236,person(200,236,{c:K.yellow,arms:'up',face:'grin',s:.65}),0,1)
  +floaty([160,240],110,(x,y)=>heart(x,y,1),2.2),
'daily chores':A('a-sway',120,90,ln(120,90,140,220,K.brown,7)+pa('M118 210h44l14 40h-72z',K.yellow),0,.7)+[0,1,2].map(i=>el(280,230-i*16,50,8,K.white,st(K.ink,3))).join('')
  +pa('M220 120h120l-14 60h-92z',K.sky)+[240,270,300].map(x=>re(x,104,22,24,[K.red,K.green,K.purple][x%3],3)).join('')+floaty([140,160],230,(x,y)=>ci(x,y,4,K.gray),1),
'hectic life':person(200,250,{c:K.red,arms:'up',face:'angry'})+A('a-spin',200,120,phone(110,90,30,50)+re(260,90,60,40,K.dark,4)+ci(200,40,22,K.white,st(K.ink,4)),0,2)
  +[0,1].map(i=>A('a-blink',100+i*200,230,tx(100+i*200,230,'!',30,K.red),i*.3,.5)).join(''),
'bad habit':re(0,0,400,300,'#1E2A4A')+re(60,190,280,40,K.blue,10)+re(60,170,50,60,K.dark,8)+ci(150,182,20,K.skin)+pa('M130 178a20 20 0 0 1 40 0z',K.ink)+ci(144,184,3,K.ink)+ci(156,184,3,K.ink)
  +A('a-glow',190,170,re(176,150,30,44,'#BFE3FF',4),0,1)+clock(320,80,34,1.2)+A('a-pulse',260,150,ln(240,130,280,170,K.red,7)+ln(280,130,240,170,K.red,7),0,1),
'an early bird':ci(320,250,70,K.yellow)+A('a-spin',320,250,Array.from({length:8},(_,i)=>`<g transform="rotate(${i*45} 320 250)">${ln(320,166,320,150,K.yellow,5)}</g>`).join(''),0,8)
  +A('a-hop',160,200,el(160,170,46,38,K.orange)+ci(186,150,22,K.orange)+ci(194,146,4,K.ink)+pa('M206 150l20 6-20 6z',K.yellow)+pa('M130 160q-30-10-36 20q20 4 36-6z','#C96A2A')+ln(150,206,146,226,K.ink,4)+ln(170,206,174,226,K.ink,4),0,.8)
  +A('a-ring',80,90,ci(80,90,28,K.red)+ci(80,90,20,K.white)+ln(80,90,80,76,K.ink,3)+ln(80,90,90,90,K.ink,3)+ci(62,64,8,K.red)+ci(98,64,8,K.red),0,.2),
'a night owl':re(0,0,400,300,'#1E2A4A')+ci(320,70,30,K.yellow)+ci(332,62,28,'#1E2A4A')+[[60,50],[160,40],[240,90]].map(([x,y],i)=>A('a-blink',x,y,star(x,y,6,K.white),i*.4,1.6)).join('')
  +ln(80,240,330,240,K.brown,10)+el(190,180,52,62,'#8A6A4A')+ci(170,160,20,K.white)+ci(210,160,20,K.white)+A('a-blinkeye',190,160,ci(170,160,9,K.ink)+ci(210,160,9,K.ink),0,3)+pa('M184 176l6 10 6-10z',K.yellow)
  +pa('M150 130l10-22 10 20zM210 128l10-20 10 22z','#8A6A4A'),
'let off steam':person(200,250,{c:K.red,arms:'hips',face:'angry',skin:'#F0A58A'})+floaty([170,200,230],110,(x,y)=>cloud(x,y,.7,K.gray),1.8)+sh(200),
'lead a hectic life':re(0,226,400,30,K.gray)+[0,1].map(i=>A('a-drive',200,0,car(200,250,[K.blue,K.yellow][i],.8),-i*1.5,3)).join('')
  +A('a-walk',200,226,person(200,226,{c:K.dark,run:.35,arms:'front',face:'angry',s:.8})+re(214,150,24,18,K.brown,3),0,2.4)+clock(330,70,36,.8),
'meet one’s deadline':re(60,50,140,150,K.white,8,st(K.ink,4))+re(60,50,140,34,K.red,8)+Array.from({length:12},(_,i)=>re(74+(i%4)*30,100+Math.floor(i/4)*30,18,18,K.gray,3)).join('')
  +A('a-pulse',143,159,ci(143,159,16,'none',st(K.red,4)),0,1)+clock(300,90,40,3)+A('a-dropin',300,170,re(270,170,60,74,K.white,4,st(K.ink,3))+pl('282,206 296,220 318,192',K.green,6),0,2.4),
'in a good mood':ci(320,70,30,K.yellow)+A('a-sway',180,250,person(180,250,{c:K.pink,arms:'wave',anim:['a-wave','a-wave'],face:'grin'}),0,.8)+floaty([240,280,110],170,(x,y)=>note(x,y,K.purple,.9),2.2),
'rush to work':re(290,60,100,190,K.blue,4)+Array.from({length:6},(_,i)=>re(304+(i%2)*40,80+Math.floor(i/2)*44,30,30,K.sky,3)).join('')+re(326,200,30,50,K.ink)
  +A('a-commute',100,250,person(100,250,{c:K.dark,run:.35,arms:'out',anim:['a-swing','a-swing'],face:'wow'})+re(118,186,30,22,K.brown,4),0,2.4)+clock(60,60,30,.8),
/* ---------------- EXAM ---------------- */
'exam':re(120,190,160,14,K.brown,4)+ln(140,204,140,250,K.brown,8)+ln(260,204,260,250,K.brown,8)
  +person(80,250,{c:K.dark,sit:0,arms:'front',face:'smile'})+person(320,250,{c:K.blue,arms:'front',face:'grin'})
  +A('a-talk1',120,60,re(40,40,120,60,K.white,16,st(K.ink,3))+tx(100,80,'Q?',26,K.dark),0,3)
  +A('a-talk2',280,60,re(240,40,130,60,K.yellow,16,st(K.ink,3))+lines(256,62,98,3,12,K.dark),0,3)
  +re(176,150,48,40,K.white,6,st(K.ink,3))+ln(200,160,200,172,K.ink,3)+ln(200,172,210,176,K.ink,3),
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
window.ICONS.how=window.ICONS.feel;
})();
