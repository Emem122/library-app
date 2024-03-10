'use client';

import { useAuth } from '@/providers/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type AuthStyleProps = {
  title: string;
  linkRef: string;
  linkText: string;
  children: React.ReactNode;
};

export default function AuthStyle({
  title,
  linkRef,
  linkText,
  children,
}: AuthStyleProps) {
  const router = useRouter();

  const currentUser = useAuth(state => state.currentUser);
  const loading = useAuth(state => state.loading);

  useEffect(() => {
    if (!loading && currentUser !== null) {
      setTimeout(() => {
        router.push('/home');
      }, 1000);
    }
  }, [currentUser, loading, router]);

  return (
    <>
      {loading ? (
        <p>loading...</p>
      ) : currentUser !== null ? (
        <p>redirect to home...</p>
      ) : (
        <>
          <h1>{title}</h1>
          <div>
            {children}
            <Link
              href={linkRef}
              className="text-blue-600 underline underline-offset-4">
              {linkText}
            </Link>
          </div>
        </>
      )}
    </>
  );
}
