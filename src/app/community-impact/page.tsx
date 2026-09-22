'use client';

import React from 'react';
import Link from 'next/link';
import { useModal } from '@/context/ModalContext';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';

export default function CommunityImpactPage() {
  const { openQuoteModal } = useModal();

  return (
    <div>
      {/* Header with Community Outreach Photo */}
      <section
        className="page-header"
        style={{
          position: 'relative',
          backgroundImage: "linear-gradient(135deg, rgba(6, 44, 67, 0.86) 0%, rgba(11, 66, 97, 0.82) 100%), url('/images/community-hero.jpg')",
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
            Community Impact & <span style={{ color: '#6EE7B7' }}>Environmental Renewal</span>
          </h1>
          <p
            style={{
              maxWidth: '740px',
              margin: '0 auto',
              fontSize: '1.15rem',
              color: '#E2E8F0',
              lineHeight: 1.7,
              textShadow: '0 1px 8px rgba(0, 0, 0, 0.35)'
            }}
          >
            Direct visual evidence of our grassroots intervention: clearing uncontained refuse heaps, restoring urban drainage conduits, and empowering local neighborhoods across Rivers State.
          </p>
        </div>
      </section>

      {/* Before / After Showcase Section */}
      <section className="section" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ maxWidth: '840px', margin: '0 auto 3rem auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.2rem', color: 'var(--color-primary-navy)', fontWeight: 800, marginBottom: '12px' }}>
              Urban Corridor Transformations
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Drag the interactive slider handle left and right to view the dramatic difference between unmanaged public waste dumping and the post-intervention state delivered by EcoBlue.
            </p>
          </div>

          <BeforeAfterSlider
            beforeImage="/images/street-before.jpg"
            afterImage="/images/street-after.jpg"
            beforeLabel="Prior to Intervention"
            afterLabel="Post-Intervention Cleared"
          />
        </div>
      </section>

      {/* Grassroots Advocacy Section */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-surface-alt)' }}>
        <div className="container">
          <div style={{ maxWidth: '840px', margin: '0 auto 3rem auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.2rem', color: 'var(--color-primary-navy)', fontWeight: 800, marginBottom: '12px' }}>
              Community Engagement & Public Health
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>
              Long-term environmental sustainability requires behavioral change alongside mechanical evacuation.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div className="card" style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '16px', boxShadow: 'var(--shadow-md)' }}>
              <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
              </div>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary-navy)', fontWeight: 700, marginBottom: '10px' }}>School Recycling Drives</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: 1.65 }}>
                Educating primary and secondary students across Port Harcourt on plastic segregation, circular materials, and environmental responsibility.
              </p>
            </div>

            <div className="card" style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '16px', boxShadow: 'var(--shadow-md)' }}>
              <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary-navy)', fontWeight: 700, marginBottom: '10px' }}>Community Clean-Up Days</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: 1.65 }}>
                Voluntary weekend sanitation drives partnering with local youth groups, youth leaders, and market associations to clear street gutters.
              </p>
            </div>

            <div className="card" style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '16px', boxShadow: 'var(--shadow-md)' }}>
              <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"/><path d="M11 19h8.2a1.8 1.8 0 0 0 1.583-.914.99.99 0 0 0 .017-.95L17.5 12"/><path d="m14 16 3 3 3-3"/><path d="m8.5 2 1.5 3-3 1"/><path d="M9.7 5.5 12 2l4 7h-4.5"/></svg>
              </div>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary-navy)', fontWeight: 700, marginBottom: '10px' }}>Informal Collector Support</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: 1.65 }}>
                Fair-trade pricing and PPE safety gear provision for local informal waste pickers supplying PET polymer bales to our recovery centers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: 'var(--color-primary-navy)', color: '#fff', padding: '4rem 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <h2 style={{ fontSize: '2.2rem', color: '#ffffff', fontWeight: 800, marginBottom: '1rem' }}>
            Bring EcoBlue to Your Community
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#CBD5E1', marginBottom: '2rem', lineHeight: 1.6 }}>
            Partner with us to organize an estate clean-up drive or request structured municipal compactor collection in your neighborhood.
          </p>
          <button onClick={() => openQuoteModal()} className="btn btn-primary btn-lg">
            Request Community Partnership
          </button>
        </div>
      </section>
    </div>
  );
}
