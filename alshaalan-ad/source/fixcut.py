import numpy as np, sys
from PIL import Image, ImageFilter
from scipy import ndimage as nd
def fix(src_rgb, cut, out):
    im=Image.open(src_rgb).convert('RGB'); c=Image.open(cut).convert('RGBA')
    a=np.array(c)[:,:,3].astype(np.float32)
    m=a>25
    m=nd.binary_closing(m,iterations=6)
    m=nd.binary_fill_holes(m)
    # keep largest component
    lab,n=nd.label(m); 
    if n>1:
        sizes=nd.sum(m,lab,range(1,n+1)); m=lab==(1+int(np.argmax(sizes)))
    core=nd.binary_erosion(m,iterations=4)
    core=np.array(Image.fromarray((core*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2))).astype(np.float32)
    na=np.maximum(a,core)*m  # nothing outside filled mask
    na=np.where(m, na, 0)
    rgba=np.dstack([np.array(im),na.clip(0,255).astype(np.uint8)])
    o=Image.fromarray(rgba,'RGBA'); o=o.crop(o.getbbox()); o.save(out); print(out,o.size)
fix(*sys.argv[1:4])
