'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { handleApiError } from '@/lib/error-handler';
import { UserProfile, CompanyProfile } from '@/modules/profile/api';

interface Props {
  company: CompanyProfile | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  onCompanyUpdate: (data: Partial<Omit<CompanyProfile, 'id'>>) => Promise<void>;
  onProfileUpdate: (data: Partial<Pick<UserProfile, 'first_name' | 'last_name' | 'phone_number'>>) => Promise<void>;
}

const ABN_FIELDS = ['abn', 'acn', 'bas', 'stn'] as const;

// ── validation ────────────────────────────────────────────────────────────────

function validateCompany(draft: Partial<CompanyProfile>): string | null {
  if (!draft.name?.trim()) return 'Company name is required.';
  if (draft.name.trim().length < 2) return 'Company name must be at least 2 characters.';
  if (draft.abn) {
    const digits = draft.abn.replace(/\s|-/g, '');
    if (!/^\d{11}$/.test(digits)) return 'ABN must be 11 digits.';
  }
  if (draft.acn) {
    const digits = draft.acn.replace(/\s|-/g, '');
    if (!/^\d{9}$/.test(digits)) return 'ACN must be 9 digits.';
  }
  return null;
}

function validateProfile(draft: { first_name: string; last_name: string; phone_number: string }): string | null {
  if (!draft.first_name.trim()) return 'First name is required.';
  if (draft.phone_number) {
    const digits = draft.phone_number.replace(/[\s\-().+]/g, '');
    if (!/^\d{8,15}$/.test(digits)) return 'Enter a valid phone number.';
  }
  return null;
}

// ── component ─────────────────────────────────────────────────────────────────

export default function CompanyCard({ company, profile, isAdmin, onCompanyUpdate, onProfileUpdate }: Props) {
  const [editingCompany, setEditingCompany] = useState(false);
  const [companyDraft, setCompanyDraft] = useState<Partial<CompanyProfile>>({});
  const [savingCompany, setSavingCompany] = useState(false);

  const [editingProfile, setEditingProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState({ first_name: '', last_name: '', phone_number: '' });
  const [savingProfile, setSavingProfile] = useState(false);

  const startEditCompany = () => {
    setCompanyDraft(company ? { ...company } : {});
    setEditingCompany(true);
  };

  const startEditProfile = () => {
    setProfileDraft({
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      phone_number: profile?.phone_number || '',
    });
    setEditingProfile(true);
  };

  const saveCompany = async () => {
    const err = validateCompany(companyDraft);
    if (err) { toast.error(err); return; }
    setSavingCompany(true);
    try {
      await onCompanyUpdate(companyDraft);
      setEditingCompany(false);
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setSavingCompany(false);
    }
  };

  const saveProfile = async () => {
    const err = validateProfile(profileDraft);
    if (err) { toast.error(err); return; }
    setSavingProfile(true);
    try {
      await onProfileUpdate(profileDraft);
      setEditingProfile(false);
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setSavingProfile(false);
    }
  };

  const companyInitial = company?.name?.charAt(0)?.toUpperCase() || '?';
  const fullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || '—';

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      {/* Avatar + company name + identifier fields */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12, flexShrink: 0,
          background: 'var(--brand)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 20, fontWeight: 700, color: '#fff',
        }}>
          {companyInitial}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {editingCompany ? (
            <input
              className="input"
              value={companyDraft.name || ''}
              onChange={(e) => setCompanyDraft((d) => ({ ...d, name: e.target.value }))}
              placeholder="Company name *"
              style={{ width: '100%', marginBottom: 8 }}
            />
          ) : (
            <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: '0 0 6px' }}>
              {company?.name || 'No Company'}
            </p>
          )}

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {ABN_FIELDS.map((key) =>
              editingCompany ? (
                <div key={key} style={{ flex: '1 1 80px' }}>
                  <label style={{ display: 'block', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
                    {key.toUpperCase()}
                  </label>
                  <input
                    className="input"
                    value={(companyDraft as any)[key] || ''}
                    onChange={(e) => setCompanyDraft((d) => ({ ...d, [key]: e.target.value }))}
                    placeholder={key === 'abn' ? '11 digits' : key === 'acn' ? '9 digits' : key.toUpperCase()}
                    style={{ padding: '5px 8px', fontSize: 12 }}
                  />
                </div>
              ) : (
                <span key={key} style={{ fontSize: 11, color: 'var(--muted)' }}>
                  <strong style={{ textTransform: 'uppercase' }}>{key}</strong>{' '}
                  {(company as any)?.[key] || '—'}
                </span>
              )
            )}
          </div>
        </div>

        {isAdmin && (
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            {editingCompany ? (
              <>
                <button
                  className="button"
                  onClick={saveCompany}
                  disabled={savingCompany}
                  style={{ width: 'auto', padding: '7px 16px', fontSize: 13, opacity: savingCompany ? 0.7 : 1 }}
                >
                  {savingCompany ? 'Saving…' : 'Save'}
                </button>
                <button
                  className="button secondary"
                  onClick={() => setEditingCompany(false)}
                  style={{ width: 'auto', padding: '7px 14px', fontSize: 13 }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                className="button secondary"
                onClick={startEditCompany}
                style={{ width: 'auto', padding: '6px 14px', fontSize: 13 }}
              >
                Edit
              </button>
            )}
          </div>
        )}
      </div>

      <div style={{ borderTop: '1px solid var(--border)', margin: '4px 0 14px' }} />

      {/* User profile fields */}
      {editingProfile ? (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            <div className="form-field" style={{ margin: 0 }}>
              <label>First Name *</label>
              <input
                className="input"
                value={profileDraft.first_name}
                onChange={(e) => setProfileDraft((d) => ({ ...d, first_name: e.target.value }))}
              />
            </div>
            <div className="form-field" style={{ margin: 0 }}>
              <label>Last Name</label>
              <input
                className="input"
                value={profileDraft.last_name}
                onChange={(e) => setProfileDraft((d) => ({ ...d, last_name: e.target.value }))}
              />
            </div>
          </div>
          <div className="form-field" style={{ marginBottom: 12 }}>
            <label>Mobile</label>
            <input
              className="input"
              value={profileDraft.phone_number}
              placeholder="0400 000 000"
              onChange={(e) => setProfileDraft((d) => ({ ...d, phone_number: e.target.value }))}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button
              className="button"
              onClick={saveProfile}
              disabled={savingProfile}
              style={{ width: 'auto', padding: '7px 16px', fontSize: 13, opacity: savingProfile ? 0.7 : 1 }}
            >
              {savingProfile ? 'Saving…' : 'Save'}
            </button>
            <button
              className="button secondary"
              onClick={() => setEditingProfile(false)}
              style={{ width: 'auto', padding: '7px 14px', fontSize: 13 }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <FieldRow label="Name" value={fullName} />
            <FieldRow label="Mobile" value={profile?.phone_number} />
            <FieldRow label="Email" value={profile?.email} />
          </div>
          <button
            className="button secondary"
            onClick={startEditProfile}
            style={{ width: 'auto', padding: '6px 14px', fontSize: 13, flexShrink: 0 }}
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}

function FieldRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <span style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
      <p style={{ margin: '1px 0 0', fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{value || '—'}</p>
    </div>
  );
}
