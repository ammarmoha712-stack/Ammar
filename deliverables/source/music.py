import numpy as np, wave, sys
SR=48000;D=48.0;N=int(SR*D);t=np.arange(N)/SR
rng=np.random.default_rng(3)
def rd(p):
    w=wave.open(p);a=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(np.float32)/32768;return a
def env(n,a,r):
    e=np.ones(n);ai=int(a*SR);ri=int(r*SR)
    if ai:e[:ai]=np.linspace(0,1,ai)
    if ri:e[-ri:]*=np.linspace(1,0,ri)
    return e
def place(buf,sig,at,g=1.0):
    i=max(0,int(at*SR));j=min(len(buf),i+len(sig))
    if j>i:buf[i:j]+=sig[:j-i]*g
def note(f,dur,harm=(1,.5,.25,.12),det=0.0,a=.01,r=.3):
    n=int(dur*SR);tt=np.arange(n)/SR;s=np.zeros(n)
    for k,h in enumerate(harm,1):
        for d in ([-det,det] if det else [0]):
            s+=h*np.sin(2*np.pi*f*k*(1+d)*tt+rng.random()*6)
    return s*env(n,a,r)
def lp(x,fc):
    X=np.fft.rfft(x);f=np.fft.rfftfreq(len(x),1/SR);X*=1/(1+(f/fc)**4);return np.fft.irfft(X,len(x))
def hp(x,fc):
    X=np.fft.rfft(x);f=np.fft.rfftfreq(len(x),1/SR);X*=1/(1+(fc/np.maximum(f,1))**4);return np.fft.irfft(X,len(x))
def reverb(x,dec=2.6,mix=.3):
    n=int(dec*SR);ir=rng.standard_normal(n)*np.exp(-np.arange(n)/SR*6.9/dec);ir=lp(ir,6000);ir/=np.sqrt((ir**2).sum())
    L=len(x)+n;F=1<<(L-1).bit_length();y=np.fft.irfft(np.fft.rfft(x,F)*np.fft.rfft(ir,F),F)[:len(x)]
    return x*(1-mix)+y*mix*1.5
m2f=lambda m:440*2**((m-69)/12)
# chords D minor: Dm Bb F C (bar=2.4s)
CH=[[50,57,62,65,69],[46,53,58,62,65],[41,53,57,60,65],[48,55,60,64,67]]
BAR=2.4
pad=np.zeros(N);bass=np.zeros(N);ost=np.zeros(N);perc=np.zeros(N);fx=np.zeros(N)
# intensity curve
def I(x):
    return np.interp(x,[0,3,9.9,10.4,16,16.4,20,29.8,30.2,37.5,38.0,44,47,48],[.35,.55,.75,.45,.55,.7,.85,1.0,.7,.9,.6,.75,.6,0])
nb=int(D/BAR)+1
for b in range(nb):
    st=b*BAR;ch=CH[b%4];g=I(st)
    for m in ch[1:]:
        place(pad,note(m2f(m),BAR+1.2,(1,.35,.18,.08,.04),det=.003,a=.8,r=1.1),st,.05*g)
    place(bass,note(m2f(ch[0]-12),BAR+.2,(1,.3,.1),a=.05,r=.4),st,.22*g)
    # ostinato eighths from 10.4 on
    if st>=10.0:
        for e in range(8):
            ts=st+e*BAR/8;arp=[ch[1],ch[2],ch[3],ch[2],ch[4],ch[3],ch[2],ch[3]][e]+12
            place(ost,note(m2f(arp),.35,(1,.4,.2,.1,.05),a=.004,r=.3)*np.exp(-np.arange(int(.35*SR))/SR*9),ts,.07*I(ts)*(1.3 if e%2==0 else .9))
    # soft pulse kick from 16.4 on, quarter notes
    if st>=16.3 and st<46:
        for q in range(4):
            ts=st+q*BAR/4;n=int(.35*SR);tt=np.arange(n)/SR;f=55+90*np.exp(-tt*30);k=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-tt*9)
            place(perc,k,ts,.28*I(ts)*(1 if q%2==0 else .6))
        # shaker
        for e in range(8):
            ts=st+e*BAR/8+BAR/16;n=int(.08*SR);s=hp(rng.standard_normal(n),6000)*np.exp(-np.arange(n)/SR*50)
            if st>=20:place(perc,s,ts,.05*I(ts))
def boom(at,g=1.0,f0=48):
    n=int(3.0*SR);tt=np.arange(n)/SR;f=f0+60*np.exp(-tt*12);s=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-tt*1.6)
    s+=lp(rng.standard_normal(n),900)*np.exp(-tt*5)*.4;place(fx,s,at,.55*g)
def whoosh(at,dur=.9,g=1.0):
    n=int(dur*SR);tt=np.arange(n)/SR;x=rng.standard_normal(n)
    # sweeping band via short-time filtering: approximate with amplitude-shaped hp/lp mix
    e=np.sin(np.pi*tt/dur)**2;y=lp(x,2500)*e+hp(x,3000)*e**3*.6;place(fx,y,at-dur*.6,.12*g)
def riser(at,dur,g=1.0):
    n=int(dur*SR);tt=np.arange(n)/SR;f=200*2**(tt/dur*3);s=np.sin(2*np.pi*np.cumsum(f)/SR)*(tt/dur)**2*.3+hp(rng.standard_normal(n),2000)*(tt/dur)**3*.25;place(fx,s,at-dur,.25*g)
def chime(at,notes=(74,81,86,90),g=1.0,spread=.07):
    for i,m in enumerate(notes):
        n=int(3*SR);tt=np.arange(n)/SR;f=m2f(m);s=(np.sin(2*np.pi*f*tt)+.4*np.sin(2*np.pi*f*2.76*tt)*np.exp(-tt*4)+.2*np.sin(2*np.pi*f*5.4*tt)*np.exp(-tt*8))*np.exp(-tt*1.3)
        place(fx,s,at+i*spread,.07*g)
def paper(at,g=1.0):
    for k in range(3):
        n=int(.18*SR);tt=np.arange(n)/SR;s=hp(rng.standard_normal(n),1500)*np.exp(-tt*25)*(1+np.sin(tt*300));place(fx,s,at+k*.22,.07*g)
def scan(at,dur):
    n=int(dur*SR);tt=np.arange(n)/SR;f=900+500*tt/dur;s=np.sin(2*np.pi*np.cumsum(f)/SR)*.15*np.sin(np.pi*tt/dur)+hp(rng.standard_normal(n),5000)*.05*np.sin(np.pi*tt/dur);place(fx,s,at,.35)
def shimmer(at,dur=1.8,g=1.0):
    n=int(dur*SR);tt=np.arange(n)/SR;s=np.zeros(n)
    for m in (86,90,93,98):s+=np.sin(2*np.pi*m2f(m)*tt+3*np.sin(2*np.pi*6*tt))
    place(fx,s*np.sin(np.pi*tt/dur)**2*.04,at,g)
boom(0.05,1.0);riser(4.9,2.2,.6);shimmer(5.0,2.5);boom(7.4,.5,40)
riser(10.0,1.2,.8);whoosh(10.0,1.0,1.4);boom(10.15,.9);chime(10.4,g=1.2);shimmer(11.3,1.4,.8)
chime(13.7,(69,74,78),.8);whoosh(16.4,.9,1.2);boom(16.4,.6)
paper(17.0,1.2)
for c in (20.0,22.9,25.2,27.2,28.75):whoosh(c,.6,.8);chime(c+.05,(86,),.6)
riser(29.85,1.5,.6);whoosh(29.9,.9,1.2);boom(29.9,.7);scan(30.4,1.9);shimmer(32.4,2.0,1.1);boom(33.9,.5,42);chime(35.2,(81,86,90),.8)
riser(37.8,2.0,.9);whoosh(37.8,1.0,1.4);boom(38.0,1.2,38);chime(38.15,(62,69,74,78,81),1.6,.09);shimmer(39.2,1.5)
chime(43.9,(74,81),.6);chime(46.7,(62,69,74,81,86),1.5,.12);boom(46.7,.7,36)
music=reverb(pad+ost*0.9,3.0,.35)+bass+perc*0.9
music=lp(music,9000)
fx=reverb(fx,2.2,.3)
vo=rd(sys.argv[1]);v=np.zeros(N);v[:min(N,len(vo))]=vo[:N]
# duck music under VO
a=np.abs(v);k=int(.15*SR);ev=np.convolve(a,np.ones(k)/k,'same');speak=np.clip(ev/0.04,0,1)
sm=np.convolve(speak,np.ones(int(.3*SR))/int(.3*SR),'same');duck=1-.45*sm
fade=np.ones(N);fo=int(1.0*SR);fade[-fo:]=np.linspace(1,0,fo)**1.5
mix=v*1.0+music*duck*0.14+fx*0.17
mix*=fade
mix/=np.max(np.abs(mix))*1.12
st=np.stack([mix,mix],1)
# subtle stereo width from reverb of music
w=wave.open(sys.argv[2],'w');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((st*32767).astype(np.int16).tobytes());w.close()
mo=music*duck*0.9+fx*0.85;mo/=np.max(np.abs(mo))*1.12
w=wave.open(sys.argv[3],'w');w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((mo*fade*32767).astype(np.int16).tobytes());w.close()
print('ok')
