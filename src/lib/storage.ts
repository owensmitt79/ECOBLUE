import { QuoteLead, InquiryLead, CareerLead, ConsultantLead, PartnershipLead } from './types';

export const STORAGE_KEYS = {
  QUOTES: 'ecoblue_quote_requests',
  CONTACTS: 'ecoblue_contact_inquiries',
  PARTNERSHIPS: 'ecoblue_partnership_proposals',
  CAREERS: 'ecoblue_careers',
  CONSULTANTS: 'ecoblue_consultants',
  AUTH: 'ecoblue_admin_session'
};

const INITIAL_QUOTES: QuoteLead[] = [
  {
    id: 'QUO-2026-001',
    name: 'Engr. Kenneth Amadi',
    company: 'Golf Estate Residents Association',
    email: 'k.amadi@golfestateph.org',
    phone: '08035541290',
    location: 'Peter Odili Road, Trans-Amadi, Port Harcourt',
    service: 'Waste Collection & Disposal',
    wasteType: 'Residential Solid Waste',
    timeline: 'Scheduled weekly estate-wide compactor evacuation & segregation bins',
    notes: 'Requiring dedicated high-capacity compactor truck visit twice weekly.',
    status: 'Pending',
    createdAt: '2026-09-12T10:30:00.000Z'
  },
  {
    id: 'QUO-2026-002',
    name: 'Boma Briggs',
    company: 'Apex Hospitality & Suites',
    email: 'facilities@apexsuitesph.com',
    phone: '08023418899',
    location: 'GRA Phase 2, Port Harcourt',
    service: 'Recycling Services',
    wasteType: 'Plastic Bottles & Glass',
    timeline: 'Daily beverage plastic recovery, glass, and food waste sorting',
    notes: 'Seeking green certification advisory and regular plastic bale collection.',
    status: 'Reviewed',
    createdAt: '2026-09-11T14:15:00.000Z'
  },
  {
    id: 'QUO-2026-003',
    name: 'Dr. Tari Horsfall',
    company: 'Meridian Specialist Clinic',
    email: 'admin@meridianclinics.ng',
    phone: '08098765432',
    location: 'Aba Road Corridor, Port Harcourt',
    service: 'Environmental Services',
    wasteType: 'Non-Hazardous Healthcare Waste',
    timeline: 'Specialized non-hazardous medical facility sanitation & decontamination',
    notes: 'Strict adherence to environmental sanitation standards required.',
    status: 'Contacted',
    createdAt: '2026-09-10T09:00:00.000Z'
  }
];

const INITIAL_INQUIRIES: InquiryLead[] = [
  {
    id: 'INQ-2026-101',
    fullName: 'Chidi Okonkwo',
    email: 'chidi.o@riversstate.gov.ng',
    phone: '08031234567',
    subject: 'Environmental Sanitation Review',
    message: 'We are reviewing accredited environmental waste handlers for upcoming public sanitation drives across Port Harcourt municipality.',
    status: 'Reviewed',
    createdAt: '2026-09-11T11:45:00.000Z'
  },
  {
    id: 'INQ-2026-102',
    fullName: 'Florence Jumbo',
    email: 'fjumbo@bonnyventures.com',
    phone: '08055567890',
    subject: 'Skip Carrier Lease',
    message: 'Inquiry regarding lease of heavy-duty waste skips and containers for our marine staging facility.',
    status: 'Pending',
    createdAt: '2026-09-13T08:20:00.000Z'
  }
];

const INITIAL_PARTNERSHIPS: PartnershipLead[] = [
  {
    id: 'PRT-2026-501',
    organization: 'Niger Delta Clean Energy & Materials Recovery',
    contactPerson: 'Tamuno Briggs',
    email: 'tbriggs@ndmaterials.org',
    phone: '08077654321',
    track: 'Recycling Companies & Off-Takers',
    scopeSummary: 'Proposal to establish plastic flake off-take agreement from your sorting operations in Port Harcourt.',
    status: 'Pending',
    createdAt: '2026-09-12T16:00:00.000Z'
  }
];

const INITIAL_CAREERS: CareerLead[] = [
  {
    id: 'APP-2026-201',
    fullName: 'Samuel Belema',
    email: 'belema.samuel@gmail.com',
    phone: '08021113344',
    position: 'Environmental Operations Supervisor',
    experience: '5+ years',
    qualification: 'B.Sc Environmental Management, Rivers State University',
    coverLetter: 'Experienced in municipal route management, waste compaction supervision, and HSE enforcement across Greater Port Harcourt.',
    status: 'Reviewed',
    createdAt: '2026-09-12T11:20:00.000Z'
  },
  {
    id: 'APP-2026-202',
    fullName: 'Godwin Nwachukwu',
    email: 'godwin.nwa99@yahoo.com',
    phone: '08034455667',
    position: 'Heavy-Duty Compactor Truck Driver',
    experience: '7 years',
    qualification: 'Valid Class-E Commercial Driving License, FRSC Certified',
    coverLetter: 'Clean driving record, extensive experience with hydraulic compactor vehicles and Port Harcourt arterial routes.',
    status: 'Pending',
    createdAt: '2026-09-13T09:15:00.000Z'
  }
];

const INITIAL_CONSULTANTS: ConsultantLead[] = [
  {
    id: 'CST-2026-301',
    fullName: 'Dr. (Mrs.) Ibiene Dagogo',
    email: 'i.dagogo@ecoconsult.ng',
    phone: '08039876543',
    specialization: 'Environmental Impact Assessment (EIA) & Auditing',
    experienceYears: '14 years',
    certifications: 'Ph.D Environmental Toxicology, Certified EIA Lead Practitioner',
    profileSummary: 'Available for industrial waste auditing, baseline ecological studies, and statutory FMEnv/RIWAMA compliance documentation.',
    status: 'Reviewed',
    createdAt: '2026-09-11T16:45:00.000Z'
  }
];

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function initializeStorage() {
  if (!isBrowser()) return;
  if (!localStorage.getItem(STORAGE_KEYS.QUOTES)) {
    localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(INITIAL_QUOTES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CONTACTS)) {
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(INITIAL_INQUIRIES));
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
}

function notifyStorageUpdate(key: string, id?: string) {
  if (isBrowser()) {
    try {
      window.dispatchEvent(new CustomEvent('ecoblue_storage_update', { detail: { key, id } }));
    } catch {
      // Ignore if in environments where CustomEvent is unsupported
    }
  }
}

export const StorageService = {
  getQuotes(): QuoteLead[] {
    if (!isBrowser()) return INITIAL_QUOTES;
    initializeStorage();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.QUOTES) || '[]');
    } catch {
      return INITIAL_QUOTES;
    }
  },

  getQuoteById(id: string): QuoteLead | undefined {
    const list = this.getQuotes();
    return list.find(q => q.id === id);
  },

  saveQuote(quote: Omit<QuoteLead, 'id' | 'createdAt' | 'status'>): QuoteLead {
    const list = this.getQuotes();
    const newQuote: QuoteLead = {
      ...quote,
      id: `QUO-${new Date().getFullYear()}-${String(list.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      status: 'Pending'
    };
    list.unshift(newQuote);
    if (isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(list));
      notifyStorageUpdate(STORAGE_KEYS.QUOTES, newQuote.id);
    }
    return newQuote;
  },

  updateQuoteStatus(id: string, status: QuoteLead['status']): QuoteLead | undefined {
    const list = this.getQuotes();
    const item = list.find(q => q.id === id);
    if (item) {
      item.status = status;
      if (isBrowser()) {
        localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(list));
        notifyStorageUpdate(STORAGE_KEYS.QUOTES, id);
      }
    }
    return item;
  },

  deleteQuote(id: string): boolean {
    const list = this.getQuotes().filter(q => q.id !== id);
    if (isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(list));
      notifyStorageUpdate(STORAGE_KEYS.QUOTES, id);
    }
    return true;
  },

  getInquiries(): InquiryLead[] {
    if (!isBrowser()) return INITIAL_INQUIRIES;
    initializeStorage();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTACTS) || '[]');
    } catch {
      return INITIAL_INQUIRIES;
    }
  },

  saveInquiry(inquiry: Omit<InquiryLead, 'id' | 'createdAt' | 'status'>): InquiryLead {
    const list = this.getInquiries();
    const newInquiry: InquiryLead = {
      ...inquiry,
      id: `INQ-${new Date().getFullYear()}-${String(list.length + 101).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      status: 'Pending'
    };
    list.unshift(newInquiry);
    if (isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(list));
      notifyStorageUpdate(STORAGE_KEYS.CONTACTS, newInquiry.id);
    }
    return newInquiry;
  },

  updateInquiryStatus(id: string, status: InquiryLead['status']): InquiryLead | undefined {
    const list = this.getInquiries();
    const item = list.find(c => c.id === id);
    if (item) {
      item.status = status;
      if (isBrowser()) {
        localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(list));
        notifyStorageUpdate(STORAGE_KEYS.CONTACTS, id);
      }
    }
    return item;
  },

  deleteInquiry(id: string): boolean {
    const list = this.getInquiries().filter(c => c.id !== id);
    if (isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(list));
      notifyStorageUpdate(STORAGE_KEYS.CONTACTS, id);
    }
    return true;
  },

  getPartnerships(): PartnershipLead[] {
    if (!isBrowser()) return INITIAL_PARTNERSHIPS;
    initializeStorage();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.PARTNERSHIPS) || '[]');
    } catch {
      return INITIAL_PARTNERSHIPS;
    }
  },

  savePartnership(p: Omit<PartnershipLead, 'id' | 'createdAt' | 'status'>): PartnershipLead {
    const list = this.getPartnerships();
    const newP: PartnershipLead = {
      ...p,
      id: `PRT-${new Date().getFullYear()}-${String(list.length + 501).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      status: 'Pending'
    };
    list.unshift(newP);
    if (isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.PARTNERSHIPS, JSON.stringify(list));
      notifyStorageUpdate(STORAGE_KEYS.PARTNERSHIPS, newP.id);
    }
    return newP;
  },

  updatePartnershipStatus(id: string, status: PartnershipLead['status']): PartnershipLead | undefined {
    const list = this.getPartnerships();
    const item = list.find(p => p.id === id);
    if (item) {
      item.status = status;
      if (isBrowser()) {
        localStorage.setItem(STORAGE_KEYS.PARTNERSHIPS, JSON.stringify(list));
        notifyStorageUpdate(STORAGE_KEYS.PARTNERSHIPS, id);
      }
    }
    return item;
  },

  deletePartnership(id: string): boolean {
    const list = this.getPartnerships().filter(p => p.id !== id);
    if (isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.PARTNERSHIPS, JSON.stringify(list));
      notifyStorageUpdate(STORAGE_KEYS.PARTNERSHIPS, id);
    }
    return true;
  },

  getCareers(): CareerLead[] {
    if (!isBrowser()) return INITIAL_CAREERS;
    initializeStorage();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CAREERS) || '[]');
    } catch {
      return INITIAL_CAREERS;
    }
  },

  saveCareer(c: Omit<CareerLead, 'id' | 'createdAt' | 'status'>): CareerLead {
    const list = this.getCareers();
    const newC: CareerLead = {
      ...c,
      id: `APP-${new Date().getFullYear()}-${String(list.length + 201).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      status: 'Pending'
    };
    list.unshift(newC);
    if (isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.CAREERS, JSON.stringify(list));
      notifyStorageUpdate(STORAGE_KEYS.CAREERS, newC.id);
    }
    return newC;
  },

  updateCareerStatus(id: string, status: CareerLead['status']): CareerLead | undefined {
    const list = this.getCareers();
    const item = list.find(a => a.id === id);
    if (item) {
      item.status = status;
      if (isBrowser()) {
        localStorage.setItem(STORAGE_KEYS.CAREERS, JSON.stringify(list));
        notifyStorageUpdate(STORAGE_KEYS.CAREERS, id);
      }
    }
    return item;
  },

  deleteCareer(id: string): boolean {
    const list = this.getCareers().filter(a => a.id !== id);
    if (isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.CAREERS, JSON.stringify(list));
      notifyStorageUpdate(STORAGE_KEYS.CAREERS, id);
    }
    return true;
  },

  getConsultants(): ConsultantLead[] {
    if (!isBrowser()) return INITIAL_CONSULTANTS;
    initializeStorage();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CONSULTANTS) || '[]');
    } catch {
      return INITIAL_CONSULTANTS;
    }
  },

  saveConsultant(c: Omit<ConsultantLead, 'id' | 'createdAt' | 'status'>): ConsultantLead {
    const list = this.getConsultants();
    const newC: ConsultantLead = {
      ...c,
      id: `CST-${new Date().getFullYear()}-${String(list.length + 301).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      status: 'Pending'
    };
    list.unshift(newC);
    if (isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.CONSULTANTS, JSON.stringify(list));
      notifyStorageUpdate(STORAGE_KEYS.CONSULTANTS, newC.id);
    }
    return newC;
  },

  updateConsultantStatus(id: string, status: ConsultantLead['status']): ConsultantLead | undefined {
    const list = this.getConsultants();
    const item = list.find(c => c.id === id);
    if (item) {
      item.status = status;
      if (isBrowser()) {
        localStorage.setItem(STORAGE_KEYS.CONSULTANTS, JSON.stringify(list));
        notifyStorageUpdate(STORAGE_KEYS.CONSULTANTS, id);
      }
    }
    return item;
  },

  deleteConsultant(id: string): boolean {
    const list = this.getConsultants().filter(c => c.id !== id);
    if (isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.CONSULTANTS, JSON.stringify(list));
      notifyStorageUpdate(STORAGE_KEYS.CONSULTANTS, id);
    }
    return true;
  }
};
