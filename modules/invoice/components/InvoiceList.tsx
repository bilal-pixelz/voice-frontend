'use client';

import { useEffect, useState } from 'react';
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
        <ul>
          {invoices.map((invoice) => (
            <li key={invoice.id}>
              <p>Recipient: {invoice.recipient}</p>
              <p>Amount: {invoice.amount}</p>
              <p>Due Date: {invoice.dueDate}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
