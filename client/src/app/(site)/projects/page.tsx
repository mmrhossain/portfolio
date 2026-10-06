import { Suspense } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { ProjectCard } from "@/features/project/components/public/project.card";
import { EmptyState } from "@/components/shared/empty-state";
import { PaginationLinks } from "@/components/shared/pagination-links";
import { ProjectsFilters } from "@/features/project/components/public/projects.filters";
import { serverListProjects } from "@/features/project/api/server";
import { createPageMetadata } from "@/lib/seo";

export const revalidate = 3600;

const PROJECTS_DESCRIPTION =
  "Browse full stack projects by Monir Hossain, including web applications and e-commerce work built with Next.js, React, Node.js, and PostgreSQL.";

interface ProjectsPageProps {
  searchParams: Promise<{ page?: string; search?: string; featured?: string }>;
}

export async function generateMetadata({
  searchParams,
}: ProjectsPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const hasFilters = Boolean(params.search?.trim() || params.featured === "true" || page > 1);

  return createPageMetadata({
    title: page > 1 ? `Projects (Page ${page})` : "Projects",
    description: PROJECTS_DESCRIPTION,
    path: "/projects",
    index: !hasFilters,
    follow: true,
  });
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const search = params.search?.trim() ?? "";
  const featured = params.featured === "true";

  const { data: projects, meta } = await serverListProjects({
    page,
    limit: 12,
    search: search || undefined,
    featured: featured ? "true" : undefined,
  });

  const paginationQuery = {
    search: search || undefined,
    featured: featured ? "true" : undefined,
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
            <ProjectsFilters initialSearch={search} initialFilter={featured ? "featured" : "all"} />
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
