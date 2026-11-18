// Zeit48 Bausteine. Jede Funktion liefert HTML; p = Animationsfortschritt 0..1 (statisch: 1).
const Z = {};
Z.ease = t => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
Z.clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

Z.logo = (theme, w = 210) => `<svg viewBox="0 0 340 102" style="width:${w}px;height:${w * 0.3}px;overflow:visible"><g transform="skewX(-9)"><text x="4" y="78" font-family="BC" font-weight="800" font-style="italic" font-size="92" letter-spacing="-1"><tspan fill="${theme === 'dark' ? '#F4F3F0' : '#1A1A1A'}">ZEIT</tspan><tspan fill="#D4AF37">48</tspan></text></g></svg>`;

Z.footer = (label, y) => `<div class="footer" style="top:${y}px"><span class="label">${label || 'ARBEITSZEIT · AUF DIE MINUTE'}</span><span class="rule"></span><span class="site">ZEIT48.DE</span></div>`;

// Tagesleiste: {type:'tagesleiste', start:7, end:18, blocks:[{von:7,bis:12,art:'arbeit'|'pause'|'ueber'}], titel}
Z.tagesleiste = (e, theme, p = 1, w = 904) => {
  const s = e.start ?? 7, en = e.end ?? 18, span = en - s, cut = s + span * Z.ease(p);
  const work = theme === 'dark' ? '#F4F3F0' : '#121212';
  let bars = '';
  for (const b of e.blocks || []) {
    const von = b.von, bis = Math.min(b.bis, cut); if (bis <= von) continue;
    const x = (von - s) / span * w, bw = (bis - von) / span * w;
    let fill = work, extra = '';
    if (b.art === 'pause') { fill = 'url(#hatch)'; }
    if (b.art === 'ueber') fill = '#D4AF37';
    bars += `<rect x="${x + 2}" y="40" width="${Math.max(0, bw - 4)}" height="86" rx="10" fill="${fill}"/>${extra}`;
  }
  let ticks = '';
  for (let h = s; h <= en; h++) {
    const x = (h - s) / span * w;
    ticks += `<line x1="${x}" y1="140" x2="${x}" y2="${h % 2 ? 150 : 158}" stroke="currentColor" stroke-width="2" opacity=".45"/>`;
    if ((h - s) % 2 === 0) ticks += `<text x="${x}" y="192" font-family="JB" font-size="22" fill="currentColor" opacity=".6" text-anchor="${h === s ? 'start' : h === en ? 'end' : 'middle'}">${String(h).padStart(2, '0')}:00</text>`;
  }
  const hatchCol = theme === 'dark' ? '#8A877F' : '#9A978F';
  return `<div class="el">${e.titel ? `<div class="label" style="margin-bottom:6px">${e.titel}</div>` : ''}<svg width="${w}" height="200" style="overflow:visible"><defs><pattern id="hatch" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="14" height="14" fill="none"/><line x1="0" y1="0" x2="0" y2="14" stroke="${hatchCol}" stroke-width="5"/></pattern></defs><rect x="0" y="40" width="${w}" height="86" rx="12" fill="none" stroke="currentColor" stroke-opacity=".18" stroke-width="2"/>${bars}${ticks}</svg></div>`;
};

// Zifferblatt: {type:'zifferblatt', wert:'8:42', titel:'HEUTE ERFASST', anteil:0.72}
Z.zifferblatt = (e, theme, p = 1, size = e.groesse || 520) => {
  const c = size / 2, r1 = c - 10, ease = Z.ease(p);
  let t = '';
  for (let i = 0; i < 60; i++) {
    const a = i * 6 * Math.PI / 180, big = i % 5 === 0, r2 = big ? r1 - 34 : r1 - 20;
    t += `<line x1="${c + r1 * Math.sin(a)}" y1="${c - r1 * Math.cos(a)}" x2="${c + r2 * Math.sin(a)}" y2="${c - r2 * Math.cos(a)}" stroke="currentColor" stroke-width="${big ? 6 : 3}" opacity="${big ? .8 : .35}"/>`;
  }
  const ra = r1 - 60, circ = 2 * Math.PI * ra, frac = (e.anteil ?? .7) * ease;
  const wert = e.zaehlen ? Z.zaehle(e.wert, ease) : e.wert;
  return `<div class="el" style="width:${size}px;height:${size}px"><svg width="${size}" height="${size}">${t}<circle cx="${c}" cy="${c}" r="${ra}" fill="none" stroke="currentColor" stroke-opacity=".1" stroke-width="22"/><circle cx="${c}" cy="${c}" r="${ra}" fill="none" stroke="#D4AF37" stroke-width="22" stroke-linecap="round" stroke-dasharray="${circ * frac} ${circ}" transform="rotate(-90 ${c} ${c})"/></svg><div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center"><div class="label" style="font-size:22px;margin-bottom:6px">${e.titel || 'HEUTE ERFASST'}</div><div class="hook" style="font-size:${size * .27}px">${wert}</div></div></div>`;
};

// Zahl zählt hoch: "48" -> 0..48, "8:42" -> 0:00..8:42, "3,90 €" bleibt Text
Z.zaehle = (s, p) => {
  const m = String(s).match(/^(\d+):(\d{2})$/);
  if (m) { const tot = Math.round((+m[1] * 60 + +m[2]) * p); return `${Math.floor(tot / 60)}:${String(tot % 60).padStart(2, '0')}`; }
  const n = String(s).match(/^(\d+)(.*)$/);
  if (n) return Math.round(+n[1] * p) + n[2];
  return s;
};

// Große Zahl: {type:'zahl', wert:'48', einheit:'STUNDEN / WOCHE'}
Z.zahl = (e, theme, p = 1) => `<div class="el"><div class="hook acc" style="font-size:${e.groesse || 360}px;line-height:.82">${Z.zaehle(e.wert, Z.ease(p))}</div>${e.einheit ? `<div class="label" style="margin-top:18px;font-size:28px">${e.einheit}</div>` : ''}</div>`;

// Wochenbalken: {type:'wochenbalken', werte:[8,9,8.5,10,7,0,0], grenze:8, einheit:'h'}
Z.wochenbalken = (e, theme, p = 1, w = 904, h = 360) => {
  const tage = e.tage || ['MO', 'DI', 'MI', 'DO', 'FR', 'SA', 'SO'], v = e.werte, max = e.max || Math.max(...v, e.grenze || 0) * 1.15;
  const bw = w / v.length, base = h - 50, ease = Z.ease(p); let s = '';
  v.forEach((x, i) => {
    const bh = (x / max) * (base - 20) * Z.ease(p * 1.4 - i * .06), over = e.grenze && x > e.grenze;
    const col = over ? '#D4AF37' : (theme === 'dark' ? '#F4F3F0' : '#121212');
    s += `<rect x="${i * bw + 14}" y="${base - bh}" width="${bw - 28}" height="${Math.max(0, bh)}" rx="8" fill="${col}"/>`;
    s += `<text x="${i * bw + bw / 2}" y="${h - 12}" text-anchor="middle" font-family="JB" font-size="22" fill="currentColor" opacity=".6">${tage[i]}</text>`;
    if (x && ease > .9) s += `<text x="${i * bw + bw / 2}" y="${base - bh - 14}" text-anchor="middle" font-family="JB" font-size="22" fill="currentColor">${String(x).replace('.', ',')}${e.einheit || ''}</text>`;
  });
  if (e.grenze) { const gy = base - (e.grenze / max) * (base - 20); s += `<line x1="0" x2="${w}" y1="${gy}" y2="${gy}" stroke="#D4AF37" stroke-width="3" stroke-dasharray="10 8" opacity="${ease}"/><text x="${w}" y="${gy - 12}" text-anchor="end" font-family="JB" font-size="20" fill="#D4AF37" opacity="${ease}">GRENZE ${e.grenze}${e.einheit || ''}</text>`; }
  return `<div class="el"><svg width="${w}" height="${h}" style="overflow:visible">${s}</svg></div>`;
};

// Chips: {type:'chips', items:['NFC-Tag','QR-Code']}
Z.chips = (e, theme, p = 1) => `<div class="el" style="max-width:904px">${e.items.map((c, i) => { const q = Z.ease(p * e.items.length * .7 - i * .6); return `<span class="chip" style="opacity:${q};transform:translateY(${(1 - q) * 30}px)"><i></i>${c}</span>`; }).join('')}</div>`;

// Checkliste: {type:'checkliste', items:['…']}
Z.checkliste = (e, theme, p = 1) => `<div class="el" style="max-width:904px">${e.items.map((c, i) => { const q = Z.ease(p * e.items.length * .7 - i * .6); return `<div class="check" style="opacity:${q}"><span class="box">${q > .8 ? '✓' : ''}</span><span>${c}</span></div>`; }).join('')}</div>`;

// Mythos vs. Fakt: {type:'mythos', mythos:'…', fakt:'…'}
Z.mythos = (e, theme, p = 1) => { const q = Z.ease(p * 1.6), r = Z.ease(p * 1.6 - .6); return `<div class="el" style="width:904px"><div class="mythos falsch" style="opacity:${q}"><span class="label">MYTHOS</span><div class="t">${e.mythos}</div></div><div class="mythos" style="opacity:${r};border:3px solid #D4AF37"><span class="label">FAKT</span><div class="t">${e.fakt}</div></div></div>`; };

// Chat/POV-Sprechblasen: {type:'pov', zeilen:[{wer:'chef'|'team', text:'…'}]}
Z.pov = (e, theme, p = 1) => `<div class="el" style="width:904px">${e.zeilen.map((z, i) => { const q = Z.ease(p * e.zeilen.length * .8 - i * .7), me = z.wer === 'chef'; const bg = me ? '#D4AF37' : (theme === 'dark' ? '#242424' : '#fff'); const fg = me ? '#121212' : 'inherit'; return `<div style="display:flex;justify-content:${me ? 'flex-end' : 'flex-start'};margin-bottom:20px;opacity:${q};transform:translateY(${(1 - q) * 24}px)"><div style="max-width:700px;background:${bg};color:${fg};padding:24px 30px;border-radius:28px;${me ? 'border-bottom-right-radius:8px' : 'border-bottom-left-radius:8px'};font-size:32px;line-height:1.3;${me ? '' : 'border:2px solid ' + (theme === 'dark' ? '#333' : '#E2E0DA')}"><div class="label" style="font-size:18px;margin-bottom:6px;${me ? 'color:#121212;opacity:.7' : ''}">${z.name || (me ? 'CHEF' : 'TEAM')}</div>${z.text}</div></div>`; }).join('')}</div>`;

Z.element = (e, theme, p = 1) => e && Z[e.type] ? Z[e.type](e, theme, p) : '';
