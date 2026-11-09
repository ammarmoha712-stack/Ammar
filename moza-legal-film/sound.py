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
chords=[(0,4.6,[50,57,62,64,69]),(4.3,9.0,[46,53,58,62,65]),(8.8,13.4,[41,53,57,60,64]),
        (13.1,20.3,[50,57,60,62,65]),(20.0,26.4,[43,55,58,62,67]),(26.1,31.0,[41,53,57,60,64,69]),
        (30.7,36.9,[46,53,58,62,65,69]),(36.6,44.0,[38,50,57,62,66,69])]
for (a,b,notes) in chords:
    n=int((b-a)*SR); tt=np.arange(n)/SR; e=env(1.2,1.4,n)
    for k,m in enumerate(notes):
        f=nf(m); det=1+0.0015*(k%3-1)
        w=(np.sin(2*np.pi*f*tt)+0.35*np.sin(2*np.pi*2*f*det*tt+0.3)+0.12*np.sin(2*np.pi*3*f*tt))
        w*=0.8+0.2*np.sin(2*np.pi*(0.13+0.05*k)*tt+k)
        add(w*e/len(notes),a,pan=(k/len(notes)-0.5)*0.8,g=0.22)
# ---- soft pulse during penalties ----
for k,st in enumerate(np.arange(13.4,25.8,60/84)):
    n=int(0.5*SR); tt=np.arange(n)/SR
    g=0.10 if st<20 else 0.16
    add(np.sin(2*np.pi*(52+20*np.exp(-tt*30))*tt)*np.exp(-tt*9),st,g=g)
# ---- gentle arpeggio pluck in closing ----
for k,(st,m) in enumerate([(31.0,74),(31.7,77),(32.4,81),(33.4,79),(34.1,77),(34.8,74),(35.5,77),(37.0,81),(37.7,78),(38.4,74),(39.0,78),(40.45,81),(41.5,86)]):
    n=int(1.6*SR); tt=np.arange(n)/SR; f=nf(m)
    add((np.sin(2*np.pi*f*tt)+0.3*np.sin(2*np.pi*2*f*tt))*np.exp(-tt*3.2),st,pan=0.3*np.sin(k),g=0.05)
# ---- SFX ----
def whoosh(d=0.8,hi=True):
    n=int(d*SR); x=rng.standard_normal(n); x=lp(x,2500 if hi else 900)
    tt=np.linspace(0,1,n); return x*np.sin(np.pi*tt)**2
for st in [4.2,12.9,25.9,30.4,36.3]: add(whoosh(0.85),st,pan=0.2,g=0.10)
def paper(d=0.45):
    n=int(d*SR); x=rng.standard_normal(n)*(rng.random(n)>0.6)
    x=x-lp(x,1500); tt=np.linspace(0,1,n); return x*np.sin(np.pi*tt)*np.exp(-tt*2)
for st in [0.05,1.75,2.0,4.35,30.75]: add(paper(),st,pan=-0.2,g=0.10)
def tick(f=1600):
    n=int(0.12*SR); tt=np.arange(n)/SR
    return (np.sin(2*np.pi*f*tt)+0.4*np.sin(2*np.pi*f*1.5*tt))*np.exp(-tt*45)
for st in [4.6,7.1,7.8,8.5,10.0,10.6,13.25,16.25,17.85,18.6,19.25,21.3,27.15,29.15,29.7,31.35,31.57,31.79,32.0,32.2,41.0,41.2,41.32,41.44,41.56]:
    add(tick(1500 if st<30 else 1900),st,pan=0.25,g=0.06)
def line_sweep(d=1.2):
    n=int(d*SR); tt=np.arange(n)/SR; f=600+1600*tt/d
    return np.sin(2*np.pi*np.cumsum(f)/SR)*np.sin(np.pi*tt/d)**2*0.5
for st in [0.7,6.5]: add(line_sweep(),st,g=0.03)
# impact for penalty panel
n=int(1.8*SR); tt=np.arange(n)/SR
add(np.sin(2*np.pi*(45+40*np.exp(-tt*8))*tt)*np.exp(-tt*2.2)+lp(rng.standard_normal(n),300)*np.exp(-tt*6)*0.6,20.3,g=0.30)
add(np.sin(2*np.pi*(45+40*np.exp(-tt*8))*tt)*np.exp(-tt*2.5),23.85,g=0.16)
# chimes (logo + final)
def bell(f0,d=3.5):
    n=int(d*SR); tt=np.arange(n)/SR; s=np.zeros(n)
    for r,a,dc in [(1,1,2.2),(2.0,.5,3.2),(3.0,.25,4.5),(4.2,.12,6)]: s+=a*np.sin(2*np.pi*f0*r*tt)*np.exp(-tt*dc)
    return s
add(bell(nf(81)),36.75,pan=-0.15,g=0.07); add(bell(nf(86)),36.85,pan=0.15,g=0.05)
add(bell(nf(74),5),40.42,g=0.06); add(bell(nf(81),5),40.5,pan=0.2,g=0.04); add(bell(nf(78),5),40.58,pan=-0.2,g=0.04)
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
