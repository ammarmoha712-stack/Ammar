// node render.js outdir startFrame endFrame
const {chromium}=require('playwright');const http=require('http');const fs=require('fs');const path=require('path');
const root=__dirname;const types={'.html':'text/html','.js':'text/javascript','.woff2':'font/woff2','.webp':'image/webp'};
const srv=http.createServer((q,r)=>{const f=path.join(root,decodeURIComponent(q.url.split('?')[0]));fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'Content-Type':types[path.extname(f)]||'application/octet-stream'});r.end(d);});});
srv.listen(0,async()=>{const port=srv.address().port;const [out,a,b]=process.argv.slice(2);fs.mkdirSync(out,{recursive:true});
const br=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});const p=await br.newPage({viewport:{width:1080,height:1920}});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto(`http://localhost:${port}/index.html`);await p.waitForFunction('window.READY',null,{timeout:60000});
for(let f=+a;f<+b;f++){const fn=`${out}/f${String(f).padStart(5,'0')}.jpg`;if(fs.existsSync(fn))continue;await p.evaluate(t=>renderAt(t),f/30);await p.screenshot({path:fn,type:'jpeg',quality:95});if(f%50==0)console.log(f);}
await br.close();srv.close();});
