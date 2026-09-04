"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    ProjectForm,
    type ProjectFormValues,
} from "@/components/admin/projects/project.form";

import type {Project} from "@/types";

interface Props {
    project: Project | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: ProjectFormValues) => void;
    loading: boolean;
}

export function EditProjectDialog({
                                      project,
                                      open,
                                      onOpenChange,
                                      onSubmit,
                                      loading
                                  }: Props) {
    if (!project) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="max-h-[90vh] min-w-0 max-w-2xl overflow-y-auto rounded-2xl border-border/80 bg-card/95 p-4 shadow-2xl backdrop-blur-md sm:p-6">
                <DialogHeader className="space-y-1.5 pb-2">
                    <DialogTitle className="text-lg font-semibold tracking-tight">
                        Edit Project
                    </DialogTitle>

                    <DialogDescription className="text-xs text-muted-foreground">
                        Update project details.
                    </DialogDescription>
                </DialogHeader>

                <ProjectForm
                    initial={project}
                    submitLabel="Save Changes"
                    onSubmit={onSubmit}
                    loading={loading}
                />
            </DialogContent>
        </Dialog>
    );
}
