import Link from 'next/link';
import VoiceIcon from '../icons/VoiceIcon';
import MessageIcon from '../icons/MessageIcon';
import HistoryIcon from '../icons/HistoryIcon';
import ProfileIcon from '../icons/ProfileIcon';
import { usePathname } from 'next/navigation';

const navItems = [
  { key: 'voice', label: 'Voice', icon: (a: boolean) => <VoiceIcon active={a} />, href: '/invoice/new' },
  { key: 'message', label: 'Message', icon: (a: boolean) => <MessageIcon active={a} />, href: '/messages' },
  { key: 'history', label: 'History', icon: (a: boolean) => <HistoryIcon active={a} />, href: '/history' },
  { key: 'profile', label: 'Profile', icon: (a: boolean) => <ProfileIcon active={a} />, href: '/settings/profile' },
];

export default function BottomNav() {
  const pathname = usePathname();

  const getActiveKey = () => {
    if (pathname.startsWith('/invoice')) return 'voice';
    if (pathname.startsWith('/messages')) return 'message';
    if (pathname.startsWith('/history')) return 'history';
    if (pathname.startsWith('/settings/profile')) return 'profile';
    return ''; // Default active tab
  };

  const activeKey = getActiveKey();

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav__group">
        {navItems.map((item) => {
          const isActive = activeKey === item.key;
          const activeStyle = isActive ? { color: 'var(--brand)' } : {};

          return (
            <Link key={item.key} href={item.href} className="bottom-nav__tab" style={activeStyle}>
              {item.icon(isActive)}
              <span className="bottom-nav__label">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
