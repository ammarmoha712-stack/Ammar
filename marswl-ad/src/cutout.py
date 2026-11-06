"""Cut the supplied product photos out of their white backgrounds (pixels untouched, alpha only)."""
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

def bottom_contour(gray, x0, x1, y0, y1):
    g = np.abs(np.diff(ndimage.gaussian_filter(gray, (0.7, 2)), axis=0))
    xs = np.arange(x0, x1); ys = np.array([y0 + g[y0:y1, x].argmax() for x in xs])
    return xs, ndimage.median_filter(ys, 15)

def cut(src, dst, thr=40, crop_bottom=None, contour=None):
    rgb = np.asarray(Image.open(src).convert('RGB')).astype(int)
    h, w, _ = rgb.shape
    bgish = ((765 - rgb.sum(2)) < thr) & ((rgb.max(2) - rgb.min(2)) < 25)
    lab, _ = ndimage.label(bgish)
    edge = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    fg = ~np.isin(lab, list(edge))
    if crop_bottom: fg[crop_bottom:] = False
    if contour:
        xs, ys = bottom_contour(rgb.mean(2), *contour)
        for x, y in zip(xs, ys): fg[y + 1:, x] = False
        fg[contour[3]:, :] = False
    fg = ndimage.binary_fill_holes(ndimage.binary_opening(fg, iterations=1))
    lab2, n = ndimage.label(fg)
    if n > 1:
        fg = lab2 == (np.argmax(ndimage.sum(fg, lab2, range(1, n + 1))) + 1)
    alpha = Image.fromarray((fg * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.1))
    out = Image.fromarray(rgb.astype(np.uint8)).convert('RGBA'); out.putalpha(alpha)
    out = out.crop(out.getbbox()); out.save(dst); print(dst, out.size)

cut('assets/src_black_xs.webp', 'assets/01_Black_XS_Paco_Rabanne.png')
cut('assets/src_montblanc.webp', 'assets/02_Montblanc_Emblem_Intense.png', thr=30, contour=(200, 720, 735, 815))
cut('assets/src_the_one.jpg', 'assets/03_Dolce_Gabbana_The_One.png')
cut('assets/src_in_red.webp', 'assets/04_Armand_Basi_In_Red.png', crop_bottom=771)
