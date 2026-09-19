import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Full-stack monorepo',
  description: 'Next.js frontend with a NestJS API',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
