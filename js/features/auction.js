'use strict';
/* ---------- auction: «Тариф заказчика / Аукцион», bid clicker (only down, by the auction step) ---------- */
if(!S.auc||typeof S.auc!=='object')S.auc={};
const hashId=id=>[...id].reduce((a,ch)=>a*31+ch.charCodeAt(0)>>>0,7);
const AUC=c=>{const h=hashId(c.id),step=Math.max(100,Math.round(c.price*0.01/100)*100),n0=h%4;return {start:c.price,step,min:Math.round(c.price*0.75/step)*step,n0,best0:n0?c.price-n0*step:null,rival:h%2===1}};
function aucState(c){const a=AUC(c),u=S.auc[c.id]||{},vals=[a.best0,u.my,u.rival].filter(v=>v!=null),best=vals.length?Math.min(...vals):null;
 const mine=u.my!=null&&best===u.my&&!(u.rival!=null&&u.rival<=u.my);
 const count=u.n||0,total=a.n0+(u.n||0)+(u.rival!=null?1:0); /* counter = my bids only */
 const max=(best??a.start)-a.step;
 const ended=!(c.timer>0);
 const status=ended?(mine?['Вы победили','blue']:['Торги завершены','gray']):!total?['Ставок не было','gray']:u.my==null?['Идут торги','gray']:mine?['Выигрываю','green']:['Проигрываю','red'];
 const draft=Math.min(max,Math.max(a.min,u.draft??max));
 return {...a,u,best,mine,count,max,status,draft,ended,won:ended&&mine,can:max>=a.min&&!ended}}
const aucTimer=c=>{const t=c.timer||0;return t?`Осталось ${t>=3600?String(Math.floor(t/3600)).padStart(2,'0')+':':''}${String(Math.floor(t%3600/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`:'Торги завершены'};
const aucBody=c=>{const st=aucState(c);return `<div class="auc-click"><button type="button" data-aucstep="-1" data-c="${c.id}" aria-label="Понизить на шаг"${!st.can||st.draft-st.step<st.min?' disabled':''}>−</button><div class="auc-val"><b class="num">${rub(st.can?st.draft:st.min)}</b></div><button type="button" data-aucstep="1" data-c="${c.id}" aria-label="Повысить на шаг"${!st.can||st.draft+st.step>st.max?' disabled':''}>+</button></div>
 <dl class="kv num"><dt>Минимальная ставка</dt><dd>${rub(st.min)}</dd><dt>Начальная цена</dt><dd>${rub(st.start)}</dd><dt>Шаг аукциона</dt><dd>${rub(st.step)}</dd></dl>`};
const aucBand=c=>{const st=aucState(c);return `<div class="co-wait auc-band ${st.status[1]}">${tag(st.status[0],st.status[1])}<span class="num" data-auctimer="${c.id}">${aucTimer(c)}</span><span class="auc-count">Ставок<b class="num${st.count?' on':''}">${st.count}</b></span></div>`};
/* my auction lots: listed in «Мои ставки» / «Мои торги» and hidden from «Все грузы» */
const aucIds=()=>Object.keys(S.auc||{}).filter(id=>S.auc[id].my!=null&&cargoById(id));
const bidCount=()=>S.bids.length+aucIds().length;
const bidsBody=()=>{const co=S.bids.length,au=aucIds();if(!co&&!au.length)return '';let first=true;const hd=t=>{const r=`<div class="row between"><b style="font-size:16px">${t}</b>${first?vatBtn():''}</div>`;first=false;return r};
 return (co?hd('Встречное предложение')+S.bids.map(b=>cargoCard(cargoById(b.id),{bid:b})).join(''):'')+(au.length?hd('Аукцион')+au.map(id=>cargoCard(cargoById(id),{auc:true})).join(''):'')};
const aucRow=c=>{const u=S.auc[c.id]||{};return `<hr class="hr"><div class="row between"><span class="muted" style="font-size:13px;line-height:18px">Ваша ставка</span><b class="num price">${rub(u.my)}</b></div>${aucState(c).won?`<button type="button" class="btn primary block" data-go="apply" data-p="${c.id}">Оформить заявку</button>`:`<button type="button" class="btn primary block" data-aucsheet="${c.id}"${aucState(c).ended?' disabled':''}>Сделать ставку</button>`}`};
const aucPane=(c,inSheet)=>{const t=S.aucTab==='tariff'&&isFix(c)?'tariff':'auction';
 return (inSheet?'':aucBand(c))+(isFix(c)?seg('aucTab',[['tariff','Тариф заказчика'],['auction','Аукцион']],t):'')+(t==='tariff'?tariffPane(c):aucBody(c)+payAcc(c)+aucBtn(c))+vatFoot()};
const aucBtn=c=>{const st=aucState(c);return st.won?`<button type="button" class="btn primary block" data-go="apply" data-p="${c.id}">Оформить заявку</button>`:`<button type="button" class="btn primary block" data-aucbid="${c.id}"${st.can?'':' disabled'}>${st.u.my==null?'Сделать первую ставку':'Сделать ставку'}</button>`};
const aucCta=c=>{const st=aucState(c);return `<div class="cta-bar co-cta" id="ctaBar" aria-hidden="true">
 ${isFix(c)?`<div class="co-cta-col" data-go="apply" data-p="${c.id}"><b class="num">${rub(c.price)}</b><span class="muted">Тариф заказчика</span><button class="btn primary block" data-go="apply" data-p="${c.id}" tabindex="-1">Забрать груз</button></div>`:''}
 <div class="co-cta-col" ${st.won?'data-go="apply" data-p="'+c.id+'"':'data-aucscroll'}><b class="num${st.mine?'':' muted'}">${st.best!=null?rub(st.best):'Ставок нет'}</b><span class="muted">${st.status[0]}</span><button type="button" class="btn ${isFix(c)?'secondary':'primary'} block" ${st.won?'data-go="apply" data-p="'+c.id+'"':'data-aucscroll'} tabindex="-1">${st.won?'Оформить заявку':'Сделать ставку'}</button></div></div>`};
function aucBid(id){const c=cargoById(id),st=aucState(c);if(!st.can)return;const u=S.auc[id]=S.auc[id]||{};u.my=st.draft;u.n=(u.n||0)+1;u.draft=null;if(u.rival!=null&&u.rival>=u.my)u.rival=null;save();coRerender();toast('Ставка принята: '+rub(u.my));
 /* demo: on some lots a rival undercuts you a bit later */
 if(st.rival&&!u.rivalDone){u.rivalDone=true;save();setTimeout(()=>{const s2=aucState(c),v=s2.u.my-s2.step;if(s2.u.my!=null&&s2.mine&&v>=s2.min){s2.u.rival=v;save();coRerender();toast('Вашу ставку перебили')}},20000)}}
document.addEventListener('click',e=>{const k=e.target.closest('[data-aucstep]');if(k){e.stopPropagation();const c=cargoById(k.dataset.c),st=aucState(c),u=S.auc[c.id]=S.auc[c.id]||{};u.draft=Math.min(st.max,Math.max(st.min,st.draft+(+k.dataset.aucstep)*st.step));save();coRerender();return}
 const b=e.target.closest('[data-aucbid]');if(b){e.stopPropagation();aucBid(b.dataset.aucbid);return}
 if(e.target.closest('[data-aucscroll]')){e.stopPropagation();S.aucTab='auction';save();render();const sec=document.getElementById('costSec');if(sec)window.scrollTo({top:sec.getBoundingClientRect().top+window.scrollY-72,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}},true);
setInterval(()=>{let end=false;document.querySelectorAll('[data-auctimer]').forEach(el=>{const c=cargoById(el.dataset.auctimer);if(!c)return;el.textContent=aucTimer(c);const bd=el.closest('.auc-band');if(!(c.timer>0)&&bd&&!/Вы победили|Торги завершены/.test(bd.querySelector('.tag').textContent))end=true});if(end)coRerender()},1000);
