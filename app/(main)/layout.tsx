// app/(main)/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isTokenExpired, logout } = useAuthStore();
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      if (!isAuthenticated || isTokenExpired()) {
        logout();
        router.replace('/login');
      }
    }
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated) return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center">
      <p className="text-[#8896A5] text-sm">Loading...</p>
    </div>
  );

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen font-sans flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-start w-full" style={{ paddingTop: '84px' }}>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}