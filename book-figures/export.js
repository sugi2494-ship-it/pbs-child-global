// node book-figures/export.js → book-figures/out/<id>.png (2x) 와 <id>.pdf (벡터)
const path=require('path'),fs=require('fs');
const {chromium}=require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright');
(async()=>{
  const out=path.join(__dirname,'out');fs.mkdirSync(out,{recursive:true});
  const proxy=process.env.HTTPS_PROXY;
  const b=await chromium.launch({...(proxy?{proxy:{server:proxy}}:{}),args:['--ignore-certificate-errors']});
  const p=await b.newPage({viewport:{width:1200,height:1000},deviceScaleFactor:2});
  await p.goto('file://'+path.join(__dirname,'figures.html'),{waitUntil:'networkidle'});
  await p.evaluate(()=>document.fonts.ready);
  const ids=await p.$$eval('section.fig',s=>s.map(e=>e.id));
  for(const id of ids){
    await p.locator('#'+id).screenshot({path:path.join(out,id+'.png')});
  }
  // PDF: 한 그림씩 단독 페이지로
  for(const id of ids){
    const h=await p.evaluate(id=>{document.querySelectorAll('section.fig').forEach(s=>s.style.display=s.id===id?'':'none');document.body.style.background='#fff';const e=document.getElementById(id);e.style.margin='0';return Math.ceil(e.getBoundingClientRect().height)},id);
    await p.pdf({path:path.join(out,id+'.pdf'),width:'1200px',height:(h+2)+'px',printBackground:true,pageRanges:'1'});
  }
  await b.close();console.log('OK',ids.join(', '));
})();
