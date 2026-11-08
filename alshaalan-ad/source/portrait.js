const PH=1240, PTOP=340;
function camP(t){
  if(t<7) return {s:1.148,cx:840,cy:540};
  if(t<14.8){const a=tw(t,7.4,8.0),b=tw(t,10.0,10.6);return {s:1.148,cx:lerp(lerp(520,1350,a),520,b),cy:540};}
  if(t<17.2) return {s:0.8,cx:960,cy:540,full:1};
  if(t<19.6) return {s:1.148,cx:lerp(620,960,tw(t,17.4,18.9)),cy:540};
  if(t<25.4) return {s:1.148,cx:945,cy:540};
  if(t<36.4) return {s:1.148,cx:560,cy:540};
  if(t<38.7) return {s:1.148,cx:960,cy:540};
  if(t<43.2) return {s:1.148,cx:1030,cy:540};
  return {s:1.148,cx:960,cy:540};
}
const BAND=[[0.3,6.75,'تبحث عن عقار مناسب في جنوب الرياض؟'],[7.5,13.2,'الاختيار الصحيح يحتاج إلى خبرة ومعرفة بالسوق'],
 [17.5,19.5,'خبرة تتجاوز 40 عاماً',1],[21.0,23.0,'خبرة نضعها بين يديك'],[23.1,25.2,'لنساعدك على اتخاذ القرار المناسب'],
 [25.5,27.5,'بيع وشراء العقارات',0,'01'],[27.7,29.5,'التأجير',0,'02'],[29.7,31.5,'التسويق العقاري',0,'03'],[31.7,33.7,'الاستشارات العقارية',0,'04'],[33.9,36.3,'نخدمكم في جنوب الرياض',0,'05'],
 [36.6,38.4,'العقار ليس مجرد مكان… بل قرار مهم'],[38.9,40.4,'يحتاج إلى من يشاركك الخبرة ويمنحك الثقة'],
 [40.5,43.1,'اختيارك الصحيح يبدأ من الخبرة',1],[43.5,45.7,'أكثر من 40 عاماً من الخبرة',1]];
function bandHTML(t){
  let h='';
  BAND.forEach(([a,b,tx,gold,num])=>{if(t<a-0.1||t>b+0.1)return;
    const k=tw(t,a,a+0.4,E.out)*(1-tw(t,b-0.3,b,E.in));
    h+=`<div style="position:absolute;left:60px;right:60px;top:0;bottom:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;direction:rtl;font-family:Tajawal;font-weight:800;opacity:${f(Math.min(1,k*1.5))}">`
     +(num?`<div style="font-family:Montserrat;font-weight:600;font-size:44px;color:${C.gold};letter-spacing:4px;margin-bottom:6px">${num}</div>`:'')
     +`<div style="font-size:${gold?66:58}px;line-height:1.35;color:${gold?C.goldL:'#fff'}">${words(tx,t,a+0.05,b,{size:58})}</div></div>`;});
  if(t>30.3&&t<36.2){const k=tw(t,30.3,30.8)*(1-tw(t,35.9,36.2));
    h+=`<div style="position:absolute;left:0;right:0;bottom:34px;text-align:center;direction:rtl;font-family:Tajawal;font-weight:700;font-size:32px;color:${C.goldL};opacity:${f(k)}">خدمات عقارية متكاملة… بخبرة راسخة</div>`;}
  return h;
}
function endPortrait(t){
  const lt=t-45.8;
  let g=rect(0,0,1080,1920,'#fff')+`<circle cx="540" cy="520" r="760" fill="url(#gGlow)" opacity=".8"/>`;
  g+=G('translate(-420,870) scale(1)',skyline('#F1EBE0',1,51,1000,170)+skyline('#E9E0D0',1,53,1000,90));
  g+=rect(0,1890,1080,30,C.navy)+rect(0,1880,1080,10,C.gold);
  const W=920,H=W*365/1384,sc=lerp(1.25,1,tw(lt,0,1.0,E.out));
  g+=G(`translate(540,${f(lerp(760,400,tw(lt,0.9,1.8,E.io)))}) scale(${f(sc)}) translate(${f(-W/2)},${f(-H/2)})`,`<use href="#LOGO" transform="scale(${f(W/1384)})"/>`,clamp(lt*3));
  const ln=tw(lt,1.6,2.4,E.out);g+=rect(540-ln*340,575,ln*680,4,C.gold,2)+circ(540,577,ln*9,C.gold);
  let h='';
  ['خبرة تتجاوز 40 عاماً','خدمات عقارية متكاملة','نخدمكم في جنوب الرياض'].forEach((c,i)=>{const k=tw(t,47.6+i*0.35,48.1+i*0.35,E.out);
    h+=`<div style="position:absolute;left:0;right:0;top:${630+i*100}px;display:flex;justify-content:center;opacity:${f(k)};transform:translateY(${f((1-k)*30)}px)"><div style="background:${i===1?C.navy:'#fff'};color:${i===1?'#fff':C.navy};border:3px solid ${C.navy};border-radius:50px;padding:8px 40px 14px;font-family:Tajawal;font-size:42px;font-weight:800;direction:rtl">${c}</div></div>`});
  const kl=tw(t,49.6,50.2,E.out);
  h+=`<div style="position:absolute;left:0;right:0;top:965px;text-align:center;font-family:Tajawal;font-weight:700;font-size:38px;color:${C.navy};opacity:${f(kl)};direction:rtl">للتواصل والاستفسار</div>`;
  const phoneI=`<svg width="32" height="32" viewBox="0 0 24 24"><path fill="#fff" d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.570a1 1 0 01-.25 1z"/></svg>`;
  const webI=`<svg width="34" height="34" viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-width="2" d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 0c3 3 3 17 0 20m0-20c-3 3-3 17 0 20M2 12h20"/></svg>`;
  [['0599818181',phoneI],['0535422918',phoneI],['www.alshalaan.sa',webI]].forEach(([n,ic],i)=>{const k=tw(t,50.0+i*0.3,50.6+i*0.3,E.back);
    h+=`<div style="position:absolute;left:0;right:0;top:${1040+i*125}px;display:flex;justify-content:center;opacity:${f(clamp(k))};transform:scale(${f(0.7+0.3*k)})"><div style="display:flex;align-items:center;gap:20px;background:${C.navy};color:#fff;border-radius:24px;padding:16px 40px;font-family:Montserrat;font-weight:600;font-size:54px;direction:ltr;box-shadow:0 10px 24px rgba(27,45,75,.25)"><span style="width:60px;height:60px;border-radius:50%;background:${C.gold};display:inline-flex;align-items:center;justify-content:center">${ic}</span>${n}</div></div>`});
  h+=`<div style="position:absolute;left:70px;right:70px;top:1430px;text-align:center;direction:rtl;font-family:Tajawal;font-weight:800;font-size:54px;line-height:1.45;color:${C.goldD}">${words('الشعلان العقارية… خبرة تثق بها، واختيار تبدأ به مستقبلك.',t,52.7,0,{size:54,stag:0.06})}</div>`;
  return {g,h};
}
const vp=document.getElementById('vp'),stage=document.getElementById('stage'),art=document.getElementById('art'),
  band=document.getElementById('bandIn'),bandBox=document.getElementById('band'),top_=document.getElementById('top'),endA=document.getElementById('endA'),endH=document.getElementById('endH');
window.renderFrame=(t)=>{
  if(t>=45.8){const e=endPortrait(t);endA.innerHTML=e.g;endH.innerHTML=e.h;endA.style.display=endH.style.display='block';
    art.innerHTML='';band.innerHTML='';
    const fl=1-tw(t,45.8,46.2);endH.insertAdjacentHTML('beforeend',fl>0?`<div style="position:absolute;inset:0;background:#fff;opacity:${f(fl)}"></div>`:'');return;}
  endA.style.display=endH.style.display='none';
  const c=camP(t), r=render(t);
  art.innerHTML=r.art;
  const top=c.full?0:PTOP, H=c.full?1920:PH;
  vp.style.top=top+'px';vp.style.height=H+'px';vp.style.background=c.full?'#fff':'transparent';
  stage.style.transform=`translate(${f(540-c.s*c.cx)}px,${f(H/2-c.s*c.cy)}px) scale(${c.s})`;
  top_.style.display=bandBox.style.display=c.full?'none':'block';
  band.innerHTML=bandHTML(t);
};
window.ready=(async()=>{
  await Promise.all(['400','500','700','800'].map(w=>document.fonts.load(`${w} 40px Tajawal`,'عربي')));
  await document.fonts.load('600 40px Montserrat','0599');
  await Promise.all(['logo.png','icon.png'].map(s=>new Promise(r=>{const i=new Image();i.onload=r;i.onerror=r;i.src=s})));
  renderFrame(0);return true;})();
