const {chromium}=require('playwright');const {spawn}=require('child_process');const D=__dirname;
const [a,b,out]=[+process.argv[2],+process.argv[3],process.argv[4]];const FPS=30;
(async()=>{const br=await chromium.launch();const p=await br.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:2});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+D+'/ad.html');await p.evaluate(()=>window.ready);
const ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','medium','-crf','15','-pix_fmt','yuv420p','-r',String(FPS),out]);
ff.stderr.on('data',d=>process.stderr.write(d));
for(let f=a;f<b;f++){await p.evaluate(t=>render(t),f/FPS);const buf=await p.screenshot({type:'jpeg',quality:93});
 if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));if(f%60==0)console.log(out,f);}
ff.stdin.end();await new Promise(r=>ff.on('close',r));await br.close();})();
