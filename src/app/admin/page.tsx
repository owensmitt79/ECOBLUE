'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/components/Toast';
import { StorageService } from '@/lib/storage';
import { QuoteLead, InquiryLead, CareerLead, ConsultantLead, PartnershipLead, DriverApplicationLead, LeadStatus } from '@/lib/types';

type TabId =
  | 'tabOverview'
  | 'tabQuotes'
  | 'tabInquiries'
  | 'tabPartnerships'
  | 'tabCareers'
  | 'tabDrivers'
  | 'tabConsultants'
  | 'tabFleet'
  | 'tabLogs';

// Helper for WhatsApp URLs (supports Nigerian phone formats: 080..., 234..., +234...)
function getWhatsAppUrl(phone?: string, name?: string, refId?: string) {
  if (!phone) return null;
  let clean = phone.replace(/[^0-9]/g, '');
  if (clean.startsWith('0')) {
    clean = '234' + clean.slice(1);
  } else if (clean.length === 10) {
    clean = '234' + clean;
  }
  const msg = encodeURIComponent(
    `Hello ${name || ''}, this is EcoBlue Environmental Services Ltd. regarding your submission (${refId || ''}).`
  );
  return `https://wa.me/${clean}?text=${msg}`;
}

function AdminDashboardContent() {
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as TabId | null;
  const viewParam = searchParams.get('view');

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState('');

  // Mobile Sidebar & Active Tab
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabId>('tabOverview');

  // Repositories
  const [quotes, setQuotes] = useState<QuoteLead[]>([]);
  const [inquiries, setInquiries] = useState<InquiryLead[]>([]);
  const [partnerships, setPartnerships] = useState<PartnershipLead[]>([]);
  const [careers, setCareers] = useState<CareerLead[]>([]);
  const [consultants, setConsultants] = useState<ConsultantLead[]>([]);
  const [driverApplications, setDriverApplications] = useState<DriverApplicationLead[]>([]);

  // Search & Filters
  const [quoteSearch, setQuoteSearch] = useState('');
  const [quoteStatus, setQuoteStatus] = useState('all');

  const [inquirySearch, setInquirySearch] = useState('');
  const [inquiryStatus, setInquiryStatus] = useState('all');

  const [partnerSearch, setPartnerSearch] = useState('');
  const [partnerStatus, setPartnerStatus] = useState('all');

  const [careerSearch, setCareerSearch] = useState('');
  const [careerStatus, setCareerStatus] = useState('all');

  const [consultantSearch, setConsultantSearch] = useState('');
  const [consultantStatus, setConsultantStatus] = useState('all');

  const [driverSearch, setDriverSearch] = useState('');
  const [driverStatus, setDriverStatus] = useState('all');

  // Modals
  const [detailModal, setDetailModal] = useState<{ record: any; type: string } | null>(null);
  const [modalCurrentStatus, setModalCurrentStatus] = useState<LeadStatus>('Pending');
  const [deletePending, setDeletePending] = useState<{ type: string; id: string; name: string } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isSavingStatus, setIsSavingStatus] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const getAvailableStatuses = (type?: string): LeadStatus[] => {
    switch (type) {
      case 'partner':
        return ['Pending', 'Reviewed', 'Empanelled', 'Completed'];
      case 'career':
        return ['Pending', 'Reviewed', 'Shortlisted', 'Interviewed', 'Completed'];
      case 'driver':
        return ['Pending', 'Reviewed', 'Shortlisted', 'Interviewed', 'Hired', 'Completed'];
      case 'consultant':
        return ['Pending', 'Reviewed', 'Empanelled', 'Active Project', 'Completed'];
      case 'quote':
      case 'inquiry':
      default:
        return ['Pending', 'Reviewed', 'Contacted', 'Completed'];
    }
  };

  const loadData = async () => {
    try {
      const [q, inq, p, c, cons, drv] = await Promise.all([
        StorageService.getQuotes(),
        StorageService.getInquiries(),
        StorageService.getPartnerships(),
        StorageService.getCareers(),
        StorageService.getConsultants(),
        StorageService.getDriverApplications(),
      ]);
      setQuotes(q || []);
      setInquiries(inq || []);
      setPartnerships(p || []);
      setCareers(c || []);
      setConsultants(cons || []);
      setDriverApplications(drv || []);
    } catch (err) {
      console.error('Failed to load admin records:', err);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
    showToast('Data Refreshed', 'Synced latest records from database.', 'success');
  };

  useEffect(() => {
    let isMounted = true;
    const verifySession = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        const res = await fetch('/api/admin/auth', { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!isMounted) return;

        if (res.ok) {
          const data = await res.json();
          if (data && data.authenticated) {
            setIsAuthenticated(true);
            setIsCheckingAuth(false);
            loadData();
            return;
          }
        }
        setIsAuthenticated(false);
      } catch (err: any) {
        if (isMounted) {
          console.warn('Session verification fallback to login:', err?.message);
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setIsCheckingAuth(false);
        }
      }
    };
    verifySession();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync modalCurrentStatus whenever detailModal opens
  useEffect(() => {
    if (detailModal && detailModal.record) {
      setModalCurrentStatus(detailModal.record.status || 'Pending');
    }
  }, [detailModal]);

  // Sync tab and view parameters from incoming URL across all 5 lead channels
  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
    if (viewParam && isAuthenticated) {
      const q = quotes.find(item => item.id === viewParam);
      if (q) {
        setActiveTab('tabQuotes');
        setDetailModal({ record: q, type: 'quote' });
        setQuoteSearch(viewParam);
        return;
      }
      const inq = inquiries.find(item => item.id === viewParam);
      if (inq) {
        setActiveTab('tabInquiries');
        setDetailModal({ record: inq, type: 'inquiry' });
        setInquirySearch(viewParam);
        return;
      }
      const p = partnerships.find(item => item.id === viewParam);
      if (p) {
        setActiveTab('tabPartnerships');
        setDetailModal({ record: p, type: 'partner' });
        setPartnerSearch(viewParam);
        return;
      }
      const c = careers.find(item => item.id === viewParam);
      if (c) {
        setActiveTab('tabCareers');
        setDetailModal({ record: c, type: 'career' });
        setCareerSearch(viewParam);
        return;
      }
      const cons = consultants.find(item => item.id === viewParam);
      if (cons) {
        setActiveTab('tabConsultants');
        setDetailModal({ record: cons, type: 'consultant' });
        setConsultantSearch(viewParam);
        return;
      }
      const drv = driverApplications.find(item => item.id === viewParam);
      if (drv) {
        setActiveTab('tabDrivers');
        setDetailModal({ record: drv, type: 'driver' });
        setDriverSearch(viewParam);
        return;
      }
    }
  }, [tabParam, viewParam, quotes, inquiries, partnerships, careers, consultants, driverApplications, isAuthenticated]);

  // Handle ESC key to close modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDetailModal(null);
        setDeletePending(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: adminPass })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setAdminPass('');
        await loadData();
        showToast('Welcome Back', 'Authorized staff session initiated.', 'success');
      } else {
        setLoginError(data.error || 'Authentication failed. Please verify your credentials.');
      }
    } catch {
      setLoginError('Unable to connect to authentication service. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
    } catch {
      // Ignore network error on logout
    }
    setIsAuthenticated(false);
    setAdminPass('');
    showToast('Signed Out', 'Staff session terminated securely.', 'info');
  };

  // Metrics
  const metrics = useMemo(() => {
    return {
      totalQuotes: quotes.length,
      pendingQuotes: quotes.filter(q => q.status === 'Pending').length,
      totalInquiries: inquiries.length,
      totalPartners: partnerships.length,
      totalCareers: careers.length,
      totalConsultants: consultants.length,
      totalDrivers: driverApplications.length,
      pendingDrivers: driverApplications.filter(d => d.status === 'Pending').length,
    };
  }, [quotes, inquiries, partnerships, careers, consultants, driverApplications]);

  // Combined Recent Submissions for Overview Live Stream
  const recentSubmissions = useMemo(() => {
    const list: Array<{
      id: string;
      name: string;
      channel: string;
      type: 'quote' | 'inquiry' | 'partner' | 'career' | 'consultant' | 'driver';
      category: string;
      status: LeadStatus;
      date?: string;
      raw: any;
    }> = [];

    quotes.forEach(q =>
      list.push({
        id: q.id,
        name: q.name,
        channel: 'Quote Request',
        type: 'quote',
        category: q.service,
        status: q.status,
        date: q.createdAt,
        raw: q
      })
    );
    inquiries.forEach(i =>
      list.push({
        id: i.id,
        name: i.fullName,
        channel: 'Contact Inquiry',
        type: 'inquiry',
        category: i.subject || 'General Inquiry',
        status: i.status,
        date: i.createdAt,
        raw: i
      })
    );
    partnerships.forEach(p =>
      list.push({
        id: p.id,
        name: p.organization || p.contactPerson,
        channel: 'Partnership',
        type: 'partner',
        category: p.track,
        status: p.status,
        date: p.createdAt,
        raw: p
      })
    );
    careers.forEach(c =>
      list.push({
        id: c.id,
        name: c.fullName,
        channel: 'Career Applicant',
        type: 'career',
        category: c.position,
        status: c.status,
        date: c.createdAt,
        raw: c
      })
    );
    consultants.forEach(c =>
      list.push({
        id: c.id,
        name: c.fullName,
        channel: 'Consultant',
        type: 'consultant',
        category: c.specialization,
        status: c.status,
        date: c.createdAt,
        raw: c
      })
    );
    driverApplications.forEach(d =>
      list.push({
        id: d.id,
        name: d.fullName,
        channel: 'Driver Application',
        type: 'driver',
        category: d.positionApplied || 'Fleet Driver',
        status: d.status,
        date: d.createdAt,
        raw: d
      })
    );

    return list
      .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
      .slice(0, 10);
  }, [quotes, inquiries, partnerships, careers, consultants, driverApplications]);

  // Filtered Quotes
  const filteredQuotes = useMemo(() => {
    return quotes.filter(item => {
      if (quoteStatus !== 'all' && item.status.toLowerCase() !== quoteStatus.toLowerCase()) return false;
      if (!quoteSearch.trim()) return true;
      const q = quoteSearch.toLowerCase();
      return (
        item.id.toLowerCase().includes(q) ||
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.company && item.company.toLowerCase().includes(q)) ||
        (item.location && item.location.toLowerCase().includes(q)) ||
        (item.service && item.service.toLowerCase().includes(q))
      );
    });
  }, [quotes, quoteStatus, quoteSearch]);

  // Filtered Inquiries
  const filteredInquiries = useMemo(() => {
    return inquiries.filter(item => {
      if (inquiryStatus !== 'all' && item.status.toLowerCase() !== inquiryStatus.toLowerCase()) return false;
      if (!inquirySearch.trim()) return true;
      const q = inquirySearch.toLowerCase();
      return (
        item.id.toLowerCase().includes(q) ||
        (item.fullName && item.fullName.toLowerCase().includes(q)) ||
        (item.subject && item.subject.toLowerCase().includes(q)) ||
        (item.phone && item.phone.toLowerCase().includes(q)) ||
        (item.email && item.email.toLowerCase().includes(q))
      );
    });
  }, [inquiries, inquiryStatus, inquirySearch]);

  // Filtered Partnerships
  const filteredPartnerships = useMemo(() => {
    return partnerships.filter(item => {
      if (partnerStatus !== 'all' && item.status.toLowerCase() !== partnerStatus.toLowerCase()) return false;
      if (!partnerSearch.trim()) return true;
      const q = partnerSearch.toLowerCase();
      return (
        item.id.toLowerCase().includes(q) ||
        (item.organization && item.organization.toLowerCase().includes(q)) ||
        (item.contactPerson && item.contactPerson.toLowerCase().includes(q)) ||
        (item.track && item.track.toLowerCase().includes(q)) ||
        (item.phone && item.phone.toLowerCase().includes(q))
      );
    });
  }, [partnerships, partnerStatus, partnerSearch]);

  // Filtered Careers
  const filteredCareers = useMemo(() => {
    return careers.filter(item => {
      if (careerStatus !== 'all' && item.status.toLowerCase() !== careerStatus.toLowerCase()) return false;
      if (!careerSearch.trim()) return true;
      const q = careerSearch.toLowerCase();
      return (
        item.id.toLowerCase().includes(q) ||
        (item.fullName && item.fullName.toLowerCase().includes(q)) ||
        (item.position && item.position.toLowerCase().includes(q)) ||
        (item.phone && item.phone.toLowerCase().includes(q)) ||
        (item.qualification && item.qualification.toLowerCase().includes(q))
      );
    });
  }, [careers, careerStatus, careerSearch]);

  // Filtered Driver Applications
  const filteredDriverApplications = useMemo(() => {
    return driverApplications.filter(item => {
      if (driverStatus !== 'all' && item.status.toLowerCase() !== driverStatus.toLowerCase()) return false;
      if (!driverSearch.trim()) return true;
      const q = driverSearch.toLowerCase();
      return (
        item.id.toLowerCase().includes(q) ||
        (item.fullName && item.fullName.toLowerCase().includes(q)) ||
        (item.positionApplied && item.positionApplied.toLowerCase().includes(q)) ||
        (item.phone && item.phone.toLowerCase().includes(q)) ||
        (item.licenseNumber && item.licenseNumber.toLowerCase().includes(q)) ||
        (item.email && item.email.toLowerCase().includes(q))
      );
    });
  }, [driverApplications, driverStatus, driverSearch]);

  // Filtered Consultants
  const filteredConsultants = useMemo(() => {
    return consultants.filter(item => {
      if (consultantStatus !== 'all' && item.status.toLowerCase() !== consultantStatus.toLowerCase()) return false;
      if (!consultantSearch.trim()) return true;
      const q = consultantSearch.toLowerCase();
      return (
        item.id.toLowerCase().includes(q) ||
        (item.fullName && item.fullName.toLowerCase().includes(q)) ||
        (item.specialization && item.specialization.toLowerCase().includes(q)) ||
        (item.certifications && item.certifications.toLowerCase().includes(q)) ||
        (item.phone && item.phone.toLowerCase().includes(q))
      );
    });
  }, [consultants, consultantStatus, consultantSearch]);

  // Update Status
  const handleUpdateStatus = async (type: string, id: string, newStatus: LeadStatus) => {
    setIsSavingStatus(true);
    try {
      if (type === 'quote') await StorageService.updateQuoteStatus(id, newStatus);
      else if (type === 'inquiry') await StorageService.updateInquiryStatus(id, newStatus);
      else if (type === 'partner') await StorageService.updatePartnershipStatus(id, newStatus);
      else if (type === 'career') await StorageService.updateCareerStatus(id, newStatus);
      else if (type === 'consultant') await StorageService.updateConsultantStatus(id, newStatus);
      else if (type === 'driver') await StorageService.updateDriverApplicationStatus(id, newStatus);

      await loadData();
      if (detailModal && detailModal.record.id === id) {
        setDetailModal({
          ...detailModal,
          record: { ...detailModal.record, status: newStatus }
        });
        setModalCurrentStatus(newStatus);
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
      showToast('Status Updated', `Record ${id} updated to "${newStatus}"`, 'success');
    } catch (err: any) {
      console.error('Failed to update status:', err);
      showToast('Update Failed', 'Could not save status change.', 'error');
    } finally {
      setIsSavingStatus(false);
    }
  };

  // Delete Action
  const executeDelete = async () => {
    if (!deletePending) return;
    const { type, id } = deletePending;
    if (type === 'quote') await StorageService.deleteQuote(id);
    else if (type === 'inquiry') await StorageService.deleteInquiry(id);
    else if (type === 'partner') await StorageService.deletePartnership(id);
    else if (type === 'career') await StorageService.deleteCareer(id);
    else if (type === 'consultant') await StorageService.deleteConsultant(id);
    else if (type === 'driver') await StorageService.deleteDriverApplication(id);

    await loadData();
    setDeletePending(null);
    if (detailModal && detailModal.record.id === id) {
      setDetailModal(null);
    }
    showToast('Record Deleted', `Record ${id} has been permanently removed.`, 'info');
  };

  // CSV Export for Quotes
  const exportQuotesCSV = () => {
    if (quotes.length === 0) {
      showToast('Export Notice', 'No quote requests to export.', 'info');
      return;
    }
    const headers = ['Ref ID', 'Name', 'Company', 'Email', 'Phone', 'Location', 'Service', 'Status', 'Date'];
    const rows = quotes.map(q => [
      q.id,
      `"${(q.name || '').replace(/"/g, '""')}"`,
      `"${(q.company || '').replace(/"/g, '""')}"`,
      q.email,
      q.phone,
      `"${(q.location || '').replace(/"/g, '""')}"`,
      `"${(q.service || '').replace(/"/g, '""')}"`,
      q.status,
      q.createdAt ? q.createdAt.slice(0, 10) : ''
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ecoblue_quotes_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV Exported', `Downloaded ${quotes.length} quotes.`, 'success');
  };

  // CSV Export for Driver Applications
  const exportDriversCSV = () => {
    if (driverApplications.length === 0) {
      showToast('Export Notice', 'No driver applications to export.', 'info');
      return;
    }
    const headers = [
      'App ID',
      'Full Name',
      'Phone',
      'Email',
      'Position Applied',
      'License Class',
      'License Number',
      'Years Experience',
      'State / LGA',
      'Accident History',
      'Traffic Violations',
      'Owns Vehicle',
      'Guarantor Name',
      'Status',
      'Date'
    ];
    const rows = driverApplications.map(d => [
      d.id,
      `"${(d.fullName || '').replace(/"/g, '""')}"`,
      d.phone,
      d.email,
      `"${(d.positionApplied || '').replace(/"/g, '""')}"`,
      `"${(d.licenseClass || '').replace(/"/g, '""')}"`,
      `"${(d.licenseNumber || '').replace(/"/g, '""')}"`,
      `"${(d.yearsExperience || '').replace(/"/g, '""')}"`,
      `"${((d.lga ? `${d.lga}, ` : '') + (d.stateOfOrigin || '')).replace(/"/g, '""')}"`,
      d.accidentHistory || 'No',
      d.trafficViolation || 'No',
      d.ownsVehicle || 'No',
      `"${(d.guarantorName || '').replace(/"/g, '""')}"`,
      d.status,
      d.createdAt ? d.createdAt.slice(0, 10) : ''
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ecoblue_driver_applications_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV Exported', `Downloaded ${driverApplications.length} driver dossiers.`, 'success');
  };

  const getStatusBadgeClass = (status?: string) => {
    switch (status) {
      case 'Pending':
        return 'badge-pending';
      case 'Reviewed':
        return 'badge-reviewed';
      case 'Contacted':
        return 'badge-contacted';
      case 'Completed':
      case 'Empanelled':
      case 'Shortlisted':
      case 'Active Project':
      case 'Interviewed':
      case 'Hired':
        return 'badge-completed';
      default:
        return 'badge-pending';
    }
  };

  // 1. Initial Auth Check Loading Gate
  if (isCheckingAuth) {
    return (
      <div className="admin-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#F8FAFC' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem auto' }} />
          <p style={{ fontSize: '0.9rem', color: 'var(--color-primary-navy)', fontWeight: 600 }}>
            Verifying secure staff credentials...
          </p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated Login Screen Guard
  if (!isAuthenticated) {
    return (
      <div className="admin-body">
        <div className="admin-login-screen" id="adminLoginOverlay">
          <div className="admin-login-card">
            <img
              src="/images/logo.png"
              alt="EcoBlue Logo"
              style={{
                height: '96px',
                width: 'auto',
                objectFit: 'contain',
                margin: '0 auto 1.25rem auto',
                display: 'block',
                border: 'none',
                boxShadow: 'none',
                background: 'transparent'
              }}
            />
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary-navy)', marginBottom: '0.35rem' }}>
              EcoBlue Staff Portal
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
              Authorized administrative access for EcoBlue operations and client dispatch in Port Harcourt.
            </p>

            {loginError && (
              <div
                style={{
                  backgroundColor: '#FEE2E2',
                  border: '1px solid #F87171',
                  color: '#991B1B',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  marginBottom: '16px',
                  textAlign: 'left',
                  lineHeight: 1.5
                }}
              >
                {loginError}
              </div>
            )}

            {viewParam && (
              <div
                style={{
                  backgroundColor: '#EFF6FF',
                  border: '1.5px solid #BFDBFE',
                  color: '#1E40AF',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  marginBottom: '16px',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                <div>
                  <strong>Staff Access Link:</strong> Request <strong>{viewParam}</strong> is queued for inspection. Sign in below to load the live dispatch record.
                </div>
              </div>
            )}

            <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '4px' }}>
                  Staff Email / Username
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="ecoblueenvironmentalservice@gmail.com"
                  value={adminEmail}
                  onChange={e => setAdminEmail(e.target.value)}
                  required
                  autoComplete="username"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--color-border-medium)', fontSize: '0.95rem' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '4px' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    placeholder="Enter security password"
                    value={adminPass}
                    onChange={e => setAdminPass(e.target.value)}
                    required
                    autoComplete="current-password"
                    style={{ width: '100%', padding: '10px 42px 10px 12px', borderRadius: '6px', border: '1px solid var(--color-border-medium)', fontSize: '0.95rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-text-subtle)',
                      cursor: 'pointer',
                      padding: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoggingIn}
                style={{
                  width: '100%',
                  marginTop: '0.75rem',
                  padding: '12px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  cursor: isLoggingIn ? 'wait' : 'pointer'
                }}
              >
                {isLoggingIn ? (
                  <>
                    <svg className="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                    </svg>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <span>Sign In to Operations Portal</span>
                )}
              </button>
            </form>

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0', fontSize: '0.75rem', color: 'var(--color-text-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <span>256-bit Encrypted Operations Gateway • Authorized Personnel Only</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Authenticated Admin Portal
  return (
    <div className="admin-body">
      {/* Mobile Sidebar Backdrop Overlay */}
      <div
        className={`admin-sidebar-backdrop ${isSidebarOpen ? 'active' : ''}`}
        id="adminSidebarBackdrop"
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Admin Layout */}
      <div className="admin-layout">
        {/* Sidebar */}
        <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`} id="adminSidebar">
          <div className="admin-sidebar-header">
            <img
              src="/images/logo.png"
              alt="EcoBlue Logo"
              style={{ height: '48px', width: 'auto', objectFit: 'contain', border: 'none', boxShadow: 'none', background: 'transparent', flexShrink: 0 }}
            />
            <div style={{ flexGrow: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', lineHeight: 1.1 }}>
                Eco<span>Blue</span>
              </div>
              <div style={{ fontSize: '0.65rem', color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Admin Portal
              </div>
            </div>
            <button
              className="admin-sidebar-close"
              id="closeAdminNav"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close Navigation Menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <nav className="admin-nav">
            <div
              className={`admin-nav-item ${activeTab === 'tabOverview' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('tabOverview');
                setIsSidebarOpen(false);
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              <span>Overview & Stats</span>
            </div>

            <div
              className={`admin-nav-item ${activeTab === 'tabQuotes' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('tabQuotes');
                setIsSidebarOpen(false);
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <span>Quote Requests</span>
            </div>

            <div
              className={`admin-nav-item ${activeTab === 'tabInquiries' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('tabInquiries');
                setIsSidebarOpen(false);
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>Contact Inquiries</span>
            </div>

            <div
              className={`admin-nav-item ${activeTab === 'tabPartnerships' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('tabPartnerships');
                setIsSidebarOpen(false);
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>Partnerships</span>
            </div>

            <div
              className={`admin-nav-item ${activeTab === 'tabCareers' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('tabCareers');
                setIsSidebarOpen(false);
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Career Applicants</span>
            </div>

            <div
              className={`admin-nav-item ${activeTab === 'tabDrivers' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('tabDrivers');
                setIsSidebarOpen(false);
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              <span>Driver Applications</span>
              {metrics.pendingDrivers > 0 && (
                <span style={{ marginLeft: 'auto', backgroundColor: '#EF4444', color: '#fff', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700, padding: '1px 7px', minWidth: '18px', textAlign: 'center' }}>
                  {metrics.pendingDrivers}
                </span>
              )}
            </div>

            <div
              className={`admin-nav-item ${activeTab === 'tabConsultants' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('tabConsultants');
                setIsSidebarOpen(false);
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <polyline points="17 11 19 13 23 9" />
              </svg>
              <span>Consultants</span>
            </div>

            <div
              className={`admin-nav-item ${activeTab === 'tabFleet' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('tabFleet');
                setIsSidebarOpen(false);
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              <span>Fleet & Assets</span>
            </div>

            <div
              className={`admin-nav-item ${activeTab === 'tabLogs' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('tabLogs');
                setIsSidebarOpen(false);
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 14 14" />
              </svg>
              <span>Activity Logs</span>
            </div>
          </nav>

          <div className="admin-sidebar-footer">
            <Link href="/" className="btn btn-sm btn-outline-white" style={{ width: '100%', marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}>
              View Public Site
            </Link>
            <button
              className="btn btn-sm btn-outline"
              style={{ width: '100%', borderColor: 'rgba(255,255,255,0.2)', color: '#E2E8F0' }}
              id="adminLogoutBtn"
              onClick={handleLogout}
            >
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="admin-main">
          {/* Topbar */}
          <header className="admin-topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                className="admin-mobile-toggle"
                id="openAdminNav"
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Open Navigation Menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
              <div className="admin-page-title">Operations & Inquiries Console</div>
            </div>
            <div className="admin-user-profile" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="btn btn-sm btn-outline"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.825rem',
                  borderColor: 'var(--color-border-medium)',
                  background: '#ffffff',
                  cursor: isRefreshing ? 'wait' : 'pointer'
                }}
                title="Sync and refresh all records from database"
              >
                <svg
                  className={isRefreshing ? 'spin' : ''}
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
                <span>{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
              </button>
              <span className="admin-user-tag">EcoBlue Admin • Port Harcourt</span>
              <div className="admin-avatar">EB</div>
            </div>
          </header>

          <div className="admin-content">
            {/* 1. Overview Tab */}
            {activeTab === 'tabOverview' && (
              <div className="admin-tab-panel" id="tabOverview">
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-card-info">
                      <h5>Total Quote Requests</h5>
                      <div className="stat-number" id="statTotalRequests">{metrics.totalQuotes}</div>
                    </div>
                    <div className="stat-card-icon green">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-card-info">
                      <h5>Pending Review</h5>
                      <div className="stat-number" id="statPendingQuotes">{metrics.pendingQuotes}</div>
                    </div>
                    <div className="stat-card-icon amber">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 14 14" />
                      </svg>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-card-info">
                      <h5>General Inquiries</h5>
                      <div className="stat-number" id="statTotalInquiries">{metrics.totalInquiries}</div>
                    </div>
                    <div className="stat-card-icon blue">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-card-info">
                      <h5>Partnership Proposals</h5>
                      <div className="stat-number" id="statTotalPartners">{metrics.totalPartners}</div>
                    </div>
                    <div className="stat-card-icon purple">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      </svg>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-card-info">
                      <h5>Career Applicants</h5>
                      <div className="stat-number" id="statTotalCareers">{metrics.totalCareers}</div>
                    </div>
                    <div className="stat-card-icon green">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-card-info">
                      <h5>Consultants</h5>
                      <div className="stat-number" id="statTotalConsultants">{metrics.totalConsultants}</div>
                    </div>
                    <div className="stat-card-icon blue">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="8.5" cy="7" r="4" />
                        <polyline points="17 11 19 13 23 9" />
                      </svg>
                    </div>
                  </div>

                  <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('tabDrivers')}>
                    <div className="stat-card-info">
                      <h5>Driver Applications</h5>
                      <div className="stat-number" id="statTotalDrivers">{metrics.totalDrivers}</div>
                    </div>
                    <div className="stat-card-icon amber">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="3" width="15" height="13" />
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                        <circle cx="5.5" cy="18.5" r="2.5" />
                        <circle cx="18.5" cy="18.5" r="2.5" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Quick Actions & System Info */}
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary-navy)' }}>Corporate Compliance Status</h3>
                    <span className="badge badge-completed">Fully Compliant • CAMA 2020</span>
                  </div>
                  <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', textTransform: 'uppercase' }}>Legal Framework</span>
                      <div style={{ fontWeight: 700, color: 'var(--color-primary-navy)' }}>CAMA 2020 Registered</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', textTransform: 'uppercase' }}>Operational Base</span>
                      <div style={{ fontWeight: 700, color: 'var(--color-primary-navy)' }}>Port Harcourt, Rivers State</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', textTransform: 'uppercase' }}>Fleet Specification</span>
                      <div style={{ fontWeight: 700, color: 'var(--color-primary-green)' }}>Heavy Hydraulic Compactor Vehicles</div>
                    </div>
                  </div>
                </div>

                {/* Recent Submissions Stream */}
                <div className="admin-card" style={{ marginTop: '1.5rem' }}>
                  <div className="admin-card-header">
                    <div>
                      <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary-navy)' }}>Recent Submissions Stream</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)', margin: 0 }}>
                        Real-time feed of all incoming quotes, contact inquiries, and applications.
                      </p>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Ref ID</th>
                          <th>Channel</th>
                          <th>Sender / Contact</th>
                          <th>Category / Service</th>
                          <th>Status</th>
                          <th>Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentSubmissions.length === 0 ? (
                          <tr>
                            <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--color-text-subtle)' }}>
                              No submissions received yet.
                            </td>
                          </tr>
                        ) : (
                          recentSubmissions.map(item => {
                            const dateStr = item.date
                              ? new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                              : '—';
                            return (
                              <tr key={item.id}>
                                <td style={{ fontWeight: 700, color: 'var(--color-primary-navy)' }}>{item.id}</td>
                                <td>
                                  <span className="badge badge-pending" style={{ fontSize: '0.725rem' }}>{item.channel}</span>
                                </td>
                                <td>
                                  <div style={{ fontWeight: 600 }}>{item.name || item.id}</div>
                                </td>
                                <td>{item.category || '—'}</td>
                                <td>
                                  <button
                                    type="button"
                                    onClick={() => setDetailModal({ record: item.raw, type: item.type })}
                                    style={{ cursor: 'pointer', border: 'none', background: 'transparent', padding: 0 }}
                                    title="Click to view & change status"
                                  >
                                    <span className={`badge ${getStatusBadgeClass(item.status)}`}>
                                      {item.status}
                                    </span>
                                  </button>
                                </td>
                                <td style={{ fontSize: '0.825rem', color: 'var(--color-text-subtle)' }}>{dateStr}</td>
                                <td className="admin-actions-cell">
                                  <button
                                    type="button"
                                    className="admin-action-btn view-btn"
                                    onClick={() => setDetailModal({ record: item.raw, type: item.type })}
                                    title="View & Manage Request"
                                  >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                      <circle cx="12" cy="12" r="3" />
                                    </svg>
                                    <span>View</span>
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Quote Requests Tab */}
            {activeTab === 'tabQuotes' && (
              <div className="admin-tab-panel" id="tabQuotes">
                <div className="admin-card">
                  <div className="admin-card-header">
                    <div>
                      <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary-navy)' }}>Service & Quote Requests</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)', margin: 0 }}>Incoming requests submitted via public website modals and quote forms.</p>
                    </div>

                    <div className="admin-filter-bar">
                      <input
                        type="text"
                        id="quoteSearchInput"
                        className="admin-search-input"
                        placeholder="Search by name, org, or location..."
                        value={quoteSearch}
                        onChange={e => setQuoteSearch(e.target.value)}
                      />
                      <select
                        id="quoteStatusFilter"
                        className="form-select"
                        style={{ width: 'auto', padding: '0.5rem 0.85rem' }}
                        value={quoteStatus}
                        onChange={e => setQuoteStatus(e.target.value)}
                      >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="contacted">Contacted</option>
                        <option value="completed">Completed</option>
                      </select>
                      <button className="btn btn-sm btn-outline" id="exportQuotesBtn" onClick={exportQuotesCSV}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Export CSV
                      </button>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Ref ID</th>
                          <th>Client / Organization</th>
                          <th>Contact Info</th>
                          <th>Service & Location</th>
                          <th>Status</th>
                          <th>Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody id="quotesTableBody">
                        {filteredQuotes.length === 0 ? (
                          <tr>
                            <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--color-text-subtle)' }}>
                              No quote requests found.
                            </td>
                          </tr>
                        ) : (
                          filteredQuotes.map(q => {
                            const dateStr = q.createdAt ? new Date(q.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
                            return (
                              <tr key={q.id}>
                                <td style={{ fontWeight: 700, color: 'var(--color-primary-navy)' }}>{q.id}</td>
                                <td>
                                  <div style={{ fontWeight: 600 }}>{q.name}</div>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>{q.company || 'Individual'}</div>
                                </td>
                                <td>
                                  <div>{q.phone}</div>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>{q.email}</div>
                                </td>
                                <td>
                                  <span style={{ fontWeight: 500 }}>{q.service}</span>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>{q.location || 'Rivers State'}</div>
                                </td>
                                <td>
                                  <button
                                    type="button"
                                    onClick={() => setDetailModal({ record: q, type: 'quote' })}
                                    style={{ cursor: 'pointer', border: 'none', background: 'transparent', padding: 0 }}
                                    title="Click to view & change status"
                                  >
                                    <span className={`badge ${getStatusBadgeClass(q.status)}`}>
                                      {q.status}
                                    </span>
                                  </button>
                                </td>
                                <td style={{ fontSize: '0.825rem', color: 'var(--color-text-subtle)' }}>{dateStr}</td>
                                <td className="admin-actions-cell">
                                  <div className="admin-action-btn-group">
                                    <button
                                      className="admin-action-btn view-btn"
                                      onClick={() => setDetailModal({ record: q, type: 'quote' })}
                                      title="View & Manage Request"
                                    >
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                      </svg>
                                      <span>View</span>
                                    </button>
                                    <button
                                      className="admin-action-btn delete-btn"
                                      onClick={() => setDeletePending({ type: 'quote', id: q.id, name: `${q.name} (${q.id})` })}
                                      title="Delete Record"
                                    >
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="3 6 5 6 21 6" />
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                      </svg>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Contact Inquiries Tab */}
            {activeTab === 'tabInquiries' && (
              <div className="admin-tab-panel" id="tabInquiries">
                <div className="admin-card">
                  <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary-navy)', margin: 0 }}>General Contact Messages</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)', margin: 0 }}>Messages submitted through the public website contact portal.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <input
                        type="text"
                        placeholder="Search sender, message..."
                        className="form-input"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', width: '180px' }}
                        value={inquirySearch}
                        onChange={e => setInquirySearch(e.target.value)}
                      />
                      <select
                        className="form-select"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', width: 'auto' }}
                        value={inquiryStatus}
                        onChange={e => setInquiryStatus(e.target.value)}
                      >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="contacted">Contacted</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Ref ID</th>
                          <th>Sender Name</th>
                          <th>Phone</th>
                          <th>Subject Service</th>
                          <th>Status</th>
                          <th>Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody id="inquiriesTableBody">
                        {filteredInquiries.length === 0 ? (
                          <tr>
                            <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--color-text-subtle)' }}>
                              No contact inquiries found.
                            </td>
                          </tr>
                        ) : (
                          filteredInquiries.map(c => {
                            const dateStr = c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
                            return (
                              <tr key={c.id}>
                                <td style={{ fontWeight: 700, color: 'var(--color-primary-navy)' }}>{c.id}</td>
                                <td>
                                  <div style={{ fontWeight: 600 }}>{c.fullName}</div>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>{c.email}</div>
                                </td>
                                <td>{c.phone}</td>
                                <td>
                                  <span style={{ fontWeight: 500 }}>{c.subject || 'General Inquiry'}</span>
                                </td>
                                <td>
                                  <button
                                    type="button"
                                    onClick={() => setDetailModal({ record: c, type: 'inquiry' })}
                                    style={{ cursor: 'pointer', border: 'none', background: 'transparent', padding: 0 }}
                                    title="Click to view & change status"
                                  >
                                    <span className={`badge ${getStatusBadgeClass(c.status)}`}>
                                      {c.status}
                                    </span>
                                  </button>
                                </td>
                                <td style={{ fontSize: '0.825rem', color: 'var(--color-text-subtle)' }}>{dateStr}</td>
                                <td className="admin-actions-cell">
                                  <div className="admin-action-btn-group">
                                    <button
                                      className="admin-action-btn view-btn"
                                      onClick={() => setDetailModal({ record: c, type: 'inquiry' })}
                                      title="View & Manage Inquiry"
                                    >
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                      </svg>
                                      <span>View</span>
                                    </button>
                                    <button
                                      className="admin-action-btn delete-btn"
                                      onClick={() => setDeletePending({ type: 'inquiry', id: c.id, name: `${c.fullName} (${c.id})` })}
                                      title="Delete Record"
                                    >
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="3 6 5 6 21 6" />
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                      </svg>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Partnerships Tab */}
            {activeTab === 'tabPartnerships' && (
              <div className="admin-tab-panel" id="tabPartnerships">
                <div className="admin-card">
                  <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary-navy)', margin: 0 }}>Strategic Partnership Proposals</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)', margin: 0 }}>Institutional collaborations, off-take agreements, and CSR alliances.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <input
                        type="text"
                        placeholder="Search organization, track..."
                        className="form-input"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', width: '180px' }}
                        value={partnerSearch}
                        onChange={e => setPartnerSearch(e.target.value)}
                      />
                      <select
                        className="form-select"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', width: 'auto' }}
                        value={partnerStatus}
                        onChange={e => setPartnerStatus(e.target.value)}
                      >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="empanelled">Empanelled</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Ref ID</th>
                          <th>Organization / Name</th>
                          <th>Communication</th>
                          <th>Partnership Type</th>
                          <th>Status</th>
                          <th>Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody id="partnersTableBody">
                        {filteredPartnerships.length === 0 ? (
                          <tr>
                            <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--color-text-subtle)' }}>
                              No partnership proposals found.
                            </td>
                          </tr>
                        ) : (
                          filteredPartnerships.map(p => {
                            const dateStr = p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
                            return (
                              <tr key={p.id}>
                                <td style={{ fontWeight: 700, color: 'var(--color-primary-navy)' }}>{p.id}</td>
                                <td>
                                  <div style={{ fontWeight: 600 }}>{p.organization}</div>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>Contact: {p.contactPerson}</div>
                                </td>
                                <td>
                                  <div>{p.phone}</div>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>{p.email}</div>
                                </td>
                                <td>
                                  <span style={{ fontWeight: 600, color: 'var(--color-primary-green)' }}>{p.track}</span>
                                </td>
                                <td>
                                  <button
                                    type="button"
                                    onClick={() => setDetailModal({ record: p, type: 'partner' })}
                                    style={{ cursor: 'pointer', border: 'none', background: 'transparent', padding: 0 }}
                                    title="Click to view & change status"
                                  >
                                    <span className={`badge ${getStatusBadgeClass(p.status)}`}>
                                      {p.status}
                                    </span>
                                  </button>
                                </td>
                                <td style={{ fontSize: '0.825rem', color: 'var(--color-text-subtle)' }}>{dateStr}</td>
                                <td className="admin-actions-cell">
                                  <div className="admin-action-btn-group">
                                    <button
                                      className="admin-action-btn view-btn"
                                      onClick={() => setDetailModal({ record: p, type: 'partner' })}
                                      title="View & Manage Proposal"
                                    >
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                      </svg>
                                      <span>View</span>
                                    </button>
                                    <button
                                      className="admin-action-btn delete-btn"
                                      onClick={() => setDeletePending({ type: 'partner', id: p.id, name: `${p.organization} (${p.id})` })}
                                      title="Delete Record"
                                    >
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="3 6 5 6 21 6" />
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                      </svg>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 5. Career Applicants Tab */}
            {activeTab === 'tabCareers' && (
              <div className="admin-tab-panel" id="tabCareers">
                <div className="admin-card">
                  <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary-navy)', marginBottom: '0.25rem' }}>Career Applications & Talent Pipeline</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)', margin: 0 }}>Recruitment submissions for Port Harcourt operations, engineering, and logistics roles.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <input
                        type="text"
                        id="careerSearchInput"
                        placeholder="Search candidate, role..."
                        className="form-input"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', width: '180px' }}
                        value={careerSearch}
                        onChange={e => setCareerSearch(e.target.value)}
                      />
                      <select
                        id="careerStatusFilter"
                        className="form-select"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', width: 'auto' }}
                        value={careerStatus}
                        onChange={e => setCareerStatus(e.target.value)}
                      >
                        <option value="all">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interviewed">Interviewed</option>
                      </select>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>App ID</th>
                          <th>Candidate</th>
                          <th>Position Applied</th>
                          <th>Experience & Base</th>
                          <th>Status</th>
                          <th>Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody id="careersTableBody">
                        {filteredCareers.length === 0 ? (
                          <tr>
                            <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--color-text-subtle)' }}>
                              No career applications found.
                            </td>
                          </tr>
                        ) : (
                          filteredCareers.map(a => {
                            const dateStr = a.createdAt ? new Date(a.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
                            return (
                              <tr key={a.id}>
                                <td style={{ fontWeight: 700, color: 'var(--color-primary-navy)' }}>{a.id}</td>
                                <td>
                                  <div style={{ fontWeight: 600 }}>{a.fullName}</div>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>{a.phone} • {a.email}</div>
                                </td>
                                <td>
                                  <div style={{ fontWeight: 600, color: 'var(--color-primary-green)' }}>{a.position}</div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>{a.qualification}</div>
                                </td>
                                <td>
                                  <div>{a.experience}</div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>Port Harcourt, Rivers State</div>
                                </td>
                                <td>
                                  <button
                                    type="button"
                                    onClick={() => setDetailModal({ record: a, type: 'career' })}
                                    style={{ cursor: 'pointer', border: 'none', background: 'transparent', padding: 0 }}
                                    title="Click to view & change status"
                                  >
                                    <span className={`badge ${getStatusBadgeClass(a.status)}`}>
                                      {a.status}
                                    </span>
                                  </button>
                                </td>
                                <td style={{ fontSize: '0.825rem', color: 'var(--color-text-subtle)' }}>{dateStr}</td>
                                <td className="admin-actions-cell">
                                  <div className="admin-action-btn-group">
                                    <button
                                      className="admin-action-btn view-btn"
                                      onClick={() => setDetailModal({ record: a, type: 'career' })}
                                      title="Review Candidate Dossier"
                                    >
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                      </svg>
                                      <span>Review</span>
                                    </button>
                                    <button
                                      className="admin-action-btn delete-btn"
                                      onClick={() => setDeletePending({ type: 'career', id: a.id, name: `${a.fullName} (${a.id})` })}
                                      title="Delete Application"
                                    >
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="3 6 5 6 21 6" />
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                      </svg>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 6. Driver Applications Tab */}
            {activeTab === 'tabDrivers' && (
              <div className="admin-tab-panel" id="tabDrivers">
                <div className="admin-card">
                  <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary-navy)', margin: 0 }}>Driver Applications & Fleet Recruitment Pipeline</h3>
                        <span className="badge badge-completed" style={{ fontSize: '0.75rem' }}>
                          {filteredDriverApplications.length} of {driverApplications.length} records
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)', margin: '0.25rem 0 0 0' }}>
                        Recruitment submissions for hydraulic compactor trucks, roll-on skip haulage, and municipal logistics across Port Harcourt.
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <input
                        type="text"
                        id="driverSearchInput"
                        placeholder="Search candidate, license, ID, route..."
                        className="form-input"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', width: '230px' }}
                        value={driverSearch}
                        onChange={e => setDriverSearch(e.target.value)}
                      />
                      <select
                        id="driverStatusFilter"
                        className="form-select"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', width: 'auto' }}
                        value={driverStatus}
                        onChange={e => setDriverStatus(e.target.value)}
                      >
                        <option value="all">All Statuses ({driverApplications.length})</option>
                        <option value="Pending">Pending ({driverApplications.filter(d => d.status === 'Pending').length})</option>
                        <option value="Reviewed">Reviewed ({driverApplications.filter(d => d.status === 'Reviewed').length})</option>
                        <option value="Shortlisted">Shortlisted ({driverApplications.filter(d => d.status === 'Shortlisted').length})</option>
                        <option value="Interviewed">Interviewed ({driverApplications.filter(d => d.status === 'Interviewed').length})</option>
                        <option value="Hired">Hired ({driverApplications.filter(d => d.status === 'Hired').length})</option>
                        <option value="Completed">Completed ({driverApplications.filter(d => d.status === 'Completed').length})</option>
                      </select>
                      <button
                        type="button"
                        onClick={exportDriversCSV}
                        className="admin-action-btn view-btn"
                        style={{ padding: '0.45rem 0.85rem', fontSize: '0.825rem', height: 'auto' }}
                        title="Download CSV of all driver applications"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        <span>Export CSV</span>
                      </button>
                      <Link
                        href="/careers/driver-application"
                        target="_blank"
                        className="admin-action-btn"
                        style={{ padding: '0.45rem 0.85rem', fontSize: '0.825rem', height: 'auto', textDecoration: 'none', background: '#F1F5F9', color: 'var(--color-primary-navy)', border: '1px solid #CBD5E1' }}
                        title="Open live public driver application form in new tab"
                      >
                        <span>Live Form ↗</span>
                      </Link>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>App ID</th>
                          <th>Candidate & Contact</th>
                          <th>Role & License</th>
                          <th>Experience & Origin</th>
                          <th>Safety Record</th>
                          <th>Status</th>
                          <th>Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody id="driversTableBody">
                        {filteredDriverApplications.length === 0 ? (
                          <tr>
                            <td colSpan={8} style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--color-text-subtle)' }}>
                              <div style={{ maxWidth: '380px', margin: '0 auto' }}>
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5" style={{ margin: '0 auto 0.75rem auto', display: 'block' }}>
                                  <rect x="1" y="3" width="15" height="13" />
                                  <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
                                  <circle cx="5.5" cy="18.5" r="2.5" />
                                  <circle cx="18.5" cy="18.5" r="2.5" />
                                </svg>
                                <div style={{ fontWeight: 700, color: 'var(--color-primary-navy)', marginBottom: '0.35rem' }}>No Driver Applications Found</div>
                                <p style={{ fontSize: '0.85rem', marginBottom: '1rem', color: '#64748B' }}>
                                  {driverSearch || driverStatus !== 'all'
                                    ? 'No dossiers match your current filter criteria. Try clearing your search.'
                                    : 'No commercial driver recruitment submissions have been recorded yet.'}
                                </p>
                                {(driverSearch || driverStatus !== 'all') ? (
                                  <button
                                    type="button"
                                    className="btn btn-secondary"
                                    style={{ padding: '0.4rem 0.9rem', fontSize: '0.825rem' }}
                                    onClick={() => { setDriverSearch(''); setDriverStatus('all'); }}
                                  >
                                    Reset Filters
                                  </button>
                                ) : (
                                  <Link
                                    href="/careers/driver-application"
                                    target="_blank"
                                    className="btn btn-primary"
                                    style={{ padding: '0.45rem 1rem', fontSize: '0.825rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                                  >
                                    <span>Submit Test Application</span>
                                    <span>↗</span>
                                  </Link>
                                )}
                              </div>
                            </td>
                          </tr>
                        ) : (
                          filteredDriverApplications.map(d => {
                            const dateStr = d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
                            const waUrl = getWhatsAppUrl(d.phone, d.fullName, d.id);
                            const hasIncident = (d.accidentHistory && d.accidentHistory.toLowerCase() === 'yes') || (d.trafficViolation && d.trafficViolation.toLowerCase() === 'yes');
                            return (
                              <tr key={d.id}>
                                <td style={{ fontWeight: 700, color: 'var(--color-primary-navy)' }}>
                                  <button
                                    type="button"
                                    onClick={() => setDetailModal({ record: d, type: 'driver' })}
                                    style={{ background: 'none', border: 'none', padding: 0, color: 'var(--color-primary-navy)', fontWeight: 700, cursor: 'pointer', textAlign: 'left', textDecoration: 'underline' }}
                                    title="View candidate dossier"
                                  >
                                    {d.id}
                                  </button>
                                </td>
                                <td>
                                  <div style={{ fontWeight: 600 }}>{d.fullName}</div>
                                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-subtle)' }}>
                                    {d.phone} • {d.email}
                                  </div>
                                </td>
                                <td>
                                  <div style={{ fontWeight: 600, color: 'var(--color-primary-navy)' }}>{d.positionApplied || 'Fleet Driver'}</div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>
                                    Class: <span style={{ fontWeight: 600 }}>{d.licenseClass || '—'}</span> • No: {d.licenseNumber || '—'}
                                  </div>
                                </td>
                                <td>
                                  <div>{d.yearsExperience ? `${d.yearsExperience} Exp` : 'Exp: N/A'}</div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>
                                    {d.lga ? `${d.lga}, ` : ''}{d.stateOfOrigin || 'Rivers State'}
                                  </div>
                                </td>
                                <td>
                                  {hasIncident ? (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600, color: '#DC2626', background: '#FEF2F2', padding: '2px 8px', borderRadius: '4px' }}>
                                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                                      Has Records
                                    </span>
                                  ) : (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600, color: '#16A34A', background: '#F0FDF4', padding: '2px 8px', borderRadius: '4px' }}>
                                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                                      Clean Record
                                    </span>
                                  )}
                                </td>
                                <td>
                                  <button
                                    type="button"
                                    onClick={() => setDetailModal({ record: d, type: 'driver' })}
                                    style={{ cursor: 'pointer', border: 'none', background: 'transparent', padding: 0 }}
                                    title="Click to view & change status"
                                  >
                                    <span className={`badge ${getStatusBadgeClass(d.status)}`}>
                                      {d.status}
                                    </span>
                                  </button>
                                </td>
                                <td style={{ fontSize: '0.825rem', color: 'var(--color-text-subtle)' }}>{dateStr}</td>
                                <td className="admin-actions-cell">
                                  <div className="admin-action-btn-group">
                                    <button
                                      type="button"
                                      className="admin-action-btn view-btn"
                                      onClick={() => setDetailModal({ record: d, type: 'driver' })}
                                      title="Review Full 8-Part Dossier"
                                    >
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                      </svg>
                                      <span>Review</span>
                                    </button>
                                    {waUrl && (
                                      <a
                                        href={waUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="admin-action-btn"
                                        style={{ color: '#16A34A', borderColor: '#BBF7D0', background: '#F0FDF4' }}
                                        title="Chat with driver candidate on WhatsApp"
                                      >
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                                          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z" />
                                        </svg>
                                      </a>
                                    )}
                                    <button
                                      type="button"
                                      className="admin-action-btn delete-btn"
                                      onClick={() => setDeletePending({ type: 'driver', id: d.id, name: `${d.fullName} (${d.id})` })}
                                      title="Delete Dossier"
                                    >
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="3 6 5 6 21 6" />
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                      </svg>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 7. Consultants Tab */}
            {activeTab === 'tabConsultants' && (
              <div className="admin-tab-panel" id="tabConsultants">
                <div className="admin-card">
                  <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary-navy)', marginBottom: '0.25rem' }}>External Environmental Consultants</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)', margin: 0 }}>Registry of accredited technical specialists, EIA consultants, and ESG auditors.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <input
                        type="text"
                        id="consultantSearchInput"
                        placeholder="Search expert, discipline..."
                        className="form-input"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', width: '180px' }}
                        value={consultantSearch}
                        onChange={e => setConsultantSearch(e.target.value)}
                      />
                      <select
                        id="consultantStatusFilter"
                        className="form-select"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', width: 'auto' }}
                        value={consultantStatus}
                        onChange={e => setConsultantStatus(e.target.value)}
                      >
                        <option value="all">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Empanelled">Empanelled</option>
                        <option value="Active Project">Active Project</option>
                      </select>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Reg ID</th>
                          <th>Consultant / Firm</th>
                          <th>Primary Discipline</th>
                          <th>Years Exp & Base</th>
                          <th>Status</th>
                          <th>Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody id="consultantsTableBody">
                        {filteredConsultants.length === 0 ? (
                          <tr>
                            <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--color-text-subtle)' }}>
                              No consultant registrations found.
                            </td>
                          </tr>
                        ) : (
                          filteredConsultants.map(c => {
                            const dateStr = c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
                            return (
                              <tr key={c.id}>
                                <td style={{ fontWeight: 700, color: 'var(--color-primary-navy)' }}>{c.id}</td>
                                <td>
                                  <div style={{ fontWeight: 600 }}>{c.fullName}</div>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>{c.phone} • {c.email}</div>
                                </td>
                                <td>
                                  <div style={{ fontWeight: 600, color: 'var(--color-primary-green)' }}>{c.specialization}</div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>{c.certifications || 'Accredited Specialist'}</div>
                                </td>
                                <td>
                                  <div>{c.experienceYears} Years</div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>Port Harcourt & Niger Delta</div>
                                </td>
                                <td>
                                  <button
                                    type="button"
                                    onClick={() => setDetailModal({ record: c, type: 'consultant' })}
                                    style={{ cursor: 'pointer', border: 'none', background: 'transparent', padding: 0 }}
                                    title="Click to view & change status"
                                  >
                                    <span className={`badge ${getStatusBadgeClass(c.status)}`}>
                                      {c.status}
                                    </span>
                                  </button>
                                </td>
                                <td style={{ fontSize: '0.825rem', color: 'var(--color-text-subtle)' }}>{dateStr}</td>
                                <td className="admin-actions-cell">
                                  <div className="admin-action-btn-group">
                                    <button
                                      className="admin-action-btn view-btn"
                                      onClick={() => setDetailModal({ record: c, type: 'consultant' })}
                                      title="Review Consultant Profile"
                                    >
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                      </svg>
                                      <span>Review</span>
                                    </button>
                                    <button
                                      className="admin-action-btn delete-btn"
                                      onClick={() => setDeletePending({ type: 'consultant', id: c.id, name: `${c.fullName} (${c.id})` })}
                                      title="Delete Record"
                                    >
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="3 6 5 6 21 6" />
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                      </svg>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 7. Fleet & Assets Tab */}
            {activeTab === 'tabFleet' && (
              <div className="admin-tab-panel" id="tabFleet">
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary-navy)' }}>Fleet Asset Management & Readiness</h3>
                    <span className="badge badge-completed">Operational</span>
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    <div className="table-responsive">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Vehicle Unit</th>
                            <th>Make & Class</th>
                            <th>System Specification</th>
                            <th>Operational Zone</th>
                            <th>Telemetry Status</th>
                            <th>Maintenance Health</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><strong>EB-TRK-01</strong></td>
                            <td>Heavy Hydraulic Compactor</td>
                            <td>High-Capacity Hydraulic Compactor</td>
                            <td>Trans-Amadi & Old GRA Routes</td>
                            <td><span className="badge badge-completed">GPS Active</span></td>
                            <td>100% Certified</td>
                          </tr>
                          <tr>
                            <td><strong>EB-TRK-02</strong></td>
                            <td>Heavy Hydraulic Compactor</td>
                            <td>High-Capacity Hydraulic Compactor</td>
                            <td>Peter Odili & Residential Estates</td>
                            <td><span className="badge badge-completed">GPS Active</span></td>
                            <td>100% Certified</td>
                          </tr>
                          <tr>
                            <td><strong>EB-LOG-01</strong></td>
                            <td>Heavy Skip Carrier</td>
                            <td>Roll-on / Roll-off Skip System</td>
                            <td>Industrial Staging & Trans-Amadi</td>
                            <td><span className="badge badge-completed">GPS Active</span></td>
                            <td>Scheduled Routine</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div style={{ marginTop: '1.5rem', background: 'var(--color-bg-body)', padding: '1rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'var(--color-text-subtle)' }}>
                      <em>Note: Asset register strictly adheres to official company specifications. Vehicle IDs and fleet units can be managed here as additional units are commissioned by EcoBlue leadership.</em>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 8. Activity Logs Tab */}
            {activeTab === 'tabLogs' && (
              <div className="admin-tab-panel" id="tabLogs">
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary-navy)' }}>System Audit & Security Logs</h3>
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', listStyle: 'none', padding: 0, margin: 0 }}>
                      <li style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '6px', borderLeft: '3px solid var(--color-primary-green)' }}>
                        <strong>Admin Session Authenticated:</strong> Authorized login from secure management workstation.
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', marginTop: '0.25rem' }}>Timestamp: 2026-09-14 (Current Active Session)</div>
                      </li>
                      <li style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '6px', borderLeft: '3px solid var(--color-primary-navy)' }}>
                        <strong>Database Synchronization:</strong> Local data repository validated for EcoBlue service records.
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', marginTop: '0.25rem' }}>Status: Operational (Active Dispatch Pipeline)</div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Detail View Modal */}
      {detailModal && (
        <div
          className="modal-overlay active"
          id="adminDetailModal"
          style={{ display: 'flex' }}
          onClick={e => {
            if (e.target === e.currentTarget) setDetailModal(null);
          }}
        >
          <div className="modal-card">
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <h3 id="adminDetailTitle" style={{ fontSize: '1.25rem', color: 'var(--color-primary-navy)', margin: 0 }}>
                  {detailModal.type === 'quote' && `Quote Request — ${detailModal.record.id}`}
                  {detailModal.type === 'inquiry' && `Contact Message — ${detailModal.record.id}`}
                  {detailModal.type === 'partner' && `Partnership Proposal — ${detailModal.record.id}`}
                  {detailModal.type === 'career' && `Candidate Dossier — ${detailModal.record.id}`}
                  {detailModal.type === 'consultant' && `Consultant Dossier — ${detailModal.record.id}`}
                  {detailModal.type === 'driver' && `Driver Dossier — ${detailModal.record.id}`}
                </h3>
                <span className={`badge ${getStatusBadgeClass(detailModal.record.status)}`}>
                  {detailModal.record.status}
                </span>
              </div>
              <button
                className="modal-close-btn"
                id="closeDetailModalBtn"
                onClick={() => setDetailModal(null)}
                aria-label="Close Modal"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="modal-body" id="adminDetailBody">
              {/* QUOTE LEAD VIEW */}
              {detailModal.type === 'quote' && (() => {
                const item = detailModal.record as QuoteLead;
                const waUrl = getWhatsAppUrl(item.phone, item.name, item.id);
                return (
                  <>
                    <div className="admin-detail-grid">
                      <div className="admin-detail-card">
                        <div className="admin-detail-card-label">Client Details</div>
                        <div className="admin-detail-card-val">{item.name}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)', marginTop: '0.25rem' }}>
                          {item.company || 'Private Individual'}
                        </div>
                        <div className="admin-contact-chips">
                          {item.phone && (
                            <a href={`tel:${item.phone}`} className="admin-contact-chip">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                              </svg>
                              Call ({item.phone})
                            </a>
                          )}
                          {waUrl && (
                            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="admin-contact-chip whatsapp">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z" />
                              </svg>
                              WhatsApp
                            </a>
                          )}
                          {item.email && (
                            <a href={`mailto:${item.email}`} className="admin-contact-chip">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                              </svg>
                              Email
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="admin-detail-card">
                        <div className="admin-detail-card-label">Operational Parameters</div>
                        <div style={{ marginBottom: '0.4rem' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>Service:</span>
                          <div style={{ fontWeight: 700, color: 'var(--color-primary-green)' }}>{item.service}</div>
                        </div>
                        <div style={{ marginBottom: '0.4rem' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>Location Corridor:</span>
                          <div style={{ fontWeight: 600 }}>{item.location || 'Rivers State'}</div>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>Waste Type / Scope:</span>
                          <div style={{ fontWeight: 500 }}>{item.wasteType || 'Commercial / Solid Waste'}</div>
                        </div>
                      </div>
                    </div>

                    <div className="admin-detail-box">
                      <div className="admin-detail-box-title">Waste Requirement Specification</div>
                      <p className="admin-detail-box-text">{item.timeline || item.notes || 'No additional scope specified.'}</p>
                      {item.notes && item.notes !== item.timeline && (
                        <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px dashed #e2e8f0', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                          <strong>Internal Notes:</strong> {item.notes}
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}

              {/* CONTACT INQUIRY VIEW */}
              {detailModal.type === 'inquiry' && (() => {
                const item = detailModal.record as InquiryLead;
                const waUrl = getWhatsAppUrl(item.phone, item.fullName, item.id);
                return (
                  <>
                    <div className="admin-detail-grid">
                      <div className="admin-detail-card">
                        <div className="admin-detail-card-label">Sender Details</div>
                        <div className="admin-detail-card-val">{item.fullName}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)', marginTop: '0.25rem' }}>General Public Contact</div>
                        <div className="admin-contact-chips">
                          {item.phone && (
                            <a href={`tel:${item.phone}`} className="admin-contact-chip">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                              </svg>
                              Call ({item.phone})
                            </a>
                          )}
                          {waUrl && (
                            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="admin-contact-chip whatsapp">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z" />
                              </svg>
                              WhatsApp
                            </a>
                          )}
                          {item.email && (
                            <a href={`mailto:${item.email}`} className="admin-contact-chip">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                              </svg>
                              Email
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="admin-detail-card">
                        <div className="admin-detail-card-label">Subject & Classification</div>
                        <div style={{ marginBottom: '0.4rem' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>Service Category:</span>
                          <div style={{ fontWeight: 700, color: 'var(--color-primary-navy)' }}>{item.subject || 'General Inquiry'}</div>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>Received Date:</span>
                          <div style={{ fontWeight: 600 }}>{item.createdAt ? new Date(item.createdAt).toLocaleString('en-GB') : '—'}</div>
                        </div>
                      </div>
                    </div>

                    <div className="admin-detail-box">
                      <div className="admin-detail-box-title">Message Body</div>
                      <p className="admin-detail-box-text">{item.message || 'No message content provided.'}</p>
                    </div>
                  </>
                );
              })()}

              {/* PARTNERSHIP PROPOSAL VIEW */}
              {detailModal.type === 'partner' && (() => {
                const item = detailModal.record as PartnershipLead;
                const waUrl = getWhatsAppUrl(item.phone, item.contactPerson, item.id);
                return (
                  <>
                    <div className="admin-detail-grid">
                      <div className="admin-detail-card">
                        <div className="admin-detail-card-label">Institutional Partner</div>
                        <div className="admin-detail-card-val">{item.organization}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-subtle)', marginTop: '0.25rem' }}>Contact: {item.contactPerson}</div>
                        <div className="admin-contact-chips">
                          {item.phone && (
                            <a href={`tel:${item.phone}`} className="admin-contact-chip">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                              </svg>
                              Call ({item.phone})
                            </a>
                          )}
                          {waUrl && (
                            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="admin-contact-chip whatsapp">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z" />
                              </svg>
                              WhatsApp
                            </a>
                          )}
                          {item.email && (
                            <a href={`mailto:${item.email}`} className="admin-contact-chip">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                              </svg>
                              Email
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="admin-detail-card">
                        <div className="admin-detail-card-label">Partnership Track</div>
                        <div style={{ marginBottom: '0.4rem' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>Sector / Domain:</span>
                          <div style={{ fontWeight: 700, color: 'var(--color-primary-green)' }}>{item.track}</div>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>Proposal Timestamp:</span>
                          <div style={{ fontWeight: 600 }}>{item.createdAt ? new Date(item.createdAt).toLocaleString('en-GB') : '—'}</div>
                        </div>
                      </div>
                    </div>

                    <div className="admin-detail-box">
                      <div className="admin-detail-box-title">Proposal Description & Objectives</div>
                      <p className="admin-detail-box-text">{item.scopeSummary || 'No additional proposal description provided.'}</p>
                    </div>
                  </>
                );
              })()}

              {/* CAREER APPLICANT VIEW */}
              {detailModal.type === 'career' && (() => {
                const item = detailModal.record as CareerLead;
                const waUrl = getWhatsAppUrl(item.phone, item.fullName, item.id);
                return (
                  <>
                    <div className="admin-detail-grid">
                      <div className="admin-detail-card">
                        <div className="admin-detail-card-label">Candidate Profile</div>
                        <div className="admin-detail-card-val">{item.fullName}</div>
                        <div style={{ fontWeight: 700, color: 'var(--color-primary-green)', marginTop: '0.25rem' }}>{item.position}</div>
                        <div className="admin-contact-chips">
                          {item.phone && (
                            <a href={`tel:${item.phone}`} className="admin-contact-chip">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                              </svg>
                              Call ({item.phone})
                            </a>
                          )}
                          {waUrl && (
                            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="admin-contact-chip whatsapp">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z" />
                              </svg>
                              WhatsApp
                            </a>
                          )}
                          {item.email && (
                            <a href={`mailto:${item.email}`} className="admin-contact-chip">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                              </svg>
                              Email
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="admin-detail-card">
                        <div className="admin-detail-card-label">Qualifications & Experience</div>
                        <div style={{ marginBottom: '0.4rem' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>Years of Experience:</span>
                          <div style={{ fontWeight: 600 }}>{item.experience || 'Not specified'}</div>
                        </div>
                        <div style={{ marginBottom: '0.4rem' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>Qualification / Degree:</span>
                          <div style={{ fontWeight: 500 }}>{item.qualification || 'Commercial / Operational Certificate'}</div>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>CV File:</span>
                          <div style={{ fontWeight: 500 }}>{item.cvFileName || 'Submitted via Portal'}</div>
                        </div>
                      </div>
                    </div>

                    <div className="admin-detail-box">
                      <div className="admin-detail-box-title">Applicant Statement & Summary</div>
                      <p className="admin-detail-box-text">{item.coverLetter || 'No additional statement provided.'}</p>
                    </div>
                  </>
                );
              })()}

              {/* CONSULTANT VIEW */}
              {detailModal.type === 'consultant' && (() => {
                const item = detailModal.record as ConsultantLead;
                const waUrl = getWhatsAppUrl(item.phone, item.fullName, item.id);
                return (
                  <>
                    <div className="admin-detail-grid">
                      <div className="admin-detail-card">
                        <div className="admin-detail-card-label">Consultant Profile</div>
                        <div className="admin-detail-card-val">{item.fullName}</div>
                        <div style={{ fontWeight: 700, color: 'var(--color-primary-green)', marginTop: '0.25rem' }}>{item.specialization}</div>
                        <div className="admin-contact-chips">
                          {item.phone && (
                            <a href={`tel:${item.phone}`} className="admin-contact-chip">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                              </svg>
                              Call ({item.phone})
                            </a>
                          )}
                          {waUrl && (
                            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="admin-contact-chip whatsapp">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z" />
                              </svg>
                              WhatsApp
                            </a>
                          )}
                          {item.email && (
                            <a href={`mailto:${item.email}`} className="admin-contact-chip">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                              </svg>
                              Email
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="admin-detail-card">
                        <div className="admin-detail-card-label">Accreditations & Scope</div>
                        <div style={{ marginBottom: '0.4rem' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>Experience:</span>
                          <div style={{ fontWeight: 600 }}>{item.experienceYears} Years Active Practice</div>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>Certifications:</span>
                          <div style={{ fontWeight: 500 }}>{item.certifications || 'Accredited Specialist'}</div>
                        </div>
                      </div>
                    </div>

                    <div className="admin-detail-box">
                      <div className="admin-detail-box-title">Profile Summary & Expertise</div>
                      <p className="admin-detail-box-text">{item.profileSummary || 'No profile summary provided.'}</p>
                    </div>
                  </>
                );
              })()}

              {/* DRIVER DOSSIER VIEW */}
              {detailModal.type === 'driver' && (() => {
                const item = detailModal.record as DriverApplicationLead;
                const waUrl = getWhatsAppUrl(item.phone, item.fullName, item.id);
                const hasAccident = item.accidentHistory && item.accidentHistory.toLowerCase() === 'yes';
                const hasViolation = item.trafficViolation && item.trafficViolation.toLowerCase() === 'yes';
                const typesList = item.drivingTypes ? item.drivingTypes.split(',').map(s => s.trim()).filter(Boolean) : [];

                return (
                  <>
                    {/* Header Candidate Banner */}
                    <div className="dossier-header-bar">
                      <div>
                        <h4 className="dossier-candidate-title">{item.fullName}</h4>
                        <div className="dossier-candidate-sub">
                          <span className="role-badge">{item.positionApplied || 'Fleet Driver'}</span>
                          <span>Ref: <strong>{item.id}</strong></span>
                          <span>•</span>
                          <span>License: <strong>Class {item.licenseClass || '—'}</strong> ({item.licenseNumber || 'N/A'})</span>
                        </div>
                      </div>
                      <div className="admin-contact-chips" style={{ margin: 0 }}>
                        {item.phone && (
                          <a href={`tel:${item.phone}`} className="admin-contact-chip" style={{ background: '#ffffff', color: '#062C43' }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                            Call ({item.phone})
                          </a>
                        )}
                        {waUrl && (
                          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="admin-contact-chip whatsapp">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z" />
                            </svg>
                            WhatsApp
                          </a>
                        )}
                        {item.email && (
                          <a href={`mailto:${item.email}`} className="admin-contact-chip" style={{ background: '#ffffff', color: '#062C43' }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                              <polyline points="22,6 12,13 2,6" />
                            </svg>
                            Email
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => window.print()}
                          className="admin-contact-chip"
                          style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}
                          title="Print official candidate dossier"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="6 9 6 2 18 2 18 9" />
                            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                            <rect x="6" y="14" width="12" height="8" />
                          </svg>
                          Print Dossier
                        </button>
                      </div>
                    </div>

                    <div className="dossier-sections-stack">
                      {/* SECTION 1: Personal & Identification Profile */}
                      <div className="dossier-section-card">
                        <div className="dossier-section-title">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                          <span>Section 1: Personal Profile & Identification</span>
                        </div>
                        <div className="dossier-grid-3">
                          <div className="dossier-field">
                            <span className="dossier-field-label">Date of Birth / Gender</span>
                            <span className="dossier-field-val">{item.dob || '—'} • {item.gender || '—'}</span>
                          </div>
                          <div className="dossier-field">
                            <span className="dossier-field-label">Marital Status / Dependants</span>
                            <span className="dossier-field-val">{item.maritalStatus || 'Single'} • {item.dependants || 0} Dependant(s)</span>
                          </div>
                          <div className="dossier-field">
                            <span className="dossier-field-label">Nationality & State of Origin</span>
                            <span className="dossier-field-val">{item.nationality || 'Nigerian'} • {item.stateOfOrigin || '—'}</span>
                          </div>
                          <div className="dossier-field">
                            <span className="dossier-field-label">LGA of Origin</span>
                            <span className="dossier-field-val">{item.lga || '—'}</span>
                          </div>
                          <div className="dossier-field">
                            <span className="dossier-field-label">National Identity No (NIN)</span>
                            <span className="dossier-field-val highlight" style={{ letterSpacing: '0.05em' }}>{item.nin || 'Not Provided'}</span>
                          </div>
                          <div className="dossier-field" style={{ gridColumn: 'span 2' }}>
                            <span className="dossier-field-label">Residential Address</span>
                            <span className="dossier-field-val">{item.residentialAddress || '—'}</span>
                          </div>
                        </div>
                      </div>

                      {/* SECTION 2: Licensing & Professional Driving */}
                      <div className="dossier-section-card">
                        <div className="dossier-section-title">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                            <line x1="1" y1="10" x2="23" y2="10" />
                          </svg>
                          <span>Section 2: Professional Driving Credentials</span>
                        </div>
                        <div className="dossier-grid-3">
                          <div className="dossier-field">
                            <span className="dossier-field-label">Driver&apos;s License Number</span>
                            <span className="dossier-field-val highlight">{item.licenseNumber || '—'}</span>
                          </div>
                          <div className="dossier-field">
                            <span className="dossier-field-label">License Class</span>
                            <span className="dossier-field-val">Class {item.licenseClass || 'Commercial'}</span>
                          </div>
                          <div className="dossier-field">
                            <span className="dossier-field-label">License Validity Period</span>
                            <span className="dossier-field-val">
                              {item.licenseIssueDate || '—'} to {item.licenseExpiryDate || '—'}
                            </span>
                          </div>
                          <div className="dossier-field">
                            <span className="dossier-field-label">Commercial Experience</span>
                            <span className="dossier-field-val highlight">{item.yearsExperience || 'N/A'}</span>
                          </div>
                          <div className="dossier-field" style={{ gridColumn: 'span 2' }}>
                            <span className="dossier-field-label">Vehicles & Equipment Operated</span>
                            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.2rem' }}>
                              {typesList.length > 0 ? (
                                typesList.map((t, idx) => (
                                  <span key={idx} className="dossier-pill">{t}</span>
                                ))
                              ) : (
                                <span className="dossier-field-val">Commercial Trucks / Haulage</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* SECTION 3: Operations & Route Familiarity */}
                      <div className="dossier-section-card">
                        <div className="dossier-section-title">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                            <line x1="8" y1="2" x2="8" y2="18" />
                            <line x1="16" y1="6" x2="16" y2="22" />
                          </svg>
                          <span>Section 3: Route Knowledge & Past Operations</span>
                        </div>
                        <div className="dossier-grid-2">
                          <div className="dossier-field">
                            <span className="dossier-field-label">Familiar Port Harcourt & Rivers State Routes</span>
                            <span className="dossier-field-val">{item.familiarRoutes || 'Greater Port Harcourt routes'}</span>
                          </div>
                          <div className="dossier-field">
                            <span className="dossier-field-label">Available For Outside-State / Long Haul</span>
                            <span className="dossier-field-val highlight">{item.drivingOutsideState || 'No'}</span>
                          </div>
                          <div className="dossier-field">
                            <span className="dossier-field-label">Previous Company / Employer</span>
                            <span className="dossier-field-val">{item.previousCompany || '—'}</span>
                          </div>
                          <div className="dossier-field">
                            <span className="dossier-field-label">Previous Role & Duration</span>
                            <span className="dossier-field-val">{item.previousPosition || 'Driver'} • {item.yearsWorked || '—'}</span>
                          </div>
                        </div>
                      </div>

                      {/* SECTION 4: Safety & Traffic Incident Record */}
                      <div className="dossier-section-card">
                        <div className="dossier-section-title">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          </svg>
                          <span>Section 4: Safety Record & Compliance Audit</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          <div className={`dossier-alert-box ${hasAccident ? 'warning' : 'clean'}`}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
                              {hasAccident ? (
                                <>
                                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                  <line x1="12" y1="9" x2="12" y2="13" />
                                  <line x1="12" y1="17" x2="12.01" y2="17" />
                                </>
                              ) : (
                                <polyline points="20 6 9 17 4 12" />
                              )}
                            </svg>
                            <div>
                              <div style={{ fontWeight: 700 }}>
                                Accident History: {item.accidentHistory || 'No'}
                              </div>
                              {hasAccident && item.accidentDetails && (
                                <div style={{ marginTop: '0.25rem', fontSize: '0.825rem' }}>
                                  <strong>Incident Details:</strong> {item.accidentDetails}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className={`dossier-alert-box ${hasViolation ? 'warning' : 'clean'}`}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
                              {hasViolation ? (
                                <>
                                  <circle cx="12" cy="12" r="10" />
                                  <line x1="12" y1="8" x2="12" y2="12" />
                                  <line x1="12" y1="16" x2="12.01" y2="16" />
                                </>
                              ) : (
                                <polyline points="20 6 9 17 4 12" />
                              )}
                            </svg>
                            <div>
                              <div style={{ fontWeight: 700 }}>
                                FRSC Traffic Violations: {item.trafficViolation || 'No'}
                              </div>
                              {hasViolation && item.violationDetails && (
                                <div style={{ marginTop: '0.25rem', fontSize: '0.825rem' }}>
                                  <strong>Violation Details:</strong> {item.violationDetails}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* SECTION 5: Vehicle Ownership / Fleet */}
                      <div className="dossier-section-card">
                        <div className="dossier-section-title">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="1" y="3" width="15" height="13" />
                            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                            <circle cx="5.5" cy="18.5" r="2.5" />
                            <circle cx="18.5" cy="18.5" r="2.5" />
                          </svg>
                          <span>Section 5: Vehicle Ownership & Fleet Particulars</span>
                        </div>
                        {item.ownsVehicle === 'Yes' ? (
                          <div className="dossier-grid-3">
                            <div className="dossier-field">
                              <span className="dossier-field-label">Vehicle Ownership</span>
                              <span className="dossier-field-val highlight">Applicant Owned ({item.vehicleOwnerName || item.fullName})</span>
                            </div>
                            <div className="dossier-field">
                              <span className="dossier-field-label">Make & Model</span>
                              <span className="dossier-field-val">{item.vehicleMake || '—'} {item.vehicleModel || '—'} ({item.vehicleYear || '—'})</span>
                            </div>
                            <div className="dossier-field">
                              <span className="dossier-field-label">Plate / Reg Number</span>
                              <span className="dossier-field-val highlight">{item.plateNumber || '—'} / {item.vehicleRegNumber || '—'}</span>
                            </div>
                            <div className="dossier-field">
                              <span className="dossier-field-label">Vehicle Colour / Type</span>
                              <span className="dossier-field-val">{item.vehicleColour || '—'} • {item.vehicleType || 'Commercial'}</span>
                            </div>
                            <div className="dossier-field">
                              <span className="dossier-field-label">Insurance Policy Number</span>
                              <span className="dossier-field-val">{item.insurancePolicyNumber || '—'}</span>
                            </div>
                            <div className="dossier-field">
                              <span className="dossier-field-label">Insurance Expiry Date</span>
                              <span className="dossier-field-val">{item.insuranceExpiryDate || '—'}</span>
                            </div>
                          </div>
                        ) : (
                          <div style={{ padding: '0.5rem 0', color: 'var(--color-text-subtle)', fontSize: '0.875rem' }}>
                            Candidate does not own a commercial vehicle. Applying for assignment to <strong>EcoBlue Company Fleet</strong> (Compactor Trucks, Skip Haulers, or Sanitation Sweepers).
                          </div>
                        )}
                      </div>

                      {/* SECTION 6: Employment Terms & Availability */}
                      <div className="dossier-section-card">
                        <div className="dossier-section-title">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                          </svg>
                          <span>Section 6: Employment Preferences & Availability</span>
                        </div>
                        <div className="dossier-grid-3">
                          <div className="dossier-field">
                            <span className="dossier-field-label">Position Applied</span>
                            <span className="dossier-field-val highlight">{item.positionApplied || 'Fleet Driver'}</span>
                          </div>
                          <div className="dossier-field">
                            <span className="dossier-field-label">Employment Type</span>
                            <span className="dossier-field-val">{item.employmentType || 'Full-time'}</span>
                          </div>
                          <div className="dossier-field">
                            <span className="dossier-field-label">Preferred Location</span>
                            <span className="dossier-field-val">{item.preferredLocation || 'Greater Port Harcourt'}</span>
                          </div>
                          <div className="dossier-field">
                            <span className="dossier-field-label">Shift Hours Preference</span>
                            <span className="dossier-field-val">{item.preferredHours || 'Standard Day Shifts'}</span>
                          </div>
                          <div className="dossier-field">
                            <span className="dossier-field-label">Expected Salary</span>
                            <span className="dossier-field-val highlight">{item.expectedSalary || 'Negotiable'}</span>
                          </div>
                          <div className="dossier-field">
                            <span className="dossier-field-label">Available Start Date</span>
                            <span className="dossier-field-val">{item.availableStartDate || 'Immediate'}</span>
                          </div>
                          {item.prevEmployerName && (
                            <div className="dossier-field" style={{ gridColumn: 'span 3' }}>
                              <span className="dossier-field-label">Previous Employer & Leaving Reason</span>
                              <span className="dossier-field-val">
                                {item.prevEmployerName} {item.prevEmployerPhone ? `(${item.prevEmployerPhone})` : ''} — <em>{item.reasonForLeaving || 'Career progression'}</em>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* SECTION 7: Next of Kin & Guarantor */}
                      <div className="dossier-section-card">
                        <div className="dossier-section-title">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                          <span>Section 7: Emergency Contact & Verified Guarantor</span>
                        </div>
                        <div className="dossier-grid-2">
                          <div style={{ background: '#F8FAFC', padding: '0.85rem', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                            <div style={{ fontWeight: 700, fontSize: '0.825rem', color: 'var(--color-primary-navy)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                              Emergency Next of Kin
                            </div>
                            <div style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
                              <div><strong>Name:</strong> {item.emergencyName || '—'}</div>
                              <div><strong>Relationship:</strong> {item.emergencyRelationship || '—'}</div>
                              <div><strong>Phone:</strong> {item.emergencyPhone || '—'} {item.emergencyAltPhone ? `• ${item.emergencyAltPhone}` : ''}</div>
                              <div><strong>Address:</strong> {item.emergencyAddress || '—'}</div>
                            </div>
                          </div>

                          <div style={{ background: '#F8FAFC', padding: '0.85rem', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                              <span style={{ fontWeight: 700, fontSize: '0.825rem', color: 'var(--color-primary-navy)', textTransform: 'uppercase' }}>
                                Legal Guarantor
                              </span>
                              <span style={{ fontSize: '0.725rem', fontWeight: 700, color: '#16A34A', background: '#DCFCE7', padding: '1px 6px', borderRadius: '4px' }}>
                                Attested
                              </span>
                            </div>
                            <div style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
                              <div><strong>Name:</strong> {item.guarantorName || '—'} ({item.guarantorRelationship || 'Guarantor'})</div>
                              <div><strong>Occupation/Employer:</strong> {item.guarantorOccupation || '—'} • {item.guarantorEmployer || '—'}</div>
                              <div><strong>Contact:</strong> {item.guarantorPhone || '—'} • {item.guarantorEmail || '—'}</div>
                              <div><strong>Address:</strong> {item.guarantorAddress || '—'}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* SECTION 8: Submitted Documents */}
                      <div className="dossier-section-card">
                        <div className="dossier-section-title">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                          </svg>
                          <span>Section 8: Attached Credentials & Compliance Files</span>
                        </div>
                        <div className="dossier-docs-list">
                          <div className={`dossier-doc-chip ${item.passportPhotoFile ? 'uploaded' : ''}`}>
                            <div className="dossier-doc-icon">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/></svg>
                            </div>
                            <div style={{ overflow: 'hidden' }}>
                              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>Passport Photograph</div>
                              <div style={{ fontSize: '0.825rem', fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                {item.passportPhotoFile || 'Pending Physical Copy'}
                              </div>
                            </div>
                          </div>

                          <div className={`dossier-doc-chip ${item.driverLicenseFile ? 'uploaded' : ''}`}>
                            <div className="dossier-doc-icon">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                            </div>
                            <div style={{ overflow: 'hidden' }}>
                              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>Driver&apos;s License Scan</div>
                              <div style={{ fontSize: '0.825rem', fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                {item.driverLicenseFile || 'Pending Verification'}
                              </div>
                            </div>
                          </div>

                          <div className={`dossier-doc-chip ${item.nationalIdFile ? 'uploaded' : ''}`}>
                            <div className="dossier-doc-icon">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>
                            </div>
                            <div style={{ overflow: 'hidden' }}>
                              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>National ID (NIN Slip)</div>
                              <div style={{ fontSize: '0.825rem', fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                {item.nationalIdFile || 'Pending Verification'}
                              </div>
                            </div>
                          </div>

                          <div className={`dossier-doc-chip ${item.roadworthinessCertFile ? 'uploaded' : ''}`}>
                            <div className="dossier-doc-icon">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                            </div>
                            <div style={{ overflow: 'hidden' }}>
                              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>Roadworthiness Cert</div>
                              <div style={{ fontSize: '0.825rem', fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                {item.roadworthinessCertFile || 'N/A (Fleet Vehicle)'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Compiled Transcript */}
                      {item.fullDossier && (
                        <div className="dossier-section-card">
                          <div className="dossier-section-title">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="4 17 10 11 4 5" />
                              <line x1="12" y1="19" x2="20" y2="19" />
                            </svg>
                            <span>Dossier Transcript & Notes</span>
                          </div>
                          <div className="dossier-transcript">
                            {item.fullDossier}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}

              {/* Status & Actions Bar */}
              <div className="admin-detail-footer">
                <div className="admin-detail-status-section">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--color-primary-navy)' }}>
                      Quick Status:
                    </span>
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                      {getAvailableStatuses(detailModal.type).map(st => {
                        const isCurrent = modalCurrentStatus === st;
                        return (
                          <button
                            key={st}
                            type="button"
                            className={`status-pill-btn ${isCurrent ? getStatusBadgeClass(st) : ''}`}
                            onClick={() => {
                              setModalCurrentStatus(st);
                              handleUpdateStatus(detailModal.type, detailModal.record.id, st);
                            }}
                            disabled={isSavingStatus}
                            title={`Click to set status to ${st}`}
                            style={{
                              border: isCurrent ? '2px solid currentColor' : '1px solid #CBD5E1',
                              background: isCurrent ? undefined : '#FFFFFF',
                              color: isCurrent ? undefined : '#475569',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              padding: '0.35rem 0.75rem',
                              fontSize: '0.8rem'
                            }}
                          >
                            {isCurrent && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }} />}
                            {st}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="admin-detail-status-group">
                    <select
                      id="updateStatusSelect"
                      className="form-select"
                      style={{ display: 'inline-block', width: 'auto', padding: '0.45rem 0.85rem', cursor: 'pointer' }}
                      value={modalCurrentStatus}
                      onChange={e => setModalCurrentStatus(e.target.value as LeadStatus)}
                    >
                      {getAvailableStatuses(detailModal.type).map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="btn btn-primary"
                      id="saveStatusChangeBtn"
                      style={{
                        cursor: isSavingStatus ? 'wait' : 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        padding: '0.5rem 1.25rem',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        backgroundColor: savedSuccess ? '#10B981' : 'var(--color-primary-green)',
                        borderColor: savedSuccess ? '#10B981' : 'var(--color-primary-green)',
                        color: '#ffffff',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)'
                      }}
                      disabled={isSavingStatus}
                      onClick={() => handleUpdateStatus(detailModal.type, detailModal.record.id, modalCurrentStatus)}
                    >
                      {isSavingStatus ? (
                        <>
                          <svg className="spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                          </svg>
                          <span>Saving...</span>
                        </>
                      ) : savedSuccess ? (
                        <>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>✓ Saved!</span>
                        </>
                      ) : (
                        <>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                            <polyline points="17 21 17 13 7 13 7 3" />
                            <polyline points="7 3 7 8 15 8" />
                          </svg>
                          <span>Save Status</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  className="btn btn-outline"
                  style={{ color: '#DC2626', borderColor: 'rgba(220,38,38,0.3)' }}
                  id="modalDeleteBtn"
                  onClick={() => {
                    const rec = detailModal.record;
                    setDeletePending({
                      type: detailModal.type,
                      id: rec.id,
                      name: `${rec.name || rec.fullName || rec.organization || rec.id} (${rec.id})`
                    });
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                  Delete Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletePending && (
        <div
          className="modal-overlay active"
          id="adminDeleteModal"
          style={{ display: 'flex' }}
          onClick={e => {
            if (e.target === e.currentTarget) setDeletePending(null);
          }}
        >
          <div className="modal-card" style={{ maxWidth: '440px', textAlign: 'center' }}>
            <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-navy)', marginBottom: '0.5rem' }}>Delete Record?</h3>
            <p id="adminDeletePrompt" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Are you sure you want to permanently delete {deletePending.name || deletePending.id}? This record will be removed from system storage.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                className="btn btn-outline"
                id="cancelDeleteBtn"
                style={{ minWidth: '110px' }}
                onClick={() => setDeletePending(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                id="confirmDeleteBtn"
                style={{ background: '#DC2626', borderColor: '#DC2626', minWidth: '110px' }}
                onClick={executeDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: '#F4F8F6'
          }}
        >
          <div className="spinner" />
        </div>
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
}
