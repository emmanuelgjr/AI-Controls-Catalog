import { Download, FileText, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import type { Control } from '../content/config';
import { downloadPdf } from '../lib/exports/pdf';
import { downloadCsv } from '../lib/exports/csv';

interface Props {
  control: Control;
}

export default function ExportButtons({ control }: Props) {
  const [copied, setCopied] = useState(false);
  const citation = `Guilherme Jr., E. (${new Date(control.last_reviewed).getFullYear()}). AI Controls Catalog — ${control.id} ${control.title} (Version ${control.version}). https://aicontrolscatalog.dev/controls/${control.id}`;

  const copyCitation = async () => {
    try {
      await navigator.clipboard.writeText(citation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(control, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${control.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-2">
      <button onClick={() => downloadPdf(control)} className="btn btn-primary btn-sm w-full">
        <Download size={14} /> PDF
      </button>
      <button onClick={() => downloadCsv([control])} className="btn btn-secondary btn-sm w-full">
        <FileText size={14} /> CSV
      </button>
      <button onClick={downloadJson} className="btn btn-secondary btn-sm w-full">
        <FileText size={14} /> JSON
      </button>
      <button
        onClick={copyCitation}
        className="btn btn-ghost btn-sm w-full"
        aria-label="Copy citation"
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}{' '}
        {copied ? 'Citation copied' : 'Copy citation'}
      </button>
    </div>
  );
}
