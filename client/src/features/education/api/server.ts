import type { Education } from "@/types";
import { CACHE_TAGS } from "@/constants/cache";
import { buildQuery } from "@/lib/api/query";
import {
  serverFetchRaw,
  type PaginatedResult,
} from "@/lib/api/server/server-fetch";

export async function serverListEducation(
  params: {
    page?: number;
    limit?: number;
  } = {},
): Promise<PaginatedResult<Education>> {
  const payload = await serverFetchRaw<Education[]>(
    buildQuery("/education", params),
    {
      tags: [CACHE_TAGS.education],
    },
  );

  return {
    data: payload?.data ?? [],
    meta: payload?.meta,
  };
}
