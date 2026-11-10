'use strict';
/* ---------- events ---------- */
document.addEventListener('click',e=>{
 const t=e.target.closest('button,a,article,[data-close]');if(!t)return;
 const d=t.dataset;
 if(t.classList.contains('scrim')&&e.target!==t)return;
 if('close' in d&&(e.target===t||t.tagName==='BUTTON')){closeSheet();return}
 if(d.vat!==undefined){S.vat=+d.vat;save();closeSheet();const y=window.scrollY;render();window.scrollTo(0,y);toast(vatText(S.vat));return}
 if('xfopen' in d){openXf();return}
 if(d.rgopen){openRg(d.rgopen);return}
 if(d.rgclear){const k=d.rgclear;S.extra=Object.assign(xfEmpty(),S.extra||{},{[k+'From']:'',[k+'To']:''});save();const y=window.scrollY;render();window.scrollTo(0,y);return}
 if(d.xf){const [k,v]=d.xf.split(':'),a=XD[k],i=a.indexOf(v);i<0?a.push(v):a.splice(i,1);document.querySelector('.sheet').innerHTML='<div class="grab"></div>'+xfSheet();return}
 if('xffast' in d){XD.fast=!XD.fast;document.querySelector('.sheet').innerHTML='<div class="grab"></div>'+xfSheet();return}
 if('xfreset' in d){XD=xfEmpty();document.querySelector('.sheet').innerHTML='<div class="grab"></div>'+xfSheet();return}
 if('xfapply' in d){S.extra=XD;save();closeSheet();render();return}
 if('xffastchip' in d){S.extra=S.extra||xfEmpty();S.extra.fast=!S.extra.fast;save();const y=window.scrollY;render();window.scrollTo(0,y);return}
 if(d.sort){S.sort=d.sort;save();closeSheet();render();return}
 if(d.tl){const [k,i]=d.tl.split('|');TL[k]=TL[k]===+i?-1:+i;const y=window.scrollY;render();window.scrollTo(0,y);return}
 if(d.stop){const [id,i]=d.stop.split(':');openPts[id]=openPts[id]===+i?-1:+i;const y=window.scrollY;render();window.scrollTo(0,y);return}
 if(d.fullmap){e.preventDefault();e.stopPropagation();openFullMap(d.fullmap);return}
 if('closemap' in d){FM=null;closeSheet();return}
 if(d.zoom){zoomAt(+d.zoom);return}
 if('zoomfit' in d){FM.vb=routeBox(FM.c,80);fitLabels();return}
 if(d.fav){e.stopPropagation();const i=S.fav.indexOf(d.fav);i<0?S.fav.push(d.fav):S.fav.splice(i,1);save();render();toast(i<0?'Добавлено в избранное':'Убрано из избранного');return}
 if(d.share){e.stopPropagation();const txt=`Груз ${d.share}: ${cargoById(d.share).from} — ${cargoById(d.share).to}`;(navigator.clipboard?navigator.clipboard.writeText(txt):Promise.reject()).then(()=>toast('Ссылка на груз скопирована'),()=>toast(txt));return}
 if('more' in d){ALLN+=50;render();return}
 if('watch' in d){const k=watchKey(S.filters),i=S.watch.findIndex(w=>w.key===k);if(i<0){S.watch.push({key:k,f:JSON.parse(JSON.stringify(S.filters)),label:watchLabel(S.filters)})}else S.watch.splice(i,1);save();render();toast(i<0?'Поиск отслеживается — сообщим о новых грузах':'Поиск больше не отслеживается');return}
 if(d.watchopen!==undefined){const w=S.watch[+d.watchopen];S.filters=JSON.parse(JSON.stringify(w.f));save();go('results');return}
 if(d.unwatch!==undefined){S.watch.splice(+d.unwatch,1);save();render();toast('Поиск больше не отслеживается');return}
 if(d.arrive){e.stopPropagation();S.param=d.arrive;save();sheet(SHEETS.arrive(d.arrive));return}
 if(d.trip){e.stopPropagation();S.tripTab='trip';go('trip',d.trip);return}
 if(d.open){go('order',d.open);return}
 if(d.toast){e.preventDefault();toast(d.toast);return}
 if('titlemenu' in d){t.getAttribute('aria-expanded')==='true'?closePop():openPop(t,true);return}
 if(d.go){closeSheet();go(d.go,d.p);return}
 if(d.back==='order'){go('order');return}
 if(d.back){history.length>1?history.back():go(d.back);return}
 if(d.seg){S[d.seg]=d.val;save();render();return}
 if(d.sheet){sheet(SHEETS[d.sheet]());return}
 if(d.deal){const f=S.filters.deals,i=f.indexOf(d.deal);i<0?f.push(d.deal):f.splice(i,1);
  const ff=document.getElementById('filterForm');if(ff){S.filters.from=ff.querySelector('#fFrom').value;S.filters.to=ff.querySelector('#fTo').value;S.filters.dateFrom=ff.querySelector('#fDf').value;S.filters.dateTo=ff.querySelector('#fDt').value;S.filters.body=ff.querySelector('#fBody').value}
  save();ALLN=50;const y=window.scrollY;render();window.scrollTo(0,y);document.querySelectorAll('#layer [data-deal]').forEach(b=>b.setAttribute('aria-pressed',String(f.includes(b.dataset.deal))));ffRefresh();return}
 if('swap' in d){const a=document.getElementById('fFrom'),b=document.getElementById('fTo'),x=a.value;setCity('from',b.value);setCity('to',x);return}
 if('chip' in d){t.setAttribute('aria-pressed',t.getAttribute('aria-pressed')!=='true');return}
 if(d.pay){S.apply.pay=d.pay;save();render();return}
 if(d.sw==='bonus'&&!S.apply.bonus){sheet(bonusSheet());return}
 if(d.sw==='fuel'&&!S.apply.fuel){sheet(fuelSheet());return}
 if(d.sw){S.apply[d.sw]=!S.apply[d.sw];save();render();return}
 if(d.check){const s=shipById(S.param);s.cargoCheck=d.check;save();render();toast('Груз отмечен: без замечаний');return}
 if('accept' in d){const s=shipById(S.param);if(s.cargoCheck==='pending')s.cargoCheck='ok';s.stage='docs';save();closeSheet();render();
   setTimeout(()=>{const x=shipById(s.id);if(x&&x.stage==='docs'){x.stage='loaded';save();if(current()==='trip')render();toast('Документы и QR готовы')}},2600);return}
 if(d.confirmApply){const miss=[['contract','Выберите договор'],['truck','Выберите машину'],['trailer','Выберите прицеп'],['driver','Выберите водителя']].find(([k])=>S.apply[k]==null);if(miss){toast(miss[1]);const x=document.getElementById(miss[0]);x&&x.focus();return}}
 if(d.confirmApply){const id=d.confirmApply;let s=shipById(id);if(!s){S.shipments.unshift({id,status:'assigned',stage:'enroute',cargoCheck:'pending',remarks:null});}save();S.shipTab='active';sheet(successSheet());return}
 if('themeToggle' in d){setTheme(isDark()?'light':'dark');render();return}
 if('reset' in d){S=fresh();save();go('home');toast('Демо-данные сброшены');return}
});
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'){FM=null;closeSheet()}
 if(e.key==='Enter'&&e.target.matches('article[data-open],article[data-trip]'))e.target.click();
});
document.addEventListener('change',e=>{
 if(e.target.dataset.applysel){const k=e.target.dataset.applysel;S.apply[k]=+e.target.value;save();{const y=window.scrollY;render();window.scrollTo(0,y)}}
 if(e.target.id==='rF'){const n=e.target.files.length;document.getElementById('rFilesLbl').textContent=n>3?'Можно не более 3 файлов':n?`Выбрано файлов: ${n}`:'Выберите файлы · не более 3'}
});
document.addEventListener('submit',e=>{
 e.preventDefault();const f=e.target;
 if(f.id==='filterForm'){S.filters.from=f.querySelector('#fFrom').value;S.filters.to=f.querySelector('#fTo').value;S.filters.dateFrom=f.querySelector('#fDf').value;S.filters.dateTo=f.querySelector('#fDt').value;S.filters.body=f.querySelector('#fBody').value;save();closeSheet();go('results');return}
 if(f.id==='arriveForm'){const s=shipById(f.dataset.id);const d=new Date(f.querySelector('#aD').value+'T'+f.querySelector('#aT').value);s.stage='arrived';s.status='loading';s.arrivedAt=d.toLocaleString('ru-RU',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})+' – …';save();closeSheet();S.tripTab='trip';go('trip',s.id);toast('Прибытие отмечено');return}
 if(f.id==='remarksForm'){const fl=f.querySelector('#rF').files.length;if(fl>3){toast('Можно приложить не более 3 файлов');return}const s=shipById(S.param);s.cargoCheck='remarks';s.remarks=f.querySelector('#rT').value.trim();save();closeSheet();render();toast('Замечания сохранены');return}
 if(f.id==='departForm'){const s=shipById(S.param);s.stage='departed';s.status='transit';S.pointsTab='next';save();closeSheet();render();toast('Убытие отмечено, рейс в пути');return}
});
