/* Order page: opens from a card, hash routing, price panel with counter-offer and timer. */
'use strict';

// ---------- order detail: click a card → full version ----------
const ILL = ['assets/img/extras/fuel.png', 'assets/img/extras/insurance.png', 'assets/img/extras/bonus.png'];
const OFFER_TTL = 30 * 60 * 1000;
const timerText = (ms) => { if (ms <= 0) return 'Время ожидания истекло'; const t = Math.ceil(ms / 1000); return 'Ожидание ответа ' + String(Math.floor(t / 60)).padStart(2, '0') + ':' + String(t % 60).padStart(2, '0'); };
setInterval(() => { document.querySelectorAll('.wtimer').forEach((el) => { const id = V.id; const at = S.offerAt[id]; if (!at) return; el.textContent = timerText(OFFER_TTL - (Date.now() - at)); }); }, 1000);
const MAP_SRC = 'assets/img/route-map.jpg';
const hpick = (a, h) => a[h % a.length];
const initials = (n) => { const w = n.split(/\s+/); if (w.length > 1) return (w[0][0] + w[1][0]).toUpperCase(); const caps = n.match(/[А-ЯA-Z]/g) || [n[0]]; return (caps[0] + (caps[1] || n[1] || '')).toUpperCase(); };
const plainWin = (day, key) => winHTML(day, key).replace(/<\/?b>/g, '');
const phone = (h) => '+7 (9' + String(10 + h % 89).padStart(2, '0') + ') ' + String(100 + (h >> 4) % 900) + '-' + String(10 + (h >> 9) % 90) + '-' + String(10 + (h >> 13) % 90);
const loadType = (b) => /боков/.test(b) ? 'Боковая' : /Газель/.test(b) ? 'Задняя, боковая' : 'Задняя';
const tempMode = (b) => b === 'Рефрижератор' ? '+2 … +4 °C' : b === 'Изотерм' ? '+5 … +15 °C' : 'Не требуется';

function orderInfo(o) {
  const h = hashStr(o.id);
  const company = hpick(COMPANIES, h);
  const pts = [{ kind: 'ld', city: o.from, reg: o.fromReg, day: o.fromDay, key: o.id + 'f' }];
  for (let i = 0; i < o.stops; i++) {
    const c = cities[(h >> (3 + i * 4)) % cities.length];
    const city = (c[0] === o.from || c[0] === o.to) ? cities[(h + 5 + i) % cities.length] : c;
    pts.push({ kind: 'ul', city: city[0], reg: city[1], day: Math.round(o.fromDay + (o.toDay - o.fromDay) * (i + 1) / (o.stops + 1)), key: o.id + 's' + i, part: true });
  }
  pts.push({ kind: 'ul', city: o.to, reg: o.toReg, day: o.toDay, key: o.id + 't' });
  pts.forEach((p, i) => {
    const k = hashStr(p.key);
    const g = GEO[p.city] || [55 + (k % 500) / 100, 37 + (k % 900) / 100];
    p.addr = p.city + ' (' + p.reg + '), ' + hpick(STREETS, k) + ', д. ' + (1 + k % 87);
    p.geo = (g[0] + ((k >> 5) % 200 - 100) / 2000).toFixed(4) + ', ' + (g[1] + ((k >> 9) % 200 - 100) / 2000).toFixed(5);
    p.site = hpick(SITES, k >> 3) + ' | ' + phone(k);
    p.note = hpick(NOTES, k >> 6);
    p.rating = (4 + (k % 10) / 10).toFixed(1).replace('.', ',');
  });
  return { company, ini: initials(company), views: 40 + h % 360, oRating: (4 + ((h >> 5) % 10) / 10).toFixed(1).replace('.', ','),
           pts, cargoValue: (300 + (h >> 7) % 1700) * 1000, payDays: [5, 7, 10, 14, 20, 30][(h >> 11) % 6] };
}

const V = { id: null, edit: false, seg: 'tariff', pay: true, map: false, only: false, closed: {}, docs: {}, odocs: {}, offer: '' , listY: 0 };

// «Прочие условия»: a stable per-order subset of each list (mock data)
const OTHER_REQS = ['Медицинская книжка', 'Санитарная обработка', 'Отслеживание машины', 'Погрузка/разгрузка силами водителя', 'Возврат тары', 'Смартфон'];
const OTHER_EQUIP = ['Гидроборт', 'Сдвижные стойки', 'Крепежные ремни 6 шт'];
// «Дополнительная информация»: free-text comment from the cargo owner (mock data)
const OWNER_NOTES = [
  'Въезд на склад по пропуску — данные водителя и госномер прислать за сутки до погрузки. Погрузка с рампы, ждём не дольше 2 часов, дальше простой оплачиваем по договору.',
  'Груз хрупкий: паллеты не штабелировать, обязательно закрепить ремнями. На выгрузке получатель проверяет пломбу и пересчитывает места при водителе.',
  'Окно выгрузки строго по записи, при опоздании больше чем на час запись переносится на следующий день. Просим заранее предупреждать о задержках диспетчеру.',
  'Температурный режим держать всю дорогу, распечатку с термописца отдать на выгрузке. Перед погрузкой кузов должен быть охлаждён до +4 °С.',
  'Документы забрать у кладовщика на втором КПП. Оригиналы ТН и ТТН вернуть почтой или курьером в течение 10 дней — без них оплата не проводится.',
  'На территории склада скорость не больше 5 км/ч, водитель в жилете и закрытой обуви. Курить можно только в отведённом месте у ворот.',
  'Возможна догрузка попутно по маршруту до 2 паллет — согласуем отдельно, доплата сверху. Оплата по факту доставки, без отсрочки.',
  'Получатель — торговая сеть, нужна медкнижка и санобработка кузова с отметкой. Без справки машину на выгрузку не пустят.',
];
// «Прочие условия» header button: same mechanics as the route's expand/collapse-all
const ODOCS_N = 3;
function oallBtn() {
  const anyOpen = Array.from({ length: ODOCS_N }, (x, i) => i).some((i) => V.odocs[i]); const t = anyOpen ? 'Свернуть все пункты' : 'Раскрыть все пункты';
  return '<button type="button" class="xall" data-d="oall" aria-label="' + t + '" title="' + t + '">' + (anyOpen ? EXPAND_ALL : COLLAPSED_ALL) + '</button>';
}
// the cold-chain note only makes sense for refrigerated / isothermal bodies
function ownerNote(o) {
  const pool = OWNER_NOTES.filter((t) => tempMode(o.body) !== 'Не требуется' || !/Температурный режим/.test(t));
  return pool[hashStr(o.id + 'n') % pool.length];
}
function pickSome(list, seed, min) {
  const h = hashStr(seed); const out = list.filter((x, i) => (h >> i) & 1);
  return out.length >= min ? out : list.slice(0, Math.max(min, out.length));
}
function propHTML(icon, label, value) { return '<div class="prop">' + DI[icon] + '<span><small>' + label + '</small><b>' + esc(value) + '</b></span></div>'; }

function detailHTML(o) {
  const X = orderInfo(o);
  const k = vatK();
  const price = o.price * k;
  const saved = !!S.saved[o.id], taken = !!S.taken[o.id], offered = S.offers[o.id];
  const gross = Math.round(o.kg * 1.05 / 10) * 10;
  const cargoLine = esc(o.cargo) + ' — ' + o.pl + ' плт, Бр./Нетто (кг): ' + nf(gross) + '/' + nf(o.kg) + ', Стоимость: ' + money(X.cargoValue);
  let h = '';
  // head
  h += '<div class="dhead"><button type="button" class="dback" data-d="back">' + DI.back + 'К грузам</button><span style="flex:1"></span>' +
    '<button type="button" class="sq" data-d="share" aria-label="Поделиться заявкой">' + DI.share + '</button>' +
    '<button type="button" class="sq" data-d="save" aria-pressed="' + saved + '" aria-label="' + (saved ? 'Убрать из избранного' : 'В избранное') + '">' + BOOK24 + '</button></div>';
  h += '<div class="dl">';
  // summary
  const mpt = (k, city, day, key) => '<div class="mpt ' + k + '"><i></i><span><span class="c">' + esc(city) + '</span><span class="w">' + winHTML(day, key) + '</span></span></div>';
  h += '<section class="dcard dsum" aria-label="Заявка ' + o.id + '">' +
    '<div class="mdsum"><div class="mdtop"><h2>' + o.id + '</h2><div class="minis"><span class="mini" title="Просмотры заявки">' + sqb(SQ_B, 'sqmB') + EYE16 + X.views + '</span><span class="mini" title="Рейтинг заявки">' + sqb(SQ_B, 'sqmB') + I.star + X.oRating + '</span></div></div>' +
    '<div class="mroute">' + mpt('ld', o.from, o.fromDay, o.id + 'f') + (o.stops ? '<div class="mstops"><i></i><span>+' + o.stops + ' ' + stopsWord(o.stops) + ' в рейсе</span></div>' : '') + mpt('ul', o.to, o.toDay, o.id + 't') + '</div></div>' +
    '<div class="rbox">' +
    '<div><div class="c" title="' + esc(o.from) + '">' + esc(o.from) + '</div><div class="w">' + winHTML(o.fromDay, o.id + 'f') + '</div></div>' +
    '<div class="mid2"><div class="arr2">' + DI.arrS + (o.stops ? '<span class="plus2" title="Промежуточные точки">+' + o.stops + '</span>' : '') + DI.arrS + '</div><span class="km2">' + nf(o.dist) + ' км</span></div>' +
    '<div class="end"><div class="c" title="' + esc(o.to) + '">' + esc(o.to) + '</div><div class="w">' + winHTML(o.toDay, o.id + 't') + '</div></div></div>' +
    '<div class="co"><span class="ava" aria-hidden="true">' + X.ini + '</span><span class="coname"><b>' + esc(X.company) + '</b><button type="button" data-d="profile">Профиль компании</button></span>' +
    '<div class="minis"><button type="button" class="mini" data-d="chat" aria-label="Чат с ' + esc(X.company) + '">' + sqb(SQ_B, 'sqmB') + '<span class="chat">' + DI.chat + '</span>Чат</button>' +
    '<span class="mini" title="Рейтинг компании">' + sqb(SQ_B, 'sqmB') + I.star + o.rating + '</span></div><span class="vsep" aria-hidden="true"></span>' +
    '<div class="minis"><span class="mini" title="Просмотры заявки">' + sqb(SQ_B, 'sqmB') + EYE16 + X.views + '</span><span class="mini" title="Рейтинг заявки">' + sqb(SQ_B, 'sqmB') + I.star + X.oRating + '</span></div></div></section>';
  // tabs
  h += '<div class="dtabs" role="tablist" aria-label="Разделы заявки">' +
    [['cond', 'Условия перевозки'], ['route', 'Маршрут и груз'], ['extra', 'Дополнительно'], ['docs', 'Документы']].map(([id, t], i) => '<button type="button" class="tab' + (i === 0 ? ' on' : '') + '" data-d="jump" data-to="' + id + '">' + t + '</button>').join('') + '</div>';
  // conditions
  const kv = (k, v) => '<div class="kv"><span>' + k + '</span><b>' + v + '</b></div>';
  const nCargo = X.pts.filter((p) => p.kind === 'ld').length || 1;
  const cargoWord = nCargo % 10 === 1 && nCargo % 100 !== 11 ? 'груз' : [2, 3, 4].indexOf(nCargo % 10) > -1 && [12, 13, 14].indexOf(nCargo % 100) === -1 ? 'груза' : 'грузов';
  h += '<section class="dcard dsec" id="d-cond" aria-label="Условия перевозки"><div class="cond">' +
    '<div class="cgrp"><h2>Требования к транспорту</h2><div class="kvs">' +
      kv('Тип кузова', esc(bodyKind(o.body))) + kv('Грузоподъемность', o.t + ' т | ' + o.m3 + ' м³') +
      kv('Тип погрузки', loadType(o.body)) + kv('Температурный режим', tempMode(o.body)) + '</div></div>' +
    '<div class="cgrp"><h2>Груз</h2><div class="kvs">' +
      kv('Количество', nCargo + ' ' + cargoWord) + kv('Упаковка', o.pl + ' Плт.') +
      kv('Категория груза', esc(o.cargo)) + kv('Стоимость груза', money((50 + hashStr(o.id + 'v') % 450) * 10000)) + '</div></div>' +
    '<div class="cgrp wide"><div class="rhd"><h2>Прочие условия</h2>' + oallBtn() + '</div><div class="docs">' +
      [['Дополнительно', pickSome(OTHER_REQS, o.id + 'r', 2)], ['Дополнительное оборудование', pickSome(OTHER_EQUIP, o.id + 'e', 1)]].map((d, i) => {
        const open = !!V.odocs[i];
        return '<div class="doc' + (open ? ' open' : '') + '"><button type="button" class="dhd" data-d="odoc" data-i="' + i + '" aria-expanded="' + open + '"><span>' + d[0] + '</span><span class="ttag ld">' + d[1].length + ' шт.</span>' + CHEV24 + '</button><p class="dnote">' + esc(d[1].join(', ')) + '</p></div>';
      }).join('') +
      '<div class="doc' + (V.odocs[2] ? ' open' : '') + '"><button type="button" class="dhd" data-d="odoc" data-i="2" aria-expanded="' + !!V.odocs[2] + '"><span>Дополнительная информация</span>' + CHEV24 + '</button><p class="dnote">' + esc(ownerNote(o)) + '</p></div>' +
      '</div></div>' +
  '</div></section>';
  // route
  h += '<section class="dcard dsec' + (V.only ? ' only-cargo' : '') + '" id="d-route"><div class="rhd"><h2>Маршрут</h2>' +
    '<button type="button" class="only" role="switch" aria-checked="' + V.only + '" data-d="only">Показать только грузы<span class="sw' + (V.only ? ' on' : '') + '"></span></button>' +
    (function () { const anyOpen = X.pts.some((p, i) => !V.closed[i]); return '<button type="button" class="xall" data-d="all" aria-label="' + (anyOpen ? 'Свернуть все точки' : 'Раскрыть все точки') + '" title="' + (anyOpen ? 'Свернуть все точки' : 'Раскрыть все точки') + '">' + (anyOpen ? EXPAND_ALL : COLLAPSED_ALL) + '</button>'; })() + '</div>' +
    '<div class="map' + (V.map ? ' open' : '') + '"><img src="' + MAP_SRC + '" alt="Карта маршрута ' + esc(o.from) + ' — ' + esc(o.to) + '">' +
    '<span class="mpill">' + nf(o.dist) + ' км — ' + (price / o.dist).toFixed(2).replace('.', ',') + ' ₽/км</span>' +
    '<button type="button" class="mbtn" data-d="map" aria-expanded="' + V.map + '">' + (V.map ? 'Скрыть карту' : 'Показать карту') + CHEV16 + '</button></div><div class="stops">';
  X.pts.forEach((p, i) => {
    const closed = !!V.closed[i];
    const label = p.kind === 'ld' ? 'Погрузка' : 'Разгрузка';
    h += '<div class="stop ' + p.kind + (closed ? ' closed' : '') + '"><span class="num ' + p.kind + '">' + (i + 1) + '</span>' +
      '<button type="button" class="shead" data-d="stop" data-i="' + i + '" aria-expanded="' + !closed + '"><span class="rpill">' + I.star + p.rating + '</span><span class="sc">' + esc(p.city) + '</span>' + CHEV24.replace('<svg ', '<svg class="chev" ') + '</button>' +
      '<span class="rail ' + p.kind + '"><span class="ring"></span></span><div class="sbody">' +
      '<div class="scard addr"><div class="trow ' + p.kind + '"><span class="ttag">' + label + (p.part ? ' (частичная)' : '') + '</span>' + plainWin(p.day, p.key) + '</div>' +
        '<button type="button" class="geo txt" data-d="geo" data-geo="' + esc(p.addr) + '" aria-label="Скопировать адрес ' + esc(p.addr) + '">' + esc(p.addr) + GEO_ICONS + '</button><button type="button" class="geo" data-d="geo" data-geo="' + p.geo + '" aria-label="Скопировать координаты ' + p.geo + '">' + p.geo + GEO_ICONS + '</button><span>' + esc(p.site) + '</span></div>' +
      '<div class="scard"><small>Груз 1</small><span>' + cargoLine + '</span></div>' +
      '<div class="scard cmt"><small>Комментарий</small><span>' + esc(p.note) + '</span></div></div></div>';
  });
  h += '</div></section>';
  // extras
  h += '<section class="dcard dsec" id="d-extra"><h2>Дополнительно</h2><div class="extras">' + EXTRAS.map((x, i) => '<div class="xitem"><img src="' + ILL[i] + '" alt=""><span><b>' + x[0] + '<button type="button" class="info" data-d="info" data-i="' + i + '" aria-label="Подробнее: ' + x[0] + '">' + INFO + '</button></b><small>' + x[1] + '</small></span></div>').join('') + '</div></section>';
  // documents
  h += '<section class="dcard dsec" id="d-docs"><h2>Документы</h2><div class="docs">' +
    DOCS.map((d, i) => { const open = !!V.docs[i]; return '<div class="doc' + (open ? ' open' : '') + '"><button type="button" class="dhd" data-d="doc" data-i="' + i + '" aria-expanded="' + open + '"><span>' + d[0] + '</span><span class="ttag ld">' + d[1] + ' шт.</span>' + CHEV24 + '</button><p class="dnote">' + d[2] + '</p></div>'; }).join('') + '</div></section>';
  h += '</div>';
  // right panel: tariff / counter-offer (edit → sent with timer)
  const canCounter = o.tags.includes('Встречное');
  const counter = canCounter && V.seg === 'counter';
  const pending = canCounter && offered && !taken;
  const editing = counter && (!pending || V.edit);
  const left = pending ? Math.max(0, OFFER_TTL - (Date.now() - (S.offerAt[o.id] || Date.now()))) : 0;
  const payHTML = '<div class="pay' + (V.pay ? '' : ' closed') + '"><button type="button" data-d="pay" aria-expanded="' + V.pay + '">Способы оплат' + CHEV16 + '</button><div class="prows">' +
      '<div>Стандартная оплата<b>за ' + X.payDays + ' дней</b></div>' +
      '<div><b>Начислим бонусов</b><span class="bonus">' + COIN + '+' + o.bonus + '</span></div></div></div>';
  let body, ctaHTML;
  if (!counter) {
    body = '<div class="cost"><small>Стоимость перевозки</small><b>' + money(price) + '</b></div>';
    ctaHTML = taken ? '<button type="button" class="big2 done" disabled>Забронировано</button>' : '<button type="button" class="big2" data-d="take">Забрать груз</button>';
  } else if (editing) {
    body = '<div class="obox"><label class="ofield2" for="dOffer"><span class="sr">Ваша цена, ₽</span><input id="dOffer" inputmode="numeric" autocomplete="off" value="' + nf(V.offer || offered || Math.round(price * 1.1 / 1000) * 1000) + '"><span>₽</span></label>' +
      '<button type="button" class="osend" data-d="send" aria-label="Отправить встречное предложение">' + CHEVR24 + '</button></div>';
    ctaHTML = '<button type="button" class="big2 sec2" data-d="close">Закрыть</button>';
  } else {
    body = '<div class="cost2"><div class="cost"><small>Начальная цена</small><b>' + money(price) + '</b></div>' +
      '<div class="cost mine"><small>Ваше предложение</small><b>' + money(offered) + '</b></div></div>';
    ctaHTML = '<button type="button" class="big2" data-d="edit">Изменить предложение</button>';
  }
  h += '<aside class="dr">' + (pending ? '<div class="wbanner" role="status"><span class="wtimer" data-left="' + left + '">' + timerText(left) + '</span></div>' : '') +
    '<div class="dcard panel' + (pending ? ' under' : '') + '">' + (canCounter ? '<div class="seg" role="tablist" aria-label="Цена">' +
    '<button type="button" role="tab" data-d="seg" data-seg="tariff" aria-selected="' + !counter + '">Тариф заказчика</button>' +
    '<button type="button" role="tab" data-d="seg" data-seg="counter" aria-selected="' + counter + '">Встречное</button></div>' : '') +
    body + payHTML + ctaHTML +
    '<div class="pnote">Цены указаны <button type="button" data-d="vat" aria-label="Переключить НДС">' + (S.vat ? 'с учетом НДС 22%' : 'без НДС') + CHEV16 + '</button></div>' +
    '</div></aside>';
  return h;
}

const mainEl = document.querySelector('.main');
const detailEl = document.createElement('div');
detailEl.id = 'detail';
mainEl.appendChild(detailEl);

function renderDetail() {
  const o = ALL.find((x) => x.id === V.id);
  if (!o) return;
  detailEl.innerHTML = detailHTML(o);
}
function showDetail(id, push) {
  const o = ALL.find((x) => x.id === id);
  if (!o) return hideDetail(false);
  if (V.id === null) V.listY = window.scrollY;
  if (V.id !== id) Object.assign(V, { edit: false, seg: 'tariff', pay: true, map: false, only: false, closed: {}, docs: {}, odocs: {}, offer: '' });
  V.id = id;
  if (push) { try { history.pushState({ order: id }, '', '#' + encodeURIComponent(id)); } catch (e) {} }
  mainEl.classList.add('is-detail');
  renderDetail();
  window.scrollTo(0, 0);
  const b = detailEl.querySelector('.dback'); if (b) b.focus({ preventScroll: true });
}
function hideDetail(push) {
  if (V.id === null) return;
  const id = V.id; V.id = null;
  if (push) { try { history.pushState({}, '', location.pathname + location.search); } catch (e) {} }
  mainEl.classList.remove('is-detail');
  render();
  window.scrollTo(0, V.listY);
  const card = document.querySelector('.order[data-id="' + id + '"]'); if (card) card.focus({ preventScroll: true });
}
const fromHash = () => { const id = decodeURIComponent(location.hash.slice(1)); if (id && ALL.some((x) => x.id === id)) showDetail(id, false); else hideDetail(false); };
window.addEventListener('popstate', fromHash);
window.addEventListener('hashchange', fromHash);

// open from the list: any click on a card that isn't one of its buttons
$('list').addEventListener('click', (e) => {
  if (e.target.closest('button,a,input,select')) return;
  const c = e.target.closest('.order[data-id]'); if (c) showDetail(c.dataset.id, true);
});
$('list').addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const c = e.target.closest('.order[data-id]'); if (!c || e.target !== c) return;
  e.preventDefault(); showDetail(c.dataset.id, true);
});
// «Поиск грузов» in the menu returns to the list
document.querySelectorAll('#side .nv.on, .bnav .bn.on').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); hideDetail(true); }));

detailEl.addEventListener('click', (e) => {
  const b = e.target.closest('[data-d]'); if (!b) return;
  const o = ALL.find((x) => x.id === V.id); if (!o) return;
  const X = orderInfo(o);
  switch (b.dataset.d) {
    case 'back': if (history.state && history.state.order) history.back(); else hideDetail(true); break;
    case 'share': try { navigator.clipboard.writeText(location.href).then(() => toast('Ссылка на заявку ' + o.id + ' скопирована'), () => toast('Заявка ' + o.id)); } catch (err) { toast('Заявка ' + o.id); } break;
    case 'save': if (S.saved[o.id]) { delete S.saved[o.id]; toast('Убрано из избранного'); } else { S.saved[o.id] = true; toast('Добавлено в избранное'); } store.set('saved', S.saved); renderDetail(); break;
    case 'profile': toast('Профиль компании ' + X.company + ' — в следующей итерации'); break;
    case 'chat': toast('Чат с ' + X.company + ' откроется здесь'); break;
    case 'jump': { detailEl.querySelectorAll('.dtabs .tab').forEach((t) => t.classList.toggle('on', t === b)); const s = $('d-' + b.dataset.to); if (s) s.scrollIntoView({ behavior: 'smooth', block: 'start' }); break; }
    case 'only': V.only = !V.only; renderDetail(); break;
    case 'map': V.map = !V.map; { const m = detailEl.querySelector('.map'); m.classList.toggle('open', V.map); b.setAttribute('aria-expanded', V.map); b.firstChild.textContent = V.map ? 'Скрыть карту' : 'Показать карту'; } break;
    case 'all': { const anyOpen = X.pts.some((p, i) => !V.closed[i]); X.pts.forEach((p, i) => { V.closed[i] = anyOpen; }); renderDetail(); const nb = detailEl.querySelector('[data-d="all"]'); if (nb) nb.focus(); break; }
    case 'stop': { const i = +b.dataset.i; V.closed[i] = !V.closed[i]; b.closest('.stop').classList.toggle('closed', V.closed[i]); b.setAttribute('aria-expanded', !V.closed[i]); { const xa = detailEl.querySelector('[data-d="all"]'); const anyOpen = X.pts.some((p, j) => !V.closed[j]); const t = anyOpen ? 'Свернуть все точки' : 'Раскрыть все точки'; if (xa) { xa.setAttribute('aria-label', t); xa.title = t; xa.innerHTML = anyOpen ? EXPAND_ALL : COLLAPSED_ALL; } } break; }
    case 'seg': V.seg = b.dataset.seg; if (V.seg === 'tariff') V.edit = false; renderDetail(); if (V.seg === 'counter') { const f = $('dOffer'); if (f) { f.focus(); f.select(); } } break;
    case 'pay': V.pay = !V.pay; b.closest('.pay').classList.toggle('closed', !V.pay); b.setAttribute('aria-expanded', V.pay); break;
    case 'vat': S.vat = !S.vat; renderDetail(); break;
    case 'info': showInfo(b); break;
    case 'odoc': { const i = +b.dataset.i; V.odocs[i] = !V.odocs[i]; b.closest('.doc').classList.toggle('open', V.odocs[i]); b.setAttribute('aria-expanded', V.odocs[i]); const ob = detailEl.querySelector('[data-d="oall"]'); if (ob) ob.outerHTML = oallBtn(); break; }
    case 'oall': { const anyOpen = Array.from({ length: ODOCS_N }, (x, i) => i).some((i) => V.odocs[i]); for (let i = 0; i < ODOCS_N; i++) V.odocs[i] = !anyOpen; renderDetail(); const nb = detailEl.querySelector('[data-d="oall"]'); if (nb) nb.focus(); break; }
    case 'doc': { const i = +b.dataset.i; V.docs[i] = !V.docs[i]; b.closest('.doc').classList.toggle('open', V.docs[i]); b.setAttribute('aria-expanded', V.docs[i]); break; }
    case 'geo': {
      const v = b.dataset.geo;
      const done = () => { b.classList.add('done'); showTip(b, 'Скопировано'); clearTimeout(b._t); b._t = setTimeout(() => { b.classList.remove('done'); hideInfo(); }, 1600); };
      try { navigator.clipboard.writeText(v).then(done, done); } catch (err) { done(); }
      break;
    }
    case 'take': S.taken[o.id] = true; renderDetail(); toast('Заявка ' + o.id + ' забронирована за вами'); break;
    case 'close': V.seg = 'tariff'; V.edit = false; V.offer = ''; renderDetail(); break;
    case 'edit': V.edit = true; renderDetail(); { const f = $('dOffer'); if (f) { f.focus(); f.select(); } } break;
    case 'send': {
      const f = $('dOffer'); const v = parseInt((f ? f.value : '').replace(/\s/g, ''), 10);
      if (!v || v <= 0) { toast('Введите сумму больше нуля'); if (f) f.focus(); return; }
      S.offers[o.id] = v; S.offerAt[o.id] = Date.now(); V.offer = ''; V.edit = false; renderDetail(); toast('Встречное предложение ' + money(v) + ' отправлено');
      break;
    }
  }
});
function showInfo(b) {
  const tip = $('navTip'); if (!tip) return;
  tip.textContent = EXTRAS[+b.dataset.i][2];
  tip.style.whiteSpace = 'normal'; tip.style.width = '280px'; tip.style.height = 'auto'; tip.style.fontSize = '12px'; tip.style.lineHeight = '16px'; tip.style.fontWeight = '400'; tip.style.padding = '8px 12px';
  const r = b.getBoundingClientRect();
  tip.style.left = Math.min(r.right + 12, window.innerWidth - 292) + 'px'; tip.style.top = (r.top + r.height / 2) + 'px';
  requestAnimationFrame(() => tip.classList.add('show'));
}
function showTip(el, text) {
  const tip = $('navTip'); if (!tip) return;
  tip.style.cssText = ''; tip.textContent = text;
  const ic = [...el.querySelectorAll('.gi')].find((x) => getComputedStyle(x).display !== 'none');
  const r = (ic || el).getBoundingClientRect();
  tip.style.left = Math.max(8, Math.min(r.right + 12, window.innerWidth - tip.offsetWidth - 8)) + 'px'; tip.style.top = (r.top + r.height / 2) + 'px';
  requestAnimationFrame(() => tip.classList.add('show'));
}
$('list').addEventListener('mouseover', (e) => { const g = e.target.closest('[data-act="copy"]'); if (g && !g.contains(e.relatedTarget)) showTip(g, g.classList.contains('done') ? 'Скопировано' : 'Скопировать'); });
$('list').addEventListener('mouseout', (e) => { const g = e.target.closest('[data-act="copy"]'); if (g && !g.contains(e.relatedTarget)) hideInfo(); });
detailEl.addEventListener('mouseover', (e) => { const g = e.target.closest('.geo'); if (g && !g.contains(e.relatedTarget)) showTip(g, g.classList.contains('done') ? 'Скопировано' : 'Скопировать'); });
detailEl.addEventListener('mouseout', (e) => { const g = e.target.closest('.geo'); if (g && !g.contains(e.relatedTarget)) hideInfo(); });
detailEl.addEventListener('focusin', (e) => { const g = e.target.closest('.geo'); if (g && g.matches(':focus-visible')) showTip(g, 'Скопировать'); });
detailEl.addEventListener('focusout', (e) => { if (e.target.closest('.geo')) hideInfo(); });
const hideInfo = () => { const tip = $('navTip'); if (!tip) return; tip.classList.remove('show'); setTimeout(() => { if (!tip.classList.contains('show')) { tip.style.cssText = ''; } }, 150); };
detailEl.addEventListener('mouseover', (e) => { const b = e.target.closest('.info'); if (b) showInfo(b); });
detailEl.addEventListener('mouseout', (e) => { if (e.target.closest('.info')) hideInfo(); });
detailEl.addEventListener('focusout', (e) => { if (e.target.closest('.info')) hideInfo(); });
window.addEventListener('scroll', hideInfo, { passive: true });
// scroll-spy: highlight the anchor tab of the section in view
let spyRaf = 0;
window.addEventListener('scroll', () => {
  if (V.id === null || spyRaf) return;
  spyRaf = requestAnimationFrame(() => {
    spyRaf = 0;
    const tabs = detailEl.querySelectorAll('.dtabs .tab'); if (!tabs.length) return;
    let cur = tabs[0].dataset.to;
    tabs.forEach((t) => { const sec = $('d-' + t.dataset.to); if (sec && sec.getBoundingClientRect().top <= 150) cur = t.dataset.to; });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) cur = tabs[tabs.length - 1].dataset.to;
    tabs.forEach((t) => t.classList.toggle('on', t.dataset.to === cur));
  });
}, { passive: true });
detailEl.addEventListener('input', (e) => { if (e.target.id === 'dOffer') { e.target.value = e.target.value.replace(/[^\d\s]/g, ''); V.offer = e.target.value; } });
detailEl.addEventListener('keydown', (e) => { if (e.target.id === 'dOffer' && e.key === 'Enter') { e.preventDefault(); detailEl.querySelector('[data-d="send"]').click(); } });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && V.id !== null && $('modal').hidden && !document.querySelector('.menu.open')) { if (history.state && history.state.order) history.back(); else hideDetail(true); } });
if (location.hash.length > 1) fromHash();

// Order page, desktop: hide the app header after a little scroll, the sticky «К грузам» bar replaces it
const dbar = document.createElement('div'); dbar.className = 'dbar'; dbar.setAttribute('aria-hidden', 'true'); document.body.appendChild(dbar);
const hdrSync = () => {
  const det = mainEl.classList.contains('is-detail') && window.innerWidth >= 768;
  const dh = det && document.querySelector('#detail .dhead');
  // swap only once the bar has reached the very top under the header, so nothing jumps
  const on = !!dh && window.scrollY > 0 && dh.getBoundingClientRect().top <= 0.5;
  document.body.classList.toggle('hdr-hide', on);
  if (on) dbar.style.left = mainEl.getBoundingClientRect().left + 'px';
};
window.addEventListener('scroll', hdrSync, { passive: true });
window.addEventListener('resize', hdrSync);
new MutationObserver(hdrSync).observe(mainEl, { attributes: true, attributeFilter: ['class'] });
