import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SessionProvider } from '@/src/components/auth/SessionProvider';
import { ReduxProvider } from '@/src/store/provider';
import { ThemeProvider } from '@/src/components/theme/theme-provider';
import { ThemeToggle } from '@/src/components/theme/theme-toggle';
import { ToasterProvider } from '@/src/components/toaster/ToasterProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HireFlow. - Professional Job Application Tracker',
  description: 'Track your job applications, manage company profiles, and find your dream job',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground transition-colors`} suppressHydrationWarning>
        <SessionProvider>
          <ThemeProvider>
            <ReduxProvider>
              {children}
              <ThemeToggle />
              <ToasterProvider />
            </ReduxProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}