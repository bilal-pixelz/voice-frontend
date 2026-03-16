'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import PageHeader from '@/components/layout/PageHeader'
import RegisterForm from '@/modules/auth/components/RegisterForm'

export default function SignupPage() {
  const router = useRouter()
  const { user, error, isLoading } = useUser();

  useEffect(() => {
    if (user) {
      router.replace('/')
    }
  }, [user, router])

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
    )
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
    )
  }

  return (
    <main className="page-center">
      <div className="container">
        <PageHeader title="Voice 2 Invoice" />

        <div className="card">
          <h2 className="page-title" style={{ fontSize: '1.5rem', marginBottom: 12 }}>
            Sign up
          </h2>
          <p className="small-text">Create an account to start generating invoices from voice notes.</p>

          <RegisterForm />

          <p className="small-text" style={{ marginTop: 12 }}>
            Already have an account? <Link href="/login">Log in</Link>.
          </p>
        </div>
      </div>
    </main>
  )
}
