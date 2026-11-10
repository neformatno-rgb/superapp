'use strict';
/* ---------- routing ---------- */
const ROUTES=['home','search','results','order','apply','shipments','trip','map','menu'];
let param=null;
function go(view,p){param=p||null;if(p)S.param=p;save();location.hash=view;if(location.hash==='#'+view)render();window.scrollTo(0,0)}
function current(){const h=location.hash.slice(1);return ROUTES.includes(h)?h:'home'}
window.addEventListener('hashchange',()=>{render();window.scrollTo(0,0)});
/* views register themselves here: V.<route>=()=>html */
const V={};
