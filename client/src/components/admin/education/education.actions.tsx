'use client';

import { Pencil, Trash2 } from 'lucide-react';
import type { Education } from '@/types';
import { Button } from '@/components/ui/button';

interface EducationActionsProps {
  education: Education;
  onEdit: (education: Education) => void;
  onDelete: (id: string) => void;
}

export function EducationActions({
  education,
  onEdit,
  onDelete,
}: EducationActionsProps) {
  return (
    <div className="flex gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-11 w-11"
        aria-label="Edit education"
        onClick={() => onEdit(education)}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-11 w-11 text-destructive"
        aria-label="Delete education"
        onClick={() => onDelete(education.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
