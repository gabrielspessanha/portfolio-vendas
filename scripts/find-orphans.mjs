import fs from 'fs';
import path from 'path';

function walk(d, a = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, a); else a.push(p);
  }
  return a;
}

// Concatena todo o código-fonte
let blob = '';
for (const f of walk('src')) {
  if (/\.(ts|html|scss|css|json)$/i.test(f)) blob += fs.readFileSync(f, 'utf8') + '\n';
}
// Normaliza: remove escapes de aspas (\' \") e decodifica %XX (inclusive multibyte)
blob = blob.replace(/\\(['"])/g, '$1');
blob = blob.replace(/(%[0-9A-Fa-f]{2})+/g, (m) => { try { return decodeURIComponent(m); } catch { return m; } });
const low = blob.toLowerCase();

const imgs = [...walk('public/images'), ...walk('public/assets/images')]
  .filter((f) => /\.(png|jpe?g)$/i.test(f));

let orphans = [], bytes = 0;
for (const f of imgs) {
  const b = path.basename(f).toLowerCase();
  if (!low.includes(b)) { const s = fs.statSync(f).size; orphans.push([s, f]); bytes += s; }
}
orphans.sort((a, b) => b[0] - a[0]);
console.log(`total: ${imgs.length} | ORFAS: ${orphans.length} | ${(bytes / 1048576).toFixed(1)} MB\n`);
for (const [s, f] of orphans) console.log(`${(s / 1048576).toFixed(2).padStart(6)} MB  ${f}`);
