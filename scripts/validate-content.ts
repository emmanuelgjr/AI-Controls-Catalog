import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { controlSchema, frameworkSchema } from '../src/content/config.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');

let failed = 0;
let passed = 0;

const validateDir = (dir: string, label: string, schema: { parse: (x: unknown) => unknown }) => {
  const full = join(repoRoot, dir);
  const files = readdirSync(full).filter((f) => f.endsWith('.json'));
  for (const file of files) {
    try {
      const raw = JSON.parse(readFileSync(join(full, file), 'utf8'));
      schema.parse(raw);
      passed++;
    } catch (e) {
      failed++;
      console.error(`✗ ${label}/${file}`);
      console.error(`  ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  console.log(`${label}: ${files.length} files checked.`);
};

validateDir('src/content/controls', 'controls', controlSchema);
validateDir('src/content/frameworks', 'frameworks', frameworkSchema);

console.log(`\n${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
