import type { ReactNode } from "react";
import { Timeline } from "@/components/shared/timeline";
import type { Experience } from "@/types";

interface ExperienceTimelineProps {
  items: Experience[];
  compact?: boolean;
  action?: ReactNode;
}

export function ExperienceTimeline({
  items,
  compact,
  action,
}: ExperienceTimelineProps) {
  return (
    <Timeline
      eyebrow="Experience"
      title="Work Experience"
      description={
        compact
          ? "Recent roles and the products I shipped."
          : "Roles and companies that shaped how I build products."
      }
      emptyLabel="Experience entries will appear here once they are added."
      compact={compact}
      action={action}
      items={items.map((item) => ({
        id: item.id,
        title: item.role,
        subtitle: item.company,
        location: item.location,
        startDate: item.startDate,
        endDate: item.endDate,
        description: item.description,
      }))}
    />
  );
}
