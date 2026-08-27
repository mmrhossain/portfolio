import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PaginationMeta } from '@/types';

interface PaginationLinksProps {
  meta: PaginationMeta;
  basePath: string;
  searchParams: Record<string, string | undefined>;
  className?: string;
}

function pageHref(
  basePath: string,
  searchParams: Record<string, string | undefined>,
  page: number,
): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (value) params.set(key, value);
  }
  if (page > 1) params.set('page', String(page));
  else params.delete('page');
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

const linkClass =
  'inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-sm font-medium transition-colors hover:bg-secondary';

export function PaginationLinks({ meta, basePath, searchParams, className }: PaginationLinksProps) {
  if (meta.totalPages <= 1) return null;

  const visiblePages = getVisiblePages(meta.page, meta.totalPages);

  return (
    <nav aria-label="Pagination" className={cn('flex flex-wrap items-center justify-center gap-2', className)}>
      {meta.hasPrevPage ? (
        <Link
          href={pageHref(basePath, searchParams, meta.page - 1)}
          className={linkClass}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span className={cn(linkClass, 'pointer-events-none opacity-50')} aria-hidden>
          <ChevronLeft className="h-4 w-4" />
        </span>
      )}

      {visiblePages.map((page, index) => {
        if (page === -1) {
          return (
            <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
              &hellip;
            </span>
          );
        }
        const isCurrent = page === meta.page;
        return (
          <Link
            key={page}
            href={pageHref(basePath, searchParams, page)}
            className={cn(
              linkClass,
              isCurrent && 'border-primary bg-primary text-primary-foreground hover:bg-primary/90',
            )}
            aria-current={isCurrent ? 'page' : undefined}
          >
            {page}
          </Link>
        );
      })}

      {meta.hasNextPage ? (
        <Link
          href={pageHref(basePath, searchParams, meta.page + 1)}
          className={linkClass}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className={cn(linkClass, 'pointer-events-none opacity-50')} aria-hidden>
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}

function getVisiblePages(current: number, total: number): number[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages = new Set<number>([1, 2, total - 1, total, current - 1, current, current + 1]);
  const sorted = Array.from(pages)
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  const result: number[] = [];
  let prev = 0;
  for (const page of sorted) {
    if (prev && page - prev > 1) result.push(-1);
    result.push(page);
    prev = page;
  }
  return result;
}
