import { useState, useMemo } from 'react';
import { ChevronRight, ChevronLeft, Target, RotateCcw, Download, FileText } from 'lucide-react';
import type { Control } from '../content/config';
import {
  scoreControls,
  getPhaseLabel,
  WIZARD_OPTIONS,
  COMPANY_SIZE_LABELS,
  type ScopeSelections,
  type ScoredControl,
} from '../lib/scoping';
import { downloadCsv } from '../lib/exports/csv';
import { scopeReportPdf } from '../lib/exports/scope-pdf';

interface Props {
  controls: Control[];
}

const STEPS = [
  {
    key: 'aiTypes' as const,
    title: 'What AI system types are you working with?',
    description: 'Select all AI system types deployed or planned in your organization.',
    multi: true,
  },
  {
    key: 'deploymentModels' as const,
    title: 'How are your AI systems deployed?',
    description: 'Select all deployment models that apply to your environment.',
    multi: true,
  },
  {
    key: 'companySize' as const,
    title: 'What is your organization size?',
    description: 'This determines control complexity and maturity expectations.',
    multi: false,
  },
  {
    key: 'regulatoryRegimes' as const,
    title: 'Which regulatory regimes apply?',
    description: 'Select all regulations, standards, or industry requirements you must comply with.',
    multi: true,
  },
  {
    key: 'lifecycleStages' as const,
    title: 'Which AI lifecycle phases are in scope?',
    description: 'Select the phases your audit, governance, or risk program needs to cover.',
    multi: true,
  },
  {
    key: 'riskDomains' as const,
    title: 'Which risk domains are your priority?',
    description: 'Select the risk areas you want to focus on. Leave empty to include all.',
    multi: true,
  },
] as const;

const BASE = import.meta.env.BASE_URL;

const emptySelections = (): ScopeSelections => ({
  aiTypes: [],
  deploymentModels: [],
  companySize: [],
  regulatoryRegimes: [],
  lifecycleStages: [],
  riskDomains: [],
});

export default function ScopingWizard({ controls }: Props) {
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<ScopeSelections>(emptySelections());
  const [showResults, setShowResults] = useState(false);

  const currentStep = STEPS[step];
  const options = WIZARD_OPTIONS[currentStep.key];
  const selected = selections[currentStep.key];

  const toggle = (value: string) => {
    setSelections((prev) => {
      const current = prev[currentStep.key];
      if (!currentStep.multi) {
        return { ...prev, [currentStep.key]: current.includes(value) ? [] : [value] };
      }
      const set = new Set(current);
      set.has(value) ? set.delete(value) : set.add(value);
      return { ...prev, [currentStep.key]: Array.from(set) };
    });
  };

  const results = useMemo(() => {
    if (!showResults) return [];
    return scoreControls(controls, selections);
  }, [controls, selections, showResults]);

  const finish = () => setShowResults(true);
  const restart = () => {
    setSelections(emptySelections());
    setStep(0);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <ScopeResults
        results={results}
        selections={selections}
        onRestart={restart}
      />
    );
  }

  const canProceed = currentStep.key === 'riskDomains' || selected.length > 0;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= step ? 'bg-accent-700' : 'bg-ink-200'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-ink-500">
          Step {step + 1} of {STEPS.length}
        </p>
      </div>

      <div className="bg-white border border-ink-200 rounded-lg shadow-card p-6 md:p-8">
        <h2 className="text-xl font-semibold text-ink-900">{currentStep.title}</h2>
        <p className="text-sm text-ink-600 mt-1 mb-6">{currentStep.description}</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {options.map((opt) => {
            const isSelected = selected.includes(opt);
            const label =
              currentStep.key === 'companySize'
                ? COMPANY_SIZE_LABELS[opt] ?? opt
                : opt;
            return (
              <button
                key={opt}
                onClick={() => toggle(opt)}
                className={`text-left px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                  isSelected
                    ? 'bg-accent-50 border-accent-300 text-accent-700'
                    : 'bg-white border-ink-200 text-ink-700 hover:border-accent-300'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
          className="btn btn-ghost btn-sm disabled:opacity-30"
        >
          <ChevronLeft size={16} /> Back
        </button>

        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canProceed}
            className="btn btn-primary btn-sm disabled:opacity-50"
          >
            Next <ChevronRight size={16} />
          </button>
        ) : (
          <button onClick={finish} className="btn btn-primary btn-sm">
            <Target size={16} /> See my controls
          </button>
        )}
      </div>
    </div>
  );
}

function ScopeResults({
  results,
  selections,
  onRestart,
}: {
  results: ScoredControl[];
  selections: ScopeSelections;
  onRestart: () => void;
}) {
  const tiers = {
    'highly-recommended': results.filter((r) => r.tier === 'highly-recommended'),
    recommended: results.filter((r) => r.tier === 'recommended'),
    consider: results.filter((r) => r.tier === 'consider'),
    'out-of-scope': results.filter((r) => r.tier === 'out-of-scope'),
  };

  const recommended = results.filter((r) => r.tier !== 'out-of-scope');

  const handlePdf = () => {
    scopeReportPdf(results, selections);
  };

  const handleCsv = () => {
    downloadCsv(
      recommended.map((r) => r.control),
      'scoped-controls.csv',
    );
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-ink-900">
            {recommended.length} of {results.length} controls recommended
          </h2>
          <p className="text-ink-600 mt-1">Based on your organization's context and priorities.</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={handlePdf} className="btn btn-secondary btn-sm">
            <FileText size={14} /> PDF
          </button>
          <button onClick={handleCsv} className="btn btn-secondary btn-sm">
            <Download size={14} /> CSV
          </button>
          <button onClick={onRestart} className="btn btn-ghost btn-sm">
            <RotateCcw size={14} /> Restart
          </button>
        </div>
      </div>

      {tiers['highly-recommended'].length > 0 && (
        <TierSection
          label="Highly Recommended"
          description="Strong match across multiple dimensions — implement these first."
          badgeClass="bg-accent-50 text-accent-700 ring-1 ring-inset ring-accent-200"
          items={tiers['highly-recommended']}
        />
      )}

      {tiers.recommended.length > 0 && (
        <TierSection
          label="Recommended"
          description="Good relevance — include in your control program."
          badgeClass="bg-ok-50 text-ok-700"
          items={tiers.recommended}
        />
      )}

      {tiers.consider.length > 0 && (
        <TierSection
          label="Consider"
          description="Partial match — review applicability for your specific context."
          badgeClass="bg-warn-50 text-warn-700"
          items={tiers.consider}
        />
      )}

      {tiers['out-of-scope'].length > 0 && (
        <details className="mt-8">
          <summary className="text-sm font-medium text-ink-500 cursor-pointer hover:text-ink-700">
            {tiers['out-of-scope'].length} controls out of scope
          </summary>
          <div className="mt-4 space-y-3">
            {tiers['out-of-scope'].map((r) => (
              <div
                key={r.control.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-ink-50 text-ink-500"
              >
                <span className="font-mono text-xs">{r.control.id}</span>
                <span className="text-sm">{r.control.title}</span>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

function TierSection({
  label,
  description,
  badgeClass,
  items,
}: {
  label: string;
  description: string;
  badgeClass: string;
  items: ScoredControl[];
}) {
  const byPhase = items.reduce(
    (acc, item) => {
      const key = item.phase;
      (acc[key] ??= []).push(item);
      return acc;
    },
    {} as Record<number, ScoredControl[]>,
  );

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-1">
        <h3 className="text-lg font-semibold text-ink-900">{label}</h3>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}>
          {items.length}
        </span>
      </div>
      <p className="text-sm text-ink-500 mb-4">{description}</p>

      {Object.keys(byPhase)
        .map(Number)
        .sort()
        .map((phase) => (
          <div key={phase} className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400 mb-2">
              Phase {phase}: {getPhaseLabel(phase)}
            </p>
            <ul className="space-y-2">
              {byPhase[phase].map((r) => (
                <li key={r.control.id}>
                  <a
                    href={`${BASE}controls/${r.control.id}`}
                    className="card-interactive flex items-start gap-4 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-ink-500">{r.control.id}</span>
                        <span className="badge-neutral">{r.control.category}</span>
                      </div>
                      <h4 className="text-base font-semibold text-ink-900 mt-1">{r.control.title}</h4>
                      <p className="text-sm text-ink-600 mt-1 line-clamp-2">{r.control.objective}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {r.matchedDimensions.map((d) => (
                          <span
                            key={d}
                            className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-ink-100 text-ink-600"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <span className="text-2xl font-bold text-accent-700">{r.score}</span>
                      <span className="text-xs text-ink-500 block">score</span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
    </div>
  );
}
