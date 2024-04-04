'use client';

import { auth } from '@/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth';
import Link from 'next/link';

export default function Header() {
  const router = useRouter();
  const currentUser = useAuth(state => state.currentUser);
  const [user] = useAuthState(auth);

  const logOut = useAuth(state => state.logOut);

  const handleSignOut = () => {
    logOut();
    setTimeout(() => {
      router.push('/');
    }, 1500);
  };

  return (
    <>
      <header className="px-4 py-2 flex items-center justify-between border-b mb-4 h-12">
        {user ? (
          <>
            <Link href="/home">図書管理アプリ</Link>
            <div className="flex items-center gap-3">
              <p className="text-slate-500 text-xs">{currentUser?.name}</p>
              <button
                className="py-1 px-3 border border-slate-200 shadow-sm text-sm rounded-md hover:bg-slate-100"
                onClick={handleSignOut}>
                ログアウト
              </button>
            </div>
          </>
        ) : (
          <Link href="/">図書管理アプリ</Link>
        )}
      </header>
    </>
  );
}
