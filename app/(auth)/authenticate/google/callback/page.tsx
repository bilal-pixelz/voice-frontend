'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { googleCallback } from '@/modules/auth/api';

export default function GoogleCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setToken = useAuthStore((state) => state.setToken);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");

    const savedState = localStorage.getItem("oauth_state");
    if (state !== savedState) {
        router.push("/login?error=state_mismatch");
        return;
      }
    
    if (code && state) {
      googleCallback(state, code)
        .then((data) => {
          setToken(data.access_token);
          router.push('/');
        })
        .catch(() => {
          router.push('/login');
        });
    } else {
      router.push('/login?error=missing_params');
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
