/* Formatting and small helpers shared by every screen. */
'use strict';

// ---------- helpers ----------
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const nf = (n) => Math.round(n).toLocaleString('ru-RU').replace(/ /g, ' ');
const money = (n) => nf(n) + ' ₽';
const dayLabel = (d) => d > 30 ? String(d - 30).padStart(2, '0') + ' дек' : d + ' ноя';
const plural = (n) => { const a = n % 10, b = n % 100; if (a === 1 && b !== 11) return 'груз'; if (a >= 2 && a <= 4 && (b < 10 || b >= 20)) return 'груза'; return 'грузов'; };
const store = { get(k, d) { try { const v = localStorage.getItem('cargo-' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
                set(k, v) { try { localStorage.setItem('cargo-' + k, JSON.stringify(v)); } catch (e) {} } };



// time windows: some all-day, some exact (may cross midnight: «12 дек, 20:00 — 13 дек, 05:00»)
function hashStr(t) { let h = 7; for (let i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) >>> 0; return h; }
const hh = (n) => String(n).padStart(2, '0') + ':00';
function winHTML(day, key) {
  const h = hashStr(key);
  if (h % 3 === 0) return '<b>' + dayLabel(day) + ',</b> 00:00 - 23:59';
  const start = 6 + (h >> 3) % 17;            // 06:00…22:00
  const dur = 3 + (h >> 7) % 10;              // 3…12 часов
  const end = start + dur;
  if (end < 24) return '<b>' + dayLabel(day) + ',</b> ' + hh(start) + ' — ' + hh(end);
  return '<b>' + dayLabel(day) + ',</b> ' + hh(start) + ' — ' + dayLabel(day + 1) + ', ' + hh(end - 24);
}
const stopsWord = (n) => n === 1 ? 'точка' : n < 5 ? 'точки' : 'точек';

// range filter value "a-b" (a=0: no lower bound, b>=999: no upper bound) → «от 0,2 т», «до 20 т», «0,2–20 т»
const rangeText = (v, unit) => { const [a, b] = v.split('-').map(Number); const f = (x) => String(x).replace('.', ','); return a <= 0 ? 'до ' + f(b) + ' ' + unit : b >= 999 ? 'от ' + f(a) + ' ' + unit : f(a) + '–' + f(b) + ' ' + unit; };
