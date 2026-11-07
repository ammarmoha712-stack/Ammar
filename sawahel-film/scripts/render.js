const { chromium } = require('playwright');
const { spawn } = require('child_process');
const [,, url, W, H, f0, f1, out] = process.argv;
const FPS = 30, OFF = 0.5;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: +W, height: +H } });
  await p.goto(url); await p.evaluate(() => window.__ready); await p.waitForTimeout(400);
  const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '14', '-pix_fmt', 'yuv420p', '-r', String(FPS), out], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let f = +f0; f < +f1; f++) {
    const t = Math.max(0, f / FPS - OFF);
    await p.evaluate((t) => window.renderAt(t), t);
    const buf = await p.screenshot({ type: 'png' });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await new Promise((r) => ff.on('close', r));
  await b.close();
  console.log('done', out);
})();
