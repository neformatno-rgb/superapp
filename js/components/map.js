'use strict';
/* ---------- route map rendering, full-screen map ---------- */
function routeOf(c){const r=MAP.routes[c.from+'|'+c.to]||MAP.routes[c.to+'|'+c.from];if(!r)return [c.from,c.to].filter(x=>MAP.C[x]);return MAP.routes[c.from+'|'+c.to]?r:[...r].reverse()}
function routeBox(c,pad){const pts=routeOf(c).map(n=>MAP.C[n]);let x0=Math.min(...pts.map(p=>p[0])),x1=Math.max(...pts.map(p=>p[0])),y0=Math.min(...pts.map(p=>p[1])),y1=Math.max(...pts.map(p=>p[1]));
 let w=Math.max(x1-x0,60)+pad*2,h=Math.max(y1-y0,40)+pad*2;if(w/h<1.6)w=h*1.6;else h=w/1.6;const cx=(x0+x1)/2,cy=(y0+y1)/2;return [cx-w/2,cy-h/2,w,h]}
function smooth(pts){if(pts.length<3)return 'M'+pts.map(p=>p.join(' ')).join(' L');let d='M'+pts[0].join(' ');for(let i=1;i<pts.length-1;i++){const m=[(pts[i][0]+pts[i+1][0])/2,(pts[i][1]+pts[i+1][1])/2];d+=` Q${pts[i][0]} ${pts[i][1]} ${m[0]} ${m[1]}`}return d+' L'+pts[pts.length-1].join(' ')}
function mapSvg(c,{vb,k=1,fit='slice'}={}){
 const names=routeOf(c),pts=names.map(n=>MAP.C[n]),d=smooth(pts);
 const others=Object.keys(MAP.C).filter(n=>!names.includes(n)&&['Москва','Санкт-Петербург','Казань','Екатеринбург','Новосибирск','Омск','Краснодар','Нижний Новгород','Самара','Пермь','Уфа','Челябинск','Воронеж','Ростов-на-Дону','Тюмень','Вологда','Киров'].includes(n));
 const lbl=(n,cls,dx,dy,fs,anchor='start')=>{const [x,y]=MAP.C[n];return `<text class="maplbl ${cls}" data-fs="${fs}" data-dx="${dx}" data-dy="${dy}" text-anchor="${anchor}" x="${x+dx*k}" y="${y+dy*k}" font-size="${fs*k}">${esc(n)}</text>`};
 const ltr=pts[0][0]<=pts[pts.length-1][0];
 return `<svg viewBox="${vb.join(' ')}" preserveAspectRatio="xMidYMid ${fit}" role="img" aria-label="Карта маршрута ${esc(c.from)} — ${esc(c.to)}" data-k="${k}">
  <rect x="-2000" y="-2000" width="6000" height="6000" fill="var(--sea)"/>
  <path d="${MAP.land}" fill="var(--land)"/><path d="${MAP.russia}" fill="var(--land-ru)"/>
  <path d="${MAP.borders}" fill="none" stroke="var(--border)" stroke-width="1" stroke-dasharray="4 3" vector-effect="non-scaling-stroke"/>
  <g class="others">${others.map(n=>{const [x,y]=MAP.C[n];return `<circle data-r="2.5" cx="${x}" cy="${y}" r="${2.5*k}" fill="var(--muted)"/>`+lbl(n,'sm',5,-4,10)}).join('')}</g>
  <path d="${d}" fill="none" stroke="var(--surface)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
  <path d="${d}" fill="none" stroke="var(--accent)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
  ${pts.slice(1,-1).map((p,i)=>`<circle data-r="3.5" cx="${p[0]}" cy="${p[1]}" r="${3.5*k}" fill="var(--surface)" stroke="var(--accent)" stroke-width="2" vector-effect="non-scaling-stroke"/>`+lbl(names[i+1],'sm',6,-5,11)).join('')}
  <circle data-r="7" cx="${pts[0][0]}" cy="${pts[0][1]}" r="${7*k}" fill="var(--surface)" stroke="var(--green)" stroke-width="4" vector-effect="non-scaling-stroke"/>
  <circle data-r="7" cx="${pts[pts.length-1][0]}" cy="${pts[pts.length-1][1]}" r="${7*k}" fill="var(--surface)" stroke="var(--accent)" stroke-width="4" vector-effect="non-scaling-stroke"/>
  ${lbl(names[0],'',ltr?-10:10,-12,13,ltr?'start':'end')}${lbl(names[names.length-1],'',ltr?10:-10,-12,13,ltr?'end':'start')}
 </svg>`;
}
function mapPreview(c){const vb=routeBox(c,75);const k=vb[2]/360;return `<button class="mapbox" data-fullmap="${c.id}" aria-label="Открыть карту маршрута">${mapSvg(c,{vb,k})}<span class="open">${ic('map','s')} Открыть карту</span></button>`}
let FM=null;
function openFullMap(id){
 const c=cargoById(id);
 document.getElementById('layer').innerHTML=`<div class="fullmap" role="dialog" aria-modal="true" aria-label="Карта маршрута">
  <header class="top"><button class="icon-btn" data-closemap aria-label="Закрыть карту">${ic('x')}</button><h1 class="m">${esc(c.from)} — ${esc(c.to)}</h1></header>
  <div class="stage" id="mapStage">${mapSvg(c,{vb:routeBox(c,80),fit:'meet'})}
   <div class="zoom"><button data-zoom="1.6" aria-label="Приблизить">+</button><button data-zoom="0.625" aria-label="Отдалить">−</button><button data-zoomfit aria-label="Показать весь маршрут">${ic('map','s')}</button></div>
   <div class="mapinfo"><div class="row between"><b style="font-weight:500">${esc(routeOf(c).join(' → '))}</b></div><div class="muted num" style="font-size:13px;margin-top:4px">${c.km.toLocaleString('ru-RU')} км · ${rub(c.price)}</div></div>
  </div></div>`;
 const svg=document.querySelector('#mapStage svg');FM={c,svg,vb:routeBox(c,80)};fitLabels();
}
function fitLabels(){if(!FM)return;const st=document.getElementById('mapStage');const r=st.getBoundingClientRect();const vb=FM.vb;
 const k=Math.max(vb[2]/r.width,vb[3]/r.height); // meet
 FM.svg.setAttribute('viewBox',vb.join(' '));
 FM.svg.querySelectorAll('[data-fs]').forEach(t=>{const f=+t.dataset.fs;t.setAttribute('font-size',f*k)});
 FM.svg.querySelectorAll('circle[data-r]').forEach(ci=>ci.setAttribute('r',ci.dataset.r*k));
 FM.svg.querySelectorAll('text[data-fs]').forEach(t=>{const p=MAP.C[t.textContent];if(p){t.setAttribute('x',p[0]+t.dataset.dx*k);t.setAttribute('y',p[1]+t.dataset.dy*k)}});}
function zoomAt(f,cx,cy){const vb=FM.vb,st=document.getElementById('mapStage').getBoundingClientRect();const k=Math.max(vb[2]/st.width,vb[3]/st.height);
 const px=cx==null?vb[0]+vb[2]/2:vb[0]+(cx-st.left-(st.width-vb[2]/k)/2)*k,py=cy==null?vb[1]+vb[3]/2:vb[1]+(cy-st.top-(st.height-vb[3]/k)/2)*k;
 let w=Math.min(Math.max(vb[2]/f,60),MAP.W*1.4),h=w*vb[3]/vb[2];FM.vb=[px-(px-vb[0])*w/vb[2],py-(py-vb[1])*h/vb[3],w,h];fitLabels()}
