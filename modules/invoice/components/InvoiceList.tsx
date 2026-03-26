'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getInvoices } from '@/modules/xero/api';
import { useInvoiceStore } from '@/store/invoiceStore';
import { Invoice } from '@/types/invoice';

export default function InvoiceList() {
  const { invoices, addInvoice } = useInvoiceStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedInvoices = await getInvoices();
        // Assuming getInvoices returns an array of invoices
        if (Array.isArray(fetchedInvoices)) {
          fetchedInvoices.forEach((invoice: Invoice) => addInvoice(invoice));
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [addInvoice]);

  if (loading) {
    return <div>Loading invoices...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Invoice List</h2>
      {invoices.length === 0 ? (
        <p>No invoices found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {invoices.map((invoice) => (
            <li
              key={invoice.id}
              style={{
                marginBottom: 12,
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 10,
                padding: 12,
                background: 'var(--card)',
              }}
            >
              <Link href={`/invoice/${invoice.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                <p style={{ margin: '0 0 4px 0', fontWeight: 700 }}>{invoice.recipient}</p>
                <p style={{ margin: '0', color: 'var(--muted)' }}>Amount: {invoice.amount}</p>
                <p style={{ margin: '0', color: 'var(--muted)' }}>Due Date: {invoice.dueDate}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
