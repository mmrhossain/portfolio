import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { ProjectCard } from '@/components/projects/project.card';
import { EmptyState } from '@/components/shared/empty-state';
import { PaginationLinks } from '@/components/shared/pagination-links';
import { ProjectsFilters } from '@/components/projects/projects.filters';
import {serverListProjects} from "@/app/actions";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Explore featured full-stack projects built with Next.js, React, Node.js, and modern web technologies.',
  alternates: {
    canonical: '/projects',
  },
  openGraph: {
    title: 'Projects',
    description:
      'Explore featured full-stack projects built with Next.js, React, Node.js, and modern web technologies.',
    images: [{ url: '/images/seo-image.PNG' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects',
    description:
      'Explore featured full-stack projects built with Next.js, React, Node.js, and modern web technologies.',
    images: ['/images/seo-image.PNG'],
  },
};

interface ProjectsPageProps {
  searchParams: Promise<{ page?: string; search?: string; featured?: string }>;
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const search = params.search?.trim() ?? '';
  const featured = params.featured === 'true';

  const { data: projects, meta } = await serverListProjects({
    page,
    limit: 12,
    search: search || undefined,
    featured: featured ? 'true' : undefined,
  });

  const paginationQuery = {
    search: search || undefined,
    featured: featured ? 'true' : undefined,
  };

  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title="Featured Projects"
        description="A selection of products and experiences I've designed and built across the stack."
      />

      <section className="pb-24">
        <div className="container-page">
          <Suspense fallback={null}>
            <ProjectsFilters initialSearch={search} initialFilter={featured ? 'featured' : 'all'} />
          </Suspense>

          {projects.length === 0 ? (
            <EmptyState
              title="No projects found"
              description="Try adjusting your search or filter."
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}

          {meta && (
            <PaginationLinks
              meta={meta}
              basePath="/projects"
              searchParams={paginationQuery}
              className="mt-12"
            />
          )}
        </div>
      </section>
    </>
  );
}
