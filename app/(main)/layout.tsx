// app/(main)/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace('/login');
    }
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated) return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center">
      <p className="text-[#8896A5] text-sm">Loading...</p>
    </div>
  );

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen font-sans">
      <Header />
      <div>{children}</div>
      <BottomNav />
    </div>
  );
}