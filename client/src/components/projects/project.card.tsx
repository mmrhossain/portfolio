import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { FaGithub } from "react-icons/fa";
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  return (
      <article
          className={cn(
              'group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-xl',
              className,
          )}
      >
        <Link href={`/projects/${project?.slug}`} className="relative aspect-16/10 overflow-hidden block">
          <Image
              src={project?.image}
              alt={project?.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              loading="eager"
          />
          {project?.featured && (
              <Badge className="absolute left-4 top-4 z-10" variant="accent">
                Featured
              </Badge>
          )}
        </Link>

        <div className="flex flex-1 flex-col p-6">
          <Link href={`/projects/${project?.slug}`}>
            <h3 className="font-display text-2xl font-bold break-words transition-colors hover:text-accent">
              {project?.title}
            </h3>
          </Link>

          <p className="mt-2 line-clamp-3 flex-1 break-words text-sm leading-relaxed text-muted-foreground">
            {project?.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {project?.tags?.slice(0, 4).map((tag) => (
                <Badge key={tag} variant="secondary" className="font-normal">
                  {tag}
                </Badge>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-y-2">
            <div className="flex items-center gap-3">
              {project?.liveUrl && (
                  <Link
                      href={project?.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-accent-foreground"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Live demo
                  </Link>
              )}
              {project?.repoUrl && (
                  <Link
                      href={project?.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <FaGithub className="h-4 w-4" />
                    Source
                  </Link>
              )}
            </div>

            <Link
                href={`/projects/${project?.slug}`}
                className="text-sm font-semibold text-accent transition-colors hover:underline"
            >
              Details &rarr;
            </Link>
          </div>
        </div>
      </article>
  );
}