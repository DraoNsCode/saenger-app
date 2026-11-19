# Choristen-App

Eine Lern-App für die Sängerinnen und Sänger des Gemeindechors: Noten lesen, Rhythmus und Gehör spielerisch üben. Ein Leitfaden führt durch die Themen, jedes Thema lässt sich auch gezielt üben, und es gibt Abzeichen.

- [ENTSCHEIDUNGEN.md](ENTSCHEIDUNGEN.md): was Daniel festgelegt hat, mit Datum. Diese Datei gilt.
- [LERNWEG.md](LERNWEG.md): Vorschlag für Lernweg, Stationen und Abzeichen
- [WEG.md](WEG.md): Vorschlag für den Weg als Klostergarten
- [FAHRPLAN.md](FAHRPLAN.md): Vorschlag für Bausteine und Reihenfolge der Entwicklung
- [CLAUDE.md](CLAUDE.md): Hinweise für Arbeitssitzungen

## Stand

Der Stand steht nur hier. CLAUDE.md verweist darauf.

Umgesetzt (19.11.2026):

- Startseite mit Stimmwahl, Leitfaden, Themen, Abzeichen, Übe-Teil (noch leer) und Einstellungen
- Etappen 1 (Das Notenbild) und 2 (Schlag und Takt) mit elf Übungsarten in je drei Schwierigkeiten
- Fortschritt im Browser des Geräts
- Prüfung: Tests und Klick-Test in `pruefung/` (siehe unten)

Abgelöst, nicht weiterentwickeln:

- Der Leitfaden als Notenzeile in `js/views/weg.js`

Vorläufig:

- Die Gestaltung in `css/app.css`. Die Optik wird erst nach der Geschichte des Weges gesucht.

Entschieden, aber noch nicht umgesetzt:

- Der Leitfaden wird zum Klostergarten mit der Kapelle als Ziel.
- Stationen werden in nötige und freiwillige aufgeteilt, dazu Spätblüher.

Nächster Schritt laut Gespräch vom 19.11.2026: für die vorhandenen Übungen festhalten, welche Stufen sinnvoll sind, welche Station nötig ist und welche freiwillig, und das Daniel zur Prüfung vorlegen.

## Technik

- Reine statische Web-App: HTML, CSS und JavaScript-Module, ohne Build-Schritt.
- Notenbild mit [abcjs](https://github.com/paulrosen/abcjs) (MIT-Lizenz, liegt in `vendor/`).
- Klang wird im Browser erzeugt (Web Audio), ohne Klangdateien.
- Schriften liegen im Repository: Atkinson Hyperlegible, EB Garamond und die Ziffern aus Figtree (alle SIL Open Font License, siehe `fonts/`). Es werden keine Daten an fremde Server geschickt.
- Adressen mit `#/…`, damit GitHub Pages ohne Server-Regeln reicht.
- `package.json` und `pruefung/` dienen nur der Prüfung während der Entwicklung. Die App selbst braucht weder npm noch einen Build-Schritt.

## Aufbau

| Pfad | Inhalt |
| --- | --- |
| `index.html` | Gerüst der Seite |
| `css/app.css` | Gestaltung |
| `js/app.js` | Einstieg und Navigation |
| `js/lernweg.js` | Themen, Etappen und Stationen |
| `js/uebungen/` | eine Datei je Übungsart, `index.js` meldet sie an |
| `js/runde.js` | Ablauf einer Runde, Rückmeldung, Ergebnis |
| `js/abzeichen.js` | Abzeichen und ihre Bedingungen |
| `js/speicher.js` | Fortschritt im Browser |
| `js/klang.js`, `js/noten.js`, `js/musik.js` | Klang, Notenbild, Tonhöhen |
| `js/views/` | die Ansichten (Weg, Themen, Abzeichen, Üben, Einstellungen) |
| `pruefung/` | Tests und Klick-Test |

### Eine neue Übungsart

Eine Datei in `js/uebungen/` anlegen und in `js/uebungen/index.js` eintragen. Eine Übung hat `id`, `titel`, `themaId`, `aufgaben`, `stufen`, `erklaerung` und eine Funktion `neu(stufe, { stimme })`, die eine Aufgabe zurückgibt: entweder eine Auswahl (`frage`, `bild`, `optionen`, `loesung`, `warum`) oder eine eigene Ansicht über `eigene(el, fertig)`. Danach die Station in `js/lernweg.js` eintragen. Die Tests prüfen jede eingetragene Übungsart automatisch mit.

## Lokal ansehen

```sh
python3 -m http.server 8000
```

Dann `http://localhost:8000` öffnen. Wegen der JavaScript-Module funktioniert das Öffnen der Datei direkt im Browser nicht.

## Prüfen

Braucht Node.js (ab Version 20).

```sh
npm test            # Übungen, Lernweg und Speichern prüfen, ohne Browser, ohne Installation
npm install         # einmal, für den Klick-Test
npm run klicktest   # App im Browser durchklicken, Screenshots und Fehler
```

- **`npm test`** erzeugt für jede Übung, Stufe und Stimme viele Zufallsaufgaben und prüft, ob die richtige Lösung unter den Antworten steht, ob keine Antwort doppelt ist und ob jede Stimme ihren Schlüssel bekommt. Außerdem prüft er die Stationen im Lernweg und die Grenze von 6 aus 8.
- **`npm run klicktest`** öffnet die App in Chrome, Chromium oder Edge ohne Fenster, in Handy-Größe mit Sopran und in PC-Größe mit Tenor. Er besucht alle Ansichten, spielt Runden durch und legt Screenshots und `bericht.txt` in `pruefung/ausgabe/` ab. Probleme sind Fehler in der Konsole, fehlende Dateien, hängende Abläufe und Seiten, die breiter sind als der Bildschirm. Dauer etwa vier Minuten. Ein anderer Browser lässt sich mit der Umgebungsvariable `CHROME_PATH` angeben.
- Nicht geprüft werden Klang, musikalischer Inhalt und wie sich das Üben anfühlt.

## Veröffentlichen

Auf GitHub unter **Settings → Pages** als Quelle „Deploy from a branch“ wählen, Branch `main`, Ordner `/ (root)`. Die App ist danach unter `https://<benutzer>.github.io/<repository>/` erreichbar.
