import numpy as np, subprocess
from scipy.signal import butter, sosfilt
from scipy.io import wavfile
sr=44100; D=35.0; N=int(D*sr); t=np.arange(N)/sr
L=np.zeros(N); R=np.zeros(N)
rs=np.random.default_rng(1)
def add(sig,start,gain=1.0,pan=0.0):
    i=int(start*sr); n=min(len(sig),N-i)
    if n<=0: return
    L[i:i+n]+=sig[:n]*gain*np.sqrt((1-pan)/2); R[i:i+n]+=sig[:n]*gain*np.sqrt((1+pan)/2)
def bp(x,lo,hi): return sosfilt(butter(2,[lo,hi],btype='band',fs=sr,output='sos'),x)
def lp(x,f): return sosfilt(butter(2,f,btype='low',fs=sr,output='sos'),x)
def hp(x,f): return sosfilt(butter(2,f,btype='high',fs=sr,output='sos'),x)
m2f=lambda m:440*2**((m-69)/12)
# --- pad: chords per 2.4s bar
chords=[[50,57,65,72,76],[46,53,62,69,72],[43,50,58,65,69],[45,52,57,62,64]]
bar=2.4
pad=np.zeros((2,N))
for b in range(int(D/bar)+1):
    st=b*bar; ch=chords[b%4]
    if st>=31.2: ch=[50,57,62,66,69,76]  # D major add9 resolve
    if st>31.2+bar: continue
    dur=bar+1.2 if st<31.2 else D-st
    n=int(dur*sr); tt=np.arange(n)/sr
    env=np.minimum(1,tt/0.9)*np.minimum(1,np.maximum(0,(dur-tt)/1.0))
    for m in ch:
        f=m2f(m)
        for k,(det,pn) in enumerate([(-0.15,-.6),(0.15,.6),(0,0)]):
            v=(np.sin(2*np.pi*(f+det*f/100)*tt)+.18*np.sin(4*np.pi*f*tt))*env*.05
            i=int(st*sr); nn=min(n,N-i)
            pad[0,i:i+nn]+=v[:nn]*np.sqrt((1-pn)/2); pad[1,i:i+nn]+=v[:nn]*np.sqrt((1+pn)/2)
padlvl=np.interp(t,[0,4.8,11.7,20,25.5,31,35],[.55,.7,.8,.9,1,1,.8])
L+=pad[0]*padlvl; R+=pad[1]*padlvl
# --- plucks (eighths @100bpm) in sections
beat=0.6
def pluck(f,dec=.35,amp=1):
    n=int(1.2*sr); tt=np.arange(n)/sr
    return (np.sin(2*np.pi*f*tt)+.3*np.sin(4*np.pi*f*tt)+.1*np.sin(6*np.pi*f*tt))*np.exp(-tt/dec)*amp*np.minimum(1,tt/.004)
for sec,(a,b,g) in enumerate([(4.8,11.6,.06),(11.75,20.0,.045),(20.15,25.4,.07),(26.2,34.5,.04)]):
    k=0; x=a
    while x<b:
        ch=chords[int(x/bar)%4] if x<31.2 else [50,57,62,66,69]
        m=ch[[1,2,3,4,3,2][k%6]]+12
        add(pluck(m2f(m)),x,g*(1 if k%2==0 else .7),pan=(.4 if k%2 else -.4)); k+=1; x+=beat/2
# ticks (hihat) during threats & benefits
hh=hp(rs.standard_normal(int(.05*sr)),7000)*np.exp(-np.arange(int(.05*sr))/sr/.012)
for a,b in [(4.8,11.6),(20.15,25.4)]:
    x=a
    while x<b: add(hh,x,.05,pan=.3); x+=beat/2
# soft kick on benefits
kn=int(.4*sr); kt=np.arange(kn)/sr; kick=np.sin(2*np.pi*(55+70*np.exp(-kt/.03))*kt)*np.exp(-kt/.15)
for x in np.arange(20.15,25.4,beat): add(kick,x,.18)
for x in np.arange(11.75,20.0,beat*2): add(kick,x,.09)
# --- SFX
def whoosh(dur=.7,lo=300,hi=5000,g=.3):
    n=int(dur*sr); x=rs.standard_normal(n); out=np.zeros(n); seg=512
    for i in range(0,n,seg):
        f=lo*(hi/lo)**(i/n); y=bp(x[max(0,i-2048):i+seg],f*.7,min(f*1.4,20000))[-min(seg,n-i):]; out[i:i+len(y)]=y
    e=np.sin(np.pi*np.arange(n)/n)**2; return out*e*g
for T in [4.8,11.75,20.15,25.55]: add(whoosh(),T-.4,1.0,pan=-.2); add(whoosh(.7,5000,300,.2),T-.35,1.0,pan=.2)
def tick(f1=2500,f2=6000,d=.03): n=int(.08*sr); return bp(rs.standard_normal(n),f1,f2)*np.exp(-np.arange(n)/sr/d)
def ting(f=3200,d=.25): n=int(.8*sr); tt=np.arange(n)/sr; return (np.sin(2*np.pi*f*tt)+.5*np.sin(2*np.pi*f*1.51*tt)+.3*np.sin(2*np.pi*f*2.3*tt))*np.exp(-tt/d)
def scratch(d=.4): n=int(d*sr); x=bp(rs.standard_normal(n),1800,6000); am=.5+.5*np.abs(np.sin(2*np.pi*35*np.arange(n)/sr)); return x*am*np.sin(np.pi*np.arange(n)/n)
def shimmer(d=.9,base=2600):
    out=np.zeros(int((d+1)*sr))
    for i,m in enumerate([0,4,7,12,16,19]):
        s=ting(base*2**(m/12),.3)*.25; j=int(i*d/6*sr); out[j:j+len(s)]+=s[:len(out)-j]
    return out
hits=[0.8,1.3,1.8,2.3,2.8,3.3,3.8]
for h in hits: add(tick(),h,.35,pan=.4); add(ting(3600,.15),h+.2,.06,pan=-.3)
for s0 in [1.5,2.6,3.5]: add(scratch(),s0,.08,pan=.5)
for u in [.25,.5,.72,.95]: add(tick(1500,5000,.05),4.8+u,.45)
for u in [.05,.35,.65]: add(scratch(),6.0+u,.13)
dn=int(.5*sr); dt=np.arange(dn)/sr; add(np.sin(2*np.pi*110*dt)*np.exp(-dt/.08)+lp(rs.standard_normal(dn),800)*np.exp(-dt/.05)*.6,7.2+.45,.25)
add(shimmer(1.0,1800),8.4,.25)
for i in range(4): add(ting(2400+i*300,.12),9.7+i*.12,.06)
# film stretch 12.45-14.65
n=int(2.3*sr); tt=np.arange(n)/sr; x=rs.standard_normal(n); st=np.zeros(n)
for i in range(0,n,1024):
    f=400*(4000/400)**(i/n); y=bp(x[max(0,i-4096):i+1024],f*.8,f*1.25)[-min(1024,n-i):]; st[i:i+len(y)]=y
glide=np.sin(2*np.pi*np.cumsum(300+700*(tt/2.3)**2)/sr)*.15
add((st+glide)*np.minimum(1,tt/.5)*np.minimum(1,(2.3-tt)/.15)*.25,12.45)
add(shimmer(1.0,2200),14.6,.35)
for x in [16.05,16.5,16.95]: add(ting(1800,.2),x,.08)
add(tick(1500,5000,.05),18.75,.45,pan=.4); add(ting(3400,.3),18.75,.15,pan=-.4)
for i in range(4): add(ting(m2f([74,77,81,86][i]),.5),20.15+.3+i*.8,.12)
# logo signature
sig=np.zeros(int(4*sr)); tt=np.arange(len(sig))/sr
for m in [62,69,74,78,81,88]:
    f=m2f(m); sig+=(np.sin(2*np.pi*f*tt)+.4*np.sin(2*np.pi*f*2.76*tt)*np.exp(-tt/.4))*np.exp(-tt/1.6)*.12
sig+=np.sin(2*np.pi*55*tt)*np.exp(-tt/.5)*.25
add(sig,25.95,.9); add(shimmer(1.2,2400),26.45,.25)
for i,x in enumerate([31.15,31.35,31.55,31.75]): add(ting(m2f(81+i*2),.25),x,.07)
add(shimmer(1.4,2000),33.6,.15)
# riser into reveal
add(whoosh(1.2,200,6000,.25),10.6,1.0)
# --- duck under VO
VO="/root/.claude/uploads/ca301f17-5930-578f-9948-98beb3f68ad3/dedd1f55-ElevenLabs_2026-11-12T19_51_35__Abdullah_-_Natural_pvc_s50_sim75_v4.mp3"
v=np.frombuffer(subprocess.run(["ffmpeg","-v","quiet","-i",VO,"-f","f32le","-ac","1","-ar",str(sr),"-"],capture_output=True).stdout,np.float32)[:N]
v=np.pad(v,(0,N-len(v)))
env=lp(np.abs(v),4); env=env/env.max(); env=np.clip(env*3,0,1)
duck=1-.45*env
L*=duck; R*=duck
L[-int(.6*sr):]*=np.linspace(1,0,int(.6*sr)); R[-int(.6*sr):]*=np.linspace(1,0,int(.6*sr))
mx=np.abs(np.stack([L,R])).max(); out=np.stack([L,R],1)/mx*.5
wavfile.write('music.wav',sr,out.astype(np.float32))
print('ok')
