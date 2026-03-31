'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { handleApiError } from '@/lib/error-handler';
import { TeamMember } from '@/modules/profile/api';

interface Props {
  team: TeamMember[];
  currentUserId: number;
  isAdmin: boolean;
  onInvite: (data: { email: string; first_name: string; last_name?: string }) => Promise<void>;
  onRemove: (userId: number) => Promise<void>;
}

export default function TeamMembers({ team, currentUserId, isAdmin, onInvite, onRemove }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ email: '', first_name: '', last_name: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleInvite = async () => {
    if (!form.email || !form.first_name) {
      toast.error('Email and first name are required');
      return;
    }
    setSubmitting(true);
    try {
      await onInvite(form);
      setForm({ email: '', first_name: '', last_name: '' });
      setShowForm(false);
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (memberId: number, name: string) => {
    if (!confirm(`Remove ${name} from the team?`)) return;
    try {
      await onRemove(memberId);
    } catch (err: any) {
      handleApiError(err);
    }
  };

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Team Members
        </p>
        {isAdmin && (
          <button
            onClick={() => setShowForm((v) => !v)}
            style={{ fontSize: 13, color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
          >
            + Invite contact
          </button>
        )}
      </div>

      {showForm && (
        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
          borderRadius: 12, padding: 14, marginBottom: 14,
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
            <div className="form-field" style={{ margin: 0 }}>
              <label>First Name *</label>
              <input className="input" value={form.first_name} onChange={(e) => setForm((d) => ({ ...d, first_name: e.target.value }))} />
            </div>
            <div className="form-field" style={{ margin: 0 }}>
              <label>Last Name</label>
              <input className="input" value={form.last_name} onChange={(e) => setForm((d) => ({ ...d, last_name: e.target.value }))} />
            </div>
          </div>
          <div className="form-field" style={{ marginBottom: 12 }}>
            <label>Email *</label>
            <input className="input" type="email" value={form.email} onChange={(e) => setForm((d) => ({ ...d, email: e.target.value }))} />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button
              className="button"
              onClick={handleInvite}
              disabled={submitting}
              style={{ width: 'auto', padding: '7px 16px', fontSize: 13, opacity: submitting ? 0.7 : 1 }}
            >
              {submitting ? 'Sending…' : 'Send Invite'}
            </button>
            <button
              className="button secondary"
              onClick={() => setShowForm(false)}
              style={{ width: 'auto', padding: '7px 14px', fontSize: 13 }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {team.length === 0 && (
          <p style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center', padding: '12px 0', margin: 0 }}>
            No team members yet.
          </p>
        )}
        {team.map((member) => {
          const isMe = member.id === currentUserId;
          const name = [member.first_name, member.last_name].filter(Boolean).join(' ') || member.email;
          return (
            <div
              key={member.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 10, border: '1px solid var(--border)',
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                background: isMe ? 'var(--brand)' : 'rgba(255,255,255,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 700, color: '#fff',
              }}>
                {(member.first_name || member.email).charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                  {name}{isMe && <span style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 4 }}>(You)</span>}
                </p>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {member.email}
                </p>
              </div>
              {member.role === 'admin' && (
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999,
                  background: 'rgba(14,165,233,0.15)', color: 'var(--brand)',
                  textTransform: 'uppercase', letterSpacing: '0.06em', flexShrink: 0,
                }}>
                  Admin
                </span>
              )}
              {isAdmin && !isMe && (
                <button
                  onClick={() => handleRemove(member.id, name)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--muted)', fontSize: 18, lineHeight: 1, padding: '0 2px', flexShrink: 0,
                  }}
                  title="Remove member"
                >
                  ×
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
