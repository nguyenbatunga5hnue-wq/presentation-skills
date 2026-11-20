/* Cooking show (ingredients, dishes, judge) and the daily-routine comic. Same kit as scenes.js. */
const P2={
/* ---------- ingredients (drawn large around 200,150) ---------- */
'ing-noodles':pa('M70 150h260q0 100-130 100T70 150z',K.white,st(K.ink,6))+[0,1,2,3,4].map(i=>`<path d="M${100+i*10} ${150-i*4}q30-40 60 0t60 0t60 0" fill="none" ${st('#F1E6C8',9)}/>`).join(''),
'ing-beef':pa('M80 110q60-60 180-30q80 30 60 100q-30 70-150 50q-110-20-90-120z','#C8463D')+`<path d="M110 120q50 20 90-10M140 170q40 10 120-30M230 100q20 30 0 60" fill="none" ${st('#F4C7C0',8)}/>`,
'ing-onion':pa('M200 60q-20 30-80 60q-40 40 0 110q40 40 80 40t80-40q40-70 0-110q-60-30-80-60z','#B57BC4')+`<path d="M200 70q-40 60-40 190M200 70q40 60 40 190" fill="none" ${st('#E5C6EE',5)}/>`+pa('M190 60q10-30 20 0z',K.leaf),
'ing-ginger':pa('M80 170q-10-50 40-60q20-40 60-20q40-30 70 10q50-10 60 40q20 40-20 60q-40 20-80 0q-40 20-80 0q-50 0-50-30z','#D8B07A',st('#A8804A',4)),
'ing-anise':Array.from({length:8},(_,i)=>`<g transform="rotate(${i*45} 200 150)"><path d="M200 150l-18-70q18-20 36 0z" fill="#8A4B2A"/><circle cx="200" cy="96" r="7" fill="#E3B57A"/></g>`).join('')+ci(200,150,14,'#5E321C'),
'ing-herbs':ln(200,260,200,120,K.green,8)+[[-60,-10],[60,-30],[-50,-60],[50,-80],[0,-110]].map(([dx,dy])=>el(200+dx,200+dy,40,20,K.leaf,`transform="rotate(${dx>0?-30:30} ${200+dx} ${200+dy})"`)).join(''),
'ing-lime':ci(200,150,90,'#7CC04B')+ci(200,150,78,'#D7F0A8')+Array.from({length:8},(_,i)=>`<g transform="rotate(${i*45} 200 150)">${ln(200,150,200,78,'#7CC04B',5)}</g>`).join('')+ci(200,150,10,'#7CC04B'),
'ing-chilli':pa('M110 90q30 130 200 150q30 0 10-20q-160-40-180-140z',K.red)+pa('M100 90q-10-40 20-40q-6 20 10 40z',K.leaf),
'ing-fishsauce':re(160,40,80,30,K.ink,6)+pa('M150 70h100v160q0 20-20 20h-60q-20 0-20-20z','#C98B2A')+re(160,140,80,60,K.white,6)+tx(200,180,'Nước mắm',15,K.ink),
'ing-riceflour':pa('M110 70h180l20 180H90z',K.white,st(K.gray,5))+pa('M110 70q90 30 180 0','none',st(K.gray,5))+tx(200,180,'RICE',30,K.blue)+tx(200,212,'FLOUR',22,K.blue),
'ing-pork':pa('M80 200q20-90 120-100q100 10 120 100z','#E9A1A1')+[0,1,2,3,4,5].map(i=>ci(120+i*32,180-(i%2)*20,10,'#D07A7A')).join('')+el(200,205,130,16,K.white,st(K.ink,4)),
'ing-mushroom':pa('M90 150q0-80 110-80t110 80q-30-20-60 0q-20-30-50 0q-30-30-50 0q-30-20-60 0z','#4A3328')+pa('M120 170q80 40 160 0q-20 60-80 60t-80-60z','#6B4A3A'),
'ing-shallots':pa('M90 200h220q-20 50-110 50T90 200z',K.white,st(K.ink,4))+Array.from({length:22},(_,i)=>el(110+(i*37)%180,170+(i*13)%30,12,6,['#D99A3A','#B8732A','#E8B65A'][i%3],`transform="rotate(${i*40} ${110+(i*37)%180} ${170+(i*13)%30})"`)).join(''),
'ing-baguette':pa('M50 190q-10-40 40-60l220-60q50-10 50 30t-40 60l-220 60q-40 10-50-30z','#D99A4A')+[0,1,2,3].map(i=>`<path d="M${120+i*50} ${150-i*14}q16 10 30 0" fill="none" ${st('#F3D39A',7)}/>`).join(''),
'ing-pate':re(110,110,180,110,'#B8C3CF',20)+re(110,100,180,24,'#9AA6B4',12)+re(140,130,120,70,K.white,8)+tx(200,175,'PÂTÉ',30,'#B5533C'),
'ing-cucumber':pa('M60 200q0-60 140-90t140 30q0 40-140 70T60 200z','#3F8F3A')+[0,1].map(i=>ci(250+i*50,110+i*80,34,'#3F8F3A')+ci(250+i*50,110+i*80,28,'#CDEBB5')).join(''),
'ing-egg':pa('M80 160q0-80 120-70q100-20 130 50q20 90-110 90q-140 10-140-70z',K.white,st(K.gray,4))+ci(200,155,40,K.yellow),
'ing-mango':pa('M120 120q60-80 150-30q60 60 0 140q-50 60-130 20q-60-50-20-130z','#F2B03B')+pa('M150 120q40-30 80 0','none',st('#F7D27A',10))+pa('M250 60q20-30 50-20q-20 20-40 30z',K.leaf),
'ing-milk':pa('M140 80h120v170H140z',K.white,st(K.ink,4))+pa('M140 80l20-40h80l20 40z','#DDE8F6',st(K.ink,4))+re(150,130,100,60,K.sky,6)+tx(200,170,'MILK',26,K.white),
'ing-ice':[[140,110],[230,100],[180,180]].map(([x,y],i)=>re(x,y,70,70,'#D6EEFF',14,st('#8FC4EE',5)+` transform="rotate(${i*14-10} ${x+35} ${y+35})"`)).join(''),
'ing-sugar':pa('M100 190h200q0 60-100 60T100 190z','#E8D9C0')+[[150,160],[200,140],[250,160],[175,120],[225,118]].map(([x,y])=>re(x-20,y-20,40,40,K.white,6,st('#CCC',3))).join(''),
'ing-chocolate':re(110,60,180,180,'#5B3A29',14)+Array.from({length:6},(_,i)=>re(124+(i%2)*80,74+Math.floor(i/2)*54,70,44,'#6E4733',6)).join(''),
'ing-cheese':pa('M70 220l160-140 110 60v80z','#F5C842')+[[150,190,14],[230,170,10],[280,200,16],[200,215,8]].map(([x,y,r])=>ci(x,y,r,'#D9A520')).join(''),
'ing-ketchup':pa('M160 40h80l10 40q30 20 30 70v90q0 20-20 20H140q-20 0-20-20v-90q0-50 30-70z',K.red)+re(170,20,60,30,K.white,8)+re(146,130,108,60,K.white,10)+tx(200,168,'KETCHUP',17,K.red),

/* ---------- finished dishes ---------- */
'dish-pho':pa('M60 140h280q0 120-140 120T60 140z',K.white,st(K.ink,6))+el(200,140,140,22,'#E7C27A')+`<path d="M90 140q30-16 60 0t60 0t60 0t40 0" fill="none" ${st('#F6EBD0',7)}/>`
  +el(160,134,30,10,'#A5503F')+el(220,130,30,10,'#A5503F')+el(260,136,18,8,K.leaf)+el(120,136,14,7,K.leaf)+ci(290,128,10,'#7CC04B')
  +[150,200,250].map((x,i)=>A('a-float',x,110,`<path d="M${x} 116q-10-14 0-28t0-28" fill="none" ${st(K.gray,6)}/>`,i*.5,1.8)).join('')+ln(300,40,250,130,K.brown,7)+ln(320,46,262,134,K.brown,7),
'dish-banhcuon':el(200,200,160,40,K.white,st(K.ink,5))+[0,1,2].map(i=>pa(`M${90+i*75} 190q0-36 35-36h20q30 0 30 36z`,'#F6F2E8',st('#D8CFBB',3))).join('')
  +Array.from({length:14},(_,i)=>el(100+i*15,160-(i%3)*4,6,3,'#D99A3A')).join('')+el(320,140,36,16,K.white,st(K.ink,3))+el(320,140,28,10,'#E3A24B')
  +[150,250].map((x,i)=>A('a-float',x,140,`<path d="M${x} 146q-8-12 0-24t0-24" fill="none" ${st(K.gray,5)}/>`,i*.6,1.8)).join(''),
'dish-banhmi':pa('M50 200q-10-60 50-80l200-40q60-6 60 40t-50 70l-200 40q-50 10-60-30z','#D99A4A')+pa('M80 180l220-50q30 0 20 20l-230 50z','#F6EBD0')
  +[0,1,2,3].map(i=>el(110+i*55,170-i*12,22,8,['#3F8F3A','#C8463D','#7CC04B','#E9A1A1'][i])).join('')+A('a-pulse',300,80,star(300,80,14),0,1),
'dish-smoothie':pa('M130 60h140l-20 190h-100z','#F2B03B','opacity=".95"')+pa('M130 60h140l-4 30h-132z',K.white)+ln(220,60,250,10,K.pink,9)+ci(270,70,24,'#7CC04B')
  +floaty([170,200,230],230,(x,y)=>ci(x,y,5,'#FFF3C9'),1.6),

/* ---------- pot and judge ---------- */
'pot':re(90,140,220,110,K.dark,20)+re(70,150,30,16,K.dark,8)+re(300,150,30,16,K.dark,8)+re(80,130,240,20,'#3A4152',10)
  +A('a-flicker',200,270,pa('M130 270q20-40 40 0q20-50 30 0q20-40 40 0q20-40 30 0z',K.orange),0,.4),
'judge-wait':person(200,250,{c:K.white,arms:'down',face:'flat'})+re(176,80,48,36,K.white,12,st(K.gray,3))+re(180,110,40,10,K.red,3),
'judge-yum':A('a-hop',200,250,person(200,250,{c:K.white,arms:'up',face:'grin'})+re(176,80,48,36,K.white,12,st(K.gray,3))+re(180,110,40,10,K.red,3),0,.8)
  +floaty([110,290,320],140,(x,y)=>star(x,y,12),1.6),
'judge-yuck':A('a-shake',200,200,person(200,250,{c:K.white,arms:'hips',face:'angry',skin:'#C9E3A0'})+re(176,80,48,36,K.white,12,st(K.gray,3))+re(180,110,40,10,K.red,3),0,.3)
  +floaty([140,260],120,(x,y)=>`<path d="M${x} ${y}q10-14 0-28t0-28" fill="none" ${st(K.leaf,6)}/>`,1.4),

/* ---------- comic: a day in Minh's life ---------- */
'c1':re(0,0,400,300,'#1E2A4A')+ci(340,50,22,K.yellow)+ci(350,44,20,'#1E2A4A')+re(40,190,300,50,K.blue,12)+re(40,170,50,70,K.dark,8)
  +person(170,220,{c:K.orange,sit:1,arms:'front',face:'wow',s:.8})+re(196,150,50,34,K.dark,4)+A('a-glow',221,166,re(200,154,42,26,'#BFE3FF',3),0,1)
  +re(270,40,70,40,K.ink,6)+tx(305,68,'23:30',20,'#FF6B6B'),
'c2':ci(330,60,30,K.yellow)+re(40,200,200,40,K.blue,10)+A('a-ring',90,90,ci(90,90,34,K.red)+ci(90,90,26,K.white)+ln(90,90,90,72,K.ink,4)+ln(90,90,104,96,K.ink,4)+ci(68,58,9,K.red)+ci(112,58,9,K.red),0,.2)
  +A('a-hop',250,250,person(250,250,{c:K.orange,arms:'up',face:'wow',s:.9}),0,.6)+tx(90,160,'7:15',24,K.red),
'c3':re(0,200,400,100,'#F3E3C8')+re(60,170,140,14,K.brown,4)+ln(80,184,80,250,K.brown,7)+ln(180,184,180,250,K.brown,7)+re(110,140,26,30,K.white,4,st(K.ink,2))
  +person(110,250,{c:K.pink,arms:'front',face:'smile',hair:K.brown})+A('a-walk',280,250,person(280,250,{c:K.orange,run:.4,arms:'out',anim:['a-swing','a-swing'],face:'wow',s:.85})+re(292,154,18,14,'#E8B865',3),0,3),
'c4':re(40,30,320,110,'#2F5D4A',8)+lines(70,60,200,4,20,'#DDEEDD')+person(330,250,{c:K.purple,arms:'wave',anim:[0,'a-wave'],face:'flat',s:.8})
  +re(80,200,160,12,K.brown,3)+person(150,250,{c:K.orange,sit:1,arms:'front',face:'sleep',s:.8})+floaty([180,200],130,(x,y)=>tx(x,y,'Z',22,K.purple),2),
'c5':re(0,200,400,100,K.leaf)+ci(340,60,30,K.yellow)+person(120,250,{c:K.orange,run:.5,arms:'out',face:'grin'})+person(300,250,{c:K.blue,arms:'up',face:'grin',s:.9})
  +A('a-pass',210,230,ball(210,230,14),0,1.6),
'c6':re(0,0,400,300,'#FFF4E0')+re(40,170,320,16,K.gray,4)+person(110,250,{c:K.pink,arms:'front',face:'smile',hair:K.brown})+pa('M130 160h60q0 30-30 30t-30-30z',K.dark)
  +[150,170].map((x,i)=>A('a-float',x,150,`<path d="M${x} 156q-6-10 0-20t0-20" fill="none" ${st(K.gray,4)}/>`,i*.5,1.6)).join('')
  +person(280,250,{c:K.orange,arms:'front',anim:['a-strum','a-strum'],face:'grin'})+el(300,170,30,8,K.white,st(K.ink,2))+floaty([260,320],160,(x,y)=>ci(x,y,7,K.sky,'opacity=".7"'),1.6),
'c7':re(40,150,200,14,K.brown,3)+ln(60,164,60,250,K.brown,7)+ln(220,164,220,250,K.brown,7)+person(110,250,{c:K.orange,sit:1,arms:'front',face:'smile',s:.85})+re(140,124,60,28,K.white,4,st(K.ink,2))
  +A('a-pulse',310,110,ci(310,110,40,K.green)+pl('290,112 304,126 330,96',K.white,8),0,1)+clock(310,220,30,6),
'c8':re(0,0,400,300,'#1E2A4A')+ci(60,60,24,K.yellow)+ci(70,54,22,'#1E2A4A')+re(80,190,240,50,K.blue,12)+re(80,170,50,70,K.dark,8)+ci(160,182,18,K.skin)+pa('M142 178a18 18 0 0 1 36 0z',K.ink)
  +ln(152,182,158,182,K.ink,2)+ln(164,182,170,182,K.ink,2)+pa('M156 190q4 4 8 0','none',st(K.ink,2))+floaty([200,220],160,(x,y)=>tx(x,y,'Z',22,K.white),2)
  +re(270,80,80,46,K.ink,6)+tx(310,112,'6:00',22,'#7CFC9A'),
};
Object.assign(P,P2);
