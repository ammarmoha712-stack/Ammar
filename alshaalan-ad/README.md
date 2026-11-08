# Alshaalan Real Estate: 40s vertical ad (9:16)

- `ALSHAALAN_Ad_9x16.mp4`: 1080x1920, 30 fps, 40.0 s, H.264 + AAC, loudness -14 LUFS (social-platform standard).
- `source/`: build files. To rebuild, run `python3 audio.py`, normalize the result to `mix_norm.wav` (`ffmpeg -i mix.wav -af loudnorm=I=-14:TP=-1.5 mix_norm.wav`), run `python3 render.py`, then mux the video and audio with ffmpeg.

| Time | Scene | VO cue |
|---|---|---|
| 0.0-6.3 | Customer need: character walks in and turns, property cards, buy/sell/invest chips | تبحث عن عقار مناسب؟ |
| 6.3-12.25 | Right decision: 3 options, gold lock on best pick, experience/trust/advice badges | القرار الصحيح... |
| 12.25-18.4 | Brand reveal: logo, skyline, 40-year counter | مع الشعلان العقارية... |
| 18.4-25.6 | Services 01/02/03: marketing, buy & sell, consultancy | نساعدك في التسويق... |
| 25.6-32.25 | Stylized isometric map with South Riyadh highlighted | ومن جنوب الرياض... |
| 32.25-40.0 | CTA: logo, tagline, golden key, contact details | عقارك قرار، وخبرتنا دليلك |

Fonts: Tajawal (SIL Open Font License).
