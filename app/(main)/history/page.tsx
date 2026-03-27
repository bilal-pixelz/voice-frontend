'use client'
import { useState } from 'react'
import InvoiceList from '@/modules/invoice/components/InvoiceList'

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<'invoices' | 'voice_notes'>('invoices')
  const [search, setSearch] = useState('')

  return (
    <div className="container">
      <h1 className="page-title" style={{ marginBottom: 20 }}>History</h1>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="var(--muted)" strokeWidth="2"
          style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}
        >
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          className="input"
          type="search"
          placeholder="Search history..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', paddingLeft: 40 }}
        />
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: 8,
        marginBottom: 20,
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        padding: 6,
      }}>
        <button
          onClick={() => setActiveTab('invoices')}
          style={{
            flex: 1, padding: '10px 12px', border: 'none', borderRadius: 10,
            fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer',
            background: activeTab === 'invoices' ? 'var(--card-strong)' : 'transparent',
            color: activeTab === 'invoices' ? 'var(--text)' : 'var(--muted)',
            transition: 'all 120ms ease',
          }}
        >
          Invoices
        </button>
        <button
          onClick={() => setActiveTab('voice_notes')}
          style={{
            flex: 1, padding: '10px 12px', border: 'none', borderRadius: 10,
            fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer',
            background: activeTab === 'voice_notes' ? 'var(--card-strong)' : 'transparent',
            color: activeTab === 'voice_notes' ? 'var(--text)' : 'var(--muted)',
            transition: 'all 120ms ease',
          }}
        >
          Voice Notes
        </button>
      </div>

      {activeTab === 'invoices' && <InvoiceList search={search} />}
      {activeTab === 'voice_notes' && (
        <p style={{ color: 'var(--muted)', textAlign: 'center', marginTop: 40 }}>
          No voice notes yet.
        </p>
      )}
    </div>
  )
}