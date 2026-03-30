'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/api-client';
import { Invoice } from '@/types/invoice';

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  draft:   { bg: 'rgba(255,255,255,0.08)',     color: 'var(--muted)' },
  sent:    { bg: 'rgba(14,165,233,0.15)',       color: 'var(--brand)' },
  paid:    { bg: 'rgba(16,185,129,0.15)',       color: 'var(--success)' },
  overdue: { bg: 'rgba(239,68,68,0.15)',        color: '#ef4444' },
  synced:  { bg: 'rgba(56,189,248,0.15)',       color: '#38bdf8' },
}

const SOURCE_LABEL: Record<string, string> = {
  whatsapp: 'WhatsApp',
  web: 'Voice',
  upload: 'Upload',
}

export default function InvoiceList({ search = '' }: { search?: string }) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.get('/invoices/');
        setInvoices(res.data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const filtered = invoices.filter(inv =>
    !search ||
    inv.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
    inv.invoice_number?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p style={{ color: 'var(--muted)' }}>Loading...</p>;
  if (error) return <p style={{ color: '#ef4444' }}>Error: {error}</p>;
  if (filtered.length === 0) return (
    <p style={{ color: 'var(--muted)', textAlign: 'center', marginTop: 40 }}>
      No invoices found.
    </p>
  );

  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {filtered.map((invoice) => {
        const status = STATUS_STYLES[invoice.status] ?? STATUS_STYLES.draft;
        return (
          <li key={invoice.id}>
            <Link href={`/invoice/${invoice.id}`} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: '16px 20px', cursor: 'pointer' }}>

                {/* Top row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>
                      {invoice.customer_name ?? 'Unknown Customer'}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--muted)' }}>
                      {invoice.invoice_date ?? '—'}
                      <span style={{ margin: '0 6px' }}>•</span>
                      {SOURCE_LABEL[invoice.source] ?? invoice.source}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '0 0 6px', fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>
                      ${invoice.total?.toFixed(2) ?? '0.00'}
                    </p>
                    <span style={{
                      fontSize: '0.75rem', padding: '3px 10px',
                      borderRadius: '999px',
                      background: status.bg,
                      color: status.color,
                      fontWeight: 600,
                      textTransform: 'capitalize',
                    }}>
                      {invoice.status}
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: 'var(--border)', marginBottom: 12 }} />

                {/* Bottom row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--muted)' }}>
                    {invoice.line_items?.length ?? 0} line item{invoice.line_items?.length !== 1 ? 's' : ''}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{
                      fontSize: '0.75rem', padding: '4px 12px',
                      borderRadius: '999px',
                      border: '1px solid var(--border)',
                      color: 'var(--text)',
                      fontWeight: 600,
                      letterSpacing: '0.03em',
                    }}>
                      TAP TO EDIT
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontFamily: 'monospace' }}>
                      ID: {invoice.invoice_number ?? '—'}
                    </span>
                  </div>
                </div>

              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}