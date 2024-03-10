'use client';

import AuthStyle from '@/components/Auth/AuthStyle';
import { useAuth } from '@/providers/auth';
import Link from 'next/link';
import { useState } from 'react';

export default function Page() {
  const googleSignIn = useAuth(state => state.googleSignIn);
  const alreadyExist = useAuth(state => state.alreadyExist);
  const emailSignIn = useAuth(state => state.emailSignIn);

  const [inputName, setInputName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleRegister = async () => {
    googleSignIn();
  };

  const handleEmailRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    emailSignIn(email, password, inputName);
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
              value={inputName}
              onChange={e => setInputName(e.target.value)}
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
              </p>
            </div>
          )}
        </main>
      </AuthStyle>
    </>
  );
}
