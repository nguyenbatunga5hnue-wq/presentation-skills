/* ---------- edit mode: teacher edits any text in place; edits are shared through the artifact db
   (or kept in this browser when the page runs offline) ---------- */
(function(){
const STAGE=document.getElementById('stage'),BAR=document.getElementById('bar');
const EXCL='#sScore,.timer,.sctl,.stt,.secs,#vFC,#vGRA,.gnum,.cnt,.ckn,.rn,.qn,.tn,.qk,svg,.edots,.ph7,.titlewave,.bandrow,.cksum';
const INL=new Set(['B','I','EM','U','STRONG','BR','MARK','SPAN','SMALL','SUB','SUP','CODE']);
const OV={},ORIG={};const LSK='sp3-edits';
let db=null,mode='local',editing=false,cur=null;

const hash=s=>{let h=5381;for(let i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))|0;return 'k'+(h>>>0).toString(36)+s.length.toString(36)};
const norm=el=>el.innerHTML.trim();
function inlineOnly(el){for(const c of el.children){if(!INL.has(c.tagName)||!inlineOnly(c))return false}return true}
function isLeaf(el){if(el.closest(EXCL))return false;let t=false;for(const n of el.childNodes)if(n.nodeType===3&&n.nodeValue.trim())t=true;return t&&inlineOnly(el)}
function put(el,html){el.innerHTML=html;el._ap=norm(el)}
function register(el){if(el.dataset.ok)return;const h=norm(el),k=hash(h);ORIG[k]=h;el.dataset.ok=k;if(OV[k]!=null)put(el,OV[k])}
function scan(n){if(n.nodeType!==1||n.dataset.ok)return;if(n.parentElement&&n.parentElement.closest('[data-ok]'))return;if(isLeaf(n)){register(n);return}for(const c of [...n.children])scan(c)}
function clean(html){const t=document.createElement('template');t.innerHTML=html;
  (function w(n){[...n.childNodes].forEach(c=>{if(c.nodeType===1){w(c);if(!INL.has(c.tagName)){c.replaceWith(...c.childNodes);return}
    const cls=c.getAttribute('class');[...c.attributes].forEach(a=>c.removeAttribute(a.name));if(cls&&/^[\w\- ]{1,60}$/.test(cls))c.setAttribute('class',cls)}
    else if(c.nodeType!==3)c.remove()})})(t.content);
  return t.innerHTML.replace(/&nbsp;/g,' ').replace(/(<br>\s*)+$/,'').trim()}
function applyKey(k){document.querySelectorAll('[data-ok="'+k+'"]').forEach(el=>{if(el===cur)return;put(el,OV[k]!=null?OV[k]:ORIG[k]||'')})}

/* follow every render the deck does, so edits survive tab switches and re-renders */
new MutationObserver(ms=>{const ts=new Set();for(const m of ms){const t=m.target.nodeType===3?m.target.parentElement:m.target;if(t)ts.add(t)}
  for(const t of ts){if(!t.isConnected||t.isContentEditable)continue;const leaf=t.closest('[data-ok]');
    if(leaf){if(leaf===cur)continue;const h=norm(leaf);if(h===leaf._ap||hash(h)===leaf.dataset.ok)continue;
      delete leaf.dataset.ok;leaf._ap=undefined;scan(leaf)}else scan(t)}})
 .observe(STAGE,{childList:true,subtree:true,characterData:true});
scan(STAGE);

/* ---------- storage ---------- */
function loadLocal(){try{Object.assign(OV,JSON.parse(localStorage.getItem(LSK)||'{}'))}catch(e){}Object.keys(OV).forEach(applyKey)}
function saveLocal(){try{localStorage.setItem(LSK,JSON.stringify(OV));return true}catch(e){return false}}
loadLocal();
async function persist(k){if(mode==='db'){try{OV[k]!=null?await db.doc('edits/'+k).set({h:OV[k]}):await db.doc('edits/'+k).delete();toast('Đã lưu cho mọi người')}
    catch(e){toast(e&&e.code==='quota_exceeded'?'Hết dung lượng lưu':'Không lưu được: bạn chỉ có quyền xem',true)}}
  else{const ok=saveLocal();toast(ok?'Đã lưu trên máy này':'Không lưu được',!ok)}}
(async()=>{if(!window.claude||!window.claude.use)return;const d=await window.claude.use('db');if(!d)return;
  db=d;mode='db';
  const u=await window.claude.use('user');if(u){const ok=await u.can('data.write');if(ok===false)btn.hidden=true}
  for(const k of Object.keys(OV)){delete OV[k];applyKey(k)}
  db.collection('edits').onSnapshot(qs=>{qs.docChanges().forEach(ch=>{const k=ch.doc.id;
      if(ch.type==='removed')delete OV[k];else{const v=ch.doc.data();OV[k]=clean(String(v&&v.h!=null?v.h:''))}applyKey(k)})},()=>{})})();

/* ---------- UI ---------- */
const btn=document.createElement('button');btn.id='editBtn';btn.textContent='✎ Sửa chữ';BAR.insertBefore(btn,document.getElementById('help'));
const panel=document.createElement('div');panel.id='editPanel';panel.hidden=true;
panel.innerHTML='<b>✎ Đang sửa chữ</b><button data-e="orig">↺ Chữ gốc</button><button data-e="all">Khôi phục tất cả</button><button data-e="done" class="pri">Xong</button><span id="editMsg"></span>';
document.body.appendChild(panel);
const pop=document.createElement('div');pop.id='editPop';pop.hidden=true;
pop.innerHTML='<div class="ep-box" contenteditable="true"></div><div class="ep-row"><button data-p="orig">↺ Chữ gốc</button><button data-p="cancel">Huỷ</button><button data-p="save" class="pri">Lưu</button></div>';
document.body.appendChild(pop);
let tmr;function toast(t,bad){const m=document.getElementById('editMsg');m.textContent=t;m.className=bad?'bad':'';clearTimeout(tmr);tmr=setTimeout(()=>m.textContent='',2500)}

function setMode(on){editing=on;document.body.classList.toggle('editmode',on);btn.classList.toggle('on',on);panel.hidden=!on;if(!on){finish();closePop()}}
btn.onclick=()=>setMode(!editing);

function commit(el,html){const k=el.dataset.ok;html=clean(html);
  if(html===ORIG[k])delete OV[k];else OV[k]=html;put(el,OV[k]!=null?OV[k]:ORIG[k]);applyKey(k);persist(k)}
function start(el){finish();cur=el;el._before=norm(el);el.contentEditable='true';el.focus();
  const r=document.createRange();r.selectNodeContents(el);r.collapse(false);const s=getSelection();s.removeAllRanges();s.addRange(r)}
function finish(){const el=cur;if(!el)return;cur=null;el.removeAttribute('contenteditable');if(norm(el)!==el._before)commit(el,el.innerHTML)}

let popEl=null;
function openPop(el){finish();popEl=el;const box=pop.querySelector('.ep-box');box.innerHTML=norm(el);pop.hidden=false;box.focus()}
function closePop(){pop.hidden=true;popEl=null}
pop.addEventListener('click',e=>{const b=e.target.closest('[data-p]');if(!b||!popEl)return;const box=pop.querySelector('.ep-box');
  if(b.dataset.p==='save')commit(popEl,box.innerHTML);else if(b.dataset.p==='orig'){box.innerHTML=ORIG[popEl.dataset.ok];return}closePop()});

STAGE.addEventListener('click',e=>{if(!editing)return;const leaf=e.target.closest('[data-ok]');if(!leaf||!STAGE.contains(leaf))return;
  if(leaf.closest('button'))return;            // buttons keep working; double-click edits their text
  e.stopPropagation();if(leaf!==cur)start(leaf)},true);
STAGE.addEventListener('dblclick',e=>{if(!editing)return;const leaf=e.target.closest('[data-ok]');if(!leaf||!leaf.closest('button'))return;e.preventDefault();e.stopPropagation();openPop(leaf)},true);
document.addEventListener('focusout',e=>{if(cur&&e.target===cur)finish()});
document.addEventListener('keydown',e=>{const ed=e.target.closest&&e.target.closest('[contenteditable="true"]');if(!ed)return;
  if(e.key==='Enter'){e.preventDefault();document.execCommand('insertLineBreak')}
  else if(e.key==='Escape'){e.preventDefault();ed===cur?cur.blur():closePop()}
  e.stopPropagation()},true);
document.addEventListener('paste',e=>{const ed=e.target.closest&&e.target.closest('[contenteditable="true"]');if(!ed)return;e.preventDefault();
  document.execCommand('insertText',false,(e.clipboardData||window.clipboardData).getData('text/plain'))},true);
panel.addEventListener('click',e=>{const b=e.target.closest('[data-e]');if(!b)return;
  if(b.dataset.e==='done')setMode(false);
  else if(b.dataset.e==='orig'){const el=cur;if(!el){toast('Bấm vào một dòng chữ trước',true);return}cur=null;el.removeAttribute('contenteditable');commit(el,ORIG[el.dataset.ok])}
  else if(b.dataset.e==='all'){if(!confirm('Khôi phục toàn bộ chữ gốc của bộ slide?'))return;finish();Object.keys(OV).forEach(k=>{delete OV[k];applyKey(k);persist(k)})}});
})();
