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
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: [blog.coverImage],
      type: 'article',
      publishedTime: blog.publishedAt ?? undefined,
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const response: ApiResponse<Blog> | null = await serverGetBlog(slug);

  const blog = response?.data;
  if (!blog) return notFound();

  return (
      <article className="pb-24">
        <div className="relative overflow-hidden">
          <div className="container-page pt-10">
            <Button asChild variant="ghost" size="sm" className="-ml-3 mb-8">
              <Link href="/blogs">
                <ArrowLeft className="h-4 w-4" />
                Back to blogs
              </Link>
            </Button>

            <div className="mx-auto max-w-3xl">
              <Badge variant="secondary">{blog.category}</Badge>
              <h1 className="mt-6 font-display text-4xl font-bold leading-tight tracking-tight break-words sm:text-5xl lg:text-6xl">
                {blog.title}
              </h1>

              <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
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

        <div className="container-page mt-10">
          <div className="relative mx-auto aspect-[16/7] w-full max-w-4xl overflow-hidden rounded-3xl shadow-lg">
            <Image
                src={blog.coverImage}
                alt={blog.title}
                fill
                priority
                sizes="(max-width: 896px) 100vw, 896px"
                className="object-cover"
            />
          </div>

          <div className="prose prose-lg prose-neutral mx-auto mt-12 max-w-3xl break-words dark:prose-invert prose-headings:font-display prose-p:leading-relaxed">
            <ReactMarkDown>{blog?.content}</ReactMarkDown>
          </div>

          <div className="mx-auto mt-12 flex max-w-3xl flex-wrap gap-2 border-t border-border pt-8">
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