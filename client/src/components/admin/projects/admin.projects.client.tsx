"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { Plus } from "lucide-react";

import { projectsApi } from "@/lib/api/projects";
import { getErrorMessage } from "@/lib/api/client";

import type { Project } from "@/types";
import type { ProjectFormValues } from "@/components/admin/projects/project.form";

import { ProjectsTable } from "@/components/admin/projects/projects.table";
import { CreateDialog } from "@/components/admin/projects/create.dialog";
import { EditProjectDialog } from "@/components/admin/projects/edit.dialog";

import { TableRowsSkeleton } from "@/components/shared/skeletons";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";

import { Button } from "@/components/ui/button";

interface Props {
    initialData?: any;
    page?: number;
    search?: string;
}

export function AdminProjectsClient({
                                        initialData,
                                    }: Props) {
    const queryClient = useQueryClient();
    const [creating, setCreating] = useState(false);
    const [editing, setEditing] =
        useState<Project | null>(null);

    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["projects", "admin"],
        queryFn: () => projectsApi.listAdmin(),
        initialData,
    });

    const projects = data?.data ?? [];
    const meta = data?.meta;

    const invalidate = async () => {
        await queryClient.invalidateQueries({
            queryKey: ["projects"],
        });
    };

    const createMutation = useMutation({
        mutationFn: (payload: ProjectFormValues) =>
            projectsApi.create(payload),

        onSuccess: () => {
            toast.success("Project created");
            invalidate();
            setCreating(false);
        },

        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({
                         id,
                         payload,
                     }: {
            id: string;
            payload: ProjectFormValues;
        }) => projectsApi.update(id, payload),

        onSuccess: () => {
            toast.success("Project updated");
            invalidate();
            setEditing(null);
        },

        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => projectsApi.delete(id),
        onSuccess: () => {
            toast.success("Project deleted");
            invalidate();
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                    <div className="min-w-0">
                        <h1 className="font-display text-2xl font-bold sm:text-3xl">
                            Projects
                        </h1>

                        <p className="text-muted-foreground">
                            Manage portfolio projects
                        </p>
                    </div>

                    <Button
                        className="w-full sm:w-auto"
                        onClick={() => setCreating(true)}
                    >
                        <Plus className="h-4 w-4" />
                        New Project
                    </Button>
            </div>

            <div className="rounded-2xl border border-border bg-card">
                {isLoading ? (
                    <TableRowsSkeleton rows={8} />
                ) : isError ? (
                    <div className="p-6">
                        <ErrorState
                            onRetry={() => refetch()}
                        />
                    </div>
                ) : projects.length === 0 ? (
                    <div className="p-6">
                        <EmptyState
                            title="No projects found"
                            description="Create your first project to get started."
                        />
                    </div>
                ) : (
                    <ProjectsTable
                        data={data}
                        onCreate={() => setCreating(true)}
                        onEdit={(project) => setEditing(project)}
                        onDelete={(id) => deleteMutation.mutate(id)}
                        loading = {deleteMutation.isPending}
                    />
                )}
            </div>

            <CreateDialog
                open={creating}
                onOpenChange={setCreating}
                onSubmit={(values) =>
                    createMutation.mutate(values)
                }
                loading={createMutation.isPending}
            />

            {editing && (
                <EditProjectDialog
                    project={editing}
                    open={!!editing}
                    onOpenChange={(open) => {
                        if (!open) {
                            setEditing(null);
                        }
                    }}
                    onSubmit={(values) =>
                        updateMutation.mutate({
                            id: editing.id,
                            payload: values,
                        })
                    }
                    loading={updateMutation.isPending}
                />
            )}
        </div>
    );
}