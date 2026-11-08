import math, random, sys, os
from functools import lru_cache
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops

os.chdir(os.path.dirname(os.path.abspath(__file__)))
W, H, FPS, DUR = 1080, 1920, 30, 40.0
NAVY = (21, 47, 74); NAVY2 = (52, 84, 116); GOLD = (182, 173, 152); GOLDD = (160, 140, 104)
COPPER = (185, 120, 88); IVORY = (250, 249, 246); WHITE = (255, 255, 255); GREY = (214, 210, 200)

# scene boundaries (video time; voice-over starts at 0.4 s)
B = [0, 6.3, 12.25, 18.4, 25.6, 32.25, 40.0]
SVC = [18.4, 21.5, 23.0, 25.6]

# ---------- easing ----------
def cl(x, a=0., b=1.): return a if x < a else b if x > b else x
def pr(t, a, d): return cl((t - a) / d)
def eo(x): x = cl(x); return 1 - (1 - x) ** 3
def eio(x): x = cl(x); return 4 * x ** 3 if x < .5 else 1 - (-2 * x + 2) ** 3 / 2
def eb(x):
    x = cl(x); c1 = 1.70158; c3 = c1 + 1
    return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2
def lerp(a, b, x): return a + (b - a) * x

# ---------- text ----------
@lru_cache(None)
def font(w, s): return ImageFont.truetype(f'fonts/Tajawal-{w}.ttf', s, layout_engine=ImageFont.Layout.RAQM)
def is_ar(s): return any('؀' <= c <= 'ۿ' for c in s)
@lru_cache(None)
def txt(s, size, color=NAVY, w='Bold', pad=12):
    f = font(w, size); kw = dict(direction='rtl', language='ar') if is_ar(s) else {}
    l, t, r, b = f.getbbox(s, **kw)
    im = Image.new('RGBA', (r - l + 2 * pad, b - t + 2 * pad), (0, 0, 0, 0))
    ImageDraw.Draw(im).text((pad - l, pad - t), s, font=f, fill=color, **kw)
    return im

# ---------- sprite utils ----------
def with_alpha(im, a):
    if a >= .999: return im
    im = im.copy(); im.putalpha(im.getchannel('A').point(lambda v: int(v * a))); return im

def place(cv, spr, x, y, s=1.0, a=1.0, rot=0.0, anchor='c'):
    if a <= .004 or s <= .01: return
    im = spr
    if abs(s - 1) > .003:
        im = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.BICUBIC)
    if abs(rot) > .05: im = im.rotate(rot, Image.BICUBIC, expand=True)
    im = with_alpha(im, a)
    if anchor == 'c': px, py = x - im.width / 2, y - im.height / 2
    elif anchor == 'b': px, py = x - im.width / 2, y - im.height
    elif anchor == 'r': px, py = x - im.width, y - im.height / 2
    elif anchor == 'l': px, py = x, y - im.height / 2
    cv.paste(im, (round(px), round(py)), im)

def shadowed(im, blur=22, off=(0, 16), op=.22, col=NAVY):
    p = blur * 2 + 20
    out = Image.new('RGBA', (im.width + 2 * p, im.height + 2 * p), (0, 0, 0, 0))
    sh = Image.new('RGBA', im.size, col + (0,)); sh.putalpha(im.getchannel('A').point(lambda v: int(v * op)))
    out.paste(sh, (p + off[0], p + off[1]), sh)
    out = out.filter(ImageFilter.GaussianBlur(blur))
    out.alpha_composite(im, (p, p)); return out

def glow(im, col, blur=24, strength=1.0):
    p = blur * 3
    g = Image.new('RGBA', (im.width + 2 * p, im.height + 2 * p), col + (0,))
    a = Image.new('L', g.size, 0); a.paste(im.getchannel('A'), (p, p))
    a = a.filter(ImageFilter.GaussianBlur(blur)).point(lambda v: min(255, int(v * 2.2 * strength)))
    g.putalpha(a); g.alpha_composite(im, (p, p)); return g

# ---------- vector icons (drawn 4x, downsampled) ----------
def canvas4(size): return Image.new('RGBA', (size * 4, size * 4), (0, 0, 0, 0))
def icon(name, size):
    return _icon(name, size)
@lru_cache(None)
def _icon(name, size):
    im = canvas4(size); d = ImageDraw.Draw(im); k = size * 4 / 100
    P = lambda *pts: [(x * k, y * k) for x, y in pts]
    R = lambda x0, y0, x1, y1: [x0 * k, y0 * k, x1 * k, y1 * k]
    if name == 'villa':
        d.rectangle(R(8, 56, 92, 90), fill=NAVY)
        d.rectangle(R(28, 30, 82, 56), fill=NAVY2)
        d.rectangle(R(22, 25, 88, 31), fill=COPPER)
        d.rectangle(R(4, 52, 60, 57), fill=COPPER)
        for x in (34, 52, 68): d.rectangle(R(x, 36, x + 10, 49), fill=GOLD)
        d.rectangle(R(48, 63, 86, 83), fill=GOLD); d.line(R(61, 63, 61, 83), fill=NAVY, width=int(1.5 * k)); d.line(R(74, 63, 74, 83), fill=NAVY, width=int(1.5 * k))
        d.rectangle(R(16, 64, 30, 90), fill=COPPER)
        d.rectangle(R(0, 89, 100, 93), fill=GOLD)
    elif name == 'tower':
        d.rectangle(R(28, 8, 72, 92), fill=NAVY); d.rectangle(R(24, 4, 76, 10), fill=COPPER)
        for r in range(8):
            for c in range(3): d.rectangle(R(34 + c * 12, 15 + r * 9.5, 41 + c * 12, 21 + r * 9.5), fill=GOLD)
        d.rectangle(R(44, 80, 56, 92), fill=COPPER)
        d.rectangle(R(72, 50, 90, 92), fill=NAVY2)
        for r in range(4): d.rectangle(R(77, 56 + r * 9, 85, 61 + r * 9), fill=GOLD)
        d.rectangle(R(0, 91, 100, 95), fill=GOLD)
    elif name == 'shop':
        d.rectangle(R(10, 30, 90, 92), fill=NAVY)
        d.rectangle(R(22, 18, 78, 30), fill=COPPER)
        for i in range(8):
            col = COPPER if i % 2 == 0 else IVORY
            d.pieslice(R(8 + i * 10.5, 36, 18.5 + i * 10.5, 50), 0, 180, fill=col)
            d.rectangle(R(8 + i * 10.5, 34, 18.5 + i * 10.5, 43), fill=col)
        d.rectangle(R(18, 56, 60, 84), fill=GOLD); d.rectangle(R(66, 56, 82, 92), fill=COPPER)
        d.rectangle(R(0, 91, 100, 95), fill=GOLD)
    elif name == 'land':
        d.polygon(P((50, 40), (94, 64), (50, 88), (6, 64)), fill=GOLD + (150,))
        pts = P((50, 40), (94, 64), (50, 88), (6, 64), (50, 40))
        for i in range(4):
            (x0, y0), (x1, y1) = pts[i], pts[i + 1]
            for j in range(0, 10, 2):
                d.line([(x0 + (x1 - x0) * j / 10, y0 + (y1 - y0) * j / 10), (x0 + (x1 - x0) * (j + 1) / 10, y0 + (y1 - y0) * (j + 1) / 10)], fill=NAVY, width=int(2.5 * k))
        d.line(R(50, 64, 50, 14), fill=NAVY, width=int(3 * k)); d.polygon(P((51, 14), (74, 21), (51, 28)), fill=COPPER)
    elif name == 'pin':
        d.ellipse(R(22, 6, 78, 62), fill=NAVY); d.polygon(P((26, 46), (74, 46), (50, 94)), fill=NAVY)
        d.ellipse(R(38, 22, 62, 46), fill=IVORY)
    elif name == 'pinc':
        d.ellipse(R(22, 6, 78, 62), fill=COPPER); d.polygon(P((26, 46), (74, 46), (50, 94)), fill=COPPER)
        d.ellipse(R(38, 22, 62, 46), fill=IVORY)
    elif name == 'key':
        d.ellipse(R(4, 30, 44, 70), outline=GOLDD, width=int(11 * k))
        d.ellipse(R(8, 34, 40, 66), outline=GOLD, width=int(5 * k))
        d.rectangle(R(42, 45, 95, 55), fill=GOLDD); d.rectangle(R(42, 46.5, 95, 50), fill=GOLD)
        d.rectangle(R(74, 55, 81, 68), fill=GOLDD); d.rectangle(R(85, 55, 92, 64), fill=GOLDD)
        d.ellipse(R(20, 46, 28, 54), fill=COPPER)
    elif name == 'check':
        d.ellipse(R(4, 4, 96, 96), fill=COPPER); d.line(P((28, 52), (44, 68), (74, 34)), fill=WHITE, width=int(9 * k), joint='curve')
    elif name == 'mega':
        d.polygon(P((18, 40), (70, 16), (70, 84), (18, 60)), fill=NAVY); d.rectangle(R(8, 38, 22, 62), fill=NAVY2)
        d.polygon(P((26, 60), (40, 64), (44, 86), (32, 86)), fill=COPPER)
        for r in (12, 22): d.arc(R(70 - r + 6, 50 - r - 6, 70 + r + 6, 50 + r + 6), -45, 45, fill=COPPER, width=int(4 * k))
    elif name == 'chart':
        for i, h in enumerate((24, 40, 54, 72)): d.rounded_rectangle(R(10 + i * 21, 92 - h, 26 + i * 21, 92), radius=2 * k, fill=NAVY if i < 3 else COPPER)
        d.line(P((10, 56), (36, 40), (56, 46), (88, 14)), fill=GOLDD, width=int(4 * k), joint='curve')
        d.polygon(P((90, 10), (78, 13), (88, 22)), fill=GOLDD)
    elif name == 'medal':
        d.polygon(P((30, 4), (46, 4), (56, 40), (40, 40)), fill=COPPER); d.polygon(P((70, 4), (54, 4), (44, 40), (60, 40)), fill=NAVY2)
        d.ellipse(R(18, 34, 82, 98), fill=GOLD); d.ellipse(R(26, 42, 74, 90), outline=GOLDD, width=int(3 * k))
        cx, cy, r1, r2 = 50, 66, 17, 7
        d.polygon([((cx + (r1 if i % 2 == 0 else r2) * math.sin(i * math.pi / 5)) * k, (cy - (r1 if i % 2 == 0 else r2) * math.cos(i * math.pi / 5)) * k) for i in range(10)], fill=NAVY)
    elif name == 'shield':
        d.polygon(P((50, 4), (88, 18), (84, 58), (50, 96), (16, 58), (12, 18)), fill=NAVY)
        d.line(P((32, 50), (45, 63), (69, 36)), fill=GOLD, width=int(8 * k), joint='curve')
    elif name == 'chat':
        d.rounded_rectangle(R(6, 14, 94, 74), radius=16 * k, fill=NAVY); d.polygon(P((24, 70), (44, 72), (20, 92)), fill=NAVY)
        for x in (30, 50, 70): d.ellipse(R(x - 6, 38, x + 6, 50), fill=GOLD)
    elif name == 'person':
        d.ellipse(R(32, 8, 68, 44), fill=NAVY2); d.pieslice(R(14, 50, 86, 122), 180, 360, fill=NAVY2)
    elif name == 'phone':
        d.rounded_rectangle(R(24, 4, 76, 96), radius=9 * k, fill=NAVY)
        d.rounded_rectangle(R(29, 12, 71, 86), radius=4 * k, fill=IVORY); d.rounded_rectangle(R(43, 89, 57, 92), radius=1.5 * k, fill=GOLD)
    elif name == 'globe':
        d.ellipse(R(8, 8, 92, 92), outline=NAVY, width=int(7 * k)); d.ellipse(R(32, 8, 68, 92), outline=NAVY, width=int(6 * k))
        d.line(R(8, 50, 92, 50), fill=NAVY, width=int(6 * k)); d.line(R(50, 8, 50, 92), fill=NAVY, width=int(6 * k))
    elif name == 'diamond':
        d.polygon(P((50, 0), (100, 50), (50, 100), (0, 50)), fill=NAVY)
    elif name == 'diamondg':
        d.polygon(P((50, 0), (100, 50), (50, 100), (0, 50)), fill=GOLD)
    elif name == 'diamondc':
        d.polygon(P((50, 0), (100, 50), (50, 100), (0, 50)), fill=COPPER)
    return im.resize((size, size), Image.LANCZOS)

# ---------- cards ----------
@lru_cache(None)
def card(w, h, ic=None, label=None, isz=None, sub=False, border=GOLD, r=30, lsize=40):
    im = Image.new('RGBA', (w * 2, h * 2), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle([0, 0, w * 2 - 1, h * 2 - 1], radius=r * 2, fill=WHITE, outline=border, width=4)
    im = im.resize((w, h), Image.LANCZOS)
    if ic:
        isz = isz or int(min(w, h) * .55); iy = (h - isz) // 2 - (24 if label else 0)
        im.alpha_composite(icon(ic, isz), ((w - isz) // 2, iy))
    if label:
        t = txt(label, lsize, NAVY, 'Bold'); im.alpha_composite(t, ((w - t.width) // 2, h - t.height - 16))
    if sub:
        d = ImageDraw.Draw(im)
        for i, ww in enumerate((.62, .44)):
            x1 = w - 26; d.rounded_rectangle([x1 - w * ww, h - 64 + i * 22, x1, h - 54 + i * 22], radius=5, fill=GREY)
    return shadowed(im, 20, (0, 14), .20)

@lru_cache(None)
def pill(label, size=44, fill=WHITE, col=NAVY, border=NAVY):
    t = txt(label, size, col, 'Bold'); w, h = t.width + 60, t.height + 22
    im = Image.new('RGBA', (w * 2, h * 2), (0, 0, 0, 0))
    ImageDraw.Draw(im).rounded_rectangle([0, 0, w * 2 - 1, h * 2 - 1], radius=h, fill=fill, outline=border, width=5)
    im = im.resize((w, h), Image.LANCZOS); im.alpha_composite(t, ((w - t.width) // 2, (h - t.height) // 2 + 2))
    return shadowed(im, 14, (0, 8), .16)

# ---------- assets ----------
@lru_cache(None)
def logo_img():
    lg = Image.open('logo.webp').convert('RGB')
    # key out the white background -> alpha by darkness distance
    L = lg.convert('L'); a = L.point(lambda v: 0 if v > 246 else min(255, int((246 - v) * 4.2)))
    out = lg.convert('RGBA'); out.putalpha(a)
    bb = a.point(lambda v: 255 if v > 30 else 0).getbbox(); return out.crop((bb[0] - 6, bb[1] - 6, bb[2] + 6, bb[3] + 6))
@lru_cache(None)
def logo(w):
    lg = logo_img(); return lg.resize((w, round(lg.height * w / lg.width)), Image.LANCZOS)
@lru_cache(None)
def logo_mark(h):
    lg = logo_img(); m = lg.crop((0, 0, int(lg.width * .23), lg.height)); m = m.crop(m.getbbox())
    return m.resize((round(m.width * h / m.height), h), Image.LANCZOS)

POSE = {'front': 'char_fix.png', 'q': 'turn1_fix.png', 'side': 'turn2_fix.png', 'front2': 'turn5_fix.png'}
@lru_cache(None)
def pose(name, h, flip=False):
    im = Image.open(POSE[name]).convert('RGBA')
    if flip: im = im.transpose(Image.FLIP_LEFT_RIGHT)
    return im.resize((round(im.width * h / im.height), h), Image.LANCZOS)
@lru_cache(None)
def floor_shadow(w):
    im = Image.new('RGBA', (w + 120, 160), (0, 0, 0, 0))
    ImageDraw.Draw(im).ellipse([60, 55, w + 60, 105], fill=NAVY + (70,))
    return im.filter(ImageFilter.GaussianBlur(18))

def character(cv, T, name, x, feet, h, a=1.0, flip=False, dx=0.0):
    if a <= .004: return
    base = pose(name, h, flip)
    br = math.sin(T * 2 * math.pi / 3.6)
    sy = 1 + .0045 * br
    im = base.resize((base.width, round(base.height * sy)), Image.BICUBIC)
    sway = 2.5 * math.sin(T * 2 * math.pi / 5.3)
    place(cv, floor_shadow(int(base.width * .62)), x + dx, feet + 8, a=a * .9)
    place(cv, im, x + dx + sway, feet, a=a, anchor='b')

# ---------- background ----------
@lru_cache(None)
def bg_big():
    bw, bh = W + 200, H + 200
    im = Image.new('RGB', (bw, bh), IVORY)
    ov = Image.new('RGBA', (bw * 2, bh * 2), (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
    sp = 150 * 2; t = math.tan(math.radians(30))
    for i in range(-30, 40):
        x = i * sp
        d.line([(x, 0), (x + bh * 2 / t * .0 + bh * 2 * t * 1.0, bh * 2)], fill=GOLD + (34,), width=2)
        d.line([(x, bh * 2), (x + bh * 2 * t, 0)], fill=GOLD + (34,), width=2)
    ov = ov.resize((bw, bh), Image.LANCZOS)
    # soft centre light
    v = Image.new('L', (bw, bh), 0); ImageDraw.Draw(v).ellipse([bw * .05, bh * .12, bw * .95, bh * .88], fill=255)
    v = v.filter(ImageFilter.GaussianBlur(220))
    ov.putalpha(ImageChops.multiply(ov.getchannel('A'), v.point(lambda p: 255 - int(p * .75))))
    im.paste(ov, (0, 0), ov)
    return im

def background(T):
    big = bg_big(); ox = 100 + 60 * math.sin(T * .09); oy = 100 + 70 * math.cos(T * .07)
    return big.crop((int(ox), int(oy), int(ox) + W, int(oy) + H))

def corner_deco(cv, T, a=1.0):
    # navy diamond clusters echoing the logo dots + thin gold arcs
    for (x, y, s, ic, ph) in ((990, 80, 34, 'diamond', 0), (1040, 140, 22, 'diamondg', 1), (930, 140, 16, 'diamondc', 2),
                              (70, 1840, 30, 'diamond', 3), (130, 1880, 18, 'diamondg', 4)):
        place(cv, icon(ic, s), x, y + 6 * math.sin(T * 1.3 + ph), a=a * .9)

def gold_line(cv, x0, x1, y, p, a=1.0, wdt=4, col=GOLD):
    if p <= 0 or a <= 0: return
    d = ImageDraw.Draw(cv); xm = x1 - (x1 - x0) * p
    c = tuple(int(lerp(IVORY[i], col[i], a)) for i in range(3))
    d.rectangle([xm, y - wdt // 2, x1, y + wdt // 2], fill=c)

def headline(cv, T, text, t0, y=300, size=88, col=NAVY, out=None, line=True):
    p = eo(pr(T, t0, .7)); a = p
    if out is not None: a *= 1 - pr(T, out, .35)
    if a <= 0: return
    s = txt(text, size, col, 'ExtraBold')
    place(cv, s, W / 2, y + 40 * (1 - p), a=a)
    if line:
        lw = min(s.width * .55, 420)
        gold_line(cv, W / 2 - lw / 2, W / 2 + lw / 2, y + s.height / 2 + 14, eo(pr(T, t0 + .3, .7)), a, 5, COPPER)

def top_logo(cv, T, t0, a=1.0):
    p = eo(pr(T, t0, .6)); place(cv, logo(330), W / 2, 120 - 20 * (1 - p), a=p * a)

def pop(T, t0, d=.55): return eb(pr(T, t0, d)), cl((T - t0) / .25)

@lru_cache(None)
def dot(r, col=GOLD):
    im = Image.new('RGBA', (r * 8, r * 8), (0, 0, 0, 0))
    ImageDraw.Draw(im).ellipse([r * 3, r * 3, r * 5, r * 5], fill=col + (255,))
    return glow(im, col, r, 1.0)

def particles(cv, T, n=26, a=1.0, seed=3):
    rnd = random.Random(seed)
    for i in range(n):
        x0 = rnd.uniform(30, W - 30); y0 = rnd.uniform(0, H); sp = rnd.uniform(25, 70); r = rnd.choice((2, 3, 3, 4))
        y = (y0 - T * sp) % H; x = x0 + 18 * math.sin(T * .8 + i)
        tw = .5 + .5 * math.sin(T * 2.2 + i * 1.7)
        place(cv, dot(r, GOLD if i % 3 else COPPER), x, y, a=a * (.35 + .55 * tw))

# ================= SCENES =================
def scene1(cv, T):
    corner_deco(cv, T); top_logo(cv, T, .1)
    headline(cv, T, 'تبحث عن عقار مناسب؟', .35, y=300)
    for i, (lab, t0) in enumerate((('شراء', 2.15), ('بيع', 2.85), ('استثمار', 4.0))):
        s, a = pop(T, t0); place(cv, pill(lab, 42), 780 - i * 240, 440, s=.6 + .4 * s, a=a)
    # character: walks in (profile) -> 3/4 -> front
    X, F, Hc = 745, 1880, 1190
    xin = lerp(1400, X, eo(pr(T, .15, 1.35)))
    bob = -10 * abs(math.sin(T * 7.5)) * (1 - pr(T, 1.2, .3))
    a_side = 1 - pr(T, 1.35, .3); a_q = min(pr(T, 1.35, .3), 1 - pr(T, 1.8, .35)); a_f = pr(T, 1.8, .35)
    # floating property cards
    items = [('phone', 'ابحث', 250, 990, .75, 250, 400), ('villa', 'فيلا', 205, 640, 1.15, 230, 220),
             ('tower', 'عمارة', 905, 600, 1.55, 200, 200), ('shop', 'تجاري', 205, 1390, 1.95, 230, 220),
             ('land', 'أرض', 220, 1680, 2.35, 230, 200)]
    for i, (ic, lab, x, y, t0, w, h) in enumerate(items):
        s, a = pop(T, t0); fy = 10 * math.sin(T * 1.6 + i * 1.3)
        if ic == 'phone':
            place(cv, phone_card(), x, y + fy, s=.5 + .5 * s, a=a)
        else:
            place(cv, card(w, h, ic, lab), x, y + fy, s=.5 + .5 * s, a=a)
    for i, (x, y, t0) in enumerate(((420, 560, 2.7), (95, 820, 2.9), (980, 1050, 3.1), (110, 1190, 3.3), (420, 1560, 3.5))):
        p = eb(pr(T, t0, .5)); a = cl((T - t0) / .2)
        place(cv, icon('pinc' if i % 2 else 'pin', 56), x, y - 60 * (1 - p) + 6 * math.sin(T * 2 + i), a=a)
    character(cv, T, 'side', xin, F + bob, Hc, a=a_side, flip=True)
    character(cv, T, 'q', xin, F, Hc, a=a_q)
    character(cv, T, 'front', xin, F, Hc, a=a_f)

@lru_cache(None)
def phone_card():
    w, h = 250, 420
    im = Image.new('RGBA', (w * 2, h * 2), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle([0, 0, w * 2 - 1, h * 2 - 1], radius=64, fill=NAVY)
    d.rounded_rectangle([18, 40, w * 2 - 19, h * 2 - 60], radius=36, fill=IVORY)
    d.rounded_rectangle([w - 40, h * 2 - 38, w + 40, h * 2 - 28], radius=5, fill=GOLD)
    im = im.resize((w, h), Image.LANCZOS)
    # search bar
    d = ImageDraw.Draw(im); d.rounded_rectangle([22, 40, w - 22, 80], radius=18, fill=WHITE, outline=GOLD, width=2)
    t = txt('ابحث عن عقارك', 22, NAVY2, 'Medium'); im.alpha_composite(t, (w - 34 - t.width, 60 - t.height // 2))
    for j, ic in enumerate(('villa', 'tower', 'land')):
        y = 96 + j * 98; d.rounded_rectangle([22, y, w - 22, y + 86], radius=14, fill=WHITE, outline=GREY, width=2)
        im.alpha_composite(icon(ic, 64), (w - 22 - 76, y + 11))
        d.rounded_rectangle([34, y + 22, 140, y + 32], radius=5, fill=GREY); d.rounded_rectangle([64, y + 46, 140, y + 56], radius=5, fill=GOLD)
    return shadowed(im, 22, (0, 16), .25)

def scene2(cv, T):
    corner_deco(cv, T); top_logo(cv, T, 6.3)
    lt = T
    headline(cv, T, 'الخيارات كثيرة...', 6.35, y=300, out=7.45, line=False)
    headline(cv, T, 'القرار الصحيح يبدأ بالخبرة', 7.65, y=300, size=80)
    opts = [('villa', 'فيلا', 870), ('tower', 'شقة', 540), ('land', 'أرض', 210)]
    pick = 1; lock = 9.35
    scan = [(8.35, 0), (8.75, 2), (9.05, 1)]
    cur = None
    for t0, i in scan:
        if T >= t0: cur = i
    for i, (ic, lab, x) in enumerate(opts):
        s, a = pop(T, 6.55 + i * .22)
        chosen = i == pick and T >= lock
        sc = 1 + .1 * eb(pr(T, lock, .5)) if i == pick else 1
        dim = 1 - .55 * pr(T, lock, .4) if i != pick else 1
        y = 740 + 8 * math.sin(T * 1.5 + i)
        if chosen or (cur == i and T < lock + .2):
            g = goldframe(300, 360); place(cv, g, x, y, s=sc * (.5 + .5 * s), a=a * (1 if chosen else .8))
        place(cv, card(290, 350, ic, lab, 170, False, GOLD, 30, 48), x, y, s=sc * (.5 + .5 * s), a=a * dim)
        if chosen:
            p = eb(pr(T, lock + .1, .5)); place(cv, icon('check', 76), x + 125, y - 165, s=p, a=cl(p))
    p = eo(pr(T, lock + .25, .5))
    place(cv, pill('الخيار الأنسب', 38, NAVY, IVORY, NAVY), 540, 975 + 20 * (1 - p), a=p)
    # trust badges
    for i, (ic, lab, t0) in enumerate((('medal', 'خبرة', 10.0), ('shield', 'ثقة', 10.35), ('chat', 'استشارة', 10.7))):
        s, a = pop(T, t0); y = 1180 + i * 230 + 6 * math.sin(T * 1.7 + i)
        place(cv, badge(ic, lab), 215, y, s=.5 + .5 * s, a=a)
    X, F, Hc = 760, 1890, 900
    a_in = eo(pr(T, 6.4, .6))
    character(cv, T, 'q', X + 60 * (1 - a_in), F, Hc, a=a_in * (1 - pr(T, 9.3, .35)))
    character(cv, T, 'front', X, F, Hc, a=pr(T, 9.3, .35))

@lru_cache(None)
def goldframe(w, h):
    im = Image.new('RGBA', (w * 2, h * 2), (0, 0, 0, 0))
    ImageDraw.Draw(im).rounded_rectangle([4, 4, w * 2 - 5, h * 2 - 5], radius=64, outline=GOLDD, width=10)
    im = im.resize((w, h), Image.LANCZOS); return glow(im, COPPER, 16, .9)

@lru_cache(None)
def badge(ic, lab):
    w, h = 330, 170
    im = Image.new('RGBA', (w * 2, h * 2), (0, 0, 0, 0))
    ImageDraw.Draw(im).rounded_rectangle([0, 0, w * 2 - 1, h * 2 - 1], radius=80, fill=WHITE, outline=GOLD, width=4)
    im = im.resize((w, h), Image.LANCZOS)
    c = Image.new('RGBA', (240, 240), (0, 0, 0, 0)); ImageDraw.Draw(c).ellipse([0, 0, 239, 239], fill=IVORY, outline=GOLD, width=4)
    c = c.resize((120, 120), Image.LANCZOS); c.alpha_composite(icon(ic, 76), (22, 22))
    im.alpha_composite(c, (w - 145, 25))
    t = txt(lab, 46, NAVY, 'ExtraBold'); im.alpha_composite(t, (w - 160 - t.width, (h - t.height) // 2 + 2))
    return shadowed(im, 18, (0, 12), .18)

@lru_cache(None)
def skyline():
    w, h = W, 900
    im = Image.new('RGBA', (w * 2, h * 2), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    rnd = random.Random(7); x = -40
    while x < w * 2:
        bw = rnd.randint(110, 230); bh = rnd.randint(380, 1500)
        d.rectangle([x, h * 2 - bh, x + bw, h * 2], fill=NAVY + (10,), outline=GOLD + (80,), width=3)
        for yy in range(h * 2 - bh + 40, h * 2 - 30, 70):
            d.line([x + 25, yy, x + bw - 25, yy], fill=GOLD + (40,), width=2)
        if rnd.random() < .3:
            d.line([x + bw // 2, h * 2 - bh, x + bw // 2, h * 2 - bh - 120], fill=GOLD + (120,), width=3)
        x += bw + rnd.randint(10, 50)
    return im.resize((w, h), Image.LANCZOS)

def scene3(cv, T):
    t0 = 12.25
    # rising skyline
    p = eo(pr(T, t0 + .05, 1.4)); place(cv, skyline(), W / 2, H + 380 * (1 - p), a=p, anchor='b')
    particles(cv, T, 22, eo(pr(T, t0, .8)))
    # geometric diamonds flying to frame the logo
    for i, (ex, ey, sx, sy, s, ic) in enumerate(((180, 250, -200, 100, 40, 'diamond'), (900, 250, 1300, 120, 40, 'diamond'),
                                                  (130, 640, -150, 800, 26, 'diamondg'), (950, 640, 1250, 760, 26, 'diamondc'),
                                                  (540, 160, 540, -100, 30, 'diamondg'))):
        q = eo(pr(T, t0 + .05 * i, .9)); place(cv, icon(ic, s), lerp(sx, ex, q), lerp(sy, ey, q) + 6 * math.sin(T * 1.5 + i), a=q)
    gold_line(cv, 90, 990, 230, eio(pr(T, t0 + .3, .9)), 1, 3, GOLD)
    gold_line(cv, 90, 990, 680, eio(pr(T, t0 + .5, .9)), 1, 3, GOLD)
    # logo reveal
    q = eo(pr(T, t0 + .35, .9)); lg = logo(920)
    place(cv, lg, W / 2, 455, s=.86 + .14 * q, a=q)
    sh = pr(T, t0 + 1.2, 1.0)
    if 0 < sh < 1: shine(cv, W / 2, 455, lg.width, lg.height, sh)
    # 40 years
    tg = 15.5
    q1 = eo(pr(T, tg - .2, .6))
    place(cv, txt('خبرة تتجاوز', 64, NAVY, 'Bold'), 300, 890 + 30 * (1 - q1), a=q1)
    n = int(round(40 * eio(pr(T, tg, 1.0))))
    q2 = eb(pr(T, tg, .6))
    if T > tg - .05:
        num = txt(str(n), 270, COPPER, 'ExtraBold'); place(cv, num, 300, 1110, s=.7 + .3 * q2, a=cl(q2))
    q3 = eo(pr(T, tg + .7, .6)); place(cv, txt('عاماً', 72, NAVY, 'ExtraBold'), 300, 1320 + 30 * (1 - q3), a=q3)
    gold_line(cv, 170, 430, 1390, eo(pr(T, tg + .9, .6)), q3, 5, COPPER)
    a = eo(pr(T, t0 + .5, .8))
    character(cv, T, 'front', 770, 1890, 1080, a=a, dx=80 * (1 - a))

def shine(cv, cx, cy, w, h, p):
    band = Image.new('L', (int(w), int(h)), 0); d = ImageDraw.Draw(band)
    x = lerp(-w * .3, w * 1.3, p); d.polygon([(x, 0), (x + 90, 0), (x + 30, h), (x - 60, h)], fill=150)
    band = band.filter(ImageFilter.GaussianBlur(18))
    lg = logo(int(w)) if abs(w - 920) < 2 or True else None
    m = ImageChops.multiply(band, lg.getchannel('A').resize(band.size))
    wl = Image.new('RGBA', band.size, (255, 248, 230, 0)); wl.putalpha(m)
    cv.paste(wl, (int(cx - w / 2), int(cy - h / 2)), wl)

# ---- scene 4: services ----
def svc_panel(T, k):
    w, h = 960, 600
    im = Image.new('RGBA', (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    if k == 0:  # marketing
        t0 = SVC[0]
        p = eo(pr(T, t0 + .1, .6)); im_v = icon('villa', 300); im.alpha_composite(with_alpha(im_v, p), (330, int(170 + 40 * (1 - p))))
        for i, (x, y, rot) in enumerate(((60, 90, 6), (690, 60, -5), (700, 330, 4))):
            q = eb(pr(T, t0 + .5 + i * .3, .5))
            if q > 0:
                c = ad_card().rotate(rot, Image.BICUBIC, expand=True)
                c = c.resize((max(1, int(c.width * q)), max(1, int(c.height * q))))
                im.alpha_composite(with_alpha(c, cl(q)), (int(x + (1 - q) * 100), int(y + (1 - q) * 60)))
        for i, (x, y) in enumerate(((300, 120), (610, 150), (480, 70))):
            q = eb(pr(T, t0 + 1.2 + i * .2, .45))
            if q > 0: im.alpha_composite(with_alpha(icon('pinc' if i == 2 else 'pin', 70), cl(q)), (x, int(y - 60 * (1 - q))))
        q = eb(pr(T, t0 + .9, .5))
        if q > 0: im.alpha_composite(with_alpha(icon('mega', 130), cl(q)), (90, 400))
    elif k == 1:  # buy & sell
        t0 = SVC[1]
        q = eo(pr(T, t0 + .05, .5)); im.alpha_composite(with_alpha(icon('person', 210), q), (int(40 - 60 * (1 - q)), 220))
        im.alpha_composite(with_alpha(icon('villa', 260), q), (int(660 + 60 * (1 - q)), 190))
        kp = eio(pr(T, t0 + .35, .8))
        kx = lerp(640, 330, kp); ky = 260 - 120 * math.sin(kp * math.pi)
        if kp > 0:
            kk = glow(icon('key', 190), COPPER, 14, .7).rotate(-25 + 25 * kp, Image.BICUBIC, expand=True)
            im.alpha_composite(with_alpha(kk, cl(kp * 4)), (int(kx - kk.width / 2 + 100), int(ky - kk.height / 2 + 120)))
        cq = eb(pr(T, t0 + 1.05, .45))
        if cq > 0:
            c = icon('check', 120).resize((max(1, int(120 * cq)),) * 2); im.alpha_composite(c, (int(480 - c.width / 2), int(470 - c.height / 2)))
            t = txt('صفقة موثوقة', 40, NAVY, 'Bold'); im.alpha_composite(with_alpha(t, cl(cq)), (int(480 - t.width / 2), 540))
    else:  # consultancy
        t0 = SVC[2]
        bp = blueprint(); q = eo(pr(T, t0 + .05, .5)); im.alpha_composite(with_alpha(bp, q), (40, 40))
        dp = pr(T, t0 + .3, 1.0); d = ImageDraw.Draw(im)
        # dimension lines draw-in
        x0, y0 = 70, 60
        if dp > 0:
            d.line([(x0 + 20, y0 + 470), (x0 + 20 + 480 * dp, y0 + 470)], fill=COPPER, width=4)
            d.line([(x0 + 540, y0 + 20), (x0 + 540, y0 + 20 + 400 * dp)], fill=COPPER, width=4)
        for i, h_ in enumerate((90, 150, 210, 290)):
            g = eo(pr(T, t0 + .4 + i * .15, .5)); hh = h_ * g
            if hh > 1: d.rounded_rectangle([640 + i * 72, 540 - hh, 690 + i * 72, 540], radius=8, fill=NAVY if i < 3 else COPPER)
        lp = pr(T, t0 + 1.0, .6)
        pts = [(650, 330), (720, 290), (790, 300), (880, 200)]
        if lp > 0:
            n = 1 + lp * 3; seg = [pts[0]]
            for j in range(1, 4):
                if n >= j: seg.append(pts[j])
                else:
                    f = n - (j - 1); seg.append((lerp(pts[j - 1][0], pts[j][0], f), lerp(pts[j - 1][1], pts[j][1], f))); break
            d.line(seg, fill=GOLDD, width=6, joint='curve')
    return im

@lru_cache(None)
def ad_card():
    w, h = 210, 170
    im = Image.new('RGBA', (w * 2, h * 2), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle([0, 0, w * 2 - 1, h * 2 - 1], radius=36, fill=WHITE, outline=GOLD, width=4)
    d.rounded_rectangle([20, 20, w * 2 - 20, 190], radius=22, fill=IVORY)
    im = im.resize((w, h), Image.LANCZOS); im.alpha_composite(icon('villa', 80), (65, 10))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([60, 110, 190, 120], radius=5, fill=GREY); d.rounded_rectangle([110, 132, 190, 142], radius=5, fill=COPPER)
    return shadowed(im, 14, (0, 10), .18)

@lru_cache(None)
def blueprint():
    w, h = 560, 520
    im = Image.new('RGBA', (w * 2, h * 2), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle([0, 0, w * 2 - 1, h * 2 - 1], radius=30, fill=(236, 240, 244), outline=NAVY2, width=4)
    for x in range(40, w * 2, 40): d.line([x, 0, x, h * 2], fill=(205, 214, 224), width=2)
    for y in range(40, h * 2, 40): d.line([0, y, w * 2, y], fill=(205, 214, 224), width=2)
    L = 10
    d.rectangle([100, 80, 1000, 880], outline=NAVY, width=L)
    d.line([560, 80, 560, 520], fill=NAVY, width=L); d.line([100, 520, 760, 520], fill=NAVY, width=L)
    d.line([760, 520, 760, 880], fill=NAVY, width=L); d.line([560, 300, 1000, 300], fill=NAVY, width=L)
    for (x0, y0, x1, y1) in ((300, 515, 400, 525), (555, 180, 565, 260), (755, 650, 765, 740)):
        d.rectangle([x0, y0, x1, y1], fill=(236, 240, 244))
    d.arc([300, 420, 400, 520], 270, 360, fill=COPPER, width=4)
    d.rectangle([180, 160, 420, 300], outline=GOLDD, width=5); d.rectangle([820, 640, 940, 820], outline=GOLDD, width=5)
    return im.resize((w, h), Image.LANCZOS)

@lru_cache(None)
def panel_bg():
    w, h = 1000, 640
    im = Image.new('RGBA', (w * 2, h * 2), (0, 0, 0, 0))
    ImageDraw.Draw(im).rounded_rectangle([0, 0, w * 2 - 1, h * 2 - 1], radius=60, fill=WHITE, outline=GOLD, width=4)
    return shadowed(im.resize((w, h), Image.LANCZOS), 26, (0, 18), .18)

SVC_T = ['التسويق العقاري', 'البيع والشراء', 'الاستشارات العقارية']
SVC_S = ['تسويق', 'بيع وشراء', 'استشارات']
PY = 730
def scene4(cv, T):
    corner_deco(cv, T); top_logo(cv, T, 18.4)
    pq = eo(pr(T, 18.45, .6)); place(cv, panel_bg(), W / 2, PY + 60 * (1 - pq), a=pq)
    k = 0 if T < SVC[1] else 1 if T < SVC[2] else 2
    for j in range(3):
        tin, tout = SVC[j], SVC[j + 1]
        if j > 0 and T < tin: continue
        if j < 2 and T >= tout: continue
        pin_ = eo(pr(T, tin, .4)) if j > 0 else 1.0
        pout = eio(pr(T, tout - .3, .3)) if j < 2 else 0.0
        a = pq * (1 - pout) * pin_
        dx = -300 * (1 - pin_) + 300 * pout
        place(cv, svc_panel(T, j), W / 2 + dx, PY, a=a)
        tq = eo(pr(T, tin + .05, .4)) * (1 - pout)
        place(cv, txt(f'0{j + 1}', 50, COPPER, 'ExtraBold'), W / 2, 250 + 20 * (1 - tq), a=tq)
        place(cv, txt(SVC_T[j], 80, NAVY, 'ExtraBold'), W / 2, 335 + 30 * (1 - tq), a=tq)
    gold_line(cv, W / 2 - 160, W / 2 + 160, 395, eo(pr(T, 18.7, .6)), pq, 5, COPPER)
    # service list (left column)
    for i in range(3):
        s_, a_ = pop(T, 18.9 + i * .15); on = i == k
        place(cv, pill(SVC_S[i], 40, NAVY if on else WHITE, IVORY if on else NAVY, NAVY), 220, 1240 + i * 140, s=(.6 + .4 * s_) * (1.08 if on else 1), a=a_)
    a = eo(pr(T, 18.5, .6))
    character(cv, T, 'front', 800, 1895, 860, a=a, dx=60 * (1 - a))

# ---- scene 5: Riyadh map ----
ISO_C = (540, 930); ISO_S = 1.0
def iso(u, v, z=0, s=1.0):
    # u,v in [-1,1] plane coords; returns screen coords
    cx, cy = ISO_C
    return (cx + (u - v) * 430 * s, cy + (u + v) * 245 * s - z * s)

CITY = [(-.55, -.85), (.1, -.95), (.65, -.6), (.85, -.05), (.7, .55), (.35, .9), (-.2, .95), (-.6, .7), (-.85, .2), (-.9, -.4)]
SOUTH = [(.15, .2), (.7, .55), (.35, .9), (-.2, .95), (-.35, .55)]
def scene5(cv, T):
    t0 = 25.6
    corner_deco(cv, T)
    headline(cv, T, 'نخدمكم في جنوب الرياض', t0 + .2, y=230, size=80)
    zp = eio(pr(T, t0, 6.5)); s = 1.0 + .06 * zp
    mp = eo(pr(T, t0 + .05, .8))
    lay = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    plate = [iso(-1, -1, 0, s), iso(1, -1, 0, s), iso(1, 1, 0, s), iso(-1, 1, 0, s)]
    thick = [iso(1, -1, 0, s), iso(1, 1, 0, s), (iso(1, 1, 0, s)[0], iso(1, 1, 0, s)[1] + 26), (iso(1, -1, 0, s)[0], iso(1, -1, 0, s)[1] + 26)]
    thick2 = [iso(-1, 1, 0, s), iso(1, 1, 0, s), (iso(1, 1, 0, s)[0], iso(1, 1, 0, s)[1] + 26), (iso(-1, 1, 0, s)[0], iso(-1, 1, 0, s)[1] + 26)]
    sh = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(sh).polygon([(x, y + 50) for x, y in plate], fill=NAVY + (60,))
    sh = sh.filter(ImageFilter.GaussianBlur(30)); lay.alpha_composite(sh)
    d.polygon(thick, fill=NAVY2); d.polygon(thick2, fill=NAVY)
    d.polygon(plate, fill=WHITE, outline=GOLD)
    d.polygon([iso(u, v, 0, s) for u, v in CITY], fill=(241, 238, 230), outline=GOLD)
    # road grid
    for i in range(-8, 9):
        u = i / 9
        d.line([iso(u, -1, 0, s), iso(u, 1, 0, s)], fill=(226, 220, 205), width=2)
        d.line([iso(-1, u, 0, s), iso(1, u, 0, s)], fill=(226, 220, 205), width=2)
    # ring road + main axes
    ring = [iso(.62 * math.cos(a), .62 * math.sin(a), 0, s) for a in [i * math.pi / 30 for i in range(61)]]
    d.line(ring, fill=GOLD, width=6)
    d.line([iso(-.95, -.95, 0, s), iso(.95, .95, 0, s)], fill=GOLD, width=5)
    d.line([iso(.9, -.9, 0, s), iso(-.9, .9, 0, s)], fill=GOLD, width=5)
    # wadi curve
    wadi = [iso(-.9 + .1 * math.sin(i / 3), -.9 + i * .09, 0, s) for i in range(21)]
    d.line(wadi, fill=(196, 206, 216), width=7)
    hp = eo(pr(T, t0 + .9, .6))
    if hp > 0:
        sp = [iso(u, v, 0, s) for u, v in SOUTH]
        d.polygon(sp, fill=NAVY + (int(70 * hp),)); d.line(sp + [sp[0]], fill=COPPER + (int(255 * hp),), width=6)
    place(lay, Image.new('RGBA', (1, 1)), 0, 0)
    lay = with_alpha(lay, mp); cv.paste(lay, (0, int(80 * (1 - mp))), lay)
    oy = 80 * (1 - mp)
    # north label
    nl = txt('الرياض', 44, NAVY, 'Bold'); x, y = iso(-.45, -.55, 0, s); place(cv, nl, x, y + oy, a=mp)
    # buildings rising in the south district
    blds = [(.2, .45, 70, 'v'), (.45, .6, 120, 't'), (0, .65, 60, 'v'), (.15, .8, 150, 't'), (-.15, .78, 55, 'v'), (.42, .38, 90, 'c'), (.3, .7, 50, 'v')]
    blds.sort(key=lambda b: b[0] + b[1])
    for i, (u, v, hgt, kind) in enumerate(blds):
        g = eb(pr(T, t0 + 1.3 + i * .18, .6))
        if g <= 0: continue
        isobox(cv, u, v, .07 if kind != 't' else .055, hgt * g * s, s, oy, kind)
    # pin + pulse
    px, py = iso(.2, .62, 0, s); py += oy
    for r in range(3):
        ph = ((T - t0 - 1.0) * .8 + r / 3) % 1
        if T > t0 + 1.0:
            ring_ = pulse_ring(); place(cv, ring_, px, py, s=.3 + 1.2 * ph, a=(1 - ph) * .8)
    pp = eb(pr(T, t0 + .8, .6))
    place(cv, icon('pin', 130), px, py - 75 - 220 * (1 - pp), a=cl(pp * 3))
    lq = eo(pr(T, t0 + 1.2, .5)); place(cv, pill('جنوب الرياض', 44, NAVY, IVORY, NAVY), px, py - 230 - 20 * (1 - lq), a=lq)
    # opportunity chips
    for i, (lab, t1) in enumerate((('فلل', 27.0), ('عمائر', 27.3), ('أراضٍ', 27.6), ('تجاري', 27.9))):
        s_, a_ = pop(T, t1); place(cv, pill(lab, 38), 160, 1340 + i * 120, s=.6 + .4 * s_, a=a_)
    a = eo(pr(T, t0 + .3, .6))
    character(cv, T, 'front', 760, 1895, 820, a=a, dx=60 * (1 - a))

@lru_cache(None)
def pulse_ring():
    im = Image.new('RGBA', (400, 240), (0, 0, 0, 0)); ImageDraw.Draw(im).ellipse([10, 10, 390, 230], outline=COPPER, width=8)
    return im.resize((200, 120), Image.LANCZOS)

def isobox(cv, u, v, r, hgt, s, oy, kind):
    top = [iso(u - r, v - r, hgt, s), iso(u + r, v - r, hgt, s), iso(u + r, v + r, hgt, s), iso(u - r, v + r, hgt, s)]
    left = [iso(u - r, v + r, 0, s), iso(u + r, v + r, 0, s), iso(u + r, v + r, hgt, s), iso(u - r, v + r, hgt, s)]
    right = [iso(u + r, v - r, 0, s), iso(u + r, v + r, 0, s), iso(u + r, v + r, hgt, s), iso(u + r, v - r, hgt, s)]
    sh = lambda pts: [(x, y + oy) for x, y in pts]
    d = ImageDraw.Draw(cv)
    d.polygon(sh(left), fill=NAVY); d.polygon(sh(right), fill=NAVY2)
    d.polygon(sh(top), fill=GOLD if kind != 'c' else COPPER)
    if hgt > 30:
        for f in [i / 6 for i in range(1, 6)] if kind == 't' else [.5]:
            a_ = iso(u - r * .6, v + r, hgt * f, s); b_ = iso(u + r * .6, v + r, hgt * f, s)
            d.line(sh([a_, b_]), fill=GOLD, width=3)

# ---- scene 6: CTA ----
def scene6(cv, T):
    t0 = 32.25
    corner_deco(cv, T); particles(cv, T, 24, eo(pr(T, t0, 1)), seed=11)
    q = eo(pr(T, t0 + .05, .9)); lg = logo(880)
    place(cv, lg, W / 2, 300, s=.88 + .12 * q, a=q)
    for st in (t0 + 1.0, 38.6):
        sh = pr(T, st, 1.0)
        if 0 < sh < 1: shine(cv, W / 2, 300, lg.width, lg.height, sh)
    gold_line(cv, 140, 940, 470, eio(pr(T, t0 + .4, .8)), 1, 3, GOLD)
    full = txt('عقارك قرار، وخبرتنا دليلك', 70, NAVY, 'ExtraBold')
    p1 = txt('عقارك قرار،', 70, NAVY, 'ExtraBold'); p2 = txt('وخبرتنا دليلك', 70, COPPER, 'ExtraBold')
    right = W / 2 + full.width / 2; y = 570
    a1 = eo(pr(T, 33.75, .5)); a2 = eo(pr(T, 34.95, .5))
    place(cv, p1, right, y + 25 * (1 - a1), a=a1, anchor='r')
    place(cv, p2, right - p1.width + 18, y + 25 * (1 - a2), a=a2, anchor='r')
    # contacts (left column)
    rows = [('phone', '0599818181', 34.2), ('phone', '0535422918', 34.5), ('globe', 'www.alshalaan.sa', 34.8), ('pin', 'الرياض – جنوب الرياض', 35.1)]
    for i, (ic, s_, t1) in enumerate(rows):
        a = eo(pr(T, t1, .5)); y = 860 + i * 165
        place(cv, contact_row(ic, s_), 40 - 50 * (1 - a), y, a=a, anchor='l')
    # CTA
    cq = eb(pr(T, 36.5, .55)); pulse = 1 + .03 * math.sin((T - 36.5) * 5) * cl(T - 37)
    place(cv, cta(), 285, 1560, s=(.6 + .4 * cq) * pulse, a=cl(cq * 2))
    # character + golden key
    a = eo(pr(T, t0 + .3, .7))
    character(cv, T, 'front', 820, 1895, 1060, a=a, dx=70 * (1 - a))
    kq = eb(pr(T, t0 + 1.1, .7))
    if kq > 0:
        kk = gkey(); bob = 10 * math.sin(T * 2.1)
        place(cv, kk, 790, 1150 + bob, s=.35 + .45 * kq, a=cl(kq * 2), rot=18 + 6 * math.sin(T * 1.4))
    particles(cv, T + 50, 10, a * .8, seed=21)

@lru_cache(None)
def gkey(): return glow(icon('key', 300), (214, 170, 110), 28, 1.0)

@lru_cache(None)
def contact_row(ic, s):
    w, h = 520, 130
    im = Image.new('RGBA', (w * 2, h * 2), (0, 0, 0, 0))
    ImageDraw.Draw(im).rounded_rectangle([0, 0, w * 2 - 1, h * 2 - 1], radius=48, fill=WHITE, outline=GOLD, width=4)
    im = im.resize((w, h), Image.LANCZOS)
    c = Image.new('RGBA', (184, 184), (0, 0, 0, 0)); ImageDraw.Draw(c).ellipse([0, 0, 183, 183], fill=IVORY, outline=GOLD, width=4)
    c = c.resize((92, 92), Image.LANCZOS); c.alpha_composite(icon(ic, 58), (17, 17))
    sz = 38 if is_ar(s) else (52 if s[0] == '0' else 42)
    t = txt(s, sz, NAVY, 'ExtraBold' if s[0] == '0' else 'Bold')
    if is_ar(s):
        im.alpha_composite(c, (w - 112, 19)); im.alpha_composite(t, (w - 128 - t.width, (h - t.height) // 2 + 2))
    else:
        im.alpha_composite(c, (20, 19)); im.alpha_composite(t, (128, (h - t.height) // 2 + 2))
    return shadowed(im, 16, (0, 10), .16)

@lru_cache(None)
def cta():
    t = txt('تواصل معنا اليوم', 52, IVORY, 'ExtraBold'); w, h = 500, 120
    im = Image.new('RGBA', (w * 2, h * 2), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle([0, 0, w * 2 - 1, h * 2 - 1], radius=h, fill=NAVY); d.rounded_rectangle([10, 10, w * 2 - 11, h * 2 - 11], radius=h - 10, outline=GOLD, width=4)
    im = im.resize((w, h), Image.LANCZOS); im.alpha_composite(t, ((w - t.width) // 2, (h - t.height) // 2 + 3))
    return shadowed(im, 18, (0, 12), .28)

# ================= compositor =================
SCENES = [scene1, scene2, scene3, scene4, scene5, scene6]
TW = .32  # half-width of transition

def render_scene(i, T):
    cv = background(T); SCENES[i](cv, T); return cv

def frame(n):
    T = n / FPS
    for bi in range(1, 6):
        b = B[bi]
        if abs(T - b) < TW:
            p = eio((T - (b - TW)) / (2 * TW))
            old = render_scene(bi - 1, T); new = render_scene(bi, T)
            pos = lerp(W + 700, -700, p)
            m = Image.new('L', (W, H), 0); md = ImageDraw.Draw(m)
            poly = lambda o: [(pos + o, 0), (W + 900, 0), (W + 900, H), (pos + o - 560, H)]
            md.polygon(poly(0), fill=255)
            old.paste(new, (0, 0), m)
            band = Image.new('RGBA', (W, H), (0, 0, 0, 0)); bd = ImageDraw.Draw(band)
            bd.polygon([(pos - 70, 0), (pos, 0), (pos - 560, H), (pos - 630, H)], fill=NAVY + (255,))
            bd.polygon([(pos, 0), (pos + 14, 0), (pos - 546, H), (pos - 560, H)], fill=GOLD + (255,))
            bd.polygon([(pos - 84, 0), (pos - 76, 0), (pos - 636, H), (pos - 644, H)], fill=COPPER + (255,))
            old.paste(band, (0, 0), band)
            return old.tobytes()
    i = max(k for k in range(6) if B[k] <= T) if T < B[6] else 5
    return render_scene(i, T).tobytes()

if __name__ == '__main__':
    import subprocess
    from multiprocessing import Pool
    if len(sys.argv) > 1 and sys.argv[1] == 'stills':
        for t in map(float, sys.argv[2:]):
            Image.frombytes('RGB', (W, H), frame(int(t * FPS))).save(f'still_{t:05.2f}.jpg', quality=88)
        sys.exit()
    N = int(DUR * FPS)
    ff = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                           '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', 'video_silent.mp4'], stdin=subprocess.PIPE)
    with Pool(4) as pool:
        for k, b in enumerate(pool.imap(frame, range(N), chunksize=6)):
            ff.stdin.write(b)
            if k % 150 == 0: print('frame', k, flush=True)
    ff.stdin.close(); ff.wait(); print('done')
