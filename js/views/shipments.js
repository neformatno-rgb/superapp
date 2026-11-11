'use strict';
V.shipments=()=>{
 const F=shfF(),l=S.shipments.filter(SHIP_TAB[S.shipTab]).filter(s=>Object.keys(SHF_LBL).every(k=>!F[k].length||F[k].includes(shfVal[k](s))));
 return topBar('Мои перевозки',{titleBtn:'search'})+`<div class="page">${seg('shipTab',[['active','Активные'],['canceled','Отмененные'],['rejected','Отклоненные']],S.shipTab)}
  <div class="chips"><button class="chip ic-chip" data-shall aria-haspopup="dialog" aria-label="Все фильтры" aria-pressed="${shaAny(F)}">${ic('filter')}</button>${Object.keys(SHF_LBL).map(shfChip).join('')}</div>
  <div class="row between"><b style="font-size:16px">${plural(l.length,'перевозка','перевозки','перевозок')}</b>${vatBtn()}</div>
  ${l.length?l.map(s=>shipCard(s,true)).join(''):`<div class="card empty"><span class="muted">${Object.values(F).some(a=>a.length)?'Нет перевозок по выбранным фильтрам.':'Здесь пока пусто.'}</span></div>`}</div>`;
};
