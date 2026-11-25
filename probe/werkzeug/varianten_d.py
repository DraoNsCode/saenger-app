"""Stilvarianten 11, 12, 13 und 15: Marineblau und Gold, Kacheln, Fresko, Scherenschnitt."""
from vlib import *


# ---------- 11 Marineblau und Gold ----------

def marine():
    r = random.Random(2)
    WEG = schlange([(200, 640), (200, 600), (262, 470), (132, 325), (246, 180), (202, 112)])
    WP = kurve(WEG, 60)
    wegabstand = lambda x, y: abstand(WP[::3], x, y)
    nacht, creme, gold = '#15233f', '#f3ead4', '#d4af37'
    L = lambda d, w=1.3, c=creme, o=1: pfad(d, 'none', c, w, f' stroke-opacity="{o}"' if o != 1 else '')
    z, gd = '', ''
    # Rauten im Grund
    for i in range(-2, 24):
        z += L(f'M{i*20-40},0L{i*20+200},600', .5, '#2c4272', .5) + L(f'M{i*20+200},0L{i*20-40},600', .5, '#2c4272', .5)
    # Weg
    seite_ = lambda s: weich([(x - dy * s, y + dx * s) for x, y, dx, dy in WP[::8]], False)
    z += pfad(kurve_d(WEG), 'none', nacht, 60)
    gegangen = [(x, y) for x, y, dx, dy in WP if y > 320][::6]
    kommt = [(x, y) for x, y, dx, dy in WP if y <= 326][::6]
    for s in (-25, -21, 21, 25):
        ps = [(x - dy * s, y + dx * s) for x, y, dx, dy in WP]
        z += L(weich([p for p, q in zip(ps, WP) if q[1] > 322][::8], False), 1.5 if abs(s) == 25 else .8, gold)
        z += L(weich([p for p, q in zip(ps, WP) if q[1] <= 330][::8], False), 1.2 if abs(s) == 25 else .6, creme, .75)
    for i, (x, y, dx, dy) in enumerate(WP[::7]):
        an = y > 322
        z += L(f'M{n(x-dy*-16)},{n(y+dx*-16)}L{n(x-dy*16)},{n(y+dx*16)}', .8, gold if an else creme, .8 if an else .28)
    # Kreuzgang links und rechts: Rundbogen im Takt
    def bogen(x, y, b, h, fuell=False):
        d = f'M{x},{y}L{x},{y-h+b/2}A{b/2},{b/2} 0 0 1 {x+b},{y-h+b/2}L{x+b},{y}'
        return (pfad(d + 'Z', '#22345a') if fuell else '') + L(d, 1.4) + L(f'M{x+4},{y}L{x+4},{y-h+b/2}A{b/2-4},{b/2-4} 0 0 1 {x+b-4},{y-h+b/2}L{x+b-4},{y}', .7) + L(f'M{x-2},{y}L{x+b+2},{y}M{x-2},{y-h+b/2}L{x+2},{y-h+b/2}M{x+b-2},{y-h+b/2}L{x+b+2},{y-h+b/2}', 1.6)
    for k in range(4):
        z += bogen(14 + k * 34, 108, 30, 64, True) + bogen(252 + k * 34, 108, 30, 64, True)
    z += L('M0,40L150,40M250,40L400,40M0,34L150,34M250,34L400,34M0,112L400,112', 1.2)
    # Kapelle
    z += pfad('M150,112L150,52L200,14L250,52L250,112Z', '#22345a') + L('M150,112L150,52L200,14L250,52L250,112M144,56L200,12L256,56', 1.6) + L('M178,112L178,82A22,22 0 0 1 222,82L222,112', 1.4, gold) + L('M200,60L200,112M182,78L218,78', .9, gold) + ell(200, 40, 9, 9, 'none', gold, 1.4)
    for k in range(8):
        w = k * .785
        z += L(f'M{n(200+3*math.cos(w))},{n(40+3*math.sin(w))}L{n(200+9*math.cos(w))},{n(40+9*math.sin(w))}', .9, gold)
    # Zypressen und Kugelbaeume in Linien
    def zyp(x, y, s):
        a = L('M0,0C-14,-12 -12,-58 0,-90C12,-58 14,-12 0,0Z', 1.4)
        for k in range(7):
            a += L(f'M0,{-8-k*10}Q{-6+k*.5:.1f},{-16-k*10} {-8+k:.1f},{-24-k*9.4:.1f}M0,{-8-k*10}Q{6-k*.5:.1f},{-16-k*10} {8-k:.1f},{-24-k*9.4:.1f}', .7)
        return drehung(x, y, 0, pfad('M0,0C-14,-12 -12,-58 0,-90C12,-58 14,-12 0,0Z', '#1d3157') + a + L('M0,0L0,6', 1.6), s)
    def kugel(x, y, s, fr):
        a = pfad('', '') + L('M-2,0L-2,-30M2,0L2,-30', 1.2) + ell(0, -56, 28, 28, '#1d3157', creme, 1.4)
        for q in (22, 16, 10):
            k_ = int(q * 1.1)
            for i in range(k_):
                w = i * 6.283 / k_
                a += drehung(q * math.cos(w), -56 + q * math.sin(w), math.degrees(w) + 90, L('M-3,2Q0,-4 3,2', .7))
        for w, q in [(.3, 12), (1.5, 18), (2.6, 9), (3.6, 19), (4.7, 13), (5.6, 20)]:
            a += ell(q * math.cos(w), -56 + q * math.sin(w), 3, 3, gold)
        return drehung(x, y, 0, a, s)
    z += zyp(54, 236, 1) + zyp(84, 246, .75) + zyp(350, 250, 1.05) + zyp(322, 260, .75) + kugel(60, 412, 1.05, 1) + kugel(348, 560, 1.05, 1)
    # Brunnen rechts
    bx, by = 332, 372
    z += ''.join(L(f'M{bx-q},{by}a{q},{q*.42:.1f} 0 1 0 {2*q},0a{q},{q*.42:.1f} 0 1 0 {-2*q},0', w) for q, w in [(48, 1.5), (43, .8), (30, .7), (18, .7)]) + L(f'M{bx-48},{by}L{bx-44},{by+18}Q{bx},{by+40} {bx+44},{by+18}L{bx+48},{by}', 1.4) + ''.join(L(f'M{bx-40+i*10},{by+13+(1-((i-4)/4)**2)*9:.1f}l0,9', .7) for i in range(9))
    z += L(f'M{bx},{by}L{bx},{by-40}M{bx-5},{by}L{bx-3},{by-38}M{bx+5},{by}L{bx+3},{by-38}', 1.1) + ''.join(L(f'M{bx},{by-42}Q{bx+s*q},{by-58} {bx+s*q*1.7},{by-4}', .9, gold) for q in (8, 15, 22) for s in (-1, 1)) + ell(bx, by - 44, 3, 3, gold)
    # offene Stelle
    z += L('M36,470L128,470L128,536L36,536ZM41,475L123,475L123,531L41,531Z', 1.3) + ''.join(L(f'M46,{484+k*10}L118,{484+k*10}', .8, creme, .7) for k in range(5)) + ''.join(drehung(54 + k * 14, 484, 0, L('M0,0q-5,-3 -5,-9M0,0q5,-3 5,-9M0,0l0,-11', 1, gold)) for k in range(5))
    # Blumen im Grund
    for x, y in streu(r, 44, lambda x, y: wegabstand(x, y) > 40 and y > 130 and not (20 < x < 140 and 455 < y < 550) and not (270 < x and 310 < y < 420) and not (24 < x < 100 and 330 < y < 420) and not (310 < x < 386 and 470 < y < 566) and not (x < 100 and y < 250) and not (x > 306 and y < 264), 30, 12, 130, 388, 592):
        an = y > 322
        z += drehung(x, y, r.uniform(0, 60), ''.join(drehung(0, 0, k * 60, L('M0,0C-2.4,-3 -2,-6.4 0,-8C2,-6.4 2.4,-3 0,0Z', .8, gold if an else creme, 1 if an else .55)) for k in range(6)) + ell(0, 0, 1.4, 1.4, gold if an else creme))
    # Stationen
    for i, (x, y) in enumerate(STATIONEN):
        z += ell(x, y, 32, 32, nacht)
        if i == 0:
            z += ell(x, y, 28, 28, gold) + ell(x, y, 24, 24, 'none', nacht, 1) + ''.join(drehung(x, y, k * 45, pfad('M0,-3C-6,-8 -5,-17 0,-21C5,-17 6,-8 0,-3Z', nacht)) for k in range(8)) + ell(x, y, 4, 4, nacht)
        elif i == 1:
            z += f'<circle class="puls" cx="{x}" cy="{y}" r="36" fill="none" stroke="{gold}" stroke-width="1.6"/>' + ell(x, y, 28, 28, nacht, gold, 3) + ell(x, y, 22, 22, 'none', gold, 1) + ''.join(L(f'M{n(x+24*math.cos(k*.2618))},{n(y+24*math.sin(k*.2618))}L{n(x+27*math.cos(k*.2618))},{n(y+27*math.sin(k*.2618))}', .9, gold) for k in range(24)) + ell(x, y, 8, 8, gold)
        else:
            z += ell(x, y, 28, 28, nacht, creme, 1.4) + ell(x, y, 22, 22, 'none', creme, .7) + L(f'M{x},{y+11}C{x-10},{y+5} {x-9},{y-8} {x},{y-14}C{x+9},{y-8} {x+10},{y+5} {x},{y+11}ZM{x},{y+11}L{x},{y-8}', 1)
    # Schwalbe als Position
    z += drehung(182, 388, -14, pfad('M-30,10C-16,2 -10,-2 -2,-4C-8,-16 -22,-26 -36,-28C-18,-30 4,-22 12,-8C18,-10 24,-8 27,-4C20,-2 16,2 10,4C14,14 8,24 -6,32C2,22 2,12 -2,6C-10,8 -20,10 -30,18L-24,11Z', gold, nacht, 1.4))
    z += rect(7, 7, 386, 586, 'none', 4, gold, 1.6) + rect(12, 12, 376, 576, 'none', 2, gold, .7)
    seite('11', 'marine-gold', 'Marineblau und Gold', rect(0, 0, 400, 600, nacht) + z, css='.puls{animation:p 2.6s ease-in-out infinite;transform-box:fill-box;transform-origin:center}@keyframes p{0%{transform:scale(.86);opacity:1}100%{transform:scale(1.25);opacity:0}}', grund='#0c1528')


# ---------- 12 Kacheln ----------

def kacheln():
    r = random.Random(19)
    b = ['#12306f', '#1f4a9a', '#3f70bd', '#7fa4d8', '#b9d0ec', '#dde9f6']
    defs = '''<filter id="glasur" x="-.02" y="-.02" width="1.04" height="1.04"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="6" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="4" result="d"/><feGaussianBlur in="d" stdDeviation=".55"/></filter>
<filter id="wolk" x="0" y="0" width="1" height="1"><feTurbulence type="fractalNoise" baseFrequency=".02" numOctaves="4" seed="9"/><feColorMatrix type="matrix" values="0 0 0 0 .55  0 0 0 0 .63  0 0 0 0 .74  .5 .3 0 0 -.3"/></filter>
<linearGradient id="glanz" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".18" stop-color="#fff" stop-opacity=".08"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#0c1a38" stop-opacity=".12"/></linearGradient>'''
    P = lambda d, f, o=1, st=None, w=1.2: pfad(d, f, st, w, f' fill-opacity="{o}"')
    L = lambda d, w=1.3, c=b[0]: pfad(d, 'none', c, w)
    m = ''
    # Wiese als lasierte Flecken
    for _ in range(60):
        m += P(fleck(r.uniform(0, 400), r.uniform(0, 600), r.uniform(26, 60), r.uniform(8, 18), r), b[4], r.uniform(.3, .7))
    for x, y in streu(r, 90, lambda x, y: wegabstand(x, y) > 36, 20):
        m += drehung(x, y, 0, L('M-5,0q-1,-5 -3,-8M0,0q0,-6 1,-10M5,0q1,-5 4,-7', 1.2, b[r.randrange(1, 4)]))
    # Weg: hell mit blauem Rand und Schattierung
    m += pfad(kurve_d(WEG), 'none', b[2], 56) + pfad(kurve_d(WEG), 'none', '#f7fafc', 51)
    m += pfad(weich([(x - dy * 17, y + dx * 17) for x, y, dx, dy in WP[::8]], False), 'none', b[4], 14, ' stroke-opacity=".9"')
    for x, y, dx, dy in WP[::4]:
        if r.random() < .6:
            q = r.uniform(-18, 18)
            m += drehung(x - dy * q, y + dx * q, 0, L('M-4,0q4,-2.6 8,0', 1, b[3]))
    def baum(x, y, s):
        a = P('M-5,0C-3,-18 -4,-28 -9,-40L9,-40C4,-28 4,-18 7,0Z', b[1])
        for q, c, k in [(1, b[1], 17), (.76, b[2], 13), (.5, b[3], 10)]:
            a += P(wolke(-4 * (1 - q) * 4, -70 - 10 * (1 - q), 42 * q, 36 * q, k, r, .1), c, .92)
        for _ in range(38):
            w, q = r.uniform(0, 6.28), math.sqrt(r.random())
            a += drehung(38 * q * math.cos(w), -70 + 33 * q * math.sin(w), r.uniform(-40, 40), L('M-3,1.4Q0,-3 3,1.4', 1, r.choice([b[0], b[5], b[0]])))
        return drehung(x, y, 0, a, s)
    m += baum(58, 286, 1) + baum(352, 300, .9) + baum(64, 592, 1.1)
    # Teich mit Schwan
    m += P(fleck(86, 420, 74, 34, r, 10, .06), b[2], .9) + P(fleck(86, 419, 64, 27, r, 10, .06), b[3], .9)
    for i in range(5):
        w = 46 - abs(2 - i) * 9
        m += L(f'M{86-w},{402+i*9}q{w/4:.1f},-4 {w/2:.1f},0t{w/2:.1f},0t{w/2:.1f},0t{w/2:.1f},0', 1.3, ['#f7fafc', b[1]][i % 2])
    m += drehung(92, 420, 0, P('M-24,0C-22,14 20,16 25,-2C16,4 6,0 2,-6C-4,-20 4,-30 10,-27C13,-24 11,-20 8,-18C7,-12 12,-6 16,-5C2,-12 -18,-10 -24,0Z', '#fbfdff', 1, b[0], 1.5) + L('M-14,0q8,6 22,1M-10,-4q8,4 18,1', 1, b[2]) + P('M10,-27L18,-24L11,-22Z', b[0]))
    # offene Stelle
    m += P('M292,408L378,402L384,466L294,472Z', b[3], .9, b[0], 1.6) + ''.join(L(f'M298,{420+k*11}L378,{415+k*11}', 2.4, b[1]) for k in range(5)) + ''.join(drehung(306 + k * 17, 421 - k * 1, 0, L('M0,0q-6,-4 -6,-11M0,0q6,-4 6,-11M0,0l0,-13', 1.4, b[0])) for k in range(3))
    # Stationen
    for i, (x, y) in enumerate(STATIONEN):
        m += ell(x, y, 34, 34, '#f7fafc', b[0], 2) + ell(x, y, 29, 29, 'none', b[1], 1)
        if i == 0:
            m += ''.join(drehung(x, y, k * 45, P('M0,-4C-8,-9 -7,-20 0,-25C7,-20 8,-9 0,-4Z', b[1] if k % 2 else b[2], 1, b[0], 1)) for k in range(8)) + ell(x, y, 5.6, 5.6, '#e7b93f', b[0], 1.2)
        elif i == 1:
            m += ell(x, y, 24, 24, 'none', '#e0a52c', 6) + ell(x, y, 24, 24, 'none', b[0], .8) + ell(x, y, 8, 8, '#e0a52c', b[0], 1.2)
        else:
            m += L(f'M{x-15},{y+9}q7,-5 15,0t15,0M{x-12},{y}q6,-5 12,0t12,0', 1.4, b[4])
    # Figur im Profil
    m += drehung(182, 398, 0, P('M-11,0L-8,-28C-6,-38 6,-38 8,-28L12,0Q0,5 -11,0Z', b[1], 1, b[0], 1.5) + L('M-2,-34L-4,0M4,-30L6,0', 1, b[3]) + ell(0, -41, 6.4, 6.4, '#f7fafc', b[0], 1.4) + P('M-16,-43Q0,-50 17,-43Q8,-39 0,-39Q-8,-39 -16,-43ZM-8,-45Q-7,-55 0,-55Q7,-55 8,-45Z', b[2], 1, b[0], 1.3) + P('M8,-24L18,-27L19,-14L9,-12Z', '#e0a52c', 1, b[0], 1.2), 1.1)
    # Haus und Wolken oben (nur blass, noch nicht gebrannt)
    o = L('M140,100L140,52L200,10L260,52L260,100ZM180,100L180,70A20,20 0 0 1 220,70L220,100M0,100L140,100M260,100L400,100M0,72L140,72M260,72L400,72', 1.2, b[4])
    inhalt = rect(0, 0, 400, 600, '#8f9aa8')
    K = 100
    for j in range(6):
        for i in range(4):
            x, y = i * K, j * K
            ton = r.choice(['#f2f5f4', '#eef2f2', '#f6f7f3', '#ebf0f0'])
            fertig = j >= 3 or (j == 2 and i in (0, 1)) or (j == 2 and i == 2)
            inhalt += f'<clipPath id="k{i}{j}"><rect x="{x+1.4}" y="{y+1.4}" width="{K-2.8}" height="{K-2.8}" rx="3"/></clipPath><g clip-path="url(#k{i}{j})">' + rect(x, y, K, K, ton)
            inhalt += f'<use href="#{"bild" if fertig else "skizze"}" transform="translate({r.uniform(-.8, .8):.1f} {r.uniform(-.8, .8):.1f})"' + ('' if fertig else ' opacity=".75"') + '/>'
            # Eckornamente
            for ex, ey, w in [(x + 2, y + 2, 0), (x + 98, y + 2, 90), (x + 98, y + 98, 180), (x + 2, y + 98, 270)]:
                inhalt += drehung(ex, ey, w, P('M0,0L13,0C12,5 9,4 8,8C4,9 5,12 0,13Z', b[1] if fertig else b[4], .9) + ell(13, 13, 1.8, 1.8, b[1] if fertig else b[4]) + L('M5,5L11,11', 1, b[1] if fertig else b[4]), 1)
            for _ in range(r.randrange(1, 4)):
                px, py = x + r.uniform(0, K), y + r.uniform(0, K)
                ps = [(px, py)]
                for _ in range(5):
                    px += r.uniform(-16, 16)
                    py += r.uniform(-16, 16)
                    ps.append((px, py))
                inhalt += pfad(weich(ps, False), 'none', '#6f7f95', .4, ' stroke-opacity=".4"')
            inhalt += f'<rect class="kg" style="animation-delay:-{(i+j)*.7:.1f}s" x="{x+1.4}" y="{y+1.4}" width="{K-2.8}" height="{K-2.8}" rx="3" fill="url(#glanz)"/></g>'
    skizze = ''.join(pfad(weich([(x - dy * s, y + dx * s) for x, y, dx, dy in WP[::8]], False), 'none', b[4], 1.4) for s in (-26, 26)) + ''.join(ell(x, y, 34, 34, 'none', b[4], 1.4) + ell(x, y, 29, 29, 'none', b[4], .8) for x, y in STATIONEN) + pfad(wolke(58, 216, 42, 36, 15, r, .1), 'none', b[4], 1.2) + pfad(wolke(352, 236, 38, 33, 15, r, .1), 'none', b[4], 1.2)
    defs += f'<g id="bild" filter="url(#glasur)">{m}</g><g id="skizze">{skizze}{o}</g>'
    inhalt += '<rect width="400" height="600" filter="url(#wolk)" opacity=".5" style="mix-blend-mode:multiply"/>'
    seite('12', 'kacheln', 'Blau-weiße Kacheln', inhalt, css='.kg{animation:gl 8s ease-in-out infinite}@keyframes gl{50%{opacity:.45}}', grund='#c9d1da', defs=defs)


# ---------- 13 Fresko ----------

def fresko():
    r = random.Random(23)
    defs = '''<filter id="putz" x="0" y="0" width="1" height="1"><feTurbulence type="fractalNoise" baseFrequency=".05 .06" numOctaves="5" seed="4" result="t"/><feDiffuseLighting in="t" surfaceScale="1.7" lighting-color="#fff6e6"><feDistantLight azimuth="220" elevation="58"/></feDiffuseLighting></filter>
<filter id="rau" x="-.02" y="-.02" width="1.04" height="1.04"><feTurbulence type="fractalNoise" baseFrequency=".06" numOctaves="3" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="6"/></filter>
<filter id="abrieb" x="0" y="0" width="1" height="1"><feTurbulence type="fractalNoise" baseFrequency=".016 .02" numOctaves="5" seed="31"/><feColorMatrix type="matrix" values="0 0 0 0 .86  0 0 0 0 .80  0 0 0 0 .70  2.6 0 0 0 -1.42"/></filter>
<filter id="fransen" x="-.1" y="-.1" width="1.2" height="1.2"><feTurbulence type="fractalNoise" baseFrequency=".018 .022" numOctaves="4" seed="14"/><feDisplacementMap in="SourceGraphic" scale="64"/></filter>
<linearGradient id="tiefe" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fb9b4"/><stop offset=".5" stop-color="#7fa39a"/><stop offset="1" stop-color="#5d8a78"/></linearGradient>
<mask id="rest" maskUnits="userSpaceOnUse" x="-60" y="-60" width="520" height="720"><rect x="-60" y="-60" width="520" height="720" fill="#fff"/><path d="M-80,-80L480,-80L480,150C420,190 360,120 300,170C250,212 190,150 130,196C80,232 20,186 -80,214Z" fill="#000" filter="url(#fransen)"/></mask>'''
    tf = []
    def tu(x, y, l, b_, w, c, o=.9):
        tf.append(f'<ellipse cx="{n(x)}" cy="{n(y)}" rx="{n(l)}" ry="{n(b_)}" transform="rotate({n(w)} {n(x)} {n(y)})" fill="{c}" fill-opacity="{o:.2f}"/>')
    tf.append('<rect width="400" height="600" fill="url(#tiefe)"/>')
    for _ in range(700):
        x, y = r.uniform(-10, 410), r.uniform(-10, 610)
        tu(x, y, r.uniform(8, 18), r.uniform(3, 6), r.uniform(-20, 20), r.choice(['#8fb0a0', '#6f9a86', '#a9c0ae', '#5d8a72', '#86a888', '#7d9f6f']), r.uniform(.3, .65))
    tf.append(pfad(kurve_d(WEG), 'none', '#b98d6a', 56) + pfad(kurve_d(WEG), 'none', '#dcbf98', 47))
    for _ in range(620):
        x, y, dx, dy = r.choice(WP)
        q = r.uniform(-23, 23)
        tu(x - dy * q, y + dx * q, r.uniform(4, 10), r.uniform(1.8, 3.2), math.degrees(math.atan2(dy, dx)) + r.uniform(-20, 20), r.choice(['#e8d2b0', '#d3b088', '#c99f78', '#efdfc2', '#dcbf98']), r.uniform(.5, .85))
    laub = ['#2f4f3f', '#41664a', '#5a7f4f', '#7d9c5f', '#a3b573']
    def krone(x, y, rx, ry, k, farben=laub):
        for i in range(k):
            a, q = r.uniform(0, 6.283), math.sqrt(r.random())
            dx, dy = q * math.cos(a), q * math.sin(a)
            h = max(0, min(.99, (-dx * .6 - dy * .8 + 1.3) / 2.6 + r.uniform(-.2, .2)))
            tu(x + dx * rx, y + dy * ry, r.uniform(4, 8), r.uniform(1.6, 3), math.degrees(math.atan2(dy, dx)) + r.uniform(-40, 40), farben[int(h * len(farben))], .9)
    def stamm(x, y, h, b_):
        for _ in range(int(h)):
            t = r.random()
            tu(x + r.uniform(-b_, b_) * (1.1 - t * .5), y - t * h, r.uniform(1, 2.2), r.uniform(4, 8), r.uniform(-6, 6), r.choice(['#5d4433', '#7a5a42', '#94705180'[:7]]), .9)
    def frucht(x, y, c, q=5):
        tu(x, y, q, q, 0, c, .97)
        tu(x - q * .3, y - q * .35, q * .42, q * .34, 0, misch(c, '#ffffff', .45), .85)
        tu(x + q * .35, y + q * .4, q * .5, q * .36, 30, misch(c, '#3a1c10', .35), .5)
    dinge = []
    M = lambda y, fn: dinge.append((y, fn))
    def granat(x, y, s):
        def f():
            stamm(x, y, 46 * s, 5 * s)
            krone(x, y - 76 * s, 50 * s, 44 * s, int(240 * s))
            for a, b_ in [(-26, -62), (18, -84), (30, -58), (-6, -96), (2, -60), (-34, -86)]:
                frucht(x + a * s, y + b_ * s, '#b5402f', 6.4 * s)
        return f
    def quitte(x, y, s):
        def f():
            stamm(x, y, 44 * s, 4.6 * s)
            krone(x, y - 72 * s, 44 * s, 42 * s, int(220 * s), ['#33553f', '#4b6f4a', '#6b8c55', '#93a566', '#b9bd7f'])
            for a, b_ in [(-22, -60), (14, -84), (24, -56), (-4, -52), (-14, -90)]:
                frucht(x + a * s, y + b_ * s, '#e0b23c', 6.4 * s)
        return f
    M(296, granat(56, 296, 1))
    M(330, quitte(346, 330, 1))
    M(600, granat(364, 604, 1.2))
    # Brunnenschale mit Wasser
    def schale():
        for _ in range(170):
            t = r.uniform(-1, 1)
            tu(66 + t * 46, 402 + 12 * math.sqrt(max(0, 1 - t * t)) * r.uniform(-1, 1), r.uniform(4, 9), r.uniform(1.4, 2.6), 0, r.choice(['#cfd9d4', '#9fc0c6', '#7fa9b5', '#e6ebe2']), .9)
        for _ in range(150):
            t = r.uniform(-1, 1)
            tu(66 + t * 48, 410 + (1 - t * t) * r.uniform(4, 26), r.uniform(4, 8), r.uniform(1.6, 3), 0, r.choice(['#e8dfcc', '#d3c6ac', '#bcab8d', '#f0e9da']), .95)
        for _ in range(60):
            tu(66 + r.uniform(-9, 9), r.uniform(432, 462), 4, 2.6, 80, r.choice(['#d3c6ac', '#bcab8d', '#e8dfcc']), .95)
    M(464, schale)
    # offene Stelle: Flechtzaun mit leerer Erde
    def beet():
        for _ in range(150):
            tu(r.uniform(30, 138), r.uniform(506, 560), r.uniform(5, 10), r.uniform(1.8, 3), r.uniform(-8, 8), r.choice(['#7a5640', '#8d6a50', '#69483a', '#a07c5c']), .92)
        for k in range(12):
            for _ in range(6):
                tu(28 + k * 10, 570 - r.uniform(0, 30), 1.6, 4, 0, r.choice(['#b98a52', '#94693c', '#d3ac74']), .95)
        for k in range(4):
            for _ in range(36):
                x = r.uniform(26, 142)
                tu(x, 548 + k * 6 + 1.6 * math.sin(x / 3.2 + k * 3.1), 4, 1.3, 0, r.choice(['#c99c62', '#a9793f', '#ddbb88']), .95)
    M(572, beet)
    def rosen(x, y, k=26):
        def f():
            krone(x, y - 8, 24, 13, 60)
            for _ in range(k):
                frucht(x + r.gauss(0, 12), y - 9 + r.gauss(0, 6), r.choice(['#c9666a', '#e0a39b', '#f0d3c8', '#d98a86']), r.uniform(2.2, 3.6))
        return f
    for x, y in [(310, 520), (192, 540), (96, 366), (300, 412), (196, 244), (352, 420)]:
        M(y, rosen(x, y))
    for i, (x, y) in enumerate(STATIONEN):
        def f(i=i, x=x, y=y):
            g_ = [['#d8b36a', '#e8cc8c', '#c2964c'], ['#f0e0bc', '#e6cf9c', '#fbf1dc'], ['#a9a593', '#95917f', '#bcb7a3']][i]
            for _ in range(110):
                a, q = r.uniform(0, 6.283), math.sqrt(r.random())
                tu(x + 30 * q * math.cos(a), y + 23 * q * math.sin(a), r.uniform(3, 7), r.uniform(1.6, 2.8), math.degrees(a) + 90, r.choice(g_), .95)
            ring = ['#8d2f26', '#d99a2b', '#7d7a6c'][i]
            for k in range(90):
                w = k * .0698
                tu(x + 29 * math.cos(w), y + 22 * math.sin(w), 3.4, 1.7, math.degrees(w) + 90, misch(ring, '#f3d9a0', r.uniform(0, .3)), .97)
            if i == 0:
                for k in range(6):
                    for q in (.3, .55, .8):
                        w = k * 1.047
                        tu(x + 22 * q * math.cos(w), y + 16 * q * math.sin(w), 6 - q * 2, 3.4, math.degrees(w), ['#8d2f26', '#a9443a', '#c26a52'][int(q * 3) % 3], .95)
                frucht(x, y, '#e8cc8c', 4.4)
            elif i == 1:
                for k in range(40):
                    w = k * .157
                    tu(x + 17 * math.cos(w), y + 12.6 * math.sin(w), 3, 1.5, math.degrees(w) + 90, '#b5402f', .9)
                frucht(x, y, '#b5402f', 4.6)
        M(y, f)
    def amsel():
        for _ in range(90):
            a, q = r.uniform(0, 6.283), math.sqrt(r.random())
            tu(186 + 17 * q * math.cos(a), 384 + 10 * q * math.sin(a), 4, 1.8, -20, r.choice(['#3f5a7a', '#55728f', '#2f4560', '#7a94a8'] if q < .9 else ['#2f4560']), .95)
        for _ in range(40):
            a, q = r.uniform(0, 6.283), math.sqrt(r.random())
            tu(202 + 8 * q * math.cos(a), 372 + 7.4 * q * math.sin(a), 3, 1.8, 0, r.choice(['#3f5a7a', '#55728f', '#2f4560']), .95)
        for _ in range(34):
            a, q = r.uniform(0, 6.283), math.sqrt(r.random())
            tu(196 + 9 * q * math.cos(a), 388 + 6 * q * math.sin(a), 3, 1.6, 10, r.choice(['#d9a36a', '#c98450', '#e8c79a']), .9)
        for k in range(16):
            tu(172 - k * 1.5, 388 + k * .9, 4, 1.4, 30, '#2f4560', .9)
        tu(213, 372, 5, 1.6, 6, '#d99a2b', 1)
        tu(204, 370, 1.5, 1.5, 0, '#15110d', 1)
        for dx in (-3, 5):
            for k in range(4):
                tu(188 + dx, 395 + k * 2.4, .9, 2, 0, '#7a4a2c', 1)
    M(404, amsel)
    for y, fn in sorted(dinge, key=lambda t: t[0]):
        fn()
    # Sockelband unten wie in einem gemalten Gartenzimmer
    band_ = rect(0, 582, 400, 18, '#8d2f26') + rect(0, 578, 400, 4, '#e8cc8c')
    risse = ''
    for x, y, w in [(330, 0, 92), (60, 190, 70), (400, 250, 160), (0, 470, 12), (240, 210, 84), (150, 600, -80)]:
        ps = [(x, y)]
        for _ in range(11):
            x += 18 * math.cos(math.radians(w)) + r.uniform(-9, 9)
            y += 18 * math.sin(math.radians(w)) + r.uniform(-9, 9)
            ps.append((x, y))
        d = 'M' + 'L'.join(f'{n(a)},{n(b)}' for a, b in ps)
        risse += pfad(d, 'none', '#4a3a2c', 1, ' stroke-opacity=".6"') + f'<path d="{d}" transform="translate(1 1)" fill="none" stroke="#fff6e6" stroke-width=".7" stroke-opacity=".5"/>'
    sinopia = ''.join(pfad(weich([(x - dy * s, y + dx * s) for x, y, dx, dy in WP if y < 250][::8], False), 'none', '#a9573a', 1.4, ' stroke-opacity=".55"') for s in (-26, 26)) + ell(246, 180, 30, 23, 'none', '#a9573a', 1.4, ' stroke-opacity=".6"') + pfad('M140,96L140,48L200,8L260,48L260,96M180,96L180,66A20,20 0 0 1 220,66L220,96M0,96L140,96M260,96L400,96', 'none', '#a9573a', 1.4, ' stroke-opacity=".55"') + pfad(wolke(58, 150, 42, 38, 12, r), 'none', '#a9573a', 1.2, ' stroke-opacity=".45"') + pfad(wolke(346, 150, 40, 36, 12, r), 'none', '#a9573a', 1.2, ' stroke-opacity=".45"')
    inhalt = '<rect width="400" height="600" fill="#cdbfa6"/>' + sinopia + g(g(''.join(tf) + band_, filter='url(#rau)'), mask='url(#rest)') + '<rect width="400" height="600" filter="url(#abrieb)" opacity=".5"/>' + risse + '<rect width="400" height="600" filter="url(#putz)" opacity=".8" style="mix-blend-mode:multiply"/>'
    seite('13', 'fresko', 'Fresko', inhalt, grund='#b3a58b', defs=defs)


# ---------- 15 Scherenschnitt ----------

def scherenschnitt():
    r = random.Random(27)
    sw, pap = '#17130f', '#f4ead6'
    z = rect(0, 0, 400, 600, pap)
    # helle Flaeche mit Sonne, schwarzer Garten darin
    z += ell(200, 120, 62, 62, '#f0c766')
    # Boden als Schwarz, Weg und Formen ausgeschnitten
    z += pfad('M0,176C60,150 110,178 160,162C200,150 250,150 300,166C340,178 370,158 400,170L400,600L0,600Z', sw)
    w = schlange([(200, 640), (200, 600), (262, 470), (132, 325), (246, 196), (206, 150)])
    wp = kurve(w, 60)
    z += pfad(kurve_d(w), 'none', pap, 50)
    for x, y, dx, dy in wp[::9]:
        z += drehung(x, y, math.degrees(math.atan2(dy, dx)), pfad('M-3,-15Q0,0 -3,15Q3,0 -3,-15Z', sw, extra=' fill-opacity=".85"'))
    # Kapelle auf dem Huegel
    kap = pfad('M160,166L160,112L178,98L178,60L196,28L214,60L214,98L232,112L232,166Z', sw) + pfad('M196,30L196,10M188,17L204,17', 'none', sw, 3) + pfad('M187,166L187,136A9,10 0 0 1 205,136L205,166Z', pap) + ell(196, 84, 7, 7, pap) + pfad('M196,77L196,91M189,84L203,84', 'none', sw, 1.4) + ''.join(pfad(f'M{166+k*50},146L{166+k*50},126A5,6 0 0 1 {176+k*50},126L{176+k*50},146Z', pap) for k in range(2))
    z += kap
    def blattwerk(x, y, w0, l, tiefe=3, c=sw, s=1):
        a = pfad(f'M0,0Q{l*.08:.1f},{-l*.5:.1f} 0,{-l:.1f}', 'none', c, max(1.2, 3.4 * s))
        for i in range(7):
            t = .16 + i * .125
            ll = l * .28 * (1.1 - t * .6)
            for sg in (-1, 1):
                a += drehung(l * .05 * math.sin(t * 3), -l * t, sg * (54 - i * 3), pfad(f'M0,0C{-ll*.3:.1f},{-ll*.34:.1f} {-ll*.26:.1f},{-ll*.8:.1f} 0,{-ll:.1f}C{ll*.26:.1f},{-ll*.8:.1f} {ll*.3:.1f},{-ll*.34:.1f} 0,0Z', c) + pfad(f'M0,{-ll*.16:.1f}L0,{-ll*.8:.1f}', 'none', pap if c == sw else sw, .9))
        a += drehung(0, -l, 0, pfad(f'M0,0C{-l*.07:.1f},{-l*.07:.1f} {-l*.06:.1f},{-l*.18:.1f} 0,{-l*.22:.1f}C{l*.06:.1f},{-l*.18:.1f} {l*.07:.1f},{-l*.07:.1f} 0,0Z', c))
        return drehung(x, y, w0, a)
    def blume(x, y, s, c, k=8):
        return drehung(x, y, 0, ''.join(drehung(0, 0, q * 360 / k, pfad('M0,-3C-6,-8 -5,-17 0,-20C5,-17 6,-8 0,-3Z', c) + pfad('M0,-8L0,-15', 'none', pap if c == sw else sw, 1)) for q in range(k)) + ell(0, 0, 3.4, 3.4, c), s)
    # helle Schnitte in der schwarzen Wiese
    frei = lambda x, y: abstand(wp[::3], x, y) > 46 and y > 206 and not (30 < x < 136 and 438 < y < 534) and not (280 < x and 300 < y < 400) and not (x < 112 and 300 < y < 430) and not (x > 282 and 440 < y < 580)
    for x, y in streu(r, 70, frei, 25, 34, 206, 366, 566):
        if r.random() < .45:
            z += blume(x, y, r.uniform(.5, .72), pap, r.choice([5, 6, 8]))
        else:
            z += drehung(x, y + 6, r.uniform(-16, 16), ''.join(drehung(0, 0, q, pfad('M0,0C-2.4,-5 -2,-11 0,-14C2,-11 2.4,-5 0,0Z', pap)) for q in (-34, 0, 34)))
    # Baeume in hell aus dem Schwarz geschnitten
    def baum(x, y, s):
        a = pfad('M-5,0C-3,-20 -3,-30 -6,-42L6,-42C3,-30 3,-20 5,0Z', pap) + ell(0, -78, 40, 40, pap) + ell(0, -78, 36, 36, sw)
        for q, k in [(29, 16), (20, 11), (11, 6)]:
            for i in range(k):
                w_ = i * 6.283 / k + q
                a += drehung(q * math.cos(w_), -78 + q * math.sin(w_), math.degrees(w_) + 90, pfad('M0,4C-4,1 -4,-5 0,-8C4,-5 4,1 0,4Z', pap))
        for w_, q in [(.5, 15), (1.9, 25), (3.2, 15), (4.4, 25), (5.6, 16)]:
            a += ell(q * math.cos(w_), -78 + q * math.sin(w_), 3.6, 3.6, '#c9462f')
        return drehung(x, y, 0, a, s)
    z += baum(64, 420, .84) + baum(332, 570, .98)
    # Teich
    z += ell(324, 352, 48, 26, pap) + ell(324, 352, 43, 22, sw) + ''.join(pfad(f'M{292+k*3},{342+k*7}q8,-5 16,0t16,0t16,0', 'none', pap, 2) for k in range(4)) + drehung(332, 346, 0, pfad('M-16,0C-14,10 14,12 18,-2C10,3 4,0 1,-4C-3,-14 3,-21 8,-19L14,-17L8,-14C5,-10 8,-5 11,-4C0,-9 -12,-7 -16,0Z', pap))
    # offene Stelle
    z += rect(34, 446, 98, 76, pap, 3) + rect(39, 451, 88, 66, sw, 2) + ''.join(rect(45, 458 + k * 12, 76, 3, pap, 1.5) for k in range(5)) + drehung(110, 486, 12, pfad('M-1.6,-30L1.6,-30L1.6,2L7,2L5,16L0,20L-5,16L-7,2L-1.6,2Z', '#f0c766') + pfad('M-7,-30L7,-30', 'none', '#f0c766', 4))
    # Stationen
    for i, (x, y) in enumerate([(262, 470), (132, 325), (246, 196)]):
        z += ell(x, y, 33, 28, pap) + ell(x, y, 29, 24.4, sw)
        if i == 0:
            z += f'<g transform="translate({x} {y}) scale(1 .84)">' + ''.join(drehung(0, 0, q * 45, pfad('M0,-4C-7,-9 -6,-20 0,-24C6,-20 7,-9 0,-4Z', '#f0c766' if q % 2 else pap)) for q in range(8)) + ell(0, 0, 4, 4, '#c9462f') + '</g>'
        elif i == 1:
            z += f'<ellipse class="puls" cx="{x}" cy="{y}" rx="24" ry="20" fill="#f0c766"/>' + ell(x, y, 13, 11, sw) + ell(x, y, 6, 5, '#f0c766')
        else:
            z += ell(x, y, 22, 18.4, pap) + ell(x, y, 20, 16.6, sw) + pfad(f'M{x},{y+9}C{x-8},{y+4} {x-7},{y-6} {x},{y-11}C{x+7},{y-6} {x+8},{y+4} {x},{y+9}Z', pap)
    # Vogel als Position, schwarz auf dem hellen Weg
    z += drehung(182, 388, -4, pfad('M-30,12C-18,10 -14,4 -10,-2C-12,-16 -4,-26 8,-32C5,-22 8,-14 14,-9C18,-13 24,-13 27,-8L35,-6L27,-2C26,8 14,16 4,15C-4,20 -16,22 -30,18L-22,15Z', sw) + pfad('M-6,0C0,4 8,2 14,-6M-14,12C-8,12 -2,10 2,6', 'none', pap, 1.6) + ell(22, -7, 1.5, 1.5, pap) + pfad('M4,15l-1,9M10,13l1,9', 'none', sw, 2))
    # Rahmen: schwarzer Rand mit Blattwerk
    z += pfad('M0,0L400,0L400,600L0,600ZM22,24L22,576L378,576L378,24Z', sw, extra=' fill-rule="evenodd"')
    for sg, x in [(1, 22), (-1, 378)]:
        z += blattwerk(x, 150, sg * 24, 96) + blattwerk(x, 92, sg * 46, 80) + blattwerk(x + sg * 26, 24, sg * 152, 70) + blattwerk(x + sg * 70, 24, sg * 168, 54) + blume(x + sg * 36, 96, .9, sw, 6) + blume(x + sg * 16, 46, .7, sw, 5)
    z += drehung(120, 60, -10, pfad('M-12,0C-6,-6 -2,-4 0,0C4,-8 12,-10 16,-6C10,-4 6,2 0,4C-4,6 -10,4 -12,0Z', sw)) + drehung(292, 78, 12, pfad('M12,0C6,-6 2,-4 0,0C-4,-8 -12,-10 -16,-6C-10,-4 -6,2 0,4C4,6 10,4 12,0Z', sw))
    defs = '<filter id="kante" x="-.02" y="-.02" width="1.04" height="1.04"><feTurbulence type="fractalNoise" baseFrequency=".04" numOctaves="2" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2"/></filter>'
    seite('15', 'scherenschnitt', 'Scherenschnitt', g(z, filter='url(#kante)'), css='.puls{animation:p 2.6s ease-in-out infinite}@keyframes p{50%{fill:#fff3c4}}', grund='#d9cbb0', defs=defs)


if __name__ == '__main__':
    marine()
    kacheln()
    fresko()
    scherenschnitt()
