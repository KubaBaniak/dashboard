import { z } from "zod";

export const createProductSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  sku: z.string().min(1, "SKU is required"),
  stockQuantity: z
    .number({ error: "Stock must be a number" })
    .min(0, "Stock cannot be negative"),
  price: z
    .number({ error: "Price must be a number" })
    .positive("Price must be > 0")
    .refine((v) => Number.isFinite(v), "Invalid price")
    .refine((v) => Number.isInteger(v * 100), "Max 2 decimal places"),
  categoryIds: z.array(z.number()).nonempty("Select at least one category"),
});
