import type { Skill } from "@/types";
import { CACHE_TAGS } from "@/constants/cache";
import { buildQuery } from "@/lib/api/query";
import {
  serverFetchRaw,
  type PaginatedResult,
} from "@/lib/api/server/server-fetch";

export async function serverListSkills(
  params: {
    page?: number;
    limit?: number;
  } = {},
): Promise<PaginatedResult<Skill>> {
  const payload = await serverFetchRaw<Skill[]>(buildQuery("/skills", params), {
    tags: [CACHE_TAGS.skills],
  });

  return {
    data: payload?.data ?? [],
    meta: payload?.meta,
  };
}
