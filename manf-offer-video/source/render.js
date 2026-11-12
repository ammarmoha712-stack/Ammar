const {chromium}=require('playwright');const {spawn}=require('child_process');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('http://localhost:8765/index.html');await p.evaluate(()=>document.fonts.ready);
const ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate','30','-c:v','mjpeg','-i','-','-c:v','libx264','-preset','slow','-crf','16','-pix_fmt','yuv420p','build/video_noaudio.mp4'],{stdio:['pipe','inherit','inherit']});
const N=900;const t0=Date.now();
for(let f=0;f<N;f++){await p.evaluate(t=>render(t),f/30);const buf=await p.screenshot({type:'jpeg',quality:95});
 if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));
 if(f%150==0)console.log(f,((Date.now()-t0)/1000).toFixed(0)+'s');}
ff.stdin.end();await new Promise(r=>ff.on('close',r));await b.close();console.log('done');})();
