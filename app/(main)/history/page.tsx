'use client'
import InvoiceList from '@/modules/invoice/components/InvoiceList'

export default function HistoryPage() {

  return (
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
  )
}
