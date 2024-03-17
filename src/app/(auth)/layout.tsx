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

      {userStatus === 'logged in' && <>{children}</>}

      {userStatus === 'no login' && (
        <p className="text-slate-500 text-sm text-center">
          ログインしていません。
          <br />
          ログイン画面へ戻ります。
        </p>
      )}
    </>
  );
}
