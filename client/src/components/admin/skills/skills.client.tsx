'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/empty-state';

import { skillsApi } from '@/lib/api/skills';
import { getErrorMessage } from '@/lib/api/client';

import { SkillDialog } from './skill.dialog';
import { SkillForm } from './skill.form';
import { SkillsGrid } from './skills.grid';



import {initialSkillForm, Skill, SkillFormValues} from '@/types';

interface SkillsClientProps {
    initialSkills: Skill[];
}

export function SkillsClient({
                                 initialSkills,
                             }: SkillsClientProps) {
    const queryClient = useQueryClient();

    const [skills, setSkills] =
        useState<Skill[]>(initialSkills);

    const [creating, setCreating] =
        useState(false);

    const [editing, setEditing] =
        useState<Skill | null>(null);

    const [form, setForm] =
        useState<SkillFormValues>(
            initialSkillForm
        );

    const invalidate = async () => {
        await queryClient.invalidateQueries({
            queryKey: ['skills'],
        });
    };

    const createMutation = useMutation({
        mutationFn: (
            payload: SkillFormValues
        ) => skillsApi.create(payload),

        onSuccess: async () => {
            toast.success(
                'Skill created successfully'
            );

            await invalidate();

            setCreating(false);

            setForm(initialSkillForm);
        },

        onError: (error) => {
            toast.error(
                getErrorMessage(error)
            );
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({
                         id,
                         payload,
                     }: {
            id: string;
            payload: SkillFormValues;
        }) =>
            skillsApi.update(
                id,
                payload
            ),

        onSuccess: async () => {
            toast.success(
                'Skill updated successfully'
            );

            await invalidate();

            setEditing(null);

            setForm(initialSkillForm);
        },

        onError: (error) => {
            toast.error(
                getErrorMessage(error)
            );
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) =>
            skillsApi.delete(id),

        onSuccess: async () => {
            toast.success(
                'Skill deleted successfully'
            );

            await invalidate();
        },

        onError: (error) => {
            toast.error(
                getErrorMessage(error)
            );
        },
    });

    const openCreate = () => {
        setForm(initialSkillForm);

        setCreating(true);
    };

    const openEdit = (
        skill: Skill
    ) => {
        setEditing(skill);

        setForm({
            name: skill.name,
            description:
            skill.description,
            iconUrl: skill.iconUrl,
            category: skill.category,
            proficiency:
            skill.proficiency,
            order: skill.order,
        });
    };

    const handleCreate = () => {
        createMutation.mutate(form);
    };

    const handleUpdate = () => {
        if (!editing) return;

        updateMutation.mutate({
            id: editing.id,
            payload: form,
        });
    };

    const handleDelete = (
        id: string
    ) => {
        deleteMutation.mutate(id);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <h1 className="font-display text-2xl font-bold sm:text-3xl">
                        Skills
                    </h1>

                    <p className="text-muted-foreground">
                        Manage portfolio skills
                    </p>
                </div>

                <Button
                    className="w-full sm:w-auto"
                    onClick={openCreate}
                >
                    Create Skill
                </Button>
            </div>

            {skills.length === 0 ? (
                <EmptyState
                    title="No Skills Found"
                    description="Create your first skill."
                    action={
                        <Button
                            onClick={
                                openCreate
                            }
                        >
                            Create Skill
                        </Button>
                    }
                />
            ) : (
                <SkillsGrid
                    skills={skills}
                    onEdit={openEdit}
                    onDelete={
                        handleDelete
                    }
                />
            )}

            <SkillDialog
                open={creating}
                onOpenChange={
                    setCreating
                }
                title="Create Skill"
                description="Add a new skill."
            >
                <SkillForm
                    values={form}
                    onChange={setForm}
                    loading={
                        createMutation.isPending
                    }
                    submitLabel="Create Skill"
                    onSubmit={
                        handleCreate
                    }
                />
            </SkillDialog>

            <SkillDialog
                open={Boolean(editing)}
                onOpenChange={(
                    open
                ) => {
                    if (!open) {
                        setEditing(null);
                    }
                }}
                title="Edit Skill"
                description="Update skill information."
            >
                <SkillForm
                    values={form}
                    onChange={setForm}
                    loading={
                        updateMutation.isPending
                    }
                    submitLabel="Save Changes"
                    onSubmit={
                        handleUpdate
                    }
                />
            </SkillDialog>
        </div>
    );
}