import { stats } from "../data";

export default function Stats() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
      {stats.map((stat) => (
        <div key={stat.name} className="card">
          <p style={{ fontSize: '12px', color: 'var(--muted)', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
            {stat.name}
          </p>
          <p style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text)', margin: 0, letterSpacing: '-0.5px' }}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
