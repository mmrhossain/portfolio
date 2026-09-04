import type { MetadataRoute } from "next";
import { serverListBlogs, serverListProjects } from "@/app/actions";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://dev-monir.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projectsResult, blogsResult] = await Promise.all([
    serverListProjects({ limit: 100 }),
    serverListBlogs({ limit: 100 }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blogs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const projectRoutes: MetadataRoute.Sitemap = (projectsResult.data ?? []).map(
    (project) => ({
      url: `${SITE_URL}/projects/${project.slug}`,
      lastModified: project.updatedAt
        ? new Date(project.updatedAt)
        : new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }),
  );

  const blogRoutes: MetadataRoute.Sitemap = (blogsResult.data ?? []).map(
    (blog) => ({
      url: `${SITE_URL}/blogs/${blog.slug}`,
      lastModified: blog.updatedAt
        ? new Date(blog.updatedAt)
        : blog.publishedAt
          ? new Date(blog.publishedAt)
          : new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    }),
  );

  return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}
