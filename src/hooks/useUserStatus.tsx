import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth';

export default function useUserStatus() {
  const router = useRouter();
  const pathname = usePathname();

  const currentUser = useAuth(state => state.currentUser);
  const [userStatus, setUserStatus] = useState('loading');

  useEffect(() => {
    if (currentUser === null) {
      setUserStatus('no login');

      if (pathname === '/home' || pathname === '/list' || pathname === '/add') {
        setTimeout(() => {
          router.push('/');
        }, 1500);
      }
    } else if (currentUser !== null && currentUser !== undefined) {
      setUserStatus('logged in');

      if (
        pathname === '/' ||
        pathname === '/register' ||
        pathname === '/login'
      ) {
        setTimeout(() => {
          router.push('/home');
        }, 1500);
      }
    }
  }, [currentUser, router, pathname]);

  return userStatus;
}
