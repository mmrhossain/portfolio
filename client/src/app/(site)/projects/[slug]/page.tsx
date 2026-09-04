
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import {
    ArrowLeft,
    ExternalLink,
    Sparkles,
    Terminal,
    Cpu,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { serverGetProject } from "@/app/actions";
import type { ApiResponse, Project } from "@/types";

export const revalidate = 3600;

interface ProjectDetailPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({
    params,
}: ProjectDetailPageProps): Promise<Metadata> {
    const { slug } = await params;

    const response: ApiResponse<Project> | null =
        await serverGetProject(slug);

    const project = response?.data;

    if (!project) {
        return {
            title: "Project Not Found | Monir Hossain",
            description: "The requested project could not be found.",
        };
    }

    return {
        title: `${project.title} | Monir Hossain`,
        description: project.description,
        keywords: project.tags,
        alternates: {
            canonical: `/projects/${slug}`,
        },

        openGraph: {
            title: project.title,
            description: project.description,
            type: "article",
            images: [
                {
                    url: project.image,
                    width: 1200,
                    height: 630,
                    alt: project.title,
                },
            ],
        },

        twitter: {
            card: project.image ? "summary_large_image" : "summary",
            title: project.title,
            description: project.description,
            images: project.image ? [project.image] : undefined,
        },
    };
}

export default async function ProjectDetailPage({
    params,
}: ProjectDetailPageProps) {
    const { slug } = await params;

    const response: ApiResponse<Project> | null =
        await serverGetProject(slug);

    const project = response?.data;

    if (!project) {
        return notFound();
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dev-monir.vercel.app";
    const projectJsonLd = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: project.title,
        description: project.description,
        image: project.image || undefined,
        url: `${siteUrl}/projects/${slug}`,
        dateCreated: project.createdAt,
        dateModified: project.updatedAt,
        keywords: project.tags,
        author: { "@type": "Person", name: "Monir Hossain" },
        ...(project.liveUrl ? { sameAs: [project.liveUrl] } : {}),
    };
    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
            { "@type": "ListItem", position: 2, name: "Projects", item: `${siteUrl}/projects` },
            { "@type": "ListItem", position: 3, name: project.title, item: `${siteUrl}/projects/${slug}` },
        ],
    };

    return (
        <article className="relative min-h-screen min-w-0 overflow-hidden bg-background pb-16 sm:pb-32">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />


            {/* Background Glow */}
            <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[350px] w-[1000px] -translate-x-1/2 bg-gradient-to-tr from-accent/15 via-primary/10 to-transparent blur-[120px]" />

            <div className="container-page min-w-0 pt-8 sm:pt-12">
                {/* Back Button */}
                <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="group -ml-3 mb-10 rounded-full border border-transparent px-4 transition-all hover:border-border/60 hover:bg-card/40"
                >
                    <Link
                        href="/projects"
                        className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1.5" />
                        <span>Back to Projects</span>
                    </Link>
                </Button>

                {/* Header */}
                <div className="mx-auto min-w-0 max-w-4xl text-center">
                    <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-border/80 bg-card/60 px-4 py-1.5 backdrop-blur-xl">
                        <Sparkles className="h-3.5 w-3.5 animate-pulse text-accent" />

                        <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-xs font-semibold uppercase tracking-wider text-transparent">
                            Case Study & Showcase
                        </span>
                    </div>

                    <h1 className="break-words font-display bg-gradient-to-b from-foreground via-foreground/90 to-muted-foreground/70 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-6xl lg:text-7xl">
                        {project.title}
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-xl">
                        {project.description}
                    </p>

                    {/* Action Buttons */}
                    <div className="mt-8 flex w-full min-w-0 flex-col items-stretch justify-center gap-4 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center">
                        {project.liveUrl && (
                            <Button
                                asChild
                                size="lg"
                                className="h-12 rounded-2xl px-7 shadow-xl shadow-accent/20 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                            >
                                <Link
                                    href={project.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`View live preview of ${project.title}`}
                                    className="flex items-center gap-2"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    <span>Live Preview</span>
                                </Link>
                            </Button>
                        )}

                        {project.repoUrl && (
                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className="h-12 rounded-2xl border-border/80 bg-card/40 px-7 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:bg-card/80 active:scale-95"
                            >
                                <Link
                                    href={project.repoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`View source code of ${project.title}`}
                                    className="flex items-center gap-2"
                                >
                                    <FaGithub className="h-4 w-4" />
                                    <span>Source Code</span>
                                </Link>
                            </Button>
                        )}
                    </div>

                    {/* Project Stats */}
                    <div className="mt-8 grid min-w-0 grid-cols-2 gap-3 sm:mt-12 sm:grid-cols-4 sm:gap-4">
                        <div className="min-w-0 rounded-2xl border border-border/60 bg-card/40 p-3 text-left sm:p-4">
                            <p className="text-xs text-muted-foreground">Category</p>
                            <p className="mt-1 truncate font-medium">Web Application</p>
                        </div>

                        <div className="min-w-0 rounded-2xl border border-border/60 bg-card/40 p-3 text-left sm:p-4">
                            <p className="text-xs text-muted-foreground">Technologies</p>
                            <p className="mt-1 truncate font-medium">{project.tags?.length ?? 0}+</p>
                        </div>

                        <div className="min-w-0 rounded-2xl border border-border/60 bg-card/40 p-3 text-left sm:p-4">
                            <p className="text-xs text-muted-foreground">Repository</p>
                            <p className="mt-1 truncate font-medium">
                                {project.repoUrl ? "Public" : "Private"}
                            </p>
                        </div>

                        <div className="min-w-0 rounded-2xl border border-border/60 bg-card/40 p-3 text-left sm:p-4">
                            <p className="text-xs text-muted-foreground">Status</p>
                            <p className="mt-1 truncate font-medium">Completed</p>
                        </div>
                    </div>
                </div>

                {/* Hero Image */}
                <div className="group relative mx-auto mt-10 aspect-[16/9] w-full min-w-0 max-w-5xl overflow-hidden rounded-md border border-border/60 bg-card/40 shadow-2xl backdrop-blur-2xl sm:mt-16">
                    <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-background/60 via-transparent to-transparent" />

                    <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        priority
                        quality={95}
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1280px"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                </div>

                {/* Content */}
                <div className="mx-auto mt-10 min-w-0 max-w-3xl space-y-8 sm:mt-16 sm:space-y-12">
                    {/* Overview */}
                    <section className="rounded-2xl border-border/60 bg-card/30 backdrop-blur-xl lg:rounded-[2rem] lg:border lg:p-6 lg:shadow-sm">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border/80 bg-card/80 text-accent">
                                <Terminal className="h-5 w-5" />
                            </div>

                            <h2 className="font-display text-2xl font-bold tracking-tight">
                                Overview
                            </h2>
                        </div>

                        <div className="prose prose-lg prose-neutral dark:prose-invert max-w-none break-words">
                            <ReactMarkdown>
                                {project.longDescription}
                            </ReactMarkdown>
                        </div>
                    </section>

                    {/* Tech Stack */}
                    {project.tags && project.tags.length > 0 && (
                        <section className="rounded-2xl border-border/60 bg-card/20 backdrop-blur-xl lg:rounded-[2rem] lg:border lg:p-6">
                            <div className="mb-6 flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border/80 bg-card/80 text-accent">
                                    <Cpu className="h-5 w-5" />
                                </div>

                                <h3 className="font-display text-xl font-bold tracking-tight">
                                    Technologies & Stack
                                </h3>
                            </div>

                            <div className="flex flex-wrap gap-2.5">
                                {project.tags.map((tag) => (
                                    <Badge
                                        key={tag}
                                        variant="secondary"
                                        className="rounded-xl border border-border/40 bg-card/50 px-4 py-2 text-sm font-medium transition-all duration-300 hover:border-accent/60 hover:bg-accent/5 hover:text-accent"
                                    >
                                        #{tag}
                                    </Badge>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* CTA */}
                    <section className="rounded-2xl border border-border/60 bg-card/20 p-5 text-center sm:rounded-[2rem] sm:p-10">
                        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            Interested in Similar Work?
                        </h2>

                        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                            Explore more projects or get in touch to discuss your next idea.
                        </p>

                        <div className="mt-8 flex min-w-0 flex-col justify-center gap-4 sm:flex-row sm:flex-wrap">
                            <Button asChild>
                                <Link href="/projects">View More Projects</Link>
                            </Button>

                            <Button variant="outline" asChild>
                                <Link href="/contact">Contact Me</Link>
                            </Button>
                        </div>
                    </section>
                </div>
            </div>
        </article>
    );
}

