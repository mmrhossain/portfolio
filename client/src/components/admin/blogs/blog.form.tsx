"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Loader2, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Blog, BlogStatus } from "@/types";

export interface BlogFormValues {
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  readTime?: number;
  status: BlogStatus;
}

export function toBlogFormValues(blog?: Blog): BlogFormValues {
  return {
    title: blog?.title ?? "",
    excerpt: blog?.excerpt ?? "",
    content: blog?.content ?? "",
    coverImage: blog?.coverImage ?? "",
    category: blog?.category ?? "",
    tags: blog?.tags ?? [],
    readTime: blog?.readTime,
    status: blog?.status ?? "PUBLISHED",
  };
}

interface BlogFormProps {
  initial?: Blog;
  submitting?: boolean;
  onSubmit: (values: BlogFormValues) => void;
  submitLabel: string;
}

export function BlogForm({
                           initial,
                           submitting = false,
                           onSubmit,
                           submitLabel,
                         }: BlogFormProps) {
  const [values, setValues] = useState<BlogFormValues>(() =>
      toBlogFormValues(initial)
  );

  const [tagInput, setTagInput] = useState("");

  /*
   * Reset form when editing a different blog.
   */
  useEffect(() => {
    setValues(toBlogFormValues(initial));
    setTagInput("");
  }, [initial]);

  const addTag = () => {
    const tag = tagInput.trim();

    if (!tag) return;

    setValues((current) => {
      if (current.tags.includes(tag)) {
        return current;
      }

      return {
        ...current,
        tags: [...current.tags, tag],
      };
    });

    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setValues((current) => ({
      ...current,
      tags: current.tags.filter((currentTag) => currentTag !== tag),
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit(values);
  };

  return (
      <form
          onSubmit={handleSubmit}
          className="space-y-6"
      >
        {/* Title */}
        <div className="space-y-2">
          <Label
              htmlFor="title"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Title *
          </Label>

          <Input
              id="title"
              value={values.title}
              onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
              }
              placeholder="Blog title"
              required
              disabled={submitting}
              className="h-11 rounded-xl border-border/80 bg-background/50 transition-all focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>

        {/* Cover image + Category */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label
                htmlFor="coverImage"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Cover image URL *
            </Label>

            <Input
                id="coverImage"
                value={values.coverImage}
                onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      coverImage: event.target.value,
                    }))
                }
                placeholder="https://..."
                required
                disabled={submitting}
                className="h-11 rounded-xl border-border/80 bg-background/50 transition-all focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label
                htmlFor="category"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Category *
            </Label>

            <Input
                id="category"
                value={values.category}
                onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      category: event.target.value,
                    }))
                }
                placeholder="React.js"
                required
                disabled={submitting}
                className="h-11 rounded-xl border-border/80 bg-background/50 transition-all focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
        </div>

        {/* Excerpt */}
        <div className="space-y-2">
          <Label
              htmlFor="excerpt"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Excerpt *
          </Label>

          <Textarea
              id="excerpt"
              value={values.excerpt}
              onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    excerpt: event.target.value,
                  }))
              }
              placeholder="Short summary shown on cards"
              required
              disabled={submitting}
              className="min-h-[80px] resize-none rounded-xl border-border/80 bg-background/50 transition-all focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <Label
              htmlFor="content"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Content *
          </Label>

          <Textarea
              id="content"
              value={values.content}
              onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    content: event.target.value,
                  }))
              }
              placeholder={
                "Use markdown-style headings:\n## Section title\n\nParagraph text..."
              }
              required
              disabled={submitting}
              className="min-h-[220px] rounded-xl border-border/80 bg-background/50 font-mono text-sm transition-all focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>

        {/* Read time + Status */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label
                htmlFor="readTime"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Read time (minutes)
            </Label>

            <Input
                id="readTime"
                type="number"
                min={1}
                value={values.readTime ?? ""}
                onChange={(event) =>
                    setValues((current) => ({
                      ...current,
                      readTime: event.target.value
                          ? Number(event.target.value)
                          : undefined,
                    }))
                }
                placeholder="Auto-calculated if empty"
                disabled={submitting}
                className="h-11 rounded-xl border-border/80 bg-background/50 transition-all focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Status
            </Label>

            <Select
                value={values.status}
                onValueChange={(value) =>
                    setValues((current) => ({
                      ...current,
                      status: value as BlogStatus,
                    }))
                }
                disabled={submitting}
            >
              <SelectTrigger className="h-11 rounded-xl bg-background/50 focus:ring-1 focus:ring-primary">
                <SelectValue />
              </SelectTrigger>

              <SelectContent className="rounded-xl">
                <SelectItem value="PUBLISHED">
                  Published
                </SelectItem>

                <SelectItem value="DRAFT">
                  Draft
                </SelectItem>

                <SelectItem value="ARCHIVED">
                  Archived
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Tags
          </Label>

          <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
            <Input
                value={tagInput}
                onChange={(event) =>
                    setTagInput(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Add a tag and press Enter"
                disabled={submitting}
                className="h-11 min-w-0 flex-1 rounded-xl border-border/80 bg-background/50 transition-all focus-visible:ring-1 focus-visible:ring-primary"
            />

            <Button
                type="button"
                variant="outline"
                onClick={addTag}
                disabled={submitting}
                className="h-11 w-full shrink-0 rounded-xl px-4 sm:w-auto"
            >
              <Plus className="mr-1 h-4 w-4" />
              Add
            </Button>
          </div>

          {values.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {values.tags.map((tag) => (
                    <Badge
                        key={tag}
                        variant="secondary"
                        className="gap-1 rounded-lg px-3 py-1.5 text-xs"
                    >
                      {tag}

                      <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          disabled={submitting}
                          className="rounded-full p-0.5 transition-colors hover:bg-muted"
                          aria-label={`Remove ${tag}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                ))}
              </div>
          )}
        </div>

        {/* Submit */}
        <Button
            type="submit"
            disabled={submitting}
            className="mt-4 h-11 w-full rounded-xl font-medium shadow-lg shadow-primary/20 transition-all duration-200 hover:shadow-primary/30"
        >
          {submitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}

          {submitLabel}
        </Button>
      </form>
  );
}