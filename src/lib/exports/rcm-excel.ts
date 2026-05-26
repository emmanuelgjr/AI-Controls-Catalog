import ExcelJS from 'exceljs';
import type { Control } from '../../content/config';

const ACCENT = '0F766E';
const HEADER_FILL: ExcelJS.FillPattern = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: `FF${ACCENT}` },
};
const HEADER_FONT: Partial<ExcelJS.Font> = {
  bold: true,
  color: { argb: 'FFFFFFFF' },
  size: 10,
};
const BODY_FONT: Partial<ExcelJS.Font> = { size: 10 };
const META_FONT: Partial<ExcelJS.Font> = { size: 9, color: { argb: 'FF64748B' } };

const FRAMEWORK_KEYS = [
  ['iso_iec_42001', 'ISO 42001'],
  ['nist_ai_rmf', 'NIST AI RMF'],
  ['eu_ai_act', 'EU AI Act'],
  ['owasp_llm_top_10', 'OWASP LLM'],
  ['owasp_agentic_top_10', 'OWASP Agentic'],
  ['owasp_dsgai', 'OWASP DSGAI'],
  ['mitre_atlas', 'MITRE ATLAS'],
  ['soc_2', 'SOC 2'],
  ['osfi_e21', 'OSFI E-21'],
  ['nydfs_500', 'NYDFS 500'],
] as const;

function addTitle(ws: ExcelJS.Worksheet, title: string, colCount: number) {
  const row = ws.addRow([`AI Controls Catalog — ${title}`]);
  row.font = { bold: true, size: 12, color: { argb: `FF${ACCENT}` } };
  ws.mergeCells(1, 1, 1, Math.min(colCount, 8));
  const dateRow = ws.addRow([`Exported ${new Date().toISOString().split('T')[0]} · CC-BY 4.0`]);
  dateRow.font = META_FONT;
  ws.addRow([]);
}

function styleHeader(row: ExcelJS.Row) {
  row.eachCell((cell) => {
    cell.fill = HEADER_FILL;
    cell.font = HEADER_FONT;
    cell.alignment = { vertical: 'middle', wrapText: true };
    cell.border = {
      bottom: { style: 'thin', color: { argb: 'FF0F766E' } },
    };
  });
  row.height = 28;
}

function join(arr: string[] | undefined): string {
  return (arr ?? []).join('; ');
}

function fmJoin(fm: Control['framework_mappings'], key: string): string {
  const val = (fm as Record<string, string[] | undefined>)[key];
  return (val ?? []).join(', ');
}

function buildSummary(wb: ExcelJS.Workbook, controls: Control[]) {
  const ws = wb.addWorksheet('RCM Summary');
  const cols = ['ID', 'Title', 'Category', 'Type', 'Objective', 'Risk Domains', 'Lifecycle Stages', 'AI Types', 'Deployment', 'Company Size', 'Regulatory Regimes', 'Frameworks'];
  addTitle(ws, 'Risk Control Matrix — Summary', cols.length);

  const header = ws.addRow(cols);
  styleHeader(header);

  for (const c of controls) {
    const fwNames = Object.entries(c.framework_mappings)
      .filter(([, v]) => v && (v as string[]).length > 0)
      .map(([k]) => k.replace(/_/g, ' '))
      .join(', ');

    const row = ws.addRow([
      c.id,
      c.title,
      c.category,
      c.control_type,
      c.objective,
      c.risk_domain.join(', '),
      c.lifecycle_stage.join(', '),
      c.applicability.ai_types.join(', '),
      c.applicability.deployment_models.join(', '),
      c.applicability.company_size.join(', '),
      c.applicability.regulatory_regimes.join(', '),
      fwNames,
    ]);
    row.font = BODY_FONT;
    row.alignment = { vertical: 'top', wrapText: true };
  }

  ws.columns = [
    { width: 14 }, { width: 35 }, { width: 22 }, { width: 12 },
    { width: 50 }, { width: 25 }, { width: 30 }, { width: 30 },
    { width: 22 }, { width: 18 }, { width: 30 }, { width: 40 },
  ];
  ws.views = [{ state: 'frozen', ySplit: 4 }];
}

function buildTestProcedures(wb: ExcelJS.Workbook, controls: Control[]) {
  const ws = wb.addWorksheet('Test Procedures');
  const cols = ['ID', 'Title', 'ToD Procedures', 'ToD Inquiries', 'ToD Inspections', 'ToOE Procedures', 'Reperformance', 'Pop. Type', 'Low Risk', 'Mod Risk', 'High Risk'];
  addTitle(ws, 'Risk Control Matrix — Test Procedures', cols.length);

  const header = ws.addRow(cols);
  styleHeader(header);

  for (const c of controls) {
    const row = ws.addRow([
      c.id,
      c.title,
      c.test_of_design.procedures.map((p, i) => `${i + 1}. ${p}`).join('\n'),
      c.test_of_design.inquiries.map((p, i) => `${i + 1}. ${p}`).join('\n'),
      c.test_of_design.inspections.map((p, i) => `${i + 1}. ${p}`).join('\n'),
      c.test_of_operating_effectiveness.procedures.map((p, i) => `${i + 1}. ${p}`).join('\n'),
      (c.test_of_operating_effectiveness.reperformance_steps ?? []).map((p, i) => `${i + 1}. ${p}`).join('\n'),
      c.test_of_operating_effectiveness.sample_size_guidance.population_type,
      c.test_of_operating_effectiveness.sample_size_guidance.low_risk,
      c.test_of_operating_effectiveness.sample_size_guidance.moderate_risk,
      c.test_of_operating_effectiveness.sample_size_guidance.high_risk,
    ]);
    row.font = BODY_FONT;
    row.alignment = { vertical: 'top', wrapText: true };
  }

  ws.columns = [
    { width: 14 }, { width: 30 }, { width: 50 }, { width: 40 },
    { width: 40 }, { width: 50 }, { width: 40 }, { width: 18 },
    { width: 18 }, { width: 18 }, { width: 18 },
  ];
  ws.views = [{ state: 'frozen', ySplit: 4 }];
}

function buildEvidence(wb: ExcelJS.Workbook, controls: Control[]) {
  const ws = wb.addWorksheet('Evidence');
  const cols = ['ID', 'Title', 'Evidence Item', 'Format', 'Frequency', 'Type', 'Retention'];
  addTitle(ws, 'Risk Control Matrix — Evidence Requirements', cols.length);

  const header = ws.addRow(cols);
  styleHeader(header);

  for (const c of controls) {
    for (const e of c.evidence_requirements.required) {
      const row = ws.addRow([c.id, c.title, e.item, e.format, e.frequency, 'Required', c.evidence_requirements.retention_period]);
      row.font = BODY_FONT;
      row.alignment = { vertical: 'top', wrapText: true };
    }
    for (const e of c.evidence_requirements.supporting) {
      const row = ws.addRow([c.id, c.title, e.item, e.format, e.frequency, 'Supporting', c.evidence_requirements.retention_period]);
      row.font = BODY_FONT;
      row.alignment = { vertical: 'top', wrapText: true };
    }
  }

  ws.columns = [
    { width: 14 }, { width: 30 }, { width: 45 }, { width: 20 },
    { width: 18 }, { width: 12 }, { width: 18 },
  ];
  ws.views = [{ state: 'frozen', ySplit: 4 }];
}

function buildFrameworkMap(wb: ExcelJS.Workbook, controls: Control[]) {
  const ws = wb.addWorksheet('Framework Map');
  const cols = ['ID', 'Title', ...FRAMEWORK_KEYS.map(([, label]) => label)];
  addTitle(ws, 'Risk Control Matrix — Framework Mappings', cols.length);

  const header = ws.addRow(cols);
  styleHeader(header);

  for (const c of controls) {
    const row = ws.addRow([
      c.id,
      c.title,
      ...FRAMEWORK_KEYS.map(([key]) => fmJoin(c.framework_mappings, key)),
    ]);
    row.font = BODY_FONT;
    row.alignment = { vertical: 'top', wrapText: true };
  }

  ws.columns = [
    { width: 14 }, { width: 30 },
    ...FRAMEWORK_KEYS.map(() => ({ width: 22 })),
  ];
  ws.views = [{ state: 'frozen', ySplit: 4 }];
}

export async function rcmExcelExport(controls: Control[]): Promise<Blob> {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'AI Controls Catalog';
  wb.created = new Date();

  buildSummary(wb, controls);
  buildTestProcedures(wb, controls);
  buildEvidence(wb, controls);
  buildFrameworkMap(wb, controls);

  const buffer = await wb.xlsx.writeBuffer();
  return new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}

export async function downloadRcmExcel(controls: Control[], filename = 'ai-controls-rcm.xlsx') {
  const blob = await rcmExcelExport(controls);
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
