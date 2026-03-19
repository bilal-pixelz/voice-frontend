'use client';

import Link from 'next/link';
import Stats from '@/modules/dashboard/components/Stats';
import RecentInvoices from '@/modules/dashboard/components/RecentInvoices';

export default function DashboardPage() {
  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p style={{ fontSize: '13px', color: 'var(--muted)', margin: '3px 0 0' }}>Welcome back</p>
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
