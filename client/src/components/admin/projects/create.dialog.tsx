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

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ProjectFormValues) => void;
  loading: boolean;
}

export function CreateDialog({
  open,
  onOpenChange,
  onSubmit,
    loading
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] min-w-0 max-w-4xl flex-col overflow-hidden rounded-3xl p-0">
        <DialogHeader className="border-b border-border/50 bg-card/50 px-4 py-3 pr-12 sm:px-6 sm:py-4">
          <DialogTitle className="font-display text-xl font-bold">
            Create Project
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Add a new portfolio project to your collection.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
          <ProjectForm
            submitLabel="Create Project"
            onSubmit={onSubmit}
            loading={loading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
