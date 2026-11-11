import numpy as np, subprocess, json, glob
SR=48000
VO=glob.glob('/root/.claude/uploads/fa088520-1eee-5cc9-9f62-9b9b7762ce22/a36375d9*.mp3')[0]
def load(path, af=None):
    cmd=['ffmpeg','-v','error','-i',path]+(['-af',af] if af else [])+['-ac','1','-ar',str(SR),'-f','f32le','-']
    return np.frombuffer(subprocess.run(cmd,capture_output=True).stdout,dtype=np.float32).copy()
def save(path,x,ch=1):
    p=subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(SR),'-ac',str(ch),'-i','-',path],input=x.astype(np.float32).tobytes())
# speech segments (orig seconds) from silencedetect
sil=[(4.842,5.122),(10.219,10.555),(17.932,18.331),(19.911,20.175),(25.688,26.050),(27.051,27.306),(28.463,28.749),(35.786,36.214),(38.311,38.574),(43.433,43.839),(47.460,47.857),(49.042,49.307),(50.423,50.678)]
segs=[];s=0.0
for a,b in sil: segs.append((s,a)); s=b
F=1.15
vo=load(VO,f'atempo={F}')
start=0.12; gap=0.10
GAPS={10:0.22}  # breath before brand line
out=np.zeros(int(SR*47.0)); t=start; timing=[]
for i,(a,b) in enumerate(segs):
    a2=max(0,a/F-0.02); b2=b/F+0.04
    seg=vo[int(a2*SR):int(b2*SR)].copy()
    n=len(seg); fade=int(0.02*SR); seg[:fade]*=np.linspace(0,1,fade); seg[-fade:]*=np.linspace(1,0,fade)
    i0=int(t*SR); out[i0:i0+n]+=seg[:len(out)-i0]
    timing.append((round(t,2),round(t+n/SR,2))); t+=n/SR+GAPS.get(i+1,gap)
print('vo end',t, timing)
json.dump(timing,open('build/vo_timing.json','w'))
save('build/vo.wav',out)

# ---------------- music synth ----------------
D=43.0; N=int(SR*D); tt=np.arange(N)/SR
def mtof(m): return 440*2**((m-69)/12)
def env_adsr(n,a,r,sr=SR):
    e=np.ones(n); A=min(n,int(a*sr)); R=min(n-A,int(r*sr))
    if R<1: R=1
    e[:A]=np.linspace(0,1,A); e[-R:]*=np.linspace(1,0,R); return e
def lp(x,fc):
    a=np.exp(-2*np.pi*fc/SR); y=np.zeros_like(x); 
    from scipy.signal import lfilter
    return lfilter([1-a],[1,-a],x)
L=np.zeros(N); R=np.zeros(N)
bar=60/84*4  # 84 bpm
# Dm9 - Bbmaj7 - Fmaj7/A - C(add9)
chords=[[50,57,62,65,69,76],[46,53,58,62,65,69],[45,53,57,60,64,72],[48,55,60,62,67,74]]
rng=np.random.default_rng(3)
def pad_note(f,dur,amp):
    n=int(dur*SR); t=np.arange(n)/SR; x=np.zeros(n)
    for det in (-0.12,0,0.11):
        ff=f*2**(det/12/8)
        ph=rng.random()
        saw=2*((ff*t+ph)%1)-1
        x+=saw
    x=lp(lp(x,900),1400)
    return x*env_adsr(n,1.2,1.5)*amp
nb=int(np.ceil(D/bar))+1
for k in range(nb):
    t0=k*bar; ch=chords[k%4]
    for j,m in enumerate(ch):
        dur=bar+1.2; x=pad_note(mtof(m),dur,0.035)
        i0=int(t0*SR); n=min(len(x),N-i0)
        if n<=0: continue
        pan=0.3+0.4*(j/len(ch))
        L[i0:i0+n]+=x[:n]*(1-pan); R[i0:i0+n]+=x[:n]*pan
# piano-like arpeggio from 2 bars, 8th notes
def pluck(f,dur=1.6,amp=0.09):
    n=int(dur*SR); t=np.arange(n)/SR
    x=sum((0.6**h)*np.sin(2*np.pi*f*(h+1)*t*(1+0.0004*h)) for h in range(5))
    return x*np.exp(-t*3.2)*np.minimum(1,t*400)*amp
eighth=bar/8
for k in range(1,nb):
    ch=chords[k%4]; pat=[ch[2],ch[3],ch[4],ch[5]+0 if len(ch)>5 else ch[4],ch[4],ch[3],ch[4],ch[2]+12]
    for s_,m in enumerate(pat):
        t0=k*bar+s_*eighth
        if t0>=D-0.2: break
        amp=0.07 if k<3 else 0.085
        x=pluck(mtof(m+12),amp=amp*(1 if s_%2==0 else 0.7))
        i0=int(t0*SR); n=min(len(x),N-i0); pan=0.35 if s_%2 else 0.65
        L[i0:i0+n]+=x[:n]*(1-pan); R[i0:i0+n]+=x[:n]*pan
# sub bass from bar 3
for k in range(3,nb):
    f=mtof(chords[k%4][0]-12); t0=k*bar; n=int(bar*SR); n=min(n,N-int(t0*SR))
    if n<=0: break
    t=np.arange(n)/SR; x=np.sin(2*np.pi*f*t)*0.12*env_adsr(n,0.05,0.3)
    i0=int(t0*SR); L[i0:i0+n]+=x; R[i0:i0+n]+=x
# soft pulse kick from ~22s (build)
beat=60/84
k=0
while True:
    t0=22.5+k*beat; k+=1
    if t0>38.8: break
    n=int(0.35*SR); t=np.arange(n)/SR
    f=50+80*np.exp(-t*30); x=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*9)*0.16*min(1,(t0-22)/8+0.3)
    i0=int(t0*SR); L[i0:i0+n]+=x; R[i0:i0+n]+=x
def noise_sweep(t0,dur,f0,f1,amp):
    n=int(dur*SR); x=rng.standard_normal(n)
    from scipy.signal import butter,sosfilt
    out=np.zeros(n); blk=1024
    for b in range(0,n,blk):
        fc=f0*(f1/f0)**(b/n); sos=butter(2,[max(60,fc*0.6),min(20000,fc*1.6)],btype='band',fs=SR,output='sos')
        out[b:b+blk]=sosfilt(sos,x[b:b+blk])
    e=np.sin(np.pi*np.linspace(0,1,n))**2
    i0=int(t0*SR); n=min(n,N-i0); return i0,(out*e*amp)[:n]
def add(i0,x,pan=0.5):
    n=len(x); L[i0:i0+n]+=x*(1-pan)*2*0.5; R[i0:i0+n]+=x*pan*2*0.5
transitions=json.load(open('build/cuts.json'))
for tc in transitions:
    i0,x=noise_sweep(max(0,tc-0.35),0.6,400,6000,0.10); add(i0,x)
# riser before price + bass hit
PRICE=json.load(open('build/price_t.json'))
i0,x=noise_sweep(PRICE-2.4,2.4,200,9000,0.08); add(i0,x)
n=int(2.5*SR); t=np.arange(n)/SR; f=40+60*np.exp(-t*12)
hit=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*1.6)*0.42
from scipy.signal import butter,sosfilt
hit+=sosfilt(butter(2,300,fs=SR,output='sos'),rng.standard_normal(n))*np.exp(-t*8)*0.15
i0=int(PRICE*SR); m=min(n,N-i0); L[i0:i0+m]+=hit[:m]; R[i0:i0+m]+=hit[:m]
# chimes at text appearances
def chime(t0,m=86,amp=0.05):
    n=int(1.8*SR); t=np.arange(n)/SR; f=mtof(m)
    x=(np.sin(2*np.pi*f*t)+0.4*np.sin(2*np.pi*f*2.76*t)*np.exp(-t*4)+0.25*np.sin(2*np.pi*f*5.4*t)*np.exp(-t*7))*np.exp(-t*2.5)*amp
    i0=int(t0*SR); n=min(n,N-i0); 
    if n>0: add(i0,x[:n],0.5+0.2*rng.standard_normal())
for t0,m in json.load(open('build/chimes.json')): chime(t0,m)
# master envelope: quiet start, gradual rise, finale lift, fade end
g=np.interp(tt,[0,1.5,10,22,36,39,41.5,43],[0.0,0.7,0.8,0.9,1.0,1.15,1.1,0.0])
L*=g; R*=g
st=np.stack([L,R],1); st/=np.max(np.abs(st))*1.12
save('build/music_dry.wav',st.reshape(-1),2)
