'use client';

import { useState, useEffect, useRef } from 'react';
import Logo from "./Logo";
import HelpIcon from "../icons/HelpIcon";
import SunIcon from "../icons/SunIcon";
import apiClient from '@/lib/api-client';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

function useHideOnScroll() {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 10) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return visible;
}


// Theme is now handled globally via CSS variables in globals.css

const Header = () => {
  const visible = useHideOnScroll();
  const [theme, setTheme] = useState<'dark' | 'light'>(() =>
    typeof window !== 'undefined' && document.body.classList.contains('light') ? 'light' : 'dark'
  );
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (e) {
      // ignore error, still clear local state
    }
    logout();
    router.replace('/login');
  };

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <header
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: '64px',
        background: 'var(--header-bg)',
        borderBottom: '1px solid var(--border)',
        boxShadow: 'var(--header-shadow)',
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.3s ease',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        //justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'center',
          gap: '50%'
        }}
      >
        <Logo />
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
            onClick={() => router.push('/help')}
            aria-label="Help & Support"
          >
            <HelpIcon />
          </button>
          <button
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <SunIcon />
          </button>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '6px 16px', borderRadius: '20px',
              border: '1px solid rgba(34, 197, 94, 0.35)',
              background: 'rgba(34, 197, 94, 0.08)',
              cursor: 'pointer',
              outline: 'none',
              borderWidth: 1,
              borderStyle: 'solid',
            }}
            aria-label="Log out"
          >
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--success)', flexShrink: 0 }} />
            <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)', letterSpacing: '0.1px' }}>Log Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
