// SAWAHEL — advertising film. Deterministic timeline; window.renderAt(t), t = voice-over time.
const V = /[?&]v=1/.test(location.search);
const W = V ? 1080 : 1920, H = V ? 1920 : 1080;
const P = (h, v) => (V ? v : h);
const STAGE = document.getElementById('stage');
Object.assign(STAGE.style, { width: W + 'px', height: H + 'px' });
document.body.style.width = W + 'px'; document.body.style.height = H + 'px';
document.body.insertAdjacentHTML('afterbegin', defs());
const tl = gsap.timeline({ paused: true });
const updaters = [];
const $ = (r, q) => r.querySelector(q), $$ = (r, q) => [...r.querySelectorAll(q)];
const AY = 440; // vertical: art band top

function scene(id) { const d = document.createElement('div'); d.className = 'scene'; d.id = id; STAGE.appendChild(d); tl.set(d, { autoAlpha: 0 }, 0); return d; }
function art(sc, inner, cropX = 420) {
  const box = document.createElement('div'); box.className = 'artbox';
  Object.assign(box.style, V ? { left: 0, top: AY + 'px', width: '1080px', height: '1080px' } : { left: 0, top: 0, width: '1920px', height: '1080px' });
  box.innerHTML = `<svg viewBox="0 0 1920 1080" width="1920" height="1080" style="left:${V ? -cropX : 0}px">${inner}</svg>`;
  sc.appendChild(box); return box;
}
function text(parent, html, st, cls = '') { const d = document.createElement('div'); d.className = 'tx ' + cls; d.innerHTML = html; Object.assign(d.style, st); parent.appendChild(d); return d; }
function el(parent, html) { parent.insertAdjacentHTML('beforeend', html); return parent.lastElementChild; }
function splitWords(e) {
  const walk = (node) => [...node.childNodes].forEach((n) => {
    if (n.nodeType === 3) {
      const f = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach((p) => { if (!p) return; if (/^\s+$/.test(p)) f.appendChild(document.createTextNode(p)); else { const s = document.createElement('span'); s.className = 'w'; s.textContent = p; f.appendChild(s); } });
      n.replaceWith(f);
    } else if (n.nodeType === 1) walk(n);
  });
  walk(e); return e.querySelectorAll('.w');
}
function wordsIn(e, t, o = {}) {
  tl.set(e, { autoAlpha: 1 }, t);
  tl.fromTo(splitWords(e), { opacity: 0, y: o.y ?? 24, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: o.d ?? 0.6, stagger: o.st ?? 0.07, ease: 'power3.out' }, t);
}
function pop(e, t, d = 0.5, from = {}) { tl.fromTo(e, { autoAlpha: 0, y: 24, ...from }, { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: d, ease: 'power3.out' }, t); }
function out(e, t, d = 0.35) { tl.to(e, { autoAlpha: 0, duration: d, ease: 'power1.in' }, t); }
function sIn(sc, t, d = 0.5) { tl.fromTo(sc, { autoAlpha: 0 }, { autoAlpha: 1, duration: d, ease: 'power1.out' }, t); }
function sOut(sc, t, d = 0.5) { tl.to(sc, { autoAlpha: 0, duration: d, ease: 'power1.in' }, t); }
function prepDraw(els) { els.forEach((p) => { const L = p.getTotalLength() + 2; p.style.strokeDasharray = `${L} ${L}`; p.style.strokeDashoffset = L; }); return els; }
const lerp = (a, b, u) => a + (b - a) * u;
const clamp01 = (u) => Math.max(0, Math.min(1, u));
const ease = (u) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
function seg(t, t0, t1) { return ease(clamp01((t - t0) / (t1 - t0))); }
function chipHTML(ic, label) { return `<div class="ic">${iconSvg(ic, 26, '#fff', 3)}</div><span>${label}</span>`; }
function botanicals() {
  return `${sprig(80, 1080, 1.6, 10, C.olive, 0.22)}${sprig(1850, 1080, 1.5, -18, C.olive, 0.22)}${sprig(1800, 200, 1.1, 200, C.gold, 0.25)}${sprig(120, 160, 1.0, 160, C.gold, 0.25)}`;
}

/* =========================================================
   SCENE 1 — The search (0 – 7.6)
   ========================================================= */
(function s1() {
  const sc = scene('s1');
  const winArch = 'M350 700 L 350 300 A 170 170 0 0 1 690 300 L 690 700 Z';
  const room = `<g class="cam">
    <rect width="1920" height="840" fill="url(#gWall)"/><rect width="1920" height="840" fill="url(#pDots)" opacity="0.06"/>
    <path d="${winArch}" fill="#F6EBD2"/><clipPath id="s1w"><path d="${winArch}"/></clipPath>
    <g clip-path="url(#s1w)"><circle cx="520" cy="420" r="260" fill="url(#gGlow)"/><rect x="340" y="120" width="360" height="600" fill="url(#pLattice)" opacity="0.55"/></g>
    <path d="${winArch}" fill="none" stroke="${C.beige3}" stroke-width="14"/><path d="${winArch}" fill="none" stroke="${C.gold}" stroke-width="2.5"/>
    <rect x="330" y="700" width="380" height="18" rx="4" fill="${C.beige3}"/>
    <g><rect x="1180" y="220" width="300" height="210" rx="6" fill="${C.gold}"/><rect x="1192" y="232" width="276" height="186" fill="#F3E9D3"/>
      <circle cx="1400" cy="290" r="30" fill="${C.gold2}"/><path d="M1192 380 Q 1270 320 1350 360 T 1468 350 L 1468 418 L 1192 418 Z" fill="${C.beige3}"/><path d="M1192 400 Q 1290 360 1380 392 T 1468 386 L 1468 418 L 1192 418 Z" fill="${C.olive2}"/></g>
    <rect x="0" y="830" width="1920" height="250" fill="url(#gFloor)"/><rect x="0" y="826" width="1920" height="8" fill="${C.beige3}"/>
    <ellipse cx="960" cy="995" rx="660" ry="88" fill="${C.olive}" opacity="0.9"/><ellipse cx="960" cy="995" rx="630" ry="74" fill="none" stroke="${C.gold}" stroke-width="3"/>
    ${plant(470, 840, 1.25)}${plant(1460, 840, 1.35, C.beige2)}
    <!-- floor lamp -->
    <path d="M1610 830 L 1610 420 Q 1610 360 1540 350" stroke="${C.goldD}" stroke-width="6" fill="none"/><path d="M1490 350 L 1590 350 L 1572 300 L 1508 300 Z" fill="${C.gold2}"/><ellipse cx="1610" cy="832" rx="40" ry="8" fill="${C.goldD}"/>
    <!-- sofa -->
    <rect x="610" y="590" width="700" height="210" rx="40" fill="${C.beige2}"/>
    <rect x="650" y="630" width="200" height="150" rx="28" fill="${C.olive}"/><rect x="1070" y="630" width="200" height="150" rx="28" fill="${C.olive}"/>
    <rect x="670" y="650" width="160" height="4" fill="${C.gold}" opacity="0.7"/><rect x="1090" y="650" width="160" height="4" fill="${C.gold}" opacity="0.7"/>
    <rect x="590" y="780" width="740" height="84" rx="22" fill="${C.beige3}"/><rect x="600" y="784" width="720" height="10" rx="5" fill="${C.beige2}"/>
    <rect x="566" y="680" width="96" height="190" rx="34" fill="${C.beige2}"/><rect x="1258" y="680" width="96" height="190" rx="34" fill="${C.beige2}"/>
    <rect x="620" y="864" width="20" height="30" fill="${C.wood2}"/><rect x="1280" y="864" width="20" height="30" fill="${C.wood2}"/>
    ${omani({ x: 960, y: 930, s: 1.3, role: 'customer', pose: 'sit', id: 'cust1', arms: { L: [16, -116], R: [-16, 116] }, hold: 'phone' })}
    <!-- coffee table -->
    <rect x="690" y="912" width="540" height="22" rx="8" fill="${C.wood}"/><rect x="710" y="934" width="500" height="26" fill="${C.wood2}"/>
    <rect x="730" y="960" width="16" height="60" fill="${C.wood2}"/><rect x="1174" y="960" width="16" height="60" fill="${C.wood2}"/>
    ${dallah(800, 912, 0.95)}<g><circle cx="880" cy="904" r="9" fill="${C.gold2}"/><circle cx="902" cy="906" r="8" fill="${C.gold2}"/></g>
    <g><path d="M1030 912 Q 1080 890 1130 912 Z" fill="${C.beige}"/><ellipse cx="1080" cy="912" rx="52" ry="10" fill="${C.beige3}"/>${[1052, 1068, 1086, 1102, 1062, 1094].map((x, i) => `<ellipse cx="${x}" cy="${i > 3 ? 896 : 904}" rx="9" ry="6" fill="#6B3E26"/>`).join('')}</g>
  </g>`;
  const ab = art(sc, room, 420);
  const veil = el(sc, `<div class="veil" style="opacity:0"></div>`);
  // headline
  const head = text(sc, 'تبحث عن عاملة منزلية فلبينية؟', P({ left: '0', top: '64px', width: '1920px', textAlign: 'center', fontSize: '68px' }, { left: '40px', top: '190px', width: '1000px', textAlign: 'center', fontSize: '62px' }), 'head1');
  // chips
  const chips = [['briefcase', 'الخبرة'], ['training', 'التدريب'], ['price', 'السعر المناسب']].map(([ic, l], i) => {
    const c = el(sc, `<div class="chip">${chipHTML(ic, l)}</div>`);
    Object.assign(c.style, P({ right: '1240px', top: `${470 + i * 120}px`, fontSize: '34px' }, { right: `${[40, 360, 640][i]}px`, top: '1610px', fontSize: '28px', padding: '10px 22px 10px 16px' }));
    return c;
  });
  // phone UI
  const PW = P(410, 470), PH = P(860, 960), PL = P(1190, 305), PT = P(120, 500);
  const ph = el(sc, `<div class="phoneUI" style="left:${PL}px;top:${PT}px;width:${PW}px;height:${PH}px"><div class="scr">
      <div class="notch"></div><div class="sbar"></div>
      <div class="ttl">بحث</div>
      <div class="field">${iconSvg('search', 26, '#55775B', 3.5)}<span class="q"></span><span class="caret"></span></div>
      <div class="load"><i></i></div>
      <div class="res saw"><div class="row"><img src="assets/symbol.png"><div><div class="t1">سواحل لجلب الأيدي العاملة</div><div class="u">www.sawahloman.com</div></div></div><div class="ln" style="width:92%"></div><div class="ln" style="width:70%"></div><div class="ripple"></div></div>
      <div class="res sk"><div class="ln" style="width:60%;height:16px"></div><div class="ln" style="width:90%"></div><div class="ln" style="width:75%"></div></div>
      <div class="res sk"><div class="ln" style="width:52%;height:16px"></div><div class="ln" style="width:86%"></div><div class="ln" style="width:64%"></div></div>
      <div class="res sk"><div class="ln" style="width:58%;height:16px"></div><div class="ln" style="width:80%"></div></div>
    </div></div>`);
  const QUERY = 'مكتب استقدام عاملات منزليات فلبينيات';
  const qEl = $(ph, '.q'), caret = $(ph, '.caret');
  updaters.push((t) => {
    if (t > 8) return;
    const n = Math.round(QUERY.length * clamp01((t - 2.95) / 1.75));
    qEl.textContent = QUERY.slice(0, n);
    caret.style.opacity = (t > 4.75 || Math.floor(t * 3) % 2 === 0) ? (t > 4.75 ? 0 : 1) : 0;
  });
  const cust = $(sc, '#cust1');
  updaters.push((t) => {
    if (t > 8) return;
    const hd = $(cust, '.head');
    const look = t > 0.4 ? 1 : 0;
    hd.setAttribute('transform', `translate(0 ${look * 3}) rotate(${(Math.sin(t * 1.3) * 1.5).toFixed(2)} 0 -198)`);
    $(cust, '.eyes').setAttribute('transform', `translate(0 ${look * 2})`);
    // typing thumbs
    const typing = t > 2.95 && t < 4.7 ? Math.sin(t * 38) * 4 : 0;
    setArm(cust, 'armL', 16, -116 + typing); setArm(cust, 'armR', -16, 116 - typing);
  });

  // timeline
  sIn(sc, 0, 0.01);
  tl.fromTo($(ab, '.cam'), { scale: 1.06, svgOrigin: '960 722' }, { scale: 1.0, duration: 1.5, ease: 'power2.out' }, 0);
  wordsIn(head, 0.25, { st: 0.12, d: 0.8 });
  tl.to($(ab, '.cam'), { scale: 1.55, duration: 1.4, ease: 'power2.inOut' }, 1.45);
  tl.to(veil, { opacity: 0.62, duration: 0.6 }, 2.3);
  if (!V) tl.to(head, { left: 120, top: 300, width: 900, fontSize: 60, textAlign: 'right', duration: 0.8, ease: 'power3.inOut' }, 2.35);
  const camP = V ? [960 - 420 - 540 - (PL + PW / 2 - 540), 0] : [960 - (PL + PW / 2), 722 - (PT + PH / 2)];
  tl.fromTo(ph, { x: V ? 0 : camP[0], y: V ? 280 : camP[1], scale: 0.06, autoAlpha: 0 }, { x: 0, y: 0, scale: 1, autoAlpha: 1, duration: 0.85, ease: 'power3.out' }, 2.45);
  chips.forEach((c, i) => pop(c, [4.8, 5.5, 6.2][i], 0.5, { x: P(-30, 0) }));
  tl.fromTo($(ph, '.load i'), { width: '0%' }, { width: '100%', duration: 0.5, ease: 'power1.inOut' }, 4.8);
  tl.to($(ph, '.load'), { opacity: 0, duration: 0.2 }, 5.3);
  tl.set($$(ph, '.res'), { autoAlpha: 0 }, 0);
  tl.fromTo($$(ph, '.res.sk'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.12, ease: 'power2.out' }, 5.15);
  tl.fromTo($(ph, '.res.saw'), { autoAlpha: 0, y: -20, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.6)' }, 5.75);
  tl.to($$(ph, '.res.sk'), { opacity: 0.45, duration: 0.3 }, 6.0);
  tl.fromTo($(ph, '.ripple'), { scale: 0.2, opacity: 0.9 }, { scale: 2.6, opacity: 0, duration: 0.6, ease: 'power2.out' }, 6.65);
  tl.to($(ph, '.res.saw'), { scale: 0.97, duration: 0.1, yoyo: true, repeat: 1 }, 6.62);
  // expand into website
  tl.to(ph, { scale: 1.9, autoAlpha: 0, duration: 0.55, ease: 'power2.in' }, 7.05);
  chips.forEach((c) => out(c, 7.0, 0.3)); out(head, 7.0, 0.3);
  sOut(sc, 7.3, 0.35);
})();

/* =========================================================
   SCENE 2 — Discovering SAWAHEL (7.45 – 12.3)
   ========================================================= */
(function s2() {
  const sc = scene('s2');
  const bg = `<rect width="1920" height="1080" fill="${C.ivory}"/>
    <path d="M-100 820 Q 300 700 700 860 T 2020 800 L 2020 1180 L -100 1180 Z" fill="${C.beige}"/>
    <circle cx="1650" cy="260" r="260" fill="${C.beige}" opacity="0.7"/>${botanicals()}
    ${V ? '' : omani({ x: 1660, y: 1010, s: 1.38, role: 'customer', view: 'q', dir: -1, id: 'cust2', arms: { L: [12, -110], R: [-14, 112] }, hold: 'phone' })}`;
  art(sc, bg, 420);
  const BW = P(1160, 990), BH = P(800, 900), BL = P(180, 45), BT = P(185, 470);
  const br = el(sc, `<div class="browser" style="left:${BL}px;top:${BT}px;width:${BW}px;height:${BH}px">
    <div class="chrome"><span class="dot"></span><span class="dot"></span><span class="dot"></span><div class="addr">${iconSvg('globe', 22, '#55775B', 4)}www.sawahloman.com</div></div>
    <div class="vp"><div class="page">
      <div class="hdr"><img src="assets/logo.png"><div class="ph">+96896631821</div></div>
      <div class="hero"><img src="assets/logo_white.png" style="width:${P(520, 460)}px"><div class="ht">عاملات منزليات فلبينيات</div></div>
      <div class="sec" style="${V ? 'flex-direction:column' : ''}">
        <div class="card"><div class="k">${iconSvg('pin', 30, '#C5A059', 4)}</div><div class="k">الموقع</div><div class="va">سلطنة عُمان — مسقط — الخوير</div></div>
        <div class="card"><div class="k">${iconSvg('phone', 30, '#C5A059', 4)}</div><div class="k">اتصل بنا</div><div class="v">+96896631821</div><div class="v">+96822431008</div></div>
      </div></div></div></div>`);
  const head = text(sc, 'مع سواحل... أصبح الوصول إلى <span class="gold">خياراتك أسهل</span>', P({ left: 0, top: '58px', width: '1920px', textAlign: 'center', fontSize: '54px' }, { left: '40px', top: '190px', width: '1000px', textAlign: 'center', fontSize: '54px' }), 'head1');
  sIn(sc, 7.4, 0.35);
  tl.fromTo(br, { scale: 0.55, autoAlpha: 0, y: 40 }, { scale: 1, autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 7.35);
  wordsIn(head, 7.75, { st: 0.08 });
  const ht = $(br, '.hero .ht');
  tl.to(ht, { borderColor: '#C5A059', duration: 0.3, yoyo: true, repeat: 3 }, 8.7);
  tl.to($(br, '.page'), { y: P(-300, -420), duration: 1.2, ease: 'power2.inOut' }, 9.75);
  tl.fromTo($$(br, '.card'), { borderColor: '#E2D9C4' }, { borderColor: '#C5A059', duration: 0.4, stagger: 0.2 }, 10.9);
  const cust = $(sc, '#cust2');
  if (cust) updaters.push((t) => {
    if (t < 7 || t > 12.6) return;
    const sw = t > 9.7 && t < 10.9 ? Math.sin(t * 20) * 6 : 0;
    setArm(cust, 'armR', -14, 112 + sw);
    $(cust, '.head').setAttribute('transform', `rotate(${(Math.sin(t * 1.1) * 2).toFixed(2)} 0 -226)`);
  });
  tl.to(br, { scale: 0.2, autoAlpha: 0, x: P(300, 0), duration: 0.5, ease: 'power3.in' }, 11.85);
  out(head, 11.8, 0.3);
  sOut(sc, 12.05, 0.3);
})();

/* =========================================================
   SCENE 3 — Map → office exterior → reception (12.1 – 19.35)
   ========================================================= */
(function s3map() {
  const sc = scene('s3map');
  const coast = 'M0 300 Q 220 360 380 310 Q 520 270 640 330 Q 760 390 900 350 Q 1040 300 1150 360 Q 1260 420 1400 360 Q 1560 300 1700 340 Q 1820 370 1920 330 L 1920 0 L 0 0 Z';
  const roads = ['M0 760 Q 600 700 1000 640 T 1920 560', 'M300 1080 Q 420 760 640 600 T 1100 380', 'M1500 1080 Q 1350 760 1240 560 T 1180 380', 'M0 940 L 1920 880', 'M820 1080 Q 880 820 1000 640'];
  const route = 'M560 860 Q 620 760 760 700 Q 900 640 1000 640 Q 1110 640 1180 540';
  let blocks = '';
  [[200, 520, 180, 110], [470, 470, 150, 90], [1300, 620, 210, 120], [1560, 470, 170, 100], [980, 800, 220, 110], [180, 830, 160, 90], [1600, 760, 200, 120], [700, 880, 140, 80]].forEach(([x, y, w, h]) => {
    blocks += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="${C.beige2}"/>`;
  });
  const mapSvg = `<g class="cam"><rect width="1920" height="1080" fill="${C.beige}"/>${blocks}
    <path d="${coast}" fill="${C.sage}"/><path d="${coast}" fill="url(#pWave)" opacity="0.6"/><path d="${coast}" fill="none" stroke="${C.olive2}" stroke-width="3"/>
    ${roads.map((d) => `<path d="${d}" stroke="#fff" stroke-width="16" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${C.gold3}" stroke-width="3" fill="none"/>`).join('')}
    <text x="760" y="170" text-anchor="middle" font-family="Plex" font-weight="600" font-size="34" fill="${C.olive}" direction="rtl">بحر عُمان</text>
    <text x="1330" y="250" text-anchor="middle" font-family="Alexandria" font-weight="700" font-size="44" fill="${C.green}" direction="rtl" class="city">مسقط</text>
    <g class="home"><circle cx="560" cy="860" r="34" fill="#fff" stroke="${C.olive}" stroke-width="3"/>${icon('home', 560, 860, 40, C.olive, 3.4)}</g>
    <path class="route" d="${route}" stroke="${C.green}" stroke-width="7" fill="none" stroke-linecap="round" stroke-dasharray="1 0"/>
    <circle class="mover" r="11" fill="${C.gold}" stroke="#fff" stroke-width="3"/>
    <g class="pin"><ellipse cx="1180" cy="548" rx="26" ry="8" fill="#000" opacity="0.12"/><path d="M1180 548 C 1158 520 1142 500 1142 478 C 1142 456 1159 440 1180 440 C 1201 440 1218 456 1218 478 C 1218 500 1202 520 1180 548 Z" fill="${C.green}"/><circle cx="1180" cy="478" r="15" fill="${C.gold}"/></g>
    <g class="lbl"><rect x="1000" y="356" width="360" height="62" rx="31" fill="#fff" stroke="${C.gold}" stroke-width="2.5"/>
      <text x="1180" y="398" text-anchor="middle" font-family="Alexandria" font-weight="600" font-size="28" fill="${C.green}" direction="rtl">مكتب سواحل — الخوير</text></g></g>`;
  const ab = art(sc, mapSvg, 420);
  const head = text(sc, 'زر مكتب سواحل في <span class="gold">الخوير</span>', P({ left: 0, top: '930px', width: '1920px', textAlign: 'center', fontSize: '50px' }, { left: '40px', top: '210px', width: '1000px', textAlign: 'center', fontSize: '56px' }), 'head1');
  if (!V) Object.assign(head.style, { textShadow: '0 0 18px #F7F4EA, 0 0 30px #F7F4EA' });
  sIn(sc, 12.05, 0.4);
  const rt = $(ab, '.route'); const L = rt.getTotalLength();
  rt.style.strokeDasharray = `${L} ${L}`;
  updaters.push((t) => {
    if (t < 11.9 || t > 14.6) return;
    const u = seg(t, 12.6, 13.75);
    rt.style.strokeDashoffset = L * (1 - u);
    const p = rt.getPointAtLength(L * u);
    const m = $(ab, '.mover'); m.setAttribute('cx', p.x.toFixed(1)); m.setAttribute('cy', p.y.toFixed(1)); m.style.opacity = u > 0 && u < 1 ? 1 : (u >= 1 ? 0 : 1);
  });
  tl.fromTo($(ab, '.pin'), { y: -120, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'bounce.out' }, 12.35);
  tl.fromTo($(ab, '.home'), { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.4, ease: 'back.out(2)' }, 12.3);
  tl.fromTo($(ab, '.lbl'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4 }, 13.6);
  wordsIn(head, 12.5);
  tl.to($(ab, '.cam'), { scale: 2.6, svgOrigin: '1180 500', duration: 0.7, ease: 'power3.in' }, 13.85);
  out(head, 13.8, 0.25);
  sOut(sc, 14.2, 0.35);
})();

(function s3ext() {
  const sc = scene('s3ext');
  let merl = '';
  for (let x = 520; x < 1400; x += 44) merl += `<path d="M${x} 360 L ${x} 336 Q ${x + 14} 322 ${x + 28} 336 L ${x + 28} 360 Z" fill="#F4EFE3"/>`;
  const winA = (x) => `<path d="M${x} 560 L ${x} 470 A 40 40 0 0 1 ${x + 80} 470 L ${x + 80} 560 Z" fill="${C.sage}" stroke="${C.green}" stroke-width="6"/><path d="M${x + 40} 432 L ${x + 40} 560" stroke="${C.green}" stroke-width="3"/>`;
  const palm = (x, b, h) => `<g><path d="M${x} ${b} Q ${x + 10} ${b - h * 0.5} ${x + 4} ${b - h}" stroke="${C.wood2}" stroke-width="12" fill="none"/>${[-160, -125, -85, -45, -10, 20].map((a) => { const r = a * Math.PI / 180; return `<path d="M${x + 4} ${b - h} q ${(Math.cos(r) * 50).toFixed(1)} ${(Math.sin(r) * 50 - 12).toFixed(1)} ${(Math.cos(r) * 95).toFixed(1)} ${(Math.sin(r) * 95 + 22).toFixed(1)}" stroke="${C.olive}" stroke-width="11" fill="none" stroke-linecap="round"/>`; }).join('')}</g>`;
  const ext = `<g class="cam"><rect width="1920" height="1080" fill="url(#gSky)"/><circle cx="1500" cy="260" r="300" fill="url(#gGlow)"/>
    <path d="M0 700 Q 400 640 800 690 T 1920 660 L 1920 900 L 0 900 Z" fill="${C.beige}" opacity="0.7"/>
    ${palm(400, 900, 330)}${palm(1530, 900, 360)}
    <rect x="510" y="360" width="900" height="540" fill="#FBF8F1"/><rect x="1150" y="360" width="260" height="540" fill="#EFE8D9"/>${merl}
    <rect x="500" y="356" width="920" height="10" fill="${C.beige3}"/>
    ${winA(570)}${winA(1270)}
    ${[570, 690, 1150, 1270].map((x) => `<g>${`<rect x="${x}" y="660" width="80" height="120" rx="6" fill="${C.sage}" stroke="${C.green}" stroke-width="6"/>`}</g>`).join('')}
    <!-- sign -->
    <rect x="680" y="410" width="560" height="110" rx="12" fill="#fff" stroke="${C.green}" stroke-width="6"/>
    <image href="assets/symbol.png" x="1160" y="422" width="62" height="88"/>
    <text x="1145" y="476" text-anchor="start" direction="rtl" font-family="Alexandria" font-weight="700" font-size="30" fill="${C.green}">سواحل لجلب الأيدي العاملة</text>
    <rect x="700" y="496" width="440" height="3" fill="${C.gold}"/>
    <!-- entrance -->
    <path d="M850 900 L 850 640 A 110 110 0 0 1 1070 640 L 1070 900 Z" fill="${C.green}"/>
    <clipPath id="doorc"><rect x="872" y="600" width="176" height="300"/></clipPath>
    <rect x="872" y="600" width="176" height="300" fill="#E8E2D2"/>
    <g clip-path="url(#doorc)"><rect x="872" y="600" width="176" height="300" fill="${C.green2}" opacity="0.35"/>
      <g class="doorL"><rect x="872" y="600" width="88" height="300" fill="#CFE0D3" opacity="0.92"/><rect x="872" y="600" width="88" height="300" fill="none" stroke="${C.goldD}" stroke-width="4"/><rect x="946" y="730" width="5" height="60" fill="${C.goldD}"/></g>
      <g class="doorR"><rect x="960" y="600" width="88" height="300" fill="#CFE0D3" opacity="0.92"/><rect x="960" y="600" width="88" height="300" fill="none" stroke="${C.goldD}" stroke-width="4"/><rect x="969" y="730" width="5" height="60" fill="${C.goldD}"/></g></g>
    ${plant(800, 902, 0.8)}${plant(1120, 902, 0.8)}
    <rect x="0" y="900" width="1920" height="70" fill="${C.beige2}"/><rect x="0" y="898" width="1920" height="4" fill="${C.beige3}"/>
    <rect x="0" y="970" width="1920" height="110" fill="${C.beige4}"/>${Array.from({ length: 12 }, (_, i) => `<rect x="${i * 170 + 20}" y="1022" width="90" height="8" rx="4" fill="#fff" opacity="0.7"/>`).join('')}
    ${omaniSide({ x: 0, y: 935, s: 1.3, role: 'customer', id: 'walk1' })}</g>`;
  const ab = art(sc, ext, 420);
  const chipLoc = el(sc, `<div class="chip">${chipHTML('pin', 'سلطنة عُمان — مسقط — الخوير')}</div>`);
  Object.assign(chipLoc.style, P({ right: '60px', top: '50px', fontSize: '30px' }, { right: '120px', top: '250px', fontSize: '30px' }));
  sIn(sc, 14.15, 0.4);
  pop(chipLoc, 14.4);
  out(chipLoc, 16.05, 0.3);
  tl.fromTo($(ab, '.cam'), { scale: 1, svgOrigin: '960 700' }, { scale: 1.08, duration: 2.3, ease: 'sine.inOut' }, 14.15);
  const wk = $(ab, '#walk1');
  updaters.push((t) => {
    if (t < 14 || t > 16.6) return;
    const u = clamp01((t - 14.3) / 1.55);
    const x = lerp(270, 905, u);
    wk.firstElementChild.setAttribute('transform', `translate(${x.toFixed(1)} 935) scale(1.3 1.3)`);
    walkPose(wk, (t - 14.3) * 9, u < 1 ? 1 : 0);
    wk.style.opacity = t < 16.0 ? 1 : Math.max(0, 1 - (t - 16.0) / 0.25);
  });
  tl.to($(ab, '.doorL'), { x: -84, duration: 0.45, ease: 'power2.inOut' }, 15.55);
  tl.to($(ab, '.doorR'), { x: 84, duration: 0.45, ease: 'power2.inOut' }, 15.55);
  sOut(sc, 16.25, 0.3);
})();

function receptionArt(idC, idE, custX, custDir) {
  let slats = '';
  for (let x = 40; x < 1920; x += 80) slats += `<rect x="${x}" y="0" width="2" height="770" fill="${C.gold}" opacity="0.12"/>`;
  const lamp = (x) => `<g><line x1="${x}" y1="0" x2="${x}" y2="150" stroke="${C.goldD}" stroke-width="3"/><path d="M${x - 46} 196 Q ${x} 130 ${x + 46} 196 Z" fill="url(#gGold)"/><ellipse cx="${x}" cy="200" rx="60" ry="12" fill="#FFF4D8" opacity="0.5"/></g>`;
  return `<g class="cam">
    <rect width="1920" height="780" fill="url(#gGreenWall)"/>${slats}
    <rect x="0" y="770" width="1920" height="310" fill="url(#gFloor)"/><rect x="0" y="766" width="1920" height="10" fill="${C.goldD}"/>
    <rect x="686" y="120" width="548" height="268" rx="14" fill="#000" opacity="0.08"/>
    <image class="wallLogo" href="assets/logo_gold.png" x="700" y="130" width="520" height="225.5"/>
    ${lamp(560)}${lamp(1360)}
    ${plant(500, 780, 1.35)}${plant(1440, 780, 1.35)}
    ${omani({ x: 1110, y: 905, s: 1.3, role: 'employee', id: idE, arms: { L: [7, 0], R: [-7, 0] } })}
    <!-- reception desk -->
    <rect x="850" y="690" width="520" height="26" rx="6" fill="#fff"/><rect x="866" y="716" width="488" height="200" fill="${C.beige2}"/>
    <rect x="866" y="760" width="488" height="8" fill="${C.gold}"/><rect x="866" y="780" width="488" height="3" fill="${C.gold}" opacity="0.6"/>
    <image href="assets/symbol.png" x="1080" y="800" width="60" height="89"/>
    ${custDir === 'side' ? omaniSide({ x: custX, y: 945, s: 1.3, role: 'customer', dir: -1, id: idC + 'w' }) : ''}
    ${omani({ x: custX, y: 945, s: 1.3, role: 'customer', view: 'q', dir: 1, id: idC })}
  </g>`;
}

(function s3rec() {
  const sc = scene('s3rec');
  const ab = art(sc, receptionArt('cust3', 'emp3', 780), 420);
  const ban = el(sc, `<div class="banner">نرحب بكم في مكتب سواحل — الخوير</div>`);
  Object.assign(ban.style, P({ left: '560px', top: '965px', width: '800px', fontSize: '40px', padding: '14px 30px' }, { left: '60px', top: '220px', width: '960px', fontSize: '42px', padding: '18px 30px' }));
  sIn(sc, 16.25, 0.35);
  pop(ban, 16.6, 0.6);
  const cu = $(ab, '#cust3'), em = $(ab, '#emp3');
  updaters.push((t) => {
    if (t < 16 || t > 19.6) return;
    // customer walks in (3/4 view) then stops
    const u = clamp01((t - 16.3) / 0.75);
    const x = lerp(560, 780, ease(u));
    const bob = u < 1 ? -Math.abs(Math.sin((t - 16.3) * 9)) * 5 : 0;
    cu.firstElementChild.setAttribute('transform', `translate(${x.toFixed(1)} ${(945 + bob).toFixed(1)}) scale(1.3 1.3)`);
    // employee wave
    const wv = seg(t, 16.55, 16.8) * (1 - seg(t, 17.25, 17.5));
    const osc = Math.sin((t - 16.55) * 14) * 14 * wv;
    // handshake
    const hs = seg(t, 17.55, 17.95) * (1 - seg(t, 18.6, 18.95));
    const shake = Math.sin((t - 17.95) * 18) * 4 * (t > 17.95 && t < 18.6 ? 1 : 0);
    setArm(em, 'armR', lerp(-7, -150, wv) + osc * 0.3, lerp(0, -25, wv) + osc);
    setArm(em, 'armL', lerp(7, 66, hs) + shake, lerp(0, -10, hs));
    setArm(cu, 'armR', lerp(-7, -80, hs) + shake, lerp(0, 4, hs));
    $(em, '.head').setAttribute('transform', `rotate(${(-3 * hs + Math.sin(t * 1.3) * 1.2).toFixed(2)} 0 -226)`);
  });
  sOut(sc, 19.05, 0.35);
})();

/* =========================================================
   SCENE 4 — Exploring the options (19.2 – 28.1)
   ========================================================= */
(function s4() {
  const sc = scene('s4');
  let slats = '';
  for (let x = 40; x < 1920; x += 80) slats += `<rect x="${x}" y="0" width="2" height="800" fill="${C.gold}" opacity="0.12"/>`;
  const m = `<g class="cam"><rect width="1920" height="800" fill="url(#gGreenWall)"/>${slats}
    <rect x="0" y="790" width="1920" height="290" fill="url(#gFloor)"/><rect x="0" y="786" width="1920" height="8" fill="${C.goldD}"/>
    <image href="assets/logo_gold.png" x="1540" y="40" width="300" height="130" opacity="0.9"/>
    ${plant(330, 800, 1.3)}${plant(1600, 800, 1.3)}
    ${omani({ x: 690, y: 1012, s: 1.3, role: 'customer', view: 'q', dir: 1, pose: 'sit', id: 'cust4', arms: { L: [10, -20], R: [-48, -42] } })}
    ${omani({ x: 1230, y: 1012, s: 1.3, role: 'employee', view: 'q', dir: -1, pose: 'sit', id: 'emp4', arms: { L: [10, -20], R: [-48, -42] } })}
    <rect x="500" y="840" width="920" height="26" rx="6" fill="#fff"/><rect x="520" y="866" width="880" height="214" fill="${C.beige2}"/><rect x="520" y="900" width="880" height="6" fill="${C.gold}"/>
    <g class="folder"><rect x="880" y="818" width="170" height="24" rx="4" fill="${C.green2}"/><g class="cover"><rect x="880" y="812" width="170" height="24" rx="4" fill="${C.green}"/><rect x="940" y="820" width="50" height="5" fill="${C.gold}"/></g></g>
    <g class="papers">${[0, 1, 2].map((i) => `<rect class="pp" x="${900 + i * 12}" y="806" width="110" height="20" rx="3" fill="#fff" stroke="${C.line}"/>`).join('')}</g></g>`;
  const ab = art(sc, m, 420);
  const head = text(sc, 'خيارات متنوعة... <span class="gold">لتجد ما يناسب احتياجاتك</span>', P({ left: 0, top: '28px', width: '1920px', textAlign: 'center', fontSize: '50px', textShadow: '0 2px 18px rgba(0,0,0,.25)' }, { left: '40px', top: '190px', width: '1000px', textAlign: 'center', fontSize: '52px', whiteSpace: 'normal' }), 'head1');
  if (!V) head.style.color = '#F7F4EA';
  const rows = [['briefcase', 'الخبرة', 'exp'], ['skills', 'المهارات', 'skl'], ['training', 'التدريب', 'trn'], ['price', 'السعر', 'prc']];
  const CW = P(300, 316), CH = P(488, 520), CX = P([1320, 960, 600], [880, 540, 200]), CT = P(112, 500);
  const cards = [0, 1, 2].map((v, i) => {
    const c = el(sc, `<div class="pcard"><div class="tag">ملف نموذجي</div>
      <div class="por"><svg viewBox="-75 -150 150 150" width="136" height="136"><circle cx="0" cy="-75" r="75" fill="#E9DFC9"/>${workerBust(v)}</svg></div>
      <div class="nm"></div><div class="nat">عاملة منزلية فلبينية</div>
      ${rows.map(([ic, lb, k]) => `<div class="rw ${k}"><div class="ii">${iconSvg(ic, 22, '#164B3A', 3.5)}</div><div class="lb">${lb}</div><div class="bar"></div></div>`).join('')}
      <div class="sel"></div><div class="ok">${iconSvg('check', 34, '#fff', 6)}</div></div>`);
    Object.assign(c.style, { left: CX[i] - CW / 2 + 'px', top: CT + 'px', width: CW + 'px', height: CH + 'px' });
    return c;
  });
  const sub = el(sc, `<div class="tx body1" style="font-weight:600">خبرات متنوعة &nbsp;|&nbsp; مهارات &nbsp;|&nbsp; أسعار تنافسية</div>`);
  Object.assign(sub.style, P({ left: '520px', top: '955px', width: '880px', textAlign: 'center', fontSize: '38px', color: '#164B3A' }, { left: '40px', top: '1600px', width: '1000px', textAlign: 'center', fontSize: '40px', color: '#164B3A' }));
  const note = el(sc, `<div class="tx body1" style="color:#55775B">* ملفات توضيحية لأغراض العرض فقط</div>`);
  Object.assign(note.style, P({ left: '1440px', top: '1030px', width: '440px', textAlign: 'right', fontSize: '20px' }, { left: '40px', top: '1830px', width: '1000px', textAlign: 'center', fontSize: '24px' }));

  sIn(sc, 19.15, 0.35);
  wordsIn(head, 19.4, { st: 0.07 });
  tl.to($(ab, '.cover'), { scaleY: -1, svgOrigin: '965 812', duration: 0.4, ease: 'power2.inOut' }, 19.6);
  tl.fromTo($$(ab, '.pp'), { y: 0 }, { y: -60, opacity: 0, duration: 0.5, stagger: 0.12, ease: 'power2.in' }, 19.95);
  cards.forEach((c, i) => tl.fromTo(c, { autoAlpha: 0, y: P(420, 600), scale: 0.4, rotation: [-8, 4, 8][i] }, { autoAlpha: 1, y: 0, scale: 1, rotation: 0, duration: 0.65, ease: 'back.out(1.3)' }, 20.15 + i * 0.22));
  const hl = (k, t) => {
    tl.to(cards.map((c) => $(c, '.rw.' + k)), { backgroundColor: '#F4ECDA', duration: 0.25 }, t);
    tl.fromTo(cards.map((c) => $(c, '.rw.' + k + ' .ii')), { scale: 1 }, { scale: 1.25, duration: 0.25, yoyo: true, repeat: 1 }, t);
    tl.to(cards.map((c) => $(c, '.rw.' + k)), { backgroundColor: 'rgba(0,0,0,0)', duration: 0.4 }, t + 0.9);
  };
  hl('exp', 22.2); hl('skl', 22.85); hl('trn', 23.3); hl('prc', 23.75);
  pop(sub, 22.3, 0.5);
  pop(note, 21.2, 0.4);
  // selection
  tl.to([cards[0], cards[2]], { opacity: 0.5, scale: 0.94, duration: 0.45 }, 26.2);
  tl.to(cards[1], { scale: 1.07, y: P(20, -10), duration: 0.45, ease: 'back.out(1.6)' }, 26.2);
  tl.to($(cards[1], '.sel'), { opacity: 1, duration: 0.3 }, 26.3);
  tl.fromTo($(cards[1], '.ok'), { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2.2)' }, 26.45);
  // characters
  const cu = $(ab, '#cust4'), em = $(ab, '#emp4');
  updaters.push((t) => {
    if (t < 19 || t > 28.3) return;
    const pt = seg(t, 20.8, 21.1) * (1 - seg(t, 21.9, 22.2)) + seg(t, 24.2, 24.5) * (1 - seg(t, 25.6, 25.9));
    const open = seg(t, 22.3, 22.6) * (1 - seg(t, 23.6, 23.9));
    setArm(em, 'armR', lerp(-48, -148, pt) + lerp(0, -22, open), lerp(-42, -8, pt) + lerp(0, -50, open));
    setArm(em, 'armL', 10 + Math.sin(t * 2) * 2, -20);
    const nod = (t > 26.4 && t < 27.4) ? Math.sin((t - 26.4) * 12.5) * 5 : 0;
    const think = seg(t, 23.0, 23.3) * (1 - seg(t, 25.0, 25.3));
    $(cu, '.head').setAttribute('transform', `rotate(${(-3 * think + nod).toFixed(2)} 0 -198) translate(0 ${(nod * 0.4).toFixed(2)})`);
    $(em, '.head').setAttribute('transform', `rotate(${(Math.sin(t * 1.7) * 2).toFixed(2)} 0 -198)`);
    setArm(cu, 'armR', -48 + Math.sin(t * 1.4) * 2, -42);
  });
  sOut(sc, 27.85, 0.35);
})();

/* =========================================================
   SCENE 5 — Thanks, exit, brand reveal (27.95 – 39.5)
   ========================================================= */
(function s5rec() {
  const sc = scene('s5rec');
  const ab = art(sc, receptionArt('cust5', 'emp5', 780, 'side'), 420);
  sIn(sc, 27.9, 0.35);
  const cu = $(ab, '#cust5'), wk = $(ab, '#cust5w'), em = $(ab, '#emp5');
  updaters.push((t) => {
    if (t < 27.7 || t > 30.8) return;
    const hs = seg(t, 27.95, 28.25) * (1 - seg(t, 28.65, 28.9));
    const shake = Math.sin((t - 28.25) * 18) * 4 * (t > 28.25 && t < 28.65 ? 1 : 0);
    setArm(em, 'armL', lerp(7, 66, hs) + shake, lerp(0, -10, hs));
    setArm(cu, 'armR', lerp(-7, -80, hs) + shake, lerp(0, 4, hs));
    const turned = t > 28.95;
    cu.style.opacity = turned ? 0 : 1; wk.style.opacity = turned ? 1 : 0;
    const u = clamp01((t - 28.95) / 1.1);
    wk.firstElementChild.setAttribute('transform', `translate(${lerp(780, 420, u).toFixed(1)} 945) scale(-1.3 1.3)`);
    walkPose(wk, (t - 28.95) * 9, 1);
    $(em, '.head').setAttribute('transform', `rotate(${(-4 * hs + (t > 29 ? -3 : 0)).toFixed(2)} 0 -226)`);
    if (t > 29) setArm(em, 'armL', 7 + seg(t, 29.0, 29.2) * 40 * (1 - seg(t, 29.7, 29.9)) + Math.sin(t * 14) * 6 * (t < 29.8 ? 1 : 0), -30 * seg(t, 29, 29.2));
  });
  tl.to($(ab, '.cam'), { scale: 2.6, svgOrigin: '960 243', duration: 1.25, ease: 'power3.inOut' }, 29.2);
  sOut(sc, 30.25, 0.4);
})();

(function s5end() {
  const sc = scene('s5end');
  const deco = `<rect width="1920" height="1080" fill="${C.ivory}"/>
    <circle cx="${P(1880, 1060)}" cy="${P(80, 160)}" r="260" fill="none" stroke="${C.gold}" stroke-width="2.5" class="ring"/>
    <circle cx="${P(1880, 1060)}" cy="${P(80, 160)}" r="200" fill="none" stroke="${C.green}" stroke-width="2" opacity="0.5" class="ring"/>
    <circle cx="${P(40, 20)}" cy="${P(1000, 1050)}" r="240" fill="none" stroke="${C.gold}" stroke-width="2.5" class="ring"/>
    <circle cx="${P(40, 20)}" cy="${P(1000, 1050)}" r="180" fill="none" stroke="${C.green}" stroke-width="2" opacity="0.5" class="ring"/>
    <path d="M-50 1080 Q 300 980 600 1060 T 1300 1040 T 1970 1000 L 1970 1130 L -50 1130 Z" fill="${C.beige}" opacity="0.8"/>
    ${botanicals()}`;
  const box = document.createElement('div'); box.className = 'artbox';
  Object.assign(box.style, { left: 0, top: 0, width: W + 'px', height: H + 'px' });
  box.innerHTML = `<svg viewBox="0 0 ${V ? '1080 1920' : '1920 1080'}" width="${W}" height="${H}" style="left:0">${V ? deco.replace('width="1920" height="1080"', 'width="1080" height="1920"') : deco}</svg>`;
  sc.appendChild(box);
  const LW = P(640, 800), LH = LW * 1066 / 2458;
  const logo = el(sc, `<img src="assets/logo.png" style="position:absolute;left:${(W - LW) / 2}px;top:${P(70, 300)}px;width:${LW}px;height:${LH}px">`);
  const slogan = text(sc, 'عاملتك المنزلية المناسبة <span class="gold">تبدأ من سواحل</span>', P({ left: 0, top: '390px', width: '1920px', textAlign: 'center', fontSize: '58px' }, { left: '40px', top: '720px', width: '1000px', textAlign: 'center', fontSize: '58px', whiteSpace: 'normal' }), 'head1');
  const sup = text(sc, 'عاملات منزليات فلبينيات &nbsp;|&nbsp; خيارات متنوعة &nbsp;|&nbsp; أسعار تنافسية', P({ left: 0, top: '488px', width: '1920px', textAlign: 'center', fontSize: '34px' }, { left: '40px', top: '930px', width: '1000px', textAlign: 'center', fontSize: '34px', whiteSpace: 'normal', lineHeight: '1.6' }), 'body1');
  const cp = el(sc, `<div class="cpanel">
    <div class="it">${iconSvg('phone', 30, '#D8BA7E', 4)}<span>+96896631821</span></div>
    <div class="it">${iconSvg('phone', 30, '#D8BA7E', 4)}<span>+96822431008</span></div>
    <div class="it">${iconSvg('globe', 30, '#D8BA7E', 4)}<span>www.sawahloman.com</span></div>
    <div class="it ar">${iconSvg('pin', 30, '#D8BA7E', 4)}<span>سلطنة عُمان — مسقط — الخوير</span></div></div>`);
  Object.assign(cp.style, P({ left: '330px', top: '590px', width: '1260px', fontSize: '34px' }, { left: '90px', top: '1110px', width: '900px', fontSize: '38px', flexDirection: 'column', gap: '26px', padding: '40px' }));
  const fin = text(sc, 'اختيارك المناسب يبدأ من سواحل.', P({ left: 0, top: '850px', width: '1920px', textAlign: 'center', fontSize: '46px', color: '#9C7A3A' }, { left: '40px', top: '1640px', width: '1000px', textAlign: 'center', fontSize: '48px', color: '#9C7A3A' }), 'head1');
  sIn(sc, 30.15, 0.45);
  tl.fromTo(logo, { autoAlpha: 0, scale: 1.25, filter: 'blur(10px)' }, { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out' }, 30.2);
  const rings = prepDraw($$(box, '.ring'));
  tl.to(rings, { strokeDashoffset: 0, duration: 1.6, stagger: 0.12, ease: 'power2.inOut' }, 30.3);
  wordsIn(slogan, 30.85, { st: 0.09 });
  wordsIn(sup, 32.3, { st: 0.05 });
  tl.fromTo(cp, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 33.2);
  tl.fromTo($$(cp, '.it'), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.18 }, 33.45);
  wordsIn(fin, 36.35, { st: 0.1 });
  tl.to({}, { duration: 0.01 }, 39.49);
})();

STAGE.insertAdjacentHTML('beforeend', '<div class="vgn"></div>');
window.DUR = 39.5;
window.renderAt = (t) => { tl.seek(t, false); updaters.forEach((f) => f(t)); };
window.renderAt(0);
window.__ready = document.fonts.ready.then(() => true);
