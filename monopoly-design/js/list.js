/* Search list: filtering, cards, pager, counters, events, offer dialog. */
'use strict';

// ---------- compute ----------
function filtered() {
  const anyType = types.some((t) => S.types[t]);
  let l = ALL.filter((o) => {
    if (S.tab === 'fav' && !S.saved[o.id]) return false;
    if (S.tab === 'bids' && !(S.offers[o.id] || S.taken[o.id])) return false;
    if (S.tab === 'track' || S.tab === 'upload') return false;
    if (S.from && o.from !== S.from) return false;
    if (S.to && o.to !== S.to) return false;
    if (S.body && o.body !== S.body) return false;
    if (S.day) { const [a, b] = dayRange(S.day); if (o.fromDay < a || o.fromDay > b) return false; }
    if (anyType && !o.tags.some((t) => S.types[t])) return false;
    const inR = (v, r) => { if (!r) return true; const [a, b] = r.split('-').map(Number); return v > a - 1e-9 && v <= b; };
    if (!inR(o.t, S.cap) || !inR(o.m3, S.vol) || !inR(o.kg / 1000, S.wt)) return false;
    if (S.q && o.id.toLowerCase().indexOf(S.q.trim().toLowerCase()) === -1) return false;
    return true;
  });
  const sorters = { 'price-asc': (a, b) => a.price - b.price, 'price-desc': (a, b) => b.price - a.price,
    'rate-desc': (a, b) => b.price / b.dist - a.price / a.dist, 'date-asc': (a, b) => a.fromDay - b.fromDay };
  if (sorters[S.sort]) l = l.slice().sort(sorters[S.sort]);
  return l;
}
function cardHTML(o) {
  const price = o.price * vatK();
  const saved = !!S.saved[o.id];
  const taken = !!S.taken[o.id];
  const offered = S.offers[o.id];
  const tagsHTML = '<span class="tags">' + o.tags.map((t) => '<span class="tag ' + (t === 'Фикс' ? 't-fix' : t === 'Аукцион' ? 't-auc' : 't-cnt') + '">' + t + '</span>').join('') + '</span>';
  const fixOnly = o.tags.length === 1 && o.tags[0] === 'Фикс';
  const cta = taken ? 'Забронировано' : fixOnly ? 'Забрать груз' : o.tags.includes('Встречное') ? 'Предложить цену' : 'Сделать ставку';
  return '<article class="card order" data-id="' + o.id + '" tabindex="0" aria-label="Заявка ' + o.id + ': ' + esc(o.from) + ' — ' + esc(o.to) + '. Открыть полную версию">' +
    '<div class="oleft"><div class="ohead">' +
      '<button type="button" class="pill" data-act="copy" data-id="' + o.id + '" aria-label="Скопировать номер ' + o.id + '">' + o.id + I.copy.replace('<svg ', '<svg class="cp" ') + I.check + '</button>' +
      '<span class="pill rate">' + I.star + o.rating + '</span>' +
      tagsHTML +
    '</div><div class="hr"></div><div class="ogrid">' +
      '<div class="place"><span class="city">' + esc(o.from) + '</span><span class="reg" title="' + esc(o.fromReg) + '">' + esc(o.fromReg) + '</span><span class="when">' + winHTML(o.fromDay, o.id + 'f') + '</span></div>' +
      '<div class="mid"><div class="arr">' + I.arr + (o.stops ? '<span class="plus" title="Промежуточные точки">+' + o.stops + '</span>' : '') + I.arr + '</div><span class="km">' + nf(o.dist) + ' км</span></div>' +
      '<div class="place"><span class="city">' + esc(o.to) + '</span><span class="reg" title="' + esc(o.toReg) + '">' + esc(o.toReg) + '</span><span class="when">' + winHTML(o.toDay, o.id + 't') + '</span></div>' +
      '<div class="spec"><span class="bt">' + esc(o.body) + '</span><span class="reg">' + o.t + ' т | ' + o.m3 + ' м³ | ' + o.pl + ' плт</span><span class="when"><b>' + esc(o.cargo) + '</b> | ' + nf(o.kg) + ' кг</span></div>' +
    '</div></div>' +
    '<div class="vdiv"></div>' +
    '<div class="oright"><div class="badges">' +
      (o.urgent && o.fuel ? I.urgentFuel : o.urgent ? I.urgent : o.fuel ? I.fuel : '') +
      '<span class="bonus" title="Бонусные баллы"><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" style="display:block;flex-shrink:0"><circle cx="8" cy="8" r="5" fill="#FFE16A" stroke="#FABD28" stroke-width="2"/><path d="M9.7002 4.80566C9.95846 4.46148 10.4082 4.32099 10.8164 4.45703C11.2245 4.5932 11.4999 4.97507 11.5 5.40527V7.00293H12.5C12.7761 7.00293 13 7.22679 13 7.50293C12.9998 7.77887 12.776 8.00293 12.5 8.00293H11.5V10.5996C11.4997 11.1517 11.0521 11.5996 10.5 11.5996C9.94787 11.5996 9.50025 11.1517 9.5 10.5996V8.4043L8.7998 9.33887C8.61094 9.59052 8.31465 9.73828 8 9.73828C7.68535 9.73828 7.38906 9.59052 7.2002 9.33887L6.5 8.4043V10.5996C6.49975 11.1517 6.05213 11.5996 5.5 11.5996C4.94787 11.5996 4.50025 11.1517 4.5 10.5996V8.00293H3.5C3.224 8.00293 3.00024 7.77887 3 7.50293C3 7.22679 3.22386 7.00293 3.5 7.00293H4.5V5.40527C4.50012 4.97507 4.77551 4.5932 5.18359 4.45703C5.59184 4.32099 6.04154 4.46148 6.2998 4.80566L8 7.07227L9.7002 4.80566Z" fill="#FABD28"/></svg>+' + o.bonus + '</span>' +
    '</div>' +
    '<div class="prow"><span class="perkm">' + (price / o.dist).toFixed(2).replace('.', ',') + ' ₽/км</span><span class="price">' + money(price) + '</span></div>' +
    '<div class="acts"><button type="button" class="cta' + (taken ? ' done' : '') + '" data-act="cta" data-id="' + o.id + '"' + (taken ? ' disabled' : '') + '>' + cta + '</button>' +
    '<button type="button" class="book" data-act="save" data-id="' + o.id + '" aria-pressed="' + saved + '" aria-label="' + (saved ? 'Убрать из избранного' : 'В избранное') + '">' + I.book + '</button></div>' +
    '</div></article>';
}

const EMPTY = {
  all: ['Ничего не нашлось', 'Уберите часть фильтров или выберите другой город.'],
  bids: ['Пока нет торгов', 'Предложите цену по заявке или заберите её сразу — она появится здесь.'],
  track: ['Нет отслеживаемых направлений', 'Добавьте направление, чтобы видеть новые заявки по нему в этой вкладке.'],
  upload: ['Здесь будут ваши грузы', 'Разместите груз, чтобы перевозчики могли откликнуться на него.'],
  fav: ['В избранном пока пусто', 'Нажмите на закладку у заявки, чтобы сохранить её здесь.']
};
function render() {
  const l = filtered();
  const pages = Math.max(1, Math.ceil(l.length / PER));
  if (S.page > pages) S.page = pages;
  const slice = l.slice((S.page - 1) * PER, S.page * PER);
  $('found').textContent = 'Найдено ' + l.length + ' ' + plural(l.length);
  $('list').innerHTML = slice.length ? slice.map(cardHTML).join('') :
    (function () { const E = EMPTY[S.tab] || EMPTY.all; return '<div class="card empty"><b>' + E[0] + '</b><span>' + E[1] + '</span>' + (S.tab === 'all' ? '<button type="button" class="reset" data-act="reset" style="margin-top:8px">Сбросить фильтры</button>' : '') + '</div>'; })();
  // pager
  const pg = $('pager');
  if (!l.length) { pg.hidden = true; } else {
    pg.hidden = false;
    const want = Array.from(new Set([1, pages, S.page - 1, S.page, S.page + 1].filter((i) => i >= 1 && i <= pages))).sort((a, b) => a - b);
    let h = '<span class="pinfo">Заявки ' + ((S.page - 1) * PER + 1) + '–' + Math.min(S.page * PER, l.length) + ' из ' + l.length + '</span>';
    h += '<button type="button" class="pg" data-page="' + (S.page - 1) + '" aria-label="Предыдущая страница"' + (S.page <= 1 ? ' disabled' : '') + '>' + I.prev + '</button>';
    let last = 0;
    want.forEach((i) => { if (i - last > 1) h += '<span class="pg gap" aria-hidden="true">…</span>'; h += '<button type="button" class="pg' + (i === S.page ? ' on' : '') + '" data-page="' + i + '"' + (i === S.page ? ' aria-current="page"' : '') + '>' + i + '</button>'; last = i; });
    h += '<button type="button" class="pg" data-page="' + (S.page + 1) + '" style="color:var(--t1)"' + (S.page >= pages ? ' disabled' : '') + '>Дальше' + I.next + '</button>';
    pg.innerHTML = h;
  }
  // counters
  const act = [S.from, S.to, S.body, S.day, S.cap, S.vol, S.wt].filter(Boolean).length + types.filter((t) => S.types[t]).length;
  $('actCnt').hidden = !act; $('actCnt').textContent = act;
  $('reset').hidden = !act;
  const fav = Object.keys(S.saved).length;
  $('favCnt').hidden = !fav; $('favCnt').textContent = fav;
  document.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', !!S.types[c.dataset.type]));
  document.querySelectorAll('.tab[data-tab]').forEach((t) => { const on = t.dataset.tab === S.tab; t.classList.toggle('on', on); t.setAttribute('aria-selected', on); });
  const bids = Object.keys(S.offers).length + Object.keys(S.taken).length; $('bidCnt').hidden = !bids; $('bidCnt').textContent = bids;
  $('fFrom').value = S.from; $('fTo').value = S.to; $('fBody').value = S.body;
  syncDD(); dpSync(); $('sort').value = S.sort;
  [['fCap','cap'],['fVol','vol'],['fWt','wt']].forEach(([id, k]) => { $(id).value = S[k]; $(id).parentElement.classList.toggle('on', !!S[k]); });
  $('vat').value = S.vat ? '1' : '0';
  if (typeof srch !== 'undefined') fitSearch();
}

function applyChrome() {
  document.documentElement.setAttribute('data-theme', S.theme);
  const dark = S.theme === 'dark';
  $('themeSw').classList.toggle('on', dark);
  $('themeBtn').setAttribute('aria-checked', dark); $('themeBtnM').setAttribute('aria-checked', dark);
  $('side').classList.toggle('open', S.nav);
  $('navBtn').setAttribute('aria-expanded', S.nav); $('navBtn').setAttribute('aria-label', S.nav ? 'Свернуть меню' : 'Развернуть меню');
}

let tt;
function toast(msg) { const t = $('toast'); t.textContent = msg; t.hidden = false; t.style.animation = 'none'; void t.offsetWidth; t.style.animation = ''; clearTimeout(tt); tt = setTimeout(() => { t.hidden = true; }, 2400); }
const set = (patch) => { Object.assign(S, { page: 1 }, patch); render(); };

// ---------- events ----------
$('navBtn').addEventListener('click', () => { S.nav = !S.nav; applyChrome(); });
// 1920px and wider: menu open by default; follows the window when it crosses 1920px
const wideMQ = window.matchMedia('(min-width:1920px)');
const onWide = (e) => { S.nav = e.matches; applyChrome(); };
if (wideMQ.addEventListener) wideMQ.addEventListener('change', onWide); else if (wideMQ.addListener) wideMQ.addListener(onWide);
const flipTheme = () => { S.theme = S.theme === 'dark' ? 'light' : 'dark'; store.set('theme', S.theme); applyChrome(); };
$('themeBtn').addEventListener('click', flipTheme); $('themeBtnM').addEventListener('click', flipTheme);
document.querySelectorAll('.tab[data-tab]').forEach((t) => t.addEventListener('click', () => set({ tab: t.dataset.tab })));
$('q').addEventListener('input', (e) => set({ q: e.target.value }));
$('fFrom').addEventListener('change', (e) => set({ from: e.target.value }));
$('fTo').addEventListener('change', (e) => set({ to: e.target.value }));
$('fBody').addEventListener('change', (e) => set({ body: e.target.value }));
$('sort').addEventListener('change', (e) => set({ sort: e.target.value }));
$('fCap').addEventListener('change', (e) => set({ cap: e.target.value }));
$('fVol').addEventListener('change', (e) => set({ vol: e.target.value }));
$('fWt').addEventListener('change', (e) => set({ wt: e.target.value }));
$('swap').addEventListener('click', () => set({ from: S.to, to: S.from }));
$('vat').addEventListener('change', (e) => { S.vat = e.target.value === '1'; render(); });
const resetAll = () => { $('q').value = ''; set({ q: '', from: '', to: '', body: '', day: '', cap: '', vol: '', wt: '', types: {} }); toast('Фильтры сброшены'); };
$('reset').addEventListener('click', resetAll);
$('chips').addEventListener('click', (e) => { const c = e.target.closest('.chip'); if (!c) return; const n = Object.assign({}, S.types); n[c.dataset.type] = !n[c.dataset.type]; set({ types: n }); });
$('pager').addEventListener('click', (e) => { const b = e.target.closest('[data-page]'); if (!b || b.disabled) return; S.page = +b.dataset.page; render(); document.querySelector('.main h1').scrollIntoView({ behavior: 'smooth', block: 'start' }); });
$('list').addEventListener('click', (e) => {
  const b = e.target.closest('[data-act]'); if (!b) return;
  const id = b.dataset.id; const o = ALL.find((x) => x.id === id);
  if (b.dataset.act === 'reset') return resetAll();
  if (b.dataset.act === 'copy') {
    const done = () => { b.classList.add('done'); showTip(b, 'Скопировано'); clearTimeout(b._t); b._t = setTimeout(() => { b.classList.remove('done'); hideInfo(); }, 1600); };
    try { navigator.clipboard.writeText(id).then(done, done); } catch (err) { done(); }
  } else if (b.dataset.act === 'save') {
    if (S.saved[id]) { delete S.saved[id]; toast('Убрано из избранного'); } else { S.saved[id] = true; toast('Добавлено в избранное'); }
    store.set('saved', S.saved); render();
  } else if (b.dataset.act === 'cta') {
    if (o.tags.length === 1 && o.tags[0] === 'Фикс') { S.taken[id] = true; render(); toast('Заявка ' + id + ' забронирована за вами'); }
    else openOffer(o);
  }
});

// ---------- offer dialog ----------
let lastFocus = null;
function openOffer(o) {
  S.offerId = o.id; lastFocus = document.activeElement;
  $('offerTitle').textContent = o.tags.includes('Встречное') ? 'Предложить цену' : 'Сделать ставку';
  $('offerRoute').textContent = o.id + ' · ' + o.from + ' → ' + o.to;
  $('offerCur').textContent = money(o.price * vatK());
  $('offerPrice').value = nf((S.offers[o.id] || o.price * vatK() * 0.95));
  $('offerErr').hidden = true; $('modal').hidden = false; $('offerPrice').focus(); $('offerPrice').select();
}
function closeOffer() { $('modal').hidden = true; S.offerId = null; if (lastFocus) lastFocus.focus(); }
$('offerCancel').addEventListener('click', closeOffer);
$('modal').addEventListener('click', (e) => { if (e.target === $('modal')) closeOffer(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('modal').hidden) closeOffer(); });
$('offerPrice').addEventListener('input', (e) => { e.target.value = e.target.value.replace(/[^\d\s]/g, ''); $('offerErr').hidden = true; });
$('offerForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const v = parseInt($('offerPrice').value.replace(/\s/g, ''), 10);
  if (!v || v <= 0) { $('offerErr').hidden = false; $('offerPrice').focus(); return; }
  S.offers[S.offerId] = v; S.offerAt[S.offerId] = Date.now(); const id = S.offerId; closeOffer(); render(); toast('Предложение ' + money(v) + ' по заявке ' + id + ' отправлено');
});
