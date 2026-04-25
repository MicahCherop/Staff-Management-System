import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  User as FirebaseUser, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider, 
  signOut 
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { userService } from '../services/db';
import { User as AppUser } from '../types';

interface AuthContextType {
  user: (FirebaseUser & { profile?: AppUser }) | null;
  loading: boolean;
  signIn: () => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isManager: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<(FirebaseUser & { profile?: AppUser }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for redirect result on mount
    getRedirectResult(auth).catch((error) => {
      console.error('Redirect Sign-in Error:', error);
    });

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await userService.getUser(firebaseUser.uid) as AppUser | null;
        setUser({ ...firebaseUser, profile: profile || undefined });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      // Try popup first (better UX if it works)
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      // Handle blocked popup or cancelled request by falling back to redirect
      if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request') {
        console.warn('Popup blocked or cancelled, falling back to redirect flow...');
        try {
          await signInWithRedirect(auth, provider);
        } catch (redirectError: any) {
          console.error('Redirect Flow Error:', redirectError);
          alert('Sign-in failed. Please ensure cookies are enabled or try a different browser.');
        }
      } else if (error.code === 'auth/unauthorized-domain') {
        const domain = window.location.hostname;
        alert(`Domain Unauthorized: "${domain}" is not in the Firebase Authorized Domains list.`);
      } else {
        console.error('Authentication Error:', error);
        alert(`Sign-in failed: ${error.message || 'Unknown error'}`);
      }
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const isAdmin = user?.profile?.role === 'admin' || user?.email === 'mic1dev.me@gmail.com';
  const isManager = user?.profile?.role === 'manager';

  return (
    <AuthContext.Provider value={{ user, loading, signIn, logout, isAdmin, isManager }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
