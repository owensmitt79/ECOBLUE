'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useModal } from '@/context/ModalContext';

export default function Navbar() {
  const pathname = usePathname();
  const { openQuoteModal } = useModal();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(prev => (prev === name ? null : name));
  };

  return (
    <>
      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container header-inner">
          <Link href="/" className="brand-logo" aria-label="EcoBlue Home">
            <img
              src="/images/logo.png"
              alt="EcoBlue Environmental Services Ltd."
              className="brand-logo-img"
            />
            <div className="brand-name-group">
              <span className="brand-name">Eco<span>Blue</span></span>
              <span className="brand-subline">Environmental Services Ltd.</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="nav-menu" aria-label="Main Navigation">
            <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>
              Home
            </Link>

            {/* About Dropdown */}
            <div className={`nav-item-dropdown ${activeDropdown === 'about' ? 'open' : ''}`}>
              <button
                className={`nav-link dropdown-toggle ${pathname.startsWith('/about') || pathname === '/chairmans-message' ? 'active' : ''}`}
                onClick={() => toggleDropdown('about')}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                About Us
                <svg className="dropdown-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              <div className="dropdown-menu">
                <Link href="/about" className="dropdown-item">
                  <div className="dropdown-item-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="3" y1="9" x2="21" y2="9"></line>
                      <line x1="9" y1="21" x2="9" y2="9"></line>
                    </svg>
                  </div>
                  <div>
                    <div className="dropdown-item-title">Our Company</div>
                    <div className="dropdown-item-desc">Corporate profile, story & values</div>
                  </div>
                </Link>
                <Link href="/chairmans-message" className="dropdown-item">
                  <div className="dropdown-item-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <div>
                    <div className="dropdown-item-title">Chairman's Message</div>
                    <div className="dropdown-item-desc">Leadership vision & strategic mandate</div>
                  </div>
                </Link>
                <Link href="/about#report" className="dropdown-item">
                  <div className="dropdown-item-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                  </div>
                  <div>
                    <div className="dropdown-item-title">Sustainability & Standards</div>
                    <div className="dropdown-item-desc">ESG commitment & operations</div>
                  </div>
                </Link>
              </div>
            </div>

            <Link href="/services" className={`nav-link ${pathname === '/services' ? 'active' : ''}`}>
              Services
            </Link>

            <Link href="/community-impact" className={`nav-link ${pathname === '/community-impact' ? 'active' : ''}`}>
              Impact
            </Link>

            <Link href="/partnerships" className={`nav-link ${pathname === '/partnerships' ? 'active' : ''}`}>
              Partnerships
            </Link>

            {/* Join Us Dropdown */}
            <div className={`nav-item-dropdown ${activeDropdown === 'join' ? 'open' : ''}`}>
              <button
                className={`nav-link dropdown-toggle ${pathname === '/careers' || pathname === '/consultants' ? 'active' : ''}`}
                onClick={() => toggleDropdown('join')}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Join Us
                <svg className="dropdown-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              <div className="dropdown-menu">
                <Link href="/careers" className="dropdown-item">
                  <div className="dropdown-item-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                  </div>
                  <div>
                    <div className="dropdown-item-title">Careers</div>
                    <div className="dropdown-item-desc">Work with our operations team</div>
                  </div>
                </Link>
                <Link href="/consultants" className="dropdown-item">
                  <div className="dropdown-item-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <div>
                    <div className="dropdown-item-title">Consultants</div>
                    <div className="dropdown-item-desc">Technical advisory roster</div>
                  </div>
                </Link>
                <Link href="/careers/driver-application" className="dropdown-item">
                  <div className="dropdown-item-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="3" width="15" height="13" />
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                      <circle cx="5.5" cy="18.5" r="2.5" />
                      <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                  </div>
                  <div>
                    <div className="dropdown-item-title">Driver Application</div>
                    <div className="dropdown-item-desc">Compactor truck & haulage recruitment</div>
                  </div>
                </Link>
              </div>
            </div>

            <Link href="/contact" className={`nav-link ${pathname === '/contact' ? 'active' : ''}`}>
              Contact
            </Link>
          </nav>

          {/* CTA Button & Hamburger */}
          <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link
              href="/request"
              className="btn btn-sm btn-primary header-cta-desktop"
              style={{
                borderRadius: '999px',
                padding: '0.5rem 1.25rem',
                fontWeight: 700,
                fontSize: '0.875rem'
              }}
            >
              Request Service
            </Link>

            <button
              className="mobile-toggle"
              aria-label="Open Navigation Menu"
              onClick={() => setMobileMenuOpen(true)}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`drawer-backdrop ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
        style={{
          display: mobileMenuOpen ? 'block' : 'none',
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(6, 44, 67, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 99980
        }}
      />
      <aside
        className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '320px',
          maxWidth: '85vw',
          backgroundColor: '#FFFFFF',
          boxShadow: '-8px 0 32px rgba(6, 44, 67, 0.25)',
          zIndex: 99990,
          transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div className="brand-logo">
            <img src="/images/logo.png" alt="EcoBlue Logo" style={{ height: '48px', width: 'auto' }} />
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            style={{
              background: '#F0F5F8',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--color-primary-navy)'
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, overflowY: 'auto' }}>
          <Link href="/" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>
          <Link href="/about" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
            About Us
          </Link>
          <Link href="/chairmans-message" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
            Chairman's Message
          </Link>
          <Link href="/services" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
            Services
          </Link>
          <Link href="/community-impact" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
            Community Impact
          </Link>
          <Link href="/partnerships" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
            Partnerships
          </Link>
          <Link href="/careers" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
            Careers
          </Link>
          <Link href="/careers/driver-application" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
            Driver Application
          </Link>
          <Link href="/consultants" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
            Consultants
          </Link>
          <Link href="/contact" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
            Contact Us
          </Link>
        </nav>

        <div style={{ paddingTop: '20px', borderTop: '1px solid var(--color-border-subtle)' }}>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              openQuoteModal();
            }}
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '0.95rem' }}
          >
            Request a Quote
          </button>
        </div>
      </aside>
    </>
  );
}
