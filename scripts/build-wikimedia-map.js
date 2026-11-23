const fs = require('fs');

const source = fs.readFileSync('dist/data/europe-iso-map.svg', 'utf8');
const aliases = { gb: 'UK', gr: 'EL', ew: 'EE', xk: 'XK' };
const wanted = new Set('AD AL AT BA BE BG BY CH CY CZ DE DK EE EL ES FI FR GE HR HU IE IS IT LI LT LU LV MC MD ME MK MT NL NO PL PT RO RS RU SE SI SK SM TR UA UK VA XK'.split(' '));
const paths = [];

for (const match of source.matchAll(/<path\b[^>]*\/>/g)) {
  const raw = match[0];
  const id = raw.match(/\bid="([^"]+)"/)?.[1];
  const code = aliases[id] || id?.toUpperCase();
  if (!wanted.has(code)) continue;

  const evenOdd = /fill-rule:evenodd/.test(raw);
  let clean = raw
    .replace(/\sstyle="[^"]*"/, '')
    .replace(/\sid="[^"]+"/, ` id="map-${code}" data-country="${code}" class="country-path"`);
  if (evenOdd) clean = clean.replace('/>', ' fill-rule="evenodd"/>');
  paths.push(clean);
}

const data = {
  viewBox: '0 0 646.36719 654.76562',
  markup: paths.join('')
};

fs.writeFileSync('dist/country-wikimedia-map.js', `window.EuropeSvgMap=${JSON.stringify(data)};`);
const ids = paths.map(path => path.match(/data-country="([^"]+)/)[1]);
const missing = [...wanted].filter(code => !ids.includes(code));

console.log(`Országok: ${paths.length}`);
console.log(`Méret: ${fs.statSync('dist/country-wikimedia-map.js').size} bájt`);
console.log(`Hiányzik: ${missing.join(',') || 'nincs'}`);
