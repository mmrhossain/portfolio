import { Timeline } from "@/components/about/timeline";
import type { Education } from "@/types";

interface EducationTimelineProps {
  items: Education[];
}

export function EducationTimeline({ items }: EducationTimelineProps) {
  return (
    <Timeline
      eyebrow="Education"
      title="Education"
      description="Academic background and formal learning."
      emptyLabel="Education entries will appear here once they are added."
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
