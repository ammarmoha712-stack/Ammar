"""Cut the supplied luggage photos out of their white backgrounds (alpha only; pixels untouched)."""
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage
def cut(src, dst, thr=40, sat=25, close=2, floor=None):
    rgb = np.asarray(Image.open(src).convert('RGB')).astype(int)
    bgish = ((765 - rgb.sum(2)) < thr) & ((rgb.max(2) - rgb.min(2)) < sat)
    if floor:  # soft floor shadows: bright, neutral pixels in the bottom band count as background
        y0, minb, maxs = floor; band = np.zeros(bgish.shape, bool); band[int(y0 * rgb.shape[0]):] = True
        bgish |= band & (rgb.mean(2) > minb) & ((rgb.max(2) - rgb.min(2)) < maxs)
    lab, _ = ndimage.label(bgish)
    edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    fg = ~np.isin(lab, list(edge))
    fg = ndimage.binary_closing(fg, iterations=close)
    fg = ndimage.binary_fill_holes(ndimage.binary_opening(fg, iterations=1))
    lab2, n = ndimage.label(fg)
    if n > 1:
        sizes = ndimage.sum(fg, lab2, range(1, n + 1)); keep = np.where(sizes > sizes.max() * 0.002)[0] + 1
        fg = np.isin(lab2, keep)
    alpha = Image.fromarray((fg * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.0))
    out = Image.fromarray(rgb.astype(np.uint8)).convert('RGBA'); out.putalpha(alpha)
    out = out.crop(out.getbbox()); out.save(dst); print(dst, out.size, round(out.size[0]/out.size[1],3))
cut('assets/src_rifqa_1.jpg', 'assets/rifqa_set_1.png', floor=(0.86, 175, 18), close=1)
cut('assets/src_rifqa_2.jpg', 'assets/rifqa_set_2.png', floor=(0.86, 175, 18), close=1)
cut('assets/src_american_1.jpg', 'assets/american_set_1.png', thr=30, close=2, floor=(0.72, 185, 16))
cut('assets/src_american_2.jpg', 'assets/american_set_2.png', thr=30, sat=8, close=1, floor=(0.80, 190, 7))
