'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { googleCallback } from '@/modules/auth/api';
import { toast } from 'react-hot-toast';

export default function GoogleCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setToken = useAuthStore((state) => state.setToken);

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const codeVerifier = localStorage.getItem('code_verifier');

    if (code && state && codeVerifier) {
      googleCallback(state, code, codeVerifier)
        .then((data) => {
          setToken(data.access_token);
          localStorage.removeItem('code_verifier');
          localStorage.removeItem('oauth_state');
          router.push('/dashboard');
        })
        .catch((error) => {
          toast.error(error.message);
          localStorage.removeItem('code_verifier');
          localStorage.removeItem('oauth_state');
          router.push('/login');
        });
    } else {
      toast.error('Invalid callback state. Please try again.');
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
