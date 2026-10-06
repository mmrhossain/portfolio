import Link from 'next/link';
import type { Metadata } from 'next';
import { noIndexRobots } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Sign in',
  robots: noIndexRobots,
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-12">
      <Link href="/" className="mb-8 font-display text-3xl font-extrabold uppercase tracking-tight">
        dev<span className="text-accent">.monir</span>
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
