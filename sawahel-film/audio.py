# Generates original score + SFX and mixes the client VO onto the 45 s timeline.
import numpy as np, wave
SR=48000; DUR=45.0; N=int(SR*DUR)
rng=np.random.default_rng(3)
L=np.zeros(N); R=np.zeros(N)
def n2f(n): return 440*2**((n-69)/12)
def add(sig,t,pan=0.0,gain=1.0):
    i=int(t*SR); j=min(N,i+len(sig)); s=sig[:j-i]*gain
    L[i:j]+=s*np.sqrt((1-pan)/2); R[i:j]+=s*np.sqrt((1+pan)/2)
def env(n,a,r):
    t=np.arange(n)/SR; e=np.minimum(1,t/max(a,1e-4)); return e*np.exp(-t/r)
def pluck(note,dur=1.2,bright=1.0):
    n=int(dur*SR); t=np.arange(n)/SR; f=n2f(note)
    s=np.sin(2*np.pi*f*t)+.35*bright*np.sin(2*np.pi*2*f*t)*np.exp(-t*6)+.12*np.sin(2*np.pi*3.01*f*t)*np.exp(-t*10)
    return s*env(n,.004,.32)
def bell(note,dur=3.0):
    n=int(dur*SR); t=np.arange(n)/SR; f=n2f(note)
    s=np.sin(2*np.pi*f*t)+.5*np.sin(2*np.pi*2.76*f*t)*np.exp(-t*2.5)+.25*np.sin(2*np.pi*5.4*f*t)*np.exp(-t*5)
    return s*env(n,.002,1.1)
def pad(notes,dur,att=1.0,rel=1.5):
    n=int(dur*SR); t=np.arange(n)/SR; s=np.zeros(n)
    for nt in notes:
        for d in (-.07,.0,.07):
            f=n2f(nt+d*0.1)*(1+d*0.004); s+=np.sin(2*np.pi*f*t+rng.random()*6)+.25*np.sin(2*np.pi*2*f*t)
    e=np.minimum(1,t/att)*np.minimum(1,(dur-t)/rel).clip(0,1)
    return s*e/len(notes)/3
def bass(note,dur):
    n=int(dur*SR); t=np.arange(n)/SR; f=n2f(note)
    return (np.sin(2*np.pi*f*t)+.3*np.sin(2*np.pi*2*f*t))*env(n,.01,dur*.6)
def tick(hi=True):
    n=int(.05*SR); t=np.arange(n)/SR; f=3200 if hi else 2400
    return np.sin(2*np.pi*f*t)*np.exp(-t*160)+.4*rng.standard_normal(n)*np.exp(-t*400)
def kick():
    n=int(.35*SR); t=np.arange(n)/SR; f=48+90*np.exp(-t*30)
    return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*9)
def shaker():
    n=int(.08*SR); t=np.arange(n)/SR; s=rng.standard_normal(n); s=np.diff(s,prepend=0)
    return s*np.exp(-t*60)*.5
def whoosh(dur=1.4,peak=.6):
    n=int(dur*SR); t=np.arange(n)/SR; s=rng.standard_normal(n)
    # sweeping one-pole lowpass
    out=np.zeros(n); y=0; cut=200+3800*np.sin(np.pi*np.clip(t/dur,0,1))**2
    a=np.exp(-2*np.pi*cut/SR)
    for i in range(n): y=a[i]*y+(1-a[i])*s[i]; out[i]=y
    e=np.sin(np.pi*np.clip(t/dur,0,1))**1.5
    return out*e*3
beat=60/96
# chord progression (D major): D, Bm, G, A  — MIDI roots
prog=[[62,66,69,74],[59,62,66,71],[55,62,67,71],[57,61,64,69]]
roots=[38,35,31,33]
# ── 0–12: playful pluck arp + ticks
arp=[74,78,81,78,76,81,79,76]
t=0.25; k=0
while t<11.85:
    speed=1.0 if t<6 else (1.5 if t<9 else 2.0)
    ch=prog[int(t/ (beat*4))%4]
    note=ch[k%4]+12
    add(pluck(note,.9),t,pan=.4*np.sin(k*1.3),gain=.16 if t<6 else .19)
    k+=1; t+=beat/2/speed*1.0
# clock ticks: accelerate
t=0.3; per=.5
while t<11.9:
    add(tick(int(t/per)%2==0),t,pan=-.2,gain=.10); per=.5 if t<5 else max(.18,.5-(t-5)*.05); t+=per
for t0 in np.arange(0,12,beat*4):
    i=int(t0/(beat*4))%4
    add(pad(prog[i],beat*4+.6,.4,.6),t0,gain=.10 if t0<6 else .13)
for t0 in np.arange(6.0,11.9,beat):
    add(kick(),t0,gain=.22); add(shaker(),t0+beat/2,pan=.3,gain=.12)
    i=int(t0/(beat*4))%4; add(bass(roots[i]+12,beat*.9),t0,gain=.16)
# hard cut (freeze) with short fade — music silence 11.95–12.6
c0,c1=int(11.85*SR),int(12.0*SR); fade=np.linspace(1,0,c1-c0)
for ch in (L,R): ch[c0:c1]*=fade; ch[c1:int(12.6*SR)]=0
# ── turning point whoosh + chimes
add(whoosh(1.6),12.45,pan=-.3,gain=.32)
for i,nt in enumerate([74,78,81,86]): add(bell(nt),13.0+i*.18,pan=-.4+i*.25,gain=.09)
add(pad([62,69,74,78],5.6,2.0,1.5),12.7,gain=.16)
# ── 18–36 warm uplifting section
t0=18.0; j=0
while t0<35.6:
    i=j%4
    add(pad(prog[i],beat*4+.8,.6,.9),t0,gain=.14)
    add(bass(roots[i]+12,beat*3.5),t0,gain=.2)
    for b in range(4):
        tb=t0+b*beat
        if tb<35.6:
            add(kick(),tb,gain=.17 if b%2==0 else .1)
            add(shaker(),tb+beat/2,pan=.35,gain=.08)
            for s in range(2):
                add(pluck(prog[i][(b*2+s)%4]+12,.7,.7),tb+s*beat/2,pan=.5*np.sin(b+s),gain=.08)
    t0+=beat*4; j+=1
# room transition swell + ribbon whoosh
add(whoosh(1.2),27.4,pan=.3,gain=.18)
add(whoosh(1.6),35.2,pan=-.2,gain=.30)
# ── final reveal 36–45
add(pad([62,66,69,74,78],9.0,1.0,2.5),36.0,gain=.17)
add(bass(38,4),36.2,gain=.18)
for i,nt in enumerate([74,78,81]): add(bell(nt,3),37.7+i*.16,pan=-.3+i*.3,gain=.12)
add(bell(86,4),38.25,gain=.13)
add(pad([55,62,67,71],3.2,.8,1.0),39.8,gain=.12); add(bass(31,3),39.8,gain=.15)
add(pad([57,61,64,69],1.8,.4,.8),41.4,gain=.11)
# sonic signature after VO
for i,nt in enumerate([69,74,78,81,86]): add(bell(nt,3.5),43.0+i*.11,pan=-.4+i*.2,gain=.10)
add(pad([50,62,66,69,74],2.2,.1,1.6),42.8,gain=.18); add(kick(),43.0,gain=.2)
# ── reverb (convolution)
irn=int(2.2*SR); ir=rng.standard_normal(irn)*np.exp(-np.arange(irn)/SR/0.55); ir/=np.abs(ir).sum()/12
def conv(x): 
    n=len(x)+irn; F=1<<(n-1).bit_length(); return np.fft.irfft(np.fft.rfft(x,F)*np.fft.rfft(ir,F),F)[:len(x)]
L2=L+.35*conv(L); R2=R+.35*conv(np.roll(R,240))
# keep the freeze silent (allow just a soft tail)
s0,s1=int(12.05*SR),int(12.45*SR); 
for ch in (L2,R2): ch[s0:s1]*=np.linspace(.4,.05,s1-s0)
# ── VO placement
w=wave.open('assets/vo.wav'); vo=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(float)/32768
segs=[(0.0,3.70,0.6),(3.75,8.35,6.5),(8.40,10.50,13.0),(10.55,20.42,18.4),(20.47,28.40,28.3),(28.45,31.01,41.75)]
V=np.zeros(N)
for a,b,at in segs:
    x=vo[int(a*SR):int(b*SR)].copy(); f=int(.03*SR); x[:f]*=np.linspace(0,1,f); x[-f:]*=np.linspace(1,0,f)
    i=int(at*SR); V[i:i+len(x)]+=x
# ducking envelope from VO activity
def mavg(x,n):
    c=np.cumsum(np.concatenate([np.zeros(n//2+1),x,np.zeros(n)]));return (c[n:n+len(x)]-c[:len(x)])/n
act=mavg((np.abs(V)>0.01).astype(float),int(.25*SR))>0.02
sm=mavg(act.astype(float),int(.3*SR))
duck=1-0.45*sm
mL=L2*duck; mR=R2*duck
music_peak=max(np.abs(mL).max(),np.abs(mR).max()); mL/=music_peak; mR/=music_peak
vo_gain=0.92/np.abs(V).max()
outL=.42*mL+V*vo_gain; outR=.42*mR+V*vo_gain
# fades
fi=int(.15*SR); fo=int(1.2*SR)
for ch in (outL,outR): ch[:fi]*=np.linspace(0,1,fi); ch[-fo:]*=np.linspace(1,0,fo)
pk=max(np.abs(outL).max(),np.abs(outR).max()); outL*=.95/pk; outR*=.95/pk
st=(np.stack([outL,outR],1)*32767).astype(np.int16)
o=wave.open('assets/mix.wav','wb'); o.setnchannels(2); o.setsampwidth(2); o.setframerate(SR); o.writeframes(st.tobytes()); o.close()
print('ok')
