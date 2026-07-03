import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc,
  deleteDoc,
  query, 
  where, 
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';

class TrackerService {
  /**
   * Create a new tracked application
   */
  async createApplication(userId, documentId, documentName) {
    if (!userId || !documentName) {
      throw new Error('Missing required fields for application tracker');
    }

    const payload = {
      userId,
      documentId: documentId || '',
      documentName,
      status: 'Draft',
      currentStep: 0,
      completedSteps: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'applicationTracker'), payload);
    return docRef.id;
  }

  /**
   * Subscribe to a user's tracked applications
   */
  subscribeToApplications(userId, callback) {
    if (!userId) return () => {};

    const q = query(
      collection(db, 'applicationTracker'),
      where('userId', '==', userId)
    );

    return onSnapshot(q, (snapshot) => {
      const applications = snapshot.docs.map(doc => ({ 
        applicationId: doc.id, 
        ...doc.data() 
      }));
      
      // Sort by updatedAt descending (client-side to avoid needing a composite index)
      applications.sort((a, b) => {
        const timeA = a.updatedAt?.toMillis?.() || 0;
        const timeB = b.updatedAt?.toMillis?.() || 0;
        return timeB - timeA;
      });

      callback(applications);
    }, (error) => {
      console.error('Error listening to applications:', error);
    });
  }

  /**
   * Update the status of an application
   */
  async updateApplicationStatus(applicationId, newStatus, currentStep, completedSteps) {
    if (!applicationId) return;

    const docRef = doc(db, 'applicationTracker', applicationId);
    await updateDoc(docRef, {
      status: newStatus,
      currentStep,
      completedSteps,
      updatedAt: serverTimestamp()
    });
  }

  /**
   * Delete a tracked application
   */
  async deleteApplication(applicationId) {
    if (!applicationId) return;
    
    const docRef = doc(db, 'applicationTracker', applicationId);
    await deleteDoc(docRef);
  }
}

export const trackerService = new TrackerService();
