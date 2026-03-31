'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import apiClient from '@/lib/api-client';
import { useAuthStore } from '@/store/authStore';
import {
  getMyProfile, updateMyProfile,
  getCompany, createCompany, updateCompany,
  getTeam, inviteTeamMember, removeTeamMember,
  getPlans, switchPlan,
  UserProfile, CompanyProfile, TeamMember, Plan,
} from '@/modules/profile/api';
import { handleApiError } from '@/lib/error-handler';
import CompanyCard from '@/modules/profile/components/CompanyCard';
import InvoiceSettings from '@/modules/profile/components/InvoiceSettings';
import TeamMembers from '@/modules/profile/components/TeamMembers';
import Integrations from '@/modules/profile/components/Integrations';
import BillingPlans from '@/modules/profile/components/BillingPlans';

export default function ProfilePage() {
  const router = useRouter();
  const { logout } = useAuthStore();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [activePlanSlug, setActivePlanSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [p, fetchedPlans] = await Promise.all([getMyProfile(), getPlans()]);
        setProfile(p);
        setPlans(fetchedPlans);

        if (p.company_id) {
          const [c, t] = await Promise.all([getCompany(), getTeam()]);
          setCompany(c);
          setTeam(t);
        }

        try {
          const subRes = await apiClient.get('/auth/subscription');
          setActivePlanSlug(subRes.data.data?.plan?.slug ?? null);
        } catch {}
      } catch {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleCreateCompany = async (name: string) => {
    try {
      const newCompany = await createCompany(name);
      setCompany(newCompany);
      // Re-fetch profile since role changes to admin after company creation
      const updatedProfile = await getMyProfile();
      setProfile(updatedProfile);
      // Fetch team now that company exists
      const t = await getTeam();
      setTeam(t);
      toast.success('Company created');
    } catch (err: any) {
      handleApiError(err);
    }
  };

  const handleCompanyUpdate = async (data: Partial<Omit<CompanyProfile, 'id'>>) => {
    const updated = await updateCompany(data);
    setCompany(updated);
    toast.success('Company updated');
  };

  const handleProfileUpdate = async (data: Partial<Pick<UserProfile, 'first_name' | 'last_name' | 'phone_number'>>) => {
    const updated = await updateMyProfile(data);
    setProfile(updated);
    toast.success('Profile updated');
  };

  const handleInvite = async (data: { email: string; first_name: string; last_name?: string }) => {
    const member = await inviteTeamMember(data);
    setTeam((t) => [...t, member]);
    toast.success('Invitation sent');
  };

  const handleRemoveMember = async (userId: number) => {
    await removeTeamMember(userId);
    setTeam((t) => t.filter((m) => m.id !== userId));
    toast.success('Member removed');
  };

  const handleSwitchPlan = async (slug: string) => {
    await switchPlan(slug);
    setActivePlanSlug(slug);
    toast.success('Plan updated');
  };

  const handleSignOut = async () => {
    try { await apiClient.post('/auth/logout'); } catch {}
    logout();
    router.replace('/login');
  };

  const isAdmin = profile?.role === 'admin';

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="page-title" style={{ marginBottom: 20 }}>Company Profile</h1>

      {company ? (
        <>
          <CompanyCard
            company={company}
            profile={profile}
            isAdmin={isAdmin}
            onCompanyUpdate={handleCompanyUpdate}
            onProfileUpdate={handleProfileUpdate}
          />

          <InvoiceSettings
            company={company}
            isAdmin={isAdmin}
            onUpdate={handleCompanyUpdate}
          />

          <TeamMembers
            team={team}
            currentUserId={profile?.id ?? 0}
            isAdmin={isAdmin}
            onInvite={handleInvite}
            onRemove={handleRemoveMember}
          />
        </>
      ) : (
        <CreateCompanyCard profile={profile} onProfileUpdate={handleProfileUpdate} onCreate={handleCreateCompany} />
      )}

      <Integrations />

      <BillingPlans
        plans={plans}
        activePlanSlug={activePlanSlug}
        onSwitch={handleSwitchPlan}
      />

      <div style={{ textAlign: 'center', marginTop: 8, marginBottom: 32 }}>
        <button
          onClick={handleSignOut}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 14, fontWeight: 600 }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

function CreateCompanyCard({
  profile,
  onProfileUpdate,
  onCreate,
}: {
  profile: UserProfile | null;
  onProfileUpdate: (data: Partial<Pick<UserProfile, 'first_name' | 'last_name' | 'phone_number'>>) => Promise<void>;
  onCreate: (name: string) => Promise<void>;
}) {
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);

  const [editingProfile, setEditingProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState({ first_name: '', last_name: '', phone_number: '' });
  const [savingProfile, setSavingProfile] = useState(false);

  const fullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || '—';

  const startEditProfile = () => {
    setProfileDraft({
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      phone_number: profile?.phone_number || '',
    });
    setEditingProfile(true);
  };

  const saveProfile = async () => {
    if (!profileDraft.first_name.trim()) { toast.error('First name is required.'); return; }
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

  const handleCreate = async () => {
    if (!name.trim()) { toast.error('Company name is required.'); return; }
    if (name.trim().length < 2) { toast.error('Company name must be at least 2 characters.'); return; }
    setCreating(true);
    try {
      await onCreate(name.trim());
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      {/* Create company form */}
      <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>Set Up Your Company</p>
      <p style={{ margin: '0 0 14px', fontSize: 12, color: 'var(--muted)' }}>Create a company to manage invoices, team members, and settings.</p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Company name *"
          style={{ flex: 1 }}
        />
        <button
          className="button"
          onClick={handleCreate}
          disabled={creating}
          style={{ width: 'auto', padding: '8px 20px', fontSize: 13, opacity: creating ? 0.7 : 1 }}
        >
          {creating ? 'Creating…' : 'Create'}
        </button>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', margin: '4px 0 14px' }} />

      {/* Profile section */}
      {editingProfile ? (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            <div className="form-field" style={{ margin: 0 }}>
              <label>First Name *</label>
              <input className="input" value={profileDraft.first_name} onChange={(e) => setProfileDraft((d) => ({ ...d, first_name: e.target.value }))} />
            </div>
            <div className="form-field" style={{ margin: 0 }}>
              <label>Last Name</label>
              <input className="input" value={profileDraft.last_name} onChange={(e) => setProfileDraft((d) => ({ ...d, last_name: e.target.value }))} />
            </div>
          </div>
          <div className="form-field" style={{ marginBottom: 12 }}>
            <label>Mobile</label>
            <input className="input" value={profileDraft.phone_number} placeholder="0400 000 000" onChange={(e) => setProfileDraft((d) => ({ ...d, phone_number: e.target.value }))} />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button className="button" onClick={saveProfile} disabled={savingProfile} style={{ width: 'auto', padding: '7px 16px', fontSize: 13, opacity: savingProfile ? 0.7 : 1 }}>
              {savingProfile ? 'Saving…' : 'Save'}
            </button>
            <button className="button secondary" onClick={() => setEditingProfile(false)} style={{ width: 'auto', padding: '7px 14px', fontSize: 13 }}>Cancel</button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div>
              <span style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Name</span>
              <p style={{ margin: '1px 0 0', fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{fullName}</p>
            </div>
            <div>
              <span style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Mobile</span>
              <p style={{ margin: '1px 0 0', fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{profile?.phone_number || '—'}</p>
            </div>
            <div>
              <span style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Email</span>
              <p style={{ margin: '1px 0 0', fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{profile?.email || '—'}</p>
            </div>
          </div>
          <button className="button secondary" onClick={startEditProfile} style={{ width: 'auto', padding: '6px 14px', fontSize: 13, flexShrink: 0 }}>Edit</button>
        </div>
      )}
    </div>
  );
}
