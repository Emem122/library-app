'use client';

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
  return (
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
  );
}
