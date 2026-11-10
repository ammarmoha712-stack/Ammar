"""Synthesises the music bed + SFX and mixes it under the voice-over.
Usage: python3 sound.py <voiceover.wav 48k stereo> <out.wav>"""
import numpy as np, wave, sys
SR=48000; DUR=45.0; N=int(SR*DUR); t=np.arange(N)/SR
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
# ---- pad chords ----
chords=[(0,4.0,[38,45,50,57,62]),(4.0,10.3,[43,50,55,59,62,67]),(10.0,15.0,[45,52,57,61,64]),(14.7,19.8,[42,49,54,57,61]),
        (19.5,24.6,[43,50,55,59,62]),(24.3,31.9,[40,47,52,55,59,64]),(31.6,37.3,[45,52,57,61,64,69]),(37.0,41.4,[43,50,55,59,62,67]),(41.1,45.0,[38,50,57,62,66,69])]
for (a,b,notes) in chords:
    n=int((b-a)*SR); tt=np.arange(n)/SR; e=env(1.0,1.2,n)
    for k,m in enumerate(notes):
        f=nf(m); det=1+0.0015*(k%3-1)
        w=(np.sin(2*np.pi*f*tt)+0.35*np.sin(2*np.pi*2*f*det*tt+0.3)+0.12*np.sin(2*np.pi*3*f*tt))
        w*=0.8+0.2*np.sin(2*np.pi*(0.13+0.05*k)*tt+k)
        add(w*e/len(notes),a,pan=(k/len(notes)-0.5)*0.8,g=0.22)
n=int(3.0*SR); tt=np.arange(n)/SR
add(np.sin(2*np.pi*nf(86)*tt)*np.exp(-tt*1.5)*0.5+np.sin(2*np.pi*nf(93)*tt)*np.exp(-tt*2)*0.3,0.3,pan=0.3,g=0.06)
add(np.sin(2*np.pi*36.7*tt)*np.sin(np.pi*tt/3.0)**2,0,g=0.22)
bpm=104; beat=60/bpm
for st in np.arange(10.2,37.2,beat):
    prog=(st-10.2)/27.0
    n=int(0.45*SR); tt=np.arange(n)/SR
    add(np.sin(2*np.pi*(55+25*np.exp(-tt*30))*tt)*np.exp(-tt*10),st,g=0.09+0.10*prog)
    if prog>0.15:
        hn=int(0.06*SR); h=rng.standard_normal(hn); h=h-lp(h,6000); add(h*np.exp(-np.arange(hn)/SR*80),st+beat/2,pan=0.3,g=0.035+0.04*prog)
for i,st in enumerate([10.4,15.15,19.95,24.75,32.05]):
    for j,m in enumerate([69,73,76,81][:2+min(i,2)]):
        n=int(1.4*SR); tt=np.arange(n)/SR; f=nf(m+i)
        add((np.sin(2*np.pi*f*tt)+0.3*np.sin(2*np.pi*2*f*tt))*np.exp(-tt*3.5),st+j*0.12,pan=0.2*(j-1),g=0.055)
def whoosh(d=0.8):
    n=int(d*SR); x=rng.standard_normal(n); x=lp(x,2500); tt=np.linspace(0,1,n); return x*np.sin(np.pi*tt)**2
for st in [3.8,9.85,14.7,19.5,24.3,31.6,36.95,41.4]: add(whoosh(0.85),st,pan=0.2,g=0.10)
def tick(f=1600):
    n=int(0.12*SR); tt=np.arange(n)/SR; return (np.sin(2*np.pi*f*tt)+0.4*np.sin(2*np.pi*f*1.5*tt))*np.exp(-tt*45)
for st in [11.45,12.6,12.9,13.2,15.95,16.55,25.6,25.95,26.3,26.65,27.0,27.35,27.5,32.95,33.25,33.55,33.85,41.9,42.02,42.14]+[20.55+0.25*k for k in range(8)]+[28.9+0.3*k for k in range(5)]:
    add(tick(1500 if st<36 else 1900),st,pan=0.25,g=0.05)
def clink(f0=2400):
    n=int(0.5*SR); tt=np.arange(n)/SR
    return sum(a*np.sin(2*np.pi*f0*r*tt)*np.exp(-tt*d) for r,a,d in [(1,1,14),(1.48,.6,18),(2.31,.35,22)])
for st in [5.35,6.2,6.75,7.4,10.75,15.5,20.3,25.1,32.4,38.5,39.8]: add(clink(),st,pan=0.15,g=0.035)
# camera shutter for marketing
n=int(0.15*SR); x=rng.standard_normal(n); x=x-lp(x,3000); add(x*np.exp(-np.arange(n)/SR*40),11.3,g=0.12)
def ding(f0):
    n=int(0.9*SR); tt=np.arange(n)/SR; return (np.sin(2*np.pi*f0*tt)+.5*np.sin(2*np.pi*f0*1.5*tt))*np.exp(-tt*5)
for st in [17.55,23.5,30.0,36.15]: add(ding(nf(84)),st,g=0.06)
def sweep(d=1.1,f0=500,f1=2200):
    n=int(d*SR); tt=np.arange(n)/SR; f=f0+(f1-f0)*tt/d; return np.sin(2*np.pi*np.cumsum(f)/SR)*np.sin(np.pi*tt/d)**2*0.5
for st,d in [(15.75,1.2),(27.75,1.0),(32.35,1.8),(34.95,1.3)]: add(sweep(d),st,g=0.03)
n=int(2.2*SR); tt=np.arange(n)/SR
add(lp(rng.standard_normal(n),700)*np.sin(np.pi*tt/2.2)**2*0.8,40.05,g=0.10)
def bell(f0,d=3.5):
    n=int(d*SR); tt=np.arange(n)/SR; s=np.zeros(n)
    for r,a,dc in [(1,1,2.2),(2.0,.5,3.2),(3.0,.25,4.5),(4.2,.12,6)]: s+=a*np.sin(2*np.pi*f0*r*tt)*np.exp(-tt*dc)
    return s
add(bell(nf(74)),1.0,g=0.04); add(bell(nf(81)),4.3,g=0.05); add(bell(nf(78)),40.1,pan=-0.15,g=0.05)
add(bell(nf(81)),41.35,pan=0.15,g=0.07); add(bell(nf(86)),41.45,pan=-0.15,g=0.05); add(bell(nf(74),3.5),42.6,g=0.05)
# ---- master bed: fade in/out ----
fade=np.ones(N); fade[:int(.6*SR)]=np.linspace(0,1,int(.6*SR)); fade[-int(1.5*SR):]=np.linspace(1,0,int(1.5*SR))
L*=fade; R*=fade
# ---- voice + ducking ----
w=wave.open(sys.argv[1]); vo=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).reshape(-1,2).astype(float)/32768
V=np.zeros((N,2))
# splice VO: (orig_start, orig_end, offset) -> adds breathing room between the five services
for a,b,off in [(0,9.15,0.8),(9.15,13.08,1.4),(13.08,17.3,2.0),(17.3,21.52,2.6),(21.52,28.15,3.2),(28.15,33.0,3.8),(33.0,37.56,4.4)]:
    seg=vo[int(a*SR):int(b*SR)]; i=int((a+off)*SR); j=min(N,i+len(seg)); V[i:j]+=seg[:j-i]
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
