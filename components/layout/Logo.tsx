import { useRouter } from 'next/navigation';

const Logo = () => {
  const router = useRouter();

  return (
    <div onClick={() => router.push('/dashboard')} style={{ cursor: "pointer", display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8, height: 40, userSelect: 'none' }}>
      <img src="/logo.svg" alt="Voice 2 Invoice Logo" width={36} height={36} style={{ display: 'block', flexShrink: 0 }} />
      <div style={{
        display: 'flex',
        alignItems: 'center',
        fontWeight: 700,
        fontSize: '1.25rem',
        color: '#e6eefb',
        letterSpacing: '-0.02em',
        lineHeight: 1,
        marginLeft: 2
      }}>
        <span style={{ fontWeight: 700 }}>Voice</span>
        <span style={{ color: '#0ea5e9', fontWeight: 700, marginLeft: 4 }}>2</span>
        <span style={{ color: '#38bdf8', fontWeight: 700, marginLeft: 2 }}>Invoice</span>
      </div>
    </div>
  );
};

export default Logo;
