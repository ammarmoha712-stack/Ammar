const {chromium}=require('playwright');const path=require('path');
(async()=>{const mode=process.argv[2];const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+path.resolve('ad.html'));await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(1500);
if(mode==='preview'){const ts=process.argv.slice(3).map(Number);for(const t of ts){await p.evaluate(t=>render(t),t);await p.screenshot({path:`prev_${t}.jpg`,type:'jpeg',quality:70});}}
else{const fps=30,T=+process.argv[3];require('fs').mkdirSync('frames',{recursive:true});
 for(let f=0;f<Math.round(T*fps);f++){await p.evaluate(t=>render(t),f/fps);await p.screenshot({path:`frames/f${String(f).padStart(5,'0')}.jpg`,type:'jpeg',quality:92});if(f%150==0)console.log(f);}}
await b.close()})();
