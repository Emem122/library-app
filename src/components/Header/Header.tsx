'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth';
import Link from 'next/link';
import useUserStatus from '@/hooks/useUserStatus';

export default function Header() {
  const router = useRouter();
  const currentUser = useAuth(state => state.currentUser);
  const userStatus = useUserStatus();

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
        {(userStatus === 'no login' || userStatus === 'loading') && (
          <Link href="/">書庫管理アプリ</Link>
        )}
        {userStatus === 'logged in' && (
          <>
            <Link href="/home">書庫管理アプリ</Link>
            <div className="flex items-center gap-3">
              <p className="text-slate-500 text-xs">{currentUser?.name}</p>
              <button
                className="py-1 px-3 border border-slate-200 shadow-sm text-sm rounded-md hover:bg-slate-100"
                onClick={handleSignOut}>
                ログアウト
              </button>
            </div>
          </>
        )}
      </header>
    </>
  );
}
