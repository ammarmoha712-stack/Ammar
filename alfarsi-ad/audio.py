"""Builds the 60s soundtrack: placed voice-over + synthesized corporate score + SFX.
Usage: python3 audio.py  -> build/soundtrack.wav"""
import subprocess, wave, numpy as np
from scipy.signal import butter, sosfilt

SR = 44100; DUR = 60.0; N = int(SR * DUR)
rng = np.random.default_rng(7)

def load_vo():
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', 'assets/voiceover.mp3', '-f', 's16le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768

# (source start, source end, video start) — cut at natural pauses, placed per scene
VO_PLACEMENT = [(0.00, 4.20, 0.80), (4.20, 13.78, 6.10), (13.78, 23.62, 15.90),
                (23.62, 29.30, 25.90), (29.30, 35.10, 34.75), (35.10, 41.02, 45.00), (41.02, 47.00, 53.20)]

def lp(x, fc, order=2): return sosfilt(butter(order, fc, 'low', fs=SR, output='sos'), x)
def hp(x, fc, order=2): return sosfilt(butter(order, fc, 'high', fs=SR, output='sos'), x)
def bp(x, lo, hi): return sosfilt(butter(2, [lo, hi], 'band', fs=SR, output='sos'), x)
def env_adsr(n, a, r):
    e = np.ones(n); na, nr = int(a * SR), int(r * SR)
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] *= np.linspace(1, 0, nr)
    return e
def mtof(m): return 440 * 2 ** ((m - 69) / 12)
def add(buf, x, t0, gain=1.0):
    i = int(t0 * SR); j = min(len(buf), i + len(x))
    if j > i: buf[i:j] += x[:j - i] * gain

def pad(notes, dur, gain=.12):
    n = int(dur * SR); t = np.arange(n) / SR; y = np.zeros(n)
    for m in notes:
        fr = mtof(m)
        for det in (-0.12, 0, 0.12):
            f2 = fr * 2 ** (det / 12)
            y += np.sin(2 * np.pi * f2 * t + rng.random() * 6) + .3 * np.sin(4 * np.pi * f2 * t) + .12 * np.sin(6 * np.pi * f2 * t)
    y = lp(y, 2200) * env_adsr(n, min(1.2, dur / 3), min(1.4, dur / 3))
    return y / (len(notes) * 3) * gain * 4
def pluck(m, dur=1.2, gain=.2, bright=1.0):
    n = int(dur * SR); t = np.arange(n) / SR; fr = mtof(m)
    y = sum((bright ** k) * np.sin(2 * np.pi * fr * (k + 1) * t) / (k + 1) for k in range(5))
    return y * np.exp(-t * 4.5) * env_adsr(n, .004, .05) * gain
def bell(m, dur=3.5, gain=.25):
    n = int(dur * SR); t = np.arange(n) / SR; fr = mtof(m)
    y = np.zeros(n)
    for ratio, amp, dec in ((1, 1, 1.4), (2.76, .5, 2.6), (5.4, .25, 4), (8.93, .12, 6), (2, .35, 1.8)):
        y += amp * np.sin(2 * np.pi * fr * ratio * t) * np.exp(-t * dec)
    return y * env_adsr(n, .002, .1) * gain
def kick(gain=.5):
    n = int(.45 * SR); t = np.arange(n) / SR
    f = 42 + 80 * np.exp(-t * 30); ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 9) * gain
def whoosh(dur=.8, gain=.25, lo=300, hi=4000, rev=False):
    n = int(dur * SR); t = np.linspace(0, 1, n)
    x = rng.standard_normal(n); x = bp(x, lo, hi)
    e = np.sin(np.pi * t) ** 2
    if rev: e = t ** 2 * (t < .95) + (t >= .95) * np.linspace(1, 0, n)[0]
    return x * e * gain
def paper(gain=.18):
    n = int(.35 * SR); x = hp(rng.standard_normal(n), 2500)
    e = np.exp(-np.linspace(0, 6, n)) * (1 + .6 * np.sin(np.linspace(0, 60, n)))
    return x * e * gain
def shimmer(dur=1.6, gain=.12, base=84):
    y = np.zeros(int(dur * SR))
    for k in range(10):
        add(y, bell(base + [0, 4, 7, 12, 16, 19, 24, 19, 16, 12][k], 1.2, gain), k * dur / 14)
    return y
def click(gain=.25):
    n = int(.03 * SR); x = hp(rng.standard_normal(n), 3000) * np.exp(-np.linspace(0, 12, n))
    return x * gain
def impact(gain=.6):
    n = int(2.5 * SR); t = np.arange(n) / SR
    sub = np.sin(2 * np.pi * (38 + 30 * np.exp(-t * 8)) * t) * np.exp(-t * 2.2)
    nz = lp(rng.standard_normal(n), 900) * np.exp(-t * 5) * .4
    return (sub + nz) * gain

music = np.zeros(N); sfx = np.zeros(N)
D = 50  # D3
# --- Score (D minor -> F major) ---
chords = [  # (start, dur, notes)
    (0.0, 6.2, [38, 50, 53, 57]),          # Dm  suspense
    (5.8, 2.6, [34, 46, 50, 53]),          # Bb
    (8.2, 2.2, [31, 43, 46, 50]),          # Gm
    (10.2, 2.8, [33, 45, 49, 52]),         # A   (lawyer arrives)
    (12.8, 3.2, [41, 53, 57, 60]),         # F   clarity
    (15.6, 2.6, [41, 53, 57, 60, 65]),     # F
    (18.0, 2.6, [36, 48, 52, 55, 64]),     # C
    (20.4, 2.6, [38, 50, 53, 57, 62]),     # Dm
    (22.8, 3.2, [34, 46, 50, 53, 58]),     # Bb
]
for s, d, notes in chords: add(music, pad(notes, d + .6), s)
music[: int(6 * SR)] += np.sin(2 * np.pi * mtof(26) * np.arange(int(6 * SR)) / SR) * env_adsr(int(6 * SR), 2, 1) * .05
# arpeggio in office scene (96 bpm eighths)
arp = [65, 69, 72, 69, 64, 67, 72, 67, 62, 65, 69, 65, 58, 62, 65, 62]
step = 60 / 96 / 2
for i in range(int((25.8 - 15.9) / step)):
    add(music, pluck(arp[(i // 4 * 4 + i % 4) % len(arp)] - 12, .9, .07), 15.9 + i * step)
# services: rhythmic progression at 100 bpm
bpm = 100; beat = 60 / bpm
prog_s = [[41, 53, 57, 60], [36, 48, 52, 55], [38, 50, 53, 57], [34, 46, 50, 53]]
t0 = 25.8
for bar in range(int((44.4 - t0) / (4 * beat)) + 1):
    bs = t0 + bar * 4 * beat; ch = prog_s[bar % 4]
    if bs < 44.4: add(music, pad(ch, 4 * beat + .4, .1), bs)
    for k in range(4):
        tt = bs + k * beat
        if tt < 44.0:
            add(music, kick(.32), tt)
            for e in range(2): add(music, pluck(ch[1 + (k + e) % 3] + 12, .5, .045, .7), tt + e * beat / 2)
# resolution & brand
for s, d, notes in [(44.4, 2.2, [34, 46, 50, 53, 62]), (46.6, 2.2, [41, 53, 57, 60]), (48.8, 2.2, [36, 48, 52, 55, 64]), (51.0, 1.8, [41, 53, 57, 60, 65]), (52.6, 7.4, [29, 41, 53, 57, 60, 65, 69])]:
    add(music, pad(notes, d + .6, .13), s)
for i in range(int((52.4 - 44.6) / (step * 2))): add(music, pluck([65, 69, 72, 77][i % 4] - 12, .9, .05), 44.6 + i * step * 2)

# --- SFX ---
for tt in (5.8, 15.6, 25.8, 44.4, 52.6): add(sfx, whoosh(.9, .22), tt - .55)
add(sfx, whoosh(.6, .15, 600, 3000), 2.9); add(sfx, paper(.22), 3.15); add(sfx, shimmer(1.8, .05), 3.8)
for k in range(4): add(sfx, paper(.12), 4.0 + k * .2)
for k in range(3): add(sfx, paper(.1), 6.4 + k * .3)
add(sfx, shimmer(1.4, .045, 79), 9.9)                       # golden light
add(sfx, paper(.2), 16.4); add(sfx, paper(.14), 16.6)           # folder on table opens
add(sfx, whoosh(.5, .1, 2000, 8000), 18.8)                       # highlight swipe
for k in range(3): add(sfx, click(.22), 18.7 + k * .5)            # tablet taps
add(sfx, bell(84, 1.5, .1), 23.2); add(sfx, shimmer(1.8, .06), 23.3)  # pen touch -> 8 pathways
A = [27.25, 28.95, 29.75, 30.55, 34.9, 36.55, 38.2, 39.5]
notes = [72, 74, 76, 77, 79, 81, 83, 84]
for i, tt in enumerate(A):
    add(sfx, whoosh(.5, .12, 500, 5000), tt - .4); add(sfx, bell(notes[i], 2.2, .09), tt)
add(sfx, whoosh(.7, .16), 33.9)
add(sfx, shimmer(2.0, .07), 42.15)
add(sfx, click(.2), 45.5); add(sfx, click(.2), 45.9)
add(sfx, shimmer(1.6, .06, 77), 46.8)                          # pathways align
add(sfx, paper(.2), 49.3)                                       # folder closes / handed over
add(sfx, whoosh(1.2, .18, 200, 3000), 51.3)
add(sfx, impact(.55), 54.6); add(sfx, bell(77, 4, .16), 54.6); add(sfx, bell(84, 4, .1), 54.62)
add(sfx, shimmer(1.6, .05, 89), 55.6)
add(sfx, bell(65, 4.5, .13), 58.3); add(sfx, bell(72, 4, .08), 58.32)  # sonic signature

# --- Voice-over placement + ducking ---
vo_src = load_vo(); vo = np.zeros(N)
for a, b, v in VO_PLACEMENT:
    seg = vo_src[int(a * SR):int(b * SR)].copy(); f = int(.015 * SR)
    seg[:f] *= np.linspace(0, 1, f); seg[-f:] *= np.linspace(1, 0, f)
    add(vo, seg, v)
active = lp(np.abs(vo), 3, 1); active = np.clip(active / (active.max() * .15), 0, 1)
duck = 1 - .55 * active
mix = music * duck * 0.9 + sfx * (1 - .35 * active) + vo * 1.0
# master fade & limiter
mix[-int(1.2 * SR):] *= np.linspace(1, 0, int(1.2 * SR)) ** 1.5
mix[:int(.05 * SR)] *= np.linspace(0, 1, int(.05 * SR))
peak = np.max(np.abs(mix)); mix = np.tanh(mix / peak * 1.2) / np.tanh(1.2) * .93
st = np.stack([mix, mix], 1)
with wave.open('build/soundtrack.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype(np.int16).tobytes())
print('ok', round(peak, 3))
