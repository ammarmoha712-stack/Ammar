// usage: node snap.js outdir t1 t2 ...
const {chromium}=require('playwright');const http=require('http');const fs=require('fs');const path=require('path');
const root=__dirname;const types={'.html':'text/html','.js':'text/javascript','.woff2':'font/woff2','.webp':'image/webp'};
const srv=http.createServer((q,r)=>{const f=path.join(root,decodeURIComponent(q.url.split('?')[0]));fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'Content-Type':types[path.extname(f)]||'application/octet-stream'});r.end(d);});});
srv.listen(0,async()=>{const port=srv.address().port;const [out,...ts]=process.argv.slice(2);fs.mkdirSync(out,{recursive:true});
const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});const p=await b.newPage({viewport:{width:1080,height:1920}});
p.on('console',m=>console.log('console:',m.text()));p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto(`http://localhost:${port}/index.html`);await p.waitForFunction('window.READY',null,{timeout:60000});
for(const t of ts){const s=Date.now();await p.evaluate(t=>renderAt(t),parseFloat(t));await p.screenshot({path:`${out}/t${t}.jpg`,type:'jpeg',quality:80});console.log(t,Date.now()-s,'ms');}
await b.close();srv.close();});
