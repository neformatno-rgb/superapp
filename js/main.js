'use strict';
/* ---------- boot ---------- */
if(S.shipments.some(s=>s.stage==='docs'))S.shipments.forEach(s=>{if(s.stage==='docs')s.stage='loaded'});
// tick auction timers
const fmt=t=>` (${String(Math.floor(t/3600)).padStart(2,'0')}:${String(Math.floor(t%3600/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')})`;
setInterval(()=>{let aux=false;CARGO.forEach(c=>{if(c.timer>0){c.timer--;if(c.timer===0&&isAuc(c)){const u=S.auc&&S.auc[c.id];if(AUC(c).n0===0&&!(u&&u.my!=null)&&!(u&&u.rival!=null)){c.timer=60+Math.floor(Math.random()*240);aux=true}}document.querySelectorAll(`[data-timer="${c.id}"]`).forEach(el=>el.textContent='Аукцион'+fmt(c.timer))}});if(aux)coRerender()},1000);
render();
