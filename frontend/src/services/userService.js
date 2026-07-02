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
  getDoc,
  onSnapshot
} from 'firebase/firestore';

class UserService {
  // Favorites
  async saveFavorite(userId, document) {
    console.log(`[Firestore Write Attempt] saveFavorite called for userId: ${userId}, documentId: ${document?.id}`);
    if (!userId || !document) {
      console.warn('[Firestore Write Error] Missing userId or document');
      return;
    }
    try {
      const favRef = doc(db, 'favorites', `${userId}_${document.id}`);
      const payload = {
        userId: userId,
        documentId: document.id || '',
        title: document.title || 'Untitled',
        category: document.category || 'General',
        savedAt: serverTimestamp()
      };
      console.log(`[Firestore Write Attempt] Payload:`, payload);
      await setDoc(favRef, payload);
      console.log(`[Firestore Write Success] saveFavorite completed successfully`);
    } catch (error) {
      console.error('[Firestore Write Error] saveFavorite failed:', error.message, error);
    }
  }

  async removeFavorite(userId, documentId) {
    console.log(`[Firestore Write Attempt] removeFavorite called for userId: ${userId}, documentId: ${documentId}`);
    if (!userId || !documentId) {
      console.warn('[Firestore Write Error] Missing userId or documentId');
      return;
    }
    try {
      const favRef = doc(db, 'favorites', `${userId}_${documentId}`);
      await deleteDoc(favRef);
      console.log(`[Firestore Write Success] removeFavorite completed successfully`);
    } catch (error) {
      console.error('[Firestore Write Error] removeFavorite failed:', error.message, error);
    }
  }

  async getFavorites(userId) {
    if (!userId) return [];
    try {
      const q = query(
        collection(db, 'favorites'),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      const favorites = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort in memory to avoid composite index requirement
      return favorites.sort((a, b) => (b.savedAt?.toMillis() || 0) - (a.savedAt?.toMillis() || 0));
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  }

  subscribeToFavorites(userId, callback) {
    if (!userId) return () => {};
    const q = query(
      collection(db, 'favorites'),
      where('userId', '==', userId)
    );
    return onSnapshot(q, (snapshot) => {
      const favorites = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      favorites.sort((a, b) => (b.savedAt?.toMillis() || 0) - (a.savedAt?.toMillis() || 0));
      callback(favorites);
    }, (error) => {
      console.error('Error listening to favorites:', error);
    });
  }

  async isFavorite(userId, documentId) {
    if (!userId || !documentId) return false;
    try {
      const favRef = doc(db, 'favorites', `${userId}_${documentId}`);
      const docSnap = await getDoc(favRef);
      return docSnap.exists();
    } catch (error) {
      console.error('Error checking favorite:', error);
      return false;
    }
  }

  // Recent Searches
  async saveSearch(userId, searchQuery) {
    console.log(`[Firestore Write Attempt] saveSearch called for userId: ${userId}, query: ${searchQuery}`);
    if (!userId || !searchQuery) return;
    try {
      const payload = {
        userId: userId,
        query: searchQuery || '',
        searchedAt: serverTimestamp()
      };
      console.log(`[Firestore Write Attempt] Payload:`, payload);
      await addDoc(collection(db, 'recentSearches'), payload);
      console.log(`[Firestore Write Success] saveSearch completed successfully`);
    } catch (error) {
      console.error('[Firestore Write Error] saveSearch failed:', error.message, error);
    }
  }

  async getRecentSearches(userId) {
    if (!userId) return [];
    try {
      const q = query(
        collection(db, 'recentSearches'),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      const searches = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      searches.sort((a, b) => (b.searchedAt?.toMillis() || 0) - (a.searchedAt?.toMillis() || 0));
      return searches.slice(0, 10);
    } catch (error) {
      console.error('Error getting recent searches:', error);
      return [];
    }
  }

  // Eligibility History
  async saveEligibilityCheck(userId, documentId, result) {
    console.log(`[Firestore Write Attempt] saveEligibilityCheck for userId: ${userId}, documentId: ${documentId}`);
    if (!userId) return;
    try {
      const payload = {
        userId: userId,
        documentId: documentId || '',
        isEligible: result?.eligible ?? false,
        checkedAt: serverTimestamp()
      };
      console.log(`[Firestore Write Attempt] Payload:`, payload);
      await addDoc(collection(db, 'eligibilityHistory'), payload);
      console.log(`[Firestore Write Success] saveEligibilityCheck completed successfully`);
    } catch (error) {
      console.error('[Firestore Write Error] saveEligibilityCheck failed:', error.message, error);
    }
  }

  async getEligibilityHistory(userId) {
    if (!userId) return [];
    try {
      const q = query(
        collection(db, 'eligibilityHistory'),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      const history = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      history.sort((a, b) => (b.checkedAt?.toMillis() || 0) - (a.checkedAt?.toMillis() || 0));
      return history.slice(0, 10);
    } catch (error) {
      console.error('Error getting eligibility history:', error);
      return [];
    }
  }

  // AI Chat History
  async saveAIChatMessage(userId, userMessage, aiReply) {
    console.log(`[Firestore Write Attempt] saveAIChatMessage for userId: ${userId}`);
    if (!userId) return;
    try {
      const payload = {
        userId: userId,
        userMessage: userMessage || '',
        aiReply: aiReply || '',
        timestamp: serverTimestamp()
      };
      console.log(`[Firestore Write Attempt] Payload:`, payload);
      await addDoc(collection(db, 'aiHistory'), payload);
      console.log(`[Firestore Write Success] saveAIChatMessage completed successfully`);
    } catch (error) {
      console.error('[Firestore Write Error] saveAIChatMessage failed:', error.message, error);
    }
  }

  async getAIChatHistory(userId) {
    if (!userId) return [];
    try {
      const q = query(
        collection(db, 'aiHistory'),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      const history = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      history.sort((a, b) => (b.timestamp?.toMillis() || 0) - (a.timestamp?.toMillis() || 0));
      return history.slice(0, 20);
    } catch (error) {
      console.error('Error getting AI chat history:', error);
      return [];
    }
  }

  // Document Views (for stats)
  async logDocumentView(userId, documentId) {
    console.log(`[Firestore Write Attempt] logDocumentView for userId: ${userId}, documentId: ${documentId}`);
    if (!userId || !documentId) return;
    try {
      const viewRef = doc(db, 'documentViews', `${userId}_${documentId}`);
      const payload = {
        userId: userId,
        documentId: documentId || '',
        viewedAt: serverTimestamp()
      };
      // Not logging full payload to avoid spam, just success/error
      await setDoc(viewRef, payload);
      console.log(`[Firestore Write Success] logDocumentView completed successfully`);
    } catch (error) {
      console.error('[Firestore Write Error] logDocumentView failed:', error.message, error);
    }
  }

  async getDocumentViewCount(userId) {
    if (!userId) return 0;
    try {
      const q = query(
        collection(db, 'documentViews'),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    } catch (error) {
      console.error('Error getting document view count:', error);
      return 0;
    }
  }
}

export const userService = new UserService();
