'use client';

import { useAuth, useHandleAuth } from '@/providers/auth';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const currentUser = useAuth();
  const handleLogout = useHandleAuth();

  return currentUser !== null ? (
    <>
      <div>
        <h1>{currentUser?.id}</h1>
        <p>{currentUser?.name}</p>
        <button onClick={handleLogout}>logout</button>
      </div>
    </>
  ) : (
    router.push('/')
  );
}
