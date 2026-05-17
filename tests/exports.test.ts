import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { csvExport } from '../src/lib/exports/csv';
import { pdfExportSingle } from '../src/lib/exports/pdf';
import { filterControls, emptyFilterState } from '../src/lib/filters';
import { searchControls } from '../src/lib/search';
import type { Control } from '../src/content/config';

const controlsDir = join(__dirname, '../src/content/controls');
const controls: Control[] = readdirSync(controlsDir)
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(join(controlsDir, f), 'utf8')));

describe('CSV export', () => {
  it('produces non-empty CSV with header row and N rows', () => {
    const csv = csvExport(controls);
    expect(csv).toMatch(/^id,title,version,category/);
    const rows = csv.split('\n').filter(Boolean);
    expect(rows.length).toBe(controls.length + 1);
  });
});

describe('PDF export', () => {
  it('produces a non-empty Blob for a single control', () => {
    const c = controls[0]!;
    const blob = pdfExportSingle(c);
    expect(blob).toBeDefined();
    expect(blob.size).toBeGreaterThan(1000);
  });
});

describe('filterControls', () => {
  it('returns all controls when state is empty', () => {
    expect(filterControls(controls, emptyFilterState()).length).toBe(controls.length);
  });
  it('filters by category', () => {
    const out = filterControls(controls, { ...emptyFilterState(), categories: ['Governance'] });
    expect(out.length).toBeGreaterThan(0);
    expect(out.every((c) => c.category === 'Governance')).toBe(true);
  });
  it('filters by framework', () => {
    const out = filterControls(controls, { ...emptyFilterState(), frameworks: ['eu_ai_act'] });
    expect(out.length).toBeGreaterThan(0);
    expect(
      out.every((c) => (c.framework_mappings.eu_ai_act ?? []).length > 0),
    ).toBe(true);
  });
  it('filters by lifecycle stage', () => {
    const out = filterControls(controls, {
      ...emptyFilterState(),
      lifecycle: ['Training'],
    });
    expect(out.every((c) => c.lifecycle_stage.includes('Training' as any))).toBe(true);
  });
});

describe('searchControls', () => {
  it('returns all when query empty', () => {
    expect(searchControls(controls, '').length).toBe(controls.length);
  });
  it('finds a control by ID', () => {
    const out = searchControls(controls, 'AI-CTRL-001');
    expect(out[0]?.id).toBe('AI-CTRL-001');
  });
  it('finds controls by keyword', () => {
    const out = searchControls(controls, 'inventory');
    expect(out.some((c) => c.id === 'AI-CTRL-001')).toBe(true);
  });
});
