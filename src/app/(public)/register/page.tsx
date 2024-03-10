'use client';

import AuthStyle from '@/components/Auth/AuthStyle';
import { auth, db } from '@/firebase';
import { useAuth } from '@/providers/auth';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Page() {
  const router = useRouter();
  const currentUser = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alreadyExist, setAlreadyExist] = useState(false);

  const handleGoogleRegister = async () => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    const docRef = await setDoc(doc(db, 'users', user.uid), {
      name: user.displayName,
      id: user.uid,
    });

    router.push('/');
  };

  const handleEmailRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const user = userCredential.user;

      const currentUser = auth?.currentUser;
      if (currentUser !== null) {
        await updateProfile(currentUser, {
          displayName: name,
        });
      } else {
        console.log('handleRegister: currentUser is null');
      }

      const docRef = await setDoc(doc(db, 'users', user.uid), {
        name: user.displayName,
        id: user.uid,
      });

      router.push('/');
    } catch (error) {
      const firebaseError = error as { code: string; message: string };
      console.log(firebaseError.code, firebaseError.message);
      if (firebaseError.code === 'auth/email-already-in-use')
        setAlreadyExist(true);
    }
  };

  return (
    <>
      <AuthStyle title="新規登録" linkRef="/login" linkText="ログインはこちら">
        <main>
          <button onClick={handleGoogleRegister}>google register</button>
          <hr />
          <form onSubmit={handleEmailRegister} className="[&>*]:block">
            <label htmlFor="name">名前</label>
            <input
              type="text"
              required
              id="name"
              name="name"
              className="border"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <label htmlFor="email">Email</label>
            <input
              type="email"
              required
              id="email"
              name="email"
              className="border"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              required
              id="password"
              name="password"
              className="border"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button>email register</button>
          </form>
          {alreadyExist && (
            <div>
              <p className="text-red-600">
                You have already create an account.
              </p>
              <p>
                Go to{' '}
                <Link href="/login" className="text-blue-600">
                  Login page
                </Link>
                .
              </p>
            </div>
          )}
        </main>
      </AuthStyle>
    </>
  );
}
