'use strict';
V.home=()=>{
 const active=S.shipments.filter(s=>!['canceled','rejected'].includes(s.status));
 const list=CARGO.filter(c=>S.fav.includes(c.id));
 return `<header class="top"><div class="avatar">${ic('user')}</div><h1 class="m">Александр</h1>
   <button class="icon-btn" data-toast="Диспетчер: +7 (800) 555-35-35" aria-label="Телефон диспетчера">${ic('phone')}</button>
   <button class="icon-btn" data-toast="Новых уведомлений нет" aria-label="Уведомления">${ic('bell')}</button></header>
 <div class="page">
  <section class="sec"><h2>Финансы</h2><div class="fin">
   <div class="card"><div class="row between"><span class="sq-ic">${ic('wallet')}</span></div><div><div class="muted" style="font-size:13px">Моносчет</div><b class="num">459 389 ₽</b></div></div>
   <div class="card"><div class="row between"><span class="sq-ic">${ic('bizcard')}</span></div><div><div class="muted" style="font-size:13px">Бизнес счет</div><b class="num">23 389 ₽</b></div></div>
  </div></section>
  <section class="sec"><h2>Работа с заявками</h2>
   ${seg('homeTabA',[['active','Активные'],['bids','Мои торги']],S.homeTabA)}
   ${S.homeTabA==='active'?(active.length?active.map(s=>shipCard(s,true)).join(''):`<div class="card empty"><b>Активных заявок нет</b><span class="muted">Найдите груз и оформите заявку.</span><button class="btn primary" data-go="search">Найти груз</button></div>`)
     :`<div class="card empty"><b>Ставок пока нет</b><span class="muted">Ставки на грузы с аукционом появятся здесь.</span><button class="btn secondary" data-go="search">К поиску грузов</button></div>`}
  </section>
  <section class="sec"><h2>Дополнительно</h2>
   ${seg('homeTabB',[['fav','Избранные'],['track','Отслеживание']],S.homeTabB)}
   ${S.homeTabB==='track'?(S.watch.length?watchCards():`<div class="card empty"><span class="muted">Найдите грузы и нажмите «Отслеживать» внизу экрана — поиск появится здесь, а мы сообщим о новых грузах.</span><button class="btn secondary" data-go="search">К поиску грузов</button></div>`)
     :(list.length?list.map(c=>cargoCard(c)).join(''):`<div class="card empty"><span class="muted">Добавляйте грузы в избранное значком закладки.</span></div>`)}
  </section>
  <p class="demo-note">Демо-версия: данные условные, действия сохраняются только в этом браузере.</p>
 </div>`;
};
