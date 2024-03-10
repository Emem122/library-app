import { useAuth } from '@/providers/auth';
import Link from 'next/link';

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
  const currentUser = useAuth();

  return (
    <>
      {currentUser ? (
        <>
          <p>すでにログイン済みです。</p>
          <Link href="/">ホームへ戻る</Link>
        </>
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
      )}{' '}
    </>
  );
}
