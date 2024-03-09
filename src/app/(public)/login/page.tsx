'use client';

import AuthStyle from '@/components/Auth/AuthStyle';
import { auth } from '@/firebase';
import {
  GoogleAuthProvider,
  UserCredential,
  signInWithPopup,
} from 'firebase/auth';

export default function Page() {
  const handleRegister = (): Promise<UserCredential> => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  return (
    <>
      <AuthStyle
        title="ログイン"
        linkRef="/register"
        linkText="新規登録はこちら">
        <main>
          <button onClick={handleRegister}>google register</button>
        </main>
      </AuthStyle>
    </>
  );
}
