'use strict';
V.home=()=>{
 const active=S.shipments.filter(s=>!['canceled','rejected'].includes(s.status));
 const list=CARGO.filter(c=>S.fav.includes(c.id));
 return `<header class="top"><div class="avatar user-ava" aria-label="Профиль"><svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true"><path d="M18.002 0C21.0327 7.06511e-06 23.9985 0.22995 26.8756 0.637525C31.2829 1.26188 34.7363 4.7151 35.3614 9.12229C35.7695 12.0006 36 14.9678 36 18C36 21.0318 35.7695 23.9986 35.3614 26.8766C34.7363 31.2838 31.2828 34.7372 26.8755 35.3619C23.9985 35.7698 21.0327 36 18.002 36C14.9693 36 12.0017 35.7696 9.12304 35.3613C4.71598 34.7363 1.26283 31.283 0.638135 26.8759C0.230222 23.9981 0 21.0315 0 18C1.96502e-05 14.9681 0.230209 12.0011 0.638144 9.12296C1.26279 4.71593 4.71593 1.26275 9.12296 0.638161C12.0017 0.23017 14.9694 -1.32559e-07 18.002 0Z" fill="#74787F"/><ellipse cx="18" cy="16" rx="7" ry="8" fill="white"/><path d="M18 26C25.2414 26 31.2838 28.737 32.6904 32.377C31.1804 33.9557 29.1569 35.0389 26.876 35.3623C23.999 35.7701 21.0327 36 18.002 36C14.9693 36 12.0017 35.7696 9.12305 35.3613C6.84234 35.0379 4.81854 33.9555 3.30859 32.377C4.71498 28.7368 10.7583 26 18 26Z" fill="white"/></svg></div><h1 class="m">Александр</h1>
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
