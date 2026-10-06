import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BlogCard } from '@/features/blog/components/public/blog-card';
import { SectionHeading } from '@/components/shared/section-heading';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import type { Blog } from '@/types';

interface BlogTeaserProps {
  blogs: Blog[];
}

export function BlogTeaser({ blogs }: BlogTeaserProps) {
  return (
    <section className="py-12 lg:py-20">
      <div className="container-page">
        <div className="flex min-w-0 flex-wrap items-end justify-between gap-4 lg:gap-6">
          <SectionHeading
            eyebrow="Recent Blogs"
            title="All Recent Blogs"
            description="Notes on full stack development, Next.js, React, and Node.js from shipping real projects."
            className="mb-0 min-w-0"
          />
          <Button asChild variant="outline" className="mb-6 shrink-0 lg:mb-12">
            <Link href="/blogs">
              View all posts
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {blogs.length === 0 ? (
          <EmptyState title="No blogs yet" description="Recent blog posts will appear here." />
        ) : (
          <div className="grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
