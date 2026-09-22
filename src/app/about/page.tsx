'use client';

import React from 'react';
import Link from 'next/link';
import { useModal } from '@/context/ModalContext';

export default function AboutPage() {
  const { openQuoteModal } = useModal();

  return (
    <div>
      {/* Page Header */}
      <section
        className="page-header"
        style={{
          position: 'relative',
          backgroundImage: "linear-gradient(135deg, rgba(6, 44, 67, 0.88) 0%, rgba(11, 66, 97, 0.82) 100%), url('/images/about-hero.jpg')",
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
            About EcoBlue Environmental Services Ltd.
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
            A leading environmental solutions provider incorporated under the Companies and Allied Matters Act 2020. Headquartered in Port Harcourt, Rivers State.
          </p>
        </div>
      </section>

      {/* Corporate Overview */}
      <section className="section" style={{ backgroundColor: '#FFFFFF' }} id="our-company">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div>
              <span className="section-badge" style={{ color: 'var(--color-primary-green)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Our Foundation
              </span>
              <h2 style={{ fontSize: '2.2rem', color: 'var(--color-primary-navy)', fontWeight: 800, margin: '10px 0 16px 0' }}>
                Dedicated to Environmental Renewal & Sustainable Communities
              </h2>
              <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '16px' }}>
                EcoBlue Environmental Services Ltd. was established to address the critical need for structured, mechanized, and dependable environmental management solutions across Rivers State and the Niger Delta region.
              </p>
              <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '24px' }}>
                Operating with modern hydraulic compactor trucks, automated waste containment units, and dedicated sorting facilities, we bridge the gap between waste generation and material recovery while prioritizing public health, urban aesthetics, and regulatory compliance.
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Link href="/chairmans-message" className="btn btn-secondary">
                  Read Chairman's Message &rarr;
                </Link>
              </div>
            </div>

            <div>
              <div style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: 'var(--shadow-xl)' }}>
                <img
                  src="/images/fleet-crew-operations.jpg"
                  alt="EcoBlue Crew Operations"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-surface-alt)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            <div className="card" style={{ backgroundColor: '#fff', padding: '36px', borderRadius: '16px', boxShadow: 'var(--shadow-md)', borderTop: '4px solid var(--color-primary-green)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: 'var(--color-green-subtle)', color: 'var(--color-primary-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
              </div>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--color-primary-navy)', fontWeight: 700, marginBottom: '12px' }}>Our Mission</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: 1.65 }}>
                To provide world-class, mechanized environmental sanitation, dependable municipal waste evacuation, and responsible material recovery systems that empower clean neighborhoods and protect the ecological vitality of Rivers State.
              </p>
            </div>

            <div className="card" style={{ backgroundColor: '#fff', padding: '36px', borderRadius: '16px', boxShadow: 'var(--shadow-md)', borderTop: '4px solid var(--color-primary-navy)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: 'var(--color-navy-subtle)', color: 'var(--color-primary-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              </div>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--color-primary-navy)', fontWeight: 700, marginBottom: '12px' }}>Our Vision</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: 1.65 }}>
                To be the preeminent and most dependable environmental management partner in Rivers State and across the Niger Delta corridor, recognized for operational excellence, zero-failure route schedules, and circular economic stewardship.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div className="text-center" style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem auto' }}>
            <span className="section-badge" style={{ color: 'var(--color-primary-green)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Guiding Principles
            </span>
            <h2 style={{ fontSize: '2.2rem', color: 'var(--color-primary-navy)', fontWeight: 800, margin: '8px 0 12px 0' }}>
              Our Core Values
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>
              The foundational standards that govern every compactor dispatch, client consultation, and community initiative.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            <div style={{ padding: '24px', borderRadius: '12px', backgroundColor: 'var(--color-bg-body)', border: '1px solid var(--color-border-subtle)' }}>
              <h4 style={{ color: 'var(--color-primary-navy)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>Integrity & Accountability</h4>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Upholding strict statutory compliance, transparent service delivery, and unwavering corporate ethics in all client engagements.
              </p>
            </div>

            <div style={{ padding: '24px', borderRadius: '12px', backgroundColor: 'var(--color-bg-body)', border: '1px solid var(--color-border-subtle)' }}>
              <h4 style={{ color: 'var(--color-primary-navy)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>Operational Reliability</h4>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Ensuring on-time compactor dispatch schedules and dependable emergency response capabilities across all covered corridors.
              </p>
            </div>

            <div style={{ padding: '24px', borderRadius: '12px', backgroundColor: 'var(--color-bg-body)', border: '1px solid var(--color-border-subtle)' }}>
              <h4 style={{ color: 'var(--color-primary-navy)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>Health, Safety & Environment</h4>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Prioritizing crew safety gear, safe waste handling protocols, and protective de-contamination for communal well-being.
              </p>
            </div>

            <div style={{ padding: '24px', borderRadius: '12px', backgroundColor: 'var(--color-bg-body)', border: '1px solid var(--color-border-subtle)' }}>
              <h4 style={{ color: 'var(--color-primary-navy)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>Sustainability & Circularity</h4>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Championing material recovery and turning recyclable polymers into valuable feedstock for local and regional industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: 'var(--color-primary-navy)', color: '#fff', padding: '4rem 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <h2 style={{ fontSize: '2.2rem', color: '#ffffff', fontWeight: 800, marginBottom: '1rem' }}>
            Partner With Our Environmental Team
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#CBD5E1', marginBottom: '2rem', lineHeight: 1.6 }}>
            Discover how EcoBlue can provide structured waste management for your residential community, commercial premises, or institutional facilities.
          </p>
          <button onClick={() => openQuoteModal()} className="btn btn-primary btn-lg">
            Request Service Proposal
          </button>
        </div>
      </section>
    </div>
  );
}
