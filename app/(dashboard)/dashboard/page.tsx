'use client';

import PageHeader from '@/components/layout/PageHeader';
import Link from 'next/link';

// Dummy data for the dashboard
const stats = [
  { name: 'Total Invoices', value: '1,234' },
  { name: 'Pending', value: '56' },
  { name: 'Paid', value: '$45,678' },
  { name: 'Overdue', value: '12' },
];

const recentInvoices = [
  { id: 'INV-001', customer: 'Acme Inc.', date: '2024-03-15', amount: '$2,500.00', status: 'Paid' },
  { id: 'INV-002', customer: 'Stark Industries', date: '2024-03-12', amount: '$1,200.50', status: 'Pending' },
  { id: 'INV-003', customer: 'Wayne Enterprises', date: '2024-03-10', amount: '$8,000.00', status: 'Paid' },
  { id: 'INV-004', customer: 'Globex Corporation', date: '2024-02-28', amount: '$500.00', status: 'Overdue' },
  { id: 'INV-005', customer: 'Cyberdyne Systems', date: '2024-02-25', amount: '$3,750.00', status: 'Paid' },
];

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard">
        <Link href="/invoice/new" className="button">
          New Invoice
        </Link>
      </PageHeader>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <h3 className="small-text" style={{ marginBottom: '0.5rem', color: '#6c757d' }}>{stat.name}</h3>
            <p className="page-title" style={{ fontSize: '2rem' }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Invoices */}
      <div className="card">
        <h2 className="page-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
          Recent Invoices
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #dee2e6' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Invoice ID</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Customer</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Date</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Amount</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map((invoice, index) => (
                <tr key={invoice.id} style={{ borderBottom: index === recentInvoices.length - 1 ? 'none' : '1px solid #dee2e6' }}>
                  <td style={{ padding: '0.75rem' }}>{invoice.id}</td>
                  <td style={{ padding: '0.75rem' }}>{invoice.customer}</td>
                  <td style={{ padding: '0.75rem' }}>{invoice.date}</td>
                  <td style={{ padding: '0.75rem' }}>{invoice.amount}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem', 
                      color: '#fff',
                      backgroundColor: invoice.status === 'Paid' ? '#28a745' : invoice.status === 'Pending' ? '#ffc107' : '#dc3545',
                      fontSize: '0.875rem'
                    }}>
                      {invoice.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
