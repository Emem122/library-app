'use client';

import AuthInput from '@/components/Auth/AuthInput';
import AuthStyle from '@/components/Auth/AuthStyle';

import { useAuth } from '@/providers/auth';
import Link from 'next/link';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';

export default function RegisterPage() {
  const [inputName, setInputName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const googleSignIn = useAuth(state => state.googleSignIn);
  const alreadyExist = useAuth(state => state.alreadyExist);
  const emailSignIn = useAuth(state => state.emailSignIn);

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
              <AuthInput
                label="名前"
                type="text"
                required
                value={inputName}
                onChange={e => setInputName(e.target.value)}
              />
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
    </>
  );
}
