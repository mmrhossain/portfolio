import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, CalendarDays, Clock, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { ApiResponse, Blog } from '@/types';
import {serverGetBlog} from "@/app/actions";
import ReactMarkDown from "react-markdown"

export const revalidate = 3600;

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const response: ApiResponse<Blog> | null = await serverGetBlog(slug);

  const blog = response?.data;
  if (!blog) return { title: 'Blog not found' };

  return {
    title: blog.title,
    description: blog.excerpt,
    alternates: {
      canonical: `/blogs/${slug}`,
    },
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: [blog.coverImage],
      type: 'article',
      publishedTime: blog.publishedAt ?? undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.excerpt,
      images: [blog.coverImage],
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const response: ApiResponse<Blog> | null = await serverGetBlog(slug);

  const blog = response?.data;
  if (!blog) return notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dev-monir.vercel.app';
  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt,
    image: blog.coverImage,
    datePublished: blog.publishedAt ?? undefined,
    dateModified: blog.updatedAt,
    author: blog.author
      ? { '@type': 'Person', name: blog.author.name }
      : { '@type': 'Person', name: 'Monir Hossain' },
    url: `${siteUrl}/blogs/${slug}`,
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Blogs', item: `${siteUrl}/blogs` },
      { '@type': 'ListItem', position: 3, name: blog.title, item: `${siteUrl}/blogs/${slug}` },
    ],
  };

  return (
      <article className="min-w-0 pb-16 sm:pb-24">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <div className="relative min-w-0 overflow-hidden">
          <div className="container-page min-w-0 pt-6 sm:pt-10">
            <Button asChild variant="ghost" size="sm" className="-ml-3 mb-8">
              <Link href="/blogs">
                <ArrowLeft className="h-4 w-4" />
                Back to blogs
              </Link>
            </Button>

            <div className="mx-auto min-w-0 max-w-3xl">
              <Badge variant="secondary">{blog.category}</Badge>
              <h1 className="mt-6 break-words font-display text-3xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                {blog.title}
              </h1>

              <div className="mt-6 flex min-w-0 flex-wrap items-center gap-3 text-sm text-muted-foreground sm:gap-5">
                {blog.author && (
                    <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                      {blog.author.name}
                </span>
                )}
                <span className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                  {formatDate(blog.publishedAt)}
              </span>
                <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                  {blog.readTime} min read
              </span>
              </div>
            </div>
          </div>
        </div>

        <div className="container-page mt-8 min-w-0 sm:mt-10">
          <div className="relative mx-auto aspect-[16/7] w-full min-w-0 max-w-4xl overflow-hidden rounded-md shadow-lg">
            <Image
                src={blog.coverImage}
                alt={blog.title}
                fill
                priority
                sizes="(max-width: 896px) 100vw, 896px"
                className="object-cover"
            />
          </div>

          <div className="prose prose-neutral prose-lg mx-auto mt-8 max-w-4xl min-w-0 break-words dark:prose-invert prose-headings:font-display prose-p:leading-relaxed sm:mt-12">
            <ReactMarkDown>{blog?.content}</ReactMarkDown>
          </div>

          <div className="mx-auto mt-8 flex min-w-0 max-w-4xl flex-wrap gap-2 border-t border-border pt-8 sm:mt-12">
            {blog.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  #{tag}
                </Badge>
            ))}
          </div>
        </div>
      </article>
  );
}