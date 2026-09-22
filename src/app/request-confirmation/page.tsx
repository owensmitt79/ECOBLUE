'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { StorageService } from '@/lib/storage';
import { QuoteLead } from '@/lib/types';

function getStatusBadgeClass(status?: string) {
  switch (status) {
    case 'Pending':
      return 'badge-pending';
    case 'Reviewed':
      return 'badge-reviewed';
    case 'Contacted':
      return 'badge-contacted';
    case 'Completed':
      return 'badge-completed';
    default:
      return 'badge-pending';
  }
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const quoteId = searchParams.get('id');

  const [quote, setQuote] = useState<QuoteLead | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchQuote = async () => {
      if (quoteId) {
        const found = await StorageService.getQuoteById(quoteId);
        if (found) {
          setQuote(found);
        } else {
          // Fallback: take newest quote if none found
          const quotes = await StorageService.getQuotes();
          if (quotes.length > 0) setQuote(quotes[0]);
        }
      } else {
        const quotes = await StorageService.getQuotes();
        if (quotes.length > 0) setQuote(quotes[0]);
      }
      setLoaded(true);
    };

    fetchQuote();
  }, [quoteId]);

  if (!loaded) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
        <div className="spinner" style={{ margin: '0 auto 1.5rem auto' }} />
        <p style={{ color: 'var(--color-text-muted)' }}>Retrieving request verification dossier...</p>
      </div>
    );
  }

  if (!quote) {
    return (
      <div style={{ maxWidth: '640px', margin: '4rem auto', textAlign: 'center', padding: '2.5rem', background: '#ffffff', borderRadius: '16px', boxShadow: 'var(--shadow-md)' }}>
        <h2 style={{ color: 'var(--color-primary-navy)', marginBottom: '1rem' }}>No Active Request Found</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
          We could not locate the requested service booking. Please submit a new request.
        </p>
        <Link href="/request" className="btn btn-primary">
          Submit Service Request
        </Link>
      </div>
    );
  }

  const dateStr = quote.createdAt
    ? new Date(quote.createdAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Recently';

  // WhatsApp dispatch link
  const waMsg = encodeURIComponent(
    `Hello EcoBlue Dispatch, I submitted service request #${quote.id} for "${quote.service}" (${quote.name}). Please confirm route scheduling.`
  );
  const waUrl = `https://wa.me/2348061193218?text=${waMsg}`;

  return (
    <div style={{ padding: '3rem 1rem', maxWidth: '880px', margin: '0 auto' }}>
      {/* Top Banner & Status */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0B4261 0%, #062C43 100%)',
          color: '#ffffff',
          borderRadius: '20px',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(6, 44, 67, 0.2)'
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(46, 154, 60, 0.2)',
            border: '2px solid #2E9A3C',
            marginBottom: '1.25rem',
            color: '#4ADE80'
          }}
        >
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.4rem)', fontWeight: 800, marginBottom: '0.5rem', color: '#ffffff' }}>
          Service Request Logged Successfully
        </h1>
        <p style={{ color: '#CBD5E1', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto 1.5rem auto' }}>
          Your service consultation has been safely queued in the EcoBlue Operations Pipeline and connected directly to the staff administrative console.
        </p>

        {/* Reference and Status Pills */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.45rem 1.1rem',
              background: 'rgba(255, 255, 255, 0.12)',
              borderRadius: '999px',
              backdropFilter: 'blur(4px)',
              fontSize: '0.9rem',
              fontWeight: 600,
              letterSpacing: '0.04em'
            }}
          >
            <span>Tracking Ticket:</span>
            <strong style={{ color: '#6EE7B7' }}>{quote.id}</strong>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.45rem 1.1rem',
              background: 'rgba(255, 255, 255, 0.12)',
              borderRadius: '999px',
              fontSize: '0.9rem'
            }}
          >
            <span>Status:</span>
            <span className={`badge ${getStatusBadgeClass(quote.status)}`} style={{ textTransform: 'uppercase', fontSize: '0.75rem' }}>
              {quote.status}
            </span>
          </div>

          <div style={{ fontSize: '0.825rem', color: '#94A3B8' }}>
            Logged: {dateStr}
          </div>
        </div>
      </div>

      {/* Admin Direct Connection Banner */}
      <div
        style={{
          marginTop: '1.75rem',
          background: '#EFF6FF',
          border: '1.5px solid #BFDBFE',
          borderRadius: '16px',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.25rem',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'var(--color-primary-navy)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--color-primary-navy)', fontSize: '0.95rem' }}>
              Staff & Dispatch Connection Active
            </div>
            <div style={{ fontSize: '0.85rem', color: '#475569' }}>
              This request is synchronized in the Staff Admin Console. Operations officers can review and update its status.
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1.25rem',
            fontSize: '0.875rem',
            fontWeight: 700,
            color: 'var(--color-primary-green)',
            background: 'var(--color-green-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            whiteSpace: 'nowrap'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Queued for Field Evacuation</span>
        </div>
      </div>

      {/* Booking Dossier Details */}
      <div
        style={{
          marginTop: '1.75rem',
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid var(--color-border-subtle)',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid var(--color-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#F8FAFC'
          }}
        >
          <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--color-primary-navy)', fontWeight: 700 }}>
            Official Request Dossier
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)', fontWeight: 500 }}>
            Rivers State Environmental Standard
          </span>
        </div>

        <div style={{ padding: '1.75rem' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.5rem',
              marginBottom: '1.5rem'
            }}
          >
            <div style={{ background: '#F8FAFC', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-subtle)', fontWeight: 700, marginBottom: '0.35rem' }}>
                Client / Organization
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-primary-navy)' }}>
                {quote.name}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                {quote.company || 'Individual / Residential'}
              </div>
            </div>

            <div style={{ background: '#F8FAFC', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-subtle)', fontWeight: 700, marginBottom: '0.35rem' }}>
                Primary Service
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-primary-green)' }}>
                {quote.service}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                Waste Stream: {quote.wasteType || 'General Municipal Stream'}
              </div>
            </div>

            <div style={{ background: '#F8FAFC', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-subtle)', fontWeight: 700, marginBottom: '0.35rem' }}>
                Contact Coordinates
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                📞 {quote.phone}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', wordBreak: 'break-all' }}>
                ✉️ {quote.email}
              </div>
            </div>

            <div style={{ background: '#F8FAFC', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-subtle)', fontWeight: 700, marginBottom: '0.35rem' }}>
                Site Location
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                📍 {quote.location || 'Port Harcourt / Rivers State'}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                Target Timeline: {quote.timeline || 'Immediate Dispatch Schedule'}
              </div>
            </div>
          </div>

          {quote.notes && (
            <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-subtle)', fontWeight: 700, marginBottom: '0.35rem' }}>
                Special Scope & Operational Notes
              </div>
              <div style={{ fontSize: '0.95rem', color: 'var(--color-text-main)', lineHeight: 1.6 }}>
                {quote.notes}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Center Buttons */}
      <div
        style={{
          marginTop: '2rem',
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}
      >
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn"
          style={{
            backgroundColor: '#25D366',
            color: '#FFFFFF',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.85rem 1.5rem',
            fontWeight: 700,
            borderRadius: '999px',
            boxShadow: '0 4px 14px rgba(37, 211, 102, 0.3)'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
          <span>Chat with Field Dispatch (WhatsApp)</span>
        </a>

        <button
          onClick={() => window.print()}
          className="btn btn-outline"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.85rem 1.5rem',
            fontWeight: 600,
            borderRadius: '999px'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
          <span>Print / Save Voucher</span>
        </button>

        <Link
          href="/request"
          className="btn btn-outline"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.85rem 1.5rem',
            fontWeight: 600,
            borderRadius: '999px'
          }}
        >
          <span>Book Another Service</span>
        </Link>
      </div>

      {/* Return to Home link */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link href="/" style={{ color: 'var(--color-primary-navy)', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'underline' }}>
          &larr; Return to EcoBlue Homepage
        </Link>
      </div>
    </div>
  );
}

export default function RequestConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
          <p style={{ color: 'var(--color-text-muted)' }}>Loading confirmation...</p>
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
