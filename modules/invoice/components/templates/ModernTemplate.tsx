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

export default function ModernTemplate({ invoice, taxEnabled, accentColor, company }: Props) {
  const currency = invoice.currency || 'AUD';
  const gst = invoice.tax ?? 0;

  return (
    <div style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 16,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 24, padding: '24px 28px',
        borderBottom: '1px solid var(--border)',
      }}>
        {/* Left: FROM + BILL TO */}
        <div>
          {company?.name && (
            <div style={{ marginBottom: 14 }}>
              <p style={{ margin: '0 0 2px', fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                From
              </p>
              <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
                {company.name}
              </p>
              {company.abn && (
                <p style={{ margin: 0, fontSize: 12, color: 'var(--muted)' }}>ABN {company.abn}</p>
              )}
            </div>
          )}
          <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Bill To
          </p>
          <p style={{ margin: '0 0 3px', fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>
            {invoice.customer_name ?? '—'}
          </p>
          {invoice.customer_email && (
            <p style={{ margin: '0 0 2px', fontSize: 13, color: 'var(--muted)' }}>{invoice.customer_email}</p>
          )}
          {invoice.customer_phone && (
            <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)' }}>{invoice.customer_phone}</p>
          )}
        </div>

        {/* Right: Invoice meta */}
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: '0 0 6px', fontSize: 13, fontWeight: 800, color: accentColor, letterSpacing: '0.08em' }}>
            {taxEnabled ? 'TAX INVOICE' : 'INVOICE'}
          </p>
          <p style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: 'var(--text)', fontFamily: 'monospace' }}>
            {invoice.invoice_number}
          </p>
          <MetaRight label="Date" value={invoice.invoice_date ?? '—'} />
          <MetaRight label="Due Date" value={invoice.due_date ?? '—'} />
        </div>
      </div>

      {/* Line items */}
      <div style={{ padding: '0 28px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr',
          padding: '12px 0', borderBottom: '1px solid var(--border)',
        }}>
          {['Description', 'Qty', 'Price', 'Total'].map((h, i) => (
            <span key={h} style={{
              fontSize: 11, fontWeight: 600, color: 'var(--muted)',
              textTransform: 'uppercase', letterSpacing: '0.06em',
              textAlign: i > 0 ? 'right' : 'left',
            }}>
              {h}
            </span>
          ))}
        </div>

        {invoice.line_items?.length ? invoice.line_items.map((item, i) => (
          <div key={item.id ?? i} style={{
            display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr',
            padding: '14px 0', borderBottom: '1px solid var(--border)', alignItems: 'center',
          }}>
            <p style={{ margin: 0, fontWeight: 600, color: 'var(--text)' }}>{item.description}</p>
            <p style={{ margin: 0, textAlign: 'right', color: 'var(--text)' }}>{item.quantity ?? 1}</p>
            <p style={{ margin: 0, textAlign: 'right', color: 'var(--text)' }}>{fmt(item.unit_price, currency)}</p>
            <p style={{ margin: 0, textAlign: 'right', fontWeight: 600, color: 'var(--text)' }}>{fmt(item.total, currency)}</p>
          </div>
        )) : (
          <p style={{ padding: '16px 0', color: 'var(--muted)', margin: 0 }}>No line items.</p>
        )}
      </div>

      {/* Footer */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 24, padding: '20px 28px',
      }}>
        <div>
          <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Notes &amp; Payment Terms
          </p>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
            {invoice.notes ?? 'No notes provided.'}
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <TotalRow label="Subtotal" value={fmt(invoice.subtotal, currency)} />
          {taxEnabled && <TotalRow label="GST" value={fmt(gst, currency)} />}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, marginTop: 2 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>Total Amount</span>
              <span style={{ fontWeight: 700, fontSize: 17, color: accentColor }}>{fmt(invoice.total, currency)}</span>
            </div>
            {taxEnabled && (
              <p style={{ margin: '4px 0 0', textAlign: 'right', fontSize: 11, color: 'var(--muted)' }}>
                Includes GST of {fmt(gst, currency)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaRight({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <p style={{ margin: '0 0 1px', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{value}</p>
    </div>
  );
}

function TotalRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ fontSize: 13, color: 'var(--muted)' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{value}</span>
    </div>
  );
}
