// ===== ADDRESS REAL ESTATE — vertical 1080x1920 =====
const FONT="'IBM Plex Sans Arabic'";
const IV='#F8F5EF', BG2='#EFE7D9';
const DUR=48;
// ---------- text ----------
function words(text,t,t0,t1,{size=60,stag=0.07,dur=0.5,out=0.35}={}){
  const fo=t1?1-tw(t,t1-out,t1,E.in):1; let i=0;
  return text.split('/').map(line=>line.trim().split(' ').map(w=>{const k=tw(t,t0+i*stag,t0+i*stag+dur,E.out);i++;
    return `<span style="display:inline-block;opacity:${f(k*fo)};transform:translateY(${f((1-k)*36)}px);margin:0 ${f(size*0.12)}px">${w}</span>`}).join('')).join('<br>');
}
function head(text,t,t0,t1,{y=240,size=70,color=C.navy,weight=700,lh=1.35,shadow=''}={}){
  if(t<t0-0.1||(t1&&t>t1+0.1))return '';
  return `<div style="position:absolute;left:50px;right:50px;top:${y}px;text-align:center;direction:rtl;font-family:${FONT};font-weight:${weight};font-size:${size}px;line-height:${lh};color:${color};${shadow?`text-shadow:${shadow};`:''}">${words(text,t,t0,t1,{size})}</div>`;
}
function pill(text,t,t0,t1,{y=1700,size=44,bg=C.navy,color='#fff'}={}){
  if(t<t0-0.1||t>t1+0.1)return '';
  const k=tw(t,t0,t0+0.45,E.out)*(1-tw(t,t1-0.3,t1,E.in));
  return `<div style="position:absolute;left:0;right:0;top:${y}px;display:flex;justify-content:center;opacity:${f(k)};transform:translateY(${f((1-k)*24)}px)"><div style="background:${bg};color:${color};border-radius:60px;padding:12px 44px 18px;font-family:${FONT};font-weight:600;font-size:${size}px;direction:rtl;box-shadow:0 12px 30px rgba(10,20,30,.18)">${text}</div></div>`;
}
// ---------- logo ----------
function logo(x,y,w,op=1,reveal=1,lineK=1){ // centered
  const s=w/384;
  let g=`<g transform="translate(${f(x-w/2)},${f(y-140*s/2)}) scale(${f(s)})">`;
  if(reveal<1) g+=`<clipPath id="lgc${Math.round(x)}"><rect x="${f(384-384*reveal-5)}" y="0" width="${f(384*reveal+10)}" height="100"/></clipPath>`;
  g+=`<g ${reveal<1?`clip-path="url(#lgc${Math.round(x)})"`:''}><path d="${LOGO_N}" fill="#0F202F" fill-rule="evenodd"/><path d="${LOGO_G}" fill="#C59C4B" fill-rule="evenodd" clip-path="url(#lgTop)"/></g>`;
  // bottom part: arabic (navy) is inside LOGO_N; underline gold
  g+=`<g clip-path="url(#lgBot)" opacity="${f(lineK)}"><path d="${LOGO_G}" fill="#C59C4B"/></g>`;
  return `<g opacity="${f(op)}">${g}</g></g>`;
}
// ---------- icons (24x24 grid, drawn centered) ----------
const IC={
 mega:'M3,10 L3,14 L6,14 L14,19 L14,5 L6,10 Z M17,9 Q19,12 17,15 M19,7 Q23,12 19,17',
 wrench:'M14,4 a5,5 0 0,0 5,7 L10,20 a2,2 0 0,1 -3,-3 L16,8 a5,5 0 0,0 -2,-4 Z',
 clip:'M7,4 L17,4 L17,21 L7,21 Z M10,3 L14,3 L14,6 L10,6 Z M9.5,10 L14.5,10 M9.5,13.5 L14.5,13.5 M9.5,17 L12.5,17',
 doc:'M6,3 L14,3 L18,7 L18,21 L6,21 Z M14,3 L14,7 L18,7 M9,11 L15,11 M9,14 L15,14 M9,17 L13,17',
 coins:'M5,9 a7,3 0 1,0 14,0 a7,3 0 1,0 -14,0 M5,9 L5,15 a7,3 0 0,0 14,0 L19,9 M5,12 a7,3 0 0,0 14,0',
 chat:'M4,5 L20,5 L20,15 L11,15 L6,19 L7,15 L4,15 Z M8,9 L16,9 M8,12 L13,12',
 chart:'M4,20 L20,20 M6,20 L6,13 M10,20 L10,9 M14,20 L14,12 M18,20 L18,5',
 gear:'M12,8 a4,4 0 1,0 0.01,0 M12,2 L12,5 M12,19 L12,22 M2,12 L5,12 M19,12 L22,12 M4.9,4.9 L7,7 M17,17 L19.1,19.1 M4.9,19.1 L7,17 M17,7 L19.1,4.9',
 key:'M8,12 a4,4 0 1,0 0.01,0 M12,12 L21,12 M18,12 L18,15 M21,12 L21,15',
 home:'M3,11 L12,4 L21,11 M6,9 L6,20 L18,20 L18,9 M10,20 L10,14 L14,14 L14,20',
 handshake:'M2,11 L6,8 L10,9 L14,7 L22,11 M2,11 L6,15 L10,18 L12,17 L18,13 L22,11 M10,9 L13,12',
 chartUp:'M3,17 L9,11 L13,14 L21,6 M16,6 L21,6 L21,11',
 bell:'M6,16 L6,11 a6,6 0 0,1 12,0 L18,16 L20,18 L4,18 Z M10,20 a2,2 0 0,0 4,0',
 check:'M5,12 L10,17 L19,7',
};
function icon(name,x,y,s=1,col='#fff',w=2){return `<g transform="translate(${f(x-12*s)},${f(y-12*s)}) scale(${f(s)})"><path d="${IC[name]}" fill="none" stroke="${col}" stroke-width="${f(w)}" stroke-linecap="round" stroke-linejoin="round"/></g>`}
function iconDisc(name,x,y,r,bg=C.navy,col='#fff',op=1){return G(`translate(0,0)`,circ(x,y,r,bg,'filter="url(#sh)"')+icon(name,x,y,r/16,col,2),op)}
function qBadge(x,y,s,op=1){return G(tr(x,y,s),circ(0,0,24,C.gold)+txt(0,10,'؟',34,'#fff',700),op)}
function okBadge(x,y,s,op=1){return G(tr(x,y,s),circ(0,0,24,'#3E9B6B')+S('M-10,0 L-3,8 L11,-8','#fff',5),op)}
// ---------- architecture ----------
function tower(fl=7,w=440,lit=0,v=0){
  const fh=92,h=fl*fh+70;let g='';
  const body=v===1?'#EDE4D4':v===2?'#F4EFE6':'#F2ECE2';
  g+=rect(-w/2,-h,w,h,body)+rect(w/2-w*0.22,-h,w*0.22,h,'#000','',`opacity=".06"`);
  g+=rect(-w/2-12,-h-18,w+24,22,C.navy,3);
  for(let r=0;r<fl;r++){const y=-h+40+r*fh;
    const cols=v===1?4:3, cw=(w-80)/cols;
    for(let c=0;c<cols;c++){const x=-w/2+40+c*cw;const on=lit>0&&((r*7+c*3+v)%4===1);
      g+=rect(x+6,y,cw-12,fh-34,on?'url(#gLit)':'url(#gGlass)',3,on?`opacity="${f(0.4+0.6*lit)}"`:'');}
    if(v!==2) g+=rect(-w/2+28,y+fh-36,w-56,8,C.navy,2,'opacity=".85"');
    else g+=rect(-w/2+30,y+fh-36,w*0.4,8,C.gold,2);
  }
  if(v===0) g+=rect(w/2-w*0.2,-h+30,w*0.12,h-110,'#A06C49','',`opacity=".9"`);
  g+=rect(-60,-80,120,80,'#7A5236',2)+rect(-78,-96,156,16,C.navy,3)+rect(-4,-50,8,20,C.gold,2);
  return g;
}
function groundStrip(y,w=1080){return rect(0,y,w,1920-y,'#E7DCC8')+rect(0,y,w,14,'#9DBB86')+rect(0,y+14,w,6,'#D9CBB2')}
function phone(w=360,h=720){return rect(-w/2,-h/2,w,h,'#101B27',48)+rect(-w/2+16,-h/2+18,w-32,h-36,'#F7F9FC',32)+rect(-50,-h/2+24,100,18,'#101B27',9)}
function worker(t,s=1,look=0){
  let g=`<ellipse cx="0" cy="2" rx="80" ry="12" fill="#0F202F" opacity=".12"/>`;
  g+=rect(-40,-250,36,240,'#22405A',8)+rect(4,-250,36,240,'#22405A',8)+rect(-46,-22,44,22,'#3A2A1E',8)+rect(2,-22,44,22,'#3A2A1E',8);
  g+=rect(-74,-470,148,240,'#22405A',34)+rect(-74,-360,148,14,C.gold)+rect(-74,-330,148,8,'#E8EEF3')+rect(-6,-470,12,120,'#1A3349');
  // arms
  g+=S('M-64,-440 L-92,-330 L-60,-270','#1A3349',36)+S('M64,-440 L110,-370 L70,-330','#1A3349',36);
  g+=G(tr(64,-340,1,-12),rect(-38,-58,76,104,'#C9A46A',8)+rect(-30,-46,60,84,'#fff',4)+S('M-20,-30 L-8,-18 L12,-40','#3E9B6B',5)+rect(-20,-8,40,5,'#9fb0c6',2)+rect(-20,6,30,5,'#9fb0c6',2)+rect(-20,20,36,5,'#9fb0c6',2));
  g+=circ(-60,-266,15,'#C08A69')+circ(66,-332,15,'#C08A69');
  g+=rect(-18,-500,36,36,'#B07A5A',8)+`<ellipse cx="0" cy="-540" rx="44" ry="52" fill="#C99472"/>`;
  g+=P('M-44,-548 C-44,-494 -22,-482 0,-482 C22,-482 44,-494 44,-548 C38,-520 26,-512 0,-514 C-26,-512 -38,-520 -44,-548 Z','#2A211D');
  g+=`<ellipse cx="${f(-16+look*4)}" cy="-546" rx="5.5" ry="${f(7*blinkAt(t,2))}" fill="#2A211D"/><ellipse cx="${f(16+look*4)}" cy="-546" rx="5.5" ry="${f(7*blinkAt(t,2))}" fill="#2A211D"/>`+S('M-10,-506 Q0,-498 10,-506','#5a2d25',3.5);
  g+=P('M-52,-566 Q-50,-628 0,-630 Q50,-628 52,-566 Z',C.gold)+rect(-64,-572,128,14,'#B38A3A',7)+rect(-6,-628,12,56,'#B38A3A',4);
  return G(`scale(${s})`,g);
}
function medallion(id,x,y,r,inner,label,op=1,s=1){
  return G(tr(x,y,s),`<clipPath id="${id}"><circle cx="0" cy="0" r="${r}"/></clipPath>`+circ(0,0,r+10,'#fff','filter="url(#sh)"')+circ(0,0,r,'#E9EFF4')+`<g clip-path="url(#${id})">${inner}</g>`+circ(0,0,r+10,'none',`stroke="${C.gold}" stroke-width="5"`)+(label?G(tr(0,r+52),rect(-120,-32,240,56,C.navy,28)+txt(0,10,label,30,'#fff',600)):''),op);
}
function bust(o,r){const s=r/240;return man(Object.assign({x:0,y:(530)*s*1.0+r*0.12,s,t:o.t},o))}
// ============ SCENES ============
// S1 0–6.4
function S1(t){
  let g=rect(0,0,1080,1920,'url(#gSkyV)');
  g+=circ(820,520,180,'#FFF1D6','opacity=".7"');
  g+=G('translate(0,1500)',skylineV('#E4DACB',1,7,0,260));
  const bt=tw(t,0.1,1.6,E.out);
  g+=`<clipPath id="bc1"><rect x="0" y="${f(1500-bt*1100)}" width="1080" height="${f(bt*1100+10)}"/></clipPath>`;
  g+=`<g clip-path="url(#bc1)">${G(tr(660,1500,1.0),tower(9,470,0,0))}</g>`;
  if(bt>0&&bt<1) g+=rect(400,1500-bt*1100-6,520,6,C.gold,3);
  g+=groundStrip(1500)+palmV(930,1520,1.15,Math.sin(t)*5)+bushV(180,1530,1.1)+bushV(1000,1540,0.9);
  // floating property elements
  const items=[[210,560,'villa',0.9],[870,1260,'chart',1.6],[200,1010,'doc',2.2]];
  items.forEach(([x,y,k,t0],i)=>{const p=pop(t,t0,0.55);if(p<=0)return;const by=Math.sin(t*1.8+i)*10;
    let inner='';
    if(k==='villa') inner=card(0,0,1,G(tr(0,30,0.32),villa()),'فيلا سكنية');
    if(k==='chart') inner=G('',rect(-120,-100,240,200,'#fff',20,'filter="url(#sh)"')+[0.35,0.55,0.45,0.8].map((h,j)=>rect(-80+j*44,60-110*h*tw(t,t0+0.2+j*0.1,t0+0.7+j*0.1,E.out),30,110*h*tw(t,t0+0.2+j*0.1,t0+0.7+j*0.1,E.out),j===3?C.gold:C.navy2,5)).join('')+S('M-80,0 L-30,-20 L20,-10 L80,-60',C.gold,4)+rect(-80,72,160,8,'#DDE3EA',4));
    if(k==='doc') inner=G('',rect(-90,-115,180,230,'#fff',14,'filter="url(#sh)"')+rect(-60,-80,120,12,C.navy,6)+[0,1,2,3].map(j=>rect(-60,-48+j*26,j===3?70:120,8,'#C9D3E0',4)).join('')+circ(40,70,22,C.gold)+circ(40,70,12,'none','stroke="#fff" stroke-width="3"'));
    g+=G(tr(x,y+by,0.95*p,Math.sin(t+i)*3),inner,clamp(p*1.6));});
  // challenge bubbles on building
  const ch=[['mega',890,780,3.7],['wrench',890,960,4.1],['clip',890,1140,4.5]];
  ch.forEach(([n,x,y,t0],i)=>{const p=pop(t,t0,0.5);if(p<=0)return;const by=Math.sin(t*2.4+i)*6;
    g+=G(tr(x,y+by,p),circ(0,0,62,C.navy,'filter="url(#sh)"')+icon(n,0,0,3.4,'#fff',2)+qBadge(46,-46,1));});
  // owner
  const conf=t>3.5;
  g+=man({x:370,y:1640,s:1.2,t,expr:conf?'think':'neutral',look:[0.9,-0.4],tilt:conf?-4:-2,L:[-96,-210],R:[150,-300],hold:{R:'key',keyAng:-40}});
  const z=lerp(1,1.07,E.sine(clamp(t/6.4)));
  return G(`translate(540,1100) scale(${f(z)}) translate(-540,-1100)`,g);
}
function skylineV(col,op,seed,y0,h0){const r=rnd(seed);let g='',x=-30;while(x<1110){const w=60+r()*90,h=h0*(0.35+r());g+=rect(x,y0-h,w,h+10,col);x+=w+r()*12}return `<g opacity="${op}">${g}</g>`}
function palmV(x,y,s,sw){return palm(x,y,s,sw)}
function bushV(x,y,s){return bush(x,y,s)}
// S2a logo 6.4–8.1 ; S2b office 8.1–10.6 ; S2c meeting 10.6–13.0
function S2a(t){
  let g=rect(0,0,1080,1920,IV)+`<circle cx="540" cy="900" r="620" fill="url(#gGlow)"/>`;
  // geometric deco
  for(let i=0;i<6;i++){const k=tw(t,6.4+i*0.08,7.2+i*0.08,E.out);g+=P(`M540,${900-260-i*60} L${540+(260+i*60)},900 L540,${900+260+i*60} L${540-(260+i*60)},900 Z`,'none',`stroke="${C.gold}" stroke-width="1.5" opacity="${f(0.25*k*(1-i/7))}" stroke-dasharray="${f(3000*k)} 3000"`)}
  const ln=tw(t,6.4,7.0,E.io);
  const W=900,s=W/384,x0=540-W/2,y0=900-70*s;
  // the travelling gold line -> becomes underline
  const lk=tw(t,7.0,7.6,E.io);
  const lx1=lerp(1080-1080*ln,x0+8*s,lk), lx2=lerp(1080,x0+122*s,lk), ly=lerp(900,y0+109.5*s,lk);
  g+=rect(lx1,ly-3,Math.max(0,lx2-lx1),6,C.gold,3);
  const rv=tw(t,7.15,7.9,E.io);
  if(rv>0) g+=logo(540,900,W,1,rv,0);
  return g;
}
function officeBG(t){
  let g=rect(0,0,1080,1920,'#F4EFE7')+rect(0,0,1080,392,'#F8F4ED');
  g+=rect(680,400,400,1100,C.navy)+rect(680,400,8,1100,C.gold)+rect(0,392,1080,8,C.gold,'','opacity=".6"');
  g+=rect(90,470,480,280,'#fff',12,`stroke="${C.gold}" stroke-width="5"`)+logo(330,610,400);
  g+=rect(760,450,240,330,'url(#gSkyV)',6)+rect(760,450,240,330,'none',6,'stroke="#fff" stroke-width="10"');for(let i=0;i<7;i++)g+=rect(760,462+i*46,240,5,'#fff','','opacity=".5"');
  g+=rect(760,920,250,12,C.goldD,4)+rect(790,820,70,100,'#fff',6)+rect(880,850,40,70,C.goldL,6)+rect(940,860,50,60,'#C6764E',6);
  g+=rect(0,1500,1080,420,'#DCCFBA')+rect(0,1500,1080,10,'#CDBB9C');
  g+=palm(140,1510,0.75,Math.sin(t)*3)+rect(90,1440,100,80,C.navy,10);
  return g;
}
function S2b(t){
  let g=officeBG(t);
  const wk=tw(t,8.1,8.95,E.lin), walking=wk>0&&wk<1, ph=t*9;
  const ox=lerp(-120,380,E.io(wk));
  const shake=tw(t,9.05,9.35,E.io)*(1-tw(t,10.2,10.5,E.io));
  const sy=Math.sin((t-9.3)*16)*8*(t>9.35&&t<10.2?1:0);
  g+=man({x:720,y:1600,s:1.05,older:true,t,expr:t>8.6?'smile':'neutral',look:[-0.9,0],
    L:[lerp(-96,-152,shake),lerp(-210,-300+sy,shake)],R:[96,-210]});
  g+=man({x:ox,y:1600,s:1.05,t,expr:t>9.2?'smile':'neutral',look:[0.9,0],walk:walking?Math.sin(ph):0,sway:walking?Math.sin(ph)*4:0,rot:walking?Math.sin(ph)*1.2:0,
    L:[-96+(walking?Math.sin(ph)*20:0),-210],R:[lerp(96,160,shake),lerp(-210,-300+sy,shake)]});
  if(shake>0.9) {const p=tw(t,9.35,9.8);for(let j=0;j<6;j++){const a=j*1.05-1.6;g+=sparkle(550+Math.cos(a)*p*120,1290+Math.sin(a)*p*120,0.4*(1-p*0.6),1-tw(t,9.7,10.0),a*40)}}
  return G(`translate(540,1200) scale(${f(lerp(1,1.06,tw(t,8.1,10.6)))}) translate(-540,-1200)`,g);
}
function S2c(t){
  let g=officeBG(t);
  g+=man({x:300,y:1700,s:1.12,seated:true,t,expr:t>11.6?'smile':'neutral',look:[0.9,0.3],L:[-90,-220],R:[80,-250]});
  g+=man({x:780,y:1700,s:1.12,seated:true,older:true,t,expr:'talk',look:[-0.9,0.3],tilt:-3,L:[-62,-318],R:[62,-318],hold:{both:'tablet',tabAng:-6}});
  g+=rect(40,1380,1000,26,'#8A5A3C',10)+rect(70,1406,940,520,C.navy)+rect(70,1406,940,6,C.gold)+rect(170,1340,130,44,'#fff',4)+rect(180,1330,110,10,C.goldL,2);
  // tablet UI pops
  const p=pop(t,11.3,0.6), ex=tw(t,12.55,13.0,E.in);
  if(p>0){
    let u=rect(-380,-300,760,600,'#101B27',40)+rect(-356,-276,712,552,'#F7F9FC',24)+rect(-356,-276,712,80,C.navy,24)+rect(-356,-226,712,30,C.navy)+txt(0,-224,'خدماتنا العقارية',34,'#fff',600);
    const ics=['mega','clip','wrench','key','handshake','chartUp'];
    ics.forEach((n,i)=>{const cx=-220+(i%3)*220, cy=-60+Math.floor(i/3)*200;const q=pop(t,11.6+i*0.1,0.4);
      u+=G(tr(cx,cy,q),rect(-90,-80,180,160,'#fff',22,'filter="url(#sh)"')+circ(0,-10,46,i%2?C.gold:C.navy)+icon(n,0,-10,2.4,'#fff',2)+rect(-50,52,100,8,'#C9D3E0',4))});
    g+=G(`translate(540,${f(lerp(760,960,ex))}) scale(${f(p*lerp(1,1.6,ex))})`,u,1-ex*0.0);
    if(ex>0) g+=rect(0,0,1080,1920,IV,'',`opacity="${f(ex)}"`);
  }
  return g;
}
// S3 services 13.0–20.6
const SV=[['التسويق العقاري',13.0,'mega'],['إدارة الأملاك',14.4,'clip'],['إدارة وتشغيل العقارات',15.8,'wrench'],['تأجير الوحدات العقارية',16.9,'key'],['بيع وشراء العقارات',18.0,'home'],['الوساطة العقارية',19.2,'handshake']];
function svArt(i,t,lt){
  let g='';
  if(i===0){
    const m=tw(lt,0.35,0.9,E.io);
    g+=G(tr(0,lerp(260,-40,m),lerp(1.15,0.5,m)),villa(0.2),1);
    const ph=tw(lt,0.3,0.8,E.out);
    if(ph>0){let u=phone(420,820);
      u+=rect(-176,-340,352,250,'#E4ECF5',18)+G(tr(0,-120,0.5),villa(0))+rect(-176,-70,200,20,C.navy,8)+rect(-176,-38,150,12,'#9fb0c6',6)+rect(80,-70,96,40,C.gold,20);
      [0,1].forEach(j=>{const q=tw(lt,0.7+j*0.15,1.1+j*0.15,E.out);u+=G(tr(0,60+j*150+(1-q)*60),rect(-176,-62,352,130,'#fff',16,'filter="url(#sh)"')+rect(-160,-48,120,100,'#E4ECF5',10)+G(tr(-100,40,0.17),j?apartment():commercial())+rect(-20,-36,170,14,C.navy,7)+rect(10,-10,140,10,'#9fb0c6',5)+rect(70,18,80,30,C.gold,15),q)});
      g+=G(tr(0,0,lerp(0.6,1,ph)),u,ph);
      [[230,-330,'mega',0.8],[-240,-180,'bell',0.95],[240,140,'chartUp',1.1]].forEach(([x,y,n,t0],j)=>{const q=pop(lt,t0,0.4);if(q>0)g+=G(tr(x,y+Math.sin(lt*4+j)*8,q),circ(0,0,54,j===1?C.gold:C.navy,'filter="url(#sh)"')+icon(n,0,0,2.8,'#fff',2))});
    }
  }
  if(i===1){
    g+=G(tr(-230,420,0.95),apartment(1));
    let d=rect(-200,-300,400,600,'#fff',28,'filter="url(#sh)"')+rect(-200,-300,400,80,C.navy,28)+rect(-200,-250,400,30,C.navy)+txt(0,-248,'لوحة الإدارة',30,'#fff',600);
    [['doc','العقود'],['coins','التحصيل'],['chat','المستأجرون'],['chart','التقارير']].forEach(([n,l],j)=>{const q=tw(lt,0.2+j*0.18,0.55+j*0.18,E.out);
      d+=G(tr(0,-150+j*120+(1-q)*30),rect(-170,-48,340,96,'#F3F6FA',18)+circ(120,0,32,j%2?C.gold:C.navy)+icon(n,120,0,1.7,'#fff',2)+txt(70,10,l,28,C.navy,600,'start')+(q>0.9?okBadge(-130,0,0.9):''),q)});
    g+=G(tr(170,-40,1),d);
  }
  if(i===2){
    g+=G(tr(150,420,1.05),commercial(0));
    g+=G(tr(-250,430,0.95),worker(t,1,1));
    const rot=lt*90;
    g+=G(`translate(330,-330) rotate(${f(rot)})`,circ(0,0,62,C.navy,'filter="url(#sh)"')+icon('gear',0,0,3.6,'#fff',2));
    g+=G(`translate(-150,-420) rotate(${f(-rot*1.3)})`,circ(0,0,46,C.gold,'filter="url(#sh)"')+icon('gear',0,0,2.6,'#fff',2));
    [[-20,-140],[300,-80],[60,120]].forEach(([x,y],j)=>{const q=pop(lt,0.4+j*0.2,0.4);if(q>0)g+=okBadge(x,y,1.5*q)});
  }
  if(i===3){
    g+=G(tr(170,430,1.0),apartment(1));
    const flip=tw(lt,0.5,0.8);
    g+=G(tr(170,-260,1,Math.sin(lt*3)*4),rect(-150,-50,300,100,flip<0.5?C.navy:C.gold,16)+txt(0,14,flip<0.5?'متاح للإيجار':'تم التأجير',38,'#fff',700));
    const got=lt>0.75;
    g+=man({x:-250,y:430,s:0.82,ghutra:1,t,expr:got?'big':'smile',look:[0.9,0],L:[-96,-210],R:got?[150,-360]:[96,-210],hold:got?{R:'key',keyAng:-50}:{}});
    if(!got){const k=tw(lt,0.2,0.75,E.io);g+=G(tr(lerp(170,-120,k),lerp(-120,140,k),1.3,-30),keyShape())}
  }
  if(i===4){
    const k=tw(lt,0.35,0.9,E.io);
    g+=man({x:-250,y:440,s:0.85,t,expr:'smile',look:[0.9,0.2],L:[-96,-210],R:[lerp(150,96,k),lerp(-320,-210,k)],hold:k<0.5?{R:'key',keyAng:-30}:{}});
    g+=man({x:250,y:440,s:0.85,ghutra:1,bisht:1,t,expr:k>0.6?'big':'smile',look:[-0.9,0.2],L:[lerp(-96,-150,k),lerp(-210,-320,k)],R:[96,-210],hold:k>=0.5?{L:'key',keyAng:-150}:{}});
    // document
    const dq=pop(lt,0.0,0.4);
    g+=G(tr(0,-300,dq),rect(-130,-160,260,320,'#fff',16,'filter="url(#sh)"')+txt(0,-100,'عقد',36,C.navy,700)+[0,1,2,3].map(j=>rect(-90,-60+j*34,180,10,'#C9D3E0',5)).join('')+S(`M-80,110 Q-50,${f(80)} -20,110 T${f(lerp(-20,80,tw(lt,0.5,1.0)))},105`,C.navy,4)+circ(80,60,26,C.gold));
  }
  if(i===5){
    g+=man({x:0,y:460,s:0.82,older:true,t,expr:'smile',look:[0,0.2],L:[-180,-420],R:[180,-420]});
    const nodes=[[-300,-380,{ },'مالك'],[300,-380,{ghutra:1,bisht:1},'مستثمر'],[0,-560,{ghutra:1},'عميل']];
    const lk=tw(lt,0.2,0.8,E.io);
    nodes.forEach(([x,y,o],j)=>{const hx=j===0?-148:j===1?148:0, hy=j===2?-60:-50;
      g+=S(`M${hx},${hy} L${f(lerp(hx,x,lk))},${f(lerp(hy,y,lk))}`,C.gold,6,'stroke-dasharray="2 12"')});
    nodes.forEach(([x,y,o,l],j)=>{const q=pop(lt,0.1+j*0.15,0.45);if(q>0)g+=medallion('sv5m'+j,x,y,110,bust(Object.assign({t,expr:'smile'},o),110),l,1,q)});
  }
  return g;
}
function S3(t){
  let g=rect(0,0,1080,1920,IV)+circ(540,1020,470,'#fff','opacity=".85"')+circ(540,1020,470,'none',`stroke="${C.gold}" stroke-width="2" opacity=".5"`);
  g+=P('M0,1560 L1080,1480 L1080,1920 L0,1920 Z',C.navy)+P('M0,1560 L1080,1480 L1080,1490 L0,1570 Z',C.gold);
  SV.forEach(([l,t0],i)=>{const t1=i<5?SV[i+1][1]:20.7;if(t<t0-0.05||t>t1+0.35)return;
    const a=tw(t,t0,t0+0.4,E.out), b=tw(t,t1-0.05,t1+0.3,E.in);
    g+=G(`translate(540,1000) scale(${f(lerp(0.88,1,a)*lerp(1,1.08,b))})`,svArt(i,t,t-t0),a*(1-b));});
  return g;
}
function S3text(t){
  let h='';let cur=0;SV.forEach(([l,t0],i)=>{if(t>=t0)cur=i});
  const [l,t0]=SV[cur];const t1=cur<5?SV[cur+1][1]:20.6;
  const k=tw(t,t0,t0+0.35,E.out)*(1-tw(t,t1-0.25,t1,E.in));
  h+=`<div style="position:absolute;left:0;right:0;top:250px;text-align:center;font-family:Montserrat;font-weight:600;font-size:46px;letter-spacing:6px;color:${C.gold};opacity:${f(k)}">0${cur+1}<span style="color:#C9C2B4;font-size:30px"> / 06</span></div>`;
  h+=head(l,t,t0+0.05,t1,{y:320,size:76,color:C.navy});
  // progress bar
  h+=`<div style="position:absolute;left:140px;right:140px;top:1640px;display:flex;gap:12px;direction:rtl">`+SV.map((s,i)=>`<div style="flex:1;height:10px;border-radius:5px;background:${i<cur?C.gold:i===cur?'#fff':'rgba(255,255,255,.25)'}"></div>`).join('')+'</div>';
  h+=`<div style="position:absolute;left:0;right:0;top:1690px;text-align:center;font-family:${FONT};font-weight:500;font-size:36px;color:${C.goldL};direction:rtl">حلول عقارية متكاملة</div>`;
  return h;
}
// S4 20.6–28.3
function complexBG(t,lit){
  let g=rect(0,0,1080,1920,'url(#gSkyV)')+circ(860,420,150,'#FFF1D6','opacity=".7"');
  g+=G('translate(0,1420)',skylineV('#E4DACB',1,17,0,240));
  g+=G(tr(220,1430,0.82),tower(8,400,lit,1))+G(tr(860,1430,0.82),tower(9,400,lit,2))+G(tr(540,1460,0.95),tower(10,460,lit,0));
  g+=groundStrip(1440)+palm(80,1460,1.0,Math.sin(t)*4)+palm(1010,1460,1.0,Math.sin(t+1)*4)+bush(330,1470,1)+bush(760,1470,1);
  return g;
}
function S4(t){
  const lit=tw(t,25.4,27.0);
  let g=complexBG(t,lit);
  const pd=tw(t,25.0,25.5,E.in);
  // characters
  g+=man({x:300,y:1830,s:0.95,t,expr:t>23.8?'big':(t>22.6?'smile':'neutral'),look:[0.8,-0.6],nod:t>23.6&&t<24.8?Math.sin((t-23.6)*12)*4:0,L:[-96,-210],R:[96,-210]});
  g+=man({x:770,y:1830,s:0.95,older:true,t,expr:t<22.3||(t>26&&t<28)?'talk':'smile',look:[-0.8,-0.4],L:[-62,-318],R:[62,-318],hold:{both:'tablet',tabAng:-6}});
  // dashboard
  const p=pop(t,20.9,0.6);
  if(p>0&&pd<1){
    let d=rect(-430,-370,860,740,'#fff',36,'filter="url(#sh)"')+rect(-430,-370,860,100,C.navy,36)+rect(-430,-310,860,40,C.navy)+txt(0,-300,'لوحة متابعة العقار',38,'#fff',600);
    const rows=[['chart','أداء العقار'],['coins','إدارة الإيجارات'],['wrench','متابعة الصيانة'],['chat','التواصل مع المستأجرين'],['doc','التقارير المالية']];
    rows.forEach(([n,l],j)=>{const q=tw(t,21.2+j*0.45,21.6+j*0.45,E.out);const y=-200+j*118;
      let r=rect(-400,-50,800,100,'#F3F6FA',20)+circ(340,0,36,j%2?C.gold:C.navy)+icon(n,340,0,1.9,'#fff',2)+txt(285,11,l,30,C.navy,600,'start');
      const bw=tw(t,21.5+j*0.45,22.3+j*0.45,E.out);
      r+=rect(-370,-8,200,16,'#DDE3EA',8)+rect(-370,-8,200*bw*[0.82,0.95,0.7,0.88,0.9][j],16,j%2?C.gold:'#3E9B6B',8);
      if(bw>0.95) r+=okBadge(-120,0,0.9);
      d+=G(tr(0,y+(1-q)*30),r,q);});
    g+=G(`translate(540,${f(lerp(860,1000,pd))}) scale(${f(p*lerp(1,0.1,pd))})`,d,1-pd);
  }
  // after: check badges on buildings
  [[220,900,26.0],[540,760,26.3],[860,840,26.6]].forEach(([x,y,t0])=>{const q=pop(t,t0,0.45);if(q>0)g+=okBadge(x,y+Math.sin(t*3)*5,1.8*q)});
  const z=lerp(1,1.06,tw(t,25.2,28.3,E.sine));
  return G(`translate(540,1200) scale(${f(z)}) translate(-540,-1200)`,g);
}
// S5 28.3–35.6
function S5(t){
  let g=rect(0,0,1080,1920,IV);
  for(let i=0;i<14;i++)g+=rect(0,i*140,1080,1.5,C.gold,'','opacity=".12"')+rect(i*80,0,1.5,1920,C.gold,'','opacity=".08"');
  // property models backdrop
  const bk=tw(t,28.4,29.2,E.out);
  g+=G(`translate(0,${f((1-bk)*200)})`,G(tr(170,1480,0.5),commercial(0))+G(tr(910,1480,0.5),apartment(0))+G(tr(380,1480,0.42),tower(7,420,0,1))+G(tr(700,1480,0.42),tower(8,420,0,2)),bk*0.55);
  g+=rect(0,1480,1080,440,BG2)+rect(0,1480,1080,8,C.gold,'','opacity=".6"');
  // consultant center
  g+=man({x:540,y:1560,s:0.95,older:true,t,expr:'smile',look:[0,0.2],L:[-180,-430],R:[180,-430]});
  const cx=540,cy=1560-0.95*400;
  const nodes=[[210,720,{},'مالك العقار','home',28.6],[870,720,{ghutra:1,bisht:1},'مستثمر','chartUp',29.0],[540,420,{ghutra:1},'عميل','key',29.4]];
  const net=tw(t,32.4,33.2,E.io);
  nodes.forEach(([x,y,o,l,n,t0],j)=>{const lk=tw(t,t0+0.2,t0+0.8,E.io);const hx=j===0?cx-171:j===1?cx+171:cx, hy=j===2?cy-210:cy-30;
    g+=S(`M${hx},${hy} L${f(lerp(hx,x,lk))},${f(lerp(hy,y,lk))}`,C.gold,5);
    if(lk>=1){const pu=(t*0.8+j*0.33)%1;g+=circ(lerp(hx,x,pu),lerp(hy,y,pu),8,C.gold)}});
  if(net>0){const pts=nodes.map(n=>[n[0],n[1]]);g+=S(`M${pts[0]} L${pts[2]} L${pts[1]} Z`,C.gold,4,`stroke-dasharray="${f(2400*net)} 2400" opacity=".7"`)}
  nodes.forEach(([x,y,o,l,n,t0],j)=>{const q=pop(t,t0,0.5);if(q<=0)return;
    g+=medallion('s5m'+j,x,y,135,bust(Object.assign({t,expr:t>t0+1?'smile':'neutral'},o),135),l,1,q);
    g+=G(tr(x+(j===1?-110:110),y-100,q),circ(0,0,40,C.gold,'filter="url(#sh)"')+icon(n,0,0,2.1,'#fff',2));});
  // glow ring on network complete
  if(net>0) g+=circ(540,640,lerp(200,520,net),'none',`stroke="${C.gold}" stroke-width="3" opacity="${f(0.5*(1-net))}"`);
  return g;
}
// S6 35.6–48
function S6(t){
  let g=rect(0,0,1080,1920,'#FFFFFF')+`<circle cx="540" cy="620" r="760" fill="url(#gGlow)"/>`;
  const up=tw(t,35.6,37.4,E.io);
  // architectural composition (moves down as camera rises)
  const off=lerp(-380,0,up);
  let a='';
  a+=G('translate(0,1640)',skylineV('#EFE7D9',1,61,0,420));
  a+=G(tr(150,1700,0.62),tower(10,400,0,1))+G(tr(930,1700,0.62),tower(11,400,0,2))+G(tr(380,1720,0.55),commercial(0))+G(tr(700,1720,0.55),commercial(0));
  a+=G(tr(540,1760,0.9),villa(0))+rect(0,1740,1080,200,'#E7DCC8')+rect(0,1740,1080,8,C.gold);
  a+=palm(60,1760,0.9)+palm(1020,1760,0.9);
  const dn=tw(t,39.6,40.4,E.io);g+=G(`translate(0,${f(-off*0.6+dn*240)})`,a,1-0.6*dn);
  // logo
  const lp=tw(t,35.8,36.6,E.out);
  const ly=lerp(820,540,tw(t,37.0,37.8,E.io)), lw=lerp(940,860,tw(t,37.0,37.8,E.io));
  if(lp>0){g+=`<ellipse cx="540" cy="${f(ly)}" rx="${f(520*lp)}" ry="${f(260*lp)}" fill="#FFF7E6" opacity=".8" filter="url(#blur)"/>`;
    g+=logo(540,ly,lw*lerp(1.08,1,lp),clamp(lp*1.5),tw(t,35.8,36.6,E.io),tw(t,36.4,36.9));}
  // shimmer
  const sh=tw(t,36.7,37.3);if(sh>0&&sh<1)g+=`<rect x="${f(lerp(80,1000,sh))}" y="${f(ly-170)}" width="60" height="340" fill="#fff" opacity=".5" transform="skewX(-18)"/>`;
  const dv=tw(t,37.6,38.3,E.out);g+=rect(540-dv*300,ly+190,dv*600,4,C.gold,2)+circ(540,ly+192,dv*8,C.gold);
  return g;
}
function S6text(t){
  let h='';
  h+=head('نصنع قيمة عقارية مستدامة',t,37.5,0,{y:760,size:62,color:C.navy,weight:700});
  const vals=['خبرة طويلة','حلول متكاملة','رؤية احترافية'];
  h+=`<div style="position:absolute;left:0;right:0;top:880px;display:flex;justify-content:center;align-items:center;gap:18px;direction:rtl;font-family:${FONT};font-weight:600;font-size:38px;color:${C.goldD}">`+vals.map((v,i)=>{const k=tw(t,38.6+i*0.25,39.1+i*0.25,E.out);return (i?`<span style="width:8px;height:8px;border-radius:50%;background:${C.gold};opacity:${f(k)}"></span>`:'')+`<span style="opacity:${f(k)};transform:translateY(${f((1-k)*20)}px);display:inline-block">${v}</span>`}).join('')+'</div>';
  const kl=tw(t,39.9,40.4,E.out);
  h+=`<div style="position:absolute;left:0;right:0;top:1000px;text-align:center;font-family:${FONT};font-weight:600;font-size:40px;color:${C.navy};opacity:${f(kl)};direction:rtl">تواصلوا معنا</div>`;
  const svg=(n)=>`<svg width="40" height="40" viewBox="0 0 24 24"><path d="${IC[n]||n}" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const phoneP='M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1z';
  const webP='M12 2a10 10 0 100 20 10 10 0 000-20zm0 0c3 3 3 17 0 20m0-20c-3 3-3 17 0 20M2 12h20';
  const mailP='M3 6h18v12H3z M3 6l9 7 9-7';
  const rows=[['920022596',phoneP,74],['www.address.com.sa',webP,54],['info@address.com.sa',mailP,52]];
  rows.forEach(([v,ic,fs],i)=>{const k=tw(t,40.1+i*0.3,40.7+i*0.3,E.back);
    h+=`<div style="position:absolute;left:0;right:0;top:${1080+i*150}px;display:flex;justify-content:center;opacity:${f(clamp(k))};transform:scale(${f(0.75+0.25*k)})"><div style="display:flex;align-items:center;gap:24px;background:${i===0?C.navy:'#fff'};color:${i===0?'#fff':C.navy};border:3px solid ${C.navy};border-radius:30px;padding:16px 44px 18px;font-family:Montserrat;font-weight:600;font-size:${fs}px;direction:ltr;box-shadow:0 12px 28px rgba(15,32,47,.18)"><span style="width:72px;height:72px;border-radius:50%;background:${C.gold};display:inline-flex;align-items:center;justify-content:center">${svg(ic)}</span>${v}</div></div>`});
  return h;
}
// ===== wipe (vertical diagonal) =====
function wipeV(t,tc,d=0.32){
  if(t<tc-d||t>tc+d)return '';
  const k=t<tc?E.in(tw(t,tc-d,tc,E.lin)):E.out(tw(t,tc,tc+d,E.lin));
  const y=t<tc?lerp(2100,0,k):lerp(0,-2400,k);
  return P(`M0,${f(y+260)} L1080,${f(y)} L1080,${f(y+2200)} L0,${f(y+2460)} Z`,C.navy)+P(`M0,${f(y+260)} L1080,${f(y)} L1080,${f(y+16)} L0,${f(y+276)} Z`,C.gold);
}
function render(t){
  let art='',html='';
  if(t<6.4) art=S1(t);
  else if(t<8.1) art=S2a(t);
  else if(t<10.6) art=S2b(t);
  else if(t<13.0) art=S2c(t);
  else if(t<20.6) art=S3(t);
  else if(t<28.3) art=S4(t);
  else if(t<35.6) art=S5(t);
  else art=S6(t);
  art+=wipeV(t,6.4)+wipeV(t,8.1)+wipeV(t,20.6)+wipeV(t,28.3)+wipeV(t,35.6);
  if(t>10.6&&t<10.9) art+=rect(0,0,1080,1920,'#fff','',`opacity="${f(1-tw(t,10.6,10.9))}"`);
  if(t>13.0&&t<13.3) art+=rect(0,0,1080,1920,IV,'',`opacity="${f(1-tw(t,13.0,13.3))}"`);
  // text
  html+=head('عقارك قيمة…/تستحق عناية احترافية',t,0.4,6.2,{y:200,size:74});
  html+=head('أدرس العقارية',t,7.6,8.05,{y:1180,size:64,color:C.navy});
  html+=head('حلول عقارية متكاملة',t,8.2,10.5,{y:200,size:70});
  html+=head('خبرة طويلة ورؤية احترافية',t,10.7,12.6,{y:200,size:66});
  if(t>=13&&t<20.6) html+=S3text(t);
  html+=head('إدارة احترافية…/وراحة بال أكبر',t,20.9,28.1,{y:180,size:70});
  if(t>25.3&&t<28.2) html+=`<div style="position:absolute;left:0;right:0;top:390px;text-align:center;direction:rtl;font-family:${FONT};font-weight:600;font-size:42px;color:${C.goldD};opacity:${f(tw(t,25.4,25.9)*(1-tw(t,27.9,28.2)))}">متابعة <span style="color:${C.gold}">|</span> تشغيل <span style="color:${C.gold}">|</span> تقارير <span style="color:${C.gold}">|</span> إدارة</div>`;
  html+=head('نربط الفرص بالاحتياجات',t,28.6,32.3,{y:1640,size:64});
  html+=head('نصنع قيمة عقارية مستدامة',t,32.6,35.5,{y:1640,size:64,color:C.goldD});
  if(t>=35.6) html+=S6text(t);
  return {art,html};
}
