import { db, storage } from '../config/firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { notificationService } from './notificationService';

class UserDocumentService {
  /**
   * Uploads a document to Firebase Storage and saves metadata to Firestore.
   */
  async uploadDocument(userId, file, metadata) {
    if (!userId || !file) throw new Error('User ID and File are required');

    // 1. Upload to Firebase Storage
    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
    const storageRef = ref(storage, `userDocuments/${userId}/${fileName}`);
    
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    // 2. Determine initial status based on expiry date
    let status = 'Valid';
    if (metadata.expiryDate) {
      const expiry = new Date(metadata.expiryDate);
      const now = new Date();
      const diffTime = expiry - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 0) {
        status = 'Expired';
      } else if (diffDays <= 30) {
        status = 'Expiring Soon';
      }
    }

    // 3. Save to Firestore
    const docData = {
      userId,
      documentName: metadata.documentName,
      documentType: metadata.documentType,
      fileName: file.name,
      fileUrl: downloadURL,
      storagePath: storageRef.fullPath,
      uploadDate: serverTimestamp(),
      expiryDate: metadata.expiryDate ? new Date(metadata.expiryDate) : null,
      status,
      createdAt: serverTimestamp(),
      notes: metadata.notes || ''
    };

    const docRef = await addDoc(collection(db, 'userDocuments'), docData);
    return { 
      id: docRef.id, 
      ...docData, 
      uploadDate: new Date(), 
      createdAt: new Date() 
    };
  }

  /**
   * Retrieves all documents for a specific user.
   */
  async getUserDocuments(userId) {
    if (!userId) return [];
    
    try {
      const q = query(
        collection(db, 'userDocuments'),
        where('userId', '==', userId)
      );
      
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Sort by newest first
      return docs.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
    } catch (error) {
      console.error('Error fetching user documents:', error);
      return [];
    }
  }

  /**
   * Deletes a document from Firestore and Firebase Storage.
   */
  async deleteDocument(docId, storagePath) {
    if (!docId) return;

    try {
      // 1. Delete from Firestore
      await deleteDoc(doc(db, 'userDocuments', docId));
      
      // 2. Delete from Storage
      if (storagePath) {
        const storageRef = ref(storage, storagePath);
        await deleteObject(storageRef);
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  /**
   * Updates an existing document's metadata
   */
  async updateDocument(docId, updateData) {
    if (!docId) return;
    try {
      const docRef = doc(db, 'userDocuments', docId);
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }

  /**
   * Evaluates all documents for a user and updates their status
   */
  async evaluateDocumentStatuses(userId) {
    if (!userId) return;
    try {
      const docs = await this.getUserDocuments(userId);
      const updates = [];
      const now = new Date();

      docs.forEach(document => {
        if (!document.expiryDate) return;
        
        const expiry = document.expiryDate.toDate ? document.expiryDate.toDate() : new Date(document.expiryDate);
        const diffTime = expiry - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let newStatus = 'Valid';
        if (diffDays <= 0) {
          newStatus = 'Expired';
        } else if (diffDays <= 30) {
          newStatus = 'Expiring Soon';
        }

        if (newStatus !== document.status) {
          updates.push(this.updateDocument(document.id, { status: newStatus }));
        }

        // Expiry reminders logic
        if (diffDays === 90 || diffDays === 30 || diffDays === 7) {
          updates.push(
            notificationService.createNotification({
              userId,
              title: 'Document Expiring Soon',
              message: `Your ${document.documentType} (${document.documentName}) will expire in ${diffDays} days.`,
              type: 'System Notification',
              priority: 'high',
              actionLink: '/my-documents'
            })
          );
        } else if (diffDays === 0 && newStatus !== document.status) {
          updates.push(
            notificationService.createNotification({
              userId,
              title: 'Document Expired',
              message: `Your ${document.documentType} (${document.documentName}) has expired today.`,
              type: 'System Notification',
              priority: 'high',
              actionLink: '/my-documents'
            })
          );
        }
      });

      if (updates.length > 0) {
        await Promise.all(updates);
      }
    } catch (error) {
      console.error('Error evaluating statuses:', error);
    }
  }
}

export const userDocumentService = new UserDocumentService();
