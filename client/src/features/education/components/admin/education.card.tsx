"use client";

import type { Education } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatDateRange } from "@/lib/utils";
import { EducationActions } from "./education.actions";

interface EducationCardProps {
  education: Education;
  onEdit: (education: Education) => void;
  onDelete: (id: string) => void;
}

export function EducationCard({
  education,
  onEdit,
  onDelete,
}: EducationCardProps) {
  return (
    <div className="group rounded-2xl border p-5">
      <div className="flex justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium">{education.degree}</p>
          <p className="truncate text-sm text-muted-foreground">
            {education.institution}
            {education.field ? ` · ${education.field}` : ""}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">
              {formatDateRange(education.startDate, education.endDate)}
            </Badge>
          </div>
        </div>
        <EducationActions
          education={education}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}
