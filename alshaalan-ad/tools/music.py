# Synthesizes an original corporate music bed + SFX (no third-party audio). Usage: python3 music.py out.wav
import numpy as np, wave, sys
SR=44100; DUR=46.5; n=int(SR*DUR); t=np.arange(n)/SR
L=np.zeros(n); R=np.zeros(n)
def note(f): return 440*2**((f-69)/12)
def env(N,a,r):
    e=np.ones(N); A=int(a*SR); Rr=int(r*SR)
    e[:A]=np.linspace(0,1,A); e[-Rr:]*=np.linspace(1,0,Rr); return e
def add(sig,start,pan=0.5,g=1.0):
    i=max(0,int(start*SR)); j=min(n,i+len(sig))
    if j<=i: return
    s=sig[:j-i]*g
    L[i:j]+=s*(1-pan)*1.4; R[i:j]+=s*pan*1.4
BPM=96; beat=60/BPM; bar=4*beat
prog=[[48,55,64,71],[45,52,60,67,71],[41,48,57,64],[43,50,59,62,67]]  # Cmaj7 Am9 Fmaj7 G
nb=int(DUR/bar)+1
for b in range(nb):
    ch=prog[b%4]; st=b*bar; N=int((bar+1.2)*SR); tt=np.arange(N)/SR
    for k,m in enumerate(ch):
        f=note(m); pad=sum(np.sin(2*np.pi*f*d*tt+k) for d in (0.997,1.0,1.004))/3
        pad+=0.25*np.sin(2*np.pi*2*f*tt)
        add(pad*env(N,1.2,1.4)*0.05,st,pan=0.3+0.1*k)
    # bass
    N2=int(bar*SR); tt2=np.arange(N2)/SR; bf=note(ch[0]-12)
    add(np.sin(2*np.pi*bf*tt2)*env(N2,.05,.6)*0.10,st)
    # plucked arpeggio (8ths) from bar 1 on
    if b>=1:
        arp=[ch[1]+12,ch[2]+12,ch[3]+12 if len(ch)>3 else ch[0]+24,ch[2]+12]
        for s in range(8):
            Np=int(.6*SR); tp=np.arange(Np)/SR; f=note(arp[s%4])
            pl=(np.sin(2*np.pi*f*tp)+.3*np.sin(2*np.pi*2*f*tp))*np.exp(-tp*7)
            add(pl*0.035,st+s*beat/2,pan=0.25+0.5*(s%2))
    # soft pulse kick on beats 1 & 3 from bar 2
    if b>=2:
        for q in (0,2):
            Nk=int(.35*SR); tk=np.arange(Nk)/SR; fk=50+60*np.exp(-tk*30)
            add(np.sin(2*np.pi*np.cumsum(fk)/SR)*np.exp(-tk*10)*0.12,st+q*beat)
rng=np.random.default_rng(7)
def whoosh(at,d=.9,g=.12):
    N=int(d*SR); x=rng.standard_normal(N); y=np.zeros(N); a=0
    for i in range(N):  # sweeping one-pole lowpass
        c=0.02+0.25*np.sin(np.pi*i/N); a+=c*(x[i]-a); y[i]=a
    add(y*np.sin(np.pi*np.arange(N)/N)**2*g*3,at-d/2)
def chime(at,base=84,g=.06):
    for k,m in enumerate([base,base+7,base+12]):
        N=int(2.5*SR); tt=np.arange(N)/SR; f=note(m)
        add((np.sin(2*np.pi*f*tt)+.2*np.sin(2*np.pi*2.76*f*tt))*np.exp(-tt*2.2)*g,at+k*.07,pan=.3+.2*k)
def tick(at,g=.05):
    N=int(.12*SR); tt=np.arange(N)/SR; add(np.sin(2*np.pi*1800*tt)*np.exp(-tt*60)*g,at)
for c in [4.6,12.6,21.1,25.45,29.9,41.35]: whoosh(c)
chime(2.05,79,.05)                     # location pin
for i in range(5): tick(13.0+i*.22,.04)    # apartments
for i in range(17): tick(18.0+i*.1,.025)   # rooms
for i in range(6): tick(21.65+i*.28,.05)   # meters
for c in [25.8,26.9,28.55]: tick(c,.06)    # document checks
for c in [30.05,34.35,37.8]: chime(c,88,.03)  # price cards
chime(41.65,72,.08); chime(44.0,84,.05)       # logo + phone signature
fade=np.ones(n); fi=int(1.0*SR); fo=int(2.5*SR); fade[:fi]=np.linspace(0,1,fi); fade[-fo:]=np.linspace(1,0,fo)
St=np.stack([L*fade,R*fade],1); St/=np.abs(St).max()/0.8
with wave.open(sys.argv[1],'w') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((St*32767).astype('<i2').tobytes())
