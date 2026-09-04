import Image from 'next/image';
import { ContactForm } from '@/components/contact/contact-form';

export function ContactCta() {
  return (
    <section className="relative overflow-hidden py-12 md:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60 dark:opacity-30">
        <Image src="/images/bg/bg-gradiant3.svg" alt="" fill unoptimized className="object-cover" />
      </div>
      <div className="container-page">
        <div className="grid min-w-0 grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="min-w-0 space-y-4 sm:space-y-6 lg:col-span-7">
            <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              <span className="h-px w-8 bg-accent" />
              Contact
            </span>
            <h2 className="break-words font-display text-3xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-[76px]">
              Interested in{' '}
              <span className="rounded-lg bg-foreground px-1.5 text-background sm:rounded-xl sm:px-3">work</span> together?
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              I start every new client interaction with an in-depth discovery call where we get to
              know each other and recommend the best course of action.
            </p>
          </div>

          <div className="min-w-0 lg:col-span-5">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
