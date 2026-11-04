const {chromium}=require('playwright');
const [,,html,out,w,n,fps,total]=process.argv;
(async()=>{
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
 p.on('pageerror',e=>console.log('ERR',e.message));
 await p.goto('file://'+html);await p.evaluate(()=>window.ready);
 for(let f=+w;f<+total;f+=+n){
   await p.evaluate(t=>render(t),f/(+fps));
   await p.screenshot({path:`${out}/${String(f).padStart(5,'0')}.jpg`,type:'jpeg',quality:93});
 }
 await b.close();
})();
