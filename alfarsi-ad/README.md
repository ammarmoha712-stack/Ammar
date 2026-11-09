# Al Farsi Law Office: "One Legal File, Eight Pathways" (60s, 9:16)

**Deliverable:** `AlFarsi_Legal_Ad_60s_1080x1920.mp4`: 1080×1920, 30 fps, H.264 + AAC, 60.0 s, loudness normalized to -14 LUFS for social platforms.

| Time | Scene |
|---|---|
| 0.0–5.8 | Legal question: the client opens the folder and golden lines emerge |
| 5.8–15.6 | Tangled paths, then the lawyer arrives and the lines become organized |
| 15.6–25.8 | Office review: document highlight, magnifier, tablet, 8 pathways |
| 25.8–44.4 | 8 services in 2 animated 2×2 sets, then a unified list |
| 44.4–52.6 | 8 pathways align into one route; the folder is handed back |
| 52.6–60.0 | Logo frame, full name, slogan, phone and website |

## Rebuild
```
npm i @fontsource/alexandria @fontsource/ibm-plex-sans-arabic
pip install numpy scipy
mkdir -p build && for k in 0 1 2 3; do node render.js $((k*450)) $(((k+1)*450)) build/part$k.mp4 & done; wait
python3 audio.py
printf "file 'part0.mp4'\nfile 'part1.mp4'\nfile 'part2.mp4'\nfile 'part3.mp4'\n" > build/list.txt
ffmpeg -y -f concat -safe 0 -i build/list.txt -i build/soundtrack.wav -map 0:v -map 1:a -c:v copy \
  -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:a aac -b:a 256k -ar 48000 -movflags +faststart -t 60 AlFarsi_Legal_Ad_60s_1080x1920.mp4
```
- `engine.js`: all scenes, characters, service icons and typography (deterministic `render(t)`)
- `audio.py`: places the voice-over, synthesizes the score and sound effects, and ducks music under the voice
- `character_reference_sheet.png`: locked character designs
