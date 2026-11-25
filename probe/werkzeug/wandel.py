"""Varianten des ersten Bereichs mit groesserem Unterschied zwischen unbearbeitet und bearbeitet (Baustein B, Brainstorming).

Wird von garten.py mit aufgerufen (python probe/werkzeug/garten.py). Drei Ansaetze, einzeln und zusammen:
  dinge   gleiche Dinge, staerkerer Unterschied (kahler Baum, Bluete, volle Ernte)
  felder  groessere Flaechen fuer die freiwilligen Stationen (Gemuesefeld, Obstgarten, Kreuzgarten)
  boden   das Land selbst lebt auf: trocken, dann gruen und bepflanzt, Station fuer Station
"""
import math
import random
from garten_teile import *
from zeichne import abstand_zu, bach_bild, streue, ufersteine, weg_bild
from garten import (BACH_X, MAUER, Q, abgesteckt, bluete, bohnen, ebene2, mauer_oben, rose, schlange, schreibe, stelle, traenke, varianten)

F.update(
    brach='#cdbd86', brach_d='#a8965c', brach_h='#ddd0a2', staub='#b69d69',
    duerr='#a08a52', duerr_d='#6f5c35', duerr_h='#cbb679', rinde='#93816f', rinde_d='#5b4e44', rinde_h='#b7a897',
    grau='#a59a8d', grau_d='#6d6359', grau_h='#c3bab0', trocken='#a98e66', trocken_d='#86704e',
    distel='#97a171', distel_d='#5d6848', distel_b='#93729b',
    bluet='#f4d2dd', bluet_d='#c58aa0', bluet_h='#fdf1f5', birne='#e6c849', birne_d='#9a8222', blatt='#7fae58',
    krautrot='#cf4f4f', sonne='#f2bd2f', sonne_d='#b27d12',
)


# ---------- unbearbeitet ----------

def halme(saat):
    rnd = random.Random(saat)
    aus = ell(0, 0, 11, 3, F['schatten'], extra=' fill-opacity=".14"')
    for i in range(11):
        x, hh = -10 + i * 2 + rnd.uniform(-1, 1), rnd.uniform(11, 25)
        aus += pfad(f'M{n(x*.4)},0Q{n(x*.8)},{n(-hh*.6)} {n(x*1.2+rnd.uniform(-5, 7))},{n(-hh)}', 'none', rnd.choice([F['duerr'], F['duerr_d'], F['duerr_h'], F['duerr']]), 1.7)
    for x, y in [(-8, -20), (4, -25)]:
        aus += ell(x, y, 1.5, 3.4, F['duerr_h'], F['duerr_d'], .6)
    return aus


def distel(saat):
    rnd = random.Random(saat)
    aus = ell(0, 0, 13, 3.6, F['schatten'], extra=' fill-opacity=".18"')
    for s in (-1, 1):
        aus += poly([(0, -3), (s * 7, -5), (s * 6, -8), (s * 13, -9), (s * 10, -12), (s * 15, -17), (s * 7, -15), (s * 5, -18), (0, -10)], F['distel'], F['distel_d'], 1)
        aus += poly([(0, -11), (s * 4, -13), (s * 4, -16), (s * 9, -20), (s * 4, -20), (0, -17)], F['distel'], F['distel_d'], .9)
    aus += pfad('M0,0C-1,-10 1,-18 0,-30M0,-14C5,-18 8,-21 9,-26M0,-12C-5,-16 -8,-18 -10,-22', 'none', F['distel_d'], 2)
    for x, y in [(0, -32), (9, -28), (-10, -24)]:
        for k in range(5):
            aus += pfad(f'M{x},{y-2}L{n(x+(k-2)*2.1)},{n(y-8+abs(k-2)*.9)}', 'none', F['distel_b'], 1.5)
        aus += ell(x, y, 3.8, 4, F['distel'], F['distel_d'], 1)
    return aus


def dornen(saat):
    rnd = random.Random(saat)
    aus = ell(0, 0, 20, 5, F['schatten'], extra=' fill-opacity=".2"')
    for (x0, hx, hy, x1) in [(-16, -6, -30, 18), (14, 4, -24, -20), (-4, 10, -34, 24), (6, -12, -20, -24), (-18, 2, -15, 12)]:
        d = f'M{x0},0Q{hx},{hy} {x1},{n(rnd.uniform(-5, 1))}'
        aus += pfad(d, 'none', F['rinde_d'], 2.6) + pfad(d, 'none', '#8a5f50', 1.2)
        for t in (.2, .38, .56, .74):
            m = 1 - t
            x, y = m * m * x0 + 2 * m * t * hx + t * t * x1, 2 * m * t * hy
            aus += pfad(f'M{n(x)},{n(y)}l{n(rnd.uniform(-2.6, 2.6))},-3.4', 'none', F['rinde_d'], 1.1)
            if rnd.random() < .55:
                w = rnd.uniform(0, 360)
                aus += f'<g transform="translate({n(x)} {n(y)}) rotate({n(w)})">' + pfad('M0,0C-3,-2 -3,-6 0,-8C3,-6 3,-2 0,0Z', rnd.choice(['#8c8a4e', '#a3763f', '#7d7f4a']), '#5c5330', .8) + '</g>'
    return aus


def verzweige(rnd, x, y, w, l, d, seg, tiefe):
    ex, ey = x + l * math.sin(w), y - l * math.cos(w)
    q = rnd.uniform(-.12, .12) * l
    seg.append((x, y, (x + ex) / 2 + q * math.cos(w), (y + ey) / 2 + q * math.sin(w), ex, ey, d))
    if not tiefe:
        return
    for s in ((-1, 1) if rnd.random() < .6 else (-1, .1, 1)):
        verzweige(rnd, ex, ey, w + s * rnd.uniform(.35, .62), l * rnd.uniform(.6, .78), d * .62, seg, tiefe - 1)


def zeichne_aeste(seg, dunkel, hell):
    zug = lambda s: f'M{n(s[0])},{n(s[1])}Q{n(s[2])},{n(s[3])} {n(s[4])},{n(s[5])}'
    return ''.join(pfad(zug(s), 'none', dunkel, s[6] + 1.8) for s in seg) + ''.join(pfad(zug(s), 'none', hell, max(.6, s[6] - .2)) for s in seg if s[6] > 1)


def duerrbusch(saat):
    rnd = random.Random(saat)
    seg = []
    for w in (-.95, -.5, -.05, .45, .9):
        verzweige(rnd, rnd.uniform(-3, 3), 0, w, rnd.uniform(9, 13), 2, seg, 2)
    aus = ell(1, 0, 15, 4, F['schatten'], extra=' fill-opacity=".2"') + zeichne_aeste(seg, F['rinde_d'], F['rinde'])
    for s in rnd.sample([s for s in seg if s[6] < 1], 5):
        aus += ell(s[4], s[5], 2.2, 1.6, '#b07b3c', '#7a5224', .6)
    return aus


def baum_duerr(saat):
    rnd = random.Random(saat)
    seg = []
    for w, l in [(-.78, 27), (-.24, 31), (.3, 30), (.86, 25)]:
        verzweige(rnd, 0, -33, w, l, 6, seg, 3)
    aus = pfad('M-8,1C-6,-10 -6,-20 -9,-37L9,-37C6,-20 6,-10 9,1C4,-1.5 -3,-1.5 -8,1Z', F['rinde'], F['rinde_d'], 1.4)
    aus += zeichne_aeste(seg, F['rinde_d'], F['rinde'])
    aus += pfad('M-5,-2C-4,-12 -4,-20 -6,-34M2,-2C1,-10 2,-20 4,-33', 'none', F['rinde_d'], 1) + ell(1.5, -18, 2.4, 3.4, F['rinde_d'])
    for s in rnd.sample([s for s in seg if s[6] < 2], 7):
        aus += ell(s[4], s[5], 2.6, 1.9, '#b9803d', '#7a5224', .7)
    for x, y in [(-22, 4), (16, 6), (-9, 8)]:
        aus += ell(x, y, 2.8, 1.5, '#b9803d', '#7a5224', .6)
    return aus


def feldsteine(saat):
    rnd = random.Random(saat)
    aus = ell(2, 1, 16, 4.4, F['schatten'], extra=' fill-opacity=".22"')
    for x, y, r in [(-7, -3, 8), (7, -2, 6.4), (1, 2, 5)]:
        aus += pfad(fleck(x, y, r, r * .74, rnd, 7, .12), F['stein_s'], F['stein_d'], 1.2) + pfad(fleck(x - r * .25, y - r * .28, r * .45, r * .25, rnd, 6, .1), F['stein_h'])
    return aus


def moos_dicht():
    """Ueberwucherte Station: liegt auf der Platte."""
    rnd = random.Random(7)
    aus = ell(0, 0, 28, 19.6, F['brach_d'], extra=' fill-opacity=".62"')
    aus += pfad('M-20,-6L-9,-2L-3,-8L6,-3M4,4L12,8L20,5M-12,10L-6,5', 'none', '#6c6250', 1.4)
    for x, y, rx, ry in [(-17, 6, 11, 6), (15, -7, 11, 6), (-3, -13, 10, 4.6), (10, 11, 10, 5), (-19, -8, 7, 4.6)]:
        aus += pfad(fleck(x, y, rx, ry, rnd, 8, .14), '#8f9050', '#6d6c38', 1)
    return aus + setze('halme-1', -21, 13, .8) + setze('halme-2', 22, 10, .78) + setze('halme-1', 3, 20, .72) + setze('distel-1', -4, 6, .62)


def grenze_alt(b, t):
    """Verfallener Zaun um eine noch unbearbeitete Flaeche (Bezugspunkt links oben)."""
    def pf(x, y, w=0):
        return f'<g transform="translate({n(x)} {n(y)}) rotate({w})">' + pfad('M0,0L0,-16', 'none', F['grau_d'], 5) + pfad('M0,0L0,-16', 'none', F['grau'], 2.8) + '</g>'
    aus = ''
    for x, w in [(0, -6), (b * .36, 9), (b * .7, -4), (b, 5)]:
        aus += pf(x, 0, w)
    aus += pfad(f'M-2,-10L{n(b*.36)},-8M{n(b*.72)},-11L{n(b)},-10', 'none', F['grau_d'], 4.2) + pfad(f'M-2,-10L{n(b*.36)},-8M{n(b*.72)},-11L{n(b)},-10', 'none', F['grau'], 2.2)
    return aus


def grenze_alt_vorn(b, t):
    def pf(x, y, w=0):
        return f'<g transform="translate({n(x)} {n(y)}) rotate({w})">' + pfad('M0,0L0,-16', 'none', F['grau_d'], 5) + pfad('M0,0L0,-16', 'none', F['grau'], 2.8) + '</g>'
    aus = pf(0, t * .5, 12) + pf(b, t * .52, -9)
    aus += pfad(f'M0,{n(t-9)}L{n(b*.3)},{n(t-2)}M{n(b*.62)},{n(t-10)}L{n(b)},{n(t-8)}', 'none', F['grau_d'], 4.2) + pfad(f'M0,{n(t-9)}L{n(b*.3)},{n(t-2)}M{n(b*.62)},{n(t-10)}L{n(b)},{n(t-8)}', 'none', F['grau'], 2.2)
    for x, w in [(0, 8), (b * .34, -14), (b * .62, 4), (b, -7)]:
        aus += pf(x, t, w)
    return aus


def brachfeld(b, t, saat):
    rnd = random.Random(saat)
    aus = pfad(fleck(b / 2, t / 2, b * .53, t * .55, rnd, 12, .07), F['brach_d'], extra=' fill-opacity=".85"')
    aus += pfad(fleck(b / 2, t / 2, b * .48, t * .48, rnd, 12, .08), F['staub'])
    for _ in range(5):
        x, y = rnd.uniform(b * .2, b * .8), rnd.uniform(t * .25, t * .8)
        aus += pfad(fleck(x, y, rnd.uniform(12, 24), rnd.uniform(5, 10), rnd), rnd.choice([F['brach_h'], F['trocken']]), extra=' fill-opacity=".55"')
    for _ in range(5):
        x, y = rnd.uniform(b * .2, b * .8), rnd.uniform(t * .2, t * .8)
        aus += pfad(f'M{n(x)},{n(y)}l{n(rnd.uniform(6, 11))},{n(rnd.uniform(-3, 3))}l{n(rnd.uniform(4, 8))},{n(rnd.uniform(-4, 4))}m-8,0l-3,5', 'none', F['trocken_d'], 1.2)
    return aus


# ---------- bearbeitet ----------

def apfel(x, y, r):
    return ell(x, y, r, r * .96, F['apfel'], F['apfel_d'], 1) + ell(x - r * .3, y - r * .36, r * .3, r * .24, '#f0a08a') + pfad(f'M{n(x)},{n(y-r*.9)}l1,-2.4', 'none', F['holz_d'], 1.1)


def birne(x, y, r):
    return pfad(f'M{n(x)},{n(y-r*1.5)}C{n(x+r*.7)},{n(y-r*1.2)} {n(x+r*1.1)},{n(y)} {n(x+r*.7)},{n(y+r*.6)}C{n(x+r*.3)},{n(y+r*.95)} {n(x-r*.3)},{n(y+r*.95)} {n(x-r*.7)},{n(y+r*.6)}C{n(x-r*1.1)},{n(y)} {n(x-r*.7)},{n(y-r*1.2)} {n(x)},{n(y-r*1.5)}Z', F['birne'], F['birne_d'], 1)


STAMM = 'M-7,1C-5,-10 -5,-18 -10,-30L10,-30C5,-18 5,-10 8,1C3,-1 -2,-1 -7,1Z'


def baum_bluete(saat):
    rnd = random.Random(saat)
    aus = pfad(STAMM, F['holz'], F['holz_d'], 1.2) + pfad('M2,-2C1,-10 2,-18 4,-28', 'none', F['holz_d'], 1)
    aus += pfad(wolke(0, -62, 43, 40, 13, rnd), F['bluet'], F['bluet_d'], 1.4)
    aus += pfad(wolke(8, -46, 30, 20, 9, rnd), F['bluet_d'], extra=' fill-opacity=".3"') + pfad(wolke(-9, -74, 27, 22, 10, rnd), F['bluet_h'], extra=' fill-opacity=".8"')
    for x, y in [(-34, -50), (30, -84), (36, -54), (-20, -34), (16, -36), (-34, -80), (4, -98), (-2, -60), (22, -66)]:
        aus += pfad(f'M{x},{y}c-5,-1 -7,-6 -5,-9c4,0 7,4 5,9Z', F['blatt'], F['laub_d'], .8)
    for x, y in [(-26, -62), (-12, -50), (6, -42), (24, -52), (14, -70), (-4, -76), (-22, -84), (8, -90), (30, -70), (-8, -32)]:
        aus += bluete(x, y, 6, '#fffafc', F['bluet_d'], '#f2c14e')
    return aus


def baum_reich(saat, birnen=False):
    rnd = random.Random(saat)
    aus = pfad(STAMM, F['holz'], F['holz_d'], 1.2) + pfad('M2,-2C1,-10 2,-18 4,-28', 'none', F['holz_d'], 1)
    aus += pfad(wolke(0, -64, 48, 43, 14, rnd), F['krone'], F['krone_d'], 1.5)
    aus += pfad(wolke(9, -47, 33, 21, 9, rnd), F['krone_d'], extra=' fill-opacity=".35"') + pfad(wolke(-10, -78, 30, 23, 10, rnd), F['krone_h']) + pfad(wolke(-16, -86, 16, 11, 8, rnd), F['krone_hh'])
    stellen = [(-34, -56), (-20, -42), (-2, -36), (17, -42), (33, -56), (-26, -74), (-8, -58), (10, -60), (26, -76), (-12, -84), (9, -82), (-2, -98), (38, -70), (-40, -72)]
    for x, y in stellen:
        aus += birne(x, y, 4.6) if birnen else apfel(x, y, 5.8)
    for x, y in [(-24, 5), (20, 4), (-12, 9)]:
        aus += birne(x, y, 3.6) if birnen else apfel(x, y, 4.4)
    return aus


def setzling():
    aus = ell(0, 1, 17, 6.4, F['erde'], F['erde_d'], 1.3) + ell(0, 0, 11, 3.6, F['erde_h'])
    aus += pfad('M7,0L7,-34', 'none', F['holz_d'], 3.4) + pfad('M7,0L7,-34', 'none', F['holz_h'], 1.6)
    aus += pfad('M0,0C-1,-10 1,-20 0,-31', 'none', F['holz_d'], 2.4) + pfad('M0,-18L7,-20', 'none', '#f4ead0', 1.8)
    for x, y, w in [(0, -31, 0), (-1, -25, -60), (1, -23, 55), (0, -16, -70)]:
        aus += f'<g transform="translate({x} {y}) rotate({w})">' + pfad('M0,0C-5,-3 -4,-9 0,-12C4,-9 5,-3 0,0Z', F['laub_h'], F['laub_d'], 1) + '</g>'
    return aus


def korb():
    aus = ell(1, 0, 15, 4, F['schatten'], extra=' fill-opacity=".28"')
    aus += pfad('M-10,-12C-9,-26 9,-26 10,-12', 'none', F['holz_d'], 2.6)
    for x, y in [(-7, -14), (0, -16), (7, -14), (-3, -19), (4, -20)]:
        aus += apfel(x, y, 4.6)
    aus += pfad('M-13,-12L13,-12L10,0C6,1.6 -6,1.6 -10,0Z', '#c79a5b', '#80582a', 1.3)
    return aus + pfad('M-12,-8L12,-8M-11,-4L11,-4M-6,-12L-5,0M0,-12L0,1M6,-12L5,0', 'none', '#80582a', .9)


def leiter():
    aus = pfad('M-9,2L2,-66M9,2L12,-66', 'none', F['holz_d'], 3.8) + pfad('M-9,2L2,-66M9,2L12,-66', 'none', F['holz_h'], 1.8)
    return aus + ''.join(pfad(f'M{n(-7.4+i*1.7)},{-8-i*10}L{n(9.4+i*.45)},{-8-i*10}', 'none', F['holz_d'], 2.8) for i in range(6))


def sonnenblume(saat):
    rnd = random.Random(saat)
    h = rnd.uniform(52, 62)
    aus = ell(1, 0, 9, 2.6, F['schatten'], extra=' fill-opacity=".24"') + pfad(f'M0,0C2,{n(-h*.4)} -2,{n(-h*.7)} 0,{n(-h)}', 'none', F['laub_d'], 3.2) + pfad(f'M0,0C2,{n(-h*.4)} -2,{n(-h*.7)} 0,{n(-h)}', 'none', F['laub'], 1.4)
    for y, s in [(-14, -1), (-22, 1), (-33, -1)]:
        aus += pfad(f'M0,{y}C{s*5},{y-8} {s*13},{y-8} {s*16},{y-2}C{s*11},{y+3} {s*5},{y+3} 0,{y}Z', F['laub'], F['laub_d'], 1)
    for i in range(12):
        aus += f'<g transform="translate(0 {n(-h)}) rotate({i*30})">' + pfad('M0,-5C-4,-8 -3.4,-13 0,-15C3.4,-13 4,-8 0,-5Z', F['sonne'], F['sonne_d'], .9) + '</g>'
    return aus + ell(0, -h, 7, 7, '#7a4a22', '#4f2e13', 1.1) + ell(-1.4, -h - 1.4, 3, 3, '#95602f')


def kuerbis(r=13):
    aus = ell(2, 0, r * 1.2, r * .34, F['schatten'], extra=' fill-opacity=".28"')
    aus += pfad(f'M{n(r*.6)},-3C{n(r*1.5)},-2 {n(r*1.6)},-9 {n(r*2)},-6', 'none', F['laub_d'], 1.8) + pfad(f'M{n(r*1.3)},-3c2,-7 9,-8 11,-4c-1,5 -6,7 -11,4Z', F['laub'], F['laub_d'], 1)
    aus += ell(0, -r * .72, r, r * .76, F['kuerbis'], F['kuerbis_d'], 1.3)
    aus += pfad(f'M0,{n(-r*1.45)}C{n(-r*.7)},{n(-r*1.1)} {n(-r*.7)},{n(-r*.3)} 0,0M0,{n(-r*1.45)}C{n(r*.7)},{n(-r*1.1)} {n(r*.7)},{n(-r*.3)} 0,0', 'none', F['kuerbis_d'], 1.1)
    return aus + pfad(f'M0,{n(-r*1.44)}C1,{n(-r*1.7)} 3,{n(-r*1.8)} 5,{n(-r*1.8)}', 'none', F['laub_d'], 3) + ell(-r * .45, -r * .95, r * .2, r * .26, '#f3b36b')


def vogelscheuche():
    aus = ell(2, 0, 12, 3.4, F['schatten'], extra=' fill-opacity=".26"')
    aus += pfad('M0,0L0,-62M-24,-42L24,-42', 'none', F['holz_d'], 4.6) + pfad('M0,0L0,-62M-24,-42L24,-42', 'none', F['holz_h'], 2.2)
    aus += pfad('M-21,-47L21,-47L21,-37L11,-36L12,-13L-12,-13L-11,-36L-21,-37Z', '#4c6ea6', '#2b4573', 1.4) + rect(-6, -31, 10, 8, F['rot_h'], 1, F['rot_d'], 1) + pfad('M-11,-20L12,-20', 'none', '#2b4573', 1)
    for x in (-25, 25):
        for d in (-3, 0, 3):
            aus += pfad(f'M{x},-42l{n(x*.2)},{n(d*1.6+2)}', 'none', F['stroh_d'], 1.8)
    aus += ell(0, -55, 8.6, 8.6, '#e9d3a0', '#a98a4d', 1.2) + pfad('M-4,-52q4,3.4 8,0', 'none', '#7a4a22', 1.3) + ell(-3, -56.4, 1.1, 1.1, '#3b2a1c') + ell(3, -56.4, 1.1, 1.1, '#3b2a1c')
    return aus + ell(0, -61, 15, 4.4, F['stroh'], F['stroh_d'], 1.2) + pfad('M-8,-62C-8,-71 8,-71 8,-62Z', F['stroh_h'], F['stroh_d'], 1.2) + pfad('M-8,-63.4L8,-63.4', 'none', F['band'], 2.6)


TUFF = {'rot': ('#d9534f', '#8f2d2b', '#f7d774'), 'gelb': ('#f5cf4a', '#b48a18', '#b4641a'), 'lila': ('#a99be0', '#5d5290', '#f6e7a8'), 'weiss': ('#fffaf2', '#c3b48c', '#eda53a'), 'rosa': (F['rose_h'], F['rose_d'], '#fbe6a8')}


def tuff(farbe, saat):
    """Dichtes Blumenkissen in einer Farbe."""
    rnd = random.Random(saat)
    aus = ell(0, 0, 16, 4.4, F['schatten'], extra=' fill-opacity=".2"')
    aus += pfad('M-16,0C-16,-7 -10,-10 -6,-6C-5,-12 5,-12 6,-6C10,-10 16,-7 16,0C8,3 -8,3 -16,0Z', F['laub'], F['laub_d'], 1)
    for x, y in [(-11, -10), (-4, -15), (4, -14), (11, -10), (-7, -5), (1, -8), (8, -4), (-13, -3), (13, -3)]:
        aus += bluete(x + rnd.uniform(-1, 1), y + rnd.uniform(-1, 1), rnd.uniform(4.6, 5.4), *TUFF[farbe])
    return aus


def kranz():
    """Blumenring um eine geschaffte Station. Oben und unten bleibt der Weg frei."""
    rnd = random.Random(4)
    aus = ''
    for s in (-1, 1):
        for w in (-58, -38, -18, 2, 22, 42, 62):
            a = math.radians(w)
            x, y = s * 38 * math.cos(a), 28 * math.sin(a) + 4
            aus += pfad(wolke(x, y - 3, 8.4, 6.2, 7, rnd, .08), F['laub'], F['laub_d'], .9)
        for i, w in enumerate((-58, -44, -30, -16, -2, 12, 26, 40, 54, 66)):
            a = math.radians(w)
            x, y = s * (38 + (i % 2) * 5) * math.cos(a), (28 + (i % 2) * 3) * math.sin(a) + 1
            aus += bluete(x, y, 5.2, *TUFF[['rosa', 'weiss', 'gelb', 'lila', 'rot'][(i + (s > 0)) % 5]])
    return aus


def beet_brach(b=126, t=92):
    rnd = random.Random(9)
    aus = rect(0, t, b, 11, F['grau'], 1, F['grau_d'], 1.4) + pfad(f'M2,{t+5}L{b*.42:.0f},{t+6}M{b*.5:.0f},{t+4}L{b-4},{t+5}', 'none', F['grau_d'], 1)
    aus += poly([(0, 2), (b - 3, -2), (b + 2, t), (2, t + 1)], F['grau_h'], F['grau_d'], 1.6) + poly([(7, 7), (b - 9, 4), (b - 5, t - 6), (8, t - 5)], F['trocken'], F['trocken_d'], 1.3)
    aus += poly([(b * .56, -6), (b * .74, -2), (b * .72, 4), (b * .54, 0)], F['brach'], None)
    for _ in range(7):
        x, y = rnd.uniform(18, b - 30), rnd.uniform(16, t - 16)
        aus += pfad(f'M{n(x)},{n(y)}l9,{n(rnd.uniform(-3, 3))}l6,{n(rnd.uniform(-4, 4))}m-8,0l-3,6', 'none', F['trocken_d'], 1.2)
    for id_, x, y, s in [('halme-1', 22, 34, 1.1), ('distel-1', 60, 42, 1.05), ('halme-2', 98, 36, 1.1), ('dornen-1', 34, 74, .95), ('halme-1', 70, 78, 1.1), ('distel-2', 102, 80, 1.1), ('feldsteine', 84, 60, .6)]:
        aus += setze(id_, x, y, s)
    return aus


def bohnen_reich():
    rnd = random.Random(8)
    aus = ell(2, 0, 19, 5.4, F['schatten'], extra=' fill-opacity=".26"')
    fuesse = [(-14, 0), (14, 0), (0, 4)]
    for x, y in fuesse:
        aus += pfad(f'M{x},{y}L{n(-x*.28)},-72', 'none', F['holz_d'], 3.4)
    stellen = []
    for x, y in fuesse:
        t = 2
        while t < 70:
            f = t / 72
            stellen.append((x + (-x * .28 - x) * f, y - t * (72 + y) / 72, f))
            t += 4.4
    for px, py, f in stellen:
        s, q = rnd.uniform(6, 8) * (1 - .2 * f), rnd.uniform(-5, 5)
        aus += pfad(f'M{n(px+q)},{n(py)}c{n(-s)},{n(-s*.2)} {n(-s)},{n(-s*1.3)} 0,{n(-s*1.6)}c{n(s)},{n(s*.3)} {n(s)},{n(s*1.4)} 0,{n(s*1.6)}Z', rnd.choice([F['laub'], F['laub_h'], F['laub'], F['laub_hh']]), F['laub_d'], .9)
    for i, (px, py, f) in enumerate(stellen):
        if i % 3 == 0:
            aus += bluete(px + rnd.uniform(-6, 6), py - 2, 5, *TUFF['rot'] if i % 2 else TUFF['weiss'])
    for x, y in [(-14, -14), (12, -20), (-8, -40), (6, -52), (2, -8)]:
        aus += pfad(f'M{x},{y}q3,7 0,15', 'none', F['laub_d'], 4) + pfad(f'M{x},{y}q3,7 0,15', 'none', '#b5d96f', 2.2)
    return aus


def bohnen_brach():
    aus = ''
    for d in ('M-30,-2L26,-12', 'M-24,4L30,-4', 'M-14,-12L20,8'):
        aus += pfad(d, 'none', F['grau_d'], 4.4) + pfad(d, 'none', F['grau'], 2.2)
    return aus + setze('halme-1', -22, 8, .9) + setze('distel-2', 18, 12, .95) + setze('halme-2', 2, 4, .9)


def traenke_brach():
    aus = ell(4, 4, 34, 9, F['schatten'], extra=' fill-opacity=".2"')
    aus += poly([(-30, -4), (-12, -6), (-9, 2), (-32, 3)], F['stein_s'], F['fuge'], 1) + ell(-21, -5, 10, 4, F['stein'], F['stein_d'], 1)
    aus += '<g transform="translate(14 -8) rotate(64)">' + pfad('M-21,0C-19,10 -9,13 0,13C9,13 19,10 21,0Z', F['stein_s'], F['stein_d'], 1.2) + ell(0, 0, 21, 7, F['stein_h'], F['stein_d'], 1.2) + ell(0, 0, 15, 4.6, F['fuge'], extra=' fill-opacity=".5"') + pfad('M-8,-2L-2,2L4,-3L10,1', 'none', F['fuge'], 1.2) + '</g>'
    return aus + setze('halme-1', -8, 6, 1) + setze('dornen-1', 24, 9, .75) + setze('halme-2', -30, 9, .85) + setze('distel-1', 4, 10, .7)


def ranken():
    """Duerre Ranken ueber dem geschlossenen Tor."""
    rnd = random.Random(15)
    aus = ''
    for d in ('M170,60C178,40 196,44 204,22C208,8 220,4 232,-4', 'M232,62C222,46 206,48 196,30C190,18 180,14 168,10', 'M180,62C186,52 200,58 214,44C222,36 228,30 234,20'):
        aus += pfad(d, 'none', F['rinde_d'], 3) + pfad(d, 'none', '#8a5f50', 1.4)
    for x, y in [(178, 44), (188, 42), (204, 24), (216, 6), (224, 50), (206, 46), (194, 28), (182, 15), (214, 44), (228, 30), (170, 11), (232, -3)]:
        w = rnd.uniform(0, 360)
        aus += f'<g transform="translate({x} {y}) rotate({n(w)})">' + pfad('M0,0C-3,-2 -3.4,-7 0,-9C3.4,-7 3,-2 0,0Z', rnd.choice(['#8c8a4e', '#a3763f', '#b9803d']), '#5c5330', .9) + '</g>'
    return aus


def efeu_duerr(saat):
    rnd = random.Random(saat)
    aus = ''
    for k in range(4):
        x0 = -22 + k * 14 + rnd.uniform(-3, 3)
        l = rnd.uniform(22, 48)
        aus += pfad(f'M{n(x0)},-2Q{n(x0+rnd.uniform(-8, 8))},{n(l*.5)} {n(x0+rnd.uniform(-7, 7))},{n(l)}M{n(x0)},{n(l*.45)}l{n(rnd.uniform(-9, 9))},{n(l*.25)}', 'none', F['rinde_d'], 1.6)
        for i in range(3):
            aus += ell(x0 + rnd.uniform(-5, 5), rnd.uniform(4, l), 2.2, 1.6, '#a3763f', '#6b4a24', .6)
    return aus


# ---------- groessere Flaechen ----------

def gemuesefeld(b=140, t=116):
    """Steinrand, dunkle Erde, fuenf Reihen. Bezugspunkt links oben."""
    a = schatten(rect(6, 7, b, t, F['schatten'], 6), .2) + rect(0, 0, b, t, F['stein_s'], 7, F['stein_d'], 1.6)
    for x in range(8, b - 4, 15):
        a += pfad(f'M{x},0l0,6M{x+5},{t-6}l0,6', 'none', F['stein_d'], 1.1)
    for y in range(10, t - 6, 15):
        a += pfad(f'M0,{y}l6,0M{b-6},{y+4}l6,0', 'none', F['stein_d'], 1.1)
    a += rect(6, 6, b - 12, t - 12, F['erde'], 4, F['erde_d'], 1.5)
    for k in range(5):
        y = 22 + k * (t - 34) / 4.25
        a += pfad(f'M14,{n(y+2)}L{b-14},{n(y+2)}', 'none', F['erde_d'], 8.4) + pfad(f'M14,{n(y)}L{b-14},{n(y)}', 'none', F['erde_h'], 5.8) + pfad(f'M16,{n(y-1.8)}L{b-16},{n(y-1.8)}', 'none', '#a98462', 1.3, ' stroke-opacity=".7"')
    return a


def feldreihen(reihen, b=140, t=116):
    arten = ['lauch', 'ringelblume', 'kohl', 'salat', 'rotkohl']
    aus = ''
    for k in reihen:
        y = 24 + k * (t - 34) / 4.25
        for i in range(6):
            aus += setze(arten[k], 18 + i * (b - 36) / 5, y, 1.24)
    return aus


def keime(reihen, b=140, t=116):
    aus = ''
    for k in reihen:
        y = 23 + k * (t - 34) / 4.25
        for i in range(6):
            x = 18 + i * (b - 36) / 5
            aus += pfad(f'M{n(x)},{n(y)}l0,-4M{n(x)},{n(y-4)}c-4,-1 -5,-4 -4,-6c3,0 5,3 4,6c0,-3 2,-6 5,-6c1,3 -1,5 -5,6', F['laub_hh'], F['laub_d'], .9)
    return aus


def wiesenfeld(b, t):
    """Eingefriedetes Viereck fuer Obstbaeume: gemaehte Wiese, heller Zaun."""
    a = rect(0, 0, b, t, F['wiese_h'], 6, F['wiese_d'], 1.6)
    for k in range(1, 6):
        a += rect(b * k / 6 - b / 12, 2, b / 12, t - 4, F['wiese'], 0, extra=' fill-opacity=".6"')
    return a


def zaun_hinten(b, t):
    a = pfad(f'M0,-10L{b},-10M0,-4L{b},-4', 'none', F['holz_d'], 3.6) + pfad(f'M0,-10L{b},-10M0,-4L{b},-4', 'none', F['holz_h'], 1.8)
    for x in (0, b):
        a += pfad(f'M{x},-8L{x},{n(t-8)}', 'none', F['holz_d'], 3.4) + pfad(f'M{x},-8L{x},{n(t-8)}', 'none', F['holz_h'], 1.6)
    for x in [b * i / 5 for i in range(6)]:
        a += pfosten(x, 0)
    for y in (t * .34, t * .67):
        a += pfosten(0, y) + pfosten(b, y)
    return a


def zaun_vorn(b, t, tor=True):
    """Vorderseite mit Luecke als Eingang."""
    l = [(0, b * .4), (b * .6, b)] if tor else [(0, b)]
    a = ''
    for x0, x1 in l:
        d = f'M{n(x0)},{n(t-10)}L{n(x1)},{n(t-10)}M{n(x0)},{n(t-4)}L{n(x1)},{n(t-4)}'
        a += pfad(d, 'none', F['holz_d'], 3.6) + pfad(d, 'none', F['holz_h'], 1.8)
    for x in [0, b * .2, b * .4, b * .6, b * .8, b]:
        a += pfosten(x, t)
    return a


def pfosten(x, y):
    return pfad(f'M{n(x)},{n(y)}L{n(x)},{n(y-15)}', 'none', F['holz_d'], 5.4) + pfad(f'M{n(x)},{n(y)}L{n(x)},{n(y-15)}', 'none', F['holz_h'], 3)


BAEUME_X = (.18, .5, .82)


def baeume(b, t, hinten, vorn, zwischen=''):
    """Zwei Reihen mit je drei Baeumen, von hinten nach vorn."""
    aus = ''
    for art, y in ((hinten, t * .44), (None, 0), (vorn, t * .87)):
        if art is None:
            aus += zwischen
            continue
        for i, q in enumerate(BAEUME_X):
            id_, s = art[i] if isinstance(art, list) else art
            if id_.startswith(('baum', 'apfel', 'birn')):
                aus += setze('baumschatten', b * q + 8, y, s)
            aus += setze(id_, b * q, y, s)
    return aus


def kreuzbeet(rx=82, ry=60):
    """Vier Beete um eine Mitte (Kreuzgarten). Mittelpunkt 0,0."""
    a = ell(5, 6, rx + 2, ry + 2, F['schatten'], extra=' fill-opacity=".2"') + ell(0, 0, rx, ry, F['stein_s'], F['stein_d'], 1.6)
    for i in range(34):
        w = i * math.tau / 34
        a += pfad(f'M{n(rx*math.cos(w))},{n(ry*math.sin(w))}L{n(rx*.93*math.cos(w))},{n(ry*.92*math.sin(w))}', 'none', F['stein_d'], 1)
    a += ell(0, 0, rx * .93, ry * .92, F['weg'], F['weg_d'], 1.2)
    for q in range(4):
        a += pfad(sektor(q, rx, ry), F['erde'], F['erde_d'], 1.6)
    return a + ell(0, 0, 25, 18.5, F['weg_h'], F['weg_d'], 1)


def sektor(q, rx, ry):
    aussen = [math.radians(w + 90 * q) for w in range(9, 82, 8)]
    innen = [math.radians(w + 90 * q) for w in (72, 58, 45, 32, 18)]
    ps = [(rx * .87 * math.cos(a), ry * .85 * math.sin(a)) for a in aussen] + [(rx * .36 * math.cos(a), ry * .36 * math.sin(a)) for a in innen]
    return 'M' + 'L'.join(f'{n(x)},{n(y)}' for x, y in ps) + 'Z'


# Beetviertel: 0 vorn rechts, 1 vorn links, 2 hinten links, 3 hinten rechts
KREUZ_FARBE = ['gelb', 'rot', 'lila', 'rosa']


def viertel(q, rx=82, ry=60, gross=1.0):
    ps = []
    for r, ws in ((.5, (28, 62)), (.68, (20, 46, 72)), (.83, (14, 36, 56, 77))):
        for w in ws:
            a = math.radians(w + 90 * q)
            ps.append((rx * r * math.cos(a), ry * r * math.sin(a) + 5))
    return ''.join(setze(f'tuff-{KREUZ_FARBE[q]}', x, y, .8 * gross) for x, y in sorted(ps, key=lambda p: p[1]))


GEMUESE, OBST, KREUZ = (140, 116), (166, 136), (82, 60)


def brach_gemuese():
    b, t = GEMUESE
    kraut = [('halme-1', 26, 34, 1.1), ('dornen-1', 72, 40, 1.15), ('distel-1', 112, 46, 1.15), ('feldsteine', 50, 62, 1), ('halme-2', 92, 74, 1.2), ('distel-2', 24, 84, 1.2), ('dornen-1', 116, 98, 1.05), ('halme-1', 62, 104, 1.2)]
    return brachfeld(b, t, 3) + grenze_alt(b, t) + ''.join(setze(*w) for w in kraut) + grenze_alt_vorn(b, t)


def brach_obst():
    b, t = OBST
    return (brachfeld(b, t, 8) + grenze_alt(b, t) + baeume(b, t, [('baum-duerr', .58), ('dornen-1', 1), ('baum-duerr', .52)], [('feldsteine', 1), ('baum-duerr', .6), ('distel-1', 1.1)])
            + setze('halme-1', 60, 76, 1.1) + setze('halme-2', 128, 116, 1.1) + setze('distel-2', 22, 88, 1) + grenze_alt_vorn(b, t))


def brach_kreuz():
    rx, ry = KREUZ
    a = pfad(fleck(0, 0, rx, ry, random.Random(5), 12, .06), F['brach_d'], extra=' fill-opacity=".85"') + pfad(fleck(0, 0, rx * .88, ry * .86, random.Random(6), 12, .07), F['staub'])
    for i in range(22):
        w = i * math.tau / 22
        if i % 4:
            a += ell(rx * .95 * math.cos(w), ry * .95 * math.sin(w), 6, 3.8, F['stein_s'], F['stein_d'], 1)
    kraut = [('halme-1', -44, -26, 1.1), ('dornen-1', 40, -22, 1), ('distel-1', 4, -38, .9), ('distel-2', -56, 14, 1.1), ('halme-2', 50, 18, 1.1), ('traenke-brach', 0, 12, 1.2), ('dornen-1', -34, 46, .85), ('halme-1', 36, 46, 1.1)]
    return a + ''.join(setze(*w) for w in kraut)


def teile_neu():
    return [
        ('halme-1', 'unbearbeitet: dürre Halme 1', halme(3)), ('halme-2', 'unbearbeitet: dürre Halme 2', halme(8)), ('distel-1', 'unbearbeitet: Distel 1', distel(2)), ('distel-2', 'unbearbeitet: Distel 2', distel(5)),
        ('dornen-1', 'unbearbeitet: Dornen', dornen(4)), ('duerrbusch', 'unbearbeitet: kahler Busch', duerrbusch(6)), ('feldsteine', 'unbearbeitet: Feldsteine', feldsteine(3)), ('gras-duerr', 'unbearbeitet: trockenes Gras', pfad(G_GRAS, 'none', F['brach_d'], 1.6)),
        ('baum-duerr', 'Baum: dürr', baum_duerr(11)), ('baum-bluete', 'Baum: in Blüte', baum_bluete(9)), ('apfelbaum-reich', 'Apfelbaum: volle Ernte', baum_reich(21)), ('birnbaum-reich', 'Birnbaum: volle Ernte', baum_reich(8, True)),
        ('setzling', 'Setzling', setzling()), ('korb', 'Korb mit Äpfeln', korb()), ('leiter', 'Leiter', leiter()), ('sonnenblume-1', 'Sonnenblume 1', sonnenblume(3)), ('sonnenblume-2', 'Sonnenblume 2', sonnenblume(6)), ('kuerbis', 'Kürbis', kuerbis()), ('scheuche', 'Vogelscheuche', vogelscheuche()),
        *[(f'tuff-{f}', f'Blumenkissen {f}', tuff(f, i + 3)) for i, f in enumerate(TUFF)],
        ('moos-dicht', 'Station: überwuchert', moos_dicht()), ('kranz', 'Station: Blumenring', kranz()),
        ('beet-brach', 'Beet: verwildert', beet_brach()), ('bohnen-brach', 'Bohnen: Stangen umgefallen', bohnen_brach()), ('bohnen-reich', 'Bohnen: reiche Ernte', bohnen_reich()), ('traenke-brach', 'Vogeltränke: umgestürzt', traenke_brach()),
        ('ranken', 'Tor: überwuchert', f'<g transform="translate(-200 -20)">{ranken()}</g>'), ('efeu-duerr', 'Mauer: dürre Ranken', efeu_duerr(4)),
        ('feld-gemuese', 'Feld: Gemüse, Erde', gemuesefeld()), ('feld-reihen', 'Feld: Reihen voll', feldreihen(range(5))), ('feld-reihen-halb', 'Feld: Reihen halb', feldreihen([0, 1]) + keime([2, 3, 4])),
        ('kreuzbeet', 'Kreuzgarten: Beete', kreuzbeet()),
        ('baumschatten', 'Baumschatten', ell(0, 0, 33, 10, F['schatten'], extra=' fill-opacity=".2"')),
        ('feld-obst', 'Feld: Obstgarten, Wiese und Zaun', wiesenfeld(*OBST) + zaun_hinten(*OBST)), ('feld-obst-vorn', 'Feld: Obstgarten, Zaun vorn', zaun_vorn(*OBST)),
        ('brach-gemuese', 'Feld: Gemüse, verwildert', brach_gemuese()), ('brach-obst', 'Feld: Obstgarten, verwildert', brach_obst()), ('brach-kreuz', 'Kreuzgarten, verwildert', brach_kreuz()),
    ]


from zeichne import GRAS as G_GRAS  # noqa: E402


# ---------- Boden mit Zonen ----------

def zonengrenzen(ys, H):
    """Obere Kante je Station. Die Figur steht vor der naechsten Station, das Gruen reicht bis zu ihr."""
    return [H + 40] + [y + 66 for y in ys[1:]] + [-30]


def zone_von(y, grenzen):
    for i in range(1, len(grenzen)):
        if y > grenzen[i]:
            return i
    return len(grenzen) - 1


def kante(rnd, y):
    return [(x, y + rnd.uniform(-9, 9)) for x in range(-10, 431, 28)]


def zonenboden(rnd, H, W, B, frei, ys, extra_schatten=''):
    roh = kurve(W)
    wp = [(x, y * Q) for x, y, *_ in roh]
    bp = [(x, y * Q) for x, y, *_ in kurve(B)]
    voll = lambda x, y: y > MAUER + 14 and abstand_zu(wp, x, y, .8) > 40 and abstand_zu(bp, x, y, .8) > 34 and frei(x, y)
    gr = zonengrenzen(ys, H)
    # trockener Grund
    g = rect(-20, -20, 440, H + 40, F['brach'])
    for _ in range(int(H / 70)):
        g += pfad(fleck(rnd.uniform(0, 400), rnd.uniform(0, H), rnd.uniform(40, 80), rnd.uniform(18, 34), rnd), rnd.choice([F['brach_h'], F['brach_d'], F['staub']]), extra=' fill-opacity=".34"')
    for x, y in streue(rnd, int(H / 15), voll, h=H):
        if rnd.random() < .74:
            g += setze('gras-duerr', x, y, rnd.uniform(.85, 1.25))
        else:
            g += pfad(f'M{n(x-7)},{n(y)}l7,{n(rnd.uniform(-3, 3))}l6,{n(rnd.uniform(-3, 3))}m-7,0l-2,5', 'none', F['brach_d'], 1.2)
    # gruene Zonen, von unten nach oben
    kanten = [kante(rnd, y) for y in gr]
    z, umrisse = '', ''
    for i in range(1, len(gr)):
        oben = weich(kanten[i], zu=False)
        unten = 'L' + weich([(x, y + (26 if i > 1 else 0)) for x, y in reversed(kanten[i - 1])], zu=False)[1:]
        umrisse += f'<clipPath id="zone-{i}">' + pfad(oben + unten + 'Z') + '</clipPath>'
        f = pfad(oben + unten + 'Z', F['wiese'])
        f += pfad(oben, 'none', F['wiese_d'], 2.4, ' class="g-saum"')
        for _ in range(3):
            y0, y1 = gr[i] + 40, gr[i - 1] - 30
            f += pfad(fleck(rnd.uniform(20, 380), rnd.uniform(y0, max(y0 + 1, y1)), rnd.uniform(40, 80), rnd.uniform(18, 30), rnd), rnd.choice([F['wiese_h'], F['wiese_h'], F['wiese_d']]), extra=' fill-opacity=".22"')
        if i < len(gr) - 1:
            for x, y in kanten[i]:
                f += setze('gras', x + rnd.uniform(-9, 9), y + 4, rnd.uniform(.95, 1.25))
        z += varianten(f'zone-{i}', 'gruen', [('gruen', f)])
    z = f'<defs>{umrisse}</defs>' + z
    halme_ = {i: '' for i in range(1, len(gr))}
    for x, y in streue(rnd, int(H / 12), voll, h=H):
        q = rnd.random()
        halme_[zone_von(y, gr)] += setze('gras' if q < .68 else 'gaensebl' if q < .86 else 'blau', x, y, rnd.uniform(.75, 1.1))
    z += ''.join(varianten(f'zone-{i}', 'gruen', [('gruen', s)]) for i, s in halme_.items())
    # Wege: im trockenen Land staubig und zugewachsen
    alt = {k: F[k] for k in ('wiese_d', 'ufer')}
    F.update(wiese_d='#a29a5f', ufer='#8d8a56')
    weg, bach = weg_bild(W, rnd, 50, Q, steinchen=int(H / 8)), bach_bild(B, rnd, 36, Q, 7) + ufersteine(B, rnd, 38, Q, 7, True)
    F.update(alt)
    d = ''
    for i in range(1, len(gr)):
        # Stueck des Weges quer zur Laufrichtung begrenzt, benachbarte Stuecke teilen sich die Grenze
        nummern = [k for k, p in enumerate(wp) if gr[i] <= p[1] < gr[i - 1]]
        if len(nummern) < 2:
            continue
        ks = list(range(max(0, nummern[0] - 1), nummern[-1] + 1))
        quer = []
        for k in ks[::3] + ([ks[-1]] if (len(ks) - 1) % 3 else []):
            x, y, dx, dy = roh[k]
            quer.append(((x - dy * 25, (y + dx * 25) * Q), (x + dy * 25, (y - dx * 25) * Q)))
        s = pfad(weich([q[0] for q in quer], zu=False) + 'L' + weich([q[1] for q in reversed(quer)], zu=False)[1:] + 'Z', F['trocken'], extra=' fill-opacity=".42"')
        ps = [wp[k] for k in ks]
        for x, y in ps[::4]:
            if any(abs(y - sy) < 34 for sy in ys):
                continue
            for seite in (-1, 1):
                if rnd.random() < .62:
                    s += setze('gras-duerr', x + seite * rnd.uniform(8, 25), y + rnd.uniform(-5, 5), rnd.uniform(.9, 1.35))
        d += varianten(f'zone-{i}', 'gruen', [('brach', s)])
    sch = poly([(0, MAUER - 1), (400, MAUER - 1), (400, MAUER + 10), (0, MAUER + 10)], F['schatten']) + extra_schatten
    return wp, gr, [ebene2('grund', 'Grund, trocken', g), ebene2('zonen', 'Grund, aufgelebt je Station', z), ebene2('bach', 'Bach', bach), ebene2('weg', 'Weg', weg),
                    ebene2('wegbrach', 'Weg, noch zugewachsen', d), ebene2('schatten', 'Schatten', schatten(sch))]


DUERR = ['halme-1', 'halme-2', 'distel-1', 'halme-1', 'dornen-1', 'distel-2', 'duerrbusch', 'halme-2', 'feldsteine']


def neben_weg(wp, x, y, abst=36):
    """Schiebt einen Platz zur Seite, bis er neben dem Weg liegt (am Hang der Kurve zaehlt der Abstand quer zum Weg)."""
    for _ in range(40):
        nah = min(wp, key=lambda p: math.hypot(x - p[0], (y - p[1]) / .9))
        if math.hypot(x - nah[0], (y - nah[1]) / .9) >= abst:
            break
        x += 2 if x >= bei_y(wp, y)[0] else -2
    return round(x, 1), y


def pflanzen(rnd, wp, H, orte, sperr, bx=350):
    """Plaetze der ueppigen Bepflanzung: [(y, x, Bauteil, Groesse)]. Wie ueppig() in garten.py, aber als Liste."""
    aus, belegt = [], []

    def passt(x, y, abst):
        if not (12 < x < 388 and MAUER + 22 < y < H - 8) or abs(x - bx) < 34:
            return False
        if any(a < x < c and b < y < d for a, b, c, d in sperr):
            return False
        if any(math.hypot(x - sx, (y - sy) * 1.2) < 56 for sx, sy in orte):
            return False
        return all(math.hypot(x - a, y - b) > abst for a, b in belegt)
    reihe = ['buchs', 'lavendel', 'blumen-2', 'kraut', 'wild-1', 'buchs', 'blumen-1', 'gras-hoch', 'wild-2', 'blumen-3']
    k = 0
    for i in range(0, len(wp), 7):
        x, y = wp[i]
        for s in (-1, 1):
            xx, yy = x + s * rnd.uniform(38, 43), y + rnd.uniform(-4, 4)
            xx, yy = neben_weg(wp, xx, yy, rnd.uniform(35, 39))
            if passt(xx, yy, 21):
                belegt.append((xx, yy))
                aus.append((yy, xx, reihe[k % len(reihe)], rnd.uniform(.72, .92)))
                k += 1
    for _ in range(900):
        x, y = rnd.uniform(14, 386), rnd.uniform(MAUER + 24, H - 10)
        if min(math.hypot(x - a, (y - b) / .8) for a, b in wp[::3]) > 50 and passt(x, y, 27):
            belegt.append((x, y))
            aus.append((y, x, rnd.choice(['wild-1', 'wild-2', 'gras-hoch', 'gras-hoch', 'farn', 'kraut', 'wild-1']), rnd.uniform(.75, 1)))
    return aus


EFEU = [(26, 'efeu-1'), (70, 'efeu-2'), (116, 'efeu-1'), (280, 'efeu-2'), (312, 'efeu-1'), (392, 'efeu-2')]


def bepflanze(rnd, st, liste, gr, boden):
    """Ueppige Bepflanzung: fest (boden=False) oder mit der Zone wachsend, vorher duerres Kraut an denselben Plaetzen."""
    k = 0
    for y, x, id_, s in liste:
        gruen = varianten('ueppig', 'aus', [('an', setze(id_, x, y, s))])
        if not boden:
            st.append((y, gruen))
            continue
        stuecke = [('gruen', gruen)]
        if rnd.random() < .52:
            stuecke.append(('brach', setze(DUERR[k % len(DUERR)], x, y, s * 1.02)))
            k += 1
        st.append((y, varianten(f'zone-{zone_von(y, gr)}', 'gruen', stuecke)))
    for x, t_ in EFEU:
        gruen = varianten('ueppig', 'aus', [('an', setze(t_, x, 3, rnd.uniform(.85, 1.05)))])
        st.append((MAUER + .3, varianten(f'zone-{len(gr)-1}', 'gruen', [('gruen', gruen), ('brach', setze('efeu-duerr', x, 3, 1))]) if boden else gruen))


def fest(st, y, id_, x, s, gr, boden, duerr='duerrbusch'):
    """Busch, Lavendel: mit Boden-Ansatz vorher kahl."""
    inhalt = setze(id_, x, y, s)
    st.append((y, varianten(f'zone-{zone_von(y, gr)}', 'gruen', [('gruen', inhalt), ('brach', setze(duerr, x, y, s))]) if boden else inhalt))


def stationen(wp, hoehen, dinge):
    aus, orte = [], []
    for i, y in enumerate(hoehen, 1):
        x, y = bei_y(wp, y)
        x, y = round(x, 1), round(y, 1)
        orte.append((x, y))
        zu = setze('moos-dicht', x, y) if dinge else setze('moos', x, y)
        s = varianten(f'station-{i}', 'geschafft', [('zu', zu), ('naechste', setze('ring', x, y)), ('geschafft', setze('rosette', x, y, 1.05))], setze('platte', x, y), f' data-ort="{x} {y}"')
        aus.append((y, s))
        seite = 1 if x < 200 else -1
        if dinge:
            aus.append((y + .2, varianten(f'blumen-{i}', 'geschafft', [('geschafft', setze('kranz', x, y))])))
        else:
            aus.append((y + 12, varianten(f'blumen-{i}', 'geschafft', [('geschafft', setze(f'blumen-{i % 3 + 1}', x - 37, y + 12) + setze(f'blumen-{(i + 1) % 3 + 1}', x + 37, y + 12))])))
        aus.append((y + 22, varianten(f'laterne-{i}', 'aus', [('an', setze('laterne', x + seite * 46 - (10 if seite < 0 else 0), y + 22, 1.2))])))
        aus.append((y + 34, varianten(f'pflege-{i}', 'aus', [('an', setze('giesskanne', x + seite * 58, y + 34, 1.1))], '', f' data-ort="{n(x + seite * 58)} {n(y + 20)}"')))
        fx, fy = bei_y(wp, y + 78)
        aus.append((fy, f'<g class="g-figur" data-platz="{i}" data-ort="{n(fx)} {n(fy)}" display="none">{setze("figur", fx, fy, 1.22)}</g>'))
    return aus, orte


def baum(st, nr, x, y, s, zone, dinge, birne_=False):
    if dinge:
        stuecke = [('duerr', setze('baum-duerr', x, y, s)), ('kahl', setze('baum-bluete', x, y, s)), ('voll', setze('birnbaum-reich' if birne_ else 'apfelbaum-reich', x, y, s))]
    else:
        kahl = setze('birnbaum' if birne_ else 'apfelbaum-kahl', x, y, s)
        stuecke = [('duerr kahl', kahl), ('voll', kahl if birne_ else setze('apfelbaum', x, y, s))]
    st.append((y, varianten(f'baum-{nr}', 'voll', stuecke, '', f' data-zone="{zone}"')))


def kuerbisse(x, y):
    return setze('kuerbis', x, y, .92) + setze('kuerbis', x + 22, y + 5, .7)


# ---------- Kacheln ----------

def bereich(name, felder=False, boden=False, dinge=False):
    rnd = random.Random(41)
    st = []
    if felder:
        H, ys = 1255, [1040, 860, 680, 500, 320, 140]
        W = schlange([(200, H + 30), (200, H), (120, 1040), (258, 860), (122, 680), (256, 500), (124, 320), (200, 140), (200, 0), (200, -30)])
        B = schlange([(350, H + 30), (350, H), (341, 1060), (360, 820), (342, 590), (360, 320), (350, 60), (350, 0), (350, -30)])
        sperr = [(168, 980, 326, 1128), (0, 776, 192, 944), (0, 424, 190, 576), (236, 540, 330, 664), (226, 700, 318, 762), (214, 206, 318, 316), (10, 96, 108, 206), (0, 1120, 140, H), (130, 1140, 270, H)]
        b_schatten = [(292, 658, 34, 12), (278, 310, 38, 13), (66, 204, 40, 13)]
    else:
        H, ys = 1100, [885, 740, 595, 450, 305, 140]
        W = schlange([(200, H + 30), (200, H), (256, 885), (124, 740), (246, 595), (120, 450), (236, 305), (200, 140), (200, 0), (200, -30)])
        B = schlange([(350, H + 30), (350, H), (338, 900), (360, 690), (340, 480), (360, 260), (350, 60), (350, 0), (350, -30)])
        sperr = [(4, 800, 164, 962), (196, 690, 318, 812), (44, 590, 160, 674), (0, 470, 108, 600), (222, 350, 312, 470), (250, 490, 318, 552), (8, 180, 112, 312), (44, 334, 140, 396), (130, 985, 270, H), (0, 990, 136, 1080)]
        b_schatten = [(72, 588, 44, 15), (276, 458, 38, 13), (74, 304, 42, 14)]
    frei = lambda x, y: not any(a < x < c and b < y < d for a, b, c, d in sperr)
    sch = ''.join(ell(*e, F['schatten']) for e in b_schatten)
    if boden:
        wp, gr, bd = zonenboden(rnd, H, W, B, frei, ys, sch)
    else:
        from garten import boden as boden_fest
        wp, bd = boden_fest(rnd, H, W, B, frei, sch)
        gr = zonengrenzen(ys, H)
    s_, orte = stationen(wp, ys, dinge)
    st += s_ + mauer_oben(rnd)
    if dinge:
        st.append((MAUER + .1, varianten('tor', 'offen', [('zu', setze('ranken', 200, 20))])))
    fb = lambda y, id_, x, s, duerr='duerrbusch': fest(st, y, id_, neben_weg(wp, x, y, 38)[0], s, gr, boden, duerr)
    zu_felder(st, rnd, boden, dinge) if felder else zu_alt(st, boden, dinge)
    if felder:
        baum(st, 1, 284, 655, .82, 3, dinge, True)
        baum(st, 2, 268, 306, .92, 5, dinge)
        baum(st, 3, 56, 200, .96, 6, dinge)
        for x, y, s in [(132, 962, .9), (112, 974, .85), (270, 800, .85), (142, 598, .9), (124, 612, .85), (308, 462, .9), (298, 902, .95), (312, 926, .85)]:
            fb(y, 'lavendel', x, s, 'halme-2')
        for x, y, s in [(298, 1190, 1.05), (272, 1214, .85), (292, 196, 1), (24, 616, .95), (296, 812, .95), (30, 742, .9)]:
            fb(y, 'busch', x, s)
        schilf = [(309, 1150), (389, 1076), (307, 850), (388, 760), (308, 560), (386, 420), (318, 250), (390, 150)]
        angelegt = [(120, 118), (284, 128), (244, 218), (34, 262), (62, 1104), (30, 968)]
        fertig = [(118, 152), (272, 166), (214, 236), (296, 424), (248, 414), (30, 596), (146, 580), (312, 716), (36, 716), (148, 776), (22, 1004), (284, 1152), (96, 1122), (58, 348), (128, 402), (216, 744), (70, 644), (312, 372)]
        karre, voegel = (58, 706), (64, 92)
        falter = [('falter-1', 182, 398, 1), ('falter-2', 222, 730, 1), ('falter-1', 300, 590, .9), ('falter-2', 60, 1000, .9)]
        dx, dy = 272, 750
    else:
        baum(st, 1, 54, 585, 1, 3, dinge)
        baum(st, 2, 262, 455, .86, 4, dinge, True)
        baum(st, 3, 58, 300, .98, 5, dinge)
        for x, y, s in [(300, 906, .95), (288, 930, .85), (182, 700, .8), (60, 712, .9), (292, 330, .95), (306, 352, .8), (150, 356, .85)]:
            fb(y, 'lavendel', x, s, 'halme-2')
        for x, y, s in [(296, 1036, 1.05), (270, 1060, .85), (300, 200, 1), (26, 420, .95), (300, 640, .9)]:
            fb(y, 'busch', x, s)
        schilf = [(309, 1004), (389, 930), (307, 700), (388, 640), (306, 446), (386, 330), (316, 252), (390, 140)]
        angelegt = [(120, 118), (284, 128), (268, 246), (34, 342), (176, 980), (96, 978)]
        fertig = [(88, 142), (54, 120), (262, 160), (180, 250), (146, 206), (290, 400), (206, 412), (30, 516), (170, 560), (296, 700), (36, 712), (176, 812), (22, 976), (290, 990)]
        karre, voegel = (92, 384), (64, 92)
        falter = [('falter-1', 182, 398, 1), ('falter-2', 60, 780, 1), ('falter-1', 300, 590, .9)]
        dx, dy = 286, 546
    angelegt, fertig = [neben_weg(wp, *q) for q in angelegt], [neben_weg(wp, *q) for q in fertig]
    for x, y in schilf:
        st.append((y, setze('schilf', x, y, .9)))
    st.append((dy, stelle('d', (dx, dy - 22), 'aus', [('knospe', setze('rosen-knospe', dx, dy)), ('fertig', setze('rosen', dx, dy))])))
    for x in (22, 50, 82, 116, 284, 310):
        st.append((MAUER + 9, varianten('schmuck-angelegt', 'an', [('an', setze('stockrose', x, MAUER + 9, .92))])))
    for i, (x, y) in enumerate(angelegt):
        st.append((y, varianten('schmuck-angelegt', 'an', [('an', setze(f'blumen-{i % 3 + 1}', x, y, .95))])))
    farben = list(TUFF)
    for i, (x, y) in enumerate(fertig):
        st.append((y, varianten('schmuck-fertig', 'an', [('an', setze(f'tuff-{farben[i % 5]}', x, y, 1) if dinge else setze(f'blumen-{(i + 1) % 3 + 1}', x, y, .9))])))
    st.append((karre[1], varianten('schmuck-fertig', 'an', [('an', setze('schubkarre', karre[0], karre[1], 1.05))])))
    st.append((MAUER + .2, varianten('schmuck-fertig', 'an', [('an', setze('vogel', voegel[0], 2) + setze('vogel', voegel[1], 2, .9) + '<g transform="translate(300 2) scale(-1 1)"><use href="#vogel"/></g>')])))
    bepflanze(random.Random(23), st, pflanzen(random.Random(52), wp, H, orte, sperr), gr, boden)
    vorn = [ebene2('vorn', 'Ganz vorn', varianten('schmuck-fertig', 'an', [('an', ''.join(setze(*f) for f in falter))]))]
    return schreibe(name, name.replace('bereich-1-', 'b')[:3] + '-', H, bd, st, vorn, True, rnd)


def zu_alt(st, boden, dinge):
    """Die drei offenen Stellen an den bisherigen Orten."""
    if boden and not dinge:
        alt, F['wiese_d'] = F['wiese_d'], F['trocken']
    ax, ay = 16, 836
    sch_a = schatten(poly([(2, 105), (126, 105), (138, 117), (138, 26), (126, 16)], F['schatten']), .2)
    at = lambda inhalt: f'<g transform="translate({ax} {ay})">{inhalt}</g>'
    kasten = at(sch_a + setze('beet', 0, 0))
    if dinge:
        hinter = ''.join(setze(f'sonnenblume-{1 + i % 2}', x, 4, .95) for i, x in enumerate((12, 38, 64, 90)))
        voll = at(hinter) + kasten + at(''.join(setze(a, 19 + i * 22, 23 + k * 16.5, 1.24) for k, a in enumerate(['lauch', 'ringelblume', 'kohl', 'salat', 'rotkohl']) for i in range(5)) + kuerbisse(12, 116) + setze('kuerbis', 104, 119, .8))
        zu = at(setze('beet-brach', 0, 0))
    else:
        voll, zu = kasten + at(setze('beet-reihen', 0, 0)), abgesteckt(ax + 4, ay + 12, 118, 88)
    st.append((ay + 105, stelle('a', (ax + 63, ay + 50), 'fertig', [
        ('zu', zu), ('offen', kasten + setze('spaten', ax + 92, ay + 62, 1.35)), ('halb', kasten + at(setze('beet-reihen-halb', 0, 0)) + setze('spaten', ax + 96, ay + 78, 1.25)), ('fertig', voll)])))
    bx, by = 214, 748
    stangen = lambda teil, s=1: setze('erdbeet', bx, by) + ''.join(setze(teil, bx + 18 + i * 28, by + 30 + (i % 2) * 8, s) for i in range(3))
    if dinge:
        zu = rect(bx, by, 92, 52, F['stein_s'], 5, F['grau_d'], 1.4) + rect(bx + 5, by + 5, 82, 42, F['trocken'], 3, F['trocken_d'], 1.3) + setze('bohnen-brach', bx + 46, by + 30, 1.05)
    else:
        zu = abgesteckt(bx + 2, by + 2, 88, 50)
    st.append((by + 52, stelle('b', (bx + 46, by + 16), 'fertig', [
        ('zu', zu), ('offen', stangen('bohnen-leer') + setze('spaten', bx + 80, by + 48, 1.1)), ('halb', stangen('bohnen-halb') + setze('spaten', bx + 80, by + 48, 1.1)), ('fertig', stangen('bohnen-reich' if dinge else 'bohnen'))])))
    cx, cy = 100, 660
    kr = setze('blumen-1', cx - 30, cy + 5, .9) + setze('blumen-3', cx + 30, cy + 5, .9)
    if dinge:
        kr = setze('tuff-rosa', cx - 34, cy + 4, 1.1) + setze('tuff-gelb', cx + 34, cy + 4, 1.1) + setze('tuff-lila', cx - 14, cy + 13, 1.1) + setze('tuff-weiss', cx + 14, cy + 13, 1.1)
    st.append((cy + 5, stelle('c', (cx, cy - 20), 'fertig', [
        ('zu', setze('traenke-brach', cx, cy, 1.1) if dinge else abgesteckt(cx - 32, cy - 26, 64, 34)), ('offen', setze('traenke-leer', cx, cy, 1.1) + setze('spaten', cx + 34, cy + 2, 1.1)),
        ('halb', setze('traenke-halb', cx, cy, 1.1) + setze('spaten', cx + 36, cy + 2, 1.1)), ('fertig', (setze('tuff-weiss', cx - 22, cy - 6, 1) + setze('tuff-rosa', cx + 22, cy - 6, 1) if dinge else '') + setze('traenke', cx, cy, 1.1) + kr)])))
    if boden and not dinge:
        F['wiese_d'] = alt


def zu_felder(st, rnd, boden, dinge):
    """Drei groessere Flaechen: Gemuesefeld, Obstgarten, Kreuzgarten."""
    feld = lambda x, y, inhalt: f'<g transform="translate({x} {y})">{inhalt}</g>'
    flaeche = lambda id_, x, y, b, t, hoehe, zust: st.append((hoehe, varianten(f'stelle-{id_}', 'fertig', zust, '', f' data-ort="{n(x + b/2)} {n(y + t/2)}" data-mass="{b} {t}"')))
    # a: Gemuesefeld, rechts neben Station 1
    x, y, (b, t) = 178, 996, GEMUESE
    erde = setze('feld-gemuese', 0, 0)
    hinter = ''.join(setze(f'sonnenblume-{1 + i % 2}', 14 + i * 22.5, 8, .95) for i in range(6))
    flaeche('a', x, y, b, t, y + t, [
        ('zu', feld(x, y, setze('brach-gemuese', 0, 0))), ('offen', feld(x, y, erde + setze('spaten', 112, 76, 1.5))),
        ('halb', feld(x, y, erde + setze('feld-reihen-halb', 0, 0) + setze('spaten', 124, 108, 1.25))),
        ('fertig', feld(x, y, hinter + erde + setze('feld-reihen', 0, 0) + setze('scheuche', 122, 72, 1.02) + kuerbisse(16, t + 5) + setze('kuerbis', 78, t + 7, .8)))])
    # b: Obstgarten, links neben Station 2
    x, y, (b, t) = 10, 796, OBST
    grund, vorn = setze('feld-obst', 0, 0), setze('feld-obst-vorn', 0, 0)
    apf, bir = ('apfelbaum-reich', .62), ('birnbaum-reich', .62)
    flaeche('b', x, y, b, t, y + t, [
        ('zu', feld(x, y, setze('brach-obst', 0, 0))), ('offen', feld(x, y, grund + baeume(b, t, ('setzling', .9), ('setzling', .9)) + vorn + setze('spaten', 84, 92, 1.25))),
        ('halb', feld(x, y, grund + baeume(b, t, ('baum-bluete', .62), ('setzling', .9)) + vorn + setze('spaten', 84, 92, 1.15))),
        ('fertig', feld(x, y, grund + baeume(b, t, [apf, bir, apf], [bir, apf, bir]) + vorn + setze('korb', 84, t + 4, .95) + setze('tuff-rosa', 20, t + 6, .8) + setze('tuff-gelb', 146, t + 6, .8)))])
    # c: Kreuzgarten mit Vogeltraenke, links neben Station 4
    x, y, (rx, ry) = 94, 500, KREUZ
    beet = setze('kreuzbeet', 0, 0)
    kugeln_h = setze('buchs', -13, -34, .7) + setze('buchs', 13, -34, .7)
    kugeln_v = setze('buchs', -13, 47, .7) + setze('buchs', 13, 47, .7)
    flaeche('c', x - rx, y - ry, 2 * rx, 2 * ry, y + ry, [
        ('zu', feld(x, y, setze('brach-kreuz', 0, 0))), ('offen', feld(x, y, beet + setze('traenke-leer', 0, 6, 1) + setze('spaten', 44, 34, 1.3))),
        ('halb', feld(x, y, beet + viertel(2) + viertel(3) + setze('traenke-halb', 0, 6, 1) + setze('spaten', 44, 34, 1.3))),
        ('fertig', feld(x, y, beet + viertel(2) + viertel(3) + kugeln_h + setze('traenke', 0, 6, 1.08) + viertel(1) + viertel(0) + kugeln_v))])


def platzhalter_boden():
    rnd, H = random.Random(77), 540
    ys = [372, 252, 130]
    W = schlange([(200, H + 30), (200, H), (246, 372), (150, 252), (200, 130), (200, 0), (200, -30)])
    B = schlange([(350, H + 30), (350, H), (338, 360), (358, 180), (350, 50), (350, 0), (350, -30)])
    sperr = [(10, 220, 120, 360), (236, 170, 320, 270), (130, 450, 270, H), (0, 430, 136, 520)]
    frei = lambda x, y: not any(a < x < c and b < y < d for a, b, c, d in sperr)
    wp, gr, bd = zonenboden(rnd, H, W, B, frei, ys, ell(76, 344, 44, 15, F['schatten']) + ell(292, 258, 36, 12, F['schatten']))
    st, orte = stationen(wp, ys, True)
    st += mauer_oben(rnd)
    baum(st, 1, 60, 340, 1.02, 1, True, True)
    baum(st, 2, 278, 254, .8, 2, True)
    for y, t_, x, s in [(190, 'busch', 60, 1.1), (214, 'busch', 92, .85), (480, 'lavendel', 300, .95), (150, 'lavendel', 110, .9)]:
        fest(st, y, t_, x, s, gr, True, 'duerrbusch' if t_ == 'busch' else 'halme-2')
    st += [(470, setze('schilf', 308, 470, .9)), (300, setze('schilf', 392, 300, .9)), (120, setze('schilf', 312, 120, .85))]
    bepflanze(random.Random(24), st, pflanzen(random.Random(53), wp, H, orte, sperr), gr, True)
    return schreibe('platzhalter-boden.svg', 'pb-', H, bd, st, [], True, rnd)


def alle():
    print('bereich-1-kraeftig', bereich('bereich-1-kraeftig.svg', dinge=True))
    print('bereich-1-flaechen', bereich('bereich-1-flaechen.svg', felder=True))
    print('bereich-1-boden', bereich('bereich-1-boden.svg', boden=True))
    print('bereich-1-zusammen', bereich('bereich-1-zusammen.svg', felder=True, boden=True, dinge=True))
    print('platzhalter-boden', platzhalter_boden())
