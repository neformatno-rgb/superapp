'use strict';
/* ---------- copy coordinates on tap ---------- */
/* tap on coordinates: copy, show a check for a moment and a snackbar */
document.addEventListener('click',e=>{const a=e.target.closest('[data-copy]');if(!a)return;e.preventDefault();e.stopPropagation();const v=a.dataset.copy;
 const done=()=>{if(!a.querySelector('svg'))a.insertAdjacentHTML('beforeend',ic('check','s'));clearTimeout(a._t);a._t=setTimeout(()=>{const i=a.querySelector('svg');i&&i.remove()},2000);toast('Координаты скопированы')};
 try{navigator.clipboard.writeText(v).then(done,done)}catch(_){done()}},true);
