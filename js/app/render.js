'use strict';
/* ---------- render ---------- */
const NAV=[['home','home','Главная'],['search','box','Грузы'],['map','map','Карта'],['menu','menu','Меню']];
const NAVOF={home:'home',search:'search',results:'search',order:'search',apply:'search',success:'search',shipments:'search',trip:'search',map:'map',menu:'menu'};
function render(){
 const v=current();if(S.param===undefined)S.param=null;
 document.getElementById('view').innerHTML=V[v]();
 const navHtml=NAV.map(([k,i,l])=>`<a href="#${k}" ${k==='search'?'data-longmenu aria-haspopup="menu" title="Долгое нажатие — выбор раздела"':''} ${NAVOF[v]===k?'aria-current="page"':''}>${ic(i)}<span>${l}</span></a>`).join('');
 document.getElementById('nav').innerHTML=navHtml;
 document.querySelector('.rail').innerHTML=`<div class="brand"><svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true" style="flex:none"><path d="M16.0029 0C19.2579 0 22.4288 .29821 25.478 .812841C28.4042 1.30671 30.6905 3.5928 31.1851 6.51885C31.7008 9.57018 32 12.7434 32 16.001C32 19.2571 31.7011 22.4289 31.1858 25.479C30.6915 28.4051 28.4051 30.6914 25.4789 31.1858C22.4295 31.701 19.2584 32 16.0029 32C12.7449 32 9.57123 31.7008 6.51952 31.1851C3.59363 30.6905 1.30766 28.4044 .813572 25.4784C.298558 22.4285 0 19.2569 0 16.001C0 12.744 .298468 9.57129 .813593 6.52043C1.30761 3.59456 3.59355 1.3085 6.51939 .814265C9.57115 .298759 12.7449 0 16.0029 0Z" fill="#0098FE"/><path d="M6 20.3115L12 24V12H6V20.3115Z" fill="#fff"/><path d="M26 20.5626L20 24V8H26V20.5626Z" fill="#fff"/><path d="M19.8594 13.1533V13.226L19.8957 13.1897L19.8594 13.1533Z" fill="#fff"/><path d="M15.0723 8L20.001 13.1045V13.1807L16.501 16.8057L15 15.251V8H15.0723ZM14.999 15.251L12.9766 13.1562L8 8H14.999V15.251Z" fill="#fff"/></svg>Перевозчик</div>`+NAV.map(([k,i,l])=>`<a href="#${k}" ${NAVOF[v]===k&&!(k==='search'&&(v==='shipments'||v==='trip'))?'aria-current="page"':''}>${ic(i)}<span>${l}</span></a>`).join('')+`<a href="#shipments" ${v==='shipments'||v==='trip'?'aria-current="page"':''}>${ic('route')}<span>Мои перевозки</span></a>`;
 const showFab=v==='results'||(v==='search'&&S.searchTab==='all');
 document.body.classList.toggle('has-fab',showFab);
 const w=showFab&&isWatched();
 document.getElementById('fabSlot').innerHTML=showFab?`<button class="fab" data-watch aria-pressed="${w}" aria-label="${w?'Перестать отслеживать поиск':'Отслеживать этот поиск'}">${ic('bellPlus')}<span>${w?'Отслеживается':'Отслеживать'}</span></button>`:'';
 document.title='Кабинет перевозчика';
 setupCta();
}
