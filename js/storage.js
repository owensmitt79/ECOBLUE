/**
 * EcoBlue Environmental Services Ltd. - Data Storage & Persistence Module
 * LocalStorage backend for quote requests, contact inquiries, partnerships, and admin state.
 */

const STORAGE_KEYS = {
  QUOTES: 'ecoblue_quote_requests',
  CONTACTS: 'ecoblue_contact_inquiries',
  PARTNERSHIPS: 'ecoblue_partnership_proposals',
  CAREERS: 'ecoblue_careers',
  CONSULTANTS: 'ecoblue_consultants',
  NEWSLETTER: 'ecoblue_newsletter_subs',
  AUTH: 'ecoblue_admin_session'
};

// Initial realistic baseline data compliant with company profile
const INITIAL_QUOTES = [
  {
    id: 'QUO-2026-001',
    name: 'Engr. Kenneth Amadi',
    organization: 'Golf Estate Residents Association',
    email: 'k.amadi@golfestateph.org',
    phone: '08035541290',
    location: 'Peter Odili Road, Trans-Amadi, Port Harcourt',
    clientType: 'Residential Estates',
    service: 'Waste Collection & Disposal',
    wasteRequirement: 'Scheduled weekly estate-wide compactor evacuation & segregation bins',
    preferredDate: '2026-09-20',
    notes: 'Requiring dedicated high-capacity compactor truck visit twice weekly.',
    status: 'Pending',
    createdAt: '2026-09-12T10:30:00.000Z'
  },
  {
    id: 'QUO-2026-002',
    name: 'Boma Briggs',
    organization: 'Apex Hospitality & Suites',
    email: 'facilities@apexsuitesph.com',
    phone: '08023418899',
    location: 'GRA Phase 2, Port Harcourt',
    clientType: 'Hotels & Hospitality',
    service: 'Recycling Services',
    wasteRequirement: 'Daily beverage plastic recovery, glass, and food waste sorting',
    preferredDate: '2026-09-18',
    notes: 'Seeking green certification advisory and regular plastic bale collection.',
    status: 'Reviewed',
    createdAt: '2026-09-11T14:15:00.000Z'
  },
  {
    id: 'QUO-2026-003',
    name: 'Dr. Tari Horsfall',
    organization: 'Meridian Specialist Clinic',
    email: 'admin@meridianclinics.ng',
    phone: '08098765432',
    location: 'Aba Road Corridor, Port Harcourt',
    clientType: 'Hospitals & Healthcare',
    service: 'Environmental Services',
    wasteRequirement: 'Specialized non-hazardous medical facility sanitation & site decontamination',
    preferredDate: '2026-09-25',
    notes: 'Strict adherence to environmental sanitation standards required.',
    status: 'Contacted',
    createdAt: '2026-09-10T09:00:00.000Z'
  }
];

const INITIAL_CONTACTS = [
  {
    id: 'INQ-2026-101',
    name: 'Chidi Okonkwo',
    organization: 'Rivers State Environmental Protection Agency Liaison',
    email: 'chidi.o@riversstate.gov.ng',
    phone: '08031234567',
    service: 'Environmental Consultancy',
    message: 'We are reviewing accredited environmental waste handlers for upcoming public sanitation drives across Port Harcourt municipality.',
    status: 'Reviewed',
    createdAt: '2026-09-11T11:45:00.000Z'
  },
  {
    id: 'INQ-2026-102',
    name: 'Florence Jumbo',
    organization: 'Bonny Commercial Ventures',
    email: 'fjumbo@bonnyventures.com',
    phone: '08055567890',
    service: 'Logistics & Support Services',
    message: 'Inquiry regarding lease of heavy-duty waste skips and containers for our marine staging facility.',
    status: 'Pending',
    createdAt: '2026-09-13T08:20:00.000Z'
  }
];

const INITIAL_PARTNERSHIPS = [
  {
    id: 'PRT-2026-501',
    name: 'Tamuno Briggs',
    organization: 'Niger Delta Clean Energy & Materials Recovery',
    email: 'tbriggs@ndmaterials.org',
    phone: '08077654321',
    partnershipType: 'Recycling Companies',
    message: 'Proposal to establish plastic flake off-take agreement from your sorting operations in Port Harcourt.',
    status: 'Pending',
    createdAt: '2026-09-12T16:00:00.000Z'
  }
];

const INITIAL_CAREERS = [
  {
    id: 'APP-2026-201',
    name: 'Samuel Belema',
    email: 'belema.samuel@gmail.com',
    phone: '08021113344',
    position: 'Environmental Operations Supervisor',
    experience: '5+ years',
    qualification: 'B.Sc Environmental Management, Rivers State University',
    notes: 'Experienced in municipal route management, waste compaction supervision, and HSE enforcement across Greater Port Harcourt.',
    status: 'Reviewed',
    createdAt: '2026-09-12T11:20:00.000Z'
  },
  {
    id: 'APP-2026-202',
    name: 'Godwin Nwachukwu',
    email: 'godwin.nwa99@yahoo.com',
    phone: '08034455667',
    position: 'Heavy-Duty Compactor Truck Driver',
    experience: '7 years',
    qualification: 'Valid Class-E Commercial Driving License, FRSC Certified',
    notes: 'Clean driving record, extensive experience with hydraulic compactor vehicles and Port Harcourt arterial routes.',
    status: 'Pending',
    createdAt: '2026-09-13T09:15:00.000Z'
  }
];

const INITIAL_CONSULTANTS = [
  {
    id: 'CST-2026-301',
    name: 'Dr. (Mrs.) Ibiene Dagogo',
    email: 'i.dagogo@ecoconsult.ng',
    phone: '08039876543',
    organization: 'Dagogo Environmental Solutions',
    fieldOfExpertise: 'Environmental Impact Assessment (EIA) & Auditing',
    qualifications: 'Ph.D Environmental Toxicology, Certified EIA Lead Practitioner',
    yearsExperience: '14 years',
    engagementMode: 'Project-based Consultant',
    notes: 'Available for industrial waste auditing, baseline ecological studies, and statutory FMEnv/RIWAMA compliance documentation.',
    status: 'Reviewed',
    createdAt: '2026-09-11T16:45:00.000Z'
  }
];

// Initialize Storage if empty
function initializeStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.QUOTES)) {
    localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(INITIAL_QUOTES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CONTACTS)) {
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(INITIAL_CONTACTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PARTNERSHIPS)) {
    localStorage.setItem(STORAGE_KEYS.PARTNERSHIPS, JSON.stringify(INITIAL_PARTNERSHIPS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CAREERS)) {
    localStorage.setItem(STORAGE_KEYS.CAREERS, JSON.stringify(INITIAL_CAREERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CONSULTANTS)) {
    localStorage.setItem(STORAGE_KEYS.CONSULTANTS, JSON.stringify(INITIAL_CONSULTANTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NEWSLETTER)) {
    localStorage.setItem(STORAGE_KEYS.NEWSLETTER, JSON.stringify(['director@phchamber.org', 'sustainability@nddc.gov.ng']));
  }
}

// Storage Access API
const StorageService = {
  getQuotes() {
    initializeStorage();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.QUOTES) || '[]');
  },
  saveQuote(quote) {
    const quotes = this.getQuotes();
    const newQuote = {
      id: 'QUO-' + new Date().getFullYear() + '-' + String(quotes.length + 1).padStart(3, '0'),
      createdAt: new Date().toISOString(),
      status: 'Pending',
      ...quote
    };
    quotes.unshift(newQuote);
    localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(quotes));
    return newQuote;
  },
  updateQuoteStatus(id, newStatus) {
    const quotes = this.getQuotes();
    const item = quotes.find(q => q.id === id);
    if (item) {
      item.status = newStatus;
      localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(quotes));
    }
    return item;
  },
  deleteQuote(id) {
    const quotes = this.getQuotes().filter(q => q.id !== id);
    localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(quotes));
    return true;
  },
  getContacts() {
    initializeStorage();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTACTS) || '[]');
  },
  saveContact(contact) {
    const contacts = this.getContacts();
    const newContact = {
      id: 'INQ-' + new Date().getFullYear() + '-' + String(contacts.length + 101).padStart(3, '0'),
      createdAt: new Date().toISOString(),
      status: 'Pending',
      ...contact
    };
    contacts.unshift(newContact);
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
    return newContact;
  },
  updateContactStatus(id, newStatus) {
    const contacts = this.getContacts();
    const item = contacts.find(c => c.id === id);
    if (item) {
      item.status = newStatus;
      localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
    }
    return item;
  },
  deleteContact(id) {
    const contacts = this.getContacts().filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
    return true;
  },
  getPartnerships() {
    initializeStorage();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PARTNERSHIPS) || '[]');
  },
  savePartnership(partner) {
    const partnerships = this.getPartnerships();
    const newPartner = {
      id: 'PRT-' + new Date().getFullYear() + '-' + String(partnerships.length + 501).padStart(3, '0'),
      createdAt: new Date().toISOString(),
      status: 'Pending',
      ...partner
    };
    partnerships.unshift(newPartner);
    localStorage.setItem(STORAGE_KEYS.PARTNERSHIPS, JSON.stringify(partnerships));
    return newPartner;
  },
  updatePartnershipStatus(id, newStatus) {
    const list = this.getPartnerships();
    const item = list.find(p => p.id === id);
    if (item) {
      item.status = newStatus;
      localStorage.setItem(STORAGE_KEYS.PARTNERSHIPS, JSON.stringify(list));
    }
    return item;
  },
  deletePartnership(id) {
    const list = this.getPartnerships().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PARTNERSHIPS, JSON.stringify(list));
    return true;
  },
  addNewsletter(email) {
    initializeStorage();
    const subs = JSON.parse(localStorage.getItem(STORAGE_KEYS.NEWSLETTER) || '[]');
    if (!subs.includes(email)) {
      subs.push(email);
      localStorage.setItem(STORAGE_KEYS.NEWSLETTER, JSON.stringify(subs));
    }
    return true;
  },
  getNewsletterCount() {
    initializeStorage();
    return (JSON.parse(localStorage.getItem(STORAGE_KEYS.NEWSLETTER) || '[]')).length;
  },
  getCareers() {
    initializeStorage();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CAREERS) || '[]');
  },
  saveCareer(application) {
    const apps = this.getCareers();
    const newApp = {
      id: 'APP-' + new Date().getFullYear() + '-' + String(apps.length + 201).padStart(3, '0'),
      createdAt: new Date().toISOString(),
      status: 'Pending',
      ...application
    };
    apps.unshift(newApp);
    localStorage.setItem(STORAGE_KEYS.CAREERS, JSON.stringify(apps));
    return newApp;
  },
  updateCareerStatus(id, newStatus) {
    const apps = this.getCareers();
    const item = apps.find(a => a.id === id);
    if (item) {
      item.status = newStatus;
      localStorage.setItem(STORAGE_KEYS.CAREERS, JSON.stringify(apps));
    }
    return item;
  },
  deleteCareer(id) {
    const apps = this.getCareers().filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.CAREERS, JSON.stringify(apps));
    return true;
  },
  getConsultants() {
    initializeStorage();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CONSULTANTS) || '[]');
  },
  saveConsultant(consultant) {
    const list = this.getConsultants();
    const newConsultant = {
      id: 'CST-' + new Date().getFullYear() + '-' + String(list.length + 301).padStart(3, '0'),
      createdAt: new Date().toISOString(),
      status: 'Pending',
      ...consultant
    };
    list.unshift(newConsultant);
    localStorage.setItem(STORAGE_KEYS.CONSULTANTS, JSON.stringify(list));
    return newConsultant;
  },
  updateConsultantStatus(id, newStatus) {
    const list = this.getConsultants();
    const item = list.find(c => c.id === id);
    if (item) {
      item.status = newStatus;
      localStorage.setItem(STORAGE_KEYS.CONSULTANTS, JSON.stringify(list));
    }
    return item;
  },
  deleteConsultant(id) {
    const list = this.getConsultants().filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CONSULTANTS, JSON.stringify(list));
    return true;
  }
};

// Expose globally
window.StorageService = StorageService;
