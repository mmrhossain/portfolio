"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Project, ProjectStatus } from "@/types";

export interface ProjectFormValues {
  title: string;
  description: string;
  longDescription: string;
  image: string;
  repoUrl: string;
  liveUrl: string;
  tags: string[];
  featured: boolean;
  status: ProjectStatus;
  order: number;
}

export function toFormValues(project?: Project): ProjectFormValues {
  return {
    title: project?.title ?? "",
    description: project?.description ?? "",
    longDescription: project?.longDescription ?? "",
    image: project?.image ?? "",
    repoUrl: project?.repoUrl ?? "",
    liveUrl: project?.liveUrl ?? "",
    tags: project?.tags ?? [],
    featured: project?.featured ?? false,
    status: project?.status ?? "PUBLISHED",
    order: project?.order ?? 0,
  };
}

interface ProjectFormProps {
  initial?: Project;
  onSubmit: (values: ProjectFormValues) => void;
  submitLabel: string;
  loading: boolean;
}

export function ProjectForm({
  initial,
  onSubmit,
  submitLabel,
    loading,
}: ProjectFormProps) {
  const [values, setValues] = useState<ProjectFormValues>(() =>
    toFormValues(initial),
  );
  const [tagInput, setTagInput] = useState("");

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !values.tags.includes(tag)) {
      setValues({ ...values, tags: [...values.tags, tag] });
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setValues({ ...values, tags: values.tags.filter((t) => t !== tag) });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label
            htmlFor="title"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Title *
          </Label>
          <Input
            id="title"
            value={values.title}
            onChange={(e) => setValues({ ...values, title: e.target.value })}
            placeholder="Project title"
            required
            disabled={loading}
            className="h-11 rounded-xl bg-background/50 border-border/80 focus-visible:ring-1 focus-visible:ring-primary transition-all"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="image"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Image URL *
          </Label>
          <Input
            id="image"
            value={values.image}
            onChange={(e) => setValues({ ...values, image: e.target.value })}
            placeholder="https://..."
            required
            disabled={loading}
            className="h-11 rounded-xl bg-background/50 border-border/80 focus-visible:ring-1 focus-visible:ring-primary transition-all"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="order"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Order
          </Label>
          <Input
            id="order"
            type="number"
            value={values.order}
            onChange={(e) =>
              setValues({ ...values, order: Number(e.target.value) })
            }
            disabled={loading}
            className="h-11 rounded-xl bg-background/50 border-border/80 focus-visible:ring-1 focus-visible:ring-primary transition-all"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="liveUrl"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Live URL
          </Label>
          <Input
            id="liveUrl"
            value={values.liveUrl}
            onChange={(e) => setValues({ ...values, liveUrl: e.target.value })}
            placeholder="https://..."
            disabled={loading}
            className="h-11 rounded-xl bg-background/50 border-border/80 focus-visible:ring-1 focus-visible:ring-primary transition-all"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="repoUrl"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Repository URL
          </Label>
          <Input
            id="repoUrl"
            value={values.repoUrl}
            onChange={(e) => setValues({ ...values, repoUrl: e.target.value })}
            placeholder="https://..."
            disabled={loading}
            className="h-11 rounded-xl bg-background/50 border-border/80 focus-visible:ring-1 focus-visible:ring-primary transition-all"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label
            htmlFor="description"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Description *
          </Label>
          <Textarea
            id="description"
            value={values.description}
            onChange={(e) =>
              setValues({ ...values, description: e.target.value })
            }
            placeholder="Short project description"
            required
            disabled={loading}
            className="rounded-xl bg-background/50 border-border/80 focus-visible:ring-1 focus-visible:ring-primary transition-all resize-none min-h-[80px]"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label
            htmlFor="longDescription"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Long description
          </Label>
          <Textarea
            id="longDescription"
            className="min-h-[120px] rounded-xl bg-background/50 border-border/80 focus-visible:ring-1 focus-visible:ring-primary transition-all"
            value={values.longDescription}
            onChange={(e) =>
              setValues({ ...values, longDescription: e.target.value })
            }
            placeholder="Optional extended description"
            disabled={loading}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Tags
          </Label>
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="Add a tag and press Enter"
              disabled={loading}
              className="h-11 min-w-0 flex-1 rounded-xl border-border/80 bg-background/50 transition-all focus-visible:ring-1 focus-visible:ring-primary"
            />
            <Button
              type="button"
              variant="outline"
              onClick={addTag}
              className="h-11 w-full shrink-0 rounded-xl px-4 sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          {values.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {values.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="gap-1 px-3 py-1.5 rounded-lg text-xs"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="rounded-full p-0.5 hover:bg-muted transition-colors"
                    aria-label={`Remove ${tag}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Status
          </Label>
          <Select
            value={values.status}
            onValueChange={(value) =>
              setValues({ ...values, status: value as ProjectStatus })
            }
          >
            <SelectTrigger className="h-11 rounded-xl bg-background/50 border-border/80 focus:ring-1 focus:ring-primary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border/80 bg-background/50 p-4">
          <div>
            <p className="text-sm font-medium">Featured</p>
            <p className="text-xs text-muted-foreground">
              Show in featured section
            </p>
          </div>
          <Switch
            checked={values.featured}
            onCheckedChange={(checked) =>
              setValues({ ...values, featured: checked })
            }
            disabled={loading}
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-11 rounded-xl font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200 mt-4"
        disabled={loading}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitLabel}
      </Button>
    </form>
  );
}
