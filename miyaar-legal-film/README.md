# MIYAAR LEGAL — Corporate Brand Profile Film

معيار ليجل للمحاماة والاستشارات القانونية — فيلم تعريفي مؤسسي

## Deliverables (`output/`)

| File | Format | Use |
|---|---|---|
| `MiyaarLegal_BrandFilm_16x9_1080p.mp4` | 1920×1080, 30 fps, H.264 + AAC, −16 LUFS | Website, presentations, YouTube, LinkedIn |
| `MiyaarLegal_BrandFilm_9x16_1080x1920.mp4` | 1080×1920, 30 fps, burned-in Arabic captions | Instagram Reels, TikTok, Snapchat, WhatsApp Status |

Runtime: 63.5 s. The supplied voice-over runs 60.1 s, so the film follows it rather than the 45 s in the brief.

## Scene map (film time; voice-over starts at 0.5 s)

| # | Time | Scene | On-screen copy |
|---|---|---|---|
| 1 | 0.0–6.6 | Riyadh skyline, Saudi flag, law books, gold scale → gold line → logo | في عالم الأعمال... الثقة تصنع الفارق |
| 2 | 6.6–13.2 | Business district rises; professionals; gold network | معيار ليجل / للمحاماة والاستشارات القانونية / شريك قانوني برؤية استباقية |
| 3 | 13.2–23.3 | Values circles → scale balancing a building and law books | الخبرة · الثقة · الاستدامة / الدقة القانونية · الحلول الاستباقية · فهم بيئة الأعمال |
| 4 | 23.3–33.8 | Paper pile splits into 8 service icons; services shown one at a time | The 8 published services |
| 5 | 33.8–40.6 | Four arched sector panels joined by a gold line | الشركات والمؤسسات · المستثمرون ورواد الأعمال · الجهات الحكومية وشبه الحكومية · القطاع غير الربحي |
| 6 | 40.6–47.7 | Four-step methodology; the progress line ends in a shield | 01 الفهم والتحليل → 04 التنفيذ والمتابعة |
| 7 | 47.7–55.3 | Consultant in an office with a Najdi arched window | السرية والاحترافية · الدقة والابتكار · الحلول الاستباقية · حماية مصالح العملاء |
| 8 | 55.3–63.5 | Logo build, gold frame, sonic logo | خبرة · ثقة · استدامة / miyaarlegal.com / 0509020750 |

## Brand compliance
- The supplied logo file is used as-is, with its proportions and colours unchanged. The end card shows the emblem and the wordmark separately, but at the exact spacing of the original file.
- Palette: #3F4E5A, #C5A059, #F7F4EA, #E9DFC9, #FFFFFF, #302E2B. The green appears only in the Saudi flag.
- All Arabic text is set as live type (El Messiri, IBM Plex Sans Arabic). None of it is AI-generated.
- The film adds no statistics, awards, clients or testimonials.

## Rebuild
```bash
python3 -m http.server 8765            # from this folder
node scripts/render.js "http://127.0.0.1:8765/index.html" 1920 1080 0 1905 h.mp4
node scripts/render.js "http://127.0.0.1:8765/index.html?v=1" 1080 1920 0 1905 v.mp4
ffmpeg -i audio/voiceover.mp3 -ac 1 -ar 44100 -f f32le - | python3 scripts/music.py music.wav
```
Change the timing in `film.js` (GSAP master timeline, seconds = voice-over time) and the illustrations in `art.js`.
