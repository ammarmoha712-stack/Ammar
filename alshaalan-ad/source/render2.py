import math, random, sys, os
from functools import lru_cache
from PIL import Image, ImageDraw, ImageFilter
import numpy as np
import render as R
from render import (W, H, NAVY, NAVY2, GOLD, GOLDD, COPPER, IVORY, WHITE, GREY, cl, pr, eo, eio, eb, lerp, txt, place,
                    shadowed, glow, icon, pill, logo, background, corner_deco, gold_line, headline, top_logo, pop, particles,
                    shine, with_alpha, floor_shadow, is_ar, contact_row)

FPS, DUR = 30, 41.0
OFF = 0.3
B = [0, 6.2, 12.4, 18.2, 23.75, 30.05, 34.6, DUR]

# ---------------- poses ----------------
SRC = {'cross': 'char_fix.png', 'side': 'turn2_fix.png', 'q': 'turn1_fix.png'}
for i in range(8): SRC[f'p{i}'] = f'pm/p{i}_fix.png'

@lru_cache(None)
def raw_pose(name):
    im = Image.open(SRC[name]).convert('RGBA'); a = np.array(im.getchannel('A'))
    rows = np.where((a > 200).sum(1) > max(6, im.width * .04))[0]
    im = im.crop((0, 0, im.width, int(rows.max()) + 3)); a = np.array(im.getchannel('A')).astype(float)
    lo = a[int(a.shape[0] * .6):]; xs = np.arange(a.shape[1])
    cx = (lo.sum(0) * xs).sum() / lo.sum()
    return im, cx / im.width

@lru_cache(None)
def pose(name, h, flip=False):
    im, cxr = raw_pose(name)
    if flip: im = im.transpose(Image.FLIP_LEFT_RIGHT); cxr = 1 - cxr
    out = im.resize((round(im.width * h / im.height), h), Image.LANCZOS)
    if im.height < h * .8: out = out.filter(ImageFilter.UnsharpMask(2, 70, 2))
    return out, cxr

def draw_pose(cv, T, name, x, feet, h, a, flip=False, s=1.0):
    if a <= .004: return
    base, cxr = pose(name, h, flip)
    br = math.sin(T * 2 * math.pi / 3.6); sy = (1 + .0045 * br) * s
    im = base.resize((round(base.width * s), round(base.height * sy)), Image.BICUBIC) if abs(sy - 1) > .001 else base
    sway = 2.5 * math.sin(T * 2 * math.pi / 5.3)
    px = x + sway - im.width * cxr
    im = with_alpha(im, a); cv.paste(im, (round(px), round(feet - im.height)), im)

def actor(cv, T, sched, x, feet, h, a=1.0, dx=0.0, xf=0.18):
    if a <= .004: return
    place(cv, floor_shadow(int(h * .3)), x + dx, feet + 8, a=a * .9)
    i = max(k for k in range(len(sched)) if sched[k][0] <= T) if T >= sched[0][0] else 0
    t0, nm = sched[i][0], sched[i][1]; fl = len(sched[i]) > 2 and sched[i][2]
    f = cl((T - t0) / xf) if i > 0 else 1.0
    s = 1 + .012 * math.sin(math.pi * f) if i > 0 else 1.0
    if f < 1:
        pn = sched[i - 1]; draw_pose(cv, T, pn[1], x + dx, feet, h, a * (1 - f), len(pn) > 2 and pn[2], s)
    draw_pose(cv, T, nm, x + dx, feet, h, a * f, fl, s)

# ---------------- icons ----------------
@lru_cache(None)
def ic2(name, size):
    im = Image.new('RGBA', (size * 4, size * 4), (0, 0, 0, 0)); d = ImageDraw.Draw(im); k = size * 4 / 100
    P = lambda *pts: [(x * k, y * k) for x, y in pts]
    Rr = lambda x0, y0, x1, y1: [x0 * k, y0 * k, x1 * k, y1 * k]
    if name == 'bell':
        d.pieslice(Rr(22, 14, 78, 70), 180, 360, fill=NAVY); d.rectangle(Rr(22, 42, 78, 70), fill=NAVY)
        d.polygon(P((16, 70), (84, 70), (78, 62), (22, 62)), fill=NAVY); d.rounded_rectangle(Rr(12, 68, 88, 78), radius=4 * k, fill=NAVY)
        d.ellipse(Rr(40, 78, 60, 94), fill=COPPER); d.ellipse(Rr(44, 6, 56, 18), fill=NAVY)
    elif name == 'wrench':
        d.line(P((28, 72), (66, 34)), fill=NAVY, width=int(14 * k))
        d.ellipse(Rr(54, 8, 92, 46), fill=NAVY); d.polygon(P((70, 6), (84, 6), (80, 26), (70, 26)), fill=(0, 0, 0, 0))
        d.rectangle(Rr(68, 2, 82, 24), fill=(0, 0, 0, 0))
        d.ellipse(Rr(14, 62, 40, 88), fill=NAVY); d.ellipse(Rr(22, 70, 32, 80), fill=GOLD)
    elif name == 'calendar':
        d.rounded_rectangle(Rr(10, 16, 90, 92), radius=8 * k, fill=NAVY); d.rectangle(Rr(14, 34, 86, 88), fill=IVORY)
        for x in (28, 72): d.rounded_rectangle(Rr(x - 4, 6, x + 4, 24), radius=3 * k, fill=COPPER)
        for r in range(3):
            for c in range(4): d.rectangle(Rr(20 + c * 16, 42 + r * 14, 30 + c * 16, 50 + r * 14), fill=GOLD if (r, c) != (1, 2) else COPPER)
    elif name == 'coin':
        d.ellipse(Rr(6, 6, 94, 94), fill=GOLD); d.ellipse(Rr(16, 16, 84, 84), outline=GOLDD, width=int(4 * k))
        d.rectangle(Rr(44, 30, 56, 70), fill=NAVY); d.rectangle(Rr(34, 40, 66, 48), fill=NAVY); d.rectangle(Rr(34, 54, 66, 62), fill=NAVY)
    elif name == 'doc':
        d.polygon(P((18, 4), (64, 4), (84, 24), (84, 96), (18, 96)), fill=WHITE, outline=NAVY)
        d.line(P((18, 4), (64, 4), (84, 24), (84, 96), (18, 96), (18, 4)), fill=NAVY, width=int(5 * k))
        d.polygon(P((64, 4), (64, 24), (84, 24)), fill=GOLD)
        for i, w in enumerate((44, 52, 38, 50)): d.rounded_rectangle(Rr(78 - w, 36 + i * 12, 74, 41 + i * 12), radius=2 * k, fill=NAVY2)
        d.line(P((28, 86), (36, 80), (44, 86), (52, 80)), fill=COPPER, width=int(3 * k))
    elif name == 'useradd':
        d.ellipse(Rr(18, 8, 56, 46), fill=NAVY2); d.pieslice(Rr(2, 52, 72, 122), 180, 360, fill=NAVY2)
        d.ellipse(Rr(58, 50, 96, 88), fill=COPPER); d.rectangle(Rr(74, 58, 80, 80), fill=WHITE); d.rectangle(Rr(66, 66, 88, 72), fill=WHITE)
    elif name == 'mag':
        d.ellipse(Rr(8, 8, 66, 66), outline=NAVY, width=int(10 * k)); d.line(P((58, 58), (90, 90)), fill=NAVY, width=int(14 * k))
        d.ellipse(Rr(20, 20, 54, 54), fill=GOLD + (120,))
    elif name == 'ac':
        d.rounded_rectangle(Rr(6, 20, 94, 60), radius=8 * k, fill=NAVY); d.rectangle(Rr(14, 48, 86, 52), fill=GOLD)
        for x in (26, 50, 74): d.line(P((x, 66), (x - 6, 80), (x, 94)), fill=COPPER, width=int(4 * k), joint='curve')
    elif name == 'drop':
        d.ellipse(Rr(22, 38, 78, 94), fill=NAVY); d.polygon(P((24, 58), (76, 58), (50, 6)), fill=NAVY)
        d.ellipse(Rr(36, 60, 50, 74), fill=GOLD)
    elif name == 'bolt':
        d.polygon(P((58, 4), (20, 56), (46, 56), (38, 96), (80, 40), (54, 40), (66, 4)), fill=COPPER)
    elif name == 'bars':
        for i, hh in enumerate((40, 62, 84)): d.rounded_rectangle(Rr(12 + i * 28, 94 - hh, 32 + i * 28, 94), radius=3 * k, fill=NAVY if i < 2 else COPPER)
    elif name == 'house':
        d.polygon(P((50, 8), (94, 46), (6, 46)), fill=COPPER); d.rectangle(Rr(16, 44, 84, 92), fill=NAVY); d.rectangle(Rr(42, 60, 58, 92), fill=GOLD)
    elif name == 'report':
        d.rounded_rectangle(Rr(12, 4, 88, 96), radius=8 * k, fill=WHITE, outline=NAVY, width=int(5 * k))
        for i, hh in enumerate((20, 34, 26, 44)): d.rectangle(Rr(24 + i * 14, 62 - hh, 34 + i * 14, 62), fill=NAVY if i != 3 else COPPER)
        for i in range(2): d.rounded_rectangle(Rr(24, 72 + i * 10, 76 - i * 16, 77 + i * 10), radius=2 * k, fill=GOLD)
    else:
        return icon(name, size)
    return im.resize((size, size), Image.LANCZOS)

@lru_cache(None)
def circ_icon(name, size, fill=IVORY):
    c = Image.new('RGBA', (size * 2, size * 2), (0, 0, 0, 0)); ImageDraw.Draw(c).ellipse([0, 0, size * 2 - 1, size * 2 - 1], fill=fill, outline=GOLD, width=4)
    c = c.resize((size, size), Image.LANCZOS); s = int(size * .6); c.alpha_composite(ic2(name, s), ((size - s) // 2, (size - s) // 2))
    return c

@lru_cache(None)
def notif(ic, text, w=420, h=108):
    im = Image.new('RGBA', (w * 2, h * 2), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle([0, 0, w * 2 - 1, h * 2 - 1], radius=40, fill=WHITE, outline=GOLD, width=4)
    im = im.resize((w, h), Image.LANCZOS)
    im.alpha_composite(circ_icon(ic, 76), (w - 92, (h - 76) // 2))
    t = txt(text, 36, NAVY, 'Bold'); im.alpha_composite(t, (w - 104 - t.width, 14))
    d = ImageDraw.Draw(im); d.rounded_rectangle([w - 116 - 170, 70, w - 116, 80], radius=5, fill=GREY)
    d.ellipse([18, 18, 38, 38], fill=COPPER)
    return shadowed(im, 16, (0, 10), .18)

@lru_cache(None)
def res_building(w, h, floors=6, cols=3, seed=1):
    S = 2; im = Image.new('RGBA', (w * S, h * S), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    W2, H2 = w * S, h * S
    d.rectangle([W2 * .04, H2 * .06, W2 * .96, H2], fill=NAVY)
    d.rectangle([0, H2 * .03, W2, H2 * .075], fill=COPPER)
    fh = (H2 * .86) / floors; cw = (W2 * .84) / cols
    for f in range(floors):
        y0 = H2 * .1 + f * fh
        for c in range(cols):
            x0 = W2 * .08 + c * cw
            if f == floors - 1 and c == cols // 2:
                d.rectangle([x0 + cw * .25, y0 + fh * .15, x0 + cw * .75, H2], fill=COPPER); continue
            d.rectangle([x0 + cw * .12, y0 + fh * .18, x0 + cw * .88, y0 + fh * .72], fill=GOLD)
            d.line([x0 + cw * .5, y0 + fh * .18, x0 + cw * .5, y0 + fh * .72], fill=NAVY, width=S * 2)
            d.rectangle([x0 + cw * .06, y0 + fh * .72, x0 + cw * .94, y0 + fh * .8], fill=IVORY)
    return im.resize((w, h), Image.LANCZOS)

def ground(cv, x0, x1, y):
    d = ImageDraw.Draw(cv); d.rectangle([x0, y, x1, y + 5], fill=GOLD)

def sub_head(cv, T, text, t0, y, size=56, col=COPPER, out=None):
    p = eo(pr(T, t0, .6)); a = p * (1 - pr(T, out, .3) if out else 1)
    place(cv, txt(text, size, col, 'Bold'), W / 2, y + 30 * (1 - p), a=a)

# =============== SCENE 1: owner's problem ===============
N1 = [('wrench', 'طلب صيانة', 770, 545, -4), ('calendar', 'تذكير بالإيجار', 290, 600, 3), ('chat', 'رسالة من مستأجر', 760, 680, 2),
      ('doc', 'عقد إيجار', 300, 1560, -3), ('coin', 'دفعة مستحقة', 330, 1690, 4)]
def scene1(cv, T):
    corner_deco(cv, T); top_logo(cv, T, .1)
    headline(cv, T, 'تملك عقاراً؟', .3, y=270, size=100, out=5.9)
    p = eo(pr(T, 1.5, .6)); a = p * (1 - pr(T, 5.9, .3))
    place(cv, txt('من يدير تفاصيله؟', 70, COPPER, 'ExtraBold'), W / 2, 395 + 30 * (1 - p), a=a)
    # building
    q = eo(pr(T, .2, 1.0)); bld = res_building(400, 700)
    place(cv, bld, 300, 1480 + 120 * (1 - q), a=q, anchor='b'); ground(cv, 60, 560, 1480)
    # bell shaking on roof
    bq = eb(pr(T, 1.3, .4)); sh = 8 * math.sin(T * 30) * cl(1 - ((T - 1.3) % 1.6) / .6)
    place(cv, ic2('bell', 90), 300, 735, s=bq, a=cl(bq), rot=sh)
    for i, (ic, t, x, y, r) in enumerate(N1):
        t0 = 1.4 + i * .5; s, a = pop(T, t0); fy = 10 * math.sin(T * 1.7 + i * 1.4)
        x2 = x + 14 * math.sin(T * 1.1 + i)
        place(cv, notif(ic, t), x2, y + fy, s=.55 + .45 * s, a=a, rot=r)
    X, F, Hc = 800, 1890, 1080
    xin = lerp(1400, X, eo(pr(T, .15, 1.2)))
    actor(cv, T, [(0, 'side', True), (1.3, 'p0'), (1.75, 'p4'), (4.0, 'p3')], xin, F, Hc)

# =============== SCENE 2: introducing ===============
def scene2(cv, T):
    t0 = B[1]
    corner_deco(cv, T); particles(cv, T, 14, eo(pr(T, t0, 1)))
    # buildings rising behind (right side)
    for i, (x, w, h, d) in enumerate(((620, 260, 640, .0), (860, 300, 820, .15), (1040, 220, 520, .3))):
        q = eo(pr(T, t0 + 3.4 + d, 1.0)); place(cv, with_alpha(res_building(w, h, 6 if h > 600 else 4, 3, i), .9), x, 1890 + 200 * (1 - q), a=q, anchor='b')
    # logo
    q = eo(pr(T, t0 + .2, .9)); lg = logo(900); place(cv, lg, W / 2, 330, s=.86 + .14 * q, a=q)
    sh = pr(T, t0 + 1.0, 1.0)
    if 0 < sh < 1: shine(cv, W / 2, 330, lg.width, lg.height, sh)
    gold_line(cv, 140, 940, 500, eio(pr(T, t0 + .5, .8)), 1, 3, GOLD)
    sub_head(cv, T, 'إدارة احترافية لأملاكك', 7.9, 590, 66, NAVY)
    gold_line(cv, W / 2 - 150, W / 2 + 150, 650, eo(pr(T, 8.2, .6)), 1, 5, COPPER)
    # notifications tidy up into a column with checks, then dissolve
    for i, (ic, t, x, y, r) in enumerate(N1):
        m = eio(pr(T, t0 + .1 + i * .06, .9)); tx, ty = 790, 800 + i * 122
        out = eio(pr(T, t0 + 3.0 + i * .08, .5))
        a = 1 - out
        place(cv, notif(ic, t), lerp(x, tx, m), lerp(y, ty, m) - 40 * out, s=lerp(1, .82, m), a=a, rot=r * (1 - m))
        c = eb(pr(T, t0 + 1.1 + i * .15, .4))
        if c > 0: place(cv, icon('check', 46), tx - 190, ty, s=c, a=cl(c) * a)
    a = eo(pr(T, t0 + .3, .6))
    actor(cv, T, [(0, 'p2'), (9.3, 'p6'), (11.0, 'p2')], 330, 1890, 1040, a=a, dx=-80 * (1 - a))

# =============== SCENE 3: tenants & rent ===============
STEPS3 = [('useradd', 'تسجيل المستأجر', 12.7), ('doc', 'عقد الإيجار', 13.9), ('chat', 'التواصل', 14.8),
          ('calendar', 'جدول الدفعات', 16.2), ('coin', 'متابعة التحصيل', 17.0)]
@lru_cache(None)
def tablet_base(w, h, title):
    im = Image.new('RGBA', (w * 2, h * 2), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle([0, 0, w * 2 - 1, h * 2 - 1], radius=56, fill=NAVY)
    d.rounded_rectangle([22, 22, w * 2 - 23, h * 2 - 23], radius=38, fill=IVORY)
    im = im.resize((w, h), Image.LANCZOS)
    d = ImageDraw.Draw(im); d.rounded_rectangle([11, 11, w - 12, 70], radius=18, fill=WHITE)
    t = txt(title, 32, NAVY, 'ExtraBold'); im.alpha_composite(t, (w - 30 - t.width, 40 - t.height // 2))
    im.alpha_composite(logo_mark_small(), (24, 18))
    return im
@lru_cache(None)
def logo_mark_small(): return R.logo_mark(40)

@lru_cache(None)
def step_row(ic, label, w):
    im = Image.new('RGBA', (w * 2, 160), (0, 0, 0, 0))
    ImageDraw.Draw(im).rounded_rectangle([0, 0, w * 2 - 1, 159], radius=30, fill=WHITE, outline=GREY, width=3)
    im = im.resize((w, 80), Image.LANCZOS); im.alpha_composite(circ_icon(ic, 58), (w - 70, 11))
    t = txt(label, 30, NAVY, 'Bold'); im.alpha_composite(t, (w - 80 - t.width, 40 - t.height // 2))
    return im

def tablet3(T):
    w, h = 440, 560; im = tablet_base(w, h, 'إدارة المستأجرين').copy()
    for i, (ic, lab, t1) in enumerate(STEPS3):
        q = eo(pr(T, t1, .35))
        if q <= 0: continue
        r = with_alpha(step_row(ic, lab, w - 50), q); im.alpha_composite(r, (25 + int(40 * (1 - q)), 92 + i * 90))
        c = eb(pr(T, t1 + .35, .35))
        if c > 0:
            ck = icon('check', 40).resize((max(1, int(40 * c)),) * 2); im.alpha_composite(ck, (int(55 - ck.width / 2), int(132 + i * 90 - ck.height / 2)))
    return shadowed(im, 22, (0, 16), .25)

@lru_cache(None)
def unit_building():
    w, h = 430, 640; S = 2
    im = Image.new('RGBA', (w * S, h * S), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rectangle([0, 50, w * S, h * S], fill=NAVY); d.rectangle([-10, 30, w * S + 10, 70], fill=COPPER)
    im = im.resize((w, h), Image.LANCZOS); return im
UNITS = [(c, r) for r in range(4) for c in range(3)]
def scene3(cv, T):
    t0 = B[2]
    corner_deco(cv, T); top_logo(cv, T, t0)
    headline(cv, T, 'إدارة المستأجرين', t0 + .2, y=270, size=86)
    sub_head(cv, T, 'تنظيم الإيجارات والتحصيل', 16.2, 385, 54)
    # building with rental units
    q = eo(pr(T, t0 + .1, .7)); bx, by = 270, 520
    b = unit_building(); bl = Image.new('RGBA', b.size); bl.alpha_composite(b); d = ImageDraw.Draw(bl)
    uw, uh = 122, 128
    order = [7, 2, 10, 4, 0, 9, 5, 11, 1, 6, 3, 8]
    for n, (c, r) in enumerate(UNITS):
        x0 = 24 + c * (uw + 13); y0 = 52 + r * (uh + 18)
        lit = T >= 12.8 + order.index(n) * .38
        d.rounded_rectangle([x0, y0, x0 + uw, y0 + uh], radius=10, fill=GOLD if lit else NAVY2)
        if lit:
            d.ellipse([x0 + uw / 2 - 18, y0 + 26, x0 + uw / 2 + 18, y0 + 62], fill=NAVY)
            d.pieslice([x0 + uw / 2 - 34, y0 + 72, x0 + uw / 2 + 34, y0 + 140], 180, 360, fill=NAVY)
            d.rectangle([x0, y0 + uh - 4, x0 + uw, y0 + uh], fill=GOLD)
    place(cv, shadowed(bl, 20, (0, 14), .2), bx, by + 320 + 80 * (1 - q), a=q)
    ground(cv, 30, 520, by + 640 + 80 * (1 - q) - 4)
    # tablet
    tq = eo(pr(T, t0 + .3, .6))
    place(cv, tablet3(T), 790, 700 + 8 * math.sin(T * 1.4) + 60 * (1 - tq), a=tq)
    # owner/tenant conversation bubbles
    cq = eb(pr(T, 14.8, .45))
    if cq > 0:
        place(cv, circ_icon('person', 150), 190, 1450, s=cq, a=cl(cq))
        place(cv, pill('أهلاً، كيف نخدمك؟', 34, WHITE, NAVY, GOLD), 380, 1300, s=.6 + .4 * eb(pr(T, 15.0, .4)), a=cl((T - 15.0) / .25))
        place(cv, pill('شكراً على المتابعة', 34, NAVY, IVORY, NAVY), 330, 1590, s=.6 + .4 * eb(pr(T, 15.6, .4)), a=cl((T - 15.6) / .25))
    # collection progress
    pq = eo(pr(T, 17.0, .3))
    if pq > 0:
        d = ImageDraw.Draw(cv); x0, x1, y = 70, 520, 1740; fill = eio(pr(T, 17.0, .9))
        place(cv, txt('متابعة التحصيل', 36, NAVY, 'Bold'), x1, y - 50, a=pq, anchor='r')
        d.rounded_rectangle([x0, y, x1, y + 22], radius=11, fill=GREY)
        if fill > .02: d.rounded_rectangle([x1 - (x1 - x0) * fill, y, x1, y + 22], radius=11, fill=COPPER)
    a = eo(pr(T, t0 + .3, .6))
    actor(cv, T, [(0, 'p3'), (17.1, 'p5')], 820, 1890, 860, a=a, dx=70 * (1 - a))

# =============== SCENE 4: maintenance ===============
ISO_C = (380, 1180)
def iso(u, v, z=0, s=1.0):
    return (ISO_C[0] + (u - v) * 250 * s, ISO_C[1] + (u + v) * 142 * s - z * s)
def iso_building(cv, T, t0, oy=0):
    d = ImageDraw.Draw(cv)
    sh = lambda pts: [(x, y + oy) for x, y in pts]
    plate = [iso(-1, -1), iso(1, -1), iso(1, 1), iso(-1, 1)]
    d.polygon(sh([(x, y + 22) for x, y in plate]), fill=GOLD)
    d.polygon(sh(plate), fill=WHITE, outline=GOLD)
    for i in range(-3, 4):
        u = i / 4; d.line(sh([iso(u, -1), iso(u, 1)]), fill=(232, 228, 216), width=2); d.line(sh([iso(-1, u), iso(1, u)]), fill=(232, 228, 216), width=2)
    g = eo(pr(T, t0 + .1, .9)); r = .55; hgt = 520 * g
    if hgt < 2: return
    u, v = 0, 0
    top = [iso(u - r, v - r, hgt), iso(u + r, v - r, hgt), iso(u + r, v + r, hgt), iso(u - r, v + r, hgt)]
    left = [iso(u - r, v + r, 0), iso(u + r, v + r, 0), iso(u + r, v + r, hgt), iso(u - r, v + r, hgt)]
    right = [iso(u + r, v - r, 0), iso(u + r, v + r, 0), iso(u + r, v + r, hgt), iso(u + r, v - r, hgt)]
    d.polygon(sh(left), fill=NAVY); d.polygon(sh(right), fill=NAVY2); d.polygon(sh(top), fill=GOLD)
    floors = int(hgt / 80)
    for f in range(floors):
        z0 = 30 + f * 80
        for j in range(3):
            a0 = -r + .12 + j * .34
            q = [iso(a0, v + r, z0), iso(a0 + .22, v + r, z0), iso(a0 + .22, v + r, z0 + 46), iso(a0, v + r, z0 + 46)]
            d.polygon(sh(q), fill=GOLD)
            q = [iso(u + r, a0, z0), iso(u + r, a0 + .22, z0), iso(u + r, a0 + .22, z0 + 46), iso(u + r, a0, z0 + 46)]
            d.polygon(sh(q), fill=(150, 142, 124))
    # roof AC units
    if g > .95:
        for (a0, b0) in ((-.3, -.3), (.15, -.25)):
            t_ = [iso(a0, b0, hgt + 24), iso(a0 + .18, b0, hgt + 24), iso(a0 + .18, b0 + .18, hgt + 24), iso(a0, b0 + .18, hgt + 24)]
            d.polygon(sh(t_), fill=IVORY, outline=NAVY)

MAINT = [('mag', 'فحص المبنى', 175, 690), ('ac', 'التكييف', 830, 620), ('drop', 'السباكة', 165, 1000), ('bolt', 'الكهرباء', 830, 860), ('wrench', 'عناية عامة', 470, 500)]
@lru_cache(None)
def mtag(ic, lab, done):
    w, h = 290, 96
    im = Image.new('RGBA', (w * 2, h * 2), (0, 0, 0, 0))
    ImageDraw.Draw(im).rounded_rectangle([0, 0, w * 2 - 1, h * 2 - 1], radius=48, fill=WHITE, outline=COPPER if done else GOLD, width=5)
    im = im.resize((w, h), Image.LANCZOS); im.alpha_composite(circ_icon(ic, 72), (w - 84, 12))
    t = txt(lab, 30, NAVY, 'Bold'); im.alpha_composite(t, (w - 92 - t.width, 18))
    st = txt('تم ✓' if False else ('مكتمل' if done else 'قيد المتابعة'), 22, COPPER if done else NAVY2, 'Bold'); im.alpha_composite(st, (w - 92 - st.width, 50))
    return shadowed(im, 14, (0, 8), .18)

def scene4(cv, T):
    t0 = B[3]
    corner_deco(cv, T); top_logo(cv, T, t0)
    headline(cv, T, 'متابعة الصيانة', t0 + .2, y=270, size=88)
    sub_head(cv, T, 'العناية بأصولك العقارية', 21.3, 385, 54)
    q = eo(pr(T, t0, .6)); oy = 80 * (1 - q)
    lay = Image.new('RGBA', (W, H), (0, 0, 0, 0)); iso_building(lay, T, t0, 0)
    lay = with_alpha(lay, q); cv.paste(lay, (0, int(oy)), lay)
    d = ImageDraw.Draw(cv)
    for i, (ic, lab, x, y) in enumerate(MAINT):
        t1 = t0 + .5 + i * .3; s, a = pop(T, t1); done_t = 20.9 + i * .22
        done = T >= done_t
        fy = 6 * math.sin(T * 1.6 + i)
        place(cv, mtag(ic, lab, done), x, y + fy, s=(.55 + .45 * s) * (1 + .06 * math.sin(math.pi * cl((T - done_t) / .3)) if done else 1), a=a)
        if done:
            c = eb(pr(T, done_t, .35)); place(cv, icon('check', 40), x - 150, y - 40 + fy, s=c, a=cl(c))
    # tablet with request status
    tq = eo(pr(T, t0 + .6, .5))
    place(cv, maint_card(T >= 21.3), 270, 1650 + 8 * math.sin(T * 1.3) + 50 * (1 - tq), a=tq)
    a = eo(pr(T, t0 + .3, .6))
    actor(cv, T, [(0, 'p4'), (21.4, 'p5'), (23.0, 'p0')], 840, 1890, 880, a=a, dx=70 * (1 - a))

@lru_cache(None)
def maint_card(done):
    w, h = 360, 250; im = tablet_base(w, h, 'طلب صيانة').copy()
    d = ImageDraw.Draw(im)
    t = txt('صيانة التكييف', 32, NAVY, 'Bold'); im.alpha_composite(t, (w - 30 - t.width, 92))
    im.alpha_composite(circ_icon('ac', 60), (30, 86))
    col = COPPER if done else NAVY2; lab = 'مكتمل' if done else 'قيد التنفيذ'
    d.rounded_rectangle([w - 190, 165, w - 30, 215], radius=25, fill=col)
    tt = txt(lab, 28, IVORY, 'Bold'); im.alpha_composite(tt, (int(w - 110 - tt.width / 2), 190 - tt.height // 2))
    if done: im.alpha_composite(icon('check', 50), (40, 165))
    return shadowed(im, 20, (0, 14), .22)

# =============== SCENE 5: dashboard & reports ===============
def dashboard(T, t0):
    w, h = 1000, 700; S = 1
    im = Image.new('RGBA', (w * 2, h * 2), (0, 0, 0, 0)); ImageDraw.Draw(im).rounded_rectangle([0, 0, w * 2 - 1, h * 2 - 1], radius=50, fill=WHITE, outline=GOLD, width=4)
    im = im.resize((w, h), Image.LANCZOS); d = ImageDraw.Draw(im)
    d.rounded_rectangle([14, 14, w - 14, 86], radius=20, fill=NAVY)
    t = txt('لوحة متابعة العقار', 36, IVORY, 'ExtraBold'); im.alpha_composite(t, (w - 40 - t.width, 50 - t.height // 2))
    im.alpha_composite(R.logo_mark(46), (34, 27))
    tiles = [(w - 30 - 460, 104, w - 30, 390, 'الإشغال'), (30, 104, 490, 390, 'الدخل الإيجاري'),
             (w - 30 - 460, 408, w - 30, 680, 'حالة الصيانة'), (30, 408, 490, 680, 'سجل المستأجرين')]
    for i, (x0, y0, x1, y1, lab) in enumerate(tiles):
        q = eo(pr(T, t0 + .3 + i * .25, .5))
        if q <= 0: continue
        d.rounded_rectangle([x0, y0, x1, y1], radius=22, fill=IVORY, outline=GREY, width=2)
        tl = with_alpha(txt(lab, 30, NAVY, 'Bold'), q); im.alpha_composite(tl, (x1 - 20 - tl.width, y0 + 12))
        g = eio(pr(T, t0 + .6 + i * .25, 1.2))
        if i == 0:  # donut
            cx, cy, r = (x0 + x1) // 2, y0 + 170, 92
            d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=GREY, width=26)
            if g > 0: d.arc([cx - r, cy - r, cx + r, cy + r], -90, -90 + 310 * g, fill=COPPER, width=26)
            im.alpha_composite(ic2('house', 70), (cx - 35, cy - 35))
        elif i == 1:  # line chart
            pts = [(x0 + 40 + j * 75, y1 - 50 - v) for j, v in enumerate((40, 70, 60, 110, 130, 170))]
            for j in range(4): d.line([x0 + 30, y1 - 50 - j * 50, x1 - 30, y1 - 50 - j * 50], fill=GREY, width=2)
            n = 1 + g * 5; seg = [pts[0]]
            for j in range(1, 6):
                if n >= j: seg.append(pts[j])
                else:
                    f = n - (j - 1); seg.append((lerp(pts[j - 1][0], pts[j][0], f), lerp(pts[j - 1][1], pts[j][1], f))); break
            if len(seg) > 1: d.line(seg, fill=NAVY, width=7, joint='curve')
            ex, ey = seg[-1]; d.ellipse([ex - 10, ey - 10, ex + 10, ey + 10], fill=COPPER)
        elif i == 2:  # maintenance status
            for j, (ic, lab2) in enumerate((('ac', 'التكييف'), ('drop', 'السباكة'), ('bolt', 'الكهرباء'))):
                yy = y0 + 70 + j * 66; im.alpha_composite(circ_icon(ic, 50), (x1 - 70, yy))
                tt = txt(lab2, 26, NAVY, 'Medium'); im.alpha_composite(tt, (x1 - 80 - tt.width, yy + 25 - tt.height // 2))
                bw = 200 * cl(g * 1.3 - j * .15)
                d.rounded_rectangle([x0 + 40, yy + 18, x0 + 240, yy + 32], radius=7, fill=GREY)
                if bw > 4: d.rounded_rectangle([x0 + 240 - bw, yy + 18, x0 + 240, yy + 32], radius=7, fill=COPPER if j != 1 else NAVY)
        else:  # tenant records
            for j in range(3):
                yy = y0 + 70 + j * 66
                if g * 3 > j:
                    d.rounded_rectangle([x0 + 20, yy, x1 - 20, yy + 54], radius=14, fill=WHITE, outline=GREY, width=2)
                    im.alpha_composite(circ_icon('person', 44), (x1 - 70, yy + 5))
                    d.rounded_rectangle([x1 - 230, yy + 14, x1 - 84, yy + 24], radius=5, fill=NAVY2)
                    d.rounded_rectangle([x1 - 190, yy + 32, x1 - 84, yy + 40], radius=4, fill=GREY)
                    im.alpha_composite(icon('check', 32), (x0 + 36, yy + 11))
    return shadowed(im, 24, (0, 16), .2)

def scene5(cv, T):
    t0 = B[4]
    corner_deco(cv, T); top_logo(cv, T, t0)
    for i, (lab, t1) in enumerate((('متابعة مستمرة', 24.0), ('تقارير واضحة', 25.3), ('راحة بال أكبر', 26.9))):
        s, a = pop(T, t1); on = (i == 2)
        place(cv, pill(lab, 40, NAVY if on else WHITE, IVORY if on else NAVY, NAVY), 860 - i * 320, 285, s=.6 + .4 * s, a=a)
    q = eo(pr(T, t0 + .1, .7))
    place(cv, dashboard(T, t0), W / 2, 705 + 8 * math.sin(T * 1.2) + 70 * (1 - q), a=q)
    # owner receives report
    oq = eb(pr(T, 26.6, .5))
    if oq > 0:
        place(cv, circ_icon('person', 170), 830, 1420, s=oq, a=cl(oq))
        place(cv, pill('المالك', 34, WHITE, NAVY, GOLD), 830, 1550, s=oq, a=cl(oq))
    fp = eio(pr(T, 27.0, 1.0))
    if 0 < fp:
        x = lerp(540, 830, fp); y = lerp(1100, 1290, fp) - 180 * math.sin(math.pi * fp)
        rp = glow(ic2('report', 110), GOLD, 14, .8)
        place(cv, rp, x, y, s=lerp(.6, 1.0, fp), a=cl(fp * 4), rot=10 * (1 - fp))
    if T > 28.0:
        c = eb(pr(T, 28.0, .4)); place(cv, icon('check', 56), 905, 1345, s=c, a=cl(c))
        place(cv, txt('تقرير واضح بين يديك', 34, NAVY, 'Bold'), 830, 1640, a=eo(pr(T, 28.1, .5)))
    a = eo(pr(T, t0 + .3, .6))
    actor(cv, T, [(0, 'p2'), (27.0, 'p3'), (28.4, 'p2')], 330, 1890, 850, a=a, dx=-70 * (1 - a))

# =============== SCENE 6: experience ===============
@lru_cache(None)
def skyline2():
    w, h = W, 700; im = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    rnd = random.Random(5); x = -30
    while x < w:
        bw = rnd.randint(150, 230); bh = rnd.randint(320, 660)
        b = res_building(bw, bh, max(3, bh // 110), 3, rnd.randint(0, 99))
        im.alpha_composite(with_alpha(b, .22), (x, h - bh)); x += bw + rnd.randint(8, 30)
    return im

def scene6(cv, T):
    t0 = B[5]
    corner_deco(cv, T); particles(cv, T, 20, eo(pr(T, t0, .8)), seed=8)
    z = 1 + .06 * eio(pr(T, t0, 4.5))
    q = eo(pr(T, t0, 1.0)); place(cv, skyline2(), W / 2, 1890 + 150 * (1 - q), s=z, a=q, anchor='b')
    ground(cv, 0, W, 1888)
    tg = 30.27
    q1 = eo(pr(T, tg - .1, .5)); place(cv, txt('خبرة تتجاوز', 66, NAVY, 'Bold'), W / 2, 250 + 30 * (1 - q1), a=q1)
    n = int(round(40 * eio(pr(T, tg + .2, 1.1)))); q2 = eb(pr(T, tg + .2, .6))
    if T > tg + .15: place(cv, txt(str(n), 250, COPPER, 'ExtraBold'), W / 2, 450, s=.7 + .3 * q2, a=cl(q2))
    q3 = eo(pr(T, tg + .8, .5)); place(cv, txt('عاماً', 72, NAVY, 'ExtraBold'), W / 2, 640 + 30 * (1 - q3), a=q3)
    # golden timeline (right -> left)
    tp = eio(pr(T, tg + .3, 1.6)); d = ImageDraw.Draw(cv); y = 760
    gold_line(cv, 90, 990, y, tp, 1, 4, GOLD)
    for i in range(5):
        x = 990 - i * 225; lit = tp * 4 >= i - .01
        if lit:
            c = eb(pr(T, tg + .3 + i * .4, .35)); place(cv, icon('diamondc' if i == 4 else 'diamond', 34 if i == 4 else 24), x, y, s=c, a=cl(c))
    a = eo(pr(T, t0 + .2, .6))
    hc = int(1000 * z)
    actor(cv, T, [(0, 'cross'), (32.7, 'p6')], W / 2, 1890, hc, a=a)

# =============== SCENE 7: final brand ===============
def scene7(cv, T):
    t0 = B[6]
    corner_deco(cv, T); particles(cv, T, 22, eo(pr(T, t0, 1)), seed=11)
    bq = eo(pr(T, t0, 1.2)); place(cv, with_alpha(res_building(520, 900, 8, 3, 3), .12), 760, 1890, a=bq, anchor='b')
    q = eo(pr(T, t0 + .3, .9)); lg = logo(880); place(cv, lg, W / 2, 300, s=.88 + .12 * q, a=q)
    for st in (t0 + 1.1, 39.6):
        sh = pr(T, st, 1.0)
        if 0 < sh < 1: shine(cv, W / 2, 300, lg.width, lg.height, sh)
    gold_line(cv, 140, 940, 470, eio(pr(T, t0 + .6, .8)), 1, 3, GOLD)
    full = txt('عقارك أمانة... وإدارته خبرتنا', 64, NAVY, 'ExtraBold')
    p1 = txt('عقارك أمانة...', 64, NAVY, 'ExtraBold'); p2 = txt('وإدارته خبرتنا', 64, COPPER, 'ExtraBold')
    right = W / 2 + full.width / 2; y = 570
    a1 = eo(pr(T, 36.95, .5)); a2 = eo(pr(T, 38.3, .5))
    place(cv, p1, right, y + 25 * (1 - a1), a=a1, anchor='r')
    place(cv, p2, right - p1.width + 18, y + 25 * (1 - a2), a=a2, anchor='r')
    rows = [('phone', '0599818181', 35.4), ('phone', '0535422918', 35.7), ('globe', 'www.alshalaan.sa', 36.0), ('pin', 'الرياض – جنوب الرياض', 36.3)]
    for i, (ic, s_, t1) in enumerate(rows):
        a = eo(pr(T, t1, .5)); place(cv, contact_row(ic, s_), 40 - 50 * (1 - a), 860 + i * 165, a=a, anchor='l')
    a = eo(pr(T, t0 + .4, .7))
    actor(cv, T, [(0, 'p7'), (36.95, 'p6'), (39.0, 'p1')], 860, 1890, 1000, a=a, dx=70 * (1 - a))

# =============== compositor ===============
SCENES = [scene1, scene2, scene3, scene4, scene5, scene6, scene7]
TW = .32
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
            Image.frombytes('RGB', (W, H), frame(int(t * FPS))).save(f'pm/still_{t:05.2f}.jpg', quality=88)
        sys.exit()
    N = int(DUR * FPS)
    ff = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                           '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', 'pm/video_silent.mp4'], stdin=subprocess.PIPE)
    with Pool(4) as pool:
        for k, b in enumerate(pool.imap(frame, range(N), chunksize=6)):
            ff.stdin.write(b)
            if k % 300 == 0: print('frame', k, flush=True)
    ff.stdin.close(); ff.wait(); print('done')
