'use strict';
V.menu=()=>topBar('Меню')+`<div class="page"><section class="card" style="gap:0;padding:4px 12px">
 ${[['shipments','route','Мои перевозки'],['search','box','Поиск грузов'],['home','wallet','Финансы']].map(([v,i,l])=>`<a href="#${v}" class="row" style="padding:12px 0;color:var(--fg);text-decoration:none;border-bottom:1px solid var(--line)">${ic(i)}<span class="grow">${l}</span>${ic('chevR','s')}</a>`).join('')}
 <button class="row" data-toast="Бонусный баланс: 18 541" style="padding:12px 0;border:0;background:none;width:100%;text-align:left">${ic('gift')}<span class="grow">Бонусы</span><span class="muted num">18 541</span></button></section>
 <section class="card" style="gap:0;padding:4px 12px"><button class="row" data-reset style="padding:12px 0;border:0;background:none;width:100%;text-align:left;color:var(--red)">${ic('reset')}<span class="grow">Сбросить демо-данные</span></button></section>
 <p class="demo-note">Кабинет перевозчика · демо по макетам Android</p></div>`;
