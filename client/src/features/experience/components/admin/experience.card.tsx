"use client";

import type { Experience } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatDateRange } from "@/lib/utils";
import { ExperienceActions } from "./experience.actions";

interface ExperienceCardProps {
  experience: Experience;
  onEdit: (experience: Experience) => void;
  onDelete: (id: string) => void;
}

export function ExperienceCard({
  experience,
  onEdit,
  onDelete,
}: ExperienceCardProps) {
  return (
    <div className="group rounded-2xl border p-5">
      <div className="flex justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium">{experience.role}</p>
          <p className="truncate text-sm text-muted-foreground">
            {experience.company}
            {experience.location ? ` · ${experience.location}` : ""}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">
              {formatDateRange(experience.startDate, experience.endDate)}
            </Badge>
          </div>
        </div>
        <ExperienceActions
          experience={experience}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}
