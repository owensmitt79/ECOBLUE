'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { StorageService } from '@/lib/storage';
import { useToast } from '@/components/Toast';

const CONSULTATION_DOMAINS = [
  {
    id: 'EIA & Statutory Compliance Advisory',
    title: 'EIA & Statutory Compliance',
    subtitle: 'Baseline Ecological Surveys & Regulatory Permits',
    desc: 'Preparation and filing of Environmental Impact Assessments (EIA), Environmental Audits (EA), and statutory filings with FMEnv and Rivers State regulators.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    )
  },
  {
    id: 'Industrial Waste Audit & Minimization',
    title: 'Industrial Waste Auditing',
    subtitle: 'Stream Profiling & Circular Off-Take',
    desc: 'Comprehensive facility waste stream mapping, hazardous classification, scrap segregation protocols, and corporate circular diversion strategy.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
      </svg>
    )
  },
  {
    id: 'Facility Decontamination & HSE Advisory',
    title: 'Facility Sanitation & HSE',
    subtitle: 'Deep Decontamination & Hygiene Plans',
    desc: 'Specialized health, safety, and environmental sanitation protocols for logistics yards, processing plants, hospitals, and corporate premises.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    )
  },
  {
    id: 'Heavy Compactor & Logistics Route Advisory',
    title: 'Fleet Logistics & Evacuation Strategy',
    subtitle: 'Skip Container Placement & Routing',
    desc: 'Site layout assessment for heavy roll-on/roll-off skip placement, dedicated compactor haulage frequency, and zero-spill transfer points.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    )
  }
];

export default function ConsultationPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [selectedDomain, setSelectedDomain] = useState<string>('EIA & Statutory Compliance Advisory');
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    format: 'On-Site Facility Walkthrough (Rivers State)',
    location: '',
    timeline: 'Within 72 Hours (Prompt Advisory)',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim() || !formData.location.trim()) {
      showToast('Validation Error', 'Please complete your name, organization, phone, and operational location.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        company: formData.company || 'Corporate Client',
        email: formData.email,
        phone: formData.phone,
        service: 'Environmental Consultancy',
        wasteType: selectedDomain,
        location: formData.location,
        timeline: formData.timeline,
        notes: `Format: ${formData.format}\n\nAdvisory Domain: ${selectedDomain}\n\nObjectives / Scope:\n${formData.notes}`
      };

      const created = await StorageService.saveQuote(payload);

      showToast(
        'Consultation Queued!',
        `Your consultation request #${created.id} has been registered. Redirecting to your booking dossier...`,
        'success'
      );

      router.push(`/request-confirmation?id=${created.id}`);
    } catch {
      showToast('Submission Failed', 'An error occurred while saving your consultation request. Please try again.', 'error');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="consultation-page">
      {/* Header Banner */}
      <section className="consultation-hero" style={{
        background: 'linear-gradient(135deg, var(--color-navy-dark, #062C43) 0%, var(--color-primary-navy, #0B4261) 100%)',
        color: '#ffffff',
        padding: '4.5rem 1.25rem 4rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.05,
          backgroundImage: 'radial-gradient(circle at 20px 20px, #ffffff 2px, transparent 0)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ maxWidth: '840px', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(46, 154, 60, 0.2)',
            border: '1px solid rgba(46, 154, 60, 0.4)',
            color: '#6EE7B7',
            padding: '6px 16px',
            borderRadius: '999px',
            fontSize: '0.85rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '1.25rem'
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Technical Advisory & Statutory Compliance
          </div>

          <h1 style={{
            fontSize: 'clamp(2.3rem, 4vw, 3.4rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            color: '#ffffff',
            marginBottom: '1.2rem'
          }}>
            Request a Professional <span style={{ color: '#6EE7B7' }}>Environmental Consultation</span>
          </h1>

          <p style={{
            fontSize: '1.15rem',
            lineHeight: 1.7,
            color: '#CBD5E1',
            maxWidth: '720px',
            margin: '0 auto 2rem'
          }}>
            Engage certified environmental practitioners and regulatory specialists for statutory EIA filings, industrial facility audits, and turnkey waste management solutions across Port Harcourt and Rivers State.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            marginTop: '1.5rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            <div>
              <div style={{ color: '#6EE7B7', fontWeight: 800, fontSize: '1.4rem' }}>CAMA 2020</div>
              <div style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Statutory Incorporation</div>
            </div>
            <div>
              <div style={{ color: '#6EE7B7', fontWeight: 800, fontSize: '1.4rem' }}>FMEnv & RSMEnv</div>
              <div style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Regulatory Alignment</div>
            </div>
            <div>
              <div style={{ color: '#6EE7B7', fontWeight: 800, fontSize: '1.4rem' }}>&lt; 24h Response</div>
              <div style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Technical Review Dispatch</div>
            </div>
            <div>
              <div style={{ color: '#6EE7B7', fontWeight: 800, fontSize: '1.4rem' }}>Port Harcourt HQ</div>
              <div style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Rivers State Focus</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Intake Form Container */}
      <section style={{ padding: '3.5rem 1.25rem 5rem', backgroundColor: 'var(--color-bg-body, #F4F8F6)' }}>
        <div className="container" style={{ maxWidth: '920px' }}>

          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            border: '1px solid var(--color-border-subtle, #E2EBF0)',
            boxShadow: '0 20px 50px rgba(11, 66, 97, 0.08)',
            padding: 'clamp(1.75rem, 4vw, 3rem)'
          }}>

            <form onSubmit={handleSubmit}>

              {/* Step 1: Select Consultation Domain */}
              <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary-navy, #0B4261)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}>
                    1
                  </span>
                  <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-navy, #0B4261)' }}>
                    Select Advisory Domain
                  </h2>
                </div>
                <p style={{ margin: '0 0 1.25rem 38px', fontSize: '0.9rem', color: 'var(--color-text-muted, #335368)' }}>
                  Choose the specialized practice area that reflects your facility requirements or statutory mandate.
                </p>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '1rem'
                }}>
                  {CONSULTATION_DOMAINS.map((domain) => {
                    const isSelected = selectedDomain === domain.id;
                    return (
                      <div
                        key={domain.id}
                        onClick={() => setSelectedDomain(domain.id)}
                        style={{
                          borderRadius: '14px',
                          border: isSelected
                            ? '2px solid var(--color-primary-green, #2E9A3C)'
                            : '1.5px solid var(--color-border-subtle, #E2EBF0)',
                          backgroundColor: isSelected ? 'rgba(46, 154, 60, 0.06)' : '#F8FAFC',
                          padding: '1.25rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          boxShadow: isSelected ? '0 8px 24px rgba(46, 154, 60, 0.12)' : 'none',
                          transform: isSelected ? 'translateY(-2px)' : 'none'
                        }}
                      >
                        <div style={{
                          color: isSelected ? 'var(--color-primary-green, #2E9A3C)' : 'var(--color-primary-navy, #0B4261)',
                          marginBottom: '0.65rem'
                        }}>
                          {domain.icon}
                        </div>
                        <div style={{
                          fontWeight: 700,
                          fontSize: '1rem',
                          color: 'var(--color-primary-navy, #0B4261)',
                          marginBottom: '0.25rem'
                        }}>
                          {domain.title}
                        </div>
                        <div style={{
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: 'var(--color-primary-green, #2E9A3C)',
                          marginBottom: '0.5rem'
                        }}>
                          {domain.subtitle}
                        </div>
                        <div style={{
                          fontSize: '0.82rem',
                          color: 'var(--color-text-muted, #335368)',
                          lineHeight: 1.5
                        }}>
                          {domain.desc}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Organization & Contact Information */}
              <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary-navy, #0B4261)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}>
                    2
                  </span>
                  <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-navy, #0B4261)' }}>
                    Corporate & Contact Information
                  </h2>
                </div>
                <p style={{ margin: '0 0 1.25rem 38px', fontSize: '0.9rem', color: 'var(--color-text-muted, #335368)' }}>
                  Provide your organization details so our principal consultant can review your profile prior to initial contact.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary-navy, #0B4261)', marginBottom: '0.4rem' }}>
                      Contact Person / Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Engr. Kelechi Amadi (HSE Manager)"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        border: '1.5px solid var(--color-border-medium, #CBD8E1)',
                        backgroundColor: '#ffffff',
                        fontSize: '0.95rem',
                        color: 'var(--color-text-main, #0B2535)',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary-navy, #0B4261)', marginBottom: '0.4rem' }}>
                      Organization / Facility Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Trans-Amadi Fabrication Ltd. / Greenfield Estate"
                      value={formData.company}
                      onChange={e => setFormData({ ...formData, company: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        border: '1.5px solid var(--color-border-medium, #CBD8E1)',
                        backgroundColor: '#ffffff',
                        fontSize: '0.95rem',
                        color: 'var(--color-text-main, #0B2535)',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary-navy, #0B4261)', marginBottom: '0.4rem' }}>
                      Corporate Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. hse.director@company.ng"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        border: '1.5px solid var(--color-border-medium, #CBD8E1)',
                        backgroundColor: '#ffffff',
                        fontSize: '0.95rem',
                        color: 'var(--color-text-main, #0B2535)',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary-navy, #0B4261)', marginBottom: '0.4rem' }}>
                      Phone Number (WhatsApp Active) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0803 123 4567"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        border: '1.5px solid var(--color-border-medium, #CBD8E1)',
                        backgroundColor: '#ffffff',
                        fontSize: '0.95rem',
                        color: 'var(--color-text-main, #0B2535)',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Consultation Format & Timeline */}
              <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary-navy, #0B4261)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}>
                    3
                  </span>
                  <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-navy, #0B4261)' }}>
                    Consultation Delivery & Site Parameters
                  </h2>
                </div>
                <p style={{ margin: '0 0 1.25rem 38px', fontSize: '0.9rem', color: 'var(--color-text-muted, #335368)' }}>
                  Indicate how and where you prefer the initial advisory engagement to take place.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary-navy, #0B4261)', marginBottom: '0.4rem' }}>
                      Preferred Format *
                    </label>
                    <select
                      value={formData.format}
                      onChange={e => setFormData({ ...formData, format: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        border: '1.5px solid var(--color-border-medium, #CBD8E1)',
                        backgroundColor: '#ffffff',
                        fontSize: '0.95rem',
                        color: 'var(--color-text-main, #0B2535)',
                        outline: 'none',
                        boxSizing: 'border-box',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="On-Site Facility Walkthrough (Rivers State)">On-Site Facility Walkthrough (Rivers State)</option>
                      <option value="In-Person Executive Session (Port Harcourt HQ)">In-Person Executive Session (Port Harcourt HQ)</option>
                      <option value="Secure Virtual Technical Briefing (Zoom / Teams)">Secure Virtual Technical Briefing (Zoom / Teams)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary-navy, #0B4261)', marginBottom: '0.4rem' }}>
                      Target Advisory Schedule *
                    </label>
                    <select
                      value={formData.timeline}
                      onChange={e => setFormData({ ...formData, timeline: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        border: '1.5px solid var(--color-border-medium, #CBD8E1)',
                        backgroundColor: '#ffffff',
                        fontSize: '0.95rem',
                        color: 'var(--color-text-main, #0B2535)',
                        outline: 'none',
                        boxSizing: 'border-box',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="Within 72 Hours (Prompt Advisory)">Within 72 Hours (Prompt Advisory)</option>
                      <option value="Immediate Emergency Compliance Dispatch (&lt; 24h)">Immediate Emergency Compliance Dispatch (&lt; 24h)</option>
                      <option value="Upcoming Project Phase (Within 2-3 Weeks)">Upcoming Project Phase (Within 2-3 Weeks)</option>
                      <option value="Annual Compliance / Audit Planning">Annual Compliance / Audit Planning</option>
                    </select>
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary-navy, #0B4261)', marginBottom: '0.4rem' }}>
                      Facility Site Address / Operational Location in Rivers State *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Plot 22 Trans-Amadi Industrial Layout, Onne Free Zone, or Peter Odili Road, Port Harcourt"
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        border: '1.5px solid var(--color-border-medium, #CBD8E1)',
                        backgroundColor: '#ffffff',
                        fontSize: '0.95rem',
                        color: 'var(--color-text-main, #0B2535)',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Step 4: Scope & Specific Objectives */}
              <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary-navy, #0B4261)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}>
                    4
                  </span>
                  <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-navy, #0B4261)' }}>
                    Advisory Objectives & Scope Brief
                  </h2>
                </div>
                <p style={{ margin: '0 0 1.25rem 38px', fontSize: '0.9rem', color: 'var(--color-text-muted, #335368)' }}>
                  Summarize your primary regulatory questions, facility challenges, estimated waste quantities, or compliance deadlines.
                </p>

                <textarea
                  rows={4}
                  placeholder="Outline your project scope (e.g. upcoming EIA audit, waste characterization requirements, compactor frequency needs, effluent compliance, or Ministry of Environment submission deadlines)..."
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: '10px',
                    border: '1.5px solid var(--color-border-medium, #CBD8E1)',
                    backgroundColor: '#ffffff',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    color: 'var(--color-text-main, #0B2535)',
                    outline: 'none',
                    boxSizing: 'border-box',
                    resize: 'vertical',
                    minHeight: '110px'
                  }}
                />
              </div>

              {/* Form Action Buttons */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                flexWrap: 'wrap',
                paddingTop: '1.5rem',
                borderTop: '1px solid var(--color-border-subtle, #E2EBF0)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted, #335368)', fontSize: '0.88rem' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-green, #2E9A3C)" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Strict confidentiality & non-disclosure guaranteed</span>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <Link href="/services" className="btn btn-secondary" style={{ padding: '0.85rem 1.5rem' }}>
                    View Services
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary"
                    style={{
                      padding: '0.85rem 2rem',
                      fontWeight: 700,
                      fontSize: '1rem',
                      boxShadow: '0 8px 24px rgba(46, 154, 60, 0.3)'
                    }}
                  >
                    {isSubmitting ? 'Transmitting Request...' : 'Schedule Environmental Consultation'}
                  </button>
                </div>
              </div>

            </form>
          </div>

          {/* Value Guarantee / Direct Desk Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginTop: '2.5rem'
          }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '1.75rem',
              border: '1px solid var(--color-border-subtle, #E2EBF0)',
              display: 'flex',
              gap: '1rem'
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: 'rgba(46, 154, 60, 0.12)',
                color: 'var(--color-primary-green, #2E9A3C)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div>
                <h3 style={{ margin: '0 0 0.35rem 0', fontSize: '1.05rem', color: 'var(--color-primary-navy, #0B4261)', fontWeight: 700 }}>
                  Need Immediate Advisory Dispatch?
                </h3>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.88rem', color: 'var(--color-text-muted, #335368)', lineHeight: 1.5 }}>
                  Speak directly with our Port Harcourt operations and technical desk for rapid mobilization.
                </p>
                <a
                  href="https://wa.me/2348061193218?text=Hello%20EcoBlue%2C%20I%20need%20an%20urgent%20environmental%20consultation"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--color-primary-green, #2E9A3C)', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}
                >
                  Chat on WhatsApp &rarr;
                </a>
              </div>
            </div>

            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '1.75rem',
              border: '1px solid var(--color-border-subtle, #E2EBF0)',
              display: 'flex',
              gap: '1rem'
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: 'rgba(11, 66, 97, 0.1)',
                color: 'var(--color-primary-navy, #0B4261)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div>
                <h3 style={{ margin: '0 0 0.35rem 0', fontSize: '1.05rem', color: 'var(--color-primary-navy, #0B4261)', fontWeight: 700 }}>
                  Formal Corporate Inquiries
                </h3>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.88rem', color: 'var(--color-text-muted, #335368)', lineHeight: 1.5 }}>
                  Email documentation, terms of reference, or tender dossiers to our technical board.
                </p>
                <a
                  href="mailto:info@ecoblueenvironmental.com"
                  style={{ color: 'var(--color-primary-navy, #0B4261)', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}
                >
                  info@ecoblueenvironmental.com &rarr;
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
