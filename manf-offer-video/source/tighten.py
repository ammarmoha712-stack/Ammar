import numpy as np, wave, sys
w=wave.open('build/vo.wav'); sr=w.getframerate(); a=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)
sil=[(1.623,1.917),(5.365,5.712),(10.381,10.614),(12.398,12.640),(14.408,14.638),(16.702,16.921),(18.786,18.952),(20.323,20.706),(23.146,23.279),(24.477,24.615),(27.155,27.444),(29.488,29.831),(30.947,31.111),(33.900,34.116)]
keep_gap={5.365:0.20,14.408:0.20,23.146:0.18,29.488:0.20}  # scene boundaries
out=[];cur=0.0;mapping=[]
for s,e in sil:
    g=keep_gap.get(s,0.10)
    out.append(a[int(cur*sr):int(s*sr)]); out.append(np.zeros(int(g*sr),np.float32))
    cur=e
out.append(a[int(cur*sr):])
b=np.concatenate(out)
print('tightened',len(b)/sr)
# new timestamps of speech-starts
t=0;cur=0
for s,e in sil:
    g=keep_gap.get(s,0.10); t+= (s-cur); print(f'orig {e:.2f} -> new {t+g:.2f}'); t+=g; cur=e
wo=wave.open('build/vo_tight.wav','wb');wo.setnchannels(1);wo.setsampwidth(2);wo.setframerate(sr);wo.writeframes(b.astype(np.int16).tobytes())
