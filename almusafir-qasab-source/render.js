const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path'),{spawn}=require('child_process');
const ROOT=path.join(__dirname,process.env.ROOTD||'ad');const mime={'.html':'text/html','.png':'image/png','.woff2':'font/woff2'};
const srv=http.createServer((q,r)=>{const f=path.join(ROOT,decodeURIComponent(q.url.split('?')[0])==='/'?'index.html':decodeURIComponent(q.url.split('?')[0]));fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();return}r.writeHead(200,{'Content-Type':mime[path.extname(f)]||'application/octet-stream'});r.end(d)})});
(async()=>{await new Promise(r=>srv.listen(0,r));const port=srv.address().port;
 const mode=process.argv[2];const b=await chromium.launch();
 async function page(){const p=await b.newPage({viewport:{width:1080,height:1920}});p.on('console',m=>console.log('PAGE',m.text()));p.on('pageerror',e=>console.log('ERR',e.message));await p.goto(`http://localhost:${port}/`);await p.waitForFunction('window.READY===true',null,{timeout:60000});return p;}
 if(mode==='stills'){const p=await page();const ts=process.argv[3].split(',').map(Number);
   for(const t of ts){const d=await p.evaluate(t=>{render(t);return document.getElementById('c').toDataURL('image/jpeg',.85)},t);fs.writeFileSync(path.join(__dirname,process.env.SD||'stills',`s_${t.toFixed(2)}.jpg`),Buffer.from(d.split(',')[1],'base64'));}
 } else { // video: workers
   const FPS=30,DUR=parseFloat(process.argv[3]),N=Math.round(DUR*FPS),Wn=4;const per=Math.ceil(N/Wn);
   await Promise.all([...Array(Wn)].map(async(_,w)=>{const p=await page();const s=w*per,e=Math.min(N,s+per);
     const ff=spawn('ffmpeg',['-y','-v','error','-f','image2pipe','-framerate','30','-c:v','png','-i','-','-c:v','libx264','-preset','medium','-crf','15','-pix_fmt','yuv420p','-r','30',path.join(__dirname,(process.env.PFX||'')+`seg${w}.mp4`)],{stdio:['pipe','inherit','inherit']});
     for(let i=s;i<e;i++){const d=await p.evaluate(t=>{render(t);return document.getElementById('c').toDataURL('image/png')},i/FPS);
       if(!ff.stdin.write(Buffer.from(d.split(',')[1],'base64')))await new Promise(r=>ff.stdin.once('drain',r));if(i%60==0)console.log('w',w,i);}
     ff.stdin.end();await new Promise(r=>ff.on('close',r));}));
 }
 await b.close();srv.close();})();
