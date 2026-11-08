// ===== V2 timeline (VO offset 0.5s, total 68s) =====
const DUR=68;
function placeLogo(g,img,clipRect,bar,cx,cy,w,reveal){const s=w/LW;g.setAttribute('transform',`translate(${(cx-w/2).toFixed(2)},${(cy-w*LH/LW/2).toFixed(2)}) scale(${s.toFixed(4)})`);
 const edge=LW*(1-eio(reveal));clipRect.setAttribute('x',edge.toFixed(1));clipRect.setAttribute('width',(LW-edge+2).toFixed(1));clipRect.setAttribute('y',-50);clipRect.setAttribute('height',LH+100);
 bar.setAttribute('x',(edge-30).toFixed(1));op(bar,reveal>0&&reveal<1?1:0);}
function syncMan(dst,src){['view','turn','expr','look','blink','talk','walk','tilt'].forEach(k=>dst[k]=src[k]);
 ['armL','armR'].forEach(a=>{dst[a].ik=src[a].ik;dst[a].u=src[a].u;dst[a].f=src[a].f;dst[a].front=src[a].front;});}
function makeFrame(parent,label,fill){const w=G(parent);const hl=el('rect',{x:-200,y:-160,width:400,height:320,rx:32,fill:'none',stroke:'#F2D493','stroke-width':14,opacity:0,filter:'url(#blur8)'},w);
 H(w,`<rect x="-190" y="-150" width="380" height="300" rx="26" fill="#FFFFFF" filter="url(#shadow)"/>`);
 const cl=G(w,{'clip-path':'url(#frameClip)'});el('rect',{x:-190,y:-150,width:380,height:300,fill:'url(#frameSky)'},cl);el('rect',{x:-190,y:70,width:380,height:80,fill:'#EADFCB'},cl);fill(G(cl));
 el('rect',{x:-190,y:-150,width:380,height:300,rx:26,fill:'none',stroke:C.GOLD,'stroke-width':4},w);
 H(w,`<rect x="-105" y="96" width="210" height="46" rx="23" fill="${C.NAVY}"/><text x="0" y="128" text-anchor="middle" direction="rtl" font-family="PlexAr,PlexLa" font-weight="600" font-size="26" fill="#EBD7A8">${label}</text>`);
 return {w,hl};}
const FR=[['فيلا سكنية',g=>{const v=makeVilla(g);drawVilla(v,1,1,false);tf(g,0,70,.56);}],['عمارة سكنية',g=>{makeApartment(g);tf(g,0,82,.42);}],['أرض',g=>{makeLand(g);tf(g,0,60,.66);}],['عقار تجاري',g=>{makeCommercial(g);tf(g,0,78,.52);}]];

// =============== S1 TREASURE (0-9.35) ===============
const s1=G(S),s1c=G(s1);
H(s1c,`<rect width="1080" height="1920" fill="url(#bg1)"/>
<g stroke="#C9A86A" stroke-opacity=".10" fill="none" stroke-width="2"><circle cx="540" cy="1050" r="380"/><circle cx="540" cy="1050" r="560"/><circle cx="540" cy="1050" r="760"/>
<path d="M540 0 V1920 M0 1050 H1080 M0 380 L1080 1720 M1080 380 L0 1720"/></g><ellipse cx="540" cy="1300" rx="520" ry="90" fill="#0B1729" opacity=".35"/>`);
const rays1=G(s1c);for(let i=0;i<11;i++)el('path',{d:'M-10 0 L-70 -1100 L70 -1100 L10 0 Z',fill:'url(#rayG)',transform:`rotate(${-55+i*11})`},rays1);
const chest=makeChest(G(s1c));
const orb=G(s1c);el('circle',{r:120,fill:'url(#glowR)'},orb);el('circle',{r:26,fill:'#FFF8E4'},orb);
const bulbW=G(s1c);const bulb=makeBulb(bulbW);
const villa1W=G(s1c);const plat1=H(villa1W,`<ellipse cx="0" cy="10" rx="330" ry="70" fill="url(#glowR)" opacity=".7"/><ellipse cx="0" cy="8" rx="300" ry="34" fill="url(#goldDark)"/><ellipse cx="0" cy="0" rx="300" ry="30" fill="url(#goldG)"/>`);
const villa1=makeVilla(G(villa1W));
const c1=makeMan(G(s1c));
T('الكنز ثروة...',{y:150,size:104,color:'gold',cls:'gshadow',tin:0.45,tout:4.15,st:0.18});
T('والثروة فكرة!',{y:290,size:104,color:'gold',cls:'gshadow',tin:2.7,tout:4.15,st:0.18});
T('واعي',{y:140,size:130,color:'ivory',tin:4.35,tout:5.7,outDur:0.3,pop:true});
T('راعي',{y:140,size:130,color:'gold',cls:'gshadow',tin:5.8,tout:7.15,outDur:0.3,pop:true});
T('راعي عقار ورأي',{y:150,size:104,color:'gold',cls:'gshadow',tin:7.3,tout:9.0,st:0.18});
T('الفكرة بداية الثروة.',{y:445,size:50,w:600,font:'plex',color:'ivory',tin:3.4,tout:9.0,st:0.1});
function drawS1(t){
 const z=eio(P(t,6.8,9.3));const cs=1+0.10*eio(P(t,0,2.4))-0.10*eio(P(t,4.2,5.8))+0.28*z;cam(s1c,540,lerp(1100,860,z),cs);
 const ap=eback(P(t,0.05,1.0));tf(chest.root,540,1270+Math.sin(t*2)*3,1.22*lerp(.6,1,ap),Math.sin(t*38)*1.3*P(t,1.4,2.05)*(1-P(t,2.05,2.15)));op(chest.root,P(t,0.05,0.5));
 drawChest(chest,eo(P(t,2.1,2.6)));op(chest.seam,P(t,1.0,2.0)*(1-P(t,2.1,2.3)));op(chest.glow,P(t,1.1,2.1));
 const burst=P(t,2.15,2.8);tf(rays1,540,1030,lerp(.2,1,eo(burst)),Math.sin(t*0.4)*6);op(rays1,eo(burst)*(1-0.55*P(t,3.4,5.0))*(1-P(t,8.2,9.0)));
 const ob=eio(P(t,2.35,3.2));tf(orb,540,lerp(1000,690,ob),lerp(.4,1.15,ob)*(1+0.08*Math.sin(t*9)));op(orb,P(t,2.3,2.5)*(1-P(t,3.2,3.6)));
 tf(bulbW,540,690,1.45*lerp(.5,1,eback(P(t,3.05,3.6)))*(1-0.6*P(t,4.6,5.1)));op(bulbW,P(t,3.05,3.3)*(1-P(t,4.6,5.1)));
 bulb.spin.setAttribute('transform',`scale(${Math.cos(eio(P(t,3.5,4.6))*Math.PI*2).toFixed(3)},1)`);op(bulb.halo,0.7+0.3*Math.sin(t*6));
 tf(villa1W,540,860+Math.sin(t*1.8)*6,0.86);op(villa1W,P(t,4.6,4.9));drawVilla(villa1,P(t,4.65,6.2),P(t,6.1,6.8));op(plat1,P(t,4.6,5.0));
 const ent=eio(P(t,5.0,6.0));tf(c1.root,lerp(1250,840,ent),1890,0.92);c1.walk=ent<1&&ent>0?(t-5.0)*1.8:null;
 c1.turn=-0.45;c1.expr=t<5.95?'curious':(t<7.2?'surprised':'curious');c1.blink=blinkV(t,0.2);c1.look=[-3,-2];
 const ra=eo(P(t,5.9,6.4));c1.armL.ik=ra>0?[lerp(-110,-170,ra),lerp(-330,-640,ra),1]:null;c1.armL.u=8;c1.armR.u=-7;c1.tilt=-4*ra;
 drawMan(c1,t);
}
// =============== S2 IDEA -> OPINION (9.2-14.35) ===============
const s2=G(S),s2c=G(s2);
{let sk='';const r=rnd(3);let x=-20;while(x<1100){const w=60+r()*110,h=120+r()*300;sk+=`<rect x="${x}" y="${1500-h}" width="${w}" height="${h}" fill="#E7DAC4"/>`;x+=w+8;}
H(s2c,`<rect width="1080" height="1920" fill="url(#bg2)"/><circle cx="830" cy="520" r="190" fill="#F2DDAE" opacity=".45"/><circle cx="830" cy="520" r="120" fill="#F0D59C" opacity=".35"/>
${sk}<rect x="0" y="1500" width="1080" height="420" fill="#E8DCC6"/><rect x="0" y="1500" width="1080" height="6" fill="#D9C8AA"/>
<g stroke="#C9A86A" stroke-opacity=".18" stroke-width="2"><path d="M540 1506 L-200 1920 M540 1506 L1280 1920 M540 1506 L300 1920 M540 1506 L780 1920"/></g>
<ellipse cx="540" cy="1852" rx="240" ry="34" fill="#C7B28C" opacity=".35"/>`);}
const orbBack=G(s2c);const c2=makeMan(G(s2c));const orbFront=G(s2c);const bubble=G(s2c);
const bubSmall=[el('circle',{cx:690,cy:965,r:18,fill:'#FFFFFF',filter:'url(#shadow)'},s2c),el('circle',{cx:735,cy:895,r:30,fill:'#FFFFFF',filter:'url(#shadow)'},s2c)];
H(bubble,`<g filter="url(#shadow)" fill="#FFFFFF">${[[0,0,215],[-195,40,150],[195,40,150],[-110,-120,145],[115,-120,150],[0,125,160],[-240,-40,110],[240,-40,110],[-150,140,110],[150,140,110]].map(c=>`<circle cx="${c[0]}" cy="${c[1]}" r="${c[2]}"/>`).join('')}</g>`);
const bubIn=G(bubble);const minis=[];
[g=>{const v=makeVilla(g);drawVilla(v,1,1,false);return 0.34;},g=>{makeApartment(g);return 0.36;},g=>{makeLand(g);return 0.5;},g=>{makeCommercial(g);return 0.42;}].forEach((f,i)=>{const w=G(bubIn);const s=f(G(w));minis.push({w,s,base:[[-120,-30],[130,-30],[-120,160],[130,150]][i]});});
const bp2=makeBlueprint(G(bubble));const vm2W=G(bubble);const vm2=makeVilla(G(vm2W));
T('الرأي',{y:110,size:150,color:'gold',cls:'gshadow',tin:9.45,tout:13.8,pop:true});
T('الرأي بداية القرار.',{y:330,size:52,w:600,font:'plex',color:'navy',tin:11.0,tout:13.8,st:0.1});
function drawS2(t){
 cam(s2c,540,1000,1+0.04*P(t,9.2,14.3));
 tf(c2.root,540,1855,1.2);c2.walk=null;c2.turn=0;c2.blink=blinkV(t,0.6);
 c2.expr=t<11.0?'thoughtful':(t<12.8?'curious':'smile');
 const chin=eo(P(t,9.3,9.8))*(1-eo(P(t,12.6,13.0)));c2.armL.ik=chin>0.01?[lerp(-118,-14,chin),lerp(-240,-512,chin),1]:null;c2.armL.u=7;c2.armL.front=chin>0.3;
 const pt=eo(P(t,12.9,13.4));c2.armR.ik=pt>0.01?[lerp(118,250,pt),lerp(-240,-760,pt),-1]:null;c2.armR.u=-7;c2.tilt=-5*chin+3*pt;
 const bIn=eback(P(t,9.6,10.1)),bOut=P(t,10.55,10.9),bBack=eback(P(t,12.05,12.45));
 op(bubSmall[0],P(t,9.35,9.5));op(bubSmall[1],P(t,9.5,9.65));
 const bs=(t<12.0?lerp(.2,1,bIn)*(1-0.25*bOut):lerp(.75,1,bBack));
 tf(bubble,560,640,bs);op(bubble,P(t,9.6,9.75)*(t<12.0?(1-bOut):1));
 const orbT=P(t,10.5,11.0),conv=eio(P(t,12.0,12.5));
 minis.forEach((m,i)=>{const pin=eback(P(t,9.95+i*0.12,10.4+i*0.12));
  const ang=i*Math.PI/2+(t-10.5)*2.1;const ox=540+410*Math.cos(ang),oy=930+150*Math.sin(ang);const depth=Math.sin(ang);
  const gx=560+m.base[0]*bs,gy=640+m.base[1]*bs;let x=lerp(gx,ox,eio(orbT)),y=lerp(gy,oy,eio(orbT));let sc=lerp(m.s*bs,m.s*1.15*(1+0.18*depth),eio(orbT))*pin;
  x=lerp(x,560,conv);y=lerp(y,640,conv);sc*=(1-conv);
  const layer=(orbT>0.5&&depth>0)?orbFront:orbBack;
  if(orbT<=0.5&&t<10.8){if(m.w.parentNode!==bubIn)bubIn.appendChild(m.w);tf(m.w,m.base[0],m.base[1],m.s*pin);}else{if(m.w.parentNode!==layer)layer.appendChild(m.w);tf(m.w,x,y,sc);}
  op(m.w,P(t,9.95+i*0.12,10.1+i*0.12)*(1-P(t,12.35,12.5)));
  if(i===0&&t<12)c2.look=[clamp((x-540)/80,-3.5,3.5),clamp((y-900)/80,-3,2)];});
 if(t>=12)c2.look=[0,-3];
 const bpI=eback(P(t,12.35,12.75));const ex=eio(P(t,13.3,13.9));tf(bp2.root,0,lerp(10,90,ex),0.95*bpI*lerp(1,0.85,ex),0,0.95*bpI*lerp(1,0.4,ex));op(bp2.root,P(t,12.35,12.5));drawBlueprint(bp2,P(t,12.5,13.3));
 tf(vm2W,0,lerp(60,40,ex),0.62);op(vm2W,P(t,13.25,13.4));drawVilla(vm2,P(t,13.3,14.2),P(t,14.0,14.3));
 drawMan(c2,t);
}
// =============== S3 BRIDGE + POEM (14.1-26.45) ===============
const s3=G(S),s3c=G(s3);
H(s3c,`<rect width="1080" height="1920" fill="url(#bg3)"/><circle cx="540" cy="760" r="420" fill="#FFE9BE" opacity=".18" filter="url(#blur20)"/>`);
const clouds3=G(s3c);const cl3=[];{const r=rnd(11);for(let i=0;i<9;i++){const c=el('ellipse',{rx:120+r()*140,ry:26+r()*20,fill:'#FFFFFF',opacity:(.18+r()*.2).toFixed(2)},clouds3);cl3.push({e:c,x:r()*1080,y:1020+r()*480,sp:8+r()*16});}}
H(s3c,`<path d="M190 870 L890 870 L850 920 Q720 1040 540 1075 Q360 1040 230 920 Z" fill="#B99A6E"/><path d="M190 862 L890 862 L882 884 L198 884 Z" fill="#E4CFA6"/><path d="M300 960 Q540 1000 780 960" stroke="#9E8058" stroke-width="5" fill="none" opacity=".5"/>`);
const villa3W=G(s3c);const villa3=makeVilla(G(villa3W));drawVilla(villa3,1,0,false);
const doorGlow3=el('ellipse',{cx:540,cy:800,rx:150,ry:120,fill:'url(#glowR)',opacity:0},s3c);
const bridge=G(s3c);const BN=16;const bY=u=>1572-690*Math.pow(u,0.82);const bW=u=>lerp(185,52,u);
const planks=[];for(let i=0;i<BN;i++){const u0=i/BN,u1=(i+0.82)/BN;planks.push(el('path',{d:`M${540-bW(u0)} ${bY(u0)} L${540+bW(u0)} ${bY(u0)} L${540+bW(u1)} ${bY(u1)} L${540-bW(u1)} ${bY(u1)} Z`,fill:i%2?'#D7B676':'#E3C68A',stroke:'#A88446','stroke-width':2},bridge));}
const railD=s=>{let d='';for(let k=0;k<=30;k++){const u=k/30;d+=(k?'L':'M')+(540+s*bW(u)).toFixed(1)+' '+(bY(u)-lerp(70,22,u)).toFixed(1);}return d;};
const rails=[-1,1].map(s=>el('path',{d:railD(s),stroke:'url(#goldG)','stroke-width':9,fill:'none','stroke-linecap':'round',pathLength:1,'stroke-dasharray':'1 1','stroke-dashoffset':1},bridge));
const posts=[];for(let k=0;k<=8;k++){const u=k/8;for(const s of [-1,1])posts.push({u,e:el('path',{d:`M${540+s*bW(u)} ${bY(u)} L${540+s*bW(u)} ${bY(u)-lerp(70,22,u)}`,stroke:'#B8924E','stroke-width':lerp(8,4,u)},bridge)});}
const bridgeGlow=el('path',{d:`M355 1572 L725 1572 L592 882 L488 882 Z`,fill:'#FFE7AE',opacity:0,filter:'url(#blur20)'},bridge);bridge.insertBefore(bridgeGlow,bridge.firstChild);
const pebbles=[];for(let i=0;i<4;i++)pebbles.push(el('circle',{r:6+i%2*3,fill:'#9E8058'},s3c));
H(s3c,`<path d="M0 1566 L1080 1566 L1080 1920 L0 1920 Z" fill="#D5BC92"/><path d="M0 1560 Q270 1572 540 1566 Q810 1560 1080 1568 L1080 1590 L0 1590 Z" fill="#B39468"/><path d="M0 1590 L1080 1590 L1080 1600 L0 1600Z" fill="#E6D2AE"/>
<g stroke="#C4A77B" stroke-width="2" opacity=".5"><path d="M540 1600 L-300 1920 M540 1600 L1380 1920 M540 1600 L260 1920 M540 1600 L820 1920"/></g>`);
const bp3=makeBlueprint(G(s3c,{transform:'translate(210,1745) rotate(-8) scale(.42,.3)'}));drawBlueprint(bp3,1);
makeBulb(G(s3c,{transform:'translate(190,1660) scale(.45)'}));
const c3=makeMan(G(s3c));c3.view='back';
T('لكن بشرط!',{y:150,size:100,color:'ivory',cls:'gshadow',tin:13.9,tout:15.2,pop:true,st:0.15});
T('العزيمة تصنع الفرق.',{y:150,size:92,color:'gold',cls:'gshadow',tin:15.35,tout:19.7,st:0.18});
T('العزيمة!',{y:1110,size:190,color:'gold',cls:'gshadow',tin:15.75,tout:16.5,st:0,pop:true,outScale:.5,outDur:.5,dur:.5});
T('إذا كنت ذا رأيٍ فكن ذا *عزيمةٍ',{y:138,size:64,w:700,color:'ivory',tin:20.0,tout:25.95,st:0.14});
const rule=document.createElement('div');rule.style.cssText='position:absolute;left:340px;width:400px;top:252px;height:24px;display:flex;align-items:center;justify-content:center;gap:14px';rule.innerHTML='<div style="flex:1;height:2px;background:linear-gradient(90deg,transparent,#E3C98F)"></div><div style="width:14px;height:14px;background:#E3C98F;transform:rotate(45deg)"></div><div style="flex:1;height:2px;background:linear-gradient(90deg,#E3C98F,transparent)"></div>';TL.appendChild(rule);
T('فإن فساد الرأي أن تترددا',{y:290,size:64,w:700,color:'ivory',tin:23.3,tout:25.95,st:0.14});
function drawS3(t){
 cam(s3c,540,1250,1.0+0.05*P(t,14.1,26.4));
 cl3.forEach(c=>{c.e.setAttribute('cx',(((c.x+t*c.sp)%1400)-160).toFixed(1));c.e.setAttribute('cy',c.y);});
 const lit=eio(P(t,19.9,25.3));tf(villa3W,540-72*0.95,866,0.95);villa3W.style.filter=`brightness(${lerp(.62,1.04,lit).toFixed(3)}) saturate(${lerp(.55,1,lit).toFixed(3)})`;
 op(villa3.lit1,lit);op(villa3.lit2,lit);op(villa3.doorGlow,P(t,24.7,25.5));op(doorGlow3,P(t,24.7,25.6)*0.9);
 const bb=P(t,16.35,17.8);planks.forEach((p,i)=>op(p,eo(P(bb,i/BN*0.75,i/BN*0.75+0.25))));
 rails.forEach(r=>r.setAttribute('stroke-dashoffset',(1-eio(P(bb,0.15,1))).toFixed(3)));posts.forEach(p=>op(p.e,P(bb,p.u*0.75+0.1,p.u*0.75+0.25)));
 op(bridgeGlow,0.55*P(t,16.4,17.1)*(0.8+0.2*Math.sin(t*4)));
 rule.style.opacity=(P(t,20.5,21.1)*(1-P(t,25.95,26.3))).toFixed(3);
 let y,s,walk=null;
 if(t<19.7){const a=eio(P(t,14.35,15.4));y=lerp(1990,1690,a);if(a>0&&a<1)walk=(t-14.35)*1.7;y+=Math.sin(Math.PI*P(t,15.45,16.0))*22;s=.95;}
 else{const u=P(t,19.7,25.2);y=lerp(1690,bY(1)+6,u);s=lerp(.95,.36,clamp((1690-y)/(1690-bY(1))));if(u>0&&u<1)walk=(t-19.7)*1.6;}
 tf(c3.root,540,y,s);c3.walk=walk;c3.tilt=6*Math.sin(Math.PI*P(t,15.45,16.3))-5*Math.sin(Math.PI*P(t,17.8,19.3));
 const fist=Math.sin(Math.PI*P(t,15.85,17.0));c3.armR.ik=fist>0.02?[lerp(110,170,fist),lerp(-250,-700,fist),1]:null;c3.armR.u=-7;c3.armL.u=7;c3.armR.front=fist>0.05;
 drawMan(c3,t);
 pebbles.forEach((p,i)=>{const k=P(t,15.5+i*0.07,16.3+i*0.07);p.setAttribute('cx',500+i*30+k*20);p.setAttribute('cy',1572-40*Math.sin(Math.PI*Math.min(k*2.2,1))+(k>0.45?ei((k-0.45)/0.55)*120:0));op(p,(k>0&&k<1)?1:0);});
}
// =============== S4 OFFICE (26.1-33.45) ===============
const s4=G(S),s4c=G(s4);el('rect',{width:1080,height:1920,fill:'#FAF6EE'},s4c);
const office=G(s4c);const offPieces=[];
offPieces.push(H(office,`<rect width="1080" height="1520" fill="url(#wall)"/><g stroke="#E0D2BA" stroke-width="2">${[0,1,2,3,4,5,6,7,8].map(i=>`<path d="M${60+i*120} 0 V1500"/>`).join('')}</g>`));
{let sky='';const r=rnd(21);let x=150;while(x<930){const w=36+r()*60,h=60+r()*220;sky+=`<rect x="${x}" y="${1010-h}" width="${w}" height="${h}" fill="#A9BACF"/>`;x+=w+6;}
 sky+=`<path d="M690 1010 L690 760 Q720 690 750 760 L750 1010Z" fill="#93A7C0"/><path d="M706 772 Q720 742 734 772 Z" fill="#E9EEF4"/><rect x="420" y="800" width="54" height="210" fill="#93A7C0"/>`;
 offPieces.push(H(office,`<rect x="140" y="520" width="800" height="500" rx="10" fill="url(#winSky)"/>${sky}<rect x="140" y="520" width="800" height="500" rx="10" fill="none" stroke="${C.GOLD}" stroke-width="10"/><path d="M540 520 V1020 M140 770 H940" stroke="${C.GOLD}" stroke-width="5"/>`));}
offPieces.push(H(office,`<rect y="1500" width="1080" height="420" fill="#CDB08A"/>${[...Array(12)].map((_,i)=>`<path d="M${i*100-40} 1500 L${i*130-170} 1920" stroke="#BC9F78" stroke-width="2"/>`).join('')}`));
offPieces.push(H(office,`<rect x="40" y="1300" width="90" height="210" rx="10" fill="${C.NAVY}"/><path d="M85 1300 q-80 -120 -40 -260 M85 1300 q10 -160 40 -300 M85 1300 q70 -100 60 -220 M85 1300 q-40 -60 -80 -110" stroke="#5E7C4F" stroke-width="22" fill="none" stroke-linecap="round"/>`));
offPieces.push(H(office,`<rect x="960" y="1100" width="120" height="14" fill="#9E7A55"/><rect x="975" y="1050" width="22" height="50" fill="${C.GOLD}"/><rect x="1002" y="1040" width="18" height="60" fill="${C.NAVY}"/><circle cx="1050" cy="1080" r="20" fill="${C.COPPER}"/>`));
const stand=G(s4c);const cA=makeMan(G(stand));const cB=makeMan(G(stand),{consultant:true});
const seat=G(s4c);const cA2=makeMan(G(seat));const cB2=makeMan(G(seat),{consultant:true});
const tabW=G(seat);const tab=makeTablet(tabW);
H(seat,`<rect x="20" y="1505" width="1040" height="34" rx="8" fill="#6B4730"/><rect x="20" y="1505" width="1040" height="8" rx="4" fill="#8D6646"/>
 <rect x="40" y="1539" width="1000" height="400" fill="${C.NAVY}"/><rect x="40" y="1539" width="1000" height="6" fill="${C.GOLD}"/>
 <image href="logo_light.png" x="${540-230}" y="1680" width="460" height="${460*LH/LW}" opacity=".95"/>`);
const framesG=G(s4c);const frames=FR.map((f,i)=>{const r=makeFrame(framesG,f[0],f[1]);r.pos=[[305,655],[775,655],[305,935],[775,935]][i];return r;});
const logoA=G(s4c);const logoAimg=el('image',{href:'logo.png',x:0,y:0,width:LW,height:LH},G(logoA,{'clip-path':'url(#logoClipA)'}));
const barA=el('rect',{x:-30,y:-40,width:60,height:LH+80,fill:'url(#barG)'},logoA);const lcA=document.getElementById('lcA');
const lineTop=el('rect',{x:0,y:957,width:1080,height:6,fill:'url(#goldG)',opacity:0},TOP);
T('تقدم لك الرأي والعقار',{y:300,size:66,color:'gold',tin:28.85,tout:33.0,st:0.15});
T('رؤية عقارية تساعدك على الاختيار.',{y:400,size:40,w:600,font:'plex',color:'navy',tin:30.9,tout:33.0,st:0.08});
const SY=1825;
function drawS4(t){
 op(lineTop,P(t,25.75,26.0)*(1-P(t,26.35,26.6)));lineTop.setAttribute('transform',`translate(540,0) scale(${eo(P(t,25.75,26.2)).toFixed(3)},1) translate(-540,0)`);
 const ob=P(t,28.35,29.3);offPieces.forEach((p,i)=>{const k=eo(P(ob,i*0.15,i*0.15+0.4));op(p,k);p.setAttribute('transform',`translate(0,${((1-k)*40).toFixed(1)})`);});
 const mv=eio(P(t,28.3,29.05));placeLogo(logoA,logoAimg,lcA,barA,540,lerp(960,190,mv),lerp(900,620,mv),P(t,26.45,27.6));op(logoA,P(t,26.4,26.5)*(1-P(t,33.0,33.3)));
 if(vis(stand,t,28.4,30.45,0.2,0.3)){const e=eio(P(t,28.55,29.35));tf(cA.root,lerp(-180,330,e),1835,1.05);cA.walk=e>0&&e<1?(t-28.55)*1.9:null;cA.turn=.45;cA.expr=t<29.3?'curious':'smile';cA.blink=blinkV(t,.3);
  tf(cB.root,780,1835,1.05);cB.turn=-.45;cB.expr='smile';cB.blink=blinkV(t,.9);
  const wel=Math.sin(Math.PI*P(t,28.65,29.4));const hs=eo(P(t,29.35,29.7));const shake=Math.sin((t-29.4)*16)*7*P(t,29.65,29.8)*(1-P(t,30.15,30.3));
  cB.armL.ik=hs>0?[lerp(-150,-214,hs),lerp(-560,-358,hs)+shake,-1]:(wel>0.02?[lerp(-110,-230,wel),lerp(-240,-540,wel),-1]:null);cB.armL.u=7;cB.armR.u=-7;
  cA.armR.ik=hs>0?[lerp(118,214,hs),lerp(-240,-358,hs)+shake,1]:null;cA.armR.u=-7;cA.armL.u=7;drawMan(cA,t);drawMan(cB,t);}
 if(vis(seat,t,30.2,33.45,0.3,0.25)){tf(cA2.root,300,SY,1.0);cA2.turn=.45;cA2.blink=blinkV(t,.4);cA2.expr=t<31.4?'curious':(t<32.3?'thoughtful':'smile');cA2.look=t<32.3?[0,-3]:[2,0];
  tf(cB2.root,790,SY,1.0);cB2.turn=-.45;cB2.blink=blinkV(t,1.1);cB2.expr='smile';cB2.talk=(t>30.4&&t<32.8)?Math.abs(Math.sin(t*9))*0.8:0;cB2.look=[-2,-1];
  tf(tabW,665,1300,0.9,-8);op(tab.screen,P(t,30.4,30.6));
  cB2.armL.ik=[-222,-512,-1];cB2.armR.ik=[-30,-522,1];cB2.armR.front=true;cB2.armL.front=true;cA2.armL.ik=[-40,-322,1];cA2.armR.ik=[90,-325,1];
  drawMan(cA2,t);drawMan(cB2,t);}
 frames.forEach((f,i)=>{const a=30.55+i*0.25;const e=eback(P(t,a,a+0.6));const m=eo(P(t,a,a+0.6));let x=lerp(665,f.pos[0],m),y=lerp(1300,f.pos[1],m)+Math.sin(t*1.5+i)*6;
  let o=P(t,a,a+0.15)*(1-P(t,32.95,33.3));if(i===0)op(f.hl,P(t,32.3,32.6)*(0.6+0.4*Math.sin(t*5)));else o*=1-0.45*P(t,32.3,32.6);
  tf(f.w,x,y,lerp(.1,.86,e));op(f.w,o);});
}
// =============== S5 DETERMINATION & MEETING (33.2-45.6) ===============
const s5=G(S),s5c=G(s5);
H(s5c,`<rect width="1080" height="1920" fill="url(#bg5)"/><circle cx="800" cy="560" r="300" fill="url(#softR)" opacity=".8"/>
<rect y="1180" width="1080" height="740" fill="#E6D8BF"/><g stroke="#D3C09F" stroke-width="3">${[...Array(13)].map((_,i)=>`<path d="M540 1180 L${-700+i*205} 1920"/>`).join('')}<path d="M0 1260 H1080 M0 1380 H1080 M0 1560 H1080 M0 1800 H1080"/></g>
<path d="M480 1180 L600 1180 L800 1920 L280 1920 Z" fill="#EFE5D3"/>`);
const villa5W=G(s5c);const villa5=makeVilla(G(villa5W));drawVilla(villa5,1,1,false);
const path5=el('path',{d:'M420 1840 C 470 1640 640 1460 560 1215',stroke:'url(#goldG)','stroke-width':20,fill:'none','stroke-linecap':'round',pathLength:1,'stroke-dasharray':'1 1','stroke-dashoffset':1},s5c);
const path5g=el('path',{d:'M420 1840 C 470 1640 640 1460 560 1215',stroke:'#FFE3A0','stroke-width':40,fill:'none',opacity:0,filter:'url(#blur8)'},s5c);s5c.insertBefore(path5g,path5);
const bridgeEnd=H(s5c,`<g opacity=".95"><path d="M-40 1920 L-40 1730 Q120 1690 250 1760 L250 1920 Z" fill="#E3C68A" stroke="#A88446" stroke-width="3"/><path d="M-40 1700 Q120 1650 260 1725" stroke="url(#goldG)" stroke-width="10" fill="none"/><path d="M60 1690 V1770 M160 1700 V1780" stroke="#B8924E" stroke-width="7"/></g>`);
const prints=[];[[0.0,1570],[0.17,1500],[0.34,1440],[0.51,1385],[0.68,1335],[0.85,1290]].forEach((p,i)=>{const x=[545,585,600,592,575,558][i];const s=lerp(1.4,0.8,(1570-p[1])/280);
 const g=H(s5c,`<g transform="translate(${x},${p[1]}) scale(${s})"><ellipse cx="${i%2?14:-14}" cy="0" rx="13" ry="24" fill="#F2CF7E"/><ellipse cx="${i%2?14:-14}" cy="0" rx="22" ry="34" fill="#FFE3A0" opacity=".35"/></g>`);prints.push(g);});
const cB5=makeMan(G(s5c),{consultant:true});
const silG=G(s5c,{filter:'url(#sil)'});const cS=makeMan(silG);const c5=makeMan(G(s5c));
T('باقي عزيمتك',{y:150,size:110,color:'gold',cls:'',tin:35.45,tout:37.3,st:0.2,pop:true});
T('ما كل من لبس الهدوم جزوم...',{y:160,size:70,color:'navy',tin:38.75,tout:40.85,st:0.12});
T('العزيمة تقرّب المسافة.',{y:150,size:84,color:'gold',tin:40.95,tout:43.55,st:0.16});
T('يالله اتصل... لا تنوم!',{y:150,size:66,w:800,color:'ivory',tin:43.65,tout:45.3,raw:true,wrap:['<span class="pill">','</span>'],pop:true,dur:.5});
function drawS5(t){
 cam(s5c,560,1320,1+0.02*P(t,33.2,42.6)+0.3*eio(P(t,42.6,45.6)));
 tf(villa5W,540-72*1.35,1182,1.35);
 path5.setAttribute('stroke-dashoffset',(1-eio(P(t,34.9,36.2))).toFixed(3));op(path5,P(t,34.9,35.0));op(path5g,0.6*P(t,35.2,36.2)+0.4*P(t,41.0,42.3));
 op(bridgeEnd,0.9*(1-P(t,36.3,36.9)));
 prints.forEach((p,i)=>op(p,P(t,40.55+i*0.22,40.75+i*0.22)));
 // customer
 let y=1800,s=1.0,walk=null,view='back',turn=0,expr='determined',tilt=0;
 if(t>=34.15&&t<35.3){view='front';turn=-0.35;expr='determined';}
 const st=eio(P(t,35.95,36.9));y=lerp(1800,1700,st);s=lerp(1,.93,st);if(st>0&&st<1)walk=(t-35.95)*1.8;
 if(t>=37.2&&t<40.0){view='front';turn=0;expr='smile';}
 const st2=eio(P(t,40.15,40.9));y=lerp(y,1610,st2);s=lerp(s,.86,st2);if(st2>0&&st2<1)walk=(t-40.15)*1.8;
 if(t<34.15)tilt=-3;const X5=lerp(360,420,st)+lerp(0,40,st2);
 tf(c5.root,X5,y,s);c5.view=view;c5.turn=turn;c5.expr=expr;c5.walk=walk;c5.tilt=tilt;c5.blink=blinkV(t,.5);c5.look=view==='front'&&t<35.3?[-3,2]:[0,0];
 const adj=Math.sin(Math.PI*P(t,38.3,39.1)),tug=Math.sin(Math.PI*P(t,39.0,39.6));
 c5.armL.ik=adj>0.02?[lerp(-110,-66,adj),lerp(-240,-630,adj),-1]:(tug>0.02?[lerp(-110,-30,tug),lerp(-240,-470,tug),1]:null);
 c5.armR.ik=adj>0.02?[lerp(110,66,adj),lerp(-240,-630,adj),1]:(tug>0.02?[lerp(110,30,tug),lerp(-240,-470,tug),-1]:null);
 c5.armL.front=c5.armR.front=adj>0.3;c5.armL.u=7;c5.armR.u=-7;
 drawMan(c5,t);
 // silhouette transform
 const sil=P(t,39.55,40.05)*(1-P(t,42.3,42.9));
 tf(cS.root,X5,y,s);syncMan(cS,c5);if(t>=40.0)cS.view='back';drawMan(cS,t);op(silG,sil);op(c5.root,1-sil);if(t>=40.0&&t<42.9)c5.view='back';
 if(t>=40.0&&t<42.9)drawMan(c5,t);
 // consultant at the end of the path
 const ce=eback(P(t,41.8,42.4));tf(cB5.root,640,1300,0.5*ce);op(cB5.root,P(t,41.8,42.0));cB5.turn=-0.3;cB5.expr='smile';cB5.blink=blinkV(t,1.3);
 const w=Math.sin(Math.PI*P(t,42.3,43.6));cB5.armL.ik=w>0.02?[lerp(-110,-240,w),lerp(-240,-560,w),-1]:null;cB5.armR.ik=w>0.02?[lerp(110,240,w),lerp(-240,-560,w),1]:null;cB5.armL.u=7;cB5.armR.u=-7;drawMan(cB5,t);
}
// =============== S6a PRESENTATION + KEY (45.4-48.95) ===============
const s6=G(S),s6c=G(s6);
H(s6c,`<rect width="1080" height="1920" fill="url(#bg5)"/><rect y="1500" width="1080" height="420" fill="#E6D8BF"/>`);
const villa6W=G(s6c,{opacity:.55});const villa6=makeVilla(G(villa6W));drawVilla(villa6,1,1,false);tf(villa6W,540-72*2.0,1500,2.0);
el('rect',{width:1080,height:1920,fill:'#FAF6EE',opacity:.35},s6c);
const fr6=makeFrame(G(s6c),FR[0][0],FR[0][1]);
const cA6=makeMan(G(s6c));const cB6=makeMan(G(s6c),{consultant:true});const tab6W=G(s6c);const tab6=makeTablet(tab6W);
const key6=G(s6c);el('circle',{r:150,fill:'url(#glowR)',opacity:.8},key6);const key6in=G(key6);makeKey(key6in);
function drawS6(t){
 cam(s6c,540,1300,1+0.04*P(t,45.4,49));
 tf(fr6.w,540,620+Math.sin(t*1.5)*6,1.15*eback(P(t,45.55,46.1)));op(fr6.w,P(t,45.5,45.7));op(fr6.hl,0.5+0.5*Math.sin(t*4));
 tf(cA6.root,320,1835,1.05);cA6.turn=.45;cA6.blink=blinkV(t,.7);cA6.expr=t<47.9?'smile':'happy';
 tf(cB6.root,770,1835,1.05);cB6.turn=-.45;cB6.blink=blinkV(t,.2);cB6.expr='smile';cB6.talk=(t>45.6&&t<46.6)?Math.abs(Math.sin(t*9))*0.7:0;
 tf(tab6W,690,1400,0.8,8);cB6.armL.ik=[-165,-410,-1];cB6.armR.ik=[10,-418,1];cB6.armL.front=cB6.armR.front=true;
 const reach=eio(P(t,47.15,47.75)),back=eio(P(t,47.85,48.4));
 const kh=[lerp(lerp(110,214,reach),140,back),lerp(lerp(-250,-470,reach),-560,back)];
 cA6.armR.ik=reach>0?[kh[0],kh[1],1]:null;cA6.armR.u=-7;cA6.armL.u=7;
 drawMan(cA6,t);drawMan(cB6,t);
 let kx=545,ky=1310+Math.sin(t*2.4)*10;const hx=320+kh[0]*1.05,hy=1835+kh[1]*1.05-28;const f=P(reach,0.7,1);kx=lerp(kx,hx,f);ky=lerp(ky,hy,f);
 tf(key6,kx,ky,0.58*eback(P(t,46.3,46.8)),reach>=1?-20:Math.sin(t*1.6)*12);key6in.setAttribute('transform',`scale(${(reach<1?Math.cos(t*2.6):1).toFixed(3)},1)`);op(key6,P(t,46.3,46.45));
}
// =============== S6b HERO WITH KEY (48.7-54.95) ===============
const s7=G(S),s7c=G(s7);
H(s7c,`<rect width="1080" height="1920" fill="url(#bg5)"/><circle cx="800" cy="560" r="300" fill="url(#softR)" opacity=".8"/>
<rect y="1495" width="1080" height="425" fill="#E6D8BF"/><g stroke="#D3C09F" stroke-width="3">${[...Array(13)].map((_,i)=>`<path d="M540 1495 L${-600+i*190} 1920"/>`).join('')}<path d="M0 1520 H1080 M0 1630 H1080 M0 1770 H1080"/></g>
<path d="M450 1495 L630 1495 L760 1920 L320 1920 Z" fill="#EFE5D3"/>`);
const villa7W=G(s7c);const villa7=makeVilla(G(villa7W));drawVilla(villa7,1,1,false);
const rim7=el('rect',{x:-290,y:-300,width:580,height:310,rx:10,fill:'none',stroke:'#F6D98F','stroke-width':10,opacity:0,filter:'url(#blur8)'},villa7W.firstChild);
const c7=makeMan(G(s7c));
const env7W=G(s7c);const env7=makeEnvelope(env7W);H(env7W,`<rect x="-150" y="-20" width="300" height="180" rx="12" fill="url(#goldG)" opacity=".35"/>`);
const key7=G(s7c);el('circle',{r:120,fill:'url(#glowR)',opacity:.7},key7);const key7in=G(key7);makeKey(key7in);
T('جهّز عربونك.',{y:300,size:96,color:'navy',tin:48.55,tout:54.1,st:0.18});
T('لا تتردد... خذ خطوتك.',{y:440,size:70,color:'gold',tin:50.55,tout:54.1,st:0.15});
function drawS7(t){
 cam(s7c,540,1310,1+0.06*P(t,48.7,54.9));
 tf(villa7W,540-72*2.3,1500,2.3);op(rim7,P(t,49.0,50.0)*(0.6+0.4*Math.sin(t*3)));
 tf(c7.root,380,1880,1.2);c7.turn=0;c7.expr='happy';c7.blink=blinkV(t,.5);c7.armR.ik=[150,-600,1];c7.armL.u=7;c7.tilt=-2;drawMan(c7,t);
 const kx=380+150*1.2,ky=1880-630*1.2;
 tf(key7,kx,ky,0.6*(1+0.3*eio(P(t,53.3,54.0))),-15);key7in.setAttribute('transform',`scale(${Math.cos(eio(P(t,53.2,54.2))*Math.PI*4).toFixed(3)},1)`);
 const ein=eback(P(t,48.9,49.5));tf(env7W,kx+150,ky+150+Math.sin(t*2)*5,0.42*ein,-8);op(env7W,P(t,48.9,49.05));drawEnvelope(env7,eio(P(t,49.6,50.0)),eo(P(t,50.0,50.5)));
}
// =============== S8 FINAL (54.6-68) ===============
const s8=G(S),s8c=G(s8);
H(s8c,`<rect width="1080" height="1920" fill="#FAF6EE"/><g stroke="#E9DDC6" stroke-width="2" fill="none"><circle cx="540" cy="760" r="520"/><circle cx="540" cy="760" r="700"/><path d="M0 760 H1080 M540 0 V1600"/></g>`);
const sky8=G(s8c);const lay=[G(sky8),G(sky8),G(sky8)];
{const r=rnd(5);let x=-400;let s='';while(x<1500){const w=70+r()*120,h=180+r()*420;s+=`<rect x="${x}" y="${1920-h-120}" width="${w}" height="${h+120}" fill="#EBE0CC"/>`;x+=w+10;}H(lay[0],s);
 for(let i=0;i<6;i++){const g=G(lay[1]);(i%2?makeCommercial:makeApartment)(g);tf(g,-320+i*330,1860,0.9+(i%3)*0.12);}
 for(let i=0;i<5;i++){const g=G(lay[2]);const v=makeVilla(g);drawVilla(v,1,0.4,false);tf(g,-250+i*420,1930,0.75);}
 el('rect',{x:-600,y:1905,width:2400,height:40,fill:'#E2D3B8'},lay[2]);}
const logoB=G(s8c);const logoBimg=el('image',{href:'logo.png',x:0,y:0,width:LW,height:LH},G(logoB,{'clip-path':'url(#logoClipB)'}));
const barB=el('rect',{x:-30,y:-40,width:60,height:LH+80,fill:'url(#barG)'},logoB);const lcB=document.getElementById('lcB');
const shine=G(logoB,{mask:'url(#logoMask)'});const shineR=el('rect',{x:-300,y:-50,width:260,height:LH+100,fill:'url(#shineG)',transform:'skewX(-20)'},shine);
T('الرأي والعقار في مكان واحد.',{y:900,size:72,color:'gold',tin:56.65,tout:58.75,st:0.14});
T('الرأي والعقار في مكان واحد.',{y:318,size:50,color:'gold',tin:59.0,tout:99,st:0.1});
T('يالله اتصل... لا تنوم!',{y:398,size:46,w:700,color:'ivory',tin:62.35,tout:99,raw:true,wrap:['<span class="pill">','</span>'],pop:true,dur:.5});
T('الشعلان العقارية... تقدم لك الرأي والعقار.',{y:1392,size:42,w:700,color:'navy',tin:64.2,tout:99,raw:true,pop:true,wrap:['<span style="display:inline-block;background:#FAF6EE;border:2px solid #D9C08C;border-radius:50px;padding:4px 34px 0;box-shadow:0 10px 24px rgba(28,51,80,.15)">','</span>']});
const card=document.createElement('div');card.id='card';
const row=(ic,small,lb,val,cls)=>`<div class="row r"><div class="ic${small?' s':''}">${iconSVG(ic,small?40:50,'#EBD7A8')}</div><div><div class="lb">${lb}</div><div class="${cls}">${val}</div></div></div>`;
card.innerHTML=`<div class="hdr r">للتواصل والاستفسار:</div>${row('phone',0,'الجوال الأول:','0599818181','num')}${row('phone',0,'الجوال الثاني:','0535422918','num')}<div class="div r"></div>
${row('mail',1,'البريد الإلكتروني:','info@alshalaan.sa','sm')}${row('globe',1,'الموقع الإلكتروني:','www.alshalaan.sa','sm')}<div class="div r"></div>${row('pin',1,'العنوان:','الرياض – حي الشفاء – شرق معارض السيارات.','ad')}`;
card.style.display='none';TL.appendChild(card);const cardRows=[...card.querySelectorAll('.r')];
function drawS8(t){
 const pan=eio(P(t,54.6,57.2)),al=eio(P(t,56.3,57.8));const sc=lerp(1.35,0.8,al);sky8.setAttribute('transform',`translate(540,1920) scale(${sc.toFixed(4)}) translate(-540,-1920)`);
 [60,170,330].forEach((d,i)=>tf(lay[i],lerp(d,-d*0.4,pan)+Math.sin(t*0.3)*(i+1)*6*al,0));op(sky8,P(t,54.6,55.0));
 const up=eio(P(t,58.75,59.5));placeLogo(logoB,logoBimg,lcB,barB,540,lerp(700,210,up),lerp(900,600,up),P(t,55.0,56.0));op(logoB,P(t,54.95,55.05));
 const sh=P(t,64.8,65.9);shineR.setAttribute('x',lerp(-400,LW+300,sh).toFixed(1));op(shineR,sh>0&&sh<1?1:0);
 const cin=eo(P(t,58.85,59.6));card.style.display=t>58.8?'':'none';card.style.opacity=cin;card.style.transform=`translateY(${((1-cin)*140).toFixed(1)}px)`;
 cardRows.forEach((r,i)=>{const k=eo(P(t,59.1+i*0.1,59.6+i*0.1));r.style.opacity=k;r.style.transform=`translateX(${((1-k)*-40).toFixed(1)}px)`;});
}
// ---------------- OVERLAYS ----------------
const iris=el('circle',{cx:540,cy:760,r:0,fill:'#FAF6EE',stroke:'#E3C98F','stroke-width':16},TOP);
const iris2=el('circle',{cx:560,cy:1124,r:0,fill:'#FAF6EE',stroke:'#E3C98F','stroke-width':22},TOP);
const flash=el('rect',{width:1080,height:1920,fill:'#FFF6DE'},TOP);
const sweep=el('rect',{x:0,y:0,width:1080,height:260,fill:'url(#barG)',transform:'rotate(90 540 960)'},TOP);
const ivoryCover=el('rect',{width:1080,height:1920,fill:'#FAF6EE'},TOP);TOP.insertBefore(ivoryCover,TOP.firstChild);
function render(t){
 document.documentElement.style.setProperty('--bp',((t*35)%200).toFixed(1)+'%');card.style.display='none';rule.style.opacity=0;
 const sc=[[s1,0,9.35,drawS1],[s2,9.2,14.35,drawS2],[s3,14.1,26.45,drawS3],[s4,26.1,33.45,drawS4],[s5,33.2,45.6,drawS5],[s6,45.35,48.95,drawS6],[s7,48.7,54.95,drawS7],[s8,54.6,DUR+1,drawS8]];
 sc.forEach(([g,a,b,f],i)=>{const o=Math.min(i===0?1:P(t,a,a+0.25),i===sc.length-1?1:1-P(t,b-0.25,b));op(g,o);if(o>0.002)f(t);});
 const ir=eio(P(t,8.8,9.3));iris.setAttribute('r',(ir*1500).toFixed(1));op(iris,(ir>0?1:0)*(1-P(t,9.35,9.7)));
 const ir2=eio(P(t,54.0,54.65));iris2.setAttribute('r',(ir2*1700).toFixed(1));op(iris2,(ir2>0?1:0)*(1-P(t,54.75,55.1)));
 op(sweep,0);
 for(const [a,b] of [[13.9,14.5],[33.0,33.6]]){const sw=P(t,a,b);if(sw>0&&sw<1){op(sweep,Math.sin(sw*Math.PI));sweep.setAttribute('transform',`translate(0,${lerp(-300,1920,sw).toFixed(1)})`);}}
 op(ivoryCover,Math.min(P(t,25.8,26.2),1-P(t,26.35,26.55)));
 const fl=Math.max(Math.sin(Math.PI*P(t,2.2,2.65))*0.55,Math.sin(Math.PI*P(t,15.7,16.1))*0.35,Math.sin(Math.PI*P(t,39.5,40.1))*0.45,Math.sin(Math.PI*P(t,45.1,45.65))*0.9,Math.sin(Math.PI*P(t,48.45,49.05)));op(flash,fl);
 drawTexts(t);
 const dark=t<9.25||(t>14.2&&t<26.2);drawDust(t,dark?0.9:0.55,dark?'#F4DFA8':'#C9A86A');
 return true;
}
window.render=render;window.DUR=DUR;window.ready=document.fonts.ready.then(()=>{render(0);return true;});
