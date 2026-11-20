/* Chef Blaze (an original fiery TV-chef character) and extra ingredients. Same kit as scenes.js. */
function chef(mood){
  const face=mood==='yuck'?'#F29C86':K.skin;
  const hair=pa('M146 104q-18-30 4-52q-4 18 12 22q-6-30 22-40q-6 20 10 22q8-26 36-22q-14 14-4 24q22-14 38 6q-16 2-14 14q20 2 22 24q-30-20-62-14q-34-2-64 16z','#EBC250',st('#C99E2E',3));
  const jacket=pa('M110 300v-70q0-40 50-48h80q50 8 50 48v70z',K.white,st(K.gray,3))+pa('M180 182l20 30 20-30z','#E3E8EF')
    +[0,1,2].map(i=>ci(184,226+i*22,4.5,K.ink)+ci(216,226+i*22,4.5,K.ink)).join('')+re(150,270,100,6,K.red,3);
  const head=el(200,128,50,58,face)+el(150,130,9,14,face)+el(250,130,9,14,face)+hair;
  let brows,eyes,mouth,arms='',extra='';
  if(mood==='yuck'){
    brows=ln(166,104,192,114,K.ink,6)+ln(234,104,208,114,K.ink,6);eyes=ci(182,124,5,K.ink)+ci(218,124,5,K.ink);
    mouth=pa('M176 152q24-14 48 0q-4 26-24 26t-24-26z',K.ink)+pa('M184 166q16 6 32 0v8q-16 6-32 0z','#E86A6A');
    arms=A('a-point',290,230,ln(282,236,346,170,face,16)+ci(350,165,10,face)+ln(352,160,374,138,face,8),0,.35);
    extra=[150,250].map((x,i)=>A('a-float',x,70,cloud(x,70,.5,'#E6E6E6'),i*.4,1.2)).join('');
  }else if(mood==='yum'){
    brows=pa('M166 106q14-10 26 0','none',st(K.ink,5))+pa('M208 106q14-10 26 0','none',st(K.ink,5));
    eyes=pa('M174 126q8-8 16 0','none',st(K.ink,4))+pa('M210 126q8-8 16 0','none',st(K.ink,4));
    mouth=pa('M172 148q28 26 56 0z',K.ink)+pa('M180 150h40q-4 6-20 6t-20-6z',K.white);
    arms=A('a-thumb',300,240,ln(282,240,320,190,K.white,26)+ci(326,180,16,face)+re(320,150,12,26,face,6),0,.6);
    extra=floaty([110,300,330],120,(x,y)=>star(x,y,13),1.6);
  }else{
    brows=ln(168,108,192,104,K.ink,5)+A('a-brow',220,104,ln(208,104,232,96,K.ink,5),0,2.4);eyes=ci(182,124,4.5,K.ink)+ci(218,124,4.5,K.ink);
    mouth=ln(186,156,214,154,K.ink,4);
    arms=pa('M120 250q40-24 160 0v20q-80-22-160 0z',K.white,st(K.gray,3))+ci(130,258,12,face)+ci(270,258,12,face);
  }
  const body=jacket+head+brows+eyes+mouth+(mood==='yuck'?ln(184,140,190,144,K.ink,0):'')+pa('M196 132q4 10 8 0','none',st('#C98A6A',3));
  return mood==='yuck'?A('a-shake',200,200,body,0,.25)+arms+extra:mood==='yum'?A('a-hop',200,300,body+arms,0,.9)+extra:A('a-bob',200,300,body+arms,0,2.4);
}
const P3={
'chef-wait':chef('wait'),'chef-yum':chef('yum'),'chef-yuck':chef('yuck'),
'ing-salt':A('a-pour2',200,150,pa('M150 90h100v150q0 16-16 16h-68q-16 0-16-16z',K.white,st(K.ink,5))+pa('M150 90q0-40 50-40t50 40z',K.gray,st(K.ink,5))+[180,200,220].map(x=>ci(x,72,4,K.ink)).join('')+tx(200,190,'SALT',26,K.blue),0,2),
'ing-pepper':re(170,40,60,40,K.dark,10)+re(160,80,80,170,K.brown,14)+ci(200,40,12,K.ink)+Array.from({length:10},(_,i)=>ci(150+(i*23)%100,265+(i%3)*8,4,K.ink)).join(''),
'ing-garlic':pa('M200 60q-20 30-70 70q-40 50 0 100q30 30 70 30t70-30q40-50 0-100q-50-40-70-70z','#F6F1E7',st('#C9BFA8',5))+`<path d="M200 70q-30 60-20 190M200 70q30 60 20 190" fill="none" ${st('#DDD3BE',4)}/>`+pa('M190 62q10-30 20 0z','#C9BFA8'),
};
Object.assign(P,P3);
