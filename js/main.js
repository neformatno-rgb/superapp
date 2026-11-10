'use strict';
/* ---------- boot ---------- */
if(S.shipments.some(s=>s.stage==='docs'))S.shipments.forEach(s=>{if(s.stage==='docs')s.stage='loaded'});
// tick auction timers
const fmt=t=>` (${String(Math.floor(t/3600)).padStart(2,'0')}:${String(Math.floor(t%3600/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')})`;
setInterval(()=>{CARGO.forEach(c=>{if(c.timer>0){c.timer--;document.querySelectorAll(`[data-timer="${c.id}"]`).forEach(el=>el.textContent='Аукцион'+fmt(c.timer))}})},1000);
render();
