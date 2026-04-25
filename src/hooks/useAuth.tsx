import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
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
    try {
      const provider = new GoogleAuthProvider();
      // Ensure this is called in the same tick as user interaction if possible
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error.code === 'auth/popup-blocked') {
        alert('Sign-in popup was blocked by your browser. Please click the sign-in button again and allow popups for this site when prompted (look for the icon in your browser\'s address bar).');
      } else if (error.code === 'auth/unauthorized-domain') {
        const domain = window.location.hostname;
        alert(`Domain Unauthorized: "${domain}" is not in the Firebase Authorized Domains list. \n\nPlease add it in: Firebase Console -> Authentication -> Settings -> Authorized domains.`);
        console.error('Unauthorized Domain:', domain);
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
