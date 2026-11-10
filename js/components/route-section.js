'use strict';
/* ---------- route section (order view) ---------- */
const ADDR={'Санкт-Петербург':['Пушкин (Ленинградская обл.), Дачная ул., д. 41','59.7230, 30.4120'],'Екатеринбург':['Екатеринбург, ул. Монтажников, д. 4','56.8133, 60.5167'],'Москва':['Москва, ул. Подъёмная, д. 12','55.7203, 37.7180'],'Казань':['Казань, ул. Тэцевская, д. 12','55.8433, 49.0867'],
 'Краснодар':['Краснодар, ул. Уральская, д. 87','45.0353, 39.0570'],'Великий Новгород':['Великий Новгород, ул. Державина, д. 21','58.5520, 31.2900'],'Новосибирск':['Новосибирск, ул. Петухова, д. 69','54.9500, 82.8820'],'Омск':['Омск, ул. 22 Декабря, д. 98','54.9480, 73.4510']};
const openPts={};
function stops(c){const date=c.fromWhen.split(' — ')[0];const t=[{city:c.from,kind:'Погрузка',tone:'green',when:date}];if(c.via)t.push({city:c.from,kind:'Догрузка',tone:'green',when:date.replace(/\d\d:\d\d$/,'23:00')});t.push({city:c.to,kind:'Разгрузка',tone:'blue',when:c.toWhen.split(' — ')[0]});return t}
function routeSection(c){
 if(!(c.id in openPts))openPts[c.id]=0;
 const vb=routeBox(c,75),k=vb[2]/360,list=stops(c);
 return `<section class="card"><div class="row between"><h2 class="h2">Маршрут</h2><span class="num" style="font-family:var(--font-ctl);font-size:14px">${c.km.toLocaleString('ru-RU')} км <span class="muted">| ${Math.round(c.price*vatK()/c.km)} ₽/км</span></span></div>
  <div class="mapbox strip">${mapSvg(c,{vb,k})}<button class="center" data-fullmap="${c.id}">Показать карту</button></div>
  ${tlList('ord-'+c.id,list.map((p,i)=>{const a=ADDR[p.city]||[p.city,''];return {city:p.city,ring:i===list.length-1?'end':'',body:`<div class="tl-card"><div class="row">${tag(p.kind,p.tone)}<span class="num" style="font-family:var(--font-ctl);font-size:14px;font-weight:500;color:var(--${p.tone==='green'?'green':'accent'})">${esc(p.when)}</span></div>
     <div><div class="muted">Адрес</div><div>${esc(a[0])}${a[1]?`<br><a class="link num coords" href="#order" data-copy="${a[1]}">${a[1]}</a>`:''}</div></div></div>
    <div class="tl-card"><div class="muted">Груз</div><div>Апельсины — 5 плт (1,2 × 0,8 × 1,6 м), брутто/нетто 1200/1000 кг, стоимость 100 000 ₽</div></div>
    <div class="tl-card"><div class="muted">Комментарий</div><div>${p.kind==='Разгрузка'?'Разгрузка с 8:00 до 18:00, при себе доверенность.':'Въезд со стороны Дачной улицы, на КПП назвать номер заявки.'}</div></div>`}}),0)}</section>`;
}
