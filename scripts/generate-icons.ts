/**
 * generate-icons.ts
 * Generates the PWA icon set into public/icons/ using sharp
 * (already present transitively via Astro's image pipeline).
 *
 * Usage:  npx tsx scripts/generate-icons.ts
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ACCENT = '#0F766E';
const LETTER = 'C';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'public', 'icons');
mkdirSync(outDir, { recursive: true });

// Simple letterform mark on the repo accent — deliberately plain, no imagery.
function iconSvg(size: number, opts: { maskable: boolean }): string {
  const radius = opts.maskable ? 0 : Math.round(size * 0.21);
  // Maskable icons keep the glyph inside the central safe zone (~60%).
  const fontSize = Math.round(size * (opts.maskable ? 0.42 : 0.54));
  const y = Math.round(size / 2 + fontSize * 0.355);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${radius}" fill="${ACCENT}"/>
  <text x="50%" y="${y}" text-anchor="middle" font-family="Inter, 'Segoe UI', Arial, sans-serif" font-weight="700" font-size="${fontSize}" fill="#FFFFFF">${LETTER}</text>
</svg>`;
}

async function main() {
  const targets: Array<{ file: string; size: number; maskable: boolean }> = [
    { file: 'icon-192.png', size: 192, maskable: false },
    { file: 'icon-512.png', size: 512, maskable: false },
    { file: 'icon-maskable-192.png', size: 192, maskable: true },
    { file: 'icon-maskable-512.png', size: 512, maskable: true },
  ];
  for (const t of targets) {
    const png = await sharp(Buffer.from(iconSvg(t.size, { maskable: t.maskable })))
      .png()
      .toBuffer();
    writeFileSync(join(outDir, t.file), png);
    console.log(`  ✓ ${t.file}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
