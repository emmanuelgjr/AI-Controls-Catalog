import { defineCollection, z } from 'astro:content';

export const ControlCategory = z.enum([
  'Governance',
  'AI Risk Management',
  'Data Governance',
  'Model Lifecycle',
  'Inference & Output',
  'Third-Party AI',
  'Human Oversight',
  'Transparency & Explainability',
  'Security & Adversarial Robustness',
  'Privacy',
  'Bias & Fairness',
  'Incident Management',
  'Logging & Monitoring',
  'Change Management',
]);

export const LifecycleStage = z.enum([
  'Strategy & Planning',
  'Data Sourcing & Preparation',
  'Training',
  'Evaluation & Testing',
  'Deployment',
  'Operation & Monitoring',
  'Retirement',
]);

export const RiskDomain = z.enum([
  'Data',
  'Model',
  'Infrastructure',
  'Governance',
  'People & Process',
  'Third Party',
]);

export const AIType = z.enum([
  'LLM',
  'Agentic AI',
  'Traditional ML',
  'Computer Vision',
  'Generative AI',
  'Multi-modal',
  'Recommender',
  'Speech',
]);

export const DeploymentModel = z.enum(['SaaS', 'Self-hosted', 'Hybrid', 'Edge', 'Embedded']);

export const ControlType = z.enum(['preventive', 'detective', 'corrective', 'directive']);

const EvidenceItem = z.object({
  item: z.string(),
  format: z.string(),
  frequency: z.string(),
});

const ChangelogEntry = z.object({
  version: z.string(),
  date: z.string(),
  change: z.string(),
});

const Reference = z.object({
  title: z.string(),
  url: z.string().url(),
});

export const controlSchema = z.object({
  id: z.string().regex(/^AI-CTRL-\d{3}$/, 'ID must be AI-CTRL-NNN'),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'Must be semver'),
  title: z.string().min(8).max(120),
  category: ControlCategory,
  control_type: ControlType,
  lifecycle_stage: z.array(LifecycleStage).min(1),
  risk_domain: z.array(RiskDomain).min(1),
  applicability: z.object({
    ai_types: z.array(AIType).min(1),
    deployment_models: z.array(DeploymentModel).min(1),
    regulatory_regimes: z.array(z.string()).min(1),
    company_size: z.array(z.enum(['SMB', 'MidMarket', 'Enterprise'])).min(1),
  }),
  objective: z.string().min(20),
  rationale: z.string().min(40),
  control_narrative: z.string().min(80),
  test_of_design: z.object({
    procedures: z.array(z.string()).min(3),
    inquiries: z.array(z.string()).min(1),
    inspections: z.array(z.string()).min(1),
  }),
  test_of_operating_effectiveness: z.object({
    procedures: z.array(z.string()).min(3),
    sample_size_guidance: z.object({
      population_type: z.string(),
      low_risk: z.string(),
      moderate_risk: z.string(),
      high_risk: z.string(),
    }),
    reperformance_steps: z.array(z.string()).optional(),
  }),
  evidence_requirements: z.object({
    required: z.array(EvidenceItem).min(1),
    supporting: z.array(EvidenceItem).default([]),
    retention_period: z.string(),
  }),
  framework_mappings: z
    .object({
      iso_iec_42001: z.array(z.string()).optional(),
      nist_ai_rmf: z.array(z.string()).optional(),
      eu_ai_act: z.array(z.string()).optional(),
      owasp_llm_top_10: z.array(z.string()).optional(),
      owasp_agentic_top_10: z.array(z.string()).optional(),
      owasp_dsgai: z.array(z.string()).optional(),
      soc_2: z.array(z.string()).optional(),
      mitre_atlas: z.array(z.string()).optional(),
      osfi_e21: z.array(z.string()).optional(),
      nydfs_500: z.array(z.string()).optional(),
    })
    .refine(
      (m) => Object.values(m).some((v) => v && v.length > 0),
      'At least one framework mapping must be present',
    ),
  related_controls: z.array(z.string()).default([]),
  author: z.string(),
  reviewed_by: z.array(z.string()).default([]),
  created: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  last_reviewed: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  changelog: z.array(ChangelogEntry).min(1),
  references: z.array(Reference).min(2),
});

export type Control = z.infer<typeof controlSchema>;

export const frameworkSchema = z.object({
  slug: z.string(),
  name: z.string(),
  short_name: z.string(),
  publisher: z.string(),
  description: z.string(),
  color_mark: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  url: z.string().url(),
});

export type Framework = z.infer<typeof frameworkSchema>;

const controls = defineCollection({
  type: 'data',
  schema: controlSchema,
});

const frameworks = defineCollection({
  type: 'data',
  schema: frameworkSchema,
});

export const collections = { controls, frameworks };
