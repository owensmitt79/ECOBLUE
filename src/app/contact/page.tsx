'use client';

import React, { useState } from 'react';
import { useToast } from '@/components/Toast';
import { StorageService } from '@/lib/storage';

export default function ContactPage() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone || !formData.message) {
      showToast('Validation Error', 'Please complete all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = StorageService.saveInquiry(formData);
      showToast(
        'Inquiry Sent!',
        `Your message #${created.id} has been delivered. An EcoBlue representative will respond promptly.`,
        'success'
      );
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: ''
      });
    } catch {
      showToast('Error', 'Unable to transmit message. Please try again.', 'error');
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
            Get in Touch
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 3.5vw, 3.2rem)', color: '#ffffff', fontWeight: 800, marginBottom: '1rem' }}>
            Contact EcoBlue Environmental Services Ltd.
          </h1>
          <p style={{ maxWidth: '720px', margin: '0 auto', fontSize: '1.1rem', color: '#CBD5E1', lineHeight: 1.6 }}>
            Headquartered in Port Harcourt. Reach our customer support and dispatch operations team directly.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="section" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
            {/* Left: Contact Info */}
            <div>
              <h2 style={{ fontSize: '2rem', color: 'var(--color-primary-navy)', fontWeight: 800, marginBottom: '16px' }}>
                Operational Headquarters
              </h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: 1.65, marginBottom: '32px' }}>
                Whether you require scheduled compactor dispatch for your residential estate, commercial skip rentals, or industrial material recovery, we are available to assist.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--color-navy-subtle)', color: 'var(--color-primary-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--color-primary-navy)', fontSize: '1.05rem' }}>Head Office Location</div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>Port Harcourt, Rivers State, Nigeria</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--color-green-subtle)', color: 'var(--color-primary-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--color-primary-navy)', fontSize: '1.05rem' }}>Customer & Dispatch Line</div>
                    <a href="tel:08061193218" style={{ color: 'var(--color-primary-green)', fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none' }}>08061193218</a>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--color-navy-subtle)', color: 'var(--color-primary-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--color-primary-navy)', fontSize: '1.05rem' }}>Official Corporate Email</div>
                    <a href="mailto:info@ecoblueenvironmental.com" style={{ color: 'var(--color-primary-navy)', fontSize: '0.95rem', textDecoration: 'none' }}>info@ecoblueenvironmental.com</a>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '36px', padding: '24px', backgroundColor: 'var(--color-bg-body)', borderRadius: '16px', border: '1px solid var(--color-border-subtle)' }}>
                <div style={{ fontWeight: 700, color: 'var(--color-primary-navy)', marginBottom: '8px' }}>Active Coverage Corridors:</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                  Trans-Amadi Industrial Layout &bull; Peter Odili Road &bull; GRA Phases 1, 2, 3 &bull; Aba Road Industrial Corridor &bull; Old GRA &bull; Woji &bull; Eleme Industrial Corridor &bull; Onne Free Zone.
                </div>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div style={{ backgroundColor: 'var(--color-bg-surface-alt)', borderRadius: '20px', padding: '36px', boxShadow: 'var(--shadow-md)' }}>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary-navy)', fontWeight: 800, marginBottom: '8px' }}>
                Send an Direct Inquiry
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', marginBottom: '24px' }}>
                Submit your inquiry and our desk officer will direct your request to the appropriate division.
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '6px' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Florence Jumbo"
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--color-border-medium)', fontSize: '0.95rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
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
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '6px' }}>
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Skip Container Rental Inquiry"
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--color-border-medium)', fontSize: '0.95rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '6px' }}>
                    Message Content *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your inquiry, requested timeline, or operational requirements..."
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--color-border-medium)', fontSize: '0.95rem', fontFamily: 'inherit' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{ padding: '14px', fontSize: '1rem', fontWeight: 700, marginTop: '8px' }}
                >
                  {isSubmitting ? 'Transmitting...' : 'Send Inquiry'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
