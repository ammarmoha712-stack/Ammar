// ===== ALSHAALAN — shared helpers & locked asset library =====
const NS='http://www.w3.org/2000/svg';
const C={NAVY:'#1C3350',NAVY2:'#12233B',NAVYL:'#2D4B72',GOLD:'#C9A86A',GOLDL:'#EBD7A8',GOLDD:'#9A773A',
BEIGE:'#EADFCB',BEIGED:'#D8C7A9',IVORY:'#FAF6EE',COPPER:'#C77A4E',SKIN:'#C68E68',SKIND:'#A8714E',HAIR:'#2A201A',
THOBE:'#F7F4EE',THOBED:'#E2DBCE',WOOD:'#8E6444',GLASS:'#35557E',GREEN:'#7C9668'};
function el(tag,attrs,parent){const e=document.createElementNS(NS,tag);if(attrs)for(const k in attrs)e.setAttribute(k,attrs[k]);if(parent)parent.appendChild(e);return e;}
function G(parent,attrs){return el('g',attrs,parent);}
function H(parent,str,attrs){const g=G(parent,attrs);g.innerHTML=str;return g;}
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const P=(t,a,b)=>clamp((t-a)/(b-a));
const eio=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
const eo=x=>1-Math.pow(1-x,3);
const ei=x=>x*x*x;
const eback=x=>{const c1=1.5,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2);};
const lerp=(a,b,x)=>a+(b-a)*x;
function tf(e,tx=0,ty=0,s=1,r=0,sy){e.setAttribute('transform',`translate(${tx.toFixed(2)},${ty.toFixed(2)}) rotate(${r.toFixed(2)}) scale(${s.toFixed(4)},${(sy===undefined?s:sy).toFixed(4)})`);}
function op(e,o){o=clamp(o);e.style.opacity=o.toFixed(3);e.style.display=o<=0.002?'none':'';}
function rnd(seed){let s=seed>>>0||1;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;};}

// ---------- DEFS ----------
function defs(svg){
 H(svg,`<defs>
 <pattern id="shm" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
  <rect width="12" height="12" fill="#FBF8F3"/><rect x="0" y="0" width="12" height="3.2" fill="#C3262D"/><rect x="0" y="0" width="3.2" height="12" fill="#C3262D"/>
  <rect x="6" y="6" width="2" height="2" fill="#C3262D" opacity=".6"/></pattern>
 <linearGradient id="goldG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F3E3B6"/><stop offset=".45" stop-color="#CFAE6C"/><stop offset="1" stop-color="#9C7838"/></linearGradient>
 <linearGradient id="goldV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EFDCA8"/><stop offset="1" stop-color="#B08A46"/></linearGradient>
 <linearGradient id="goldDark" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B48D4A"/><stop offset="1" stop-color="#7E5E2A"/></linearGradient>
 <linearGradient id="glassG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4E6F98"/><stop offset=".55" stop-color="#2E4B72"/><stop offset="1" stop-color="#22395A"/></linearGradient>
 <linearGradient id="litG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE7AE"/><stop offset="1" stop-color="#F0B866"/></linearGradient>
 <linearGradient id="bpG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2B4D7C"/><stop offset="1" stop-color="#1B3459"/></linearGradient>
 <radialGradient id="glowR"><stop offset="0" stop-color="#FFF4D6" stop-opacity="1"/><stop offset=".35" stop-color="#F2D28C" stop-opacity=".75"/><stop offset="1" stop-color="#E5B862" stop-opacity="0"/></radialGradient>
 <radialGradient id="softR"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".9"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient>
 <linearGradient id="rayG" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#FFF1C9" stop-opacity=".95"/><stop offset="1" stop-color="#F2D28C" stop-opacity="0"/></linearGradient>
 <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="#1C3350" flood-opacity=".18"/></filter>
 <filter id="blur8"><feGaussianBlur stdDeviation="8"/></filter>
 <filter id="blur20" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="20"/></filter>
 <clipPath id="frameClip"><rect x="-190" y="-150" width="380" height="300" rx="26"/></clipPath>
 </defs>`);
}

// ---------- CHARACTER (locked design) ----------
// origin = feet centre; total height ~640 units. opt.consultant adds glasses, fuller greying beard, gold pen.
function makeMan(parent,opt={}){
 const m={opt};
 m.root=G(parent);
 m.shadow=el('ellipse',{cx:0,cy:0,rx:125,ry:16,fill:'#0E1B2E',opacity:.16},m.root);
 m.body=G(m.root);
 const foot=`<path d="M-22 -2 C-22 -16 22 -16 22 -2 Z" fill="${C.SKIN}"/><rect x="-26" y="-6" width="52" height="8" rx="4" fill="#5A3E2A"/><path d="M-14 -12 L0 -4 L14 -12" stroke="#5A3E2A" stroke-width="4" fill="none"/>`;
 m.legL=H(m.body,foot);m.legR=H(m.body,foot);
 m.torso=G(m.body);
 // back view robe & front view robe share outline
 H(m.torso,`<path d="M-42 -505 C-82 -500 -104 -488 -108 -460 L-122 -18 Q0 -4 122 -18 L108 -460 C104 -488 82 -500 42 -505 Z" fill="${C.THOBE}"/>
  <path d="M62 -494 C92 -486 104 -474 108 -460 L122 -18 Q104 -13 84 -11 L72 -400 Z" fill="${C.THOBED}" opacity=".85"/>
  <path d="M-122 -18 Q0 -4 122 -18 L121 -30 Q0 -17 -121 -30 Z" fill="${C.THOBED}"/>`);
 m.front=H(m.torso,`<path d="M0 -500 L0 -360" stroke="#DCD4C6" stroke-width="2.5"/>
  <circle cx="0" cy="-470" r="3.4" fill="#CBBFA9"/><circle cx="0" cy="-440" r="3.4" fill="#CBBFA9"/><circle cx="0" cy="-410" r="3.4" fill="#CBBFA9"/>
  <path d="M-32 -503 Q0 -488 32 -503" stroke="#DCD4C6" stroke-width="3" fill="none"/>
  ${opt.consultant?`<rect x="38" y="-452" width="40" height="5" rx="2.5" fill="${C.THOBED}"/><rect x="62" y="-470" width="6" height="26" rx="3" fill="${C.GOLD}"/>`:''}`);
 m.backRobe=H(m.torso,`<path d="M0 -480 L0 -40" stroke="#E7E0D3" stroke-width="2"/>`);
 // arms: shoulder pivots
 function arm(side){
  const a={side};a.up=G(m.body);
  H(a.up,`<rect x="-25" y="-8" width="50" height="140" rx="24" fill="${C.THOBE}" stroke="#D3CABA" stroke-width="2.5"/><rect x="${side<0?-25:5}" y="-8" width="20" height="140" rx="10" fill="${C.THOBED}" opacity=".45"/>`);
  a.fore=G(a.up);
  H(a.fore,`<rect x="-23" y="-12" width="46" height="128" rx="22" fill="${C.THOBE}" stroke="#D3CABA" stroke-width="2.5"/><rect x="-23" y="100" width="46" height="16" rx="7" fill="${C.THOBED}"/>
   <circle cx="0" cy="130" r="20" fill="${C.SKIN}"/><ellipse cx="${side*-14}" cy="122" rx="7" ry="11" fill="${C.SKIN}" transform="rotate(${side*25} ${side*-14} 122)"/>
   <path d="M-12 138 Q0 146 12 138" stroke="${C.SKIND}" stroke-width="2" fill="none" opacity=".6"/>`);
  a.hold=G(a.fore,{transform:'translate(0,130)'});
  a.sx=side*100;a.sy=-462;a.u=-side*7;a.f=0;
  return a;
 }
 m.armL=arm(-1);m.armR=arm(1);
 // head
 m.head=G(m.body);
 m.headIn=G(m.head);
 m.hBack=H(m.headIn,`<path d="M-66 -150 C-80 -180 -40 -198 0 -200 C40 -198 80 -180 66 -150 C80 -100 100 -20 114 40 L0 150 L-114 40 C-100 -20 -80 -100 -66 -150 Z" fill="url(#shm)"/>
  <path d="M0 -150 L0 150 L-114 40 Z" fill="#000" opacity=".06"/>
  <ellipse cx="0" cy="-168" rx="62" ry="15" fill="none" stroke="#171717" stroke-width="8"/><ellipse cx="0" cy="-156" rx="64" ry="15" fill="none" stroke="#171717" stroke-width="8"/>`);
 m.hFront=G(m.headIn);
 H(m.hFront,`<path d="M-62 -150 C-96 -120 -100 -40 -114 44 L-72 60 L-40 8 L40 8 L72 60 L114 44 C100 -40 96 -120 62 -150 Z" fill="url(#shm)"/>
  <path d="M-62 -150 C-96 -120 -100 -40 -114 44 L-72 60 L-46 10 Z" fill="#000" opacity=".07"/>
  <rect x="-19" y="-36" width="38" height="44" fill="${C.SKIND}"/>`);
 m.face=G(m.hFront);
 m.faceShape=el('ellipse',{cx:0,cy:-82,rx:51,ry:63,fill:C.SKIN},m.face);
 m.feat=G(m.face);
 const beard=opt.consultant?'#3B3431':C.HAIR;
 m.beard=H(m.feat,`<path d="M-51 -86 C-52 -34 -26 ${opt.consultant?-6:-12} 0 ${opt.consultant?-6:-12} C26 ${opt.consultant?-6:-12} 52 -34 51 -86 C46 -66 40 -58 30 -50 C18 -40 8 -38 0 -38 C-8 -38 -18 -40 -30 -50 C-40 -58 -46 -66 -51 -86 Z" fill="${beard}"/>
  ${opt.consultant?`<path d="M-30 -30 Q-20 -22 -10 -24 M12 -24 Q22 -22 30 -32" stroke="#8D8680" stroke-width="2" fill="none" opacity=".7"/>`:''}
  <path d="M-25 -57 C-14 -69 14 -69 25 -57 C12 -61 -12 -61 -25 -57 Z" fill="${beard}"/>`);
 m.nose=el('path',{d:'M-2 -94 Q-9 -74 -1 -70 Q6 -70 8 -74',stroke:C.SKIND,'stroke-width':3,fill:'none','stroke-linecap':'round'},m.feat);
 m.mouth=el('path',{d:'',fill:'none',stroke:'#5A2A22','stroke-width':3.5,'stroke-linecap':'round'},m.feat);
 m.eyes=[];
 for(const s of [-1,1]){const e=G(m.feat);const w=el('ellipse',{cx:0,cy:0,rx:9.5,ry:6.5,fill:'#FFFDF8'},e);const p=el('circle',{cx:0,cy:0,r:4.8,fill:'#24170F'},e);
  const lid=el('path',{d:'M-11 -2 Q0 -10 11 -2',stroke:'#2A1C14','stroke-width':2.6,fill:'none'},e);m.eyes.push({g:e,w,p,lid,s});}
 m.brows=[el('path',{stroke:beard,'stroke-width':5.5,fill:'none','stroke-linecap':'round'},m.feat),el('path',{stroke:beard,'stroke-width':5.5,fill:'none','stroke-linecap':'round'},m.feat)];
 if(opt.consultant) m.glasses=H(m.feat,`<g fill="none" stroke="#3A2E22" stroke-width="2.6"><rect x="-35" y="-102" width="28" height="20" rx="7"/><rect x="7" y="-102" width="28" height="20" rx="7"/><path d="M-7 -94 Q0 -98 7 -94"/></g>`);
 H(m.hFront,`<path d="M-66 -150 C-70 -176 -40 -194 0 -197 C40 -194 70 -176 66 -150 C72 -110 64 -60 58 -30 L47 -40 C55 -80 55 -120 45 -136 C30 -150 -30 -150 -45 -136 C-55 -120 -55 -80 -47 -40 L-58 -30 C-64 -60 -72 -110 -66 -150 Z" fill="url(#shm)"/>
  <path d="M-12 -196 L0 -210 L12 -196 Z" fill="url(#shm)"/><path d="M-45 -136 C-30 -150 30 -150 45 -136" stroke="#000" stroke-opacity=".08" stroke-width="5" fill="none"/>
  <ellipse cx="0" cy="-168" rx="62" ry="15" fill="none" stroke="#171717" stroke-width="8"/><ellipse cx="0" cy="-156" rx="64" ry="15" fill="none" stroke="#171717" stroke-width="8"/>
  <path d="M-58 -160 Q0 -146 58 -160" stroke="#3a3a3a" stroke-width="2" fill="none" opacity=".6"/>`);
 m.view='front';m.turn=0;m.expr='neutral';m.look=[0,0];m.blink=0;m.talk=0;
 m.walk=null;
 return m;
}
const EXPR={
 neutral:{b:[-104,-106],eh:6.5,mouth:'M-12 -51 Q0 -46 12 -51'},
 smile:{b:[-106,-107],eh:6,mouth:'M-15 -53 Q0 -42 15 -53'},
 happy:{b:[-108,-108],eh:4.2,open:'M-17 -55 Q0 -36 17 -55 Q0 -49 -17 -55 Z'},
 curious:{b:[-112,-104],eh:7,mouth:'M-10 -51 Q2 -47 13 -53',asym:true},
 surprised:{b:[-116,-115],eh:9,o:true},
 thoughtful:{b:[-109,-103],eh:5.5,mouth:'M-10 -50 L10 -52',look:[-3,-3]},
 determined:{b:[-99,-109],eh:5.2,mouth:'M-13 -50 Q0 -53 13 -50'}
};
function drawMan(m,t){
 const back=m.view==='back';
 m.hBack.style.display=back?'':'none';m.hFront.style.display=back?'none':'';
 m.front.style.display=back?'none':'';m.backRobe.style.display=back?'':'none';
 // walking
 let bob=0,lu=0,ru=0,sw=0;
 if(m.walk!==null&&m.walk!==undefined){const ph=m.walk*Math.PI*2;lu=Math.max(0,Math.sin(ph))*16;ru=Math.max(0,-Math.sin(ph))*16;bob=-Math.abs(Math.sin(ph))*7;sw=Math.sin(ph)*12;}
 tf(m.legL,-36,-lu);tf(m.legR,36,-ru);
 tf(m.body,0,bob);
 // arms
 for(const a of [m.armL,m.armR]){
  let u=a.u,f=a.f;
  if(a.front){if(m.body.lastChild!==a.up)m.body.appendChild(a.up);}else if(a.up.nextSibling===null||a.up.compareDocumentPosition(m.head)&Node.DOCUMENT_POSITION_PRECEDING){m.body.insertBefore(a.up,m.head);}
  if(a.ik){const r=ik(a.sx,a.sy,a.ik[0],a.ik[1],a.ik[2]||(-a.side));u=r[0];f=r[1];}
  if(m.walk!==null&&m.walk!==undefined&&!a.ik&&!a.lock){u+=a.side*sw*(a.side<0?1:-1);}
  tf(a.up,a.sx,a.sy,1,u);tf(a.fore,0,125,1,f);
 }
 // head
 const tilt=m.tilt||0;
 m.head.setAttribute('transform',`translate(0,-505) rotate(${tilt})`);
 if(!back){
  const E=EXPR[m.expr]||EXPR.neutral;const tr=m.turn||0;
  m.feat.setAttribute('transform',`translate(${tr*16},0)`);
  m.faceShape.setAttribute('rx',51-Math.abs(tr)*4);
  let blink=m.blink;
  m.eyes.forEach((e,i)=>{const s=e.s;const x=s*19+(tr*s>0?-tr*3:0);
   const far=(tr*s<0)?1-Math.abs(tr)*0.25:1;
   e.g.setAttribute('transform',`translate(${x},-92) scale(${far},${far})`);
   const eh=E.eh*(1-blink*0.9)*(E.asym&&s<0?1.1:1);
   e.w.setAttribute('ry',eh.toFixed(2));
   const lk=m.look||[0,0],el2=E.look||[0,0];
   e.p.setAttribute('cx',(lk[0]+el2[0]+tr*3).toFixed(2));e.p.setAttribute('cy',(lk[1]+el2[1]).toFixed(2));
   e.p.setAttribute('r',(E.o?4.2:4.8)*(blink>0.5?0:1));
   e.lid.setAttribute('d',`M-11 ${(-eh*0.35).toFixed(1)} Q0 ${(-eh*1.35).toFixed(1)} 11 ${(-eh*0.35).toFixed(1)}`);
  });
  const b=E.b;
  m.brows[0].setAttribute('d',`M-32 ${b[1]+2} Q-20 ${Math.min(b[0],b[1])-6} -7 ${b[0]}`);
  const bR=E.asym?[b[1]+4,b[1]+4]:b;
  m.brows[1].setAttribute('d',`M7 ${bR[0]} Q20 ${Math.min(bR[0],bR[1])-6} 32 ${bR[1]+2}`);
  if(E.o){const oy=8+(m.talk||0)*2;m.mouth.setAttribute('d',`M-7 -52 a7 ${oy} 0 1 0 14 0 a7 ${oy} 0 1 0 -14 0`);m.mouth.setAttribute('fill','#5A2A22');}
  else if(E.open){m.mouth.setAttribute('d',E.open);m.mouth.setAttribute('fill','#FFFFFF');}
  else if(m.talk>0.05){const o=3+m.talk*7;m.mouth.setAttribute('d',`M-12 -53 Q0 ${-53+o*1.6} 12 -53 Q0 ${-50} -12 -53 Z`);m.mouth.setAttribute('fill','#6B2E25');}
  else{m.mouth.setAttribute('d',E.mouth);m.mouth.setAttribute('fill','none');}
 }
}
function ik(sx,sy,tx,ty,bend){
 const a=125,b=130;let dx=tx-sx,dy=ty-sy;let d=Math.hypot(dx,dy);d=clamp(d,Math.abs(a-b)+1,a+b-1);
 const phi=Math.atan2(dy,dx);const al=Math.acos((a*a+d*d-b*b)/(2*a*d));
 const p1=phi+bend*al;const ex=sx+a*Math.cos(p1),ey=sy+a*Math.sin(p1);
 const p2=Math.atan2(ty-ey,tx-ex);
 const deg=x=>x*180/Math.PI;
 return [deg(p1)-90,deg(p2)-deg(p1)];
}

// ---------- PROPS ----------
function makeChest(parent){
 const c={root:G(parent)};
 c.glow=el('ellipse',{cx:0,cy:-200,rx:200,ry:60,fill:'url(#glowR)',opacity:0},c.root);
 H(c.root,`<ellipse cx="0" cy="4" rx="220" ry="22" fill="#000" opacity=".22"/>
  <rect x="-180" y="-200" width="360" height="200" rx="18" fill="url(#goldDark)"/>
  <rect x="-170" y="-190" width="340" height="180" rx="12" fill="url(#goldV)"/>
  <rect x="-180" y="-200" width="360" height="26" rx="10" fill="#8C6A30"/>
  <rect x="-140" y="-200" width="34" height="200" fill="#8C6A30"/><rect x="106" y="-200" width="34" height="200" fill="#8C6A30"/>
  <rect x="-136" y="-200" width="26" height="200" fill="#B99554"/><rect x="110" y="-200" width="26" height="200" fill="#B99554"/>
  <path d="M-170 -60 L170 -60" stroke="#A47F3E" stroke-width="3"/>
  <rect x="-34" y="-176" width="68" height="74" rx="10" fill="${C.NAVY}"/><circle cx="0" cy="-146" r="11" fill="${C.GOLDL}"/><path d="M-5 -142 L-8 -118 L8 -118 L5 -142 Z" fill="${C.GOLDL}"/>
  <circle cx="-158" cy="-18" r="6" fill="#F3E2B5"/><circle cx="158" cy="-18" r="6" fill="#F3E2B5"/>`);
 c.seam=el('rect',{x:-176,y:-206,width:352,height:10,rx:5,fill:'#FFF2C8',opacity:0},c.root);
 c.cavity=el('ellipse',{cx:0,cy:-200,rx:168,ry:26,fill:'#FFF3CC',opacity:0},c.root);
 c.lid=G(c.root);c.lidFront=H(c.lid,`<path d="M-182 0 L-182 -40 C-182 -120 182 -120 182 -40 L182 0 Z" fill="url(#goldDark)"/>
  <path d="M-170 -6 L-170 -40 C-170 -108 170 -108 170 -40 L170 -6 Z" fill="url(#goldG)"/>
  <path d="M-140 0 L-140 -86 L-106 -94 L-106 0Z M106 0 L106 -94 L140 -86 L140 0Z" fill="#8C6A30"/>
  <path d="M-136 0 L-136 -84 L-110 -90 L-110 0Z M110 0 L110 -90 L136 -84 L136 0Z" fill="#B99554"/>
  <path d="M-150 -60 Q0 -96 150 -60" stroke="#F6E7BF" stroke-width="4" fill="none" opacity=".7"/>
  <rect x="-24" y="-30" width="48" height="30" rx="6" fill="${C.NAVY}"/>`);
 c.lidIn=H(c.lid,`<path d="M-182 0 L-182 -40 C-182 -120 182 -120 182 -40 L182 0 Z" fill="#7A5A28"/><path d="M-166 0 L-166 -40 C-166 -106 166 -106 166 -40 L166 0 Z" fill="#FBE7B2" opacity=".85"/>`);
 return c;
}
function drawChest(c,open){ // open 0..1
 const a=open*Math.PI*0.82;const s=Math.cos(a);
 c.lid.setAttribute('transform',`translate(0,-200) scale(1,${Math.max(0.02,Math.abs(s)).toFixed(3)})`);
 c.lidFront.style.display=s>=0?'':'none';c.lidIn.style.display=s>=0?'none':'';op(c.cavity,clamp(open*2));
 if(s<0)c.lid.setAttribute('transform',`translate(0,${(-200-open*14).toFixed(1)}) scale(${(1-open*0.06).toFixed(3)},${Math.abs(s).toFixed(3)})`);
}
function makeBulb(parent){
 const b={root:G(parent)};
 b.halo=el('circle',{cx:0,cy:-40,r:190,fill:'url(#glowR)'},b.root);
 b.spin=G(b.root);
 H(b.spin,`<path d="M-62 -40 C-62 -112 62 -112 62 -40 C62 -2 34 14 30 44 L-30 44 C-34 14 -62 -2 -62 -40 Z" fill="#FFF6DD" stroke="#E7C67E" stroke-width="5"/>
  <path d="M-40 -60 C-40 -86 -18 -98 0 -98" stroke="#FFFFFF" stroke-width="8" fill="none" stroke-linecap="round" opacity=".9"/>
  <path d="M-14 40 L-14 2 Q-14 -30 0 -30 Q14 -30 14 2 L14 40" stroke="#D9A341" stroke-width="5" fill="none"/>
  <path d="M-14 -4 Q-7 -16 0 -4 Q7 8 14 -4" stroke="#F2B544" stroke-width="5" fill="none"/>
  <rect x="-32" y="44" width="64" height="14" rx="5" fill="url(#goldG)"/><rect x="-30" y="58" width="60" height="12" rx="5" fill="#B28C49"/><rect x="-28" y="70" width="56" height="12" rx="5" fill="url(#goldG)"/>
  <path d="M-14 82 L14 82 L6 96 L-6 96Z" fill="#7E5E2A"/>`);
 return b;
}
// villa: pieces build sequentially; door centred at x = doorX
function makeVilla(parent,opt={}){
 const v={root:G(parent),pieces:[]};
 const wire=G(v.root);v.wire=wire;
 const outl=['M-270 0 L270 0','M-230 -20 L-230 -150 L150 -150 L150 -20','M-150 -150 L-150 -285 L260 -285 L260 -150 L-150 -150','M150 -20 L150 -112 L250 -112 L250 -20'];
 v.wires=outl.map(d=>el('path',{d,stroke:C.GOLD,'stroke-width':3,fill:'none',pathLength:1,'stroke-dasharray':'1 1','stroke-dashoffset':1},wire));
 const pc=s=>{const g=H(v.root,s);v.pieces.push(g);return g;};
 pc(`<rect x="-280" y="-20" width="560" height="22" rx="4" fill="#D6C7AA"/><rect x="-280" y="-4" width="560" height="6" fill="#BFAE8E"/>`);
 pc(`<rect x="-232" y="-152" width="384" height="134" fill="#F6F0E5"/><rect x="100" y="-152" width="52" height="134" fill="#E7DDCC"/>`);
 v.glass1=el('rect',{x:-208,y:-134,width:250,height:100,rx:3,fill:'url(#glassG)'},pc(''));
 pc(`<rect x="150" y="-114" width="102" height="96" fill="#ECE3D3"/><rect x="162" y="-100" width="78" height="70" fill="#D9CDB7"/><path d="M162 -86 H240 M162 -72 H240 M162 -58 H240 M162 -44 H240" stroke="#C7B898" stroke-width="2"/>`);
 pc(`<rect x="-152" y="-272" width="414" height="122" fill="#FBF7F0"/><rect x="-152" y="-160" width="414" height="10" fill="#E5DACA"/>`);
 const up=pc(`<g id="slats"></g>`);
 v.glass2=el('rect',{x:-126,y:-254,width:176,height:84,rx:3,fill:'url(#glassG)'},up);
 H(up,`<rect x="80" y="-254" width="152" height="84" fill="#A8774F"/>${[0,1,2,3,4,5,6,7,8].map(i=>`<rect x="${86+i*16.5}" y="-254" width="7" height="84" fill="#8A5E3B"/>`).join('')}`);
 pc(`<rect x="-172" y="-290" width="440" height="20" rx="3" fill="${C.NAVY}"/><rect x="-172" y="-272" width="440" height="4" fill="${C.GOLD}"/>`);
 pc(`<rect x="-152" y="-152" width="414" height="5" fill="${C.GOLD}"/>`);
 const dx=opt.doorX!==undefined?opt.doorX:72;
 v.door=pc(`<rect x="${dx-30}" y="-136" width="60" height="116" rx="3" fill="#7B5236"/><rect x="${dx-30}" y="-136" width="60" height="116" rx="3" fill="none" stroke="${C.GOLD}" stroke-width="3"/><rect x="${dx+16}" y="-92" width="5" height="26" rx="2" fill="${C.GOLDL}"/>`);
 v.doorGlow=el('rect',{x:dx-30,y:-136,width:60,height:116,rx:3,fill:'url(#litG)',opacity:0},v.door);
 pc(`<circle cx="-252" cy="-30" r="26" fill="${C.GREEN}"/><circle cx="-226" cy="-24" r="18" fill="#6A855A"/><circle cx="262" cy="-28" r="22" fill="${C.GREEN}"/>
   <rect x="-262" y="-170" width="8" height="150" fill="#8B6A48"/><path d="M-258 -170 q-40 -10 -60 18 M-258 -170 q40 -12 62 14 M-258 -170 q-20 -30 -50 -30 M-258 -170 q22 -32 52 -26 M-258 -170 q0 -30 4 -44" stroke="#5E7C4F" stroke-width="12" fill="none" stroke-linecap="round"/>`);
 v.lit1=el('rect',{x:-208,y:-134,width:250,height:100,rx:3,fill:'url(#litG)',opacity:0},v.root);
 v.lit2=el('rect',{x:-126,y:-254,width:176,height:84,rx:3,fill:'url(#litG)',opacity:0},v.root);
 H(v.root,`<path d="M-200 -128 L-150 -40 M-120 -128 L-80 -60" stroke="#fff" stroke-width="6" opacity=".18"/><path d="M-118 -248 L-80 -180" stroke="#fff" stroke-width="6" opacity=".18"/>`);
 return v;
}
function drawVilla(v,build,lit=0,wire=true){
 v.wires.forEach((w,i)=>{const p=P(build,i*0.06,0.3+i*0.06);w.setAttribute('stroke-dashoffset',(1-eio(p)).toFixed(3));op(w,wire?(1-P(build,0.85,1)):0);});
 const N=v.pieces.length;
 v.pieces.forEach((g,i)=>{const p=eo(P(build,0.2+i*0.6/N,0.2+i*0.6/N+0.18));op(g,p);g.setAttribute('transform',`translate(0,${((1-p)*-26).toFixed(1)})`);});
 op(v.lit1,lit*P(build,.8,1));op(v.lit2,lit*P(build,.8,1));
}
function makeApartment(parent){
 const g=G(parent);
 let w='';for(let r=0;r<9;r++)for(let c=0;c<4;c++)w+=`<rect x="${-92+c*47}" y="${-440+r*46}" width="32" height="30" rx="2" fill="${(r*3+c)%5===0?'#F2CF86':'url(#glassG)'}"/>`;
 H(g,`<rect x="-118" y="-470" width="236" height="470" fill="#E8DDCB"/><rect x="60" y="-470" width="58" height="470" fill="#D9CCB4"/>${w}
  ${[0,1,2,3,4,5,6,7,8].map(r=>`<rect x="-104" y="${-408+r*46}" width="208" height="5" fill="#CDBFA5"/>`).join('')}
  <rect x="-126" y="-486" width="252" height="18" fill="${C.NAVY}"/><rect x="-126" y="-470" width="252" height="4" fill="${C.GOLD}"/>
  <rect x="-30" y="-56" width="60" height="56" fill="#7B5236"/><rect x="-140" y="-4" width="280" height="8" fill="#CBB993"/>`);
 return g;
}
function makeCommercial(parent){
 const g=G(parent);
 H(g,`<rect x="-150" y="-330" width="300" height="330" fill="url(#glassG)"/>${[0,1,2,3,4,5].map(i=>`<rect x="${-150+i*50}" y="-330" width="4" height="330" fill="#9DB3CC" opacity=".55"/>`).join('')}
  ${[0,1,2,3,4].map(i=>`<rect x="-150" y="${-330+i*58}" width="300" height="4" fill="#9DB3CC" opacity=".45"/>`).join('')}
  <path d="M-150 -330 L-40 -330 L-150 -170Z" fill="#fff" opacity=".12"/>
  <rect x="-166" y="-346" width="332" height="18" fill="${C.NAVY}"/><rect x="-166" y="-100" width="332" height="100" fill="#EFE6D6"/>
  <rect x="-166" y="-112" width="332" height="16" fill="${C.GOLD}"/><rect x="-60" y="-138" width="120" height="22" rx="4" fill="${C.NAVY}"/><rect x="-46" y="-131" width="92" height="7" rx="3" fill="${C.GOLDL}"/>
  <rect x="-140" y="-84" width="120" height="84" fill="url(#litG)" opacity=".85"/><rect x="20" y="-84" width="120" height="84" fill="url(#litG)" opacity=".85"/><rect x="-10" y="-84" width="20" height="84" fill="#7B5236"/>`);
 return g;
}
function makeLand(parent){
 const g=G(parent);
 H(g,`<path d="M-230 0 L-150 -120 L230 -120 L170 0 Z" fill="#D8C49A"/><path d="M-200 -14 L-140 -106 L210 -106 L160 -14 Z" fill="#C9B47F"/>
  <path d="M-200 -14 L-140 -106 L210 -106 L160 -14 Z" fill="none" stroke="${C.GOLD}" stroke-width="4" stroke-dasharray="14 10"/>
  ${[[-200,-14],[-140,-106],[210,-106],[160,-14]].map(p=>`<rect x="${p[0]-3}" y="${p[1]-46}" width="6" height="48" fill="#7B5236"/><path d="M${p[0]+3} ${p[1]-46} l26 8 l-26 8z" fill="${C.COPPER}"/>`).join('')}
  <circle cx="-40" cy="-60" r="6" fill="#9DAA72"/><circle cx="60" cy="-80" r="5" fill="#9DAA72"/><circle cx="90" cy="-40" r="7" fill="#9DAA72"/>`);
 return g;
}
function makeBlueprint(parent){
 const b={root:G(parent)};
 let grid='';for(let i=-5;i<=5;i++)grid+=`<path d="M${i*40} -150 V150" stroke="#9EB8DB" stroke-width="1" opacity=".35"/>`;for(let i=-3;i<=3;i++)grid+=`<path d="M-210 ${i*40} H210" stroke="#9EB8DB" stroke-width="1" opacity=".35"/>`;
 H(b.root,`<rect x="-220" y="-160" width="440" height="320" rx="10" fill="url(#bpG)"/>${grid}<rect x="-220" y="-160" width="440" height="320" rx="10" fill="none" stroke="${C.GOLD}" stroke-width="4"/>`);
 const lines=['M-170 110 L-170 -110 L60 -110 L60 -30 L170 -30 L170 110 Z','M-170 0 L-40 0 L-40 110','M-40 -110 L-40 -50','M60 -30 L60 40 L170 40','M-110 -110 L-110 -60 M-170 -60 L-130 -60','M-20 110 A40 40 0 0 1 20 70'];
 b.lines=lines.map(d=>el('path',{d,stroke:'#F4EBD6','stroke-width':4,fill:'none',pathLength:1,'stroke-dasharray':'1 1','stroke-dashoffset':1,'stroke-linejoin':'round'},b.root));
 return b;
}
function drawBlueprint(b,p){b.lines.forEach((l,i)=>l.setAttribute('stroke-dashoffset',(1-eio(P(p,i*0.1,0.45+i*0.1))).toFixed(3)));}
function makePortfolio(parent){
 return H(parent,`<rect x="-80" y="-104" width="160" height="208" rx="12" fill="${C.NAVY}"/><rect x="-80" y="-104" width="22" height="208" rx="8" fill="${C.NAVY2}"/>
  <rect x="-66" y="-92" width="140" height="184" rx="8" fill="none" stroke="${C.GOLD}" stroke-width="3"/><circle cx="8" cy="-10" r="26" fill="none" stroke="${C.GOLD}" stroke-width="4"/>
  <path d="M-6 -6 L8 -22 L22 -6 L22 8 L-6 8 Z" fill="${C.GOLD}"/><rect x="-28" y="40" width="72" height="6" rx="3" fill="${C.GOLD}"/><rect x="-18" y="54" width="52" height="5" rx="2.5" fill="${C.GOLD}" opacity=".7"/>`);
}
function makeKey(parent){
 return H(parent,`<circle cx="0" cy="-70" r="42" fill="url(#goldG)" stroke="#9A773A" stroke-width="4"/><circle cx="0" cy="-70" r="17" fill="none" stroke="#9A773A" stroke-width="5"/>
  <path d="M0 -112 L10 -96 L0 -86 L-10 -96Z" fill="#F7E8C0"/>
  <rect x="-9" y="-30" width="18" height="150" rx="6" fill="url(#goldG)" stroke="#9A773A" stroke-width="3"/>
  <path d="M9 70 h26 v14 h-12 v12 h14 v14 h-28 Z" fill="url(#goldG)" stroke="#9A773A" stroke-width="3"/>
  <rect x="-16" y="-34" width="32" height="10" rx="4" fill="#B28C49"/>`);
}
function makeTablet(parent){
 const t={root:G(parent)};
 H(t.root,`<rect x="-120" y="-84" width="240" height="168" rx="18" fill="#1A2638"/><rect x="-108" y="-72" width="216" height="144" rx="8" fill="#22324A"/>`);
 t.screen=H(t.root,`<rect x="-108" y="-72" width="216" height="144" rx="8" fill="#EAF0F7"/><rect x="-96" y="-60" width="92" height="64" rx="6" fill="url(#glassG)"/><rect x="6" y="-60" width="90" height="64" rx="6" fill="#D8C49A"/>
  <rect x="-96" y="14" width="192" height="10" rx="5" fill="${C.GOLD}"/><rect x="-96" y="32" width="130" height="8" rx="4" fill="#B9C6D6"/><rect x="-96" y="48" width="90" height="8" rx="4" fill="#B9C6D6"/>`);
 return t;
}
function makeEnvelope(parent){
 const e={root:G(parent)};
 e.card=H(e.root,`<rect x="-120" y="-90" width="240" height="150" rx="10" fill="#FFFFFF" stroke="${C.GOLD}" stroke-width="3"/><circle cx="0" cy="-40" r="26" fill="none" stroke="${C.GOLD}" stroke-width="4"/><path d="M-6 -50 a8 8 0 1 1 12 0 l-2 4 v18 h-8 v-18 z" fill="${C.GOLD}"/><rect x="-60" y="0" width="120" height="8" rx="4" fill="${C.GOLDL}"/><rect x="-40" y="16" width="80" height="6" rx="3" fill="${C.BEIGED}"/>`);
 H(e.root,`<rect x="-150" y="-20" width="300" height="180" rx="12" fill="#F6EEDF"/><path d="M-150 -14 L0 86 L150 -14 L150 160 L-150 160 Z" fill="#EFE3CD"/><path d="M-150 160 L-20 60 M150 160 L20 60" stroke="#E1D2B5" stroke-width="3"/>`);
 e.flap=G(e.root,{});e.flapIn=H(e.flap,`<path d="M-150 0 L0 -110 L150 0 Z" fill="#E6D7BB"/>`);
 e.flapOut=H(e.flap,`<path d="M-150 0 L0 100 L150 0 Z" fill="#F1E6D2" stroke="#E1D2B5" stroke-width="2"/><circle cx="0" cy="84" r="24" fill="${C.COPPER}"/><circle cx="0" cy="84" r="16" fill="none" stroke="#E9B08E" stroke-width="3"/>`);
 return e;
}
function drawEnvelope(e,open,card){
 const s=Math.cos(open*Math.PI);
 e.flap.setAttribute('transform',`translate(0,-20) scale(1,${Math.max(.02,Math.abs(s)).toFixed(3)})`);
 e.flapOut.style.display=s>=0?'':'none';e.flapIn.style.display=s>=0?'none':'';
 e.card.setAttribute('transform',`translate(0,${(40-card*110).toFixed(1)})`);
}
const ICON={
 phone:`<path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/>`,
 mail:`<path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm9 7.2L4.2 7v.1L12 12.4l7.8-5.3V7z"/>`,
 globe:`<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm6.9 6h-3a15.7 15.7 0 0 0-1.4-3.6A8 8 0 0 1 18.9 8zM12 4a14 14 0 0 1 1.9 4h-3.8A14 14 0 0 1 12 4zM4.3 14a8.2 8.2 0 0 1 0-4h3.4a16.5 16.5 0 0 0 0 4zm.8 2h3a15.7 15.7 0 0 0 1.4 3.6A8 8 0 0 1 5.1 16zm3-8h-3a8 8 0 0 1 4.4-3.6A15.7 15.7 0 0 0 8.1 8zM12 20a14 14 0 0 1-1.9-4h3.8A14 14 0 0 1 12 20zm2.3-6H9.7a14.7 14.7 0 0 1 0-4h4.6a14.7 14.7 0 0 1 0 4zm.3 5.6A15.7 15.7 0 0 0 16 16h3a8 8 0 0 1-4.4 3.6zM16.3 14a16.5 16.5 0 0 0 0-4h3.4a8.2 8.2 0 0 1 0 4z"/>`,
 pin:`<path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/>`
};
function iconSVG(name,size,color){return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}">${ICON[name]}</svg>`;}
