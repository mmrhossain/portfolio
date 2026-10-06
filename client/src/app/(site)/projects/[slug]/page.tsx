import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaGithub } from "react-icons/fa";

import { RichTextContent } from "@/components/shared/editor/rich-text-content";
import { Breadcrumbs } from "@/components/shared/seo/breadcrumbs";
import { JsonLd } from "@/components/shared/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { serverGetProject, serverListProjects } from "@/features/project/api/server";
import { extractRichText } from "@/lib/rich-text";
import { createPageMetadata } from "@/lib/seo";
import { projectJsonLd } from "@/lib/seo/json-ld";

import type { ApiResponse, Project } from "@/types";

export const revalidate = 3600;

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const result = await serverListProjects({ limit: 100 });

  return (result.data ?? [])
    .filter((project) => project.status === "PUBLISHED" && project.slug)
    .map((project) => ({
      slug: project.slug,
    }));
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  const response: ApiResponse<Project> | null = await serverGetProject(slug);

  const project = response?.data;

  if (!project || project.status !== "PUBLISHED") {
    return createPageMetadata({
      title: "Project not found",
      description: "The requested project could not be found.",
      path: `/projects/${slug}`,
      index: false,
      follow: true,
    });
  }

  return createPageMetadata({
    title: project.title,
    description: extractRichText(project.description),
    path: `/projects/${slug}`,
    image: project.image,
    imageAlt: `${project.title} project screenshot`,
    keywords: project.tags,
    modifiedTime: project.updatedAt,
    publishedTime: project.createdAt,
  });
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;

  const response: ApiResponse<Project> | null = await serverGetProject(slug);

  const project = response?.data;

  if (!project || project.status !== "PUBLISHED") {
    return notFound();
  }

  return (
    <article className="min-w-0 pb-20 sm:pb-28">
      <JsonLd data={projectJsonLd(project, slug)} />

      {/* ==================================================
                HEADER
            ================================================== */}
      <header className="border-b border-border/60">
        <div className="container-page">
          {/* Navigation */}
          <div className="py-6 sm:py-8">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="-ml-3 w-fit gap-2 text-muted-foreground hover:text-foreground"
            >
              <Link href="/projects">
                <ArrowLeft className="h-4 w-4" />
                Back to projects
              </Link>
            </Button>

            <div className="mt-5">
              <Breadcrumbs
                items={[
                  {
                    name: "Home",
                    path: "/",
                  },
                  {
                    name: "Projects",
                    path: "/projects",
                  },
                  {
                    name: project.title,
                    path: `/projects/${slug}`,
                  },
                ]}
              />
            </div>
          </div>

          {/* Project Introduction */}
          <div className="mx-auto max-w-5xl pb-12 pt-6 sm:pb-16 sm:pt-8">
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-accent" />

              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Project Case Study
              </span>
            </div>

            {/* Title */}
            <h1
              className="
                                mt-5
                                max-w-4xl
                                break-words
                                font-display
                                text-3xl
                                font-bold
                                leading-tight
                                tracking-tight
                                text-foreground
                                sm:text-4xl
                                lg:text-5xl
                            "
            >
              {project.title}
            </h1>

            {/* Short Description */}
            <RichTextContent
              value={project.description}
              compact
              className="
                                mt-5
                                max-w-3xl
                                text-base
                                leading-7
                                text-foreground
                                sm:text-lg
                                sm:leading-8
                            "
            />
          </div>
        </div>
      </header>

      {/* ==================================================
                HERO IMAGE
            ================================================== */}
      <section className="container-page">
        <div className="mx-auto max-w-6xl">
          <div className="relative aspect-[16/8] w-full overflow-hidden bg-muted shadow-xl sm:aspect-[16/7] lg:rounded-b-2xl">
            <Image
              src={project.image}
              alt={`${project.title} project screenshot`}
              fill
              priority
              quality={95}
              sizes="
                                (max-width: 640px) 100vw,
                                (max-width: 1024px) 92vw,
                                1200px
                            "
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ==================================================
                MAIN CONTENT
            ================================================== */}
      <div className="container-page">
        <div className="mx-auto mt-12 grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-16 xl:gap-20">
          {/* ==================================================
                        ARTICLE CONTENT
                    ================================================== */}
          <main className="min-w-0">
            {/* Overview */}
            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Overview
              </p>

              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                About the project
              </h2>

              <RichTextContent
                value={project.longDescription ?? project.description}
                className="
                                    mt-7
                                    max-w-none
                                    prose-lg

                                    prose-headings:font-display
                                    prose-headings:tracking-tight
                                    prose-headings:text-foreground

                                    prose-p:text-muted-foreground
                                    prose-p:leading-8

                                    prose-a:font-medium
                                    prose-a:text-accent
                                    prose-a:no-underline
                                    hover:prose-a:underline

                                    prose-strong:text-foreground

                                    prose-code:rounded
                                    prose-code:bg-muted
                                    prose-code:px-1.5
                                    prose-code:py-0.5
                                    prose-code:text-sm

                                    prose-pre:overflow-x-auto
                                    prose-pre:rounded-xl
                                "
              />
            </section>

            {/* CTA */}
            <section className="mt-16 border-t border-border pt-10 sm:mt-20 sm:pt-12">
              <div className="rounded-2xl border border-border bg-muted/30 p-7 sm:rounded-3xl sm:p-10">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Project inquiry
                </p>

                <h2 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                  Have a similar project in mind?
                </h2>

                <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
                  I'm interested in building modern web applications, backend systems, and practical
                  digital products.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Button asChild>
                    <Link href="/contact">
                      Start a conversation
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>

                  <Button asChild variant="outline">
                    <Link href="/projects">Explore more projects</Link>
                  </Button>
                </div>
              </div>
            </section>
          </main>

          {/* ==================================================
                        SIDEBAR
                    ================================================== */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-8">
              {/* Project Details */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Project details
                </p>

                <dl className="mt-5 space-y-5 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Type</dt>

                    <dd className="mt-1 font-medium text-foreground">Web application</dd>
                  </div>

                  <div>
                    <dt className="text-muted-foreground">Technologies</dt>

                    <dd className="mt-1 font-medium text-foreground">
                      {project.tags?.length ?? 0} technologies
                    </dd>
                  </div>

                  <div>
                    <dt className="text-muted-foreground">Repository</dt>

                    <dd className="mt-1 font-medium text-foreground">
                      {project.repoUrl ? "Public" : "Private"}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-muted-foreground">Last updated</dt>

                    <dd className="mt-1 font-medium text-foreground">
                      {new Date(project.updatedAt).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Technology Stack */}
              {project.tags && project.tags.length > 0 && (
                <div className="border-t border-border pt-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Stack
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="rounded-full">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Project Links */}
              <div className="border-t border-border pt-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Project links
                </p>

                <div className="mt-4 space-y-2">
                  {project.liveUrl && (
                    <Link
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                                                group
                                                flex
                                                items-center
                                                justify-between
                                                rounded-xl
                                                border
                                                border-border
                                                px-4
                                                py-3
                                                text-sm
                                                font-medium
                                                transition-colors
                                                hover:border-foreground/20
                                                hover:bg-muted/50
                                            "
                    >
                      <span className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        Live project
                      </span>

                      <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>
                  )}

                  {project.repoUrl && (
                    <Link
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                                                group
                                                flex
                                                items-center
                                                justify-between
                                                rounded-xl
                                                border
                                                border-border
                                                px-4
                                                py-3
                                                text-sm
                                                font-medium
                                                transition-colors
                                                hover:border-foreground/20
                                                hover:bg-muted/50
                                            "
                    >
                      <span className="flex items-center gap-2">
                        <FaGithub className="h-4 w-4 text-muted-foreground" />
                        Source code
                      </span>

                      <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
