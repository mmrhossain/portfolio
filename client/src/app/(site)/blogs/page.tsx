import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { BlogCard } from '@/components/blogs/blog-card';
import { EmptyState } from '@/components/shared/empty-state';
import { PaginationLinks } from '@/components/shared/pagination-links';
import { BlogsFilters } from '@/components/blogs/blogs-filters';
import {serverListBlogs} from "@/app/actions";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Articles and tutorials on full-stack development, Next.js, React, TypeScript, and modern web tooling.',
  alternates: {
    canonical: '/blogs',
  },
  openGraph: {
    title: 'Blog',
    description:
      'Articles and tutorials on full-stack development, Next.js, React, TypeScript, and modern web tooling.',
    images: [{ url: '/images/seo-image.PNG' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog',
    description:
      'Articles and tutorials on full-stack development, Next.js, React, TypeScript, and modern web tooling.',
    images: ['/images/seo-image.PNG'],
  },
};

interface BlogsPageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const search = params.search?.trim() ?? '';

  const { data: blogs, meta } = await serverListBlogs({
    page,
    limit: 12,
    search: search || undefined,
  });

  const paginationQuery = { search: search || undefined };

  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="All Recent Blogs"
        description="Insights, tutorials, and deep dives on full-stack development, React, and modern web tooling."
      />

      <section className="pb-24">
        <div className="container-page">
          <Suspense fallback={null}>
            <BlogsFilters initialSearch={search} />
          </Suspense>

          {blogs.length === 0 ? (
            <EmptyState title="No blogs found" description="Try a different search term." />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          )}

          {meta && (
            <PaginationLinks
              meta={meta}
              basePath="/blogs"
              searchParams={paginationQuery}
              className="mt-12"
            />
          )}
        </div>
      </section>
    </>
  );
}
