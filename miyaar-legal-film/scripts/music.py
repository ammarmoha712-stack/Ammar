# Original score for the Miyaar Legal film: soft cinematic piano, warm strings,
# subtle modern pulse, transition swells, and a sonic logo. Film time T (VO starts at T=0.5).
import numpy as np, sys, wave

SR = 44100
OFF = 0.5               # VO / visuals offset
DUR = 63.5
N = int(SR * DUR)
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(7)

def midi(m): return 440.0 * 2 ** ((m - 69) / 12)

def add(sig, t0, pan=0.0, gain=1.0):
    i0 = int(t0 * SR)
    if i0 >= N: return
    sig = sig[: N - i0]
    l = np.cos((pan + 1) * np.pi / 4); r = np.sin((pan + 1) * np.pi / 4)
    L[i0:i0 + len(sig)] += sig * gain * l
    R[i0:i0 + len(sig)] += sig * gain * r

def piano(m, dur, vel=0.6):
    f = midi(m)
    n = int(SR * (dur + 2.5)); t = np.arange(n) / SR
    s = np.zeros(n)
    for k in range(1, 9):
        fk = f * k * np.sqrt(1 + 0.0004 * k * k)
        if fk > 12000: break
        amp = (1 / k ** 1.4) * (1 + 0.3 * (k == 2))
        dec = 1.6 + 0.9 * k + f / 600
        s += amp * np.sin(2 * np.pi * fk * t + rng.uniform(0, 6.28)) * np.exp(-dec * t * 0.55)
    att = np.minimum(1, t / 0.004)
    rel = np.where(t > dur, np.exp(-(t - dur) * 6), 1)
    hammer = np.exp(-t * 60) * rng.normal(0, 0.02, n)
    return (s * att * rel + hammer) * vel * 0.22

def pad(ms, dur, att=1.8, relt=2.0, bright=6):
    n = int(SR * (dur + relt)); t = np.arange(n) / SR
    s = np.zeros(n)
    for m in ms:
        for det in (-0.07, 0.0, 0.07):
            f = midi(m + det)
            ph = rng.uniform(0, 6.28)
            for k in range(1, bright + 1):
                s += (1 / k ** 1.25) * np.sin(2 * np.pi * f * k * t + ph * k)
    env = np.minimum(1, t / att) * np.where(t > dur, np.exp(-(t - dur) * 3 / relt), 1)
    trem = 1 + 0.06 * np.sin(2 * np.pi * 0.23 * t)
    return s * env * trem * 0.012 / max(1, len(ms) / 3)

def bass(m, dur):
    n = int(SR * (dur + 0.8)); t = np.arange(n) / SR; f = midi(m)
    s = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t) + 0.12 * np.sin(6 * np.pi * f * t)
    env = np.minimum(1, t / 0.05) * np.exp(-t * 0.45) * np.where(t > dur, np.exp(-(t - dur) * 8), 1)
    return s * env * 0.11

def kick():
    n = int(SR * 0.5); t = np.arange(n) / SR
    f = 48 + 70 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 9) * 0.32

def tick():
    n = int(SR * 0.08); t = np.arange(n) / SR
    x = rng.normal(0, 1, n); x = np.diff(np.concatenate([[0], x]))
    return x * np.exp(-t * 70) * 0.03

def swell(dur=1.1):
    n = int(SR * dur); t = np.arange(n) / SR
    x = rng.normal(0, 1, n)
    # moving one-pole lowpass: cutoff rises
    y = np.zeros(n); a_lo, a_hi = 0.02, 0.35
    acc = 0.0
    for i in range(n):
        a = a_lo + (a_hi - a_lo) * (i / n) ** 2
        acc += a * (x[i] - acc); y[i] = acc
    env = (t / dur) ** 2.2 * np.exp(-np.maximum(0, t - dur * 0.92) * 40)
    return y * env * 0.10

def bell(m, dur=4.0, vel=0.5):
    n = int(SR * dur); t = np.arange(n) / SR; f = midi(m)
    s = np.zeros(n)
    for ratio, amp, dec in ((1, 1, 1.1), (2.0, 0.5, 1.8), (2.76, 0.35, 2.6), (5.4, 0.18, 4.5), (8.93, 0.08, 7)):
        s += amp * np.sin(2 * np.pi * f * ratio * t) * np.exp(-dec * t)
    return s * np.minimum(1, t / 0.002) * vel * 0.2

# ---------- harmony ----------
BPM = 72; beat = 60 / BPM; bar = 4 * beat
# chords: (bass root, pad voicing, arpeggio pool)
CH = {
    'D':   (38, [62, 66, 69, 76], [62, 66, 69, 73, 76, 78]),
    'Bm':  (35, [59, 62, 66, 69], [59, 62, 66, 69, 73, 74]),
    'G':   (31, [59, 62, 66, 71], [55, 59, 62, 66, 69, 71]),
    'A':   (33, [61, 64, 69, 71], [57, 61, 64, 69, 71, 76]),
    'Em':  (40, [59, 62, 67, 71], [55, 59, 62, 67, 71, 74]),
    'Asus': (33, [62, 64, 69, 71], [57, 62, 64, 69, 71, 76]),
}
prog = ['D', 'Bm', 'G', 'A', 'D', 'Bm', 'Em', 'Asus', 'G', 'D', 'Bm', 'A', 'G', 'Em', 'Asus', 'A', 'D', 'D', 'D']
start = 0.0
nb = int(np.ceil(DUR / bar))
arp_pat = [0, 2, 4, 3, 5, 3, 2, 1]
for b in range(nb):
    t0 = start + b * bar
    if t0 > 59.6: break
    name = prog[b % len(prog)]
    root, voicing, pool = CH[name]
    end_section = t0 >= 55.0
    # strings pad
    add(pad(voicing, bar * 1.02), t0, pan=-0.15, gain=1.0 if not end_section else 0.8)
    add(pad([v - 12 for v in voicing[:2]], bar * 1.02, bright=4), t0, pan=0.2, gain=0.7)
    # bass
    if t0 > 5.5:
        add(bass(root, bar * 0.95), t0, gain=1.0)
    # piano arpeggio (8ths); sparser intro & outro
    for i in range(8):
        if t0 < 6.6 and i % 2: continue
        if end_section and i > 3: continue
        m = pool[arp_pat[i] % len(pool)] + (12 if (b % 4 == 3 and i == 5) else 0)
        vel = 0.55 + 0.15 * (i == 0) + rng.uniform(-0.06, 0.06)
        add(piano(m, beat * 0.9, vel), t0 + i * beat / 2 + rng.uniform(0, 0.008), pan=0.25 * np.sin(i), gain=1)
    # melody accents (upper piano) every other bar
    if b % 2 == 1 and 6 < t0 < 54:
        add(piano(pool[-1] + 12, beat * 1.5, 0.35), t0 + 2 * beat, pan=0.35)
    # pulse: from services (T>23) to end of difference section
    if 23.0 <= t0 < 54.8:
        for k in range(4):
            if k in (0, 2): add(kick(), t0 + k * beat, gain=0.9 if k == 0 else 0.6)
        for k in range(8):
            add(tick(), t0 + k * beat / 2, pan=0.4 if k % 2 else -0.4, gain=1.0 if k % 2 else 0.6)

# transition swells into each scene change (film time)
for tc in (6.65, 13.05, 23.2, 33.7, 40.45, 47.5, 55.2):
    add(swell(1.1), tc - 1.05, pan=0.0, gain=1.0)

# sonic logo (VO ends ~60.4 film time)
T_LOGO = 60.45
for m, dt in ((74, 0.0), (78, 0.07), (81, 0.14), (86, 0.21)):
    add(bell(m, 4.5, 0.55), T_LOGO + dt, pan=(m - 80) / 12)
add(piano(50, 3.0, 0.7), T_LOGO, pan=0); add(piano(38, 3.0, 0.6), T_LOGO, pan=0)
add(pad(CH['D'][1] + [86], 1.6, att=0.4, relt=2.0), T_LOGO, gain=1.2)
add(bass(26, 2.0), T_LOGO, gain=1.3)

# ---------- reverb ----------
def ir(seconds=2.4, seed=1):
    r = np.random.default_rng(seed); n = int(SR * seconds); t = np.arange(n) / SR
    x = r.normal(0, 1, n) * np.exp(-t * 3.0)
    # darken
    y = np.zeros(n); acc = 0
    for i in range(n): acc += 0.25 * (x[i] - acc); y[i] = acc
    return y / np.sqrt(np.sum(y ** 2))
def conv(x, h):
    n = len(x) + len(h) - 1; nf = 1 << (n - 1).bit_length()
    return np.fft.irfft(np.fft.rfft(x, nf) * np.fft.rfft(h, nf), nf)[:len(x)]
wetL = conv(L, ir(seed=1)); wetR = conv(R, ir(seed=2))
L2 = L + 0.32 * wetL; R2 = R + 0.32 * wetR

# ---------- duck under VO ----------
vo = np.frombuffer(sys.stdin.buffer.read(), dtype=np.float32).astype(np.float64)
vo_full = np.zeros(N); i0 = int(OFF * SR); vo_full[i0:i0 + len(vo)] = vo[: N - i0]
w = 441
env = np.sqrt(np.convolve(vo_full ** 2, np.ones(w) / w, mode='same'))
envn = np.clip(env / 0.08, 0, 1)
# attack 40ms / release 350ms smoothing
g = np.zeros(N); acc = 0
aA = 1 - np.exp(-1 / (0.04 * SR)); aR = 1 - np.exp(-1 / (0.35 * SR))
for i in range(0, N):
    v = envn[i]
    acc += (aA if v > acc else aR) * (v - acc); g[i] = acc
gain = 1 - 0.42 * g
L2 *= gain; R2 *= gain
# fades
t = np.arange(N) / SR
fade = np.minimum(1, t / 0.6) * np.clip((DUR - t) / 1.2, 0, 1)
L2 *= fade; R2 *= fade
pk = max(np.abs(L2).max(), np.abs(R2).max())
L2 /= pk; R2 /= pk
st = np.stack([L2, R2], 1) * 0.89
with wave.open(sys.argv[1], 'wb') as wf:
    wf.setnchannels(2); wf.setsampwidth(2); wf.setframerate(SR)
    wf.writeframes((st * 32767).astype('<i2').tobytes())
print('ok', DUR)
