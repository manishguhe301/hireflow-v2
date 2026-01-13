import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SessionProvider } from '@/src/components/auth/SessionProvider';
import { ReduxProvider } from '@/src/store/provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'JobFlow - Professional Job Application Tracker',
  description: 'Track your job applications, manage company profiles, and find your dream job',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <SessionProvider>
          <ReduxProvider>
            {children}
          </ReduxProvider>
        </SessionProvider>
      </body>
    </html>
  );
}