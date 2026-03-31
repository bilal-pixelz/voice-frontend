const INTEGRATIONS = [
  { name: 'Xero', sub: 'Connected', active: true, initial: 'X', color: '#13b5ea' },
  { name: 'MYOB', sub: 'Accounting', active: false, initial: 'M', color: '#6366f1' },
  { name: 'QuickBooks', sub: 'Accounting', active: false, initial: 'Q', color: '#22c55e' },
];

export default function Integrations() {
  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--muted)', textTransform: 'uppercase', margin: '0 0 14px' }}>
        Integrations
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {INTEGRATIONS.map((intg) => (
          <div
            key={intg.name}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 10, border: '1px solid var(--border)',
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 8, flexShrink: 0,
              background: `${intg.color}22`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 800, color: intg.color,
            }}>
              {intg.initial}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{intg.name}</p>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--muted)' }}>{intg.sub}</p>
            </div>
            <span style={{
              fontSize: 12, fontWeight: 600, padding: '4px 14px', borderRadius: 8,
              border: `1px solid ${intg.active ? '#22c55e44' : 'var(--border)'}`,
              color: intg.active ? '#22c55e' : 'var(--text)',
              background: intg.active ? 'rgba(34,197,94,0.08)' : 'transparent',
              cursor: intg.active ? 'default' : 'pointer',
            }}>
              {intg.active ? 'Active' : 'Connect'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
