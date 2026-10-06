import { StatsGrid } from "./stats.grid";
import { RecentMessages } from "./recent.messages";
import { RecentBlogs } from "./recent.blogs";
import { TrafficChart } from "./traffic-chart";
import { Welcome } from "./Welcome";
import {Suspense} from "react";

interface Props {
  summary: any;
}

export function AnalyticsClient({ summary }: Props) {
  return (
    <div className="min-w-0 space-y-8">
      <Welcome />
      <StatsGrid summary={summary} />

      <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <TrafficChart />
        </div>

        <Suspense fallback={"loading..."}>
            <RecentMessages messages={summary?.recentMessages} />
        </Suspense>
      </div>

      <Suspense fallback={"loading..."}>
          <RecentBlogs blogs={summary?.recentBlogs} />
      </Suspense>
    </div>
  );
}
