import numpy as np, subprocess, sys, json, math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H, FPS, DUR = 1080, 1920, 30, 43.0
FD = '/tmp/claude-0/-home-user-Ammar/fa088520-1eee-5cc9-9f62-9b9b7762ce22/scratchpad/fonts/p_expo-google-fonts-tajawal-0.4.1/'
F = lambda w, s: ImageFont.truetype(FD + {'xb': '800ExtraBold/Tajawal_800ExtraBold.ttf', 'b': '700Bold/Tajawal_700Bold.ttf',
                                          'm': '500Medium/Tajawal_500Medium.ttf', 'r': '400Regular/Tajawal_400Regular.ttf',
                                          'l': '300Light/Tajawal_300Light.ttf'}[w], s, layout_engine=ImageFont.Layout.RAQM)
LOGO = Image.open('/root/.claude/uploads/fa088520-1eee-5cc9-9f62-9b9b7762ce22/8f316024-image.webp').convert('RGB')

NAVY = (13, 30, 56); NAVY2 = (8, 18, 36); GOLD = (201, 168, 106); GOLD_L = (236, 214, 160); COPPER = (190, 120, 80)
WHITE = (255, 255, 255); BEIGE = (240, 230, 210)

def ease(x): x = min(1, max(0, x)); return 1 - (1 - x) ** 3
def ar(d, xy, txt, font, fill, anchor='ra'):
    d.text(xy, txt, font=font, fill=fill, anchor=anchor, direction='rtl', language='ar')

def gold_text(txt, font, rtl=True, pad=20):
    kw = dict(direction='rtl', language='ar') if rtl else {}
    bb = font.getbbox(txt, **kw)
    w, h = bb[2] - bb[0] + pad * 2, bb[3] - bb[1] + pad * 2
    mask = Image.new('L', (w, h), 0)
    ImageDraw.Draw(mask).text((pad - bb[0], pad - bb[1]), txt, font=font, fill=255, **kw)
    y = np.linspace(0, 1, h)[:, None]
    g = np.array(GOLD_L)[None, None, :] * (1 - y[..., None]) * 1.0
    stops = [(0, (245, 228, 182)), (0.45, (214, 180, 112)), (0.55, (184, 146, 79)), (1, (232, 205, 142))]
    grad = np.zeros((h, 1, 3))
    for i in range(3):
        grad[:, 0, i] = np.interp(np.linspace(0, 1, h), [s[0] for s in stops], [s[1][i] for s in stops])
    rgb = np.repeat(grad, w, 1).astype(np.uint8)
    img = Image.fromarray(rgb).convert('RGBA'); img.putalpha(mask)
    sh = Image.new('RGBA', (w, h), (0, 0, 0, 0)); sh.putalpha(mask.filter(ImageFilter.GaussianBlur(8)).point(lambda v: int(v * 0.65)))
    out = Image.new('RGBA', (w, h), (0, 0, 0, 0)); out.alpha_composite(sh, (0, 4)); out.alpha_composite(img)
    return out, mask

def shimmer(img, mask, p):
    """moving light band across gold text, p in 0..1"""
    w, h = img.size
    xs = np.arange(w)[None, :] + np.arange(h)[:, None] * 0.35
    c = -0.2 * w + p * 1.6 * w
    band = np.clip(1 - np.abs(xs - c) / (w * 0.08), 0, 1) * (np.array(mask) / 255.0)
    a = np.array(img).astype(float)
    a[..., :3] = a[..., :3] + (255 - a[..., :3]) * band[..., None] * 0.8
    return Image.fromarray(a.astype(np.uint8))

# ---------------- icons (gold line) ----------------
def icon(kind, s=64, col=GOLD_L, lw=4):
    im = Image.new('RGBA', (s * 4, s * 4), (0, 0, 0, 0)); d = ImageDraw.Draw(im); S = s * 4; L = lw * 4
    def ln(pts): d.line([(x * S, y * S) for x, y in pts], fill=col, width=L, joint='curve')
    def rc(a, b, c, e, r=0.05): d.rounded_rectangle([a * S, b * S, c * S, e * S], r * S, outline=col, width=L)
    def el(a, b, c, e): d.ellipse([a * S, b * S, c * S, e * S], outline=col, width=L)
    if kind == 'car':
        ln([(.12, .62), (.2, .4), (.32, .3), (.68, .3), (.8, .4), (.88, .62)]); rc(.08, .5, .92, .72, .06)
        el(.2, .66, .36, .82); el(.64, .66, .8, .82)
    elif kind == 'garage':
        ln([(.08, .45), (.5, .15), (.92, .45)]); ln([(.16, .4), (.16, .88), (.84, .88), (.84, .4)])
        rc(.3, .55, .7, .88, .01); ln([(.3, .66), (.7, .66)]); ln([(.3, .77), (.7, .77)])
    elif kind == 'ruler':
        ln([(.1, .5), (.9, .5)]); ln([(.22, .38), (.1, .5), (.22, .62)]); ln([(.78, .38), (.9, .5), (.78, .62)])
        ln([(.1, .25), (.1, .75)]); ln([(.9, .25), (.9, .75)])
    elif kind == 'sofa':
        rc(.2, .3, .8, .58, .06); rc(.08, .45, .92, .72, .06); ln([(.16, .72), (.16, .84)]); ln([(.84, .72), (.84, .84)])
    elif kind == 'annex':
        rc(.1, .3, .55, .88, .02); rc(.55, .5, .9, .88, .02); ln([(.25, .88), (.25, .65), (.4, .65), (.4, .88)]); ln([(.65, .62), (.8, .62)])
    elif kind == 'kitchen':
        ln([(.15, .45), (.85, .45)]); rc(.2, .45, .8, .8, .08); ln([(.08, .5), (.2, .5)]); ln([(.8, .5), (.92, .5)])
        ln([(.38, .2), (.42, .32)]); ln([(.55, .18), (.58, .32)])
    elif kind == 'bed':
        ln([(.08, .3), (.08, .82)]); ln([(.08, .62), (.92, .62), (.92, .82)]); rc(.14, .42, .38, .58, .06)
        ln([(.4, .5), (.88, .5), (.92, .62)])
    elif kind == 'bath':
        ln([(.08, .5), (.92, .5)]); d.arc([.14 * S, .25 * S, .86 * S, .85 * S], 0, 180, fill=col, width=L)
        ln([(.22, .5), (.22, .18), (.36, .18)]); ln([(.3, .85), (.26, .92)]); ln([(.7, .85), (.74, .92)])
    elif kind == 'dining':
        el(.28, .3, .72, .74); ln([(.12, .2), (.12, .8)]); ln([(.06, .2), (.06, .38), (.18, .38), (.18, .2)]); ln([(.88, .2), (.88, .8)])
        d.pieslice([.82 * S, .18 * S, .96 * S, .5 * S], 270, 90, outline=col, width=L)
    elif kind == 'rooms':
        rc(.12, .12, .88, .88, .03); ln([(.5, .12), (.5, .88)]); ln([(.12, .5), (.88, .5)])
    elif kind == 'roof':
        ln([(.08, .5), (.5, .2), (.92, .5)]); rc(.2, .5, .8, .88, .01); rc(.6, .1, .76, .32, .02)
    elif kind == 'tank':
        el(.25, .14, .75, .3); ln([(.25, .22), (.25, .78)]); ln([(.75, .22), (.75, .78)]); d.arc([.25 * S, .7 * S, .75 * S, .86 * S], 0, 180, fill=col, width=L)
        ln([(.3, .9), (.3, .96)]); ln([(.7, .9), (.7, .96)])
    elif kind == 'stairs':
        ln([(.1, .88), (.1, .7), (.3, .7), (.3, .52), (.5, .52), (.5, .34), (.7, .34), (.7, .16), (.9, .16)])
    elif kind == 'shield':
        ln([(.5, .08), (.86, .22), (.82, .58), (.5, .92), (.18, .58), (.14, .22), (.5, .08)]); ln([(.34, .5), (.46, .62), (.68, .38)])
    elif kind == 'phone':
        rc(.3, .08, .7, .92, .1); ln([(.44, .8), (.56, .8)])
    elif kind == 'web':
        el(.1, .1, .9, .9); el(.32, .1, .68, .9); ln([(.1, .5), (.9, .5)]); ln([(.16, .3), (.84, .3)]); ln([(.16, .7), (.84, .7)])
    elif kind == 'layout':
        rc(.1, .1, .9, .9, .02); ln([(.45, .1), (.45, .6)]); ln([(.45, .6), (.9, .6)]); ln([(.1, .4), (.3, .4)])
    return im.resize((s, s), Image.LANCZOS)

# ---------------- card ----------------
CW = 900
def card(title, sub=None, ic=None):
    ft = F('b', 50); fs = F('m', 36)
    h = 128 if not sub else 176
    im = Image.new('RGBA', (CW + 40, h + 40), (0, 0, 0, 0))
    sh = Image.new('RGBA', im.size, (0, 0, 0, 0)); ImageDraw.Draw(sh).rounded_rectangle([20, 26, CW + 20, h + 26], 22, fill=(0, 0, 0, 120))
    im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(12)))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([20, 20, CW + 20, h + 20], 22, fill=NAVY + (205,), outline=GOLD + (230,), width=2)
    d.rectangle([CW + 20 - 8, 40, CW + 20 - 2, h], fill=GOLD + (255,))  # gold accent bar (right, RTL start)
    xr = CW + 20 - 34
    if ic:
        ii = icon(ic, 66); cx = xr - 40
        d.ellipse([cx - 46, 20 + h / 2 - 46, cx + 46, 20 + h / 2 + 46], outline=GOLD + (140,), width=2)
        im.alpha_composite(ii, (int(cx - 33), int(20 + h / 2 - 33))); xr = cx - 72
    if sub:
        ar(d, (xr, 20 + 38), title, ft, WHITE); ar(d, (xr, 20 + 104), sub, fs, GOLD_L)
    else:
        ar(d, (xr, 20 + h / 2), title, ft, WHITE, 'rm')
    return im

def header(txt, sub=None, size=74):
    g, m = gold_text(txt, F('xb', size))
    w = max(g.size[0], 600); hh = g.size[1] + (70 if sub else 0) + 30
    im = Image.new('RGBA', (W, hh), (0, 0, 0, 0))
    bd = Image.new('RGBA', (W, hh), (0, 0, 0, 0)); bw = g.size[0] / 2 + 70
    ImageDraw.Draw(bd).rounded_rectangle([W / 2 - bw, 8, W / 2 + bw, hh - 14], 40, fill=NAVY2 + (165,))
    im.alpha_composite(bd.filter(ImageFilter.GaussianBlur(22)))
    d = ImageDraw.Draw(im)
    yl = g.size[1] + 4
    if sub:
        ar(d, (W // 2, yl + 30), sub, F('m', 40), WHITE, 'mm')
    return im, g, m

# ---------------- timeline ----------------
EV = []  # (t_in, t_out, kind, payload)
def C(t, t2, slot, title, sub=None, ic=None): EV.append(dict(t=t, t2=t2, kind='card', slot=slot, img=card(title, sub, ic)))
def Hd(t, t2, txt, sub=None, y=1010, size=74): EV.append(dict(t=t, t2=t2, kind='head', y=y, img=header(txt, sub, size)))

CARD_Y0 = 1180; CARD_STEP = 150
# Scene 2 (VO: design) chips
EV.append(dict(t=4.75, t2=8.95, kind='chips'))
# Scene courtyard 9.06-15.54
Hd(9.15, 15.45, 'الحوش والمواقف')
C(9.35, 15.45, 0, 'حوش واسع يتسع لـ 4 إلى 5 سيارات', ic='car')
C(11.9, 15.45, 1, 'كراج خاص ومظلة سيارات', ic='garage')
C(13.6, 15.45, 2, 'ارتداد أمامي 9 أمتار', ic='ruler')
# annexes 15.64-22.03
Hd(15.6, 22.0, 'الملاحق والمرافق المستقلة', size=66)
C(15.75, 22.0, 0, 'مجلس رجال مستقل', 'بدورة مياه خاصة', 'sofa')
C(17.25, 22.0, 1, 'ملحق نسائي وملحق رجالي', ic='annex')
C(18.9, 22.0, 2, 'مطبخ · مخزن · دورة مياه', ic='kitchen')
C(20.3, 22.0, 3, 'ارتداد خارجي 7م · داخلي 4م', ic='ruler')
# dining & extra 22.13-24.22
Hd(22.1, 24.35, 'المرافق الإضافية', 'توزيع مدروس يحقق الخصوصية والراحة', size=70)
C(22.25, 24.35, 0, 'صالة طعام مستقلة', ic='dining')
C(23.0, 24.35, 1, 'غرفتان إضافيتان', ic='rooms')
C(23.55, 24.35, 2, 'دورة مياه', ic='bath')
# first floor 24.32-30.5
Hd(24.4, 30.55, 'الدور الأول | 6 غرف نوم', size=80)
C(24.9, 30.55, 0, 'جناحان رئيسيان 7.5 × 5م', 'لكل جناح دورة مياه خاصة', 'bed')
C(26.5, 30.55, 1, 'غرفة نوم 6 × 4م', ic='bed')
C(27.5, 30.55, 2, 'غرفة نوم 7 × 4م', ic='bed')
C(28.5, 30.55, 3, 'غرفتان 6 × 4م لكل غرفة', 'بينهما دورة مياه مشتركة', 'bed')
# roof 30.6-32.48
Hd(30.6, 32.95, 'السطح', 'مساحة إضافية للاستخدام', size=84)
C(30.75, 32.95, 0, 'غرفة إضافية 6 × 4م', ic='roof')
C(31.2, 32.95, 1, 'دورة مياه 2 × 2م', ic='bath')
C(31.65, 32.95, 2, 'خزان مياه علوي', ic='tank')
# privacy 32.58-36.87
EV.append(dict(t=33.0, t2=36.95, kind='privacy'))
EV.append(dict(t=37.1, t2=39.05, kind='price'))
EV.append(dict(t=38.8, t2=43.1, kind='end'))
CHIMES = [(0.35, 86), (9.15, 81), (15.6, 83), (22.1, 81), (24.4, 86), (30.6, 83), (33.0, 86), (39.1, 88)]
json.dump(CHIMES, open('build/chimes.json', 'w')); json.dump(37.12, open('build/price_t.json', 'w'))

# prerender assets
T1, T1m = gold_text('فيلا فاخرة للبيع', F('xb', 132))
CHIP_TXT = ['رحابة', 'خصوصية', 'تعدد المرافق']
_a, _am = gold_text('خصوصية تامة..', F('xb', 92)); _b, _bm = gold_text('ومرونة في الاستثمار', F('xb', 76))
PV_T = Image.new('RGBA', (max(_a.size[0], _b.size[0]), _a.size[1] + _b.size[1] - 20), (0, 0, 0, 0)); PV_M = Image.new('L', PV_T.size, 0)
for _i, _m, _y in ((_a, _am, 0), (_b, _bm, _a.size[1] - 20)):
    _x = (PV_T.size[0] - _i.size[0]) // 2; PV_T.alpha_composite(_i, (_x, _y)); PV_M.paste(_m, (_x, _y))
PR_T, PR_M = gold_text('2,000,000', F('xb', 190), rtl=False)
def grad_v(top_a, bot_a):
    a = np.zeros((H, W), np.float32); y = np.arange(H)
    a += np.clip(1 - y / 520, 0, 1)[:, None] ** 1.6 * top_a
    a += np.clip((y - 880) / (H - 880), 0, 1)[:, None] ** 1.3 * bot_a
    img = np.zeros((H, W, 4), np.uint8); img[..., 0], img[..., 1], img[..., 2] = NAVY2
    img[..., 3] = np.clip(a * 255, 0, 255).astype(np.uint8); return Image.fromarray(img)
SHADE = grad_v(0.55, 0.88)
SHADE_LIGHT = grad_v(0.45, 0.35)

def end_bg():
    y, x = np.mgrid[0:H, 0:W].astype(np.float32)
    r = np.sqrt(((x - W / 2) / W) ** 2 + ((y - 760) / H) ** 2)
    k = np.clip(1 - r * 1.9, 0, 1) ** 1.5
    base = np.array(NAVY2, np.float32); hi = np.array((30, 56, 96), np.float32)
    img = base[None, None] * (1 - k[..., None]) + hi[None, None] * k[..., None]
    return Image.fromarray(img.astype(np.uint8)).convert('RGBA')
END_BG = end_bg()
LW = 860; LOGO_S = LOGO.resize((LW, int(LOGO.size[1] * LW / LOGO.size[0])), Image.LANCZOS)
def logo_card():
    pad = 36; w, h = LOGO_S.size[0] + pad * 2, LOGO_S.size[1] + pad * 2
    im = Image.new('RGBA', (w + 60, h + 60), (0, 0, 0, 0))
    sh = Image.new('RGBA', im.size, (0, 0, 0, 0)); ImageDraw.Draw(sh).rounded_rectangle([30, 40, w + 30, h + 40], 28, fill=(0, 0, 0, 150))
    im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(18)))
    d = ImageDraw.Draw(im); d.rounded_rectangle([30, 30, w + 30, h + 30], 28, fill=(255, 255, 255, 255))
    im.paste(LOGO_S, (30 + pad, 30 + pad))
    d.rounded_rectangle([30, 30, w + 30, h + 30], 28, outline=GOLD + (255,), width=3)
    return im
LOGO_C = logo_card()
BADGE = LOGO.resize((300, int(LOGO.size[1] * 300 / LOGO.size[0])), Image.LANCZOS)
def badge():
    im = Image.new('RGBA', (BADGE.size[0] + 28, BADGE.size[1] + 20), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle([0, 0, im.size[0] - 1, im.size[1] - 1], 14, fill=(255, 255, 255, 255), outline=GOLD + (255,), width=2)
    im.paste(BADGE, (14, 10)); return im
BADGE_C = badge()

def with_alpha(img, a):
    if a >= 0.999: return img
    im = img.copy(); al = im.getchannel('A').point(lambda v: int(v * a)); im.putalpha(al); return im

def gold_line(d, x0, x1, y, p, col=GOLD, w=3):
    """draw from center outward, progress p"""
    cx = (x0 + x1) / 2; hw = (x1 - x0) / 2 * ease(p)
    if hw > 1: d.line([(cx - hw, y), (cx + hw, y)], fill=col + (255,), width=w)

def frame_overlay(t):
    ov = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
    in_cards = any(e['kind'] in ('card', 'head') and e['t'] - 0.3 <= t <= e['t2'] + 0.3 for e in EV)
    if t < 38.9:
        ov.alpha_composite(SHADE if (in_cards or t < 4.6 or 32.8 < t) else SHADE_LIGHT)
    # brand badge (top) during body
    if 4.7 < t < 38.8:
        a = min(ease((t - 4.7) / 0.6), ease((38.8 - t) / 0.4))
        ov.alpha_composite(with_alpha(BADGE_C, a), ((W - BADGE_C.size[0]) // 2, 96))
    # --- scene 1 title
    if t < 4.65:
        a_in = ease((t - 0.3) / 0.8); a_out = ease((4.6 - t) / 0.35); a = min(a_in, a_out)
        if a > 0:
            g = shimmer(T1, T1m, (t - 0.9) / 1.6) if 0.9 < t < 2.6 else T1
            y = 1240 + int((1 - ease((t - 0.3) / 1.0)) * 40)
            ov.alpha_composite(with_alpha(g, a), ((W - g.size[0]) // 2, y))
            d.line([(W / 2 - 330 * ease((t - 0.5) / 0.9), y - 20), (W / 2 + 330 * ease((t - 0.5) / 0.9), y - 20)], fill=GOLD + (int(255 * a),), width=3)
            ty = y + T1.size[1] + 55
            a2 = min(ease((t - 1.6) / 0.6), a_out)
            if a2 > 0:
                sub = Image.new('RGBA', (W, 120), (0, 0, 0, 0)); sd = ImageDraw.Draw(sub)
                ar(sd, (W // 2, 60), 'مساحة 750 متر مربع', F('b', 64), WHITE, 'mm')
                tw = sd.textlength('مساحة 750 متر مربع', font=F('b', 64), direction='rtl', language='ar')
                sd.line([(W / 2 - tw / 2 - 140, 62), (W / 2 - tw / 2 - 30, 62)], fill=GOLD + (255,), width=3)
                sd.line([(W / 2 + tw / 2 + 30, 62), (W / 2 + tw / 2 + 140, 62)], fill=GOLD + (255,), width=3)
                ov.alpha_composite(with_alpha(sub, a2), (0, ty - 60 + int((1 - ease((t - 1.6) / 0.6)) * 25)))
    for e in EV:
        if not (e['t'] - 0.01 <= t <= e['t2'] + 0.01): continue
        a = min(ease((t - e['t']) / 0.45), ease((e['t2'] - t) / 0.3))
        k = e['kind']
        if k == 'card':
            p = ease((t - e['t']) / 0.5)
            x = (W - e['img'].size[0]) // 2 + int((1 - p) * 120)
            y = CARD_Y0 + e['slot'] * CARD_STEP + (24 if e['slot'] and any(x_['slot'] < e['slot'] and x_['t'] < e['t'] and x_['t2'] == e['t2'] and x_['img'].size[1] > 200 for x_ in EV if x_['kind'] == 'card') else 0)
            ov.alpha_composite(with_alpha(e['img'], a), (x, y))
        elif k == 'head':
            img, g, m = e['img']
            img = img.copy(); gg = shimmer(g, m, (t - e['t']) / 1.3) if t - e['t'] < 1.3 else g
            img.alpha_composite(gg, ((W - g.size[0]) // 2, 0))
            y = e['y'] + int((1 - ease((t - e['t']) / 0.6)) * 30)
            ov.alpha_composite(with_alpha(img, a), (0, y))
            gold_line(d, W / 2 - 260, W / 2 + 260, y - 14, (t - e['t']) / 0.7)
        elif k == 'chips':
            ft = F('b', 54); y = 1420
            for i, tx in enumerate(CHIP_TXT):
                ti = e['t'] + i * 0.55
                ai = min(ease((t - ti) / 0.45), ease((e['t2'] - t) / 0.3))
                if ai <= 0: continue
                yy = y + i * 120 + int((1 - ease((t - ti) / 0.5)) * 30)
                tw = d.textlength(tx, font=ft, direction='rtl', language='ar')
                lay = Image.new('RGBA', (W, 110), (0, 0, 0, 0)); ld = ImageDraw.Draw(lay)
                ld.rounded_rectangle([W / 2 - tw / 2 - 60, 8, W / 2 + tw / 2 + 60, 100], 46, fill=NAVY + (190,), outline=GOLD + (230,), width=2)
                ar(ld, (W // 2, 56), tx, ft, WHITE, 'mm')
                ov.alpha_composite(with_alpha(lay, ai), (0, yy))
            ah = min(ease((t - e['t']) / 0.5), ease((e['t2'] - t) / 0.3))
            hh = Image.new('RGBA', (W, 120), (0, 0, 0, 0)); ar(ImageDraw.Draw(hh), (W // 2, 60), 'تصميم يجمع', F('m', 50), GOLD_L, 'mm')
            ov.alpha_composite(with_alpha(hh, ah), (0, 1280))
        elif k == 'privacy':
            g = shimmer(PV_T, PV_M, (t - e['t']) / 1.4) if t - e['t'] < 1.4 else PV_T
            y = 1020 + int((1 - ease((t - e['t']) / 0.7)) * 35)
            ov.alpha_composite(with_alpha(icon('shield', 92), a), (W // 2 - 46, y - 135))
            ov.alpha_composite(with_alpha(g, a), ((W - g.size[0]) // 2, y))
            gold_line(d, W / 2 - 300, W / 2 + 300, y + g.size[1] + 18, (t - e['t'] - 0.3) / 0.8)
            a2 = min(ease((t - e['t'] - 0.7) / 0.5), ease((e['t2'] - t) / 0.3))
            if a2 > 0:
                lay = Image.new('RGBA', (W, 260), (0, 0, 0, 0)); ld = ImageDraw.Draw(lay)
                ld.rounded_rectangle([90, 10, W - 90, 240], 24, fill=NAVY + (200,), outline=GOLD + (200,), width=2)
                lay.alpha_composite(icon('stairs', 70), (W - 90 - 100, 90))
                ar(ld, (W - 90 - 130, 70), 'درج منفصل عن الصالة', F('b', 52), WHITE, 'rm')
                ar(ld, (W - 90 - 130, 140), 'مرونة أكبر في الاستخدام', F('m', 40), GOLD_L, 'rm')
                ar(ld, (W - 90 - 130, 192), 'والاستفادة الاستثمارية', F('m', 40), GOLD_L, 'rm')
                ov.alpha_composite(with_alpha(lay, a2), (0, y + g.size[1] + 50))
        elif k == 'price':
            dim = Image.new('RGBA', (W, H), NAVY2 + (int(150 * a),)); ov.alpha_composite(dim)
            pin = ease((t - e['t']) / 0.5)
            lay = Image.new('RGBA', (W, 120), (0, 0, 0, 0)); ar(ImageDraw.Draw(lay), (W // 2, 60), 'سعر البيع', F('b', 64), WHITE, 'mm')
            ov.alpha_composite(with_alpha(lay, a), (0, 700))
            sc = 0.86 + 0.14 * pin
            g = shimmer(PR_T, PR_M, (t - e['t'] - 0.3) / 1.2) if 0.3 < t - e['t'] < 1.5 else PR_T
            g = g.resize((int(g.size[0] * sc), int(g.size[1] * sc)), Image.LANCZOS)
            ov.alpha_composite(with_alpha(g, a), ((W - g.size[0]) // 2, 860 - g.size[1] // 2 + 120))
            gold_line(d, W / 2 - 380, W / 2 + 380, 840, (t - e['t']) / 0.6, w=3)
            gold_line(d, W / 2 - 380, W / 2 + 380, 1170, (t - e['t']) / 0.6, w=3)
            lay = Image.new('RGBA', (W, 120), (0, 0, 0, 0)); ar(ImageDraw.Draw(lay), (W // 2, 60), 'ريال سعودي', F('b', 72), GOLD_L, 'mm')
            ov.alpha_composite(with_alpha(lay, min(a, ease((t - e['t'] - 0.25) / 0.45))), (0, 1210))
        elif k == 'end':
            ae = ease((t - e['t']) / 0.2)
            ov.alpha_composite(with_alpha(END_BG, ae))
            te = t - 39.0
            # frame lines
            fl = ease(te / 0.9)
            for yy in (300, 1620):
                gold_line(d, 120, W - 120, yy, te / 0.9)
            for xx in (120, W - 120):
                h2 = 660 * fl
                if h2 > 1: d.line([(xx, 960 - h2), (xx, 960 + h2)], fill=GOLD + (int(120 * ae),), width=2)
            al = ease((te + 0.1) / 0.7); sc = 0.92 + 0.08 * al
            lc = LOGO_C.resize((int(LOGO_C.size[0] * sc), int(LOGO_C.size[1] * sc)), Image.LANCZOS)
            ov.alpha_composite(with_alpha(lc, al), ((W - lc.size[0]) // 2, 660 - lc.size[1] // 2))
            # price reminder
            ap = ease((te - 0.35) / 0.5)
            if ap > 0:
                lay = Image.new('RGBA', (W, 110), (0, 0, 0, 0)); ld = ImageDraw.Draw(lay)
                ar(ld, (W // 2, 55), 'سعر البيع: 2,000,000 ريال سعودي', F('b', 52), GOLD_L, 'mm')
                ov.alpha_composite(with_alpha(lay, ap), (0, 920))
            ac = ease((te - 0.7) / 0.5)
            if ac > 0:
                lay = Image.new('RGBA', (W, 600), (0, 0, 0, 0)); ld = ImageDraw.Draw(lay)
                ar(ld, (W // 2, 40), 'للتواصل والاستفسار', F('m', 46), WHITE, 'mm')
                ld.line([(W / 2 - 150, 88), (W / 2 + 150, 88)], fill=GOLD + (255,), width=2)
                fn = F('xb', 70)
                for i, num in enumerate(['0599818181', '0535422918']):
                    yy = 165 + i * 110; tw = ld.textlength(num, font=fn)
                    ld.text((W / 2 + 34, yy), num, font=fn, fill=WHITE, anchor='mm')
                    lay.alpha_composite(icon('phone', 54), (int(W / 2 + 34 - tw / 2 - 80), yy - 27))
                fw = F('b', 50); tw = ld.textlength('www.alshalaan.sa', font=fw)
                ld.text((W / 2 + 30, 420), 'www.alshalaan.sa', font=fw, fill=GOLD_L, anchor='mm')
                lay.alpha_composite(icon('web', 50), (int(W / 2 + 30 - tw / 2 - 74), 395))
                ov.alpha_composite(with_alpha(lay, ac), (0, 1030 + int((1 - ac) * 30)))
    return ov

if __name__ == '__main__':
    if sys.argv[1] == 'still':
        for ts in sys.argv[2:]:
            t = float(ts)
            raw = subprocess.run(['ffmpeg', '-v', 'error', '-ss', str(min(t, 38.95)), '-i', 'build/cut.mp4', '-frames:v', '1', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
            bg = Image.frombytes('RGB', (W, H), raw).convert('RGBA'); bg.alpha_composite(frame_overlay(t))
            bg.convert('RGB').resize((540, 960)).save(f'build/still_{ts}.jpg', quality=88)
    elif sys.argv[1] == 'render':
        dec = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', 'build/cut.mp4', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
        enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', '30', '-i', '-',
                                '-c:v', 'libx264', '-preset', 'slow', '-crf', '15', '-pix_fmt', 'yuv420p', 'build/video_gfx.mp4'], stdin=subprocess.PIPE)
        last = None
        for i in range(int(DUR * FPS)):
            t = i / FPS
            raw = dec.stdout.read(W * H * 3) if t < 39.0 else b''
            if len(raw) == W * H * 3: last = raw
            bg = Image.frombytes('RGB', (W, H), last).convert('RGBA'); bg.alpha_composite(frame_overlay(t))
            enc.stdin.write(bg.convert('RGB').tobytes())
            if i % 150 == 0: print('frame', i, flush=True)
        enc.stdin.close(); enc.wait(); dec.wait()
