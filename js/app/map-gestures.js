'use strict';
/* ---------- pan / pinch / wheel on the full-screen map ---------- */
let drag=null;const pts=new Map();
document.addEventListener('pointerdown',e=>{const st=e.target.closest('#mapStage');if(!st||e.target.closest('.zoom,.mapinfo')||!FM)return;st.setPointerCapture(e.pointerId);pts.set(e.pointerId,[e.clientX,e.clientY]);drag={x:e.clientX,y:e.clientY,vb:[...FM.vb],d:pts.size===2?dist():0}});
function dist(){const a=[...pts.values()];return a.length<2?0:Math.hypot(a[0][0]-a[1][0],a[0][1]-a[1][1])}
document.addEventListener('pointermove',e=>{if(!drag||!FM||!pts.has(e.pointerId))return;pts.set(e.pointerId,[e.clientX,e.clientY]);const st=document.getElementById('mapStage').getBoundingClientRect();
 if(pts.size===2){const d=dist();if(drag.d){zoomAt(d/drag.d);drag.d=d}else drag.d=d;return}
 const k=Math.max(drag.vb[2]/st.width,drag.vb[3]/st.height);FM.vb=[drag.vb[0]-(e.clientX-drag.x)*k,drag.vb[1]-(e.clientY-drag.y)*k,drag.vb[2],drag.vb[3]];fitLabels()});
['pointerup','pointercancel'].forEach(t=>document.addEventListener(t,e=>{pts.delete(e.pointerId);if(!pts.size)drag=null;else if(drag)drag.d=0}));
document.addEventListener('wheel',e=>{if(!FM||!e.target.closest('#mapStage'))return;e.preventDefault();zoomAt(e.deltaY<0?1.15:1/1.15,e.clientX,e.clientY)},{passive:false});
window.addEventListener('resize',()=>FM&&fitLabels());
