'use client';

import React from 'react';
import Link from 'next/link';
import { useModal } from '@/context/ModalContext';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';

export default function HomePage() {
  const { openQuoteModal } = useModal();

  return (
    <div>
      {/* 1. Hero Section - Original Full-Width Layout */}
      <section className="hero-wrapper">
        <div className="hero-bg-overlay"></div>
        <div className="hero-pattern"></div>
        <div className="container hero-content">
          <div style={{ maxWidth: '820px' }}>
            <h1 className="hero-title">
              Building a Cleaner, <span>More Sustainable</span> Future
            </h1>

            <p className="hero-subtitle">
              Professional, reliable and sustainable waste management solutions for communities, businesses, institutions and government across Rivers State and Nigeria.
            </p>

            <div className="hero-actions">
              <Link
                href="/consultation"
                className="btn btn-lg btn-primary"
              >
                <span>Request a Consultation</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
              <Link href="/services" className="btn btn-lg btn-outline-white">
                <span>Explore Our Services</span>
              </Link>
            </div>

            <div className="hero-stats-row">
              <div className="hero-stat-item">
                <h4>Environmental Solutions</h4>
                <p>Sustainable Waste Operations</p>
              </div>
              <div className="hero-stat-item">
                <h4>Modern Compactor Fleet</h4>
                <p>Advanced Hydraulic Systems</p>
              </div>
              <div className="hero-stat-item">
                <h4>Port Harcourt HQ</h4>
                <p>Rivers State Regional Focus</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Company Introduction - Original Placement */}
      <section className="section-py" style={{ background: '#ffffff' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
            <div>
              <div className="section-badge navy" style={{ marginBottom: '1rem' }}>
                About EcoBlue Environmental Services Ltd.
              </div>
              <h2 className="section-title">
                Reliable Environmental Leadership in Rivers State
              </h2>
              <p style={{ fontSize: '1.15rem', color: 'var(--color-text-main)', fontWeight: 500, marginBottom: '1.25rem', lineHeight: 1.7 }}>
                EcoBlue Environmental Services Ltd. is a Nigerian environmental solutions company established to provide professional, reliable, and sustainable waste management services.
              </p>
              <p style={{ marginBottom: '1.5rem', color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: 1.65 }}>
                Our strategic focus is dedicated to creating cleaner communities, healthier environments, and sustainable economic opportunities through responsible waste collection, recycling, and environmental management across Port Harcourt and the wider Rivers State industrial corridors.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--color-green-subtle)', color: 'var(--color-primary-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span style={{ fontWeight: 600, color: 'var(--color-primary-navy)' }}>Cleaner Communities</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--color-green-subtle)', color: 'var(--color-primary-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span style={{ fontWeight: 600, color: 'var(--color-primary-navy)' }}>Healthier Environments</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--color-green-subtle)', color: 'var(--color-primary-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span style={{ fontWeight: 600, color: 'var(--color-primary-navy)' }}>Economic Opportunities</span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--color-green-subtle)', color: 'var(--color-primary-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span style={{ fontWeight: 600, color: 'var(--color-primary-navy)' }}>Responsible Evacuation</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link href="/about" className="btn btn-navy">
                  Read Company Profile
                </Link>
                <Link href="/partnerships" className="btn btn-outline">
                  Corporate Partnerships
                </Link>
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-xl)', border: '4px solid #ffffff' }}>
                <img
                  src="/images/community-hero.jpg"
                  alt="Sustainable environmental management and recycling operations"
                  style={{ width: '100%', height: '440px', objectFit: 'cover' }}
                />
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: '-1.5rem',
                  left: '2rem',
                  background: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem 1.75rem',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--color-border-subtle)',
                  maxWidth: '280px'
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-primary-green)', marginBottom: '0.25rem' }}>
                  Client Focus
                </div>
                <div style={{ fontWeight: 700, color: 'var(--color-primary-navy)', fontSize: '1.05rem', lineHeight: 1.3 }}>
                  Residential • Commercial • Industrial • Government
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Key Services Preview (4 Cards) - Original Placement */}
      <section className="section-py" style={{ backgroundColor: 'var(--color-bg-body)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Core Capabilities</div>
            <h2 className="section-title">Comprehensive Waste & Environmental Solutions</h2>
            <p className="section-desc">
              Engineered to service residential estates, commercial facilities, industrial hubs, and public sector institutions with maximum environmental accountability.
            </p>
          </div>

          <div className="services-grid">
            {/* Service 1 */}
            <div className="service-card">
              <div className="service-card-img-wrap">
                <img src="/images/fleet-city-trucks.jpg" alt="EcoBlue modern hydraulic compactor truck fleet in Port Harcourt" className="service-card-img" />
                <div className="service-card-icon">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 3h15v13H1z"></path>
                    <path d="M16 8h4l3 3v5h-7V8z"></path>
                    <circle cx="5.5" cy="18.5" r="2.5"></circle>
                    <circle cx="18.5" cy="18.5" r="2.5"></circle>
                  </svg>
                </div>
              </div>
              <div className="service-card-body">
                <h3 className="service-card-title">Waste Collection & Disposal</h3>
                <p className="service-card-desc">
                  Scheduled, hygienic collection and responsible evacuation for residential estates, commercial facilities, institutions, and industrial sites across Port Harcourt using modern compactor vehicles.
                </p>
                <ul className="service-card-features">
                  <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>Residential & Estate Collection</li>
                  <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>Commercial & Institutional Management</li>
                  <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>Industrial Waste Evacuation</li>
                </ul>
                <div className="service-card-footer">
                  <Link href="/services#waste-collection" className="btn btn-sm btn-outline">Learn More</Link>
                  <button className="btn btn-sm btn-primary" onClick={() => openQuoteModal('Waste Collection & Disposal')}>Request</button>
                </div>
              </div>
            </div>

            {/* Service 2 */}
            <div className="service-card">
              <div className="service-card-img-wrap">
                <img src="/images/recycling-facility.jpg" alt="EcoBlue industrial recycling sorting facility and material recovery" className="service-card-img" />
                <div className="service-card-icon">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 4 23 10 17 10"></polyline>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                  </svg>
                </div>
              </div>
              <div className="service-card-body">
                <h3 className="service-card-title">Recycling Services</h3>
                <p className="service-card-desc">
                  Structured material recovery operations that segregate recyclable polymers, fiber, and metals to divert volume from local dumpsites and promote circular economic models.
                </p>
                <ul className="service-card-features">
                  <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>Plastic Recovery & Processing</li>
                  <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>Paper, Cardboard & Metal Segregation</li>
                  <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>Resource Recovery Advisory</li>
                </ul>
                <div className="service-card-footer">
                  <Link href="/services#recycling" className="btn btn-sm btn-outline">Learn More</Link>
                  <button className="btn btn-sm btn-primary" onClick={() => openQuoteModal('Recycling Services')}>Request</button>
                </div>
              </div>
            </div>

            {/* Service 3 */}
            <div className="service-card">
              <div className="service-card-img-wrap">
                <img src="/images/partnerships-handshake.jpg" alt="EcoBlue Environmental Services & Advisory Partnership" className="service-card-img" />
                <div className="service-card-icon">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                  </svg>
                </div>
              </div>
              <div className="service-card-body">
                <h3 className="service-card-title">Environmental Services</h3>
                <p className="service-card-desc">
                  Comprehensive environmental sanitation, community clean-up interventions, and regulatory compliance consulting to ensure clients adhere to state environmental frameworks.
                </p>
                <ul className="service-card-features">
                  <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>Environmental Sanitation Programs</li>
                  <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>Community Clean-up Mobilization</li>
                  <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>Sustainability & Regulatory Advisory</li>
                </ul>
                <div className="service-card-footer">
                  <Link href="/services#environmental" className="btn btn-sm btn-outline">Learn More</Link>
                  <button className="btn btn-sm btn-primary" onClick={() => openQuoteModal('Environmental Services')}>Request</button>
                </div>
              </div>
            </div>

            {/* Service 4 */}
            <div className="service-card">
              <div className="service-card-img-wrap">
                <img src="/images/fleet-crew-operations.jpg" alt="Logistics, fleet and container support" className="service-card-img" />
                <div className="service-card-icon">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="3" width="15" height="13"></rect>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                    <circle cx="5.5" cy="18.5" r="2.5"></circle>
                    <circle cx="18.5" cy="18.5" r="2.5"></circle>
                  </svg>
                </div>
              </div>
              <div className="service-card-body">
                <h3 className="service-card-title">Logistics & Support Services</h3>
                <p className="service-card-desc">
                  Reliable supply of industrial waste skips, standardized bins, dedicated fleet transportation, and on-site waste staging equipment for facilities with heavy generation footprints.
                </p>
                <ul className="service-card-features">
                  <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>Waste Transportation & Fleet Dispatch</li>
                  <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>Heavy-Duty Bins & Skips Supply</li>
                  <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>Environmental Project Logistics</li>
                </ul>
                <div className="service-card-footer">
                  <Link href="/services#logistics" className="btn btn-sm btn-outline">Learn More</Link>
                  <button className="btn btn-sm btn-primary" onClick={() => openQuoteModal('Logistics & Fleet Support')}>Request</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Impact Section: Transforming Waste Into Value - Original Placement */}
      <section className="section-py" style={{ background: '#ffffff' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Transforming Waste Into Value</h2>
            <p className="section-desc">
              Drag the interactive slider below to view how EcoBlue's interventions transform unmanaged, littered spaces into clean, organized, and sustainable community environments in Rivers State.
            </p>
          </div>

          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <BeforeAfterSlider
              beforeImage="/images/street-before.jpg"
              afterImage="/images/street-after.jpg"
              beforeLabel="Before: Unmanaged Waste"
              afterLabel="EcoBlue Impact: Clean & Sustainable"
              aspectRatio="16/9"
            />
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link href="/community-impact" className="btn btn-navy">
              <span>See Our Community Impact</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Why EcoBlue - Original Placement */}
      <section className="section-py" style={{ backgroundColor: 'var(--color-bg-body)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-badge navy">Why Choose EcoBlue</div>
            <h2 className="section-title">Built on Trust, Technology & Stewardship</h2>
            <p className="section-desc">
              Four foundational pillars that make EcoBlue Environmental Services Ltd. the dependable partner for waste evacuation and sustainability in Rivers State.
            </p>
          </div>

          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--color-primary-navy)' }}>Professionalism</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                Integrity, accountability, and transparency in all waste management services, from scheduled compactor arrivals to transparent reporting.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--color-primary-navy)' }}>Sustainability</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                Environmentally responsible waste-management practices that protect Rivers State water bodies, soil health, and our collective climate future.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--color-primary-navy)' }}>Innovation</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                Modern approaches, advanced hydraulic compactor engineering, and GPS-guided fleet tracking that maximize operational efficiency and customer satisfaction.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--color-primary-navy)' }}>Community Impact</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                Supporting local job creation for trained waste handlers and building healthier neighborhoods across Port Harcourt and Rivers State.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Target Clients: Who We Serve - Original Placement */}
      <section className="section-py" style={{ background: '#ffffff' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Who We Serve</h2>
            <p className="section-desc">
              Tailored waste evacuation schedules, recycling protocols, and container placements engineered for specific client categories.
            </p>
          </div>

          <div className="clients-grid">
            <div className="client-card">
              <div className="client-card-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg></div>
              <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Residential Estates</span>
            </div>
            <div className="client-card">
              <div className="client-card-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="9" y1="22" x2="9" y2="22.01"></line><line x1="15" y1="22" x2="15" y2="22.01"></line></svg></div>
              <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Hotels & Hospitality</span>
            </div>
            <div className="client-card">
              <div className="client-card-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg></div>
              <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Schools & Universities</span>
            </div>
            <div className="client-card">
              <div className="client-card-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg></div>
              <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Hospitals & Healthcare</span>
            </div>
            <div className="client-card">
              <div className="client-card-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg></div>
              <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Shopping Complexes</span>
            </div>
            <div className="client-card">
              <div className="client-card-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg></div>
              <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Corporate Organizations</span>
            </div>
            <div className="client-card">
              <div className="client-card-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg></div>
              <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Manufacturing Facilities</span>
            </div>
            <div className="client-card">
              <div className="client-card-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg></div>
              <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Government Agencies</span>
            </div>
            <div className="client-card">
              <div className="client-card-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg></div>
              <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Local Government Authorities</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Full-Width CTA Banner - Original Placement */}
      <section style={{ background: 'linear-gradient(135deg, var(--color-navy-dark) 0%, var(--color-primary-navy) 60%, var(--color-green-dark) 100%)', padding: '5rem 0', color: '#ffffff', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '850px' }}>

          <h2 style={{ fontSize: '2.65rem', color: '#ffffff', marginBottom: '1.25rem', fontWeight: 800 }}>
            Let's Build a Cleaner Rivers State Together.
          </h2>
          <p style={{ fontSize: '1.15rem', color: '#E2E8F0', marginBottom: '2.25rem', lineHeight: 1.6 }}>
            Partner with EcoBlue Environmental Services Ltd. for professional waste management and environmental solutions tailored to your residential estate, corporate premises, or public jurisdiction.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn btn-lg btn-white">
              Contact Us
            </Link>
            <Link href="/partnerships" className="btn btn-lg btn-primary">
              Partner With EcoBlue
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
