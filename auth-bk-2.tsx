'use client';

import { auth, db } from '@/firebase';
import { User } from '@/types/user';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

type AuthProviderProps = {
  children: React.ReactNode;
};

type UserContextType = User | null | undefined;
type HandleAuthType = () => Promise<void>;

const AuthContext = createContext<UserContextType>(undefined);

const HandleAuthContext = createContext<HandleAuthType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<UserContextType>(undefined);
  const [loading, setLoading] = useState<Boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async loginUser => {
      try {
        if (loginUser) {
          setCurrentUser({
            id: loginUser.uid,
            name: loginUser.displayName,
          });

          setLoading(false);
        } else {
          setCurrentUser(null);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentUser(null);
  };

  // useEffect(() => {
  //   // console.log(`user: ${currentUser?.name}`);

  //   console.log(currentUser);
  // }, [currentUser]);

  // if (currentUser === null) {
  //   router.push('/');
  // }

  if (loading) {
    return <p>loading</p>;
  } else {
    return (
      <AuthContext.Provider value={currentUser}>
        <HandleAuthContext.Provider value={handleLogout}>
          {!loading && children}
        </HandleAuthContext.Provider>
      </AuthContext.Provider>
    );
  }
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export const useHandleAuth = () => {
  return useContext(HandleAuthContext);
};
