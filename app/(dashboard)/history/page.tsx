'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@auth0/nextjs-auth0/client'
import BottomNav from '@/components/layout/BottomNav'
import PageHeader from '@/components/layout/PageHeader'
import InvoiceList from '@/modules/invoice/components/InvoiceList'

export default function HistoryPage() {
  const router = useRouter()
  const { user, isLoading } = useUser()

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <main className="page-center">
        <div className="container">
          <div className="card">
            <h1 className="page-title">Loading your history…</h1>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="page-center">
      <div className="container">
        <PageHeader title="History" />

        <div className="card" style={{ padding: 18 }}>
          <input
            className="input"
            type="search"
            placeholder="Search history…"
            style={{ width: '100%', marginBottom: 12 }}
          />

          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <button className="button secondary" style={{ flex: 1, padding: '10px 12px' }}>
              Invoices
            </button>
            <button className="button secondary" style={{ flex: 1, padding: '10px 12px' }}>
              Voice Notes
            </button>
          </div>

          <InvoiceList />
        </div>
      </div>

      <BottomNav />
    </main>
  )
}
