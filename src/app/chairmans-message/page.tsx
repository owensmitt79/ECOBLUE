'use client';

import React from 'react';
import Link from 'next/link';
import { useModal } from '@/context/ModalContext';

export default function ChairmansMessagePage() {
  const { openQuoteModal } = useModal();

  return (
    <div>
      {/* Page Header */}
      <section
        className="page-header"
        style={{
          position: 'relative',
          backgroundImage: "linear-gradient(135deg, rgba(6, 44, 67, 0.88) 0%, rgba(11, 66, 97, 0.82) 100%), url('/images/chairmans-hero.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 35%',
          backgroundRepeat: 'no-repeat',
          color: '#ffffff',
          padding: 'clamp(4.5rem, 8vw, 6.5rem) 1.25rem',
          textAlign: 'center',
          boxShadow: 'inset 0 -30px 40px -20px rgba(6, 44, 67, 0.8)'
        }}
      >
        <div className="container" style={{ maxWidth: '860px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', fontSize: '0.9rem', color: '#94A3B8', marginBottom: '16px' }}>
            <Link href="/" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <Link href="/about" style={{ color: '#CBD5E1', textDecoration: 'none' }}>About Us</Link>
            <span>/</span>
            <span style={{ color: '#6EE7B7', fontWeight: 600 }}>Chairman's Message</span>
          </div>
          <span
            className="section-badge"
            style={{
              background: 'rgba(46, 154, 60, 0.35)',
              color: '#6EE7B7',
              border: '1px solid rgba(110, 231, 183, 0.45)',
              backdropFilter: 'blur(8px)',
              padding: '6px 16px',
              borderRadius: '999px',
              fontSize: '0.85rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: '1.25rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            Executive Leadership Address
          </span>
          <h1
            style={{
              fontSize: 'clamp(2.3rem, 4.5vw, 3.5rem)',
              color: '#ffffff',
              fontWeight: 800,
              lineHeight: 1.18,
              marginBottom: '1.2rem',
              textShadow: '0 2px 12px rgba(0, 0, 0, 0.4)'
            }}
          >
            Chairman's Message
          </h1>
          <p
            style={{
              maxWidth: '720px',
              margin: '0 auto',
              fontSize: '1.15rem',
              color: '#E2EBF0',
              lineHeight: 1.65,
              textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)'
            }}
          >
            A strategic mandate on environmental stewardship, modern compactor logistics, and sustainable economic transformation in Rivers State.
          </p>
        </div>
      </section>

      {/* Executive Statement Article */}
      <section className="section" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'start' }}>
            {/* Left Profile Card */}
            <aside style={{ backgroundColor: 'var(--color-bg-body)', border: '1px solid var(--color-border-subtle)', borderRadius: '20px', padding: '32px', textAlign: 'center', boxShadow: 'var(--shadow-md)' }}>
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  margin: '0 auto 1.25rem',
                  background: 'linear-gradient(135deg, var(--color-primary-navy) 0%, var(--color-primary-green) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: 'var(--shadow-green)',
                  border: '4px solid #ffffff'
                }}
              >
                <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-navy)', marginBottom: '4px' }}>
                Executive Leadership
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-primary-green)', marginBottom: '1rem' }}>
                Office of the Chairman
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '1rem', marginTop: '1rem', lineHeight: 1.5 }}>
                EcoBlue Environmental Services Ltd.<br />Port Harcourt, Rivers State
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <Link href="/consultation" className="btn btn-primary" style={{ width: '100%', padding: '12px', display: 'block', textAlign: 'center' }}>
                  Request Consultation
                </Link>
              </div>
            </aside>

            {/* Right Article Content */}
            <article style={{ color: 'var(--color-primary-navy)', fontSize: '1.05rem', lineHeight: 1.85 }}>
              <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-primary-navy)', lineHeight: 1.5, marginBottom: '2rem', paddingLeft: '1.5rem', borderLeft: '4px solid var(--color-primary-green)' }}>
                "At EcoBlue Environmental Services Ltd., our driving conviction is that sustainable waste management is the foundation of public health, urban dignity, and economic resilience."
              </div>

              <p style={{ marginBottom: '1.5rem', color: 'var(--color-text-main)' }}>
                Welcome to <strong>EcoBlue Environmental Services Ltd.</strong> As we navigate the complex ecological and infrastructural dynamics of Port Harcourt and Greater Rivers State, our enterprise was established under the Companies and Allied Matters Act 2020 (CAMA 2020) with a precise vision: to build a dependable, technology-enabled, and environmentally responsible waste solutions ecosystem that sets national benchmarks.
              </p>

              <p style={{ marginBottom: '1.5rem', color: 'var(--color-text-main)' }}>
                The challenges of urban waste in our region require more than conventional disposal. Rapid urban expansion, commercial density, and industrial growth demand modern engineering, disciplined fleet logistics, and an uncompromising commitment to circular resource recovery. We have invested strategically in high-capacity <strong>heavy hydraulic compactor vehicles</strong>, GPS telemetry systems, and trained environmental personnel to ensure that collection schedules are prompt, sanitary, and transparent.
              </p>

              <div style={{ backgroundColor: 'var(--color-bg-surface-alt)', borderRadius: '18px', border: '1px solid var(--color-border-subtle)', padding: '28px', margin: '2.25rem 0' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-navy)', marginBottom: '0.75rem' }}>
                  Three Strategic Pillars of Our Mandate:
                </h3>
                <ul style={{ display: 'grid', gap: '0.75rem', listStyle: 'none', padding: 0, margin: 0 }}>
                  <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--color-primary-green)', fontWeight: 800 }}>01.</span>
                    <span><strong>Operational Reliability:</strong> Guaranteeing uninterrupted collection services for residential estates, commercial facilities, and industrial complexes.</span>
                  </li>
                  <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--color-primary-green)', fontWeight: 800 }}>02.</span>
                    <span><strong>Circular Economy Integration:</strong> Diverting valuable plastics, cardboard, and scrap metals away from landfills into structured reprocessing cycles.</span>
                  </li>
                  <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--color-primary-green)', fontWeight: 800 }}>03.</span>
                    <span><strong>Regulatory Partnership:</strong> Working in complete harmony with statutory environmental protection authorities to protect our waterways and communities.</span>
                  </li>
                </ul>
              </div>

              <p style={{ marginBottom: '1.5rem', color: 'var(--color-text-main)' }}>
                To our corporate clients, estate executives, and community partners: EcoBlue is not merely a service contractor; we are your long-term sustainability partner. We measure our success not solely by the tonnage of waste evacuated, but by the cleaner streets, unblocked drainage channels, and healthier living spaces we create every day.
              </p>

              <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '2px solid var(--color-border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary-navy)' }}>Executive Chairman</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-primary-green)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    EcoBlue Environmental Services Ltd.
                  </div>
                </div>
                <div>
                  <Link href="/about" className="btn btn-secondary">
                    Explore Our Story &rarr;
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
