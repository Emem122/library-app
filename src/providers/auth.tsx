import { auth, db } from '@/firebase';
import { User } from '@/types/user';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { StateCreator, create } from 'zustand';
import { PersistOptions, persist } from 'zustand/middleware';

type AuthState = {
  currentUser: User | null | undefined;
  loading: boolean;
  alreadyExist: boolean;
  invalidUser: boolean;
  googleSignIn: () => void;
  emailSignIn: (email: string, password: string, inputName: string) => void;
  googleLogIn: () => void;
  emailLogin: (email: string, password: string) => void;
  logOut: () => void;
  setLoading: (boolean: boolean) => void;
  setCurrentUser: (user: User | null | undefined) => void;
};

type MyPersist = (
  config: StateCreator<AuthState>,
  options: PersistOptions<AuthState>,
) => StateCreator<AuthState>;

export const useAuth = create<AuthState>()(
  (persist as MyPersist)(
    set => ({
      currentUser: undefined,
      loading: false,
      alreadyExist: false,
      invalidUser: false,
      googleSignIn: async () => {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        const user = userCredential.user;

        const docRef = await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          id: user.uid,
        });

        set({
          loading: false,
          alreadyExist: false,
          invalidUser: false,
        });
      },
      emailSignIn: async (email, password, inputName) => {
        try {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password,
          );

          const user = userCredential.user;

          await updateProfile(user, {
            displayName: inputName,
          });

          const docRef = await setDoc(doc(db, 'users', user.uid), {
            name: user.displayName,
            id: user.uid,
          });

          set({
            currentUser: { id: user.uid, name: user.displayName },
            loading: false,
            alreadyExist: false,
            invalidUser: false,
          });
        } catch (error) {
          const firebaseError = error as { code: string; message: string };
          console.log(firebaseError.code, firebaseError.message);
          if (firebaseError.code === 'auth/email-already-in-use')
            set({
              alreadyExist: true,
            });
        }
      },
      googleLogIn: async () => {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        const user = userCredential.user;

        const docRef = await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          id: user.uid,
        });

        set({
          loading: false,
          alreadyExist: false,
          invalidUser: false,
        });
      },
      emailLogin: async (email, password) => {
        signInWithEmailAndPassword(auth, email, password)
          .then(userCredential => {
            const user = userCredential.user;
            set({
              loading: false,
              alreadyExist: false,
              invalidUser: false,
            });
          })
          .catch(error => {
            const errorCode = error.code;
            const errorMessage = error.message;

            console.log(error);

            if (errorCode === 'auth/invalid-credential') {
              set({ invalidUser: true });
            }
          });
      },
      logOut: () => {
        signOut(auth);
        set({
          alreadyExist: false,
          invalidUser: false,
        });
      },
      setLoading: boolean => {
        set({ loading: boolean });
      },

      setCurrentUser: user => {
        set({ currentUser: user });
      },
    }),
    { name: 'user-auth' },
  ),
);
