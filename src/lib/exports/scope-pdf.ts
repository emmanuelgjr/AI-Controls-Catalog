import jsPDF from 'jspdf';
import type { ScoredControl, ScopeSelections } from '../scoping';
import { getPhaseLabel, COMPANY_SIZE_LABELS } from '../scoping';

const MARGIN = 14;
const LINE = 5;

export function scopeReportPdf(results: ScoredControl[], selections: ScopeSelections) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const textWidth = pageWidth - MARGIN * 2;
  let y = MARGIN;

  const ensureRoom = (rows: number) => {
    if (y + rows * LINE > pageHeight - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
  };

  const writeHeading = (text: string, size = 14) => {
    ensureRoom(2);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(size);
    doc.text(text, MARGIN, y);
    y += LINE + 1;
  };

  const writeBody = (text: string) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(text, textWidth);
    ensureRoom(lines.length);
    doc.text(lines, MARGIN, y);
    y += lines.length * LINE;
  };

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 118, 110);
  doc.text('AI CONTROLS CATALOG — SCOPING REPORT', MARGIN, y);
  doc.setTextColor(0, 0, 0);
  y += LINE + 2;

  writeHeading('AI Controls Scoping Report', 18);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated ${new Date().toISOString().split('T')[0]}`, MARGIN, y);
  doc.setTextColor(0, 0, 0);
  y += LINE + 4;

  // Scope parameters
  writeHeading('Scope Parameters');
  const params = [
    ['AI Types', selections.aiTypes],
    ['Deployment', selections.deploymentModels],
    ['Organization', selections.companySize.map((s) => COMPANY_SIZE_LABELS[s] ?? s)],
    ['Regulations', selections.regulatoryRegimes],
    ['Lifecycle', selections.lifecycleStages],
    ['Risk Domains', selections.riskDomains],
  ];
  for (const [label, values] of params) {
    if (values.length > 0) {
      writeBody(`${label}: ${values.join(', ')}`);
    }
  }
  y += 4;

  // Summary
  const recommended = results.filter((r) => r.tier !== 'out-of-scope');
  const highly = results.filter((r) => r.tier === 'highly-recommended');
  writeHeading('Summary');
  writeBody(
    `${recommended.length} of ${results.length} controls are recommended for your context. ` +
      `${highly.length} are highly recommended.`,
  );
  y += 4;

  // Controls by tier
  const tiers: [string, ScoredControl[]][] = [
    ['Highly Recommended', results.filter((r) => r.tier === 'highly-recommended')],
    ['Recommended', results.filter((r) => r.tier === 'recommended')],
    ['Consider', results.filter((r) => r.tier === 'consider')],
  ];

  for (const [tierLabel, items] of tiers) {
    if (items.length === 0) continue;
    writeHeading(`${tierLabel} (${items.length})`);

    const sorted = [...items].sort((a, b) => a.phase - b.phase || b.score - a.score);
    let currentPhase = -1;

    for (const r of sorted) {
      if (r.phase !== currentPhase) {
        currentPhase = r.phase;
        ensureRoom(2);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text(`Phase ${r.phase}: ${getPhaseLabel(r.phase)}`, MARGIN, y);
        doc.setTextColor(0, 0, 0);
        y += LINE;
      }

      ensureRoom(3);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(`${r.control.id} — ${r.control.title}`, MARGIN + 2, y);
      y += LINE;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(
        `Score: ${r.score}% · ${r.control.category} · ${r.control.control_type} · Matched: ${r.matchedDimensions.join(', ')}`,
        MARGIN + 2,
        y,
      );
      y += LINE;

      const objLines = doc.splitTextToSize(r.control.objective, textWidth - 4);
      ensureRoom(objLines.length);
      doc.text(objLines, MARGIN + 2, y);
      y += objLines.length * LINE + 2;
    }
    y += 2;
  }

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `AI Controls Catalog · Scoping Report · Page ${i} of ${totalPages} · CC-BY 4.0`,
      MARGIN,
      pageHeight - 6,
    );
  }

  const blob = doc.output('blob');
  if (typeof document === 'undefined') return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ai-controls-scoping-report.pdf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
