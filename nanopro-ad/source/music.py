import numpy as np, wave, sys
SR=44100; D=90.5; N=int(SR*D); t=np.arange(N)/SR
rng=np.random.default_rng(7)
L=np.zeros(N); R=np.zeros(N)
def add(sig,start,gain=1.0,pan=0.0):
    i=int(start*SR); j=min(N,i+len(sig)); s=sig[:j-i]*gain
    L[i:j]+=s*(1-pan)/1.0; R[i:j]+=s*(1+pan)/1.0
def env(n,a,r):
    e=np.ones(n); ai=int(a*SR); ri=int(r*SR)
    if ai: e[:ai]=np.linspace(0,1,ai)
    if ri: e[-ri:]*=np.linspace(1,0,ri)
    return e
def lp(x,a):  # one-pole lowpass
    y=np.empty_like(x); acc=0.0
    for i in range(len(x)): acc+=a*(x[i]-acc); y[i]=acc
    return y
# --- pad: Dm - Bb - F - C progression, 8s each, detuned saws softened
chords=[[146.83,174.61,220.0],[116.54,146.83,174.61],[174.61,220.0,261.63],[130.81,164.81,196.0]]
pad=np.zeros(N)
for k in range(int(D/8)+1):
    s=k*8; n=int(8.5*SR); tt=np.arange(n)/SR; c=chords[k%4]; seg=np.zeros(n)
    for f in c:
        for dt in(-0.6,0.6):
            seg+=np.sin(2*np.pi*(f+dt)*tt)+0.3*np.sin(2*np.pi*2*(f+dt)*tt)
    seg+=0.8*np.sin(2*np.pi*c[0]/2*tt)
    seg*=env(n,1.2,1.5)
    i=int(s*SR); j=min(N,i+n); pad[i:j]+=seg[:j-i]
pad*=0.6+0.4*np.sin(2*np.pi*0.1*t)
L+=pad*0.035; R+=pad*0.035
# --- kick + hats beat at 100bpm, sections
bpm=100; beat=60/bpm
def kick():
    n=int(.45*SR); tt=np.arange(n)/SR
    f=45+110*np.exp(-tt*28); ph=2*np.pi*np.cumsum(f)/SR
    return np.sin(ph)*np.exp(-tt*7)
def hat():
    n=int(.06*SR); x=rng.standard_normal(n); x=x-lp(x,.3); return x*np.exp(-np.arange(n)/SR*70)
K=kick(); H=hat()
sections=[(5.6,10.5,1.0),(14.0,28.6,0.7),(30.0,38.6,0.8),(43.6,61.9,0.8),(63.2,68.6,0.9),(69.0,85.5,1.0)]
for a,b,g in sections:
    x=a
    while x<b-0.05:
        add(K,x,0.32*g); add(H,x+beat/2,0.05*g,0.3); x+=beat
# --- impacts
def impact():
    n=int(3.0*SR); tt=np.arange(n)/SR
    boom=np.sin(2*np.pi*(38+60*np.exp(-tt*10))*tt)*np.exp(-tt*1.6)
    nz=lp(rng.standard_normal(n),.08)*np.exp(-tt*4)
    metal=sum(np.sin(2*np.pi*f*tt)*np.exp(-tt*d) for f,d in((523,3),(787,4),(1244,5),(1661,6)))*0.12
    return boom*0.9+nz*0.7+metal
IMP=impact()
for x,g in((0.7,.6),(6.8,1.0),(29.85,.9),(42.1,.8),(61.95,.9),(86.0,.8)): add(IMP,x,0.45*g)
# --- risers before impacts
def riser(d):
    n=int(d*SR); tt=np.arange(n)/SR; f=200+1800*(tt/d)**2
    s=np.sin(2*np.pi*np.cumsum(f)/SR)*0.25+ (rng.standard_normal(n)-lp(rng.standard_normal(n),.2))*0.4
    return s*(tt/d)**2
for x,d in((4.8,2.0),(27.9,1.9),(40.2,1.9),(60.1,1.8),(84.0,2.0)): add(riser(d),x,0.12)
# --- whooshes
def whoosh(d=1.2):
    n=int(d*SR); x=rng.standard_normal(n); tt=np.arange(n)/SR
    bp=lp(x,.15)-lp(x,.02); e=np.sin(np.pi*tt/d)**2; return bp*e
W=whoosh()
for x in(5.2,10.3,13.7,28.4,38.6,68.6,85.3): add(W,x,0.5,0.4)
# --- engine rumble
def engine(d,rev=False):
    n=int(d*SR); tt=np.arange(n)/SR; f=32+ (28*(tt/d) if rev else 10*np.sin(tt))
    ph=2*np.pi*np.cumsum(f)/SR; s=np.sign(np.sin(ph))*0.5+np.sin(2*ph)*0.3
    s=lp(s,.04); return s*env(n,.6,.8)
add(engine(4.5),0.3,0.35); add(engine(3.0,True),38.7,0.4); add(engine(2.0,True),68.8,0.3)
# --- sonic logo: shimmering chord
n=int(4*SR); tt=np.arange(n)/SR
logo=sum(np.sin(2*np.pi*f*tt)*np.exp(-tt*1.1)*(1+0.3*np.sin(2*np.pi*5*tt)) for f in(587.33,880,1174.66,1318.5))*0.18
add(logo,86.1,0.8,-0.2); add(logo,86.18,0.6,0.2)
# master fade + normalize
fade=np.ones(N); fi=int(89.6*SR); fade[fi:]=np.linspace(1,0,N-fi)
L*=fade; R*=fade
m=max(np.abs(L).max(),np.abs(R).max()); L/=m*1.12; R/=m*1.12
st=(np.stack([L,R],1)*32767).astype(np.int16)
w=wave.open(sys.argv[1],'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(st.tobytes()); w.close()
