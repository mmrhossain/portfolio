import { Users, FolderKanban, FileText, Inbox } from "lucide-react";

import { StatCard } from "@/components/admin/analytics/stat-card";

interface Props {
  summary: any;
}

export function StatsGrid({ summary }: Props) {
  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total users"
        value={summary?.counts?.users}
        icon={Users}
        hint={`+${summary?.counts?.newUsersToday} today`}
      />

      <StatCard
        label="Projects"
        value={summary?.counts?.projects}
        icon={FolderKanban}
        accent="accent"
      />

      <StatCard
        label="Blog posts"
        value={summary?.counts?.blogs}
        icon={FileText}
        accent="success"
      />

      <StatCard
        label="Unread messages"
        value={summary?.counts?.unreadMessages}
        icon={Inbox}
        accent="destructive"
      />
    </div>
  );
}
