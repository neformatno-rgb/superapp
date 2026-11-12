'use strict';
/* ---------- render ---------- */
const NAV=[['home','home','Главная'],['search','box','Грузы'],['map','map','Карта'],['menu','menu','Меню']];
const NAVOF={home:'home',search:'search',results:'search',order:'search',apply:'search',success:'search',shipments:'search',trip:'search',map:'map',menu:'menu'};
/* «Отслеживать грузы»: shown only when ≥2 filter params are set and this search isn't already tracked; hidden right after creating, reappears when a param changes */
function renderFab(){const slot=document.getElementById('fabSlot');if(!slot)return;const v=current();const showFab=v==='results'||(v==='search'&&S.searchTab==='all');
 if(!showFab){slot.innerHTML='';return}
 const ed=S.editWatch!=null&&S.watch[S.editWatch],ok=paramCount(S.filters)>=2,show=ed?ok:(ok&&!isWatched());
 slot.innerHTML=show?`<button class="fab" data-watch aria-label="${ed?'Сохранить отслеживание':'Отслеживать грузы'}">${ic('bellPlus')}<span>${ed?'Сохранить отслеживание':'Отслеживать грузы'}</span></button>`:'';}
function render(){
 const v=current();if(S.param===undefined)S.param=null;
 document.getElementById('view').innerHTML=V[v]();
 const navHtml=NAV.map(([k,i,l])=>`<a href="#${k}" ${k==='search'?'data-longmenu aria-haspopup="menu" title="Долгое нажатие — выбор раздела"':''} ${NAVOF[v]===k?'aria-current="page"':''}>${ic(i)}<span>${l}</span></a>`).join('');
 document.getElementById('nav').innerHTML=navHtml;
 const showFab=v==='results'||(v==='search'&&S.searchTab==='all');
 document.body.classList.toggle('has-fab',showFab);document.body.classList.toggle('on-map',v==='map');
 renderFab();
 document.title='Кабинет перевозчика';
 setupCta();
 if(v==='map')mvInit();
 /* tabs that don't fit scroll sideways: keep the selected one in view */
 document.querySelectorAll('#view .seg').forEach(g=>{if(g.scrollWidth<=g.clientWidth)return;const b=g.querySelector('[aria-selected="true"]');if(b)g.scrollLeft=Math.max(0,b.offsetLeft-g.clientWidth/2+b.offsetWidth/2)});
}
