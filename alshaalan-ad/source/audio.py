import numpy as np, wave
SR=44100; D=60.0; N=int(SR*D); OFF=0.5
rng=np.random.default_rng(3)
def tt(n): return np.arange(n)/SR
def note(f): return 440*2**((f-69)/12)
mus=np.zeros(N); sfx=np.zeros(N)
def add(buf,start,sig,g=1.0):
    i=int(start*SR); j=min(N,i+len(sig))
    if j>i: buf[i:j]+=sig[:j-i]*g
def env(n,a,r):
    e=np.ones(n); na=int(a*SR); nr=int(r*SR)
    if na: e[:na]=np.linspace(0,1,na)
    if nr: e[-nr:]*=np.linspace(1,0,nr)
    return e
def pad(freqs,dur,g=0.05,bright=6):
    n=int(dur*SR); t=tt(n); s=np.zeros(n)
    for f in freqs:
        for d in (-0.12,0.12):
            for h in range(1,bright+1):
                s+=np.sin(2*np.pi*f*h*(1+d/100*h)*t+rng.random()*6)/h**1.6
    return s*env(n,min(1.2,dur/3),min(1.5,dur/3))*g/len(freqs)
def pluck(f,dur=1.2,g=0.08):
    n=int(dur*SR);t=tt(n)
    s=sum(np.sin(2*np.pi*f*h*t)*np.exp(-t*(3+h*2))/h for h in range(1,5))
    return s*g*env(n,0.004,0.05)
def bell(f,dur=2.5,g=0.08):
    n=int(dur*SR);t=tt(n)
    s=np.sin(2*np.pi*f*t)*np.exp(-t*1.6)+0.5*np.sin(2*np.pi*f*2.76*t)*np.exp(-t*3)+0.25*np.sin(2*np.pi*f*5.4*t)*np.exp(-t*5)
    return s*g*env(n,0.003,0.1)
def kick(g=0.35):
    n=int(0.35*SR);t=tt(n);f=45+80*np.exp(-t*25)
    return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*9)*g
def lp(x,a):
    y=np.zeros_like(x);acc=0.0
    for i in range(len(x)): acc+=a[i]*(x[i]-acc) if hasattr(a,'__len__') else a*(x[i]-acc); y[i]=acc
    return y
def noise_sweep(dur,f0,f1,g=0.2):
    n=int(dur*SR); x=rng.standard_normal(n)
    # cheap time-varying lowpass via blocks
    out=np.zeros(n); blk=512; acc=0.0; acc2=0.0
    for b in range(0,n,blk):
        fc=f0+(f1-f0)*(b/n); a=1-np.exp(-2*np.pi*fc/SR)
        seg=x[b:b+blk]; o=np.empty(len(seg))
        for k,v in enumerate(seg):
            acc+=a*(v-acc); acc2+=a*(acc-acc2); o[k]=acc-acc2*0.5
        out[b:b+blk]=o
    e=np.sin(np.pi*np.linspace(0,1,n))**2
    return out*e*g/ (np.abs(out).max()+1e-9)
# ----- MUSIC -----
D2,A2,F2,Bb1,C2=note(38),note(45),note(41),note(34),note(36)
ch={'Dm':[50,57,62,65,69],'Bb':[46,53,58,62,65],'F':[41,53,57,60,65],'C':[48,55,60,64,67],'Gm':[43,55,58,62,67]}
def chord(name,start,dur,g=0.05,bright=6,bass=True):
    fs=[note(m) for m in ch[name]]
    add(mus,start,pad(fs,dur+0.8,g,bright))
    if bass: add(mus,start,pad([fs[0]/2],dur+0.8,g*0.9,3))
# mystery
add(mus,0,pad([note(38),note(45)],9.5,0.06,4))
add(mus,0.2,pad([note(74),note(81)],9,0.012,2))
# idea section
for i,c in enumerate(['Dm','Bb','F','C']): chord(c,8.9+i*2.05,2.05,0.045)
for k in range(32):
    t0=8.9+k*0.256; m=ch[['Dm','Bb','F','C'][min(3,int((t0-8.9)/2.05))]]
    add(mus,t0,pluck(note(m[(k*2)%5]+12),0.9,0.035))
# determination build (96bpm)
beat=60/96
for i,c in enumerate(['Bb','C','Dm','F','Bb','C']): chord(c,17.0+i*1.85,1.85,0.05+0.01*i,7)
for k in range(int(10.9/beat)):
    t0=17.0+k*beat; g=0.12+0.25*min(1,(t0-17)/8)
    if t0>19: add(mus,t0,kick(g))
    if t0>21: add(mus,t0+beat/2,pluck(note(74+[0,3,7,10][k%4]),0.6,0.03))
# confident corporate
for i,c in enumerate(['F','C','Dm','Bb','F','C','Dm','Bb','C']): chord(c,27.9+i*1.95,1.95,0.05,6)
for k in range(int(17.5/beat)):
    t0=27.9+k*beat
    if k%2==0: add(mus,t0,kick(0.22))
    m=ch[['F','C','Dm','Bb','F','C','Dm','Bb','C'][min(8,int((t0-27.9)/1.95))]]
    add(mus,t0,pluck(note(m[(k)%5]+12),0.7,0.03))
# resolution
for i,c in enumerate(['Bb','C','F','Dm','Bb','C']): chord(c,45.4+i*2.0,2.0,0.05,6)
add(mus,57.4,pad([note(m) for m in ch['F']],2.6,0.06,6))
for k in range(int(12/beat)):
    t0=45.4+k*beat
    if t0<57: add(mus,t0,kick(0.18) if k%2==0 else pluck(note(77),0.5,0.02))
# sonic signature
for i,m in enumerate([65,69,72,77]): add(mus,58.1+i*0.14,bell(note(m+12),1.9,0.07))
add(mus,58.1,kick(0.3))
# ----- SFX -----
def thud(g=0.4):
    n=int(0.5*SR);t=tt(n);return (np.sin(2*np.pi*(60+40*np.exp(-t*20))*t)*np.exp(-t*8)+rng.standard_normal(n)*np.exp(-t*30)*0.3)*g
def sparkle(start,count=8,g=0.05,span=0.8):
    for k in range(count): add(sfx,start+rng.random()*span,bell(2000+rng.random()*2500,0.6,g))
def click(g=0.2):
    n=int(0.03*SR);return rng.standard_normal(n)*np.exp(-tt(n)*300)*g
def knock(g=0.18):
    n=int(0.12*SR);t=tt(n);return (np.sin(2*np.pi*(220+rng.random()*60)*t)*np.exp(-t*40)+rng.standard_normal(n)*np.exp(-t*90)*0.4)*g
def step(g=0.1):
    n=int(0.08*SR);t=tt(n);x=rng.standard_normal(n)*np.exp(-t*60);return np.convolve(x,np.ones(8)/8,'same')*g
add(sfx,1.4,noise_sweep(0.9,200,900,0.05))          # rumble glow
add(sfx,2.2,noise_sweep(0.5,600,2500,0.12)); add(sfx,2.25,thud(0.35))  # chest open
sparkle(2.3,14,0.05,1.0); add(sfx,2.3,bell(note(86),2.5,0.06))
add(sfx,3.4,click(0.25)); add(sfx,3.42,bell(note(93),1.5,0.05)); sparkle(3.5,5,0.035)
add(sfx,4.4,noise_sweep(0.8,300,1500,0.06))
for i in range(10): add(sfx,5.1+i*0.15,pluck(note(72+[0,4,7,12][i%4]),0.4,0.04))  # villa build
add(sfx,8.3,noise_sweep(0.7,300,4000,0.14))  # iris
add(sfx,9.45,pluck(note(79),0.8,0.05)); 
for i in range(4): add(sfx,10.0+i*0.12,pluck(note(84+i*2),0.5,0.04))
add(sfx,10.4,noise_sweep(0.3,1000,3000,0.06)); add(sfx,10.8,noise_sweep(1.6,400,1200,0.05))
add(sfx,12.5,noise_sweep(0.5,2000,500,0.07))
add(sfx,13.0,noise_sweep(1.3,3000,5000,0.03))  # blueprint drawing
add(sfx,15.1,thud(0.12))
add(sfx,16.6,noise_sweep(0.7,300,3500,0.12))
for k in range(5): add(sfx,17.25+k*0.29,step(0.12))
add(sfx,18.65,noise_sweep(0.6,800,200,0.06))
add(sfx,21.0,bell(note(74),3,0.08)); add(sfx,21.0,kick(0.4)); sparkle(21.0,10,0.04,0.8)
for i in range(16): add(sfx,21.9+i*0.08,knock(0.12))
for k in range(12): add(sfx,23.3+k*0.28,step(0.1*(1-k/16)))
add(sfx,26.2,bell(note(81),2,0.05))
add(sfx,27.15,noise_sweep(0.6,500,4000,0.12)); add(sfx,27.9,bell(note(77),2.5,0.07)); add(sfx,28.0,bell(note(84),2.5,0.05)); sparkle(27.9,8,0.03,1.0)
add(sfx,29.9,noise_sweep(0.8,300,1500,0.05))
for k in range(4): add(sfx,30.15+k*0.27,step(0.08))
add(sfx,32.0,click(0.15)); add(sfx,32.02,bell(note(96),0.5,0.03))
for i in range(4): add(sfx,32.2+i*0.28,pluck(note(79+i*3),0.6,0.045))
add(sfx,34.6,bell(note(88),1.5,0.04)); add(sfx,35.5,noise_sweep(0.5,2000,600,0.05))
add(sfx,36.2,bell(note(91),1.2,0.05)); sparkle(36.2,6,0.03)
for k in range(5): add(sfx,37.5+k*0.04,bell(3000+rng.random()*2000,0.3,0.05))  # key jingle
add(sfx,38.55,noise_sweep(0.7,400,5000,0.14)); sparkle(38.7,8,0.03)
for k in range(4): add(sfx,39.9+k*0.22,noise_sweep(0.15,2000,4000,0.03))
add(sfx,40.7,bell(note(84),2,0.06)); add(sfx,41.7,noise_sweep(0.5,600,2000,0.06)); add(sfx,42.4,noise_sweep(0.3,1500,800,0.05))
add(sfx,43.6,noise_sweep(1.8,200,1500,0.06)); add(sfx,45.1,noise_sweep(0.7,400,5000,0.14))
add(sfx,45.55,bell(note(77),2.5,0.07)); add(sfx,45.6,bell(note(81),2.5,0.05)); sparkle(45.6,8,0.03,1.0)
add(sfx,50.9,noise_sweep(0.6,300,2000,0.06))
for i in range(7): add(sfx,51.3+i*0.13,pluck(note(84+[0,2,4,5,7,9,12][i]),0.4,0.03))
sparkle(57.4,8,0.03,1.0)
# ----- MIX -----
with wave.open('vo.wav') as w: vo=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(float)/32768
V=np.zeros(N); add(V,OFF,vo*1.0)
envv=np.convolve(np.abs(V),np.ones(4410)/4410,'same'); duck=1-0.5*np.clip(envv/0.05,0,1)
duck=np.convolve(duck,np.ones(8820)/8820,'same')
m=mus/ (np.abs(mus).max()+1e-9)*0.32*duck
out=V*0.95+m+sfx*0.9
fade=np.ones(N); fade[-int(0.4*SR):]=np.linspace(1,0,int(0.4*SR)); out*=fade
out=np.tanh(out*1.1)/np.tanh(1.1)
out=out/np.abs(out).max()*0.93
st=np.stack([out,out],1)
with wave.open('mix.wav','w') as w:
    w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((st*32767).astype(np.int16).tobytes())
print('done')
