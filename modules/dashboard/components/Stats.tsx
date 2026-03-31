interface StatsProps {
  stats: {
    total_invoices: number;
    pending: number;
    overdue: number;
    paid_total: number;
    this_month: number;
  } | null;
}

const fmt = (n: number) =>
  n.toLocaleString('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 0, maximumFractionDigits: 0 });

export default function Stats({ stats }: StatsProps) {
  const s = stats;

  return (
    <div style={{ marginBottom: 24 }}>
      {/* Hero card — paid total */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(14,165,233,0.12) 0%, rgba(16,185,129,0.08) 100%)',
        border: '1px solid rgba(14,165,233,0.2)',
        borderRadius: 16, padding: '20px 24px', marginBottom: 12,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Total Paid
          </p>
          <p style={{ margin: 0, fontSize: 32, fontWeight: 800, color: 'var(--text)', letterSpacing: '-1px' }}>
            {s ? fmt(s.paid_total) : '—'}
          </p>
        </div>
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: 'rgba(14,165,233,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22,
        }}>
          $
        </div>
      </div>

      {/* Metric row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        <MetricPill label="Total" value={s?.total_invoices} color="#0ea5e9" />
        <MetricPill label="This Month" value={s?.this_month} color="#8b5cf6" />
        <MetricPill label="Pending" value={s?.pending} color="#eab308" />
        <MetricPill label="Overdue" value={s?.overdue} color="#ef4444" />
      </div>
    </div>
  );
}

function MetricPill({ label, value, color }: { label: string; value?: number; color: string }) {
  return (
    <div style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: '14px 12px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: color, opacity: 0.6, borderRadius: '12px 12px 0 0',
      }} />
      <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.5px' }}>
        {value !== undefined ? value : '—'}
      </p>
      <p style={{ margin: 0, fontSize: 10, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center' }}>
        {label}
      </p>
    </div>
  );
}
