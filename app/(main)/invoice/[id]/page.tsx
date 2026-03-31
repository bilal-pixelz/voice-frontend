'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { getInvoiceById, updateInvoice } from '@/modules/invoice/api';
import { Invoice, LineItem } from '@/types/invoice';
import InvoiceDetail from '@/modules/invoice/components/InvoiceDetail';
import InvoiceSettingsBar from '@/modules/invoice/components/InvoiceSettingsBar';
import { getCompany, updateCompany, CompanyProfile } from '@/modules/profile/api';

const GST_RATE = 0.1;

export default function InvoiceViewPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = (params as { id?: string }).id;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [editData, setEditData] = useState<Partial<Invoice>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const taxEnabled = company?.tax_enabled ?? true;
  const template = company?.invoice_template ?? 'modern';
  const accentColor = company?.accent_color ?? '#0ea5e9';

  useEffect(() => {
    if (!invoiceId) { setError('Invoice ID is required'); setLoading(false); return; }
    const load = async () => {
      try {
        const [data] = await Promise.all([
          getInvoiceById(invoiceId),
          getCompany().then(setCompany).catch(() => {}),
        ]);
        setInvoice(data);
        setEditData(data);
      } catch (err: any) {
        setError(err.message || 'Unable to fetch invoice');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [invoiceId]);

  // ── company settings handlers (auto-save) ─────────────────────────────────

  const handleTemplateChange = async (t: string) => {
    const optimistic = company ? { ...company, invoice_template: t } : null;
    setCompany(optimistic);
    try {
      const updated = await updateCompany({ invoice_template: t });
      setCompany(updated);
    } catch {
      setCompany(company);
      toast.error('Failed to save template');
    }
  };

  const handleTaxToggle = async (val: boolean) => {
    const optimistic = company ? { ...company, tax_enabled: val } : null;
    setCompany(optimistic);
    if (isEditing) {
      const subtotal = editData.subtotal ?? 0;
      const tax = val ? Math.round(subtotal * GST_RATE * 100) / 100 : 0;
      setEditData((prev) => ({ ...prev, tax, total: subtotal + tax }));
    }
    try {
      const updated = await updateCompany({ tax_enabled: val });
      setCompany(updated);
    } catch {
      setCompany(company);
      toast.error('Failed to save tax setting');
    }
  };

  const handleAccentChange = async (color: string) => {
    const optimistic = company ? { ...company, accent_color: color } : null;
    setCompany(optimistic);
    try {
      const updated = await updateCompany({ accent_color: color });
      setCompany(updated);
    } catch {
      setCompany(company);
      toast.error('Failed to save accent color');
    }
  };

  const handleCompanyUpdate = async (data: Partial<Omit<CompanyProfile, 'id'>>) => {
    const updated = await updateCompany(data);
    setCompany(updated);
  };

  // ── invoice edit handlers ─────────────────────────────────────────────────

  const handleEdit = () => {
    setEditData(invoice!);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditData(invoice!);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!invoiceId) return;
    setSaving(true);
    try {
      const updated = await updateInvoice(invoiceId, editData);
      setInvoice(updated);
      setIsEditing(false);
      toast.success('Invoice saved');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save invoice');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof Invoice, value: any) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const recalcTotals = (items: LineItem[], taxOverride?: number) => {
    const subtotal = items.reduce((sum, i) => sum + (i.total ?? 0), 0);
    const tax = taxEnabled
      ? (taxOverride !== undefined ? taxOverride : Math.round(subtotal * GST_RATE * 100) / 100)
      : 0;
    return { subtotal, tax, total: subtotal + tax };
  };

  const handleLineItemChange = (index: number, field: keyof LineItem, value: any) => {
    const items = [...(editData.line_items ?? [])];
    items[index] = { ...items[index], [field]: value };
    if (field === 'quantity' || field === 'unit_price') {
      const qty = field === 'quantity' ? value : items[index].quantity ?? 0;
      const price = field === 'unit_price' ? value : items[index].unit_price ?? 0;
      items[index].total = qty * price;
    }
    setEditData((prev) => ({ ...prev, line_items: items, ...recalcTotals(items) }));
  };

  const handleAddLineItem = () => {
    const items = [...(editData.line_items ?? []), { id: '', invoice_id: invoiceId!, description: '', quantity: 1, unit_price: 0, total: 0 }];
    setEditData((prev) => ({ ...prev, line_items: items, ...recalcTotals(items) }));
  };

  const handleRemoveLineItem = (index: number) => {
    const items = (editData.line_items ?? []).filter((_, i) => i !== index);
    setEditData((prev) => ({ ...prev, line_items: items, ...recalcTotals(items) }));
  };

  const handleTaxAmountChange = (val: number) => {
    const subtotal = editData.subtotal ?? 0;
    setEditData((prev) => ({ ...prev, tax: val, total: subtotal + val }));
  };

  // ── render ─────────────────────────────────────────────────────────────────

  if (loading) return (
    <div className="container" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--muted)' }}>Loading invoice…</p>
    </div>
  );

  if (error) return (
    <div className="container" style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#f87171', marginBottom: 10 }}>{error}</p>
      <button className="button secondary" onClick={() => router.back()}>Go Back</button>
    </div>
  );

  if (!invoice) return <div className="container">No invoice found.</div>;

  const currency = editData.currency ?? 'AUD';

  return (
    <div className="container" style={{ paddingBottom: 110 }}>

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1 className="page-title" style={{ margin: 0 }}>
          {isEditing ? 'Edit Invoice' : 'Invoice Details'}
        </h1>
        {!isEditing && (
          <button className="button secondary" style={{ width: 'auto', padding: '10px 20px' }} onClick={() => router.push('/invoice/new')}>
            New Invoice
          </button>
        )}
      </div>

      {/* Settings bar — always visible */}
      <InvoiceSettingsBar
        template={template}
        taxEnabled={taxEnabled}
        accentColor={accentColor}
        company={company}
        onTemplateChange={handleTemplateChange}
        onTaxToggle={handleTaxToggle}
        onAccentChange={handleAccentChange}
        onCompanyUpdate={handleCompanyUpdate}
      />

      {/* Edit mode */}
      {isEditing ? (
        <div className="card" style={{ padding: 24, marginBottom: 16 }}>

          {/* Customer */}
          <p style={{ margin: '0 0 14px', fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>Customer</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            <div className="form-field" style={{ margin: 0 }}>
              <label>Customer Name</label>
              <input className="input" value={editData.customer_name ?? ''} onChange={(e) => handleChange('customer_name', e.target.value)} />
            </div>
            <div className="form-field" style={{ margin: 0 }}>
              <label>Customer Email</label>
              <input className="input" type="email" value={editData.customer_email ?? ''} onChange={(e) => handleChange('customer_email', e.target.value)} />
            </div>
            <div className="form-field" style={{ margin: 0 }}>
              <label>Customer Phone</label>
              <input className="input" value={editData.customer_phone ?? ''} onChange={(e) => handleChange('customer_phone', e.target.value)} />
            </div>
            <div className="form-field" style={{ margin: 0 }}>
              <label>Currency</label>
              <select className="input" value={editData.currency ?? 'AUD'} onChange={(e) => handleChange('currency', e.target.value)}>
                <option value="AUD">AUD</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div className="form-field" style={{ margin: 0 }}>
              <label>Invoice Date</label>
              <input className="input" type="date" value={editData.invoice_date ?? ''} onChange={(e) => handleChange('invoice_date', e.target.value)} />
            </div>
            <div className="form-field" style={{ margin: 0 }}>
              <label>Due Date</label>
              <input className="input" type="date" value={editData.due_date ?? ''} onChange={(e) => handleChange('due_date', e.target.value)} />
            </div>
          </div>

          {/* Line items */}
          <p style={{ margin: '0 0 12px', fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>Line Items</p>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: 8, marginBottom: 6 }}>
            {['Description', 'Qty', 'Unit Price', 'Total', ''].map((h, i) => (
              <span key={i} style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</span>
            ))}
          </div>
          {(editData.line_items ?? []).map((item, index) => (
            <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: 8, marginBottom: 8, alignItems: 'center' }}>
              <input className="input" style={{ padding: '8px 12px' }} value={item.description} onChange={(e) => handleLineItemChange(index, 'description', e.target.value)} placeholder="Description" />
              <input className="input" style={{ padding: '8px 12px' }} type="number" min="0" value={item.quantity ?? ''} onChange={(e) => handleLineItemChange(index, 'quantity', parseFloat(e.target.value) || 0)} placeholder="Qty" />
              <input className="input" style={{ padding: '8px 12px' }} type="number" min="0" value={item.unit_price ?? ''} onChange={(e) => handleLineItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)} placeholder="Price" />
              <input className="input" style={{ padding: '8px 12px', color: 'var(--muted)' }} type="number" value={item.total ?? ''} readOnly />
              <button onClick={() => handleRemoveLineItem(index)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: 8, padding: '8px 12px', cursor: 'pointer' }}>✕</button>
            </div>
          ))}
          <button onClick={handleAddLineItem} className="button secondary" style={{ width: 'auto', padding: '8px 16px', marginTop: 4, fontSize: '0.85rem' }}>
            + Add Line Item
          </button>

          {/* Notes + Totals */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 20 }}>
            <div className="form-field" style={{ margin: 0 }}>
              <label>Notes</label>
              <input className="input" value={editData.notes ?? ''} onChange={(e) => handleChange('notes', e.target.value)} placeholder="Payment terms, notes…" />
            </div>
            {taxEnabled && (
              <div className="form-field" style={{ margin: 0 }}>
                <label>GST Amount</label>
                <input
                  className="input"
                  type="number" min="0"
                  value={editData.tax ?? ''}
                  onChange={(e) => handleTaxAmountChange(parseFloat(e.target.value) || 0)}
                  placeholder={`Auto: ${((editData.subtotal ?? 0) * GST_RATE).toFixed(2)}`}
                />
              </div>
            )}
          </div>

          {/* Totals summary */}
          <div style={{ marginTop: 20, borderTop: '1px solid var(--border)', paddingTop: 16, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
            <SummaryRow label="Subtotal" value={`${currency} ${(editData.subtotal ?? 0).toFixed(2)}`} />
            {taxEnabled && <SummaryRow label="GST" value={`${currency} ${(editData.tax ?? 0).toFixed(2)}`} />}
            <SummaryRow label="Total" value={`${currency} ${(editData.total ?? 0).toFixed(2)}`} bold accent={accentColor} />
          </div>
        </div>
      ) : (
        <InvoiceDetail
          invoice={invoice}
          onEdit={handleEdit}
          template={template}
          taxEnabled={taxEnabled}
          accentColor={accentColor}
          company={company}
        />
      )}

      {/* Action buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
        {isEditing ? (
          <>
            <button className="button secondary" onClick={handleCancel} disabled={saving}>Cancel</button>
            <button className="button" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save Invoice'}
            </button>
          </>
        ) : (
          <>
            <button className="button secondary" onClick={() => router.back()}>Back</button>
            <button className="button" onClick={() => toast.success('Syncing to Xero…')}>Sync Xero</button>
          </>
        )}
      </div>
    </div>
  );
}

function SummaryRow({ label, value, bold, accent }: { label: string; value: string; bold?: boolean; accent?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', width: 260 }}>
      <span style={{ color: 'var(--muted)', fontWeight: bold ? 700 : 400, fontSize: bold ? '1rem' : '0.9rem' }}>{label}</span>
      <span style={{ fontWeight: bold ? 700 : 500, fontSize: bold ? '1.1rem' : '0.9rem', color: accent ?? 'var(--text)' }}>{value}</span>
    </div>
  );
}
