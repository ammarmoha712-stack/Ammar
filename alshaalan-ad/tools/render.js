// node tools/render.js out.mp4  -> renders index.html timeline at 1080x1920/30fps (silent video)
const { chromium } = require('playwright'); const path=require('path'); const {spawn}=require('child_process');
(async()=>{
  const out=process.argv[2]||'video_silent.mp4', FPS=30;
  const b=await chromium.launch(); const pg=await b.newPage({viewport:{width:1080,height:1920}});
  await pg.goto('file://'+path.resolve(__dirname,'../index.html')); await pg.evaluate(()=>window.ready);
  const total=await pg.evaluate(()=>window.TOTAL); const N=Math.round(total*FPS);
  const ff=spawn('ffmpeg',['-y','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','medium','-crf','17','-pix_fmt','yuv420p','-r',String(FPS),out],{stdio:['pipe','ignore','inherit']});
  for(let i=0;i<N;i++){
    await pg.evaluate(t=>render(t),i/FPS);
    const buf=await pg.screenshot({type:'jpeg',quality:95});
    if(!ff.stdin.write(buf)) await new Promise(r=>ff.stdin.once('drain',r));
    if(i%150==0) console.log(`frame ${i}/${N}`);
  }
  ff.stdin.end(); await new Promise(r=>ff.on('close',r)); await b.close();
})();
