# Choristen-App

Eine Lern-App für die Sängerinnen und Sänger des Gemeindechors: Noten lesen, Rhythmus und Gehör spielerisch üben. Ein Leitfaden führt durch die Themen, jedes Thema lässt sich auch gezielt üben, und es gibt Abzeichen.

- [ENTSCHEIDUNGEN.md](ENTSCHEIDUNGEN.md): was Daniel festgelegt hat, mit Datum. Diese Datei gilt.
- [LERNWEG.md](LERNWEG.md): Vorschlag für Lernweg, Stationen und Abzeichen
- [WEG.md](WEG.md): Vorschlag für den Weg als Klostergarten
- [CLAUDE.md](CLAUDE.md): Hinweise für Arbeitssitzungen

## Stand

Umgesetzt (19.11.2026):

- Startseite mit Stimmwahl, Leitfaden, Themen, Abzeichen, Übe-Teil (noch leer) und Einstellungen
- Etappen 1 (Das Notenbild) und 2 (Schlag und Takt) mit elf Übungsarten in je drei Schwierigkeiten
- Fortschritt im Browser des Geräts

Entschieden, aber noch nicht umgesetzt:

- Der Leitfaden wird zum Klostergarten mit der Kapelle als Ziel. Die Notenzeile im Code ist abgelöst.
- Stationen werden in nötige und freiwillige aufgeteilt, dazu Spätblüher.
- Die Optik wird nach der Geschichte des Weges neu gesucht. Die jetzige Gestaltung ist ein erster Vorschlag.

## Technik

- Reine statische Web-App: HTML, CSS und JavaScript-Module, ohne Build-Schritt.
- Notenbild mit [abcjs](https://github.com/paulrosen/abcjs) (MIT-Lizenz, liegt in `vendor/`).
- Klang wird im Browser erzeugt (Web Audio), ohne Klangdateien.
- Schriften liegen im Repository: Atkinson Hyperlegible, EB Garamond und die Ziffern aus Figtree (alle SIL Open Font License, siehe `fonts/`). Es werden keine Daten an fremde Server geschickt.
- Adressen mit `#/…`, damit GitHub Pages ohne Server-Regeln reicht.

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

### Eine neue Übungsart

Eine Datei in `js/uebungen/` anlegen und in `js/uebungen/index.js` eintragen. Eine Übung hat `id`, `titel`, `themaId`, `aufgaben`, `stufen`, `erklaerung` und eine Funktion `neu(stufe, { stimme })`, die eine Aufgabe zurückgibt: entweder eine Auswahl (`frage`, `bild`, `optionen`, `loesung`, `warum`) oder eine eigene Ansicht über `eigene(el, fertig)`. Danach die Station in `js/lernweg.js` eintragen.

## Lokal ansehen

```sh
python3 -m http.server 8000
```

Dann `http://localhost:8000` öffnen. Wegen der JavaScript-Module funktioniert das Öffnen der Datei direkt im Browser nicht.

## Veröffentlichen

Auf GitHub unter **Settings → Pages** als Quelle „Deploy from a branch“ wählen, Branch `main`, Ordner `/ (root)`. Die App ist danach unter `https://<benutzer>.github.io/<repository>/` erreichbar.
