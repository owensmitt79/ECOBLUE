'use client';

import React, { useState } from 'react';
import { useToast } from '@/components/Toast';
import { StorageService } from '@/lib/storage';

export default function ConsultantsPage() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialization: 'Environmental Impact Assessment (EIA)',
    experienceYears: '10+ years',
    certifications: '',
    profileSummary: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone) {
      showToast('Validation Error', 'Please complete your full name, email, and phone number.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await StorageService.saveConsultant(formData);
      showToast(
        'Registration Logged!',
        `Your expert profile #${created.id} has been registered in the EcoBlue Technical Advisory Network.`,
        'success'
      );
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        specialization: 'Environmental Impact Assessment (EIA)',
        experienceYears: '10+ years',
        certifications: '',
        profileSummary: ''
      });
    } catch {
      showToast('Error', 'Failed to register profile. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <section
        className="page-header"
        style={{
          position: 'relative',
          backgroundImage: "linear-gradient(135deg, rgba(6, 44, 67, 0.88) 0%, rgba(11, 66, 97, 0.82) 100%), url('/images/consultants-hero.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
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
            Consultants & Technical Specialists
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
            Collaborate on statutory compliance, EIA studies, industrial waste audits, and specialized sustainability projects across Rivers State.
          </p>
        </div>
      </section>

      {/* Advisory Domains */}
      <section className="section" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
            <div className="card" style={{ padding: '28px', backgroundColor: 'var(--color-bg-body)', borderRadius: '16px', border: '1px solid var(--color-border-subtle)' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-navy)', fontWeight: 700, marginBottom: '8px' }}>EIA & Environmental Auditing</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Baseline ecological surveys, impact assessments, and compliance documentation for FMEnv and Rivers State regulators.
              </p>
            </div>

            <div className="card" style={{ padding: '28px', backgroundColor: 'var(--color-bg-body)', borderRadius: '16px', border: '1px solid var(--color-border-subtle)' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-navy)', fontWeight: 700, marginBottom: '8px' }}>Environmental Chemistry</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Laboratory analysis of effluent discharge, heavy metal soil contamination, and hazardous substance profiling.
              </p>
            </div>

            <div className="card" style={{ padding: '28px', backgroundColor: 'var(--color-bg-body)', borderRadius: '16px', border: '1px solid var(--color-border-subtle)' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-navy)', fontWeight: 700, marginBottom: '8px' }}>Waste-to-Energy & Circularity</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Feasibility engineering for anaerobic digestion, polymer pyrolysis, and municipal landfill gas capture.
              </p>
            </div>
          </div>

          {/* Registration Form */}
          <div style={{ maxWidth: '720px', margin: '0 auto', backgroundColor: 'var(--color-bg-surface-alt)', borderRadius: '20px', padding: '36px', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ marginBottom: '24px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.6rem', color: 'var(--color-primary-navy)', fontWeight: 800, marginBottom: '8px' }}>
                Join the Technical Advisory Network
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                Register your credentials for project-based advisory and statutory consulting mandates.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '6px' }}>
                    Consultant Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. (Mrs.) Ibiene Dagogo"
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--color-border-medium)', fontSize: '0.95rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '6px' }}>
                    Professional Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="consultant@ecoconsult.ng"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--color-border-medium)', fontSize: '0.95rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '6px' }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0803 000 0000"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--color-border-medium)', fontSize: '0.95rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '6px' }}>
                    Primary Domain of Expertise *
                  </label>
                  <select
                    value={formData.specialization}
                    onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--color-border-medium)', fontSize: '0.95rem', backgroundColor: '#fff' }}
                  >
                    <option value="Environmental Impact Assessment (EIA)">Environmental Impact Assessment (EIA) & Auditing</option>
                    <option value="Environmental Chemistry & Laboratory Testing">Environmental Chemistry & Laboratory Testing</option>
                    <option value="Industrial Waste Audits & Hazardous Materials">Industrial Waste Audits & Hazardous Materials</option>
                    <option value="Waste-to-Energy & Organic Composting">Waste-to-Energy & Organic Composting</option>
                    <option value="Statutory FMEnv/RIWAMA Permitting">Statutory FMEnv/RIWAMA Permitting</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '6px' }}>
                    Years of Professional Practice
                  </label>
                  <select
                    value={formData.experienceYears}
                    onChange={e => setFormData({ ...formData, experienceYears: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--color-border-medium)', fontSize: '0.95rem', backgroundColor: '#fff' }}
                  >
                    <option value="3-5 years">3-5 years</option>
                    <option value="5-10 years">5-10 years</option>
                    <option value="10+ years">10+ years</option>
                    <option value="15+ years">15+ years (Senior Principal)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '6px' }}>
                    Certifications & Professional Bodies
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. NES, IEMA, Certified Lead Auditor"
                    value={formData.certifications}
                    onChange={e => setFormData({ ...formData, certifications: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--color-border-medium)', fontSize: '0.95rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '6px' }}>
                  Professional Profile & Key Project Engagements
                </label>
                <textarea
                  rows={4}
                  placeholder="Summarize your past advisory engagements, institutional accreditations, or publications..."
                  value={formData.profileSummary}
                  onChange={e => setFormData({ ...formData, profileSummary: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--color-border-medium)', fontSize: '0.95rem', fontFamily: 'inherit' }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
                style={{ padding: '14px', fontSize: '1rem', fontWeight: 700, marginTop: '8px' }}
              >
                {isSubmitting ? 'Registering Expert...' : 'Submit Consultant Profile'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
