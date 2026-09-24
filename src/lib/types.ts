export type LeadStatus =
  | 'Pending'
  | 'Reviewed'
  | 'Contacted'
  | 'Completed'
  | 'Empanelled'
  | 'Shortlisted'
  | 'Interviewed'
  | 'Active Project'
  | 'Hired';

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

export interface DriverApplicationLead extends BaseLead {
  fullName: string;
  dob?: string | null;
  gender?: string;
  phone: string;
  email: string;
  residentialAddress?: string;
  stateOfOrigin?: string;
  lga?: string;
  nationality?: string;
  maritalStatus?: string;
  dependants?: number;
  nin?: string;
  licenseNumber?: string;
  licenseClass?: string;
  licenseIssueDate?: string | null;
  licenseExpiryDate?: string | null;
  yearsExperience?: string;
  drivingTypes?: string;
  previousCompany?: string;
  previousPosition?: string;
  yearsWorked?: string;
  familiarRoutes?: string;
  drivingOutsideState?: string;
  accidentHistory?: string;
  accidentDetails?: string;
  trafficViolation?: string;
  violationDetails?: string;
  ownsVehicle?: string;
  vehicleOwnerName?: string;
  vehicleType?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: string;
  vehicleColour?: string;
  plateNumber?: string;
  vehicleRegNumber?: string;
  insurancePolicyNumber?: string;
  insuranceExpiryDate?: string | null;
  positionApplied?: string;
  preferredLocation?: string;
  preferredHours?: string;
  employmentType?: string;
  expectedSalary?: string;
  availableStartDate?: string | null;
  prevEmployerName?: string;
  prevEmployerPhone?: string;
  reasonForLeaving?: string;
  emergencyName?: string;
  emergencyRelationship?: string;
  emergencyPhone?: string;
  emergencyAltPhone?: string;
  emergencyAddress?: string;
  guarantorName?: string;
  guarantorPhone?: string;
  guarantorEmail?: string;
  guarantorAddress?: string;
  guarantorOccupation?: string;
  guarantorEmployer?: string;
  guarantorRelationship?: string;
  guarantorAttestation?: boolean;
  passportPhotoFile?: string;
  driverLicenseFile?: string;
  nationalIdFile?: string;
  roadworthinessCertFile?: string;
  fullDossier?: string;
}

export interface StorageData {
  quotes: QuoteLead[];
  inquiries: InquiryLead[];
  careers: CareerLead[];
  consultants: ConsultantLead[];
  partnerships: PartnershipLead[];
  driverApplications: DriverApplicationLead[];
}
