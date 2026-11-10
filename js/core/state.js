'use strict';
/* ---------- persisted demo state ---------- */
const KEY='perevozchik-demo-v1';
const fresh=()=>({fav:['СП085204'],watch:[],homeTabA:'active',homeTabB:'fav',searchTab:'all',
 filters:{from:'Санкт-Петербург',to:'',dateFrom:'',dateTo:'',body:'Рефрижератор',deals:[]},searched:false,
 shipTab:'active',shipments:[{id:'СП085159',status:'loading',stage:'enroute',cargoCheck:'pending',remarks:null,done:[]}],
 apply:{pay:'fast',bonus:false,fuel:false,insure:false,contract:null,truck:null,trailer:null,driver:null},tripTab:'trip',pointsTab:'next'});
let S; try{S=JSON.parse(localStorage.getItem(KEY))||fresh()}catch(e){S=fresh()}
if(!Array.isArray(S.watch))S.watch=[];
if(S.filters&&Array.isArray(S.filters.deals)&&S.filters.deals.length===3)S.filters.deals=[];
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const cargoById=id=>CARGO.find(c=>c.id===id)||CARGO[0];
const shipById=id=>S.shipments.find(s=>s.id===id);
const STATUS={assigned:['Назначен','blue'],loading:['На погрузке','green'],transit:['В пути','orange'],canceled:['Отменён','gray'],rejected:['Отклонён','gray']};
