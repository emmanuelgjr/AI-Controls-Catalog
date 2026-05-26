import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { scoreControls, type ScopeSelections } from '../src/lib/scoping';
import { controlSchema } from '../src/content/schemas';
import type { Control } from '../src/content/schemas';

const controlsDir = join(__dirname, '../src/content/controls');
const controls: Control[] = readdirSync(controlsDir)
  .filter((f) => f.endsWith('.json'))
  .map((f) => controlSchema.parse(JSON.parse(readFileSync(join(controlsDir, f), 'utf-8'))));

const fullSelections: ScopeSelections = {
  aiTypes: ['LLM', 'Agentic AI', 'Traditional ML', 'Computer Vision', 'Generative AI', 'Multi-modal', 'Recommender', 'Speech'],
  deploymentModels: ['SaaS', 'Self-hosted', 'Hybrid', 'Edge', 'Embedded'],
  companySize: ['Enterprise'],
  regulatoryRegimes: ['EU AI Act', 'ISO 42001', 'NIST AI RMF'],
  lifecycleStages: ['Strategy & Planning', 'Data Sourcing & Preparation', 'Training', 'Evaluation & Testing', 'Deployment', 'Operation & Monitoring', 'Retirement'],
  riskDomains: ['Data', 'Model', 'Infrastructure', 'Governance', 'People & Process', 'Third Party'],
};

describe('scoreControls', () => {
  it('returns a result for every control', () => {
    const results = scoreControls(controls, fullSelections);
    expect(results).toHaveLength(controls.length);
  });

  it('scores are between 0 and 100', () => {
    const results = scoreControls(controls, fullSelections);
    for (const r of results) {
      expect(r.score).toBeGreaterThanOrEqual(0);
      expect(r.score).toBeLessThanOrEqual(100);
    }
  });

  it('all controls are highly recommended when all options selected', () => {
    const results = scoreControls(controls, fullSelections);
    const outOfScope = results.filter((r) => r.tier === 'out-of-scope');
    expect(outOfScope).toHaveLength(0);
  });

  it('empty selections give maximum scores (skip = match-all)', () => {
    const empty: ScopeSelections = {
      aiTypes: [],
      deploymentModels: [],
      companySize: [],
      regulatoryRegimes: [],
      lifecycleStages: [],
      riskDomains: [],
    };
    const results = scoreControls(controls, empty);
    for (const r of results) {
      expect(r.score).toBe(100);
    }
  });

  it('narrow selections filter out some controls', () => {
    const narrow: ScopeSelections = {
      aiTypes: ['Speech'],
      deploymentModels: ['Embedded'],
      companySize: ['SMB'],
      regulatoryRegimes: ['NYDFS 500'],
      lifecycleStages: ['Retirement'],
      riskDomains: ['Infrastructure'],
    };
    const results = scoreControls(controls, narrow);
    const recommended = results.filter((r) => r.tier !== 'out-of-scope');
    expect(recommended.length).toBeLessThan(controls.length);
  });

  it('results are sorted by score descending', () => {
    const results = scoreControls(controls, fullSelections);
    for (let i = 1; i < results.length; i++) {
      expect(results[i].score).toBeLessThanOrEqual(results[i - 1].score);
    }
  });

  it('each result has a valid phase 1-4', () => {
    const results = scoreControls(controls, fullSelections);
    for (const r of results) {
      expect(r.phase).toBeGreaterThanOrEqual(1);
      expect(r.phase).toBeLessThanOrEqual(4);
    }
  });

  it('matched dimensions list is non-empty for scored controls', () => {
    const results = scoreControls(controls, fullSelections);
    const scored = results.filter((r) => r.score > 0);
    for (const r of scored) {
      expect(r.matchedDimensions.length).toBeGreaterThan(0);
    }
  });
});
