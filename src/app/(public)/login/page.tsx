'use client';

import AuthStyle from '@/components/Auth/AuthStyle';
import { auth, db } from '@/firebase';
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [invalid, setInvalid] = useState(false);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    const docRef = await setDoc(doc(db, 'users', user.uid), {
      name: user.displayName,
      id: user.uid,
    });

    router.push('/');
  };

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        const user = userCredential.user;

        router.push('/');
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log(error);

        if (errorCode === 'auth/invalid-credential') {
          setInvalid(true);
        }
      });
  };

  return (
    <>
      <AuthStyle
        title="ログイン"
        linkRef="/register"
        linkText="新規登録はこちら">
        <main>
          <button onClick={handleGoogleLogin}>google register</button>
          <form onSubmit={handleEmailLogin} className="[&>*]:block">
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
          {invalid && (
            <div>
              <p>ログインできません。</p>
            </div>
          )}
        </main>
      </AuthStyle>
    </>
  );
}
