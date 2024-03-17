'use client';

import useUserStatus from '@/hooks/useUserStatus';
import Link from 'next/link';

export default function Home() {
  const userStatus = useUserStatus();

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
