'use strict';
/* ---------- sheets ---------- */
function sheet(html){const l=document.getElementById('layer'),re=!!l.querySelector(':scope>.scrim:not(.out)');l.innerHTML=`<div class="scrim${re?' noanim':''}" data-close><div class="dim"></div><div class="sheet" role="dialog" aria-modal="true" tabindex="-1" style="outline:none"><div class="grab"></div>${html}</div></div>`;const sh=document.querySelector('.sheet');sh&&sh.focus({preventScroll:true})}
function closeSheet(){const l=document.getElementById('layer'),sc=l.querySelector(':scope>.scrim');if(!sc){l.innerHTML='';return}sheetOut(sc,()=>{if(sc.parentNode===l)l.innerHTML=''})}
/* slide a bottom sheet out (it stays opaque) and fade the dimmed backdrop, then run done(); after a swipe the exit keeps the finger's speed */
let SHEET_V=0;
function sheetOut(sc,done){const sh=sc.querySelector('.sheet');if(!sh||matchMedia('(prefers-reduced-motion: reduce)').matches){done();return}
 sc.classList.add('out');sc.style.pointerEvents='none';const dim=sc.querySelector(':scope>.dim')||sc,desk=false,v=SHEET_V;SHEET_V=0;
 const cur=new DOMMatrixReadOnly(getComputedStyle(sh).transform).m42||0,left=Math.max(0,sh.offsetHeight-cur);
 const ms=desk?200:Math.round(Math.min(280,Math.max(140,v>0?left/v:260)));
 sh.style.animation='none';sh.style.transition=`transform ${ms}ms cubic-bezier(${v>0?'.2,.6,.4,1':'.4,0,1,1'}), opacity ${ms}ms`;
 sh.style.transform=desk?'translateY(16px)':'translateY(100%)';if(desk)sh.style.opacity='0';
 dim.style.animation='none';dim.style.transition=`opacity ${ms}ms`;dim.style.opacity='0';setTimeout(done,ms+20)}
/* swipe down to dismiss bottom sheets (mobile): follows the finger 1:1, springs back or flicks away */
let SD=null,SD_RAF=0;
 /* handle bend follows the current direction of the finger, not the total offset: down → V, up → Λ, still → flat */
function grabBend(sd,y){const prev=sd.by??y;sd.by=y;const v=y-prev;sd.bv=(sd.bv||0)*.6+v*.4;const deg=Math.max(-14,Math.min(14,sd.bv*2.2));sd.sh.style.setProperty('--bend',deg.toFixed(1)+'deg');clearTimeout(sd.bt);sd.bt=setTimeout(()=>{sd.bv=0;sd.sh.style.setProperty('--bend','0deg')},120)}
const sdPaint=()=>{SD_RAF=0;if(!SD||!SD.on)return;SD.sh.style.transform=`translate3d(0,${SD.dy}px,0)`;SD.dim.style.opacity=String(Math.max(.25,1-SD.dy/(SD.h*1.2)))};
document.addEventListener('touchstart',e=>{if(e.touches.length>1){SD=null;return}const sh=e.target.closest('.scrim>.sheet');if(!sh)return;
 const y=e.touches[0].clientY,head=y-sh.getBoundingClientRect().top<56,scroller=e.target.closest('.city-list,.dp-months')||sh;
 if(!head&&scroller.scrollTop>0)return;
 SD={sh,sc:sh.parentElement,dim:sh.parentElement.querySelector(':scope>.dim')||sh.parentElement,scroller,head,y0:y,dy:0,on:false,h:sh.offsetHeight,pts:[[y,e.timeStamp]]}},{passive:true});
document.addEventListener('touchmove',e=>{if(!SD)return;const y=e.touches[0].clientY,dy=y-SD.y0;
 grabBend(SD,y);
 if(!SD.on&&SD.head&&dy<0){e.preventDefault();SD.sh.classList.add('dragging');return}
 if(!SD.on){if(dy<0||(!SD.head&&SD.scroller.scrollTop>0)){SD=null;return}e.preventDefault();if(dy<6)return;
  SD.on=true;SD.y0=y;SD.sh.style.animation='none';SD.sh.style.transition='none';SD.dim.style.animation='none';SD.dim.style.transition='none';SD.sh.style.willChange='transform';SD.sh.classList.add('dragging');
  const a=document.activeElement;if(a&&SD.sh.contains(a)&&a.matches('input,textarea'))a.blur()}
 e.preventDefault();SD.dy=Math.max(0,y-SD.y0);SD.pts.push([y,e.timeStamp]);if(SD.pts.length>6)SD.pts.shift();if(!SD_RAF)SD_RAF=requestAnimationFrame(sdPaint)},{passive:false});
function sdEnd(e){if(!SD)return;const s=SD;SD=null;clearTimeout(s.bt);s.sh.classList.remove('dragging');s.sh.style.setProperty('--bend','0deg');if(SD_RAF){cancelAnimationFrame(SD_RAF);SD_RAF=0}if(!s.on)return;
 const p=s.pts,a=p[0],b=p[p.length-1],now=e&&e.timeStamp||b[1],v=now-b[1]>80?0:(b[0]-a[0])/Math.max(1,b[1]-a[1]);
 s.sh.style.transform=`translate3d(0,${s.dy}px,0)`;s.sh.style.willChange='';
 if(s.dy>s.h*.3||(v>.45&&s.dy>16)){SHEET_V=Math.max(v,1);if(s.sc.id==='cityLayer')closeCity();else if(s.sc.id==='dateLayer')closeDate();else if(s.sc.id==='bodyLayer')closeBody();else closeSheet()}
 else{s.sh.style.transition='transform .32s cubic-bezier(.2,.9,.25,1.05)';s.dim.style.transition='opacity .32s';s.sh.style.transform='';s.dim.style.opacity=''}}
document.addEventListener('touchend',sdEnd);document.addEventListener('touchcancel',sdEnd);
const nowDate=()=>new Date().toISOString().slice(0,10),nowTime=()=>new Date().toTimeString().slice(0,5);
const SHEETS={
 arrive:id=>`<h3>Сообщить о прибытии</h3><p class="muted" style="margin:0;font-size:13px">Время должно совпадать с фактическим, указанным в документах на погрузке.</p>
  <form id="arriveForm" data-id="${id}" class="sec"><div class="grid2"><div class="field"><label for="aD">Дата прибытия</label><input class="input" type="date" id="aD" required value="${nowDate()}"></div><div class="field"><label for="aT">Время прибытия</label><input class="input" type="time" id="aT" required value="${nowTime()}"></div></div>
  <button class="btn primary block" type="submit">Отправить и принять груз</button></form>`,
 depart:()=>`<h3>Сообщить об убытии</h3><p class="muted" style="margin:0;font-size:13px">Укажите фактическое время выезда с пункта погрузки.</p>
  <form id="departForm" class="sec"><div class="grid2"><div class="field"><label for="dD">Дата убытия</label><input class="input" type="date" id="dD" required value="${nowDate()}"></div><div class="field"><label for="dT">Время убытия</label><input class="input" type="time" id="dT" required value="${nowTime()}"></div></div>
  <button class="btn primary block" type="submit">Отправить</button></form>`,
 confirm:()=>`<h3>Внимание</h3><p style="margin:0">Вы собираетесь принять груз. Убедитесь, что все данные заполнены правильно, и подтвердите действие.</p><button class="btn secondary block" data-close>Отмена</button><button class="btn primary block" data-accept>Подтвердить</button>`,
 remarks:()=>`<h3>Погрузка груза</h3><p class="muted" style="margin:0;font-size:13px">Зафиксируйте фактические параметры и опишите замечания.</p>
  <form id="remarksForm" class="sec"><b>Плановые параметры</b><div class="grid2"><div class="field"><label>Масса брутто, кг</label><input class="input" value="20 000" disabled></div><div class="field"><label>Кол-во мест, шт</label><input class="input" value="22" disabled></div></div>
  <b>Фактические параметры</b><div class="grid2"><div class="field"><label for="rM">Масса брутто, кг</label><input class="input" id="rM" inputmode="numeric" required placeholder="20 000"></div><div class="field"><label for="rC">Кол-во мест, шт</label><input class="input" id="rC" inputmode="numeric" required placeholder="22"></div></div>
  <div class="field"><label for="rT">Комментарий по грузу</label><textarea class="input" id="rT" required placeholder="Например: повреждена упаковка на двух палетах"></textarea></div>
  <label class="pay" style="box-shadow:inset 0 0 0 1px var(--accent);align-items:center;cursor:pointer;flex-direction:row;justify-content:center;color:var(--accent)">${ic('upload')}<span id="rFilesLbl">Выберите файлы · не более 3</span><input type="file" id="rF" multiple accept="image/*,.pdf" hidden></label>
  <button class="btn primary block" type="submit">Сохранить</button></form>`,
 vat:()=>`<h3>Цены</h3><div role="radiogroup" aria-label="НДС в ценах" style="display:flex;flex-direction:column;gap:8px">${VATS.map(v=>`<button class="pay" role="radio" aria-checked="${(S.vat||0)===v}" data-vat="${v}" style="flex-direction:row;align-items:center;justify-content:space-between"><span>${vatText(v)}</span><span class="radio"></span></button>`).join('')}</div>`,
 sort:()=>`<h3>Сортировка</h3><div role="radiogroup" aria-label="Сортировка" style="display:flex;flex-direction:column;gap:8px">${[['date','По дате погрузки'],['price','Сначала дороже'],['rate','По ставке ₽/км'],['km','Сначала ближе']].map(([k,l])=>`<button class="pay" role="radio" aria-checked="${(S.sort||'date')===k}" data-sort="${k}" style="flex-direction:row;align-items:center;justify-content:space-between"><span>${l}</span><span class="radio"></span></button>`).join('')}</div>`,
 filters:()=>`<div class="row between"><h3>Фильтры</h3><button type="button" class="linkbtn" data-ffreset style="font-size:14px${ffAny()?'':';visibility:hidden'}">Сбросить</button></div>`+filterForm().replace('class="card"','class="sec"').replace(/<button type="button" class="btn secondary sq xf-sq"[^>]*>.*?<\/button>/,''),
 qr:id=>`<h3>QR-код рейса</h3><p class="muted" style="margin:0;font-size:13px">Покажите на КПП. Код ведет к ЭТрН по заявке ${esc(S.param)}.</p>${qrSvg(S.param)}`,
 docs:()=>`<h3>Документы</h3><dl class="kv"><dt>Товарная накладная №1847</dt><dd>${tag('Подписан','green')}</dd><dt>Товарная накладная №1848</dt><dd>${tag('Подписан','green')}</dd><dt>ЭТрН №0092-12</dt><dd>${tag('Подписан','green')}</dd></dl><button class="btn secondary block" data-close>Закрыть</button>`
};
function qrSvg(seed){let h=0;for(const ch of seed)h=(h*31+ch.charCodeAt(0))>>>0;const n=25,cells=[];const rnd=()=>{h^=h<<13;h>>>=0;h^=h>>17;h^=h<<5;h>>>=0;return h%100};
 const finder=(x,y)=>`<rect x="${x}" y="${y}" width="7" height="7" fill="#111"/><rect x="${x+1}" y="${y+1}" width="5" height="5" fill="#fff"/><rect x="${x+2}" y="${y+2}" width="3" height="3" fill="#111"/>`;
 for(let y=0;y<n;y++)for(let x=0;x<n;x++){const inF=(x<8&&y<8)||(x>n-9&&y<8)||(x<8&&y>n-9);if(!inF&&rnd()<48)cells.push(`<rect x="${x}" y="${y}" width="1" height="1" fill="#111"/>`)}
 return `<svg class="qr" viewBox="0 0 ${n} ${n}" role="img" aria-label="QR-код" shape-rendering="crispEdges">${cells.join('')}${finder(0,0)}${finder(n-7,0)}${finder(0,n-7)}</svg>`}
