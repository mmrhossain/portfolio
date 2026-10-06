'use client';

import {
    ExternalLink,
    Pencil,
    Trash2,
} from 'lucide-react';

import {FaGithub} from 'react-icons/fa';

import {
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import type {Project} from '@/types';
import Link from "next/link";

interface Props {
    project: Project;
    onEdit: () => void;
    onDelete: () => void;
}

export function ProjectActions({
                                   project,
                                   onEdit,
                                   onDelete,
                               }: Props) {
    return (
        <>
            <DropdownMenuLabel>
                Actions
            </DropdownMenuLabel>

            <DropdownMenuSeparator/>

            <DropdownMenuItem onClick={onEdit}>
                <Pencil className="mr-2 h-4 w-4"/>
                Edit
            </DropdownMenuItem>

            {project.liveUrl && (
                <DropdownMenuItem asChild>
                    <Link
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <ExternalLink className="mr-2 h-4 w-4"/>
                        Live Demo
                    </Link>
                </DropdownMenuItem>
            )}

            {project.repoUrl && (
                <DropdownMenuItem asChild>
                    <Link
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaGithub className="mr-2 h-4 w-4"/>
                        Repository
                    </Link>
                </DropdownMenuItem>
            )}

            <DropdownMenuSeparator/>

            <DropdownMenuItem
                className="text-destructive"
                onClick={onDelete}
            >
                <Trash2 className="mr-2 h-4 w-4"/>
                Delete
            </DropdownMenuItem>
        </>
    );
}