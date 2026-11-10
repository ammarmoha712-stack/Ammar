"""Synthesises the music bed + SFX and mixes it under the voice-over.
Usage: python3 sound.py <voiceover.wav 48k stereo> <out.wav>"""
import numpy as np, wave, sys
SR=48000; DUR=65.0; N=int(SR*DUR); t=np.arange(N)/SR
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
MAP=[[0,0],[0.3,0.25],[2.95,2.2],[4.87,4.64],[9.0,9.1],[9.3,9.5],[9.9,10.25],[12.6,12.55],[20.8,14.65],[21.3,14.85],[21.75,15.0],[24.9,17.8],[29.2,21.2],[32.0,24.8],[32.4,24.9],[32.8,25.3],[35.4,28.6],[36.7,30.9],[38.2,32.9],[38.6,33.0],[39.0,34.0],[41.72,36.45],[44.03,38.2],[45.7,39.7],[47.6,41.7],[48.0,41.75],[48.4,42.07],[49.9,44.25],[51.4,46.57],[54.6,52.45],[55.0,52.6],[65,62.6]]
def inv(o):
    for k in range(1,len(MAP)):
        if o<=MAP[k][1]:
            (a,A),(b,B)=MAP[k-1],MAP[k]; return a+(b-a)*(o-A)/(B-A) if B>A else a
    return o+2.4
def add(sig,start,pan=0.0,g=1.0,raw=False):
    if not raw: start=inv(start)
    i=int(start*SR); j=min(N,i+len(sig)); s=sig[:j-i]*g
    L[i:j]+=s*np.sqrt((1-pan)/2); R[i:j]+=s*np.sqrt((1+pan)/2)
# ---- pad chords ----
chords=[(0,4.6,[38,45,50,53,57]),(4.3,9.6,[34,46,53,57,62]),(9.3,15.0,[41,48,53,57,60,64]),(14.7,20.9,[38,45,50,53,57,62]),
        (20.6,25.2,[43,50,55,58,62]),(24.9,29.0,[38,45,50,53,57]),(28.8,33.3,[34,46,53,57,62]),(33.0,37.5,[36,48,55,60,64]),
        (37.2,42.0,[41,48,53,57,60,65]),(41.8,47.0,[38,45,50,53,57,62]),(46.8,52.8,[34,46,50,53,58,62]),
        (52.5,58.6,[36,48,52,55,60,64]),(58.3,65.0,[41,48,53,57,60,64,69])]
for (a,b,notes) in chords:
    a,b=inv(a),inv(b)
    n=int((b-a)*SR); tt=np.arange(n)/SR; e=env(1.2,1.4,n)
    for k,m in enumerate(notes):
        f=nf(m); det=1+0.0015*(k%3-1)
        w=(np.sin(2*np.pi*f*tt)+0.35*np.sin(2*np.pi*2*f*det*tt+0.3)+0.12*np.sin(2*np.pi*3*f*tt))
        w*=0.8+0.2*np.sin(2*np.pi*(0.13+0.05*k)*tt+k)
        add(w*e/len(notes),a,pan=(k/len(notes)-0.5)*0.8,g=0.22,raw=True)
# cinematic intro: low swell + shimmer
n=int(3.5*SR); tt=np.arange(n)/SR
add(np.sin(2*np.pi*36.7*tt)*np.sin(np.pi*tt/3.5)**2,0,g=0.25)
add(lp(rng.standard_normal(n),900)*np.sin(np.pi*tt/3.5)**2,0,g=0.06)
# gradual build: soft pulse from services onwards
bpm=88; beat=60/bpm
for st in np.arange(21.3,54.6,beat):
    prog=(st-21.3)/33.3
    n=int(0.45*SR); tt=np.arange(n)/SR
    add(np.sin(2*np.pi*(52+22*np.exp(-tt*30))*tt)*np.exp(-tt*10),st,g=0.05+0.12*prog,raw=True)
    if prog>0.3:
        hn=int(0.05*SR); h=rng.standard_normal(hn); h=h-lp(h,6000); add(h*np.exp(-np.arange(hn)/SR*90),st+beat/2,pan=0.3,g=0.03+0.04*prog,raw=True)
# arpeggio motif at service reveals
for i,st in enumerate([25.3,28.6,30.9,34.0,36.45,38.2,39.7]):
    for j,m in enumerate([69,72,76]):
        n=int(1.3*SR); tt=np.arange(n)/SR; f=nf(m+(i%3)*2)
        add((np.sin(2*np.pi*f*tt)+0.3*np.sin(2*np.pi*2*f*tt))*np.exp(-tt*3.5),st+j*0.1,pan=0.25*(j-1),g=0.045)
# ---- SFX ----
def whoosh(d=0.8):
    n=int(d*SR); x=rng.standard_normal(n); x=lp(x,2500); tt=np.linspace(0,1,n); return x*np.sin(np.pi*tt)**2
for st in [9.1,14.7,24.85,32.95,41.7]: add(whoosh(0.85),st,pan=-0.2,g=0.10)
add(whoosh(0.9),54.6,pan=-0.2,g=0.10,raw=True)
def paper(d=0.45):
    n=int(d*SR); x=rng.standard_normal(n)*(rng.random(n)>0.6); x=x-lp(x,1500); tt=np.linspace(0,1,n); return x*np.sin(np.pi*tt)*np.exp(-tt*2)
for st in [2.2,2.6,15.7,16.1,26.7,33.2,41.95,42.2]: add(paper(),st,pan=0.2,g=0.11)
def metal(f0=1800):
    n=int(1.2*SR); tt=np.arange(n)/SR
    return sum(a*np.sin(2*np.pi*f0*r*tt)*np.exp(-tt*d) for r,a,d in [(1,1,5),(1.47,.6,7),(2.09,.4,9),(2.76,.25,12)])
for st in [0.35,1.6]: add(metal(1400),st,pan=0.1,g=0.04)
add(metal(1400),55.2,pan=0.1,g=0.04,raw=True)
def gavel():
    n=int(0.9*SR); tt=np.arange(n)/SR
    return np.sin(2*np.pi*(120+80*np.exp(-tt*40))*tt)*np.exp(-tt*14)+lp(rng.standard_normal(n),2500)*np.exp(-tt*35)*1.2
add(gavel(),25.5,g=0.35); add(gavel(),16.3,g=0.12)
def tick(f=1600):
    n=int(0.12*SR); tt=np.arange(n)/SR; return (np.sin(2*np.pi*f*tt)+0.4*np.sin(2*np.pi*f*1.5*tt))*np.exp(-tt*45)
for st in [15.0,17.8,21.2,25.3,28.6,30.9,34.0,36.45,38.2,39.7,42.07,44.25,46.57]: add(tick(1700),st,pan=0.25,g=0.05)
for st in [58.5,58.65,58.8,58.95]: add(tick(1900),st,pan=0.25,g=0.05,raw=True)
def sweep(d=1.1,f0=500,f1=2200):
    n=int(d*SR); tt=np.arange(n)/SR; f=f0+(f1-f0)*tt/d; return np.sin(2*np.pi*np.cumsum(f)/SR)*np.sin(np.pi*tt/d)**2*0.5
for st,d in [(42.3,1.1),(43.45,1.1),(44.6,1.1),(49.0,1.4)]: add(sweep(d),st,g=0.03)
def bell(f0,d=3.5):
    n=int(d*SR); tt=np.arange(n)/SR; s=np.zeros(n)
    for r,a,dc in [(1,1,2.2),(2.0,.5,3.2),(3.0,.25,4.5),(4.2,.12,6)]: s+=a*np.sin(2*np.pi*f0*r*tt)*np.exp(-tt*dc)
    return s
add(bell(nf(74)),9.9,g=0.05); add(bell(nf(81)),19.6,g=0.05); add(bell(nf(77)),46.4,g=0.05); add(bell(nf(81)),47.7,pan=0.2,g=0.05)
add(bell(nf(77)),56.4,pan=-0.15,g=0.06,raw=True); add(bell(nf(84)),56.5,pan=0.15,g=0.05,raw=True)
add(bell(nf(72),5),60.05,g=0.05,raw=True); add(bell(nf(77),5),61.9,pan=0.2,g=0.05,raw=True); add(bell(nf(81),3),63.3,pan=-0.2,g=0.05,raw=True)
# ---- master bed: fade in/out ----
fade=np.ones(N); fade[:int(.6*SR)]=np.linspace(0,1,int(.6*SR)); fade[-int(1.5*SR):]=np.linspace(1,0,int(1.5*SR))
L*=fade; R*=fade
# ---- voice + ducking ----
w=wave.open(sys.argv[1]); vo=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).reshape(-1,2).astype(float)/32768
V=np.zeros((N,2))
for a,b,off in [(0,8.77,0.3),(8.77,20.25,0.8),(20.25,30.86,1.3),(30.86,36.33,1.8),(36.33,45.24,2.3),(45.24,54.52,10.0)]:
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
