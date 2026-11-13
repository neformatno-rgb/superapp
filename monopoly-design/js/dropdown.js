/* Custom dropdowns: selects are kept hidden for state, menus are portaled to <body>. */
'use strict';

// ---------- selects ----------
const uniq = (a) => Array.from(new Set(a)).sort((x, y) => x.localeCompare(y, 'ru'));
const fill = (el, first, vals, fmt) => { el.innerHTML = '<option value="">' + first + '</option>' + vals.map((v) => '<option value="' + esc(v) + '">' + esc(fmt ? fmt(v) : v) + '</option>').join(''); };
fill($('fFrom'), 'Откуда: любой город', uniq(ALL.map((o) => o.from)));
fill($('fTo'), 'Куда: любой город', uniq(ALL.map((o) => o.to)));
fill($('fBody'), 'Тип кузова', uniq(ALL.map((o) => o.body)));
fill($('fDay'), 'Дата загрузки', Array.from(new Set(ALL.map((o) => o.fromDay))).sort((a, b) => a - b).map(String), (d) => 'с ' + dayLabel(+d));


// ---------- custom dropdowns for inputs ----------
const dds = Array.from(document.querySelectorAll('[data-dd]'));
function buildMenus() {
  dds.forEach((w) => {
    const sel = w.querySelector('select'); const menu = w._menu || w.querySelector('.menu');
    menu.innerHTML = Array.from(sel.options).map((o) => '<button type="button" class="mi" role="option" data-v="' + esc(o.value) + '">' + esc(o.value ? o.text : 'Любой') + '</button>').join('');
  });
}
function syncDD() {
  dds.forEach((w) => {
    const sel = w.querySelector('select'); const fv = w.querySelector('.fv');
    const o = sel.options[sel.selectedIndex];
    fv.textContent = o ? o.text : ''; fv.classList.toggle('ph', !sel.value);
    w.classList.toggle('has', !!sel.value);
    (w._menu || w).querySelectorAll('.mi').forEach((b) => b.setAttribute('aria-selected', b.dataset.v === sel.value));
  });
}
function closeDD(except) {
  dds.forEach((w) => { if (w !== except && w.classList.contains('open')) { w.classList.remove('open'); w._menu.classList.remove('open'); w.querySelector('.fv-btn').setAttribute('aria-expanded', 'false'); } });
}
dds.forEach((w) => {
  const btn = w.querySelector('.fv-btn'); const menu = w.querySelector('.menu'); const sel = w.querySelector('select');
  w._menu = menu; document.body.appendChild(menu);
  const clr = w.querySelector('.dd-clear, .fld-clear');
  if (clr) clr.addEventListener('click', (e) => { e.stopPropagation(); sel.value = ''; sel.dispatchEvent(new Event('change')); closeDD(); btn.focus(); });
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = !w.classList.contains('open'); closeDD(w);
    w.classList.toggle('open', open); menu.classList.toggle('open', open); btn.setAttribute('aria-expanded', open);
    if (open) placeMenu(w);
    if (open) { const cur = menu.querySelector('[aria-selected="true"]') || menu.firstElementChild; if (cur) { cur.scrollIntoView({ block: 'nearest' }); cur.focus(); } }
  });
  menu.addEventListener('click', (e) => {
    const it = e.target.closest('.mi'); if (!it) return; e.stopPropagation();
    sel.value = it.dataset.v; sel.dispatchEvent(new Event('change')); closeDD(); btn.focus();
  });
  menu.addEventListener('keydown', (e) => {
    const items = Array.from(menu.querySelectorAll('.mi')); const i = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); (items[i + 1] || items[0]).focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); (items[i - 1] || items[items.length - 1]).focus(); }
    else if (e.key === 'Escape') { closeDD(); btn.focus(); }
  });
  w.addEventListener('click', (e) => { if (e.target === w) btn.click(); });
});
function placeMenu(w) {
  const r = w.getBoundingClientRect(); const m = w._menu;
  const w2 = Math.max(r.width, w.classList.contains('dd') || w.classList.contains('ddl') ? 200 : 0);
  const lx = w.dataset.align === 'right' ? r.right - w2 : r.left;
  m.style.width = w2 + 'px'; m.style.left = Math.max(8, Math.min(lx, window.innerWidth - w2 - 8)) + 'px';
  const below = window.innerHeight - r.bottom; const h = Math.min(m.scrollHeight, 224);
  m.style.top = (below < h + 12 && r.top > h + 12 ? r.top - h - 4 : r.bottom + 4) + 'px';
}
document.addEventListener('click', () => closeDD());
window.addEventListener('resize', () => closeDD());
window.addEventListener('scroll', () => dds.forEach((w) => { if (w.classList.contains('open')) placeMenu(w); }), true);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDD(); });
buildMenus();
