'use client';

import type { Experience } from '@/types';
import { ExperienceCard } from './experience.card';

interface ExperienceGridProps {
  items: Experience[];
  onEdit: (experience: Experience) => void;
  onDelete: (id: string) => void;
}

export function ExperienceGrid({
  items,
  onEdit,
  onDelete,
}: ExperienceGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((experience) => (
        <ExperienceCard
          key={experience.id}
          experience={experience}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
