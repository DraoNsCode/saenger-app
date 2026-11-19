# Lernweg – Vorschlag

Stand 19.11.2026. Diese Seite enthält Vorschläge von Claude. Was Daniel davon bestätigt oder geändert hat, steht in [ENTSCHEIDUNGEN.md](ENTSCHEIDUNGEN.md); bei Widersprüchen gilt ENTSCHEIDUNGEN.md.

## Die Idee

- **Zwei Ebenen statt drei.** Der Leitfaden besteht aus Themen. Jedes Thema ist eine Etappe mit einigen Stationen. Dieselben Themen kann man im Reiter „Themen“ gezielt üben. Es gibt keine eigene Ebene „Bereiche“ mehr neben den Themen.
- **Eine Etappe, ein musikalisches Thema.** Innerhalb einer Etappe bleibt man bei einer Sache. Tonhöhe und Rhythmus wechseln sich von Etappe zu Etappe ab.
- **Stationen.** Im Code ist derzeit eine Station eine Übungsart in einer Schwierigkeit, und die letzte Station jeder Etappe mischt Aufgaben aus der ganzen Etappe. Inzwischen ist eine Aufteilung in nötige und freiwillige Stationen entschieden (ENTSCHEIDUNGEN.md, 19.11.2026). Sie ist noch nicht ausgearbeitet.
- **Notennamen unabhängig von den Ziffern.** Alle Notennamen kommen in einer eigenen Etappe. Die Ziffern folgen später mit der Tonleiter, und zwar in jeder Tonart gleich.

## Die Etappen

Grundidee und Reihenfolge hat Daniel vorläufig bestätigt.

| Nr. | Thema | Inhalt | Stand |
| --- | --- | --- | --- |
| 1 | Das Notenbild | Linien und Zwischenräume, höher und tiefer, Schritt und Sprung, die vier Stimmen im Chorsatz | spielbar |
| 2 | Schlag und Takt | Grundschlag, Ganze, Halbe und Viertel, Pausen, 4/4- und 3/4-Takt | spielbar |
| 3 | Notennamen | c d e f g a h im eigenen Schlüssel, Hilfslinien, die Tasten am Klavier | |
| 4 | Achtel und Auftakt | Zählen mit „und“, Achtelpausen, der Auftakt | |
| 5 | Tonleiter und Ziffern | Ganz- und Halbton, die Dur-Tonleiter, die Ziffern 1 bis 7, Stufen hören und singen | |
| 6 | Zeichen im Notenbild | Wiederholungen, Strophen, Klammern, laut und leise, Atemzeichen, Fermate, D.C., D.S. und Coda | |
| 7 | Intervalle | Sekunde bis Oktave lesen, hören und singen | |
| 8 | Punktierung und Haltebogen | Punktierte Noten, Haltebogen, 2/2- und 6/8-Takt in zwei Schlägen | |
| 9 | Zusammenklang | Dreiklang, Dur oder Moll, der Einsatzton, die eigene Stimme im Satz hören | |
| 10 | Vorzeichen und Tonarten | Kreuz, Be und Auflösungszeichen, die 1 finden, Moll | |
| 11 | Feinheiten im Rhythmus | Synkopen, Triolen und Sechzehntel | |

## Stationen der Etappen 1 und 2 (derzeit im Code)

Diese Aufteilung wird überarbeitet: je Übung eine nötige Station, dazu freiwillige Stufen und Spätblüher (ENTSCHEIDUNGEN.md, 19.11.2026). Die Spalte „Im Leitfaden“ beschreibt nur den jetzigen Code.

| Etappe | Station | Übungsart | Im Leitfaden |
| --- | --- | --- | --- |
| 1 | Linie oder Zwischenraum | Note im System: Linie oder Zwischenraum? | leicht |
| 1 | Höher oder tiefer | Zwei Noten im Bild vergleichen | leicht |
| 1 | Schritt oder Sprung | Zwei Noten im Bild: Schritt, Sprung oder gleich | leicht |
| 1 | Hören und sehen | Töne hören, das passende Notenbild wählen | leicht |
| 1 | Die Stimmen im Chorsatz | Farbige Note im vierstimmigen Satz einer Stimme zuordnen | leicht |
| 1 | Abschluss | gemischt | leicht und mittel |
| 2 | Im Schlag tippen | Zur Musik bei jedem Schlag tippen | leicht |
| 2 | Notenwerte | Wie viele Schläge dauert die Note? | leicht |
| 2 | Pausen | Dieselbe Übung, vor allem mit Pausen | mittel |
| 2 | Auf welchem Schlag? | Auf welchem Schlag beginnt die farbige Note? | leicht |
| 2 | Takt ergänzen | Welche Note macht den Takt voll? | leicht |
| 2 | Rhythmus erkennen | Rhythmus hören, das passende Notenbild wählen | leicht |
| 2 | Rhythmus klopfen | Einen Rhythmus lesen und tippen | leicht |
| 2 | Abschluss | gemischt | leicht und mittel |

Im Code gibt es jede Übungsart in drei Schwierigkeiten. Was „mittel“ und „schwer“ jeweils bedeuten, steht in der App bei jeder Übung. Nicht bei jeder Übung sind drei Stufen sinnvoll; das wird mit der neuen Aufteilung geprüft. Die Aufgaben entstehen jedes Mal neu.

## Runden

So ist es derzeit umgesetzt. Die Grenze von 6 aus 8 hat Daniel bestätigt.

- Eine Runde hat 8 Aufgaben, bei den Übungen zum Tippen 4.
- Eine Runde gilt als geschafft ab 75 % richtigen Aufgaben, also ab 6 von 8 oder 3 von 4.
- Eine Station ist geschafft, wenn eine Runde dort geschafft ist. Dann öffnet sich die nächste. Geschaffte Stationen bleiben offen.
- Im Reiter „Themen“ sind alle fertigen Themen frei zugänglich, unabhängig vom Leitfaden.
- Vor der ersten Runde einer Übung kommt eine kurze Erklärung. Sie lässt sich jederzeit über das Fragezeichen öffnen.

## Abzeichen

Vorläufig bestätigt (19.11.2026). Später soll das Thema Abzeichen eventuell ganz neu angegangen werden, siehe ENTSCHEIDUNGEN.md.

| Gruppe | Abzeichen | Bedingung |
| --- | --- | --- |
| Themen | Bronze, Silber, Gold je Thema | 25 geschaffte Runden: Bronze ab leicht, Silber ab mittel, Gold nur schwer. Nach Gold zählt jede weitere 25 schweren Runden ein weiteres Gold. |
| Leitfaden | Etappe geschafft | alle Stationen einer Etappe |
| Leitfaden | Am Ziel | alle Etappen |
| Dranbleiben | 3, 10, 30, 100 Tage | an so vielen verschiedenen Tagen geübt, sie müssen nicht aufeinander folgen |
| Ohne Fehler | 1, 10, 50 Runden | Runden mit allen Aufgaben richtig |

Die Zahlen für Bronze, Silber und Gold gehen auf Daniels spontanes Beispiel zurück (Bronze für 25 leichte Übungen). Er hat sie als unverbindlich bezeichnet.

## Das Bild des Leitfadens

Die Notenzeile, die im Code noch zu sehen ist, ist abgelöst. Der Leitfaden wird zum Klostergarten, siehe [ENTSCHEIDUNGEN.md](ENTSCHEIDUNGEN.md) und [WEG.md](WEG.md).

## Rückmeldung

Am 19.11.2026 hat Daniel Grundidee, Reihenfolge, Abzeichen, die Grenze für eine geschaffte Runde und die Anrede vorläufig bestätigt. Das Bild als Notenzeile hat er zunächst bestätigt und am selben Tag durch den Klostergarten ersetzt.
