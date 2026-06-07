import type { Metadata } from 'next';
import Link from 'next/link';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Quiz Builder',
  description: 'Build and manage quizzes',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        {/* Simple top nav shared across all pages */}
        <header className="border-b border-gray-200 bg-white">
          <nav className="mx-auto flex max-w-2xl items-center gap-6 p-4 text-sm">
            <Link href="/" className="font-semibold">
              Quiz Builder
            </Link>
            <Link href="/create" className="text-gray-600 hover:text-gray-900">
              Create
            </Link>
            <Link href="/quizzes" className="text-gray-600 hover:text-gray-900">
              Quizzes
            </Link>
          </nav>
        </header>

        {children}
      </body>
    </html>
  );
}
