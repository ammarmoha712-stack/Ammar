# Original synthesized tech-corporate bed + SFX for the Sawahel launch ad. Usage: python3 music.py out.wav
import numpy as np, wave, sys
SR=44100; DUR=48.6; n=int(SR*DUR); L=np.zeros(n); R=np.zeros(n)
def note(m): return 440*2**((m-69)/12)
def env(N,a,r):
    e=np.ones(N); A=max(1,int(a*SR)); Rr=max(1,int(r*SR)); e[:A]=np.linspace(0,1,A); e[-Rr:]*=np.linspace(1,0,Rr); return e
def add(sig,start,pan=.5,g=1.):
    i=max(0,int(start*SR)); j=min(n,i+len(sig))
    if j<=i: return
    s=sig[:j-i]*g; L[i:j]+=s*(1-pan)*1.4; R[i:j]+=s*pan*1.4
def lvl(t):  # energy curve
    if t<8.4: return .35
    if t<29.6: return .65
    if t<37.6: return 1.0
    return .55
BPM=110; beat=60/BPM; bar=4*beat
prog=[[45,52,60,64,67],[41,48,57,60,64],[48,55,64,67,71],[43,50,59,62,67]]  # Am9 Fmaj7 Cmaj7 G
nb=int(DUR/bar)+1
for b in range(nb):
    st=b*bar; ch=prog[b%4]; e=lvl(st+.1)
    N=int((bar+1)*SR); tt=np.arange(N)/SR
    for k,m in enumerate(ch[1:]):
        f=note(m); pad=sum(np.sin(2*np.pi*f*d*tt+k) for d in (.996,1,1.005))/3
        add(pad*env(N,.9,1.0)*.04,st,pan=.25+.15*k)
    N2=int(bar*SR); t2=np.arange(N2)/SR
    if st>=8.0: add(np.sin(2*np.pi*note(ch[0]-12)*t2)*env(N2,.03,.4)*(.08 if e<1 else .13),st)
    if st>=8.0:
        arp=[ch[2]+12,ch[3]+12,ch[4]+12,ch[3]+12]; div=4 if e<1 else 4
        for s in range(4*div):
            Np=int(.35*SR); tp=np.arange(Np)/SR; f=note(arp[s%4])
            pl=(np.sign(np.sin(2*np.pi*f*tp))*.25+np.sin(2*np.pi*f*tp))*np.exp(-tp*14)
            add(pl*.022*(1.3 if e>=1 else 1),st+s*beat/div,pan=.2+.6*(s%2))
    if 15.0<=st<37.6:
        for q in range(4):
            if e<1 and q%2: continue
            Nk=int(.3*SR); tk=np.arange(Nk)/SR; fk=48+70*np.exp(-tk*35)
            add(np.sin(2*np.pi*np.cumsum(fk)/SR)*np.exp(-tk*9)*(.16 if e>=1 else .1),st+q*beat)
    if 29.6<=st<37.6:
        rng0=np.random.default_rng(b)
        for q in range(8):
            Nh=int(.05*SR); add(rng0.standard_normal(Nh)*np.exp(-np.arange(Nh)/SR*90)*.03,st+q*beat/2+beat/4,pan=.65)
rng=np.random.default_rng(3)
def noise_sweep(at,d,g,up=True):
    N=int(d*SR); x=rng.standard_normal(N); y=np.zeros(N); a=0
    for i in range(N):
        c=(0.01+0.3*(i/N)) if up else (0.02+0.25*np.sin(np.pi*i/N)); a+=c*(x[i]-a); y[i]=a
    w=np.linspace(0,1,N)**2 if up else np.sin(np.pi*np.arange(N)/N)**2
    add(y*w*g*3,at)
def whoosh(at): noise_sweep(at-.45,.9,.1,False)
def click(at,g=.07):
    N=int(.06*SR); tt=np.arange(N)/SR; add((np.sin(2*np.pi*2400*tt)+.5*np.sin(2*np.pi*1200*tt))*np.exp(-tt*80)*g,at)
def tick(at,g=.02):
    N=int(.03*SR); add(rng.standard_normal(N)*np.exp(-np.arange(N)/SR*160)*g,at)
def chime(at,base=84,g=.05):
    for k,m in enumerate([base,base+4,base+7,base+12]):
        N=int(2.2*SR); tt=np.arange(N)/SR; f=note(m)
        add((np.sin(2*np.pi*f*tt)+.2*np.sin(2*np.pi*2.76*f*tt))*np.exp(-tt*2.5)*g,at+k*.06,pan=.3+.12*k)
def impact(at,g=.35):
    N=int(1.2*SR); tt=np.arange(N)/SR; fk=40+60*np.exp(-tt*12)
    add(np.sin(2*np.pi*np.cumsum(fk)/SR)*np.exp(-tt*3.5)*g,at); noise_sweep(at,.4,.05,False)
for c in [8.45,15.4,23.1,26.6,37.65]: whoosh(c)
for c in [11.1,11.85,12.45,14.95,21.05,26.2]: click(c)
for i in range(7):
    a=15.75+i*.68+.08
    for k in range(6): tick(a+k*.07)
for i in range(6):
    a=26.95+i*.42
    for k in range(4): tick(a+k*.07)
chime(21.3,84,.05)                 # registration sent
noise_sweep(28.2,1.8,.12,True)     # riser into the offer
impact(30.0); impact(31.7,.3); impact(33.2,.4)
chime(34.45,79,.06); chime(35.3,88,.05)
chime(38.0,72,.08); chime(40.2,84,.04)
fade=np.ones(n); fi=int(.8*SR); fo=int(3*SR); fade[:fi]=np.linspace(0,1,fi); fade[-fo:]=np.linspace(1,0,fo)
St=np.stack([L*fade,R*fade],1); St/=np.abs(St).max()/0.8
with wave.open(sys.argv[1],'w') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((St*32767).astype('<i2').tobytes())
