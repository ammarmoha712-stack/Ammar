/* ABDULRAHIM AL FARSI LAW OFFICE — "One Legal File, Eight Pathways"
   Deterministic frame renderer: render(t) draws the frame at time t (seconds). */
'use strict';
const W = 1080, H = 1920;
const C = {
  navy: '#0A1C30', navy2: '#112C4A', navy3: '#1A3B60', gold: '#C9A45C', goldL: '#EBD49B', goldD: '#97753A',
  ivory: '#F6F0E3', beige: '#E6D8BC', char: '#2A2D33', skin: '#C98F65', skinS: '#A86F48', hair: '#2A1F1A',
  thobe: '#F8F6F1', thobeLine: '#CDC5B6', ink: '#33405A'
};
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, p) => a + (b - a) * p;
const prog = (t, a, b) => clamp((t - a) / (b - a));
const eo = p => 1 - Math.pow(1 - p, 3);
const eio = p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
const eback = p => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); };
const f = n => (Math.round(n * 10) / 10);
function rng(seed) { let s = (seed * 2654435761) >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
let UID = 0; const uid = p => p + (UID++);
const fade = (t, a, b, c, d) => Math.min(prog(t, a, b), 1 - prog(t, c, d)); // in a->b, out c->d

/* ---------- DEFS ---------- */
const DEFS = `<defs>
<radialGradient id="bgG" cx="50%" cy="42%" r="78%"><stop offset="0" stop-color="#17395F"/><stop offset=".55" stop-color="#0C2039"/><stop offset="1" stop-color="#040C17"/></radialGradient>
<linearGradient id="goldG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F3DFA8"/><stop offset=".5" stop-color="#C9A45C"/><stop offset="1" stop-color="#9A773C"/></linearGradient>
<linearGradient id="goldV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6E3AE"/><stop offset="1" stop-color="#B38D4A"/></linearGradient>
<linearGradient id="goldH" x1="0" x2="1"><stop offset="0" stop-color="#C9A45C" stop-opacity="0"/><stop offset=".5" stop-color="#F3DFA8"/><stop offset="1" stop-color="#C9A45C" stop-opacity="0"/></linearGradient>
<radialGradient id="glowG"><stop offset="0" stop-color="#FFEBB5" stop-opacity="1"/><stop offset=".3" stop-color="#E7C47A" stop-opacity=".55"/><stop offset="1" stop-color="#C9A45C" stop-opacity="0"/></radialGradient>
<radialGradient id="softGlow"><stop offset="0" stop-color="#E7C47A" stop-opacity=".35"/><stop offset="1" stop-color="#C9A45C" stop-opacity="0"/></radialGradient>
<linearGradient id="cardG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1B4069"/><stop offset="1" stop-color="#0B1F36"/></linearGradient>
<linearGradient id="folderG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#21497A"/><stop offset="1" stop-color="#0E2540"/></linearGradient>
<linearGradient id="thobeG" x1="0" x2="1"><stop offset="0" stop-color="#E4DED2"/><stop offset=".3" stop-color="#FCFBF8"/><stop offset=".7" stop-color="#F5F2EB"/><stop offset="1" stop-color="#D8D0C2"/></linearGradient>
<linearGradient id="armG" x1="0" x2="1"><stop offset="0" stop-color="#EEEAE2"/><stop offset="1" stop-color="#FBFAF6"/></linearGradient>
<linearGradient id="wallG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14304F"/><stop offset="1" stop-color="#0B1D33"/></linearGradient>
<linearGradient id="tableG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4A3424"/><stop offset=".08" stop-color="#3A281B"/><stop offset="1" stop-color="#1E140D"/></linearGradient>
<linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0E2846"/><stop offset="1" stop-color="#2B4E78"/></linearGradient>
<linearGradient id="paperG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFDF7"/><stop offset="1" stop-color="#EFE6D3"/></linearGradient>
<linearGradient id="chairG" x1="0" x2="1"><stop offset="0" stop-color="#0D2036"/><stop offset=".5" stop-color="#1A3655"/><stop offset="1" stop-color="#0D2036"/></linearGradient>
<pattern id="shem" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="16" height="16" fill="#FCFAF6"/><rect width="16" height="4" fill="#C21F2E"/><rect width="4" height="16" fill="#C21F2E"/><rect x="9" y="9" width="3" height="3" fill="#C21F2E"/></pattern>
<pattern id="grid" width="90" height="90" patternUnits="userSpaceOnUse"><path d="M90 0H0V90" fill="none" stroke="#C9A45C" stroke-opacity=".07" stroke-width="1.5"/></pattern>
<filter id="blur6" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
<filter id="blur18" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="18"/></filter>
<filter id="shadow" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#000" flood-opacity=".5"/></filter>
<filter id="tshadow" x="-10%" y="-40%" width="120%" height="200%"><feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity=".55"/></filter>
<radialGradient id="vig" cx="50%" cy="50%" r="75%"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient>
</defs>`;

/* ---------- PRIMITIVES ---------- */
function bg(t, o = {}) {
  let g = `<rect width="${W}" height="${H}" fill="url(#bgG)"/>`;
  g += `<g transform="translate(${f(-(t * 6) % 90)},${f(-(t * 4) % 90)})"><rect x="-90" y="-90" width="${W + 180}" height="${H + 180}" fill="url(#grid)"/></g>`;
  // diagonal geometric accents
  g += `<g stroke="#C9A45C" stroke-opacity=".08" stroke-width="2" fill="none"><circle cx="540" cy="900" r="${f(620 + Math.sin(t * .4) * 10)}"/><circle cx="540" cy="900" r="${f(760 + Math.sin(t * .3) * 14)}"/></g>`;
  if (o.particles !== false) g += particles(t, o.pseed || 1, o.pcount || 34);
  return g;
}
function particles(t, seed, n) {
  const r = rng(seed); let g = '<g>';
  for (let i = 0; i < n; i++) {
    const x = r() * W, y0 = r() * H, sp = 12 + r() * 30, sz = 1.5 + r() * 3.5, ph = r() * 6.28;
    const y = ((y0 - t * sp) % H + H) % H; const a = .15 + .45 * (0.5 + 0.5 * Math.sin(t * 1.3 + ph));
    g += `<circle cx="${f(x + Math.sin(t * .5 + ph) * 14)}" cy="${f(y)}" r="${f(sz)}" fill="#EBD49B" opacity="${f(a * 100) / 100}"/>`;
  }
  return g + '</g>';
}
function vignette() { return `<rect width="${W}" height="${H}" fill="url(#vig)"/>`; }

// Arabic / Latin text with RTL wipe-in reveal
function txt(s, x, y, o = {}) {
  const size = o.size || 60, wt = o.weight || 700, fill = o.fill || C.ivory, anchor = o.anchor || 'middle';
  const p = o.p === undefined ? 1 : o.p; const out = o.out || 0;
  if (p <= 0 || out >= 1) return '';
  const est = (o.w || s.length * size * .58) + 80;
  const x0 = anchor === 'middle' ? x - est / 2 : anchor === 'end' ? x - est : x;
  const id = uid('cl'); const pe = eo(p); const dir = o.ltr ? 1 : -1;
  const wipeW = est * pe;
  const rx = dir < 0 ? x0 + est - wipeW : x0;
  const op = (1 - out) * clamp(p * 1.6);
  const dy = (1 - pe) * 26 - out * 20;
  const fam = o.font === 'plex' ? "Plex, Alex" : "Alex, Plex";
  return `<clipPath id="${id}"><rect x="${f(rx - 30)}" y="${f(y - size * 1.6)}" width="${f(wipeW + 60)}" height="${f(size * 2.6)}"/></clipPath>` +
    `<g clip-path="url(#${id})" opacity="${f(op * 100) / 100}"><text x="${x}" y="${f(y + dy)}" font-family="${fam}" font-size="${size}" font-weight="${wt}" fill="${fill}" text-anchor="${anchor}" ${o.ltr ? 'direction="ltr"' : 'direction="rtl"'} ${o.filter === false ? '' : 'filter="url(#tshadow)"'} ${o.extra || ''}>${s}</text></g>`;
}
// headline with gold underline ornament
function ornament(cx, y, w, p) {
  if (p <= 0) return ''; const ww = w * eo(p);
  return `<g opacity="${f(p * 100) / 100}"><line x1="${f(cx - ww / 2)}" y1="${y}" x2="${f(cx + ww / 2)}" y2="${y}" stroke="url(#goldH)" stroke-width="3"/><rect x="${cx - 7}" y="${y - 7}" width="14" height="14" transform="rotate(45 ${cx} ${y})" fill="${C.gold}"/></g>`;
}
function glow(x, y, r, a = 1) { return a <= 0 ? '' : `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="url(#glowG)" opacity="${f(a * 100) / 100}"/>`; }
function cubicPt(p0, p1, p2, p3, t) {
  const u = 1 - t; return [u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0], u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]];
}
function goldPath(d, p, o = {}) {
  if (p <= 0) return ''; const w = o.w || 4;
  return `<path d="${d}" pathLength="1" fill="none" stroke="${o.color || 'url(#goldG)'}" stroke-width="${w}" stroke-linecap="round" stroke-dasharray="1 2" stroke-dashoffset="${f((1 - clamp(p)) * 1000) / 1000}" opacity="${o.op === undefined ? 1 : o.op}"/>` +
    (o.glow ? `<path d="${d}" pathLength="1" fill="none" stroke="#F3DFA8" stroke-width="${w * 3.5}" stroke-linecap="round" stroke-dasharray="1 2" stroke-dashoffset="${f((1 - clamp(p)) * 1000) / 1000}" opacity=".25" filter="url(#blur6)"/>` : '');
}
function cubicD(p0, p1, p2, p3) { return `M${f(p0[0])},${f(p0[1])} C${f(p1[0])},${f(p1[1])} ${f(p2[0])},${f(p2[1])} ${f(p3[0])},${f(p3[1])}`; }

/* ---------- SYMBOLS ---------- */
function scalesIcon(cx, cy, s, col = C.gold, sw = 4) {
  return `<g transform="translate(${f(cx)},${f(cy)}) scale(${s})" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">
  <line x1="0" y1="-34" x2="0" y2="30"/><line x1="-32" y1="-24" x2="32" y2="-24"/><circle cx="0" cy="-38" r="4" fill="${col}"/>
  <path d="M-32,-24 L-44,2 M-32,-24 L-20,2"/><path d="M-48,2 Q-32,16 -16,2 Z" fill="${col}" fill-opacity=".35"/>
  <path d="M32,-24 L20,2 M32,-24 L44,2"/><path d="M16,2 Q32,16 48,2 Z" fill="${col}" fill-opacity=".35"/>
  <path d="M-16,32 L16,32"/></g>`;
}
function paper(x, y, w, h, o = {}) {
  const lines = o.lines === undefined ? 5 : o.lines; const lp = o.lp === undefined ? 1 : o.lp;
  let g = `<g transform="translate(${f(x)},${f(y)}) rotate(${f(o.rot || 0)})" opacity="${o.op === undefined ? 1 : f(o.op * 100) / 100}">`;
  g += `<rect x="${f(-w / 2)}" y="${f(-h / 2)}" width="${f(w)}" height="${f(h)}" rx="${f(w * .05)}" fill="url(#paperG)" stroke="#D3C6A8" stroke-width="2"/>`;
  if (o.title !== false) g += `<rect x="${f(-w * .32)}" y="${f(-h / 2 + h * .1)}" width="${f(w * .64)}" height="${f(Math.max(3, h * .05))}" rx="2" fill="${C.gold}"/>`;
  for (let i = 0; i < lines; i++) {
    const lpp = clamp(lp * lines - i); if (lpp <= 0) continue;
    const ly = -h / 2 + h * .26 + i * (h * .62 / lines); const lw = w * (i % 3 === 2 ? .5 : .74) * lpp;
    g += `<rect x="${f(w * .37 - lw)}" y="${f(ly)}" width="${f(lw)}" height="${f(Math.max(2, h * .028))}" rx="1" fill="#9AA3B5"/>`;
  }
  if (o.hl) g += `<rect x="${f(w * .37 - w * .74 * o.hl)}" y="${f(-h / 2 + h * .26 + (o.hlRow || 1) * (h * .62 / lines) - h * .025)}" width="${f(w * .74 * o.hl)}" height="${f(h * .08)}" fill="#E7C47A" opacity=".55"/>`;
  return g + '</g>';
}
function folder(cx, cy, w, h, open = 0, o = {}) {
  const x0 = cx - w / 2, y0 = cy - h / 2; const bw = Math.max(2, w * .012);
  let g = `<g ${o.filter === false ? '' : 'filter="url(#shadow)"'}>`;
  g += `<path d="M${f(x0 + w * .06)},${f(y0)} h${f(w * .3)} l${f(w * .05)},${f(-h * .07)} h${f(w * .2)} l${f(w * .03)},${f(h * .07)}" fill="#0E2540" stroke="${C.gold}" stroke-width="${bw}"/>`;
  g += `<rect x="${f(x0)}" y="${f(y0)}" width="${f(w)}" height="${f(h)}" rx="${f(w * .035)}" fill="#0E2540" stroke="${C.gold}" stroke-width="${bw}"/>`;
  if (open > 0.02) {
    const pw = w * .9, ph = h * .9;
    for (let i = 0; i < 3; i++) g += paper(cx + (2 - i) * w * .01 + (o.pageDx || 0) * i, cy + (2 - i) * h * .008 - (o.pageLift || 0) * i, pw, ph, { lines: 6, op: clamp(open * 3), hl: i === 2 ? o.hl : 0, hlRow: 2, lp: i === 2 ? (o.lp === undefined ? 1 : o.lp) : 1, title: i === 2 });
  }
  const sx = Math.cos(clamp(open) * Math.PI);
  const isFront = sx >= 0;
  g += `<g transform="translate(${f(x0)},0) scale(${f(sx * 1000) / 1000 || 0.001},1) translate(${f(-x0)},0)">`;
  g += `<rect x="${f(x0)}" y="${f(y0)}" width="${f(w)}" height="${f(h)}" rx="${f(w * .035)}" fill="${isFront ? 'url(#folderG)' : '#173A60'}" stroke="${C.gold}" stroke-width="${bw}"/>`;
  if (isFront) {
    g += `<rect x="${f(x0 + w * .06)}" y="${f(y0 + h * .07)}" width="${f(w * .88)}" height="${f(h * .86)}" rx="${f(w * .02)}" fill="none" stroke="${C.gold}" stroke-opacity=".55" stroke-width="${f(bw * .6)}"/>`;
    g += scalesIcon(cx, cy - h * .05, w / 260, C.gold, 4);
    g += `<rect x="${f(cx - w * .2)}" y="${f(cy + h * .28)}" width="${f(w * .4)}" height="${f(Math.max(2, h * .025))}" fill="${C.gold}" opacity=".7"/>`;
  } else {
    g += `<rect x="${f(x0 + w * .08)}" y="${f(y0 + h * .1)}" width="${f(w * .84)}" height="${f(h * .8)}" fill="none" stroke="${C.gold}" stroke-opacity=".3"/>`;
  }
  g += '</g></g>';
  return g;
}
function tablet(cx, cy, w, h, rot = 0, screen = '') {
  return `<g transform="translate(${f(cx)},${f(cy)}) rotate(${f(rot)})"><rect x="${f(-w / 2)}" y="${f(-h / 2)}" width="${f(w)}" height="${f(h)}" rx="${f(w * .09)}" fill="#1C222C" stroke="#56606F" stroke-width="2"/><rect x="${f(-w / 2 + w * .07)}" y="${f(-h / 2 + w * .07)}" width="${f(w * .86)}" height="${f(h - w * .14)}" rx="${f(w * .04)}" fill="#0F2C4B"/>${screen}</g>`;
}
function tabletScreen(w, h, t) { // option list on tablet
  let g = ''; const n = 3;
  for (let i = 0; i < n; i++) {
    const yy = -h * .3 + i * h * .26; const a = clamp(t * 2 - i * .6);
    g += `<g opacity="${f(.25 + .75 * a)}"><circle cx="${f(w * .28)}" cy="${f(yy)}" r="${f(w * .07)}" fill="${a >= 1 ? C.gold : 'none'}" stroke="${C.gold}" stroke-width="2"/><rect x="${f(-w * .34)}" y="${f(yy - h * .03)}" width="${f(w * .5)}" height="${f(h * .06)}" rx="2" fill="#9FB3CC"/></g>`;
  }
  return g;
}
function questionMark(x, y, s, a, rot = 0) {
  if (a <= 0) return '';
  return `<g transform="translate(${f(x)},${f(y)}) rotate(${f(rot)}) scale(${f(s)})" opacity="${f(a * 100) / 100}"><circle r="46" fill="#C9A45C" fill-opacity=".12" stroke="#C9A45C" stroke-opacity=".6" stroke-width="2"/><text y="22" font-size="64" font-weight="700" fill="${C.goldL}" text-anchor="middle" font-family="Alex">؟</text></g>`;
}

/* ---------- CHARACTERS ---------- */
function ik(S, Hd, side) {
  const L1 = 175, L2 = 170; const dx = Hd[0] - S[0], dy = Hd[1] - S[1];
  let d = Math.hypot(dx, dy); d = clamp(d, 40, L1 + L2 - 2);
  const a = Math.atan2(dy, dx); const A = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1));
  const ang = a - side * A;
  return { E: [S[0] + Math.cos(ang) * L1, S[1] + Math.sin(ang) * L1], H: [S[0] + Math.cos(a) * d, S[1] + Math.sin(a) * d] };
}
function armSvg(S, Hd, side) {
  const { E, H: Hn } = ik(S, Hd, side);
  const d = `M${f(S[0])},${f(S[1])} L${f(E[0])},${f(E[1])} L${f(Hn[0])},${f(Hn[1])}`;
  return `<path d="${d}" fill="none" stroke="${C.thobeLine}" stroke-width="66" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="${d}" fill="none" stroke="#F7F5EF" stroke-width="58" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="M${f(S[0] + side * 12)},${f(S[1] + 10)} L${f(E[0] + side * 12)},${f(E[1])}" stroke="#E2DCD0" stroke-width="10" stroke-linecap="round" opacity=".7"/>` +
    `<circle cx="${f(Hn[0])}" cy="${f(Hn[1])}" r="25" fill="${C.skin}" stroke="${C.skinS}" stroke-width="3"/>`;
}
function person(o) {
  const L = o.role === 'lawyer'; const s = o.s || 1; const tr = o.turn || 0; const fx = tr * 22;
  const expr = o.expr || 'neutral'; const bob = o.bob || 0;
  const hx = fx * .5, hy = -772 + bob;
  let g = `<g transform="translate(${f(o.x)},${f(o.y)}) scale(${f(s * 1000) / 1000})">`;
  if (o.shadow !== false) g += `<ellipse cx="0" cy="2" rx="200" ry="28" fill="#000" opacity=".3"/>`;
  // back drape of shemagh
  g += `<path d="M${f(hx - 112)},${f(hy - 50)} Q${f(hx)},${f(hy - 140)} ${f(hx + 112)},${f(hy - 50)} L${f(178)},${-548 + bob} Q0,${-505 + bob} -178,${-548 + bob} Z" fill="url(#shem)" stroke="#B9B1A3" stroke-width="3"/>`;
  // thobe body
  g += `<path d="M-128,${-636 + bob} Q-150,${-622 + bob} -150,${-590 + bob} L-172,-62 Q-174,-30 -146,-28 L146,-28 Q174,-30 172,-62 L150,${-590 + bob} Q150,${-622 + bob} 128,${-636 + bob} Q0,${-664 + bob} -128,${-636 + bob} Z" fill="url(#thobeG)" stroke="${C.thobeLine}" stroke-width="3"/>`;
  g += `<path d="M-60,-40 Q-70,-250 -82,-480 M70,-40 Q78,-260 88,-470" stroke="#E2DCCF" stroke-width="5" fill="none" opacity=".8"/>`;
  // placket & collar
  g += `<path d="M${f(fx * .3)},${-640 + bob} L${f(fx * .3)},${-430 + bob}" stroke="#D5CDBE" stroke-width="5"/>`;
  for (let i = 0; i < 3; i++) g += `<circle cx="${f(fx * .3)}" cy="${f(-610 + bob + i * 55)}" r="5" fill="${L ? C.gold : '#D6CEBF'}"/>`;
  // feet
  g += `<path d="M-110,-30 q-6,-14 14,-16 h70 q16,2 10,16 z" fill="#3B2A1F"/><path d="M110,-30 q6,-14 -14,-16 h-70 q-16,2 -10,16 z" fill="#3B2A1F"/>`;
  // neck
  g += `<rect x="${f(hx - 30)}" y="${f(hy + 50)}" width="60" height="50" fill="${C.skinS}"/>`;
  // shemagh hood (front, around face)
  g += `<path d="M${f(hx - 96)},${f(hy - 40)} Q${f(hx - 108)},${f(hy + 50)} ${f(-150)},${-600 + bob} L${f(-120)},${-470 + bob} Q${f(-90)},${-520 + bob} ${f(hx - 66)},${f(hy + 70)} Q${f(hx)},${f(hy + 96)} ${f(hx + 66)},${f(hy + 70)} Q${f(L ? 90 : 96)},${-540 + bob} ${f(L ? 120 : 150)},${-470 + bob} L${f(150)},${-600 + bob} Q${f(hx + 108)},${f(hy + 50)} ${f(hx + 96)},${f(hy - 40)} Q${f(hx)},${f(hy - 128)} ${f(hx - 96)},${f(hy - 40)} Z" fill="url(#shem)" stroke="#B9B1A3" stroke-width="3"/>`;
  // face
  g += `<ellipse cx="${f(hx)}" cy="${f(hy + 4)}" rx="60" ry="76" fill="${C.skin}"/>`;
  g += `<path d="M${f(hx + 40 + fx * .3)},${f(hy - 40)} Q${f(hx + 64)},${f(hy + 10)} ${f(hx + 30)},${f(hy + 72)}" fill="none" stroke="${C.skinS}" stroke-width="10" opacity=".35"/>`;
  const ex = hx + fx * .6;
  if (o.back) { /* back view: cover face */ g += `<ellipse cx="${f(hx)}" cy="${f(hy)}" rx="70" ry="86" fill="url(#shem)" stroke="#B9B1A3" stroke-width="3"/>`; }
  else {
    // eyebrows
    const br = { worried: [-8, 6], neutral: [0, 0], interested: [-7, -7], smile: [-3, -3], confident: [3, -2] }[expr] || [0, 0];
    g += `<path d="M${f(ex - 42)},${f(hy - 22 + br[1])} Q${f(ex - 28)},${f(hy - 32 + br[1])} ${f(ex - 12)},${f(hy - 24 + br[0])}" stroke="${C.hair}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
    g += `<path d="M${f(ex + 42)},${f(hy - 22 + br[1])} Q${f(ex + 28)},${f(hy - 32 + br[1])} ${f(ex + 12)},${f(hy - 24 + br[0])}" stroke="${C.hair}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
    // eyes
    const eyH = o.blink ? 1.5 : 9; const look = (o.look || 0) * 5;
    for (const sx of [-1, 1]) {
      g += `<ellipse cx="${f(ex + sx * 26)}" cy="${f(hy - 4)}" rx="10" ry="${f(eyH + 1)}" fill="#fff" opacity="${o.blink ? 0 : .9}"/>`;
      g += `<ellipse cx="${f(ex + sx * 26 + look)}" cy="${f(hy - 3)}" rx="6.5" ry="${eyH * .8}" fill="#1D1510"/>`;
    }
    if (L) { // glasses
      g += `<g fill="none" stroke="#B8955A" stroke-width="3.5"><rect x="${f(ex - 46)}" y="${f(hy - 18)}" width="38" height="28" rx="9"/><rect x="${f(ex + 8)}" y="${f(hy - 18)}" width="38" height="28" rx="9"/><path d="M${f(ex - 8)},${f(hy - 6)} Q${f(ex)},${f(hy - 11)} ${f(ex + 8)},${f(hy - 6)}"/></g>`;
    }
    // nose
    g += `<path d="M${f(ex + 2)},${f(hy - 2)} q-9,24 -3,32 q7,4 13,0" fill="none" stroke="${C.skinS}" stroke-width="4.5" stroke-linecap="round"/>`;
    // beard & moustache
    if (L) g += `<path d="M${f(hx - 60)},${f(hy - 4)} Q${f(hx - 62)},${f(hy + 74)} ${f(hx)},${f(hy + 88)} Q${f(hx + 62)},${f(hy + 74)} ${f(hx + 60)},${f(hy - 4)} Q${f(hx + 52)},${f(hy + 46)} ${f(ex + 24)},${f(hy + 52)} Q${f(ex)},${f(hy + 44)} ${f(ex - 24)},${f(hy + 52)} Q${f(hx - 52)},${f(hy + 46)} ${f(hx - 60)},${f(hy - 4)} Z" fill="${C.hair}"/>`;
    else g += `<path d="M${f(ex - 30)},${f(hy + 54)} Q${f(ex)},${f(hy + 92)} ${f(ex + 30)},${f(hy + 54)} Q${f(ex + 18)},${f(hy + 66)} ${f(ex)},${f(hy + 64)} Q${f(ex - 18)},${f(hy + 66)} ${f(ex - 30)},${f(hy + 54)} Z" fill="#3A2C24"/><path d="M${f(hx - 58)},${f(hy + 10)} Q${f(hx - 52)},${f(hy + 60)} ${f(ex - 26)},${f(hy + 62)}" stroke="#3A2C24" stroke-width="5" fill="none" opacity=".55"/><path d="M${f(hx + 58)},${f(hy + 10)} Q${f(hx + 52)},${f(hy + 60)} ${f(ex + 26)},${f(hy + 62)}" stroke="#3A2C24" stroke-width="5" fill="none" opacity=".55"/>`;
    g += `<path d="M${f(ex - 28)},${f(hy + 40)} Q${f(ex)},${f(hy + 26)} ${f(ex + 28)},${f(hy + 40)} Q${f(ex)},${f(hy + 34)} ${f(ex - 28)},${f(hy + 40)} Z" fill="${C.hair}" stroke="${C.hair}" stroke-width="6" stroke-linejoin="round"/>`;
    // mouth
    const my = hy + 50; const mo = o.mouth || 0;
    if (mo > 0.05) g += `<ellipse cx="${f(ex)}" cy="${f(my + 2)}" rx="11" ry="${f(2 + mo * 7)}" fill="#5A2A22"/>`;
    else {
      const c = { worried: -6, neutral: 1, interested: 3, smile: 8, confident: 6 }[expr] || 0;
      g += `<path d="M${f(ex - 15)},${f(my)} Q${f(ex)},${f(my + c)} ${f(ex + 15)},${f(my)}" stroke="#6B352A" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
    }
  }
  // shemagh top cap & agal
  g += `<path d="M${f(hx - 72)},${f(hy - 30)} Q${f(hx)},${f(hy - 72)} ${f(hx + 72)},${f(hy - 30)} L${f(hx + 66)},${f(hy - 62)} Q${f(hx)},${f(hy - 120)} ${f(hx - 66)},${f(hy - 62)} Z" fill="url(#shem)"/>`;
  g += `<path d="M${f(hx - 74)},${f(hy - 32)} Q${f(hx)},${f(hy - 66)} ${f(hx + 74)},${f(hy - 32)}" fill="none" stroke="#C5BCAD" stroke-width="3"/>`;
  g += `<ellipse cx="${f(hx)}" cy="${f(hy - 74)}" rx="84" ry="19" fill="none" stroke="#141414" stroke-width="11"/>`;
  g += `<ellipse cx="${f(hx)}" cy="${f(hy - 58)}" rx="86" ry="19" fill="none" stroke="#141414" stroke-width="11"/>`;
  // item & arms
  const SL = [-122, -600 + bob], SR = [122, -600 + bob];
  const lh = o.lh || [-150, -320], rh = o.rh || [150, -320];
  if (o.itemBehind) g += o.itemBehind;
  g += armSvg(SL, lh, -1);
  if (o.item) g += o.item;
  g += armSvg(SR, rh, 1);
  if (o.itemFront) g += o.itemFront;
  return g + '</g>';
}
// mini bust used inside service icons
function miniBust(x, y, s, lawyer, face = 0) {
  return `<g transform="translate(${f(x)},${f(y)}) scale(${s})">
  <path d="M-50,60 Q-50,10 0,6 Q50,10 50,60 Z" fill="#F4F1EA"/>
  <path d="M-34,-6 Q-38,30 -50,46 L-30,50 Q-24,20 -20,10 L20,10 Q24,20 30,50 L50,46 Q38,30 34,-6 Q0,-56 -34,-6Z" fill="url(#shem)"/>
  <ellipse cx="${face}" cy="-2" rx="21" ry="26" fill="${C.skin}"/>
  ${lawyer ? `<path d="M${face - 21},0 Q${face - 20},26 ${face},30 Q${face + 20},26 ${face + 21},0 Q${face},16 ${face - 21},0Z" fill="${C.hair}"/><g fill="none" stroke="#B8955A" stroke-width="2"><rect x="${face - 16}" y="-12" width="13" height="10" rx="3"/><rect x="${face + 3}" y="-12" width="13" height="10" rx="3"/></g>` : `<path d="M${face - 9},20 Q${face},30 ${face + 9},20Z" fill="#3A2C24"/>`}
  <circle cx="${face - 8}" cy="-6" r="2.6" fill="#1D1510"/><circle cx="${face + 8}" cy="-6" r="2.6" fill="#1D1510"/>
  <path d="M-26,-14 Q0,-30 26,-14 L24,-24 Q0,-44 -24,-24Z" fill="url(#shem)"/>
  <ellipse cx="0" cy="-30" rx="30" ry="7" fill="none" stroke="#141414" stroke-width="4.5"/></g>`;
}

/* ---------- SERVICE ICONS (local coords, ~ 300 x 280 box) ---------- */
const ICONS = [
  // 01 commercial
  (t) => {
    let g = '';
    g += `<g><rect x="-100" y="0" width="200" height="120" rx="16" fill="#1E4876" stroke="${C.gold}" stroke-width="4"/><path d="M-36,0 v-18 q0,-10 10,-10 h52 q10,0 10,10 v18" fill="none" stroke="${C.gold}" stroke-width="7"/><line x1="-100" y1="46" x2="100" y2="46" stroke="${C.gold}" stroke-width="3" opacity=".7"/><rect x="-14" y="36" width="28" height="22" rx="4" fill="${C.gold}"/></g>`;
    const merge = eio(prog(t, 1.5, 2.2));
    const slots = [[-62, -78, -12], [0, -92, 0], [62, -78, 12]];
    if (merge > 0) g += `<g opacity="${f(merge)}"><path d="M-62,-150 h44 l8,-10 h30 l6,10 h36 v100 h-124z" fill="${C.gold}"/></g>`;
    slots.forEach((sl, i) => {
      const p = eback(prog(t, .15 + i * .25, .85 + i * .25)); if (p <= 0) return;
      const x = lerp(0, lerp(sl[0], 0, merge), p), y = lerp(150, lerp(sl[1], -96, merge), p);
      g += paper(x, y, 72, 92, { rot: lerp(sl[2], 0, merge), lines: 4, op: clamp(p * 2) });
    });
    // small rising bar chart on briefcase
    for (let i = 0; i < 3; i++) { const hh = 26 * (i + 1) * eo(prog(t, 2.2 + i * .15, 2.8 + i * .15)); g += `<rect x="${52 + i * 14}" y="${f(108 - hh)}" width="9" height="${f(hh)}" fill="${C.goldL}" opacity=".9"/>`; }
    return g;
  },
  // 02 administrative
  (t) => {
    let g = ''; const p = eo(prog(t, 0, .7));
    g += `<g opacity="${f(clamp(p * 2))}"><path d="M-120,-60 L0,${f(-60 - 62 * p)} L120,-60 Z" fill="${C.gold}"/><rect x="-118" y="-58" width="236" height="12" fill="#E7CF92"/>`;
    for (let i = 0; i < 5; i++) { const hh = 92 * eo(prog(t, .2 + i * .08, .7 + i * .08)); g += `<rect x="${-100 + i * 46}" y="${f(-46)}" width="20" height="${f(hh)}" fill="#F3E8CF"/>`; }
    g += `<rect x="-130" y="46" width="260" height="12" fill="${C.gold}"/><rect x="-142" y="58" width="284" height="10" fill="#B8955A"/></g>`;
    for (let i = 0; i < 3; i++) {
      const q = eo(prog(t, 1 + i * .25, 1.6 + i * .25)); if (q <= 0) continue;
      const x = lerp(220, -76 + i * 76, q);
      g += paper(x, 118, 58, 72, { lines: 3, op: q });
      const st = eback(prog(t, 2 + i * .2, 2.4 + i * .2));
      if (st > 0) g += `<g transform="translate(${-76 + i * 76 + 16},134) scale(${f(st)})"><circle r="13" fill="${C.gold}"/><path d="M-6,0 l4,5 l8,-9" stroke="#0B1F36" stroke-width="3" fill="none"/></g>`;
    }
    return g;
  },
  // 03 criminal (protective shield)
  (t) => {
    let g = ''; const sp = eo(prog(t, .6, 1.6)); const pulse = .5 + .5 * Math.sin(t * 3);
    const sh = 'M0,-130 L112,-88 Q112,46 0,132 Q-112,46 -112,-88 Z';
    if (sp > 0) g += `<path d="${sh}" fill="${C.gold}" fill-opacity="${f(.13 * sp)}"/>`;
    g += folder(0, 10, 128, 150, 0, { filter: false });
    g += goldPath(sh, sp, { w: 7, glow: true });
    if (t > 1.6) g += `<path d="${sh}" fill="none" stroke="${C.goldL}" stroke-width="2" opacity="${f(.5 * pulse * clamp(t - 1.6))}" transform="scale(${f(1.06 + .05 * pulse)})"/>`;
    return g;
  },
  // 04 civil
  (t) => {
    let g = ''; const hp = eback(prog(t, 0, .6));
    g += `<g transform="translate(0,-108) scale(${f(hp)})"><path d="M-46,0 L0,-40 L46,0" fill="none" stroke="${C.gold}" stroke-width="7" stroke-linejoin="round"/><rect x="-34" y="0" width="68" height="46" fill="#E7CF92"/><rect x="-10" y="16" width="20" height="30" fill="#0B1F36"/></g>`;
    const q = eio(prog(t, .5, 1.4)); const m = eio(prog(t, 1.8, 2.4));
    g += paper(lerp(-200, lerp(-46, 0, m), q), 46, 86, 110, { rot: lerp(-14, 0, q), lines: 4, op: clamp(q * 2) });
    g += paper(lerp(200, lerp(46, 0, m), q), 46, 86, 110, { rot: lerp(14, 0, q), lines: 4, op: clamp(q * 2) });
    const lk = prog(t, 1.3, 1.8);
    if (lk > 0 && m < 1) g += goldPath('M-30,46 Q0,20 30,46', lk, { w: 6 });
    if (m > 0) g += `<g transform="translate(26,96) scale(${f(eback(m))})"><circle r="22" fill="${C.gold}"/><circle r="15" fill="none" stroke="#0B1F36" stroke-width="2"/><path d="M-7,0 l5,6 l10,-12" stroke="#0B1F36" stroke-width="3.5" fill="none"/></g>`;
    return g;
  },
  // 05 quasi-judicial committees
  (t) => {
    let g = ''; const b = eo(prog(t, 0, .6));
    g += `<g opacity="${f(b)}"><rect x="-110" y="-136" width="220" height="118" rx="8" fill="#0F2C4B" stroke="${C.gold}" stroke-width="4"/><line x1="-60" y1="-18" x2="-80" y2="20" stroke="${C.gold}" stroke-width="5"/><line x1="60" y1="-18" x2="80" y2="20" stroke="${C.gold}" stroke-width="5"/></g>`;
    const fp = eo(prog(t, .5, 1.3));
    if (fp > 0) { g += folder(lerp(-240, -40, fp), -78, 70, 84, 0, { filter: false }); }
    const bars = prog(t, 1.2, 1.9);
    for (let i = 0; i < 3; i++) { const hh = (28 + i * 16) * eo(clamp(bars * 3 - i)); g += `<rect x="${18 + i * 22}" y="${f(-36 - hh)}" width="14" height="${f(hh)}" fill="${C.goldL}"/>`; }
    for (let i = 0; i < 5; i++) {
      const q = eback(prog(t, .9 + i * .14, 1.4 + i * .14)); if (q <= 0) continue;
      const x = -112 + i * 56; g += `<g transform="translate(${x},${f(70 - Math.abs(i - 2) * 8)}) scale(${f(q * .62)})"><circle cy="-20" r="20" fill="#F4F1EA"/><path d="M-32,30 Q-32,4 0,2 Q32,4 32,30Z" fill="#F4F1EA"/><ellipse cy="-30" rx="21" ry="5" fill="none" stroke="#141414" stroke-width="4"/></g>`;
    }
    g += `<path d="M-150,96 Q0,74 150,96 L136,120 Q0,104 -136,120Z" fill="#6B4A2E" stroke="${C.gold}" stroke-width="3"/>`;
    return g;
  },
  // 06 legal consultation
  (t) => {
    let g = ''; const p = eo(prog(t, 0, .7));
    g += `<g opacity="${f(p)}">` + miniBust(-104, 10, 1.25, true, 6) + miniBust(104, 10, 1.25, false, -6) + '</g>';
    const tp = eback(prog(t, .5, 1.1));
    if (tp > 0) g += `<g transform="translate(0,-20) scale(${f(tp)})">` + tablet(0, 0, 96, 130, 0, tabletScreen(96, 130, Math.max(0, t - 1.1))) + '</g>';
    g += `<rect x="-160" y="92" width="320" height="16" rx="6" fill="#6B4A2E" stroke="${C.gold}" stroke-width="2"/>`;
    const dots = t > 1 ? Math.floor((t * 3) % 4) : 0;
    g += `<g opacity="${f(clamp(t - 1))}"><path d="M-150,-110 h80 a14 14 0 0 1 14 14 v26 a14 14 0 0 1 -14 14 h-56 l-14,14 v-14 a14 14 0 0 1 -14 -14 v-26 a14 14 0 0 1 14 -14z" fill="${C.ivory}"/>`;
    for (let i = 0; i < 3; i++) g += `<circle cx="${-130 + i * 20}" cy="-83" r="5" fill="${i < dots ? C.gold : '#B9B1A3'}"/>`;
    return g + '</g>';
  },
  // 07 company formation
  (t) => {
    let g = ''; const bulb = 1 - prog(t, .8, 1.3);
    if (bulb > 0) g += `<g opacity="${f(bulb)}" transform="translate(0,-40)">${glow(0, -10, 90, .7)}<circle cy="-10" r="42" fill="#F3DFA8"/><rect x="-18" y="34" width="36" height="24" rx="4" fill="${C.gold}"/><path d="M-10,-4 l10,14 l10,-14" stroke="#B8955A" stroke-width="4" fill="none"/></g>`;
    const oc = prog(t, 1.0, 1.8);
    if (oc > 0) {
      const top = [0, -118], kids = [[-92, -42], [0, -42], [92, -42]];
      kids.forEach((k, i) => { const q = clamp(oc * 3 - i); g += goldPath(`M0,-100 L0,-80 L${k[0]},-80 L${k[0]},-60`, q, { w: 4 }); if (q > .9) g += `<rect x="${k[0] - 26}" y="${k[1] - 18}" width="52" height="34" rx="8" fill="#1E4876" stroke="${C.gold}" stroke-width="3"/>`; });
      g += `<rect x="-34" y="-140" width="68" height="40" rx="10" fill="${C.gold}"/>`;
    }
    const bp = prog(t, 1.6, 2.6);
    const bl = [[-120, 70, 60], [-46, 110, 74], [44, 150, 80], [128, 90, 54]];
    bl.forEach((b, i) => {
      const hh = b[1] * eo(clamp(bp * 2 - i * .3)); if (hh <= 0) return; const x = b[0] - b[2] / 2;
      g += `<rect x="${x}" y="${f(132 - hh)}" width="${b[2]}" height="${f(hh)}" fill="${i === 2 ? '#24527F' : '#1A3B60'}" stroke="${C.gold}" stroke-width="2"/>`;
      for (let r = 0; r < Math.floor(hh / 22); r++) for (let c = 0; c < 3; c++) g += `<rect x="${f(x + 8 + c * (b[2] - 16) / 3)}" y="${f(132 - 16 - r * 22)}" width="${f((b[2] - 16) / 3 - 6)}" height="10" fill="#EBD49B" opacity="${(r + c + i) % 3 ? .75 : .3}"/>`;
    });
    g += `<rect x="-160" y="132" width="320" height="6" fill="${C.gold}"/>`;
    return g;
  },
  // 08 contract drafting
  (t) => {
    let g = ''; const p = eo(prog(t, 0, .4)); const lp = prog(t, .3, 1.3);
    g += `<g opacity="${f(p)}"><rect x="-96" y="-136" width="192" height="262" rx="10" fill="url(#paperG)" stroke="#D3C6A8" stroke-width="2"/><rect x="-50" y="-116" width="100" height="10" rx="3" fill="${C.gold}"/></g>`;
    const n = 6; let pen = [70, -84];
    for (let i = 0; i < n; i++) {
      const q = clamp(lp * n - i); if (q <= 0) continue; const y = -84 + i * 26; const w = (i % 3 === 2 ? 90 : 128) * q;
      g += `<circle cx="72" cy="${y + 3}" r="4" fill="${C.gold}"/><rect x="${f(60 - w)}" y="${y}" width="${f(w)}" height="6" rx="2" fill="#8E98AB"/>`;
      if (q < 1) pen = [60 - w, y];
    }
    const sp = prog(t, 1.3, 2.0);
    if (sp > 0) {
      g += `<line x1="-80" y1="104" x2="-12" y2="104" stroke="#8E98AB" stroke-width="2" opacity="${f(clamp(sp * 3))}"/><line x1="12" y1="104" x2="80" y2="104" stroke="#8E98AB" stroke-width="2" opacity="${f(clamp(sp * 3))}"/>`;
      g += goldPath('M-76,98 q10,-22 18,-4 q6,12 14,-10 q8,-14 14,10', sp * 1.4, { w: 3.5 });
      g += goldPath('M16,98 q14,-20 20,-2 q8,14 18,-12 q6,-8 14,12', sp * 1.4 - .4, { w: 3.5 });
      if (sp < .5) pen = [lerp(-76, -30, sp * 2), 92]; else if (sp < 1) pen = [lerp(16, 66, (sp - .5) * 2), 92];
    }
    if (t > .25 && t < 2.2) g += `<g transform="translate(${f(pen[0])},${f(pen[1])}) rotate(-38)"><path d="M0,0 l-7,-18 h14 z" fill="${C.goldL}"/><rect x="-8" y="-86" width="16" height="70" rx="6" fill="#141C28" stroke="${C.gold}" stroke-width="2"/><rect x="-8" y="-40" width="16" height="6" fill="${C.gold}"/></g>`;
    return g;
  }
];
const SERVICES = ['القضايا التجارية', 'القضايا الإدارية', 'القضايا الجنائية', 'القضايا المدنية', 'اللجان شبه القضائية', 'الاستشارات القانونية', 'تأسيس الشركات', 'صياغة العقود'];

function serviceCard(i, cx, cy, w, h, lt, outP = 0) {
  // lt = local time since appearance
  if (lt <= 0 || outP >= 1) return '';
  const ap = eo(prog(lt, 0, .7)); const kind = i % 4;
  let tf = '';
  if (kind === 0) tf = `translate(${f((1 - ap) * 160)},0)`;
  else if (kind === 1) tf = `translate(${cx},${cy}) scale(${f(Math.max(.01, ap))},1) translate(${-cx},${-cy})`;
  else if (kind === 2) tf = `translate(0,${f((1 - ap) * 180)})`;
  else tf = `translate(${cx},${cy}) scale(${f(.6 + .4 * eback(prog(lt, 0, .7)))}) translate(${-cx},${-cy})`;
  const op = clamp(ap * 1.5) * (1 - outP);
  const outTf = outP > 0 ? `translate(${cx},${cy}) scale(${f(1 - .25 * eio(outP))}) translate(${-cx},${-cy})` : '';
  const x0 = cx - w / 2, y0 = cy - h / 2;
  let g = `<g transform="${outTf} ${tf}" opacity="${f(op * 100) / 100}"><g filter="url(#shadow)"><rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="28" fill="url(#cardG)" stroke="${C.gold}" stroke-width="3"/></g>`;
  g += `<rect x="${x0 + 12}" y="${y0 + 12}" width="${w - 24}" height="${h - 24}" rx="20" fill="none" stroke="${C.gold}" stroke-opacity=".28" stroke-width="1.5"/>`;
  g += glow(cx, cy - h * .1, w * .45, .22);
  // number badge (top-right for RTL)
  g += `<g transform="translate(${x0 + w - 60},${y0 + 58})"><circle r="32" fill="${C.gold}"/><text y="11" font-size="30" font-weight="800" fill="#0B1F36" text-anchor="middle" direction="ltr" font-family="Alex">${String(i + 1).padStart(2, '0')}</text></g>`;
  g += `<g transform="translate(${cx},${f(cy - h * .08)}) scale(${f(w / 400)})">${ICONS[i](lt - .3)}</g>`;
  // title
  const ts = SERVICES[i].length > 15 ? 42 : 46;
  g += `<line x1="${cx - 70}" y1="${y0 + h - 118}" x2="${cx + 70}" y2="${y0 + h - 118}" stroke="url(#goldH)" stroke-width="2"/>`;
  g += txt(SERVICES[i], cx, y0 + h - 58, { size: ts, weight: 700, fill: C.ivory, p: prog(lt, .35, 1.1), w: w - 60 });
  return g + '</g>';
}

/* ---------- SCENES ---------- */
// Scene 1: 0 - 5.8  The legal question
function scene1(t) {
  let g = bg(t, { pseed: 3 });
  const push = eio(prog(t, 0, 5.8));
  const zoom = 1 + .1 * push + .9 * eio(prog(t, 4.6, 5.9));
  const fy = 1225; // folder world y
  const cy = lerp(960, fy, eio(prog(t, 4.4, 5.9)));
  g += `<g transform="translate(540,${f(cy)}) scale(${f(zoom)}) translate(-540,${f(-cy)})">`;
  g += `<circle cx="540" cy="1000" r="520" fill="url(#softGlow)" opacity="${f(.4 + .6 * prog(t, 3.2, 4.5))}"/>`;
  // question marks
  const qs = [[230, 640, -12], [860, 590, 10], [170, 980, 6], [900, 930, -8], [300, 360, 8], [800, 330, -6]];
  qs.forEach((q, i) => {
    const a = fade(t, .4 + i * .25, 1.0 + i * .25, 3.3, 4.0);
    g += questionMark(q[0] + Math.sin(t * 1.4 + i) * 10, q[1] + Math.cos(t * 1.1 + i) * 14, .9 + (i % 3) * .2, a * .9, q[2]);
  });
  const op = eio(prog(t, 3.0, 4.2));
  // gold lines emerging from folder
  const lp = prog(t, 3.8, 5.6);
  if (lp > 0) {
    for (let i = 0; i < 8; i++) {
      const ang = -Math.PI / 2 + (i - 3.5) * .36; const L = 900;
      const p0 = [540, fy - 40], p3 = [540 + Math.cos(ang) * L, fy - 40 + Math.sin(ang) * L];
      g += goldPath(cubicD(p0, [540 + Math.cos(ang) * 200, fy - 200], [p3[0] * .8 + 108, p3[1] + 140], p3), clamp(lp * 1.4 - i * .05), { w: 4, glow: true });
    }
  }
  g += glow(540, fy - 30, 140 + 260 * op, op);
  const blink = (t % 3.1) > 2.95;
  const s = 1.32;
  const fl = folder(0, -440, 220, 168, op, { lp: 1, pageLift: 18 * op, filter: true });
  g += person({ x: 540, y: 1780, s, role: 'client', expr: t < 3.2 ? 'worried' : 'interested', turn: 0, lh: [-80, -420], rh: [80, -420], item: fl, blink, look: t < 3 ? Math.sin(t) * .6 : 0 });
  // floating pages from folder
  if (op > .6) {
    for (let i = 0; i < 5; i++) {
      const q = prog(t, 4.0 + i * .18, 5.8 + i * .18); if (q <= 0) continue;
      const ang = -Math.PI / 2 + (i - 2) * .55; const r = 330 * eo(q);
      g += paper(540 + Math.cos(ang) * r, fy - 60 + Math.sin(ang) * r, 90, 116, { rot: (i - 2) * 12 * q, lines: 4, op: clamp(q * 3) * (1 - prog(t, 5.3, 5.9)) });
    }
  }
  g += '</g>';
  // texts
  g += txt('عندك قضية؟', 540, 300, { size: 96, weight: 800, fill: C.ivory, p: prog(t, .7, 1.4), out: prog(t, 2.0, 2.4) });
  g += txt('تبحث عن الحل القانوني؟', 540, 300, { size: 78, weight: 700, fill: C.goldL, p: prog(t, 2.3, 3.1), out: prog(t, 4.9, 5.4) });
  g += ornament(540, 380, 300, fade(t, .9, 1.6, 4.9, 5.4));
  return g;
}

// Scene 2: 5.8 - 15.6  Why legal knowledge matters
function scene2(t) {
  const lt = t - 5.8; let g = bg(t, { pseed: 5 });
  const order = eio(prog(lt, 6.0, 8.4)); // tangled -> organised
  const light = prog(lt, 4.0, 5.2);
  g += `<circle cx="900" cy="700" r="${f(300 + 500 * light)}" fill="url(#softGlow)" opacity="${f(light)}"/>`;
  // branching tangled lines around client
  const r = rng(11); const n = 14; const grow = prog(lt, 0, 2.6);
  const cx = 360, cy = 1150;
  for (let i = 0; i < n; i++) {
    const a1 = r() * 6.28, a2 = r() * 6.28, a3 = r() * 6.28, R = 300 + r() * 360;
    const wob = Math.sin(lt * 1.6 + i) * 40 * (1 - order);
    const tang = [[cx, cy], [cx + Math.cos(a1) * R + wob, cy + Math.sin(a1) * R * .9], [cx + Math.cos(a2) * R * 1.2, cy + Math.sin(a2) * R - wob], [cx + Math.cos(a3) * (R + 200), cy + Math.sin(a3) * (R + 120)]];
    // organised: parallel vertical gold lanes rising from folder
    const lane = 120 + (i % 8) * 120; const ord = [[cx, cy], [cx, cy - 300], [lane, 900], [lane, 280 + (i % 2) * 40]];
    const P = tang.map((pt, k) => [lerp(pt[0], ord[k][0], order), lerp(pt[1], ord[k][1], order)]);
    const opac = lerp(.55, i < 8 ? .9 : 0, order);
    g += goldPath(cubicD(...P), clamp(grow * 1.3 - i * .03), { w: lerp(3, 4, order), op: opac, glow: order > .5 && i < 8 });
  }
  // floating documents
  const dr = rng(21);
  for (let i = 0; i < 6; i++) {
    const x = 120 + dr() * 840, y = 300 + dr() * 700; const ph = dr() * 6;
    const a = fade(lt, .5 + i * .2, 1.2 + i * .2, 7.8, 8.6);
    const ox = lerp(x, 160 + i * 150, order * .0);
    g += paper(ox + Math.sin(lt + ph) * 16, y + Math.cos(lt * .8 + ph) * 20, 80, 104, { rot: Math.sin(lt * .7 + ph) * 18, lines: 4, op: a * .85 });
  }
  // lawyer walks in from the right
  const wp = eo(prog(lt, 4.3, 6.3)); const walking = lt > 4.3 && lt < 6.3;
  const lx = lerp(1350, 790, wp); const bob = walking ? Math.abs(Math.sin(lt * 7)) * -10 : 0;
  const point = eio(prog(lt, 6.2, 6.9));
  const sL = 1.0;
  const tab = tablet(0, 0, 110, 150, -8, tabletScreen(110, 150, 1));
  g += glow(lx, 1000, 380 * light, light * .35);
  // client
  const unsure = lt < 6.4;
  const fl = folder(0, -430, 200, 152, 0, {});
  g += person({ x: cx, y: 1830, s: 1.08, role: 'client', expr: unsure ? 'worried' : 'interested', turn: lt > 5 ? .5 : (Math.sin(lt * 1.2) * .4), lh: unsure && lt > 1.5 ? [-60, -430] : [-80, -420], rh: unsure && lt > 1.5 && lt < 5 ? [20, -690] : [80, -420], item: fl, blink: (lt % 2.7) > 2.55, look: lt > 5 ? 1 : 0 });
  if (lt > 4.0) g += person({ x: lx, y: 1830 + bob, s: sL, role: 'lawyer', expr: 'smile', turn: -.6, lh: [lerp(-150, -330, point), lerp(-330, -560, point)], rh: [120, -420], itemFront: `<g transform="translate(120,-470)">${tab}</g>`, look: -1, blink: (lt % 3.3) > 3.15 });
  // texts
  g += txt('القرار غير المدروس', 540, 250, { size: 72, weight: 800, p: prog(lt, .6, 1.3), out: prog(lt, 5.4, 5.9) });
  g += txt('قد تكون له تبعات.', 540, 350, { size: 72, weight: 800, fill: C.goldL, p: prog(lt, 1.4, 2.1), out: prog(lt, 5.4, 5.9) });
  g += txt('المعرفة والخبرة', 540, 250, { size: 76, weight: 800, fill: C.goldL, p: prog(lt, 6.4, 7.1), out: prog(lt, 9.4, 9.9) });
  g += txt('تصنعان الفرق.', 540, 350, { size: 76, weight: 800, p: prog(lt, 7.0, 7.7), out: prog(lt, 9.4, 9.9) });
  g += ornament(540, 420, 320, Math.max(fade(lt, 1.6, 2.2, 5.3, 5.9), fade(lt, 7.4, 8, 9.4, 9.9)));
  return g;
}

// Office background
function office(t) {
  let g = `<rect width="${W}" height="${H}" fill="url(#wallG)"/>`;
  // window with city
  g += `<g><rect x="150" y="190" width="780" height="760" rx="10" fill="url(#skyG)" stroke="${C.gold}" stroke-width="5"/>`;
  const r = rng(7);
  for (let i = 0; i < 14; i++) { const bw = 40 + r() * 60, bh = 150 + r() * 420, x = 150 + i * 56; g += `<rect x="${f(x)}" y="${f(950 - bh)}" width="${f(bw)}" height="${f(bh)}" fill="${i % 2 ? '#132E4E' : '#183A60'}"/>`; for (let k = 0; k < bh / 40 - 1; k++) if (r() > .45) g += `<rect x="${f(x + 10)}" y="${f(950 - bh + 18 + k * 40)}" width="${f(bw - 20)}" height="8" fill="#E7C47A" opacity=".4"/>`; }
  g += `<line x1="540" y1="190" x2="540" y2="950" stroke="${C.gold}" stroke-width="4"/><line x1="150" y1="570" x2="930" y2="570" stroke="${C.gold}" stroke-width="3" opacity=".6"/></g>`;
  // shelves
  for (const sx of [20, 960]) for (let k = 0; k < 4; k++) {
    g += `<rect x="${sx}" y="${260 + k * 180}" width="100" height="10" fill="${C.gold}" opacity=".7"/>`;
    for (let b = 0; b < 4; b++) g += `<rect x="${sx + 8 + b * 22}" y="${260 + k * 180 - 92 + (b % 2) * 12}" width="18" height="${92 - (b % 2) * 12}" fill="${['#6B2B2B', '#1F4A72', '#8C6A33', '#2E3B4E'][(b + k) % 4]}"/>`;
  }
  g += `<rect x="0" y="1000" width="${W}" height="10" fill="${C.gold}" opacity=".5"/>`;
  return g;
}
function chair(x, y) { return `<path d="M${x - 130},${y} Q${x - 140},${y - 330} ${x},${y - 350} Q${x + 140},${y - 330} ${x + 130},${y} Z" fill="url(#chairG)" stroke="#0A1626" stroke-width="4"/><path d="M${x - 90},${y - 40} Q${x},${y - 300} ${x + 90},${y - 40}" fill="none" stroke="#C9A45C" stroke-opacity=".25" stroke-width="3"/>`; }

// Scene 3: 15.6 - 25.8  Introducing the office
function scene3(t) {
  const lt = t - 15.6; let g = '';
  const zoom = 1 + .03 * lt / 10 + 1.4 * eio(prog(lt, 9.3, 10.4));
  g += `<g transform="translate(540,780) scale(${f(zoom * 1000) / 1000}) translate(-540,-780)">`;
  g += office(t);
  const tableTop = 1260;
  g += chair(300, 1260) + chair(790, 1260);
  const reviewing = lt > 1.4 && lt < 7.6;
  const talk = reviewing ? Math.max(0, Math.sin(lt * 11)) * .8 * (Math.sin(lt * 1.7) > -.3 ? 1 : 0) : 0;
  const tabS = tabletScreen(120, 160, Math.max(0, lt - 3));
  g += person({ x: 300, y: 1700, s: 1.0, role: 'client', expr: lt > 3 ? 'interested' : 'neutral', turn: .7, lh: [-60, -430], rh: [70, -440], look: 1, blink: (lt % 2.9) > 2.75, shadow: false });
  const touch = eio(prog(lt, 7.3, 7.8)) * (1 - eio(prog(lt, 8.2, 8.7)));
  g += person({ x: 790, y: 1700, s: 1.0, role: 'lawyer', expr: 'smile', turn: -.7, lh: [lerp(-120, -260, touch), lerp(-430, -330, touch)], rh: [110, -470], itemFront: `<g transform="translate(110,-520)">${tablet(0, 0, 120, 160, -6, tabS)}</g>`, look: -1, mouth: talk, blink: (lt % 3.4) > 3.25, shadow: false });
  // table
  g += `<path d="M-40,${tableTop} L1120,${tableTop} L1120,1920 L-40,1920 Z" fill="url(#tableG)"/><rect x="-40" y="${tableTop}" width="1160" height="12" fill="${C.gold}" opacity=".8"/>`;
  // folder on table (open)
  const op = eio(prog(lt, .8, 1.8));
  const pl = 8 + 30 * eio(prog(lt, 7.6, 8.4));
  const lightA = prog(lt, 7.5, 8.3);
  g += glow(545, 1380, 320 * lightA + 60, lightA);
  g += `<g transform="translate(545,1400) scale(1,.62) translate(-545,-1400)">` + folder(545, 1400, 330, 240, op, { hl: eo(prog(lt, 3.2, 4.4)), lp: 1 }) + '</g>';
  // pen touching central document
  if (lt > 6.9 && lt < 8.8) { const pp = eio(prog(lt, 6.9, 7.6)); g += `<g transform="translate(${f(lerp(700, 580, pp))},${f(lerp(1250, 1385, pp))}) rotate(-35)"><path d="M0,0 l-6,-16 h12 z" fill="${C.goldL}"/><rect x="-7" y="-80" width="14" height="64" rx="5" fill="#141C28" stroke="${C.gold}" stroke-width="2"/></g>`; if (lt > 7.6) g += `<circle cx="572" cy="1392" r="${f(20 + (lt - 7.6) * 220)}" fill="none" stroke="${C.goldL}" stroke-width="4" opacity="${f(clamp(1 - (lt - 7.6) * 1.2))}"/>`; }
  // floating document zoom-card with magnifier
  const dc = fade(lt, 2.2, 2.9, 6.6, 7.2);
  if (dc > 0) {
    const dy = (1 - eo(clamp(dc))) * 60;
    g += `<g opacity="${f(dc)}" transform="translate(0,${f(dy)})">`;
    g += `<g filter="url(#shadow)">` + paper(540, 1010, 360, 440, { lines: 7, hl: eo(prog(lt, 3.2, 4.2)), hlRow: 2, lp: 1 }) + '</g>';
    const mx = 540 + Math.sin(lt * 1.5) * 90, my = 960 + Math.cos(lt * 1.1) * 80;
    g += `<g transform="translate(${f(mx)},${f(my)})"><circle r="70" fill="#FFF8E4" fill-opacity=".25" stroke="${C.gold}" stroke-width="9"/><line x1="50" y1="50" x2="110" y2="110" stroke="#2A2D33" stroke-width="22" stroke-linecap="round"/><line x1="50" y1="50" x2="64" y2="64" stroke="${C.gold}" stroke-width="22"/></g>`;
    g += '</g>';
  }
  // eight frames + golden pathways
  const ep = prog(lt, 7.7, 9.4);
  if (ep > 0) {
    const frames = []; for (let i = 0; i < 8; i++) { const col = i % 2, row = Math.floor(i / 2); frames.push([col ? 230 : 850, 260 + row * 190 + (col ? 60 : 0)]); }
    frames.forEach((fr, i) => {
      const p0 = [572, 1392]; const p3 = [fr[0], fr[1] + 70];
      const d = cubicD(p0, [572, 1100], [fr[0], 1000], p3);
      const q = clamp(ep * 1.5 - i * .06);
      g += goldPath(d, q, { w: 5, glow: true });
      const fp = eback(prog(lt, 8.4 + i * .08, 9.0 + i * .08));
      if (fp > 0) g += `<g transform="translate(${fr[0]},${fr[1]}) scale(${f(fp)})"><path d="M-60,70 V-20 Q-60,-80 0,-80 Q60,-80 60,-20 V70 Z" fill="#0F2C4B" fill-opacity=".85" stroke="${C.gold}" stroke-width="5"/><path d="M-44,62 V-16 Q-44,-62 0,-62 Q44,-62 44,-16 V62" fill="none" stroke="${C.gold}" stroke-opacity=".45" stroke-width="2"/><text y="18" font-size="40" font-weight="800" fill="${C.goldL}" text-anchor="middle" font-family="Alex" direction="ltr">${String(i + 1).padStart(2, '0')}</text></g>`;
    });
  }
  g += '</g>';
  // titles plate
  const tp = fade(lt, .3, 1.0, 9.0, 9.5);
  if (tp > 0) {
    g += `<g opacity="${f(tp)}"><rect x="60" y="1540" width="960" height="250" rx="30" fill="#0A1C30" fill-opacity=".86" stroke="${C.gold}" stroke-width="2.5"/></g>`;
    g += txt('مكتب المحامي عبدالرحيم الفارسي', 540, 1645, { size: 58, weight: 800, fill: C.goldL, p: prog(lt, .5, 1.4), out: prog(lt, 9.0, 9.5) });
    g += txt('للمحاماة والاستشارات القانونية', 540, 1730, { size: 46, weight: 600, fill: C.ivory, p: prog(lt, 1.1, 1.9), out: prog(lt, 9.0, 9.5) });
  }
  return g;
}

// Scene 4: 25.8 - 44.4 Eight services
const CARD_W = 470, CARD_H = 560;
const SLOTS = [[790, 700], [290, 700], [790, 1300], [290, 1300]];
function scene4(t) {
  const lt = t - 25.8; let g = bg(t, { pseed: 8, pcount: 26 });
  // appearance times (video seconds) synced to VO
  const A = [27.25, 28.95, 29.75, 30.55, 34.9, 36.55, 38.2, 39.5];
  const seqOut1 = prog(t, 33.9, 34.6), seqOut2 = prog(t, 41.9, 42.4);
  const folderY = 1750;
  g += glow(540, folderY, 240, .8);
  // header counter
  const set2 = t >= 34.6;
  const hp = set2 ? fade(t, 34.6, 35.2, 41.9, 42.3) : fade(t, 26.0, 26.6, 33.9, 34.5);
  if (hp > 0) g += `<g opacity="${f(hp)}"><text x="540" y="250" font-size="40" font-weight="700" fill="${C.gold}" text-anchor="middle" direction="ltr" font-family="Alex" letter-spacing="6">${set2 ? '05 — 08' : '01 — 04'}</text></g>` + ornament(540, 290, 260, hp);
  // pathways
  for (let k = 0; k < 4; k++) {
    const i = set2 ? k + 4 : k; const sl = SLOTS[k]; const out = set2 ? seqOut2 : seqOut1;
    const q = prog(t, A[i] - .7, A[i]) * (1 - out);
    if (q <= 0) continue;
    const p0 = [540, folderY - 60], p3 = [sl[0], sl[1] + CARD_H / 2 - 10];
    const p1 = [540, folderY - 260], p2 = [sl[0], sl[1] + CARD_H / 2 + 200];
    g += goldPath(cubicD(p0, p1, p2, p3), q, { w: 4, glow: true });
    const dp = ((t * .6 + k * .25) % 1); const pt = cubicPt(p0, p1, p2, p3, dp);
    if (q >= 1) g += `<circle cx="${f(pt[0])}" cy="${f(pt[1])}" r="7" fill="#FFF1C9"/>` + glow(pt[0], pt[1], 30, .8);
  }
  g += `<g transform="translate(0,${f(Math.sin(t * 2) * 4)})">` + folder(540, folderY, 170, 124, .25 + .08 * Math.sin(t * 2), { filter: true }) + '</g>';
  for (let k = 0; k < 4; k++) {
    const i = set2 ? k + 4 : k; const sl = SLOTS[k];
    g += serviceCard(i, sl[0], sl[1], CARD_W, CARD_H, t - A[i], set2 ? seqOut2 : seqOut1);
  }
  // unified composition
  const up = prog(t, 42.1, 42.8);
  if (up > 0) {
    g += txt('خدمات قانونية متكاملة', 540, 330, { size: 76, weight: 800, fill: C.goldL, p: prog(t, 42.1, 42.8) });
    g += ornament(540, 395, 360, prog(t, 42.3, 42.9));
    for (let i = 0; i < 8; i++) {
      const y = 515 + i * 122;
      const q = eo(prog(t, 42.15 + i * .07, 42.65 + i * .07)); if (q <= 0) continue;
      g += `<g transform="translate(${f((1 - q) * 120)},${y})" opacity="${f(q)}"><rect x="110" y="-52" width="860" height="104" rx="52" fill="url(#cardG)" stroke="${C.gold}" stroke-width="2.5"/>`;
      g += `<circle cx="914" cy="0" r="46" fill="#0B1F36" stroke="${C.gold}" stroke-width="2"/><g transform="translate(914,3) scale(.27)">${ICONS[i](4)}</g>`;
      g += `<text x="845" y="15" font-size="44" font-weight="700" fill="${C.ivory}" text-anchor="start" direction="rtl" font-family="Alex">${SERVICES[i]}</text>`;
      g += `<text x="168" y="14" font-size="34" font-weight="800" fill="${C.gold}" text-anchor="middle" direction="ltr" font-family="Alex">${String(i + 1).padStart(2, '0')}</text></g>`;
    }
    g += txt('خبرة ومعرفة... لمختلف احتياجاتك القانونية.', 540, 1520, { size: 46, weight: 600, fill: C.ivory, p: prog(t, 42.8, 43.6), w: 900 });
  }
  return g;
}

// Scene 5: 44.4 - 52.6 Clarity & informed decisions
function scene5(t) {
  const lt = t - 44.4; let g = bg(t, { pseed: 12 });
  const pull = eo(prog(lt, 0, 1.4)); const zoom = lerp(1.25, 1, pull);
  const pan = eio(prog(lt, 7.0, 8.2)) * 1100;
  g += `<g transform="translate(0,${f(pan)}) translate(540,1100) scale(${f(zoom)}) translate(-540,-1100)">`;
  const align = eio(prog(lt, 2.3, 4.6));
  const fpos = [540, 1290];
  // folder handover
  const hand = eio(prog(lt, 5.4, 6.4)); const closeP = 1 - eio(prog(lt, 4.8, 5.5));
  const fx = lerp(540, 770, hand), fy = lerp(1290, 1430, hand);
  // pathways
  const top = [];
  for (let i = 0; i < 8; i++) {
    const ang = Math.PI + (i + .5) * Math.PI / 8; const R = 640;
    top.push([540 + Math.cos(ang) * R * .75, 1250 + Math.sin(ang) * R]);
  }
  for (let i = 0; i < 8; i++) {
    const tp = [lerp(top[i][0], 540, align), lerp(top[i][1], 160, align)];
    const p0 = fpos, p1 = [lerp(540 + (top[i][0] - 540) * .2, 540, align), 1050], p2 = [tp[0], lerp(tp[1] + 220, 400, align)];
    g += goldPath(cubicD(p0, p1, p2, tp), prog(lt, 0, .9) * (1 - prog(lt, 4.6, 5.0)), { w: 4, glow: true, op: lerp(1, .6, align) });
    const bp = 1 - align;
    if (bp > 0.02) g += `<g transform="translate(${f(tp[0])},${f(tp[1])}) scale(${f(.95 * bp + .05)})" opacity="${f(bp)}"><circle r="66" fill="#0B1F36" stroke="${C.gold}" stroke-width="3"/><g transform="translate(0,6) scale(.36)">${ICONS[i](4)}</g></g>`;
  }
  // single route
  const rp = prog(lt, 3.6, 4.8);
  if (rp > 0) g += goldPath(`M540,1290 L540,-1200`, rp, { w: 9, glow: true });
  if (rp > 0) g += glow(540, lerp(1290, 200, rp), 80, rp);
  g += glow(fx, fy, 160, .6);
  // characters
  const pointUp = eio(prog(lt, .8, 1.6)) * (1 - eio(prog(lt, 4.8, 5.4)));
  const tab = tablet(0, 0, 120, 160, -10, tabletScreen(120, 160, Math.max(0, lt - 1)));
  g += person({ x: 250, y: 1880, s: .78, role: 'lawyer', expr: 'smile', turn: .5, lh: [-40, -430], rh: [lerp(150, 290, pointUp) + hand * 150, lerp(-330, -760, pointUp) + hand * 200], itemFront: `<g transform="translate(-40,-480)">${tab}</g>`, look: lt > 5 ? 1 : 0, blink: (lt % 3) > 2.85 });
  const conf = lt > 3.8;
  g += person({ x: 830, y: 1880, s: .78, role: 'client', expr: conf ? 'confident' : 'interested', turn: -.5, lh: [lerp(-150, -80, hand), lerp(-320, -560, hand)], rh: [lerp(150, 60, hand), lerp(-320, -560, hand)], look: -1, blink: (lt % 2.6) > 2.45 });
  g += folder(fx, fy, 160, 120, closeP * .3, { filter: true });
  g += '</g>';
  const plate = fade(lt, .5, 1.0, 7.0, 7.5); if (plate > 0) g += `<rect x="90" y="170" width="900" height="240" rx="36" fill="#0A1C30" fill-opacity=".88" stroke="${C.gold}" stroke-opacity=".6" stroke-width="2" opacity="${f(plate)}"/>`;
  g += txt('نوضح لك الخيارات.', 540, 300, { size: 80, weight: 800, fill: C.ivory, p: prog(lt, .6, 1.3), out: prog(lt, 2.8, 3.2) });
  g += txt('قرارات على أساس', 540, 260, { size: 74, weight: 800, fill: C.goldL, p: prog(lt, 3.1, 3.8), out: prog(lt, 7.0, 7.5) });
  g += txt('قانوني سليم.', 540, 360, { size: 74, weight: 800, fill: C.ivory, p: prog(lt, 3.5, 4.2), out: prog(lt, 7.0, 7.5) });
  return g;
}

// Scene 6: 52.6 - 60  Brand reveal & contact
function phoneIcon(x, y, s) { return `<g transform="translate(${x},${y}) scale(${s})"><circle r="40" fill="${C.gold}"/><path d="M-14,-20 q-8,4 -6,14 q6,22 26,32 q10,4 14,-4 l4,-8 q2,-4 -2,-6 l-10,-6 q-4,-2 -6,2 l-4,4 q-10,-6 -14,-16 l4,-4 q4,-2 2,-6 l-6,-10 q-2,-4 -6,-2z" fill="#0B1F36"/></g>`; }
function globeIcon(x, y, s) { return `<g transform="translate(${x},${y}) scale(${s})" fill="none" stroke="${C.gold}" stroke-width="3.5"><circle r="24"/><ellipse rx="11" ry="24"/><line x1="-24" y1="0" x2="24" y2="0"/><path d="M-20,-12 h40 M-20,12 h40"/></g>`; }
function scene6(t) {
  const lt = t - 52.6; let g = bg(t, { pseed: 17, pcount: 40 });
  // golden route forming the geometric frame
  const fr = 'M540,860 L280,860 L180,760 L180,330 L280,230 L540,230 L800,230 L900,330 L900,760 L800,860 Z';
  const lineIn = prog(lt, 0, .6);
  g += goldPath(`M540,1920 L540,860`, 1, { w: 8, op: 1 - prog(lt, .6, 1.2), glow: true });
  g += glow(540, lerp(1700, 860, lineIn), 90, 1 - prog(lt, .8, 1.4));
  const fp = eio(prog(lt, .4, 2.0));
  g += `<path d="M540,860 L280,860 L180,760 L180,330 L280,230 L540,230" pathLength="1" fill="none" stroke="url(#goldG)" stroke-width="7" stroke-dasharray="1 2" stroke-dashoffset="${f((1 - fp) * 1000) / 1000}"/>`;
  g += `<path d="M540,860 L800,860 L900,760 L900,330 L800,230 L540,230" pathLength="1" fill="none" stroke="url(#goldG)" stroke-width="7" stroke-dasharray="1 2" stroke-dashoffset="${f((1 - fp) * 1000) / 1000}"/>`;
  const inner = prog(lt, 1.6, 2.2);
  if (inner > 0) g += `<path d="M280,836 L204,760 L204,330 L280,254 L800,254 L876,330 L876,760 L800,836 Z" fill="${C.ivory}" opacity="${f(eo(inner))}" filter="url(#shadow)"/>`;
  const lp = eo(prog(lt, 2.0, 2.9));
  if (lp > 0) {
    const lw = 640 * lerp(.85, 1, lp), lh = lw * 161 / 400;
    g += glow(540, 545, 380, .25 * lp);
    g += `<image href="assets/logo_3x.png" x="${f(540 - lw / 2)}" y="${f(545 - lh / 2)}" width="${f(lw)}" height="${f(lh)}" opacity="${f(lp)}"/>`;
    // shine sweep
    const sw = prog(lt, 3.0, 3.9);
    if (sw > 0 && sw < 1) { const sx = lerp(150, 930, sw); g += `<rect x="${f(sx)}" y="260" width="60" height="570" fill="#fff" opacity=".35" transform="skewX(-18)" filter="url(#blur6)"/>`; }
  }
  // corners ornaments
  g += `<g opacity="${f(inner)}">` + [[180, 330], [900, 330], [180, 760], [900, 760]].map(p => `<rect x="${p[0] - 9}" y="${p[1] - 9}" width="18" height="18" transform="rotate(45 ${p[0]} ${p[1]})" fill="${C.gold}"/>`).join('') + '</g>';
  // names & slogan
  g += txt('مكتب المحامي عبدالرحيم بن دخيل الفارسي', 540, 975, { size: 48, weight: 800, fill: C.goldL, p: prog(lt, 1.2, 2.1), w: 960 });
  g += txt('للمحاماة والاستشارات القانونية', 540, 1050, { size: 40, weight: 600, fill: C.ivory, p: prog(lt, 1.6, 2.4) });
  g += ornament(540, 1110, 420, prog(lt, 2.0, 2.6));
  g += txt('معرفة قانونية...', 540, 1215, { size: 70, weight: 800, fill: C.ivory, p: prog(lt, 3.0, 3.7) });
  g += txt('وثقة في كل خطوة.', 540, 1305, { size: 70, weight: 800, fill: C.goldL, p: prog(lt, 4.6, 5.3) });
  // contact block
  const cp = eo(prog(lt, 2.4, 3.2));
  if (cp > 0) {
    g += `<g opacity="${f(cp)}" transform="translate(0,${f((1 - cp) * 40)})">`;
    g += `<text x="540" y="1420" font-size="36" font-weight="600" fill="${C.gold}" text-anchor="middle" direction="rtl" font-family="Alex">للتواصل والاستشارات:</text>`;
    g += `<g filter="url(#shadow)"><rect x="110" y="1460" width="860" height="150" rx="75" fill="url(#goldG)"/></g>`;
    g += phoneIcon(860, 1535, 1.25).replace(`fill="${C.gold}"`, 'fill="#0B1F36"').replace('fill="#0B1F36"/></g>', `fill="${C.goldL}"/></g>`);
    g += `<text x="480" y="1564" font-size="84" font-weight="800" fill="#0B1F36" text-anchor="middle" direction="ltr" font-family="Alex" letter-spacing="3">0590253050</text>`;
    g += `<rect x="150" y="1650" width="780" height="104" rx="52" fill="#0B1F36" stroke="${C.gold}" stroke-width="3"/>`;
    g += globeIcon(860, 1702, 1.2);
    g += `<text x="500" y="1718" font-size="46" font-weight="600" fill="${C.ivory}" text-anchor="middle" direction="ltr" font-family="Alex">www.alfarsilawyer.com</text>`;
    g += '</g>';
  }
  return g;
}

const SCENES = [[0, 5.8, scene1], [5.8, 15.6, scene2], [15.6, 25.8, scene3], [25.8, 44.4, scene4], [44.4, 52.6, scene5], [52.6, 60.1, scene6]];
const XF = .45; // crossfade
function render(t) {
  UID = 0;
  let body = '';
  for (const [a, b, fn] of SCENES) {
    if (t < a - XF / 2 || t > b + XF / 2) continue;
    let op = 1;
    if (a > 0 && t < a + XF / 2) op = prog(t, a - XF / 2, a + XF / 2);
    if (b < 60 && t > b - XF / 2) op = Math.min(op, 1 - prog(t, b - XF / 2, b + XF / 2));
    if (op <= 0) continue;
    body += `<g opacity="${f(op * 1000) / 1000}">${fn(t)}</g>`;
  }
  // transition flashes
  let flash = 0; for (const [a] of SCENES) if (a > 0) flash = Math.max(flash, 1 - Math.abs(t - a) / (XF * .8));
  if (flash > 0) body += `<rect width="${W}" height="${H}" fill="#F3DFA8" opacity="${f(clamp(flash) * .22 * 100) / 100}"/>`;
  body += vignette();
  if (t < .5) body += `<rect width="${W}" height="${H}" fill="#000" opacity="${f(1 - t / .5)}"/>`;
  document.getElementById('stage').innerHTML = DEFS + body;
  return true;
}
window.render = render;
if (location.hash) render(parseFloat(location.hash.slice(1)) || 0);
