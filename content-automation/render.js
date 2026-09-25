// 사용법: node content-automation/render.js <data.json> <출력폴더>
// data.json 을 템플릿에 채워 1080x1350 PNG 8장과 미리보기 contact.png 를 만든다.
// 글자가 칸을 넘치면 WARN 을 출력한다. WARN 이 있으면 문구를 줄이고 다시 실행할 것.
const path = require('path'), fs = require('fs');
const pwPath = (() => { try { return require.resolve('playwright'); } catch { return require('child_process').execSync('npm root -g').toString().trim() + '/playwright'; } })();
const { chromium } = require(pwPath);
(async () => {
  const [dataFile, outDir] = process.argv.slice(2);
  if (!dataFile || !outDir) { console.error('usage: node render.js <data.json> <outDir>'); process.exit(2); }
  const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  fs.mkdirSync(outDir, { recursive: true });
  const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;
  const browser = await chromium.launch({ ...(proxy ? { proxy: { server: proxy } } : {}), args: ['--ignore-certificate-errors'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
  await page.goto('file://' + path.resolve(__dirname, 'template/slides.html'), { waitUntil: 'networkidle' });
  await page.evaluate(d => build(d), data);
  await page.evaluate(() => document.fonts.ready);
  const fonts = await page.evaluate(() => [...document.fonts].filter(f => f.status === 'loaded').length);
  if (fonts === 0) console.log('WARN 웹폰트가 로드되지 않았다. 네트워크를 확인할 것.');
  const warns = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('.slide').forEach(s => {
      const r = s.getBoundingClientRect(), limit = r.bottom - 110;
      s.querySelectorAll('h1,h2,p,.list,.grid,.fix,.box,.tags').forEach(el => {
        const b = el.getBoundingClientRect();
        if (b.bottom > limit + 1) out.push(`${s.id}: <${el.className || el.tagName}> 가 하단 여백을 침범 (${Math.round(b.bottom - limit)}px)`);
        if (el.scrollWidth > el.clientWidth + 1) out.push(`${s.id}: <${el.className || el.tagName}> 가로 넘침`);
      });
      s.querySelectorAll('.cell .a').forEach(el => { if (el.offsetHeight > 70) out.push(`${s.id}: 한 장 정리 화살표 문구가 두 줄로 넘어감 ("${el.textContent}") → 7자 이내로 줄일 것`); });
      s.querySelectorAll('.tags').forEach(el => { if (el.offsetHeight > 90) out.push(`${s.id}: 태그가 두 줄로 넘어감 → 개수나 글자 수를 줄일 것`); });
      s.querySelectorAll('.row .tx').forEach(el => { if (el.offsetHeight > 70) out.push(`${s.id}: 표지 항목이 두 줄로 넘어감 ("${el.textContent}") → 17자 이내로 줄일 것`); });
      for (let i = 0; i < s.children.length; i++) for (let j = i + 1; j < s.children.length; j++) {
        const a = s.children[i], c = s.children[j];
        if (a.classList.contains('top') || a.classList.contains('foot') || c.classList.contains('foot')) continue;
        const A = a.getBoundingClientRect(), C = c.getBoundingClientRect();
        if (A.bottom > C.top + 1 && A.top < C.bottom && A.right > C.left && A.left < C.right) out.push(`${s.id}: 요소 겹침 ${a.className || a.tagName} / ${c.className || c.tagName}`);
      }
    });
    return out;
  });
  const files = [];
  for (let i = 1; i <= 8; i++) {
    const f = path.join(outDir, `pbs_${data.no}_${String(i).padStart(2, '0')}.png`);
    await page.locator('#s' + i).screenshot({ path: f }); files.push(f);
  }
  const sheet = await browser.newPage({ viewport: { width: 2210, height: 1380 } });
  await sheet.setContent(`<body style="margin:0;background:#777;display:grid;grid-template-columns:repeat(4,540px);gap:10px;padding:10px">${files.map(f => `<img src="data:image/png;base64,${fs.readFileSync(f).toString('base64')}" style="width:540px">`).join('')}</body>`);
  await sheet.screenshot({ path: path.join(outDir, 'contact.png'), fullPage: true });
  await browser.close();
  warns.forEach(w => console.log('WARN ' + w));
  console.log(`OK ${files.length} slides → ${outDir} (fonts ${fonts}, warnings ${warns.length})`);
})();
