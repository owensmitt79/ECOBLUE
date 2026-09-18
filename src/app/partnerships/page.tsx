'use client';

import React, { useState } from 'react';
import { useToast } from '@/components/Toast';
import { StorageService } from '@/lib/storage';

export default function PartnershipsPage() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    organization: '',
    contactPerson: '',
    email: '',
    phone: '',
    track: 'Recycling Companies & Off-Takers',
    scopeSummary: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.organization || !formData.contactPerson || !formData.email || !formData.phone) {
      showToast('Missing Fields', 'Please complete all required partnership contact fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await StorageService.savePartnership(formData);
      showToast(
        'Proposal Submitted!',
        `Your partnership inquiry #${created.id} has been logged. Our corporate development team will reach out shortly.`,
        'success'
      );
      setFormData({
        organization: '',
        contactPerson: '',
        email: '',
        phone: '',
        track: 'Recycling Companies & Off-Takers',
        scopeSummary: ''
      });
    } catch {
      showToast('Error', 'Unable to submit proposal. Please try again.', 'error');
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
            Strategic Alliances
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 3.5vw, 3.2rem)', color: '#ffffff', fontWeight: 800, marginBottom: '1rem' }}>
            Partnerships & Collaboration
          </h1>
          <p style={{ maxWidth: '720px', margin: '0 auto', fontSize: '1.1rem', color: '#CBD5E1', lineHeight: 1.6 }}>
            Collaborating with industrial off-takers, residential estate boards, regulatory authorities, and community organizations across Rivers State.
          </p>
        </div>
      </section>

      {/* 6 Sector Tracks */}
      <section className="section" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div className="text-center" style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem auto' }}>
            <h2 style={{ fontSize: '2.2rem', color: 'var(--color-primary-navy)', fontWeight: 800, marginBottom: '12px' }}>
              Strategic Partnership Tracks
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>
              Explore how we co-create value through environmental sustainability and logistics efficiency.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
            <div className="card" style={{ backgroundColor: 'var(--color-bg-body)', padding: '28px', borderRadius: '16px', border: '1px solid var(--color-border-subtle)' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-navy)', fontWeight: 700, marginBottom: '8px' }}>Recycling Off-Takers</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Long-term material off-take contracts for sorted PET bottles, crushed flakes, and baled corrugated cardboard.
              </p>
            </div>

            <div className="card" style={{ backgroundColor: 'var(--color-bg-body)', padding: '28px', borderRadius: '16px', border: '1px solid var(--color-border-subtle)' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-navy)', fontWeight: 700, marginBottom: '8px' }}>Residential Estates</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Dedicated compactor service frameworks for Resident Development Associations (RDAs) seeking scheduled clean streets.
              </p>
            </div>

            <div className="card" style={{ backgroundColor: 'var(--color-bg-body)', padding: '28px', borderRadius: '16px', border: '1px solid var(--color-border-subtle)' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-navy)', fontWeight: 700, marginBottom: '8px' }}>Corporate & Industrial Parks</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Integrated waste management for manufacturing plants, oilfield logistics bases, and multi-tenant commercial centers.
              </p>
            </div>

            <div className="card" style={{ backgroundColor: 'var(--color-bg-body)', padding: '28px', borderRadius: '16px', border: '1px solid var(--color-border-subtle)' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-navy)', fontWeight: 700, marginBottom: '8px' }}>Municipal & Public Agencies</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Public-private collaboration supporting state sanitation campaigns and urban beautification master plans.
              </p>
            </div>

            <div className="card" style={{ backgroundColor: 'var(--color-bg-body)', padding: '28px', borderRadius: '16px', border: '1px solid var(--color-border-subtle)' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-navy)', fontWeight: 700, marginBottom: '8px' }}>Community & Non-Profits</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Grassroots alliances tackling marine plastic pollution, drainage blockages, and community hygiene education.
              </p>
            </div>

            <div className="card" style={{ backgroundColor: 'var(--color-bg-body)', padding: '28px', borderRadius: '16px', border: '1px solid var(--color-border-subtle)' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-navy)', fontWeight: 700, marginBottom: '8px' }}>Academic & Research Hubs</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Collaborative applied research with tertiary institutions on waste-to-wealth conversion and urban circularity.
              </p>
            </div>
          </div>

          {/* Proposal Submission Form */}
          <div style={{ maxWidth: '720px', margin: '0 auto', backgroundColor: 'var(--color-bg-surface-alt)', borderRadius: '20px', padding: '36px', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ marginBottom: '24px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.6rem', color: 'var(--color-primary-navy)', fontWeight: 800, marginBottom: '8px' }}>
                Submit a Partnership Proposal
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                Fill out your institutional details. Our partnership board reviews submissions weekly.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '6px' }}>
                    Organization / Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Niger Delta Recycling Consortium"
                    value={formData.organization}
                    onChange={e => setFormData({ ...formData, organization: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--color-border-medium)', fontSize: '0.95rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '6px' }}>
                    Contact Person & Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tamuno Briggs, Operations Lead"
                    value={formData.contactPerson}
                    onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--color-border-medium)', fontSize: '0.95rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '6px' }}>
                    Corporate Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="partner@organization.org"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--color-border-medium)', fontSize: '0.95rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '6px' }}>
                    Direct Telephone *
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
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '6px' }}>
                  Partnership Track *
                </label>
                <select
                  value={formData.track}
                  onChange={e => setFormData({ ...formData, track: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--color-border-medium)', fontSize: '0.95rem', backgroundColor: '#fff' }}
                >
                  <option value="Recycling Companies & Off-Takers">Recycling Companies & Off-Takers</option>
                  <option value="Residential Estates (RDAs)">Residential Estates (RDAs)</option>
                  <option value="Corporate & Industrial Facilities">Corporate & Industrial Facilities</option>
                  <option value="Municipal & Public Agencies">Municipal & Public Agencies</option>
                  <option value="Community & Environmental NGOs">Community & Environmental NGOs</option>
                  <option value="Academic & Research Institutions">Academic & Research Institutions</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '6px' }}>
                  Collaboration Scope & Strategic Objectives
                </label>
                <textarea
                  rows={4}
                  placeholder="Outline the nature of the partnership, expected material volumes, locations, or joint initiatives..."
                  value={formData.scopeSummary}
                  onChange={e => setFormData({ ...formData, scopeSummary: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--color-border-medium)', fontSize: '0.95rem', fontFamily: 'inherit' }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
                style={{ padding: '14px', fontSize: '1rem', fontWeight: 700, marginTop: '8px' }}
              >
                {isSubmitting ? 'Transmitting Proposal...' : 'Submit Partnership Proposal'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
