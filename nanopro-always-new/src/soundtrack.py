"""Synthesizes the music bed + SFX for the NANO PRO spot (35.0 s, 48 kHz stereo).
Event times are given in VO seconds and mapped to video time (VO is sped up by K)."""
import numpy as np, wave, sys
SR = 48000; DUR = 35.0
N = int(SR * DUR); t = np.arange(N) / SR
L = np.zeros(N); R = np.zeros(N)
rs = np.random.default_rng(3)
v = lambda a: a / K
def add(sig, at, pan=0.0, g=1.0):
    i = int(at * SR); n = min(len(sig), N - i)
    if n <= 0: return
    L[i:i+n] += sig[:n] * g * (1 - pan) ** .5 * .9; R[i:i+n] += sig[:n] * g * (1 + pan) ** .5 * .9
def envl(n, a, d):
    e = np.ones(n); na = int(a * SR); nd = int(d * SR)
    e[:na] = np.linspace(0, 1, na); e[-nd:] *= np.linspace(1, 0, nd); return e
def lp(x, k):  # one-pole lowpass, k in (0,1]
    y = np.empty_like(x); acc = 0.0
    for i in range(len(x)): acc += k * (x[i] - acc); y[i] = acc
    return y
hz = lambda m: 440 * 2 ** ((m - 69) / 12)

# --- pad chords (D minor; lift to Bb/F for the warranty, D major for the brand)
chords = [(0, [50, 57, 62, 65]), (4.0, [46, 53, 58, 62]), (14.6, [41, 48, 53, 57, 60]), (18.0, [43, 50, 55, 58]),
          (25.4, [45, 52, 57, 61]), (30.4, [50, 57, 62, 66, 69])]
for i, (st, notes) in enumerate(chords):
    en = chords[i + 1][0] if i + 1 < len(chords) else DUR
    n = int((en - st + .6) * SR); tt = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * hz(m) * tt * (1 + .0015 * j)) + .3 * np.sin(2 * np.pi * hz(m) * 2 * tt) for j, m in enumerate(notes))
    s *= envl(n, .5, .6) * (.5 + .5 * np.sin(2 * np.pi * .25 * tt) ** 2)
    add(s / len(notes), st, pan=(-.3 if i % 2 else .3), g=.16)
for i, (st, notes) in enumerate(chords):
    en = chords[i + 1][0] if i + 1 < len(chords) else DUR
    n = int((en - st) * SR); tt = np.arange(n) / SR
    add(np.sin(2 * np.pi * hz(notes[0] - 12) * tt) * envl(n, .05, .2), st, g=.22)

bpm = 100; beat = 60 / bpm
def kick():
    n = int(.35 * SR); tt = np.arange(n) / SR
    f = 120 * np.exp(-tt * 18) + 45
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9)
def hat():
    n = int(.06 * SR); x = rs.standard_normal(n); x = x - lp(x, .3)
    return x * np.exp(-np.arange(n) / SR * 70)
def blip(f=1800):  # digital pulse
    n = int(.09 * SR); tt = np.arange(n) / SR
    return np.sign(np.sin(2 * np.pi * f * tt)) * np.exp(-tt * 45) * .5
K1, HH = kick(), hat()
b = 4.0
while b < 30.2:
    if 14.6 <= b < 15.5: b += beat; continue        # hold before the warranty hit
    sec = 2 if b < 14.6 else (1 if 18.0 <= b < 25.4 else 3)
    g = {1: .10, 2: .35, 3: .45}[sec]
    add(K1, b, g=g); add(HH, b + beat / 2, pan=.4, g=g * .25)
    if sec == 2: add(blip(1600 + 400 * ((b * 7) % 3)), b + beat * .75, pan=-.5, g=.06)
    if sec == 3: add(HH, b + beat / 4, pan=-.4, g=.08); add(HH, b + 3 * beat / 4, pan=-.4, g=.08)
    b += beat

def whoosh(d=.9):
    n = int(d * SR); x = rs.standard_normal(n); tt = np.linspace(0, 1, n)
    k = (.02 + .25 * tt ** 2); y = np.empty(n); acc = 0.0
    for i in range(n): acc += k[i] * (x[i] - acc); y[i] = acc
    return y * np.sin(np.pi * tt) ** 1.5 * 2.2
for a in [1.0, 3.6, 8.3, 14.2, 17.6, 25.0, 28.15, 30.0]:
    add(whoosh(), a - .3, g=.5)

def impact(sz=1.0):
    n = int(.5 * SR); tt = np.arange(n) / SR
    thud = np.sin(2 * np.pi * (70 + 60 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 12)
    tick = rs.standard_normal(n) * np.exp(-tt * 80)
    return (thud * .9 + tick * .35 * sz) * sz
for a, sz in [(11.0, 1.0), (12.7, .7), (26.0, .4), (27.2, .3)]:
    add(impact(sz), a, pan=-.2, g=.8)
add(impact(.6), 2.0, g=.6)   # slow-motion freeze

def boom(d=3.2):
    n = int(d * SR); tt = np.arange(n) / SR
    s = np.sin(2 * np.pi * (45 + 40 * np.exp(-tt * 8)) * tt) * np.exp(-tt * 2.2)
    s += sum(np.sin(2 * np.pi * hz(m) * tt) * np.exp(-tt * 1.3) for m in [62, 66, 69, 74]) * .18
    s += rs.standard_normal(n) * np.exp(-tt * 25) * .3
    return s
def metal(d=2.5):  # inharmonic metallic strike
    n = int(d * SR); tt = np.arange(n) / SR
    return sum(np.sin(2 * np.pi * f * tt) * np.exp(-tt * dk) for f, dk in [(523, 1.4), (1187, 2.0), (1876, 2.6), (2733, 3.4), (3511, 4.5)]) / 4
add(boom(1.6), 0.05, g=.5)           # opening impact
add(boom(), 15.45, g=.55); add(metal(), 15.45, g=.55)   # 10 YEARS
def shimmer(d):
    n = int(d * SR); tt = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * hz(m) * tt) * np.exp(-tt * (1.2 + j * .3)) for j, m in enumerate([86, 90, 93, 98]))
    return s * envl(n, .02, d * .6) / 4
add(shimmer(2.0), 2.15, g=.25)       # gold sweep
add(shimmer(2.5), 18.3, pan=.3, g=.2); add(shimmer(2.5), 19.6, pan=-.3, g=.18)
# liquid pour (filtered noise swell) for the coating
n = int(2.4 * SR); x = rs.standard_normal(n); y = lp(x, .04) * 6
add(y * np.sin(np.pi * np.linspace(0, 1, n)) ** 2, 18.2, g=.25)
def plink(f):
    n = int(.4 * SR); tt = np.arange(n) / SR
    return np.sin(2 * np.pi * f * tt * (1 + .4 * np.exp(-tt * 40))) * np.exp(-tt * 14)
RG = np.random.default_rng(11)
for i in range(14):
    add(plink(1200 + 1000 * RG.random()), 21.6 + RG.random() * 1.1, pan=RG.uniform(-.7, .7), g=.10)
n = int(1.6 * SR); tt = np.arange(n) / SR
add(np.sin(2 * np.pi * np.cumsum(200 + 900 * (tt / 1.6) ** 2) / SR) * (tt / 1.6) ** 2, 28.15 - 1.6, g=.12)
add(boom(), 28.2, g=.4)
add(boom(4.0), 30.65, g=.6); add(shimmer(2.5), 30.7, g=.3); add(metal(3.0), 33.45, g=.25)

mix = np.stack([L, R], 1)
mix *= envl(N, .02, .8)[:, None]
mix /= np.abs(mix).max() / .89
pcm = (mix * 32767).astype('<i2')
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('ok', sys.argv[1])
