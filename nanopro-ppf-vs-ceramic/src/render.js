// Usage: node render.js preview t1 t2 ...   -> PNG stills in OUT dir
//        node render.js video out.mp4       -> silent 30fps H.264 video
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs'), { spawn } = require('child_process');
const AUDIO_LEN = 36.6, VIDEO_LEN = 35.0, FPS = 30, K = AUDIO_LEN / VIDEO_LEN;
(async () => {
  const [mode, ...args] = process.argv.slice(2);
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('console', m => console.log('page:', m.text())); page.on('pageerror', e => console.log('ERR', e.message));
  await page.goto('file://' + path.resolve(__dirname, 'ad.html'));
  await page.evaluate(() => window.ready);
  const grab = async a => Buffer.from(await page.evaluate(a => { renderFrame(a); return document.getElementById('c').toDataURL('image/jpeg', .94).split(',')[1]; }, a), 'base64');
  if (mode === 'preview') {
    const out = process.env.OUT; fs.mkdirSync(out, { recursive: true });
    for (const a of args) fs.writeFileSync(path.join(out, `a${a}.jpg`), await grab(+a));
  } else {
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-r', String(FPS), args[0]], { stdio: ['pipe', 'inherit', 'inherit'] });
    const N = Math.round(VIDEO_LEN * FPS);
    for (let i = 0; i < N; i++) {
      const buf = await grab((i / FPS) * K);
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (i % 150 === 0) console.log('frame', i, '/', N);
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
  }
  await browser.close();
})();
