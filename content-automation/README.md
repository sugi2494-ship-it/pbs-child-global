# 매일 콘텐츠 자동 제작 (PBS 컬러강점 처방전)

월·수·금 아침 6시 50분(한국 시간)에 예약 실행되는 Claude 세션이 이 문서대로 작업한다.
결과물은 대표(최해숙)가 휴대폰에서 확인하고 직접 인스타에 올린다. 게시는 자동으로 하지 않는다.

## 파일
- `brand.md` 브랜드·체계·금지 표현·말투. **작업 전에 반드시 읽는다.**
- `series.md` 주제 후보. `log.md` 지난 주제 기록 (중복 금지).
- `examples/*.json` 대표가 승인한 완성본(01~04). 데이터 형식, 문장 길이, 말투의 기준.
- `render.js` 데이터 → PNG 8장 + contact.png. `make-page.js` → 확인용 page.html.
- `template/slides.html` 캐러셀 디자인. **디자인은 바꾸지 않는다.**

## 순서

### 1. 준비
```
git fetch origin claude/aimax-resources-guide-l1udee
git checkout claude/aimax-resources-guide-l1udee
```
`brand.md`, `series.md`, `log.md`, `examples/01-미루는이유.json` 을 읽는다.
**log.md 에 게시일이 오늘인 편이 이미 있으면 새로 만들지 않는다.** 그 편의 확인 페이지 링크와 '오늘 올릴 날'이라는 안내만 최종 메시지로 남기고 끝낸다.
다음 번호 = log.md 마지막 번호 + 1 (두 자리, 예: 05). 게시일 = 오늘.
Gmail 에서 제목 `[컬러강점 처방전` 으로 보낸 메일을 검색해 log.md 에 없는 편이 있으면 그 번호와 주제도 사용된 것으로 본다.

### 2. 리서치 (10분 이내)
웹 검색으로 오늘(한국 시간) 기준 화제를 확인한다: 계절·명절·연휴, 생활 트렌드, 자기계발·습관·관계·육아·직장 화제, 퍼스널컬러·K뷰티 소식.
형식에 맞게 풀 수 있는 트렌드가 있으면 그것을, 없으면 `series.md` 후보 맨 위의 미사용 주제를 고른다.
사건·사고·정치·특정인 비난은 다루지 않는다. 확인한 출처 2~3개를 리서치 메모에 남긴다.

### 3. 원고 작성 → `content-automation/out/<번호>/data.json`
예시 JSON 과 같은 키를 쓰고, 아래를 추가한다.
- `date`: 오늘 날짜 (YYYY-MM-DD)
- `post.why`: 이 주제를 고른 이유 한 줄
- `post.check`: 대표가 올리기 전 확인할 것 (엔진 해석 확인, 사실 확인 등) 2~4개
- `post.caption`: 01편 캡션 형식 그대로 (1️⃣~4️⃣ 목록, 번호 댓글 요청, 태그 요청, 7번째 장 저장 요청, 무료 PBS 컬러강점 진단, "PBS 컬러강점: 4가지 엔진 × 12가지 기어로 보는 나의 강점", 해시태그 8~10개, 맨 앞 #PBS컬러강점 #컬러강점)
- `post.first_comment`: "저는 ○번이에요 😂 …" 형식 (대표가 번호를 고르도록 ○ 유지)
- `post.stories`: 스토리 3장 문구 (1 셀카+공감 투표, 2 게시물 공유+4지선다 투표, 3 질문 스티커+진단 링크)
- `post.reel`: `hook`(첫 1초 자막 한 줄), `script`(30~40초 셀카 대본, 대표 경험이 필요한 곳은 [대표님 경험 넣기])
- `post.research`: 오늘 확인한 트렌드와 출처

**문장 규칙 (디자인이 깨지지 않는 길이)**
- 표지 `items`: 각 17자 이내, 1인칭 공감 장면 ("~한다", "~간다"). 엔진 이름을 쓰지 않는다.
- 표지 `title`: 기본은 `당신은<br><span class="m">몇 번</span>이에요?` (주제에 맞게 바꿔도 되지만 2줄, 줄당 8자 이내)
- `intro.tags` 5개 이내, 각 5자 이내. `intro.title` 3줄, 줄당 12자 이내.
- 엔진 `headline` 2줄, 줄당 12자 이내. `desc` 2~3줄, 줄당 22자 이내. `say` 14자 이내.
- `gear` 는 brand.md 의 기어 이름 그대로 ("R3 성과"). 처방 `fix` 2줄, 줄당 24자 이내, **오늘 바로 할 수 있는 한 가지 행동**.
- `sheet.cells`: `p` 2줄 줄당 9자 이내, `a` 7자 이내 (넘으면 두 줄로 깨진다).
- `fixLabel`: 처방 칸 제목. 주제에 맞게 ("다시 움직이는 법", "회복하는 법", "다시 답하는 법", "제대로 쉬는 법" 등).
- 슬라이드 안에는 이모지를 쓰지 않는다 (폰트가 없어 깨진다). 캡션·스토리에는 써도 된다.
- 같은 기어를 연속된 편에서 반복하지 않도록 examples 의 최근 편과 비교한다.
- 1~4번은 반드시 RED, YELLOW, GREEN, BLUE 순서. 원인은 brand.md 의 본질·과열 신호와 모순되지 않아야 한다.

**자체 편집 검토 (편집장 기준, 통과 못 하면 고친다)**
1. 표지만 보고 "어, 난데?" 하고 멈추는가. 직장인만이 아니라 누구나 공감하는가.
2. 4개 항목이 서로 뚜렷하게 다르고, 친구를 태그하고 싶어지는가.
3. 처방이 구체적인 행동인가 (뜬구름 조언이면 탈락).
4. 금지 표현, 과장, 지어낸 사실이 없는가.
5. 최근 편(examples, log.md)과 주제·표현이 겹치지 않는가.

### 4. 렌더링
```
node content-automation/render.js content-automation/out/<번호>/data.json content-automation/out/<번호>
```
`WARN` 이 하나라도 나오면 해당 문구를 줄여서 다시 실행한다 (0개가 될 때까지).
`contact.png` 를 한 번 열어 보고, 줄바꿈이 어색한 곳(한 글자만 다음 줄로 넘어감 등)이 있으면 `<br>` 위치를 고쳐 한 번 더 렌더링한다.

### 5. 확인 페이지 발행
```
node content-automation/make-page.js content-automation/out/<번호>/data.json content-automation/out/<번호>
```
Artifact 도구로 `content-automation/out/<번호>/page.html` 을 새 artifact 로 발행한다.
`files` 에 PNG 8장을 같은 이름으로 넣는다 (예: `{"pbs_02_01.png": "content-automation/out/02/pbs_02_01.png", ...}`).
icon 은 `calendar`, description 은 "PBS 컬러강점 처방전 #번호 · 주제".

### 6. 메일 발송
Gmail `send_message` 로 **sugi2494@gmail.com** 에 보낸다. 첨부 파일은 넣지 않는다.
- 제목: `[컬러강점 처방전 #번호] 오늘 올릴 콘텐츠 · 주제`
- htmlBody: 확인 페이지 링크(가장 위, 크게), 올리기 전 확인 목록, 캡션 전문, 첫 댓글, 스토리 3장 문구, 릴스 훅.
  마지막 줄: "게시 후 다음 날 인사이트(조회·저장·공유·댓글·프로필 방문)를 Claude 대화창에 알려주세요."

### 7. 기록
`log.md` 에 한 줄 추가 (번호, 게시일, 주제, 확인 페이지 링크).
`content-automation/out/` 은 커밋하지 않는다 (.gitignore). log.md 만 커밋해서
`claude/aimax-resources-guide-l1udee` 에 push 한다. push 가 거부되면 건너뛴다 (메일 기록이 대신한다).

## 실패 시
어느 단계에서 막히든, 메일은 반드시 보낸다. 제목 `[컬러강점 처방전] 오늘 제작 실패`, 본문에 막힌 단계와 이유를 쓴다.
