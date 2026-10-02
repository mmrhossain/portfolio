"use client";

import { Loader2 } from "lucide-react";
import type { ExperienceFormValues } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ExperienceFormProps {
  values: ExperienceFormValues;
  onChange: (values: ExperienceFormValues) => void;
  onSubmit: () => void;
  loading: boolean;
  submitLabel: string;
}

export function ExperienceForm({
  values,
  onChange,
  onSubmit,
  loading,
  submitLabel,
}: ExperienceFormProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Company
          </Label>
          <Input
            value={values.company}
            onChange={(e) => onChange({ ...values, company: e.target.value })}
            placeholder="Company name"
            className="h-11 rounded-xl bg-background/50 border-border/80 focus-visible:ring-1 focus-visible:ring-primary transition-all"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Role
          </Label>
          <Input
            value={values.role}
            onChange={(e) => onChange({ ...values, role: e.target.value })}
            placeholder="Job title"
            className="h-11 rounded-xl bg-background/50 border-border/80 focus-visible:ring-1 focus-visible:ring-primary transition-all"
          />
        </div>
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
          onChange={(e) => onChange({ ...values, description: e.target.value })}
          placeholder="What you worked on and achieved"
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
          onChange={(e) => onChange({ ...values, order: Number(e.target.value) })}
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
