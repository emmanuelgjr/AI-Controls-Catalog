import jsPDF from 'jspdf';
import type { Control } from '../../content/config';

const MARGIN = 14;
const LINE = 5;

export function pdfExportSingle(control: Control): Blob {
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

  const writeList = (items: string[]) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    items.forEach((item, idx) => {
      const lines = doc.splitTextToSize(`${idx + 1}. ${item}`, textWidth - 4);
      ensureRoom(lines.length);
      doc.text(lines, MARGIN + 2, y);
      y += lines.length * LINE;
    });
  };

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 118, 110);
  doc.text('AI CONTROLS CATALOG', MARGIN, y);
  doc.setTextColor(0, 0, 0);
  y += LINE;

  writeHeading(`${control.id} — ${control.title}`, 16);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Version ${control.version} · ${control.category} · ${control.control_type} · Last reviewed ${control.last_reviewed}`,
    MARGIN,
    y,
  );
  doc.setTextColor(0, 0, 0);
  y += LINE + 2;

  writeHeading('Objective');
  writeBody(control.objective);
  y += 2;

  writeHeading('Rationale');
  writeBody(control.rationale);
  y += 2;

  writeHeading('Control narrative');
  writeBody(control.control_narrative);
  y += 2;

  writeHeading('Test of Design — Procedures');
  writeList(control.test_of_design.procedures);
  y += 2;
  writeHeading('Test of Design — Inquiries');
  writeList(control.test_of_design.inquiries);
  y += 2;
  writeHeading('Test of Design — Inspections');
  writeList(control.test_of_design.inspections);
  y += 2;

  writeHeading('Test of Operating Effectiveness — Procedures');
  writeList(control.test_of_operating_effectiveness.procedures);
  y += 2;

  writeHeading('Sample-size guidance');
  const s = control.test_of_operating_effectiveness.sample_size_guidance;
  writeBody(`Population: ${s.population_type}`);
  writeBody(`Low risk: ${s.low_risk}`);
  writeBody(`Moderate risk: ${s.moderate_risk}`);
  writeBody(`High risk: ${s.high_risk}`);
  y += 2;

  writeHeading('Evidence — Required');
  writeList(
    control.evidence_requirements.required.map(
      (e) => `${e.item} — ${e.format} — ${e.frequency}`,
    ),
  );
  y += 2;

  writeHeading('Framework mappings');
  Object.entries(control.framework_mappings).forEach(([k, v]) => {
    if (v && (v as string[]).length > 0) writeBody(`${k}: ${(v as string[]).join(', ')}`);
  });
  y += 2;

  writeHeading('References');
  writeList(control.references.map((r) => `${r.title} — ${r.url}`));

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `${control.id} · v${control.version} · Page ${i} of ${totalPages} · CC-BY 4.0 · aicontrolscatalog.dev`,
      MARGIN,
      pageHeight - 6,
    );
  }

  return doc.output('blob');
}

export function downloadPdf(control: Control) {
  const blob = pdfExportSingle(control);
  if (typeof document === 'undefined') return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${control.id}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
