# 인스타그램 자동 게시용 Meta 토큰 발급 안내 (무료)

소요 시간 약 20분. 비용 없음. 본인 계정에만 올리는 용도라 앱 심사 불필요.
아래 A 방법(Instagram 로그인 방식)이 가장 짧다. 페이스북 페이지 없이 된다.
메뉴 이름은 Meta가 자주 바꾸므로 비슷한 이름을 찾으면 된다.

## 0. 준비
1. 인스타그램 앱 → 프로필 → 설정 → **계정 유형 및 도구** → **프로페셔널 계정으로 전환** (비즈니스 또는 크리에이터, 무료).
2. 페이스북 계정이 있어야 개발자 사이트에 로그인할 수 있다. 없으면 하나 만든다(페이지는 필요 없음).

## A. Instagram 로그인 방식 (권장)
1. https://developers.facebook.com 접속 → 오른쪽 위 **내 앱** → **앱 만들기**.
2. 사용 사례에서 **"Instagram 비즈니스 계정 관리 / Instagram API"** 계열을 고른다. 앱 이름은 `PBS Marketing` 처럼 아무거나.
3. 앱 대시보드 왼쪽 → **Instagram** → **API setup with Instagram login** (한국어: "Instagram 로그인으로 API 설정").
4. **1단계 Instagram 계정 추가**: "Add account" → 본인 인스타 계정을 테스터로 추가.
   → 인스타 앱에서 설정 → **앱 및 웹사이트** → **테스터 초대** 탭에서 수락.
5. 같은 화면 **Generate token** (토큰 생성) 버튼 → 인스타 로그인 → 권한 허용. 권한에 반드시 포함:
   - `instagram_business_basic`
   - `instagram_business_content_publish`
6. 화면에 나오는 긴 문자열이 **액세스 토큰**(60일 유효). 복사해 둔다. **채팅방에 붙여넣지 않는다.**
7. 같은 화면에 **Instagram 앱 ID / 앱 시크릿**도 보이면 함께 메모해 둔다(토큰 갱신에 쓸 수 있음).

## B. 페이스북 페이지 방식 (A가 안 보일 때)
1. 페이스북 페이지를 하나 만들고(무료), 인스타 설정 → 계정 센터에서 그 페이지와 연결.
2. 개발자 앱 대시보드 → **도구** → **그래프 API 탐색기** → 권한 추가: `instagram_basic`, `instagram_content_publish`, `pages_show_list`, `pages_read_engagement`, `business_management` → **Generate Access Token**.
3. 받은 단기 토큰을 60일짜리로 바꾼다:
   `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=앱ID&client_secret=앱시크릿&fb_exchange_token=단기토큰`
4. 이 경우 스크립트 실행 시 `IG_API_HOST=graph.facebook.com` 을 함께 넣는다.

## 토큰을 넣는 자리 (중요)
토큰은 비밀번호와 같다. 채팅방, 깃허브, 노션에 붙여넣지 않는다.
- 이 세션 제목 표시줄의 **클라우드 환경 메뉴 → Edit(편집)** → **Network secrets**(또는 "API credentials" / 환경 변수) 항목에 추가:
  - 이름 `IG_ACCESS_TOKEN` · 값: 복사한 토큰
  - (B 방식일 때만) 이름 `IG_API_HOST` · 값 `graph.facebook.com`
- 저장 후 **새 채팅 세션**을 열면 Claude가 읽을 수 있다.

## 확인
새 세션에서 "인스타 토큰 확인해줘"라고 하면 Claude가 아래를 실행한다:
```
python3 marketing/publish/ig_publish.py check
```
계정 이름과 ID가 나오면 연결 완료. 그 뒤로는 큐 파일(`marketing/publish/queue.json`)에 올릴 것을 넣고
```
python3 marketing/publish/ig_publish.py due
```
를 실행하면 예약 시각이 지난 게시물이 순서대로 올라간다.

## 알아둘 것
- 토큰은 60일마다 갱신. `python3 marketing/publish/ig_publish.py refresh` 로 연장되며, 결과로 나온 새 토큰을 위 자리에 다시 넣는다.
- 사진·릴스 영상은 **공개 URL**에 있어야 한다. 이 리포는 Vercel에 배포되므로 `marketing/publish/media/` 폴더에 파일을 두고 main에 합치면 `https://<배포주소>/marketing/publish/media/파일명` 으로 바로 쓸 수 있다.
- 릴스: MP4, 세로 9:16, 3초~90초. 사진: JPG, 최대 8MB. 카드뉴스: 2~10장.
- 하루 게시 한도가 있으나 일 몇 건 수준에서는 문제 없다.
