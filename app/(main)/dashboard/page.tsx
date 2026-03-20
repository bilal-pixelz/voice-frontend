'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import Stats from '@/modules/dashboard/components/Stats';
import RecentInvoices from '@/modules/dashboard/components/RecentInvoices';

export default function DashboardPage() {
  const { message, setMessage } = useNotificationStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (message) {
      toast.success(message);
      setMessage(null);
    }
  }, [message, setMessage]);

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

      <Stats />

      <RecentInvoices />
    </div>
  );
}
