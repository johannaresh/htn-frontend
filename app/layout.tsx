import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/auth/AuthContext';
import { AppShell } from '@/components/layout/AppShell';
import './globals.css';

export const metadata: Metadata = {
  title: 'HTN Events - Hackathon Global Inc.',
  description: 'Events web app for Hackathon Global Inc. Browse workshops, tech talks, and activities.',
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
