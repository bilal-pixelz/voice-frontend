'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import PageHeader from '@/components/layout/PageHeader'

export default function Home() {
  const router = useRouter()
  const { user, error, isLoading } = useUser();

  useEffect(() => {
    if (user) {
      router.replace('/history')
    }
  }, [user, router])

  if (isLoading) {
    return (
      <main className="page-center">
        <div className="container">
          <div className="card">
            <h1 className="page-title">Welcome back</h1>
            <p className="small-text">Loading your account…</p>
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
            Welcome
          </h2>
          <p className="small-text">Sign in to view your invoice history and start recording voice notes.</p>
          <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
            <Link href="/login" className="button">
              Log in
            </Link>
            <Link href="/signup" className="button secondary">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
