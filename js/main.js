/**
 * EcoBlue Environmental Services Ltd. - Main Application Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header scroll listener
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // 2. Mobile Drawer Navigation
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const drawerClose = document.querySelector('.mobile-drawer-close');
  const drawerBackdrop = document.querySelector('.drawer-backdrop');

  function openDrawer() {
    mobileDrawer?.classList.add('open');
    drawerBackdrop?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer?.classList.remove('open');
    drawerBackdrop?.classList.remove('open');
    document.body.style.overflow = '';
  }

  mobileToggle?.addEventListener('click', openDrawer);
  drawerClose?.addEventListener('click', closeDrawer);
  drawerBackdrop?.addEventListener('click', closeDrawer);

  // Mobile Dropdown Toggle
  document.querySelectorAll('.mobile-dropdown-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const parent = btn.closest('.mobile-nav-dropdown');
      parent?.classList.toggle('open');
    });
  });

  // Close drawer when clicking any mobile nav link or sub link
  document.querySelectorAll('.mobile-nav-link, .mobile-sub-link').forEach(link => {
    link.addEventListener('click', () => {
      // Don't close if it's the parent of an unopened dropdown toggle on click
      closeDrawer();
    });
  });

  // 3. Highlight Current Active Nav Link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // 4. Toast Notification System
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  window.showToast = function(title, message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div style="flex-shrink:0;">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${type === 'success' ? '#059669' : '#0A2540'}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 14 14"></polyline>
        </svg>
      </div>
      <div>
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
    `;
    toastContainer.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 50);

    // Auto remove
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  };

  // 5. Footer Newsletter Subscription
  const newsletterForm = document.querySelector('.footer-newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      const email = input ? input.value.trim() : '';
      if (email && window.StorageService) {
        window.StorageService.addNewsletter(email);
        window.showToast('Subscribed!', 'Thank you for subscribing to EcoBlue environmental updates.', 'success');
        newsletterForm.reset();
      }
    });
  }

  // 6. Contact Form Processing (if on contact page)
  const contactForm = document.getElementById('contactPageForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = {
        name: contactForm.contactName.value.trim(),
        organization: contactForm.contactOrg.value.trim() || 'Private / Unspecified',
        email: contactForm.contactEmail.value.trim(),
        phone: contactForm.contactPhone.value.trim(),
        service: contactForm.contactService.value,
        message: contactForm.contactMessage.value.trim()
      };

      if (window.StorageService) {
        window.StorageService.saveContact(formData);
      }

      window.showToast('Inquiry Dispatched', 'Thank you! EcoBlue team in Port Harcourt will respond shortly.', 'success');
      contactForm.reset();
    });
  }

  // 7. Partnership Form Processing (if on partnerships page)
  const partnerForm = document.getElementById('partnershipPageForm');
  if (partnerForm) {
    partnerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = {
        name: partnerForm.partnerName.value.trim(),
        organization: partnerForm.partnerOrg.value.trim(),
        email: partnerForm.partnerEmail.value.trim(),
        phone: partnerForm.partnerPhone.value.trim(),
        partnershipType: partnerForm.partnerType.value,
        message: partnerForm.partnerMessage.value.trim()
      };

      if (window.StorageService) {
        window.StorageService.savePartnership(formData);
      }

      window.showToast('Proposal Submitted', 'Your partnership proposal has been submitted to EcoBlue executive directors.', 'success');
      partnerForm.reset();
    });
  }
});
