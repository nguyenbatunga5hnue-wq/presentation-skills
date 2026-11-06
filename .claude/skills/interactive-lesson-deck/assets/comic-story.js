/* Comic kit, part 2: renders section.slide.comic[data-story="key"] from window-level
   STORIES[key]={t,q:[3 questions],pages:[[4 panels],...]} and WORDS[key]={w,vn,u}.
   Panel: {bg,extra?,cap?,ch:[C(cast,x,{s,y,mood,pose,look,flip,hold,fx,enter})],pr?:[{k,x,y,s}],b:[B(text,x%,y%,w%,whoIndex,{think,shout})]}
   Mark taught words in text as [[shown text|wordKey]]. Needs core: $, $$, esc, STEP, ENTER, setStep, stepOf, SFX.
   Steps: one per panel (4 per page, page flips automatically) + 1 "Your turn" overlay. */
/* ---------- renderer ---------- */
function kwHtml(t){return esc(t).replace(/\[\[(.+?)\|(\w+)\]\]/g,'<span class="kw" role="button" tabindex="0" data-k="$2">$1</span>')}
const keysOf=t=>[...String(t).matchAll(/\[\[.+?\|(\w+)\]\]/g)].map(m=>m[1]);
function panelSvg(p){const talk=new Set((p.b||[]).map(b=>b.who).filter(w=>w!=null));const front=['telescope','sapling','star_lantern'];
  return`<svg viewBox="0 0 400 290" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${bg(p.bg)}${p.extra||''}${(p.pr||[]).filter(x=>!front.includes(x.k)).map(x=>prop(x.k,x.x,x.y,x.s||1)).join('')}${(p.ch||[]).map((c,i)=>char(Object.assign({talk:talk.has(i)},c))).join('')}${(p.pr||[]).filter(x=>front.includes(x.k)).map(x=>prop(x.k,x.x,x.y,x.s||1)).join('')}</svg>`}
function bubHtml(p,b,i){let tl=b.tl;if(tl==null&&b.who!=null&&p.ch[b.who]){const cx=p.ch[b.who].x/4;tl=Math.max(10,Math.min(90,(cx-b.x)/b.w*100))}if(tl==null)tl=50;
  return`<div class="bub${b.think?' think':''}${b.shout?' shout':''}" style="left:${b.x}%;top:${b.y}%;width:${b.w}%;--tl:${tl}%;--bi:${i}">${kwHtml(b.t)}</div>`}
function renderStory(sec){const D=STORIES[sec.dataset.story];if(!D)return;const P=D.pages,N=P.length*4;let gi=0;
  const all=[...new Set(P.flat().flatMap(p=>[p.cap||'',...(p.b||[]).map(b=>b.t)]).flatMap(keysOf))];
  sec.innerHTML=`<div class="hdr"><h2>${esc(D.t)}</h2><div class="tools"><span class="pgdots">${P.map((_,i)=>`<button data-pg="${i}" aria-label="Trang ${i+1}">${i+1}</button>`).join('')}</span><button class="b sm" data-act="cm-page">Hiện cả trang</button><button class="b pri" data-act="step">Tiếp ▸</button></div></div>
   <div class="cwrap"><div class="cbook">${P.map((pg,pi)=>`<div class="cpage" data-p="${pi}"><div class="cgrid">${pg.map(p=>{gi++;return`<div class="pan" data-g="${gi}">${panelSvg(p)}<span class="pno">${gi}</span>
     ${p.cap?`<div class="cap">${kwHtml(p.cap)}</div>`:''}${(p.b||[]).map((b,i)=>bubHtml(p,b,i)).join('')}</div>`}).join('')}</div></div>`).join('')}
     <div class="ytov"><div class="ytbox"><span>Your turn</span><ol>${D.q.map(q=>`<li>${esc(q)}</li>`).join('')}</ol><div class="ytwords">${all.map(k=>`<i>${esc(WORDS[k].w)}</i>`).join('')}</div></div></div></div>
   <aside class="cside"><div class="clbl">Từ mới · trang <b class="pgn">1</b></div><div class="wlist"></div></aside></div>`;
  sec.dataset.steps=N+1;sec._pages=P;sec._page=-1}
function paintWords(sec,pi){const P=sec._pages,keys=[...new Set(P[pi].flatMap(p=>[p.cap||'',...(p.b||[]).map(b=>b.t)]).flatMap(keysOf))];
  $('.pgn',sec).textContent=pi+1;
  $('.wlist',sec).innerHTML=keys.map(k=>{const w=WORDS[k];return`<div class="wd" data-k="${k}" tabindex="0" role="button" aria-expanded="false"><div class="wh"><b>${esc(w.w)}</b><button class="spk" data-say="${esc(w.w.replace(/\(.*?\)/g,''))}" aria-label="Nghe phát âm">🔊</button></div><div class="wm"><div><span>${esc(w.vn)}</span><i>${esc(w.u)}</i></div></div></div>`}).join('')}
$$('.slide[data-story]').forEach(s=>{renderStory(s);const id=s.id,N=s._pages.length*4;
  STEP[id]=(s,n)=>{const pi=Math.max(0,Math.min(s._pages.length-1,Math.floor((Math.max(1,Math.min(n,N))-1)/4)));
    if(pi!==s._page){const prev=s._page;s._page=pi;$$('.cpage',s).forEach(c=>{const p=+c.dataset.p;c.classList.toggle('on',p===pi);c.classList.toggle('fwd',p===pi&&pi>prev)});paintWords(s,pi);if(prev>=0)SFX.whoosh(pi>prev)}
    $$('.pgdots button',s).forEach(b=>{b.classList.toggle('on',+b.dataset.pg===pi);b.classList.toggle('done',+b.dataset.pg<pi)});
    $$('.pan',s).forEach(p=>p.classList.toggle('in',+p.dataset.g<=n));
    $('.ytov',s).classList.toggle('in',n>N);
    if(n>N)SFX.chime();else if(n>=1)SFX.pop((n-1)%4+1)};
  ENTER[id]=s=>{s._page=-1;STEP[id](s,stepOf(s))}});
document.addEventListener('click',e=>{const k=e.target.closest('.kw');if(k){const s=k.closest('.slide');const w=$(`.wd[data-k="${k.dataset.k}"]`,s);if(w){w.classList.add('open');w.setAttribute('aria-expanded',true);w.classList.remove('pulse');void w.offsetWidth;w.classList.add('pulse');w.scrollIntoView({block:'nearest',behavior:'smooth'})}SFX.pop(4);return}
  const w=e.target.closest('.wd');if(w&&!e.target.closest('.spk')){w.classList.toggle('open');w.setAttribute('aria-expanded',w.classList.contains('open'));SFX.tick();return}
  const pg=e.target.closest('.pgdots [data-pg]');if(pg){const s=pg.closest('.slide');setStep(s,(+pg.dataset.pg+1)*4);return}
  const a=e.target.closest('[data-act="cm-page"]');if(a){const s=a.closest('.slide');setStep(s,Math.min(s._pages.length*4,(s._page+1)*4))}});
document.addEventListener('keydown',e=>{const w=e.target.closest&&e.target.closest('.wd,.kw');if(w&&(e.key==='Enter'||e.key===' ')){e.preventDefault();w.click()}});
