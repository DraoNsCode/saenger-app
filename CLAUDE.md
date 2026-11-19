# Hinweise für Arbeitssitzungen

Dieses Repository enthält die Choristen-App (Sänger-App) für Daniels Gemeindechor.

## Welche Datei gilt

- **ENTSCHEIDUNGEN.md** ist maßgeblich. Nur dort steht, was Daniel festgelegt hat, jeweils mit Datum. Widersprechen sich zwei Einträge, gilt der jüngere.
- **LERNWEG.md** und **WEG.md** enthalten Vorschläge von Claude. Sie sind keine Vorgaben, solange sie nicht in ENTSCHEIDUNGEN.md stehen.
- **Der Code** zeigt den umgesetzten Stand. Er kann hinter den Entscheidungen zurückliegen. Was abgelöst ist, steht in README.md unter „Stand“ und als Kommentar in der betroffenen Datei.
- **Der Stand** (umgesetzt, abgelöst, vorläufig, nächster Schritt) steht nur in README.md unter „Stand“. Zu Beginn einer Sitzung dort nachlesen.

## Prüfen

- Nach jeder Änderung am Code: `npm test` (ohne Installation, unter einer Sekunde).
- Nach Änderungen an Ansichten, Abläufen oder Gestaltung: einmal `npm install`, dann `npm run klicktest`. Die Screenshots in `pruefung/ausgabe/` ansehen, bevor eine Änderung als fertig gilt.
- Daniel Belege zeigen statt nur „fertig“ zu melden: Testausgabe, Bericht, Screenshots der geänderten Stellen.
- Claude kann nichts hören. Klang, musikalischen Inhalt und wie sich das Üben anfühlt, prüft Daniel. Bei Änderungen daran sagen, was er ausprobieren soll.
- Die Tests halten auch Entscheidungen fest (6 aus 8, Schlüssel je Stimme). Ändert sich eine Entscheidung, den Test im selben Schritt anpassen.

## Regeln für Dokumente

- Vorschläge nie als Anforderung, Randbedingung oder Entscheidung formulieren. Als festgelegt gilt nur, was Daniel entschieden hat.
- Neue Entscheidungen mit Datum in ENTSCHEIDUNGEN.md eintragen. Wird eine frühere Entscheidung ersetzt, beim alten Eintrag vermerken, dass er abgelöst ist.
- Vorschläge in getrennten Dateien ablegen und dort als Vorschlag kennzeichnen.
- Ändert sich eine Entscheidung, auch README.md (Stand), die Kommentare im betroffenen Code und die Tests anpassen, damit keine Sitzung von einem veralteten Stand ausgeht.
