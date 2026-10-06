import { ArrowLeft, ArrowUpRight, CalendarDays, Clock3, User } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { RichTextContent } from "@/components/shared/editor/rich-text-content";
import { Breadcrumbs } from "@/components/shared/seo/breadcrumbs";
import { JsonLd } from "@/components/shared/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { createPageMetadata } from "@/lib/seo";
import { articleJsonLd } from "@/lib/seo/json-ld";
import { formatDate } from "@/lib/utils";

import { serverGetBlog, serverListBlogs } from "@/features/blog/api/server";
import { serverListProjects } from "@/features/project/api/server";
import { ApiResponse, Blog } from "@/types";

export const revalidate = 3600;

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const result = await serverListBlogs({ limit: 100 });

  return (result.data ?? [])
    .filter((blog) => blog.status === "PUBLISHED" && blog.slug)
    .map((blog) => ({
      slug: blog.slug,
    }));
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  const response: ApiResponse<Blog> | null = await serverGetBlog(slug);

  const blog = response?.data;

  if (!blog || blog.status !== "PUBLISHED") {
    return createPageMetadata({
      title: "Article not found",
      description: "The requested article could not be found.",
      path: `/blogs/${slug}`,
      index: false,
      follow: true,
    });
  }

  return createPageMetadata({
    title: blog.title,
    description: blog.excerpt,
    path: `/blogs/${slug}`,
    image: blog.coverImage,
    imageAlt: blog.title,
    type: "article",
    keywords: blog.tags,
    publishedTime: blog.publishedAt,
    modifiedTime: blog.updatedAt,
    authors: [blog.author?.name ?? "Monir Hossain"],
  });
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;

  const response: ApiResponse<Blog> | null = await serverGetBlog(slug);

  const blog = response?.data;

  if (!blog || blog.status !== "PUBLISHED") {
    return notFound();
  }

  const relatedProjectsResult = await serverListProjects({
    limit: 3,
    featured: "true",
  });

  const relatedProjects = relatedProjectsResult.data ?? [];

  const authorName = blog.author?.name ?? "Monir Hossain";

  return (
    <article className="min-w-0 pb-20 sm:pb-28">
      <JsonLd data={articleJsonLd(blog, slug)} />

      {/* --------------------------------------------------
          HEADER
      -------------------------------------------------- */}
      <header className="border-b border-border/60">
        <div className="container-page">
          <div className="py-6 sm:py-8">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="-ml-3 w-fit gap-2 text-muted-foreground hover:text-foreground"
            >
              <Link href="/blogs">
                <ArrowLeft className="h-4 w-4" />
                Back to blogs
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
                    name: "Blog",
                    path: "/blogs",
                  },
                  {
                    name: blog.title,
                    path: `/blogs/${slug}`,
                  },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="container-page">
          <div className="mx-auto max-w-4xl pb-10 pt-6 sm:pb-14 sm:pt-10 lg:pb-16">
            {/* Category */}
            {blog.category && (
              <div className="mb-5">
                <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-medium">
                  {blog.category}
                </Badge>
              </div>
            )}

            {/* Title */}
            <h1
              className="
                max-w-4xl
                break-words
                font-display
                text-4xl
                font-bold
                leading-[1.08]
                tracking-tight
                text-foreground
                sm:text-5xl
                lg:text-6xl
                xl:text-7xl
              "
            >
              {blog.title}
            </h1>

            {/* Excerpt */}
            {blog.excerpt && (
              <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground sm:text-xl">
                {blog.excerpt}
              </p>
            )}

            {/* Meta */}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                  <User className="h-4 w-4" />
                </div>

                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Written by</span>

                  <span className="font-medium text-foreground">{authorName}</span>
                </div>
              </div>

              <span aria-hidden="true" className="hidden h-8 w-px bg-border sm:block" />

              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                <span>{formatDate(blog.publishedAt)}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4" />
                <span>{blog.readTime} min read</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --------------------------------------------------
          HERO IMAGE
      -------------------------------------------------- */}
      <div className="container-page">
        <div className="mx-auto -mt-px max-w-6xl">
          <div className="relative aspect-[16/8] w-full overflow-hidden bg-muted shadow-xl sm:aspect-[16/7] lg:rounded-b-2xl">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              priority
              sizes="
                (max-width: 640px) 100vw,
                (max-width: 1024px) 90vw,
                1200px
              "
              className="object-cover"
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
          </div>
        </div>
      </div>

      {/* --------------------------------------------------
          ARTICLE CONTENT
      -------------------------------------------------- */}
      <div className="container-page">
        <div className="mx-auto mt-12 grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-16 xl:gap-20">
          {/* Main article */}
          <main className="min-w-0">
            <RichTextContent
              value={blog.content}
              className="
                prose
                prose-lg
                max-w-none

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

                prose-blockquote:border-l-accent

                prose-code:rounded
                prose-code:bg-muted
                prose-code:text-foreground
                prose-code:px-1.5
                prose-code:py-0.5
                prose-code:text-sm

                prose-pre:rounded-xl
                prose-pre:overflow-x-auto
                prose-pre:whitespace-pre

                sm:prose-xl
                sm:prose-p:leading-8
              "
            />

            {/* Tags */}
            {blog.tags?.length > 0 && (
              <div className="mt-12 border-t border-border pt-8">
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="rounded-full px-3 py-1">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* --------------------------------------------------
                AUTHOR CARD
            -------------------------------------------------- */}
            <section className="mt-14 border-t border-border pt-10 sm:mt-16">
              <div className="rounded-2xl border border-border bg-muted/30 p-6 sm:p-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-semibold text-primary-foreground">
                    {authorName
                      .split(" ")
                      .slice(0, 2)
                      .map((name) => name[0])
                      .join("")
                      .toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                      About the author
                    </p>

                    <h2 className="mt-1 font-display text-xl font-semibold tracking-tight">
                      {authorName}
                    </h2>

                    <p className="mt-2 max-w-2xl leading-7 text-muted-foreground">
                      Full-stack developer from Bangladesh, focused on building modern web
                      applications, backend systems, and practical developer experiences.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-4">
                      <Link
                        href="/about"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
                      >
                        More about me
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>

                      <Link
                        href="/projects"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
                      >
                        View projects
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>

          {/* --------------------------------------------------
              SIDEBAR
          -------------------------------------------------- */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-8">
              {/* Article details */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Article
                </p>

                <div className="mt-4 space-y-4 text-sm">
                  {blog.category && (
                    <div>
                      <p className="text-xs text-muted-foreground">Category</p>

                      <p className="mt-1 font-medium text-foreground">{blog.category}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-xs text-muted-foreground">Published</p>

                    <p className="mt-1 font-medium text-foreground">
                      {formatDate(blog.publishedAt)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Reading time</p>

                    <p className="mt-1 font-medium text-foreground">{blog.readTime} min</p>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {blog.tags?.length > 0 && (
                <div className="border-t border-border pt-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Topics
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {blog.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="rounded-full">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="border-t border-border pt-8">
                <p className="text-sm font-semibold">Enjoyed this article?</p>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Explore more technical articles and implementation work.
                </p>

                <Link
                  href="/blogs"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
                >
                  Browse all articles
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* --------------------------------------------------
          RELATED PROJECTS
      -------------------------------------------------- */}
      {relatedProjects.length > 0 && (
        <section className="container-page mt-20 sm:mt-28">
          <div className="mx-auto max-w-6xl border-t border-border pt-10 sm:pt-14">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Continue exploring
                </p>

                <h2 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                  Related projects
                </h2>
              </div>

              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
              >
                View all projects
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {relatedProjects.map((project) => (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className="
                    group
                    rounded-2xl
                    border
                    border-border
                    bg-background
                    p-5
                    transition
                    hover:-translate-y-0.5
                    hover:border-foreground/20
                    hover:shadow-md
                  "
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-lg font-semibold tracking-tight transition-colors group-hover:text-accent">
                      {project.title}
                    </h3>

                    <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
                  </div>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Explore the implementation, architecture, and technologies behind this project.
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* --------------------------------------------------
          BOTTOM CTA
      -------------------------------------------------- */}
      <section className="container-page mt-16 sm:mt-24">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-border bg-muted/30 p-8 sm:p-12">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Let's build something
            </p>

            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Have a project or idea in mind?
            </h2>

            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Explore my work or get in touch to discuss a web application, backend system, or
              product idea.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/contact">
                  Start a conversation
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button asChild variant="outline">
                <Link href="/projects">Explore projects</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
