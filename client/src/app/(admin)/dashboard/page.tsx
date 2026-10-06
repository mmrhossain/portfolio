import { AnalyticsClient } from "@/features/analytics/components/analytics.client";
import { getDashboardSummary } from "@/features/dashboard/api/server";

export default async function AdminPage() {
  const response = await getDashboardSummary();

  return <AnalyticsClient summary={response?.data} />;
}
