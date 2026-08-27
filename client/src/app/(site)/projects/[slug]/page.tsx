
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
            card: "summary_large_image",
            title: project.title,
            description: project.description,
            images: [project.image],
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

    return (
        <article className="relative min-h-screen overflow-hidden bg-background pb-32">


            {/* Background Glow */}
            <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[350px] w-[1000px] -translate-x-1/2 bg-gradient-to-tr from-accent/15 via-primary/10 to-transparent blur-[120px]" />

            <div className="container-page pt-12">
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
                <div className="mx-auto max-w-4xl text-center">
                    <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-border/80 bg-card/60 px-4 py-1.5 backdrop-blur-xl">
                        <Sparkles className="h-3.5 w-3.5 animate-pulse text-accent" />

                        <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-xs font-semibold uppercase tracking-wider text-transparent">
                            Case Study & Showcase
                        </span>
                    </div>

                    <h1 className="font-display break-words bg-gradient-to-b from-foreground via-foreground/90 to-muted-foreground/70 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-6xl lg:text-7xl">
                        {project.title}
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                        {project.description}
                    </p>

                    {/* Action Buttons */}
                    <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
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
                    <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <div className="rounded-2xl border border-border/60 bg-card/40 p-4 text-left">
                            <p className="text-xs text-muted-foreground">Category</p>
                            <p className="mt-1 font-medium">Web Application</p>
                        </div>

                        <div className="rounded-2xl border border-border/60 bg-card/40 p-4 text-left">
                            <p className="text-xs text-muted-foreground">Technologies</p>
                            <p className="mt-1 font-medium">{project.tags?.length ?? 0}+</p>
                        </div>

                        <div className="rounded-2xl border border-border/60 bg-card/40 p-4 text-left">
                            <p className="text-xs text-muted-foreground">Repository</p>
                            <p className="mt-1 font-medium">
                                {project.repoUrl ? "Public" : "Private"}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-border/60 bg-card/40 p-4 text-left">
                            <p className="text-xs text-muted-foreground">Status</p>
                            <p className="mt-1 font-medium">Completed</p>
                        </div>
                    </div>
                </div>

                {/* Hero Image */}
                <div className="group relative mx-auto mt-16 aspect-[16/9] w-full max-w-5xl overflow-hidden rounded-[2.5rem] border border-border/60 bg-card/40 shadow-2xl backdrop-blur-2xl">
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
                <div className="mx-auto mt-16 max-w-3xl space-y-12">
                    {/* Overview */}
                    <section className="lg:border border-border/60 rounded-[2rem]  bg-card/30 lg:p-6 lg:shadow-sm backdrop-blur-xl">
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
                        <section className="lg:border border-border/60 rounded-[2rem]  bg-card/20 lg:p-6 backdrop-blur-xl">
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
                    <section className="rounded-[2rem] border border-border/60 bg-card/20 p-8 text-center sm:p-10">
                        <h2 className="text-3xl font-bold tracking-tight">
                            Interested in Similar Work?
                        </h2>

                        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                            Explore more projects or get in touch to discuss your next idea.
                        </p>

                        <div className="mt-8 flex flex-wrap justify-center gap-4">
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

