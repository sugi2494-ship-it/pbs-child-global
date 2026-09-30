// node content-automation/book-quote/render.js <data.json> <출력폴더>
const path=require('path'),fs=require('fs');
const {chromium}=require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright');
(async()=>{const [df,od]=process.argv.slice(2);const D=JSON.parse(fs.readFileSync(df,'utf8'));fs.mkdirSync(od,{recursive:true});
const px=process.env.HTTPS_PROXY;const b=await chromium.launch({...(px?{proxy:{server:px}}:{}),args:['--ignore-certificate-errors']});
const p=await b.newPage({viewport:{width:1080,height:1350}});
await p.goto('file://'+path.join(__dirname,'template.html'),{waitUntil:'networkidle'});await p.evaluate(d=>build(d),D);await p.evaluate(()=>document.fonts.ready);
const warns=await p.evaluate(()=>{const o=[];document.querySelectorAll('.s').forEach(s=>{const lim=s.getBoundingClientRect().bottom-120;s.querySelectorAll('.q,.q2,.h,.p,.list,.act,.book,.src').forEach(e=>{if(e.getBoundingClientRect().bottom>lim+1)o.push(s.id+': '+e.className+' 하단 침범')})});return o});
const fl=[];for(let i=1;i<=8;i++){const f=path.join(od,`quote_${D.no}_${String(i).padStart(2,'0')}.png`);await p.locator('#s'+i).screenshot({path:f});fl.push(f)}
const sh=await b.newPage({viewport:{width:2210,height:1380}});
await sh.setContent(`<body style="margin:0;background:#777;display:grid;grid-template-columns:repeat(4,540px);gap:10px;padding:10px">${fl.map(f=>`<img src="data:image/png;base64,${fs.readFileSync(f).toString('base64')}" style="width:540px">`).join('')}</body>`);
await sh.screenshot({path:path.join(od,'contact.png'),fullPage:true});await b.close();warns.forEach(w=>console.log('WARN',w));console.log('OK',fl.length,'warnings',warns.length)})();
