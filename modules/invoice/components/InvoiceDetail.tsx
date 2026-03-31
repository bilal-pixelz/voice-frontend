'use client';

import { Invoice } from '@/types/invoice';
import { CompanyProfile } from '@/modules/profile/api';
import ModernTemplate from './templates/ModernTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import BoldTemplate from './templates/BoldTemplate';

interface InvoiceDetailProps {
  invoice: Invoice;
  onEdit?: () => void;
  template?: string;
  taxEnabled?: boolean;
  accentColor?: string;
  company?: CompanyProfile | null;
}

export default function InvoiceDetail({
  invoice,
  onEdit,
  template = 'modern',
  taxEnabled = true,
  accentColor = '#0ea5e9',
  company,
}: InvoiceDetailProps) {
  const missing: string[] = [];
  if (!invoice.customer_name) missing.push('Customer name');
  if (!invoice.customer_email) missing.push('Customer email');
  if (!invoice.due_date) missing.push('Due date');
  if (!invoice.line_items?.length) missing.push('Line items');

  const templateProps = { invoice, taxEnabled, accentColor, company };

  return (
    <>
      {missing.length > 0 && (
        <div style={{
          background: 'rgba(250,204,21,0.08)',
          border: '1px solid rgba(250,204,21,0.35)',
          borderRadius: 14, padding: '14px 18px', marginBottom: 16,
          display: 'flex', alignItems: 'flex-start', gap: 12,
        }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
          <div>
            <p style={{ margin: '0 0 6px', fontWeight: 700, color: '#f5bd2d', fontSize: '0.9rem' }}>
              Missing Information
            </p>
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {missing.map((f) => (
                <li key={f} style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{f}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {onEdit && (
        <div style={{ marginBottom: 12 }}>
          <button
            onClick={onEdit}
            style={{
              background: 'transparent', border: '1px solid var(--border)',
              borderRadius: 999, padding: '6px 18px',
              fontWeight: 700, fontSize: '0.8rem', color: 'var(--text)',
              cursor: 'pointer', letterSpacing: '0.05em',
            }}
          >
            TAP TO EDIT
          </button>
        </div>
      )}

      {template === 'classic' && <ClassicTemplate {...templateProps} />}
      {template === 'bold' && <BoldTemplate {...templateProps} />}
      {(template === 'modern' || !['classic', 'bold'].includes(template)) && (
        <ModernTemplate {...templateProps} />
      )}
    </>
  );
}
