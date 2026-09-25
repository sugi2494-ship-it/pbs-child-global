const {chromium}=require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright');
const names=['1_처음이라면','2_컬러강점','3_퍼스널컬러','4_기관교육','5_교육후기','6_글로벌','7_책출간'];
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1200,height:1200}});
await p.goto('file://'+__dirname+'/covers.html');
for(let i=1;i<=7;i++)await p.locator('#c'+i).screenshot({path:__dirname+'/'+names[i-1]+'.png'});
// 미리보기: 원형으로 잘린 모습
await p.setContent('<body style="margin:0;background:#fff;display:flex;gap:28px;padding:30px;font-family:sans-serif">'+names.map(n=>`<div style="text-align:center"><img src="file://${__dirname}/${n}.png" style="width:150px;height:150px;border-radius:50%;border:3px solid #ddd;padding:4px"><div style="font-size:15px;margin-top:8px">${n.slice(2)}</div></div>`).join('')+'</body>');
await p.setViewportSize({width:1450,height:260});await p.screenshot({path:__dirname+'/_preview.png'});await b.close()})();
