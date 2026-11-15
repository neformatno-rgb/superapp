/* Filter drawer: a 420px side panel with every filter of the list screen.
   Opened by «Фильтры» in the filter bar. Changes apply live (set()), the footer shows how many cargos match. */
'use strict';

(function () {
  const trigger = $('fOpen'); if (!trigger) return;
  // icons are taken from the filter bar so both places always match
  const ico = (sel) => { const e = document.querySelector(sel); return e ? e.innerHTML : ''; };
  const IC = {
    close: ico('#fFromFld .fld-clear'), swap: ico('#swap'),
    chev: (document.querySelector('#fBodyFld .fv-btn > svg') || { outerHTML: '' }).outerHTML,
    cal: (document.querySelector('#fDayFld .fv-btn > svg') || { outerHTML: '' }).outerHTML,
  };
  const MULTI = {
    from: { label: 'Откуда', ph: 'Любой город', items: uniq(ALL.map((o) => o.from)) },
    to: { label: 'Куда', ph: 'Любой город', items: uniq(ALL.map((o) => o.to)) },
    body: { label: 'Тип кузова', ph: 'Любой', items: BODY_KINDS },
  };
  const opts = (id) => Array.from($(id).options).filter((o) => o.value).map((o) => [o.value, o.text]);
  const SINGLE = {
    cap: { label: 'Грузоподъемность, т', items: opts('fCap') },
    vol: { label: 'Объем, м³', items: opts('fVol') },
    wt: { label: 'Вес груза, т', items: opts('fWt') },
  };

  const root = document.createElement('div');
  root.className = 'fd-root'; root.hidden = true;
  root.innerHTML = '<div class="fd-scrim" data-f="close"></div>' +
    '<aside class="fd" id="fd" role="dialog" aria-modal="true" aria-labelledby="fdTitle">' +
      '<div class="fd-head"><button type="button" class="fd-x" data-f="close" aria-label="Закрыть фильтры">' + IC.close + '</button>' +
        '<h2 id="fdTitle">Фильтры</h2><button type="button" class="fd-reset" data-f="reset">Сбросить</button></div>' +
      '<div class="fd-body"></div>' +
      '<div class="fd-foot"><button type="button" class="fd-go" data-f="close"></button></div>' +
    '</aside>';
  document.body.appendChild(root);
  const body = root.querySelector('.fd-body');
  const menu = document.createElement('div');
  menu.className = 'menu fd-menu'; document.body.appendChild(menu);
  let menuKey = null;

  const sel = (k) => (S[k] ? S[k].split(',') : []);
  const anyType = () => types.some((t) => S.types[t]);
  const active = () => !!(S.from || S.to || S.body || S.day || S.cap || S.vol || S.wt || anyType());

  // a select-looking field: value (or placeholder), «×» when filled, chevron otherwise
  const field = (k, text, filled, icon) =>
    '<button type="button" class="inp fd-sel' + (filled ? ' has' : '') + (menuKey === k ? ' open' : '') + '" data-f="open" data-k="' + k + '" aria-haspopup="' + (k === 'day' ? 'dialog' : 'listbox') + '" aria-expanded="' + (menuKey === k) + '">' +
      '<span' + (filled ? '' : ' class="ph"') + '>' + esc(text) + '</span>' +
      '<span class="fd-clr" data-f="clear" data-k="' + k + '" role="button" aria-label="Сбросить">' + IC.close + '</span>' + (icon ? '<i class="fd-ic keep">' + icon + '</i>' : '<i class="fd-ic">' + IC.chev + '</i>') + '</button>';
  const multiField = (k) => { const v = sel(k); return field(k, v.length ? v.join(', ') : MULTI[k].ph, !!v.length); };
  const singleField = (k) => { const it = SINGLE[k].items.find((x) => x[0] === S[k]); return field(k, it ? it[1] : 'Любой', !!it); };
  const wrap = (label, inner, id) => '<div class="fd-field"><span class="fd-label"' + (id ? ' id="' + id + '"' : '') + '>' + label + '</span>' + inner + '</div>';

  // «Грузоподъемность», «Объем», «Вес груза»: free range «от … до …» (stored as "a-b", see rangeText)
  const num = (x) => String(Math.round(x * 10) / 10).replace('.', ',');
  const RANGE = {
    cap: { label: 'Грузоподъемность', unit: 'т', val: (o) => o.t },
    vol: { label: 'Объем', unit: 'м³', val: (o) => o.m3 },
    wt: { label: 'Вес груза', unit: 'т', val: (o) => o.kg / 1000 },
  };
  Object.values(RANGE).forEach((R) => { const v = ALL.map(R.val); R.min = Math.min.apply(null, v); R.max = Math.max.apply(null, v); });
  function rangePair(k) {
    const R = RANGE[k]; let a = '', b = '';
    if (S[k]) { const r = S[k].split('-').map(Number); if (r[0] > 0) a = num(r[0]); if (r[1] < 999) b = num(r[1]); }
    return '<div class="fd-pair" role="group" aria-label="' + R.label + ', ' + R.unit + '">' +
      '<input class="inp" type="text" inputmode="decimal" data-k="' + k + '" data-r="a" aria-label="' + R.label + ' от, ' + R.unit + '" placeholder="от ' + num(R.min) + '" value="' + a + '">' +
      '<input class="inp" type="text" inputmode="decimal" data-k="' + k + '" data-r="b" aria-label="' + R.label + ' до, ' + R.unit + '" placeholder="до ' + num(R.max) + '" value="' + b + '"></div>';
  }
  body.addEventListener('input', (e) => {
    const f = e.target.closest('[data-r]'); if (!f) return; const k = f.dataset.k;
    f.value = f.value.replace(/[^\d.,]/g, '');
    const v = (r) => { const x = parseFloat(body.querySelector('[data-k="' + k + '"][data-r="' + r + '"]').value.replace(',', '.')); return isNaN(x) ? null : x; };
    const a = v('a'), b = v('b');
    set({ [k]: a === null && b === null ? '' : (a ?? 0) + '-' + (b ?? 999) });
  });

  function draw() {
    // keep the caret in a range input that is being typed into
    const ae = document.activeElement; const af = ae && ae.dataset && ae.dataset.r ? '[data-k="' + ae.dataset.k + '"][data-r="' + ae.dataset.r + '"]' : null;
    const caret = af ? ae.selectionStart : 0; const raw = af ? ae.value : '';
    const r = dayRange(S.day);
    body.innerHTML =
      wrap('Откуда', '<div class="fd-row">' + multiField('from') + '<button type="button" class="fd-swap" data-f="swap" aria-label="Поменять «Откуда» и «Куда» местами">' + IC.swap + '</button></div>') +
      wrap('Куда', multiField('to')) +
      wrap('Дата погрузки', field('day', r ? rangeLabel(r) : 'Любая дата', !!r, IC.cal)) +
      wrap('Тип кузова', multiField('body')) +
      wrap('Тип заказа', '<div class="fd-chips" role="group" aria-labelledby="fdType">' + types.map((t) => '<button type="button" class="chip" data-f="type" data-v="' + esc(t) + '" aria-pressed="' + !!S.types[t] + '">' + esc(t === 'Встречное' ? 'Встречное предложение' : t) + '</button>').join('') + '</div>', 'fdType') +
      wrap('Грузоподъемность, т', rangePair('cap')) +
      wrap('Объем, м³', rangePair('vol')) +
      wrap('Вес груза, т', rangePair('wt'));
    const n = filtered().length;
    root.querySelector('.fd-go').textContent = n ? 'Показать ' + n + ' ' + plural(n) : 'Ничего не найдено';
    root.querySelector('.fd-reset').disabled = !active();
    if (af) { const f = body.querySelector(af); if (f) { f.value = raw; f.focus({ preventScroll: true }); f.setSelectionRange(caret, caret); } } // keep exactly what is being typed («5,» → «5,5»)
  }

  // ---------- dropdown lists inside the drawer ----------
  function closeMenu() { if (menuKey === null) return; menuKey = null; menu.classList.remove('open'); body.querySelectorAll('.fd-sel.open').forEach((b) => { b.classList.remove('open'); b.setAttribute('aria-expanded', 'false'); }); }
  function placeList() {
    const b = body.querySelector('.fd-sel[data-k="' + menuKey + '"]'); if (!b) return closeMenu();
    const r = b.getBoundingClientRect(); menu.style.width = r.width + 'px'; menu.style.left = r.left + 'px';
    const h = menu.offsetHeight; const below = window.innerHeight - r.bottom;
    menu.style.top = (below < h + 12 && r.top > h + 12 ? r.top - h - 4 : r.bottom + 4) + 'px';
  }
  function fillList() {
    const k = menuKey;
    if (MULTI[k]) {
      const v = sel(k); menu.className = 'menu fd-menu msm open'; menu.setAttribute('role', 'menu');
      menu.innerHTML = MULTI[k].items.map((x) => '<button type="button" class="msi" role="menuitemcheckbox" data-v="' + esc(x) + '" aria-checked="' + (v.indexOf(x) > -1) + '">' + esc(x) + '</button>').join('');
    } else {
      menu.className = 'menu fd-menu open'; menu.setAttribute('role', 'listbox');
      menu.innerHTML = [['', 'Любой']].concat(SINGLE[k].items).map((x) => '<button type="button" class="mi" role="option" data-v="' + esc(x[0]) + '" aria-selected="' + (S[k] === x[0]) + '">' + esc(x[1]) + '</button>').join('');
    }
    placeList();
  }
  function openList(k) {
    if (menuKey === k) return closeMenu();
    closeMenu(); dpClose(); menuKey = k;
    const b = body.querySelector('.fd-sel[data-k="' + k + '"]'); b.classList.add('open'); b.setAttribute('aria-expanded', 'true');
    fillList(); (menu.querySelector('[aria-checked="true"],[aria-selected="true"]') || menu.firstElementChild).focus({ preventScroll: true });
  }
  menu.addEventListener('click', (e) => {
    e.stopPropagation();
    const it = e.target.closest('[data-v]'); if (!it) return; const k = menuKey;
    if (MULTI[k]) {
      const v = sel(k); const x = it.dataset.v; const i = v.indexOf(x); if (i > -1) v.splice(i, 1); else v.push(x);
      set({ [k]: MULTI[k].items.filter((y) => v.indexOf(y) > -1).join(',') });
      menuKey = k; fillList(); const again = menu.querySelector('[data-v="' + CSS.escape(x) + '"]'); if (again) again.focus({ preventScroll: true });
      const b = body.querySelector('.fd-sel[data-k="' + k + '"]'); if (b) { b.classList.add('open'); b.setAttribute('aria-expanded', 'true'); }
    } else {
      set({ [k]: it.dataset.v }); closeMenu(); const b = body.querySelector('.fd-sel[data-k="' + k + '"]'); if (b) b.focus();
    }
  });

  // ---------- open / close ----------
  let lastFocus = null;
  function open() {
    lastFocus = document.activeElement; closeDD(); msClose(); dpClose();
    draw(); root.hidden = false; document.body.classList.add('fd-lock'); trigger.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('fd-open')));
    root.querySelector('.fd-x').focus({ preventScroll: true });
  }
  function close() {
    if (root.hidden) return;
    closeMenu(); dpClose(); root.classList.remove('fd-open'); document.body.classList.remove('fd-lock'); trigger.setAttribute('aria-expanded', 'false');
    setTimeout(() => { if (!root.classList.contains('fd-open')) root.hidden = true; }, 260);
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }
  trigger.addEventListener('click', open);

  root.addEventListener('click', (e) => {
    const b = e.target.closest('[data-f]'); if (!b) { closeMenu(); return; }
    const k = b.dataset.k;
    switch (b.dataset.f) {
      case 'close': close(); break;
      case 'reset': closeMenu(); dpClose(); set({ from: '', to: '', body: '', day: '', cap: '', vol: '', wt: '', types: {} }); break; // the search query stays
      case 'swap': closeMenu(); set({ from: S.to, to: S.from }); break;
      case 'type': closeMenu(); set({ types: Object.assign({}, S.types, { [b.dataset.v]: !S.types[b.dataset.v] }) }); break;
      case 'clear': e.stopPropagation(); closeMenu(); dpClose(); set({ [k]: '' }); break;
      case 'open':
        if (k === 'day') { closeMenu(); dp.classList.contains('open') ? dpClose() : dpOpen(b); }
        else openList(k);
        break;
    }
  });
  document.addEventListener('click', (e) => { if (menuKey !== null && !menu.contains(e.target) && !e.target.closest('.fd-sel')) closeMenu(); }, true);
  document.addEventListener('keydown', (e) => {
    if (root.hidden || e.key !== 'Escape') return;
    if (menuKey !== null) { const k = menuKey; closeMenu(); const b = body.querySelector('.fd-sel[data-k="' + k + '"]'); if (b) b.focus(); return; }
    close();
  });
  // keep focus inside the open drawer
  root.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const f = Array.from(root.querySelectorAll('button:not([disabled])')).filter((x) => x.offsetParent !== null);
    if (!f.length) return; const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  body.addEventListener('scroll', () => { if (menuKey !== null) placeList(); if (dp.classList.contains('open')) dpPlace(); }, { passive: true });
  window.addEventListener('resize', () => { if (menuKey !== null) placeList(); });

  // every state change re-renders the list; refresh the drawer with it
  const baseRender = render;
  render = function () { baseRender(); if (!root.hidden) { const k = menuKey; draw(); if (k !== null) { menuKey = k; const b = body.querySelector('.fd-sel[data-k="' + k + '"]'); if (b) { b.classList.add('open'); b.setAttribute('aria-expanded', 'true'); } placeList(); } } };
})();
