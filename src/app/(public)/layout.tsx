'use client';

import useUserStatus from '@/hooks/useUserStatus';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userStatus = useUserStatus();

  return (
    <>
      {userStatus === 'loading' && (
        <p className="text-slate-500 text-sm text-center">ローディング...</p>
      )}

      {userStatus === 'no login' && <div>{children}</div>}
      {userStatus === 'logged in' && (
        <div className="text-slate-500 text-sm text-center">
          ログイン済み。ホームへ遷移
        </div>
      )}
    </>
  );
}
