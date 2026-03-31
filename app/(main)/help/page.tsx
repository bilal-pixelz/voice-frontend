'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { handleApiError } from '@/lib/error-handler';
import apiClient from '@/lib/api-client';

const TOPICS = [
  'General Inquiry',
  'Billing & Subscription',
  'Invoice Issue',
  'Xero Integration',
  'Voice Recognition',
  'Bug Report',
  'Feature Request',
] as const;

const EXAMPLE_PROMPTS = [
  {
    label: 'LABOUR & MATERIALS',
    text: '"Install new vanity in main bathroom for Sarah Jones. 4 hours labour at $110 per hour. Supplied vanity unit $450 and flick mixer $120."',
  },
  {
    label: 'FIXED PRICE JOB',
    text: '"Emergency call out to fix burst pipe at 12 Smith St. Fixed price $350 inclusive of parts."',
  },
  {
    label: 'DETAILED BREAKDOWN',
    text: '"Rough in for renovation. 15 meters of 20mm copper pipe, 10 meters of 50mm PVC. 8 hours labour. Charge standard rates."',
  },
];

export default function HelpPage() {
  const router = useRouter();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!subject) { toast.error('Please select a topic.'); return; }
    if (!message.trim()) { toast.error('Please fill out the message.'); return; }
    setSending(true);
    try {
      await apiClient.post('/profile/support', { subject, message: message.trim() });
      toast.success('Message sent! We\'ll get back to you soon.');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container" style={{ paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <button
          onClick={() => router.back()}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 20, color: 'var(--text)', padding: 0, lineHeight: 1,
          }}
        >
          &#8249;
        </button>
        <h1 className="page-title" style={{ margin: 0 }}>Help & Support</h1>
      </div>

      {/* Tips section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 18 }}>&#9432;</span>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>How to get the best results</p>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <p style={{ margin: '0 0 12px', fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
          Voice 2 Invoice works best when you provide specific details about the job. Ensure you mention:
        </p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 6, lineHeight: 1.5 }}>
            <span style={{ color: '#22c55e', fontWeight: 600 }}>Description:</span> What work was done?
          </li>
          <li style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 6, lineHeight: 1.5 }}>
            <span style={{ color: '#22c55e', fontWeight: 600 }}>Quantity:</span> Hours worked or items used.
          </li>
          <li style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
            <span style={{ color: '#22c55e', fontWeight: 600 }}>Price:</span> Hourly rate or fixed cost.
          </li>
        </ul>
      </div>

      {/* Example prompts */}
      <p style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', margin: '0 0 14px' }}>Example Prompts</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
        {EXAMPLE_PROMPTS.map((prompt) => (
          <div key={prompt.label} className="card">
            <p style={{
              margin: '0 0 8px', fontSize: 11, fontWeight: 700, color: 'var(--muted)',
              textTransform: 'uppercase', letterSpacing: '0.08em',
            }}>
              {prompt.label}
            </p>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--text)', fontStyle: 'italic', lineHeight: 1.6 }}>
              {prompt.text}
            </p>
          </div>
        ))}
      </div>

      {/* Contact support */}
      <p style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', margin: '0 0 14px' }}>Contact Support</p>
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="form-field" style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--muted)', textTransform: 'uppercase' }}>
            Subject
          </label>
          <select
            className="input"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            <option value="">Select a topic</option>
            {TOPICS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="form-field" style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--muted)', textTransform: 'uppercase' }}>
            Message
          </label>
          <textarea
            className="input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="How can we help you?"
            rows={4}
            style={{ resize: 'vertical', minHeight: 90 }}
          />
        </div>

        <button
          className="button"
          onClick={handleSend}
          disabled={sending}
          style={{ width: '100%', opacity: sending ? 0.7 : 1 }}
        >
          {sending ? 'Sending...' : 'Send Message'}
        </button>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', paddingTop: 8 }}>
        <p style={{ margin: '0 0 4px', fontSize: 12, color: 'var(--muted)' }}>
          Support Hours: Mon-Fri, 9am - 5pm AEST
        </p>
        <p style={{ margin: 0, fontSize: 12, color: 'var(--muted)' }}>
          Email: support@voice2invoice.com.au
        </p>
      </div>
    </div>
  );
}
