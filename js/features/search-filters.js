'use strict';
/* ---------- search form, saved searches, range filters ---------- */
/* ---------- city picker (bottom sheet over everything) ---------- */
const CITY_CODE={'Москва':'MOW','Санкт-Петербург':'LED','Краснодар':'KRR','Новосибирск':'OVB','Казань':'KZN','Екатеринбург':'SVX','Омск':'OMS','Великий Новгород':'NVR','Вологда':'VGD','Киров':'KVX','Пермь':'PEE','Нижний Новгород':'GOJ','Самара':'KUF','Ростов-на-Дону':'ROV','Воронеж':'VOZ','Тюмень':'TJM','Челябинск':'CEK','Уфа':'UFA','Тверь':'KLD','Чебоксары':'CSY'};
function cityList(){const n={};CARGO.forEach(c=>{if(c.gen)return;n[c.from]=(n[c.from]||0)+1;n[c.to]=(n[c.to]||0)+1});return Object.keys(n).sort((a,b)=>n[b]-n[a]||a.localeCompare(b,'ru'))}
const CITY_LBL={from:'Откуда',to:'Куда'};
function cityField(k,v){const id=k==='from'?'fFrom':'fTo';return `<button type="button" class="input city-btn" data-city="${k}" aria-label="${CITY_LBL[k]}: ${esc(v||'любой город')}"><span class="${v?'':'muted'}">${esc(v||CITY_LBL[k])}</span></button><input type="hidden" id="${id}" value="${esc(v||'')}">`}
function setCity(k,v){const h=document.getElementById(k==='from'?'fFrom':'fTo');if(!h)return;h.value=v;const b=h.previousElementSibling;b.outerHTML=cityField(k,v).replace(/<input[^>]*>$/,'')}
function cityItems(k,q){q=(q||'').trim().toLowerCase();const cur=(document.getElementById(k==='from'?'fFrom':'fTo')||{}).value||'';
 const l=cityList().filter(c=>!q||c.toLowerCase().includes(q));
 const any=cur&&!q?`<li><button class="city-item" data-cityval=""><span class="city-pin">${ic('x')}</span><span class="grow"><div class="city-name">Любой город</div><div class="city-country">Сбросить выбор</div></span></button></li>`:'';
 return any+(l.length?l.map(c=>`<li><button class="city-item" data-cityval="${esc(c)}" ${c===cur?'aria-current="true"':''}><span class="city-pin">${ic('pin')}</span><span class="grow"><div class="city-name">${esc(c)}</div><div class="city-country">Россия</div></span><span class="city-code">${CITY_CODE[c]||''}</span></button></li>`).join(''):`<li class="city-empty">Нет городов по запросу «${esc(q)}»</li>`)}
let CITYK=null;
function openCity(k){closeCity();CITYK=k;const el=document.createElement('div');el.className='scrim';el.id='cityLayer';el.style.zIndex='50';
 el.innerHTML=`<div class="sheet city-sheet" role="dialog" aria-modal="true" aria-label="${CITY_LBL[k]}" tabindex="-1" style="outline:none"><div class="grab"></div><div class="city-head"><h3>${CITY_LBL[k]}</h3></div>
  <div class="city-field"><label for="cityQ">${CITY_LBL[k]}</label><input id="cityQ" autocomplete="off" enterkeyhint="done" aria-controls="cityUl"></div>
  <ul class="city-list" id="cityUl" role="list">${cityItems(k,'')}</ul></div>`;
 document.body.appendChild(el);el.querySelector('.sheet').focus({preventScroll:true})}
function closeCity(){const el=document.getElementById('cityLayer');CITYK=null;if(!el)return;el.id='';sheetOut(el,()=>el.remove())}
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-city]');if(b){e.preventDefault();e.stopPropagation();openCity(b.dataset.city);return}
 const L=document.getElementById('cityLayer');if(!L||!L.contains(e.target))return;e.stopPropagation();
 if(e.target===L){closeCity();return}
 const it=e.target.closest('[data-cityval]');if(it){setCity(CITYK,it.dataset.cityval);closeCity()}
},true);
document.addEventListener('input',e=>{if(e.target.id==='cityQ'&&CITYK)document.getElementById('cityUl').innerHTML=cityItems(CITYK,e.target.value)});
document.addEventListener('keydown',e=>{if(!document.getElementById('cityLayer'))return;if(e.key==='Escape'){e.stopPropagation();closeCity()}else if(e.key==='Enter'&&e.target.id==='cityQ'){e.preventDefault();e.target.blur()}},true);
function filterForm(){
 const f=S.filters;
 return `<form class="card" id="filterForm">
  <div class="pair">${cityField('from',f.from)}${cityField('to',f.to)}
   <button type="button" class="swap" data-swap aria-label="Поменять местами">${ic('swap','s')}</button></div>
  <div class="grid2"><div class="field"><label for="fDf">Дата с</label><input class="input" type="date" id="fDf" value="${f.dateFrom}"></div><div class="field"><label for="fDt">Дата по</label><input class="input" type="date" id="fDt" value="${f.dateTo}"></div></div>
  <div class="field"><label for="fBody">Тип кузова</label><select class="input" id="fBody">${['Любой','Рефрижератор','Тент','Изотерм'].map(b=>`<option ${b===f.body?'selected':''}>${b}</option>`).join('')}</select></div>
  <div class="grid3">${['Фикс','Аукцион','Встречное'].map(d=>`<button type="button" class="opt" data-deal="${d}" aria-pressed="${f.deals.includes(d)}">${d}</button>`).join('')}</div>
  <div class="row"><button class="btn primary grow" type="submit">Найти груз</button></div>
 </form>`;
}
const watchKey=f=>[f.from.trim().toLowerCase(),f.to.trim().toLowerCase(),f.body,[...f.deals].sort().join('+')].join('|');
const watchLabel=f=>[f.from||'Любой город',f.to||'',f.body!=='Любой'?f.body.toLowerCase():''].filter(Boolean).join(' — ');
const matches=f=>CARGO.filter(c=>(!f.from||c.from.toLowerCase().includes(f.from.toLowerCase().trim()))&&(!f.to||c.to.toLowerCase().includes(f.to.toLowerCase().trim()))&&(f.body==='Любой'||c.body===({'Рефрижератор':'Реф','Тент':'Тент','Изотерм':'Изотерм'})[f.body])&&(!f.deals.length||f.deals.includes(c.deal)));
const isWatched=()=>S.watch.some(w=>w.key===watchKey(S.filters));
function watchCards(){return S.watch.map((w,i)=>{const n=matches(w.f).length;return `<article class="card"><div class="row">${ic('bellPlus')}<div class="grow"><b style="font-weight:500">${esc(w.label)}</b><div class="muted" style="font-size:13px">${plural(n,'груз подходит','груза подходят','грузов подходят')} · уведомим о новых</div></div></div><div class="row"><button class="btn sm primary grow" data-watchopen="${i}">Показать грузы</button><button class="btn sm secondary" data-unwatch="${i}">Не отслеживать</button></div></article>`}).join('')}
const XF={cap:{title:'Грузоподъёмность',hint:'Сколько должна поднимать машина',opts:[['0-5','до 5 т'],['5-10','5–10 т'],['10-20','10–20 т'],['20-99','от 20 т']]},
 vol:{title:'Объём кузова',hint:'Требуемый объём прицепа',opts:[['0-40','до 40 м³'],['40-82','40–82 м³'],['82-999','от 82 м³']]},
 wt:{title:'Вес груза',hint:'Общий вес груза в заказе',opts:[['0-5','до 5 т'],['5-15','5–15 т'],['15-99','от 15 т']]}};
const RG={cap:{title:'Грузоподъёмность',unit:'т',hint:'Сколько должна поднимать машина, от 0,2 до 20 т',ph:['0,2 т','20 т']},
 vol:{title:'Объём, м³',unit:'м³',hint:'Требуемый объём кузова, от 4 до 120 м³',ph:['4 м³','120 м³']},
 wt:{title:'Вес груза, т',unit:'т',hint:'Общий вес груза в заказе, от 0,2 до 24 т',ph:['0,2 т','24 т']}};
const xfEmpty=()=>({cap:[],capFrom:'',capTo:'',vol:[],volFrom:'',volTo:'',wt:[],wtFrom:'',wtTo:'',fast:false});
const num=v=>{const n=parseFloat(String(v||'').replace(',','.'));return isFinite(n)?n:null};
const rgOn=(x,k)=>num(x[k+'From'])!==null||num(x[k+'To'])!==null;
const rgPass=(c,x,k)=>{let a=num(x[k+'From']),b=num(x[k+'To']);if(a!==null&&b!==null&&a>b)[a,b]=[b,a];return (a===null||c[k]>=a)&&(b===null||c[k]<=b)};
const rgLabel=(x,k)=>{const a=num(x[k+'From']),b=num(x[k+'To']),u=RG[k].unit,f=n=>String(n).replace('.',',');return a!==null&&b!==null?`от ${f(a)} ${u} — до ${f(b)} ${u}`:a!==null?`от ${f(a)} ${u}`:`до ${f(b)} ${u}`};
const rgFields=(x,k)=>`<div class="grid2"><div class="field"><label for="${k}From">От</label><input class="input" id="${k}From" data-rgin="${k}From" inputmode="decimal" enterkeyhint="done" placeholder="${RG[k].ph[0]}" value="${esc(x[k+'From']||'')}"></div><div class="field"><label for="${k}To">До</label><input class="input" id="${k}To" data-rgin="${k}To" inputmode="decimal" enterkeyhint="done" placeholder="${RG[k].ph[1]}" value="${esc(x[k+'To']||'')}"></div></div>`;
const inRange=(v,r)=>{const [a,b]=r.split('-').map(Number);return v>a&&v<=b||(a===0&&v===0)};
const xfPass=(c,x)=>rgPass(c,x,'cap')&&rgPass(c,x,'vol')&&rgPass(c,x,'wt')&&(!x.fast||c.fast);
const xfCount=x=>(rgOn(x,'cap')?1:0)+(rgOn(x,'vol')?1:0)+(rgOn(x,'wt')?1:0)+(x.fast?1:0);
let XD=null;
function xfSheet(){const n=matchList(XD).length;
 return `<h3>Фильтры</h3>${['cap','vol','wt'].map(k=>`<div class="sec" style="gap:8px"><div><b style="font-weight:500">${RG[k]?RG[k].title:XF[k].title}</b><div class="muted" style="font-size:12px">${RG[k]?RG[k].hint:XF[k].hint}</div></div>${RG[k]?rgFields(XD,k):`<div class="chips" style="flex-wrap:wrap">${XF[k].opts.map(([v,l])=>`<button class="chip xopt" data-xf="${k}:${v}" aria-pressed="${XD[k].includes(v)}">${l}</button>`).join('')}</div>`}</div>`).join('')}
 <div class="row between" style="padding:4px 0"><span>Только с быстрой оплатой</span><button class="switch" role="switch" aria-checked="${XD.fast}" data-xffast aria-label="Только с быстрой оплатой"></button></div>
 <div class="row"><button class="btn secondary" data-xfreset>Сбросить</button><button class="btn primary grow" data-xfapply>${n?'Показать '+plural(n,'груз','груза','грузов'):'Нет подходящих грузов'}</button></div>`}
function openXf(){XD=Object.assign(xfEmpty(),JSON.parse(JSON.stringify(S.extra||{})));XMODE='all';sheet(xfSheet())}
let XMODE='all';
function filtered(){return matchList(S.extra||xfEmpty())}
const rgBtnLbl=k=>rgOn(XD,k)?'Применить':'Закрыть';
function rgSheet(k){return `<h3>${RG[k].title}</h3><div class="muted" style="font-size:13px;margin-top:-8px">${RG[k].hint}</div>${rgFields(XD,k)}
 <div class="row"><button class="btn primary grow" data-xfapply>${rgBtnLbl(k)}</button></div>`}
function openRg(k){XD=Object.assign(xfEmpty(),JSON.parse(JSON.stringify(S.extra||{})));XMODE=k;sheet(rgSheet(k))}
function refreshXf(){const sh=document.querySelector('.sheet');if(!sh)return;const b=sh.querySelector('[data-xfapply]');if(RG[XMODE]){if(b)b.textContent=rgBtnLbl(XMODE);return}const n=matchList(XD).length;if(b)b.textContent=n?'Показать '+plural(n,'груз','груза','грузов'):'Нет подходящих грузов'}
const rgChip=(X,k)=>rgOn(X,k)?`<span class="chip has-x" aria-pressed="true"><button class="chip-lbl" data-rgopen="${k}" aria-label="${RG[k].title} ${rgLabel(X,k)}, изменить">${rgLabel(X,k)}</button><button class="chip-x" data-rgclear="${k}" aria-label="Очистить: ${RG[k].title}">${ic('x','s')}</button></span>`:`<button class="chip" data-rgopen="${k}" aria-pressed="false">${RG[k].title}</button>`;
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.dataset&&e.target.dataset.rgin){e.preventDefault();e.target.blur()}});
document.addEventListener('input',e=>{const k=e.target.dataset&&e.target.dataset.rgin;if(!k||!XD)return;XD[k]=e.target.value;refreshXf()});
/* results are never empty: top up with deterministic cargos that match the current query */
const MINR=12,GENK=new Set();
function genFor(f,x,need){
 const key=JSON.stringify([f.from.trim().toLowerCase(),f.to.trim().toLowerCase(),f.body,[...f.deals].sort(),['cap','vol','wt'].map(k=>[x[k+'From']||'',x[k+'To']||'']),!!x.fast]);
 if(GENK.has(key))return;GENK.add(key);
 let h=0;for(const ch of key)h=(h*31+ch.charCodeAt(0))>>>0;let sd=h||1;const rnd=()=>(sd=(sd*1103515245+12345)%2147483648)/2147483648,pick=a=>a[Math.floor(rnd()*a.length)];
 const known=Object.keys(MAP.C).filter(n=>!['Тихорецк','Ишим','Барабинск','Курган'].includes(n));
 const cityFor=q=>{q=q.trim();if(!q)return null;const m=known.find(n=>n.toLowerCase().includes(q.toLowerCase()));if(m)return m;
  const name=q.charAt(0).toUpperCase()+q.slice(1);if(!MAP.C[name]){const b=MAP.C[pick(known)];MAP.C[name]=[b[0]+(rnd()-.5)*60,b[1]+(rnd()-.5)*60]}return name};
 const F=cityFor(f.from),T=cityFor(f.to),bodyMap={'Рефрижератор':['Реф','Задняя'],'Тент':['Тент','Боковая'],'Изотерм':['Изотерм','Задняя']};
 const rg=(k,lo,hi,dec)=>{let a=num(x[k+'From']),b=num(x[k+'To']);if(a!==null&&b!==null&&a>b)[a,b]=[b,a];a=a===null?lo:a;b=b===null?Math.max(hi,a):b;const v=a+(b-a)*rnd();return dec?Math.round(v*10)/10:Math.round(v)};
 const deals=f.deals.length?f.deals:['Фикс','Аукцион','Встречное'],clients=['ASHN','Нордлайн','Агроснаб','ТехноКом','ВолгаТранс','Магистраль','ЮгАгро','УралСталь','Фреш Маркет','СеверЛес','Полимер-М','ТрансЕвразия'],pad=n=>String(n).padStart(2,'0');
 for(let i=0;i<need;i++){
  const from=F||pick(known.filter(n=>n!==T)),to=T||pick(known.filter(n=>n!==from)),A=MAP.C[from],B=MAP.C[to];
  const km=Math.max(60,Math.round(Math.hypot(A[0]-B[0],A[1]-B[1])*4.6/10)*10+40);
  const [body,load]=f.body!=='Любой'?bodyMap[f.body]:pick([['Реф','Задняя'],['Тент','Боковая'],['Тент','Верхняя'],['Изотерм','Задняя']]);
  const cap=rg('cap',0.2,20,1),vol=rg('vol',4,120,0),wt=rg('wt',0.2,24,1),deal=pick(deals);
  const d1=12+Math.floor(rnd()*6),h1=6+Math.floor(rnd()*12),hrs=Math.max(4,Math.round(km/60)),d2=d1+Math.floor((h1+hrs)/24),h2=(h1+hrs)%24;
  const price=Math.round(km*(body==='Реф'?95:78)*(0.85+rnd()*.4)/100)*100;
  const c={id:'СП09'+String(1000+Math.floor(rnd()*8999)),gen:true,cap,vol,wt,client:pick(clients),rating:Math.round((4+rnd()*.95)*10)/10,body,load,items:pick(['1 груз','2 груза','3 груза']),
   pallets:(cap>=15?18+Math.floor(rnd()*15):4+Math.floor(rnd()*12))+' пл.',from,to,fromWhen:`${d1} дек, ${pad(h1)}:00 — ${d1} дек, ${pad(Math.min(23,h1+4))}:00`,toWhen:`${d2} дек, ${pad(h2)}:00 — ${d2} дек, ${pad(Math.min(23,h2+6))}:00`,
   via:km>900&&rnd()<.4?1:0,deal,km,price,bonus:Math.max(10,Math.round(price/10000)*10),fast:x.fast?true:rnd()<.5,express:rnd()<.4,vat:false};
  if(deal==='Аукцион')c.timer=600+Math.floor(rnd()*7000);
  if(!CARGO.some(o=>o.id===c.id))CARGO.push(c);
 }
}
function matchList(x){x=Object.assign(xfEmpty(),x||{});let l=filteredBase().filter(c=>xfPass(c,x));if(l.length<MINR){genFor(S.filters,x,MINR-l.length);l=filteredBase().filter(c=>xfPass(c,x))}return l}
function filteredBase(){
 const f=S.filters,bodyMap={'Рефрижератор':'Реф','Тент':'Тент','Изотерм':'Изотерм'};
 return CARGO.filter(c=>(!f.from||c.from.toLowerCase().includes(f.from.toLowerCase().trim()))&&(!f.to||c.to.toLowerCase().includes(f.to.toLowerCase().trim()))&&(f.body==='Любой'||c.body===bodyMap[f.body])&&(!f.deals.length||f.deals.includes(c.deal)));
}
let ALLN=50;const FEED=()=>CARGO.filter(c=>!c.gen&&(!S.filters.deals.length||S.filters.deals.includes(c.deal)));
