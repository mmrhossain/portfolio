import { Timeline } from "@/components/about/timeline";
import type { Experience } from "@/types";

interface ExperienceTimelineProps {
  items: Experience[];
}

export function ExperienceTimeline({ items }: ExperienceTimelineProps) {
  return (
    <Timeline
      eyebrow="Experience"
      title="Work Experience"
      description="Roles and companies that shaped how I build products."
      emptyLabel="Experience entries will appear here once they are added."
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
