import { z } from 'zod';
import { richTextSchema } from '../../shared/schemas/rich-text.js';

export const createBlogSchema = z.object({
  title: z.string().min(3).max(300),
  excerpt: z.string().min(10).max(1000),
  content: richTextSchema({ min: 20, max: 50000 }),
  coverImage: z.string().url(),
  category: z.string().min(1).max(100),
  tags: z.array(z.string().max(50)).max(15).default([]),
  readTime: z.number().int().min(1).max(120).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('PUBLISHED'),
});

export const updateBlogSchema = createBlogSchema.partial();

export const blogQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().max(100).optional(),
  category: z.string().max(100).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const blogIdSchema = z.object({
  id: z.string().uuid(),
});

export const blogSlugSchema = z.object({
  slug: z.string().min(1).max(300),
});

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
