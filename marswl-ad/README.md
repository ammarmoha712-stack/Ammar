# MARSWL — Luxury Perfume Sale Ad (9:16)

**Deliverable:** `out/MARSWL_Perfume_Ad_9x16.mp4` — 1080×1920, 30 fps, H.264 + AAC 48 kHz, 60.0 s, -15.5 LUFS.

| Time | Scene | VO segment |
|---|---|---|
| 0.0–12.0 | Hook: 4 bottles, "خصومات تصل إلى 50%"، "لفترة محدودة!" | intro |
| 12.0–20.8 | Black XS — 350 → 225 ريال | product 1 |
| 20.8–29.4 | The One — 480 → 360 ريال | product 2 |
| 29.4–37.8 | Montblanc Emblem Intense — 285 → 160 ريال | product 3 |
| 37.8–47.6 | Armand Basi In Red — 235 → 115 ريال | product 4 |
| 47.6–60.0 | Brand reveal, WhatsApp 0530156785, marswl.com, "تسوّق الآن" | outro + hold |

Scene cuts sit on the voice-over's natural pauses.

## Rebuild
```
python3 src/cutout.py            # product cutouts (alpha only, pixels untouched)
python3 src/music.py             # original music bed + SFX -> assets/music_sfx.wav
NODE_PATH=$(npm root -g) node src/render.js <framesDir> 30 60 4
ffmpeg ... (see commit history / mix: VO loudnorm -16 LUFS, music -12 dB with sidechain ducking)
```
Edit text, prices, and timings in `src/ad.html` (`T`, `PRODUCTS`).
