import { SectionHeading } from "@/components/site/section-heading";
import { cn, formatDateRange } from "@/lib/utils";

export interface TimelineItem {
  id: string;
  title: string;
  subtitle: string;
  location?: string | null;
  startDate: string;
  endDate: string | null;
  description: string;
}

interface TimelineProps {
  eyebrow: string;
  title: string;
  description?: string;
  items: TimelineItem[];
  emptyLabel: string;
}

export function Timeline({
  eyebrow,
  title,
  description,
  items,
  emptyLabel,
}: TimelineProps) {
  return (
    <section className="py-12 md:py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
        />

        {items.length === 0 ? (
          <p className="text-muted-foreground">{emptyLabel}</p>
        ) : (
          <ol className="relative space-y-8 border-l border-border pl-6 sm:pl-8">
            {items.map((item, index) => (
              <li key={item.id} className="relative min-w-0">
                <span
                  className={cn(
                    "absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-background sm:-left-[39px]",
                    index === 0 ? "bg-accent" : "bg-foreground",
                  )}
                  aria-hidden="true"
                />
                <article className="rounded-2xl border border-border bg-card p-5 transition-transform duration-300 hover:-translate-y-0.5 sm:p-6">
                  <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    {formatDateRange(item.startDate, item.endDate)}
                  </p>
                  <h3 className="mt-2 break-words font-display text-xl font-bold tracking-tight sm:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-foreground sm:text-base">
                    {item.subtitle}
                    {item.location ? ` · ${item.location}` : ""}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {item.description}
                  </p>
                </article>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
