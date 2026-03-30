'use client';

import React, { useState } from 'react';
import { useAudioRecorder } from '@/modules/invoice/hooks/useAudioRecorder';
import apiClient from '@/lib/api-client';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function InvoiceVoiceRecorder() {
  const router = useRouter();
  const { isRecording, audioBlob, startRecording, stopRecording, resetRecording, recordingTime } =
    useAudioRecorder();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartRecording = async () => {
    setError(null);
    try {
      await startRecording();
    } catch (err) {
      setError('Could not access microphone. Please check permissions.');
      toast.error('Microphone access denied');
    }
  };

  const handleStopRecording = async () => {
    try {
      await stopRecording();
    } catch (err) {
      setError('Error stopping recording');
      toast.error('Error stopping recording');
    }
  };

  const handleSendRecording = async () => {
    if (!audioBlob) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.webm');
      const response = await apiClient.post('/invoices/from-audio', formData);
      const invoiceId = response.data?.data?.invoice?.id;
      toast.success('Invoice created successfully!');
      resetRecording();
      if (invoiceId) {
        router.push(`/invoice/${invoiceId}`);
      } else {
        // Fallback if ID is missing for some reason
        router.push('/invoice');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create invoice';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    resetRecording();
    router.push('/invoice/new'); // or wherever you want to navigate on cancel
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: '100px', // clear bottom nav
    }}>

      {/* Circle with text — overlaps into mic button */}
      <div style={{
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.05)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '-20px', // ← pulls mic button up to overlap
        zIndex: 0,
      }}>
        <h1 style={{
          fontSize: '1.3rem',
          fontWeight: 700,
          color: 'var(--text)',
          margin: '0 0 8px 0',
          lineHeight: 1.2,
        }}>
          {isRecording ? 'Recording...' : audioBlob ? 'Recording Done' : 'Tap to Record'}
        </h1>
        <p style={{
          fontSize: '0.85rem',
          color: 'var(--muted)',
          margin: 0,
          lineHeight: 1.5,
          padding: '0 40px',
          textAlign: 'center',
        }}>
          {isRecording
            ? formatTime(recordingTime)
            : audioBlob
            ? 'Ready to send'
            : 'Describe job, hours, and rates clearly.'}
        </p>
      </div>

      {/* Mic button — overlaps circle */}
      <button
        onClick={isRecording ? handleStopRecording : audioBlob ? undefined : handleStartRecording}
        disabled={isSubmitting}
        style={{
          width: '98px',
          height: '100px',
          borderRadius: '50%',
          border: 'none',
          background: isRecording ? '#ef4444' : audioBlob ? '#3b82f6' : '#10b981',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 120ms ease',
          zIndex: 1, // ← sits on top of circle
          flexShrink: 0,
        }}
      >
        {isRecording ? (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </svg>
        ) : audioBlob ? (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        ) : (
          <svg width="42" height="42" viewBox="0 0 24 24" fill="white">
            <path d="M12 15c1.66 0 3-1.34 3-3V6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
        )}
      </button>

      {/* Try Saying */}
      {!audioBlob && !isRecording && (
        <div style={{ marginTop: '32px', width: '100%', maxWidth: '340px', textAlign: 'center' }}>
          <p style={{
            fontSize: '0.75rem',
            color: 'var(--muted)',
            marginBottom: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            TRY SAYING
          </p>
          <div className="card" style={{
            padding: '14px 20px',
            fontStyle: 'italic',
            color: 'var(--muted)',
            fontSize: '0.9rem',
            borderRadius: '16px',
          }}>
            "Bill Smith, 10 meters pipe, 2 hours labour at $120"
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          marginTop: '20px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '12px',
          padding: '12px 16px',
          fontSize: '0.85rem',
          color: '#ef4444',
          width: '100%',
          maxWidth: '340px',
        }}>
          {error}
        </div>
      )}

      {/* Action buttons */}
      {audioBlob && (
        <div style={{
          display: 'flex',
          gap: '12px',
          width: '100%',
          maxWidth: '340px',
          marginTop: '32px',
        }}>
          <button
            onClick={handleCancel}
            className="button secondary"
            disabled={isSubmitting}
            style={{ flex: 1 }}
          >
            Cancel
          </button>
          <button
            onClick={handleSendRecording}
            className="button"
            disabled={isSubmitting}
            style={{ flex: 1, opacity: isSubmitting ? 0.7 : 1 }}
          >
            {isSubmitting ? 'Sending...' : 'Send Recording'}
          </button>
        </div>
      )}
    </div>
  );
}
