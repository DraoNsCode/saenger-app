"""Zeichnet die drei Bilder der Probe (Baustein B, Teil 1): python probe/werkzeug/zeichne.py

Nur ein Hilfsmittel fuer die Probe, die App braucht es nicht. Der Zufall hat feste Startwerte, jeder Lauf gibt
dieselben Dateien. Achtung: Ein Lauf ueberschreibt Aenderungen, die von Hand in probe/bilder/ gemacht wurden.
"""
import math, os, random
from garten_teile import *

ZIEL = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'bilder')
TITEL = 'Linie oder Zwischenraum'

SCHEIN = ('<radialGradient id="schein"><stop offset="0" stop-color="#ffe9a6" stop-opacity=".95"/>'
          '<stop offset=".45" stop-color="#ffdf80" stop-opacity=".4"/><stop offset="1" stop-color="#ffdf80" stop-opacity="0"/></radialGradient>')


# ---------- gemeinsame Streuung ----------

def streue(rnd, anzahl, frei, w=400, h=600, abstand=24, rand=4):
    ps = []
    versuche = 0
    while len(ps) < anzahl and versuche < 6000:
        versuche += 1
        x, y = rnd.uniform(rand, w - rand), rnd.uniform(rand, h - rand)
        if not frei(x, y):
            continue
        if any(math.hypot(x - a, (y - b) * 1.3) < abstand for a, b in ps):
            continue
        ps.append((x, y))
    return ps


GRAS = ('M-5,0C-4,-3 -5,-6 -6,-8M0,0C0,-4 0,-7 1,-10M5,0C4,-3 6,-5 7,-7')


def gras_symbole():
    blume = lambda c, m: f'<g>{pfad("M0,0L0,-6", "none", F["laub_d"], 1)}' + ''.join(
        ell(2.1 * math.cos(a), -7.5 + 2.1 * math.sin(a), 1.6, 1.6, c) for a in [0, 1.26, 2.51, 3.77, 5.03]) + ell(0, -7.5, 1.3, 1.3, m) + '</g>'
    return [
        symbol('gras', pfad(GRAS, 'none', F['wiese_d'], 1.5)),
        symbol('gaensebl', blume('#fffaf0', F['ringel'])),
        symbol('blau', blume('#a7b7e6', '#f6e7a8')),
    ]


def wiese(rnd, frei, h=600, nur_von_oben=False, dichte=46, flach=.75):
    aus = rect(-20, -20, 440, h + 40, F['wiese'])
    for _ in range(11):
        x, y = rnd.uniform(0, 400), rnd.uniform(0, h)
        aus += pfad(fleck(x, y, rnd.uniform(40, 85), rnd.uniform(26, 50) * flach, rnd), F['wiese_h'] if rnd.random() < .55 else F['wiese_d'], extra=' fill-opacity=".2"')
    for x, y in streue(rnd, dichte, frei, h=h):
        z = rnd.random()
        if z < .68:
            aus += setze('gras', x, y, rnd.uniform(.75, 1.1))
        elif z < .86:
            aus += setze('gaensebl', x, y, rnd.uniform(.8, 1.1))
        else:
            aus += setze('blau', x, y, rnd.uniform(.8, 1.1))
    return aus


def abstand_zu(ps, x, y, qy=1.0):
    return min(math.hypot(x - p[0], (y - p[1]) / qy) for p in ps)


def weg_bild(segs, rnd, breite=50, quetsch=1.0, steinchen=70, trans='', schritte=60, dicht=4):
    """Kiesweg; quetsch < 1 drueckt ihn fuer die Schraegsicht zusammen, trans setzt ihn auf die isometrische Flaeche."""
    tr = f' transform="{trans}"' if trans else f' transform="scale(1 {quetsch})"' if quetsch != 1 else ''
    d = kurve_d(segs)
    aus = f'<g{tr}>'
    aus += pfad(d, 'none', F['wiese_d'], breite + 11)
    aus += pfad(d, 'none', F['weg_d'], breite + 6)
    aus += pfad(d, 'none', F['weg'], breite)
    aus += pfad(d, 'none', F['weg_h'], breite * .5, ' stroke-opacity=".5"')
    pk = kurve(segs, 60)
    for _ in range(steinchen):
        x, y, dx, dy = rnd.choice(pk)
        q = rnd.uniform(-breite * .42, breite * .42)
        aus += ell(x - dy * q, y + dx * q, rnd.uniform(1.2, 2.4), rnd.uniform(.9, 1.7), F['kies'] if rnd.random() < .7 else F['weg_h'])
    # Randsteine in gleichem Abstand
    laenge, letzter = 0, pk[0]
    naechster = 4
    for x, y, dx, dy in pk:
        laenge += math.hypot(x - letzter[0], y - letzter[1])
        letzter = (x, y)
        if laenge < naechster:
            continue
        naechster = laenge + 12.5
        for s in (-1, 1):
            if rnd.random() < .88:
                q = s * (breite / 2 + 2.5)
                w = math.degrees(math.atan2(dy, dx))
                aus += (f'<g transform="translate({n(x-dy*q)} {n(y+dx*q)}) rotate({n(w)})">'
                        + rect(-rnd.uniform(4, 5.4), -2.6, rnd.uniform(8, 10.6), 5.2, rnd.choice([F['stein'], F['stein_h'], F['stein_s']]), 2.2, F['stein_d'], .9) + '</g>')
    return aus + '</g>'


def bach_bild(segs, rnd, breite=36, quetsch=1.0, tiefe=0, trans=''):
    tr = f' transform="{trans}"' if trans else f' transform="scale(1 {quetsch})"' if quetsch != 1 else ''
    runter = (lambda t: f'translate({n(-t)} {n(-t)})') if trans else (lambda t: f'translate(0 {n(t)})')
    d = kurve_d(segs)
    aus = f'<g{tr}>' + pfad(d, 'none', F['ufer'], breite + 14)
    if tiefe:
        aus += pfad(d, 'none', F['erde_d'], breite + 5)
        aus += f'<g transform="{runter(tiefe)}">' + pfad(d, 'none', F['wasser_d'], breite) + '</g>'
        aus += f'<g transform="{runter(tiefe+2)}">' + pfad(d, 'none', F['wasser'], breite - 4) + '</g>'
    else:
        aus += pfad(d, 'none', F['wasser_d'], breite + 3)
        aus += f'<g transform="translate(2 2)">' + pfad(d, 'none', F['wasser'], breite - 5) + '</g>'
    pk = kurve(segs, 60)

    def versetzt(q):
        ps = [(x - dy * q + (-tiefe if trans else 0), y + dx * q + (-tiefe if trans else tiefe)) for x, y, dx, dy in pk[::5]]
        return weich(ps, zu=False)
    for q, da, w, o in [(-8, '16 26', 2.2, .9), (3, '22 34', 2.6, .8), (10, '10 30', 1.8, .8)]:
        aus += f'<path class="g-fliesst" d="{versetzt(q)}" fill="none" stroke="{F["wasser_h"]}" stroke-width="{w}" stroke-linecap="round" stroke-dasharray="{da}" stroke-opacity="{o}"/>'
    aus += '</g>'
    return aus


def ufersteine(segs, rnd, breite, quetsch=1.0, schritt=7, seite=False):
    pk = kurve(segs, 60)
    aus = ''
    for i in range(2, len(pk), schritt):
        x, y, dx, dy = pk[i]
        for s in (-1, 1):
            if rnd.random() < .5:
                q = s * (breite / 2 + rnd.uniform(1, 5))
                px, py = x - dy * q, (y + dx * q) * quetsch
                r = rnd.uniform(3.4, 6.5)
                ry = r * (.72 if not seite else .62)
                aus += ell(px + 1.2, py + 1.6, r, ry, F['schatten'], extra=' fill-opacity=".22"')
                aus += ell(px, py, r, ry, rnd.choice([F['stein'], F['stein_s'], F['stein_h']]), F['stein_d'], 1)
                aus += ell(px - r * .25, py - ry * .35, r * .4, ry * .3, F['stein_h'], extra=' fill-opacity=".8"')
    return aus


def mauersteine(x0, x1, y0, y1, reihen, rnd, farben=None, rmax=34):
    """Verband aus unregelmaessigen Steinen (Ansicht von vorn oder von oben)."""
    farben = farben or [F['stein'], F['stein_s'], F['stein_h'], F['stein']]
    aus = rect(x0, y0, x1 - x0, y1 - y0, F['fuge'])
    h = (y1 - y0) / reihen
    for r in range(reihen):
        x = x0 - rnd.uniform(0, 14)
        while x < x1:
            w = rnd.uniform(16, rmax)
            a, b = max(x, x0), min(x + w, x1)
            if b - a > 3:
                aus += rect(a + .7, y0 + r * h + .7, b - a - 1.4, h - 1.4, rnd.choice(farben), 2.2)
            x += w
    return aus


# ======================================================================
# 1. VON OBEN
# ======================================================================

def kohl_oben(id_, g, d, h):
    aus = ell(1.6, 2, 10.5, 10, F['schatten'], extra=' fill-opacity=".28"')
    for i in range(7):
        a = i * 360 / 7
        aus += f'<g transform="rotate({n(a)})">' + ell(0, -5.6, 4.6, 5.6, g, d, .9) + '</g>'
    for i in range(5):
        aus += f'<g transform="rotate({n(i*72+20)})">' + ell(0, -2.8, 3.2, 3.8, h, d, .7) + '</g>'
    return symbol(id_, aus + ell(0, 0, 2.5, 2.5, h, d, .7))


def salat_oben(id_):
    r = random.Random(4)
    return symbol(id_, ell(1.6, 2, 9.5, 9, F['schatten'], extra=' fill-opacity=".28"')
                  + pfad(wolke(0, 0, 8, 8, 11, r, 0, 1.0), F['salat'], F['salat_d'], .9)
                  + pfad(wolke(0, 0, 5, 5, 8, r, 0, 1.0), F['salat_h'], F['salat_d'], .7)
                  + pfad(wolke(0, 0, 2.2, 2.2, 5, r, 0, 1.0), '#e4f0b8', F['salat_d'], .6))


def lauch_oben(id_):
    aus = ell(1.4, 2, 8, 7, F['schatten'], extra=' fill-opacity=".22"')
    for a in [10, 70, 130, 190, 250, 310]:
        aus += f'<g transform="rotate({a})">' + pfad('M-1.4,0C-2.4,-5 -1.4,-9 0,-11.5C1.4,-9 2.4,-5 1.4,0Z', F['laub_h'] if a % 120 == 10 else F['laub'], F['laub_d'], .8) + '</g>'
    return symbol(id_, aus + ell(0, 0, 2.3, 2.3, '#f2efdd', F['laub_d'], .7))


def ringel_oben(id_):
    aus = ell(1.6, 2, 9.5, 9, F['schatten'], extra=' fill-opacity=".24"') + pfad(wolke(0, 0, 8, 8, 9, random.Random(2), 0, 1.0), F['laub'], F['laub_d'], .9)
    for x, y, r in [(-3.6, -2.6, 4.2), (3.8, -1.6, 4.2), (-.4, 4.2, 4.2)]:
        aus += f'<g transform="translate({x} {y})">' + pfad(wolke(0, 0, r, r, 9, random.Random(3), 0, 1.0), F['ringel'], F['ringel_d'], .8) + ell(0, 0, r * .4, r * .4, F['ringel_d']) + '</g>'
    return symbol(id_, aus)


def lavendel_oben(id_):
    r = random.Random(9)
    aus = ell(3, 3, 15, 14, F['schatten'], extra=' fill-opacity=".24"') + pfad(wolke(0, 0, 13, 12, 12, r, .03, 1.0), F['laub'], F['laub_d'], 1.1)
    for i in range(15):
        a = i * 24 + r.uniform(-6, 6)
        l = r.uniform(8.5, 14.5)
        aus += f'<g transform="rotate({n(a)})">' + ell(0, -l, 1.9, 4, F['lav'], F['lav_d'], .7) + '</g>'
    for i in range(6):
        aus += f'<g transform="rotate({i*60})">' + ell(0, -4.5, 1.7, 3.4, F['lav'], F['lav_d'], .7) + '</g>'
    return symbol(id_, aus)


def baum_oben(id_, r, rnd, aepfel=True):
    aus = pfad(wolke(0, 0, r, r * .97, 15, rnd), F['laub'], F['laub_d'], 1.5)
    aus += pfad(wolke(r * .1, r * .14, r * .8, r * .76, 13, rnd), F['laub_d'], extra=' fill-opacity=".28"')
    aus += pfad(wolke(-r * .12, -r * .12, r * .68, r * .66, 12, rnd), F['laub_h'])
    aus += pfad(wolke(-r * .2, -r * .24, r * .42, r * .38, 10, rnd), F['laub_hh'])
    if aepfel:
        for _ in range(8):
            a, q = rnd.uniform(0, 6.28), rnd.uniform(.35, .88) * r
            x, y = q * math.cos(a), q * math.sin(a)
            aus += ell(x, y, 3.8, 3.8, F['apfel'], F['apfel_d'], .9) + ell(x - 1.1, y - 1.2, 1.1, 1, '#eb8f78')
    return symbol(id_, aus)


def figur_oben():
    return (
        ell(5, 6, 14, 12, F['schatten'], extra=' fill-opacity=".3"')
        + pfad('M-17,2C-17,-5 -9,-8 0,-8C9,-8 17,-5 17,2C17,8 9,10 0,10C-9,10 -17,8 -17,2Z', F['mantel'], F['mantel_d'], 1.3)
        + pfad('M-11,-6C-13,-12 -9,-16 -6,-17M11,-6C13,-12 9,-16 6,-17', 'none', F['mantel_d'], 5.6)
        + pfad('M-11,-6C-13,-12 -9,-16 -6,-17M11,-6C13,-12 9,-16 6,-17', 'none', F['mantel'], 3.4)
        + rect(-9, -24, 18, 11, F['papier'], 1, F['gold_d'], 1.1) + pfad('M0,-24L0,-13M-7,-21L-2,-21M-7,-18.5L-2,-18.5M-7,-16L-2,-16M2,-21L7,-21M2,-18.5L7,-18.5M2,-16L7,-16', 'none', F['gold_d'], .7)
        + ell(0, 1, 14, 13.4, F['stroh'], F['stroh_d'], 1.3) + ell(0, 1, 10.8, 10.4, 'none', F['stroh_d'], .6)
        + ell(0, 1, 7.6, 7.3, F['band']) + ell(0, 1, 6.2, 6, F['stroh_h'], F['stroh_d'], .9)
    )


def oben():
    rnd = random.Random(11)
    W = [(200, 620), (200, 580), (200, 560), (200, 520), (200, 450), (262, 430), (252, 345), (242, 268), (140, 258), (142, 168), (144, 96), (200, 70), (200, -20)]
    B = [(352, -20), (322, 60), (382, 160), (352, 260), (326, 350), (330, 420), (346, 500), (350, 540), (340, 580), (348, 620)]
    wp, bp = kurve(W), kurve(B)
    S = bei_y(wp, 322)
    FG = bei_y(wp, 418)

    def frei(x, y):
        return (abstand_zu(wp, x, y) > 38 and abstand_zu(bp, x, y) > 32 and not (34 < x < 180 and 322 < y < 470)
                and not (505 < y < 572) and math.hypot(x - 66, y - 215) > 62 and math.hypot(x - 262, y - 128) > 48)
    defs = [SCHEIN] + gras_symbole() + [
        kohl_oben('kohl', F['kohl'], F['kohl_d'], F['kohl_h']), kohl_oben('rotkohl', F['rot'], F['rot_d'], F['rot_h']),
        salat_oben('salat'), lauch_oben('lauch'), ringel_oben('ringelblume'), lavendel_oben('lavendel'),
        baum_oben('apfelbaum', 55, random.Random(21)), baum_oben('birnbaum', 42, random.Random(5), False),
        symbol('figur', figur_oben()),
        symbol('rosette', rosette(16)),
    ]
    e = []
    grund = wiese(rnd, frei)
    grund += rect(-20, 534, 440, 90, F['aussen'])
    for x, y in streue(rnd, 12, lambda x, y: y > 578 and abs(x - 200) > 40 and abs(x - 345) > 34):
        grund += setze('gras', x, y, .9)
    e.append(ebene('grund', 'Grund', grund))
    e.append(ebene('bach', 'Bach', bach_bild(B, rnd) + ufersteine(B, rnd, 38)))
    e.append(ebene('weg', 'Weg', weg_bild(W, rnd)))

    # Schatten
    sch = f'<rect x="-14" y="530" width="430" height="28" />' + '<rect x="160" y="512" width="100" height="72" rx="3"/>'
    sch += f'<g transform="translate(80 233)">' + pfad(wolke(0, 0, 55, 53, 15, random.Random(21)), F['schatten']) + '</g>'
    sch += f'<g transform="translate(273 142)">' + pfad(wolke(0, 0, 42, 40, 15, random.Random(5)), F['schatten']) + '</g>'
    sch += '<rect x="50" y="338" width="126" height="126" rx="3"/>'
    e.append(ebene('schatten', 'Schatten', schatten(sch)))

    # Beet: fuenf Reihen
    x0, y0, g = 44, 332, 124
    b = rect(x0, y0, g, g, F['holz'], 3, F['holz_d'], 1.6)
    b += pfad(f'M{x0+1},{y0+3.5}L{x0+g-1},{y0+3.5}M{x0+3.5},{y0+1}L{x0+3.5},{y0+g-1}', 'none', F['holz_h'], 2)
    b += rect(x0 + 7, y0 + 7, g - 14, g - 14, F['erde'], 2, F['erde_d'], 1.2)
    reihen = [y0 + 20 + k * 21 for k in range(5)]
    for y in reihen:
        b += pfad(f'M{x0+12},{y+1.4}L{x0+g-12},{y+1.4}', 'none', F['erde_d'], 9) + pfad(f'M{x0+12},{y}L{x0+g-12},{y}', 'none', F['erde_h'], 7)
        b += pfad(f'M{x0+14},{y-2}L{x0+g-14},{y-2}', 'none', '#a98462', 1.4, ' stroke-opacity=".7"')
    e.append(ebene('beet', 'Beet', b))
    leer = f'<g transform="translate({x0+86} {y0+74}) rotate(-36)">' + schatten('<rect x="-3" y="-36" width="9" height="70" rx="3"/>', .3)
    leer += pfad('M-6.5,14L6.5,14L5.6,29C3,33 -3,33 -5.6,29Z', '#aab3bb', '#5d666f', 1.2) + pfad('M0,14L0,-34', 'none', F['holz_d'], 5) + pfad('M0,14L0,-34', 'none', F['holz_h'], 2.6)
    leer += pfad('M-6,-34L6,-34', 'none', F['holz_d'], 5) + '</g>'
    e.append(ebene('beet-leer', 'Beet leer (offene Stelle)', leer))
    pf = ''
    arten = ['lauch', 'ringelblume', 'kohl', 'salat', 'rotkohl']
    for k, y in enumerate(reihen):
        m = 5
        for i in range(m):
            x = x0 + 18 + i * (g - 36) / (m - 1)
            pf += f'<g transform="translate({n(x+rnd.uniform(-.8,.8))} {n(y+rnd.uniform(-.8,.8))}) rotate({n(rnd.uniform(0,360)) if arten[k]!="ringelblume" else n(rnd.uniform(-20,20))}) scale(.98)"><use href="#{arten[k]}"/></g>'
    e.append(ebene('beet-bepflanzt', 'Beet bepflanzt', pf))

    # Lavendel am Weg, Baeume
    e.append(ebene('pflanzen', 'Pflanzen', setze('lavendel', 286, 468) + setze('lavendel', 262, 492, .9) + setze('lavendel', 300, 440, .85) + setze('lavendel', 92, 120, .9)))

    # Station
    s = f'<g transform="translate({S[0]} {S[1]})">' + schatten('<circle cx="3" cy="4" r="29"/>')
    stein = ''
    for i in range(12):
        a0, a1 = math.radians(i * 30 + 1.6), math.radians(i * 30 + 28.4)
        ps = [(28 * math.cos(a0), 28 * math.sin(a0)), (28 * math.cos((a0 + a1) / 2) * 1.02, 28 * math.sin((a0 + a1) / 2) * 1.02), (28 * math.cos(a1), 28 * math.sin(a1)), (20 * math.cos(a1), 20 * math.sin(a1)), (20 * math.cos(a0), 20 * math.sin(a0))]
        stein += poly(ps, [F['stein'], F['stein_h'], F['stein_s']][i % 3], F['stein_d'], 1)
    s += ell(0, 0, 28.6, 28.6, F['fuge']) + stein + ell(0, 0, 19.4, 19.4, F['stein_h'], F['stein_d'], 1.2) + '</g>'
    e.append(ebene('station', 'Station', s))
    e.append(ebene('station-naechste', 'Station als Nächstes', f'<g transform="translate({S[0]} {S[1]})"><circle class="g-halo" r="33" fill="none" stroke="{F["gold_h"]}" stroke-width="5" stroke-opacity=".85"/><circle r="24" fill="none" stroke="{F["gold_d"]}" stroke-width="8.4"/><circle r="24" fill="none" stroke="{F["gold"]}" stroke-width="6"/><circle r="7" fill="{F["gold"]}" stroke="{F["gold_d"]}" stroke-width="1.2"/></g>'))
    e.append(ebene('station-geschafft', 'Station geschafft', setze('rosette', *S, 1.12)))

    # Mauer und Tor
    m = mauersteine(-10, 410, 520, 546, 2, rnd, rmax=30)
    m += pfad('M-10,520L410,520', 'none', F['stein_h'], 1.6) + pfad('M-10,546L410,546', 'none', F['stein_d'], 2)
    t = rect(150, 498, 100, 35, F['dach_h'], 0) + rect(150, 533, 100, 35, F['dach_s'], 0)
    for k in range(5):
        y = 498 + k * 7
        t += pfad(''.join([f'M150,{y+7}'] + [f'a5,4 0 0 1 10,0' for _ in range(10)]), 'none', F['dach'], 1.5)
        y2 = 533 + k * 7
        t += pfad(''.join([f'M150,{y2+3}'] + [f'a5,4 0 0 0 10,0' for _ in range(10)]), 'none', F['dach_d'], 1.5)
    t += rect(150, 498, 100, 70, 'none', 1, F['dach_d'], 1.8)
    t += rect(147, 529, 106, 8, F['dach'], 4, F['dach_d'], 1.4)
    for i in range(7):
        t += pfad(f'M{159+i*14},529.6L{159+i*14},536.4', 'none', F['dach_d'], 1)
    t += pfad('M200,524L200,542M193,531L207,531', 'none', F['gold_d'], 4.6) + pfad('M200,524L200,542M193,531L207,531', 'none', F['gold_h'], 2.4)
    e.append(ebene('mauer', 'Mauer', m))
    e.append(ebene('tor', 'Tor', t))
    e.append(ebene('position', 'Position des Sängers', setze('figur', FG[0], FG[1], 1.12)))
    e.append(ebene('baeume', 'Bäume', setze('apfelbaum', 66, 215) + setze('birnbaum', 262, 128)))
    e.append(ebene('schild', 'Namensschild', schild(S[0] - 34, 258, TITEL, 190, (34, 13))))
    return datei(f'{ZIEL}/ansicht-oben.svg', 'o-', 'Ausschnitt des Gartens, von oben gesehen', 'Probe Baustein B, Weg 1, Ansicht von oben. Ebenen sind benannte Gruppen, Bauteile stehen als Symbole in defs.', defs, e)


# ======================================================================
# 2. SCHRAEG VON OBEN
# ======================================================================

def seiten_symbole():
    return [
        symbol('kohl', kohl_seite(F['kohl'], F['kohl_d'], F['kohl_h'])), symbol('rotkohl', kohl_seite(F['rot'], F['rot_d'], F['rot_h'])),
        symbol('salat', salat_seite()), symbol('lauch', lauch_seite()), symbol('ringelblume', ringel_seite()), symbol('lavendel', lavendel_seite()),
        symbol('apfelbaum', baum_seite(random.Random(21))), symbol('birnbaum', baum_seite(random.Random(8), False)), symbol('busch', busch_seite(random.Random(3))),
        symbol('figur', figur_seite()), symbol('laterne', laterne_seite()), symbol('spaten', spaten_seite()),
    ]


def station_seite(x, y, rx, ry, dicke):
    s = f'<g transform="translate({x} {y})">' + schatten(ell(5, dicke + 3, rx + 2, ry + 1, F['schatten']), .22)
    s += ell(0, dicke, rx, ry, F['stein_d'], F['fuge'], 1.2) + ell(0, 0, rx, ry, F['fuge'])
    for i in range(12):
        a0, a1 = math.radians(i * 30 + 1.6), math.radians(i * 30 + 28.4)
        am = (a0 + a1) / 2
        ps = [(rx * .99 * math.cos(a), ry * .99 * math.sin(a)) for a in (a0, am, a1)] + [(rx * .72 * math.cos(a), ry * .72 * math.sin(a)) for a in (a1, a0)]
        s += poly(ps, [F['stein'], F['stein_h'], F['stein_s']][i % 3], F['stein_d'], .9)
    s += ell(0, 0, rx * .69, ry * .69, F['stein_h'], F['stein_d'], 1.2) + '</g>'
    na = f'<g transform="translate({x} {y})"><ellipse class="g-halo" rx="{n(rx*1.16)}" ry="{n(ry*1.16)}" fill="none" stroke="{F["gold_h"]}" stroke-width="5" stroke-opacity=".85"/>'
    na += f'<ellipse rx="{n(rx*.86)}" ry="{n(ry*.86)}" fill="none" stroke="{F["gold_d"]}" stroke-width="7.6"/><ellipse rx="{n(rx*.86)}" ry="{n(ry*.86)}" fill="none" stroke="{F["gold"]}" stroke-width="5.4"/>'
    na += ell(0, 0, 7, 7 * ry / rx, F['gold'], F['gold_d'], 1.2) + '</g>'
    return s, na


def torhaus(rnd):
    """Torhaus von vorn, Fusslinie bei y = 541, Mitte bei x = 200."""
    xl, xr, traufe, first, unten_ = 150, 250, 450, 400, 541
    t = mauersteine(xl, xr, traufe - 8, unten_, 7, rnd, [F['stein'], F['stein_h'], F['stein_s'], F['stein']], 28)
    t += rect(xl, traufe - 8, xr - xl, 16, F['schatten'], extra=' fill-opacity=".26"') + rect(xl, traufe - 8, xr - xl, unten_ - traufe + 8, 'none', 0, F['stein_d'], 1.5)
    t += rect(xr - 5, traufe, 5, unten_ - traufe, F['schatten'], extra=' fill-opacity=".18"')
    oy = 496
    bogen = lambda r: f'M{200-r},{unten_}L{200-r},{oy}A{r},{r} 0 0 1 {200+r},{oy}L{200+r},{unten_}Z'
    t += pfad(bogen(37), F['stein_d'])
    for i in range(9):
        a0, a1 = math.radians(180 + i * 20 + 1.2), math.radians(180 + (i + 1) * 20 - 1.2)
        ps = [(200 + r * math.cos(a), oy + r * math.sin(a)) for r, a in [(37, a0), (37, (a0 + a1) / 2), (37, a1), (28, a1), (28, a0)]]
        t += poly(ps, F['stein_h'] if i % 2 == 0 else F['stein'], F['stein_d'], .9)
    for k in range(3):
        for sx in (163, 228.2):
            t += rect(sx + .6, oy + k * 15, 8, 14, F['stein_h'] if k % 2 else F['stein'], 1.5, F['stein_d'], .9)
    t += f'<clipPath id="bogen"><path d="{bogen(28)}"/></clipPath><g clip-path="url(#bogen)">'
    t += rect(170, 460, 60, 84, '#5d7a49') + poly([(172, 541), (228, 541), (222, 478), (178, 478)], F['weg_d']) + poly([(175, 541), (225, 541), (219, 478), (181, 478)], F['weg'])
    t += pfad(wolke(180, 474, 14, 10, 8, random.Random(2)), F['laub']) + pfad(wolke(220, 472, 14, 10, 8, random.Random(6)), F['laub_h'])
    t += rect(170, 460, 60, 84, F['schatten'], extra=' fill-opacity=".2"') + '</g>'
    for x_a, x_b in [(172, 183), (228, 217)]:
        t += poly([(x_a, unten_), (x_a, 494), (x_b, 481), (x_b, 531)], F['holz'], F['holz_d'], 1.2)
        t += pfad(f'M{(x_a+x_b)/2},{536}L{(x_a+x_b)/2},{488}M{x_a},{507}L{x_b},{497}M{x_a},{527}L{x_b},{518}', 'none', F['holz_d'], 1.2)
    ul, ur, ol, or_ = xl - 11, xr + 11, xl + 9, xr - 9
    dachform = [(ul, traufe), (ur, traufe), (or_, first), (ol, first)]
    t += poly(dachform, F['dach'], F['dach_d'], 1.6)
    t += f'<clipPath id="dach"><polygon points="{pkt(dachform)}"/></clipPath><g clip-path="url(#dach)">'
    for k in range(6):
        y, vx = traufe - k * 8.6, ul - 6 - (k % 2) * 5.5
        d = f'M{n(vx)},{n(y-12)}L{n(vx)},{n(y-3.4)}' + ''.join('a5.5,4.4 0 0 0 11,0' for _ in range(14)) + f'L{n(vx+154)},{n(y-12)}Z'
        t += pfad(d, F['dach'] if k % 2 else F['dach_h'], F['dach_s'], 1.1)
    t += poly([(or_ - 14, first), (or_, first), (ur, traufe), (ur - 15, traufe)], F['dach_d'], extra=' fill-opacity=".28"') + '</g>'
    t += poly(dachform, 'none', F['dach_d'], 1.6)
    t += rect(ol - 3, first - 5, or_ - ol + 6, 8.6, F['dach_h'], 4.3, F['dach_d'], 1.4)
    for i in range(6):
        t += pfad(f'M{ol+6+i*14},{first-4.4}L{ol+6+i*14},{first+3}', 'none', F['dach_d'], 1)
    t += pfad(f'M200,{first-5}l0,-20m-7,6.5l14,0', 'none', F['gold_d'], 4.4) + pfad(f'M200,{first-5}l0,-20m-7,6.5l14,0', 'none', F['gold_h'], 2.2)
    return t


def schraeg():
    rnd = random.Random(17)
    Q = .74
    W = [(200, 840), (200, 800), (200, 780), (200, 730), (200, 610), (276, 600), (262, 490), (250, 396), (136, 388), (138, 262), (140, 150), (200, 110), (200, -30)]
    B = [(350, -30), (318, 90), (384, 220), (352, 360), (324, 480), (330, 570), (348, 680), (352, 740), (344, 780), (350, 840)]
    wp = [(x, y * Q) for x, y, *_ in kurve(W)]
    bp = [(x, y * Q) for x, y, *_ in kurve(B)]
    S = bei_y(wp, 298)
    FG = bei_y(wp, 396)

    def frei(x, y):
        return (abstand_zu(wp, x, y, .8) > 40 and abstand_zu(bp, x, y, .8) > 34 and not (6 < x < 162 and 284 < y < 420)
                and not (434 < y < 560 and 126 < x < 274) and not (460 < y < 552) and not (30 < x < 110 and 170 < y < 280) and not (236 < x < 310 and 100 < y < 190))
    defs = [SCHEIN] + gras_symbole() + seiten_symbole() + [symbol('rosette', rosette(16, .7))]
    e = []
    grund = wiese(rnd, frei)
    grund += rect(-20, 536, 440, 90, F['aussen'])
    for x, y in streue(rnd, 14, lambda x, y: y > 562 and abs(x - 200) > 46 and abs(x - 348) > 38):
        grund += setze('gras', x, y, .95)
    e.append(ebene('grund', 'Grund', grund))
    e.append(ebene('bach', 'Bach', bach_bild(B, rnd, 36, Q, 7) + ufersteine(B, rnd, 38, Q, 7, True)))
    e.append(ebene('weg', 'Weg', weg_bild(W, rnd, 50, Q)))

    sch = ell(88, 262, 46, 17, F['schatten']) + ell(292, 178, 36, 13, F['schatten'])
    sch += poly([(20, 396), (144, 396), (156, 408), (156, 322), (144, 312)], F['schatten'])
    sch += poly([(-10, 540), (410, 540), (410, 552), (-10, 552)], F['schatten']) + poly([(262, 540), (290, 552), (290, 540)], F['schatten'])
    e.append(ebene('schatten', 'Schatten', schatten(sch)))

    # Hochbeet
    x0, y0, b, t, hoch = 18, 296, 126, 92, 13
    bt = rect(x0, y0 + t, b, hoch, F['holz_d'], 1) + rect(x0, y0 + t, b, hoch - 1.5, F['holz'], 1, F['holz_d'], 1.4)
    bt += pfad(f'M{x0+2},{y0+t+6}L{x0+b-2},{y0+t+6}', 'none', F['holz_d'], .9) + pfad(f'M{x0+42},{y0+t}L{x0+42},{y0+t+hoch-2}M{x0+84},{y0+t}L{x0+84},{y0+t+hoch-2}', 'none', F['holz_d'], .9)
    bt += rect(x0, y0, b, t, F['holz_h'], 2, F['holz_d'], 1.6)
    bt += rect(x0 + 6, y0 + 5, b - 12, t - 10, F['erde'], 1.5, F['erde_d'], 1.4)
    bt += rect(x0 + 6, y0 + 5, b - 12, 4, F['erde_d'], 1)
    reihen = [y0 + 19 + k * 16 for k in range(5)]
    for y in reihen:
        bt += pfad(f'M{x0+13},{y+1.6}L{x0+b-13},{y+1.6}', 'none', F['erde_d'], 7) + pfad(f'M{x0+13},{y}L{x0+b-13},{y}', 'none', F['erde_h'], 5)
        bt += pfad(f'M{x0+15},{y-1.6}L{x0+b-15},{y-1.6}', 'none', '#a98462', 1.2, ' stroke-opacity=".7"')
    e.append(ebene('beet', 'Beet', bt))
    e.append(ebene('beet-leer', 'Beet leer (offene Stelle)', setze('spaten', x0 + 92, y0 + 62, 1.35)))
    pf = ''
    for k, art in enumerate(['lauch', 'ringelblume', 'kohl', 'salat', 'rotkohl']):
        for i in range(5):
            pf += setze(art, x0 + 19 + i * (b - 38) / 4 + rnd.uniform(-.8, .8), reihen[k] + 2, 1.02)
    e.append(ebene('beet-bepflanzt', 'Beet bepflanzt', pf))

    s, na = station_seite(*S, 30, 21, 5)
    e.append(ebene('station', 'Station', s))
    e.append(ebene('station-naechste', 'Station als Nächstes', na + setze('laterne', S[0] + 34, S[1] + 4, 1.25)))
    e.append(ebene('station-geschafft', 'Station geschafft', setze('rosette', *S, 1.15)))
    e.append(ebene('baeume', 'Bäume und Sträucher', setze('birnbaum', 276, 176, .86) + setze('apfelbaum', 70, 258, 1.05)
                   + setze('lavendel', 92, 112) + setze('lavendel', 308, 424, .9) + setze('lavendel', 290, 446, 1) + setze('lavendel', 312, 462, .9) + setze('busch', 34, 466, 1.05) + setze('busch', 74, 470, .85)))
    e.append(ebene('position', 'Position des Sängers', ell(FG[0] + 4, FG[1] + 1, 17, 5, F['schatten'], extra=' fill-opacity=".28"') + setze('figur', FG[0], FG[1], 1.22)))

    # Mauer mit Bachdurchlass
    m = rect(-10, 478, 420, 15, F['stein_h'], 0, F['stein_d'], 1)
    for i in range(16):
        m += pfad(f'M{-6+i*27},478L{-6+i*27},493', 'none', F['stein_d'], 1)
    m += mauersteine(-10, 410, 493, 541, 4, rnd, [F['stein'], F['stein_s'], F['stein_s'], F['stein']], 36)
    m += rect(-10, 493, 420, 4, F['schatten'], extra=' fill-opacity=".16"')
    m += pfad('M326,541L326,522A22,19 0 0 1 370,522L370,541Z', F['stein_d'], F['fuge'], 1) + pfad('M331,541L331,524A17,15 0 0 1 365,524L365,541Z', '#2f4a58')
    m += pfad('M331,541L331,535C340,531 356,531 365,535L365,541Z', F['wasser'])
    m += pfad('M331,534C342,530 354,530 365,534', 'none', F['wasser_h'], 1.6)
    e.append(ebene('mauer', 'Mauer', m))

    t = torhaus(rnd)
    e.append(ebene('tor', 'Tor', t))
    vorn = setze('busch', 112, 548, .9) + setze('lavendel', 274, 548, .95) + setze('lavendel', 134, 552, .85) + setze('busch', 298, 549, .7)
    e.append(ebene('vordergrund', 'Vordergrund', vorn))
    e.append(ebene('schild', 'Namensschild', schild(S[0] + 12, 238, TITEL, 190, (-12, 18))))
    return datei(f'{ZIEL}/ansicht-schraeg.svg', 's-', 'Ausschnitt des Gartens, schräg von oben gesehen', 'Probe Baustein B, Weg 1, Ansicht schräg von oben. Ebenen sind benannte Gruppen, Bauteile stehen als Symbole in defs.', defs, e)


# ======================================================================
# 3. ISOMETRISCH
# ======================================================================

C30, S30 = math.cos(math.pi / 6), .5
OX, OY = 200, 540


def P(u, v, z=0):
    return (OX + (v - u) * C30, OY - (u + v) * S30 - z)


def fl(*punkte):
    return [P(*p) for p in punkte]


def iso_steine(aus, achse, fest, a0, a1, z0, z1, reihen, rnd, farben, wmax=34):
    """Steinverband auf einer senkrechten Flaeche. achse 'u': Flaeche v=fest, achse 'v': Flaeche u=fest."""
    q = (lambda a, z: P(a, fest, z)) if achse == 'u' else (lambda a, z: P(fest, a, z))
    aus += poly([q(a0, z0), q(a1, z0), q(a1, z1), q(a0, z1)], F['fuge'])
    h = (z1 - z0) / reihen
    for r in range(reihen):
        a = a0 - rnd.uniform(0, 14)
        while a < a1:
            w = rnd.uniform(16, wmax)
            x, y = max(a, a0), min(a + w, a1)
            if y - x > 3:
                aus += poly([q(x + .8, z0 + r * h + .7), q(y - .8, z0 + r * h + .7), q(y - .8, z0 + (r + 1) * h - .7), q(x + .8, z0 + (r + 1) * h - .7)], rnd.choice(farben))
            a += w
    return aus


ISO = f'matrix({-C30:.4f} {-S30} {C30:.4f} {-S30} {OX} {OY})'


def iso():
    rnd = random.Random(29)
    weg_uv = [(110, -130), (110, 230), (350, 230), (350, 470), (590, 470), (590, 660)]
    bach_uv = [(250, 640), (250, 336), (46, 336), (46, 186), (-130, 186)]
    W, B = zug_kurve(weg_uv, 78), zug_kurve(bach_uv, 36)
    wuv, buv = kurve(W, 40), kurve(B, 40)
    wp, bp = [P(u, v) for u, v, *_ in wuv], [P(u, v) for u, v, *_ in buv]
    S_uv = min(wuv, key=lambda p: math.hypot(p[0] - 236, p[1] - 230))[:2]
    S = P(*S_uv)
    beet = (240, 328, 104, 192)

    def uv(x, y):
        a, b_ = (x - OX) / C30, (OY - y) / S30
        return ((b_ - a) / 2, (b_ + a) / 2)

    def frei(x, y):
        u, v = uv(x, y)
        if u < 34 or v < 34:
            return False
        if abstand_zu(wp, x, y, .62) > 46 and abstand_zu(bp, x, y, .62) > 40:
            return not (beet[0] - 20 < u < beet[1] + 16 and beet[2] - 20 < v < beet[3] + 16)
        return False
    defs = [SCHEIN] + gras_symbole() + seiten_symbole() + [symbol('rosette', rosette(16, .577))]
    e = []
    grund = wiese(rnd, frei, flach=.7)
    grund += poly([P(0, 0), P(320, 0), (-100, 640), (500, 640), P(0, 320)], F['aussen'])
    for x, y in streue(rnd, 14, lambda x, y: (uv(x, y)[0] < -18 or uv(x, y)[1] < -18) and abstand_zu(wp, x, y, .62) > 46 and abstand_zu(bp, x, y, .62) > 40):
        grund += setze('gras', x, y, .95)
    e.append(ebene('grund', 'Grund', grund))
    bs = ''
    for i in range(4, len(buv), 7):
        u, v, du, dv = buv[i]
        for sg in (-1, 1):
            q = sg * 24
            uu, vv = u - dv * q, v + du * q
            if rnd.random() < .55 and not (-34 < uu < 34 and vv < 260):
                x, y = P(uu, vv)
                r = rnd.uniform(3.6, 6.2)
                bs += ell(x + 1.2, y + 1.6, r, r * .62, F['schatten'], extra=' fill-opacity=".22"') + ell(x, y, r, r * .62, rnd.choice([F['stein'], F['stein_s'], F['stein_h']]), F['stein_d'], 1)
    e.append(ebene('bach', 'Bach', bach_bild(B, rnd, 38, 1, 7, ISO) + bs))
    e.append(ebene('weg', 'Weg', weg_bild(W, rnd, 50, trans=ISO)))

    sch = poly(fl((0, -6), (0, 250), (-30, 250), (-30, -6)), F['schatten'])
    sch += poly(fl((beet[0], beet[2]), (beet[0], beet[3]), (beet[0] - 16, beet[3] + 4), (beet[0] - 16, beet[2] + 4)), F['schatten'])
    sch += poly(fl((75, 0), (75, 40), (40, 52), (40, 12)), F['schatten'])
    tb1, tb2 = P(452, 285), P(282, 402)
    sch += ell(tb1[0] + 20, tb1[1] + 6, 44, 16, F['schatten']) + ell(tb2[0] + 12, tb2[1] + 3, 28, 10, F['schatten'])
    e.append(ebene('schatten', 'Schatten', schatten(sch)))

    # Beet (Kasten)
    u0, u1, v0, v1 = beet
    hoch = 12
    bt = poly(fl((u0, v0, 0), (u1, v0, 0), (u1, v0, hoch), (u0, v0, hoch)), F['holz_h'], F['holz_d'], 1.3)
    bt += poly(fl((u0, v0, 0), (u0, v1, 0), (u0, v1, hoch), (u0, v0, hoch)), F['holz'], F['holz_d'], 1.3)
    for a in (1 / 3, 2 / 3):
        bt += pfad('M%s,%sL%s,%s' % tuple(n(c) for p in (P(u0 + (u1 - u0) * a, v0, 0), P(u0 + (u1 - u0) * a, v0, hoch)) for c in p), 'none', F['holz_d'], .9)
        bt += pfad('M%s,%sL%s,%s' % tuple(n(c) for p in (P(u0, v0 + (v1 - v0) * a, 0), P(u0, v0 + (v1 - v0) * a, hoch)) for c in p), 'none', F['holz_d'], .9)
    bt += poly(fl((u0, v0, hoch), (u1, v0, hoch), (u1, v1, hoch), (u0, v1, hoch)), F['holz_h'], F['holz_d'], 1.5)
    i_ = 6
    bt += poly(fl((u0 + i_, v0 + i_, hoch), (u1 - i_, v0 + i_, hoch), (u1 - i_, v1 - i_, hoch), (u0 + i_, v1 - i_, hoch)), F['erde'], F['erde_d'], 1.3)
    reihen = [v1 - 15 - k * 14.6 for k in range(5)]
    for v in reihen:
        a, c = P(u0 + 13, v, hoch), P(u1 - 13, v, hoch)
        bt += pfad(f'M{n(a[0])},{n(a[1]+1.6)}L{n(c[0])},{n(c[1]+1.6)}', 'none', F['erde_d'], 6.6) + pfad(f'M{n(a[0])},{n(a[1])}L{n(c[0])},{n(c[1])}', 'none', F['erde_h'], 4.8)
    e.append(ebene('beet', 'Beet', bt))
    sp = P(u0 + 30, v0 + 34, hoch)
    e.append(ebene('beet-leer', 'Beet leer (offene Stelle)', setze('spaten', sp[0], sp[1], 1.35)))
    pf = []
    for k, art in enumerate(['lauch', 'ringelblume', 'kohl', 'salat', 'rotkohl']):
        for i in range(5):
            x, y = P(u0 + 16 + i * (u1 - u0 - 32) / 4, reihen[k], hoch)
            pf.append((y, setze(art, x, y + 2, .74)))
    e.append(ebene('beet-bepflanzt', 'Beet bepflanzt', ''.join(s for _, s in sorted(pf, key=lambda t: t[0]))))

    rs = 30
    s, na = station_seite(round(S[0], 1), round(S[1], 1), rs, rs * .577, 5)
    e.append(ebene('station', 'Station', s))
    lp = P(S_uv[0] + 4, S_uv[1] + 40)
    e.append(ebene('station-naechste', 'Station als Nächstes', na + setze('laterne', lp[0], lp[1], 1.25)))
    e.append(ebene('station-geschafft', 'Station geschafft', setze('rosette', *S, 1.15)))
    lav = lambda u, v, s_=.95: setze('lavendel', *P(u, v), s_)
    l1 = lav(176, 300, .9) + lav(150, 296, .8)
    e.append(ebene('baeume', 'Bäume und Sträucher', setze('birnbaum', *tb2, .66) + setze('apfelbaum', *tb1, 1.02) + l1 + setze('busch', *P(44, 118), .9) + setze('busch', *P(48, 66), 1.05)))
    fp = P(*min(wuv, key=lambda p: math.hypot(p[0] - 150, p[1] - 216))[:2])
    e.append(ebene('position', 'Position des Sängers', ell(fp[0] + 4, fp[1] + 1, 17, 5, F['schatten'], extra=' fill-opacity=".28"') + setze('figur', fp[0], fp[1], 1.22)))

    # Mauern: rechte zuerst, dann linke mit Torhaus
    D, H = 16, 38
    m = iso_steine('', 'v', 0, 0, 300, 0, H, 4, rnd, [F['stein_s'], '#b0a48e', F['stein_s'], '#a89c86'])
    m += poly(fl((0, 0, H), (0, 300, H), (D, 300, H), (D, 0, H)), F['stein_h'], F['stein_d'], 1.2)
    for k in range(1, 12):
        a, c = P(0, k * 25, H), P(D, k * 25, H)
        m += pfad(f'M{n(a[0])},{n(a[1])}L{n(c[0])},{n(c[1])}', 'none', F['stein_d'], 1)
    # Durchlass fuer den Bach
    vm = 186
    bg = [P(0, vm - 21, 0)] + [P(0, vm + 21 * math.cos(math.radians(a)), 10 + 19 * math.sin(math.radians(a))) for a in range(180, -1, -15)] + [P(0, vm + 21, 0)]
    m += poly(bg, F['stein_d'], F['fuge'], 1)
    bg = [P(0, vm - 16, 0)] + [P(0, vm + 16 * math.cos(math.radians(a)), 10 + 14 * math.sin(math.radians(a))) for a in range(180, -1, -15)] + [P(0, vm + 16, 0)]
    m += poly(bg, '#2f4a58')
    bg = [P(0, vm - 16, 0), P(0, vm - 16, 5), P(0, vm + 16, 5), P(0, vm + 16, 0)]
    m += poly(bg, F['wasser'])
    m = iso_steine(m, 'u', 0, 0, 300, 0, H, 4, rnd, [F['stein'], F['stein_h'], F['stein_s'], F['stein']])
    m += poly(fl((0, 0, H), (300, 0, H), (300, D, H), (D, D, H), (D, 0, H)), F['stein_h'])
    m += poly(fl((0, 0, H), (300, 0, H), (300, D, H), (D, D, H)), F['stein_h'], F['stein_d'], 1.2)
    for k in range(1, 12):
        a, c = P(k * 25, 0, H), P(k * 25, D, H)
        m += pfad(f'M{n(a[0])},{n(a[1])}L{n(c[0])},{n(c[1])}', 'none', F['stein_d'], 1)
    e.append(ebene('mauer', 'Mauer', m))

    # Torhaus
    a0, a1, t0, t1, TH, RH = 64, 156, -14, 32, 66, 34
    um, tm = (a0 + a1) / 2, (t0 + t1) / 2
    t = iso_steine('', 'v', a0, t0, t1, 0, TH, 7, rnd, [F['stein_s'], '#b0a48e', '#a89c86'], 26)
    t = iso_steine(t, 'u', t0, a0, a1, 0, TH, 7, rnd, [F['stein'], F['stein_h'], F['stein_s'], F['stein']], 28)
    t += poly(fl((a0, t0, 0), (a1, t0, 0), (a1, t0, TH), (a0, t0, TH)), 'none', F['stein_d'], 1.4)

    def bogen(r, z0):
        return [P(um - r, t0, 0)] + [P(um + r * math.cos(math.radians(a)), t0, z0 + r * math.sin(math.radians(a))) for a in range(180, -1, -10)] + [P(um + r, t0, 0)]
    t += poly(bogen(37, 30), F['stein_d'], F['fuge'], .8)
    for i in range(9):
        w0, w1 = math.radians(i * 20 + 1.2), math.radians((i + 1) * 20 - 1.2)
        ps = [P(um + r * math.cos(a), t0, 30 + r * math.sin(a)) for r, a in [(37, w0), (37, (w0 + w1) / 2), (37, w1), (28, w1), (28, w0)]]
        t += poly(ps, F['stein_h'] if i % 2 == 0 else F['stein'], F['stein_d'], .9)
    for k in range(2):
        for s_ in (-37, 28):
            t += poly([P(um + s_ + .6, t0, k * 15 + .6), P(um + s_ + 8.4, t0, k * 15 + .6), P(um + s_ + 8.4, t0, k * 15 + 14.4), P(um + s_ + .6, t0, k * 15 + 14.4)], F['stein_h'] if k % 2 else F['stein'], F['stein_d'], .9)
    bp_ = bogen(28, 30)
    t += f'<clipPath id="bogen"><polygon points="{pkt(bp_)}"/></clipPath><g clip-path="url(#bogen)">'
    t += poly(bp_, '#5d7a49') + poly(fl((um - 25, t0, 0), (um + 25, t0, 0), (um + 25, t0 + 110, 0), (um - 25, t0 + 110, 0)), F['weg'])
    t += poly(fl((um + 28, t0, 0), (um + 28, t0 + 40, 0), (um + 28, t0 + 40, 80), (um + 28, t0, 80)), '#a89c86')
    t += poly(bp_, F['schatten'], extra=' fill-opacity=".14"') + '</g>'
    # Torfluegel, nach aussen geoeffnet
    t += poly(fl((um + 28, t0, 0), (um + 28, t0 - 24, 0), (um + 28, t0 - 24, 46), (um + 28, t0, 46)), F['holz'], F['holz_d'], 1.2)
    t += pfad('M%s,%sL%s,%s' % tuple(n(c) for p in (P(um + 28, t0 - 12, 0), P(um + 28, t0 - 12, 46)) for c in p), 'none', F['holz_d'], 1)
    t += poly(fl((um - 28, t0, 0), (um - 28, t0 - 24, 0), (um - 28, t0 - 24, 46), (um - 28, t0, 46)), F['holz'], F['holz_d'], 1.2)
    for z in (12, 34):
        t += pfad('M%s,%sL%s,%s' % tuple(n(c) for p in (P(um - 28, t0, z), P(um - 28, t0 - 24, z)) for c in p), 'none', F['holz_d'], 1.4)
    # Giebel rechts
    t += poly(fl((a0, t0, TH), (a0, t1, TH), (a0, tm, TH + RH - 6)), '#b0a48e', F['stein_d'], 1.2)
    t += poly([P(a0, tm - 5, TH + 6), P(a0, tm + 5, TH + 6), P(a0, tm + 5, TH + 16), P(a0, tm, TH + 21), P(a0, tm - 5, TH + 16)], '#4a4335', F['stein_d'], 1)
    # Dachflaeche
    ue, ua = 5, 7
    r0, r1 = a0 - ue, a1 + ue
    v_e, z_e = t0 - ua, TH - 7
    z_f = TH + RH

    def dach(u, f):
        return P(u, v_e + (tm - v_e) * f, z_e + (z_f - z_e) * f)
    t += poly([dach(r0, 0), dach(r1, 0), dach(r1, 1), dach(r0, 1)], F['dach'], F['dach_d'], 1.6)
    reihen_d = 6
    for k in range(reihen_d):
        f0, f1 = k / reihen_d, (k + 1) / reihen_d
        z_ = int((r1 - r0) / 11)
        br = (r1 - r0) / z_
        oberkante = [dach(r1, f1), dach(r0, f1)]
        unten = []
        for i in range(z_):
            for st in range(5):
                w_ = st / 4
                x_ = r0 + (i + w_) * br
                unten.append(dach(x_, f0 + .045 - .045 * math.sin(math.pi * w_) * 1.6))
        t += poly(unten + oberkante, F['dach'] if k % 2 else F['dach_h'], F['dach_s'], 1)
    # Ortgang rechts
    t += poly([dach(r0, 0), dach(r0, 1), P(r0, tm, z_f - 5), P(r0, v_e, z_e - 5)], F['dach_s'], F['dach_d'], 1)
    b_e = (P(r0, t1 + 1, TH - 1), P(r0, t1 + 1, TH - 7))
    t += poly([dach(r0, 1), b_e[0], P(a0, t1, TH - 4), P(a0, tm, z_f - 8)], '#5b4a38')
    t += poly([dach(r0, 1), b_e[0], b_e[1], P(r0, tm, z_f - 6)], F['dach_s'], F['dach_d'], 1)
    fa, fb = P(r0, tm, z_f), P(r1, tm, z_f)
    t += pfad(f'M{n(fa[0])},{n(fa[1])}L{n(fb[0])},{n(fb[1])}', 'none', F['dach_d'], 8.6) + pfad(f'M{n(fa[0])},{n(fa[1])}L{n(fb[0])},{n(fb[1])}', 'none', F['dach_h'], 6)
    kx, ky = P(um, tm, z_f + 3)
    t += pfad(f'M{n(kx)},{n(ky)}l0,-21m-7,7l14,0', 'none', F['gold_d'], 4.4) + pfad(f'M{n(kx)},{n(ky)}l0,-21m-7,7l14,0', 'none', F['gold_h'], 2.2)
    e.append(ebene('tor', 'Tor', t))
    vorn = setze('busch', *P(196, -16), .9) + setze('lavendel', *P(40, -14), .95) + setze('lavendel', *P(18, -16), .8) + setze('busch', *P(-14, 70), .8)
    e.append(ebene('vordergrund', 'Vordergrund', vorn))
    e.append(ebene('schild', 'Namensschild', schild(S[0] - 62, S[1] - 84, TITEL, 190, (58, 40))))
    return datei(f'{ZIEL}/ansicht-isometrisch.svg', 'i-', 'Ausschnitt des Gartens, isometrisch gesehen', 'Probe Baustein B, Weg 1, isometrische Ansicht. Ebenen sind benannte Gruppen, Bauteile stehen als Symbole in defs.', defs, e)


if __name__ == '__main__':
    for name, f in [('oben', oben), ('schraeg', schraeg), ('isometrisch', iso)]:
        print(name, f(), 'Zeichen')
