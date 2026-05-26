import { useMemo, useState } from 'react';
import { Search, X, Download, FileText } from 'lucide-react';
import Fuse from 'fuse.js';
import type { Control } from '../content/config';
import { filterControls, emptyFilterState, type FilterState } from '../lib/filters';
import { downloadCsv } from '../lib/exports/csv';
import { downloadRcmExcel } from '../lib/exports/rcm-excel';

interface Props {
  controls: Control[];
}

const FRAMEWORKS = [
  ['iso_iec_42001', 'ISO 42001'],
  ['nist_ai_rmf', 'NIST AI RMF'],
  ['eu_ai_act', 'EU AI Act'],
  ['owasp_llm_top_10', 'OWASP LLM'],
  ['owasp_agentic_top_10', 'OWASP Agentic'],
  ['owasp_dsgai', 'OWASP DSGAI'],
  ['mitre_atlas', 'MITRE ATLAS'],
  ['soc_2', 'SOC 2'],
] as const;

const LIFECYCLE = [
  'Strategy & Planning',
  'Data Sourcing & Preparation',
  'Training',
  'Evaluation & Testing',
  'Deployment',
  'Operation & Monitoring',
  'Retirement',
];

const RISK_DOMAINS = [
  'Data',
  'Model',
  'Infrastructure',
  'Governance',
  'People & Process',
  'Third Party',
];

const CONTROL_TYPES = ['preventive', 'detective', 'corrective', 'directive'];

export default function ControlsExplorer({ controls }: Props) {
  const [query, setQuery] = useState('');
  const [state, setState] = useState<FilterState>(emptyFilterState());

  const categories = useMemo(
    () => Array.from(new Set(controls.map((c) => c.category))).sort(),
    [controls],
  );

  const fuse = useMemo(
    () =>
      new Fuse(controls, {
        keys: [
          { name: 'id', weight: 0.4 },
          { name: 'title', weight: 0.4 },
          { name: 'objective', weight: 0.2 },
          { name: 'category', weight: 0.15 },
          { name: 'control_narrative', weight: 0.1 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [controls],
  );

  const filtered = useMemo(() => {
    const afterSearch = query.trim() ? fuse.search(query).map((r) => r.item) : controls;
    return filterControls(afterSearch, state);
  }, [controls, query, state, fuse]);

  const toggle = (key: keyof FilterState, value: string) => {
    setState((s) => {
      const set = new Set(s[key]);
      set.has(value) ? set.delete(value) : set.add(value);
      return { ...s, [key]: Array.from(set) };
    });
  };

  const clear = () => {
    setState(emptyFilterState());
    setQuery('');
  };

  const totalFiltersActive =
    Object.values(state).reduce((a, b) => a + (b as string[]).length, 0) +
    (query.trim() ? 1 : 0);

  return (
    <div className="grid lg:grid-cols-[240px_1fr] gap-8">
      <aside className="space-y-6">
        <div>
          <label htmlFor="controls-search" className="sr-only">
            Search controls
          </label>
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
              aria-hidden
            />
            <input
              id="controls-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search controls..."
              className="form-input w-full pl-9 pr-3 h-10 rounded-md border-ink-300 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/30 text-sm"
            />
          </div>
        </div>

        <FilterGroup
          label="Category"
          options={categories}
          selected={state.categories}
          onToggle={(v) => toggle('categories', v)}
        />
        <FilterGroup
          label="Framework"
          options={FRAMEWORKS.map(([k, label]) => ({ value: k, label }))}
          selected={state.frameworks}
          onToggle={(v) => toggle('frameworks', v)}
        />
        <FilterGroup
          label="Lifecycle"
          options={LIFECYCLE}
          selected={state.lifecycle}
          onToggle={(v) => toggle('lifecycle', v)}
        />
        <FilterGroup
          label="Risk domain"
          options={RISK_DOMAINS}
          selected={state.riskDomains}
          onToggle={(v) => toggle('riskDomains', v)}
        />
        <FilterGroup
          label="Control type"
          options={CONTROL_TYPES}
          selected={state.controlTypes}
          onToggle={(v) => toggle('controlTypes', v)}
        />

        {totalFiltersActive > 0 && (
          <button onClick={clear} className="btn btn-ghost btn-sm w-full">
            <X size={14} /> Clear all
          </button>
        )}
      </aside>

      <section>
        <div className="flex items-center justify-between mb-6" role="status" aria-live="polite">
          <p className="text-sm text-ink-600">
            <span className="font-semibold text-ink-900">{filtered.length}</span> control
            {filtered.length === 1 ? '' : 's'}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => downloadRcmExcel(filtered)}
              className="btn btn-primary btn-sm"
              disabled={filtered.length === 0}
              aria-label="Export current view to RCM Excel"
            >
              <Download size={14} /> RCM Excel
            </button>
            <button
              onClick={() => downloadCsv(filtered)}
              className="btn btn-secondary btn-sm"
              disabled={filtered.length === 0}
              aria-label="Export current view to CSV"
            >
              <Download size={14} /> CSV
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 max-w-narrow mx-auto">
            <FileText size={32} className="mx-auto text-ink-400 mb-3" aria-hidden />
            <p className="text-ink-700 font-medium">No controls match these filters.</p>
            <button onClick={clear} className="btn btn-ghost btn-sm mt-3">
              Clear filters
            </button>
          </div>
        ) : (
          <ul className="grid sm:grid-cols-2 gap-4">
            {filtered.map((c) => (
              <li key={c.id}>
                <a
                  href={`${import.meta.env.BASE_URL}controls/${c.id}`}
                  className="card-interactive block h-full focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 rounded-lg"
                >
                  <p className="font-mono text-xs text-ink-500">{c.id}</p>
                  <h3 className="text-lg font-semibold text-ink-900 mt-1">{c.title}</h3>
                  <p className="text-sm text-ink-600 mt-2 line-clamp-3">{c.objective}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="badge-accent">{c.category}</span>
                    <span className="badge-neutral">{c.control_type}</span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

interface FilterGroupProps {
  label: string;
  options: readonly (string | { value: string; label: string })[];
  selected: string[];
  onToggle: (v: string) => void;
}

function FilterGroup({ label, options, selected, onToggle }: FilterGroupProps) {
  return (
    <fieldset>
      <legend className="text-xs font-semibold uppercase tracking-wide text-ink-500 mb-2">
        {label}
      </legend>
      <div className="space-y-1.5">
        {options.map((opt) => {
          const value = typeof opt === 'string' ? opt : opt.value;
          const display = typeof opt === 'string' ? opt : opt.label;
          const checked = selected.includes(value);
          return (
            <label key={value} className="flex items-center gap-2 text-sm text-ink-700 cursor-pointer">
              <input
                type="checkbox"
                className="form-checkbox rounded border-ink-300 text-accent-700 focus:ring-accent-500"
                checked={checked}
                onChange={() => onToggle(value)}
              />
              <span className={checked ? 'text-accent-700 font-medium' : ''}>{display}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
