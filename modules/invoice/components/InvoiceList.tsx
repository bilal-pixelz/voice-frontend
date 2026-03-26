'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/api-client';
import { Invoice } from '@/types/invoice';

export default function InvoiceList() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.get('/invoices/');
        setInvoices(res.data.data);  // ← your API wraps in { success, data, message }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  if (loading) return <div className="container">Loading invoices...</div>;
  if (error) return <div className="container">Error: {error}</div>;

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Invoices</h1>
      </div>

      {invoices.length === 0 ? (
        <p style={{ color: 'var(--muted)' }}>No invoices found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {invoices.map((invoice) => (
            <li key={invoice.id}>
              <Link href={`/invoice/${invoice.id}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ padding: '16px 20px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ margin: '0 0 4px', fontWeight: 700, color: 'var(--text)' }}>
                        {invoice.customer_name ?? 'Unknown Customer'}
                      </p>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)' }}>
                        {invoice.due_date ? `Due: ${invoice.due_date}` : 'No due date'}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: '0 0 4px', fontWeight: 700, color: 'var(--text)' }}>
                        {invoice.currency} ${invoice.total?.toFixed(2) ?? '0.00'}
                      </p>
                      <span style={{
                        fontSize: '0.75rem',
                        padding: '3px 10px',
                        borderRadius: '999px',
                        background: invoice.status === 'paid' ? 'rgba(16,185,129,0.15)' :
                                    invoice.status === 'overdue' ? 'rgba(239,68,68,0.15)' :
                                    'rgba(255,255,255,0.08)',
                        color: invoice.status === 'paid' ? 'var(--success)' :
                               invoice.status === 'overdue' ? '#ef4444' :
                               'var(--muted)',
                      }}>
                        {invoice.status}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}