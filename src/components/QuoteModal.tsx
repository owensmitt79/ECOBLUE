'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useModal } from '@/context/ModalContext';
import { useToast } from '@/components/Toast';
import { StorageService } from '@/lib/storage';

export default function QuoteModal() {
  const router = useRouter();
  const { isQuoteModalOpen, prefilledService, closeQuoteModal } = useModal();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    service: 'Waste Collection & Disposal',
    wasteType: 'Municipal Solid Waste',
    location: '',
    timeline: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (prefilledService) {
      setFormData(prev => ({ ...prev, service: prefilledService }));
    }
  }, [prefilledService]);

  if (!isQuoteModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      showToast('Validation Error', 'Please complete your name, phone number, and email.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await StorageService.saveQuote(formData);
      showToast(
        'Quote Request Received!',
        `Your request #${created.id} has been logged. Redirecting to your confirmation dossier...`,
        'success'
      );
      closeQuoteModal();
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        service: 'Waste Collection & Disposal',
        wasteType: 'Municipal Solid Waste',
        location: '',
        timeline: '',
        notes: ''
      });
      router.push(`/request-confirmation?id=${created.id}`);
    } catch {
      showToast('Submission Failed', 'An error occurred while saving your request. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isConsultation = formData.service === 'Environmental Consultancy';

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeQuoteModal();
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(6, 44, 67, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 99990,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        className="modal-card"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-xl, 24px)',
          width: '100%',
          maxWidth: '620px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 24px 60px rgba(6, 44, 67, 0.35)',
          position: 'relative',
          padding: '32px'
        }}
      >
        <button
          onClick={closeQuoteModal}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#F0F5F8',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '20px',
            color: 'var(--color-primary-navy)',
            fontWeight: 700
          }}
          aria-label="Close modal"
        >
          &times;
        </button>

        <div style={{ marginBottom: '24px' }}>
          <div
            style={{
              display: 'inline-block',
              backgroundColor: isConsultation ? 'rgba(46, 154, 60, 0.15)' : 'var(--color-green-subtle)',
              color: 'var(--color-primary-green)',
              padding: '4px 12px',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '8px'
            }}
          >
            {isConsultation ? 'Advisory & Statutory Consultation' : 'Direct Operational Inquiry'}
          </div>
          <h3 style={{ margin: '0 0 6px 0', fontSize: '1.6rem', color: 'var(--color-primary-navy)', fontWeight: 800 }}>
            {isConsultation ? 'Request an Environmental Consultation' : 'Request a Service Proposal'}
          </h3>
          <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--color-text-muted)' }}>
            {isConsultation
              ? 'Schedule a technical consultation or compliance review with our environmental specialists in Port Harcourt.'
              : 'Submit your waste evacuation or recycling specifications. Headquartered in Port Harcourt, Rivers State.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0B4261', marginBottom: '6px' }}>
                Full Name <span style={{ color: '#2E9A3C' }}>*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Engr. Kelechi Amadi"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #CBD8E1', backgroundColor: '#ffffff', fontSize: '0.95rem', color: '#0B2535', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => { e.currentTarget.style.borderColor = '#2E9A3C'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(46, 154, 60, 0.15)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = '#CBD8E1'; e.currentTarget.style.boxShadow = 'none'; }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0B4261', marginBottom: '6px' }}>
                Company / Organization
              </label>
              <input
                type="text"
                placeholder="e.g. Trans-Amadi Logistics Ltd."
                value={formData.company}
                onChange={e => setFormData({ ...formData, company: e.target.value })}
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #CBD8E1', backgroundColor: '#ffffff', fontSize: '0.95rem', color: '#0B2535', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => { e.currentTarget.style.borderColor = '#2E9A3C'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(46, 154, 60, 0.15)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = '#CBD8E1'; e.currentTarget.style.boxShadow = 'none'; }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0B4261', marginBottom: '6px' }}>
                Email Address <span style={{ color: '#2E9A3C' }}>*</span>
              </label>
              <input
                type="email"
                required
                placeholder="contact@company.ng"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #CBD8E1', backgroundColor: '#ffffff', fontSize: '0.95rem', color: '#0B2535', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => { e.currentTarget.style.borderColor = '#2E9A3C'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(46, 154, 60, 0.15)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = '#CBD8E1'; e.currentTarget.style.boxShadow = 'none'; }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0B4261', marginBottom: '6px' }}>
                Phone Number (WhatsApp Direct) <span style={{ color: '#2E9A3C' }}>*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="0803 000 0000"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #CBD8E1', backgroundColor: '#ffffff', fontSize: '0.95rem', color: '#0B2535', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => { e.currentTarget.style.borderColor = '#2E9A3C'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(46, 154, 60, 0.15)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = '#CBD8E1'; e.currentTarget.style.boxShadow = 'none'; }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>
                Required Service <span style={{ color: '#059669' }}>*</span>
              </label>
              <select
                value={formData.service}
                onChange={e => setFormData({ ...formData, service: e.target.value })}
                style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: '0.92rem', outline: 'none', color: '#0f172a', cursor: 'pointer' }}
              >
                <option value="Waste Collection & Disposal">Waste Collection & Compactor Disposal</option>
                <option value="Recycling Services">Material Recovery & Recycling Off-Take</option>
                <option value="Environmental Services">Site Decontamination & Facility Sanitation</option>
                <option value="Logistics & Fleet Support">Heavy-Duty Compactor & Skip Logistics</option>
                <option value="Environmental Consultancy">EIA & Statutory Compliance Advisory</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>
                Operational Location (Rivers State)
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{ position: 'absolute', left: '12px', color: '#64748b', display: 'flex' }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="e.g. Peter Odili Rd, Trans-Amadi, GRA, Onne"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  style={{ width: '100%', padding: '11px 14px 11px 38px', borderRadius: '10px', border: '1.5px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: '0.92rem', outline: 'none', color: '#0f172a' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#059669'; e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(5, 150, 105, 0.15)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </div>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>
              Specific Waste Streams or Project Scope
            </label>
            <textarea
              rows={3}
              placeholder="Detail your operational frequency, waste volumes, bin requirements, or compliance priorities..."
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: '0.92rem', fontFamily: 'inherit', outline: 'none', color: '#0f172a', boxSizing: 'border-box' }}
              onFocus={e => { e.currentTarget.style.borderColor = '#059669'; e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(5, 150, 105, 0.15)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ flex: 1, padding: '14px', fontSize: '1rem', fontWeight: 700 }}
            >
              {isSubmitting
                ? 'Submitting...'
                : (isConsultation ? 'Submit Consultation Request' : 'Submit Service Request')}
            </button>
            <button
              type="button"
              onClick={closeQuoteModal}
              className="btn btn-secondary"
              style={{ padding: '14px 20px', fontSize: '0.95rem' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
