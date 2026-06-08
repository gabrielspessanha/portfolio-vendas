import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

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
let total = 0; used.forEach((f) => total += fs.statSync(f).size);
console.log(`USADAS: ${used.length} | ${(total / 1048576).toFixed(1)} MB total`);
const png = used.filter((f) => /\.png$/i.test(f));
let pngB = 0; png.forEach((f) => pngB += fs.statSync(f).size);
console.log(`  PNG usadas: ${png.length} | ${(pngB / 1048576).toFixed(1)} MB`);
const arr = used.map((f) => [fs.statSync(f).size, f]).sort((a, b) => b[0] - a[0]).slice(0, 15);
console.log('\nTop 15 usadas:');
for (const [s, f] of arr) console.log(`${(s / 1048576).toFixed(2).padStart(6)} MB  ${f}`);
