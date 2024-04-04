'use client';

import { auth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return (
      <p className="text-slate-500 text-sm text-center">ローディング...</p>
    );
  }
  if (user) {
    setTimeout(() => {
      router.push('/home');
    }, 1500);

    return (
      <div className="text-slate-500 text-sm text-center">
        ログイン済み。ホームへ遷移
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-slate-500 text-sm text-center">
        ログイン済み。ホームへ遷移
      </div>
    );
  }

  return (
    <>
      <div>{children}</div>
    </>
  );
}
