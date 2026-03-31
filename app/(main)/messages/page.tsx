'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { handleApiError } from '@/lib/error-handler';
import { createInvoiceFromText } from '@/modules/invoice/api';

export default function MessagesPage() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast.error('Please enter a message first.');
      return;
    }
    setGenerating(true);
    try {
      const result = await createInvoiceFromText(text.trim());
      toast.success('Invoice created as draft!');
      router.push(`/invoice/${result.invoice.id}`);
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="container" style={{ paddingBottom: 100 }}>
      <div style={{ marginBottom: 6 }}>
        <h1 className="page-title" style={{ margin: '0 0 6px' }}>
          Write a message to generate an invoice
        </h1>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)' }}>
          Paste a client SMS, WhatsApp message, email chain, or just type below.
        </p>
      </div>

      {/* Required info hint */}
      <div
        style={{
          marginTop: 18,
          border: '1px solid var(--border)',
          borderRadius: 14,
          padding: '14px 18px',
          background: 'rgba(255,255,255,0.02)',
        }}
      >
        <p
          style={{
            margin: '0 0 8px',
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          Required Info:
        </p>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4, lineHeight: 1.5 }}>
            Job Description (What was done?)
          </li>
          <li style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4, lineHeight: 1.5 }}>
            Hourly Rate & Hours <strong style={{ color: '#5a9bfc' }}>OR</strong> Fixed Price
          </li>
          <li style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
            Client Name (Optional)
          </li>
        </ul>
      </div>

      {/* Text input */}
      <textarea
        className="input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="e.g., Hi [client name], [what you did]. [X hours at Y/hr]and[Y/hr] and [Y/hr]and[Z for parts/materials]. Hey Tom, annual AC service and filter replacement at his office. 1.5 hours at $95/hr, new filter $35, call-out fee $50."
        rows={8}
        style={{
          marginTop: 16,
          width: '100%',
          boxSizing: 'border-box',
          resize: 'vertical',
          minHeight: 220,
          fontSize: 14,
          lineHeight: 1.6,
        }}
      />

      {/* Generate button */}
      <button
        className="button"
        onClick={handleGenerate}
        disabled={generating || !text.trim()}
        style={{
          marginTop: 16,
          width: '100%',
          padding: '16px',
          fontSize: 15,
          fontWeight: 700,
          opacity: generating || !text.trim() ? 0.5 : 1,
        }}
      >
        {generating ? 'Generating...' : 'Generate Invoice'}
      </button>
    </div>
  );
}
