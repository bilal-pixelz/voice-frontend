import { recentInvoices } from "../data";

export default function RecentInvoices() {
  const statusColor = (status: string) => {
    if (status === 'Paid') return { bg: 'rgba(34,197,94,0.12)', color: '#22C55E' };
    if (status === 'Pending') return { bg: 'rgba(234,179,8,0.12)', color: '#EAB308' };
    return { bg: 'rgba(239,68,68,0.12)', color: '#EF4444' };
  };

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>Recent Invoices</h2>
      </div>
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
            {recentInvoices.map((invoice) => (
              <tr key={invoice.id} style={{
                borderTop: '1px solid var(--border)',
              }}>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--brand)', fontWeight: 500, whiteSpace: 'nowrap' }}>{invoice.id}</td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text)', whiteSpace: 'nowrap' }}>{invoice.customer}</td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{invoice.date}</td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text)', fontWeight: 600, whiteSpace: 'nowrap' }}>{invoice.amount}</td>
                <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                  <span style={{
                    padding: '3px 10px', borderRadius: '20px',
                    fontSize: '12px', fontWeight: 600,
                    background: statusColor(invoice.status).bg,
                    color: statusColor(invoice.status).color,
                  }}>
                    {invoice.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
