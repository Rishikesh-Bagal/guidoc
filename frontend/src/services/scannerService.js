import { db } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';

export const scannerService = {
  saveScan: async (userId, documentType, extractedData, originalFileName) => {
    try {
      const scansRef = collection(db, 'documentScans');
      const docRef = await addDoc(scansRef, {
        userId,
        documentType,
        extractedData,
        originalFileName,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error saving document scan:', error);
      throw error;
    }
  }
};
