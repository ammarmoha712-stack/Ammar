// ===== Core helpers =====
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const lerp=(a,b,t)=>a+(b-a)*t;
const E={
  lin:t=>t,
  io:t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,
  out:t=>1-Math.pow(1-t,3),
  in:t=>t*t*t,
  sine:t=>-(Math.cos(Math.PI*t)-1)/2,
  back:t=>{const c1=1.6,c3=c1+1;return 1+c3*Math.pow(t-1,3)+c1*Math.pow(t-1,2)},
  el:t=>t===0?0:t===1?1:Math.pow(2,-10*t)*Math.sin((t*10-0.75)*(2*Math.PI)/3)+1,
};
const tw=(t,a,b,e=E.io)=>e(clamp((t-a)/(b-a)));
const f=n=>(+n).toFixed(2);
const C={navy:'#0F202F',navy2:'#22405A',navyD:'#0A1622',gold:'#C59C4B',goldL:'#E3CB97',goldD:'#A47F35',
  beige:'#EFE6D8',cream:'#F7F3EC',copper:'#C6764E',ink:'#2A211D',thobe:'#FBFBF9',thobeSh:'#E8EAEE',thobeLn:'#CDD2DA',
  sky1:'#DCE7F3',sky2:'#F6F1E8',green:'#6E9A58',greenD:'#4F7A42',wood:'#9A6544'};
const G=(tr,inner,op)=>`<g transform="${tr}"${op!==undefined?` opacity="${f(op)}"`:''}>${inner}</g>`;
const tr=(x,y,s=1,r=0)=>`translate(${f(x)},${f(y)})${r?` rotate(${f(r)})`:''}${s!==1?` scale(${f(s)})`:''}`;
const rect=(x,y,w,h,fill,rx=0,extra='')=>`<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx||0}" fill="${fill}" ${extra}/>`;
const circ=(x,y,r,fill,extra='')=>`<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${fill}" ${extra}/>`;
const P=(d,fill,extra='')=>`<path d="${d}" fill="${fill}" ${extra}/>`;
const S=(d,stroke,w,extra='')=>`<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const txt=(x,y,s,size,fill,weight=700,anchor='middle',extra='')=>`<text x="${f(x)}" y="${f(y)}" font-family="IBM Plex Sans Arabic" font-weight="${weight}" font-size="${size}" fill="${fill}" text-anchor="${anchor}" direction="rtl" ${extra}>${s}</text>`;
function rnd(seed){let s=seed*9301+49297;return()=>{s=(s*9301+49297)%233280;return s/233280}}
function blinkAt(t,seed=0){const p=(t+seed*1.37)%3.4;return p<0.13?Math.max(0.12,Math.abs(p-0.065)/0.065):1}
function pop(t,t0,d=0.45){return tw(t,t0,t0+d,E.back)}

// ===== Character =====
// o: {x,y,s,seated,expr,look:[dx,dy],L:[x,y],R:[x,y],hold:{R:'phone'|'key'|..., both:'tablet'},older,t,tilt,nod,flip}
function man(o){
  const D=o.seated?90:0, t=o.t||0;
  const SH=o.ghutra?'url(#ghut)':'url(#shem)', SHB=o.ghutra?'#C3C8CF':'#9E1820';
  const sl1=o.bisht?'#241812':C.thobeLn, sl2=o.bisht?'#3E2B20':C.thobe;
  const sk=o.older?'#B9825F':'#CC9676', skD=o.older?'#9F6B4C':'#B07A5A';
  const hair=o.older?'#3E3835':'#2A211D';
  const look=o.look||[0,0];
  const bl=o.blink===undefined?blinkAt(t,o.older?1:0):o.blink;
  const ex=o.expr||'neutral';
  let g='';
  // shadow
  g+=`<ellipse cx="0" cy="2" rx="${o.seated?120:95}" ry="14" fill="#1B2D4B" opacity=".13"/>`;
  // back drape
  const head=(inner)=>`<g transform="translate(0,${D}) rotate(${f(o.tilt||0)} 0 -455) translate(0,${f(o.nod||0)})">${inner}</g>`;
  g+=head(P('M0,-618 C78,-618 102,-560 106,-500 L120,-405 Q0,-390 -120,-405 L-106,-500 C-102,-560 -78,-618 0,-618 Z',SH)+P('M0,-618 C78,-618 102,-560 106,-500 L120,-405 Q0,-390 -120,-405 L-106,-500 C-102,-560 -78,-618 0,-618 Z','#000','opacity=".08"'));
  // feet
  if(o.seated){
    g+=`<ellipse cx="-46" cy="-6" rx="26" ry="10" fill="#5B3A29"/><ellipse cx="46" cy="-6" rx="26" ry="10" fill="#5B3A29"/>`;
  }else{
    const w=o.walk||0;
    g+=`<ellipse cx="${f(-30+w*14)}" cy="${f(-6-Math.max(0,w)*6)}" rx="24" ry="9" fill="#5B3A29"/><ellipse cx="${f(30-w*14)}" cy="${f(-6-Math.max(0,-w)*6)}" rx="24" ry="9" fill="#5B3A29"/>`;
  }
  // thobe
  if(o.seated){
    const d='M-36,-360 C-70,-360 -96,-346 -100,-306 L-98,-232 C-112,-216 -114,-186 -104,-170 L-88,-14 Q-46,-6 -6,-14 L0,-150 L6,-14 Q46,-6 88,-14 L104,-170 C114,-186 112,-216 98,-232 L100,-306 C96,-346 70,-360 36,-360 Z';
    g+=P(d,C.thobe,`stroke="${C.thobeLn}" stroke-width="2.5"`);
    g+=P('M62,-350 C88,-340 98,-325 100,-306 L98,-232 C112,-216 114,-186 104,-170 L88,-14 Q76,-10 64,-12 L74,-172 L70,-240 Z','#EBEDF1');
    g+=S('M-104,-176 Q0,-156 104,-176',C.thobeLn,2.5)+S('M0,-150 L0,-60',C.thobeLn,2.5)+S('M-60,-150 L-54,-30',C.thobeLn,2,'opacity=".6"')+S('M60,-150 L54,-30',C.thobeLn,2,'opacity=".6"');
  }else{
    const sw=o.sway||0;
    const d=`M-36,-450 C-70,-450 -96,-436 -100,-396 L-94,-180 L${f(-97+sw)},-16 Q0,-6 ${f(97+sw)},-16 L94,-180 L100,-396 C96,-436 70,-450 36,-450 Z`;
    g+=P(d,C.thobe,`stroke="${C.thobeLn}" stroke-width="2.5"`);
    g+=P(`M62,-440 C86,-432 98,-418 100,-396 L94,-180 L${f(97+sw)},-16 Q82,-12 68,-11 L72,-200 Z`,'#EBEDF1');
    g+=S('M-40,-260 L-46,-30',C.thobeLn,2,'opacity=".55"')+S('M30,-250 L34,-30',C.thobeLn,2,'opacity=".55"');
  }
  // collar, placket
  g+=`<g transform="translate(0,${D})">`+P('M-22,-452 Q0,-443 22,-452 L22,-440 Q0,-431 -22,-440 Z','#fff',`stroke="${C.thobeLn}" stroke-width="2"`)+S('M0,-436 L0,-352',C.thobeLn,2.5)+circ(0,-420,3,C.thobeLn)+circ(0,-398,3,C.thobeLn)+circ(0,-376,3,C.thobeLn)
   +(o.older?rect(36,-412,26,5,C.gold,2)+rect(36,-405,22,3,C.navy,1):'')+'</g>';
  if(o.bisht){g+=P('M-98,-446 C-120,-424 -126,-380 -124,-300 L-124,-18 L-60,-16 L-44,-300 C-42,-370 -38,-424 -30,-452 Z','#3E2B20')+P('M98,-446 C120,-424 126,-380 124,-300 L124,-18 L60,-16 L44,-300 C42,-370 38,-424 30,-452 Z','#352419')
    +S('M-30,-452 C-38,-424 -42,-370 -44,-300 L-60,-16',C.gold,6)+S('M30,-452 C38,-424 42,-370 44,-300 L60,-16',C.gold,6);}
  // head
  let h='';
  h+=rect(-20,-478,40,36,skD,8);
  h+=`<ellipse cx="0" cy="-522" rx="47" ry="58" fill="${sk}"/>`;
  // beard
  const bc=o.older?'#3B3431':hair;
  h+=P('M-48,-536 C-47,-478 -25,-449 0,-449 C25,-449 47,-478 48,-536 C42,-506 32,-498 19,-500 C10,-503 -10,-503 -19,-500 C-32,-498 -42,-506 -48,-536 Z',bc);
  if(o.older) h+=S('M-30,-480 Q-20,-465 -8,-460',"#8d8783",3,'opacity=".8"')+S('M30,-480 Q20,-465 8,-460',"#8d8783",3,'opacity=".8"')+S('M-4,-470 L-2,-456',"#8d8783",3,'opacity=".7"');
  h+=`<ellipse cx="0" cy="-489" rx="15" ry="8" fill="${sk}"/>`;
  h+=P('M-21,-499 Q0,-511 21,-499 Q10,-495 0,-497 Q-10,-495 -21,-499 Z',bc);
  // mouth
  const m={neutral:S('M-10,-488 Q0,-485 10,-488','#5a2d25',3.5),
    smile:S('M-14,-490 Q0,-478 14,-490','#5a2d25',3.8),
    big:P('M-16,-492 Q0,-466 16,-492 Z','#6B2B2B')+P('M-14,-491 Q0,-489 14,-491 L13,-487 Q0,-485 -13,-487 Z','#fff'),
    worry:S('M-11,-484 Q-5,-490 0,-487 Q5,-484 11,-489','#5a2d25',3.5),
    o:`<ellipse cx="0" cy="-486" rx="5" ry="6" fill="#6B2B2B"/>`,
    talk:P(`M-12,-490 Q0,${f(-490+6+6*Math.abs(Math.sin(t*14)))} 12,-490 Z`,'#6B2B2B')};
  h+=m[ex]||m.neutral;
  // nose
  h+=S('M-2,-528 Q-8,-508 0,-505 Q5,-505 7,-509',skD,3.2);
  if(ex==='big'||ex==='smile') h+=`<ellipse cx="-30" cy="-510" rx="9" ry="5" fill="#E07A6A" opacity=".25"/><ellipse cx="30" cy="-510" rx="9" ry="5" fill="#E07A6A" opacity=".25"/>`;
  // eyes
  const ey=-530, lx=look[0]*5, ly=look[1]*4;
  const eyeRy=(ex==='big'?4.5:7)*bl;
  if(ex==='big'&&bl>0.9){h+=S(`M-24,${ey+2} Q-17,${ey-6} -10,${ey+2}`,C.ink,4)+S(`M10,${ey+2} Q17,${ey-6} 24,${ey+2}`,C.ink,4);}
  else{
    h+=`<ellipse cx="${f(-17+lx)}" cy="${f(ey+ly)}" rx="5.8" ry="${f(eyeRy)}" fill="${C.ink}"/><ellipse cx="${f(17+lx)}" cy="${f(ey+ly)}" rx="5.8" ry="${f(eyeRy)}" fill="${C.ink}"/>`;
    if(bl>0.6) h+=circ(-15+lx,ey-2+ly,1.8,'#fff')+circ(19+lx,ey-2+ly,1.8,'#fff');
  }
  // brows
  const br={neutral:['M-31,-546 Q-21,-552 -9,-548','M9,-548 Q21,-552 31,-546'],
    confused:['M-31,-544 Q-21,-552 -9,-558','M9,-549 Q21,-546 31,-543'],
    worry:['M-31,-546 Q-21,-550 -9,-556','M9,-556 Q21,-550 31,-546'],
    think:['M-31,-548 Q-21,-546 -9,-545','M9,-552 Q21,-560 31,-554'],
    smile:['M-31,-549 Q-21,-557 -9,-551','M9,-551 Q21,-557 31,-549'],
    big:['M-31,-551 Q-21,-561 -9,-553','M9,-553 Q21,-561 31,-551'],
    o:['M-31,-552 Q-21,-562 -9,-556','M9,-556 Q21,-562 31,-552'],talk:['M-31,-547 Q-21,-554 -9,-549','M9,-549 Q21,-554 31,-547']};
  const bb=br[ex]||br.neutral; h+=S(bb[0],hair,6.5)+S(bb[1],hair,6.5);
  if(o.older) h+=`<g opacity=".9">${S('M-31,-532 a13,12 0 1,0 26,0 a13,12 0 1,0 -26,0','#3a3a3a',2.6)}${S('M5,-532 a13,12 0 1,0 26,0 a13,12 0 1,0 -26,0','#3a3a3a',2.6)}${S('M-5,-533 Q0,-537 5,-533','#3a3a3a',2.6)}</g>`;
  // shemagh front
  const fr='M0,-624 C82,-624 106,-562 106,-500 L112,-436 L72,-436 C62,-470 56,-500 54,-528 C52,-568 30,-586 0,-586 C-30,-586 -52,-568 -54,-528 C-56,-500 -62,-470 -72,-436 L-112,-436 L-106,-500 C-106,-562 -82,-624 0,-624 Z';
  h+=P(fr,SH)+S('M72,-436 C62,-470 56,-500 54,-528 C52,-568 30,-586 0,-586 C-30,-586 -52,-568 -54,-528 C-56,-500 -62,-470 -72,-436',SHB,3.5);
  h+=P('M0,-624 C82,-624 106,-562 106,-500 L112,-436 L92,-436 C92,-500 88,-590 0,-608 Z','#000','opacity=".07"');
  // agal
  h+=S('M-80,-584 Q0,-626 80,-584','#121212',11)+S('M-84,-570 Q0,-612 84,-570','#121212',11)+S('M-60,-596 Q0,-618 60,-596','#555',2,'opacity=".7"');
  g+=head(h);
  // front flaps (over shoulders)
  g+=`<g transform="translate(0,${D})">`+P('M-112,-440 L-72,-440 C-66,-410 -62,-380 -58,-336 L-98,-326 C-102,-370 -108,-410 -112,-440 Z',SH)+P('M112,-440 L72,-440 C66,-410 62,-380 58,-336 L98,-326 C102,-370 108,-410 112,-440 Z',SH)
    +P('M112,-440 L72,-440 C66,-410 62,-380 58,-336 L98,-326 C102,-370 108,-410 112,-440 Z','#000','opacity=".08"')
    +S('M-58,-336 L-98,-326',SHB,3)+S('M58,-336 L98,-326',SHB,3)
    +S('M-62,-334 l-1,8 M-72,-332 l-1,8 M-82,-330 l-1,8 M-92,-328 l-1,8 M62,-334 l1,8 M72,-332 l1,8 M82,-330 l1,8 M92,-328 l1,8','#F2EEE9',2.5)+'</g>';
  // arms
  const items=o.hold||{};
  const arm=(side,tgt)=>{
    const Sx=side*88, Sy=-414+D;
    const L1=118,L2=108;
    let tx=tgt[0],ty=tgt[1]+D, dx=tx-Sx, dy=ty-Sy, d=Math.hypot(dx,dy);
    if(d>L1+L2-2){const k=(L1+L2-2)/d;dx*=k;dy*=k;d=L1+L2-2;tx=Sx+dx;ty=Sy+dy}
    if(d<Math.abs(L1-L2)+2){d=Math.abs(L1-L2)+2}
    const phi=Math.atan2(dy,dx), a=Math.acos(clamp((L1*L1+d*d-L2*L2)/(2*L1*d),-1,1));
    const e1=[Sx+L1*Math.cos(phi+a),Sy+L1*Math.sin(phi+a)], e2=[Sx+L1*Math.cos(phi-a),Sy+L1*Math.sin(phi-a)];
    const sc=e=>side*e[0]+e[1]*0.35; // prefer outward & lower
    const el=sc(e1)>sc(e2)?e1:e2;
    const path=`M${f(Sx)},${f(Sy)} L${f(el[0])},${f(el[1])} L${f(tx)},${f(ty)}`;
    let s=S(path,sl1,40)+S(path,sl2,34);
    // cuff
    const ang=Math.atan2(ty-el[1],tx-el[0]);
    const cx=tx-Math.cos(ang)*14, cy=ty-Math.sin(ang)*14;
    s+=o.bisht?S(`M${f(cx-Math.sin(ang)*16)},${f(cy+Math.cos(ang)*16)} L${f(cx+Math.sin(ang)*16)},${f(cy-Math.cos(ang)*16)}`,C.gold,4):S(`M${f(cx-Math.sin(ang)*15)},${f(cy+Math.cos(ang)*15)} L${f(cx+Math.sin(ang)*15)},${f(cy-Math.cos(ang)*15)}`,C.thobeLn,3);
    return {s,hand:[tx,ty],ang};
  };
  const A=arm(-1,o.L||[-96,-200]), B=arm(1,o.R||[96,-200]);
  const handG=(hd,ang)=>`<ellipse cx="${f(hd[0])}" cy="${f(hd[1])}" rx="15" ry="17" fill="${sk}" transform="rotate(${f(ang*180/Math.PI-90)} ${f(hd[0])} ${f(hd[1])})"/>`;
  let it='';
  if(items.both==='tablet'){
    const cx=(A.hand[0]+B.hand[0])/2, cy=(A.hand[1]+B.hand[1])/2-8;
    it+=G(tr(cx,cy,1,items.tabAng||0),rect(-82,-56,164,112,'#18243A',12)+rect(-74,-48,148,96,'url(#gScreen)',6)+rect(-64,-40,60,40,'#C9D8EA',4)+rect(4,-40,60,6,C.navy,3)+rect(4,-28,44,5,'#9fb0c6',3)+rect(4,-18,52,5,'#9fb0c6',3)+rect(-64,8,128,8,C.gold,4)+rect(-64,22,90,6,'#9fb0c6',3));
  }
  g+=A.s+B.s;
  const holdAt=(k,H)=>{
    if(k==='phone') return G(tr(H.hand[0],H.hand[1]-22,1,items.phoneAng||-8),rect(-20,-36,40,72,'#16202F',8)+rect(-16,-31,32,60,'url(#gScreen)',5)+rect(-12,-26,24,16,'#BFD2E8',3)+rect(-12,-6,24,4,C.navy,2)+rect(-12,2,18,3,'#9fb0c6',2)+rect(-12,12,24,10,C.gold,3)+`<rect x="-16" y="-31" width="32" height="60" fill="#fff" opacity=".12"/>`);
    if(k==='key') return G(tr(H.hand[0],H.hand[1]-6,1,items.keyAng||-30),keyShape());
    if(k==='pen') return G(tr(H.hand[0],H.hand[1],1,-40),rect(-3,-34,6,40,C.gold,3));
    return '';
  };
  it+=holdAt(items.L,A)+holdAt(items.R,B);
  g+=it+handG(A.hand,A.ang)+handG(B.hand,B.ang);
  const sx=(o.flip?-1:1)*(o.s||1);
  return `<g transform="translate(${f(o.x)},${f(o.y)}) rotate(${f(o.rot||0)}) scale(${f(sx)},${f(o.s||1)})">${g}</g>`;
}
function keyShape(){
  return circ(0,0,15,'none',`stroke="${C.gold}" stroke-width="7"`)+rect(10,-4,46,8,C.gold,3)+rect(40,0,6,12,C.gold,1)+rect(50,0,6,9,C.gold,1)+circ(0,0,4,'#fff','opacity=".0"')
   +G(tr(-14,10,1,25),rect(-10,0,22,30,C.navy,4)+circ(1,7,3,C.goldL));
}

// ===== Props =====
function palm(x,y,s=1,sway=0){
  let g=S('M0,0 C6,-80 -4,-160 8,-240',C.wood,16)+S('M0,0 C6,-80 -4,-160 8,-240','#7B4F35',16,'stroke-dasharray="4 14" opacity=".6"');
  const fr=[[-60,-30],[-40,10],[-80,-5],[50,-30],[70,0],[30,15],[0,-45]];
  fr.forEach(([dx,dy],i)=>{const r=dx+sway*(i%2?1:-1);g+=P(`M8,-240 Q${f(r*0.6)},${f(-260+dy)} ${f(r*1.6)},${f(-215+dy*1.4)} Q${f(r*0.7)},${f(-245+dy*0.8)} 8,-240 Z`,i%2?C.green:C.greenD)});
  g+=circ(6,-238,9,'#7B4F35');
  return G(tr(x,y,s),g);
}
function bush(x,y,s=1){return G(tr(x,y,s),circ(-22,-14,22,C.greenD)+circ(8,-22,28,C.green)+circ(34,-12,20,C.greenD)+circ(14,-8,22,'#7FAA67'))}
function villa(lights=0){
  let g='';
  g+=rect(-300,-12,600,12,'#D9CBB2');
  g+=rect(-260,-180,450,170,'#EDE3D2')+rect(-260,-180,450,14,'#E1D5C0');
  g+=rect(-200,-330,460,152,'#F8F3EA')+rect(150,-330,110,152,'#EDE5D8');
  g+=rect(-275,-192,480,16,C.navy,2)+rect(-215,-342,490,16,C.navy,2);
  g+=rect(125,-312,120,124,'#A06C49');for(let i=0;i<8;i++)g+=rect(131+i*15,-312,5,124,'#84553A');
  g+=rect(-180,-306,280,104,'url(#gGlass)',3)+S('M-110,-306 L-110,-202 M-40,-306 L-40,-202 M30,-306 L30,-202','#fff',4,'opacity=".8"')+P('M-170,-300 L-130,-300 L-175,-215 Z','#fff','opacity=".18"');
  g+=rect(-240,-150,190,128,'url(#gGlass)',3)+S('M-145,-150 L-145,-22','#fff',4,'opacity=".8"')+P('M-232,-146 L-200,-146 L-236,-80 Z','#fff','opacity=".2"');
  g+=rect(-10,-154,96,142,'#F3ECE0')+rect(4,-140,68,128,'#7A4E33',2)+rect(54,-84,6,24,C.gold,2);
  g+=rect(110,-120,64,108,'url(#gGlass)',2);
  if(lights>0){g+=rect(-180,-306,280,104,'url(#gLit)',3,`opacity="${f(lights*0.9)}"`)+rect(-240,-150,190,128,'url(#gLit)',3,`opacity="${f(lights*0.9)}"`)+rect(110,-120,64,108,'url(#gLit)',2,`opacity="${f(lights*0.9)}"`)}
  g+=circ(-20,-120,5,'#FFE2A8')+circ(96,-120,5,'#FFE2A8');
  g+=bush(-250,-10,0.9)+bush(220,-10,1.0);
  return g;
}
function apartment(lit=0){
  let g=rect(-150,-470,300,470,'#F1EBE1')+rect(80,-470,70,470,'#E2D8C8')+rect(-160,-486,320,20,C.navy,3);
  for(let r=0;r<7;r++)for(let c=0;c<4;c++){
    const x=-128+c*62,y=-446+r*60;
    const on=lit&&((r*4+c)%5===2);
    g+=rect(x,y,44,38,on?'#FFD58A':'url(#gGlass)',3);
    if(r%2===0) g+=S(`M${x-4},${y+38} L${x+48},${y+38}`,C.navy,4)+S(`M${x-2},${y+26} L${x+46},${y+26}`,C.navy,2,'opacity=".6"');
  }
  g+=rect(-40,-44,80,44,'#7A4E33')+rect(-56,-56,112,12,C.navy,3)+rect(-4,-30,8,4,C.gold);
  return g;
}
function land(){
  let g=P('M-270,0 L270,0 L210,-130 L-210,-130 Z','#E8D4AE')+P('M-270,0 L270,0 L262,14 L-262,14 Z','#CDB48A');
  g+=S('M-230,-12 L230,-12 L180,-118 L-180,-118 Z',C.navy,4,'stroke-dasharray="14 10" opacity=".7"');
  [[-230,-12],[230,-12],[180,-118],[-180,-118]].forEach(([x,y])=>g+=rect(x-5,y-22,10,24,C.copper,2));
  for(let i=0;i<26;i++){const r=rnd(i);g+=circ(-200+r()*400,-20-r()*95,2.5,'#C9AE80')}
  g+=rect(150,-250,10,150,'#6F4A33')+rect(96,-290,120,70,C.navy,8)+txt(156,-245,'أرض للبيع',26,'#fff',800)+rect(110,-232,92,4,C.gold,2);
  return g;
}
function commercial(lit=0){
  let g=rect(-130,-540,260,440,'url(#gGlass2)')+rect(60,-540,70,440,'#000','',`opacity=".12"`);
  for(let i=0;i<10;i++)g+=rect(-130,-520+i*42,260,4,'#E9EEF5','',`opacity=".7"`);
  for(let i=0;i<5;i++)g+=rect(-130+i*52,-540,3,440,'#E9EEF5','',`opacity=".5"`);
  g+=rect(-140,-552,280,16,C.navy,2)+P('M-110,-530 L-60,-530 L-120,-380 Z','#fff','opacity=".18"');
  g+=rect(-190,-112,380,112,'#EDE3D2')+rect(-190,-124,380,26,C.navy,3)+rect(-150,-120,300,4,C.gold);
  for(let i=0;i<4;i++){g+=rect(-176+i*92,-88,78,88,'url(#gGlass)',2)+P(`M${-180+i*92},-92 L${-94+i*92},-92 L${-100+i*92},-74 L${-174+i*92},-74 Z`,i%2?C.copper:'#D8915F')}
  if(lit) g+=rect(-130,-540,260,440,'#FFD58A','',`opacity="${f(lit*0.25)}"`);
  return g;
}
function skyline(col,op,seed,y0,h0){
  const r=rnd(seed);let g='';let x=-40;
  while(x<1980){const w=50+r()*90,h=h0*(0.35+r());g+=rect(x,y0-h,w,h+400,col);if(r()>0.7)g+=rect(x+w/2-3,y0-h-40,6,40,col);x+=w+r()*14}
  return `<g opacity="${op}">${g}</g>`;
}
function qBubble(x,y,s,op=1,rot=0){return G(tr(x,y,s,rot),circ(0,0,46,C.navy)+circ(0,0,46,'none',`stroke="${C.gold}" stroke-width="4"`)+txt(0,22,'؟',70,C.goldL,800),op)}
function checkB(x,y,s,op=1){return G(tr(x,y,s),circ(0,0,44,C.gold)+circ(0,0,44,'none','stroke="#fff" stroke-width="4"')+S('M-18,0 L-5,14 L20,-14','#fff',9),op)}
function sparkle(x,y,s,op=1,rot=0,col=C.gold){return G(tr(x,y,s,rot),P('M0,-30 Q4,-4 30,0 Q4,4 0,30 Q-4,4 -30,0 Q-4,-4 0,-30 Z',col),op)}
function card(x,y,s,inner,label,op=1,rot=0){
  return G(tr(x,y,s,rot),`<g filter="url(#sh)">${rect(-125,-100,250,200,'#fff',18)}</g>`+rect(-110,-86,220,120,'#E4ECF5',12)+`<g clip-path="url(#cardClip)">${inner}</g>`+txt(0,72,label,28,C.navy,800)+rect(-40,82,80,4,C.gold,2),op);
}
