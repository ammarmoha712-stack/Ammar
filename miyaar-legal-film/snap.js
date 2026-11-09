// Usage: node snap.js outdir t1 t2 ...  -> renders preview stills
const {chromium}=require('playwright');const path=require('path');
(async()=>{const [out,...ts]=process.argv.slice(2);const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+path.resolve(__dirname,'film.html'));await p.evaluate(()=>window.ready);
for(const t of ts){await p.evaluate(t=>render(+t),t);await p.screenshot({path:`${out}/t${t}.png`});}
await b.close();})();
