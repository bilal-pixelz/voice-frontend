'use client';

import React from 'react';
import { Invoice } from '@/types/invoice';

interface InvoiceDetailProps {
  invoice: Invoice;
}

const formatCurrency = (value: number | null | undefined) =>
  (value ?? 0).toLocaleString('en-AU', { style: 'currency', currency: 'AUD' });

export default function InvoiceDetail({ invoice }: InvoiceDetailProps) {
  const gst = invoice.tax ?? Math.round((invoice.subtotal || 0) * 0.1 * 100) / 100;
  const missingFields = [];
  if (!invoice.customer_name) missingFields.push('Customer name');
  if (!invoice.customer_email) missingFields.push('Customer email');
  if (!invoice.due_date) missingFields.push('Due date');
  if (!invoice.line_items?.length) missingFields.push('Line items');

  return (
    <>
      {/* Missing info banner */}
      {missingFields.length > 0 && (
        <div style={{
          background: 'rgba(250, 204, 21, 0.08)',
          border: '1px solid rgba(250, 204, 21, 0.35)',
          borderRadius: 14,
          padding: '14px 18px',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
        }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
          <div style={{ flex: 1 }}>
            <p style={{ margin: '0 0 6px', fontWeight: 700, color: '#f5bd2d', fontSize: '0.9rem' }}>
              Missing Information Detected
            </p>
            <ul style={{ margin: '0 0 10px', paddingLeft: 16 }}>
              {missingFields.map((f, i) => (
                <li key={i} style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{f}</li>
              ))}
            </ul>
            <button style={{
              background: '#f5bd2d',
              color: '#0b1220',
              border: 'none',
              borderRadius: 8,
              padding: '6px 14px',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}>
              Tap to Edit
            </button>
          </div>
        </div>
      )}

      {/* Invoice card */}
      <div className="card" style={{ padding: 0, marginBottom: 16, overflow: 'hidden' }}>

        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
          <div>
            <p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Bill to
            </p>
            <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)' }}>
              {invoice.customer_name ?? 'Unknown Customer'}
            </p>
            {invoice.customer_email && (
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)' }}>{invoice.customer_email}</p>
            )}
            {invoice.customer_phone && (
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)' }}>{invoice.customer_phone}</p>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: '0 0 4px', fontWeight: 700, color: 'var(--brand)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Tax Invoice
            </p>
            <p style={{ margin: '0 0 8px', fontWeight: 700, color: 'var(--text)', fontFamily: 'monospace' }}>
              {invoice.invoice_number ?? '—'}
            </p>
            <p style={{ margin: '0 0 2px', fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Date</p>
            <p style={{ margin: '0 0 6px', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text)' }}>
              {invoice.invoice_date ?? '—'}
            </p>
            <p style={{ margin: '0 0 2px', fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Due date</p>
            <p style={{ margin: 0, fontWeight: 600, fontSize: '0.85rem', color: 'var(--text)' }}>
              {invoice.due_date ?? '—'}
            </p>
          </div>
        </div>

        {/* Line items table */}
        <div style={{ padding: '0 24px' }}>
          {/* Table header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            padding: '12px 0',
            borderBottom: '1px solid var(--border)',
          }}>
            {['Description', 'Qty', 'Price', 'Total'].map((h, i) => (
              <span key={h} style={{
                fontSize: '0.75rem',
                color: 'var(--muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                textAlign: i > 0 ? 'right' : 'left',
              }}>
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          {invoice.line_items?.length ? (
            invoice.line_items.map((item, i) => (
              <div key={item.id ?? i} style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr',
                padding: '14px 0',
                borderBottom: '1px solid var(--border)',
                alignItems: 'center',
              }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, color: 'var(--text)' }}>{item.description}</p>
                </div>
                <p style={{ margin: 0, textAlign: 'right', color: 'var(--text)' }}>{item.quantity ?? 1}</p>
                <p style={{ margin: 0, textAlign: 'right', color: 'var(--text)' }}>{formatCurrency(item.unit_price)}</p>
                <p style={{ margin: 0, textAlign: 'right', fontWeight: 600, color: 'var(--text)' }}>{formatCurrency(item.total)}</p>
              </div>
            ))
          ) : (
            <p style={{ padding: '16px 0', color: 'var(--muted)', margin: 0 }}>No line items.</p>
          )}
        </div>

        {/* Notes + Totals */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24,
          padding: '20px 24px',
          borderTop: '1px solid var(--border)',
        }}>
          <div>
            <p style={{ margin: '0 0 6px', fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Notes &amp; Payment Terms
            </p>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)' }}>
              {invoice.notes ?? 'No notes provided.'}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Subtotal</span>
              <span style={{ color: 'var(--text)', fontWeight: 600 }}>{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>GST (10%)</span>
              <span style={{ color: 'var(--text)', fontWeight: 600 }}>{formatCurrency(gst)}</span>
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              borderTop: '1px solid var(--border)', paddingTop: 10, marginTop: 4,
            }}>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>Total Amount</span>
              <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--brand)' }}>
                {formatCurrency(invoice.total)}
              </span>
            </div>
            <p style={{ margin: 0, textAlign: 'right', fontSize: '0.75rem', color: 'var(--muted)' }}>
              Includes GST of {formatCurrency(gst)}
            </p>
          </div>
        </div>

      </div>
    </>
  );
}