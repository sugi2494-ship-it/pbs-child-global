// node book-figures/package.js → out/도판목록.pdf, out/삽화_검토용_모음.pdf, ../book-figures-출판사전달.zip
const fs=require('fs'),path=require('path');
const {chromium}=require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright');
const L=[
['g01-1','그림 1-1','1장','질문의 방향을 바꾸면 불안이 신호가 된다','「오늘 밤, 질문의 방향을 바꿔 보자」 절','새 그림'],
['g02-1','그림 2-1','2장','거울 속 나에서, 삶의 현장 속 나로','「어울리는 색에서 나를 움직이는 색으로」 절','새 그림'],
['g03-1','그림 3-1','3장','약점 보완과 강점 개발은 하는 일이 다르다','「약점 보완과 강점 개발은 하는 일이 다르다」 절 끝','새 그림'],
['g03-2','그림 3-2','3장','버린 경력이 아니라, 옮겨 간 힘','「버린 경력이 아니라 옮겨 간 힘」 절','새 그림'],
['g04-1','그림 4-1','4장','큰 쟁반 하나, 그 위의 두 기어','「큰 쟁반 하나, 그 위의 두 기어」 절','새 그림'],
['g04-2','그림 4-2','4장','같은 엔진, 다른 두 기어','「같은 엔진이어도 두 기어가 다르면 모습은 달라진다」 절','새 그림'],
['g04-3','그림 4-3','4장','겉으로 같은 행동, 다른 엔진','「겉으로 같은 행동도 엔진과 기어는 다를 수 있다」 절','새 그림'],
['g05-0','그림 5-0','2부','네 엔진 한눈에 보기','2부 표제면 뒤 (5장 시작 전)','새 그림'],
['g05-1','그림 5-1','5장','RED가 힘을 발휘하는 순간과 그림자','「강점이 과해질 때 생기는 그림자」 절 끝','새 그림'],
['g06-1','그림 6-1','6장','YELLOW가 힘을 발휘하는 순간과 그림자','「강점이 과해질 때 생기는 그림자」 절 끝','새 그림'],
['g07-1','그림 7-1','7장','GREEN이 힘을 발휘하는 순간과 그림자','「건강한 GREEN은 경계를 말한다」 절 끝','새 그림'],
['g08-1','그림 8-1','8장','BLUE가 힘을 발휘하는 순간과 그림자','「완벽 대신 제출 가능한 기준」 절 끝','새 그림'],
['g09-1','그림 9-1','9장','1·2·3은 등급이 아니라, 힘이 닿는 범위다','「본능·관계·영향력은 강점이 작동하는 범위다」 절','새 그림'],
['g09-2','그림 9-2','9장','열두 기어 지도','「네 엔진의 본능·관계·영향력 지도」 절','새 그림'],
['g09-3','그림 9-3','9장','기어 선택의 네 단계','「기어 선택의 네 단계」 절','새 그림'],
['g10-1','그림 10-1','10장','RED 세 기어 한눈에 보기','「RED 세 기어를 한눈에 보기」 표','원고 표 대체 가능'],
['g11-1','그림 11-1','11장','YELLOW 세 기어 한눈에 보기','「YELLOW 세 기어를 한눈에 보기」 표','원고 표 대체 가능'],
['g12-1','그림 12-1','12장','GREEN 세 기어 한눈에 보기','「GREEN 세 기어를 한눈에 보기」 표','원고 표 대체 가능'],
['g13-1','그림 13-1','13장','BLUE 세 기어 한눈에 보기','「BLUE 세 기어를 한눈에 보기」 표','원고 표 대체 가능'],
['g14-1','그림 14-1','14장','같은 강의도 네 방식으로 빛난다','「같은 영업도, 같은 강의도 네 방식으로 빛난다」 절','새 그림'],
['g15-1','그림 15-1','15장','빽빽한 시간표보다, 네 개의 블록','「빽빽한 시간표보다 네 개의 블록을 잡아라」 표','원고 표 대체 가능'],
['g16-1','그림 16-1','16장','피로 뒤에는 두 가지가 함께 있다','「피로 뒤에는 개인의 기어와 일의 구조가 함께 있다」 절','새 그림'],
['g17-1','그림 17-1','17장','색을 맞히지 말고, 대화의 순서를 바꾼다','「24시간 대화 재설계」 표','원고 표 대체 가능'],
['g18-1','그림 18-1','18장','바꾼 것은 성격이 아니라, 대화의 순서','「빨간 엄마와 파란 아들, 우리 집 식탁에서」 절 끝','새 그림'],
['g19-1','그림 19-1','19장','키맨은 인맥이 아니라, 나누는 역할이다','「키맨은 인맥도, 운명적 해결사도 아니다」 절','새 그림'],
['g20-1','그림 20-1','20장','행동의 순서를 팀의 언어로','「베이스 엔진과 강점 기어를 팀의 언어로 번역한다」 표','원고 표 보조'],
['g21-1','그림 21-1','21장','브랜드 문장의 다섯 요소','「색 이름보다 먼저 ‘누구에게 무엇을 남기는가’를 묻는다」 절','새 그림'],
['g22-1','그림 E-1','에필로그','당신은 고칠 사람이 아니라, 알아볼 사람입니다','에필로그 끝 (또는 속표지·띠지 활용)','새 그림'],
['gA-1','그림 A-1','실습부록 A','나의 컬러강점 한 페이지 (워크시트)','「나의 컬러강점 한 페이지」 표','원고 표 대체 가능'],
['gB-1','참고 B-1','실습부록 B','48문항 자가점검 표 조판 기준','본문 삽입용 아님 · 조판 참고 시안','조판 참고'],
['gB-2','그림 B-2','실습부록 B','베이스 엔진 점수 계산과 결과 기록','「베이스 엔진 점수를 계산하는 법」 절','원고 표 대체 가능'],
];
const css=`<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700;900&display=swap"><style>@page{size:A4;margin:16mm 14mm}body{font-family:"Noto Sans KR",sans-serif;color:#1B1519;word-break:keep-all}h1{font-size:22px;margin:0 0 4px}p{font-size:11px;color:#5E545B;margin:0 0 14px;line-height:1.6}table{width:100%;border-collapse:collapse;font-size:10.5px}th{text-align:left;border-bottom:2px solid #1B1519;padding:6px 5px;font-size:10px;color:#5E545B}td{border-bottom:1px solid #E4DCE1;padding:6px 5px;vertical-align:top;line-height:1.45}td.n{white-space:nowrap;font-weight:700;color:#D1006F}.pg{page-break-after:always;display:flex;flex-direction:column;gap:8px}.pg img{width:100%;border:1px solid #E4DCE1}.cap{font-size:13px;font-weight:700}.meta{font-size:10.5px;color:#5E545B}</style>`;
(async()=>{
  const out=path.join(__dirname,'out');
  const b=await chromium.launch({proxy:process.env.HTTPS_PROXY?{server:process.env.HTTPS_PROXY}:undefined,args:['--ignore-certificate-errors']});
  const p=await b.newPage();
  const list=`<h1>『컬러강점』 삽화 도판 목록</h1><p>총 ${L.length}점 · 저자 최해숙 · 파일: 인쇄용 벡터 PDF(<b>PDF_인쇄용</b>)와 검토용 PNG 2400px(<b>PNG_검토용</b>) · 서체 Noto Sans KR / Noto Serif KR (SIL 오픈 폰트 라이선스, 상업 인쇄 가능) · 색상 RGB 기준(인쇄 방식 확정 후 CMYK·흑백 버전 조정 가능)<br>그림 안의 제목 줄(장 표시·제목)은 조판 시 캡션으로 대신할 경우 삭제한 버전을 제공할 수 있습니다.</p><table><tr><th>번호</th><th>위치</th><th>제목(캡션)</th><th>넣을 자리</th><th>비고</th><th>파일명</th></tr>${L.map(r=>`<tr><td class="n">${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td><td>${r[5]}</td><td>${r[1].replace(' ','')}.pdf</td></tr>`).join('')}</table>`;
  await p.setContent(`<html><head>${css}</head><body>${list}</body></html>`,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
  await p.pdf({path:path.join(out,'도판목록.pdf'),format:'A4',printBackground:true});
  const pages=L.map(r=>`<div class="pg"><div class="cap">${r[1]} · ${r[3]}</div><div class="meta">${r[2]} · 넣을 자리: ${r[4]} · ${r[5]}</div><img src="data:image/png;base64,${fs.readFileSync(path.join(out,r[0]+'.png')).toString('base64')}"></div>`).join('');
  await p.setContent(`<html><head>${css}</head><body>${pages}</body></html>`,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
  await p.pdf({path:path.join(out,'삽화_검토용_모음.pdf'),format:'A4',printBackground:true});
  await b.close();
  // 전달용 폴더
  const pk=path.join(__dirname,'package');fs.rmSync(pk,{recursive:true,force:true});
  for(const d of ['PDF_인쇄용','PNG_검토용'])fs.mkdirSync(path.join(pk,d),{recursive:true});
  for(const r of L){const n=r[1].replace(' ','');fs.copyFileSync(path.join(out,r[0]+'.pdf'),path.join(pk,'PDF_인쇄용',n+'.pdf'));fs.copyFileSync(path.join(out,r[0]+'.png'),path.join(pk,'PNG_검토용',n+'.png'));}
  fs.copyFileSync(path.join(out,'도판목록.pdf'),path.join(pk,'00_도판목록.pdf'));
  fs.copyFileSync(path.join(out,'삽화_검토용_모음.pdf'),path.join(pk,'01_삽화_검토용_모음.pdf'));
  console.log('OK');
})();
