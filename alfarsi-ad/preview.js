const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const times = process.argv.slice(3).map(Number); const out = process.argv[2];
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('file://' + path.resolve('index.html')); await p.evaluate(() => document.fonts.ready);
  for (const t of times) { await p.evaluate(t => render(t), t); await p.screenshot({ path: `${out}/f_${t.toFixed(2)}.png` }); }
  if (errs.length) console.log('ERR', errs.slice(0, 5)); await b.close();
})();
