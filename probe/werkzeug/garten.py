"""Zeichnet die Bilder fuer Teil 2 der Probe (Baustein B): python probe/werkzeug/garten.py

Ergebnis in probe/bilder/garten/:
  teile.svg        Musterbogen: alle gemeinsamen Bauteile, jedes einmal (Kennung t-...)
  anfang.svg       Wiese vor der Mauer und Torhaus, fest am unteren Ende
  bereich-1.svg    Gemuesegarten am Tor (Etappe 1)
  platzhalter.svg  einfacher zweiter Bereich, nur zum Anschliessen und Tauschen
  bereich-1-*.svg, platzhalter-boden.svg  Varianten mit groesserem Unterschied vorher/nachher (wandel.py)

Regeln stehen in .claude/skills/garten-grafik/SKILL.md. Nur ein Hilfsmittel fuer die Probe, die App braucht es nicht.
Ein Lauf ueberschreibt Aenderungen, die von Hand in probe/bilder/garten/ gemacht wurden.
"""
import os
import random
from garten_teile import *
from zeichne import GRAS, abstand_zu, bach_bild, mauersteine, station_seite, streue, torhaus, ufersteine, weg_bild, wiese

ZIEL = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'bilder', 'garten')
Q = .74            # Stauchung des Bodens in der Schraegsicht
WEG_X, BACH_X = 200, 350   # Anschluesse: hier treten Weg und Bach unten und oben ein und aus
MAUER = 62         # Fusslinie der oberen Mauer, Oberkante bei 0

F.update(rose='#d8647f', rose_d='#9c3550', rose_h='#f0a3b3', zink='#a9b8be', zink_d='#5d7078', zink_h='#d3dde0',
         rotkehl='#df7b3c', feder='#8a6a4c', feder_d='#57402c', bohne='#cf4b3f', nebel='#eef2f1', kuerbis='#e58a34', kuerbis_d='#a9581a')


# ---------- Bauteile, Fusspunkt 0,0 ----------

def bluete(x, y, r, farbe, rand, mitte):
    aus = ''
    for i in range(5):
        a = i * 1.2566 - 1.57
        aus += ell(x + r * .62 * math.cos(a), y + r * .56 * math.sin(a), r * .5, r * .45, farbe, rand, .6)
    return aus + ell(x, y, r * .34, r * .3, mitte)


def blumen(saat):
    rnd = random.Random(saat)
    aus = ell(0, 0, 17, 4.6, F['schatten'], extra=' fill-opacity=".2"')
    aus += pfad('M-16,0C-15,-6 -9,-7 -6,-3C-5,-9 3,-9 4,-3C7,-8 15,-6 16,0C8,3 -8,3 -16,0Z', F['laub'], F['laub_d'], 1)
    farben = [('#fffaf0', '#c9b98e', F['ringel']), (F['rose_h'], F['rose_d'], '#fbe6a8'), (F['ringel'], F['ringel_d'], F['ringel_d']), ('#b5b0e6', F['lav_d'], '#fbe6a8')]
    for x, y in [(-11, -8), (-4, -12), (3, -8), (10, -11), (-8, -3), (7, -3)]:
        aus += pfad(f'M{n(x*.7)},-1L{x},{y}', 'none', F['laub_d'], 1) + bluete(x, y, 4.4, *farben[rnd.randrange(4)])
    return aus


def pflock(x, y):
    return pfad(f'M{n(x)},{n(y)}l0,-13', 'none', F['holz_d'], 4) + pfad(f'M{n(x)},{n(y)}l0,-13', 'none', F['holz_h'], 2)


def abgesteckt(x, y, b, t):
    """Noch nicht offene Stelle: vier Pfloecke mit Schnur."""
    aus = rect(x, y, b, t, F['wiese_d'], 4, extra=' fill-opacity=".38"')
    d = f'M{n(x)},{n(y-10)}L{n(x+b)},{n(y-10)}L{n(x+b)},{n(y+t-10)}L{n(x)},{n(y+t-10)}Z'
    aus += pfad(d, 'none', '#f4ead0', 1.6) + ''.join(pflock(a, c) for a, c in [(x, y), (x + b, y), (x, y + t), (x + b, y + t)])
    return aus


def bohnen(stand):
    """Drei Stangen mit Bohnen: 0 kahl, 1 halb, 2 fertig."""
    aus = ell(2, 0, 17, 5, F['schatten'], extra=' fill-opacity=".25"')
    fuesse = [(-13, 0), (13, 0), (0, 4)]
    for x, y in fuesse:
        aus += pfad(f'M{x},{y}L{n(-x*.28)},-62', 'none', F['holz_d'], 3.4) + pfad(f'M{x},{y}L{n(-x*.28)},-62', 'none', F['holz_h'], 1.6)
    aus += pfad('M-4,-53L4,-51M-4,-50L4,-54', 'none', '#f4ead0', 1.8)
    hoch = [0, 27, 58][stand]
    if stand:
        rnd = random.Random(5)
        for x, y in fuesse:
            t = 0
            while t < hoch:
                f = t / 62
                px, py = x + (-x * .28 - x) * f, y - t * (62 + y) / 62
                s = rnd.uniform(4.2, 5.8) * (1 - .25 * f)
                q = rnd.uniform(-3, 3)
                aus += pfad(f'M{n(px+q)},{n(py)}c{n(-s)},{n(-s*.2)} {n(-s)},{n(-s*1.3)} 0,{n(-s*1.6)}c{n(s)},{n(s*.3)} {n(s)},{n(s*1.4)} 0,{n(s*1.6)}Z', rnd.choice([F['laub'], F['laub_h'], F['laub']]), F['laub_d'], .9)
                t += 5.2
        for x, y in fuesse:
            for t in range(10, hoch, 13):
                f = t / 62
                px, py = x + (-x * .28 - x) * f, y - t
                aus += ell(px + (3 if t % 2 else -3), py, 2.5, 2.3, F['bohne'], '#8c2a24', .7)
    if stand == 2:
        for x, y in [(-12, -14), (10, -22), (-6, -34)]:
            aus += pfad(f'M{x},{y}q2,6 0,12', 'none', F['laub_d'], 3) + pfad(f'M{x},{y}q2,6 0,12', 'none', '#a9cf6a', 1.6)
    return aus


def traenke(stand):
    """Vogeltraenke: 0 nur Sockel, 1 Schale, 2 mit Wasser und Voegeln."""
    aus = ell(3, 1, 24, 7.5, F['schatten'], extra=' fill-opacity=".25"')
    aus += poly([(-20, -6), (20, -6), (22, 1), (-22, 1)], F['stein_d'], F['fuge'], 1) + ell(0, -6, 20, 6.5, F['stein_h'], F['stein_d'], 1.1) + ell(0, -6, 13, 4, F['stein'], F['stein_d'], .8)
    if not stand:
        return aus + setze('gras', -17, 4, .7) + setze('gras', 16, 4, .7)
    aus += pfad('M-7,-6C-5,-14 -4,-22 -6,-30L6,-30C4,-22 5,-14 7,-6C3,-4 -3,-4 -7,-6Z', F['stein'], F['stein_d'], 1.2) + pfad('M3,-8C2,-15 2,-22 3,-29', 'none', F['stein_d'], 1.2)
    aus += pfad('M-27,-38C-24,-27 -12,-25 0,-25C12,-25 24,-27 27,-38Z', F['stein_s'], F['stein_d'], 1.2) + ell(0, -38, 27, 8.4, F['stein_h'], F['stein_d'], 1.2)
    if stand == 1:
        return aus + ell(0, -37.5, 21, 5.8, F['stein_s'], F['stein_d'], .9) + pfad('M-13,-38q4,-3 9,-1', 'none', F['laub'], 2.2)
    aus += ell(0, -37.5, 21.5, 6, F['wasser'], F['wasser_d'], 1) + pfad('M-12,-38.6q5,-1.8 10,0M2,-36q5,-1.8 10,0', 'none', F['wasser_h'], 1.5)
    return aus + setze('vogel', -17, -40, .95) + f'<g transform="translate(19 -40) scale(-.9 .9)"><use href="#vogel"/></g>'


def vogel():
    return (
        pfad('M-1.6,0l0,-4M1.8,0l0,-4', 'none', F['feder_d'], 1.2)
        + pfad('M-9,-6C-13,-7 -15,-6 -17,-4C-13,-4 -11,-3 -8,-3Z', F['feder'], F['feder_d'], .8)
        + pfad('M-10,-5C-9,-11 -2,-13 2,-13C3,-17 9,-18 11,-14C12,-12 11,-10 10,-9C10,-5 5,-2.5 0,-2.5C-5,-2.5 -9,-3 -10,-5Z', F['feder'], F['feder_d'], .9)
        + pfad('M4,-13.5C8,-14 11,-12 10,-9C9,-5.5 6,-3.4 2.6,-3C2,-7 1.6,-11 4,-13.5Z', F['rotkehl'])
        + pfad('M11.2,-14L15,-12.8L11.4,-11.8Z', '#e6b13c', F['feder_d'], .6) + ell(8.2, -14, 1.1, 1.1, '#1c1712')
        + pfad('M-7,-6C-4,-9 -1,-9 1,-7C-1,-4.5 -4,-4 -7,-6Z', F['feder_d'], extra=' fill-opacity=".55"')
    )


def giesskanne():
    return (
        ell(1, 0, 15, 4, F['schatten'], extra=' fill-opacity=".3"')
        + '<g class="g-giessen">'
        + pfad('M-3,-20C-12,-34 13,-36 10,-19', 'none', F['zink_d'], 3.4) + pfad('M-3,-20C-12,-34 13,-36 10,-19', 'none', F['zink'], 1.6)
        + pfad('M-8,-7L-22,-21L-19,-23L-6,-13Z', F['zink'], F['zink_d'], 1.1) + pfad('M-26,-20L-19,-26L-18,-21L-21,-18Z', F['zink_h'], F['zink_d'], 1)
        + pfad('M-9,-19L10,-19L12,-1C8,1.4 -8,1.4 -11,-1Z', F['zink'], F['zink_d'], 1.3) + ell(.5, -19, 9.6, 2.8, F['zink_h'], F['zink_d'], 1.1)
        + pfad('M-7,-15L-8.4,-3', 'none', F['zink_h'], 2.4) + '</g>'
        + pfad('M-27,-14c-2.6,4 -1.6,6 0,6c1.6,0 2.6,-2 0,-6Z', F['wasser'], F['wasser_d'], .8, ' class="g-tropfen"') + pfad('M-21,-12c-2.6,4 -1.6,6 0,6c1.6,0 2.6,-2 0,-6Z', F['wasser'], F['wasser_d'], .8, ' class="g-tropfen"')
    )


def rose(x, y, r):
    return (ell(x, y, r, r * .92, F['rose'], F['rose_d'], 1) + pfad(f'M{n(x-r*.5)},{n(y)}a{n(r*.5)},{n(r*.46)} 0 1 1 {n(r*.9)},{n(r*.15)}a{n(r*.28)},{n(r*.28)} 0 1 1 {n(-r*.5)},{n(-r*.1)}', 'none', F['rose_d'], .9)
            + ell(x - r * .3, y - r * .38, r * .3, r * .2, F['rose_h'], extra=' fill-opacity=".9"'))


def rosenbusch(offen):
    rnd = random.Random(12)
    aus = ell(3, 0, 25, 7, F['schatten'], extra=' fill-opacity=".26"')
    aus += pfad(wolke(0, -18, 24, 19, 12, rnd), F['laub'], F['laub_d'], 1.3) + pfad(wolke(-5, -24, 15, 10, 9, rnd), F['laub_h'])
    stellen = [(-14, -12), (-4, -26), (9, -30), (15, -16), (2, -12), (-15, -26), (-5, -38)]
    if offen:
        return aus + ''.join(rose(x, y, 6.2) for x, y in stellen)
    for x, y in stellen[:5]:
        aus += pfad(f'M{x},{y+4}C{x-4},{y+3} {x-3.4},{y-3} {x},{y-6}C{x+3.4},{y-3} {x+4},{y+3} {x},{y+4}Z', F['rose_h'], F['rose_d'], .9) + pfad(f'M{x-3},{y+4}L{x},{y}L{x+3},{y+4}Z', F['laub'], F['laub_d'], .7)
    for x, y in [(-22, -40), (20, -42), (0, -52)]:
        aus += pfad(f'M{x},{y-6}L{x+1.6},{y-1.6}L{x+6},{y}L{x+1.6},{y+1.6}L{x},{y+6}L{x-1.6},{y+1.6}L{x-6},{y}L{x-1.6},{y-1.6}Z', F['gold_h'], F['gold_d'], .9, ' class="g-funkeln"')
    return aus


def schilf(saat):
    rnd = random.Random(saat)
    aus = ell(1, 0, 11, 3, F['schatten'], extra=' fill-opacity=".22"')
    for i in range(7):
        x, hh = -9 + i * 3 + rnd.uniform(-1, 1), rnd.uniform(16, 30)
        aus += pfad(f'M{n(x*.5)},0Q{n(x)},{n(-hh*.5)} {n(x*1.3)},{n(-hh)}', 'none', F['laub_d'] if i % 2 else F['laub'], 2.2)
    for x, y in [(-6, -27), (5, -31)]:
        aus += pfad(f'M{n(x*.4)},0L{x},{y+8}', 'none', F['laub_d'], 1.2) + ell(x, y + 4, 2.2, 6, '#7c5331', '#533720', .8)
    return aus


def stockrose(saat):
    rnd = random.Random(saat)
    aus = ell(1, 0, 10, 3, F['schatten'], extra=' fill-opacity=".25"')
    for dx, h in [(-4, 44), (4, 52)]:
        aus += pfad(f'M{dx*.4},0L{dx},{-h}', 'none', F['laub_d'], 1.8)
        for k in range(5):
            y = -14 - k * (h - 16) / 5
            aus += bluete(dx + (3 if k % 2 else -3), y, 5.4 - k * .5, rnd.choice([F['rose_h'], F['rose'], '#f6d3da']), F['rose_d'], '#fbe6a8')
    return aus + pfad('M0,1C-12,1 -13,-7 -9,-10C-5,-9 -2,-5 0,0C2,-5 6,-9 10,-9C13,-6 11,1 0,1Z', F['laub'], F['laub_d'], 1)


def schubkarre():
    kuerbis = lambda x, y, r: ell(x, y, r, r * .8, F['kuerbis'], F['kuerbis_d'], 1.1) + pfad(f'M{x},{n(y-r*.8)}C{n(x-r*.6)},{n(y-r*.3)} {n(x-r*.6)},{n(y+r*.4)} {x},{n(y+r*.8)}M{x},{n(y-r*.8)}C{n(x+r*.6)},{n(y-r*.3)} {n(x+r*.6)},{n(y+r*.4)} {x},{n(y+r*.8)}', 'none', F['kuerbis_d'], .8) + pfad(f'M{x},{n(y-r*.8)}l1,-4', 'none', F['laub_d'], 2)
    return (
        ell(0, 1, 34, 8, F['schatten'], extra=' fill-opacity=".26"')
        + pfad('M14,-12L20,0M-2,-12L2,0', 'none', F['holz_d'], 3)
        + kuerbis(-8, -24, 9) + kuerbis(9, -24, 8) + setze('kohl', 0, -19, .85)
        + poly([(-24, -24), (18, -24), (14, -9), (-16, -9)], F['holz'], F['holz_d'], 1.4) + pfad('M-21,-17L16,-17', 'none', F['holz_d'], 1)
        + pfad('M12,-12L38,-19', 'none', F['holz_d'], 4.4) + pfad('M12,-12L38,-19', 'none', F['holz_h'], 2.2) + pfad('M-18,-10L-26,-6', 'none', F['holz_d'], 3.6)
        + ell(-27, -7, 8, 8, 'none', F['holz_d'], 3.6) + ell(-27, -7, 8, 8, 'none', F['holz_h'], 1.5) + pfad('M-27,-14L-27,0M-34,-7L-20,-7', 'none', F['holz_d'], 1.4)
    )


def schmetterling(farbe, rand):
    return ('<g class="g-flattern">' + pfad('M0,0C-3,-8 -11,-9 -11,-3C-11,1 -5,2 0,0ZM0,0C-5,1 -9,5 -6,8C-3,9 -1,4 0,0Z', farbe, rand, .9)
            + pfad('M0,0C3,-8 11,-9 11,-3C11,1 5,2 0,0ZM0,0C5,1 9,5 6,8C3,9 1,4 0,0Z', farbe, rand, .9) + pfad('M0,-4L0,5', 'none', F['tinte'], 1.8) + '</g>')


def beet_kasten(b=126, t=92, hoch=13):
    """Hochbeet, Bezugspunkt links oben."""
    a = rect(0, t, b, hoch, F['holz'], 1, F['holz_d'], 1.4)
    a += pfad(f'M2,{t+6}L{b-2},{t+6}M{b/3:.0f},{t}L{b/3:.0f},{t+hoch-2}M{b*2/3:.0f},{t}L{b*2/3:.0f},{t+hoch-2}', 'none', F['holz_d'], .9)
    a += rect(0, 0, b, t, F['holz_h'], 2, F['holz_d'], 1.6) + rect(6, 5, b - 12, t - 10, F['erde'], 1.5, F['erde_d'], 1.4) + rect(6, 5, b - 12, 4, F['erde_d'], 1)
    for k in range(5):
        y = 19 + k * 16
        a += pfad(f'M13,{y+1.6}L{b-13},{y+1.6}', 'none', F['erde_d'], 7) + pfad(f'M13,{y}L{b-13},{y}', 'none', F['erde_h'], 5) + pfad(f'M15,{y-1.6}L{b-15},{y-1.6}', 'none', '#a98462', 1.2, ' stroke-opacity=".7"')
    return a


def beet_reihen(reihen, b=126):
    arten = ['lauch', 'ringelblume', 'kohl', 'salat', 'rotkohl']
    aus = ''
    for k in reihen:
        for i in range(5):
            aus += setze(arten[k], 19 + i * (b - 38) / 4, 21 + k * 16, 1.02)
    return aus


def erdbeet(b, t):
    a = schatten(rect(4, 5, b, t, F['schatten'], 4), .2) + rect(0, 0, b, t, F['stein_s'], 5, F['stein_d'], 1.4) + rect(5, 5, b - 10, t - 10, F['erde'], 3, F['erde_d'], 1.3)
    for k in range(3):
        y = 13 + k * (t - 24) / 2
        a += pfad(f'M11,{n(y)}L{b-11},{n(y)}', 'none', F['erde_h'], 3.4)
    return a


def hohes_gras(saat):
    rnd = random.Random(saat)
    aus = ell(0, 0, 11, 3, F['schatten'], extra=' fill-opacity=".2"')
    for i in range(11):
        x, hh = -10 + i * 2 + rnd.uniform(-1, 1), rnd.uniform(14, 27)
        aus += pfad(f'M{n(x*.45)},0Q{n(x*.8)},{n(-hh*.55)} {n(x*1.25)},{n(-hh)}', 'none', rnd.choice([F['laub'], F['laub_h'], F['wiese_d'], F['laub_d']]), 1.7)
    for x, y in [(-7, -22), (2, -27), (9, -20)]:
        aus += ell(x, y, 1.5, 3.6, '#d9cf8f', '#a89a55', .6)
    return aus


def farn(saat):
    rnd = random.Random(saat)
    aus = ell(0, 0, 17, 4.4, F['schatten'], extra=' fill-opacity=".22"')
    for w, l in [(-64, 24), (64, 24), (-34, 29), (36, 28), (-4, 31)]:
        z = pfad(f'M0,0Q2,{-l*.5:.1f} 0,{-l}', 'none', F['laub_d'], 1.4)
        for k in range(6):
            y = -l * (.2 + k * .13)
            b = 7.4 - k * .9
            z += pfad(f'M0,{n(y)}Q{n(-b*.6)},{n(y-4.4)} {n(-b)},{n(y-3)}Q{n(-b*.5)},{n(y+.8)} 0,{n(y)}ZM0,{n(y)}Q{n(b*.6)},{n(y-4.4)} {n(b)},{n(y-3)}Q{n(b*.5)},{n(y+.8)} 0,{n(y)}Z', F['laub'] if k % 2 else F['laub_h'], F['laub_d'], .7)
        aus += f'<g transform="rotate({w})">{z}</g>'
    return aus


def buchs(saat):
    rnd = random.Random(saat)
    return ell(3, 0, 16, 4.6, F['schatten'], extra=' fill-opacity=".26"') + pfad(wolke(0, -13, 14.5, 13.5, 13, rnd, .03, 1.05), F['laub'], F['laub_d'], 1.2) + pfad(wolke(-3, -17, 9, 7.6, 9, rnd, .04), F['laub_h']) + pfad(wolke(-5, -19.6, 4.4, 3.4, 7, rnd, .04), F['laub_hh'])


def wildblumen(saat):
    rnd = random.Random(saat)
    farben = [('#fffaf0', '#c9b98e', F['ringel']), (F['rose_h'], F['rose_d'], '#fbe6a8'), ('#f5d35f', '#b98f1f', '#b97d10'), ('#b5b0e6', F['lav_d'], '#fbe6a8'), ('#d9544a', '#8c2a24', '#3a1c10')]
    aus = ''
    for i in range(7):
        x, hh = -13 + i * 4.3 + rnd.uniform(-1.4, 1.4), rnd.uniform(9, 20)
        y0 = rnd.uniform(-2, 3)
        aus += pfad(f'M{n(x)},{n(y0)}Q{n(x+1)},{n(y0-hh*.5)} {n(x+rnd.uniform(-2, 2))},{n(y0-hh)}', 'none', F['laub_d'], 1.1) + pfad(f'M{n(x)},{n(y0-2)}q-4,-2 -5,-6M{n(x)},{n(y0-3)}q4,-2 5,-5', 'none', F['laub'], 1.2)
        aus += bluete(x, y0 - hh, rnd.uniform(3, 4.2), *farben[rnd.randrange(5)])
    return aus


def efeu(saat):
    rnd = random.Random(saat)
    aus = ''
    for k in range(5):
        x0 = -26 + k * 13 + rnd.uniform(-3, 3)
        l = rnd.uniform(20, 46)
        aus += pfad(f'M{n(x0)},-2Q{n(x0+rnd.uniform(-6, 6))},{n(l*.5)} {n(x0+rnd.uniform(-5, 5))},{n(l)}', 'none', F['laub_d'], 1.4)
        for i in range(int(l / 5)):
            y = -3 + i * 5.4
            x = x0 + rnd.uniform(-5.4, 5.4)
            w = rnd.uniform(-40, 40)
            aus += f'<g transform="translate({n(x)} {n(y)}) rotate({n(w)})">' + pfad('M0,5C-2,3 -6,3 -5,-1C-3,-1 -3,-3 -1.6,-5L0,-3.4L1.6,-5C3,-3 3,-1 5,-1C6,3 2,3 0,5Z', rnd.choice([F['laub'], F['laub_h'], F['laub'], '#5b8a4c']), F['laub_d'], .8) + '</g>'
    return aus


def kraut(saat):
    rnd = random.Random(saat)
    aus = ell(0, 0, 14, 4, F['schatten'], extra=' fill-opacity=".2"')
    for w in (-72, 70, -46, 44, -20, 18):
        aus += f'<g transform="rotate({w})">' + pfad('M0,1C-6,-4 -5,-13 0,-18C5,-13 6,-4 0,1Z', rnd.choice([F['kohl'], F['laub_h'], F['laub']]), F['laub_d'], .9) + pfad('M0,-2L0,-14', 'none', F['laub_hh'], .9) + '</g>'
    return aus


def teile():
    r1, r2 = random.Random(21), random.Random(8)
    platte, _ = station_seite(0, 0, 30, 21, 5)
    ring = (f'<ellipse class="g-halo" rx="34.8" ry="24.4" fill="none" stroke="{F["gold_h"]}" stroke-width="5" stroke-opacity=".85"/>'
            f'<ellipse rx="25.8" ry="18.1" fill="none" stroke="{F["gold_d"]}" stroke-width="7.6"/><ellipse rx="25.8" ry="18.1" fill="none" stroke="{F["gold"]}" stroke-width="5.4"/>' + ell(0, 0, 7, 4.9, F['gold'], F['gold_d'], 1.2))
    blume = lambda c, m: pfad('M0,0L0,-6', 'none', F['laub_d'], 1) + ''.join(ell(2.1 * math.cos(a), -7.5 + 2.1 * math.sin(a), 1.6, 1.6, c) for a in [0, 1.26, 2.51, 3.77, 5.03]) + ell(0, -7.5, 1.3, 1.3, m)
    return [
        ('gras', 'Grasbüschel', pfad(GRAS, 'none', F['wiese_d'], 1.5)), ('gaensebl', 'Gänseblümchen', blume('#fffaf0', F['ringel'])), ('blau', 'blaue Blume', blume('#a7b7e6', '#f6e7a8')),
        ('kohl', 'Kohl', kohl_seite(F['kohl'], F['kohl_d'], F['kohl_h'])), ('rotkohl', 'Rotkohl', kohl_seite(F['rot'], F['rot_d'], F['rot_h'])), ('salat', 'Salat', salat_seite()),
        ('lauch', 'Lauch', lauch_seite()), ('ringelblume', 'Ringelblume', ringel_seite()), ('lavendel', 'Lavendel', lavendel_seite()),
        ('busch', 'Busch', busch_seite(random.Random(3))), ('apfelbaum-kahl', 'Apfelbaum ohne Äpfel', baum_seite(random.Random(21), False)), ('apfelbaum', 'Apfelbaum mit Äpfeln', baum_seite(r1)), ('birnbaum', 'Birnbaum', baum_seite(r2, False)),
        ('blumen-1', 'Blumen 1', blumen(1)), ('blumen-2', 'Blumen 2', blumen(6)), ('blumen-3', 'Blumen 3', blumen(14)), ('stockrose', 'Stockrose', stockrose(4)), ('schilf', 'Schilf', schilf(3)), ('gras-hoch', 'hohes Gras', hohes_gras(2)), ('farn', 'Farn', farn(3)), ('buchs', 'Buchskugel', buchs(4)), ('wild-1', 'Wiesenblumen 1', wildblumen(3)), ('wild-2', 'Wiesenblumen 2', wildblumen(9)), ('efeu-1', 'Efeu 1', efeu(2)), ('efeu-2', 'Efeu 2', efeu(7)), ('kraut', 'Blattstaude', kraut(5)),
        ('platte', 'Station: Steinplatte', platte), ('ring', 'Station: als Nächstes', ring), ('rosette', 'Station: geschafft', rosette(18, .7)), ('moos', 'Station: noch nicht offen', setze('gras', -16, 2, .8) + setze('gras', 14, 8, .8) + setze('gras', 2, -6, .7)),
        ('laterne', 'Laterne', laterne_seite()), ('spaten', 'Spaten', spaten_seite()), ('giesskanne', 'Pflege-Zeichen: Gießkanne', giesskanne()),
        ('beet', 'Hochbeet', beet_kasten()), ('beet-reihen-halb', 'Beet halb bepflanzt', beet_reihen([0, 1])), ('beet-reihen', 'Beet bepflanzt', beet_reihen(range(5))), ('erdbeet', 'Beet mit Steinrand', erdbeet(92, 52)),
        ('bohnen-leer', 'Bohnenstangen kahl', bohnen(0)), ('bohnen-halb', 'Bohnen halb', bohnen(1)), ('bohnen', 'Bohnen fertig', bohnen(2)),
        ('vogel', 'Vogel', vogel()), ('traenke-leer', 'Sockel', traenke(0)), ('traenke-halb', 'Vogeltränke ohne Wasser', traenke(1)), ('traenke', 'Vogeltränke fertig', traenke(2)),
        ('rosen-knospe', 'Spätblüher: Knospen', rosenbusch(False)), ('rosen', 'Spätblüher: blüht', rosenbusch(True)),
        ('schubkarre', 'Schubkarre mit Ernte', schubkarre()), ('falter-1', 'Schmetterling gelb', schmetterling('#f5d35f', '#a9821c')), ('falter-2', 'Schmetterling blau', schmetterling('#9db3ea', '#4b5f9e')),
        ('figur', 'Figur (Position)', ell(4, 1, 16, 4.6, F['schatten'], extra=' fill-opacity=".28"') + figur_seite()),
    ]


# ---------- Kacheln ----------

def ebene2(name, titel, inhalt, extra=''):
    return f'\n<g class="g-{name}"{extra} inkscape:groupmode="layer" inkscape:label="{titel}">\n{inhalt}\n</g>'


def varianten(teil, start, stuecke, immer='', extra=''):
    """Ein Ding mit mehreren Zustaenden. stuecke: [(Zustaende, Inhalt)]; sichtbar ist, was zu data-zustand passt."""
    aus = f'<g data-teil="{teil}" data-zustand="{start}"{extra}>{immer}'
    for bei, inhalt in stuecke:
        aus += f'<g data-bei="{bei}"' + ('' if start in bei.split() else ' display="none"') + f'>{inhalt}</g>'
    return aus + '</g>'


def schreibe(name, praefix, h, boden, stehend, vorn, nebel=True, rnd=None):
    text = (f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" viewBox="0 0 400 {h}" overflow="visible" aria-hidden="true" focusable="false">\n'
            f'<!-- Probe Baustein B, Teil 2. Gemeinsame Bauteile (href="#t-...") liegen in teile.svg. Kachelbreite 400, Weg bei x={WEG_X}, Bach bei x={BACH_X}. -->\n'
            f'<defs><clipPath id="kachel"><rect x="0" y="-.5" width="400" height="{h+1}"/></clipPath></defs>\n'
            f'<g clip-path="url(#kachel)">' + ''.join(boden) + '\n</g>')
    text += ebene2('stehend', 'Stehende Dinge, von hinten nach vorn', '\n'.join(s for _, s in sorted(stehend, key=lambda t: t[0]))) + ''.join(vorn)
    if nebel:
        wolken = ''
        for i in range(int(h / 48)):
            wolken += ell(rnd.uniform(0, 400), rnd.uniform(20, h - 10), rnd.uniform(90, 160), rnd.uniform(24, 44), 'url(#NEBEL)', extra=' class="g-nebelzug"')
        text += ebene2('nebel', 'Nebel: noch nicht erreicht', f'<g clip-path="url(#kachel)">{rect(0, -1, 400, h+2, F["nebel"], extra=" fill-opacity=%s.66%s" % (chr(34), chr(34)))}{wolken}</g>', ' display="none"')
    text += '\n</svg>\n'
    text = text.replace('href="#', 'href="#t-').replace('(href="#t-t-...")', '(href="#t-...")').replace('url(#', f'url(#{praefix}').replace(f'url(#{praefix}NEBEL)', 'url(#t-nebel)').replace('<clipPath id="', f'<clipPath id="{praefix}')
    open(os.path.join(ZIEL, name), 'w', encoding='utf-8', newline='\n').write(text)
    return len(text.encode())


def schlange(punkte):
    """Kurve durch Punkte, an jedem Punkt senkrecht: so passen die Anschluesse. Angaben in Bildkoordinaten, Ergebnis ungestaucht."""
    ps = [(x, y / Q) for x, y in punkte]
    segs = [ps[0]]
    for a, b in zip(ps, ps[1:]):
        m = (b[1] - a[1]) * .5
        segs += [(a[0], a[1] + m), (b[0], b[1] - m), b]
    return segs


def boden(rnd, h, W, B, frei, extra_schatten='', dichte=None):
    wp = [(x, y * Q) for x, y, *_ in kurve(W)]
    bp = [(x, y * Q) for x, y, *_ in kurve(B)]
    voll = lambda x, y: y > MAUER + 14 and abstand_zu(wp, x, y, .8) > 40 and abstand_zu(bp, x, y, .8) > 34 and frei(x, y)
    g = wiese(rnd, voll, h=h, dichte=dichte or int(h / 11))
    sch = poly([(0, MAUER - 1), (400, MAUER - 1), (400, MAUER + 10), (0, MAUER + 10)], F['schatten']) + extra_schatten
    return wp, [ebene2('grund', 'Grund', g), ebene2('bach', 'Bach', bach_bild(B, rnd, 36, Q, 7) + ufersteine(B, rnd, 38, Q, 7, True)),
                ebene2('weg', 'Weg', weg_bild(W, rnd, 50, Q, steinchen=int(h / 8))), ebene2('schatten', 'Schatten', schatten(sch))]


def mauer_oben(rnd):
    """Obere Mauer mit Gartentor und Bachdurchlass. Oberkante 0, Fuss bei MAUER."""
    m = ''
    for x0, x1 in [(-10, 148), (252, 410)]:
        m += rect(x0, 0, x1 - x0, 15, F['stein_h'], 0, F['stein_d'], 1)
        m += ''.join(pfad(f'M{x},0L{x},15', 'none', F['stein_d'], 1) for x in range(int(x0) + 20, int(x1), 27))
        m += mauersteine(x0, x1, 15, MAUER, 4, rnd, [F['stein'], F['stein_s'], F['stein_s'], F['stein']], 36) + rect(x0, 15, x1 - x0, 4, F['schatten'], extra=' fill-opacity=".16"')
    b, u = BACH_X, MAUER
    m += pfad(f'M{b-22},{u}L{b-22},{u-19}A22,19 0 0 1 {b+22},{u-19}L{b+22},{u}Z', F['stein_d'], F['fuge'], 1) + pfad(f'M{b-17},{u}L{b-17},{u-17}A17,15 0 0 1 {b+17},{u-17}L{b+17},{u}Z', '#2f4a58')
    m += pfad(f'M{b-17},{u}L{b-17},{u-6}C{b-8},{u-10} {b+8},{u-10} {b+17},{u-6}L{b+17},{u}Z', F['wasser']) + pfad(f'M{b-17},{u-7}C{b-6},{u-11} {b+6},{u-11} {b+17},{u-7}', 'none', F['wasser_h'], 1.6)
    # Torfluegel
    zu = ''
    for s in (-1, 1):
        x = lambda q: 200 + s * q
        zu += pfad(f'M{x(27)},{u}L{x(27)},2Q{x(14)},-12 {x(.6)},-14L{x(.6)},{u}Z', F['holz'], F['holz_d'], 1.4)
        zu += pfad(f'M{x(9)},{u}L{x(9)},-11M{x(18)},{u}L{x(18)},-6', 'none', F['holz_d'], 1.1) + pfad(f'M{x(27)},12L{x(3)},12M{x(27)},46L{x(3)},46', 'none', '#4a4f57', 3.4)
        zu += ell(x(5), 30, 2.6, 3.2, 'none', '#33373d', 1.6)
    offen = ''
    for s in (-1, 1):
        x = lambda q: 200 + s * q
        offen += poly([(x(27), u), (x(27), 0), (x(16), -14), (x(16), u - 14)], F['holz'], F['holz_d'], 1.3) + pfad(f'M{x(21.5)},{u-7}L{x(21.5)},-7M{x(27)},13L{x(16)},0M{x(27)},47L{x(16)},34', 'none', F['holz_d'], 1.3)
    # Pfeiler
    p = ''
    for x0 in (147, 227):
        p += mauersteine(x0, x0 + 26, -30, u, 7, rnd, [F['stein'], F['stein_h'], F['stein_s'], F['stein']], 22) + rect(x0 + 21, -30, 5, u + 30, F['schatten'], extra=' fill-opacity=".18"') + rect(x0, -30, 26, u + 30, 'none', 0, F['stein_d'], 1.4)
        p += rect(x0 - 4, -38, 34, 9, F['stein_h'], 2, F['stein_d'], 1.3) + ell(x0 + 13, -45, 8, 8, F['stein_h'], F['stein_d'], 1.3) + ell(x0 + 11, -47.5, 2.6, 2.2, '#f6f1e6')
    bogen = pfad('M160,-32C160,-74 240,-74 240,-32', 'none', F['holz_d'], 4.6) + pfad('M160,-32C160,-74 240,-74 240,-32', 'none', F['holz_h'], 2.2)
    laub, rnd2 = '', random.Random(31)
    for i in range(17):
        t = i / 16
        mt = 1 - t
        bx = mt**3 * 160 + 3 * mt * mt * t * 160 + 3 * mt * t * t * 240 + t**3 * 240
        by = mt**3 * -32 + 3 * mt * mt * t * -74 + 3 * mt * t * t * -74 + t**3 * -32
        laub += pfad(wolke(bx, by, rnd2.uniform(6.5, 9), rnd2.uniform(5.5, 7.5), 7, rnd2, .08), rnd2.choice([F['laub'], F['laub_h'], F['laub']]), F['laub_d'], .9)
        if i % 2 == 0:
            laub += '@' + f'{bx:.1f},{by:.1f};'
    import re
    punkte = re.findall(r'@([\d.-]+),([\d.-]+);', laub)
    laub = re.sub(r'@[\d.,;-]+', '', laub) + ''.join(rose(float(a), float(c), 4.8) for a, c in punkte)
    tor = varianten('tor', 'offen', [('zu', zu), ('offen', offen)]) + p + varianten('rosenbogen', 'offen', [('zu', bogen), ('offen', bogen + laub)])
    return [(MAUER - .5, f'<g class="g-mauer">{m}</g>'), (MAUER, f'<g class="g-tor">{tor}</g>')]


def stationen(wp, hoehen):
    """Steinplatten mit Zustaenden, dazu die Plaetze der Figur."""
    aus, orte = [], []
    for i, y in enumerate(hoehen, 1):
        x, y = bei_y(wp, y)
        x, y = round(x, 1), round(y, 1)
        orte.append((x, y))
        s = varianten(f'station-{i}', 'geschafft', [
            ('zu', setze('moos', x, y)), ('naechste', setze('ring', x, y)), ('geschafft', setze('rosette', x, y, 1.05))], setze('platte', x, y), f' data-ort="{x} {y}"')
        aus.append((y, s))
        seite = 1 if x < 200 else -1
        kr = setze(f'blumen-{i % 3 + 1}', x - 37, y + 12) + setze(f'blumen-{(i + 1) % 3 + 1}', x + 37, y + 12)
        aus.append((y + 12, varianten(f'blumen-{i}', 'geschafft', [('geschafft', kr)])))
        aus.append((y + 22, varianten(f'laterne-{i}', 'aus', [('an', setze('laterne', x + seite * 46 - (10 if seite < 0 else 0), y + 22, 1.2))])))
        aus.append((y + 34, varianten(f'pflege-{i}', 'aus', [('an', setze('giesskanne', x + seite * 58, y + 34, 1.1))], '', f' data-ort="{n(x + seite * 58)} {n(y + 20)}"')))
        fx, fy = bei_y(wp, y + 78)
        aus.append((fy, f'<g class="g-figur" data-platz="{i}" data-ort="{n(fx)} {n(fy)}" display="none">{setze("figur", fx, fy, 1.22)}</g>'))
    return aus, orte


def stelle(id_, ort, start, stuecke, immer=''):
    return varianten(f'stelle-{id_}', start, stuecke, immer, f' data-ort="{ort[0]} {ort[1]}"')


def ueppig(rnd, wp, H, stationen_y, sperr, bx=350):
    """Dichtere Bepflanzung als eigene Ebene (Schalter): Saum am Weg, Wiese, Efeu an der Mauer."""
    aus = []
    M = lambda y, inhalt: aus.append((y, varianten('ueppig', 'aus', [('an', inhalt)])))
    belegt = []
    def passt(x, y, abst):
        if not (12 < x < 388 and MAUER + 22 < y < H - 8) or abs(x - bx) < 34:
            return False
        if any(a < x < c and b < y < d for a, b, c, d in sperr):
            return False
        if any(math.hypot(x - sx, (y - sy) * 1.2) < 54 for sx, sy in stationen_y):
            return False
        return all(math.hypot(x - a, y - b) > abst for a, b in belegt)
    # Saum am Weg, im Wechsel
    reihe = ['buchs', 'lavendel', 'blumen-2', 'kraut', 'wild-1', 'buchs', 'blumen-1', 'gras-hoch', 'wild-2', 'blumen-3']
    k = 0
    for i in range(0, len(wp), 7):
        x, y = wp[i]
        for s in (-1, 1):
            xx, yy = x + s * rnd.uniform(38, 43), y + rnd.uniform(-4, 4)
            if passt(xx, yy, 21):
                belegt.append((xx, yy))
                M(yy, setze(reihe[k % len(reihe)], xx, yy, rnd.uniform(.72, .92)))
                k += 1
    # Wiese
    for _ in range(900):
        x, y = rnd.uniform(14, 386), rnd.uniform(MAUER + 24, H - 10)
        if min(math.hypot(x - a, (y - b) / .8) for a, b in wp[::3]) > 50 and passt(x, y, 27):
            belegt.append((x, y))
            M(y, setze(rnd.choice(['wild-1', 'wild-2', 'gras-hoch', 'gras-hoch', 'farn', 'kraut', 'wild-1']), x, y, rnd.uniform(.75, 1)))
    for x, t_ in [(26, 'efeu-1'), (70, 'efeu-2'), (116, 'efeu-1'), (280, 'efeu-2'), (312, 'efeu-1'), (392, 'efeu-2')]:
        M(MAUER + .3, setze(t_, x, 3, rnd.uniform(.85, 1.05)))
    return aus


def bereich_1():
    rnd, H = random.Random(41), 1100
    W = schlange([(200, H + 30), (200, H), (256, 885), (124, 740), (246, 595), (120, 450), (236, 305), (200, 140), (200, 0), (200, -30)])
    B = schlange([(350, H + 30), (350, H), (338, 900), (360, 690), (340, 480), (360, 260), (350, 60), (350, 0), (350, -30)])
    sperr = [(4, 800, 164, 962), (196, 690, 318, 812), (44, 590, 160, 674), (0, 470, 108, 600), (222, 350, 312, 470), (250, 490, 318, 552), (8, 180, 112, 312), (44, 334, 140, 396), (130, 985, 270, H)]
    frei = lambda x, y: not any(a < x < c and b < y < d for a, b, c, d in sperr)
    sch = ell(72, 588, 44, 15, F['schatten']) + ell(276, 458, 38, 13, F['schatten']) + ell(74, 304, 42, 14, F['schatten'])
    wp, bd = boden(rnd, H, W, B, frei, sch)
    st, orte = stationen(wp, [885, 740, 595, 450, 305, 140])
    st += mauer_oben(rnd)
    # Baeume
    st.append((585, varianten('baum-1', 'voll', [('kahl', setze('apfelbaum-kahl', 54, 585)), ('voll', setze('apfelbaum', 54, 585))])))
    st.append((455, setze('birnbaum', 262, 455, .86)))
    st.append((300, varianten('baum-2', 'voll', [('kahl', setze('apfelbaum-kahl', 58, 300, .98)), ('voll', setze('apfelbaum', 58, 300, .98))])))
    for x, y, s in [(300, 906, .95), (288, 930, .85), (182, 700, .8), (60, 712, .9), (292, 330, .95), (306, 352, .8), (150, 356, .85)]:
        st.append((y, setze('lavendel', x, y, s)))
    for x, y, s in [(296, 1036, 1.05), (270, 1060, .85), (300, 200, 1), (26, 420, .95), (300, 640, .9)]:
        st.append((y, setze('busch', x, y, s)))
    for x, y in [(309, 1004), (389, 930), (307, 700), (388, 640), (306, 446), (386, 330), (316, 252), (390, 140)]:
        st.append((y, setze('schilf', x, y, .9)))
    # offene Stellen
    ax, ay = 16, 836
    sch_a = schatten(poly([(2, 105), (126, 105), (138, 117), (138, 26), (126, 16)], F['schatten']), .2)
    at = lambda inhalt: f'<g transform="translate({ax} {ay})">{inhalt}</g>'
    kasten = at(sch_a + setze('beet', 0, 0))
    st.append((ay + 105, stelle('a', (ax + 63, ay + 50), 'fertig', [
        ('zu', abgesteckt(ax + 4, ay + 12, 118, 88)), ('offen', kasten + setze('spaten', ax + 92, ay + 62, 1.35)),
        ('halb', kasten + at(setze('beet-reihen-halb', 0, 0)) + setze('spaten', ax + 96, ay + 78, 1.25)), ('fertig', kasten + at(setze('beet-reihen', 0, 0)))])))
    bx, by = 214, 748
    stangen = lambda teil: setze('erdbeet', bx, by) + ''.join(setze(teil, bx + 18 + i * 28, by + 30 + (i % 2) * 8) for i in range(3))
    st.append((by + 52, stelle('b', (bx + 46, by + 16), 'fertig', [
        ('zu', abgesteckt(bx + 2, by + 2, 88, 50)), ('offen', stangen('bohnen-leer') + setze('spaten', bx + 80, by + 48, 1.1)),
        ('halb', stangen('bohnen-halb') + setze('spaten', bx + 80, by + 48, 1.1)), ('fertig', stangen('bohnen'))])))
    cx, cy = 100, 660
    kranz = setze('blumen-1', cx - 30, cy + 5, .9) + setze('blumen-3', cx + 30, cy + 5, .9)
    st.append((cy + 5, stelle('c', (cx, cy - 20), 'fertig', [
        ('zu', abgesteckt(cx - 32, cy - 26, 64, 34)), ('offen', setze('traenke-leer', cx, cy, 1.1) + setze('spaten', cx + 34, cy + 2, 1.1)),
        ('halb', setze('traenke-halb', cx, cy, 1.1) + setze('spaten', cx + 36, cy + 2, 1.1)), ('fertig', setze('traenke', cx, cy, 1.1) + kranz)])))
    dx, dy = 286, 546
    st.append((dy, stelle('d', (dx, dy - 22), 'aus', [('knospe', setze('rosen-knospe', dx, dy)), ('fertig', setze('rosen', dx, dy))])))
    # Schmuck nach Ausbau
    for x in (22, 50, 82, 116, 284, 310):
        st.append((MAUER + 9, varianten('schmuck-angelegt', 'an', [('an', setze('stockrose', x, MAUER + 9, .92))])))
    for i, (x, y) in enumerate([(120, 118), (284, 128), (268, 246), (34, 342), (176, 980), (96, 978)]):
        st.append((y, varianten('schmuck-angelegt', 'an', [('an', setze(f'blumen-{i % 3 + 1}', x, y, .95))])))
    for i, (x, y) in enumerate([(88, 142), (54, 120), (262, 160), (180, 250), (146, 206), (290, 400), (206, 412), (30, 516), (170, 560), (296, 700), (36, 712), (176, 812), (22, 976), (290, 990)]):
        st.append((y, varianten('schmuck-fertig', 'an', [('an', setze(f'blumen-{(i + 1) % 3 + 1}', x, y, .9))])))
    st.append((384, varianten('schmuck-fertig', 'an', [('an', setze('schubkarre', 92, 384, 1.05))])))
    st.append((MAUER + .2, varianten('schmuck-fertig', 'an', [('an', setze('vogel', 64, 2) + setze('vogel', 92, 2, .9) + f'<g transform="translate(300 2) scale(-1 1)"><use href="#vogel"/></g>')])))
    st += ueppig(random.Random(52), wp, H, orte, sperr + [(0, 990, 136, 1080)])
    vorn = [ebene2('vorn', 'Ganz vorn', varianten('schmuck-fertig', 'an', [('an', setze('falter-1', 182, 398) + setze('falter-2', 60, 780) + setze('falter-1', 300, 590, .9))]))]
    return schreibe('bereich-1.svg', 'b1-', H, bd, st, vorn, True, rnd)


def platzhalter():
    rnd, H = random.Random(77), 540
    W = schlange([(200, H + 30), (200, H), (246, 372), (150, 252), (200, 130), (200, 0), (200, -30)])
    B = schlange([(350, H + 30), (350, H), (338, 360), (358, 180), (350, 50), (350, 0), (350, -30)])
    sperr = [(10, 220, 120, 360), (236, 170, 320, 270), (130, 450, 270, H)]
    frei = lambda x, y: not any(a < x < c and b < y < d for a, b, c, d in sperr)
    wp, bd = boden(rnd, H, W, B, frei, ell(76, 344, 44, 15, F['schatten']) + ell(292, 258, 36, 12, F['schatten']))
    st, orte = stationen(wp, [372, 252, 130])
    st += mauer_oben(rnd)
    st += [(340, setze('birnbaum', 60, 340, 1.02)), (254, setze('birnbaum', 278, 254, .8)), (190, setze('busch', 60, 190, 1.1)), (214, setze('busch', 92, 214, .85)), (480, setze('lavendel', 300, 480, .95)), (150, setze('lavendel', 110, 150, .9)), (470, setze('schilf', 308, 470, .9)), (300, setze('schilf', 392, 300, .9)), (120, setze('schilf', 312, 120, .85))]
    st += ueppig(random.Random(53), wp, H, orte, sperr + [(0, 430, 136, 520)])
    return schreibe('platzhalter.svg', 'ph-', H, bd, st, [], True, rnd)


def anfang():
    rnd, H = random.Random(13), 190
    W = schlange([(200, H + 40), (200, H), (200, 60), (200, -30)])
    B = schlange([(350, H + 40), (350, H), (350, 50), (350, -30)])
    wp, bp = [(x, y * Q) for x, y, *_ in kurve(W)], [(x, y * Q) for x, y, *_ in kurve(B)]
    g = rect(-10, -10, 420, 80, F['wiese']) + rect(-10, 58, 420, H, F['aussen'])
    for x, y in streue(rnd, 22, lambda x, y: y > 88 and abs(x - 200) > 46 and abs(x - 350) > 40, h=H - 6):
        g += setze('gras', x, y, .95)
    sch = poly([(0, 62), (400, 62), (400, 74), (0, 74)], F['schatten']) + poly([(262, 62), (290, 74), (290, 62)], F['schatten'])
    bd = [ebene2('grund', 'Grund', g), ebene2('bach', 'Bach', bach_bild(B, rnd, 36, Q, 7) + ufersteine(B, rnd, 38, Q, 7, True)),
          ebene2('weg', 'Weg', weg_bild(W, rnd, 50, Q, steinchen=30)), ebene2('schatten', 'Schatten', schatten(sch))]
    m = rect(-10, 0, 420, 15, F['stein_h'], 0, F['stein_d'], 1) + ''.join(pfad(f'M{-6+i*27},0L{-6+i*27},15', 'none', F['stein_d'], 1) for i in range(16))
    m += mauersteine(-10, 410, 15, 63, 4, rnd, [F['stein'], F['stein_s'], F['stein_s'], F['stein']], 36) + rect(-10, 15, 420, 4, F['schatten'], extra=' fill-opacity=".16"')
    b, u = BACH_X, 63
    m += pfad(f'M{b-22},{u}L{b-22},{u-19}A22,19 0 0 1 {b+22},{u-19}L{b+22},{u}Z', F['stein_d'], F['fuge'], 1) + pfad(f'M{b-17},{u}L{b-17},{u-17}A17,15 0 0 1 {b+17},{u-17}L{b+17},{u}Z', '#2f4a58')
    m += pfad(f'M{b-17},{u}L{b-17},{u-6}C{b-8},{u-10} {b+8},{u-10} {b+17},{u-6}L{b+17},{u}Z', F['wasser']) + pfad(f'M{b-17},{u-7}C{b-6},{u-11} {b+6},{u-11} {b+17},{u-7}', 'none', F['wasser_h'], 1.6)
    st = [(62, f'<g class="g-mauer">{m}</g>'), (63, f'<g class="g-tor" transform="translate(0 -478)">{torhaus(rnd)}</g>')]
    for x, y, t, s in [(112, 71, 'busch', .9), (134, 75, 'lavendel', .85), (274, 72, 'lavendel', .95), (298, 72, 'busch', .75), (30, 73, 'stockrose', .9), (58, 72, 'stockrose', .8)]:
        st.append((y, setze(t, x, y, s)))
    fx, fy = 200, 150
    st.append((fy, f'<g class="g-figur" data-platz="1" data-ort="{fx} {fy}" display="none">{setze("figur", fx, fy, 1.22)}</g>'))
    return schreibe('anfang.svg', 'an-', H, bd, st, [], False, rnd)


def musterbogen(dazu=()):
    liste = teile() + list(dazu)
    spalten, w, h = 6, 160, 150
    hoch = (len(liste) + spalten - 1) // spalten * h
    aus = [f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" viewBox="0 0 {spalten*w} {hoch}">',
           '<!-- Musterbogen: gemeinsame Bauteile des Gartens, jedes einmal. Die Kacheln verweisen mit href="#t-..." hierher. Fusspunkt jedes Teils ist 0,0. -->',
           '<defs>' + SCHEIN.replace('id="schein"', 'id="t-schein"') + NEBEL + '</defs>']
    for i, (id_, titel, inhalt) in enumerate(liste):
        x, y = (i % spalten) * w + w / 2, (i // spalten) * h + 112
        # Teile mit Bezugspunkt links oben in die Mitte ruecken
        if id_.startswith(('beet', 'feld-', 'brach-')) and id_ != 'brach-kreuz':
            x, y = x - (63 if id_.startswith('beet') else 76), y - 100
        if id_ == 'erdbeet':
            x, y = x - 46, y - 52
        aus.append(f'<g transform="translate({n(x)} {n(y)})"><g id="t-{id_}" inkscape:label="{titel}">{inhalt}</g></g>')
        aus.append(f'<text x="{n((i % spalten) * w + w / 2)}" y="{(i // spalten) * h + 140}" text-anchor="middle" font-family="sans-serif" font-size="11" fill="{F["tinte"]}">{titel}</text>')
    text = '\n'.join(aus) + '\n</svg>\n'
    text = text.replace('href="#', 'href="#t-').replace('href="#t-t-...', 'href="#t-...').replace('url(#schein)', 'url(#t-schein)')
    open(os.path.join(ZIEL, 'teile.svg'), 'w', encoding='utf-8', newline='\n').write(text)
    return len(text.encode()), len(liste)


NEBEL = ('<radialGradient id="t-nebel"><stop offset="0" stop-color="#fff" stop-opacity=".92"/><stop offset=".55" stop-color="#fff" stop-opacity=".55"/>'
         '<stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>')
SCHEIN = ('<radialGradient id="schein"><stop offset="0" stop-color="#ffe9a6" stop-opacity=".95"/>'
          '<stop offset=".45" stop-color="#ffdf80" stop-opacity=".4"/><stop offset="1" stop-color="#ffdf80" stop-opacity="0"/></radialGradient>')

if __name__ == '__main__':
    import wandel   # Varianten mit groesserem Unterschied (Brainstorming)
    os.makedirs(ZIEL, exist_ok=True)
    print('teile', *musterbogen(wandel.teile_neu()))
    print('anfang', anfang())
    print('bereich-1', bereich_1())
    print('platzhalter', platzhalter())
    wandel.alle()
