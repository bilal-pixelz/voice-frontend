'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import PageHeader from '@/components/layout/PageHeader';
import RegisterForm from '@/modules/auth/components/RegisterForm';
import { getGoogleLoginUrl } from '@/modules/auth/api';
import { toast } from 'react-hot-toast';
import GoogleIcon from '@/components/icons/GoogleIcon';

export default function SignupPage() {
  const router = useRouter();
  const { user, error, isLoading } = useUser();

  useEffect(() => {
    if (user) {
      router.replace('/');
    }
  }, [user, router]);

  const handleGoogleRegister = async () => {
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

  if (isLoading) {
    return (
      <main className="page-center">
        <div className="container">
          <div className="card">
            <h1 className="page-title">Loading…</h1>
            <p className="small-text">Preparing an account for you.</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-center">
        <div className="container">
          <div className="card">
            <h1 className="page-title">Something went wrong</h1>
            <p className="small-text">{error.message}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page-center">
      <div className="container">
        <PageHeader title="Voice 2 Invoice" />

        <div className="card">
          <h2
            className="page-title"
            style={{ fontSize: '1.5rem', marginBottom: 12 }}
          >
            Sign up
          </h2>
          <p className="small-text">
            Create an account to start generating invoices from voice notes.
          </p>

          <RegisterForm />

          <p className="small-text" style={{ marginTop: 12 }}>
            Already have an account? <Link href="/login">Log in</Link>.
          </p>
        </div>

        <div className="card" style={{ borderStyle: 'dashed' }}>
          <p className="small-text" style={{ marginBottom: 10 }}>
            Or sign up with a provider.
          </p>
          <button
            className="button secondary"
            onClick={handleGoogleRegister}
            type="button"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <GoogleIcon />
            Register with Google
          </button>
        </div>
      </div>
    </main>
  );
}
