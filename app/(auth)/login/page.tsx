'use client'
import Link from 'next/link'
import PageHeader from '@/components/layout/PageHeader'
import LoginForm from '@/modules/auth/components/LoginForm'
import { getGoogleLoginUrl } from '@/modules/auth/api'

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    try {
      const data = await getGoogleLoginUrl();
      if (data.data.authorization_url) {
        window.location.href = data.data.authorization_url;
      }
    } catch (error) {
      console.error('Failed to get Google login URL', error);
    }
  };

  return (
    <main className="page-center">
      <div className="container">
        <PageHeader title="Voice 2 Invoice" />

        <div className="card">
          <h2 className="page-title" style={{ fontSize: '1.5rem', marginBottom: 12 }}>
            Login
          </h2>
          <p className="small-text">Use your account to access your invoices and voice history.</p>

          <LoginForm />

          <p className="small-text" style={{ marginTop: 12 }}>
            Don't have an account? <Link href="/register">Sign up</Link> instead.
          </p>
        </div>

        <div className="card" style={{ borderStyle: 'dashed' }}>
          <p className="small-text" style={{ marginBottom: 10 }}>
            Or sign in with a provider.
          </p>
          <button className="button secondary" onClick={handleGoogleLogin} type="button">
            Login with Google
          </button>
        </div>
      </div>
    </main>
  )
}
