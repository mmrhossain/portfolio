import type { Experience } from "@/types";
import { CACHE_TAGS } from "@/constants/cache";
import { buildQuery } from "@/lib/api/query";
import {
  serverFetchRaw,
  type PaginatedResult,
} from "@/lib/api/server/server-fetch";

export async function serverListExperience(
  params: {
    page?: number;
    limit?: number;
  } = {},
): Promise<PaginatedResult<Experience>> {
  const payload = await serverFetchRaw<Experience[]>(
    buildQuery("/experience", params),
    {
      tags: [CACHE_TAGS.experience],
    },
  );

  return {
    data: payload?.data ?? [],
    meta: payload?.meta,
  };
}
