// Usage: node render.js <outDir> <fps> <duration> <workers> [onlyTimes comma list]
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..');
const [outDir, fps = 30, dur = 60, workers = 4, only] = process.argv.slice(2);
const types = { '.html': 'text/html', '.png': 'image/png', '.js': 'text/javascript' };
const srv = http.createServer((q, r) => { const f = path.join(root, decodeURIComponent(q.url.split('?')[0]));
  fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' }); r.end(d); }); });
(async () => {
  await new Promise(r => srv.listen(8765, r));
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const times = only ? only.split(',').map(Number) : [...Array(Math.round(dur * fps)).keys()].map(i => i / fps);
  const jobs = times.map((t, i) => ({ t, name: only ? `t_${t.toFixed(2)}.png` : `f_${String(i).padStart(5, '0')}.jpg` }));
  let next = 0, done = 0; const t0 = Date.now();
  await Promise.all([...Array(Number(workers))].map(async () => {
    const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
    await page.goto('http://localhost:8765/src/luggage.html'); await page.evaluate(() => window.ready);
    while (next < jobs.length) { const j = jobs[next++];
      await page.evaluate(t => window.render(t), j.t);
      await page.screenshot({ path: path.join(outDir, j.name), type: j.name.endsWith('.png') ? 'png' : 'jpeg', ...(j.name.endsWith('.jpg') ? { quality: 94 } : {}) });
      if (++done % 150 === 0) console.log(`${done}/${jobs.length} ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    }
  }));
  await browser.close(); srv.close();
})();
