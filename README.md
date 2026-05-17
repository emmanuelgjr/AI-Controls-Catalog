# AI Controls Catalog

> The audit-ready controls library for AI systems.

[![Site](https://img.shields.io/badge/site-aicontrolscatalog.dev-0F766E)](https://aicontrolscatalog.dev)
[![License: MIT](https://img.shields.io/badge/code-MIT-slate)](LICENSE)
[![Content: CC-BY 4.0](https://img.shields.io/badge/content-CC--BY%204.0-0F766E)](CONTENT-LICENSE)
[![Controls](https://img.shields.io/badge/controls-20-0F766E)](https://aicontrolscatalog.dev/controls)
[![Last reviewed](https://img.shields.io/badge/last%20reviewed-2026--05-slate)](#)

The first practitioner-grade, audit-ready catalog of AI controls. Every
control includes objective, design narrative, Test of Design, Test of
Operating Effectiveness with sample-size guidance, evidence requirements,
framework mappings, and references.

**Built for IT auditors, AI governance leads, CISOs, supervisory authorities.**

[**Open the catalog →**](https://aicontrolscatalog.dev)

---

## Why this exists

ISO/IEC 42001, NIST AI RMF, and the EU AI Act define *what* to govern in AI
systems. None of them define *how an auditor tests it*. Audit teams at
banks, insurers, and consultancies are building this internally — slowly,
inconsistently, expensively. This catalog fills that gap.

## What's inside (v0.1)

- 20 controls across 14 categories
- Framework mappings: ISO/IEC 42001, NIST AI RMF, EU AI Act, OWASP LLM Top
  10, OWASP Agentic Top 10, OWASP DSGAI 2026, SOC 2, MITRE ATLAS
- Filter, search, and export (PDF, CSV, JSON)
- Methodology documentation and contribution guidance

## Roadmap (highlights)

- **v0.2:** Scoping wizard, RCM Excel export, full SOC 2 + MITRE ATLAS
  mappings, Word export.
- **v0.3:** Submit-a-control PR flow, per-vertical packs (banking,
  healthcare, EU AI Act high-risk).
- **v1.0:** 40+ controls, all 14 categories with ≥2 controls each, OSFI
  E-21 + NYDFS mappings, tested in production audits.

See [ROADMAP.md](ROADMAP.md).

## Who built this

**Emmanuel Guilherme Jr.** — Senior Global IT Auditor, Co-lead of the Data
Security Initiative at the OWASP GenAI Security Project, Candidate Expert
on Canada's mirror committee for ISO/IEC JTC 1/SC 42. Built EQ Bank's
in-house Red Team framework. Toronto-based. Trilingual (EN/PT/ES).

[LinkedIn](https://www.linkedin.com/in/emmanuelgjr/) ·
[GitHub](https://github.com/emmanuelgjr) ·
[OWASP GenAI Security Project](https://genai.owasp.org/)

## Use it. Cite it.

```
Guilherme Jr., E. (2026). AI Controls Catalog (Version 0.1.0).
https://aicontrolscatalog.dev
```

## Local development

```bash
npm ci
npm run dev        # http://localhost:4321
npm run validate   # schema validation on all content
npm run test       # vitest suite
npm run build      # production build → ./dist
```

## Contributing

PRs welcome from auditors with field experience. See
[CONTRIBUTING.md](CONTRIBUTING.md). Quality over quantity — a single
control authored to the catalog's quality bar beats ten thin entries.

## Licensing

- **Code:** [MIT](LICENSE)
- **Content** (controls, mappings, narratives): [Creative Commons
  Attribution 4.0](CONTENT-LICENSE)

## Related work in this portfolio

- [AI-Controls-Catalog](https://github.com/emmanuelgjr/AI-Controls-Catalog) — Audit AI *(this repo)*
- [AI-RedTeam-Framework](https://github.com/emmanuelgjr/AI-RedTeam-Framework) — Attack AI
- [AI-Governance-Toolkit](https://github.com/emmanuelgjr/AI-Governance-Toolkit) — Govern AI
- [Shadow-AI-Defense](https://github.com/emmanuelgjr/Shadow-AI-Defense) — Defend against rogue AI

## Acknowledgments

OWASP GenAI Security Project leadership and contributors. ISO/IEC JTC 1/SC
42 mirror committee colleagues in Canada. Threat Modeling Connect
community.
