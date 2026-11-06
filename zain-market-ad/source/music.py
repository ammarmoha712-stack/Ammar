import numpy as np, wave
sr=44100;T=43.0;n=int(sr*T);t=np.arange(n)/sr
mus=np.zeros(n);sfx=np.zeros(n)
rng=np.random.default_rng(3)
bpm=104;beat=60/bpm
def add(buf,start,sig,g=1.0):
    i=int(start*sr);j=min(n,i+len(sig))
    if i<n: buf[i:j]+=sig[:j-i]*g
def env(L,a=0.005,d=0.3):
    x=np.arange(int(L*sr))/sr;return np.minimum(x/a,1)*np.exp(-x/d)
def tone(f,L,d=0.3,h=(1,.5,.25)):
    x=np.arange(int(L*sr))/sr;return sum(w*np.sin(2*np.pi*f*(k+1)*x) for k,w in enumerate(h))*env(L,0.005,d)
def kick():
    L=.35;x=np.arange(int(L*sr))/sr;f=50+90*np.exp(-x*30);return np.sin(2*np.pi*np.cumsum(f)/sr)*np.exp(-x*9)
def noise(L,d,hp=True):
    s=rng.standard_normal(int(L*sr))
    if hp: s=np.diff(s,prepend=0)
    return s*env(L,0.001,d)
end=40.3
# progression D Bm G A (Hz roots)
chords=[[293.7,370,440],[246.9,293.7,370],[196,246.9,293.7],[220,277.2,329.6]]
bar=4*beat;k=0;tt=0.0
while tt<end:
    ch=chords[k%4]
    for f in ch: add(mus,tt,tone(f,bar,1.4,(1,.3,.1)),0.05)
    add(mus,tt,tone(ch[0]/2,bar,0.9,(1,.4)),0.10)
    tt+=bar;k+=1
step=beat/4;i=0;tt=0.0
mel=[587.3,659.3,740,880,987.8]
while tt<end:
    s=i%16
    if tt>0.6:
        if s in (0,8,10): add(mus,tt,kick(),0.55)
        if s in (4,12): add(mus,tt,noise(.2,.06),0.18)
        add(mus,tt,noise(.06,.015),0.05 if s%2 else 0.08)   # shaker
        if s in (3,6,11,14): add(mus,tt,tone(180 if s<8 else 240,.25,.08,(1,.2)),0.18)  # djembe-ish tom
        if s in (2,7,13) and rng.random()<.6: add(mus,tt,tone(mel[rng.integers(5)],.4,.18,(1,.4,.2,.1)),0.05)
    tt+=step;i+=1
mus*=np.clip((end+0.4-t)/0.8,0,1)  # fade before signature
def whoosh(at,L=.6,g=.25):
    s=rng.standard_normal(int(L*sr));x=np.arange(len(s))/len(s)
    # crude sweep: moving average with shrinking window
    out=np.convolve(s,np.ones(8)/8,'same')*np.sin(np.pi*x)**2
    add(sfx,at-L/2,out,g)
for a in [3.4,4.0,6.6,10.3,11.9,12.95,15.0,17.05,19.9,22.6,25.2,26.0,32.3,35.9]: whoosh(a)
def pop(at,g=.12): add(sfx,at,tone(900,.08,.03,(1,.3)),g)
for a in [0.3,0.8,1.3,7.2,7.6,10.6,10.9,13.4,17.2,17.5,21.0,21.2,21.4,24.7,36.1,36.4]: pop(a)
for i in range(8): add(sfx,28.05+i*.24,tone(1200+i*60,.12,.04,(1,.2)),0.07)  # digit ticks
# sonic signature
sig=[(36.2,[587.3,880]),(36.45,[740,1174.7]),(36.7,[880,1480]),(40.4,[587.3,740,880,1174.7])]
for a,fs in sig:
    for f in fs: add(sfx,a,tone(f,2.2,0.9 if a>40 else .5,(1,.5,.25,.12)),0.09)
def wr(fn,x):
    x=x/ (np.abs(x).max()+1e-9)*0.9
    w=wave.open(fn,'wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(sr);w.writeframes((x*32767).astype(np.int16).tobytes());w.close()
wr('music.wav',mus);wr('sfx.wav',sfx)
