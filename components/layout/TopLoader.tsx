'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function TopLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevPath = useRef(pathname);

  useEffect(() => {
    // Route changed — complete the bar
    if (visible) {
      setProgress(100);
      const t = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    // Detect clicks on links/buttons that trigger navigation
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('#') || href === pathname) return;

      // Start the loader
      setVisible(true);
      setProgress(20);

      if (timerRef.current) clearInterval(timerRef.current);
      let p = 20;
      timerRef.current = setInterval(() => {
        p += Math.random() * 12;
        if (p > 90) p = 90;
        setProgress(p);
      }, 200);
    };

    document.addEventListener('click', handleClick, true);
    return () => {
      document.removeEventListener('click', handleClick, true);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [pathname]);

  // Clear interval when route completes
  useEffect(() => {
    if (progress >= 100 && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [progress]);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
      height: 3,
      background: 'transparent',
    }}>
      <div style={{
        height: '100%',
        width: `${progress}%`,
        background: 'var(--brand)',
        boxShadow: '0 0 8px var(--brand)',
        transition: progress >= 100 ? 'width 0.2s ease, opacity 0.3s ease' : 'width 0.3s ease',
        opacity: progress >= 100 ? 0 : 1,
        borderRadius: '0 2px 2px 0',
      }} />
    </div>
  );
}
