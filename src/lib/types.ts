export type LeadStatus = 'Pending' | 'Reviewed' | 'Contacted' | 'Completed';

export interface BaseLead {
  id: string;
  createdAt: string;
  status: LeadStatus;
}

export interface QuoteLead extends BaseLead {
  name: string;
  company?: string;
  email: string;
  phone: string;
  service: string;
  wasteType?: string;
  location: string;
  timeline?: string;
  notes?: string;
}

export interface InquiryLead extends BaseLead {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface CareerLead extends BaseLead {
  fullName: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  qualification: string;
  cvFileName?: string;
  coverLetter?: string;
}

export interface ConsultantLead extends BaseLead {
  fullName: string;
  email: string;
  phone: string;
  specialization: string;
  experienceYears: string;
  certifications?: string;
  profileSummary: string;
}

export interface PartnershipLead extends BaseLead {
  organization: string;
  contactPerson: string;
  email: string;
  phone: string;
  track: string;
  scopeSummary: string;
}

export interface StorageData {
  quotes: QuoteLead[];
  inquiries: InquiryLead[];
  careers: CareerLead[];
  consultants: ConsultantLead[];
  partnerships: PartnershipLead[];
}
