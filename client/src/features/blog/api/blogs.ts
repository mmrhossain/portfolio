import { api } from "@/lib/api/client/client-fetch";
import type { Blog } from "@/types";
import { buildQuery } from "@/lib/api/query";
import type { RichTextValue } from "@/lib/rich-text";

export interface BlogPayload {
  title: string;
  excerpt: string;
  content: RichTextValue;
  coverImage: string;
  category: string;
  tags: string[];
  readTime?: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

export interface BlogListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
}

export const blogsApi = {
  listPublic: (params: BlogListParams = {}) =>
    api.get<Blog[]>(buildQuery("/blogs", params)),
  listAdmin: (params: BlogListParams = {}) =>
    api.get<Blog[]>(buildQuery("/blogs/admin", params)),
  getPublic: (slug: string) => api.get<Blog>(`/blogs/slug/${slug}`),
  getAdmin: (id: string) => api.get<Blog>(`/blogs/admin/${id}`),
  create: (payload: BlogPayload) => api.post<Blog>("/blogs", payload),
  update: (id: string, payload: Partial<BlogPayload>) =>
    api.patch<Blog>(`/blogs/${id}`, payload),
  delete: (id: string) => api.delete<null>(`/blogs/${id}`),
  stats: () =>
    api.get<{
      total: number;
      published: number;
      drafts: number;
      categories: Array<{ name: string; count: number }>;
    }>("/blogs/admin/stats"),
};
