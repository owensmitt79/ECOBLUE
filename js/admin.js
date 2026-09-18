/**
 * EcoBlue Environmental Services Ltd. - Admin Dashboard Logic
 * Responsive Operations & Dispatch Management Console
 */

document.addEventListener('DOMContentLoaded', () => {
  // Check auth
  const loginOverlay = document.getElementById('adminLoginOverlay');
  const loginForm = document.getElementById('adminLoginForm');
  const logoutBtn = document.getElementById('adminLogoutBtn');

  function checkAuth() {
    const isAuth = sessionStorage.getItem('ecoblue_admin_logged');
    if (!isAuth && loginOverlay) {
      loginOverlay.style.display = 'flex';
    } else if (loginOverlay) {
      loginOverlay.style.display = 'none';
      renderDashboard();
    }
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('adminEmail').value.trim();
      const pass = document.getElementById('adminPass').value;

      // Default demo credentials
      if (email === 'admin@ecoblue.com' && pass === 'ecoblue2026') {
        sessionStorage.setItem('ecoblue_admin_logged', 'true');
        loginOverlay.style.display = 'none';
        renderDashboard();
        if (window.showToast) window.showToast('Welcome', 'Logged in to EcoBlue Admin Portal', 'info');
      } else {
        alert('Invalid credentials. Use admin@ecoblue.com / ecoblue2026');
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('ecoblue_admin_logged');
      window.location.reload();
    });
  }

  // Mobile Sidebar Toggle
  const adminSidebar = document.getElementById('adminSidebar');
  const adminSidebarBackdrop = document.getElementById('adminSidebarBackdrop');
  const openAdminNavBtn = document.getElementById('openAdminNav');
  const closeAdminNavBtn = document.getElementById('closeAdminNav');

  function openSidebar() {
    if (adminSidebar) adminSidebar.classList.add('open');
    if (adminSidebarBackdrop) adminSidebarBackdrop.classList.add('active');
    document.body.style.overflow = window.innerWidth <= 992 ? 'hidden' : '';
  }

  function closeSidebar() {
    if (adminSidebar) adminSidebar.classList.remove('open');
    if (adminSidebarBackdrop) adminSidebarBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (openAdminNavBtn) openAdminNavBtn.addEventListener('click', openSidebar);
  if (closeAdminNavBtn) closeAdminNavBtn.addEventListener('click', closeSidebar);
  if (adminSidebarBackdrop) adminSidebarBackdrop.addEventListener('click', closeSidebar);

  // Tab Switching
  const navItems = document.querySelectorAll('.admin-nav-item');
  const panels = document.querySelectorAll('.admin-tab-panel');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(i => i.classList.remove('active'));
      panels.forEach(p => p.style.display = 'none');

      item.classList.add('active');
      const target = item.getAttribute('data-tab');
      const panel = document.getElementById(target);
      if (panel) panel.style.display = 'block';

      // Auto close sidebar on mobile
      if (window.innerWidth <= 992) {
        closeSidebar();
      }
    });
  });

  // Helper for WhatsApp URLs (supports Nigerian phone formats: 080..., 234..., +234...)
  function getWhatsAppUrl(phone, name, refId) {
    if (!phone) return null;
    let clean = phone.replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) {
      clean = '234' + clean.slice(1);
    } else if (clean.length === 10) {
      clean = '234' + clean;
    }
    const msg = encodeURIComponent(`Hello ${name || ''}, this is EcoBlue Environmental Services Ltd. regarding your submission (${refId || ''}).`);
    return `https://wa.me/${clean}?text=${msg}`;
  }

  // Delete Confirmation Modal Logic
  const deleteModal = document.getElementById('adminDeleteModal');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  const deletePromptEl = document.getElementById('adminDeletePrompt');
  let pendingDelete = null; // { type, id, name }

  function promptDelete(type, id, name) {
    pendingDelete = { type, id, name };
    if (deletePromptEl) {
      deletePromptEl.textContent = `Are you sure you want to permanently delete ${name || id}? This record will be removed from system storage.`;
    }
    if (deleteModal) deleteModal.style.display = 'flex';
  }

  if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener('click', () => {
      pendingDelete = null;
      if (deleteModal) deleteModal.style.display = 'none';
    });
  }

  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', () => {
      if (!pendingDelete || !window.StorageService) return;
      const { type, id } = pendingDelete;
      if (type === 'quote' && window.StorageService.deleteQuote) window.StorageService.deleteQuote(id);
      else if (type === 'contact' && window.StorageService.deleteContact) window.StorageService.deleteContact(id);
      else if (type === 'partner' && window.StorageService.deletePartnership) window.StorageService.deletePartnership(id);
      else if (type === 'career' && window.StorageService.deleteCareer) window.StorageService.deleteCareer(id);
      else if (type === 'consultant' && window.StorageService.deleteConsultant) window.StorageService.deleteConsultant(id);

      if (deleteModal) deleteModal.style.display = 'none';
      if (detailModal) detailModal.style.display = 'none';
      pendingDelete = null;
      renderDashboard();
      if (window.showToast) window.showToast('Record Deleted', `Record ${id} has been permanently removed.`, 'info');
    });
  }

  // Render Dashboard Data
  function renderDashboard() {
    if (!window.StorageService) return;

    const quotes = window.StorageService.getQuotes();
    const contacts = window.StorageService.getContacts();
    const partners = window.StorageService.getPartnerships();
    const careers = window.StorageService.getCareers ? window.StorageService.getCareers() : [];
    const consultants = window.StorageService.getConsultants ? window.StorageService.getConsultants() : [];

    // Stats
    const totalRequestsEl = document.getElementById('statTotalRequests');
    const pendingQuotesEl = document.getElementById('statPendingQuotes');
    const totalPartnersEl = document.getElementById('statTotalPartners');
    const totalInquiriesEl = document.getElementById('statTotalInquiries');
    const totalCareersEl = document.getElementById('statTotalCareers');
    const totalConsultantsEl = document.getElementById('statTotalConsultants');

    if (totalRequestsEl) totalRequestsEl.textContent = quotes.length;
    if (pendingQuotesEl) pendingQuotesEl.textContent = quotes.filter(q => q.status === 'Pending').length;
    if (totalPartnersEl) totalPartnersEl.textContent = partners.length;
    if (totalInquiriesEl) totalInquiriesEl.textContent = contacts.length;
    if (totalCareersEl) totalCareersEl.textContent = careers.length;
    if (totalConsultantsEl) totalConsultantsEl.textContent = consultants.length;

    renderQuotesTable(quotes);
    renderInquiriesTable(contacts);
    renderPartnershipsTable(partners);
    renderCareersTable(careers);
    renderConsultantsTable(consultants);
  }

  // 1. Render Quotes Table
  function renderQuotesTable(quotes) {
    const tbody = document.getElementById('quotesTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (quotes.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:2.5rem; color:var(--color-text-subtle);">No quote requests found.</td></tr>';
      return;
    }

    quotes.forEach(q => {
      const tr = document.createElement('tr');
      const dateStr = new Date(q.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      const badgeClass = q.status === 'Pending' ? 'badge-pending' : (q.status === 'Reviewed' ? 'badge-reviewed' : 'badge-completed');

      tr.innerHTML = `
        <td style="font-weight:700; color:var(--color-primary-navy);">${q.id}</td>
        <td>
          <div style="font-weight:600;">${escapeHtml(q.name)}</div>
          <div style="font-size:0.8rem; color:var(--color-text-subtle);">${escapeHtml(q.organization || 'Individual')}</div>
        </td>
        <td>
          <div>${escapeHtml(q.phone)}</div>
          <div style="font-size:0.8rem; color:var(--color-text-subtle);">${escapeHtml(q.email)}</div>
        </td>
        <td>
          <span style="font-weight:500;">${escapeHtml(q.service)}</span>
          <div style="font-size:0.75rem; color:var(--color-text-subtle);">${escapeHtml(q.location || 'Rivers State')}</div>
        </td>
        <td><span class="badge ${badgeClass}">${q.status}</span></td>
        <td style="font-size:0.825rem; color:var(--color-text-subtle);">${dateStr}</td>
        <td class="admin-actions-cell">
          <div class="admin-action-btn-group">
            <button class="admin-action-btn view-btn view-quote-btn" data-id="${q.id}" title="View & Manage Request">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              <span>View</span>
            </button>
            <button class="admin-action-btn delete-btn delete-quote-btn" data-id="${q.id}" data-name="${escapeHtml(q.name)} (${q.id})" title="Delete Record">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Attach Action handlers
    tbody.querySelectorAll('.view-quote-btn').forEach(btn => {
      btn.addEventListener('click', () => openDetailModal('quote', btn.getAttribute('data-id')));
    });
    tbody.querySelectorAll('.delete-quote-btn').forEach(btn => {
      btn.addEventListener('click', () => promptDelete('quote', btn.getAttribute('data-id'), btn.getAttribute('data-name')));
    });
  }

  // 2. Render Inquiries Table
  function renderInquiriesTable(contacts) {
    const tbody = document.getElementById('inquiriesTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (contacts.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:2.5rem; color:var(--color-text-subtle);">No contact inquiries found.</td></tr>';
      return;
    }

    contacts.forEach(c => {
      const tr = document.createElement('tr');
      const dateStr = new Date(c.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      const badgeClass = c.status === 'Pending' ? 'badge-pending' : (c.status === 'Reviewed' ? 'badge-reviewed' : 'badge-completed');

      tr.innerHTML = `
        <td style="font-weight:700; color:var(--color-primary-navy);">${c.id}</td>
        <td>
          <div style="font-weight:600;">${escapeHtml(c.name)}</div>
          <div style="font-size:0.8rem; color:var(--color-text-subtle);">${escapeHtml(c.organization || 'General Public')}</div>
        </td>
        <td>
          <div>${escapeHtml(c.phone)}</div>
          <div style="font-size:0.8rem; color:var(--color-text-subtle);">${escapeHtml(c.email)}</div>
        </td>
        <td><span style="font-weight:500;">${escapeHtml(c.service || 'General Inquiry')}</span></td>
        <td><span class="badge ${badgeClass}">${c.status}</span></td>
        <td style="font-size:0.825rem; color:var(--color-text-subtle);">${dateStr}</td>
        <td class="admin-actions-cell">
          <div class="admin-action-btn-group">
            <button class="admin-action-btn view-btn view-contact-btn" data-id="${c.id}" title="View & Manage Inquiry">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              <span>View</span>
            </button>
            <button class="admin-action-btn delete-btn delete-contact-btn" data-id="${c.id}" data-name="${escapeHtml(c.name)} (${c.id})" title="Delete Record">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.view-contact-btn').forEach(btn => {
      btn.addEventListener('click', () => openDetailModal('contact', btn.getAttribute('data-id')));
    });
    tbody.querySelectorAll('.delete-contact-btn').forEach(btn => {
      btn.addEventListener('click', () => promptDelete('contact', btn.getAttribute('data-id'), btn.getAttribute('data-name')));
    });
  }

  // 3. Render Partnerships Table
  function renderPartnershipsTable(partners) {
    const tbody = document.getElementById('partnersTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (partners.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:2.5rem; color:var(--color-text-subtle);">No partnership proposals found.</td></tr>';
      return;
    }

    partners.forEach(p => {
      const tr = document.createElement('tr');
      const dateStr = new Date(p.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      const badgeClass = p.status === 'Pending' ? 'badge-pending' : (p.status === 'Reviewed' ? 'badge-reviewed' : 'badge-completed');

      tr.innerHTML = `
        <td style="font-weight:700; color:var(--color-primary-navy);">${p.id}</td>
        <td>
          <div style="font-weight:600;">${escapeHtml(p.organization)}</div>
          <div style="font-size:0.8rem; color:var(--color-text-subtle);">${escapeHtml(p.name)}</div>
        </td>
        <td>
          <div>${escapeHtml(p.phone)}</div>
          <div style="font-size:0.8rem; color:var(--color-text-subtle);">${escapeHtml(p.email)}</div>
        </td>
        <td><span style="font-weight:600; color:var(--color-primary-green);">${escapeHtml(p.partnershipType)}</span></td>
        <td><span class="badge ${badgeClass}">${p.status}</span></td>
        <td style="font-size:0.825rem; color:var(--color-text-subtle);">${dateStr}</td>
        <td class="admin-actions-cell">
          <div class="admin-action-btn-group">
            <button class="admin-action-btn view-btn view-partner-btn" data-id="${p.id}" title="View & Manage Proposal">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              <span>View</span>
            </button>
            <button class="admin-action-btn delete-btn delete-partner-btn" data-id="${p.id}" data-name="${escapeHtml(p.organization)} (${p.id})" title="Delete Record">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.view-partner-btn').forEach(btn => {
      btn.addEventListener('click', () => openDetailModal('partner', btn.getAttribute('data-id')));
    });
    tbody.querySelectorAll('.delete-partner-btn').forEach(btn => {
      btn.addEventListener('click', () => promptDelete('partner', btn.getAttribute('data-id'), btn.getAttribute('data-name')));
    });
  }

  // 4. Render Careers Table
  function renderCareersTable(careers) {
    const tbody = document.getElementById('careersTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (!careers || careers.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:2.5rem; color:var(--color-text-subtle);">No career applications recorded yet.</td></tr>';
      return;
    }

    careers.forEach(a => {
      const tr = document.createElement('tr');
      const dateStr = new Date(a.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      let badgeClass = 'badge-pending';
      if (a.status === 'Reviewed') badgeClass = 'badge-reviewed';
      else if (a.status === 'Shortlisted' || a.status === 'Interviewed' || a.status === 'Hired') badgeClass = 'badge-completed';
      else if (a.status === 'Rejected') badgeClass = 'badge-pending';

      tr.innerHTML = `
        <td style="font-weight:700; color:var(--color-primary-navy);">${a.id}</td>
        <td>
          <div style="font-weight:600;">${escapeHtml(a.name)}</div>
          <div style="font-size:0.8rem; color:var(--color-text-subtle);">${escapeHtml(a.email)} • ${escapeHtml(a.phone)}</div>
        </td>
        <td>
          <div style="font-weight:600; color:var(--color-primary-navy);">${escapeHtml(a.position)}</div>
        </td>
        <td>
          <div>${escapeHtml(a.experience || 'Experienced')}</div>
          <div style="font-size:0.75rem; color:var(--color-text-subtle);">${escapeHtml(a.location || 'Rivers State')}</div>
        </td>
        <td><span class="badge ${badgeClass}">${a.status}</span></td>
        <td style="font-size:0.825rem; color:var(--color-text-subtle);">${dateStr}</td>
        <td class="admin-actions-cell">
          <div class="admin-action-btn-group">
            <button class="admin-action-btn view-btn view-career-btn" data-id="${a.id}" title="Review Candidate Dossier">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              <span>Review</span>
            </button>
            <button class="admin-action-btn delete-btn delete-career-btn" data-id="${a.id}" data-name="${escapeHtml(a.name)} (${a.id})" title="Delete Application">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.view-career-btn').forEach(btn => {
      btn.addEventListener('click', () => openDetailModal('career', btn.getAttribute('data-id')));
    });
    tbody.querySelectorAll('.delete-career-btn').forEach(btn => {
      btn.addEventListener('click', () => promptDelete('career', btn.getAttribute('data-id'), btn.getAttribute('data-name')));
    });
  }

  // 5. Render Consultants Table
  function renderConsultantsTable(consultants) {
    const tbody = document.getElementById('consultantsTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (!consultants || consultants.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:2.5rem; color:var(--color-text-subtle);">No registered consultants found.</td></tr>';
      return;
    }

    consultants.forEach(c => {
      const tr = document.createElement('tr');
      const dateStr = new Date(c.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      let badgeClass = 'badge-pending';
      if (c.status === 'Reviewed') badgeClass = 'badge-reviewed';
      else if (c.status === 'Empanelled' || c.status === 'Active Project') badgeClass = 'badge-completed';

      tr.innerHTML = `
        <td style="font-weight:700; color:var(--color-primary-navy);">${c.id}</td>
        <td>
          <div style="font-weight:600;">${escapeHtml(c.name)}</div>
          <div style="font-size:0.8rem; color:var(--color-text-subtle);">${escapeHtml(c.firm || 'Independent')} • ${escapeHtml(c.phone)}</div>
        </td>
        <td>
          <div style="font-weight:600; color:var(--color-primary-green);">${escapeHtml(c.discipline || 'Consultant')}</div>
          <div style="font-size:0.75rem; color:var(--color-text-subtle);">${escapeHtml(c.accreditations || 'Accredited')}</div>
        </td>
        <td>
          <div>${escapeHtml(c.experience || '10+ Years')}</div>
          <div style="font-size:0.75rem; color:var(--color-text-subtle);">${escapeHtml(c.location || 'Rivers State')}</div>
        </td>
        <td><span class="badge ${badgeClass}">${c.status}</span></td>
        <td style="font-size:0.825rem; color:var(--color-text-subtle);">${dateStr}</td>
        <td class="admin-actions-cell">
          <div class="admin-action-btn-group">
            <button class="admin-action-btn view-btn view-consultant-btn" data-id="${c.id}" title="Review Consultant Profile">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              <span>Review</span>
            </button>
            <button class="admin-action-btn delete-btn delete-consultant-btn" data-id="${c.id}" data-name="${escapeHtml(c.name)} (${c.id})" title="Delete Record">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.view-consultant-btn').forEach(btn => {
      btn.addEventListener('click', () => openDetailModal('consultant', btn.getAttribute('data-id')));
    });
    tbody.querySelectorAll('.delete-consultant-btn').forEach(btn => {
      btn.addEventListener('click', () => promptDelete('consultant', btn.getAttribute('data-id'), btn.getAttribute('data-name')));
    });
  }

  // Search & Filtering: Quotes
  const quoteSearch = document.getElementById('quoteSearchInput');
  const quoteStatusFilter = document.getElementById('quoteStatusFilter');

  function applyQuoteFilters() {
    if (!window.StorageService) return;
    const query = (quoteSearch?.value || '').toLowerCase();
    const status = quoteStatusFilter?.value || 'all';

    let filtered = window.StorageService.getQuotes();
    if (status !== 'all') {
      filtered = filtered.filter(q => q.status.toLowerCase() === status.toLowerCase());
    }
    if (query) {
      filtered = filtered.filter(q => 
        q.id.toLowerCase().includes(query) ||
        (q.name && q.name.toLowerCase().includes(query)) ||
        (q.organization && q.organization.toLowerCase().includes(query)) ||
        (q.location && q.location.toLowerCase().includes(query)) ||
        (q.service && q.service.toLowerCase().includes(query))
      );
    }
    renderQuotesTable(filtered);
  }

  quoteSearch?.addEventListener('input', applyQuoteFilters);
  quoteStatusFilter?.addEventListener('change', applyQuoteFilters);

  // Search & Filtering: Careers
  const careerSearch = document.getElementById('careerSearchInput');
  const careerStatusFilter = document.getElementById('careerStatusFilter');

  function applyCareerFilters() {
    if (!window.StorageService || !window.StorageService.getCareers) return;
    const query = (careerSearch?.value || '').toLowerCase();
    const status = careerStatusFilter?.value || 'all';

    let filtered = window.StorageService.getCareers();
    if (status !== 'all') {
      filtered = filtered.filter(a => a.status.toLowerCase() === status.toLowerCase());
    }
    if (query) {
      filtered = filtered.filter(a =>
        a.id.toLowerCase().includes(query) ||
        (a.name && a.name.toLowerCase().includes(query)) ||
        (a.position && a.position.toLowerCase().includes(query)) ||
        (a.phone && a.phone.toLowerCase().includes(query)) ||
        (a.location && a.location.toLowerCase().includes(query))
      );
    }
    renderCareersTable(filtered);
  }

  careerSearch?.addEventListener('input', applyCareerFilters);
  careerStatusFilter?.addEventListener('change', applyCareerFilters);

  // Search & Filtering: Consultants
  const consultantSearch = document.getElementById('consultantSearchInput');
  const consultantStatusFilter = document.getElementById('consultantStatusFilter');

  function applyConsultantFilters() {
    if (!window.StorageService || !window.StorageService.getConsultants) return;
    const query = (consultantSearch?.value || '').toLowerCase();
    const status = consultantStatusFilter?.value || 'all';

    let filtered = window.StorageService.getConsultants();
    if (status !== 'all') {
      filtered = filtered.filter(c => c.status.toLowerCase() === status.toLowerCase());
    }
    if (query) {
      filtered = filtered.filter(c =>
        c.id.toLowerCase().includes(query) ||
        (c.name && c.name.toLowerCase().includes(query)) ||
        (c.discipline && c.discipline.toLowerCase().includes(query)) ||
        (c.firm && c.firm.toLowerCase().includes(query)) ||
        (c.location && c.location.toLowerCase().includes(query))
      );
    }
    renderConsultantsTable(filtered);
  }

  consultantSearch?.addEventListener('input', applyConsultantFilters);
  consultantStatusFilter?.addEventListener('change', applyConsultantFilters);

  // CSV Export
  const exportQuotesBtn = document.getElementById('exportQuotesBtn');
  if (exportQuotesBtn) {
    exportQuotesBtn.addEventListener('click', () => {
      const quotes = window.StorageService.getQuotes();
      if (!quotes.length) return alert('No records to export');

      let csv = 'ID,Name,Organization,Email,Phone,Location,ClientType,Service,Date,Status\n';
      quotes.forEach(q => {
        csv += `"${q.id}","${q.name}","${q.organization}","${q.email}","${q.phone}","${q.location}","${q.clientType}","${q.service}","${q.createdAt}","${q.status}"\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ecoblue_quotes_${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  // Detail View Modal Logic
  const detailModal = document.getElementById('adminDetailModal');
  const closeDetailBtn = document.getElementById('closeDetailModalBtn');
  const detailBody = document.getElementById('adminDetailBody');
  const detailTitle = document.getElementById('adminDetailTitle');
  const detailBadge = document.getElementById('adminDetailBadge');

  if (closeDetailBtn) {
    closeDetailBtn.addEventListener('click', () => {
      if (detailModal) detailModal.style.display = 'none';
    });
  }

  // Close modal when clicking on overlay background
  if (detailModal) {
    detailModal.addEventListener('click', (e) => {
      if (e.target === detailModal) detailModal.style.display = 'none';
    });
  }

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (detailModal) detailModal.style.display = 'none';
      if (deleteModal) deleteModal.style.display = 'none';
    }
  });

  function openDetailModal(type, id) {
    if (!detailModal || !detailBody || !window.StorageService) return;

    let item, title, html;
    let badgeClass = 'badge-pending';

    if (type === 'quote') {
      item = window.StorageService.getQuotes().find(q => q.id === id);
      if (!item) return;
      title = `Quote Request — ${item.id}`;
      badgeClass = item.status === 'Pending' ? 'badge-pending' : (item.status === 'Reviewed' ? 'badge-reviewed' : 'badge-completed');
      const waUrl = getWhatsAppUrl(item.phone, item.name, item.id);

      html = `
        <div class="admin-detail-grid">
          <div class="admin-detail-card">
            <div class="admin-detail-card-label">Client Details</div>
            <div class="admin-detail-card-val">${escapeHtml(item.name)}</div>
            <div style="font-size:0.85rem; color:var(--color-text-subtle); margin-top:0.25rem;">${escapeHtml(item.organization || 'Private Individual')}</div>
            <div class="admin-contact-chips">
              <a href="tel:${escapeHtml(item.phone)}" class="admin-contact-chip">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                Call (${escapeHtml(item.phone)})
              </a>
              ${waUrl ? `
              <a href="${waUrl}" target="_blank" class="admin-contact-chip whatsapp">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/></svg>
                WhatsApp
              </a>` : ''}
              <a href="mailto:${escapeHtml(item.email)}" class="admin-contact-chip">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                Email
              </a>
            </div>
          </div>

          <div class="admin-detail-card">
            <div class="admin-detail-card-label">Operational Parameters</div>
            <div style="margin-bottom:0.4rem;">
              <span style="font-size:0.75rem; color:var(--color-text-subtle);">Service:</span>
              <div style="font-weight:700; color:var(--color-primary-green);">${escapeHtml(item.service)}</div>
            </div>
            <div style="margin-bottom:0.4rem;">
              <span style="font-size:0.75rem; color:var(--color-text-subtle);">Location Corridor:</span>
              <div style="font-weight:600;">${escapeHtml(item.location || 'Rivers State')}</div>
            </div>
            <div>
              <span style="font-size:0.75rem; color:var(--color-text-subtle);">Client Sector:</span>
              <div style="font-weight:500;">${escapeHtml(item.clientType || 'General Client')}</div>
            </div>
          </div>
        </div>

        <div class="admin-detail-box">
          <div class="admin-detail-box-title">Waste Requirement Specification</div>
          <p class="admin-detail-box-text">${escapeHtml(item.wasteRequirement || 'No additional scope specified.')}</p>
          ${item.notes ? `<div style="margin-top:0.75rem; padding-top:0.75rem; border-top:1px dashed #e2e8f0; font-size:0.875rem; color:var(--color-text-muted);"><strong>Internal Notes:</strong> ${escapeHtml(item.notes)}</div>` : ''}
        </div>

        <div class="admin-detail-footer">
          <div class="admin-detail-status-group">
            <label style="font-size:0.85rem; font-weight:700; color:var(--color-primary-navy);">Update Status:</label>
            <select id="updateStatusSelect" class="form-select" style="display:inline-block; width:auto; padding:0.45rem 0.85rem;">
              <option value="Pending" ${item.status === 'Pending' ? 'selected' : ''}>Pending</option>
              <option value="Reviewed" ${item.status === 'Reviewed' ? 'selected' : ''}>Reviewed</option>
              <option value="Contacted" ${item.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
              <option value="Completed" ${item.status === 'Completed' ? 'selected' : ''}>Completed</option>
            </select>
            <button class="btn btn-navy" id="saveStatusChangeBtn">Save Status</button>
          </div>
          <button class="btn btn-outline" style="color:#DC2626; border-color:rgba(220,38,38,0.3);" id="modalDeleteBtn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            Delete Record
          </button>
        </div>
      `;
    } else if (type === 'contact') {
      item = window.StorageService.getContacts().find(c => c.id === id);
      if (!item) return;
      title = `Contact Message — ${item.id}`;
      badgeClass = item.status === 'Pending' ? 'badge-pending' : (item.status === 'Reviewed' ? 'badge-reviewed' : 'badge-completed');
      const waUrl = getWhatsAppUrl(item.phone, item.name, item.id);

      html = `
        <div class="admin-detail-grid">
          <div class="admin-detail-card">
            <div class="admin-detail-card-label">Sender Details</div>
            <div class="admin-detail-card-val">${escapeHtml(item.name)}</div>
            <div style="font-size:0.85rem; color:var(--color-text-subtle); margin-top:0.25rem;">${escapeHtml(item.organization || 'General Public')}</div>
            <div class="admin-contact-chips">
              <a href="tel:${escapeHtml(item.phone)}" class="admin-contact-chip">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                Call (${escapeHtml(item.phone)})
              </a>
              ${waUrl ? `
              <a href="${waUrl}" target="_blank" class="admin-contact-chip whatsapp">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/></svg>
                WhatsApp
              </a>` : ''}
              <a href="mailto:${escapeHtml(item.email)}" class="admin-contact-chip">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                Email
              </a>
            </div>
          </div>

          <div class="admin-detail-card">
            <div class="admin-detail-card-label">Subject & Classification</div>
            <div style="margin-bottom:0.4rem;">
              <span style="font-size:0.75rem; color:var(--color-text-subtle);">Service Category:</span>
              <div style="font-weight:700; color:var(--color-primary-navy);">${escapeHtml(item.service || 'General Inquiry')}</div>
            </div>
            <div>
              <span style="font-size:0.75rem; color:var(--color-text-subtle);">Received Date:</span>
              <div style="font-weight:600;">${new Date(item.createdAt).toLocaleString('en-GB')}</div>
            </div>
          </div>
        </div>

        <div class="admin-detail-box">
          <div class="admin-detail-box-title">Message Body</div>
          <p class="admin-detail-box-text">${escapeHtml(item.message || 'No message content provided.')}</p>
        </div>

        <div class="admin-detail-footer">
          <div class="admin-detail-status-group">
            <label style="font-size:0.85rem; font-weight:700; color:var(--color-primary-navy);">Update Status:</label>
            <select id="updateStatusSelect" class="form-select" style="display:inline-block; width:auto; padding:0.45rem 0.85rem;">
              <option value="Pending" ${item.status === 'Pending' ? 'selected' : ''}>Pending</option>
              <option value="Reviewed" ${item.status === 'Reviewed' ? 'selected' : ''}>Reviewed</option>
              <option value="Contacted" ${item.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
              <option value="Completed" ${item.status === 'Completed' ? 'selected' : ''}>Completed</option>
            </select>
            <button class="btn btn-navy" id="saveStatusChangeBtn">Save Status</button>
          </div>
          <button class="btn btn-outline" style="color:#DC2626; border-color:rgba(220,38,38,0.3);" id="modalDeleteBtn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            Delete Record
          </button>
        </div>
      `;
    } else if (type === 'partner') {
      item = window.StorageService.getPartnerships().find(p => p.id === id);
      if (!item) return;
      title = `Partnership Proposal — ${item.id}`;
      badgeClass = item.status === 'Pending' ? 'badge-pending' : (item.status === 'Reviewed' ? 'badge-reviewed' : 'badge-completed');
      const waUrl = getWhatsAppUrl(item.phone, item.name, item.id);

      html = `
        <div class="admin-detail-grid">
          <div class="admin-detail-card">
            <div class="admin-detail-card-label">Institutional Partner</div>
            <div class="admin-detail-card-val">${escapeHtml(item.organization)}</div>
            <div style="font-size:0.85rem; color:var(--color-text-subtle); margin-top:0.25rem;">Contact: ${escapeHtml(item.name)}</div>
            <div class="admin-contact-chips">
              <a href="tel:${escapeHtml(item.phone)}" class="admin-contact-chip">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                Call (${escapeHtml(item.phone)})
              </a>
              ${waUrl ? `
              <a href="${waUrl}" target="_blank" class="admin-contact-chip whatsapp">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/></svg>
                WhatsApp
              </a>` : ''}
              <a href="mailto:${escapeHtml(item.email)}" class="admin-contact-chip">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                Email
              </a>
            </div>
          </div>

          <div class="admin-detail-card">
            <div class="admin-detail-card-label">Partnership Track</div>
            <div style="margin-bottom:0.4rem;">
              <span style="font-size:0.75rem; color:var(--color-text-subtle);">Sector / Domain:</span>
              <div style="font-weight:700; color:var(--color-primary-green);">${escapeHtml(item.partnershipType)}</div>
            </div>
            <div>
              <span style="font-size:0.75rem; color:var(--color-text-subtle);">Proposal Timestamp:</span>
              <div style="font-weight:600;">${new Date(item.createdAt).toLocaleString('en-GB')}</div>
            </div>
          </div>
        </div>

        <div class="admin-detail-box">
          <div class="admin-detail-box-title">Proposal Description & Objectives</div>
          <p class="admin-detail-box-text">${escapeHtml(item.message || 'No additional proposal description provided.')}</p>
        </div>

        <div class="admin-detail-footer">
          <div class="admin-detail-status-group">
            <label style="font-size:0.85rem; font-weight:700; color:var(--color-primary-navy);">Update Status:</label>
            <select id="updateStatusSelect" class="form-select" style="display:inline-block; width:auto; padding:0.45rem 0.85rem;">
              <option value="Pending" ${item.status === 'Pending' ? 'selected' : ''}>Pending</option>
              <option value="Reviewed" ${item.status === 'Reviewed' ? 'selected' : ''}>Reviewed</option>
              <option value="Empanelled" ${item.status === 'Empanelled' ? 'selected' : ''}>Empanelled</option>
              <option value="Completed" ${item.status === 'Completed' ? 'selected' : ''}>Completed</option>
            </select>
            <button class="btn btn-navy" id="saveStatusChangeBtn">Save Status</button>
          </div>
          <button class="btn btn-outline" style="color:#DC2626; border-color:rgba(220,38,38,0.3);" id="modalDeleteBtn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            Delete Record
          </button>
        </div>
      `;
    } else if (type === 'career') {
      item = window.StorageService.getCareers().find(a => a.id === id);
      if (!item) return;
      title = `Candidate Dossier — ${item.id}`;
      if (item.status === 'Reviewed') badgeClass = 'badge-reviewed';
      else if (item.status === 'Shortlisted' || item.status === 'Interviewed' || item.status === 'Hired') badgeClass = 'badge-completed';
      const waUrl = getWhatsAppUrl(item.phone, item.name, item.id);

      html = `
        <div class="admin-detail-grid">
          <div class="admin-detail-card">
            <div class="admin-detail-card-label">Candidate Profile</div>
            <div class="admin-detail-card-val">${escapeHtml(item.name)}</div>
            <div style="font-weight:700; color:var(--color-primary-green); margin-top:0.25rem;">${escapeHtml(item.position)}</div>
            <div class="admin-contact-chips">
              <a href="tel:${escapeHtml(item.phone)}" class="admin-contact-chip">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                Call (${escapeHtml(item.phone)})
              </a>
              ${waUrl ? `
              <a href="${waUrl}" target="_blank" class="admin-contact-chip whatsapp">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/></svg>
                WhatsApp
              </a>` : ''}
              <a href="mailto:${escapeHtml(item.email)}" class="admin-contact-chip">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                Email
              </a>
            </div>
          </div>

          <div class="admin-detail-card">
            <div class="admin-detail-card-label">Qualifications & Experience</div>
            <div style="margin-bottom:0.4rem;">
              <span style="font-size:0.75rem; color:var(--color-text-subtle);">Years of Experience:</span>
              <div style="font-weight:600;">${escapeHtml(item.experience || 'Not specified')}</div>
            </div>
            <div style="margin-bottom:0.4rem;">
              <span style="font-size:0.75rem; color:var(--color-text-subtle);">Certification / Qualification:</span>
              <div style="font-weight:500;">${escapeHtml(item.qualification || item.education || 'Commercial / Operational Certificate')}</div>
            </div>
            <div>
              <span style="font-size:0.75rem; color:var(--color-text-subtle);">Base Location:</span>
              <div style="font-weight:500;">${escapeHtml(item.location || 'Rivers State')}</div>
            </div>
          </div>
        </div>

        <div class="admin-detail-box">
          <div class="admin-detail-box-title">Applicant Statement & Summary</div>
          <p class="admin-detail-box-text">${escapeHtml(item.coverLetter || item.notes || item.message || 'No additional statement provided.')}</p>
        </div>

        <div class="admin-detail-footer">
          <div class="admin-detail-status-group">
            <label style="font-size:0.85rem; font-weight:700; color:var(--color-primary-navy);">Application Status:</label>
            <select id="updateStatusSelect" class="form-select" style="display:inline-block; width:auto; padding:0.45rem 0.85rem;">
              <option value="Pending" ${item.status === 'Pending' ? 'selected' : ''}>Pending</option>
              <option value="Reviewed" ${item.status === 'Reviewed' ? 'selected' : ''}>Reviewed</option>
              <option value="Shortlisted" ${item.status === 'Shortlisted' ? 'selected' : ''}>Shortlisted</option>
              <option value="Interviewed" ${item.status === 'Interviewed' ? 'selected' : ''}>Interviewed</option>
              <option value="Hired" ${item.status === 'Hired' ? 'selected' : ''}>Hired</option>
              <option value="Rejected" ${item.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
            </select>
            <button class="btn btn-navy" id="saveStatusChangeBtn">Save Status</button>
          </div>
          <button class="btn btn-outline" style="color:#DC2626; border-color:rgba(220,38,38,0.3);" id="modalDeleteBtn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            Delete Record
          </button>
        </div>
      `;
    } else if (type === 'consultant') {
      item = window.StorageService.getConsultants().find(c => c.id === id);
      if (!item) return;
      title = `Consultant Dossier — ${item.id}`;
      if (item.status === 'Reviewed') badgeClass = 'badge-reviewed';
      else if (item.status === 'Empanelled' || item.status === 'Active Project') badgeClass = 'badge-completed';
      const waUrl = getWhatsAppUrl(item.phone, item.name, item.id);

      html = `
        <div class="admin-detail-grid">
          <div class="admin-detail-card">
            <div class="admin-detail-card-label">Technical Specialist</div>
            <div class="admin-detail-card-val">${escapeHtml(item.name)}</div>
            <div style="font-size:0.85rem; color:var(--color-text-subtle); margin-top:0.25rem;">Firm: ${escapeHtml(item.firm || item.organization || 'Independent Expert')}</div>
            <div class="admin-contact-chips">
              <a href="tel:${escapeHtml(item.phone)}" class="admin-contact-chip">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                Call (${escapeHtml(item.phone)})
              </a>
              ${waUrl ? `
              <a href="${waUrl}" target="_blank" class="admin-contact-chip whatsapp">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/></svg>
                WhatsApp
              </a>` : ''}
              <a href="mailto:${escapeHtml(item.email)}" class="admin-contact-chip">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                Email
              </a>
            </div>
          </div>

          <div class="admin-detail-card">
            <div class="admin-detail-card-label">Specialist Discipline & Practice</div>
            <div style="margin-bottom:0.4rem;">
              <span style="font-size:0.75rem; color:var(--color-text-subtle);">Primary Field:</span>
              <div style="font-weight:700; color:var(--color-primary-green);">${escapeHtml(item.discipline || item.fieldOfExpertise || 'Environmental Consulting')}</div>
            </div>
            <div style="margin-bottom:0.4rem;">
              <span style="font-size:0.75rem; color:var(--color-text-subtle);">Accreditations:</span>
              <div style="font-weight:500;">${escapeHtml(item.accreditations || item.qualifications || 'Accredited')}</div>
            </div>
            <div>
              <span style="font-size:0.75rem; color:var(--color-text-subtle);">Practice Experience:</span>
              <div style="font-weight:500;">${escapeHtml(item.experience || item.yearsExperience || '10+ Years')}</div>
            </div>
          </div>
        </div>

        <div class="admin-detail-box">
          <div class="admin-detail-box-title">Consulting Track Record & Expertise</div>
          <p class="admin-detail-box-text">${escapeHtml(item.trackRecord || item.notes || item.message || 'No additional statement provided.')}</p>
        </div>

        <div class="admin-detail-footer">
          <div class="admin-detail-status-group">
            <label style="font-size:0.85rem; font-weight:700; color:var(--color-primary-navy);">Status:</label>
            <select id="updateStatusSelect" class="form-select" style="display:inline-block; width:auto; padding:0.45rem 0.85rem;">
              <option value="Pending" ${item.status === 'Pending' ? 'selected' : ''}>Pending</option>
              <option value="Reviewed" ${item.status === 'Reviewed' ? 'selected' : ''}>Reviewed</option>
              <option value="Empanelled" ${item.status === 'Empanelled' ? 'selected' : ''}>Empanelled</option>
              <option value="Active Project" ${item.status === 'Active Project' ? 'selected' : ''}>Active Project</option>
              <option value="Archived" ${item.status === 'Archived' ? 'selected' : ''}>Archived</option>
            </select>
            <button class="btn btn-navy" id="saveStatusChangeBtn">Save Status</button>
          </div>
          <button class="btn btn-outline" style="color:#DC2626; border-color:rgba(220,38,38,0.3);" id="modalDeleteBtn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            Delete Record
          </button>
        </div>
      `;
    }

    if (detailTitle) detailTitle.textContent = title;
    if (detailBadge) {
      detailBadge.className = `badge ${badgeClass}`;
      detailBadge.textContent = item.status;
      detailBadge.style.display = 'inline-flex';
    }

    detailBody.innerHTML = html;
    detailModal.style.display = 'flex';

    // Save Status Listener
    const saveBtn = document.getElementById('saveStatusChangeBtn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const newStatus = document.getElementById('updateStatusSelect').value;
        if (type === 'quote') window.StorageService.updateQuoteStatus(id, newStatus);
        else if (type === 'career') window.StorageService.updateCareerStatus(id, newStatus);
        else if (type === 'consultant') window.StorageService.updateConsultantStatus(id, newStatus);
        else if (type === 'contact') window.StorageService.updateContactStatus(id, newStatus);
        else if (type === 'partner') window.StorageService.updatePartnershipStatus(id, newStatus);

        renderDashboard();
        detailModal.style.display = 'none';
        if (window.showToast) window.showToast('Status Updated', `Record ${id} updated to ${newStatus}`, 'success');
      });
    }

    // Modal Delete Button Listener
    const modalDeleteBtn = document.getElementById('modalDeleteBtn');
    if (modalDeleteBtn) {
      modalDeleteBtn.addEventListener('click', () => {
        promptDelete(type, id, item.name || item.organization || id);
      });
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, m => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[m]);
  }

  // Init
  checkAuth();
});
