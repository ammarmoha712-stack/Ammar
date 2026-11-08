// ===== ADDRESS — Behind Every Building (30s, 1080x1920) =====
IC.drop='M12,3 C12,3 6,10 6,14 a6,6 0 0,0 12,0 C18,10 12,3 12,3 Z';
IC.bolt='M13,2 L5,13 L11,13 L10,22 L19,10 L13,10 Z';
IC.elev='M5,3 L19,3 L19,21 L5,21 Z M12,3 L12,21 M8,9 L9.5,7 L11,9 M13,15 L14.5,17 L16,15';
IC.broom='M14,3 L10,13 M6,13 L14,13 L16,21 L4,21 Z';
const BX0=170,BW=740,FH=190,NF=6,GY=1660; // building
const RX0=192,RW=616; // rooms
const EX0=826,EW=66; // elevator
const fy=i=>GY-(i+1)*FH; // floor top y
const ROOF=fy(NF-1);
function room3d(x,y,w,h,wall,side,floorC,ceil){
  const d=34,e=22;
  return rect(x,y,w,h,wall)+P(`M${x},${y} L${x+d},${y+e} L${x+d},${y+h-e} L${x},${y+h} Z`,side)+P(`M${x+w},${y} L${x+w-d},${y+e} L${x+w-d},${y+h-e} L${x+w},${y+h} Z`,side)
   +P(`M${x},${y} L${x+w},${y} L${x+w-d},${y+e} L${x+d},${y+e} Z`,ceil)+P(`M${x},${y+h} L${x+d},${y+h-e} L${x+w-d},${y+h-e} L${x+w},${y+h} Z`,floorC);
}
function mini(o){return man(Object.assign({s:0.25},o))}
function floorContent(i,t,lit){
  const y=fy(i), h=FH-18, fl=y+h-8; let g='';
  const W='#F6F0E6',SD='#E6DCCB',FL=['#CDB89A','#B9BEC6','#C9AE8A','#D7CCB8','#C2AA88','#C9AE8A'][i],CE='#EFE8DC';
  g+=room3d(RX0,y,RW,h,i===1?'#E3E7EC':W,i===1?'#D3D9E0':SD,FL,CE);
  // ceiling light
  g+=rect(RX0+RW/2-40,y+22,80,6,'#fff',3)+`<ellipse cx="${RX0+RW/2}" cy="${y+60}" rx="${f(200)}" ry="60" fill="#FFE7B5" opacity="${f(0.35*lit)}"/>`;
  if(i===0){ // lobby
    g+=rect(RX0+70,y+40,170,70,'#fff',6)+logo(RX0+155,y+75,150);
    g+=rect(RX0+290,fl-60,190,60,C.navy,6)+rect(RX0+290,fl-64,190,8,C.gold,3);
    g+=mini({x:RX0+385,y:fl-10,t,expr:'smile',older:true,look:[Math.sin(t)*0.6,0],L:[-96,-210],R:[96,-210]}).replace('<g ','<g ')+rect(RX0+290,fl-60,190,60,C.navy,6)+rect(RX0+290,fl-64,190,8,C.gold,3);
    const wx=RX0+80+((t*60)%460); g+=mini({x:wx,y:fl,t,expr:'smile',ghutra:1,look:[1,0],walk:Math.sin(t*9),L:[-96+Math.sin(t*9)*20,-210],R:[96-Math.sin(t*9)*20,-210]});
    g+=rect(RX0+540,fl-70,40,70,'#8A5A3C',6)+circ(RX0+560,fl-90,30,C.green);
  }
  if(i===1){ // plant room
    g+=rect(RX0+60,y+44,150,110,'#9AA6B3',6)+rect(RX0+74,y+58,122,82,'#D9DEE4',4);for(let k=0;k<3;k++)g+=circ(RX0+100+k*36,y+90,10,k===1?'#3E9B6B':'#C59C4B');
    g+=S(`M${RX0+230},${y+60} L${RX0+560},${y+60} M${RX0+230},${y+80} L${RX0+560},${y+80}`,'#8A96A3',8);
    const ga=Math.sin(t*3)*40;g+=circ(RX0+480,y+120,26,'#fff','stroke="#8A96A3" stroke-width="5"')+S(`M${RX0+480},${y+120} l${f(Math.sin(ga*Math.PI/180)*18)},${f(-Math.cos(ga*Math.PI/180)*18)}`,C.navy,4);
    g+=G(tr(RX0+330,fl,0.25),worker(t,1,1));
  }
  if(i===2){ // apartment
    g+=rect(RX0+80,y+44,120,80,'url(#gSkyN)',4)+rect(RX0+80,y+44,120,80,'none',4,'stroke="#fff" stroke-width="5"');
    g+=rect(RX0+250,fl-70,230,60,'#22405A',18)+rect(RX0+240,fl-90,250,40,'#2E5272',16);
    g+=mini({x:RX0+365,y:fl+6,seated:true,t,expr:'smile',look:[0.3,0.3],L:[-40,-240],R:[60,-260]});
    g+=rect(RX0+520,fl-110,14,100,C.goldD)+P(`M${RX0+500},${fl-130} L${RX0+554},${fl-130} L${RX0+544},${fl-100} L${RX0+510},${fl-100} Z`,C.goldL);
  }
  if(i===3){ // shared lounge
    g+=rect(RX0+70,fl-50,140,40,'#8A5A3C',8)+rect(RX0+400,fl-50,140,40,'#8A5A3C',8);
    g+=circ(RX0+280,fl-70,34,C.green)+rect(RX0+266,fl-40,28,32,'#C6764E',4)+circ(RX0+560,fl-80,30,C.greenD);
    const cx=RX0+330+Math.sin(t*1.2)*60;
    g+=G(tr(cx,fl,0.22),worker(t,1,0))+rect(cx+30,fl-46,40,40,'#3E9B6B',6)+S(`M${cx+70},${fl-46} l20,-40`,C.navy,4);
  }
  if(i===4){ // management office
    g+=rect(RX0+70,y+40,200,100,'#fff',6)+[0,1,2].map(k=>rect(RX0+84,y+54+k*28,120,14,k===1?C.gold:'#C9D3E0',4)+circ(RX0+240,y+61+k*28,8,'#3E9B6B')).join('');
    g+=rect(RX0+330,fl-60,220,52,'#8A5A3C',6)+rect(RX0+400,fl-110,80,52,'#16202F',4)+rect(RX0+406,fl-104,68,40,'url(#gScreen)',2);
    g+=mini({x:RX0+330,y:fl+4,t,expr:'neutral',look:[0.9,0],L:[-96,-210],R:[150,-280]});
  }
  if(i===5){ // apartment 2
    g+=rect(RX0+370,y+44,170,90,'url(#gSkyN)',4)+rect(RX0+370,y+44,170,90,'none',4,'stroke="#fff" stroke-width="5"');
    g+=rect(RX0+70,y+40,110,130,'#8A5A3C',4)+[0,1,2].map(k=>rect(RX0+78,y+50+k*40,94,6,C.goldD)+rect(RX0+84+k*10,y+20+k*40+8,10,22,['#C6764E','#22405A','#C59C4B'][k])).join('');
    g+=mini({x:RX0+300,y:fl,t,ghutra:1,bisht:1,expr:'smile',look:[0.6,-0.2],L:[-96,-210],R:[96,-210]});
  }
  // dim overlay when unmanaged
  g+=rect(RX0,y,RW,h,'#0A1622','',`opacity="${f(0.5*(1-lit))}"`);
  return g;
}
function buildingCut(t,lits,open=1,bp=1){
  let g='';
  // plinth
  g+=P(`M60,${GY} L1020,${GY} L1060,${GY+60} L20,${GY+60} Z`,'#EFE7D9')+rect(20,GY+60,1040,30,'#D9CBB2')+rect(60,GY,960,4,C.gold);
  // structure
  g+=rect(BX0,ROOF-40,BW,GY-ROOF+40,'#E9E0D0');
  for(let i=0;i<NF;i++) g+=floorContent(i,t,lits[i]);
  // slabs and columns
  for(let i=0;i<=NF;i++) g+=rect(BX0,GY-i*FH-18,BW,18,'#D9CDB8')+rect(BX0,GY-i*FH-18,BW,4,'#C8B99E');
  g+=rect(BX0,ROOF-40,22,GY-ROOF+40,'#D9CDB8')+rect(BX0+BW-22,ROOF-40,22,GY-ROOF+40,'#D9CDB8');
  // elevator shaft
  g+=rect(EX0,ROOF,EW,GY-ROOF,'#2A3B4D')+S(`M${EX0+EW/2},${ROOF} L${EX0+EW/2},${GY}`,'#8A96A3',2);
  const seq=[0,3,1,5,2,4,0]; const per=1.7; const k=Math.floor(t/per)%6, ph=E.io(clamp((t%per)/1.1));
  const fa=seq[k], fb=seq[k+1]; const ey=lerp(fy(fa),fy(fb),ph)+20;
  g+=rect(EX0+6,ey,EW-12,FH-46,'#E9EEF3',4)+rect(EX0+6,ey,EW-12,8,C.gold,3)+rect(EX0+EW/2-1,ey+8,2,FH-54,'#B7C0CA');
  // roof
  g+=rect(BX0-10,ROOF-58,BW+20,22,C.navy,3)+rect(BX0+60,ROOF-130,140,72,'#C9D1DA',8)+rect(BX0+250,ROOF-110,110,52,'#B0BAC5',6);
  const fan=t*400;g+=G(`translate(${BX0+305},${ROOF-84}) rotate(${f(fan)})`,S('M-18,0 L18,0 M0,-18 L0,18','#6B7785',5));
  g+=P(`M${BX0+430},${ROOF-58} L${BX0+640},${ROOF-58} L${BX0+610},${ROOF-110} L${BX0+460},${ROOF-110} Z`,'#22405A')+S(`M${BX0+500},${ROOF-58} L${BX0+520},${ROOF-110} M${BX0+570},${ROOF-58} L${BX0+570},${ROOF-110}`,'#4F7896',3);
  return g;
}
function facade(op=1){
  let g=rect(BX0,ROOF-40,BW,GY-ROOF+40,'#EFE6D6');
  for(let i=0;i<NF;i++){const y=fy(i);g+=rect(BX0+40,y+20,BW-80,FH-56,'url(#gGlass)',4);for(let c=1;c<5;c++)g+=rect(BX0+40+c*(BW-80)/5,y+20,5,FH-56,'#fff','','opacity=".6"');g+=rect(BX0+20,y+FH-30,BW-40,10,C.gold,2,'opacity=".8"');}
  g+=P(`M${BX0+60},${fy(5)+24} L${BX0+180},${fy(5)+24} L${BX0+60},${fy(3)} Z`,'#fff','opacity=".14"');
  g+=rect(BX0+BW/2-70,GY-150,140,132,'#2A3F60',4)+rect(BX0+BW/2-64,GY-144,128,126,'url(#gGlass)',2);
  return G('',g,op);
}
function blueprint(k){
  const L=[[BX0,GY,BX0,ROOF-40],[BX0+BW,GY,BX0+BW,ROOF-40],[BX0,ROOF-40,BX0+BW,ROOF-40],[BX0,GY,BX0+BW,GY]];
  for(let i=1;i<NF;i++)L.push([BX0,GY-i*FH,BX0+BW,GY-i*FH]);
  L.push([EX0,ROOF,EX0,GY],[BX0+BW/2,GY,BX0+BW/2,ROOF-40]);
  let g='';L.forEach(([a,b,c,d],i)=>{const q=tw(k,i*0.04,0.45+i*0.04,E.io);if(q<=0)return;g+=S(`M${a},${b} L${f(lerp(a,c,q))},${f(lerp(b,d,q))}`,C.gold,3,'opacity=".9"');});
  for(let i=0;i<12;i++){const q=tw(k,0.1+i*0.03,0.5+i*0.03);g+=rect(0,300+i*130,1080,1,C.gold,'',`opacity="${f(0.12*q)}"`)+rect(i*95,0,1,1920,C.gold,'',`opacity="${f(0.08*q)}"`)}
  return g;
}
function navyBG(){
  let g=rect(0,0,1080,1920,'url(#gNavy)');
  g+=G('translate(0,1660)',skylineV('#16304A',1,71,0,520))+G('translate(0,1660)',skylineV('#132A40',1,73,0,300));
  const r=rnd(5);for(let i=0;i<40;i++)g+=circ(r()*1080,r()*900,1.5+r()*1.5,'#fff',`opacity="${f(0.2+r()*0.4)}"`);
  g+=rect(0,1720,1080,200,'#0B1824');
  return g;
}
function bigKey(ang,s){
  const sx=Math.cos(ang);
  return G(`scale(${f(s)})`,`<g transform="scale(${f(Math.abs(sx)<0.06?0.06:sx)},1)">`+circ(0,-150,90,'none',`stroke="url(#gGold)" stroke-width="38"`)+circ(0,-150,40,'none',`stroke="#E9D5A6" stroke-width="4" opacity=".6"`)+rect(-20,-60,40,300,'url(#gGold)',10)+rect(20,140,60,26,'url(#gGold)',6)+rect(20,190,44,24,'url(#gGold)',6)+rect(-14,-50,8,280,'#fff','','opacity=".35"')+'</g>');
}
// notifications
const NOTE=[['bell',-1],['wrench',0],['drop',1],['bolt',2],['chat',3],['doc',4],['elev',5],['broom',3]];
function notes(t,org){ // org 0..1 organize
  let g='';const rows=['الصيانة','المصاعد','النظافة','الخدمات','السكان','التقارير','الطاقة','المرافق'];
  NOTE.forEach(([n,fi],j)=>{const r=rnd(j+11);
    const bx=120+r()*840, by=560+r()*1000;
    const jx=Math.sin(t*2.3+j*1.7)*26, jy=Math.cos(t*1.9+j)*22;
    const k=E.io(clamp((org-j*0.06)/0.6));
    const tx=60, ty=520+j*118;
    const x=lerp(bx+jx,tx,k), y=lerp(by+jy,ty,k);
    const appear=pop(t,4.2+j*0.18,0.4);if(appear<=0)return;
    let c=rect(-6,-40,k*330+12,80,'#fff',40,`filter="url(#sh)" opacity="${f(0.95)}"`)+circ(34,0,30,k>0.9?C.navy:'#C0392B')+icon(n,34,0,1.6,'#fff',2);
    if(k>0.6) c+=txt(k*300-10,10,rows[j],26,C.navy,600,'start',`opacity="${f((k-0.6)/0.4)}"`);
    if(k>0.95) c+=okBadge(k*330-30+0,0,0.8);
    if(k<0.5) c+=circ(58,-26,10,C.gold);
    g+=G(tr(x,y,appear*lerp(1,0.85,k),(1-k)*Math.sin(t*3+j)*8),c);
  });
  return g;
}
function goldPath(k,pts,w=6,glow=1){ // draw polyline partially
  let L=0;const seg=[];for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);seg.push(d);L+=d}
  let rem=k*L,d=`M${pts[0][0]},${pts[0][1]}`,hx=pts[0][0],hy=pts[0][1];
  for(let i=1;i<pts.length&&rem>0;i++){const q=Math.min(1,rem/seg[i-1]);hx=lerp(pts[i-1][0],pts[i][0],q);hy=lerp(pts[i-1][1],pts[i][1],q);d+=` L${f(hx)},${f(hy)}`;rem-=seg[i-1]}
  return (glow?S(d,C.gold,w*3,'opacity=".25"'):'')+S(d,C.gold,w)+(k>0&&k<1?circ(hx,hy,w*2.2,'#FFF3D6')+circ(hx,hy,w*4,C.gold,'opacity=".35"'):'');
}
// ============ MASTER ============
function frame(t){
  let g='',h='';
  const lits=[0,0,0,0,0,0];
  // lighting schedule
  for(let i=0;i<NF;i++){lits[i]=tw(t,10.0+i*0.45,10.5+i*0.45);}
  if(t<4.0){ // S1
    g+=navyBG();
    const kAng=t*2.2, ks=lerp(1,0.35,tw(t,1.2,2.3,E.io));
    const kx=lerp(540,540,0), ky=lerp(900,GY-80,tw(t,1.2,2.3,E.io));
    const bpK=tw(t,1.0,2.6);
    g+=blueprint(bpK);
    const rise=tw(t,2.0,2.9,E.out);
    if(rise>0){g+=`<clipPath id="rs"><rect x="0" y="${f(GY-(GY-ROOF+140)*rise)}" width="1080" height="2000"/></clipPath>`;
      g+=`<g clip-path="url(#rs)">${buildingCut(t,[0.2,0.2,0.2,0.2,0.2,0.2])}`;
      // facade doors opening
      const op=tw(t,3.0,3.8,E.io);
      const hw=BW/2;
      const fac=facade();
      g+=`<clipPath id="fl"><rect x="${BX0}" y="0" width="${hw}" height="2000"/></clipPath><clipPath id="fr"><rect x="${BX0+hw}" y="0" width="${hw}" height="2000"/></clipPath>`;
      const cs=Math.cos(op*Math.PI/2);
      if(op<0.98){
        g+=`<g transform="translate(${BX0},0) matrix(${f(cs)},${f(-0.18*op)},0,1,0,0) translate(${-BX0},0)"><g clip-path="url(#fl)">${fac}</g><rect x="${BX0}" y="${ROOF-40}" width="${hw}" height="${GY-ROOF+40}" fill="#0A1622" opacity="${f(op*0.5)}" clip-path="url(#fl)"/></g>`;
        g+=`<g transform="translate(${BX0+BW},0) matrix(${f(cs)},${f(0.18*op)},0,1,0,0) translate(${-(BX0+BW)},0)"><g clip-path="url(#fr)">${fac}</g><rect x="${BX0+hw}" y="${ROOF-40}" width="${hw}" height="${GY-ROOF+40}" fill="#0A1622" opacity="${f(op*0.5)}" clip-path="url(#fr)"/></g>`;
      }
      g+='</g>';
      if(rise<1) g+=rect(BX0-20,GY-(GY-ROOF+140)*rise-3,BW+40,6,C.gold,3);
    }
    if(t<2.4) g+=G(tr(kx,ky),bigKey(kAng,ks),1-tw(t,2.1,2.4));
    if(t<1.4) for(let i=0;i<5;i++){const a=t*1.5+i*1.26;g+=sparkle(540+Math.cos(a)*260,900+Math.sin(a)*300,0.4,0.6*(1-tw(t,1.0,1.4)),a*30,C.goldL)}
    const z=lerp(1,1.12,tw(t,3.0,4.0,E.in));
    g=G(`translate(540,1100) scale(${f(z)}) translate(-540,-1100)`,g);
    h+=head('العقار ليس مجرد مبنى…',t,0.5,3.9,{y:200,size:72,color:'#fff'});
  } else if(t<8.0){ // S2 vertical travel
    g+=navyBG();
    let b=buildingCut(t,[0.25,0.25,0.25,0.25,0.25,0.25]);
    const pr=tw(t,4.0,7.6,E.io);
    const z=lerp(1.75,1.0,tw(t,7.2,8.0,E.io));
    const cy=lerp(GY-260,ROOF+200,pr);
    const cyy=lerp(cy,1100,tw(t,7.2,8.0,E.io));
    g+=G(`translate(540,1060) scale(${f(z)}) translate(-540,${f(-cyy)})`,b);
    g+=notes(t,0);
    h+=head('وراء كل مبنى…/تفاصيل تحتاج إلى إدارة',t,4.4,7.9,{y:170,size:64,color:'#fff'});
  } else if(t<14.0){ // S3 manager system
    g+=navyBG();
    const sh=tw(t,8.0,8.8,E.io);
    const bs=lerp(1,0.8,sh), bx=lerp(0,150,sh);
    g+=G(`translate(${f(540+bx)},1660) scale(${f(bs)}) translate(-540,-1660)`,buildingCut(t,lits));
    // manager
    const mx=lerp(-160,190,tw(t,8.0,8.9,E.out));
    const tap=tw(t,9.0,9.15)*(1-tw(t,9.15,9.35));
    g+=man({x:mx,y:1800,s:0.72,older:true,t,expr:t>9.2?'smile':'neutral',look:[0.8,-0.5],L:[-62,-318],R:[62+tap*20,-318-tap*30],hold:{both:'tablet',tabAng:-6}});
    // golden control line: tablet -> up building side
    const tbx=mx+0, tby=1800-0.72*(318+40);
    const pts=[[tbx,tby],[tbx+120,tby-60],[310,1640],[310,ROOF*0.8+1660*0.2]];
    const lk=tw(t,9.15,10.2,E.io);
    if(t>9.15){g+=goldPath(lk,pts,5);
      for(let i=0;i<NF;i++){const q=tw(t,10.0+i*0.45,10.4+i*0.45,E.out);const yy=1660-(1660-(fy(i)+80))*0.8;if(q>0)g+=S(`M310,${f(yy)} L${f(310+q*130)},${f(yy)}`,C.gold,4)+circ(310,yy,8,C.gold);}
      if(t>9.0){const r=tw(t,9.1,9.7);g+=circ(tbx,tby,30+r*120,'none',`stroke="${C.gold}" stroke-width="4" opacity="${f(1-r)}"`)}}
    g+=notes(t,tw(t,10.3,12.6));
    h+=head('إدارة الأملاك',t,9.4,13.9,{y:150,size:76,color:'#fff'});
    h+=head('تشغيل العقارات',t,10.6,13.9,{y:255,size:64,color:C.goldL});
    const ch=['تنظيم','متابعة','تشغيل','تنسيق'];
    h+=`<div style="position:absolute;left:0;right:0;top:370px;display:flex;justify-content:center;gap:14px;direction:rtl">`+ch.map((c,i)=>{const k=tw(t,11.8+i*0.25,12.2+i*0.25,E.out)*(1-tw(t,13.7,13.95));return `<div style="opacity:${f(k)};transform:translateY(${f((1-k)*20)}px);border:2px solid ${C.gold};color:#fff;border-radius:40px;padding:6px 26px 10px;font-family:${FONT};font-weight:600;font-size:34px">${c}</div>`}).join('')+'</div>';
  } else if(t<20.8){ // S4 four frames
    g+=navyBG();
    const back=tw(t,17.6,18.6,E.io);
    const allLit=[1,1,1,1,1,1];
    // building behind (dim) then forward
    g+=G(`translate(540,1660) scale(${f(lerp(0.8,0.92,back))}) translate(-540,-1660)`,buildingCut(t,allLit),lerp(0.25,1,back));
    if(back<1){
      const fr=[[1,'صيانة المرافق'],[4,'متابعة التشغيل'],[3,'المرافق المشتركة'],[0,'مراجعة المعلومات']];
      let fg='';
      fr.forEach(([fi,l],j)=>{const p=tw(t,14.0+j*0.5,14.55+j*0.5,E.out);if(p<=0)return;
        const y=520+j*300, dir=j%2?1:-1;
        const inner=`<clipPath id="fc${j}"><rect x="-430" y="-125" width="860" height="250" rx="22"/></clipPath><g clip-path="url(#fc${j})">${rect(-430,-125,860,250,'#F6F0E6')}<g transform="scale(1.32) translate(${-(RX0+RW/2)},${-(fy(fi)+FH/2-8)})">${floorContent(fi,t,1)}</g></g>`+rect(-430,-125,860,250,'none',22,`stroke="${C.gold}" stroke-width="5"`)+G(tr(dir>0?300:-300,-125),rect(-120,-26,240,52,C.navy,26)+txt(0,10,l,28,'#fff',600));
        fg+=G(`translate(${f(540+(1-p)*dir*700)},${y})`,inner);});
      const lk=tw(t,16.3,17.4,E.io);
      if(lk>0)fg+=goldPath(lk,[[90,450],[90,520],[110,520],[90,520],[90,820],[90,1120],[90,1420],[90,1560]],5);
      [520,820,1120,1420].forEach((y,j)=>{if(lk>j*0.28+0.05)fg+=circ(90,y,13,C.gold)+circ(90,y,6,'#fff')});
      g+=G('',fg,1-back);
    } else {
      const up=tw(t,18.6,20.4,E.io);
      const s=0.92, X=x=>540+(x-540)*s, Y=y=>1660+(y-1660)*s;
      g+=goldPath(up,[[X(BX0-20),Y(GY)],[X(BX0-20),Y(ROOF-60)],[X(BX0+BW+20),Y(ROOF-60)],[X(BX0+BW+20),Y(GY)]],6);
      if(up>0.98){const gl=tw(t,20.2,20.8);g+=`<ellipse cx="540" cy="1100" rx="${f(500+gl*60)}" ry="760" fill="#FFE7B5" opacity="${f(0.12*(1-gl*0.5))}" filter="url(#blur)"/>`}
    }
    h+=head('من المتابعة إلى التشغيل…',t,16.6,18.55,{y:190,size:66,color:'#fff'});
    h+=head('كل تفصيلة لها مكانها',t,18.7,20.7,{y:190,size:70,color:C.goldL});
  } else { // S5 brand
    const k=tw(t,20.8,21.6,E.io);
    g+=rect(0,0,1080,1920,'url(#gNavy)');
    // building -> silhouette, sliding to bottom
    const s=lerp(0.92,0.3,tw(t,20.9,21.9,E.io)), ty=lerp(0,200,tw(t,20.9,21.9,E.io));
    let sil=`<g opacity="${f(1-k)}">${buildingCut(t,[1,1,1,1,1,1])}</g>`+rect(BX0,ROOF-58,BW,GY-ROOF+58,'none',4,`stroke="${C.gold}" stroke-width="4" opacity="${f(k)}"`);
    for(let i=1;i<NF;i++) sil+=rect(BX0,GY-i*FH,BW,2,C.gold,'',`opacity="${f(k*0.6)}"`);
    for(let i=0;i<NF;i++) for(let c=0;c<5;c++) sil+=rect(BX0+60+c*130,fy(i)+40,90,FH-90,'#FFE7B5',3,`opacity="${f(k*0.22)}"`);
    g+=G(`translate(540,${f(1660+ty)}) scale(${f(s)}) translate(-540,-1660)`,sil);
    // gold line from roof to plaque
    const pl=tw(t,21.0,21.9,E.io);
    const px=90,py=420,pw=900,ph=420;
    if(pl>0){g+=`<rect x="${px}" y="${py}" width="${pw}" height="${ph}" rx="36" fill="#FBF8F2" opacity="${f(tw(t,21.5,21.9))}"/>`;
      g+=goldPath(pl,[[540,py],[px+pw-36,py],[px+pw,py+36],[px+pw,py+ph-36],[px+pw-36,py+ph],[px+36,py+ph],[px,py+ph-36],[px,py+36],[px+36,py],[540,py]],5,0);}
    const lr=tw(t,21.5,22.3,E.io);
    if(lr>0) g+=logo(540,py+ph/2,760,1,lr,tw(t,22.0,22.4));
    const sg=tw(t,22.4,23.0,E.out);g+=rect(540-sg*260,980,sg*520,3,C.gold,2)+circ(540,981,sg*7,C.gold);
    h+=head('إدارة وتشغيل يصنعان الفرق',t,22.3,0,{y:880,size:58,color:'#fff',weight:600});
    // contacts
    const lab=tw(t,24.2,24.7,E.out);
    h+=`<div style="position:absolute;left:0;right:0;top:1035px;text-align:center;direction:rtl;font-family:${FONT};font-weight:600;font-size:40px;color:${C.goldL};opacity:${f(lab)}">للتواصل والاستفسار:</div>`;
    const phoneP='M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1z';
    const webP='M12 2a10 10 0 100 20 10 10 0 000-20zm0 0c3 3 3 17 0 20m0-20c-3 3-3 17 0 20M2 12h20';
    const mailP='M3 6h18v12H3z M3 6l9 7 9-7';
    const ic=(p,c,fill)=>`<svg width="44" height="44" viewBox="0 0 24 24"><path d="${p}" fill="${fill?c:'none'}" stroke="${fill?'none':c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const kp=tw(t,24.4,25.0,E.back);
    h+=`<div style="position:absolute;left:0;right:0;top:1110px;display:flex;justify-content:center;opacity:${f(clamp(kp))};transform:scale(${f(0.75+0.25*kp)})"><div style="display:flex;align-items:center;gap:26px;background:linear-gradient(180deg,#D8B56A,#C59C4B);color:#0F202F;border-radius:34px;padding:18px 54px 20px;font-family:Montserrat;font-weight:700;font-size:92px;direction:ltr;box-shadow:0 16px 40px rgba(0,0,0,.35)"><span style="width:92px;height:92px;border-radius:50%;background:#0F202F;display:inline-flex;align-items:center;justify-content:center">${ic(phoneP,'#E3CB97',1)}</span>920022596</div></div>`;
    [['www.address.com.sa',webP],['info@address.com.sa',mailP]].forEach(([v,p],i)=>{const kk=tw(t,24.8+i*0.3,25.4+i*0.3,E.out);
      h+=`<div style="position:absolute;left:0;right:0;top:${1300+i*120}px;display:flex;justify-content:center;opacity:${f(kk)};transform:translateY(${f((1-kk)*20)}px)"><div style="display:flex;align-items:center;gap:22px;color:#fff;font-family:Montserrat;font-weight:600;font-size:56px;direction:ltr"><span style="width:76px;height:76px;border-radius:50%;border:3px solid #C59C4B;display:inline-flex;align-items:center;justify-content:center">${ic(p,'#E3CB97',0)}</span>${v}</div></div>`+(i===0?`<div style="position:absolute;left:340px;right:340px;top:1408px;height:2px;background:linear-gradient(90deg,transparent,#C59C4B,transparent);opacity:${f(kk)}"></div>`:'');});
  }
  // top gradient for legibility
  g+=`<rect x="0" y="0" width="1080" height="520" fill="url(#gTop)"/>`;
  // transitions
  if(t>3.85&&t<4.25) g+=rect(0,0,1080,1920,'#0A1622','',`opacity="${f(1-Math.abs(t-4.05)/0.2)}"`);
  if(t>13.8&&t<14.2) g+=rect(0,0,1080,1920,'#0A1622','',`opacity="${f(1-Math.abs(t-14.0)/0.2)}"`);
  if(t>29.6) g+=rect(0,0,1080,1920,'#000','',`opacity="0"`);
  return {art:g,html:h};
}
function render(t){return frame(t)}
