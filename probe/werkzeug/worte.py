"""Zeichnet den beschriebenen Moment aus GARTEN-WORTE.md (Vergleich zweier Entwuerfe): python probe/werkzeug/worte.py

Ergebnis in probe/bilder/worte/: moment-<stand>.svg, je ein Bild des Ausschnitts (Bereich 4 Rand, Bereich 5, Bereich 6 Rand).
Stand: verborgen, aktuell (2 von 4), angelegt, ausbau1, ausbau2, ausbau3. Nutzt die Bauteile der Probe mit der Palette aus dem Text.
"""
import math
import os
import random
import re
import garten as G
import wandel as V
from garten_teile import *
from garten import bluete, blumen, buchs, farn, giesskanne, hohes_gras, schmetterling, wildblumen, schilf

ZIEL = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'bilder', 'worte')

# Palette aus dem Text: Salbei und Moos, warmes Ocker, Terrakotta, Sandstein, Kalkweiss, Lavendel, Altrosa, Schatten warmes Braungrau
F.update(
    wiese='#b6c398', wiese_d='#9aab7c', wiese_h='#cad4ae', weg='#dccaa6', weg_d='#bda880', weg_h='#e9dcbf', kies='#c8b48b',
    stein='#d0bf9c', stein_d='#a5926c', stein_h='#e4d7ba', stein_s='#b9a780', fuge='#8d7b5a', dach='#b9714f', dach_d='#8f5237', dach_h='#cd8d6b',
    holz='#9d7f5d', holz_d='#6c543b', holz_h='#bb9f7c', erde='#735843', erde_d='#54402f', erde_h='#8b6f56',
    wasser='#9bb5bb', wasser_d='#748f98', wasser_h='#dbe7e6', ufer='#a3a783',
    laub='#7c9062', laub_d='#566a42', laub_h='#9bad7b', laub_hh='#b8c598', krone='#8a9c6e', krone_d='#5f7248', krone_h='#a8b888', krone_hh='#c2cda4',
    lav='#9d92bd', lav_d='#6f6592', rose='#c98a90', rose_d='#96606a', rose_h='#e0b4b5', kohl='#9db79a', kohl_d='#617f62', kohl_h='#c3d3b8',
    ringel='#dba651', ringel_d='#a97a30', schatten='#5b4a3c', zink='#b3ada2', zink_d='#776f63', zink_h='#d5d0c6', blatt='#8fa763', kalk='#f7f3ea', braun='#4d4238',
    terra='#bb7351', terra_d='#93563a', gelbgruen='#c3cb7c', gelbgruen_d='#8c9650', sandstein='#e6d6b4', sandstein_d='#b59f74',
)


# ---------- Bauteile ----------

def frauenmantel(gross=1.0, blueht=False):
    a = ell(0, 0, 12 * gross, 3.4 * gross, F['schatten'], extra=' fill-opacity=".2"')
    for x, y, r in [(-6, -3, 6), (6, -3, 6), (0, -6, 6.6), (-2, -2, 5), (4, -6, 5)]:
        a += pfad(wolke(x * gross, y * gross, r * gross, r * .72 * gross, 7, random.Random(int(x * 3 + y + 40)), .08), F['gelbgruen'], F['gelbgruen_d'], 1)
    if blueht:
        for x, y in [(-7, -8), (-2, -12), (4, -11), (8, -7), (0, -8)]:
            a += ell(x * gross, y * gross, 2.8 * gross, 2.2 * gross, '#e4e38c', F['gelbgruen_d'], .7)
    return a


def glocke(gross=1.0, blueht=True, anzahl=3):
    a = ell(0, 0, 9 * gross, 2.8 * gross, F['schatten'], extra=' fill-opacity=".18"')
    a += pfad(f'M{n(-8*gross)},0C{n(-8*gross)},{n(-5*gross)} {n(-2*gross)},{n(-6*gross)} 0,{n(-2*gross)}C{n(2*gross)},{n(-6*gross)} {n(8*gross)},{n(-5*gross)} {n(8*gross)},0Z', F['laub'], F['laub_d'], .9)
    for i in range(anzahl):
        x = (-6 + 12 * i / max(1, anzahl - 1)) * gross
        h = (9 + (i % 2) * 4) * gross
        a += pfad(f'M{n(x*.4)},{n(-2*gross)}L{n(x)},{n(-h)}', 'none', F['laub_d'], 1.1)
        if blueht:
            a += pfad(f'M{n(x-3.2*gross)},{n(-h+2*gross)}C{n(x-3.4*gross)},{n(-h-5*gross)} {n(x+3.4*gross)},{n(-h-5*gross)} {n(x+3.2*gross)},{n(-h+2*gross)}L{n(x+1.2*gross)},{n(-h+.6*gross)}L{n(x)},{n(-h+2.4*gross)}L{n(x-1.2*gross)},{n(-h+.6*gross)}Z', F['lav'], F['lav_d'], .9)
    return a


def funkie(gross=1.0):
    a = ell(0, 0, 14 * gross, 4 * gross, F['schatten'], extra=' fill-opacity=".2"')
    for w in (-78, 78, -50, 50, -22, 22, 0):
        a += f'<g transform="rotate({w}) scale({gross:.2f})">' + pfad('M0,1C-7,-4 -6,-14 0,-19C6,-14 7,-4 0,1Z', F['kohl'], F['kohl_d'], 1) + pfad('M0,-2L0,-15', 'none', F['kohl_h'], 1.3) + '</g>'
    return a


def schwertlilie(blueht=True):
    a = ell(0, 0, 8, 2.4, F['schatten'], extra=' fill-opacity=".2"')
    for x, h in [(-5, 24), (-2, 30), (3, 28), (6, 22)]:
        a += pfad(f'M{n(x*.4)},0Q{n(x*.6)},{n(-h*.6)} {n(x*1.3)},{-h}Q{n(x*.9+2)},{n(-h*.5)} {n(x*.4+2)},0Z', F['laub'], F['laub_d'], .9)
    if not blueht:
        return a
    a += pfad('M0,0L0,-36', 'none', F['laub_d'], 1.4)
    return a + pfad('M0,-35C-8,-36 -9,-29 -6,-26C-4,-29 -2,-31 0,-32C2,-31 4,-29 6,-26C9,-29 8,-36 0,-35Z', F['lav'], F['lav_d'], 1) + pfad('M0,-34C-5,-38 -4,-45 0,-47C4,-45 5,-38 0,-34Z', '#b4aad0', F['lav_d'], 1) + ell(0, -33, 1.8, 1.6, '#e6c35c')


def kopfweide(voll=1.0):
    rnd = random.Random(7)
    a = pfad('M-11,2C-9,-12 -9,-24 -13,-42C-6,-48 7,-48 13,-42C9,-24 9,-12 12,2C5,-1 -5,-1 -11,2Z', F['holz'], F['holz_d'], 1.5) + pfad('M-4,-2C-3,-14 -5,-26 -6,-40M4,-3C3,-16 5,-26 5,-40', 'none', F['holz_d'], 1.1)
    a += pfad(wolke(0, -44, 17, 9, 9, rnd, .08), F['holz'], F['holz_d'], 1.4)
    for i in range(15):
        w = -78 + i * 11.2
        l = (46 + 10 * math.cos(math.radians(w))) * voll * rnd.uniform(.9, 1.08)
        x, y = l * math.sin(math.radians(w)), -l * math.cos(math.radians(w))
        a += pfad(f'M0,-46Q{n(x*.45)},{n(-46+y*.75)} {n(x)},{n(-46+y)}', 'none', F['laub_d'], 1.5)
        for t in (.35, .5, .65, .8, .95):
            px, py = x * t, -46 + y * t * (1.2 - .2 * t)
            a += f'<g transform="translate({n(px)} {n(py)}) rotate({n(w+rnd.uniform(-40, 40))})">' + pfad('M0,0C-3.4,-4 -2.6,-11 0,-14C2.6,-11 3.4,-4 0,0Z', rnd.choice([F['krone'], F['krone_h'], F['krone_h'], F['krone_hh']]), F['krone_d'], .8) + '</g>'
    return a


def schubkarre_erde():
    a = ell(0, 1, 32, 7, F['schatten'], extra=' fill-opacity=".22"') + pfad('M14,-12L20,0M-2,-12L2,0', 'none', F['holz_d'], 3)
    a += pfad('M-22,-24C-14,-36 10,-37 17,-24Z', F['erde'], F['erde_d'], 1.2) + ell(-4, -29, 4, 2, F['erde_h']) + ell(6, -27, 3, 1.6, F['erde_h'])
    a += poly([(-24, -24), (18, -24), (14, -9), (-16, -9)], F['holz'], F['holz_d'], 1.4) + pfad('M-21,-17L16,-17', 'none', F['holz_d'], 1)
    a += pfad('M12,-12L38,-19', 'none', F['holz_d'], 4.4) + pfad('M12,-12L38,-19', 'none', F['holz_h'], 2.2) + pfad('M-18,-10L-26,-6', 'none', F['holz_d'], 3.6)
    return a + ell(-27, -7, 8, 8, 'none', F['holz_d'], 3.6) + ell(-27, -7, 8, 8, 'none', F['holz_h'], 1.5) + pfad('M-27,-14L-27,0M-34,-7L-20,-7', 'none', F['holz_d'], 1.4)


def korb_setzlinge():
    a = ell(1, 0, 19, 4.6, F['schatten'], extra=' fill-opacity=".22"') + pfad('M-12,-12C-11,-29 11,-29 12,-12', 'none', F['holz_d'], 2.4)
    for x in (-9, 0, 9):
        a += poly([(x - 4.4, -17), (x + 4.4, -17), (x + 3.2, -9), (x - 3.2, -9)], F['terra'], F['terra_d'], 1) + pfad(f'M{x},-17l0,-5c-5,-1 -6,-5 -5,-7c4,0 6,3 5,7c0,-4 2,-7 6,-7c1,3 -2,6 -6,7', F['laub_h'], F['laub_d'], 1)
    a += pfad('M-16,-12L16,-12L12,0C7,1.8 -7,1.8 -12,0Z', '#c9a36c', '#8a6636', 1.3)
    return a + pfad('M-15,-8L15,-8M-13.6,-4L13.6,-4M-8,-12L-6,0M0,-12L0,1M8,-12L6,0', 'none', '#8a6636', .9)


def spaten():
    return ell(2, 1, 6, 2, F['schatten'], extra=' fill-opacity=".3"') + '<g transform="rotate(16)">' + pfad('M-4.4,-10L4.4,-10L4,-1C2,2 -2,2 -4,-1Z', F['zink'], F['zink_d'], 1) + pfad('M0,-10L0,-36', 'none', F['holz_d'], 3.6) + pfad('M0,-10L0,-36', 'none', F['holz_h'], 1.7) + pfad('M-5,-36L5,-36', 'none', F['holz_d'], 3.6) + '</g>'


def bank(stein=False):
    if stein:
        return ell(0, 2, 28, 6, F['schatten'], extra=' fill-opacity=".2"') + rect(-21, -13, 8, 14, F['stein_s'], 1, F['stein_d'], 1.2) + rect(13, -13, 8, 14, F['stein_s'], 1, F['stein_d'], 1.2) + rect(-26, -19, 52, 8, F['stein_h'], 2, F['stein_d'], 1.3)
    a = ell(0, 2, 30, 6, F['schatten'], extra=' fill-opacity=".22"') + pfad('M-22,-13L-22,2M22,-13L22,2M-22,-32L-22,-13M22,-32L22,-13', 'none', F['holz_d'], 4)
    for y in (-31, -24):
        a += rect(-27, y, 54, 5, F['holz_h'], 1.5, F['holz_d'], 1.1)
    return a + rect(-28, -15, 56, 6, F['holz_h'], 1.5, F['holz_d'], 1.2)


def rosenbogen():
    a = pfad('M-24,2L-24,-40C-24,-66 24,-66 24,-40L24,2', 'none', F['holz_d'], 5) + pfad('M-24,2L-24,-40C-24,-66 24,-66 24,-40L24,2', 'none', F['holz_h'], 2.4)
    rnd = random.Random(5)
    for i in range(17):
        t = i / 16
        x, y = -24 * math.cos(math.pi * t) * -1 if False else -24 * math.cos(math.pi * (1 - t)) * -1, -40 - 20 * math.sin(math.pi * t)
        a += pfad(wolke(-x, y, 6.4, 5.4, 7, rnd, .08), rnd.choice([F['laub'], F['laub_h']]), F['laub_d'], .9)
    for s in (-1, 1):
        for k in range(5):
            a += pfad(wolke(s * 24, -6 - k * 8, 5.6, 5, 7, rnd, .08), rnd.choice([F['laub'], F['laub_h']]), F['laub_d'], .9)
    for x, y in [(-24, -14), (-25, -32), (-17, -52), (-3, -61), (12, -57), (23, -42), (25, -24), (24, -8)]:
        a += ell(x, y, 4.4, 4, F['rose'], F['rose_d'], 1) + ell(x - 1.2, y - 1.3, 1.6, 1.2, F['rose_h'])
    return a


def pflock(x, y, h=15):
    return pfad(f'M{n(x)},{n(y)}l0,{-h}', 'none', F['holz_d'], 4.4) + pfad(f'M{n(x)},{n(y)}l0,{-h}', 'none', '#e2cfa6', 2.5)


def schnur(ps, zu=True, h=12):
    d = 'M' + 'L'.join(f'{n(x)},{n(y-h)}' for x, y in ps) + ('Z' if zu else '')
    return pfad(d, 'none', '#8d7657', 2.4) + pfad(d, 'none', '#f4ead0', 1.4) + ''.join(pflock(x, y) for x, y in sorted(ps, key=lambda p: p[1]))


def kraut_blueh(gross, farbe, rand):
    a = ell(0, 0, 12 * gross, 3.4 * gross, F['schatten'], extra=' fill-opacity=".2"') + pfad(wolke(0, -8 * gross, 11 * gross, 9 * gross, 9, random.Random(3), .06), F['laub_h'], F['laub_d'], 1.1)
    for x, y in [(-8, -15), (-3, -20), (3, -21), (8, -16), (0, -14)]:
        a += pfad(f'M{n(x*.5*gross)},{n(-8*gross)}L{n(x*gross)},{n(y*gross)}', 'none', F['laub_d'], .9) + ell(x * gross, (y - 2) * gross, 1.9 * gross, 4.4 * gross, farbe, rand, .7)
    return a


def feldsteinmauer(y0, hoch, rnd, luecke=(166, 234)):
    """Trockenmauer, Vorderseite zum Betrachter, oben Grasbueschel."""
    a = ''
    for x0, x1 in ((-6, luecke[0]), (luecke[1], 406)):
        a += rect(x0, y0, x1 - x0, hoch, F['fuge'])
        reihen = 3
        for r in range(reihen):
            x = x0 - rnd.uniform(0, 10)
            while x < x1:
                w = rnd.uniform(15, 30)
                xa, xb = max(x, x0), min(x + w, x1)
                if xb - xa > 4:
                    h = hoch / reihen
                    a += pfad(fleck((xa + xb) / 2, y0 + (r + .5) * h, (xb - xa) / 2 * .97, h * .5, rnd, 8, .07), rnd.choice([F['stein'], F['stein_h'], F['stein_s'], F['stein']]), F['stein_d'], 1)
                x += w
    for _ in range(13):
        x = rnd.uniform(6, 394)
        if luecke[0] - 14 < x < luecke[1] + 14:
            continue
        a += f'<g transform="translate({n(x)} {n(y0+3)})">' + pfad('M-5,0C-4,-4 -6,-8 -7,-10M0,0C0,-5 0,-9 1,-13M5,0C4,-4 6,-7 8,-9', 'none', rnd.choice([F['wiese_d'], F['laub'], F['laub_h']]), 1.7) + '</g>'
    return a


def stufen(y0, hoch):
    a = ''
    for i in range(3):
        y, b = y0 + hoch * i / 3, 46 + i * 7
        a += rect(200 - b / 2, y, b, hoch / 3 + 1.5, F['stein_s'], 2, F['stein_d'], 1.2) + rect(200 - b / 2, y, b, hoch / 3 * .5, F['stein_h'], 2, F['stein_d'], 1)
    return a


def lattentor(y, offen):
    """Steht auf der Mauerkrone, Fuss bei y."""
    a = ''
    for x in (170, 230):
        a += rect(x - 4, y - 40, 8, 44, F['holz'], 2, F['holz_d'], 1.4) + pfad(f'M{x-1},{y-38}L{x-1},{y}', 'none', F['holz_h'], 1.8)
    if offen:
        # rechter Fluegel geschlossen an der Seite, linker schraeg nach innen
        for k in range(4):
            x = 174 + k * 5
            a += pfad(f'M{x},{y-2-k*4}L{x},{y-32-k*4}', 'none', F['holz_d'], 4.4) + pfad(f'M{x},{y-2-k*4}L{x},{y-32-k*4}', 'none', F['holz_h'], 2.4)
        a += pfad(f'M173,{y-9}L191,{y-21}M173,{y-25}L191,{y-37}', 'none', F['holz_d'], 3)
        for k in range(4):
            x = 226 - k * 5
            a += pfad(f'M{x},{y-2-k*4}L{x},{y-32-k*4}', 'none', F['holz_d'], 4.4) + pfad(f'M{x},{y-2-k*4}L{x},{y-32-k*4}', 'none', F['holz_h'], 2.4)
        return a + pfad(f'M227,{y-9}L209,{y-21}M227,{y-25}L209,{y-37}', 'none', F['holz_d'], 3)
    for k in range(8):
        x = 177 + k * 6.6
        h = 30 + 5 * math.sin(math.pi * (k + .5) / 8)
        a += pfad(f'M{n(x)},{y}L{n(x)},{n(y-h)}', 'none', F['holz_d'], 5) + pfad(f'M{n(x)},{y}L{n(x)},{n(y-h)}', 'none', F['holz_h'], 3)
    a += pfad(f'M172,{y-9}L228,{y-9}M172,{y-25}L228,{y-25}', 'none', F['holz_d'], 3.6) + pfad(f'M172,{y-9}L228,{y-9}M172,{y-25}L228,{y-25}', 'none', F['holz'], 1.8)
    return a + rect(192, y - 20, 18, 5, F['holz_d'], 1.5)


def grasbueschel(x, y, farbe, s=1):
    return f'<g transform="translate({n(x)} {n(y)}) scale({s:.2f})">' + pfad('M-5,0C-4,-3 -5,-6 -6,-8M0,0C0,-4 0,-7 1,-10M5,0C4,-3 6,-5 7,-7', 'none', farbe, 1.5) + '</g>'


def margerite(x, y, s=1):
    return f'<g transform="translate({n(x)} {n(y)}) scale({s:.2f})">' + pfad('M0,0L0,-9', 'none', F['laub_d'], 1.1) + bluete(0, -11, 5, '#fffaf0', '#c9b98e', F['ringel']) + '</g>'


# ---------- Flaechen ----------

BACH = [(420, 128), (330, 138), (300, 178), (206, 194), (112, 210), (82, 262), (-20, 268)]
WEG_UNTEN = [(200, 396), (200, 350), (152, 330), (158, 262)]
WEG_OBEN = [(246, 146), (262, 104), (200, 74), (200, -8)]
STEINE_T = [0.06, .22, .56, .8, .96]   # eng, weit, mittel, eng


def punkt(segs, t):
    p0, c1, c2, p1 = segs
    m = 1 - t
    return (m**3 * p0[0] + 3 * m * m * t * c1[0] + 3 * m * t * t * c2[0] + t**3 * p1[0], m**3 * p0[1] + 3 * m * m * t * c1[1] + 3 * m * t * t * c2[1] + t**3 * p1[1])


def weg_kies(segs, rnd):
    d = kurve_d(segs)
    a = pfad(d, 'none', F['wiese_d'], 48, ' stroke-opacity=".6"') + pfad(d, 'none', F['terra_d'], 44) + pfad(d, 'none', F['terra'], 42, ' stroke-dasharray="9 2.4" style="stroke-linecap:butt"') + pfad(d, 'none', F['weg_d'], 33) + pfad(d, 'none', F['weg'], 31) + pfad(d, 'none', F['weg_h'], 15, ' stroke-opacity=".5"')
    pk = kurve(segs, 60)
    for _ in range(46):
        x, y, dx, dy = rnd.choice(pk)
        q = rnd.uniform(-13, 13)
        a += ell(x - dy * q, y + dx * q, rnd.uniform(1, 1.9), rnd.uniform(.7, 1.3), rnd.choice([F['kies'], F['weg_h'], F['kies']]))
    return a


def trampelpfad(segs, rnd, pfloecke=True):
    d = kurve_d(segs)
    a = pfad(d, 'none', F['wiese_d'], 19, ' stroke-opacity=".45"') + pfad(d, 'none', '#c9c39a', 14) + pfad(d, 'none', '#d8cfa8', 6, ' stroke-opacity=".7"')
    pk = kurve(segs, 30)
    for _ in range(12):
        x, y, dx, dy = rnd.choice(pk)
        q = rnd.choice([-8, 8, -7, 7])
        a += grasbueschel(x - dy * q, y + dx * q, F['wiese_d'], .8)
    return a


def saeume(segs, schritte=(4, 13, 22)):
    pk = kurve(segs, 30)
    aus = []
    for i in schritte:
        if i < len(pk):
            x, y, dx, dy = pk[i]
            for s in (-1, 1):
                aus.append((y + s * dx * 15, pflock(x - s * dy * 15, y + s * dx * 15, 13)))
    return aus


def niere(ps):
    return weich(ps)


BEET_LU = [(34, 330), (56, 294), (104, 300), (128, 322), (124, 356), (92, 372), (50, 366)]
BEET_RU = [(222, 302), (264, 278), (326, 268), (350, 298), (338, 346), (282, 358), (230, 342)]
BEET_LO = [(48, 84), (70, 44), (118, 36), (142, 62), (124, 92), (118, 116), (70, 120)]
BEET_RO = [(304, 40), (346, 38), (352, 80), (346, 110), (306, 112), (300, 76)]


def beet(ps, rnd):
    d = niere(ps)
    a = pfad(d, F['erde'], F['erde_d'], 2)
    xs, ys = [p[0] for p in ps], [p[1] for p in ps]
    for _ in range(9):
        x, y = rnd.uniform(min(xs) + 14, max(xs) - 20), rnd.uniform(min(ys) + 12, max(ys) - 10)
        a += pfad(f'M{n(x)},{n(y)}q6,-2 12,0', 'none', F['erde_h'], 1.6)
    return a


def im_vieleck(ps, x, y, rand=0):
    innen = False
    j = len(ps) - 1
    for i in range(len(ps)):
        xi, yi, xj, yj = *ps[i], *ps[j]
        if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi) + xi:
            innen = not innen
        j = i
    if not innen or not rand:
        return innen
    return all(math.dist((x, y), p) > rand for p in ps)


def reihen(ps, dy, dx, versatz=0):
    xs, ys = [p[0] for p in ps], [p[1] for p in ps]
    y, k, aus = min(ys) + 15, 0, []
    while y < max(ys) - 2:
        x = min(xs) + 10 + (k % 2) * dx / 2 + versatz
        while x < max(xs) - 6:
            if im_vieleck(ps, x, y) and im_vieleck(ps, x - 7, y) and im_vieleck(ps, x + 7, y):
                aus.append((x, y, k))
            x += dx
        y += dy
        k += 1
    return aus


def setze_(inhalt, x, y, s=1):
    return f'<g transform="translate({n(x)} {n(y)})' + (f' scale({s:.2f})' if s != 1 else '') + f'">{inhalt}</g>'


def bepflanzung(stufe):
    """stufe 0 jung, 1 hoeher und dichter, 2 blueht, 3 volle Fuelle -> [(y, svg)] fuer alle vier Beete, getrennt nach Beet"""
    g = [.8, 1.15, 1.25, 1.35][stufe]
    dy, dx = [(21, 24), (18, 20), (18, 20), (17, 18)][stufe]
    beete = {}
    beete['lu'] = [(y, setze_(frauenmantel(g, stufe >= 2), x, y) if k % 2 == 0 or stufe == 0 and (i % 2) else setze_(glocke(g * 1.05, stufe >= 1 or i % 2 == 0, 3 if stufe < 2 else 5), x, y)) for i, (x, y, k) in enumerate(reihen(BEET_LU, dy, dx))]
    beete['ru'] = [(y, setze_(funkie(g * .62), x, y) if (k + i) % 2 else setze_(farn(3), x, y, g * .52)) for i, (x, y, k) in enumerate(reihen(BEET_RU, dy + 3, dx + 5))]
    beete['lo'] = [(y, setze_(glocke(g * 1.05, stufe >= 1 or i % 2 == 0, 3 if stufe < 2 else 5), x, y) if k % 2 else setze_(frauenmantel(g, stufe >= 2), x, y)) for i, (x, y, k) in enumerate(reihen(BEET_LO, dy, dx))]
    beete['ro'] = [(y, setze_(lavendel_seite(), x, y, g * .62) if stufe >= 2 else setze_(glocke(g, stufe >= 1, 3), x, y)) for i, (x, y, k) in enumerate(reihen(BEET_RO, dy, dx))]
    return beete


def hecke(x, y0, y1, rnd, s=1.0):
    aus = []
    y = y0
    while y <= y1:
        aus.append((y, setze_(buchs(rnd.randrange(99)), x + rnd.uniform(-1, 1), y, s)))
        y += 19
    return aus


def wiesengrund(y0, y1, rnd, dichte, farbe=None, wild=False):
    a = rect(-6, y0, 412, y1 - y0, farbe or F['wiese'])
    for _ in range(max(2, int((y1 - y0) / 60))):
        a += pfad(fleck(rnd.uniform(0, 400), rnd.uniform(y0 + 20, y1 - 20), rnd.uniform(40, 80), rnd.uniform(14, 26), rnd), rnd.choice([F['wiese_h'], F['wiese_d']]), extra=' fill-opacity=".3"')
    for _ in range(dichte):
        x, y = rnd.uniform(26, 374), rnd.uniform(y0 + 8, y1 - 4)
        a += grasbueschel(x, y, F['wiese_d'], rnd.uniform(.7, 1.1))
    return a


def frei(x, y, w=30):
    bp = kurve(BACH, 16)
    wp = kurve(WEG_UNTEN, 12) + kurve(WEG_OBEN, 12)
    return min(math.hypot(x - p[0], y - p[1]) for p in bp) > 38 and min(math.hypot(x - p[0], y - p[1]) for p in wp) > w and not any(im_vieleck(b, x + a, y + c) for b in (BEET_LU, BEET_RU, BEET_LO, BEET_RO) for a, c in ((0, 0), (14, 0), (-14, 0), (0, 12), (0, -14)))


def bereich5(stand, rnd):
    """Bereich „Intervalle“, 400 x 390. -> (Boden, [(Fusslinie, Stehendes)])"""
    stufe = {'angelegt': 0, 'ausbau1': 1, 'ausbau2': 2, 'ausbau3': 3}.get(stand, 0)
    unten = stand != 'verborgen'
    oben = stand not in ('verborgen', 'aktuell')
    # Boden
    b = wiesengrund(0, 392, rnd, 60, '#c1cca6' if stand == 'verborgen' else None)
    # Bach
    d = kurve_d(BACH)
    b += pfad(d, 'none', F['ufer'], 66) + pfad(d, 'none', F['erde_h'], 55) + f'<g transform="translate(0 5)">{pfad(d, "none", F["wasser_d"], 48)}</g>' + f'<g transform="translate(0 7)">{pfad(d, "none", F["wasser"], 42)}</g>'
    for q, da in [(-6, '20 34'), (4, '12 40'), (12, '26 30')]:
        pk = [(x, y + 7 + q) for x, y, *_ in kurve(BACH, 16)[::3]]
        b += pfad(weich(pk, zu=False), 'none', F['wasser_h'], 1.9, f' stroke-dasharray="{da}" stroke-opacity=".9"')
    pk = kurve(BACH, 40)
    for i in range(3, len(pk) - 2, 4):
        x, y, dx, dy = pk[i]
        for s in (-1, 1):
            if rnd.random() < .62 and not any(math.dist((x, y), q) < 34 for q in [(158, 250), (246, 152)]):
                q = s * rnd.uniform(27, 33)
                r = rnd.uniform(3, 5.6)
                b += ell(x - dy * q + 1, y + dx * q + 2, r, r * .6, F['schatten'], extra=' fill-opacity=".2"') + ell(x - dy * q, y + dx * q, r, r * .62, rnd.choice([F['stein'], F['stein_h'], F['stein_s']]), F['stein_d'], .9)
    # Wege: bis zum Stand gelegt
    b += weg_kies(WEG_UNTEN, rnd) if unten else trampelpfad(WEG_UNTEN, rnd)
    b += weg_kies(WEG_OBEN, rnd) if oben else trampelpfad(WEG_OBEN, rnd)
    # Trittsteine
    steine = [(158 + (246 - 158) * t, 252 + (150 - 252) * t) for t in STEINE_T]
    if stand == 'verborgen':
        steine = steine[:1]
    for x, y in steine:
        b += ell(x + 2, y + 6, 12.5, 8, F['wasser_d']) + ell(x, y + 2, 12.5, 8, F['sandstein_d']) + ell(x, y, 12.5, 8, F['sandstein'], F['sandstein_d'], 1.2) + ell(x - 3, y - 2, 5, 2.4, '#f2e8cf')
    st = []
    plan = bepflanzung(stufe)
    for name, ps, fertig in (('lu', BEET_LU, unten), ('ru', BEET_RU, unten), ('lo', BEET_LO, oben), ('ro', BEET_RO, oben)):
        if fertig:
            b += beet(ps, rnd)
            st += plan[name]
        else:
            b += pfad(niere(ps), F['wiese_d'], extra=' fill-opacity=".35"')
            st.append((max(p[1] for p in ps), schnur(ps)))
    for s in ([] if unten else saeume(WEG_UNTEN)) + ([] if oben else saeume(WEG_OBEN, (5, 14, 22))):
        st.append(s)
    # Raender
    st += hecke(9, 14, 246, rnd) + hecke(9, 296, 390, rnd) + hecke(391, 14, 92, rnd) + hecke(391, 170, 390, rnd)
    # Kopfweide hinten rechts, Ufer
    st.append((56, ell(272, 44, 30, 8, F['schatten'], extra=' fill-opacity=".2"') + setze_(kopfweide([.72, .9, 1, 1.12][stufe]), 262, 42, .82)))
    for x in (60, 76, 92):
        st.append((238 + (x - 60) * .1, setze_(schwertlilie(stand != 'verborgen'), x, 236 - (x - 60) * .6, .92)))
    for x, y in [(136, 176), (282, 222), (330, 190), (36, 246)]:
        st.append((y, setze_(hohes_gras(int(x)), x, y, .72)))
    # Wildblumen
    viele = {'verborgen': 9, 'aktuell': 4, 'angelegt': 3, 'ausbau1': 5, 'ausbau2': 9, 'ausbau3': 15}[stand]
    r2, k = random.Random(8), 0
    while k < viele:
        x, y = r2.uniform(30, 372), r2.uniform(16, 382)
        if frei(x, y, 26) and not (230 < x < 300 and y < 60) and x < 350:
            st.append((y, margerite(x, y, .95) if k % 3 else setze_(wildblumen(k + 2), x, y, .62)))
            k += 1
    if stand == 'verborgen':
        st.append((150, setze_(bank(True), 66, 158, .95)))     # Vorgeschmack: steht schon fertig da
    elif stand == 'aktuell':
        st.append((136, setze_(schubkarre_erde(), 300, 136, .82)))
        st.append((124, setze_(spaten(), 150, 122, .95)))
        st.append((148, setze_(korb_setzlinge(), 96, 156, .9)))
        st.append((150, setze_(bank(True), 56, 170, .85)))
    else:
        st.append((150, setze_(bank(True), 58, 168, .95)))
    if stufe >= 2:
        st.append((386, setze_(rosenbogen(), 200, 386, 1.02)))
        st.append((246, setze_(bank(False), 312, 248, .86)))
    if stufe >= 3:
        for x, y, f in [(96, 150, 'rosa'), (30, 280, 'lila'), (216, 290, 'weiss'), (366, 250, 'rosa'), (150, 130, 'gelb'), (226, 372, 'lila'), (172, 372, 'rosa'), (300, 130, 'weiss')]:
            st.append((y, setze_(V.tuff(f, 3), x, y, .78)))
        st.append((399, setze_(schmetterling('#e3c56a', '#9c8032'), 120, 270, .9) + setze_(schmetterling('#b4aad0', '#6f6592'), 282, 246, .8) + setze_(schmetterling('#e3c56a', '#9c8032'), 222, 60, .75)))
    return b, st


def bereich6(h, offen, rnd):
    """Unterer Streifen von „Rhythmus“, noch nicht erreicht: von 0 bis h."""
    b = wiesengrund(-4, h + 2, rnd, 34, '#c7d0ae')
    W = [(200, h + 6), (200, h - 30), (206, h - 60), (200, 30)]
    b += trampelpfad(W, rnd)
    st = []
    mitte = [(200 + 62 * math.cos(a), 30 + 34 * math.sin(a)) for a in [i * math.tau / 9 for i in range(9)]]
    b += pfad(niere(mitte), F['wiese_d'], extra=' fill-opacity=".35"')
    st.append((64, schnur([p for p in mitte if p[1] > -10])))
    for x in (40, 84, 288, 332):
        ps = [(x, 4), (x + 28, 4), (x + 28, h - 24), (x, h - 24)]
        b += rect(x, 2, 28, h - 26, F['wiese_d'], 3, extra=' fill-opacity=".35"')
        st.append((h - 24, schnur(ps)))
    st.append((34, ell(203, 36, 24, 7, F['schatten'], extra=' fill-opacity=".22"') + poly([(182, 16), (218, 16), (222, 34), (178, 34)], F['sandstein'], F['sandstein_d'], 1.3) + ell(200, 16, 19, 6.4, '#f0e4c6', F['sandstein_d'], 1.2)))
    for x, y in [(130, h - 14), (264, h - 18), (30, h - 8), (374, h - 34), (160, h - 34)]:
        st.append((y, margerite(x, y, .95)))
    for x, y in [(116, 70), (272, 60), (236, h - 8)]:
        st.append((y, setze_(lavendel_seite(), x, y, .55)))
    st += saeume(W, (5, 15))
    st += hecke(9, 10, h, rnd) + hecke(391, 10, h, rnd)
    return b, st


def bereich4(h, rnd):
    """Oberer Streifen von „Notennamen“: ausgebaut (Stufe 2), braucht Pflege. Von 0 bis h."""
    b = wiesengrund(0, h + 4, rnd, 12)
    b += weg_kies([(200, h + 30), (200, h - 20), (200, 30), (200, -40)], rnd)
    st = []
    arten = [('#9d92bd', '#6f6592'), ('#c98a90', '#96606a'), ('#e8e3f2', '#9a92b8'), ('#9d92bd', '#6f6592'), ('#e0b4b5', '#96606a'), ('#9d92bd', '#6f6592'), ('#e8e3f2', '#9a92b8')]
    for i, x in enumerate((34, 80, 126, 240, 286, 332)):
        b += rect(x, 30, 34, h + 10, F['erde'], 4, F['erde_d'], 1.6)
        for k in range(5):
            for q in (9, 25):
                y = 44 + k * 14
                if y < h + 12:
                    st.append((y, setze_(kraut_blueh(.78, *arten[i]), x + q, y)))
        st.append((36, pfad(f'M{x+17},34L{x+17},18', 'none', F['holz_d'], 2.6) + rect(x + 8, 10, 18, 11, '#e8d8b4', 2, F['holz_d'], 1.1) + pfad(f'M{x+11},15.4l12,0', 'none', '#b9a783', 1.2)))
    st.append((24, setze_(bank(False), 60, 26, .84)))
    st.append((62, setze_(giesskanne(), 226, 64, .98)))
    st += hecke(9, 14, h, rnd) + hecke(391, 14, h, rnd)
    return b, st


def moment(stand):
    rnd = random.Random(31)
    h6, u56, h5, u45, h4 = 113, 43, 390, 35, 95
    y5, y45, y4 = h6 + u56, h6 + u56 + h5, h6 + u56 + h5 + u45
    H = y4 + h4
    angelegt = stand not in ('verborgen', 'aktuell')
    gr = lambda y, inhalt: f'<g transform="translate(0 {y})">{inhalt}</g>'
    stapel = lambda st: ''.join(s for _, s in sorted(st, key=lambda t: t[0]))
    b6, s6 = bereich6(h6, angelegt, rnd)
    b5, s5 = bereich5(stand, rnd)
    b4, s4 = bereich4(h4, rnd)
    sch = rect(-6, 0, 412, 9, F['schatten'], extra=' fill-opacity=".2"')
    oben = feldsteinmauer(0, u56, random.Random(3)) + stufen(2, u56 - 2)
    unten = feldsteinmauer(0, u45, random.Random(9)) + stufen(2, u45 - 2)
    # Reihenfolge von hinten nach vorn: Bereich 6, Mauer mit Tor, Bereich 5 ...
    t = gr(0, b6 + stapel(s6)) + gr(h6, rect(-6, -1, 412, u56 + 2, F['wiese_d']) + oben) + gr(h6, lattentor(6, angelegt))
    t += gr(y5, f'<g clip-path="url(#w-k)">{b5}</g>' + sch + stapel(s5)) + gr(y45, rect(-6, 0, 412, u45 + 1, F['wiese_d']) + unten) + gr(y45, lattentor(6, stand != 'verborgen'))
    t += gr(y4, f'<g clip-path="url(#w-k)">{b4}</g>' + sch + stapel(s4))
    t = re.sub(r'<use href="#gras"[^>]*/>', '', t)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 {H}" aria-hidden="true" focusable="false">\n'
            '<!-- Vergleich: der beschriebene Moment aus GARTEN-WORTE.md, gezeichnet von probe/werkzeug/worte.py -->\n'
            # weiche Kanten statt harter Linien
            '<style>path[fill]:not([fill="none"]),ellipse[stroke],polygon[stroke],rect[stroke]{stroke-opacity:.5}</style>\n'
            f'<defs><clipPath id="w-k"><rect x="0" y="0" width="400" height="{h5}"/></clipPath><clipPath id="w-a"><rect width="400" height="{H}"/></clipPath></defs>\n'
            f'<g clip-path="url(#w-a)">{t}</g>\n</svg>\n')


STAENDE = ['verborgen', 'aktuell', 'angelegt', 'ausbau1', 'ausbau2', 'ausbau3']

if __name__ == '__main__':
    os.makedirs(ZIEL, exist_ok=True)
    for s in STAENDE:
        text = moment(s)
        open(os.path.join(ZIEL, f'moment-{s}.svg'), 'w', encoding='utf-8', newline='\n').write(text)
        print(s, len(text.encode()))
