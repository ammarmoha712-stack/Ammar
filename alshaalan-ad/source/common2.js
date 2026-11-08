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
<filter id="sil" x="-30%" y="-20%" width="160%" height="140%"><feMorphology in="SourceAlpha" operator="dilate" radius="6" result="d"/><feFlood flood-color="#F0D493"/><feComposite in2="d" operator="in" result="rim"/><feGaussianBlur in="rim" stdDeviation="5" result="rimb"/><feFlood flood-color="#1C3350"/><feComposite in2="SourceAlpha" operator="in" result="body"/><feMerge><feMergeNode in="rimb"/><feMergeNode in="body"/></feMerge></filter>
</defs>`);
const LW=1405,LH=385;
function cam(g,cx,cy,s,dx=0,dy=0){g.setAttribute('transform',`translate(${(cx+dx).toFixed(2)},${(cy+dy).toFixed(2)}) scale(${s.toFixed(4)}) translate(${-cx},${-cy})`);}
function blinkV(t,seed){const per=3.1+seed*0.7;const x=((t+seed*1.3)%per);return x<0.16?Math.sin(x/0.16*Math.PI):0;}
function vis(g,t,a,b,fi=0.3,fo=0.3){const o=Math.min(P(t,a,a+fi),1-P(t,b-fo,b));op(g,(fi===0&&t>=a?1:1)*o);return o>0.002;}
// ---------------- TEXT SYSTEM ----------------
const texts=[];
function T(str,o){const d=document.createElement('div');d.className='t '+(o.font||'alex')+' '+(o.cls||'');d.style.top=o.y+'px';d.style.fontSize=o.size+'px';d.style.fontWeight=o.w||800;
 const words=o.raw?[str]:str.split(' ');d.innerHTML=(o.wrap?o.wrap[0]:'')+words.map(w=>w[0]==='*'?`<span class="w gold">${w.slice(1)}</span>`:`<span class="w ${o.color||'navy'}">${w}</span>`).join(' ')+(o.wrap?o.wrap[1]:'');
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

