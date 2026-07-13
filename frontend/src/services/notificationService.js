import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc,
  serverTimestamp,
  onSnapshot,
  orderBy,
  updateDoc,
  writeBatch
} from 'firebase/firestore';

class NotificationService {
  // Real-time listener for user notifications
  subscribeToNotifications(userId, callback) {
    if (!userId) return () => {};
    
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      // Need a composite index for orderBy if combining with where.
      // Firebase will throw an error with a link to create it.
      // If no index exists, sorting on client side is an alternative.
      // We will sort on the client side to avoid needing composite indexes right away.
    );

    return onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort descending by createdAt
      notifications.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
      callback(notifications);
    }, (error) => {
      console.error('Error listening to notifications:', error);
    });
  }

  async createNotification(data) {
    try {
      const payload = {
        userId: data.userId,
        title: data.title || 'New Notification',
        message: data.message || '',
        type: data.type || 'System Notification',
        priority: data.priority || 'low',
        isRead: false,
        actionLink: data.actionLink || null,
        createdAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'notifications'), payload);
      return docRef.id;
    } catch (error) {
      console.error('Error creating notification:', error);
      return null;
    }
  }

  async markAsRead(notificationId) {
    if (!notificationId) return;
    try {
      const notifRef = doc(db, 'notifications', notificationId);
      await updateDoc(notifRef, { isRead: true });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  async markAsUnread(notificationId) {
    if (!notificationId) return;
    try {
      const notifRef = doc(db, 'notifications', notificationId);
      await updateDoc(notifRef, { isRead: false });
    } catch (error) {
      console.error('Error marking notification as unread:', error);
    }
  }

  async markAllAsRead(userId) {
    if (!userId) return;
    try {
      const q = query(collection(db, 'notifications'), where('userId', '==', userId));
      const snapshot = await getDocs(q);
      
      const batch = writeBatch(db);
      snapshot.docs.forEach((doc) => {
        if (doc.data().isRead === false) {
          batch.update(doc.ref, { isRead: true });
        }
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  }

  async deleteNotification(notificationId) {
    if (!notificationId) return;
    try {
      await deleteDoc(doc(db, 'notifications', notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }

  async deleteAll(userId) {
    if (!userId) return;
    try {
      const q = query(collection(db, 'notifications'), where('userId', '==', userId));
      const snapshot = await getDocs(q);
      
      const batch = writeBatch(db);
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error deleting all notifications:', error);
    }
  }
}

export const notificationService = new NotificationService();
