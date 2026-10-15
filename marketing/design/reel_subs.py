#!/usr/bin/env python3
"""세로 영상 → 9:16 릴스 + 캡컷 스타일 큰 자막(흰 글자·검정 외곽선).
사용: python3 marketing/design/reel_subs.py --in 원본.mp4 --out 출력.mp4 --subs marketing/design/reel_subs.tsv
      [--pos bottom|middle|top] [--font Jua] [--size 82] [--start 0] [--end 0] [--brand "@PBS컬러랩 · 컬러강점"]
subs.tsv: 시작초<TAB>끝초<TAB>문구(줄바꿈은 \\n). 시간은 --start 를 뺀 뒤의 영상 기준.
"""
import argparse, os, subprocess, tempfile
FONTS = {"Jua": "/root/.fonts/Jua.ttf", "DoHyeon": "/root/.fonts/DoHyeon.ttf",
         "BlackHanSans": "/root/.fonts/BlackHanSans.ttf", "GothicA1": "/root/.fonts/GothicA1.ttf",
         "Pretendard": "/root/.fonts/Pretendard-ExtraBold.otf"}
POS = {"bottom": "1520-text_h/2", "middle": "960-text_h/2", "top": "330-text_h/2"}
a = argparse.ArgumentParser()
a.add_argument("--in", dest="inp", required=True); a.add_argument("--out", required=True)
a.add_argument("--subs", required=True); a.add_argument("--pos", default="bottom", choices=POS)
a.add_argument("--font", default="Jua", choices=FONTS); a.add_argument("--size", type=int, default=82)
a.add_argument("--start", type=float, default=0); a.add_argument("--end", type=float, default=0)
a.add_argument("--brand", default="@PBS컬러랩 · 컬러강점"); a.add_argument("--border", type=int, default=7)
o = a.parse_args()
tmp = tempfile.mkdtemp()
filters = ["scale=-2:1920,crop=1080:1920,setsar=1"]
for i, line in enumerate(open(o.subs, encoding="utf-8")):
    if not line.strip() or line.startswith("#"): continue
    s, e, text = line.rstrip("\n").split("\t", 2)
    p = os.path.join(tmp, f"s{i}.txt"); open(p, "w", encoding="utf-8").write(text.replace("\\n", "\n"))
    filters.append(f"drawtext=expansion=none:fontfile={FONTS[o.font]}:textfile={p}:fontsize={o.size}"
                   f":fontcolor=white:borderw={o.border}:bordercolor=black:shadowcolor=black@0.45:shadowx=3:shadowy=3"
                   f":line_spacing=18:text_align=center:x=(w-text_w)/2:y={POS[o.pos]}:enable='between(t,{s},{e})'")
if o.brand:
    b = os.path.join(tmp, "brand.txt"); open(b, "w", encoding="utf-8").write(o.brand)
    filters.append(f"drawtext=expansion=none:fontfile={FONTS['Pretendard']}:textfile={b}:fontsize=32:fontcolor=white"
                   f":borderw=4:bordercolor=black@0.8:x=(w-text_w)/2:y=1790")
cmd = ["ffmpeg", "-v", "error", "-y"]
if o.start: cmd += ["-ss", str(o.start)]
cmd += ["-i", o.inp]
if o.end: cmd += ["-t", str(o.end - o.start)]
cmd += ["-vf", ",".join(filters), "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p",
        "-r", "30", "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", o.out]
subprocess.run(cmd, check=True); print("done:", o.out)
