import numpy as np, wave
from scipy.signal import butter, sosfilt
SR=48000; D=30.0; N=int(SR*D); T=np.arange(N)/SR
rng=np.random.default_rng(3)
L=np.zeros(N); Rr=np.zeros(N)
def add(sig,t0,g=1.0,pan=0.0):
    i=int(t0*SR); j=min(N,i+len(sig)); 
    if i>=N: return
    s=sig[:j-i]*g; L[i:j]+=s*(1-max(pan,0)); Rr[i:j]+=s*(1+min(pan,0))
def lp(x,f,o=2): return sosfilt(butter(o,f,'low',fs=SR,output='sos'),x)
def hp(x,f,o=2): return sosfilt(butter(o,f,'high',fs=SR,output='sos'),x)
def bp(x,lo,hi,o=2): return sosfilt(butter(o,[lo,hi],'band',fs=SR,output='sos'),x)
def env(n,a,r): 
    e=np.ones(n); na=int(a*SR); e[:na]=np.linspace(0,1,na); e*=np.exp(-np.arange(n)/SR/r) if r else 1; return e
def mtof(m): return 440*2**((m-69)/12)
BPM=120; beat=60/BPM; bar=beat*4
chords=[[57,60,64],[53,57,60],[48,52,55],[55,59,62]]  # Am F C G
roots=[45,41,48,43]
# --- pad (additive saw-ish, warm)
pad=np.zeros(N)
for b in range(int(D/bar)+1):
    t0=b*bar; n=int(bar*SR)+SR//4; tt=np.arange(n)/SR
    seg=np.zeros(n)
    for m in chords[b%4]:
        for det in (-0.08,0,0.08):
            f=mtof(m+12)*2**(det/12)
            for h in range(1,7): seg+=np.sin(2*np.pi*f*h*tt+h)/h**1.6
    e=np.minimum(1,tt/0.35)*np.minimum(1,(n/SR-tt)/0.3)
    i=int(t0*SR); j=min(N,i+n); pad[i:j]+=(seg*e)[:j-i]
pad=lp(pad,2200)
padg=np.interp(T,[0,5,9.4,9.5,25.9,26,29,30],[.25,.35,.45,.35,.35,.45,.45,0])
pad*=padg/np.abs(pad).max()
L+=pad*.55; Rr+=pad*.55
# --- arp pluck 16ths
def pluck(f,dur=.25):
    n=int(dur*SR); tt=np.arange(n)/SR
    s=sum(np.sin(2*np.pi*f*h*tt)/h**1.2 for h in range(1,5))
    return s*np.exp(-tt/0.09)*np.minimum(1,tt/0.003)
k=0; t=0.0
while t<29.2:
    b=int(t//bar); ch=chords[b%4]; seq=[0,1,2,1,2,0,1,2]
    m=ch[seq[k%8]]+24
    g=.10 if t<5 else (.07 if 7.4<t<9.42 else .12)
    add(pluck(mtof(m)),t,g,pan=.4 if k%2 else -.4); k+=1; t+=beat/4
# --- drums
def kick():
    n=int(.45*SR); tt=np.arange(n)/SR; f=45+110*np.exp(-tt/0.035)
    return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-tt/0.16)
def hat(dec=.03):
    n=int(.12*SR); return hp(rng.standard_normal(n),7000)*np.exp(-np.arange(n)/SR/dec)
def clap():
    n=int(.25*SR); x=bp(rng.standard_normal(n),900,3500); tt=np.arange(n)/SR
    e=np.exp(-tt/.08); 
    for d in (0,.012,.024): e+=np.exp(-np.clip(tt-d,0,None)/.008)*(tt>=d)*.5
    return x*e
t=0.0
while t<29.0:
    beatn=round(t/beat)
    groove=(5.0<=t<7.4) or (9.42<=t<25.9) or (26.0<=t<29.0)
    full=(9.42<=t<25.9) or (26.0<=t<29.0)
    if groove: add(kick(),t,.55 if full else .4)
    if full and beatn%2==1: add(clap(),t,.22)
    if groove: add(hat(),t+beat/2,.10,pan=.3)
    if full: add(hat(.015),t+beat/4,.05,pan=-.3); add(hat(.015),t+3*beat/4,.05,pan=-.3)
    t+=beat
# bass 8ths in full sections
t=9.42
while t<29.0:
    if not (25.9<=t<26.0):
        b=int(t//bar); f=mtof(roots[b%4]-12); n=int(beat/2*SR); tt=np.arange(n)/SR
        s=(np.sin(2*np.pi*f*tt)+.3*np.sin(2*np.pi*2*f*tt))*np.exp(-tt/0.18)*np.minimum(1,tt/.005)
        add(s,t,.28)
    t+=beat/2
# snare roll / riser 7.4-9.42
t=7.4; step=beat/2
while t<9.4:
    add(clap(),t,.08+.18*(t-7.4)/2); 
    t+=step; step=max(beat/8,step*0.8)
n=int(2.0*SR); tt=np.arange(n)/SR
riser=hp(rng.standard_normal(n),1500)*(tt/2.0)**2
riser+= np.sin(2*np.pi*np.cumsum(200+900*(tt/2)**2)/SR)*(tt/2)**2*.4
add(riser,7.42,.22)
# ---- SFX
def whoosh(dur=.6,up=True):
    n=int(dur*SR); x=rng.standard_normal(n); out=np.zeros(n); seg=n//24
    for s in range(24):
        p=s/23; fc=(400+5000*p) if up else (5000-4400*p)
        y=bp(x[max(0,s*seg-200):(s+1)*seg],fc*.6,min(fc*1.6,20000)); out[s*seg:(s+1)*seg]=y[-seg:]
    tt=np.arange(n)/SR; e=np.sin(np.pi*np.clip(tt/dur,0,1))**2
    return out*e
def impact():
    n=int(2.2*SR); tt=np.arange(n)/SR; f=38+90*np.exp(-tt/0.08)
    boom=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-tt/0.6)
    noise=lp(rng.standard_normal(n),3000)*np.exp(-tt/0.12)*.5
    shim=sum(np.sin(2*np.pi*mtof(m)*tt)*np.exp(-tt/0.9)/3 for m in (81,88,93,100))*.35
    return boom+noise+shim
def chime(notes=(76,83,88),sp=.07):
    n=int(1.6*SR); tt=np.arange(n)/SR; s=np.zeros(n)
    for i,m in enumerate(notes):
        d=int(i*sp*SR); f=mtof(m); s[d:]+= (np.sin(2*np.pi*f*tt[:n-d])+.3*np.sin(2*np.pi*f*2.01*tt[:n-d]))*np.exp(-tt[:n-d]/.5)
    return s
def pop(f=900):
    n=int(.12*SR); tt=np.arange(n)/SR; fr=f*(1+1.5*np.exp(-tt/.01))
    return np.sin(2*np.pi*np.cumsum(fr)/SR)*np.exp(-tt/.03)
def tick(): 
    n=int(.03*SR); return hp(rng.standard_normal(n),3000)*np.exp(-np.arange(n)/SR/.005)
def swipe():
    n=int(.35*SR); tt=np.arange(n)/SR
    return bp(rng.standard_normal(n),2000,8000)*np.sin(np.pi*tt/.35)**2
# intro digital rise
n=int(1.2*SR); tt=np.arange(n)/SR
add(np.sin(2*np.pi*np.cumsum(300+1500*(tt/1.2)**3)/SR)*(tt/1.2)*np.exp(-np.maximum(0,tt-1.0)/.05)*.4 + hp(rng.standard_normal(n),3000)*(tt/1.2)**2*.3,0.0,.35)
add(chime((76,83,88,95)),0.85,.22)
for tw in (1.3,4.85,12.6,16.45,17.9,20.15,25.7): add(whoosh(.7),tw,.30)
for tp,f in ((1.5,800),(1.65,950),(1.8,1100),(5.65,700),(10.25,1000),(11.0,850),(14.9,800),(15.05,900),(15.2,1000),(18.1,800),(18.3,950),(26.5,900),(27.15,750),(27.6,1100)): add(pop(f),tp,.28)
for i in range(10): add(tick(),16.6+i*.06,.25,pan=(i%5-2)/3)
for i in range(13): add(tick(),20.6+i*.054,.18)
add(swipe(),8.6,.35); add(swipe(),26.55,.25)
add(impact(),9.40,.85); add(impact(),26.33,.5)
add(chime((79,86,91)),22.8,.2)          # rank #1
for tc in (20.55,21.75,22.55,24.0): add(pop(1300),tc,.2)
add(chime((72,79,84,91),.05),24.0,.18)
add(chime((76,83,88,95,100),.08),28.9,.22)  # end sting
# master
mix=np.stack([L,Rr],1)
fade=np.interp(T,[0,0.05,29.2,30],[0,1,1,0]); mix*=fade[:,None]
mix=mix/np.abs(mix).max()*0.9
w=wave.open('build/music.wav','wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((mix*32767).astype(np.int16).tobytes());w.close()
print('ok')
