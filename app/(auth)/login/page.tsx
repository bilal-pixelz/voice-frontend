'use client'
import Link from 'next/link'
import PageHeader from '@/components/layout/PageHeader'
import LoginForm from '@/modules/auth/components/LoginForm'
import { getGoogleLoginUrl } from '@/modules/auth/api';
import { toast } from 'react-hot-toast';
import GoogleIcon from '@/components/icons/GoogleIcon';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
      if (isAuthenticated) {
        router.replace('/dashboard');
      }
    }, [isAuthenticated, router]);
    
  const handleGoogleLogin = async () => {
    try {
      const data = await getGoogleLoginUrl();
      if (data.code_verifier) {
        localStorage.setItem('code_verifier', data.code_verifier);
      }
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        toast.error('Could not get Google authorization URL.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to get Google login URL');
      console.error('Failed to get Google login URL', error);
    }
  };

  return (
    <main className="page-center">
      <div className="container" style={{ width: 'min(550px, 98vw)' }}>
        <PageHeader title="Voice 2 Invoice" />

        <div className="card pb-6" style={{ marginBottom: 24 }}>
          <h2 className="page-title" style={{ fontSize: '1.5rem', marginBottom: 12 }}>
            Login
          </h2>
          <p className="small-text">Use your account to access your invoices and voice history.</p>

          <LoginForm />

          <p className="small-text" style={{ marginTop: 12 }}>
            Don&apos;t have an account? <Link href="/register">Sign up</Link> instead.
          </p>
        </div>

        <div className="card" style={{ borderStyle: 'dashed' }}>
          <p className="small-text" style={{ marginBottom: 10 }}>
            Or sign in with a provider.
          </p>
          <button
            className="button secondary"
            onClick={handleGoogleLogin}
            type="button"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <GoogleIcon />
            Login with Google
          </button>
        </div>
      </div>
    </main>
  )
}
