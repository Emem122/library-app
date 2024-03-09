'use client';

import AuthStyle from '@/components/Auth/AuthStyle';
import { auth } from '@/firebase';
import {
  GoogleAuthProvider,
  UserCredential,
  signInWithPopup,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  const handleRegister = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    router.push('/');
  };

  return (
    <>
      <AuthStyle title="新規登録" linkRef="/login" linkText="ログインはこちら">
        <main>
          <button onClick={handleRegister}>google register</button>
        </main>
      </AuthStyle>
    </>
  );
}
