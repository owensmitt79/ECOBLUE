import { supabase } from './supabase';
import { QuoteLead, InquiryLead, CareerLead, ConsultantLead, PartnershipLead, LeadStatus } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// StorageService — Supabase-backed persistence layer
// All methods are async and return Promises.
// ─────────────────────────────────────────────────────────────────────────────

export const StorageService = {

  // ── QUOTES ──────────────────────────────────────────────────────────────────

  async getQuotes(): Promise<QuoteLead[]> {
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .order('createdAt', { ascending: false });
    if (error) { console.error('getQuotes error:', error.message); return []; }
    return (data ?? []) as QuoteLead[];
  },

  async getQuoteById(id: string): Promise<QuoteLead | undefined> {
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', id)
      .single();
    if (error) { console.error('getQuoteById error:', error.message); return undefined; }
    return data as QuoteLead;
  },

  async saveQuote(quote: Omit<QuoteLead, 'id' | 'createdAt' | 'status'>): Promise<QuoteLead> {
    // Get current count to generate a sequential ID
    const { count } = await supabase.from('quotes').select('*', { count: 'exact', head: true });
    const seq = String((count ?? 0) + 1).padStart(3, '0');
    const newQuote: QuoteLead = {
      ...quote,
      id: `QUO-${new Date().getFullYear()}-${seq}`,
      createdAt: new Date().toISOString(),
      status: 'Pending'
    };
    const { data, error } = await supabase.from('quotes').insert(newQuote).select().single();
    if (error) { console.error('saveQuote error:', error.message); return newQuote; }
    return data as QuoteLead;
  },

  async updateQuoteStatus(id: string, status: LeadStatus): Promise<QuoteLead | undefined> {
    const { data, error } = await supabase
      .from('quotes')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    if (error) { console.error('updateQuoteStatus error:', error.message); return undefined; }
    return data as QuoteLead;
  },

  async deleteQuote(id: string): Promise<boolean> {
    const { error } = await supabase.from('quotes').delete().eq('id', id);
    if (error) { console.error('deleteQuote error:', error.message); return false; }
    return true;
  },

  // ── INQUIRIES ────────────────────────────────────────────────────────────────

  async getInquiries(): Promise<InquiryLead[]> {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('createdAt', { ascending: false });
    if (error) { console.error('getInquiries error:', error.message); return []; }
    return (data ?? []) as InquiryLead[];
  },

  async saveInquiry(inquiry: Omit<InquiryLead, 'id' | 'createdAt' | 'status'>): Promise<InquiryLead> {
    const { count } = await supabase.from('inquiries').select('*', { count: 'exact', head: true });
    const seq = String((count ?? 0) + 101).padStart(3, '0');
    const newInquiry: InquiryLead = {
      ...inquiry,
      id: `INQ-${new Date().getFullYear()}-${seq}`,
      createdAt: new Date().toISOString(),
      status: 'Pending'
    };
    const { data, error } = await supabase.from('inquiries').insert(newInquiry).select().single();
    if (error) { console.error('saveInquiry error:', error.message); return newInquiry; }
    return data as InquiryLead;
  },

  async updateInquiryStatus(id: string, status: LeadStatus): Promise<InquiryLead | undefined> {
    const { data, error } = await supabase
      .from('inquiries')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    if (error) { console.error('updateInquiryStatus error:', error.message); return undefined; }
    return data as InquiryLead;
  },

  async deleteInquiry(id: string): Promise<boolean> {
    const { error } = await supabase.from('inquiries').delete().eq('id', id);
    if (error) { console.error('deleteInquiry error:', error.message); return false; }
    return true;
  },

  // ── PARTNERSHIPS ─────────────────────────────────────────────────────────────

  async getPartnerships(): Promise<PartnershipLead[]> {
    const { data, error } = await supabase
      .from('partnerships')
      .select('*')
      .order('createdAt', { ascending: false });
    if (error) { console.error('getPartnerships error:', error.message); return []; }
    return (data ?? []) as PartnershipLead[];
  },

  async savePartnership(p: Omit<PartnershipLead, 'id' | 'createdAt' | 'status'>): Promise<PartnershipLead> {
    const { count } = await supabase.from('partnerships').select('*', { count: 'exact', head: true });
    const seq = String((count ?? 0) + 501).padStart(3, '0');
    const newP: PartnershipLead = {
      ...p,
      id: `PRT-${new Date().getFullYear()}-${seq}`,
      createdAt: new Date().toISOString(),
      status: 'Pending'
    };
    const { data, error } = await supabase.from('partnerships').insert(newP).select().single();
    if (error) { console.error('savePartnership error:', error.message); return newP; }
    return data as PartnershipLead;
  },

  async updatePartnershipStatus(id: string, status: LeadStatus): Promise<PartnershipLead | undefined> {
    const { data, error } = await supabase
      .from('partnerships')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    if (error) { console.error('updatePartnershipStatus error:', error.message); return undefined; }
    return data as PartnershipLead;
  },

  async deletePartnership(id: string): Promise<boolean> {
    const { error } = await supabase.from('partnerships').delete().eq('id', id);
    if (error) { console.error('deletePartnership error:', error.message); return false; }
    return true;
  },

  // ── CAREERS ──────────────────────────────────────────────────────────────────

  async getCareers(): Promise<CareerLead[]> {
    const { data, error } = await supabase
      .from('careers')
      .select('*')
      .order('createdAt', { ascending: false });
    if (error) { console.error('getCareers error:', error.message); return []; }
    return (data ?? []) as CareerLead[];
  },

  async saveCareer(c: Omit<CareerLead, 'id' | 'createdAt' | 'status'>): Promise<CareerLead> {
    const { count } = await supabase.from('careers').select('*', { count: 'exact', head: true });
    const seq = String((count ?? 0) + 201).padStart(3, '0');
    const newC: CareerLead = {
      ...c,
      id: `APP-${new Date().getFullYear()}-${seq}`,
      createdAt: new Date().toISOString(),
      status: 'Pending'
    };
    const { data, error } = await supabase.from('careers').insert(newC).select().single();
    if (error) { console.error('saveCareer error:', error.message); return newC; }
    return data as CareerLead;
  },

  async updateCareerStatus(id: string, status: LeadStatus): Promise<CareerLead | undefined> {
    const { data, error } = await supabase
      .from('careers')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    if (error) { console.error('updateCareerStatus error:', error.message); return undefined; }
    return data as CareerLead;
  },

  async deleteCareer(id: string): Promise<boolean> {
    const { error } = await supabase.from('careers').delete().eq('id', id);
    if (error) { console.error('deleteCareer error:', error.message); return false; }
    return true;
  },

  // ── CONSULTANTS ──────────────────────────────────────────────────────────────

  async getConsultants(): Promise<ConsultantLead[]> {
    const { data, error } = await supabase
      .from('consultants')
      .select('*')
      .order('createdAt', { ascending: false });
    if (error) { console.error('getConsultants error:', error.message); return []; }
    return (data ?? []) as ConsultantLead[];
  },

  async saveConsultant(c: Omit<ConsultantLead, 'id' | 'createdAt' | 'status'>): Promise<ConsultantLead> {
    const { count } = await supabase.from('consultants').select('*', { count: 'exact', head: true });
    const seq = String((count ?? 0) + 301).padStart(3, '0');
    const newC: ConsultantLead = {
      ...c,
      id: `CST-${new Date().getFullYear()}-${seq}`,
      createdAt: new Date().toISOString(),
      status: 'Pending'
    };
    const { data, error } = await supabase.from('consultants').insert(newC).select().single();
    if (error) { console.error('saveConsultant error:', error.message); return newC; }
    return data as ConsultantLead;
  },

  async updateConsultantStatus(id: string, status: LeadStatus): Promise<ConsultantLead | undefined> {
    const { data, error } = await supabase
      .from('consultants')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    if (error) { console.error('updateConsultantStatus error:', error.message); return undefined; }
    return data as ConsultantLead;
  },

  async deleteConsultant(id: string): Promise<boolean> {
    const { error } = await supabase.from('consultants').delete().eq('id', id);
    if (error) { console.error('deleteConsultant error:', error.message); return false; }
    return true;
  },
};
