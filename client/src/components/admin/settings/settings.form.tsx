"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Plus, Trash2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { getErrorMessage } from "@/lib/api/client";
import { settingsApi } from "@/lib/api";

export interface StepItem {
  title: string;
  description: string;
}

export interface SettingsFormValues {
  siteTitle: string;
  siteDescription: string;
  heroTitle: string;
  heroDescription: string;
  githubUrl: string;
  linkedinUrl: string;
  facebookUrl: string;
  email: string;
  phone: string;
  steps: StepItem[];
}

interface SettingsFormProps {
  initialData?: SettingsFormValues;
}

export function SettingsForm({ initialData }: SettingsFormProps) {
  const [steps, setSteps] = useState<StepItem[]>(initialData?.steps || []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    defaultValues: {
      siteTitle: initialData?.siteTitle || "",
      siteDescription: initialData?.siteDescription || "",
      heroTitle: initialData?.heroTitle || "",
      heroDescription: initialData?.heroDescription || "",
      githubUrl: initialData?.githubUrl || "",
      linkedinUrl: initialData?.linkedinUrl || "",
      facebookUrl: initialData?.facebookUrl || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
    },
  });

  const saveSettings = async (values: SettingsFormValues) => {
    const payload = {
      ...values,
      steps,
    };

    await Promise.all(
      Object.entries(payload).map(([key, value]) =>
        settingsApi.upsert(key, value),
      ),
    );
  };

  const updateMutation = useMutation({
    mutationFn: saveSettings,

    onSuccess: () => {
      toast.success("Settings updated");
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const onSubmit = (data: SettingsFormValues) => {
    updateMutation.mutate(data);
  };

  const addStep = () => {
    setSteps([
      ...steps,
      {
        title: "",
        description: "",
      },
    ]);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, field: keyof StepItem, value: string) => {
    const updated = [...steps];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setSteps(updated);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="rounded-2xl border-border/80 bg-card/50 backdrop-blur-sm shadow-sm">
        <CardContent className="space-y-5 pt-6">
          <h3 className="text-base font-semibold">
            General & Hero Information
          </h3>

          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Site Title
            </Label>
            <Input
              placeholder="Site Title"
              className="h-11 rounded-xl bg-background/50 border-border/85 focus-visible:ring-1 focus-visible:ring-primary transition-all"
              {...register("siteTitle")}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Site Description
            </Label>
            <Textarea
              placeholder="Site Description"
              className="rounded-xl bg-background/50 border-border/85 focus-visible:ring-1 focus-visible:ring-primary transition-all resize-none min-h-[90px]"
              {...register("siteDescription")}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Hero Title
            </Label>
            <Input
              placeholder="Hero Title"
              className="h-11 rounded-xl bg-background/50 border-border/85 focus-visible:ring-1 focus-visible:ring-primary transition-all"
              {...register("heroTitle")}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Hero Description
            </Label>
            <Textarea
              placeholder="Hero Description"
              className="rounded-xl bg-background/50 border-border/85 focus-visible:ring-1 focus-visible:ring-primary transition-all resize-none min-h-[90px]"
              {...register("heroDescription")}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/80 bg-card/50 backdrop-blur-sm shadow-sm">
        <CardContent className="space-y-5 pt-6">
          <h3 className="text-base font-semibold">Social Links & Contact</h3>

          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              GitHub URL
            </Label>
            <Input
              placeholder="GitHub URL"
              className="h-11 rounded-xl bg-background/50 border-border/85 focus-visible:ring-1 focus-visible:ring-primary transition-all"
              {...register("githubUrl")}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              LinkedIn URL
            </Label>
            <Input
              placeholder="LinkedIn URL"
              className="h-11 rounded-xl bg-background/50 border-border/85 focus-visible:ring-1 focus-visible:ring-primary transition-all"
              {...register("linkedinUrl")}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Facebook URL
            </Label>
            <Input
              placeholder="Facebook URL"
              className="h-11 rounded-xl bg-background/50 border-border/85 focus-visible:ring-1 focus-visible:ring-primary transition-all"
              {...register("facebookUrl")}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Email
            </Label>
            <Input
              placeholder="Email"
              className="h-11 rounded-xl bg-background/50 border-border/85 focus-visible:ring-1 focus-visible:ring-primary transition-all"
              {...register("email")}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Phone
            </Label>
            <Input
              placeholder="Phone"
              className="h-11 rounded-xl bg-background/50 border-border/85 focus-visible:ring-1 focus-visible:ring-primary transition-all"
              {...register("phone")}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="min-w-0 rounded-2xl border-border/80 bg-card/50 shadow-sm backdrop-blur-sm">
        <CardContent className="space-y-5 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="min-w-0 text-base font-semibold">Process Steps</h3>

            <Button
              type="button"
              variant="outline"
              className="h-10 shrink-0 rounded-xl border-border/85 bg-background/50 hover:bg-background/80"
              onClick={addStep}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Step
            </Button>
          </div>

          {steps.map((step, index) => (
            <div
              key={index}
              className="relative min-w-0 space-y-3 rounded-xl border border-border/85 bg-background/30 p-4 backdrop-blur-xs"
            >
              <div className="space-y-1.5">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Step Title
                </Label>
                <Input
                  value={step.title}
                  placeholder="Step Title"
                  className="h-10 rounded-lg bg-background/50 border-border/85 focus-visible:ring-1 focus-visible:ring-primary transition-all"
                  onChange={(e) => updateStep(index, "title", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Description
                </Label>
                <Textarea
                  value={step.description}
                  placeholder="Description"
                  className="rounded-lg bg-background/50 border-border/85 focus-visible:ring-1 focus-visible:ring-primary transition-all resize-none min-h-[70px]"
                  onChange={(e) =>
                    updateStep(index, "description", e.target.value)
                  }
                />
              </div>

              <div className="flex justify-end pt-1">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="h-9 rounded-lg px-3 shadow-none"
                  onClick={() => removeStep(index)}
                >
                  <Trash2 className="h-4 w-4 mr-1.5" />
                  Remove Step
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Button
        type="submit"
        className="w-full h-11 rounded-xl font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-200 mt-4"
        disabled={updateMutation.isPending}
      >
        {updateMutation.isPending && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        Save Settings
      </Button>
    </form>
  );
}
