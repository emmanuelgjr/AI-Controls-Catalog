# Contributing to AI Controls Catalog

PRs are welcome — especially from auditors, AI governance leads, CISOs,
and supervisory authorities with field experience. The contribution model
favors quality over quantity.

## Ways to contribute

1. **Propose a new control.** Open an issue using the *Propose a control*
   template, then submit a PR with a JSON file matching the schema in
   `src/content/config.ts`.
2. **Improve an existing control.** Open a PR editing the relevant JSON.
   Bump version and add a changelog entry.
3. **Add framework mappings.** SOC 2, MITRE ATLAS, OSFI E-21, NYDFS 500
   mappings are especially welcome.
4. **Report a mapping issue.** Open an issue with the source citation.

## Quality bar (a PR will be requested-changes until these are met)

- All schema fields populated — no nulls or TODOs.
- Test of Design has ≥ 3 procedures, ≥ 1 inquiries, ≥ 1 inspections.
- Test of Operating Effectiveness has ≥ 3 procedures with sample-size
  guidance for low / moderate / high risk populations.
- ≥ 3 framework mappings with valid clause / section references.
- Evidence requirements include format and retention guidance.
- ≥ 2 authoritative references with working URLs.
- Changelog has an initial entry (new controls) or a new entry plus a
  version bump (edits).

## Local checks

```bash
npm ci
npm run validate
npm run test
npm run build
```

All four must pass.

## Review cadence

- Framework mappings: reviewed quarterly (frameworks update).
- Sample sizes and evidence requirements: reviewed annually or on a
  material regulatory development.
- Long-form sections: reviewed annually.

## Attribution

Contributors are added to `CONTRIBUTORS.md`. Substantive content
contributions are credited in the control's `author` or `reviewed_by`
field. Substantive contributors (≥ 3 merged content PRs) are listed on
the About page.

## Code of Conduct

See `CODE_OF_CONDUCT.md`.
