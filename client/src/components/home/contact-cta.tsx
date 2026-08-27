import { ContactForm } from '@/components/contact/contact-form';

export function ContactCta() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60 dark:opacity-30">
        <img src="/images/bg-gradiant3.svg" alt="" className="h-full w-full object-cover" />
      </div>
      <div className="container-page">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              <span className="h-px w-8 bg-accent" />
              Contact
            </span>
            <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-[76px]">
              Interested in{' '}
              <span className="rounded-xl bg-foreground px-3 text-background">work</span> together?
            </h2>
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
              I start every new client interaction with an in-depth discovery call where we get to
              know each other and recommend the best course of action.
            </p>
          </div>

          <div className="lg:col-span-5">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
