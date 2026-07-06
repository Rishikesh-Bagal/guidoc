import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  deleteUser
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { userService } from '../services/userService';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await userService.syncUserDocument(user);
        const userData = await userService.getUserDocument(user.uid);
        setUserRole(userData?.role || 'user');
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);
  const loginWithEmail = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const registerWithEmail = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = () => {
    return signInWithPopup(auth, googleProvider);
  };

  const logout = () => {
    return signOut(auth);
  };

  const updateUserProfile = (profileData) => {
    return updateProfile(auth.currentUser, profileData);
  };

  const verifyEmail = () => {
    return sendEmailVerification(auth.currentUser);
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const deleteAccount = () => {
    return deleteUser(auth.currentUser);
  };

  const value = {
    currentUser,
    userRole,
    isAdmin: userRole === 'admin',
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    logout,
    updateUserProfile,
    verifyEmail,
    resetPassword,
    deleteAccount
  };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
