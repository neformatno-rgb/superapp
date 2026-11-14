/* Custom dropdowns: selects are kept hidden for state, menus are portaled to <body>. */
'use strict';

// ---------- selects ----------
const uniq = (a) => Array.from(new Set(a)).sort((x, y) => x.localeCompare(y, 'ru'));
const fill = (el, first, vals, fmt) => { el.innerHTML = '<option value="">' + first + '</option>' + vals.map((v) => '<option value="' + esc(v) + '">' + esc(fmt ? fmt(v) : v) + '</option>').join(''); };


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
  if (typeof msClose === 'function' && except !== 'ms') msClose();
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

/* Multi-selects «Откуда», «Куда», «Тип кузова»: state is a comma list; picked values show as tags in the field. */
const BODY_KINDS = ['Тент', 'Рефрижератор', 'Изотерм'];
const bodyKind = (b) => /^Тент/.test(b) ? 'Тент' : b;
const MS_X = '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" style="display:block"><path d="M16.293 6.293a1 1 0 1 1 1.414 1.414L13.414 12l4.293 4.293a1 1 0 0 1-1.414 1.414L12 13.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L10.586 12 6.293 7.707a1 1 0 0 1 1.414-1.414L12 10.586z" fill="currentColor"/></svg>';
const MSS = [];
function msClose(except) { MSS.forEach((m) => { if (m !== except) m.close(); }); }
function msSync() { MSS.forEach((m) => m.sync()); }
function makeMS(fld, key, label, items) {
  const btn = fld.querySelector('.fv-btn'); const tags = fld.querySelector('.mst');
  const menu = document.createElement('div');
  menu.className = 'menu msm'; menu.id = fld.id + 'Menu'; menu.setAttribute('role', 'menu'); menu.setAttribute('aria-label', label);
  menu.innerHTML = items.map((k) => '<button type="button" class="msi" role="menuitemcheckbox" aria-checked="false" data-v="' + esc(k) + '">' + esc(k) + '</button>').join('');
  document.body.appendChild(menu); fld._menu = menu;
  const sel = () => (S[key] ? S[key].split(',') : []);
  const put = (v) => set({ [key]: items.filter((k) => v.indexOf(k) > -1).join(',') });
  const tagHTML = (k) => '<span class="mtag">' + esc(k) + '<button type="button" class="mtx" data-v="' + esc(k) + '" aria-label="Убрать: ' + esc(k) + '">' + MS_X + '</button></span>';
  // fit as many tags as the field allows; the rest collapse into «+N», or «Выбрано: N» if not even one fits
  const fit = (v) => {
    const draw = (n) => { tags.innerHTML = v.slice(0, n).map(tagHTML).join('') + (n < v.length ? '<span class="mtag more">' + (n ? '+' + (v.length - n) : 'Выбрано: ' + v.length) + '</span>' : ''); };
    let n = v.length; draw(n);
    if (!tags.clientWidth) return;
    while (n > 0 && tags.scrollWidth > tags.clientWidth + 0.5) { n--; draw(n); }
  };
  const ms = {
    close() { if (!fld.classList.contains('open')) return; fld.classList.remove('open'); menu.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); },
    sync() {
      const v = items.filter((k) => sel().indexOf(k) > -1);
      fld.classList.toggle('has', !!v.length); fit(v);
      menu.querySelectorAll('.msi').forEach((b) => b.setAttribute('aria-checked', v.indexOf(b.dataset.v) > -1));
      btn.setAttribute('aria-label', label + (v.length ? ': ' + v.join(', ') : ''));
    },
  };
  MSS.push(ms);
  tags.addEventListener('click', (e) => {
    const x = e.target.closest('.mtx'); if (!x) return; e.stopPropagation();
    put(sel().filter((k) => k !== x.dataset.v));
    if (fld.classList.contains('open')) placeMenu(fld);
  });
  fld.querySelector('.fld-clear').addEventListener('click', (e) => { e.stopPropagation(); ms.close(); set({ [key]: '' }); btn.focus(); });
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = !fld.classList.contains('open'); closeDD('ms'); msClose(ms); if (typeof dpClose === 'function') dpClose();
    fld.classList.toggle('open', open); menu.classList.toggle('open', open); btn.setAttribute('aria-expanded', open);
    if (open) { placeMenu(fld); (menu.querySelector('.msi[aria-checked="true"]') || menu.querySelector('.msi')).focus(); }
  });
  fld.addEventListener('click', (e) => { if (e.target === fld) btn.click(); });
  menu.addEventListener('click', (e) => {
    e.stopPropagation();
    const it = e.target.closest('.msi'); if (!it) return;
    const v = sel(); const i = v.indexOf(it.dataset.v); if (i > -1) v.splice(i, 1); else v.push(it.dataset.v);
    put(v);
    if (fld.classList.contains('open')) placeMenu(fld);
  });
  menu.addEventListener('keydown', (e) => {
    const all = Array.from(menu.querySelectorAll('.msi')); const i = all.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); (all[i + 1] || all[0]).focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); (all[i - 1] || all[all.length - 1]).focus(); }
    else if (e.key === 'Escape' || e.key === 'Tab') { ms.close(); btn.focus(); }
  });
  window.addEventListener('scroll', () => { if (fld.classList.contains('open')) placeMenu(fld); }, true);
  return ms;
}
makeMS($('fFromFld'), 'from', 'Откуда', uniq(ALL.map((o) => o.from)));
makeMS($('fToFld'), 'to', 'Куда', uniq(ALL.map((o) => o.to)));
makeMS($('fBodyFld'), 'body', 'Тип кузова', BODY_KINDS);
window.addEventListener('resize', () => msSync());
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => msSync());
