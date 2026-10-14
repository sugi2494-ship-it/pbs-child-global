#!/usr/bin/env bash
# 세로 원본 영상 → 1080x1920 릴스 (흰 바탕 + 상단 타임라인 자막 + 하단 검정 띠)
# 사용: bash marketing/design/reel_overlay.sh 원본.mp4 출력.mp4
# 자막은 marketing/design/reel_text/ 의 hdr.txt, ftr.txt, t1~t6.txt 를 고쳐서 쓴다.
set -e
IN="$1"; OUT="$2"; T=$(dirname "$0")/reel_text
EB=/root/.fonts/Pretendard-ExtraBold.otf; SB=/root/.fonts/Pretendard-SemiBold.otf
big(){ echo "drawtext=expansion=none:fontfile=$EB:textfile=$T/$1:fontsize=64:fontcolor=0x4A0E78:line_spacing=14:x=(w-text_w)/2:y=150:enable='between(t,$2,$3)'"; }
mid(){ echo "drawtext=expansion=none:fontfile=$SB:textfile=$T/$1:fontsize=50:fontcolor=0x15161A:line_spacing=14:x=(w-text_w)/2:y=160:enable='between(t,$2,$3)'"; }
F="[0:v]scale=1080:-2,setsar=1[v];color=c=white:s=1080x1920[bg];[bg][v]overlay=0:300:shortest=1,\
drawtext=expansion=none:fontfile=$SB:textfile=$T/hdr.txt:fontsize=30:fontcolor=0xD63FE8:x=(w-text_w)/2:y=60,\
drawbox=x=0:y=1729:w=1080:h=191:color=0x15161A@1:t=fill,\
drawtext=expansion=none:fontfile=$SB:textfile=$T/ftr.txt:fontsize=34:fontcolor=white:x=(w-text_w)/2:y=1805,\
$(big t1.txt 0 3.5),$(mid t2.txt 3.5 8),$(big t3.txt 8 12),$(mid t4.txt 12 16.5),$(big t5.txt 16.5 19.5),$(mid t6.txt 19.5 999)"
ffmpeg -v error -y -i "$IN" -filter_complex "$F" -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -r 30 -c:a aac -b:a 128k -movflags +faststart "$OUT"
echo "done: $OUT"
