import numpy as np, subprocess, wave
SR=44100; RATE=1.04; DUR=44.9; N=int(SR*DUR)
rng=np.random.default_rng(7)
T=lambda a: a/RATE  # audio-script time -> video time
def zeros(): return np.zeros((N,2))
def place(buf,sig,t,gain=1.0,pan=0.0):
    i=int(t*SR);
    if i>=N: return
    if sig.ndim==1: sig=np.stack([sig*(1-max(0,pan)),sig*(1+min(0,pan))],1)
    j=min(N,i+len(sig)); buf[i:j]+=sig[:j-i]*gain
def env(n,a,r):
    e=np.ones(n);A=int(a*SR);R=int(r*SR)
    if A>0:e[:A]=np.linspace(0,1,A)
    if R>0:e[-R:]*=np.linspace(1,0,R)
    return e
def fftfilt(x,lo=None,hi=None):
    X=np.fft.rfft(x);f=np.fft.rfftfreq(len(x),1/SR);m=np.ones_like(f)
    if lo: m*=1/(1+(lo/np.maximum(f,1))**4)
    if hi: m*=1/(1+(f/hi)**4)
    return np.fft.irfft(X*m,len(x))
def reverb(x,dur=2.2,wet=.3):
    n=int(dur*SR);ir=rng.standard_normal((n,2))*np.exp(-np.linspace(0,7,n))[:,None];ir[:,0]=fftfilt(ir[:,0],hi=6000);ir[:,1]=fftfilt(ir[:,1],hi=6000)
    ir/=np.sqrt((ir**2).sum(0))
    L=len(x)+n;out=np.zeros((L,2))
    for c in range(2): out[:,c]=np.fft.irfft(np.fft.rfft(x[:,c],L)*np.fft.rfft(ir[:,c],L),L)
    return x*(1-wet)+out[:len(x)]*wet*2.2
t_=lambda d: np.arange(int(d*SR))/SR
# ---------- PAD ----------
CH=[[146.83,220,277.18,329.63,369.99],[123.47,185,220,277.18,293.66],[98,146.83,185,220,246.94],[110,164.81,246.94,277.18,329.63]]
def padnote(f,d):
    t=t_(d);s=np.zeros((len(t),2))
    for c,det in enumerate([.9985,1.0015]):
        for k in range(1,7): s[:,c]+=np.sin(2*np.pi*f*det*k*t+k)*(1/k)*np.exp(-k*.45)
    return s*env(len(t),.9,1.0)[:,None]
mus=zeros(); cd=2.88
for i in range(int(DUR/cd)+1):
    ch=CH[i%4]; t0=i*cd
    for f in ch: place(mus,padnote(f,cd+1.0),t0,.05)
# ---------- PLUCK ARP + PULSE (services & value: a 15.6 - 32.7) ----------
bpm=96; b=60/bpm
def pluck(f,d=.6):
    t=t_(d);return (np.sin(2*np.pi*f*t)+.35*np.sin(4*np.pi*f*t)+.1*np.sin(6*np.pi*f*t))*np.exp(-t*7)*env(len(t),.004,.05)
def kick():
    t=t_(.35);f=48+60*np.exp(-t*30);return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*9)
def hat():
    t=t_(.05);return fftfilt(rng.standard_normal(len(t)),lo=7000)*np.exp(-t*90)
s0,s1=T(15.55),T(32.6)
k=0;tt=s0
while tt<s1:
    ch=CH[int(tt/cd)%4];notes=[ch[2]*2,ch[3]*2,ch[4]*2,ch[3]*2]
    lvl=min(1,(tt-s0)/1.5)*(1-max(0,(tt-(s1-1.2))/1.2))
    place(mus,pluck(notes[k%4]),tt,.06*lvl,pan=.3*np.sin(k))
    if k%2==0: place(mus,kick(),tt,.22*lvl)
    else: place(mus,hat(),tt,.035*lvl)
    k+=1;tt+=b/2
# final section (after offer) fuller pulse
k=0;tt=T(36.05)
while tt<DUR-1.0:
    ch=CH[int(tt/cd)%4];notes=[ch[2]*2,ch[4]*2,ch[3]*2,ch[4]*2]
    place(mus,pluck(notes[k%4]),tt,.05,pan=.3*np.sin(k))
    if k%2==0 and tt<T(41.5): place(mus,kick(),tt,.18)
    k+=1;tt+=b/2
# drop pad during "والأهم" build
dip=np.ones(N);a0,a1=int(T(32.9)*SR),int(T(36.0)*SR);dip[a0:a1]=np.linspace(1,.45,a1-a0)
mus*=dip[:,None]
# ---------- SFX ----------
sfx=zeros()
def whoosh(d=.7,lo=300,hi=4000,rev=False):
    n=int(d*SR);x=rng.standard_normal(n);seg=8;out=np.zeros(n)
    for s in range(seg):
        a=s*n//seg;bb=(s+1)*n//seg;fc=lo*(hi/lo)**(s/seg)
        out[a:bb]=fftfilt(x,lo=fc*.5,hi=fc*2)[a:bb]
    e=np.sin(np.linspace(0,np.pi,n))**2
    if rev: e=np.linspace(0,1,n)**3
    return out*e
def bell(f,d=2.5):
    t=t_(d);mod=np.sin(2*np.pi*f*3.5*t)*2*np.exp(-t*3);return np.sin(2*np.pi*f*t+mod)*np.exp(-t*2.2)*env(len(t),.002,.2)
def shimmer(t0,base=1174.66,g=.05):
    for i,m in enumerate([1,1.5,1.26,2]): place(sfx,bell(base*m,1.8),t0+i*.07,g,pan=(-1)**i*.4)
def blip(f,d=.07):
    t=t_(d);return np.sin(2*np.pi*f*t)*np.exp(-t*40)
def click():
    t=t_(.04);return fftfilt(rng.standard_normal(len(t)),lo=1500)*np.exp(-t*160)
place(sfx,whoosh(1.0,200,3000),0.0,.10)
for i in range(5): place(sfx,whoosh(.35,800,5000),0.2+i*.33,.03,pan=(-1)**i*.5)
shimmer(T(1.5),g=.035)
place(sfx,whoosh(1.2,150,4500),T(4.55),.16)
place(sfx,whoosh(.9,4000,300),T(7.3),.09)
shimmer(T(7.7),base=880,g=.04)
shimmer(T(9.15),g=.045)
place(sfx,whoosh(.8,300,5000),T(10.75),.07)
shimmer(T(11.0),base=1318.5,g=.035)
place(sfx,whoosh(.8,200,3500),T(15.3),.09)
for i,(f) in enumerate([1800,2400]): place(sfx,blip(f),T(15.95)+i*.08,.04)
# shutter
place(sfx,click(),T(17.2)-.02,.35);place(sfx,click(),T(17.2)+.07,.25)
t=t_(.12);place(sfx,np.sin(2*np.pi*140*t)*np.exp(-t*40),T(17.2),.12)
place(sfx,whoosh(.6,500,6000),T(18.3),.09);shimmer(T(18.8),base=1567.98,g=.025)
for i in range(4): place(sfx,blip([1046,1318,1568,2093][i]),T(20.15)+i*.09,.05,pan=.3*(i-1.5))
for i in range(8): place(sfx,blip(1568*(1+.06*i),.1),T(22.45+i*.18),.035,pan=np.cos(i/8*6.28)*.6)
place(sfx,whoosh(1.0,300,2500),T(26.75),.09);shimmer(T(27.4),g=.035)
for i in range(4): place(sfx,bell(880*[1,1.26,1.5,2][i],1.2),T(27.6+i*1.05),.03)
place(sfx,whoosh(.8,3000,250),T(32.65),.08)
# riser + impact
rd=T(36.05)-T(34.3);n=int(rd*SR);r=whoosh(rd,200,6000,rev=True);tt=t_(rd);r+=np.sin(2*np.pi*np.cumsum(220+660*(tt/rd)**2)/SR)*(tt/rd)**3*.25
place(sfx,r,T(34.3),.16)
t=t_(2.2);boom=np.sin(2*np.pi*np.cumsum(38+50*np.exp(-t*8))/SR)*np.exp(-t*2.2)
place(sfx,boom,T(36.05),.55);place(sfx,fftfilt(rng.standard_normal(int(.5*SR)),hi=2500)*np.exp(-t_(.5)*9),T(36.05),.18)
for f in [587.33,880,1174.66,1479.98]: place(sfx,bell(f,3),T(36.05),.04)
# outro: whoosh + sonic logo
place(sfx,whoosh(.9,250,5000),T(37.4),.09)
for i,f in enumerate([587.33,880,739.99,1174.66]): place(sfx,bell(f,3.2),T(37.85)+i*.14,.075,pan=(-1)**i*.25)
t=t_(.9);place(sfx,np.sin(2*np.pi*73.4*t)*np.exp(-t*4),T(37.85),.25)
shimmer(T(40.0),base=1760,g=.02)
# ---------- MIX ----------
mus=reverb(mus,2.6,.35);sfx=reverb(sfx,1.8,.25)
# fades
fade=np.ones(N);fade[:int(.15*SR)]=np.linspace(0,1,int(.15*SR));fo=int(1.4*SR);fade[-fo:]=np.linspace(1,0,fo)**1.5
# VO
raw=subprocess.run(['ffmpeg','-v','error','-i','vo.mp3','-af',f'atempo={RATE}','-ac','1','-ar',str(SR),'-f','f32le','-'],capture_output=True).stdout
vo=np.frombuffer(raw,np.float32).astype(float)
vo=np.pad(vo,(0,max(0,N-len(vo))))[:N]
vo/=np.max(np.abs(vo))+1e-9
# duck music under voice
e=np.convolve(np.abs(vo),np.ones(2205)/2205,'same');e=np.convolve(e,np.ones(8820)/8820,'same');e/=e.max()
duck=1-.45*np.clip(e*4,0,1)
import sys
r=lambda x:20*np.log10(np.sqrt(np.mean(x**2))+1e-9)
print("vo",r(vo*.78),"mus",r(mus*duck[:,None]),"sfx",r(sfx))
mix=vo[:,None]*.78+mus*duck[:,None]*0.26+sfx*0.6*(1-.25*np.clip(e*4,0,1))[:,None]
mix*=fade[:,None];mix/=np.max(np.abs(mix))/0.95
with wave.open('mix.wav','wb') as w:
    w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((mix*32767).astype(np.int16).tobytes())
print('ok',N/SR)
