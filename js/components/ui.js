'use strict';
/* ---------- shared pieces ---------- */
const tag=(label,tone)=>`<span class="tag ${tone}">${esc(label)}</span>`;
/* documents block: one collapsible row per document type with a count badge */
const DOC_LIST={'Товарная накладная':['Товарная накладная №1847','Товарная накладная №1848'],'ТТН':['ТТН №5521','ТТН №5522'],'Документы на оплату перевозки':['Счет на оплату №П-0912']};
const docRows=rows=>`<div class="docs">${rows.map(([title,key,n])=>n?`<details class="doc-row"><summary><span class="grow">${esc(title)}</span>${tag(n+' шт','green')}${ic('chevD','s')}</summary><div class="doc-items">${DOC_LIST[key].slice(0,n).map(d=>`<button type="button" class="doc-item" data-toast="${esc(d)}: открыт просмотр"><span class="grow">${esc(d)}</span></button>`).join('')}</div></details>`:`<div class="doc-row off"><div class="doc-sum"><span class="grow">${esc(title)}</span>${tag('нет','gray')}</div></div>`).join('')}</div>`;
function cargoCard(c,opts={}){
 const fav=S.fav.includes(c.id);
 const t=c.timer?` (${String(Math.floor(c.timer/3600)).padStart(2,'0')}:${String(Math.floor(c.timer%3600/60)).padStart(2,'0')}:${String(c.timer%60).padStart(2,'0')})`:'';
 return `<article class="card cargo" data-open="${c.id}" tabindex="0" aria-label="Груз ${c.id}, ${esc(c.from)} — ${esc(c.to)}">
  <div class="row">
   <div class="rating">${star}<span class="num">${String(c.rating).replace('.',',')}</span></div>
   <div class="grow"><div>${tag(c.client,'plain')}</div><div class="num" style="font-size:13px;margin-top:2px">${c.id}</div></div>
   <button class="ghost-ic" data-share="${c.id}" aria-label="Поделиться">${ic('share')}</button>
   <button class="ghost-ic" data-fav="${c.id}" aria-pressed="${fav}" aria-label="${fav?'Убрать из избранного':'В избранное'}">${ic(fav?'bookmarkOn':'bookmark')}</button>
  </div>
  <div class="strip"><span>${esc(c.body)} | ${esc(c.load)}</span><span class="num">${esc(c.items)} | ${esc(c.pallets)}</span></div>
  ${routeBlock(c)}
  <div class="row" style="flex-wrap:wrap">
   ${c.deal==='Аукцион'?`<span class="tag blue num" data-timer="${c.id}">${'Аукцион'+t}</span>`:tag(c.deal,'gray')}
   <span class="grow"></span>
   ${c.fast?`<span title="Быстрая оплата" aria-label="Быстрая оплата" style="display:inline-flex">${fastBadge}</span>`:''}
   <span class="bonus-pill" title="Бонусы">${coin}<span class="num">+${c.bonus}</span></span>
  </div>
  <hr class="hr">
  <div class="row between"><span class="num muted" style="font-family:var(--font-ctl)">${c.km.toLocaleString('ru-RU')} км • ${Math.round(c.price*vatK()/c.km)} ₽/км</span><span class="price num">${rub(c.price)}</span></div>
 </article>`;
}
function routeBlock(c,short){
 return `<div class="route">
  <div><div class="dotc"></div><div class="line" style="height:${c.via?44:30}px"></div></div>
  <div><div class="city">${esc(c.from)}</div><div class="when num">${esc(c.fromWhen)}</div>${c.via?`<div class="via">+${c.via} ${c.via===1?'точка':'точки'} в рейсе</div>`:''}</div>
  <div><div class="dotc end"></div></div>
  <div><div class="city">${esc(c.to)}</div><div class="when num" style="padding-bottom:0">${esc(c.toWhen)}</div></div>
 </div>`;
}
function shipCard(s,withAction){
 const c=cargoById(s.id),[lbl,tone]=STATUS[s.status];
 return `<article class="card cargo" data-trip="${s.id}" tabindex="0" aria-label="Перевозка ${s.id}">
  <div class="row between"><div class="row">${tag(c.client,'plain')}<span class="num" style="font-size:13px">${s.id}</span></div>${tag(lbl,tone)}</div>
  <div class="strip"><span>${esc(c.body)} | ${esc(c.load)}</span><span class="num">${esc(c.items)} | ${esc(c.pallets)}</span></div>
  ${routeBlock(c)}
  <hr class="hr">
  <div class="row between"><span class="num muted" style="font-family:var(--font-ctl)">${c.km.toLocaleString('ru-RU')} км • ${Math.round(c.price*vatK()/c.km)} ₽/км</span><span class="price num">${rub(c.price)}</span></div>
  ${withAction&&s.stage==='enroute'?`<div class="row"><button class="btn primary grow" data-arrive="${s.id}">Сообщить о прибытии</button><button class="btn secondary sq" data-trip="${s.id}" aria-label="Открыть заявку" style="color:var(--muted)">${ic('openExt')}</button></div>`:''}
 </article>`;
}
function topBar(title,{back,actions='',titleBtn}={}){
 return `<header class="top">${back?`<button class="icon-btn" data-back="${back}" aria-label="Назад">${ic('back')}</button>`:''}
  ${titleBtn?`<button class="title-btn" data-titlemenu aria-haspopup="menu" aria-expanded="false" aria-label="${esc(title)}, выбрать раздел"><span>${esc(title)}</span>${ic('chevD','s')}</button><span class="grow"></span>`:`<h1 class="${back?'m':''}">${esc(title)}</h1>`}${actions}</header>`;
}
const seg=(name,items,val)=>`<div class="seg" role="tablist">${items.map(([v,l])=>`<button role="tab" aria-selected="${v===val}" data-seg="${name}" data-val="${v}">${l}</button>`).join('')}</div>`;
