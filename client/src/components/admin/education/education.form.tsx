"use client";

import { Loader2 } from "lucide-react";
import type { EducationFormValues } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface EducationFormProps {
  values: EducationFormValues;
  onChange: (values: EducationFormValues) => void;
  onSubmit: () => void;
  loading: boolean;
  submitLabel: string;
}

export function EducationForm({
  values,
  onChange,
  onSubmit,
  loading,
  submitLabel,
}: EducationFormProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Institution
          </Label>
          <Input
            value={values.institution}
            onChange={(e) =>
              onChange({ ...values, institution: e.target.value })
            }
            placeholder="School or university"
            className="h-11 rounded-xl bg-background/50 border-border/80 focus-visible:ring-1 focus-visible:ring-primary transition-all"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Degree
          </Label>
          <Input
            value={values.degree}
            onChange={(e) => onChange({ ...values, degree: e.target.value })}
            placeholder="Bachelor, Diploma, ..."
            className="h-11 rounded-xl bg-background/50 border-border/80 focus-visible:ring-1 focus-visible:ring-primary transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Field
          </Label>
          <Input
            value={values.field}
            onChange={(e) => onChange({ ...values, field: e.target.value })}
            placeholder="Computer Science (optional)"
            className="h-11 rounded-xl bg-background/50 border-border/80 focus-visible:ring-1 focus-visible:ring-primary transition-all"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Location
          </Label>
          <Input
            value={values.location}
            onChange={(e) => onChange({ ...values, location: e.target.value })}
            placeholder="City, Country (optional)"
            className="h-11 rounded-xl bg-background/50 border-border/80 focus-visible:ring-1 focus-visible:ring-primary transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Start Date
          </Label>
          <Input
            type="date"
            value={values.startDate}
            onChange={(e) => onChange({ ...values, startDate: e.target.value })}
            className="h-11 rounded-xl bg-background/50 border-border/80 focus-visible:ring-1 focus-visible:ring-primary transition-all"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            End Date
          </Label>
          <Input
            type="date"
            value={values.endDate}
            onChange={(e) => onChange({ ...values, endDate: e.target.value })}
            className="h-11 rounded-xl bg-background/50 border-border/80 focus-visible:ring-1 focus-visible:ring-primary transition-all"
          />
          <p className="text-xs text-muted-foreground">Leave empty if current.</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Description
        </Label>
        <Textarea
          value={values.description}
          onChange={(e) =>
            onChange({ ...values, description: e.target.value })
          }
          placeholder="What you studied and notable work"
          className="min-h-[80px] resize-none rounded-xl bg-background/50 border-border/80 focus-visible:ring-1 focus-visible:ring-primary transition-all"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Order
        </Label>
        <Input
          type="number"
          value={values.order}
          onChange={(e) =>
            onChange({ ...values, order: Number(e.target.value) })
          }
          className="h-11 rounded-xl bg-background/50 border-border/80 focus-visible:ring-1 focus-visible:ring-primary transition-all"
        />
      </div>

      <Button
        className="mt-4 h-11 w-full rounded-xl font-medium shadow-lg shadow-primary/20 transition-all duration-200 hover:shadow-primary/30"
        onClick={onSubmit}
        disabled={loading}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitLabel}
      </Button>
    </div>
  );
}
