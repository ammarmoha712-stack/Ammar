// ===== ALMOSAFER RESORTS — The Story of Qasab (62s, 1080x1920) =====
Object.assign(C,{navy:'#1A3E62',navy2:'#2A5680',gold:'#C9A46A',goldL:'#E9D3A6',goldD:'#9C7A45'});
const MUD='#C99467',MUD2='#B37E55',MUDD='#946440',MUDL='#DDB085',SAND='#E8C893',SANDD='#C99E62',SALT='#F4F7FA',TURQ='#38B6C4';
const TL=t=>t; // timeline helper
// ---------- generic helpers ----------
function grad(id){return `url(#${id})`}
function vign(){return `<rect width="1080" height="1920" fill="url(#gVig)"/>`}
function headM(text,t,t0,t1,o={}){return head(text,t,t0,t1,Object.assign({size:72,color:'#fff',shadow:'0 4px 24px rgba(60,30,0,.45)'},o))}
function subM(text,t,t0,t1,y,color='#fff',size=40){
  if(t<t0-0.1||(t1&&t>t1+0.1))return '';const k=tw(t,t0,t0+0.5,E.out)*(t1?1-tw(t,t1-0.3,t1,E.in):1);
  return `<div style="position:absolute;left:60px;right:60px;top:${y}px;text-align:center;direction:rtl;font-family:${FONT};font-weight:600;font-size:${size}px;color:${color};opacity:${f(k)};transform:translateY(${f((1-k)*20)}px);text-shadow:0 3px 16px rgba(60,30,0,.5)">${text}</div>`;
}
// ---------- salt crystal (rotating cube) ----------
function crystal(x,y,R,a,glow=1,op=1){
  const pts=[0,1,2,3].map(k=>{const q=a+k*Math.PI/2;return [Math.cos(q)*R,Math.sin(q)*R*0.42]});
  const H=R*1.15, top=pts.map(p=>[p[0],p[1]-H*0.5]), bot=pts.map(p=>[p[0],p[1]+H*0.5]);
  let g=`<circle cx="0" cy="0" r="${f(R*2.4)}" fill="url(#gCry)" opacity="${f(0.75*glow)}"/>`;
  // side faces facing viewer (normal y>0)
  const faces=[];
  for(let k=0;k<4;k++){const k2=(k+1)%4;const mid=(pts[k][1]+pts[k2][1])/2;if(mid>-0.01)faces.push([k,k2,mid,(pts[k][0]+pts[k2][0])/2])}
  faces.sort((p,q)=>p[2]-q[2]).forEach(([k,k2,mid,mx])=>{const sh=0.5+0.5*(mx/R);
    const col=`rgb(${Math.round(lerp(200,250,sh))},${Math.round(lerp(220,252,sh))},${Math.round(lerp(236,255,sh))})`;
    g+=P(`M${f(top[k][0])},${f(top[k][1])} L${f(top[k2][0])},${f(top[k2][1])} L${f(bot[k2][0])},${f(bot[k2][1])} L${f(bot[k][0])},${f(bot[k][1])} Z`,col,`stroke="#fff" stroke-width="${f(R*0.03)}" stroke-linejoin="round"`);
    g+=S(`M${f(lerp(top[k][0],top[k2][0],0.3))},${f(lerp(top[k][1],top[k2][1],0.3)+H*0.2)} L${f(lerp(bot[k][0],bot[k2][0],0.55))},${f(lerp(bot[k][1],bot[k2][1],0.55)-H*0.25)}`,'#fff',R*0.025,'opacity=".7"');});
  g+=P(`M${top.map(p=>f(p[0])+','+f(p[1])).join(' L')} Z`,'#FFFFFF',`stroke="#E3EEF6" stroke-width="${f(R*0.03)}"`);
  g+=P(`M${f(top[0][0]*0.5)},${f(top[0][1]*0.5-H*0.5)} L${f(top[1][0]*0.5)},${f(top[1][1]*0.5-H*0.5)} L${f(top[2][0]*0.5)},${f(top[2][1]*0.5-H*0.5)} Z`,'#DDEBF5','opacity=".6"');
  const sp=(Math.sin(a*3)+1)/2;
  g+=sparkle(R*0.5,-H*0.55,R*0.012*(0.6+sp),1,a*40,'#fff')+sparkle(-R*0.7,H*0.1,R*0.008*(1.4-sp),0.9,-a*30,'#fff');
  return `<g transform="translate(${f(x)},${f(y)})" opacity="${f(op)}">${g}</g>`;
}
function dust(t,n,seed,x0,y0,w,h,col='#FFE9B8',sz=3){let g='';const r=rnd(seed);for(let i=0;i<n;i++){const px=x0+((r()*w+t*(20+r()*30))%w),py=y0+r()*h+Math.sin(t+i)*10;g+=circ(px,py,sz*(0.5+r()),col,`opacity="${f(0.3+0.5*Math.abs(Math.sin(t*1.3+i)))}"`)}return g}
// ---------- characters ----------
function guide(o){return man(Object.assign({},o))}
function woman(x,y,s,t,o={}){
  const w=o.walk||0;let g=`<ellipse cx="0" cy="2" rx="80" ry="12" fill="#3a2410" opacity=".15"/>`;
  g+=P(`M-40,-450 C-90,-430 -100,-380 -102,-300 L${f(-110+w*6)},-8 Q0,4 ${f(110+w*6)},-8 L102,-300 C100,-380 90,-430 40,-450 Z`,'#1E1B22');
  g+=P('M60,-440 C90,-420 100,-380 102,-300 L110,-8 Q90,-4 70,-4 L72,-300 Z','#2C2833');
  g+=S('M-6,-440 L-10,-20','#C9A46A',3,'opacity=".7"');
  g+=S(`M-80,-420 L-100,-300 L${f(-70+(o.wave?-30:0))},${f(o.wave?-420:-230)}`,'#1E1B22',36)+S('M80,-420 L96,-300 L70,-230','#1E1B22',36);
  g+=circ(o.wave?-100:-70,o.wave?-430:-226,13,'#D4A07F')+circ(70,-226,13,'#D4A07F');
  g+=P('M0,-600 C60,-600 76,-550 74,-500 C72,-460 50,-440 0,-438 C-50,-440 -72,-460 -74,-500 C-76,-550 -60,-600 0,-600 Z','#1E1B22');
  g+=`<ellipse cx="0" cy="-514" rx="40" ry="48" fill="#D9A684"/>`;
  g+=`<ellipse cx="-14" cy="-520" rx="5" ry="${f(6.5*blinkAt(t,3))}" fill="#2A211D"/><ellipse cx="14" cy="-520" rx="5" ry="${f(6.5*blinkAt(t,3))}" fill="#2A211D"/>`+S('M-11,-490 Q0,-480 11,-490','#8B3B33',3.5)+S('M-24,-536 Q-14,-542 -6,-537 M6,-537 Q14,-542 24,-536','#2A211D',4);
  g+=`<ellipse cx="-24" cy="-500" rx="8" ry="4" fill="#E07A6A" opacity=".3"/><ellipse cx="24" cy="-500" rx="8" ry="4" fill="#E07A6A" opacity=".3"/>`;
  g+=P('M-44,-540 C-44,-580 44,-580 44,-540 C40,-566 -40,-566 -44,-540 Z','#1E1B22');
  return `<g transform="translate(${f(x)},${f(y)}) scale(${f(s)})">${g}</g>`;
}
function child(x,y,s,t,o={}){
  const girl=o.girl, w=o.walk||0;let g=`<ellipse cx="0" cy="2" rx="60" ry="10" fill="#3a2410" opacity=".15"/>`;
  g+=`<ellipse cx="${f(-20+w*8)}" cy="-6" rx="18" ry="7" fill="#5B3A29"/><ellipse cx="${f(20-w*8)}" cy="-6" rx="18" ry="7" fill="#5B3A29"/>`;
  g+=P('M-30,-250 C-60,-240 -66,-200 -66,-160 L-70,-12 Q0,0 70,-12 L66,-160 C66,-200 60,-240 30,-250 Z',girl?'#E0607E':'#FBFBF9',`stroke="${girl?'#C2486A':'#D5D9E0'}" stroke-width="2"`);
  if(girl) g+=rect(-66,-110,132,10,'#FFD166',4);
  const ar=o.point?'M50,-230 L90,-280 L120,-320':'M50,-230 L70,-170 L62,-120';
  g+=S('M-50,-230 L-70,-170 L-62,-120',girl?'#E0607E':'#E8EAEE',26)+S(ar,girl?'#E0607E':'#E8EAEE',26)+circ(-62,-118,11,'#D9A684')+circ(o.point?120:62,o.point?-322:-118,11,'#D9A684');
  g+=`<ellipse cx="0" cy="-320" rx="62" ry="66" fill="#D9A684"/>`;
  if(girl) g+=P('M-64,-320 C-70,-400 70,-400 64,-320 C60,-360 30,-376 0,-374 C-30,-376 -60,-360 -64,-320 Z','#3B2418')+circ(56,-360,14,'#FFD166');
  else g+=P('M-56,-356 C-50,-398 50,-398 56,-356 Z','#FFFFFF','stroke="#E3E6EA" stroke-width="2"');
  g+=`<ellipse cx="-20" cy="-322" rx="7" ry="${f(9*blinkAt(t,4))}" fill="#2A211D"/><ellipse cx="20" cy="-322" rx="7" ry="${f(9*blinkAt(t,4))}" fill="#2A211D"/>`+circ(-17,-326,2.5,'#fff')+circ(23,-326,2.5,'#fff');
  g+=(o.wow?`<ellipse cx="0" cy="-286" rx="9" ry="11" fill="#7A2E2A"/>`:S('M-14,-292 Q0,-280 14,-292','#8B3B33',4));
  g+=`<ellipse cx="-34" cy="-300" rx="9" ry="5" fill="#E07A6A" opacity=".35"/><ellipse cx="34" cy="-300" rx="9" ry="5" fill="#E07A6A" opacity=".35"/>`;
  return `<g transform="translate(${f(x)},${f(y)}) scale(${f(s)})">${g}</g>`;
}
function workerS(x,y,s,t,ph){ // salt worker with rake
  const r=Math.sin(t*3+ph);
  const hx=lerp(-150,-60,(r+1)/2);
  let g=man({x:0,y:0,s:1,ghutra:1,t,expr:'smile',look:[-0.6,0.5],L:[hx,-260],R:[hx+90,-230]});
  g=G('',S(`M${f(hx+60)},-250 L${f(hx-140)},0`,'#8A5A3C',10)+rect(hx-200,-8,130,14,'#6B4430',4)+g);
  return G(`translate(${f(x)},${f(y)}) scale(${f(s)})`,g);
}
// ---------- map plate (isometric Qasab) ----------
function iso(u,v,cx,cy,a,b){return [cx+(u-v)*a*0.5,cy+(u+v)*b*0.5]}
function isoBox(u,v,w,d,h,cx,cy,a,b,top,l,r){
  const p=(uu,vv)=>iso(uu,vv,cx,cy,a,b);
  const A=p(u,v),B=p(u+w,v),Cc=p(u+w,v+d),D=p(u,v+d);
  const H=h*b;
  return P(`M${f(D[0])},${f(D[1])} L${f(Cc[0])},${f(Cc[1])} L${f(Cc[0])},${f(Cc[1]-H)} L${f(D[0])},${f(D[1]-H)} Z`,l)+P(`M${f(B[0])},${f(B[1])} L${f(Cc[0])},${f(Cc[1])} L${f(Cc[0])},${f(Cc[1]-H)} L${f(B[0])},${f(B[1]-H)} Z`,r)
   +P(`M${f(A[0])},${f(A[1]-H)} L${f(B[0])},${f(B[1]-H)} L${f(Cc[0])},${f(Cc[1]-H)} L${f(D[0])},${f(D[1]-H)} Z`,top);
}
function mapPlate(cx,cy,a,b,t,build=1){
  let g='';const T=60;
  const c=[iso(-1,-1,cx,cy,a,b),iso(1,-1,cx,cy,a,b),iso(1,1,cx,cy,a,b),iso(-1,1,cx,cy,a,b)];
  g+=P(`M${c[3]} L${c[2]} L${c[2][0]},${c[2][1]+T} L${c[3][0]},${c[3][1]+T} Z`,SANDD)+P(`M${c[1]} L${c[2]} L${c[2][0]},${c[2][1]+T} L${c[1][0]},${c[1][1]+T} Z`,'#B88A52');
  g+=P(`M${c.join(' L')} Z`,'url(#gMap)');
  // roads
  g+=S(`M${iso(-1,0.1,cx,cy,a,b)} Q${iso(0,-0.1,cx,cy,a,b)} ${iso(1,0.2,cx,cy,a,b)}`,'#F6E3BE',8)+S(`M${iso(0.1,-1,cx,cy,a,b)} L${iso(0,1,cx,cy,a,b)}`,'#F6E3BE',6);
  // salt fields (white diamonds) area u 0.3..0.9 v -0.9..-0.3
  const k1=tw(build,0.2,0.6);
  for(let i=0;i<3;i++)for(let j=0;j<3;j++){const u=0.3+i*0.2,v=-0.9+j*0.2;const q=[iso(u,v,cx,cy,a,b),iso(u+0.17,v,cx,cy,a,b),iso(u+0.17,v+0.17,cx,cy,a,b),iso(u,v+0.17,cx,cy,a,b)];
    g+=P(`M${q.join(' L')} Z`,SALT,`opacity="${f(k1)}" stroke="#D8C3A0" stroke-width="2"`);}
  // palm groves
  const k2=tw(build,0.3,0.7);const r=rnd(9);
  for(let i=0;i<16;i++){const u=-0.9+r()*0.6,v=-0.2+r()*1.0;const p=iso(u,v,cx,cy,a,b);g+=G(tr(p[0],p[1],0.13*k2),palm(0,0,1,Math.sin(t+i)*4))}
  // village: mud boxes u -0.2..0.3 v 0.2..0.8
  const k3=tw(build,0.4,0.85);
  const r2=rnd(21);const bx=[];
  for(let i=0;i<10;i++)bx.push([-0.25+r2()*0.45,0.15+r2()*0.55,0.08+r2()*0.06,0.08+r2()*0.06,0.1+r2()*0.12]);
  bx.sort((p,q)=>(p[0]+p[1])-(q[0]+q[1])).forEach(([u,v,w,d,h])=>g+=isoBox(u,v,w,d,h*k3,cx,cy,a,b,MUDL,MUD,MUD2));
  // resort: pool + building u 0.45..0.85 v 0.35..0.8
  const k4=tw(build,0.55,0.95);
  const pq=[iso(0.5,0.45,cx,cy,a,b),iso(0.75,0.45,cx,cy,a,b),iso(0.75,0.62,cx,cy,a,b),iso(0.5,0.62,cx,cy,a,b)];
  g+=P(`M${pq.join(' L')} Z`,TURQ,`opacity="${f(k4)}" stroke="#fff" stroke-width="3"`);
  g+=isoBox(0.5,0.68,0.3,0.12,0.12*k4,cx,cy,a,b,'#F4EDE2','#E3D6C2','#D2C2AA');
  return g;
}
// ---------- desert ----------
function desert(t,cam=0){
  let g=rect(0,0,1080,1920,'url(#gSunset)');
  const sy=lerp(520,600,cam);
  g+=circ(760,sy,110,'#FFF1C9')+circ(760,sy,200,'#FFE3A0','opacity=".35"')+circ(760,sy,340,'#FFD58A','opacity=".15"');
  const dunes=[[880,'#E9B877','#D79E5C',0.2],[1040,'#E3AE6C','#C98F4E',0.35],[1220,'#DDA463','#BF8444',0.55],[1430,'#D69B58','#B5793B',0.8],[1650,'#CF9350','#A86E33',1]];
  dunes.forEach(([y,c1,c2,p],i)=>{const off=(cam*600*p)%2400, yy=y+cam*240*p;
    let d=`M-50,${yy}`;for(let x=-50;x<=1130;x+=60){const h=Math.sin((x+off)*0.004+i*1.7)*60+Math.sin((x+off)*0.011+i)*18;d+=` L${x},${f(yy+h)}`}
    d+=` L1130,1920 L-50,1920 Z`;g+=P(d,`url(#gD${i})`);
    // ridge highlight
    let rr=`M-50,${yy}`;for(let x=-50;x<=1130;x+=60){const h=Math.sin((x+off)*0.004+i*1.7)*60+Math.sin((x+off)*0.011+i)*18;rr+=` L${x},${f(yy+h)}`}
    g+=S(rr,'#FFE2B0',3,'opacity=".5"');});
  // wind sand streaks
  for(let i=0;i<10;i++){const r=rnd(i+40);const x=((r()*1300+t*160)%1400)-160,y=1000+r()*800;g+=S(`M${f(x)},${f(y)} l${f(80+r()*60)},-4`,'#FFE7C2',2,`opacity="${f(0.25+0.2*Math.sin(t+i))}"`)}
  return g;
}
// ============ SCENES ============
// S1 0–11.3 desert + crystal + map
function S1(t){
  const cam=1-tw(t,0,3.2,E.out);
  let g=desert(t,cam*0.6);
  const z=lerp(1.0,1.12,tw(t,0,11.3,E.sine));
  let w='';
  const gx=lerp(540,250,tw(t,5.0,6.3,E.io)), gs=lerp(0.5,0.95,tw(t,0,3.2,E.out));
  // crystal
  const cIn=pop(t,2.2,0.8);
  const morph=tw(t,5.6,7.0,E.io);
  if(cIn>0&&morph<1){
    const cx=lerp(gx+220*gs,620,tw(t,4.6,5.8,E.io)), cy=lerp(1700-560*gs,1050,tw(t,4.6,5.8,E.io))+Math.sin(t*2)*12;
    w+=crystal(cx,cy,lerp(46,110,tw(t,4.6,5.8,E.io))*cIn*(1-morph*0.8),t*1.2+tw(t,4.6,6.0)*12,1+morph*2,1-morph);
    if(morph>0) w+=circ(cx,cy,60+morph*400,'#fff',`opacity="${f(0.5*(1-morph))}" filter="url(#blur)"`);
  }
  // map rises
  if(morph>0){
    const up=tw(t,5.8,7.6,E.out), b=tw(t,6.4,9.6);
    w+=`<ellipse cx="620" cy="1080" rx="${f(440*up)}" ry="${f(150*up)}" fill="#7A4A1E" opacity=".25" filter="url(#blur)"/>`;
    w+=G(`translate(620,${f(lerp(1200,900,up))}) scale(${f(up)}) translate(-620,-900)`,mapPlate(620,900,760,380,t,b));
    if(b>0.85){const pq=pop(t,9.4,0.5);const p=iso(0.1,0.35,620,900,760,380);w+=G(tr(p[0],p[1]-20,pq),P('M0,0 C-14,-26 -34,-44 -34,-70 A34,34 0 1,1 34,-70 C34,-44 14,-26 0,0 Z','#B5452E')+circ(0,-70,13,'#fff'))}
    for(let i=0;i<14;i++){const r=rnd(i+3);const a2=r()*6.28,rr=200+r()*300;const k=tw(t,5.8+r()*0.6,7.2+r()*0.6);if(k>0&&k<1)w+=circ(640+Math.cos(a2)*rr*k,1000+Math.sin(a2)*rr*0.5*k-k*120,4*(1-k),'#FFE9B8')}
  }
  // guide
  const point=tw(t,8.6,9.2,E.io);
  w+=guide({x:gx,y:lerp(1500,1700,tw(t,0,3.2,E.out)),s:gs,t,expr:t>2.6?(t>8.8?'big':'smile'):'neutral',look:[t>2.4?0.9:0,t>2.4?-0.4:0],tilt:t>2.4&&t<5?-5:0,
    walk:t>5&&t<6.3?Math.sin(t*9):0,L:[-96,-210],R:[lerp(96,250,point),lerp(-210,-430,point)]});
  w+=dust(t,18,7,0,700,1080,1200);
  g+=G(`translate(540,1100) scale(${f(z)}) translate(-540,-1100)`,w);
  return g+vign();
}
// ---------- Najdi alley in perspective ----------
const AH=880, AF=820, AW=330, YG=420, YT=-520;
function proj(X,Y,z){return [540+X*AF/z, AH+Y*AF/z]}
function wallQuad(side,z1,z2,v0,v1,u0=0,u1=1){ // side -1 left, 1 right; u along depth 0..1, v 0 top..1 ground
  const X=side*AW, za=lerp(z1,z2,u0), zb=lerp(z1,z2,u1), Y0=lerp(YT,YG,v0), Y1=lerp(YT,YG,v1);
  const p=[proj(X,Y0,za),proj(X,Y0,zb),proj(X,Y1,zb),proj(X,Y1,za)];
  return `M${p.map(q=>f(q[0])+','+f(q[1])).join(' L')} Z`;
}
function bay(side,z1,z2,k,t,market){
  let g='';const r=rnd(k*7+(side>0?3:0));
  const wallC=r()>0.5?MUD:'#C48C5E';
  g+=P(wallQuad(side,z1,z2,0,1),wallC);
  g+=P(wallQuad(side,z1,z2,0.94,1),MUD2);
  // mud texture lines
  for(let i=0;i<4;i++){const v=0.15+r()*0.7,u=r()*0.8;g+=P(wallQuad(side,z1,z2,v,v+0.008,u,u+0.15),MUDD,'opacity=".35"')}
  // parapet triangles (sharafat)
  const X=side*AW;
  for(let i=0;i<6;i++){const za=lerp(z1,z2,i/6+0.02),zb=lerp(z1,z2,(i+1)/6-0.02),zm=(za+zb)/2;
    const a=proj(X,YT,za),b=proj(X,YT,zb),c=proj(X,YT-70,zm);g+=P(`M${f(a[0])},${f(a[1])} L${f(b[0])},${f(b[1])} L${f(c[0])},${f(c[1])} Z`,wallC)}
  // vent triangles row
  for(let i=0;i<5;i++){const u=0.1+i*0.17;const za=lerp(z1,z2,u),zb=lerp(z1,z2,u+0.06),zm=(za+zb)/2;
    const a=proj(X,YT+110,za),b=proj(X,YT+110,zb),c=proj(X,YT+70,zm);g+=P(`M${f(a[0])},${f(a[1])} L${f(b[0])},${f(b[1])} L${f(c[0])},${f(c[1])} Z`,'#5A3A22')}
  // water spout
  {const p1=proj(X,YT+20,lerp(z1,z2,0.5)),p2=proj(X-side*70,YT+30,lerp(z1,z2,0.5));g+=S(`M${f(p1[0])},${f(p1[1])} L${f(p2[0])},${f(p2[1])}`,'#7A5236',Math.max(2,10*AF/lerp(z1,z2,0.5)/2))}
  if(market){
    // awning (sadu stripes)
    const zA=lerp(z1,z2,0.15), zB=lerp(z1,z2,0.85);
    const w1=proj(X,-60,zA),w2=proj(X,-60,zB),o1=proj(X-side*120,10,zA),o2=proj(X-side*120,10,zB);
    g+=P(`M${f(w1[0])},${f(w1[1])} L${f(w2[0])},${f(w2[1])} L${f(o2[0])},${f(o2[1])} L${f(o1[0])},${f(o1[1])} Z`,'#9E2B25');
    for(let s2=0;s2<4;s2++){const q=(s2+0.5)/4;const a1=[lerp(w1[0],o1[0],q),lerp(w1[1],o1[1],q)],a2=[lerp(w2[0],o2[0],q),lerp(w2[1],o2[1],q)];g+=S(`M${f(a1[0])},${f(a1[1])} L${f(a2[0])},${f(a2[1])}`,s2%2?'#F2E6D0':'#1E1B22',Math.max(2,9*AF/zA/2))}
    // counter
    const c1=proj(X-side*10,240,zA),c2=proj(X-side*10,240,zB),c3=proj(X-side*110,250,zB),c4=proj(X-side*110,250,zA),c5=proj(X-side*110,YG,zA),c6=proj(X-side*110,YG,zB);
    g+=P(`M${f(c4[0])},${f(c4[1])} L${f(c3[0])},${f(c3[1])} L${f(c6[0])},${f(c6[1])} L${f(c5[0])},${f(c5[1])} Z`,'#8A5A3C');
    g+=P(`M${f(c1[0])},${f(c1[1])} L${f(c2[0])},${f(c2[1])} L${f(c3[0])},${f(c3[1])} L${f(c4[0])},${f(c4[1])} Z`,'#A87650');
    // goods
    for(let i=0;i<4;i++){const zz=lerp(zA,zB,0.12+i*0.25);const p=proj(X-side*60,235,zz);const sc=AF/zz;
      const kinds=['#F4F7FA','#7A4A2A','#C9A46A','#B5452E'];g+=`<ellipse cx="${f(p[0])}" cy="${f(p[1]-14*sc)}" rx="${f(26*sc)}" ry="${f(18*sc)}" fill="${kinds[(i+k)%4]}"/>`;}
  } else {
    // door with Najdi geometric paint
    const zd1=lerp(z1,z2,0.35),zd2=lerp(z1,z2,0.6);
    g+=P(wallQuad(side,z1,z2,0.48,1,0.33,0.62),'#7A5236');
    g+=P(wallQuad(side,z1,z2,0.52,1,0.36,0.59),'#9C6B44');
    const cols=['#D9A441','#3E7CA6','#B5452E','#F2E6D0'];
    for(let i=0;i<4;i++)g+=P(wallQuad(side,z1,z2,0.56+i*0.1,0.6+i*0.1,0.38,0.57),cols[(i+k)%4],'opacity=".9"');
    // window w/ shutter
    g+=P(wallQuad(side,z1,z2,0.3,0.45,0.72,0.86),'#5A3A22')+P(wallQuad(side,z1,z2,0.31,0.44,0.73,0.79),'#8A5A3C');
  }
  return g;
}
function alley(t,camZ,marketFrom=99){
  let g=rect(0,0,1080,1920,'url(#gSkyA)');
  // far end: plaza w/ palms & far building
  g+=palm(470,AH+100,0.6,Math.sin(t)*3)+palm(630,AH+110,0.5,Math.sin(t+1)*3);
  g+=P(`M0,${AH} L1080,${AH} L1080,1920 L0,1920 Z`,'url(#gPath)');
  // bays
  const bays=[];for(let k=0;k<14;k++){const z1=200+k*340-camZ,z2=z1+340;if(z2<40||z1>5000)continue;bays.push([k,Math.max(40,z1),z2])}
  bays.sort((a,b)=>b[1]-a[1]).forEach(([k,z1,z2])=>{g+=bay(-1,z1,z2,k,t,k>=marketFrom&&k%2===0)+bay(1,z1,z2,k,t,k>=marketFrom&&k%2===1)});
  // light shafts
  g+=P('M700,0 L860,0 L540,1500 L420,1500 Z','#FFE7B5','opacity=".08"');
  return g;
}
function S2(t){ // 11.3–20.3
  const lt=t-11.3;
  const camZ=lerp(900,-150,tw(t,11.3,20.3,E.lin));
  let g=alley(t,camZ,3);
  // guide walking toward camera
  const pointL=(t>13.0&&t<14.6)?tw(t,13.0,13.4)*(1-tw(t,14.2,14.6)):0, pointR=(t>16.4&&t<18.0)?tw(t,16.4,16.8)*(1-tw(t,17.6,18.0)):0;
  const ph=t*7;
  g+=guide({x:540,y:1760,s:1.0,t,expr:'smile',look:[pointL?-0.9:pointR?0.9:0,-0.1],walk:Math.sin(ph),sway:Math.sin(ph)*4,rot:Math.sin(ph)*0.8,
    L:[lerp(-96+Math.sin(ph)*18,-250,pointL),lerp(-210,-430,pointL)],R:[lerp(96-Math.sin(ph)*18,250,pointR),lerp(-210,-430,pointR)]});
  // crystal leading
  g+=crystal(760+Math.sin(t*1.3)*30,1020+Math.sin(t*2)*16,52,t*1.4,1,1);
  g+=dust(t,14,17,0,600,1080,1200,'#FFF2D6',2.5);
  // transition from map at start
  if(lt<0.6) g+=rect(0,0,1080,1920,'#FFF6E3','',`opacity="${f(1-tw(lt,0,0.6))}"`);
  return g+vign();
}
// ---------- salt fields ----------
function saltField(t,camZ,y0=760){
  let g=rect(0,0,1080,1920,'url(#gSkyS)')+circ(300,420,90,'#FFF6DA')+circ(300,420,190,'#FFF0C4','opacity=".3"');
  g+=G(`translate(0,${y0})`,skylineV('#E8C99A',1,91,0,60));
  g+=rect(0,y0,1080,1920-y0,'#D8BC8E');
  const F=900,camY=520;
  const pr=(X,z)=>[540+X*F/z,y0+camY*F/z];
  for(let zi=20;zi>=0;zi--){const z1=280+zi*240-(camZ%240),z2=z1+210;if(z1<60)continue;
    for(let xi=-5;xi<=5;xi++){const X1=xi*330-150,X2=X1+300;
      const a=pr(X1,z2),b=pr(X2,z2),c=pr(X2,z1),d=pr(X1,z1);
      if(c[0]<-200||d[0]>1280)continue;
      g+=P(`M${f(a[0])},${f(a[1])} L${f(b[0])},${f(b[1])} L${f(c[0])},${f(c[1])} L${f(d[0])},${f(d[1])} Z`,(xi+zi)%3===0?'#EAF1F5':'#F6F9FB');
      if(z1<1400&&((xi*7+zi*3)%4===0)){const m=pr((X1+X2)/2,(z1+z2)/2);g+=sparkle(m[0]+Math.sin(t*2+xi)*20,m[1],0.25*F/z1,0.6+0.4*Math.sin(t*4+xi+zi),t*60,'#fff')}
    }}
  return g;
}
function saltPile(x,y,s){return G(tr(x,y,s),`<ellipse cx="0" cy="0" rx="90" ry="20" fill="#9AA8B3" opacity=".3"/>`+P('M-80,0 Q-40,-110 0,-120 Q40,-110 80,0 Z','#F7FAFC')+P('M0,-120 Q40,-110 80,0 L20,0 Q14,-70 0,-120 Z','#DCE6EE')+sparkle(-20,-80,0.3,1,20,'#fff'))}
function S3(t){ // 20.3–34.8
  let g='';
  if(t<22.6){ // crystal flight over desert
    const k=tw(t,20.3,22.6,E.io);
    g+=desert(t,0.6+k*1.6);
    g+=crystal(lerp(300,700,k),lerp(1500,700,k)+Math.sin(t*3)*20,lerp(60,40,k),t*2,1.5,1);
    for(let i=0;i<10;i++){const q=k-i*0.03;if(q>0)g+=circ(lerp(300,700,q),lerp(1500,700,q),6-i*0.5,'#fff',`opacity="${f(0.6-i*0.06)}"`)}
    if(t>22.0) g+=rect(0,0,1080,1920,'#FFFFFF','',`opacity="${f(tw(t,22.0,22.6))}"`);
    return g+vign();
  }
  if(t<29.2){
    const camZ=(t-22.6)*40;
    g+=saltField(t,camZ);
    // piles & workers
    g+=saltPile(260,1180,0.8)+saltPile(820,1240,1.0)+saltPile(400,1330,1.2);
    g+=workerS(560,1300,0.42,t,0)+workerS(250,1420,0.5,t,1.6);
    const ges=tw(t,24.0,24.6,E.io);
    g+=guide({x:800,y:1840,s:0.95,t,expr:t>24.2?'big':'smile',look:[-0.9,-0.2],L:[lerp(-96,-260,ges),lerp(-210,-420,ges)],R:[96,-210]});
    g+=crystal(780,980+Math.sin(t*2)*14,44,t*1.3,1,1-tw(t,28.6,29.2));
    if(t<23.2) g+=rect(0,0,1080,1920,'#FFFFFF','',`opacity="${f(1-tw(t,22.6,23.2))}"`);
    const z=lerp(1,1.08,tw(t,22.6,29.2,E.sine));
    g=G(`translate(540,1200) scale(${f(z)}) translate(-540,-1200)`,g);
    if(t>28.9) g+=rect(0,0,1080,1920,'#FFFFFF','',`opacity="${f(tw(t,28.9,29.2))}"`);
    return g+vign();
  }
  // macro crystal 29.2–34.8
  g+=rect(0,0,1080,1920,'url(#gMacro)');
  const r=rnd(77);for(let i=0;i<18;i++){g+=circ(r()*1080,r()*1920,30+r()*90,'#fff',`opacity="${f(0.08+0.1*Math.sin(t+i))}"`)}
  const gate=tw(t,33.6,34.8,E.in);
  const R=lerp(170,230,tw(t,29.2,33.6,E.sine));
  if(gate<0.5) g+=crystal(540,1000,R*(1+gate*1.5),t*0.7,1.4+gate*3,1-gate*2);
  if(gate>0){ // gateway ring opening onto festival
    const rr=lerp(60,1300,E.in(gate));
    g+=`<clipPath id="gateC"><circle cx="540" cy="1000" r="${f(rr)}"/></clipPath><g clip-path="url(#gateC)">${festival(34.8,0)}</g>`;
    g+=circ(540,1000,rr,'none',`stroke="#fff" stroke-width="${f(18*(1-gate)+6)}"`)+circ(540,1000,rr+16,'none',`stroke="${C.gold}" stroke-width="6" opacity="${f(1-gate)}"`);
    for(let i=0;i<12;i++){const a=i*0.52+t;g+=sparkle(540+Math.cos(a)*rr,1000+Math.sin(a)*rr,0.5,1-gate,a*40,'#fff')}
  }
  if(t<29.5) g+=rect(0,0,1080,1920,'#fff','',`opacity="${f(1-tw(t,29.2,29.5))}"`);
  return g+vign();
}
// ---------- festival ----------
function stall(x,y,k,t){
  let g='';
  g+=rect(x-200,y-330,14,330,'#6B4430')+rect(x+186,y-330,14,330,'#6B4430');
  // sadu awning
  g+=P(`M${x-230},${y-330} L${x+230},${y-330} L${x+210},${y-260} L${x-210},${y-260} Z`,'#9E2B25');
  for(let i=0;i<5;i++)g+=rect(x-226+i*6,y-322+i*13,452-i*12,6,i%2?'#F2E6D0':'#1E1B22');
  for(let i=0;i<9;i++)g+=P(`M${x-210+i*47},${y-260} l23,26 l23,-26 Z`,i%2?'#C9A46A':'#9E2B25');
  g+=rect(x-190,y-120,380,120,'#A87650',8)+rect(x-190,y-124,380,12,'#8A5A3C',4);
  // goods by kind
  if(k===0){for(let i=0;i<5;i++)g+=rect(x-170+i*70,y-200,50,76,'#E9F2F7',10,'stroke="#C9D6DF" stroke-width="3"')+rect(x-170+i*70,y-200,50,14,'#9E2B25',6)+P(`M${x-162+i*70},${y-150} l34,0 l-17,-26 Z`,'#fff')}
  if(k===1){for(let i=0;i<4;i++)g+=`<ellipse cx="${x-140+i*92}" cy="${y-150}" rx="40" ry="34" fill="${['#B36A3B','#9C5A30','#C47A45','#8A4E2A'][i]}"/>`+rect(x-158+i*92,y-196,36,14,'#7A4A2A',4)}
  if(k===2){for(let i=0;i<3;i++)g+=P(`M${x-130+i*120},${y-124} C${x-150+i*120},${y-170} ${x-110+i*120},${y-210} ${x-100+i*120},${y-210} L${x-90+i*120},${y-230} L${x-80+i*120},${y-210} C${x-60+i*120},${y-200} ${x-60+i*120},${y-150} ${x-70+i*120},${y-124} Z`,'#C9A46A','stroke="#9C7A45" stroke-width="3"')}
  if(k===3){g+=rect(x-130,y-300,260,180,'#EAF4FA',16,'opacity=".55" stroke="#fff" stroke-width="5"')+crystal(x,y-210,58,t*1.1,1.2,1)}
  return g;
}
function festival(t,pan){
  let g=rect(0,0,1080,1920,'url(#gFest)');
  // distant najdi wall silhouettes
  let far='';for(let i=0;i<8;i++){const x=i*300-((pan*0.3)%300);far+=rect(x,820,260,240,'#C79A6B')+[0,1,2,3,4].map(j=>P(`M${x+j*52},820 l26,-34 l26,34 Z`,'#C79A6B')).join('')}
  g+=G('',far,0.8);
  g+=rect(0,1060,1080,860,'#E8CFA4')+rect(0,1060,1080,10,'#D4B482');
  // lights string & pennants
  let pen='';for(let s=0;s<2;s++){const yb=420+s*140;let d='';for(let x=-100;x<=1180;x+=40){const X=x-((pan*0.8)%320);d+=(d?' L':'M')+f(X)+','+f(yb+Math.sin((X+pan*0.8)/320*Math.PI*2)*-30+30)}
    pen+=S(d,'#6B4430',3);for(let x=-80;x<1180;x+=80){const X=x-((pan*0.8)%80)+(s*40);const Y=yb+Math.sin((X+pan*0.8)/320*Math.PI*2)*-30+30;pen+=P(`M${f(X-18)},${f(Y)} L${f(X+18)},${f(Y)} L${f(X)},${f(Y+42)} Z`,['#9E2B25','#C9A46A','#1A3E62','#F2E6D0'][Math.floor((x+s*40)/80+4)%4])+circ(X,Y-2,6,'#FFE7A8',`opacity="${f(0.6+0.4*Math.sin(t*3+x))}"`)}}
  g+=pen;
  // stalls along world
  let wl='';const stalls=[[300,0],[800,1],[1300,3],[1800,2],[2300,0]];
  stalls.forEach(([sx,k])=>{wl+=stall(sx,1300,k,t)});
  // lanterns
  for(let i=0;i<6;i++){const x=550+i*480;wl+=rect(x-4,1060,8,240,'#6B4430')+rect(x-22,1030,44,50,'#C9A46A',8)+circ(x,1055,16,'#FFE7A8',`opacity="${f(0.7+0.3*Math.sin(t*4+i))}"`)}
  g+=G(`translate(${f(-pan)},0)`,wl);
  // visitors (world)
  let vs='';
  vs+=man({x:1180-(t-34.8)*25,y:1560,s:0.62,ghutra:1,t,expr:'smile',look:[-0.5,0],walk:Math.sin(t*7),L:[-96,-210],R:[96,-210]})+woman(1300-(t-34.8)*25,1560,0.6,t,{walk:Math.sin(t*7)})+child(1240-(t-34.8)*25,1580,0.62,t,{walk:Math.sin(t*7)});
  vs+=child(1250,1480,0.66,t,{point:true,wow:true})+child(1380,1490,0.64,t,{girl:true,wow:true});
  vs+=woman(1950,1580,0.62,t,{wave:t>41})+man({x:2080,y:1580,s:0.64,ghutra:1,bisht:1,t,expr:'smile',look:[-0.6,0],L:[-96,-210],R:[96,-210]});
  vs+=man({x:700,y:1600,s:0.66,ghutra:1,t,expr:'smile',look:[0.4,0],L:[-96,-210],R:[96,-210],hold:{R:'phone'}});
  g+=G(`translate(${f(-pan)},0)`,vs);
  return g;
}
function S4(t){ // 34.8–45.6
  const pan=lerp(0,1350,tw(t,34.8,45.4,E.sine));
  let g=festival(t,pan);
  const wave=(t>36.3&&t<37.6)||(t>41.5&&t<42.8);
  const wv=wave?Math.sin(t*12)*20:0;
  g+=guide({x:540,y:1820,s:0.85,t,expr:'big',look:[Math.sin(t*0.8)*0.8,0],walk:Math.sin(t*7),sway:Math.sin(t*7)*4,
    L:[-96,-210],R:wave?[200+wv,-480]:[96,-210]});
  g+=dust(t,20,33,0,300,1080,1200,'#FFE7A8',3);
  return g+vign();
}
// ---------- resort ----------
function resort(t){
  let g=rect(0,0,1080,1920,'url(#gSkyR)');
  g+=circ(820,360,90,'#FFF4D6','opacity=".9"');
  // building & pergola
  g+=rect(0,620,1080,360,'#EFE4D2')+rect(0,600,1080,30,'#D9C7A8');
  for(let i=0;i<6;i++)g+=P(`M${i*190},600 l30,-36 l30,36 Z`,'#EFE4D2');
  g+=rect(80,700,280,200,'#7A5236',10)+rect(96,716,248,184,'url(#gWarmWin)',6);
  g+=rect(720,700,280,200,'#7A5236',10)+rect(736,716,248,184,'url(#gWarmWin)',6);
  // pergola majlis
  g+=rect(380,760,320,14,'#8A5A3C')+rect(390,774,12,200,'#8A5A3C')+rect(678,774,12,200,'#8A5A3C');for(let i=0;i<8;i++)g+=rect(390+i*40,748,10,26,'#6B4430');
  g+=rect(410,900,260,60,'#F2E6D0',14)+rect(410,870,260,40,'#9E2B25',12)+rect(430,876,60,28,'#C9A46A',8)+rect(590,876,60,28,'#C9A46A',8);
  for(let i=0;i<7;i++){const x=400+i*45;g+=circ(x,740+Math.sin(i)*6,7,'#FFE7A8',`opacity="${f(0.7+0.3*Math.sin(t*4+i))}"`)}
  g+=palm(60,990,1.3,Math.sin(t)*5)+palm(1030,990,1.3,Math.sin(t+1)*5)+palm(250,1000,0.9,Math.sin(t+2)*4);
  // deck
  g+=rect(0,980,1080,940,'#E9DCC6');
  for(let i=0;i<12;i++)g+=rect(0,1000+i*80,1080,2,'#D7C6A8');
  // pool trapezoid
  const pool='M190,1080 L890,1080 L1020,1700 L60,1700 Z';
  g+=P('M170,1066 L910,1066 L1046,1716 L34,1716 Z','#F6EFE3');
  g+=P(pool,'url(#gPool)');
  // caustics
  let cs='';for(let i=0;i<9;i++){const y=1110+i*68;let d='';for(let x=60;x<=1020;x+=40){d+=(d?' L':'M')+x+','+f(y+Math.sin(x*0.02+t*2+i)*8)}cs+=S(d,'#BFF3F7',3,'opacity=".45"')}
  g+=`<clipPath id="poolC"><path d="${pool}"/></clipPath><g clip-path="url(#poolC)">${cs}</g>`;
  g+=P('M190,1080 L890,1080 L880,1100 L200,1100 Z','#2A8E9C','opacity=".5"');
  // seating loungers on deck sides
  g+=rect(40,1760,260,40,'#F2E6D0',16)+rect(780,1760,260,40,'#F2E6D0',16)+rect(80,1800,10,40,'#8A5A3C')+rect(250,1800,10,40,'#8A5A3C')+rect(820,1800,10,40,'#8A5A3C')+rect(990,1800,10,40,'#8A5A3C');
  return g;
}
function S5(t){ // 45.6–53.4
  let g='';
  const m=tw(t,45.6,46.4,E.io);
  if(t<46.9){
    g+=rect(0,0,1080,1920,'url(#gFest)');
    g+=G('',festival(t,1350),0.35);
    const y=lerp(800,1500,tw(t,46.3,46.9,E.in));
    if(m<1) g+=crystal(540,800,lerp(80,40,m),t*2,1,1-m);
    if(m>0) g+=G(tr(540,y,lerp(0.4,1,m)),P('M0,-90 C30,-40 60,-10 60,25 A60,60 0 1,1 -60,25 C-60,-10 -30,-40 0,-90 Z','url(#gDrop)','stroke="#fff" stroke-width="4"')+`<ellipse cx="-20" cy="10" rx="12" ry="22" fill="#fff" opacity=".6"/>`,m);
    if(t>46.6) g+=rect(0,0,1080,1920,'#E8FBFD','',`opacity="${f(tw(t,46.6,46.9))}"`);
    return g+vign();
  }
  g+=resort(t);
  // ripple
  const rp=tw(t,46.9,48.6,E.out);
  for(let i=0;i<3;i++){const q=clamp(rp-i*0.15);if(q>0&&q<1)g+=`<ellipse cx="540" cy="1380" rx="${f(40+q*420)}" ry="${f(14+q*130)}" fill="none" stroke="#fff" stroke-width="${f(6*(1-q))}" opacity="${f(1-q)}"/>`}
  if(t<47.3) g+=rect(0,0,1080,1920,'#E8FBFD','',`opacity="${f(1-tw(t,46.9,47.3))}"`);
  // guide enters
  const wk=tw(t,48.2,49.6,E.io);const gest=tw(t,49.9,50.4,E.io)*(1-tw(t,52.6,53.0));
  g+=guide({x:lerp(1200,820,wk),y:1880,s:0.82,t,expr:t>49.6?'big':'smile',look:[-0.9,-0.2],walk:wk>0&&wk<1?Math.sin(t*8):0,
    L:[lerp(-96,-280,gest),lerp(-210,-380,gest)],R:[96,-210]});
  const z=lerp(1.12,1.0,tw(t,46.9,53.4,E.sine));
  return G(`translate(540,1100) scale(${f(z)}) translate(-540,-1100)`,g)+vign();
}
// ---------- final ----------
function mlogo(x,y,w,op=1){const s=w/400;return `<g transform="translate(${f(x-w/2)},${f(y-197*s/2)}) scale(${f(s)})" opacity="${f(op)}"><path d="${MLOGO_B}" fill="#BAA286" fill-rule="evenodd"/><path d="${MLOGO_N}" fill="#1A3E62" fill-rule="evenodd"/></g>`}
function S6(t){ // 53.4–62
  let g='';
  if(t<55.8){
    g+=desert(t,0.2);
    const up=tw(t,53.4,55.6,E.io);
    g+=`<ellipse cx="540" cy="1150" rx="520" ry="170" fill="#7A4A1E" opacity=".25" filter="url(#blur)"/>`;
    g+=G(`translate(540,${f(lerp(1000,880,up))}) scale(${f(lerp(1.15,0.95,up))}) translate(-540,-1000)`,mapPlate(540,1000,900,450,t,1));
    g+=guide({x:300,y:1840,s:0.9,t,expr:'big',look:[0.8,-0.6],L:[-96,-210],R:[260,-450]});
    g+=dust(t,14,51,0,600,1080,1000);
    if(t>55.3) g+=rect(0,0,1080,1920,'#FFFDF8','',`opacity="${f(tw(t,55.3,55.8))}"`);
    return g+vign();
  }
  g+=rect(0,0,1080,1920,'#FFFDF8')+`<circle cx="540" cy="520" r="700" fill="url(#gGlowM)"/>`;
  // bottom illustrated strip
  let st='';st+=rect(0,1560,1080,360,'#E8D2AA');
  for(let i=0;i<4;i++)st+=rect(i*300-40,1440,240,140,MUDL)+[0,1,2,3].map(j=>P(`M${i*300-40+j*60},1440 l30,-30 l30,30 Z`,MUDL)).join('');
  st+=palm(80,1590,1.0,Math.sin(t)*4)+palm(990,1590,1.0,Math.sin(t+1)*4)+P('M300,1700 L780,1700 L840,1860 L240,1860 Z','url(#gPool)')+rect(0,1560,1080,6,C.gold);
  g+=G('',st,tw(t,55.8,56.6));
  const lp=tw(t,55.8,56.8,E.out);
  g+=mlogo(540,lerp(470,420,lp),lerp(700,800,lp),lp);
  g+=crystal(540,420,lerp(60,0,tw(t,55.8,56.3)),t*3,2,1-tw(t,55.8,56.3));
  const dv=tw(t,56.6,57.2,E.out);g+=rect(540-dv*280,640,dv*560,3,C.gold,2)+circ(540,641,dv*7,C.gold);
  return g;
}
function S6text(t){
  let h='';
  h+=`<div style="position:absolute;left:0;right:0;top:660px;text-align:center;direction:rtl;font-family:${FONT};font-weight:700;font-size:62px;color:#1A3E62;opacity:${f(tw(t,56.4,56.9))}">استراحات المسافر</div>`;
  h+=head('القصب تستحق الزيارة../والمسافر وجهتك للراحة.',t,56.9,0,{y:770,size:50,color:'#9C7A45',weight:600});
  const kl=tw(t,57.6,58.1,E.out);
  h+=`<div style="position:absolute;left:0;right:0;top:960px;text-align:center;direction:rtl;font-family:${FONT};font-weight:600;font-size:42px;color:#1A3E62;opacity:${f(kl)}">للحجز والاستفسار</div>`;
  const phoneP='M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1z';
  const webP='M12 2a10 10 0 100 20 10 10 0 000-20zm0 0c3 3 3 17 0 20m0-20c-3 3-3 17 0 20M2 12h20';
  const kp=tw(t,57.8,58.4,E.back);
  h+=`<div style="position:absolute;left:0;right:0;top:1040px;display:flex;justify-content:center;opacity:${f(clamp(kp))};transform:scale(${f(0.75+0.25*kp)})"><div style="display:flex;align-items:center;gap:26px;background:#1A3E62;color:#fff;border-radius:34px;padding:18px 50px 20px;font-family:Montserrat;font-weight:700;font-size:86px;direction:ltr;box-shadow:0 16px 36px rgba(26,62,98,.3)"><span style="width:90px;height:90px;border-radius:50%;background:#BAA286;display:inline-flex;align-items:center;justify-content:center"><svg width="46" height="46" viewBox="0 0 24 24"><path d="${phoneP}" fill="#fff"/></svg></span>0505470995</div></div>`;
  const kw=tw(t,58.2,58.8,E.out);
  h+=`<div style="position:absolute;left:0;right:0;top:1240px;display:flex;justify-content:center;opacity:${f(kw)};transform:translateY(${f((1-kw)*20)}px)"><div style="display:flex;align-items:center;gap:22px;color:#1A3E62;font-family:Montserrat;font-weight:600;font-size:60px;direction:ltr;border:3px solid #BAA286;border-radius:30px;padding:12px 40px 16px;background:#fff"><span style="width:76px;height:76px;border-radius:50%;background:#BAA286;display:inline-flex;align-items:center;justify-content:center"><svg width="40" height="40" viewBox="0 0 24 24"><path d="${webP}" fill="none" stroke="#fff" stroke-width="2"/></svg></span>www.almosafer-sa.com</div></div>`;
  return h;
}
// ============ MASTER ============
function render(t){
  let art='',html='';
  if(t<11.3) art=S1(t);
  else if(t<20.3) art=S2(t);
  else if(t<34.8) art=S3(t);
  else if(t<45.6) art=S4(t);
  else if(t<53.4) art=S5(t);
  else art=S6(t);
  // S1->S2 dive into map
  if(t>10.8&&t<11.3) art+=rect(0,0,1080,1920,'#FFF6E3','',`opacity="${f(tw(t,10.8,11.3,E.in))}"`);
  if(t>45.3&&t<45.9) art+=rect(0,0,1080,1920,'#FFF6E3','',`opacity="${f(1-Math.abs(t-45.6)/0.3)}"`);
  art+=`<rect width="1080" height="560" fill="url(#gTopM)"/>`;
  // text
  html+=headM('القصب…/حكاية الملح والتراث',t,9.9,11.2,{y:200,size:80});
  html+=headM('أصالة الماضي…/وجمال التراث',t,12.6,20.1,{y:190,size:70});
  html+=headM('الذهب الأبيض',t,24.1,29.0,{y:200,size:96,color:'#FFFFFF'});
  html+=subM('ملح القصب… جزء من هويتها وتراثها',t,30.2,34.4,1550,'#FFFFFF',46).replace('text-shadow:0 3px 16px rgba(60,30,0,.5)','text-shadow:0 2px 12px rgba(255,255,255,.9)');
  html+=headM('الذهب الأبيض',t,29.4,34.4,{y:220,size:80});
  html+=headM('موسم ملح القصب',t,35.0,45.3,{y:180,size:80});
  html+=subM('التراث | الثقافة | التجارب الممتعة',t,38.4,45.3,300,'#FFE9C2',42);
  html+=headM('استراحات المسافر',t,49.7,53.2,{y:190,size:84});
  html+=subM('الراحة… والاستمتاع… وصناعة الذكريات',t,51.0,53.2,310,'#FFFFFF',42);
  html+=headM('القصب حكاية تستحق أن تعيشها',t,53.7,55.5,{y:200,size:62});
  if(t>=55.8) html+=S6text(t);
  return {art,html};
}
