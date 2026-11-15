import numpy as np, subprocess, wave, json
SR=44100; DUR=60.0; N=int(SR*DUR)
C=json.load(open('cues.json'))
rng=np.random.default_rng(11)
def Z(): return np.zeros((N,2))
def place(buf,sig,t,g=1.0,pan=0.0):
    i=int(t*SR)
    if i>=N or i<0: return
    if sig.ndim==1: sig=np.stack([sig*(1-max(0,pan)),sig*(1+min(0,pan))],1)
    j=min(N,i+len(sig)); buf[i:j]+=sig[:j-i]*g
tt=lambda d: np.arange(int(d*SR))/SR
def env(n,a,r):
    e=np.ones(n);A=int(a*SR);R=int(r*SR)
    if A>0:e[:A]=np.linspace(0,1,A)
    if R>0:e[-R:]*=np.linspace(1,0,R)
    return e
def filt(x,lo=None,hi=None):
    X=np.fft.rfft(x);f=np.fft.rfftfreq(len(x),1/SR);m=np.ones_like(f)
    if lo:m*=1/(1+(lo/np.maximum(f,1))**4)
    if hi:m*=1/(1+(f/hi)**4)
    return np.fft.irfft(X*m,len(x))
def reverb(x,dur=2.4,wet=.3):
    n=int(dur*SR);ir=rng.standard_normal((n,2))*np.exp(-np.linspace(0,7,n))[:,None]
    for c in range(2): ir[:,c]=filt(ir[:,c],hi=5000)
    ir/=np.sqrt((ir**2).sum(0));L=len(x)+n;o=np.zeros((L,2))
    for c in range(2): o[:,c]=np.fft.irfft(np.fft.rfft(x[:,c],L)*np.fft.rfft(ir[:,c],L),L)
    return x*(1-wet)+o[:len(x)]*wet*2.2
def ks(f,d=1.6,bright=.5,decay=.996):
    n=int(d*SR);P=max(2,int(SR/f));y=np.zeros(n+P+1)
    y[:P+1]=filt(rng.standard_normal(P+1)*1.0,hi=2000+6000*bright) if P>64 else rng.standard_normal(P+1)
    i=P+1
    while i<n+P+1:
        j=min(i+P,n+P+1);y[i:j]=decay*.5*(y[i-P:j-P]+y[i-P-1:j-P-1]);i=j
    o=y[P+1:P+1+n];return o*env(n,.002,.15)/ (np.max(np.abs(o))+1e-9)
# Hijaz on D: D Eb F# G A Bb C
D3=146.83;ST=[0,1,4,5,7,8,10]
def note(deg,octv=0):
    o,d=divmod(deg,7);return D3*2**(octv+o+ST[d]/12)
mus=Z();sfx=Z()
# ---------- drone/pad ----------
def pad(freqs,d,att=1.5,rel=2.0):
    t=tt(d);s=np.zeros((len(t),2))
    for f in freqs:
        for c,det in enumerate([.998,1.002]):
            for k in range(1,6): s[:,c]+=np.sin(2*np.pi*f*det*k*t+k*c)*(1/k)*np.exp(-k*.55)
    return s*env(len(t),att,rel)[:,None]/len(freqs)
place(mus,pad([73.42,110],C['dis']+1.5,2.0,1.5),0,.35)               # opening drone D2/A2
place(mus,pad([73.42,146.83,220,277.18*1.0],C['gold']-C['dis']+1.5),C['dis']-.5,.33)  # warm build (D A C#-ish colour)
place(mus,pad([73.42,146.83,185,220,293.66],C['houses']-C['gold']+1.5,.8),C['gold']-.2,.38)  # white gold rising (D major-ish, bright)
place(mus,pad([73.42,146.83,174.6,220,311.1],C['corr']-C['houses']+1.2),C['houses']-.4,.32)  # heritage (Hijaz colour Eb)
place(mus,pad([73.42,110,146.83,220],C['brand']-C['corr']+1.2),C['corr']-.3,.25)
place(mus,pad([73.42,146.83,185,220,293.66,369.99],DUR-C['brand']+.5,1.2,3.0),C['brand']-.4,.42)
# ---------- oud motifs ----------
def motif(t0,degs,step,g=.16,octv=0,pan=0):
    for i,d in enumerate(degs):
        if d is None: continue
        place(mus,ks(note(d,octv),1.4,.45),t0+i*step,g,pan)
motif(.6,[0,1,2,3,None,2,1,0],.42,.14,0,-.2)
motif(C['dis'],[4,3,2,1,2,None,0],.36,.14,0,.2)
motif(C['dis3'],[0,2,4,5,4,None,7],.32,.14,0,-.2)
motif(C['qasab']-.1,[7,4,7],.18,.16,0,0)
motif(C['houses'],[0,1,2,3,4,3,2,1,2,None,4,5,4,2,3,1,0,None,0,1,2,4],.34,.13,0,.15)
# energetic experiences: arps + drums 104 bpm
bpm=104;b=60/bpm;s0=C['corr']-.2;s1=C['brand']-.5
pat=[0,2,4,2,1,2,4,5,4,2,1,0,1,2,4,7]
def doum():
    t=tt(.5);return np.sin(2*np.pi*np.cumsum(55+45*np.exp(-t*25))/SR)*np.exp(-t*7)+filt(rng.standard_normal(len(t)),hi=400)*np.exp(-t*30)*.3
def tek():
    t=tt(.12);return filt(rng.standard_normal(len(t)),lo=1800,hi=7000)*np.exp(-t*55)*.8+np.sin(2*np.pi*720*t)*np.exp(-t*60)*.4
k=0;t=s0
while t<s1:
    lvl=min(1,(t-s0)/2.0)*(1-max(0,(t-(s1-1.5))/1.5))
    place(mus,ks(note(pat[k%16],1 if k%32>=16 else 0),.7,.6),t,.10*lvl,.25*np.sin(k*.7))
    st=k%8
    if st in (0,3): place(mus,doum(),t,.30*lvl)
    elif st in (2,5,6): place(mus,tek(),t,.10*lvl,pan=.2)
    k+=1;t+=b/2
# soft heartbeat doum during Qasab reveal and heritage
for i in range(10): place(mus,doum(),C['dis2']+i*.95,.12)
for i in range(9): place(mus,doum(),C['houses']+i*.9,.10)
# ending phrase + sonic logo
motif(C['brand']+.05,[0,4,7,9],.16,.13,0,0)
def bell(f,d=3.0):
    t=tt(d);m=np.sin(2*np.pi*f*3.5*t)*2*np.exp(-t*3);return np.sin(2*np.pi*f*t+m)*np.exp(-t*2)*env(len(t),.002,.3)
for i,f in enumerate([293.66,440,369.99,587.33]): place(sfx,bell(f),C['brand']+i*.15,.06,pan=(-1)**i*.25)
t3=tt(1.2);place(sfx,np.sin(2*np.pi*55*t3)*np.exp(-t3*3.5),C['brand'],.35)
motif(C['slog2']+.2,[7,4,2,0],.3,.10,0,0)
motif(C['cta2'],[0,2,4,7,None,None,4,7],.24,.11,0,0)
for i,f in enumerate([587.33,880,739.99,1174.66]): place(sfx,bell(f,3.5),C['cta2']+1.8+i*.12,.03)
# ---------- SFX ----------
def whoosh(d=.8,lo=300,hi=4000):
    n=int(d*SR);x=rng.standard_normal(n);o=np.zeros(n);seg=8
    for s in range(seg):
        a=s*n//seg;bb=(s+1)*n//seg;fc=lo*(hi/lo)**(s/seg);o[a:bb]=filt(x,lo=fc*.5,hi=fc*2)[a:bb]
    return o*np.sin(np.linspace(0,np.pi,n))**2
def shimmer(t0,base=1174.66,g=.04):
    for i,m in enumerate([1,1.5,1.26,2,2.52]): place(sfx,bell(base*m,2),t0+i*.06,g,pan=(-1)**i*.4)
# road ambience (opening)
n=int((C['dis']+1)*SR);road=filt(rng.standard_normal(n),lo=40,hi=300)*env(n,.8,1.0);place(sfx,road,0,.12)
place(sfx,whoosh(1.4,200,3000),C['msg']-.2,.08)
shimmer(C['msg'],880,.03)
place(sfx,whoosh(1.0,3000,300),C['dis']-.3,.07)
place(sfx,whoosh(.8,400,5000),C['qasab']-.6,.07);shimmer(C['qasab']+.1,1174.66,.04)
place(sfx,whoosh(1.0,250,4000),C['gold']-.6,.08);shimmer(C['gold']-.1,1567.98,.06);shimmer(C['gold']+1.4,2349.3,.025)
# wind over salt fields
n=int((C['houses']-C['land']+1)*SR);x=filt(rng.standard_normal(n),lo=200,hi=1200);lfo=.6+.4*np.sin(np.linspace(0,9,n));place(sfx,x*lfo*env(n,1.0,1.0),C['land']-.3,.06)
for i in range(3): shimmer(C['cent']+i*.95,1975.5,.012)
place(sfx,whoosh(.9,300,3500),C['houses']-.6,.08)
for k in ['alleys','markets','majlis']: place(sfx,whoosh(.7,500,3000),C[k]-.4,.05)
# market murmur
n=int(1.8*SR);m=np.zeros(n)
for v in range(6):
    f0=300+v*170;am=filt(rng.standard_normal(n),hi=6);am=np.clip(am/np.std(am)*.5+.3,0,1);m+=filt(rng.standard_normal(n),lo=f0*.7,hi=f0*1.4)*am
place(sfx,m*env(n,.3,.5),C['markets']-.1,.025)
# door creak + wood thunk
t4=tt(1.1);f=320+220*t4/1.1+15*np.sin(2*np.pi*13*t4);cr=np.sin(2*np.pi*np.cumsum(f)/SR)*(.5+.5*np.sign(np.sin(2*np.pi*31*t4)))*env(len(t4),.05,.3)
place(sfx,filt(cr,lo=200,hi=3000),C['past']+.85,.05)
t5=tt(.3);place(sfx,np.sin(2*np.pi*110*t5)*np.exp(-t5*18),C['past']+.8,.15)
place(sfx,whoosh(1.0,300,5000),C['corr']-.6,.08)
# corridor sparkle
shimmer(C['corr']+.2,1760,.025);shimmer(C['works']+.2,1567.98,.02)
# hooves (gallop)
def hoof():
    t=tt(.08);return np.sin(2*np.pi*150*t)*np.exp(-t*60)+filt(rng.standard_normal(len(t)),lo=800,hi=3000)*np.exp(-t*90)*.4
t=C['horse']-.1
while t<C['poetry']-.2:
    for j,dt in enumerate([0,.07,.18,.25]): place(sfx,hoof(),t+dt,.12*(.8+.2*j/3),pan=.2)
    t+=.42
# camel ambience: low soft grumble
t6=tt(.9);gr=filt(rng.standard_normal(len(t6)),lo=60,hi=260)*(.6+.4*np.sin(2*np.pi*14*t6))*env(len(t6),.15,.4);place(sfx,gr,C['horse']+.6,.06,pan=-.3)
# poetry: soft lantern flicker / incense - gentle tone
shimmer(C['poetry']+.1,1174.66,.02)
# classic car engine idle
t7=tt(1.7);eng=sum(np.sin(2*np.pi*34*h*t7+h)/h for h in range(1,7))*(.7+.3*np.sin(2*np.pi*11*t7))
place(sfx,filt(eng,hi=500)*env(len(t7),.3,.5),C['cars']-.05,.10)
# cooking sizzle + fire crackle
n=int(1.8*SR);sz=filt(rng.standard_normal(n),lo=3000,hi=9000)*(.5+.5*np.abs(filt(rng.standard_normal(n),hi=20))*3);place(sfx,sz*env(n,.2,.5),C['cook']-.05,.025)
for i in range(14): t8=tt(.03);place(sfx,filt(rng.standard_normal(len(t8)),lo=1500)*np.exp(-t8*150),C['cook']+rng.random()*1.6,.05*rng.random())
place(sfx,whoosh(.9,300,4500),C['scenes']-.3,.07)
for i in range(6): place(sfx,bell(1318.5*(1+.12*i),.8),C['scenes']+i*.07,.02)
place(sfx,whoosh(1.2,200,5000),C['brand']-.6,.09)
# ---------- MIX ----------
mus=reverb(mus,2.8,.32);sfx=reverb(sfx,2.0,.22)
raw=subprocess.run(['ffmpeg','-v','error','-i','vo_final.wav','-ac','1','-ar',str(SR),'-f','f32le','-'],capture_output=True).stdout
vo=np.frombuffer(raw,np.float32).astype(float);vo=np.pad(vo,(0,max(0,N-len(vo))))[:N];vo/=np.max(np.abs(vo))+1e-9
e=np.convolve(np.abs(vo),np.ones(2205)/2205,'same');e=np.convolve(e,np.ones(8820)/8820,'same');e/=e.max();duck=1-.4*np.clip(e*4,0,1)
r=lambda x:20*np.log10(np.sqrt(np.mean(x**2))+1e-9)
mg=10**((r(vo*.8)-13-r(mus))/20);sg=10**((r(vo*.8)-17-r(sfx))/20)
print('levels vo',r(vo*.8),'mus',r(mus*mg),'sfx',r(sfx*sg))
mix=vo[:,None]*.8+mus*mg*duck[:,None]+sfx*sg*(1-.2*np.clip(e*4,0,1))[:,None]
fade=np.ones(N);fade[:int(.1*SR)]=np.linspace(0,1,int(.1*SR));fo=int(1.2*SR);fade[-fo:]=np.linspace(1,0,fo)**1.5
mix*=fade[:,None];mix/=np.max(np.abs(mix))/0.95
with wave.open('mix2.wav','wb') as w:
    w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((mix*32767).astype(np.int16).tobytes())
print('ok')
