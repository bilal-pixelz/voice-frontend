'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { handleApiError } from '@/lib/error-handler';
import { CompanyProfile } from '@/modules/profile/api';
import { VALID_TEMPLATES, TEMPLATES, ACCENT_COLORS, HEX_RE, TemplateName } from '@/modules/profile/constants';

interface Props {
  company: CompanyProfile | null;
  isAdmin: boolean;
  onUpdate: (data: Partial<Omit<CompanyProfile, 'id'>>) => Promise<void>;
}

export default function InvoiceSettings({ company, isAdmin, onUpdate }: Props) {
  const template = (company?.invoice_template || 'modern') as TemplateName;
  const accentColor = company?.accent_color || '#0ea5e9';
  const taxEnabled = company?.tax_enabled ?? true;
  const [saving, setSaving] = useState<string | null>(null);

  const handleUpdate = async (field: string, data: Partial<Omit<CompanyProfile, 'id'>>) => {
    if (!isAdmin) return;
    // Validate
    if ('invoice_template' in data) {
      if (!VALID_TEMPLATES.includes(data.invoice_template as TemplateName)) {
        toast.error('Invalid template selected.');
        return;
      }
    }
    if ('accent_color' in data) {
      if (!HEX_RE.test(data.accent_color as string)) {
        toast.error('Invalid accent color.');
        return;
      }
    }
    setSaving(field);
    try {
      await onUpdate(data);
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setSaving(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 16 }}>
      {/* Tax toggle */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Tax Settings</p>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--muted)' }}>Include GST in generated invoices</p>
          </div>
          <Toggle
            checked={taxEnabled}
            disabled={!isAdmin || saving === 'tax_enabled'}
            onChange={(val) => handleUpdate('tax_enabled', { tax_enabled: val })}
          />
        </div>
      </div>

      {/* Layout template + accent color */}
      <div className="card">
        <SectionLabel>Layout Template</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {TEMPLATES.map(({ key, label }) => {
            const active = template === key;
            const isSaving = saving === `template_${key}`;
            return (
              <button
                key={key}
                disabled={!isAdmin || saving !== null}
                onClick={() => handleUpdate(`template_${key}`, { invoice_template: key })}
                style={{
                  background: active ? 'rgba(14,165,233,0.1)' : 'rgba(255,255,255,0.03)',
                  border: `2px solid ${active ? 'var(--brand)' : 'var(--border)'}`,
                  borderRadius: 12,
                  padding: '12px 8px',
                  cursor: isAdmin && saving === null ? 'pointer' : 'default',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  opacity: isSaving ? 0.6 : 1,
                  transition: 'opacity 0.15s',
                }}
              >
                <TemplateThumbnail active={active} variant={label} />
                <span style={{ fontSize: 12, fontWeight: active ? 700 : 500, color: active ? 'var(--brand)' : 'var(--muted)' }}>
                  {isSaving ? '…' : label}
                </span>
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: 20 }}>
          <SectionLabel>Accent Color</SectionLabel>
          <div style={{ display: 'flex', gap: 10 }}>
            {ACCENT_COLORS.map((color) => {
              const active = accentColor === color;
              const isSaving = saving === `color_${color}`;
              return (
                <button
                  key={color}
                  disabled={!isAdmin || saving !== null}
                  onClick={() => handleUpdate(`color_${color}`, { accent_color: color })}
                  style={{
                    width: 30, height: 30, borderRadius: '50%',
                    background: color, padding: 0, border: 'none',
                    outline: active ? `3px solid ${color}` : '3px solid transparent',
                    outlineOffset: 2,
                    cursor: isAdmin && saving === null ? 'pointer' : 'default',
                    opacity: isSaving ? 0.5 : 1,
                    transition: 'outline 0.15s, opacity 0.15s',
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Toggle({ checked, disabled, onChange }: { checked: boolean; disabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      style={{
        width: 44, height: 24, borderRadius: 999, border: 'none',
        background: checked ? 'var(--brand)' : 'rgba(255,255,255,0.15)',
        cursor: disabled ? 'default' : 'pointer',
        position: 'relative', transition: 'background 0.2s', flexShrink: 0,
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <span style={{
        position: 'absolute', top: 3,
        left: checked ? 23 : 3,
        width: 18, height: 18, borderRadius: '50%',
        background: '#fff', transition: 'left 0.2s',
      }} />
    </button>
  );
}

function TemplateThumbnail({ active, variant }: { active: boolean; variant: string }) {
  const barColor = active ? 'var(--brand)' : 'rgba(255,255,255,0.2)';
  return (
    <div style={{ width: 48, height: 60, background: 'rgba(255,255,255,0.06)', borderRadius: 6, padding: 5, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <div style={{ height: variant === 'Bold' ? 14 : 8, background: barColor, borderRadius: 2 }} />
      <div style={{ height: 4, background: 'rgba(255,255,255,0.12)', borderRadius: 2, width: '70%' }} />
      <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }} />
      <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, width: '80%' }} />
      {variant === 'Classic' && <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, width: '60%' }} />}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--muted)', textTransform: 'uppercase', margin: '0 0 12px' }}>
      {children}
    </p>
  );
}
