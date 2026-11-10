'use strict';
V.map=()=>topBar('Карта')+`<div class="page"><div class="card empty" style="padding:48px 24px;margin-top:24px">
 <span class="sq-ic" style="width:72px;height:72px;border-radius:20px;color:var(--muted)">${ic('map')}</span>
 <b style="font-size:18px;font-weight:500">Раздел в разработке</b>
 <span class="muted" style="max-width:280px">Здесь появится карта с вашими рейсами и грузами поблизости. Маршрут конкретного груза уже можно посмотреть в его карточке.</span>
 <button class="btn primary" data-go="search" style="margin-top:8px">К поиску грузов</button></div></div>`;
