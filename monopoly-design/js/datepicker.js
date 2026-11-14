/* Range date picker for «Дата погрузки». State lives in S.day as "from-to" (day indices, see dayLabel). */
'use strict';

// day index ↔ Date: index 1 = 1 ноя 2026, 31 = 1 дек (same scale as o.fromDay)
const DP_BASE = new Date(2026, 9, 31);
const dpDate = (i) => new Date(2026, 9, 31 + i);
const dpIdx = (d) => Math.round((d - DP_BASE) / 864e5);
const DP_MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const DP_WD = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const DP_CHEV = '<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" style="display:block"><path d="M11.4619 15.8867C11.0715 16.2771 10.4374 16.2769 10.0469 15.8867C9.65679 15.4962 9.65658 14.8631 10.0469 14.4727L12.5234 11.9971L10.0479 9.52148C9.65734 9.13097 9.65737 8.49697 10.0479 8.10644C10.4383 7.71618 11.0714 7.71632 11.4619 8.10645L14.6445 11.2891C15.0347 11.6796 15.0349 12.3137 14.6445 12.7041L11.4619 15.8867Z" fill="currentColor"/></svg>';
const dayRange = (v) => { if (!v) return null; const [a, b] = v.split('-').map(Number); return [a, b || a]; };
const rangeLabel = (r) => r[0] === r[1] ? dayLabel(r[0]) : dayLabel(r[0]) + ' — ' + dayLabel(r[1]);

const dpFld = $('fDayFld'); const dpBtn = dpFld.querySelector('.fv-btn');
const dp = $('dp'); document.body.appendChild(dp);
const DP = { y: 2026, m: 10, a: null, b: null, hover: null };   // a/b — pending selection inside the popup

function dpRender() {
  const first = new Date(DP.y, DP.m, 1); const lead = (first.getDay() + 6) % 7;
  const n = new Date(DP.y, DP.m + 1, 0).getDate();
  const lo = DP.a == null ? null : Math.min(DP.a, DP.b ?? DP.hover ?? DP.a);
  const hi = DP.a == null ? null : Math.max(DP.a, DP.b ?? DP.hover ?? DP.a);
  let cells = '';
  for (let i = 0; i < lead; i++) cells += '<span></span>';
  for (let d = 1; d <= n; d++) {
    const i = dpIdx(new Date(DP.y, DP.m, d)); const wd = (lead + d - 1) % 7;
    const cls = ['dpd'];
    if (lo != null && i >= lo && i <= hi) cls.push('in');
    if (i === lo) cls.push('lo'); if (i === hi) cls.push('hi');
    if (wd === 0 || d === 1) cls.push('rs'); if (wd === 6 || d === n) cls.push('re');
    cells += '<button type="button" class="' + cls.join(' ') + '" data-i="' + i + '" aria-pressed="' + (i === lo || i === hi) + '"><span>' + d + '</span></button>';
  }
  dp.querySelector('.dpt').textContent = DP_MONTHS[DP.m] + ' ' + DP.y;
  dp.querySelector('.dpg').innerHTML = DP_WD.map((w) => '<span class="dpw">' + w + '</span>').join('') + cells;
  dp.querySelector('[data-dp=apply]').disabled = DP.a == null;
}
function dpPlace() {
  const r = dpFld.getBoundingClientRect(); const w = dp.offsetWidth; const h = dp.offsetHeight;
  dp.style.left = Math.max(8, Math.min(r.left, window.innerWidth - w - 8)) + 'px';
  const below = window.innerHeight - r.bottom;
  dp.style.top = (below < h + 12 && r.top > h + 12 ? r.top - h - 4 : r.bottom + 4) + 'px';
}
function dpOpen() {
  closeDD();
  const r = dayRange(S.day); DP.a = r ? r[0] : null; DP.b = r ? r[1] : null; DP.hover = null;
  const d = dpDate(r ? r[0] : Math.min.apply(null, ALL.map((o) => o.fromDay))); DP.y = d.getFullYear(); DP.m = d.getMonth();
  dpRender(); dpFld.classList.add('open'); dp.classList.add('open'); dpBtn.setAttribute('aria-expanded', 'true'); dpPlace();
}
function dpClose() {
  if (!dp.classList.contains('open')) return;
  dpFld.classList.remove('open'); dp.classList.remove('open'); dpBtn.setAttribute('aria-expanded', 'false');
}
function dpSync() {
  const r = dayRange(S.day); const fv = dpFld.querySelector('.fv');
  fv.textContent = r ? rangeLabel(r) : 'Дата погрузки'; fv.classList.toggle('ph', !r);
  dpFld.classList.toggle('has', !!r);
}

dpBtn.addEventListener('click', (e) => { e.stopPropagation(); dp.classList.contains('open') ? dpClose() : dpOpen(); });
dpFld.addEventListener('click', (e) => { if (e.target === dpFld) dpBtn.click(); });
dpFld.querySelector('.fld-clear').addEventListener('click', (e) => { e.stopPropagation(); dpClose(); set({ day: '' }); dpBtn.focus(); });
dp.addEventListener('click', (e) => {
  e.stopPropagation();
  const nav = e.target.closest('[data-nav]');
  if (nav) { DP.m += +nav.dataset.nav; if (DP.m < 0) { DP.m = 11; DP.y--; } if (DP.m > 11) { DP.m = 0; DP.y++; } dpRender(); return; }
  const d = e.target.closest('.dpd');
  if (d) { const i = +d.dataset.i; if (DP.a == null || DP.b != null) { DP.a = i; DP.b = null; } else { DP.b = i; if (DP.b < DP.a) [DP.a, DP.b] = [DP.b, DP.a]; } DP.hover = null; dpRender(); return; }
  const act = e.target.closest('[data-dp]'); if (!act) return;
  if (act.dataset.dp === 'reset') { DP.a = DP.b = null; dpClose(); set({ day: '' }); }
  if (act.dataset.dp === 'apply' && DP.a != null) { dpClose(); set({ day: DP.a + '-' + (DP.b ?? DP.a) }); dpBtn.focus(); }
});
dp.addEventListener('mouseover', (e) => {
  const d = e.target.closest('.dpd'); if (!d || DP.a == null || DP.b != null) return;
  const i = +d.dataset.i; if (i !== DP.hover) { DP.hover = i; dpRender(); }
});
dp.addEventListener('mouseleave', () => { if (DP.hover != null && DP.b == null) { DP.hover = null; dpRender(); } });
document.addEventListener('click', (e) => { if (!dp.contains(e.target) && !dpFld.contains(e.target)) dpClose(); }, true);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && dp.classList.contains('open')) { dpClose(); dpBtn.focus(); } });
window.addEventListener('resize', dpClose);
window.addEventListener('scroll', () => { if (dp.classList.contains('open')) dpPlace(); }, true);
