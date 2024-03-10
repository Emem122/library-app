'use client';

import { auth, db } from '@/firebase';
import { User } from '@/types/user';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { createContext, useContext, useEffect, useState } from 'react';

type AuthProviderProps = {
  children: React.ReactNode;
};

type UserContextType = User | null | undefined;
type HandleAuthType = () => Promise<void>;

const AuthContext = createContext<UserContextType>(undefined);

const HandleAuthContext = createContext<HandleAuthType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<UserContextType>(null);
  const [loading, setLoading] = useState<Boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async loginUser => {
      try {
        if (loginUser) {
          const getUserData = async () => {
            const docRef = doc(db, 'users', loginUser.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              const id = docSnap.data().id;
              const name = docSnap.data().name;

              setCurrentUser({ id, name });
            } else {
              console.log('No such document exist');
            }
          };
          await getUserData();

          setLoading(false);
        } else {
          setCurrentUser(null);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
      }
    });

    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentUser(null);
  };

  useEffect(() => {
    // console.log(`user: ${currentUser?.name}`);
  }, [currentUser]);

  // if (currentUser === null) {
  //   router.push('/register');
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
