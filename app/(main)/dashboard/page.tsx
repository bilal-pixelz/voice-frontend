'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import { getDashboard, DashboardData } from '@/modules/invoice/api';
import Stats from '@/modules/dashboard/components/Stats';
import RecentInvoices from '@/modules/dashboard/components/RecentInvoices';

export default function DashboardPage() {
  const { message, setMessage } = useNotificationStore();
  const { user } = useAuthStore();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (message) {
      toast.success(message);
      setMessage(null);
    }
  }, [message, setMessage]);

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p style={{ fontSize: '13px', color: 'var(--muted)', margin: '3px 0 0' }}>
            Welcome back, {user?.name}
          </p>
        </div>
        <Link href="/invoice/new" className="button" style={{ width: 'auto' }}>
          + New Invoice
        </Link>
      </div>

      {loading ? (
        <p style={{ color: 'var(--muted)', textAlign: 'center', paddingTop: 40 }}>Loading...</p>
      ) : (
        <>
          <Stats stats={data?.stats ?? null} />
          <RecentInvoices invoices={data?.recent_invoices ?? []} />
        </>
      )}
    </div>
  );
}
