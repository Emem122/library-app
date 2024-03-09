'use client';

import { auth } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';

type AuthProviderProps = {
  children: React.ReactNode;
};

type User = {
  id: string;
  name: string | null;
};

type UserContextType = User | null | undefined;

const AuthContext = createContext<UserContextType>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserContextType>();
  const [loading, setLoading] = useState<Boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async loginUser => {
      try {
        if (loginUser) {
          setUser({ id: loginUser.uid, name: loginUser.displayName });
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return <p>loading</p>;
  } else {
    return (
      <AuthContext.Provider value={user}>
        {!loading && children}
      </AuthContext.Provider>
    );
  }
};

export const useAuth = () => {
  return useContext(AuthContext);
};
