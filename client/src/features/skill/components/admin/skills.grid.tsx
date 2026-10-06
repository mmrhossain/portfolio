'use client';

import type { Skill } from '@/types';
import { SkillCard } from './skill.card';

interface SkillsGridProps {
    skills: Skill[];
    onEdit: (skill: Skill) => void;
    onDelete: (id: string) => void;
}

export function SkillsGrid({
                               skills,
                               onEdit,
                               onDelete,
                           }: SkillsGridProps) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill) => (
                <SkillCard
                    key={skill.id}
                    skill={skill}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}