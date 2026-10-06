import { z } from 'zod';
import { richTextSchema } from '../../shared/schemas/rich-text.js';

export const createProjectSchema = z.object({
  title: z.string().min(2).max(200),
  description: richTextSchema({ min: 10, max: 2000 }),
  longDescription: richTextSchema({ min: 0, max: 10000, required: false }),
  image: z.string().url(),
  repoUrl: z.string().url().optional().nullable(),
  liveUrl: z.string().url().optional().nullable(),
  tags: z.array(z.string().max(50)).max(20).default([]),
  featured: z.boolean().default(false),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('PUBLISHED'),
  order: z.number().int().default(0),
});

export const updateProjectSchema = createProjectSchema.partial();

export const projectQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().max(100).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  featured: z.enum(['true', 'false']).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const projectIdSchema = z.object({
  id: z.string().uuid(),
});

export const projectSlugSchema = z.object({
  slug: z.string().min(1).max(250),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
