import { Invoice } from '@/types/invoice';
import { CompanyProfile } from '@/modules/profile/api';

interface Props {
  invoice: Invoice;
  taxEnabled: boolean;
  accentColor: string;
  company?: CompanyProfile | null;
}

const fmt = (value: number | null | undefined, currency = 'AUD') =>
  (value ?? 0).toLocaleString('en-AU', { style: 'currency', currency });

function contrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55 ? '#111827' : '#ffffff';
}

export default function BoldTemplate({ invoice, taxEnabled, accentColor, company }: Props) {
  const currency = invoice.currency || 'AUD';
  const gst = invoice.tax ?? 0;
  const textOnAccent = contrastColor(accentColor);

  return (
    <div style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 16,
      overflow: 'hidden',
    }}>
      {/* Solid accent header */}
      <div style={{ background: accentColor, padding: '22px 28px' }}>
        {/* Company row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            {company?.name ? (
              <>
                <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 800, color: textOnAccent }}>
                  {company.name}
                </p>
                {company.abn && (
                  <p style={{ margin: 0, fontSize: 11, color: textOnAccent, opacity: 0.75 }}>
                    ABN {company.abn}
                  </p>
                )}
              </>
            ) : (
              <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: textOnAccent, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {taxEnabled ? 'Tax Invoice' : 'Invoice'}
              </p>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: '0 0 2px', fontSize: 10, fontWeight: 700, color: textOnAccent, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {company?.name ? (taxEnabled ? 'Tax Invoice' : 'Invoice') : ''}
            </p>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 900, color: textOnAccent, fontFamily: 'monospace', letterSpacing: '-0.02em' }}>
              {invoice.invoice_number}
            </p>
          </div>
        </div>

        {/* Bill To + Dates */}
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${textOnAccent}33`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <p style={{ margin: '0 0 3px', fontSize: 10, fontWeight: 700, color: textOnAccent, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Bill To
            </p>
            <p style={{ margin: '0 0 2px', fontSize: 15, fontWeight: 800, color: textOnAccent }}>
              {invoice.customer_name ?? '—'}
            </p>
            {invoice.customer_email && (
              <p style={{ margin: '0 0 1px', fontSize: 12, color: textOnAccent, opacity: 0.8 }}>{invoice.customer_email}</p>
            )}
            {invoice.customer_phone && (
              <p style={{ margin: 0, fontSize: 12, color: textOnAccent, opacity: 0.8 }}>{invoice.customer_phone}</p>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: '0 0 2px', fontSize: 10, fontWeight: 700, color: textOnAccent, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Issue Date
            </p>
            <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 700, color: textOnAccent }}>
              {invoice.invoice_date ?? '—'}
            </p>
            <p style={{ margin: '0 0 2px', fontSize: 10, fontWeight: 700, color: textOnAccent, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Due Date
            </p>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: textOnAccent }}>
              {invoice.due_date ?? '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Line items */}
      <div style={{ padding: '0 28px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr',
          padding: '14px 0', borderBottom: `2px solid ${accentColor}`,
        }}>
          {['Description', 'Qty', 'Price', 'Total'].map((h, i) => (
            <span key={h} style={{
              fontSize: 11, fontWeight: 800, color: accentColor,
              textTransform: 'uppercase', letterSpacing: '0.08em',
              textAlign: i > 0 ? 'right' : 'left',
            }}>
              {h}
            </span>
          ))}
        </div>
        {invoice.line_items?.length ? invoice.line_items.map((item, i) => (
          <div key={item.id ?? i} style={{
            display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr',
            padding: '15px 0', borderBottom: '1px solid var(--border)', alignItems: 'center',
          }}>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{item.description}</p>
            <p style={{ margin: 0, textAlign: 'right', fontSize: 13, color: 'var(--muted)' }}>{item.quantity ?? 1}</p>
            <p style={{ margin: 0, textAlign: 'right', fontSize: 13, color: 'var(--muted)' }}>{fmt(item.unit_price, currency)}</p>
            <p style={{ margin: 0, textAlign: 'right', fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{fmt(item.total, currency)}</p>
          </div>
        )) : (
          <p style={{ padding: '16px 0', color: 'var(--muted)', margin: 0 }}>No line items.</p>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '20px 28px', display: 'flex', justifyContent: 'space-between', gap: 24 }}>
        <div style={{ flex: 1 }}>
          <p style={{ margin: '0 0 5px', fontSize: 11, fontWeight: 800, color: accentColor, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Notes
          </p>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
            {invoice.notes ?? 'No notes provided.'}
          </p>
        </div>
        <div style={{
          minWidth: 210,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid var(--border)',
          borderRadius: 12, padding: '14px 16px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>Subtotal</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{fmt(invoice.subtotal, currency)}</span>
          </div>
          {taxEnabled && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>GST</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{fmt(gst, currency)}</span>
            </div>
          )}
          <div style={{ borderTop: `2px solid ${accentColor}`, paddingTop: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 12, fontWeight: 900, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total</span>
              <span style={{ fontSize: 20, fontWeight: 900, color: accentColor }}>{fmt(invoice.total, currency)}</span>
            </div>
            {taxEnabled && (
              <p style={{ margin: '5px 0 0', textAlign: 'right', fontSize: 11, color: 'var(--muted)' }}>
                Incl. GST {fmt(gst, currency)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
