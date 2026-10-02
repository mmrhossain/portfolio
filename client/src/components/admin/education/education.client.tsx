'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/empty-state';

import { educationApi } from '@/lib/api/education';
import { getErrorMessage } from '@/lib/api/client';
import { toDateInputValue } from '@/lib/utils';

import { EducationDialog } from './education.dialog';
import { EducationForm } from './education.form';
import { EducationGrid } from './education.grid';

import {
  initialEducationForm,
  type Education,
  type EducationFormValues,
} from '@/types';

interface EducationClientProps {
  initialItems: Education[];
}

function toPayload(form: EducationFormValues) {
  return {
    institution: form.institution,
    degree: form.degree,
    field: form.field || null,
    location: form.location || null,
    startDate: form.startDate,
    endDate: form.endDate || null,
    description: form.description,
    order: form.order,
  };
}

export function EducationClient({ initialItems }: EducationClientProps) {
  const queryClient = useQueryClient();
  const [items, setItems] = useState<Education[]>(initialItems);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Education | null>(null);
  const [form, setForm] = useState<EducationFormValues>(initialEducationForm);

  const invalidate = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['education'],
    });
  };

  const createMutation = useMutation({
    mutationFn: (payload: EducationFormValues) =>
      educationApi.create(toPayload(payload)),
    onSuccess: async (response) => {
      toast.success('Education created successfully');
      await invalidate();
      setItems((prev) => [response.data, ...prev]);
      setCreating(false);
      setForm(initialEducationForm);
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
      payload: EducationFormValues;
    }) => educationApi.update(id, toPayload(payload)),
    onSuccess: async (response) => {
      toast.success('Education updated successfully');
      await invalidate();
      setItems((prev) =>
        prev.map((item) =>
          item.id === response.data.id ? response.data : item,
        ),
      );
      setEditing(null);
      setForm(initialEducationForm);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => educationApi.delete(id),
    onSuccess: async (_response, id) => {
      toast.success('Education deleted successfully');
      await invalidate();
      setItems((prev) => prev.filter((item) => item.id !== id));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const openCreate = () => {
    setForm(initialEducationForm);
    setCreating(true);
  };

  const openEdit = (education: Education) => {
    setEditing(education);
    setForm({
      institution: education.institution,
      degree: education.degree,
      field: education.field ?? '',
      location: education.location ?? '',
      startDate: toDateInputValue(education.startDate),
      endDate: toDateInputValue(education.endDate),
      description: education.description,
      order: education.order,
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

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Education</h1>
          <p className="text-muted-foreground">Manage education history</p>
        </div>
        <Button onClick={openCreate}>Create Education</Button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="No Education Found"
          description="Create your first education entry."
          action={<Button onClick={openCreate}>Create Education</Button>}
        />
      ) : (
        <EducationGrid
          items={items}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      )}

      <EducationDialog
        open={creating}
        onOpenChange={setCreating}
        title="Create Education"
        description="Add a new education entry."
      >
        <EducationForm
          values={form}
          onChange={setForm}
          loading={createMutation.isPending}
          submitLabel="Create Education"
          onSubmit={handleCreate}
        />
      </EducationDialog>

      <EducationDialog
        open={Boolean(editing)}
        onOpenChange={(open) => {
          if (!open) {
            setEditing(null);
          }
        }}
        title="Edit Education"
        description="Update education information."
      >
        <EducationForm
          values={form}
          onChange={setForm}
          loading={updateMutation.isPending}
          submitLabel="Save Changes"
          onSubmit={handleUpdate}
        />
      </EducationDialog>
    </div>
  );
}
