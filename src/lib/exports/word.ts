import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  Table, TableRow, TableCell, WidthType, BorderStyle,
  AlignmentType, Footer, PageNumber, NumberFormat,
} from 'docx';
import type { Control } from '../../content/config';

const ACCENT = '0F766E';

function heading(text: string, level: typeof HeadingLevel.HEADING_1 | typeof HeadingLevel.HEADING_2 = HeadingLevel.HEADING_2) {
  return new Paragraph({ text, heading: level, spacing: { before: 240, after: 120 } });
}

function body(text: string) {
  return new Paragraph({
    children: [new TextRun({ text, size: 20 })],
    spacing: { after: 120 },
  });
}

function numberedList(items: string[]) {
  return items.map((item, i) =>
    new Paragraph({
      children: [new TextRun({ text: `${i + 1}. ${item}`, size: 20 })],
      spacing: { after: 60 },
      indent: { left: 360 },
    }),
  );
}

function bulletList(items: string[]) {
  return items.map((item) =>
    new Paragraph({
      children: [new TextRun({ text: `• ${item}`, size: 20 })],
      spacing: { after: 60 },
      indent: { left: 360 },
    }),
  );
}

function kvRow(label: string, value: string): TableRow {
  return new TableRow({
    children: [
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 18, color: '475569' })] })],
        width: { size: 30, type: WidthType.PERCENTAGE },
        borders: { top: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' } },
      }),
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: value, size: 18 })] })],
        width: { size: 70, type: WidthType.PERCENTAGE },
        borders: { top: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' } },
      }),
    ],
  });
}

export function wordExportSingle(control: Control): Document {
  const fm = control.framework_mappings;
  const frameworkRows = Object.entries(fm)
    .filter(([, v]) => v && (v as string[]).length > 0)
    .map(([k, v]) => kvRow(k.replace(/_/g, ' '), (v as string[]).join(', ')));

  const doc = new Document({
    creator: 'AI Controls Catalog',
    title: `${control.id} — ${control.title}`,
    description: control.objective,
    sections: [{
      properties: {
        page: {
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: `${control.id} · v${control.version} · Page `, size: 16, color: '94A3B8' }),
                new TextRun({ children: [PageNumber.CURRENT], size: 16, color: '94A3B8' }),
                new TextRun({ text: ` · CC-BY 4.0 · AI Controls Catalog`, size: 16, color: '94A3B8' }),
              ],
            }),
          ],
        }),
      },
      children: [
        new Paragraph({
          children: [new TextRun({ text: 'AI CONTROLS CATALOG', size: 18, bold: true, color: ACCENT })],
          spacing: { after: 80 },
        }),

        new Paragraph({
          text: `${control.id} — ${control.title}`,
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 80 },
        }),

        new Paragraph({
          children: [
            new TextRun({ text: `Version ${control.version} · ${control.category} · ${control.control_type} · Last reviewed ${control.last_reviewed}`, size: 18, color: '64748B' }),
          ],
          spacing: { after: 240 },
        }),

        // Applicability
        heading('Applicability'),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            kvRow('AI types', control.applicability.ai_types.join(', ')),
            kvRow('Deployment models', control.applicability.deployment_models.join(', ')),
            kvRow('Company size', control.applicability.company_size.join(', ')),
            kvRow('Regulatory regimes', control.applicability.regulatory_regimes.join(', ')),
            kvRow('Lifecycle stages', control.lifecycle_stage.join(', ')),
            kvRow('Risk domains', control.risk_domain.join(', ')),
          ],
        }),

        // Objective
        heading('Objective'),
        body(control.objective),

        // Rationale
        heading('Rationale'),
        body(control.rationale),

        // Control narrative
        heading('Control Narrative'),
        body(control.control_narrative),

        // Test of Design
        heading('Test of Design — Procedures'),
        ...numberedList(control.test_of_design.procedures),
        heading('Test of Design — Inquiries'),
        ...bulletList(control.test_of_design.inquiries),
        heading('Test of Design — Inspections'),
        ...bulletList(control.test_of_design.inspections),

        // Test of Operating Effectiveness
        heading('Test of Operating Effectiveness — Procedures'),
        ...numberedList(control.test_of_operating_effectiveness.procedures),

        heading('Sample-Size Guidance'),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            kvRow('Population type', control.test_of_operating_effectiveness.sample_size_guidance.population_type),
            kvRow('Low risk', control.test_of_operating_effectiveness.sample_size_guidance.low_risk),
            kvRow('Moderate risk', control.test_of_operating_effectiveness.sample_size_guidance.moderate_risk),
            kvRow('High risk', control.test_of_operating_effectiveness.sample_size_guidance.high_risk),
          ],
        }),

        ...(control.test_of_operating_effectiveness.reperformance_steps?.length
          ? [heading('Reperformance Steps'), ...numberedList(control.test_of_operating_effectiveness.reperformance_steps)]
          : []),

        // Evidence
        heading('Evidence Requirements — Required'),
        ...control.evidence_requirements.required.map((e) =>
          new Paragraph({
            children: [
              new TextRun({ text: e.item, bold: true, size: 20 }),
              new TextRun({ text: ` — ${e.format} — ${e.frequency}`, size: 20, color: '64748B' }),
            ],
            spacing: { after: 60 },
            indent: { left: 360 },
          }),
        ),
        ...(control.evidence_requirements.supporting.length > 0
          ? [
              heading('Evidence Requirements — Supporting'),
              ...control.evidence_requirements.supporting.map((e) =>
                new Paragraph({
                  children: [
                    new TextRun({ text: e.item, bold: true, size: 20 }),
                    new TextRun({ text: ` — ${e.format} — ${e.frequency}`, size: 20, color: '64748B' }),
                  ],
                  spacing: { after: 60 },
                  indent: { left: 360 },
                }),
              ),
            ]
          : []),
        body(`Retention: ${control.evidence_requirements.retention_period}`),

        // Framework mappings
        heading('Framework Mappings'),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: frameworkRows,
        }),

        // References
        heading('References'),
        ...control.references.map((r) =>
          new Paragraph({
            children: [
              new TextRun({ text: `${r.title}`, size: 20 }),
              new TextRun({ text: ` — ${r.url}`, size: 18, color: '64748B' }),
            ],
            spacing: { after: 60 },
            indent: { left: 360 },
          }),
        ),
      ],
    }],
  });

  return doc;
}

export async function downloadWord(control: Control) {
  const doc = wordExportSingle(control);
  const blob = await Packer.toBlob(doc);
  if (typeof document === 'undefined') return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${control.id}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
