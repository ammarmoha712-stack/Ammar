// MIYAAR LEGAL — illustration library (flat vector / 2.5D)
const C = {
  slate: '#3F4E5A', slate2: '#4F5F6B', slate3: '#66757F', slate4: '#8794A0', slate5: '#AAB4BB', slate6: '#CBD2D6',
  gold: '#C5A059', gold2: '#D6B77A', gold3: '#E9D7AE', goldD: '#9C7A3A', goldDD: '#7E6230',
  ivory: '#F7F4EA', beige: '#E9DFC9', beige2: '#DED1B5', beige3: '#CDBB98', beige4: '#B9A57E',
  white: '#FFFFFF', char: '#302E2B', char2: '#46423D',
  skin: '#C99B78', skin2: '#B07F5E', beard: '#3A2F29', agal: '#1F1D1B', green: '#006C35'
};

const r1 = (n) => Math.round(n * 10) / 10;

/* ---------------- shared defs ---------------- */
function globalDefs() {
  const N = 18, FW = 240, FH = 160;
  let clips = '';
  for (let i = 0; i < N; i++) {
    clips += `<clipPath id="fclip${i}"><rect x="${r1(i * FW / N - 0.6)}" y="-20" width="${r1(FW / N + 1.2)}" height="${FH + 40}"/></clipPath>`;
  }
  return `
  <svg width="0" height="0" style="position:absolute">
   <defs>
    <linearGradient id="gSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#EFE5D2"/><stop offset="0.55" stop-color="#F6EEDD"/><stop offset="1" stop-color="#FBF6EA"/>
    </linearGradient>
    <radialGradient id="gSun" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#FFF6DD" stop-opacity="1"/><stop offset="0.25" stop-color="#F3D9A0" stop-opacity="0.75"/>
      <stop offset="1" stop-color="#F3D9A0" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="gGold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#E4C98E"/><stop offset="0.5" stop-color="#C5A059"/><stop offset="1" stop-color="#9C7A3A"/>
    </linearGradient>
    <linearGradient id="gGoldV" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#E4C98E"/><stop offset="1" stop-color="#A9853F"/>
    </linearGradient>
    <linearGradient id="gGround" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#E6D9BD"/><stop offset="1" stop-color="#EFE6D3"/>
    </linearGradient>
    <linearGradient id="gDesk" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#E2D4B6"/><stop offset="1" stop-color="#D3C19D"/>
    </linearGradient>
    <linearGradient id="gWindow" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#F2E2BF"/><stop offset="1" stop-color="#FBF5E8"/>
    </linearGradient>
    <linearGradient id="gFade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#F7F4EA" stop-opacity="0"/><stop offset="1" stop-color="#F7F4EA" stop-opacity="1"/>
    </linearGradient>
    <pattern id="pShemagh" width="8" height="8" patternUnits="userSpaceOnUse">
      <rect width="8" height="8" fill="#FFFFFF"/>
      <rect x="0" y="0" width="4" height="4" fill="#C2483F" opacity="0.85"/>
      <rect x="4" y="4" width="4" height="4" fill="#C2483F" opacity="0.35"/>
    </pattern>
    <pattern id="pNajdi" width="120" height="120" patternUnits="userSpaceOnUse">
      <path d="M0 60 L60 0 L120 60 L60 120 Z" fill="none" stroke="#C5A059" stroke-width="1"/>
      <path d="M30 60 L60 30 L90 60 L60 90 Z" fill="none" stroke="#C5A059" stroke-width="0.8"/>
    </pattern>
    <pattern id="pGrid" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M60 0 L0 0 0 60" fill="none" stroke="#3F4E5A" stroke-width="0.6"/>
    </pattern>
    <g id="flagArt">
      <rect x="0" y="0" width="${FW}" height="${FH}" fill="${C.green}"/>
      <text x="${FW / 2}" y="${FH * 0.46}" text-anchor="middle" direction="rtl" font-family="Amiri" font-weight="700" font-size="${FH * 0.2}" textLength="${FW * 0.8}" lengthAdjust="spacingAndGlyphs" fill="#fff">لا إله إلا الله محمد رسول الله</text>
      ${sword(FW, FH)}
    </g>
    ${clips}
   </defs>
  </svg>`;
}

function sword(FW, FH) {
  // blade tip toward the hoist, hilt toward the fly
  const y = FH * 0.74, x0 = FW * 0.2, x1 = FW * 0.72;
  return `<path d="M${x0} ${y} Q ${(x0 + x1) / 2} ${y - FH * 0.035} ${x1} ${y - FH * 0.012} L ${x1} ${y + FH * 0.022} Q ${(x0 + x1) / 2} ${y + FH * 0.004} ${x0} ${y} Z" fill="#fff"/>
    <rect x="${x1}" y="${y - FH * 0.05}" width="${FW * 0.012}" height="${FH * 0.1}" fill="#fff"/>
    <rect x="${x1 + FW * 0.012}" y="${y - FH * 0.012}" width="${FW * 0.06}" height="${FH * 0.03}" rx="2" fill="#fff"/>
    <circle cx="${x1 + FW * 0.078}" cy="${y + FH * 0.003}" r="${FH * 0.02}" fill="#fff"/>`;
}

/* Waving flag built from vertical strips; animated by waveFlag() */
function flag(id, x, y, scale = 1) {
  const N = 18;
  let strips = '';
  for (let i = 0; i < N; i++) {
    strips += `<g class="fstrip" data-i="${i}"><g clip-path="url(#fclip${i})"><use href="#flagArt"/></g>
      <rect class="fshade" x="${r1(i * 240 / N - 0.5)}" y="0" width="${r1(240 / N + 1)}" height="160" fill="#000" opacity="0"/></g>`;
  }
  return `<g id="${id}" transform="translate(${x} ${y}) scale(${scale})">${strips}</g>`;
}
function waveFlag(el, t, amp = 7) {
  if (!el) return;
  const strips = el.querySelectorAll('.fstrip');
  const N = strips.length;
  strips.forEach((s, i) => {
    const u = i / (N - 1);
    const ph = u * 5.2 - t * 3.1;
    const dy = Math.sin(ph) * amp * (0.15 + u);
    const dx = -u * 3 * (1 - Math.cos(ph)) * 0.6;
    s.setAttribute('transform', `translate(${r1(dx)} ${r1(dy)})`);
    const sh = s.querySelector('.fshade');
    const c = Math.cos(ph);
    sh.setAttribute('fill', c > 0 ? '#000' : '#fff');
    sh.setAttribute('opacity', (Math.abs(c) * 0.12 * (0.3 + u)).toFixed(3));
  });
}

/* ---------------- architecture ---------------- */
function windows(x, y, w, h, cols, rows, color, op = 1, gapX = 0.45, gapY = 0.55) {
  let s = '';
  const cw = w / cols, rh = h / rows;
  const ww = cw * (1 - gapX), wh = rh * (1 - gapY);
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    s += `<rect x="${r1(x + c * cw + (cw - ww) / 2)}" y="${r1(y + r * rh + (rh - wh) / 2)}" width="${r1(ww)}" height="${r1(wh)}" fill="${color}" opacity="${op}"/>`;
  }
  return s;
}

function tower({ x, base, w, h, fill, shade, win, winOp = 0.55, cols = 4, rows, top = 'flat', cls = '' }) {
  rows = rows || Math.max(3, Math.round(h / 34));
  const sw = w * 0.34;
  let s = `<g class="${cls}" data-base="${base}">`;
  s += `<rect x="${x}" y="${base - h}" width="${w}" height="${h}" fill="${fill}"/>`;
  if (shade) s += `<rect x="${x + w - sw}" y="${base - h}" width="${sw}" height="${h}" fill="${shade}"/>`;
  if (win) s += windows(x + w * 0.08, base - h + 16, w * 0.84, h - 28, cols, rows, win, winOp);
  if (top === 'step') s += `<rect x="${x + w * 0.18}" y="${base - h - h * 0.08}" width="${w * 0.64}" height="${h * 0.08}" fill="${fill}"/>` + (shade ? `<rect x="${x + w * 0.82 - w * 0.2}" y="${base - h - h * 0.08}" width="${w * 0.2}" height="${h * 0.08}" fill="${shade}"/>` : '');
  if (top === 'slant') s += `<polygon points="${x},${base - h} ${x + w},${base - h - w * 0.45} ${x + w},${base - h}" fill="${shade || fill}"/>`;
  if (top === 'spire') s += `<rect x="${x + w / 2 - 2}" y="${base - h - 60}" width="4" height="60" fill="${shade || fill}"/>`;
  if (top === 'crown') s += `<polygon points="${x},${base - h} ${x + w / 2},${base - h - w * 0.5} ${x + w},${base - h}" fill="${fill}"/>` + (shade ? `<polygon points="${x + w / 2},${base - h - w * 0.5} ${x + w},${base - h} ${x + w / 2},${base - h}" fill="${shade}"/>` : '');
  s += `</g>`;
  return s;
}

function kingdomCentre(cx, base, w, h, fill, shade, cls = '') {
  const hw = w / 2;
  const tipY = base - h, uY = base - h * 0.66;
  const d = `M${cx - hw} ${base} L ${cx - hw * 0.84} ${base - h * 0.55}
    Q ${cx - hw * 0.74} ${base - h * 0.86} ${cx - hw * 0.52} ${tipY}
    Q ${cx - hw * 0.36} ${base - h * 0.74} ${cx} ${uY}
    Q ${cx + hw * 0.36} ${base - h * 0.74} ${cx + hw * 0.52} ${tipY}
    Q ${cx + hw * 0.74} ${base - h * 0.86} ${cx + hw * 0.84} ${base - h * 0.55}
    L ${cx + hw} ${base} Z`;
  const ds = `M${cx + hw * 0.18} ${base} L ${cx + hw * 0.2} ${uY + 6}
    Q ${cx + hw * 0.36} ${base - h * 0.74} ${cx + hw * 0.52} ${tipY}
    Q ${cx + hw * 0.74} ${base - h * 0.86} ${cx + hw * 0.84} ${base - h * 0.55} L ${cx + hw} ${base} Z`;
  let s = `<g class="${cls}" data-base="${base}"><path d="${d}" fill="${fill}"/><path d="${ds}" fill="${shade}"/>`;
  // skybridge
  const by = base - h * 0.9;
  s += `<path d="M${cx - hw * 0.43} ${by} L ${cx + hw * 0.43} ${by}" stroke="${shade}" stroke-width="${Math.max(3, h * 0.012)}"/>`;
  // facade lines
  for (let i = 1; i < 9; i++) {
    const yy = base - i * h * 0.06;
    const k = 1 - (i * 0.06) * 0.3;
    s += `<line x1="${cx - hw * 0.92 * k}" y1="${yy}" x2="${cx + hw * 0.92 * k}" y2="${yy}" stroke="#fff" stroke-opacity="0.13" stroke-width="2"/>`;
  }
  return s + `</g>`;
}

function faisaliah(cx, base, w, h, fill, shade, cls = '') {
  const hw = w / 2, top = base - h;
  let s = `<g class="${cls}" data-base="${base}">`;
  s += `<path d="M${cx - hw} ${base} Q ${cx - hw * 0.62} ${base - h * 0.5} ${cx} ${top} Q ${cx + hw * 0.62} ${base - h * 0.5} ${cx + hw} ${base} Z" fill="${fill}"/>`;
  s += `<path d="M${cx} ${top} Q ${cx + hw * 0.62} ${base - h * 0.5} ${cx + hw} ${base} L ${cx + hw * 0.1} ${base} Z" fill="${shade}"/>`;
  // lattice lines
  for (let i = 1; i < 7; i++) {
    const yy = base - i * h * 0.1;
    const k = Math.pow(1 - i * 0.1, 0.9);
    s += `<line x1="${cx - hw * k * 0.95}" y1="${yy}" x2="${cx + hw * k * 0.95}" y2="${yy}" stroke="#fff" stroke-opacity="0.16" stroke-width="2"/>`;
  }
  const sy = base - h * 0.74;
  s += `<circle cx="${cx}" cy="${sy}" r="${w * 0.12}" fill="url(#gGold)"/>`;
  s += `<rect x="${cx - 1.5}" y="${top - h * 0.12}" width="3" height="${h * 0.12}" fill="${shade}"/>`;
  return s + `</g>`;
}

function najdiCrenel(x, y, w, size, color, op = 1) {
  let s = '';
  const n = Math.floor(w / (size * 1.6));
  const step = w / n;
  for (let i = 0; i < n; i++) {
    const cx = x + i * step + step / 2;
    s += `<polygon points="${r1(cx - size / 2)},${y} ${r1(cx)},${y - size} ${r1(cx + size / 2)},${y}" fill="${color}" opacity="${op}"/>`;
  }
  return s;
}

/* ---------------- legal objects ---------------- */
function bookStanding(x, base, w, h, color, band = C.gold) {
  return `<g><rect x="${x}" y="${base - h}" width="${w}" height="${h}" rx="3" fill="${color}"/>
    <rect x="${x + w - w * 0.22}" y="${base - h}" width="${w * 0.22}" height="${h}" rx="2" fill="#000" opacity="0.12"/>
    <rect x="${x}" y="${base - h + h * 0.12}" width="${w}" height="${Math.max(3, h * 0.025)}" fill="${band}"/>
    <rect x="${x}" y="${base - h + h * 0.17}" width="${w}" height="${Math.max(2, h * 0.012)}" fill="${band}"/>
    <rect x="${x + w * 0.2}" y="${base - h + h * 0.35}" width="${w * 0.6}" height="${h * 0.16}" rx="2" fill="${band}" opacity="0.85"/>
    <rect x="${x}" y="${base - h * 0.14}" width="${w}" height="${Math.max(3, h * 0.025)}" fill="${band}"/></g>`;
}
function bookLying(x, y, w, h, color, band = C.gold) {
  return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${color}"/>
    <rect x="${x + w - 10}" y="${y + 3}" width="8" height="${h - 6}" fill="${C.ivory}"/>
    <rect x="${x + w * 0.08}" y="${y}" width="${Math.max(4, w * 0.02)}" height="${h}" fill="${band}"/>
    <rect x="${x + w * 0.13}" y="${y}" width="${Math.max(2, w * 0.01)}" height="${h}" fill="${band}"/>
    <rect x="${x + w * 0.3}" y="${y + h * 0.3}" width="${w * 0.36}" height="${h * 0.4}" rx="2" fill="${band}" opacity="0.8"/></g>`;
}

function justiceScale(id, cx, base, H, opt = {}) {
  const beamW = opt.beamW || H * 0.92;
  const pivotY = base - H * 0.86;
  const chain = H * 0.36;
  const panW = H * 0.3;
  const stroke = opt.stroke || C.goldD;
  const fill = opt.fill || 'url(#gGold)';
  const sw = opt.sw || Math.max(2, H * 0.012);
  const pan = (side) => `<g class="pan" data-side="${side}">
      <path class="draw" d="M0 0 L ${-panW / 2} ${chain}" stroke="${stroke}" stroke-width="${sw * 0.7}" fill="none"/>
      <path class="draw" d="M0 0 L ${panW / 2} ${chain}" stroke="${stroke}" stroke-width="${sw * 0.7}" fill="none"/>
      <g class="panload"></g>
      <path class="draw fillme" d="M${-panW / 2 - 6} ${chain} Q 0 ${chain + panW * 0.42} ${panW / 2 + 6} ${chain} Z" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>
      <circle cx="0" cy="0" r="${sw * 1.8}" fill="${stroke}"/></g>`;
  return `<g id="${id}" data-pivot="${pivotY}" data-half="${beamW / 2}" data-cx="${cx}">
    <path class="draw fillme" d="M${cx - H * 0.22} ${base} L ${cx + H * 0.22} ${base} L ${cx + H * 0.14} ${base - H * 0.05} L ${cx - H * 0.14} ${base - H * 0.05} Z" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>
    <path class="draw fillme" d="M${cx - H * 0.025} ${base - H * 0.05} L ${cx - H * 0.018} ${pivotY} L ${cx + H * 0.018} ${pivotY} L ${cx + H * 0.025} ${base - H * 0.05} Z" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>
    <circle class="draw fillme" cx="${cx}" cy="${pivotY - H * 0.07}" r="${H * 0.035}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>
    <g class="beam" transform="translate(${cx} ${pivotY})">
      <path class="draw fillme" d="M${-beamW / 2} 0 Q 0 ${-H * 0.05} ${beamW / 2} 0 L ${beamW / 2} ${H * 0.018} Q 0 ${-H * 0.025} ${-beamW / 2} ${H * 0.018} Z" fill="${fill}" stroke="${stroke}" stroke-width="${sw * 0.8}"/>
      <circle cx="0" cy="0" r="${H * 0.03}" fill="${stroke}"/>
    </g>
    <g class="pans"><g class="panL" transform="translate(${cx - beamW / 2} ${pivotY})">${pan('L')}</g>
    <g class="panR" transform="translate(${cx + beamW / 2} ${pivotY})">${pan('R')}</g></g>
  </g>`;
}
function tiltScale(el, deg) {
  if (!el) return;
  const cx = +el.dataset.cx, py = +el.dataset.pivot, hw = +el.dataset.half;
  const a = deg * Math.PI / 180;
  el.querySelector('.beam').setAttribute('transform', `translate(${cx} ${py}) rotate(${deg})`);
  el.querySelector('.panL').setAttribute('transform', `translate(${r1(cx - hw * Math.cos(a))} ${r1(py - hw * Math.sin(a))})`);
  el.querySelector('.panR').setAttribute('transform', `translate(${r1(cx + hw * Math.cos(a))} ${r1(py + hw * Math.sin(a))})`);
}

function doc(x, y, w, h, rot = 0, opt = {}) {
  const lines = opt.lines ?? Math.floor((h - 50) / 18);
  let s = `<g transform="translate(${x} ${y}) rotate(${rot})" class="${opt.cls || ''}">
    <rect x="${-w / 2 + 5}" y="${-h / 2 + 7}" width="${w}" height="${h}" rx="4" fill="#000" opacity="0.06"/>
    <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="4" fill="#fff" stroke="${C.beige2}" stroke-width="1.5"/>`;
  s += `<rect x="${w / 2 - w * 0.12 - w * 0.4}" y="${-h / 2 + h * 0.1}" width="${w * 0.4}" height="${Math.max(5, h * 0.035)}" rx="2" fill="${opt.head || C.gold}"/>`;
  for (let i = 0; i < lines; i++) {
    const lw = (i % 3 === 2 ? 0.55 : 0.76) * w;
    s += `<rect x="${w / 2 - w * 0.12 - lw}" y="${r1(-h / 2 + h * 0.22 + i * 18)}" width="${r1(lw)}" height="5" rx="2.5" fill="${C.slate6}"/>`;
  }
  if (opt.seal) s += `<circle cx="${-w / 2 + w * 0.24}" cy="${h / 2 - h * 0.16}" r="${w * 0.1}" fill="none" stroke="${C.gold}" stroke-width="3"/><circle cx="${-w / 2 + w * 0.24}" cy="${h / 2 - h * 0.16}" r="${w * 0.06}" fill="${C.gold}" opacity="0.6"/>`;
  return s + `</g>`;
}

function folder(x, y, w, h, color = C.gold2, rot = 0) {
  return `<g transform="translate(${x} ${y}) rotate(${rot})">
    <path d="M${-w / 2} ${-h / 2 + 12} L ${-w / 2} ${-h / 2} L ${-w / 2 + w * 0.32} ${-h / 2} L ${-w / 2 + w * 0.38} ${-h / 2 + 12} Z" fill="${color}"/>
    <rect x="${-w / 2}" y="${-h / 2 + 10}" width="${w}" height="${h - 10}" rx="5" fill="${color}"/>
    <rect x="${-w / 2 + 8}" y="${-h / 2 + 4}" width="${w - 16}" height="${h * 0.3}" rx="3" fill="#fff"/>
    <rect x="${-w / 2}" y="${-h / 2 + 22}" width="${w}" height="${h - 22}" rx="5" fill="${color}" />
    <rect x="${-w / 2}" y="${-h / 2 + 22}" width="${w}" height="${h - 22}" rx="5" fill="#000" opacity="0.07"/>
    <rect x="${w / 2 - w * 0.48}" y="${-h / 2 + 40}" width="${w * 0.34}" height="10" rx="3" fill="#fff" opacity="0.8"/></g>`;
}

function shield(cx, cy, s, opt = {}) {
  const d = `M${cx} ${cy - s} C ${cx + s * 0.45} ${cy - s * 0.78} ${cx + s * 0.72} ${cy - s * 0.8} ${cx + s * 0.82} ${cy - s * 0.82}
    C ${cx + s * 0.84} ${cy - s * 0.1} ${cx + s * 0.62} ${cy + s * 0.62} ${cx} ${cy + s}
    C ${cx - s * 0.62} ${cy + s * 0.62} ${cx - s * 0.84} ${cy - s * 0.1} ${cx - s * 0.82} ${cy - s * 0.82}
    C ${cx - s * 0.72} ${cy - s * 0.8} ${cx - s * 0.45} ${cy - s * 0.78} ${cx} ${cy - s} Z`;
  return `<g class="${opt.cls || ''}"><path class="shieldFill" d="${d}" fill="${opt.fill || 'url(#gGold)'}" opacity="${opt.fillOp ?? 1}"/>
    <path class="shieldLine draw" d="${d}" fill="none" stroke="${opt.stroke || C.goldD}" stroke-width="${opt.sw || 5}" stroke-linejoin="round"/>
    ${opt.check === false ? '' : `<path class="shieldCheck draw" d="M${cx - s * 0.32} ${cy + s * 0.02} L ${cx - s * 0.07} ${cy + s * 0.27} L ${cx + s * 0.36} ${cy - s * 0.24}" fill="none" stroke="${opt.checkColor || '#fff'}" stroke-width="${opt.csw || s * 0.12}" stroke-linecap="round" stroke-linejoin="round"/>`}</g>`;
}

/* ---------------- characters ---------------- */
// front-facing Saudi professional. origin at feet center. ~300 units tall.
function man(o = {}) {
  const { x = 0, y = 0, s = 1, bisht = false, shemagh = false, hold = null, pose = 'stand', skin = C.skin, id = '', cls = '', flip = false, beard = true } = o;
  const thobe = o.thobe || '#FFFFFF', thobeSh = o.thobeSh || '#E7E1D4';
  let g = `<g ${id ? `id="${id}"` : ''} class="char ${cls}"><g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">`;
  g += `<ellipse cx="0" cy="0" rx="52" ry="8" fill="#000" opacity="0.08"/>`;
  // shoes
  g += `<ellipse cx="-15" cy="-5" rx="13" ry="6" fill="${C.char}"/><ellipse cx="15" cy="-5" rx="13" ry="6" fill="${C.char}"/>`;
  // thobe body
  g += `<path d="M-37 -196 Q -40 -213 -24 -218 L 24 -218 Q 40 -213 37 -196 L 43 -10 Q 0 -4 -43 -10 Z" fill="${thobe}"/>`;
  g += `<path d="M12 -218 L 24 -218 Q 40 -213 37 -196 L 43 -10 Q 30 -7 18 -7 Z" fill="${thobeSh}"/>`;
  g += `<line x1="0" y1="-214" x2="0" y2="-150" stroke="${thobeSh}" stroke-width="2"/>`;
  g += `<circle cx="0" cy="-196" r="1.8" fill="${C.slate5}"/><circle cx="0" cy="-180" r="1.8" fill="${C.slate5}"/><circle cx="0" cy="-164" r="1.8" fill="${C.slate5}"/>`;
  // bisht
  if (bisht) {
    const bc = o.bishtColor || C.char;
    g += `<path d="M-24 -219 Q -46 -214 -50 -190 L -58 -12 L -27 -9 L -14 -205 Z" fill="${bc}"/>`;
    g += `<path d="M24 -219 Q 46 -214 50 -190 L 58 -12 L 27 -9 L 14 -205 Z" fill="${bc}"/>`;
    g += `<path d="M-14 -205 L -27 -9" stroke="${C.gold}" stroke-width="3.5" fill="none"/><path d="M14 -205 L 27 -9" stroke="${C.gold}" stroke-width="3.5" fill="none"/>`;
  }
  // arms
  const sleeve = bisht ? (o.bishtColor || C.char) : thobe;
  const sleeveSh = bisht ? '#000' : thobeSh;
  if (pose === 'desk') {
    g += `<path d="M-36 -205 Q -58 -170 -40 -128 L -10 -122 L -12 -136 L -30 -142 Q -36 -170 -24 -198 Z" fill="${sleeve}"/>`;
    g += `<path d="M36 -205 Q 58 -170 40 -128 L 10 -122 L 12 -136 L 30 -142 Q 36 -170 24 -198 Z" fill="${sleeve}"/>`;
    g += `<path d="M36 -205 Q 58 -170 40 -128 L 30 -130 Q 40 -170 28 -200 Z" fill="${sleeveSh}" opacity="0.15"/>`;
    g += `<ellipse cx="-8" cy="-128" rx="9" ry="7" fill="${skin}"/><ellipse cx="8" cy="-128" rx="9" ry="7" fill="${skin}"/>`;
  } else {
    g += `<path d="M-37 -204 Q -52 -160 -48 -110 L -36 -110 Q -36 -158 -27 -196 Z" fill="${sleeve}"/>`;
    g += `<circle cx="-42" cy="-105" r="7" fill="${skin}"/>`;
    if (hold) {
      g += `<path d="M37 -204 Q 54 -170 46 -146 L 10 -140 L 12 -152 L 36 -158 Q 36 -180 27 -196 Z" fill="${sleeve}"/>`;
      g += `<path d="M37 -204 Q 54 -170 46 -146 L 38 -146 Q 42 -176 30 -198 Z" fill="${sleeveSh}" opacity="0.12"/>`;
      if (hold === 'doc') g += `<g transform="rotate(-8 -6 -160)"><rect x="-30" y="-190" width="44" height="58" rx="3" fill="#fff" stroke="${C.beige3}" stroke-width="1.5"/><rect x="-24" y="-180" width="30" height="4" fill="${C.gold}"/><rect x="-24" y="-170" width="32" height="3" fill="${C.slate6}"/><rect x="-24" y="-162" width="26" height="3" fill="${C.slate6}"/><rect x="-24" y="-154" width="30" height="3" fill="${C.slate6}"/></g>`;
      if (hold === 'tablet') g += `<g transform="rotate(-6 -6 -160)"><rect x="-32" y="-188" width="48" height="62" rx="5" fill="${C.slate}"/><rect x="-28" y="-184" width="40" height="54" rx="2" fill="${C.slate5}"/><rect x="-24" y="-176" width="20" height="4" fill="${C.gold}"/></g>`;
      if (hold === 'folder') g += `<g transform="rotate(-6 -6 -160)"><rect x="-32" y="-190" width="48" height="60" rx="4" fill="${C.gold2}"/><rect x="-32" y="-180" width="48" height="50" rx="4" fill="${C.gold}"/></g>`;
      g += `<circle cx="8" cy="-146" r="7" fill="${skin}"/>`;
    } else {
      g += `<path d="M37 -204 Q 52 -160 48 -110 L 36 -110 Q 36 -158 27 -196 Z" fill="${sleeve}"/>`;
      g += `<circle cx="42" cy="-105" r="7" fill="${skin}"/>`;
    }
  }
  // neck + head
  g += `<g class="head">`;
  g += `<rect x="-8" y="-232" width="16" height="16" fill="${C.skin2}"/>`;
  g += `<ellipse cx="0" cy="-248" rx="19" ry="23" fill="${skin}"/>`;
  if (beard) {
    g += `<path d="M-19 -250 Q -19 -227 0 -223 Q 19 -227 19 -250 Q 15 -238 6 -237 Q 0 -240 -6 -237 Q -15 -238 -19 -250 Z" fill="${C.beard}"/>`;
    g += `<path d="M-8 -238 Q 0 -242 8 -238" stroke="${C.beard}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  }
  g += `<path d="M-11 -258 L -4 -257" stroke="${C.beard}" stroke-width="2.2" stroke-linecap="round"/><path d="M4 -257 L 11 -258" stroke="${C.beard}" stroke-width="2.2" stroke-linecap="round"/>`;
  g += `<ellipse cx="-7.5" cy="-251" rx="2.2" ry="1.6" fill="${C.char}"/><ellipse cx="7.5" cy="-251" rx="2.2" ry="1.6" fill="${C.char}"/>`;
  g += `<path d="M0 -251 L -2 -243 L 1 -243" stroke="${C.skin2}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  // ghutra / shemagh
  const gf = shemagh ? 'url(#pShemagh)' : '#FFFFFF';
  g += `<path d="M0 -282 C 28 -282 31 -262 28 -246 L 34 -214 Q 40 -196 46 -184 L 30 -178 Q 22 -196 20 -226 Q 21 -262 0 -266 Q -21 -262 -20 -226 Q -22 -196 -30 -178 L -46 -184 Q -40 -196 -34 -214 L -28 -246 C -31 -262 -28 -282 0 -282 Z" fill="${gf}"/>`;
  g += `<path d="M20 -226 Q 22 -196 30 -178 L 46 -184 Q 40 -196 34 -214 L 28 -246 Q 26 -236 20 -226 Z" fill="#000" opacity="0.07"/>`;
  g += `<path d="M-25 -266 Q 0 -277 25 -266" stroke="${C.agal}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  g += `<path d="M-24 -260 Q 0 -270 24 -260" stroke="${C.agal}" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.9"/>`;
  g += `</g>`;
  return g + `</g></g>`;
}

function woman(o = {}) {
  const { x = 0, y = 0, s = 1, hold = null, skin = '#D2A585', id = '', cls = '' } = o;
  const ab = '#2B2927', ab2 = '#3A3733';
  let g = `<g ${id ? `id="${id}"` : ''} class="char ${cls}"><g transform="translate(${x} ${y}) scale(${s})">`;
  g += `<ellipse cx="0" cy="0" rx="50" ry="8" fill="#000" opacity="0.08"/>`;
  g += `<path d="M-33 -196 Q -36 -212 -20 -216 L 20 -216 Q 36 -212 33 -196 L 46 -6 Q 0 0 -46 -6 Z" fill="${ab}"/>`;
  g += `<path d="M10 -216 L 20 -216 Q 36 -212 33 -196 L 46 -6 Q 34 -3 22 -3 Z" fill="${ab2}"/>`;
  g += `<path d="M-6 -210 L -10 -6" stroke="${C.gold}" stroke-width="2" opacity="0.7"/>`;
  g += `<path d="M-33 -202 Q -48 -160 -44 -110 L -32 -110 Q -32 -158 -24 -196 Z" fill="${ab}"/><circle cx="-38" cy="-105" r="6.5" fill="${skin}"/>`;
  if (hold) {
    g += `<path d="M33 -202 Q 50 -170 42 -146 L 8 -140 L 10 -152 L 32 -158 Q 32 -180 24 -196 Z" fill="${ab2}"/>`;
    if (hold === 'tablet') g += `<g transform="rotate(-6 -6 -160)"><rect x="-32" y="-188" width="48" height="62" rx="5" fill="${C.slate}"/><rect x="-28" y="-184" width="40" height="54" rx="2" fill="${C.slate5}"/><rect x="-24" y="-176" width="20" height="4" fill="${C.gold}"/></g>`;
    else g += `<g transform="rotate(-8 -6 -160)"><rect x="-30" y="-190" width="44" height="58" rx="3" fill="#fff" stroke="${C.beige3}" stroke-width="1.5"/><rect x="-24" y="-180" width="30" height="4" fill="${C.gold}"/><rect x="-24" y="-170" width="32" height="3" fill="${C.slate6}"/><rect x="-24" y="-162" width="26" height="3" fill="${C.slate6}"/></g>`;
    g += `<circle cx="6" cy="-146" r="6.5" fill="${skin}"/>`;
  } else {
    g += `<path d="M33 -202 Q 48 -160 44 -110 L 32 -110 Q 32 -158 24 -196 Z" fill="${ab}"/><circle cx="38" cy="-105" r="6.5" fill="${skin}"/>`;
  }
  g += `<g class="head">`;
  g += `<path d="M0 -284 C 30 -284 34 -258 30 -238 Q 28 -220 34 -206 L -34 -206 Q -28 -220 -30 -238 C -34 -258 -30 -284 0 -284 Z" fill="${ab}"/>`;
  g += `<ellipse cx="0" cy="-246" rx="16.5" ry="20" fill="${skin}"/>`;
  g += `<path d="M-17 -252 Q -14 -268 0 -269 Q 14 -268 17 -252 Q 10 -262 0 -262 Q -10 -262 -17 -252 Z" fill="${ab}"/>`;
  g += `<path d="M-10 -253 L -4 -252" stroke="#3A2F29" stroke-width="2" stroke-linecap="round"/><path d="M4 -252 L 10 -253" stroke="#3A2F29" stroke-width="2" stroke-linecap="round"/>`;
  g += `<ellipse cx="-6.5" cy="-247" rx="2" ry="1.5" fill="${C.char}"/><ellipse cx="6.5" cy="-247" rx="2" ry="1.5" fill="${C.char}"/>`;
  g += `<path d="M-4 -235 Q 0 -233 4 -235" stroke="#9A6450" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
  g += `</g>`;
  return g + `</g></g>`;
}

/* ---------------- icons (64x64, stroke) ---------------- */
const ICON = {
  book: `<path d="M32 18 C 24 12 14 12 6 14 L 6 50 C 14 48 24 48 32 54 C 40 48 50 48 58 50 L 58 14 C 50 12 40 12 32 18 Z"/><path d="M32 18 L 32 54"/>`,
  handshake: `<path d="M4 26 L 14 20 L 24 24"/><path d="M60 26 L 50 20 L 36 22 L 26 30 Q 24 34 28 35 L 36 30"/><path d="M14 20 L 14 40 L 26 50 Q 29 52 31 49 L 30 47 L 34 50 Q 37 51 38 48 L 37 46 L 41 48 Q 44 48 44 45 L 43 43 Q 47 44 47 40 L 50 38 L 50 20"/><path d="M4 26 L 4 40 L 14 40"/><path d="M60 26 L 60 40 L 50 38"/>`,
  growth: `<path d="M32 56 L 32 30"/><path d="M32 36 C 32 24 22 16 10 16 C 10 28 20 36 32 36 Z"/><path d="M32 30 C 32 18 42 10 54 10 C 54 22 44 30 32 30 Z"/><path d="M18 56 L 46 56"/>`,
  chat: `<path d="M6 14 L 40 14 L 40 36 L 20 36 L 12 44 L 12 36 L 6 36 Z"/><path d="M46 24 L 58 24 L 58 46 L 52 46 L 52 54 L 44 46 L 28 46 L 28 42"/>`,
  contract: `<path d="M12 6 L 40 6 L 50 16 L 50 58 L 12 58 Z"/><path d="M40 6 L 40 16 L 50 16"/><path d="M20 26 L 42 26 M20 34 L 42 34 M20 42 L 32 42"/><path d="M34 52 Q 40 44 44 50 T 54 46"/>`,
  scale: `<path d="M32 8 L 32 54 M20 56 L 44 56 M10 18 L 54 18"/><path d="M10 18 L 4 36 Q 10 42 16 36 Z"/><path d="M54 18 L 48 36 Q 54 42 60 36 Z"/>`,
  balance: `<path d="M8 32 L 24 18 L 32 26 L 40 18 L 56 32"/><path d="M8 32 L 24 46 L 32 38 L 40 46 L 56 32"/><circle cx="32" cy="32" r="4"/>`,
  governance: `<path d="M8 22 L 32 8 L 56 22 Z"/><path d="M14 24 L 14 48 M26 24 L 26 48 M38 24 L 38 48 M50 24 L 50 48"/><path d="M8 52 L 56 52 M6 58 L 58 58"/>`,
  shield: `<path d="M32 6 C 40 10 48 11 54 11 C 54 32 48 48 32 58 C 16 48 10 32 10 11 C 16 11 24 10 32 6 Z"/><path d="M22 32 L 29 39 L 43 25"/>`,
  growthChart: `<path d="M8 56 L 56 56"/><path d="M14 56 L 14 40 L 22 40 L 22 56 M28 56 L 28 32 L 36 32 L 36 56 M42 56 L 42 22 L 50 22 L 50 56"/><path d="M10 30 L 24 20 L 34 24 L 54 8 M44 8 L 54 8 L 54 18"/>`,
  collection: `<rect x="8" y="14" width="34" height="42" rx="3"/><path d="M15 24 L 34 24 M15 32 L 34 32 M15 40 L 26 40"/><circle cx="46" cy="44" r="12"/><path d="M41 44 L 45 48 L 52 40"/>`,
  search: `<circle cx="27" cy="27" r="16"/><path d="M39 39 L 56 56"/><path d="M20 27 Q 20 20 27 20"/>`,
  clipboard: `<rect x="12" y="10" width="40" height="48" rx="4"/><rect x="22" y="6" width="20" height="10" rx="3"/><path d="M22 34 L 29 41 L 43 27"/>`,
  bulb: `<path d="M32 6 C 20 6 13 15 13 25 C 13 33 18 38 22 42 L 22 48 L 42 48 L 42 42 C 46 38 51 33 51 25 C 51 15 44 6 32 6 Z"/><path d="M24 54 L 40 54 M27 59 L 37 59"/><path d="M32 48 L 32 32 L 26 26 M32 32 L 38 26"/>`,
  execute: `<circle cx="32" cy="32" r="22"/><path d="M22 32 L 29 39 L 43 25"/><path d="M54 14 L 54 4 M54 14 L 44 14" /><path d="M32 10 A 22 22 0 0 1 52 18"/>`,
  building: `<rect x="14" y="8" width="26" height="50"/><rect x="40" y="24" width="12" height="34"/><path d="M20 16 L 24 16 M30 16 L 34 16 M20 26 L 24 26 M30 26 L 34 26 M20 36 L 24 36 M30 36 L 34 36 M24 58 L 24 48 L 30 48 L 30 58"/>`,
  investor: `<circle cx="22" cy="18" r="8"/><path d="M8 50 Q 8 30 22 30 Q 36 30 36 50"/><path d="M38 52 L 38 40 M46 52 L 46 32 M54 52 L 54 22"/>`,
  gov: `<path d="M6 24 L 32 10 L 58 24 Z"/><path d="M12 28 L 12 50 M24 28 L 24 50 M40 28 L 40 50 M52 28 L 52 50"/><path d="M6 54 L 58 54"/>`,
  heart: `<path d="M32 54 C 10 40 6 28 10 20 C 14 12 26 10 32 20 C 38 10 50 12 54 20 C 58 28 54 40 32 54 Z"/>`,
  globe: `<circle cx="32" cy="32" r="24"/><path d="M8 32 L 56 32 M32 8 C 20 20 20 44 32 56 C 44 44 44 20 32 8"/>`,
  phone: `<path d="M18 8 L 26 8 L 30 20 L 24 24 C 27 32 32 37 40 40 L 44 34 L 56 38 L 56 46 C 56 52 52 56 46 56 C 24 54 10 40 8 18 C 8 12 12 8 18 8 Z"/>`
};
function icon(name, cx, cy, size, color, sw = 3.2, cls = '') {
  const k = size / 64;
  return `<g class="icon ${cls}" transform="translate(${r1(cx - size / 2)} ${r1(cy - size / 2)}) scale(${k})" fill="none" stroke="${color}" stroke-width="${sw / k * (size / 64) * (64 / size)}" stroke-linecap="round" stroke-linejoin="round">${ICON[name]}</g>`;
}
