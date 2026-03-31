'use client';

import { useState } from 'react';
import { handleApiError } from '@/lib/error-handler';
import { Plan } from '@/modules/profile/api';

interface Props {
  plans: Plan[];
  activePlanSlug: string | null;
  onSwitch: (slug: string) => Promise<void>;
}

// Maps feature keys from the API to human-readable labels
function formatPerk(perk: Plan['perks'][0]): string {
  const labels: Record<string, string> = {
    invoices: 'Invoices/month',
    voice_minutes: 'Voice Minutes',
    api_calls: 'API Calls',
    users: 'Users',
    priority_support: 'Priority Support',
    email_support: 'Email Support',
    basic_exports: 'Basic Exports',
    advanced_analytics: 'Advanced Analytics',
    single_user: 'Single User',
  };
  const label = labels[perk.feature] || perk.feature.replace(/_/g, ' ');
  if (perk.is_boolean) return label;
  if (perk.limit_value === null) return `Unlimited ${label}`;
  return `${perk.limit_value} ${label}`;
}

// Visual accent per plan tier
const PLAN_COLORS: Record<string, string> = {
  free_trial: '#64748b',
  basic: '#0ea5e9',
  pro: '#8b5cf6',
  team: '#f97316',
};

function getPlanColor(slug: string): string {
  return PLAN_COLORS[slug] || '#0ea5e9';
}

export default function BillingPlans({ plans, activePlanSlug, onSwitch }: Props) {
  const [switching, setSwitching] = useState<string | null>(null);

  const handleSwitch = async (slug: string) => {
    if (slug === activePlanSlug) return;
    setSwitching(slug);
    try {
      await onSwitch(slug);
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setSwitching(null);
    }
  };

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--muted)', textTransform: 'uppercase', margin: '0 0 14px' }}>
        Billing &amp; Plans
      </p>

      {/* Billing info row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <p style={{ fontSize: 11, color: 'var(--muted)', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Next Billing</p>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', margin: 0 }}>—</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 11, color: 'var(--muted)', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Payment Method</p>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', margin: 0 }}>—</p>
        </div>
      </div>

      {/* Plan cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        {plans.map((plan) => {
          const color = getPlanColor(plan.slug);
          const isActive = plan.slug === activePlanSlug;
          const isSwitching = switching === plan.slug;
          const priceLabel = plan.price != null ? `$${plan.price}/mo` : 'Free';

          return (
            <div
              key={plan.slug}
              style={{
                border: `1px solid ${isActive ? color + '55' : 'var(--border)'}`,
                borderRadius: 12,
                padding: '14px 12px',
                background: isActive ? `${color}10` : 'rgba(255,255,255,0.02)',
                display: 'flex', flexDirection: 'column', gap: 8,
              }}
            >
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{plan.name}</p>
                <p style={{ margin: '2px 0 0', fontSize: 20, fontWeight: 800, color }}>{priceLabel}</p>
              </div>

              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {plan.perks.map((perk) => (
                  <li key={perk.id} style={{ fontSize: 11, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ color: '#22c55e', fontSize: 10, flexShrink: 0 }}>✓</span>
                    {formatPerk(perk)}
                  </li>
                ))}
                {plan.perks.length === 0 && plan.description && (
                  <li style={{ fontSize: 11, color: 'var(--muted)' }}>{plan.description}</li>
                )}
              </ul>

              <button
                onClick={() => handleSwitch(plan.slug)}
                disabled={isActive || isSwitching}
                style={{
                  marginTop: 'auto',
                  padding: '7px 0', borderRadius: 8,
                  border: isActive ? 'none' : '1px solid var(--border)',
                  background: isActive ? color : 'transparent',
                  color: isActive ? '#fff' : 'var(--text)',
                  fontWeight: 600, fontSize: 12,
                  cursor: isActive ? 'default' : 'pointer',
                  opacity: isSwitching ? 0.6 : 1,
                  transition: 'opacity 0.15s',
                }}
              >
                {isSwitching ? '…' : isActive ? 'Active Plan' : 'Switch Plan'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
