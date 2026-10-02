'use client';

import { Pencil, Trash2 } from 'lucide-react';
import type { Experience } from '@/types';
import { Button } from '@/components/ui/button';

interface ExperienceActionsProps {
  experience: Experience;
  onEdit: (experience: Experience) => void;
  onDelete: (id: string) => void;
}

export function ExperienceActions({
  experience,
  onEdit,
  onDelete,
}: ExperienceActionsProps) {
  return (
    <div className="flex gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-11 w-11"
        aria-label="Edit experience"
        onClick={() => onEdit(experience)}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-11 w-11 text-destructive"
        aria-label="Delete experience"
        onClick={() => onDelete(experience.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
