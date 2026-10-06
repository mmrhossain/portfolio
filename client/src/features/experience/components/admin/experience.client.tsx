'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/empty-state';

import { experienceApi } from '@/features/experience/api/experience';
import { getErrorMessage } from '@/lib/api/client/client-fetch';
import { toDateInputValue } from '@/lib/utils';

import { ExperienceDialog } from './experience.dialog';
import { ExperienceForm } from './experience.form';
import { ExperienceGrid } from './experience.grid';

import {
  initialExperienceForm,
  type Experience,
  type ExperienceFormValues,
} from '@/types';

interface ExperienceClientProps {
  initialItems: Experience[];
}

function toPayload(form: ExperienceFormValues) {
  return {
    company: form.company,
    role: form.role,
    location: form.location || null,
    startDate: form.startDate,
    endDate: form.endDate || null,
    description: form.description,
    order: form.order,
  };
}

export function ExperienceClient({ initialItems }: ExperienceClientProps) {
  const queryClient = useQueryClient();
  const [items, setItems] = useState<Experience[]>(initialItems);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [form, setForm] = useState<ExperienceFormValues>(initialExperienceForm);

  const invalidate = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['experience'],
    });
  };

  const createMutation = useMutation({
    mutationFn: (payload: ExperienceFormValues) =>
      experienceApi.create(toPayload(payload)),
    onSuccess: async (response) => {
      toast.success('Experience created successfully');
      await invalidate();
      setItems((prev) => [response.data, ...prev]);
      setCreating(false);
      setForm(initialExperienceForm);
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
      payload: ExperienceFormValues;
    }) => experienceApi.update(id, toPayload(payload)),
    onSuccess: async (response) => {
      toast.success('Experience updated successfully');
      await invalidate();
      setItems((prev) =>
        prev.map((item) =>
          item.id === response.data.id ? response.data : item,
        ),
      );
      setEditing(null);
      setForm(initialExperienceForm);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => experienceApi.delete(id),
    onSuccess: async (_response, id) => {
      toast.success('Experience deleted successfully');
      await invalidate();
      setItems((prev) => prev.filter((item) => item.id !== id));
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const openCreate = () => {
    setForm(initialExperienceForm);
    setCreating(true);
  };

  const openEdit = (experience: Experience) => {
    setEditing(experience);
    setForm({
      company: experience.company,
      role: experience.role,
      location: experience.location ?? '',
      startDate: toDateInputValue(experience.startDate),
      endDate: toDateInputValue(experience.endDate),
      description: experience.description,
      order: experience.order,
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
          <h1 className="font-display text-3xl font-bold">Experience</h1>
          <p className="text-muted-foreground">Manage work experience</p>
        </div>
        <Button onClick={openCreate}>Create Experience</Button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="No Experience Found"
          description="Create your first work experience."
          action={
            <Button onClick={openCreate}>Create Experience</Button>
          }
        />
      ) : (
        <ExperienceGrid
          items={items}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      )}

      <ExperienceDialog
        open={creating}
        onOpenChange={setCreating}
        title="Create Experience"
        description="Add a new work experience."
      >
        <ExperienceForm
          values={form}
          onChange={setForm}
          loading={createMutation.isPending}
          submitLabel="Create Experience"
          onSubmit={handleCreate}
        />
      </ExperienceDialog>

      <ExperienceDialog
        open={Boolean(editing)}
        onOpenChange={(open) => {
          if (!open) {
            setEditing(null);
          }
        }}
        title="Edit Experience"
        description="Update work experience."
      >
        <ExperienceForm
          values={form}
          onChange={setForm}
          loading={updateMutation.isPending}
          submitLabel="Save Changes"
          onSubmit={handleUpdate}
        />
      </ExperienceDialog>
    </div>
  );
}
