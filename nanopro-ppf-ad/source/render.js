const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
(async () => {
  const [mode, a, b, out] = process.argv.slice(2);
  const br = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const pg = await br.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  pg.on('pageerror', e => console.error('PAGEERR', e.message));
  await pg.goto('file://' + path.resolve('index.html'));
  await pg.waitForFunction(() => window.READY === true, null, { timeout: 30000 });
  if (mode === 'stills') {
    for (const t of a.split(',').map(Number)) { await pg.evaluate(t => render(t), t); await pg.screenshot({ path: `${out || 'stills'}/s_${t.toFixed(2)}.png` }); }
  } else {
    fs.mkdirSync(out, { recursive: true });
    for (let f = +a; f < +b; f++) { await pg.evaluate(t => render(t), f / 30); await pg.screenshot({ path: `${out}/f_${String(f).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 95 }); }
  }
  await br.close();
})();
