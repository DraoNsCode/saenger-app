# Werkstatt für Gartenteile: liefert das Repository aus und nimmt freigestellte Teile entgegen.
# Nur Python-Standardbibliothek, nichts zu installieren.
#
#   python garten/werkstatt/server.py [port]        (aus dem Repository-Ordner, Port Vorgabe 8010)
#   dann http://127.0.0.1:8010/garten/werkstatt/werkstatt.html öffnen
#
# POST /teil  mit JSON { "name": "lavendel-3", "daten": "<WebP als Base64>", "meta": { … } }
#   legt garten/teile/<name>.webp ab und trägt meta in garten/teile/teile.json ein.
# Hört nur auf 127.0.0.1. Namen dürfen nur a–z, 0–9 und Bindestriche enthalten.
import base64
import functools
import http.server
import json
import os
import re
import sys

WURZEL = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
TEILE = os.path.join(WURZEL, 'garten', 'teile')
LISTE = os.path.join(TEILE, 'teile.json')
NAME = re.compile(r'^[a-z0-9]+(-[a-z0-9]+)*$')


def lies_liste():
    try:
        with open(LISTE, encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}


def schreibe_liste(liste):
    os.makedirs(TEILE, exist_ok=True)
    tmp = LISTE + '.neu'
    # ein Teil je Zeile: knapp und gut zu vergleichen
    zeilen = [f' {json.dumps(k, ensure_ascii=False)}: {json.dumps(v, ensure_ascii=False)}' for k, v in sorted(liste.items())]
    with open(tmp, 'w', encoding='utf-8', newline='\n') as f:
        f.write('{\n' + ',\n'.join(zeilen) + '\n}\n')
    os.replace(tmp, LISTE)


class Werkstatt(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def antworte(self, code, text):
        roh = text.encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', 'text/plain; charset=utf-8')
        self.send_header('Content-Length', str(len(roh)))
        self.end_headers()
        self.wfile.write(roh)

    def do_POST(self):
        if self.path == '/buehne':
            return self.buehne()
        if self.path != '/teil':
            return self.antworte(404, 'unbekannt')
        laenge = int(self.headers.get('Content-Length') or 0)
        if laenge <= 0 or laenge > 20_000_000:
            return self.antworte(400, 'Größe passt nicht')
        try:
            auftrag = json.loads(self.rfile.read(laenge))
            name = auftrag['name']
            daten = base64.b64decode(auftrag['daten'], validate=True)
            meta = auftrag.get('meta') or {}
        except (ValueError, KeyError, TypeError):
            return self.antworte(400, 'Auftrag nicht lesbar')
        if not isinstance(name, str) or not NAME.match(name) or len(name) > 60:
            return self.antworte(400, 'Name nicht erlaubt')
        if daten[:4] != b'RIFF' or daten[8:12] != b'WEBP':
            return self.antworte(400, 'kein WebP')
        if not isinstance(meta, dict):
            return self.antworte(400, 'meta muss ein Objekt sein')
        os.makedirs(TEILE, exist_ok=True)
        with open(os.path.join(TEILE, name + '.webp'), 'wb') as f:
            f.write(daten)
        liste = lies_liste()
        liste[name] = {**meta, 'datei': name + '.webp'}
        schreibe_liste(liste)
        print(f'gespeichert: {name}.webp ({len(daten)} Bytes)', flush=True)
        return self.antworte(200, 'ok')


BUEHNE = re.compile(r'^[a-z0-9-]+/[a-z0-9-]+\.webp$')


def buehne_speichern(handler):
    # POST /buehne mit JSON { "pfad": "<bereich>/<name>.webp", "daten": "<WebP als Base64>" } → garten/buehne/<pfad>
    laenge = int(handler.headers.get('Content-Length') or 0)
    if laenge <= 0 or laenge > 30_000_000:
        return handler.antworte(400, 'Größe passt nicht')
    try:
        auftrag = json.loads(handler.rfile.read(laenge))
        pfad = auftrag['pfad']
        daten = base64.b64decode(auftrag['daten'], validate=True)
    except (ValueError, KeyError, TypeError):
        return handler.antworte(400, 'Auftrag nicht lesbar')
    if not isinstance(pfad, str) or not BUEHNE.match(pfad):
        return handler.antworte(400, 'Pfad nicht erlaubt')
    if daten[:4] != b'RIFF' or daten[8:12] != b'WEBP':
        return handler.antworte(400, 'kein WebP')
    ziel = os.path.join(WURZEL, 'garten', 'buehne', *pfad.split('/'))
    os.makedirs(os.path.dirname(ziel), exist_ok=True)
    with open(ziel, 'wb') as f:
        f.write(daten)
    print(f'gespeichert: garten/buehne/{pfad} ({len(daten)} Bytes)', flush=True)
    return handler.antworte(200, 'ok')


Werkstatt.buehne = buehne_speichern


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8010
    handler = functools.partial(Werkstatt, directory=WURZEL)
    with http.server.ThreadingHTTPServer(('127.0.0.1', port), handler) as s:
        print(f'Werkstatt: http://127.0.0.1:{port}/garten/werkstatt/werkstatt.html', flush=True)
        s.serve_forever()


if __name__ == '__main__':
    main()
