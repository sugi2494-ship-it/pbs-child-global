---
name: gpt-imagegen
description: 원장님이 "GPT로 이미지 뽑아줘", "GPT 이미지로 만들어줘", "코덱스로 이미지 생성"처럼 GPT(ChatGPT 구독) 이미지 생성을 요청할 때 사용한다. 프롬프트를 파일로 저장해 Codex CLI(codex exec)에 표준입력으로 넘기고, ~/.codex/generated_images/<세션ID>/ 에 생긴 이미지를 작업 폴더로 복사해 보여 준다. OpenAI API 크레딧을 쓰지 않고 ChatGPT 구독으로 만든다.
---

# GPT 이미지 생성 (Codex CLI · ChatGPT 구독)

원장님이 GPT 이미지를 요청하면 아래 순서로 만든다. 단계마다 결과를 한국어로 짧게 알린다.

## 0. 준비 확인 (세션마다 한 번)

클라우드 세션은 새로 열릴 때마다 Codex 설치와 로그인이 사라진다. 먼저 확인한다.

```bash
codex --version || npm install -g @openai/codex
codex login status        # "Logged in using ChatGPT" 이어야 한다
```

- 로그인이 안 되어 있으면 `codex login --device-auth` 를 백그라운드로 실행하고(`setsid nohup ... > dev.log &`),
  출력된 주소(https://auth.openai.com/codex/device)와 1회용 코드를 원장님께 알려 승인받는다.
  코드는 15분 안에 써야 한다. 원장님 ChatGPT 보안 설정의 "Codex … 기기 코드 로그인 활성화"가 켜져 있어야 한다.
- 클라우드 환경의 허용된 도메인에 `auth.openai.com`, `chatgpt.com`, `*.chatgpt.com` 이 있어야 한다.
  연결이 403으로 거절되면 원장님께 환경 편집에서 추가해 달라고 한다.
- `codex login` 프로세스를 끝낼 때 `pkill -f` 를 쓰지 않는다(자기 셸까지 끝난다). `pgrep -x codex` 로 찾아 `kill` 한다.

## 1. 프롬프트 파일 만들기

명령어에 따옴표로 프롬프트를 넣지 않는다. 텍스트 파일로 저장한다.

```
$imagegen
아래 프롬프트를 바꾸거나 요약하지 말고 그대로 이미지 도구에 넘겨라. 세로 2:3 비율로 1장만 만든다.

<영어로 구체적으로 쓴 프롬프트 본문>
```

- 본문은 영어로, 인물 · 옷 · 배경 · 조명 · 구도(전신이면 "Full body head to toe, nothing cropped, feet fully visible")까지 구체적으로 쓴다.
- 비율이 다르면 둘째 줄의 "세로 2:3"만 바꾼다.

## 2. Codex로 생성

```bash
codex exec --skip-git-repo-check -s read-only -m gpt-6-luna - < prompt.txt > run.log 2>&1
```

- ChatGPT 계정에서 쓸 수 있는 모델을 `-m` 으로 지정한다. 기본 모델이 "not supported when using Codex with a ChatGPT account" 로 거절되면
  `codex debug models` 로 목록을 보고 visibility 가 `list` 인 모델로 바꾼다.
- 여러 장은 한 장씩 차례로 돌린다(프롬프트 파일 하나 = 이미지 한 장). ChatGPT 사용량 한도가 있으니 많으면 나눠서 진행한다.

## 3. 이미지 찾아 복사

Codex는 파일을 직접 저장하지 못한다. 결과는 여기에 생긴다:

```
~/.codex/generated_images/<세션ID>/*.png
```

- 실행 직전과 직후의 파일 목록을 비교하거나, 가장 최근 수정된 png 를 찾아 작업 폴더로 원하는 파일 이름으로 복사한다.
- 복사한 이미지를 원장님께 보여 준다(SendUserFile).

## 지킬 것 (CLAUDE.md)

- 색값(HEX · CMYK · 먼셀)은 프롬프트에도 이 저장소에도 넣지 않는다. 색은 이름으로만 쓴다.
- 고객 사진의 픽셀은 바꾸지 않는다. 얼굴 사진은 모델 동의를 받은 것만 쓴다.
- 이 스킬은 원장님이 GPT 이미지 생성을 직접 요청했을 때만 쓴다.
