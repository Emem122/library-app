import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/providers/authContext';

const NotoSansJp = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-NotoSansJp',
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${NotoSansJp.variable} font-NotoSansJp`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
