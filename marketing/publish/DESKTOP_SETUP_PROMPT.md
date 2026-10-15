# 데스크톱 앱에서 Meta 토큰 세팅을 맡길 때 붙여넣는 문장

Claude 데스크톱 앱(Chrome 확장 또는 내장 브라우저 사용 가능)에서 이 리포 폴더를 열고 아래를 그대로 붙여넣는다.
로그인과 권한 승인 화면은 본인이 직접 누른다. Claude는 메뉴 이동·앱 생성·테스터 추가·토큰 생성 버튼까지 진행한다.

---
marketing/publish/META_TOKEN_GUIDE.md 의 A 방법대로 Meta 개발자 사이트에서 인스타그램 게시용 토큰을 발급해 주세요.
브라우저로 developers.facebook.com 에 들어가서 앱 만들기 → Instagram → "Instagram 로그인으로 API 설정" → 내 인스타 계정을 테스터로 추가 → 토큰 생성까지 진행해 주세요.
로그인과 권한 승인 화면이 나오면 멈추고 저에게 알려 주세요. 제가 직접 승인하겠습니다.
권한에 instagram_business_basic 과 instagram_business_content_publish 가 꼭 들어가야 합니다.
토큰이 나오면 채팅에 출력하지 말고, 이 컴퓨터의 환경 변수 IG_ACCESS_TOKEN 으로 저장한 뒤
python3 marketing/publish/ig_publish.py check 를 실행해서 계정 이름이 나오는지 확인해 주세요.
확인되면 토큰을 claude.ai 클라우드 환경 설정의 Network secrets 에 IG_ACCESS_TOKEN 으로 넣는 방법도 안내해 주세요.
---
