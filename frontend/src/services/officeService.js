import { collection, addDoc, getDocs, doc, deleteDoc, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

const dummyOffices = [
  {
    id: 'off-001',
    name: 'Regional Passport Office (RPO)',
    department: 'Passport Seva Kendra',
    address: 'Passport Bhavan, B.C. Road, Bangalore, Karnataka 560032',
    city: 'Bangalore',
    state: 'Karnataka',
    contactNumber: '1800-258-1800',
    workingHours: '9:30 AM - 4:30 PM (Mon-Fri)',
    distance: '3.2 km',
    status: 'Open',
    servicesOffered: ['New Passport', 'Passport Renewal', 'PCC', 'Tatkaal Passport'],
    requiredDocuments: ['Aadhaar Card', 'Birth Certificate', 'Address Proof'],
    lat: 12.9716,
    lng: 77.5946
  },
  {
    id: 'off-002',
    name: 'Aadhaar Seva Kendra - Koramangala',
    department: 'Aadhaar Centers',
    address: 'Ground Floor, NGV Builders, Koramangala, Bangalore, Karnataka 560047',
    city: 'Bangalore',
    state: 'Karnataka',
    contactNumber: '1947',
    workingHours: '9:00 AM - 5:30 PM (Mon-Sat)',
    distance: '1.5 km',
    status: 'Open',
    servicesOffered: ['New Aadhaar Enrolment', 'Name/DOB/Address Update', 'Biometric Update'],
    requiredDocuments: ['Proof of Identity (POI)', 'Proof of Address (POA)', 'Proof of Birth (POB)'],
    lat: 12.9279,
    lng: 77.6271
  },
  {
    id: 'off-003',
    name: 'RTO Office - Indiranagar (KA-03)',
    department: 'RTO Offices',
    address: 'BDA Complex, Indiranagar, Bangalore, Karnataka 560038',
    city: 'Bangalore',
    state: 'Karnataka',
    contactNumber: '080-25254310',
    workingHours: '10:00 AM - 5:00 PM (Mon-Fri)',
    distance: '5.4 km',
    status: 'Closed',
    servicesOffered: ['Learner License', 'Driving License', 'Vehicle Registration', 'RC Renewal'],
    requiredDocuments: ['Aadhaar Card', 'Medical Certificate (Form 1A)', 'Passport Size Photos'],
    lat: 12.9783,
    lng: 77.6408
  },
  {
    id: 'off-004',
    name: 'PAN Service Center - UTIITSL',
    department: 'PAN Service Centers',
    address: 'No 45, Ground Floor, Dickenson Road, Bangalore, Karnataka 560042',
    city: 'Bangalore',
    state: 'Karnataka',
    contactNumber: '080-25595001',
    workingHours: '9:30 AM - 5:00 PM (Mon-Fri)',
    distance: '4.1 km',
    status: 'Open',
    servicesOffered: ['New PAN Card', 'PAN Correction', 'Reprint PAN Card'],
    requiredDocuments: ['Aadhaar Card', 'Voter ID (optional)', 'Passport Size Photos'],
    lat: 12.9815,
    lng: 77.6175
  },
  {
    id: 'off-005',
    name: 'Tehsil Office - South',
    department: 'Tehsil Offices',
    address: 'South Taluk Office, Near Jayanagar Metro, Bangalore, Karnataka 560011',
    city: 'Bangalore',
    state: 'Karnataka',
    contactNumber: '080-26562002',
    workingHours: '10:00 AM - 5:30 PM (Mon-Sat)',
    distance: '2.8 km',
    status: 'Open',
    servicesOffered: ['Income Certificate', 'Caste Certificate', 'Domicile Certificate', 'Land Records'],
    requiredDocuments: ['Aadhaar Card', 'Ration Card', 'Self Declaration Form'],
    lat: 12.9298,
    lng: 77.5824
  },
  {
    id: 'off-006',
    name: 'Municipal Corporation (BBMP) Head Office',
    department: 'Municipal Corporation Offices',
    address: 'Hudson Circle, Bangalore, Karnataka 560002',
    city: 'Bangalore',
    state: 'Karnataka',
    contactNumber: '080-22660000',
    workingHours: '10:00 AM - 5:30 PM (Mon-Sat)',
    distance: '6.0 km',
    status: 'Open',
    servicesOffered: ['Birth Certificate', 'Death Certificate', 'Trade License', 'Property Tax'],
    requiredDocuments: ['Hospital Discharge Summary (for birth/death)', 'Property Khata', 'ID Proof'],
    lat: 12.9664,
    lng: 77.5866
  },
];

class OfficeService {
  /**
   * Get all offices, optionally filtered by search text, department, city, state.
   */
  async getOffices(filters = {}) {
    // In the future, this will fetch from Firestore.
    // For now, return dummy data.
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = [...dummyOffices];
        
        if (filters.search) {
          const q = filters.search.toLowerCase();
          results = results.filter(o => 
            o.name.toLowerCase().includes(q) || 
            o.address.toLowerCase().includes(q)
          );
        }
        
        if (filters.department) {
          results = results.filter(o => o.department === filters.department);
        }
        
        if (filters.city) {
          results = results.filter(o => o.city.toLowerCase() === filters.city.toLowerCase());
        }
        
        if (filters.state) {
          results = results.filter(o => o.state.toLowerCase() === filters.state.toLowerCase());
        }
        
        resolve(results);
      }, 500); // Simulate network delay
    });
  }

  /**
   * Get office by ID
   */
  async getOfficeById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const office = dummyOffices.find(o => o.id === id);
        if (office) {
          resolve(office);
        } else {
          reject(new Error('Office not found'));
        }
      }, 300);
    });
  }

  /**
   * Book an appointment
   */
  async bookAppointment(userId, appointmentData) {
    try {
      const appointmentsRef = collection(db, 'appointments');
      const docRef = await addDoc(appointmentsRef, {
        userId,
        ...appointmentData,
        status: 'Scheduled',
        createdAt: Timestamp.now()
      });
      return { id: docRef.id, ...appointmentData, status: 'Scheduled' };
    } catch (error) {
      console.error('Error booking appointment:', error);
      throw error;
    }
  }

  /**
   * Get user appointments
   */
  async getUserAppointments(userId) {
    try {
      const q = query(
        collection(db, 'appointments'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  }

  /**
   * Cancel appointment
   */
  async cancelAppointment(appointmentId) {
    try {
      const appointmentRef = doc(db, 'appointments', appointmentId);
      await deleteDoc(appointmentRef);
      return true;
    } catch (error) {
      console.error('Error canceling appointment:', error);
      throw error;
    }
  }
}

export const officeService = new OfficeService();
