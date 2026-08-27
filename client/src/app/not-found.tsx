import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BackButton } from '@/components/shared/back-button';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <p className="font-display text-7xl font-bold leading-none text-muted sm:text-8xl md:text-[120px]">404</p>
      <h1 className="font-display text-3xl font-bold">This page doesn&apos;t exist</h1>
      <p className="max-w-md text-muted-foreground">
        Please check the URL or return to the home page.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <BackButton />
        <Button asChild>
          <Link href="/">
            <Home className="h-4 w-4" />
            Take me home
          </Link>
        </Button>
      </div>
    </div>
  );
}
