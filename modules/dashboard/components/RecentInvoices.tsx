import Link from 'next/link';
import { Invoice } from '@/types/invoice';

const statusColor = (status: string) => {
  if (status === 'paid') return { bg: 'rgba(34,197,94,0.12)', color: '#22C55E' };
  if (status === 'draft' || status === 'sent') return { bg: 'rgba(234,179,8,0.12)', color: '#EAB308' };
  if (status === 'overdue') return { bg: 'rgba(239,68,68,0.12)', color: '#EF4444' };
  if (status === 'synced') return { bg: 'rgba(56,189,248,0.15)', color: '#38bdf8' };
  return { bg: 'rgba(255,255,255,0.08)', color: 'var(--muted)' };
};

interface Props {
  invoices: Invoice[];
}

export default function RecentInvoices({ invoices }: Props) {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>Recent Invoices</h2>
      </div>

      {invoices.length === 0 ? (
        <p style={{ padding: '24px 20px', color: 'var(--muted)', fontSize: 13, textAlign: 'center', margin: 0 }}>
          No invoices yet. Create your first one!
        </p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                {['Invoice ID', 'Customer', 'Date', 'Amount', 'Status'].map((h) => (
                  <th key={h} style={{
                    padding: '10px 16px', textAlign: 'left',
                    fontSize: '11px', fontWeight: 600,
                    color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.6px',
                    whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => {
                const sc = statusColor(invoice.status);
                return (
                  <tr key={invoice.id} style={{ borderTop: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 16px', fontSize: '13px', whiteSpace: 'nowrap' }}>
                      <Link href={`/invoice/${invoice.id}`} style={{ color: 'var(--brand)', fontWeight: 500, textDecoration: 'none' }}>
                        {invoice.invoice_number}
                      </Link>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text)', whiteSpace: 'nowrap' }}>
                      {invoice.customer_name ?? '—'}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                      {invoice.invoice_date ?? '—'}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      ${(invoice.total ?? 0).toFixed(2)}
                    </td>
                    <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: '20px',
                        fontSize: '12px', fontWeight: 600,
                        background: sc.bg, color: sc.color,
                        textTransform: 'capitalize',
                      }}>
                        {invoice.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
