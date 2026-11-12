// NANO PRO — PPF ad. Deterministic renderer: render(t) draws frame at time t (seconds).
const W = 1080, H = 1920;
const C = { gold: '#C5A059', black: '#333333', ivory: '#F8F6F0', white: '#FFFFFF', beige: '#EDE7DB', champ: '#D8C49B', grey: '#7a7468' };
const cv = document.getElementById('c'), c = cv.getContext('2d');
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const P = (t, a, b) => clamp((t - a) / (b - a));
const eio = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const eout = t => 1 - Math.pow(1 - t, 3);
const eback = t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
function rng(seed) { let s = (Math.imul(seed + 1, 2654435761) ^ 0x9e3779b9) >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
const ga = a => `rgba(197,160,89,${a})`;

// ---------- fonts / assets ----------
const AR = 'Alexandria', PL = 'IBM Plex Sans Arabic';
const logo = new Image(); logo.src = 'logo.png';
window.READY = false;
(async () => {
  const s = 'سيارتك PPF 0502288822 nanopro.sa – ؟';
  await Promise.all([500, 700, 800, 900].map(w => document.fonts.load(`${w} 60px ${AR}`, s)).concat(
    [400, 500].map(w => document.fonts.load(`${w} 40px "${PL}"`, s))));
  await logo.decode();
  window.READY = true;
})();

// ---------- geometry: car (side profile, local units, ground y=0, x 0..1000) ----------
function cub(s, t) { const u = 1 - t; return [u * u * u * s[0][0] + 3 * u * u * t * s[1][0] + 3 * u * t * t * s[2][0] + t * t * t * s[3][0], u * u * u * s[0][1] + 3 * u * u * t * s[1][1] + 3 * u * t * t * s[2][1] + t * t * t * s[3][1]]; }
const BODY = new Path2D();
BODY.moveTo(975, -48); BODY.lineTo(990, -60);
BODY.bezierCurveTo(1002, -80, 1004, -110, 996, -128);
BODY.bezierCurveTo(990, -142, 975, -150, 950, -156);
BODY.bezierCurveTo(880, -170, 780, -190, 690, -205);
BODY.bezierCurveTo(640, -240, 590, -285, 545, -300);
BODY.bezierCurveTo(500, -312, 440, -316, 390, -312);
BODY.bezierCurveTo(300, -300, 200, -265, 120, -232);
BODY.bezierCurveTo(80, -222, 45, -214, 25, -205);
BODY.bezierCurveTo(12, -190, 8, -160, 12, -130);
BODY.bezierCurveTo(14, -100, 18, -75, 30, -60);
BODY.arc(220, -95, 112, Math.PI - 0.35, 0.35, false);
BODY.arc(800, -95, 112, Math.PI - 0.35, 0.35, false);
BODY.closePath();
const GLASS = new Path2D();
GLASS.moveTo(672, -212); GLASS.bezierCurveTo(630, -245, 592, -280, 550, -292);
GLASS.bezierCurveTo(505, -303, 445, -306, 400, -303); GLASS.bezierCurveTo(330, -296, 270, -276, 212, -250);
GLASS.bezierCurveTo(300, -238, 500, -222, 672, -212); GLASS.closePath();
// front outline (hood back -> bumper bottom) for film sheet
const FRONT = (() => {
  const segs = [[[690, -205], [780, -190], [880, -170], [950, -156]], [[950, -156], [975, -150], [990, -142], [996, -128]], [[996, -128], [1004, -110], [1002, -80], [990, -60]]];
  const pts = []; segs.forEach((s, k) => { for (let i = (k ? 1 : 0); i <= 24; i++) pts.push(cub(s, i / 24)); });
  const S = [0]; for (let i = 1; i < pts.length; i++) S.push(S[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return { pts, S, L: S[S.length - 1] };
})();

function wheel(cx, cy, rot) {
  c.save(); c.translate(cx, cy);
  let g = c.createRadialGradient(0, 0, 60, 0, 0, 96); g.addColorStop(0, '#2b2b2d'); g.addColorStop(.8, '#161617'); g.addColorStop(1, '#0d0d0e');
  c.fillStyle = g; c.beginPath(); c.arc(0, 0, 95, 0, 7); c.fill();
  c.strokeStyle = 'rgba(255,255,255,.06)'; c.lineWidth = 3; c.beginPath(); c.arc(0, 0, 84, 0, 7); c.stroke();
  c.fillStyle = '#18191b'; c.beginPath(); c.arc(0, 0, 70, 0, 7); c.fill();
  // brake disc + gold caliper
  c.fillStyle = '#3a3b3e'; c.beginPath(); c.arc(0, 0, 52, 0, 7); c.fill();
  c.fillStyle = C.gold; c.beginPath(); c.arc(0, 0, 58, -2.3, -1.2); c.arc(0, 0, 40, -1.2, -2.3, true); c.closePath(); c.fill();
  c.rotate(rot);
  for (let i = 0; i < 10; i++) {
    c.save(); c.rotate(i * Math.PI / 5);
    g = c.createLinearGradient(0, -8, 0, 8); g.addColorStop(0, '#e2e3e6'); g.addColorStop(.5, '#a9acb1'); g.addColorStop(1, '#5d6065');
    c.fillStyle = g; c.beginPath(); c.moveTo(12, -6); c.lineTo(68, -9); c.lineTo(68, 3); c.lineTo(12, 4); c.closePath(); c.fill();
    c.restore();
  }
  c.strokeStyle = '#c8cace'; c.lineWidth = 6; c.beginPath(); c.arc(0, 0, 69, 0, 7); c.stroke();
  c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = 2; c.beginPath(); c.arc(0, 0, 65, 0, 7); c.stroke();
  g = c.createRadialGradient(-3, -3, 1, 0, 0, 15); g.addColorStop(0, '#f3e3bb'); g.addColorStop(1, '#9c7a3a');
  c.fillStyle = g; c.beginPath(); c.arc(0, 0, 14, 0, 7); c.fill();
  c.restore();
}

// o: {x,y,s, dmg:{chips:[[x,y,r]], scratches:[{a:[x,y],b:[x,y],bend,p}], scuff:a}, filmX, filmA, sheen, sweep, refl}
function drawCar(o) {
  const s = o.s;
  c.save(); c.translate(o.x, o.y); c.scale(s, s); c.translate(-500, 0);
  // contact shadow
  let g = c.createRadialGradient(510, 0, 10, 510, 0, 560);
  g.addColorStop(0, 'rgba(60,50,35,.38)'); g.addColorStop(.5, 'rgba(60,50,35,.14)'); g.addColorStop(1, 'rgba(60,50,35,0)');
  c.save(); c.scale(1, .09); c.fillStyle = g; c.beginPath(); c.arc(510, 0, 560, 0, 7); c.fill(); c.restore();
  // reflection on glossy floor
  if (o.refl === true) {
    c.save(); c.scale(1, -1); c.globalAlpha *= .10; c.fillStyle = '#2a2b2e'; c.fill(BODY);
    c.restore();
  }
  // wheel wells
  c.fillStyle = '#121213';
  for (const wx of [220, 800]) { c.beginPath(); c.arc(wx, -95, 108, Math.PI, 0); c.lineTo(wx + 108, -40); c.lineTo(wx - 108, -40); c.fill(); }
  // body paint
  c.save(); c.clip(BODY);
  g = c.createLinearGradient(0, -320, 0, -40);
  g.addColorStop(0, '#85878c'); g.addColorStop(.22, '#55575c'); g.addColorStop(.40, '#2f3034'); g.addColorStop(.47, '#62646a');
  g.addColorStop(.52, '#2a2b2e'); g.addColorStop(.8, '#18191b'); g.addColorStop(1, '#0d0d0e');
  c.fillStyle = g; c.fillRect(-20, -340, 1050, 340);
  // studio softbox reflection on upper flank
  g = c.createLinearGradient(0, -232, 0, -175);
  g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(255,253,248,.28)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  c.fillStyle = g; c.fillRect(-20, -240, 1050, 70);
  // warm gold floor bounce
  g = c.createLinearGradient(0, -120, 0, -40); g.addColorStop(0, 'rgba(197,160,89,0)'); g.addColorStop(1, 'rgba(197,160,89,.22)');
  c.fillStyle = g; c.fillRect(-20, -120, 1050, 80);
  // moving light sweep
  const sw = o.sweep ?? ((o.t || 0) * .12 % 1.6);
  if (sw > 0 && sw < 1.3) {
    const sx = lerp(-250, 1250, sw / 1.3);
    g = c.createLinearGradient(sx - 160, -320, sx + 40, -40);
    g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(255,255,255,.22)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = g; c.fillRect(-20, -340, 1050, 340);
  }
  // damage
  if (o.dmg) drawDamage(o.dmg, s);
  c.restore();
  // shoulder & character lines
  c.lineCap = 'round';
  c.strokeStyle = 'rgba(255,255,255,.42)'; c.lineWidth = 2.2;
  c.beginPath(); c.moveTo(965, -148); c.bezierCurveTo(800, -178, 500, -205, 40, -200); c.stroke();
  c.strokeStyle = 'rgba(255,255,255,.16)'; c.lineWidth = 1.6;
  c.beginPath(); c.moveTo(905, -105); c.bezierCurveTo(700, -110, 450, -108, 335, -100); c.stroke();
  c.strokeStyle = 'rgba(0,0,0,.55)'; c.lineWidth = 2;
  c.beginPath(); c.moveTo(662, -206); c.bezierCurveTo(655, -150, 650, -100, 640, -66); c.stroke();
  c.beginPath(); c.moveTo(400, -222); c.bezierCurveTo(402, -160, 395, -110, 380, -64); c.stroke();
  // door handle
  c.fillStyle = 'rgba(210,212,216,.7)'; c.fillRect(560, -178, 46, 6);
  // side skirt
  c.fillStyle = '#0c0c0d'; c.beginPath(); c.moveTo(335, -60); c.lineTo(690, -60); c.lineTo(686, -50); c.lineTo(340, -50); c.fill();
  // glass
  g = c.createLinearGradient(0, -306, 0, -212); g.addColorStop(0, '#41454c'); g.addColorStop(1, '#121417');
  c.fillStyle = g; c.fill(GLASS);
  c.save(); c.clip(GLASS);
  g = c.createLinearGradient(350, -310, 520, -210); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(255,255,255,.22)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  c.fillStyle = g; c.fillRect(200, -320, 480, 120);
  c.fillStyle = '#0d0e10'; c.beginPath(); c.moveTo(455, -306); c.lineTo(478, -306); c.lineTo(470, -215); c.lineTo(450, -217); c.fill();
  c.restore();
  c.strokeStyle = 'rgba(205,207,212,.55)'; c.lineWidth = 2.4; c.stroke(GLASS);
  // mirror
  c.fillStyle = '#26272a'; c.beginPath(); c.moveTo(662, -214); c.bezierCurveTo(645, -232, 615, -234, 604, -224); c.bezierCurveTo(610, -212, 632, -208, 662, -206); c.fill();
  // headlight
  c.save(); c.shadowColor = 'rgba(255,240,200,.9)'; c.shadowBlur = 14 * s;
  g = c.createLinearGradient(925, 0, 995, 0); g.addColorStop(0, '#f6efe0'); g.addColorStop(1, '#ffffff');
  c.fillStyle = g; c.beginPath(); c.moveTo(993, -133); c.bezierCurveTo(975, -146, 950, -151, 922, -152); c.lineTo(928, -143);
  c.bezierCurveTo(955, -141, 975, -135, 990, -125); c.closePath(); c.fill(); c.restore();
  // intake
  c.fillStyle = '#0a0a0b'; c.beginPath(); c.moveTo(958, -82); c.lineTo(996, -86); c.lineTo(994, -72); c.lineTo(954, -68); c.fill();
  c.strokeStyle = ga(.8); c.lineWidth = 1.5; c.beginPath(); c.moveTo(960, -77); c.lineTo(994, -80); c.stroke();
  // taillight
  c.save(); c.shadowColor = 'rgba(180,30,30,.6)'; c.shadowBlur = 8 * s;
  c.fillStyle = '#8c1d1d'; c.beginPath(); c.moveTo(16, -182); c.bezierCurveTo(28, -197, 50, -205, 78, -209); c.lineTo(76, -201); c.bezierCurveTo(52, -198, 33, -191, 15, -172); c.closePath(); c.fill(); c.restore();
  // wheels
  wheel(220, -95, o.wheel || 0); wheel(800, -95, (o.wheel || 0) + .3);
  // film
  if (o.filmA > 0) drawFilm(o);
  if (o.sheet != null) drawSheet(o.sheet, o.t || 0, s);
  if (o.extra) o.extra();
  c.restore();
}

function drawDamage(d, s) {
  const r = rng(7);
  for (const sc of d.scratches || []) {
    if (sc.p <= 0) continue;
    const n = 40, m = Math.floor(n * sc.p);
    const pt = i => { const k = i / n; return [lerp(sc.a[0], sc.b[0], k), lerp(sc.a[1], sc.b[1], k) - Math.sin(k * Math.PI) * sc.bend]; };
    for (const [off, col, lw] of [[1.5, 'rgba(0,0,0,.45)', 2.6], [0, 'rgba(236,232,222,.9)', 1.6], [-3, 'rgba(236,232,222,.35)', .8]]) {
      c.strokeStyle = col; c.lineWidth = lw / Math.max(s, .5); c.beginPath();
      for (let i = 0; i <= m; i++) { const q = pt(i); i ? c.lineTo(q[0], q[1] + off) : c.moveTo(q[0], q[1] + off); }
      c.stroke();
    }
  }
  for (const ch of d.chips || []) {
    if (!ch.on) continue;
    const [x, y, rr] = ch;
    c.fillStyle = 'rgba(0,0,0,.5)'; c.beginPath(); c.arc(x + .8, y + .8, rr + 1.2, 0, 7); c.fill();
    c.fillStyle = 'rgba(232,228,218,.95)'; c.beginPath();
    for (let i = 0; i < 7; i++) { const a = i / 7 * 6.28, q = rr * (.7 + .5 * r()); i ? c.lineTo(x + Math.cos(a) * q, y + Math.sin(a) * q) : c.moveTo(x + Math.cos(a) * q, y + Math.sin(a) * q); }
    c.fill();
  }
  if (d.scuff > 0) {
    c.save(); c.globalAlpha = d.scuff;
    const g = c.createRadialGradient(640, -128, 2, 640, -128, 26); g.addColorStop(0, 'rgba(230,225,214,.75)'); g.addColorStop(1, 'rgba(230,225,214,0)');
    c.fillStyle = g; c.beginPath(); c.ellipse(640, -128, 30, 13, -.1, 0, 7); c.fill();
    c.restore();
  }
}

function drawFilm(o) {
  const s = o.s;
  c.save(); c.clip(BODY); c.beginPath(); c.rect(o.filmX, -400, 1200, 420); c.clip();
  c.globalAlpha *= o.filmA;
  c.fillStyle = 'rgba(255,252,244,.08)'; c.fillRect(-30, -400, 1200, 420);
  let g = c.createLinearGradient(0, -320, 0, -150); g.addColorStop(0, 'rgba(255,255,255,.22)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  c.fillStyle = g; c.fillRect(-30, -400, 1200, 260);
  if (o.sheen > 0 && o.sheen < 1) {
    const sx = lerp(Math.max(o.filmX, 0) - 250, 1250, o.sheen);
    g = c.createLinearGradient(sx - 120, -320, sx + 60, -40);
    g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.45, 'rgba(255,250,235,.55)'); g.addColorStop(.55, 'rgba(240,220,170,.5)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = g; c.fillRect(-30, -400, 1200, 420);
  }
  c.strokeStyle = ga(.95); c.lineWidth = 4 / s; c.stroke(BODY);
  if (o.filmX > 0) {
    g = c.createLinearGradient(0, -320, 0, -40); g.addColorStop(0, ga(0)); g.addColorStop(.5, ga(.9)); g.addColorStop(1, ga(0));
    c.fillStyle = g; c.fillRect(o.filmX, -340, 2.5 / s, 300);
  }
  c.restore();
}

function drawSheet(p, t, s) {
  if (p <= 0) return;
  const e = eio(p), st = .55 + .45 * eout(clamp(p * 1.4));
  const pts = FRONT.pts.map((q, i) => {
    const k = FRONT.S[i] / FRONT.L;
    const fx = 790 + (lerp(560, 1010, k) - 790) * st, fy = -500 + 22 * Math.sin(k * 5 + t * 3) * (1 - e);
    return [lerp(fx, q[0], e), lerp(fy, q[1], e)];
  });
  const d = [-170 * (1 - e), -150 * (1 - e)];
  c.save(); c.globalAlpha *= clamp(p * 5) * (1 - P(p, .92, 1) * .9);
  const g = c.createLinearGradient(600, -600, 1050, -100);
  g.addColorStop(0, 'rgba(255,255,255,.75)'); g.addColorStop(.5, 'rgba(232,214,172,.55)'); g.addColorStop(1, 'rgba(255,255,255,.7)');
  c.fillStyle = g; c.beginPath();
  pts.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]));
  for (let i = pts.length - 1; i >= 0; i--) c.lineTo(pts[i][0] + d[0], pts[i][1] + d[1]);
  c.closePath(); c.fill();
  c.strokeStyle = ga(1); c.lineWidth = 3 / s; c.shadowColor = ga(.8); c.shadowBlur = 12;
  c.beginPath(); pts.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.stroke();
  c.strokeStyle = ga(.6); c.lineWidth = 2 / s;
  c.beginPath(); pts.forEach((q, i) => i ? c.lineTo(q[0] + d[0], q[1] + d[1]) : c.moveTo(q[0] + d[0], q[1] + d[1])); c.stroke();
  c.restore();
}

// ---------- environment ----------
function studio(floorY, top = 0, bot = H) {
  let g = c.createLinearGradient(0, top, 0, bot);
  g.addColorStop(0, '#FFFFFF'); g.addColorStop(.5, '#FAF8F3'); g.addColorStop(1, '#F1ECE1');
  c.fillStyle = g; c.fillRect(0, top, W, bot - top);
  g = c.createRadialGradient(W / 2, floorY - 280, 20, W / 2, floorY - 280, 760);
  g.addColorStop(0, 'rgba(255,255,255,.95)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  c.fillStyle = g; c.fillRect(0, top, W, bot - top);
  // floor
  g = c.createLinearGradient(0, floorY - 40, 0, Math.min(bot, floorY + 700));
  g.addColorStop(0, 'rgba(237,231,219,0)'); g.addColorStop(.08, 'rgba(237,231,219,.85)'); g.addColorStop(1, '#E6DECD');
  c.fillStyle = g; c.fillRect(0, floorY - 40, W, bot - floorY + 40);
  g = c.createRadialGradient(W / 2, floorY + 30, 10, W / 2, floorY + 30, 600);
  g.addColorStop(0, 'rgba(255,255,255,.75)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  c.save(); c.translate(0, floorY + 30); c.scale(1, .22); c.translate(0, -(floorY + 30)); c.fillStyle = g; c.fillRect(0, floorY - 600, W, 1300); c.restore();
}
function floorFade(floorY, bot = H) { // soften reflection under car
  const g = c.createLinearGradient(0, floorY, 0, floorY + 260);
  g.addColorStop(0, 'rgba(240,235,224,.35)'); g.addColorStop(1, 'rgba(232,225,211,1)');
  c.fillStyle = g; c.fillRect(0, floorY + 2, W, Math.min(260, bot - floorY));
}
function vignette() {
  const g = c.createRadialGradient(W / 2, H / 2, 600, W / 2, H / 2, 1250);
  g.addColorStop(0, 'rgba(216,196,155,0)'); g.addColorStop(1, 'rgba(200,180,140,.22)');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
}
function dust(t, n = 46, seed = 3, a = 1) {
  const r = rng(seed);
  for (let i = 0; i < n; i++) {
    const x0 = r() * W, y0 = r() * H, sp = 10 + r() * 30, rad = .8 + r() * 2.6, ph = r() * 6.28;
    const x = (x0 + Math.sin(t * .4 + ph) * 30) % W, y = ((y0 - t * sp) % H + H) % H;
    const al = (.25 + .5 * (.5 + .5 * Math.sin(t * 2 + ph))) * a;
    c.fillStyle = ga(al); c.beginPath(); c.arc(x, y, rad, 0, 7); c.fill();
    if (rad > 2.6) { c.fillStyle = ga(al * .15); c.beginPath(); c.arc(x, y, rad * 4, 0, 7); c.fill(); }
  }
}

// ---------- text ----------
function font(sz, w = 700, fam = AR) { return `${w} ${sz}px ${fam === AR ? AR : '"' + fam + '"'}`; }
function fit(str, sz, maxW, w = 700, fam = AR) { c.font = font(sz, w, fam); const m = c.measureText(str).width; return m > maxW ? Math.floor(sz * maxW / m) : sz; }
// segs: [[text,color],...] in reading order
function rt(segs, x, y, o = {}) {
  const p = o.p ?? 1; if (p <= 0) return 0;
  const sz = o.size || 60, dir = o.dir || 'rtl';
  c.save(); c.font = font(sz, o.w || 700, o.fam || AR); c.direction = dir; c.textBaseline = 'middle';
  const ws = segs.map(s => c.measureText(s[0]).width), tot = ws.reduce((a, b) => a + b, 0);
  const al = o.align || 'center';
  const right = al === 'center' ? x + tot / 2 : al === 'right' ? x : x + tot;
  const e = eout(p);
  c.globalAlpha *= clamp(p * 1.6) * (o.a ?? 1);
  c.beginPath();
  if (dir === 'rtl') c.rect(right - (tot + 60) * e - 10, y - sz * 1.2, tot + 80, sz * 2.4);
  else c.rect(right - tot - 30, y - sz * 1.2, (tot + 60) * e, sz * 2.4);
  c.clip();
  c.translate(0, (1 - e) * sz * .35);
  if (o.shadow) { c.shadowColor = o.shadow; c.shadowBlur = 18; }
  if (dir === 'rtl') { c.textAlign = 'right'; let xx = right; segs.forEach((s, i) => { c.fillStyle = s[1]; c.fillText(s[0], xx, y); xx -= ws[i]; }); }
  else { c.textAlign = 'left'; let xx = right - tot; segs.forEach((s, i) => { c.fillStyle = s[1]; c.fillText(s[0], xx, y); xx += ws[i]; }); }
  c.restore(); return tot;
}
function goldGrad(x0, x1) { const g = c.createLinearGradient(x0, 0, x1, 0); g.addColorStop(0, '#a8823f'); g.addColorStop(.35, '#e2c88f'); g.addColorStop(.6, '#C5A059'); g.addColorStop(1, '#9b7739'); return g; }
function rrect(x, y, w, h, r) { c.beginPath(); c.roundRect(x, y, w, h, r); }
function pill(x, y, w, h, o = {}) {
  c.save(); c.globalAlpha *= (o.a ?? 1);
  c.shadowColor = 'rgba(120,95,50,.18)'; c.shadowBlur = 30; c.shadowOffsetY = 8;
  rrect(x, y, w, h, o.r ?? h / 2); c.fillStyle = o.fill || 'rgba(255,255,255,.92)'; c.fill();
  c.shadowColor = 'transparent'; c.strokeStyle = o.stroke || ga(.9); c.lineWidth = o.lw || 2; c.stroke();
  c.restore();
}

// ---------- icons (centered, unit ~ 1 = 50px) ----------
function icon(name, x, y, s, col = C.gold, lw = 4, p = 1) {
  c.save(); c.translate(x, y); c.scale(s, s); c.strokeStyle = col; c.fillStyle = col; c.lineWidth = lw / s; c.lineCap = 'round'; c.lineJoin = 'round';
  c.beginPath();
  if (name === 'shield') { c.moveTo(0, -42); c.lineTo(34, -30); c.lineTo(32, 6); c.bezierCurveTo(28, 26, 14, 36, 0, 44); c.bezierCurveTo(-14, 36, -28, 26, -32, 6); c.lineTo(-34, -30); c.closePath(); c.stroke(); c.beginPath(); c.moveTo(-13, 2); c.lineTo(-3, 12); c.lineTo(16, -10); c.stroke(); }
  if (name === 'stone') { c.moveTo(-22, 8); c.lineTo(-12, -18); c.lineTo(10, -22); c.lineTo(26, -4); c.lineTo(18, 18); c.lineTo(-8, 22); c.closePath(); c.stroke(); c.beginPath(); c.moveTo(-34, -30); c.lineTo(-24, -22); c.moveTo(-38, -10); c.lineTo(-30, -8); c.stroke(); }
  if (name === 'scratch') { for (let i = -1; i <= 1; i++) { c.moveTo(-26 + i * 14, 26 - i * 4); c.quadraticCurveTo(0 + i * 10, 0, 22 + i * 14, -28 - i * 4); } c.stroke(); }
  if (name === 'scratchless') { c.moveTo(-28, 22); c.quadraticCurveTo(-4, 0, 22, -26); c.stroke(); c.globalAlpha *= .35; c.beginPath(); c.moveTo(-10, 30); c.quadraticCurveTo(10, 10, 32, -10); c.stroke(); c.globalAlpha /= .35; c.beginPath(); c.arc(0, 0, 44, -2.4, -.8, true); c.stroke(); }
  if (name === 'door') { c.roundRect(-26, -34, 52, 68, 8); c.moveTo(4, 2); c.lineTo(18, 2); c.stroke(); c.beginPath(); c.moveTo(-40, -12); c.lineTo(-32, -6); c.moveTo(-42, 8); c.lineTo(-32, 6); c.stroke(); }
  if (name === 'sun') { c.arc(0, 0, 14, 0, 7); c.stroke(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; c.beginPath(); c.moveTo(Math.cos(a) * 24, Math.sin(a) * 24); c.lineTo(Math.cos(a) * 36, Math.sin(a) * 36); c.stroke(); } }
  if (name === 'sparkle') { const st = (r, sx, sy) => { c.moveTo(sx, sy - r); c.quadraticCurveTo(sx, sy, sx + r, sy); c.quadraticCurveTo(sx, sy, sx, sy + r); c.quadraticCurveTo(sx, sy, sx - r, sy); c.quadraticCurveTo(sx, sy, sx, sy - r); }; st(30, -4, 4); st(13, 24, -24); c.stroke(); }
  if (name === 'diamond') { c.moveTo(-34, -10); c.lineTo(-20, -28); c.lineTo(20, -28); c.lineTo(34, -10); c.lineTo(0, 32); c.closePath(); c.moveTo(-34, -10); c.lineTo(34, -10); c.moveTo(-8, -28); c.lineTo(-14, -10); c.lineTo(0, 32); c.lineTo(14, -10); c.lineTo(8, -28); c.stroke(); }
  if (name === 'phone') { c.moveTo(-18, -26); c.bezierCurveTo(-30, -14, -22, 8, -6, 22); c.bezierCurveTo(8, 34, 22, 30, 26, 22); c.lineTo(16, 10); c.lineTo(6, 14); c.bezierCurveTo(-4, 8, -10, 0, -12, -8); c.lineTo(-6, -16); c.lineTo(-14, -30); c.closePath(); c.stroke(); }
  if (name === 'globe') { c.arc(0, 0, 28, 0, 7); c.moveTo(-28, 0); c.lineTo(28, 0); c.moveTo(0, -28); c.bezierCurveTo(-18, -14, -18, 14, 0, 28); c.bezierCurveTo(18, 14, 18, -14, 0, -28); c.stroke(); }
  if (name === 'pin') { c.moveTo(0, 32); c.bezierCurveTo(-14, 14, -26, 2, -26, -10); c.arc(0, -10, 26, Math.PI, 0); c.bezierCurveTo(26, 2, 14, 14, 0, 32); c.stroke(); c.beginPath(); c.arc(0, -10, 9, 0, 7); c.stroke(); }
  c.restore();
}
function badge(name, x, y, r, p, o = {}) {
  if (p <= 0) return; const e = eback(clamp(p));
  c.save(); c.translate(x, y); c.scale(e, e); c.globalAlpha *= clamp(p * 2);
  c.shadowColor = 'rgba(150,115,50,.25)'; c.shadowBlur = 26; c.shadowOffsetY = 6;
  c.fillStyle = o.fill || '#fff'; c.beginPath(); c.arc(0, 0, r, 0, 7); c.fill(); c.shadowColor = 'transparent';
  c.strokeStyle = ga(.95); c.lineWidth = 2.5; c.beginPath(); c.arc(0, 0, r, -Math.PI / 2, -Math.PI / 2 + 6.283 * clamp(p * 1.3)); c.stroke();
  c.strokeStyle = ga(.25); c.lineWidth = 1.5; c.beginPath(); c.arc(0, 0, r + 9, 0, 7); c.stroke();
  icon(name, 0, 0, r / 62, o.col || C.gold, o.lw || 4.5);
  c.restore();
}

// ---------- stones ----------
function stone(x, y, sz, rot, seed = 1, a = 1) {
  const r = rng(seed); c.save(); c.translate(x, y); c.rotate(rot); c.globalAlpha *= a;
  const g = c.createLinearGradient(-sz, -sz, sz, sz); g.addColorStop(0, '#d8d0c0'); g.addColorStop(1, '#7d7568');
  c.fillStyle = g; c.beginPath();
  for (let i = 0; i < 7; i++) { const an = i / 7 * 6.28, q = sz * (.7 + .4 * r()); i ? c.lineTo(Math.cos(an) * q, Math.sin(an) * q) : c.moveTo(Math.cos(an) * q, Math.sin(an) * q); }
  c.closePath(); c.fill(); c.restore();
}
function ripple(x, y, p, rmax, col = ga) {
  if (p <= 0 || p >= 1) return;
  c.save(); for (let k = 0; k < 2; k++) { const q = clamp(p * 1.2 - k * .2); if (q <= 0) continue; c.strokeStyle = col((1 - q) * .9); c.lineWidth = 3 * (1 - q) + 1; c.beginPath(); c.arc(x, y, rmax * eout(q), 0, 7); c.stroke(); }
  c.restore();
}
function burst(x, y, p, n, len, seed, col = 'rgba(225,218,204,') {
  if (p <= 0 || p >= 1) return; const r = rng(seed);
  for (let i = 0; i < n; i++) { const a = r() * 6.28, sp = len * (.5 + r() * .7); const px = x + Math.cos(a) * sp * eout(p), py = y + Math.sin(a) * sp * eout(p) + 60 * p * p * (len / 60);
    c.fillStyle = col + (1 - p) + ')'; c.beginPath(); c.arc(px, py, 1.5 + r() * 2.5, 0, 7); c.fill(); }
}

// ---------- paint macro ----------
function macro(x, y, w, h, t, k, u, seed = 11, opt = {}) {
  c.save(); rrect(x, y, w, h, opt.r ?? 40); c.clip();
  let g = c.createLinearGradient(x, y, x + w, y + h);
  g.addColorStop(0, '#45474c'); g.addColorStop(.4, '#25262a'); g.addColorStop(.7, '#4a4c52'); g.addColorStop(1, '#1b1c1f');
  c.fillStyle = g; c.fillRect(x, y, w, h);
  const dr = t * 18;
  c.filter = 'blur(28px)';
  c.strokeStyle = 'rgba(255,252,244,.42)'; c.lineWidth = h * .11;
  c.beginPath(); c.moveTo(x - 100, y + h * .30 + dr * .3); c.bezierCurveTo(x + w * .3, y + h * .12, x + w * .7, y + h * .42, x + w + 100, y + h * .18 - dr * .2); c.stroke();
  c.strokeStyle = 'rgba(216,186,120,.28)'; c.lineWidth = h * .09;
  c.beginPath(); c.moveTo(x - 100, y + h * .78); c.bezierCurveTo(x + w * .35, y + h * .62 + dr * .2, x + w * .65, y + h * .9, x + w + 100, y + h * .7); c.stroke();
  c.filter = 'blur(2px)';
  c.strokeStyle = 'rgba(255,255,255,.5)'; c.lineWidth = 3;
  c.beginPath(); c.moveTo(x - 50, y + h * .27 + dr * .3); c.bezierCurveTo(x + w * .3, y + h * .1, x + w * .7, y + h * .4, x + w + 50, y + h * .16 - dr * .2); c.stroke();
  c.filter = 'none';
  const r = rng(seed);
  for (let i = 0; i < 520; i++) { const fx = x + r() * w, fy = y + r() * h, tw = .5 + .5 * Math.sin(t * 3 + i); c.fillStyle = `rgba(255,248,230,${.06 + .22 * tw * r()})`; c.fillRect(fx, fy, 1.6, 1.6); }
  const X = f => x + f * w, Y = f => y + f * h;
  if (k === 0) { // stones
    const hits = [[.25, .62, .42], [.5, .36, .6], [.72, .7, .68], [.95, .48, .3]];
    hits.forEach(([ht, fx, fy], i) => {
      const tx = X(fx), ty = Y(fy);
      if (u >= ht) {
        const cr = 15 + i * 2;
        c.fillStyle = 'rgba(0,0,0,.55)'; c.beginPath(); c.arc(tx + 2, ty + 2, cr + 3, 0, 7); c.fill();
        const gg = c.createRadialGradient(tx - 3, ty - 3, 1, tx, ty, cr); gg.addColorStop(0, '#efebe2'); gg.addColorStop(.7, '#bdb6a8'); gg.addColorStop(1, '#6f6a62');
        c.fillStyle = gg; c.beginPath(); const rr = rng(40 + i); for (let j = 0; j < 9; j++) { const a = j / 9 * 6.28, q = cr * (.75 + .35 * rr()); j ? c.lineTo(tx + Math.cos(a) * q, ty + Math.sin(a) * q) : c.moveTo(tx + Math.cos(a) * q, ty + Math.sin(a) * q); } c.fill();
        c.strokeStyle = 'rgba(230,225,214,.55)'; c.lineWidth = 1.2;
        for (let j = 0; j < 5; j++) { const a = rr() * 6.28, l = cr * (1.4 + rr() * 1.4); c.beginPath(); c.moveTo(tx + Math.cos(a) * cr * .8, ty + Math.sin(a) * cr * .8); c.lineTo(tx + Math.cos(a + .2) * l, ty + Math.sin(a + .2) * l); c.stroke(); }
        burst(tx, ty, (u - ht) / .35, 12, 90, 50 + i);
      } else if (u > ht - .3) {
        const q = (u - (ht - .3)) / .3, sx = lerp(tx + w * .35, tx, q), sy = lerp(ty - h * .45, ty, q);
        c.strokeStyle = `rgba(255,250,240,${.25 * q})`; c.lineWidth = 3 * q; c.beginPath(); c.moveTo(sx, sy); c.lineTo(sx + 60, sy - 80); c.stroke();
        stone(sx, sy, lerp(5, 28, q * q), u * 9 + i, 60 + i);
      }
    });
  }
  if (k === 1) { // scratches
    const sc = [[[.12, .28], [.55, .40], [.9, .30], .05, .45], [[.08, .55], [.5, .5], [.94, .62], .35, .75], [[.2, .82], [.6, .72], [.85, .86], .65, 1.05]];
    sc.forEach(([a, m, b, t0, t1]) => {
      const p = clamp((u - t0) / (t1 - t0)); if (p <= 0) return;
      const pt = q => { const v = 1 - q; return [X(v * v * a[0] + 2 * v * q * m[0] + q * q * b[0]), Y(v * v * a[1] + 2 * v * q * m[1] + q * q * b[1])]; };
      for (const [off, col, lw] of [[3, 'rgba(0,0,0,.55)', 5], [0, 'rgba(238,234,226,.92)', 2.6], [-5, 'rgba(238,234,226,.35)', 1], [6, 'rgba(238,234,226,.25)', .8]]) {
        c.strokeStyle = col; c.lineWidth = lw; c.beginPath();
        for (let i = 0; i <= 50 * p; i++) { const q = pt(i / 50); i ? c.lineTo(q[0], q[1] + off) : c.moveTo(q[0], q[1] + off); } c.stroke();
      }
      if (p < 1) { const q = pt(p); const gg = c.createRadialGradient(q[0], q[1], 0, q[0], q[1], 26); gg.addColorStop(0, 'rgba(255,248,225,.95)'); gg.addColorStop(1, 'rgba(197,160,89,0)'); c.fillStyle = gg; c.beginPath(); c.arc(q[0], q[1], 26, 0, 7); c.fill(); }
    });
  }
  if (k === 2) { // door contact
    const hit = .45, mx = X(.2), my = Y(.5);
    if (u >= hit) {
      const a = clamp((u - hit) / .15);
      c.save(); c.globalAlpha = a;
      let gg = c.createRadialGradient(mx, my, 4, mx, my, 120); gg.addColorStop(0, 'rgba(0,0,0,.45)'); gg.addColorStop(.6, 'rgba(0,0,0,.15)'); gg.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = gg; c.beginPath(); c.ellipse(mx + 10, my, 70, 120, 0, 0, 7); c.fill();
      gg = c.createRadialGradient(mx - 10, my - 20, 2, mx, my, 90); gg.addColorStop(0, 'rgba(236,230,218,.75)'); gg.addColorStop(1, 'rgba(236,230,218,0)');
      c.fillStyle = gg; c.beginPath(); c.ellipse(mx, my, 34, 95, -.05, 0, 7); c.fill();
      c.strokeStyle = 'rgba(236,230,218,.6)'; c.lineWidth = 1.5;
      for (let j = 0; j < 6; j++) { c.beginPath(); c.moveTo(mx - 8 + j * 4, my - 70 + j * 6); c.lineTo(mx + 22 + j * 4, my - 40 + j * 14); c.stroke(); }
      c.restore();
      ripple(mx, my, (u - hit) / .5, 160, a2 => `rgba(255,250,240,${a2 * .6})`);
    }
    const dx = u < hit ? lerp(-w * .55, 0, eio(u / hit)) : lerp(0, -w * .25, eout(clamp((u - hit) / .5)));
    c.save(); c.filter = 'blur(3px)'; c.translate(dx, 0);
    const ex = x + w * .2 - 12;
    let gg = c.createLinearGradient(ex - 300, 0, ex, 0); gg.addColorStop(0, '#d9d2c4'); gg.addColorStop(.85, '#f4f0e8'); gg.addColorStop(1, '#b9b1a2');
    c.fillStyle = gg; rrect(ex - 340, y - 40, 340, h + 80, 60); c.fill();
    c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(ex - 6, y, 6, h);
    c.restore();
  }
  if (k === 3) { // sun & environment
    const sx = X(.82), sy = Y(.1), p = clamp(u / 1.1);
    const rr = rng(80);
    for (let i = 0; i < 9; i++) {
      const fx = X(.1 + rr() * .8), fy = Y(.3 + rr() * .6), rad = 8 + rr() * 16, a = clamp((u - i * .09) / .3);
      if (a <= 0) continue; c.strokeStyle = `rgba(245,240,230,${.45 * a})`; c.lineWidth = 2; c.beginPath(); c.arc(fx, fy, rad, 0, 7); c.stroke();
      c.fillStyle = `rgba(245,240,230,${.10 * a})`; c.fill();
    }
    c.save(); c.filter = 'blur(40px)'; c.fillStyle = `rgba(237,225,200,${.25 * p})`;
    c.beginPath(); c.ellipse(X(.4), Y(.55), w * .35, h * .2, .3, 0, 7); c.fill(); c.filter = 'none'; c.restore();
    g = c.createRadialGradient(sx, sy, 10, sx, sy, w * .75);
    g.addColorStop(0, `rgba(255,255,250,${.95 * p})`); g.addColorStop(.18, `rgba(255,236,190,${.7 * p})`); g.addColorStop(1, 'rgba(197,160,89,0)');
    c.fillStyle = g; c.fillRect(x, y, w, h);
    c.save(); c.translate(sx, sy); c.rotate(u * .25);
    for (let i = 0; i < 14; i++) { c.rotate(Math.PI / 7); c.fillStyle = `rgba(255,240,205,${.12 * p})`; c.beginPath(); c.moveTo(0, 0); c.lineTo(w * 1.2, -18); c.lineTo(w * 1.2, 18); c.fill(); }
    c.restore();
  }
  if (opt.film) {
    c.fillStyle = 'rgba(255,252,244,.07)'; c.fillRect(x, y, w, h);
    if (opt.sheen > 0 && opt.sheen < 1) { const sx = lerp(x - 200, x + w + 200, opt.sheen); const gg = c.createLinearGradient(sx - 120, y, sx + 120, y + h * .3); gg.addColorStop(0, 'rgba(255,255,255,0)'); gg.addColorStop(.5, 'rgba(255,248,230,.4)'); gg.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = gg; c.fillRect(x, y, w, h); }
  }
  c.restore();
  c.save(); c.strokeStyle = ga(.95); c.lineWidth = opt.film ? 5 : 3; rrect(x, y, w, h, opt.r ?? 40); c.stroke(); c.restore();
}
function card(x, y, w, h, r = 40) { c.save(); c.shadowColor = 'rgba(110,85,40,.28)'; c.shadowBlur = 50; c.shadowOffsetY = 18; rrect(x, y, w, h, r); c.fillStyle = '#222'; c.fill(); c.restore(); }

// ---------- scenes ----------
const S1_HITS = [0.8, 1.3, 1.8, 2.3, 2.8, 3.3, 3.8];
const TARGETS = [[988, -100], [962, -150], [905, -166], [996, -118], [932, -158], [975, -84], [860, -174]];

function carPanel(t, top, bot, floorY, prot, zoom) {
  c.save(); c.beginPath(); c.rect(0, top, W, bot - top); c.clip();
  studio(floorY, top, bot);
  const s = .94, cx = 540, ax = cx + (850 - 500) * s, ay = floorY - 160 * s;
  c.translate(ax, ay); c.scale(zoom, zoom); c.translate(-ax, -ay);
  const inP = eout(P(t, 0, .7));
  const X = cx + (prot ? -1 : 1) * (1 - inP) * 80;
  const chips = TARGETS.map((q, i) => { const a = [q[0], q[1], 5 + (i % 3)]; a.on = !prot && t >= S1_HITS[i]; return a; });
  const dmg = prot ? null : {
    chips, scuff: P(t, 3.1, 3.3), scratches: [
      { a: [560, -150], b: [720, -132], bend: 8, p: P(t, 1.5, 1.9) },
      { a: [420, -118], b: [610, -158], bend: -6, p: P(t, 2.6, 3.0) },
      { a: [230, -185], b: [380, -150], bend: 6, p: P(t, 3.5, 3.9) }]
  };
  c.globalAlpha = inP;
  drawCar({ x: X, y: floorY, s, t, dmg, filmX: -20, filmA: prot ? 1 : 0, sheen: prot ? ((t - .9) / 1.3) % 1.1 : 0, sweep: (t * .3) % 1.6, extra: () => {
    // stones in car-local coords
    S1_HITS.forEach((ht, i) => {
      const h0 = ht + (prot ? .2 : 0), [tx, ty] = TARGETS[i], q = (t - (h0 - .42)) / .42;
      if (q > 0 && q < 1) { const sx = lerp(1320, tx + 6, q), sy = lerp(-230 - (i % 3) * 50, ty, q); c.strokeStyle = `rgba(150,140,120,${.35 * q})`; c.lineWidth = 2; c.beginPath(); c.moveTo(sx, sy); c.lineTo(sx + 70, sy - 14); c.stroke(); stone(sx, sy, 9, t * 8 + i, i + 3); }
      if (q >= 1) {
        const k = (t - h0);
        if (prot) { if (k < .6) { stone(tx + 6 + k * 420, ty - k * 260 + k * k * 600, 9, t * 8, i + 3, 1 - k / .6); } ripple(tx, ty, k / .5, 46); if (k < .25) { c.fillStyle = `rgba(255,245,215,${(1 - k / .25) * .9})`; c.beginPath(); c.arc(tx, ty, 10, 0, 7); c.fill(); } }
        else burst(tx, ty, k / .4, 8, 40, 20 + i);
      }
    });
  } });
  c.globalAlpha = 1;
  floorFade(floorY, bot);
  c.restore();
}

function s1(t) {
  const zoom = 1 + .2 * eio(P(t, 2.4, 4.8));
  carPanel(t, 0, 960, 700, false, zoom);
  carPanel(t, 960, H, 1590, true, zoom);
  dust(t, 30, 5, .8);
  // labels
  rt([['بدون حماية', C.black]], 1000, 150, { size: 44, align: 'right', p: P(t, .3, .8) });
  rt([['أضرار يومية تتراكم على الطلاء', C.grey]], 1000, 210, { size: 30, w: 500, align: 'right', p: P(t, .5, 1) });
  rt([['مع حماية ', C.black], ['PPF', C.gold]], 1000, 1080, { size: 44, align: 'right', p: P(t, .4, .9) });
  rt([['طبقة شفافة فوق الطلاء الأصلي', C.grey]], 1000, 1140, { size: 30, w: 500, align: 'right', p: P(t, .6, 1.1) });
  // threat badges (top) & shield badge (bottom)
  [['stone', 150, 300, 1.0], ['scratch', 290, 300, 1.25], ['door', 430, 300, 1.5]].forEach(([n, x, y, t0]) => badge(n, x, y + Math.sin(t * 2 + x) * 5, 42, P(t, t0, t0 + .4), { col: C.black, lw: 4 }));
  badge('shield', 150, 1190 + Math.sin(t * 2) * 5, 46, P(t, 1.2, 1.6));
  // divider
  const dp = eio(P(t, .05, .7));
  const g = c.createLinearGradient(0, 0, W, 0); g.addColorStop(0, ga(0)); g.addColorStop(.5, ga(1)); g.addColorStop(1, ga(0));
  c.fillStyle = '#F8F6F0'; c.fillRect(0, 952, W, 16);
  c.fillStyle = g; c.fillRect(W / 2 - 540 * dp, 958, 1080 * dp, 4);
  // headline card
  const q1 = P(t, .2, .7), q2 = P(t, 2.25, 2.75), out1 = P(t, 2.0, 2.25);
  const cw = 940, ch = 170, cy = 960 - ch / 2;
  pill(70, cy, cw, ch, { r: 34, a: eout(P(t, .1, .5)) });
  if (q1 > 0 && out1 < 1) { c.save(); c.globalAlpha = 1 - out1; rt([['سيارتك ', C.black], ['كم تساوي؟', C.gold]], 540, 960, { size: 78, w: 800, p: q1 }); c.restore(); }
  if (q2 > 0) { const sz = fit('وكم يستحق طلاءها من الحماية؟', 64, 860, 800); rt([['وكم يستحق طلاءها من ', C.black], ['الحماية؟', C.gold]], 540, 960, { size: sz, w: 800, p: q2 }); }
}

const TH = ['حصى الطريق', 'الخدوش اليومية', 'آثار الاستخدام', 'العوامل الخارجية'];
const THI = ['stone', 'scratch', 'door', 'sun'];
function s2(t) {
  const T0 = 4.8, D = 1.2, CL = 9.6;
  studio(1500); vignette(); dust(t, 34, 9, .9);
  if (t < CL + .35) {
    const k = Math.min(3, Math.floor((t - T0) / D)), u = t - T0 - k * D;
    const out = P(t, CL, CL + .35);
    c.save(); c.globalAlpha = 1 - out;
    const sc = 1 + .04 * u;
    const x = 70, y = 330, w = 940, h = 1040;
    card(x + 20, y + 20, w - 40, h - 40);
    c.save(); c.translate(540, y + h / 2); c.scale(sc, sc); c.translate(-540, -(y + h / 2));
    c.beginPath(); c.rect(x - 200, y - 200, w + 400, h + 400); c.clip();
    c.restore();
    macro(x, y, w, h, t, k, u, 11 + k);
    // flash at cut
    const fl = 1 - clamp(u / .18); if (fl > 0) { c.save(); rrect(x, y, w, h, 40); c.clip(); c.fillStyle = `rgba(255,252,244,${fl * .85})`; c.fillRect(x, y, w, h); c.restore(); }
    // counter + label
    rt([[`0${k + 1}`, C.gold], [' / 04', C.grey]], 80, 250, { size: 40, w: 700, dir: 'ltr', align: 'left', p: 1 });
    rt([['تهديدات يومية للطلاء', C.black]], 1000, 250, { size: 38, w: 700, align: 'right', p: P(t, T0 + .1, T0 + .5) });
    badge(THI[k], 920, 1480, 50, clamp(u / .35));
    const tw = rt([[TH[k], C.black]], 840, 1480, { size: 76, w: 800, align: 'right', p: clamp((u - .05) / .35) });
    c.fillStyle = C.gold; const lp = eout(clamp((u - .15) / .4)); c.fillRect(840 - tw * lp, 1540, tw * lp, 5);
    c.restore();
  }
  if (t >= CL) {
    const pos = [[555, 300], [75, 300], [555, 790], [75, 790]];
    pos.forEach(([x, y], i) => {
      const p = eback(clamp((t - CL - .1 - i * .12) / .4)); if (p <= 0) return;
      c.save(); c.globalAlpha = clamp(p); c.translate(x + 225, y + 225); c.scale(.85 + .15 * p, .85 + .15 * p); c.translate(-(x + 225), -(y + 225));
      card(x + 12, y + 12, 426, 426, 30);
      macro(x, y, 450, 450, t, i, 3, 11 + i, { r: 30 });
      pill(x + 225 - 165, y + 380, 330, 56, { a: 1 });
      rt([[TH[i], C.black]], x + 225, y + 408, { size: 32, w: 700 });
      c.restore();
    });
    const q = P(t, CL + .5, CL + 1.0);
    rt([['كلها تهدد ', C.black], ['جمال الطلاء', C.gold]], 540, 1380, { size: 70, w: 800, p: q });
    rt([['كل يوم', C.black]], 540, 1480, { size: 70, w: 800, p: P(t, CL + .9, CL + 1.4) });
  }
}

function slab(x0, y, w, dep, sk, th, style, a) {
  if (a <= 0) return;
  c.save(); c.globalAlpha *= a;
  const A = [x0, y], B = [x0 + w, y], Cc = [x0 + w + sk, y - dep], D = [x0 + sk, y - dep];
  const poly = pts => { c.beginPath(); pts.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.closePath(); };
  const front = [A, B, [B[0], B[1] + th], [A[0], A[1] + th]], side = [B, Cc, [Cc[0], Cc[1] + th], [B[0], B[1] + th]], top = [A, B, Cc, D];
  if (style === 'paint') {
    c.save(); c.shadowColor = 'rgba(90,70,35,.3)'; c.shadowBlur = 40; c.shadowOffsetY = 20; poly(front); c.fillStyle = '#1d1e21'; c.fill(); c.restore();
    poly(side); c.fillStyle = '#2b2c30'; c.fill();
    poly(top); let g = c.createLinearGradient(x0, y, x0 + w + sk, y - dep); g.addColorStop(0, '#2a2b2f'); g.addColorStop(.5, '#5d5f65'); g.addColorStop(1, '#2a2b2f'); c.fillStyle = g; c.fill();
    c.save(); poly(top); c.clip(); const r = rng(5); for (let i = 0; i < 260; i++) { c.fillStyle = `rgba(255,248,230,${.1 + .3 * r()})`; c.fillRect(x0 + r() * (w + sk), y - dep + r() * dep, 1.6, 1.6); } c.restore();
  } else {
    const fa = style === 'film' ? .26 : .5;
    poly(front); c.fillStyle = style === 'film' ? 'rgba(216,196,155,.45)' : 'rgba(255,255,255,.7)'; c.fill();
    poly(side); c.fillStyle = style === 'film' ? 'rgba(197,160,89,.35)' : 'rgba(255,255,255,.55)'; c.fill();
    poly(top); let g = c.createLinearGradient(x0, y, x0 + w + sk, y - dep); g.addColorStop(0, `rgba(255,255,255,${fa})`); g.addColorStop(.5, `rgba(255,255,255,${fa * .35})`); g.addColorStop(1, `rgba(255,255,255,${fa})`); c.fillStyle = g; c.fill();
    c.strokeStyle = style === 'film' ? ga(1) : 'rgba(255,255,255,.95)'; c.lineWidth = style === 'film' ? 2.5 : 2; c.stroke();
    if (style === 'coat') { c.strokeStyle = ga(.6); c.lineWidth = 1.5; c.stroke(); }
  }
  c.restore();
}

function s3(t) {
  const T = t - 11.75;
  studio(1330); vignette();
  const ex = eio(P(T, 3.3, 4.2)); // explode transition
  const bo = P(T, 6.45, 6.75);     // to before/after
  // header
  const hs = lerp(1, .68, ex);
  c.save(); c.translate(540, lerp(330, 240, ex)); c.scale(hs, hs);
  c.font = font(210, 900); c.textAlign = 'center'; c.textBaseline = 'middle'; c.direction = 'ltr';
  const hp = eout(P(T, .1, .6)); c.globalAlpha = hp; c.fillStyle = goldGrad(-220, 220); c.translate(0, (1 - hp) * 40);
  c.shadowColor = ga(.35); c.shadowBlur = 30; c.fillText('PPF', 0, 0); c.restore();
  rt([['درع شفاف ', C.gold], ['لطلاء سيارتك', C.black]], 540, lerp(500, 370, ex), { size: lerp(66, 52, ex), w: 800, p: P(T, .7, 1.2) });
  // car + film
  if (bo < 1) {
    c.save(); c.globalAlpha = 1 - bo;
    const cs = lerp(1.0 + .03 * clamp(T / 3.3), .62, ex), cy = lerp(1330, 820, ex);
    const sheet = T < 3.1 ? P(T, .7, 2.9) : null;
    drawCar({ x: 540, y: cy, s: cs, t, filmX: 680, filmA: P(T, 2.75, 3.05), sheen: P(T, 3.0, 3.9), sweep: .05 + T * .18, sheet, extra: () => {
      // gold trace along film edge
      const tp = P(T, 2.9, 3.6);
      if (tp > 0 && tp < 1) { c.save(); c.strokeStyle = ga(1); c.lineWidth = 5 / cs; c.shadowColor = ga(1); c.shadowBlur = 16; c.beginPath(); const n = Math.floor(FRONT.pts.length * tp); FRONT.pts.slice(0, n + 1).forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.stroke(); const q = FRONT.pts[n]; c.fillStyle = '#fff6dc'; c.beginPath(); c.arc(q[0], q[1], 7 / cs, 0, 7); c.fill(); c.restore(); }
      if (ex > 0) { c.save(); c.globalAlpha *= ex; c.strokeStyle = ga(1); c.lineWidth = 4 / cs; c.beginPath(); c.arc(845, -172, 46, 0, 7); c.stroke(); c.restore(); }
    } });
    floorFade(cy);
    // exploded stack
    if (ex > 0) {
      const hx = 540 + (845 - 500) * .62, hy = 820 - 172 * .62 + 46 * .62;
      const lp = eio(P(T, 3.7, 4.2));
      c.strokeStyle = ga(.9); c.lineWidth = 2.5; c.setLineDash([8, 8]); c.beginPath(); c.moveTo(hx, hy); c.lineTo(hx, lerp(hy, 980, lp)); c.stroke(); c.setLineDash([]);
      const g2 = eio(P(T, 4.0, 5.0)) * 120;
      const x0 = 70, w = 470, dep = 170, sk = 160, yP = 1400;
      const yF = yP - 16 - g2, yC = yF - 10 - g2;
      const ap = P(T, 3.8, 4.3);
      slab(x0, yP, w, dep, sk, 36, 'paint', ap);
      slab(x0, yF, w, dep, sk, 16, 'film', P(T, 4.0, 4.4));
      slab(x0, yC, w, dep, sk, 9, 'coat', P(T, 4.2, 4.6));
      const lab = [[yP, 'الطلاء الأصلي', 4.3, C.black], [yF, 'فيلم PPF الشفاف', 4.75, C.gold], [yC, 'سطح خارجي ناعم', 5.2, C.black]];
      lab.forEach(([yy, s, t0, col]) => {
        const p = P(T, t0, t0 + .4); if (p <= 0) return;
        const sx = x0 + w + sk / 2, sy = yy - dep / 2 + 6;
        c.font = font(40, 700); const tw = c.measureText(s).width; const ex2 = 1010 - tw - 24;
        c.strokeStyle = ga(.95 * p); c.lineWidth = 2.5; c.beginPath(); c.moveTo(sx, sy); c.lineTo(lerp(sx, ex2, eout(p)), sy); c.stroke();
        c.fillStyle = ga(p); c.beginPath(); c.arc(sx, sy, 6, 0, 7); c.fill();
        rt([[s, col]], 1010, sy, { size: 40, align: 'right', p });
      });
    }
    c.restore();
  }
  // before / after
  if (bo > 0) {
    const U = T - 6.45, hit = .55, sheen = P(U, hit + .1, hit + .9);
    c.save(); c.globalAlpha = bo;
    card(565, 575, 425, 690); card(85, 575, 425, 690);
    macro(550, 560, 455, 720, t, -1, 0, 21, { r: 34 });
    macro(75, 560, 455, 720, t, -1, 0, 22, { r: 34, film: true, sheen });
    const [rx, ry, lx, ly] = [778, 900, 302, 900];
    if (U < hit) { const q = clamp((U - (hit - .4)) / .4); if (q > 0) { stone(lerp(rx + 160, rx, q), lerp(ry - 260, ry, q), lerp(6, 22, q * q), U * 8, 4); stone(lerp(lx + 160, lx, q), lerp(ly - 260, ly, q), lerp(6, 22, q * q), U * 8, 4); } }
    else {
      const k = U - hit;
      c.save(); rrect(550, 560, 455, 720, 34); c.clip();
      c.fillStyle = 'rgba(0,0,0,.55)'; c.beginPath(); c.arc(rx + 2, ry + 2, 21, 0, 7); c.fill();
      const gg = c.createRadialGradient(rx - 3, ry - 3, 1, rx, ry, 18); gg.addColorStop(0, '#efebe2'); gg.addColorStop(.7, '#bdb6a8'); gg.addColorStop(1, '#6f6a62'); c.fillStyle = gg; c.beginPath(); c.arc(rx, ry, 18, 0, 7); c.fill();
      c.strokeStyle = 'rgba(230,225,214,.55)'; c.lineWidth = 1.3; for (let j = 0; j < 6; j++) { const a = j * 1.1; c.beginPath(); c.moveTo(rx + Math.cos(a) * 16, ry + Math.sin(a) * 16); c.lineTo(rx + Math.cos(a + .2) * 44, ry + Math.sin(a + .2) * 44); c.stroke(); }
      burst(rx, ry, k / .4, 12, 90, 77);
      c.restore();
      c.save(); rrect(75, 560, 455, 720, 34); c.clip();
      if (k < .7) stone(lx + k * 260, ly - k * 520 + k * k * 500, 22 * (1 - k * .4), U * 8, 4, 1 - k / .7);
      ripple(lx, ly, k / .6, 110); if (k < .3) { c.fillStyle = `rgba(255,245,215,${1 - k / .3})`; c.beginPath(); c.arc(lx, ly, 20, 0, 7); c.fill(); }
      c.restore();
    }
    pill(550 + 227 - 130, 1180, 260, 64); rt([['بدون PPF', C.black]], 550 + 227, 1212, { size: 34 });
    pill(75 + 227 - 130, 1180, 260, 64, { fill: '#fffaf0' }); rt([['مع ', C.black], ['PPF', C.gold]], 75 + 227, 1212, { size: 34 });
    rt([['حماية تحافظ على ', C.black], ['المظهر الأصلي', C.gold]], 540, 1395, { size: fit('حماية تحافظ على المظهر الأصلي', 62, 940, 800), w: 800, p: P(U, .2, .7) });
    const dsz = fit('تختلف درجة الحماية حسب نوع الفيلم وجودته وطريقة التركيب وظروف الاستخدام.', 28, 960, 400, PL);
    rt([['تختلف درجة الحماية حسب نوع الفيلم وجودته وطريقة التركيب وظروف الاستخدام.', C.grey]], 540, 1500, { size: dsz, w: 400, fam: PL, p: P(U, .4, .8) });
    c.restore();
  }
  dust(t, 34, 13, .9);
}

const BEN = [['shield', 'حماية الطلاء', 850, 640], ['scratchless', 'تقليل الخدوش', 230, 640], ['sparkle', 'الحفاظ على اللمعة', 850, 1330], ['diamond', 'حماية استثمارك', 230, 1330]];
function s4(t) {
  const T = t - 20.15;
  studio(1150); vignette();
  rt([['لماذا ', C.black], ['PPF', C.gold], [' مهم؟', C.black]], 540, 250, { size: 76, w: 800, p: P(T, .1, .6) });
  const z = 1 + .04 * eio(P(T, 3.6, 5.4));
  const ax = 540, ay = 1050;
  c.save(); c.translate(ax, ay); c.scale(z, z); c.translate(-ax, -ay);
  // frame circle
  const fp = eio(P(T, 0, 1.1));
  c.save(); c.strokeStyle = ga(.9); c.lineWidth = 3; c.shadowColor = ga(.5); c.shadowBlur = 14;
  c.beginPath(); c.arc(540, 985, 470, -Math.PI / 2, -Math.PI / 2 + 6.283 * fp); c.stroke(); c.restore();
  c.save(); c.translate(540, 985); c.rotate(T * .25); c.globalAlpha = fp * .6;
  for (let i = 0; i < 72; i++) { c.rotate(Math.PI / 36); c.fillStyle = ga(i % 6 ? .35 : .9); c.fillRect(492, -1, i % 6 ? 8 : 16, 2); }
  c.restore();
  // pedestal
  c.save(); c.translate(540, 1150); c.scale(1, .13);
  let g = c.createRadialGradient(0, 0, 50, 0, 0, 440); g.addColorStop(0, 'rgba(255,255,255,.95)'); g.addColorStop(.85, 'rgba(240,233,218,.9)'); g.addColorStop(1, 'rgba(216,196,155,.0)');
  c.fillStyle = g; c.beginPath(); c.arc(0, 0, 440, 0, 7); c.fill();
  c.strokeStyle = ga(.9); c.lineWidth = 3 / .13 * .35; c.beginPath(); c.arc(0, 0, 420, 0, 7); c.stroke();
  const sa = T * 1.1; c.strokeStyle = 'rgba(255,248,225,.95)'; c.lineWidth = 6 / .13 * .35; c.beginPath(); c.arc(0, 0, 420, sa, sa + .6); c.stroke();
  c.restore();
  drawCar({ x: 540, y: 1150, s: .8, t, filmX: -20, filmA: 1, sheen: ((T + .2) / 1.6) % 1.25, sweep: (T * .35) % 1.5 });
  // icons
  BEN.forEach(([ic, lb, x, y], i) => {
    const p = P(T, .3 + i * .8, .75 + i * .8);
    badge(ic, x, y + Math.sin(t * 1.6 + i) * 4, 66, p);
    if (p > 0) { const ly = y + 112; pill(x - 165, ly - 36, 330, 72, { a: clamp(p * 2), fill: 'rgba(255,255,255,.9)' }); rt([[lb, C.black]], x, ly, { size: fit(lb, 38, 290), w: 700, p }); }
  });
  c.restore();
  const dsz = fit('تختلف درجة الحماية حسب نوع الفيلم وجودته وطريقة التركيب وظروف الاستخدام.', 26, 940, 400, PL);
  rt([['تختلف درجة الحماية حسب نوع الفيلم وجودته وطريقة التركيب وظروف الاستخدام.', C.grey]], 540, 1600, { size: dsz, w: 400, fam: PL, p: P(T, .5, 1), a: .9 });
  dust(t, 40, 17, 1);
}

let logoOff = null;
function s5(t) {
  const T = t - 25.55;
  studio(860); vignette();
  const cs = lerp(1.05, .74, eio(P(T, 0, 2.6))), cy = lerp(1050, 860, eio(P(T, 0, 2.6)));
  // ring back half
  const rp = eio(P(T, .2, 1.2)), ringY = cy - 120 * cs, rx = 560 * cs, ry = 120 * cs, orb = T * 1.3;
  const ring = (a0, a1) => { c.save(); c.strokeStyle = ga(.85 * rp); c.lineWidth = 4; c.shadowColor = ga(.8); c.shadowBlur = 20; c.beginPath(); c.ellipse(540, ringY, rx, ry, -.04, a0, a1); c.stroke();
    c.strokeStyle = `rgba(255,246,220,${.35 * rp})`; c.lineWidth = 14; c.shadowBlur = 0; c.beginPath(); c.ellipse(540, ringY, rx, ry, -.04, a0, a1); c.stroke();
    for (let k = 0; k < 2; k++) { const a = ((orb + k * Math.PI) % 6.283 + 6.283) % 6.283; const inR = a0 < a1 ? (a >= a0 && a <= a1) : false; if (inR) { const px = 540 + Math.cos(a) * rx, py = ringY + Math.sin(a) * ry; const gg = c.createRadialGradient(px, py, 0, px, py, 40); gg.addColorStop(0, `rgba(255,250,230,${rp})`); gg.addColorStop(1, 'rgba(197,160,89,0)'); c.fillStyle = gg; c.beginPath(); c.arc(px, py, 40, 0, 7); c.fill(); } }
    c.restore(); };
  ring(Math.PI, 2 * Math.PI);
  drawCar({ x: 540, y: cy, s: cs, t, filmX: -20, filmA: 1, sheen: ((T + .6) / 1.8) % 1.3, sweep: (T * .3) % 1.5 });
  floorFade(cy);
  ring(0, Math.PI);
  // logo
  const lp = P(T, .4, 1.4);
  if (lp > 0) {
    const lw = 820, lh = lw * 138 / 1200, lx = 540 - lw / 2, ly = 250 - lh / 2;
    if (!logoOff) { logoOff = document.createElement('canvas'); logoOff.width = lw; logoOff.height = Math.ceil(lh); }
    const o = logoOff.getContext('2d'); o.clearRect(0, 0, lw, lh); o.globalCompositeOperation = 'source-over'; o.drawImage(logo, 0, 0, lw, lh);
    const sp = P(T, .9, 2.0);
    if (sp > 0 && sp < 1) { o.globalCompositeOperation = 'source-atop'; const sx = lerp(-200, lw + 200, sp); const gg = o.createLinearGradient(sx - 90, 0, sx + 90, lh); gg.addColorStop(0, 'rgba(255,255,255,0)'); gg.addColorStop(.5, 'rgba(255,244,210,.95)'); gg.addColorStop(1, 'rgba(255,255,255,0)'); o.fillStyle = gg; o.fillRect(0, 0, lw, lh); }
    c.save(); const e = eout(lp); c.globalAlpha = clamp(lp * 1.5);
    c.beginPath(); c.rect(lx - 20, ly - 40, (lw + 40) * e, lh + 80); c.clip();
    c.translate(540, 250); c.scale(.94 + .06 * e, .94 + .06 * e); c.translate(-540, -250);
    c.drawImage(logoOff, lx, ly); c.restore();
    const gp = eio(P(T, .9, 1.6)); c.fillStyle = goldGrad(540 - 300, 540 + 300); c.fillRect(540 - 300 * gp, 340, 600 * gp, 2.5);
  }
  rt([['مركز نانو برو للعناية بالسيارات', C.black]], 540, 400, { size: 44, w: 700, p: P(T, 1.2, 1.8) });
  // tagline
  rt([['لا تنتظر الضرر...', C.black]], 540, 985, { size: 62, w: 800, p: P(T, 3.9, 4.4) });
  rt([['احمِ سيارتك من الآن.', C.gold]], 540, 1075, { size: 74, w: 900, p: P(T, 5.25, 5.75) });
  // contact card
  const cp = eout(P(T, 5.6, 6.2));
  if (cp > 0) {
    c.save(); c.globalAlpha = cp; c.translate(0, (1 - cp) * 50);
    c.shadowColor = 'rgba(120,92,40,.25)'; c.shadowBlur = 50; c.shadowOffsetY = 16;
    rrect(90, 1150, 900, 370, 36); c.fillStyle = 'rgba(255,255,255,.96)'; c.fill(); c.shadowColor = 'transparent';
    c.strokeStyle = ga(1); c.lineWidth = 2.5; c.stroke();
    c.strokeStyle = ga(.35); c.lineWidth = 1.5; rrect(104, 1164, 872, 342, 28); c.stroke();
    c.restore();
    const rows = [['phone', [['0502288822', C.black]], 'ltr', 66, 1240, 5.8], ['globe', [['nanopro.sa', C.black]], 'ltr', 54, 1350, 6.0], ['pin', [['الرياض – ', C.black], ['حي النرجس', C.gold]], 'rtl', 50, 1450, 6.2]];
    rows.forEach(([ic, segs, dir, sz, y, t0], i) => {
      const p = P(T, t0, t0 + .45); if (p <= 0) return;
      badge(ic, 900, y, 38, p);
      rt(segs, 830, y + (dir === 'ltr' ? 4 : 0), { size: sz, w: dir === 'ltr' ? 800 : 700, dir, align: 'right', p });
      if (i < 2) { c.fillStyle = ga(.25 * p); c.fillRect(160, y + 52, 760, 1.5); }
    });
  }
  dust(t, 44, 21, 1);
}

function transition(t, T) {
  const p = P(t, T - .3, T + .3); if (p <= 0 || p >= 1) return;
  const cx = lerp(-1400, W + 1400, eio(p)), hw = 1350 * Math.sin(Math.PI * p), sk = 600;
  c.save();
  const poly = (a, b) => { c.beginPath(); c.moveTo(a + sk, 0); c.lineTo(b + sk, 0); c.lineTo(b - sk, H); c.lineTo(a - sk, H); c.closePath(); };
  poly(cx - hw, cx + hw); const g = c.createLinearGradient(cx - hw, 0, cx + hw, 0); g.addColorStop(0, '#F8F6F0'); g.addColorStop(.5, '#FFFFFF'); g.addColorStop(1, '#EDE7DB'); c.fillStyle = g; c.fill();
  c.strokeStyle = ga(1); c.lineWidth = 6; c.shadowColor = ga(.9); c.shadowBlur = 24;
  for (const e of [cx - hw, cx + hw]) { c.beginPath(); c.moveTo(e + sk, 0); c.lineTo(e - sk, H); c.stroke(); }
  c.lineWidth = 2; for (const e of [cx - hw - 26, cx + hw + 26]) { c.beginPath(); c.moveTo(e + sk, 0); c.lineTo(e - sk, H); c.stroke(); }
  c.restore();
}

function render(t) {
  c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.filter = 'none'; c.shadowColor = 'transparent';
  c.fillStyle = C.ivory; c.fillRect(0, 0, W, H);
  if (t < 4.8) s1(t); else if (t < 11.75) s2(t); else if (t < 20.15) s3(t); else if (t < 25.55) s4(t); else s5(t);
  for (const T of [4.8, 11.75, 20.15, 25.55]) transition(t, T);
  // opening fade from white
  if (t < .35) { c.fillStyle = `rgba(255,255,255,${1 - t / .35})`; c.fillRect(0, 0, W, H); }
}
window.render = render;
