'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { handleApiError } from '@/lib/error-handler';
import { CompanyProfile } from '@/modules/profile/api';
import { TEMPLATES, ACCENT_COLORS } from '@/modules/profile/constants';

interface Props {
  template: string;
  taxEnabled: boolean;
  accentColor: string;
  company: CompanyProfile | null;
  onTemplateChange: (t: string) => Promise<void>;
  onTaxToggle: (v: boolean) => Promise<void>;
  onAccentChange: (color: string) => Promise<void>;
  onCompanyUpdate: (data: Partial<Omit<CompanyProfile, 'id'>>) => Promise<void>;
}

export default function InvoiceSettingsBar({
  template,
  taxEnabled,
  accentColor,
  company,
  onTemplateChange,
  onTaxToggle,
  onAccentChange,
  onCompanyUpdate,
}: Props) {
  const [showCompanyEdit, setShowCompanyEdit] = useState(false);
  const [draft, setDraft] = useState<Partial<CompanyProfile>>({});
  const [saving, setSaving] = useState(false);

  const openCompanyEdit = () => {
    setDraft(company ? { ...company } : {});
    setShowCompanyEdit(true);
  };

  const saveCompany = async () => {
    setSaving(true);
    try {
      await onCompanyUpdate(draft);
      setShowCompanyEdit(false);
      toast.success('Company info updated');
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card" style={{ padding: '14px 18px', marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>

        {/* Template switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
          <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>
            Template:
          </span>
          <div style={{ display: 'flex', gap: 4 }}>
            {TEMPLATES.map(({ key, label }) => {
              const active = template === key;
              return (
                <button
                  key={key}
                  onClick={() => onTemplateChange(key)}
                  style={{
                    padding: '4px 12px', borderRadius: 999,
                    border: `1px solid ${active ? 'var(--brand)' : 'var(--border)'}`,
                    background: active ? 'rgba(14,165,233,0.12)' : 'transparent',
                    color: active ? 'var(--brand)' : 'var(--muted)',
                    fontSize: 12, fontWeight: active ? 700 : 500,
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tax toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>Tax (GST):</span>
          <button
            onClick={() => onTaxToggle(!taxEnabled)}
            style={{
              width: 40, height: 22, borderRadius: 999, border: 'none',
              background: taxEnabled ? 'var(--brand)' : 'rgba(255,255,255,0.15)',
              cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
            }}
          >
            <span style={{
              position: 'absolute', top: 2,
              left: taxEnabled ? 20 : 2,
              width: 18, height: 18, borderRadius: '50%',
              background: '#fff', transition: 'left 0.2s',
            }} />
          </button>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>{taxEnabled ? 'On' : 'Off'}</span>
        </div>

        {/* Accent color */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>Color:</span>
          {ACCENT_COLORS.map((color) => {
            const active = accentColor === color;
            return (
              <button
                key={color}
                onClick={() => onAccentChange(color)}
                style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: color, padding: 0, border: 'none',
                  outline: active ? `2px solid ${color}` : '2px solid transparent',
                  outlineOffset: 2,
                  cursor: 'pointer', transition: 'outline 0.15s',
                }}
              />
            );
          })}
        </div>

        {/* Company info button */}
        <button
          onClick={showCompanyEdit ? () => setShowCompanyEdit(false) : openCompanyEdit}
          style={{
            padding: '4px 14px', borderRadius: 999,
            border: '1px solid var(--border)',
            background: showCompanyEdit ? 'rgba(255,255,255,0.08)' : 'transparent',
            color: 'var(--text)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {company?.name ? `${company.name} ▾` : '+ Company Info'}
        </button>
      </div>

      {/* Inline company editor */}
      {showCompanyEdit && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            <div className="form-field" style={{ margin: 0 }}>
              <label>Company Name</label>
              <input
                className="input"
                value={draft.name || ''}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                placeholder="e.g. John Doe Plumbing"
              />
            </div>
            <div className="form-field" style={{ margin: 0 }}>
              <label>ABN</label>
              <input
                className="input"
                value={draft.abn || ''}
                onChange={(e) => setDraft((d) => ({ ...d, abn: e.target.value }))}
                placeholder="XX XXX XXX XXX"
              />
            </div>
            <div className="form-field" style={{ margin: 0 }}>
              <label>ACN</label>
              <input
                className="input"
                value={draft.acn || ''}
                onChange={(e) => setDraft((d) => ({ ...d, acn: e.target.value }))}
                placeholder="XXX XXX XXX"
              />
            </div>
            <div className="form-field" style={{ margin: 0 }}>
              <label>STN</label>
              <input
                className="input"
                value={draft.stn || ''}
                onChange={(e) => setDraft((d) => ({ ...d, stn: e.target.value }))}
                placeholder="STN number"
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button
              className="button"
              onClick={saveCompany}
              disabled={saving}
              style={{ width: 'auto', padding: '7px 18px', fontSize: 13, opacity: saving ? 0.7 : 1 }}
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              className="button secondary"
              onClick={() => setShowCompanyEdit(false)}
              style={{ width: 'auto', padding: '7px 14px', fontSize: 13 }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
