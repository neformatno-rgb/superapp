'use strict';
function applyTotal(c){const a=S.apply,p=PAYS.find(x=>x.id===a.pay);let t=Math.round(c.price*(p.amount/148800));if(a.insure)t-=649;return t}
V.apply=()=>{
 const c=cargoById(S.param),a=S.apply;
 const sel=(id,label,list,val)=>`<div class="field"><label for="${id}">${label}</label><select class="input" id="${id}" data-applysel="${id}">${list.map((x,i)=>`<option value="${i}" ${i===val?'selected':''}>${esc(x)}</option>`).join('')}</select></div>`;
 return topBar('Оформление заявки',{back:'order'})+`<div class="page">
 <section class="card"><b class="num" style="font-size:20px">${c.id}</b>${routeBlock(c)}</section>
 <section class="card"><h2 class="h2">Договор для выполнения заявки</h2>${sel('contract','Договор',ORDER.contract,a.contract)}</section>
 <section class="card"><div class="row between"><h2 class="h2">Способ оплаты</h2>${vatBtn()}</div>
  <p class="muted" style="margin:0;font-size:13px">Оплата поступает в течение указанного срока с даты получения документов, подтверждающих перевозку.</p>
  <div role="radiogroup" aria-label="Способ оплаты" style="display:flex;flex-direction:column;gap:8px">${PAYS.map(p=>`<button class="pay" role="radio" aria-checked="${a.pay===p.id}" data-pay="${p.id}">
   <div class="row between"><span style="color:var(--accent);display:inline-flex">${TILES[p.icon]||ic(p.icon)}</span><span class="row">${tag(p.days,'plain')}<span class="radio"></span></span></div>
   <b style="font-weight:500">${p.name}</b><div class="row between num" style="font-family:var(--font-ctl);font-size:13px"><span class="muted">К получению</span><span>${rub(Math.round(c.price*(p.amount/148800)))}</span></div>
   ${p.first?`<div class="row between num" style="font-family:var(--font-ctl);font-size:13px"><span class="muted">После первой погрузки</span><span>${rub(Math.round(c.price*(p.first/148800)))}</span></div>`:''}</button>`).join('')}</div></section>
 <section class="card"><h2 class="h2">Дополнительно в заявке</h2>
  ${[['bonus','Списать бонусы','Будет списано','18 541'],['fuel','Топливо после погрузки','Сумма операции','18 541 ₽'],['insure','Застраховать рейс','Страховая премия','649 ₽']].map(([k,l,s,v])=>`<div class="pay" style="cursor:default"><div class="row between"><span>${l}</span><button class="switch" role="switch" aria-checked="${a[k]}" data-sw="${k}" aria-label="${l}"></button></div><div class="row between num" style="font-family:var(--font-ctl);font-size:13px"><span class="muted">${s}</span><span>${a[k]?v:'—'}</span></div></div>`).join('')}</section>
 <section class="card"><h2 class="h2">Подвижной состав</h2>${sel('truck','Машина',ORDER.trucks,a.truck)}${sel('trailer','Прицеп',ORDER.trailers,a.trailer)}
  <b style="font-size:14px">Водитель</b><p style="margin:0">${ORDER.driver.name}</p>
  <dl class="kv num"><dt>ВУ</dt><dd>${ORDER.driver.license}</dd><dt>Телефон</dt><dd>${ORDER.driver.phone}</dd><dt>Дата рождения</dt><dd>${ORDER.driver.birth}</dd><dt>Паспорт</dt><dd>${ORDER.driver.passport}</dd></dl></section>
 <div class="sticky-foot"><div class="grow"><div class="muted" style="font-size:12px">К получению</div><b class="num price">${rub(applyTotal(c))}</b></div><button class="btn primary" data-confirm-apply="${c.id}">Забрать груз</button></div>
 </div>`;
};
const SUCC_IMG='assets/img/success.webp';
function successSheet(){
 const art=`<img class="succ-art" src="${SUCC_IMG}" alt="" width="180" height="180">`;
 return `<div class="succ"><div class="succ-body">${art}
  <h1 class="succ-title">Заявка успешно сформирована</h1>
  <p class="succ-text">Найти заявку можно в&nbsp;разделе «Мои перевозки». Дождитесь, пока экспедитор подтвердит перевозку.</p></div>
  <div class="succ-actions"><button class="btn primary" data-go="shipments">Мои перевозки</button><button class="btn secondary" data-go="search">Найти груз</button></div></div>`;
}
