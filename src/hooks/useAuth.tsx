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
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
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
