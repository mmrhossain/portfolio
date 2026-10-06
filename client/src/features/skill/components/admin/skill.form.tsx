"use client";

import { Loader2 } from "lucide-react";
import type { SkillCategory, SkillFormValues } from "@/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories: SkillCategory[] = [
  "FRONTEND",
  "BACKEND",
  "DATABASE",
  "DEVOPS",
  "TOOLS",
  "OTHER",
    "LANGUAGE"
];

interface SkillFormProps {
  values: SkillFormValues;
  onChange: (values: SkillFormValues) => void;
  onSubmit: () => void;
  loading: boolean;
  submitLabel: string;
}

export function SkillForm({
  values,
  onChange,
  onSubmit,
  loading,
  submitLabel,
}: SkillFormProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Name
        </Label>

        <Input
          value={values.name}
          onChange={(e) =>
            onChange({
              ...values,
              name: e.target.value,
            })
          }
          placeholder="Skill name"
          className="h-11 rounded-xl bg-background/50 border-border/80 focus-visible:ring-1 focus-visible:ring-primary transition-all"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Icon URL
        </Label>

        <Input
          value={values.iconUrl}
          onChange={(e) =>
            onChange({
              ...values,
              iconUrl: e.target.value,
            })
          }
          placeholder="https://..."
          className="h-11 rounded-xl bg-background/50 border-border/80 focus-visible:ring-1 focus-visible:ring-primary transition-all"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Description
        </Label>

        <Textarea
          value={values.description}
          onChange={(e) =>
            onChange({
              ...values,
              description: e.target.value,
            })
          }
          placeholder="Short description of the skill"
          className="rounded-xl bg-background/50 border-border/80 focus-visible:ring-1 focus-visible:ring-primary transition-all resize-none min-h-[80px]"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Category
          </Label>

          <Select
            value={values.category}
            onValueChange={(value) =>
              onChange({
                ...values,
                category: value as SkillCategory,
              })
            }
          >
            <SelectTrigger className="h-11 rounded-xl bg-background/50 border-border/80 focus:ring-1 focus:ring-primary">
              <SelectValue />
            </SelectTrigger>

            <SelectContent className="rounded-xl">
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Proficiency
          </Label>

          <Input
            type="number"
            min={0}
            max={100}
            value={values.proficiency}
            onChange={(e) =>
              onChange({
                ...values,
                proficiency: Number(e.target.value),
              })
            }
            className="h-11 rounded-xl bg-background/50 border-border/80 focus-visible:ring-1 focus-visible:ring-primary transition-all"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Order
        </Label>

        <Input
          type="number"
          value={values.order}
          onChange={(e) =>
            onChange({
              ...values,
              order: Number(e.target.value),
            })
          }
          className="h-11 rounded-xl bg-background/50 border-border/80 focus-visible:ring-1 focus-visible:ring-primary transition-all"
        />
      </div>

      <Button
        className="w-full h-11 rounded-xl font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200 mt-4"
        onClick={onSubmit}
        disabled={loading}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

        {submitLabel}
      </Button>
    </div>
  );
}
