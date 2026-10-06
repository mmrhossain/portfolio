import type { Project } from "@/types";
import { CACHE_TAGS } from "@/constants/cache";
import { buildQuery } from "@/lib/api/query";
import {
  serverFetchRaw,
  type PaginatedResult,
} from "@/lib/api/server/server-fetch";
import type { ProjectListParams } from "@/features/project/api/projects";

export async function serverListProjects(
  params: ProjectListParams = {},
): Promise<PaginatedResult<Project>> {
  const payload = await serverFetchRaw<Project[]>(
    buildQuery("/projects", params),
    {
      tags: [CACHE_TAGS.projects],
    },
  );

  return {
    data: payload?.data ?? [],
    meta: payload?.meta,
  };
}

export async function serverGetProject(slug: string) {
  return serverFetchRaw<Project>(`/projects/${slug}`, {
    tags: [CACHE_TAGS.projects],
  });
}
