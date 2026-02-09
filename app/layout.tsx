/**
 * Root layout for the Next.js App Router application.
 *
 * Architecture: AuthProvider wraps the entire app to provide authentication state
 * throughout the component tree. AppShell provides the navbar/footer chrome that
 * persists across all routes. Both are 'use client' components since they use React
 * hooks (useState, useEffect) and browser APIs (localStorage).
 */
import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/auth/AuthContext';
import { AppShell } from '@/components/layout/AppShell';
import './globals.css';

export const metadata: Metadata = {
  title: 'HTN Events - Hackathon Global Inc.',
  description: 'Events web app for Hackathon Global Inc. Browse workshops, tech talks, and activities.',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
