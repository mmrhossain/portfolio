import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AboutTeaser() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60 dark:opacity-30">
        <img src="/images/bg-gradiant2.svg" alt="" className="h-full w-full object-cover" />
      </div>
      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-bold leading-[1.1] tracking-tight break-words sm:text-5xl md:text-6xl lg:text-[72px]">
            I&apos;ve been{' '}
            <span className="inline-block rounded-xl bg-foreground px-2 text-background sm:px-3">Developing</span>
            <br />
            Websites since{' '}
            <span className="inline-block rounded-xl bg-foreground px-2 text-background sm:px-3">2023</span>
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            I start every new client interaction with an in-depth discovery call where we get to know
            each other and recommend the best course of action.
          </p>
          <Button asChild variant="outline" size="lg" className="mt-8">
            <Link href="/about">
              More about me
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
