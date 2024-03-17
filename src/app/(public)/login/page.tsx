'use client';

import AuthInput from '@/components/Auth/AuthInput';
import AuthStyle from '@/components/Auth/AuthStyle';
import { useAuth } from '@/providers/auth';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
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
          <div className="mb-8 flex justify-center">
            <button
              className="px-6 py-2 rounded border shadow flex items-center gap-2 hover:bg-slate-100"
              onClick={handleGoogleLogin}>
              <i className="w-5 h-5">
                <FcGoogle className="w-full h-full" />
              </i>
              Googleでログイン
            </button>
          </div>
          <div className="border-t pt-8">
            <h2 className="text-center mb-6">メールアドレスでログイン</h2>
            <form
              onSubmit={handleEmailLogin}
              className="[&>*]:block px-4 max-w-xs mx-auto">
              <AuthInput
                label="メールアドレス"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <AuthInput
                label="パスワード"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button className="mt-6 mx-auto px-6 py-2 bg-blue-500 text-white rounded shadow">
                ログイン
              </button>
            </form>
            {invalidUser && (
              <div>
                <p>ログイン情報が間違っています。もう一度お試しください。</p>
              </div>
            )}
          </div>
        </main>
      </AuthStyle>
    </>
  );
}
