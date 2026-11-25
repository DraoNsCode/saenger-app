"""Varianten 16 bis 20 (Stimmungen auf dem bisherigen Stil) und der Elemente-Bogen."""
import re
from vlib import *
from garten_teile import F, kohl_seite, salat_seite, ringel_seite, lavendel_seite, baum_seite, figur_seite, laterne_seite, spaten_seite, rosette
import garten as G

HIER = os.path.dirname(os.path.abspath(__file__))
BILD = open(os.path.join(HIER, '..', 'bilder', 'ansicht-schraeg.svg'), encoding='utf-8').read()


def faerbe(karte):
    """Farben der Palette austauschen, alles andere bleibt."""
    svg = BILD
    inhalt = svg[svg.index('<defs>'):svg.rindex('</svg>')]
    for a, b in karte.items():
        inhalt = re.sub(re.escape(F[a]), '@@' + b[1:] + '@@', inhalt)
    inhalt = re.sub('@@([0-9a-f]{6})@@', r'#\1', inhalt)
    inhalt = inhalt.replace('inkscape:groupmode="layer" ', '')
    inhalt = re.sub(r' inkscape:label="[^"]*"', '', inhalt)
    inhalt = inhalt.replace('class="g-schild"', 'class="g-schild" display="none"')
    d = inhalt[:inhalt.index('</defs>')].replace('<defs>', '')
    return d, inhalt[inhalt.index('</defs>') + 7:]


FALL = '@keyframes fall{0%{transform:translate(0,-30px) rotate(0)}50%{transform:translate(-34px,300px) rotate(190deg)}100%{transform:translate(8px,660px) rotate(400deg)}}.fall{animation:fall 11s linear infinite}svg.bild{overflow:hidden}.g-halo{animation:p 2.6s ease-in-out infinite}@keyframes p{50%{opacity:.3}}.g-fliesst{animation:fl 7s linear infinite}@keyframes fl{to{stroke-dashoffset:-168}}'


def fallend(r, k, form):
    return ''.join(f'<g transform="translate({r.uniform(0, 420):.0f} 0)"><g class="fall" style="animation-delay:-{r.uniform(0, 12):.1f}s;animation-duration:{r.uniform(8, 15):.1f}s">{form(r)}</g></g>' for _ in range(k))


def fruehling():
    r = random.Random(1)
    d, z = faerbe(dict(wiese='#b7d084', wiese_d='#97ba69', wiese_h='#cfe09a', laub='#86b85a', laub_d='#4f8040', laub_h='#a9d078', laub_hh='#c9e69a', krone='#e9a9bb', krone_d='#a85f78', krone_h='#f5cbd6', krone_hh='#fdeaf0', apfel='#ffffff', apfel_d='#e3b9c6', aussen='#cfd79a', lav='#f2cf5a', lav_d='#b98f1f'))
    bl = ''.join(f'<ellipse cx="{r.gauss(70, 34):.0f}" cy="{r.gauss(262, 10):.0f}" rx="2.6" ry="1.6" fill="#fbe3ea"/>' for _ in range(40)) + ''.join(f'<ellipse cx="{r.gauss(280, 30):.0f}" cy="{r.gauss(180, 8):.0f}" rx="2.4" ry="1.5" fill="#fbe3ea"/>' for _ in range(30))
    tulpen = ''
    for x, y in [(176, 70), (190, 84), (60, 60), (40, 76), (300, 270), (288, 288), (312, 292), (30, 440), (54, 452)]:
        c = r.choice(['#e0556a', '#f2b73f', '#f7f0e4', '#b061b8'])
        tulpen += drehung(x, y, 0, pfad('M0,0L0,-14', 'none', '#5b8a3f', 2) + pfad('M0,-2C-6,-5 -7,-10 -6,-13C-3,-9 -1,-6 0,-2C1,-6 3,-9 6,-12C7,-9 5,-5 0,-2Z', '#7faf57', '#4f7a38', .8) + pfad('M-5,-21L-2.4,-18L0,-22L2.4,-18L5,-21C6,-15 4,-12 0,-12C-4,-12 -6,-15 -5,-21Z', c, misch(c, '#3a1020', .4), .9))
    z += bl + tulpen + fallend(r, 22, lambda r: f'<ellipse rx="3.4" ry="2" fill="{r.choice(["#fbe3ea", "#f5cbd6", "#ffffff"])}"/>') + '<rect width="400" height="600" fill="#fff3c9" opacity=".12"/>'
    seite('16', 'fruehling', 'Frühling, bisheriger Stil', z, css=FALL, defs=d, grund='#8fae6a')


def herbst():
    r = random.Random(2)
    d, z = faerbe(dict(wiese='#b9ad6b', wiese_d='#988a4c', wiese_h='#cbbd7d', laub='#9c8f3f', laub_d='#63581f', laub_h='#bcae58', laub_hh='#d8cb7c', krone='#d07c34', krone_d='#82411f', krone_h='#e6a548', krone_hh='#f3cf73', kohl='#e58a34', kohl_d='#a9581a', kohl_h='#f3b264', salat='#c9a24a', salat_d='#85662a', salat_h='#e2c97c', aussen='#c9b274', lav='#9a5d74', lav_d='#5f3247', ufer='#8a7a48', wasser='#7fa4ae', weg='#e2cba2'))
    laub = ''.join(drehung(r.uniform(0, 400), r.uniform(60, 530), r.uniform(0, 360), pfad('M0,-5C3,-3 3,2 0,5C-3,2 -3,-3 0,-5Z', r.choice(['#d07c34', '#b5482a', '#e6a548', '#8a4a22']), extra=' fill-opacity=".9"')) for _ in range(120))
    z += laub + fallend(r, 20, lambda r: pfad('M0,-6C4,-4 4,2 0,6C-4,2 -4,-4 0,-6Z', r.choice(['#d07c34', '#c2552c', '#e6a548']), '#6b3517', .6)) + '<rect width="400" height="600" fill="#f0a94e" opacity=".14" style="mix-blend-mode:soft-light"/>'
    seite('17', 'herbst', 'Herbst, bisheriger Stil', z, css=FALL, defs=d, grund='#7a6a3a')


def winter():
    r = random.Random(3)
    d, z = faerbe(dict(wiese='#e8eef3', wiese_d='#cbd8e2', wiese_h='#f7fafc', aussen='#dfe7ee', aussen_d='#c3d0db', laub='#8fa7a6', laub_d='#54706f', laub_h='#c9d8dc', laub_hh='#f1f6f8', krone='#8fa7a6', krone_d='#54706f', krone_h='#dfe8ec', krone_hh='#fbfdff', weg='#dcdcdc', weg_d='#b7bcc2', weg_h='#f1f2f3', kies='#c3c7cc', dach='#e6edf2', dach_h='#f6f9fb', dach_s='#b9c8d3', dach_d='#7f95a4', stein_h='#f4f7f9', wasser='#b9d3df', wasser_d='#86a9bb', wasser_h='#f2f8fb', ufer='#c3cfd6', lav='#c3cfe0', lav_d='#8796ad', erde='#8a8580', erde_h='#e3e8eb', erde_d='#6f6a66', apfel='#c8483a'))
    schnee = ''.join(pfad(wolke(x, y, w, h, 7, r, .08, 1), '#fbfdff', extra=' fill-opacity=".95"') for x, y, w, h in [(70, 160, 30, 9), (40, 184, 14, 6), (276, 100, 26, 8), (81, 300, 60, 4), (200, 397, 52, 5)])
    spuren = ''.join(drehung(x, y, 0, ell(-5 if i % 2 else 5, 0, 3, 4.6, '#b3bec8')) for i, (x, y) in enumerate([(222, 470), (236, 452), (250, 436), (258, 418)]))
    z += schnee + spuren + fallend(r, 60, lambda r: f'<circle r="{r.uniform(1.2, 3):.1f}" fill="#fff" fill-opacity="{r.uniform(.6, 1):.2f}"/>') + '<rect width="400" height="600" fill="#9fb9dc" opacity=".16"/>'
    seite('18', 'winter', 'Winter, bisheriger Stil', z, css=FALL, defs=d, grund='#9fb0c0')


def abend():
    r = random.Random(4)
    d, z = faerbe(dict(wiese='#8f9a5e', wiese_d='#6f7d4c', wiese_h='#b8ac62', laub='#5f7f4a', laub_d='#2f4a35', laub_h='#a99a4e', laub_hh='#e6bf62', krone='#5f7f4a', krone_d='#2f4a35', krone_h='#a99a4e', krone_hh='#e6bf62', weg='#e8b986', weg_d='#b98457', weg_h='#f8d5a2', wasser='#c98f86', wasser_d='#7d6a86', wasser_h='#ffd9a3', stein='#cda98c', stein_s='#b08e7c', stein_h='#e8c6a0', aussen='#a99a5c'))
    d += '<linearGradient id="ab" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffb45a" stop-opacity=".62"/><stop offset=".45" stop-color="#ff8f5a" stop-opacity=".2"/><stop offset="1" stop-color="#2a2358" stop-opacity=".62"/></linearGradient><radialGradient id="so"><stop offset="0" stop-color="#fff0b8" stop-opacity=".9"/><stop offset="1" stop-color="#ffb45a" stop-opacity="0"/></radialGradient><filter id="wb"><feGaussianBlur stdDeviation="10"/></filter>'
    lang = g(''.join(poly(ps, '#2a2358') for ps in [[(96, 262), (76, 250), (330, 372), (360, 400)], [(300, 180), (282, 170), (420, 232), (420, 252)], [(250, 450), (262, 440), (400, 500), (400, 536)], [(236, 396), (228, 390), (330, 440), (344, 452)]]), opacity='.3', filter='url(#wb)', style='mix-blend-mode:multiply')
    strahl = ''.join(poly([(-30, -40 + k * 40), (-30, -10 + k * 40), (460, 330 + k * 120), (460, 250 + k * 120)], '#ffdf9a', extra=' fill-opacity=".16" class="str"') for k in range(5))
    glueh = ''.join(f'<circle class="g-halo" style="animation-delay:-{r.uniform(0, 3):.1f}s" cx="{r.uniform(20, 380):.0f}" cy="{r.uniform(80, 520):.0f}" r="{r.uniform(1, 2.2):.1f}" fill="#ffe9a8"/>' for _ in range(34))
    z += lang + '<rect width="400" height="600" fill="url(#ab)" style="mix-blend-mode:soft-light"/><rect width="400" height="600" fill="url(#ab)" opacity=".5"/><circle cx="10" cy="20" r="190" fill="url(#so)" style="mix-blend-mode:screen"/>' + g(strahl, filter='url(#wb)', style='mix-blend-mode:screen') + glueh
    seite('19', 'abend', 'Abendlicht, bisheriger Stil', z, css=FALL + '.str{animation:s 8s ease-in-out infinite alternate}@keyframes s{from{opacity:.4}to{opacity:1}}', defs=d, grund='#3a2f4a')


def regen():
    r = random.Random(5)
    d, z = faerbe(dict(wiese='#86a86f', wiese_d='#648a58', wiese_h='#9cba80', weg='#c9b694', weg_d='#9c8a6c', weg_h='#dccbaa', stein='#b3ada3', stein_s='#979187', stein_h='#c9c4ba', dach='#a3583c', dach_h='#b56c4c', wasser='#6f9fb0', aussen='#a3a77a', laub='#5f8f50', laub_h='#7fa963', laub_hh='#9cc07b', krone='#5f8f50', krone_h='#7fa963', krone_hh='#9cc07b'))
    d += '<radialGradient id="pf"><stop offset="0" stop-color="#dfe9ee" stop-opacity=".95"/><stop offset="1" stop-color="#8fa9b5" stop-opacity=".85"/></radialGradient>'
    pf = ''.join(pfad(fleck(x, y, a, b_, r, 8, .12), 'url(#pf)', '#7f8f8f', .8) for x, y, a, b_ in [(150, 236, 15, 6), (246, 372, 17, 7), (200, 570, 18, 6), (170, 130, 13, 5)])
    ringe = ''.join(f'<ellipse class="ring" style="animation-delay:-{r.uniform(0, 1.6):.2f}s" cx="{x}" cy="{y}" rx="9" ry="4" fill="none" stroke="#fff" stroke-width="1.1"/>' for x, y in [(148, 236), (250, 372), (200, 570), (172, 130), (345, 120), (352, 250), (338, 380), (348, 560)])
    tropfen = ''.join(f'<path class="tr" style="animation-delay:-{r.uniform(0, 1):.2f}s;animation-duration:{r.uniform(.6, 1):.2f}s" d="M{r.uniform(-20, 420):.0f},-30l-4,20" stroke="#eaf3f8" stroke-width="1.3" stroke-opacity="{r.uniform(.35, .8):.2f}" fill="none"/>' for _ in range(110))
    schirm = drehung(FG[0], FG[1] - 62, 0, pfad('M-31,6C-29,-16 -12,-23 0,-23C12,-23 29,-16 31,6C26,1 20,1 15.5,6C11,1 4,1 0,6C-4,1 -11,1 -15.5,6C-20,1 -26,1 -31,6Z', '#b03a35', '#7a1f1d', 1.4) + pfad('M0,-23C-5,-12 -5,-4 0,6M0,-23L0,-28', 'none', '#7a1f1d', 1.2) + pfad('M0,6L0,30', 'none', '#4a2c1c', 2.4))
    z = z.replace('</svg>', '') + '<rect width="400" height="600" fill="#5f7f9c" opacity=".2"/>' + pf + ringe + schirm + tropfen
    seite('20', 'regen', 'Regen, bisheriger Stil', z, css=FALL + '.tr{animation:tr .8s linear infinite}@keyframes tr{to{transform:translate(-120px,680px)}}.ring{animation:ri 1.6s ease-out infinite;transform-box:fill-box;transform-origin:center}@keyframes ri{from{transform:scale(.2);opacity:1}to{transform:scale(1.5);opacity:0}}', defs=d, grund='#5f7468')


def _fig():
    m = re.search(r'class="g-position".*?<use href="#s-figur" transform="translate\(([\d.]+) ([\d.]+)\)', BILD, re.S)
    return float(m.group(1)), float(m.group(2))


FG = _fig()


# ---------- Elemente-Bogen ----------

def elemente():
    r = random.Random(8)
    w = '#a9bf79'
    L = lambda d, b=1.4, c=F['holz_d']: pfad(d, 'none', c, b)
    boden = lambda weg=True: rect(0, 0, 150, 150, w) + (pfad('M-10,132C40,120 60,92 75,92C92,92 110,66 160,60', 'none', F['weg_d'], 40) + pfad('M-10,132C40,120 60,92 75,92C92,92 110,66 160,60', 'none', F['weg'], 35) if weg else '') + ''.join(drehung(x, y, 0, pfad('M-5,0C-4,-3 -5,-6 -6,-8M0,0C0,-4 0,-7 1,-10M5,0C4,-3 6,-5 7,-7', 'none', F['wiese_d'], 1.4), .8) for x, y in [(20, 40), (128, 120), (112, 136), (40, 66), (30, 24), (130, 30)])
    platte = lambda farbe=F['stein_h']: ell(75, 98, 31, 21, F['stein_d'], F['fuge'], 1) + ell(75, 92, 31, 21, F['stein'], F['stein_d'], 1.2) + ell(75, 92, 22, 14.6, farbe, F['stein_d'], 1)
    ring = ell(75, 92, 26, 17.6, 'none', F['gold_d'], 7.4) + ell(75, 92, 26, 17.6, 'none', F['gold'], 5.2)
    an = lambda i, s=1, x=75, y=92: drehung(x, y, 0, i, s)
    glocke = L('M-26,14L-26,-40M26,14L26,-40M-32,-40L32,-40', 6) + L('M-26,14L-26,-40M26,14L26,-40M-32,-40L32,-40', 3.4, F['holz_h']) + pfad('M-15,-4C-13,-10 -12,-28 -6,-32C-3,-34 3,-34 6,-32C12,-28 13,-10 15,-4Z', F['gold'], F['gold_d'], 1.5) + pfad('M-8,-10C-7,-18 -6,-26 -3,-29', 'none', F['gold_h'], 2.6) + ell(0, -2, 4, 4, F['gold_d']) + L('M0,-40L0,-33', 2.4)
    bank = pfad('M-34,-6L34,-6L36,2L-36,2Z', F['holz_h'], F['holz_d'], 1.4) + pfad('M-34,-26L34,-26L34,-18L-34,-18ZM-34,-15L34,-15L34,-8L-34,-8Z', F['holz'], F['holz_d'], 1.3) + L('M-30,2L-30,14M30,2L30,14M-30,-28L-30,0M30,-28L30,0', 4)
    sonnenuhr = pfad('M-14,12L-9,-22L9,-22L14,12Z', F['stein'], F['stein_d'], 1.4) + rect(-19, 12, 38, 6, F['stein_h'], 1, F['stein_d'], 1.2) + ell(0, -25, 21, 8, F['stein_h'], F['stein_d'], 1.4) + pfad('M-9,-24L9,-42L7,-24Z', F['gold'], F['gold_d'], 1.2) + ''.join(L(f'M{13*math.cos(k*.52):.1f},{-25+5*math.sin(k*.52):.1f}L{17*math.cos(k*.52):.1f},{-25+6.5*math.sin(k*.52):.1f}', 1, F['fuge']) for k in range(7))
    bildstock = rect(-9, -20, 18, 36, F['stein'], 0, F['stein_d'], 1.4) + rect(-15, 14, 30, 7, F['stein_h'], 1, F['stein_d'], 1.2) + rect(-15, -50, 30, 32, F['stein_h'], 0, F['stein_d'], 1.4) + pfad('M-9,-22L-9,-36A9,9 0 0 1 9,-36L9,-22Z', '#2c4272', F['stein_d'], 1) + pfad('M0,-44L0,-26M-6,-37L6,-37', 'none', F['gold_h'], 2.4) + pfad('M-20,-50L0,-66L20,-50Z', F['dach'], F['dach_d'], 1.4)
    rondell = ell(0, 4, 32, 20, F['stein_d']) + ell(0, 0, 32, 20, F['stein_h'], F['stein_d'], 1.3) + ell(0, 0, 26, 15.6, F['erde'], F['erde_d'], 1) + ''.join(drehung(19 * math.cos(k * .785), 10 * math.sin(k * .785) + 2, 0, ringel_seite(), .72) for k in sorted(range(8), key=lambda k: math.sin(k * .785))) + drehung(0, 4, 0, lavendel_seite(), .7)
    note = ell(0, 6, 31, 21, F['stein_d']) + ell(0, 0, 31, 21, F['stein'], F['stein_d'], 1.2) + ''.join(L(f'M{-22+abs(k)*3},{k*5.4}L{22-abs(k)*3},{k*5.4}', 1.2, F['fuge']) for k in range(-2, 3)) + drehung(0, 0, -20, ell(0, 0, 9.4, 6.4, F['gold'], F['gold_d'], 1.4))
    quelle = ell(0, 5, 30, 19, F['stein_d']) + ell(0, 0, 30, 19, F['stein_h'], F['stein_d'], 1.3) + ell(0, 0, 23, 13.6, F['wasser'], F['wasser_d'], 1.2) + L('M-10,-2q5,-3 10,0t10,0M-13,4q5,-3 10,0t10,0', 1.6, F['wasser_h']) + L('M0,-2Q-12,-30 -15,-4M0,-2Q12,-30 15,-4M0,-2L0,-24', 1.8, F['wasser_h'])
    A = [('Steinplatte (bisher)', boden() + platte() + ring + ell(75, 92, 7, 5, F['gold'], F['gold_d'], 1)), ('Notenstein', boden() + an(note)), ('Blumenrondell', boden() + an(rondell)), ('Bank', boden() + an(ell(2, 14, 40, 8, F['schatten'], extra=' fill-opacity=".2"') + bank, .95)), ('Sonnenuhr', boden() + an(ell(4, 17, 26, 7, F['schatten'], extra=' fill-opacity=".22"') + sonnenuhr)), ('Glocke', boden() + an(ell(3, 15, 34, 7, F['schatten'], extra=' fill-opacity=".22"') + glocke)), ('Bildstock', boden() + an(ell(4, 20, 22, 6, F['schatten'], extra=' fill-opacity=".22"') + bildstock)), ('Quelle', boden() + an(quelle))]
    vogel = drehung(75, 92, 0, G.vogel(), 1.7)
    spur = ''.join(drehung(34 + i * 13 + (0), 118 - i * 8.4 + (4 if i % 2 else -4), 58, ell(0, 0, 3.2, 5, F['fuge'], extra=f' fill-opacity="{.25+i*.1:.2f}"')) for i in range(7))
    licht = '<radialGradient id="lp"><stop offset="0" stop-color="#fffbe0"/><stop offset=".35" stop-color="#ffe08a" stop-opacity=".8"/><stop offset="1" stop-color="#ffd25a" stop-opacity="0"/></radialGradient>'
    B = [('Figur (bisher)', boden() + drehung(75, 108, 0, ell(3, 1, 17, 5, F['schatten'], extra=' fill-opacity=".28"') + figur_seite(), 1.3)), ('Laterne', boden() + drehung(70, 108, 0, laterne_seite().replace('url(#schein)', 'url(#lp)'), 1.7)), ('Vogel', boden() + vogel), ('Schmetterling', boden() + drehung(75, 84, -12, G.schmetterling('#f5d35f', '#a9821c'), 1.9)), ('Fußspuren', boden() + spur), ('Lichtpunkt', boden() + '<circle cx="75" cy="90" r="34" fill="url(#lp)" class="pu"/>' + ell(75, 90, 5, 5, '#fffdf0'))]
    baum = drehung(106, 60, 0, baum_seite(random.Random(21), True), .62)
    szene = boden() + baum + platte()
    umriss = rect(0, 0, 150, 150, '#f6eedb') + L('M-10,113C40,101 56,74 75,74C92,74 110,48 160,42M-10,151C44,139 66,112 80,111C96,110 120,84 160,80', 1.4, '#6b5a48') + L('M44,92a31,21 0 1 0 62,0a31,21 0 1 0 -62,0', 1.3, '#6b5a48') + pfad(wolke(106, 22, 26, 24, 12, random.Random(3), .06), 'none', '#6b5a48', 1.3) + L('M102,60L100,42M110,60L111,42', 1.3, '#6b5a48')
    hecke = ''.join(pfad(wolke(x, y, 24, 20, 10, random.Random(int(x + y)), .08), c, F['laub_d'], 1.2) for x, y, c in [(12, 70, F['laub']), (48, 62, F['laub_h']), (86, 66, F['laub']), (124, 60, F['laub_h']), (152, 72, F['laub']), (28, 96, F['laub']), (68, 98, F['laub_h']), (106, 96, F['laub']), (142, 102, F['laub_h']), (8, 120, F['laub_h']), (48, 128, F['laub']), (90, 130, F['laub_h']), (130, 132, F['laub'])])
    defs = licht + '<radialGradient id="nb"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>'
    nebel = szene + rect(0, 0, 150, 150, '#eef2f1', extra=' fill-opacity=".62"') + ''.join(ell(x, y, 70, 18, 'url(#nb)') for x, y in [(30, 40), (110, 70), (50, 110), (120, 130)])
    nacht = szene + rect(0, 0, 150, 150, '#0d1c3c', extra=' fill-opacity=".74"') + ''.join(ell(x, y, 1, 1, '#dfe9ff') for x, y in [(20, 20), (60, 34), (130, 100), (36, 80), (100, 130)])
    schnee = f'<g style="filter:saturate(.2) brightness(1.28) contrast(.8)">{szene}</g>' + rect(0, 0, 150, 150, '#eef4f8', extra=' fill-opacity=".5"') + ''.join(ell(r.uniform(0, 150), r.uniform(0, 150), 1.8, 1.8, '#fff') for _ in range(40))
    grau = f'<g style="filter:grayscale(1) contrast(.75) brightness(1.15)">{szene}</g>'
    C = [('Nebel (bisher)', nebel), ('Skizze ohne Farbe', umriss), ('Nacht', nacht), ('Schnee', schnee), ('zugewachsen', boden(False) + hecke), ('ohne Farbe, grau', grau)]
    laube = L('M-34,16L-34,-34M34,16L34,-34M-34,-34C-30,-62 30,-62 34,-34', 5) + L('M-34,16L-34,-34M34,16L34,-34M-34,-34C-30,-62 30,-62 34,-34', 2.6, F['holz_h']) + ''.join(L(f'M{-34+k*11.3:.0f},-34l0,{-14-8*math.sin(k*.52):.0f}', 1.6) for k in range(7))
    sockel = rect(-18, 2, 36, 14, F['stein'], 1, F['stein_d'], 1.3) + rect(-13, -22, 26, 24, F['stein_h'], 0, F['stein_d'], 1.3) + rect(-17, -28, 34, 7, F['stein'], 1, F['stein_d'], 1.2)
    korb = pfad('M-20,0C-22,-22 -11,-36 0,-36C11,-36 22,-22 20,0Z', '#d8a648', '#8a6420', 1.4) + ''.join(L(f'M{-20+k*k*.9:.1f},{-6-k*7}Q0,{-1-k*7} {20-k*k*.9:.1f},{-6-k*7}', 1.1, '#8a6420') for k in range(4)) + ell(0, -4, 5, 5, '#4a2f1a') + rect(-28, 0, 56, 6, F['holz'], 1, F['holz_d'], 1.2) + L('M-22,6L-22,16M22,6L22,16', 3)
    mini = '<g transform="translate(26 52) scale(.78)">' + G.beet_kasten() + '</g>' + drehung(104, 112, 0, spaten_seite(), 1.1)
    trell = L('M-30,16L-30,-40M0,16L0,-44M30,16L30,-40M-34,-6L34,-6M-34,-28L34,-28', 4) + L('M-30,16L-30,-40M0,16L0,-44M30,16L30,-40M-34,-6L34,-6M-34,-28L34,-28', 2, F['holz_h']) + drehung(-30, 16, 0, pfad('M0,0C-6,-8 4,-14 -2,-22', 'none', F['laub'], 2) + ell(-3, -14, 4, 3, F['laub_h'], F['laub_d'], .8), 1)
    teich = ell(0, 2, 46, 26, F['ufer']) + ell(0, 0, 41, 22, F['erde'], F['erde_d'], 1.2) + ell(2, 5, 24, 9, F['wasser'], F['wasser_d'], 1) + ''.join(ell(44 * math.cos(k * .6), 24 * math.sin(k * .6), 6, 4, F['stein'], F['stein_d'], 1) for k in range(8))
    D = [('Beet (bisher)', boden(False) + mini), ('Laube', boden(False) + an(laube, 1.1, 75, 96)), ('Sockel', boden(False) + an(sockel, 1.3, 75, 92)), ('Bienenkorb', boden(False) + an(korb, 1.2, 75, 92)), ('Spalier', boden(False) + an(trell, 1.15, 75, 96)), ('Teich', boden(False) + an(teich, 1.1, 75, 84))]
    unkraut = ''.join(drehung(x, y, w_, pfad('M0,0C-7,-6 -8,-14 -6,-18C-2,-13 0,-7 0,0C0,-8 2,-16 6,-22C8,-15 6,-6 0,0Z', '#7f9a4a', '#50692c', 1)) for x, y, w_ in [(64, 100, -8), (84, 108, 10), (100, 90, 4), (52, 116, -14), (78, 88, 0)])
    laubhaufen = ''.join(drehung(75 + r.gauss(0, 18), 94 + r.gauss(0, 8), r.uniform(0, 360), pfad('M0,-7C4,-4 4,3 0,7C-4,3 -4,-4 0,-7Z', r.choice(['#d07c34', '#b5482a', '#e6a548', '#9c6a2c']), '#6b3517', .7)) for _ in range(46)) + L('M112,118L88,52', 4, F['holz_d']) + L('M112,118L88,52', 2, F['holz_h']) + ''.join(L(f'M88,52l{-16+k*5},{-12+abs(k-2)*2}', 1.8, F['holz_d']) for k in range(5))
    ruf = drehung(80, 92, 0, G.vogel(), 1.5) + ''.join(drehung(104 + k * 11, 62 - k * 9, 0, ell(0, 0, 4.2, 3.2, F['tinte']) + L('M4,0L4,-13', 1.6, F['tinte'])) for k in range(2))
    E = [('Gießkanne (bisher)', boden() + drehung(78, 104, 0, G.giesskanne(), 1.6)), ('rufender Vogel', boden() + ruf), ('Laub harken', boden() + laubhaufen), ('Unkraut', boden() + unkraut)]
    def reihe(titel, liste):
        felder = ''.join(f'<figure><svg viewBox="0 0 150 150" role="img" aria-label="{t}"><g clip-path="url(#rund)">{s}</g></svg><figcaption>{t}</figcaption></figure>' for t, s in liste)
        return f'<section><h3>{titel}</h3><div class="felder">{felder}</div></section>'
    html = f'<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>{defs}<clipPath id="rund"><rect width="150" height="150" rx="14"/></clipPath></defs></svg>'
    html += reihe('Station', A) + reihe('Eigene Position', B) + reihe('Noch nicht erreicht', C) + reihe('Offene Stelle (noch leer)', D) + reihe('Pflege', E)
    html = html.replace('<use href="#vogel"/>', '').replace('<use href="#gras"', '<use href="#x"')
    open(os.path.join(ZIEL, 'elemente.html'), 'w', encoding='utf-8', newline='\n').write(html)
    print('elemente', len(html.encode()) // 1024, 'KB')


if __name__ == '__main__':
    fruehling()
    herbst()
    winter()
    abend()
    regen()
    elemente()
