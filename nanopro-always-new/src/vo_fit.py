"""Tighten VO pauses + gentle speed-up so it fits 35s. Prints ffmpeg filter and cue mapping."""
import json, sys
sil = [(2.13984,2.42417),(4.31973,4.70404),(6.58322,6.85878),(9.4468,9.78905),(11.5984,11.8707),(16.3351,16.607),
(17.2649,17.5181),(20.1845,20.5166),(21.6206,21.916),(24.308,24.6497),(26.7427,27.0407),(28.6044,28.9785),
(30.0931,30.4015),(31.7784,32.0836),(34.4602,34.8643),(35.5839,35.9379),(37.8962,38.208)]
END = 38.99; TEMPO = 1.09; LEAD = .15
PAUSE = {4: .2, 7: .22, 11: .22, 13: .26}   # longer breaths at section changes (index of silence)
segs = []; s = 0.0
for i, (a, b) in enumerate(sil):
    segs.append((s, a + .025)); s = b - .025
segs.append((s, END + .05))
filt = []; cur = LEAD; starts = []
for i, (a, b) in enumerate(segs):
    starts.append(round(cur, 3))
    filt.append(f"[0:a]atrim={a:.3f}:{b:.3f},asetpts=PTS-STARTPTS,atempo={TEMPO}[s{i}]")
    cur += (b - a) / TEMPO
    if i < len(sil): cur += PAUSE.get(i, .12)
print(json.dumps({"phrase_starts_video_s": starts, "vo_end": round(cur, 2)}))
pads = [f"aevalsrc=0:d={LEAD}:s=44100[lead]"] + [f"aevalsrc=0:d={PAUSE.get(i,.12)}:s=44100[p{i}]" for i in range(len(sil))]
chain = "[lead]" + "".join(f"[s{i}]" + (f"[p{i}]" if i < len(sil) else "") for i in range(len(segs)))
n = 1 + len(segs) + len(sil)
open(sys.argv[1], 'w').write(";".join(pads + filt) + f";{chain}concat=n={n}:v=0:a=1[vo]")
