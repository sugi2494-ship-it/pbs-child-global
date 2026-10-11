// 목록 · 표 칸에서 마지막 줄이 1–2글자만 남는 곳 찾기. usage: node orphan.mjs book.html
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:560,height:800}});
await p.goto('file://'+process.argv[2]);await p.waitForTimeout(1500);
const r=await p.evaluate(()=>{const out=[];const secs=[...document.querySelectorAll('section.pg')];
 for(const el of document.querySelectorAll('.fgt li span,.fgt li,td,.lead,p.lead,.ld,h3,figcaption,li')){
  if(el.children.length&&el.tagName!=='LI'&&el.tagName!=='TD')continue;
  const tw=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let last=null,n;const chars=[];
  while(n=tw.nextNode()){if(n.parentElement.closest('i.dF,i.dB,i.dK'))continue;for(let i=0;i<n.length;i++){const rg=document.createRange();rg.setStart(n,i);rg.setEnd(n,i+1);const rc=rg.getClientRects()[0];if(rc&&n.data[i].trim())chars.push([Math.round(rc.top),n.data[i]]);}}
  if(!chars.length)continue;const tops=[...new Set(chars.map(c=>c[0]))];
  if(tops.length<2)continue;const lastTop=Math.max(...tops);const lastChars=chars.filter(c=>c[0]===lastTop).map(c=>c[1]).join('');
  if(lastChars.length<=2){const s=el.closest('section.pg');out.push((secs.indexOf(s)+1)+': '+el.textContent.trim().slice(0,40)+' → ['+lastChars+']');}
 }return [...new Set(out)];});
console.log(r.join('\n')||'none');await b.close();
