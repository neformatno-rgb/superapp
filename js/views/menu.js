'use strict';
V.menu=()=>topBar('Меню')+`<div class="page"><section class="card" style="gap:0;padding:4px 12px">
 ${[['shipments','route','Мои перевозки'],['search','box','Поиск грузов'],['home','wallet','Финансы']].map(([v,i,l],n,a)=>`<a href="#${v}" class="row" style="padding:12px 0;color:var(--fg);text-decoration:none${n<a.length-1?';border-bottom:1px solid var(--line)':''}">${ic(i)}<span class="grow">${l}</span>${ic('chevR','s')}</a>`).join('')}</section>
 <section class="card" style="gap:0;padding:4px 12px"><button class="row" data-theme-toggle role="switch" aria-checked="${isDark()}" style="padding:12px 0;border:0;background:none;width:100%;text-align:left;color:var(--fg)">${ic('moon')}<span class="grow">Тёмная тема</span><span class="switch" aria-checked="${isDark()}" aria-hidden="true"></span></button></section>
 <section class="card" style="gap:0;padding:4px 12px"><button class="row" data-reset style="padding:12px 0;border:0;background:none;width:100%;text-align:left;color:var(--red)">${ic('reset')}<span class="grow">Сбросить демо-данные</span></button></section>
 <p class="demo-note">Кабинет перевозчика · демо по макетам Android</p></div>`;
/* theme: follows the system until chosen in the menu; the choice is remembered on this device */
const THEME_KEY='perevozchik-theme';
const isDark=()=>{const t=document.documentElement.getAttribute('data-theme');return t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches};
function setTheme(t){document.documentElement.setAttribute('data-theme',t);try{localStorage.setItem(THEME_KEY,t)}catch(e){}}
try{const t=localStorage.getItem(THEME_KEY);if(t==='dark'||t==='light')document.documentElement.setAttribute('data-theme',t)}catch(e){}
