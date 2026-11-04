# NANO PRO — PPF vs Nano Ceramic (9:16, 35s)

Final: `NANO_PRO_PPF_vs_Nano_Ceramic_9x16.mp4` — 1080×1920, 30fps, H.264 + AAC, -14 LUFS.

Rebuild:
```
node src/render.js video out/video_silent.mp4      # frames from src/ad.html (canvas, synced to VO timings)
python3 src/soundtrack.py out/music.wav            # music bed + SFX
# then mux (VO sped ×1.0457 to fit 35s, music side-chain ducked) — see ffmpeg command in commit history
```
Live preview: open `src/ad.html` in a browser. Edit text/timings in the scene functions (times are VO seconds).
