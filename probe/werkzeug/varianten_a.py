"""Stilvarianten 1 bis 4: Aquarell, Buchmalerei, Linolschnitt, Papierschnitt."""
from vlib import *


# ---------- 1 Aquarell und Tusche ----------

def aquarell():
    r = random.Random(5)
    defs = '''
<filter id="papier" x="0" y="0" width="1" height="1"><feTurbulence type="fractalNoise" baseFrequency=".035 .04" numOctaves="5" seed="3" result="t"/><feDiffuseLighting in="t" surfaceScale="1.15" lighting-color="#fffaf0" result="l"><feDistantLight azimuth="235" elevation="62"/></feDiffuseLighting></filter>
<filter id="lasur" x="-.15" y="-.15" width="1.3" height="1.3" color-interpolation-filters="sRGB">
<feTurbulence type="fractalNoise" baseFrequency=".022" numOctaves="4" seed="8" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="15" result="d"/>
<feMorphology in="d" operator="erode" radius="2.2" result="innen"/><feGaussianBlur in="innen" stdDeviation="2.4" result="ib"/>
<feComposite in="d" in2="ib" operator="out" result="rand"/>
<feTurbulence type="fractalNoise" baseFrequency=".011 .016" numOctaves="3" seed="21" result="w"/><feColorMatrix in="w" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -2.4 1.75" result="wa"/>
<feComposite in="d" in2="wa" operator="in" result="f1"/>
<feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="2" seed="4" result="k"/><feColorMatrix in="k" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -1.5 1.35" result="ka"/><feComposite in="f1" in2="ka" operator="in" result="f2"/>
<feComponentTransfer in="d" result="zart"><feFuncA type="linear" slope=".34"/></feComponentTransfer><feComponentTransfer in="rand" result="rz"><feFuncA type="linear" slope=".5"/></feComponentTransfer>
<feMerge><feMergeNode in="zart"/><feMergeNode in="f2"/><feMergeNode in="rz"/></feMerge></filter>
<filter id="lasur2" filterUnits="userSpaceOnUse" x="-20" y="-20" width="440" height="640" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".06" numOctaves="3" seed="6" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="5" result="d"/><feMorphology in="d" operator="erode" radius=".9" result="i"/><feGaussianBlur in="i" stdDeviation="1" result="ib"/><feComposite in="d" in2="ib" operator="out" result="rand"/><feComponentTransfer in="d" result="z"><feFuncA type="linear" slope=".72"/></feComponentTransfer><feMerge><feMergeNode in="z"/><feMergeNode in="rand"/></feMerge></filter>
<filter id="tusche" x="-.1" y="-.1" width="1.2" height="1.2"><feTurbulence type="fractalNoise" baseFrequency=".045" numOctaves="3" seed="12" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3.4"/></filter>
<filter id="rausch"><feTurbulence type="fractalNoise" baseFrequency=".012 .02" numOctaves="4" seed="9"/><feDisplacementMap in="SourceGraphic" scale="90"/></filter>
<linearGradient id="lauf" x1="0" y1="0" x2="0" y2="1"><stop offset=".40" stop-color="#000"/><stop offset=".47" stop-color="#777"/><stop offset=".52" stop-color="#fff"/></linearGradient>
<mask id="nass" maskUnits="userSpaceOnUse" x="-60" y="-60" width="520" height="740"><rect x="-60" y="-60" width="520" height="740" fill="url(#lauf)" filter="url(#rausch)"/></mask>'''
    f, fk, t = [], [], []   # grosse Lasuren, kleine Tupfer, Tusche
    tinte = '#3b2f2a'
    L = lambda d, w=1.1: t.append(pfad(d, 'none', tinte, w))
    P = lambda ps: weich(ps, False)
    # Wiese in mehreren Lasuren
    for farbe, o in [('#b9c98a', .95), ('#9db56d', .7), ('#c9cf8f', .7)]:
        for _ in range(4):
            f.append(pfad(fleck(r.uniform(0, 400), r.uniform(0, 600), r.uniform(110, 190), r.uniform(70, 130), r, 9, .22), farbe, extra=f' fill-opacity="{o}"'))
    # Weg
    b = band(WEG, 54)
    f.append(pfad(weich(b[::3]), '#ecd9ab', extra=' fill-opacity=".95"'))
    f.append(pfad(weich(band(WEG, 26)[::3]), '#d8b878', extra=' fill-opacity=".5"'))
    seiten = [[(x - dy * s, y + dx * s) for x, y, dx, dy in WP[::14]] for s in (-27, 27)]
    for s in seiten:
        L(P(s), 1.25)
    for _ in range(46):
        x, y, dx, dy = r.choice(WP)
        q = r.uniform(-20, 20)
        L(f'M{n(x-dy*q)},{n(y+dx*q)}q2,-2.4 4.6,-.6', .8)
    # Brunnen rechts oben (Wasser)
    def brunnen(x, y):
        f.append(ell(x, y - 10, 31, 12, '#7fb4c9', extra=' fill-opacity=".95"') + pfad(f'M{x-34},{y-10}L{x-31},{y+18}Q{x},{y+32} {x+31},{y+18}L{x+34},{y-10}Q{x},{y+10} {x-34},{y-10}Z', '#b9aa94'))
        f.append(pfad(f'M{x-44},{y-56}L{x},{y-92}L{x+44},{y-56}Z', '#b5633f'))
        L(f'M{x-34},{y-10}a34,13 0 1 0 68,0a34,13 0 1 0 -68,0M{x-28},{y-10}a28,9.6 0 1 0 56,0a28,9.6 0 1 0 -56,0M{x-34},{y-10}L{x-31},{y+18}Q{x},{y+32} {x+31},{y+18}L{x+34},{y-10}')
        L(f'M{x-29},{y-16}L{x-29},{y-58}M{x-25},{y-18}L{x-25},{y-58}M{x+29},{y-16}L{x+29},{y-58}M{x+25},{y-18}L{x+25},{y-58}M{x-44},{y-56}L{x},{y-92}L{x+44},{y-56}ZM{x-27},{y-44}L{x+27},{y-44}M{x},{y-44}L{x},{y-26}m-5,0l10,0l-2,10l-6,0Z')
        for i in range(5):
            L(f'M{x-36+i*4},{y-60+i*-5}Q{x},{y-70-i*3} {x+36-i*4},{y-60-i*5}', .7)
        for i in range(9):
            L(f'M{x-26+i*6.6},{y+3+abs(4-i)*-1}l0,12', .7)
    brunnen(330, 300)
    # Apfelbaum
    def baum(x, y, s):
        for dx, dy, rr, c in [(0, -78, 46, '#7fa055'), (-24, -62, 32, '#9ab968'), (24, -58, 34, '#6b8e4c'), (4, -98, 30, '#a9c477')]:
            f.append(pfad(fleck(x + dx * s, y + dy * s, rr * s, rr * .86 * s, r, 9, .14), c, extra=' fill-opacity=".9"'))
        f.append(pfad(f'M{x-6*s},{y}C{x-4*s},{y-18*s} {x-5*s},{y-26*s} {x-11*s},{y-40*s}L{x+11*s},{y-40*s}C{x+5*s},{y-24*s} {x+5*s},{y-12*s} {x+8*s},{y}Z', '#8a6446'))
        L(f'M{x-6*s},{y}C{x-4*s},{y-18*s} {x-5*s},{y-26*s} {x-11*s},{y-42*s}M{x+8*s},{y}C{x+5*s},{y-12*s} {x+5*s},{y-24*s} {x+11*s},{y-42*s}M{x-1*s},{y-30*s}l-6,-22M{x+3*s},{y-34*s}l7,-20')
        L(wolke(x, y - 76 * s, 45 * s, 40 * s, 15, r, .1, 1.05), 1.1)
        for _ in range(16):
            a, q = r.uniform(0, 6.28), r.uniform(.1, .8)
            L(f'M{n(x+42*s*q*math.cos(a))},{n(y-76*s+36*s*q*math.sin(a))}q4,-5 8,0q-4,4 -8,0', .7)
        for dx, dy in [(-28, -62), (18, -92), (28, -60), (-6, -54), (2, -80), (-18, -98)]:
            fk.append(ell(x + dx * s, y + dy * s, 5.4, 5.4, '#c4483a'))
            L(f'M{n(x+dx*s-4.5)},{n(y+dy*s)}a4.5,4.5 0 1 0 9,0a4.5,4.5 0 1 0 -9,0', .9)
    baum(62, 236, .95)
    baum(350, 150, .7)
    # Bienenkoerbe auf einer Bank
    def korb(x, y):
        f.append(pfad(f'M{x-19},{y}C{x-21},{y-22} {x-10},{y-36} {x},{y-36}C{x+10},{y-36} {x+21},{y-22} {x+19},{y}Z', '#d8a648') + ell(x, y - 6, 5, 5, '#5b3d25'))
        L(f'M{x-19},{y}C{x-21},{y-22} {x-10},{y-36} {x},{y-36}C{x+10},{y-36} {x+21},{y-22} {x+19},{y}Z')
        for i in range(5):
            yy = y - 5 - i * 6.6
            b_ = 19 - i * i * .72
            L(f'M{n(x-b_)},{n(yy)}Q{x},{n(yy+5)} {n(x+b_)},{n(yy)}', .8)
        L(f'M{x-4.5},{y}a4.5,6 0 0 1 9,0')
    korb(52, 438)
    korb(96, 440)
    f.append(rect(24, 440, 104, 9, '#9a7350'))
    L('M24,440L128,440L128,449L24,449ZM34,449L32,466M118,449L120,466')
    for x, y in [(118, 408), (140, 424), (30, 396), (128, 384)]:
        L(f'M{x},{y}m-3,0a3,2 0 1 0 6,0a3,2 0 1 0 -6,0m1,-2q-3,-5 -5,-2m6,2q1,-5 4,-3', .8)
        fk.append(ell(x, y, 3, 2, '#e2a93a'))
    # Offene Stelle: Kraeuterbeet mit Flechtzaun, zur Haelfte bepflanzt
    bx, by = 296, 392
    f.append(pfad(f'M{bx},{by+18}L{bx+92},{by+14}L{bx+96},{by+64}L{bx+2},{by+68}Z', '#8c6546'))
    L(f'M{bx},{by+18}L{bx+92},{by+14}L{bx+96},{by+64}L{bx+2},{by+68}Z')
    for i in range(13):
        L(f'M{bx+3+i*7.4},{by+70}l0,-15', 1.2)
    for k in range(3):
        L(P([(bx + 1 + i * 7.6, by + 58 + k * 4 + (1.6 if i % 2 else -1.6)) for i in range(13)]), .9)
    for i in range(3):
        for j in range(2):
            x, y = bx + 16 + i * 26, by + 30 + j * 14
            L(f'M{x},{y}q-7,-8 -9,-14M{x},{y}q0,-10 1,-17M{x},{y}q6,-8 9,-13', .9)
            fk.append(pfad(fleck(x, y - 8, 11, 9, r, 7, .2), '#86a862' if j else '#8f86b8'))
    # Graeser, Blumen
    for x, y in streu(r, 60, lambda x, y: wegabstand(x, y) > 38 and not (280 < x and 380 < y < 480) and not (x < 140 and 390 < y < 470), 24):
        if r.random() < .6:
            L(f'M{n(x)},{n(y)}q-2,-6 -5,-9M{n(x)},{n(y)}q0,-6 1,-11M{n(x)},{n(y)}q2,-5 6,-8', .75)
        else:
            c = r.choice(['#c9556b', '#e0a13c', '#8d80c0', '#fff3dc'])
            fk.append(ell(x, y - 9, 5, 4.6, c))
            L(f'M{n(x)},{n(y)}l0,-6M{n(x-3.4)},{n(y-9)}a3.4,3.2 0 1 0 6.8,0a3.4,3.2 0 1 0 -6.8,0', .75)
    # Stationen: Trittstein; geschafft voll Farbe mit Kranz, naechste halb, zu nur Linie
    for i, (x, y) in enumerate(STATIONEN):
        L(f'M{x-29},{y}a29,20 0 1 0 58,0a29,20 0 1 0 -58,0M{x-29},{y}q0,9 6,13M{x+29},{y}q0,9 -6,13M{x-23},{y+13}Q{x},{y+27} {x+23},{y+13}')
        if i == 0:
            f.append(ell(x, y, 30, 21, '#e7b93f') + ell(x, y, 15, 10, '#c9702f'))
            for a in range(8):
                w = a * .785
                L(f'M{n(x+9*math.cos(w))},{n(y+6*math.sin(w))}Q{n(x+20*math.cos(w-.3))},{n(y+14*math.sin(w-.3))} {n(x+23*math.cos(w))},{n(y+16*math.sin(w))}Q{n(x+20*math.cos(w+.3))},{n(y+14*math.sin(w+.3))} {n(x+9*math.cos(w))},{n(y+6*math.sin(w))}')
        elif i == 1:
            f.append(ell(x, y, 34, 24, '#f2cf62'))
            f.append(ell(x, y, 21, 14, '#fff6dc'))
            L(f'M{x-20},{y}a20,14 0 1 0 40,0a20,14 0 1 0 -40,0', 1.4)
        else:
            L(f'M{x-12},{y+2}l4,-6l3,5l5,-8l3,7l6,-5', .9)
    # Rotkehlchen als Position, auf einem Pfahl
    x, y = 186, 372
    fk.append(pfad(f'M{x-3},{y}l0,-26l6,0l0,26Z', '#8a6446') + pfad(fleck(x - 3, y - 37, 14, 10, r, 8, .05), '#8d7056') + pfad(fleck(x + 7, y - 38, 7, 8, r, 8, .05), '#d9702f'))
    L(f'M{x-3},{y}l0,-26l6,0l0,26M{x-14},{y-38}C{x-12},{y-50} {x+6},{y-54} {x+12},{y-47}L{x+18},{y-45}L{x+12},{y-42}C{x+12},{y-30} {x},{y-26} {x-8},{y-29}L{x-22},{y-24}L{x-14},{y-38}M{x-10},{y-38}q8,-4 14,2q-6,8 -14,4M{x-1},{y-27}l0,3M{x+3},{y-28}l0,3', 1.15)
    t.append(ell(x + 8, y - 47, 1.3, 1.3, tinte))
    inhalt = '<rect width="400" height="600" fill="#fbf4e4"/>'
    inhalt += f'<g mask="url(#nass)" style="mix-blend-mode:multiply">' + ''.join(g(s, filter='url(#lasur)') for s in f) + g(''.join(fk), filter='url(#lasur2)') + '</g>'
    inhalt += g(''.join(t), filter='url(#tusche)', opacity='.88')
    inhalt += '<rect width="400" height="600" filter="url(#papier)" style="mix-blend-mode:multiply" opacity=".85"/>'
    seite('01', 'aquarell', 'Aquarell und Tusche', inhalt, grund='#e9e0cc', defs=defs)


# ---------- 2 Buchmalerei ----------

def buchmalerei():
    r = random.Random(3)
    WEG = schlange([(200, 640), (200, 600), (262, 496), (132, 388), (244, 284), (200, 206), (200, 150)])
    STATIONEN = [(262, 496), (132, 388), (244, 284)]
    WP = kurve(WEG, 60)
    wegabstand = lambda x, y: abstand(WP[::3], x, y)
    gold = 'url(#gold)'
    defs = '''<linearGradient id="gold" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="260" y2="360" spreadMethod="reflect"><stop offset="0" stop-color="#b8860f"/><stop offset=".25" stop-color="#f0cd5c"/><stop offset=".42" stop-color="#fff3b0"/><stop offset=".6" stop-color="#dba929"/><stop offset="1" stop-color="#a97a0c"/><animateTransform attributeName="gradientTransform" type="translate" from="-260 -360" to="260 360" dur="9s" repeatCount="indefinite"/></linearGradient>
<filter id="perg" x="0" y="0" width="1" height="1"><feTurbulence type="fractalNoise" baseFrequency=".012 .02" numOctaves="5" seed="7"/><feColorMatrix type="matrix" values="0 0 0 0 .55  0 0 0 0 .42  0 0 0 0 .22  .5 .4 0 0 -.28"/></filter>
<filter id="hand"><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="2" seed="2" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2"/></filter>
<radialGradient id="kronen"><stop offset="0" stop-color="#5f8a3f"/><stop offset=".7" stop-color="#2f5a2b"/><stop offset="1" stop-color="#1c3f22"/></radialGradient>
<clipPath id="innen"><rect x="44" y="44" width="312" height="512"/></clipPath>'''
    tint = '#2a1d14'
    a = '<rect width="400" height="600" fill="#f0e2bd"/><rect width="400" height="600" filter="url(#perg)" opacity=".7"/>'
    b = '<g clip-path="url(#innen)">'
    b += rect(44, 44, 312, 512, '#274a2b')
    # Himmel aus Goldgrund mit Rauten
    b += rect(44, 44, 312, 124, '#16326b')
    for i in range(14):
        for j in range(7):
            x, y = 44 + i * 24 + (12 if j % 2 else 0), 54 + j * 18
            b += poly([(x, y - 9), (x + 12, y), (x, y + 9), (x - 12, y)], 'none', '#274a94', .9)
            b += ell(x, y, 1.9, 1.9, gold)
    # Wiese: einzeln stehende Pflanzen auf dunklem Gruen
    def pflanze(x, y, art, s=1):
        d = '#12301a'
        z = ''
        blatt = lambda xx, yy, w, l=8, c='#6f9a4a': drehung(xx, yy, w, pfad(f'M0,0C-3,-{l*.4:.1f} -2.6,-{l*.8:.1f} 0,-{l}C2.6,-{l*.8:.1f} 3,-{l*.4:.1f} 0,0Z', c, d, .5))
        if art == 0:      # Maigloeckchen
            z += blatt(0, 0, -28, 14) + blatt(0, 0, 26, 13) + pfad('M0,0Q2,-10 8,-15', 'none', '#8db565', 1)
            for xx, yy in [(3, -8), (5.4, -11.4), (8, -14)]:
                z += ell(xx + .8, yy + 2, 1.6, 1.7, '#fff8ea', '#8a8a6a', .4)
        elif art == 1:    # rote Nelke
            z += pfad('M0,0L0,-13', 'none', '#7ea657', 1.1) + blatt(0, -3, -55, 7) + blatt(0, -4, 55, 7)
            z += pfad('M0,-12C-6,-12 -6,-18 -4,-20L-2,-18L0,-21L2,-18L4,-20C6,-18 6,-12 0,-12Z', '#c23a35', '#6b1714', .6)
        elif art == 2:    # blaue Iris
            z += pfad('M0,0L0,-16', 'none', '#7ea657', 1.2) + blatt(0, 0, -12, 15) + blatt(0, 0, 14, 13)
            z += pfad('M0,-15C-4,-17 -4,-23 0,-25C4,-23 4,-17 0,-15Z', '#5f7fd0', '#22356f', .6) + pfad('M0,-15C-7,-16 -8,-11 -5,-9C-3,-11 -1,-13 0,-15C1,-13 3,-11 5,-9C8,-11 7,-16 0,-15Z', '#3f5fb8', '#22356f', .6) + ell(0, -14, 1.1, 1.1, '#f0cd5c')
        elif art == 3:    # Gaensebluemchen
            z += pfad('M0,0L0,-9', 'none', '#7ea657', 1) + blatt(0, 0, -70, 6) + blatt(0, 0, 70, 6) + blatt(0, 0, -35, 6) + blatt(0, 0, 36, 6)
            for k in range(9):
                z += drehung(0, -10, k * 40, ell(0, -3, 1, 2.2, '#fffaf0', '#9a8f78', .3))
            z += ell(0, -10, 1.6, 1.6, '#f0b73c')
        elif art == 4:    # Erdbeere
            z += blatt(-1, -1, -52, 9) + blatt(1, -1, 50, 9) + blatt(0, -1, 0, 9) + pfad('M0,-2Q6,-5 8,-1', 'none', '#7ea657', .9) + pfad('M5.6,-1.4C5.4,3 7,5 8.4,5C9.8,5 11.4,2 10.8,-1.4C9.4,-2.6 7,-2.6 5.6,-1.4Z', '#cc3730', '#7a1512', .5)
        else:             # goldgelbe Ranunkel
            z += pfad('M0,0Q-2,-6 -4,-10M0,0Q2,-7 3,-13', 'none', '#7ea657', 1) + blatt(0, 0, -62, 8) + blatt(0, 0, 60, 8)
            for xx, yy in [(-4, -11), (3, -14)]:
                z += ell(xx, yy, 3, 2.6, '#f2c53d', '#9c6d0c', .5) + ell(xx, yy, 1, .9, '#b87d10')
        return drehung(x, y, r.uniform(-7, 7), z, s)
    beet = (62, 440, 150, 522)
    frei = lambda x, y: wegabstand(x, y) > 37 and y > 226 and not (beet[0] - 12 < x < beet[2] + 12 and beet[1] - 14 < y < beet[3] + 18) and not (x > 280 and 356 < y < 462) and not (x < 130 and y < 320) and not (x > 284 and 236 < y < 336)
    for x, y in sorted(streu(r, 260, lambda x, y: y > 208, 12.5, 48, 210, 354, 566), key=lambda p: p[1]):
        b += drehung(x, y, r.uniform(-20, 20), pfad('M-3,0q0,-5 -2,-7M0,0q0,-6 1,-9M3,0q0,-4 3,-6', 'none', '#3f6b38', .9))
    for x, y in sorted(streu(r, 120, frei, 17.5, 52, 226, 350, 556), key=lambda p: p[1]):
        b += pflanze(x, y, r.randrange(6), r.uniform(.95, 1.2))
    # Weg
    d = kurve_d(WEG)
    b += pfad(d, 'none', '#5a2f22', 47) + pfad(d, 'none', '#e8c9a6', 44) + pfad(d, 'none', '#f4dfc0', 30)
    for x, y, dx, dy in WP[::5]:
        for q in (-13, 0, 13):
            b += drehung(x - dy * (q + r.uniform(-2, 2)), y + dx * q, r.uniform(-20, 20), ell(0, 0, 4.2, 2.4, 'none', '#c49a72', .8))
    # Mauer mit Zinnen und Tor
    m = rect(44, 122, 312, 60, '#f1ece0', 0, tint, 1.1)
    for i in range(11):
        x = 44 + i * 30
        if not 150 < x + 10 < 250:
            m += rect(x, 106, 18, 18, '#f7f3e9', 0, tint, 1) + rect(x + 13, 107, 5, 16, '#c9c1ae')
    for j in range(4):
        for i in range(12):
            x = 44 + i * 28 + (14 if j % 2 else 0)
            m += pfad(f'M{x},{126+j*14}l0,13M{x-14},{139+j*14}l28,0', 'none', '#cfc6b1', .8)
    m += rect(160, 70, 80, 112, '#e7b8a4', 0, tint, 1.2) + rect(160, 70, 80, 10, '#c0564a', 0, tint, 1) + pfad('M154,70L200,40L246,70Z', '#2f57a8', tint, 1.2)
    for i in range(5):
        m += pfad(f'M{168+i*14},{68-abs(2-i)*-1-4}q4,5 8,0', 'none', '#7fa0e0', 1)
    m += pfad('M176,182L176,128A24,24 0 0 1 224,128L224,182Z', gold, tint, 1.4) + pfad('M181,182L181,130A19,19 0 0 1 219,130L219,182Z', '#f4dfc0', tint, 1)
    m += ell(200, 92, 9, 9, '#16326b', tint, 1) + pfad('M200,85L200,99M193,92L207,92', 'none', '#f0cd5c', 2)
    b += g(m, transform='translate(0 28)')
    # Baeume: Scheibenkrone mit Blattkranz
    def baum(x, y, s, frucht):
        z = pfad('M-4,0C-3,-18 -3,-26 -6,-40L6,-40C3,-26 3,-18 5,0Z', '#8a5a34', tint, 1) + ell(0, -62, 32, 30, 'url(#kronen)', '#12301a', 1.4)
        for q, k in [(27, 16), (19, 12), (10, 7), (0, 1)]:
            for i in range(k):
                w = i * 6.283 / k + q
                z += drehung(q * math.cos(w), -62 + q * .93 * math.sin(w), math.degrees(w) + 90, pfad('M0,0C-4,-3 -4,-8 0,-10C4,-8 4,-3 0,0Z', r.choice(['#6f9a4a', '#4f7d3a', '#8db565']), '#1c3f22', .5))
        for w, q in [(.4, 18), (1.5, 24), (2.5, 14), (3.4, 23), (4.5, 17), (5.5, 22), (0, 4)]:
            z += ell(q * math.cos(w), -62 + q * math.sin(w), 3.8, 3.8, frucht, '#6b1714', .7) + ell(q * math.cos(w) - 1, -63 + q * math.sin(w), 1, .9, '#fff', extra=' fill-opacity=".7"')
        return drehung(x, y, 0, z, s)
    b += baum(86, 316, 1.05, '#cc3730') + baum(322, 334, .95, '#e0902f')
    # Brunnen: sechseckiges Becken
    fx, fy = 314, 430
    b += poly([(fx - 34, fy - 10), (fx - 18, fy - 24), (fx + 18, fy - 24), (fx + 34, fy - 10), (fx + 18, fy + 4), (fx - 18, fy + 4)], '#f1ece0', tint, 1.1)
    b += poly([(fx - 27, fy - 10), (fx - 14, fy - 20), (fx + 14, fy - 20), (fx + 27, fy - 10), (fx + 14, fy), (fx - 14, fy)], '#4f7fc4', '#22356f', 1)
    for i in range(3):
        b += pfad(f'M{fx-18+i*2},{fy-14+i*4.4}q5,-3 9,0t9,0t9,0', 'none', '#cfe0fa', 1)
    b += poly([(fx - 34, fy - 10), (fx - 18, fy + 4), (fx - 18, fy + 24), (fx - 34, fy + 8)], '#cfc6b1', tint, 1) + poly([(fx - 18, fy + 4), (fx + 18, fy + 4), (fx + 18, fy + 24), (fx - 18, fy + 24)], '#e7b8a4', tint, 1) + poly([(fx + 34, fy - 10), (fx + 18, fy + 4), (fx + 18, fy + 24), (fx + 34, fy + 8)], '#cfc6b1', tint, 1)
    b += rect(fx - 3, fy - 44, 6, 34, gold, 1, tint, .9) + ell(fx, fy - 46, 6, 6, gold, tint, .9) + pfad(f'M{fx-3},{fy-38}q-12,2 -13,22M{fx+3},{fy-38}q12,2 13,22', 'none', '#cfe0fa', 1.6)
    # Offene Stelle: Hochbeet mit Brettern, leer bis auf drei Triebe
    x0, y0, x1, y1 = beet
    b += rect(x0, y0, x1 - x0, y1 - y0, '#b98a52', 0, tint, 1.2) + rect(x0 + 6, y0 + 6, x1 - x0 - 12, y1 - y0 - 12, '#4a2f1e', 0, tint, 1) + rect(x0, y1, x1 - x0, 12, '#8a5a34', 0, tint, 1.1)
    for k in range(5):
        b += pfad(f'M{x0+10},{y0+16+k*14}L{x1-10},{y0+16+k*14}', 'none', '#6b4830', 2)
    for k, xx in enumerate((76, 106, 136)):
        b += pflanze(xx, y0 + 20, [2, 1, 2][k], 1.1)
    # Stationen: Goldscheiben
    for i, (x, y) in enumerate(STATIONEN):
        if i == 0:
            b += ell(x, y, 27, 25, '#9c2f2a', tint, 1.3) + ell(x, y, 23, 21.4, gold, tint, 1)
            for k in range(8):
                b += drehung(x, y, k * 45, pfad('M0,-3C-6,-8 -5,-16 0,-19C5,-16 6,-8 0,-3Z', '#c23a35' if k % 2 else '#2f57a8', tint, .7))
            b += ell(x, y, 5, 5, '#fff3b0', tint, .8)
        elif i == 1:
            b += f'<circle class="puls" cx="{x}" cy="{y}" r="32" fill="none" stroke="#fff3b0" stroke-width="3"/>' + ell(x, y, 28, 26, '#16326b', tint, 1.3) + ell(x, y, 23.6, 22, gold, tint, 1) + ell(x, y, 13, 12, '#fff8e2', tint, 1) + ell(x, y, 4, 4, '#c23a35')
        else:
            b += ell(x, y, 27, 25, '#5e6f52', tint, 1.2) + ell(x, y, 22, 20.4, '#7d8a6c', tint, 1) + pfad(f'M{x},{y+9}C{x-9},{y+4} {x-8},{y-8} {x},{y-13}C{x+8},{y-8} {x+9},{y+4} {x},{y+9}Z', '#5e7a4b', tint, .9)
    # Stieglitz als Position
    x, y = 186, 440
    b += drehung(x, y, 0, pfad('M-12,-6C-12,-15 -2,-20 6,-18C10,-24 18,-22 18,-16L23,-14L18,-12C18,-3 8,2 0,1L-18,6L-12,-6Z', '#d9b27a', tint, 1) + pfad('M-13,-5C-8,-13 2,-13 6,-8C2,-1 -8,1 -13,-5Z', '#2a1d14') + pfad('M-8,-6C-4,-10 2,-10 5,-8C2,-5 -4,-4 -8,-6Z', '#f2c53d') + pfad('M12,-21C17,-22 19,-18 18,-14C15,-13 12,-15 12,-21Z', '#c23a35') + ell(15, -17, 1, 1, '#000') + pfad('M-1,1l-1,6M4,0l1,6', 'none', tint, 1.1), 1.15)
    b += '</g>'
    # Rahmen mit Ranke
    b += rect(40, 40, 320, 520, 'none', 0, gold, 7) + rect(36, 36, 328, 528, 'none', 0, tint, 1) + rect(44, 44, 312, 512, 'none', 0, tint, 1)
    def ranke(x0, y0, x1, y1, seite):
        z = ''
        laenge = math.hypot(x1 - x0, y1 - y0)
        k = int(laenge / 26)
        ux, uy = (x1 - x0) / laenge, (y1 - y0) / laenge
        ps = [(x0 + ux * laenge * i / (k * 4) + -uy * 7 * math.sin(i * 1.5708 * .5 * 2) * .9, y0 + uy * laenge * i / (k * 4) + ux * 7 * math.sin(i * 1.5708 * .5 * 2) * .9) for i in range(k * 4 + 1)]
        z += pfad(weich(ps, False), 'none', '#2f5a2b', 1.3)
        for i in range(1, k * 2):
            t = i / (k * 2)
            s = 1 if i % 2 else -1
            x, y = x0 + ux * laenge * t - uy * 9 * s, y0 + uy * laenge * t + ux * 9 * s
            w = math.degrees(math.atan2(uy, ux)) + (90 if s < 0 else -90) + 20
            if i % 5 == 0:
                for q in range(5):
                    z += drehung(x, y, q * 72, ell(0, -3.6, 2.4, 3.2, '#c23a35' if i % 2 else '#2f57a8', tint, .5))
                z += ell(x, y, 2, 2, gold, tint, .5)
            elif i % 3 == 0:
                z += ell(x, y, 3, 3, gold, tint, .6)
            else:
                z += drehung(x, y, w, pfad('M0,4C-6,2 -6,-4 -3,-5L-4,-9L0,-7L4,-9L3,-5C6,-4 6,2 0,4Z', '#4f7d3a' if i % 2 else '#2f57a8', tint, .6))
        return z
    b += ranke(20, 30, 20, 570, 1) + ranke(380, 30, 380, 570, 1) + ranke(40, 20, 360, 20, 1) + ranke(40, 580, 360, 580, 1)
    for x, y in [(20, 20), (380, 20), (20, 580), (380, 580)]:
        b += ell(x, y, 11, 11, gold, tint, 1) + pfad(f'M{x-6},{y}L{x},{y-6}L{x+6},{y}L{x},{y+6}Z', '#16326b', tint, .8)
    seite('02', 'buchmalerei', 'Buchmalerei', a + g(b, filter='url(#hand)'), css='.puls{animation:p 2.4s ease-in-out infinite}@keyframes p{50%{opacity:.15}}', grund='#3a2c1d', defs=defs)


# ---------- 3 Linolschnitt ----------

def linolschnitt():
    WEG = schlange([(200, 640), (200, 600), (262, 470), (132, 325), (246, 180), (204, 122)])
    WP = kurve(WEG, 60)
    r = random.Random(8)
    papier, ocker, gruen, nacht = '#f3ead6', '#e2a63f', '#5f9a86', '#14263d'
    defs = '''<filter id="farbe" x="-.02" y="-.02" width="1.04" height="1.04" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".55" numOctaves="3" seed="5" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -11 8.3" result="m"/><feComposite in="SourceGraphic" in2="m" operator="in" result="a"/><feTurbulence type="fractalNoise" baseFrequency=".03" numOctaves="3" seed="2" result="k"/><feDisplacementMap in="a" in2="k" scale="3.5"/></filter>'''
    kerbe = lambda x, y, w, l, b_, c=papier: drehung(x, y, w, pfad(f'M0,{n(-l/2)}Q{n(b_)},0 0,{n(l/2)}Q{n(-b_)},0 0,{n(-l/2)}Z', c))
    o = rect(0, 0, 400, 600, papier)
    # Druckgang 1: Ocker
    d1 = pfad('M0,0L400,0L400,150L0,150Z', ocker) + pfad(kurve_d(WEG), 'none', ocker, 50)
    # Druckgang 2: Gruen
    d2 = pfad('M0,120C70,96 150,128 210,112C280,96 350,118 400,104L400,600L0,600Z', gruen)
    for farbe, breite in [(papier, 56)]:
        d2 += pfad(kurve_d(WEG), 'none', papier, breite)
    d2b = pfad(kurve_d(WEG), 'none', ocker, 44)
    # Sonne mit Strahlen
    s1 = ell(200, 96, 46, 46, papier)
    for i in range(44):
        w = i * 360 / 44
        a, l = math.radians(w), 60 + (i % 3) * 13
        s1 += drehung(200 + (56 + l / 2) * math.cos(a), 96 + (56 + l / 2) * math.sin(a), w + 90, pfad(f'M0,{n(-l/2)}L2.6,{n(l/2)}L-2.6,{n(l/2)}Z', papier))
    # Druckgang 3: Nacht (Schluesselplatte)
    d3 = ''
    # Huegel mit Reben: dunkle Baender mit ausgeschnittenen Kerben
    terrassen = [(150, 22), (214, 26), (286, 30), (368, 34), (462, 40), (566, 44)]
    for k, (y, h) in enumerate(terrassen):
        pts = [(x, y + 9 * math.sin(x / 62 + k * 1.3)) for x in range(-20, 421, 20)]
        unten = [(x, yy + h) for x, yy in pts]
        d3 += f'<g><path d="{weich(pts, False)}L{n(unten[-1][0])},{n(unten[-1][1])}{weich(unten[::-1], False).replace("M", "L", 1)}Z" fill="{nacht}"/>'
        for x in range(-10, 415, 9):
            yy = y + 9 * math.sin(x / 62 + k * 1.3)
            d3 += kerbe(x + r.uniform(-2, 2), yy + h * .5, r.uniform(-14, 14), h * r.uniform(.62, .86), r.uniform(1, 2.1), gruen if r.random() < .5 else papier)
        d3 += '</g>'
        # Rebstoecke darueber
        for x in range(8, 400, 34):
            xx, yy = x + r.uniform(-5, 5), y + 9 * math.sin(x / 62 + k * 1.3)
            if abs(xx - bei_y(WP, yy)[0]) < 44:
                continue
            s = .55 + k * .12
            d3 += drehung(xx, yy + 3, r.uniform(-6, 6), pfad('M-1.4,0L-1.8,-22L1.8,-22L1.4,0Z', nacht) + pfad(wolke(0, -26, 14, 10, 8, r, .1), nacht) + ''.join(kerbe(dx, -26 + dy, dx * 5, 6, 1.3, c) for dx, dy, c in [(-8, 0, gruen), (-3, -5, papier), (3, -4, gruen), (8, 1, papier), (0, 3, gruen)]) + ''.join(ell(-4 + q * 2.6, -14 + (q % 2) * 3, 1.9, 1.9, ocker) for q in range(4)), s)
    # Weg schneidet durch alles
    weg = pfad(kurve_d(WEG), 'none', papier, 58) + pfad(kurve_d(WEG), 'none', ocker, 46)
    for x, y, dx, dy in WP[::4]:
        for q in (-15, -5, 5, 15):
            if r.random() < .55:
                weg += drehung(x - dy * (q + r.uniform(-3, 3)), y + dx * q, math.degrees(math.atan2(dy, dx)), pfad('M-6,0Q0,-1.6 6,0Q0,1.6 -6,0Z', papier if r.random() < .6 else nacht))
    for s in (-27, 27):
        weg += pfad(weich([(x - dy * s, y + dx * s) for x, y, dx, dy in WP[::8]], False), 'none', nacht, 3)
    # Kapelle vor der Sonne
    kap = pfad('M168,124L168,86L200,62L232,86L232,124Z', nacht) + pfad('M188,66L188,34L200,14L212,34L212,66Z', nacht) + pfad('M200,14L200,0M195,6L205,6', 'none', nacht, 3)
    kap += pfad('M193,124L193,108A7,8 0 0 1 207,108L207,124Z', ocker) + pfad('M196,52L196,44A4,5 0 0 1 204,44L204,52Z', papier) + ''.join(kerbe(176 + i * 8, 80 - abs(3 - i) * -2.4 + (0 if i < 4 else 0), 0, 9, 1, papier) for i in range(7) if i not in (2, 3, 4))
    # Zypressen
    zy = lambda x, y, s: drehung(x, y, 0, pfad('M0,0C-13,-10 -12,-52 0,-82C12,-52 13,-10 0,0Z', nacht) + ''.join(kerbe(math.sin(i * 2.4) * 5, -12 - i * 5.2, (-1) ** i * 24, 9, 1.3, gruen if i % 3 else papier) for i in range(12)), s)
    baeume = zy(52, 214, .9) + zy(80, 222, .7) + zy(344, 206, .95) + zy(318, 360, 1.1) + zy(356, 372, .85)
    # Bach als weisse Wellenlinien am linken Rand unten
    teich = ell(74, 480, 60, 27, papier) + ell(74, 480, 54, 23, nacht)
    for i in range(6):
        b_ = 44 - abs(2.5 - i) * 9
        teich += pfad(f'M{n(74-b_)},{n(464+i*6.4)}q{n(b_/4)},-4 {n(b_/2)},0t{n(b_/2)},0t{n(b_/2)},0t{n(b_/2)},0', 'none', [gruen, papier][i % 2], 1.8)
    teich += drehung(96, 470, 0, pfad('M-16,0C-14,9 12,9 16,0C10,2 2,0 0,-4C-3,-12 2,-16 5,-14L10,-13L6,-11C3,-9 5,-5 6,-3C-4,-8 -12,-6 -16,0Z', papier))
    # Offene Stelle: umzaeuntes leeres Feld rechts unten
    feld = poly([(286, 430), (392, 424), (396, 492), (288, 498)], ocker, nacht, 3)
    for i in range(5):
        feld += pfad(f'M290,{442+i*12}L392,{437+i*12}', 'none', nacht, 2.6)
    feld += ''.join(pfad(f'M{288+i*15.4},{500-i*.6}l0,-17', 'none', nacht, 4) for i in range(8)) + pfad('M284,490L396,484', 'none', nacht, 3)
    feld += drehung(362, 452, 14, pfad('M0,-26L0,6', 'none', nacht, 3.4) + pfad('M-6,4L6,4L4,18L0,22L-4,18Z', papier, nacht, 2) + pfad('M-6,-26L6,-26', 'none', nacht, 4))
    # Stationen
    st = ''
    for i, (x, y) in enumerate(STATIONEN):
        st += ell(x, y, 31, 25, nacht) + ell(x, y, 27, 21.4, papier)
        if i == 0:
            for k in range(12):
                w = k * 30
                st += drehung(x, y, w, f'<g transform="scale(1 .8)">{pfad("M0,-4C-5,-9 -4,-19 0,-24C4,-19 5,-9 0,-4Z", nacht if k % 2 else ocker)}</g>')
            st += ell(x, y, 5, 4, nacht)
        elif i == 1:
            st += ell(x, y, 22, 17.4, ocker, nacht, 2.4)
            for k in range(16):
                w = math.radians(k * 22.5)
                st += drehung(x + 39 * math.cos(w), y + 32 * math.sin(w), k * 22.5 + 90, pfad('M0,-7L2.6,5L-2.6,5Z', papier), 1)
            st += ell(x, y, 7, 5.6, nacht)
        else:
            st += ''.join(pfad(f'M{x-20+k*6},{y-13+abs(3-k)*1.5}L{x-24+k*6},{y+13-abs(3-k)*1.5}', 'none', nacht, 2.2) for k in range(8))
    # Figur: Wanderer mit Hut
    fig = drehung(176, 388, 0, pfad('M-11,0L-7,-30C-6,-38 6,-38 7,-30L11,0Z', nacht, papier, 2) + ell(0, -41, 6, 6, papier, nacht, 1.5) + pfad('M-15,-43Q0,-50 15,-43Q8,-40 0,-40Q-8,-40 -15,-43ZM-7,-45Q-6,-54 0,-54Q6,-54 7,-45Z', nacht) + pfad('M14,-34L18,2', 'none', nacht, 2.6) + ''.join(kerbe(-4 + q * 4, -16, 0, 20, 1, gruen) for q in range(3)), 1.05)
    F_ = lambda t: g(t, filter='url(#farbe)', style='mix-blend-mode:multiply')
    inhalt = o + g(d1 + s1, filter='url(#farbe)') + g(d2, filter='url(#farbe)') + g(d3 + weg + kap + baeume + teich + feld + st + fig, filter='url(#farbe)')
    seite('03', 'linolschnitt', 'Linolschnitt in drei Farben', inhalt, grund='#d9cfb8', defs=defs)


# ---------- 4 Papierschnitt ----------

def papierschnitt():
    r = random.Random(14)
    defs = '''<filter id="sch" x="-.2" y="-.2" width="1.4" height="1.4"><feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="#1d2436" flood-opacity=".42"/></filter>
<filter id="sch2" x="-.4" y="-.4" width="1.8" height="1.8"><feDropShadow dx="1" dy="3" stdDeviation="2.4" flood-color="#1d2436" flood-opacity=".45"/></filter>
<filter id="faser" x="0" y="0" width="1" height="1"><feTurbulence type="fractalNoise" baseFrequency=".9 .5" numOctaves="3" seed="4"/><feColorMatrix type="matrix" values="0 0 0 0 .5  0 0 0 0 .45  0 0 0 0 .4  0 0 0 .55 -.2"/></filter>
<linearGradient id="him" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7dcc0"/><stop offset="1" stop-color="#f3c9a8"/></linearGradient>'''
    S = lambda z, t: f'<g class="lage" data-tiefe="{t}">{z}</g>'
    sh = lambda z, f='sch': f'<g filter="url(#{f})">{z}</g>'
    aus = '<rect x="-20" y="-20" width="440" height="640" fill="url(#him)"/>' + S(ell(292, 86, 40, 40, '#fff3d8'), .05)
    # Huegel-Lagen von hinten nach vorn
    lagen = [('#dfe0c0', 120), ('#b9cfae', 178), ('#8fb795', 252), ('#5f9a82', 340), ('#3c7a6c', 440), ('#245a57', 540)]
    weg_farben = ['#fbeccb', '#f8e4bb', '#f5dbab', '#f1d19b', '#edc68a', '#e8ba78']
    def huegel(y, ph, farbe, k):
        pts = [(x, y + 18 * math.sin(x / 70 + ph) + 8 * math.sin(x / 31 + ph * 2)) for x in range(-30, 431, 23)]
        d = weich(pts, False) + 'L430,660L-30,660Z'
        z = pfad(d, farbe)
        # Wegstueck dieser Lage
        unten = lagen[k + 1][1] + 60 if k + 1 < len(lagen) else 660
        st = [(x, yy) for x, yy, *_ in WP if y - 16 < yy < unten]
        if len(st) > 3:
            st = st[::10]
            z += f'<clipPath id="hc{k}"><path d="{d}"/></clipPath><g clip-path="url(#hc{k})">' + pfad(weich(st, False), 'none', weg_farben[k], 46 + k * 1.5) + pfad(weich(st, False), 'none', '#ffffff', 2, ' stroke-opacity=".5" stroke-dasharray="1 9"') + '</g>'
        return z
    # Kapelle hinten
    kap = sh(pfad('M150,150L150,96L182,74L182,40L196,16L210,40L210,74L242,96L242,150Z', '#f9efe0') + pfad('M196,16L196,2M190,8L202,8', 'none', '#c98f3a', 3) + pfad('M188,150L188,122A8,9 0 0 1 204,122L204,150Z', '#c98f3a') + ell(196, 92, 8, 8, '#c98f3a') + pfad('M146,98L182,72L182,80L150,104ZM246,98L210,72L210,80L242,104Z', '#b5654a') + pfad('M178,42L196,12L214,42Z', '#b5654a'))
    zyp = lambda x, y, s, c: sh(drehung(x, y, 0, pfad('M0,0C-12,-8 -11,-46 0,-72C11,-46 12,-8 0,0Z', c), s), 'sch2')
    rund = lambda x, y, s, c, c2: sh(drehung(x, y, 0, rect(-3, -20, 6, 22, '#7a5238') + pfad(wolke(0, -44, 26, 25, 11, r, .05), c), s), 'sch2') + sh(drehung(x, y, 0, pfad(wolke(-3, -48, 16, 15, 9, r, .05), c2), s), 'sch2')
    halm = lambda x, y, w, l, c: drehung(x, y, w, pfad(f'M0,0C{-l*.2:.1f},{-l*.4:.1f} {-l*.16:.1f},{-l*.8:.1f} 0,{-l}C{l*.16:.1f},{-l*.8:.1f} {l*.2:.1f},{-l*.4:.1f} 0,0Z', c) + pfad(f'M0,-4L0,{-l*.86:.1f}', 'none', '#ffffff', 1, ' stroke-opacity=".35"'))
    def farn(x, y, w, l, c):
        z = pfad(f'M0,0Q{l*.1:.1f},{-l*.5:.1f} 0,{-l}', 'none', c, 2.6)
        for i in range(9):
            t = .14 + i * .095
            s = (1 - t) * l * .34 + 4
            z += drehung(l * .1 * t, -l * t, -58, pfad(f'M0,0Q{-3},{-s*.5:.1f} 0,{-s:.1f}Q3,{-s*.5:.1f} 0,0Z', c)) + drehung(l * .1 * t, -l * t, 58, pfad(f'M0,0Q{-3},{-s*.5:.1f} 0,{-s:.1f}Q3,{-s*.5:.1f} 0,0Z', c))
        return drehung(x, y, w, z)
    blume = lambda x, y, s, c, c2: sh(drehung(x, y, r.uniform(0, 60), ''.join(drehung(0, 0, k * 60, ell(0, -9, 5.4, 8, c)) for k in range(6)), s), 'sch2') + sh(drehung(x, y, 0, ell(0, 0, 4.6, 4.6, c2), s), 'sch2')
    def station(i, x, y):
        z = sh(ell(x, y, 31, 23, '#fff6e2'), 'sch2')
        if i == 0:
            z += blume(x, y, 1.05, '#d9614f', '#f5c869')
        elif i == 1:
            z += sh(f'<ellipse class="puls" cx="{x}" cy="{y}" rx="25" ry="18" fill="#f2b73f"/>', 'sch2') + sh(ell(x, y, 13, 9.4, '#fff6e2'), 'sch2')
        else:
            z += f'<ellipse cx="{x}" cy="{y}" rx="22" ry="16" fill="#cdb894"/>' + ell(x, y + 2, 22, 15, '#e3d1ae')
        return z
    inhalte = {
        0: kap + zyp(120, 168, .7, '#7fae92') + zyp(274, 160, .8, '#7fae92') + zyp(296, 166, .6, '#8fbb9c'),
        1: zyp(60, 226, 1, '#5f9a82') + zyp(88, 232, .8, '#6aa58c') + rund(336, 232, .8, '#d98e5a', '#eeb27e'),
        2: station(2, *STATIONEN[2]) + rund(52, 318, 1, '#e0a24e', '#f1c67c') + sh(''.join(pfad(f'M{282+k*26},{296}L{282+k*26},{264}A13,13 0 0 1 {308+k*26},{264}L{308+k*26},296L{303+k*26},296L{303+k*26},264A8,8 0 0 0 {287+k*26},264L{287+k*26},296Z', '#fbf1df') for k in range(4)), 'sch2'),
        3: station(1, *STATIONEN[1]) + sh(pfad('M262,372C292,346 372,350 400,368L420,420C380,438 290,436 262,372Z', '#6fb2c4'), 'sch2') + sh(pfad('M282,376C306,360 368,364 392,376L404,408C372,420 306,416 282,376Z', '#9fd0da'), 'sch2') + ''.join(sh(ell(x, y, 8, 4.4, '#3c8f6f'), 'sch2') for x, y in [(318, 384), (350, 396), (378, 386)]) + sh(drehung(350, 393, 0, ''.join(drehung(0, 0, w, pfad('M0,0C-4,-4 -3,-10 0,-12C3,-10 4,-4 0,0Z', '#f4b8c4')) for w in (-50, -20, 20, 50))), 'sch2'),
        4: station(0, *STATIONEN[0]) + sh(rect(24, 452, 112, 62, '#c08a56', 5), 'sch2') + sh(rect(32, 460, 96, 46, '#5a3d2b', 3), 'sch2') + ''.join(sh(rect(38, 466 + k * 9, 84, 3.4, '#7a5840', 1.7), 'sch2') for k in range(5)) + sh(drehung(104, 480, 24, rect(-2, -30, 4, 34, '#e9d4ac') + pfad('M-6,4L6,4L4,16L0,20L-4,16Z', '#cfd8d6')), 'sch2'),
        5: '',
    }
    # Position: Papiervogel
    vogel = sh('<g class="schweb">' + drehung(184, 388, -8, pfad('M-22,2L0,-10L26,-4L6,4Z', '#ffffff') + pfad('M0,-10L-6,-34L14,-7Z', '#e6ecf2') + pfad('M0,-10L22,-30L14,-7Z', '#f7f9fb') + pfad('M26,-4L34,-6L27,0Z', '#e8a13c')) + '</g>', 'sch2')
    for k, (farbe, y) in enumerate(lagen):
        aus += S(sh(huegel(y, k * 1.7 + .4, farbe, k)) + inhalte[k] + (vogel if k == 3 else ''), .1 + k * .16)
    # Vordergrund: Blaetterrahmen
    vorn = ''
    for x, y, w, l, c in [(-10, 610, 24, 150, '#12403f'), (28, 620, 8, 120, '#1a4f4b'), (60, 624, -8, 84, '#12403f'), (410, 612, -26, 160, '#12403f'), (372, 622, -10, 120, '#1a4f4b'), (336, 626, 8, 80, '#12403f'), (-14, 470, 52, 104, '#173f4a'), (414, 350, -56, 92, '#173f4a')]:
        vorn += sh(farn(x, y, w, l, c))
    vorn += blume(34, 560, 1.4, '#e58a6a', '#fbe3a6') + blume(368, 566, 1.3, '#f2b73f', '#fff6e2') + blume(78, 586, 1, '#f4b8c4', '#f5c869') + blume(330, 590, .95, '#d9614f', '#f5c869')
    aus += S(vorn, 1.25)
    aus += '<rect x="-20" y="-20" width="440" height="640" filter="url(#faser)" opacity=".5" style="mix-blend-mode:multiply"/>'
    js = "const l=[...document.querySelectorAll('.lage')];const ruhig=matchMedia('(prefers-reduced-motion: reduce)').matches;function s(x,y){l.forEach(e=>{const t=+e.dataset.tiefe;e.style.transform=`translate(${x*t*14}px,${y*t*9}px)`})}addEventListener('pointermove',e=>{if(!ruhig)s(.5-e.clientX/innerWidth,.5-e.clientY/innerHeight)});let t=0;(function f(){if(!ruhig&&!matchMedia('(hover:hover)').matches){t+=.012;s(Math.sin(t)*.35,Math.cos(t*.8)*.25)}requestAnimationFrame(f)})();"
    seite('04', 'papierschnitt', 'Papierschnitt in Lagen', aus, css='svg.bild{overflow:hidden}.lage{will-change:transform}.puls{animation:p 2.4s ease-in-out infinite}@keyframes p{50%{opacity:.6}}.schweb{animation:s 5s ease-in-out infinite}@keyframes s{50%{transform:translateY(-7px)}}', js=js, grund='#2b3340', defs=defs)


if __name__ == '__main__':
    aquarell()
    buchmalerei()
    linolschnitt()
    papierschnitt()
