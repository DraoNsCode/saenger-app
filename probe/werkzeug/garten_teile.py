"""Farben, Helfer und Bauteile fuer die drei Ansichten der Probe (siehe zeichne.py)."""
import math, random

F = dict(
    wiese='#a9bf79', wiese_d='#8fa75f', wiese_h='#bccf8d', aussen='#c4c58e', aussen_d='#aaab70',
    weg='#e9d8b2', weg_d='#c9b182', weg_h='#f4ead0', kies='#d3bd90',
    stein='#d2c8b5', stein_d='#a89b83', stein_h='#e6dfcf', stein_s='#b9ad97', fuge='#8b7f69',
    dach='#c06c47', dach_d='#95492d', dach_h='#d4885f', dach_s='#a95a39',
    holz='#93643e', holz_d='#5f3c22', holz_h='#b3835a',
    erde='#7d583c', erde_d='#5c3e28', erde_h='#94704f',
    wasser='#84b8c8', wasser_d='#4f8ba1', wasser_h='#c4e1e6', ufer='#7f8c55',
    laub='#6f9d57', laub_d='#456f3d', laub_h='#93bb6e', laub_hh='#b1d188',
    krone='#6f9d58', krone_d='#456f3e', krone_h='#93bb6f', krone_hh='#b1d189',   # wie laub, aber getrennt tauschbar (Jahreszeit)
    kohl='#8fba90', kohl_d='#4f8160', kohl_h='#bcd9b0',
    salat='#a8cb5f', salat_d='#6f9638', salat_h='#cfe494',
    rot='#91648e', rot_d='#5e3f63', rot_h='#b98db3',
    lav='#8d80c0', lav_d='#5d5290', ringel='#eda53a', ringel_d='#bd6f1c', ringel_h='#f9cf7a',
    apfel='#c8483a', apfel_d='#93302a',
    gold='#d4af37', gold_d='#9c7a12', gold_h='#f3dd8c', tinte='#15233f', mantel='#2c4272', mantel_d='#15233f', mantel_h='#46609a',
    stroh='#ecc66b', stroh_d='#b98d2f', stroh_h='#f8e2a3', papier='#fffdf6', band='#b03a35', haut='#e2b48f',
    schatten='#26305a',
)


def n(x):
    s = f'{x:.1f}'
    return s[:-2] if s.endswith('.0') else s


def pkt(ps):
    return ' '.join(f'{n(x)},{n(y)}' for x, y in ps)


def poly(ps, fill, stroke=None, sw=1.2, extra=''):
    s = f' stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round"' if stroke else ''
    return f'<polygon points="{pkt(ps)}" fill="{fill}"{s}{extra}/>'


def rect(x, y, w, h, fill, rx=0, stroke=None, sw=1.2, extra=''):
    s = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ''
    r = f' rx="{n(rx)}"' if rx else ''
    return f'<rect x="{n(x)}" y="{n(y)}" width="{n(w)}" height="{n(h)}"{r} fill="{fill}"{s}{extra}/>'


def ell(cx, cy, rx, ry, fill, stroke=None, sw=1.2, extra=''):
    s = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ''
    return f'<ellipse cx="{n(cx)}" cy="{n(cy)}" rx="{n(rx)}" ry="{n(ry)}" fill="{fill}"{s}{extra}/>'


def pfad(d, fill='none', stroke=None, sw=1.2, extra=''):
    s = f' stroke="{stroke}" stroke-width="{n(sw)}" stroke-linejoin="round" stroke-linecap="round"' if stroke else ''
    return f'<path d="{d}" fill="{fill}"{s}{extra}/>'


def schatten(inhalt, o=.2):
    return f'<g fill="{F["schatten"]}" fill-opacity="{o}">{inhalt}</g>'


def wolke(cx, cy, rx, ry, k, rnd, jit=.06, bauch=1.12):
    """Rand aus Boegen: Baumkronen, Buesche, Salat."""
    ps = []
    ph = rnd.random() * 6.28
    for i in range(k):
        a = ph + 2 * math.pi * i / k
        j = 1 + rnd.uniform(-jit, jit)
        ps.append((cx + rx * j * math.cos(a), cy + ry * j * math.sin(a)))
    d = f'M{n(ps[0][0])},{n(ps[0][1])}'
    for i in range(k):
        a, b = ps[i], ps[(i + 1) % k]
        r = math.dist(a, b) / 2 * bauch
        d += f'A{n(r)},{n(r)} 0 0 1 {n(b[0])},{n(b[1])}'
    return d + 'Z'


def weich(ps, zu=True):
    """Glatte Linie durch Punkte (Catmull-Rom)."""
    k = len(ps)
    d = f'M{n(ps[0][0])},{n(ps[0][1])}'
    rng = range(k if zu else k - 1)
    for i in rng:
        if zu:
            p0, p1, p2, p3 = ps[(i - 1) % k], ps[i], ps[(i + 1) % k], ps[(i + 2) % k]
        else:
            p0, p1, p2, p3 = ps[max(i - 1, 0)], ps[i], ps[i + 1], ps[min(i + 2, k - 1)]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d += f'C{n(c1[0])},{n(c1[1])} {n(c2[0])},{n(c2[1])} {n(p2[0])},{n(p2[1])}'
    return d + ('Z' if zu else '')


def fleck(cx, cy, rx, ry, rnd, k=8, jit=.16):
    ps = []
    for i in range(k):
        a = 2 * math.pi * i / k
        j = 1 + rnd.uniform(-jit, jit)
        ps.append((cx + rx * j * math.cos(a), cy + ry * j * math.sin(a)))
    return weich(ps)


def kurve(segs, schritte=40):
    """segs: [p0, c1, c2, p1, c1, c2, p1, ...] -> Punkte und Tangenten."""
    aus = []
    i = 0
    while i + 3 < len(segs) + 0:
        p0, c1, c2, p1 = segs[i:i + 4]
        for t in range(schritte):
            t /= schritte
            m = 1 - t
            x = m**3 * p0[0] + 3 * m * m * t * c1[0] + 3 * m * t * t * c2[0] + t**3 * p1[0]
            y = m**3 * p0[1] + 3 * m * m * t * c1[1] + 3 * m * t * t * c2[1] + t**3 * p1[1]
            dx = 3 * m * m * (c1[0] - p0[0]) + 6 * m * t * (c2[0] - c1[0]) + 3 * t * t * (p1[0] - c2[0])
            dy = 3 * m * m * (c1[1] - p0[1]) + 6 * m * t * (c2[1] - c1[1]) + 3 * t * t * (p1[1] - c2[1])
            l = math.hypot(dx, dy) or 1
            aus.append((x, y, dx / l, dy / l))
        i += 3
    return aus


def kurve_d(segs):
    d = f'M{n(segs[0][0])},{n(segs[0][1])}'
    for i in range(1, len(segs), 3):
        a, b, c = segs[i:i + 3]
        d += f'C{n(a[0])},{n(a[1])} {n(b[0])},{n(b[1])} {n(c[0])},{n(c[1])}'
    return d


def symbol(id_, inhalt):
    return f'<symbol id="{id_}" overflow="visible">{inhalt}</symbol>'


def setze(id_, x, y, s=1, extra=''):
    t = f'translate({n(x)} {n(y)})' + (f' scale({s:.2f})' if abs(s - 1) > .005 else '')
    return f'<use href="#{id_}" transform="{t}"{extra}/>'


def ebene(name, titel, inhalt):
    # Zustaende, die im Rohbild (Inkscape) ausgeblendet starten; die Seite schaltet sie ueber CSS
    aus = ' display="none"' if name in ('beet-leer', 'station-geschafft') else ''
    return f'\n<g id="{{P}}{name}" class="g-{name}"{aus} inkscape:groupmode="layer" inkscape:label="{titel}">\n{inhalt}\n</g>'


def datei(pfad_, praefix, titel, beschreibung, defs, ebenen, w=400, h=600):
    text = (
        f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" '
        f'viewBox="0 0 {w} {h}" role="img" aria-label="{titel}">\n'
        f'<!-- {beschreibung} -->\n<defs>\n' + '\n'.join(defs) + '\n</defs>' + ''.join(ebenen) + '\n</svg>\n'
    )
    text = text.replace('{P}', praefix).replace('href="#', f'href="#{praefix}').replace('<symbol id="', f'<symbol id="{praefix}')
    text = text.replace('url(#', f'url(#{praefix}').replace('<clipPath id="', f'<clipPath id="{praefix}').replace('<radialGradient id="', f'<radialGradient id="{praefix}').replace('<linearGradient id="', f'<linearGradient id="{praefix}')
    open(pfad_, 'w', encoding='utf-8', newline='\n').write(text)
    return len(text)


# ---------- Bauteile in Seitenansicht (fuer "schraeg" und "isometrisch"), Fusspunkt 0,0 ----------

def kohl_seite(g, d, h):
    return (
        ell(0, -1, 10.5, 3.4, F['schatten'], extra=' fill-opacity=".25"')
        + pfad('M-1,0C-10,1 -13,-5 -11,-10C-7,-11 -3,-7 -1,0Z', g, d, 1)
        + pfad('M1,0C10,1 13,-5 11,-10C7,-11 3,-7 1,0Z', g, d, 1)
        + pfad('M0,-1C-8,-1 -9,-8 -6,-12C-3,-15 3,-15 6,-12C9,-8 8,-1 0,-1Z', h, d, 1)
        + pfad('M0,-2C0,-6 0,-9 0,-12M0,-5C-2,-7 -4,-8 -5,-9M0,-5C2,-7 4,-8 5,-9', 'none', d, .8)
    )


def salat_seite():
    g, d, h = F['salat'], F['salat_d'], F['salat_h']
    return (
        ell(0, -1, 9.5, 3, F['schatten'], extra=' fill-opacity=".25"')
        + pfad('M0,0C-6,1 -9,-1 -10,-5A3,3 0 0 1 -8,-9A3.4,3.4 0 0 1 -3,-11A3.6,3.6 0 0 1 3,-11A3.4,3.4 0 0 1 8,-9A3,3 0 0 1 10,-5C9,-1 6,1 0,0Z', g, d, 1)
        + pfad('M0,-1C-4,-1 -5,-4 -5,-6A2.6,2.6 0 0 1 -1,-8A2.6,2.6 0 0 1 5,-6C5,-4 4,-1 0,-1Z', h, d, .8)
    )


def lauch_seite():
    g, d, h = F['laub'], F['laub_d'], F['laub_h']
    return (
        ell(0, 0, 6, 2.2, F['schatten'], extra=' fill-opacity=".25"')
        + pfad('M-1.5,0C-2,-9 -6,-14 -10,-17C-7,-12 -4,-7 -1.5,0Z', g, d, .9)
        + pfad('M1.5,0C2,-9 6,-14 10,-17C7,-12 4,-7 1.5,0Z', g, d, .9)
        + pfad('M-1.6,0C-2,-10 -2,-17 0,-23C2,-17 2,-10 1.6,0Z', h, d, .9)
        + pfad('M-1.7,0L-1.6,-5L1.6,-5L1.7,0Z', '#f2efdd', d, .7)
    )


def ringel_seite():
    g, d = F['laub'], F['laub_d']
    def bl(x, y, r):
        return (f'<g transform="translate({x} {y})">' + pfad(wolke(0, 0, r, r * .78, 9, random.Random(3), 0, 1.0), F['ringel'], F['ringel_d'], .9)
                + ell(0, 0, r * .42, r * .34, F['ringel_d']) + '</g>')
    return (
        ell(0, -1, 9, 2.8, F['schatten'], extra=' fill-opacity=".25"')
        + pfad('M0,0C-8,0 -10,-5 -8,-8C-4,-8 -1,-5 0,0C1,-5 4,-8 8,-8C10,-5 8,0 0,0Z', g, d, .9)
        + pfad('M0,0L-5,-12M0,0L5,-11M0,0L0,-16', 'none', d, 1.2)
        + bl(-5.5, -12, 4.6) + bl(5.5, -11, 4.6) + bl(0, -17, 5)
    )


def lavendel_seite():
    d = F['laub_d']
    aus = ell(2, 0, 15, 4.4, F['schatten'], extra=' fill-opacity=".25"')
    aus += pfad('M0,1C-12,1 -14,-6 -11,-10C-4,-12 4,-12 11,-10C14,-6 12,1 0,1Z', F['laub'], d, 1)
    for x, y in [(-11, -19), (-7, -23), (-2.5, -25), (3, -24), (7.5, -22), (11.5, -18), (-5, -18), (5, -17), (0, -20)]:
        aus += pfad(f'M{n(x*.5)},-6L{x},{y}', 'none', d, .9)
        aus += ell(x, y - 1, 2.1, 4.6, F['lav'], F['lav_d'], .7)
    return aus


def baum_seite(rnd, aepfel=True, birne=False):
    aus = ''
    aus += pfad('M-6,1C-5,-10 -5,-18 -9,-30L9,-30C5,-18 5,-10 7,1C3,-1 -2,-1 -6,1Z', F['holz'], F['holz_d'], 1.2)
    aus += pfad('M2,-2C1,-10 2,-18 4,-28', 'none', F['holz_d'], 1)
    aus += pfad(wolke(0, -62, 42, 40, 13, rnd), F['krone'], F['krone_d'], 1.4)
    aus += pfad(wolke(8, -46, 30, 20, 9, rnd), F['krone_d'], extra=' fill-opacity=".35"')
    aus += pfad(wolke(-9, -74, 27, 22, 10, rnd), F['krone_h'])
    aus += pfad(wolke(-14, -82, 15, 11, 8, rnd), F['krone_hh'])
    if aepfel:
        for x, y in [(-24, -52), (18, -78), (24, -54), (-4, -46), (4, -64), (-30, -70), (12, -38)]:
            aus += ell(x, y, 4, 4, F['apfel'], F['apfel_d'], .9) + ell(x - 1.2, y - 1.4, 1.2, 1, '#eb8f78')
    return aus


def busch_seite(rnd, s=1):
    return (
        pfad(wolke(0, -11, 18, 13, 10, rnd), F['laub'], F['laub_d'], 1.2)
        + pfad(wolke(-4, -15, 11, 7, 8, rnd), F['laub_h'])
    )


def figur_seite():
    """Von hinten, auf dem Weg nach oben: Strohhut, Mantel, Liedermappe."""
    return (
        pfad('M-5,-2L-5.5,1.5L-1,1.5L-1,-2ZM5,-2L5.5,1.5L1,1.5L1,-2Z', F['holz_d'], F['holz_d'], .6)
        + pfad('M0,-33C-7,-33 -9,-29 -10,-22C-11,-14 -12,-7 -12.5,-2C-8,0 8,0 12.5,-2C12,-7 11,-14 10,-22C9,-29 7,-33 0,-33Z', F['mantel'], F['mantel_d'], 1.3)
        + pfad('M0,-31C-5,-30 -7,-26 -8,-20C-9,-13 -9.5,-8 -10,-4C-7,-3 -5,-3 -4,-3C-5,-12 -4,-24 0,-31Z', F['mantel_h'], extra=' fill-opacity=".75"')
        + pfad('M0,-30C1,-20 1,-10 .5,-2', 'none', F['mantel_d'], 1)
        + f'<g transform="rotate(8 11 -16)">' + rect(7, -22, 9, 12, F['gold'], 1, F['gold_d'], 1) + pfad('M9,-18L14,-18M9,-15L14,-15', 'none', F['gold_d'], .8) + '</g>'
        + pfad('M8,-27C12,-24 13,-18 11,-13', 'none', F['mantel_d'], 4.6) + pfad('M8,-27C12,-24 13,-18 11,-13', 'none', F['mantel'], 2.6)
        + ell(0, -35, 5.6, 5, F['haut'], '#a9774f', .9)
        + ell(0, -38, 14.5, 5.8, F['stroh'], F['stroh_d'], 1.2)
        + pfad('M-7.6,-39C-7.6,-47 -4,-49 0,-49C4,-49 7.6,-47 7.6,-39C4,-37 -4,-37 -7.6,-39Z', F['stroh_h'], F['stroh_d'], 1.1)
        + pfad('M-7.8,-40.4C-4,-38 4,-38 7.8,-40.4L7.6,-37.8C4,-35.8 -4,-35.8 -7.6,-37.8Z', F['band'])
        + pfad('M-11,-38.6C-7,-41 7,-41 11,-38.6', 'none', F['stroh_d'], .6)
    )


def laterne_seite():
    return (
        ell(1, 0, 6, 2, F['schatten'], extra=' fill-opacity=".3"')
        + pfad('M0,0L0,-20', 'none', F['holz_d'], 3) + pfad('M0,-20L0,-31L8,-31', 'none', F['holz_d'], 2.4)
        + ell(8, -21, 13, 13, 'url(#schein)')
        + pfad('M4.6,-27L11.4,-27L12.4,-16L3.6,-16Z', F['gold_h'], F['tinte'], 1.2)
        + pfad('M8,-25.5C10,-22 10,-19.5 8,-18.5C6,-19.5 6,-22 8,-25.5Z', F['ringel'])
        + pfad('M3.6,-27L8,-31.4L12.4,-27Z', F['tinte']) + pfad('M3,-15.6L13,-15.6', 'none', F['tinte'], 1.8)
    )


def spaten_seite():
    return (
        ell(2, 1, 6, 2, F['schatten'], extra=' fill-opacity=".35"')
        + '<g transform="rotate(9)">'
        + pfad('M-4.4,-10L4.4,-10L4,-1C2,2 -2,2 -4,-1Z', '#9aa3ab', '#5d666f', 1)
        + pfad('M0,-10L0,-32', 'none', F['holz_d'], 3.4) + pfad('M0,-10L0,-32', 'none', F['holz_h'], 1.6)
        + pfad('M-5,-32L5,-32', 'none', F['holz_d'], 3.6)
        + '</g>'
    )


def schild(x, y, text, w, spitze=(0, 12)):
    """Namensschild einer Station als Sprechblase; spitze = Punkt relativ zur Mitte der Unterkante."""
    h, r = 30, 9
    l, o, re_, u = x - w / 2, y - h / 2, x + w / 2, y + h / 2
    sx, sy = x + spitze[0], u + spitze[1]
    fuss = max(l + r + 10, min(re_ - r - 10, sx))
    d = (f'M{n(l+r)},{n(o)}L{n(re_-r)},{n(o)}Q{n(re_)},{n(o)} {n(re_)},{n(o+r)}L{n(re_)},{n(u-r)}Q{n(re_)},{n(u)} {n(re_-r)},{n(u)}'
         f'L{n(fuss+8)},{n(u)}L{n(sx)},{n(sy)}L{n(fuss-8)},{n(u)}L{n(l+r)},{n(u)}Q{n(l)},{n(u)} {n(l)},{n(u-r)}L{n(l)},{n(o+r)}Q{n(l)},{n(o)} {n(l+r)},{n(o)}Z')
    return (
        '<g>' + f'<path transform="translate(2 3)" d="{d}" fill="{F["schatten"]}" fill-opacity=".22"/>'
        + pfad(d, F['papier'], F['gold_d'], 1.3)
        + f'<text x="{n(x)}" y="{n(y+5.2)}" text-anchor="middle" font-family="Atkinson Hyperlegible, sans-serif" font-weight="700" font-size="15" fill="{F["tinte"]}">{text}</text></g>'
    )


def bei_y(punkte, y):
    """Punkt der Wegmitte in dieser Bildhoehe."""
    return min(punkte, key=lambda p: abs(p[1] - y))[:2]


def zug_kurve(ps, r):
    """Rechtwinkliger Zug mit runden Ecken als Folge von Bezier-Stuecken."""
    segs = [ps[0]]
    def hin(a, b, t):
        l = math.dist(a, b)
        t = min(t, l / 2)
        return (a[0] + (b[0] - a[0]) * t / l, a[1] + (b[1] - a[1]) * t / l)
    def gerade(a, b):
        segs.extend([(a[0] + (b[0] - a[0]) / 3, a[1] + (b[1] - a[1]) / 3), (a[0] + (b[0] - a[0]) * 2 / 3, a[1] + (b[1] - a[1]) * 2 / 3), b])
    for i in range(1, len(ps) - 1):
        a, c, b = ps[i - 1], ps[i], ps[i + 1]
        p, q = hin(c, a, r), hin(c, b, r)
        gerade(segs[-1], p)
        k = .5523
        segs.extend([(p[0] + (c[0] - p[0]) * k, p[1] + (c[1] - p[1]) * k), (q[0] + (c[0] - q[0]) * k, q[1] + (c[1] - q[1]) * k), q])
    gerade(segs[-1], ps[-1])
    return segs


def rosette(r, qu=1.0):
    """Bluete als Zeichen fuer eine geschaffte Station."""
    aus = f'<g transform="scale(1 {qu:.3f})">'
    for i in range(6):
        aus += f'<g transform="rotate({i*60})">' + pfad(f'M0,0C{n(-r*.42)},{n(-r*.4)} {n(-r*.34)},{n(-r*.95)} 0,{n(-r)}C{n(r*.34)},{n(-r*.95)} {n(r*.42)},{n(-r*.4)} 0,0Z', F['gold'], F['gold_d'], 1) + '</g>'
    aus += f'<circle r="{n(r*.27)}" fill="{F["gold_h"]}" stroke="{F["gold_d"]}" stroke-width="1"/></g>'
    return aus
