// node tools/preview.js out_dir t1 t2 ...  -> PNG stills at given seconds
const { chromium } = require('playwright'); const path=require('path');
(async()=>{
  const [out,...ts]=process.argv.slice(2);
  const b=await chromium.launch(); const pg=await b.newPage({viewport:{width:1080,height:1920}});
  await pg.goto('file://'+path.resolve(__dirname,'../index.html')); await pg.evaluate(()=>window.ready);
  for(const t of ts){ await pg.evaluate(t=>render(t),parseFloat(t)); await pg.screenshot({path:`${out}/f_${t}.png`}); }
  await b.close();
})();
