/* ===== overlay stars + start ===== */
(function(){const g=$('#sSpace .ovstars');if(!g)return;let r=99;const R=()=>(r=(r*9301+49297)%233280)/233280;let h='';
  for(let i=0;i<140;i++)h+=`<circle cx="${R()*1280}" cy="${R()*470}" r="${R()*1.8+.5}" fill="#fff" style="animation-delay:${-R()*3}s"/>`;g.innerHTML=h})();
show(Math.max(0,(parseInt((location.hash||'').replace('#s',''),10)||1)-1));
