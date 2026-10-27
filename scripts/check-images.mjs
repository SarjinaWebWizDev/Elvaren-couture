// Verifies every product record points at a real file in public/images/products/.
// Usage: npm run check:images
import { existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { products, IMAGE_BASE } from '../src/data/products.js';
import { photos } from '../src/data/editorial.js';
import { collections } from '../src/data/collections.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
const dir = join(root, IMAGE_BASE);
const missing = [];

for (const p of products) {
  for (const src of p.images) {
    if (!existsSync(join(root, src))) missing.push(src.split('/').pop());
  }
}

const referenced = new Set(products.flatMap((p) => p.images.map((s) => s.split('/').pop())));
const extra = existsSync(dir) ? readdirSync(dir).filter((f) => !referenced.has(f)) : [];

console.log(`Products: ${products.length}`);
console.log(`Referenced images: ${referenced.size}`);
if (missing.length) {
  console.error('MISSING image files (exact filenames):');
  missing.forEach((f) => console.error('  - ' + f));
  process.exit(1);
}
if (extra.length) console.warn('Unreferenced files in folder:', extra.join(', '));
const missingEd = photos.filter((x) => !existsSync(join(root, x.src))).map((x) => x.file);
if (missingEd.length) {
  console.error('MISSING editorial files:', missingEd.join(', '));
  process.exit(1);
}
const missingCov = collections.filter((c) => !c.cover || !existsSync(join(root, c.cover.src))).map((c) => c.id);
if (missingCov.length) {
  console.error('MISSING collection covers:', missingCov.join(', '));
  process.exit(1);
}
console.log(`Collection covers: ${collections.length}, all present.`);
console.log(`Editorial photos: ${photos.length}, all present.`);
console.log('All product images exist.');
