// MIYAAR LEGAL — Corporate profile film. Deterministic timeline: window.renderAt(t)
const STAGE = document.getElementById('stage');
const DUR = 63.0;
const tl = gsap.timeline({ paused: true });
const updaters = [];

/* ---------- helpers ---------- */
function scene(id) {
  const d = document.createElement('div');
  d.className = 'scene'; d.id = id;
  STAGE.appendChild(d);
  return d;
}
function svg(parent, inner, cls = '') {
  parent.insertAdjacentHTML('beforeend', `<svg class="art ${cls}" viewBox="0 0 1920 1080" width="1920" height="1080">${inner}</svg>`);
  return parent.lastElementChild;
}
function text(parent, html, st, cls = '') {
  const d = document.createElement('div');
  d.className = 'tx ' + cls;
  d.innerHTML = html;
  Object.assign(d.style, st);
  parent.appendChild(d);
  return d;
}
function splitWords(el) {
  const walk = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const parts = n.textContent.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach((p) => {
          if (!p) return;
          if (/^\s+$/.test(p)) frag.appendChild(document.createTextNode(p));
          else { const s = document.createElement('span'); s.className = 'w'; s.textContent = p; frag.appendChild(s); }
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && !n.classList.contains('nosplit')) walk(n);
      else if (n.nodeType === 1) n.classList.add('w');
    });
  };
  walk(el);
  return el.querySelectorAll('.w');
}
function wordsIn(el, t, o = {}) {
  const ws = splitWords(el);
  tl.fromTo(ws, { opacity: 0, y: o.y ?? 26, filter: 'blur(9px)' },
    { opacity: 1, y: 0, filter: 'blur(0px)', duration: o.d ?? 0.75, stagger: o.stagger ?? 0.08, ease: 'power3.out' }, t);
  return ws;
}
function fadeIn(el, t, d = 0.6, from = {}) {
  tl.fromTo(el, { autoAlpha: 0, ...from }, { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: d, ease: 'power2.out' }, t);
}
function fadeOut(el, t, d = 0.45, to = {}) { tl.to(el, { autoAlpha: 0, duration: d, ease: 'power2.in', ...to }, t); }
function prepDraw(root, sel = '.draw') {
  const els = typeof sel === 'string' ? root.querySelectorAll(sel) : sel;
  els.forEach((p) => {
    const L = p.getTotalLength ? p.getTotalLength() : 1000;
    p.style.strokeDasharray = `${L + 2} ${L + 2}`;
    p.style.strokeDashoffset = L + 2;
    p.dataset.len = L + 2;
  });
  return els;
}
function drawIn(els, t, d = 1, stagger = 0, ease = 'power2.inOut') {
  tl.to(els, { strokeDashoffset: 0, duration: d, stagger, ease }, t);
}
function sceneIn(el, t, d = 0.6) { tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: d, ease: 'power1.out' }, t); }
function sceneOut(el, t, d = 0.55) { tl.to(el, { autoAlpha: 0, duration: d, ease: 'power1.in' }, t); }
const $ = (root, q) => root.querySelector(q);
const $$ = (root, q) => [...root.querySelectorAll(q)];
function damp(t, t0, a0, k = 2.2, w = 5) { if (t < t0) return a0; const u = t - t0; return a0 * Math.exp(-k * u) * Math.cos(w * u); }

document.body.insertAdjacentHTML('afterbegin', globalDefs());

/* =========================================================
   SCENE 1 — Riyadh: the world of law & business (0 – 6.3)
   ========================================================= */
(function s1() {
  const sc = scene('s1');
  // far skyline
  let far = '';
  const farT = [[20, 90, 170], [100, 70, 230], [170, 110, 150], [290, 80, 260], [370, 120, 190], [520, 90, 280], [610, 70, 210], [690, 100, 160], [870, 80, 240], [950, 110, 200], [1270, 90, 270], [1360, 120, 180], [1500, 80, 220], [1580, 110, 300], [1690, 90, 200], [1780, 140, 250]];
  farT.forEach(([x, w, h], i) => { far += tower({ x, base: 800, w, h, fill: i % 2 ? '#E2D5BA' : '#DDCFB2', shade: '#D4C4A3', top: i % 5 === 2 ? 'step' : 'flat' }); });
  // mid skyline
  let mid = '';
  const midT = [[110, 120, 250, C.slate5, C.slate4, 'flat'], [250, 100, 330, C.slate4, C.slate3, 'step'], [380, 130, 210, C.slate6, C.slate5, 'flat'], [540, 110, 290, C.slate5, C.slate4, 'slant'],
    [920, 100, 250, C.slate5, C.slate4, 'flat'], [1270, 120, 300, C.slate5, C.slate4, 'step'], [1410, 100, 220, C.slate6, C.slate5, 'flat'], [1640, 130, 270, C.slate4, C.slate3, 'crown'], [1790, 110, 190, C.slate5, C.slate4, 'flat']];
  midT.forEach(([x, w, h, f, s, top]) => { mid += tower({ x, base: 800, w, h, fill: f, shade: s, win: '#fff', winOp: 0.28, cols: 3, top }); });
  mid += faisaliah(760, 800, 132, 440, C.slate3, C.slate2);
  mid += kingdomCentre(1130, 800, 176, 540, C.slate, C.slate2);
  // palms
  const palm = (x, b, h, c) => `<g><path d="M${x} ${b} Q ${x + 6} ${b - h * 0.5} ${x + 2} ${b - h}" stroke="${c}" stroke-width="7" fill="none"/>
    ${[-150, -115, -70, -30, 10, 40].map((a) => `<path d="M${x + 2} ${b - h} q ${Math.cos(a * Math.PI / 180) * 34} ${Math.sin(a * Math.PI / 180) * 34 - 8} ${Math.cos(a * Math.PI / 180) * 62} ${Math.sin(a * Math.PI / 180) * 62 + 14}" stroke="${c}" stroke-width="7" fill="none" stroke-linecap="round"/>`).join('')}</g>`;
  mid += palm(480, 812, 120, C.slate3) + palm(1000, 815, 110, C.slate3) + palm(1500, 812, 130, C.slate3) + palm(1880, 815, 110, C.slate3);
  // flag + pole
  const flagG = `<g id="s1flagwrap"><rect x="1553" y="420" width="6" height="400" fill="${C.slate}"/><circle cx="1556" cy="417" r="7" fill="${C.gold}"/>${flag('s1flag', 1559, 428, 0.86)}</g>`;
  // foreground ledge + books + scale
  let fore = `<path d="M-40 958 L 1960 958 L 1960 1120 L -40 1120 Z" fill="url(#gDesk)"/><rect x="-40" y="952" width="2000" height="8" fill="${C.beige3}"/><rect x="-40" y="952" width="2000" height="2" fill="${C.gold}" opacity="0.6"/>`;
  let books = '';
  const lying = [[1240, 918, 400, 36, C.slate], [1262, 882, 360, 36, C.char2], [1250, 846, 380, 36, C.beige4]];
  lying.forEach(([x, y, w, h, c], i) => { books += `<g class="bk">${bookLying(x, y, w, h, c)}</g>`; });
  const stand = [[1660, 954, 46, 230, C.slate], [1708, 954, 40, 210, C.goldD], [1750, 954, 50, 244, C.char2], [1802, 954, 42, 200, C.slate3]];
  stand.forEach(([x, b, w, h, c]) => { books += `<g class="bk">${bookStanding(x, b, w, h, c)}</g>`; });
  fore += books + justiceScale('s1scale', 390, 954, 430);
  svg(sc, `
    <g class="cam">
      <rect width="1920" height="1080" fill="url(#gSky)"/>
      <rect width="1920" height="800" fill="url(#pNajdi)" opacity="0.05"/>
      <circle cx="1240" cy="600" r="520" fill="url(#gSun)"/>
      <g class="far">${far}</g>
      <rect x="0" y="790" width="1920" height="300" fill="url(#gGround)"/>
      <g class="mid">${mid}${flagG}</g>
      <rect x="0" y="799" width="1920" height="2" fill="${C.gold}" opacity="0.45"/>
      <g class="fore">${fore}</g>
    </g>`);
  const head = text(sc, `في عالم الأعمال... <span class="gold">الثقة تصنع الفارق</span>`, { left: '0px', top: '96px', width: '1920px', textAlign: 'center', fontSize: '76px' }, 'h-display');

  // timeline
  const cam = $(sc, '.cam');
  tl.fromTo(cam, { scale: 1.0, svgOrigin: '960 600' }, { scale: 1.075, duration: 6.4, ease: 'sine.inOut' }, 0);
  tl.fromTo($(sc, '.far'), { x: 0 }, { x: -14, duration: 6.4, ease: 'none' }, 0);
  tl.fromTo($(sc, '.mid'), { x: 0 }, { x: -32, duration: 6.4, ease: 'none' }, 0);
  tl.fromTo($(sc, '.fore'), { x: 0, y: 0 }, { x: -70, y: -6, duration: 6.4, ease: 'none' }, 0);
  tl.fromTo($$(sc, '.far > g'), { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.3, stagger: 0.03, ease: 'power3.out' }, 0.0);
  tl.fromTo($$(sc, '.mid > g'), { y: 90, opacity: 0 }, { y: 0, opacity: 1, duration: 1.4, stagger: 0.04, ease: 'power3.out' }, 0.15);
  tl.fromTo($$(sc, '.bk'), { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, stagger: 0.14, ease: 'back.out(1.6)' }, 0.9);
  const scaleEl = $(sc, '#s1scale');
  const dr = prepDraw(scaleEl);
  drawIn(dr, 1.3, 1.5, 0.05);
  tl.fromTo($$(scaleEl, '.fillme'), { fillOpacity: 0 }, { fillOpacity: 1, duration: 0.8, ease: 'power1.out' }, 2.5);
  updaters.push((t) => { tiltScale(scaleEl, 9 * Math.exp(-0.9 * Math.max(0, t - 2.0)) * Math.cos(2.6 * Math.max(0, t - 2.0)) * (t < 2 ? 1 : 1)); });
  const fl = $(sc, '#s1flag');
  updaters.push((t) => { if (t < 7) waveFlag(fl, t, 6); });
  wordsIn(head, 0.55, { stagger: 0.12, d: 0.9 });
  fadeOut(head, 4.3, 0.5, { y: -16 });
  sceneOut(sc, 6.1, 0.5);
})();

/* =========================================================
   BRAND LAYER — gold line → logo, carried into scene 2
   ========================================================= */
(function brand() {
  const b = scene('brand');
  b.style.zIndex = 50;
  b.innerHTML = `<div class="veil"></div>
    <svg class="art" viewBox="0 0 1920 1080"><line id="bline" x1="160" y1="540" x2="1760" y2="540" stroke="url(#gGold)" stroke-width="3"/></svg>
    <img id="blogo" src="assets/logo.png" style="position:absolute;left:470px;top:392px;width:980px;height:auto">`;
  const veil = $(b, '.veil'), line = $(b, '#bline'), logo = $(b, '#blogo');
  tl.set(b, { autoAlpha: 1 }, 0);
  tl.fromTo(veil, { opacity: 1 }, { opacity: 0, duration: 1.3, ease: 'power2.out' }, 0);
  prepDraw(b, [line]);
  tl.set(logo, { autoAlpha: 0 }, 0);
  tl.to(veil, { opacity: 0.94, duration: 0.8, ease: 'power2.inOut' }, 4.4);
  drawIn([line], 4.45, 0.75, 0, 'power3.inOut');
  tl.to(line, { attr: { x1: 960, x2: 960 }, duration: 0.55, ease: 'power3.in' }, 5.15);
  tl.fromTo(logo, { autoAlpha: 0, scale: 0.92, filter: 'blur(10px)' }, { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' }, 5.35);
  tl.to(line, { opacity: 0, duration: 0.1 }, 5.7);
  // carry to scene-2 header
  tl.to(logo, { y: -392, scale: 0.5, duration: 0.95, ease: 'power3.inOut' }, 6.35);
  tl.to(veil, { opacity: 0, duration: 0.7, ease: 'power1.inOut' }, 6.45);
  tl.to(logo, { autoAlpha: 0, duration: 0.5 }, 12.25);
})();

/* =========================================================
   SCENE 2 — Who we are (6.2 – 12.7)
   ========================================================= */
(function s2() {
  const sc = scene('s2');
  let bld = '';
  const B = [[120, 150, 300, C.slate4, C.slate3, 'flat'], [290, 130, 380, C.slate, C.slate2, 'step'], [440, 170, 260, C.beige3, C.beige4, 'flat'], [630, 120, 330, C.slate3, C.slate2, 'crown'],
    [770, 150, 230, C.slate5, C.slate4, 'flat'], [1000, 140, 270, C.beige3, C.beige4, 'step'], [1160, 120, 400, C.slate, C.slate2, 'spire'], [1300, 160, 300, C.slate4, C.slate3, 'flat'],
    [1480, 130, 350, C.slate3, C.slate2, 'slant'], [1630, 170, 250, C.beige3, C.beige4, 'flat']];
  B.forEach(([x, w, h, f, s, top]) => { bld += tower({ x, base: 990, w, h, fill: f, shade: s, win: f === C.beige3 ? '#fff' : C.gold3, winOp: f === C.beige3 ? 0.6 : 0.45, cols: 3, top, cls: 's2b' }); });
  // network lines between building tops
  const tops = B.map(([x, w, h]) => [x + w / 2, 990 - h - 14]);
  let net = '';
  for (let i = 0; i < tops.length - 1; i++) {
    const [x1, y1] = tops[i], [x2, y2] = tops[i + 1];
    const my = Math.min(y1, y2) - 60;
    net += `<path class="net" d="M${x1} ${y1} Q ${(x1 + x2) / 2} ${my} ${x2} ${y2}" stroke="${C.gold}" stroke-width="2.5" fill="none"/>`;
  }
  net += `<path class="net" d="M${tops[1][0]} ${tops[1][1]} Q 960 520 ${tops[6][0]} ${tops[6][1]}" stroke="${C.gold}" stroke-width="2" fill="none" opacity="0.7"/>`;
  net += `<path class="net" d="M${tops[3][0]} ${tops[3][1]} Q 1150 540 ${tops[8][0]} ${tops[8][1]}" stroke="${C.gold}" stroke-width="2" fill="none" opacity="0.7"/>`;
  const nodes = tops.map(([x, y]) => `<g class="node"><circle cx="${x}" cy="${y}" r="11" fill="${C.ivory}" stroke="${C.gold}" stroke-width="3"/><circle cx="${x}" cy="${y}" r="4.5" fill="${C.gold}"/></g>`).join('');
  const people = man({ x: 300, y: 1052, s: 0.92, shemagh: true, hold: 'folder', cls: 'p' }) + woman({ x: 520, y: 1056, s: 0.9, hold: 'tablet', cls: 'p' }) +
    man({ x: 1420, y: 1054, s: 0.94, bisht: true, hold: 'doc', cls: 'p' }) + man({ x: 1640, y: 1052, s: 0.92, cls: 'p' });
  svg(sc, `<g class="cam">
    <rect width="1920" height="1080" fill="${C.ivory}"/>
    <rect width="1920" height="1080" fill="url(#pGrid)" opacity="0.045"/>
    <rect x="0" y="990" width="1920" height="90" fill="${C.beige}"/>
    <rect x="0" y="989" width="1920" height="2.5" fill="${C.gold}"/>
    <g class="blds">${bld}</g>
    <g class="netw">${net}${nodes}</g>
    <g class="ppl">${people}</g></g>`);
  const name = text(sc, 'معيار ليجل', { left: '0', top: '238px', width: '1920px', textAlign: 'center', fontSize: '104px' }, 'h-display');
  const sub = text(sc, 'للمحاماة والاستشارات القانونية', { left: '0', top: '372px', width: '1920px', textAlign: 'center', fontSize: '46px', color: C.slate }, 'h-body');
  const pill = text(sc, 'شريك قانوني برؤية استباقية', { left: '660px', top: '458px', width: '600px', textAlign: 'center', fontSize: '38px' }, 'pill');

  sceneIn(sc, 6.15, 0.5);
  $$(sc, '.s2b').forEach((g, i) => {
    tl.fromTo(g, { scaleY: 0, transformOrigin: '50% 100%' }, { scaleY: 1, duration: 0.9, ease: 'power3.out' }, 6.35 + [3, 1, 6, 0, 8, 5, 2, 9, 4, 7][i] * 0.09);
  });
  const nets = prepDraw(sc, '.net');
  drawIn(nets, 8.2, 1.1, 0.1);
  tl.fromTo($$(sc, '.node'), { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.45, stagger: 0.08, ease: 'back.out(2.2)' }, 8.1);
  tl.fromTo($$(sc, '.p'), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out' }, 7.3);
  wordsIn(name, 6.75, { stagger: 0.15, d: 0.9 });
  wordsIn(sub, 7.25, { stagger: 0.09 });
  fadeIn(pill, 9.75, 0.6, { y: 18, scale: 0.96 });
  tl.fromTo($(sc, '.cam'), { scale: 1.0, svgOrigin: '960 990' }, { scale: 1.04, duration: 6.6, ease: 'sine.inOut' }, 6.2);
  sceneOut(sc, 12.25, 0.55);
})();

/* =========================================================
   SCENE 3 — Vision, values & philosophy (12.7 – 22.8)
   ========================================================= */
(function s3() {
  const sc = scene('s3');
  const vals = [['الخبرة', 'book', 1440], ['الثقة', 'handshake', 960], ['الاستدامة', 'growth', 480]];
  let circles = '';
  vals.forEach(([lab, ic, cx], i) => {
    const cy = 520, r = 165, R = 198;
    circles += `<g class="vc" id="vc${i}">
      <circle cx="${cx}" cy="${cy + 10}" r="${r}" fill="#000" opacity="0.05"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff"/>
      <circle class="ring draw" cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${C.gold}" stroke-width="3.5" transform="rotate(-90 ${cx} ${cy})"/>
      <circle cx="${cx}" cy="${cy}" r="${r - 16}" fill="none" stroke="${C.gold3}" stroke-width="1.2"/>
      <g class="arrows" data-cx="${cx}" data-cy="${cy}">
        <path d="M${cx + R} ${cy} A ${R} ${R} 0 0 1 ${cx + R * Math.cos(1.9)} ${cy + R * Math.sin(1.9)}" stroke="${C.gold2}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M${cx + R * Math.cos(1.9) + 10} ${cy + R * Math.sin(1.9) + 9} L ${cx + R * Math.cos(1.9)} ${cy + R * Math.sin(1.9)} L ${cx + R * Math.cos(1.9) + 14} ${cy + R * Math.sin(1.9) - 6}" stroke="${C.gold2}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R * Math.cos(1.9 + Math.PI)} ${cy + R * Math.sin(1.9 + Math.PI)}" stroke="${C.gold2}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M${cx + R * Math.cos(1.9 + Math.PI) - 10} ${cy + R * Math.sin(1.9 + Math.PI) - 9} L ${cx + R * Math.cos(1.9 + Math.PI)} ${cy + R * Math.sin(1.9 + Math.PI)} L ${cx + R * Math.cos(1.9 + Math.PI) - 14} ${cy + R * Math.sin(1.9 + Math.PI) + 6}" stroke="${C.gold2}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      ${icon(ic, cx, cy - 46, 96, C.slate, 3.4)}
      <text x="${cx}" y="${cy + 78}" text-anchor="middle" class="svgH" font-size="54" fill="${C.char}">${lab}</text>
    </g>`;
  });
  const dots = [[1200, 520], [720, 520]].map(([x, y]) => `<g class="cdots">${[-24, 0, 24].map((d) => `<circle cx="${x + d}" cy="${y}" r="4" fill="${C.gold}"/>`).join('')}</g>`).join('');
  // phase 2: balanced scale with building and law books
  const sc2 = justiceScale('s3scale', 960, 880, 560, { beamW: 620 });
  svg(sc, `<rect width="1920" height="1080" fill="${C.ivory}"/>
    <rect width="1920" height="1080" fill="url(#pNajdi)" opacity="0.045"/>
    <g class="ph1">${dots}${circles}</g>
    <g class="ph2">
      <circle cx="960" cy="560" r="330" fill="${C.beige}" opacity="0.55"/>
      <circle class="draw" cx="960" cy="560" r="350" fill="none" stroke="${C.gold3}" stroke-width="1.5"/>
      <g class="links">
        <path class="lk" d="M1300 470 L 1440 470" stroke="${C.gold}" stroke-width="2" stroke-dasharray="0"/>
        <path class="lk" d="M620 470 L 480 470" stroke="${C.gold}" stroke-width="2"/>
        <path class="lk" d="M960 905 L 960 935" stroke="${C.gold}" stroke-width="2"/>
      </g>
      ${sc2}
    </g>`);
  // pan loads
  const scaleEl = $(sc, '#s3scale');
  const chain = 560 * 0.36;
  $(scaleEl, '.panL .panload').innerHTML = `<g class="load">${tower({ x: -40, base: chain - 2, w: 80, h: 128, fill: C.slate, shade: C.slate2, win: C.gold3, winOp: 0.6, cols: 2, rows: 5, top: 'step' })}</g>`;
  $(scaleEl, '.panR .panload').innerHTML = `<g class="load">${bookLying(-62, chain - 30, 124, 28, C.slate)}${bookLying(-56, chain - 56, 112, 26, C.goldD)}${bookLying(-60, chain - 82, 120, 26, C.char2)}</g>`;

  const lab = text(sc, '<span class="rule"></span>رؤيتنا وقيمنا<span class="rule"></span>', { left: 0, top: '120px', width: '1920px', textAlign: 'center', fontSize: '36px' }, 'kicker');
  const p1 = text(sc, 'الدقة القانونية', { left: '1450px', top: '432px', width: '380px', textAlign: 'center', fontSize: '42px' }, 'pill');
  const p2 = text(sc, 'الحلول الاستباقية', { left: '90px', top: '432px', width: '390px', textAlign: 'center', fontSize: '42px' }, 'pill');
  const p3 = text(sc, 'فهم بيئة الأعمال', { left: '770px', top: '940px', width: '380px', textAlign: 'center', fontSize: '42px' }, 'pill');

  sceneIn(sc, 12.55, 0.5);
  wordsIn(lab, 12.8);
  const rings = prepDraw(sc, '.vc .ring');
  [0, 1, 2].forEach((i) => {
    const t0 = 13.0 + i * 0.6;
    const g = $(sc, '#vc' + i);
    tl.fromTo(g, { autoAlpha: 0, scale: 0.7, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.8, ease: 'back.out(1.4)' }, t0);
    drawIn([rings[i]], t0 + 0.1, 0.9);
    tl.fromTo($(g, 'text'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5 }, t0 + 0.3);
  });
  tl.fromTo($$(sc, '.cdots circle'), { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.3, stagger: 0.06 }, 14.4);
  updaters.push((t) => {
    $$(sc, '.arrows').forEach((a, i) => a.setAttribute('transform', `rotate(${(t * 24 + i * 40).toFixed(2)} ${a.dataset.cx} ${a.dataset.cy})`));
  });
  // transition to phase 2
  tl.to($(sc, '.ph1'), { y: -320, scale: 0.5, svgOrigin: '960 520', duration: 1.0, ease: 'power3.inOut' }, 16.9);
  tl.to($$(sc, '.vc text, .cdots'), { opacity: 0, duration: 0.4 }, 16.9);
  tl.to($(sc, '.ph1'), { autoAlpha: 0.0, duration: 0.6 }, 17.5);
  fadeOut(lab, 16.9, 0.4);
  const ph2 = $(sc, '.ph2');
  tl.set(ph2, { autoAlpha: 0 }, 0);
  tl.to(ph2, { autoAlpha: 1, duration: 0.4 }, 17.2);
  tl.fromTo($(ph2, 'circle'), { scale: 0.6, transformOrigin: '50% 50%', opacity: 0 }, { scale: 1, opacity: 0.55, duration: 0.9, ease: 'power3.out' }, 17.2);
  const d2 = prepDraw(sc, '.ph2 > .draw, #s3scale .draw');
  drawIn(d2, 17.3, 1.2, 0.03);
  tl.fromTo($$(scaleEl, '.fillme'), { fillOpacity: 0 }, { fillOpacity: 1, duration: 0.6 }, 18.2);
  tl.fromTo($$(scaleEl, '.load'), { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.25, ease: 'back.out(1.5)' }, 18.5);
  updaters.push((t) => { if (t > 17 && t < 23) tiltScale(scaleEl, t < 18.6 ? -8 : (-8 + 8 * (1 - Math.exp(-1.6 * (t - 18.6))) ) * 1 + 2.2 * Math.exp(-1.2 * (t - 18.6)) * Math.sin(3.2 * (t - 18.6))); });
  const lks = prepDraw(sc, '.lk');
  fadeIn(p1, 17.9, 0.6, { x: 30 }); drawIn([lks[0]], 17.9, 0.5);
  fadeIn(p2, 19.0, 0.6, { x: -30 }); drawIn([lks[1]], 19.0, 0.5);
  fadeIn(p3, 20.1, 0.6, { y: 24 }); drawIn([lks[2]], 20.1, 0.5);
  sceneOut(sc, 22.35, 0.5);
})();

/* =========================================================
   SCENE 4 — Legal services (22.75 – 33.3)
   ========================================================= */
const SVC = [
  ['الاستشارات القانونية المتخصصة', 'chat'],
  ['صياغة ومراجعة العقود والاتفاقيات', 'contract'],
  ['الترافع وإدارة المنازعات', 'scale'],
  ['التحكيم والوساطة وتسوية النزاعات', 'balance'],
  ['حوكمة الشركات والامتثال', 'governance'],
  ['الاستشارات المهنية وإدارة المخاطر القانونية', 'shield'],
  ['خدمات الشركات والاستثمار وإعادة الهيكلة', 'growthChart'],
  ['القضايا التجارية وتحصيل الأموال', 'collection']
];
(function s4() {
  const sc = scene('s4');
  const VX = 620, VY = 500, VR = 290;
  const ill = [];
  // 1 consultation
  ill[0] = `${man({ x: -122, y: 206, s: 1.12, pose: 'desk', shemagh: true })}${man({ x: 122, y: 206, s: 1.12, pose: 'desk', bisht: true })}
    <rect x="-250" y="62" width="500" height="22" rx="6" fill="${C.beige4}"/><rect x="-230" y="84" width="460" height="200" fill="${C.slate2}"/><rect x="-200" y="110" width="400" height="150" fill="none" stroke="${C.gold}" stroke-width="2" opacity="0.5"/><rect x="-230" y="84" width="460" height="6" fill="${C.gold}"/>
    ${doc(-10, 52, 90, 22, 0, { lines: 0 })}<rect x="-62" y="44" width="110" height="16" rx="2" fill="#fff" stroke="${C.beige3}"/><rect x="-50" y="48" width="70" height="3" fill="${C.slate6}"/>
    <g class="bub"><rect x="-196" y="-232" width="96" height="58" rx="14" fill="${C.gold}"/><path d="M-150 -174 L -146 -152 L -128 -174 Z" fill="${C.gold}"/><rect x="-180" y="-212" width="64" height="5" rx="2" fill="#fff"/><rect x="-180" y="-200" width="44" height="5" rx="2" fill="#fff"/></g>
    <g class="bub"><rect x="100" y="-214" width="96" height="58" rx="14" fill="${C.slate}"/><path d="M150 -156 L 146 -134 L 128 -156 Z" fill="${C.slate}"/><rect x="116" y="-194" width="64" height="5" rx="2" fill="#fff"/><rect x="116" y="-182" width="44" height="5" rx="2" fill="#fff"/></g>`;
  // 2 contracts
  ill[1] = `${doc(-10, 0, 300, 400, -4, { seal: true, lines: 12 })}
    <path class="sig" d="M-40 150 C -30 118 -10 118 -14 140 C -18 162 6 160 14 132 C 20 116 30 150 46 140 C 58 132 66 122 92 138" stroke="${C.slate}" stroke-width="4" fill="none" stroke-linecap="round" transform="rotate(-4)"/>
    <line x1="-60" y1="168" x2="120" y2="168" stroke="${C.gold}" stroke-width="2" transform="rotate(-4)"/>
    <g class="pen"><g transform="rotate(-38)"><rect x="-8" y="-150" width="16" height="140" rx="7" fill="url(#gGold)"/><rect x="-8" y="-150" width="16" height="30" rx="7" fill="${C.char}"/><path d="M-8 -12 L 0 10 L 8 -12 Z" fill="${C.goldD}"/></g></g>`;
  // 3 litigation
  let cols = '';
  for (let i = 0; i < 5; i++) cols += `<rect x="${-170 + i * 78}" y="-50" width="30" height="190" fill="#fff"/><rect x="${-170 + i * 78 + 20}" y="-50" width="10" height="190" fill="${C.slate6}"/>`;
  ill[2] = `<polygon points="-230,-62 0,-170 230,-62" fill="${C.slate}"/><polygon points="-180,-72 0,-150 180,-72" fill="${C.slate2}"/>
    <rect x="-230" y="-66" width="460" height="22" fill="${C.slate2}"/>${cols}
    <rect x="-240" y="140" width="480" height="18" fill="${C.beige3}"/><rect x="-260" y="158" width="520" height="20" fill="${C.beige4}"/>
    <circle cx="0" cy="-104" r="16" fill="url(#gGold)"/>
    ${folder(-120, 150, 150, 110, C.gold2, -6)}${folder(-100, 166, 150, 110, C.slate3, 4)}
    <g transform="translate(118 0)">${justiceScale('svcScale', 0, 200, 170, { sw: 2 })}</g>`;
  // 4 arbitration
  ill[3] = `<g class="halfL"><path d="M-6 -150 A 150 150 0 0 0 -6 150 Z" fill="${C.slate}"/><path d="M-6 -110 A 110 110 0 0 0 -6 110" fill="none" stroke="${C.slate3}" stroke-width="3"/></g>
    <g class="halfR"><path d="M6 -150 A 150 150 0 0 1 6 150 Z" fill="url(#gGold)"/><path d="M6 -110 A 110 110 0 0 1 6 110" fill="none" stroke="${C.gold3}" stroke-width="3"/></g>
    <g class="joinMark"><circle cx="0" cy="0" r="56" fill="#fff"/>${icon('handshake', 0, 0, 74, C.slate, 3.6)}</g>
    <circle class="joinRing" cx="0" cy="0" r="178" fill="none" stroke="${C.gold}" stroke-width="2.5"/>`;
  // 5 governance
  ill[4] = `${tower({ x: -90, base: 190, w: 180, h: 360, fill: C.slate, shade: C.slate2, win: C.gold3, winOp: 0.55, cols: 4, rows: 9, top: 'step' })}
    <rect x="-200" y="190" width="400" height="12" fill="${C.beige3}"/>
    <g class="org">
      <rect x="130" y="-120" width="80" height="40" rx="6" fill="#fff" stroke="${C.gold}" stroke-width="3"/>
      <path d="M170 -80 L 170 -50 M120 -50 L 220 -50 M120 -50 L 120 -24 M220 -50 L 220 -24" stroke="${C.gold}" stroke-width="3" fill="none"/>
      <rect x="92" y="-24" width="56" height="32" rx="5" fill="#fff" stroke="${C.slate4}" stroke-width="2.5"/>
      <rect x="192" y="-24" width="56" height="32" rx="5" fill="#fff" stroke="${C.slate4}" stroke-width="2.5"/>
    </g>
    <g class="badge"><circle cx="-160" cy="-90" r="46" fill="url(#gGold)"/><path d="M-182 -90 L -166 -74 L -138 -104" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`;
  // 6 risk
  ill[5] = `${tower({ x: -70, base: 200, w: 140, h: 280, fill: C.beige3, shade: C.beige4, win: '#fff', winOp: 0.7, cols: 3, rows: 7 })}
    <rect x="-200" y="200" width="400" height="12" fill="${C.beige4}"/>
    ${shield(0, 30, 170, { cls: 'bigShield', fillOp: 0.88, sw: 6 })}`;
  // 7 corporate / investment / restructuring
  ill[6] = `${tower({ x: -230, base: 200, w: 110, h: 220, fill: C.slate4, shade: C.slate3, win: '#fff', winOp: 0.4, cols: 2, rows: 6 })}
    ${tower({ x: -60, base: 200, w: 120, h: 320, fill: C.slate, shade: C.slate2, win: C.gold3, winOp: 0.5, cols: 3, rows: 8, top: 'crown' })}
    ${tower({ x: 120, base: 200, w: 110, h: 260, fill: C.beige3, shade: C.beige4, win: '#fff', winOp: 0.6, cols: 2, rows: 7 })}
    <rect x="-260" y="200" width="520" height="12" fill="${C.beige4}"/>
    <path class="cnet" d="M-175 -34 Q -90 -170 0 -134 Q 90 -150 175 -74" stroke="${C.gold}" stroke-width="3" fill="none"/>
    <circle cx="-175" cy="-34" r="9" fill="${C.gold}"/><circle cx="0" cy="-134" r="9" fill="${C.gold}"/><circle cx="175" cy="-74" r="9" fill="${C.gold}"/>
    <path class="arrow" d="M-200 150 L -80 60 L 0 100 L 170 -40" stroke="${C.goldD}" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path class="arrowHead" d="M130 -48 L 182 -50 L 168 0" stroke="${C.goldD}" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  // 8 commercial cases & collection
  let coins = '';
  for (let i = 0; i < 6; i++) coins += `<ellipse cx="140" cy="${170 - i * 16}" rx="56" ry="17" fill="${C.goldD}"/><ellipse cx="140" cy="${164 - i * 16}" rx="56" ry="17" fill="url(#gGold)"/>`;
  ill[7] = `${doc(-60, -30, 220, 290, -6, { lines: 10 })}${folder(-90, 90, 280, 210, C.slate3, 3)}
    <g class="coins">${coins}</g>
    <g class="badge"><circle cx="150" cy="-110" r="56" fill="${C.slate}"/><circle cx="150" cy="-110" r="46" fill="none" stroke="${C.gold}" stroke-width="3"/><path d="M124 -110 L 143 -91 L 178 -128" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`;

  // bottom strip
  const SX = (i) => 1640 - i * 194, SY = 952;
  let strip = `<line x1="${SX(7)}" y1="${SY}" x2="${SX(0)}" y2="${SY}" stroke="${C.gold3}" stroke-width="2"/>`;
  SVC.forEach(([, ic], i) => {
    strip += `<g class="st" id="st${i}"><circle class="stc" cx="${SX(i)}" cy="${SY}" r="38" fill="${C.ivory}" stroke="${C.gold3}" stroke-width="2.5"/>
      <circle class="sta" cx="${SX(i)}" cy="${SY}" r="38" fill="url(#gGold)" opacity="0"/>
      ${icon(ic, SX(i), SY, 40, C.slate4, 3, 'sti')}${icon(ic, SX(i), SY, 40, '#fff', 3, 'stw')}</g>`;
  });
  // papers pile
  let pile = '';
  const rots = [-14, 9, -4, 16, -9, 5, -18, 12];
  for (let i = 0; i < 8; i++) pile += `<g class="pp">${doc(0, 0, 170, 220, rots[i], { lines: 7 })}</g>`;
  svg(sc, `<rect width="1920" height="1080" fill="${C.ivory}"/>
    <rect width="1920" height="1080" fill="url(#pGrid)" opacity="0.04"/>
    <clipPath id="vclip"><circle cx="${VX}" cy="${VY}" r="${VR - 14}"/></clipPath>
    <g class="vig">
      <circle cx="${VX}" cy="${VY + 12}" r="${VR}" fill="#000" opacity="0.05"/>
      <circle cx="${VX}" cy="${VY}" r="${VR}" fill="#fff"/>
      <circle cx="${VX}" cy="${VY}" r="${VR - 14}" fill="${C.beige}"/>
      <g clip-path="url(#vclip)">
        <circle cx="${VX}" cy="${VY}" r="${VR - 14}" fill="url(#pNajdi)" opacity="0.18"/>
        ${ill.map((s, i) => `<g class="svc" id="svc${i}"><g transform="translate(${VX} ${VY + 10})">${s}</g></g>`).join('')}
      </g>
      <circle class="vring draw" cx="${VX}" cy="${VY}" r="${VR}" fill="none" stroke="${C.gold}" stroke-width="4" transform="rotate(-90 ${VX} ${VY})"/>
    </g>
    <g class="strip">${strip}</g>
    <g class="pile" transform="translate(960 520)">${pile}</g>`);
  const kick = text(sc, '<span class="rule"></span>خدماتنا القانونية<span class="rule"></span>', { left: 0, top: '70px', width: '1920px', textAlign: 'center', fontSize: '34px' }, 'kicker');
  const intro = text(sc, 'منظومة متكاملة من الخدمات القانونية', { left: '0', top: '830px', width: '1920px', textAlign: 'center', fontSize: '50px' }, 'h-display');
  const titles = SVC.map(([t], i) => {
    const box = text(sc, `<div class="num">${String(i + 1).padStart(2, '0')}</div><div class="stitle">${t}</div><div class="uline"></div>`,
      { left: '1000px', top: '300px', width: '780px', textAlign: 'right' }, 'svcText');
    return box;
  });

  sceneIn(sc, 22.7, 0.45);
  wordsIn(kick, 22.85);
  // pile falls in
  const pp = $$(sc, '.pp');
  tl.fromTo(pp, { y: -700, opacity: 0 }, { y: (i) => -i * 3, opacity: 1, duration: 0.55, stagger: 0.06, ease: 'power3.out' }, 22.8);
  wordsIn(intro, 23.0, { stagger: 0.06, d: 0.6 });
  fadeOut(intro, 23.85, 0.3);
  // papers separate and fly to strip positions
  pp.forEach((p, i) => {
    tl.to(p, { x: SX(i) - 960, y: SY - 520, scale: 0.2, opacity: 0, duration: 0.7, ease: 'power3.inOut' }, 23.75 + i * 0.03);
  });
  tl.fromTo($$(sc, '.st'), { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.45, stagger: 0.04, ease: 'back.out(2)' }, 24.15);
  tl.fromTo($(sc, '.strip line'), { opacity: 0 }, { opacity: 1, duration: 0.4 }, 24.1);
  // vignette
  const vig = $(sc, '.vig');
  tl.fromTo(vig, { autoAlpha: 0, scale: 0.85, svgOrigin: `${VX} ${VY}` }, { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'power3.out' }, 23.9);
  drawIn(prepDraw(sc, '.vring'), 23.95, 0.9);
  tl.set($$(sc, '.svc'), { autoAlpha: 0 }, 0);
  tl.set($$(sc, '.svcText'), { autoAlpha: 0 }, 0);
  const T0 = 24.05, STEP = 1.14;
  // per-service micro animations
  const sig = prepDraw(sc, '.sig');
  const shieldD = prepDraw(sc, '.bigShield .draw');
  const arrowD = prepDraw(sc, '.arrow, .arrowHead, .cnet');
  SVC.forEach((_, i) => {
    const t0 = T0 + i * STEP;
    const g = $(sc, '#svc' + i), tx = titles[i];
    tl.fromTo(g, { autoAlpha: 0, scale: 0.94, svgOrigin: `${VX} ${VY}` }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'power2.out' }, t0);
    if (i < 7) tl.to(g, { autoAlpha: 0, duration: 0.3, ease: 'power1.in' }, t0 + STEP - 0.22);
    tl.fromTo($(tx, '.num'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out' }, t0);
    tl.set(tx, { autoAlpha: 1 }, t0);
    tl.fromTo($(tx, '.stitle'), { autoAlpha: 0, x: 40, filter: 'blur(6px)' }, { autoAlpha: 1, x: 0, filter: 'blur(0px)', duration: 0.5, ease: 'power3.out' }, t0 + 0.06);
    tl.fromTo($(tx, '.uline'), { scaleX: 0, transformOrigin: '100% 50%' }, { scaleX: 1, duration: 0.5, ease: 'power3.out' }, t0 + 0.15);
    if (i < 7) tl.to(tx, { autoAlpha: 0, duration: 0.22 }, t0 + STEP - 0.2);
    // strip state
    const st = $(sc, '#st' + i);
    tl.to($(st, '.sta'), { opacity: 1, duration: 0.3 }, t0);
    tl.fromTo($(st, '.stw'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, t0);
    tl.fromTo(st, { scale: 1 }, { scale: 1.18, transformOrigin: '50% 50%', duration: 0.3, ease: 'power2.out' }, t0);
    if (i < 7) tl.to(st, { scale: 1, duration: 0.3 }, t0 + STEP - 0.2);
  });
  $$(sc, '.stw').forEach((e) => (e.style.opacity = 0));
  // micro: consultation bubbles
  tl.fromTo($$(sc, '#svc0 .bub'), { scale: 0, transformOrigin: '50% 100%' }, { scale: 1, duration: 0.35, stagger: 0.2, ease: 'back.out(2)' }, T0 + 0.25);
  // micro: signature + pen
  drawIn(sig, T0 + STEP + 0.15, 0.75, 0, 'power1.inOut');
  tl.fromTo($(sc, '#svc1 .pen'), { x: -40, y: 150 }, { x: 92, y: 132, duration: 0.75, ease: 'power1.inOut' }, T0 + STEP + 0.15);
  // micro: arbitration halves join
  tl.fromTo($(sc, '#svc3 .halfL'), { x: -150 }, { x: 0, duration: 0.6, ease: 'power3.inOut' }, T0 + 3 * STEP + 0.05);
  tl.fromTo($(sc, '#svc3 .halfR'), { x: 150 }, { x: 0, duration: 0.6, ease: 'power3.inOut' }, T0 + 3 * STEP + 0.05);
  tl.fromTo($(sc, '#svc3 .joinMark'), { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.35, ease: 'back.out(2)' }, T0 + 3 * STEP + 0.55);
  tl.fromTo($(sc, '#svc3 .joinRing'), { scale: 0.8, opacity: 0, transformOrigin: '50% 50%' }, { scale: 1, opacity: 1, duration: 0.4 }, T0 + 3 * STEP + 0.55);
  // micro: governance org + badge
  tl.fromTo($(sc, '#svc4 .org'), { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.4 }, T0 + 4 * STEP + 0.2);
  tl.fromTo($(sc, '#svc4 .badge'), { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.35, ease: 'back.out(2)' }, T0 + 4 * STEP + 0.4);
  // micro: shield draw
  drawIn(shieldD, T0 + 5 * STEP + 0.05, 0.6, 0.1);
  tl.fromTo($(sc, '#svc5 .shieldFill'), { opacity: 0 }, { opacity: 0.88, duration: 0.4 }, T0 + 5 * STEP + 0.3);
  // micro: growth arrow
  drawIn(arrowD, T0 + 6 * STEP + 0.1, 0.6, 0.12);
  // micro: coins + badge
  tl.fromTo($$(sc, '#svc7 .coins ellipse'), { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.2, stagger: 0.03 }, T0 + 7 * STEP + 0.1);
  tl.fromTo($(sc, '#svc7 .badge'), { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.35, ease: 'back.out(2)' }, T0 + 7 * STEP + 0.4);
  sceneOut(sc, 32.85, 0.5);
})();

/* =========================================================
   SCENE 5 — Who we serve (33.25 – 40.1)
   ========================================================= */
(function s5() {
  const sc = scene('s5');
  const X = [1530, 1150, 770, 390], FB = 640, FW = 300, FH = 420;
  const arch = (cx) => `M${cx - FW / 2} ${FB} L ${cx - FW / 2} ${FB - FH + FW / 2} A ${FW / 2} ${FW / 2} 0 0 1 ${cx + FW / 2} ${FB - FH + FW / 2} L ${cx + FW / 2} ${FB} Z`;
  const ills = [
    `${tower({ x: -120, base: 0, w: 90, h: 230, fill: C.slate4, shade: C.slate3, win: '#fff', winOp: 0.45, cols: 2 })}${tower({ x: -40, base: 0, w: 100, h: 320, fill: C.slate, shade: C.slate2, win: C.gold3, winOp: 0.5, cols: 3, top: 'spire' })}${tower({ x: 50, base: 0, w: 90, h: 260, fill: C.beige3, shade: C.beige4, win: '#fff', winOp: 0.7, cols: 2 })}`,
    `${man({ x: -62, y: 6, s: 0.92, hold: 'doc' })}${man({ x: 66, y: 6, s: 0.92, shemagh: true, hold: 'tablet' })}<g transform="translate(0 -330)">${icon('growthChart', 0, 0, 56, C.gold, 3)}</g>`,
    `<rect x="-135" y="-190" width="270" height="190" fill="${C.beige2}"/><rect x="40" y="-190" width="95" height="190" fill="${C.beige3}"/>
     ${najdiCrenel(-135, -190, 270, 18, C.beige3)}
     <rect x="-45" y="-270" width="90" height="80" fill="${C.beige2}"/><rect x="10" y="-270" width="35" height="80" fill="${C.beige3}"/>${najdiCrenel(-45, -270, 90, 16, C.beige3)}
     <path d="M-30 0 L -30 -90 A 30 30 0 0 1 30 -90 L 30 0 Z" fill="${C.slate}"/>
     ${[-110, -80, 60, 90].map((x) => `<rect x="${x}" y="-150" width="14" height="44" rx="7" fill="${C.slate2}"/><rect x="${x}" y="-80" width="14" height="44" rx="7" fill="${C.slate2}"/>`).join('')}
     ${[-28, 14].map((x) => `<rect x="${x}" y="-250" width="14" height="36" rx="7" fill="${C.slate2}"/>`).join('')}
     <rect x="-150" y="-6" width="300" height="10" fill="${C.beige4}"/>`,
    `<rect x="-120" y="-200" width="240" height="200" fill="#fff"/><rect x="40" y="-200" width="80" height="200" fill="${C.beige}"/>
     <rect x="-130" y="-212" width="260" height="14" fill="${C.slate3}"/>
     <g transform="translate(-30 -130)">${icon('heart', 0, 0, 70, C.gold, 5)}</g>
     ${[-95, 55, 85].map((x) => `<rect x="${x}" y="-176" width="20" height="30" rx="3" fill="${C.slate5}"/>`).join('')}
     <rect x="-20" y="-70" width="40" height="70" rx="3" fill="${C.slate}"/>
     ${[[-90, C.slate], [-50, C.gold], [50, C.slate3], [90, C.goldD]].map(([x, c]) => `<circle cx="${x}" cy="-58" r="12" fill="${c}"/><path d="M${x - 16} 0 L ${x - 16} -30 Q ${x} -48 ${x + 16} -30 L ${x + 16} 0 Z" fill="${c}"/>`).join('')}
     <path d="M-74 -26 L -66 -26 M66 -26 L 74 -26" stroke="${C.char}" stroke-width="3"/>`
  ];
  const labels = ['الشركات والمؤسسات', 'المستثمرون ورواد الأعمال', 'الجهات الحكومية وشبه الحكومية', 'القطاع غير الربحي'];
  let frames = '';
  X.forEach((cx, i) => {
    frames += `<g class="fr" id="fr${i}">
      <clipPath id="frc${i}"><path d="${arch(cx)}"/></clipPath>
      <path d="${arch(cx)}" fill="#000" opacity="0.05" transform="translate(6 10)"/>
      <path d="${arch(cx)}" fill="url(#gWindow)"/>
      <g clip-path="url(#frc${i})"><circle cx="${cx + 60}" cy="${FB - 300}" r="120" fill="url(#gSun)"/><g transform="translate(${cx} ${FB})">${ills[i]}</g></g>
      <path class="draw" d="${arch(cx)}" fill="none" stroke="${C.gold}" stroke-width="3.5"/>
      <path d="${arch(cx)}" fill="none" stroke="${C.gold3}" stroke-width="1.2" transform="translate(${cx} ${FB - FH / 2}) scale(0.93) translate(${-cx} ${-(FB - FH / 2)})"/>
      <text x="${cx}" y="${FB + 92}" text-anchor="middle" class="svgB" font-size="${i === 2 ? 30 : 34}" fill="${C.char}">${labels[i]}</text>
    </g>`;
  });
  const nodes = X.map((cx) => `<g class="nd"><circle cx="${cx}" cy="${FB + 30}" r="9" fill="${C.ivory}" stroke="${C.gold}" stroke-width="3"/><circle cx="${cx}" cy="${FB + 30}" r="3.5" fill="${C.gold}"/></g>`).join('');
  svg(sc, `<rect width="1920" height="1080" fill="${C.ivory}"/><rect width="1920" height="1080" fill="url(#pNajdi)" opacity="0.04"/>
    <path class="conn" d="M${X[0] + 260} ${FB + 30} L ${X[3] - 260} ${FB + 30}" stroke="${C.gold}" stroke-width="2.5"/>
    ${frames}${nodes}
    <g class="hub"><path d="M960 ${FB + 30} L 960 ${FB + 170}" stroke="${C.gold3}" stroke-width="2"/></g>`);
  const head = text(sc, 'حلول قانونية تلبي احتياجات <span class="gold">مختلف القطاعات</span>', { left: 0, top: '80px', width: '1920px', textAlign: 'center', fontSize: '60px' }, 'h-display');
  const kick = text(sc, '<span class="rule"></span>من نخدم<span class="rule"></span>', { left: 0, top: '880px', width: '1920px', textAlign: 'center', fontSize: '32px' }, 'kicker');
  sceneIn(sc, 33.2, 0.5);
  wordsIn(head, 33.35, { stagger: 0.07 });
  const conn = prepDraw(sc, '.conn');
  drawIn(conn, 33.9, 4.6, 0, 'none');
  const T = [33.75, 35.15, 36.55, 38.0];
  X.forEach((_, i) => {
    const fr = $(sc, '#fr' + i);
    tl.fromTo(fr, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.75, ease: 'power3.out' }, T[i]);
    drawIn(prepDraw(fr, '.draw'), T[i] + 0.1, 0.9);
    tl.fromTo($(fr, 'text'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5 }, T[i] + 0.35);
    tl.fromTo($$(sc, '.nd')[i], { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.4, ease: 'back.out(2.5)' }, T[i] + 0.2);
  });
  tl.set($(sc, '.hub'), { opacity: 0 }, 0);
  wordsIn(kick, 38.7);
  tl.fromTo($(sc, '.cam') || sc.querySelector('svg'), { scale: 1 }, { scale: 1.03, transformOrigin: '50% 50%', duration: 7, ease: 'sine.inOut' }, 33.2);
  sceneOut(sc, 39.75, 0.5);
})();

/* =========================================================
   SCENE 6 — Working methodology (40.0 – 47.25)
   ========================================================= */
(function s6() {
  const sc = scene('s6');
  const X = [1640, 1270, 900, 530], CY = 520, R = 100;
  const steps = [['الفهم والتحليل', 'search'], ['التقييم القانوني', 'clipboard'], ['تطوير الحلول', 'bulb'], ['التنفيذ والمتابعة', 'execute']];
  let g = '';
  steps.forEach(([lab, ic], i) => {
    const cx = X[i];
    g += `<g class="stp" id="stp${i}">
      <circle class="glow" cx="${cx}" cy="${CY}" r="${R + 26}" fill="${C.gold3}" opacity="0"/>
      <circle cx="${cx}" cy="${CY + 8}" r="${R}" fill="#000" opacity="0.05"/>
      <circle cx="${cx}" cy="${CY}" r="${R}" fill="#fff" stroke="${C.beige2}" stroke-width="3"/>
      <circle class="act draw" cx="${cx}" cy="${CY}" r="${R}" fill="none" stroke="${C.gold}" stroke-width="6" transform="rotate(-90 ${cx} ${CY})"/>
      ${icon(ic, cx, CY, 84, C.slate5, 3.4, 'off')}${icon(ic, cx, CY, 84, C.slate, 3.6, 'on')}
      <text x="${cx}" y="${CY - R - 40}" text-anchor="middle" class="svgNum" font-size="46" fill="${C.gold}">${String(i + 1).padStart(2, '0')}</text>
      <text x="${cx}" y="${CY + R + 74}" text-anchor="middle" class="svgH" font-size="42" fill="${C.char}">${lab}</text>
    </g>`;
  });
  svg(sc, `<rect width="1920" height="1080" fill="${C.ivory}"/><rect width="1920" height="1080" fill="url(#pGrid)" opacity="0.04"/>
    <line x1="1800" y1="${CY}" x2="262" y2="${CY}" stroke="${C.beige2}" stroke-width="3"/>
    <path class="prog" d="M1800 ${CY} L 262 ${CY}" stroke="url(#gGold)" stroke-width="5" fill="none"/>
    ${g}
    <g class="fshield">${shield(180, CY, 88, { cls: 'msh', sw: 5, fillOp: 1 })}</g>`);
  const head = text(sc, 'منهجية عمل <span class="gold">واضحة</span>', { left: 0, top: '120px', width: '1920px', textAlign: 'center', fontSize: '64px' }, 'h-display');
  sceneIn(sc, 39.95, 0.5);
  wordsIn(head, 40.2, { stagger: 0.12 });
  const prog = prepDraw(sc, '.prog')[0];
  const L = +prog.dataset.len;
  // progress line reaches each circle center
  const pos = (x) => L - (1800 - x);
  const T = [42.2, 43.0, 44.0, 45.0];
  tl.to(prog, { strokeDashoffset: pos(X[0]) - 0, duration: 0.6, ease: 'power2.inOut' }, 41.6);
  for (let i = 1; i < 4; i++) tl.to(prog, { strokeDashoffset: pos(X[i]), duration: T[i] - T[i - 1] - 0.05, ease: 'power2.inOut' }, T[i - 1] + 0.05);
  tl.to(prog, { strokeDashoffset: 0, duration: 0.6, ease: 'power2.inOut' }, 45.25);
  $$(sc, '.stp .on').forEach((e) => (e.style.opacity = 0));
  tl.set($$(sc, '.stp'), { autoAlpha: 0 }, 0);
  tl.fromTo($$(sc, '.stp'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.12, ease: 'power3.out' }, 40.5);
  tl.fromTo($$(sc, '.stp text'), { opacity: 0.35 }, { opacity: 0.35, duration: 0.01 }, 40.5);
  const acts = prepDraw(sc, '.act');
  T.forEach((t, i) => {
    const st = $(sc, '#stp' + i);
    drawIn([acts[i]], t, 0.6);
    tl.to($(st, '.on'), { opacity: 1, duration: 0.35 }, t + 0.05);
    tl.to($(st, '.off'), { opacity: 0, duration: 0.35 }, t + 0.05);
    tl.to($$(st, 'text'), { opacity: 1, duration: 0.35 }, t);
    tl.fromTo($(st, '.glow'), { opacity: 0.0, scale: 0.85, transformOrigin: '50% 50%' }, { opacity: 0.55, scale: 1, duration: 0.5, ease: 'power2.out' }, t);
    tl.to($(st, '.glow'), { opacity: 0.25, duration: 0.6 }, t + 0.6);
  });
  const shD = prepDraw(sc, '.msh .draw');
  tl.set($(sc, '.msh .shieldFill'), { opacity: 0 }, 0);
  drawIn(shD, 45.8, 0.7, 0.25);
  tl.to($(sc, '.msh .shieldFill'), { opacity: 1, duration: 0.5 }, 46.2);
  tl.fromTo($(sc, '.fshield'), { scale: 1 }, { scale: 1.12, svgOrigin: `180 ${CY}`, duration: 0.35, yoyo: true, repeat: 1, ease: 'power2.out' }, 46.4);
  sceneOut(sc, 46.85, 0.5);
})();

/* =========================================================
   SCENE 7 — The Miyaar Legal difference (47.18 – 54.9)
   ========================================================= */
(function s7() {
  const sc = scene('s7');
  // window skyline
  const wsky = `${tower({ x: 590, base: 690, w: 60, h: 120, fill: C.slate5, shade: C.slate4 })}${faisaliah(700, 690, 60, 210, C.slate4, C.slate3)}
    ${tower({ x: 760, base: 690, w: 50, h: 150, fill: C.slate5, shade: C.slate4 })}${kingdomCentre(870, 690, 80, 260, C.slate3, C.slate2)}${tower({ x: 920, base: 690, w: 50, h: 110, fill: C.slate5, shade: C.slate4 })}`;
  const winPath = `M560 700 L 560 300 A 200 200 0 0 1 960 300 L 960 700 Z`;
  let shelfBooks = '';
  const cols = [C.slate, C.goldD, C.char2, C.slate3, C.beige4, C.slate2, C.gold2];
  [300, 470, 640].forEach((by, r) => {
    let x = 96;
    let k = r * 3;
    while (x < 350) {
      const w = 22 + ((k * 7) % 12), h = 110 + ((k * 13) % 36);
      shelfBooks += bookStanding(x, by, w, h, cols[k % cols.length], C.gold3);
      x += w + 3; k++;
      if (k % 5 === 4) x += 18;
    }
  });
  const consultant = man({ x: 760, y: 944, s: 1.6, pose: 'desk', bisht: true, id: 'cons' });
  svg(sc, `<g class="cam">
    <rect width="1920" height="1080" fill="${C.ivory}"/>
    <rect x="0" y="720" width="1920" height="360" fill="${C.beige}"/>
    <rect x="0" y="716" width="1920" height="6" fill="${C.beige2}"/>
    <!-- architectural frame lines -->
    <path d="M1110 120 L 1110 700 M1880 120 L 1880 700 M1110 120 L 1880 120" stroke="${C.gold3}" stroke-width="2" fill="none"/>
    <rect x="1110" y="104" width="770" height="2" fill="${C.gold3}"/>
    <!-- window -->
    <path d="${winPath}" fill="url(#gWindow)"/>
    <clipPath id="winc"><path d="${winPath}"/></clipPath>
    <g clip-path="url(#winc)"><circle cx="830" cy="560" r="230" fill="url(#gSun)"/>${wsky}<rect x="540" y="690" width="440" height="20" fill="${C.beige2}"/></g>
    <path d="${winPath}" fill="none" stroke="${C.slate}" stroke-width="12"/>
    <path d="M760 100 L 760 700 M560 450 L 960 450" stroke="${C.slate}" stroke-width="5"/>
    ${najdiCrenel(560, 84, 400, 20, C.gold, 0.8)}<rect x="560" y="84" width="400" height="3" fill="${C.gold}"/>
    <!-- shelf -->
    <rect x="80" y="160" width="290" height="560" fill="${C.beige2}"/>
    ${[300, 470, 640].map((y) => `<rect x="80" y="${y}" width="290" height="10" fill="${C.beige4}"/>`).join('')}
    ${shelfBooks}
    <rect x="70" y="150" width="310" height="14" fill="${C.slate}"/>
    <!-- consultant -->
    ${consultant}
    <!-- held document -->
    <g class="hdoc"><g transform="translate(760 742) rotate(-3)"><rect x="-74" y="-92" width="148" height="96" rx="4" fill="#fff" stroke="${C.beige3}" stroke-width="2"/>
      <rect x="-56" y="-76" width="64" height="7" fill="${C.gold}"/><rect x="-56" y="-60" width="110" height="5" fill="${C.slate6}"/><rect x="-56" y="-48" width="96" height="5" fill="${C.slate6}"/><rect x="-56" y="-36" width="108" height="5" fill="${C.slate6}"/><rect x="-56" y="-24" width="70" height="5" fill="${C.slate6}"/></g></g>
    <!-- desk -->
    <rect x="300" y="742" width="920" height="30" rx="4" fill="${C.slate}"/>
    <rect x="300" y="768" width="920" height="5" fill="${C.gold}"/>
    <rect x="330" y="773" width="860" height="330" fill="${C.slate2}"/>
    <rect x="370" y="810" width="360" height="200" fill="none" stroke="${C.gold}" stroke-width="2" opacity="0.6"/>
    <rect x="790" y="810" width="360" height="200" fill="none" stroke="${C.gold}" stroke-width="2" opacity="0.6"/>
    <!-- desk items -->
    ${bookLying(340, 708, 190, 34, C.char2)}${bookLying(352, 676, 170, 32, C.goldD)}${bookLying(346, 646, 180, 30, C.slate3)}
    <g><path d="M940 744 L 1100 744 L 1090 736 L 950 736 Z" fill="${C.slate5}"/><path d="M955 736 L 1085 736 L 1075 636 L 965 636 Z" fill="${C.slate4}"/><circle cx="1020" cy="688" r="12" fill="${C.gold}" opacity="0.8"/></g>
    <g transform="translate(1160 0)">${justiceScale('s7scale', 0, 742, 150, { sw: 1.6 })}</g>
  </g>`);
  const kick = text(sc, 'ما يميّز معيار ليجل', { left: '1150px', top: '170px', width: '690px', textAlign: 'right', fontSize: '34px' }, 'kicker');
  const items = ['السرية والاحترافية', 'الدقة والابتكار', 'الحلول الاستباقية', 'حماية مصالح العملاء'].map((t, i) =>
    text(sc, `<span class="dia"></span>${t}`, { left: '1150px', top: `${270 + i * 104}px`, width: '690px', textAlign: 'right', fontSize: '52px' }, 'vItem'));
  sceneIn(sc, 47.0, 0.5);
  tl.fromTo($(sc, '.cam'), { scale: 1, svgOrigin: '760 600' }, { scale: 1.09, duration: 7.9, ease: 'sine.inOut' }, 47.0);
  wordsIn(kick, 47.3);
  [47.5, 48.75, 49.95, 50.85].forEach((t, i) => {
    tl.fromTo(items[i], { autoAlpha: 0, x: 50, filter: 'blur(8px)' }, { autoAlpha: 1, x: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' }, t);
  });
  const sEl = $(sc, '#s7scale');
  updaters.push((t) => { if (t > 46.8 && t < 55.2) tiltScale(sEl, 3 * Math.sin((t - 47) * 1.3)); });
  const head = $(sc, '#cons .head');
  updaters.push((t) => {
    if (t < 46.8 || t > 55.2) return;
    const a = 3.5 * Math.sin((t - 47) * 1.1) + 2;
    head.setAttribute('transform', `rotate(${a.toFixed(2)} 0 -228) translate(0 ${(1.2 * Math.sin((t - 47) * 0.9)).toFixed(2)})`);
  });
  tl.fromTo($(sc, '.hdoc'), { y: 0 }, { y: -6, duration: 1.8, yoyo: true, repeat: 3, ease: 'sine.inOut' }, 47.2);
  sceneOut(sc, 54.6, 0.55);
})();

/* =========================================================
   FINAL — Brand identity & contact (54.75 – 62)
   ========================================================= */
(function s8() {
  const sc = scene('s8');
  const fx = 300, fy = 150, fw = 1320, fh = 780;
  const corner = (x, y) => `<g><path d="M${x} ${y - 22} L ${x + 22} ${y} L ${x} ${y + 22} L ${x - 22} ${y} Z" fill="${C.ivory}" stroke="${C.gold}" stroke-width="2.5"/><circle cx="${x}" cy="${y}" r="5" fill="${C.gold}"/></g>`;
  svg(sc, `<rect width="1920" height="1080" fill="${C.ivory}"/>
    <rect width="1920" height="1080" fill="url(#pNajdi)" opacity="0.05"/>
    <circle cx="960" cy="420" r="520" fill="url(#gSun)" opacity="0.5"/>
    <path class="fr draw" d="M960 ${fy} L ${fx} ${fy} L ${fx} ${fy + fh} L 960 ${fy + fh}" fill="none" stroke="${C.gold}" stroke-width="2.5"/>
    <path class="fr draw" d="M960 ${fy} L ${fx + fw} ${fy} L ${fx + fw} ${fy + fh} L 960 ${fy + fh}" fill="none" stroke="${C.gold}" stroke-width="2.5"/>
    <path class="fr2 draw" d="M960 ${fy + 16} L ${fx + 16} ${fy + 16} L ${fx + 16} ${fy + fh - 16} L 960 ${fy + fh - 16}" fill="none" stroke="${C.gold3}" stroke-width="1.2"/>
    <path class="fr2 draw" d="M960 ${fy + 16} L ${fx + fw - 16} ${fy + 16} L ${fx + fw - 16} ${fy + fh - 16} L 960 ${fy + fh - 16}" fill="none" stroke="${C.gold3}" stroke-width="1.2"/>
    <g class="corners">${corner(fx, fy)}${corner(fx + fw, fy)}${corner(fx, fy + fh)}${corner(fx + fw, fy + fh)}</g>
    <g class="crenT">${najdiCrenel(760, fy - 2, 400, 16, C.gold, 0.9)}</g>
    <g class="crenB" transform="translate(0 ${2 * (fy + fh) + 2}) scale(1 -1)">${najdiCrenel(760, fy + fh, 400, 16, C.gold, 0.9)}</g>`);
  // logo split: emblem + wordmark (exact proportions of the supplied logo)
  const LW = 900, k = LW / 2322, LH = 702 * k, lx = 960 - LW / 2, ly = 228;
  const logo = document.createElement('div');
  logo.className = 'flogo';
  logo.style.cssText = `position:absolute;left:${lx}px;top:${ly}px;width:${LW}px;height:${LH}px`;
  logo.innerHTML = `<img class="em" src="assets/emblem.png" style="position:absolute;left:0;top:0;width:${714 * k}px;height:${LH}px">
    <div class="wmw" style="position:absolute;left:${726 * k}px;top:0;width:${1596 * k}px;height:${LH}px;overflow:hidden"><img src="assets/wordmark.png" style="width:${1596 * k}px;height:${LH}px"></div>
    <div class="sheenwrap"><div class="sheen"></div></div>`;
  sc.appendChild(logo);
  const name = text(sc, 'معيار ليجل للمحاماة والاستشارات القانونية', { left: 0, top: '560px', width: '1920px', textAlign: 'center', fontSize: '50px' }, 'h-display');
  const tag = text(sc, '<span class="tw">خبرة</span><span class="sep">·</span><span class="tw">ثقة</span><span class="sep">·</span><span class="tw">استدامة</span>', { left: 0, top: '650px', width: '1920px', textAlign: 'center', fontSize: '50px' }, 'tagline');
  const contact = text(sc, `<span class="ci"><svg viewBox="0 0 64 64" width="34" height="34">${icon('globe', 32, 32, 60, C.gold, 3.5)}</svg><span class="lt">miyaarlegal.com</span></span><span class="cdiv"></span><span class="ci"><svg viewBox="0 0 64 64" width="34" height="34">${icon('phone', 32, 32, 56, C.gold, 3.5)}</svg><span class="lt">0509020750</span></span>`,
    { left: 0, top: '790px', width: '1920px', textAlign: 'center', fontSize: '36px' }, 'contact');
  sceneIn(sc, 54.7, 0.6);
  const frs = prepDraw(sc, '.draw');
  drawIn(frs, 54.9, 1.5, 0.05, 'power2.inOut');
  tl.fromTo($$(sc, '.corners > g'), { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.5, stagger: 0.08, ease: 'back.out(2)' }, 55.9);
  tl.fromTo($$(sc, '.crenT polygon, .crenB polygon'), { opacity: 0 }, { opacity: 0.9, duration: 0.3, stagger: 0.015 }, 55.6);
  tl.fromTo($(logo, '.em'), { autoAlpha: 0, scale: 0.8, filter: 'blur(8px)' }, { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' }, 55.0);
  tl.fromTo($(logo, '.wmw'), { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.9, ease: 'power3.inOut' }, 55.35);
  wordsIn(name, 55.9, { stagger: 0.08 });
  const tws = $$(tag, '.tw'), seps = $$(tag, '.sep');
  tl.set([...tws, ...seps], { autoAlpha: 0 }, 0);
  [[tws[0], 56.85], [seps[0], 57.6], [tws[1], 58.25], [seps[1], 58.7], [tws[2], 58.85]].forEach(([e, t]) => {
    tl.fromTo(e, { autoAlpha: 0, y: 18, filter: 'blur(6px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.55, ease: 'power3.out' }, t);
  });
  fadeIn(contact, 59.55, 0.7, { y: 20 });
  tl.fromTo($(logo, '.sheen'), { x: -300, opacity: 0 }, { x: LW + 300, opacity: 1, duration: 1.3, ease: 'power2.inOut' }, 59.95);
  tl.to({}, { duration: 0.01 }, DUR - 0.01);
})();

/* ---------- vignette overlay ---------- */
STAGE.insertAdjacentHTML('beforeend', '<div class="vgn"></div>');

/* ---------- 9:16 social adaptation ---------- */
if (/[?&]v=1/.test(location.search)) {
  document.body.classList.add('v');
  const V = document.getElementById('vwrap');
  const SY = 656, K = 1080 / 1920;
  V.innerHTML = `
    <div style="position:absolute;inset:0;background:#F7F4EA"></div>
    <svg width="1080" height="1920" style="position:absolute;left:0;top:0">
      <rect width="1080" height="1920" fill="url(#pNajdi)" opacity="0.05"/>
      <rect x="0" y="${SY - 18}" width="1080" height="2" fill="#C5A059"/>
      <rect x="0" y="${SY + 1080 * K + 16}" width="1080" height="2" fill="#C5A059"/>
      ${najdiCrenel(340, SY - 18, 400, 14, '#C5A059', 0.9)}
    </svg>
    <img id="vlogo" src="assets/logo.png" style="position:absolute;left:${540 - 300}px;top:300px;width:600px">
    <div id="vsubs"></div>
    <div class="vsite">miyaarlegal.com</div>`;
  V.appendChild(STAGE);
  Object.assign(STAGE.style, { position: 'absolute', left: '0px', top: SY + 'px', transform: `scale(${K})` });
  const subs = [
    [0.05, 5.95, 'في عالم الأعمال، تبدأ الحماية القانونية من الخبرة والاستعداد.'],
    [6.3, 12.65, 'معيار ليجل للمحاماة والاستشارات القانونية، شريككم القانوني برؤية استباقية.'],
    [12.7, 17.05, 'نجمع بين المعرفة القانونية والفهم التجاري،'],
    [17.1, 22.75, 'لنقدم حلولاً دقيقة واستباقية تدعم تطلعات عملائنا.'],
    [22.8, 28.2, 'نقدم منظومة متكاملة تشمل الاستشارات القانونية، وصياغة العقود،'],
    [28.3, 33.25, 'والترافع، والتحكيم، والحوكمة، وخدمات الشركات والاستثمار وإدارة المخاطر.'],
    [33.3, 40.0, 'ونخدم الشركات والمستثمرين والجهات الحكومية والقطاع غير الربحي.'],
    [40.05, 47.2, 'نعمل بمنهجية واضحة، تبدأ بالفهم والتحليل، وتنتهي بالتنفيذ والمتابعة.'],
    [47.25, 54.65, 'نضع السرية والاحترافية والدقة وحماية مصالح العملاء في صميم عملنا.'],
    [55.0, 61.2, 'معيار ليجل... خبرة، ثقة، استدامة.']
  ];
  const box = document.getElementById('vsubs');
  subs.forEach(([a, b, s]) => {
    const d = document.createElement('div');
    d.className = 'vsub'; d.textContent = s; box.appendChild(d);
    tl.fromTo(d, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out' }, a);
    tl.to(d, { autoAlpha: 0, duration: 0.25 }, b - 0.2);
  });
  const vl = document.getElementById('vlogo');
  tl.fromTo(vl, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, 0.2);
  tl.to(vl, { autoAlpha: 0, duration: 0.4 }, 4.3);
  tl.to(vl, { autoAlpha: 1, duration: 0.5 }, 12.5);
  tl.to(vl, { autoAlpha: 0, duration: 0.4 }, 54.5);
}

/* ---------- render API ---------- */
window.DUR = DUR;
window.renderAt = (t) => {
  tl.seek(t, false);
  updaters.forEach((f) => f(t));
};
window.renderAt(0);
window.__ready = document.fonts.ready.then(() => true);
