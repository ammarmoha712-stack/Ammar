import numpy as np,subprocess,json,wave
SR=44100
raw=subprocess.run(['ffmpeg','-v','error','-i','vo.mp3','-ac','1','-ar',str(SR),'-f','f32le','-'],capture_output=True).stdout
x=np.frombuffer(raw,np.float32).astype(float)
gaps=[(2.16356,2.85989),(5.58,6.10776),(9.12683,9.54327),(12.6283,13.1621),(13.7444,14.2212),(15.1508,15.6026),(19.5302,20.0544),(25.9025,26.5198),(35.1431,35.5962),(41.273,41.7681),(47.6583,48.0779),(51.1928,51.7089),(52.8792,53.3985),(54.5126,55.2038),(56.7655,57.2281),(59.3987,59.8718),(61.1138,61.6047)]
KEEP=.40
cuts=[]
for a,b in gaps:
    d=b-a
    if d>KEEP:
        rem=d-KEEP;ca=a+KEEP/2;cuts.append((ca,ca+rem))
# build
segs=[];prev=0;fx=int(.015*SR)
for a,b in cuts:
    segs.append(x[int(prev*SR):int(a*SR)]);prev=b
segs.append(x[int(prev*SR):])
out=segs[0]
for s in segs[1:]:
    r=np.linspace(1,0,fx);out=np.concatenate([out[:-fx],out[-fx:]*r+s[:fx]*(1-r),s[fx:]])
def fwd(t):
    rem=sum(min(max(t-a,0),b-a) for a,b in cuts);return t-rem
end=fwd(64.8748)
tempo=end/59.35
print('removed',sum(b-a for a,b in cuts),'end',end,'tempo',tempo)
with wave.open('vo_trim.wav','wb') as w:
    w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((np.clip(out,-1,1)*32767).astype(np.int16).tobytes())
subprocess.run(['ffmpeg','-y','-v','error','-i','vo_trim.wav','-af',f'atempo={tempo:.5f}','vo_final.wav'])
cues={'hook':0.15,'msg':2.86,'msg2':4.67,'dis':6.11,'dis2':7.37,'dis3':9.54,'qasab':13.16,'nw':14.22,'gold':15.6,'cent':17.91,'land':20.05,'gen':22.8,'houses':26.52,'alleys':27.95,'markets':29.61,'majlis':30.95,'past':32.55,'corr':35.6,'works':36.9,'cult':38.44,'horse':41.77,'poetry':43.36,'cars':44.6,'cook':46.32,'scenes':48.08,'brand':51.71,'musafir':53.4,'slog1':55.2,'slog2':57.23,'cta1':59.87,'cta2':61.6,'end':64.87}
C={k:round(fwd(v)/tempo,3) for k,v in cues.items()}
json.dump(C,open('cues.json','w'));print(C)
