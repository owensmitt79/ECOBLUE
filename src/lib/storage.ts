import { QuoteLead, InquiryLead, CareerLead, ConsultantLead, PartnershipLead, DriverApplicationLead, LeadStatus } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// Storage Keys & Local Fallback Helpers
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEYS = {
  QUOTES: 'ecoblue_quotes_v1',
  INQUIRIES: 'ecoblue_inquiries_v1',
  PARTNERSHIPS: 'ecoblue_partnerships_v1',
  CAREERS: 'ecoblue_careers_v1',
  CONSULTANTS: 'ecoblue_consultants_v1',
  DRIVER_APPLICATIONS: 'ecoblue_driver_applications_v1'
} as const;

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

function getLocalList<T>(key: string): T[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalList<T>(key: string, list: T[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {
    // Ignore storage quota limits in restricted environments
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Server-Side API Proxies (Protects Supabase credentials from client exposure)
// ─────────────────────────────────────────────────────────────────────────────

async function submitLeadToApi(type: string, data: any): Promise<any | null> {
  if (!isBrowser()) return null;
  try {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data })
    });
    if (res.ok) {
      const json = await res.json();
      return json.record || null;
    }
  } catch (err: any) {
    console.warn(`[EcoBlue API] Lead submission for ${type} failed to sync, preserved locally:`, err?.message);
  }
  return null;
}

async function fetchAdminRecords<T>(type: string): Promise<T[] | null> {
  if (!isBrowser()) return null;
  try {
    const res = await fetch(`/api/admin/records?type=${encodeURIComponent(type)}`, {
      credentials: 'include',
    });
    if (res.ok) {
      const json = await res.json();
      return (json.data as T[]) || [];
    }
  } catch (err: any) {
    console.warn(`[EcoBlue API] Admin records fetch for ${type} failed:`, err?.message);
  }
  return null;
}

async function updateAdminRecordStatus<T>(type: string, id: string, status: LeadStatus): Promise<T | null> {
  if (!isBrowser()) return null;
  try {
    const res = await fetch('/api/admin/records', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ type, id, status }),
    });
    if (res.ok) {
      const json = await res.json();
      return (json.record as T) || null;
    }
  } catch (err: any) {
    console.warn(`[EcoBlue API] Status update for ${type} failed:`, err?.message);
  }
  return null;
}

async function deleteAdminRecord(type: string, id: string): Promise<boolean> {
  if (!isBrowser()) return false;
  try {
    const res = await fetch(`/api/admin/records?type=${encodeURIComponent(type)}&id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return res.ok;
  } catch (err: any) {
    console.warn(`[EcoBlue API] Delete for ${type} failed:`, err?.message);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// StorageService — Resilient Persistence Layer
// ─────────────────────────────────────────────────────────────────────────────

export const StorageService = {

  // ── QUOTES ──────────────────────────────────────────────────────────────────

  async getQuotes(): Promise<QuoteLead[]> {
    const remoteData = await fetchAdminRecords<QuoteLead>('quotes');
    if (remoteData) {
      saveLocalList(STORAGE_KEYS.QUOTES, remoteData);
      return remoteData;
    }
    return getLocalList<QuoteLead>(STORAGE_KEYS.QUOTES);
  },

  async getQuoteById(id: string): Promise<QuoteLead | undefined> {
    const local = getLocalList<QuoteLead>(STORAGE_KEYS.QUOTES);
    const found = local.find(q => q.id === id);
    if (found) return found;
    const remote = await this.getQuotes();
    return remote.find(q => q.id === id);
  },

  async saveQuote(quote: Omit<QuoteLead, 'id' | 'createdAt' | 'status'>): Promise<QuoteLead> {
    const local = getLocalList<QuoteLead>(STORAGE_KEYS.QUOTES);
    const rand = Math.floor(100 + Math.random() * 900);
    const newQuote: QuoteLead = {
      ...quote,
      id: `QUO-${new Date().getFullYear()}-${String(local.length + 1).padStart(3, '0')}-${rand}`,
      createdAt: new Date().toISOString(),
      status: 'Pending'
    };

    // 1. Immediately cache locally
    local.unshift(newQuote);
    saveLocalList(STORAGE_KEYS.QUOTES, local);

    // 2. Persist to server API (which securely synchronizes with Supabase)
    const synced = await submitLeadToApi('quotes', newQuote);
    if (synced) {
      return synced as QuoteLead;
    }

    return newQuote;
  },

  async updateQuoteStatus(id: string, status: LeadStatus): Promise<QuoteLead | undefined> {
    const local = getLocalList<QuoteLead>(STORAGE_KEYS.QUOTES);
    const idx = local.findIndex(q => q.id === id);
    if (idx !== -1) {
      local[idx].status = status;
      saveLocalList(STORAGE_KEYS.QUOTES, local);
    }

    const updated = await updateAdminRecordStatus<QuoteLead>('quotes', id, status);
    if (updated) {
      return updated;
    }

    return idx !== -1 ? local[idx] : undefined;
  },

  async deleteQuote(id: string): Promise<boolean> {
    const local = getLocalList<QuoteLead>(STORAGE_KEYS.QUOTES).filter(q => q.id !== id);
    saveLocalList(STORAGE_KEYS.QUOTES, local);
    await deleteAdminRecord('quotes', id);
    return true;
  },

  // ── INQUIRIES ────────────────────────────────────────────────────────────────

  async getInquiries(): Promise<InquiryLead[]> {
    const remoteData = await fetchAdminRecords<InquiryLead>('inquiries');
    if (remoteData) {
      saveLocalList(STORAGE_KEYS.INQUIRIES, remoteData);
      return remoteData;
    }
    return getLocalList<InquiryLead>(STORAGE_KEYS.INQUIRIES);
  },

  async saveInquiry(inquiry: Omit<InquiryLead, 'id' | 'createdAt' | 'status'>): Promise<InquiryLead> {
    const local = getLocalList<InquiryLead>(STORAGE_KEYS.INQUIRIES);
    const rand = Math.floor(100 + Math.random() * 900);
    const newInquiry: InquiryLead = {
      ...inquiry,
      id: `INQ-${new Date().getFullYear()}-${String(local.length + 1).padStart(3, '0')}-${rand}`,
      createdAt: new Date().toISOString(),
      status: 'Pending'
    };

    local.unshift(newInquiry);
    saveLocalList(STORAGE_KEYS.INQUIRIES, local);

    const synced = await submitLeadToApi('inquiries', newInquiry);
    if (synced) {
      return synced as InquiryLead;
    }

    return newInquiry;
  },

  async updateInquiryStatus(id: string, status: LeadStatus): Promise<InquiryLead | undefined> {
    const local = getLocalList<InquiryLead>(STORAGE_KEYS.INQUIRIES);
    const idx = local.findIndex(i => i.id === id);
    if (idx !== -1) {
      local[idx].status = status;
      saveLocalList(STORAGE_KEYS.INQUIRIES, local);
    }

    const updated = await updateAdminRecordStatus<InquiryLead>('inquiries', id, status);
    if (updated) return updated;

    return idx !== -1 ? local[idx] : undefined;
  },

  async deleteInquiry(id: string): Promise<boolean> {
    const local = getLocalList<InquiryLead>(STORAGE_KEYS.INQUIRIES).filter(i => i.id !== id);
    saveLocalList(STORAGE_KEYS.INQUIRIES, local);
    await deleteAdminRecord('inquiries', id);
    return true;
  },

  // ── PARTNERSHIPS ─────────────────────────────────────────────────────────────

  async getPartnerships(): Promise<PartnershipLead[]> {
    const remoteData = await fetchAdminRecords<PartnershipLead>('partnerships');
    if (remoteData) {
      saveLocalList(STORAGE_KEYS.PARTNERSHIPS, remoteData);
      return remoteData;
    }
    return getLocalList<PartnershipLead>(STORAGE_KEYS.PARTNERSHIPS);
  },

  async savePartnership(p: Omit<PartnershipLead, 'id' | 'createdAt' | 'status'>): Promise<PartnershipLead> {
    const local = getLocalList<PartnershipLead>(STORAGE_KEYS.PARTNERSHIPS);
    const rand = Math.floor(100 + Math.random() * 900);
    const newP: PartnershipLead = {
      ...p,
      id: `PRT-${new Date().getFullYear()}-${String(local.length + 1).padStart(3, '0')}-${rand}`,
      createdAt: new Date().toISOString(),
      status: 'Pending'
    };

    local.unshift(newP);
    saveLocalList(STORAGE_KEYS.PARTNERSHIPS, local);

    const synced = await submitLeadToApi('partnerships', newP);
    if (synced) {
      return synced as PartnershipLead;
    }

    return newP;
  },

  async updatePartnershipStatus(id: string, status: LeadStatus): Promise<PartnershipLead | undefined> {
    const local = getLocalList<PartnershipLead>(STORAGE_KEYS.PARTNERSHIPS);
    const idx = local.findIndex(p => p.id === id);
    if (idx !== -1) {
      local[idx].status = status;
      saveLocalList(STORAGE_KEYS.PARTNERSHIPS, local);
    }

    const updated = await updateAdminRecordStatus<PartnershipLead>('partnerships', id, status);
    if (updated) return updated;

    return idx !== -1 ? local[idx] : undefined;
  },

  async deletePartnership(id: string): Promise<boolean> {
    const local = getLocalList<PartnershipLead>(STORAGE_KEYS.PARTNERSHIPS).filter(p => p.id !== id);
    saveLocalList(STORAGE_KEYS.PARTNERSHIPS, local);
    await deleteAdminRecord('partnerships', id);
    return true;
  },

  // ── CAREERS ──────────────────────────────────────────────────────────────────

  async getCareers(): Promise<CareerLead[]> {
    const remoteData = await fetchAdminRecords<CareerLead>('careers');
    if (remoteData) {
      saveLocalList(STORAGE_KEYS.CAREERS, remoteData);
      return remoteData;
    }
    return getLocalList<CareerLead>(STORAGE_KEYS.CAREERS);
  },

  async saveCareer(c: Omit<CareerLead, 'id' | 'createdAt' | 'status'>): Promise<CareerLead> {
    const local = getLocalList<CareerLead>(STORAGE_KEYS.CAREERS);
    const rand = Math.floor(100 + Math.random() * 900);
    const newC: CareerLead = {
      ...c,
      id: `APP-${new Date().getFullYear()}-${String(local.length + 1).padStart(3, '0')}-${rand}`,
      createdAt: new Date().toISOString(),
      status: 'Pending'
    };

    local.unshift(newC);
    saveLocalList(STORAGE_KEYS.CAREERS, local);

    const synced = await submitLeadToApi('careers', newC);
    if (synced) {
      return synced as CareerLead;
    }

    return newC;
  },

  async updateCareerStatus(id: string, status: LeadStatus): Promise<CareerLead | undefined> {
    const local = getLocalList<CareerLead>(STORAGE_KEYS.CAREERS);
    const idx = local.findIndex(c => c.id === id);
    if (idx !== -1) {
      local[idx].status = status;
      saveLocalList(STORAGE_KEYS.CAREERS, local);
    }

    const updated = await updateAdminRecordStatus<CareerLead>('careers', id, status);
    if (updated) return updated;

    return idx !== -1 ? local[idx] : undefined;
  },

  async deleteCareer(id: string): Promise<boolean> {
    const local = getLocalList<CareerLead>(STORAGE_KEYS.CAREERS).filter(c => c.id !== id);
    saveLocalList(STORAGE_KEYS.CAREERS, local);
    await deleteAdminRecord('careers', id);
    return true;
  },

  // ── CONSULTANTS ──────────────────────────────────────────────────────────────

  async getConsultants(): Promise<ConsultantLead[]> {
    const remoteData = await fetchAdminRecords<ConsultantLead>('consultants');
    if (remoteData) {
      saveLocalList(STORAGE_KEYS.CONSULTANTS, remoteData);
      return remoteData;
    }
    return getLocalList<ConsultantLead>(STORAGE_KEYS.CONSULTANTS);
  },

  async saveConsultant(c: Omit<ConsultantLead, 'id' | 'createdAt' | 'status'>): Promise<ConsultantLead> {
    const local = getLocalList<ConsultantLead>(STORAGE_KEYS.CONSULTANTS);
    const rand = Math.floor(100 + Math.random() * 900);
    const newC: ConsultantLead = {
      ...c,
      id: `CST-${new Date().getFullYear()}-${String(local.length + 1).padStart(3, '0')}-${rand}`,
      createdAt: new Date().toISOString(),
      status: 'Pending'
    };

    local.unshift(newC);
    saveLocalList(STORAGE_KEYS.CONSULTANTS, local);

    const synced = await submitLeadToApi('consultants', newC);
    if (synced) {
      return synced as ConsultantLead;
    }

    return newC;
  },

  async updateConsultantStatus(id: string, status: LeadStatus): Promise<ConsultantLead | undefined> {
    const local = getLocalList<ConsultantLead>(STORAGE_KEYS.CONSULTANTS);
    const idx = local.findIndex(c => c.id === id);
    if (idx !== -1) {
      local[idx].status = status;
      saveLocalList(STORAGE_KEYS.CONSULTANTS, local);
    }

    const updated = await updateAdminRecordStatus<ConsultantLead>('consultants', id, status);
    if (updated) return updated;

    return idx !== -1 ? local[idx] : undefined;
  },

  async deleteConsultant(id: string): Promise<boolean> {
    const local = getLocalList<ConsultantLead>(STORAGE_KEYS.CONSULTANTS).filter(c => c.id !== id);
    saveLocalList(STORAGE_KEYS.CONSULTANTS, local);
    await deleteAdminRecord('consultants', id);
    return true;
  },

  // ── DRIVER APPLICATIONS ──────────────────────────────────────────────────────

  async getDriverApplications(): Promise<DriverApplicationLead[]> {
    const remoteData = await fetchAdminRecords<DriverApplicationLead>('driver_applications');
    if (remoteData) {
      saveLocalList(STORAGE_KEYS.DRIVER_APPLICATIONS, remoteData);
      return remoteData;
    }
    return getLocalList<DriverApplicationLead>(STORAGE_KEYS.DRIVER_APPLICATIONS);
  },

  async saveDriverApplication(d: Omit<DriverApplicationLead, 'id' | 'createdAt' | 'status'> & { id?: string; status?: LeadStatus }): Promise<DriverApplicationLead> {
    const local = getLocalList<DriverApplicationLead>(STORAGE_KEYS.DRIVER_APPLICATIONS);
    const rand = Math.floor(1000 + Math.random() * 9000);
    const newD: DriverApplicationLead = {
      ...d,
      id: d.id || `DRV-${new Date().getFullYear()}-${rand}`,
      createdAt: new Date().toISOString(),
      status: d.status || 'Pending'
    };

    local.unshift(newD);
    saveLocalList(STORAGE_KEYS.DRIVER_APPLICATIONS, local);

    const synced = await submitLeadToApi('driver_applications', newD);
    if (synced) {
      return synced as DriverApplicationLead;
    }

    return newD;
  },

  async updateDriverApplicationStatus(id: string, status: LeadStatus): Promise<DriverApplicationLead | undefined> {
    const local = getLocalList<DriverApplicationLead>(STORAGE_KEYS.DRIVER_APPLICATIONS);
    const idx = local.findIndex(d => d.id === id);
    if (idx !== -1) {
      local[idx].status = status;
      saveLocalList(STORAGE_KEYS.DRIVER_APPLICATIONS, local);
    }

    const updated = await updateAdminRecordStatus<DriverApplicationLead>('driver_applications', id, status);
    if (updated) return updated;

    return idx !== -1 ? local[idx] : undefined;
  },

  async deleteDriverApplication(id: string): Promise<boolean> {
    const local = getLocalList<DriverApplicationLead>(STORAGE_KEYS.DRIVER_APPLICATIONS).filter(d => d.id !== id);
    saveLocalList(STORAGE_KEYS.DRIVER_APPLICATIONS, local);
    await deleteAdminRecord('driver_applications', id);
    return true;
  }
};

