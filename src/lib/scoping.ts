import type { Control } from '../content/config';

export interface ScopeSelections {
  aiTypes: string[];
  deploymentModels: string[];
  companySize: string[];
  regulatoryRegimes: string[];
  lifecycleStages: string[];
  riskDomains: string[];
}

export interface ScoredControl {
  control: Control;
  score: number;
  tier: 'highly-recommended' | 'recommended' | 'consider' | 'out-of-scope';
  phase: number;
  matchedDimensions: string[];
}

const WEIGHTS = {
  aiTypes: 2.0,
  deploymentModels: 2.0,
  companySize: 1.5,
  regulatoryRegimes: 1.5,
  lifecycleStages: 1.0,
  riskDomains: 1.0,
} as const;

const TOTAL_WEIGHT = Object.values(WEIGHTS).reduce((a, b) => a + b, 0);

function overlapScore(userSelections: string[], controlTags: string[]): number {
  if (userSelections.length === 0) return 1;
  const hits = userSelections.filter((s) => controlTags.includes(s)).length;
  return hits / userSelections.length;
}

function getPhase(control: Control): number {
  const cat = control.category;
  if (cat === 'Governance' || cat === 'AI Risk Management') return 1;
  if (cat === 'Data Governance' || cat === 'Model Lifecycle' || cat === 'Change Management') return 2;
  if (
    cat === 'Security & Adversarial Robustness' ||
    cat === 'Privacy' ||
    cat === 'Bias & Fairness' ||
    cat === 'Transparency & Explainability'
  )
    return 3;
  return 4;
}

const PHASE_LABELS: Record<number, string> = {
  1: 'Foundation',
  2: 'Data & Model',
  3: 'Security & Compliance',
  4: 'Operations',
};

export function getPhaseLabel(phase: number): string {
  return PHASE_LABELS[phase] ?? 'Other';
}

function tierFromScore(score: number): ScoredControl['tier'] {
  if (score >= 70) return 'highly-recommended';
  if (score >= 40) return 'recommended';
  if (score > 0) return 'consider';
  return 'out-of-scope';
}

export function scoreControls(controls: Control[], selections: ScopeSelections): ScoredControl[] {
  return controls
    .map((control) => {
      const dims: { key: string; score: number; weight: number }[] = [
        {
          key: 'AI types',
          score: overlapScore(selections.aiTypes, control.applicability.ai_types),
          weight: WEIGHTS.aiTypes,
        },
        {
          key: 'Deployment',
          score: overlapScore(selections.deploymentModels, control.applicability.deployment_models),
          weight: WEIGHTS.deploymentModels,
        },
        {
          key: 'Org size',
          score: overlapScore(selections.companySize, control.applicability.company_size),
          weight: WEIGHTS.companySize,
        },
        {
          key: 'Regulation',
          score: overlapScore(selections.regulatoryRegimes, control.applicability.regulatory_regimes),
          weight: WEIGHTS.regulatoryRegimes,
        },
        {
          key: 'Lifecycle',
          score: overlapScore(selections.lifecycleStages, control.lifecycle_stage),
          weight: WEIGHTS.lifecycleStages,
        },
        {
          key: 'Risk domain',
          score: overlapScore(selections.riskDomains, control.risk_domain),
          weight: WEIGHTS.riskDomains,
        },
      ];

      const weightedSum = dims.reduce((acc, d) => acc + d.score * d.weight, 0);
      const score = Math.round((weightedSum / TOTAL_WEIGHT) * 100);
      const matchedDimensions = dims.filter((d) => d.score > 0).map((d) => d.key);

      return {
        control,
        score,
        tier: tierFromScore(score),
        phase: getPhase(control),
        matchedDimensions,
      };
    })
    .sort((a, b) => b.score - a.score || a.phase - b.phase);
}

export const WIZARD_OPTIONS = {
  aiTypes: ['LLM', 'Agentic AI', 'Traditional ML', 'Computer Vision', 'Generative AI', 'Multi-modal', 'Recommender', 'Speech'],
  deploymentModels: ['SaaS', 'Self-hosted', 'Hybrid', 'Edge', 'Embedded'],
  companySize: ['SMB', 'MidMarket', 'Enterprise'],
  regulatoryRegimes: [
    'EU AI Act', 'ISO 42001', 'NIST AI RMF', 'GDPR', 'HIPAA',
    'PIPEDA', 'Banking', 'Healthcare', 'SOC 2', 'OSFI E-21', 'NYDFS 500',
  ],
  lifecycleStages: [
    'Strategy & Planning', 'Data Sourcing & Preparation', 'Training',
    'Evaluation & Testing', 'Deployment', 'Operation & Monitoring', 'Retirement',
  ],
  riskDomains: ['Data', 'Model', 'Infrastructure', 'Governance', 'People & Process', 'Third Party'],
} as const;

export const COMPANY_SIZE_LABELS: Record<string, string> = {
  SMB: 'Small / Medium Business',
  MidMarket: 'Mid-Market',
  Enterprise: 'Enterprise',
};
