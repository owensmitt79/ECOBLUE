'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/Toast';

export default function Footer() {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    showToast('Subscribed!', 'Thank you for subscribing to EcoBlue environmental advisories.', 'success');
    setEmail('');
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Col 1: Company Profile */}
          <div className="footer-brand">
            <div className="brand-logo" style={{ marginBottom: '1rem' }}>
              <img src="/images/logo.png" alt="EcoBlue Logo" className="brand-logo-img" style={{ height: '72px', width: 'auto' }} />
              <div className="brand-name-group">
                <span className="brand-name" style={{ color: '#ffffff' }}>Eco<span style={{ color: 'var(--color-green-light)' }}>Blue</span></span>
                <span className="brand-subline" style={{ color: '#94A3B8' }}>Environmental Services Ltd.</span>
              </div>
            </div>
            <p>
              "Professional, Reliable, Sustainable Waste Management Solutions"
            </p>
            <p style={{ fontSize: '0.875rem', color: '#64748B' }}>
              EcoBlue Environmental Services Ltd. is a Nigerian environmental solutions company established under the Companies and Allied Matters Act 2020. Headquartered in Port Harcourt, Rivers State.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="footer-col-title">Quick Links</h4>
            <div className="footer-links">
              <Link href="/" className="footer-link">Home</Link>
              <Link href="/about" className="footer-link">About Us</Link>
              <Link href="/chairmans-message" className="footer-link">Chairman's Message</Link>
              <Link href="/services" className="footer-link">Services</Link>
              <Link href="/consultation" className="footer-link">Request Consultation</Link>
              <Link href="/careers" className="footer-link">Careers</Link>
              <Link href="/consultants" className="footer-link">Consultants</Link>
              <Link href="/partnerships" className="footer-link">Partnerships</Link>
              <Link href="/contact" className="footer-link">Contact</Link>
            </div>
          </div>

          {/* Col 3: Core Services */}
          <div>
            <h4 className="footer-col-title">Services & Operations</h4>
            <div className="footer-links">
              <Link href="/services#waste-collection" className="footer-link">Waste Collection & Evacuation</Link>
              <Link href="/services#recycling" className="footer-link">Recycling & Materials Recovery</Link>
              <Link href="/services#environmental" className="footer-link">Environmental Sanitation</Link>
              <Link href="/consultation" className="footer-link">EIA & Advisory Consultation</Link>
              <Link href="/services#logistics" className="footer-link">Logistics & Skip Containers</Link>
              <Link href="/community-impact" className="footer-link">Community Impact</Link>
              <Link href="/admin" className="footer-link" style={{ color: 'var(--color-green-light)', fontWeight: 600 }}>Staff Admin Portal</Link>
            </div>
          </div>

          {/* Col 4: Contact & Newsletter */}
          <div>
            <h4 className="footer-col-title">Contact & Updates</h4>
            <div className="footer-contact-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>Port Harcourt, Rivers State, Nigeria</span>
            </div>
            <div className="footer-contact-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <a href="mailto:info@ecoblueenvironmental.com">info@ecoblueenvironmental.com</a>
            </div>
            <div className="footer-contact-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <a href="tel:08061193218">08061193218</a>
            </div>

            <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                className="footer-input"
                placeholder="Enter corporate email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                aria-label="Email for updates"
              />
              <button type="submit" className="btn btn-sm btn-primary" aria-label="Subscribe">
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="footer-legal-bar">
          <div className="footer-statement">
            "Together, let's build a cleaner, more sustainable future for Rivers State and Nigeria."
          </div>
          <div style={{ color: '#64748B' }}>
            &copy; 2026 EcoBlue Environmental Services Ltd. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
