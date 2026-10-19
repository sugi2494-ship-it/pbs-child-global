// node content-automation/hook-series/reels/make-reel.js <NN>
// 캐러셀 8장 → 1080x1920 릴스(무음, 음악은 인스타에서 추가)
const path=require('path'),fs=require('fs'),{execFileSync,execSync}=require('child_process');
const {chromium}=require(execSync('npm root -g').toString().trim()+'/playwright');
const no=process.argv[2];const base=path.join(__dirname,'..');
const D=JSON.parse(fs.readFileSync(path.join(base,'out',no+'.json'),'utf8'));
const FF=execSync("python3 -c \"import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())\"").toString().trim();
const strip=s=>s.replace(/<br>/g,' ').replace(/<[^>]+>/g,'');
(async()=>{const px=process.env.HTTPS_PROXY;const b=await chromium.launch({...(px?{proxy:{server:px}}:{}),args:['--ignore-certificate-errors']});
const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.setContent(`<html><head><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700;900&display=swap"></head>
<body style="margin:0;width:1080px;height:1920px;background:#1E1720;font-family:'Noto Sans KR';word-break:keep-all">
<div style="position:absolute;top:120px;left:70px;right:70px;color:#fff;font:900 54px/1.35 'Noto Sans KR'">${strip(D.hook)}</div>
<div style="position:absolute;top:262px;left:70px;color:#FF7DBE;font:700 30px 'Noto Sans KR'">PBS 컬러강점 · ${D.part} #${D.no}</div>
<div style="position:absolute;bottom:150px;left:70px;right:70px;color:#B9AAB4;font:700 30px 'Noto Sans KR'">저장해 두고 필요할 때 꺼내 보세요 · @pbscolor_ceo</div>
</body></html>`,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
const tmp=fs.mkdtempSync('/tmp/reel');const bg=path.join(tmp,'bg.png');await p.screenshot({path:bg});await b.close();
const dur=[3.5,4,4.5,5,4,4.5,4.5,4,4];const F=0.5;const fps=30;
const args=['-y','-loop','1','-i',bg];
for(let i=1;i<=9;i++)args.push('-i',path.join(base,'out',no,`hook_${no}_0${i}.png`));
let fc='';
for(let i=1;i<=9;i++){const n=Math.round(dur[i-1]*fps);
 fc+=`[${i}:v]scale=2160:2700,zoompan=z='1+0.035*on/${n}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${n}:s=1080x1350:fps=${fps},setsar=1,format=yuva420p[s${i}];`;}
let off=0,last='s1';
for(let i=2;i<=9;i++){off+=dur[i-2]-F;fc+=`[${last}][s${i}]xfade=transition=fade:duration=${F}:offset=${off.toFixed(2)}[x${i}];`;last='x'+i;}
const total=dur.reduce((a,c)=>a+c,0)-F*8;
fc+=`[0:v]scale=1080:1920,trim=duration=${total.toFixed(2)},setpts=PTS-STARTPTS[bgv];[bgv][${last}]overlay=0:330:shortest=1,format=yuv420p[out]`;
const outf=path.join(__dirname,`reel_${no}.mp4`);
args.push('-filter_complex',fc,'-map','[out]','-r',String(fps),'-c:v','libx264','-preset','medium','-crf','20','-t',total.toFixed(2),'-movflags','+faststart',outf);
execFileSync(FF,args,{stdio:['ignore','ignore','inherit']});console.log('OK',outf,total.toFixed(1)+'s')})();
