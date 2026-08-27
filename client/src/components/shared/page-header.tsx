import { cn } from '@/lib/utils';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}

export function PageHeader({ eyebrow, title, description, className }: PageHeaderProps) {
  return (
    <div className={cn('space-y-4 py-12 text-center sm:py-16', className)}>
      {eyebrow && (
        <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          <span className="h-px w-8 bg-accent" />
          {eyebrow}
          <span className="h-px w-8 bg-accent" />
        </span>
      )}
      <h1 className="mx-auto max-w-3xl font-display text-4xl font-bold tracking-tight break-words sm:text-5xl md:text-6xl lg:text-7xl">
        {title}
      </h1>
      {description && (
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
