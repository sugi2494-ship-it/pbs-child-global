// node book-figures/variants.js → out_<색>_<제목>/ 에 PDF·PNG
// 색: color | mono(흑백 1도) · 제목: title | notitle(장 표시·제목 줄 제거)
const fs=require('fs'),path=require('path');
const {chromium}=require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright');
const src=fs.readFileSync(path.join(__dirname,'figures.html'),'utf8');
// 흑백: 엔진색은 서로 구분되는 회색 단계로, 나머지 색은 밝기 그대로 회색으로
const ENG={'#D23B30':'#1A1A1A','#E0A400':'#8A8A8A','#2C8C5A':'#5E5E5E','#2C66A8':'#3B3B3B',
 '#F7D5D1':'#DCDCDC','#F6E4AE':'#F3F3F3','#CDEAD8':'#E6E6E6','#D3E2F4':'#ECECEC',
 '#D1006F':'#000000','#FCE3EF':'#EFEFEF','#FDE8F2':'#EFEFEF','#9A6E00':'#4A4A4A','#E7B4AE':'#BDBDBD'};
function toGray(h){let x=h.slice(1);if(x.length===3)x=x.split('').map(c=>c+c).join('');const r=parseInt(x.slice(0,2),16),g=parseInt(x.slice(2,4),16),b=parseInt(x.slice(4,6),16);const y=Math.round(.299*r+.587*g+.114*b).toString(16).padStart(2,'0');return '#'+y+y+y}
function mono(s){for(const[k,v]of Object.entries(ENG))s=s.split(k).join(v).split(k.toLowerCase()).join(v);return s.replace(/#[0-9A-Fa-f]{6}\b|#[0-9A-Fa-f]{3}\b/g,toGray)}
const NOTITLE='<style>.fig>.lead,.fig>h2{display:none!important}.fig{padding-top:48px!important}</style></head>';
(async()=>{
  const proxy=process.env.HTTPS_PROXY;
  const b=await chromium.launch({...(proxy?{proxy:{server:proxy}}:{}),args:['--ignore-certificate-errors']});
  for(const c of ['color','mono'])for(const t of ['title','notitle']){
    let h=c==='mono'?mono(src):src; if(t==='notitle')h=h.replace('</head>',NOTITLE);
    const tmp=path.join(__dirname,`_v_${c}_${t}.html`);fs.writeFileSync(tmp,h);
    const out=path.join(__dirname,`out_${c}_${t}`);fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out);
    const p=await b.newPage({viewport:{width:1200,height:1000},deviceScaleFactor:2});
    await p.goto('file://'+tmp,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
    const ids=await p.$$eval('section.fig',s=>s.map(e=>e.id));
    for(const id of ids)await p.locator('#'+id).screenshot({path:path.join(out,id+'.png')});
    for(const id of ids){const hh=await p.evaluate(id=>{document.querySelectorAll('section.fig').forEach(s=>s.style.display=s.id===id?'':'none');const e=document.getElementById(id);e.style.margin='0';return Math.ceil(e.getBoundingClientRect().height)},id);
      await p.pdf({path:path.join(out,id+'.pdf'),width:'1200px',height:(hh+2)+'px',printBackground:true,pageRanges:'1'});}
    await p.close();fs.unlinkSync(tmp);console.log('OK',c,t,ids.length);
  }
  await b.close();
})();
