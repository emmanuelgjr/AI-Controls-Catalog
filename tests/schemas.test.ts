import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { controlSchema, frameworkSchema } from '../src/content/schemas';

const controlsDir = join(__dirname, '../src/content/controls');
const frameworksDir = join(__dirname, '../src/content/frameworks');

describe('control schemas', () => {
  const files = readdirSync(controlsDir).filter((f) => f.endsWith('.json'));
  it('has at least 20 controls', () => {
    expect(files.length).toBeGreaterThanOrEqual(20);
  });
  for (const file of files) {
    it(`${file} validates`, () => {
      const raw = JSON.parse(readFileSync(join(controlsDir, file), 'utf8'));
      expect(() => controlSchema.parse(raw)).not.toThrow();
    });
  }
  it('all IDs are unique', () => {
    const ids = files.map((f) =>
      (JSON.parse(readFileSync(join(controlsDir, f), 'utf8')) as { id: string }).id,
    );
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('framework schemas', () => {
  const files = readdirSync(frameworksDir).filter((f) => f.endsWith('.json'));
  it('has at least 8 frameworks', () => {
    expect(files.length).toBeGreaterThanOrEqual(8);
  });
  for (const file of files) {
    it(`${file} validates`, () => {
      const raw = JSON.parse(readFileSync(join(frameworksDir, file), 'utf8'));
      expect(() => frameworkSchema.parse(raw)).not.toThrow();
    });
  }
});
