import numpy as np, subprocess, wave
from scipy.signal import butter, sosfilt
SR=48000; DUR=56.0; N=int(SR*DUR); t=np.arange(N)/SR
def lp(x,fc,o=2): return sosfilt(butter(o,fc,'low',fs=SR,output='sos'),x)
def bp(x,lo,hi): return sosfilt(butter(2,[lo,hi],'band',fs=SR,output='sos'),x)
def m2f(m): return 440*2**((m-69)/12)
rng=np.random.default_rng(1)
# ---- music: 96 bpm, D major corporate
bpm=96; beat=60/bpm; bar=4*beat
prog=[[50,57,62,66,69],[47,54,62,66,69],[43,55,62,66,71],[45,52,61,64,69]]  # D, Bm, Gmaj, A
pad=np.zeros(N); arp=np.zeros(N); bass=np.zeros(N); kick=np.zeros(N)
nb=int(DUR/bar)+1
for b in range(nb):
    ch=prog[b%4]; s0=b*bar
    i0=int(s0*SR); i1=min(N,int((s0+bar+0.3)*SR))
    if i0>=N: break
    tt=np.arange(i1-i0)/SR
    env=np.minimum(1,tt/0.6)*np.minimum(1,np.maximum(0,(bar+0.3-tt)/0.5))
    for m in ch[1:]:
        for d in (-0.08,0.08):
            ph=2*np.pi*m2f(m+d/1)*tt
            pad[i0:i1]+=env*(np.sin(ph)+0.3*np.sin(2*ph)+0.12*np.sin(3*ph))*0.05
    # bass
    bt=np.minimum(1,tt/0.02)*np.exp(-tt*0.9)
    bass[i0:i1]+=bt*np.sin(2*np.pi*m2f(ch[0]-12)*tt)*0.22
    # arp 8ths
    notes=[ch[1]+12,ch[2]+12,ch[3]+12,ch[4]+12,ch[3]+12,ch[2]+12,ch[4]+12,ch[3]+12]
    for k,m in enumerate(notes):
        a=int((s0+k*beat/2)*SR); L=int(0.9*SR); a1=min(N,a+L)
        if a>=N: break
        u=np.arange(a1-a)/SR; fq=m2f(m)
        arp[a:a1]+=np.exp(-u*5)*(np.sin(2*np.pi*fq*u)+0.25*np.sin(4*np.pi*fq*u)*np.exp(-u*9))*0.07
    for k in range(4):
        a=int((s0+k*beat)*SR); a1=min(N,a+int(0.3*SR))
        if a>=N: break
        u=np.arange(a1-a)/SR
        kick[a:a1]+=np.sin(2*np.pi*(50+90*np.exp(-u*30))*u)*np.exp(-u*12)*0.35
pad=lp(pad,2500)
# arrangement envelopes
def ramp(x0,x1): return np.clip((t-x0)/(x1-x0),0,1)
arpE=0.35+0.65*ramp(13.5,15)
kickE=ramp(14.6,15.2)*(1-ramp(36.3,36.5))+ramp(38.6,39)*(1-ramp(52.5,54))
music=pad*1.0+arp*arpE+bass*ramp(6.8,7.2)+kick*kickE*0.8
music*=np.minimum(1,t/1.0)*(1-ramp(54.2,56.0))
# ---- sfx
sfx=np.zeros(N)
def add(at,sig,g=1.0):
    a=int(at*SR); b=min(N,a+len(sig)); sfx[a:b]+=sig[:b-a]*g
def whoosh(d=0.7):
    n=int(d*SR); u=np.arange(n)/SR; x=rng.standard_normal(n)
    env=np.sin(np.pi*u/d)**2; out=np.zeros(n)
    for i in range(0,n,960):
        fc=300+3500*(i/n); seg=x[i:i+960]
        out[i:i+960]=seg
    y=bp(out,400,5000)*env; return y*0.35
def popf(f0=900):
    n=int(0.18*SR); u=np.arange(n)/SR
    return np.sin(2*np.pi*(f0*np.exp(-u*8))*u)*np.exp(-u*28)*0.35
def ding(f=1320):
    n=int(1.2*SR); u=np.arange(n)/SR
    return (np.sin(2*np.pi*f*u)+0.5*np.sin(2*np.pi*f*2.01*u)+0.25*np.sin(2*np.pi*f*3.02*u))*np.exp(-u*4)*0.18
def shimmer(d=2.0):
    s=np.zeros(int(d*SR))
    for k in range(18):
        f=m2f(rng.choice([74,78,81,86,90,93])); a=int(k*d/18*SR*0.8)
        x=ding(f)*0.6; s[a:a+len(x)]+=x[:len(s)-a]
    return s
def jingle():
    s=np.zeros(int(1.2*SR))
    for k in range(7):
        f=rng.uniform(3000,6000); a=int(rng.uniform(0,0.35)*SR); n=int(0.4*SR); u=np.arange(n)/SR
        s[a:a+n]+=np.sin(2*np.pi*f*u)*np.exp(-u*14)*0.12
    return s
def tap():
    n=int(0.06*SR); u=np.arange(n)/SR; return np.sin(2*np.pi*1800*u)*np.exp(-u*90)*0.3
for tc in (7.0,17.2,25.4,36.4,43.2): add(tc-0.4,whoosh(),1.0)
for tc in (27.6,29.6,31.6,33.8): add(tc-0.2,whoosh(0.5),0.6)
for x in (0.6,1.1,1.6,2.1,7.3,8.0,8.7,9.4): add(x,popf(800),0.8)
for x in (2.4,4.6,5.2,10.3,10.6,10.9,19.9): add(x,popf(500),0.7)
add(13.3,ding(1760)); add(13.6,shimmer(1.2),0.7)
add(14.85,shimmer(2.0),1.0); add(15.0,whoosh(0.9),0.5)
for x in (22.0,22.3,22.4,22.8): add(x,ding(1568),0.7)
add(26.6,jingle()); add(26.7,popf(700))
add(37.62,tap()); add(37.7,ding(1760))
add(40.2,jingle(),1.2); add(40.25,shimmer(1.0),0.6)
add(45.6,shimmer(2.0),0.9)
for i in range(5): add(34.1+i*0.25,popf(650),0.5)
for i in range(3): add(50.0+i*0.3,popf(900),0.6)
# ---- voice
raw=subprocess.run(['ffmpeg','-v','error','-i','vo.mp3','-f','f32le','-ac','1','-ar',str(SR),'-'],capture_output=True).stdout
vo=np.frombuffer(raw,dtype=np.float32).astype(float)
voice=np.zeros(N); voice[:min(N,len(vo))]=vo[:N]
# ducking
envv=np.sqrt(np.abs(lp(voice**2,4)))
duck=np.clip(envv/0.02,0,1); duck=lp(duck,3)
music=music/np.max(np.abs(music))*0.32*(1-0.45*np.clip(duck,0,1))
mix=voice*1.0+music+sfx*0.55
mix/=max(1,np.max(np.abs(mix))/0.97)
st=np.stack([mix,mix],1)
w=wave.open('mix.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((st*32767).astype(np.int16).tobytes()); w.close()
print('ok',np.max(np.abs(voice)))
