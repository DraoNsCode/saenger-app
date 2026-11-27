// Inhalt der Stimmbildung im Übe-Teil (Baustein D). Vorschlag von Claude, Daniel prüft die Texte.
// Festgelegt ist nur, was in ENTSCHEIDUNGEN.md steht (Abschnitt „Übe-Teil“): die Übungsliste, die Form des
// Probestücks „Vom Summen ins a“ und die beiden Abläufe. Die Texte selbst bleiben Vorschlag.
//
// Diese Datei ist die Quelle. inhalt/stimmbildung.md wird daraus erzeugt (node pruefung/stimmbildung-md.mjs),
// npm test prüft, dass beide übereinstimmen.
//
// begleitung.art:
//   keine      – nur Text
//   klicks     – Klicks im Tempo, bis „Stopp“ (takt: Klicks je Takt, der erste betont)
//   ton        – ein Ton, ton: [tiefster, höchster] als MIDI für Frauen; je Durchgang einen Halbton höher.
//                Die App spielt den Ton kurz vor, zählt vier Klicks vor, dann klingt der Ton leise mit, die Klicks laufen.
//                Dauer aus den Noten, sonst schlaege.
//   muster     – Noten aus abc, tonarten: [von, bis] in Halbtönen über C; bis < von heißt abwärts.
//                Vor jedem Durchgang der Akkord, der erste Durchgang zweimal (zuhören, mitsingen).
//   halteton   – zwei Stimmen: oben die Linie, unten der lange Ton (Orgel). Je Tonart erst mit, dann ohne Linie.
//   anfangston – nur ein Ton (ton als MIDI); mit tonarten und abstand (Sekunden) jedes Mal etwas höher.
// Männer (Tenor, Bass) singen eine Oktave tiefer. Tonräume je Stimme: js/ueben/spieler.js.

export const THEMEN = [
  {
    id: "koerper",
    titel: "Körper und Haltung"
  },
  {
    id: "atem",
    titel: "Atem"
  },
  {
    id: "ingang",
    titel: "Die Stimme in Gang bringen"
  },
  {
    id: "hoehe",
    titel: "Höhe und Tiefe"
  },
  {
    id: "vokale",
    titel: "Vokale und Klang"
  },
  {
    id: "beweglich",
    titel: "Beweglichkeit"
  },
  {
    id: "dynamik",
    titel: "Lauter und leiser"
  },
  {
    id: "sauber",
    titel: "Sauber singen"
  },
  {
    id: "text",
    titel: "Text und Aussprache"
  },
  {
    id: "pflege",
    titel: "Die Stimme pflegen"
  }
];

export const UEBUNGEN = [
  {
    id: "nacken",
    thema: "koerper",
    titel: "Nacken und Schultern lösen",
    quelle: "D „Lockern“",
    begleitungText: "keine",
    wozu: "Spannung in Nacken und Schultern macht den Hals eng. Gelöst singt es sich leichter.",
    schritte: [
      "Neige den Kopf langsam zur rechten Schulter, dann zur linken. Nur so weit, wie es angenehm ist.",
      "Kreise die Schultern ein paarmal nach hinten.",
      "Zieh die Schultern hoch, halte sie kurz und lass sie fallen."
    ],
    gelingt: "die Schultern danach tiefer hängen als vorher und sich der Nacken lang anfühlt.",
    fehler: "Den Nacken mit Schwung oder Ruck dehnen.",
    hilft: "Langsam bewegen, ganz ohne Schwung.",
    achtung: "Tut der Nacken weh, bewege ihn nur ganz wenig oder lass diesen Teil aus.",
    begleitung: {
      art: "keine"
    },
    varianten: [
      {
        name: "Strecken und gähnen",
        text: "Strecke die Arme weit nach oben, mach dich lang und gähne dabei. Das Gähnen macht auch innen im Hals weit."
      },
      {
        name: "Ausschütteln",
        text: "Schüttle Arme und Beine nacheinander aus. Kopf, Schultern und Unterkiefer hängen dabei locker."
      },
      {
        name: "Kiefer lösen",
        text: "Streiche mit den Fingerspitzen über die Kiefergelenke vor den Ohren und lass den Unterkiefer locker hängen."
      }
    ]
  },
  {
    id: "singhaltung",
    thema: "koerper",
    titel: "In die Singhaltung stellen",
    quelle: "D „Singhaltung“, Variante „Abrollen“ aus S „Aufrichten“",
    begleitungText: "keine",
    wozu: "Aufrecht und locker hat der Atem Platz.",
    schritte: [
      "Stell die Füße etwa schulterbreit, das Gewicht auf beiden Füßen.",
      "Die Knie sind locker, nicht durchgedrückt.",
      "Stell dir vor, ein Faden zieht dich am Scheitel sanft nach oben. Die Schultern hängen."
    ],
    gelingt: "du so stehen bleiben und dabei ruhig atmen kannst.",
    fehler: "Aus „aufrecht“ wird „Brust raus“: ein Hohlkreuz, die Schultern nach hinten gezogen.",
    hilft: "Vom Scheitel aus nach oben wachsen und die Schultern fallen lassen.",
    begleitung: {
      art: "keine"
    },
    varianten: [
      {
        name: "Im Sitzen",
        text: "Setz dich vorn auf den Stuhl. Beide Füße stehen auf dem Boden, der Rücken lehnt nicht an."
      },
      {
        name: "Mit Noten",
        text: "Halte die Noten so hoch, dass der Kopf oben bleibt. Nur die Augen schauen nach unten."
      },
      {
        name: "Abrollen und aufrichten",
        text: "Lass den Kopf sinken und roll den Oberkörper langsam nach vorn ab, bis die Arme hängen. Dabei atmest du aus, die Knie sind leicht gebeugt. Dann rollst du dich langsam wieder auf, der Kopf kommt zuletzt. Mit Rückenbeschwerden rollst du nur ein kleines Stück."
      }
    ]
  },
  {
    id: "flanken",
    thema: "atem",
    titel: "In die Flanken atmen",
    quelle: "D „Einatmen“",
    begleitungText: "keine, bei der Variante „Schnell einatmen“ Klicks",
    wozu: "Tief und leise einatmen, ohne die Schultern zu heben.",
    schritte: [
      "Leg die Hände seitlich an die unteren Rippen.",
      "Atme auf „f“ ruhig aus, bis du merkst, dass kaum noch Luft da ist. Pressen musst du nicht.",
      "Warte einen Moment. Dann lass die Luft von selbst einströmen, leise und gegen deine Hände.",
      "Mach das drei- oder viermal."
    ],
    gelingt: "deine Hände zur Seite und nach hinten gehen, die Schultern ruhig bleiben und man das Einatmen nicht hört.",
    fehler: "Die Luft wird hochgezogen, hörbar und mit den Schultern.",
    hilft: "Nicht Luft holen, sondern kommen lassen. Vorher etwas länger ausatmen.",
    begleitung: {
      art: "keine"
    },
    varianten: [
      {
        name: "Ohne Hände",
        text: "Dieselbe Weite, jetzt nur noch spüren."
      },
      {
        name: "Schnell einatmen",
        text: "Die App gibt langsame Klicks. Vier Klicks lang atmest du auf „s“ aus, bis zum nächsten Klick atmest du leise ein. Mehrmals hintereinander, bis du auf „Stopp“ tippst.",
        begleitung: {
          art: "klicks",
          tempo: 60,
          takt: 4
        }
      }
    ],
    variantenHinweis: "„Schnell einatmen“ mit Klicks, Viertel = 60."
  },
  {
    id: "ausatmen",
    thema: "atem",
    titel: "Langes Ausatmen auf „s“",
    quelle: "D „Luft führen“",
    begleitungText: "keine, bei der Variante „Vom s ins a“ ein Ton",
    wozu: "Die Luft gleichmäßig und lange abgeben. Das brauchst du für lange Töne und lange Zeilen.",
    schritte: [
      "Atme ruhig ein, die Schultern bleiben unten.",
      "Atme auf „s“ aus, leise und gleichmäßig.",
      "Hör auf, sobald das „s“ dünner wird. Press nicht den letzten Rest heraus."
    ],
    gelingt: "das „s“ vom Anfang bis zum Ende gleich stark klingt.",
    fehler: "Am Anfang entweicht viel Luft, am Ende wird gepresst.",
    hilft: "Leiser beginnen und früher aufhören.",
    begleitung: {
      art: "keine"
    },
    varianten: [
      {
        name: "Auf „sch“",
        text: "Dabei strömt mehr Luft, gleichmäßig zu bleiben ist schwerer."
      },
      {
        name: "Leise, lauter, leise",
        text: "Beginne leise, werde lauter und wieder leiser, alles auf einem „s“."
      },
      {
        name: "Vom s ins a",
        text: "Tippe auf „Start“, die App spielt einen Ton. Mach auf diesem Ton ein summendes „s“, wie am Anfang von „Sonne“ oder wie eine Biene. Dann öffnest du ohne Pause zum „a“. Nach jedem Durchgang geht der Ton einen halben Ton höher, mit „Stopp“ hörst du auf.",
        begleitung: {
          art: "ton",
          ton: [
            63,
            67
          ],
          tempo: 60,
          schlaege: 8
        }
      }
    ],
    variantenHinweis: "„Vom s ins a“: ein Ton zwischen es′ und g′."
  },
  {
    id: "stoesse",
    thema: "atem",
    titel: "Kurze Stöße: sch – sch – sch",
    quelle: "D „Impuls“",
    begleitungText: "Klicks, bei der Variante „ha“ ein Ton",
    wozu: "Kurze, spürbare Stöße aus dem Bauch. Das macht Einsätze und kurze Töne leicht.",
    schritte: [
      "Leg eine Hand auf den Bauch.",
      "Tippe auf „Start“. Die App gibt Klicks.",
      "Auf jeden Klick ein kurzes „sch“. Nach jedem „sch“ lässt du den Bauch wieder los.",
      "Mit „Stopp“ hörst du auf."
    ],
    gelingt: "die Bauchdecke bei jedem „sch“ kurz nach innen federt und sich wieder löst und du zwischendurch nicht nach Luft schnappen musst.",
    fehler: "Der Stoß kommt aus dem Hals oder den Schultern, oder der Bauch bleibt fest und die Luft geht aus.",
    hilft: "Langsamer, und nach jedem Laut loslassen.",
    notenText: "drei Klicks, immer wieder von vorn, Viertel = 76.",
    abc: "X:1\nM:3/4\nL:1/4\nQ:1/4=76\nK:C clef=perc stafflines=1\n|: B B B :|\nw: sch sch sch",
    begleitung: {
      art: "klicks",
      tempo: 76,
      takt: 3
    },
    varianten: [
      {
        name: "p – t – k",
        text: "Leichter und schneller, mit weniger Luft. Auf jeden Klick ein Laut: p, t, k, und wieder von vorn.",
        abc: "X:1\nM:3/4\nL:1/4\nQ:1/4=100\nK:C clef=perc stafflines=1\n|: B B B :|\nw: p t k",
        begleitung: {
          art: "klicks",
          tempo: 100,
          takt: 3
        }
      },
      {
        name: "Kurz – kurz – lang",
        text: "sch – sch – schhh. Zwei kurze „sch“ auf zwei Klicks, dann ein langes „sch“, das zwei Klicks dauert.",
        abc: "X:1\nM:4/4\nL:1/4\nQ:1/4=76\nK:C clef=perc stafflines=1\n|: B B B2 :|\nw: sch sch sch",
        begleitung: {
          art: "klicks",
          tempo: 76,
          takt: 4
        }
      },
      {
        name: "„ha“ auf einem Ton",
        text: "Die App spielt einen Ton und gibt Klicks. Auf die ersten drei Klicks singst du je ein kurzes „ha“, jedes ein eigener kleiner Stoß. Auf den vierten Klick ist Pause.",
        abc: "X:1\nM:4/4\nL:1/4\nQ:1/4=92\nK:C\n|: .F .F .F z :|\nw: ha ha ha",
        begleitung: {
          art: "ton",
          ton: [
            63,
            67
          ],
          tempo: 92
        }
      }
    ],
    variantenHinweis: "„p – t – k“ Viertel = 100. „ha auf einem Ton“: ein Ton zwischen es′ und g′, Viertel = 92."
  },
  {
    id: "hecheln",
    thema: "atem",
    titel: "Hecheln",
    quelle: "D „Hecheln“",
    begleitungText: "keine",
    wozu: "Die Muskeln für den Atem werden beweglich und wach.",
    schritte: [
      "Öffne den Mund locker.",
      "Atme schnell und flach ein und aus, wie ein Hund nach dem Laufen. Nur ein paar Sekunden.",
      "Dann atmest du normal weiter. Das Ganze zwei- oder dreimal."
    ],
    gelingt: "sich der Bauch und die Seiten unter den Rippen bewegen und der Brustkorb ruhig bleibt.",
    fehler: "Die Schultern heben sich, oder du hechelst zu lange.",
    hilft: "Nur wenige Sekunden am Stück.",
    achtung: "Wird dir schwindlig, hör sofort auf und atme normal weiter.",
    begleitung: {
      art: "keine"
    }
  },
  {
    id: "summen",
    thema: "ingang",
    titel: "Vom Summen ins „a“",
    quelle: "D „Summen und öffnen“",
    begleitungText: "Tonarten C bis F",
    hinweis: "Probestück, von Daniel bestätigt (27.11.2026)",
    wozu: "Die Stimme springt leicht an. Der leise, weiche Klang vom Summen soll im „a“ erhalten bleiben.",
    schritte: [
      "Schließe die Lippen locker. Die Zähne berühren sich nicht. Innen im Mund ist Platz, wie beim Gähnen mit geschlossenen Lippen.",
      "Tippe auf „Start“. Die App spielt einen Akkord und dann das Muster: fünf Töne, erst hinauf, dann wieder hinunter. Beim ersten Mal hörst du nur zu.",
      "Die App spielt das Muster noch einmal auf derselben Höhe. Jetzt summst du leise mit. Beim letzten Ton öffnest du die Lippen zum „a“. Der Ton läuft dabei weiter, ohne Pause und ohne neu zu atmen.",
      "Danach geht es jedes Mal einen halben Ton höher, und du singst wieder mit. Ganz oben kehrt die App um und geht wieder hinunter bis zum Anfang, dann hört sie auf. Wird es dir vorher anstrengend, tippe auf „Nicht höher“, dann geht es gleich wieder abwärts. Mit „Stopp“ hörst du jederzeit auf."
    ],
    gelingt: "das „a“ so leise und weich bleibt wie das Summen davor.",
    fehler: "Beim Öffnen wird der Ton plötzlich laut oder hart.",
    hilft: "Insgesamt leiser singen. Beim „a“ öffnest du nur die Lippen, den Unterkiefer kaum. Innen bleibt der Platz wie in Schritt 1.",
    notenText: "1 – 2 – 3 – 2 – 1 ohne Pause zwischen den Tönen, auf „mm“, der letzte Ton auf „a“. Viertel = 66.",
    abc: "X:1\nM:4/4\nL:1/4\nQ:1/4=66\nK:C\n(C D E D | C4) |]\nw: mm _ _ _ a",
    begleitung: {
      art: "muster",
      tonarten: [
        0,
        5
      ],
      tempo: 66
    },
    varianten: [
      {
        name: "Auf „o“ und „e“",
        text: "statt auf „a“ einmal auf „o“, ein andermal auf „e“ öffnen."
      },
      {
        name: "Mit „ng“",
        text: "mit „ng“ statt „m“ summen, wie am Ende von „singen“. Der Mund ist dabei leicht offen.",
        abc: "X:1\nM:4/4\nL:1/4\nQ:1/4=66\nK:C\n(C D E D | C4) |]\nw: ng _ _ _ a"
      },
      {
        name: "Länger",
        text: "neun Töne, bis zur 5 hinauf und wieder zurück. Das „a“ kommt erst auf dem letzten Ton.",
        abc: "X:1\nM:4/4\nL:1/4\nQ:1/4=66\nK:C\n(C D E F | G F E D | C4) |]\nw: mm _ _ _ _ _ _ _ a",
        begleitung: {
          art: "muster",
          tonarten: [
            0,
            4
          ],
          tempo: 66
        }
      }
    ],
    variantenHinweis: "„Länger“: Tonarten C bis E."
  },
  {
    id: "flattern",
    thema: "ingang",
    titel: "Lippenflattern",
    quelle: "S „Lippenflattern“ (Entwurf, mit Quellen)",
    begleitungText: "Tonarten B bis F (B = zwei Halbtöne unter C)",
    wozu: "Die Stimme kommt ohne Druck in Gang, und die Töne verbinden sich wie von selbst.",
    schritte: [
      "Leg die Lippen locker aufeinander und lass sie flattern, ohne Ton, so wie ein Pferd schnaubt.",
      "Tippe auf „Start“ und hör dir das Muster einmal an: fünf Töne hinauf und wieder hinunter.",
      "Beim zweiten Mal flatterst du mit Ton mit. Die Lippen flattern ohne Unterbrechung, auch wenn der Ton wechselt.",
      "Danach geht es jedes Mal einen halben Ton höher. Ganz oben kehrt die App um und geht wieder hinunter bis zum Anfang, dann hört sie auf. Wird es dir vorher anstrengend, tippe auf „Nicht höher“, dann geht es gleich wieder abwärts. Mit „Stopp“ hörst du jederzeit auf."
    ],
    gelingt: "die Lippen vom Anfang bis zum Ende flattern, auch beim Tonwechsel, und der Hals locker bleibt.",
    fehler: "Das Flattern bleibt stehen.",
    hilft: "Die Luft gleichmäßig fließen lassen, nicht zu viel und nicht zu wenig. Klappt es gar nicht, schieb mit zwei Fingern die Wangen neben den Mundwinkeln leicht nach oben.",
    tipp: "Ist deine Stimme angeschlagen, probier die Variante „Gleiten“. Geht das Flattern dabei nicht frei von tief nach hoch, sing heute nur leise und wenig oder lass das Singen heute aus.",
    notenText: "1 – 3 – 5 – 3 – 1 auf „brr“, Viertel = 92.",
    abc: "X:1\nM:4/4\nL:1/4\nQ:1/4=92\nK:C\n(C E G E | C4) |]\nw: brr _ _ _ _",
    begleitung: {
      art: "muster",
      tonarten: [
        -2,
        5
      ],
      tempo: 92
    },
    varianten: [
      {
        name: "Gleiten",
        text: "Flattere ohne einzelne Töne von tief nach hoch und wieder zurück, wie eine Sirene. Die App spielt nur den Anfangston.",
        begleitung: {
          art: "anfangston",
          ton: 60
        }
      },
      {
        name: "Ins „u“",
        text: "Wechsle mitten im Muster vom Flattern zum „u“ und nimm die Leichtigkeit mit."
      }
    ]
  },
  {
    id: "strohhalm",
    thema: "ingang",
    titel: "Singen durch den Strohhalm",
    quelle: "S „Singen durch den Strohhalm“ (Entwurf, mit Quellen)",
    begleitungText: "Tonarten C bis E",
    wozu: "Der Strohhalm nimmt den Druck von der Stimme. Das hilft beim Einsingen und nach viel Sprechen oder Singen.",
    schritte: [
      "Nimm einen dünnen Trinkhalm zwischen die Lippen. Die Lippen schließen rundum, daneben geht keine Luft vorbei.",
      "Tippe auf „Start“ und hör dir das Muster an. Es geht weit hinauf und wieder hinunter.",
      "Beim zweiten Mal singst du in den Strohhalm mit, als würdest du ein „u“ singen. Die ganze Luft geht durch den Strohhalm. Gleite von Ton zu Ton, ohne Pause.",
      "Danach geht es jedes Mal einen halben Ton höher. Ganz oben kehrt die App um und geht wieder hinunter bis zum Anfang, dann hört sie auf. Wird es dir vorher anstrengend, tippe auf „Nicht höher“, dann geht es gleich wieder abwärts. Mit „Stopp“ hörst du jederzeit auf."
    ],
    gelingt: "sich der Klang vorn im Gesicht anfühlt und die Stimme danach leichter ist als vorher.",
    fehler: "Ein Teil der Luft geht durch die Nase statt durch den Strohhalm.",
    hilft: "Halte dir kurz die Nase zu. Ändert sich dabei der Klang, ging Luft durch die Nase. Denk dann noch deutlicher an ein „u“ und schick alle Luft durch den Strohhalm.",
    tipp: "Je dünner der Strohhalm, desto stärker die Wirkung.",
    notenText: "1 – 5 – obere 1 – 5 – 3 – 1, gleitend auf „u“ in den Strohhalm, Viertel = 66.",
    abc: "X:1\nM:4/4\nL:1/4\nQ:1/4=66\nK:C\n(C2 G2 | c4 | G2 E2 | C4) |]\nw: u _ _ _ _ _",
    begleitung: {
      art: "muster",
      tonarten: [
        0,
        4
      ],
      tempo: 66
    },
    varianten: [
      {
        name: "Eine Liedzeile",
        text: "Sing eine Zeile aus einem Chorlied, das du kennst, durch den Strohhalm. Dann dieselbe Zeile ohne Strohhalm auf „u“. Das leichte Gefühl nimmst du mit.",
        begleitung: {
          art: "keine"
        }
      },
      {
        name: "Nach dem Singen",
        text: "Ein bis zwei Minuten leise durch den Strohhalm gleiten, ohne Begleitung: langsam von tief nach hoch und zurück, wie bei der „Sirene“.",
        begleitung: {
          art: "keine"
        }
      }
    ]
  },
  {
    id: "abwaerts",
    thema: "hoehe",
    titel: "Fünf Töne abwärts",
    quelle: "D „Abwärts singen“",
    begleitungText: "Tonarten C bis G",
    wozu: "Die leichte Stimme von oben mit nach unten nehmen. Dann klingen hohe und tiefe Töne gleich.",
    schritte: [
      "Tippe auf „Start“ und hör dir das Muster einmal an: fünf Töne abwärts.",
      "Beim zweiten Mal singst du leise mit, auf „nu“. Den ersten Ton beginnst du leise und sanft, wie einen leisen Seufzer. Du rutschst nicht von einem anderen Ton hinein.",
      "Nach unten wirst du nicht lauter und nicht schwerer.",
      "Danach geht es jedes Mal einen halben Ton höher. Ganz oben kehrt die App um und geht wieder hinunter bis zum Anfang, dann hört sie auf. Wird es dir vorher anstrengend, tippe auf „Nicht höher“, dann geht es gleich wieder abwärts. Mit „Stopp“ hörst du jederzeit auf."
    ],
    gelingt: "der unterste Ton so leicht ist wie der oberste und es unterwegs keinen Knick im Klang gibt.",
    fehler: "Der erste Ton kommt laut, oder du rutschst von unten in ihn hinein.",
    hilft: "Den Ton vorher in Gedanken hören und ihn dann leise genau treffen.",
    notenText: "5 – 4 – 3 – 2 – 1 auf „nu“, Viertel = 72.",
    abc: "X:1\nM:4/4\nL:1/4\nQ:1/4=72\nK:C\n(G F E D | C4) |]\nw: nu _ _ _ _",
    begleitung: {
      art: "muster",
      tonarten: [
        0,
        7
      ],
      tempo: 72
    },
    varianten: [
      {
        name: "Auf „no“ und „na“",
        text: "Dieselben fünf Töne auf „no“, dann auf „na“. Der offenere Vokal darf nicht schwerer werden."
      },
      {
        name: "Abwärts gleiten",
        text: "Von der 5 zur 1 langsam hinunterrutschen, ohne einzelne Töne, auf „u“.",
        abc: "X:1\nM:4/4\nL:1/4\nQ:1/4=60\nK:C\n(G2 C2) |]\nw: u _",
        begleitung: {
          art: "muster",
          tonarten: [
            0,
            7
          ],
          tempo: 60
        }
      },
      {
        name: "Die ganze Tonleiter abwärts",
        text: "Acht Töne hinunter auf „no“, genauso leicht beginnen.",
        abc: "X:1\nM:4/4\nL:1/4\nQ:1/4=80\nK:C\n(c B A G | F E D C) |]\nw: no _ _ _ _ _ _ _",
        begleitung: {
          art: "muster",
          tonarten: [
            0,
            2
          ],
          tempo: 80
        }
      }
    ],
    variantenHinweis: "„Die ganze Tonleiter abwärts“ von der oberen 1, Tonarten C bis D."
  },
  {
    id: "sirene",
    thema: "hoehe",
    titel: "Sirene",
    quelle: "S „Sirene durch den ganzen Umfang“ (Entwurf, mit Quellen)",
    begleitungText: "nur ein Anfangston (Frauen c′, Männer c)",
    wozu: "Ohne feste Töne von tief nach hoch und zurück gleiten. So verbindest du tiefe und hohe Töne ohne Bruch.",
    schritte: [
      "Tippe auf „Start“. Die App spielt einen tiefen, bequemen Ton.",
      "Summe ihn leise auf „ng“, wie am Ende von „singen“. Der Mund ist dabei leicht offen.",
      "Gleite langsam nach oben, so hoch es leicht geht, und wieder zurück. Ohne einzelne Töne, wie eine leise Sirene in der Ferne.",
      "Tippe noch einmal auf „Start“ und mach dasselbe auf „u“."
    ],
    gelingt: "du ohne Knick durch die Stelle gleitest, an der deine Stimme sonst umkippt.",
    fehler: "An dieser Stelle wird es lauter, und die Stimme bricht.",
    hilft: "Dort nicht lauter, sondern leichter werden. Oben kehrst du um, bevor es eng wird.",
    begleitung: {
      art: "anfangston",
      ton: 60
    },
    varianten: [
      {
        name: "Mit flatternden Lippen",
        text: "Gleite mit flatternden Lippen statt auf „ng“."
      },
      {
        name: "Nur abwärts",
        text: "Gleite nur von oben nach unten, wie ein langer Seufzer."
      },
      {
        name: "Kleine Sirenen",
        text: "nur ein Stück hinauf und zurück. Die App spielt jedes Mal einen etwas höheren Anfangston, mit „Stopp“ hörst du auf.",
        begleitung: {
          art: "anfangston",
          ton: 60,
          tonarten: [
            0,
            5
          ],
          abstand: 8
        }
      }
    ],
    variantenHinweis: "„Kleine Sirenen“: Anfangston halbtonweise aufwärts, C bis F."
  },
  {
    id: "vokalreihe",
    thema: "vokale",
    titel: "Vokale auf einem Ton",
    quelle: "D „Vokale angleichen“",
    begleitungText: "ein Ton zwischen es′ und g′",
    wozu: "Alle Vokale klingen gleich rund. Es ändert sich nur der Vokal, nicht Klang und Lautstärke.",
    schritte: [
      "Tippe auf „Start“. Die App spielt den Ton kurz vor und zählt vier Klicks vor. Dann singst du. Der Ton klingt leise mit, und die Klicks laufen weiter.",
      "Sing auf diesem Ton ohne Pause nacheinander u – o – a – e – i. Jeder Vokal dauert zwei Klicks, das „i“ am Schluss vier.",
      "Der Unterkiefer bleibt ruhig. Den Vokal formen Zunge und Lippen.",
      "Nach jedem Durchgang geht der Ton einen halben Ton höher. Ganz oben kehrt die App um und geht wieder hinunter bis zum Anfang, dann hört sie auf. Mit „Nicht höher“ geht es gleich wieder abwärts, mit „Stopp“ hörst du jederzeit auf."
    ],
    gelingt: "der Ton beim Wechsel gleich laut bleibt und „e“ und „i“ so rund klingen wie das „u“.",
    fehler: "„e“ und „i“ klingen plötzlich viel heller und lauter als die anderen Vokale, weil der Mund breit wird.",
    hilft: "Vom „u“ aus denken. Die Lippen bleiben etwas rund, innen bleibt der Platz.",
    notenText: "fünf lange Töne auf demselben Ton, Viertel = 72.",
    abc: "X:1\nM:4/4\nL:1/4\nQ:1/4=72\nK:C\n(F2 F2 | F2 F2 | F4) |]\nw: u o a e i",
    begleitung: {
      art: "ton",
      ton: [
        63,
        67
      ],
      tempo: 72
    },
    varianten: [
      {
        name: "Mit „n“ davor",
        text: "nu – no – na – ne – ni. Das „n“ vorn an den Zähnen hilft, dass alle Vokale gleich klar und nah klingen.",
        abc: "X:1\nM:4/4\nL:1/4\nQ:1/4=72\nK:C\nF2 F2 | F2 F2 | F4 |]\nw: nu no na ne ni"
      },
      {
        name: "Vom „u“ zum „i“",
        text: "nur u – i – u, danach u – e – u. Die engen Vokale entstehen aus dem Platz des „u“ und kehren dorthin zurück.",
        abc: "X:1\nM:4/4\nL:1/4\nQ:1/4=72\nK:C\n(F2 F2 | F4) |]\nw: u i u"
      },
      {
        name: "Auf fünf Tönen",
        text: "Die App spielt fünf Töne vor, hinauf und wieder hinunter. Jeder Ton bekommt einen Vokal.",
        abc: "X:1\nM:4/4\nL:1/4\nQ:1/4=72\nK:C\n(C D E D | C4) |]\nw: u o a e i",
        begleitung: {
          art: "muster",
          tonarten: [
            0,
            5
          ],
          tempo: 72
        }
      }
    ],
    variantenHinweis: "„Auf fünf Tönen“: 1 – 2 – 3 – 2 – 1, Tonarten C bis F, mit Zuhör-Durchgang wie bei den Mustern."
  },
  {
    id: "hell-dunkel",
    thema: "vokale",
    titel: "Hell und dunkel",
    quelle: "D „Klangfarben“",
    begleitungText: "ein Ton zwischen d′ und g′",
    wozu: "Hören und spüren, wie sich der Klang färben lässt. Im Lied passt nicht zu jedem Text dieselbe Farbe.",
    schritte: [
      "Tippe auf „Start“. Die App spielt den Ton kurz vor und zählt vier Klicks vor. Dann singst du. Der Ton klingt leise mit, und die Klicks laufen weiter.",
      "Sing „no“ vier Klicks lang hell: Die Lippen sind etwas breiter, wie bei einem leichten Lächeln. Hier ist das helle Lächeln gewollt.",
      "Atme kurz und sing vier Klicks lang dunkel: Die Lippen sind rund, innen ist es weit wie beim Gähnen. Tonhöhe und Lautstärke bleiben gleich.",
      "Nach jedem Durchgang geht der Ton einen halben Ton höher. Ganz oben kehrt die App um und geht wieder hinunter bis zum Anfang, dann hört sie auf. Mit „Nicht höher“ geht es gleich wieder abwärts, mit „Stopp“ hörst du jederzeit auf."
    ],
    gelingt: "hell und dunkel deutlich verschieden klingen, aber gleich hoch und gleich laut.",
    fehler: "Dunkel wird dumpf und sinkt, hell wird spitz und steigt.",
    hilft: "Dunkel heißt runder, nicht tiefer im Hals. Hell heißt klarer, nicht schärfer.",
    notenText: "ein Ton, vier Klicks hell, vier Klicks dunkel, Viertel = 72.",
    abc: "X:1\nM:4/4\nL:1/4\nQ:1/4=72\nK:C\n\"^hell\"F4 | \"^dunkel\"F4 |]\nw: no no",
    begleitung: {
      art: "ton",
      ton: [
        62,
        67
      ],
      tempo: 72
    },
    varianten: [
      {
        name: "Fließend",
        text: "Ein Ton acht Klicks lang, ganz langsam von hell nach dunkel, in einem Atem. Die Lippen gehen langsam von breit nach rund. Beim nächsten Durchgang umgekehrt.",
        abc: "X:1\nM:4/4\nL:1/4\nQ:1/4=72\nK:C\n\"^hell\"F4- | \"^dunkel\"F4 |]\nw: no _"
      },
      {
        name: "Eine Zeile, eine Farbe",
        text: "Die App spielt fünf Töne abwärts vor. Sing sie auf „no“, einmal hell und einmal dunkel. Die Farbe bleibt bis zum letzten Ton gleich.",
        abc: "X:1\nM:4/4\nL:1/4\nQ:1/4=72\nK:C\n\"^hell\"G F E D | C4 || \"^dunkel\"G F E D | C4 |]\nw: no no no no no no no no no no",
        begleitung: {
          art: "muster",
          tonarten: [
            0,
            4
          ],
          tempo: 72
        }
      },
      {
        name: "Eine Melodie, zwei Farben",
        text: "Dieselben fünf Töne mit Text: „Lob und Dank sei Gott“ hell und freudig, „Herr, erbarme dich“ dunkel. Tempo und Lautstärke bleiben gleich.",
        abc: "X:1\nM:4/4\nL:1/4\nQ:1/4=72\nK:C\n\"^hell\"G F E D | C4 || \"^dunkel\"G F E D | C4 |]\nw: Lob und Dank sei Gott. Herr, er-bar-me dich.",
        begleitung: {
          art: "muster",
          tonarten: [
            0,
            4
          ],
          tempo: 72
        }
      }
    ],
    variantenHinweis: "„Eine Zeile, eine Farbe“ und „Eine Melodie, zwei Farben“: Tonarten C bis E, mit Zuhör-Durchgang wie bei den Mustern."
  },
  {
    id: "kurze-ha",
    thema: "beweglich",
    titel: "Kurze Töne auf „ha“",
    quelle: "D „Beweglichkeit“",
    begleitungText: "Tonarten C bis A",
    wozu: "Jeder Ton bekommt einen kurzen Stoß aus dem Bauch, ohne Druck im Hals. Das macht die Stimme beweglich.",
    schritte: [
      "Tippe auf „Start“ und hör dir das Muster an: fünf kurze Töne, hinauf und wieder hinunter.",
      "Beim zweiten Mal singst du mit. Jeder Ton ist ein eigenes, kurzes „ha“. Die Töne hängen nicht zusammen.",
      "Danach geht es jedes Mal einen halben Ton höher. Ganz oben kehrt die App um und geht wieder hinunter bis zum Anfang, dann hört sie auf. Wird es dir vorher anstrengend, tippe auf „Nicht höher“, dann geht es gleich wieder abwärts. Mit „Stopp“ hörst du jederzeit auf."
    ],
    gelingt: "die Bauchdecke bei jedem Ton kurz nach innen federt und die Töne kurz, klar und gleich laut sind.",
    fehler: "Die Töne werden im Hals abgeschnitten oder hart angesetzt.",
    hilft: "Leiser singen und das „h“ vor jedem Ton deutlich hauchen.",
    tipp: "Geht es leicht, stell das Tempo etwas schneller.",
    notenText: "1 – 3 – 5 – 3 – 1, kurze Töne, Viertel = 92.",
    abc: "X:1\nM:4/4\nL:1/8\nQ:1/4=92\nK:C\n.C.E.G.E .C2 z2 |]\nw: ha ha ha ha ha",
    begleitung: {
      art: "muster",
      tonarten: [
        0,
        9
      ],
      tempo: 92
    },
    varianten: [
      {
        name: "Erst kurz, dann verbunden",
        text: "Das Muster zuerst kurz auf „ha“, dann ohne Pause zwischen den Tönen auf „ja“. Auch verbunden bleibt der Hals so locker wie bei den kurzen Tönen.",
        abc: "X:1\nM:4/4\nL:1/8\nQ:1/4=92\nK:C\n.C.E.G.E .C2 z2 | (CEGE C2) z2 |]\nw: ha ha ha ha ha ja _ _ _ _"
      },
      {
        name: "Bis zur oberen 1",
        text: "Sieben kurze Töne, weiter hinauf bis zur oberen 1 und zurück. Mehr Umfang, derselbe leichte Stoß.",
        abc: "X:1\nM:4/4\nL:1/8\nQ:1/4=92\nK:C\n.C.E.G.c .G.E.C2 |]\nw: ha ha ha ha ha ha ha",
        begleitung: {
          art: "muster",
          tonarten: [
            0,
            4
          ],
          tempo: 92
        }
      },
      {
        name: "Lauf",
        text: "Neun schnelle Töne hinauf und wieder hinunter, leise auf „no“, ohne Pause dazwischen. Die Töne perlen, statt einzeln gestoßen zu werden.",
        abc: "X:1\nM:4/4\nL:1/8\nQ:1/4=100\nK:C\n(CDEF GFED | C4) z4 |]\nw: no _ _ _ _ _ _ _ _",
        begleitung: {
          art: "muster",
          tonarten: [
            0,
            7
          ],
          tempo: 100
        }
      }
    ],
    variantenHinweis: "„Bis zur oberen 1“: Tonarten C bis E. „Lauf“: Viertel = 100, Tonarten C bis G."
  },
  {
    id: "lauter-leiser",
    thema: "dynamik",
    titel: "Auf einem Ton lauter und leiser",
    quelle: "D „Lauter und leiser“",
    begleitungText: "ein Ton zwischen d′ und g′, mit Klicks",
    wozu: "Gleichmäßig lauter und leiser werden, ohne dass sich Tonhöhe und Klang ändern.",
    schritte: [
      "Tippe auf „Start“. Die App spielt den Ton kurz vor und zählt vier Klicks vor. Dann singst du. Der Ton klingt leise mit, und die Klicks laufen weiter.",
      "Sing „no“. Werde vier Klicks lang gleichmäßig lauter, dann halte das Laute vier Klicks lang.",
      "Atme schnell, beginne laut und werde vier Klicks lang leiser. Das Leise hältst du noch vier Klicks lang.",
      "Nach jedem Durchgang geht der Ton einen halben Ton höher. Ganz oben kehrt die App um und geht wieder hinunter bis zum Anfang, dann hört sie auf. Mit „Nicht höher“ geht es gleich wieder abwärts, mit „Stopp“ hörst du jederzeit auf."
    ],
    gelingt: "die Lautstärke über alle vier Klicks wächst, nicht erst am Ende, und der Ton laut und leise gleich hoch klingt.",
    fehler: "Beim Leiserwerden fällt der Klang zusammen, und der Ton sinkt.",
    hilft: "Beim Lauterwerden innen Platz machen und diesen Platz beim Leiserwerden behalten. Die Luft strömt weiter, nur weniger.",
    tipp: "Nimm dich mit dem Handy auf. Beim Anhören merkst du, ob du wirklich gleichmäßig lauter und leiser wirst.",
    notenText: "ein Ton, Viertel = 72.",
    abc: "X:1\nM:4/4\nL:1/4\nQ:1/4=72\nK:C\n!p!!<(!F4- | !<)!!f!F4 !breath! | !>(!F4- | !>)!!p!F4 |]\nw: no _ no _",
    begleitung: {
      art: "ton",
      ton: [
        62,
        67
      ],
      tempo: 72
    },
    varianten: [
      {
        name: "In einem Atem",
        text: "Vier Klicks lauter, vier Klicks leiser, dann noch vier Klicks leise halten, alles ohne zu atmen.",
        abc: "X:1\nM:4/4\nL:1/4\nQ:1/4=72\nK:C\n!p!!<(!F2-F2- | !<)!!f!!>(!F2-F2- | !>)!!p!F4 |]\nw: no _ _ _ _"
      },
      {
        name: "Aufwärts leiser, abwärts lauter",
        text: "Die App spielt neun Töne vor, fünf hinauf und wieder hinunter. Aufwärts wirst du leiser, abwärts lauter, also absichtlich anders als gewohnt. So bleiben die hohen Töne leicht. Lauter heißt hier voller, nicht gedrückt.",
        abc: "X:1\nM:4/4\nL:1/4\nQ:1/4=80\nK:C\n!f!!>(!(C D E F | !>)!!p!!<(!G F E D | !<)!!f!C4) |]\nw: no _ _ _ _ _ _ _ _",
        begleitung: {
          art: "muster",
          tonarten: [
            0,
            4
          ],
          tempo: 80
        }
      }
    ],
    variantenHinweis: "„Aufwärts leiser, abwärts lauter“: Viertel = 80, Tonarten C bis E, mit Zuhör-Durchgang wie bei den Mustern."
  },
  {
    id: "langer-ton",
    thema: "sauber",
    titel: "Gegen einen langen Ton",
    quelle: "D „Die eigene Stimme halten“, Grundübung „Gegen einen Halteton“, für eine Person umgebaut",
    begleitungText: "Tonarten C bis E, langer Ton als Orgelton, Klicks; je Tonart erst mit, dann ohne Tonleiter",
    wozu: "Die eigenen Töne sauber treffen, während ein anderer Ton dazu klingt. Das brauchst du im Chor ständig.",
    schritte: [
      "Tippe auf „Start“. Die App spielt einen langen, tiefen Ton und zählt vier Klicks vor. Der lange Ton gibt dir die 1. Mit der 1 beginnst und endest du.",
      "Dann spielt die App die Tonleiter: von der 1 fünf Töne hinauf und wieder hinunter, neun Töne, jeder zwei Klicks lang. Sing mit, auf „no“ oder auf Ziffern, wenn du sie kennst.",
      "Gleich danach kommt dasselbe noch einmal, aber ohne Tonleiter. Der lange Ton und die Klicks bleiben. Du singst die Tonleiter allein und hörst, wie jeder Ton zum langen Ton klingt.",
      "Danach geht es einen halben Ton höher, wieder erst mit und dann ohne Tonleiter. Ganz oben kehrt die App um und geht wieder hinunter bis zum Anfang, dann hört sie auf. Mit „Nicht höher“ geht es gleich wieder abwärts, mit „Stopp“ hörst du jederzeit auf."
    ],
    gelingt: "du jeden Ton triffst und am Ende genau auf dem langen Ton ankommst, sodass beide wie ein Ton klingen.",
    fehler: "Deine Töne werden unterwegs tiefer, oder du landest am Ende neben dem langen Ton statt genau darauf.",
    hilft: "Leiser singen und genauer hinhören. Denk den nächsten Ton, bevor du ihn singst.",
    notenText: "oben deine Linie 1 – 2 – 3 – 4 – 5 – 4 – 3 – 2 – 1, unten der lange Ton eine Oktave tiefer. Viertel = 72. Hinweis für Phase 2: Für Männer läge der lange Ton dann sehr tief, und Handylautsprecher geben sehr tiefe Töne kaum wieder. Für sie klingt er besser auf der Höhe ihrer 1 oder eine Oktave darüber.",
    abc: "X:1\nM:4/4\nL:1/4\nQ:1/4=72\nK:C\nV:1 clef=treble\nC2 D2 | E2 F2 | G2 F2 | E2 D2 | C4 |]\nw: 1 2 3 4 5 4 3 2 1\nV:2 clef=bass\nC,4- | C,4- | C,4- | C,4- | C,4 |]",
    begleitung: {
      art: "halteton",
      tonarten: [
        0,
        4
      ],
      tempo: 72
    },
    varianten: [
      {
        name: "Langer Ton auf der 5",
        text: "Die App spielt zuerst kurz deine 1 und hält dann einen höheren langen Ton, die 5. Du singst dieselbe Tonleiter. Bei der 4 klingen die beiden Töne unruhig zusammen. Bleib trotzdem genau auf deinem Ton.",
        abc: "X:1\nM:4/4\nL:1/4\nQ:1/4=72\nK:C\nV:1 clef=treble\nC2 D2 | E2 F2 | G2 F2 | E2 D2 | C4 |]\nw: 1 2 3 4 5 4 3 2 1\nV:2 clef=bass\nG,4- | G,4- | G,4- | G,4- | G,4 |]",
        begleitung: {
          art: "halteton",
          tonarten: [
            0,
            4
          ],
          tempo: 72,
          ersteEins: true
        }
      }
    ]
  },
  {
    id: "konsonant",
    thema: "text",
    titel: "Konsonant vor den Schlag",
    quelle: "D „Konsonanten gemeinsam“",
    begleitungText: "ein Ton zwischen d′ und g′, mit Klicks",
    wozu: "Der Text wird verständlich, und der Rhythmus bleibt klar.",
    schritte: [
      "Tippe auf „Start“. Die App spielt den Ton kurz vor und zählt vier Klicks vor.",
      "Beim ersten Durchgang sprichst du die Zeile zu den Klicks, auf jeden Klick eine Silbe: Lob – und – Dank – sei – Gott. „Gott“ dauert zwei Klicks, auf den Klick danach kommt das „t“. Die Konsonanten sprichst du übertrieben deutlich.",
      "Ab dem zweiten Durchgang singst du die Zeile auf dem Ton, genauso verteilt. Jeder Konsonant kommt kurz vor dem Klick, der Vokal genau auf den Klick.",
      "Nach jedem Durchgang geht der Ton einen halben Ton höher. Ganz oben kehrt die App um und geht wieder hinunter bis zum Anfang, dann hört sie auf. Mit „Nicht höher“ geht es gleich wieder abwärts, mit „Stopp“ hörst du jederzeit auf."
    ],
    gelingt: "die Vokale genau auf den Klicks liegen und das „t“ am Ende genau auf seinem Klick kommt.",
    fehler: "Die Konsonanten kommen erst auf den Klick, die Vokale rutschen dahinter, und der Rhythmus verschwimmt.",
    hilft: "Die Zeile noch einmal sprechen, die Konsonanten etwas früher.",
    notenText: "fünf Silben auf einem Ton, das „t“ auf Schlag 3 im zweiten Takt. Viertel = 72.",
    abc: "X:1\nM:4/4\nL:1/4\nQ:1/4=72\nK:C\nF F F F | F2 \"^t\"z2 |]\nw: Lob und Dank sei Gott",
    begleitung: {
      art: "ton",
      ton: [
        62,
        67
      ],
      tempo: 72
    },
    varianten: [
      {
        name: "Fünf Töne abwärts",
        text: "Die App spielt fünf Töne abwärts vor, du singst die Zeile darauf, eine Silbe je Ton. Die Konsonanten bleiben so deutlich, auch wenn sich der Ton bewegt.",
        abc: "X:1\nM:4/4\nL:1/4\nQ:1/4=72\nK:C\nG F E D | C2 \"^t\"z2 |]\nw: Lob und Dank sei Gott",
        begleitung: {
          art: "muster",
          tonarten: [
            0,
            4
          ],
          tempo: 72
        }
      },
      {
        name: "Leise, aber deutlich",
        text: "Dieselbe Zeile leise. Die Vokale werden leise, die Konsonanten nicht.",
        abc: "X:1\nM:4/4\nL:1/4\nQ:1/4=72\nK:C\n!p!F F F F | F2 \"^t\"z2 |]\nw: Lob und Dank sei Gott"
      }
    ],
    variantenHinweis: "„Fünf Töne abwärts“: 5 – 4 – 3 – 2 – 1, Tonarten C bis E, mit Zuhör-Durchgang wie bei den Mustern."
  },
  {
    id: "abkuehlen",
    thema: "pflege",
    titel: "Stimme abkühlen",
    quelle: "S „Stimme abkühlen“ (abgenommen)",
    begleitungText: "Tonarten C abwärts bis G darunter",
    wozu: "Nach dem Singen die Stimme ruhig zur Sprechstimme zurückführen. Wie nach einem Lauf: langsam ausgehen, statt plötzlich stehen zu bleiben.",
    schritte: [
      "Tippe auf „Start“ und hör dir das Muster an: kleine Wellen nach unten.",
      "Summe leise auf „m“ mit, leiser als beim Einsingen.",
      "Die App geht jedes Mal einen halben Ton tiefer und hört nach sechs Durchgängen von selbst auf. Sind die Töne schon vorher ungefähr so tief wie deine Sprechstimme, tippe auf „Stopp“. Wie tief deine Sprechstimme ist, hörst du, wenn du einmal ganz entspannt „Hallo, wie geht’s?“ sagst.",
      "Sprich zum Schluss auf dieser Höhe ruhig ein paar Worte."
    ],
    gelingt: "sich deine Sprechstimme danach frei und ruhig anfühlt.",
    fehler: "Zu laut oder mit Anstrengung summen.",
    hilft: "Ganz leise. Es geht ums Lösen, nicht ums Üben.",
    achtung: "Bist du heiser oder tut es weh, summe nur sehr leise oder lass die Übung aus.",
    notenText: "5 – 4 – 5 – 3 – 4 – 2 – 3 – 1, leise auf „m“, Viertel = 66.",
    abc: "X:1\nM:4/4\nL:1/4\nQ:1/4=66\nK:C\n!p!(G F G E | F D E2 | C4) |]\nw: m _ _ _ _ _ _ _",
    begleitung: {
      art: "muster",
      tonarten: [
        0,
        -5
      ],
      tempo: 66
    },
    varianten: [
      {
        name: "Auf „wu“",
        text: "dieselben Wellen auf „wu“."
      },
      {
        name: "Seufzer",
        text: "Beginne auf einem bequemen, mittleren Ton und lass ihn als leisen Seufzer auf „hm“ nach unten sinken, ohne Begleitung.",
        begleitung: {
          art: "keine"
        }
      }
    ]
  }
];

export const ERKLAERUNGEN = [
  {
    id: "atem-stuetze",
    titel: "Atem und Stütze",
    quelle: "S „Zwerchfell und Stütze“, D Themenseite „Atem“",
    passtZu: [
      "flanken",
      "ausatmen"
    ],
    kurz: "Singen ist langsames Ausatmen. Stütze heißt, die Weite vom Einatmen zu halten und die Luft langsam abzugeben, nicht, sie herauszudrücken.",
    absaetze: [
      "Beim Einatmen zieht sich das Zwerchfell nach unten. Das ist ein Muskel, der wie eine Kuppel unter der Lunge liegt. Bauch, Seiten und Rücken werden weit. Das Zwerchfell selbst spürst du nicht, nur diese Weite.",
      "Beim Singen lässt du die Weite nur langsam los. Seiten und Rücken bleiben weit, der Brustkorb sinkt nicht ein. So strömt die Luft gleichmäßig, und sie reicht länger.",
      "Stütze ist kein Drücken. Wer den Bauch anspannt und die Luft herauspresst, macht den Ton eng.",
      "„Tief Luft holen“ führt oft zu hochgezogenen Schultern und zu viel Luft. Besser: den Bauch loslassen, dann kommt die Luft von selbst."
    ]
  },
  {
    id: "brust-kopf",
    titel: "Brust- und Kopfstimme",
    quelle: "S „Brust- und Kopfstimme“",
    passtZu: [
      "abwaerts",
      "sirene"
    ],
    kurz: "Jede Stimme hat einen vollen Klang für die Tiefe und einen leichten für die Höhe. In der Mitte mischen sich beide.",
    absaetze: [
      "Die Bruststimme ist der Klang, mit dem wir sprechen: voll und kräftig, in der Tiefe zu Hause. Die Kopfstimme ist leicht und schlank und trägt in die Höhe. Beide reichen ein Stück in die Mitte hinein.",
      "Wer mit der Bruststimme immer weiter nach oben drückt, wird lauter und enger, bis die Stimme umkippt. Besser ist eine gemischte Stimme: je höher, desto mehr Kopfstimme, je tiefer, desto mehr Bruststimme, ohne Bruch dazwischen. Deshalb lohnt es sich, oben leicht zu beginnen und diese Leichtigkeit nach unten mitzunehmen."
    ]
  },
  {
    id: "aufrecht",
    titel: "Aufrecht, ohne steif zu werden",
    quelle: "D Themenseite „Körper und Haltung“, S „Aufrichten“",
    passtZu: [
      "nacken",
      "singhaltung"
    ],
    kurz: "Dein Körper ist dein Instrument. Aufrecht und beweglich hat der Atem Platz, steif nimmt man ihm den Platz.",
    absaetze: [
      "Spannung in Nacken, Schultern und Kiefer überträgt sich auf den Hals. Der Ton wird eng, und die Stimme ermüdet schnell. Deshalb steht das Lockern am Anfang. Ein bis zwei Minuten genügen.",
      "„Steh gerade!“ macht steif: Brust heraus, Schultern zurück, Knie durchgedrückt. Besser ist: nach oben wachsen, als zöge dich ein Faden am Scheitel, und die Schultern hängen lassen. Von der Seite gesehen liegen Ohr, Schulter, Hüfte und Knöchel dann ungefähr auf einer Linie."
    ]
  },
  {
    id: "zu-hause",
    titel: "So übst du zu Hause",
    quelle: "S „Zu Hause üben“, für die App ergänzt",
    kurz: "Kurz und oft üben bringt mehr als selten und lang.",
    absaetze: [
      "Zehn Minuten an mehreren Tagen bringen mehr als eine Stunde am Abend vor der Probe. Am besten immer gleich: kurz lockern und atmen, die Stimme einsingen, dann eine Stelle üben. Der Ablauf „Einsingen zu Hause“ führt dich durch den Anfang.",
      "Bei einem Lied nicht immer von vorn beginnen, sondern die zwei oder drei Stellen üben, die in der Probe unsicher waren. Erst den Rhythmus, dann die Töne, dann mit Text.",
      "Unter „Chorlieder üben“ hörst du zuerst deine Stimme laut und singst mit. Dann hörst du die anderen Stimmen und hältst deine Stimme dazu.",
      "Sich selbst mit dem Handy aufnehmen und anhören zeigt, was man beim Singen nicht hört."
    ]
  },
  {
    id: "pflege",
    titel: "Die Stimme pflegen",
    quelle: "S „Die Stimme pflegen“ (Entwurf)",
    quellen: "Quellen dort: Medical Voice Center Hamburg, Merkblatt Stimmhygiene; Jennie Weyman, „How to Self-Assess Your Vocal Health“ (Chorus Connection)",
    kurz: "Die Stimme bleibt gesund, wenn du sie feucht hältst, nicht gegen Lärm anredest und ihr Pausen gönnst.",
    absaetze: [
      "Trink über den Tag verteilt genug. Die Stimmlippen brauchen eine feuchte Schleimhaut. Trockene und verrauchte Räume schaden ihr.",
      "Räuspere dich nicht. Häufiges Räuspern reizt die Stimmlippen. Besser einen Schluck Wasser trinken, schlucken oder leise summen.",
      "Rede nicht gegen Lärm an und flüstere nicht gepresst. Beides strengt die Stimme mehr an als ruhiges Sprechen.",
      "Plane Pausen ein. Als Faustregel: etwa zehn Minuten Ruhe nach anderthalb Stunden Stimmgebrauch. Nach dem Singen hilft der Ablauf „Nach dem Singen“."
    ]
  },
  {
    id: "muede",
    titel: "Wenn die Stimme müde wird",
    quelle: "S „Wenn die Stimme müde wird“ (Entwurf)",
    quellen: "Quellen dort: Jennie Weyman (Chorus Connection); Mary J. Sandage und Mariah E. Morton-Jones, Choral Journal 65/2 (2024)",
    kurz: "Kostet das Singen spürbar Kraft, ist es Zeit, leiser zu singen oder eine Pause zu machen, nicht, mehr zu drücken.",
    absaetze: [
      "Zeichen einer müden Stimme sind ein rauer oder hauchiger Klang, hohe Töne, die nicht mehr leicht gehen, leises Singen, das nicht mehr gelingt, ein Kloß- oder Engegefühl im Hals und der Drang, sich ständig zu räuspern.",
      "Dann leiser und leichter singen, schwierige Stellen nur in Gedanken mitsingen, ohne Ton, oder eine Pause machen. Durchdrücken schadet.",
      "Ein einfacher Test: mit flatternden Lippen von tief nach hoch gleiten. Geht das nicht frei, schone die Stimme.",
      "Hält Heiserkeit länger als einige Wochen an, gehört sie zum Arzt, am besten zum HNO-Arzt."
    ]
  },
  {
    id: "deutsch",
    titel: "Deutsch singen",
    quelle: "S „Deutsch singen“",
    quellen: "Quelle dort: Lindsey Christiansen, „Pitfalls for Americans Singing German“, Westminster Choir College",
    kurz: "Deutsch klingt im Gesang klar, wenn die Endsilben leicht bleiben, das R sauber sitzt und neue Wörter neu beginnen.",
    absaetze: [
      "Endsilben wie -e, -en, -el und -er sind kurz und leicht. Ihr „e“ ist ein schwacher Laut, nie ein betontes „ä“. Auf einem langen Ton bleibst du auf dem betonten Vokal, die Endsilbe kommt kurz am Schluss. Ein Beispiel: Liegt „Lie-be“ auf einem langen Ton, bleibst du lange auf dem „ie“, und „-be“ kommt erst ganz am Ende.",
      "Das R am Anfang einer Silbe schlägst du mit der Zungenspitze kurz an oder rollst es. Dann trägt es und ist verständlich. In der Endung -er deutest du es nur an.",
      "Beginnt ein Wort mit einem Vokal, setzt es neu an: „und ich“ wird nicht zu „undich“. Der neue Beginn ist weich, nicht gestoßen.",
      "„ch“ klingt nach a, o und u dunkel wie in „Nacht“, sonst hell wie in „ich“, nie wie „sch“ oder „k“.",
      "Konsonanten kommen kurz vor dem Schlag, damit der Vokal pünktlich ist (Übung „Konsonant vor den Schlag“)."
    ]
  }
];

// Abläufe (Daniel, 27.11.2026: Beide soll es geben). Aufbau: Vorschlag von Claude.
// Je Schritt wählt die App reihum eine der Möglichkeiten (wahl), von Mal zu Mal die nächste.
// strohhalm: true heißt, die Möglichkeit gibt es nur, wenn in den Einstellungen „Ich habe einen Strohhalm“ an ist.
export const ABLAEUFE = [
  {
    id: 'einsingen',
    titel: 'Einsingen zu Hause',
    kurz: 'Etwa fünf Minuten. Die App führt dich durch fünf Übungen. Mit „Weiter“ kommst du zur nächsten.',
    schritte: [
      { name: 'Körper', wahl: [{ uebung: 'nacken' }, { uebung: 'nacken', variante: 0 }, { uebung: 'nacken', variante: 1 }] },
      { name: 'Atem', wahl: [{ uebung: 'flanken' }, { uebung: 'ausatmen' }, { uebung: 'stoesse' }] },
      { name: 'Stimme in Gang bringen', wahl: [{ uebung: 'summen' }, { uebung: 'flattern' }, { uebung: 'strohhalm', strohhalm: true }] },
      { name: 'Von oben', wahl: [{ uebung: 'abwaerts' }, { uebung: 'abwaerts', variante: 0 }] },
      { name: 'Klang oder Beweglichkeit', wahl: [{ uebung: 'vokalreihe' }, { uebung: 'kurze-ha' }] },
    ],
  },
  {
    id: 'nachher',
    titel: 'Nach dem Singen',
    kurz: 'Etwa drei Minuten, nach der Probe oder nach langem Singen.',
    schritte: [
      { name: 'Stimme abkühlen', wahl: [{ uebung: 'abkuehlen' }] },
      { name: 'Strohhalm', wahl: [{ uebung: 'strohhalm', variante: 1, strohhalm: true }] },
    ],
    schluss: 'Sprich jetzt ruhig weiter, nicht flüsternd und nicht laut, und trink etwas.',
  },
];
