import { z } from "zod";
import { richTextSchema } from "../../shared/schemas/rich-text.js";

const dateString = z.iso.datetime({ offset: true }).or(z.iso.date());

export const createEducationSchema = z.object({
  institution: z.string().min(2).max(200),
  degree: z.string().min(2).max(200),
  field: z.string().max(200).optional().nullable(),
  location: z.string().max(200).optional().nullable(),
  startDate: dateString,
  endDate: dateString.optional().nullable(),
  description: richTextSchema({ min: 5, max: 2000 }),
  order: z.number().int().default(0),
  isActive: z.boolean().optional(),
});

export const updateEducationSchema = createEducationSchema.partial();

export const educationQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().max(100).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export const educationIdSchema = z.object({
  id: z.string().uuid(),
});

export type CreateEducationInput = z.infer<typeof createEducationSchema>;
export type UpdateEducationInput = z.infer<typeof updateEducationSchema>;
