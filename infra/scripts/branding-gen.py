#!/usr/bin/env python3
"""NeXify Re-Branding Asset-Generator (2026-08-09, Spezifikation aus ChatGPT-CI-Pack).
Erzeugt: SVG-Master, Mark-PNGs, Website-Assets (logo-mark, icons, og-image, favicon), Social-Paket."""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from pathlib import Path
import math, zipfile, json

ROOT = Path("/opt/nexifyai/branding")
LOGO = ROOT / "logos"
COVERS = ROOT / "titelgrafiken"
WEBSITE = ROOT / "website"
LOGO.mkdir(exist_ok=True); COVERS.mkdir(exist_ok=True); WEBSITE.mkdir(exist_ok=True)
F = ROOT / "fonts"
LIME = (200, 255, 0); BLACK = (10, 10, 10); WHITE = (245, 245, 245)
GRAY = (161, 161, 170); MUTED = (88, 88, 88); TILE = (12, 12, 15)

def font(path, size):
    return ImageFont.truetype(str(path), size)

FR = F / "Outfit-Regular.ttf"; FB = F / "Outfit-Bold.ttf"; FL = F / "Outfit-Light.ttf"

def nx_mark(size, glow=True):
    im = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    r = int(size * .18)
    d.rounded_rectangle((2, 2, size-3, size-3), radius=r, fill=TILE+(255,),
                        outline=(255, 255, 255, 26), width=max(1, size//220))
    if glow:
        g = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        gd = ImageDraw.Draw(g)
        cx, cy = size*.58, size*.56
        gd.ellipse((cx-size*.12, cy-size*.12, cx+size*.12, cy+size*.12), fill=LIME+(95,))
        g = g.filter(ImageFilter.GaussianBlur(size*.06))
        im = Image.alpha_composite(im, g)
        d = ImageDraw.Draw(im)
    s = size; x = s*.16; y = s*.22; w = s*.13; h = s*.56
    d.rounded_rectangle((x, y, x+w, y+h), radius=max(1, int(s*.02)), fill=LIME+(255,))
    d.rounded_rectangle((x+w*1.38, y, x+w*2.38, y+h), radius=max(1, int(s*.02)), fill=LIME+(255,))
    d.polygon([(s*.22, s*.22), (s*.38, s*.22), (s*.82, s*.78), (s*.66, s*.78)], fill=LIME+(255,))
    return im

def wordmark(canvas_w, scale=1.0):
    h = int(170*scale)
    im = Image.new("RGBA", (canvas_w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    mark = nx_mark(int(150*scale), glow=False)
    im.alpha_composite(mark, (0, int(10*scale)))
    f1 = font(FB, int(70*scale)); f2 = font(FL, int(70*scale)); f3 = font(FB, int(24*scale))
    x = int(175*scale); y = int(42*scale)
    d.text((x, y), "Ne", font=f1, fill=WHITE)
    bx = x + int(d.textlength("Ne", font=f1))
    d.text((bx, y), "X", font=f1, fill=LIME)
    cx = bx + int(d.textlength("X", font=f1))
    d.text((cx, y), "ify", font=f1, fill=WHITE)
    ax = cx + int(d.textlength("ify", font=f1)) + int(12*scale)
    d.text((ax, y+int(14*scale)), "AI", font=f2, fill=LIME)
    d.text((x, y+int(82*scale)), "A U T O M A T E  I T.", font=f3, fill=GRAY)
    return im

# 1) SVG-Master (exakt aus Spezifikation)
svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
<rect width="1024" height="1024" rx="184" fill="#0A0A0A"/>
<g fill="#C8FF00"><rect x="164" y="225" width="133" height="574" rx="20"/><rect x="346" y="225" width="133" height="574" rx="20"/><polygon points="225,225 389,225 840,799 676,799"/></g>
<circle cx="835" cy="189" r="58" fill="#C8FF00"/>
</svg>"""
(ROOT / "nexify-mark-master.svg").write_text(svg, encoding="utf-8")

# 2) Website-Assets
nx_mark(512, glow=True).convert("RGB").save(WEBSITE / "logo-mark.png", quality=95)
nx_mark(512, glow=False).convert("RGB").save(WEBSITE / "icon-512.png", quality=95)
nx_mark(192, glow=False).convert("RGB").save(WEBSITE / "icon-192.png", quality=95)
nx_mark(180, glow=False).convert("RGB").save(WEBSITE / "apple-touch-icon.png", quality=95)
# og-image 1200x630: Wortmarke + Claim auf Schwarz
og = Image.new("RGB", (1200, 630), BLACK)
ogd = ImageDraw.Draw(og)
g = Image.new("RGBA", (1200, 630), (0, 0, 0, 0))
gd = ImageDraw.Draw(g)
gd.ellipse((300, 80, 900, 560), fill=LIME+(38,))
g = g.filter(ImageFilter.GaussianBlur(60))
og = Image.alpha_composite(og.convert("RGBA"), g)
wm = wordmark(760, scale=1.35)
og.alpha_composite(wm, (100, 200))
og.convert("RGB").save(WEBSITE / "og-image.png", quality=95)
# favicon (SVG in ICO-nah: als PNG 64)
nx_mark(64, glow=False).convert("RGB").save(WEBSITE / "favicon-64.png", quality=95)

# 3) Social-Profile (1024, CI-Ring)
def profile(size):
    im = Image.new("RGB", (size, size), BLACK)
    glow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    for r, a in [(int(size*.40), 20), (int(size*.30), 30), (int(size*.20), 45)]:
        gd.ellipse((size*.5-r, size*.5-r, size*.5+r, size*.5+r), fill=LIME+(a,))
    glow = glow.filter(ImageFilter.GaussianBlur(size*.07))
    im = Image.alpha_composite(im.convert("RGBA"), glow)
    mark = nx_mark(int(size*.64), glow=False)
    im.alpha_composite(mark, (int(size*.18), int(size*.18)))
    d = ImageDraw.Draw(im)
    d.ellipse((int(size*.055), int(size*.055), int(size*.945), int(size*.945)),
              outline=LIME+(120,), width=max(2, size//160))
    return im.convert("RGB")

for name in ["whatsapp", "telegram", "facebook", "instagram", "google-business"]:
    profile(1024).save(LOGO / f"{name}-profil.png", quality=96)

# 4) Covers (Titelgrafiken)
def title_graphic(w, h, platform, subtitle, crop_safe=False):
    im = Image.new("RGB", (w, h), BLACK)
    glow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    for k in range(7):
        x = int(w*(.55 + k*.055)); y = int(h*(.78 - k*.07))
        gd.ellipse((x-w*.22, y-h*.06, x+w*.22, y+h*.06), fill=LIME+(max(5, 35-k*4),))
    glow = glow.filter(ImageFilter.GaussianBlur(max(12, int(min(w, h)*.035))))
    im = Image.alpha_composite(im.convert("RGBA"), glow)
    d = ImageDraw.Draw(im)
    for i in range(10):
        pts = []
        for x in range(-20, w+20, max(8, w//180)):
            t = x/w
            yy = h*(.68 + .10*math.sin(t*5.5+i*.43) + i*.012) - x*.12
            pts.append((x, yy))
        d.line(pts, fill=LIME+(max(18, 70-i*5),), width=max(1, w//900))
    for i in range(12):
        x = int(w*(.56 + .38*((i*37) % 100)/100)); y = int(h*(.18 + .62*((i*61) % 100)/100))
        r = max(2, int(min(w, h)*.006))
        d.ellipse((x-r, y-r, x+r, y+r), fill=LIME+(120,))
        if i > 0:
            px = int(w*(.56 + .38*(((i-1)*37) % 100)/100)); py = int(h*(.18 + .62*(((i-1)*61) % 100)/100))
            d.line((px, py, x, y), fill=LIME+(55,), width=max(1, w//1200))
    for cx, cy, sz in [(.70, .42, .14), (.79, .56, .10), (.63, .58, .09)]:
        cx, cy, sz = int(w*cx), int(h*cy), int(min(w, h)*sz)
        d.rectangle((cx-sz//2, cy-sz//2, cx+sz//2, cy+sz//2), outline=LIME+(70,), width=max(1, w//1300))
        d.line((cx-sz//2, cy-sz//2, cx, cy-int(sz*.8)), fill=LIME+(55,), width=max(1, w//1300))
        d.line((cx+sz//2, cy-sz//2, cx, cy-int(sz*.8)), fill=LIME+(55,), width=max(1, w//1300))
    wm = wordmark(int(w*.44), scale=max(.55, min(1.4, w/1800)))
    x = int(w*.08); y = int(h*.27 if not crop_safe else h*.43)
    im.alpha_composite(wm, (x, y))
    d = ImageDraw.Draw(im)
    sf = font(FB, max(22, int(min(w, h)*.032)))
    subf = font(FR, max(15, int(min(w, h)*.018)))
    tx = int(w*.07); ty = int(h*.73 if not crop_safe else h*.70)
    d.text((tx, ty), "KI AGENTEN  ·  AUTOMATISIERUNG  ·  24/7 BETRIEB", font=sf, fill=WHITE)
    d.text((tx, ty+sf.size+10), subtitle, font=subf, fill=GRAY)
    d.text((w-int(w*.07)-d.textlength(platform, font=subf), int(h*.08)), platform.upper(), font=subf, fill=LIME+(230,))
    return im.convert("RGB")

specs = {
    "whatsapp-business-titelgrafik": (1200, 600, "WHATSAPP BUSINESS", "KI-Automatisierung für Unternehmen"),
    "telegram-header": (1920, 1080, "TELEGRAM", "Agenten, Workflows und Automatisierung"),
    "facebook-page-cover": (851, 315, "FACEBOOK", "Messbar. Transparent. Im Betrieb."),
    "instagram-feed-portrait": (1080, 1350, "INSTAGRAM", "Ihr Unternehmen. Auf Autopilot."),
    "instagram-story-reel": (1080, 1920, "INSTAGRAM", "KI-Agenten. Automatisierung. 24/7."),
    "google-business-cover": (2120, 1192, "GOOGLE BUSINESS", "KI-Automatisierung für DACH & NL"),
}
for fn, (w, h, plat, sub) in specs.items():
    title_graphic(w, h, plat, sub, crop_safe=(w/h < 0.75)).save(COVERS / f"{fn}.png", quality=94)
title_graphic(2560, 1440, "NEXIFY AI", "AI AGENTEN · AUTOMATISIERUNG · BUSINESS · 24/7").save(COVERS / "master-16x9-2560x1440.png", quality=95)

# 5) asset-spec.json + README
docs = {"ci": {"background": "#0A0A0A", "accent": "#C8FF00", "text_primary": "#FFFFFF",
               "text_secondary": "#A1A1AA", "headings": "Outfit", "body": "Manrope",
               "tagline": "AUTOMATE IT.", "design": "Dark / Luxury / premium automation / restrained neon-lime"},
        "assets": {"WhatsApp profile": "1024x1024", "Telegram profile": "1024x1024",
                   "Facebook Page profile": "1024x1024 master; Facebook recommends 320x320",
                   "Instagram profile": "1024x1024 master",
                   "Google Business logo": "1024x1024 master; Google recommends 720x720",
                   "WhatsApp Business banner": "1200x600", "Telegram header": "1920x1080",
                   "Facebook Page cover": "851x315", "Instagram portrait feed": "1080x1350",
                   "Instagram Story/Reel": "1080x1920", "Google Business cover": "2120x1192"}}
(ROOT / "asset-spec.json").write_text(json.dumps(docs, indent=2, ensure_ascii=False), encoding="utf-8")
(ROOT / "README.md").write_text(
    "# NeXify AI Social CI Asset Pack\n\nCI: #0A0A0A / #C8FF00 / white / #A1A1AA. Claim: AUTOMATE IT.\n"
    "Typografie-Ziel: Outfit (Headings) + Manrope (Body); Asset-Fonts: Lato (System-Fallback).\n"
    "Profile nutzen NUR das NeXify-Mark (keine Plattform-Farben).\n", encoding="utf-8")

print("Assets erzeugt:")
for p in sorted(ROOT.rglob("*")):
    if p.is_file() and "fonts" not in str(p):
        print(" -", p.relative_to(ROOT), p.stat().st_size)
