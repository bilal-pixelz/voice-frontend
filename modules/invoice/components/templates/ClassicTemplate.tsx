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

export default function ClassicTemplate({ invoice, taxEnabled, accentColor, company }: Props) {
  const currency = invoice.currency || 'AUD';
  const gst = invoice.tax ?? 0;

  return (
    <div style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 16,
      overflow: 'hidden',
    }}>
      {/* Title bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '18px 28px',
        borderBottom: '2px solid var(--border)',
      }}>
        <div>
          <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>
            {taxEnabled ? 'TAX INVOICE' : 'INVOICE'}
          </span>
          {company?.name && (
            <p style={{ margin: '3px 0 0', fontSize: 12, color: 'var(--muted)' }}>
              {company.name}{company.abn ? ` · ABN ${company.abn}` : ''}
            </p>
          )}
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: accentColor, fontFamily: 'monospace' }}>
            {invoice.invoice_number}
          </p>
        </div>
      </div>

      {/* Info: Bill To + Dates */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        padding: '18px 28px',
        borderBottom: '1px solid var(--border)',
        gap: 24,
      }}>
        <div>
          <p style={{ margin: '0 0 5px', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            Bill To
          </p>
          <p style={{ margin: '0 0 3px', fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
            {invoice.customer_name ?? '—'}
          </p>
          {invoice.customer_email && (
            <p style={{ margin: '0 0 2px', fontSize: 13, color: 'var(--muted)' }}>{invoice.customer_email}</p>
          )}
          {invoice.customer_phone && (
            <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)' }}>{invoice.customer_phone}</p>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <MetaRow label="Invoice Date" value={invoice.invoice_date ?? '—'} />
          <MetaRow label="Due Date" value={invoice.due_date ?? '—'} />
          <MetaRow label="Currency" value={currency} />
        </div>
      </div>

      {/* Line items */}
      <div>
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr',
          padding: '10px 28px',
          background: 'rgba(255,255,255,0.04)',
          borderBottom: '1px solid var(--border)',
        }}>
          {['Description', 'Qty', 'Price', 'Total'].map((h, i) => (
            <span key={h} style={{
              fontSize: 11, fontWeight: 700, color: 'var(--muted)',
              textTransform: 'uppercase', letterSpacing: '0.07em',
              textAlign: i > 0 ? 'right' : 'left',
            }}>
              {h}
            </span>
          ))}
        </div>
        {invoice.line_items?.length ? invoice.line_items.map((item, i) => (
          <div key={item.id ?? i} style={{
            display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr',
            padding: '13px 28px',
            borderBottom: '1px solid var(--border)',
            alignItems: 'center',
          }}>
            <p style={{ margin: 0, fontSize: 14, color: 'var(--text)' }}>{item.description}</p>
            <p style={{ margin: 0, textAlign: 'right', fontSize: 13, color: 'var(--muted)' }}>{item.quantity ?? 1}</p>
            <p style={{ margin: 0, textAlign: 'right', fontSize: 13, color: 'var(--muted)' }}>{fmt(item.unit_price, currency)}</p>
            <p style={{ margin: 0, textAlign: 'right', fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{fmt(item.total, currency)}</p>
          </div>
        )) : (
          <p style={{ padding: '16px 28px', color: 'var(--muted)', margin: 0 }}>No line items.</p>
        )}
      </div>

      {/* Footer */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 200px',
        gap: 24, padding: '20px 28px',
      }}>
        <div>
          <p style={{ margin: '0 0 5px', fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Notes
          </p>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
            {invoice.notes ?? 'No notes provided.'}
          </p>
        </div>
        <div style={{ borderLeft: '2px solid var(--border)', paddingLeft: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>Subtotal</span>
            <span style={{ fontSize: 13, color: 'var(--text)' }}>{fmt(invoice.subtotal, currency)}</span>
          </div>
          {taxEnabled && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>Tax (GST)</span>
              <span style={{ fontSize: 13, color: 'var(--text)' }}>{fmt(gst, currency)}</span>
            </div>
          )}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Total
              </span>
              <span style={{ fontSize: 16, fontWeight: 800, color: accentColor }}>
                {fmt(invoice.total, currency)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{value}</span>
    </div>
  );
}
