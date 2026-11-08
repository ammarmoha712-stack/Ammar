import numpy as np, subprocess, wave
from scipy.signal import butter, sosfilt
SR=48000; DUR=48.0; N=int(SR*DUR); t=np.arange(N)/SR
def lp(x,fc,o=2): return sosfilt(butter(o,fc,'low',fs=SR,output='sos'),x)
def bp(x,lo,hi): return sosfilt(butter(2,[lo,hi],'band',fs=SR,output='sos'),x)
def m2f(m): return 440*2**((m-69)/12)
rng=np.random.default_rng(1)
# ---- music: 96 bpm, D major corporate
bpm=88; beat=60/bpm; bar=4*beat
prog=[[45,52,57,60,64],[41,53,57,60,65],[48,55,60,64,67],[43,55,59,62,67]]  # D, Bm, Gmaj, A
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
arpE=0.4+0.6*ramp(6.4,7.2)
kickE=ramp(8.0,8.4)*(1-ramp(46.5,47.6))
music=pad*1.0+arp*arpE+bass*ramp(0.0,1.5)+kick*kickE*0.6
music*=np.minimum(1,t/0.8)*(1-ramp(46.6,48.0))
sfx=np.zeros(N)
def add(at,sig,g=1.0):
    a=int(at*SR); b=min(N,a+len(sig)); sfx[a:b]+=sig[:b-a]*g
def whoosh(d=0.7):
    n=int(d*SR); u=np.arange(n)/SR; x=rng.standard_normal(n)
    return bp(x,400,5000)*np.sin(np.pi*u/d)**2*0.35
def popf(f0=900):
    n=int(0.18*SR); u=np.arange(n)/SR
    return np.sin(2*np.pi*(f0*np.exp(-u*8))*u)*np.exp(-u*28)*0.35
def ding(f=1320):
    n=int(1.2*SR); u=np.arange(n)/SR
    return (np.sin(2*np.pi*f*u)+0.5*np.sin(2*np.pi*f*2.01*u)+0.25*np.sin(2*np.pi*f*3.02*u))*np.exp(-u*4)*0.18
def shimmer(d=2.0):
    s=np.zeros(int(d*SR))
    for k in range(18):
        f=m2f(rng.choice([69,72,76,81,84,88])); a=int(k*d/18*SR*0.8)
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
def build():
    n=int(1.5*SR); u=np.arange(n)/SR; x=rng.standard_normal(n)
    return bp(x,150,1200)*np.minimum(1,u/1.2)*np.exp(-np.maximum(0,u-1.2)*20)*0.25
for tc in (6.4,8.1,20.6,28.3,35.6): add(tc-0.4,whoosh(),1.0)
for tc in (14.4,15.8,16.9,18.0,19.2): add(tc-0.2,whoosh(0.45),0.55)
add(0.1,build(),0.9)
for x in (0.9,1.6,2.2,3.7,4.1,4.5): add(x,popf(700),0.7)
add(6.4,whoosh(0.8),0.5); add(7.1,shimmer(1.5),0.9)
add(9.3,popf(500),0.6); add(9.4,ding(1568),0.5)
for i in range(6): add(11.6+i*0.1,popf(900),0.4)
for x in (14.6,14.8,15.0,16.2,16.4,16.6,17.6,18.4,18.8,19.3,19.5,19.7): add(x,popf(850),0.45)
for j in range(5): add(21.5+j*0.45+0.8,ding(1568+j*100),0.4)
for x in (26.0,26.3,26.6): add(x,ding(1760),0.5)
for x in (28.6,29.0,29.4): add(x,popf(650),0.7)
add(32.4,shimmer(1.2),0.6)
add(35.8,shimmer(2.0),1.0); add(36.7,whoosh(0.6),0.4)
for i in range(3): add(40.1+i*0.3,popf(900),0.6)
add(44.6,shimmer(2.5),0.7)
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
