/* Map data: the activity town and four maps for the drawing activity. */
window.MAPDATA=(function(){
const TOWN={id:'town',w:1000,h:620,
 roads:[{id:'H1',name:'High Street',c:[0,180,1000,180],lx:335},{id:'H2',name:'Park Road',c:[0,440,1000,440],lx:335},
        {id:'V1',name:'Mill Lane',c:[170,0,170,620],ly:310},{id:'V2',name:'Church Street',c:[500,0,500,620],ly:90},{id:'V3',name:'Station Road',c:[830,0,830,620],ly:300}],
 areas:[{type:'park',x:200,y:208,w:270,h:206,pond:true,path:'M210 300 C 280 270, 360 330, 460 290'}],
 buildings:[
  {name:'Hotel',icon:'hotel',x:20,y:30,w:122,h:120,road:'H1'},
  {name:'Bank',icon:'bank',x:200,y:40,w:122,h:110,road:'H1',letter:'A'},
  {name:'Post office',icon:'post',x:340,y:40,w:130,h:110,road:'H1'},
  {name:'Museum',icon:'museum',x:530,y:30,w:130,h:120,road:'H1'},
  {name:'Café',icon:'cafe',x:678,y:50,w:122,h:100,road:'H1',letter:'B'},
  {name:'Cinema',icon:'cinema',x:860,y:30,w:125,h:120,road:'H1'},
  {name:'Library',icon:'library',x:20,y:210,w:122,h:110,road:'H1',letter:'C'},
  {name:'School',icon:'school',x:20,y:338,w:122,h:74,road:'H2'},
  {name:'Park',icon:'',x:290,y:236,w:92,h:40,road:'H1',color:'#4E8F3E'},
  {name:'Supermarket',icon:'supermarket',x:530,y:210,w:150,h:112,road:'H1'},
  {name:'Bakery',icon:'bakery',x:530,y:340,w:130,h:72,road:'H2'},
  {name:'Chemist',icon:'chemist',x:690,y:332,w:110,h:80,road:'H2',letter:'D'},
  {name:'Hospital',icon:'hospital',x:860,y:210,w:125,h:202,road:'V3',color:'#D9534F'},
  {name:'Car park',icon:'carpark',x:20,y:470,w:122,h:120,road:'H2',color:'#7D8597'},
  {name:'Restaurant',icon:'restaurant',x:200,y:470,w:122,h:110,road:'H2'},
  {name:'Bookshop',icon:'bookshop',x:340,y:470,w:130,h:110,road:'H2',letter:'E'},
  {name:'Petrol station',icon:'petrol',x:530,y:470,w:150,h:110,road:'H2'},
  {name:'Gym',icon:'gym',x:698,y:470,w:102,h:110,road:'H2'},
  {name:'Station',icon:'station',x:860,y:470,w:125,h:120,road:'H2'}],
 trees:[[185,610],[490,600],[815,600],[185,20],[815,160]]};

const RIVER={id:'river',w:1000,h:620,
 roads:[{id:'H1',name:'River Road',c:[0,120,1000,120],lx:240},{id:'V1',name:'Bridge Street',c:[480,0,480,620],ly:420},{id:'H2',name:'Market Lane',c:[480,520,1000,520],lx:620}],
 areas:[{type:'water',d:'M0 260 C 200 230, 320 330, 520 300 S 820 240, 1000 290 L1000 380 C 820 330, 650 400, 500 390 S 200 320, 0 350 Z'},{type:'park',x:20,y:400,w:420,h:200,pond:false,path:'M30 500 C 150 450, 300 560, 430 480'}],
 buildings:[{name:'Town hall',icon:'theatre',x:40,y:20,w:160,h:76,road:'H1'},{name:'Church',icon:'church',x:250,y:20,w:180,h:76,road:'H1'},{name:'Bank',icon:'bank',x:540,y:20,w:150,h:76,road:'H1'},
  {name:'Hotel',icon:'hotel',x:720,y:20,w:250,h:76,road:'H1'},{name:'Boat hire',icon:'pool',x:300,y:150,w:140,h:76,road:'H1'},{name:'Museum',icon:'museum',x:540,y:150,w:180,h:72,road:'H1'},
  {name:'Market',icon:'market',x:540,y:410,w:170,h:84,road:'H2'},{name:'Police station',icon:'police',x:740,y:410,w:230,h:84,road:'H2'},{name:'Bus station',icon:'bus',x:560,y:548,w:200,h:62,road:'H2'},{name:'Café',icon:'cafe',x:790,y:548,w:180,h:62,road:'H2'}],
 trees:[[60,170],[120,190],[200,170],[880,170],[950,190]]};

const CAMPUS={id:'campus',w:1000,h:620,
 roads:[{id:'H1',name:'College Road',c:[0,90,1000,90],lx:110},{id:'V1',name:'West Walk',c:[260,90,260,620],ly:560},{id:'V2',name:'East Walk',c:[740,90,740,620],ly:560},{id:'H2',name:'Lake Path',c:[260,520,740,520],lx:500}],
 areas:[{type:'square',x:300,y:130,w:400,h:250},{type:'water',d:'M300 560 C 380 540, 620 540, 700 565 L700 620 L300 620 Z'}],
 buildings:[{name:'Main gate',icon:'',x:440,y:10,w:120,h:50,road:'H1',color:'#7D8597'},{name:'Library',icon:'library',x:30,y:130,w:200,h:120,road:'V1'},{name:'Science block',icon:'university',x:30,y:280,w:200,h:120,road:'V1'},
  {name:'Sports hall',icon:'gym',x:30,y:430,w:200,h:160,road:'V1'},{name:'Lecture theatre',icon:'theatre',x:770,y:130,w:200,h:120,road:'V2'},{name:'Canteen',icon:'canteen',x:770,y:280,w:200,h:120,road:'V2'},
  {name:'Student union',icon:'cafe',x:770,y:430,w:200,h:160,road:'V2'},{name:'Bookshop',icon:'bookshop',x:310,y:410,w:170,h:80,road:'H2'},{name:'Medical centre',icon:'clinic',x:520,y:410,w:170,h:80,road:'H2'}],
 trees:[[320,150],[680,150],[320,360],[680,360],[40,610],[960,610]]};

const MALL={id:'mall',w:1000,h:620,road:56,
 roads:[{id:'H1',name:'Main corridor',c:[0,310,1000,310],lx:500},{id:'V1',name:'',c:[330,60,330,560]},{id:'V2',name:'',c:[670,60,670,560]}],
 areas:[{type:'square',x:440,y:200,w:120,h:80}],
 buildings:[{name:'Entrance',icon:'',x:10,y:270,w:60,h:80,road:'H1',color:'#18794E'},{name:'Lift',icon:'',x:440,y:340,w:120,h:70,road:'H1',color:'#7D8597'},
  {name:'Toilets',icon:'',x:360,y:40,w:120,h:90,road:'V1'},{name:'Food court',icon:'restaurant',x:20,y:20,w:280,h:250,road:'V1'},{name:'Cinema',icon:'cinema',x:700,y:20,w:280,h:250,road:'V2'},
  {name:'Supermarket',icon:'supermarket',x:20,y:350,w:280,h:250,road:'V1'},{name:'Bookshop',icon:'bookshop',x:360,y:450,w:140,h:150,road:'V1'},{name:'Pharmacy',icon:'chemist',x:520,y:450,w:120,h:150,road:'V2'},
  {name:'Phone shop',icon:'',x:700,y:350,w:280,h:110,road:'V2'},{name:'Sports shop',icon:'gym',x:700,y:480,w:280,h:120,road:'V2'},{name:'Café',icon:'cafe',x:520,y:40,w:120,h:90,road:'V2'}],
 trees:[[500,240]]};
const S1={id:'s1',w:1000,h:620,road:64,roads:[{id:'H1',name:'Main Street',c:[0,310,1000,310],lx:500}],
 areas:[{type:'park',x:60,y:370,w:360,h:210,pond:false}],
 buildings:[{name:'Bank',x:70,y:80,w:220,h:180,road:'H1'},{name:'Café',x:390,y:80,w:220,h:180,road:'H1'},{name:'Library',x:710,y:80,w:220,h:180,road:'H1'},
  {name:'Park',x:170,y:440,w:140,h:70,road:'H1',color:'#4E8F3E'},{name:'Post office',x:480,y:370,w:200,h:180,road:'H1'},{name:'Car park',x:740,y:370,w:200,h:180,road:'H1',color:'#7D8597'}]};
const S2={id:'s2',w:1000,h:620,road:64,roads:[{id:'H1',name:'Green Road',c:[0,310,1000,310],lx:200},{id:'V1',name:'Hill Street',c:[500,0,500,620],ly:150}],
 buildings:[{name:'School',x:60,y:60,w:360,h:200,road:'H1'},{name:'Hospital',x:580,y:60,w:360,h:200,road:'H1'},{name:'Supermarket',x:60,y:360,w:360,h:200,road:'H1'},{name:'Cinema',x:580,y:360,w:360,h:200,road:'H1'}]};
const S3={id:'s3',w:1000,h:620,road:64,roads:[{id:'H1',name:'River Road',c:[0,200,1000,200],lx:250},{id:'V1',name:'Bridge',c:[500,200,500,620],ly:560}],
 areas:[{type:'water',d:'M0 360 C 300 330, 700 390, 1000 350 L1000 450 C 700 480, 300 430, 0 460 Z'}],
 buildings:[{name:'Hotel',x:60,y:30,w:250,h:130,road:'H1'},{name:'Museum',x:375,y:30,w:250,h:130,road:'H1'},{name:'Restaurant',x:690,y:30,w:250,h:130,road:'H1'},
  {name:'Boat hire',x:80,y:240,w:240,h:90,road:'H1'},{name:'Car park',x:80,y:490,w:340,h:110,road:'V1',color:'#7D8597'},{name:'Market',x:580,y:490,w:340,h:110,road:'V1'}]};
const S4={id:'s4',w:1000,h:620,road:70,roads:[{id:'H1',name:'Corridor',c:[0,310,1000,310],lx:500}],
 buildings:[{name:'Reception',x:40,y:40,w:280,h:220,road:'H1'},{name:'Meeting room',x:360,y:40,w:280,h:220,road:'H1'},{name:'Toilets',x:680,y:40,w:280,h:220,road:'H1'},
  {name:'Lift',x:40,y:360,w:160,h:110,road:'H1',color:'#7D8597'},{name:'Stairs',x:40,y:490,w:160,h:110,road:'H1',color:'#9AA5B8'},{name:'Office',x:240,y:360,w:400,h:240,road:'H1'},{name:'Kitchen',x:680,y:360,w:280,h:240,road:'H1'}]};
return {TOWN,RIVER,CAMPUS,MALL,S1,S2,S3,S4};
})();
