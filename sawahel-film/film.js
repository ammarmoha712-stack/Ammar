import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// ───────────────────────── helpers
const W = 1080, H = 1920;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, k) => a + (b - a) * k;
const prog = (t, a, b) => clamp((t - a) / (b - a));
const eIO = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const eOut = x => 1 - Math.pow(1 - x, 3);
const eOutQ = x => 1 - Math.pow(1 - x, 5);
const eIn = x => x * x * x;
const eBack = x => { const c1 = 1.35, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
const sm = (t, a, b) => eIO(prog(t, a, b));
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

// ───────────────────────── renderer / scene
const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(W, H, false);
renderer.setClearColor(0x000000, 0);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = 1.0;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.55;

const camera = new THREE.PerspectiveCamera(30, W / H, 0.5, 400);
scene.add(camera);

const hemi = new THREE.HemisphereLight(0xFFFFFF, 0xDCE6DE, 1.1); scene.add(hemi);
const key = new THREE.DirectionalLight(0xFFF4E2, 2.6);
key.position.set(-6, 14, 8); key.castShadow = true;
key.shadow.mapSize.set(2048, 2048); key.shadow.radius = 6; key.shadow.bias = -0.0004; key.shadow.normalBias = 0.02;
Object.assign(key.shadow.camera, { left: -11, right: 11, top: 11, bottom: -11, near: 1, far: 50 });
scene.add(key); scene.add(key.target);

const ground = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), new THREE.ShadowMaterial({ color: 0x123F32, opacity: 0.16 }));
ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);

// ───────────────────────── materials
const M = {
  em: new THREE.MeshPhysicalMaterial({ color: 0x123F32, roughness: .36, clearcoat: .6, clearcoatRoughness: .25 }),
  em2: new THREE.MeshPhysicalMaterial({ color: 0x2D6A55, roughness: .45, clearcoat: .3 }),
  gold: new THREE.MeshStandardMaterial({ color: 0xC5A36A, metalness: .92, roughness: .26 }),
  ivory: new THREE.MeshStandardMaterial({ color: 0xF2EFE6, roughness: .55 }),
  white: new THREE.MeshStandardMaterial({ color: 0xFCFBF7, roughness: .7 }),
  sage: new THREE.MeshStandardMaterial({ color: 0xDCE7DF, roughness: .75 }),
  sage2: new THREE.MeshStandardMaterial({ color: 0xA9C4B3, roughness: .65 }),
  gray: new THREE.MeshStandardMaterial({ color: 0xDFE2DC, roughness: .6 }),
  wood: new THREE.MeshStandardMaterial({ color: 0xE4D5BC, roughness: .6 }),
  sand: new THREE.MeshStandardMaterial({ color: 0xE9DFCB, roughness: .8 }),
  glass: new THREE.MeshPhysicalMaterial({ color: 0x9DBFB1, roughness: .08, metalness: .2, clearcoat: 1, emissive: 0xF6D9A0, emissiveIntensity: 0 }),
  marble: new THREE.MeshPhysicalMaterial({ color: 0xFAF8F3, roughness: .18, clearcoat: .8 }),
};
const shade = m => { m.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return m; };
const rb = (w, h, d, r, mat, x = 0, y = 0, z = 0) => { const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 4, Math.min(r, w / 2 - .001, h / 2 - .001, d / 2 - .001)), mat); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; return m; };
const cyl = (rt, rbm, h, mat, x = 0, y = 0, z = 0, seg = 48, open = false) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rbm, h, seg, 1, open), mat); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; return m; };
const sph = (r, mat, x = 0, y = 0, z = 0) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 40, 24), mat); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; return m; };
const tor = (R, r, mat, arc = Math.PI * 2) => { const m = new THREE.Mesh(new THREE.TorusGeometry(R, r, 16, 72, arc), mat); m.castShadow = true; return m; };

// ───────────────────────── canvas text textures
function textTex(lines, { w = 1024, h = 256, size = 92, weight = 700, color = '#123F32', bg = null, lh = 1.3 } = {}) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d');
  if (bg) { g.fillStyle = bg; g.fillRect(0, 0, w, h); }
  g.direction = 'rtl'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = color; g.font = `${weight} ${size}px Plex`;
  const L = [].concat(lines); L.forEach((s, i) => g.fillText(s, w / 2, h / 2 + (i - (L.length - 1) / 2) * size * lh));
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}

// ───────────────────────── HOUSE
const house = new THREE.Group(); scene.add(house);
const housePieces = [];
function hp(mesh, delay) { mesh.userData.base = mesh.position.clone(); mesh.userData.d = delay; housePieces.push(mesh); house.add(mesh); return mesh; }
{
  hp(rb(6.6, .42, 6.6, .14, M.ivory, 0, .21, 0), 0.0);
  hp(rb(6.1, .08, 6.1, .04, M.sage, 0, .45, 0), 0.15);
  hp(rb(3.4, 2.0, 2.6, .05, M.white, -.3, 1.48, -.5), 0.3);
  hp(rb(3.86, .16, 3.06, .05, M.em, -.3, 2.56, -.5), 0.55);
  hp(rb(3.9, .035, 3.1, .012, M.gold, -.3, 2.465, -.5), 0.6);
  hp(rb(2.2, 1.35, 2.0, .05, M.white, .35, 3.315, -.75), 0.7);
  hp(rb(2.6, .15, 2.4, .05, M.em, .35, 4.06, -.75), 0.9);
  hp(rb(2.64, .03, 2.44, .01, M.gold, .35, 3.975, -.75), 0.95);
  // front (+z) windows/door main block, face z=.8
  const fz = .82;
  hp(rb(1.16, 1.06, .04, .02, M.gold, -1.15, 1.55, fz), 0.8);
  hp(rb(1.06, .96, .06, .02, M.glass, -1.15, 1.55, fz + .01), 0.82);
  hp(rb(.82, 1.42, .05, .02, M.gold, .55, 1.19, fz), 0.85);
  hp(rb(.74, 1.36, .07, .02, M.em, .55, 1.17, fz + .01), 0.87);
  hp(sph(.045, M.gold, .8, 1.2, fz + .07), 0.9);
  // side (+x) windows main, face x=1.4
  hp(rb(.04, 1.0, 1.6, .02, M.gold, 1.41, 1.55, -.5), 0.88);
  hp(rb(.06, .9, 1.5, .02, M.glass, 1.42, 1.55, -.5), 0.9);
  // upper windows
  hp(rb(1.7, .78, .04, .02, M.gold, .35, 3.3, .26), 1.0);
  hp(rb(1.6, .7, .06, .02, M.glass, .35, 3.3, .27), 1.02);
  hp(rb(.04, .7, 1.2, .02, M.gold, 1.46, 3.3, -.75), 1.04);
  hp(rb(.06, .62, 1.1, .02, M.glass, 1.47, 3.3, -.75), 1.06);
  // planters / hedges
  hp(rb(1.3, .34, .38, .16, M.em2, -1.15, .66, 1.25), 1.1);
  hp(rb(.38, .34, 1.6, .16, M.em2, 1.95, .66, -.4), 1.15);
  // path stones
  [[.6, 1.55], [.66, 2.15], [.72, 2.75]].forEach(([x, z], i) => hp(rb(.62, .06, .38, .03, M.ivory, x, .5, z), 1.2 + i * .05));
  // trees
  const tree = (x, z, s, mat, d) => { const g = new THREE.Group(); g.add(cyl(.05, .07, .7 * s, M.wood, 0, .35 * s, 0, 12)); const f = sph(.55 * s, mat, 0, .95 * s, 0); f.scale.y = 1.25; g.add(f); g.position.set(x, .49, z); shade(g); return hp(g, d); };
  tree(2.35, 2.2, 1, M.em2, 1.25); tree(-2.45, 2.1, .8, M.sage2, 1.3); tree(2.4, -2.35, 1.15, M.sage2, 1.35); tree(-2.5, -2.4, .9, M.em2, 1.4);
  // garden lamps (glow in scene 4)
  [[-.35, 2.2], [1.6, 2.6]].forEach(([x, z], i) => { const g = new THREE.Group(); g.add(cyl(.025, .025, .5, M.gold, 0, .25, 0, 10)); const b = sph(.07, new THREE.MeshStandardMaterial({ color: 0xFFF1D0, emissive: 0xF6D9A0, emissiveIntensity: 0 }), 0, .53, 0); b.name = 'bulb'; g.add(b); g.position.set(x, .49, z); hp(g, 1.45 + i * .05); });
}

// ───────────────────────── HOUSEHOLD OBJECTS
function mkBlocks() { const g = new THREE.Group(); g.add(rb(.4, .4, .4, .07, M.em, -.22, .2, 0)); g.add(rb(.4, .4, .4, .07, M.sage2, .22, .2, .05)); const t = rb(.4, .4, .4, .07, M.gold, 0, .6, 0); t.rotation.y = .5; g.add(t); return g; }
function mkBall() { const g = new THREE.Group(); g.add(sph(.36, M.ivory, 0, .36, 0)); const a = tor(.362, .035, M.em); a.position.y = .36; g.add(a); const b = tor(.362, .035, M.gold); b.position.y = .36; b.rotation.y = Math.PI / 2; g.add(b); const c = tor(.362, .03, M.sage2); c.position.y = .36; c.rotation.x = Math.PI / 2; g.add(c); return g; }
function mkCar() { const g = new THREE.Group(); g.add(rb(.9, .3, .46, .12, M.em, 0, .3, 0)); g.add(rb(.48, .26, .42, .1, M.ivory, -.05, .55, 0)); [[-.28, .24], [.28, .24], [-.28, -.24], [.28, -.24]].forEach(([x, z]) => { const w = cyl(.12, .12, .1, M.gray, x, .14, z, 24); w.rotation.x = Math.PI / 2; g.add(w); const h = cyl(.05, .05, .11, M.gold, x, .14, z, 16); h.rotation.x = Math.PI / 2; g.add(h); }); return g; }
function mkBasket() { const g = new THREE.Group(); const body = cyl(.5, .4, .56, M.sage2, 0, .28, 0, 40, true); body.material = M.sage2.clone(); body.material.side = THREE.DoubleSide; g.add(body); g.add(cyl(.4, .4, .03, M.sage2, 0, .015, 0)); const rim = tor(.5, .04, M.ivory); rim.rotation.x = Math.PI / 2; rim.position.y = .56; g.add(rim);
  const c1 = rb(.5, .14, .38, .06, M.ivory, -.05, .58, .02); c1.rotation.z = .2; g.add(c1); const c2 = rb(.46, .12, .36, .05, M.em2, .08, .64, -.05); c2.rotation.z = -.25; c2.rotation.y = .4; g.add(c2); const c3 = rb(.4, .1, .3, .04, M.gold, 0, .72, .05); c3.rotation.x = .3; g.add(c3); return g; }
function mkSpray() { const g = new THREE.Group(); g.add(cyl(.17, .19, .62, M.em, 0, .31, 0)); g.add(cyl(.175, .175, .12, M.gold, 0, .35, 0)); g.add(cyl(.07, .09, .14, M.ivory, 0, .69, 0, 24)); g.add(rb(.34, .14, .14, .05, M.ivory, .06, .8, 0)); g.add(rb(.06, .18, .08, .02, M.ivory, -.03, .68, 0)); return g; }
function mkBucket() { const g = new THREE.Group(); g.add(cyl(.36, .28, .48, M.ivory, 0, .24, 0)); const r = tor(.36, .025, M.em); r.rotation.x = Math.PI / 2; r.position.y = .48; g.add(r); const hdl = tor(.34, .018, M.gold, Math.PI); hdl.position.y = .48; g.add(hdl); const sp = rb(.36, .14, .24, .05, M.sage2, .02, .55, 0); sp.rotation.z = .15; g.add(sp); return g; }
function mkFolded() { const g = new THREE.Group(); [M.ivory, M.sage2, M.em2, M.ivory].forEach((m, i) => { const f = rb(.78, .11, .54, .05, m, (i % 2) * .03, .055 + i * .115, 0); f.rotation.y = (i - 1.5) * .05; g.add(f); }); return g; }
function mkShirt() { const s = new THREE.Shape(); s.moveTo(-.18, .42); s.lineTo(-.42, .3); s.lineTo(-.55, .02); s.lineTo(-.38, -.06); s.lineTo(-.3, .1); s.lineTo(-.3, -.45); s.lineTo(.3, -.45); s.lineTo(.3, .1); s.lineTo(.38, -.06); s.lineTo(.55, .02); s.lineTo(.42, .3); s.lineTo(.18, .42); s.quadraticCurveTo(0, .28, -.18, .42);
  const geo = new THREE.ExtrudeGeometry(s, { depth: .05, bevelEnabled: true, bevelSize: .025, bevelThickness: .025, bevelSegments: 3 }); geo.center(); const m = new THREE.Mesh(geo, M.sage2); m.castShadow = true; const g = new THREE.Group(); m.position.y = .5; g.add(m); const col = rb(.2, .06, .08, .02, M.gold, 0, .88, .04); g.add(col); return g; }
function mkChecklist() { const g = new THREE.Group(); g.add(rb(.64, .86, .06, .06, M.white, 0, .5, 0)); g.add(rb(.26, .08, .08, .03, M.gold, 0, .93, 0)); for (let i = 0; i < 3; i++) { const y = .72 - i * .2; const d = cyl(.045, .045, .03, i < 2 ? M.em : M.gray, -.2, y, .04, 20); d.rotation.x = Math.PI / 2; g.add(d); g.add(rb(.3 - i * .04, .045, .02, .02, M.gray, .06 - i * .02, y, .04)); } return g; }
function mkClock() { const g = new THREE.Group(); const face = cyl(.8, .8, .14, M.white, 0, 0, 0, 64); face.rotation.x = Math.PI / 2; g.add(face); const rim = tor(.8, .07, M.em); g.add(rim); const rim2 = tor(.7, .012, M.gold); rim2.position.z = .075; g.add(rim2);
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; const tk = rb(i % 3 ? .03 : .05, i % 3 ? .08 : .14, .02, .01, i % 3 ? M.em2 : M.gold, Math.sin(a) * .58, Math.cos(a) * .58, .08); tk.rotation.z = -a; g.add(tk); }
  const hh = new THREE.Group(); hh.add(rb(.07, .4, .03, .03, M.em, 0, .17, .1)); g.add(hh); const mh = new THREE.Group(); mh.add(rb(.05, .58, .03, .025, M.em, 0, .26, .12)); g.add(mh); const sh = new THREE.Group(); sh.add(rb(.018, .62, .02, .009, M.gold, 0, .22, .14)); g.add(sh);
  g.add(sph(.06, M.gold, 0, 0, .15)); g.userData = { hh, mh, sh }; return g; }

const builders = [mkBlocks, mkBasket, mkSpray, mkFolded, mkBall, mkChecklist, mkBucket, mkShirt, mkCar];
const NI = builders.length;
const items = [];
const badgeMat = M.white;
for (let i = 0; i < NI; i++) {
  const node = new THREE.Group(); scene.add(node);
  const obj = shade(builders[i]()); const inner = new THREE.Group(); inner.add(obj); node.add(inner);
  const badge = new THREE.Group(); const disc = cyl(.86, .86, .1, badgeMat, 0, 0, 0, 64); disc.rotation.x = Math.PI / 2; badge.add(disc); const br = tor(.86, .03, M.gold); badge.add(br); node.add(badge);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(.9, .02, 8, 64), new THREE.MeshBasicMaterial({ color: 0xC5A36A, transparent: true, opacity: 0, depthWrite: false })); node.add(ring);
  const th = i / NI * Math.PI * 2 + .35;
  const floaty = [false, false, true, false, false, true, false, true, false][i];
  items.push({ node, obj, inner, badge, ring, th, R: 4.55 + (i % 2) * .35, y0: floaty ? 1.1 + (i % 3) * .35 : .02, appear: 1.0 + i * .45,
    Ro: 4.0 + (i % 3) * .8, Yo: 1.2 + (i % 4) * .85, tilt: .12 + (i % 3) * .07, dir: 1 });
}
const clock = shade(mkClock()); scene.add(clock);

const te = t => { if (t < 11.7) return t; const u = clamp((t - 11.7) / .5); return 11.7 + .5 * (u - u * u / 2); };
function orbitPos(it, i, t) {
  const u = Math.max(0, te(t) - 6);
  const a = it.th + (.22 * u + .085 * u * u) * (i % 2 ? 1 : 1.18);
  const rad = it.Ro;
  return V(Math.cos(a) * rad, it.Yo + rad * it.tilt * Math.sin(a + i), Math.sin(a) * rad);
}
function homePos(it, i, t) { return V(Math.cos(it.th) * it.R, it.y0 + (it.y0 > .1 ? .1 * Math.sin(t * 1.8 + i) : 0), Math.sin(it.th) * it.R); }
function chaosPos(i, t) { const it = items[i]; const k = sm(t, 6, 7.7); return homePos(it, i, t).lerp(orbitPos(it, i, t), k); }

// ───────────────────────── camera path (Hermite through keyframes)
const camKeys = [
  // t, az(deg), el(deg), dist, tx, ty, tz, fov
  [0, 47, 34, 31, 0, 2.2, 0, 30],
  [5.4, 43, 33, 32.5, 0, 2.2, 0, 30],
  [7.6, 38, 30, 38.5, 0, 2.6, 0, 30],
  [11.8, 30, 29, 39.5, 0, 2.6, 0, 30],
  [12.4, 30, 29, 39.5, 0, 2.6, 0, 30],
  [16.8, 50, 27, 35, 0, 2.4, 0, 30],
  [18.2, 50, 28, 35, 0, 2.4, 0, 30],
  [21.6, 40, 36, 50, 0, 4.4, 0, 30],
  [27.9, 31, 36, 47, 0, 4.4, 0, 30],
];
const roomKeys = [
  [27.9, 50, 30, 25, -.4, 1.2, -.9, 34],
  [32, 44, 28, 22.5, -.4, 1.2, -1.1, 34],
  [36.5, 38, 26, 20.5, -.5, 1.3, -1.3, 34],
];
function herm(keys, t) {
  if (t <= keys[0][0]) return keys[0].slice(1);
  const n = keys.length; if (t >= keys[n - 1][0]) return keys[n - 1].slice(1);
  let k = 0; while (keys[k + 1][0] < t) k++;
  const a = keys[k], b = keys[k + 1], t0 = a[0], t1 = b[0], u = (t - t0) / (t1 - t0), h = t1 - t0;
  const out = [];
  for (let j = 1; j < a.length; j++) {
    const pm = k > 0 ? (b[j] - keys[k - 1][j]) / (t1 - keys[k - 1][0]) : 0;
    const pn = k + 2 < n ? (keys[k + 2][j] - a[j]) / (keys[k + 2][0] - t0) : 0;
    const m0 = (a[j] === b[j] && (k === 0 || keys[k - 1][j] === a[j])) ? 0 : pm * .6, m1 = pn * .6;
    const u2 = u * u, u3 = u2 * u;
    out.push((2 * u3 - 3 * u2 + 1) * a[j] + (u3 - 2 * u2 + u) * h * m0 + (-2 * u3 + 3 * u2) * b[j] + (u3 - u2) * h * m1);
  }
  return out;
}
function camState(t) {
  const room = t >= 28.15;
  const [az, el, d, tx, ty, tz, fov] = herm(room ? roomKeys : camKeys, t);
  const A = az * Math.PI / 180, E = el * Math.PI / 180;
  const target = V(tx, ty, tz); if (room) target.add(ROOM_OFF);
  // ribbon tracking during scene 3
  if (!room && t > 12.4 && t < 18.5) { const k = Math.sin(Math.PI * prog(t, 12.4, 18.5)); target.x += -1.2 * k * (1 - 2 * prog(t, 12.4, 18.5)); target.z += 1.2 * k * (1 - 2 * prog(t, 12.4, 18.5)); }
  const pos = target.clone().add(V(Math.sin(A) * Math.cos(E), Math.sin(E), Math.cos(A) * Math.cos(E)).multiplyScalar(d));
  return { pos, target, fov };
}
function applyCam(t) { const s = camState(t); camera.position.copy(s.pos); camera.fov = s.fov; camera.updateProjectionMatrix(); camera.lookAt(s.target); camera.updateMatrixWorld(); return s; }
const ROOM_OFF = V(0, 0, -80);

// ───────────────────────── RIBBON
class Ribbon {
  constructor(N, face, edge, parent) {
    this.N = N; this.g = new THREE.Group(); parent.add(this.g);
    const mk = mat => { const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array((N + 1) * 2 * 3), 3)); const idx = []; for (let i = 0; i < N; i++) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); } geo.setIndex(idx); const m = new THREE.Mesh(geo, mat); m.castShadow = true; m.frustumCulled = false; this.g.add(m); return m; };
    this.face = mk(face); this.edge = mk(edge); this.edge2 = mk(edge);
  }
  update(P, s0, s1, width, edgeW, sideFn, taper = .08) {
    const N = this.N, pf = this.face.geometry.attributes.position.array, pe = this.edge.geometry.attributes.position.array, pe2 = this.edge2.geometry.attributes.position.array;
    const e = 1e-3, T = V(), S = V(), Nn = V();
    for (let i = 0; i <= N; i++) {
      const u = i / N, s = lerp(s0, s1, u); const p = P(s);
      T.copy(P(Math.min(1, s + e))).sub(P(Math.max(0, s - e))).normalize();
      sideFn(s, T, p, S); Nn.crossVectors(T, S).normalize();
      const tp = Math.min(1, u / taper, (1 - u) / taper); const tpe = Math.sin(Math.PI / 2 * clamp(tp));
      const w = width * tpe / 2, ew = edgeW * tpe;
      const o = i * 6;
      pf[o] = p.x + S.x * w; pf[o + 1] = p.y + S.y * w; pf[o + 2] = p.z + S.z * w;
      pf[o + 3] = p.x - S.x * w; pf[o + 4] = p.y - S.y * w; pf[o + 5] = p.z - S.z * w;
      const off = .004;
      pe[o] = p.x + S.x * (w + ew) + Nn.x * off; pe[o + 1] = p.y + S.y * (w + ew) + Nn.y * off; pe[o + 2] = p.z + S.z * (w + ew) + Nn.z * off;
      pe[o + 3] = p.x + S.x * (w - ew * .2) + Nn.x * off; pe[o + 4] = p.y + S.y * (w - ew * .2) + Nn.y * off; pe[o + 5] = p.z + S.z * (w - ew * .2) + Nn.z * off;
      pe2[o] = pe[o] - Nn.x * off * 2; pe2[o + 1] = pe[o + 1] - Nn.y * off * 2; pe2[o + 2] = pe[o + 2] - Nn.z * off * 2;
      pe2[o + 3] = pe[o + 3] - Nn.x * off * 2; pe2[o + 4] = pe[o + 4] - Nn.y * off * 2; pe2[o + 5] = pe[o + 5] - Nn.z * off * 2;
    }
    for (const m of [this.face, this.edge, this.edge2]) { m.geometry.attributes.position.needsUpdate = true; m.geometry.computeVertexNormals(); m.geometry.computeBoundingSphere(); }
  }
  set visible(v) { this.g.visible = v; }
  get visible() { return this.g.visible; }
}
const ribMat = new THREE.MeshPhysicalMaterial({ color: 0x123F32, roughness: .32, clearcoat: .8, clearcoatRoughness: .2, side: THREE.DoubleSide, sheen: .6, sheenColor: 0x2D6A55 });
const ribGold = new THREE.MeshStandardMaterial({ color: 0xC5A36A, metalness: .9, roughness: .25, side: THREE.DoubleSide });
const rib1 = new Ribbon(360, ribMat, ribGold, scene);

// ribbon-1 path through frozen objects (built after camera function exists)
let ribCurve, ribSlotOrder = [], trig = [];
const ribHead = t => Math.sin(Math.PI / 2 * eIO(prog(t, 12.5, 16.6)) ) ;
function buildRibbonPath() {
  applyCam(12.4);
  const right = V().setFromMatrixColumn(camera.matrixWorld, 0), up = V().setFromMatrixColumn(camera.matrixWorld, 1);
  const pts = items.map((it, i) => ({ i, p: chaosPos(i, 12.4), sx: chaosPos(i, 12.4).clone().project(camera).x }));
  pts.sort((a, b) => a.sx - b.sx);
  const cps = [];
  const first = pts[0].p.clone().addScaledVector(right, -10).addScaledVector(up, -2.5);
  const last = pts[pts.length - 1].p.clone().addScaledVector(right, 7).addScaledVector(up, 2.5);
  cps.push(first, pts[0].p.clone().addScaledVector(right, -4).addScaledVector(up, -1.2));
  pts.forEach((o, k) => cps.push(o.p.clone().addScaledVector(up, (k % 2 ? 1 : -1) * .55)));
  cps.push(pts[pts.length - 1].p.clone().addScaledVector(right, 3).addScaledVector(up, 1.0), last);
  ribCurve = new THREE.CatmullRomCurve3(cps, false, 'centripetal');
  const n = cps.length - 1;
  // when head param reaches each object's control point
  const sAt = pts.map((o, k) => (k + 2) / n);
  pts.forEach((o, k) => {
    let tt = 12.5; while (tt < 17 && ribHead(tt) < sAt[k]) tt += .01; trig[o.i] = tt;
  });
  // ring slots ordered by angle
  const ang = items.map((it, i) => ({ i, a: Math.atan2(chaosPos(i, 12.4).z, chaosPos(i, 12.4).x) }));
  ang.sort((a, b) => a.a - b.a); ang.forEach((o, k) => ribSlotOrder[o.i] = k);
}
function slotPos(i, t) { const j = ribSlotOrder[i]; const a = j / NI * Math.PI * 2 + .3 + .16 * Math.max(0, t - 12.5); return V(Math.cos(a) * 4.7, 2.5 + .12 * Math.sin(t * 1.4 + j), Math.sin(a) * 4.7); }
const pathCurve = new THREE.CatmullRomCurve3([V(9, .03, 17), V(6, .03, 10), V(2.6, .03, 5.4), V(.9, .03, 3.6), V(.7, .52, 2.9), V(.62, .52, 1.3)], false, 'centripetal');

function itemPos(i, t) {
  if (t < 12.4) return chaosPos(i, t);
  const fr = chaosPos(i, 12.4); const k = eIO(prog(t, trig[i], trig[i] + 1.05));
  const p = fr.clone().lerp(slotPos(i, t), k); p.y += Math.sin(Math.PI * k) * .7; return p;
}

// trails
const trails = items.map(() => { const N = 26; const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array((N + 1) * 6), 3)); const col = new Float32Array((N + 1) * 8); geo.setAttribute('color', new THREE.BufferAttribute(col, 4)); const idx = []; for (let i = 0; i < N; i++) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); } geo.setIndex(idx); const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0xC5A36A, vertexColors: true, transparent: true, depthWrite: false, side: THREE.DoubleSide })); m.frustumCulled = false; scene.add(m); return { m, N }; });

// ───────────────────────── SERVICE + PROFILE CARDS (camera space)
const cardsG = new THREE.Group(); camera.add(cardsG);
const veil = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.MeshBasicMaterial({ color: 0xF7F7F2, transparent: true, opacity: 0, depthWrite: false })); veil.position.z = -16; cardsG.add(veil);
function mkHeartHouse() { const g = new THREE.Group(); const s = new THREE.Shape(); s.moveTo(0, -.3); s.bezierCurveTo(-.05, -.24, -.38, -.02, -.34, .14); s.bezierCurveTo(-.3, .3, -.08, .32, 0, .18); s.bezierCurveTo(.08, .32, .3, .3, .34, .14); s.bezierCurveTo(.38, -.02, .05, -.24, 0, -.3);
  const geo = new THREE.ExtrudeGeometry(s, { depth: .1, bevelEnabled: true, bevelSize: .03, bevelThickness: .03, bevelSegments: 4 }); geo.center(); const h = new THREE.Mesh(geo, M.em); h.position.y = -.05; g.add(h);
  const l = rb(.5, .06, .06, .03, M.gold, -.2, .42, 0); l.rotation.z = .62; g.add(l); const r = rb(.5, .06, .06, .03, M.gold, .2, .42, 0); r.rotation.z = -.62; g.add(r); return g; }
const services = [['تنظيف المنزل', mkSpray, .7], ['ترتيب المنزل', mkFolded, .62], ['المساعدة المنزلية', mkHeartHouse, .9]];
const cards = services.map(([label, fn, sc], k) => {
  const g = new THREE.Group();
  g.add(rb(1.78, 2.28, .08, .16, M.gold, 0, 0, -.03));
  g.add(rb(1.72, 2.22, .12, .14, M.white));
  const disc = cyl(.52, .52, .05, M.sage, 0, .32, .08, 64); disc.rotation.x = Math.PI / 2; g.add(disc);
  const dr = tor(.52, .018, M.gold); dr.position.set(0, .32, .1); g.add(dr);
  const ic = shade(fn()); ic.scale.setScalar(sc); const icw = new THREE.Group(); icw.add(ic); icw.position.set(0, fn === mkHeartHouse ? .32 : .02, .32); if (fn !== mkHeartHouse) ic.position.y = 0; g.add(icw); g.userData.ic = icw;
  const lab = new THREE.Mesh(new THREE.PlaneGeometry(1.6, .4), new THREE.MeshBasicMaterial({ map: null, transparent: true, toneMapped: false })); lab.position.set(0, -.6, .065); g.add(lab); g.userData.lab = lab; g.userData.label = label;
  const bar = rb(.36, .03, .02, .01, M.gold, 0, -.86, .065); g.add(bar);
  cardsG.add(g); g.visible = false; return g;
});
// profile card (abstract — no personal data, no face)
const prof = new THREE.Group(); cardsG.add(prof); prof.visible = false;
{
  prof.add(rb(3.76, 1.86, .08, .2, M.gold, 0, 0, -.03));
  prof.add(rb(3.7, 1.8, .12, .18, M.white));
  const av = cyl(.6, .6, .05, M.sage, 1.05, .05, .08, 64); av.rotation.x = Math.PI / 2; prof.add(av);
  const avr = tor(.6, .02, M.gold); avr.position.set(1.05, .05, .1); prof.add(avr);
  const head = sph(.19, M.em2, 1.05, .2, .2); head.scale.z = .5; prof.add(head);
  const body = new THREE.Mesh(new THREE.SphereGeometry(.34, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2), M.em2); body.position.set(1.05, -.4, .14); body.scale.set(1, .85, .35); prof.add(body);
  // clip avatar bottom with a mask-ish ring: simple: small white bar to hide overflow below disc
  const pill = rb(1.5, .3, .04, .15, M.em, -.55, .48, .08); prof.add(pill);
  const pl = new THREE.Mesh(new THREE.PlaneGeometry(1.4, .28), new THREE.MeshBasicMaterial({ transparent: true, toneMapped: false })); pl.position.set(-.55, .48, .105); prof.add(pl); prof.userData.pl = pl;
  [[1.9, .06], [1.5, -.2], [1.75, -.46]].forEach(([w, y], i) => prof.add(rb(w, .07, .02, .035, i ? M.gray : M.sage2, -.45 + (1.9 - w) / 2, y, .07)));
  const dots = [0, 1, 2].map(i => { const d = cyl(.05, .05, .02, M.gold, -1.3 + i * .16, -.7, .07, 16); d.rotation.x = Math.PI / 2; prof.add(d); });
}

// ───────────────────────── ROOM (scene 5)
const room = new THREE.Group(); room.position.copy(ROOM_OFF); scene.add(room); room.visible = false;
const roomPieces = [];
function rp(m, d) { m.userData.base = m.position.clone(); m.userData.d = d; roomPieces.push(m); room.add(m); return m; }
const sunMats = [];
{
  const wallM = new THREE.MeshStandardMaterial({ color: 0xF5F2EA, roughness: .9 });
  const floorM = new THREE.MeshStandardMaterial({ color: 0xE6D9C2, roughness: .55 });
  rp(rb(8.4, .3, 8.4, .08, floorM, 0, -.15, 0), 0);
  // back wall (z=-4.1)
  rp(rb(8.4, 4.6, .25, .04, wallM, 0, 2.3, -4.1), .05);
  // left wall with window opening (x=-4.1) opening z∈[-2.8,.8], y∈[.9,3.5]
  rp(rb(.25, .9, 8.4, .04, wallM, -4.1, .45, 0), .08);
  rp(rb(.25, 1.1, 8.4, .04, wallM, -4.1, 4.05, 0), .1);
  rp(rb(.25, 2.6, 1.3, .02, wallM, -4.1, 2.2, -3.45), .1);
  rp(rb(.25, 2.6, 3.4, .02, wallM, -4.1, 2.2, 2.5), .1);
  // window frame (gold) + mullions
  const fr = (w, h, d, x, y, z) => rp(rb(w, h, d, .01, M.gold, x, y, z), .2);
  fr(.08, 2.6, .06, -4.0, 2.2, -2.8); fr(.08, 2.6, .06, -4.0, 2.2, .8); fr(.08, .06, 3.6, -4.0, .9, -1.0); fr(.08, .06, 3.6, -4.0, 3.5, -1.0); fr(.06, 2.6, .04, -4.0, 2.2, -1.0); fr(.06, .04, 3.6, -4.0, 2.2, -1.0);
  // baseboard
  rp(rb(8.4, .12, .05, .02, M.em, 0, .06, -3.96), .15);
  // rug
  rp(rb(4.5, .03, 3.2, .02, new THREE.MeshStandardMaterial({ color: 0xD7C7A4, roughness: .95 }), .3, .015, -1.2), .3);
  rp(rb(4.3, .035, 3.0, .02, new THREE.MeshStandardMaterial({ color: 0xDCE7DF, roughness: .95 }), .3, .02, -1.2), .32);
  // sofa
  const so = new THREE.Group(); so.position.set(.4, 0, -3.15);
  so.add(rb(3.5, .42, 1.15, .12, M.em, 0, .36, 0)); so.add(rb(3.5, .8, .32, .14, M.em, 0, .92, -.42)); so.add(rb(.32, .66, 1.15, .14, M.em, -1.75, .6, 0)); so.add(rb(.32, .66, 1.15, .14, M.em, 1.75, .6, 0));
  so.add(rb(1.58, .18, .92, .08, M.em2, -.8, .65, .08)); so.add(rb(1.58, .18, .92, .08, M.em2, .8, .65, .08));
  const p1 = rb(.62, .55, .16, .14, M.ivory, -1.1, 1.0, -.22); p1.rotation.z = .12; p1.rotation.x = -.15; so.add(p1);
  const p2 = rb(.56, .5, .16, .14, M.gold, -.45, .98, -.2); p2.material = new THREE.MeshStandardMaterial({ color: 0xD9BE8C, roughness: .7 }); p2.rotation.z = -.08; p2.rotation.x = -.15; so.add(p2);
  const p3 = rb(.62, .55, .16, .14, M.ivory, 1.1, 1.0, -.22); p3.rotation.z = -.12; p3.rotation.x = -.15; so.add(p3);
  so.add(rb(.9, .07, .7, .03, M.sage2, 1.45, .97, .1));
  [[-1.6, .45], [1.6, .45], [-1.6, -.45], [1.6, -.45]].forEach(([x, z]) => so.add(cyl(.04, .03, .16, M.gold, x, .08, z, 12)));
  rp(shade(so), .4);
  // coffee table
  const ct = new THREE.Group(); ct.position.set(.35, 0, -1.15);
  ct.add(cyl(.95, .95, .07, M.marble, 0, .5, 0, 72)); ct.add(cyl(.08, .14, .46, M.gold, 0, .23, 0, 24)); ct.add(cyl(.45, .5, .04, M.gold, 0, .02, 0, 48));
  ct.add(rb(.7, .03, .44, .02, M.gold, -.25, .55, .1)); const vase = cyl(.1, .14, .36, M.em, .35, .72, -.15, 32); ct.add(vase);
  for (let i = 0; i < 3; i++) { const st = cyl(.008, .008, .5, M.em2, .35 + (i - 1) * .05, 1.1, -.15, 6); st.rotation.z = (i - 1) * .25; ct.add(st); ct.add(sph(.05, M.ivory, .35 + (i - 1) * .12, 1.36, -.15)); }
  ct.add(rb(.5, .06, .36, .02, M.ivory, -.25, .6, .1)); ct.add(rb(.44, .05, .32, .02, M.sage2, -.25, .655, .1));
  rp(shade(ct), .5);
  // floor lamp
  const fl = new THREE.Group(); fl.position.set(2.85, 0, -3.3); fl.add(cyl(.22, .26, .05, M.gold, 0, .025, 0)); fl.add(cyl(.02, .02, 2.2, M.gold, 0, 1.1, 0, 12));
  const shadeM = new THREE.MeshStandardMaterial({ color: 0xFBF6EA, roughness: .8, emissive: 0xF8E2B5, emissiveIntensity: .25 }); fl.add(cyl(.26, .38, .45, shadeM, 0, 2.25, 0)); rp(shade(fl), .55);
  // plant
  const pl = new THREE.Group(); pl.position.set(-2.75, 0, -3.25); pl.add(cyl(.34, .26, .62, M.ivory, 0, .31, 0)); pl.add(cyl(.345, .345, .05, M.gold, 0, .58, 0));
  for (let i = 0; i < 9; i++) { const a = i * 2.4; const lf = sph(.22, i % 2 ? M.em : M.em2, Math.cos(a) * .3, .95 + i * .13, Math.sin(a) * .3); lf.scale.set(.6, 1.35, .25); lf.rotation.set(Math.sin(a) * .5, a, Math.cos(a) * .6); pl.add(lf); }
  rp(shade(pl), .6);
  // wall art
  rp(rb(1.9, 1.2, .05, .02, M.gold, .4, 2.55, -3.95), .65);
  const art = rb(1.78, 1.08, .06, .02, new THREE.MeshStandardMaterial({ color: 0xE5EDE7, roughness: .9 }), .4, 2.55, -3.93); rp(art, .66);
  const arch = cyl(.3, .3, .02, M.em, .25, 2.5, -3.89, 48); arch.rotation.x = Math.PI / 2; rp(arch, .7);
  const arc2 = tor(.42, .015, M.gold, Math.PI); arc2.position.set(.62, 2.4, -3.89); rp(arc2, .72);
  // shelf
  rp(rb(1.5, .06, .36, .02, M.white, 2.6, 2.35, -3.8), .7);
  [[2.05, .38, M.em], [2.17, .34, M.sage2], [2.28, .4, M.ivory]].forEach(([x, h, m], i) => rp(rb(.1, h, .28, .015, m, x, 2.38 + h / 2, -3.8), .75 + i * .02));
  rp(cyl(.09, .11, .3, M.gold, 2.95, 2.53, -3.8, 32), .8); rp(sph(.12, M.ivory, 3.2, 2.5, -3.8), .82);
  // armchair by window
  const ac = new THREE.Group(); ac.position.set(-2.7, 0, -.4); ac.rotation.y = Math.PI / 2 - .35;
  ac.add(rb(1.1, .4, 1.0, .14, M.ivory, 0, .36, 0)); ac.add(rb(1.1, .7, .26, .13, M.ivory, 0, .85, -.4)); ac.add(rb(.22, .5, 1.0, .1, M.ivory, -.56, .55, 0)); ac.add(rb(.22, .5, 1.0, .1, M.ivory, .56, .55, 0)); ac.add(rb(.8, .14, .78, .07, M.sage, 0, .62, .05));
  [[-.45, .4], [.45, .4], [-.45, -.4], [.45, -.4]].forEach(([x, z]) => ac.add(cyl(.035, .025, .16, M.gold, x, .08, z, 12)));
  rp(shade(ac), .85);
  // side table w/ cup
  const st = new THREE.Group(); st.position.set(-2.55, 0, .75); st.add(cyl(.32, .32, .04, M.marble, 0, .6, 0)); st.add(cyl(.025, .025, .58, M.gold, 0, .3, 0, 12)); st.add(cyl(.2, .2, .03, M.gold, 0, .015, 0)); st.add(cyl(.07, .06, .14, M.ivory, .05, .69, 0, 24)); rp(shade(st), .9);
}
// motes
const motes = new THREE.InstancedMesh(new THREE.SphereGeometry(.018, 8, 6), new THREE.MeshBasicMaterial({ color: 0xFFF3D6, transparent: true, opacity: .8, toneMapped: false }), 90); room.add(motes);
const moteSeed = Array.from({ length: 90 }, () => [rnd(), rnd(), rnd(), rnd()]);
const sun = new THREE.DirectionalLight(0xFFE9C4, 0); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.radius = 4; sun.shadow.bias = -.0005; sun.shadow.normalBias = .02;
Object.assign(sun.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7, near: 1, far: 60 });
sun.position.copy(ROOM_OFF).add(V(-16, 9.5, 3.2)); sun.target.position.copy(ROOM_OFF).add(V(0, 0, -1)); scene.add(sun); scene.add(sun.target);

// ───────────────────────── END RIBBON + backdrop (camera space)
const endG = new THREE.Group(); camera.add(endG);
const backdrop = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshBasicMaterial({ color: 0xF7F7F2, transparent: true, opacity: 0, depthTest: false, depthWrite: false, toneMapped: false })); backdrop.position.z = -14; backdrop.renderOrder = 900; endG.add(backdrop);
const ribMat2 = ribMat.clone(); ribMat2.depthTest = false; ribMat2.transparent = true; const ribGold2 = ribGold.clone(); ribGold2.depthTest = false; ribGold2.transparent = true;
const rib2 = new Ribbon(600, ribMat2, ribGold2, endG); rib2.g.renderOrder = 1000; [rib2.face, rib2.edge, rib2.edge2].forEach((m, i) => { m.renderOrder = 1000 + i; m.castShadow = false; });
const endLight = new THREE.DirectionalLight(0xFFFFFF, 1.6); endLight.position.set(-2, 3, 4); endG.add(endLight); endG.add(endLight.target); endLight.target.position.set(0, 0, -10);
// camera space at z=-10: visible half-height = 10*tan(15deg)
const HH = 10 * Math.tan(15 * Math.PI / 180), HW = HH * W / H;
const px = v => v / (H / 2) * HH; // pixel → units
function resample(pts, n) { const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + pts[i].distanceTo(pts[i - 1])); const tot = L[L.length - 1]; const out = []; let k = 0; for (let j = 0; j <= n; j++) { const d = j / n * tot; while (k < pts.length - 2 && L[k + 1] < d) k++; const u = (d - L[k]) / (L[k + 1] - L[k] || 1); out.push(pts[k].clone().lerp(pts[k + 1], u)); } return out; }
const NS = 800;
const sweepPts = resample(new THREE.CatmullRomCurve3([V(-HW - 1.2, -HH - .5, -10), V(-HW * .55, -HH * .35, -10), V(HW * .2, -HH * .05, -10), V(-HW * .1, HH * .35, -10), V(HW * .6, HH * .55, -10), V(HW + 1.5, HH + .6, -10)], false, 'centripetal').getPoints(400), NS);
const frameRaw = (() => {
  const x0 = HW - px(62), yb = -HH + px(95), ys = HH - px(330), ry = px(250), r = px(40); const p = [];
  const seg = (a, b, n) => { for (let i = 0; i < n; i++) p.push(a.clone().lerp(b, i / n)); };
  seg(V(0, yb, -10), V(x0 - r, yb, -10), 40);
  for (let i = 0; i < 20; i++) { const a = -Math.PI / 2 + i / 20 * Math.PI / 2; p.push(V(x0 - r + Math.cos(a) * r, yb + r + Math.sin(a) * r, -10)); }
  seg(V(x0, yb + r, -10), V(x0, ys, -10), 80);
  for (let i = 0; i <= 120; i++) { const a = i / 120 * Math.PI; p.push(V(Math.cos(a) * x0, ys + Math.sin(a) * ry, -10)); }
  seg(V(-x0, ys, -10), V(-x0, yb + r, -10), 80);
  for (let i = 0; i < 20; i++) { const a = Math.PI + i / 20 * Math.PI / 2; p.push(V(-x0 + r + Math.cos(a) * r, yb + r + Math.sin(a) * r, -10)); }
  seg(V(-x0 + r, yb, -10), V(0, yb, -10), 41);
  return p;
})();
const framePts = resample(frameRaw, NS);
const sampleArr = (arr, s) => { const f = clamp(s) * NS, i = Math.min(NS - 1, Math.floor(f)), u = f - i; return arr[i].clone().lerp(arr[i + 1], u); };

// ───────────────────────── DOM
const $ = id => document.getElementById(id);
function splitWords(el) { const walk = n => { [...n.childNodes].forEach(c => { if (c.nodeType === 3) { const parts = c.textContent.split(/(\s+)/); const frag = document.createDocumentFragment(); parts.forEach(p => { if (/^\s+$/.test(p) || !p) frag.append(p); else { const s = document.createElement('span'); s.className = 'w'; s.textContent = p; frag.append(s); } }); c.replaceWith(frag); } }); }; walk(el); return [...el.querySelectorAll('.w')]; }
const H_ = {}; ['h1', 'h2', 'h3', 'h4', 's4'].forEach(id => H_[id] = splitWords($(id)));
function kinetic(id, tin, tout, t, stag = .09) {
  const el = $(id), ws = H_[id]; const out = prog(t, tout, tout + .55);
  el.style.opacity = t < tin - .1 || out >= 1 ? 0 : 1;
  ws.forEach((w, i) => { const p = eOutQ(prog(t, tin + i * stag, tin + i * stag + .75)); w.style.opacity = p * (1 - eIO(out)); w.style.transform = `translateY(${(1 - p) * 38 - eIO(out) * 26}px)`; w.style.filter = `blur(${(1 - p) * 10 + eIO(out) * 6}px)`; });
}
function rule(id, tin, tout, t) { const p = eOutQ(prog(t, tin, tin + .9)), o = eIO(prog(t, tout, tout + .5)); $(id).style.transform = `scaleX(${p * (1 - o)})`; }
function fadeEl(id, tin, t, dy = 30, dur = .8, tout = 99) { const p = eOutQ(prog(t, tin, tin + dur)); const o = eIO(prog(t, tout, tout + .5)); const el = $(id); el.style.opacity = p * (1 - o); el.style.transform = `translateY(${(1 - p) * dy - o * 20}px)`; el.style.filter = `blur(${(1 - p) * 8}px)`; }

// ───────────────────────── clock speed integral
function clockAngle(t) { let a = 0; const dt = 1 / 120; for (let x = 0; x < t; x += dt) { let w; if (x < 5.6) w = 1 + x * .9; else if (x < 6.4) w = lerp(6.0, -6.0, eIO((x - 5.6) / .8)); else if (x < 11.7) w = -(6 + (x - 6.4) * 1.3); else if (x < 12.2) w = lerp(-12.9, 0, eOut((x - 11.7) / .5)); else if (x < 13.4) w = 0; else w = lerp(0, .5, eIO(prog(x, 13.4, 15))); a += w * dt; } return a; }

// ───────────────────────── frame update
const tmpQ = new THREE.Quaternion(), idQ = new THREE.Quaternion();
let built = false;
function renderAt(t) {
  if (!built) { buildRibbonPath(); built = true; }
  const cs = applyCam(t);
  const inRoom = t >= 28.15 && t < 37.2;
  const houseOn = t < 28.15;

  // light rig
  key.intensity = houseOn ? 2.6 : (t < 37.2 ? 0 : 0); hemi.intensity = houseOn ? 1.1 : 0.85;
  sun.intensity = inRoom ? 3.4 : 0; scene.environmentIntensity = inRoom ? .45 : .55;
  key.target.position.set(0, 0, 0); key.position.set(-6, 14, 8);

  // HOUSE
  house.visible = houseOn;
  for (const m of housePieces) { const k = prog(t, m.userData.d * .9 + .1, m.userData.d * .9 + .85); const e = eOut(k); m.visible = k > 0; m.position.y = m.userData.base.y + (1 - e) * 3; m.scale.setScalar(.001 + eBack(k) * .999); }
  const glow = sm(t, 18.6, 20.5);
  M.glass.emissiveIntensity = glow * .55;
  house.traverse(o => { if (o.name === 'bulb') o.material.emissiveIntensity = glow * 1.4; });
  house.rotation.y = t > 18 ? -.25 * sm(t, 19, 27.9) : 0;

  // ITEMS
  for (let i = 0; i < NI; i++) {
    const it = items[i];
    const ap = prog(t, it.appear, it.appear + .7);
    const shrink = 1 - eIO(prog(t, 18.5 + i * .07, 19.4 + i * .07));
    it.node.visible = ap > 0 && shrink > 0 && houseOn;
    if (!it.node.visible) continue;
    const p = itemPos(i, t); if (ap < 1) p.y += (1 - eOut(ap)) * 2.2;
    it.node.position.copy(p);
    const bk = eBack(prog(t, 6.3 + i * .06, 7.3 + i * .06));
    tmpQ.copy(camera.quaternion); it.node.quaternion.copy(idQ).slerp(tmpQ, eIO(prog(t, 6.2, 7.4)));
    it.badge.scale.setScalar(Math.max(.001, bk));
    it.badge.visible = bk > .001;
    const sScale = lerp(1, .95, eIO(prog(t, 6.3, 7.4)));
    it.inner.scale.setScalar(Math.max(.001, eBack(ap) * sScale * shrink));
    it.badge.scale.multiplyScalar(shrink);
    it.inner.position.set(0, -.38 * eIO(prog(t, 6.3, 7.4)), .25 * eIO(prog(t, 6.3, 7.4)));
    it.inner.rotation.y = .4 * Math.sin(t * .9 + i) + (te(t) > 6 ? .6 * Math.sin(te(t) * 1.7 + i) * (1 - prog(t, 12.4, 14)) : 0);
    // settle sparkle
    const sp = prog(t, trig[i] + .9, trig[i] + 1.7);
    it.ring.material.opacity = sp > 0 && sp < 1 ? (1 - sp) * .9 : 0; it.ring.scale.setScalar(.85 + sp * .7);
  }
  // trails
  const ta = sm(t, 6.8, 7.8) * (1 - prog(t, 11.9, 12.4));
  trails.forEach((tr, i) => {
    tr.m.visible = ta > 0 && houseOn; if (!tr.m.visible) return;
    const pa = tr.m.geometry.attributes.position.array, ca = tr.m.geometry.attributes.color.array; const toCam = V();
    for (let k = 0; k <= tr.N; k++) {
      const tk = t - k * .035; const p = chaosPos(i, tk), p2 = chaosPos(i, tk - .01); const T = p.clone().sub(p2).normalize();
      toCam.copy(camera.position).sub(p).normalize(); const S = V().crossVectors(T, toCam).normalize(); const w = .07 * (1 - k / tr.N);
      // offset behind badge
      p.addScaledVector(toCam, -.3);
      pa.set([p.x + S.x * w, p.y + S.y * w, p.z + S.z * w, p.x - S.x * w, p.y - S.y * w, p.z - S.z * w], k * 6);
      const al = ta * Math.pow(1 - k / tr.N, 1.6) * .85; ca.set([1, 1, 1, al, 1, 1, 1, al], k * 8);
    }
    tr.m.geometry.attributes.position.needsUpdate = true; tr.m.geometry.attributes.color.needsUpdate = true;
  });

  // CLOCK
  const ca = clockAngle(t);
  clock.visible = houseOn && t > .6 && t < 19.2;
  if (clock.visible) {
    const cp = eBack(prog(t, .6, 1.5)), cOut = 1 - eIO(prog(t, 18.2, 19.1));
    const c1 = V(-2.4, 5.2, -2.4), c2 = V(-3.0, 5.7, -3.0), c3 = V(0, 5.9, 0);
    const p = c1.clone().lerp(c2, sm(t, 6, 8)).lerp(c3, sm(t, 13.5, 16.5)); p.y += .12 * Math.sin(t * 1.6);
    clock.position.copy(p); clock.quaternion.copy(camera.quaternion); clock.scale.setScalar(Math.max(.001, cp * cOut * 1.15));
    clock.userData.mh.rotation.z = -ca; clock.userData.hh.rotation.z = -ca / 12 - .8; clock.userData.sh.rotation.z = -ca * 4;
  }

  // RIBBON 1
  rib1.visible = houseOn && t > 12.5;
  if (rib1.visible) {
    const m = sm(t, 18.0, 19.9);
    const head = ribHead(t);
    const P = s => { const a = ribCurve.getPoint(clamp(s)); if (m <= 0) return a; return a.lerp(pathCurve.getPoint(clamp(s)), m); };
    const toCam = V(), side0 = V(), side1 = V(), n = V();
    const sideFn = (s, T, p, S) => {
      toCam.copy(camera.position).sub(p).normalize(); side0.crossVectors(T, toCam).normalize(); n.crossVectors(T, side0).normalize();
      const th = (.9 * Math.sin(s * 11 + t * 1.3)) * (1 - m); side0.multiplyScalar(Math.cos(th)).addScaledVector(n, Math.sin(th));
      side1.crossVectors(T, V(0, 1, 0)).normalize();
      S.copy(side0).lerp(side1, m).normalize();
    };
    rib1.update(P, 0, Math.max(.002, head), lerp(.62, .9, m), lerp(.06, .085, m), sideFn, lerp(.06, .03, m));
  }

  // CARDS (scene 4)
  const cardsOn = t > 19.2 && t < 28.3;
  cardsG.visible = cardsOn;
  veil.material.opacity = .6 * sm(t, 19.2, 20.6) * (1 - prog(t, 27.4, 28.0));
  if (cardsOn) {
    const sc = .58, z = -12, rowY = -1.12;
    const fly = eIn(prog(t, 27.2, 28.1));
    cards.forEach((c, k) => {
      if (!c.userData.lab.material.map) { c.userData.lab.material.map = textTex(c.userData.label, { w: 1024, h: 256, size: 118, weight: 700 }); c.userData.lab.material.needsUpdate = true; }
      const d = 19.6 + k * .22; const p = prog(t, d, d + 1.0);
      c.visible = p > 0;
      const x = (1 - k) * 1.04;
      c.position.set(x * (1 + fly * .8), rowY - (1 - eOutQ(p)) * 1.6 + .04 * Math.sin(t * 1.3 + k) + fly * (k - 1) * .2, z + fly * 6);
      c.scale.setScalar(sc * Math.max(.001, eBack(p)));
      c.rotation.set(-.08 + (1 - eOut(p)) * -.6 + .03 * Math.sin(t + k), (1 - k) * -.14 + .05 * Math.sin(t * .8 + k), 0);
      c.userData.ic.rotation.y = .5 * Math.sin(t * 1.1 + k * 1.3);
    });
    if (!prof.userData.pl.material.map) { prof.userData.pl.material.map = textTex('عمالة منزلية', { w: 1024, h: 205, size: 120, weight: 600, color: '#FFFFFF' }); prof.userData.pl.material.needsUpdate = true; }
    const pp = prog(t, 21.9, 23.0); prof.visible = pp > 0;
    prof.position.set(0, .3 - (1 - eOutQ(pp)) * .8 + .05 * Math.sin(t * 1.1), -12 + fly * 7);
    prof.scale.setScalar(.6 * Math.max(.001, eBack(pp)) * (1 + fly * .4));
    prof.rotation.set(-.05 + (1 - eOut(pp)) * .5, .1 * Math.sin(t * .6), 0);
  }

  // ROOM
  room.visible = inRoom;
  if (inRoom) {
    for (const m of roomPieces) { const k = prog(t, 28.0 + m.userData.d * 1.25, 28.0 + m.userData.d * 1.25 + .8); m.visible = k > 0; m.position.y = m.userData.base.y + (1 - eOutQ(k)) * 2.2; m.scale.setScalar(.001 + eOut(k) * .999); }
    const mm = new THREE.Matrix4(); const mo = sm(t, 29.5, 31);
    moteSeed.forEach(([a, b, c, d], i) => { const x = -3.8 + a * 3.4 + .2 * Math.sin(t * .3 + d * 9); const y = .3 + b * 3.2 + .25 * Math.sin(t * .25 + c * 7); const z = -2.8 + c * 3.4 + .2 * Math.cos(t * .27 + a * 5); const s = mo * (.6 + d * .8); mm.makeScale(s, s, s).setPosition(x, y, z); motes.setMatrixAt(i, mm); });
    motes.instanceMatrix.needsUpdate = true;
  }

  // END: ribbon 2 + backdrop
  const endOn = t > 35.3;
  endG.visible = endOn;
  backdrop.material.opacity = eIO(prog(t, 36.1, 36.9));
  if (endOn) {
    const head = eIO(prog(t, 35.3, 36.7));
    const m = eIO(prog(t, 36.5, 38.1));
    const s0 = lerp(Math.max(0, head - .7), 0, m), s1 = lerp(head, 1, m);
    const zv = V(0, 0, 1);
    const P = s => { const a = sampleArr(sweepPts, s); return m > 0 ? a.lerp(sampleArr(framePts, s), m) : a; };
    const sideFn = (s, T, p, S) => { S.crossVectors(T, zv).normalize(); const th = .9 * Math.sin(s * 8 + t * 2) * (1 - m); const n = V().crossVectors(T, S); S.multiplyScalar(Math.cos(th)).addScaledVector(n, Math.sin(th)).normalize(); };
    rib2.update(P, s0, Math.max(s0 + .002, s1), lerp(px(70), px(20), m), lerp(px(7), px(5), m), sideFn, lerp(.07, .012, m));
  }

  // ───── DOM
  kinetic('h1', .9, 5.5, t); rule('r1', 1.4, 5.5, t);
  kinetic('h2', 6.6, 11.6, t); rule('r2', 7.2, 11.6, t);
  kinetic('h3', 13.0, 17.5, t, .16); rule('r3', 13.5, 17.5, t);
  kinetic('h4', 19.9, 27.0, t, .12); rule('r4', 20.5, 27.0, t); kinetic('s4', 20.9, 27.0, t, .07);
  fadeEl('p1', 31.8, t, 34, .9, 35.4); fadeEl('p2', 33.4, t, 34, .9, 35.5); fadeEl('p3', 34.5, t, 34, .9, 35.6);
  const fl = eIO(prog(t, 27.6, 28.1)) * (1 - eIO(prog(t, 28.25, 29.0)));
  $('flash').style.opacity = fl;
  // end card
  fadeEl('logo', 37.7, t, 0, 1.2); $('logo').style.transform += ` scale(${lerp(.94, 1, eOutQ(prog(t, 37.7, 39)))})`;
  $('gl1').style.transform = `scaleX(${eOutQ(prog(t, 38.3, 39.3))})`; $('gl1').style.opacity = prog(t, 38.3, 38.5);
  fadeEl('slogan', 38.5, t, 30, .9);
  fadeEl('brand', 39.5, t, 24, .8);
  fadeEl('support', 40.0, t, 20, .8); $('support').querySelectorAll('span').forEach(s => s.style.transform = `scaleX(${eOutQ(prog(t, 40.2, 41.0))})`);
  const cardP = eOutQ(prog(t, 40.4, 41.2)); $('card').style.opacity = cardP; $('card').style.transform = `translateY(${(1 - cardP) * 30}px) scale(${lerp(.97, 1, cardP)})`;
  fadeEl('c1', 40.6, t, 22, .7); fadeEl('c2', 40.85, t, 22, .7); fadeEl('c3', 41.1, t, 22, .7); fadeEl('c4', 41.35, t, 22, .7);

  renderer.render(scene, camera);
}

window.renderAt = renderAt;
document.fonts.load('700 60px Plex', 'عربي').then(() => Promise.all(['400', '500', '600', '700'].flatMap(w => [document.fonts.load(`${w} 40px Plex`, 'عربي'), document.fonts.load(`${w} 40px Plex`, 'abc123')]))).then(() => {
  const q = new URLSearchParams(location.search); const t0 = parseFloat(q.get('t') || '0');
  renderAt(t0); window.READY = true;
  if (q.has('play')) { const st = performance.now() - t0 * 1000; const loop = () => { const t = (performance.now() - st) / 1000 % 45; renderAt(t); requestAnimationFrame(loop); }; loop(); }
});
