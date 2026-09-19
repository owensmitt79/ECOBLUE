import { supabase, isSupabaseConfigured } from './supabase';
import { QuoteLead, InquiryLead, CareerLead, ConsultantLead, PartnershipLead, LeadStatus } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// Storage Keys & Local Fallback Helpers
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEYS = {
  QUOTES: 'ecoblue_quotes_v1',
  INQUIRIES: 'ecoblue_inquiries_v1',
  PARTNERSHIPS: 'ecoblue_partnerships_v1',
  CAREERS: 'ecoblue_careers_v1',
  CONSULTANTS: 'ecoblue_consultants_v1'
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
// StorageService — Resilient Persistence Layer
// Syncs to Supabase when configured, with seamless local storage persistence.
// ─────────────────────────────────────────────────────────────────────────────

export const StorageService = {

  // ── QUOTES ──────────────────────────────────────────────────────────────────

  async getQuotes(): Promise<QuoteLead[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('quotes')
          .select('*')
          .order('createdAt', { ascending: false });
        if (!error && data && data.length > 0) {
          saveLocalList(STORAGE_KEYS.QUOTES, data);
          return data as QuoteLead[];
        }
      } catch (err: any) {
        console.warn('Supabase getQuotes query failed, falling back to local cache:', err?.message);
      }
    }
    return getLocalList<QuoteLead>(STORAGE_KEYS.QUOTES);
  },

  async getQuoteById(id: string): Promise<QuoteLead | undefined> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('quotes')
          .select('*')
          .eq('id', id)
          .single();
        if (!error && data) {
          return data as QuoteLead;
        }
      } catch (err: any) {
        console.warn('Supabase getQuoteById failed, checking local cache:', err?.message);
      }
    }
    const local = getLocalList<QuoteLead>(STORAGE_KEYS.QUOTES);
    return local.find(q => q.id === id);
  },

  async saveQuote(quote: Omit<QuoteLead, 'id' | 'createdAt' | 'status'>): Promise<QuoteLead> {
    const local = getLocalList<QuoteLead>(STORAGE_KEYS.QUOTES);
    const seq = String(local.length + 1).padStart(3, '0');
    const newQuote: QuoteLead = {
      ...quote,
      id: `QUO-${new Date().getFullYear()}-${seq}`,
      createdAt: new Date().toISOString(),
      status: 'Pending'
    };

    // 1. Immediately cache locally
    local.unshift(newQuote);
    saveLocalList(STORAGE_KEYS.QUOTES, local);

    // 2. Persist to Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('quotes').insert(newQuote).select().single();
        if (!error && data) {
          return data as QuoteLead;
        }
      } catch (err: any) {
        console.warn('Supabase saveQuote failed, kept in local storage:', err?.message);
      }
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

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('quotes')
          .update({ status })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data as QuoteLead;
      } catch (err: any) {
        console.warn('Supabase updateQuoteStatus failed:', err?.message);
      }
    }

    return idx !== -1 ? local[idx] : undefined;
  },

  async deleteQuote(id: string): Promise<boolean> {
    const local = getLocalList<QuoteLead>(STORAGE_KEYS.QUOTES).filter(q => q.id !== id);
    saveLocalList(STORAGE_KEYS.QUOTES, local);

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('quotes').delete().eq('id', id);
      } catch (err: any) {
        console.warn('Supabase deleteQuote failed:', err?.message);
      }
    }
    return true;
  },

  // ── INQUIRIES ────────────────────────────────────────────────────────────────

  async getInquiries(): Promise<InquiryLead[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('inquiries')
          .select('*')
          .order('createdAt', { ascending: false });
        if (!error && data && data.length > 0) {
          saveLocalList(STORAGE_KEYS.INQUIRIES, data);
          return data as InquiryLead[];
        }
      } catch (err: any) {
        console.warn('Supabase getInquiries failed, using local cache:', err?.message);
      }
    }
    return getLocalList<InquiryLead>(STORAGE_KEYS.INQUIRIES);
  },

  async saveInquiry(inquiry: Omit<InquiryLead, 'id' | 'createdAt' | 'status'>): Promise<InquiryLead> {
    const local = getLocalList<InquiryLead>(STORAGE_KEYS.INQUIRIES);
    const seq = String(local.length + 101).padStart(3, '0');
    const newInquiry: InquiryLead = {
      ...inquiry,
      id: `INQ-${new Date().getFullYear()}-${seq}`,
      createdAt: new Date().toISOString(),
      status: 'Pending'
    };

    local.unshift(newInquiry);
    saveLocalList(STORAGE_KEYS.INQUIRIES, local);

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('inquiries').insert(newInquiry).select().single();
        if (!error && data) return data as InquiryLead;
      } catch (err: any) {
        console.warn('Supabase saveInquiry failed:', err?.message);
      }
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

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('inquiries')
          .update({ status })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data as InquiryLead;
      } catch (err: any) {
        console.warn('Supabase updateInquiryStatus failed:', err?.message);
      }
    }

    return idx !== -1 ? local[idx] : undefined;
  },

  async deleteInquiry(id: string): Promise<boolean> {
    const local = getLocalList<InquiryLead>(STORAGE_KEYS.INQUIRIES).filter(i => i.id !== id);
    saveLocalList(STORAGE_KEYS.INQUIRIES, local);

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('inquiries').delete().eq('id', id);
      } catch (err: any) {
        console.warn('Supabase deleteInquiry failed:', err?.message);
      }
    }
    return true;
  },

  // ── PARTNERSHIPS ─────────────────────────────────────────────────────────────

  async getPartnerships(): Promise<PartnershipLead[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('partnerships')
          .select('*')
          .order('createdAt', { ascending: false });
        if (!error && data && data.length > 0) {
          saveLocalList(STORAGE_KEYS.PARTNERSHIPS, data);
          return data as PartnershipLead[];
        }
      } catch (err: any) {
        console.warn('Supabase getPartnerships failed, using local cache:', err?.message);
      }
    }
    return getLocalList<PartnershipLead>(STORAGE_KEYS.PARTNERSHIPS);
  },

  async savePartnership(p: Omit<PartnershipLead, 'id' | 'createdAt' | 'status'>): Promise<PartnershipLead> {
    const local = getLocalList<PartnershipLead>(STORAGE_KEYS.PARTNERSHIPS);
    const seq = String(local.length + 501).padStart(3, '0');
    const newP: PartnershipLead = {
      ...p,
      id: `PRT-${new Date().getFullYear()}-${seq}`,
      createdAt: new Date().toISOString(),
      status: 'Pending'
    };

    local.unshift(newP);
    saveLocalList(STORAGE_KEYS.PARTNERSHIPS, local);

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('partnerships').insert(newP).select().single();
        if (!error && data) return data as PartnershipLead;
      } catch (err: any) {
        console.warn('Supabase savePartnership failed:', err?.message);
      }
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

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('partnerships')
          .update({ status })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data as PartnershipLead;
      } catch (err: any) {
        console.warn('Supabase updatePartnershipStatus failed:', err?.message);
      }
    }

    return idx !== -1 ? local[idx] : undefined;
  },

  async deletePartnership(id: string): Promise<boolean> {
    const local = getLocalList<PartnershipLead>(STORAGE_KEYS.PARTNERSHIPS).filter(p => p.id !== id);
    saveLocalList(STORAGE_KEYS.PARTNERSHIPS, local);

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('partnerships').delete().eq('id', id);
      } catch (err: any) {
        console.warn('Supabase deletePartnership failed:', err?.message);
      }
    }
    return true;
  },

  // ── CAREERS ──────────────────────────────────────────────────────────────────

  async getCareers(): Promise<CareerLead[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('careers')
          .select('*')
          .order('createdAt', { ascending: false });
        if (!error && data && data.length > 0) {
          saveLocalList(STORAGE_KEYS.CAREERS, data);
          return data as CareerLead[];
        }
      } catch (err: any) {
        console.warn('Supabase getCareers failed, using local cache:', err?.message);
      }
    }
    return getLocalList<CareerLead>(STORAGE_KEYS.CAREERS);
  },

  async saveCareer(c: Omit<CareerLead, 'id' | 'createdAt' | 'status'>): Promise<CareerLead> {
    const local = getLocalList<CareerLead>(STORAGE_KEYS.CAREERS);
    const seq = String(local.length + 201).padStart(3, '0');
    const newC: CareerLead = {
      ...c,
      id: `APP-${new Date().getFullYear()}-${seq}`,
      createdAt: new Date().toISOString(),
      status: 'Pending'
    };

    local.unshift(newC);
    saveLocalList(STORAGE_KEYS.CAREERS, local);

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('careers').insert(newC).select().single();
        if (!error && data) return data as CareerLead;
      } catch (err: any) {
        console.warn('Supabase saveCareer failed:', err?.message);
      }
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

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('careers')
          .update({ status })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data as CareerLead;
      } catch (err: any) {
        console.warn('Supabase updateCareerStatus failed:', err?.message);
      }
    }

    return idx !== -1 ? local[idx] : undefined;
  },

  async deleteCareer(id: string): Promise<boolean> {
    const local = getLocalList<CareerLead>(STORAGE_KEYS.CAREERS).filter(c => c.id !== id);
    saveLocalList(STORAGE_KEYS.CAREERS, local);

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('careers').delete().eq('id', id);
      } catch (err: any) {
        console.warn('Supabase deleteCareer failed:', err?.message);
      }
    }
    return true;
  },

  // ── CONSULTANTS ──────────────────────────────────────────────────────────────

  async getConsultants(): Promise<ConsultantLead[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('consultants')
          .select('*')
          .order('createdAt', { ascending: false });
        if (!error && data && data.length > 0) {
          saveLocalList(STORAGE_KEYS.CONSULTANTS, data);
          return data as ConsultantLead[];
        }
      } catch (err: any) {
        console.warn('Supabase getConsultants failed, using local cache:', err?.message);
      }
    }
    return getLocalList<ConsultantLead>(STORAGE_KEYS.CONSULTANTS);
  },

  async saveConsultant(c: Omit<ConsultantLead, 'id' | 'createdAt' | 'status'>): Promise<ConsultantLead> {
    const local = getLocalList<ConsultantLead>(STORAGE_KEYS.CONSULTANTS);
    const seq = String(local.length + 301).padStart(3, '0');
    const newC: ConsultantLead = {
      ...c,
      id: `CST-${new Date().getFullYear()}-${seq}`,
      createdAt: new Date().toISOString(),
      status: 'Pending'
    };

    local.unshift(newC);
    saveLocalList(STORAGE_KEYS.CONSULTANTS, local);

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('consultants').insert(newC).select().single();
        if (!error && data) return data as ConsultantLead;
      } catch (err: any) {
        console.warn('Supabase saveConsultant failed:', err?.message);
      }
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

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('consultants')
          .update({ status })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data as ConsultantLead;
      } catch (err: any) {
        console.warn('Supabase updateConsultantStatus failed:', err?.message);
      }
    }

    return idx !== -1 ? local[idx] : undefined;
  },

  async deleteConsultant(id: string): Promise<boolean> {
    const local = getLocalList<ConsultantLead>(STORAGE_KEYS.CONSULTANTS).filter(c => c.id !== id);
    saveLocalList(STORAGE_KEYS.CONSULTANTS, local);

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('consultants').delete().eq('id', id);
      } catch (err: any) {
        console.warn('Supabase deleteConsultant failed:', err?.message);
      }
    }
    return true;
  }
};
