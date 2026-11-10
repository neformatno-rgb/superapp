'use strict';
/* ---------- apply screen: dropdowns, bonus write-off, fuel after loading ---------- */
/* custom dropdowns on the apply screen */
function ddClose(except){document.querySelectorAll('.dd-wrap.open').forEach(w=>{if(w!==except){w.classList.remove('open');w.querySelector('[data-dd]').setAttribute('aria-expanded','false')}})}
document.addEventListener('click',e=>{const o=e.target.closest('[data-ddopt]');
 if(o&&o.closest('#layer')){e.preventDefault();e.stopPropagation();const w=o.closest('.dd-wrap'),i=+o.dataset.ddopt.split(':')[1];w.dataset.val=i;
  w.querySelector('.dd-btn>span').textContent=o.textContent;w.querySelector('.dd-btn>span').className='';w.querySelectorAll('.dd-opt').forEach(x=>{const on=x===o;x.setAttribute('aria-selected',String(on));const c=x.querySelector('svg');c&&c.remove();if(on)x.insertAdjacentHTML('beforeend',ic('check','s'))});ddClose();fuelRefresh();return}
 if(o){e.preventDefault();e.stopPropagation();const [k,i]=o.dataset.ddopt.split(':');S.apply[k]=+i;save();const y=window.scrollY;render();window.scrollTo(0,y);return}
 const b=e.target.closest('[data-dd]');if(b){e.preventDefault();e.stopPropagation();const w=b.closest('.dd-wrap'),on=!w.classList.contains('open');ddClose(w);w.classList.toggle('open',on);b.setAttribute('aria-expanded',String(on));return}
 if(!e.target.closest('.dd-menu'))ddClose()},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.querySelector('.dd-wrap.open'))ddClose()});
/* bonus write-off: switching on asks how many points to spend */
const BONUS_MAX=18541;
const INS_IMG='assets/img/insurance.webp';
const FUEL_IMG='assets/img/fuel.webp';
const COIN_IMG='assets/img/bonus-coin.webp';
const bonusSheet=()=>`<h3>Списать бонусы</h3><div class="muted" style="font-size:13px;margin-top:-8px">Доступно ${BONUS_MAX.toLocaleString('ru-RU')} баллов, 1 балл = 1 ₽</div>
 <div class="field"><label for="bnIn">Сколько списать</label><input class="input" id="bnIn" inputmode="numeric" enterkeyhint="done" autocomplete="off" placeholder="От 1 до ${BONUS_MAX.toLocaleString('ru-RU')}"></div>
 <div class="dp-chips"><button type="button" class="dp-chip" data-bnall>Списать все</button></div>
 <button type="button" class="btn secondary block" data-bnapply>Закрыть</button>`;
const bnVal=()=>{const i=document.getElementById('bnIn');return i?Math.min(BONUS_MAX,+(i.value.replace(/\D/g,''))||0):0};
function bnRefresh(){const b=document.querySelector('[data-bnapply]');if(!b)return;const n=bnVal();b.textContent=n?'Применить':'Закрыть';b.className='btn block '+(n?'primary':'secondary')}
function bnApply(){const n=bnVal();if(n){S.apply.bonus=true;S.apply.bonusAmt=n;save()}closeSheet();const y=window.scrollY;render();window.scrollTo(0,y)}
document.addEventListener('input',e=>{if(e.target.id!=='bnIn')return;const n=bnVal();e.target.value=n?n.toLocaleString('ru-RU'):'';bnRefresh()});
document.addEventListener('keydown',e=>{if(e.target.id==='bnIn'&&e.key==='Enter'){e.preventDefault();bnApply()}});
document.addEventListener('click',e=>{if(e.target.closest('[data-bnall]')){e.stopPropagation();const i=document.getElementById('bnIn');i.value=BONUS_MAX.toLocaleString('ru-RU');bnRefresh();return}
 if(e.target.closest('[data-bnapply]')){e.stopPropagation();bnApply()}},true);
/* fuel after loading: switching on asks for a contract and an amount (up to 60% of the payout) */
const FUEL_CONTRACTS=['06/03 №Д-6335.2022','11/05 №Д-7012.2023'];
const fuelMax=()=>Math.round(applyTotal(cargoById(S.param))*0.6);
const fuelSheet=()=>`<h3>Топливо после погрузки</h3>
 <div class="field"><label for="fuelK">Номер договора</label><div class="dd-wrap" id="fuelDd"><button type="button" class="input dd-btn" id="fuelK" data-dd aria-haspopup="listbox" aria-expanded="false"><span class="muted">Выберите договор</span>${ic('chevD','s')}</button><div class="dd-menu" role="listbox" aria-label="Номер договора">${FUEL_CONTRACTS.map((x,i)=>`<button type="button" class="dd-opt" role="option" aria-selected="false" data-ddopt="fuelK:${i}"><span class="grow">${esc(x)}</span></button>`).join('')}</div></div>
  <div class="muted" style="font-size:12px;line-height:16px">Договор, в рамках которого будет оказана услуга «Топливо после погрузки»</div></div>
 <div class="field"><label for="fuelIn">Сумма для «Топлива после погрузки», ₽</label><input class="input" id="fuelIn" inputmode="numeric" enterkeyhint="done" autocomplete="off">
  <div class="muted" style="font-size:12px;line-height:16px">Не более 60% — ${fuelMax().toLocaleString('ru-RU')}</div></div>
 <button type="button" class="btn secondary block" data-fuelapply>Закрыть</button>`;
const fuelVal=()=>{const i=document.getElementById('fuelIn');return i?Math.min(fuelMax(),+(i.value.replace(/\D/g,''))||0):0};
function fuelRefresh(){const b=document.querySelector('[data-fuelapply]');if(!b)return;const w=document.getElementById('fuelDd'),ok=fuelVal()>0&&w&&w.dataset.val!=null;b.textContent=ok?'Применить':'Закрыть';b.className='btn block '+(ok?'primary':'secondary')}
function fuelApply(){const w=document.getElementById('fuelDd'),n=fuelVal();if(n&&w&&w.dataset.val!=null){S.apply.fuel=true;S.apply.fuelAmt=n;S.apply.fuelContract=+w.dataset.val;save()}else if(n){toast('Выберите договор');return}closeSheet();const y=window.scrollY;render();window.scrollTo(0,y)}
document.addEventListener('input',e=>{if(e.target.id!=='fuelIn')return;const n=fuelVal();e.target.value=n?n.toLocaleString('ru-RU'):'';fuelRefresh()});
document.addEventListener('keydown',e=>{if(e.target.id==='fuelIn'&&e.key==='Enter'){e.preventDefault();e.target.blur()}});
document.addEventListener('click',e=>{if(e.target.closest('[data-fuelapply]')){e.stopPropagation();fuelApply()}},true);
