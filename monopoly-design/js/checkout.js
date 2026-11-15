/* Checkout page («Оформление заказа»): opened from «Забрать груз» as checkout.html?id=<order id>.
   Contract, payment method, rolling stock, extra services; the right panel totals everything. */
'use strict';

const CK_ILL = { fuel: 'assets/img/extras/fuel.svg', bonus: 'assets/img/extras/bonus.svg', ins: 'assets/img/extras/insurance.svg' };
// payment icons from the UI kit (assets/icons/pay-standard.svg, pay-fast.svg, pay-after-loading.svg), colours via tokens
const RUB = '<svg class="pico" width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true" style="display:block"><path class="pb" d="M33.0389 1.2265C35.9569 1.76595 38.2342 4.04325 38.7736 6.9612C39.5455 11.1368 40 15.5041 40 19.9998C40 24.4956 39.5455 28.8631 38.7735 33.0389C38.2341 35.9568 35.9568 38.2341 33.0389 38.7735C28.8631 39.5455 24.4956 40 19.9998 40C15.5041 40 11.1368 39.5455 6.9612 38.7736C4.04326 38.2342 1.76595 35.9569 1.2265 33.0389C0.454511 28.8632 0 24.4957 0 19.9998C0 15.5041 0.454476 11.1367 1.22641 6.96111C1.76584 4.04316 4.04316 1.76585 6.96111 1.22641C11.1367 0.454479 15.5041 0 19.9998 0C24.4957 0 28.8632 0.45451 33.0389 1.2265Z"/><path class="pf" d="M21.2695 12.9766C23.4792 12.9766 25.2705 14.7679 25.2705 16.9775C25.2705 19.1873 23.4793 20.9785 21.2695 20.9785H18.4102V21.9805H21.6982C22.2504 21.9806 22.6982 22.4283 22.6982 22.9805C22.6982 23.5327 22.2504 23.9804 21.6982 23.9805H18.4102V25.9805C18.4102 26.5328 17.9624 26.9805 17.4102 26.9805C16.858 26.9804 16.4102 26.5327 16.4102 25.9805V23.9805H15.6953C15.143 23.9805 14.6953 23.5328 14.6953 22.9805C14.6953 22.4282 15.143 21.9805 15.6953 21.9805H16.4102V20.9785H15.6953C15.143 20.9785 14.6953 20.5308 14.6953 19.9785C14.6954 19.4263 15.1431 18.9785 15.6953 18.9785H16.4102V13.9766C16.4102 13.4244 16.858 12.9767 17.4102 12.9766H21.2695ZM18.4102 18.9785H21.2695C22.3747 18.9785 23.2705 18.0827 23.2705 16.9775C23.2705 15.8724 22.3747 14.9766 21.2695 14.9766H18.4102V18.9785Z"/></svg>';
const BOLT = '<svg class="pico" width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true" style="display:block"><path class="pb" d="M33.0389 1.2265C35.9569 1.76595 38.2342 4.04325 38.7736 6.9612C39.5455 11.1368 40 15.5041 40 19.9998C40 24.4956 39.5455 28.8631 38.7735 33.0389C38.2341 35.9568 35.9568 38.2341 33.0389 38.7735C28.8631 39.5455 24.4956 40 19.9998 40C15.5041 40 11.1368 39.5455 6.9612 38.7736C4.04326 38.2342 1.76595 35.9569 1.2265 33.0389C0.454511 28.8632 0 24.4957 0 19.9998C0 15.5041 0.454476 11.1367 1.22641 6.96111C1.76584 4.04316 4.04316 1.76585 6.96111 1.22641C11.1367 0.454479 15.5041 0 19.9998 0C24.4957 0 28.8632 0.45451 33.0389 1.2265Z"/><path class="pf" d="M19.6045 11.3398C20.1522 10.5713 21.1634 10.2897 22.0293 10.665C22.8951 11.0405 23.3808 11.9705 23.1943 12.8955L22.416 16.748H24.9941C25.7435 16.7481 26.4297 17.1677 26.7725 17.834C27.115 18.5006 27.0563 19.3027 26.6201 19.9121L20.3545 28.6641C19.8059 29.4303 18.7971 29.71 17.9326 29.335C17.0682 28.9597 16.5826 28.0315 16.7676 27.1074L17.54 23.25H14.999C14.2504 23.2499 13.5647 22.8315 13.2217 22.166C12.8789 21.5006 12.9359 20.6995 13.3701 20.0898L19.6045 11.3398ZM14.999 21.25H19.9795L18.7285 27.5L24.9941 18.748H19.9727L21.2334 12.5L14.999 21.25Z"/></svg>';
const FAST = '<svg class="pico" width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true" style="display:block"><path class="pb" d="M33.0389 1.2265C35.9569 1.76595 38.2342 4.04325 38.7736 6.9612C39.5455 11.1368 40 15.5041 40 19.9998C40 24.4956 39.5455 28.8631 38.7735 33.0389C38.2341 35.9568 35.9568 38.2341 33.0389 38.7735C28.8631 39.5455 24.4956 40 19.9998 40C15.5041 40 11.1368 39.5455 6.9612 38.7736C4.04326 38.2342 1.76595 35.9569 1.2265 33.0389C0.454511 28.8632 0 24.4957 0 19.9998C0 15.5041 0.454476 11.1367 1.22641 6.96111C1.76584 4.04316 4.04316 1.76585 6.96111 1.22641C11.1367 0.454479 15.5041 0 19.9998 0C24.4957 0 28.8632 0.45451 33.0389 1.2265Z"/><g clip-path="url(#pay-load-clip)"><path class="pf" d="M25 12C25.5523 12 26 12.4477 26 13C26 13.5303 25.5873 13.9625 25.0654 13.9961L24.9258 14.3096C24.9823 14.3317 25.0388 14.3543 25.0947 14.3789C27.9345 15.6301 28.8488 19.6081 27.1367 23.2646L26.9707 23.6035C25.1946 27.0408 21.6446 28.8331 18.8936 27.6211C18.5244 27.4584 18.1882 27.2482 17.8857 27H19C19.552 26.9998 19.9998 26.552 20 26C20 25.9675 19.9982 25.935 19.9951 25.9033C20.6917 26.1187 21.5598 26.0388 22.5039 25.54C23.5684 24.9774 24.6212 23.9225 25.3066 22.459C25.9921 20.9952 26.1191 19.5316 25.8555 18.3838C25.5924 17.239 24.9806 16.5138 24.2471 16.1904C23.5134 15.8674 22.5472 15.8971 21.4854 16.458C21.3133 16.5489 21.1417 16.6531 20.9717 16.7695C20.9892 16.8436 21 16.9206 21 17C21 17.5523 20.5523 18 20 18H15C14.4478 17.9999 14 17.5522 14 17C14 16.4478 14.4478 16.0001 15 16H18.7949C20.0014 14.8388 21.4497 14.1294 22.8672 14.0166L22.8789 13.9912C22.3839 13.9312 22 13.5112 22 13C22 12.4478 22.4478 12.0001 23 12H25ZM18.0479 23.1162C18.069 23.2879 18.097 23.455 18.1338 23.6152C18.1674 23.7613 18.2065 23.9008 18.251 24.0332C18.6816 24.1447 19 24.5345 19 25C19 25.5523 18.5523 26 18 26H14C13.4478 25.9999 13 25.5522 13 25C13 24.4478 13.4478 24.0001 14 24H16.1504C16.0884 23.7138 16.0425 23.4187 16.0166 23.1162H18.0479ZM18.9619 18.999C18.8631 19.1724 18.7702 19.3531 18.6826 19.54C18.5956 19.7258 18.5205 19.9126 18.4512 20.0977C18.7882 20.2584 19.0215 20.6017 19.0215 21C19.0215 21.5523 18.5738 22 18.0215 22H13.0039C12.4516 22 12.0039 21.5523 12.0039 21C12.0039 20.4477 12.4516 20 13.0039 20H16.3672C16.4686 19.6663 16.59 19.332 16.7334 19H18.958C18.9591 19 18.9608 18.9992 18.9619 18.999ZM22.1113 18.1279C22.3171 17.6154 22.8996 17.3665 23.4121 17.5723C23.9244 17.778 24.1732 18.3597 23.9678 18.8721L23.5146 20H23.5684C24.1206 20.0001 24.5684 20.4478 24.5684 21C24.5683 21.5522 24.1206 21.9999 23.5684 22H22.0361C21.7043 22 21.394 21.8353 21.208 21.5605C21.0221 21.2856 20.9848 20.936 21.1084 20.6279L22.1113 18.1279Z"/></g><defs><clipPath id="pay-load-clip"><rect width="16" height="16" transform="translate(12 12)"/></clipPath></defs></svg>';
const CHECK_W = '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" style="display:block"><path d="M9.5 16.6 5.2 12.3a1 1 0 0 0-1.4 1.4l5 5a1 1 0 0 0 1.4 0l10-10a1 1 0 0 0-1.4-1.4l-9.3 9.3Z" fill="currentColor"/></svg>';
const CK_CHEV = '<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" style="display:block;flex-shrink:0"><path d="M8.11328 9.64453C8.50383 9.25432 9.13693 9.25411 9.52734 9.64453L12.0029 12.1211L14.4785 9.64551C14.869 9.255 15.503 9.25503 15.8936 9.64551C16.2838 10.036 16.2837 10.6691 15.8936 11.0596L12.7109 14.2422C12.3204 14.6324 11.6863 14.6326 11.2959 14.2422L8.11328 11.0586C7.72286 10.6682 7.72307 10.0351 8.11328 9.64453Z" fill="currentColor"/></svg>';

const FLEET = {
  truck: { label: 'Машина', items: ['А 778 РО 89 | Mercedes-Benz Actros', 'В 214 КМ 77 | Volvo FH', 'Е 532 ТТ 61 | MAN TGX', 'К 909 АА 23 | Scania R450'] },
  trailer: { label: 'Прицеп', items: ['АУ 4521 89 | Schmitz Cargobull', 'ВК 1187 77 | Krone Cool Liner', 'ЕН 3390 61 | Kögel Cargo'] },
  driver: { label: 'Водитель', items: ['Кусиков Михаил Сергеевич | В/У 23 УК 2111344 | 12.02.1988', 'Петров Андрей Викторович | В/У 77 ММ 4455120 | 03.07.1985', 'Сафин Ринат Ильдарович | В/У 16 ТК 9081776 | 21.11.1990'] },
};
const BONUS_BALANCE = 1000;
// contracts with this cargo owner (first step of the flow)
const contractsFor = (co) => ['01/21 №Д-1224.2021 (ООО «' + co + '»)', '07/23 №Д-3381.2023 (ООО «' + co + '»)'];
const PH = { contract: 'Выберите договор', truck: 'Выберите машину', trailer: 'Выберите прицеп', driver: 'Выберите водителя' };

const ckEl = $('ck');
const qid = new URLSearchParams(location.search).get('id');
const o = ALL.find((x) => x.id === qid) || ALL.find((x) => x.tags.length === 1 && x.tags[0] === 'Фикс') || ALL[0];
const X = orderInfo(o);
const OPTS = Object.assign({ contract: { label: 'Договор', items: contractsFor(X.company) } }, FLEET);
const theme = { get: () => store.get('theme', 'light') };
const C = {
  // step by step: contract → payment method → rolling stock (+ extras); everything starts empty
  vat: true, contract: null, pay: null, truck: null, trailer: null, driver: null,
  fuel: false, fuelSum: '', bonus: false, bonusSum: '', ins: false,
  done: !!store.get('taken', {})[o.id], open: null, tried: false, // tried: «Оформить» was pressed — empty required fields get highlighted
};

const money2 = (n) => (Math.round(n * 100) / 100).toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₽';
const num = (v) => { const n = parseInt(String(v).replace(/\D/g, ''), 10); return isNaN(n) ? 0 : n; };
const ckBase = () => o.price * (C.vat ? 1.22 : 1);
const PAYS = [
  { k: 'std', icon: RUB, title: 'Стандартная оплата', total: () => ckBase(), sub: () => 'Оплата через 15 дней' },
  { k: 'fast', icon: BOLT, title: 'Быстрая оплата', total: () => ckBase() * 0.95, sub: () => 'Оплата через 5 дней' },
  { k: 'load', icon: FAST, title: 'Оплата после погрузки', total: () => ckBase() * 0.97, sub: () => money2(ckBase() * 0.5) + ' сразу' },
];
const payTotal = () => (PAYS.find((p) => p.k === C.pay) || PAYS[0]).total();
const fleetDone = () => C.truck !== null && C.trailer !== null && C.driver !== null;
const ready = () => C.contract !== null && !!C.pay && fleetDone();
const seen = new Set(); // sections already shown — only a newly revealed one fades in
const reveal = (id) => { const n = !seen.has(id); seen.add(id); return n ? ' ck-new' : ''; };
const fuelMax = () => Math.floor(payTotal() * 0.9);
const insPremium = () => Math.max(149, Math.round(X.cargoValue * 0.0002));
if (C.fuelSum === '') C.fuelSum = String(Math.round(payTotal() * 0.3 / 1000) * 1000);

function totals() {
  const t = payTotal();
  const fuel = C.fuel ? Math.min(num(C.fuelSum), fuelMax()) : 0;
  const bonus = C.bonus ? Math.min(num(C.bonusSum), BONUS_BALANCE) : 0;
  const ins = C.ins ? insPremium() : 0;
  return { cost: t + bonus, account: t + bonus - fuel - ins, fuel, bonus, ins };
}

function selBtn(key, labelled) {
  const v = C[key];
  const miss = C.tried && v === null;
  return '<button type="button" class="inp ck-sel' + (miss ? ' err' : '') + '" data-c="sel" data-k="' + key + '" aria-haspopup="listbox" aria-expanded="' + (C.open === key) + '" ' + labelled + (miss ? ' aria-invalid="true"' : '') + '>' +
    (v === null ? '<span class="ph">' + PH[key] + '</span>' : '<span>' + esc(OPTS[key].items[v]) + '</span>') + CK_CHEV + '</button>';
}
const missHint = (key) => (C.tried && C[key] === null ? '<span class="ck-hint err ck-miss">Обязательное поле</span>' : '');


function selectHTML(key) {
  return '<div class="ck-field"><span class="ck-label" id="lbl-' + key + '">' + FLEET[key].label + '</span><div class="ck-row">' +
    selBtn(key, 'aria-labelledby="lbl-' + key + '"') +
    '<button type="button" class="ck-out" data-c="edit" data-k="' + key + '">Редактировать</button></div>' + missHint(key) + '</div>';
}

function extraHTML(k, title, desc, on, body) {
  return '<div class="ck-x' + (on ? ' on' : '') + '"><img src="' + CK_ILL[k] + '" alt=""><div class="ck-xb">' +
    '<div class="ck-xh"><b>' + title + '<button type="button" class="info" data-c="info" data-k="' + k + '" aria-label="Подробнее: ' + title + '">' + INFO + '</button></b>' +
    '<button type="button" class="ck-sw" data-c="sw" data-k="' + k + '" role="switch" aria-checked="' + on + '" aria-label="' + title + '"><span class="sw lg' + (on ? ' on' : '') + '"></span></button></div>' +
    '<p class="ck-xd">' + desc + '</p>' + (on ? body : '') + '</div></div>';
}

function panelHTML() {
  const t = totals();
  return '<div class="dcard ck-panel"><div class="ck-pin">' +
    '<div class="ck-cost"><small>Стоимость перевозки</small><b>' + money2(t.cost) + '</b></div>' +
    '<div class="ck-rows"><div><span>Сумма на р/с</span><b>' + money2(t.account) + '</b></div>' +
    (C.fuel ? '<div><span>Топливо после погрузки</span><b>' + money2(t.fuel) + '</b></div>' : '') +
    (C.bonus && t.bonus ? '<div><span>Бонусы</span><b>+' + money2(t.bonus) + '</b></div>' : '') +
    (C.ins ? '<div><span>Страховая премия</span><b>−' + money2(t.ins) + '</b></div>' : '') + '</div>' +
    (C.done ? '<button type="button" class="ck-go done" disabled>Заявка оформлена</button>'
      : '<button type="button" class="ck-go" data-c="submit">Оформить заявку</button>') +
    '</div><div class="pnote">Цены указаны <button type="button" data-c="vat">' + (C.vat ? 'с учётом НДС 22%' : 'без НДС') + CK_CHEV + '</button></div></div>';
}

function render() {
  const t = totals();
  const pay = PAYS.map((p) => '<button type="button" class="ck-pay" data-c="pay" data-k="' + p.k + '" role="radio" aria-checked="' + (C.pay === p.k) + '">' +
    '<span class="ck-pi">' + p.icon + '</span><span class="ck-radio">' + CHECK_W + '</span>' +
    '<span class="ck-pt">' + p.title + '</span><b>' + money2(p.total()) + '</b><span class="ck-ps">' + p.sub() + '</span></button>').join('');
  const fuelErr = C.fuel && num(C.fuelSum) > fuelMax();
  const bonusErr = C.bonus && num(C.bonusSum) > BONUS_BALANCE;
  const mpt = (k, city, day, key) => '<div class="mpt ' + k + '"><i></i><span><span class="c">' + esc(city) + '</span><span class="w">' + winHTML(day, key) + '</span></span></div>';
  let h = '';
  h += '<div class="ck-head phead"><button type="button" class="dback" data-c="back">' + DI.back + 'Оформление заказа ' + o.id + '</button></div>';
  h += '<div class="ck-grid"><div class="ck-l">';
  // summary — same block as on the order page
  h += '<section class="dcard dsum" aria-label="Заявка ' + o.id + '">' +
    '<div class="mdsum"><div class="mdtop"><h2>' + o.id + '</h2><div class="minis"><span class="mini" data-tip="Заявку просматривали">' + sqb(SQ_B, 'sqmB') + EYE16 + X.views + '</span><span class="mini" data-tip="Рейтинг заявки">' + sqb(SQ_B, 'sqmB') + I.star + X.oRating + '</span></div></div>' +
    '<div class="mroute">' + mpt('ld', o.from, o.fromDay, o.id + 'f') + (o.stops ? '<div class="mstops"><i></i><span>+' + o.stops + ' ' + stopsWord(o.stops) + ' в рейсе</span></div>' : '') + mpt('ul', o.to, o.toDay, o.id + 't') + '</div></div>' +
    '<div class="rbox"><div><div class="c">' + esc(o.from) + '</div><div class="w">' + winHTML(o.fromDay, o.id + 'f') + '</div></div>' +
    '<div class="mid2"><div class="arr2">' + DI.arrS + (o.stops ? '<span class="plus2" title="Промежуточные точки">+' + o.stops + '</span>' : '<span class="plus2" title="Без промежуточных точек" aria-label="Без промежуточных точек">—</span>') + DI.arrS + '</div><span class="km2">' + nf(o.dist) + ' км</span></div>' +
    '<div class="end"><div class="c">' + esc(o.to) + '</div><div class="w">' + winHTML(o.toDay, o.id + 't') + '</div></div></div>' +
    '<div class="co"><span class="ava" aria-hidden="true">' + X.ini + '</span><span class="coname"><b>' + esc(X.company) + '</b><button type="button" data-c="soon">Профиль компании</button></span>' +
    '<div class="minis"><button type="button" class="mini" data-c="soon" data-tip="Начать чат с грузовладельцем" aria-label="Чат с ' + esc(X.company) + '">' + sqb(SQ_B, 'sqmB') + '<span class="chat">' + DI.chat + '</span>Чат</button>' +
    '<span class="mini" data-tip="Рейтинг грузовладельца">' + sqb(SQ_B, 'sqmB') + I.star + o.rating + '</span></div><span class="vsep" aria-hidden="true"></span>' +
    '<div class="minis"><span class="mini" data-tip="Заявку просматривали">' + sqb(SQ_B, 'sqmB') + EYE16 + X.views + '</span><span class="mini" data-tip="Рейтинг заявки">' + sqb(SQ_B, 'sqmB') + I.star + X.oRating + '</span></div></div></section>';
  // anchor tabs — only once there is more than one section to jump between
  const secs = [['ck-pay', 'Договор и оплата']].concat(C.pay ? [['ck-fleet', 'Подвижной состав']] : [], C.pay ? [['ck-extra', 'Дополнительно']] : []);
  if (secs.length > 1) h += '<div class="dtabs" role="tablist" aria-label="Разделы оформления">' +
    secs.map((x, i) => '<button type="button" class="tab' + (i === 0 ? ' on' : '') + '" data-c="tab" data-k="' + x[0] + '">' + x[1] + '</button>').join('') + '</div>';
  // step 1: contract → step 2: payment method
  h += '<section class="dcard dsec" id="ck-pay"><h2 id="lbl-contract">Заказ выполняется в рамках договора</h2>' + '<div class="ck-field">' + selBtn('contract', 'aria-labelledby="lbl-contract"') + missHint('contract') + '</div>' +
    (C.contract === null ? '' : '<div class="ck-step2' + reveal('pay') + '"><h2 class="ck-h2b">Выберите способ оплаты</h2><p class="ck-note">Срок получения оплаты или остатка — не позднее указанного количества рабочих дней с даты получения документов, подтверждающих перевозку.</p>' +
    '<div class="ck-paywrap"><div class="ck-pays' + (C.tried && !C.pay ? ' err' : '') + '" role="radiogroup" aria-label="Способ оплаты"' + (C.tried && !C.pay ? ' aria-invalid="true"' : '') + '>' + pay + '</div>' + (C.tried && !C.pay ? '<span class="ck-hint err ck-miss">Выберите способ оплаты</span>' : '') + '</div></div>') + '</section>';
  // step 3: rolling stock
  if (C.pay) h += '<section class="dcard dsec' + reveal('fleet') + '" id="ck-fleet"><h2>Укажите подвижной состав</h2><div class="ck-fleet">' + selectHTML('truck') + selectHTML('trailer') + selectHTML('driver') + '</div></section>';
  // extras — appear together with the rolling stock
  if (C.pay) h += '<section class="dcard dsec' + reveal('extra') + '" id="ck-extra"><h2>Дополнительно в заявке</h2><div class="ck-xs">' +
    // same order and texts as «Дополнительно» on the order page (EXTRAS in data.js)
    extraHTML('fuel', EXTRAS[0][0], EXTRAS[0][1], C.fuel,
      '<p class="ck-terms">Услуга «Топливо после погрузки» будет оказана в рамках договора Д-10881.2021 от 14.09.2021 (с покупателем)</p>' +
      '<label class="ck-field"><span class="ck-label">Сумма для «Топлива после погрузки», ₽</span><input class="inp ck-inp' + (fuelErr ? ' err' : '') + '" data-c="fuelSum" inputmode="numeric" value="' + (C.fuelSum ? nf(num(C.fuelSum)) : '') + '"' + (C.fuel ? '' : ' disabled') + '>' +
      '<span class="ck-hint' + (fuelErr ? ' err' : '') + '">Не более 90% — ' + money2(fuelMax()) + '</span></label>') +
    extraHTML('ins', EXTRAS[1][0], EXTRAS[1][1], C.ins,
      '<p class="ck-txt">Сумма страховой премии будет вычтена из общей стоимости заявки. Ознакомьтесь с <a href="#" data-c="soon">условиями</a> и <a href="#" data-c="soon">правилами страхования</a>. По вопросам страхования: <a href="mailto:monopoly.online@renins.com">monopoly.online@renins.com</a>.</p>' +
      '<div class="ck-dots"><b>Страховая сумма</b><i></i><b>' + money2(X.cargoValue) + '</b></div>' +
      '<div class="ck-dots"><b>Страховая премия</b><i></i><b>' + nf(insPremium()) + ' ₽</b></div>') +
    extraHTML('bonus', EXTRAS[2][0], EXTRAS[2][1], C.bonus,
      '<div class="ck-dots"><b>На вашем счету</b><i></i><b>' + nf(BONUS_BALANCE) + ' бонусов</b></div>' +
      '<label class="ck-field"><span class="ck-label">Сумма для списания бонусов</span><input class="inp ck-inp' + (bonusErr ? ' err' : '') + '" data-c="bonusSum" inputmode="numeric" placeholder="0" value="' + (C.bonusSum ? nf(num(C.bonusSum)) : '') + '"' + (C.bonus ? '' : ' disabled') + '>' +
      (bonusErr ? '<span class="ck-hint err">Не больше ' + nf(BONUS_BALANCE) + ' бонусов</span>' : '') + '</label>') +
    '</div></section>';
  h += '</div>';
  h += '<aside class="ck-r">' + panelHTML() + '</aside>';
  h += '</div>';
  ckEl.innerHTML = h;
  document.title = 'Оформление заказа ' + o.id + ' — Монополия';
}

// ---------- dropdown for rolling stock ----------
const ckMenu = document.createElement('div'); ckMenu.className = 'menu'; ckMenu.setAttribute('role', 'listbox'); document.body.appendChild(ckMenu);
// under the field, or above it when there is no room below
function placeSel(btn) {
  const r = btn.getBoundingClientRect(); const h = ckMenu.offsetHeight;
  ckMenu.style.left = r.left + 'px'; ckMenu.style.width = r.width + 'px';
  ckMenu.style.top = (window.innerHeight - r.bottom < h + 12 && r.top > h + 12 ? r.top - h - 4 : r.bottom + 4) + 'px';
}
function openSel(btn) {
  const key = btn.dataset.k; C.open = key; btn.setAttribute('aria-expanded', 'true'); btn.classList.add('open');
  ckMenu.innerHTML = OPTS[key].items.map((x, i) => '<button type="button" class="mi" role="option" data-i="' + i + '" aria-selected="' + (C[key] === i) + '">' + esc(x) + '</button>').join('');
  ckMenu.classList.add('open'); placeSel(btn); (ckMenu.querySelector('[aria-selected="true"]') || ckMenu.firstChild).focus();
}
function closeSel() {
  if (!C.open) return; const b = ckEl.querySelector('.ck-sel[data-k="' + C.open + '"]');
  if (b) { b.setAttribute('aria-expanded', 'false'); b.classList.remove('open'); }
  C.open = null; ckMenu.classList.remove('open');
}
ckMenu.addEventListener('click', (e) => {
  const it = e.target.closest('.mi'); if (!it) return; e.stopPropagation();
  const key = C.open; C[key] = +it.dataset.i; closeSel(); render(); const b = ckEl.querySelector('.ck-sel[data-k="' + key + '"]'); if (b) b.focus();
});
ckMenu.addEventListener('keydown', (e) => {
  const all = Array.from(ckMenu.querySelectorAll('.mi')); const i = all.indexOf(document.activeElement);
  if (e.key === 'ArrowDown') { e.preventDefault(); (all[i + 1] || all[0]).focus(); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); (all[i - 1] || all[all.length - 1]).focus(); }
  else if (e.key === 'Escape' || e.key === 'Tab') { const k = C.open; closeSel(); const b = ckEl.querySelector('.ck-sel[data-k="' + k + '"]'); if (b) b.focus(); }
});
document.addEventListener('click', (e) => { if (C.open && !ckMenu.contains(e.target)) closeSel(); });
window.addEventListener('scroll', () => { if (!C.open) return; const b = ckEl.querySelector('.ck-sel[data-k="' + C.open + '"]'); if (b) placeSel(b); }, { passive: true });
window.addEventListener('resize', closeSel);

// ---------- events ----------
const goBack = () => { if (document.referrer && new URL(document.referrer, location.href).origin === location.origin && history.length > 1) history.back(); else location.href = 'index.html#' + encodeURIComponent(o.id); };
ckEl.addEventListener('click', (e) => {
  const b = e.target.closest('[data-c]'); if (!b) return;
  switch (b.dataset.c) {
    case 'back': goBack(); break;
    case 'pay': {
      C.pay = b.dataset.k; if (num(C.fuelSum) > fuelMax()) C.fuelSum = String(fuelMax()); render();
      const nb = ckEl.querySelector('.ck-pay[data-k="' + C.pay + '"]'); if (nb) nb.focus({ preventScroll: true });
      // bring the next step (rolling stock) into view
      const next = $('ck-fleet'); if (next) requestAnimationFrame(() => next.scrollIntoView({ behavior: 'smooth', block: 'start' }));
      break;
    }
    case 'sel': e.stopPropagation(); if (C.open === b.dataset.k) closeSel(); else { closeSel(); openSel(b); } break;
    case 'edit': toast('Редактирование «' + FLEET[b.dataset.k].label.toLowerCase() + '» — в следующей итерации'); break;
    case 'sw': { const k = b.dataset.k; C[k] = !C[k]; render(); const nb = ckEl.querySelector('.ck-sw[data-k="' + k + '"]'); if (nb) nb.focus(); if (C[k] && k !== 'ins') { const inp = ckEl.querySelector('[data-c="' + k + 'Sum"]'); if (inp) inp.focus(); } break; }
    case 'info': showInfo(b); break;
    case 'tab': { const s = $(b.dataset.k); if (s) s.scrollIntoView({ behavior: 'smooth', block: 'start' }); break; }
    case 'vat': C.vat = !C.vat; render(); break;
    case 'soon': e.preventDefault(); toast('Раздел появится в следующей итерации'); break;
    case 'submit': {
      const t = totals();
      if (!ready()) { // highlight what is still empty and bring the first one into view
        C.tried = true; render();
        const first = ckEl.querySelector('.ck-sel.err, .ck-pays.err');
        if (first) { first.scrollIntoView({ behavior: 'smooth', block: 'center' }); (first.matches('.ck-pays') ? first.querySelector('.ck-pay') : first).focus({ preventScroll: true }); }
        break;
      }
      if (C.fuel && num(C.fuelSum) > fuelMax()) { toast('Сумма «Топлива после погрузки» — не больше 90% стоимости'); ckEl.querySelector('[data-c="fuelSum"]').focus(); break; }
      if (C.bonus && num(C.bonusSum) > BONUS_BALANCE) { toast('Столько бонусов нет на счету'); ckEl.querySelector('[data-c="bonusSum"]').focus(); break; }
      const tk = store.get('taken', {}); tk[o.id] = true; store.set('taken', tk);
      location.href = 'success.html?id=' + encodeURIComponent(o.id);
      break;
    }
  }
});
ckEl.addEventListener('input', (e) => {
  const inp = e.target.closest('.ck-inp'); if (!inp) return;
  const key = inp.dataset.c; const digits = inp.value.replace(/\D/g, '').slice(0, 9);
  C[key] = digits;
  const pos = inp.value.length - inp.selectionStart; inp.value = digits ? nf(+digits) : ''; const p = Math.max(0, inp.value.length - pos); inp.setSelectionRange(p, p);
  // update only the totals + error state, keep focus in the field
  const err = key === 'fuelSum' ? C.fuel && num(digits) > fuelMax() : C.bonus && num(digits) > BONUS_BALANCE;
  inp.classList.toggle('err', err);
  const hint = inp.parentNode.querySelector('.ck-hint'); if (hint && key === 'fuelSum') hint.classList.toggle('err', err);
  ckEl.querySelector('.ck-r').innerHTML = panelHTML();
});
// info tooltips on extras — same tooltip as on the order page
const INFO_TXT = { fuel: EXTRAS[0][2], ins: EXTRAS[1][2], bonus: EXTRAS[2][2] };
function showInfo(b) {
  const tip = $('navTip'); if (!tip) return;
  tip.textContent = INFO_TXT[b.dataset.k];
  tip.style.whiteSpace = 'normal'; tip.style.width = '280px'; tip.style.height = 'auto'; tip.style.fontSize = '12px'; tip.style.lineHeight = '16px'; tip.style.fontWeight = '400'; tip.style.padding = '8px 12px';
  const r = b.getBoundingClientRect();
  tip.style.left = Math.min(r.right + 12, window.innerWidth - 292) + 'px'; tip.style.top = (r.top + r.height / 2) + 'px';
  requestAnimationFrame(() => tip.classList.add('show'));
}
const hideInfo = () => { const tip = $('navTip'); if (!tip) return; tip.classList.remove('show'); setTimeout(() => { if (!tip.classList.contains('show')) tip.style.cssText = ''; }, 150); };
ckEl.addEventListener('mouseover', (e) => { const b = e.target.closest('.info'); if (b && !b.contains(e.relatedTarget)) showInfo(b); });
ckEl.addEventListener('mouseout', (e) => { const b = e.target.closest('.info'); if (b && !b.contains(e.relatedTarget)) hideInfo(); });
ckEl.addEventListener('focusin', (e) => { const b = e.target.closest('.info'); if (b && b.matches(':focus-visible')) showInfo(b); });
ckEl.addEventListener('focusout', (e) => { if (e.target.closest('.info')) hideInfo(); });
window.addEventListener('scroll', hideInfo, { passive: true });
// small stat chips (views, ratings): tooltip with their meaning
ckEl.addEventListener('mouseover', (e) => {
  const t = e.target.closest('[data-tip]'); if (!t || t.contains(e.relatedTarget)) return;
  const tip = $('navTip'); if (!tip) return;
  tip.style.cssText = ''; tip.textContent = t.dataset.tip;
  const r = t.getBoundingClientRect();
  tip.style.left = Math.max(8, Math.min(r.right + 12, window.innerWidth - tip.offsetWidth - 8)) + 'px'; tip.style.top = (r.top + r.height / 2) + 'px';
  requestAnimationFrame(() => tip.classList.add('show'));
});
ckEl.addEventListener('mouseout', (e) => { const t = e.target.closest('[data-tip]'); if (t && !t.contains(e.relatedTarget)) hideInfo(); });

// anchor tabs follow the scroll
window.addEventListener('scroll', () => {
  const ids = ['ck-pay', 'ck-fleet', 'ck-extra']; let cur = ids[0];
  ids.forEach((id) => { const s = $(id); if (s && s.getBoundingClientRect().top < 140) cur = id; });
  ckEl.querySelectorAll('.dtabs .tab').forEach((t) => t.classList.toggle('on', t.dataset.k === cur));
}, { passive: true });

// ---------- shell: theme, side menu, phone header ----------
let navOpen = window.matchMedia('(min-width:1920px)').matches;
function chrome() {
  const dark = theme.get() === 'dark';
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  $('themeSw').classList.toggle('on', dark); $('themeBtn').setAttribute('aria-checked', dark); $('themeBtnM').setAttribute('aria-checked', dark);
  $('side').classList.toggle('open', navOpen); $('navBtn').setAttribute('aria-expanded', navOpen); $('navBtn').setAttribute('aria-label', navOpen ? 'Свернуть меню' : 'Развернуть меню');
}
const flip = () => { store.set('theme', theme.get() === 'dark' ? 'light' : 'dark'); chrome(); };
$('themeBtn').addEventListener('click', flip); $('themeBtnM').addEventListener('click', flip);
$('navBtn').addEventListener('click', () => { navOpen = !navOpen; chrome(); });
document.querySelector('.mbk').addEventListener('click', goBack);
$('mSub').addEventListener('click', () => toast('Подписка на поиск — на странице «Поиск грузов»'));
let tt;
function toast(msg) { const t = $('toast'); t.textContent = msg; t.hidden = false; t.style.animation = 'none'; void t.offsetWidth; t.style.animation = ''; clearTimeout(tt); tt = setTimeout(() => { t.hidden = true; }, 2600); }

chrome();
render();
// sticky page head (component) — same behaviour as on the order page
initPageHead(() => ckEl.querySelector('.phead'), () => true)();
