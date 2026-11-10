'use strict';
V.search=()=>{
 let body;
 if(S.searchTab==='all') body=filterForm()+`<div class="row between"><b style="font-size:16px">Всего ${plural(FEED().length,'груз','груза','грузов')}</b>${vatBtn()}</div>`+FEED().slice(0,ALLN).map(c=>cargoCard(c)).join('')+(ALLN<FEED().length?`<button class="btn secondary" data-more>Показать ещё</button>`:'');
 else if(S.searchTab==='bids') body=`<div class="card empty"><b>Ставок пока нет</b><span class="muted">Откройте груз с аукционом и сделайте ставку.</span></div>`;
 else if(S.searchTab==='fav'){const l=CARGO.filter(c=>S.fav.includes(c.id));body=l.length?`<div class="row between"><b style="font-size:16px">В избранном: ${l.length}</b>${vatBtn()}</div>`+l.map(c=>cargoCard(c)).join(''):`<div class="card empty"><b>В избранном пусто</b><span class="muted">Нажмите значок закладки на карточке груза, чтобы сохранить его здесь.</span><button class="btn secondary" data-seg="searchTab" data-val="all">Ко всем грузам</button></div>`;}
 else {body=S.watch.length?watchCards():`<div class="card empty"><span class="muted">Задайте фильтры и нажмите «Отслеживать» — сохранённые поиски появятся здесь.</span></div>`;}
 return topBar('Поиск грузов',{titleBtn:'shipments'})+
 `<div class="page">${seg('searchTab',[['all','Все грузы'],['bids','Мои ставки'],['track','Отслеживаю'],['fav','Избранное']],S.searchTab)}${body}</div>`;
};
V.results=()=>{
 const f=S.filters,SORTS={price:(a,b)=>b.price-a.price,rate:(a,b)=>b.price/b.km-a.price/a.km,km:(a,b)=>a.km-b.km,date:()=>0},list=filtered().slice().sort(SORTS[S.sort||'date']);
 const summary=[f.from||'Любой город',f.to,f.dateFrom?new Date(f.dateFrom).toLocaleDateString('ru-RU',{day:'numeric',month:'short'}):'',f.body!=='Любой'?f.body.toLowerCase().slice(0,3):''].filter(Boolean).join(' — ');
 const wd=isWatched();
 return topBar('Поиск грузов',{back:'search',actions:`<button class="ghost-ic" data-watch aria-pressed="${wd}" aria-label="${wd?'Перестать отслеживать поиск':'Отслеживать этот поиск'}">${ic('bellPlus')}</button>`})+`<div class="page">
  <button class="card row" data-sheet="filters" style="border:0;text-align:left;flex-direction:row;align-items:center"><span class="grow">${esc(summary)}</span></button>
  <div class="chips"><button class="chip ic-chip" data-sheet="sort" aria-label="Сортировка" aria-pressed="${!!S.sort&&S.sort!=='date'}">${ic('swap')}</button><button class="chip ic-chip" data-xfopen aria-label="Фильтры${xfCount(S.extra||xfEmpty())?': выбрано '+xfCount(S.extra):''}" aria-pressed="${!!xfCount(S.extra||xfEmpty())}">${ic('filter')}</button>${(()=>{const X=Object.assign(xfEmpty(),S.extra||{});return rgChip(X,'cap')+rgChip(X,'vol')+rgChip(X,'wt')})()}<button class="chip" data-xffastchip aria-pressed="${!!(S.extra&&S.extra.fast)}">Быстрая оплата</button></div>
  <div class="row between"><b style="font-size:16px">Найдено: ${list.length}</b>${vatBtn()}</div>
  ${list.length?list.map(c=>cargoCard(c)).join(''):`<div class="card empty"><b>Ничего не нашлось</b><span class="muted">Попробуйте убрать город назначения или добавить типы сделок.</span><button class="btn secondary" data-sheet="filters">Изменить фильтры</button></div>`}
 </div>`;
};
