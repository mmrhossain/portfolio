import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProjectCard } from '@/components/projects/project.card';
import { SectionHeading } from '@/components/site/section-heading';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import type { Project } from '@/types';

interface FeaturedProjectsProps {
  projects: Project[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {

  return (
    <section className="py-12 lg:py-20">
      <div className="container-page">
        <div className="flex min-w-0 flex-wrap items-end justify-between gap-4 lg:gap-6">
          <SectionHeading
            eyebrow="Recent Projects"
            title="Featured Projects"
            description="A selection of products and experiences I've designed and built."
            className="mb-2 min-w-0"
          />
          <Button asChild variant="outline" className="mb-6 shrink-0 lg:mb-12">
            <Link href="/projects">
              View all projects
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {projects.length === 0 ? (
          <EmptyState title="No featured projects" description="Featured projects will appear here." />
        ) : (
          <div className="grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
