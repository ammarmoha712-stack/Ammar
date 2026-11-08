import numpy as np, wave
SR=44100; D=68.0; N=int(SR*D); OFF=0.5
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

ch={'Dm':[50,57,62,65,69],'Bb':[46,53,58,62,65],'F':[41,53,57,60,65],'C':[48,55,60,64,67],'Gm':[43,55,58,62,67]}
def chord(name,start,dur,g=0.05,bright=6):
    fs=[note(m) for m in ch[name]]
    add(mus,start,pad(fs,dur+0.8,g,bright)); add(mus,start,pad([fs[0]/2],dur+0.8,g*0.9,3))
beat=60/96
def section(t0,t1,prog,kick_from=None,kick_every=1,arp=True,g=0.05,base=12):
    n=len(prog);L=(t1-t0)/n
    for i,c in enumerate(prog): chord(c,t0+i*L,L,g)
    k=0;t=t0
    while t<t1-0.1:
        m=ch[prog[min(n-1,int((t-t0)/L))]]
        if kick_from is not None and t>=kick_from and k%kick_every==0: add(mus,t,kick(0.2))
        if arp: add(mus,t,pluck(note(m[k%5]+base),0.7,0.03))
        t+=beat/2 if arp=='fast' else beat;k+=1
# 0-9.3 mystery
add(mus,0,pad([note(38),note(45)],9.8,0.06,4)); add(mus,0.2,pad([note(74),note(81)],9.4,0.012,2))
for k in range(12): add(mus,4.3+k*0.4,pluck(note([74,77,81,86][k%4]),0.8,0.025))
section(9.25,14.1,['Dm','Bb','F','C'],arp='fast')
section(14.1,26.3,['Bb','C','Dm','F','Bb','C'],kick_from=16.3,g=0.055)
section(26.3,33.3,['F','C','Dm','Bb'],kick_from=26.3,kick_every=2)
section(33.3,45.4,['Dm','Bb','F','C','Dm','Bb'],kick_from=35.4,kick_every=1,g=0.05)
section(45.4,54.6,['F','Bb','C','F'],kick_from=45.4,kick_every=2)
section(54.6,65.0,['Bb','C','F','Dm','Bb','C'],kick_from=54.6,kick_every=2,g=0.045)
add(mus,65.0,pad([note(m) for m in ch['F']],3.0,0.06,6))
for i,m in enumerate([65,69,72,77]): add(mus,65.3+i*0.14,bell(note(m+12),2.2,0.07))
add(mus,65.3,kick(0.3))
# ---- SFX ----
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
def steps(t0,t1,rate=1.8,g=0.1):
    t=t0
    while t<t1: add(sfx,t,step(g)); t+=1/(rate*2)
add(sfx,1.2,noise_sweep(0.9,200,900,0.05))
add(sfx,2.1,noise_sweep(0.5,600,2500,0.12)); add(sfx,2.15,thud(0.35)); sparkle(2.2,14,0.05,1.0); add(sfx,2.2,bell(note(86),2.5,0.06))
add(sfx,3.1,click(0.25)); add(sfx,3.12,bell(note(93),1.5,0.05)); sparkle(3.2,5,0.035)
for i in range(10): add(sfx,4.7+i*0.15,pluck(note(72+[0,4,7,12][i%4]),0.4,0.04))
add(sfx,5.75,noise_sweep(0.3,1000,3000,0.06)); add(sfx,7.25,bell(note(84),1.2,0.04))
add(sfx,8.75,noise_sweep(0.7,300,4000,0.14))
add(sfx,9.6,pluck(note(79),0.8,0.05))
for i in range(4): add(sfx,9.95+i*0.12,pluck(note(84+i*2),0.5,0.04))
add(sfx,10.5,noise_sweep(1.6,400,1200,0.05)); add(sfx,12.0,noise_sweep(0.5,2000,500,0.07))
add(sfx,12.5,noise_sweep(0.9,3000,5000,0.03)); add(sfx,13.3,noise_sweep(0.8,500,2000,0.04))
add(sfx,13.85,noise_sweep(0.7,300,3500,0.12))
steps(14.35,15.4,1.7,0.12); add(sfx,15.5,noise_sweep(0.6,800,200,0.06))
add(sfx,15.7,bell(note(74),3,0.08)); add(sfx,15.7,kick(0.4)); sparkle(15.7,10,0.04,0.8)
for i in range(16): add(sfx,16.35+i*0.085,knock(0.12))
steps(19.7,25.2,1.6,0.08); add(sfx,24.7,bell(note(81),2,0.05))
add(sfx,25.75,noise_sweep(0.6,500,4000,0.12)); add(sfx,26.45,bell(note(77),2.5,0.07)); add(sfx,26.55,bell(note(84),2.5,0.05)); sparkle(26.45,8,0.03,1.0)
add(sfx,28.3,noise_sweep(0.8,300,1500,0.05)); steps(28.55,29.35,1.9,0.08)
add(sfx,30.4,click(0.15)); add(sfx,30.42,bell(note(96),0.5,0.03))
for i in range(4): add(sfx,30.55+i*0.25,pluck(note(79+i*3),0.6,0.045))
add(sfx,32.3,bell(note(88),1.5,0.04)); add(sfx,33.0,noise_sweep(0.6,300,3500,0.1))
add(sfx,34.9,noise_sweep(1.3,800,3000,0.05)); add(sfx,35.45,bell(note(81),1.8,0.05))
steps(35.95,36.9,1.8,0.1); add(sfx,38.3,noise_sweep(0.8,1500,3000,0.03))
add(sfx,39.5,noise_sweep(0.6,400,4000,0.1)); sparkle(39.6,8,0.03,0.6)
steps(40.15,40.9,1.8,0.1)
for i in range(6): add(sfx,40.55+i*0.22,bell(note(84+[0,2,4,5,7,9][i]),0.6,0.035))
add(sfx,41.8,bell(note(79),1.5,0.04)); add(sfx,43.65,pluck(note(84),0.5,0.06)); add(sfx,43.75,pluck(note(91),0.5,0.05))
add(sfx,44.9,noise_sweep(0.7,400,5000,0.14)); sparkle(45.2,6,0.03)
add(sfx,46.3,bell(note(91),1.2,0.05)); sparkle(46.3,6,0.03)
for k in range(5): add(sfx,47.8+k*0.04,bell(3000+rng.random()*2000,0.3,0.05))
add(sfx,48.45,noise_sweep(0.7,400,5000,0.14)); sparkle(48.6,8,0.03)
add(sfx,48.9,noise_sweep(0.4,600,2000,0.05)); add(sfx,49.6,noise_sweep(0.3,1500,800,0.05))
for k in range(4): add(sfx,53.2+k*0.25,noise_sweep(0.15,2000,4000,0.03))
add(sfx,53.95,noise_sweep(0.8,300,4500,0.13))
add(sfx,55.0,bell(note(77),2.5,0.07)); add(sfx,55.1,bell(note(81),2.5,0.05)); sparkle(55.0,8,0.03,1.0)
add(sfx,58.75,noise_sweep(0.6,300,2000,0.06))
for i in range(9): add(sfx,59.1+i*0.1,pluck(note(84+[0,2,4,5,7,9,11,12,14][i]),0.4,0.025))
add(sfx,62.35,pluck(note(84),0.5,0.05)); add(sfx,64.2,bell(note(88),1.2,0.03)); sparkle(64.8,8,0.03,1.0)
# ----- MIX -----
with wave.open('vo2.wav') as w: vo=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(float)/32768
V=np.zeros(N); add(V,OFF,vo*1.0)
envv=np.convolve(np.abs(V),np.ones(4410)/4410,'same'); duck=1-0.5*np.clip(envv/0.05,0,1)
duck=np.convolve(duck,np.ones(8820)/8820,'same')
m=mus/ (np.abs(mus).max()+1e-9)*0.32*duck
out=V*0.95+m+sfx*0.9
fade=np.ones(N); fade[-int(0.4*SR):]=np.linspace(1,0,int(0.4*SR)); out*=fade
out=np.tanh(out*1.1)/np.tanh(1.1)
out=out/np.abs(out).max()*0.93
st=np.stack([out,out],1)
with wave.open('mix2.wav','w') as w:
    w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((st*32767).astype(np.int16).tobytes())
print('done')
