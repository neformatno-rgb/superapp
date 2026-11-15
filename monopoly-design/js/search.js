/* Search field collapses into an icon button when the tabs row is tight. */
'use strict';

// ---------- search collapses into an icon button when the tabs row is tight ----------
const srch = $('srch'), srchBtn = $('srchBtn'), tabsRow = srch.parentElement;
function fitSearch() {
  if (window.matchMedia('(max-width:767px)').matches) { srch.classList.remove('collapsed', 'expanded'); srchBtn.setAttribute('aria-expanded', 'true'); return; }
  const tabsW = Array.from(tabsRow.querySelectorAll('.tab')).reduce((a, t) => a + t.offsetWidth + 8, 0);
  const tight = tabsW + 260 + 16 > tabsRow.clientWidth;
  srch.classList.toggle('collapsed', tight);
  if (!tight) srch.classList.remove('expanded');
  srchBtn.setAttribute('aria-expanded', !tight || srch.classList.contains('expanded'));
}
srchBtn.addEventListener('click', () => {
  if (!srch.classList.contains('collapsed')) { $('q').focus(); return; }
  srch.classList.add('expanded'); srchBtn.setAttribute('aria-expanded', 'true'); $('q').focus();
});
$('q').addEventListener('blur', () => { setTimeout(() => { if (!$('q').value && !srch.contains(document.activeElement)) { srch.classList.remove('expanded'); fitSearch(); } }, 120); });
window.addEventListener('resize', fitSearch);
$('side').addEventListener('transitionend', fitSearch);
