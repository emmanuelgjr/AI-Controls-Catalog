# Scoping Wizard Design Spec

**Date:** 2026-05-25
**Status:** Draft
**Route:** `/scope/`

---

## Overview

A 6-step interactive wizard at `/scope/` that helps users identify which of the 20 AI controls apply to their context. Users answer questions about their AI systems, deployment, organization, regulations, lifecycle, and risk priorities. The wizard scores all controls against the user's selections and displays a ranked results view with export options.

Stack: Astro 4 page wrapper, React component with `client:load`, Tailwind CSS using existing design tokens.

---

## Wizard Steps

Each step maps to fields in the existing control schema (`src/content/schemas.ts`).

### Step 1 — AI System Types

- **Field:** `applicability.ai_types`
- **Input:** Multi-select chips
- **Options:** LLM, Agentic AI, Traditional ML, Computer Vision, Generative AI, Multi-modal, Recommender, Speech
- **Source enum:** `AIType`

### Step 2 — Deployment Model

- **Field:** `applicability.deployment_models`
- **Input:** Multi-select chips
- **Options:** SaaS, Self-hosted, Hybrid, Edge, Embedded
- **Source enum:** `DeploymentModel`

### Step 3 — Organization Size

- **Field:** `applicability.company_size`
- **Input:** Single-select radio group
- **Options:** SMB, MidMarket, Enterprise

### Step 4 — Regulatory Regimes

- **Field:** `applicability.regulatory_regimes`
- **Input:** Multi-select chips
- **Options:** EU AI Act, ISO 42001, NIST AI RMF, GDPR, HIPAA, PIPEDA, Banking, Healthcare, SOC 2, OSFI E-21, NYDFS 500

### Step 5 — Lifecycle Phases

- **Field:** `lifecycle_stage`
- **Input:** Multi-select chips
- **Options:** Strategy & Planning, Data Sourcing & Preparation, Training, Evaluation & Testing, Deployment, Operation & Monitoring, Retirement
- **Source enum:** `LifecycleStage`

### Step 6 — Risk Priorities

- **Field:** `risk_domain`
- **Input:** Multi-select chips
- **Options:** Data, Model, Infrastructure, Governance, People & Process, Third Party
- **Source enum:** `RiskDomain`

---

## Scoring Logic

**File:** `src/lib/scoping.ts`

### Per-dimension scoring

For each dimension, calculate overlap between user selections and control tags:

```
dimension_score = |user_selections ∩ control_tags| / |user_selections| * weight
```

**Weights:**

| Dimension          | Weight |
| ------------------ | ------ |
| ai_types           | 2.0    |
| deployment_models  | 2.0    |
| company_size       | 1.5    |
| regulatory_regimes | 1.5    |
| lifecycle_stage    | 1.0    |
| risk_domain        | 1.0    |

`company_size` is binary: 1.0 if user's selection appears in the control's `company_size` array, 0.0 otherwise, multiplied by its weight.

### Total score

```
total = sum(dimension_scores) / sum(active_weights) * 100
```

Only include weights for dimensions where the user made a selection. If a user skips a step, that dimension's weight is excluded from both numerator and denominator.

### Relevance tiers

| Score   | Tier               |
| ------- | ------------------ |
| >= 70%  | Highly Recommended |
| 40-69%  | Recommended        |
| 1-39%   | Consider           |
| 0%      | Out of Scope       |

---

## Implementation Phases

Controls are grouped into suggested implementation phases based on category:

| Phase | Label                | Control IDs                                                |
| ----- | -------------------- | ---------------------------------------------------------- |
| 1     | Foundation           | AI-CTRL-001, 005                                           |
| 2     | Data & Model         | AI-CTRL-002, 006, 007, 008, 010, 013, 015                 |
| 3     | Security & Compliance| AI-CTRL-003, 009, 011, 012, 014                           |
| 4     | Operations           | AI-CTRL-004, 016, 017, 018, 019, 020                      |

Results display controls within each tier sorted by phase (Foundation first).

---

## Results Display

**File:** `src/components/ScopeResults.tsx`

### Layout

1. **Summary bar** — "X of 20 controls recommended for your context"
2. **Tab groups** — Tabs for each non-empty relevance tier (Highly Recommended / Recommended / Consider). Out of Scope controls are collapsed by default.
3. **Control cards** — Each card shows:
   - Control ID (monospace)
   - Title
   - Relevance score badge (percentage)
   - Category
   - Implementation phase tag
   - Matched dimensions (which user selections aligned)
4. **Link to explorer** — "View all controls" linking to `/controls/` with wizard filters pre-applied via URL query params
5. **Export buttons**:
   - PDF scoping report via jsPDF
   - CSV control list (reuse pattern from `src/lib/exports/csv.ts`)

---

## New Files

| File                              | Purpose                                          |
| --------------------------------- | ------------------------------------------------ |
| `src/pages/scope.astro`           | Page wrapper — BaseLayout, SEOHead, loads data via `getCollection('controls')`, passes `controls` array as prop to ScopingWizard |
| `src/components/ScopingWizard.tsx` | 6-step wizard with progress bar, state management, calls scoring logic, renders ScopeResults |
| `src/components/ScopeResults.tsx`  | Results display with tab groups, control cards, export buttons |
| `src/lib/scoping.ts`              | `scoreControl()`, `scoreAllControls()`, implementation phase mapping, tier classification |

---

## Modified Files

| File                          | Change                                           |
| ----------------------------- | ------------------------------------------------ |
| `src/components/Nav.astro`    | Add `{ href: '/scope', label: 'Scope' }` to `links` array, positioned before "Methodology" |

---

## Data Flow

The page follows the same pattern as `/controls/index.astro`:

```
scope.astro
  → getCollection('controls') at build time
  → maps to .data (Control[])
  → passes as prop to <ScopingWizard client:load controls={controls} />
```

All scoring runs client-side in the browser. No API calls needed.

---

## Design System

### Colors and tokens

Uses existing Tailwind config — no new tokens needed.

- Wizard card: `bg-white border border-ink-200 rounded-lg shadow-card p-6`
- Progress bar: `accent-700` fill on `ink-100` track
- Multi-select chips: reuse checkbox + label pattern from `ControlsExplorer.tsx` `FilterGroup`
- Badge variants for tiers:
  - Highly Recommended: `badge-accent`
  - Recommended: use `bg-emerald-50 text-emerald-700` (ok tier)
  - Consider: use `bg-amber-50 text-amber-700` (warn tier)
  - Out of Scope: `badge-neutral`

### Responsive

- Single-column wizard on mobile
- Wizard centered at `max-w-prose-wide`
- Results grid: single column mobile, `sm:grid-cols-2` on wider screens (matches ControlsExplorer)

### Wizard UX

- Linear step progression with back/next buttons
- Progress bar showing step X of 6
- Each step validates that at least one selection is made (except Step 3 which defaults to all sizes if skipped)
- "Start over" button resets all selections
- Results appear inline below the wizard after step 6 completion (no page navigation)

---

## Testing

| Type           | Tool    | Coverage                                                    |
| -------------- | ------- | ----------------------------------------------------------- |
| Unit           | Vitest  | `scoping.ts` — known inputs produce expected scores, tier thresholds, edge cases (empty selections, full overlap, zero overlap) |
| Build          | Astro   | Page renders without build errors                           |

### Key test cases for `scoping.ts`

1. Control with full overlap on all dimensions scores 100%
2. Control with zero overlap scores 0%
3. Skipped dimensions are excluded from weight calculation
4. Single-dimension selection produces correct partial score
5. `company_size` binary match works correctly (included vs. not)
6. Tier boundaries: 70% -> Highly Recommended, 69% -> Recommended, 40% -> Recommended, 39% -> Consider

---

## Dependencies

- **jsPDF** — new dependency for PDF export (add to `package.json`)
- All other dependencies (React, Tailwind, Fuse.js, Lucide icons) already present

---

## Out of Scope

- URL-based deep linking to wizard state (defer to v2)
- Saved/shareable scoping profiles
- Server-side scoring or API endpoints
- Comparison view between multiple scoping runs
