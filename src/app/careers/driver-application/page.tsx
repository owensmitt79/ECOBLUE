'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/Toast';

interface FileUploadState {
  passportPhoto?: File | null;
  driverLicense?: File | null;
  nationalId?: File | null;
  vehicleRegistration?: File | null;
  insuranceCert?: File | null;
  roadworthinessCert?: File | null;
  policeCheck?: File | null;
  guarantorId?: File | null;
  guarantorPhoto?: File | null;
  otherDocs?: File | null;
}

export default function DriverApplicationPage() {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  // 1. Personal Information
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [residentialAddress, setResidentialAddress] = useState('');
  const [stateOfOrigin, setStateOfOrigin] = useState('');
  const [lga, setLga] = useState('');
  const [nationality, setNationality] = useState('Nigerian');
  const [maritalStatus, setMaritalStatus] = useState('Single');
  const [dependants, setDependants] = useState('0');

  // 2. Identification Details
  const [nin, setNin] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseClass, setLicenseClass] = useState('Class E (Heavy Duty / Articulated / Compactor)');
  const [licenseIssueDate, setLicenseIssueDate] = useState('');
  const [licenseExpiryDate, setLicenseExpiryDate] = useState('');

  // 3. Driving Information
  const [yearsExperience, setYearsExperience] = useState('5+ years');
  const [drivingTypes, setDrivingTypes] = useState<string[]>([
    'Commercial Vehicle',
    'Truck',
    'Logistics/Delivery'
  ]);
  const [previousCompany, setPreviousCompany] = useState('');
  const [previousPosition, setPreviousPosition] = useState('');
  const [yearsWorked, setYearsWorked] = useState('');
  const [familiarRoutes, setFamiliarRoutes] = useState('');
  const [drivingOutsideState, setDrivingOutsideState] = useState<'Yes' | 'No'>('Yes');
  const [accidentHistory, setAccidentHistory] = useState<'Yes' | 'No'>('No');
  const [accidentDetails, setAccidentDetails] = useState('');
  const [trafficViolation, setTrafficViolation] = useState<'Yes' | 'No'>('No');
  const [violationDetails, setViolationDetails] = useState('');

  // 4. Vehicle Information
  const [ownsVehicle, setOwnsVehicle] = useState<'No' | 'Yes'>('No');
  const [vehicleOwnerName, setVehicleOwnerName] = useState('');
  const [vehicleType, setVehicleType] = useState('Truck');
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [vehicleColour, setVehicleColour] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [vehicleRegNumber, setVehicleRegNumber] = useState('');
  const [insurancePolicyNumber, setInsurancePolicyNumber] = useState('');
  const [insuranceExpiryDate, setInsuranceExpiryDate] = useState('');

  // 5. Employment Information
  const [positionApplied, setPositionApplied] = useState('Heavy-Duty Compactor Truck Driver');
  const [preferredLocation, setPreferredLocation] = useState('Port Harcourt Central & Trans-Amadi');
  const [preferredHours, setPreferredHours] = useState('Day Shift (6:00 AM - 3:00 PM)');
  const [employmentType, setEmploymentType] = useState('Full-Time');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [availableStartDate, setAvailableStartDate] = useState('');
  const [prevEmployerName, setPrevEmployerName] = useState('');
  const [prevEmployerPhone, setPrevEmployerPhone] = useState('');
  const [reasonForLeaving, setReasonForLeaving] = useState('');

  // 6. Emergency Contact
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyRelationship, setEmergencyRelationship] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [emergencyAltPhone, setEmergencyAltPhone] = useState('');
  const [emergencyAddress, setEmergencyAddress] = useState('');

  // 7. Guarantor Information
  const [guarantorName, setGuarantorName] = useState('');
  const [guarantorPhone, setGuarantorPhone] = useState('');
  const [guarantorEmail, setGuarantorEmail] = useState('');
  const [guarantorAddress, setGuarantorAddress] = useState('');
  const [guarantorOccupation, setGuarantorOccupation] = useState('');
  const [guarantorEmployer, setGuarantorEmployer] = useState('');
  const [guarantorRelationship, setGuarantorRelationship] = useState('');
  const [guarantorAttestation, setGuarantorAttestation] = useState(false);

  // 8. Files
  const [files, setFiles] = useState<FileUploadState>({});

  const handleFileChange = (field: keyof FileUploadState, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFiles(prev => ({ ...prev, [field]: file }));
      showToast('Document Selected', `${file.name} ready for verification.`, 'info');
    }
  };

  const toggleDrivingType = (type: string) => {
    setDrivingTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!guarantorAttestation) {
      showToast('Attestation Required', 'Please confirm the guarantor attestation checkbox.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const driverRefId = `DRV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      // Full dossier text (kept for admin reference in fullDossier column)
      const dossierLines: string[] = [
        '=== OFFICIAL ECOBLUE DRIVER RECRUITMENT APPLICATION ===',
        `Ref Code: ${driverRefId}`,
        `Submission Date: ${new Date().toLocaleString('en-NG')}`,
        '',
        '1. PERSONAL INFORMATION:',
        `- Full Name: ${fullName}`,
        `- Date of Birth: ${dob}`,
        `- Gender: ${gender}`,
        `- Phone: ${phone}`,
        `- Email: ${email}`,
        `- Address: ${residentialAddress}`,
        `- State: ${stateOfOrigin} / LGA: ${lga}`,
        `- Nationality: ${nationality}`,
        `- Marital Status: ${maritalStatus}`,
        `- Dependants: ${dependants}`,
        '',
        '2. IDENTIFICATION:',
        `- NIN: ${nin}`,
        `- License No: ${licenseNumber}`,
        `- License Class: ${licenseClass}`,
        `- Issue Date: ${licenseIssueDate}`,
        `- Expiry Date: ${licenseExpiryDate}`,
        '',
        '3. DRIVING EXPERIENCE:',
        `- Years: ${yearsExperience}`,
        `- Types: ${drivingTypes.join(', ')}`,
        `- Prev Company: ${previousCompany || 'N/A'}`,
        `- Prev Position: ${previousPosition || 'N/A'}`,
        `- Years Worked: ${yearsWorked || 'N/A'}`,
        `- Routes: ${familiarRoutes}`,
        `- Outside State: ${drivingOutsideState}`,
        `- Accident History: ${accidentHistory}${accidentHistory === 'Yes' ? (' - ' + accidentDetails) : ''}`,
        `- Traffic Violations: ${trafficViolation}${trafficViolation === 'Yes' ? (' - ' + violationDetails) : ''}`,
        '',
        '4. VEHICLE:',
        `- Owns Vehicle: ${ownsVehicle}`,
        ownsVehicle === 'Yes'
          ? `- Owner: ${vehicleOwnerName}\n- Type: ${vehicleType}\n- Make/Model/Year: ${vehicleMake} ${vehicleModel} (${vehicleYear})\n- Colour: ${vehicleColour}\n- Plate: ${plateNumber}\n- Reg No: ${vehicleRegNumber}\n- Insurance: ${insurancePolicyNumber} (Expires: ${insuranceExpiryDate})`
          : '- N/A (Fleet Truck Operations)',
        '',
        '5. EMPLOYMENT:',
        `- Position: ${positionApplied}`,
        `- Location: ${preferredLocation}`,
        `- Shift: ${preferredHours}`,
        `- Type: ${employmentType}`,
        `- Salary: ${expectedSalary || 'Standard Company Scale'}`,
        `- Start Date: ${availableStartDate || 'Immediate'}`,
        `- Prev Employer: ${prevEmployerName} (${prevEmployerPhone})`,
        `- Reason for Leaving: ${reasonForLeaving}`,
        '',
        '6. EMERGENCY CONTACT:',
        `- Name: ${emergencyName}`,
        `- Relationship: ${emergencyRelationship}`,
        `- Phone: ${emergencyPhone} / ${emergencyAltPhone || 'N/A'}`,
        `- Address: ${emergencyAddress}`,
        '',
        '7. GUARANTOR:',
        `- Name: ${guarantorName}`,
        `- Phone: ${guarantorPhone} | Email: ${guarantorEmail}`,
        `- Address: ${guarantorAddress}`,
        `- Occupation: ${guarantorOccupation} at ${guarantorEmployer}`,
        `- Relationship: ${guarantorRelationship}`,
        '- Attestation: Confirmed',
        '',
        '8. DOCUMENTS:',
        `- Passport: ${files.passportPhoto ? files.passportPhoto.name : 'Pending'}`,
        `- License: ${files.driverLicense ? files.driverLicense.name : 'Pending'}`,
        `- National ID: ${files.nationalId ? files.nationalId.name : 'Pending'}`,
        `- Roadworthiness: ${files.roadworthinessCert ? files.roadworthinessCert.name : 'N/A'}`,
      ];
      const fullDossier = dossierLines.join('\n');

      // Structured payload — maps to all driver_applications table columns
      const driverPayload = {
        id: driverRefId,
        fullName: fullName.trim(),
        dob: dob || null,
        gender,
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        residentialAddress,
        stateOfOrigin,
        lga,
        nationality,
        maritalStatus,
        dependants: parseInt(dependants) || 0,
        nin,
        licenseNumber,
        licenseClass,
        licenseIssueDate: licenseIssueDate || null,
        licenseExpiryDate: licenseExpiryDate || null,
        yearsExperience,
        drivingTypes: drivingTypes.join(', '),
        previousCompany,
        previousPosition,
        yearsWorked,
        familiarRoutes,
        drivingOutsideState,
        accidentHistory,
        accidentDetails: accidentHistory === 'Yes' ? accidentDetails : '',
        trafficViolation,
        violationDetails: trafficViolation === 'Yes' ? violationDetails : '',
        ownsVehicle,
        vehicleOwnerName: ownsVehicle === 'Yes' ? vehicleOwnerName : '',
        vehicleType: ownsVehicle === 'Yes' ? vehicleType : '',
        vehicleMake: ownsVehicle === 'Yes' ? vehicleMake : '',
        vehicleModel: ownsVehicle === 'Yes' ? vehicleModel : '',
        vehicleYear: ownsVehicle === 'Yes' ? vehicleYear : '',
        vehicleColour: ownsVehicle === 'Yes' ? vehicleColour : '',
        plateNumber: ownsVehicle === 'Yes' ? plateNumber : '',
        vehicleRegNumber: ownsVehicle === 'Yes' ? vehicleRegNumber : '',
        insurancePolicyNumber: ownsVehicle === 'Yes' ? insurancePolicyNumber : '',
        insuranceExpiryDate: ownsVehicle === 'Yes' && insuranceExpiryDate ? insuranceExpiryDate : null,
        positionApplied,
        preferredLocation,
        preferredHours,
        employmentType,
        expectedSalary,
        availableStartDate: availableStartDate || null,
        prevEmployerName,
        prevEmployerPhone,
        reasonForLeaving,
        emergencyName,
        emergencyRelationship,
        emergencyPhone,
        emergencyAltPhone,
        emergencyAddress,
        guarantorName,
        guarantorPhone,
        guarantorEmail,
        guarantorAddress,
        guarantorOccupation,
        guarantorEmployer,
        guarantorRelationship,
        guarantorAttestation: true,
        passportPhotoFile: files.passportPhoto?.name || '',
        driverLicenseFile: files.driverLicense?.name || '',
        nationalIdFile: files.nationalId?.name || '',
        roadworthinessCertFile: files.roadworthinessCert?.name || '',
        fullDossier
      };

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'driver_applications', data: driverPayload })
      });

      if (!res.ok) {
        throw new Error('Failed to record driver application.');
      }

      setSubmittedRef(driverRefId);
      showToast('Application Logged', 'Your driver registration has been securely queued.', 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Driver submission failed:', err);
      showToast('Submission Failed', 'Could not record application. Please try again or visit our headquarters.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const experienceOptionList = [
    'Private Vehicle',
    'Commercial Vehicle',
    'Bus',
    'Truck',
    'Taxi',
    'Ride-Hailing',
    'Logistics/Delivery',
    'Other'
  ];

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', paddingBottom: '5rem' }}>
      {/* Hero Header */}
      <section
        className="page-header"
        style={{
          position: 'relative',
          padding: '4.5rem 0 3.5rem 0',
          background: `linear-gradient(135deg, rgba(6, 44, 67, 0.90) 0%, rgba(11, 66, 97, 0.84) 100%), url('/images/careers-hero.jpg') center/cover no-repeat`,
          color: '#ffffff',
          textAlign: 'center',
          boxShadow: 'inset 0 -30px 40px -20px rgba(6, 44, 67, 0.8)'
        }}
      >
        <div className="container" style={{ maxWidth: '860px', position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.85rem',
              color: '#94A3B8',
              marginBottom: '1rem'
            }}
          >
            <Link href="/" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <Link href="/careers" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Careers</Link>
            <span>/</span>
            <span style={{ color: '#6EE7B7', fontWeight: 600 }}>Driver Application Form</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.1rem, 4vw, 3.2rem)',
              color: '#ffffff',
              fontWeight: 800,
              lineHeight: 1.18,
              marginBottom: '1rem',
              textShadow: '0 2px 12px rgba(0, 0, 0, 0.4)'
            }}
          >
            Driver Employment & Application Form
          </h1>
          <p
            style={{
              maxWidth: '720px',
              margin: '0 auto',
              fontSize: '1.1rem',
              color: '#E2EBF0',
              lineHeight: 1.6,
              textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)'
            }}
          >
            Join EcoBlue’s mechanized waste evacuation fleet. Complete the official 8-part driver recruitment dossier below for commercial haulage, compactor truck, and logistics operations in Port Harcourt.
          </p>
        </div>
      </section>

      {/* Main Form Content */}
      <div className="container" style={{ maxWidth: '920px', marginTop: '-2rem', position: 'relative', zIndex: 10 }}>
        {submittedRef ? (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '48px 36px',
              textAlign: 'center',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid #E2E8F0'
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                backgroundColor: 'rgba(46, 154, 60, 0.12)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
                color: 'var(--color-primary-green)'
              }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 style={{ fontSize: '2rem', color: 'var(--color-primary-navy)', fontWeight: 800, marginBottom: '0.75rem' }}>
              Driver Application Received
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)', maxWidth: '640px', margin: '0 auto 1.75rem auto', lineHeight: 1.6 }}>
              Your complete 8-section driver application has been registered in the EcoBlue Fleet Operations system.
            </p>

            <div
              style={{
                backgroundColor: '#F1F5F9',
                borderRadius: '12px',
                padding: '20px',
                maxWidth: '480px',
                margin: '0 auto 2rem auto',
                border: '1px dashed #CBD5E1'
              }}
            >
              <div style={{ fontSize: '0.85rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                Application Tracking Reference
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary-navy)', letterSpacing: '0.08em' }}>
                {submittedRef}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '6px' }}>
                Applicant: <strong>{fullName}</strong> ({positionApplied})
              </div>
            </div>

            <div style={{ textAlign: 'left', backgroundColor: '#F8FAFC', borderRadius: '12px', padding: '24px', maxWidth: '640px', margin: '0 auto 2rem auto', border: '1px solid #E2E8F0' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--color-primary-navy)', fontWeight: 700, marginBottom: '10px' }}>
                Next Verification Steps:
              </h4>
              <ul style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', lineHeight: 1.7, paddingLeft: '20px' }}>
                <li><strong>Document Review:</strong> Our Fleet HSE team will verify your driver's license and national identification credentials.</li>
                <li><strong>Physical Assessment:</strong> Shortlisted candidates will be invited via SMS / WhatsApp for a practical driving assessment on EcoBlue hydraulic compactor trucks.</li>
                <li><strong>Medical & Eye Exam:</strong> Compulsory drug testing and vision screening at our Port Harcourt medical partner facility.</li>
                <li><strong>Guarantor Confirmation:</strong> Your nominated guarantor will be contacted prior to final engagement.</li>
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/careers" className="btn btn-outline" style={{ padding: '12px 24px' }}>
                Back to Careers
              </Link>
              <Link href="/contact" className="btn btn-primary" style={{ padding: '12px 24px' }}>
                Contact Fleet Office
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              padding: '40px',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid #E2E8F0'
            }}
          >
            {/* Header intro */}
            <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '24px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span
                  style={{
                    backgroundColor: 'rgba(46, 154, 60, 0.12)',
                    color: 'var(--color-primary-green)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  Official Recruitment
                </span>
                <span style={{ fontSize: '0.85rem', color: '#64748B' }}>Rivers State Operations</span>
              </div>
              <h2 style={{ fontSize: '1.75rem', color: 'var(--color-primary-navy)', fontWeight: 800 }}>
                EcoBlue Driver Registration Dossier
              </h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginTop: '6px' }}>
                All fields marked with an asterisk (*) are mandatory under Rivers State environmental transport guidelines.
              </p>
            </div>

            {/* SECTION 1: Personal Information */}
            <div style={{ marginBottom: '36px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-primary-navy)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.95rem' }}>
                  1
                </div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-navy)', fontWeight: 700, margin: 0 }}>
                  Personal Information
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px', marginBottom: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Belema Kingsley Briggs"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={e => setDob(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Gender *
                  </label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem', backgroundColor: '#fff' }}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px', marginBottom: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Phone Number (WhatsApp Active) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0803 123 4567"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="driver@gmail.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Nationality
                  </label>
                  <input
                    type="text"
                    value={nationality}
                    onChange={e => setNationality(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Current Residential Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Street Address, Area/Community (e.g. 14 Woji Road, GRA Phase 2, Port Harcourt)"
                  value={residentialAddress}
                  onChange={e => setResidentialAddress(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    State of Origin *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rivers State"
                    value={stateOfOrigin}
                    onChange={e => setStateOfOrigin(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Local Government Area (LGA) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Port Harcourt City / Obio-Akpor"
                    value={lga}
                    onChange={e => setLga(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Marital Status
                  </label>
                  <select
                    value={maritalStatus}
                    onChange={e => setMaritalStatus(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem', backgroundColor: '#fff' }}
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Number of Dependants
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={dependants}
                    onChange={e => setDependants(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem' }}
                  />
                </div>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '32px 0' }} />

            {/* SECTION 2: Identification Details */}
            <div style={{ marginBottom: '36px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-primary-navy)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.95rem' }}>
                  2
                </div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-navy)', fontWeight: 700, margin: 0 }}>
                  Identification & Licensing
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px', marginBottom: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    National ID Number (NIN) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="11-digit NIN Number"
                    maxLength={11}
                    value={nin}
                    onChange={e => setNin(e.target.value.replace(/[^0-9]/g, ''))}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Driver's License Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RV0012345678"
                    value={licenseNumber}
                    onChange={e => setLicenseNumber(e.target.value.toUpperCase())}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Driver's License Class / Category *
                  </label>
                  <select
                    value={licenseClass}
                    onChange={e => setLicenseClass(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem', backgroundColor: '#fff' }}
                  >
                    <option value="Class E (Heavy Duty / Articulated / Compactor)">Class E (Heavy Duty / Articulated / Compactor)</option>
                    <option value="Class D (Commercial Truck / Bus)">Class D (Commercial Truck / Bus)</option>
                    <option value="Class C (Light Commercial / Van)">Class C (Light Commercial / Van)</option>
                    <option value="Class B (Private Car / Saloon)">Class B (Private Car / Saloon)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    License Issue Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={licenseIssueDate}
                    onChange={e => setLicenseIssueDate(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    License Expiry Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={licenseExpiryDate}
                    onChange={e => setLicenseExpiryDate(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem' }}
                  />
                </div>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '32px 0' }} />

            {/* SECTION 3: Driving Information */}
            <div style={{ marginBottom: '36px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-primary-navy)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.95rem' }}>
                  3
                </div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-navy)', fontWeight: 700, margin: 0 }}>
                  Driving Information & Track Record
                </h3>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Years of Professional Driving Experience *
                </label>
                <select
                  value={yearsExperience}
                  onChange={e => setYearsExperience(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem', backgroundColor: '#fff' }}
                >
                  <option value="1-2 years">1-2 years</option>
                  <option value="3-5 years">3-5 years</option>
                  <option value="5-10 years">5-10 years</option>
                  <option value="10+ years">10+ years</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                  Type of Driving Experience (Select all that apply) *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '10px' }}>
                  {experienceOptionList.map(type => {
                    const isChecked = drivingTypes.includes(type);
                    return (
                      <label
                        key={type}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: isChecked ? '1.5px solid var(--color-primary-green)' : '1px solid #CBD5E1',
                          backgroundColor: isChecked ? 'rgba(46, 154, 60, 0.08)' : '#FFFFFF',
                          cursor: 'pointer',
                          fontSize: '0.88rem',
                          fontWeight: isChecked ? 600 : 400,
                          color: isChecked ? 'var(--color-primary-navy)' : '#334155'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleDrivingType(type)}
                          style={{ accentColor: 'var(--color-primary-green)' }}
                        />
                        {type}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px', marginBottom: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Previous Transport/Haulage Company
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Julius Berger, Rivers State Transport, Dangote"
                    value={previousCompany}
                    onChange={e => setPreviousCompany(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Previous Position Held
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Heavy Tipper Driver, Bus Captain, Compactor Operator"
                    value={previousPosition}
                    onChange={e => setPreviousPosition(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Years Worked at Previous Position
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 3 Years (2021 - 2024)"
                    value={yearsWorked}
                    onChange={e => setYearsWorked(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Main Areas / Routes You Are Familiar With in Rivers State *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aba Road, Ikwerre Road, Trans-Amadi, Eleme, Onne, Oyigbo, Choba, Peter Odili Road"
                  value={familiarRoutes}
                  onChange={e => setFamiliarRoutes(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
                <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    Experience Driving Outside Rivers State?
                  </label>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="drivingOutsideState"
                        value="Yes"
                        checked={drivingOutsideState === 'Yes'}
                        onChange={() => setDrivingOutsideState('Yes')}
                      />
                      Yes
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="drivingOutsideState"
                        value="No"
                        checked={drivingOutsideState === 'No'}
                        onChange={() => setDrivingOutsideState('No')}
                      />
                      No
                    </label>
                  </div>
                </div>

                <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    Accident History?
                  </label>
                  <div style={{ display: 'flex', gap: '20px', marginBottom: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="accidentHistory"
                        value="No"
                        checked={accidentHistory === 'No'}
                        onChange={() => setAccidentHistory('No')}
                      />
                      No
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="accidentHistory"
                        value="Yes"
                        checked={accidentHistory === 'Yes'}
                        onChange={() => setAccidentHistory('Yes')}
                      />
                      Yes
                    </label>
                  </div>
                  {accidentHistory === 'Yes' && (
                    <input
                      type="text"
                      placeholder="Please briefly explain what occurred and when..."
                      value={accidentDetails}
                      onChange={e => setAccidentDetails(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                    />
                  )}
                </div>

                <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    Traffic Violation History (FRSC / TIMARIV)?
                  </label>
                  <div style={{ display: 'flex', gap: '20px', marginBottom: '8px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="trafficViolation"
                        value="No"
                        checked={trafficViolation === 'No'}
                        onChange={() => setTrafficViolation('No')}
                      />
                      No
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="trafficViolation"
                        value="Yes"
                        checked={trafficViolation === 'Yes'}
                        onChange={() => setTrafficViolation('Yes')}
                      />
                      Yes
                    </label>
                  </div>
                  {trafficViolation === 'Yes' && (
                    <input
                      type="text"
                      placeholder="Specify infraction and issuing agency..."
                      value={violationDetails}
                      onChange={e => setViolationDetails(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                    />
                  )}
                </div>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '32px 0' }} />

            {/* SECTION 4: Vehicle Information (Conditional) */}
            <div style={{ marginBottom: '36px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-primary-navy)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.95rem' }}>
                  4
                </div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-navy)', fontWeight: 700, margin: 0 }}>
                  Vehicle Information
                </h3>
              </div>

              <div style={{ backgroundColor: '#F1F5F9', padding: '18px', borderRadius: '12px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--color-primary-navy)' }}>
                      Do you own or bring a vehicle for contracted logistics/haulage?
                    </strong>
                    <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
                      If applying to drive EcoBlue company fleet compactor trucks, select "No".
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 600 }}>
                      <input
                        type="radio"
                        name="ownsVehicle"
                        value="No"
                        checked={ownsVehicle === 'No'}
                        onChange={() => setOwnsVehicle('No')}
                      />
                      No (Company Fleet)
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 600 }}>
                      <input
                        type="radio"
                        name="ownsVehicle"
                        value="Yes"
                        checked={ownsVehicle === 'Yes'}
                        onChange={() => setOwnsVehicle('Yes')}
                      />
                      Yes (Driver Owned)
                    </label>
                  </div>
                </div>
              </div>

              {ownsVehicle === 'Yes' && (
                <div style={{ border: '1px solid #CBD5E1', borderRadius: '14px', padding: '24px', backgroundColor: '#FAFCFF', marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '1rem', color: 'var(--color-primary-navy)', fontWeight: 700, marginBottom: '16px' }}>
                    Vehicle Particulars & Registration
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                        Vehicle Owner's Name
                      </label>
                      <input
                        type="text"
                        placeholder="Name as registered on vehicle documents"
                        value={vehicleOwnerName}
                        onChange={e => setVehicleOwnerName(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                        Vehicle Type
                      </label>
                      <select
                        value={vehicleType}
                        onChange={e => setVehicleType(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', backgroundColor: '#fff' }}
                      >
                        <option value="Truck">Truck (Tipper / Compactor / Flatbed)</option>
                        <option value="Van">Van / Panel Van</option>
                        <option value="Bus">Bus / Coaster</option>
                        <option value="Minibus">Minibus / Hiace</option>
                        <option value="Car">Car / Saloon</option>
                        <option value="SUV">SUV</option>
                        <option value="Motorcycle">Motorcycle</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                        Vehicle Make & Model
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Mack Vision / Mercedes Actros"
                        value={vehicleMake}
                        onChange={e => setVehicleMake(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                        Year of Manufacture
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 2018"
                        value={vehicleYear}
                        onChange={e => setVehicleYear(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                        Vehicle Colour
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Green / Blue / White"
                        value={vehicleColour}
                        onChange={e => setVehicleColour(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                        Number Plate
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. RUM-123-XA"
                        value={plateNumber}
                        onChange={e => setPlateNumber(e.target.value.toUpperCase())}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                        Vehicle Registration No.
                      </label>
                      <input
                        type="text"
                        placeholder="State Internal Revenue No."
                        value={vehicleRegNumber}
                        onChange={e => setVehicleRegNumber(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                        Insurance Policy Number
                      </label>
                      <input
                        type="text"
                        placeholder="Policy Ref"
                        value={insurancePolicyNumber}
                        onChange={e => setInsurancePolicyNumber(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                        Insurance Expiry Date
                      </label>
                      <input
                        type="date"
                        value={insuranceExpiryDate}
                        onChange={e => setInsuranceExpiryDate(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '32px 0' }} />

            {/* SECTION 5: Employment Information */}
            <div style={{ marginBottom: '36px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-primary-navy)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.95rem' }}>
                  5
                </div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-navy)', fontWeight: 700, margin: 0 }}>
                  Employment Preferences & Availability
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px', marginBottom: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Position Applied For *
                  </label>
                  <select
                    value={positionApplied}
                    onChange={e => setPositionApplied(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem', backgroundColor: '#fff' }}
                  >
                    <option value="Heavy-Duty Compactor Truck Driver">Heavy-Duty Compactor Truck Driver (Class-E)</option>
                    <option value="Roll-on / Roll-off Skip Hauler">Roll-on / Roll-off Skip Hauler</option>
                    <option value="Industrial Sanitation Dispatch Driver">Industrial Sanitation Dispatch Driver</option>
                    <option value="Recycling Logistics & Transfer Truck Driver">Recycling Logistics & Transfer Truck Driver</option>
                    <option value="Light Commercial Collection Van Driver">Light Commercial Collection Van Driver</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Preferred Operational Base *
                  </label>
                  <select
                    value={preferredLocation}
                    onChange={e => setPreferredLocation(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem', backgroundColor: '#fff' }}
                  >
                    <option value="Port Harcourt Central & Trans-Amadi">Port Harcourt Central & Trans-Amadi</option>
                    <option value="Obio-Akpor & Ikwerre Road Axis">Obio-Akpor & Ikwerre Road Axis</option>
                    <option value="Eleme & Industrial Waterfront Belt">Eleme & Industrial Waterfront Belt</option>
                    <option value="GRA & Residential Enclaves">GRA & Residential Enclaves</option>
                    <option value="Any Operational Base in Rivers State">Any Operational Base in Rivers State</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Preferred Shift *
                  </label>
                  <select
                    value={preferredHours}
                    onChange={e => setPreferredHours(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem', backgroundColor: '#fff' }}
                  >
                    <option value="Day Shift (6:00 AM - 3:00 PM)">Day Shift (6:00 AM - 3:00 PM)</option>
                    <option value="Night Evacuation Shift (8:00 PM - 5:00 AM)">Night Evacuation Shift (8:00 PM - 5:00 AM)</option>
                    <option value="Flexible / Rotating Dispatch">Flexible / Rotating Dispatch</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px', marginBottom: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Engagement Type *
                  </label>
                  <select
                    value={employmentType}
                    onChange={e => setEmploymentType(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem', backgroundColor: '#fff' }}
                  >
                    <option value="Full-Time">Full-Time (Direct Staff)</option>
                    <option value="Part-Time / Weekend Relief">Part-Time / Weekend Relief</option>
                    <option value="Contract Dispatch">Contract Dispatch</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Expected Monthly Remuneration (NGN)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₦120,000 - ₦180,000"
                    value={expectedSalary}
                    onChange={e => setExpectedSalary(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Available Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={availableStartDate}
                    onChange={e => setAvailableStartDate(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px', marginBottom: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Previous Employer / Fleet Supervisor Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Chief Okon (Fleet Manager)"
                    value={prevEmployerName}
                    onChange={e => setPrevEmployerName(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Previous Employer's Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="0802 345 6789"
                    value={prevEmployerPhone}
                    onChange={e => setPrevEmployerPhone(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Reason for Leaving Previous Employment
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. End of project contract, relocation to Port Harcourt, seeking career progression..."
                  value={reasonForLeaving}
                  onChange={e => setReasonForLeaving(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem', fontFamily: 'inherit' }}
                />
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '32px 0' }} />

            {/* SECTION 6: Emergency Contact */}
            <div style={{ marginBottom: '36px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-primary-navy)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.95rem' }}>
                  6
                </div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-navy)', fontWeight: 700, margin: 0 }}>
                  Emergency Contact Details
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px', marginBottom: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Full Name of Emergency Contact *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Marybelema Briggs"
                    value={emergencyName}
                    onChange={e => setEmergencyName(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Relationship to Applicant *
                  </label>
                  <select
                    value={emergencyRelationship}
                    onChange={e => setEmergencyRelationship(e.target.value)}
                    required
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem', backgroundColor: '#fff' }}
                  >
                    <option value="">Select relationship</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Child">Child</option>
                    <option value="Next of Kin">Next of Kin</option>
                    <option value="Relative">Relative</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px', marginBottom: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Primary Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0803 987 6543"
                    value={emergencyPhone}
                    onChange={e => setEmergencyPhone(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Alternative Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="0805 111 2233"
                    value={emergencyAltPhone}
                    onChange={e => setEmergencyAltPhone(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Residential Address of Emergency Contact *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Full street and city address"
                  value={emergencyAddress}
                  onChange={e => setEmergencyAddress(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem' }}
                />
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '32px 0' }} />

            {/* SECTION 7: Guarantor Information */}
            <div style={{ marginBottom: '36px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-primary-navy)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.95rem' }}>
                  7
                </div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-navy)', fontWeight: 700, margin: 0 }}>
                  Guarantor Information
                </h3>
              </div>

              <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '16px' }}>
                EcoBlue fleet policy requires a responsible guarantor (civil servant, corporate professional, certified business owner, or community leader) who can attest to your character.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px', marginBottom: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Guarantor's Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Barrister / Engr. / Mr. ..."
                    value={guarantorName}
                    onChange={e => setGuarantorName(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0803 000 0000"
                    value={guarantorPhone}
                    onChange={e => setGuarantorPhone(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="guarantor@domain.com"
                    value={guarantorEmail}
                    onChange={e => setGuarantorEmail(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px', marginBottom: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Occupation / Professional Designation *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Civil Servant, Business Director"
                    value={guarantorOccupation}
                    onChange={e => setGuarantorOccupation(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Employer or Registered Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ministry of Transport / Private Ltd."
                    value={guarantorEmployer}
                    onChange={e => setGuarantorEmployer(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Relationship to Applicant *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Community Mentor / Uncle / Senior Colleague"
                    value={guarantorRelationship}
                    onChange={e => setGuarantorRelationship(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Guarantor Residential Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Guarantor street and residential location"
                  value={guarantorAddress}
                  onChange={e => setGuarantorAddress(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.95rem' }}
                />
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '18px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '0.88rem', color: '#334155', lineHeight: 1.5 }}>
                  <input
                    type="checkbox"
                    checked={guarantorAttestation}
                    onChange={e => setGuarantorAttestation(e.target.checked)}
                    style={{ marginTop: '3px', accentColor: 'var(--color-primary-green)' }}
                    required
                  />
                  <span>
                    <strong>Applicant & Guarantor Attestation Declaration:</strong> I hereby certify that the information provided is true, complete, and verifiable. I understand that false statements or concealment of traffic violations or license disqualification will lead to immediate cancellation of recruitment and potential reporting to law enforcement authorities.
                  </span>
                </label>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '32px 0' }} />

            {/* SECTION 8: Document Upload */}
            <div style={{ marginBottom: '36px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-primary-navy)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.95rem' }}>
                  8
                </div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-navy)', fontWeight: 700, margin: 0 }}>
                  Document Verification & Upload
                </h3>
              </div>

              <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '20px' }}>
                Upload clear scans or photos of your credentials (PNG, JPG, PDF, max 10MB per file). Physical copies will also be inspected during orientation.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
                {/* 1. Passport Photo */}
                <div style={{ border: '1px dashed #CBD5E1', padding: '16px', borderRadius: '12px', backgroundColor: '#F8FAFC' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary-navy)', marginBottom: '4px' }}>
                    Passport Photograph *
                  </label>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '8px' }}>Recent colored photo with clear face</div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleFileChange('passportPhoto', e)}
                    style={{ fontSize: '0.85rem' }}
                  />
                  {files.passportPhoto && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-primary-green)', fontWeight: 600, marginTop: '6px' }}>
                      Selected: {files.passportPhoto.name}
                    </div>
                  )}
                </div>

                {/* 2. Driver's License */}
                <div style={{ border: '1px dashed #CBD5E1', padding: '16px', borderRadius: '12px', backgroundColor: '#F8FAFC' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary-navy)', marginBottom: '4px' }}>
                    Driver's License (Front & Back) *
                  </label>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '8px' }}>Valid FRSC issued license</div>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={e => handleFileChange('driverLicense', e)}
                    style={{ fontSize: '0.85rem' }}
                  />
                  {files.driverLicense && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-primary-green)', fontWeight: 600, marginTop: '6px' }}>
                      Selected: {files.driverLicense.name}
                    </div>
                  )}
                </div>

                {/* 3. National ID (NIN) */}
                <div style={{ border: '1px dashed #CBD5E1', padding: '16px', borderRadius: '12px', backgroundColor: '#F8FAFC' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary-navy)', marginBottom: '4px' }}>
                    National ID / NIN Slip *
                  </label>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '8px' }}>NIMC official identification slip</div>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={e => handleFileChange('nationalId', e)}
                    style={{ fontSize: '0.85rem' }}
                  />
                  {files.nationalId && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-primary-green)', fontWeight: 600, marginTop: '6px' }}>
                      Selected: {files.nationalId.name}
                    </div>
                  )}
                </div>

                {/* 4. Vehicle Registration */}
                <div style={{ border: '1px dashed #CBD5E1', padding: '16px', borderRadius: '12px', backgroundColor: '#F8FAFC' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary-navy)', marginBottom: '4px' }}>
                    Vehicle Registration (If Applicable)
                  </label>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '8px' }}>Proof of ownership or lease</div>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={e => handleFileChange('vehicleRegistration', e)}
                    style={{ fontSize: '0.85rem' }}
                  />
                  {files.vehicleRegistration && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-primary-green)', fontWeight: 600, marginTop: '6px' }}>
                      Selected: {files.vehicleRegistration.name}
                    </div>
                  )}
                </div>



                {/* 6. Roadworthiness */}
                <div style={{ border: '1px dashed #CBD5E1', padding: '16px', borderRadius: '12px', backgroundColor: '#F8FAFC' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary-navy)', marginBottom: '4px' }}>
                    Roadworthiness Certificate
                  </label>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '8px' }}>Current Rivers VIO certificate</div>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={e => handleFileChange('roadworthinessCert', e)}
                    style={{ fontSize: '0.85rem' }}
                  />
                  {files.roadworthinessCert && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-primary-green)', fontWeight: 600, marginTop: '6px' }}>
                      Selected: {files.roadworthinessCert.name}
                    </div>
                  )}
                </div>



                {/* 8. Guarantor ID / Additional Documents */}
                <div style={{ border: '1px dashed #CBD5E1', padding: '16px', borderRadius: '12px', backgroundColor: '#F8FAFC' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary-navy)', marginBottom: '4px' }}>
                    Guarantor ID & Reference Documents
                  </label>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '8px' }}>Guarantor valid ID card or letter</div>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={e => handleFileChange('guarantorId', e)}
                    style={{ fontSize: '0.85rem' }}
                  />
                  {files.guarantorId && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-primary-green)', fontWeight: 600, marginTop: '6px' }}>
                      Selected: {files.guarantorId.name}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
                style={{
                  padding: '16px 48px',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  boxShadow: 'var(--shadow-lg)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }} />
                    Submitting Driver Dossier...
                  </>
                ) : (
                  <>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                    Submit Driver Application Form
                  </>
                )}
              </button>
              <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '12px' }}>
                Protected by 256-bit encryption. Applications are reviewed directly by the EcoBlue Fleet Logistics Directorate in Port Harcourt.
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
