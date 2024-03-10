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
      }, 1000);
    }
  }, [currentUser, loading, router]);

  return loading ? (
    <p>loading</p>
  ) : currentUser !== null ? (
    <>{children}</>
  ) : (
    <p>
      you are not logged in.
      <br />
      redirect to home.
    </p>
  );
}
