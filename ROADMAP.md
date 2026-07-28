# Roadmap

## v0.2 (current)

Shipped in v0.1:

- 20 controls across 14 categories
- 8 framework metadata pages (ISO 42001, NIST AI RMF, EU AI Act, OWASP
  LLM / Agentic / DSGAI, MITRE ATLAS, SOC 2)
- Browse by framework, lifecycle stage, risk domain
- Filter + search + single-control export (PDF, CSV, JSON)
- Methodology, About, Contribute, Changelog pages

Added in v0.2:

- Scoping wizard at `/scope` — 6 questions, weighted scoring, 4 relevance
  tiers, phased implementation plan, PDF/CSV export
- RCM Excel multi-control export (4 worksheets, styled headers, frozen panes)
- Word export per control
- Expanded framework mappings. Current coverage across the 20 controls:
  ISO 42001, NIST AI RMF, EU AI Act and SOC 2 on all 20; OSFI E-21 and
  NYDFS 500 on 17; OWASP DSGAI on 14; MITRE ATLAS on 10; OWASP LLM Top 10
  on 8; OWASP Agentic Top 10 on 4; NIST CSF on 3. Mappings are deliberately
  conservative — a control is only mapped where the reference genuinely
  applies.

Carried over, not built:

- Search analytics dashboard. Note this needs a decision before it is
  built: the portfolio's non-negotiables rule out telemetry, so any
  analytics would have to avoid collecting user-entered data.

## v0.3

- Submit-a-control PR template UI
- Per-vertical packs (Banking-Canada, Banking-US, Healthcare-US, EU AI Act
  High-Risk)
- Walkthrough video tour
- Dark mode

## v1.0

- ≥ 40 controls; all 14 categories have ≥ 2 controls each
- All major framework mappings live and reviewed
- Cited in at least one Big 4 thought-leadership piece or regulator
  publication
- ≥ 50 GitHub stars; ≥ 3 external contributors
- Custom domain with SSL. The `.dev` domain this project was originally
  named for was never registered; the site currently lives at
  https://emmanuelgjr.github.io/AI-Controls-Catalog/
