'use client';

import { useAuth } from '@/providers/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const currentUser = useAuth(state => state.currentUser);

  const logOut = useAuth(state => state.logOut);

  const handleSignOut = () => {
    logOut();
    router.push('/');
  };

  return (
    <>
      <div>
        <h1>{currentUser?.id}</h1>
        <p>{currentUser?.name}</p>
        <button onClick={handleSignOut}>logout</button>
        <hr />
        <Link href="/add">add book</Link>
        <Link href="/search">search book</Link>
      </div>
    </>
  );
}
