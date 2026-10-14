#!/usr/bin/env bash
# 세로 원본 영상 → 1080x1920 릴스 (영상 화면 꽉 채움 + 머리 위 여백에 타임라인 자막)
# 사용: bash marketing/design/reel_overlay.sh 원본.mp4 출력.mp4
# 자막은 marketing/design/reel_text/ 의 hdr.txt, ftr.txt, t1~t6.txt 를 고쳐서 쓴다. 시간은 아래 big/mid 줄의 숫자.
set -e
IN="$1"; OUT="$2"; T=$(cd "$(dirname "$0")" && pwd)/reel_text
EB=/root/.fonts/Pretendard-ExtraBold.otf; SB=/root/.fonts/Pretendard-SemiBold.otf
# 큰 자막: 보라 글자 + 반투명 흰 상자 / 중간 자막: 검정 글자 + 반투명 흰 상자
big(){ echo "drawtext=expansion=none:fontfile=$EB:textfile=$T/$1:fontsize=66:fontcolor=0x4A0E78:line_spacing=16:box=1:boxcolor=white@0.82:boxborderw=26:x=(w-text_w)/2:y=120:enable='between(t,$2,$3)'"; }
mid(){ echo "drawtext=expansion=none:fontfile=$SB:textfile=$T/$1:fontsize=50:fontcolor=0x15161A:line_spacing=14:box=1:boxcolor=white@0.82:boxborderw=24:x=(w-text_w)/2:y=130:enable='between(t,$2,$3)'"; }
F="[0:v]scale=-2:1920,crop=1080:1920,setsar=1,\
drawtext=expansion=none:fontfile=$SB:textfile=$T/hdr.txt:fontsize=30:fontcolor=white:box=1:boxcolor=0xD63FE8@0.9:boxborderw=14:x=(w-text_w)/2:y=52,\
drawtext=expansion=none:fontfile=$SB:textfile=$T/ftr.txt:fontsize=34:fontcolor=white:box=1:boxcolor=0x15161A@0.75:boxborderw=16:x=48:y=h-120,\
$(big t1.txt 0 4),$(mid t2.txt 4 8),$(big t3.txt 8 12),$(mid t4.txt 12 16.5),$(big t5.txt 16.5 19.5),$(mid t6.txt 19.5 999)"
ffmpeg -v error -y -i "$IN" -filter_complex "$F" -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -r 30 -c:a aac -b:a 128k -movflags +faststart "$OUT"
echo "done: $OUT"
