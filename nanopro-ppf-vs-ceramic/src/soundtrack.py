"""Synthesizes the music bed + SFX for the NANO PRO spot (35.0 s, 48 kHz stereo).
Event times are given in VO seconds and mapped to video time (VO is sped up by K)."""
import numpy as np, wave, sys
SR = 48000; DUR = 35.0; K = 36.6 / 35.0
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

# --- pad chords (D minor: Dm - Bb - Gm - A, then D major lift for the brand)
chords = [(0, [50, 57, 62, 65]), (v(7.55), [46, 53, 58, 62]), (v(15.45), [43, 50, 55, 58]),
          (v(23.7), [45, 52, 57, 61]), (v(29.7), [46, 53, 58, 65]), (v(32.85), [50, 57, 62, 66, 69])]
for i, (st, notes) in enumerate(chords):
    en = chords[i + 1][0] if i + 1 < len(chords) else DUR
    n = int((en - st + .6) * SR); tt = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * hz(m) * tt * (1 + .0015 * j)) + .3 * np.sin(2 * np.pi * hz(m) * 2 * tt) for j, m in enumerate(notes))
    s *= envl(n, .5, .6) * (.5 + .5 * np.sin(2 * np.pi * .25 * tt) ** 2)
    add(s / len(notes), st, pan=(-.3 if i % 2 else .3), g=.16)
# sub bass
for i, (st, notes) in enumerate(chords):
    en = chords[i + 1][0] if i + 1 < len(chords) else DUR
    n = int((en - st) * SR); tt = np.arange(n) / SR
    add(np.sin(2 * np.pi * hz(notes[0] - 12) * tt) * envl(n, .05, .2), st, g=.22)

# --- rhythmic pulse (kick + hat), building
bpm = 100; beat = 60 / bpm
def kick():
    n = int(.35 * SR); tt = np.arange(n) / SR
    f = 120 * np.exp(-tt * 18) + 45
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9)
def hat():
    n = int(.06 * SR); x = rs.standard_normal(n); x = x - lp(x, .3)
    return x * np.exp(-np.arange(n) / SR * 70)
K1, HH = kick(), hat()
b = v(7.55)
while b < v(32.6):
    sec = 2 if b < v(15.45) else (1 if b < v(23.7) else 3)
    g = {1: .10, 2: .35, 3: .5}[sec]
    add(K1, b, g=g)
    add(HH, b + beat / 2, pan=.4, g=g * .25)
    if sec == 3: add(HH, b + beat / 4, pan=-.4, g=.08); add(HH, b + 3 * beat / 4, pan=-.4, g=.08)
    b += beat

# --- whooshes at transitions
def whoosh(d=.9, up=True):
    n = int(d * SR); x = rs.standard_normal(n); tt = np.linspace(0, 1, n)
    k = (.02 + .25 * tt ** 2) if up else (.27 - .25 * tt)
    y = np.empty(n); acc = 0.0
    for i in range(n): acc += k[i] * (x[i] - acc); y[i] = acc
    return y * np.sin(np.pi * tt) ** 1.5 * 2.2
for a in [1.4, 7.25, 15.1, 23.35, 29.6, 32.5]:
    add(whoosh(), v(a) - .55, pan=0, g=.55)

# --- stone impacts on the film (thud + tick), smaller ones in the split screen
def impact(sz=1.0):
    n = int(.5 * SR); tt = np.arange(n) / SR
    thud = np.sin(2 * np.pi * (70 + 60 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 12)
    tick = rs.standard_normal(n) * np.exp(-tt * 80)
    return (thud * .9 + tick * .35 * sz) * sz
for a, sz in [(12.25, 1.0), (13.75, .7), (24.7, .4), (26.1, .3), (27.5, .4), (28.9, .35)]:
    add(impact(sz), v(a), pan=-.2, g=.8)

# --- water bead plinks
def plink(f):
    n = int(.4 * SR); tt = np.arange(n) / SR
    return np.sin(2 * np.pi * f * tt * (1 + .4 * np.exp(-tt * 40))) * np.exp(-tt * 14)
for i in range(9):
    add(plink(1300 + 900 * rs.random()), v(19.35 + i * .11 + rs.random() * .05), pan=rs.uniform(-.7, .7), g=.10)

# --- coating shimmer (scene 3) & brand shimmer
def shimmer(d):
    n = int(d * SR); tt = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * hz(m) * tt) * np.exp(-tt * (1.2 + j * .3)) for j, m in enumerate([86, 90, 93, 98]))
    return s * envl(n, .02, d * .6) / 4
add(shimmer(2.5), v(15.7), pan=.3, g=.22)
add(shimmer(2.5), v(17.4), pan=-.3, g=.18)

# --- climax riser into merge + brand hit
n = int(1.6 * SR); tt = np.arange(n) / SR
riser = np.sin(2 * np.pi * np.cumsum(200 + 900 * (tt / 1.6) ** 2) / SR) * (tt / 1.6) ** 2
add(riser, v(29.7) - 1.6, g=.12)
def boom():
    n = int(3.2 * SR); tt = np.arange(n) / SR
    s = np.sin(2 * np.pi * (45 + 40 * np.exp(-tt * 8)) * tt) * np.exp(-tt * 2.2)
    s += sum(np.sin(2 * np.pi * hz(m) * tt) * np.exp(-tt * 1.3) for m in [62, 66, 69, 74]) * .18
    s += rs.standard_normal(n) * np.exp(-tt * 25) * .3
    return s
add(boom(), v(29.75), g=.45)
add(boom(), v(33.0), g=.6)
add(shimmer(2.0), v(33.05), g=.3)

mix = np.stack([L, R], 1)
mix *= envl(N, .3, 1.2)[:, None]
mix /= np.abs(mix).max() / .89
pcm = (mix * 32767).astype('<i2')
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('ok', sys.argv[1])
