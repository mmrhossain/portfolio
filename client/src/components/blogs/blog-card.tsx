import Link from 'next/link';
import { Clock, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import type { Blog } from '@/types';

interface BlogCardProps {
  blog: Blog;
}

export function BlogCard({ blog }: BlogCardProps) {
  return (
    <Link
      href={`/blogs/${blog.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-xl"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={blog.coverImage}
          alt={blog.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <Badge variant="secondary" className="font-medium">
            {blog.category}
          </Badge>
          <span>{formatDate(blog.publishedAt)}</span>
        </div>
        <h3 className="font-display text-xl font-bold leading-snug break-words transition-colors group-hover:text-accent-foreground">
          {blog.title}
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 break-words text-sm leading-relaxed text-muted-foreground">
          {blog.excerpt}
        </p>
        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          {blog.author && (
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              {blog.author.name}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {blog.readTime} min read
          </span>
        </div>
      </div>
    </Link>
  );
}
