/* Tooltips for the collapsed side menu. */
'use strict';

(function(){
const side = $('side'), tip = document.createElement('div');
tip.className = 'tip'; tip.setAttribute('role','tooltip'); tip.id = 'navTip';
document.body.appendChild(tip);
let cur = null;
const hide = () => { tip.classList.remove('show'); if (cur) cur.removeAttribute('aria-describedby'); cur = null; };
const show = (el) => {
  const lb = el.querySelector('.lb'); if (!lb) return;
  if (side.getBoundingClientRect().width > 100) { hide(); return; }
  cur = el; tip.textContent = lb.textContent.trim();
  const r = el.getBoundingClientRect();
  tip.style.left = (r.right + 12) + 'px'; tip.style.top = (r.top + r.height / 2) + 'px';
  el.setAttribute('aria-describedby','navTip');
  requestAnimationFrame(() => tip.classList.add('show'));
};
side.querySelectorAll('.nv').forEach(el => {
  el.addEventListener('mouseenter', () => show(el));
  el.addEventListener('focus', () => { if (el.matches(':focus-visible')) show(el); });
  el.addEventListener('mouseleave', hide);
  el.addEventListener('blur', hide);
  el.addEventListener('click', hide);
});
side.addEventListener('scroll', hide, true);
window.addEventListener('scroll', hide, {passive:true});
document.addEventListener('keydown', e => { if (e.key === 'Escape') hide(); });
})();
