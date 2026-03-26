'use client';

import React from 'react';
import { Invoice } from '@/types/invoice';

interface InvoiceDetailProps {
  invoice: Invoice;
}

const formatCurrency = (value: number) =>
  value.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' });

export default function InvoiceDetail({ invoice }: InvoiceDetailProps) {
  const totalGST = invoice.gstAmount ?? Math.round((invoice.amount || 0) * 0.1 * 100) / 100;

  return (
    <div className="card" style={{ padding: 16, marginBottom: 16 }}>
      <div className="page-header" style={{ marginBottom: 14 }}>
        <div>
          <h2 className="page-title" style={{ margin: 0 }}>{invoice.billTo || invoice.recipient || 'Invoice'}</h2>
          <p style={{ color: 'var(--muted)', margin: '6px 0' }}>
            Invoice ID: {invoice.invoiceNumber || invoice.id}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ color: 'var(--muted)', fontSize: 12 }}>DATE</span>
          <p style={{ fontWeight: 700, margin: '4px 0' }}>{invoice.date || invoice.dueDate || '-'}</p>
          <span style={{ color: 'var(--muted)', fontSize: 12 }}>DUE</span>
          <p style={{ fontWeight: 700, margin: '4px 0' }}>{invoice.dueDate || '-'}</p>
        </div>
      </div>

      {invoice.missing_info_detect && invoice.missing_info_detect.length > 0 && (
        <div
          style={{
            background: 'rgba(250, 204, 21, 0.18)',
            border: '1px solid rgba(250, 204, 21, 0.5)',
            borderRadius: '10px',
            padding: '12px',
            marginBottom: '14px',
          }}
        >
          <strong style={{ display: 'block', marginBottom: 6, color: '#f5bd2d' }}>
            ⚠️ Missing Information Detected
          </strong>
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            {invoice.missing_info_detect.map((item, idx) => (
              <li key={idx} style={{ color: 'var(--text)', fontSize: 14 }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div
        style={{
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12,
          overflow: 'hidden',
          marginBottom: 12,
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: 10, background: 'rgba(255,255,255,0.02)' }}>
          <span style={{ color: 'var(--muted)', fontSize: 12 }}>DESCRIPTION</span>
          <span style={{ color: 'var(--muted)', fontSize: 12, textAlign: 'right' }}>QTY × PRICE</span>
        </div>
        {invoice.items?.length ? (
          invoice.items.map((item, index) => (
            <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: 10, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <strong>{item.description}</strong>
                {item.code && <div style={{ color: 'var(--muted)', fontSize: 12 }}>{item.code}</div>}
              </div>
              <div style={{ textAlign: 'right' }}>
                {item.qty} × {formatCurrency(item.price)} = {formatCurrency(item.total)}
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: 10 }}>
            <p style={{ margin: 0, color: 'var(--muted)' }}>No items detected yet.</p>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ margin: 0, color: 'var(--muted)', fontSize: 14 }}>{invoice.notes || 'No notes or terms provided.'}</p>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: 220, marginBottom: 4 }}>
            <span style={{ color: 'var(--muted)' }}>Subtotal</span>
            <span>{formatCurrency(invoice.amount)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: 220, marginBottom: 4 }}>
            <span style={{ color: 'var(--muted)' }}>GST</span>
            <span>{formatCurrency(totalGST)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: 220, fontWeight: 700, fontSize: 18 }}>
            <span>Total</span>
            <span>{formatCurrency(invoice.amount + totalGST)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

