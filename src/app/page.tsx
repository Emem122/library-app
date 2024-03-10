'use client';

import { useAuth } from '@/providers/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const currentUser = useAuth(state => state.currentUser);
  const loading = useAuth(state => state.loading);
  const router = useRouter();

  useEffect(() => {
    if (!loading && currentUser !== null) {
      setTimeout(() => {
        router.push('/home');
      }, 1000);
    }
  }, [currentUser, loading, router]);

  return loading ? (
    <p>loading...</p>
  ) : currentUser !== null ? (
    <p>redirect to home...</p>
  ) : (
    <main>
      <>
        <h1>ようこそ</h1>
        <div className="*:px-12 *:py-4 *:inline-block *:text-white">
          <Link href="/login" className="bg-blue-500">
            ログイン
          </Link>
          <Link href="/register" className="bg-orange-500">
            新規登録
          </Link>
        </div>
      </>
    </main>
  );
}
