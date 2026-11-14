/* Phone layout (≤767px): compact order card, filter summary, sort/filter buttons, header title. */
'use strict';

// ---------- mobile card (≤767px) ----------
const BONUS_COIN = '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" style="display:block;flex-shrink:0"><circle cx="8" cy="8" r="5" fill="#FFE16A" stroke="#FABD28" stroke-width="2"/><path d="M9.7002 4.80566C9.95846 4.46148 10.4082 4.32099 10.8164 4.45703C11.2245 4.5932 11.4999 4.97507 11.5 5.40527V7.00293H12.5C12.7761 7.00293 13 7.22679 13 7.50293C12.9998 7.77887 12.776 8.00293 12.5 8.00293H11.5V10.5996C11.4997 11.1517 11.0521 11.5996 10.5 11.5996C9.94787 11.5996 9.50025 11.1517 9.5 10.5996V8.4043L8.7998 9.33887C8.61094 9.59052 8.31465 9.73828 8 9.73828C7.68535 9.73828 7.38906 9.59052 7.2002 9.33887L6.5 8.4043V10.5996C6.49975 11.1517 6.05213 11.5996 5.5 11.5996C4.94787 11.5996 4.50025 11.1517 4.5 10.5996V8.00293H3.5C3.224 8.00293 3.00024 7.77887 3 7.50293C3 7.22679 3.22386 7.00293 3.5 7.00293H4.5V5.40527C4.50012 4.97507 4.77551 4.5932 5.18359 4.45703C5.59184 4.32099 6.04154 4.46148 6.2998 4.80566L8 7.07227L9.7002 4.80566Z" fill="#FABD28"/></svg>';
const bodyShort = (b) => b.replace(/\s*\(.*\)$/, '');
const aucEnd = {};
const T0 = Date.now();
function aucLeft(o) { if (!aucEnd[o.id]) aucEnd[o.id] = T0 + (600 + hashStr(o.id + 'a') % 3000) * 1000; return Math.max(0, Math.round((aucEnd[o.id] - Date.now()) / 1000)); }
const hms = (t) => [Math.floor(t / 3600), Math.floor(t / 60) % 60, t % 60].map((n) => String(n).padStart(2, '0')).join(':');
const stopsWord = (n) => n === 1 ? 'точка' : n < 5 ? 'точки' : 'точек';
function mCardHTML(o, price, saved) {
  const X = orderInfo(o);
  const tag = (t) => '<span class="tag ' + (t === 'Фикс' ? 't-fix' : t === 'Аукцион' ? 't-auc' : 't-cnt') + '"' + (t === 'Аукцион' ? ' data-auc="' + o.id + '"' : '') + '>' + t + (t === 'Аукцион' ? ' (' + hms(aucLeft(o)) + ')' : '') + '</span>';
  const pt = (k, city, day, key) => '<div class="mpt ' + k + '"><i></i><span><span class="c">' + esc(city) + '</span><span class="w">' + winHTML(day, key) + '</span></span></div>';
  return '<div class="mc">' +
    '<div class="mch"><span class="mrate" aria-label="Рейтинг ' + o.rating + '">' + I.star + o.rating + '</span>' +
      '<span class="mco"><small>' + esc(X.company) + '</small><b>' + o.id + '</b></span>' +
      '<button type="button" class="msq" data-act="share" data-id="' + o.id + '" aria-label="Поделиться заявкой">' + DI.share + '</button>' +
      '<button type="button" class="msq" data-act="save" data-id="' + o.id + '" aria-pressed="' + saved + '" aria-label="' + (saved ? 'Убрать из избранного' : 'В избранное') + '">' + BOOK24 + '</button></div>' +
    '<div class="mspec"><span>' + esc(bodyShort(o.body)) + ' | ' + loadType(o.body) + '</span><b>' + o.t + ' т | ' + o.pl + ' пл.</b></div>' +
    '<div class="mroute">' + pt('ld', o.from, o.fromDay, o.id + 'f') +
      (o.stops ? '<div class="mstops"><i></i><span>+' + o.stops + ' ' + stopsWord(o.stops) + ' в рейсе</span></div>' : '') +
      pt('ul', o.to, o.toDay, o.id + 't') + '</div>' +
    '<div class="mft"><span class="tags">' + o.tags.map(tag).join('') + '</span><span class="badges">' +
      (o.urgent && o.fuel ? I.urgentFuel : o.urgent ? I.urgent : o.fuel ? I.fuel : '') +
      '<span class="bonus" title="Бонусные баллы">' + BONUS_COIN + '+' + o.bonus + '</span></span></div>' +
    '<div class="mbot"><span>' + nf(o.dist) + ' км · ' + Math.round(price / o.dist) + ' ₽/км</span><b>' + money(price) + '</b></div>' +
  '</div>';
}
setInterval(() => { document.querySelectorAll('[data-auc]').forEach((t) => { const o = ALL.find((x) => x.id === t.dataset.auc); if (o) t.textContent = 'Аукцион (' + hms(aucLeft(o)) + ')'; }); }, 1000);

// ---------- mobile controls (≤767px) ----------
const mSum = $('mSum'), mFields = $('mFields');
function mSync() {
  const parts = [];
  if (S.from || S.to) parts.push((S.from ? S.from.split(',').join(', ') : 'Любой город') + ' — ' + (S.to ? S.to.split(',').join(', ') : 'любой город'));
  if (S.day) parts.push(rangeLabel(dayRange(S.day)));
  if (S.body) parts.push(S.body.split(',').map((k) => k.toLowerCase()).join(', '));
  mSum.querySelector('span').textContent = parts.length ? parts.join(', ') : 'Откуда, куда, когда';
  mSum.classList.toggle('ph', !parts.length);
  $('mSort').classList.toggle('on', S.sort !== 'default');
}
const mToggle = (open) => { mFields.classList.toggle('mf-open', open); mSum.setAttribute('aria-expanded', open); $('mFlt').setAttribute('aria-pressed', open); if (open && typeof msSync === 'function') msSync(); };
mSum.addEventListener('click', () => mToggle(!mFields.classList.contains('mf-open')));
$('mFlt').addEventListener('click', (e) => { e.stopPropagation(); mToggle(!mFields.classList.contains('mf-open')); });
$('mSort').addEventListener('click', (e) => {
  e.stopPropagation();
  const w = document.querySelector('[data-dd="sort"]'); w.querySelector('.fv-btn').click();
  if (!w.classList.contains('open')) return;
  const r = $('mSort').getBoundingClientRect(); const m = w._menu;
  m.style.width = '220px'; m.style.left = Math.max(8, r.left) + 'px'; m.style.top = (r.bottom + 4) + 'px';
});
document.querySelector('.mbk').addEventListener('click', () => { if (mainEl.classList.contains('is-detail')) hideDetail(true); else toast('Возврат на главную — в следующей итерации'); });
$('mSub').addEventListener('click', () => toast('Подписка на этот поиск оформлена: новые грузы придут в уведомления'));
const mTitle = document.querySelector('.mhead h2');
new MutationObserver(() => { const det = mainEl.classList.contains('is-detail') && V.id; mTitle.textContent = det ? 'Просмотр заявки' : 'Поиск грузов'; mTitle.parentNode.classList.toggle('det', !!det); }).observe(mainEl, { attributes: true, attributeFilter: ['class'] });
const _render = render;
render = function () { _render(); mSync(); };
