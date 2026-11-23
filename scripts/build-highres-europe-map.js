const fs = require('fs');

const sourcePath = 'dist/data/europe-game-countries-10m.geojson';
const sourceUrl = 'https://gisco-services.ec.europa.eu/distribution/v2/countries/geojson/CNTR_RG_10M_2024_4326.geojson';
const outputPath = 'dist/country-highres-map.js';
const wanted = new Set('AD AL AM AT AZ BA BE BG BY CH CY CZ DE DK EE EL ES FI FR GE HR HU IE IS IT KZ LI LT LU LV MC MD ME MK MT NL NO PL PT RO RS RU SE SI SK SM TR UA UK VA'.split(' '));
const bounds = { west: -25.5, south: 33.5, east: 52.5, north: 72.5 };
const size = { width: 1100, height: 1010 };

if (!fs.existsSync(sourcePath)) throw new Error(`A generáláshoz töltsd le ezt a fájlt a ${sourcePath} útvonalra: ${sourceUrl}`);
const data = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

function clipEdge(points, inside, intersect) {
  if (!points.length) return [];
  const output = [];
  let previous = points[points.length - 1];
  let previousInside = inside(previous);
  for (const point of points) {
    const pointInside = inside(point);
    if (pointInside !== previousInside) output.push(intersect(previous, point));
    if (pointInside) output.push(point);
    previous = point;
    previousInside = pointInside;
  }
  return output;
}

function clipRing(ring) {
  let points = ring.length > 1 && ring[0][0] === ring.at(-1)[0] && ring[0][1] === ring.at(-1)[1] ? ring.slice(0, -1) : ring.slice();
  points = clipEdge(points, p => p[0] >= bounds.west, (a, b) => [bounds.west, a[1] + (b[1] - a[1]) * (bounds.west - a[0]) / (b[0] - a[0])]);
  points = clipEdge(points, p => p[0] <= bounds.east, (a, b) => [bounds.east, a[1] + (b[1] - a[1]) * (bounds.east - a[0]) / (b[0] - a[0])]);
  points = clipEdge(points, p => p[1] >= bounds.south, (a, b) => [a[0] + (b[0] - a[0]) * (bounds.south - a[1]) / (b[1] - a[1]), bounds.south]);
  points = clipEdge(points, p => p[1] <= bounds.north, (a, b) => [a[0] + (b[0] - a[0]) * (bounds.north - a[1]) / (b[1] - a[1]), bounds.north]);
  return points;
}

const radians = degrees => degrees * Math.PI / 180;
const mercatorY = latitude => Math.log(Math.tan(Math.PI / 4 + radians(latitude) / 2));
const northY = mercatorY(bounds.north);
const southY = mercatorY(bounds.south);

function project([longitude, latitude]) {
  const x = (longitude - bounds.west) / (bounds.east - bounds.west) * size.width;
  const y = (northY - mercatorY(latitude)) / (northY - southY) * size.height;
  return [Math.round(x * 100) / 100, Math.round(y * 100) / 100];
}

function ringPath(ring) {
  const clipped = clipRing(ring);
  if (clipped.length < 3) return '';
  const projected = clipped.map(project).filter((point, index, points) => !index || point[0] !== points[index - 1][0] || point[1] !== points[index - 1][1]);
  if (projected.length < 3) return '';
  return `M${projected.map(point => `${point[0]} ${point[1]}`).join('L')}Z`;
}

function geometryPath(geometry) {
  const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
  return polygons.flatMap(polygon => polygon.map(ringPath)).filter(Boolean).join('');
}

const paths = data.features
  .filter(feature => wanted.has(feature.properties.CNTR_ID))
  .map(feature => ({ code: feature.properties.CNTR_ID, path: geometryPath(feature.geometry) }))
  .filter(feature => feature.path)
  .sort((left, right) => left.code.localeCompare(right.code))
  .map(feature => `<path id="map-${feature.code}" data-country="${feature.code}" class="country-path" fill-rule="evenodd" d="${feature.path}"/>`);

const found = new Set(paths.map(path => path.match(/data-country="([A-Z]+)"/)[1]));
const missing = [...wanted].filter(code => !found.has(code));
if (missing.length) throw new Error(`Hiányzó országgeometria: ${missing.join(', ')}`);

const map = { viewBox: `0 0 ${size.width} ${size.height}`, markup: paths.join('') };
fs.writeFileSync(outputPath, `window.EuropeSvgMap=${JSON.stringify(map)};\n`);
console.log(`Elkészült: ${outputPath}`);
console.log(`Országok: ${paths.length}; méret: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`);
