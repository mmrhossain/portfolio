import { api } from "@/lib/api/client/client-fetch";
import type { AnalyticsOverview } from "@/types";

export const analyticsApi = {
  overview: (days = 30) =>
    api.get<AnalyticsOverview>(`/analytics/overview?days=${days}`),
  track: (payload: { eventType: string; path?: string; referrer?: string }) =>
    api.post<null>("/analytics/track", payload),
};
