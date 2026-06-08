import fs from 'fs';
import path from 'path';

function walk(d, a = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, a); else a.push(p);
  }
  return a;
}
let blob = '';
for (const f of walk('src')) if (/\.(ts|html|scss|css|json)$/i.test(f)) blob += fs.readFileSync(f, 'utf8') + '\n';
blob = blob.replace(/\\(['"])/g, '$1').replace(/(%[0-9A-Fa-f]{2})+/g, (m) => { try { return decodeURIComponent(m); } catch { return m; } });
const low = blob.toLowerCase();

const imgs = [...walk('public/images'), ...walk('public/assets/images')].filter((f) => /\.(png|jpe?g)$/i.test(f));
const used = imgs.filter((f) => low.includes(path.basename(f).toLowerCase()));
const orphan = imgs.filter((f) => !low.includes(path.basename(f).toLowerCase()));

const usedJpeg = used.filter((f) => /\.jpe?g$/i.test(f));
const orphanBase = new Set(orphan.map((f) => path.basename(f).toLowerCase()));
const collisions = usedJpeg.filter((f) => orphanBase.has(path.basename(f).toLowerCase()));

const names = [...new Set(usedJpeg.map((f) => path.basename(f)))];
fs.writeFileSync('scripts/used-basenames.txt', names.join('\n'), 'utf8');
console.log(`JPEGs em uso: ${usedJpeg.length} | basenames unicos: ${names.length}`);
console.log(`Colisoes de nome com orfaos: ${collisions.length}`);
if (collisions.length) collisions.forEach((c) => console.log('  COLISAO: ' + c));
