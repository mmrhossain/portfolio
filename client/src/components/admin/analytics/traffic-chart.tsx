"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { analyticsApi } from "@/lib/api/index";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "@/lib/utils";

export function TrafficChart({ days = 30 }: { days?: number }) {
  const { data, isLoading } = useQuery({
    queryKey: ["analytics", "overview", days],
    queryFn: () => analyticsApi.overview(days),
  });

  const timeline = data?.data?.timeline ?? [];
  const max = Math.max(1, ...timeline.map((t) => t.total));

  return (
    <Card className="rounded-2xl border-border/80 bg-card/50 backdrop-blur-sm shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-base font-semibold">Page views</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Last {days} days
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <Skeleton className="h-52 w-full rounded-xl" />
        ) : timeline.length === 0 ? (
          <div className="flex h-52 items-center justify-center text-sm text-muted-foreground">
            No traffic data yet.
          </div>
        ) : (
          <div className="flex h-52 items-end gap-[2px] overflow-x-clip pt-6 pb-2 sm:gap-1.5">
            {timeline.map((point, index) => {
              const heightPercent = Math.max(8, (point.total / max) * 100);

              return (
                <div
                  key={point.date}
                  className="group relative flex-1 flex flex-col items-center h-full justify-end"
                >
                  <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1 text-[10px] font-medium text-background opacity-0 shadow-lg transition-all duration-200 group-hover:opacity-100 group-hover:-translate-y-1 z-20">
                    {point.total} views ({formatDate(point.date)})
                  </span>

                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-teal-400 to-lime-500 transition-all duration-300 group-hover:opacity-80 group-hover:shadow-lg cursor-pointer"
                    style={{
                      animation: `growUp 1.5s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.03}s both`,
                      ["--target-height" as string]: `${heightPercent}%`,
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
