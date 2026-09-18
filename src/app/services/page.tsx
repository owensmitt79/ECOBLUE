'use client';

import React from 'react';
import Link from 'next/link';
import { useModal } from '@/context/ModalContext';

export default function ServicesPage() {
  const { openQuoteModal } = useModal();

  return (
    <div>
      {/* Header */}
      <section className="page-header" style={{ backgroundColor: 'var(--color-navy-dark)', color: '#fff', padding: '4rem 0', textAlign: 'center' }}>
        <div className="container">
          <span className="section-badge" style={{ background: 'rgba(46, 154, 60, 0.25)', color: '#6EE7B7', border: '1px solid rgba(46, 154, 60, 0.4)', marginBottom: '1rem', display: 'inline-block' }}>
            Operational Divisions
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 3.5vw, 3.2rem)', color: '#ffffff', fontWeight: 800, marginBottom: '1rem' }}>
            Comprehensive Environmental Services
          </h1>
          <p style={{ maxWidth: '720px', margin: '0 auto', fontSize: '1.1rem', color: '#CBD5E1', lineHeight: 1.6 }}>
            Reliable waste collection, advanced material recovery, industrial sanitation, and logistics across Port Harcourt and Rivers State.
          </p>
        </div>
      </section>

      {/* Division 1: Municipal & Residential */}
      <section className="section" style={{ backgroundColor: '#FFFFFF' }} id="waste-collection">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div>
              <span className="section-badge" style={{ color: 'var(--color-primary-green)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
                Division 01
              </span>
              <h2 style={{ fontSize: '2.2rem', color: 'var(--color-primary-navy)', fontWeight: 800, margin: '8px 0 16px 0' }}>
                Municipal & Residential Waste Collection
              </h2>
              <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '16px' }}>
                Our residential service provides gated estates, private neighborhoods, and municipal zones with scheduled, hygienic waste evacuation using sealed hydraulic compactor trucks that eliminate spillage, foul odors, and pests.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text-main)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-green)" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Customized 2x or 3x weekly compactor route dispatches
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text-main)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-green)" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Standardized 240L & 1,100L heavy-duty wheeled dustbins
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text-main)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-green)" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Zero-spill hydraulic rear-loader compaction
                </li>
              </ul>
              <button onClick={() => openQuoteModal('Waste Collection & Disposal')} className="btn btn-primary">
                Request Residential Evacuation
              </button>
            </div>

            <div>
              <div style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: 'var(--shadow-xl)' }}>
                <img src="/images/fleet-city-trucks.jpg" alt="Municipal Waste Collection" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Division 2: Recycling & Materials Recovery */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-surface-alt)' }} id="recycling">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div style={{ order: 2 }}>
              <span className="section-badge" style={{ color: 'var(--color-primary-green)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
                Division 02
              </span>
              <h2 style={{ fontSize: '2.2rem', color: 'var(--color-primary-navy)', fontWeight: 800, margin: '8px 0 16px 0' }}>
                Material Recovery & Recycling Operations
              </h2>
              <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '16px' }}>
                We convert solid waste into valuable industrial feedstock. Through source segregation and specialized sorting operations in Port Harcourt, we process PET bottles, HDPE plastic drums, corrugated cardboard cartons, and non-ferrous metals.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text-main)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-green)" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Industrial polymer recovery & high-density baling
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text-main)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-green)" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Commercial cardboard and paper segregation
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text-main)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-green)" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Certified ESG diversion reporting for corporate partners
                </li>
              </ul>
              <button onClick={() => openQuoteModal('Recycling Services')} className="btn btn-primary">
                Inquire on Material Recovery
              </button>
            </div>

            <div style={{ order: 1 }}>
              <div style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: 'var(--shadow-xl)' }}>
                <img src="/images/recycling-facility.jpg" alt="Recycling Facility" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Division 3: Commercial & Environmental */}
      <section className="section" style={{ backgroundColor: '#FFFFFF' }} id="environmental">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div>
              <span className="section-badge" style={{ color: 'var(--color-primary-green)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
                Division 03
              </span>
              <h2 style={{ fontSize: '2.2rem', color: 'var(--color-primary-navy)', fontWeight: 800, margin: '8px 0 16px 0' }}>
                Commercial Facilities & Industrial Sanitation
              </h2>
              <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '16px' }}>
                Designed for shopping malls, corporate headquarters, hospitals, hotels, and logistics yards. We deliver turnkey sanitation, site decontamination, and container placement to guarantee pristine workplace environments.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text-main)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-green)" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Dedicated commercial skip placement and prompt haulage
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text-main)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-green)" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Decontamination & deep sanitization for corporate premises
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text-main)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-green)" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  HSE compliant waste tracking and chain of custody
                </li>
              </ul>
              <button onClick={() => openQuoteModal('Environmental Services')} className="btn btn-primary">
                Request Facility Assessment
              </button>
            </div>

            <div>
              <div style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: 'var(--shadow-xl)' }}>
                <img src="/images/partnerships-handshake.jpg" alt="Commercial Sanitation" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fleet Deep-Link Banner */}
      <section style={{ background: 'linear-gradient(135deg, var(--color-navy-dark) 0%, var(--color-primary-navy) 100%)', color: '#fff', padding: '4rem 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ fontSize: '2.2rem', color: '#ffffff', fontWeight: 800, marginBottom: '1rem' }}>
            Powered by Advanced Compactor Technology
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#CBD5E1', marginBottom: '2rem', lineHeight: 1.6 }}>
            Our fleet features modern hydraulic compactors engineered for high-density load reduction, GPS route efficiency, and strict zero-leakage urban transit.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={() => openQuoteModal('Logistics & Fleet Support')} className="btn btn-primary">
              Request Fleet Dispatch
            </button>
            <Link href="/contact" className="btn btn-outline" style={{ borderColor: '#fff', color: '#fff' }}>
              Contact Operations
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
