const { chromium } = require('playwright');
const [,, url, out, ...times] = process.argv;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: +(process.env.VW||1920), height: +(process.env.VH||1080) } });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto(url); await p.evaluate(() => window.__ready);
  await p.waitForTimeout(300);
  for (const t of times) { await p.evaluate(t => window.renderAt(+t), t); await p.screenshot({ path: `${out}/t${String(t).padStart(5,'0')}.png` }); }
  console.log(errs.length ? 'ERRORS:\n' + errs.join('\n') : 'no errors');
  await b.close();
})();
