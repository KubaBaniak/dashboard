import { z } from "zod";

export const categoryBaseSchema = z.object({
  name: z.string().min(2, "Name is too short").max(80, "Name is too long"),
  description: z
    .string()
    .max(300, "Description is too long")
    .optional()
    .or(z.literal("")),
});

export const createCategorySchema = categoryBaseSchema;

export const updateCategorySchema = categoryBaseSchema.extend({
  id: z.number().int().positive(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
