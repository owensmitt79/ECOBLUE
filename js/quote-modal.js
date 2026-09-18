/**
 * EcoBlue Environmental Services Ltd. - Universal Quote & Service Request Modal
 * Handles interactive modal open/close, pre-filling, validation, and storage.
 */

(function () {
  const modalHTML = `
  <div class="modal-overlay" id="quoteModalOverlay" aria-hidden="true" role="dialog" aria-labelledby="quoteModalTitle">
    <div class="modal-card">
      <div class="modal-header">
        <div>
          <div class="section-badge" style="margin-bottom: 0.35rem;">Environmental Consultation</div>
          <h3 id="quoteModalTitle" style="font-size: 1.45rem; color: var(--color-primary-navy);">Request a Consultation</h3>
        </div>
        <button class="modal-close-btn" id="closeQuoteModalBtn" aria-label="Close dialog">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      
      <div class="modal-body">
        <form id="quoteRequestForm">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="quoteName">Full Name *</label>
              <input type="text" id="quoteName" name="name" class="form-control" placeholder="e.g. Kenneth Amadi" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="quoteOrg">Organization / Company</label>
              <input type="text" id="quoteOrg" name="organization" class="form-control" placeholder="e.g. Golf Estate / Shell RA" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="quoteEmail">Official Email *</label>
              <input type="email" id="quoteEmail" name="email" class="form-control" placeholder="name@domain.com" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="quotePhone">Phone Number *</label>
              <input type="tel" id="quotePhone" name="phone" class="form-control" placeholder="08061193218" required />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="quoteLocation">Location / Area in Rivers State *</label>
              <input type="text" id="quoteLocation" name="location" class="form-control" placeholder="e.g. GRA Phase 2, Trans-Amadi, Peter Odili Rd" required />
            </div>
            <div class="form-group">
              <label class="form-label" for="quoteClientType">Client Type *</label>
              <select id="quoteClientType" name="clientType" class="form-select" required>
                <option value="" disabled selected>Select Client Sector</option>
                <option value="Residential Estates">Residential Estates</option>
                <option value="Hotels & Hospitality Businesses">Hotels & Hospitality Businesses</option>
                <option value="Schools & Universities">Schools & Universities</option>
                <option value="Hospitals & Healthcare Facilities">Hospitals & Healthcare Facilities</option>
                <option value="Shopping Complexes">Shopping Complexes</option>
                <option value="Corporate Organizations">Corporate Organizations</option>
                <option value="Manufacturing Facilities">Manufacturing Facilities</option>
                <option value="Government Agencies">Government Agencies</option>
                <option value="Local Government Authorities">Local Government Authorities</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="quoteService">Required Service *</label>
              <select id="quoteService" name="service" class="form-select" required>
                <option value="" disabled selected>Choose Service Category</option>
                <option value="Waste Collection & Disposal">Waste Collection & Disposal (Compactor Fleet)</option>
                <option value="Recycling Services">Recycling Services & Material Recovery</option>
                <option value="Environmental Services">Environmental Sanitation & Consultancy</option>
                <option value="Logistics & Support Services">Logistics, Skips & Container Supply</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="quoteDate">Preferred Commencement Date</label>
              <input type="date" id="quoteDate" name="preferredDate" class="form-control" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="quoteRequirement">Waste Management Requirement *</label>
            <input type="text" id="quoteRequirement" name="wasteRequirement" class="form-control" placeholder="e.g. Daily compactor evacuation, 10 estate segregation bins, commercial waste contract" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="quoteNotes">Additional Information</label>
            <textarea id="quoteNotes" name="notes" class="form-textarea" placeholder="Tell us more about your waste volume, site specifications, or consultation objectives..."></textarea>
          </div>

          <div style="display: flex; gap: 1rem; align-items: center; justify-content: flex-end; margin-top: 1.5rem;">
            <button type="button" class="btn btn-outline" id="cancelQuoteBtn">Cancel</button>
            <button type="submit" class="btn btn-primary" id="submitQuoteBtn">
              <span>Submit Request</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </div>
        </form>

        <!-- Submission Success State -->
        <div id="quoteSuccessState" style="display: none; text-align: center; padding: 2.5rem 1rem;">
          <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--color-green-subtle); color: var(--color-primary-green); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem auto; border: 2px solid var(--color-primary-green);">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <h3 style="font-size: 1.5rem; color: var(--color-primary-navy); margin-bottom: 0.75rem;">Request Submitted Successfully</h3>
          <p style="font-size: 1.05rem; color: var(--color-text-main); font-weight: 500; max-width: 480px; margin: 0 auto 1.75rem auto;">
            Thank you. Your request has been received. Our team will contact you shortly.
          </p>
          <div style="font-size: 0.85rem; color: var(--color-text-subtle); margin-bottom: 1.5rem;">
            EcoBlue Environmental Services Ltd. • Port Harcourt, Rivers State • 08061193218
          </div>
          <button type="button" class="btn btn-navy" id="quoteDoneBtn">Done</button>
        </div>
      </div>
    </div>
  </div>
  `;

  // Inject modal on load
  function initModal() {
    if (!document.getElementById('quoteModalOverlay')) {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = modalHTML;
      document.body.appendChild(wrapper.firstElementChild);
    }
    bindEvents();
  }

  function openQuoteModal(serviceName) {
    const overlay = document.getElementById('quoteModalOverlay');
    const form = document.getElementById('quoteRequestForm');
    const success = document.getElementById('quoteSuccessState');
    if (!overlay) return;

    form.reset();
    form.style.display = 'block';
    success.style.display = 'none';

    if (serviceName) {
      const select = document.getElementById('quoteService');
      for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].text.toLowerCase().includes(serviceName.toLowerCase()) || 
            select.options[i].value.toLowerCase().includes(serviceName.toLowerCase())) {
          select.selectedIndex = i;
          break;
        }
      }
    }

    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeQuoteModal() {
    const overlay = document.getElementById('quoteModalOverlay');
    if (!overlay) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function bindEvents() {
    const overlay = document.getElementById('quoteModalOverlay');
    const closeBtn = document.getElementById('closeQuoteModalBtn');
    const cancelBtn = document.getElementById('cancelQuoteBtn');
    const doneBtn = document.getElementById('quoteDoneBtn');
    const form = document.getElementById('quoteRequestForm');
    const success = document.getElementById('quoteSuccessState');

    if (closeBtn) closeBtn.addEventListener('click', closeQuoteModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeQuoteModal);
    if (doneBtn) doneBtn.addEventListener('click', closeQuoteModal);

    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeQuoteModal();
      });
    }

    // Attach to any button with data-open-quote
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-open-quote]');
      if (target) {
        e.preventDefault();
        const service = target.getAttribute('data-service') || '';
        openQuoteModal(service);
      }
    });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = {
          name: form.quoteName.value.trim(),
          organization: form.quoteOrg.value.trim() || 'Individual / Private Client',
          email: form.quoteEmail.value.trim(),
          phone: form.quotePhone.value.trim(),
          location: form.quoteLocation.value.trim(),
          clientType: form.quoteClientType.value,
          service: form.quoteService.value,
          preferredDate: form.quoteDate.value || 'Immediate / Flexible',
          wasteRequirement: form.quoteRequirement.value.trim(),
          notes: form.quoteNotes.value.trim()
        };

        if (window.StorageService) {
          window.StorageService.saveQuote(formData);
        }

        form.style.display = 'none';
        success.style.display = 'block';

        if (window.showToast) {
          window.showToast('Quote Request Received', 'Thank you! EcoBlue operations team will contact you shortly.', 'success');
        }
      });
    }
  }

  // Expose
  window.openQuoteModal = openQuoteModal;
  window.closeQuoteModal = closeQuoteModal;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initModal);
  } else {
    initModal();
  }
})();
