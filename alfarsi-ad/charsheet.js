const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + path.resolve(__dirname, 'index.html')); await p.evaluate(() => document.fonts.ready);
  await p.evaluate(() => {
    let g = DEFS + `<rect width="1080" height="1920" fill="url(#bgG)"/><rect width="1080" height="1920" fill="url(#grid)"/>`;
    g += `<text x="540" y="95" font-size="50" font-weight="800" fill="#EBD49B" text-anchor="middle" direction="rtl">مرجع الشخصيات — مقفلة التصميم</text>`;
    const views = [['أمامي', 0, false], ['ثلاثة أرباع', .8, false], ['ثلاثة أرباع', -.8, false], ['خلفي', 0, true]];
    [['client', 'العميل', 820], ['lawyer', 'المحامي', 1700]].forEach(([role, name, y]) => {
      g += `<text x="1040" y="${y - 610}" font-size="44" font-weight="700" fill="#F6F0E3" text-anchor="start" direction="rtl">${name}</text>`;
      views.forEach(([lbl, turn, back], i) => {
        const x = 930 - i * 260;
        g += person({ x, y, s: .62, role, turn, back, expr: role === 'lawyer' ? 'smile' : 'neutral',
          itemFront: role === 'lawyer' && !back ? `<g transform="translate(150,-480)">${tablet(0,0,110,150,-6,tabletScreen(110,150,1))}</g>` : '' });
        g += `<text x="${x}" y="${y + 60}" font-size="30" font-weight="600" fill="#C9A45C" text-anchor="middle" direction="rtl">${lbl}</text>`;
      });
    });
    document.getElementById('stage').innerHTML = g;
  });
  await p.screenshot({ path: 'character_reference_sheet.png' }); await b.close();
})();
