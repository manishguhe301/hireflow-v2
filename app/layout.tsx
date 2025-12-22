import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/src/store/provider";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'JobFlow - Professional Job Application Tracker',
  description: 'Track your job applications, manage company profiles, and find your dream job',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
