'use client';

import React, { useState } from 'react';
import { useToast } from '@/components/Toast';
import { StorageService } from '@/lib/storage';

export default function CareersPage() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: 'Environmental Operations Supervisor',
    experience: '3-5 years',
    qualification: '',
    coverLetter: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone) {
      showToast('Validation Error', 'Please complete your name, email, and phone number.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await StorageService.saveCareer(formData);
      showToast(
        'Application Submitted!',
        `Your candidate profile #${created.id} has been registered with EcoBlue HR.`,
        'success'
      );
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        position: 'Environmental Operations Supervisor',
        experience: '3-5 years',
        qualification: '',
        coverLetter: ''
      });
    } catch {
      showToast('Error', 'Unable to submit application. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <section className="page-header" style={{ backgroundColor: 'var(--color-navy-dark)', color: '#fff', padding: '4rem 0', textAlign: 'center' }}>
        <div className="container">
          <span className="section-badge" style={{ background: 'rgba(46, 154, 60, 0.25)', color: '#6EE7B7', border: '1px solid rgba(46, 154, 60, 0.4)', marginBottom: '1rem', display: 'inline-block' }}>
            Work With Us
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 3.5vw, 3.2rem)', color: '#ffffff', fontWeight: 800, marginBottom: '1rem' }}>
            Join the EcoBlue Operations Team
          </h1>
          <p style={{ maxWidth: '720px', margin: '0 auto', fontSize: '1.1rem', color: '#CBD5E1', lineHeight: 1.6 }}>
            Be part of a disciplined, safety-conscious environmental workforce dedicated to raising the standard of waste management in Port Harcourt.
          </p>
        </div>
      </section>

      {/* Culture & Perks */}
      <section className="section" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
            <div className="card" style={{ padding: '28px', backgroundColor: 'var(--color-bg-body)', borderRadius: '16px', border: '1px solid var(--color-border-subtle)' }}>
              <div style={{ fontSize: '1.8rem', color: 'var(--color-primary-green)', marginBottom: '12px' }}>🛡️</div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-navy)', fontWeight: 700, marginBottom: '8px' }}>HSE-First Culture</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Full personal protective equipment (PPE), rigorous inoculation programs, and comprehensive health & safety protocols on every dispatch.
              </p>
            </div>

            <div className="card" style={{ padding: '28px', backgroundColor: 'var(--color-bg-body)', borderRadius: '16px', border: '1px solid var(--color-border-subtle)' }}>
              <div style={{ fontSize: '1.8rem', color: 'var(--color-primary-green)', marginBottom: '12px' }}>📈</div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-navy)', fontWeight: 700, marginBottom: '8px' }}>Career Progression</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Structured advancement pathways from field operations and driver ranks to route supervisors and fleet logistics managers.
              </p>
            </div>

            <div className="card" style={{ padding: '28px', backgroundColor: 'var(--color-bg-body)', borderRadius: '16px', border: '1px solid var(--color-border-subtle)' }}>
              <div style={{ fontSize: '1.8rem', color: 'var(--color-primary-green)', marginBottom: '12px' }}>💰</div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-navy)', fontWeight: 700, marginBottom: '8px' }}>Competitive Compensation</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Timely, competitive remuneration with hazard allowances, performance incentives, and pension compliance.
              </p>
            </div>
          </div>

          {/* Application Form */}
          <div style={{ maxWidth: '720px', margin: '0 auto', backgroundColor: 'var(--color-bg-surface-alt)', borderRadius: '20px', padding: '36px', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ marginBottom: '24px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.6rem', color: 'var(--color-primary-navy)', fontWeight: 800, marginBottom: '8px' }}>
                Candidate Expression of Interest
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                Submit your profile for current and upcoming operational or technical openings.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '6px' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samuel Belema"
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--color-border-medium)', fontSize: '0.95rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '6px' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@email.com"
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
                    Target Role / Discipline *
                  </label>
                  <select
                    value={formData.position}
                    onChange={e => setFormData({ ...formData, position: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--color-border-medium)', fontSize: '0.95rem', backgroundColor: '#fff' }}
                  >
                    <option value="Environmental Operations Supervisor">Environmental Operations Supervisor</option>
                    <option value="Heavy-Duty Compactor Truck Driver">Heavy-Duty Compactor Truck Driver (Class-E)</option>
                    <option value="Hydraulic Mechanic & Fleet Technician">Hydraulic Mechanic & Fleet Technician</option>
                    <option value="HSE & Compliance Field Officer">HSE & Compliance Field Officer</option>
                    <option value="Recycling Facility Sorting Crew">Recycling Facility Sorting Crew</option>
                    <option value="General Field Operations">General Field Operations</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '6px' }}>
                    Years of Relevant Experience
                  </label>
                  <select
                    value={formData.experience}
                    onChange={e => setFormData({ ...formData, experience: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--color-border-medium)', fontSize: '0.95rem', backgroundColor: '#fff' }}
                  >
                    <option value="Entry Level (0-1 year)">Entry Level (0-1 year)</option>
                    <option value="1-3 years">1-3 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5+ years">5+ years</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '6px' }}>
                    Highest Qualification / Licenses
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. B.Sc, HND, OND, or Class-E License"
                    value={formData.qualification}
                    onChange={e => setFormData({ ...formData, qualification: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--color-border-medium)', fontSize: '0.95rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '6px' }}>
                  Summary of Skills & Operational Experience
                </label>
                <textarea
                  rows={4}
                  placeholder="Detail your operational experience, familiarity with Port Harcourt routes, vehicle handling, or safety credentials..."
                  value={formData.coverLetter}
                  onChange={e => setFormData({ ...formData, coverLetter: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--color-border-medium)', fontSize: '0.95rem', fontFamily: 'inherit' }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
                style={{ padding: '14px', fontSize: '1rem', fontWeight: 700, marginTop: '8px' }}
              >
                {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
