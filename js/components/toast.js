'use strict';
/* ---------- toast ---------- */
let tt;function toast(m){clearTimeout(tt);let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';t.setAttribute('role','status');document.body.appendChild(t)}t.textContent=m;tt=setTimeout(()=>t.remove(),2600)}
