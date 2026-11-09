"""Synthesises the music bed + SFX and mixes it under the voice-over.
Usage: python3 sound.py <voiceover.wav 48k stereo> <out.wav>"""
import numpy as np, wave, sys
SR=48000; DUR=44.0; N=int(SR*DUR); t=np.arange(N)/SR
rng=np.random.default_rng(7)
def nf(n): return 440*2**((n-69)/12)
def env(a,d,length):
    e=np.ones(length); A=int(a*SR); D=int(d*SR)
    if A: e[:A]=np.linspace(0,1,A)
    if D: e[-D:]*=np.linspace(1,0,D)
    return e
def lp(x,fc):
    a=np.exp(-2*np.pi*fc/SR); y=np.zeros_like(x); s=0.0
    # vectorised one-pole via lfilter-like loop in chunks
    for i in range(len(x)): s=(1-a)*x[i]+a*s; y[i]=s
    return y
L=np.zeros(N); R=np.zeros(N)
def add(sig,start,pan=0.0,g=1.0):
    i=int(start*SR); j=min(N,i+len(sig)); s=sig[:j-i]*g
    L[i:j]+=s*np.sqrt((1-pan)/2); R[i:j]+=s*np.sqrt((1+pan)/2)
# ---- pad chords (start, end, midi notes) ----
chords=[(0,2.6,[45,52,57,60,64]),(2.3,6.8,[41,48,57,60,65]),(6.5,11.2,[45,52,57,60,64]),(10.9,15.9,[43,50,55,59,62]),
        (15.7,20.9,[41,48,53,57,60,64]),(20.7,25.5,[38,45,53,57,62]),(25.3,30.0,[40,47,52,56,59,64]),
        (29.8,34.6,[41,48,57,60,64,69]),(34.4,44.0,[45,52,57,61,64,69])]
for (a,b,notes) in chords:
    n=int((b-a)*SR); tt=np.arange(n)/SR; e=env(1.0,1.2,n)
    for k,m in enumerate(notes):
        f=nf(m); det=1+0.0015*(k%3-1)
        w=(np.sin(2*np.pi*f*tt)+0.35*np.sin(2*np.pi*2*f*det*tt+0.3)+0.12*np.sin(2*np.pi*3*f*tt))
        w*=0.8+0.2*np.sin(2*np.pi*(0.13+0.05*k)*tt+k)
        add(w*e/len(notes),a,pan=(k/len(notes)-0.5)*0.8,g=0.22)
# ---- mysterious intro shimmer ----
n=int(2.5*SR); tt=np.arange(n)/SR
add(np.sin(2*np.pi*nf(88)*tt)*np.exp(-tt*1.5)*0.5+np.sin(2*np.pi*nf(93)*tt)*np.exp(-tt*2)*0.3,0.45,pan=0.3,g=0.06)
# ---- progressive rhythmic build across the five checks ----
bpm=100; beat=60/bpm
for st in np.arange(6.6,29.8,beat):
    prog=(st-6.6)/23.2
    n=int(0.45*SR); tt=np.arange(n)/SR
    add(np.sin(2*np.pi*(55+25*np.exp(-tt*30))*tt)*np.exp(-tt*10),st,g=0.10+0.10*prog)
    if prog>0.2:
        hn=int(0.06*SR); h=rng.standard_normal(hn); h=h-lp(h,6000); add(h*np.exp(-np.arange(hn)/SR*80),st+beat/2,pan=0.3,g=0.04+0.04*prog)
# plucked motif per check
for i,st in enumerate([6.75,11.25,16.04,21.0,25.6]):
    for j,m in enumerate([69,72,76,81][:2+min(i,2)]):
        n=int(1.4*SR); tt=np.arange(n)/SR; f=nf(m+i)
        add((np.sin(2*np.pi*f*tt)+0.3*np.sin(2*np.pi*2*f*tt))*np.exp(-tt*3.5),st+j*0.12,pan=0.2*(j-1),g=0.06)
# ---- SFX ----
def whoosh(d=0.8,hi=True):
    n=int(d*SR); x=rng.standard_normal(n); x=lp(x,2500 if hi else 900)
    tt=np.linspace(0,1,n); return x*np.sin(np.pi*tt)**2
for st in [6.3,10.75,15.65,20.6,25.2,29.65,34.25]: add(whoosh(0.85),st,pan=0.2,g=0.10)
def paper(d=0.45):
    n=int(d*SR); x=rng.standard_normal(n)*(rng.random(n)>0.6)
    x=x-lp(x,1500); tt=np.linspace(0,1,n); return x*np.sin(np.pi*tt)*np.exp(-tt*2)
for st in [7.05,7.3,25.8,26.1]: add(paper(),st,pan=-0.2,g=0.11)
def tick(f=1600):
    n=int(0.12*SR); tt=np.arange(n)/SR
    return (np.sin(2*np.pi*f*tt)+0.4*np.sin(2*np.pi*f*1.5*tt))*np.exp(-tt*45)
for st in [13.9,14.5,15.0,22.2,22.85,23.4,28.15,28.7,29.2,40.3,40.44,40.58]+[23.0+0.17*k for k in range(6)]:
    add(tick(1500 if st<30 else 1900),st,pan=0.25,g=0.06)
# key metallic clinks (key moves / turns)
def clink(f0=2400):
    n=int(0.5*SR); tt=np.arange(n)/SR
    return sum(a*np.sin(2*np.pi*f0*r*tt)*np.exp(-tt*d) for r,a,d in [(1,1,14),(1.48,.6,18),(2.31,.35,22)])
for st in [0.55,1.45,3.95,7.1,11.6,16.4,21.35,25.95,31.55]: add(clink(),st,pan=0.15,g=0.035)
# confirmation dings
def ding(f0):
    n=int(0.9*SR); tt=np.arange(n)/SR
    return (np.sin(2*np.pi*f0*tt)+.5*np.sin(2*np.pi*f0*1.5*tt))*np.exp(-tt*5)
for st in [9.85,15.55,20.3,24.75,29.4]: add(ding(nf(84)),st,g=0.06)
# scan / blueprint sweeps
def sweep(d=1.1,f0=500,f1=2200):
    n=int(d*SR); tt=np.arange(n)/SR; f=f0+(f1-f0)*tt/d
    return np.sin(2*np.pi*np.cumsum(f)/SR)*np.sin(np.pi*tt/d)**2*0.5
for st,d in [(8.5,1.4),(12.9,1.1),(16.6,1.6)]: add(sweep(d),st,g=0.03)
# warning accent
n=int(1.2*SR); tt=np.arange(n)/SR
add(np.sin(2*np.pi*(48+30*np.exp(-tt*8))*tt)*np.exp(-tt*3)+lp(rng.standard_normal(n),300)*np.exp(-tt*7)*0.5,1.58,g=0.28)
# door opening swell + light
n=int(2.2*SR); tt=np.arange(n)/SR
add(lp(rng.standard_normal(n),700)*np.sin(np.pi*tt/2.2)**2*0.8,32.9,g=0.10)
def bell(f0,d=3.5):
    n=int(d*SR); tt=np.arange(n)/SR; s=np.zeros(n)
    for r,a,dc in [(1,1,2.2),(2.0,.5,3.2),(3.0,.25,4.5),(4.2,.12,6)]: s+=a*np.sin(2*np.pi*f0*r*tt)*np.exp(-tt*dc)
    return s
add(bell(nf(76)),33.0,pan=-0.15,g=0.05); add(bell(nf(81)),34.65,pan=0.15,g=0.07); add(bell(nf(85)),34.75,pan=-0.15,g=0.05)
add(bell(nf(69),5),38.1,g=0.06); add(bell(nf(76),5),38.2,pan=0.2,g=0.04); add(bell(nf(81),5),41.0,pan=-0.2,g=0.05)
# ---- master bed: fade in/out ----
fade=np.ones(N); fade[:int(.6*SR)]=np.linspace(0,1,int(.6*SR)); fade[-int(1.5*SR):]=np.linspace(1,0,int(1.5*SR))
L*=fade; R*=fade
# ---- voice + ducking ----
w=wave.open(sys.argv[1]); vo=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).reshape(-1,2).astype(float)/32768
V=np.zeros((N,2)); V[:min(N,len(vo))]=vo[:N]
envv=np.abs(V).mean(1); win=int(0.25*SR); envv=np.convolve(envv,np.ones(win)/win,'same')
duck=1-0.45*np.clip(envv/0.03,0,1)
bedL,bedR=L*duck,R*duck
bpk=max(np.abs(bedL).max(),np.abs(bedR).max())
bed=np.stack([bedL,bedR],1)/bpk*0.32
mix=V*1.0+bed
mix/=max(1.0,np.abs(mix).max()/0.97)
out=(mix*32767).astype(np.int16)
o=wave.open(sys.argv[2],'wb'); o.setnchannels(2); o.setsampwidth(2); o.setframerate(SR); o.writeframes(out.tobytes()); o.close()
print('ok')
