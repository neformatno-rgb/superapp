'use strict';
/* ---------- formatting & VAT helpers ---------- */
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const plural=(n,a,b,c)=>{const m=n%10,h=n%100;return n+' '+(m===1&&h!==11?a:m>=2&&m<=4&&(h<12||h>14)?b:c)};
const VATS=[0,7,15,22];const vatK=()=>1+((typeof S!=='undefined'&&S.vat)||0)/100;
const vatText=v=>v?`Цены с НДС ${v}%`:'Цены без НДС';
const vatBtn=()=>`<button class="linkbtn" data-sheet="vat" aria-haspopup="dialog">${vatText(S.vat||0)} ${ic('chevD','s')}</button>`;
const rub=n=>Math.round(n*vatK()).toLocaleString('ru-RU').replace(/,/g,' ')+' ₽';
