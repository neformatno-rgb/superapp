'use strict';
/* ---------- tracking: saved searches, edit sheet, ⋮ menu ---------- */
/* «Редактировать» opens a sheet with every filter parameter; the page filters are restored when it closes */
let WE=null;
function weHtml(){const form=filterForm().replace('class="card" id="filterForm"','class="sec" id="filterForm"').replace(/<div class="row"><button class="btn primary grow" type="submit">[\s\S]*?<\/div>\s*<\/form>/,'</form>');
 return `<div id="weBody" class="sec" style="gap:12px"><h3 style="margin:0">Редактировать отслеживание</h3>${form}${['cap','vol','wt'].map(k=>`<div class="sec" style="gap:8px"><b style="font-weight:500">${RG[k].title}</b>${rgFields(XD,k)}</div>`).join('')}
 <div class="row between" style="padding:4px 0"><span>Только с быстрой оплатой</span><button type="button" class="switch" role="switch" aria-checked="${!!XD.fast}" data-wefast aria-label="Только с быстрой оплатой"></button></div>
 <button type="button" class="btn primary block" data-wesave>Сохранить</button></div>`}
function weOpen(i){const w=S.watch[i];WE={i,f:JSON.parse(JSON.stringify(S.filters)),x:JSON.parse(JSON.stringify(S.extra||xfEmpty()))};S.filters=JSON.parse(JSON.stringify(w.f));XD=Object.assign(xfEmpty(),JSON.parse(JSON.stringify(w.x||{})));sheet(weHtml())}
function weRestore(){if(!WE)return;S.filters=WE.f;S.extra=WE.x;WE=null;save()}
function weSave(){const ff=document.getElementById('filterForm');if(!ff||!WE)return;const f=S.filters;f.from=ff.querySelector('#fFrom').value;f.to=ff.querySelector('#fTo').value;f.dateFrom=ff.querySelector('#fDf').value;f.dateTo=ff.querySelector('#fDt').value;f.body=ff.querySelector('#fBody').value;
 if(paramCount(f,XD)<2){toast('Заполните хотя бы 2 параметра фильтра');return}
 const item={key:watchKey(f,XD),f:JSON.parse(JSON.stringify(f)),x:JSON.parse(JSON.stringify(XD)),label:watchLabel(f)};item.desc=watchDesc(item.f,item.x);S.watch[WE.i]=item;weRestore();closeSheet();const y=window.scrollY;render();window.scrollTo(0,y);toast('Отслеживание обновлено')}
document.addEventListener('click',e=>{if(e.target.closest('[data-wesave]')){e.stopPropagation();weSave();return}
 const fs=e.target.closest('[data-wefast]');if(fs){e.stopPropagation();XD.fast=!XD.fast;fs.setAttribute('aria-checked',String(XD.fast))}},true);
document.addEventListener('submit',e=>{if(WE&&e.target.id==='filterForm'){e.preventDefault();e.stopImmediatePropagation();weSave()}},true);
/* closing the sheet without saving puts the page filters back */
new MutationObserver(()=>{if(WE&&!document.getElementById('weBody'))weRestore()}).observe(document.getElementById('layer'),{childList:true,subtree:true});
/* tracking cards: ⋮ menu with «Редактировать» / «Удалить» */
function wmenuClose(){document.querySelectorAll('.wmenu:not([hidden])').forEach(m=>{m.hidden=true;const b=m.parentElement.querySelector('[data-wmenu]');if(b)b.setAttribute('aria-expanded','false')})}
document.addEventListener('click',e=>{const k=e.target.closest('[data-wmenu]');
 if(k){e.stopPropagation();const m=k.closest('.wcard').querySelector('.wmenu'),open=m.hidden;wmenuClose();m.hidden=!open;k.setAttribute('aria-expanded',String(open));return}
 const ed=e.target.closest('[data-wedit]');if(ed){e.stopPropagation();wmenuClose();weOpen(+ed.dataset.wedit);return}
 const dl=e.target.closest('[data-wdel]');if(dl){e.stopPropagation();S.watch.splice(+dl.dataset.wdel,1);S.editWatch=null;save();const y=window.scrollY;render();window.scrollTo(0,y);toast('Отслеживание удалено');return}
 if(e.target.closest('[data-newwatch]')){e.stopPropagation();S.searchTab='all';S.editWatch=null;save();go('search');return}
 if(!e.target.closest('.wmenu'))wmenuClose()},true);
