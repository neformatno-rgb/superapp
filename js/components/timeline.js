'use strict';
/* ---------- expandable timeline ---------- */
const TL={};
function tlList(key,items,def=0){if(!(key in TL))TL[key]=def;
 return `<div class="tl">${items.map((it,i)=>{const open=TL[key]===i&&!!it.body;return `<div class="tl-stop">
  <button class="tl-head" data-tl="${key}|${i}" aria-expanded="${open}"><span class="tl-ring ${it.ring||''}"></span><span class="tl-pill"><span class="grow">${esc(it.city)}</span>${it.body?ic(open?'chevU':'chevD','s'):''}</span></button>
  ${open?`<div class="tl-body"><span class="tl-dot ${it.ring||''}"></span>${it.body}</div>`:''}</div>`}).join('')}</div>`}
