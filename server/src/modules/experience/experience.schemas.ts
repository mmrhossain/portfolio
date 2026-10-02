import { z } from "zod";

const dateString = z.iso.datetime({ offset: true }).or(z.iso.date());

export const createExperienceSchema = z.object({
  company: z.string().min(2).max(200),
  role: z.string().min(2).max(200),
  location: z.string().max(200).optional().nullable(),
  startDate: dateString,
  endDate: dateString.optional().nullable(),
  description: z.string().min(5).max(2000),
  order: z.number().int().default(0),
  isActive: z.boolean().optional(),
});

export const updateExperienceSchema = createExperienceSchema.partial();

export const experienceQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().max(100).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export const experienceIdSchema = z.object({
  id: z.string().uuid(),
});

export type CreateExperienceInput = z.infer<typeof createExperienceSchema>;
export type UpdateExperienceInput = z.infer<typeof updateExperienceSchema>;
