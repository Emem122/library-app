'use client';

import Link from 'next/link';

export default function Home() {
  return (
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
