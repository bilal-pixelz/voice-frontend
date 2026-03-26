'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getInvoiceById } from '@/modules/invoice/api';
import { Invoice } from '@/types/invoice';
import InvoiceDetail from '@/modules/invoice/components/InvoiceDetail';
import { toast } from 'react-hot-toast';

export default function InvoiceViewPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = (params as { id?: string }).id;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!invoiceId) {
      setError('Invoice ID is required');
      setLoading(false);
      return;
    }

    const loadInvoice = async () => {
      try {
        const data = await getInvoiceById(invoiceId);
        setInvoice(data);
      } catch (err: any) {
        setError(err.message || 'Unable to fetch invoice');
      } finally {
        setLoading(false);
      }
    };

    loadInvoice();
  }, [invoiceId]);

  if (loading) {
    return (
      <div className="container" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--muted)' }}>Loading invoice...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#f87171', marginBottom: 10 }}>{error}</p>
        <button className="button secondary" onClick={() => router.back()}>
          Go Back
        </button>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="container">No invoice found.</div>
    );
  }

  return (
    <div className="container" style={{ paddingBottom: '110px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Invoice Details</h1>
        <button className="button secondary" onClick={() => router.push('/invoice/new')}>
          New Voice Invoice
        </button>
      </div>

      <InvoiceDetail invoice={invoice} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <button className="button secondary" onClick={() => router.back()}>
          Back
        </button>
        <button className="button" onClick={() => toast.success('Syncing to Xero...')}>
          Sync Xero
        </button>
      </div>
    </div>
  );
}
