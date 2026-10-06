import type { ReactNode } from "react";
import { Timeline } from "@/components/shared/timeline";
import type { Education } from "@/types";

interface EducationTimelineProps {
  items: Education[];
  compact?: boolean;
  action?: ReactNode;
}

export function EducationTimeline({
  items,
  compact,
  action,
}: EducationTimelineProps) {
  return (
    <Timeline
      eyebrow="Education"
      title="Education"
      description="Academic background and formal learning."
      emptyLabel="Education entries will appear here once they are added."
      compact={compact}
      action={action}
      items={items.map((item) => ({
        id: item.id,
        title: item.degree,
        subtitle: item.field
          ? `${item.institution} · ${item.field}`
          : item.institution,
        location: item.location,
        startDate: item.startDate,
        endDate: item.endDate,
        description: item.description,
      }))}
    />
  );
}
