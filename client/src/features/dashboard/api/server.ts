import type { ApiResponse, DashboardSummary } from "@/types";
import { serverFetch } from "@/lib/api/server/server-fetch";

export async function getDashboardSummary() {
  const response: ApiResponse<DashboardSummary> = await serverFetch(
    "/dashboard/summary",
  );
  return response;
}
