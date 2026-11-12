'use strict';
/* ---------- demo data ---------- */
/* deal types: «Фикс», «Аукцион», «Фикс+аукцион», «Фикс+встречное»; filter chips pick by part */
const isFix=c=>c.deal.startsWith('Фикс'),isAuc=c=>/аукцион/i.test(c.deal),isCo=c=>/встречное/i.test(c.deal);
const DEAL_OF={'Фикс':['Фикс','Фикс+аукцион','Фикс+встречное'],'Аукцион':['Аукцион','Фикс+аукцион'],'Встречное':['Фикс+встречное']};
const dealMatch=(sel,c)=>!sel.length||sel.some(d=>d==='Фикс'?isFix(c):d==='Аукцион'?isAuc(c):isCo(c));
const CARGO=[
 {id:'СП085159',cap:12,vol:82,wt:10,client:'ASHN',rating:4.6,body:'Реф',load:'Задняя',items:'2 груза',pallets:'30 пл.',from:'Санкт-Петербург',to:'Екатеринбург',fromWhen:'12 дек, 20:00 — 13 дек, 05:00',toWhen:'15 дек, 08:00 — 15 дек, 18:00',via:2,deal:'Аукцион',timer:287,km:1350,price:148800,bonus:300,fast:true,express:true,vat:false},
 {id:'СП085204',cap:20,vol:86,wt:16,client:'Нордлайн',rating:4.8,body:'Тент',load:'Боковая',items:'1 груз',pallets:'18 пл.',from:'Москва',to:'Казань',fromWhen:'13 дек, 09:00 — 13 дек, 14:00',toWhen:'14 дек, 07:00 — 14 дек, 12:00',via:0,deal:'Фикс',km:820,price:61500,bonus:150,fast:true,express:false,vat:false},
 {id:'СП085233',cap:20,vol:82,wt:18,client:'Агроснаб',rating:4.3,body:'Реф',load:'Задняя',items:'3 груза',pallets:'33 пл.',from:'Краснодар',to:'Москва',fromWhen:'14 дек, 06:00 — 14 дек, 10:00',toWhen:'16 дек, 09:00 — 16 дек, 20:00',via:1,deal:'Фикс+встречное',km:1350,price:132000,bonus:250,fast:false,express:true,vat:false},
 {id:'СП085267',cap:5,vol:36,wt:3.5,client:'ТехноКом',rating:4.9,body:'Изотерм',load:'Задняя',items:'1 груз',pallets:'12 пл.',from:'Санкт-Петербург',to:'Великий Новгород',fromWhen:'12 дек, 15:00 — 12 дек, 18:00',toWhen:'12 дек, 22:00 — 13 дек, 02:00',via:0,deal:'Фикс',km:190,price:24700,bonus:50,fast:true,express:true,vat:false},
 {id:'СП085301',cap:10,vol:60,wt:9,client:'Сибирь Логистик',rating:4.5,body:'Тент',load:'Верхняя',items:'2 груза',pallets:'26 пл.',from:'Новосибирск',to:'Омск',fromWhen:'15 дек, 07:00 — 15 дек, 12:00',toWhen:'16 дек, 06:00 — 16 дек, 14:00',via:0,deal:'Фикс+аукцион',timer:245,km:650,price:58900,bonus:120,fast:false,express:false,vat:false}
];
const ORDER={contract:['06/02 №Д-6194.2022','11/05 №Д-7012.2023'],trucks:['А 778 РО 89 / Mercedes-Benz Actros','В 412 КК 78 / Volvo FH'],trailers:['ВТ 3341 78 / Schmitz S.KO','АО 1290 89 / Krone Cool Liner'],
 drivers:[{name:'Кусиков Михаил Сергеевич',license:'23 УК 2111344',phone:'+7 (920) 123-12-12',birth:'12 января 1988',passport:'7770 №203050'},{name:'Орлов Денис Викторович',license:'78 ТВ 5530912',phone:'+7 (921) 402-77-15',birth:'3 марта 1985',passport:'4012 №518744'}]};
