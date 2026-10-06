import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  hint?: string;
  accent?: "default" | "accent" | "destructive" | "success";
}

const accentClasses: Record<string, string> = {
  default: "bg-muted text-foreground",
  accent: "bg-accent/20 text-accent",
  destructive: "bg-destructive/10 text-destructive",
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  accent = "default",
}: StatCardProps) {
  return (
    <Card className="min-w-0">
      <CardContent className="flex min-w-0 items-center justify-between gap-3 p-4 sm:p-6">
        <div className="min-w-0 space-y-1">
          <p className="truncate text-sm font-medium text-muted-foreground">{label}</p>
          <p className="font-display truncate text-2xl font-bold sm:text-3xl">{value}</p>
          {hint && <p className="truncate text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
            accentClasses[accent],
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </CardContent>
    </Card>
  );
}
