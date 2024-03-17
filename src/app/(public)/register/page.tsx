'use client';

import AuthStyle from '@/components/Auth/AuthStyle';
import { useAuth } from '@/providers/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FcGoogle } from 'react-icons/fc';

export default function Page() {
  const router = useRouter();

  const googleSignIn = useAuth(state => state.googleSignIn);
  const alreadyExist = useAuth(state => state.alreadyExist);
  const emailSignIn = useAuth(state => state.emailSignIn);

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
      {userStatus === 'loading' && (
        <p className="text-slate-500 text-sm text-center">ローディング...</p>
      )}
      {userStatus === 'no login' && (
        <AuthStyle
          title="新規登録"
          linkRef="/login"
          linkText="ログインはこちら">
          <main>
            <div className="mb-8 flex justify-center">
              <button
                onClick={handleGoogleRegister}
                className="px-6 py-2 rounded border shadow flex items-center gap-2 hover:bg-slate-100">
                <i className="w-5 h-5">
                  <FcGoogle className="w-full h-full" />
                </i>
                Googleでサインイン
              </button>
            </div>
            <div className="border-t pt-8">
              <h2 className="text-center mb-6">メールアドレスで新規登録</h2>
              <form
                onSubmit={handleEmailRegister}
                className="[&>*]:block px-4 max-w-xs mx-auto">
                <label className="text-sm mb-1 text-slate-500" htmlFor="name">
                  名前
                </label>
                <input
                  type="text"
                  required
                  id="name"
                  name="name"
                  className="mb-4 border rounded-sm w-full p-1"
                  value={inputName}
                  onChange={e => setInputName(e.target.value)}
                />
                <label className="text-sm mb-1 text-slate-500" htmlFor="email">
                  Email
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
                  Password
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
                  登録
                </button>
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
