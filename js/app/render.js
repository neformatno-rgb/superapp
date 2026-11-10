'use strict';
/* ---------- render ---------- */
const NAV=[['home','home','Главная'],['search','box','Грузы'],['map','map','Карта'],['menu','menu','Меню']];
const NAVOF={home:'home',search:'search',results:'search',order:'search',apply:'search',success:'search',shipments:'search',trip:'search',map:'map',menu:'menu'};
function render(){
 const v=current();if(S.param===undefined)S.param=null;
 document.getElementById('view').innerHTML=V[v]();
 const navHtml=NAV.map(([k,i,l])=>`<a href="#${k}" ${k==='search'?'data-longmenu aria-haspopup="menu" title="Долгое нажатие — выбор раздела"':''} ${NAVOF[v]===k?'aria-current="page"':''}>${ic(i)}<span>${l}</span></a>`).join('');
 document.getElementById('nav').innerHTML=navHtml;
 const showFab=v==='results'||(v==='search'&&S.searchTab==='all');
 document.body.classList.toggle('has-fab',showFab);
 const w=showFab&&isWatched();
 document.getElementById('fabSlot').innerHTML=showFab?`<button class="fab" data-watch aria-pressed="${w}" aria-label="${w?'Перестать отслеживать поиск':'Отслеживать этот поиск'}">${ic('bellPlus')}<span>${w?'Отслеживается':'Отслеживать'}</span></button>`:'';
 document.title='Кабинет перевозчика';
 setupCta();
}
