// 쪽마다 아래 여백(mm) 재기. 음수 = 넘침, 25 이상 = 빈 공간 큼. usage: node gaps.mjs book.html
// 쪽은 section.pg, 꼬리말은 footer 또는 .ft 로 찾는다.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:560,height:800}});
await p.goto('file://'+process.argv[2]);await p.waitForTimeout(1500);
const r=await p.evaluate(()=>[...document.querySelectorAll('section.pg')].map((s,i)=>{
  const ft=s.querySelector('footer,.ft');const lim=ft?ft.getBoundingClientRect().top:s.getBoundingClientRect().bottom;
  let m=0;for(const el of s.querySelectorAll('*')){if(ft&&(el===ft||ft.contains(el)))continue;const st=getComputedStyle(el);if(st.position==='absolute'||st.position==='fixed')continue;m=Math.max(m,el.getBoundingClientRect().bottom);}
  const g=(lim-m)/3.7795;return `${i+1}: ${g.toFixed(1)}${g<0?'  ← 넘침':g>=25?'  ← 빈 공간 큼':''}`;}));
console.log(r.join('\n'));await b.close();
