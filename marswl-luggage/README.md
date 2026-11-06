# MARSWL — End of Year Luggage Sale (9:16)

**Deliverable:** `out/MARSWL_Luggage_Ad_9x16.mp4` — 1080×1920, 30 fps, H.264 + AAC 48 kHz, 50.0 s, -16 LUFS.

| Time | Scene |
|---|---|
| 0.0–6.35 | Hook: "ناوي تسافر؟!" → "جهّز شنطك... وخلي التوفير علينا!" → "عروض نهاية السنة من مرسول!" |
| 6.35–22.5 | RIFQA (both sets) — 580 → 299 ريال, وفّر 281 ريال (price hit 17.2 s) |
| 22.5–37.55 | American Luggage (both sets), ضد الكسر — 595 → 345 ريال, وفّر 250 ريال (price hit 32.6 s) |
| 37.55–50.0 | Brand reveal, all 4 sets, WhatsApp 0530156785, marswl.com, "تسوّق الآن" |

Scene cuts sit on voice-over pauses. Edit text/prices/timings in `src/luggage.html` (`T`, `PRODUCTS`).

Rebuild: `python3 src/cutout.py && python3 src/music.py && NODE_PATH=$(npm root -g) node src/render.js <framesDir> 30 50 4`, then mux with ffmpeg (VO loudnorm -16 LUFS, music -11 dB with sidechain ducking).
