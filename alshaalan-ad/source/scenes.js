const S=document.getElementById('S'),TOP=document.getElementById('TOP'),TL=document.getElementById('TL');
defs(S);
H(S,`<defs>
<radialGradient id="bg1" cx="540" cy="1050" r="1250" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#2F5080"/><stop offset=".5" stop-color="#1D3556"/><stop offset="1" stop-color="#132640"/></radialGradient>
<linearGradient id="bg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBF8F2"/><stop offset=".7" stop-color="#F1E7D6"/><stop offset="1" stop-color="#E6D7BE"/></linearGradient>
<linearGradient id="bg3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22416B"/><stop offset=".33" stop-color="#456A97"/><stop offset=".6" stop-color="#AEBBCB"/><stop offset=".8" stop-color="#EBD1A6"/></linearGradient>
<linearGradient id="bg5" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#CFDDEB"/><stop offset=".55" stop-color="#EEF0EE"/><stop offset="1" stop-color="#F7EEDD"/></linearGradient>
<linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4EDE1"/><stop offset="1" stop-color="#E8DCC7"/></linearGradient>
<linearGradient id="winSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BFD3E8"/><stop offset="1" stop-color="#F3E5CB"/></linearGradient>
<linearGradient id="frameSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E3ECF5"/><stop offset="1" stop-color="#F8F1E4"/></linearGradient>
<linearGradient id="barG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFF4D2" stop-opacity="0"/><stop offset=".5" stop-color="#FFF4D2"/><stop offset="1" stop-color="#FFF4D2" stop-opacity="0"/></linearGradient>
<linearGradient id="shineG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<clipPath id="logoClipA"><rect id="lcA" x="0" y="0" width="1080" height="1920"/></clipPath>
<clipPath id="logoClipB"><rect id="lcB" x="0" y="0" width="1080" height="1920"/></clipPath>
<mask id="logoMask" mask-type="alpha"><image href="logo.png" x="0" y="0" width="1405" height="385"/></mask>
</defs>`);
const LW=1405,LH=385;
function cam(g,cx,cy,s,dx=0,dy=0){g.setAttribute('transform',`translate(${(cx+dx).toFixed(2)},${(cy+dy).toFixed(2)}) scale(${s.toFixed(4)}) translate(${-cx},${-cy})`);}
function blinkV(t,seed){const per=3.1+seed*0.7;const x=((t+seed*1.3)%per);return x<0.16?Math.sin(x/0.16*Math.PI):0;}
function vis(g,t,a,b,fi=0.3,fo=0.3){const o=Math.min(P(t,a,a+fi),1-P(t,b-fo,b));op(g,(fi===0&&t>=a?1:1)*o);return o>0.002;}
// ---------------- TEXT SYSTEM ----------------
const texts=[];
function T(str,o){const d=document.createElement('div');d.className='t '+(o.font||'alex')+' '+(o.cls||'');d.style.top=o.y+'px';d.style.fontSize=o.size+'px';d.style.fontWeight=o.w||800;
 const words=o.raw?[str]:str.split(' ');d.innerHTML=(o.wrap?o.wrap[0]:'')+words.map(w=>`<span class="w ${o.color||'navy'}">${w}</span>`).join(' ')+(o.wrap?o.wrap[1]:'');
 TL.appendChild(d);const r={d,spans:[...d.querySelectorAll('.w')],o};texts.push(r);return r;}
function drawTexts(t){for(const r of texts){const o=r.o;const od=o.outDur||0.45;if(t<o.tin-0.02||t>o.tout+od){r.d.style.display='none';continue;}r.d.style.display='';
 const q=eio(P(t,o.tout,o.tout+od));const st=o.st===undefined?0.13:o.st;
 r.spans.forEach((s,i)=>{const p=P(t,o.tin+i*st,o.tin+i*st+(o.dur||0.6));const pe=eo(p);
  let sc=o.pop?lerp(0.55,1,eback(p)):1;sc*=1+(o.outScale||0)*q;
  const ty=(1-pe)*(o.dy===undefined?44:o.dy)-q*(o.outScale?0:28);
  s.style.opacity=(Math.min(1,pe*1.2)*(1-q)).toFixed(3);s.style.transform=`translateY(${ty.toFixed(1)}px) scale(${sc.toFixed(3)})`;
  const bl=(1-pe)*9+q*7;s.style.filter=(bl>0.2?`blur(${bl.toFixed(1)}px)`:'')+(o.cls&&o.cls.includes('gshadow')?' drop-shadow(0 4px 10px rgba(10,20,40,.35))':'');
 });}}
// ---------------- PARTICLES ----------------
const dustG=G(S);const dust=[];{const r=rnd(7);for(let i=0;i<34;i++){dust.push({x:r()*1080,y:r()*1920,sp:20+r()*45,ph:r()*6.28,s:1.5+r()*3.5,e:el('circle',{r:1,fill:'#F4DFA8'},dustG)});}}
function drawDust(t,amt,col){dust.forEach((d,i)=>{const y=((d.y-t*d.sp)%1920+1920)%1920;const x=d.x+Math.sin(t*0.6+d.ph)*26;d.e.setAttribute('cx',x.toFixed(1));d.e.setAttribute('cy',y.toFixed(1));d.e.setAttribute('r',d.s);d.e.setAttribute('fill',col);op(d.e,amt*(0.35+0.65*Math.abs(Math.sin(t*1.7+d.ph))));});}

// =============== SCENE 1: TREASURE ===============
const s1=G(S),s1c=G(s1);
H(s1c,`<rect width="1080" height="1920" fill="url(#bg1)"/>
<g stroke="#C9A86A" stroke-opacity=".10" fill="none" stroke-width="2"><circle cx="540" cy="1050" r="380"/><circle cx="540" cy="1050" r="560"/><circle cx="540" cy="1050" r="760"/>
<path d="M540 0 V1920 M0 1050 H1080 M0 380 L1080 1720 M1080 380 L0 1720"/></g>
<ellipse cx="540" cy="1300" rx="520" ry="90" fill="#0B1729" opacity=".35"/>`);
const rays1=G(s1c);for(let i=0;i<11;i++)el('path',{d:'M-10 0 L-70 -1100 L70 -1100 L10 0 Z',fill:'url(#rayG)',transform:`rotate(${-55+i*11})`},rays1);
const chest=makeChest(G(s1c));
const orb=G(s1c);el('circle',{r:120,fill:'url(#glowR)'},orb);el('circle',{r:26,fill:'#FFF8E4'},orb);
const bulbW=G(s1c);const bulb=makeBulb(bulbW);
const villa1W=G(s1c);const plat1=H(villa1W,`<ellipse cx="0" cy="10" rx="330" ry="70" fill="url(#glowR)" opacity=".7"/><ellipse cx="0" cy="8" rx="300" ry="34" fill="url(#goldDark)"/><ellipse cx="0" cy="0" rx="300" ry="30" fill="url(#goldG)"/>`);
const villa1=makeVilla(G(villa1W));
const c1=makeMan(G(s1c));
T('الكنز ثروة...',{y:150,size:104,color:'gold',cls:'gshadow',tin:0.45,tout:8.25,st:0.18});
T('والثروة فكرة!',{y:290,size:104,color:'gold',cls:'gshadow',tin:2.0,tout:8.25,st:0.18});
T('فكرة واحدة قد تصنع مستقبلاً عقارياً.',{y:445,size:46,w:500,font:'plex',color:'ivory',tin:4.3,tout:8.25,st:0.08});
function drawS1(t){
 const cs=1+0.10*eio(P(t,0,2.6))-0.10*eio(P(t,4.4,6.2));cam(s1c,540,1100,cs);
 const ap=eback(P(t,0.05,1.0));tf(chest.root,540,1270+Math.sin(t*2)*3,1.22*lerp(.6,1,ap),Math.sin(t*38)*1.3*P(t,1.5,2.15)*(1-P(t,2.15,2.25)));op(chest.root,P(t,0.05,0.5));
 drawChest(chest,eo(P(t,2.2,2.7)));
 op(chest.seam,P(t,1.1,2.1)*(1-P(t,2.2,2.4)));op(chest.glow,P(t,1.2,2.2)+0.0);
 const burst=P(t,2.25,2.9);tf(rays1,540,1030,lerp(.2,1,eo(burst)),Math.sin(t*0.4)*6);op(rays1,eo(burst)*(1-0.55*P(t,3.6,5.5))*(1-P(t,7.6,8.4)));
 const ob=eio(P(t,2.45,3.5));tf(orb,540,lerp(1000,680,ob),lerp(.4,1.15,ob)*(1+0.08*Math.sin(t*9)));op(orb,P(t,2.4,2.6)*(1-P(t,3.5,3.9)));
 tf(bulbW,540,690,1.45*lerp(.5,1,eback(P(t,3.35,3.9)))*(1-0.6*P(t,5.0,5.5)));op(bulbW,P(t,3.35,3.6)*(1-P(t,5.0,5.5)));
 const spin=P(t,3.7,5.0);bulb.spin.setAttribute('transform',`scale(${Math.cos(eio(spin)*Math.PI*2).toFixed(3)},1)`);
 op(bulb.halo,0.7+0.3*Math.sin(t*6));
 tf(villa1W,540,860+Math.sin(t*1.8)*6,0.86);op(villa1W,P(t,5.0,5.3));drawVilla(villa1,P(t,5.05,6.7),P(t,6.6,7.3));op(plat1,P(t,5.0,5.4));
 // character
 const ent=eio(P(t,5.4,6.4));tf(c1.root,lerp(1250,840,ent),1890,0.92);c1.walk=ent<1&&ent>0?(t-5.4)*1.8:null;
 c1.turn=-0.45;c1.expr=t<6.35?'curious':(t<7.6?'surprised':'smile');c1.blink=blinkV(t,0.2);c1.look=[-3,-2];
 const ra=eo(P(t,6.3,6.8));c1.armL.ik=ra>0?[lerp(-110,-170,ra),lerp(-330,-640,ra),1]:null;c1.armL.u=8;c1.armR.u=-7;c1.tilt=-4*ra;
 drawMan(c1,t);
}
// =============== SCENE 2: IDEA -> DECISION ===============
const s2=G(S),s2c=G(s2);
{let sk='';const r=rnd(3);let x=-20;while(x<1100){const w=60+r()*110,h=120+r()*300;sk+=`<rect x="${x}" y="${1500-h}" width="${w}" height="${h}" fill="#E7DAC4"/>`;x+=w+8;}
H(s2c,`<rect width="1080" height="1920" fill="url(#bg2)"/><circle cx="830" cy="520" r="190" fill="#F2DDAE" opacity=".45"/><circle cx="830" cy="520" r="120" fill="#F0D59C" opacity=".35"/>
${sk}<rect x="0" y="1500" width="1080" height="420" fill="#E8DCC6"/><rect x="0" y="1500" width="1080" height="6" fill="#D9C8AA"/>
<g stroke="#C9A86A" stroke-opacity=".18" stroke-width="2"><path d="M540 1506 L-200 1920 M540 1506 L1280 1920 M540 1506 L300 1920 M540 1506 L780 1920"/></g>
<ellipse cx="540" cy="1852" rx="240" ry="34" fill="#C7B28C" opacity=".35"/>`);}
const orbBack=G(s2c);
const c2=makeMan(G(s2c));
const orbFront=G(s2c);
const bubble=G(s2c);
const bubSmall=[el('circle',{cx:690,cy:965,r:18,fill:'#FFFFFF',filter:'url(#shadow)'},s2c),el('circle',{cx:735,cy:895,r:30,fill:'#FFFFFF',filter:'url(#shadow)'},s2c)];
const bubBig=H(bubble,`<g filter="url(#shadow)" fill="#FFFFFF">${[[0,0,215],[-195,40,150],[195,40,150],[-110,-120,145],[115,-120,150],[0,125,160],[-240,-40,110],[240,-40,110],[-150,140,110],[150,140,110]].map(c=>`<circle cx="${c[0]}" cy="${c[1]}" r="${c[2]}"/>`).join('')}</g>`);
const bubIn=G(bubble);
const minis=[];{const mk=[g=>{const v=makeVilla(g);drawVilla(v,1,1,false);return 0.34;},g=>{makeApartment(g);return 0.36;},g=>{makeLand(g);return 0.5;},g=>{makeCommercial(g);return 0.42;}];
 mk.forEach((f,i)=>{const w=G(bubIn);const inner=G(w);const s=f(inner);minis.push({w,inner,s,base:[[-120,-30],[130,-30],[-120,160],[130,150]][i]});});}
const bp2=makeBlueprint(G(bubble));
const port2=G(c2.root);makePortfolio(port2);
T('واعي',{y:110,size:130,color:'navy',tin:8.95,tout:10.35,outDur:0.3,pop:true});
T('راعي',{y:110,size:130,color:'gold',cls:'gshadow',tin:10.45,tout:11.45,outDur:0.3,pop:true});
T('راعي عقار ورأي',{y:120,size:108,color:'gold',cls:'gshadow',tin:11.55,tout:16.55,st:0.2});
T('الفكرة بداية... والاختيار يصنع الفرق.',{y:282,size:48,w:600,font:'plex',color:'navy',tin:13.6,tout:16.55,st:0.08});
function drawS2(t){
 cam(s2c,540,1000,1+0.04*P(t,8.9,17));
 tf(c2.root,540,1855,1.2);c2.walk=null;c2.turn=0;c2.blink=blinkV(t,0.6);
 c2.expr=t<11.5?'thoughtful':(t<13.3?'curious':(t<15.1?'smile':'happy'));
 // arms
 const chin=eo(P(t,9.0,9.6))*(1-eo(P(t,14.8,15.3)));
 const hold=eo(P(t,14.9,15.5));
 if(hold>0){c2.armL.ik=[lerp(-60,-70,hold),lerp(-505,-330,hold),1];}else c2.armL.ik=chin>0.01?[lerp(-118,-14,chin),lerp(-240,-512,chin),1]:null;
 c2.armL.u=7;c2.armL.front=chin>0.3&&hold<0.5;
 const pt=eo(P(t,13.1,13.6))*(1-eo(P(t,14.5,15.0)));c2.armR.ik=pt>0.01?[lerp(118,250,pt),lerp(-240,-760,pt),-1]:null;c2.armR.u=-7;
 c2.tilt=-5*chin+3*pt;
 // bubble
 const bIn=eback(P(t,9.45,10.0)),bOut=P(t,10.8,11.15),bBack=eback(P(t,12.55,12.95)),toPort=eio(P(t,14.6,15.35));
 op(bubSmall[0],P(t,9.15,9.3)*(1-P(t,14.6,14.9)));op(bubSmall[1],P(t,9.3,9.45)*(1-P(t,14.6,14.9)));
 const bs=(t<12.5?lerp(.2,1,bIn)*(1-0.25*bOut):lerp(.75,1,bBack));
 const bx=lerp(560,540-65*1.2,toPort),by=lerp(640,1855-330*1.2,toPort);
 tf(bubble,bx,by,bs*lerp(1,0.12,toPort));op(bubble,P(t,9.45,9.6)*(1-0.0)*(t<12.5?(1-bOut):1)*(1-P(t,15.1,15.4)));
 op(bubBig,1);
 // minis: grid in bubble -> orbit -> converge
 const orbT=P(t,10.75,11.3),conv=eio(P(t,12.5,13.05));
 minis.forEach((m,i)=>{const pin=eback(P(t,10.0+i*0.12,10.45+i*0.12));
  const ang=i*Math.PI/2+(t-10.75)*2.1;const ox=540+410*Math.cos(ang),oy=930+150*Math.sin(ang);const depth=Math.sin(ang);
  // positions in world
  const gx=560+m.base[0]*bs,gy=640+m.base[1]*bs;
  let x=lerp(gx,ox,eio(orbT)),y=lerp(gy,oy,eio(orbT));let sc=lerp(m.s*bs,m.s*1.15*(1+0.18*depth),eio(orbT))*pin;
  x=lerp(x,560,conv);y=lerp(y,640,conv);sc*=(1-conv);
  const layer=(orbT>0.5&&depth>0)?orbFront:orbBack;if(m.w.parentNode!==layer)layer.appendChild(m.w);
  if(orbT<=0.5&&m.w.parentNode!==bubIn&&t<11){bubIn.appendChild(m.w);}
  if(m.w.parentNode===bubIn){tf(m.w,m.base[0],m.base[1],m.s*pin);}else tf(m.w,x,y,sc);
  op(m.w,P(t,10.0+i*0.12,10.15+i*0.12)*(1-P(t,12.85,13.05)));
  if(i===0)c2.look=[clamp((x-540)/80,-3.5,3.5),clamp((y-900)/80,-3,2)];
 });
 if(t>12.5)c2.look=[0,-3];
 const bpI=eback(P(t,12.85,13.3));tf(bp2.root,0,10,0.95*bpI);op(bp2.root,P(t,12.85,13.0));drawBlueprint(bp2,P(t,13.0,14.3));
 tf(port2,-70,-345,lerp(.3,1,eback(P(t,15.1,15.5))),-6);op(port2,P(t,15.1,15.25));
 drawMan(c2,t);
}
// =============== SCENE 3: DETERMINATION BRIDGE ===============
const s3=G(S),s3c=G(s3);
H(s3c,`<rect width="1080" height="1920" fill="url(#bg3)"/>
<circle cx="540" cy="760" r="420" fill="#FFE9BE" opacity=".18" filter="url(#blur20)"/>`);
const clouds3=G(s3c);const cl3=[];{const r=rnd(11);for(let i=0;i<9;i++){const c=el('ellipse',{rx:120+r()*140,ry:26+r()*20,fill:'#FFFFFF',opacity:(.18+r()*.2).toFixed(2)},clouds3);cl3.push({e:c,x:r()*1080,y:1020+r()*480,sp:8+r()*16});}}
H(s3c,`<path d="M190 870 L890 870 L850 920 Q720 1040 540 1075 Q360 1040 230 920 Z" fill="#B99A6E"/><path d="M190 862 L890 862 L882 884 L198 884 Z" fill="#E4CFA6"/>
<path d="M300 960 Q540 1000 780 960" stroke="#9E8058" stroke-width="5" fill="none" opacity=".5"/>`);
const villa3W=G(s3c);const villa3=makeVilla(G(villa3W));drawVilla(villa3,1,0,false);
const doorGlow3=el('ellipse',{cx:540,cy:800,rx:150,ry:120,fill:'url(#glowR)',opacity:0},s3c);
const bridge=G(s3c);const BN=16;const bY=u=>1572-690*Math.pow(u,0.82);const bW=u=>lerp(185,52,u);
const planks=[];for(let i=0;i<BN;i++){const u0=i/BN,u1=(i+0.82)/BN;const pl=el('path',{d:`M${540-bW(u0)} ${bY(u0)} L${540+bW(u0)} ${bY(u0)} L${540+bW(u1)} ${bY(u1)} L${540-bW(u1)} ${bY(u1)} Z`,fill:i%2?'#D7B676':'#E3C68A',stroke:'#A88446','stroke-width':2},bridge);planks.push(pl);}
const railD=s=>{let d='';for(let k=0;k<=30;k++){const u=k/30;d+=(k?'L':'M')+(540+s*bW(u)).toFixed(1)+' '+(bY(u)-lerp(70,22,u)).toFixed(1);}return d;};
const rails=[-1,1].map(s=>el('path',{d:railD(s),stroke:'url(#goldG)','stroke-width':9,fill:'none','stroke-linecap':'round',pathLength:1,'stroke-dasharray':'1 1','stroke-dashoffset':1},bridge));
const posts=[];for(let k=0;k<=8;k++){const u=k/8;for(const s of [-1,1]){posts.push({u,e:el('path',{d:`M${540+s*bW(u)} ${bY(u)} L${540+s*bW(u)} ${bY(u)-lerp(70,22,u)}`,stroke:'#B8924E','stroke-width':lerp(8,4,u)},bridge)});}}
const bridgeGlow=el('path',{d:`M${540-185} 1572 L${540+185} 1572 L${540+52} 882 L${540-52} 882 Z`,fill:'#FFE7AE',opacity:0,filter:'url(#blur20)'},bridge);bridge.insertBefore(bridgeGlow,bridge.firstChild);
const pebbles=[];for(let i=0;i<4;i++)pebbles.push(el('circle',{r:6+i%2*3,fill:'#9E8058'},s3c));
H(s3c,`<path d="M0 1566 L1080 1566 L1080 1920 L0 1920 Z" fill="#D5BC92"/><path d="M0 1560 Q270 1572 540 1566 Q810 1560 1080 1568 L1080 1590 L0 1590 Z" fill="#B39468"/>
<path d="M0 1590 L1080 1590 L1080 1600 L0 1600Z" fill="#E6D2AE"/>
<g stroke="#C4A77B" stroke-width="2" opacity=".5"><path d="M540 1600 L-300 1920 M540 1600 L1380 1920 M540 1600 L260 1920 M540 1600 L820 1920"/></g>`);
const bp3=makeBlueprint(G(s3c,{transform:'translate(210,1745) rotate(-8) scale(.42,.3)'}));drawBlueprint(bp3,1);
const bulb3W=G(s3c,{transform:'translate(190,1660) scale(.45)'});makeBulb(bulb3W);
const c3=makeMan(G(s3c));c3.view='back';
T('العزيمة تصنع الفرق',{y:150,size:92,color:'gold',cls:'gshadow',tin:19.25,tout:22.45,st:0.18});
const azW=T('العزيمة!',{y:1110,size:190,color:'gold',cls:'gshadow',tin:21.0,tout:21.95,st:0,pop:true,outScale:.5,outDur:.5,dur:.5});
T('إذا كنت ذا رأي فكن ذا عزيمة',{y:138,size:64,w:700,color:'ivory',tin:22.7,tout:27.45,st:0.14});
const rule=document.createElement('div');rule.style.cssText='position:absolute;left:340px;width:400px;top:250px;height:24px;display:flex;align-items:center;justify-content:center;gap:14px';rule.innerHTML='<div style="flex:1;height:2px;background:linear-gradient(90deg,transparent,#E3C98F)"></div><div style="width:14px;height:14px;background:#E3C98F;transform:rotate(45deg)"></div><div style="flex:1;height:2px;background:linear-gradient(90deg,#E3C98F,transparent)"></div>';TL.appendChild(rule);
T('فإن فساد الرأي أن تترددا',{y:282,size:64,w:700,color:'gold',cls:'gshadow',tin:24.95,tout:27.45,st:0.14});
function drawS3(t){
 cam(s3c,540,1250,1.0+0.05*P(t,16.8,27.9),0,0);
 cl3.forEach(c=>{c.e.setAttribute('cx',(((c.x+t*c.sp)%1400)-160).toFixed(1));c.e.setAttribute('cy',c.y);});
 const lit=eio(P(t,23.4,26.7));tf(villa3W,540-72*0.95,866,0.95);villa3W.style.filter=`brightness(${lerp(.62,1.04,lit).toFixed(3)}) saturate(${lerp(.55,1,lit).toFixed(3)})`;
 op(villa3.lit1,lit);op(villa3.lit2,lit);op(villa3.doorGlow,P(t,26.0,26.9));op(doorGlow3,P(t,26.0,27.0)*0.9);
 // bridge build
 const bb=P(t,21.85,23.3);planks.forEach((p,i)=>{const pp=eo(P(bb,i/BN*0.75,i/BN*0.75+0.25));op(p,pp);});
 rails.forEach(r=>r.setAttribute('stroke-dashoffset',(1-eio(P(bb,0.15,1))).toFixed(3)));posts.forEach(p=>op(p.e,P(bb,p.u*0.75+0.1,p.u*0.75+0.25)));
 op(bridgeGlow,0.55*P(t,21.9,22.6)*(0.8+0.2*Math.sin(t*4)));
 rule.style.opacity=(P(t,23.2,23.8)*(1-P(t,27.45,27.8))).toFixed(3);
 // character
 let x=540,y,s,walk=null;
 if(t<23.25){const a=eio(P(t,17.2,18.5));y=lerp(1990,1690,a);if(a>0&&a<1)walk=(t-17.2)*1.7;const rc=Math.sin(Math.PI*P(t,18.6,19.3));y+=rc*22;s=.95;}
 else{const u=P(t,23.25,26.6);const ue=u<1?u:1;const yy=lerp(1690,bY(1)+6,ue);y=yy;const uu=Math.pow(clamp((1572-yy)/690),1/0.82);s=lerp(.95,.36,clamp((1690-yy)/(1690-bY(1))));if(u>0&&u<1)walk=(t-23.25)*1.9;}
 tf(c3.root,x,y,s);c3.walk=walk;
 c3.tilt=6*Math.sin(Math.PI*P(t,18.6,19.6));
 const fist=Math.sin(Math.PI*P(t,21.1,22.4));c3.armR.ik=fist>0.02?[lerp(110,170,fist),lerp(-250,-700,fist),1]:null;c3.armR.u=-7;c3.armL.u=7;c3.armR.front=fist>0.05;
 drawMan(c3,t);
 pebbles.forEach((p,i)=>{const k=P(t,18.65+i*0.07,19.5+i*0.07);const px=500+i*30,py=1572+(-40*Math.sin(Math.PI*Math.min(k*2.2,1)))+(k>0.45?ei((k-0.45)/0.55)*120:0);p.setAttribute('cx',px+k*20);p.setAttribute('cy',py);op(p,(k>0&&k<1)?1:0);});
}
// =============== SCENE 4/5a: OFFICE ===============
const s4=G(S),s4c=G(s4);
el('rect',{width:1080,height:1920,fill:'#FAF6EE'},s4c);
const office=G(s4c);
const offPieces=[];
offPieces.push(H(office,`<rect width="1080" height="1520" fill="url(#wall)"/><g stroke="#E0D2BA" stroke-width="2">${[0,1,2,3,4,5,6,7,8].map(i=>`<path d="M${60+i*120} 0 V1500"/>`).join('')}</g>`));
{let sky='';const r=rnd(21);let x=150;while(x<930){const w=36+r()*60,h=60+r()*220;sky+=`<rect x="${x}" y="${1010-h}" width="${w}" height="${h}" fill="#A9BACF"/>`;x+=w+6;}
 sky+=`<path d="M690 1010 L690 760 Q720 690 750 760 L750 1010Z" fill="#93A7C0"/><path d="M706 772 Q720 742 734 772 Z" fill="#E9EEF4"/><rect x="420" y="800" width="54" height="210" fill="#93A7C0"/>`;
 offPieces.push(H(office,`<rect x="140" y="520" width="800" height="500" rx="10" fill="url(#winSky)"/>${sky}<rect x="140" y="520" width="800" height="500" rx="10" fill="none" stroke="${C.GOLD}" stroke-width="10"/><path d="M540 520 V1020 M140 770 H940" stroke="${C.GOLD}" stroke-width="5"/>`));}
offPieces.push(H(office,`<rect y="1500" width="1080" height="420" fill="#CDB08A"/>${[0,1,2,3,4,5,6,7,8,9,10,11].map(i=>`<path d="M${i*100-40} 1500 L${i*130-170} 1920" stroke="#BC9F78" stroke-width="2"/>`).join('')}`));
offPieces.push(H(office,`<rect x="40" y="1300" width="90" height="210" rx="10" fill="${C.NAVY}"/><path d="M85 1300 q-80 -120 -40 -260 M85 1300 q10 -160 40 -300 M85 1300 q70 -100 60 -220 M85 1300 q-40 -60 -80 -110" stroke="#5E7C4F" stroke-width="22" fill="none" stroke-linecap="round"/>`));
offPieces.push(H(office,`<rect x="960" y="1100" width="120" height="14" fill="#9E7A55"/><rect x="975" y="1050" width="22" height="50" fill="${C.GOLD}"/><rect x="1002" y="1040" width="18" height="60" fill="${C.NAVY}"/><circle cx="1050" cy="1080" r="20" fill="${C.COPPER}"/>`));
// standing group
const stand=G(s4c);const cA=makeMan(G(stand));const cB=makeMan(G(stand),{consultant:true});
// seated group
const seat=G(s4c);const cA2=makeMan(G(seat));const cB2=makeMan(G(seat),{consultant:true});
const tabW=G(seat);const tab=makeTablet(tabW);
const keyW=G(s4c);el('circle',{r:150,fill:'url(#glowR)',opacity:.8},keyW);const keyIn=G(keyW);makeKey(keyIn);
H(seat,`<rect x="20" y="1505" width="1040" height="34" rx="8" fill="#6B4730"/><rect x="20" y="1505" width="1040" height="8" rx="4" fill="#8D6646"/>
 <rect x="40" y="1539" width="1000" height="400" fill="${C.NAVY}"/><rect x="40" y="1539" width="1000" height="6" fill="${C.GOLD}"/>
 <image href="logo_light.png" x="${540-230}" y="${1680}" width="460" height="${460*LH/LW}" opacity=".95"/>`);
// floating frames
const framesG=G(s4c);const frames=[];
[['فيلا سكنية',g=>{const v=makeVilla(g);drawVilla(v,1,1,false);tf(g,0,70,.56);}],['عمارة سكنية',g=>{makeApartment(g);tf(g,0,82,.42);}],['أرض',g=>{makeLand(g);tf(g,0,60,.66);}],['عقار تجاري',g=>{makeCommercial(g);tf(g,0,78,.52);}]].forEach((f,i)=>{
 const w=G(framesG);const hl=el('rect',{x:-200,y:-160,width:400,height:320,rx:32,fill:'none',stroke:'#F2D493','stroke-width':14,opacity:0,filter:'url(#blur8)'},w);
 H(w,`<rect x="-190" y="-150" width="380" height="300" rx="26" fill="#FFFFFF" filter="url(#shadow)"/>`);
 const cl=G(w,{'clip-path':'url(#frameClip)'});el('rect',{x:-190,y:-150,width:380,height:300,fill:'url(#frameSky)'},cl);el('rect',{x:-190,y:70,width:380,height:80,fill:'#EADFCB'},cl);f[1](G(cl));
 const bd=el('rect',{x:-190,y:-150,width:380,height:300,rx:26,fill:'none',stroke:C.GOLD,'stroke-width':4},w);
 H(w,`<rect x="-105" y="96" width="210" height="46" rx="23" fill="${C.NAVY}"/><text x="0" y="128" text-anchor="middle" direction="rtl" font-family="PlexAr,PlexLa" font-weight="600" font-size="26" fill="#EBD7A8">${f[0]}</text>`);
 frames.push({w,hl,bd,pos:[[305,655],[775,655],[305,935],[775,935]][i]});});
// logo pieces
const logoA=G(s4c);const logoAimg=el('image',{href:'logo.png',x:0,y:0,width:LW,height:LH},G(logoA,{'clip-path':'url(#logoClipA)'}));
const barA=el('rect',{x:-30,y:-40,width:60,height:LH+80,fill:'url(#barG)'},logoA);
const lcA=document.getElementById('lcA');
const lineTop=el('rect',{x:0,y:957,width:1080,height:6,fill:'url(#goldG)',opacity:0},TOP);
T('نقدم لك الرأي والعقار',{y:300,size:66,color:'gold',cls:'',tin:32.55,tout:35.35,st:0.15});
T('خبرة عقارية ورؤية تساعدك على الاختيار.',{y:400,size:40,w:600,font:'plex',color:'navy',tin:34.2,tout:35.35,st:0.07});
T('باقي عزيمتك!',{y:300,size:120,color:'gold',cls:'gshadow',tin:37.25,tout:38.65,st:0.22,pop:true});
function placeLogo(g,img,clipRect,bar,cx,cy,w,reveal){const s=w/LW;g.setAttribute('transform',`translate(${(cx-w/2).toFixed(2)},${(cy-w*LH/LW/2).toFixed(2)}) scale(${s.toFixed(4)})`);
 const edge=LW*(1-eio(reveal));clipRect.setAttribute('x',edge.toFixed(1));clipRect.setAttribute('width',(LW-edge+2).toFixed(1));clipRect.setAttribute('y',-50);clipRect.setAttribute('height',LH+100);
 bar.setAttribute('x',(edge-30).toFixed(1));op(bar,reveal>0&&reveal<1?1:0);}
const SY=1825;
function drawS4(t){
 // gold line hand-off from bridge
 op(lineTop,P(t,27.15,27.4)*(1-P(t,27.75,28.0)));lineTop.setAttribute('transform',`translate(540,0) scale(${eo(P(t,27.15,27.6)).toFixed(3)},1) translate(-540,0)`);
 // office build
 const ob=P(t,29.9,30.9);offPieces.forEach((p,i)=>{const k=eo(P(ob,i*0.15,i*0.15+0.4));op(p,k);p.setAttribute('transform',`translate(0,${((1-k)*40).toFixed(1)})`);});
 // logo
 const mv=eio(P(t,29.85,30.6));placeLogo(logoA,logoAimg,lcA,barA,540,lerp(960,190,mv),lerp(900,620,mv),P(t,27.85,29.0));op(logoA,P(t,27.8,27.9)*(1-P(t,38.6,38.9)));
 // standing
 const sv=vis(stand,t,29.9,32.0,0.2,0.3);
 if(sv){const e=eio(P(t,30.1,31.0));tf(cA.root,lerp(-180,330,e),1835,1.05);cA.walk=e>0&&e<1?(t-30.1)*1.9:null;cA.turn=.45;cA.expr=t<30.9?'curious':'smile';cA.blink=blinkV(t,.3);
  tf(cB.root,780,1835,1.05);cB.turn=-.45;cB.expr='smile';cB.blink=blinkV(t,.9);
  const wel=Math.sin(Math.PI*P(t,30.25,31.0));const hs=eo(P(t,30.95,31.3));const shake=Math.sin((t-31)*16)*7*P(t,31.25,31.4)*(1-P(t,31.75,31.9));
  cB.armL.ik=hs>0?[lerp(-150,-214,hs),lerp(-560,-358,hs)+shake,-1]:(wel>0.02?[lerp(-110,-230,wel),lerp(-240,-540,wel),-1]:null);cB.armL.u=7;cB.armR.u=-7;
  cA.armR.ik=hs>0?[lerp(118,214,hs),lerp(-240,-358,hs)+shake,1]:null;cA.armR.u=-7;cA.armL.u=7;
  drawMan(cA,t);drawMan(cB,t);}
 const seatV=vis(seat,t,31.75,38.9,0.3,0.01);
 if(seatV){tf(cA2.root,300,SY,1.0);cA2.turn=.45;cA2.blink=blinkV(t,.4);
  cA2.expr=t<33.2?'curious':(t<34.5?'thoughtful':(t<37.55?'smile':'happy'));cA2.look=t<34.5?[0,-3]:[2,0];
  tf(cB2.root,790,SY,1.0);cB2.turn=-.45;cB2.blink=blinkV(t,1.1);cB2.expr='smile';cB2.talk=(t>32&&t<35.3)?Math.abs(Math.sin(t*9))*0.8:0;cB2.look=[-2,-1];
  tf(tabW,665,1300,0.9,-8);op(tab.screen,P(t,32.0,32.2));
  cB2.armL.ik=[-222,-512,-1];cB2.armR.ik=[-30,-522,1];cB2.armR.front=true;cB2.armL.front=true;
  cA2.armL.ik=[-40,-322,1];
  const reach=eio(P(t,36.85,37.5));const back=eio(P(t,37.6,38.2));
  const keyHand=[lerp(lerp(90,248,reach),150,back),lerp(lerp(-325,-640,reach),-560,back)];
  cA2.armR.ik=reach>0?[keyHand[0],keyHand[1],1]:[90,-325,1];cA2.armL.u=7;
  drawMan(cA2,t);drawMan(cB2,t);
  // key
  let kx=545,ky=1180+Math.sin(t*2.4)*10;if(reach>=1){kx=300+keyHand[0];ky=SY+keyHand[1]-30;}
  else if(reach>0){kx=lerp(545,300+keyHand[0],P(reach,0.7,1));ky=lerp(ky,SY+keyHand[1]-30,P(reach,0.7,1));}
  tf(keyW,kx,ky,0.62*eback(P(t,36.2,36.7)),reach>=1?-20:Math.sin(t*1.6)*12);keyIn.setAttribute('transform',`scale(${(reach<1?Math.cos(t*2.6):1).toFixed(3)},1)`);op(keyW,P(t,36.2,36.35));
 }else op(keyW,0);
 // frames
 frames.forEach((f,i)=>{const e=eback(P(t,32.15+i*0.28,32.75+i*0.28));const x0=665,y0=1300;let x=lerp(x0,f.pos[0],eo(P(t,32.15+i*0.28,32.75+i*0.28))),y=lerp(y0,f.pos[1],eo(P(t,32.15+i*0.28,32.75+i*0.28)));let s=lerp(.1,.86,e);
  y+=Math.sin(t*1.5+i)*6;let o=P(t,32.15+i*0.28,32.3+i*0.28);
  if(i===0){op(f.hl,P(t,34.55,34.9)*(0.6+0.4*Math.sin(t*5)));const c=eio(P(t,35.55,36.3));x=lerp(x,540,c);y=lerp(y,760,c);s*=lerp(1,1.32,c);}
  else{o*=1-0.55*P(t,34.55,34.9);const g=eio(P(t,35.45,35.95));s*=1-g*0.7;o*=1-g;x=lerp(x,x0,g);y=lerp(y,y0,g);}
  o*=1-P(t,38.6,38.9);tf(f.w,x,y,s);op(f.w,o);});
}
// =============== SCENE 5b: VILLA ENTRANCE ===============
const s5=G(S),s5c=G(s5);
H(s5c,`<rect width="1080" height="1920" fill="url(#bg5)"/><circle cx="800" cy="560" r="300" fill="url(#softR)" opacity=".8"/>
<rect y="1495" width="1080" height="425" fill="#E6D8BF"/><g stroke="#D3C09F" stroke-width="3">${[...Array(13)].map((_,i)=>`<path d="M540 1495 L${-600+i*190} 1920"/>`).join('')}<path d="M0 1520 H1080 M0 1630 H1080 M0 1770 H1080"/></g>
<path d="M450 1495 L630 1495 L760 1920 L320 1920 Z" fill="#EFE5D3"/>`);
const villa5W=G(s5c);const villa5=makeVilla(G(villa5W));drawVilla(villa5,1,1,false);
const door5=el('ellipse',{cx:540,cy:1330,rx:180,ry:200,fill:'url(#glowR)',opacity:0},s5c);
const c5=makeMan(G(s5c));
const key5=G(s5c);el('circle',{r:120,fill:'url(#glowR)',opacity:.7},key5);const key5in=G(key5);makeKey(key5in);
const env=makeEnvelope(G(s5c));
const badge=G(s5c);H(badge,`<rect x="-300" y="-105" width="600" height="210" rx="40" fill="#FFFFFF" filter="url(#shadow)"/><rect x="-300" y="-105" width="600" height="210" rx="40" fill="none" stroke="${C.GOLD}" stroke-width="4"/>`);
el('image',{href:'logo.png',x:-260,y:-260*LH/LW,width:520,height:520*LH/LW},badge);
T('جهّز عربونك...',{y:420,size:84,color:'navy',tin:41.85,tout:45.1,st:0.15});
T('وخذ خطوتك.',{y:530,size:84,color:'gold',cls:'',tin:42.5,tout:45.1,st:0.15});
function drawS5(t){
 const push=eio(P(t,43.6,45.5));cam(s5c,540,1310,lerp(1.0,1.45,push)+0.03*P(t,38.8,43.6));
 tf(villa5W,540-72*2.3,1500,2.3);op(door5,P(t,44.3,45.2));op(villa5.doorGlow,P(t,44.2,45));
 tf(c5.root,380,1880,1.2);c5.turn=0;c5.expr='happy';c5.blink=blinkV(t,.5);c5.look=[0,0];
 c5.armR.ik=[150,-600,1];c5.armL.u=7;c5.tilt=-2;drawMan(c5,t);
 const kx=380+150*1.2,ky=1880-630*1.2;const spin=P(t,39.9,40.8);
 tf(key5,kx,ky,0.6*(1-P(t,40.6,40.85)),-15);key5in.setAttribute('transform',`scale(${Math.cos(eio(spin)*Math.PI*4).toFixed(3)},1)`);op(key5,1-P(t,40.65,40.85));
 const bm=eio(P(t,40.65,41.5));tf(badge,lerp(kx,540,bm),lerp(ky,250,bm),lerp(.15,1.1,bm));op(badge,P(t,40.6,40.75));
 const ein=eo(P(t,41.7,42.3));tf(env.root,lerp(1300,830,ein),1560+Math.sin(t*2)*6,0.85,lerp(20,-6,ein));drawEnvelope(env,eio(P(t,42.4,42.9)),eo(P(t,42.9,43.6)));
}
// =============== SCENE 6: FINAL ===============
const s6=G(S),s6c=G(s6);
H(s6c,`<rect width="1080" height="1920" fill="#FAF6EE"/><g stroke="#E9DDC6" stroke-width="2" fill="none"><circle cx="540" cy="760" r="520"/><circle cx="540" cy="760" r="700"/><path d="M0 760 H1080 M540 0 V1600"/></g>`);
const sky6=G(s6c);const lay=[G(sky6),G(sky6),G(sky6)];
{const r=rnd(5);let x=-400;let s='';while(x<1500){const w=70+r()*120,h=180+r()*420;s+=`<rect x="${x}" y="${1920-h-120}" width="${w}" height="${h+120}" fill="#EBE0CC"/>`;x+=w+10;}H(lay[0],s);
 for(let i=0;i<6;i++){const g=G(lay[1]);(i%2?makeCommercial:makeApartment)(g);tf(g,-320+i*330,1860,0.9+(i%3)*0.12);}
 for(let i=0;i<5;i++){const g=G(lay[2]);const v=makeVilla(g);drawVilla(v,1,0.4,false);tf(g,-250+i*420,1930,0.75);}
 el('rect',{x:-600,y:1905,width:2400,height:40,fill:'#E2D3B8'},lay[2]);}
const logoB=G(s6c);const logoBimg=el('image',{href:'logo.png',x:0,y:0,width:LW,height:LH},G(logoB,{'clip-path':'url(#logoClipB)'}));
const barB=el('rect',{x:-30,y:-40,width:60,height:LH+80,fill:'url(#barG)'},logoB);const lcB=document.getElementById('lcB');
const shine=G(logoB,{mask:'url(#logoMask)'});const shineR=el('rect',{x:-300,y:-50,width:260,height:LH+100,fill:'url(#shineG)',transform:'skewX(-20)'},shine);
T('نقدم لك الرأي والعقار.',{y:880,size:76,color:'gold',tin:46.25,tout:50.7,st:0.15});
T('رأيك يستحق الاهتمام،',{y:1000,size:56,w:700,color:'navy',tin:47.15,tout:50.7,st:0.12});
T('وعقارك يستحق الاختيار.',{y:1085,size:56,w:700,color:'navy',tin:49.05,tout:50.7,st:0.12});
T('نقدم لك الرأي والعقار.',{y:338,size:52,color:'gold',tin:51.0,tout:99,st:0.1});
T('يالله... اتصل ولا تنوم!',{y:420,size:46,w:700,color:'ivory',tin:51.4,tout:99,raw:true,wrap:['<span class="pill">','</span>'],pop:true,dur:.5});
const card=document.createElement('div');card.id='card';
card.innerHTML=`<div class="hdr r">للتواصل والاستفسار:</div>
<div class="row r"><div class="ic">${iconSVG('phone',50,'#EBD7A8')}</div><div class="num">0599818181</div></div>
<div class="row r"><div class="ic">${iconSVG('phone',50,'#EBD7A8')}</div><div class="num">0535422918</div></div>
<div class="div r"></div>
<div class="row r"><div class="ic s">${iconSVG('mail',40,'#EBD7A8')}</div><div class="sm">info@alshalaan.sa</div></div>
<div class="row r"><div class="ic s">${iconSVG('globe',40,'#EBD7A8')}</div><div class="sm">www.alshalaan.sa</div></div>
<div class="div r"></div>
<div class="row r"><div class="ic s">${iconSVG('pin',42,'#EBD7A8')}</div><div class="ad">الرياض – حي الشفاء – شرق معارض السيارات</div></div>`;
card.style.display='none';TL.appendChild(card);const cardRows=[...card.querySelectorAll('.r')];
function drawS6(t){
 const pan=eio(P(t,45.2,47.6));const al=eio(P(t,46.9,48.3));
 const sc=lerp(1.35,0.8,al);sky6.setAttribute('transform',`translate(540,1920) scale(${sc.toFixed(4)}) translate(-540,-1920)`);
 [60,170,330].forEach((d,i)=>tf(lay[i],lerp(d,-d*0.4,pan)+Math.sin(t*0.3)*(i+1)*6*al,0));
 op(sky6,P(t,45.2,45.6));
 const up=eio(P(t,50.75,51.55));placeLogo(logoB,logoBimg,lcB,barB,540,lerp(700,230,up),lerp(900,600,up),P(t,45.55,46.6));op(logoB,P(t,45.5,45.6));
 const sh=P(t,57.4,58.6);shineR.setAttribute('x',lerp(-400,LW+300,sh).toFixed(1));op(shineR,sh>0&&sh<1?1:0);
 const cin=eo(P(t,50.95,51.7));card.style.display=t>50.9?'':'none';card.style.opacity=cin;card.style.transform=`translateY(${((1-cin)*140).toFixed(1)}px)`;
 cardRows.forEach((r,i)=>{const k=eo(P(t,51.25+i*0.13,51.75+i*0.13));r.style.opacity=k;r.style.transform=`translateX(${((1-k)*-40).toFixed(1)}px)`;});
}
// ---------------- TRANSITION OVERLAYS (TOP) ----------------
const iris=el('circle',{cx:540,cy:760,r:0,fill:'#FAF6EE',stroke:'#E3C98F','stroke-width':16},TOP);
const flash=el('rect',{width:1080,height:1920,fill:'#FFF6DE'},TOP);
const flashC=el('circle',{cx:540,cy:1300,r:0,fill:'url(#glowR)'},TOP);
const sweep=el('rect',{x:0,y:0,width:1080,height:220,fill:'url(#barG)',transform:'rotate(90 540 960)'},TOP);
const ivoryCover=el('rect',{width:1080,height:1920,fill:'#FAF6EE'},TOP);TOP.insertBefore(ivoryCover,TOP.firstChild);
// ---------------- MASTER ----------------
function render(t){
 document.documentElement.style.setProperty('--bp',((t*35)%200).toFixed(1)+'%');
 const sc=[[s1,0,8.95,drawS1],[s2,8.85,17.05,drawS2],[s3,16.75,27.95,drawS3],[s4,27.5,38.95,drawS4],[s5,38.85,45.65,drawS5],[s6,45.4,60.5,drawS6]];
 card.style.display='none';
 sc.forEach(([g,a,b,f],i)=>{const o=Math.min(i===0?1:P(t,a,a+0.25),i===5?1:1-P(t,b-0.25,b));op(g,o);if(o>0.002)f(t);});
 // overlays
 const ir=eio(P(t,8.3,8.85));iris.setAttribute('r',(ir*1500).toFixed(1));op(iris,(ir>0?1:0)*(1-P(t,8.95,9.35)));
 op(sweep,0);
 // S2->S3 gold sweep
 const sw=P(t,16.6,17.2);if(sw>0&&sw<1){op(sweep,Math.sin(sw*Math.PI));sweep.setAttribute('transform',`translate(0,${lerp(-300,1920,sw)}) `);sweep.setAttribute('height',260);}
 op(ivoryCover,Math.min(P(t,27.2,27.6),1-P(t,27.75,27.95)));
 // flashes
 const fl=Math.max(Math.sin(Math.PI*P(t,2.3,2.75))*0.55, Math.sin(Math.PI*P(t,38.55,39.2)), Math.sin(Math.PI*P(t,45.15,45.75))*0.95, Math.sin(Math.PI*P(t,21.0,21.4))*0.35);op(flash,fl);
 drawTexts(t);
 const dark=t<8.9||(t>16.9&&t<27.6);drawDust(t,dark?0.9:0.55,dark?'#F4DFA8':'#C9A86A');
 return true;
}
window.render=render;window.ready=document.fonts.ready.then(()=>{render(0);return true;});
