const {chromium}=require('playwright');
const FPS=30,DUR=56,N=FPS*DUR,W=4,dir=process.argv[2],out=process.argv[3];
(async()=>{
 const b=await chromium.launch({args:['--allow-file-access-from-files']});
 await Promise.all([...Array(W).keys()].map(async w=>{
  const p=await b.newPage({viewport:{width:1920,height:1080}});
  await p.goto('file://'+dir+'/index.html');await p.evaluate(()=>window.ready);
  for(let i=w;i<N;i+=W){await p.evaluate(t=>renderFrame(t),i/FPS);
    await p.screenshot({path:`${out}/f${String(i).padStart(5,'0')}.jpg`,type:'jpeg',quality:93});}
 }));
 await b.close();console.log('done');
})();
