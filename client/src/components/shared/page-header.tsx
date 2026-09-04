import { cn } from '@/lib/utils';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}

export function PageHeader({ eyebrow, title, description, className }: PageHeaderProps) {
  return (
    <div className={cn('min-w-0 space-y-3 py-8 text-center sm:space-y-4 sm:py-16', className)}>
      {eyebrow && (
        <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          <span className="h-px w-8 bg-accent" />
          {eyebrow}
          <span className="h-px w-8 bg-accent" />
        </span>
      )}
      <h1 className="mx-auto max-w-3xl break-words font-display text-3xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
        {title}
      </h1>
      {description && (
        <p className="mx-auto mb-2 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
