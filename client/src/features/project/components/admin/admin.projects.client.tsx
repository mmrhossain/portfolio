"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { Plus } from "lucide-react";

import { projectsApi } from "@/features/project/api/projects";
import { getErrorMessage } from "@/lib/api/client/client-fetch";
import { isEmptyRichText } from "@/lib/rich-text";

import type { Project } from "@/types";
import type { ProjectFormValues } from "@/features/project/components/admin/project.form";

import { ProjectsTable } from "@/features/project/components/admin/projects.table";
import { CreateDialog } from "@/features/project/components/admin/create.dialog";
import { EditProjectDialog } from "@/features/project/components/admin/edit.dialog";

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

    const toProjectPayload = (payload: ProjectFormValues) => ({
        ...payload,
        longDescription: isEmptyRichText(payload.longDescription)
            ? null
            : payload.longDescription,
    });

    const createMutation = useMutation({
        mutationFn: (payload: ProjectFormValues) =>
            projectsApi.create(toProjectPayload(payload)),

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
        }) => projectsApi.update(id, toProjectPayload(payload)),

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
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="min-w-0">
                    <h1 className="font-display text-3xl font-bold">
                        Projects
                    </h1>

                    <p className="text-muted-foreground">
                        Manage portfolio projects
                    </p>
                </div>

                <Button
                    onClick={() => setCreating(true)}
                >
                    <Plus className="h-4 w-4" />
                    New Project
                </Button>
            </div>

            <div className="min-w-0 rounded-2xl border border-border bg-card">
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