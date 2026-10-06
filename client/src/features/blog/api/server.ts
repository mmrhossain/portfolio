import type { Blog } from "@/types";
import { CACHE_TAGS } from "@/constants/cache";
import { buildQuery } from "@/lib/api/query";
import {
  serverFetchRaw,
  type PaginatedResult,
} from "@/lib/api/server/server-fetch";
import type { BlogListParams } from "@/features/blog/api/blogs";

export async function serverListBlogs(
  params: BlogListParams = {},
): Promise<PaginatedResult<Blog>> {
  const payload = await serverFetchRaw<Blog[]>(buildQuery("/blogs", params), {
    tags: [CACHE_TAGS.blogs],
  });

  return {
    data: payload?.data ?? [],
    meta: payload?.meta,
  };
}

export async function serverGetBlog(slug: string) {
  return serverFetchRaw<Blog>(`/blogs/${slug}`, {
    tags: [CACHE_TAGS.blogs],
  });
}
