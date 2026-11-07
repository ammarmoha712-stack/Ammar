// ===== Text layer helpers (HTML) =====
function words(text,t,t0,t1,{size=56,color='#fff',weight=800,stag=0.07,dur=0.5,out=0.35}={}){
  const ws=text.split(' ');
  const fo=t1?1-tw(t,t1-out,t1,E.in):1;
  return ws.map((w,i)=>{const k=tw(t,t0+i*stag,t0+i*stag+dur,E.out);
    return `<span style="display:inline-block;opacity:${f(k*fo)};transform:translateY(${f((1-k)*40)}px);margin:0 ${f(size*0.13)}px">${w}</span>`}).join('');
}
function caption(text,t,t0,t1,opt={}){
  if(t<t0-0.1||t>t1+0.1)return '';
  const k=tw(t,t0,t0+0.45,E.out)*(1-tw(t,t1-0.35,t1,E.in));
  const y=opt.y||1000;
  return `<div style="position:absolute;left:0;right:0;top:${y-60}px;display:flex;justify-content:center;opacity:${f(Math.min(1,k*1.6))}">
   <div style="background:rgba(19,33,58,.92);border-radius:60px;padding:14px 46px 18px;box-shadow:0 12px 30px rgba(10,20,40,.25);transform:scale(${f(0.92+0.08*k)});position:relative;font-family:Tajawal;font-weight:800;font-size:${opt.size||50}px;color:#fff;direction:rtl;white-space:nowrap">
   <span style="position:absolute;right:22px;top:50%;width:10px;height:10px;margin-top:-5px;border-radius:50%;background:${C.gold}"></span>
   <span style="position:absolute;left:22px;top:50%;width:10px;height:10px;margin-top:-5px;border-radius:50%;background:${C.gold}"></span>
   ${words(text,t,t0+0.1,t1,{size:opt.size||50})}</div></div>`;
}
function headline(text,t,t0,t1,{x=960,y=200,size=72,color=C.navy,weight=800,align='center',stag=0.08,shadow=''}={}){
  if(t<t0-0.1||(t1&&t>t1+0.1))return '';
  const tf=align==='center'?'translateX(-50%)':align==='right'?'translateX(-100%)':'';
  return `<div style="position:absolute;left:${x}px;top:${y}px;transform:${tf};font-family:Tajawal;font-weight:${weight};font-size:${size}px;color:${color};direction:rtl;white-space:nowrap;text-align:${align};${shadow?`text-shadow:${shadow};`:''}">${words(text,t,t0,t1,{size,stag})}</div>`;
}

// ===== Scene 1: living room (0-7) =====
function scene1(t){
  const z=lerp(1,1.09,E.sine(clamp(t/7)));
  let g='';
  g+=rect(0,0,1920,1080,'#F3EDE3');
  g+=rect(0,790,1920,290,'#DCCDB4')+rect(0,790,1920,10,'#CDBB9C');
  // window
  g+=rect(1060,150,620,500,'url(#gDusk)')+'<g clip-path="url(#win1)">'+skyline('#2B4470',0.55,3,650,140)+skyline('#1B2D4B',0.9,7,650,80);
  for(let i=0;i<40;i++){const r=rnd(i+50);g+=rect(1070+r()*600,560+r()*80,5,7,'#FFD58A','',`opacity="${f(0.5+0.5*Math.sin(t*2+i))}"`)}
  g+='</g>';
  g+=rect(1060,150,620,500,'none',0,`stroke="${C.navy}" stroke-width="14"`)+rect(1364,150,12,500,C.navy);
  g+=P('M1020,120 L1110,120 Q1090,400 1120,690 L1010,690 Z','#E6D9C3')+P('M1720,120 L1630,120 Q1650,400 1620,690 L1730,690 Z','#E6D9C3')+rect(1000,112,740,14,C.goldD,7);
  // frame on wall
  g+=rect(170,190,220,160,'#fff',6,`stroke="${C.gold}" stroke-width="8"`)+P('M190,330 L250,250 L300,300 L330,270 L370,330 Z','#C8D6E6');
  // rug
  g+=`<ellipse cx="800" cy="930" rx="560" ry="70" fill="#C9B595"/><ellipse cx="800" cy="930" rx="520" ry="56" fill="none" stroke="${C.gold}" stroke-width="4" opacity=".7"/>`;
  // lamp + side table
  g+=rect(250,690,150,16,C.wood,6)+rect(270,706,12,190,C.wood)+rect(368,706,12,190,C.wood)+rect(318,590,14,100,C.goldD)+P('M265,520 L385,520 L410,600 L240,600 Z',C.goldL)+`<ellipse cx="325" cy="610" rx="120" ry="30" fill="#FFE2A8" opacity=".25"/>`;
  // plant
  g+=rect(1750,800,110,100,C.navy,10)+palm(1805,805,0.7,Math.sin(t)*4);
  // sofa
  g+=rect(470,500,640,230,C.navy2,40)+rect(440,620,120,260,C.navy,30)+rect(1020,620,120,260,C.navy,30)+rect(530,690,520,110,'#2F4C7A',22)+rect(520,790,560,90,C.navy,14);
  g+=rect(500,560,150,140,C.goldL,26,'transform="rotate(-8 575 630)"');
  // client seated
  const conf=t>2.3;
  const scroll=Math.sin(t*3)*3;
  g+=man({x:800,y:880,s:1,seated:true,t,expr:conf?(t>5?'worry':'confused'):'neutral',look:[0.4,0.9],tilt:conf?-4:2,
    L:[-30,-245],R:[38,-300+scroll],hold:{R:'phone',phoneAng:-12}});
  // phone glow
  g+=`<circle cx="845" cy="${f(880-300+90-30)}" r="70" fill="#9CC3F0" opacity="${f(0.18+0.06*Math.sin(t*5))}"/>`;
  // floating cards
  const cards=[[400,240,'villa','فيلا سكنية',0.6],[1190,215,'apt','شقة سكنية',1.1],[1450,470,'land','أرض',1.6],[300,530,'com','مبنى تجاري',2.1]];
  cards.forEach(([x,y,k,l,t0],i)=>{const p=pop(t,t0,0.55);if(p<=0)return;
    const by=Math.sin(t*1.8+i)*10;
    const inner=k==='villa'?G(tr(0,30,0.32),villa()):k==='apt'?G(tr(0,32,0.24),apartment()):k==='land'?G(tr(0,24,0.36),land()):G(tr(0,34,0.2),commercial());
    g+=card(x,y+by,0.9*p,inner,l,clamp(p*1.5),Math.sin(t+i)*3)});
  // question marks
  const q=pop(t,2.4,0.6);
  if(q>0) g+=qBubble(800,880-650+Math.sin(t*3)*8,1.15*q,1,Math.sin(t*2.4)*10);
  const q2=pop(t,4.6,0.5), q3=pop(t,5.2,0.5);
  if(q2>0) g+=qBubble(690,880-600+Math.sin(t*3+1)*8,0.62*q2,0.95,-15);
  if(q3>0) g+=qBubble(915,880-610+Math.sin(t*3+2)*8,0.55*q3,0.95,14);
  return G(`translate(860,560) scale(${f(z)}) translate(-860,-560)`,g);
}

// ===== Scene 2: choices (7-14.8) =====
function scene2(t){
  let g=rect(0,0,1920,1080,'url(#gSoft)');
  g+=circ(1350,520,420,'#fff','opacity=".5"')+circ(1350,520,300,'#fff','opacity=".45"');
  g+=`<ellipse cx="460" cy="975" rx="170" ry="22" fill="${C.navy}" opacity=".08"/>`;
  const tiles=[['villa','فيلا سكنية',7.3,1130,330],['apt','شقة سكنية',8.0,1570,330],['land','أرض',8.7,1130,720],['com','مبنى تجاري',9.4,1570,720]];
  let focus=Math.min(3,Math.max(0,Math.floor((t-7.3)/0.7)));
  // shuffle phase
  const sh=tw(t,11.0,12.2,E.io), sh2=tw(t,12.2,13.0,E.io);
  tiles.forEach(([k,l,t0,x,y],i)=>{
    const p=tw(t,t0,t0+0.6,E.out); if(p<=0)return;
    let X=lerp(2200,x,p), Y=y;
    // indecision swap
    const ang=(i*Math.PI/2)+sh*Math.PI*0.5+sh2*Math.PI*0.5;
    if(t>11){const cx=1350,cy=525;const r=Math.hypot(x-cx,y-cy);const a0=Math.atan2(y-cy,x-cx);const a=a0+(sh+sh2)*Math.PI*0.5;X=cx+r*Math.cos(a);Y=cy+r*Math.sin(a)}
    const fade=1-tw(t,13.3,13.9);
    const inner=k==='villa'?G(tr(0,30,0.32),villa()):k==='apt'?G(tr(0,32,0.24),apartment()):k==='land'?G(tr(0,24,0.36),land()):G(tr(0,34,0.2),commercial());
    const hl=(t<11&&i===focus)?1:0;
    g+=G(tr(X,Y,1.45*(1-0.25*tw(t,13.3,13.9))),(hl?rect(-136,-111,272,222,'none',24,`stroke="${C.gold}" stroke-width="6"`):'')+card(0,0,1,inner,l),fade);
  });
  // character
  const lookX=t<11?[1,1,1,1][focus]:Math.sin(t*4)*0.8;
  const think=t>10.6;
  const hx=t<11?lerp(270,290,Math.sin(t*2)*0.5+0.5):60;
  g+=man({x:460,y:960,s:1.13,t,expr:think?'think':'confused',look:[t<11?0.9:lookX,focus>=2&&t<11?0.5:-0.2],
    L:think?[-70,-200]:[-100,-210],R:think?[30,-455]:[hx,-350+focus*25],tilt:think?-6:Math.sin(t*1.5)*3});
  // question marks swirl and morph
  const qs=[[-120,-700,0.6,10.3],[115,-715,0.7,10.6],[0,-760,0.8,10.9]];
  const merge=tw(t,12.6,13.3,E.io), bulb=tw(t,13.3,13.8,E.out);
  qs.forEach(([dx,dy,s,t0],i)=>{const p=pop(t,t0,0.5);if(p<=0||bulb>=1)return;
    const X=460+lerp(dx+Math.sin(t*3+i)*10,0,merge), Y=960+lerp(dy,-790,merge);
    g+=qBubble(X,Y,s*p*lerp(1,1.3,merge),1-bulb,Math.sin(t*3+i)*12)});
  if(bulb>0){
    const X=460,Y=170, gl=tw(t,13.6,14.8,E.in);
    g+=circ(X,Y,80+bulb*60+gl*1400,'#FFF4DE',`opacity="${f(0.6*bulb)}" filter="url(#blur)"`);
    for(let i=0;i<12;i++){const a=i*Math.PI/6+t*0.6;g+=S(`M${f(X+Math.cos(a)*90)},${f(Y+Math.sin(a)*90)} L${f(X+Math.cos(a)*(110+bulb*60))},${f(Y+Math.sin(a)*(110+bulb*60))}`,C.gold,6,`opacity="${f(bulb)}"`)}
    g+=G(tr(X,Y,bulb),circ(0,0,62,C.gold)+circ(0,0,62,'none','stroke="#fff" stroke-width="5"')+sparkle(0,0,1.3,1,0,'#fff'));
    g+=rect(0,0,1920,1080,'#FFFDF8','',`opacity="${f(gl)}"`);
  }
  return g;
}

// ===== Scene 3a: logo reveal (14.8-17.2) =====
function scene3a(t){
  const lt=t-14.8;
  let g=rect(0,0,1920,1080,'#FFFFFF')+`<circle cx="960" cy="540" r="700" fill="url(#gGlow)"/>`;
  for(let i=0;i<18;i++){const a=i*Math.PI/9+lt*0.15;g+=P(`M960,540 L${f(960+Math.cos(a-0.05)*1300)},${f(540+Math.sin(a-0.05)*1300)} L${f(960+Math.cos(a+0.05)*1300)},${f(540+Math.sin(a+0.05)*1300)} Z`,C.goldL,`opacity="${f(0.13*tw(lt,0,0.8))}"`)}
  const rv=tw(lt,0.2,1.2,E.io), sc=lerp(1.08,1,tw(lt,0.2,2.2,E.out));
  const W=1240,H=W*365/1384;
  g+=`<clipPath id="lr"><rect x="${f(960+W/2-W*rv-20)}" y="0" width="${f(W*rv+40)}" height="1080"/></clipPath>`;
  g+=`<g clip-path="url(#lr)">${G(`translate(960,520) scale(${f(sc)}) translate(${f(-W/2)},${f(-H/2)})`,`<use href="#LOGO" transform="scale(${f(W/1384)})"/>`)}</g>`;
  // gold sweep line
  if(rv>0&&rv<1){const x=960+W/2-W*rv;g+=rect(x-3,520-H/2-30,6,H+60,C.gold)+`<circle cx="${f(x)}" cy="${f(520-H/2-30)}" r="8" fill="${C.gold}"/>`}
  // shimmer
  const sh=tw(lt,1.3,2.1,E.io);
  if(sh>0&&sh<1){g+=`<g clip-path="url(#lr)"><rect x="${f(lerp(200,1700,sh))}" y="300" width="80" height="460" fill="#fff" opacity=".55" transform="skewX(-20)"/></g>`}
  g+=rect(960-tw(lt,1.0,1.8,E.out)*300,520+H/2+50,tw(lt,1.0,1.8,E.out)*600,4,C.gold,2);
  return g;
}

// ===== Scene 3b: facade walk (17.2-19.6) =====
function facade(t,lt){
  let g=rect(0,0,1920,1080,'url(#gSky)');
  g+=skyline('#C9D6E6',1,11,760,220)+skyline('#B5C5DA',1,21,760,130);
  g+=rect(0,820,1920,260,'#E6DAC6')+rect(0,820,1920,14,'#D4C4A8')+rect(0,960,1920,120,'#CDBEA4');
  for(let i=0;i<12;i++)g+=rect(i*170,880,120,6,'#D9CCB3',3);
  // building
  g+=rect(460,150,1000,680,'#EEE6D8')+rect(440,130,1040,30,C.navy,4);
  g+=rect(500,185,920,180,'url(#gGlass)',4);for(let i=1;i<6;i++)g+=rect(500+i*153,185,6,180,'#fff','','opacity=".7"');
  g+=P('M520,190 L600,190 L520,330 Z','#fff','opacity=".2"');
  g+=rect(470,375,980,22,C.navy,3)+rect(470,397,980,6,C.gold);
  g+=rect(660,412,600,160,'#FFFFFF',10,`stroke="${C.gold}" stroke-width="4"`)+`<use href="#LOGO" transform="translate(685,423) scale(${f(550/1384)})"/>`;
  const op=tw(lt,1.6,2.1,E.io)*95;
  g+=rect(830,585,260,245,'#2A3F60',4);
  if(op>1) g+=rect(840,595,240,235,'#FFF3DC');
  g+=rect(838-op,595,120,235,'url(#gGlass)',2)+rect(962+op,595,120,235,'url(#gGlass)',2)+rect(944-op,690,8,40,C.gold,3)+rect(968+op,690,8,40,C.gold,3);
  g+=rect(500,595,300,225,'url(#gGlass)',4)+rect(1120,595,300,225,'url(#gGlass)',4);
  g+=palm(380,830,1.15,Math.sin(t)*5)+palm(1540,830,1.15,Math.sin(t+1)*5)+bush(560,830,0.9)+bush(1360,830,0.9);
  return g;
}
function scene3b(t){
  const lt=t-17.2;
  let g=facade(t,lt);
  // badge 40
  const b=pop(t,17.5,0.6);
  if(b>0){const n=Math.round(40*tw(t,17.6,18.8,E.out));
    g+=G(tr(1640,170,b),circ(0,0,120,C.navy)+circ(0,0,108,'none',`stroke="${C.gold}" stroke-width="5"`)+txt(0,22,'+'+n,84,C.goldL,800,'middle','direction="ltr"')+txt(0,62,'عاماً',30,'#fff',700));
  }
  // walking client
  const wk=tw(lt,0.1,2.1,E.lin);
  const x=lerp(150,960,E.io(wk)), ph=lt*9;
  const walking=wk>0&&wk<0.97;
  const sc=lerp(0.5,0.4,tw(lt,1.6,2.3));
  const ent=tw(lt,1.95,2.35);
  if(ent<1) g+=man({x,y:920-tw(lt,1.5,2.35)*85,s:sc,t,expr:'smile',look:[walking?1:0,0],walk:walking?Math.sin(ph):0,sway:walking?Math.sin(ph)*4:0,
    rot:walking?Math.sin(ph)*1.2:0,L:[-95+(walking?Math.sin(ph)*25:0),-215],R:[95-(walking?Math.sin(ph)*25:0),-215]}).replace('<g ',`<g opacity="${f(1-ent)}" `);
  const z=lerp(1,2.2,tw(lt,1.8,2.45,E.in));
  return G(`translate(960,700) scale(${f(z)}) translate(-960,-700)`,g)+rect(0,0,1920,1080,'#fff','',`opacity="${f(tw(lt,2.15,2.4))}"`);
}

// ===== Scene 3c: office (19.6-25.4) =====
function office(t){
  let g=rect(0,0,1920,1080,'#F2EEE7')+rect(1380,0,540,1080,C.navy)+rect(1380,0,10,1080,C.gold);
  // window with blinds
  g+=rect(120,140,420,420,'url(#gSky)',6)+skyline('#B5C5DA',1,5,560,120).replace('<g ','<g clip-path="url(#winClip)" ');
  for(let i=0;i<10;i++)g+=rect(120,150+i*42,420,6,'#fff','','opacity=".55"');
  g+=rect(120,140,420,420,'none',6,`stroke="#fff" stroke-width="14"`);
  // logo frame
  g+=rect(700,120,560,180,'#fff',10,`stroke="${C.gold}" stroke-width="5"`)+`<use href="#LOGO" transform="translate(725,145) scale(${f(510/1384)})"/>`;
  // shelf on navy wall
  g+=rect(1460,330,380,14,C.goldD,4)+rect(1490,250,40,80,C.goldL,4)+rect(1540,270,30,60,'#fff',4)+rect(1600,240,120,90,'#fff',6)+txt(1660,305,'40',54,C.navy,800,'middle','direction="ltr"');
  g+=rect(1460,560,380,14,C.goldD,4)+palm(1700,560,0.45,Math.sin(t)*3)+rect(1500,480,80,80,C.copper,6);
  g+=rect(0,860,1920,220,'#DCCFBA');
  return g;
}
function desk(){return rect(330,740,1260,30,'#8A5A3C',10)+rect(360,770,1200,320,C.navy,0)+rect(360,770,1200,8,C.gold)+rect(380,800,1160,2,'#2F4C7A')}
function scene3c(t){
  const lt=t-19.6;
  let g=office(t);
  const z=lerp(1.12,1.0,tw(lt,0,1.2,E.out));
  // characters
  const qd=tw(t,22.0,22.35), ck=pop(t,22.3,0.5);
  const happy=t>22.4;
  const nod=t>23&&t<24.2?Math.sin((t-23)*12)*4:0;
  g+=man({x:540,y:1010,s:1.18,seated:true,t,expr:happy?(t>23.2?'big':'smile'):'neutral',look:[0.8,0.2],nod,
    L:[-90,-220],R:[70,-250]});
  const talk=(t>19.8&&t<22)||(t>23.8&&t<25.2);
  g+=man({x:1340,y:1010,s:1.18,seated:true,older:true,t,expr:talk?'talk':'smile',look:[-0.9,0.3],tilt:-3,
    L:[-62,-318+Math.sin(t*2)*4],R:[62,-318+Math.sin(t*2)*4],hold:{both:'tablet',tabAng:-6}});
  g+=desk()+rect(470,700,120,46,'#fff',4)+rect(480,690,100,10,C.goldL,2)+rect(1100,690,26,52,C.goldD,4);
  // question -> check above client
  const hx=540,hy=1010-534*1.18-75;
  if(qd<1&&t>19.9) g+=qBubble(hx,hy+Math.sin(t*3)*6,0.8*pop(t,19.9)*(1-qd),1,Math.sin(t*2)*10);
  if(ck>0) g+=checkB(hx,hy,0.95*ck);
  // tablet UI inset
  const ti=pop(t,20.9,0.6), to=tw(t,24.9,25.3);
  if(ti>0){
    const opts=[['villa','فيلا',22.0],['apt','شقة',22.4],['land','أرض',22.8]];
    let u=rect(-330,-190,660,380,'#16233A',30)+rect(-310,-170,620,340,'#F7F9FC',16)+rect(-310,-170,620,54,C.navy,16)+rect(-310,-140,620,24,C.navy)+`<use href="#ICON" transform="translate(255,-163) scale(${f(40/340)})" opacity="0"/>`+txt(0,-132,'خيارات مناسبة لك',28,'#fff',800);
    opts.forEach(([k,l,t0],i)=>{const x=-200+i*200;const sel=i===0&&t>23.4;
      const inner=k==='villa'?G(tr(0,30,0.3),villa()):k==='apt'?G(tr(0,32,0.22),apartment()):G(tr(0,22,0.34),land());
      u+=G(tr(x,30,0.72),(sel?rect(-134,-109,268,218,'none',22,`stroke="${C.gold}" stroke-width="8"`):'')+card(0,0,1,inner,l));
      const c=pop(t,t0,0.4);if(c>0)u+=checkB(x+70,-40,0.5*c);
    });
    g+=G(`translate(945,${f(520)}) scale(${f(0.66*ti*(1-to))})`,`<g filter="url(#sh)">${u}</g>`);
  }
  return G(`translate(960,600) scale(${f(z)}) translate(-960,-600)`,g);
}

// ===== Scene 4: services (25.4-36.4) =====
const SERV=[['بيع وشراء العقارات',25.4],['التأجير',27.6],['التسويق العقاري',29.6],['الاستشارات العقارية',31.6],['نخدمكم في جنوب الرياض',33.8]];
function servArt(i,t,lt){
  let g='';
  if(i===0){ // buy/sell: villa + key handover hands
    g+=G(tr(0,120,1.05),villa(0.3));
    const k=tw(lt,0.5,1.4,E.io);
    const hx=lerp(260,60,k);
    g+=S(`M420,${f(250)} L${f(hx+40)},250`,C.thobeLn,52)+S(`M420,250 L${f(hx+40)},250`,C.thobe,46)+`<ellipse cx="${f(hx+18)}" cy="250" rx="26" ry="22" fill="#B9825F"/>`;
    g+=G(tr(hx-20,240,1.4,-10),keyShape());
    g+=S(`M-420,${f(300)} L${f(-140+k*50)},300`,C.thobeLn,52)+S(`M-420,300 L${f(-140+k*50)},300`,C.thobe,46)+`<ellipse cx="${f(-120+k*50)}" cy="300" rx="26" ry="22" fill="#CC9676"/>`;
    const s=pop(lt+25.4,26.6,0.4);if(s>0){for(let j=0;j<5;j++){const a=j*1.26;g+=sparkle(60+Math.cos(a)*90*s,250+Math.sin(a)*90*s,0.5*s,1-tw(lt,1.6,2.1),a*40)}}
    const sold=pop(lt+25.4,26.7,0.45);if(sold>0)g+=G(tr(230,-230,sold,-8),rect(-120,-42,240,84,C.gold,12)+txt(0,14,'تم البيع',44,'#fff',800));
  }
  if(i===1){ // rent
    g+=G(tr(0,240,1.0),apartment(1));
    const flip=tw(lt,0.8,1.2,E.io);
    g+=S('M190,-190 L250,-120',C.goldD,4)+G(tr(250,-60,1,Math.sin(lt*3)*6),rect(-110,-60,220,120,flip<0.5?C.navy:C.gold,14)+txt(0,16,flip<0.5?'للإيجار':'تم التأجير ✓',40,'#fff',800),1);
    const kk=pop(lt+27.6,28.4,0.45);if(kk>0)g+=G(tr(-250,-40,1.6*kk,-25),keyShape());
  }
  if(i===2){ // marketing phone
    g+=G(tr(0,0,1),rect(-170,-330,340,660,'#16202F',46)+rect(-152,-306,304,612,'#F4F7FB',30)+rect(-50,-300,100,18,'#16202F',9));
    const sc=lt*90;
    let list='';
    for(let j=0;j<5;j++){const y=-240+j*190-sc%190;const k=['villa','apt','com','land'][j%4];
      const inner=k==='villa'?G(tr(-60,48,0.2),villa()):k==='apt'?G(tr(-60,52,0.15),apartment()):k==='land'?G(tr(-60,40,0.22),land()):G(tr(-60,52,0.13),commercial());
      list+=G(tr(0,y),rect(-136,-80,272,170,'#fff',16,'filter="url(#sh)"')+rect(-126,-70,130,110,'#E4ECF5',10)+inner+rect(20,-56,100,12,C.navy,6)+rect(40,-34,80,9,'#9fb0c6',5)+rect(30,-16,90,9,'#9fb0c6',5)+rect(60,14,60,22,C.gold,11))}
    g+=`<g clip-path="url(#phClip)">${list}</g>`;
    const icons=[[220,-200,'♥',28.9+1.1],[-230,-60,'👁',30.2],[230,120,'★',30.6]];
    icons.forEach(([x,y,s,t0],j)=>{const p=pop(lt+29.6,29.9+j*0.35,0.45);if(p>0)g+=G(tr(x,y+Math.sin(lt*3+j)*8,p),circ(0,0,46,j===1?C.navy:C.copper)+txt(0,14,['+١٢٠','٣٤٠٠','٥٫٠'][j],30,'#fff',800,'middle'))});
  }
  if(i===3){ // consulting
    g+=G(tr(0,280,1),man({x:-170,y:0,s:0.95,older:true,t,expr:'talk',look:[0.8,0],L:[-100,-210],R:[150,-470+Math.sin(t*3)*15],hold:{}})+man({x:230,y:0,s:0.95,t,expr:'smile',look:[-0.8,0],L:[-90,-210],R:[90,-210],nod:Math.sin(t*6)*3,flip:true}));
    // chart board
    const p=pop(lt+31.6,31.8,0.5);
    if(p>0){let ch=rect(-150,-110,300,220,'#fff',16,'filter="url(#sh)"');
      [0.4,0.6,0.5,0.85].forEach((h,j)=>{const hh=150*h*tw(lt,0.3+j*0.12,0.8+j*0.12,E.out);ch+=rect(-110+j*60,70-hh,40,hh,j===3?C.gold:C.navy2,6)});
      ch+=S('M-110,40 L-50,10 L10,20 L90,-60',C.copper,5);
      g+=G(tr(30,-330,p),ch)}
  }
  if(i===4){ // map
    let m=rect(-430,-330,860,660,'#EFE6D6',30)+`<g clip-path="url(#mapClip)">`;
    m+=P('M-430,-120 C-200,-160 -60,-60 60,-90 C200,-120 300,-40 430,-60 L430,330 L-430,330 Z','#E6DBC6');
    m+=P('M-300,-200 L-120,-230 L-60,-90 L-240,-50 Z','#DCE6D2')+P('M80,40 L260,0 L300,150 L120,190 Z','#DCE6D2')+P('M-260,80 L-80,60 L-60,220 L-240,250 Z','#E8DCC8');
    m+=S('M-430,0 C-200,-40 200,40 430,-20','#fff',22)+S('M-430,0 C-200,-40 200,40 430,-20','#CFC2AB',2)+S('M-80,-330 C-60,-100 -120,100 -60,330','#fff',22)+S('M180,-330 C140,0 220,150 160,330','#fff',16)+S('M-430,200 C-100,170 100,260 430,200','#fff',16);
    m+=S('M-350,-330 C-420,-100 -300,250 0,300 C300,320 420,100 380,-330',C.gold,6,'stroke-dasharray="20 12" opacity=".8"');
    m+='</g>';
    const pins=[[-180,-120],[120,-40],[-40,150],[240,120],[-280,180]];
    pins.forEach(([x,y],j)=>{const p=tw(lt,0.3+j*0.25,0.75+j*0.25,E.back);if(p<=0)return;
      const pu=((lt*1.2+j*0.3)%1);
      m+=`<ellipse cx="${x}" cy="${y}" rx="${f(20+pu*40)}" ry="${f(8+pu*16)}" fill="none" stroke="${C.copper}" stroke-width="3" opacity="${f(1-pu)}"/>`;
      m+=G(tr(x,y-(1-p)*120,1),P('M0,0 C-10,-18 -26,-30 -26,-48 A26,26 0 1,1 26,-48 C26,-30 10,-18 0,0 Z',j%2?C.navy:C.copper)+circ(0,-48,10,'#fff'),clamp(p*2))});
    m+=G(tr(330,-250),circ(0,0,40,'#fff','filter="url(#sh)"')+P('M0,-28 L9,0 L0,28 L-9,0 Z',C.navy)+P('M0,-28 L9,0 L-9,0 Z',C.copper)+txt(0,-34,'N',18,C.navy,800));
    g+=m;
  }
  return g;
}
function scene4(t){
  const lt=t-25.4;
  let g=rect(0,0,1920,1080,C.cream)+P('M1160,0 L1920,0 L1920,1080 L1080,1080 Z',C.navy)+P('M1160,0 L1172,0 L1092,1080 L1080,1080 Z',C.gold);
  for(let i=0;i<6;i++)g+=circ(1500+(i%3)*120,860+Math.floor(i/3)*60,4,C.gold,'opacity=".5"');
  g+=circ(560,560,400,'#fff','opacity=".7"');
  let cur=0;SERV.forEach(([l,t0],i)=>{if(t>=t0)cur=i});
  // art with transitions
  SERV.forEach(([l,t0],i)=>{
    const t1=i<4?SERV[i+1][0]&&SERV[i+1][1]:36.6;
    if(t<t0-0.05||t>t1+0.4)return;
    const a=tw(t,t0,t0+0.5,E.out), b=tw(t,t1-0.05,t1+0.35,E.in);
    const sc=lerp(0.85,1,a)*lerp(1,1.1,b);
    g+=G(`translate(${f(560+(1-a)*-80+b*60)},560) scale(${f(sc)})`,servArt(i,t,t-t0),a*(1-b));
  });
  return g;
}
function scene4text(t){
  let h='';
  let cur=0;SERV.forEach(([l,t0],i)=>{if(t>=t0)cur=i});
  const [l,t0]=SERV[cur];
  const t1=cur<4?SERV[cur+1][1]:36.4;
  const num=['01','02','03','04','05'][cur];
  const k=tw(t,t0,t0+0.5,E.out)*(1-tw(t,t1-0.3,t1,E.in));
  h+=`<div style="position:absolute;right:120px;top:230px;width:640px;text-align:right;direction:rtl;font-family:Tajawal;opacity:${f(k)}">
    <div style="font-size:120px;font-weight:800;color:${C.gold};line-height:1;opacity:.9;transform:translateY(${f((1-k)*30)}px)">${num}</div>
    <div style="width:${f(140*k)}px;height:6px;background:${C.gold};border-radius:3px;margin:22px 0 26px auto"></div></div>`;
  h+=headline(l,t,t0+0.12,t1,{x:1800,y:430,size:60,color:'#fff',align:'right'});
  // list
  const L=['بيع وشراء','تأجير','تسويق','استشارات','جنوب الرياض'];
  const lk=tw(t,25.6,26.2,E.out)*(1-tw(t,36.1,36.4));
  h+=`<div style="position:absolute;right:120px;top:640px;direction:rtl;font-family:Tajawal;display:flex;flex-direction:column;gap:14px;opacity:${f(lk)}">`+
   L.map((x,i)=>`<div style="display:flex;align-items:center;gap:16px;font-size:34px;font-weight:${i===cur?800:500};color:${i===cur?'#fff':'rgba(255,255,255,.45)'}"><span style="width:${i===cur?40:14}px;height:6px;border-radius:3px;background:${i<=cur?C.gold:'rgba(255,255,255,.3)'}"></span>${x}</div>`).join('')+'</div>';
  h+=caption('خدمات عقارية متكاملة… بخبرة راسخة',t,30.3,36.2,{y:1000,size:46});
  return h;
}

// ===== Scene 5a: tablet close-up (36.4-38.7) =====
function scene5a(t){
  const lt=t-36.4;
  let g=office(t).replace(/^/, '');
  g=`<g filter="url(#blur2)">${g}${desk()}</g>`+rect(0,0,1920,1080,C.navy,'','opacity=".35"');
  const z=lerp(1,3.2,tw(t,38.25,38.75,E.in));
  const pin=pop(t,36.5,0.6);
  let u=rect(-520,-330,1040,660,'#141F33',44)+rect(-490,-300,980,600,'#F7F9FC',22);
  u+=rect(-470,-280,500,360,'#DCE7F3',18)+G(tr(-220,40,0.68),villa(0))+txt(250,-200,'فيلا سكنية',58,C.navy,800)+txt(250,-140,'جنوب الرياض',34,C.goldD,700);
  u+=rect(80,-110,340,12,'#C9D3E0',6)+rect(140,-80,280,12,'#C9D3E0',6)+rect(110,-50,310,12,'#C9D3E0',6);
  ['٥ غرف','مساحة واسعة','موقع مميز'].forEach((s,i)=>u+=G(tr(350-i*150,-2),rect(-70,-24,140,48,'#EDF1F7',24)+txt(0,9,s,22,C.navy,700)));
  const tap=tw(t,37.6,37.75), sel=t>37.7;
  u+=G(tr(250,170,1-0.06*Math.sin(Math.PI*tap)),rect(-200,-46,400,92,sel?C.gold:C.navy,46)+txt(sel?-14:0,16,sel?'اختيار مناسب':'اختر هذا العقار',38,'#fff',800)+(sel?S('M120,0 L134,14 L160,-14','#fff',8):''));
  if(t>37.6){const r=tw(t,37.65,38.2,E.out);u+=circ(250,170,40+r*220,'none',`stroke="${C.gold}" stroke-width="6" opacity="${f(1-r)}"`)}
  // finger
  const fx=lerp(700,300,tw(t,36.9,37.6,E.io)), fy=lerp(520,210,tw(t,36.9,37.6,E.io));
  u+=G(tr(fx,fy,0.75,-35),S('M0,0 L0,320','#CDD2DA',94)+S('M0,0 L0,320','#FBFBF9',86)+`<ellipse cx="0" cy="-10" rx="36" ry="40" fill="#CC9676"/>`+rect(-14,-80,28,70,'#CC9676',14));
  g+=G(`translate(960,540) scale(${f(lerp(0.85,1,E.out(pin)))}) translate(${f(lerp(0,220,tw(t,38.25,38.75,E.in)))},${f(lerp(0,-40,tw(t,38.25,38.75,E.in)))}) scale(${f(z)})`,u,clamp(pin*1.5));
  return g;
}

// ===== Scene 5b: villa key handover (38.7-43.2) =====
function villaScene(t){
  let g=rect(0,0,1920,1080,'url(#gWarm)');
  g+=circ(1500,260,120,'#FFE9C2','opacity=".8"')+circ(1500,260,220,'#FFE9C2','opacity=".25"');
  g+=skyline('#E2D6C6',1,31,780,150);
  g+=rect(0,800,1920,280,'#E4D6BE')+rect(0,800,1920,30,'#9DBB86')+rect(0,980,1920,100,'#D8C8AC');
  g+=P('M820,830 L1100,830 L1300,1080 L620,1080 Z','#D3C2A3');
  g+=G(tr(1000,812,1.75),villa(0.15));
  g+=palm(230,840,1.5,Math.sin(t)*6)+palm(1720,840,1.4,Math.sin(t+2)*6)+bush(120,840,1.3)+bush(1830,840,1.2);
  return g;
}
function scene5b(t){
  const lt=t-38.7;
  let g=villaScene(t);
  const z=lerp(1.3,1,tw(lt,0,1.6,E.out));
  const give=tw(t,39.4,40.0,E.io), back=tw(t,40.5,41.0,E.io), recv=tw(t,39.8,40.3,E.io);
  const got=t>40.25;
  const cR=[lerp(95,175,recv),lerp(-215,-330,recv)];
  const raise=tw(t,41.0,41.6,E.back);
  const clientR=got?[lerp(175,140,raise),lerp(-330,-560,raise)]:cR;
  g+=man({x:820,y:1000,s:1.0,t,expr:got?'big':'smile',look:[0.9,0.2],L:[-95,-215],R:clientR,hold:got?{R:'key',keyAng:-60*raise-20}:{}});
  const consR=[lerp(lerp(-95,-185,give),-95,back),lerp(lerp(-215,-330,give),-215,back)];
  g+=man({x:1240,y:1000,s:1.0,older:true,t,expr:'smile',look:[-0.9,0.2],L:consR,R:[95,-215],hold:got?{}:{L:'key',keyAng:-160}});
  if(t>40.2){const s=tw(t,40.2,41.2,E.out);for(let j=0;j<8;j++){const a=j*Math.PI/4;g+=sparkle(1000+Math.cos(a)*s*140,670+Math.sin(a)*s*140,0.6*(1-s*0.5),1-tw(t,40.9,41.4),a*50)}}
  return G(`translate(1000,700) scale(${f(z)}) translate(-1000,-700)`,g);
}

// ===== Scene 6a: panorama (43.2-45.8) =====
function scene6a(t){
  const lt=t-43.2;
  const z=lerp(1,1.6,tw(lt,0,2.6,E.in)), px=lerp(-80,0,tw(lt,0,2.6,E.out));
  let g=rect(0,0,1920,1080,'url(#gDusk2)');
  g+=circ(960,620,260,'#FFE0B0','opacity=".45" filter="url(#blur)"');
  g+=skyline('#3A5582',0.6,41,760,330)+skyline('#2A4470',0.85,43,820,220);
  g+=G(tr(400+px,860,0.85),commercial(0))+G(tr(1520-px,860,0.95),apartment(1))+G(tr(960,880,1.1),commercial(0));
  g+=rect(0,860,1920,220,'#1A2A47');
  g+=G(tr(260+px*1.5,1000,1.05),villa(1))+G(tr(1660-px*1.5,1000,1.05),villa(1))+G(tr(960,1010,0.9),villa(1));
  g+=palm(80,1010,1.4,Math.sin(t)*5)+palm(1850,1010,1.4,Math.sin(t+1)*5)+palm(640,1010,1.0)+palm(1290,1010,1.0);
  for(let i=0;i<30;i++){const r=rnd(i+300);g+=circ(r()*1920,r()*400,1.6,'#fff',`opacity="${f(0.3+0.4*Math.sin(t*3+i))}"`)}
  // gold icon glow at center top of center tower
  const ic=pop(t,44.4,0.6);
  g+=`<circle cx="960" cy="260" r="${f(60+ic*40)}" fill="#FFE9C2" opacity="${f(ic*0.6)}" filter="url(#blur)"/>`;
  const out=tw(t,45.3,45.8,E.in);
  return G(`translate(960,330) scale(${f(z)}) translate(-960,-330)`,g)+rect(0,0,1920,1080,'#fff','',`opacity="${f(out)}"`);
}
function scene6aText(t){
  return headline('أكثر من 40 عاماً من الخبرة',t,44.0,45.6,{x:960,y:330,size:92,color:'#fff',shadow:'0 6px 30px rgba(0,0,0,.35)'});
}

// ===== Scene 6b: end card (45.8-56) =====
function scene6b(t){
  const lt=t-45.8;
  let g=rect(0,0,1920,1080,'#FFFFFF')+`<circle cx="960" cy="330" r="760" fill="url(#gGlow)" opacity=".8"/>`;
  g+=G('translate(0,90)',skyline('#F1EBE0',1,51,1000,170)+skyline('#E9E0D0',1,53,1000,90));
  g+=rect(0,1060,1920,20,C.navy)+rect(0,1052,1920,8,C.gold);
  const W=1000,H=W*365/1384, sc=lerp(1.25,1,tw(lt,0,1.0,E.out));
  g+=G(`translate(960,${f(lerp(470,250,tw(lt,0.9,1.8,E.io)))}) scale(${f(sc)}) translate(${f(-W/2)},${f(-H/2)})`,`<use href="#LOGO" transform="scale(${f(W/1384)})"/>`,clamp(lt*3));
  const ln=tw(lt,1.6,2.4,E.out);
  g+=rect(960-ln*360,425,ln*720,4,C.gold,2)+circ(960,427,ln*9,C.gold);
  return g;
}
function scene6bText(t){
  let h='';
  const chips=['خبرة تتجاوز 40 عاماً','خدمات عقارية متكاملة','نخدمكم في جنوب الرياض'];
  h+=`<div style="position:absolute;left:0;right:0;top:470px;display:flex;justify-content:center;gap:26px;direction:rtl;font-family:Tajawal">`+chips.map((c,i)=>{const k=tw(t,47.6+i*0.35,48.1+i*0.35,E.out);return `<div style="opacity:${f(k)};transform:translateY(${f((1-k)*30)}px);background:${i===1?C.navy:'#fff'};color:${i===1?'#fff':C.navy};border:3px solid ${C.navy};border-radius:50px;padding:10px 34px 14px;font-size:38px;font-weight:800">${c}</div>`}).join('')+'</div>';
  h+=headline('الشعلان العقارية… خبرة تثق بها، واختيار تبدأ به مستقبلك.',t,52.7,0,{x:960,y:870,size:50,color:C.goldD,stag:0.06});
  const ph=(n,i)=>{const k=tw(t,50.0+i*0.3,50.6+i*0.3,E.back);return `<div style="opacity:${f(clamp(k))};transform:scale(${f(0.7+0.3*k)});display:flex;align-items:center;gap:16px;background:${C.navy};color:#fff;border-radius:22px;padding:16px 30px;font-family:Montserrat,Tajawal;font-weight:600;font-size:46px;letter-spacing:1px;direction:ltr;box-shadow:0 10px 24px rgba(27,45,75,.25)">
    <span style="width:52px;height:52px;border-radius:50%;background:${C.gold};display:inline-flex;align-items:center;justify-content:center">${n.icon}</span>${n.t}</div>`};
  const phoneI=`<svg width="28" height="28" viewBox="0 0 24 24"><path fill="#fff" d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1z"/></svg>`;
  const webI=`<svg width="30" height="30" viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-width="2" d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 0c3 3 3 17 0 20m0-20c-3 3-3 17 0 20M2 12h20"/></svg>`;
  h+=`<div style="position:absolute;left:0;right:0;top:735px;display:flex;justify-content:center;gap:28px">`+[{t:'0599818181',icon:phoneI},{t:'0535422918',icon:phoneI},{t:'www.alshalaan.sa',icon:webI}].map(ph).join('')+'</div>';
  const k=tw(t,49.6,50.2,E.out);
  h+=`<div style="position:absolute;left:0;right:0;top:670px;text-align:center;font-family:Tajawal;font-weight:700;font-size:34px;color:${C.navy};opacity:${f(k)};direction:rtl">للتواصل والاستفسار</div>`;
  const fo=tw(t,55.3,56,E.in);
  if(fo>0)h+=`<div style="position:absolute;inset:0;background:#fff;opacity:${f(fo*0)}"></div>`;
  return h;
}

// ===== Wipe transition =====
function wipe(t,tc,col=C.navy,d=0.32){
  if(t<tc-d||t>tc+d)return '';
  let x;
  if(t<tc){const k=E.in(tw(t,tc-d,tc,E.lin));x=lerp(1920,0,k);}
  else{const k=E.out(tw(t,tc,tc+d,E.lin));x=lerp(0,-2100,k);}
  return P(`M${f(x+200)},0 L${f(x+2200)},0 L${f(x+2000)},1080 L${f(x)},1080 Z`,col)+P(`M${f(x+200)},0 L${f(x+230)},0 L${f(x+30)},1080 L${f(x)},1080 Z`,C.gold)+P(`M${f(x+170)},0 L${f(x+180)},0 L${f(x-20)},1080 L${f(x-30)},1080 Z`,C.goldL,'opacity=".7"');
}

// ===== Master =====
function render(t){
  let art='',html='';
  if(t<7.0) art+=scene1(t);
  else if(t<14.8) art+=scene2(t);
  else if(t<17.2) art+=scene3a(t);
  else if(t<19.6) art+=scene3b(t);
  else if(t<25.4) art+=scene3c(t);
  else if(t<36.4) art+=scene4(t);
  else if(t<38.7) art+=scene5a(t);
  else if(t<43.2) art+=scene5b(t);
  else if(t<45.8) art+=scene6a(t);
  else art+=scene6b(t);
  // transitions
  art+=wipe(t,7.0)+wipe(t,17.2)+wipe(t,25.4)+wipe(t,36.4)+wipe(t,43.2);
  if(t>19.6&&t<20.0) art+=rect(0,0,1920,1080,'#fff','',`opacity="${f(1-tw(t,19.6,20.0))}"`);
  if(t>14.8&&t<15.3) art+=rect(0,0,1920,1080,'#FFFDF8','',`opacity="${f(1-tw(t,14.8,15.3))}"`);
  if(t>45.8&&t<46.2) art+=rect(0,0,1920,1080,'#fff','',`opacity="${f(1-tw(t,45.8,46.2))}"`);
  // text
  html+=caption('تبحث عن عقار مناسب في جنوب الرياض؟',t,0.3,6.75);
  html+=caption('الاختيار الصحيح يحتاج إلى خبرة ومعرفة بالسوق',t,7.5,13.2);
  html+=caption('خبرة نضعها بين يديك',t,21.0,23.0,{y:1010});
  html+=caption('لنساعدك على اتخاذ القرار المناسب',t,23.1,25.2,{y:1010});
  if(t>=25.3&&t<36.6) html+=scene4text(t);
  html+=caption('العقار ليس مجرد مكان… بل قرار مهم',t,36.6,38.4);
  html+=headline('اختيارك الصحيح يبدأ من الخبرة',t,40.5,43.1,{x:960,y:90,size:84,color:C.navy,shadow:'0 4px 24px rgba(255,255,255,.8)'});
  if(t>43.6&&t<45.8) html+=scene6aText(t);
  if(t>=45.8) html+=scene6bText(t);
  return {art,html};
}
