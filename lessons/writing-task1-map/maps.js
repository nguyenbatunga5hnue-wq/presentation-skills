/* Plans drawn for this lesson (1000 x 620 units). t = bld | room | green | trees | water | road | ped | car | rail | spot
   The two practice maps are redrawn from the model answers in the lesson notes, not copied from a test book. */
window.PLANS=(()=>{
const ent={entrance:[500,620,'up']};
const CAMPUS0={...ent,compass:[955,575],items:[
 {id:'path',t:'road',x:470,y:430,w:60,h:190},
 {id:'cls',t:'bld',x:60,y:60,w:240,h:160,l:'Classrooms'},
 {id:'garden',t:'green',x:340,y:60,w:260,h:160,l:'Garden'},
 {id:'ne',t:'trees',x:650,y:50,w:310,h:370,l:'Trees'},
 {id:'canteen',t:'bld',x:340,y:270,w:260,h:140,l:'Canteen',c:'o'},
 {id:'offices',t:'bld',x:60,y:420,w:240,h:160,l:'Offices',c:'p'},
 {id:'lib',t:'bld',x:580,y:450,w:220,h:130,l:'Library',c:'g'}]};
const CAMPUS1={...ent,compass:[955,575],items:[
 {id:'path',t:'road',x:470,y:430,w:60,h:190},
 {id:'cls',t:'bld',x:60,y:60,w:240,h:310,l:'Classrooms'},
 {id:'garden',t:'bld',x:340,y:60,w:260,h:160,l:'Sports\nfacilities',c:'r'},
 {id:'ne',t:'bld',x:650,y:50,w:145,h:220,l:'Library',c:'g'},
 {id:'it',t:'bld',x:815,y:50,w:145,h:220,l:'IT centre',c:'t'},
 {id:'ne2',t:'trees',x:650,y:310,w:310,h:110,l:''},
 {id:'canteen',t:'bld',x:340,y:270,w:260,h:140,l:'Admin\noffices',c:'p'},
 {id:'offices',t:'bld',x:60,y:420,w:240,h:160,l:'Offices',c:'p'},
 {id:'lib',t:'car',x:580,y:450,w:220,h:130,l:'Car park'}]};

const NELSON0={compass:[950,60],items:[
 {id:'sea',t:'water',x:900,y:0,w:100,h:620,l:''},
 {id:'road',t:'road',x:0,y:525,w:900,h:60,l:'Main Road'},
 {id:'rail',t:'rail',x1:0,y1:250,x2:20,y2:250},
 {id:'stn',t:'bld',x:20,y:200,w:150,h:100,l:'Train\nstation',c:'r'},
 {id:'uni',t:'bld',x:380,y:50,w:230,h:150,l:'University',c:'p'},
 {id:'trees',t:'trees',x:640,y:50,w:200,h:190,l:'Trees'},
 {id:'mkt',t:'bld',x:50,y:380,w:230,h:110,l:'Market',c:'o'},
 {id:'port',t:'bld',x:770,y:250,w:130,h:160,l:'Port',c:'g'}]};
const NELSON1={compass:[950,60],items:[
 {id:'sea',t:'water',x:900,y:0,w:100,h:620,l:''},
 {id:'road',t:'ped',x:0,y:525,w:900,h:60,l:'Pedestrian-only zone'},
 {id:'rail',t:'rail',x1:0,y1:280,x2:380,y2:280},
 {id:'hall',t:'bld',x:30,y:40,w:250,h:130,l:'Hall of\nresidence',c:'t'},
 {id:'stn',t:'bld',x:380,y:230,w:170,h:100,l:'Train\nstation',c:'r'},
 {id:'uni',t:'bld',x:380,y:50,w:230,h:150,l:'University',c:'p'},
 {id:'trees',t:'bld',x:640,y:50,w:200,h:190,l:'Shopping\ncentre',c:'b'},
 {id:'bike',t:'spot',x:400,y:380,w:170,h:80,l:'Bike rental'},
 {id:'cov',t:'bld',x:610,y:280,w:150,h:110,l:'Covered\nmarket',c:'o'},
 {id:'mkt',t:'bld',x:50,y:380,w:230,h:110,l:'Shops',c:'o'},
 {id:'port',t:'bld',x:770,y:250,w:130,h:160,l:'Port',c:'g'},
 {id:'rest',t:'bld',x:610,y:420,w:150,h:80,l:'Restaurants',c:'y'},
 {id:'bar',t:'bld',x:770,y:420,w:130,h:80,l:'Bars &\nclubs',c:'y'}]};

const cc={entrance:[335,620,'up'],compass:[955,575],wall:[205,35,780,550]};
const CC0={...cc,items:[
 {id:'garden',t:'green',x:20,y:40,w:170,h:310,l:'Garden'},
 {id:'car',t:'car',x:20,y:370,w:170,h:210,l:'Car park'},
 {id:'hall',t:'room',x:210,y:40,w:250,h:340,l:'Hall\n(100 seats)'},
 {id:'rec',t:'room',x:210,y:380,w:250,h:200,l:'Reception'},
 {id:'sto',t:'room',x:460,y:40,w:270,h:160,l:'Storage'},
 {id:'kit',t:'room',x:730,y:40,w:250,h:160,l:'Kitchen'},
 {id:'off1',t:'room',x:460,y:200,w:150,h:110,l:'Office'},
 {id:'off2',t:'room',x:610,y:200,w:150,h:110,l:'Office'},
 {id:'off3',t:'room',x:460,y:310,w:150,h:110,l:'Office'},
 {id:'off4',t:'room',x:610,y:310,w:150,h:110,l:'Office'},
 {id:'sto2',t:'room',x:760,y:200,w:220,h:220,l:'Storage'},
 {id:'cof',t:'room',x:460,y:420,w:300,h:160,l:'Coffee bar'},
 {id:'wc',t:'room',x:760,y:420,w:220,h:160,l:'Toilets'}]};
const CC1={...cc,items:[
 {id:'garden',t:'room',x:20,y:40,w:170,h:310,l:'Indoor\nsports',c:'r'},
 {id:'car',t:'car',x:20,y:370,w:170,h:210,l:'Car park'},
 {id:'hall',t:'room',x:210,y:40,w:250,h:340,l:'Hall\n(100 seats)'},
 {id:'rec',t:'room',x:210,y:380,w:250,h:200,l:'Reception'},
 {id:'sto',t:'room',x:460,y:40,w:140,h:160,l:'Storage'},
 {id:'wcn',t:'room',x:600,y:40,w:130,h:160,l:'Toilets',c:'t'},
 {id:'kit',t:'room',x:730,y:40,w:250,h:160,l:'Kitchen'},
 {id:'cafe',t:'room',x:460,y:200,w:520,h:220,l:'Café area',c:'o'},
 {id:'off',t:'room',x:460,y:420,w:520,h:160,l:'Office',c:'p'}]};
return {CAMPUS0,CAMPUS1,NELSON0,NELSON1,CC0,CC1};
})();
