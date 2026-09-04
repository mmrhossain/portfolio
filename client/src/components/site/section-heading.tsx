import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
  align?: 'left' | 'center';
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  align = 'left',
}: SectionHeadingProps) {
  return (
    <div className={cn('mb-8 min-w-0 space-y-3 sm:mb-12 sm:space-y-4', align === 'center' && 'text-center', className)}>
      <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        <span className="h-px w-8 bg-accent" />
        {eyebrow}
        {align === 'center' && <span className="h-px w-8 bg-accent" />}
      </span>
      <h2 className="break-words text-3xl font-bold tracking-tight sm:text-5xl lg:text-[56px] lg:leading-[1.1]">
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{description}</p>
      )}
    </div>
  );
}
