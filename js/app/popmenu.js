'use strict';
/* long-press menu on «Грузы» */
let lpTimer=null,lpFired=false;
function closePop(){const m=document.querySelector('.popmenu');m&&m.remove();document.querySelectorAll('[data-titlemenu]').forEach(b=>b.setAttribute('aria-expanded','false'))}
function openPop(a,below){closePop();const r=a.getBoundingClientRect(),v=current();const m=document.createElement('div');m.className='popmenu';m.setAttribute('role','menu');
 m.innerHTML=[['search','box','Поиск грузов'],['shipments','route','Мои перевозки']].map(([k,i,l])=>`<a role="menuitem" href="#${k}" ${(k==='search'?['search','results','order','apply']:['shipments','trip']).includes(v)?'aria-current="page"':''}>${ic(i)}<span>${l}</span></a>`).join('');
 document.body.appendChild(m);const w=m.offsetWidth,h=m.offsetHeight;if(below){m.style.left=Math.max(12,Math.min(window.innerWidth-w-12,r.left))+'px';m.style.top=(r.bottom+8)+'px';a.setAttribute('aria-expanded','true')}else{m.style.left=Math.max(12,Math.min(window.innerWidth-w-12,r.left+r.width/2-w/2))+'px';m.style.top=Math.max(12,r.top-h-8)+'px';m.querySelector('a').focus({preventScroll:true})}}
document.addEventListener('pointerdown',e=>{const a=e.target.closest('[data-longmenu]');if(!e.target.closest('.popmenu')&&!e.target.closest('[data-titlemenu]'))closePop();if(!a)return;lpFired=false;clearTimeout(lpTimer);lpTimer=setTimeout(()=>{lpFired=true;openPop(a)},450)});
['pointerup','pointercancel','pointerleave'].forEach(t=>document.addEventListener(t,()=>clearTimeout(lpTimer)));
document.addEventListener('contextmenu',e=>{const a=e.target.closest('[data-longmenu]');if(a){e.preventDefault();if(!lpFired){lpFired=true;openPop(a)}}});
document.addEventListener('click',e=>{if(e.target.closest('[data-longmenu]')&&lpFired){e.preventDefault();e.stopPropagation();lpFired=false;return}if(e.target.closest('.popmenu a'))setTimeout(closePop,0)},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closePop()});
window.addEventListener('hashchange',()=>{closePop();closeCity()});
