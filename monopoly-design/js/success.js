/* Success page («Заявка успешно сформирована»): opened from checkout as success.html?id=<order id>. */
'use strict';

const okEl = $('ok');
const okId = new URLSearchParams(location.search).get('id');
const theme = { get: () => store.get('theme', 'light') };
const toList = () => { location.href = 'index.html'; };

okEl.innerHTML =
  '<div class="ok-head phead"><button type="button" class="dback" data-o="back">' + DI.back + 'К грузам</button></div>' +
  '<section class="ok-card" aria-labelledby="okTitle">' +
    '<div class="ok-txt"><h1 id="okTitle">Заявка успешно сформирована</h1>' +
    '<p>Найти заявку можно в разделе «Мои перевозки». Дождитесь, пока экспедитор подтвердит перевозку.</p>' +
    '<button type="button" class="ok-btn" data-o="trips">Мои перевозки</button></div>' +
    '<div class="ok-ill" aria-hidden="true"><img src="assets/img/order-success.png" alt=""></div>' +
  '</section>';

okEl.addEventListener('click', (e) => {
  const b = e.target.closest('[data-o]'); if (!b) return;
  if (b.dataset.o === 'back') toList();
  else if (b.dataset.o === 'trips') toast('Раздел «Мои перевозки» появится в следующей итерации');
});

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
document.querySelector('.mbk').addEventListener('click', toList);
{ const s = $('mSub'); if (s) s.hidden = true; }
let tt;
function toast(msg) { const t = $('toast'); t.textContent = msg; t.hidden = false; t.style.animation = 'none'; void t.offsetWidth; t.style.animation = ''; clearTimeout(tt); tt = setTimeout(() => { t.hidden = true; }, 2600); }

chrome();
document.title = 'Заявка сформирована — Монополия';
initPageHead(() => okEl.querySelector('.phead'), () => true)();
