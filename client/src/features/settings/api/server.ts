import { CACHE_TAGS, REVALIDATE_SETTINGS } from "@/constants/cache";
import { buildQuery } from "@/lib/api/query";
import { serverFetchRaw } from "@/lib/api/server/server-fetch";

export async function serverGetSettings(keys?: string) {
  const path = keys ? buildQuery("/settings", { keys }) : "/settings";

  return serverFetchRaw<Record<string, unknown>>(path, {
    revalidate: REVALIDATE_SETTINGS,
    tags: [CACHE_TAGS.settings],
  });
}
