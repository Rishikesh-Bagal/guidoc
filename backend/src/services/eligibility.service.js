const Document = require('../models/Document');

/**
 * Service to handle personalized eligibility checks
 */
class EligibilityService {
  /**
   * Evaluate eligibility based on document type and provided answers.
   * @param {string} documentType (e.g., 'pan', 'aadhaar', 'passport', 'driving-license', 'income-certificate')
   * @param {Object} answers User answers from the wizard
   * @returns {Object} Eligibility result
   */
  async evaluateEligibility(documentType, answers) {
    if (!documentType) {
      throw new Error('Document type is required');
    }
    if (!answers || typeof answers !== 'object') {
      throw new Error('Answers object is required');
    }

    // Default response structure
    const result = {
      eligible: false,
      recommendedService: '',
      requiredDocuments: [],
      fees: '',
      processingTime: '',
      officialPortal: '',
      nextSteps: [],
      message: ''
    };

    const docTypeNormalized = documentType.toLowerCase().replace(/\s+/g, '-');

    switch (docTypeNormalized) {
      case 'pan-card':
      case 'pan':
        this._evaluatePanCard(answers, result);
        break;
      case 'aadhaar-card':
      case 'aadhaar':
        this._evaluateAadhaarCard(answers, result);
        break;
      case 'passport':
        this._evaluatePassport(answers, result);
        break;
      case 'driving-license':
        this._evaluateDrivingLicense(answers, result);
        break;
      case 'income-certificate':
        this._evaluateIncomeCertificate(answers, result);
        break;
      default:
        throw new Error(`Eligibility rules for document '${documentType}' are not defined.`);
    }

    // Attempt to enrich with official portal URL if we have it in DB, fallback to service defaults
    try {
      // Find a matching document in DB based on text or slug to attach the official website
      const dbDoc = await Document.findOne({ slug: new RegExp(docTypeNormalized, 'i') });
      if (dbDoc && dbDoc.officialWebsite && !result.officialPortal) {
        result.officialPortal = dbDoc.officialWebsite;
      }
    } catch (error) {
      console.warn(`Could not fetch extra document data for ${docTypeNormalized}:`, error.message);
    }

    return result;
  }

  _evaluatePanCard(answers, result) {
    const { age, citizenship = 'indian', businessType } = answers;
    
    result.recommendedService = 'New PAN Card (Form 49A)';
    result.officialPortal = 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html';
    result.fees = '₹107 (Online, within India)';
    result.processingTime = '15-20 days';

    if (citizenship !== 'indian') {
      result.recommendedService = 'New PAN Card (Form 49AA for Foreign Citizens)';
    }

    if (age < 18) {
      result.eligible = true;
      result.message = 'As a minor, you are eligible for a PAN Card, but a representative assessee (parent/guardian) must sign the application.';
      result.requiredDocuments = [
        'Minor\'s Aadhaar or Birth Certificate',
        'Parent/Guardian\'s Aadhaar/Identity Proof',
        'Parent/Guardian\'s Signature'
      ];
      result.nextSteps = [
        'Visit the NSDL online portal',
        'Select Form 49A',
        'Fill in the minor\'s details and provide representative assessee details in Section 14',
        'Upload required documents and pay the fee'
      ];
    } else {
      result.eligible = true;
      result.message = 'You are fully eligible to apply for a new PAN card.';
      result.requiredDocuments = [
        'Aadhaar Card (recommended for e-KYC)',
        'Passport Size Photograph',
        'Signature Scan'
      ];
      result.nextSteps = [
        'Visit the NSDL online portal',
        'Select Form 49A',
        'Choose e-KYC (Aadhaar based) for instant processing',
        'Complete the payment and submit the form'
      ];
    }
  }

  _evaluateAadhaarCard(answers, result) {
    const { age, hasEnrolledBefore, residentStatus = 'resident' } = answers;
    
    if (hasEnrolledBefore) {
      result.eligible = false;
      result.message = 'You already have an Aadhaar or have enrolled before. You can update your existing Aadhaar instead of a new application.';
      result.recommendedService = 'Aadhaar Update';
      result.officialPortal = 'https://myaadhaar.uidai.gov.in/';
      result.fees = '₹50 (Demographic Update) / ₹100 (Biometric Update)';
      result.processingTime = 'Up to 30 days';
      return;
    }

    result.eligible = true;
    result.officialPortal = 'https://uidai.gov.in/';
    result.fees = 'Free for new enrollment';
    result.processingTime = 'Up to 90 days';
    
    if (age < 5) {
      result.recommendedService = 'Baal Aadhaar (Blue Aadhaar)';
      result.message = 'For children below 5 years, a Baal Aadhaar will be issued (no biometrics captured).';
      result.requiredDocuments = [
        'Child\'s Birth Certificate or Hospital Discharge Slip',
        'Parent\'s Aadhaar Card'
      ];
      result.nextSteps = [
        'Book an appointment at a nearby Aadhaar Seva Kendra',
        'Visit with the child and original documents',
        'Parent\'s biometrics will be authenticated'
      ];
    } else {
      result.recommendedService = 'New Aadhaar Enrollment';
      result.message = 'You are eligible to enroll for a new Aadhaar card.';
      result.requiredDocuments = [
        'Proof of Identity (POI) (e.g., Passport, PAN)',
        'Proof of Address (POA) (e.g., Bank Statement, Voter ID)',
        'Proof of Date of Birth (PDB)'
      ];
      result.nextSteps = [
        'Book an appointment online via UIDAI portal',
        'Visit the Aadhaar Seva Kendra with original documents',
        'Provide demographic and biometric data (fingerprints, iris, photo)',
        'Collect the enrollment slip'
      ];
    }
  }

  _evaluatePassport(answers, result) {
    const { age, citizenship = 'indian', isRenewal } = answers;

    if (citizenship !== 'indian') {
      result.eligible = false;
      result.message = 'Indian Passports are only issued to citizens of India.';
      return;
    }

    result.eligible = true;
    result.officialPortal = 'https://www.passportindia.gov.in/';

    if (isRenewal) {
      result.recommendedService = 'Passport Re-issue';
      result.fees = '₹1500 (Normal) / ₹3500 (Tatkaal) for 36 pages';
      result.processingTime = '7-14 days (Normal)';
      result.requiredDocuments = [
        'Old Passport (Original)',
        'Self-attested copies of first two and last two pages of old passport',
        'Address Proof (if changed)'
      ];
      result.nextSteps = [
        'Register on Passport Seva portal',
        'Fill Re-issue application online',
        'Pay fee and book appointment',
        'Visit Passport Seva Kendra (PSK) with documents'
      ];
      return;
    }

    result.recommendedService = 'Fresh Passport';
    result.fees = '₹1500 (Normal 36 pages) / ₹3500 (Tatkaal 36 pages)';
    result.processingTime = '15-30 days (Normal) / 1-3 days (Tatkaal)';
    
    if (age < 18) {
      result.message = 'Minors get a passport valid for 5 years or till they turn 18.';
      result.fees = '₹1000 (Normal)';
      result.requiredDocuments = [
        'Proof of Date of Birth (Birth Certificate)',
        'Parents\' Passports (if available)',
        'Annexure D (Declaration by parents)'
      ];
      result.nextSteps = [
        'Register on Passport Seva portal',
        'Fill Fresh application for Minor',
        'Pay fee and book appointment',
        'Both parents (or one with Annexure C) must accompany the minor to the PSK'
      ];
    } else {
      result.message = 'You are eligible to apply for a standard 10-year passport.';
      result.requiredDocuments = [
        'Proof of Address (Aadhaar, Utility Bill, Bank Statement)',
        'Proof of Date of Birth (Birth Certificate, 10th Marks card, PAN)',
        'Non-ECR Proof (10th pass certificate or higher degree)'
      ];
      result.nextSteps = [
        'Register on Passport Seva portal',
        'Fill Fresh application form online',
        'Pay fee and schedule an appointment at PSK/POPSK',
        'Visit PSK on scheduled date with original documents',
        'Clear police verification'
      ];
    }
  }

  _evaluateDrivingLicense(answers, result) {
    const { age, hasLearnerLicense, vehicleType } = answers;

    result.officialPortal = 'https://sarathi.parivahan.gov.in/';

    if (age < 16) {
      result.eligible = false;
      result.message = 'You must be at least 16 years old to apply for any driving license in India.';
      return;
    }

    if (age >= 16 && age < 18) {
      if (vehicleType !== 'mcwg') {
        result.eligible = false;
        result.message = 'At your age (16-17), you are only eligible for a Motorcycles Without Gear (MCWOG) license (up to 50cc).';
        return;
      }
      
      result.eligible = true;
      result.message = 'You can apply for a Learner\'s License for Motorcycles without gear, with parental consent.';
      result.recommendedService = 'Learner License (MCWOG)';
      result.requiredDocuments = [
        'Age Proof',
        'Address Proof',
        'Parental Consent Letter (Form 1A)'
      ];
    } else {
      result.eligible = true;
      if (!hasLearnerLicense) {
        result.recommendedService = 'Learner\'s License (LL)';
        result.message = 'You must first obtain a Learner\'s License before getting a Permanent DL.';
        result.fees = '₹150 + ₹50 (Test fee) per class of vehicle';
        result.processingTime = 'Immediate after passing online test';
        result.requiredDocuments = [
          'Aadhaar Card (for e-KYC and instant LL)',
          'Form 1 (Self Declaration of Physical Fitness)'
        ];
        result.nextSteps = [
          'Apply for Learner License on Parivahan portal',
          'Use Aadhaar Authentication for completely faceless process',
          'Watch the road safety tutorial',
          'Take the online LL test',
          'Download LL upon passing'
        ];
      } else {
        result.recommendedService = 'Permanent Driving License (DL)';
        result.message = 'Since you have a Learner\'s License, you can apply for a Permanent DL after 30 days of LL issuance.';
        result.fees = '₹200 (DL Test) + ₹200 (DL Issue) + ₹50 (Smart Card)';
        result.processingTime = '7-15 days after passing the test';
        result.requiredDocuments = [
          'Valid Learner\'s License',
          'Aadhaar Card or Address/Age Proof'
        ];
        result.nextSteps = [
          'Apply for Permanent DL on Parivahan portal',
          'Book a DL slot for the driving test at RTO',
          'Visit RTO on the scheduled date with your vehicle',
          'Pass the driving test',
          'DL will be dispatched via Speed Post'
        ];
      }
    }
  }

  _evaluateIncomeCertificate(answers, result) {
    const { purpose } = answers;

    result.eligible = true;
    result.recommendedService = 'Income Certificate';
    // State portals vary, using standard common portal placeholder
    result.officialPortal = 'State Specific e-District Portal (e.g., edistrict.delhi.gov.in)';
    result.fees = '₹15 - ₹30 (varies by state)';
    result.processingTime = '7-21 days (varies by state)';
    result.message = 'Income certificates are generally issued at the state level via e-District portals.';

    result.requiredDocuments = [
      'Aadhaar Card',
      'Passport size photograph',
      'Salary Slips / Form 16 (for salaried) OR ITR / Self-declaration (for non-salaried)',
      'Ration Card / Voter ID (for address proof)'
    ];

    if (purpose === 'ews') {
      result.recommendedService = 'EWS Certificate (Economically Weaker Section)';
      result.requiredDocuments.push('Property documents / Land ownership proof to meet EWS criteria');
    }

    result.nextSteps = [
      'Find your state\'s e-District portal',
      'Register for a new account using Aadhaar',
      'Fill the Income Certificate application form',
      'Upload the required supporting documents',
      'Submit the application and note the reference number',
      'A field verification may be conducted by the local Patwari/Tehsildar'
    ];
  }
}

module.exports = new EligibilityService();
