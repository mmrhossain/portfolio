'use client';

import { Pencil, Trash2 } from 'lucide-react';
import type { Skill } from '@/types';

import { Button } from '@/components/ui/button';

interface SkillActionsProps {
    skill: Skill;
    onEdit: (skill: Skill) => void;
    onDelete: (id: string) => void;
}

export function SkillActions({
                                 skill,
                                 onEdit,
                                 onDelete,
                             }: SkillActionsProps) {
    return (
        <div className="flex gap-1">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(skill)}
            >
                <Pencil className="h-4 w-4" />
            </Button>

            <Button
                variant="ghost"
                size="icon"
                className="text-destructive"
                onClick={() => onDelete(skill.id)}
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
}