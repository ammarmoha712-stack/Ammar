import numpy as np, sys, wave
SR = 44100
OFF = 0.5
DUR = 40.0
N = int(SR * DUR)
L = np.zeros(N); R = np.zeros(N)
SL = np.zeros(N); SR_ = np.zeros(N)   # sfx bus (not reverbed much, not ducked)
rng = np.random.default_rng(11)
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


def sfx(sig, t0, pan=0.0, gain=1.0):
    i0 = int(t0 * SR)
    if i0 >= N or i0 < 0: return
    sig = sig[: N - i0]
    l = np.cos((pan + 1) * np.pi / 4); r = np.sin((pan + 1) * np.pi / 4)
    SL[i0:i0 + len(sig)] += sig * gain * l; SR_[i0:i0 + len(sig)] += sig * gain * r

def pluck(m, dur, vel=0.6):
    f = midi(m); n = int(SR * (dur + 1.2)); t = np.arange(n) / SR
    s = np.sin(2*np.pi*f*t) + 0.35*np.sin(2*np.pi*2*f*t)*np.exp(-t*9) + 0.18*np.sin(2*np.pi*3*f*t)*np.exp(-t*14)
    return s * np.exp(-t*3.2) * np.minimum(1, t/0.003) * vel * 0.17

def clap():
    n = int(SR*0.25); t = np.arange(n)/SR; x = rng.normal(0,1,n)
    y = np.diff(np.concatenate([[0], x]))
    env = np.exp(-t*30) + 0.6*np.exp(-np.maximum(0,t-0.012)*35)*(t>0.012)
    return y*env*0.04

def click():
    n = int(SR*0.03); t = np.arange(n)/SR
    return (np.sin(2*np.pi*2400*t)*np.exp(-t*260) + rng.normal(0,0.3,n)*np.exp(-t*500)) * 0.12

def popfx(f=900):
    n = int(SR*0.12); t = np.arange(n)/SR
    ff = f*(1+1.2*np.exp(-t*40)); ph = 2*np.pi*np.cumsum(ff)/SR
    return np.sin(ph)*np.exp(-t*28)*0.10

def noise_sweep(dur, lo, hi, gain, shape='up'):
    n = int(SR*dur); t = np.arange(n)/SR; x = rng.normal(0,1,n); y = np.zeros(n); acc = 0.0
    for i in range(n):
        u = i/n; a = lo + (hi-lo)*(u if shape=='up' else 1-u); acc += a*(x[i]-acc); y[i] = acc
    env = np.sin(np.pi*np.clip(t/dur,0,1))**1.5
    return y*env*gain

def chime(ms, vel=0.5):
    out = np.zeros(int(SR*3.5))
    for k, m in enumerate(ms):
        b = bell(m, 3.0, vel); i = int(k*0.06*SR); out[i:i+len(b)] += b[:len(out)-i]
    return out

# ---------- music: warm, optimistic (G major, 96 BPM) ----------
BPM = 96; beat = 60/BPM; bar = 4*beat
CH = {'G': (43, [59, 62, 67, 71], [67, 71, 74, 79]), 'D': (38, [57, 62, 66, 69], [66, 69, 74, 78]),
      'Em': (40, [59, 64, 67, 71], [67, 71, 76, 79]), 'C': (36, [60, 64, 67, 72], [67, 72, 76, 79]),
      'Am': (45, [57, 60, 64, 69], [64, 69, 72, 76]), 'Dsus': (38, [57, 62, 67, 69], [67, 69, 74, 79])}
prog = ['G','D','Em','C','G','D','C','Dsus','Em','C','G','D','Am','C','Dsus','D']
pat = [0, 2, 1, 3, 2, 1, 3, 2]
nb = int(np.ceil(DUR/bar))
for b in range(nb):
    t0 = b*bar
    if t0 > 37.3: break
    name = prog[b % len(prog)]; root, voi, pool = CH[name]
    calm = t0 >= 30.4
    add(pad(voi, bar*1.02, att=0.8), t0, pan=-0.1, gain=0.8)
    add(bass(root, bar*0.48), t0, gain=0.9); add(bass(root, bar*0.45), t0 + 2*beat, gain=0.7)
    for i in range(8):
        if calm and i % 2: continue
        m = pool[pat[i] % len(pool)]
        add(pluck(m, beat*0.5, 0.55 + 0.12*(i==0) + rng.uniform(-0.05,0.05)), t0 + i*beat/2 + rng.uniform(0,0.006), pan=0.3*np.sin(i*1.3))
    if b % 2 == 0 and not calm:
        add(piano(pool[-1]+12, beat*1.2, 0.3), t0 + 3*beat, pan=0.3)
    if 1.0 <= t0 < 30.3:
        for k in range(4):
            if k in (0, 2): add(kick(), t0 + k*beat, gain=0.75)
            if k in (1, 3): add(clap(), t0 + k*beat, pan=0.1, gain=0.8)
        for k in range(8): add(tick(), t0 + k*beat/2, pan=0.4 if k%2 else -0.4, gain=0.8 if k%2 else 0.5)

# transitions (film time)
for tc in (7.95, 12.6, 14.7, 16.8, 19.7, 28.45):
    add(swell(0.9), tc - 0.85, gain=0.9)

# sonic logo at end-card reveal and final chime
T_LOGO = 30.7
for m, dt in ((67, 0), (71, 0.07), (74, 0.14), (79, 0.21)): add(bell(m, 4.0, 0.5), T_LOGO + dt, pan=(m-73)/12)
add(bass(31, 2.0), T_LOGO, gain=1.2); add(pad([55, 59, 62, 67, 71], 2.0, att=0.3, relt=2.0), T_LOGO, gain=1.0)
T_END = 37.25
add(pad([55, 62, 67, 71, 74], 2.2, att=0.25, relt=1.5), T_END, gain=1.0)
for m, dt in ((74, 0), (79, 0.09), (83, 0.18)): add(bell(m, 3.0, 0.45), T_END + dt, pan=(m-78)/10)

# ---------- SFX (visual time + OFF) ----------
o = OFF
tt = 2.95
while tt < 4.7:
    sfx(click(), tt + o + rng.uniform(-0.01,0.01), pan=rng.uniform(-0.1,0.1), gain=0.9); tt += 0.105 + rng.uniform(-0.02,0.03)
sfx(noise_sweep(0.45, 0.02, 0.25, 0.05), 4.8 + o)
for tp in (5.15, 5.27, 5.39): sfx(popfx(700), tp + o, gain=0.7)
sfx(popfx(1100), 5.75 + o, gain=1.0)
sfx(click(), 6.62 + o, gain=1.4); sfx(popfx(1300), 6.66 + o, gain=0.6)
sfx(noise_sweep(0.5, 0.03, 0.3, 0.07), 6.95 + o)
sfx(noise_sweep(0.9, 0.02, 0.12, 0.05, 'down'), 9.75 + o)
th = popfx(160); sfx(th*2.2, 12.6 + o, gain=1.0)
sfx(noise_sweep(1.0, 0.04, 0.15, 0.05), 12.6 + o)
sfx(noise_sweep(0.5, 0.05, 0.12, 0.08, 'down'), 15.55 + o, pan=0.0)
amb = noise_sweep(3.0, 0.01, 0.02, 0.05); sfx(amb, 16.3 + o, gain=0.6)
sfx(noise_sweep(0.35, 0.1, 0.4, 0.06), 19.6 + o)
for tp in (20.15, 20.37, 20.59): sfx(noise_sweep(0.3, 0.05, 0.35, 0.06), tp + o, pan=rng.uniform(-0.3,0.3))
sfx(chime([79, 83, 86], 0.35), 26.45 + o)
sfx(noise_sweep(0.6, 0.03, 0.3, 0.06), 30.0 + o)
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
L2 = L + 0.28 * wetL + SL + 0.1 * conv(SL, ir(seed=3)); R2 = R + 0.28 * wetR + SR_ + 0.1 * conv(SR_, ir(seed=4))

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
gain = 1 - 0.40 * g
L2 *= gain; R2 *= gain
# fades
t = np.arange(N) / SR
fade = np.minimum(1, t / 0.3) * np.clip((DUR - t) / 1.0, 0, 1)
L2 *= fade; R2 *= fade
pk = max(np.abs(L2).max(), np.abs(R2).max())
L2 /= pk; R2 /= pk
st = np.stack([L2, R2], 1) * 0.89
with wave.open(sys.argv[1], 'wb') as wf:
    wf.setnchannels(2); wf.setsampwidth(2); wf.setframerate(SR)
    wf.writeframes((st * 32767).astype('<i2').tobytes())
print('ok', DUR)
