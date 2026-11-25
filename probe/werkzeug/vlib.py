"""Helfer fuer die Stilvarianten der Probe (siehe varianten_*.py). Jede Variante wird eine eigene HTML-Seite mit einem SVG 400 x 600."""
import math
import os
import random
from garten_teile import n, pkt, poly, rect, ell, pfad, wolke, weich, fleck, kurve, kurve_d, bei_y

ZIEL = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'varianten')
os.makedirs(ZIEL, exist_ok=True)


def schlange(punkte):
    """Kurve durch Punkte, an jedem Punkt senkrecht."""
    segs = [punkte[0]]
    for a, b in zip(punkte, punkte[1:]):
        m = (b[1] - a[1]) * .5
        segs += [(a[0], a[1] + m), (b[0], b[1] - m), b]
    return segs


# Der Weg ist in fast allen Varianten gleich: drei Stationen von unten nach oben
WEG = schlange([(200, 640), (200, 600), (262, 470), (132, 325), (246, 180), (200, 60), (200, -30)])
STATIONEN = [(262, 470), (132, 325), (246, 180)]   # geschafft, als Naechstes, noch zu
WP = kurve(WEG, 60)


def abstand(ps, x, y, qy=1.0):
    return min(math.hypot(x - p[0], (y - p[1]) / qy) for p in ps)


def wegabstand(x, y):
    return abstand(WP[::3], x, y)


def streu(rnd, anzahl, frei, abst, x0=0, y0=0, x1=400, y1=600, qy=1.0):
    ps, v = [], 0
    while len(ps) < anzahl and v < 20000:
        v += 1
        x, y = rnd.uniform(x0, x1), rnd.uniform(y0, y1)
        if frei(x, y) and all(math.hypot(x - a, (y - b) / qy) >= abst for a, b in ps):
            ps.append((x, y))
    return ps


def band(segs, breite):
    """Vieleck entlang einer Kurve."""
    ps = kurve(segs, 30)
    l = [(x - dy * breite / 2, y + dx * breite / 2) for x, y, dx, dy in ps]
    r = [(x + dy * breite / 2, y - dx * breite / 2) for x, y, dx, dy in ps]
    return l + r[::-1]


def g(inhalt, **attr):
    a = ''.join(f' {k.replace("_", "-").rstrip("-")}="{v}"' for k, v in attr.items())
    return f'<g{a}>{inhalt}</g>'


def drehung(x, y, w, inhalt, s=1):
    return f'<g transform="translate({n(x)} {n(y)}) rotate({n(w)}){f" scale({s:.2f})" if s != 1 else ""}">{inhalt}</g>'


def misch(a, b, t):
    """Farbe zwischen a und b."""
    f = lambda h: [int(h[i:i + 2], 16) for i in (1, 3, 5)]
    x, y = f(a), f(b)
    return '#' + ''.join(f'{max(0, min(255, round(p + (q - p) * t))):02x}' for p, q in zip(x, y))


def seite(nr, name, titel, svg_inhalt, css='', js='', grund='#222', defs='', w=400, h=600, extra=''):
    html = f'''<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">
<title>{titel}</title>
<style>
html,body{{margin:0;height:100%;background:{grund}}}
body{{display:grid;place-items:center;overflow:hidden}}
svg.bild,canvas.bild{{display:block;width:min(100vw,calc(100vh*{w}/{h}));height:auto;aspect-ratio:{w}/{h}}}
{css}
@media (prefers-reduced-motion:reduce){{*{{animation:none!important;transition:none!important}}}}
</style></head><body>
<svg class="bild" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" role="img" aria-label="{titel}"><defs>{defs}</defs>{svg_inhalt}</svg>
{extra}
{f"<script>{js}</script>" if js else ""}
</body></html>
'''
    pfad_ = os.path.join(ZIEL, f'{nr}-{name}.html')
    open(pfad_, 'w', encoding='utf-8', newline='\n').write(html)
    print(f'{nr}-{name}', len(html.encode()) // 1024, 'KB')


# ---------- Voronoi (fuer Glas und Mosaik) ----------

def halbebene(poly_, ax, ay, bx, by):
    """Teil des Vielecks, der naeher an a als an b liegt."""
    mx, my, dx, dy = (ax + bx) / 2, (ay + by) / 2, bx - ax, by - ay
    s = lambda p: (p[0] - mx) * dx + (p[1] - my) * dy
    aus = []
    for i, p in enumerate(poly_):
        q = poly_[(i + 1) % len(poly_)]
        a, b = s(p), s(q)
        if a <= 0:
            aus.append(p)
        if a * b < 0:
            t = a / (a - b)
            aus.append((p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t))
    return aus


def voronoi(punkte, x0=0, y0=0, x1=400, y1=600, reichweite=90):
    zellen = []
    for i, (ax, ay) in enumerate(punkte):
        z = [(x0, y0), (x1, y0), (x1, y1), (x0, y1)]
        nachbarn = sorted(((math.hypot(ax - bx, ay - by), bx, by) for j, (bx, by) in enumerate(punkte) if j != i and abs(ax - bx) < reichweite and abs(ay - by) < reichweite))
        for d, bx, by in nachbarn[:40]:
            z = halbebene(z, ax, ay, bx, by)
            if not z:
                break
        zellen.append(z)
    return zellen
