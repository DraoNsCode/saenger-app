// Abzeichen als kleine Bilder (SVG)

const METALL = {
  bronze: ['#B7773F', '#8A5428'],
  silber: ['#B5BDC9', '#7E8899'],
  gold: ['#D4AF37', '#9C7A12'],
  tinte: ['#2B3D63', '#15233F'],
};

function svg(inhalt, groesse) {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 64 64');
  s.setAttribute('width', groesse);
  s.setAttribute('height', groesse);
  s.setAttribute('aria-hidden', 'true');
  s.innerHTML = inhalt;
  return s;
}

export function medaille(a, groesse = 56) {
  const an = a.erreicht;
  let farbe = METALL.tinte;
  if (a.metall) farbe = METALL[a.metall];
  else if (a.gruppe === 'weg') farbe = METALL.gold;
  const [hell, dunkel] = farbe;
  const fuell = an ? hell : '#E4E8EF';
  const rand = an ? dunkel : '#B3BDCD';
  const zeichen = an ? '#FFFFFF' : '#98A3B6';
  let mitte = '';
  if (a.gruppe === 'themen') {
    mitte = `<text x="32" y="40.5" text-anchor="middle" font-family="EB Garamond, Georgia, serif" font-size="25" font-weight="600" fill="${zeichen}">${a.etappe}</text>`;
  } else if (a.gruppe === 'weg' && a.etappe) {
    mitte = `<path d="M24 46V18" stroke="${zeichen}" stroke-width="3" stroke-linecap="round"/><path d="M25.5 19h15l-4 6 4 6h-15z" fill="${zeichen}"/>`;
  } else if (a.gruppe === 'weg') {
    mitte = `<path d="M20 20h24v8a12 12 0 0 1-24 0z" fill="${zeichen}"/><path d="M26 42h12M32 40v-3" stroke="${zeichen}" stroke-width="3" stroke-linecap="round"/>`;
  } else if (a.gruppe === 'dranbleiben') {
    mitte = `<text x="32" y="${a.zahl >= 100 ? 39 : 40.5}" text-anchor="middle" font-family="Atkinson Hyperlegible, sans-serif" font-size="${a.zahl >= 100 ? 18 : 22}" font-weight="700" fill="${zeichen}">${a.zahl}</text>`;
  } else if (a.gruppe === 'fehlerfrei') {
    mitte = `<path d="M32 17l4.4 9 9.9 1.4-7.2 7 1.7 9.8L32 39.6l-8.8 4.6 1.7-9.8-7.2-7 9.9-1.4z" fill="${zeichen}"/>`;
    if (a.zahl > 1) mitte += `<text x="32" y="56" text-anchor="middle" font-family="Atkinson Hyperlegible, sans-serif" font-size="9" font-weight="700" fill="${zeichen}">${a.zahl}</text>`;
  }
  return svg(
    `<circle cx="32" cy="32" r="29" fill="${fuell}" stroke="${rand}" stroke-width="3"/>` +
      `<circle cx="32" cy="32" r="22.5" fill="none" stroke="${an ? 'rgba(255,255,255,.45)' : '#CBD3DF'}" stroke-width="1.4"/>` +
      mitte,
    groesse
  );
}
