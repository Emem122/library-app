'use client';

import AuthStyle from '@/components/Auth/AuthStyle';
import { useAuth } from '@/providers/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FcGoogle } from 'react-icons/fc';

export default function Page() {
  const router = useRouter();

  const currentUser = useAuth(state => state.currentUser);
  const [userStatus, setUserStatus] = useState('loading');

  useEffect(() => {
    if (currentUser === null) {
      setUserStatus('no login');
    } else if (currentUser !== null && currentUser !== undefined) {
      setUserStatus('logged in');
      setTimeout(() => {
        router.push('/home');
      }, 1500);
    }
  }, [currentUser, router]);

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
      {userStatus === 'loading' && (
        <p className="text-slate-500 text-sm text-center">ローディング...</p>
      )}
      {userStatus === 'no login' && (
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
                <label className="text-sm mb-1 text-slate-500" htmlFor="email">
                  メールアドレス
                </label>
                <input
                  type="email"
                  required
                  id="email"
                  name="email"
                  className="mb-4 border rounded-sm w-full p-1"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <label
                  className="text-sm mb-1 text-slate-500"
                  htmlFor="password">
                  パスワード
                </label>
                <input
                  type="password"
                  required
                  id="password"
                  name="password"
                  className="border rounded-sm w-full p-1"
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
      )}
      {userStatus === 'logged in' && (
        <div className="text-slate-500 text-sm text-center">
          ログイン済み。ホームへ遷移
        </div>
      )}
    </>
  );
}
