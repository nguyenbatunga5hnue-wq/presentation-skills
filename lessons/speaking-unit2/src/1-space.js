/* ===== 3D solar-system journey (three.js, teacher-driven) ===== */
(function(){
const sec=$('#sSpace');if(!sec)return;
const host=$('.sp3d',sec);
if(!window.THREE){host.innerHTML='<p class="nogl">Không tải được thư viện 3D.</p>';return}
const T=THREE,V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z),UP=V(0,1,0);

/* ---------- stops (one build step each) ---------- */
const STOPS=[
 {k:'intro',lab:'Bắt đầu'},
 {k:'earthsc',lab:'Trái Đất',ov:'earth'},
 {k:'obs',lab:'Observatory',ov:'obs',w:'observatory',ipa:'/əbˈzɜːvətri/',pos:'n',vn:'đài thiên văn',ex:'We visited an [observatory] on a school trip.'},
 {k:'gaze',lab:'Stargazing',ov:'gaze',w:'stargazing',ipa:'/ˈstɑːɡeɪzɪŋ/',pos:'n',vn:'ngắm sao',ex:'I go [stargazing] whenever the sky is clear.'},
 {k:'pad',lab:'Bệ phóng',ov:'pad'},
 {k:'astro',lab:'Astronaut',ov:'astro',w:'astronaut',ipa:'/ˈæstrənɔːt/',pos:'n',vn:'phi hành gia',ex:'The [astronaut] waved goodbye before the launch.'},
 {k:'ship',lab:'Spaceship',ov:'ship',w:'spaceship',ipa:'/ˈspeɪsʃɪp/',pos:'n',vn:'tàu vũ trụ',ex:'The [spaceship] is ready for take-off.',
   w2:'launch',vn2:'phóng (tàu, tên lửa)',ex2:'They will [launch] the spaceship at sunrise.'},
 {k:'earth',lab:'Earth',ov:'launch',w:'Earth',ipa:'/ɜːθ/',pos:'n',vn:'Trái Đất',ex:'[Earth] is the only planet we know with life.',p:'Earth'},
 {k:'venus',lab:'Venus',w:'Venus',ipa:'/ˈviːnəs/',pos:'n',vn:'sao Kim',ex:'[Venus] is the hottest planet in our solar system.',p:'Venus'},
 {k:'mars',lab:'Mars',w:'Mars',ipa:'/mɑːz/',pos:'n',vn:'sao Hoả',ex:'[Mars] is often called the red planet.',p:'Mars'},
 {k:'jupiter',lab:'Jupiter',w:'Jupiter',ipa:'/ˈdʒuːpɪtə(r)/',pos:'n',vn:'sao Mộc',ex:'[Jupiter] is the biggest planet in our solar system.',p:'Jupiter'},
 {k:'pluto',lab:'Pluto',w:'Pluto',ipa:'/ˈpluːtəʊ/',pos:'n',vn:'sao Diêm Vương',ex:'[Pluto] used to be a planet. Now it is a dwarf planet.',p:'Pluto'},
 {k:'comet',lab:'Comet',w:'comet',ipa:'/ˈkɒmɪt/',pos:'n',vn:'sao chổi',ex:'A [comet] has a long, bright tail of ice and dust.'},
 {k:'meteor',lab:'Meteor',w:'meteor',ipa:'/ˈmiːtiə(r)/',pos:'n',vn:'thiên thạch (bốc cháy khi lao vào khí quyển)',ex:'Comet dust burns up in the sky as a [meteor].',
   w2:'shooting star',vn2:'sao băng (cách nói tự nhiên hơn)',ex2:'I saw a [shooting star] last night.',p:'Earth'},
 {k:'ufo',lab:'Extraterrestrial',w:'extraterrestrial',ipa:'/ˌekstrətəˈrestriəl/',pos:'n, adj',vn:'sinh vật ngoài Trái Đất; thuộc về ngoài Trái Đất',ex:"I'm not sure whether [extraterrestrial] life exists.",p:'Earth'},
 {k:'solar',lab:'Solar system',w:'solar system',ipa:'/ˈsəʊlə ˌsɪstəm/',pos:'n',vn:'hệ Mặt Trời',ex:'There are eight planets in our [solar system].'},
 {k:'const',lab:'Constellation',w:'constellation',ipa:'/ˌkɒnstəˈleɪʃn/',pos:'n',vn:'chòm sao',ex:'The Little Bear [constellation] is still used by navigators at sea.'},
 {k:'milky',lab:'Milky Way',w:'the Milky Way',ipa:'/ðə ˌmɪlki ˈweɪ/',pos:'n',vn:'dải Ngân Hà',ex:'You can see [the Milky Way] clearly in the countryside.',
   w2:'light-years away',vn2:'cách xa hàng năm ánh sáng, rất rất xa',ex2:'Those stars are [light-years away].'},
 {k:'cosmos',lab:'Cosmos',w:'cosmos',ipa:'/ˈkɒzmɒs/',pos:'n',vn:'vũ trụ',ex:'The [cosmos] is almost impossible to imagine.',
   w2:'vastness',vn2:'sự bao la, rộng lớn',ex2:'The [vastness] of space is mind-blowing.'}
];
sec.dataset.steps=STOPS.length-1;

/* ---------- renderer ---------- */
const R=new T.WebGLRenderer({antialias:true,logarithmicDepthBuffer:true,preserveDrawingBuffer:false});
R.setPixelRatio(Math.min(2,window.devicePixelRatio||1));host.prepend(R.domElement);
const scene=new T.Scene();scene.background=new T.Color(0x02040b);
const cam=new T.PerspectiveCamera(50,16/9,.02,900000);
scene.add(new T.AmbientLight(0x6070a0,.35));
const sunLight=new T.PointLight(0xfff2dd,3.2,0,0);scene.add(sunLight);
function resize(){const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;R.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()}
new ResizeObserver(resize).observe(host);

/* ---------- procedural textures ---------- */
function rng(s){return()=>(s=(s*16807)%2147483647,(s-1)/2147483646)}
function noiseGen(seed){const r=rng(seed),N=256,P=new Float32Array(N*N);for(let i=0;i<N*N;i++)P[i]=r();
  const sm=t=>t*t*(3-2*t);
  return(x,y,per)=>{const xi=Math.floor(x),yi=Math.floor(y),fx=sm(x-xi),fy=sm(y-yi);
    const g=(a,b)=>P[(((b%N)+N)%N)*N+(((per?((a%per)+per)%per:a)%N)+N)%N];
    const a=g(xi,yi),b=g(xi+1,yi),c=g(xi,yi+1),d=g(xi+1,yi+1);return a+(b-a)*fx+(c-a)*fy+(a-b-c+d)*fx*fy}}
function fbm(nz,x,y,per,o=5){let s=0,a=.5,f=1,t=0;for(let i=0;i<o;i++){s+=a*nz(x*f,y*f,per*f);t+=a;a*=.5;f*=2}return s/t}
const hex=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
const mix=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
function tex(W,H,fn){const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d'),im=g.createImageData(W,H),d=im.data;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const p=fn(x/W,y/H),i=(y*W+x)*4;d[i]=p[0];d[i+1]=p[1];d[i+2]=p[2];d[i+3]=p[3]==null?255:p[3]}
  g.putImageData(im,0,0);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.anisotropy=4;return t}
const nz1=noiseGen(7),nz2=noiseGen(91),nz3=noiseGen(331);
const F=8; // lattice cells across the texture width (periodic -> no seam)
const TEX={
 sun:()=>tex(256,128,(u,v)=>{const n=fbm(nz1,u*F,v*F/2,F);return mix(hex('#ff8a1c'),hex('#ffe58a'),Math.min(1,n*1.5-.1))}),
 mercury:()=>tex(256,128,(u,v)=>{const n=fbm(nz2,u*F,v*F/2,F);return mix(hex('#5d5752'),hex('#b5aea6'),n)}),
 venus:()=>tex(256,128,(u,v)=>{const w=fbm(nz1,u*4,v*2,4,3);const n=fbm(nz3,u*F+w*3,v*F*1.6,F);return mix(hex('#c99a52'),hex('#f6e0a8'),n)}),
 earth:()=>tex(512,256,(u,v)=>{const n=fbm(nz2,u*F,v*F/2,F,6),lat=Math.abs(v-.5)*2;
   if(lat>.86)return[240,246,250];
   if(n>.53){const k=(n-.53)*4;return lat>.6?mix(hex('#9aa37a'),hex('#e6ede8'),k):mix(hex('#3f8a3a'),hex('#9b8550'),Math.min(1,k*1.4))}
   return mix(hex('#123d86'),hex('#2f7bd0'),Math.min(1,n*1.7))}),
 clouds:()=>tex(512,256,(u,v)=>{const n=fbm(nz3,u*F*1.5,v*F*.75,F*1.5,5);const a=Math.max(0,(n-.5)*3.2);return[255,255,255,Math.min(220,a*255)]}),
 mars:()=>tex(256,128,(u,v)=>{const n=fbm(nz3,u*F,v*F/2,F),lat=Math.abs(v-.5)*2;if(lat>.9)return[245,240,235];return mix(hex('#7c2a0c'),hex('#e0753a'),n*1.3-.1)}),
 jupiter:()=>tex(512,256,(u,v)=>{const w=fbm(nz1,u*F,v*F/2,F,4);const b=Math.sin(v*Math.PI*15+w*3.5)*.5+.5;
   let c=mix(hex('#a8683c'),hex('#f3e4c8'),b);const dx=(u-.62)/.07,dy=(v-.64)/.035,r=dx*dx+dy*dy;if(r<1)c=mix(hex('#c0442a'),c,r*r);return c}),
 saturn:()=>tex(256,128,(u,v)=>{const w=fbm(nz2,u*F,v*F/2,F,3);const b=Math.sin(v*Math.PI*12+w*2)*.5+.5;return mix(hex('#c8a86e'),hex('#f1e2b8'),b)}),
 uranus:()=>tex(128,64,(u,v)=>mix(hex('#8fd3dc'),hex('#c9f0f2'),Math.sin(v*Math.PI*6)*.15+.5)),
 neptune:()=>tex(128,64,(u,v)=>{const n=fbm(nz1,u*F,v*F/2,F,3);return mix(hex('#24409e'),hex('#5b86e5'),n)}),
 pluto:()=>tex(256,128,(u,v)=>{const n=fbm(nz2,u*F,v*F/2,F);let c=mix(hex('#7d6450'),hex('#d9c3a5'),n);
   const x=(u-.5)/.09,y=(v-.52)/.13;const h=Math.pow(x*x+y*y-1,3)-x*x*Math.pow(-y,3);if(h<0)c=mix(c,hex('#f5ece0'),.85);return c})
};
function glowTex(){const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d'),gr=g.createRadialGradient(64,64,0,64,64,64);
  gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.25,'rgba(255,255,255,.55)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,128,128);
  const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;return t}
const GLOW=glowTex();
const glowMat=(col,op=1)=>new T.SpriteMaterial({map:GLOW,color:col,transparent:true,opacity:op,blending:T.AdditiveBlending,depthWrite:false});

/* ---------- sun, planets, orbits ---------- */
const sun=new T.Mesh(new T.SphereGeometry(5,48,32),new T.MeshBasicMaterial({map:TEX.sun()}));scene.add(sun);
const sunGlow=new T.Sprite(glowMat(0xffb347,.95));sunGlow.scale.set(34,34,1);scene.add(sunGlow);
const sunGlow2=new T.Sprite(glowMat(0xff7a1a,.22));sunGlow2.scale.set(40,40,1);scene.add(sunGlow2);
const PL={};
const PDEF=[['Mercury',10,.5,.4,'mercury'],['Venus',15,1,1.15,'venus'],['Earth',21,1.1,2.0,'earth'],['Mars',28,.75,2.75,'mars'],['Jupiter',40,3.2,3.55,'jupiter'],
  ['Saturn',54,2.7,4.45,'saturn'],['Uranus',66,1.7,5.25,'uranus'],['Neptune',76,1.6,5.95,'neptune'],['Pluto',86,.45,.75,'pluto']];
PDEF.forEach(([n,d,r,a,t])=>{const m=new T.Mesh(new T.SphereGeometry(r,48,32),new T.MeshPhongMaterial({map:TEX[t](),shininess:6}));
  const y=n==='Pluto'?4:0;m.position.set(d*Math.cos(a),y,d*Math.sin(a));m.rotation.z=.25;scene.add(m);PL[n]={m,r,pos:m.position.clone(),d};
  const pts=[];for(let i=0;i<=160;i++){const q=i/160*Math.PI*2;pts.push(V(d*Math.cos(q),n==='Pluto'?4*Math.cos(q-a):0,d*Math.sin(q)))}
  const o=new T.Line(new T.BufferGeometry().setFromPoints(pts),new T.LineBasicMaterial({color:0x3a5aa0,transparent:true,opacity:.35}));scene.add(o);PL[n].orbit=o});
const clouds=new T.Mesh(new T.SphereGeometry(1.13,48,32),new T.MeshPhongMaterial({map:TEX.clouds(),transparent:true,depthWrite:false}));PL.Earth.m.add(clouds);
const atm=new T.Sprite(glowMat(0x5aa0ff,.35));atm.scale.set(3.4,3.4,1);PL.Earth.m.add(atm);
const marsGlow=new T.Sprite(glowMat(0xff6a3a,.18));marsGlow.scale.set(2.4,2.4,1);PL.Mars.m.add(marsGlow);
(function(){const c=document.createElement('canvas');c.width=c.height=512;const g=c.getContext('2d');
  for(let r=150;r<250;r++){const k=(r-150)/100;const a=(.35+.4*Math.sin(k*40)*Math.sin(k*7))*(k>.55&&k<.6?.1:1);g.strokeStyle=`rgba(${215-k*40},${190-k*40},${150-k*30},${Math.max(0,a)})`;g.beginPath();g.arc(256,256,r,0,7);g.stroke()}
  const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;
  const ring=new T.Mesh(new T.PlaneGeometry(2.7*4,2.7*4),new T.MeshBasicMaterial({map:t,transparent:true,side:T.DoubleSide,depthWrite:false}));ring.rotation.x=-Math.PI/2+.35;PL.Saturn.m.add(ring)})();

/* ---------- star field, galaxy, other galaxies ---------- */
function points(n,fn,size,col,att=false){const g=new T.BufferGeometry(),p=new Float32Array(n*3),c=new Float32Array(n*3);
  for(let i=0;i<n;i++){const o=fn(i);p.set(o.p,i*3);c.set(o.c||[1,1,1],i*3)}g.setAttribute('position',new T.BufferAttribute(p,3));g.setAttribute('color',new T.BufferAttribute(c,3));
  return new T.Points(g,new T.PointsMaterial({size,map:GLOW,vertexColors:true,transparent:true,depthWrite:false,blending:T.AdditiveBlending,sizeAttenuation:att,color:col||0xffffff}))}
const r1=rng(4242);
const stars=points(4000,()=>{const u=r1()*2-1,q=r1()*Math.PI*2,s=Math.sqrt(1-u*u),R2=2600+r1()*300,b=.45+r1()*.55,w=r1();
  return{p:[R2*s*Math.cos(q),R2*u,R2*s*Math.sin(q)],c:w<.15?[b,b*.85,b*.7]:w<.3?[b*.75,b*.85,b]:[b,b,b]}},3.2);scene.add(stars);
const G=V(-2400,-200,900);
const galaxy=points(26000,i=>{const arm=i%4,rr=Math.pow(r1(),.6)*3600,ang=arm*Math.PI/2+rr*.0016+(r1()-.5)*.6*(1-rr/4200),y=(r1()-.5)*120*(1-rr/4000);
  const core=rr<700;const c=core?[1,.85,.6]:(r1()<.5?[.6,.75,1]:[.95,.9,1]);const b=.35+r1()*.65;
  return{p:[G.x+rr*Math.cos(ang),G.y+y,G.z+rr*Math.sin(ang)],c:c.map(x=>x*b)}},60,null,true);
galaxy.material.opacity=0;scene.add(galaxy);
const galCore=new T.Sprite(glowMat(0xffd59a,0));galCore.position.copy(G);galCore.scale.set(2600,2600,1);scene.add(galCore);
function galTex(seed){const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d'),r=rng(seed);
  const gr=g.createRadialGradient(64,64,0,64,64,20);gr.addColorStop(0,'rgba(255,240,210,1)');gr.addColorStop(1,'rgba(255,240,210,0)');g.fillStyle=gr;g.fillRect(0,0,128,128);
  for(let i=0;i<700;i++){const arm=i%2,rr=Math.pow(r(),.7)*58,a=arm*Math.PI+rr*.09;g.fillStyle=`rgba(${170+r()*80},${190+r()*60},255,${.5*(1-rr/60)})`;g.fillRect(64+rr*Math.cos(a)+(r()-.5)*6,64+rr*Math.sin(a)*.55+(r()-.5)*5,1.6,1.6)}
  const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;return t}
const others=new T.Group();scene.add(others);
const GT=[galTex(3),galTex(17),galTex(29)];
for(let i=0;i<140;i++){const s=new T.Sprite(new T.SpriteMaterial({map:GT[i%3],transparent:true,opacity:0,blending:T.AdditiveBlending,depthWrite:false,rotation:r1()*6}));
  const R2=30000+r1()*160000,q=r1()*Math.PI*2,u=(r1()*2-1)*.8;s.position.set(G.x+R2*Math.cos(q)*Math.sqrt(1-u*u),G.y+R2*u,G.z+R2*Math.sin(q)*Math.sqrt(1-u*u));
  const sc=6000+r1()*14000;s.scale.set(sc,sc,1);others.add(s)}

/* ---------- constellation: Ursa Minor (Little Bear) ---------- */
const CDIR=V(-.4,.55,.95).normalize(),CC=CDIR.clone().multiplyScalar(2300);
const cx=V().crossVectors(CDIR,UP).normalize(),cy=V().crossVectors(cx,CDIR).normalize();
const UMI=[['Polaris',0,0],['',1.5,-.35],['',2.75,-.75],['',3.75,-1.55],['',4.0,-2.75],['Kochab',5.45,-3.05],['',5.25,-1.75]];
const cpos=UMI.map(([,x,y])=>CC.clone().addScaledVector(cx,(x-2.7)*95).addScaledVector(cy,(y+1.5)*95));
const cStars=new T.Group();scene.add(cStars);
cpos.forEach((p,i)=>{const s=new T.Sprite(glowMat(i===0?0xfff3c4:0xdfe8ff,0));s.position.copy(p);s.scale.set(i===0?70:50,i===0?70:50,1);cStars.add(s)});
const CL=[0,1,2,3,6,5,4,3];const cLineG=new T.BufferGeometry().setFromPoints(CL.map(i=>cpos[i]));
const cLine=new T.Line(cLineG,new T.LineBasicMaterial({color:0x8fb2f5,transparent:true,opacity:0}));scene.add(cLine);cLineG.setDrawRange(0,0);

/* ---------- spaceship ---------- */
const ship=new T.Group();scene.add(ship);
(function(){const white=new T.MeshPhongMaterial({color:0xf2f4f8,shininess:60}),red=new T.MeshPhongMaterial({color:0xd8432f,shininess:40}),
  glass=new T.MeshPhongMaterial({color:0x7fc8ff,emissive:0x1a4a7a,shininess:90});
  const body=new T.Mesh(new T.CylinderGeometry(.15,.18,.62,20),white);body.rotation.x=Math.PI/2;ship.add(body);
  const nose=new T.Mesh(new T.ConeGeometry(.15,.3,20),red);nose.rotation.x=Math.PI/2;nose.position.z=.46;ship.add(nose);
  const win=new T.Mesh(new T.SphereGeometry(.07,16,12),glass);win.position.set(0,.13,.14);ship.add(win);
  for(let i=0;i<3;i++){const f=new T.Mesh(new T.BoxGeometry(.02,.2,.2),red);const a=i/3*Math.PI*2;f.position.set(Math.sin(a)*.19,Math.cos(a)*.19,-.24);f.rotation.z=-a;ship.add(f)}
  const fl=new T.Mesh(new T.ConeGeometry(.12,.45,16),new T.MeshBasicMaterial({color:0xffa53a,transparent:true,opacity:.9,blending:T.AdditiveBlending,depthWrite:false}));
  fl.rotation.x=-Math.PI/2;fl.position.z=-.52;ship.add(fl);ship.userData.flame=fl;
  const fg=new T.Sprite(glowMat(0xff8a3a,.8));fg.scale.set(.7,.7,1);fg.position.z=-.45;ship.add(fg);ship.userData.fg=fg})();
ship.scale.setScalar(1.3);
const trail=points(60,()=>({p:[0,0,0],c:[0,0,0]}),.35,null,true);scene.add(trail);trail.frustumCulled=false;const trailHist=[];

/* ---------- meteors, comet, UFO ---------- */
const MET=16,MN=18;const met=points(MET*MN,()=>({p:[0,0,0],c:[0,0,0]}),.55,null,true);scene.add(met);met.frustumCulled=false;
const metState=[];const r2=rng(77);
const comet=new T.Group();scene.add(comet);comet.visible=false;
const cHead=new T.Mesh(new T.SphereGeometry(.35,16,12),new T.MeshPhongMaterial({color:0xcfe6ff,emissive:0x335577}));comet.add(cHead);
const cGlow=new T.Sprite(glowMat(0xbfe0ff,1));cGlow.scale.set(5,5,1);comet.add(cGlow);
const CT=700;const cTail=points(CT,()=>({p:[0,0,0],c:[0,0,0]}),1.1,null,true);scene.add(cTail);cTail.frustumCulled=false;cTail.visible=false;
const cSeed=Array.from({length:CT},()=>[r2(),r2(),r2(),r2()]);
const ufo=new T.Group();scene.add(ufo);ufo.visible=false;
(function(){const disc=new T.Mesh(new T.SphereGeometry(1,40,20),new T.MeshPhongMaterial({color:0x9aa4b4,shininess:100,specular:0xffffff}));disc.scale.set(1,.22,1);ufo.add(disc);
  const dome=new T.Mesh(new T.SphereGeometry(.48,32,16,0,Math.PI*2,0,Math.PI/2),new T.MeshPhongMaterial({color:0x9fffe0,transparent:true,opacity:.45,shininess:120}));dome.position.y=.12;ufo.add(dome);
  const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d');
  g.fillStyle='#62d26f';g.beginPath();g.ellipse(64,62,34,40,0,0,7);g.fill();g.fillStyle='#0d1420';
  g.beginPath();g.ellipse(48,62,11,17,-.5,0,7);g.fill();g.beginPath();g.ellipse(80,62,11,17,.5,0,7);g.fill();
  g.fillStyle='#fff';g.beginPath();g.arc(45,55,3.5,0,7);g.fill();g.beginPath();g.arc(77,55,3.5,0,7);g.fill();
  g.strokeStyle='#0d1420';g.lineWidth=3;g.beginPath();g.arc(64,86,8,.2,Math.PI-.2);g.stroke();
  const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;const al=new T.Sprite(new T.SpriteMaterial({map:t,transparent:true}));al.scale.set(.62,.62,1);al.position.y=.32;ufo.add(al);
  const lights=[];for(let i=0;i<12;i++){const a=i/12*Math.PI*2;const l=new T.Mesh(new T.SphereGeometry(.06,8,6),new T.MeshBasicMaterial({color:i%2?0xffd34d:0xff5a7a}));l.position.set(Math.cos(a)*.92,-.02,Math.sin(a)*.92);ufo.add(l);lights.push(l)}
  const beam=new T.Mesh(new T.ConeGeometry(1.1,3.2,32,1,true),new T.MeshBasicMaterial({color:0x7dffb0,transparent:true,opacity:0,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide}));
  beam.position.y=-1.65;ufo.add(beam);ufo.userData={lights,beam}})();

/* ---------- HTML overlays: labels, card, route ---------- */
const labs=$('.sp-labels',sec);
const LABS=PDEF.map(([n])=>{const e=document.createElement('span');e.className='plab3';e.textContent=n;labs.appendChild(e);return{e,o:PL[n].m}});
const here=document.createElement('span');here.className='plab3 here';here.textContent='Bạn ở đây · You are here';labs.appendChild(here);
const polaris=document.createElement('span');polaris.className='plab3 star';polaris.textContent='Polaris · North Star';labs.appendChild(polaris);
const umiLab=document.createElement('span');umiLab.className='plab3 star';umiLab.textContent='Ursa Minor · Little Bear';labs.appendChild(umiLab);
const card=$('.wcard',sec),route=$('.sp-route',sec),ov=$('.sp-ov',sec);
route.innerHTML=STOPS.map((s,i)=>i?`<button data-stop="${i}" aria-label="Điểm dừng ${i}"><b>${i}</b><span>${s.lab}</span></button>`:'').join('');
route.addEventListener('click',e=>{const b=e.target.closest('[data-stop]');if(b)setStep(sec,+b.dataset.stop)});
let quiz=false,showLabels=false;
const hl=t=>esc(t).replace(/\[(.+?)\]/g,'<mark>$1</mark>');
function paintCard(s,reveal){if(!s.w){card.classList.remove('in');return}
  const hide=quiz&&!reveal;
  card.innerHTML=`<div class="wtop"><span class="wno">${STOPS.indexOf(s)}</span>${hide?'<span class="wq">?</span>':`<b class="ww">${esc(s.w)}</b>`}
    <button class="spk" data-say="${esc(s.w)}" title="Nghe phát âm" aria-label="Nghe phát âm">🔊</button></div>
   ${hide?'<button class="b pri" data-act="sp-reveal">Hiện từ</button>':`<div class="wipa">${esc(s.ipa||'')} <i>${esc(s.pos||'')}</i></div>
   <div class="wvn">${esc(s.vn)}</div><div class="wex">${hl(s.ex)}</div>
   ${s.w2?`<div class="w2"><div class="wtop"><b>${esc(s.w2)}</b><button class="spk" data-say="${esc(s.w2)}" aria-label="Nghe phát âm">🔊</button></div><div class="wvn">${esc(s.vn2)}</div><div class="wex">${hl(s.ex2)}</div></div>`:''}`}`;
  card.classList.remove('in');void card.offsetWidth;card.classList.add('in')}
sec.addEventListener('click',e=>{const a=e.target.closest('[data-act]');if(!a)return;const act=a.dataset.act;
  if(act==='sp-reveal'){paintCard(STOPS[stop],true);SFX.chime()}
  else if(act==='sp-quiz'){quiz=!quiz;a.classList.toggle('on',quiz);a.textContent=quiz?'Chế độ đố: bật':'Chế độ đố: tắt';if(STOPS[stop].w&&card.classList.contains('in'))paintCard(STOPS[stop])}
  else if(act==='sp-labels'){showLabels=!showLabels;a.classList.toggle('on',showLabels)}
  else if(act==='sp-view'){yaw=0;pitch=0;zoom=1}});

/* ---------- camera rig + teacher drag/zoom ---------- */
let yaw=0,pitch=0,zoom=1,drag=null;
host.addEventListener('pointerdown',e=>{if(e.target!==R.domElement)return;drag={x:e.clientX,y:e.clientY};host.setPointerCapture(e.pointerId)});
host.addEventListener('pointermove',e=>{if(!drag)return;yaw-=(e.clientX-drag.x)*.006;pitch=Math.max(-1.2,Math.min(1.2,pitch+(e.clientY-drag.y)*.005));drag={x:e.clientX,y:e.clientY}});
host.addEventListener('pointerup',()=>drag=null);
host.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(.35,Math.min(3,zoom*Math.exp(e.deltaY*.0012)))},{passive:false});
const camLook=V(),want={pos:V(),look:V()};

/* ---------- stop geometry ---------- */
function near(n,side=1){const p=PL[n],rad=p.pos.clone().setY(0).normalize(),perp=V(-rad.z,0,rad.x);
  const sp=p.pos.clone().addScaledVector(perp,(p.r*1.7+1)*side).addScaledVector(UP,p.r*.35).addScaledVector(rad,-p.r*.6);
  const mid=p.pos.clone().lerp(sp,.42),k=p.r*2.4+3.4;
  return{ship:sp,cam:mid.clone().addScaledVector(rad,-k).addScaledVector(perp,side*k*.6).addScaledVector(UP,k*.36),look:mid}}
const cometSpot=(()=>{const a=.25,rad=V(Math.cos(a),0,Math.sin(a)),perp=V(-rad.z,0,rad.x),sp=rad.clone().multiplyScalar(70).setY(2);
  return{ship:sp,rad,perp,cam:sp.clone().addScaledVector(perp,-6.5).addScaledVector(UP,1.6).addScaledVector(rad,-1.2),look:sp.clone().addScaledVector(perp,7).addScaledVector(rad,1)}})();
function frame(k){const s=STOPS[k];
  if(s.k==='intro'||s.ov&&s.k!=='earth'){const e=near('Earth');return{ship:e.ship,orbit:true}}
  if(s.k==='earth'){const e=near('Earth');return e}
  if(s.k==='meteor'){const e=near('Earth'),P=PL.Earth.pos,rad=P.clone().normalize(),perp=V(-rad.z,0,rad.x);
    return{ship:e.ship,cam:P.clone().addScaledVector(rad,-7.5).addScaledVector(perp,5.5).addScaledVector(UP,2.4),look:P.clone().addScaledVector(perp,1.2)}}
  if(s.k==='comet')return cometSpot;
  if(s.k==='ufo'){const j=near('Earth');return{ship:j.ship,cam:j.cam.clone().addScaledVector(UP,1.2),look:j.ship.clone().addScaledVector(UP,1.4)}}
  if(s.p)return near(s.p,s.k==='venus'?-1:1);
  if(s.k==='solar')return{ship:null,cam:V(10,175,105),look:V(0,0,8)};
  if(s.k==='const'){const e=PL.Earth.pos.clone().addScaledVector(UP,3);return{ship:null,cam:e,look:e.clone().addScaledVector(CDIR,100)}}
  if(s.k==='milky')return{ship:null,cam:G.clone().add(V(900,6200,4200)),look:G.clone().add(V(1700,0,500))};
  if(s.k==='cosmos')return{ship:null,cam:G.clone().add(V(0,90000,110000)),look:G.clone()}}

/* ---------- flight ---------- */
let fly=null,stop=0,t0=0,cardAt=0,cardShown=true,evD=0;
function flyTo(to,dur,launch){const from=ship.position.clone();const d=from.distanceTo(to);if(d<.01){fly=null;return 0}
  dur=dur||Math.max(2.2,Math.min(5,d/14));const ctrl=from.clone().lerp(to,.5).addScaledVector(UP,launch?1.5:d*.18);
  fly={from,ctrl,to,t:performance.now(),dur:dur*1000,launch};return dur}
function bez(f,u){const a=f.from.clone().lerp(f.ctrl,u),b=f.ctrl.clone().lerp(f.to,u);return a.lerp(b,u)}
const ease=u=>u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2;

/* ---------- sounds for this slide ---------- */
let AC=null;const ac=()=>{if(!AC){const A=window.AudioContext||window.webkitAudioContext;if(A)AC=new A()}if(AC&&AC.state==='suspended')AC.resume();return AC};
function rumble(dur=2.4){if(!SFX.on)return;const c=ac();if(!c)return;const t=c.currentTime,n=Math.floor(c.sampleRate*dur),b=c.createBuffer(1,n,c.sampleRate),d=b.getChannelData(0);
  for(let i=0;i<n;i++)d[i]=(Math.random()*2-1);const s=c.createBufferSource();s.buffer=b;const f=c.createBiquadFilter();f.type='lowpass';f.frequency.setValueAtTime(180,t);f.frequency.linearRampToValueAtTime(900,t+dur);
  const g=c.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.35,t+.3);g.gain.exponentialRampToValueAtTime(.001,t+dur);s.connect(f).connect(g).connect(c.destination);s.start(t)}
function wobble(dur=2.6){if(!SFX.on)return;const c=ac();if(!c)return;const t=c.currentTime,o=c.createOscillator(),l=c.createOscillator(),lg=c.createGain(),g=c.createGain();
  o.type='sine';o.frequency.value=520;l.frequency.value=7;lg.gain.value=160;l.connect(lg).connect(o.frequency);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.09,t+.3);g.gain.linearRampToValueAtTime(0,t+dur);
  o.connect(g).connect(c.destination);o.start(t);l.start(t);o.stop(t+dur+.1);l.stop(t+dur+.1)}
const SND=[];let later=(ms,f)=>{SND.push(setTimeout(f,ms))};const laterBase=later;function hush(){SND.forEach(clearTimeout);SND.length=0}

/* ---------- step handler ---------- */
let ovT=0;
STEP.sSpace=(s,n)=>{hush();clearTimeout(ovT);stop=n;t0=performance.now();yaw=0;pitch=0;zoom=1;const S=STOPS[n],f=frame(n);
  $$('[data-stop]',route).forEach(b=>{const k=+b.dataset.stop;b.classList.toggle('on',k===n);b.classList.toggle('done',k<n);b.classList.toggle('fut',k>n)});
  card.classList.remove('in');cardShown=false;
  const ovOn=!!S.ov;ov.dataset.k=S.ov||'';ov.classList.toggle('on',ovOn);sec.classList.toggle('ovmode',ovOn);
  if(S.ov==='launch')ovT=setTimeout(()=>{ov.classList.remove('on');sec.classList.remove('ovmode')},2300);
  sec.classList.toggle('intro',n===0);
  let dur=0;
  if(f.ship){if(S.k==='earth'){const E=PL.Earth;ship.position.copy(E.pos).addScaledVector(E.pos.clone().normalize(),-E.r*1.02).addScaledVector(UP,.2);fly=null;
      SND.push(setTimeout(()=>{if(stop===n)flyTo(f.ship,2.6,true)},2100));dur=4.7;rumble(4.5)}
    else if(S.ov||n===0){ship.position.copy(f.ship);fly=null}
    else{dur=flyTo(f.ship);if(dur)SFX.whoosh()}}
  evD=['meteor','comet','ufo'].includes(S.k)?(dur?dur+.4:0):0;
  const delay={earth:4.9,meteor:1.7,comet:4.2,ufo:3.2,const:2.6,milky:2.6,cosmos:3,solar:1.6,obs:2.2,gaze:2.2,astro:2.6,ship:1.2}[S.k];
  cardAt=(delay!=null?Math.max(delay+evD,dur+.3):dur+.4)*1000;
  later=(ms,f)=>laterBase(ms+evD*1000,f);
  if(S.k==='meteor'){later(1000,()=>SFX.whoosh(false));later(1500,()=>SFX.thud())}
  if(S.k==='comet'){later(2600,()=>SFX.whoosh());later(4200,()=>SFX.chime())}
  if(S.k==='ufo'){later(400,()=>wobble(3.2))}
  if(S.k==='obs'){later(500,()=>SFX.zip());later(1400,()=>SFX.thud())}
  if(S.k==='gaze'){later(1200,()=>SFX.whoosh());}
  if(S.k==='earthsc'||S.k==='pad')SFX.whoosh(false);
  if(S.k==='astro'){[300,700,1100,1500,1900].forEach(t=>later(t,()=>SFX.tick()))}
  if(S.k==='ship')later(200,()=>SFX.grow());
  if(S.k==='earth'){[0,1,2].forEach(i=>later(i*600,()=>SFX.tick()));later(1900,()=>SFX.thud())}
  if(S.k==='const'){[0,1,2,3,4,5,6,7].forEach(i=>later(900+i*200,()=>SFX.pop(i+1)))}
  if(S.k==='milky'||S.k==='cosmos')SFX.whoosh(false);
  metState.length=0;if(S.k==='meteor')for(let i=0;i<MET;i++)metState.push(newMeteor(i));
};
ov.addEventListener('click',e=>{const h=e.target.closest('[data-go]');if(h){setStep(sec,+h.dataset.go)}});
function newMeteor(i){const P=PL.Earth.pos,r=PL.Earth.r;const dir=V(r2()-.5,r2()*.6+.2,r2()-.5).normalize();
  const tgt=P.clone().addScaledVector(V(r2()-.5,r2()-.2,r2()-.5).normalize(),r*.95);
  if(i===0){const sp=ship.position;return{a:sp.clone().add(V(14,5,-10)),b:sp.clone().add(V(-16,-4,12)),s:.9,d:1.1,big:true}}
  const a=tgt.clone().addScaledVector(dir,9+r2()*6);return{a,b:tgt,s:.2+i*.35+r2()*.4,d:.8+r2()*.6}}

/* ---------- main loop ---------- */
let raf=0,last=0;
function loop(now){raf=requestAnimationFrame(loop);const dt=Math.min(.05,(now-(last||now))/1000);last=now;const tt=(now-t0)/1000,S=STOPS[stop],te=tt-evD;
  sun.rotation.y+=dt*.05;PDEF.forEach(([n])=>PL[n].m.rotation.y+=dt*(n==='Jupiter'?.5:.25));clouds.rotation.y+=dt*.05;
  /* ship flight */
  let tan=V(0,0,1).applyQuaternion(ship.quaternion);
  if(fly){let u=Math.min(1,(now-fly.t)/fly.dur);const e=ease(u),p=bez(fly,e),p2=bez(fly,Math.min(1,e+.01));
    if(p2.distanceTo(p)>1e-5){tan=p2.clone().sub(p).normalize();ship.lookAt(p.clone().add(tan))}ship.position.copy(p);if(u>=1)fly=null}
  else ship.position.y+=Math.sin(now/600)*.0015;
  const fl=ship.userData.flame,boost=fly?1:.35;fl.scale.set(1,(.7+Math.random()*.6)*boost*(fly&&fly.launch?1.8:1),1);ship.userData.fg.material.opacity=.5*boost+.2;
  trailHist.unshift(ship.position.clone().addScaledVector(tan,-.75*1.3));if(trailHist.length>60)trailHist.pop();
  {const pa=trail.geometry.attributes.position,ca=trail.geometry.attributes.color;for(let i=0;i<60;i++){const p=trailHist[Math.min(i,trailHist.length-1)];pa.setXYZ(i,p.x,p.y,p.z);const k=fly?(1-i/60)*.9:0;ca.setXYZ(i,k,k*.55,k*.2)}pa.needsUpdate=ca.needsUpdate=true}
  /* desired camera */
  const f=frame(stop);
  if(f.orbit){const a=now/9000;want.pos.set(Math.cos(a)*120,62,Math.sin(a)*120);want.look.set(0,0,0)}
  else if(fly&&!(S.k==='solar')){want.pos.copy(ship.position).addScaledVector(tan,-4.2).addScaledVector(UP,1.6);want.look.copy(ship.position).addScaledVector(tan,7)}
  else{want.pos.copy(f.cam);want.look.copy(f.look)}
  const off=want.pos.clone().sub(want.look);const sph=new T.Spherical().setFromVector3(off);sph.theta+=yaw;sph.phi=Math.max(.05,Math.min(Math.PI-.05,sph.phi-pitch));sph.radius*=zoom;
  const dpos=want.look.clone().add(V().setFromSpherical(sph));
  const big=S.k==='milky'||S.k==='cosmos'||cam.position.length()>4000;
  const a=1-Math.exp(-dt*(big?1.6:3.2));
  if(big){const lp=cam.position.clone().sub(G),ld=dpos.clone().sub(G);const r0=Math.max(1,lp.length()),r1_=Math.max(1,ld.length());
    const rr=Math.exp(Math.log(r0)+(Math.log(r1_)-Math.log(r0))*a);lp.normalize().lerp(ld.normalize(),a).normalize();cam.position.copy(G).addScaledVector(lp,rr)}
  else cam.position.lerp(dpos,a);
  camLook.lerp(want.look,a);
  /* shake on big meteor */
  if(S.k==='meteor'&&te>1.35&&te<1.9){cam.position.x+=(Math.random()-.5)*.12;cam.position.y+=(Math.random()-.5)*.12}
  cam.lookAt(camLook);
  /* galaxy / stars visibility */
  const cd=cam.position.length();const gTarget=(S.k==='milky'||S.k==='cosmos')?1:0;
  galaxy.material.opacity+=(gTarget*.9-galaxy.material.opacity)*a;galCore.material.opacity=galaxy.material.opacity*.5;
  stars.material.opacity=Math.max(0,Math.min(1,1-(cd-2000)/1500));
  others.children.forEach(o=>o.material.opacity+=((S.k==='cosmos'?.85:0)-o.material.opacity)*a*.6);
  PDEF.forEach(([n])=>PL[n].orbit.material.opacity=S.k==='solar'?.75:.3);
  /* constellation */
  const cOn=S.k==='const';sunGlow.visible=sunGlow2.visible=!cOn;cStars.children.forEach((s,i)=>{const tg=cOn?(tt>.6+i*.2?1:0):0;s.material.opacity+=(tg-s.material.opacity)*.12*(1+Math.sin(now/300+i)*.05)});
  cLine.material.opacity+=((cOn?.9:0)-cLine.material.opacity)*.1;cLineG.setDrawRange(0,cOn?Math.max(0,Math.min(CL.length,Math.floor((tt-.9)/.2)+1)):0);
  /* meteors */
  {const pa=met.geometry.attributes.position,ca=met.geometry.attributes.color;
   for(let m=0;m<MET;m++){const st=metState[m];for(let j=0;j<MN;j++){const i=m*MN+j;
     if(!st){ca.setXYZ(i,0,0,0);continue}
     let u=(te-st.s)/st.d;if(!st.big&&u>1.4){st.s=te+r2()*1.2;u=-1}if(u<0||u>1){ca.setXYZ(i,0,0,0);continue}
     const uu=Math.max(0,u-j*.022);const p=st.a.clone().lerp(st.b,uu);pa.setXYZ(i,p.x,p.y,p.z);const k=(1-j/MN)*(st.big?1:.85);ca.setXYZ(i,k,k*(j<2?.95:.6),k*(j<2?.85:.3))}}
   pa.needsUpdate=ca.needsUpdate=true;met.material.size=.9}
  /* comet */
  const cOn2=S.k==='comet'&&te>0;comet.visible=cTail.visible=cOn2;
  if(cOn2){const c=cometSpot,u=Math.min(1,tt/6.5);const C0=c.ship.clone().addScaledVector(c.perp,8.5);
    const hp=C0.clone().addScaledVector(c.rad,24-48*u).addScaledVector(UP,2.5-4*u);comet.position.copy(hp);
    const anti=hp.clone().normalize();const pa=cTail.geometry.attributes.position,ca=cTail.geometry.attributes.color;
    for(let i=0;i<CT;i++){const [q1,q2,q3,q4]=cSeed[i];const ion=i%3===0;const L=(ion?16:11)*Math.pow(q1,ion?1:1.3);const spread=(ion?.15:.55)*L*.28;
      const p=hp.clone().addScaledVector(anti,L).addScaledVector(c.perp,(q2-.5)*spread+(ion?0:L*L*.012)).addScaledVector(UP,(q3-.5)*spread);
      const fl2=Math.min(1,u*8)*(1-q1)*(.6+.4*Math.sin(now/90+q4*40));pa.setXYZ(i,p.x,p.y,p.z);
      ion?ca.setXYZ(i,fl2*.45,fl2*.7,fl2):ca.setXYZ(i,fl2*.9,fl2*.88,fl2*.75)}pa.needsUpdate=ca.needsUpdate=true}
  /* UFO */
  const uOn=S.k==='ufo'&&te>0;ufo.visible=uOn;
  if(uOn){const sp=ship.position,hover=sp.clone().add(V(0,2.2,0)).addScaledVector(V().subVectors(cam.position,sp).setY(0).normalize(),.6);
    const start=sp.clone().add(V(-30,14,-36));const u=Math.max(0,Math.min(1,te/2.4)),e=1-Math.pow(1-u,3);
    ufo.position.copy(start.lerp(hover,e));ufo.position.x+=Math.sin(tt*6)*(1-e)*2;ufo.position.y+=Math.sin(tt*2.2)*.12;ufo.rotation.y+=dt*2.4;ufo.rotation.z=Math.sin(tt*3)*.08;
    ufo.userData.lights.forEach((l,i)=>l.material.color.setHSL(((i+Math.floor(now/150))%3)/3*.15+.95,1,.6));
    const bo=te>2.5?.28+Math.sin(now/120)*.06:0;ufo.userData.beam.material.opacity+=(bo-ufo.userData.beam.material.opacity)*.2}
  /* labels */
  const W=host.clientWidth,H=host.clientHeight;
  const place=(el,p,on)=>{const v=p.clone().project(cam);const vis=on&&v.z<1&&Math.abs(v.x)<1.05&&Math.abs(v.y)<1.05;el.classList.toggle('vis',vis);if(vis){el.style.transform=`translate(${(v.x*.5+.5)*W}px,${(-v.y*.5+.5)*H}px)`}};
  LABS.forEach(L=>place(L.e,L.o.position.clone().add(V(0,PL[L.e.textContent].r+1.2,0)),(S.k==='solar'||showLabels)&&!['milky','cosmos','const'].includes(S.k)));
  place(here,V(0,0,0),S.k==='milky'&&tt>1.2);place(polaris,cpos[0],cOn&&tt>1);place(umiLab,cpos[4].clone().lerp(cpos[5],.5),cOn&&tt>2.4);
  /* card */
  if(!cardShown&&S.w&&now-t0>cardAt){cardShown=true;paintCard(S);if(!quiz)SFX.ding()}
  R.render(scene,cam)}
ENTER.sSpace=()=>{resize();if(!raf){last=0;raf=requestAnimationFrame(loop)}if(!sec.dataset.init){sec.dataset.init=1;setStep(sec,0);cam.position.set(120,62,0)}};
LEAVE.push(()=>{if(raf){cancelAnimationFrame(raf);raf=0}hush()});
})();
