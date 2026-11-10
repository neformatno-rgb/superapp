'use strict';
const STAGES={enroute:'Направляйтесь на пункт погрузки',arrived:'Вы на погрузке',docs:'Вы на погрузке',loaded:'Погрузка закончена',departed:'Вы в пути'};
V.trip=()=>{
 const s=shipById(S.param)||S.shipments[0];if(!s) return V.shipments();
 const c=cargoById(s.id);
 let body='';
 if(S.tripTab==='trip'){
  const check={pending:['Не проверен','gray'],ok:['Без замечаний','green'],remarks:['С замечаниями','orange']}[s.cargoCheck];
  const arrivedRow=s.stage!=='enroute'?`<div class="row">${tag('Прибыл','gray')}<span class="muted num" style="font-size:12px">${esc(s.arrivedAt||'05 дек, 19:40')}</span></div>`:'';
  let alert='',actions='';
  if(s.stage==='enroute') actions=`<button class="btn primary block" data-arrive="${s.id}">Сообщить о прибытии</button>`;
  if(s.stage==='arrived'){alert=`<div class="alert">${ic('info')}<span>Отметьте статус каждого груза перед отправкой на согласование</span></div>`;actions=`<button class="btn primary block" data-sheet="confirm" ${s.cargoCheck==='pending'?'':''}>${s.cargoCheck==='pending'?'Подтвердить всё без замечаний':'Отправить на согласование'}</button>`}
  if(s.stage==='docs') alert=`<div class="alert warn"><span class="spinner" aria-hidden="true"></span><span><b style="font-weight:500">Формируем транспортную накладную</b><br><span class="muted" style="font-size:12px">Обычно это занимает пару секунд</span></span></div>`;
  if(s.stage==='loaded'){alert=`<div class="alert ok">${ic('check')}<span>Документы и QR готовы</span></div>`;actions=`<button class="btn primary block" data-sheet="depart">Сообщить об убытии</button>`}
  if(s.stage==='departed') alert=`<div class="alert">${ic('truck')}<span>Следующий пункт — ${esc(c.to)}. Сообщите о прибытии, когда будете на месте.</span></div>`;
  const A=ADDR[c.from]||[c.from,''],B=ADDR[c.to]||[c.to,''];
  const addr=x=>`<div><div class="muted">Адрес</div><div>${esc(x[0])}${x[1]?` (<a class="link num" href="#trip" data-fullmap="${c.id}">${x[1]}</a>)`:''}</div></div>`;
  const loadBody=`<div class="tl-card"><div class="row">${tag('Погрузка','green')}<span class="num" style="font-family:var(--font-ctl);font-size:14px;font-weight:500;color:var(--green)">${esc(c.fromWhen.split(' — ')[0])}</span></div>
    ${s.stage!=='enroute'?`<div class="row">${tag('Прибыл','gray')}<span class="muted num" style="font-family:var(--font-ctl);font-size:14px;font-weight:500">${esc(s.arrivedAt||'05 дек, 19:40 – …')}</span></div>`:''}${addr(A)}</div>
   <div class="tl-card"><div class="row between"><span class="muted">Груз</span>${s.stage!=='enroute'?tag(check[0],check[1]):''}</div>
    <div>Апельсины — 5 плт (1,2 × 0,8 × 1,6 м), брутто/нетто 1200/1000 кг, стоимость 100 000 ₽</div>
    ${s.stage==='arrived'?`<div class="grid2"><button class="btn secondary" data-sheet="remarks">Есть замечания</button><button class="btn ${s.cargoCheck==='ok'?'secondary':'primary'}" data-check="ok">${s.cargoCheck==='ok'?ic('check','s')+' Проверен':'Нет замечаний'}</button></div>`:''}
    ${s.stage==='loaded'?`<div class="grid2"><button class="btn secondary" data-sheet="docs">Документы</button><button class="btn secondary" data-sheet="qr" style="color:var(--accent)">QR-код</button></div>`:''}
    ${s.remarks?`<div><span class="muted">Замечание: </span>${esc(s.remarks)}</div>`:''}</div>
   <div class="tl-card"><div class="muted">Комментарий</div><div>Въезд со стороны Дачной улицы, на КПП назвать номер заявки.</div></div>`;
  const unloadBody=`<div class="tl-card"><div class="row">${tag('Разгрузка','blue')}<span class="num" style="font-family:var(--font-ctl);font-size:14px;font-weight:500;color:var(--accent)">${esc(c.toWhen.split(' — ')[0])}</span></div>${addr(B)}</div>
   <div class="tl-card"><div class="muted">Груз</div><div>Апельсины — 5 плт, брутто/нетто 1200/1000 кг</div></div>
   <div class="tl-card"><div class="muted">Комментарий</div><div>Разгрузка с 8:00 до 18:00, при себе доверенность.</div></div>`;
  const cur=s.stage==='departed'?[{city:c.to,ring:'end',body:unloadBody}]:[{city:c.from,body:loadBody},{city:c.to,ring:'end',body:unloadBody}];
  const pts=S.pointsTab==='next'?cur.map(x=>({...x})):(s.stage==='departed'?[{city:c.from,ring:'done',body:loadBody.replace(/<div class="grid2">[\s\S]*?<\/div>\n/g,'')}]:[]);
  body=`<section class="card"><h2 class="h2">${STAGES[s.stage]}</h2>${alert}${tlList('trip-'+s.id+'-'+s.stage,cur,0)}${actions}</section>
   <h2 class="h2" style="margin:8px 0 0">Пункты в вашем маршруте</h2>${seg('pointsTab',[['next','Следующие'],['done','Выполненные']],S.pointsTab)}
   <section class="card">${pts.length?tlList('pts-'+S.pointsTab+'-'+s.stage,pts,-1):'<span class="muted">Выполненных пунктов пока нет.</span>'}</section>`;
 } else if(S.tripTab==='about'){
  const ap=S.apply,pay=PAYS.find(x=>x.id===ap.pay);
  body=orderSections(c,s.status)+`<section class="card"><h2 class="h2">Подвижной состав</h2>
   <div class="tl-card"><div class="muted">Машина</div><div>${esc(ORDER.trucks[ap.truck||0])}</div></div>
   <div class="tl-card"><div class="muted">Прицеп</div><div>${esc(ORDER.trailers[ap.trailer||0])}</div></div>
   <div class="tl-card"><div class="muted">Водитель</div><div>${ORDER.driver.name}</div>
    <dl class="kv num"><dt>ВУ</dt><dd>${ORDER.driver.license}</dd><dt>Телефон</dt><dd>${ORDER.driver.phone}</dd><dt>Дата рождения</dt><dd>${ORDER.driver.birth}</dd><dt>Паспорт</dt><dd>${ORDER.driver.passport}</dd></dl></div></section>
   <section class="card"><h2 class="h2">Условия заявки</h2><dl class="kv num"><dt>Договор</dt><dd>${esc(ORDER.contract[ap.contract||0])}</dd><dt>Способ оплаты</dt><dd>${pay.name}</dd><dt>К получению</dt><dd>${rub(applyTotal(c))}</dd></dl></section>`;
 } else {
  const ready=['loaded','departed'].includes(s.stage);
  body=`<section class="card"><h2 class="h2">Электронная ТН</h2>${ready?`<div class="alert ok">${ic('check')}<span>ЭТрН подписана грузоотправителем</span></div>`:`<p class="muted" style="margin:0">Транспортная накладная появится после погрузки.</p>`}
   <dl class="kv"><dt>Товарная накладная</dt><dd>${ready?'2 шт':'—'}</dd><dt>ТТН (товарно-транспортная накладная)</dt><dd>${ready?'2 шт':'—'}</dd><dt>Документы на оплату перевозки</dt><dd>${s.stage==='departed'?'1 шт':'—'}</dd></dl></section>`;
 }
 return topBar('Заявка '+c.id,{back:'shipments',actions:`<button class="icon-btn" data-toast="Диспетчер: +7 (800) 555-35-35" aria-label="Ещё">${ic('more')}</button>`})+
 `<div class="page">${seg('tripTab',[['trip','В рейсе'],['about','О заявке'],['etn','ЭТрН']],S.tripTab)}${body}</div>`;
};
