// SAWAHEL — illustration library: locked character designs + environments
const C = {
  green: '#164B3A', green2: '#1F5C48', green3: '#2C6B55', olive: '#55775B', olive2: '#7C9A80', olive3: '#B5C7B4', sage: '#DCE6DA',
  gold: '#C5A059', gold2: '#D8BA7E', gold3: '#EAD9B2', goldD: '#9C7A3A',
  ivory: '#F7F4EA', beige: '#E9DFC9', beige2: '#DDD0B4', beige3: '#CBB894', beige4: '#B49F78', wood: '#A88A62', wood2: '#8C7150',
  white: '#FFFFFF', char: '#302E2B', char2: '#4A4540', shade: '#E7E1D4', line: '#DCD5C6'
};
const r1 = (n) => Math.round(n * 10) / 10;

/* ---------------- LOCKED CHARACTER SPEC ----------------
   CUSTOMER  : skin #B98762, short dark hair, short full beard, white dishdasha,
               white kumma with olive embroidery, gold furakha tassel.
   EMPLOYEE  : skin #C89C76, thin glasses, mustache + trimmed goatee, white dishdasha,
               white kumma with deep-green/gold embroidery, green furakha, green lanyard + ID badge.
   WORKER    : warm light-medium skin #D9AA82, neat dark hair, modest collared blouse.        */
const ROLE = {
  customer: { skin: '#B98762', skin2: '#A0724F', hair: '#2A221E', acc: C.olive, acc2: C.olive2, tassel: C.gold, beard: 'full', glasses: false, badge: false },
  employee: { skin: '#C89C76', skin2: '#AE8160', hair: '#231C18', acc: C.green, acc2: C.gold, tassel: C.green, beard: 'goatee', glasses: true, badge: true }
};

function kumma(hc, R, fx = 0, side = false) {
  const k = fx * 0.5;
  let s = '';
  if (!side) {
    s += `<path d="M-21 ${hc - 9} Q -23 ${hc - 35} ${k} ${hc - 37} Q 23 ${hc - 35} 21 ${hc - 9} Q 0 ${hc - 14} -21 ${hc - 9} Z" fill="#FFFFFF"/>`;
    s += `<path d="M${k + 6} ${hc - 37} Q 23 ${hc - 35} 21 ${hc - 9} Q 14 ${hc - 11} 10 ${hc - 12} Q 16 ${hc - 26} ${k + 6} ${hc - 37} Z" fill="#000" opacity="0.06"/>`;
    s += `<path d="M-21 ${hc - 9} Q 0 ${hc - 14} 21 ${hc - 9} L 21 ${hc - 13} Q 0 ${hc - 18} -21 ${hc - 13} Z" fill="${R.acc}"/>`;
    for (let i = -3; i <= 3; i++) {
      const x = i * 5.6 + k * 0.6;
      s += `<path d="M${r1(x)} ${hc - 24} l 2.6 -3.2 l 2.6 3.2 l -2.6 3.2 Z" fill="${R.acc}" opacity="0.9"/>`;
      s += `<circle cx="${r1(x + 2.6)}" cy="${hc - 18}" r="1.3" fill="${R.acc2}"/>`;
    }
    s += `<path d="M${-16 + k} ${hc - 31} Q ${k} ${hc - 35} ${16 + k} ${hc - 31}" stroke="${R.acc}" stroke-width="1.6" fill="none" stroke-dasharray="2.5 2"/>`;
    s += `<circle cx="${k}" cy="${hc - 35}" r="2.2" fill="${R.acc2}"/>`;
  } else {
    s += `<path d="M-17 ${hc - 9} Q -20 ${hc - 34} 4 ${hc - 37} Q 25 ${hc - 34} 23 ${hc - 11} Q 3 ${hc - 15} -17 ${hc - 9} Z" fill="#FFFFFF"/>`;
    s += `<path d="M-17 ${hc - 9} Q 3 ${hc - 15} 23 ${hc - 11} L 23 ${hc - 15} Q 3 ${hc - 19} -17 ${hc - 13} Z" fill="${R.acc}"/>`;
    for (let i = -2; i <= 3; i++) s += `<path d="M${i * 5.8} ${hc - 24} l 2.6 -3.2 l 2.6 3.2 l -2.6 3.2 Z" fill="${R.acc}"/>`;
  }
  return s;
}

function face(hc, R, fx, view) {
  const q = view === 'q';
  let s = '';
  // brows
  s += `<path d="M${fx - 12} ${hc - 8} Q ${fx - 7} ${hc - 11} ${fx - 3} ${hc - 8.5}" stroke="${R.hair}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  s += `<path d="M${fx + 3} ${hc - 8.5} Q ${fx + 7} ${hc - 11} ${fx + 12} ${hc - 8}" stroke="${R.hair}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  // eyes
  s += `<g class="eyes"><ellipse cx="${fx - 7}" cy="${hc - 1}" rx="${q ? 2.1 : 2.5}" ry="2.9" fill="#231C18"/><ellipse cx="${fx + 7}" cy="${hc - 1}" rx="2.5" ry="2.9" fill="#231C18"/>
    <circle cx="${fx - 6.2}" cy="${hc - 2}" r="0.8" fill="#fff"/><circle cx="${fx + 7.8}" cy="${hc - 2}" r="0.8" fill="#fff"/></g>`;
  if (R.glasses) s += `<g fill="none" stroke="#3B342E" stroke-width="1.5"><rect x="${fx - 13.5}" y="${hc - 6.5}" width="12" height="10" rx="3.5"/><rect x="${fx + 1.5}" y="${hc - 6.5}" width="12" height="10" rx="3.5"/><path d="M${fx - 1.5} ${hc - 3} L ${fx + 1.5} ${hc - 3}"/></g>`;
  // nose
  s += q ? `<path d="M${fx + 1} ${hc} L ${fx + 6} ${hc + 8} L ${fx + 1} ${hc + 9}" stroke="${R.skin2}" stroke-width="1.8" fill="none" stroke-linejoin="round" stroke-linecap="round"/>`
         : `<path d="M${fx - 1} ${hc + 1} Q ${fx + 3} ${hc + 8} ${fx - 1} ${hc + 9.5}" stroke="${R.skin2}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
  // facial hair
  const b = fx * 0.5;
  if (R.beard === 'full') {
    s += `<path d="M-18.5 ${hc + 2} Q -17 ${hc + 22} ${b} ${hc + 26} Q 17 ${hc + 22} 18.5 ${hc + 2} Q 17 ${hc + 13} ${b + 9} ${hc + 15} Q ${b} ${hc + 12.5} ${b - 9} ${hc + 15} Q -17 ${hc + 13} -18.5 ${hc + 2} Z" fill="${R.hair}"/>`;
    s += `<path d="M${fx - 9} ${hc + 13} Q ${fx} ${hc + 9.5} ${fx + 9} ${hc + 13} Q ${fx} ${hc + 14.5} ${fx - 9} ${hc + 13} Z" fill="${R.hair}"/>`;
  } else {
    s += `<path d="M${fx - 8.5} ${hc + 12.5} Q ${fx} ${hc + 9.5} ${fx + 8.5} ${hc + 12.5} Q ${fx} ${hc + 14} ${fx - 8.5} ${hc + 12.5} Z" fill="${R.hair}"/>`;
    s += `<path d="M${b - 8} ${hc + 18} Q ${b} ${hc + 28} ${b + 8} ${hc + 18} Q ${b} ${hc + 21} ${b - 8} ${hc + 18} Z" fill="${R.hair}"/>`;
  }
  // mouth (friendly smile)
  s += `<path class="mouth" d="M${fx - 6} ${hc + 16} Q ${fx} ${hc + 21} ${fx + 6} ${hc + 16}" stroke="#7A3E2E" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  return s;
}

function arm(cls, sx, sy, a1, a2, R, sleeve = '#FFFFFF') {
  return `<g class="arm ${cls}" data-sx="${sx}" data-sy="${sy}" transform="translate(${sx} ${sy}) rotate(${a1})">
    <path d="M-10.5 -3 Q 0 -9 10.5 -3 L 9.5 56 L -9.5 56 Z" fill="${sleeve}" stroke="${C.line}" stroke-width="1.2"/>
    <g class="fa" transform="translate(0 54) rotate(${a2})">
      <path d="M-9.5 -2 L 9.5 -2 L 8.5 44 Q 0 47 -8.5 44 Z" fill="${sleeve}" stroke="${C.line}" stroke-width="1.2"/>
      <path d="M-8.5 40 L 8.5 40" stroke="${C.line}" stroke-width="1.5"/>
      <g class="hand"><ellipse cx="0" cy="52" rx="7.2" ry="8" fill="${R.skin}"/><path d="M-3 57 Q 0 59 3 57" stroke="${R.skin2}" stroke-width="1.2" fill="none"/></g>
    </g></g>`;
}
function setArm(root, cls, a1, a2) {
  const a = root.querySelector('.' + cls);
  if (!a) return;
  a.setAttribute('transform', `translate(${a.dataset.sx} ${a.dataset.sy}) rotate(${r1(a1)})`);
  a.querySelector('.fa').setAttribute('transform', `translate(0 54) rotate(${r1(a2)})`);
}

/* Omani man — front / 3-4 view, standing or seated. Origin at feet center. */
function omani(o) {
  const R = ROLE[o.role || 'customer'];
  const { x = 0, y = 0, s = 1, view = 'front', dir = 1, pose = 'stand', id = '', cls = '', arms = {}, hold = null } = o;
  const q = view === 'q', U = pose === 'sit' ? 28 : 0, fx = q ? 6 : 0;
  const hc = -256 + U;
  const A = Object.assign({ L: [7, 0], R: [-7, 0] }, arms);
  let body = '';
  body += `<ellipse cx="0" cy="0" rx="54" ry="8" fill="#000" opacity="0.08"/>`;
  body += `<g><ellipse cx="-14" cy="-5" rx="12.5" ry="5.5" fill="#6B4F3A"/><ellipse cx="14" cy="-5" rx="12.5" ry="5.5" fill="#6B4F3A"/>
    <path d="M-20 -7 L -8 -7 M8 -7 L 20 -7" stroke="#4E392A" stroke-width="2.5"/></g>`;
  if (pose === 'sit') {
    body += `<path d="M-38 -80 L -34 -8 Q 0 -3 34 -8 L 38 -80 Z" fill="#FFFFFF" stroke="${C.line}" stroke-width="1.2"/>`;
    body += `<path d="M12 -80 L 38 -80 L 34 -8 Q 24 -6 14 -6 Z" fill="${C.shade}"/>`;
    body += `<path d="M-46 -112 Q -48 -82 -40 -76 L 40 -76 Q 48 -82 46 -112 Z" fill="#FFFFFF" stroke="${C.line}" stroke-width="1.2"/>`;
    body += `<path d="M0 -108 L 0 -78" stroke="${C.line}" stroke-width="1.5"/>`;
    body += `<path d="M-34 ${-214 + U} Q -38 ${-224 + U} -22 ${-226 + U} L 22 ${-226 + U} Q 38 ${-224 + U} 34 ${-214 + U} L 41 -106 L -41 -106 Z" fill="#FFFFFF"/>`;
    body += `<path d="M12 ${-226 + U} L 22 ${-226 + U} Q 38 ${-224 + U} 34 ${-214 + U} L 41 -106 L 18 -106 Z" fill="${C.shade}"/>`;
  } else {
    body += `<path d="M-34 -214 Q -38 -224 -22 -226 L 22 -226 Q 38 -224 34 -214 L 41 -8 Q 0 -3 -41 -8 Z" fill="#FFFFFF"/>`;
    body += `<path d="M12 -226 L 22 -226 Q 38 -224 34 -214 L 41 -8 Q 30 -5 18 -5 Z" fill="${C.shade}"/>`;
    body += `<path d="M-41 -8 Q 0 -3 41 -8" stroke="${C.line}" stroke-width="1.5" fill="none"/>`;
  }
  // collar + furakha tassel
  body += `<path d="M-9 ${-225 + U} Q 0 ${-217 + U} 9 ${-225 + U}" stroke="${C.line}" stroke-width="2" fill="none"/>`;
  body += `<path d="M${fx * 0.3 + 1} ${-219 + U} L ${fx * 0.3 + 1} ${-178 + U}" stroke="${R.tassel}" stroke-width="2"/>`;
  body += `<path d="M${fx * 0.3 + 1} ${-180 + U} q -4 6 0 13 q 4 -7 0 -13 Z" fill="${R.tassel}"/>`;
  if (R.badge) {
    body += `<path d="M-13 ${-224 + U} L -5 ${-176 + U} M13 ${-224 + U} L 5 ${-176 + U}" stroke="${C.green}" stroke-width="3" stroke-linecap="round"/>`;
    body += `<g transform="translate(${-13 + fx * 0.3} ${-178 + U})"><rect width="26" height="32" rx="3" fill="#fff" stroke="${C.line}"/><rect width="26" height="9" rx="3" fill="${C.green}"/><rect x="5" y="14" width="16" height="3" fill="${C.gold}"/><rect x="5" y="21" width="12" height="2.5" fill="${C.olive3}"/></g>`;
  }
  const armL = arm('armL', -33, -212 + U, A.L[0], A.L[1], R);
  const armR = arm('armR', 33, -212 + U, A.R[0], A.R[1], R);
  // head
  let head = `<g class="head" data-ox="0" data-oy="${-226 + U}">`;
  head += `<rect x="-8" y="${hc + 16}" width="16" height="16" fill="${R.skin2}"/>`;
  if (!q) head += `<ellipse cx="-19" cy="${hc + 2}" rx="4.2" ry="6.5" fill="${R.skin2}"/><ellipse cx="19" cy="${hc + 2}" rx="4.2" ry="6.5" fill="${R.skin2}"/>`;
  else head += `<ellipse cx="-17" cy="${hc + 2}" rx="4.5" ry="7" fill="${R.skin2}"/>`;
  head += `<ellipse cx="${q ? 1.5 : 0}" cy="${hc}" rx="19.5" ry="23.5" fill="${R.skin}"/>`;
  head += `<path d="M-19.5 ${hc - 6} Q 0 ${hc - 15} 19.5 ${hc - 6} L 20 ${hc - 13} Q 0 ${hc - 22} -20 ${hc - 13} Z" fill="${R.hair}"/>`;
  head += `<path d="M-19.5 ${hc - 8} L -18.5 ${hc + 4} L -15.5 ${hc + 4} L -15.5 ${hc - 8} Z" fill="${R.hair}"/>`;
  if (!q) head += `<path d="M19.5 ${hc - 8} L 18.5 ${hc + 4} L 15.5 ${hc + 4} L 15.5 ${hc - 8} Z" fill="${R.hair}"/>`;
  head += face(hc, R, fx, view);
  head += kumma(hc, R, fx);
  head += `</g>`;
  let held = '';
  if (hold === 'phone') held = `<g class="phone"><rect x="-13" y="${-178 + U}" width="26" height="44" rx="5" fill="${C.char}"/><rect x="-11" y="${-175 + U}" width="22" height="37" rx="3" fill="${C.sage}"/><rect x="-7" y="${-170 + U}" width="14" height="3" fill="${C.green}"/></g>`;
  const inner = q ? `${armL}${body}${head}${held}${armR}` : `${body}${head}${armL}${armR}${held}`;
  return `<g ${id ? `id="${id}"` : ''} class="char ${cls}"><g transform="translate(${x} ${y}) scale(${dir * s} ${s})">${inner}</g></g>`;
}

/* Omani man — side (profile) walking view, faces +x. */
function omaniSide(o) {
  const R = ROLE[o.role || 'customer'];
  const { x = 0, y = 0, s = 1, dir = 1, id = '' } = o;
  const hc = -256;
  let g = `<g ${id ? `id="${id}"` : ''} class="char walker"><g transform="translate(${x} ${y}) scale(${dir * s} ${s})"><g class="bob">`;
  g += `<ellipse cx="0" cy="0" rx="44" ry="7" fill="#000" opacity="0.08"/>`;
  g += `<ellipse class="fB" cx="0" cy="-5" rx="14" ry="5.5" fill="#4E392A"/>`;
  g += `<path class="armB" d="M-2 -210 L -6 -112" stroke="#EEE9DE" stroke-width="18" stroke-linecap="round" transform="rotate(0 0 -212)"/>`;
  g += `<path class="dsh" d="M-17 -224 Q 12 -229 19 -214 L 25 -8 Q 2 -3 -24 -8 L -21 -150 Q -23 -200 -17 -224 Z" fill="#FFFFFF" stroke="${C.line}" stroke-width="1.2"/>`;
  g += `<path d="M-24 -8 Q 2 -3 25 -8" stroke="${C.line}" stroke-width="1.5" fill="none"/>`;
  g += `<path d="M8 -219 L 8 -180" stroke="${R.tassel}" stroke-width="2"/><path d="M8 -182 q -4 6 0 13 q 4 -7 0 -13 Z" fill="${R.tassel}"/>`;
  g += `<ellipse class="fA" cx="0" cy="-5" rx="14" ry="5.5" fill="#6B4F3A"/>`;
  g += `<g class="armF" transform="rotate(0 0 -212)"><path d="M-10 -214 Q 0 -219 10 -212 L 7 -118 L -9 -118 Z" fill="#FFFFFF" stroke="${C.line}" stroke-width="1.2"/><ellipse cx="-1" cy="-110" rx="7" ry="8" fill="${R.skin}"/></g>`;
  // head (profile)
  g += `<g class="head"><rect x="-6" y="${hc + 16}" width="15" height="16" fill="${R.skin2}"/>`;
  g += `<path d="M-14 ${hc - 8} Q -18 ${hc + 14} -6 ${hc + 22} Q 8 ${hc + 26} 15 ${hc + 18} L 17 ${hc + 8} L 22 ${hc + 3} L 18 ${hc - 2} Q 20 ${hc - 16} 6 ${hc - 22} Q -10 ${hc - 22} -14 ${hc - 8} Z" fill="${R.skin}"/>`;
  g += `<ellipse cx="-4" cy="${hc + 2}" rx="4.2" ry="6.5" fill="${R.skin2}"/>`;
  g += `<path d="M-15 ${hc - 8} L -14 ${hc + 8} L -9 ${hc + 8} L -9 ${hc - 8} Z" fill="${R.hair}"/>`;
  if (R.beard === 'full') g += `<path d="M-6 ${hc + 4} Q -8 ${hc + 18} 0 ${hc + 24} Q 12 ${hc + 27} 17 ${hc + 16} L 16 ${hc + 11} Q 10 ${hc + 15} 4 ${hc + 13} Q 0 ${hc + 8} -6 ${hc + 4} Z" fill="${R.hair}"/>`;
  else g += `<path d="M8 ${hc + 18} Q 12 ${hc + 26} 17 ${hc + 18} Z" fill="${R.hair}"/><path d="M12 ${hc + 11} L 19 ${hc + 11}" stroke="${R.hair}" stroke-width="3" stroke-linecap="round"/>`;
  g += `<ellipse cx="11" cy="${hc - 1}" rx="2.2" ry="2.8" fill="#231C18"/><path d="M7 ${hc - 8} L 14 ${hc - 8}" stroke="${R.hair}" stroke-width="2.2" stroke-linecap="round"/>`;
  if (R.glasses) g += `<rect x="6" y="${hc - 6}" width="11" height="9.5" rx="3.5" fill="none" stroke="#3B342E" stroke-width="1.5"/><path d="M6 ${hc - 2} L -3 ${hc - 1}" stroke="#3B342E" stroke-width="1.4"/>`;
  g += `<path d="M10 ${hc + 16} Q 13 ${hc + 18} 15.5 ${hc + 15.5}" stroke="#7A3E2E" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
  g += kumma(hc, R, 0, true);
  g += `</g></g></g></g>`;
  return g;
}
function walkPose(el, ph, amp = 1) {
  if (!el) return;
  const sw = Math.sin(ph);
  el.querySelector('.fA').setAttribute('cx', r1(sw * 16 * amp));
  el.querySelector('.fB').setAttribute('cx', r1(-sw * 16 * amp));
  el.querySelector('.armF').setAttribute('transform', `rotate(${r1(-sw * 16 * amp)} 0 -212)`);
  el.querySelector('.armB').setAttribute('transform', `rotate(${r1(sw * 14 * amp)} 0 -212)`);
  el.querySelector('.bob').setAttribute('transform', `translate(0 ${r1(-Math.abs(Math.cos(ph)) * 4 * amp)})`);
  el.querySelector('.dsh').setAttribute('transform', `skewX(${r1(sw * 2.2 * amp)})`);
}

/* Filipino domestic worker — bust portrait for sample profile cards */
function workerBust(v = 0) {
  const skin = '#D9AA82', skin2 = '#C18F68', hair = '#1F1A17';
  const blouse = [C.olive, C.green3, '#8A6E4B'][v % 3];
  let s = '';
  // hair back
  if (v === 0) s += `<circle cx="0" cy="-162" r="17" fill="${hair}"/>`;
  if (v === 1) s += `<path d="M18 -140 Q 40 -110 30 -70 Q 22 -60 16 -70 Q 24 -105 10 -135 Z" fill="${hair}"/>`;
  if (v === 2) s += `<path d="M-36 -130 Q -40 -84 -28 -78 L 28 -78 Q 40 -84 36 -130 Q 30 -166 0 -166 Q -30 -166 -36 -130 Z" fill="${hair}"/>`;
  s += `<path d="M-82 0 Q -80 -58 -36 -70 L 36 -70 Q 80 -58 82 0 Z" fill="${blouse}"/>`;
  s += `<rect x="-10" y="-92" width="20" height="26" fill="${skin2}"/>`;
  s += `<path d="M-14 -72 L 0 -50 L 14 -72 L 24 -70 L 4 -40 L -4 -40 L -24 -70 Z" fill="#fff"/>`;
  s += `<path d="M0 -50 L 0 0" stroke="#fff" stroke-opacity="0.35" stroke-width="2"/><circle cx="0" cy="-28" r="2.2" fill="#fff" opacity="0.7"/><circle cx="0" cy="-12" r="2.2" fill="#fff" opacity="0.7"/>`;
  s += `<ellipse cx="0" cy="-122" rx="28" ry="34" fill="${skin}"/>`;
  s += `<ellipse cx="-28" cy="-118" rx="4" ry="6" fill="${skin2}"/><ellipse cx="28" cy="-118" rx="4" ry="6" fill="${skin2}"/>`;
  s += `<circle cx="-28" cy="-110" r="2.2" fill="${C.gold}"/><circle cx="28" cy="-110" r="2.2" fill="${C.gold}"/>`;
  // hair front (side part)
  s += `<path d="M-30 -122 Q -34 -158 -2 -160 Q 30 -160 30 -122 Q 22 -146 4 -146 Q -6 -138 -18 -140 Q -26 -136 -30 -122 Z" fill="${hair}"/>`;
  // face
  s += `<path d="M-17 -130 Q -11 -134 -5 -131" stroke="${hair}" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M5 -131 Q 11 -134 17 -130" stroke="${hair}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
  s += `<path d="M-16 -121 Q -11 -126 -6 -121 Q -11 -118 -16 -121 Z" fill="#231C18"/><path d="M6 -121 Q 11 -126 16 -121 Q 11 -118 6 -121 Z" fill="#231C18"/>`;
  s += `<path d="M0 -118 Q 3 -110 -1 -107" stroke="${skin2}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
  s += `<path d="M-8 -100 Q 0 -94 8 -100" stroke="#A4544A" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  s += `<ellipse cx="-16" cy="-106" rx="5" ry="3" fill="#E39A86" opacity="0.35"/><ellipse cx="16" cy="-106" rx="5" ry="3" fill="#E39A86" opacity="0.35"/>`;
  return s;
}

/* ---------------- props ---------------- */
function plant(x, base, s = 1, pot = C.beige3) {
  let leaves = '';
  const L = [[-60, 120], [-35, 150], [-10, 165], [15, 150], [40, 128], [62, 100], [-80, 90]];
  L.forEach(([a, len], i) => {
    const rad = (a - 90) * Math.PI / 180, ex = Math.cos(rad) * len, ey = Math.sin(rad) * len;
    leaves += `<path d="M0 -60 Q ${r1(ex * 0.3 - 18)} ${r1(-60 + ey * 0.6)} ${r1(ex)} ${r1(-60 + ey)} Q ${r1(ex * 0.6 + 16)} ${r1(-60 + ey * 0.45)} 0 -60 Z" fill="${i % 2 ? C.olive : C.green3}"/>`;
  });
  return `<g transform="translate(${x} ${base}) scale(${s})">${leaves}<path d="M-34 -64 L 34 -64 L 26 0 L -26 0 Z" fill="${pot}"/><rect x="-36" y="-68" width="72" height="8" rx="3" fill="${C.beige4}"/><rect x="-30" y="-40" width="60" height="3" fill="${C.gold}"/></g>`;
}
function dallah(x, base, s = 1) {
  return `<g transform="translate(${x} ${base}) scale(${s})">
    <path d="M-22 0 L 22 0 L 16 -10 L -16 -10 Z" fill="${C.goldD}"/>
    <path d="M-16 -10 Q -26 -40 -10 -52 L 10 -52 Q 26 -40 16 -10 Z" fill="url(#gGold)"/>
    <path d="M-10 -52 L -7 -66 L 7 -66 L 10 -52 Z" fill="${C.gold}"/><path d="M-6 -66 Q 0 -84 6 -66 Z" fill="${C.goldD}"/><circle cx="0" cy="-80" r="3" fill="${C.goldD}"/>
    <path d="M-14 -40 Q -30 -48 -40 -66 L -34 -68 Q -26 -54 -12 -48" fill="${C.gold}"/>
    <path d="M18 -18 Q 34 -34 18 -50" stroke="${C.goldD}" stroke-width="4" fill="none"/></g>`;
}

/* ---------------- icons (64 box) ---------------- */
const ICON = {
  search: `<circle cx="27" cy="27" r="16"/><path d="M39 39 L 56 56"/>`,
  briefcase: `<rect x="8" y="20" width="48" height="34" rx="5"/><path d="M24 20 L 24 12 L 40 12 L 40 20"/><path d="M8 34 L 56 34"/><path d="M29 34 L 29 39 L 35 39 L 35 34"/>`,
  skills: `<path d="M32 8 L 38 24 L 55 25 L 42 36 L 46 53 L 32 44 L 18 53 L 22 36 L 9 25 L 26 24 Z"/>`,
  training: `<path d="M4 24 L 32 12 L 60 24 L 32 36 Z"/><path d="M16 30 L 16 44 Q 32 54 48 44 L 48 30"/><path d="M58 25 L 58 40"/>`,
  price: `<path d="M8 32 L 30 10 L 54 10 L 54 34 L 32 56 Z"/><circle cx="44" cy="20" r="4"/>`,
  phone: `<path d="M18 8 L 26 8 L 30 20 L 24 24 C 27 32 32 37 40 40 L 44 34 L 56 38 L 56 46 C 56 52 52 56 46 56 C 24 54 10 40 8 18 C 8 12 12 8 18 8 Z"/>`,
  globe: `<circle cx="32" cy="32" r="24"/><path d="M8 32 L 56 32 M32 8 C 20 20 20 44 32 56 C 44 44 44 20 32 8"/>`,
  pin: `<path d="M32 58 C 20 44 12 34 12 24 C 12 13 21 6 32 6 C 43 6 52 13 52 24 C 52 34 44 44 32 58 Z"/><circle cx="32" cy="24" r="7"/>`,
  home: `<path d="M8 30 L 32 10 L 56 30"/><path d="M14 26 L 14 54 L 50 54 L 50 26"/><path d="M27 54 L 27 38 L 37 38 L 37 54"/>`,
  check: `<path d="M14 33 L 27 46 L 50 20"/>`
};
function icon(name, cx, cy, size, color, sw = 3.2, cls = '') {
  const k = size / 64;
  return `<g class="icon ${cls}" transform="translate(${r1(cx - size / 2)} ${r1(cy - size / 2)}) scale(${k})" fill="none" stroke="${color}" stroke-width="${r1(sw / k * 10) / 10}" stroke-linecap="round" stroke-linejoin="round">${ICON[name]}</g>`;
}
function iconSvg(name, size, color, sw = 3.2) {
  return `<svg viewBox="0 0 64 64" width="${size}" height="${size}" style="display:block">${icon(name, 32, 32, 64, color, sw * 64 / size)}</svg>`;
}

function defs() {
  return `<svg width="0" height="0" style="position:absolute"><defs>
    <linearGradient id="gGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E4C98E"/><stop offset="0.5" stop-color="#C5A059"/><stop offset="1" stop-color="#9C7A3A"/></linearGradient>
    <linearGradient id="gWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3EEE1"/><stop offset="1" stop-color="#F8F5EC"/></linearGradient>
    <linearGradient id="gFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E2D6BC"/><stop offset="1" stop-color="#EDE4D1"/></linearGradient>
    <linearGradient id="gGreenWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1A5442"/><stop offset="1" stop-color="#143F31"/></linearGradient>
    <linearGradient id="gSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EEF0E4"/><stop offset="1" stop-color="#FAF6EC"/></linearGradient>
    <radialGradient id="gGlow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#FFF4D8" stop-opacity="0.95"/><stop offset="1" stop-color="#F3DFAE" stop-opacity="0"/></radialGradient>
    <pattern id="pLattice" width="36" height="36" patternUnits="userSpaceOnUse"><path d="M18 0 L 36 18 L 18 36 L 0 18 Z" fill="none" stroke="#C5A059" stroke-width="2"/><circle cx="18" cy="18" r="3" fill="#C5A059"/></pattern>
    <pattern id="pDots" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="14" cy="14" r="1.4" fill="#55775B"/></pattern>
    <pattern id="pWave" width="80" height="26" patternUnits="userSpaceOnUse"><path d="M0 13 Q 20 3 40 13 T 80 13" fill="none" stroke="#9FB59F" stroke-width="1.6"/></pattern>
  </defs></svg>`;
}

/* botanical line ornament */
function sprig(x, y, s = 1, rot = 0, color = C.olive, op = 0.5) {
  let p = `<path d="M0 0 Q 40 -60 30 -150" stroke="${color}" stroke-width="2.5" fill="none"/>`;
  [[8, -30, -40], [22, -60, 30], [28, -90, -35], [32, -118, 28]].forEach(([lx, ly, a]) => {
    p += `<ellipse cx="${lx}" cy="${ly}" rx="16" ry="6" fill="${color}" transform="rotate(${a} ${lx} ${ly})"/>`;
  });
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})" opacity="${op}">${p}</g>`;
}
