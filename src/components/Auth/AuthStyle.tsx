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
      <h1 className="my-10 text-center text-lg font-medium text-blue-500">
        {title}
      </h1>
      <div className="px-4 w-full max-w-md mx-auto">
        {children}
        <div className="mt-8 flex justify-end">
          <Link
            href={linkRef}
            className="text-sm text-blue-500 underline underline-offset-2 hover:text-blue-400">
            {linkText}
          </Link>
        </div>
      </div>
    </>
  );
}
