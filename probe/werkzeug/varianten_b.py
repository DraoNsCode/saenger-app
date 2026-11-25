"""Stilvarianten 5 bis 8: Kirchenfenster, Nachtgarten, Gouache, Kraeuterbuch."""
from vlib import *


# ---------- 5 Kirchenfenster ----------

def kirchenfenster():
    r = random.Random(6)
    blei = '#14120f'
    fenster = 'M22,600L22,190C22,92 96,36 200,8C304,36 378,92 378,190L378,600Z'
    inn = lambda x, y: 22 < x < 378 and (y > 190 or ((x - 200) / 178) ** 2 + ((190 - y) / 182) ** 2 < 1.02)
    bach = schlange([(330, 640), (330, 600), (308, 430), (344, 280), (300, 150), (320, -20)])
    bp = kurve(bach, 60)
    # Punktpaare links und rechts der Grenzen, damit Scheiben an Weg und Bach enden
    ps = []
    def grenze(kp, halb, d, schritt):
        for x, y, dx, dy in kp[::schritt]:
            for s in (-1, 1):
                for q in (halb - d, halb + d):
                    ps.append((x - dy * s * q + r.uniform(-.6, .6), y + dx * s * q + r.uniform(-.6, .6)))
    grenze(WP, 27, 10, 13)
    grenze(bp, 17, 8, 13)
    ps = [p for p in ps if -10 < p[0] < 410 and -10 < p[1] < 610]
    # Baumkronen als Scheibenrosetten
    baeume = [(78, 250, 44), (92, 420, 36), (356, 470, 30), (70, 520, 34), (334, 200, 0)]
    for x, y, rr in baeume:
        if rr:
            for k in range(9):
                w = k * .698
                for q in (rr - 7, rr + 7):
                    ps.append((x + q * math.cos(w), y + q * math.sin(w)))
            for k in range(5):
                ps.append((x + rr * .42 * math.cos(k * 1.257), y + rr * .42 * math.sin(k * 1.257)))
    eng = []
    for p in ps:
        if all(math.hypot(p[0] - a, p[1] - b) > 8.5 for a, b in eng):
            eng.append(p)
    ps = eng
    ps += streu(r, 220, lambda x, y: all(math.hypot(x - a, y - b) > 24 for a, b in ps), 26)
    zellen = voronoi(ps)
    defs = f'''<clipPath id="f"><path d="{fenster}"/></clipPath>
<filter id="glas" x="0" y="0" width="1" height="1" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".02 .06" numOctaves="4" seed="3"/><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 .97  0 0 0 0 .85  1.5 0 0 0 -.62"/></filter>
<filter id="schlieren" x="0" y="0" width="1" height="1"><feTurbulence type="fractalNoise" baseFrequency=".09 .03" numOctaves="3" seed="11"/><feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 .05  1.3 0 0 0 -.6"/></filter>
<filter id="weich" x="-.5" y="-.5" width="2" height="2"><feGaussianBlur stdDeviation="14"/></filter>
<radialGradient id="licht" gradientUnits="userSpaceOnUse" cx="200" cy="470" r="330"><stop offset="0" stop-color="#fff8dc" stop-opacity=".62"/><stop offset=".5" stop-color="#ffe9a8" stop-opacity=".2"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<linearGradient id="dunkel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05070f" stop-opacity=".82"/><stop offset=".3" stop-color="#05070f" stop-opacity=".66"/><stop offset=".47" stop-color="#05070f" stop-opacity=".12"/><stop offset=".56" stop-color="#05070f" stop-opacity="0"/></linearGradient>'''
    weg = ['#f6cf5f', '#f2b941', '#fbe08d', '#eaa632', '#f9d877']
    gruen = ['#2f8a4d', '#1f7a56', '#4fa64a', '#176a4c', '#7bbf4b', '#2b9a6a']
    blau = ['#2f6fd0', '#1f55b8', '#5a9be6', '#3a86d8', '#2246a0']
    himmel = ['#2a3fa8', '#3d58c8', '#5a3fa0', '#26348a', '#6c4fb8', '#3f74d8']
    rot = ['#c8323a', '#b02243', '#e0553f', '#d43d52']
    z = ''
    for (x, y), v in zip(ps, zellen):
        if len(v) < 3 or not (inn(x, y) or any(inn(a, b) for a, b in v)):
            continue
        if wegabstand(x, y) < 27:
            c = r.choice(weg)
        elif abstand(bp[::3], x, y) < 17:
            c = r.choice(blau[:4] + ['#8cc6f2'])
        elif y < 96 + 14 * math.sin(x / 40):
            c = r.choice(himmel)
        else:
            c = r.choice(gruen)
            for bx, by, rr in baeume:
                if rr and math.hypot(x - bx, y - by) < rr:
                    c = r.choice(rot + (['#f2b941'] if r.random() < .3 else [])) if math.hypot(x - bx, y - by) < rr * .7 and r.random() < .55 else r.choice(['#136043', '#0f5140', '#1d7c4a'])
        c = misch(c, '#ffffff', r.uniform(0, .13)) if r.random() < .5 else misch(c, '#000022', r.uniform(0, .16))
        z += poly(v, c, blei, 2.6)
    # Staemme und Beet
    for x, y, rr in baeume:
        if rr:
            z += poly([(x - 6, y + rr), (x + 6, y + rr), (x + 8, y + rr + 34), (x - 8, y + rr + 34)], '#8a4b2a', blei, 2.4)
    beet = [(286, 520), (366, 512), (372, 566), (290, 574)]
    for k in range(5):
        a = k / 5
        q = lambda p1, p2, t: (p1[0] + (p2[0] - p1[0]) * t, p1[1] + (p2[1] - p1[1]) * t)
        z += poly([q(beet[0], beet[3], a), q(beet[1], beet[2], a), q(beet[1], beet[2], a + .2), q(beet[0], beet[3], a + .2)], ['#7a3f22', '#93502b'][k % 2], blei, 2.4)
    # Medaillons
    st = ''
    for i, (x, y) in enumerate(STATIONEN):
        st += f'<circle cx="{x}" cy="{y}" r="34" fill="{blei}"/>'
        if i == 2:
            farben, kern = ['#22406a', '#1b3357'], '#33557f'
        elif i == 1:
            farben, kern = ['#fff2b0', '#ffd95a'], '#ffffff'
        else:
            farben, kern = ['#d43d52', '#b02243'], '#ffd95a'
        kk = 8
        for k in range(kk):
            w0, w1 = k * 2 * math.pi / kk, (k + 1) * 2 * math.pi / kk
            st += pfad(f'M{n(x+13*math.cos(w0))},{n(y+13*math.sin(w0))}L{n(x+31*math.cos(w0))},{n(y+31*math.sin(w0))}A31,31 0 0 1 {n(x+31*math.cos(w1))},{n(y+31*math.sin(w1))}L{n(x+13*math.cos(w1))},{n(y+13*math.sin(w1))}A13,13 0 0 0 {n(x+13*math.cos(w0))},{n(y+13*math.sin(w0))}Z', farben[k % 2], blei, 2.4)
            if i == 0:
                wm = (w0 + w1) / 2
                st += drehung(x + 22 * math.cos(wm), y + 22 * math.sin(wm), math.degrees(wm) + 90, pfad('M0,7C-6,3 -5,-6 0,-8C5,-6 6,3 0,7Z', '#f6cf5f', blei, 1.6))
        st += ell(x, y, 12.5, 12.5, kern, blei, 2.6)
    # Taube als Position
    taube = drehung(184, 392, 0, pfad('M-26,6C-14,4 -10,-2 -4,-8C-8,-20 -2,-32 10,-36C8,-26 10,-18 14,-12C18,-16 24,-16 26,-11L33,-9L26,-6C24,4 12,10 2,9C-6,14 -18,14 -26,6Z', '#f4f8ff', blei, 2.6) + pfad('M-4,-8C0,-4 8,-4 14,-12M-12,6C-6,6 -2,4 2,0', 'none', blei, 2) + ell(22, -10, 1.6, 1.6, blei))
    rahmen = pfad(fenster, 'none', '#3d352b', 17) + pfad(fenster, 'none', '#6c604f', 11) + pfad(fenster, 'none', '#8d806b', 4)
    quer = ''.join(pfad(f'M22,{y}L378,{y}', 'none', blei, 3.4) for y in (262, 432))
    inhalt = '<rect width="400" height="600" fill="#1a1612"/>' + f'<path d="{fenster}" fill="#fff3c4" opacity=".28" filter="url(#weich)"/>'
    inhalt += f'<g clip-path="url(#f)">{z}<rect width="400" height="600" filter="url(#glas)" style="mix-blend-mode:screen" opacity=".55"/><rect width="400" height="600" filter="url(#schlieren)" style="mix-blend-mode:multiply" opacity=".7"/><rect class="sonne" width="400" height="600" fill="url(#licht)" style="mix-blend-mode:screen"/>{quer}{st}{taube}<rect width="400" height="600" fill="url(#dunkel)"/>'
    inhalt += f'<circle class="puls" cx="{STATIONEN[1][0]}" cy="{STATIONEN[1][1]}" r="62" fill="#fff0b0" opacity=".55" filter="url(#weich)" style="mix-blend-mode:screen"/></g>' + rahmen
    seite('05', 'kirchenfenster', 'Kirchenfenster', inhalt, css='.puls{animation:p 3s ease-in-out infinite}@keyframes p{50%{opacity:.18}}.sonne{animation:so 11s ease-in-out infinite alternate}@keyframes so{from{transform:translate(-40px,10px)}to{transform:translate(50px,-40px)}}', grund='#0d0b09', defs=defs)


# ---------- 6 Nachtgarten ----------

def nachtgarten():
    r = random.Random(9)
    defs = '''<linearGradient id="nacht" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1a38"/><stop offset=".5" stop-color="#123044"/><stop offset="1" stop-color="#123a3c"/></linearGradient>
<radialGradient id="glut"><stop offset="0" stop-color="#ffe7a3" stop-opacity=".95"/><stop offset=".25" stop-color="#ffc861" stop-opacity=".5"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient>
<radialGradient id="mond"><stop offset="0" stop-color="#eef4ff" stop-opacity=".85"/><stop offset=".4" stop-color="#a9c4ff" stop-opacity=".25"/><stop offset="1" stop-color="#8fb0ff" stop-opacity="0"/></radialGradient>
<linearGradient id="teich" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#27507a"/><stop offset="1" stop-color="#132c4c"/></linearGradient>
<filter id="bl"><feGaussianBlur stdDeviation="5"/></filter>'''
    a = '<rect width="400" height="600" fill="url(#nacht)"/>'
    for _ in range(26):
        a += pfad(fleck(r.uniform(0, 400), r.uniform(120, 600), r.uniform(40, 90), r.uniform(16, 34), r), r.choice(['#1a4a4a', '#0f3038', '#174351']), extra=' fill-opacity=".35"')
    # Weg, unten warm, oben kalt
    WEG = schlange([(200, 640), (200, 600), (262, 470), (132, 325), (246, 180), (200, 112)])
    WP = kurve(WEG, 60)
    d = kurve_d(WEG)
    a += '<linearGradient id="wg" gradientUnits="userSpaceOnUse" x1="0" y1="600" x2="0" y2="60"><stop offset="0" stop-color="#b98f5a"/><stop offset=".42" stop-color="#9c7d5d"/><stop offset=".56" stop-color="#4a5d74"/><stop offset="1" stop-color="#2f4664"/></linearGradient>'
    a += pfad(d, 'none', '#0c2530', 60) + pfad(d, 'none', 'url(#wg)', 48)
    for x, y, dx, dy in WP[::3]:
        for q in (-15, -5, 6, 16):
            if r.random() < .72:
                t = max(0, min(1, (y - 270) / 160))
                a += drehung(x - dy * (q + r.uniform(-2, 2)), y + dx * q, r.uniform(-30, 30), ell(0, 0, r.uniform(3.6, 5.6), r.uniform(2.4, 3.4), misch('#3a5170', '#d8ac70', t), '#0c2530', .7, f' fill-opacity="{r.uniform(.5, .95):.2f}"'))
    # Kreuzgang mit erleuchteten Fenstern oben
    kg = rect(0, 52, 400, 62, '#0d2140') + rect(120, 112, 1, 1, 'none') + rect(0, 46, 400, 9, '#1a3358')
    for i in range(10):
        x = 6 + i * 40
        if not 150 < x < 226:
            kg += pfad(f'M{x},114L{x},84A14,14 0 0 1 {x+28},84L{x+28},114Z', '#f5c06a' if i in (1, 2, 7, 8) else '#142c50') + pfad(f'M{x+14},114L{x+14},72', 'none', '#0d2140', 2.4)
            if i in (1, 2, 7, 8):
                a += f'<ellipse cx="{x+14}" cy="132" rx="34" ry="40" fill="url(#glut)" opacity=".5"/>'
    kg += pfad('M146,114L146,40L200,4L254,40L254,114Z', '#0d2140') + pfad('M176,114L176,82A24,24 0 0 1 224,82L224,114Z', '#f7cd7d') + pfad('M200,114L200,58M176,90L224,90', 'none', '#0d2140', 2) + ell(200, 38, 9, 9, '#f5c06a') + pfad('M200,29L200,47M191,38L209,38', 'none', '#0d2140', 1.6)
    a += kg + '<ellipse cx="200" cy="120" rx="80" ry="60" fill="url(#glut)" opacity=".7"/>'
    a += '<circle cx="336" cy="26" r="70" fill="url(#mond)"/>' + ell(336, 26, 15, 15, '#f4f7ff')
    for _ in range(26):
        a += ell(r.uniform(0, 400), r.uniform(2, 44), r.uniform(.5, 1.2), r.uniform(.5, 1.2), '#dfe9ff', extra=' class="stern"')
    # Teich mit Mondspiegel und Seerosen
    a += pfad(fleck(332, 330, 74, 40, r, 10, .07), '#0c2530') + pfad(fleck(332, 328, 66, 34, r, 10, .07), 'url(#teich)')
    for i in range(6):
        b_ = 20 - abs(2.4 - i) * 4
        a += pfad(f'M{n(336-b_)},{310+i*7}q{n(b_/2)},3 {n(b_)},0t{n(b_)},0', 'none', '#dfe9ff', 1.8, f' stroke-opacity="{.75-i*.08:.2f}" class="welle"')
    for x, y, s in [(296, 336, 1), (316, 350, .8), (366, 344, .9), (290, 318, .7)]:
        a += drehung(x, y, r.uniform(-20, 20), pfad('M0,0L11,-3A12,6.4 0 1 1 11,3Z', '#2f7a63', '#123a3c', .8), s)
    a += drehung(318, 347, 0, ''.join(drehung(0, 0, w, pfad('M0,0C-4,-5 -3,-12 0,-14C3,-12 4,-5 0,0Z', '#f3d7ee', '#a582b5', .6)) for w in (-56, -28, 0, 28, 56)))
    # Baeume und Straeucher als Schattenrisse mit warmem Rand
    def baum(x, y, s, warm):
        z = pfad('M-5,0C-4,-18 -4,-26 -8,-36L8,-36C4,-26 4,-18 6,0Z', '#0a1e28') + pfad(wolke(0, -62, 40, 36, 13, r, .08), '#0f3a3a') + pfad(wolke(8, -54, 30, 24, 10, r, .08), '#0a2b31')
        z += pfad(wolke(-12 if warm < 0 else 12, -62, 22, 22, 9, r, .08), '#1f5a4c', extra=' fill-opacity=".9"') + pfad(wolke(-18 if warm < 0 else 18, -58, 12, 13, 8, r, .08), '#4f7f52', extra=' fill-opacity=".75"')
        return drehung(x, y, 0, z, s)
    zyp = lambda x, y, s: drehung(x, y, 0, pfad('M0,0C-15,-12 -13,-60 0,-92C13,-60 15,-12 0,0Z', '#0a2b31') + pfad('M2,-4C10,-16 9,-56 0,-84C4,-50 4,-24 2,-4Z', '#1f5a4c', extra=' fill-opacity=".7"'), s)
    dinge = [(176, baum(64, 190, .95, 1)), (200, zyp(336, 214, .9)), (206, zyp(366, 222, .75)), (212, zyp(306, 206, .7)), (300, baum(40, 312, .9, 1)), (520, baum(356, 540, 1.15, -1)), (400, zyp(30, 420, .85))]
    # Offene Stelle: Beet, nur Umriss im Mondlicht
    beet = poly([(40, 462), (138, 458), (146, 520), (38, 526)], '#0c2530', '#6f8fb0', 1.6) + ''.join(pfad(f'M46,{472+k*10}L142,{469+k*10}', 'none', '#27506a', 3) for k in range(5)) + drehung(112, 486, 12, pfad('M0,-30L0,4', 'none', '#8fb0c8', 3) + pfad('M-6,2L6,2L5,14L0,18L-5,14Z', '#a9c4d8') + pfad('M-6,-30L6,-30', 'none', '#8fb0c8', 4))
    dinge.append((524, beet))
    # Laternen am gegangenen Weg
    def laterne(x, y, an):
        z = ell(0, 2, 7, 2.4, '#061018', extra=' fill-opacity=".6"') + pfad('M0,2L0,-34', 'none', '#061018', 3.4) + pfad('M-6,-34L6,-34L8,-52L-8,-52Z', '#ffe2a0' if an else '#22405a', '#061018', 2) + pfad('M-10,-52L0,-61L10,-52Z', '#061018')
        l = f'<circle class="licht" cx="0" cy="-42" r="74" fill="url(#glut)" style="mix-blend-mode:screen"/><ellipse cx="0" cy="4" rx="56" ry="26" fill="url(#glut)" opacity=".55" style="mix-blend-mode:screen"/>' if an else ''
        return drehung(x, y, 0, l + z)
    for x, y, an in [(150, 596, 1), (250, 566, 1), (222, 448, 1), (300, 500, 1), (150, 416, 1), (98, 346, 1), (184, 268, 0), (292, 206, 0), (206, 176, 0), (158, 118, 0)]:
        dinge.append((y, laterne(x, y, an)))
    # Stationen
    for i, (x, y) in enumerate(STATIONEN):
        s = ell(x, y + 5, 31, 22, '#061820') + ell(x, y, 31, 22, ['#8a6f4b', '#6f6a63', '#334a66'][i], '#0c2530', 1.4)
        if i == 0:
            s += f'<ellipse cx="{x}" cy="{y}" rx="46" ry="34" fill="url(#glut)" opacity=".55" style="mix-blend-mode:screen"/>' + ''.join(drehung(x, y, k * 60, f'<g transform="scale(1 .72)">{pfad("M0,0C-8,-7 -6,-17 0,-20C6,-17 8,-7 0,0Z", "#ffe2a0", "#9c6d2a", 1)}</g>') for k in range(6)) + ell(x, y, 5, 4, '#fff8e2')
        elif i == 1:
            s += f'<ellipse class="puls" cx="{x}" cy="{y}" rx="58" ry="44" fill="url(#glut)" style="mix-blend-mode:screen"/>' + ell(x, y, 23, 16, 'none', '#ffe2a0', 4.4) + ell(x, y, 8, 5.6, '#fff8e2')
        else:
            s += ell(x, y, 20, 14, '#3f5877', '#22364f', 1.2)
        dinge.append((y + 3, s))
    # Figur mit Handlaterne
    fig = drehung(176, 392, 0, f'<circle class="licht" cx="17" cy="-16" r="66" fill="url(#glut)" style="mix-blend-mode:screen"/>' + pfad('M0,-34C-7,-34 -9,-28 -10,-20L-13,0C-6,3 6,3 13,0L10,-20C9,-28 7,-34 0,-34Z', '#1c3157', '#0a1730', 1.2) + pfad('M4,-32C9,-26 11,-12 13,0C10,1.6 7,2 5,2C7,-10 7,-24 4,-32Z', '#c98f4b', extra=' fill-opacity=".75"') + ell(0, -38, 6, 6, '#d9a877') + pfad('M-8,-36C-9,-48 9,-48 8,-36C5,-41 -5,-41 -8,-36Z', '#1c3157', '#0a1730', 1) + pfad('M8,-24L17,-22', 'none', '#1c3157', 4) + pfad('M13,-20L21,-20L22,-8L12,-8Z', '#fff0bd', '#061018', 1.6) + pfad('M13,-20A4,5 0 0 1 21,-20', 'none', '#061018', 1.6), 1.1)
    dinge.append((392, fig))
    for x, y in streu(r, 46, lambda x, y: wegabstand(x, y) > 40 and not (258 < x and 290 < y < 372) and not (30 < x < 150 and 450 < y < 532), 26, 0, 130, 400, 600):
        warm = y > 330
        dinge.append((y, drehung(x, y, 0, pfad('M-5,0C-4,-4 -5,-8 -7,-11M0,0C0,-5 0,-9 1,-13M5,0C4,-4 6,-7 8,-10', 'none', '#3f7a5f' if warm else '#22505a', 1.6) + (ell(1, -14, 2.6, 2.6, r.choice(['#f3d7ee', '#ffe2a0', '#bcd4ff'])) if r.random() < .5 else ''))))
    a += ''.join(s for _, s in sorted(dinge, key=lambda t: t[0]))
    # Gluehwuermchen
    for i in range(24):
        x, y = r.uniform(10, 390), r.uniform(190, 590)
        a += f'<g class="gw" style="animation-delay:-{r.uniform(0, 9):.1f}s;animation-duration:{r.uniform(6, 11):.1f}s"><circle cx="{n(x)}" cy="{n(y)}" r="7" fill="url(#glut)"/><circle cx="{n(x)}" cy="{n(y)}" r="1.3" fill="#fffbe0"/></g>'
    css = '.licht{animation:fl 2.8s ease-in-out infinite}.licht:nth-of-type(2n){animation-duration:3.7s}@keyframes fl{0%,100%{opacity:.95}40%{opacity:.78}55%{opacity:.9}70%{opacity:.72}}.puls{animation:p 2.6s ease-in-out infinite}@keyframes p{50%{opacity:.35}}.gw{animation:gw 8s ease-in-out infinite}@keyframes gw{0%,100%{transform:none;opacity:.9}30%{transform:translate(14px,-16px);opacity:.2}60%{transform:translate(-10px,-26px);opacity:1}}.stern{animation:p 4s infinite}.welle{animation:w 5s ease-in-out infinite alternate}@keyframes w{from{transform:translateX(-3px)}to{transform:translateX(3px)}}'
    seite('06', 'nachtgarten', 'Nachtgarten mit Laternen', a, css=css, grund='#060d18', defs=defs)


# ---------- 7 Gouache im Morgenlicht ----------

def gouache():
    r = random.Random(4)
    defs = '''<filter id="rau" x="-.02" y="-.02" width="1.04" height="1.04"><feTurbulence type="fractalNoise" baseFrequency=".07" numOctaves="3" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="6"/></filter>
<filter id="korn" x="0" y="0" width="1" height="1"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="3" seed="5"/><feColorMatrix type="matrix" values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 .5 -.14"/></filter>
<filter id="bl2"><feGaussianBlur stdDeviation="16"/></filter>
<linearGradient id="luft" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbe6c4" stop-opacity=".95"/><stop offset=".3" stop-color="#fbe3bf" stop-opacity=".42"/><stop offset=".6" stop-color="#fbe3bf" stop-opacity="0"/></linearGradient>'''
    tupf = []
    def tupfer(x, y, l, b_, w, c, o=.9):
        tupf.append(f'<ellipse cx="{n(x)}" cy="{n(y)}" rx="{n(l)}" ry="{n(b_)}" transform="rotate({n(w)} {n(x)} {n(y)})" fill="{c}" fill-opacity="{o:.2f}"/>')
    # Wiese: viele Pinselstriche, unten satter, oben heller
    for _ in range(1500):
        x, y = r.uniform(-10, 410), r.uniform(60, 610)
        t = (y - 60) / 540
        c = misch(misch('#cfd39a', '#6f9a58', t), r.choice(['#f0e0a0', '#4f7f4b', '#a9bf6a', '#86a862']), r.uniform(0, .4))
        tupfer(x, y, r.uniform(7, 16) * (.6 + t * .6), r.uniform(2.2, 4.6) * (.6 + t * .6), r.uniform(-18, 18), c, r.uniform(.55, .9))
    # lange Schatten quer ueber die Wiese
    for y, l in [(250, 190), (410, 210), (548, 160)]:
        for _ in range(70):
            tupfer(r.uniform(0, l), y + r.uniform(-14, 14), r.uniform(9, 20), r.uniform(2, 4), r.uniform(2, 14), r.choice(['#4a6f63', '#557a5c', '#3f6260']), .38)
    # Weg: Grundton, dann Striche laengs
    tupf.append(pfad(kurve_d(WEG), 'none', '#d9b88a', 56) + pfad(kurve_d(WEG), 'none', '#efd6a8', 46))
    for _ in range(900):
        x, y, dx, dy = r.choice(WP)
        q = r.gauss(0, 11)
        q = max(-25, min(25, q))
        t = max(0, min(1, (y - 60) / 540))
        c = misch(misch('#fbeccb', '#e3bd84', t), r.choice(['#fff6de', '#c99a63', '#f3d09a', '#d8a878']), r.uniform(0, .42))
        tupfer(x - dy * q, y + dx * q, r.uniform(6, 13), r.uniform(1.8, 3.6), math.degrees(math.atan2(dy, dx)) + r.uniform(-16, 16), c, r.uniform(.6, .9))
    # Schattenflecken auf dem Weg
    for _ in range(120):
        x, y, dx, dy = r.choice(WP)
        if (y // 46) % 2 == 0:
            tupfer(x + r.uniform(-22, 22), y, r.uniform(4, 10), r.uniform(1.6, 3), r.uniform(-10, 16), r.choice(['#8f7b86', '#a3856f']), .4)
    def krone(x, y, rx, ry, farben, k, tr=1):
        for i in range(k):
            a, q = r.uniform(0, 6.283), math.sqrt(r.random())
            dx, dy = q * math.cos(a), q * math.sin(a)
            licht = (-dx * .7 - dy * .8 + 1.4) / 2.8 + r.uniform(-.16, .16)
            licht = max(0, min(.999, licht * .55 + i / k * .45 * (1 if licht > .45 else .3)))
            tupfer(x + dx * rx, y + dy * ry, r.uniform(4, 9) * tr, r.uniform(2.4, 5) * tr, r.uniform(-70, 70), farben[int(licht * len(farben))], r.uniform(.75, .96))
    def stamm(x, y, h, b_):
        for _ in range(int(h * 1.1)):
            t = r.random()
            tupfer(x + r.uniform(-b_, b_) * (1 - t * .4), y - t * h, r.uniform(1.2, 2.6), r.uniform(4, 8), r.uniform(-8, 8), misch('#5a3f35', '#a9745a', max(0, min(1, r.uniform(-.2, .8)))), .9)
    laub = ['#2f4f43', '#3f6b49', '#5b8a4c', '#86a94f', '#b9c766', '#e6dd92']
    herb = ['#7a3f45', '#a9545a', '#cf7a78', '#e8a39a', '#f6cbbd', '#fde7d6']
    # ferne Baeume und Kapelle im Dunst
    for x in range(-10, 410, 22):
        if not 150 < x < 250:
            krone(x, 84 + 10 * math.sin(x), 22, 26, ['#a9b59a', '#b9c2a0', '#c9cca8', '#dcd8b6'], 46, .8)
    for _ in range(150):
        tupfer(r.uniform(166, 234), r.uniform(58, 112), r.uniform(3, 7), r.uniform(2, 4), r.uniform(-12, 12), r.choice(['#f3e3cb', '#ead2b6', '#fbf1de']), .9)
    for i in range(70):
        t = i / 70
        tupfer(200 + r.uniform(-1, 1) * 42 * t, 26 + t * 34, r.uniform(3, 6), r.uniform(1.6, 3), -30 if r.random() < .5 else 30, r.choice(['#c98a72', '#b5755f', '#d9a088']), .9)
    for _ in range(34):
        tupfer(200 + r.uniform(-9, 9), r.uniform(84, 112), 3, 2.4, 80, r.choice(['#8d6f72', '#7a6068']), .9)
    stationen = list(STATIONEN)
    dinge = []
    def merke(y, fn):
        dinge.append((y, fn))
    merke(206, lambda: (stamm(60, 206, 40, 5), krone(58, 140, 46, 44, laub, 230)))
    merke(330, lambda: (stamm(346, 330, 44, 6), krone(346, 262, 48, 42, herb, 250)))
    merke(560, lambda: (stamm(34, 566, 56, 8), krone(26, 486, 58, 54, laub, 300, 1.15)))
    # Rosenbogen ueber dem Weg
    def bogen():
        for seite_ in (-1, 1):
            stamm(206 + seite_ * 36 + 10, 130, 44, 2)
        for i in range(200):
            w = math.pi * r.random()
            tupfer(216 + 38 * math.cos(w) + r.uniform(-5, 5), 92 - 40 * math.sin(w) + r.uniform(-6, 6), r.uniform(3, 5.4), r.uniform(2.2, 3.6), r.uniform(-60, 60), r.choice(laub[1:5]), .9)
        for i in range(44):
            w = math.pi * r.random()
            tupfer(216 + 38 * math.cos(w) + r.uniform(-6, 6), 92 - 40 * math.sin(w) + r.uniform(-7, 7), 3.2, 2.8, 0, r.choice(['#e88f8a', '#f6c3b8', '#d9656a', '#fff0e6']), .95)
    merke(131, bogen)
    # Bach rechts unten
    bz = schlange([(352, 640), (368, 560), (338, 470), (366, 392), (352, 350)])
    tupf.append(pfad(kurve_d(bz), 'none', '#6f8f72', 50) + pfad(kurve_d(bz), 'none', '#7fb0c0', 38))
    for _ in range(320):
        bx_, by_, dx_, dy_ = r.choice(kurve(bz, 40))
        q_ = r.uniform(-17, 17)
        x, y = bx_ - dy_ * q_, by_ + dx_ * q_
        tupfer(x, y, r.uniform(5, 13), r.uniform(1.4, 2.8), math.degrees(math.atan2(dy_, dx_)) + r.uniform(-14, 14), r.choice(['#8fb9c4', '#b9d6d8', '#6f9fb3', '#f6ead0', '#a3c8cc']), .85)
    # Bank, offene Stelle (Beet), Blumen
    def beet():
        for _ in range(170):
            tupfer(r.uniform(52, 142), r.uniform(414, 470), r.uniform(5, 10), r.uniform(2, 3.4), r.uniform(-6, 6), r.choice(['#7a5540', '#8f6a50', '#6b4838', '#a9805f']), .92)
        for k in range(4):
            for _ in range(18):
                tupfer(r.uniform(54, 140), 420 + k * 14 + r.uniform(-1.2, 1.2), 6, 1.6, 0, '#553a30', .7)
        for _ in range(16):
            x = r.uniform(58, 92)
            for __ in range(4):
                tupfer(x + r.uniform(-3, 3), 428 + r.uniform(-5, 5), 3.4, 2, r.uniform(-60, 60), r.choice(laub[2:]), .95)
    merke(472, beet)
    def blumen(x, y, c, k=18):
        for _ in range(k):
            tupfer(x + r.gauss(0, 11), y + r.gauss(0, 5), r.uniform(1.8, 3.2), r.uniform(1.4, 2.4), 0, r.choice(c), .95)
    for x, y in [(300, 540), (286, 566), (196, 530), (96, 560), (330, 440), (64, 340), (40, 360), (298, 214), (180, 230), (330, 396)]:
        merke(y, lambda x=x, y=y: (blumen(x, y, laub[1:4], 14), blumen(x, y - 4, r.choice([['#f6d35a', '#fff0b0'], ['#b79fd8', '#e0d2f2'], ['#fffaf0', '#f6e3d0'], ['#e88f8a', '#f6c3b8']]), 16)))
    def station(i, x, y):
        def f():
            basis = [['#d8b98f', '#f0dcb8', '#b9946c'], ['#f3e3c4', '#fff6e0', '#d8b98f'], ['#a9a48f', '#bdb59c', '#8d8a78']][i]
            for _ in range(90):
                a, q = r.uniform(0, 6.283), math.sqrt(r.random())
                tupfer(x + 30 * q * math.cos(a), y + 20 * q * math.sin(a), r.uniform(4, 8), r.uniform(1.8, 3), r.uniform(-16, 16), r.choice(basis), .95)
            if i == 0:
                for k in range(6):
                    w = k * 1.047
                    for _ in range(9):
                        q = r.uniform(.25, 1)
                        tupfer(x + 19 * q * math.cos(w) + r.uniform(-2, 2), y + 13 * q * math.sin(w) + r.uniform(-1.6, 1.6), 4.4, 3, math.degrees(w), r.choice(['#e9a53c', '#f6c65e', '#d98a2c']), .95)
                tupfer(x, y, 5, 4, 0, '#fff3c4', 1)
            elif i == 1:
                for k in range(70):
                    w = k * .0898
                    tupfer(x + 26 * math.cos(w), y + 18 * math.sin(w), 4.4, 2.4, math.degrees(w) + 90, r.choice(['#f2b73f', '#ffd873', '#e39b2c']), 1)
                for _ in range(16):
                    tupfer(x + r.gauss(0, 4), y + r.gauss(0, 3), 3.4, 2.4, 0, r.choice(['#ffd873', '#fff3c4']), 1)
            else:
                for _ in range(26):
                    tupfer(x + r.gauss(0, 11), y + r.gauss(0, 7), 4.4, 1.8, r.uniform(-60, -100), r.choice(laub[1:4]), .7)
        return f
    for i, (x, y) in enumerate(stationen):
        merke(y, station(i, x, y))
    # Katze als Position
    def katze():
        fell = ['#8d5a3b', '#c98a52', '#e3ae74', '#f3d3a4']
        for _ in range(90):
            a, q = r.uniform(0, 6.283), math.sqrt(r.random())
            tupfer(184 + 14 * q * math.cos(a), 384 + 17 * q * math.sin(a), 4, 2.6, r.uniform(50, 120), fell[min(3, int((1 - q * math.sin(a) - q * math.cos(a)) * 1.6 + r.random() * .8))] if q > .1 else fell[2], .95)
        for _ in range(40):
            a, q = r.uniform(0, 6.283), math.sqrt(r.random())
            tupfer(184 + 9.5 * q * math.cos(a), 361 + 8.4 * q * math.sin(a), 3, 2, r.uniform(-40, 40), r.choice(fell[1:]), .95)
        for s in (-1, 1):
            for k in range(6):
                tupfer(184 + s * (6 + k * .3), 354 - k * 1.2, 2.6 - k * .3, 2, 0, fell[1], 1)
        for k in range(26):
            t = k / 26
            tupfer(196 + 16 * math.sin(t * 2.6), 396 - t * 26 + 4, 3, 2.2, 60, r.choice(fell[:3]), .95)
    merke(402, katze)
    for y, fn in sorted(dinge, key=lambda t: t[0]):
        fn()
    strahlen = ''.join(poly([(60 + k * 66, -20), (92 + k * 66, -20), (-40 + k * 92, 640), (-130 + k * 92, 640)], '#fff3c9', extra=f' fill-opacity="{.16 if k % 2 else .1}" class="strahl"') for k in range(5))
    fliegend = ''.join(f'<ellipse class="blatt" style="animation-delay:-{r.uniform(0, 12):.1f}s;animation-duration:{r.uniform(9, 15):.1f}s" cx="{n(r.uniform(0, 400))}" cy="-12" rx="3.4" ry="2" fill="{r.choice(["#f6c3b8", "#e88f8a", "#fff0e6"])}"/>' for _ in range(14))
    inhalt = '<rect width="400" height="600" fill="#b9c58a"/><rect width="400" height="80" fill="#fbe6c4"/>' + g(''.join(tupf), filter='url(#rau)') + '<rect width="400" height="600" fill="url(#luft)"/>' + g(strahlen, filter='url(#bl2)', style='mix-blend-mode:soft-light') + fliegend + '<rect width="400" height="600" filter="url(#korn)" opacity=".55" style="mix-blend-mode:overlay"/>'
    seite('07', 'gouache', 'Gemalt, Gouache im Morgenlicht', inhalt, css='.strahl{animation:st 7s ease-in-out infinite alternate}@keyframes st{from{opacity:.5}to{opacity:1}}.blatt{animation:fall 12s linear infinite}@keyframes fall{0%{transform:translate(0,0) rotate(0)}50%{transform:translate(-38px,310px) rotate(200deg)}100%{transform:translate(-14px,640px) rotate(420deg)}}svg.bild{overflow:hidden}', grund='#e9dcc0', defs=defs)


# ---------- 8 Kraeuterbuch (Kupferstich) ----------

def kraeuterbuch():
    r = random.Random(16)
    tint = '#2b2119'
    pat = lambda id_, w, d, b_: f'<pattern id="{id_}" width="{d}" height="{d}" patternUnits="userSpaceOnUse" patternTransform="rotate({w})"><path d="M0,0L0,{d}" stroke="{tint}" stroke-width="{b_}"/></pattern>'
    defs = pat('h1', 32, 3.4, .75) + pat('h2', 32, 2.3, .85) + pat('h3', -38, 3, .7) + pat('h4', 88, 3.2, .65) + '''
<filter id="pap" x="0" y="0" width="1" height="1"><feTurbulence type="fractalNoise" baseFrequency=".01 .014" numOctaves="5" seed="12"/><feColorMatrix type="matrix" values="0 0 0 0 .45  0 0 0 0 .32  0 0 0 0 .14  .55 .3 0 0 -.3"/></filter>
<filter id="stich"><feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="2" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1.5"/></filter>
<filter id="hand"><feTurbulence type="fractalNoise" baseFrequency=".03" numOctaves="3" seed="8" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="9"/></filter>'''
    f, t = '', ''
    L = lambda d, w=.9: pfad(d, 'none', tint, w)
    H = lambda d, p='h1': f'<path d="{d}" fill="url(#{p})"/>'
    # schmalere Gartenflaeche mit Kartusche
    W = schlange([(200, 640), (200, 560), (238, 452), (164, 330), (232, 216), (200, 120), (200, 96)])
    ws = kurve(W, 60)
    st = [(238, 452), (164, 330), (232, 216)]
    b = band(W, 42)
    f += pfad(weich(b[::3]), '#ecd6a2', extra=' fill-opacity=".75"')
    for s in (-21, 21):
        t += L(weich([(x - dy * s, y + dx * s) for x, y, dx, dy in ws[::10]], False), 1.2)
    for x, y, dx, dy in ws[::4]:
        if r.random() < .55:
            t += drehung(x - dy * 17, y + dx * 17, math.degrees(math.atan2(dy, dx)), L('M-5,0L5,0M-4,2.6L5,2.4', .6))
    for _ in range(50):
        x, y, dx, dy = r.choice(ws)
        q = r.uniform(-15, 15)
        t += drehung(x - dy * q, y + dx * q, 0, L('M-2.4,0q2.4,-2.2 4.8,0', .6))
    # Boden als Schraffur
    wabst = lambda x, y: abstand(ws[::3], x, y)
    for x, y in streu(r, 250, lambda x, y: wabst(x, y) > 27 and 96 < y < 560, 12, 92, 100, 308, 556):
        t += drehung(x, y, 0, L(r.choice(['M-5,0L5,-.6', 'M-3,0q-1,-4 -3,-6M0,0q0,-5 1,-8M3,0q1,-4 3,-5', 'M-6,0L2,0M-2,2L6,2']), .65))
    # Mauer mit Torbogen oben
    m = 'M92,62L176,62L176,104L92,104ZM224,62L308,62L308,104L224,104Z'
    t += L(m, 1.1) + H('M92,62L176,62L176,104L92,104Z', 'h4')
    for x0 in (92, 224):
        for j in range(4):
            t += L(f'M{x0},{62+j*10.5}L{x0+84},{62+j*10.5}', .7) + ''.join(L(f'M{x0+8+i*17+(8 if j%2 else 0)},{62+j*10.5}l0,10.5', .6) for i in range(5 if j % 2 == 0 else 4))
    t += L('M172,104L172,52A28,28 0 0 1 228,52L228,104M180,104L180,54A20,20 0 0 1 220,54L220,104M200,24L200,10M194,15L206,15', 1.2) + H('M172,104L172,52A28,28 0 0 1 200,24L200,34A20,20 0 0 0 180,54L180,104Z', 'h2')
    for k in range(9):
        w = math.pi * (1 - k / 8)
        t += L(f'M{n(200+20*math.cos(w))},{n(54-20*math.sin(w))}L{n(200+28*math.cos(w))},{n(52-28*math.sin(w))}', .8)
    f += pfad('M172,104L172,52A28,28 0 0 1 228,52L228,104L220,104L220,54A20,20 0 0 0 180,54L180,104Z', '#d8a88a', extra=' fill-opacity=".7"') + pfad('M180,104L180,54A20,20 0 0 1 220,54L220,104Z', '#bcd0d6', extra=' fill-opacity=".6"')
    # Baeumchen
    def baum(x, y, s, farbe):
        z = L('M-3,0C-2,-14 -3,-20 -5,-28M4,0C3,-12 3,-20 6,-28M0,-2L0,-20', .9)
        kr = wolke(0, -44, 23, 21, 14, r, .08, 1.02)
        z += L(kr, 1.1) + H(wolke(6, -38, 15, 14, 10, r, .08), 'h1') + H(wolke(10, -34, 9, 9, 8, r, .08), 'h3')
        for _ in range(26):
            a, q = r.uniform(0, 6.28), r.uniform(0, .9)
            z += L(f'M{n(22*q*math.cos(a)-2)},{n(-44+20*q*math.sin(a))}q2,-3 4,0', .6)
        return drehung(x, y, 0, pfad(wolke(0, -44, 23, 21, 12, r, .1), farbe, extra=' fill-opacity=".62"'), s), drehung(x, y, 0, z, s)
    for x, y, s, c in [(124, 190, 1.05, '#8fae62'), (286, 178, .8, '#a9b86a'), (120, 432, 1, '#7f9f5a')]:
        a, c2 = baum(x, y, s, c)
        f += a
        t += c2
    # Sonnenuhr
    sx, sy = 284, 372
    t += L(f'M{sx-17},{sy}L{sx-12},{sy-42}L{sx+12},{sy-42}L{sx+17},{sy}ZM{sx-21},{sy}L{sx+21},{sy}L{sx+21},{sy+6}L{sx-21},{sy+6}Z', 1.1) + H(f'M{sx+2},{sy}L{sx+2},{sy-42}L{sx+12},{sy-42}L{sx+17},{sy}Z', 'h2') + L(f'M{sx-20},{sy-47}a20,7.4 0 1 0 40,0a20,7.4 0 1 0 -40,0M{sx-15},{sy-47.4}a15,5 0 1 0 30,0a15,5 0 1 0 -30,0M{sx-9},{sy-46}L{sx+8},{sy-64}L{sx+6},{sy-46}Z', 1) + H(f'M{sx-9},{sy-46}L{sx+8},{sy-64}L{sx+6},{sy-46}Z', 'h2')
    for k in range(9):
        w = math.pi * (k / 8)
        t += L(f'M{n(sx+12*math.cos(w))},{n(sy-47.4+4*math.sin(w))}L{n(sx+15*math.cos(w))},{n(sy-47.4+5*math.sin(w))}', .7)
    f += ell(sx, sy - 47, 20, 7.4, '#e6cf98', extra=' fill-opacity=".8"') + poly([(sx - 17, sy), (sx - 12, sy - 42), (sx + 12, sy - 42), (sx + 17, sy)], '#d8cbb0', extra=' fill-opacity=".7"')
    # Wasserbecken
    wx, wy = 132, 512
    t += L(f'M{wx-34},{wy}a34,15 0 1 0 68,0a34,15 0 1 0 -68,0M{wx-28},{wy}a28,11.6 0 1 0 56,0a28,11.6 0 1 0 -56,0', 1.1) + ''.join(L(f'M{wx-20+i*3},{wy-5+i*4}q5,-2.4 10,0t10,0t10,0', .8) for i in range(3)) + H(f'M{wx-34},{wy}q4,18 34,19q30,-1 34,-19q-2,15 -34,15q-32,0 -34,-15Z', 'h2')
    f += ell(wx, wy, 29, 12, '#8fb9c4', extra=' fill-opacity=".8"')
    # offene Stelle: eingefasstes Beet, zur Haelfte
    bx, by = 262, 500
    t += L(f'M{bx},{by}L{bx+50},{by-3}L{bx+52},{by+40}L{bx+1},{by+43}Z', 1.1) + ''.join(L(f'M{bx+4},{by+8+k*9}L{bx+48},{by+5.4+k*9}', .7) + L(f'M{bx+5},{by+10+k*9}L{bx+48},{by+7.4+k*9}', .5) for k in range(4))
    for k in range(4):
        t += drehung(bx + 10 + k * 11, by + 12, 0, L('M0,0q-5,-4 -5,-9M0,0q0,-6 0,-11M0,0q5,-4 5,-9', .8))
    f += poly([(bx, by), (bx + 50, by - 3), (bx + 52, by + 40), (bx + 1, by + 43)], '#b08a62', extra=' fill-opacity=".6"')
    # Stationen als Muenzen mit roemischen Zahlen
    for i, (x, y) in enumerate(st):
        f += ell(x, y, 25, 25, ['#e2b24c', '#f7e0a0', '#f4ead2'][i], extra=' fill-opacity=".95"')
        t += L(f'M{x-25},{y}a25,25 0 1 0 50,0a25,25 0 1 0 -50,0M{x-21.6},{y}a21.6,21.6 0 1 0 43.2,0a21.6,21.6 0 1 0 -43.2,0', 1.1)
        if i == 0:
            for k in range(22):
                w = math.radians(k * 16.4 + 98)
                if k < 11:
                    pass
                t += drehung(x + 17.4 * math.cos(w), y + 17.4 * math.sin(w), math.degrees(w) + 120, pfad('M0,0C-2.4,-3 -2.4,-6 0,-8.4C2.4,-6 2.4,-3 0,0Z', '#7f9f5a', tint, .6))
        if i == 1:
            for k in range(32):
                w = math.radians(k * 11.25)
                t += L(f'M{n(x+28*math.cos(w))},{n(y+28*math.sin(w))}L{n(x+(35 if k%2 else 32)*math.cos(w))},{n(y+(35 if k%2 else 32)*math.sin(w))}', .9)
        if i == 2:
            t += f'<circle cx="{x}" cy="{y}" r="21.6" fill="url(#h1)" opacity=".75"/>'
        t += f'<text x="{x}" y="{y+6.4}" text-anchor="middle" font-family="EB Garamond,Georgia,serif" font-size="19" font-weight="600" fill="{tint}">{["I", "II", "III"][i]}</text>'
    # Schmetterling als Position
    x, y = 190, 384
    sm = 'M0,0C-4,-14 -22,-18 -22,-6C-22,3 -10,5 0,0C-9,3 -15,12 -9,16C-3,19 0,8 0,0C4,-14 22,-18 22,-6C22,3 10,5 0,0C9,3 15,12 9,16C3,19 0,8 0,0Z'
    f += g(pfad(sm, '#e08a3c', extra=' fill-opacity=".9"'), transform=f'translate({x} {y})')
    t += g('<g class="fl">' + L(sm, 1.1) + H('M-22,-6C-22,-18 -8,-15 -3,-6C-9,-9 -15,-9 -17,-4Z', 'h2') + H('M22,-6C22,-18 8,-15 3,-6C9,-9 15,-9 17,-4Z', 'h2') + ell(0, 4, 1.8, 9, tint) + L('M0,-4q-3,-7 -6,-9M0,-4q3,-7 6,-9', .8) + '</g>', transform=f'translate({x} {y})')
    # grosse Pflanzen links und rechts
    def blattpaar(x, y, w, l, b_, c):
        d = f'M0,0C{-b_},{-l*.3:.1f} {-b_*.9:.1f},{-l*.75:.1f} 0,{-l}C{b_*.9:.1f},{-l*.75:.1f} {b_},{-l*.3:.1f} 0,0Z'
        z = L(d, 1) + L(f'M0,0L0,{-l*.94:.1f}', .8) + H(f'M0,0C{b_},{-l*.3:.1f} {b_*.9:.1f},{-l*.75:.1f} 0,{-l}Z', 'h1')
        for k in range(1, 6):
            z += L(f'M0,{-l*k*.15:.1f}Q{b_*.4:.1f},{-l*(k*.15+.1):.1f} {b_*.72*(1-abs(k-3)*.14):.1f},{-l*(k*.15+.12):.1f}M0,{-l*k*.15:.1f}Q{-b_*.4:.1f},{-l*(k*.15+.1):.1f} {-b_*.72*(1-abs(k-3)*.14):.1f},{-l*(k*.15+.12):.1f}', .5)
        return drehung(x, y, w, pfad(d, c, extra=' fill-opacity=".7"')), drehung(x, y, w, z)
    def salbei(x, y, s):
        nonlocal f, t
        ff, tt = '', L('M0,0C-4,-120 6,-260 0,-400M2,0C-2,-120 8,-260 2,-400', .9)
        for k in range(8):
            yy = -20 - k * 38
            for sg in (-1, 1):
                a, c2 = blattpaar(0, yy, sg * (64 - k * 3), 44 - k * 2.4, 11 - k * .5, '#9db08a')
                ff += a
                tt += c2
        for k in range(6):
            yy = -322 - k * 15
            for sg in (-1, 1):
                ff += drehung(0, yy, sg * 50, pfad('M0,0C-5,-6 -5,-13 0,-17C5,-13 5,-6 0,0Z', '#8f80c4', extra=' fill-opacity=".85"'))
                tt += drehung(0, yy, sg * 50, L('M0,0C-5,-6 -5,-13 0,-17C5,-13 5,-6 0,0ZM0,-2L0,-13', .8))
        f += drehung(x, y, 0, ff, s)
        t += drehung(x, y, 0, tt, s)
    def ringelblume(x, y, s):
        nonlocal f, t
        ff, tt = '', L('M0,0C6,-110 -8,-220 0,-330M2,0C8,-110 -6,-220 2,-330M0,-120C18,-170 26,-210 24,-240M0,-70C-16,-110 -26,-150 -24,-186', .9)
        for k in range(7):
            for sg in (-1, 1):
                if (k + sg) % 2:
                    a, c2 = blattpaar(0, -16 - k * 38, sg * (58 - k * 2), 50 - k * 3, 10 - k * .4, '#8fa860')
                    ff += a
                    tt += c2
        for bx_, by_, rr in [(0, -346, 31), (24, -252, 22), (-24, -198, 19)]:
            for q, kk in [(1, 20), (.66, 15), (.36, 9)]:
                for k in range(kk):
                    w = k * 360 / kk + q * 30
                    l = rr * q
                    p_ = f'M0,{-l*.2:.1f}C{-l*.15:.1f},{-l*.5:.1f} {-l*.13:.1f},{-l*.9:.1f} 0,{-l:.1f}C{l*.13:.1f},{-l*.9:.1f} {l*.15:.1f},{-l*.5:.1f} 0,{-l*.2:.1f}Z'
                    ff += drehung(bx_, by_, w, pfad(p_, ['#e8962f', '#f0ad44', '#f6c869'][int(q * 2.9)], extra=' fill-opacity=".85"'))
                    tt += drehung(bx_, by_, w, L(p_, .6) + L(f'M0,{-l*.4:.1f}L0,{-l*.86:.1f}', .4))
            ff += ell(bx_, by_, rr * .24, rr * .24, '#8a5320')
            tt += f'<circle cx="{bx_}" cy="{by_}" r="{rr*.24:.1f}" fill="url(#h2)" stroke="{tint}" stroke-width=".8"/>'
        f += drehung(x, y, 0, ff, s)
        t += drehung(x, y, 0, tt, s)
    salbei(48, 556, 1.02)
    ringelblume(346, 556, 1.1)
    schr = lambda x, y, txt, gr=13, k='italic': f'<text x="{x}" y="{y}" text-anchor="middle" font-family="EB Garamond,Georgia,serif" font-size="{gr}" font-style="{k}" fill="{tint}">{txt}</text>'
    t += schr(48, 578, 'Salbei') + schr(344, 578, 'Ringelblume')
    rand = rect(10, 10, 380, 580, 'none', 0, tint, 1.6) + rect(14, 14, 372, 572, 'none', 0, tint, .7)
    inhalt = '<rect width="400" height="600" fill="#f5e9cf"/>' + g(f, filter='url(#hand)', style='mix-blend-mode:multiply') + g(t + rand, filter='url(#stich)') + '<rect width="400" height="600" filter="url(#pap)" opacity=".6" style="mix-blend-mode:multiply"/>'
    fonts = "@font-face{font-family:'EB Garamond';src:url('../../fonts/eb-garamond-latin-600-normal.woff2') format('woff2');font-weight:600}@font-face{font-family:'EB Garamond';src:url('../../fonts/eb-garamond-latin-500-normal.woff2') format('woff2');font-weight:400}"
    seite('08', 'kraeuterbuch', 'Kräuterbuch, handkolorierter Stich', inhalt, css=fonts + '.fl{animation:fl 1.6s ease-in-out infinite}@keyframes fl{50%{transform:scaleX(.72)}}', grund='#d9c9a6', defs=defs)


if __name__ == '__main__':
    kirchenfenster()
    nachtgarten()
    gouache()
    kraeuterbuch()
