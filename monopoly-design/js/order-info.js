/* Order details derived from an order (company, route points, addresses): shared by the list/order page and checkout. */
'use strict';

const MAP_SRC = 'assets/img/route-map.jpg';
const hpick = (a, h) => a[h % a.length];
const initials = (n) => { const w = n.split(/\s+/); if (w.length > 1) return (w[0][0] + w[1][0]).toUpperCase(); const caps = n.match(/[А-ЯA-Z]/g) || [n[0]]; return (caps[0] + (caps[1] || n[1] || '')).toUpperCase(); };
const plainWin = (day, key) => winHTML(day, key).replace(/<\/?b>/g, '');
const phone = (h) => '+7 (9' + String(10 + h % 89).padStart(2, '0') + ') ' + String(100 + (h >> 4) % 900) + '-' + String(10 + (h >> 9) % 90) + '-' + String(10 + (h >> 13) % 90);
const loadType = (b) => /боков/.test(b) ? 'Боковая' : /Газель/.test(b) ? 'Задняя, боковая' : 'Задняя';
const tempMode = (b) => b === 'Рефрижератор' ? '+2 … +4 °C' : b === 'Изотерм' ? '+5 … +15 °C' : 'Не требуется';

function orderInfo(o) {
  const h = hashStr(o.id);
  const company = hpick(COMPANIES, h);
  const pts = [{ kind: 'ld', city: o.from, reg: o.fromReg, day: o.fromDay, key: o.id + 'f' }];
  for (let i = 0; i < o.stops; i++) {
    const c = cities[(h >> (3 + i * 4)) % cities.length];
    const city = (c[0] === o.from || c[0] === o.to) ? cities[(h + 5 + i) % cities.length] : c;
    pts.push({ kind: 'ul', city: city[0], reg: city[1], day: Math.round(o.fromDay + (o.toDay - o.fromDay) * (i + 1) / (o.stops + 1)), key: o.id + 's' + i, part: true });
  }
  pts.push({ kind: 'ul', city: o.to, reg: o.toReg, day: o.toDay, key: o.id + 't' });
  pts.forEach((p, i) => {
    const k = hashStr(p.key);
    const g = GEO[p.city] || [55 + (k % 500) / 100, 37 + (k % 900) / 100];
    p.addr = p.city + ' (' + p.reg + '), ' + hpick(STREETS, k) + ', д. ' + (1 + k % 87);
    p.geo = (g[0] + ((k >> 5) % 200 - 100) / 2000).toFixed(4) + ', ' + (g[1] + ((k >> 9) % 200 - 100) / 2000).toFixed(5);
    p.site = hpick(SITES, k >> 3) + ' | ' + phone(k);
    p.note = hpick(NOTES, k >> 6);
    p.rating = (4 + (k % 10) / 10).toFixed(1).replace('.', ',');
  });
  return { company, ini: initials(company), views: 40 + h % 360, oRating: (4 + ((h >> 5) % 10) / 10).toFixed(1).replace('.', ','),
           pts, cargoValue: (300 + (h >> 7) % 1700) * 1000, payDays: [5, 7, 10, 14, 20, 30][(h >> 11) % 6] };
}
