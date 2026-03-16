'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function GoogleCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setToken = useAuthStore((state) => state.setToken);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setToken(token);
      router.push('/');
    } else {
      router.push('/login');
    }
  }, [searchParams, router, setToken]);

  return (
    <main className="page-center">
      <div className="container">
        <div className="card">
          <h1 className="page-title">Logging you in...</h1>
          <p className="small-text">Please wait while we log you in with your Google account.</p>
        </div>
      </div>
    </main>
  );
}
