'use strict';
/* ---------- sheets ---------- */
function sheet(html){document.getElementById('layer').innerHTML=`<div class="scrim" data-close><div class="sheet" role="dialog" aria-modal="true" tabindex="-1" style="outline:none"><div class="grab"></div>${html}</div></div>`;const sh=document.querySelector('.sheet');sh&&sh.focus({preventScroll:true})}
function closeSheet(){document.getElementById('layer').innerHTML=''}
const nowDate=()=>new Date().toISOString().slice(0,10),nowTime=()=>new Date().toTimeString().slice(0,5);
const SHEETS={
 arrive:id=>`<h3>Сообщить о прибытии</h3><p class="muted" style="margin:0;font-size:13px">Время должно совпадать с фактическим, указанным в документах на погрузке.</p>
  <form id="arriveForm" data-id="${id}" class="sec"><div class="grid2"><div class="field"><label for="aD">Дата прибытия</label><input class="input" type="date" id="aD" required value="${nowDate()}"></div><div class="field"><label for="aT">Время прибытия</label><input class="input" type="time" id="aT" required value="${nowTime()}"></div></div>
  <button class="btn primary block" type="submit">Отправить и принять груз</button></form>`,
 depart:()=>`<h3>Сообщить об убытии</h3><p class="muted" style="margin:0;font-size:13px">Укажите фактическое время выезда с пункта погрузки.</p>
  <form id="departForm" class="sec"><div class="grid2"><div class="field"><label for="dD">Дата убытия</label><input class="input" type="date" id="dD" required value="${nowDate()}"></div><div class="field"><label for="dT">Время убытия</label><input class="input" type="time" id="dT" required value="${nowTime()}"></div></div>
  <button class="btn primary block" type="submit">Отправить</button></form>`,
 confirm:()=>`<h3>Внимание</h3><p style="margin:0">Вы собираетесь принять груз. Убедитесь, что все данные заполнены правильно, и подтвердите действие.</p><button class="btn secondary block" data-close>Отмена</button><button class="btn primary block" data-accept>Подтвердить</button>`,
 remarks:()=>`<h3>Погрузка груза</h3><p class="muted" style="margin:0;font-size:13px">Зафиксируйте фактические параметры и опишите замечания.</p>
  <form id="remarksForm" class="sec"><b>Плановые параметры</b><div class="grid2"><div class="field"><label>Масса брутто, кг</label><input class="input" value="20 000" disabled></div><div class="field"><label>Кол-во мест, шт</label><input class="input" value="22" disabled></div></div>
  <b>Фактические параметры</b><div class="grid2"><div class="field"><label for="rM">Масса брутто, кг</label><input class="input" id="rM" inputmode="numeric" required placeholder="20 000"></div><div class="field"><label for="rC">Кол-во мест, шт</label><input class="input" id="rC" inputmode="numeric" required placeholder="22"></div></div>
  <div class="field"><label for="rT">Комментарий по грузу</label><textarea class="input" id="rT" required placeholder="Например: повреждена упаковка на двух палетах"></textarea></div>
  <label class="pay" style="box-shadow:inset 0 0 0 1px var(--accent);align-items:center;cursor:pointer;flex-direction:row;justify-content:center;color:var(--accent)">${ic('upload')}<span id="rFilesLbl">Выберите файлы · не более 3</span><input type="file" id="rF" multiple accept="image/*,.pdf" hidden></label>
  <button class="btn primary block" type="submit">Сохранить</button></form>`,
 vat:()=>`<h3>Цены</h3><div role="radiogroup" aria-label="НДС в ценах" style="display:flex;flex-direction:column;gap:8px">${VATS.map(v=>`<button class="pay" role="radio" aria-checked="${(S.vat||0)===v}" data-vat="${v}" style="flex-direction:row;align-items:center;justify-content:space-between"><span>${vatText(v)}</span><span class="radio"></span></button>`).join('')}</div>`,
 sort:()=>`<h3>Сортировка</h3><div role="radiogroup" aria-label="Сортировка" style="display:flex;flex-direction:column;gap:8px">${[['date','По дате погрузки'],['price','Сначала дороже'],['rate','По ставке ₽/км'],['km','Сначала ближе']].map(([k,l])=>`<button class="pay" role="radio" aria-checked="${(S.sort||'date')===k}" data-sort="${k}" style="flex-direction:row;align-items:center;justify-content:space-between"><span>${l}</span><span class="radio"></span></button>`).join('')}</div>`,
 filters:()=>`<h3>Фильтры</h3>`+filterForm().replace('class="card"','class="sec"'),
 qr:id=>`<h3>QR-код рейса</h3><p class="muted" style="margin:0;font-size:13px">Покажите на КПП. Код ведёт к ЭТрН по заявке ${esc(S.param)}.</p>${qrSvg(S.param)}`,
 docs:()=>`<h3>Документы</h3><dl class="kv"><dt>Товарная накладная №1847</dt><dd>${tag('Подписан','green')}</dd><dt>Товарная накладная №1848</dt><dd>${tag('Подписан','green')}</dd><dt>ЭТрН №0092-12</dt><dd>${tag('Подписан','green')}</dd></dl><button class="btn secondary block" data-close>Закрыть</button>`
};
function qrSvg(seed){let h=0;for(const ch of seed)h=(h*31+ch.charCodeAt(0))>>>0;const n=25,cells=[];const rnd=()=>{h^=h<<13;h>>>=0;h^=h>>17;h^=h<<5;h>>>=0;return h%100};
 const finder=(x,y)=>`<rect x="${x}" y="${y}" width="7" height="7" fill="#111"/><rect x="${x+1}" y="${y+1}" width="5" height="5" fill="#fff"/><rect x="${x+2}" y="${y+2}" width="3" height="3" fill="#111"/>`;
 for(let y=0;y<n;y++)for(let x=0;x<n;x++){const inF=(x<8&&y<8)||(x>n-9&&y<8)||(x<8&&y>n-9);if(!inF&&rnd()<48)cells.push(`<rect x="${x}" y="${y}" width="1" height="1" fill="#111"/>`)}
 return `<svg class="qr" viewBox="0 0 ${n} ${n}" role="img" aria-label="QR-код" shape-rendering="crispEdges">${cells.join('')}${finder(0,0)}${finder(n-7,0)}${finder(0,n-7)}</svg>`}
