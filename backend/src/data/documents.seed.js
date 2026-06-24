require('dotenv').config({ path: __dirname + '/../../.env' });
const mongoose = require('mongoose');
const Document = require('../models/Document');
const connectDB = require('../config/database');

const documents = [
  {
    name: 'PAN Card',
    slug: 'pan-card',
    category: 'Identity',
    description: 'The Permanent Account Number (PAN) is a ten-character alphanumeric identifier issued by the Income Tax Department of India. It is essential for financial transactions and filing income tax returns.',
    eligibility: [
      'Indian citizens (including minors)',
      'Non-Resident Indians (NRIs)',
      'Foreign citizens who pay taxes in India',
      'Companies, firms, HUFs, associations of persons'
    ],
    requiredDocuments: [
      'Proof of Identity (Aadhaar, Passport, Voter ID)',
      'Proof of Address (Utility bill, Bank statement, Aadhaar)',
      'Proof of Date of Birth (Birth certificate, Matriculation certificate)',
      'Two recent passport size photographs'
    ],
    onlineSteps: [
      'Visit the official NSDL (Protean) or UTIITSL website.',
      'Select the application type (Form 49A for Indian citizens).',
      'Fill in your personal details, contact information, and parents\' names.',
      'Upload the required scanned documents and photographs.',
      'Pay the application fee online using a debit/credit card or net banking.',
      'Submit the application and note down the 15-digit acknowledgement number for tracking.'
    ],
    offlineSteps: [
      'Download Form 49A from the NSDL/UTIITSL website or obtain it from an authorized PAN agency.',
      'Fill out the form in block letters using black ink.',
      'Attach your photographs and sign across them as instructed.',
      'Attach photocopies of the required documents.',
      'Submit the form along with the fee at a TIN-Facilitation Centre or PAN center.'
    ],
    fees: '₹107 for Indian communication address; ₹1017 for foreign communication address',
    processingTime: '15-20 working days',
    faqs: [
      {
        question: 'Is it mandatory to link Aadhaar with PAN?',
        answer: 'Yes, it is mandatory to link Aadhaar with PAN for all individuals who have been allotted a PAN and are eligible to obtain an Aadhaar number.'
      },
      {
        question: 'Can a minor apply for a PAN card?',
        answer: 'Yes, a minor can apply for a PAN card. A representative assessee (parent or guardian) must sign the application on behalf of the minor.'
      }
    ],
    officialWebsite: 'https://www.onlineservices.nsdl.com/',
    isActive: true
  },
  {
    name: 'Aadhaar Card',
    slug: 'aadhaar-card',
    category: 'Identity',
    description: 'Aadhaar is a 12-digit unique identity number that can be obtained voluntarily by residents or passport holders of India, based on their biometric and demographic data.',
    eligibility: [
      'Any resident of India (who has resided in India for 182 days or more in the 12 months immediately preceding the date of application)',
      'Non-Resident Indians (NRIs) with valid Indian passports (residency requirement waived)'
    ],
    requiredDocuments: [
      'Proof of Identity (Passport, PAN Card, Voter ID, Driving License)',
      'Proof of Address (Passport, Bank Statement, Ration Card, Voter ID)',
      'Proof of Date of Birth (Birth Certificate, SSLC Book/Certificate, Passport)'
    ],
    onlineSteps: [
      'Locate an enrolment center nearby using the UIDAI website.',
      'Book an appointment online (optional but recommended).',
      'Visit the enrolment center with your original supporting documents.',
      'Provide your demographic data (name, address, DOB, gender).',
      'Provide your biometric data (fingerprints, iris scan, and photograph).',
      'Collect your acknowledgement slip containing the Enrolment ID to check the status.'
    ],
    offlineSteps: [
      'The process is mostly physical. You must visit an enrolment center.',
      'Take the physical copies of your documents to the nearest Aadhaar center.',
      'Fill out the enrolment form available at the center.',
      'Complete the biometric and demographic data capture process.'
    ],
    fees: 'Free for fresh enrolment. ₹50 for demographic update. ₹100 for biometric update.',
    processingTime: 'Up to 90 days (usually generated within 3-4 weeks)',
    faqs: [
      {
        question: 'What is a Masked Aadhaar?',
        answer: 'Masked Aadhaar implies replacing the first 8 digits of Aadhaar number with some characters like "xxxx-xxxx" while only the last 4 digits of the Aadhaar Number are visible.'
      },
      {
        question: 'How can I update my mobile number in Aadhaar?',
        answer: 'Mobile number cannot be updated online. You must visit an Aadhaar enrolment center/Update Center to update your mobile number.'
      }
    ],
    officialWebsite: 'https://uidai.gov.in/',
    isActive: true
  },
  {
    name: 'Passport',
    slug: 'passport',
    category: 'Identity',
    description: 'An Indian passport is issued by order of the President of India to Indian citizens for the purpose of international travel. It serves as an essential travel document and proof of Indian citizenship.',
    eligibility: [
      'Must be a citizen of India'
    ],
    requiredDocuments: [
      'Proof of Date of Birth (Birth certificate, Aadhaar, PAN card, Matriculation certificate)',
      'Proof of Address (Water bill, Telephone bill, Electricity bill, Aadhaar, Bank passbook)',
      'Non-ECR proof (if applicable, typically 10th standard mark sheet)'
    ],
    onlineSteps: [
      'Register on the Passport Seva Online Portal.',
      'Login using the registered login Id.',
      'Click on "Apply for Fresh Passport/Re-issue of Passport" link.',
      'Fill in the required details in the form and submit.',
      'Click the "Pay and Schedule Appointment" link to schedule an appointment at PSK/POPSK.',
      'Print the application receipt containing the Application Reference Number (ARN).',
      'Visit the Passport Seva Kendra (PSK) with original documents on the appointment day.'
    ],
    offlineSteps: [
      'Offline submission of forms has been largely phased out except for specific exceptional categories.',
      'It is highly recommended to apply online and visit the PSK.'
    ],
    fees: '₹1,500 for normal scheme (36 pages); ₹2,000 for normal scheme (60 pages); Tatkal fees are additional.',
    processingTime: 'Normal: 30-45 days. Tatkal: 1-3 days.',
    faqs: [
      {
        question: 'What is the validity of a normal passport?',
        answer: 'An ordinary passport is valid for 10 years from the date of issue.'
      },
      {
        question: 'Can I apply for a passport under the Tatkal scheme?',
        answer: 'Yes, if you need the passport urgently, you can apply under the Tatkal scheme by paying an additional fee.'
      }
    ],
    officialWebsite: 'https://portal2.passportindia.gov.in/',
    isActive: true
  },
  {
    name: 'Driving License',
    slug: 'driving-license',
    category: 'Vehicle',
    description: 'A driving license is an official document issued by the Regional Transport Office (RTO) or Regional Transport Authority (RTA) in India, permitting individuals to drive motor vehicles on public roads.',
    eligibility: [
      '18 years or older for a standard motor vehicle.',
      '16 years or older for a two-wheeler with an engine capacity not exceeding 50cc (with parents\' consent).',
      'Must hold a valid Learner\'s License for at least 30 days.'
    ],
    requiredDocuments: [
      'Learner\'s License',
      'Proof of Identity (Aadhaar, Passport, PAN Card)',
      'Proof of Address (Aadhaar, Voter ID, Utility bills)',
      'Proof of Age (Birth certificate, SSLC certificate)',
      'Passport size photographs'
    ],
    onlineSteps: [
      'Visit the Parivahan Sewa portal or your state\'s transport department website.',
      'Select "Apply for Driving License".',
      'Enter your Learner\'s License number and Date of Birth.',
      'Fill out the application form and upload necessary documents.',
      'Pay the application fee online.',
      'Book a slot for the driving test at your local RTO.',
      'Visit the RTO on the scheduled date, pass the driving test, and provide biometrics.'
    ],
    offlineSteps: [
      'Visit the local RTO.',
      'Collect Form 4 (Application for License to Drive).',
      'Fill out the form and attach copies of required documents and photos.',
      'Pay the required fees at the RTO counter.',
      'Schedule a driving test.',
      'Appear for the driving test at the designated time and place.'
    ],
    fees: 'Varies by state, typically around ₹200 for a smart card + ₹300 for the driving test.',
    processingTime: 'Delivered via post within 2-3 weeks after passing the test.',
    faqs: [
      {
        question: 'Is a driving test mandatory?',
        answer: 'Yes, passing a practical driving test conducted by an RTO inspector is mandatory to get a permanent driving license.'
      },
      {
        question: 'What is the validity of a driving license?',
        answer: 'A non-transport driving license is generally valid for 20 years or until the age of 40, whichever is earlier.'
      }
    ],
    officialWebsite: 'https://parivahan.gov.in/parivahan/',
    isActive: true
  },
  {
    name: 'Income Certificate',
    slug: 'income-certificate',
    category: 'Income & Taxes',
    description: 'An Income Certificate is an official document issued by the State Government certifying the annual income of an individual or their family from all sources. It is crucial for availing various subsidies and scholarships.',
    eligibility: [
      'Any resident of the state needing proof of income for official purposes.'
    ],
    requiredDocuments: [
      'Proof of Identity (Aadhaar, Voter ID)',
      'Proof of Address (Ration Card, Utility Bill)',
      'Salary slips or Form 16 (for salaried individuals)',
      'Income Tax Returns (ITR) or affidavit of income (for non-salaried)',
      'Passport size photograph'
    ],
    onlineSteps: [
      'Visit your State Government\'s e-District portal or citizen service portal.',
      'Register/Login to the portal.',
      'Navigate to the "Revenue Department" or "Certificates" section and select "Income Certificate".',
      'Fill out the online application form with personal and income details.',
      'Upload the scanned copies of required documents.',
      'Pay the nominal processing fee online.',
      'Submit and note down the application number for tracking.'
    ],
    offlineSteps: [
      'Visit the local Tehsildar office, Sub-Divisional Magistrate (SDM) office, or a Common Service Centre (CSC).',
      'Obtain the application form for an Income Certificate.',
      'Fill in the details and attach self-attested copies of required documents.',
      'Submit the form and pay the fee (if applicable).',
      'Collect the acknowledgement receipt.'
    ],
    fees: 'Varies by state, usually between ₹15 to ₹50 as processing fee.',
    processingTime: '7-15 working days depending on the state and verification process.',
    faqs: [
      {
        question: 'Why do I need an Income Certificate?',
        answer: 'It is required to avail fee concessions in educational institutions, secure seats under reserved quotas (like EWS), get government subsidies, and apply for pensions.'
      },
      {
        question: 'How long is an Income Certificate valid?',
        answer: 'The validity typically ranges from 6 months to 1 year from the date of issue, depending on state regulations.'
      }
    ],
    officialWebsite: 'https://www.india.gov.in',
    isActive: true
  }
];

const seedData = async () => {
  try {
    // 1. Connect to database
    await connectDB();
    
    // 2. Clear existing documents
    console.log('Clearing existing documents...');
    await Document.deleteMany();
    
    // 3. Insert new documents
    console.log('Inserting seed data...');
    const insertedDocs = await Document.insertMany(documents);
    
    console.log(`Successfully seeded ${insertedDocs.length} documents!`);
    
    // 4. Exit process successfully
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

// Run the seeder
seedData();
