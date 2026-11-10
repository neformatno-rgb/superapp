'use strict';
/* sliding CTA in order view */
let ctaObs=null;
function setupCta(){if(ctaObs){ctaObs.disconnect();ctaObs=null}const sec=document.getElementById('costSec'),bar=document.getElementById('ctaBar');if(!sec||!bar)return;
 const set=v=>{bar.classList.toggle('show',v);bar.setAttribute('aria-hidden',String(!v));bar.querySelector('button').tabIndex=v?0:-1};
 if(!('IntersectionObserver' in window)){set(true);return}
 ctaObs=new IntersectionObserver(([e])=>set(!e.isIntersecting&&e.boundingClientRect.top<0),{threshold:0});ctaObs.observe(sec)}
