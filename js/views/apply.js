'use strict';
function applyTotal(c){const a=S.apply,p=PAYS.find(x=>x.id===a.pay);let t=Math.round(effPrice(c)*(p.amount/148800));if(a.insure)t-=649;return t}
V.apply=()=>{
 const c=cargoById(S.param),a=S.apply;
 if(S.applyFor!==c.id){a.contract=a.truck=a.trailer=a.driver=null;a.bonus=a.fuel=a.insure=false;a.bonusAmt=0;a.fuelAmt=0;a.fuelContract=null;S.applyFor=c.id}
 const sel=(id,label,list,val,ph)=>`<div class="field dd-wrap"><label for="${id}">${label}</label><button type="button" class="input dd-btn" id="${id}" data-dd aria-haspopup="listbox" aria-expanded="false"><span class="${val==null?'muted':''}">${val==null?ph:esc(list[val])}</span>${ic('chevD','s')}</button><div class="dd-menu" role="listbox" aria-label="${label}">${list.map((x,i)=>`<button type="button" class="dd-opt" role="option" aria-selected="${i===val}" data-ddopt="${id}:${i}"><span class="grow">${esc(x)}</span>${i===val?ic('check','s'):''}</button>`).join('')}</div></div>`;
 return topBar('Оформление заявки',{back:'order'})+`<div class="page">
 <section class="card"><b class="num" style="font-size:20px">${c.id}</b>${routeBlock(c)}</section>
 <section class="card"><h2 class="h2">Договор для выполнения заявки</h2>${sel('contract','Договор',ORDER.contract,a.contract,'Выберите договор')}${a.contract==null?'<p class="muted" style="margin:0;font-size:13px">После выбора договора появятся способ оплаты, дополнительные услуги и подвижной состав.</p>':''}</section>
 ${a.contract==null?'':`<section class="card"><div class="row between"><h2 class="h2">Способ оплаты</h2>${vatBtn()}</div>
  <p class="muted" style="margin:0;font-size:13px">Оплата поступает в течение указанного срока с даты получения документов, подтверждающих перевозку.</p>
  <div role="radiogroup" aria-label="Способ оплаты" style="display:flex;flex-direction:column;gap:8px">${PAYS.map(p=>`<button class="pay" role="radio" aria-checked="${a.pay===p.id}" data-pay="${p.id}">
   <div class="row between"><span style="color:var(--accent);display:inline-flex">${TILES[p.icon]||ic(p.icon)}</span><span class="row">${tag(p.days,'plain')}<span class="radio"></span></span></div>
   <b style="font-weight:500;font-size:16px;line-height:20px">${p.name}</b><div class="row between num leader" style="font-family:var(--font-ctl);font-size:13px"><span class="muted">К получению</span><span class="pay-sum">${rub(payAmt(c,p))}</span></div>
   ${p.first?`<div class="row between num leader" style="font-family:var(--font-ctl);font-size:13px"><span class="muted">После первой погрузки</span><span class="pay-sum sm">${rub(payAmt(c,p,'first'))}</span></div>`:''}</button>`).join('')}</div></section>
 <section class="card"><h2 class="h2">Дополнительно в заявке</h2>
  <div class="pay bn-card" style="cursor:default"><img class="bn-big" src="${COIN_IMG}" alt="">
   <div class="row between"><span class="row" style="gap:6px"><b class="bn-title">Бонусы</b><button type="button" class="bn-info" data-toast="Бонусы начисляются за выполненные перевозки. 1 бонус = 1 ₽" aria-label="Что такое бонусы">${ic('infoI')}</button></span><button class="switch" role="switch" aria-checked="${a.bonus}" data-sw="bonus" aria-label="Списать бонусы"></button></div>
   <p class="bn-text">Вы можете потратить накопленные бонусы, увеличив стоимость заявки по курсу 1 бонус = 1 ₽.</p>
   <div class="row between num leader" style="font-family:var(--font-ctl);font-size:13px"><span class="muted">${a.bonus?'Будет списано':'Доступно'}</span><span class="pay-sum">${(a.bonus?(a.bonusAmt||0):BONUS_MAX).toLocaleString('ru-RU')}</span></div></div>
  <div class="pay bn-card" style="cursor:default"><img class="bn-big" src="${FUEL_IMG}" alt="">
   <div class="row between"><span class="row" style="gap:6px"><b class="bn-title">Топливо после погрузки</b><button type="button" class="bn-info" data-toast="Сумму на топливо переведем на Моносчет сразу после погрузки и удержим из оплаты за рейс" aria-label="Что такое топливо после погрузки">${ic('infoI')}</button></span><button class="switch" role="switch" aria-checked="${a.fuel}" data-sw="fuel" aria-label="Топливо после погрузки"></button></div>
   <p class="bn-text">До 60% от стоимости заявки — сразу на Моносчет</p>
   ${a.fuel?`<div class="row between num leader" style="font-family:var(--font-ctl);font-size:13px"><span class="muted">Сумма операции</span><span class="pay-sum">${rub(a.fuelAmt||0)}</span></div>`:''}</div>
  <div class="pay bn-card" style="cursor:default"><img class="bn-big" src="${INS_IMG}" alt="">
   <div class="row between"><span class="row" style="gap:6px"><b class="bn-title">Страхование</b><button type="button" class="bn-info" data-toast="Страхуем груз на время рейса. Премия удерживается из оплаты за рейс" aria-label="Что такое страхование">${ic('infoI')}</button></span><button class="switch" role="switch" aria-checked="${a.insure}" data-sw="insure" aria-label="Застраховать рейс"></button></div>
   <p class="bn-text">Застрахуйте груз в 1 клик от 149 ₽. Страховая сумма до 10 млн ₽.</p>
   ${a.insure?`<div class="row between num leader" style="font-family:var(--font-ctl);font-size:13px"><span class="muted">Страховая премия</span><span class="pay-sum">649 ₽</span></div><div class="row between num leader" style="font-family:var(--font-ctl);font-size:13px"><span class="muted">Страховая сумма</span><span class="pay-sum">5 000 000 ₽</span></div>`:''}</div></section>
 <section class="card"><h2 class="h2">Подвижной состав</h2>${sel('truck','Машина',ORDER.trucks,a.truck,'Выберите машину')}${sel('trailer','Прицеп',ORDER.trailers,a.trailer,'Выберите прицеп')}
  ${sel('driver','Водитель',ORDER.drivers.map(d=>d.name),a.driver,'Выберите водителя')}
  ${a.driver==null?'':(d=>`<dl class="kv num"><dt>ВУ</dt><dd>${d.license}</dd><dt>Телефон</dt><dd>${d.phone}</dd><dt>Дата рождения</dt><dd>${d.birth}</dd><dt>Паспорт</dt><dd>${d.passport}</dd></dl>`)(ORDER.drivers[a.driver])}</section>
 `}<div class="sticky-foot"><div class="grow"><div class="muted" style="font-size:12px">К получению</div><b class="num price">${rub(applyTotal(c))}</b></div><button class="btn primary" data-confirm-apply="${c.id}">Забрать груз</button></div>
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
