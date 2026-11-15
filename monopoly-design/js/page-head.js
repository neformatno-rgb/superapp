/* Component: page head (see css/components/page-head.css).
   initPageHead(getHead, isActive) — getHead returns the current .phead element (pages may re-render it),
   isActive says whether the head is on screen. Returns sync() to call after re-rendering. */
'use strict';

function initPageHead(getHead, isActive) {
  const bar = document.createElement('div'); bar.className = 'dbar'; bar.setAttribute('aria-hidden', 'true'); document.body.appendChild(bar);
  const main = document.querySelector('.main');
  const sync = () => {
    const head = window.innerWidth >= 768 && isActive() && getHead();
    // swap only once the head has reached the very top, so nothing jumps
    const on = !!head && window.scrollY > 0 && head.getBoundingClientRect().top <= 0.5;
    document.body.classList.toggle('hdr-hide', on);
    if (on) bar.style.left = main.getBoundingClientRect().left + 'px';
  };
  window.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync);
  return sync;
}
