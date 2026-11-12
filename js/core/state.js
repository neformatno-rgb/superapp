'use strict';
/* ---------- persisted demo state ---------- */
const KEY='perevozchik-demo-v1';
const fresh=()=>({fav:['СП085204'],watch:[],homeTabA:'active',homeTabB:'fav',searchTab:'all',
 filters:{from:'',to:'',dateFrom:'',dateTo:'',body:'',deals:[]},fv:2,searched:false,
 shipTab:'active',shipments:[{id:'СП085159',status:'loading',stage:'enroute',cargoCheck:'pending',remarks:null,done:[]}],
 apply:{pay:'fast',bonus:false,fuel:false,insure:false,contract:null,truck:null,trailer:null,driver:null},tripTab:'trip',pointsTab:'next'});
let S; try{S=JSON.parse(localStorage.getItem(KEY))||fresh()}catch(e){S=fresh()}
/* search form starts empty: clear filters saved by earlier demo versions once */
if(S.fv!==2){S.filters={from:'',to:'',dateFrom:'',dateTo:'',body:'',deals:[]};S.fv=2}
if(!Array.isArray(S.watch))S.watch=[];
/* demo: a couple of completed shipments for the «Завершенные» tab */
if(!S.doneSeed){S.doneSeed=1;[['СП085267','04 дек'],['СП085204','28 ноя']].forEach(([id,d])=>{if(!S.shipments.some(x=>x.id===id))S.shipments.push({id,status:'done',stage:'departed',cargoCheck:'ok',remarks:null,done:['load','unload'],doneAt:d})})}
if(!Array.isArray(S.bids))S.bids=[];
if(S.filters&&Array.isArray(S.filters.deals)&&S.filters.deals.length===3)S.filters.deals=[];
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const cargoById=id=>CARGO.find(c=>c.id===id)||CARGO[0];
const shipById=id=>S.shipments.find(s=>s.id===id);
const STATUS={assigned:['Назначен','blue'],loading:['На погрузке','green'],transit:['В пути','orange'],done:['Завершен','green'],canceled:['Отменен','gray'],rejected:['Отклонен','gray']};
