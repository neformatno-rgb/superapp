'use strict';
/* ---------- counter offer: «Тариф заказчика / Встречное», «Мои ставки», wait timer ---------- */
/* counter offer: cargo with deal «Встречное» → carrier proposes own price → it lands in «Мои ставки» */
const CO_WAIT=30*60;
S.bids.forEach(b=>{if(!b.at)b.at=Date.now()});
const bidOf=id=>S.bids.find(b=>b.id===id);
const bidRow=b=>`<hr class="hr"><div class="row between"><span class="muted" style="font-size:13px;line-height:18px">Ваше предложение</span><b class="num price">${rub(b.amount)}</b></div><button type="button" class="btn primary block" data-cobid="${b.id}">Отправить предложение</button>`;
const bidCards=()=>S.bids.map(b=>cargoCard(cargoById(b.id),{bid:b})).join('')+aucIds().map(id=>cargoCard(cargoById(id),{auc:true})).join('');
const coLeft=b=>Math.max(0,CO_WAIT-Math.floor((Date.now()-b.at)/1000));
const coWaitText=b=>{const t=coLeft(b);return `Ожидание ответа ${String(Math.floor(t/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`};
const rubIn=n=>n?n.toLocaleString('ru-RU')+' ₽':'';
const coInput=(c,b)=>`<div class="co-row"><input class="input num" id="coIn" data-co="${c.id}" inputmode="numeric" enterkeyhint="send" autocomplete="off" aria-label="Ваша цена" placeholder="Ваша цена, ₽" value="${b?rubIn(Math.round(b.amount*vatK())):''}"><button type="button" class="co-send" data-cosend aria-label="Отправить предложение"${b?'':' disabled'}>${ic('chevR','s')}</button></div>`;
/* «Стоимость» for cargo with a counter offer: customer tariff vs own price */
/* one shared open/closed state for «Способы оплаты» in both tabs */
/* payment options as gray cards; they scroll sideways when they don't fit */
const payCards=c=>`<div class="pay-cards">${PAYS.map(p=>`<div class="pay-card"><span style="color:var(--accent);display:inline-flex">${TILES[p.icon]||ic(p.icon)}</span><span class="pc-name">${p.name}</span><span class="pc-line"><b class="num">${rub(payAmt(c,p))}</b><span class="pc-tag num">${p.days}</span></span></div>`).join('')}</div>`;
/* collapsed by default for every cargo; open/closed is shared between the tabs of the same cargo */
let PAY_OPEN=false,PAY_FOR=null;
const payAcc=c=>{if(PAY_FOR!==c.id){PAY_FOR=c.id;PAY_OPEN=false}return `<details class="pay-acc"${PAY_OPEN?' open':''}><summary>Способы оплаты${ic('chevD','s')}</summary>${payCards(c)}<div class="row between pay-acc-bonus"><span>Начислим бонусы</span><span class="bonus-pill">${coin}<span class="num">+${c.bonus}</span></span></div></details>`};
const tariffPane=c=>`<div class="cost-box"><div class="muted" style="font-size:13px;line-height:18px">Стоимость перевозки</div><b class="num price">${rub(c.price)}</b></div>${payAcc(c)}<button class="btn primary block" data-go="apply" data-p="${c.id}">Забрать груз</button>`;
const coPane=(c,inSheet)=>{const t=S.coTab==='counter'?'counter':'tariff',b=bidOf(c.id),edit=S.coEdit===c.id;
 const wait=b&&!inSheet?`<div class="co-wait" data-cowait="${c.id}">${coWaitText(b)}</div>`:'';
 return wait+seg('coTab',[['tariff','Тариф заказчика'],['counter','Встречное']],t)+(t==='tariff'
 ?tariffPane(c)
 :b&&!edit?`<div class="grid2 co-pair"><div class="cost-box"><div class="muted">Начальная цена</div><b class="num price">${rub(c.price)}</b></div><div class="cost-box mine"><div class="muted">Ваше предложение</div><b class="num price">${rub(b.amount)}</b></div></div>${payAcc(c)}<button type="button" class="btn primary block" data-coedit="${c.id}">Изменить предложение</button>`
 :coInput(c,edit?b:null))+vatFoot()};
const coCta=c=>{const b=bidOf(c.id);return `<div class="cta-bar co-cta" id="ctaBar" aria-hidden="true">
 <div class="co-cta-col" data-go="apply" data-p="${c.id}"><b class="num">${rub(c.price)}</b><span class="muted">Тариф заказчика</span><button class="btn primary block" data-go="apply" data-p="${c.id}" tabindex="-1">Забрать груз</button></div>
 <div class="co-cta-col" data-coscroll><b class="num${b?' muted':''}">${b?rub(b.amount):'Своя цена'}</b><span class="muted">${b?'Ожидание ответа':'Встречное'}</span><button type="button" class="btn secondary block" data-coscroll tabindex="-1">Предложить цену</button></div></div>`};
const vatFoot=()=>`<hr class="hr vat-hr"><div class="vat-foot">Цены указаны <button class="linkbtn" data-sheet="vat" aria-haspopup="dialog">${S.vat?`с учетом НДС ${S.vat}%`:'без НДС'} ${ic('chevD','s')}</button></div>`;
const coVal=()=>{const i=document.getElementById('coIn');return i?+(i.value.replace(/\D/g,''))||0:0};
function coRefresh(){const b=document.querySelector('[data-cosend]');if(b)b.disabled=!coVal()}
const coRerender=()=>{const y=window.scrollY;render();window.scrollTo(0,y);if(typeof coSheetRefresh==='function')coSheetRefresh()};
function coSend(){const n=coVal();if(!n)return;const id=document.getElementById('coIn').dataset.co;
 S.bids=S.bids.filter(b=>b.id!==id);S.bids.unshift({id,amount:Math.round(n/vatK()),at:Date.now()});S.coEdit=null;save();coRerender();toast('Предложение отправлено, оно в «Мои ставки»')}
document.addEventListener('input',e=>{if(e.target.id!=='coIn')return;const i=e.target;i.value=rubIn(coVal());const k=i.value.length-2;if(k>0)i.setSelectionRange(k,k);coRefresh()});
document.addEventListener('keydown',e=>{if(e.target.id!=='coIn')return;const i=e.target;
 if(e.key==='Enter'){e.preventDefault();coSend();return}
 if(e.key==='Backspace'&&i.selectionStart===i.selectionEnd&&i.selectionStart>=i.value.length-2){e.preventDefault();i.value=rubIn(Math.floor(coVal()/10));const k=i.value.length-2;if(k>0)i.setSelectionRange(k,k);coRefresh()}});
document.addEventListener('click',e=>{const ed=e.target.closest('[data-coedit]');if(ed){e.stopPropagation();S.coEdit=ed.dataset.coedit;save();coRerender();const i=document.getElementById('coIn');if(i){i.focus({preventScroll:true});const k=i.value.length-2;if(k>0)i.setSelectionRange(k,k)}return}
 if(e.target.closest('[data-cosend]')){e.stopPropagation();coSend()}},true);
document.addEventListener('click',e=>{if(!e.target.closest('[data-coscroll]'))return;e.stopPropagation();S.coTab='counter';save();render();
 const sec=document.getElementById('costSec');if(!sec)return;const top=sec.getBoundingClientRect().top+window.scrollY-72;window.scrollTo({top,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
 const i=document.getElementById('coIn');if(i)setTimeout(()=>i.focus({preventScroll:true}),400)},true);
/* «Отправить предложение» on a bid card: the whole cost block in a bottom sheet */
const coSheetHtml=id=>`<div class="co-sheet" id="coSheetBody" data-c="${id}">${coPane(cargoById(id),true)}</div>`;
function coSheetRefresh(){const el=document.getElementById('coSheetBody');if(!el)return;if(el.dataset.k==='auc'){el.innerHTML=aucPane(cargoById(el.dataset.c),true);return}if(!bidOf(el.dataset.c)&&S.coEdit===el.dataset.c)S.coEdit=null;el.innerHTML=coPane(cargoById(el.dataset.c),true)}
function coFocus(){const i=document.getElementById('coIn');if(i){i.focus({preventScroll:true});const k=i.value.length-2;if(k>0)i.setSelectionRange(k,k)}}
document.addEventListener('click',e=>{const t=e.target.closest('[data-cobid]');if(t){e.stopPropagation();const id=t.dataset.cobid;S.coTab='counter';S.coEdit=null;save();sheet(coSheetHtml(id));return}
 const g=e.target.closest('#coSheetBody [data-seg]');if(g){e.stopPropagation();S[g.dataset.seg]=g.dataset.val;save();coSheetRefresh();return}
 const as=e.target.closest('[data-aucsheet]');if(as){e.stopPropagation();const id=as.dataset.aucsheet;S.aucTab='auction';save();sheet(`<div class="co-sheet" id="coSheetBody" data-k="auc" data-c="${id}">${aucPane(cargoById(id),true)}</div>`)}},true);
document.addEventListener('toggle',e=>{if(e.target.classList&&e.target.classList.contains('pay-acc')){PAY_OPEN=e.target.open;save()}},true);
/* when the wait runs out the offer expires: the cargo leaves «Мои ставки» and goes back to «Все грузы» */
function coExpire(){const n=S.bids.length;S.bids=S.bids.filter(b=>coLeft(b)>0);if(S.bids.length===n)return false;if(S.coEdit&&!bidOf(S.coEdit))S.coEdit=null;save();return true}
coExpire();
setInterval(()=>{if(coExpire()){const a=document.activeElement;if(!(a&&a.id==='coIn'))coRerender();return}
 document.querySelectorAll('[data-cowait]').forEach(el=>{const b=bidOf(el.dataset.cowait);if(b)el.textContent=coWaitText(b)})},1000);
