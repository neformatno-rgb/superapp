'use strict';
function orderSections(c,status){return ` <section class="card"><div class="row between"><div class="row"><b class="num" style="font-size:20px">${c.id}</b>${status?tag(STATUS[status][0],STATUS[status][1]):''}</div><div class="row"><div class="rating" title="Просмотры">${eyeIc}<span class="num">123</span></div><div class="rating" title="Рейтинг">${star}<span class="num">${String(c.rating).replace('.',',')}</span></div></div></div>${routeBlock(c)}</section>
 <section class="card"><div class="row"><div class="avatar" style="background:var(--surface-2);color:var(--fg)">${esc(c.client.slice(0,2).toUpperCase())}</div><div class="grow"><div style="font-size:13px">${esc(c.client)}</div><a class="link" href="#order" data-toast="Профиль компании появится в следующей версии" style="font-size:13px">Профиль компании</a></div><div class="rating">${star}<span class="num">${String(c.rating).replace('.',',')}</span></div></div></section>
 <section class="card" id="costSec"><div class="row between"><h2 class="h2">Стоимость</h2>${vatBtn()}</div>
  <div class="cost-box"><div class="muted" style="font-size:13px;line-height:18px">Стоимость перевозки</div><b class="num price">${rub(c.price)}</b></div>
  <dl class="kv num">${PAYS.map(p=>`<dt>${p.name}</dt><dd>${rub(payAmt(c,p))}</dd>`).join('')}<dt>Бонусов можно списать</dt><dd class="row" style="justify-content:flex-end;gap:4px">18 540 ${coin}</dd><dt>Начислим бонусы</dt><dd class="row" style="justify-content:flex-end;gap:4px">+${c.bonus} ${coin}</dd></dl>${status?'':`<button class="btn primary block" data-go="apply" data-p="${c.id}">Забрать груз</button>`}</section>
 <section class="card"><h2 class="h2">Условия перевозки</h2><b style="font-size:14px">Требования к транспорту</b>
  <dl class="kv"><dt>Тип кузова</dt><dd>${c.body==='Реф'?'Рефрижератор':esc(c.body)}</dd><dt>Объем прицепа</dt><dd>82 м³</dd><dt>Тип погрузки</dt><dd>${esc(c.load)}</dd><dt>Грузоподъемность</dt><dd>12 т</dd>${c.body==='Реф'?'<dt>Температурный режим</dt><dd>−5 … +11 °C</dd>':''}</dl>
  <b style="font-size:14px">Доп. оборудование</b><p style="margin:0;font-size:13px">Смартфон, медицинская книжка, санитарная обработка, возврат тары, отслеживание машины, погрузка/разгрузка силами водителя.</p>
  <b style="font-size:14px">Дополнительно</b><p style="margin:0;font-size:13px">Перевозчик обязуется обеспечивать водителей индивидуальными средствами защиты и незамедлительно уведомлять об изменениях в рейсе.</p></section>
 <section class="card"><h2 class="h2">Грузы</h2>${[1,2].map(n=>`<div style="display:flex;flex-direction:column;gap:16px"><b style="font-size:14px">Груз ${n}</b><dl class="kv num" style="margin:0"><dt>Категория груза</dt><dd>Сельхозсырье</dd><dt>Тип груза</dt><dd>Апельсины</dd><dt>Упаковка</dt><dd>Палеты (5 шт.)</dd><dt>Габариты, м</dt><dd>1,2 × 0,8 × 1,6</dd><dt>Брутто / нетто, кг</dt><dd>1200 / 1000</dd><dt>Стоимость груза</dt><dd>100 000 ₽</dd></dl></div>`).join('<hr class="hr">')}</section>
 ${routeSection(c)}
 <section class="card"><h2 class="h2">Документы</h2>${docRows([['Товарная накладная','Товарная накладная',2],['ТТН','ТТН',2],['Документы на оплату перевозки','Документы на оплату перевозки',1]])}</section>`}
V.order=()=>{
 const c=cargoById(S.param);
 return topBar('Просмотр заказа',{back:'search',actions:`<button class="icon-btn" data-share="${c.id}" aria-label="Поделиться">${ic('share')}</button><button class="icon-btn" data-fav="${c.id}" aria-pressed="${S.fav.includes(c.id)}" aria-label="${S.fav.includes(c.id)?'Убрать из избранного':'В избранное'}">${ic(S.fav.includes(c.id)?'bookmarkOn':'bookmark')}</button>`})+`<div class="page">
 ${orderSections(c)}
 <div aria-hidden="true" style="height:84px"></div>
 <div class="cta-bar" id="ctaBar" aria-hidden="true"><div class="grow"><div class="muted" style="font-size:12px">К получению</div><b class="num price">до ${rub(Math.max(...PAYS.map(p=>payAmt(c,p))))}</b></div><button class="btn primary" data-go="apply" data-p="${c.id}" tabindex="-1">Забрать груз</button></div>
 </div>`;
};
