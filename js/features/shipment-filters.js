'use strict';
/* ---------- «Мои перевозки»: filter chips and sheets ---------- */
/* shipments filters: each chip opens a multi-select sheet (like body type in search) */
const MANAGERS=['Иванова Анна','Петров Сергей','Смирнова Ольга'];
const shipMgr=s=>MANAGERS[[...s.id].reduce((a,ch)=>a+ch.charCodeAt(0),0)%MANAGERS.length];
const SHF_LBL={status:'Статус',from:'Откуда',to:'Куда',mgr:'Менеджер'};
const SHIP_TAB={active:s=>!['canceled','rejected'].includes(s.status),canceled:s=>s.status==='canceled',rejected:s=>s.status==='rejected'};
const shfVal={status:s=>s.status,from:s=>cargoById(s.id).from,to:s=>cargoById(s.id).to,mgr:shipMgr};
const shfName=(k,v)=>k==='status'?STATUS[v][0]:v;
const shfF=()=>S.shipF||(S.shipF={status:[],from:[],to:[],mgr:[]});
function shfOpts(k){const tab=S.shipments.filter(SHIP_TAB[S.shipTab]);const v=[...new Set(tab.map(shfVal[k]))];if(k==='mgr')MANAGERS.forEach(m=>v.includes(m)||v.push(m));if(k==='status')Object.keys(STATUS).filter(x=>SHIP_TAB[S.shipTab]({status:x})).forEach(x=>v.includes(x)||v.push(x));return v}
let SHD=null;
const shfSheet=k=>{const ch=SHD.sel.slice().sort().join()!==SHD.s0;return `<div class="row between"><h3 style="margin:0">${SHF_LBL[k]}</h3><button type="button" class="linkbtn" data-shfreset style="font-size:14px${SHD.sel.length?'':';visibility:hidden'}">Сбросить</button></div>
 <ul class="bd-list" role="list">${shfOpts(k).map(v=>{const on=SHD.sel.includes(v);return `<li><button type="button" class="bd-item" data-shfv="${esc(v)}" role="checkbox" aria-checked="${on}"><span class="grow">${esc(shfName(k,v))}</span><span class="bd-box">${on?ic('check','s'):''}</span></button></li>`}).join('')}</ul>
 <button type="button" class="btn primary block" data-shfdone>${ch?'Применить':'Закрыть'}</button>`};
function shfOpen(k){const cur=shfF()[k].slice();SHD={k,sel:cur,s0:cur.slice().sort().join()};sheet(shfSheet(k))}
document.addEventListener('click',e=>{const x=e.target.closest('[data-shfclear]');if(x){e.stopPropagation();e.preventDefault();shfF()[x.dataset.shfclear]=[];save();render();return}
 const c=e.target.closest('[data-shf]');if(c){e.stopPropagation();shfOpen(c.dataset.shf);return}
 if(!SHD||!e.target.closest('#layer'))return;
 const v=e.target.closest('[data-shfv]');if(v){e.stopPropagation();const x=v.dataset.shfv,i=SHD.sel.indexOf(x);i<0?SHD.sel.push(x):SHD.sel.splice(i,1);sheet(shfSheet(SHD.k));return}
 if(e.target.closest('[data-shfreset]')){e.stopPropagation();SHD.sel=[];sheet(shfSheet(SHD.k));return}
 if(e.target.closest('[data-shfdone]')){e.stopPropagation();shfF()[SHD.k]=SHD.sel.slice();SHD=null;save();closeSheet();render()}},true);
/* all shipment filters in one sheet (filter icon chip) */
let SHA=null;
const shaAny=F=>Object.values(F).some(a=>a.length);
const shaSheet=()=>{const ch=JSON.stringify(SHA.f)!==SHA.f0;return `<div class="row between"><h3 style="margin:0">Фильтры</h3><button type="button" class="linkbtn" data-shareset style="font-size:14px${shaAny(SHA.f)?'':';visibility:hidden'}">Сбросить</button></div>
 ${Object.keys(SHF_LBL).map(k=>`<div class="sec" style="gap:8px"><b style="font-weight:500">${SHF_LBL[k]}</b><div class="chips" style="flex-wrap:wrap">${shfOpts(k).map(v=>`<button type="button" class="chip xopt" data-shav="${k}|${esc(v)}" aria-pressed="${SHA.f[k].includes(v)}">${esc(shfName(k,v))}</button>`).join('')}</div></div>`).join('')}
 <button type="button" class="btn primary block" data-shadone>${ch?'Применить':'Закрыть'}</button>`};
document.addEventListener('click',e=>{if(e.target.closest('[data-shall]')){e.stopPropagation();const f=JSON.parse(JSON.stringify(shfF()));SHA={f,f0:JSON.stringify(f)};sheet(shaSheet());return}
 if(!SHA||!e.target.closest('#layer'))return;
 const v=e.target.closest('[data-shav]');if(v){e.stopPropagation();const [k,x]=v.dataset.shav.split('|'),a=SHA.f[k],i=a.indexOf(x);i<0?a.push(x):a.splice(i,1);sheet(shaSheet());return}
 if(e.target.closest('[data-shareset]')){e.stopPropagation();Object.keys(SHA.f).forEach(k=>SHA.f[k]=[]);sheet(shaSheet());return}
 if(e.target.closest('[data-shadone]')){e.stopPropagation();S.shipF=SHA.f;SHA=null;save();closeSheet();render()}},true);
const shfChip=k=>{const sel=shfF()[k];return `<button class="chip" data-shf="${k}" aria-haspopup="dialog" aria-pressed="${sel.length>0}">${sel.length===1?esc(shfName(k,sel[0])):SHF_LBL[k]+(sel.length>1?' · '+sel.length:'')} ${sel.length?`<span class="chip-x" role="button" aria-label="Сбросить ${SHF_LBL[k]}" data-shfclear="${k}">${ic('x','s')}</span>`:ic('chevD','s')}</button>`};
