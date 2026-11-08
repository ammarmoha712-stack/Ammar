import numpy as np, subprocess, wave
from scipy.signal import butter, sosfilt
SR=48000; DUR=45.0; N=int(SR*DUR)
rng=np.random.default_rng(3)
def note(m): return 440*2**((m-69)/12)
def lp(x,f): return sosfilt(butter(2,f,'low',fs=SR,output='sos'),x)
def hp(x,f): return sosfilt(butter(2,f,'high',fs=SR,output='sos'),x)
def bp(x,a,b): return sosfilt(butter(2,[a,b],'band',fs=SR,output='sos'),x)
def add(buf,x,at,g=1.0):
    s=int(at*SR); n=min(len(x),N-s)
    if n>0 and s>=0: buf[s:s+n]+=x[:n]*g
music=np.zeros(N)
bpm=112; beat=60/bpm; bar=4*beat
prog=[[52,56,59,64],[59,63,66,71],[61,64,68,73],[57,61,64,69]]  # E B C#m A (I V vi IV)
nb=int(DUR/bar)+1
for b in range(nb):
    ch=prog[b%4]; t0=b*bar
    # pad
    n=int((bar+.6)*SR); tt=np.arange(n)/SR; pad=np.zeros(n)
    for m in ch:
        for det in (-.1,.1): ph=2*np.pi*note(m)*(1+det/100)*tt; pad+=np.sin(ph)+.2*np.sin(2*ph)
    e=np.minimum(1,tt/.25)*np.minimum(1,np.maximum(0,(bar+.6-tt)/.6)); add(music,pad*e*.022,t0)
    # bass: syncopated
    for k,(off,ln) in enumerate(((0,.4),(1.5,.3),(2,.4),(3.5,.3))):
        n=int(ln*SR); tt=np.arange(n)/SR; f=note(ch[0]-24 if ch[0]>55 else ch[0]-12)
        add(music,(np.sin(2*np.pi*f*tt)+.3*np.sin(4*np.pi*f*tt))*np.exp(-tt*5)*.2,t0+off*beat)
    # marimba-ish pluck 16ths pattern
    pat=[0,2,1,3,2,1,3,2]
    for i,pi in enumerate(pat):
        m=ch[pi]+12; n=int(.35*SR); tt=np.arange(n)/SR; f=note(m)
        x=(np.sin(2*np.pi*f*tt)+.5*np.sin(2*np.pi*4*f*tt)*np.exp(-tt*30))*np.exp(-tt*10)
        add(music,x*(.05 if b>0 else .03),t0+i*beat/2)
    # drums from bar 1
    if b>=1 and t0<DUR-2:
        for k in range(4):
            n=int(.3*SR); tt=np.arange(n)/SR; f=50+110*np.exp(-tt*35)
            add(music,np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-tt*11)*.3,t0+k*beat)
            n=int(.06*SR); add(music,hp(rng.standard_normal(n),7000)*np.exp(-np.arange(n)/SR*70)*.03,t0+(k+.5)*beat)
        for k in (1,3):
            n=int(.18*SR); tt=np.arange(n)/SR
            add(music,bp(rng.standard_normal(n),900,4000)*np.exp(-tt*22)*.12,t0+k*beat)
# ending hit
n=int(2.5*SR); tt=np.arange(n)/SR; fin=sum(np.sin(2*np.pi*note(m)*tt) for m in (52,59,64,68,71,76))*np.exp(-tt*1.3)
s=int(43.4*SR); music[s:]*=np.clip(1-np.arange(N-s)/SR/.3,0,1); add(music,fin*.05,43.4)
music=lp(music,9000); music[:int(.4*SR)]*=np.linspace(0,1,int(.4*SR)); music[-int(.4*SR):]*=np.linspace(1,0,int(.4*SR))

sfx=np.zeros(N)
def whoosh(d=.7):
    n=int(d*SR); tt=np.arange(n)/SR; x=rng.standard_normal(n); e=np.sin(np.pi*tt/d)**2
    return (bp(x,300,2500)*.6+bp(x,1500,6000)*.4*tt/d)*e*.22
def pop(f=900):
    n=int(.12*SR); tt=np.arange(n)/SR; return np.sin(2*np.pi*np.cumsum(f*(1+.5*tt/.12))/SR)*np.exp(-tt*45)*.16
def chime(base=76,steps=(0,4,7,12),gap=.07,g=.09):
    out=np.zeros(int((gap*len(steps)+1.6)*SR))
    for i,s_ in enumerate(steps):
        n=int(1.5*SR); tt=np.arange(n)/SR; f=note(base+s_)
        out[int(i*gap*SR):int(i*gap*SR)+n]+=(np.sin(2*np.pi*f*tt)+.35*np.sin(2*np.pi*2.01*f*tt))*np.exp(-tt*3.2)
    return out*g
def thud(g=.35):
    n=int(.4*SR); tt=np.arange(n)/SR; return np.sin(2*np.pi*np.cumsum(60+120*np.exp(-tt*25))/SR)*np.exp(-tt*10)*g
def coin():
    return chime(88,(0,5),.05,.06)
def clank():
    n=int(.2*SR); tt=np.arange(n)/SR; return (np.sin(2*np.pi*620*tt)+.6*np.sin(2*np.pi*1530*tt))*np.exp(-tt*28)*.07+hp(rng.standard_normal(n),2000)*np.exp(-tt*60)*.05
def swish_down():
    n=int(.35*SR); tt=np.arange(n)/SR; return hp(rng.standard_normal(n),1500)*np.exp(-tt*8)*.05
for b in (5.0,10.0,15.3,21.0,26.0,32.0,38.0): add(sfx,whoosh(),b-.4)
add(sfx,whoosh(.6),41.0,.6)
for i in range(4): add(sfx,pop(),1.0+i*.3)
for t in (5.9,6.2,6.5,6.8,7.1,7.4,7.7,8.0): add(sfx,swish_down(),t); add(sfx,coin(),t+.4,.7)
for t in (6.5,6.8,7.2): add(sfx,pop(500),t,.8)
for j in range(9): add(sfx,pop(1400),6.0+j*.29,.35)
add(sfx,whoosh(.8),9.9,.8)
add(sfx,chime(76,(0,4,7)),10.4)
add(sfx,thud(.5),13.95); add(sfx,chime(80,(0,4,7,12,16,19),.05,.11),13.95)
for k in range(32): add(sfx,clank(),16.2+3.2*k/32)
add(sfx,chime(76),19.5)
add(sfx,whoosh(.5),21.9,.6); add(sfx,thud(.45),22.5)
for i in range(4): add(sfx,pop(1500),22.6+i*.12,.6)
add(sfx,chime(79),24.3)
add(sfx,pop(),26.8); add(sfx,pop(),28.0); add(sfx,pop(),28.35); add(sfx,chime(84,(0,7),.06,.06),29.0)
for i in range(6): add(sfx,pop(1100+i*80),33.2+i*.18,.8)
add(sfx,chime(88,(0,5),.06,.07),35.85)
add(sfx,thud(.4),39.4); add(sfx,chime(64,(0,7),.12,.07),39.5)
for i in range(4): add(sfx,pop(),38.3+i*.25)
add(sfx,chime(84,(0,7,12,16,19,24),.05,.05),41.2)
for t in (41.7,41.95,42.2,42.45): add(sfx,pop(),t)
add(sfx,chime(76,(0,4,7,12)),43.3)

vo=np.frombuffer(subprocess.run(['ffmpeg','-loglevel','error','-i','fm/vo.mp3','-f','f32le','-ac','1','-ar',str(SR),'-'],capture_output=True).stdout,np.float32).astype(float)
CH=[(0.0,2.35,.5),(2.55,5.12,5.5),(5.2,9.85,10.25),(9.95,13.92,15.8),(13.95,16.25,21.35),(16.27,18.95,26.35),(19.0,23.3,32.35),(23.32,25.78,38.3),(25.8,28.37,41.4)]
voice=np.zeros(N)
for a,b,at in CH:
    seg=vo[int(a*SR):int(b*SR)].copy(); f=int(.02*SR); seg[:f]*=np.linspace(0,1,f); seg[-f:]*=np.linspace(1,0,f); add(voice,seg,at)
env=np.sqrt(np.clip(lp(voice**2,4),0,None)); env=np.clip(env/(env.max()*.25),0,1)
duck=np.clip(1-.5*lp(env,3),.45,1)
mix=voice+music*duck*.6+sfx*.55
mix/=np.max(np.abs(mix))*1.12
st=np.stack([mix+music*duck*.05,mix-music*duck*.05],1)
w=wave.open('fm/mix.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((np.clip(st,-1,1)*32767).astype('<i2').tobytes()); w.close(); print('audio ok')
