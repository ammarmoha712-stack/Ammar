/* NANO PRO — "Always Looking New". All times are VIDEO seconds (0..35).
   VO phrase starts: 0.15 hook | 2.26 قيمتها | 4.16 PPF | 6.05 طبقة شفافة | 8.59 حماية الطلاء | 10.50 حصى الطريق
   14.76 مع ضمان | 15.53 عشر سنوات | 18.24 النانو سيراميك | 19.42 لمعاناً | 21.78 طرد الماء | 23.87 أسهل
   25.57 حماية للطلاء | 26.75 لمعان للعناية | 28.32 تقنيتان | 30.67 نانو برو | 31.50 عناية تليق | 33.46 احجز الآن */
const MID = '#0b1630', CHAR = '#161616';

/* ---------- rich (two-colour) RTL line ---------- */
function txtRich(parts, x, y, o = {}) {
  const size = o.size || 80, p = o.p == null ? 1 : o.p, a = o.a == null ? 1 : o.a;
  if (p <= 0 || a <= 0) return;
  ctx.save();
  ctx.font = `${o.wt || 900} ${size}px Cairo`; ctx.direction = 'rtl'; ctx.textBaseline = 'middle'; ctx.textAlign = 'right';
  const ws = parts.map(q => ctx.measureText(q.s).width), tot = ws.reduce((m, v) => m + v, 0);
  const e = eOut(p), yy = y + (1 - e) * 28, right = x + tot / 2;
  ctx.globalAlpha = a * clamp(p * 1.6);
  ctx.beginPath(); ctx.rect(right + 20 - (tot + 40) * e, yy - size * 1.2, (tot + 40) * e, size * 2.4); ctx.clip();
  let xr = right;
  parts.forEach((q, i) => {
    if (q.grad) {
      const g = ctx.createLinearGradient(xr - ws[i], yy - size / 2, xr, yy + size / 2);
      g.addColorStop(0, GOLD_D); g.addColorStop(.4, GOLD_L); g.addColorStop(.6, GOLD); g.addColorStop(1, GOLD_D);
      ctx.fillStyle = g;
      if (q.glow) { ctx.shadowColor = q.glow; ctx.shadowBlur = 30; }
    } else { ctx.fillStyle = q.color || '#fff'; ctx.shadowBlur = 0; }
    ctx.fillText(q.s, xr, yy); ctx.shadowBlur = 0;
    xr -= ws[i];
  });
  ctx.restore();
}

/* ---------- backgrounds ---------- */
function ivoryStudio(floorY) {
  let g = ctx.createLinearGradient(0, 0, 0, floorY);
  g.addColorStop(0, '#ebe5d6'); g.addColorStop(.6, '#f8f5ee'); g.addColorStop(1, '#fffdf8');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, floorY);
  // architectural wall panels
  for (let i = 0; i < 7; i++) {
    const x = 40 + i * 170;
    g = ctx.createLinearGradient(x, 0, x + 150, 0);
    g.addColorStop(0, 'rgba(255,255,255,.0)'); g.addColorStop(.5, 'rgba(255,255,255,.55)'); g.addColorStop(1, 'rgba(210,200,180,.18)');
    ctx.fillStyle = g; ctx.fillRect(x, 0, 150, floorY - 120);
  }
  // champagne light line
  ctx.save(); ctx.fillStyle = 'rgba(205,165,48,.55)'; ctx.shadowColor = GOLD_L; ctx.shadowBlur = 25;
  ctx.fillRect(0, floorY - 120, W, 3); ctx.restore();
  g = ctx.createLinearGradient(0, floorY, 0, H);
  g.addColorStop(0, '#efe9dc'); g.addColorStop(.3, '#f7f3ea'); g.addColorStop(1, '#e9e2d2');
  ctx.fillStyle = g; ctx.fillRect(0, floorY, W, H - floorY);
}
function midnight(cy = 960) {
  const g = ctx.createRadialGradient(540, cy, 40, 540, cy, 1300);
  g.addColorStop(0, '#1d2f55'); g.addColorStop(.45, '#0c1730'); g.addColorStop(1, '#03060d');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
function darkStudio(cy = 900, floorY = 1200) {
  let g = ctx.createRadialGradient(540, cy, 40, 540, cy, 1250);
  g.addColorStop(0, '#2b2c31'); g.addColorStop(.45, '#121216'); g.addColorStop(1, '#030304');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  g = ctx.createRadialGradient(540, 0, 10, 540, 0, 700);
  g.addColorStop(0, 'rgba(255,245,225,0.10)'); g.addColorStop(1, 'rgba(255,245,225,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, 800);
}
/* Riyadh night skyline (stylised silhouettes) */
const WINDOWS = (() => { const R = rng(77), a = []; for (let i = 0; i < 260; i++) a.push([R(), R(), R()]); return a; })();
function riyadh(horizon, t) {
  let g = ctx.createLinearGradient(0, 0, 0, horizon);
  g.addColorStop(0, '#02050c'); g.addColorStop(.55, '#0a1733'); g.addColorStop(1, '#1d3a6e');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, horizon + 2);
  const R = rng(3); ctx.fillStyle = 'rgba(255,255,255,.6)';
  for (let i = 0; i < 70; i++) { const x = R() * W, y = R() * horizon * .6, s = R() * 1.8; ctx.globalAlpha = .3 + .5 * Math.abs(Math.sin(t * 1.5 + i)); ctx.fillRect(x, y, s, s); }
  ctx.globalAlpha = 1;
  const sil = '#050a17';
  ctx.fillStyle = sil;
  // generic blocks
  const R2 = rng(19);
  for (let x = -20; x < W; x += 34 + R2() * 40) { const h = 40 + R2() * 150, w = 30 + R2() * 46; ctx.fillRect(x, horizon - h, w, h); }
  // Kingdom-style tower with arch opening
  ctx.save(); ctx.translate(330, horizon);
  ctx.beginPath(); ctx.moveTo(-62, 0); ctx.lineTo(-40, -420); ctx.quadraticCurveTo(0, -470, 40, -420); ctx.lineTo(62, 0); ctx.closePath();
  ctx.moveTo(-34, -300); ctx.quadraticCurveTo(0, -330, 34, -300); ctx.lineTo(30, -440); ctx.quadraticCurveTo(0, -470, -30, -440); ctx.closePath();
  ctx.fill('evenodd');
  ctx.strokeStyle = 'rgba(120,170,255,.55)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-34, -300); ctx.quadraticCurveTo(0, -330, 34, -300); ctx.stroke();
  ctx.restore();
  // Faisaliah-style tower with globe
  ctx.save(); ctx.translate(760, horizon);
  ctx.beginPath(); ctx.moveTo(-70, 0); ctx.lineTo(-6, -360); ctx.lineTo(6, -360); ctx.lineTo(70, 0); ctx.fill();
  ctx.fillRect(-1.5, -440, 3, 90);
  g = ctx.createRadialGradient(-6, -262, 2, 0, -258, 26); g.addColorStop(0, '#e9d48a'); g.addColorStop(1, '#8a6a1c');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, -258, 22, 0, 7); ctx.fill();
  ctx.restore();
  // lit windows
  for (const w of WINDOWS) {
    const x = w[0] * W, y = horizon - w[1] * 160;
    ctx.fillStyle = `rgba(255,215,140,${.25 + .5 * w[2]})`; ctx.fillRect(x, y, 2, 3);
  }
  g = ctx.createLinearGradient(0, horizon - 80, 0, horizon + 10);
  g.addColorStop(0, 'rgba(60,110,200,0)'); g.addColorStop(1, 'rgba(60,110,200,.35)');
  ctx.fillStyle = g; ctx.fillRect(0, horizon - 80, W, 90);
}

/* ---------- SUV (local units: ~1000 wide, ground at y=334) ---------- */
function suvPath(c) {
  c.beginPath();
  c.moveTo(34, 252);
  c.bezierCurveTo(18, 232, 16, 182, 26, 160);
  c.bezierCurveTo(60, 140, 200, 128, 318, 120);
  c.bezierCurveTo(360, 96, 400, 64, 442, 47);
  c.bezierCurveTo(520, 36, 760, 36, 862, 42);
  c.bezierCurveTo(902, 46, 936, 62, 952, 92);
  c.bezierCurveTo(968, 130, 976, 182, 974, 246);
  c.lineTo(874, 258);
  c.arc(790, 262, 84, -0.05, Math.PI + 0.05, true);
  c.lineTo(274, 258);
  c.arc(190, 262, 84, -0.05, Math.PI + 0.05, true);
  c.lineTo(46, 258);
  c.closePath();
}
function suvGlass(c) {
  c.beginPath();
  c.moveTo(352, 118);
  c.bezierCurveTo(390, 96, 418, 72, 452, 58);
  c.bezierCurveTo(560, 50, 760, 50, 852, 56);
  c.bezierCurveTo(890, 60, 914, 82, 928, 112);
  c.bezierCurveTo(700, 114, 520, 116, 352, 118);
  c.closePath();
}
function suvWheel(cx, cy, spin) {
  ctx.save(); ctx.translate(cx, cy);
  ctx.fillStyle = '#0a0a0b'; ctx.beginPath(); ctx.arc(0, 0, 73, 0, 7); ctx.fill();
  ctx.strokeStyle = '#1e1e21'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, 67, 0, 7); ctx.stroke();
  let g = ctx.createLinearGradient(-55, -55, 55, 55);
  g.addColorStop(0, '#eceef1'); g.addColorStop(.5, '#6f747b'); g.addColorStop(1, '#25272b');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 54, 0, 7); ctx.fill();
  ctx.fillStyle = '#0d0d0f'; ctx.beginPath(); ctx.arc(0, 0, 48, 0, 7); ctx.fill();
  ctx.rotate(spin || 0);
  for (let i = 0; i < 6; i++) {
    ctx.save(); ctx.rotate(i * Math.PI / 3);
    g = ctx.createLinearGradient(0, -48, 0, -10); g.addColorStop(0, '#c9ccd2'); g.addColorStop(1, '#4e5258');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-6, -10); ctx.lineTo(-13, -48); ctx.lineTo(-2, -48); ctx.lineTo(4, -10); ctx.fill();
    ctx.restore();
  }
  ctx.fillStyle = '#8f939a'; ctx.beginPath(); ctx.arc(0, 0, 12, 0, 7); ctx.fill();
  ctx.fillStyle = GOLD; ctx.beginPath(); ctx.arc(0, 0, 6, 0, 7); ctx.fill();
  ctx.restore();
}
/* o: env ('ivory'|'dark'|'night'), film, filmHover, outline, gloss, sweep, filmStroke */
function suvBody(o) {
  const ivory = o.env === 'ivory', night = o.env === 'night';
  suvPath(ctx);
  let g = ctx.createLinearGradient(0, 36, 0, 258);
  g.addColorStop(0, ivory ? '#8d8f94' : night ? '#4a5f86' : '#575b63');
  g.addColorStop(.26, '#1c1e23'); g.addColorStop(.48, '#060607');
  g.addColorStop(.6, ivory ? '#3a3c41' : night ? '#22304c' : '#25282e'); g.addColorStop(.72, '#0b0c0e'); g.addColorStop(1, '#030304');
  ctx.fillStyle = g; ctx.fill();
  ctx.save(); suvPath(ctx); ctx.clip();
  // shoulder reflection
  g = ctx.createLinearGradient(0, 150, 0, 190);
  const sh = ivory ? .38 : .18;
  g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, `rgba(240,242,248,${sh + .22 * (o.gloss || 0)})`); g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 150, 1000, 40);
  if (night) { g = ctx.createLinearGradient(0, 0, 1000, 0); g.addColorStop(0, 'rgba(70,130,255,.25)'); g.addColorStop(1, 'rgba(70,130,255,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1000, 340); }
  // moving specular streak
  const sx = lerp(-250, 1250, o.sweep == null ? .5 : o.sweep);
  ctx.save(); ctx.translate(sx, 150); ctx.rotate(.35);
  g = ctx.createLinearGradient(-70, 0, 70, 0);
  const ga = .2 + .4 * (o.gloss || 0);
  g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, `rgba(255,255,255,${ga})`); g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.fillRect(-70, -300, 140, 600);
  ctx.restore();
  // glass
  suvGlass(ctx); g = ctx.createLinearGradient(360, 50, 930, 118);
  g.addColorStop(0, ivory ? '#5d636c' : '#2a2e35'); g.addColorStop(.35, '#07080a'); g.addColorStop(.65, ivory ? '#3a3f47' : '#15181d'); g.addColorStop(1, '#050506');
  ctx.fillStyle = g; ctx.fill();
  ctx.strokeStyle = 'rgba(200,205,215,.4)'; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = '#020203'; ctx.fillRect(600, 52, 10, 66); ctx.fillRect(772, 52, 10, 62);
  // roof rail
  ctx.strokeStyle = '#b9bdc4'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(480, 40); ctx.bezierCurveTo(600, 32, 760, 32, 870, 40); ctx.stroke();
  // character line
  ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(60, 176); ctx.bezierCurveTo(400, 168, 700, 162, 968, 152); ctx.stroke();
  // lower cladding + chrome strip
  ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(0, 232, 1000, 30);
  ctx.fillStyle = 'rgba(220,224,230,.5)'; ctx.fillRect(300, 230, 400, 3);
  // doors
  ctx.strokeStyle = 'rgba(0,0,0,.85)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(604, 118); ctx.lineTo(606, 232); ctx.moveTo(352, 122); ctx.bezierCurveTo(342, 170, 344, 210, 352, 232); ctx.moveTo(780, 116); ctx.bezierCurveTo(800, 170, 800, 210, 790, 232); ctx.stroke();
  ctx.fillStyle = 'rgba(210,214,220,.7)'; ctx.fillRect(500, 140, 38, 5); ctx.fillRect(710, 136, 38, 5);
  // grille hint at the nose
  ctx.fillStyle = '#050506'; ctx.fillRect(18, 176, 18, 54);
  ctx.fillStyle = 'rgba(220,224,230,.6)'; for (let y = 180; y < 228; y += 8) ctx.fillRect(18, y, 16, 2);
  ctx.restore();
  // lights
  ctx.fillStyle = '#f0f7ff'; ctx.shadowColor = 'rgba(200,225,255,.95)'; ctx.shadowBlur = 20;
  ctx.beginPath(); ctx.moveTo(26, 160); ctx.lineTo(136, 146); ctx.lineTo(132, 154); ctx.lineTo(28, 170); ctx.fill();
  ctx.fillStyle = '#ff2a2a'; ctx.shadowColor = 'rgba(255,40,40,.9)';
  ctx.beginPath(); ctx.moveTo(955, 100); ctx.lineTo(970, 104); ctx.lineTo(974, 160); ctx.lineTo(962, 158); ctx.fill();
  ctx.shadowBlur = 0;
  const fs = o.filmStroke || 'rgba(225,240,255,.8)';
  if (o.film > 0) {
    ctx.save(); suvPath(ctx); ctx.clip();
    const fx = lerp(-40, 1040, o.film);
    ctx.beginPath(); ctx.rect(0, 0, fx, 400); ctx.clip();
    g = ctx.createLinearGradient(0, 40, 1000, 260);
    g.addColorStop(0, 'rgba(190,225,255,.12)'); g.addColorStop(.5, 'rgba(255,240,210,.07)'); g.addColorStop(1, 'rgba(190,225,255,.12)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 1000, 400);
    // film edge seams (wrapped hood, bumper, lights, doors)
    ctx.strokeStyle = 'rgba(200,230,255,.35)'; ctx.lineWidth = 1.5; ctx.setLineDash([6, 6]);
    ctx.beginPath(); ctx.moveTo(40, 140); ctx.bezierCurveTo(200, 124, 300, 120, 340, 118); ctx.stroke();
    ctx.restore();
    if (o.film < 1) {
      ctx.save(); suvPath(ctx); ctx.clip();
      g = ctx.createLinearGradient(fx - 60, 0, fx + 6, 0);
      g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(230,245,255,.85)');
      ctx.fillStyle = g; ctx.fillRect(fx - 60, 0, 66, 400);
      ctx.restore();
    }
  }
  if (o.filmHover != null) {
    ctx.save(); ctx.translate(-10, o.filmHover); ctx.scale(1.02, 1.02);
    suvPath(ctx);
    g = ctx.createLinearGradient(0, 40, 1000, 260);
    g.addColorStop(0, 'rgba(170,210,250,.22)'); g.addColorStop(.5, 'rgba(255,255,255,.06)'); g.addColorStop(1, 'rgba(170,210,250,.22)');
    ctx.fillStyle = g; ctx.fill();
    ctx.strokeStyle = fs; ctx.lineWidth = 3; ctx.shadowColor = 'rgba(140,190,240,.9)'; ctx.shadowBlur = 16; ctx.stroke();
    ctx.restore();
  }
  if (o.outline > 0) {
    ctx.save(); suvPath(ctx);
    ctx.setLineDash([3300 * o.outline, 4200]);
    ctx.strokeStyle = ivory ? GOLD : GOLD_L; ctx.lineWidth = 4; ctx.shadowColor = GOLD; ctx.shadowBlur = 22; ctx.stroke();
    ctx.restore();
  }
}
/* place local point (fx,fy) of the car at screen (sx,sy), scale s */
function suv(fx, fy, sx, sy, s, o, fade) {
  const ox = sx - fx * s, oy = sy - fy * s, groundY = oy + 334 * s;
  const draw = () => { suvBody(o); suvWheel(190, 262, o.spin); suvWheel(790, 262, o.spin); };
  ctx.save(); ctx.translate(ox, groundY); ctx.scale(s, -s); ctx.translate(0, -334);
  ctx.globalAlpha = o.env === 'ivory' ? .22 : .18; draw(); ctx.restore();
  const fc = fade || '6,6,8';
  let g = ctx.createLinearGradient(0, groundY, 0, groundY + 340 * s);
  g.addColorStop(0, `rgba(${fc},0.1)`); g.addColorStop(.65, `rgba(${fc},0.9)`); g.addColorStop(1, `rgba(${fc},1)`);
  ctx.fillStyle = g; ctx.fillRect(0, groundY, W, 340 * s + 2);
  ctx.fillStyle = `rgb(${fc})`; ctx.fillRect(0, groundY + 340 * s, W, H);
  g = ctx.createRadialGradient(ox + 500 * s, groundY, 10, ox + 500 * s, groundY, 560 * s);
  g.addColorStop(0, 'rgba(0,0,0,.8)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.save(); ctx.translate(0, groundY); ctx.scale(1, .08); ctx.fillStyle = g; ctx.fillRect(-2000, -600 * s, W + 4000, 1200 * s); ctx.restore();
  ctx.save(); ctx.translate(ox, oy); ctx.scale(s, s); draw(); ctx.restore();
  return groundY;
}

/* ---------- falling + beading droplets ---------- */
function rain(x, y, w, h, t, t0, t1, seed, n, sMin = 10, sMax = 32) {
  const R = rng(seed);
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  for (let i = 0; i < n; i++) {
    const u = R(), v = R(), r = sMin + R() * (sMax - sMin), d = R() * 1.1, d2 = R() * .7, gr = 700 + R() * 900;
    const px0 = x + u * w, py0 = y + (.05 + v * .8) * h;
    const ta = t - (t0 + d);
    if (ta < -.35) continue;
    if (ta < 0) { // falling
      const k = 1 + ta / .35, fy = lerp(py0 - 700, py0, k * k);
      ctx.strokeStyle = 'rgba(220,235,255,.55)'; ctx.lineWidth = r * .35; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(px0, fy - 60); ctx.lineTo(px0, fy); ctx.stroke();
      continue;
    }
    if (ta < .25) { // splash ring
      ctx.strokeStyle = `rgba(230,240,255,${.6 * (1 - ta / .25)})`; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(px0, py0, r * (1 + ta * 8), r * (1 + ta * 8) * .4, 0, 0, 7); ctx.stroke();
    }
    const sc = eBack(ta / .4);
    let px = px0, py = py0, str = 0;
    const tr = t - (t1 + d2);
    if (tr > 0) {
      py += .5 * gr * tr * tr; px += 30 * tr; str = Math.min(.45, tr * .9);
      ctx.strokeStyle = 'rgba(220,230,240,.10)'; ctx.lineWidth = r * .5;
      ctx.beginPath(); ctx.moveTo(px, py - Math.min(160, .5 * gr * tr * tr)); ctx.lineTo(px, py); ctx.stroke();
    }
    if (py - r > y + h) continue;
    drop(px, py, r * sc, str);
  }
  ctx.restore();
}

/* ---------- metallic 3D "10" ---------- */
const TEN = document.createElement('canvas'); TEN.width = 1400; TEN.height = 900;
function bigTen(cx, cy, size, spin, sweep, a) {
  if (a <= 0) return;
  const c = TEN.getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, 1400, 900);
  c.translate(700, 430);
  c.font = `${size}px Michroma`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.direction = 'ltr';
  const depth = 22;
  for (let i = depth; i > 0; i--) { // extrusion
    const k = i / depth; c.fillStyle = `rgb(${Math.round(lerp(120, 60, k))},${Math.round(lerp(92, 44, k))},${Math.round(lerp(20, 8, k))})`;
    c.fillText('10', i * .9 * Math.sin(spin + .5), i * 1.1);
  }
  let g = c.createLinearGradient(0, -size / 2, 0, size / 2);
  g.addColorStop(0, '#fff3c4'); g.addColorStop(.28, GOLD_L); g.addColorStop(.5, '#b8901f'); g.addColorStop(.62, '#f7e19a'); g.addColorStop(1, '#8c6a12');
  c.fillStyle = g; c.fillText('10', 0, 0);
  c.globalCompositeOperation = 'source-atop';
  const sx = lerp(-size * 1.2, size * 1.2, sweep);
  g = c.createLinearGradient(sx - 80, 0, sx + 80, 0);
  g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(255,255,255,.85)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  c.fillStyle = g; c.fillRect(-700, -430, 1400, 900);
  c.globalCompositeOperation = 'source-over';
  ctx.save(); ctx.globalAlpha = a; ctx.translate(cx, cy); ctx.scale(Math.max(.02, Math.cos(spin)), 1);
  ctx.shadowColor = 'rgba(243,215,122,.5)'; ctx.shadowBlur = 50;
  ctx.drawImage(TEN, -700, -430);
  ctx.restore();
}

/* =================== SCENES =================== */
function sHook(t) {
  // ivory studio, camera glides from headlight macro out to the full SUV
  ivoryStudio(1290);
  const z = eIO(prog(t, 0, 3.6));
  const s = lerp(2.7, 1.0, z), fx = lerp(70, 500, z), fy = lerp(165, 190, z);
  suv(fx, fy, lerp(470, 540, z), lerp(1060, 1100, z), s, { env: 'ivory', sweep: lerp(.05, .95, prog(t, 0, 3.8)), gloss: .6 }, '233,226,210');
  // slow-motion road dust & debris, freeze, then gold sweep clears it
  const R = rng(31), freezeT = Math.min(t, 2.0), sweepX = lerp(-200, 1300, eIO(prog(t, 2.15, 3.1)));
  for (let i = 0; i < 70; i++) {
    const x0 = R() * 1400, y0 = 650 + R() * 750, sp = 60 + R() * 140, sz = R() < .15 ? 6 + R() * 7 : 1.5 + R() * 2.5, ph = R() * 6;
    const appear = prog(t, .9 + R() * .4, 1.4);
    if (appear <= 0) continue;
    const x = x0 - (freezeT - .9) * sp, y = y0 + Math.sin(ph + freezeT) * 10;
    if (x < sweepX) continue; // cleared by the sweep
    if (sz > 5) stone(x, y, sz, ph + freezeT * .6, appear);
    else { ctx.fillStyle = `rgba(150,128,95,${.55 * appear})`; ctx.beginPath(); ctx.arc(x, y, sz, 0, 7); ctx.fill(); }
  }
  if (t > 2.15 && t < 3.2) {
    ctx.save(); const g = ctx.createLinearGradient(sweepX - 140, 0, sweepX + 20, 0);
    g.addColorStop(0, 'rgba(243,215,122,0)'); g.addColorStop(.85, 'rgba(243,215,122,.55)'); g.addColorStop(1, 'rgba(255,248,220,.95)');
    ctx.fillStyle = g; ctx.fillRect(sweepX - 140, 0, 160, H); ctx.restore();
  }
  let e = env(t, .2, null, .7);
  txt('سيارتك دائماً بمظهر الجديد', 540, 330, { size: 84, color: CHAR, p: e.p });
  e = env(t, 2.3, null, .7);
  txtRich([{ s: 'حافظ على ', color: CHAR }, { s: 'قيمتها!', grad: true, glow: 'rgba(205,165,48,.45)' }], 540, 470, { size: 110, p: e.p });
  logo(540, 130, 300, prog(t, .1, .8), false);
}

function sPPF(t) {
  const toSec = eIO(prog(t, 8.3, 8.8));
  if (toSec < 1) {
    ctx.save(); ctx.globalAlpha = 1 - toSec;
    ivoryStudio(1290);
    const push = lerp(.94, 1.0, eOut(prog(t, 4.0, 8.5)));
    const hover = lerp(-200, 0, eIO(prog(t, 4.4, 5.9)));
    suv(500, 190, 540, 1100, push, {
      env: 'ivory', film: eIO(prog(t, 5.9, 7.4)), filmHover: t < 6.0 ? hover : null, filmStroke: 'rgba(90,140,200,.9)',
      outline: eIO(prog(t, 6.6, 8.0)), gloss: .5, sweep: prog(t, 4.0, 8.4)
    }, '233,226,210');
    let e = env(t, 4.3, null);
    txt('PPF', 540, 300, { fam: 'Michroma', size: 120, color: CHAR, p: e.p });
    e = env(t, 4.6, null);
    txt('الدرع الشفاف', 540, 450, { size: 104, grad: true, p: e.p });
    e = env(t, 6.1, null);
    txt('حماية متطورة لطلاء سيارتك', 540, 1580, { size: 54, wt: 700, color: CHAR, p: e.p });
    logo(540, 130, 300, 1, false);
    ctx.restore();
  }
  if (toSec > 0) {
    ctx.save(); ctx.globalAlpha = toSec;
    midnight(1000);
    const hits = [{ t: 11.0, u: .42, A: 24, size: 1.25 }, { t: 12.7, u: .7, A: 15, size: .8 }];
    section(330, 960, 560, 1.6, t, hits, {
      explode: 1 - eIO(prog(t, 8.8, 9.5)), gold: prog(t, 9.4, 9.9), labels: true,
      lab: [prog(t, 9.0, 9.6), prog(t, 9.3, 9.9), prog(t, 9.6, 10.2)]
    });
    const c = env(t, 11.1, 14.2, .5);
    if (c.p > 0) {
      ctx.save(); ctx.globalAlpha = c.a * clamp(c.p * 2); ctx.strokeStyle = GOLD_L; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(330 + .42 * 560 + 20, 930); ctx.lineTo(720, 790); ctx.lineTo(900, 790); ctx.stroke(); ctx.restore();
      txt('حاجز مادي بين الحصى والطلاء', 720, 750, { size: 38, wt: 700, color: GOLD_L, p: c.p, a: c.a });
    }
    let e = env(t, 8.8, null);
    txt('PPF', 540, 300, { fam: 'Michroma', size: 110, color: '#fff', p: e.p, glow: 'rgba(120,170,255,.6)' });
    txt('الدرع الشفاف', 540, 440, { size: 96, grad: true, p: e.p });
    e = env(t, 10.5, null);
    if (e.p > 0) { ctx.save(); ctx.globalAlpha = clamp(e.p * 2) * .9; rr(90, 1500, 900, 150, 24); ctx.fillStyle = 'rgba(5,10,22,.75)'; ctx.fill(); ctx.strokeStyle = 'rgba(205,165,48,.6)'; ctx.lineWidth = 2; ctx.stroke(); ctx.restore(); }
    txt('حماية من حصى الطريق', 540, 1548, { size: 50, color: '#fff', p: e.p });
    txt('والخدوش السطحية', 540, 1606, { size: 44, wt: 700, color: '#d5dbe8', p: prog(t, 10.9, 11.6) });
    logo(540, 130, 300, 1);
    ctx.restore();
  }
}

function sWarranty(t) {
  midnight(900);
  // gold radial bloom behind the number
  const hit = prog(t, 15.45, 15.9);
  let g = ctx.createRadialGradient(540, 820, 10, 540, 820, 700);
  g.addColorStop(0, `rgba(243,215,122,${.10 + .25 * (1 - hit) * (t > 15.45 ? 1 : 0)})`); g.addColorStop(1, 'rgba(243,215,122,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // ring
  const rg = eOut(prog(t, 15.45, 16.4));
  if (rg > 0) { ctx.save(); ctx.strokeStyle = `rgba(243,215,122,${.7 * (1 - rg)})`; ctx.lineWidth = 6; ctx.shadowColor = GOLD; ctx.shadowBlur = 30; ctx.beginPath(); ctx.arc(540, 820, 200 + rg * 600, 0, 7); ctx.stroke(); ctx.restore(); }
  let e = env(t, 14.75, null, .6);
  txt('مع ضمان', 540, 380, { size: 70, wt: 700, color: '#e9e4d6', p: e.p });
  const sp = eOut(prog(t, 15.35, 16.1));
  bigTen(540, 820, 470, lerp(-1.45, 0, sp), prog(t, 16.2, 17.2), clamp(prog(t, 15.35, 15.55)));
  e = env(t, 15.8, null, .6);
  txt('YEARS', 540, 1130, { fam: 'Michroma', size: 92, grad: true, p: e.p, ls: 14 });
  e = env(t, 16.1, null, .6);
  txt('ضمان 10 سنوات', 540, 1330, { size: 96, color: '#fff', p: e.p });
  e = env(t, 16.6, null, .6);
  txt('على أفلام الحماية PPF', 540, 1450, { size: 62, wt: 700, color: GOLD_L, p: e.p });
  e = env(t, 17.0, null, .5);
  txt('وفق شروط الضمان المعتمدة', 540, 1560, { size: 36, wt: 400, color: '#b7bfd0', p: e.p });
  logo(540, 130, 300, 1);
}

function sCeramic(t) {
  const drift = .3 + (t - 18) * .05;
  coatedSurface(0, 0, W, H, t, eIO(prog(t, 18.2, 20.6)), drift);
  const gs = prog(t, 19.5, 21.2);
  if (gs > 0 && gs < 1) {
    ctx.save(); ctx.translate(lerp(-400, 1500, eIO(gs)), 960); ctx.rotate(-.42);
    const g = ctx.createLinearGradient(-120, 0, 120, 0);
    g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(255,250,235,.38)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g; ctx.fillRect(-120, -1600, 240, 3200); ctx.restore();
  }
  rain(0, 640, W, 820, t, 21.6, 23.9, 11, 32);
  let g = ctx.createLinearGradient(0, 0, 0, 640); g.addColorStop(0, 'rgba(0,0,0,.75)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, 640);
  g = ctx.createLinearGradient(0, 1380, 0, H); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.8)');
  ctx.fillStyle = g; ctx.fillRect(0, 1380, W, H - 1380);
  let e = env(t, 18.25, null);
  txt('NANO CERAMIC', 540, 310, { fam: 'Michroma', size: 74, color: '#fff', p: e.p, ls: 2 });
  e = env(t, 19.45, null);
  txt('سر اللمعان العميق', 540, 460, { size: 104, grad: true, p: e.p, glow: 'rgba(0,0,0,.6)' });
  e = env(t, 21.8, null);
  txt('طرد الماء والأوساخ', 540, 1580, { size: 56, color: '#fff', p: e.p });
  txt('وسهولة التنظيف', 540, 1660, { size: 50, wt: 700, color: GOLD_L, p: prog(t, 23.9, 24.6) });
  logo(540, 130, 300, 1);
}

function sCombo(t) {
  const R0 = 28.15, rad = eIO(prog(t, R0, R0 + .9)) * 1250;
  // split panels on ivory
  ctx.fillStyle = IVORY; ctx.fillRect(0, 0, W, H);
  let g = ctx.createRadialGradient(540, 900, 50, 540, 900, 1100);
  g.addColorStop(0, 'rgba(255,255,255,.9)'); g.addColorStop(1, 'rgba(225,215,190,.5)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const inL = eOut(prog(t, 25.4, 26.0)), inR = eOut(prog(t, 26.6, 27.2)), mg = eIO(prog(t, 27.6, 28.3));
  const px = 40, pw = 480, py = 560, ph = 900;
  ctx.save(); ctx.globalAlpha = inL; ctx.translate(lerp(-560, 0, inL) + mg * 20, 0);
  ctx.save(); rr(px, py, pw, ph, 32); ctx.clip(); midnight(1000);
  ctx.translate(px, py);
  section(70, 520, 320, .95, t, [{ t: 26.0, u: .45, A: 16 }, { t: 27.2, u: .7, A: 12, size: .8 }], { gold: 1 });
  ctx.restore();
  rr(px, py, pw, ph, 32); ctx.strokeStyle = GOLD; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
  ctx.save(); ctx.globalAlpha = inR; ctx.translate(lerp(560, 0, inR) - mg * 20, 0);
  ctx.save(); rr(560, py, pw, ph, 32); ctx.clip();
  paintSurface(560, py, pw, ph, t, true, .5 + t * .04);
  droplets(560, py + 120, pw, ph - 120, t, 26.7, 27.5, 23, 14, 10, 28);
  ctx.restore();
  rr(560, py, pw, ph, 32); ctx.strokeStyle = GOLD; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
  let e = env(t, 25.55, null);
  txt('PPF', 280, 410, { fam: 'Michroma', size: 44, color: GOLD_D, p: e.p });
  txt('حماية الطلاء', 280, 490, { size: 62, color: CHAR, p: e.p });
  e = env(t, 26.75, null);
  txt('NANO CERAMIC', 800, 410, { fam: 'Michroma', size: 30, color: GOLD_D, p: e.p });
  txt('لمعان وعناية', 800, 490, { size: 62, color: CHAR, p: e.p });
  logo(540, 130, 300, 1, false);
  // gold circular light transition into the combined SUV
  if (rad > 0) {
    ctx.save(); ctx.beginPath(); ctx.arc(540, 1010, rad, 0, 7); ctx.clip();
    darkStudio(900, 1240);
    suv(500, 190, 540, 1110, .98, { env: 'dark', film: 1, outline: eIO(prog(t, 28.5, 29.6)), gloss: 1, sweep: ((t - R0) * .55) % 1.4 });
    droplets(150, 900, 780, 200, t, 28.6, 40, 51, 6, 6, 12);
    let e2 = env(t, 28.35, null, .7);
    txtRich([{ s: 'تقنيتان… ', color: '#fff' }, { s: 'وعناية متكاملة.', grad: true }], 540, 420, { size: 86, p: e2.p });
    txt('PPF + NANO CERAMIC', 540, 540, { fam: 'Michroma', size: 44, color: '#e8e4da', p: prog(t, 28.7, 29.4) });
    logo(540, 130, 300, 1);
    ctx.restore();
    ctx.save(); ctx.strokeStyle = GOLD_L; ctx.lineWidth = 10; ctx.shadowColor = GOLD; ctx.shadowBlur = 40;
    ctx.globalAlpha = 1 - prog(t, R0 + .6, R0 + .9);
    ctx.beginPath(); ctx.arc(540, 1010, rad, 0, 7); ctx.stroke(); ctx.restore();
  }
}

function sBrand(t) {
  const hor = 1010;
  riyadh(hor, t);
  // reflective night floor
  let g = ctx.createLinearGradient(0, hor, 0, H);
  g.addColorStop(0, '#0d1a36'); g.addColorStop(.3, '#060b18'); g.addColorStop(1, '#020409');
  ctx.fillStyle = g; ctx.fillRect(0, hor, W, H - hor);
  // low-angle hero, camera pulls back
  const pb = eOut(prog(t, 30.4, 33.2)), s = lerp(1.12, .9, pb);
  const trails = [[0, 540, 150, -.06, 1.0], [2.1, 490, 120, .05, 1.25], [4.0, 580, 170, -.02, .85]];
  const drawTrails = front => {
    for (const tr of trails) {
      const th = tr[0] + (t - 30.4) * 2.2 * tr[4];
      ctx.save(); ctx.translate(540, 1010); ctx.rotate(tr[3]);
      ctx.shadowColor = GOLD; ctx.shadowBlur = 24; ctx.lineCap = 'round';
      for (let i = 0; i < 40; i++) {
        const a0 = th - i * .035, a1 = th - (i + 1) * .035;
        if ((Math.sin(a0) > 0) !== front) continue;
        ctx.strokeStyle = `rgba(243,215,122,${(1 - i / 40) * .9})`; ctx.lineWidth = 6 * (1 - i / 40) + .5;
        ctx.beginPath(); ctx.moveTo(Math.cos(a0) * tr[1], Math.sin(a0) * tr[2]); ctx.lineTo(Math.cos(a1) * tr[1], Math.sin(a1) * tr[2]); ctx.stroke();
      }
      ctx.restore();
    }
  };
  drawTrails(false);
  suv(500, 190, 540, 1000, s, { env: 'night', film: 1, gloss: 1, sweep: prog(t, 30.5, 33.5) }, '4,8,18');
  drawTrails(true);
  // logo reveal
  const lr = eIO(prog(t, 30.65, 31.4));
  ctx.save(); ctx.translate(540, 300); const sc = lerp(1.08, 1, eOut(prog(t, 30.65, 31.8))); ctx.scale(sc, sc);
  logo(0, 0, 840, 1, true, lr);
  if (lr > 0 && lr < 1) { ctx.fillStyle = GOLD_L; ctx.shadowColor = GOLD; ctx.shadowBlur = 30; ctx.fillRect(-420 + 840 * lr, -60, 4, 120); }
  ctx.restore();
  let e = env(t, 31.0, null, .6);
  txt('نانو برو للعناية الكاملة بالسيارات', 540, 430, { size: 52, wt: 700, color: '#f1eee6', p: e.p });
  e = env(t, 31.5, null, .6);
  txt('سيارتك تستحق الأفضل.', 540, 520, { size: 62, grad: true, p: e.p });
  // contact block
  const c = eBack(prog(t, 33.4, 33.85));
  if (c > 0) {
    ctx.save(); ctx.translate(540, 1330); ctx.scale(c, c);
    rr(-260, -60, 520, 120, 60);
    g = ctx.createLinearGradient(-260, 0, 260, 0); g.addColorStop(0, GOLD_D); g.addColorStop(.45, GOLD_L); g.addColorStop(1, GOLD);
    ctx.fillStyle = g; ctx.shadowColor = 'rgba(205,165,48,.6)'; ctx.shadowBlur = 40; ctx.fill(); ctx.restore();
    txt('احجز الآن', 540, 1326, { size: 60, color: '#0b0b0c' });
  }
  e = env(t, 31.9, null, .5);
  txt('0555463515', 540, 1490, { fam: 'Michroma', size: 70, color: '#fff', p: e.p, ls: 2 });
  e = env(t, 32.2, null, .5);
  txt('www.nanopro.sa', 540, 1595, { fam: 'Michroma', size: 42, color: GOLD_L, p: e.p });
  e = env(t, 32.5, null, .5);
  txt('الرياض — حي النرجس', 540, 1690, { size: 48, wt: 700, color: '#d9dbe3', p: e.p });
}

const S2 = [0, 4.0, 14.6, 18.0, 25.4, 30.4, 35.1];
const SCENES2 = [sHook, sPPF, sWarranty, sCeramic, sCombo, sBrand];
const XF2 = .4;
window.renderFrame = function (a) {
  ctx.save(); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); ctx.restore();
  for (let i = 0; i < SCENES2.length; i++) {
    const st = S2[i] - (i ? XF2 : 0), en = S2[i + 1];
    if (a < st || a >= en) continue;
    ctx.save(); ctx.globalAlpha = i ? clamp((a - st) / XF2) : 1; SCENES2[i](a); ctx.restore();
    if (i && a - st < XF2) {
      const k = (a - st) / XF2;
      ctx.save(); ctx.globalAlpha = Math.sin(k * Math.PI) * .8; ctx.fillStyle = GOLD_L; ctx.shadowColor = GOLD; ctx.shadowBlur = 40;
      ctx.fillRect(0, lerp(H * .2, H * .8, k), W, 3); ctx.restore();
    }
  }
  const fin = clamp(a / .3); if (fin < 1) { ctx.fillStyle = `rgba(0,0,0,${1 - fin})`; ctx.fillRect(0, 0, W, H); }
  const g = ctx.createRadialGradient(540, 960, 650, 540, 960, 1300);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.35)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalAlpha = .03; ctx.globalCompositeOperation = 'overlay';
  const ox = (a * 997) % 540, oy = (a * 613) % 960;
  ctx.drawImage(grain, -ox, -oy, 1080, 1920); ctx.drawImage(grain, 1080 - ox, -oy, 1080, 1920);
  ctx.drawImage(grain, -ox, 1920 - oy, 1080, 1920); ctx.drawImage(grain, 1080 - ox, 1920 - oy, 1080, 1920);
  ctx.restore();
};
