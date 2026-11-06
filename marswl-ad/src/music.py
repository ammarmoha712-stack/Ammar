"""Original synthesized music bed + SFX for the MARSWL ad (60 s, 100 BPM). Writes assets/music_sfx.wav."""
import numpy as np
from scipy.signal import butter, sosfilt
from scipy.io import wavfile

SR = 44100; DUR = 60.0; N = int(SR * DUR)
BPM = 100; BEAT = 60 / BPM; BAR = 4 * BEAT
rng = np.random.default_rng(3)
L = np.zeros(N); R = np.zeros(N)
hz = lambda m: 440 * 2 ** ((m - 69) / 12)
def add(sig, t0, gain=1.0, pan=0.0):
    i = int(t0 * SR);
    if i >= N: return
    s = sig[: N - i] * gain
    L[i:i + len(s)] += s * np.sqrt((1 - pan) / 2) * 1.41
    R[i:i + len(s)] += s * np.sqrt((1 + pan) / 2) * 1.41
def env(n, a, d_total, rel):
    e = np.ones(n); na = int(a * SR); nr = int(rel * SR)
    e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] *= np.linspace(1, 0, nr)
    return e
def bp(x, lo, hi, order=2): return sosfilt(butter(order, [lo, hi], 'band', fs=SR, output='sos'), x)
def lp(x, f, order=2): return sosfilt(butter(order, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, order=2): return sosfilt(butter(order, f, 'high', fs=SR, output='sos'), x)

# A minor, elegant: Am9 - Fmaj7 - Cmaj9 - G6/B
CH = [[57, 60, 64, 67, 71], [53, 57, 60, 64, 67], [48, 55, 59, 62, 64], [47, 55, 59, 62, 64]]
ROOT = [45, 41, 48, 43]
nbars = int(np.ceil(DUR / BAR))
END_T = 57.6  # final signature hit

# Pad
for b in range(nbars):
    t0 = b * BAR
    if t0 >= END_T: break
    n = int(BAR * 1.15 * SR); t = np.arange(n) / SR
    sig = np.zeros(n)
    for m in CH[b % 4]:
        for det in (-0.07, 0, 0.07):
            f = hz(m) * 2 ** (det / 12)
            sig += np.sin(2 * np.pi * f * t + rng.random() * 6) + 0.25 * np.sin(4 * np.pi * f * t)
    sig = lp(sig, 2200) * env(n, 0.5, 0, 0.6) / 14
    add(sig, t0, 0.55, pan=0)

# Sub bass (from bar 1)
for b in range(1, nbars):
    for off, ln in ((0, 1.4), (1.5 * BEAT, 0.5), (2 * BEAT, 1.6)):
        t0 = b * BAR + off
        if t0 >= END_T: continue
        n = int(ln * SR); t = np.arange(n) / SR
        s = np.tanh(1.6 * np.sin(2 * np.pi * hz(ROOT[b % 4]) * t)) * env(n, 0.01, 0, 0.12)
        add(lp(s, 400), t0, 0.32)

# Kick, clap, hats
def kick():
    n = int(0.35 * SR); t = np.arange(n) / SR
    f = 45 + 85 * np.exp(-t * 30); ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 9)
def clap():
    n = int(0.25 * SR); t = np.arange(n) / SR
    return bp(rng.standard_normal(n), 900, 3500) * np.exp(-t * 22)
def hat(open_=False):
    n = int((0.18 if open_ else 0.06) * SR); t = np.arange(n) / SR
    return hp(rng.standard_normal(n), 7000) * np.exp(-t * (18 if open_ else 70))
K, C = kick(), clap()
for b in range(1, nbars):
    for bt in range(4):
        t0 = b * BAR + bt * BEAT
        if t0 >= END_T - 0.05: continue
        if bt in (0, 2): add(K, t0, 0.55)
        if bt in (1, 3) and b >= 2: add(C, t0, 0.22, pan=0.1)
        if b >= 1:
            add(hat(), t0 + BEAT / 2, 0.10, pan=0.35)
            if b >= 3: add(hat(), t0, 0.05, pan=-0.35)

# Pluck arpeggio (8ths) with ping-pong echo
arp = np.zeros(N)
def pluck(f, ln=0.45):
    n = int(ln * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t) + 0.12 * np.sin(6 * np.pi * f * t)) * np.exp(-t * 7)
pat = [0, 2, 4, 1, 3, 4, 2, 1]
for b in range(2, nbars):
    ch = CH[b % 4]
    for k in range(8):
        t0 = b * BAR + k * BEAT / 2
        if t0 >= END_T: continue
        p = pluck(hz(ch[pat[k]] + 12)); i = int(t0 * SR); arp[i:i + len(p)] += p[: N - i]
d = int(BEAT * 0.75 * SR)
eL = arp.copy(); eR = arp.copy(); eR[d:] += 0.35 * arp[:-d]; eL[2 * d:] += 0.22 * arp[:-2 * d]
L += lp(eL, 5000) * 0.075; R += lp(eR, 5000) * 0.075

# ---------- SFX ----------
def whoosh(ln=1.0):
    n = int(ln * SR); t = np.linspace(0, 1, n); x = rng.standard_normal(n)
    out = np.zeros(n); seg = 512
    for s in range(0, n, seg):
        c = 400 + 5000 * np.sin(np.pi * t[s]) ** 2
        out[s:s + seg] = bp(x[max(0, s - 2048):s + seg], c * 0.7, c * 1.3)[-len(x[s:s + seg]):]
    return out * np.sin(np.pi * t) ** 2
def impact():
    n = int(1.2 * SR); t = np.arange(n) / SR
    f = 38 + 60 * np.exp(-t * 18)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 4)
    click = hp(rng.standard_normal(n), 3000) * np.exp(-t * 60) * 0.3
    return boom + click
def sparkle(count=7, spread=0.9):
    n = int((spread + 1.2) * SR); out = np.zeros(n)
    for _ in range(count):
        f = hz(rng.choice([79, 83, 84, 86, 88, 91, 95])); st = int(rng.random() * spread * SR)
        m = n - st; t = np.arange(m) / SR
        out[st:] += np.sin(2 * np.pi * f * t) * np.exp(-t * 6) * (0.5 + rng.random() * 0.5)
    return out
for B in (12.0, 20.8, 29.4, 37.8, 47.6):
    add(whoosh(1.1), B - 0.55, 0.30, pan=0.3); add(whoosh(0.9), B - 0.35, 0.18, pan=-0.4)
add(whoosh(1.4), 0.0, 0.25)
for t0 in (3.9, 16.15, 24.95, 33.55, 41.95, 50.4): add(impact(), t0, 0.42)
for t0 in (0.9, 12.4, 21.3, 29.8, 38.2, 48.6): add(sparkle(), t0, 0.06, pan=rng.uniform(-.4, .4))

# Final signature: bell chord + swell
n = int(2.6 * SR); t = np.arange(n) / SR; sig = np.zeros(n)
for k, m in enumerate([57, 64, 69, 72, 76, 83]):
    st = int(k * 0.07 * SR); tt = t[: n - st]
    for h, a in ((1, 1), (2.76, .3), (5.4, .1)):
        sig[st:] += a * np.sin(2 * np.pi * hz(m) * h * tt) * np.exp(-tt * (1.4 + h))
add(sig / 6, END_T, 0.9); add(impact(), END_T, 0.35)

# Master: soft clip, normalize, fade
mix = np.stack([L, R], 1)
mix = np.tanh(mix * 1.2) / 1.2
mix /= np.abs(mix).max() / 0.89
fade = np.ones(N); fi = int(0.05 * SR); fade[:fi] = np.linspace(0, 1, fi)
fo = int(1.2 * SR); fade[-fo:] = np.linspace(1, 0, fo)
mix *= fade[:, None]
wavfile.write('assets/music_sfx.wav', SR, (mix * 32767).astype(np.int16))
print('ok')
