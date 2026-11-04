import numpy as np, wave
from scipy.signal import lfilter, butter, fftconvolve
SR=48000;DUR=45.0;N=int(SR*DUR);rng=np.random.default_rng(3)
def rd(f):
    w=wave.open(f);a=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768;return a
vo=rd('vo48.wav')
# VO chunks (source start,end) -> timeline start
chunks=[(0.0,3.35,0.30),(3.35,7.96,4.60),(7.96,15.45,11.40),(15.45,21.60,18.95),(21.60,25.48,25.55),(25.48,34.80,29.70),(34.80,39.81,39.55)]
V=np.zeros(N,np.float32)
for a,b,t in chunks:
    seg=vo[int(a*SR):int(b*SR)].copy();f=int(.01*SR);seg[:f]*=np.linspace(0,1,f);seg[-f:]*=np.linspace(1,0,f)
    i=int(t*SR);V[i:i+len(seg)]+=seg[:N-i]
L=np.zeros(N);R=np.zeros(N);FX=np.zeros(N)  # music stereo, fx mono->reverb
t=np.arange(N)/SR
def env(a,d,n):
    e=np.ones(n);ai=int(a*SR);e[:ai]=np.linspace(0,1,ai) if ai>0 else 1;e*=np.exp(-np.arange(n)/SR/d);return e
def add(buf,sig,at,g=1.0):
    i=int(at*SR);n=min(len(sig),N-i);
    if n>0: buf[i:i+n]+=sig[:n]*g
def lp(x,fc,o=2):b,a=butter(o,fc/(SR/2));return lfilter(b,a,x)
def hp(x,fc,o=2):b,a=butter(o,fc/(SR/2),'high');return lfilter(b,a,x)
def bp(x,lo,hi):b,a=butter(2,[lo/(SR/2),hi/(SR/2)],'band');return lfilter(b,a,x)
def boom(dur=2.5,f0=110,f1=32,g=1):
    n=int(dur*SR);tt=np.arange(n)/SR;f=f1+(f0-f1)*np.exp(-tt*9);ph=2*np.pi*np.cumsum(f)/SR
    s=np.sin(ph)*np.exp(-tt/ (dur*.35))
    s+=lp(rng.standard_normal(n),900)*np.exp(-tt*22)*.6
    return np.tanh(s*1.6)*g
def kick(g=1):
    n=int(.45*SR);tt=np.arange(n)/SR;f=45+120*np.exp(-tt*35);s=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-tt*7)
    s+=hp(rng.standard_normal(n),3000)*np.exp(-tt*120)*.15;return s*g
def hat(g=1):
    n=int(.08*SR);tt=np.arange(n)/SR;return hp(rng.standard_normal(n),7000)*np.exp(-tt*60)*g
def whoosh(dur,lo=300,hi=6000,g=1,rev=False):
    n=int(dur*SR);x=rng.standard_normal(n);tt=np.linspace(0,1,n)
    out=np.zeros(n);seg=n//24
    for k in range(24):
        fc=lo*(hi/lo)**(k/23 if not rev else 1-k/23);s=slice(k*seg,(k+1)*seg if k<23 else n)
        out[s]=bp(x,max(40,fc*.6),min(20000,fc*1.4))[s]
    e=np.sin(np.pi*tt)**2 if not rev else tt**3
    return out*e*g
def riser(dur,g=1):
    n=int(dur*SR);tt=np.arange(n)/SR;f=120*(8**(tt/dur));s=np.sin(2*np.pi*np.cumsum(f)/SR)*.25
    s+=whoosh(dur,200,9000,1,True)*.8;return s*(tt/dur)**2*g
def ping(f=880,dur=2.5,g=1):
    n=int(dur*SR);tt=np.arange(n)/SR;s=np.zeros(n)
    for m,a,d in [(1,1,1.2),(2.76,.5,.7),(5.40,.3,.4),(8.93,.15,.25)]:s+=a*np.sin(2*np.pi*f*m*tt)*np.exp(-tt/d)
    return s*np.minimum(1,tt*400)*g
def pad(f,dur,g=1,cut=900,att=1.5,rel=2):
    n=int(dur*SR);tt=np.arange(n)/SR;s=np.zeros(n)
    for det in (-.12,0,.11):
        ph=f*(1+det/100)*tt;s+=2*(ph%1)-1
    s=lp(s,cut,2)/3;e=np.minimum(1,tt/att)*np.minimum(1,(dur-tt)/rel);return s*np.clip(e,0,1)*g
def sub(f,dur,g=1):
    n=int(dur*SR);tt=np.arange(n)/SR;e=np.minimum(1,tt/.02)*np.exp(-tt*1.2);return np.sin(2*np.pi*f*tt)*e*g
def st(sig,at,g=1,pan=0):
    add(L,sig,at,g*(1-max(0,pan)));add(R,sig,at,g*(1+min(0,pan)))
# ---- drone bed
dr=(np.sin(2*np.pi*36.71*t)*.5+np.sin(2*np.pi*55.0*t)*.25)*(1+.15*np.sin(2*np.pi*.2*t))
dv=np.interp(t,[0,.3,3.2,3.3,4.6,9,11,19,27,30,39.3,44,45],[0,.5,.6,.15,.25,.5,.35,.4,.55,.4,.35,.3,0])
L+=dr*dv*.5;R+=dr*dv*.5
# ---- hook
st(boom(3,120,30),0.28,1.0)
st(ping(1320,3,.25),0.28,1,.3)
st(boom(1.6,160,45,.55),1.0,1);st(ping(1760,2,.22),1.0,1,-.2);FX[int(1*SR):int(1*SR)+len(ping(1760))]+=ping(1760)*.2
st(whoosh(1.2,250,7000,.55),2.05,1,.4);st(whoosh(1.15,400,9000,.4),2.15,1,-.4)
st(riser(1.0,.35),2.25)
# freeze: sudden cut handled by envelope later; airy tone
st(pad(146.8*2,1.4,.06,3000,.05,1),3.3)
# ---- activation
st(ping(988,3,.35),4.7,1);FX[int(4.7*SR):int(4.7*SR)+int(3*SR)]+=ping(988,3,.3)
for i,tt0 in enumerate([5.2,5.45,5.7]):st(ping(1480+i*220,1.2,.12),tt0,1,(-1)**i*.5)
st(riser(3.4,.6),5.7)
st(whoosh(1.6,300,5000,.3),6.4,1,.6);st(whoosh(1.4,300,5000,.3),7.2,1,-.6)
st(boom(3.2,140,30,1.1),9.1);st(ping(660,3.5,.3),9.1);FX[int(9.1*SR):int(9.1*SR)+int(3.5*SR)]+=ping(660,3.5,.35)
# ---- groove 9.1 -> 19 (110 bpm)
bt=60/110
chordA=[146.83,174.61,220.0,329.63];chordB=[116.54,174.61,233.08,293.66];chordC=[130.81,196.0,261.63,329.63]
def chord(ch,at,dur,g,cut=1200):
    for f in ch: st(pad(f,dur,g,cut),at,1,rng.uniform(-.4,.4))
chord(chordA,9.1,4.6,.07);chord(chordB,13.5,4.0,.07);chord(chordC,17.3,2.4,.07)
x=9.1+bt*2
while x<19.0:
    st(kick(.55),x);st(hat(.10),x+bt/2,1,.3)
    x+=bt
for tt0 in [11.35,13.4,15.55,17.3]:st(whoosh(.9,500,9000,.35),tt0-.35,1,.5);st(ping(1975,1.5,.12),tt0,1,-.3)
for k in range(10):st(ping(2637,.6,.05),17.4+k*.15,1,(k%3-1)*.6)  # polish sparkle
# ---- warranty build 19 -> 27, climax 26.85
chord(chordB,19.0,4.4,.08,900);chord(chordC,23.2,3.8,.09,1400)
for i in range(10):st(ping(880*2**(i/12*2),.8,.06),22.0+i*.48,1,(i%2-.5))
st(riser(3.2,.7),23.7)
st(boom(4,130,28,1.3),26.85);chord([146.83,220.0,293.66,349.23,440.0],26.85,3.3,.11,2200)
st(sub(36.71,3,.6),26.85);FX[int(26.85*SR):int(26.85*SR)+int(3*SR)]+=ping(587,3,.35)
x=27.3
while x<29.4: st(kick(.4),x);x+=bt*2
# ---- offer 29.3 -> 39.5
st(whoosh(1.4,200,8000,.7),29.25,1,0)
st(ping(1175,2,.2),30.6,1,.3)
chord(chordA,30.6,2.8,.07,1600);chord(chordB,33.25,3.2,.08,1800);chord(chordC,36.4,3.2,.08,1800)
x=30.6
while x<39.3:
    st(kick(.6),x);st(hat(.12),x+bt/2,1,.3);st(hat(.06),x+bt*.75,1,-.3)
    if int((x-30.6)/bt)%2==0: st(sub(36.71 if x<36.4 else 32.7,bt*1.8,.35),x)
    x+=bt
st(riser(1.6,.6),31.65)
st(boom(3,140,30,1.2),33.25);FX[int(33.25*SR):int(33.25*SR)+int(2.5*SR)]+=ping(1318,2.5,.4)
st(ping(1568,2,.22),34.9,1,.2);st(boom(1.5,120,40,.5),34.9)
# ---- finale
st(whoosh(1.2,300,7000,.45),39.0,1,-.3)
chord([146.83,220.0,293.66,369.99],39.4,5.6,.08,1500)
st(ping(1175,2.5,.16),39.8,1,-.2)
st(boom(.8,180,60,.3),43.53)
# sonic logo
st(ping(1174.66,1.6,.30),44.05,1,-.3);st(ping(1760,1.4,.30),44.28,1,.3);st(boom(1.2,90,32,.7),44.28);st(sub(36.71,.8,.5),44.28)
# reverb on FX + some of music
ir_n=int(2.8*SR);ir=rng.standard_normal((2,ir_n))*np.exp(-np.arange(ir_n)/SR*2.2);ir[:, :int(.01*SR)]*=0;ir/=np.abs(ir).sum(axis=1,keepdims=True)/8
mono=(L+R)/2
wetL=fftconvolve(FX+mono*.25,ir[0])[:N];wetR=fftconvolve(FX+mono*.25,ir[1])[:N]
L+=wetL*.35;R+=wetR*.35
# freeze silence: duck music hard 3.25->4.6 except drone/air
fz=np.interp(t,[3.2,3.27,4.5,4.7],[1,.12,.12,1]);fz[t<3.2]=1;fz[t>4.7]=1
L*=fz;R*=fz
# sidechain duck under VO
e=np.abs(V);a=np.exp(-1/(SR*.15));from scipy.signal import lfilter as lf
envv=lf([1-a],[1,-a],e);envv=np.clip(envv/ (envv.max()+1e-9)*4,0,1)
duck=1-.45*envv
L*=duck;R*=duck
# master
fade=np.ones(N);fe=int(.35*SR);fade[-fe:]=np.linspace(1,0,fe)**.5
mus=np.stack([L,R],1);mus=mus/np.abs(mus).max()*.55
vo2=hp(V,90)*1.0
mix=mus+np.stack([vo2,vo2],1)*.95
mix*=fade[:,None]
mix=np.tanh(mix*1.1)/np.tanh(1.1)
w=wave.open('mix.wav','wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR)
w.writeframes((np.clip(mix,-1,1)*32000).astype(np.int16).tobytes());w.close()
print('ok',mix.shape)
