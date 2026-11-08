import numpy as np, subprocess
from scipy.signal import butter, sosfilt
SR=48000; DUR=41.0; N=int(SR*DUR); t=np.arange(N)/SR
def note(m): return 440*2**((m-69)/12)
def env_adsr(n,a,r):
    e=np.ones(n); A=int(a*SR); R=int(r*SR)
    A=min(A,n); R=min(R,n); e[:A]=np.linspace(0,1,A); e[n-R:]*=np.linspace(1,0,R); return e
def lp(x,f,o=2): return sosfilt(butter(o,f,'low',fs=SR,output='sos'),x)
def hp(x,f,o=2): return sosfilt(butter(o,f,'high',fs=SR,output='sos'),x)
def bp(x,f1,f2): return sosfilt(butter(2,[f1,f2],'band',fs=SR,output='sos'),x)
music=np.zeros(N)
bar=2.5; beat=bar/4
# Am  F  C  G  (vi IV I V)
prog=[[50,57,62,66],[47,54,59,62],[43,50,55,59],[45,52,57,61]]
for b in range(17):
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
st=int(39.5*SR); n=N-st; tt=np.arange(n)/SR; fin=np.zeros(n)
for m in (50,57,62,66,69,74):
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

for b in (6.2,12.4,18.2,23.75,30.05,34.6): add(whoosh(),b-.42)
for at in (1.4,1.9,2.4,2.9,3.4): add(chime(88,(0,5),.06,.05),at)   # notification pings
for at in (1.3,): add(pop(700),at)
for i in range(5): add(pop(1100),7.3+i*.15,.7)
add(shimmer(),6.45); add(chime(76),8.0,.8)
for at in (13.05,14.25,15.15,16.55,17.35): add(pop(1000),at); add(click(),at+.05)
add(chime(79),17.1)
for i in range(5): add(pop(900),18.7+i*.3,.8)
for i in range(5): add(chime(84,(0,7),.05,.04),20.9+i*.22)
add(chime(76),21.3)
for at in (24.0,25.3,26.9): add(pop(),at)
add(whoosh(.6),26.9,.5); add(chime(79,(0,4,7),.07,.08),28.0)
add(thud(),30.4,.6); add(chime(64,(0,7),.12,.07),30.5)
add(shimmer(),34.9); add(shimmer(),39.6,.9)
for at in (35.4,35.7,36.0,36.3): add(pop(),at)
add(chime(72,(0,7,12,16)),39.0,1.0)
add(thud(),.3,.5)
# voice-over at +0.4 s with ducking envelope
vo=subprocess.run(['ffmpeg','-loglevel','error','-i','pm/vo.mp3','-f','f32le','-ac','1','-ar',str(SR),'-'],capture_output=True).stdout
vo=np.frombuffer(vo,dtype=np.float32).astype(np.float64)
voice=np.zeros(N); s0=int(.3*SR); voice[s0:s0+len(vo)]=vo[:N-s0]
env=np.sqrt(np.clip(lp(voice**2,4),0,None)); env=np.clip(env/ (env.max()*.25),0,1)
duck=np.clip(1-.55*lp(env,3),.4,1)
mix=voice*1.0+music*duck*.55+sfx*.55
mix/=np.max(np.abs(mix))*1.12
st=np.stack([mix,mix],1)
# slight stereo width on music/sfx
st[:,0]+= (music*duck*.55*.08); st[:,1]-=(music*duck*.55*.08)
import wave
w=wave.open('pm/mix.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((np.clip(st,-1,1)*32767).astype('<i2').tobytes()); w.close(); print('audio ok')
