# Moza Al Shehi Law Firm — "القانون يتغير... والمعرفة تحميك"

Vertical legal-awareness film, 1080×1920, 30 fps, H.264 + AAC, -14 LUFS.

**Final file:** `output/MozaAlShehi_LegalAwareness_9x16.mp4` (44.0 s, synced to the supplied voice-over).

## Rebuild
```bash
node render.js /tmp/frames 30 44 4                 # frames from film.html
ffmpeg -i assets/audio/voiceover.mp3 -ar 48000 -ac 2 /tmp/vo.wav
python3 sound.py /tmp/vo.wav /tmp/mix.wav          # music bed + SFX + ducked VO
ffmpeg -framerate 30 -i /tmp/frames/f%05d.jpg -i /tmp/mix.wav -af loudnorm=I=-14:TP=-1 \
  -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart -shortest out.mp4
```
`node snap.js <dir> 3.0 20.5 43` renders preview stills. All text, timings and colours live in `film.html`.

## Timeline (synced to VO)
| Time | Scene | On-screen |
|---|---|---|
| 0–4.4 | Legal question | القانون يتغير... / هل تعرف ما الذي تغيّر؟ |
| 4.4–13 | New law | سلطنة عُمان · قانون مكافحة المخدرات والمؤثرات العقلية · المرسوم السلطاني رقم 67/2026 · 3 cards |
| 13–20 | Offence categories | 4 cards |
| 20–26 | Penalties | عقوبات مشددة · السجن المطلق أو الإعدام + qualifier (visible before & with penalty) |
| 26–30.8 | Treatment | العلاج · التأهيل · وفق الشروط والضوابط القانونية. |
| 30.8–36.7 | Awareness | افهم القانون... لتعرف حقوقك والتزاماتك. |
| 36.7–44 | End card | Logo, brand, slogan, phone / web / location (all visible together from 41.7 s) |
