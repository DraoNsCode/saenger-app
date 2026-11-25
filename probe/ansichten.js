// Probe zu Baustein B, Teil 1: lädt die drei Bilder in die Seite und schaltet ihre Ebenen um.

async function ladeBild(kasten) {
  const antwort = await fetch(kasten.dataset.bild);
  if (!antwort.ok) throw new Error(`${kasten.dataset.bild}: ${antwort.status}`);
  const text = await antwort.text();
  const svg = new DOMParser().parseFromString(text, 'image/svg+xml').documentElement;
  if (svg.nodeName !== 'svg') throw new Error(`${kasten.dataset.bild}: kein gültiges SVG`);
  kasten.replaceChildren(document.importNode(svg, true));
  const kb = Math.round(new Blob([text]).size / 1024);
  const teile = kasten.querySelectorAll('svg *').length;
  kasten.closest('.ansicht').querySelector('.mass').textContent = `${kb} KB, ${teile} Elemente`;
}

document.querySelectorAll('.bild').forEach((kasten) => {
  ladeBild(kasten).catch((fehler) => {
    const hinweis = document.createElement('p');
    hinweis.className = 'bild-fehler';
    hinweis.textContent = `Das Bild lässt sich nicht laden (${fehler.message}). Die Seite braucht einen lokalen Server, siehe README.md.`;
    kasten.replaceChildren(hinweis);
  });
});

const schalter = document.querySelector('.schalter');

// Der Browser merkt sich beim Neuladen die Auswahl, deshalb auch beim Start übernehmen
function uebernehmen() {
  for (const [name, wert] of new FormData(schalter)) document.body.dataset[name] = wert;
}
schalter.addEventListener('change', uebernehmen);
uebernehmen();
