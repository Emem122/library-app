'use client';

import AuthStyle from '@/components/Auth/AuthStyle';
import { useAuth } from '@/providers/auth';
import { useState } from 'react';

export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const googleLogin = useAuth(state => state.googleLogIn);
  const emailLogin = useAuth(state => state.emailLogin);
  const invalidUser = useAuth(state => state.invalidUser);

  const handleGoogleLogin = async () => {
    googleLogin();
  };

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    emailLogin(email, password);

    if (invalidUser) {
      setEmail('');
      setPassword('');
    }
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
          {invalidUser && (
            <div>
              <p>ログイン情報が間違っています。もう一度お試しください。</p>
            </div>
          )}
        </main>
      </AuthStyle>
    </>
  );
}
