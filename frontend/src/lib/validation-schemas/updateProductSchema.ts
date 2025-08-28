import { z } from "zod";

export const updateProductSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200).optional(),
  description: z.string().trim().max(2000).optional(),
  sku: z.string().trim().min(1, "SKU is required").max(120).optional(),
  stockQuantity: z.number().int().min(0, "Must be ≥ 0").optional(),
  price: z
    .number()
    .positive("Must be > 0")
    // keep it simple but enforce 2 decimals
    .refine((v) => Math.round(v * 100) === v * 100, {
      message: "Max 2 decimal places",
    })
    .optional(),
  categoryIds: z.array(z.number().int().positive()).optional(),
});

export type UpdateProductInput = z.infer<typeof updateProductSchema>;
