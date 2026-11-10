// Renders film.html frame-by-frame: node render.js <framesDir> [fps] [duration] [workers]
const {chromium}=require('playwright');const path=require('path');const fs=require('fs');
const [out,fps=30,dur=44,W=4]=process.argv.slice(2);const N=Math.round(fps*dur);fs.mkdirSync(out,{recursive:true});
(async()=>{const b=await chromium.launch();
await Promise.all([...Array(+W).keys()].map(async w=>{
 const p=await b.newPage({viewport:{width:1080,height:1920}});
 await p.goto('file://'+path.resolve(__dirname,'film.html'));await p.evaluate(()=>window.ready);
 for(let i=w;i<N;i+=+W){await p.evaluate(t=>render(t),i/fps);
  await p.screenshot({path:`${out}/f${String(i).padStart(5,'0')}.jpg`,type:'jpeg',quality:95});}
}));await b.close();console.log('frames',N);})();
