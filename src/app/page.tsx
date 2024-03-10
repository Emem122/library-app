'use client';

import { useAuth } from '@/providers/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const currentUser = useAuth();
  const router = useRouter();

  return currentUser === null ? (
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
  ) : (
    router.push('/home')
  );
}
