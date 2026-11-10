'use strict';
V.shipments=()=>{
 const map={active:s=>!['canceled','rejected'].includes(s.status),canceled:s=>s.status==='canceled',rejected:s=>s.status==='rejected'};
 const l=S.shipments.filter(map[S.shipTab]);
 return topBar('Мои перевозки',{titleBtn:'search'})+`<div class="page">${seg('shipTab',[['active','Активные'],['canceled','Отменённые'],['rejected','Отклонённые']],S.shipTab)}
  <div class="chips">${['Статус','Откуда','Куда','Менеджер'].map(c=>`<button class="chip" data-chip aria-pressed="false">${c} ${ic('chevD','s')}</button>`).join('')}</div>
  <div class="row between"><b style="font-size:16px">${plural(l.length,'перевозка','перевозки','перевозок')}</b>${vatBtn()}</div>
  ${l.length?l.map(s=>shipCard(s,true)).join(''):`<div class="card empty"><span class="muted">Здесь пока пусто.</span></div>`}</div>`;
};
