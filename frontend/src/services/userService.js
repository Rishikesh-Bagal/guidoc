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
  onSnapshot,
  getCountFromServer
} from 'firebase/firestore';
class UserService {
  // User Management
  async getUserDocument(userId) {
    if (!userId) return null;
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        return userSnap.data();
      }
      return null;
    } catch (error) {
      console.error('Error fetching user document:', error);
      return null;
    }
  }

  async syncUserDocument(user) {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        provider: user.providerData?.[0]?.providerId || 'password',
        lastLogin: serverTimestamp(),
      };

      if (!userSnap.exists()) {
        userData.createdAt = serverTimestamp();
        userData.preferences = {
          theme: 'dark',
          language: 'en',
          notifications: true
        };
        // By default, new users do not get admin role. 
        // Admin must be assigned manually in Firestore.
        userData.role = 'user';
      }
      
      await setDoc(userRef, userData, { merge: true });
    } catch (error) {
      console.error('[Firestore Write Error] syncUserDocument failed:', error);
    }
  }

  async updateUserPreferences(userId, preferences) {
    if (!userId || !preferences) return;
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, { preferences }, { merge: true });
    } catch (error) {
      console.error('Error updating user preferences:', error);
    }
  }

  async deleteUserData(userId) {
    if (!userId) return;
    try {
      // Helper function to delete documents from a query
      const deleteFromCollection = async (collectionName, fieldName) => {
        const q = query(collection(db, collectionName), where(fieldName, '==', userId));
        const snapshot = await getDocs(q);
        const deletePromises = snapshot.docs.map(document => deleteDoc(doc(db, collectionName, document.id)));
        await Promise.all(deletePromises);
      };

      // Cascading deletes
      await Promise.all([
        deleteFromCollection('favorites', 'userId'),
        deleteFromCollection('recentSearches', 'userId'),
        deleteFromCollection('eligibilityHistory', 'userId'),
        deleteFromCollection('aiHistory', 'userId'),
        deleteFromCollection('applications', 'userId'), // assuming tracker uses 'applications' collection
        deleteFromCollection('documentViews', 'userId')
      ]);

      // Finally, delete the user doc
      await deleteDoc(doc(db, 'users', userId));
    } catch (error) {
      console.error('Error deleting user data:', error);
      throw error;
    }
  }

  // Favorites
  async saveFavorite(userId, document) {
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
      await setDoc(favRef, payload);
    } catch (error) {
      console.error('[Firestore Write Error] saveFavorite failed:', error.message, error);
    }
  }

  async removeFavorite(userId, documentId) {
    if (!userId || !documentId) {
      console.warn('[Firestore Write Error] Missing userId or documentId');
      return;
    }
    try {
      const favRef = doc(db, 'favorites', `${userId}_${documentId}`);
      await deleteDoc(favRef);
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
    if (!userId || !searchQuery) return;
    try {
      const payload = {
        userId: userId,
        query: searchQuery || '',
        searchedAt: serverTimestamp()
      };
      await addDoc(collection(db, 'recentSearches'), payload);
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
    if (!userId) return;
    try {
      const payload = {
        userId: userId,
        documentId: documentId || '',
        isEligible: result?.eligible ?? false,
        checkedAt: serverTimestamp()
      };
      await addDoc(collection(db, 'eligibilityHistory'), payload);
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
    if (!userId) return;
    try {
      const payload = {
        userId: userId,
        userMessage: userMessage || '',
        aiReply: aiReply || '',
        timestamp: serverTimestamp()
      };
      await addDoc(collection(db, 'aiHistory'), payload);
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

  // Admin Analytics
  async getAdminStats() {
    try {
      const usersSnap = await getCountFromServer(collection(db, 'users'));
      const favoritesSnap = await getCountFromServer(collection(db, 'favorites'));
      const eligibilitySnap = await getCountFromServer(collection(db, 'eligibilityHistory'));
      const aiSnap = await getCountFromServer(collection(db, 'aiHistory'));
      const viewsSnap = await getCountFromServer(collection(db, 'documentViews'));

      return {
        totalUsers: usersSnap.data().count,
        totalFavorites: favoritesSnap.data().count,
        totalEligibilityChecks: eligibilitySnap.data().count,
        totalAiInteractions: aiSnap.data().count,
        totalViews: viewsSnap.data().count
      };
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      return { totalUsers: 0, totalFavorites: 0, totalEligibilityChecks: 0, totalAiInteractions: 0, totalViews: 0 };
    }
  }
}

export const userService = new UserService();
