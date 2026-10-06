import { RichTextContent } from "@/components/shared/editor/rich-text-content";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionHeading } from "@/components/shared/section-heading";
import type { RichTextValue } from "@/lib/rich-text";
import { cn, formatDateRange } from "@/lib/utils";
import type { ReactNode } from "react";

export interface TimelineItem {
  id: string;
  title: string;
  subtitle: string;
  location?: string | null;
  startDate: string;
  endDate: string | null;
  description: RichTextValue;
}

interface TimelineProps {
  eyebrow: string;
  title: string;
  description?: string;
  items: TimelineItem[];
  emptyLabel: string;
  compact?: boolean;
  action?: ReactNode;
}

export function Timeline({
  eyebrow,
  title,
  description,
  items,
  emptyLabel,
  compact = false,
  action,
}: TimelineProps) {
  return (
    <section className={cn(compact ? "py-12 lg:py-20" : "py-12 md:py-20")}>
      <div className="container-page">
        <div
          className={cn(
            "flex min-w-0 flex-wrap items-end justify-between gap-4 lg:gap-6",
            !action && "block"
          )}
        >
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            description={description}
            className={cn("min-w-0", action && "mb-2")}
          />

          {action}
        </div>

        {items.length === 0 ? (
          <EmptyState
            title={emptyLabel}
            description="Add entries from the dashboard to show them here."
          />
        ) : (
          <ol
            className={cn(
              "relative border-l border-border pl-6 sm:pl-8",
              compact ? "space-y-4" : "space-y-8"
            )}
          >
            {items.map((item, index) => (
              <li key={item.id} className="relative min-w-0">
                <span
                  className={cn(
                    "absolute top-1.5 rounded-full border-2 border-background",
                    compact
                      ? "-left-[29px] h-3 w-3 sm:-left-[37px]"
                      : "-left-[31px] h-3.5 w-3.5 sm:-left-[39px]",
                    index === 0 ? "bg-accent" : "bg-foreground"
                  )}
                  aria-hidden="true"
                />

                <article
                  className={cn(
                    "rounded-2xl border border-border bg-card transition-transform duration-300 hover:-translate-y-0.5",
                    compact ? "p-4 sm:p-5" : "p-5 sm:p-6"
                  )}
                >
                  {/* Header */}
                  <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                    <div className="min-w-0">
                      <h3
                        className={cn(
                          "break-words font-display font-bold tracking-tight",
                          compact ? "text-lg sm:text-xl" : "text-xl sm:text-2xl"
                        )}
                      >
                        {item.title}
                      </h3>

                      <p className="mt-1 text-sm font-medium text-foreground sm:text-base">
                        {item.subtitle}
                        {item.location ? ` · ${item.location}` : ""}
                      </p>
                    </div>

                    {/* Date */}
                    <p
                      className="
                        shrink-0
                        text-left
                        text-xs
                        font-medium
                        uppercase
                        tracking-wider
                        text-muted-foreground
                        sm:pt-1
                        sm:text-right
                        sm:text-sm
                      "
                    >
                      {formatDateRange(item.startDate, item.endDate)}
                    </p>
                  </div>

                  <RichTextContent value={item.description} compact={compact} className="mt-4" />
                </article>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
