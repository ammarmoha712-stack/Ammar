import numpy as np, subprocess, wave
from scipy.signal import butter, sosfilt
SR=48000; DUR=30.0; N=int(SR*DUR); t=np.arange(N)/SR
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
arpE=ramp(7.8,8.6)
kickE=ramp(9.1,9.3)*(1-ramp(28.6,29.6))
music=pad*(0.6+0.4*ramp(8,9))+arp*arpE+bass*ramp(1.9,2.2)+kick*kickE*0.6
music*=np.minimum(1,t/0.6)*(1-ramp(28.8,30.0))
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
def boom():
    n=int(2.0*SR); u=np.arange(n)/SR
    return (np.sin(2*np.pi*(38+30*np.exp(-u*4))*u)*np.exp(-u*2.2)*0.9+lp(rng.standard_normal(n),300)*np.exp(-u*5)*0.6)
def drone():
    n=int(4.2*SR); u=np.arange(n)/SR
    return (np.sin(2*np.pi*55*u)+0.5*np.sin(2*np.pi*82.4*u)+0.3*np.sin(2*np.pi*110.3*u))*np.minimum(1,u/1.0)*np.minimum(1,(4.2-u)/1.0)*0.18+bp(rng.standard_normal(n),600,2400)*np.minimum(1,u/1.5)*np.minimum(1,(4.2-u)/0.8)*0.05
def tick():
    n=int(0.05*SR); u=np.arange(n)/SR; return bp(rng.standard_normal(n),2000,6000)*np.exp(-u*120)*0.6
def clank():
    n=int(0.4*SR); u=np.arange(n)/SR; return (np.sin(2*np.pi*620*u)+0.6*np.sin(2*np.pi*1460*u))*np.exp(-u*18)*0.18
def elevding():
    return ding(1046)*0.8
add(0.0,drone(),1.0)
for x in (0.3,0.6,0.9,1.2,1.5,1.8): add(x,tick(),0.6)
add(1.0,shimmer(1.4),0.5); add(2.0,boom(),0.9); add(2.0,build(),0.6)
add(2.9,whoosh(1.0),0.9)
for x in (4.9,6.3,8.5): add(x,clank(),0.6)
for x in (5.5,7.2): add(x,elevding(),0.6)
for j in range(8): add(4.2+j*0.18,popf(1100),0.35)
add(7.6,whoosh(0.6),0.6)
add(8.2,whoosh(0.5),0.4); add(9.05,tap(),1.0); add(9.1,ding(1760),0.6); add(9.15,shimmer(1.2),0.7)
for i in range(6): add(10.0+i*0.45,ding(m2f(69+[0,4,7,9,12,16][i])),0.45)
for j in range(8): add(10.3+j*0.06+0.3,popf(800),0.3)
add(13.85,whoosh(0.5),0.8)
for j in range(4): add(13.8+j*0.5,whoosh(0.45),0.5)
add(16.3,shimmer(1.1),0.5); add(17.5,whoosh(0.7),0.5)
add(18.6,build(),0.8); add(19.4,shimmer(1.2),0.6)
add(20.7,whoosh(0.7),0.8); add(21.0,shimmer(1.6),0.8); add(21.5,boom(),0.6)
for i,m in enumerate([69,76,81]): add(24.35+i*0.16,ding(m2f(m+12)),0.7)
for i in range(3): add(24.4+i*0.3,popf(900),0.4)
# ---- voice
raw=subprocess.run(['ffmpeg','-v','error','-i','vo.mp3','-f','f32le','-ac','1','-ar',str(SR),'-'],capture_output=True).stdout
vo=np.frombuffer(raw,dtype=np.float32).astype(float)
voice=np.zeros(N); off=int(0.6*SR); L=min(N-off,len(vo)); voice[off:off+L]=vo[:L]
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
