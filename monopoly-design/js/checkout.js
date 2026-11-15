/* Checkout page («Оформление заказа»): opened from «Забрать груз» as checkout.html?id=<order id>.
   Contract, payment method, rolling stock, extra services; the right panel totals everything. */
'use strict';

const CK_ILL = { fuel: 'assets/img/extras/fuel.png', bonus: 'assets/img/extras/bonus.png', ins: 'assets/img/extras/insurance.png' };
const RUB = '<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" style="display:block"><path d="M9 4h5a5 5 0 0 1 0 10h-4v2h5a1 1 0 1 1 0 2h-5v2a1 1 0 1 1-2 0v-2H7a1 1 0 1 1 0-2h1v-2H7a1 1 0 1 1 0-2h1V5a1 1 0 0 1 1-1Zm1 8h4a3 3 0 0 0 0-6h-4v6Z" fill="currentColor"/></svg>';
const BOLT = '<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" style="display:block"><path d="M13.6 2.2a1 1 0 0 1 .6 1.06L13.18 10H19a1 1 0 0 1 .78 1.63l-8 10a1 1 0 0 1-1.77-.79L11.03 14H5a1 1 0 0 1-.78-1.63l8-10a1 1 0 0 1 1.38-.17ZM7.08 12H12.2a1 1 0 0 1 .99 1.15l-.55 3.63L16.92 12H12a1 1 0 0 1-.99-1.15l.55-3.63L7.08 12Z" fill="currentColor"/></svg>';
const FAST = '<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" style="display:block"><path d="M15 5a7 7 0 1 1-6.33 10H4a1 1 0 1 1 0-2h4.07a7 7 0 0 1 0-2H6a1 1 0 1 1 0-2h2.67A7 7 0 0 1 15 5Zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 1.5a1 1 0 0 1 1 1v2.09l1.2 1.2a1 1 0 0 1-1.4 1.42l-1.5-1.5A1 1 0 0 1 14 12V9.5a1 1 0 0 1 1-1ZM3 7h3a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2Z" fill="currentColor"/></svg>';
const CHECK_W = '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" style="display:block"><path d="M9.5 16.6 5.2 12.3a1 1 0 0 0-1.4 1.4l5 5a1 1 0 0 0 1.4 0l10-10a1 1 0 0 0-1.4-1.4l-9.3 9.3Z" fill="currentColor"/></svg>';
const CK_CHEV = '<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" style="display:block;flex-shrink:0"><path d="M8.11328 9.64453C8.50383 9.25432 9.13693 9.25411 9.52734 9.64453L12.0029 12.1211L14.4785 9.64551C14.869 9.255 15.503 9.25503 15.8936 9.64551C16.2838 10.036 16.2837 10.6691 15.8936 11.0596L12.7109 14.2422C12.3204 14.6324 11.6863 14.6326 11.2959 14.2422L8.11328 11.0586C7.72286 10.6682 7.72307 10.0351 8.11328 9.64453Z" fill="currentColor"/></svg>';

const FLEET = {
  truck: { label: 'Машина', items: ['А 778 РО 89 | Mercedes-Benz Actros', 'В 214 КМ 77 | Volvo FH', 'Е 532 ТТ 61 | MAN TGX', 'К 909 АА 23 | Scania R450'] },
  trailer: { label: 'Прицеп', items: ['АУ 4521 89 | Schmitz Cargobull', 'ВК 1187 77 | Krone Cool Liner', 'ЕН 3390 61 | Kögel Cargo'] },
  driver: { label: 'Водитель', items: ['Кусиков Михаил Сергеевич | В/У 23 УК 2111344 | 12.02.1988', 'Петров Андрей Викторович | В/У 77 ММ 4455120 | 03.07.1985', 'Сафин Ринат Ильдарович | В/У 16 ТК 9081776 | 21.11.1990'] },
};
const BONUS_BALANCE = 1000;

const ckEl = $('ck');
const qid = new URLSearchParams(location.search).get('id');
const o = ALL.find((x) => x.id === qid) || ALL.find((x) => x.tags.length === 1 && x.tags[0] === 'Фикс') || ALL[0];
const X = orderInfo(o);
const theme = { get: () => store.get('theme', 'light') };
const C = {
  vat: true, pay: 'fast', truck: 0, trailer: 0, driver: 0,
  fuel: true, fuelSum: '', bonus: false, bonusSum: '', ins: false,
  done: !!store.get('taken', {})[o.id], open: null,
};

const money2 = (n) => (Math.round(n * 100) / 100).toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₽';
const num = (v) => { const n = parseInt(String(v).replace(/\D/g, ''), 10); return isNaN(n) ? 0 : n; };
const ckBase = () => o.price * (C.vat ? 1.22 : 1);
const PAYS = [
  { k: 'std', icon: RUB, title: 'Стандартная оплата', total: () => ckBase(), sub: () => 'Оплата через 15 дней' },
  { k: 'fast', icon: BOLT, title: 'Быстрая оплата', total: () => ckBase() * 0.95, sub: () => 'Оплата через 5 дней' },
  { k: 'load', icon: FAST, title: 'Оплата после погрузки', total: () => ckBase() * 0.97, sub: () => money2(ckBase() * 0.5) + ' сразу' },
];
const payTotal = () => PAYS.find((p) => p.k === C.pay).total();
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

function selectHTML(key) {
  const f = FLEET[key];
  return '<div class="ck-field"><span class="ck-label" id="lbl-' + key + '">' + f.label + '</span><div class="ck-row">' +
    '<button type="button" class="ck-sel" data-c="sel" data-k="' + key + '" aria-haspopup="listbox" aria-expanded="' + (C.open === key) + '" aria-labelledby="lbl-' + key + '"><span>' + esc(f.items[C[key]]) + '</span>' + CK_CHEV + '</button>' +
    '<button type="button" class="ck-out" data-c="edit" data-k="' + key + '">Редактировать</button></div></div>';
}

function extraHTML(k, title, desc, on, body) {
  return '<div class="ck-x' + (on ? ' on' : '') + '"><img src="' + CK_ILL[k] + '" alt=""><div class="ck-xb">' +
    '<div class="ck-xh"><b>' + title + '<button type="button" class="info" data-c="info" data-k="' + k + '" aria-label="Подробнее: ' + title + '">' + INFO + '</button></b>' +
    '<button type="button" class="ck-sw" data-c="sw" data-k="' + k + '" role="switch" aria-checked="' + on + '" aria-label="' + title + '"><span class="sw' + (on ? ' on' : '') + '"></span></button></div>' +
    '<p class="ck-xd">' + desc + '</p>' + body + '</div></div>';
}

function panelHTML() {
  const t = totals();
  return '<div class="dcard ck-panel"><div class="ck-pin">' +
    '<div class="ck-cost"><small>Стоимость перевозки</small><b>' + money2(t.cost) + '</b></div>' +
    '<div class="ck-rows"><div><span>Сумма на р/с</span><b>' + money2(t.account) + '</b></div>' +
    (C.fuel ? '<div><span>Топливо после погрузки</span><b>' + money2(t.fuel) + '</b></div>' : '') +
    (C.bonus && t.bonus ? '<div><span>Бонусы</span><b>+' + money2(t.bonus) + '</b></div>' : '') +
    (C.ins ? '<div><span>Страховая премия</span><b>−' + money2(t.ins) + '</b></div>' : '') + '</div>' +
    (C.done ? '<button type="button" class="ck-go done" disabled>Заявка оформлена</button>' : '<button type="button" class="ck-go" data-c="submit">Оформить заявку</button>') +
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
  h += '<div class="ck-head"><button type="button" class="dback" data-c="back">' + DI.back + 'Оформление заказа ' + o.id + '</button></div>';
  h += '<div class="ck-grid"><div class="ck-l">';
  // summary — same block as on the order page
  h += '<section class="dcard dsum" aria-label="Заявка ' + o.id + '">' +
    '<div class="mdsum"><div class="mdtop"><h2>' + o.id + '</h2><div class="minis"><span class="mini" title="Просмотры заявки">' + sqb(SQ_B, 'sqmB') + EYE16 + X.views + '</span><span class="mini" title="Рейтинг заявки">' + sqb(SQ_B, 'sqmB') + I.star + X.oRating + '</span></div></div>' +
    '<div class="mroute">' + mpt('ld', o.from, o.fromDay, o.id + 'f') + (o.stops ? '<div class="mstops"><i></i><span>+' + o.stops + ' ' + stopsWord(o.stops) + ' в рейсе</span></div>' : '') + mpt('ul', o.to, o.toDay, o.id + 't') + '</div></div>' +
    '<div class="rbox"><div><div class="c">' + esc(o.from) + '</div><div class="w">' + winHTML(o.fromDay, o.id + 'f') + '</div></div>' +
    '<div class="mid2"><div class="arr2">' + DI.arrS + (o.stops ? '<span class="plus2">+' + o.stops + '</span>' : '') + DI.arrS + '</div><span class="km2">' + nf(o.dist) + ' км</span></div>' +
    '<div class="end"><div class="c">' + esc(o.to) + '</div><div class="w">' + winHTML(o.toDay, o.id + 't') + '</div></div></div>' +
    '<div class="co"><span class="ava" aria-hidden="true">' + X.ini + '</span><span class="coname"><b>' + esc(X.company) + '</b><button type="button" data-c="soon">Профиль компании</button></span>' +
    '<div class="minis"><button type="button" class="mini" data-c="soon" aria-label="Чат с ' + esc(X.company) + '">' + sqb(SQ_B, 'sqmB') + '<span class="chat">' + DI.chat + '</span>Чат</button>' +
    '<span class="mini" title="Рейтинг компании">' + sqb(SQ_B, 'sqmB') + I.star + o.rating + '</span></div><span class="vsep" aria-hidden="true"></span>' +
    '<div class="minis"><span class="mini" title="Просмотры заявки">' + sqb(SQ_B, 'sqmB') + EYE16 + X.views + '</span><span class="mini" title="Рейтинг заявки">' + sqb(SQ_B, 'sqmB') + I.star + X.oRating + '</span></div></div></section>';
  // anchor tabs
  h += '<div class="dtabs" role="tablist" aria-label="Разделы оформления">' +
    [['ck-pay', 'Договор и оплата'], ['ck-fleet', 'Подвижной состав'], ['ck-extra', 'Дополнительно']].map((x, i) => '<button type="button" class="tab' + (i === 0 ? ' on' : '') + '" data-c="tab" data-k="' + x[0] + '">' + x[1] + '</button>').join('') + '</div>';
  // contract + payment
  h += '<section class="dcard dsec" id="ck-pay"><h2>Заказ выполняется в рамках договора</h2>' +
    '<div class="ck-sel dis" aria-disabled="true"><span>01/21 №Д-1224.2021 (ООО «' + esc(X.company) + '»)</span>' + CK_CHEV + '</div>' +
    '<h2 class="ck-h2b">Выберите способ оплаты</h2><p class="ck-note">Срок получения оплаты или остатка — не позднее указанного количества рабочих дней с даты получения документов, подтверждающих перевозку.</p>' +
    '<div class="ck-pays" role="radiogroup" aria-label="Способ оплаты">' + pay + '</div></section>';
  // rolling stock
  h += '<section class="dcard dsec" id="ck-fleet"><h2>Укажите подвижной состав</h2><div class="ck-fleet">' + selectHTML('truck') + selectHTML('trailer') + selectHTML('driver') + '</div></section>';
  // extras
  h += '<section class="dcard dsec" id="ck-extra"><h2>Дополнительно в заявке</h2><div class="ck-xs">' +
    extraHTML('fuel', 'Топливо после погрузки', 'До 90% от стоимости заявки — сразу на Моносчёт', C.fuel,
      '<p class="ck-terms">Услуга «Топливо после погрузки» будет оказана в рамках договора Д-10881.2021 от 14.09.2021 (с покупателем)</p>' +
      '<label class="ck-field"><span class="ck-label">Сумма для «Топлива после погрузки», ₽</span><input class="ck-inp' + (fuelErr ? ' err' : '') + '" data-c="fuelSum" inputmode="numeric" value="' + (C.fuelSum ? nf(num(C.fuelSum)) : '') + '"' + (C.fuel ? '' : ' disabled') + '>' +
      '<span class="ck-hint' + (fuelErr ? ' err' : '') + '">Не более 90% — ' + money2(fuelMax()) + '</span></label>') +
    extraHTML('bonus', 'Бонусы', 'Вы можете потратить накопленные бонусы, увеличив стоимость заявки по курсу 1 бонус = 1 ₽.', C.bonus,
      '<div class="ck-dots"><b>На вашем счету</b><i></i><b>' + nf(BONUS_BALANCE) + ' бонусов</b></div>' +
      '<label class="ck-field"><span class="ck-label">Сумма для списания бонусов</span><input class="ck-inp' + (bonusErr ? ' err' : '') + '" data-c="bonusSum" inputmode="numeric" placeholder="0" value="' + (C.bonusSum ? nf(num(C.bonusSum)) : '') + '"' + (C.bonus ? '' : ' disabled') + '>' +
      (bonusErr ? '<span class="ck-hint err">Не больше ' + nf(BONUS_BALANCE) + ' бонусов</span>' : '') + '</label>') +
    extraHTML('ins', 'Страхование', 'Застрахуйте груз в 1 клик от 149 ₽. Страховая сумма до 10 млн ₽.', C.ins,
      '<p class="ck-txt">Сумма страховой премии будет вычтена из общей стоимости заявки. Ознакомьтесь с <a href="#" data-c="soon">условиями</a> и <a href="#" data-c="soon">правилами страхования</a>.<br>По вопросам страхования: <a href="mailto:monopoly.online@renins.com">monopoly.online@renins.com</a>.</p>' +
      '<div class="ck-dots"><b>Страховая сумма</b><i></i><b>' + money2(X.cargoValue) + '</b></div>' +
      '<div class="ck-dots"><b>Страховая премия</b><i></i><b>' + nf(insPremium()) + ' ₽</b></div>') +
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
  ckMenu.innerHTML = FLEET[key].items.map((x, i) => '<button type="button" class="mi" role="option" data-i="' + i + '" aria-selected="' + (C[key] === i) + '">' + esc(x) + '</button>').join('');
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
    case 'pay': C.pay = b.dataset.k; if (num(C.fuelSum) > fuelMax()) C.fuelSum = String(fuelMax()); render(); { const nb = ckEl.querySelector('.ck-pay[data-k="' + C.pay + '"]'); if (nb) nb.focus(); } break;
    case 'sel': e.stopPropagation(); if (C.open === b.dataset.k) closeSel(); else { closeSel(); openSel(b); } break;
    case 'edit': toast('Редактирование «' + FLEET[b.dataset.k].label.toLowerCase() + '» — в следующей итерации'); break;
    case 'sw': { const k = b.dataset.k; C[k] = !C[k]; render(); const nb = ckEl.querySelector('.ck-sw[data-k="' + k + '"]'); if (nb) nb.focus(); if (C[k] && k !== 'ins') { const inp = ckEl.querySelector('[data-c="' + k + 'Sum"]'); if (inp) inp.focus(); } break; }
    case 'info': toast({ fuel: 'До 90% стоимости перевозки приходит на Моносчёт сразу после погрузки — на топливо и дорогу', bonus: 'Бонусы начисляются за выполненные заявки и списываются по курсу 1 бонус = 1 ₽', ins: 'Страхование груза от повреждения, утраты и хищения на всём маршруте' }[b.dataset.k]); break;
    case 'tab': { const s = $(b.dataset.k); if (s) s.scrollIntoView({ behavior: 'smooth', block: 'start' }); break; }
    case 'vat': C.vat = !C.vat; render(); break;
    case 'soon': e.preventDefault(); toast('Раздел появится в следующей итерации'); break;
    case 'submit': {
      const t = totals();
      if (C.fuel && num(C.fuelSum) > fuelMax()) { toast('Сумма «Топлива после погрузки» — не больше 90% стоимости'); ckEl.querySelector('[data-c="fuelSum"]').focus(); break; }
      if (C.bonus && num(C.bonusSum) > BONUS_BALANCE) { toast('Столько бонусов нет на счету'); ckEl.querySelector('[data-c="bonusSum"]').focus(); break; }
      const tk = store.get('taken', {}); tk[o.id] = true; store.set('taken', tk); C.done = true; render();
      toast('Заявка ' + o.id + ' оформлена: ' + money2(t.account) + ' на р/с');
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
