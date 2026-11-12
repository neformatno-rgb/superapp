'use strict';
V.shipments=()=>{
 const F=shfF(),l=S.shipments.filter(SHIP_TAB[S.shipTab]).filter(s=>Object.keys(SHF_LBL).every(k=>!F[k].length||F[k].includes(shfVal[k](s))));
 return topBar('Мои перевозки',{titleBtn:'search',actions:`<button class="icon-btn sq-btn" data-cargoq="ship" aria-label="Поиск по перевозкам" aria-haspopup="dialog">${SQ_SEARCH}</button>`})+`<div class="page">${seg('shipTab',[['active','Активные'],['done','Завершенные'],['canceled','Отмененные'],['rejected','Отклоненные']],S.shipTab)}
  <div class="chips"><button class="chip ic-chip" data-shall aria-haspopup="dialog" aria-label="Все фильтры" aria-pressed="${shaAny(F)}">${ic('filter')}</button>${Object.keys(SHF_LBL).map(shfChip).join('')}</div>
  <div class="row between"><b style="font-size:16px">${plural(l.length,'перевозка','перевозки','перевозок')}</b>${vatBtn()}</div>
  ${l.length?l.map(s=>shipCard(s,true)).join(''):`<div class="card empty track-empty"><img src="${SHIP_IMG}" alt=""><b>${Object.values(F).some(a=>a.length)?'Ничего не нашлось':{active:'Активных перевозок нет',done:'Завершенных перевозок нет',canceled:'Отмененных перевозок нет',rejected:'Отклоненных перевозок нет'}[S.shipTab]}</b><span class="muted">${Object.values(F).some(a=>a.length)?'Нет перевозок по выбранным фильтрам.':'Здесь пока пусто.'}</span></div>`}</div>`;
};
