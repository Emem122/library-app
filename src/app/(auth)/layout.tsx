'use client';

import { auth } from '@/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return (
      <p className="text-slate-500 text-sm text-center">ローディング...</p>
    );
  }

  if (error) {
    return (
      <p className="text-slate-500 text-sm text-center">エラーが発生しました</p>
    );
  }

  if (user) {
    return <>{children}</>;
  }

  return (
    <p className="text-slate-500 text-sm text-center">
      ログインしていません。
      <br />
      ログイン画面へ戻ります。
    </p>
  );
}
