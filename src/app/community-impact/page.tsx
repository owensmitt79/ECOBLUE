'use client';

import React from 'react';
import Link from 'next/link';
import { useModal } from '@/context/ModalContext';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';

export default function CommunityImpactPage() {
  const { openQuoteModal } = useModal();

  return (
    <div>
      {/* Header */}
      <section className="page-header" style={{ backgroundColor: 'var(--color-navy-dark)', color: '#fff', padding: '4rem 0', textAlign: 'center' }}>
        <div className="container">
          <span className="section-badge" style={{ background: 'rgba(46, 154, 60, 0.25)', color: '#6EE7B7', border: '1px solid rgba(46, 154, 60, 0.4)', marginBottom: '1rem', display: 'inline-block' }}>
            Measurable Renewal
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 3.5vw, 3.2rem)', color: '#ffffff', fontWeight: 800, marginBottom: '1rem' }}>
            Community Impact & Environmental Renewal
          </h1>
          <p style={{ maxWidth: '720px', margin: '0 auto', fontSize: '1.1rem', color: '#CBD5E1', lineHeight: 1.6 }}>
            Direct visual evidence of our intervention: clearing uncontained urban refuse heaps, restoring drainage channels, and building clean neighborhoods.
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

          <div style={{ maxWidth: '880px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            <BeforeAfterSlider
              beforeImage="/images/street-before.jpg"
              afterImage="/images/street-after.jpg"
              title="Urban Transit Corridor Restoration"
              description="Heavy compactor clearance of illegal roadside dumping, followed by biological deodorization and routine evacuation."
              beforeLabel="Before Intervention"
              afterLabel="EcoBlue Cleared"
              aspectRatio="16/9"
            />

            <BeforeAfterSlider
              beforeImage="/images/before-after-street.jpg"
              afterImage="/images/street-after.jpg"
              title="Residential Access Road Clearance"
              description="Complete removal of accumulated industrial refuse blocking vehicular access and municipal drainage conduits."
              beforeLabel="Unmanaged Dumpsite"
              afterLabel="Restored Roadway"
              aspectRatio="16/9"
            />
          </div>
        </div>
      </section>

      {/* Community Engagement Pillars */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-surface-alt)' }}>
        <div className="container">
          <div className="text-center" style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem auto' }}>
            <h2 style={{ fontSize: '2.2rem', color: 'var(--color-primary-navy)', fontWeight: 800, marginBottom: '12px' }}>
              Grassroots Environmental Outreach
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>
              Long-term environmental sustainability requires behavioral change alongside mechanical evacuation.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div className="card" style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '16px', boxShadow: 'var(--shadow-md)' }}>
              <div style={{ fontSize: '1.8rem', color: 'var(--color-primary-green)', marginBottom: '16px' }}>🌱</div>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary-navy)', fontWeight: 700, marginBottom: '10px' }}>School Recycling Drives</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: 1.65 }}>
                Educating primary and secondary students across Port Harcourt on plastic segregation, circular materials, and environmental responsibility.
              </p>
            </div>

            <div className="card" style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '16px', boxShadow: 'var(--shadow-md)' }}>
              <div style={{ fontSize: '1.8rem', color: 'var(--color-primary-green)', marginBottom: '16px' }}>🤝</div>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary-navy)', fontWeight: 700, marginBottom: '10px' }}>Community Clean-Up Days</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: 1.65 }}>
                Voluntary weekend sanitation drives partnering with local youth groups, youth leaders, and market associations to clear street gutters.
              </p>
            </div>

            <div className="card" style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '16px', boxShadow: 'var(--shadow-md)' }}>
              <div style={{ fontSize: '1.8rem', color: 'var(--color-primary-green)', marginBottom: '16px' }}>♻️</div>
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
