// 카드 HTML → PNG. 실행: node marketing/design/render.js
const { chromium } = require('playwright');
const path = require('path');
const out = path.resolve(__dirname, '../publish/media');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.resolve(__dirname, 'cards.html'));
  await page.evaluate(() => document.fonts.ready);
  for (let i = 1; i <= 8; i++) {
    await page.locator('#c' + i).screenshot({ path: `${out}/carousel_intro_0${i}.png` });
  }
  await page.goto('file://' + path.resolve(__dirname, 'highlights.html'));
  await page.evaluate(() => document.fonts.ready);
  const names = ['test', 'review', 'course', 'partners', 'ceo'];
  for (let i = 1; i <= 5; i++) {
    await page.locator('#h' + i).screenshot({ path: `${out}/highlight_${names[i-1]}.png` });
  }
  await browser.close();
  console.log('rendered to', out);
})();
