const {chromium}=require('playwright');const {spawn}=require('child_process');
(async()=>{const out=process.argv[2];const b=await chromium.launch({args:['--no-proxy-server']});const p=await b.newPage({viewport:{width:1080,height:1920}});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://127.0.0.1:8765/index.html');await p.evaluate(()=>window.ready);
const ff=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-framerate','30','-c:v','mjpeg','-i','-','-c:v','libx264','-preset','slow','-crf','16','-pix_fmt','yuv420p','-tune','film',out],{stdio:['pipe','inherit','inherit']});
const N=48*30;
for(let i=0;i<N;i++){const d=await p.evaluate(t=>{renderFrame(t);return document.getElementById('c').toDataURL('image/jpeg',.96)},i/30);
 const buf=Buffer.from(d.split(',')[1],'base64');if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));if(i%120==0)console.log('frame',i)}
ff.stdin.end();await new Promise(r=>ff.on('close',r));await b.close();console.log('done')})();
