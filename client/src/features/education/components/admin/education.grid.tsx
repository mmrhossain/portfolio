'use client';

import type { Education } from '@/types';
import { EducationCard } from './education.card';

interface EducationGridProps {
  items: Education[];
  onEdit: (education: Education) => void;
  onDelete: (id: string) => void;
}

export function EducationGrid({
  items,
  onEdit,
  onDelete,
}: EducationGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((education) => (
        <EducationCard
          key={education.id}
          education={education}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
