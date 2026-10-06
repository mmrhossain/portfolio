import { z } from "zod";
import { extractRichText, isEmptyRichText } from "../utils/rich-text.js";

const markSchema = z.object({
  type: z.string(),
  attrs: z.record(z.string(), z.unknown()).optional(),
});

const nodeSchema: z.ZodType<Record<string, unknown>> = z.lazy(() =>
  z.object({
    type: z.string().optional(),
    attrs: z.record(z.string(), z.unknown()).optional(),
    content: z.array(nodeSchema).optional(),
    marks: z.array(markSchema).optional(),
    text: z.string().optional(),
  }),
);

export const richTextValueSchema = z.union([z.string(), nodeSchema]);

export function richTextSchema(options: {
  min?: number;
  max?: number;
  required?: boolean;
} = {}) {
  const { min = 1, max = 50000, required = true } = options;
  const message = required
    ? `Content must be between ${min} and ${max} characters.`
    : `Content must be at most ${max} characters.`;

  const check = (value: unknown) => {
    if (!required && (value == null || isEmptyRichText(value))) return true;
    const length = extractRichText(value).length;
    return length >= min && length <= max;
  };

  if (required) {
    return richTextValueSchema.refine(check, { message });
  }

  return richTextValueSchema.optional().nullable().refine(check, { message });
}
