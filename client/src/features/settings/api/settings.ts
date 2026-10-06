import { api } from "@/lib/api/client/client-fetch";

export const settingsApi = {
  get: (keys?: string) =>
    api.get<Record<string, unknown>>(
      keys ? `/settings?keys=${keys}` : "/settings",
    ),
  upsert: (key: string, value: unknown) =>
    api.put<null>("/settings", { key, value }),
  remove: (key: string) => api.delete<null>(`/settings/${key}`),
};
