const {chromium}=require('playwright');const path=require('path');
const W=+process.argv[2],N=+process.argv[3],TOTAL=+(process.env.TOTAL||1800),FPS=30;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+path.resolve('build/'+(process.env.PAGE||'index.html')+''));await p.evaluate(()=>window.ready);
for(let f=W;f<TOTAL;f+=N){await p.evaluate(t=>render(t),f/FPS);await p.screenshot({path:`${process.env.OUT||'frames'}/${String(f).padStart(5,'0')}.jpg`,type:'jpeg',quality:94});}
await b.close();})();
