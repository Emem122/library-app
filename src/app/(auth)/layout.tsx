'use client';

import { useAuth } from '@/providers/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  const currentUser = useAuth(state => state.currentUser);
  const loading = useAuth(state => state.loading);

  useEffect(() => {
    if (!loading && currentUser === null) {
      setTimeout(() => {
        router.push('/');
      }, 1500);
    }
  }, [currentUser, loading, router]);

  return loading ? (
    <p className="text-slate-500 text-sm text-center">ローディング...</p>
  ) : currentUser !== null ? (
    <>{children}</>
  ) : (
    <p className="text-slate-500 text-sm text-center">
      ログインしていません。
      <br />
      ログイン画面へ戻ります。
    </p>
  );
}
