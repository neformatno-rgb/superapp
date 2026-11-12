'use strict';
/* ---------- search form, saved searches, range filters ---------- */
/* ---------- city picker (bottom sheet over everything) ---------- */
const CITY_CODE={'Москва':'MOW','Санкт-Петербург':'LED','Краснодар':'KRR','Новосибирск':'OVB','Казань':'KZN','Екатеринбург':'SVX','Омск':'OMS','Великий Новгород':'NVR','Вологда':'VGD','Киров':'KVX','Пермь':'PEE','Нижний Новгород':'GOJ','Самара':'KUF','Ростов-на-Дону':'ROV','Воронеж':'VOZ','Тюмень':'TJM','Челябинск':'CEK','Уфа':'UFA','Тверь':'KLD','Чебоксары':'CSY'};
function cityList(){const n={};CARGO.forEach(c=>{if(c.gen)return;n[c.from]=(n[c.from]||0)+1;n[c.to]=(n[c.to]||0)+1});return Object.keys(n).sort((a,b)=>n[b]-n[a]||a.localeCompare(b,'ru'))}
const CITY_LBL={from:'Откуда',to:'Куда'};
function cityField(k,v){const id=k==='from'?'fFrom':'fTo';return `<button type="button" class="input city-btn" data-city="${k}" aria-label="${CITY_LBL[k]}: ${esc(v||'любой город')}"><span class="${v?'':'muted'}">${esc(v||CITY_LBL[k])}</span>${v?`<span class="fld-x" role="button" aria-label="Очистить" data-cityclear="${k}">${ic('x','s')}</span>`:''}</button><input type="hidden" id="${id}" value="${esc(v||'')}">`}
function setCity(k,v){const h=document.getElementById(k==='from'?'fFrom':'fTo');if(!h)return;h.value=v;const b=h.previousElementSibling;b.outerHTML=cityField(k,v).replace(/<input[^>]*>$/,'');ffRefresh()}
function cityItems(k,q){q=(q||'').trim().toLowerCase();const cur=(document.getElementById(k==='from'?'fFrom':'fTo')||{}).value||'';
 const l=cityList().filter(c=>!q||c.toLowerCase().includes(q));
 const any=cur&&!q?`<li><button class="city-item" data-cityval=""><span class="city-pin">${ic('x')}</span><span class="grow"><div class="city-name">Любой город</div><div class="city-country">Сбросить выбор</div></span></button></li>`:'';
 return any+(l.length?l.map(c=>`<li><button class="city-item" data-cityval="${esc(c)}" ${c===cur?'aria-current="true"':''}><span class="city-pin">${ic('pin')}</span><span class="grow"><div class="city-name">${esc(c)}</div><div class="city-country">Россия</div></span><span class="city-code">${CITY_CODE[c]||''}</span></button></li>`).join(''):`<li class="city-empty">Нет городов по запросу «${esc(q)}»</li>`)}
let CITYK=null;
function openCity(k){closeCity();CITYK=k;const el=document.createElement('div');el.className='scrim';el.id='cityLayer';el.style.zIndex='50';
 el.innerHTML=`<div class="dim"></div><div class="sheet city-sheet" role="dialog" aria-modal="true" aria-label="${CITY_LBL[k]}" tabindex="-1" style="outline:none"><div class="grab"></div><div class="city-head"><h3>${CITY_LBL[k]}</h3></div>
  <div class="field" style="flex:none"><label for="cityQ">Поиск города</label><input class="input" id="cityQ" type="search" placeholder="Например, Москва" autocomplete="off" enterkeyhint="done" aria-controls="cityUl"></div>
  <ul class="city-list" id="cityUl" role="list">${cityItems(k,'')}</ul></div>`;
 document.body.appendChild(el);el.querySelector('.sheet').focus({preventScroll:true})}
function closeCity(){const el=document.getElementById('cityLayer');CITYK=null;if(!el)return;el.id='';sheetOut(el,()=>el.remove())}
document.addEventListener('click',e=>{
 const cx=e.target.closest('[data-cityclear]');if(cx){e.preventDefault();e.stopPropagation();setCity(cx.dataset.cityclear,'');return}
 const b=e.target.closest('[data-city]');if(b){e.preventDefault();e.stopPropagation();openCity(b.dataset.city);return}
 const L=document.getElementById('cityLayer');if(!L||!L.contains(e.target))return;e.stopPropagation();
 if(e.target===L){closeCity();return}
 const it=e.target.closest('[data-cityval]');if(it){setCity(CITYK,it.dataset.cityval);closeCity()}
},true);
document.addEventListener('input',e=>{if(e.target.id==='cityQ'&&CITYK)document.getElementById('cityUl').innerHTML=cityItems(CITYK,e.target.value)});
document.addEventListener('keydown',e=>{if(!document.getElementById('cityLayer'))return;if(e.key==='Escape'){e.stopPropagation();closeCity()}else if(e.key==='Enter'&&e.target.id==='cityQ'){e.preventDefault();e.target.blur()}},true);
/* ---------- loading-date range picker (bottom sheet) ---------- */
const DP_LBL={from:'Дата погрузки с',to:'Дата погрузки по'};
const MONTHS=['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
const isoD=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const parseD=s=>{const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)};
const addD=(s,n)=>{const d=parseD(s);d.setDate(d.getDate()+n);return isoD(d)};
const fmtD=s=>s?parseD(s).toLocaleDateString('ru-RU',{day:'numeric',month:'long'}):'';
function dateField(k,v){const id=k==='from'?'fDf':'fDt';return `<div class="field"><label>${DP_LBL[k]}</label><button type="button" class="input date-btn${v?' has':''}" data-date="${k}" aria-label="${DP_LBL[k]}: ${v?fmtD(v):'не выбрана'}"><span class="${v?'':'muted'}">${v?fmtD(v):'Любая'}</span>${v?`<span class="fld-x" role="button" aria-label="Очистить" data-dateclear="${k}">${ic('x','s')}</span>`:''}</button><input type="hidden" id="${id}" value="${v||''}"></div>`}
let DP=null;
function dpMonths(){const t=isoD(new Date()),{from,to}=DP,now=new Date();let h='';
 for(let k=0;k<4;k++){const m=new Date(now.getFullYear(),now.getMonth()+k,1),pad=(m.getDay()+6)%7,days=new Date(m.getFullYear(),m.getMonth()+1,0).getDate();
  let c='';for(let i=0;i<pad;i++)c+='<span></span>';
  for(let d=1;d<=days;d++){const s=isoD(new Date(m.getFullYear(),m.getMonth(),d)),past=s<t,end=s===from||s===to,mid=from&&to&&s>from&&s<to;
   const cls=['dp-day',end?'sel':'',mid?'mid':'',from&&to&&from!==to&&s===from?'start':'',from&&to&&from!==to&&s===to?'end':'',s===t?'today':''].filter(Boolean).join(' ');
   c+=`<button type="button" class="${cls}" data-dpday="${s}" ${past?'disabled':''} aria-label="${fmtD(s)}" ${end?'aria-pressed="true"':''}><span>${d}</span></button>`}
  h+=`<section class="dp-month"><h4>${MONTHS[m.getMonth()]}${m.getFullYear()!==now.getFullYear()?' '+m.getFullYear():''}</h4><div class="dp-grid">${c}</div></section>`}
 return h}
function dpTop(){const {from,to,act,flex}=DP;
 const fld=k=>{const v=DP[k];return `<div class="field"><label>${DP_LBL[k]}</label><div class="dp-wrap"><button type="button" class="input date-btn${act===k?' on':''}${v?' has':''}" data-dpact="${k}" aria-pressed="${act===k}"><span class="${v?'':'muted'}">${v?fmtD(v):'Любая'}</span></button>${v?`<button type="button" class="dp-clear" data-dpclear="${k}" aria-label="Очистить">${ic('x','s')}</button>`:''}</div></div>`};
 return `<div class="grid2">${fld('from')}${fld('to')}</div>
  <div class="dp-chips">${[1,3,15].map(n=>`<button type="button" class="dp-chip" data-dpflex="${n}" aria-pressed="${flex===n}">± ${n} ${n===1?'день':n===3?'дня':'дней'}</button>`).join('')}</div>`}
function dpPaint(){const L=document.getElementById('dateLayer');if(!L)return;L.querySelector('.dp-ctl').innerHTML=dpTop();
 const g=L.querySelector('.dp-months'),st=g.scrollTop;g.innerHTML=dpMonths();g.scrollTop=st;
 const ch=DP.from!==DP.f0||DP.to!==DP.t0;L.querySelector('[data-dpdone]').textContent=ch?'Применить':'Закрыть';L.querySelector('[data-dpdone]').className='btn block '+(ch?'primary':'secondary')}
function openDate(k){closeDate();const f=document.getElementById('fDf').value,t=document.getElementById('fDt').value;
 DP={from:f,to:t,f0:f,t0:t,act:k,flex:0};const el=document.createElement('div');el.className='scrim';el.id='dateLayer';el.style.zIndex='50';
 el.innerHTML=`<div class="dim"></div><div class="sheet dp-sheet" role="dialog" aria-modal="true" aria-label="Дата погрузки" tabindex="-1" style="outline:none">
  <div class="dp-top"><div class="grab"></div><h3>Дата погрузки</h3><div class="dp-ctl"></div></div>
  <div class="dp-week">${['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(w=>`<span>${w}</span>`).join('')}</div>
  <div class="dp-months"></div>
  <div class="city-foot"><button class="btn secondary block" type="button" data-dpdone>Закрыть</button></div></div>`;
 document.body.appendChild(el);dpPaint();el.querySelector('.sheet').focus({preventScroll:true});
 const sel=el.querySelector('.dp-day.sel');if(sel)el.querySelector('.dp-months').scrollTop=sel.closest('.dp-month').offsetTop-8}
function closeDate(){const el=document.getElementById('dateLayer');DP=null;if(!el)return;el.id='';sheetOut(el,()=>el.remove())}
function setDate(k,v){const h=document.getElementById(k==='from'?'fDf':'fDt');if(!h)return;h.value=v;h.parentElement.outerHTML=dateField(k,v);ffRefresh()}
function dpPick(s){if(DP.act==='from'){DP.from=s;if(DP.to&&DP.to<s)DP.to='';DP.act='to'}else{if(DP.from&&s<DP.from){DP.to=DP.from;DP.from=s}else DP.to=s;if(!DP.from)DP.from=s}DP.flex=0}
document.addEventListener('click',e=>{
 const dx=e.target.closest('[data-dateclear]');if(dx){e.preventDefault();e.stopPropagation();setDate(dx.dataset.dateclear,'');return}
 const b=e.target.closest('[data-date]');if(b){e.preventDefault();e.stopPropagation();openDate(b.dataset.date);return}
 const L=document.getElementById('dateLayer');if(!L||!L.contains(e.target))return;e.stopPropagation();
 if(e.target===L){closeDate();return}
 if(e.target.closest('[data-dpdone]')){if(DP.from!==DP.f0||DP.to!==DP.t0){const {from,to}=DP;setDate('from',from);setDate('to',to)}closeDate();return}
 const c=e.target.closest('[data-dpclear]');if(c){DP[c.dataset.dpclear]='';DP.act=c.dataset.dpclear;DP.flex=0;dpPaint();return}
 const a=e.target.closest('[data-dpact]');if(a){DP.act=a.dataset.dpact;dpPaint();return}
 const x=e.target.closest('[data-dpflex]');if(x){const n=+x.dataset.dpflex,t=isoD(new Date());if(DP.flex===n){DP.flex=0;dpPaint();return}
  const base=DP.from||t;DP.from=addD(base,-n)<t?t:addD(base,-n);DP.to=addD(base,n);DP.flex=n;dpPaint();return}
 const d=e.target.closest('[data-dpday]');if(d&&!d.disabled){dpPick(d.dataset.dpday);dpPaint()}
},true);
document.addEventListener('keydown',e=>{if(!document.getElementById('dateLayer'))return;if(e.key==='Escape'){e.stopPropagation();closeDate()}},true);
/* ---------- body type multi-select (bottom sheet) ---------- */
const BODIES=['Рефрижератор','Тент','Изотерм'],BODY_SHORT={'Рефрижератор':'Реф','Тент':'Тент','Изотерм':'Изотерм'};
const bodyList=f=>!f.body||f.body==='Любой'?[]:f.body.split(',').filter(b=>BODIES.includes(b));
function bodyField(v){const l=bodyList({body:v});return `<div class="field"><label>Тип кузова</label><div class="dp-wrap"><button type="button" class="input body-btn" data-bodypick aria-label="Тип кузова: ${l.length?l.join(', '):'любой'}"><span class="body-tags">${l.length?l.map(b=>`<span class="btag">${b}</span>`).join(''):'<span class="muted">Любой</span>'}</span>${l.length?'<span class="body-gap"></span>':ic('chevD','s')}</button>${l.length?`<button type="button" class="dp-clear" data-bodyclear aria-label="Сбросить тип кузова">${ic('x','s')}</button>`:''}</div><input type="hidden" id="fBody" value="${esc(l.join(','))}"></div>`}
let BD=null;
function bdPaint(){const L=document.getElementById('bodyLayer');if(!L)return;
 L.querySelector('.bd-list').innerHTML=BODIES.map(b=>{const on=BD.sel.includes(b);return `<li><button type="button" class="bd-item" data-bdval="${b}" role="checkbox" aria-checked="${on}"><span class="grow">${b}</span><span class="bd-box">${on?ic('check','s'):''}</span></button></li>`}).join('');
 L.querySelector('[data-bdreset]').style.visibility=BD.sel.length?'':'hidden';
 const ch=BD.sel.slice().sort().join()!==BD.s0;const btn=L.querySelector('[data-bddone]');btn.textContent=ch?'Применить':'Закрыть';btn.className='btn block '+(ch?'primary':'secondary')}
function openBody(){closeBody();const h=document.getElementById('fBody');const sel=bodyList({body:h?h.value:''});BD={sel,s0:sel.slice().sort().join()};
 const el=document.createElement('div');el.className='scrim';el.id='bodyLayer';el.style.zIndex='50';
 el.innerHTML=`<div class="dim"></div><div class="sheet" role="dialog" aria-modal="true" aria-label="Тип кузова" tabindex="-1" style="outline:none"><div class="grab"></div><div class="row between"><h3 style="margin:0">Тип кузова</h3><button type="button" class="linkbtn" data-bdreset style="font-size:14px">Сбросить</button></div><ul class="bd-list" role="list"></ul><button class="btn secondary block" type="button" data-bddone>Закрыть</button></div>`;
 document.body.appendChild(el);bdPaint();el.querySelector('.sheet').focus({preventScroll:true})}
function closeBody(){const el=document.getElementById('bodyLayer');BD=null;if(!el)return;el.id='';sheetOut(el,()=>el.remove())}
function setBody(v){const h=document.getElementById('fBody');if(!h)return;h.parentElement.outerHTML=bodyField(v);ffRefresh()}
/* «Сбросить» in the filters sheet: shown only while something is set */
function ffAny(){const ff=document.getElementById('filterForm'),f=S.filters;if(!ff)return !!(f.from||f.to||f.dateFrom||f.dateTo||bodyList(f).length||f.deals.length);
 return ['#fFrom','#fTo','#fDf','#fDt','#fBody'].some(q=>{const el=ff.querySelector(q);return el&&el.value})||S.filters.deals.length>0}
function ffRefresh(){const r=document.querySelector('[data-ffreset]');if(r)r.style.visibility=ffAny()?'':'hidden'}
document.addEventListener('click',e=>{if(!e.target.closest('[data-ffreset]'))return;e.preventDefault();e.stopPropagation();
 setCity('from','');setCity('to','');setDate('from','');setDate('to','');setBody('');S.filters.deals=[];save();
 document.querySelectorAll('#filterForm [data-deal]').forEach(b=>b.setAttribute('aria-pressed','false'));const y=window.scrollY;render();window.scrollTo(0,y);ffRefresh()},true);
document.addEventListener('click',e=>{
 if(e.target.closest('[data-bodyclear]')){e.preventDefault();e.stopPropagation();setBody('');return}
 if(e.target.closest('[data-bodypick]')){e.preventDefault();e.stopPropagation();openBody();return}
 const L=document.getElementById('bodyLayer');if(!L||!L.contains(e.target))return;e.stopPropagation();
 if(e.target===L){closeBody();return}
 if(e.target.closest('[data-bddone]')){if(BD.sel.slice().sort().join()!==BD.s0)setBody(BODIES.filter(b=>BD.sel.includes(b)).join(','));closeBody();return}
 if(e.target.closest('[data-bdreset]')){BD.sel=[];bdPaint();return}
 const it=e.target.closest('[data-bdval]');if(it){const v=it.dataset.bdval,i=BD.sel.indexOf(v);i<0?BD.sel.push(v):BD.sel.splice(i,1);bdPaint()}
},true);
document.addEventListener('keydown',e=>{if(document.getElementById('bodyLayer')&&e.key==='Escape'){e.stopPropagation();closeBody()}},true);
function filterForm(){
 const f=S.filters;
 return `<form class="card" id="filterForm">
  <div class="pair">${cityField('from',f.from)}${cityField('to',f.to)}
   <button type="button" class="swap" data-swap aria-label="Поменять местами">${ic('swap','s')}</button></div>
  <div class="grid2">${dateField('from',f.dateFrom)}${dateField('to',f.dateTo)}</div>
  ${bodyField(f.body)}
  <div class="grid3">${['Фикс','Аукцион','Встречное'].map(d=>`<button type="button" class="opt" data-deal="${d}" aria-pressed="${f.deals.includes(d)}">${d}</button>`).join('')}</div>
  <div class="row"><button class="btn primary grow" type="submit">Найти груз</button><button type="button" class="btn secondary sq xf-sq" data-xfopen aria-label="Фильтры${xfCount(S.extra||xfEmpty())?': выбрано '+xfCount(S.extra):''}" aria-pressed="${!!xfCount(S.extra||xfEmpty())}">${ic('filter')}</button></div>
 </form>`;
}
const watchKey=(f,x=S.extra||xfEmpty())=>JSON.stringify([f.from.trim().toLowerCase(),f.to.trim().toLowerCase(),f.dateFrom||'',f.dateTo||'',f.body||'',[...f.deals].sort(),['cap','vol','wt'].map(k=>[x[k+'From']||'',x[k+'To']||'']),!!x.fast]);
/* how many filter parameters are set: route ends, dates, body, deal type, each extra range, fast pay */
const paramCount=(f,x=S.extra||xfEmpty())=>[f.from,f.to,f.dateFrom||f.dateTo,bodyList(f).length,f.deals.length,rgOn(x,'cap'),rgOn(x,'vol'),rgOn(x,'wt'),x.fast].filter(Boolean).length;
const ruDate=iso=>new Date(iso+'T00:00').toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric'}).replace(/\s*г\.?$/,'');
const rgText=(x,k)=>{const a=num(x[k+'From']),b=num(x[k+'To']),u=RG[k].unit,t=RG[k].title.replace(/,.*$/,'').toLowerCase(),v=n=>String(n).replace('.',',');return a!==null&&b!==null?`${t} ${v(a)}–${v(b)} ${u}`:a!==null?`${t} от ${v(a)} ${u}`:`${t} до ${v(b)} ${u}`};
/* card text: route → dates → body type → everything else */
const watchDesc=(f,x)=>{x=Object.assign(xfEmpty(),x||{});const parts=[];
 if(f.from||f.to)parts.push([f.from||'Любой город',f.to||'любой город'].join(' — '));
 if(f.dateFrom||f.dateTo)parts.push(f.dateFrom&&f.dateTo&&f.dateFrom!==f.dateTo?`${ruDate(f.dateFrom)} — ${ruDate(f.dateTo)}`:ruDate(f.dateFrom||f.dateTo));
 if(bodyList(f).length)parts.push(bodyList(f).join(', '));
 if(f.deals.length)parts.push(f.deals.join(', '));
 ['cap','vol','wt'].forEach(k=>{if(rgOn(x,k))parts.push(rgText(x,k))});
 if(x.fast)parts.push('быстрая оплата');
 return parts.join(', ')};
const watchLabel=f=>[f.from||'Любой город',f.to||'',bodyList(f).join(', ').toLowerCase()].filter(Boolean).join(' — ');
const matches=f=>CARGO.filter(c=>(!f.from||c.from.toLowerCase().includes(f.from.toLowerCase().trim()))&&(!f.to||c.to.toLowerCase().includes(f.to.toLowerCase().trim()))&&(!bodyList(f).length||bodyList(f).some(b=>c.body===BODY_SHORT[b]))&&dealMatch(f.deals,c));
const isWatched=()=>S.watch.some(w=>w.key===watchKey(S.filters));
const watchCount=w=>{const keep=S.filters;S.filters=w.f;try{const x=Object.assign(xfEmpty(),w.x||{});let n=filteredBase().filter(c=>xfPass(c,x)).length;if(n<MINR){genFor(w.f,x,MINR-n);n=filteredBase().filter(c=>xfPass(c,x)).length}return n}finally{S.filters=keep}};
function watchCards(){return S.watch.map((w,i)=>{const n=watchCount(w);return `<article class="card wcard" data-watchopen="${i}" tabindex="0"><div class="row between"><span class="tag num">${plural(n,'заявка','заявки','заявок')}</span><button type="button" class="kebab" data-wmenu="${i}" aria-label="Действия с отслеживанием" aria-haspopup="menu" aria-expanded="false">${ic('dotsV')}</button></div><div class="wdesc">${esc(w.desc||watchDesc(w.f,w.x))}</div><div class="wmenu" role="menu" hidden><button type="button" role="menuitem" data-wedit="${i}">Редактировать</button><button type="button" role="menuitem" class="danger" data-wdel="${i}">Удалить</button></div></article>`}).join('')}
const XF={cap:{title:'Грузоподъемность',hint:'Сколько должна поднимать машина',opts:[['0-5','до 5 т'],['5-10','5–10 т'],['10-20','10–20 т'],['20-99','от 20 т']]},
 vol:{title:'Объем кузова',hint:'Требуемый объем прицепа',opts:[['0-40','до 40 м³'],['40-82','40–82 м³'],['82-999','от 82 м³']]},
 wt:{title:'Вес груза',hint:'Общий вес груза в заказе',opts:[['0-5','до 5 т'],['5-15','5–15 т'],['15-99','от 15 т']]}};
const RG={cap:{title:'Грузоподъемность',unit:'т',hint:'Сколько должна поднимать машина, от 0,2 до 20 т',ph:['0,2 т','20 т']},
 vol:{title:'Объем, м³',unit:'м³',hint:'Требуемый объем кузова, от 4 до 120 м³',ph:['4 м³','120 м³']},
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
 return `<div class="row between"><h3>Фильтры</h3><button type="button" class="linkbtn" data-xfreset style="font-size:14px${xfCount(XD)?'':';visibility:hidden'}">Сбросить</button></div>${['cap','vol','wt'].map(k=>`<div class="sec" style="gap:8px"><div><b style="font-weight:500">${RG[k]?RG[k].title:XF[k].title}</b><div class="muted" style="font-size:12px">${RG[k]?RG[k].hint:XF[k].hint}</div></div>${RG[k]?rgFields(XD,k):`<div class="chips" style="flex-wrap:wrap">${XF[k].opts.map(([v,l])=>`<button class="chip xopt" data-xf="${k}:${v}" aria-pressed="${XD[k].includes(v)}">${l}</button>`).join('')}</div>`}</div>`).join('')}
 <div class="row between" style="padding:4px 0"><span>Только с быстрой оплатой</span><button class="switch" role="switch" aria-checked="${XD.fast}" data-xffast aria-label="Только с быстрой оплатой"></button></div>
 <div class="row"><button class="btn primary grow" data-xfapply>${n?'Показать '+plural(n,'груз','груза','грузов'):'Нет подходящих грузов'}</button></div>`}
function openXf(){XD=Object.assign(xfEmpty(),JSON.parse(JSON.stringify(S.extra||{})));XMODE='all';sheet(xfSheet())}
let XMODE='all';
function filtered(){return matchList(S.extra||xfEmpty())}
const rgBtnLbl=k=>rgOn(XD,k)?'Применить':'Закрыть';
function rgSheet(k){return `<h3>${RG[k].title}</h3><div class="muted" style="font-size:13px;margin-top:-8px">${RG[k].hint}</div>${rgFields(XD,k)}
 <div class="row"><button class="btn primary grow" data-xfapply>${rgBtnLbl(k)}</button></div>`}
function openRg(k){XD=Object.assign(xfEmpty(),JSON.parse(JSON.stringify(S.extra||{})));XMODE=k;sheet(rgSheet(k))}
function refreshXf(){const sh=document.querySelector('.sheet');if(!sh)return;const xr=sh.querySelector('[data-xfreset]');if(xr)xr.style.visibility=xfCount(XD)?'':'hidden';const b=sh.querySelector('[data-xfapply]');if(RG[XMODE]){if(b)b.textContent=rgBtnLbl(XMODE);return}const n=matchList(XD).length;if(b)b.textContent=n?'Показать '+plural(n,'груз','груза','грузов'):'Нет подходящих грузов'}
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
 const deals=[...new Set((f.deals.length?f.deals:Object.keys(DEAL_OF)).flatMap(d=>DEAL_OF[d]))],clients=['ASHN','Нордлайн','Агроснаб','ТехноКом','ВолгаТранс','Магистраль','ЮгАгро','УралСталь','Фреш Маркет','СеверЛес','Полимер-М','ТрансЕвразия'],pad=n=>String(n).padStart(2,'0');
 for(let i=0;i<need;i++){
  const from=F||pick(known.filter(n=>n!==T)),to=T||pick(known.filter(n=>n!==from)),A=MAP.C[from],B=MAP.C[to];
  const km=Math.max(60,Math.round(Math.hypot(A[0]-B[0],A[1]-B[1])*4.6/10)*10+40);
  const [body,load]=bodyList(f).length?bodyMap[pick(bodyList(f))]:pick([['Реф','Задняя'],['Тент','Боковая'],['Тент','Верхняя'],['Изотерм','Задняя']]);
  const cap=rg('cap',0.2,20,1),vol=rg('vol',4,120,0),wt=rg('wt',0.2,24,1),deal=pick(deals);
  const d1=12+Math.floor(rnd()*6),h1=6+Math.floor(rnd()*12),hrs=Math.max(4,Math.round(km/60)),d2=d1+Math.floor((h1+hrs)/24),h2=(h1+hrs)%24;
  const price=Math.round(km*(body==='Реф'?95:78)*(0.85+rnd()*.4)/100)*100;
  const c={id:'СП09'+String(1000+Math.floor(rnd()*8999)),gen:true,cap,vol,wt,client:pick(clients),rating:Math.round((4+rnd()*.95)*10)/10,body,load,items:pick(['1 груз','2 груза','3 груза']),
   pallets:(cap>=15?18+Math.floor(rnd()*15):4+Math.floor(rnd()*12))+' пл.',from,to,fromWhen:`${d1} дек, ${pad(h1)}:00 — ${d1} дек, ${pad(Math.min(23,h1+4))}:00`,toWhen:`${d2} дек, ${pad(h2)}:00 — ${d2} дек, ${pad(Math.min(23,h2+6))}:00`,
   via:km>900&&rnd()<.4?1:0,deal,km,price,bonus:Math.max(10,Math.round(price/10000)*10),fast:x.fast?true:rnd()<.5,express:rnd()<.4,vat:false};
  if(isAuc({deal}))c.timer=60+Math.floor(rnd()*240);
  if(!CARGO.some(o=>o.id===c.id))CARGO.push(c);
 }
}
function matchList(x){x=Object.assign(xfEmpty(),x||{});let l=filteredBase().filter(c=>xfPass(c,x));if(l.length<MINR){genFor(S.filters,x,MINR-l.length);l=filteredBase().filter(c=>xfPass(c,x))}return l}
function filteredBase(){
 const f=S.filters,bodyMap={'Рефрижератор':'Реф','Тент':'Тент','Изотерм':'Изотерм'};
 return CARGO.filter(c=>(!f.from||c.from.toLowerCase().includes(f.from.toLowerCase().trim()))&&(!f.to||c.to.toLowerCase().includes(f.to.toLowerCase().trim()))&&(!bodyList(f).length||bodyList(f).some(b=>c.body===bodyMap[b]))&&dealMatch(f.deals,c));
}
let ALLN=50;const FEED=()=>CARGO.filter(c=>!c.gen&&!S.bids.some(b=>b.id===c.id)&&!(S.auc&&S.auc[c.id]&&S.auc[c.id].my!=null)&&dealMatch(S.filters.deals,c));
