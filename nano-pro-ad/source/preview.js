const {chromium}=require('playwright');const D=__dirname;
(async()=>{const times=process.argv.slice(2).map(Number);
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
p.on('console',m=>console.log('LOG',m.text()));p.on('pageerror',e=>console.log('ERR',e.message));
await p.addInitScript(()=>{window.SCALE=1});
await p.goto('file://'+D+'/ad.html');await p.evaluate(()=>window.ready);
for(const t of times){const s=Date.now();await p.evaluate(t=>render(t),t);await p.screenshot({path:`${D}/prev/f_${t.toFixed(2)}.jpg`,type:'jpeg',quality:80});console.log(t,Date.now()-s,'ms');}
await b.close();})();
