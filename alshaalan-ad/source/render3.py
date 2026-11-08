import math, random, sys
from functools import lru_cache
from PIL import Image, ImageDraw, ImageFilter
import render as R
import render2 as P
from render import (W, H, NAVY, NAVY2, GOLD, GOLDD, COPPER, IVORY, WHITE, GREY, cl, pr, eo, eio, eb, lerp, txt, place,
                    shadowed, glow, icon, pill, card, logo, background, corner_deco, gold_line, headline, top_logo, pop,
                    particles, shine, with_alpha, contact_row)
from render2 import actor, ic2, circ_icon, notif, tablet_base, ground, sub_head

FPS, DUR = 30, 45.0
B = [0, 5.0, 10.0, 15.3, 21.0, 26.0, 32.0, 38.0, DUR]
# voice chunks: (src_start, src_end, place_at)
VO = [(0.0, 2.35, .5), (2.55, 5.12, 5.5), (5.2, 9.85, 10.25), (9.95, 13.92, 15.8), (13.95, 16.25, 21.35),
      (16.27, 18.95, 26.35), (19.0, 23.3, 32.35), (23.32, 25.78, 38.3), (25.8, 28.37, 41.4)]
def vt(src): # map a source-VO time to video time
    for a, b, at in VO:
        if a - .05 <= src <= b + .05: return at + src - a
    return 0

# ---------------- extra icons ----------------
@lru_cache(None)
def ic3(name, size):
    im = Image.new('RGBA', (size * 4, size * 4), (0, 0, 0, 0)); d = ImageDraw.Draw(im); k = size * 4 / 100
    P_ = lambda *pts: [(x * k, y * k) for x, y in pts]
    Rr = lambda x0, y0, x1, y1: [x0 * k, y0 * k, x1 * k, y1 * k]
    if name == 'bill':
        d.rounded_rectangle(Rr(4, 22, 96, 78), radius=8 * k, fill=(214, 200, 168), outline=GOLDD, width=int(3 * k))
        d.ellipse(Rr(36, 32, 64, 68), outline=COPPER, width=int(4 * k)); d.ellipse(Rr(12, 44, 22, 56), fill=GOLDD); d.ellipse(Rr(78, 44, 88, 56), fill=GOLDD)
    elif name == 'receipt':
        pts = [(14, 4), (86, 4), (86, 92)] + [(86 - i * 9, 96 if i % 2 else 92) for i in range(1, 9)] + [(14, 92)]
        d.polygon(P_(*pts), fill=WHITE, outline=NAVY); d.line(P_(*(pts + [pts[0]])), fill=NAVY, width=int(3 * k))
        for i, w in enumerate((50, 36, 56, 30)): d.rounded_rectangle(Rr(78 - w, 16 + i * 13, 78, 21 + i * 13), radius=2 * k, fill=GREY)
        d.rounded_rectangle(Rr(24, 72, 78, 80), radius=2 * k, fill=COPPER)
    elif name == 'fence':
        d.rectangle(Rr(4, 40, 96, 48), fill=NAVY); d.rectangle(Rr(4, 70, 96, 78), fill=NAVY)
        for x in (10, 32, 54, 76):
            d.polygon(P_((x, 24), (x + 7, 14), (x + 14, 24), (x + 14, 92), (x, 92)), fill=NAVY)
            d.rectangle(Rr(x + 2, 26, x + 12, 30), fill=GOLD)
        d.rectangle(Rr(0, 92, 100, 96), fill=GOLD)
    elif name == 'sign':
        d.rectangle(Rr(4, 26, 96, 74), fill=NAVY); d.rectangle(Rr(9, 31, 91, 69), outline=GOLD, width=int(3 * k))
        d.rectangle(Rr(40, 38, 84, 46), fill=IVORY); d.rectangle(Rr(52, 54, 84, 60), fill=COPPER)
        d.polygon(P_((14, 40), (30, 40), (30, 60), (14, 60)), fill=GOLD)
        d.rectangle(Rr(0, 78, 100, 96), fill=(214, 206, 188)); d.line(Rr(0, 87, 100, 87), fill=GOLD, width=int(2 * k))
    elif name == 'platform':
        d.rounded_rectangle(Rr(6, 10, 94, 90), radius=9 * k, fill=NAVY); d.rounded_rectangle(Rr(12, 16, 88, 84), radius=5 * k, fill=IVORY)
        d.rectangle(Rr(18, 22, 82, 30), fill=WHITE, outline=GOLD)
        for j in range(2):
            y = 36 + j * 23; d.rounded_rectangle(Rr(18, y, 82, y + 19), radius=3 * k, fill=WHITE, outline=GREY)
            d.rectangle(Rr(60, y + 3, 78, y + 16), fill=GOLD); d.rectangle(Rr(24, y + 5, 52, y + 8), fill=NAVY2); d.rectangle(Rr(34, y + 11, 52, y + 14), fill=COPPER)
    elif name == 'social':
        d.rounded_rectangle(Rr(24, 4, 76, 96), radius=9 * k, fill=NAVY); d.rounded_rectangle(Rr(29, 12, 71, 86), radius=4 * k, fill=IVORY)
        heart(d, 50, 48, 15, k, COPPER)
    elif name == 'heart':
        heart(d, 50, 52, 40, k, COPPER)
    elif name == 'share':
        for (x, y) in ((24, 50), (76, 22), (76, 78)): d.ellipse(Rr(x - 13, y - 13, x + 13, y + 13), fill=NAVY)
        d.line(P_((24, 50), (76, 22)), fill=NAVY, width=int(7 * k)); d.line(P_((24, 50), (76, 78)), fill=NAVY, width=int(7 * k))
    elif name == 'play':
        d.rounded_rectangle(Rr(4, 18, 96, 82), radius=18 * k, fill=NAVY); d.polygon(P_((40, 34), (40, 66), (68, 50)), fill=IVORY)
    elif name == 'camera':
        d.rounded_rectangle(Rr(6, 6, 94, 94), radius=26 * k, outline=NAVY, width=int(9 * k)); d.ellipse(Rr(28, 28, 72, 72), outline=NAVY, width=int(9 * k))
        d.ellipse(Rr(70, 16, 82, 28), fill=COPPER)
    elif name == 'qmark':
        return txt('؟', size, COPPER, 'ExtraBold')
    elif name == 'excl':
        return txt('!', size, COPPER, 'ExtraBold')
    else:
        return ic2(name, size)
    return im.resize((size, size), Image.LANCZOS)

def heart(d, cx, cy, r, k, col):
    d.ellipse([(cx - r) * k, (cy - r * .8) * k, (cx) * k, (cy + r * .2) * k], fill=col)
    d.ellipse([(cx) * k, (cy - r * .8) * k, (cx + r) * k, (cy + r * .2) * k], fill=col)
    d.polygon([((cx - r * .97) * k, (cy - r * .12) * k), ((cx + r * .97) * k, (cy - r * .12) * k), (cx * k, (cy + r) * k)], fill=col)

@lru_cache(None)
def circ3(name, size, fill=WHITE):
    c = Image.new('RGBA', (size * 2, size * 2), (0, 0, 0, 0)); ImageDraw.Draw(c).ellipse([0, 0, size * 2 - 1, size * 2 - 1], fill=fill, outline=GOLD, width=5)
    c = c.resize((size, size), Image.LANCZOS); s = int(size * .6); c.alpha_composite(ic3(name, s), ((size - s) // 2, (size - s) // 2))
    return shadowed(c, 14, (0, 8), .18)

@lru_cache(None)
def villa_big(size): return icon('villa', size)

# =============== S1: have a property? ===============
def scene1(cv, T):
    corner_deco(cv, T); top_logo(cv, T, .1)
    headline(cv, T, 'عندك عقار؟', .5, y=270, size=104, out=4.75)
    p = eo(pr(T, vt(1.27), .5)); a = p * (1 - pr(T, 4.75, .25))
    place(cv, txt('وتبي تسوّق له؟', 76, COPPER, 'ExtraBold'), W / 2, 400 + 30 * (1 - p), a=a)
    q = eb(pr(T, .3, .8)); place(cv, villa_big(560), 770, 1580, s=.6 + .4 * q, a=cl(q * 2), anchor='b'); ground(cv, 470, 1080, 1578)
    for i, (ic, lab, x, y) in enumerate((('villa', 'فيلا', 150, 620), ('tower', 'عمارة', 400, 560), ('shop', 'تجاري', 680, 560), ('land', 'أرض', 930, 620))):
        s, a = pop(T, 1.0 + i * .3); fy = 10 * math.sin(T * 1.8 + i)
        place(cv, card(200, 200, ic, lab), x, y + 40 + fy, s=.5 + .5 * s, a=a)
    X = 300; xin = lerp(1300, X, eo(pr(T, .15, 1.3)))
    bob = -10 * abs(math.sin(T * 7.5)) * (1 - pr(T, 1.2, .3))
    actor(cv, T, [(0, 'side', True), (1.35, 'p0'), (2.3, 'p2')], xin, 1890 + bob, 1040)
    # phone in hand area
    ph = eo(pr(T, 1.5, .4)) * (1 - pr(T, 2.3, .2))
    if ph > 0: place(cv, ic2('phone', 110), xin + 10, 1890 - 1040 * .52, a=ph, rot=-8)

# =============== S2: cost problem ===============
BILLS = [(160, 700, 5.9, 'bill', -12), (900, 760, 6.2, 'receipt', 10), (230, 980, 6.5, 'bill', 8), (860, 1040, 6.8, 'bill', -6),
         (120, 1250, 7.1, 'receipt', -8), (950, 1290, 7.4, 'bill', 14), (300, 560, 7.7, 'bill', 5), (780, 560, 8.0, 'receipt', -10)]
def desk(cv, y=1450):
    d = ImageDraw.Draw(cv)
    sh = Image.new('RGBA', (W, 120), (0, 0, 0, 0)); ImageDraw.Draw(sh).rectangle([80, 30, W - 80, 80], fill=NAVY + (70,))
    sh = sh.filter(ImageFilter.GaussianBlur(20)); cv.paste(sh, (0, y - 20), sh)
    d.rounded_rectangle([40, y, W - 40, y + 46], radius=14, fill=NAVY)
    d.rectangle([40, y + 40, W - 40, y + 48], fill=GOLD)
    d.rectangle([90, y + 48, W - 90, H], fill=NAVY2)
    d.rectangle([120, y + 90, W - 120, y + 96], fill=GOLD)
    place(cv, R.logo_mark(110), W / 2, y + 230, a=.9)

def scene2(cv, T):
    t0 = B[1]
    corner_deco(cv, T); top_logo(cv, T, t0)
    headline(cv, T, 'ومحتار في تكاليف التسويق؟', 5.5, y=280, size=74)
    a = eo(pr(T, t0 + .1, .5))
    actor(cv, T, [(0, 'p0'), (6.4, 'p3'), (8.6, 'p0')], W / 2, 2050, 1260, a=a)
    # question marks + sweat drop (humour)
    for i, (x, y, t1, sz) in enumerate(((690, 680, 6.5, 120), (790, 600, 6.8, 90), (380, 640, 7.2, 100))):
        s, al = pop(T, t1, .45); place(cv, ic3('qmark', sz), x, y + 8 * math.sin(T * 4 + i), s=s, a=al, rot=10 * math.sin(T * 3 + i))
    dq = pr(T, 7.6, 1.2)
    if 0 < dq < 1: place(cv, ic2('drop', 44), 640, 760 + 140 * dq, a=1 - dq * .7)
    # bills raining
    for i, (x, y, t1, ic, r) in enumerate(BILLS):
        p = eo(pr(T, t1, .6)); al = cl((T - t1) / .2)
        if al <= 0: continue
        place(cv, ic3(ic, 150), x, y - 300 * (1 - p) + 8 * math.sin(T * 2 + i), a=al, rot=r + 20 * (1 - p))
    desk(cv)
    # desk props: phone showing ad icons + growing bill stack + unrolling receipt
    q = eo(pr(T, t0 + .3, .5))
    place(cv, phone_ads(), 820, 1460, a=q, anchor='b')
    n = int(cl((T - 6.0) / 2.6) * 9)
    for j in range(n): place(cv, ic3('bill', 130), 240 + 6 * math.sin(j * 2.1), 1440 - j * 22, a=1, rot=4 * math.sin(j * 1.7))
    rp = eio(pr(T, 8.3, 1.2))
    if rp > 0:
        d = ImageDraw.Draw(cv); x0, x1 = 420, 560; y0 = 1458; y1 = y0 + 420 * rp
        d.rectangle([x0, y0, x1, y1], fill=WHITE, outline=GREY, width=2)
        for yy in range(int(y0 + 20), int(y1 - 10), 34):
            d.rounded_rectangle([x0 + 18, yy, x1 - 40, yy + 8], radius=4, fill=GREY); d.rounded_rectangle([x1 - 32, yy, x1 - 14, yy + 8], radius=4, fill=COPPER)

@lru_cache(None)
def phone_ads():
    w, h = 190, 320; im = Image.new('RGBA', (w * 2, h * 2), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle([0, 0, w * 2 - 1, h * 2 - 1], radius=50, fill=NAVY); d.rounded_rectangle([14, 30, w * 2 - 15, h * 2 - 40], radius=28, fill=IVORY)
    im = im.resize((w, h), Image.LANCZOS)
    for j, ic in enumerate(('mega', 'play', 'platform')):
        im.alpha_composite(circ_icon('mega' if ic == 'mega' else 'chart', 66) if False else ic3_small(ic), (int(w / 2 - 33), 28 + j * 88))
    return shadowed(im, 14, (0, 10), .25)
@lru_cache(None)
def ic3_small(ic):
    c = Image.new('RGBA', (132, 132), (0, 0, 0, 0)); ImageDraw.Draw(c).ellipse([0, 0, 131, 131], fill=WHITE, outline=GOLD, width=4)
    c = c.resize((66, 66), Image.LANCZOS); c.alpha_composite(ic3(ic, 40) if ic != 'mega' else icon('mega', 40), (13, 13)); return c

# =============== S3: free offer ===============
@lru_cache(None)
def rays():
    s = 1800; im = Image.new('RGBA', (s, s), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    for i in range(24):
        a0 = i * 15; col = GOLD + (46,) if i % 2 == 0 else (255, 255, 255, 0)
        d.pieslice([0, 0, s, s], a0, a0 + 7.5, fill=col)
    m = Image.new('L', (s, s), 0); ImageDraw.Draw(m).ellipse([s * .1, s * .1, s * .9, s * .9], fill=255); m = m.filter(ImageFilter.GaussianBlur(160))
    a = im.getchannel('A'); from PIL import ImageChops; im.putalpha(ImageChops.multiply(a, m)); return im

def scene3(cv, T):
    t0 = B[2]
    rq = eo(pr(T, t0, .6))
    rr = rays().rotate(T * 8, Image.BICUBIC); place(cv, rr, W / 2, 880, a=rq)
    particles(cv, T, 30, rq, seed=4)
    # leftover bills fly away
    for i, (x, y, t1, ic, r) in enumerate(BILLS[:6]):
        p = eio(pr(T, t0 - .1 + i * .04, .55))
        if p < 1: place(cv, ic3(ic, 150), x + (x - 540) * 2.2 * p, y - 700 * p, a=1 - p, rot=r + 200 * p)
    place(cv, with_alpha(villa_big(620), .16), W / 2, 1700, a=eo(pr(T, t0 + .3, .8)), anchor='b')
    q = eo(pr(T, t0 + .2, .7)); lg = logo(700); place(cv, lg, W / 2, 240, s=.85 + .15 * q, a=q)
    ta = vt(5.34)
    s1 = eb(pr(T, ta - .05, .5)); place(cv, txt('خليك مرتاح!', 96, NAVY, 'ExtraBold'), W / 2, 480, s=.6 + .4 * s1, a=cl(s1 * 2))
    tb = vt(6.77)
    s2 = eo(pr(T, tb, .5)); place(cv, txt('نسوّق لك عقارك', 84, NAVY, 'ExtraBold'), W / 2, 640 + 30 * (1 - s2), a=s2)
    tc = 13.85
    if T > tc:
        p = pr(T, tc, .45); s3 = lerp(2.6, 1.0, eo(p)); shake = 10 * math.sin((T - tc) * 60) * cl(1 - (T - tc - .4) / .3) if T > tc + .4 else 0
        bb = big_free(); pulse = 1 + .03 * math.sin((T - tc) * 6) * cl(T - tc - .8)
        place(cv, bb, W / 2 + shake, 830, s=s3 * pulse, a=cl(p * 2.5))
        burst(cv, T, tc + .4, W / 2, 830)
    a = eo(pr(T, t0 + .15, .5))
    actor(cv, T, [(0, 'p1'), (12.0, 'p5'), (13.9, 'p1')], W / 2, 1890, 900, a=a)

@lru_cache(None)
def big_free():
    t = txt('ببلاش!', 230, COPPER, 'ExtraBold')
    return glow(t, (230, 190, 130), 26, .9)

def burst(cv, T, t0, cx, cy):
    p = pr(T, t0, 1.2)
    if p <= 0 or p >= 1: return
    rnd = random.Random(9)
    for i in range(26):
        ang = rnd.uniform(0, 2 * math.pi); sp = rnd.uniform(260, 560); r = rnd.choice((3, 4, 5))
        x = cx + math.cos(ang) * sp * eo(p); y = cy + math.sin(ang) * sp * eo(p) * .8 + 120 * p * p
        place(cv, R.dot(r, GOLD if i % 3 else COPPER), x, y, a=1 - p)

# =============== S4: fencing ===============
LC = (620, 1000); LU, LV = 205, 118
def lp(u, v, z=0): return (LC[0] + (u - v) * LU, LC[1] + (u + v) * LV - z)
EDGES = [((-1, -1), (1, -1)), ((-1, -1), (-1, 1)), ((1, -1), (1, 1)), ((-1, 1), (1, 1))]  # back edges first
def scene4(cv, T):
    t0 = B[3]
    corner_deco(cv, T); top_logo(cv, T, t0)
    headline(cv, T, 'أولاً: تسوير العقار', t0 + .3, y=270, size=86)
    q = eo(pr(T, t0 + .1, .6)); oy = 80 * (1 - q)
    lay = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    plate = [lp(-1.1, -1.1), lp(1.1, -1.1), lp(1.1, 1.1), lp(-1.1, 1.1)]
    d.polygon([(x, y + 26) for x, y in plate], fill=GOLDD); d.polygon(plate, fill=(238, 232, 214), outline=GOLD)
    land = [lp(-1, -1), lp(1, -1), lp(1, 1), lp(-1, 1)]
    d.polygon(land, fill=(226, 214, 186))
    for i in range(-4, 5):
        u = i / 5; d.line([lp(u, -1), lp(u, 1)], fill=(214, 200, 168), width=2); d.line([lp(-1, u), lp(1, u)], fill=(214, 200, 168), width=2)
    # boundary markers (dashed)
    if T < 16.2 + 3.0:
        for e in EDGES:
            (u0, v0), (u1, v1) = e
            for j in range(0, 20, 2):
                a_ = lp(lerp(u0, u1, j / 20), lerp(v0, v1, j / 20)); b_ = lp(lerp(u0, u1, (j + 1) / 20), lerp(v0, v1, (j + 1) / 20))
                d.line([a_, b_], fill=COPPER, width=5)
    lay = with_alpha(lay, q); cv.paste(lay, (0, int(oy)), lay)
    # fence panels appear one after another (back edges then front edges)
    seg = 8; total = len(EDGES) * seg; tf0, tf1 = 16.2, 19.4
    fd = ImageDraw.Draw(cv); hgt = 95
    k = 0
    for ei, ((u0, v0), (u1, v1)) in enumerate(EDGES):
        if ei == 3: pass
        for j in range(seg):
            tk = tf0 + (tf1 - tf0) * k / total; k += 1
            g = eb(pr(T, tk, .3))
            if g <= 0: continue
            a0 = (lerp(u0, u1, j / seg), lerp(v0, v1, j / seg)); a1 = (lerp(u0, u1, (j + 1) / seg), lerp(v0, v1, (j + 1) / seg))
            h_ = hgt * min(g, 1.08)
            p0 = lp(*a0); p1 = lp(*a1); P0 = lp(*a0, h_); P1 = lp(*a1, h_)
            sh = lambda pt: (pt[0], pt[1] + oy)
            fd.polygon([sh(p0), sh(p1), sh(P1), sh(P0)], fill=NAVY if ei in (0, 1) else NAVY2)
            fd.line([sh(lp(*a0, h_ - 14)), sh(lp(*a1, h_ - 14))], fill=GOLD, width=5)
            fd.line([sh(lp(*a0, h_ * .45)), sh(lp(*a1, h_ * .45))], fill=(70, 100, 130), width=3)
            fd.rectangle([sh(P0)[0] - 5, sh(P0)[1] - 10, sh(P0)[0] + 5, sh(p0)[1]], fill=GOLD)
        if ei in (0, 1) and False: pass
    if T > 19.5:
        c = eb(pr(T, 19.5, .5)); place(cv, pill('تم تسوير العقار', 40, NAVY, IVORY, NAVY), 640, 1390, s=.6 + .4 * c, a=cl(c * 2))
        place(cv, icon('check', 70), 860, 1360, s=c, a=cl(c * 2))
    a = eo(pr(T, t0 + .2, .6))
    actor(cv, T, [(0, 'p0'), (16.0, 'p2'), (19.6, 'p5')], 210, 1895, 780, a=a, dx=-60 * (1 - a))

# =============== S5: wall sign ===============
@lru_cache(None)
def wall_scene():
    lay = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    lay.alpha_composite(with_alpha(villa_big(560), .95), (W // 2 - 280 + 120, 560))
    d.rectangle([0, 1000, W, 1420], fill=(238, 232, 218)); d.rectangle([0, 980, W, 1004], fill=GOLD)
    for x in range(0, W, 180):
        d.rectangle([x, 980, x + 40, 1420], fill=(226, 218, 200))
    for y in range(1060, 1420, 60): d.line([0, y, W, y], fill=(230, 222, 206), width=2)
    d.rectangle([0, 1420, W, 1440], fill=GOLD)
    return lay

@lru_cache(None)
def sign_board():
    w, h = 600, 330; im = Image.new('RGBA', (w * 2, h * 2), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle([0, 0, w * 2 - 1, h * 2 - 1], radius=24, fill=NAVY); d.rounded_rectangle([18, 18, w * 2 - 19, h * 2 - 19], radius=16, outline=GOLD, width=6)
    im = im.resize((w, h), Image.LANCZOS)
    pl = Image.new('RGBA', (w - 60, 120), (0, 0, 0, 0)); ImageDraw.Draw(pl).rounded_rectangle([0, 0, w - 61, 119], radius=14, fill=IVORY)
    lg = logo(380); pl.alpha_composite(lg, ((w - 60 - lg.width) // 2, (120 - lg.height) // 2)); im.alpha_composite(pl, (30, 28))
    t = txt('للبيع  |  للإيجار', 54, IVORY, 'ExtraBold'); im.alpha_composite(t, ((w - t.width) // 2, 160))
    t = txt('0599818181', 46, GOLD, 'ExtraBold'); im.alpha_composite(t, ((w - t.width) // 2, 245))
    return im

def scene5(cv, T):
    t0 = B[4]
    corner_deco(cv, T)
    headline(cv, T, 'لوحة إعلانية على جدار العقار', t0 + .3, y=250, size=70)
    z = 1 + .16 * eio(pr(T, 23.6, 1.6))
    q = eo(pr(T, t0 + .1, .6))
    lay = wall_scene().copy()
    sp = eb(pr(T, 21.9, .7)); sy = lerp(-400, 1205, eo(pr(T, 21.9, .6)))
    if T > 21.9:
        sb = sign_board(); place(lay, shadowed(sb, 18, (0, 14), .3), 650, sy + 4 * math.sin(math.pi * cl((T - 22.5) / .25)) * (T > 22.5), a=1)
        for i, (bx, by) in enumerate(((-270, -135), (270, -135), (-270, 135), (270, 135))):
            c = eb(pr(T, 22.6 + i * .12, .25))
            if c > 0: place(lay, R.dot(5, GOLD), 650 + bx, sy + by, s=c, a=cl(c))
    if z > 1.001:
        cx, cy = 650, 1205; lay = lay.resize((round(W * z), round(H * z)), Image.BICUBIC)
        lay = lay.crop((round(cx * z - cx), round(cy * z - cy), round(cx * z - cx) + W, round(cy * z - cy) + H))
    lay = with_alpha(lay, q); cv.paste(lay, (0, int(60 * (1 - q))), lay)
    a = eo(pr(T, t0 + .2, .6))
    actor(cv, T, [(0, 'p0'), (21.6, 'p2'), (24.3, 'p5')], 165, 1895, 760, a=a, dx=-60 * (1 - a))

# =============== S6: platforms ===============
def listing(w, featured=False):
    return _listing(w, featured)
@lru_cache(None)
def _listing(w, featured):
    h = int(w * .42) if not featured else int(w * .9)
    im = Image.new('RGBA', (w * 2, h * 2), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle([0, 0, w * 2 - 1, h * 2 - 1], radius=36, fill=WHITE, outline=COPPER if featured else GREY, width=5 if featured else 3)
    im = im.resize((w, h), Image.LANCZOS); d = ImageDraw.Draw(im)
    if featured:
        ph = int(h * .55); d.rounded_rectangle([14, 14, w - 14, ph], radius=16, fill=(236, 228, 210))
        v = villa_big(int(ph * .85)); im.alpha_composite(v, ((w - v.width) // 2, ph - v.height + 4))
        for j in range(3): d.ellipse([w // 2 - 30 + j * 24, ph - 18, w // 2 - 20 + j * 24, ph - 8], fill=NAVY if j == 0 else WHITE)
        y = ph + 16
        for ic, lab in (('house', 'نوع العقار: فيلا'), ('pin', 'الموقع: جنوب الرياض')):
            t = txt(lab, 30, NAVY, 'Bold'); im.alpha_composite(t, (w - 70 - t.width, y)); im.alpha_composite(ic2(ic, 40) if ic == 'house' else icon('pin', 40), (w - 60, y + 6)); y += 50
        for j, ic in enumerate(('مساحة', 'غرف', 'واجهة')):
            x = w - 30 - j * 150; d.rounded_rectangle([x - 130, y + 6, x, y + 52], radius=23, fill=IVORY, outline=GOLD, width=2)
            t = txt(ic, 26, NAVY2, 'Bold'); im.alpha_composite(t, (int(x - 65 - t.width / 2), y + 29 - t.height // 2))
    else:
        d.rounded_rectangle([w - 14 - int(h * 1.1), 14, w - 14, h - 14], radius=14, fill=(236, 228, 210))
        v = icon('villa', int(h * .7)); im.alpha_composite(v, (w - 14 - int(h * .55) - v.width // 2, (h - v.height) // 2))
        x1 = w - 30 - int(h * 1.1)
        d.rounded_rectangle([x1 - 220, 34, x1, 50], radius=8, fill=NAVY2); d.rounded_rectangle([x1 - 160, 66, x1, 80], radius=7, fill=GREY)
        d.rounded_rectangle([x1 - 120, h - 52, x1, h - 34], radius=9, fill=COPPER)
    return shadowed(im, 16, (0, 10), .18)

def scene6(cv, T):
    t0 = B[5]
    corner_deco(cv, T); top_logo(cv, T, t0)
    headline(cv, T, 'إعلان في المنصات العقارية', t0 + .3, y=270, size=74)
    q = eo(pr(T, t0 + .2, .6)); tw, th = 700, 1080; cx, cy = 650, 1010
    tb = P.tablet_base(tw, th, 'منصة عقارية').copy(); d = ImageDraw.Draw(tb)
    d.rounded_rectangle([30, 90, tw - 30, 140], radius=24, fill=WHITE, outline=GOLD, width=2)
    st = txt('ابحث عن عقار...', 28, NAVY2, 'Medium'); tb.alpha_composite(st, (tw - 60 - st.width, 115 - st.height // 2))
    tb.alpha_composite(ic2('mag', 34), (44, 98))
    fq = eb(pr(T, 26.8, .6))
    if fq > 0:
        L = listing(tw - 70, True); L = L.resize((max(1, int(L.width * (.6 + .4 * fq))), max(1, int(L.height * (.6 + .4 * fq)))))
        tb.alpha_composite(with_alpha(L, cl(fq * 2)), ((tw - L.width) // 2, 140 + int((1 - fq) * 60)))
    for j in range(2):
        g = eo(pr(T, 28.0 + j * .35, .5))
        if g > 0:
            L = listing(tw - 70); tb.alpha_composite(with_alpha(L, g), ((tw - L.width) // 2, int(720 + j * 170 + 80 * (1 - g))))
    place(cv, shadowed(tb, 24, (0, 18), .25), cx, cy + 70 * (1 - q) + 6 * math.sin(T * 1.3), a=q)
    if T > 29.0:
        c = eb(pr(T, 29.0, .45)); place(cv, pill('تم نشر الإعلان', 38, NAVY, IVORY, NAVY), 860, 520, s=.6 + .4 * c, a=cl(c * 2))
    a = eo(pr(T, t0 + .2, .6))
    actor(cv, T, [(0, 'p3'), (26.6, 'p2'), (30.4, 'p5')], 210, 1895, 780, a=a, dx=-60 * (1 - a))

# =============== S7: social media ===============
def scene7(cv, T):
    t0 = B[6]
    corner_deco(cv, T); top_logo(cv, T, t0)
    headline(cv, T, 'إعلان في منصات التواصل الاجتماعي', t0 + .3, y=270, size=62)
    q = eo(pr(T, t0 + .2, .6)); ph = phone_post(); cx, cy = 560, 900
    # spreading cards and icons
    for i, (ic, ang, dist) in enumerate((('heart', -150, 360), ('share', -30, 380), ('play', 200, 380), ('camera', 20, 360), ('chat', 150, 360), ('heart', -90, 330))):
        g = eo(pr(T, 33.2 + i * .18, .7)); a_ = cl(g * 2)
        if g <= 0: continue
        x = cx + math.cos(math.radians(ang)) * dist * g; y = cy + math.sin(math.radians(ang)) * dist * g * .85
        place(cv, circ3(ic, 120), x, y + 8 * math.sin(T * 2 + i), s=.5 + .5 * g, a=a_)
    for i, (dx, dy, r) in enumerate(((-330, 520, -8), (330, 520, 8))):
        g = eo(pr(T, 34.0 + i * .2, .7))
        if g > 0: place(cv, with_alpha(ph, .9), cx + dx * g, cy + dy * g * .3, s=.42, a=g * .85, rot=r * g)
    place(cv, ph, cx, cy + 60 * (1 - q) + 6 * math.sin(T * 1.4), a=q)
    # interested customer
    tc = vt(22.04)
    cq = eb(pr(T, tc, .5))
    if cq > 0:
        place(cv, circ_icon('person', 170), 870, 1660, s=cq, a=cl(cq))
        place(cv, ic2('phone', 90), 960, 1730, s=cq, a=cl(cq), rot=12)
        nq = eb(pr(T, tc + .4, .5)); place(cv, P.notif('bell', 'عميل مهتم بعقارك!', 500, 108), 740, 1450, s=.5 + .5 * nq, a=cl(nq * 2))
    a = eo(pr(T, t0 + .2, .6))
    actor(cv, T, [(0, 'p3'), (33.0, 'p4'), (tc + .3, 'p2')], 210, 1895, 780, a=a, dx=-60 * (1 - a))

@lru_cache(None)
def phone_post():
    w, h = 430, 800; im = Image.new('RGBA', (w * 2, h * 2), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle([0, 0, w * 2 - 1, h * 2 - 1], radius=80, fill=NAVY); d.rounded_rectangle([20, 50, w * 2 - 21, h * 2 - 50], radius=46, fill=WHITE)
    im = im.resize((w, h), Image.LANCZOS); d = ImageDraw.Draw(im)
    im.alpha_composite(circ_icon('house', 56), (w - 80, 45)); im.alpha_composite(R.logo_mark(40), (w - 72, 52)) if False else None
    t = txt('الشعلان العقارية', 28, NAVY, 'ExtraBold'); im.alpha_composite(t, (w - 92 - t.width, 58))
    d.rectangle([14, 115, w - 14, 470], fill=(236, 228, 210))
    v = villa_big(300); im.alpha_composite(v, ((w - v.width) // 2, 160))
    d.rectangle([14, 410, w - 14, 470], fill=NAVY + (255,))
    t = txt('عقار مميز للتسويق', 32, IVORY, 'ExtraBold'); im.alpha_composite(t, ((w - t.width) // 2, 440 - t.height // 2))
    x = w - 40
    for ic in ('heart', 'chat', 'share'):
        im.alpha_composite(ic3(ic, 46) if ic != 'chat' else icon('chat', 46), (x - 46, 490)); x -= 70
    for j, ww in enumerate((300, 240, 280)): d.rounded_rectangle([w - 40 - ww, 565 + j * 30, w - 40, 579 + j * 30], radius=7, fill=GREY)
    d.rounded_rectangle([40, 680, w - 40, 740], radius=30, fill=COPPER)
    t = txt('تواصل الآن', 32, IVORY, 'ExtraBold'); im.alpha_composite(t, ((w - t.width) // 2, 710 - t.height // 2))
    return shadowed(im, 24, (0, 18), .28)

# =============== S8: experience + final ===============
SERV = [('fence', 'تسوير العقار', 185, 950), ('sign', 'لوحة إعلانية', 895, 950), ('platform', 'المنصات العقارية', 185, 1290), ('social', 'التواصل الاجتماعي', 895, 1290)]
def scene8(cv, T):
    t0 = B[7]; tB = 41.25
    corner_deco(cv, T); particles(cv, T, 22, eo(pr(T, t0, 1)), seed=12)
    outA = eio(pr(T, tB - .3, .4))
    # phase A
    if outA < 1:
        aA = 1 - outA
        q1 = eo(pr(T, t0 + .2, .5)); place(cv, txt('خبرة تتجاوز', 66, NAVY, 'Bold'), W / 2, 250 + 30 * (1 - q1), a=q1 * aA)
        n = int(round(40 * eio(pr(T, vt(24.7) - .3, 1.0)))); q2 = eb(pr(T, vt(24.7) - .3, .6))
        if T > vt(24.7) - .35: place(cv, txt(str(n), 230, COPPER, 'ExtraBold'), W / 2, 430, s=.7 + .3 * q2, a=cl(q2) * aA)
        q3 = eo(pr(T, vt(24.7) + .3, .5)); place(cv, txt('عاماً', 70, NAVY, 'ExtraBold'), W / 2, 610 + 30 * (1 - q3), a=q3 * aA)
        tp = eio(pr(T, t0 + .5, 1.6)); gold_line(cv, 90, 990, 720, tp, aA, 4, GOLD)
        for i in range(5):
            if tp * 4 >= i - .01:
                c = eb(pr(T, t0 + .5 + i * .4, .35)); place(cv, icon('diamondc' if i == 4 else 'diamond', 32 if i == 4 else 22), 990 - i * 225, 720, s=c, a=cl(c) * aA)
        for i, (ic, lab, x, y) in enumerate(SERV):
            s, a = pop(T, t0 + .3 + i * .25); fy = 8 * math.sin(T * 1.8 + i)
            place(cv, circ3(ic, 190), x, y + fy, s=.5 + .5 * s, a=a * aA)
            place(cv, pill(lab, 30), x, y + 130 + fy, s=.5 + .5 * s, a=a * aA)
    # phase B
    if T > tB - .2:
        q = eo(pr(T, tB - .1, .8)); lg = logo(860); place(cv, lg, W / 2, 290, s=.88 + .12 * q, a=q)
        sh = pr(T, tB + .8, 1.0)
        if 0 < sh < 1: shine(cv, W / 2, 290, lg.width, lg.height, sh)
        gold_line(cv, 140, 940, 455, eio(pr(T, tB + .2, .7)), 1, 3, GOLD)
        full = txt('عندك عقار؟ خلّ تسويقه علينا!', 64, NAVY, 'ExtraBold')
        p1 = txt('عندك عقار؟', 64, NAVY, 'ExtraBold'); p2 = txt('خلّ تسويقه علينا!', 64, COPPER, 'ExtraBold')
        right = W / 2 + full.width / 2; y = 555
        a1 = eo(pr(T, vt(25.93) - .05, .45)); a2 = eo(pr(T, vt(26.92) - .05, .45))
        place(cv, p1, right, y + 25 * (1 - a1), a=a1, anchor='r'); place(cv, p2, right - p1.width + 18, y + 25 * (1 - a2), a=a2, anchor='r')
        rows = [('phone', '0599818181', 41.7), ('phone', '0535422918', 41.95), ('globe', 'www.alshalaan.sa', 42.2), ('pin', 'الرياض – جنوب الرياض', 42.45)]
        for i, (ic, s_, t1) in enumerate(rows):
            a = eo(pr(T, t1, .45)); place(cv, contact_row(ic, s_), 40 - 50 * (1 - a), 830 + i * 160, a=a, anchor='l')
        cq = eb(pr(T, 43.3, .5)); pulse = 1 + .03 * math.sin((T - 43.3) * 5) * cl(T - 43.8)
        place(cv, R.cta(), 285, 1520, s=(.6 + .4 * cq) * pulse, a=cl(cq * 2))
    # character: centre in phase A, moves right in phase B
    a = eo(pr(T, t0 + .1, .5)); mv = eio(pr(T, tB - .2, .7))
    x = lerp(W / 2, 865, mv); hc = int(lerp(860, 980, mv))
    actor(cv, T, [(0, 'cross'), (vt(24.7) + .6, 'p5'), (tB, 'p2'), (vt(26.92), 'p1')], x, 1890, hc, a=a)

# =============== compositor ===============
SCENES = [scene1, scene2, scene3, scene4, scene5, scene6, scene7, scene8]
TW = .3
def render_scene(i, T):
    cv = background(T); SCENES[i](cv, T); return cv

def frame(n):
    T = n / FPS
    for bi in range(1, len(B) - 1):
        b = B[bi]
        if abs(T - b) < TW:
            p = eio((T - (b - TW)) / (2 * TW))
            old = render_scene(bi - 1, T); new = render_scene(bi, T)
            pos = lerp(W + 700, -700, p)
            m = Image.new('L', (W, H), 0); ImageDraw.Draw(m).polygon([(pos, 0), (W + 900, 0), (W + 900, H), (pos - 560, H)], fill=255)
            old.paste(new, (0, 0), m)
            band = Image.new('RGBA', (W, H), (0, 0, 0, 0)); bd = ImageDraw.Draw(band)
            bd.polygon([(pos - 70, 0), (pos, 0), (pos - 560, H), (pos - 630, H)], fill=NAVY + (255,))
            bd.polygon([(pos, 0), (pos + 14, 0), (pos - 546, H), (pos - 560, H)], fill=GOLD + (255,))
            bd.polygon([(pos - 84, 0), (pos - 76, 0), (pos - 636, H), (pos - 644, H)], fill=COPPER + (255,))
            old.paste(band, (0, 0), band)
            return old.tobytes()
    i = max(k for k in range(len(SCENES)) if B[k] <= T)
    return render_scene(i, T).tobytes()

if __name__ == '__main__':
    import subprocess
    from multiprocessing import Pool
    if len(sys.argv) > 1 and sys.argv[1] == 'stills':
        for t in map(float, sys.argv[2:]):
            Image.frombytes('RGB', (W, H), frame(int(t * FPS))).save(f'fm/still_{t:05.2f}.jpg', quality=88)
        sys.exit()
    N = int(DUR * FPS)
    ff = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                           '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', 'fm/video_silent.mp4'], stdin=subprocess.PIPE)
    with Pool(4) as pool:
        for k, b in enumerate(pool.imap(frame, range(N), chunksize=6)):
            ff.stdin.write(b)
    ff.stdin.close(); ff.wait(); print('done')
