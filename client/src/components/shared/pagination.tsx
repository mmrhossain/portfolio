'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { PaginationMeta } from '@/types';

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ meta, onPageChange, className }: PaginationProps) {
  if (meta.totalPages <= 1) return null;

  const pages = Array.from({ length: meta.totalPages }, (_, i) => i + 1);
  const visiblePages = getVisiblePages(meta.page, meta.totalPages);

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex flex-wrap items-center justify-center gap-2', className)}
    >
      <Button
        variant="outline"
        size="icon"
        disabled={!meta.hasPrevPage}
        onClick={() => onPageChange(meta.page - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {visiblePages.map((page, index) => {
        const isEllipsis = page === -1;
        if (isEllipsis) {
          return (
            <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
              &hellip;
            </span>
          );
        }
        return (
          <Button
            key={page}
            variant={page === meta.page ? 'default' : 'outline'}
            size="icon"
            onClick={() => onPageChange(page)}
            aria-current={page === meta.page ? 'page' : undefined}
          >
            {page}
          </Button>
        );
      })}

      <Button
        variant="outline"
        size="icon"
        disabled={!meta.hasNextPage}
        onClick={() => onPageChange(meta.page + 1)}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
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
