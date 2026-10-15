---
name: reel
description: 대표님이 현장 영상(세로 촬영)과 이야기를 주면 PBS 확정 스타일(캡컷식 큰 자막 + 시작 제목)로 9:16 릴스를 만든다. "이 영상으로 릴스 만들어줘", "자막 넣어줘", "릴스로 만들어줘" 요청에 사용. 영상 파일 경로가 업로드로 들어오면 바로 이 절차를 따른다.
---
# 릴스 제작 절차 (영상 1개 → 완성 mp4 + 캡션 + 큐 등록)

스타일 기준: `marketing/brand/reel-style.md` (바꾸라는 말이 없으면 그대로)

1. **영상 확인**: `ffprobe`로 길이·해상도 확인, 5장면 프레임을 뽑아 내용·얼굴 위치를 본다(얼굴이 가려지지 않게 자막 위치 판단).
2. **자막 문장 정하기**
   - 대표님이 문장을 줬으면 그대로 쓴다(맞춤법·띄어쓰기만 손봄).
   - 캡컷 등으로 만든 참고 영상을 줬으면 1초 간격 프레임에서 자막을 읽어 문구와 타이밍을 옮기고, 오디오 상관으로 원본과의 시작 오프셋을 맞춘다(`marketing/design/` 의 이전 작업 방식).
   - 문장이 없으면 이야기에서 8~9개 문장(각 2줄 이내, 12자 이내/줄)을 뽑아 영상 길이에 맞춰 배분하고, 결과를 보여 주며 확인받는다.
3. **훅 제목 1개**: 첫 3.5초 위쪽에 큰 글씨. 대표님 말투 그대로(예: "내가 이럴 줄 알았어요 / 공무원은 블루!"). 한 줄 10자 이내.
4. **자막 파일 작성**: `marketing/design/subs/YYYY-MM-DD_주제.tsv`
5. **렌더**: `python3 marketing/design/reel_subs.py --in 원본 --out marketing/publish/media/YYYY-MM-DD_reel_주제.mp4 --subs 그 tsv --title "..."`
   - 장면 6컷 미리보기(contact sheet)를 만들어 자막이 얼굴·손을 가리지 않는지 확인한 뒤 사용자에게 영상과 미리보기를 보낸다.
6. **커버**: 0.5초 프레임을 `..._cover.jpg`로 저장.
7. **캡션·해시태그**: `marketing/templates/reels-script-template.md` 양식으로 `marketing/calendar/YYYY-MM_pbs/YYYY-MM-DD_reels_주제.md` 작성. 첫 줄은 훅 제목과 같은 문장. CTA는 하나.
8. **큐 등록**: `marketing/publish/queue.json`에 type reel, media_urls는 `https://pbs-child-global.vercel.app/marketing/publish/media/파일명`, 예약 시각은 다음 날 19:00 KST.
9. **블로그**: 요청이 있거나 현장 이야기가 충분하면 같은 소재로 블로그 글도 작성(blog-writer 양식).
10. 커밋·푸시 후 사용자에게 영상 + 미리보기 + 파일 경로를 보낸다.

주의: 교육생 얼굴이 보이는 영상이면 모자이크 여부를 먼저 묻는다. 글꼴이 없으면 `marketing/README.md`의 글꼴 설치 절차를 따른다(Pretendard npm, Jua 등은 Google Fonts).
