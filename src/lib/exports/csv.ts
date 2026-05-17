import Papa from 'papaparse';
import type { Control } from '../../content/config';

function flatten(c: Control) {
  const fm = c.framework_mappings;
  return {
    id: c.id,
    title: c.title,
    version: c.version,
    category: c.category,
    control_type: c.control_type,
    lifecycle_stage: c.lifecycle_stage.join('; '),
    risk_domain: c.risk_domain.join('; '),
    ai_types: c.applicability.ai_types.join('; '),
    deployment_models: c.applicability.deployment_models.join('; '),
    objective: c.objective,
    iso_iec_42001: (fm.iso_iec_42001 ?? []).join('; '),
    nist_ai_rmf: (fm.nist_ai_rmf ?? []).join('; '),
    eu_ai_act: (fm.eu_ai_act ?? []).join('; '),
    owasp_llm_top_10: (fm.owasp_llm_top_10 ?? []).join('; '),
    owasp_agentic_top_10: (fm.owasp_agentic_top_10 ?? []).join('; '),
    owasp_dsgai: (fm.owasp_dsgai ?? []).join('; '),
    mitre_atlas: (fm.mitre_atlas ?? []).join('; '),
    soc_2: (fm.soc_2 ?? []).join('; '),
    related_controls: c.related_controls.join('; '),
    author: c.author,
    created: c.created,
    last_reviewed: c.last_reviewed,
  };
}

export function csvExport(controls: Control[]): string {
  return Papa.unparse(controls.map(flatten));
}

export function downloadCsv(controls: Control[], filename = 'ai-controls.csv') {
  const blob = new Blob([csvExport(controls)], { type: 'text/csv;charset=utf-8' });
  triggerDownload(blob, filename);
}

function triggerDownload(blob: Blob, filename: string) {
  if (typeof document === 'undefined') return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
