---
name: marketing-team
description: PBS 인스타·블로그 마케팅 팀을 한 번에 돌리는 오케스트레이터. "/marketing-team [브리프]" 또는 "마케팅 팀 돌려줘", "이번 달 콘텐츠 짜줘", "이 계정 벤치마크해서 우리 걸로 만들어줘" 요청에 사용. 클라이언트 이름을 주면 marketing/clients/<이름>/ 브리프로 작업한다(자동화 에이전시 모드).
---
# 마케팅 팀 오케스트레이터

## 입력 해석
- 브리프에 **계정/URL/스크린샷**이 있으면 → 벤치마크 모드부터 시작.
- **"캘린더" / "이번 달" / "이번 주"** → 기획 모드.
- **"릴스" / "카드뉴스" / "블로그"** 단일 요청 → 해당 작가 에이전트만 호출.
- **인사이트 숫자/스크린샷** → 분석 모드.
- `--client <이름>` 또는 "OO 클라이언트" → `marketing/clients/<이름>/brief.md`를 브랜드 브리프 대신 사용. 없으면 `marketing/templates/client-brief-template.md`를 복사해 먼저 만든다.

## 실행 순서 (전체 모드)
1. `marketing-director`에게 브리프를 넘겨 목표·타깃·기간을 확정하게 한다.
2. 병렬로: `competitor-researcher`(레퍼런스가 있을 때) + `content-planner`.
3. 캘린더의 첫 주 슬롯을 `reels-writer`, `carousel-writer`, `blog-writer`에게 병렬 배정.
4. `performance-analyst`에게 "이번 주 측정할 숫자"와 측정 공백을 정리시킨다.
5. 결과 저장 경로:
   - 벤치마크: `marketing/research/YYYY-MM_<계정>.md`
   - 캘린더: `marketing/calendar/YYYY-MM_<브랜드>.md`
   - 원고: `marketing/calendar/YYYY-MM_<브랜드>/<날짜>_<채널>_<주제>.md`
   - 리포트: `marketing/reports/YYYY-WW.md`
6. 사용자에게는 파일 경로와 "오늘 바로 올릴 수 있는 것 1개"를 먼저 보여준다.

## 외부 도구 연결 규칙
- 캘린더를 Notion에 올려 달라고 하면 Notion 커넥터로 데이터베이스를 만든다(열: 날짜, 채널, 필러, 주제, 훅, CTA, 상태).
- 카드뉴스 이미지는 힉스필드(generate_image) 또는 Gamma(socials)로 생성하고 생성 프롬프트를 원고 파일에 남긴다.
- Google Drive에 올려 달라고 하면 원고 .md를 그대로 업로드한다.
- 인스타 게시는 `marketing/publish/queue.json`에 항목을 넣고 `python3 marketing/publish/ig_publish.py due`로 올린다(환경 변수 IG_ACCESS_TOKEN 필요, 없으면 META_TOKEN_GUIDE.md 안내).
- Meta Ads, Google Analytics, Apify는 이 세션에 연결되어 있지 않다. 필요한 수치는 사용자에게 스크린샷으로 요청한다.

## 금지
- 브랜드 브리프의 요금·자격 숫자 외의 숫자를 지어내지 않는다.
- 어린이를 평가·낙인찍는 문구를 쓰지 않는다.
- 구버전 체계(숲/바다/하늘 3분류)를 쓰지 않는다.
