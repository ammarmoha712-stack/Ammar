import sys,glob,os
from PIL import Image
d=sys.argv[1]; fs=sorted(glob.glob(d+'/f_*.png'),key=lambda s:float(os.path.basename(s)[2:-4]))
for k in range(0,len(fs),6):
  ims=[Image.open(x).resize((360,640)) for x in fs[k:k+6]]; sh=Image.new('RGB',(360*len(ims),640))
  for i,im in enumerate(ims): sh.paste(im,(i*360,0))
  sh.save(f'{d}/sheet{k//6}.png')
