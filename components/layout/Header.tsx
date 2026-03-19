'use client';

import { useState, useEffect, useRef } from 'react';
import Logo from "./Logo";
import HelpIcon from "../icons/HelpIcon";
import SunIcon from "../icons/SunIcon";

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

const Header = () => {
  const visible = useHideOnScroll();

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: '60px',
      background: 'var(--bg)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px',
      transform: visible ? 'translateY(0)' : 'translateY(-100%)',
      transition: 'transform 0.3s ease',
    }}>
      <Logo />
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}>
          <HelpIcon />
        </button>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}>
          <SunIcon />
        </button>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '7px',
          padding: '6px 14px', borderRadius: '20px',
          border: '1px solid rgba(34, 197, 94, 0.35)',
          background: 'rgba(34, 197, 94, 0.08)',
        }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--success)', flexShrink: 0 }} />
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)', letterSpacing: '0.1px' }}>Xero Connected</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
