# Hinweise für Arbeitssitzungen

Dieses Repository enthält die Choristen-App (Sänger-App) für Daniels Gemeindechor.

## Welche Datei gilt

- **ENTSCHEIDUNGEN.md** ist maßgeblich. Nur dort steht, was Daniel festgelegt hat, jeweils mit Datum. Widersprechen sich zwei Einträge, gilt der jüngere.
- **LERNWEG.md**, **WEG.md**, **GEZIELT-UEBEN.md** und **FAHRPLAN.md** enthalten Vorschläge von Claude. Sie sind keine Vorgaben, solange sie nicht in ENTSCHEIDUNGEN.md stehen.
- **Der Code** zeigt den umgesetzten Stand. Er kann hinter den Entscheidungen zurückliegen. Was abgelöst ist, steht in README.md unter „Stand“ und als Kommentar in der betroffenen Datei.
- **Der Stand** (umgesetzt, abgelöst, vorläufig, nächster Schritt) steht nur in README.md unter „Stand“. Zu Beginn einer Sitzung dort nachlesen.

## Prüfen

- Nach jeder Änderung am Code: `npm test` (ohne Installation, unter einer Sekunde).
- Der Klick-Test läuft nur selten (einmal vorher `npm install`):
  - `npm run klicktest:schnell` (unter einer Minute) nur, wenn sich Ansichten oder Abläufe sichtbar ändern. Bei Texten, Zahlen und Übungsinhalten reicht `npm test`.
  - `npm run klicktest` (voll, etwa 4 Minuten) nur vor dem Abschluss eines Bausteins oder nach größeren Umbauten.
  - Die Screenshots in `pruefung/ausgabe/` ansehen, bevor die Änderung als fertig gilt.
- Daniel Belege zeigen statt nur „fertig“ zu melden: Testausgabe, Bericht, Screenshots der geänderten Stellen.
- Claude kann nichts hören. Klang, musikalischen Inhalt und wie sich das Üben anfühlt, prüft Daniel. Bei Änderungen daran sagen, was er ausprobieren soll.
- Die Tests halten auch Entscheidungen fest (6 aus 8, Schlüssel je Stimme). Ändert sich eine Entscheidung, den Test im selben Schritt anpassen.
- Neue oder geänderte Texte für die Sänger (Fragen, Erklärungen, Rückmeldungen) zusätzlich in frischem Kontext, etwa durch einen Subagenten, aus Sicht eines Sängers ohne Notenkenntnis lesen lassen. Nur Unklares melden lassen, keine Stilfragen.

## Arbeitsweise

- Welches Werkzeug passt (Chat, Claude Code im Web, Desktop-App mit Vorschau), überlässt Daniel Claude. Ist für eine Aufgabe ein anderes Werkzeug deutlich besser, das zu Beginn kurz sagen.
- Vor einer neuen Art von Aufgabe (z. B. Mikrofon, Grafik, Konten) kurz prüfen, ob eine erprobte Bibliothek, ein Skill oder ein Plugin sie besser oder einfacher löst. Treffer als Vorschlag mit Vor- und Nachteilen vorlegen. Nichts ohne Daniels Zustimmung einbauen.
- FAHRPLAN.md zeigt, wo ein Auftrag im Ganzen steht. Ist ein Baustein fertig oder ändert sich etwas, die Tabelle dort anpassen.

## Regeln für Dokumente

- Vorschläge nie als Anforderung, Randbedingung oder Entscheidung formulieren. Als festgelegt gilt nur, was Daniel entschieden hat.
- Neue Entscheidungen mit Datum in ENTSCHEIDUNGEN.md eintragen. Wird eine frühere Entscheidung ersetzt, beim alten Eintrag vermerken, dass er abgelöst ist.
- Vorschläge in getrennten Dateien ablegen und dort als Vorschlag kennzeichnen.
- Ändert sich eine Entscheidung, auch README.md (Stand), die Kommentare im betroffenen Code und die Tests anpassen, damit keine Sitzung von einem veralteten Stand ausgeht.
