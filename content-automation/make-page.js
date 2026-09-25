// 사용법: node content-automation/make-page.js <data.json> <출력폴더>
// render.js 로 만든 PNG 가 있는 출력폴더에 page.html 을 만든다. 이 파일을 Artifact 로 발행한다.
const fs = require('fs'), path = require('path');
const [dataFile, outDir] = process.argv.slice(2);
const D = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const P = D.post;
const block = (label, text) => `<div class="copy"><span class="lab">${esc(label)}</span><button type="button" class="cbtn">복사</button><pre>${esc(text)}</pre></div>`;
const imgs = Array.from({ length: 8 }, (_, i) => `pbs_${D.no}_${String(i + 1).padStart(2, '0')}.png`);
const html = `<title>컬러강점 처방전 #${esc(D.no)}</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap">
<style>
:root{--paper:#fff;--wash:#FBF5F8;--ink:#231A21;--muted:#6E5F69;--line:#EADDE4;--pink:#C8006E}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){color-scheme:dark;--paper:#17111A;--wash:#211823;--ink:#F3EAF0;--muted:#B7A6B1;--line:#3A2C37;--pink:#FF5CB0}}
:root[data-theme="dark"]{color-scheme:dark;--paper:#17111A;--wash:#211823;--ink:#F3EAF0;--muted:#B7A6B1;--line:#3A2C37;--pink:#FF5CB0}
*{box-sizing:border-box}
body{background:var(--paper);color:var(--ink);font:15px/1.7 "Noto Sans KR",system-ui,sans-serif;word-break:keep-all;padding-inline:16px;padding-block:24px 56px}
.wrap{max-width:720px;margin:0 auto;display:flex;flex-direction:column;gap:28px}
h1{font-size:26px;margin:0;text-wrap:balance}h2{font-size:18px;margin:0}
.eyebrow{font-size:12px;font-weight:700;letter-spacing:.1em;color:var(--pink)}
.muted{color:var(--muted)}
.steps{margin:0;padding-left:20px}
.imgs{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
.imgs figure{margin:0}.imgs img{width:100%;border:1px solid var(--line);border-radius:6px;display:block}
.imgs figcaption{font-size:12px;color:var(--muted);text-align:center}
.copy{position:relative;background:var(--wash);border:1px solid var(--line);border-radius:10px;padding:12px 14px}
.copy pre{margin:6px 0 0;white-space:pre-wrap;font:inherit}
.lab{font-size:12px;font-weight:700;color:var(--muted)}
.cbtn{position:absolute;top:8px;right:8px;font:600 12px inherit;color:var(--pink);background:var(--paper);border:1px solid var(--pink);border-radius:6px;padding:3px 10px;cursor:pointer}
.check{border-left:3px solid var(--pink);padding-left:12px}
section{display:flex;flex-direction:column;gap:12px}
</style>
<div class="wrap">
<header><span class="eyebrow">PBS 컬러강점 처방전 #${esc(D.no)} · ${esc(D.date || '')}</span><h1>${esc(D.topic)}</h1>
<p class="muted">${esc(P.why || '')}</p></header>
<section><h2>올리기 전 확인</h2><div class="check"><ul class="steps">${(P.check || []).map(c => `<li>${esc(c)}</li>`).join('')}</ul></div></section>
<section><h2>캐러셀 8장</h2><p class="muted">이미지를 길게 눌러 저장한 뒤 1번부터 순서대로 올리세요.</p>
<div class="imgs">${imgs.map((f, i) => `<figure><img src="${f}" alt="${i + 1}번 장"><figcaption>${i + 1}</figcaption></figure>`).join('')}</div></section>
<section><h2>캡션</h2>${block('게시물 캡션', P.caption)}${block('첫 댓글 (올리자마자)', P.first_comment)}</section>
<section><h2>스토리 3장</h2>${P.stories.map((s, i) => block(`스토리 ${i + 1}`, s)).join('')}</section>
<section><h2>릴스 대본 (선택)</h2>${block('첫 1초 훅', P.reel.hook)}${block('대본', P.reel.script)}</section>
<section><h2>오늘 찾은 트렌드</h2>${block('리서치 메모', P.research)}</section>
</div>
<script>
document.querySelectorAll('.cbtn').forEach(b=>b.addEventListener('click',()=>{const t=b.parentElement.querySelector('pre');
const ok=()=>{b.textContent='복사됨';setTimeout(()=>b.textContent='복사',1500)};
const fb=()=>{const r=document.createRange();r.selectNodeContents(t);const s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent='선택됨'};
try{navigator.clipboard.writeText(t.textContent).then(ok,fb)}catch(e){fb()}}));
</script>`;
fs.writeFileSync(path.join(outDir, 'page.html'), html);
console.log('OK page.html →', path.join(outDir, 'page.html'), '| files:', imgs.join(', '));
