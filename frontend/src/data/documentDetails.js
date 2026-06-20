export const documentDetails = {
  'pan-card': {
    id: 'pan-card',
    title: 'PAN Card',
    description: 'Permanent Account Number for financial transactions and identity proof.',
    icon: '💳',
    category: 'Identity',
    tags: ['Income Tax', 'KYC', 'ID Proof'],
    overview: 'A Permanent Account Number (PAN) is a ten-character alphanumeric identifier, issued in the form of a laminated "PAN card", by the Income Tax Department. It is essential for opening a bank account, filing income tax returns, and conducting significant financial transactions.',
    eligibility: [
      'Any Indian citizen (including minors)',
      'Non-Resident Indians (NRIs)',
      'Foreign citizens who pay taxes in India',
      'Companies, trusts, and other legal entities'
    ],
    requiredDocuments: [
      {
        category: 'Proof of Identity (POI) - Any One',
        items: ['Aadhaar Card', 'Voter ID', 'Passport', 'Driving License']
      },
      {
        category: 'Proof of Address (POA) - Any One',
        items: ['Aadhaar Card', 'Recent Utility Bill (Electricity/Water/Gas)', 'Passport', 'Bank Account Statement']
      },
      {
        category: 'Proof of Date of Birth (DOB) - Any One',
        items: ['Aadhaar Card', 'Birth Certificate', 'Matriculation Certificate']
      }
    ],
    process: {
      online: {
        portalName: 'NSDL / UTIITSL Portal',
        portalLink: 'https://www.onlineservices.nsdl.com/',
        docRequirements: 'Scanned copies of POI, POA, DOB proof, and a passport-sized photograph (JPEG/PDF format).',
        steps: [
          'Visit the official NSDL (Protean) or UTIITSL website.',
          'Select the application type (Form 49A for Indian citizens).',
          'Fill in the personal, contact, and income details accurately.',
          'Upload the digital copies of required documents.',
          'Pay the application processing fee online.',
          'Authenticate via Aadhaar e-Sign to complete the process digitally.'
        ]
      },
      offline: {
        centerInfo: 'Any authorized TIN-Facilitation Center (TIN-FC) or PAN Center near you.',
        docRequirements: 'Self-attested physical copies of POI, POA, DOB proof, and two recent passport-sized photographs.',
        steps: [
          'Download and print Form 49A or collect it from a TIN-FC.',
          'Fill the form in block letters using black ink.',
          'Affix two recent passport-sized photographs.',
          'Sign across the photos and in the designated signature boxes.',
          'Submit the application with documents and pay the fee at the counter.',
          'Collect your 15-digit acknowledgement receipt.'
        ]
      }
    },
    fees: [
      { type: 'Standard (Indian address, physical card)', amount: '₹107' },
      { type: 'Foreign address dispatch', amount: '₹1,017' },
      { type: 'e-PAN (Digital only, no physical card)', amount: '₹72' }
    ],
    processingTime: '7-15 working days for physical card delivery. e-PAN generated within 48 hours if Aadhaar e-KYC is used.',
    faq: [
      {
        question: 'Is it mandatory to link Aadhaar with PAN?',
        answer: 'Yes, it is mandatory under Section 139AA of the Income Tax Act. Failure to do so makes the PAN inoperative.'
      },
      {
        question: 'Can I apply for a PAN card offline?',
        answer: 'Yes, you can obtain Form 49A, fill it out, and submit it along with documents and fees to any authorized PAN agency (TIN-FC).'
      }
    ]
  },
  'aadhaar-card': {
    id: 'aadhaar-card',
    title: 'Aadhaar Card',
    description: '12-digit unique identity number based on biometric and demographic data.',
    icon: '🆔',
    category: 'Identity',
    tags: ['UIDAI', 'Biometric', 'Address Proof'],
    overview: 'Aadhaar is a 12-digit unique identity number that can be obtained voluntarily by residents of India, based on their biometric and demographic data. The data is collected by the Unique Identification Authority of India (UIDAI).',
    eligibility: [
      'Any resident of India (who has resided in India for 182 days or more in the prior 12 months)',
      'Children of all ages, including newborns (Baal Aadhaar)'
    ],
    requiredDocuments: [
      {
        category: 'Proof of Identity (POI) - Any One',
        items: ['Passport', 'PAN Card', 'Voter ID', 'Driving License']
      },
      {
        category: 'Proof of Address (POA) - Any One',
        items: ['Passport', 'Bank Statement/Passbook', 'Ration Card', 'Voter ID']
      },
      {
        category: 'Proof of Date of Birth (DOB) - Optional but recommended',
        items: ['Birth Certificate', 'SSLC Book/Certificate', 'Passport']
      }
    ],
    process: {
      online: {
        portalName: 'myAadhaar Portal (UIDAI)',
        portalLink: 'https://myaadhaar.uidai.gov.in/',
        docRequirements: 'Scanned copies of supporting documents (JPEG/PDF format) up to 2MB size.',
        steps: [
          'Log in to myAadhaar portal using your Aadhaar number and OTP.',
          'Select the specific update service (e.g., Address Update or Document Update).',
          'Review your current details and enter the new information if updating.',
          'Upload clear digital copies of your supporting documents.',
          'Pay the required fee online (if applicable).',
          'Submit the request and save the Service Request Number (SRN) for tracking.'
        ]
      },
      offline: {
        centerInfo: 'Any authorized Aadhaar Seva Kendra, Post Office, or Bank branch.',
        docRequirements: 'Original physical documents for verification (they will be scanned and returned).',
        steps: [
          'Locate an authorized Aadhaar enrollment center near you.',
          'Book an appointment online through the UIDAI portal to save waiting time.',
          'Visit the center with original supporting documents.',
          'Fill out the Aadhaar Enrollment/Update Form available at the center.',
          'Provide your demographic details and authenticate biometrically (fingerprints/iris scan).',
          'Collect the acknowledgment slip containing the Enrollment/Update ID.'
        ]
      }
    },
    fees: [
      { type: 'New Aadhaar Enrollment', amount: 'Free' },
      { type: 'Demographic Update Online', amount: '₹50' },
      { type: 'Biometric Update at Center', amount: '₹100' },
      { type: 'Aadhaar PVC Card Order', amount: '₹50' }
    ],
    processingTime: 'Usually generated/updated within 30 days. Physical letter delivered via India Post within 90 days.',
    faq: [
      {
        question: 'How can I update my mobile number in Aadhaar?',
        answer: 'Mobile number updates cannot be done online. You must visit an authorized Aadhaar center or Post Office and authenticate biometrically.'
      },
      {
        question: 'What is a Masked Aadhaar?',
        answer: 'A Masked Aadhaar hides the first 8 digits of your Aadhaar number, showing only the last 4 digits for enhanced privacy during verification.'
      }
    ]
  },
  passport: {
    id: 'passport',
    title: 'Passport',
    description: 'Official document issued by the Ministry of External Affairs for international travel.',
    icon: '🛂',
    category: 'Travel',
    tags: ['International', 'Identity', 'MEA'],
    overview: 'An Indian passport is issued by the Ministry of External Affairs to citizens of India for the purpose of international travel. It serves as crucial proof of Indian citizenship as per the Passports Act (1967).',
    eligibility: [
      'Must be an Indian citizen (by birth, descent, registration, or naturalization)',
      'Minors require parental consent and specific annexures'
    ],
    requiredDocuments: [
      {
        category: 'Proof of Address - Any One',
        items: ['Aadhaar Card', 'Water/Electricity Bill', 'Rent Agreement (Registered)', 'Income Tax Assessment Order']
      },
      {
        category: 'Proof of Date of Birth - Any One',
        items: ['Birth Certificate', 'Aadhaar Card', 'Matriculation Certificate', 'PAN Card']
      },
      {
        category: 'Non-ECR Proof (If applicable)',
        items: ['Matriculation/Higher Educational Pass Certificate']
      }
    ],
    process: {
      online: {
        portalName: 'Passport Seva Portal',
        portalLink: 'https://portal2.passportindia.gov.in/',
        docRequirements: 'Soft copies of documents for DigiLocker linking (optional but recommended).',
        steps: [
          'Register as a new user on the Passport Seva Online Portal.',
          'Login and click on "Apply for Fresh Passport/Re-issue of Passport".',
          'Fill out the comprehensive application form online.',
          'Click on "Pay and Schedule Appointment" to book a slot at your nearest PSK.',
          'Pay the required passport fee online.',
          'Print the application receipt containing the Application Reference Number (ARN).'
        ]
      },
      offline: {
        centerInfo: 'Passport Seva Kendra (PSK) or Post Office Passport Seva Kendra (POPSK). Note: Initial application must be online.',
        docRequirements: 'Original physical documents along with one set of self-attested photocopies.',
        steps: [
          'Although initial registration and fee payment must be done online, the physical verification is offline.',
          'Visit the scheduled PSK/POPSK precisely at your appointment time.',
          'Present your Application Reference Number (ARN) SMS/printout at the gate.',
          'Proceed to Token counter with your original documents and photocopies.',
          'Complete biometric data capture (photograph and fingerprints) at Counter A.',
          'Undergo document verification by officials at Counters B and C.',
          'Collect your exit acknowledgment letter and wait for Police Verification.'
        ]
      }
    },
    fees: [
      { type: 'Normal - Fresh/Re-issue (36 Pages)', amount: '₹1,500' },
      { type: 'Normal - Fresh/Re-issue (60 Pages)', amount: '₹2,000' },
      { type: 'Tatkaal - Fresh/Re-issue (36 Pages)', amount: '₹3,500' },
      { type: 'Minor (Below 15 years - 36 Pages)', amount: '₹1,000' }
    ],
    processingTime: 'Normal: 30-45 days (subject to Police Verification). Tatkaal: 1-3 days.',
    faq: [
      {
        question: 'What is the difference between ECR and Non-ECR?',
        answer: 'ECR (Emigration Check Required) is for applicants who have not passed 10th standard. They need clearance to work in specific countries. Non-ECR applies to those with 10th standard qualification or higher.'
      },
      {
        question: 'Is police verification mandatory?',
        answer: 'Yes, for most fresh issuances. It is usually done post-issuance for Tatkaal, and pre-issuance for Normal applications.'
      }
    ]
  },
  dl: {
    id: 'dl',
    title: 'Driving License',
    description: 'Official authorization from the Regional Transport Office (RTO) to operate a motor vehicle.',
    icon: '🚗',
    category: 'Transport',
    tags: ['RTO', 'Vehicle', 'Parivahan'],
    overview: 'A Driving License (DL) is an official document certifying that the holder is qualified to drive a motor vehicle on public roads in India. It is issued by the Regional Transport Office (RTO) or Regional Transport Authority (RTA) of the respective state.',
    eligibility: [
      'For gearless motorcycles (up to 50cc): 16 years (with parental consent)',
      'For regular motorcycles and light motor vehicles (LMV): 18 years',
      'For commercial/transport vehicles: 20 years (and holding an LMV license for 1 year)',
      'Must possess a valid Learner\'s License for at least 30 days before applying for a permanent DL'
    ],
    requiredDocuments: [
      {
        category: 'Age Proof - Any One',
        items: ['Birth Certificate', 'PAN Card', 'Passport', '10th Class Marksheet']
      },
      {
        category: 'Address Proof - Any One',
        items: ['Aadhaar Card', 'Passport', 'Voter ID', 'LIC Policy Statement']
      },
      {
        category: 'Other Documents',
        items: ['Valid Learner\'s License', 'Medical Certificate (Form 1A) for applicants above 40 years']
      }
    ],
    process: {
      online: {
        portalName: 'Parivahan Sewa (Sarathi)',
        portalLink: 'https://sarathi.parivahan.gov.in/',
        docRequirements: 'Scanned copies of Age Proof, Address Proof, and digital signature/photograph.',
        steps: [
          'Visit the Sarathi Parivahan portal and select your state.',
          'Choose "Apply for Learner License" or "Apply for Driving License".',
          'Authenticate using Aadhaar for a contactless application (if supported by your state).',
          'Fill out applicant details and upload required digital documents.',
          'Pay the application fee online.',
          'Book a slot for your Driving Skill Test online.',
          'Take the online Learner\'s License test from home (if Aadhaar authenticated).'
        ]
      },
      offline: {
        centerInfo: 'Your local Regional Transport Office (RTO).',
        docRequirements: 'Original physical documents, Learner\'s License printout, and 3 passport-sized photos.',
        steps: [
          'Visit your local RTO with original documents and their photocopies.',
          'Collect and fill the physical application forms (Form 2, Form 4, etc.).',
          'Submit the forms along with documents and the scheduled test fee at the counter.',
          'Get your biometric data captured at the designated RTO desk.',
          'Bring your own vehicle (of the class applied for) to the RTO testing track.',
          'Appear for the physical Driving Skill Test before the Motor Vehicle Inspector (MVI).',
          'If passed, the physical license smart card will be mailed to your address.'
        ]
      }
    },
    fees: [
      { type: 'Learner\'s License (Per Class)', amount: '₹150 + ₹50 (Test Fee)' },
      { type: 'Permanent Driving License Test Fee', amount: '₹300' },
      { type: 'Driving License Issue Fee', amount: '₹200' },
      { type: 'Smart Card Fee', amount: '₹200' }
    ],
    processingTime: 'Learner\'s License is immediate upon passing the online test. Permanent DL takes 2-4 weeks after passing the driving test.',
    faq: [
      {
        question: 'Can I change my address on my Driving License online?',
        answer: 'Yes, address changes can be initiated via the Parivahan portal, but you must submit proof of the new address and may need to surrender the old card.'
      },
      {
        question: 'What happens if I fail the driving test?',
        answer: 'You can re-apply for a re-test after 7 days by paying the test fee again.'
      }
    ]
  },
  'income-certificate': {
    id: 'income-certificate',
    title: 'Income Certificate',
    description: 'Official document certifying the annual income of an individual or family.',
    icon: '📜',
    category: 'Certificates',
    tags: ['State Govt', 'Subsidies', 'Education'],
    overview: 'An Income Certificate is an official state-issued document that records the annual income of an individual or a family. It is crucial for availing government subsidies, scholarships, educational quotas (like EWS), and various welfare schemes.',
    eligibility: [
      'Any resident citizen of the respective state',
      'Applicants seeking government benefits, subsidies, or fee concessions'
    ],
    requiredDocuments: [
      {
        category: 'Identity Proof',
        items: ['Aadhaar Card', 'Voter ID', 'PAN Card']
      },
      {
        category: 'Address Proof',
        items: ['Ration Card', 'Electricity Bill', 'Aadhaar Card']
      },
      {
        category: 'Income Proof',
        items: ['Salary Slips', 'Income Tax Return (ITR)', 'Form 16', 'Self-declaration/Affidavit by local authority (Sarpanch/Patwari)']
      }
    ],
    process: {
      online: {
        portalName: 'State e-District Portal',
        portalLink: '#',
        docRequirements: 'Scanned copies of ID proof, Address proof, and Income proof documents.',
        steps: [
          'Visit the official e-District portal of your respective state.',
          'Register for a citizen account or log in.',
          'Select the service "Apply for Income Certificate".',
          'Fill in personal details, family details, and exact income sources.',
          'Upload clear digital scans of the required proofs.',
          'Pay the nominal processing fee online via integrated payment gateway.',
          'Track your application status online using the reference number.'
        ]
      },
      offline: {
        centerInfo: 'Tehsildar Office, SDM Office, or CSC (Common Service Center) / Maha e-Seva Kendra.',
        docRequirements: 'Physical application form, original proofs for verification, photocopies, and a notarized affidavit (if required).',
        steps: [
          'Visit the nearest Common Service Center (CSC) or Tehsildar office.',
          'Procure the physical Income Certificate application form and fill it.',
          'Attach a self-declaration affidavit or certification from the local Sarpanch/Patwari regarding your income.',
          'Attach photocopies of ID and address proofs.',
          'Submit the application file to the designated clerk/officer and pay the fee.',
          'Physical verification may be conducted by a local revenue officer (Talathi/Patwari).',
          'Collect the digitally signed/stamped certificate from the office after approval.'
        ]
      }
    },
    fees: [
      { type: 'Online Processing Fee', amount: '₹20 - ₹50 (Varies by state)' },
      { type: 'CSC/Maha e-Seva Kendra Charge (If applied offline)', amount: '₹50 - ₹100' }
    ],
    processingTime: 'Typically 7 to 15 working days, depending on the state administration.',
    faq: [
      {
        question: 'What is the validity of an Income Certificate?',
        answer: 'Generally, it is valid for one financial year from the date of issue, though some states issue certificates valid for up to 3 years.'
      },
      {
        question: 'Is it necessary to have an ITR to apply?',
        answer: 'No, if you do not file ITR, you can provide an affidavit signed by a notary, or a certificate from the village Sarpanch or Tehsildar.'
      }
    ]
  }
};
