import numpy as np, subprocess, wave
from scipy.signal import butter, sosfilt, lfilter
SR=48000; DUR=62.0; N=int(SR*DUR); t=np.arange(N)/SR
rng=np.random.default_rng(3)
def lp(x,fc,o=2): return sosfilt(butter(o,fc,'low',fs=SR,output='sos'),x)
def hp(x,fc,o=2): return sosfilt(butter(o,fc,'high',fs=SR,output='sos'),x)
def bp(x,lo,hi): return sosfilt(butter(2,[lo,hi],'band',fs=SR,output='sos'),x)
def m2f(m): return 440*2**((m-69)/12)
def ramp(a,b): return np.clip((t-a)/(b-a),0,1)
mus=np.zeros(N); sfx=np.zeros(N)
def add(buf,at,sig,g=1.0):
    a=int(at*SR); 
    if a>=N: return
    b=min(N,a+len(sig)); buf[a:b]+=sig[:b-a]*g
def ks(f,d=1.0,decay=0.996,bright=0.5):
    n=int(d*SR); P=max(2,int(SR/f)); y=np.zeros(n)
    y[:P]=rng.uniform(-1,1,P)*bright+lp(rng.uniform(-1,1,P),3000)*(1-bright)
    # vectorized KS via IIR: y[n]=decay*0.5*(y[n-P]+y[n-P-1])
    b=[1.0]; a=np.zeros(P+2); a[0]=1; a[P]=-decay*0.5; a[P+1]=-decay*0.5
    x=np.zeros(n); x[:P]=y[:P]
    return lfilter(b,a,x)*0.25
def pad(chord,d,g=0.04):
    n=int(d*SR); u=np.arange(n)/SR; env=np.minimum(1,u/0.8)*np.minimum(1,(d-u)/0.8); s=np.zeros(n)
    for m in chord:
        for dt in (-0.07,0.07):
            ph=2*np.pi*m2f(m+dt)*u; s+=(np.sin(ph)+0.35*np.sin(2*ph)+0.15*np.sin(3*ph))*g
    return lp(s*env,2200)
def doum(): n=int(0.4*SR);u=np.arange(n)/SR; return np.sin(2*np.pi*(60+70*np.exp(-u*25))*u)*np.exp(-u*9)*0.6
def tak(): n=int(0.12*SR);u=np.arange(n)/SR; return bp(rng.standard_normal(n),1500,5000)*np.exp(-u*45)*0.35+np.sin(2*np.pi*420*u)*np.exp(-u*40)*0.15
def shk(): n=int(0.08*SR);u=np.arange(n)/SR; return hp(rng.standard_normal(n),6000)*np.exp(-u*60)*0.12
bpm=96; beat=60/bpm; bar=4*beat
minor=[[50,57,62,65,69],[46,53,58,62,65],[48,55,60,64,67],[45,52,57,61,64]]   # Dm Bb C A
major=[[50,57,62,66,69],[43,55,59,62,67],[45,52,57,61,64],[50,57,62,66,69]]   # D G A D
riffs=[[62,63,66,67,69,67,66,63],[62,65,67,69,70,69,67,65],[60,64,67,69,67,64,62,60],[57,61,64,66,64,61,57,61]]
nb=int(DUR/bar)+1
for b in range(nb):
    s0=b*bar
    if s0>=DUR: break
    maj = s0>=45.0
    ch=(major if maj else minor)[b%4]
    add(mus,s0,pad(ch,bar+0.8,0.035 if s0<11 else 0.04))
    add(mus,s0,np.sin(2*np.pi*m2f(ch[0]-12)*np.arange(int(bar*SR))/SR)*np.exp(-np.arange(int(bar*SR))/SR*0.8)*0.18*(1 if s0>=11 else 0.5))
    # oud plucks
    if s0<11:
        for k in (0,3,6):
            add(mus,s0+k*beat/2,ks(m2f(riffs[b%4][k]),1.2,0.995,0.4),0.8)
    elif s0<53:
        r=riffs[b%4] if not maj else [62,66,69,74,69,66,62,66]
        for k,m in enumerate(r):
            if maj and k%2: continue
            add(mus,s0+k*beat/2,ks(m2f(m),0.9,0.994,0.5),0.9 if not maj else 0.7)
    # percussion
    if 11.3<=s0<45.0:
        for k,(fn,g) in enumerate([(doum,1),(tak,0.7),(None,0),(tak,0.6),(doum,0.8),(tak,0.7),(tak,0.5),(None,0)]):
            if fn: add(mus,s0+k*beat/2,fn(),g*(1.2 if s0>=34.8 else 0.9))
        if s0>=34.8:
            for k in range(16): add(mus,s0+k*beat/4,shk(),0.8)
    if 53.4<=s0<58:
        for k in (0,4): add(mus,s0+k*beat/2,doum(),0.7)
# final cadence
fin=pad([50,57,62,66,69,74],4.0,0.05); add(mus,58.6,fin)
for i,m in enumerate([62,66,69,74,78]): add(mus,58.6+i*0.09,ks(m2f(m),2.0,0.997,0.6),0.8)
mus*=np.minimum(1,t/1.0)*(1-ramp(60.5,62.0)*0.9)
# ---- SFX
def wind(d,g=0.2):
    n=int(d*SR);u=np.arange(n)/SR;x=rng.standard_normal(n)
    return bp(x,200,1200)*(0.6+0.4*np.sin(2*np.pi*0.25*u))*np.minimum(1,u/1.5)*np.minimum(1,(d-u)/1.5)*g
def ding(f,d=1.4):
    n=int(d*SR);u=np.arange(n)/SR
    return (np.sin(2*np.pi*f*u)+0.5*np.sin(2*np.pi*f*2.01*u)+0.25*np.sin(2*np.pi*f*3.02*u))*np.exp(-u*4)*0.16
def shimmer(d=1.5):
    s=np.zeros(int(d*SR)+SR)
    for k in range(16):
        f=m2f(rng.choice([74,78,81,86,90,93])); a=int(k*d/16*SR); x=ding(f)*0.6; s[a:a+len(x)]+=x[:len(s)-a]
    return s
def whoosh(d=0.7):
    n=int(d*SR);u=np.arange(n)/SR;return bp(rng.standard_normal(n),400,5000)*np.sin(np.pi*u/d)**2*0.35
def step():
    n=int(0.09*SR);u=np.arange(n)/SR;return lp(rng.standard_normal(n),900)*np.exp(-u*50)*0.35
def murmur(d,g=0.08):
    n=int(d*SR);u=np.arange(n)/SR;x=bp(rng.standard_normal(n),250,1600)
    mod=lp(np.abs(rng.standard_normal(n)),6);mod/=mod.max()
    return x*(0.4+mod)*np.minimum(1,u/1)*np.minimum(1,(d-u)/1)*g
def splash():
    n=int(1.2*SR);u=np.arange(n)/SR;return bp(rng.standard_normal(n),300,6000)*np.exp(-u*5)*0.5+np.sin(2*np.pi*(300+600*np.exp(-u*20))*u)*np.exp(-u*12)*0.2
def water(d,g=0.05):
    n=int(d*SR);u=np.arange(n)/SR;x=bp(rng.standard_normal(n),800,4000)
    return x*(0.5+0.5*np.sin(2*np.pi*0.4*u))*np.minimum(1,u/1)*np.minimum(1,(d-u)/1)*g
def rake():
    n=int(0.5*SR);u=np.arange(n)/SR;return bp(rng.standard_normal(n),1500,7000)*np.sin(np.pi*u/0.5)*0.12
add(sfx,0,wind(11.6,0.3)); add(sfx,20.3,wind(2.6,0.25)); add(sfx,22.6,wind(6.8,0.12))
add(sfx,2.2,shimmer(1.0),0.8); add(sfx,5.6,shimmer(1.6),0.9); add(sfx,5.8,whoosh(1.6),0.6)
for x in (9.4,): add(sfx,x,ding(1568),0.6)
add(sfx,10.8,whoosh(0.6),0.7)
for i in range(int(9/ (np.pi/7))): add(sfx,11.4+i*np.pi/7,step(),0.7)
add(sfx,14.0,murmur(6.3,0.06))
add(sfx,20.2,whoosh(0.8),0.6); add(sfx,22.4,shimmer(1.2),0.6)
for i in range(12): add(sfx,22.8+i*0.55,rake(),0.8)
add(sfx,24.1,shimmer(1.8),0.7); add(sfx,29.2,shimmer(2.0),0.6); add(sfx,33.6,whoosh(1.2),0.8); add(sfx,34.2,shimmer(1.5),0.9)
add(sfx,34.8,murmur(10.6,0.1))
add(sfx,45.6,shimmer(0.8),0.6); add(sfx,46.85,splash(),1.0); add(sfx,46.9,water(6.5,0.06))
for i in range(6): add(sfx,48.2+i*0.25,step(),0.5)
add(sfx,53.3,whoosh(0.8),0.5); add(sfx,55.5,shimmer(2.2),1.0)
for i,m in enumerate([74,78,81]): add(sfx,57.8+i*0.15,ding(m2f(m+12)),0.6)
# ---- VO
raw=subprocess.run(['ffmpeg','-v','error','-i','vo_fast.wav','-f','f32le','-ac','1','-ar',str(SR),'-'],capture_output=True).stdout
vo=np.frombuffer(raw,dtype=np.float32).astype(float)
voice=np.zeros(N); off=int(0.3*SR); L=min(N-off,len(vo)); voice[off:off+L]=vo[:L]
env=np.sqrt(np.abs(lp(voice**2,4))); duck=lp(np.clip(env/0.02,0,1),3)
mus=mus/np.max(np.abs(mus))*0.3*(1-0.45*np.clip(duck,0,1))
mix=voice+mus+sfx*0.6
mix/=max(1,np.max(np.abs(mix))/0.97)
st=np.stack([mix,mix],1)
w=wave.open('mix.wav','wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((st*32767).astype(np.int16).tobytes());w.close()
print('ok')
