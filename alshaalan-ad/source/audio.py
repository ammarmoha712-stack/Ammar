import numpy as np, subprocess
from scipy.signal import butter, sosfilt
SR=48000; DUR=40.0; N=int(SR*DUR); t=np.arange(N)/SR
def note(m): return 440*2**((m-69)/12)
def env_adsr(n,a,r):
    e=np.ones(n); A=int(a*SR); R=int(r*SR)
    e[:A]=np.linspace(0,1,A); e[-R:]*=np.linspace(1,0,R); return e
def lp(x,f,o=2): return sosfilt(butter(o,f,'low',fs=SR,output='sos'),x)
def hp(x,f,o=2): return sosfilt(butter(o,f,'high',fs=SR,output='sos'),x)
def bp(x,f1,f2): return sosfilt(butter(2,[f1,f2],'band',fs=SR,output='sos'),x)
music=np.zeros(N)
bar=2.5; beat=bar/4
# Am  F  C  G  (vi IV I V)
prog=[[57,60,64,69],[53,57,60,65],[48,55,60,64],[55,59,62,67]]
for b in range(16):
    ch=prog[b%4]; s0=int(b*bar*SR); n=int((bar+1.2)*SR); n=min(n,N-s0)
    if n<=0: break
    tt=np.arange(n)/SR; pad=np.zeros(n)
    for m in ch:
        f=note(m)
        for det in (-0.12,0.12):
            ph=2*np.pi*f*(1+det/100)*tt
            pad+=np.sin(ph)+.25*np.sin(2*ph)+.08*np.sin(3*ph)
    pad*=env_adsr(n,.9,1.3)*.035
    music[s0:s0+n]+=pad
    # bass
    f=note(ch[0]-12); nb=min(int(bar*SR),N-s0); tb=np.arange(nb)/SR
    music[s0:s0+nb]+=np.sin(2*np.pi*f*tb)*np.exp(-tb*1.2)*.16*(1 if b>=1 else .5)
    # pluck arpeggio (eighths), starts bar 0 soft, fuller from bar 2
    arp=[ch[0]+12,ch[2]+12,ch[1]+12,ch[3]+12,ch[2]+12,ch[1]+24,ch[3]+12,ch[2]+12]
    for i,m in enumerate(arp):
        st=s0+int(i*beat/2*SR); n2=min(int(.6*SR),N-st)
        if n2<=0: continue
        tp=np.arange(n2)/SR; f=note(m)
        pl=(np.sin(2*np.pi*f*tp)+.3*np.sin(4*np.pi*f*tp))*np.exp(-tp*7)
        music[st:st+n2]+=pl*(.05 if b<2 else .075)
    # soft kick on 1 & 3 from bar 2 to 14
    if 2<=b<15:
        for k in (0,2):
            st=s0+int(k*beat*SR); n3=min(int(.35*SR),N-st); tk=np.arange(n3)/SR
            fk=48+90*np.exp(-tk*30); music[st:st+n3]+=np.sin(2*np.pi*np.cumsum(fk)/SR)*np.exp(-tk*12)*.22
        # shaker on offbeats
        for k in range(4):
            st=s0+int((k+.5)*beat*SR); n4=min(int(.08*SR),N-st)
            music[st:st+n4]+=hp(np.random.randn(n4),6000)*np.exp(-np.arange(n4)/SR*60)*.02
# final resolving chord at 37.6 (C major) ringing out
st=int(37.6*SR); n=N-st; tt=np.arange(n)/SR; fin=np.zeros(n)
for m in (48,55,60,64,67,72):
    fin+=np.sin(2*np.pi*note(m)*tt)*np.exp(-tt*.9)
music[st:]*=np.linspace(1,0,n)**2*0+np.clip(1-tt/0.4,0,1)  # cut groove quickly
music[st:]+=fin*.05
music=lp(music,7000)
# fade in/out
music[:int(.6*SR)]*=np.linspace(0,1,int(.6*SR)); music[-int(.5*SR):]*=np.linspace(1,0,int(.5*SR))

sfx=np.zeros(N)
def add(x,at,g=1.0):
    s0=int(at*SR); n=min(len(x),N-s0)
    if n>0 and s0>=0: sfx[s0:s0+n]+=x[:n]*g
def whoosh(d=.75):
    n=int(d*SR); x=np.random.randn(n); tt=np.arange(n)/SR
    e=np.sin(np.pi*tt/d)**2
    lo=bp(x,300,2500)*.6+bp(x,1500,6000)*.4*(tt/d)
    return lo*e*.22
def pop(f=900):
    n=int(.12*SR); tt=np.arange(n)/SR; fr=f*(1+.5*tt/.12)
    return np.sin(2*np.pi*np.cumsum(fr)/SR)*np.exp(-tt*45)*.16
def click():
    n=int(.03*SR); return hp(np.random.randn(n),3000)*np.exp(-np.arange(n)/SR*200)*.15
def chime(base=76,steps=(0,4,7,12),gap=.07,g=.09):
    out=np.zeros(int((gap*len(steps)+1.6)*SR))
    for i,s in enumerate(steps):
        n=int(1.5*SR); tt=np.arange(n)/SR; f=note(base+s)
        x=(np.sin(2*np.pi*f*tt)+.35*np.sin(2*np.pi*2.01*f*tt))*np.exp(-tt*3.2)
        st=int(i*gap*SR); out[st:st+n]+=x
    return out*g
def shimmer():
    return chime(84,(0,7,12,16,19,24),.05,.05)
def thud():
    n=int(.4*SR); tt=np.arange(n)/SR; f=60+120*np.exp(-tt*25)
    return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-tt*10)*.35

for b in (6.3,12.25,18.4,25.6,32.25): add(whoosh(),b-.42)
for at in (21.2,22.7): add(whoosh(.55),at,.6)
for at in (.75,1.15,1.55,1.95,2.35,2.15,2.85,4.0, 6.55,6.77,6.99, 10.0,10.35,10.7, 18.9,19.05,19.2, 27.0,27.3,27.6,27.9, 34.2,34.5,34.8,35.1): add(pop(),at)
for i,at in enumerate((2.7,2.9,3.1,3.3,3.5)): add(pop(1300),at,.6)
for at in (8.35,8.75,9.05): add(click(),at)
add(chime(76),9.35); add(chime(79),22.55); add(chime(72,(0,7,12,16)),36.5,1.1)
add(shimmer(),12.6); add(shimmer(),13.45,.8); add(shimmer(),33.3); add(shimmer(),38.6,.9); add(shimmer(),32.35,.7)
add(chime(64,(0,7),.12,.07),15.5)
add(thud(),26.6); add(chime(81,(0,5),.1,.06),26.7)
for i in range(7): add(pop(600+i*60),26.9+i*.18,.5)
add(thud(),.3,.5)

# voice-over at +0.4 s with ducking envelope
vo=subprocess.run(['ffmpeg','-loglevel','error','-i','vo.mp3','-f','f32le','-ac','1','-ar',str(SR),'-'],capture_output=True).stdout
vo=np.frombuffer(vo,dtype=np.float32).astype(np.float64)
voice=np.zeros(N); s0=int(.4*SR); voice[s0:s0+len(vo)]=vo[:N-s0]
env=np.sqrt(np.clip(lp(voice**2,4),0,None)); env=np.clip(env/ (env.max()*.25),0,1)
duck=np.clip(1-.55*lp(env,3),.4,1)
mix=voice*1.0+music*duck*.55+sfx*.55
mix/=np.max(np.abs(mix))*1.12
st=np.stack([mix,mix],1)
# slight stereo width on music/sfx
st[:,0]+= (music*duck*.55*.08); st[:,1]-=(music*duck*.55*.08)
import wave
w=wave.open('mix.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((np.clip(st,-1,1)*32767).astype('<i2').tobytes()); w.close(); print('audio ok')
