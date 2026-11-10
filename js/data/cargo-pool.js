'use strict';
/* ---------- extra cargo pool: deterministic, so searches return varied results ---------- */
(function(){
 const cities=Object.keys(MAP.C).filter(n=>!['Тихорецк','Ишим','Барабинск','Курган'].includes(n));
 let seed=20261210;const rnd=()=>(seed=(seed*1103515245+12345)%2147483648)/2147483648;const pick=a=>a[Math.floor(rnd()*a.length)];
 const clients=['ASHN','Нордлайн','Агроснаб','ТехноКом','Сибирь Логистик','ВолгаТранс','Магистраль','ЮгАгро','УралСталь','Деловые Линии','Фреш Маркет','СеверЛес','Полимер-М','ТрансЕвразия'];
 const bodies=[['Реф','Задняя'],['Тент','Боковая'],['Тент','Верхняя'],['Изотерм','Задняя'],['Тент','Задняя']];
 const deals=['Фикс','Фикс','Аукцион','Встречное'],mon=' дек';
 const pad=n=>String(n).padStart(2,'0');
 const used=new Set(CARGO.map(c=>c.from+'|'+c.to));
 let n=0,id=85320;
 // guarantee every city has outgoing and incoming loads
 const pairs=[];cities.forEach(a=>{pairs.push([a,pick(cities.filter(b=>b!==a))]);pairs.push([pick(cities.filter(b=>b!==a)),a])});
 while(pairs.length<160){const a=pick(cities),b=pick(cities);if(a!==b)pairs.push([a,b])}
 pairs.forEach(([from,to])=>{
  const A=MAP.C[from],B=MAP.C[to],km=Math.round(Math.hypot(A[0]-B[0],A[1]-B[1])*4.6/10)*10+40;
  const [body,load]=pick(bodies),cap=pick([5,10,12,20,20,20]),deal=pick(deals);
  const d1=12+Math.floor(rnd()*5),h1=6+Math.floor(rnd()*12),hours=Math.max(4,Math.round(km/60)),d2=d1+Math.floor((h1+hours)/24),h2=(h1+hours)%24;
  const via=km>900&&rnd()<.5?1:0,price=Math.round(km*(body==='Реф'?95:78)*(0.85+rnd()*.4)/100)*100;
  const c={id:'СП0'+(id+=7+Math.floor(rnd()*30)),cap,vol:cap>=20?86:cap>=10?60:36,wt:Math.round(cap*(0.5+rnd()*.4)*10)/10,client:pick(clients),rating:Math.round((4+rnd()*.95)*10)/10,
   body,load,items:pick(['1 груз','2 груза','3 груза']),pallets:(cap>=20?18+Math.floor(rnd()*15):6+Math.floor(rnd()*12))+' пл.',from,to,
   fromWhen:`${d1}${mon}, ${pad(h1)}:00 — ${d1}${mon}, ${pad(Math.min(23,h1+4))}:00`,toWhen:`${d2}${mon}, ${pad(h2)}:00 — ${d2}${mon}, ${pad(Math.min(23,h2+6))}:00`,
   via,deal,km,price,bonus:Math.round(price/1000/10)*10||10,fast:rnd()<.5,express:rnd()<.4,vat:false};
  if(deal==='Аукцион')c.timer=600+Math.floor(rnd()*7000);
  CARGO.push(c);
 });
})();
