'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { StorageService } from '@/lib/storage';
import { useToast } from '@/components/Toast';

const SERVICES = [
  {
    id: 'Waste Collection & Disposal',
    title: 'Waste Collection & Disposal',
    desc: 'Municipal compactor evacuation, curbside collection & scheduled commercial removal.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
      </svg>
    )
  },
  {
    id: 'Recycling Services',
    title: 'Recycling Services',
    desc: 'Industrial material recovery, baling, polymer separation & circular waste diversion.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
      </svg>
    )
  },
  {
    id: 'Environmental Services',
    title: 'Environmental Services',
    desc: 'Sanitation assessments, compliance auditing, drainage restoration & decontamination.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        <path d="M12 22.5V14" />
        <path d="M9 17l3-3 3 3" />
      </svg>
    )
  },
  {
    id: 'Logistics & Fleet Support',
    title: 'Logistics & Fleet Support',
    desc: 'Heavy roll-on/roll-off skips, staging containers, dedicated compactor dispatch & haulage.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    )
  }
];

function RequestFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialService = searchParams.get('service');
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    service: 'Waste Collection & Disposal',
    wasteType: 'Municipal Solid Waste',
    location: '',
    timeline: 'Weekly Routine Schedule',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialService) {
      const match = SERVICES.find(s => s.id.toLowerCase() === initialService.toLowerCase());
      if (match) {
        setFormData(prev => ({ ...prev, service: match.id }));
      }
    }
  }, [initialService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim()) {
      showToast('Incomplete Fields', 'Please enter your name, telephone, and email address.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await StorageService.saveQuote(formData);
      showToast('Booking Logged!', `Request #${created.id} received. Redirecting to confirmation...`, 'success');
      router.push(`/request-confirmation?id=${created.id}`);
    } catch {
      showToast('Submission Failed', 'An error occurred while saving your request.', 'error');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="request-page-wrapper">
      <style>{`
        .request-page-wrapper {
          max-width: 960px;
          margin: 0 auto;
          padding: 3rem 1.25rem 5rem;
          font-family: var(--font-body, 'Inter', -apple-system, sans-serif);
        }
        .form-header-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 1.15rem;
          border-radius: 999px;
          background-color: rgba(46, 154, 60, 0.12);
          color: var(--color-primary-green, #2E9A3C);
          font-weight: 700;
          font-size: 0.82rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 0.75rem;
        }
        .form-main-card {
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid var(--color-border-subtle, #E2EBF0);
          box-shadow: 0 16px 45px rgba(6, 44, 67, 0.08);
          padding: clamp(1.5rem, 3.5vw, 2.75rem);
        }
        .section-header {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          margin-bottom: 1.2rem;
        }
        .section-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: var(--color-primary-navy, #0B4261);
          color: #ffffff;
          font-weight: 700;
          font-size: 0.85rem;
          flex-shrink: 0;
        }
        .section-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--color-primary-navy, #0B4261);
          margin: 0;
        }

        /* Division Selection Boxes */
        .service-selection-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
          gap: 1rem;
          margin-bottom: 2.25rem;
        }
        .service-select-box {
          border: 1.5px solid var(--color-border-subtle, #E2EBF0);
          background: #F8FAFC;
          border-radius: 12px;
          padding: 1.2rem;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }
        .service-select-box:hover {
          border-color: var(--color-border-medium, #CBD8E1);
          background: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(6, 44, 67, 0.06);
        }
        .service-select-box.active {
          border-color: var(--color-primary-green, #2E9A3C);
          background: rgba(46, 154, 60, 0.05);
          box-shadow: 0 6px 20px rgba(46, 154, 60, 0.12);
        }
        .service-icon-wrap {
          color: var(--color-primary-navy, #0B4261);
          margin-bottom: 0.6rem;
        }
        .service-select-box.active .service-icon-wrap {
          color: var(--color-primary-green, #2E9A3C);
        }

        /* The Filling Box (Exactly like the provided image) */
        .form-grid-fields {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
          gap: 1.25rem;
        }
        .form-group-item {
          display: flex;
          flex-direction: column;
        }
        .form-box-label {
          display: block;
          font-family: var(--font-heading, 'Plus Jakarta Sans', sans-serif);
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-primary-navy, #0B4261);
          margin-bottom: 0.45rem;
        }

        /* Uniform filling box styles */
        .filling-box {
          width: 100%;
          padding: 0.75rem 1rem;
          font-family: var(--font-body, 'Inter', sans-serif);
          font-size: 0.95rem;
          color: var(--color-text-main, #0B2535);
          background-color: #ffffff;
          border: 1px solid var(--color-border-medium, #CBD8E1);
          border-radius: 10px;
          outline: none;
          transition: all 0.2s ease;
          box-sizing: border-box;
          line-height: 1.5;
        }
        .filling-box::placeholder {
          color: #7B93A4;
          opacity: 0.85;
        }
        .filling-box:hover {
          border-color: #94A3B8;
        }
        .filling-box:focus {
          border-color: var(--color-primary-green, #2E9A3C);
          box-shadow: 0 0 0 3px rgba(46, 154, 60, 0.15);
          background-color: #ffffff;
        }

        /* Select filling box */
        select.filling-box {
          cursor: pointer;
          background-color: #ffffff;
        }

        /* Textarea filling box */
        textarea.filling-box {
          resize: vertical;
          min-height: 105px;
        }

        .submit-btn-wrap {
          margin-top: 2rem;
          padding-top: 1.75rem;
          border-top: 1px solid var(--color-border-subtle, #E2EBF0);
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 1rem;
        }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div className="form-header-badge">
          Operations & Dispatch Booking
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, color: 'var(--color-primary-navy, #0B4261)', margin: '0 0 0.75rem 0' }}>
          Schedule an Environmental Service
        </h1>
        <p style={{ color: 'var(--color-text-muted, #335368)', fontSize: '1.05rem', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6 }}>
          Book certified municipal evacuation, industrial waste removal, or recycling logistics across Port Harcourt and Rivers State.
        </p>
      </div>

      {/* Main Card */}
      <div className="form-main-card">
        <form onSubmit={handleSubmit}>
          
          {/* Step 1: Select Division */}
          <div style={{ marginBottom: '2.25rem' }}>
            <div className="section-header">
              <span className="section-badge">1</span>
              <h2 className="section-title">Select Operational Division</h2>
            </div>
            <div className="service-selection-grid">
              {SERVICES.map(s => {
                const isSelected = formData.service === s.id;
                return (
                  <div
                    key={s.id}
                    className={`service-select-box ${isSelected ? 'active' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, service: s.id }))}
                  >
                    <div className="service-icon-wrap">
                      {s.icon}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-primary-navy, #0B4261)', marginBottom: '0.35rem' }}>
                      {s.title}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted, #335368)', lineHeight: 1.45 }}>
                      {s.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Contact Details */}
          <div style={{ marginBottom: '2.25rem' }}>
            <div className="section-header">
              <span className="section-badge">2</span>
              <h2 className="section-title">Client Contact Details</h2>
            </div>

            <div className="form-grid-fields">
              {/* Full Name */}
              <div className="form-group-item">
                <label className="form-box-label" htmlFor="reqName">
                  Full Name / Contact Officer *
                </label>
                <input
                  id="reqName"
                  type="text"
                  required
                  className="filling-box"
                  placeholder="e.g. Engr. Kelechi Amadi"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {/* Company */}
              <div className="form-group-item">
                <label className="form-box-label" htmlFor="reqCompany">
                  Company / Residential Estate
                </label>
                <input
                  id="reqCompany"
                  type="text"
                  className="filling-box"
                  placeholder="e.g. TotalEnergies Staff Quarters or Individual"
                  value={formData.company}
                  onChange={e => setFormData({ ...formData, company: e.target.value })}
                />
              </div>

              {/* Phone */}
              <div className="form-group-item">
                <label className="form-box-label" htmlFor="reqPhone">
                  Phone Number (WhatsApp Preferred) *
                </label>
                <input
                  id="reqPhone"
                  type="tel"
                  required
                  className="filling-box"
                  placeholder="e.g. 0803 123 4567"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              {/* Email */}
              <div className="form-group-item">
                <label className="form-box-label" htmlFor="reqEmail">
                  Email Address *
                </label>
                <input
                  id="reqEmail"
                  type="email"
                  required
                  className="filling-box"
                  placeholder="e.g. k.amadi@organization.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Step 3: Location & Specifications */}
          <div style={{ marginBottom: '2rem' }}>
            <div className="section-header">
              <span className="section-badge">3</span>
              <h2 className="section-title">Service Location & Specifications</h2>
            </div>

            <div className="form-grid-fields">
              {/* Site Address */}
              <div className="form-group-item" style={{ gridColumn: '1 / -1' }}>
                <label className="form-box-label" htmlFor="reqLocation">
                  Site Address / Area in Port Harcourt *
                </label>
                <input
                  id="reqLocation"
                  type="text"
                  required
                  className="filling-box"
                  placeholder="e.g. Plot 14 Trans-Amadi Industrial Layout, Peter Odili Road, PH"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              {/* Primary Waste Stream */}
              <div className="form-group-item">
                <label className="form-box-label" htmlFor="reqWasteType">
                  Primary Waste Stream
                </label>
                <select
                  id="reqWasteType"
                  className="filling-box"
                  value={formData.wasteType}
                  onChange={e => setFormData({ ...formData, wasteType: e.target.value })}
                >
                  <option value="Municipal Solid Waste">Municipal Solid Waste (Residential / Office)</option>
                  <option value="Industrial Dry Waste">Industrial Dry Waste (Packaging, Wood, Metal)</option>
                  <option value="Commercial Food / Organic">Commercial Food & Organic Waste</option>
                  <option value="Recyclable Polymers & Bales">Recyclable Polymers, PET Bottles & Paper</option>
                  <option value="Construction & Demolition Debris">Construction & Demolition Rubble</option>
                  <option value="Other Non-Hazardous Waste">Other Non-Hazardous Waste Stream</option>
                </select>
              </div>

              {/* Evacuation Frequency */}
              <div className="form-group-item">
                <label className="form-box-label" htmlFor="reqTimeline">
                  Evacuation Frequency / Target Timeline
                </label>
                <select
                  id="reqTimeline"
                  className="filling-box"
                  value={formData.timeline}
                  onChange={e => setFormData({ ...formData, timeline: e.target.value })}
                >
                  <option value="Weekly Routine Schedule">Weekly Routine Schedule (Compactor)</option>
                  <option value="Daily Continuous Evacuation">Daily Continuous Evacuation</option>
                  <option value="Bi-Weekly Evacuation">Bi-Weekly Evacuation</option>
                  <option value="One-Time Emergency Clearance">One-Time Emergency Clearance</option>
                  <option value="Roll-on/Roll-off Skip Placement">Permanent Heavy Skip Placement</option>
                </select>
              </div>
            </div>

            {/* Scope & Instructions */}
            <div className="form-group-item" style={{ marginTop: '1.25rem' }}>
              <label className="form-box-label" htmlFor="reqNotes">
                Operational Scope & Instructions
              </label>
              <textarea
                id="reqNotes"
                rows={3}
                className="filling-box"
                placeholder="Mention gate access protocols, estimated tonnage/bin counts, or specific environmental requirements..."
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="submit-btn-wrap">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{
                padding: '0.85rem 2.25rem',
                fontSize: '1rem',
                fontWeight: 700,
                borderRadius: '999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Submit Request & Generate Ticket</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
        <Link href="/" style={{ color: 'var(--color-primary-navy, #0B4261)', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none' }}>
          &larr; Back to Homepage
        </Link>
      </div>
    </div>
  );
}

export default function RequestPage() {
  return (
    <Suspense
      fallback={
        <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
          <p style={{ color: 'var(--color-text-muted)' }}>Loading booking console...</p>
        </div>
      }
    >
      <RequestFormContent />
    </Suspense>
  );
}
