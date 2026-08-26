import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Barbets Admin',
  description: 'Internal admin and growth analytics console for Barbets.',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-paper text-espresso-800 antialiased">{children}</body>
    </html>
  );
}
