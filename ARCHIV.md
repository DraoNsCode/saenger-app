# Archiv

Am 26.11.2026 hat Claude auf Daniels Wunsch aufgeräumt („Räume auf“). Was aus dem Arbeitsstand genommen wurde, liegt unverändert im Commit `a904728`, dem Stand direkt vor dem Aufräumen. Nur lesen, wenn Daniel danach fragt. Die alten Entwürfe lenken sonst in eine Richtung, die Daniel nicht gewählt hat.

## Was im Archiv liegt

| Pfad | Inhalt |
| --- | --- |
| `WEG.md` | erster Vorschlag für den Weg als Klostergarten, mit Zuordnung der Bereiche zu den Etappen (19.11.2026) |
| `GARTEN-BILD.md` | erster Anlauf zu Bild und Optik des Gartens: Anforderungen, Wege zur Grafik, Probe, Stilvarianten (24./25.11.2026) |
| `GARTEN-WORTE.md`, `GARTEN-VERGLEICH.md` | Entwurf des Gartens in Worten aus einer anderen Sitzung und der Vergleich mit der Probe (25.11.2026) |
| `GARTEN-NEU.md` | Neuanfang Schritt für Schritt: Ebenen 0 bis 2, Stilrunden, Bausteine-Probe, Vergleich der Wege (25./26.11.2026). Was davon technisch weiter gilt, steht im Skill `garten-grafik` |
| `probe/` | Seiten, Bilder und Zeichenwerkzeuge des ersten Anlaufs, alte Stilregeln (`probe/archiv-stilregeln.md`) |
| `geruest/` (bis auf `garten-lauf.html` und `stil2/b-geruest.webp`) | Skizzen zu Ebene 1 und 2, Stilrunden, Bausteine-Probe, Bühne mit Schieberegler, Anschluss zweier Bereiche |
| `garten/boegen/`, `garten/bereiche/`, `garten/zeichner.js`, `garten/werkstatt/werkstatt.html`, `freistellen.js`, `garten/teile/` (bis auf die Trittsteine) | der Baukasten aus freigestellten Einzelteilen, am 26.11.2026 durch „ein Bild je Bereich“ abgelöst |
| `garten/buehne/schlag-takt/jung.webp` | Versuch, das ganze Bild auf einmal in „jung“ zu verwandeln (die Beete wanderten) |

## Wiederherstellen

Einzelne Dateien:

```sh
git fetch --depth=50 origin main      # nur nötig in einer flachen Kopie
git checkout a904728 -- GARTEN-NEU.md
```

Den ganzen alten Stand ansehen, ohne etwas zu ändern:

```sh
git switch --detach a904728
```

Danach mit `git switch main` zurück.
