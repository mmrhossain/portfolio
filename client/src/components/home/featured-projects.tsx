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
    <section className="py-20">
      <div className="container-page">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:gap-6 lg:mb-0">
          <SectionHeading
            eyebrow="Recent Projects"
            title="Featured Projects"
            description="A selection of products and experiences I've designed and built."
            className="mb-0 min-w-0 lg:mb-2"
          />
          <Button asChild variant="outline" className="mb-0 w-full sm:w-auto lg:mb-12">
            <Link href="/projects">
              View all projects
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {projects.length === 0 ? (
          <EmptyState title="No featured projects" description="Featured projects will appear here." />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
