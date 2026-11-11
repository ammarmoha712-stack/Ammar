#!/usr/bin/env bash
# Rebuild the ad. Drop the real photos into assets/ first:

#   assets/floorplan.jpg  – supplied floor plan
#   assets/permit.jpg     – building permit (lower 66% is auto-blurred for privacy)
set -euo pipefail; cd "$(dirname "$0")"; mkdir -p build
node tools/render.js build/silent.mp4
python3 -I tools/music.py build/music.wav
ffmpeg -y -v error -i build/silent.mp4 -i assets/voiceover.mp3 -i build/music.wav -filter_complex \
"[1:a]aformat=sample_rates=44100:channel_layouts=stereo,adelay=150|150,apad,asplit=2[vo][sc];[2:a]volume=0.55[m];[m][sc]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=400[md];[vo][md]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=9[a]" \
-map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart SAWAHEL_Launch_Ad_1080x1920.mp4
echo "Done: SAWAHEL_Launch_Ad_1080x1920.mp4"
