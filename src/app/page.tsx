'use client';

import { useAuth } from '@/providers/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();

  const currentUser = useAuth(state => state.currentUser);
  const [userStatus, setUserStatus] = useState('loading');

  useEffect(() => {
    console.log(currentUser);

    if (currentUser === null) {
      setUserStatus('no login');
    } else if (currentUser !== null && currentUser !== undefined) {
      setUserStatus('logged in');
      setTimeout(() => {
        router.push('/home');
      }, 1500);
    }
  }, [currentUser, router]);

  return (
    <div className="max-w-lg mx-auto">
      {userStatus === 'loading' && (
        <p className="text-slate-500 text-sm text-center">ローディング...</p>
      )}
      {userStatus === 'no login' && (
        <main>
          <div className="my-10 flex justify-center gap-5 *:px-12 *:py-4 *:block *:text-white *:rounded *:shadow-md">
            <Link href="/login" className="bg-blue-500 hover:bg-blue-400">
              ログイン
            </Link>
            <Link
              href="/register"
              className="bg-orange-500 hover:bg-orange-400">
              新規登録
            </Link>
          </div>
        </main>
      )}
      {userStatus === 'logged in' && (
        <div className="text-slate-500 text-sm text-center">
          ログイン済み。ホームへ遷移
        </div>
      )}
    </div>
  );
}
