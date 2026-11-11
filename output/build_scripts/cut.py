import subprocess, json
# (out_start, out_end, src_start, zoom_dir)
SEG=[(0.0,4.6,0.0,'in'),(4.6,9.0,4.8,'in'),(9.0,17.1,9.4,'out'),(17.1,24.3,18.3,'in'),
     (24.3,30.6,30.2,'in'),(30.6,32.6,38.6,'out'),(32.6,37.1,25.4,'in'),(37.1,39.0,0.6,'in')]
d=0.4; END=39.0
json.dump([s[0] for s in SEG[1:]]+[END],open('build/cuts.json','w'))
fc=[]; n=len(SEG)
for k,(a,b,s,z) in enumerate(SEG):
    pre=0 if k==0 else d/2; post=0 if k==n-1 else d/2
    L=(b-a)+pre+post; ss=s-pre if s-pre>=0 else s
    fr=int(round(L*30))
    zexpr=f"1.0+0.07*on/{fr}" if z=='in' else f"1.07-0.07*on/{fr}"
    fc.append(f"[0:v]trim=start={ss:.3f}:duration={L:.3f},setpts=PTS-STARTPTS,scale=2160:3840:flags=bicubic,"
              f"zoompan=z='{zexpr}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1080x1920:fps=30,setsar=1,format=yuv420p[v{k}]")
prev='v0'
for k in range(1,n):
    off=SEG[k][0]-d/2
    out=f"x{k}"
    fc.append(f"[{prev}][v{k}]xfade=transition=fade:duration={d}:offset={off:.3f}[{out}]"); prev=out
cmd=['ffmpeg','-v','error','-y','-i','base.mp4','-filter_complex',';'.join(fc),'-map',f'[{prev}]','-t',str(END),'-r','30','-c:v','libx264','-crf','13','-preset','medium','build/cut.mp4']
subprocess.run(cmd,check=True)
