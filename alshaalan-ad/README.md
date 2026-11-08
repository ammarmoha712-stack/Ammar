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

---

# Property Management ad: 41s vertical (9:16)

- `ALSHAALAN_PropertyMgmt_9x16.mp4`: 1080x1920, 30 fps, 41.0 s, -14 LUFS.
- Build: `python3 audio2.py`, normalize `pm/mix.wav` to `pm/mix_norm.wav` the same way as above, run `python3 render2.py`, then mux the video and audio with ffmpeg.

| Time | Scene | Character pose |
|---|---|---|
| 0-6.2 | Owner's problem: building with piling-up notifications | walks in, then finger raised, then explaining |
| 6.2-12.4 | Notifications sorted and checked off, logo reveal | presenting, then hand on heart |
| 12.4-18.2 | Tenants and rent: lit-up units, 5-step tablet, collection | explaining, then thumbs-up |
| 18.2-23.75 | Maintenance: 3D building, 5 service tags switch to "complete" | finger raised, then thumbs-up |
| 23.75-30.05 | Dashboard (occupancy, income, maintenance, tenants), report sent to owner | presenting |
| 30.05-34.6 | 40-year counter, gold timeline, skyline | arms crossed, then hand on heart |
| 34.6-41 | Logo, tagline, contact details | hands clasped, then hand on heart, then open-arm welcome |

---

# Free Marketing ad: 45s vertical (9:16)

- `ALSHAALAN_FreeMarketing_9x16.mp4`: 1080x1920, 30 fps, 45.0 s, -14 LUFS.
- The 28.4 s voiceover is cut into 9 phrases and each phrase is placed at the start of its scene (see `VO` in `render3.py`). Music fills the gaps between phrases.
- Scenes: 0 have a property? · 5 costs (desk, falling bills, unrolling receipt) · 10 offer with "ببلاش!" reveal · 15.3 fencing · 21 wall sign · 26 real-estate platform · 32 social media · 38 40 years, the four services, final screen.
