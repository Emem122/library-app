'use client';

import { auth } from '@/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Link from 'next/link';

export default function Home() {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return (
      <div className="max-w-lg mx-auto">
        <p className="text-slate-500 text-sm text-center">ローディング...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto">
        <p className="text-slate-500 text-sm text-center">
          エラーが発生しました
        </p>
      </div>
    );
  }

  if (user) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="text-slate-500 text-sm text-center">
          ログイン済み。ホームへ遷移
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <main>
        <div className="my-10 flex justify-center gap-5 *:px-12 *:py-4 *:block *:text-white *:rounded *:shadow-md">
          <Link href="/login" className="bg-blue-500 hover:bg-blue-400">
            ログイン
          </Link>
          <Link href="/register" className="bg-orange-500 hover:bg-orange-400">
            新規登録
          </Link>
        </div>
      </main>
    </div>
  );
}
