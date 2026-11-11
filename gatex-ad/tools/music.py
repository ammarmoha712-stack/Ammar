# Original synthesized light corporate-aviation bed + SFX for the GATEX announcement. Usage: python3 music.py out.wav
import numpy as np, wave, sys
SR=44100; DUR=119.0; n=int(SR*DUR); L=np.zeros(n); R=np.zeros(n)
def note(m): return 440*2**((m-69)/12)
def env(N,a,r):
    e=np.ones(N); A=max(1,int(a*SR)); Rr=max(1,int(r*SR)); e[:A]=np.linspace(0,1,A); e[-Rr:]*=np.linspace(1,0,Rr); return e
def add(sig,start,pan=.5,g=1.):
    i=max(0,int(start*SR)); j=min(n,i+len(sig))
    if j<=i: return
    s=sig[:j-i]*g; L[i:j]+=s*(1-pan)*1.4; R[i:j]+=s*pan*1.4
BPM=92; beat=60/BPM; bar=4*beat
prog=[[50,57,62,66,69],[47,54,59,62,66],[43,50,55,59,62],[45,52,57,61,64]]  # D  Bm  G  A (bright major)
nb=int(DUR/bar)+1
for b in range(nb):
    st=b*bar; ch=prog[b%4]
    N=int((bar+1)*SR); tt=np.arange(N)/SR
    for k,m in enumerate(ch[1:]):
        f=note(m); pad=sum(np.sin(2*np.pi*f*d*tt+k) for d in (.997,1,1.004))/3
        add(pad*env(N,1.0,1.1)*.035,st,pan=.25+.15*k)
    N2=int(bar*SR); t2=np.arange(N2)/SR
    if st>3: add(np.sin(2*np.pi*note(ch[0]-12)*t2)*env(N2,.04,.5)*.08,st)
    if st>6:
        arp=[ch[2]+12,ch[3]+12,ch[4]+12,ch[3]+12,ch[2]+24,ch[4]+12,ch[3]+12,ch[4]+12]
        for s in range(8):
            Np=int(.5*SR); tp=np.arange(Np)/SR; f=note(arp[s])
            add((np.sin(2*np.pi*f*tp)+.25*np.sin(2*np.pi*2*f*tp))*np.exp(-tp*8)*.022,st+s*beat/2,pan=.2+.6*(s%2))
    if 21<st<108:
        for q in (0,2):
            Nk=int(.3*SR); tk=np.arange(Nk)/SR; fk=50+60*np.exp(-tk*30)
            add(np.sin(2*np.pi*np.cumsum(fk)/SR)*np.exp(-tk*10)*.08,st+q*beat)
        Nh=int(.04*SR)
        for q in range(4): add(np.random.default_rng(b*4+q).standard_normal(Nh)*np.exp(-np.arange(Nh)/SR*120)*.012,st+q*beat+beat/2,pan=.65)
rng=np.random.default_rng(5)
def sweep(at,d,g,shape='bell',lo=.01,hi=.3):
    N=int(d*SR); x=rng.standard_normal(N); y=np.zeros(N); a=0
    for i in range(N):
        c=lo+(hi-lo)*np.sin(np.pi*i/N); a+=c*(x[i]-a); y[i]=a
    add(y*np.sin(np.pi*np.arange(N)/N)**2*g*3,at)
def flyby(at,d=2.6,g=.16):
    N=int(d*SR); tt=np.arange(N)/SR; x=rng.standard_normal(N); y=np.zeros(N); a=0
    for i in range(N):
        c=.02+.12*np.sin(np.pi*i/N)**2; a+=c*(x[i]-a); y[i]=a
    tone=.15*np.sin(2*np.pi*(220-60*tt/d)*tt)
    e=np.sin(np.pi*np.arange(N)/N)**2; pan=np.linspace(.85,.15,N)
    i0=int(at*SR); j=min(n,i0+N); seg=(y*3+tone)*e*g
    L[i0:j]+=seg[:j-i0]*(1-pan[:j-i0])*1.4; R[i0:j]+=seg[:j-i0]*pan[:j-i0]*1.4
def chime(at,base=86,g=.04):
    for k,m in enumerate([base,base+5,base+9]):
        N=int(1.8*SR); tt=np.arange(N)/SR; f=note(m)
        add((np.sin(2*np.pi*f*tt)+.15*np.sin(2*np.pi*2.76*f*tt))*np.exp(-tt*3)*g,at+k*.05,pan=.35+.15*k)
def tick(at,g=.035):
    N=int(.08*SR); tt=np.arange(N)/SR; add(np.sin(2*np.pi*1500*tt)*np.exp(-tt*55)*g,at)
def confirm(at,g=.05):
    for k,m in enumerate([81,88]):
        N=int(.6*SR); tt=np.arange(N)/SR; add(np.sin(2*np.pi*note(m)*tt)*np.exp(-tt*7)*g,at+k*.09)
flyby(.05); flyby(109.6,2.4,.14)
for c in [2.6,21.2,31.0,41.5,50.9,60.7,72.0,87.0]: sweep(c-.4,.9,.07)
chime(1.3,86,.05); chime(4.0,81,.03)
R1=[42.0,44.0,45.4,46.9,48.6,49.9,51.2,52.6,54.1,56.1,58.1,59.4,60.8,62.8,64.8,65.9,67.2,68.8]
R2=[78.8,79.7,80.7,82.0,83.1,84.6]
for c in R1: tick(c-.2)
for c in R2: tick(c-.2,.03)
confirm(24.7); confirm(39.0); confirm(74.6); confirm(89.3)
chime(87.1,79,.04); chime(111.2,86,.06); chime(111.3,74,.04)
fade=np.ones(n); fi=int(1*SR); fo=int(4*SR); fade[:fi]=np.linspace(0,1,fi); fade[-fo:]=np.linspace(1,0,fo)
St=np.stack([L*fade,R*fade],1); St/=np.abs(St).max()/0.8
with wave.open(sys.argv[1],'w') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((St*32767).astype('<i2').tobytes())
